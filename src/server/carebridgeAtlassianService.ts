// ============================================================================
// DR. T — CAREBRIDGE SERVER-SIDE JSM & CONFLUENCE ADAPTER
// Uses official Atlassian Jira Service Management Cloud REST API & Confluence
// REST API. Enforces data minimization (no raw PHI), explicit user consent &
// confirmation, *.atlassian.net allowlist, and honest disconnected states.
// ============================================================================

import {
  CareBridgeConfluencePage,
  CareBridgeConnectionDisplayStatus,
  CareBridgeJsmRequest,
  CareBridgeJsmServiceDesk,
  CareBridgeVerificationCheckItem,
  CareBridgeVerificationReport,
} from '../types/carebridgeTypes';

export class CareBridgeBoundaryError extends Error {
  public readonly statusCode: 400 | 401 | 403 | 502 | 503;
  public readonly code: string;
  constructor(statusCode: 400 | 401 | 403 | 502 | 503, code: string, message: string) {
    super(message);
    this.name = 'CareBridgeBoundaryError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

export interface CareBridgeAtlassianConfig {
  mode: 'live_env' | 'oauth_bearer' | 'disconnected';
  siteUrl: string;
  cloudId?: string;
  headers: Record<string, string>;
  accountLabel?: string;
}

const VALID_ATLASSIAN_HOST_REGEX = /^[a-z0-9][a-z0-9-]{0,61}[a-z0-9]\.atlassian\.net$/i;
const VALID_CLOUD_ID_REGEX = /^[a-fA-F0-9-]{8,64}$/;

export function sanitizeCareBridgeErrorText(raw: string): string {
  let clean = String(raw || '');
  const envEmail = (process.env.ATLASSIAN_EMAIL || '').trim();
  const envToken = (process.env.ATLASSIAN_API_TOKEN || '').trim();
  if (envToken) {
    clean = clean.split(envToken).join('[REDACTED_TOKEN]');
  }
  if (envEmail) {
    clean = clean.split(envEmail).join('[REDACTED_EMAIL]');
  }
  return clean
    .replace(/Bearer\s+[A-Za-z0-9\-._~+/]+=*/gi, 'Bearer [REDACTED]')
    .replace(/Basic\s+[A-Za-z0-9+/=]+/gi, 'Basic [REDACTED]')
    .replace(/AIza[0-9A-Za-z_-]+/g, '[REDACTED]')
    .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, '[REDACTED_EMAIL]')
    .slice(0, 260);
}

// Detects overt sensitive clinical/PHI patterns before transmitting to JSM by default
const SENSITIVE_PHI_PATTERNS: Array<{ pattern: RegExp; reason: string }> = [
  { pattern: /\b\d{3}-\d{2}-\d{4}\b/, reason: 'SSN-formatted identifier' },
  { pattern: /\b(?:mrn|medical record(?: number)?)\s*[:#-]?\s*[a-z0-9-]{4,}/i, reason: 'Medical Record Number (MRN)' },
  { pattern: /\b(?:dob|date of birth)\s*[:#-]?\s*\d{1,4}[/-]\d{1,2}[/-]\d{1,4}/i, reason: 'Date of Birth (DOB)' },
  { pattern: /\b(?:diagnosed with|diagnosis of|prescription for|dosage|mg\/dl|hba1c\s*\d|ferritin\s*\d|bp\s*\d{2,3}\/\d{2,3})\b/i, reason: 'Clinical lab/diagnosis detail' },
];

export function validateCareBridgeSiteUrl(rawUrl?: string | null): string | null {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  let cleaned = rawUrl.trim();
  if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
    cleaned = cleaned.slice(1, -1).trim();
  }
  if (!cleaned) return null;

  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(cleaned) && /^[a-z0-9][a-z0-9-]{0,61}[a-z0-9]\.atlassian\.net(?:\/.*)?$/i.test(cleaned)) {
    cleaned = `https://${cleaned}`;
  }

  let parsed: URL;
  try {
    parsed = new URL(cleaned);
  } catch {
    throw new CareBridgeBoundaryError(
      400,
      'INVALID_ATLASSIAN_SITE_URL',
      'Atlassian site URL must use HTTPS on *.atlassian.net (e.g., https://your-clinic-team.atlassian.net).'
    );
  }

  if (
    parsed.protocol !== 'https:' ||
    Boolean(parsed.username) ||
    Boolean(parsed.password) ||
    !VALID_ATLASSIAN_HOST_REGEX.test(parsed.hostname)
  ) {
    throw new CareBridgeBoundaryError(
      400,
      'INVALID_ATLASSIAN_SITE_URL',
      'Atlassian site URL must use HTTPS on *.atlassian.net (e.g., https://your-clinic-team.atlassian.net).'
    );
  }

  return parsed.origin.toLowerCase();
}

export function resolveCareBridgeAtlassianConnection(params?: {
  oauthBearerToken?: string;
  oauthCloudId?: string;
  siteUrlHint?: string;
}): CareBridgeAtlassianConfig {
  const bearer = params?.oauthBearerToken?.trim();
  const cloudId = params?.oauthCloudId?.trim();
  if (bearer && cloudId) {
    if (!VALID_CLOUD_ID_REGEX.test(cloudId)) {
      throw new CareBridgeBoundaryError(400, 'INVALID_CLOUD_ID', 'Invalid Atlassian Cloud ID format.');
    }
    const siteUrl = params?.siteUrlHint ? validateCareBridgeSiteUrl(params.siteUrlHint) || '' : '';
    return {
      mode: 'oauth_bearer',
      siteUrl: siteUrl || `https://api.atlassian.com/ex/jira/${cloudId}`,
      cloudId,
      headers: {
        Authorization: `Bearer ${bearer}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      accountLabel: 'Atlassian OAuth Bearer Session',
    };
  }

  const envSite = (process.env.ATLASSIAN_SITE_URL || '').trim();
  const envEmail = (process.env.ATLASSIAN_EMAIL || '').trim();
  const envToken = (process.env.ATLASSIAN_API_TOKEN || '').trim();

  if (envSite && envEmail && envToken) {
    const validatedSite = validateCareBridgeSiteUrl(envSite)!;
    const basic = Buffer.from(`${envEmail}:${envToken}`).toString('base64');
    return {
      mode: 'live_env',
      siteUrl: validatedSite,
      headers: {
        Authorization: `Basic ${basic}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      accountLabel: 'Configured Atlassian Server Credential',
    };
  }

  return { mode: 'disconnected', siteUrl: '', headers: {} };
}

export function minimizePayloadForJsm(params: {
  summary: string;
  minimalNote: string;
  allowClinicalReferenceOverride?: boolean;
}): { summary: string; description: string } {
  const summary = (params.summary || '').replace(/\s+/g, ' ').trim().slice(0, 160);
  const minimalNote = (params.minimalNote || '').replace(/\s+/g, ' ').trim().slice(0, 800);

  if (!summary) {
    throw new CareBridgeBoundaryError(400, 'INVALID_SUMMARY', 'JSM follow-up request summary cannot be empty.');
  }

  if (!params.allowClinicalReferenceOverride) {
    const combined = `${summary} ${minimalNote}`;
    for (const check of SENSITIVE_PHI_PATTERNS) {
      if (check.pattern.test(combined)) {
        throw new CareBridgeBoundaryError(
          403,
          'PHI_MINIMIZATION_BLOCKED',
          `CareBridge blocked transmission containing potential sensitive health/identifying details (${check.reason}). Use minimal administrative coordination wording instead.`
        );
      }
    }
  }

  return {
    summary,
    description:
      minimalNote ||
      'Administrative non-emergency follow-up coordination request created via Dr. T — CareBridge (user-confirmed, data-minimized).',
  };
}

function resolveJsmApiBase(config: CareBridgeAtlassianConfig): string {
  return config.mode === 'oauth_bearer' && config.cloudId
    ? `https://api.atlassian.com/ex/jira/${config.cloudId}`
    : config.siteUrl;
}

function resolveConfluenceApiBase(config: CareBridgeAtlassianConfig): string {
  return config.mode === 'oauth_bearer' && config.cloudId
    ? `https://api.atlassian.com/ex/confluence/${config.cloudId}`
    : config.siteUrl;
}

function resolveWebBase(config: CareBridgeAtlassianConfig): string {
  return config.siteUrl.startsWith('https://') && config.siteUrl.includes('.atlassian.net')
    ? config.siteUrl
    : 'https://home.atlassian.com';
}

function assertApprovedAtlassianTarget(urlStr: string): URL {
  let parsed: URL;
  try {
    parsed = new URL(urlStr);
  } catch {
    throw new CareBridgeBoundaryError(400, 'INVALID_ATLASSIAN_SITE_URL', 'Malformed outbound Atlassian URL.');
  }
  const host = parsed.hostname.toLowerCase();
  const approved = VALID_ATLASSIAN_HOST_REGEX.test(host) || host === 'api.atlassian.com';
  if (parsed.protocol !== 'https:' || !approved || parsed.username || parsed.password) {
    throw new CareBridgeBoundaryError(
      400,
      'UNAPPROVED_ATLASSIAN_HOST',
      'Blocked outbound request to an unapproved host or non-HTTPS scheme.'
    );
  }
  return parsed;
}

export async function safeAtlassianFetch(
  urlStr: string,
  init: RequestInit,
  fetchImpl?: typeof fetch
): Promise<Response> {
  assertApprovedAtlassianTarget(urlStr);
  const f = fetchImpl || fetch;
  const resp = await f(urlStr, { ...init, redirect: 'manual' });
  if (resp.status >= 300 && resp.status < 400) {
    const loc = resp.headers?.get?.('location') || '';
    throw new CareBridgeBoundaryError(
      400,
      'UNAPPROVED_REDIRECT_BLOCKED',
      `Blocked HTTP ${resp.status} redirect to prevent credential forwarding${loc ? ' off-origin' : ''}.`
    );
  }
  return resp;
}

export async function fetchJsmServiceDesks(params: {
  config: CareBridgeAtlassianConfig;
  fetchImpl?: typeof fetch;
}): Promise<CareBridgeJsmServiceDesk[]> {
  const { config } = params;
  if (config.mode === 'disconnected') {
    throw new CareBridgeBoundaryError(
      401,
      'ATLASSIAN_NOT_CONNECTED',
      'No live Atlassian Jira Service Management connection is configured.'
    );
  }

  const baseUrl = resolveJsmApiBase(config);
  const desksResp = await safeAtlassianFetch(
    `${baseUrl}/rest/servicedeskapi/servicedesk?limit=15`,
    { method: 'GET', headers: config.headers },
    params.fetchImpl
  );

  if (!desksResp.ok) {
    throw new CareBridgeBoundaryError(
      desksResp.status === 401 || desksResp.status === 403 ? 403 : 502,
      'JSM_PERMISSION_OR_API_ERROR',
      `Jira Service Management Service Desk lookup returned HTTP ${desksResp.status}. Verify read:servicedesk-request permission and project access.`
    );
  }

  const desksJson = (await desksResp.json()) as { values?: any[] };
  const desks = Array.isArray(desksJson.values) ? desksJson.values : [];

  const enriched: CareBridgeJsmServiceDesk[] = [];
  for (const desk of desks.slice(0, 8)) {
    const deskId = String(desk.id || '');
    if (!/^\d{1,12}$/.test(deskId)) continue;
    let requestTypes: Array<{ id: string; name: string; description?: string }> = [];
    try {
      const rtResp = await safeAtlassianFetch(
        `${baseUrl}/rest/servicedeskapi/servicedesk/${deskId}/requesttype?limit=20`,
        { method: 'GET', headers: config.headers },
        params.fetchImpl
      );
      if (rtResp.ok) {
        const rtJson = (await rtResp.json()) as { values?: any[] };
        requestTypes = (rtJson.values || []).map((rt) => ({
          id: String(rt.id),
          name: String(rt.name || 'Follow-up Request'),
          description: rt.description ? String(rt.description).slice(0, 180) : undefined,
        }));
      }
    } catch {
      // Keep desk entry even if request type enumeration fails on one desk
    }

    enriched.push({
      id: deskId,
      projectId: String(desk.projectId || ''),
      projectKey: String(desk.projectKey || ''),
      projectName: String(desk.projectName || 'Service Desk'),
      requestTypes,
    });
  }

  return enriched;
}

export async function fetchJsmRequests(params: {
  config: CareBridgeAtlassianConfig;
  serviceDeskId?: string;
  fetchImpl?: typeof fetch;
}): Promise<CareBridgeJsmRequest[]> {
  const { config } = params;
  if (config.mode === 'disconnected') {
    throw new CareBridgeBoundaryError(
      401,
      'ATLASSIAN_NOT_CONNECTED',
      'No live Atlassian Jira Service Management connection is configured.'
    );
  }

  const baseUrl = resolveJsmApiBase(config);
  const webBase = resolveWebBase(config);
  const deskFilter =
    params.serviceDeskId && /^\d{1,12}$/.test(params.serviceDeskId.trim())
      ? `&serviceDeskId=${encodeURIComponent(params.serviceDeskId.trim())}`
      : '';

  const resp = await safeAtlassianFetch(
    `${baseUrl}/rest/servicedeskapi/request?requestOwnership=OWNED_REQUESTS&limit=25${deskFilter}`,
    { method: 'GET', headers: config.headers },
    params.fetchImpl
  );

  if (!resp.ok) {
    throw new CareBridgeBoundaryError(
      resp.status === 401 || resp.status === 403 ? 403 : 502,
      'JSM_API_ERROR',
      `Jira Service Management returned HTTP ${resp.status}.`
    );
  }

  const data = (await resp.json()) as { values?: any[] };
  return (data.values || []).map((reqItem) => {
    const issueKey = String(reqItem.issueKey || '');
    const fieldValues = Array.isArray(reqItem.requestFieldValues) ? reqItem.requestFieldValues : [];
    const summaryEntry = fieldValues.find((fv: any) => fv.fieldId === 'summary');
    const summaryText = summaryEntry?.value ? String(summaryEntry.value) : `Request ${issueKey}`;
    const portalWebLink = reqItem._links?.web ? String(reqItem._links.web) : `${webBase}/browse/${encodeURIComponent(issueKey)}`;

    return {
      issueId: String(reqItem.issueId || ''),
      issueKey,
      serviceDeskId: String(reqItem.serviceDeskId || ''),
      requestTypeId: String(reqItem.requestTypeId || ''),
      summary: summaryText,
      status: String(reqItem.currentStatus?.status || 'Open'),
      statusDate: reqItem.currentStatus?.statusDate?.iso8601 ? String(reqItem.currentStatus.statusDate.iso8601) : undefined,
      createdDate: String(reqItem.createdDate?.iso8601 || new Date().toISOString()),
      reporterName: reqItem.reporter?.displayName ? String(reqItem.reporter.displayName) : undefined,
      requestUrl: portalWebLink,
      dataOrigin: 'live_jsm',
    };
  });
}

export async function fetchJsmRequestByKey(params: {
  config: CareBridgeAtlassianConfig;
  issueKey: string;
  fetchImpl?: typeof fetch;
}): Promise<CareBridgeJsmRequest> {
  const { config } = params;
  if (config.mode === 'disconnected') {
    throw new CareBridgeBoundaryError(
      401,
      'ATLASSIAN_NOT_CONNECTED',
      'No live Atlassian Jira Service Management connection is configured.'
    );
  }

  const cleanKey = (params.issueKey || '').trim().toUpperCase();
  if (!/^[A-Z0-9_]{1,16}-\d{1,10}$/.test(cleanKey)) {
    throw new CareBridgeBoundaryError(400, 'INVALID_ISSUE_KEY', `Invalid JSM request key "${params.issueKey}".`);
  }

  const baseUrl = resolveJsmApiBase(config);
  const webBase = resolveWebBase(config);
  const resp = await safeAtlassianFetch(
    `${baseUrl}/rest/servicedeskapi/request/${encodeURIComponent(cleanKey)}`,
    { method: 'GET', headers: config.headers },
    params.fetchImpl
  );

  if (!resp.ok) {
    throw new CareBridgeBoundaryError(
      resp.status === 401 || resp.status === 403 ? 403 : 502,
      'JSM_REQUEST_LOOKUP_FAILED',
      `JSM request lookup for ${cleanKey} returned HTTP ${resp.status}.`
    );
  }

  const reqItem = (await resp.json()) as any;
  const fieldValues = Array.isArray(reqItem.requestFieldValues) ? reqItem.requestFieldValues : [];
  const summaryEntry = fieldValues.find((fv: any) => fv.fieldId === 'summary');
  const issueKey = String(reqItem.issueKey || cleanKey);
  const portalWebLink = reqItem._links?.web ? String(reqItem._links.web) : `${webBase}/browse/${encodeURIComponent(issueKey)}`;

  return {
    issueId: String(reqItem.issueId || ''),
    issueKey,
    serviceDeskId: String(reqItem.serviceDeskId || ''),
    requestTypeId: String(reqItem.requestTypeId || ''),
    summary: summaryEntry?.value ? String(summaryEntry.value) : `Request ${issueKey}`,
    status: String(reqItem.currentStatus?.status || 'Open'),
    statusDate: reqItem.currentStatus?.statusDate?.iso8601 ? String(reqItem.currentStatus.statusDate.iso8601) : undefined,
    createdDate: String(reqItem.createdDate?.iso8601 || new Date().toISOString()),
    reporterName: reqItem.reporter?.displayName ? String(reqItem.reporter.displayName) : undefined,
    requestUrl: portalWebLink,
    dataOrigin: 'live_jsm',
  };
}

export async function createJsmFollowUpRequestConfirmed(params: {
  config: CareBridgeAtlassianConfig;
  serviceDeskId: string;
  requestTypeId: string;
  summary: string;
  minimalNote: string;
  jsmConsentGranted: boolean;
  userConfirmed: boolean;
  allowClinicalReferenceOverride?: boolean;
  fetchImpl?: typeof fetch;
}): Promise<CareBridgeJsmRequest> {
  if (!params.jsmConsentGranted) {
    throw new CareBridgeBoundaryError(
      403,
      'JSM_CONSENT_REQUIRED',
      'Explicit JSM follow-up sync consent must be enabled in Privacy and Consent before sending a request to Jira Service Management.'
    );
  }
  if (!params.userConfirmed) {
    throw new CareBridgeBoundaryError(
      400,
      'USER_CONFIRMATION_REQUIRED',
      'Explicit user confirmation is required before creating a Jira Service Management request.'
    );
  }
  if (params.config.mode === 'disconnected') {
    throw new CareBridgeBoundaryError(
      401,
      'ATLASSIAN_NOT_CONNECTED',
      'Cannot create JSM request: no live Atlassian Service Desk connection is configured.'
    );
  }

  const deskId = (params.serviceDeskId || '').trim();
  const typeId = (params.requestTypeId || '').trim();
  if (!/^\d{1,12}$/.test(deskId) || !/^\d{1,12}$/.test(typeId)) {
    throw new CareBridgeBoundaryError(
      400,
      'INVALID_SERVICE_DESK_PARAMS',
      'Valid numeric serviceDeskId and requestTypeId are required.'
    );
  }

  const minimized = minimizePayloadForJsm({
    summary: params.summary,
    minimalNote: params.minimalNote,
    allowClinicalReferenceOverride: params.allowClinicalReferenceOverride,
  });

  const baseUrl = resolveJsmApiBase(params.config);
  const webBase = resolveWebBase(params.config);

  const resp = await safeAtlassianFetch(
    `${baseUrl}/rest/servicedeskapi/request`,
    {
      method: 'POST',
      headers: params.config.headers,
      body: JSON.stringify({
        serviceDeskId: deskId,
        requestTypeId: typeId,
        requestFieldValues: {
          summary: minimized.summary,
          description: minimized.description,
        },
      }),
    },
    params.fetchImpl
  );

  if (!resp.ok) {
    throw new CareBridgeBoundaryError(
      resp.status === 401 || resp.status === 403 ? 403 : 502,
      'JSM_CREATE_FAILED',
      `Jira Service Management request creation returned HTTP ${resp.status}. Verify write:servicedesk-request scope and portal permissions.`
    );
  }

  const created = (await resp.json()) as any;
  const issueKey = String(created.issueKey || '');
  const portalUrl = created._links?.web
    ? String(created._links.web)
    : `${webBase}/browse/${encodeURIComponent(issueKey)}`;

  return {
    issueId: String(created.issueId || ''),
    issueKey,
    serviceDeskId: String(created.serviceDeskId || deskId),
    requestTypeId: String(created.requestTypeId || typeId),
    summary: minimized.summary,
    status: String(created.currentStatus?.status || 'Waiting for support'),
    statusDate: created.currentStatus?.statusDate?.iso8601 ? String(created.currentStatus.statusDate.iso8601) : undefined,
    createdDate: String(created.createdDate?.iso8601 || new Date().toISOString()),
    reporterName: created.reporter?.displayName ? String(created.reporter.displayName) : undefined,
    requestUrl: portalUrl,
    dataOrigin: 'live_jsm',
  };
}

export async function searchConfluenceCareKnowledge(params: {
  config: CareBridgeAtlassianConfig;
  queryText?: string;
  confluenceReadConsent: boolean;
  fetchImpl?: typeof fetch;
}): Promise<CareBridgeConfluencePage[]> {
  if (!params.confluenceReadConsent) {
    throw new CareBridgeBoundaryError(
      403,
      'CONFLUENCE_CONSENT_REQUIRED',
      'Enable Confluence Clinical Knowledge read consent in Privacy and Consent before querying Confluence.'
    );
  }
  if (params.config.mode === 'disconnected') {
    throw new CareBridgeBoundaryError(
      401,
      'ATLASSIAN_NOT_CONNECTED',
      'No live Atlassian Confluence connection is configured.'
    );
  }

  const baseUrl = resolveConfluenceApiBase(params.config);
  const webBase = resolveWebBase(params.config);
  const qClean = (params.queryText || '')
    .replace(/["\\;{}\[\]]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120);

  const url = qClean
    ? `${baseUrl}/wiki/rest/api/content/search?cql=${encodeURIComponent(`type = page AND text ~ "${qClean}"`)}&limit=15&expand=space,version`
    : `${baseUrl}/wiki/api/v2/pages?limit=15&sort=-modified-date`;

  const resp = await safeAtlassianFetch(
    url,
    { method: 'GET', headers: params.config.headers },
    params.fetchImpl
  );
  if (!resp.ok) {
    throw new CareBridgeBoundaryError(
      resp.status === 401 || resp.status === 403 ? 403 : 502,
      'CONFLUENCE_API_ERROR',
      `Confluence REST API returned HTTP ${resp.status}.`
    );
  }

  const data = (await resp.json()) as { results?: any[] };
  return (data.results || []).map((page) => {
    const id = String(page.id);
    const title = String(page.title || 'Untitled Confluence Page');
    const spaceKey = String(page.space?.key || page.spaceId || 'CARE');
    const rawWebUi = typeof page._links?.webui === 'string' ? page._links.webui : '';
    const webUi = rawWebUi.startsWith('/wiki/')
      ? rawWebUi
      : rawWebUi.startsWith('/')
        ? `/wiki${rawWebUi}`
        : `/wiki/pages/${encodeURIComponent(id)}`;

    return {
      id,
      title,
      spaceKey,
      spaceName: String(page.space?.name || spaceKey),
      excerpt:
        String(page.excerpt || page.body?.storage?.value || '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 280) || 'Authorized Confluence knowledge article.',
      lastUpdated: String(page.version?.when || page.createdAt || new Date().toISOString()),
      author: page.version?.by?.displayName ? String(page.version.by.displayName) : undefined,
      url: rawWebUi.startsWith('http') ? rawWebUi : `${webBase}${webUi}`,
      dataOrigin: 'live_confluence',
    };
  });
}

// ============================================================================
// READ-ONLY LIVE ATLASSIAN CONNECTION VERIFICATION
// Strictly read-only: NEVER creates a Jira issue or JSM service request.
// Never exposes ATLASSIAN_EMAIL, ATLASSIAN_API_TOKEN, or Authorization headers.
// ============================================================================
export async function verifyCareBridgeAtlassianConnection(params?: {
  oauthBearerToken?: string;
  oauthCloudId?: string;
  siteUrlHint?: string;
  expectedSiteUrl?: string;
  expectedServiceDeskId?: string;
  expectedProjectKey?: string;
  expectedProjectName?: string;
  expectedRequestTypeId?: string;
  expectedRequestTypeName?: string;
  fetchImpl?: typeof fetch;
}): Promise<CareBridgeVerificationReport> {
  const verifiedAt = new Date().toISOString();
  const expectedSiteUrl =
    (params?.expectedSiteUrl || 'https://zenieverse.atlassian.net').trim().toLowerCase();
  const expectedServiceDeskId =
    (params?.expectedServiceDeskId || process.env.CAREBRIDGE_DEFAULT_SERVICE_DESK_ID || '2').trim() || '2';
  const expectedProjectKey = (params?.expectedProjectKey || 'CR2').trim().toUpperCase();
  const expectedProjectName = (params?.expectedProjectName || 'CareBridge2').trim();
  const expectedRequestTypeId =
    (params?.expectedRequestTypeId || process.env.CAREBRIDGE_DEFAULT_REQUEST_TYPE_ID || '5').trim() || '5';
  const expectedRequestTypeName =
    (params?.expectedRequestTypeName || 'Submit a request or incident').trim();

  const checks: CareBridgeVerificationCheckItem[] = [
    {
      id: 'credentials',
      label: 'Server-side credential isolation',
      outcome: 'NOT TESTED',
      detail: 'Not yet evaluated.',
    },
    {
      id: 'authentication',
      label: 'Atlassian REST authentication',
      outcome: 'NOT TESTED',
      detail: 'Awaiting credential verification.',
    },
    {
      id: 'service_desk',
      label: `Service Desk ${expectedServiceDeskId} (${expectedProjectName} / ${expectedProjectKey})`,
      outcome: 'NOT TESTED',
      detail: 'Awaiting authentication.',
    },
    {
      id: 'request_type',
      label: `Request type ${expectedRequestTypeId} ("${expectedRequestTypeName}")`,
      outcome: 'NOT TESTED',
      detail: 'Awaiting Service Desk lookup.',
    },
    {
      id: 'permissions',
      label: `Account permissions on ${expectedProjectKey}`,
      outcome: 'NOT TESTED',
      detail: 'Awaiting Service Desk and request type lookup.',
    },
  ];

  const setCheck = (
    id: CareBridgeVerificationCheckItem['id'],
    outcome: CareBridgeVerificationCheckItem['outcome'],
    detail: string
  ) => {
    const idx = checks.findIndex((c) => c.id === id);
    if (idx >= 0) {
      checks[idx] = { ...checks[idx], outcome, detail: sanitizeCareBridgeErrorText(detail) };
    }
  };

  const buildFailReport = (
    status: CareBridgeConnectionDisplayStatus,
    safeError: string,
    extra?: Partial<CareBridgeVerificationReport>
  ): CareBridgeVerificationReport => ({
    status,
    verifiedAt,
    siteUrl: extra?.siteUrl || expectedSiteUrl,
    expectedServiceDeskId,
    expectedProjectKey,
    expectedProjectName,
    expectedRequestTypeId,
    expectedRequestTypeName,
    allChecksPassed: false,
    safeError,
    checks,
    ...extra,
  });

  let config: CareBridgeAtlassianConfig;
  try {
    config = resolveCareBridgeAtlassianConnection({
      oauthBearerToken: params?.oauthBearerToken,
      oauthCloudId: params?.oauthCloudId,
      siteUrlHint: params?.siteUrlHint,
    });
  } catch (err) {
    const rawSite = (process.env.ATLASSIAN_SITE_URL || '').trim();
    let msg =
      err instanceof Error
        ? sanitizeCareBridgeErrorText(err.message)
        : 'Server Atlassian site URL configuration is invalid.';
    if (rawSite) {
      if (rawSite.startsWith('ATLASSIAN_SITE_URL=')) {
        msg = 'ATLASSIAN_SITE_URL includes the "ATLASSIAN_SITE_URL=" key prefix instead of just the URL (https://zenieverse.atlassian.net).';
      } else if (rawSite.includes('@') && !rawSite.includes('://')) {
        msg = 'ATLASSIAN_SITE_URL contains an email-formatted string instead of an https://*.atlassian.net URL.';
      } else if (rawSite.startsWith('`') || rawSite.endsWith('`')) {
        msg = 'ATLASSIAN_SITE_URL is wrapped in markdown backticks.';
      } else if (/^http:\/\//i.test(rawSite)) {
        msg = 'ATLASSIAN_SITE_URL uses http:// instead of https://.';
      } else if (rawSite.toLowerCase().includes('.atlassian.com')) {
        msg = 'ATLASSIAN_SITE_URL uses ".atlassian.com" instead of ".atlassian.net". Set it to https://zenieverse.atlassian.net in Secrets.';
      } else if (/^[a-f0-9-]{32,36}$/i.test(rawSite)) {
        msg = 'ATLASSIAN_SITE_URL looks like a 32/36-char ID or hex string instead of https://zenieverse.atlassian.net.';
      } else if (!rawSite.toLowerCase().includes('.atlassian.net')) {
        msg = `ATLASSIAN_SITE_URL is set (${rawSite.length} chars) in server env but does not contain ".atlassian.net". Update it to https://zenieverse.atlassian.net in Settings > Secrets.`;
      }
    }
    setCheck('credentials', 'FAILED', msg);
    return buildFailReport('Unavailable', msg);
  }

  if (config.mode === 'disconnected') {
    const missing: string[] = [];
    if (!(process.env.ATLASSIAN_SITE_URL || '').trim()) missing.push('ATLASSIAN_SITE_URL');
    if (!(process.env.ATLASSIAN_EMAIL || '').trim()) missing.push('ATLASSIAN_EMAIL');
    if (!(process.env.ATLASSIAN_API_TOKEN || '').trim()) missing.push('ATLASSIAN_API_TOKEN');
    const detail = `Missing server-side environment variable(s): ${missing.join(', ') || 'Atlassian credentials'}.`;
    setCheck('credentials', 'FAILED', detail);
    return buildFailReport('Unavailable', detail);
  }

  const configuredSiteUrl = config.siteUrl || expectedSiteUrl;
  const siteMatches =
    config.mode === 'oauth_bearer' || configuredSiteUrl.toLowerCase() === expectedSiteUrl;

  if (!siteMatches) {
    const msg = `Configured server site (${configuredSiteUrl}) does not match expected site (${expectedSiteUrl}).`;
    setCheck('credentials', 'FAILED', msg);
    return buildFailReport('Unavailable', msg, { siteUrl: configuredSiteUrl });
  }

  setCheck(
    'credentials',
    'VERIFIED',
    `Credentials resolved server-side from process.env for ${configuredSiteUrl} with HTTPS host & redirect lock.`
  );

  const baseUrl = resolveJsmApiBase(config);
  const mapHttpStatus = (code: number): CareBridgeConnectionDisplayStatus =>
    code === 401 ? 'Unauthorized' : code === 403 ? 'Permission Denied' : 'Unavailable';

  // 1. Read-only Authentication check: /rest/api/3/myself
  try {
    const meResp = await safeAtlassianFetch(
      `${baseUrl}/rest/api/3/myself`,
      { method: 'GET', headers: config.headers },
      params?.fetchImpl
    );
    if (!meResp.ok) {
      const status = mapHttpStatus(meResp.status);
      const errMsg = `Atlassian authentication check returned HTTP ${meResp.status} (${status}).`;
      setCheck('authentication', 'FAILED', errMsg);
      return buildFailReport(status, errMsg, { siteUrl: configuredSiteUrl });
    }
    const meData = (await meResp.json()) as { accountId?: string; accountType?: string; active?: boolean };
    if (!meData.accountId || meData.active === false) {
      const errMsg = 'Atlassian account record is missing or inactive.';
      setCheck('authentication', 'FAILED', errMsg);
      return buildFailReport('Unauthorized', errMsg, { siteUrl: configuredSiteUrl });
    }
    setCheck(
      'authentication',
      'VERIFIED',
      `Authenticated active Atlassian account (accountType: ${meData.accountType || 'atlassian'}).`
    );
  } catch (err) {
    const errMsg = `Atlassian authentication request failed: ${sanitizeCareBridgeErrorText(
      err instanceof Error ? err.message : 'Network error'
    )}`;
    setCheck('authentication', 'FAILED', errMsg);
    return buildFailReport('Unavailable', errMsg, { siteUrl: configuredSiteUrl });
  }

  // 2. Read-only Accessible Service Desks + Desk 2 check
  let actualProjectKey: string | undefined;
  let actualServiceDeskName: string | undefined;
  let accessibleServiceDeskCount: number | undefined;
  try {
    const [listResp, deskResp] = await Promise.all([
      safeAtlassianFetch(
        `${baseUrl}/rest/servicedeskapi/servicedesk?limit=25`,
        { method: 'GET', headers: config.headers },
        params?.fetchImpl
      ),
      safeAtlassianFetch(
        `${baseUrl}/rest/servicedeskapi/servicedesk/${encodeURIComponent(expectedServiceDeskId)}`,
        { method: 'GET', headers: config.headers },
        params?.fetchImpl
      ),
    ]);

    if (listResp.ok) {
      const listJson = (await listResp.json()) as { values?: any[] };
      accessibleServiceDeskCount = Array.isArray(listJson.values) ? listJson.values.length : undefined;
    }

    if (!deskResp.ok) {
      const status = mapHttpStatus(deskResp.status);
      const errMsg = `Service Desk ${expectedServiceDeskId} lookup returned HTTP ${deskResp.status}.`;
      setCheck('service_desk', 'FAILED', errMsg);
      return buildFailReport(status, errMsg, { siteUrl: configuredSiteUrl, accessibleServiceDeskCount });
    }

    const deskData = (await deskResp.json()) as {
      id?: string | number;
      projectKey?: string;
      projectName?: string;
    };
    actualProjectKey = deskData.projectKey ? String(deskData.projectKey) : undefined;
    actualServiceDeskName = deskData.projectName ? String(deskData.projectName).trim() : undefined;

    if (
      String(deskData.id || '') !== expectedServiceDeskId ||
      String(actualProjectKey || '').toUpperCase() !== expectedProjectKey ||
      (expectedProjectName && actualServiceDeskName && actualServiceDeskName !== expectedProjectName)
    ) {
      const errMsg = `Service Desk ${expectedServiceDeskId} resolved projectKey="${
        actualProjectKey || 'unknown'
      }", projectName="${actualServiceDeskName || 'unknown'}", expected "${expectedProjectKey}" / "${expectedProjectName}".`;
      setCheck('service_desk', 'FAILED', errMsg);
      return buildFailReport('Unavailable', errMsg, {
        siteUrl: configuredSiteUrl,
        actualProjectKey,
        actualServiceDeskName,
        accessibleServiceDeskCount,
      });
    }

    setCheck(
      'service_desk',
      'VERIFIED',
      `Service Desk ${expectedServiceDeskId} verified (${actualServiceDeskName || expectedProjectName} / ${actualProjectKey}; ${
        accessibleServiceDeskCount ?? '1+'
      } accessible desk(s)).`
    );
  } catch (err) {
    const errMsg = `Service Desk lookup failed: ${sanitizeCareBridgeErrorText(
      err instanceof Error ? err.message : 'Network error'
    )}`;
    setCheck('service_desk', 'FAILED', errMsg);
    return buildFailReport('Unavailable', errMsg, { siteUrl: configuredSiteUrl });
  }

  // 3. Read-only Request Types & Creatable Field Check
  let actualRequestTypeName: string | undefined;
  let requestTypeRequiredFields: string[] | undefined;
  let requestTypeCreatable = false;
  try {
    const rtResp = await safeAtlassianFetch(
      `${baseUrl}/rest/servicedeskapi/servicedesk/${encodeURIComponent(expectedServiceDeskId)}/requesttype?limit=50`,
      { method: 'GET', headers: config.headers },
      params?.fetchImpl
    );
    if (!rtResp.ok) {
      const status = mapHttpStatus(rtResp.status);
      const errMsg = `Request type lookup returned HTTP ${rtResp.status}.`;
      setCheck('request_type', 'FAILED', errMsg);
      return buildFailReport(status, errMsg, {
        siteUrl: configuredSiteUrl,
        actualProjectKey,
        actualServiceDeskName,
        accessibleServiceDeskCount,
      });
    }

    const rtJson = (await rtResp.json()) as { values?: Array<{ id?: string | number; name?: string }> };
    const foundRt = (rtJson.values || []).find((rt) => String(rt.id) === expectedRequestTypeId);
    actualRequestTypeName = foundRt?.name ? String(foundRt.name).trim() : undefined;

    if (!foundRt || actualRequestTypeName !== expectedRequestTypeName) {
      const errMsg = foundRt
        ? `Request type ${expectedRequestTypeId} has name "${actualRequestTypeName}", expected "${expectedRequestTypeName}".`
        : `Request type ${expectedRequestTypeId} was not found in Service Desk ${expectedServiceDeskId}.`;
      setCheck('request_type', 'FAILED', errMsg);
      return buildFailReport('Unavailable', errMsg, {
        siteUrl: configuredSiteUrl,
        actualProjectKey,
        actualServiceDeskName,
        actualRequestTypeName,
        accessibleServiceDeskCount,
      });
    }

    const fieldsResp = await safeAtlassianFetch(
      `${baseUrl}/rest/servicedeskapi/servicedesk/${encodeURIComponent(
        expectedServiceDeskId
      )}/requesttype/${encodeURIComponent(expectedRequestTypeId)}/field`,
      { method: 'GET', headers: config.headers },
      params?.fetchImpl
    );
    if (fieldsResp.ok) {
      requestTypeCreatable = true;
      const fieldsJson = (await fieldsResp.json()) as {
        canCreateRequest?: boolean;
        requestTypeFields?: Array<{ fieldId?: string; required?: boolean }>;
      };
      if (fieldsJson.canCreateRequest === false) {
        requestTypeCreatable = false;
      }
      requestTypeRequiredFields = (fieldsJson.requestTypeFields || [])
        .filter((fld) => fld.required && fld.fieldId)
        .map((fld) => String(fld.fieldId));
    }

    if (!requestTypeCreatable) {
      const errMsg = `Request type ${expectedRequestTypeId} ("${actualRequestTypeName}") is not creatable for this account (fields check HTTP ${fieldsResp.status}).`;
      setCheck('request_type', 'FAILED', errMsg);
      return buildFailReport(mapHttpStatus(fieldsResp.status), errMsg, {
        siteUrl: configuredSiteUrl,
        actualProjectKey,
        actualServiceDeskName,
        actualRequestTypeName,
        accessibleServiceDeskCount,
        requestTypeCreatable: false,
      });
    }

    setCheck(
      'request_type',
      'VERIFIED',
      `Request type ${expectedRequestTypeId} confirmed as "${actualRequestTypeName}" and verified creatable (required fields: ${
        requestTypeRequiredFields?.join(', ') || 'summary'
      }).`
    );
  } catch (err) {
    const errMsg = `Request type verification failed: ${sanitizeCareBridgeErrorText(
      err instanceof Error ? err.message : 'Network error'
    )}`;
    setCheck('request_type', 'FAILED', errMsg);
    return buildFailReport('Unavailable', errMsg, {
      siteUrl: configuredSiteUrl,
      actualProjectKey,
      actualServiceDeskName,
      accessibleServiceDeskCount,
    });
  }

  // 4. Read-only Permissions check: /rest/api/3/mypermissions + read-only /rest/servicedeskapi/request?limit=1
  try {
    const [permResp, jsmReadResp] = await Promise.all([
      safeAtlassianFetch(
        `${baseUrl}/rest/api/3/mypermissions?projectKey=${encodeURIComponent(
          expectedProjectKey
        )}&permissions=BROWSE_PROJECTS,CREATE_ISSUES`,
        { method: 'GET', headers: config.headers },
        params?.fetchImpl
      ),
      safeAtlassianFetch(
        `${baseUrl}/rest/servicedeskapi/request?serviceDeskId=${encodeURIComponent(
          expectedServiceDeskId
        )}&limit=1`,
        { method: 'GET', headers: config.headers },
        params?.fetchImpl
      ),
    ]);

    if (permResp.status === 401 || jsmReadResp.status === 401) {
      const errMsg = 'Permission verification returned HTTP 401 Unauthorized.';
      setCheck('permissions', 'FAILED', errMsg);
      return buildFailReport('Unauthorized', errMsg, {
        siteUrl: configuredSiteUrl,
        actualProjectKey,
        actualServiceDeskName,
        actualRequestTypeName,
        accessibleServiceDeskCount,
        requestTypeCreatable,
        requestTypeRequiredFields,
      });
    }

    if (permResp.status === 403 || jsmReadResp.status === 403) {
      const errMsg = `Account lacks required Jira/JSM permissions on project ${expectedProjectKey} (HTTP 403).`;
      setCheck('permissions', 'FAILED', errMsg);
      return buildFailReport('Permission Denied', errMsg, {
        siteUrl: configuredSiteUrl,
        actualProjectKey,
        actualServiceDeskName,
        actualRequestTypeName,
        accessibleServiceDeskCount,
        requestTypeCreatable,
        requestTypeRequiredFields,
      });
    }

    if (!permResp.ok || !jsmReadResp.ok) {
      const errMsg = `Permission verification failed (mypermissions HTTP ${permResp.status}, servicedesk request HTTP ${jsmReadResp.status}).`;
      setCheck('permissions', 'FAILED', errMsg);
      return buildFailReport('Unavailable', errMsg, {
        siteUrl: configuredSiteUrl,
        actualProjectKey,
        actualServiceDeskName,
        actualRequestTypeName,
        accessibleServiceDeskCount,
        requestTypeCreatable,
        requestTypeRequiredFields,
      });
    }

    const permJson = (await permResp.json()) as {
      permissions?: Record<string, { havePermission?: boolean }>;
    };
    const canBrowse = Boolean(permJson.permissions?.BROWSE_PROJECTS?.havePermission);
    const canCreate = Boolean(permJson.permissions?.CREATE_ISSUES?.havePermission);

    if (!canBrowse || !canCreate) {
      const missingPerms: string[] = [];
      if (!canBrowse) missingPerms.push('BROWSE_PROJECTS');
      if (!canCreate) missingPerms.push('CREATE_ISSUES');
      const errMsg = `Missing required permission(s) on ${expectedProjectKey}: ${missingPerms.join(', ')}.`;
      setCheck('permissions', 'FAILED', errMsg);
      return buildFailReport('Permission Denied', errMsg, {
        siteUrl: configuredSiteUrl,
        actualProjectKey,
        actualServiceDeskName,
        actualRequestTypeName,
        accessibleServiceDeskCount,
        requestTypeCreatable,
        requestTypeRequiredFields,
      });
    }

    setCheck(
      'permissions',
      'VERIFIED',
      `Confirmed BROWSE_PROJECTS, CREATE_ISSUES on ${expectedProjectKey}, and JSM request API access.`
    );
  } catch (err) {
    const errMsg = `Permission verification failed: ${sanitizeCareBridgeErrorText(
      err instanceof Error ? err.message : 'Network error'
    )}`;
    setCheck('permissions', 'FAILED', errMsg);
    return buildFailReport('Unavailable', errMsg, {
      siteUrl: configuredSiteUrl,
      actualProjectKey,
      actualServiceDeskName,
      actualRequestTypeName,
      accessibleServiceDeskCount,
      requestTypeCreatable,
      requestTypeRequiredFields,
    });
  }

  return {
    status: 'Connected',
    verifiedAt,
    siteUrl: configuredSiteUrl,
    expectedServiceDeskId,
    expectedProjectKey,
    expectedProjectName,
    expectedRequestTypeId,
    expectedRequestTypeName,
    actualProjectKey,
    actualServiceDeskName,
    actualRequestTypeName,
    accessibleServiceDeskCount,
    requestTypeCreatable,
    requestTypeRequiredFields,
    allChecksPassed: true,
    checks,
  };
}
