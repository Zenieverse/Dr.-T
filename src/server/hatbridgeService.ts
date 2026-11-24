// ============================================================================
// DR. T — HATBRIDGE SERVER ROUTES (/api/hatbridge/*)
// Enforces Firebase ID token verification for protected actions, privacy
// isolation, Gemini AI consent, and Atlassian Jira/Confluence proxy calls.
// ============================================================================

import { Express, Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { checkRateLimit, HttpAuthError, RateLimitError, sanitizeText, verifyFirebaseIdToken } from './populationHealthAuth';
import {
  HatBridgeAiConsentError,
  HatBridgeAiUnavailableError,
  runHatBridgeGeminiReasoning,
} from './hatbridgeAiService';
import {
  AtlassianBoundaryError,
  createJiraIssueConfirmed,
  fetchJiraWorkspaceIssues,
  resolveAtlassianConnection,
  searchConfluenceWorkspacePages,
} from './hatbridgeAtlassianService';

async function resolveOptionalAuthenticatedUid(req: Request): Promise<{
  uid: string | null;
  authMode: 'verified_firebase' | 'unauthenticated';
}> {
  const authHeader = (req.headers.authorization || '').trim();
  if (!authHeader.startsWith('Bearer ')) {
    return { uid: null, authMode: 'unauthenticated' };
  }
  const token = authHeader.slice(7).trim();
  if (!token) {
    throw new HttpAuthError(401, 'Empty Bearer token.');
  }
  const claims = await verifyFirebaseIdToken(token);
  return { uid: claims.sub, authMode: 'verified_firebase' };
}

function sanitizeErrorText(raw: string): string {
  return (raw || '')
    .replace(/Bearer\s+[A-Za-z0-9\-._~+/]+=*/gi, 'Bearer [REDACTED]')
    .replace(/Basic\s+[A-Za-z0-9+/=]+/gi, 'Basic [REDACTED]')
    .slice(0, 240);
}

function sendHatBridgeError(res: Response, err: unknown) {
  if (err instanceof HttpAuthError || err instanceof HatBridgeAiConsentError || err instanceof HatBridgeAiUnavailableError || err instanceof AtlassianBoundaryError) {
    return res.status(err.statusCode).json({ error: sanitizeErrorText(err.message), code: err.code });
  }
  if (err instanceof RateLimitError) {
    return res.status(429).json({ error: sanitizeErrorText(err.message), code: 'RATE_LIMITED' });
  }
  const msg = err instanceof Error ? sanitizeErrorText(err.message) : 'Internal HatBridge server error';
  return res.status(500).json({ error: msg, code: 'INTERNAL_ERROR' });
}

export function registerHatBridgeRoutes(app: Express, getGemini: () => GoogleGenAI | null): void {
  // 1. Honest integration & AI capability readiness check
  app.get('/api/hatbridge/status', async (req: Request, res: Response) => {
    try {
      const auth = await resolveOptionalAuthenticatedUid(req);
      const atlassianCfg = resolveAtlassianConnection({
        oauthBearerToken: typeof req.headers['x-atlassian-access-token'] === 'string' ? req.headers['x-atlassian-access-token'] : undefined,
        oauthCloudId: typeof req.headers['x-atlassian-cloud-id'] === 'string' ? req.headers['x-atlassian-cloud-id'] : undefined,
      });

      return res.json({
        module: 'hatbridge',
        authMode: auth.authMode,
        aiAvailable: Boolean(process.env.GEMINI_API_KEY),
        aiModel: 'gemini-4-hydrogen',
        atlassian: {
          mode: atlassianCfg.mode,
          connected: atlassianCfg.mode !== 'disconnected',
          siteUrl: atlassianCfg.siteUrl || null,
          accountLabel: atlassianCfg.accountLabel || null,
          forgeManifestPath: 'apps/hatbridge-forge/manifest.yml',
        },
        privacyPolicy: {
          phiAllowedInHatBridge: false,
          privatePersonalSharedWithAtlassian: false,
          aiRequiresExplicitConsent: true,
        },
        checkedAt: new Date().toISOString(),
      });
    } catch (err) {
      return sendHatBridgeError(res, err);
    }
  });

  // 2. Grounded Server-Side Gemini Continuity Reasoning
  app.post('/api/hatbridge/ai/reason', async (req: Request, res: Response) => {
    try {
      const auth = await resolveOptionalAuthenticatedUid(req);
      const ipKey = auth.uid || req.ip || 'anon';
      checkRateLimit(`hatbridge-ai:${ipKey}`, 20, 60_000);

      const body = req.body || {};
      const result = await runHatBridgeGeminiReasoning(
        {
          mode: body.mode || 'assistant_query',
          prompt: sanitizeText(body.prompt, 1200) || 'Provide a grounded continuity summary.',
          aiConsentGranted: Boolean(body.aiConsentGranted),
          allowPrivatePersonal: Boolean(body.allowPrivatePersonal),
          activeRole: body.activeRole,
          roles: Array.isArray(body.roles) ? body.roles : [],
          contextItems: Array.isArray(body.contextItems) ? body.contextItems : [],
          decisions: Array.isArray(body.decisions) ? body.decisions : [],
          handoffs: Array.isArray(body.handoffs) ? body.handoffs : [],
        },
        getGemini()
      );

      return res.json({ result });
    } catch (err) {
      return sendHatBridgeError(res, err);
    }
  });

  // 3. Authorized Jira Issues Query (never exposes demo data as live)
  app.get('/api/hatbridge/atlassian/jira/issues', async (req: Request, res: Response) => {
    try {
      await resolveOptionalAuthenticatedUid(req);
      const cfg = resolveAtlassianConnection({
        oauthBearerToken: typeof req.headers['x-atlassian-access-token'] === 'string' ? req.headers['x-atlassian-access-token'] : undefined,
        oauthCloudId: typeof req.headers['x-atlassian-cloud-id'] === 'string' ? req.headers['x-atlassian-cloud-id'] : undefined,
        siteUrlHint: typeof req.query.siteUrl === 'string' ? req.query.siteUrl : undefined,
      });

      const issues = await fetchJiraWorkspaceIssues({
        config: cfg,
        jql: typeof req.query.jql === 'string' ? req.query.jql : undefined,
      });

      return res.json({ issues, source: cfg.mode, siteUrl: cfg.siteUrl });
    } catch (err) {
      return sendHatBridgeError(res, err);
    }
  });

  // 4. User-Confirmed Jira Issue Creation from Context Capture (blocks private_personal)
  app.post('/api/hatbridge/atlassian/jira/issue', async (req: Request, res: Response) => {
    try {
      const auth = await resolveOptionalAuthenticatedUid(req);
      if (!auth.uid && process.env.DRT_RUNTIME_ENV === 'production') {
        throw new HttpAuthError(401, 'Verified Dr. T authentication required in production.');
      }

      const body = req.body || {};
      const cfg = resolveAtlassianConnection({
        oauthBearerToken: typeof req.headers['x-atlassian-access-token'] === 'string' ? req.headers['x-atlassian-access-token'] : undefined,
        oauthCloudId: typeof req.headers['x-atlassian-cloud-id'] === 'string' ? req.headers['x-atlassian-cloud-id'] : undefined,
        siteUrlHint: typeof body.siteUrl === 'string' ? body.siteUrl : undefined,
      });

      const created = await createJiraIssueConfirmed({
        config: cfg,
        projectKey: String(body.projectKey || ''),
        summary: sanitizeText(body.summary, 200),
        description: sanitizeText(body.description, 4000),
        issueType: sanitizeText(body.issueType, 40) || 'Task',
        privacyLevel: body.privacyLevel || 'work_team',
        userConfirmed: Boolean(body.userConfirmed),
      });

      return res.status(201).json({ issue: created });
    } catch (err) {
      return sendHatBridgeError(res, err);
    }
  });

  // 5. Authorized Confluence Pages Search
  app.get('/api/hatbridge/atlassian/confluence/pages', async (req: Request, res: Response) => {
    try {
      await resolveOptionalAuthenticatedUid(req);
      const cfg = resolveAtlassianConnection({
        oauthBearerToken: typeof req.headers['x-atlassian-access-token'] === 'string' ? req.headers['x-atlassian-access-token'] : undefined,
        oauthCloudId: typeof req.headers['x-atlassian-cloud-id'] === 'string' ? req.headers['x-atlassian-cloud-id'] : undefined,
        siteUrlHint: typeof req.query.siteUrl === 'string' ? req.query.siteUrl : undefined,
      });

      const pages = await searchConfluenceWorkspacePages({
        config: cfg,
        queryText: typeof req.query.q === 'string' ? req.query.q : undefined,
      });

      return res.json({ pages, source: cfg.mode, siteUrl: cfg.siteUrl });
    } catch (err) {
      return sendHatBridgeError(res, err);
    }
  });
}
