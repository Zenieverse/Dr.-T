// ============================================================================
// DR. T — HATBRIDGE SERVER-SIDE ATLASSIAN JIRA & CONFLUENCE ADAPTER
// Strict SSRF host allowlist, privacy boundary guardrails, user-confirmed writes,
// and honest disconnected vs. connected reporting.
// ============================================================================

import {
  HatBridgeAtlassianIssue,
  HatBridgeConfluencePage,
  HatBridgePrivacyLevel,
} from '../types/hatbridgeTypes';

export class AtlassianBoundaryError extends Error {
  public readonly statusCode: 400 | 401 | 403 | 502;
  public readonly code: string;
  constructor(statusCode: 400 | 401 | 403 | 502, code: string, message: string) {
    super(message);
    this.name = 'AtlassianBoundaryError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

export interface AtlassianConnectionConfig {
  mode: 'live_env' | 'oauth_bearer' | 'disconnected';
  siteUrl: string;
  cloudId?: string;
  headers: Record<string, string>;
  accountLabel?: string;
}

const VALID_ATLASSIAN_SITE_REGEX = /^https:\/\/[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]\.atlassian\.net$/;
const VALID_CLOUD_ID_REGEX = /^[a-fA-F0-9-]{8,64}$/;

export function validateAtlassianSiteUrl(rawUrl?: string | null): string | null {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const trimmed = rawUrl.trim().replace(/\/+$/, '');
  if (!VALID_ATLASSIAN_SITE_REGEX.test(trimmed)) {
    throw new AtlassianBoundaryError(
      400,
      'INVALID_ATLASSIAN_SITE_URL',
      'Atlassian site URL must be a valid HTTPS *.atlassian.net domain (e.g., https://your-site.atlassian.net).'
    );
  }
  return trimmed;
}

export function resolveAtlassianConnection(params?: {
  oauthBearerToken?: string;
  oauthCloudId?: string;
  siteUrlHint?: string;
}): AtlassianConnectionConfig {
  // 1. User-supplied OAuth 2.0 (3LO) / Forge context token
  const bearer = params?.oauthBearerToken?.trim();
  const cloudId = params?.oauthCloudId?.trim();
  if (bearer && cloudId) {
    if (!VALID_CLOUD_ID_REGEX.test(cloudId)) {
      throw new AtlassianBoundaryError(400, 'INVALID_CLOUD_ID', 'Invalid Atlassian Cloud ID format.');
    }
    const siteUrl = params?.siteUrlHint ? validateAtlassianSiteUrl(params.siteUrlHint) || '' : '';
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

  // 2. Server-side environment credentials (never exposed to browser)
  const envSite = (process.env.ATLASSIAN_SITE_URL || '').trim();
  const envEmail = (process.env.ATLASSIAN_EMAIL || '').trim();
  const envToken = (process.env.ATLASSIAN_API_TOKEN || '').trim();

  if (envSite && envEmail && envToken) {
    const validatedSite = validateAtlassianSiteUrl(envSite)!;
    const basic = Buffer.from(`${envEmail}:${envToken}`).toString('base64');
    return {
      mode: 'live_env',
      siteUrl: validatedSite,
      headers: {
        Authorization: `Basic ${basic}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      accountLabel: envEmail,
    };
  }

  return {
    mode: 'disconnected',
    siteUrl: '',
    headers: {},
  };
}

export function assertWorkplaceExportAllowed(privacyLevel?: HatBridgePrivacyLevel): void {
  if (privacyLevel === 'private_personal') {
    throw new AtlassianBoundaryError(
      403,
      'PRIVACY_BOUNDARY_VIOLATION',
      'Private personal/family items cannot be pushed or published to shared Jira or Confluence workspaces.'
    );
  }
}

export async function fetchJiraWorkspaceIssues(params: {
  config: AtlassianConnectionConfig;
  jql?: string;
  fetchImpl?: typeof fetch;
}): Promise<HatBridgeAtlassianIssue[]> {
  const { config } = params;
  if (config.mode === 'disconnected') {
    throw new AtlassianBoundaryError(
      401,
      'ATLASSIAN_NOT_CONNECTED',
      'No live Atlassian Jira connection is configured on the server.'
    );
  }

  const f = params.fetchImpl || fetch;
  const jql = (params.jql || 'assignee = currentUser() ORDER BY updated DESC').slice(0, 300);
  const baseUrl =
    config.mode === 'oauth_bearer' && config.cloudId
      ? `https://api.atlassian.com/ex/jira/${config.cloudId}`
      : config.siteUrl;

  const url = `${baseUrl}/rest/api/3/search/jql?jql=${encodeURIComponent(jql)}&maxResults=25&fields=summary,status,priority,assignee,duedate,project`;
  const resp = await f(url, { method: 'GET', headers: config.headers });

  if (!resp.ok) {
    throw new AtlassianBoundaryError(
      resp.status === 401 || resp.status === 403 ? 401 : 502,
      'JIRA_API_ERROR',
      `Jira REST API returned ${resp.status}. Verify workspace scopes and user permissions.`
    );
  }

  const data = (await resp.json()) as { issues?: any[] };
  const today = new Date().toISOString().slice(0, 10);

  return (data.issues || []).map((issue) => {
    const fields = issue.fields || {};
    const statusName = String(fields.status?.name || 'Open');
    const dueDate = fields.duedate ? String(fields.duedate) : undefined;
    const isBlocked = /block|wait|hold/i.test(statusName);
    const isOverdue = Boolean(dueDate && dueDate < today && !/done|closed|resolved/i.test(statusName));
    const webBase = config.siteUrl.startsWith('https://') && config.siteUrl.includes('.atlassian.net')
      ? config.siteUrl
      : 'https://home.atlassian.com';

    return {
      id: String(issue.id),
      key: String(issue.key),
      summary: String(fields.summary || 'Untitled issue'),
      status: statusName,
      priority: String(fields.priority?.name || 'Medium'),
      assignee: fields.assignee?.displayName ? String(fields.assignee.displayName) : undefined,
      dueDate,
      projectKey: String(fields.project?.key || 'WORK'),
      projectName: String(fields.project?.name || 'Jira Project'),
      isOverdue,
      isBlocked,
      url: `${webBase}/browse/${issue.key}`,
      dataOrigin: 'live_atlassian',
    };
  });
}

export async function createJiraIssueConfirmed(params: {
  config: AtlassianConnectionConfig;
  projectKey: string;
  summary: string;
  description: string;
  issueType?: string;
  privacyLevel: HatBridgePrivacyLevel;
  userConfirmed: boolean;
  fetchImpl?: typeof fetch;
}): Promise<{ key: string; id: string; url: string }> {
  assertWorkplaceExportAllowed(params.privacyLevel);

  if (!params.userConfirmed) {
    throw new AtlassianBoundaryError(
      400,
      'USER_CONFIRMATION_REQUIRED',
      'Explicit user confirmation is required before creating a Jira issue.'
    );
  }
  if (params.config.mode === 'disconnected') {
    throw new AtlassianBoundaryError(
      401,
      'ATLASSIAN_NOT_CONNECTED',
      'Cannot create Jira issue: Atlassian Cloud connection is not configured.'
    );
  }

  const cleanProject = params.projectKey.trim().toUpperCase();
  if (!/^[A-Z0-9_]{1,16}$/.test(cleanProject)) {
    throw new AtlassianBoundaryError(400, 'INVALID_PROJECT_KEY', 'Invalid Jira project key.');
  }
  const cleanSummary = (params.summary || '').trim().slice(0, 200);
  if (!cleanSummary) {
    throw new AtlassianBoundaryError(400, 'INVALID_SUMMARY', 'Jira issue summary cannot be empty.');
  }

  const f = params.fetchImpl || fetch;
  const baseUrl =
    params.config.mode === 'oauth_bearer' && params.config.cloudId
      ? `https://api.atlassian.com/ex/jira/${params.config.cloudId}`
      : params.config.siteUrl;

  const body = {
    fields: {
      project: { key: cleanProject },
      summary: cleanSummary,
      issuetype: { name: params.issueType || 'Task' },
      description: {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: params.description.trim().slice(0, 4000) || 'Created from HatBridge Context Capture.' }],
          },
        ],
      },
    },
  };

  const resp = await f(`${baseUrl}/rest/api/3/issue`, {
    method: 'POST',
    headers: params.config.headers,
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    throw new AtlassianBoundaryError(
      resp.status === 401 || resp.status === 403 ? 403 : 502,
      'JIRA_CREATE_FAILED',
      `Jira issue creation failed with HTTP ${resp.status}.`
    );
  }

  const created = (await resp.json()) as { id: string; key: string };
  const webBase =
    params.config.siteUrl.startsWith('https://') && params.config.siteUrl.includes('.atlassian.net')
      ? params.config.siteUrl
      : 'https://home.atlassian.com';
  return {
    id: created.id,
    key: created.key,
    url: `${webBase}/browse/${encodeURIComponent(created.key)}`,
  };
}

export async function searchConfluenceWorkspacePages(params: {
  config: AtlassianConnectionConfig;
  queryText?: string;
  fetchImpl?: typeof fetch;
}): Promise<HatBridgeConfluencePage[]> {
  const { config } = params;
  if (config.mode === 'disconnected') {
    throw new AtlassianBoundaryError(
      401,
      'ATLASSIAN_NOT_CONNECTED',
      'No live Atlassian Confluence connection is configured on the server.'
    );
  }

  const f = params.fetchImpl || fetch;
  const baseUrl =
    config.mode === 'oauth_bearer' && config.cloudId
      ? `https://api.atlassian.com/ex/confluence/${config.cloudId}`
      : config.siteUrl;

  const qClean = (params.queryText || '').trim().slice(0, 120);
  const url = qClean
    ? `${baseUrl}/wiki/rest/api/content/search?cql=${encodeURIComponent(`type = page AND text ~ "${qClean.replace(/"/g, '')}"`)}&limit=20&expand=space,version`
    : `${baseUrl}/wiki/api/v2/pages?limit=20&sort=-modified-date`;

  const resp = await f(url, { method: 'GET', headers: config.headers });
  if (!resp.ok) {
    throw new AtlassianBoundaryError(
      resp.status === 401 || resp.status === 403 ? 401 : 502,
      'CONFLUENCE_API_ERROR',
      `Confluence REST API returned ${resp.status}.`
    );
  }

  const data = (await resp.json()) as { results?: any[] };
  const webBase = config.siteUrl.startsWith('https://') && config.siteUrl.includes('.atlassian.net')
    ? config.siteUrl
    : 'https://home.atlassian.com';

  return (data.results || []).map((page) => {
    const id = String(page.id);
    const title = String(page.title || 'Untitled Confluence Page');
    const spaceKey = String(page.space?.key || page.spaceId || 'SPACE');
    const webUi = page._links?.webui ? String(page._links.webui) : `/wiki/pages/${id}`;
    return {
      id,
      title,
      spaceKey,
      spaceName: String(page.space?.name || spaceKey),
      excerpt: String(page.excerpt || page.body?.storage?.value || '').replace(/<[^>]+>/g, '').slice(0, 240) || 'Authorised Confluence page.',
      lastUpdated: String(page.version?.when || page.createdAt || new Date().toISOString()),
      author: page.version?.by?.displayName ? String(page.version.by.displayName) : undefined,
      url: webUi.startsWith('http') ? webUi : `${webBase}${webUi.startsWith('/') ? '' : '/'}${webUi}`,
      isMeetingNote: /meeting|notes|agenda|minutes/i.test(title),
      dataOrigin: 'live_atlassian',
    };
  });
}
