// ============================================================================
// DR. T — CAREBRIDGE EXPRESS SERVER ROUTES (/api/carebridge/*)
// Provides permission-aware Jira Service Management, Confluence knowledge,
// readiness diagnostics, and consent-gated Gemini AI assist endpoints.
// ============================================================================

import { Express, Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { checkRateLimit, HttpAuthError, RateLimitError, sanitizeText, verifyFirebaseIdToken } from './populationHealthAuth';
import {
  CareBridgeAiConsentError,
  CareBridgeAiUnavailableError,
  CAREBRIDGE_GEMINI_MODEL,
  runCareBridgeAiAssist,
} from './carebridgeAiService';
import {
  CareBridgeBoundaryError,
  createJsmFollowUpRequestConfirmed,
  fetchJsmRequestByKey,
  fetchJsmRequests,
  fetchJsmServiceDesks,
  resolveCareBridgeAtlassianConnection,
  sanitizeCareBridgeErrorText,
  searchConfluenceCareKnowledge,
  verifyCareBridgeAtlassianConnection,
} from './carebridgeAtlassianService';

async function resolveOptionalUid(req: Request): Promise<{
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

function sanitizeCareError(raw: string): string {
  return sanitizeCareBridgeErrorText(raw);
}

function sendCareBridgeError(res: Response, err: unknown) {
  if (
    err instanceof HttpAuthError ||
    err instanceof CareBridgeAiConsentError ||
    err instanceof CareBridgeAiUnavailableError ||
    err instanceof CareBridgeBoundaryError
  ) {
    return res.status(err.statusCode).json({ error: sanitizeCareError(err.message), code: err.code });
  }
  if (err instanceof RateLimitError) {
    return res.status(429).json({ error: sanitizeCareError(err.message), code: 'RATE_LIMITED' });
  }
  const msg = err instanceof Error ? sanitizeCareError(err.message) : 'Internal CareBridge server error';
  return res.status(500).json({ error: msg, code: 'INTERNAL_ERROR' });
}

export function registerCareBridgeRoutes(app: Express, getGemini: () => GoogleGenAI | null): void {
  // 1. Honest integration & AI capability readiness check
  app.get('/api/carebridge/status', async (req: Request, res: Response) => {
    try {
      const auth = await resolveOptionalUid(req);
      const defaultSiteUrl = 'https://zenieverse.atlassian.net';
      const defaultServiceDeskId = (process.env.CAREBRIDGE_DEFAULT_SERVICE_DESK_ID || '2').trim() || '2';
      const defaultRequestTypeId = (process.env.CAREBRIDGE_DEFAULT_REQUEST_TYPE_ID || '5').trim() || '5';

      let cfgMode: 'live_env' | 'oauth_bearer' | 'disconnected' = 'disconnected';
      let resolvedSite = defaultSiteUrl;
      let accountLabel: string | null = null;
      let configError: string | null = null;

      try {
        const cfg = resolveCareBridgeAtlassianConnection({
          oauthBearerToken: typeof req.headers['x-atlassian-access-token'] === 'string' ? req.headers['x-atlassian-access-token'] : undefined,
          oauthCloudId: typeof req.headers['x-atlassian-cloud-id'] === 'string' ? req.headers['x-atlassian-cloud-id'] : undefined,
        });
        cfgMode = cfg.mode;
        if (cfg.siteUrl) resolvedSite = cfg.siteUrl;
        accountLabel = cfg.accountLabel || null;
      } catch (cfgErr) {
        configError = cfgErr instanceof Error ? sanitizeCareError(cfgErr.message) : 'Atlassian site configuration invalid.';
      }

      return res.json({
        module: 'carebridge',
        authMode: auth.authMode,
        aiAvailable: Boolean(process.env.GEMINI_API_KEY),
        aiModel: CAREBRIDGE_GEMINI_MODEL,
        atlassianConfigured: cfgMode !== 'disconnected',
        connectionStatus: cfgMode !== 'disconnected' ? 'Configured (Unverified)' : 'Unavailable',
        siteUrl: resolvedSite,
        defaultSiteUrl,
        defaultServiceDeskId,
        defaultRequestTypeId,
        defaultProjectKey: 'CR2',
        defaultRequestTypeName: 'Submit a request or incident',
        safeError: configError,
        atlassian: {
          mode: cfgMode,
          connected: cfgMode !== 'disconnected',
          siteUrl: resolvedSite,
          accountLabel,
          forgeManifestPath: 'apps/carebridge-forge/manifest.yml',
        },
        safeguards: {
          nonDiagnosticOnly: true,
          phiMinimizedByDefault: true,
          aiOutputMarkedUnverified: true,
          explicitConsentRequired: true,
        },
        checkedAt: new Date().toISOString(),
      });
    } catch (err) {
      return sendCareBridgeError(res, err);
    }
  });

  // 1b. Read-only live Atlassian authentication, Service Desk 2 (CR2), Request Type 5, and permissions verification
  app.get('/api/carebridge/atlassian/verify', async (req: Request, res: Response) => {
    try {
      const auth = await resolveOptionalUid(req);
      const ipKey = auth.uid || req.ip || 'anon';
      checkRateLimit(`carebridge-verify:${ipKey}`, 20, 60_000);

      const report = await verifyCareBridgeAtlassianConnection({
        oauthBearerToken: typeof req.headers['x-atlassian-access-token'] === 'string' ? req.headers['x-atlassian-access-token'] : undefined,
        oauthCloudId: typeof req.headers['x-atlassian-cloud-id'] === 'string' ? req.headers['x-atlassian-cloud-id'] : undefined,
        siteUrlHint: typeof req.query.siteUrl === 'string' ? req.query.siteUrl : undefined,
        expectedSiteUrl: 'https://zenieverse.atlassian.net',
        expectedServiceDeskId: (process.env.CAREBRIDGE_DEFAULT_SERVICE_DESK_ID || '2').trim() || '2',
        expectedProjectKey: 'CR2',
        expectedProjectName: 'CareBridge2',
        expectedRequestTypeId: (process.env.CAREBRIDGE_DEFAULT_REQUEST_TYPE_ID || '5').trim() || '5',
        expectedRequestTypeName: 'Submit a request or incident',
      });
      return res.json(report);
    } catch (err) {
      return sendCareBridgeError(res, err);
    }
  });

  // 2. Authorized Jira Service Management service desks & request types
  app.get('/api/carebridge/atlassian/jsm/desks', async (req: Request, res: Response) => {
    try {
      const auth = await resolveOptionalUid(req);
      checkRateLimit(`carebridge-jsm-read:${auth.uid || req.ip || 'anon'}`, 30, 60_000);
      const cfg = resolveCareBridgeAtlassianConnection({
        oauthBearerToken: typeof req.headers['x-atlassian-access-token'] === 'string' ? req.headers['x-atlassian-access-token'] : undefined,
        oauthCloudId: typeof req.headers['x-atlassian-cloud-id'] === 'string' ? req.headers['x-atlassian-cloud-id'] : undefined,
        siteUrlHint: typeof req.query.siteUrl === 'string' ? req.query.siteUrl : undefined,
      });
      const desks = await fetchJsmServiceDesks({ config: cfg });
      return res.json({ connected: true, desks, source: cfg.mode, siteUrl: cfg.siteUrl });
    } catch (err) {
      return sendCareBridgeError(res, err);
    }
  });

  // 3. Authorized JSM requests list
  app.get('/api/carebridge/atlassian/jsm/requests', async (req: Request, res: Response) => {
    try {
      const auth = await resolveOptionalUid(req);
      checkRateLimit(`carebridge-jsm-read:${auth.uid || req.ip || 'anon'}`, 30, 60_000);
      const cfg = resolveCareBridgeAtlassianConnection({
        oauthBearerToken: typeof req.headers['x-atlassian-access-token'] === 'string' ? req.headers['x-atlassian-access-token'] : undefined,
        oauthCloudId: typeof req.headers['x-atlassian-cloud-id'] === 'string' ? req.headers['x-atlassian-cloud-id'] : undefined,
        siteUrlHint: typeof req.query.siteUrl === 'string' ? req.query.siteUrl : undefined,
      });
      const requests = await fetchJsmRequests({
        config: cfg,
        serviceDeskId: typeof req.query.serviceDeskId === 'string' ? req.query.serviceDeskId : undefined,
      });
      return res.json({ connected: true, requests, source: cfg.mode, siteUrl: cfg.siteUrl });
    } catch (err) {
      return sendCareBridgeError(res, err);
    }
  });

  // 4. Single JSM request status & details lookup
  app.get('/api/carebridge/atlassian/jsm/requests/:issueKey', async (req: Request, res: Response) => {
    try {
      const auth = await resolveOptionalUid(req);
      checkRateLimit(`carebridge-jsm-read:${auth.uid || req.ip || 'anon'}`, 30, 60_000);
      const cfg = resolveCareBridgeAtlassianConnection({
        oauthBearerToken: typeof req.headers['x-atlassian-access-token'] === 'string' ? req.headers['x-atlassian-access-token'] : undefined,
        oauthCloudId: typeof req.headers['x-atlassian-cloud-id'] === 'string' ? req.headers['x-atlassian-cloud-id'] : undefined,
        siteUrlHint: typeof req.query.siteUrl === 'string' ? req.query.siteUrl : undefined,
      });
      const requestItem = await fetchJsmRequestByKey({
        config: cfg,
        issueKey: String(req.params.issueKey || ''),
      });
      return res.json({ request: requestItem, source: cfg.mode });
    } catch (err) {
      return sendCareBridgeError(res, err);
    }
  });

  // 5. User-confirmed, data-minimized JSM follow-up request creation
  app.post('/api/carebridge/atlassian/jsm/request', async (req: Request, res: Response) => {
    try {
      const auth = await resolveOptionalUid(req);
      if (!auth.uid && process.env.DRT_RUNTIME_ENV === 'production') {
        throw new HttpAuthError(401, 'Verified Dr. T authentication is required in production.');
      }
      checkRateLimit(`carebridge-jsm-write:${auth.uid || req.ip || 'anon'}`, 10, 60_000);
      const body = req.body || {};
      const cfg = resolveCareBridgeAtlassianConnection({
        oauthBearerToken: typeof req.headers['x-atlassian-access-token'] === 'string' ? req.headers['x-atlassian-access-token'] : undefined,
        oauthCloudId: typeof req.headers['x-atlassian-cloud-id'] === 'string' ? req.headers['x-atlassian-cloud-id'] : undefined,
        siteUrlHint: typeof body.siteUrl === 'string' ? body.siteUrl : undefined,
      });

      const created = await createJsmFollowUpRequestConfirmed({
        config: cfg,
        serviceDeskId: String(body.serviceDeskId || process.env.CAREBRIDGE_DEFAULT_SERVICE_DESK_ID || '2'),
        requestTypeId: String(body.requestTypeId || process.env.CAREBRIDGE_DEFAULT_REQUEST_TYPE_ID || '5'),
        summary: sanitizeText(body.summary, 160),
        minimalNote: sanitizeText(body.minimalNote || body.description, 800),
        jsmConsentGranted: Boolean(body.jsmConsentGranted),
        userConfirmed: Boolean(body.userConfirmed),
        allowClinicalReferenceOverride: false,
      });
      return res.status(201).json({ request: created });
    } catch (err) {
      return sendCareBridgeError(res, err);
    }
  });

  // 6. Permission-aware Confluence Clinical Knowledge query
  app.get('/api/carebridge/atlassian/confluence/pages', async (req: Request, res: Response) => {
    try {
      await resolveOptionalUid(req);
      const cfg = resolveCareBridgeAtlassianConnection({
        oauthBearerToken: typeof req.headers['x-atlassian-access-token'] === 'string' ? req.headers['x-atlassian-access-token'] : undefined,
        oauthCloudId: typeof req.headers['x-atlassian-cloud-id'] === 'string' ? req.headers['x-atlassian-cloud-id'] : undefined,
        siteUrlHint: typeof req.query.siteUrl === 'string' ? req.query.siteUrl : undefined,
      });
      const consentGranted =
        String(req.query.consentGranted || '') === 'true' || String(req.query.consent || '') === 'true';
      const pages = await searchConfluenceCareKnowledge({
        config: cfg,
        queryText: typeof req.query.q === 'string' ? req.query.q : undefined,
        confluenceReadConsent: consentGranted,
      });
      return res.json({ connected: true, pages, source: cfg.mode, siteUrl: cfg.siteUrl });
    } catch (err) {
      return sendCareBridgeError(res, err);
    }
  });

  // 7. Consent-gated Gemini assist for Knowledge Summaries, Re-entry Briefs & Rovo Assistant preview
  app.post('/api/carebridge/ai/assist', async (req: Request, res: Response) => {
    try {
      const auth = await resolveOptionalUid(req);
      const ipKey = auth.uid || req.ip || 'anon';
      checkRateLimit(`carebridge-ai:${ipKey}`, 20, 60_000);

      const body = req.body || {};
      const result = await runCareBridgeAiAssist(
        {
          actionType: body.actionType || 'summarize-care-context',
          prompt: sanitizeText(body.prompt, 1000) || 'Prepare an administrative care-navigation summary.',
          geminiConsentGranted: Boolean(body.geminiConsentGranted),
          rovoConsentGranted: body.rovoConsentGranted === undefined ? true : Boolean(body.rovoConsentGranted),
          navigationContext: sanitizeText(body.navigationContext, 200) || 'Non-emergency care coordination',
          tasks: Array.isArray(body.tasks) ? body.tasks : [],
          knowledgePages: Array.isArray(body.knowledgePages) ? body.knowledgePages : [],
        },
        getGemini()
      );
      return res.json({ result });
    } catch (err) {
      return sendCareBridgeError(res, err);
    }
  });
}
