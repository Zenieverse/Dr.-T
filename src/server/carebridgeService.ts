// ============================================================================
// DR. T — CAREBRIDGE EXPRESS SERVER ROUTES (/api/carebridge/*)
// Provides permission-aware Jira Service Management, Confluence knowledge,
// readiness diagnostics, post-submission follow-up consent/approval workflow,
// privacy-preserving server audit trail, and consent-gated Gemini AI assist.
// ============================================================================

import { Express, Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import {
  checkRateLimit,
  HttpAuthError,
  RateLimitError,
  sanitizeText,
  verifyFirebaseIdToken,
} from './populationHealthAuth';
import {
  CareBridgeAiConsentError,
  CareBridgeAiUnavailableError,
  CAREBRIDGE_GEMINI_MODEL,
  runCareBridgeAiAssist,
} from './carebridgeAiService';
import {
  CareBridgeBoundaryError,
  createJsmFollowUpRequestConfirmed,
  executeJsmFollowUpActionConfirmed,
  fetchJiraIssueTransitionsReadOnly,
  fetchJsmRequestByKey,
  fetchJsmRequests,
  fetchJsmServiceDesks,
  resolveCareBridgeAtlassianConnection,
  sanitizeCareBridgeErrorText,
  searchConfluenceCareKnowledge,
  verifyCareBridgeAtlassianConnection,
} from './carebridgeAtlassianService';
import {
  CAREBRIDGE_FOLLOWUP_CONSENT_DISCLOSURE,
  CAREBRIDGE_FOLLOWUP_POLICY_VERSION,
  CareBridgeFollowUpAuthError,
  CareBridgeFollowupStore,
  defaultCareBridgeFollowupStore,
} from './carebridgeFollowupStore';
import {
  CareBridgeFollowUpActionPreview,
  CareBridgeFollowUpActionResult,
  CareBridgeFollowUpActionType,
  CareBridgeFollowUpStatusResult,
  CareBridgeFollowUpUiState,
} from '../types/carebridgeTypes';
import { scanAndRedactCareBridgePhi } from '../utils/carebridgePhiGuard';

export interface CareBridgeRoutesOptions {
  authVerifier?: (token: string) => Promise<{ sub: string }>;
  store?: CareBridgeFollowupStore;
  fetchImpl?: typeof fetch;
}

async function resolveOptionalUid(
  req: Request,
  authVerifier: (token: string) => Promise<{ sub: string }> = verifyFirebaseIdToken
): Promise<{
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
  const claims = await authVerifier(token);
  if (!claims?.sub) {
    throw new HttpAuthError(401, 'Invalid authentication token claims.');
  }
  return { uid: claims.sub, authMode: 'verified_firebase' };
}

async function requireAuthenticatedUid(
  req: Request,
  authVerifier: (token: string) => Promise<{ sub: string }> = verifyFirebaseIdToken
): Promise<string> {
  const auth = await resolveOptionalUid(req, authVerifier);
  if (!auth.uid) {
    throw new HttpAuthError(
      401,
      'Authenticated Dr. T session (Bearer token) is required for CareBridge follow-up, consent, and audit endpoints.'
    );
  }
  return auth.uid;
}

function sanitizeCareError(raw: string): string {
  return sanitizeCareBridgeErrorText(raw);
}

function sendCareBridgeError(res: Response, err: unknown, extra?: Record<string, unknown>) {
  if (
    err instanceof HttpAuthError ||
    err instanceof CareBridgeAiConsentError ||
    err instanceof CareBridgeAiUnavailableError ||
    err instanceof CareBridgeBoundaryError ||
    err instanceof CareBridgeFollowUpAuthError
  ) {
    return res.status(err.statusCode).json({
      error: sanitizeCareError(err.message),
      code: err.code,
      ...(extra || {}),
    });
  }
  if (err instanceof RateLimitError) {
    return res.status(429).json({
      error: sanitizeCareError(err.message),
      code: 'RATE_LIMITED',
      ...(extra || {}),
    });
  }
  const msg = err instanceof Error ? sanitizeCareError(err.message) : 'Internal CareBridge server error';
  return res.status(500).json({ error: msg, code: 'INTERNAL_ERROR', ...(extra || {}) });
}

function mapFollowUpUiStateFromError(err: unknown): CareBridgeFollowUpUiState {
  if (err instanceof CareBridgeFollowUpAuthError) {
    if (err.code === 'FOLLOWUP_CONSENT_REQUIRED') return 'Consent required';
    if (err.statusCode === 404) return 'Request not found';
    return 'Follow-up blocked';
  }
  if (err instanceof CareBridgeBoundaryError) {
    if (err.statusCode === 404 || err.code === 'JSM_REQUEST_NOT_FOUND') return 'Request not found';
    if (err.code === 'FOLLOWUP_CONSENT_REQUIRED') return 'Consent required';
    if (err.statusCode === 401 || err.statusCode === 403) return 'Follow-up blocked';
    return 'Verification unavailable';
  }
  if (err instanceof HttpAuthError) {
    return 'Follow-up blocked';
  }
  return 'Verification unavailable';
}

function isValidFollowUpActionType(val: unknown): val is CareBridgeFollowUpActionType {
  return val === 'comment' || val === 'transition' || val === 'field_update' || val === 'notification';
}

export function registerCareBridgeRoutes(
  app: Express,
  getGemini: () => GoogleGenAI | null,
  options?: CareBridgeRoutesOptions
): void {
  const authVerifier = options?.authVerifier || verifyFirebaseIdToken;
  const store = options?.store || defaultCareBridgeFollowupStore;
  const fetchImpl = options?.fetchImpl;

  // 1. Honest integration & AI capability readiness check
  app.get('/api/carebridge/status', async (req: Request, res: Response) => {
    try {
      const auth = await resolveOptionalUid(req, authVerifier);
      const defaultSiteUrl = 'https://zenieverse.atlassian.net';
      const defaultServiceDeskId = (process.env.CAREBRIDGE_DEFAULT_SERVICE_DESK_ID || '2').trim() || '2';
      const defaultRequestTypeId = (process.env.CAREBRIDGE_DEFAULT_REQUEST_TYPE_ID || '5').trim() || '5';

      let cfgMode: 'live_env' | 'oauth_bearer' | 'disconnected' = 'disconnected';
      let resolvedSite = defaultSiteUrl;
      let accountLabel: string | null = null;
      let configError: string | null = null;

      try {
        const cfg = resolveCareBridgeAtlassianConnection({
          oauthBearerToken:
            typeof req.headers['x-atlassian-access-token'] === 'string'
              ? req.headers['x-atlassian-access-token']
              : undefined,
          oauthCloudId:
            typeof req.headers['x-atlassian-cloud-id'] === 'string'
              ? req.headers['x-atlassian-cloud-id']
              : undefined,
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
        followUpPolicyVersion: CAREBRIDGE_FOLLOWUP_POLICY_VERSION,
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
          humanApprovalRequiredForWrites: true,
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
      const auth = await resolveOptionalUid(req, authVerifier);
      const ipKey = auth.uid || req.ip || 'anon';
      checkRateLimit(`carebridge-verify:${ipKey}`, 20, 60_000);

      const report = await verifyCareBridgeAtlassianConnection({
        oauthBearerToken:
          typeof req.headers['x-atlassian-access-token'] === 'string'
            ? req.headers['x-atlassian-access-token']
            : undefined,
        oauthCloudId:
          typeof req.headers['x-atlassian-cloud-id'] === 'string'
            ? req.headers['x-atlassian-cloud-id']
            : undefined,
        siteUrlHint: typeof req.query.siteUrl === 'string' ? req.query.siteUrl : undefined,
        expectedSiteUrl: 'https://zenieverse.atlassian.net',
        expectedServiceDeskId: (process.env.CAREBRIDGE_DEFAULT_SERVICE_DESK_ID || '2').trim() || '2',
        expectedProjectKey: 'CR2',
        expectedProjectName: 'CareBridge2',
        expectedRequestTypeId: (process.env.CAREBRIDGE_DEFAULT_REQUEST_TYPE_ID || '5').trim() || '5',
        expectedRequestTypeName: 'Submit a request or incident',
        fetchImpl,
      });
      return res.json(report);
    } catch (err) {
      return sendCareBridgeError(res, err);
    }
  });

  // 2. Authorized Jira Service Management service desks & request types
  app.get('/api/carebridge/atlassian/jsm/desks', async (req: Request, res: Response) => {
    try {
      const auth = await resolveOptionalUid(req, authVerifier);
      checkRateLimit(`carebridge-jsm-read:${auth.uid || req.ip || 'anon'}`, 30, 60_000);
      const cfg = resolveCareBridgeAtlassianConnection({
        oauthBearerToken:
          typeof req.headers['x-atlassian-access-token'] === 'string'
            ? req.headers['x-atlassian-access-token']
            : undefined,
        oauthCloudId:
          typeof req.headers['x-atlassian-cloud-id'] === 'string'
            ? req.headers['x-atlassian-cloud-id']
            : undefined,
        siteUrlHint: typeof req.query.siteUrl === 'string' ? req.query.siteUrl : undefined,
      });
      const desks = await fetchJsmServiceDesks({ config: cfg, fetchImpl });
      return res.json({ connected: true, desks, source: cfg.mode, siteUrl: cfg.siteUrl });
    } catch (err) {
      return sendCareBridgeError(res, err);
    }
  });

  // 3. Authorized JSM requests list
  app.get('/api/carebridge/atlassian/jsm/requests', async (req: Request, res: Response) => {
    try {
      const auth = await resolveOptionalUid(req, authVerifier);
      checkRateLimit(`carebridge-jsm-read:${auth.uid || req.ip || 'anon'}`, 30, 60_000);
      const cfg = resolveCareBridgeAtlassianConnection({
        oauthBearerToken:
          typeof req.headers['x-atlassian-access-token'] === 'string'
            ? req.headers['x-atlassian-access-token']
            : undefined,
        oauthCloudId:
          typeof req.headers['x-atlassian-cloud-id'] === 'string'
            ? req.headers['x-atlassian-cloud-id']
            : undefined,
        siteUrlHint: typeof req.query.siteUrl === 'string' ? req.query.siteUrl : undefined,
      });
      const requests = await fetchJsmRequests({
        config: cfg,
        serviceDeskId: typeof req.query.serviceDeskId === 'string' ? req.query.serviceDeskId : undefined,
        fetchImpl,
      });
      return res.json({ connected: true, requests, source: cfg.mode, siteUrl: cfg.siteUrl });
    } catch (err) {
      return sendCareBridgeError(res, err);
    }
  });

  // 4. Single JSM request status & details lookup (read-only)
  app.get('/api/carebridge/atlassian/jsm/requests/:issueKey', async (req: Request, res: Response) => {
    try {
      const auth = await resolveOptionalUid(req, authVerifier);
      checkRateLimit(`carebridge-jsm-read:${auth.uid || req.ip || 'anon'}`, 30, 60_000);
      const cfg = resolveCareBridgeAtlassianConnection({
        oauthBearerToken:
          typeof req.headers['x-atlassian-access-token'] === 'string'
            ? req.headers['x-atlassian-access-token']
            : undefined,
        oauthCloudId:
          typeof req.headers['x-atlassian-cloud-id'] === 'string'
            ? req.headers['x-atlassian-cloud-id']
            : undefined,
        siteUrlHint: typeof req.query.siteUrl === 'string' ? req.query.siteUrl : undefined,
      });
      const requestItem = await fetchJsmRequestByKey({
        config: cfg,
        issueKey: String(req.params.issueKey || ''),
        fetchImpl,
      });
      return res.json({ request: requestItem, source: cfg.mode });
    } catch (err) {
      return sendCareBridgeError(res, err);
    }
  });

  // 5. User-confirmed, data-minimized JSM follow-up request creation
  app.post('/api/carebridge/atlassian/jsm/request', async (req: Request, res: Response) => {
    try {
      const auth = await resolveOptionalUid(req, authVerifier);
      if (!auth.uid && process.env.DRT_RUNTIME_ENV === 'production') {
        throw new HttpAuthError(401, 'Verified Dr. T authentication is required in production.');
      }
      checkRateLimit(`carebridge-jsm-write:${auth.uid || req.ip || 'anon'}`, 10, 60_000);
      const body = req.body || {};
      const cfg = resolveCareBridgeAtlassianConnection({
        oauthBearerToken:
          typeof req.headers['x-atlassian-access-token'] === 'string'
            ? req.headers['x-atlassian-access-token']
            : undefined,
        oauthCloudId:
          typeof req.headers['x-atlassian-cloud-id'] === 'string'
            ? req.headers['x-atlassian-cloud-id']
            : undefined,
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
        fetchImpl,
      });
      if (auth.uid && created.issueKey) {
        store.recordVerifiedStatus(auth.uid, created.issueKey, created.status, new Date().toISOString());
      }
      return res.status(201).json({ request: created });
    } catch (err) {
      return sendCareBridgeError(res, err);
    }
  });

  // 6. Permission-aware Confluence Clinical Knowledge query
  app.get('/api/carebridge/atlassian/confluence/pages', async (req: Request, res: Response) => {
    try {
      await resolveOptionalUid(req, authVerifier);
      const cfg = resolveCareBridgeAtlassianConnection({
        oauthBearerToken:
          typeof req.headers['x-atlassian-access-token'] === 'string'
            ? req.headers['x-atlassian-access-token']
            : undefined,
        oauthCloudId:
          typeof req.headers['x-atlassian-cloud-id'] === 'string'
            ? req.headers['x-atlassian-cloud-id']
            : undefined,
        siteUrlHint: typeof req.query.siteUrl === 'string' ? req.query.siteUrl : undefined,
      });
      const consentGranted =
        String(req.query.consentGranted || '') === 'true' || String(req.query.consent || '') === 'true';
      const pages = await searchConfluenceCareKnowledge({
        config: cfg,
        queryText: typeof req.query.q === 'string' ? req.query.q : undefined,
        confluenceReadConsent: consentGranted,
        fetchImpl,
      });
      return res.json({ connected: true, pages, source: cfg.mode, siteUrl: cfg.siteUrl });
    } catch (err) {
      return sendCareBridgeError(res, err);
    }
  });

  // 7. Consent-gated Gemini assist for Knowledge Summaries, Re-entry Briefs & Rovo Assistant preview
  app.post('/api/carebridge/ai/assist', async (req: Request, res: Response) => {
    try {
      const auth = await resolveOptionalUid(req, authVerifier);
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

  // ==========================================================================
  // POST-SUBMISSION FOLLOW-UP, EXPLICIT CONSENT, PHI GUARD & AUDIT ENDPOINTS
  // Strictly authenticated & server-enforced.
  // ==========================================================================

  // 8. Server-side Jira Service Management Follow-Up Consent state
  app.get('/api/carebridge/consent/followup', async (req: Request, res: Response) => {
    try {
      const uid = await requireAuthenticatedUid(req, authVerifier);
      const consent = store.getConsentState(uid);
      return res.json({
        consent,
        policyVersion: CAREBRIDGE_FOLLOWUP_POLICY_VERSION,
        disclosureText: CAREBRIDGE_FOLLOWUP_CONSENT_DISCLOSURE,
      });
    } catch (err) {
      return sendCareBridgeError(res, err);
    }
  });

  app.post('/api/carebridge/consent/followup', async (req: Request, res: Response) => {
    try {
      const uid = await requireAuthenticatedUid(req, authVerifier);
      checkRateLimit(`carebridge-followup-consent:${uid}`, 30, 60_000);
      const body = req.body || {};
      const correlationId = store.newCorrelationId();
      const action =
        body.action === 'withdraw' || body.granted === false
          ? 'withdraw'
          : body.action === 'grant' || body.granted === true
            ? 'grant'
            : null;

      if (!action) {
        throw new CareBridgeFollowUpAuthError(
          400,
          'INVALID_CONSENT_ACTION',
          'Specify action "grant" (or granted: true) or "withdraw" (or granted: false).'
        );
      }

      const consent =
        action === 'grant'
          ? store.grantConsent({
              userId: uid,
              ttlHours: typeof body.ttlHours === 'number' ? body.ttlHours : undefined,
              correlationId,
            })
          : store.withdrawConsent({
              userId: uid,
              correlationId,
            });

      return res.json({
        consent,
        policyVersion: CAREBRIDGE_FOLLOWUP_POLICY_VERSION,
        disclosureText: CAREBRIDGE_FOLLOWUP_CONSENT_DISCLOSURE,
        correlationId,
      });
    } catch (err) {
      return sendCareBridgeError(res, err);
    }
  });

  // 9. Read-only post-submission follow-up status check & transition discovery
  app.get('/api/carebridge/followup/requests/:issueKey', async (req: Request, res: Response) => {
    const correlationId = store.newCorrelationId();
    let uid = '';
    const issueKey = String(req.params.issueKey || '').trim().toUpperCase();
    try {
      uid = await requireAuthenticatedUid(req, authVerifier);
      checkRateLimit(`carebridge-followup-read:${uid}`, 30, 60_000);

      const consent = store.assertActiveFollowUpConsent(uid, issueKey, correlationId);
      if (!/^[A-Z0-9_]{1,12}-\d{1,10}$/.test(issueKey)) {
        throw new CareBridgeFollowUpAuthError(400, 'INVALID_ISSUE_KEY', `Invalid JSM request key "${issueKey}".`);
      }

      const cfg = resolveCareBridgeAtlassianConnection({
        oauthBearerToken:
          typeof req.headers['x-atlassian-access-token'] === 'string'
            ? req.headers['x-atlassian-access-token']
            : undefined,
        oauthCloudId:
          typeof req.headers['x-atlassian-cloud-id'] === 'string'
            ? req.headers['x-atlassian-cloud-id']
            : undefined,
        siteUrlHint: typeof req.query.siteUrl === 'string' ? req.query.siteUrl : undefined,
      });

      const previous = store.getPreviousStatus(uid, issueKey);
      const reqItem = await fetchJsmRequestByKey({
        config: cfg,
        issueKey,
        fetchImpl,
      });
      const availableTransitions = await fetchJiraIssueTransitionsReadOnly({
        config: cfg,
        issueKey,
        fetchImpl,
      });

      const checkedAt = new Date().toISOString();
      store.recordVerifiedStatus(uid, reqItem.issueKey, reqItem.status, checkedAt);

      const previousStatus = previous?.status;
      const statusChanged = Boolean(previousStatus && previousStatus !== reqItem.status);

      store.appendAuditEvent({
        userId: uid,
        requestKey: reqItem.issueKey,
        operationType: 'followup_status_retrieved',
        outcome: 'allowed',
        correlationId,
        policyVersion: consent.policyVersion,
        summary: `Retrieved live status "${reqItem.status}" for ${reqItem.issueKey}${
          previousStatus ? ` (previous: "${previousStatus}", changed: ${statusChanged})` : ''
        }.`,
      });

      const result: CareBridgeFollowUpStatusResult = {
        uiState: 'Follow-up available',
        requestKey: reqItem.issueKey,
        destinationProjectKey: reqItem.issueKey.split('-')[0] || 'CR2',
        destinationProjectName: 'CareBridge2',
        serviceDeskId: reqItem.serviceDeskId || '2',
        requestTypeId: reqItem.requestTypeId || '5',
        requestTypeName: 'Submit a request or incident',
        summary: reqItem.summary,
        lastVerifiedStatus: reqItem.status,
        previousVerifiedStatus: previousStatus,
        statusChanged,
        lastCheckedAt: checkedAt,
        consentActive: true,
        policyVersion: consent.policyVersion,
        requestUrl: reqItem.requestUrl,
        availableActions: [
          {
            type: 'comment',
            label: 'Add Administrative Follow-Up Comment',
            requiresHumanApproval: true,
            enabled: true,
          },
          {
            type: 'transition',
            label: 'Request Workflow Status Transition',
            requiresHumanApproval: true,
            enabled: availableTransitions.length > 0,
          },
          {
            type: 'field_update',
            label: 'Update Administrative Summary Field',
            requiresHumanApproval: true,
            enabled: true,
          },
          {
            type: 'notification',
            label: 'Send Public Follow-Up Notification',
            requiresHumanApproval: true,
            enabled: true,
          },
        ],
        availableTransitions,
        correlationId,
      };

      return res.json(result);
    } catch (err) {
      const uiState = mapFollowUpUiStateFromError(err);
      if (uid && !(err instanceof CareBridgeFollowUpAuthError && err.code === 'FOLLOWUP_CONSENT_REQUIRED')) {
        store.appendAuditEvent({
          userId: uid,
          requestKey: issueKey || undefined,
          operationType: 'followup_status_retrieved',
          outcome: uiState === 'Follow-up blocked' ? 'blocked' : 'error',
          correlationId,
          summary: `Follow-up status check failed (${uiState}): ${sanitizeCareError(
            err instanceof Error ? err.message : 'Unknown error'
          )}`,
        });
      }
      return sendCareBridgeError(res, err, {
        uiState,
        requestKey: issueKey,
        policyVersion: CAREBRIDGE_FOLLOWUP_POLICY_VERSION,
        correlationId,
      });
    }
  });

  // 10. Step 1 of human-controlled action: server PHI scan + exact payload preview (NO Atlassian write)
  app.post('/api/carebridge/followup/actions/preview', async (req: Request, res: Response) => {
    const correlationId = store.newCorrelationId();
    let uid = '';
    let cleanKey = '';
    try {
      uid = await requireAuthenticatedUid(req, authVerifier);
      checkRateLimit(`carebridge-followup-preview:${uid}`, 30, 60_000);

      const body = req.body || {};
      cleanKey = String(body.requestKey || '').trim().toUpperCase();
      const actionType = body.actionType;

      const consent = store.assertActiveFollowUpConsent(uid, cleanKey, correlationId);
      store.assertRequestAuthorizedForUser(uid, cleanKey);

      if (!isValidFollowUpActionType(actionType)) {
        throw new CareBridgeFollowUpAuthError(
          400,
          'INVALID_ACTION_TYPE',
          'Action type must be one of: comment, transition, field_update, notification.'
        );
      }

      const rawBodyText = typeof body.bodyText === 'string' ? sanitizeText(body.bodyText, 800) : '';
      const rawSummaryUpdate =
        typeof body.summaryUpdate === 'string' ? sanitizeText(body.summaryUpdate, 160) : '';
      const transitionId = typeof body.transitionId === 'string' ? body.transitionId.trim() : '';

      let proposedPayload: Record<string, unknown>;
      let textToScan = '';

      if (actionType === 'comment' || actionType === 'notification') {
        if (!rawBodyText) {
          throw new CareBridgeFollowUpAuthError(
            400,
            'INVALID_COMMENT_BODY',
            'Administrative follow-up message text is required before previewing.'
          );
        }
        textToScan = rawBodyText;
        proposedPayload = {
          endpoint: `/rest/servicedeskapi/request/${cleanKey}/comment`,
          method: 'POST',
          body: rawBodyText,
          public: actionType === 'notification',
        };
      } else if (actionType === 'transition') {
        if (!/^\d{1,12}$/.test(transitionId)) {
          throw new CareBridgeFollowUpAuthError(
            400,
            'INVALID_TRANSITION_ID',
            'Valid numeric workflow transition ID is required before previewing.'
          );
        }
        textToScan = '';
        proposedPayload = {
          endpoint: `/rest/api/3/issue/${cleanKey}/transitions`,
          method: 'POST',
          transition: { id: transitionId },
        };
      } else {
        if (!rawSummaryUpdate) {
          throw new CareBridgeFollowUpAuthError(
            400,
            'INVALID_FIELD_UPDATE',
            'Updated administrative summary text is required before previewing.'
          );
        }
        textToScan = rawSummaryUpdate;
        proposedPayload = {
          endpoint: `/rest/api/3/issue/${cleanKey}`,
          method: 'PUT',
          fields: { summary: rawSummaryUpdate },
        };
      }

      const phiScan = scanAndRedactCareBridgePhi(textToScan);
      if (!phiScan.safe) {
        store.appendAuditEvent({
          userId: uid,
          requestKey: cleanKey,
          operationType: 'phi_scan_blocked',
          outcome: 'blocked',
          correlationId,
          policyVersion: consent.policyVersion,
          summary: `Blocked ${actionType} preview for ${cleanKey}: detected sensitive category (${phiScan.categories.join(', ')}).`,
        });
        return res.status(403).json({
          error: `CareBridge PHI Guard blocked sensitive details (${phiScan.warnings.join('; ')}). Redact PHI and clinical values before continuing.`,
          code: 'PHI_MINIMIZATION_BLOCKED',
          correlationId,
          phiScan: {
            safe: false,
            warnings: phiScan.warnings,
            categories: phiScan.categories,
            matchCount: phiScan.matchCount,
            redactedSuggestion: phiScan.redactedText,
          },
        });
      }

      store.appendAuditEvent({
        userId: uid,
        requestKey: cleanKey,
        operationType: 'phi_scan_passed',
        outcome: 'allowed',
        correlationId,
        policyVersion: consent.policyVersion,
        summary: `PHI scan passed (${actionType}) for ${cleanKey}.`,
      });

      const now = Date.now();
      const preview: CareBridgeFollowUpActionPreview = {
        previewId: `cb-prev-${now.toString(36)}-${correlationId.slice(-6)}`,
        requestKey: cleanKey,
        actionType,
        destinationProjectKey: cleanKey.split('-')[0] || 'CR2',
        policyVersion: consent.policyVersion,
        correlationId,
        phiScan: {
          safe: true,
          warnings: [],
          categories: [],
          matchCount: 0,
        },
        proposedPayload,
        requiresHumanApproval: true,
        createdAt: new Date(now).toISOString(),
        expiresAt: new Date(now + 10 * 60_000).toISOString(),
      };

      store.saveActionPreview(uid, preview);
      store.appendAuditEvent({
        userId: uid,
        requestKey: cleanKey,
        operationType: 'proposed_action_previewed',
        outcome: 'allowed',
        correlationId,
        policyVersion: consent.policyVersion,
        summary: `Prepared single-use action preview (${actionType}) for ${cleanKey}; awaiting explicit human approval.`,
      });

      return res.json({ preview });
    } catch (err) {
      return sendCareBridgeError(res, err, { correlationId, requestKey: cleanKey || undefined });
    }
  });

  // 11. Step 2 of human-controlled action: requires humanApproved=true, valid preview, active consent, idempotency
  app.post('/api/carebridge/followup/actions/execute', async (req: Request, res: Response) => {
    const correlationId = store.newCorrelationId();
    let uid = '';
    let cleanKey = '';
    try {
      uid = await requireAuthenticatedUid(req, authVerifier);
      checkRateLimit(`carebridge-followup-exec:${uid}`, 15, 60_000);

      const body = req.body || {};
      cleanKey = String(body.requestKey || '').trim().toUpperCase();
      const actionType = body.actionType;
      const previewId = String(body.previewId || '').trim();
      const idempotencyKey =
        typeof body.idempotencyKey === 'string' && body.idempotencyKey.trim()
          ? body.idempotencyKey.trim().slice(0, 80)
          : previewId;

      if (!isValidFollowUpActionType(actionType)) {
        throw new CareBridgeFollowUpAuthError(400, 'INVALID_ACTION_TYPE', 'Invalid follow-up action type.');
      }

      const consent = store.assertActiveFollowUpConsent(uid, cleanKey, correlationId);
      store.assertRequestAuthorizedForUser(uid, cleanKey);

      const cachedIdempotent = store.getIdempotentResult(uid, idempotencyKey);
      if (cachedIdempotent) {
        return res.json({
          result: {
            ...cachedIdempotent,
            duplicatePrevented: true,
          },
        });
      }

      if (body.humanApproved !== true) {
        store.appendAuditEvent({
          userId: uid,
          requestKey: cleanKey,
          operationType: 'human_approval_rejected',
          outcome: 'blocked',
          correlationId,
          policyVersion: consent.policyVersion,
          summary: `Blocked ${actionType} execution on ${cleanKey}: explicit human approval was missing or false.`,
        });
        throw new CareBridgeFollowUpAuthError(
          400,
          'HUMAN_APPROVAL_REQUIRED',
          'Explicit human approval (humanApproved: true) is required before submitting any state-changing follow-up action.'
        );
      }

      const preview = store.consumeApprovedPreview({
        userId: uid,
        previewId,
        requestKey: cleanKey,
        actionType,
      });

      const bodyText = typeof body.bodyText === 'string' ? sanitizeText(body.bodyText, 800) : '';
      const summaryUpdate =
        typeof body.summaryUpdate === 'string' ? sanitizeText(body.summaryUpdate, 160) : '';
      const transitionId = typeof body.transitionId === 'string' ? body.transitionId.trim() : '';

      // Enforce exact match between previewed payload and execution payload
      if ((actionType === 'comment' || actionType === 'notification') && bodyText !== preview.proposedPayload.body) {
        throw new CareBridgeFollowUpAuthError(
          400,
          'PREVIEW_MISMATCH',
          'Submitted message text differs from the approved preview.'
        );
      }
      if (
        actionType === 'transition' &&
        transitionId !== String((preview.proposedPayload.transition as { id?: string } | undefined)?.id || '')
      ) {
        throw new CareBridgeFollowUpAuthError(
          400,
          'PREVIEW_MISMATCH',
          'Submitted transition ID differs from the approved preview.'
        );
      }
      if (
        actionType === 'field_update' &&
        summaryUpdate !== String((preview.proposedPayload.fields as { summary?: string } | undefined)?.summary || '')
      ) {
        throw new CareBridgeFollowUpAuthError(
          400,
          'PREVIEW_MISMATCH',
          'Submitted summary text differs from the approved preview.'
        );
      }

      store.appendAuditEvent({
        userId: uid,
        requestKey: cleanKey,
        operationType: 'human_approval_granted',
        outcome: 'allowed',
        correlationId,
        policyVersion: consent.policyVersion,
        summary: `Authorized user approved ${actionType} on ${cleanKey} (preview ${preview.previewId}).`,
      });

      const cfg = resolveCareBridgeAtlassianConnection({
        oauthBearerToken:
          typeof req.headers['x-atlassian-access-token'] === 'string'
            ? req.headers['x-atlassian-access-token']
            : undefined,
        oauthCloudId:
          typeof req.headers['x-atlassian-cloud-id'] === 'string'
            ? req.headers['x-atlassian-cloud-id']
            : undefined,
        siteUrlHint: typeof body.siteUrl === 'string' ? body.siteUrl : undefined,
      });

      store.appendAuditEvent({
        userId: uid,
        requestKey: cleanKey,
        operationType: 'operation_submitted',
        outcome: 'allowed',
        correlationId,
        policyVersion: consent.policyVersion,
        summary: `Submitted human-approved ${actionType} to Atlassian for ${cleanKey}.`,
      });

      try {
        const execOut = await executeJsmFollowUpActionConfirmed({
          config: cfg,
          issueKey: cleanKey,
          actionType,
          bodyText,
          transitionId,
          summaryUpdate,
          jsmFollowUpConsentGranted: true,
          humanApproved: true,
          fetchImpl,
        });

        const completedAt = new Date().toISOString();
        if (execOut.currentStatus) {
          store.recordVerifiedStatus(uid, cleanKey, execOut.currentStatus, completedAt);
        }

        store.appendAuditEvent({
          userId: uid,
          requestKey: cleanKey,
          operationType: 'operation_succeeded',
          outcome: 'allowed',
          correlationId,
          policyVersion: consent.policyVersion,
          summary: `Completed ${actionType} on ${cleanKey} (verified: ${execOut.verifiedAfterExecution}, status: ${
            execOut.currentStatus || 'unknown'
          }).`,
        });

        const result: CareBridgeFollowUpActionResult = {
          requestKey: cleanKey,
          actionType,
          executed: true,
          duplicatePrevented: false,
          verifiedAfterExecution: execOut.verifiedAfterExecution,
          currentStatus: execOut.currentStatus,
          requestUrl: execOut.requestUrl,
          correlationId,
          policyVersion: consent.policyVersion,
          message: `Completed ${actionType} on ${cleanKey}${
            execOut.verifiedAfterExecution ? ` and verified status (${execOut.currentStatus}).` : '.'
          }`,
          completedAt,
        };
        store.saveIdempotentResult(uid, idempotencyKey, result);
        return res.json({ result });
      } catch (execErr) {
        store.appendAuditEvent({
          userId: uid,
          requestKey: cleanKey,
          operationType: 'operation_failed',
          outcome: 'error',
          correlationId,
          policyVersion: consent.policyVersion,
          summary: `Failed ${actionType} on ${cleanKey}: ${sanitizeCareError(
            execErr instanceof Error ? execErr.message : 'Upstream error'
          )}`,
        });
        throw execErr;
      }
    } catch (err) {
      return sendCareBridgeError(res, err, { correlationId, requestKey: cleanKey || undefined });
    }
  });

  // 12. Optional sanitized AI follow-up summary / draft message (NEVER writes autonomously)
  app.post('/api/carebridge/followup/ai-summary', async (req: Request, res: Response) => {
    const correlationId = store.newCorrelationId();
    try {
      const uid = await requireAuthenticatedUid(req, authVerifier);
      checkRateLimit(`carebridge-followup-ai:${uid}`, 20, 60_000);

      const body = req.body || {};
      const requestKey = String(body.requestKey || 'CR2-1').trim().toUpperCase();
      const consent = store.assertActiveFollowUpConsent(uid, requestKey, correlationId);
      const currentStatus = sanitizeText(body.currentStatus, 60) || 'Unknown';
      const sanitizedSummary = scanAndRedactCareBridgePhi(sanitizeText(body.summary, 240)).redactedText;

      const geminiConsent = Boolean(body.geminiConsentGranted);
      const geminiClient = getGemini();

      if (geminiConsent && geminiClient) {
        try {
          const aiOut = await runCareBridgeAiAssist(
            {
              actionType: 'followup_status_summary',
              prompt: sanitizeText(
                body.prompt ||
                  `Summarize the current administrative status (${currentStatus}) for JSM request ${requestKey} ("${sanitizedSummary}"), list any missing admin details, and draft a concise human-reviewed administrative follow-up note.`,
                800
              ),
              geminiConsentGranted: true,
              rovoConsentGranted: true,
              navigationContext: `JSM Follow-Up ${requestKey} (CR2)`,
              tasks: Array.isArray(body.tasks) ? body.tasks : [],
              knowledgePages: [],
            },
            geminiClient
          );

          store.appendAuditEvent({
            userId: uid,
            requestKey,
            operationType: 'ai_summary_drafted',
            outcome: 'allowed',
            correlationId,
            policyVersion: consent.policyVersion,
            summary: `Generated sanitized Gemini follow-up draft for ${requestKey} (requires human review).`,
          });

          return res.json({
            draft: {
              requestKey,
              isDraft: true,
              requiresHumanReview: true,
              unverifiedBanner: 'AI-Generated Draft — Requires Human Review',
              nonClinicalNotice: aiOut.nonClinicalNotice,
              statusExplanation: aiOut.aiSummaryOrSuggestion,
              draftFollowUpMessage: aiOut.aiSummaryOrSuggestion,
              missingAdminInfo: aiOut.missingInformation,
              generatedBy: 'gemini',
              model: aiOut.model,
              correlationId,
            },
          });
        } catch {
          // Safe sanitized deterministic fallback below when Gemini call fails
        }
      }

      const fallbackExplanation = `JSM request ${requestKey} in CareBridge2 (CR2) is currently "${currentStatus}". Confirm whether scheduling dates or coordinator assignee details need an administrative update before sending any reply.`;
      const fallbackMessage = `Administrative follow-up check on ${requestKey}: please confirm the current coordination window and next administrative step. No patient identifiers or clinical data included.`;

      store.appendAuditEvent({
        userId: uid,
        requestKey,
        operationType: 'ai_summary_drafted',
        outcome: 'allowed',
        correlationId,
        policyVersion: consent.policyVersion,
        summary: `Prepared sanitized local follow-up draft for ${requestKey} (Gemini unavailable or consent off).`,
      });

      return res.json({
        draft: {
          requestKey,
          isDraft: true,
          requiresHumanReview: true,
          unverifiedBanner: 'AI-Generated Draft — Requires Human Review',
          nonClinicalNotice:
            'Administrative follow-up helper draft only. Never sends updates to Jira without explicit human preview and approval.',
          statusExplanation: fallbackExplanation,
          draftFollowUpMessage: fallbackMessage,
          missingAdminInfo: [
            !geminiConsent
              ? 'External Gemini synthesis consent is currently disabled; using sanitized local template draft.'
              : 'Live Gemini response unavailable; using sanitized local template draft.',
          ],
          generatedBy: 'sanitized_local_fallback',
          correlationId,
        },
      });
    } catch (err) {
      return sendCareBridgeError(res, err, { correlationId });
    }
  });

  // 13. Privacy-preserving owner-only audit retrieval
  app.get('/api/carebridge/followup/audit', async (req: Request, res: Response) => {
    try {
      const uid = await requireAuthenticatedUid(req, authVerifier);
      const requestedOwnerUid =
        typeof req.query.userId === 'string' && req.query.userId.trim()
          ? req.query.userId.trim()
          : undefined;
      const events = store.getAuditEventsForUser(uid, requestedOwnerUid);
      return res.json({
        events,
        policyVersion: CAREBRIDGE_FOLLOWUP_POLICY_VERSION,
        count: events.length,
      });
    } catch (err) {
      return sendCareBridgeError(res, err);
    }
  });

  // 14. Shared PHI detection & redaction check endpoint (never logs raw sensitive text)
  app.post('/api/carebridge/privacy/phi-scan', (req: Request, res: Response) => {
    const text = typeof req.body?.text === 'string' ? req.body.text.slice(0, 4000) : '';
    const scan = scanAndRedactCareBridgePhi(text);
    return res.json({
      safe: scan.safe,
      warnings: scan.warnings,
      categories: scan.categories,
      matchCount: scan.matchCount,
      redactedText: scan.redactedText,
    });
  });
}
