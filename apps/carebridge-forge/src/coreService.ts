// ============================================================================
// CAREBRIDGE FORGE — CORE CARE-NAVIGATION SERVICE & KVS STORE
// Strictly isolated per-user Forge KVS prefix (`carebridge:v1:user:<id>:...`)
// Never shares identifiers or storage keys with HatBridge.
// ============================================================================

import {
  assertMinimizedFollowUpText,
  assertUserConfirmedWrite,
  CareBridgeForgeError,
  sanitizeAtlassianOpenUrl,
  sanitizeSearchQuery,
  validateIssueKey,
  validateNumericId,
} from './privacyGuard.js';

export interface ForgeCareTask {
  id: string;
  contextRef: string;
  description: string;
  priority: 'routine' | 'soon' | 'time_sensitive';
  dueDate?: string;
  responsibleAssignee: string;
  status: 'open' | 'scheduled' | 'waiting_external' | 'completed' | 'deferred';
  jsmRequestKey?: string;
  jsmRequestUrl?: string;
  confluencePageId?: string;
  confluenceUrl?: string;
  updatedAt: string;
}

export interface ForgeJsmServiceDeskSummary {
  id: string;
  projectKey: string;
  projectName: string;
  requestTypes: Array<{ id: string; name: string }>;
}

export interface ForgeJsmRequestSummary {
  issueId: string;
  issueKey: string;
  serviceDeskId: string;
  requestTypeId: string;
  summary: string;
  status: string;
  createdDate: string;
  openUrl: string;
}

export interface ForgeConfluencePageSummary {
  id: string;
  title: string;
  spaceKey: string;
  excerpt: string;
  openUrl: string;
  updatedAt: string;
}

export interface ForgeCareAuditItem {
  id: string;
  timestamp: string;
  action: string;
  summary: string;
}

export interface ForgeCareWorkspaceVault {
  schemaVersion: 1;
  navigationContext: string;
  tasks: ForgeCareTask[];
  linkedPageIds: string[];
  linkedRequestKeys: string[];
  auditLog: ForgeCareAuditItem[];
}

export interface CareBridgeForgeAdapters {
  getUserAccountId: () => string;
  kvsGet: <T = unknown>(key: string) => Promise<T | undefined>;
  kvsSet: (key: string, value: unknown) => Promise<void>;
  fetchJsmServiceDesks: () => Promise<ForgeJsmServiceDeskSummary[]>;
  fetchJsmRequests: () => Promise<ForgeJsmRequestSummary[]>;
  fetchJsmRequestByKey: (issueKey: string) => Promise<ForgeJsmRequestSummary | null>;
  createJsmRequest: (input: {
    serviceDeskId: string;
    requestTypeId: string;
    summary: string;
    description: string;
  }) => Promise<ForgeJsmRequestSummary>;
  searchConfluencePages: (query: string) => Promise<ForgeConfluencePageSummary[]>;
  fetchConfluencePageById: (pageId: string) => Promise<ForgeConfluencePageSummary | null>;
}

export interface CareBridgeFourBucketBrief {
  generatedAt: string;
  navigationContext: string;
  nonClinicalNotice: string;
  verifiedSourceInformation: Array<{ label: string; detail: string; openUrl?: string }>;
  userRecordedInformation: Array<{ taskId: string; description: string; status: string; priority: string; dueDate?: string }>;
  aiGeneratedSuggestionUnconfirmed: {
    label: 'AI-Generated Suggestion — Unconfirmed';
    suggestedNextStep: string;
    humanReviewed: false;
  };
  missingOrUnavailableContext: string[];
}

export function vaultKeyForUser(accountId: string): string {
  const clean = (accountId || '').trim();
  if (!clean) {
    throw new CareBridgeForgeError('AUTH_CONTEXT_REQUIRED', 'Verified Atlassian accountId is required.');
  }
  return `carebridge:v1:user:${clean}:workspace`;
}

function emptyVault(): ForgeCareWorkspaceVault {
  return {
    schemaVersion: 1,
    navigationContext: 'Non-Emergency Follow-Up Navigation',
    tasks: [],
    linkedPageIds: [],
    linkedRequestKeys: [],
    auditLog: [],
  };
}

export async function loadCareVault(adapters: CareBridgeForgeAdapters): Promise<ForgeCareWorkspaceVault> {
  const key = vaultKeyForUser(adapters.getUserAccountId());
  const existing = await adapters.kvsGet<ForgeCareWorkspaceVault>(key);
  if (!existing || existing.schemaVersion !== 1) {
    return emptyVault();
  }
  return {
    schemaVersion: 1,
    navigationContext: existing.navigationContext || 'Non-Emergency Follow-Up Navigation',
    tasks: Array.isArray(existing.tasks) ? existing.tasks : [],
    linkedPageIds: Array.isArray(existing.linkedPageIds) ? existing.linkedPageIds : [],
    linkedRequestKeys: Array.isArray(existing.linkedRequestKeys) ? existing.linkedRequestKeys : [],
    auditLog: Array.isArray(existing.auditLog) ? existing.auditLog : [],
  };
}

export async function saveCareVault(
  adapters: CareBridgeForgeAdapters,
  vault: ForgeCareWorkspaceVault
): Promise<ForgeCareWorkspaceVault> {
  const key = vaultKeyForUser(adapters.getUserAccountId());
  await adapters.kvsSet(key, vault);
  return vault;
}

export async function getCareWorkspaceSnapshot(
  adapters: CareBridgeForgeAdapters,
  opts?: { issueKey?: string; pageId?: string }
) {
  const accountId = adapters.getUserAccountId();
  const vault = await loadCareVault(adapters);

  const [currentRequest, currentPage, serviceDesks, recentRequests, recentPages] = await Promise.all([
    opts?.issueKey ? adapters.fetchJsmRequestByKey(validateIssueKey(opts.issueKey)).catch(() => null) : Promise.resolve(null),
    opts?.pageId ? adapters.fetchConfluencePageById(validateNumericId(opts.pageId, 'Page ID')).catch(() => null) : Promise.resolve(null),
    adapters.fetchJsmServiceDesks().catch(() => []),
    adapters.fetchJsmRequests().catch(() => []),
    adapters.searchConfluencePages('').catch(() => []),
  ]);

  return {
    accountId,
    currentRequest,
    currentPage,
    serviceDesks,
    recentRequests: recentRequests.slice(0, 8),
    recentPages: recentPages.slice(0, 8),
    vault,
  };
}

export async function recordCareTaskInForge(
  adapters: CareBridgeForgeAdapters,
  input: {
    contextRef: string;
    description: string;
    priority?: ForgeCareTask['priority'];
    dueDate?: string;
    responsibleAssignee?: string;
    jsmRequestKey?: string;
    confluencePageId?: string;
  }
): Promise<ForgeCareTask> {
  const vault = await loadCareVault(adapters);
  const contextRef = assertMinimizedFollowUpText(input.contextRef || vault.navigationContext, 'Context reference');
  const description = assertMinimizedFollowUpText(input.description, 'Task description');
  const assignee = (input.responsibleAssignee || 'Care Coordinator').trim().slice(0, 80);

  let linkedReq: ForgeJsmRequestSummary | null = null;
  if (input.jsmRequestKey) {
    const cleanKey = validateIssueKey(input.jsmRequestKey);
    linkedReq = await adapters.fetchJsmRequestByKey(cleanKey).catch(() => null);
    if (!vault.linkedRequestKeys.includes(cleanKey)) {
      vault.linkedRequestKeys = [cleanKey, ...vault.linkedRequestKeys].slice(0, 25);
    }
  }

  let linkedPage: ForgeConfluencePageSummary | null = null;
  if (input.confluencePageId) {
    const cleanPageId = validateNumericId(input.confluencePageId, 'Confluence page ID');
    linkedPage = await adapters.fetchConfluencePageById(cleanPageId).catch(() => null);
    if (!vault.linkedPageIds.includes(cleanPageId)) {
      vault.linkedPageIds = [cleanPageId, ...vault.linkedPageIds].slice(0, 25);
    }
  }

  const now = new Date().toISOString();
  const task: ForgeCareTask = {
    id: `cb-task-${Date.now().toString(36)}`,
    contextRef,
    description,
    priority: input.priority || 'routine',
    dueDate: input.dueDate ? String(input.dueDate).slice(0, 20) : undefined,
    responsibleAssignee: assignee,
    status: 'open',
    jsmRequestKey: linkedReq?.issueKey || (input.jsmRequestKey ? validateIssueKey(input.jsmRequestKey) : undefined),
    jsmRequestUrl: sanitizeAtlassianOpenUrl(linkedReq?.openUrl),
    confluencePageId: linkedPage?.id || (input.confluencePageId ? validateNumericId(input.confluencePageId, 'Page ID') : undefined),
    confluenceUrl: sanitizeAtlassianOpenUrl(linkedPage?.openUrl),
    updatedAt: now,
  };

  vault.tasks = [task, ...vault.tasks].slice(0, 50);
  vault.auditLog = [
    {
      id: `cb-audit-${Date.now().toString(36)}`,
      timestamp: now,
      action: 'task_recorded',
      summary: `Recorded follow-up task ${task.id} (${task.priority}).`,
    },
    ...vault.auditLog,
  ].slice(0, 80);

  await saveCareVault(adapters, vault);
  return task;
}

export async function linkConfluencePageInForge(
  adapters: CareBridgeForgeAdapters,
  pageId: string
): Promise<ForgeConfluencePageSummary> {
  const cleanPageId = validateNumericId(pageId, 'Confluence page ID');
  const page = await adapters.fetchConfluencePageById(cleanPageId);
  if (!page) {
    throw new CareBridgeForgeError('CONFLUENCE_PAGE_UNAVAILABLE', 'Authorized Confluence page could not be retrieved.');
  }
  const vault = await loadCareVault(adapters);
  if (!vault.linkedPageIds.includes(page.id)) {
    vault.linkedPageIds = [page.id, ...vault.linkedPageIds].slice(0, 25);
  }
  const now = new Date().toISOString();
  vault.auditLog = [
    {
      id: `cb-audit-${Date.now().toString(36)}`,
      timestamp: now,
      action: 'confluence_linked',
      summary: `Linked authorized Confluence guidance page ${page.id} (${page.title}).`,
    },
    ...vault.auditLog,
  ].slice(0, 80);
  await saveCareVault(adapters, vault);
  return page;
}

export async function createJsmFollowUpConfirmedInForge(
  adapters: CareBridgeForgeAdapters,
  input: {
    serviceDeskId: string;
    requestTypeId: string;
    summary: string;
    description: string;
    confirmedByUser: boolean;
    taskIdToLink?: string;
  }
): Promise<ForgeJsmRequestSummary> {
  assertUserConfirmedWrite(input.confirmedByUser, 'creating a Jira Service Management follow-up request');
  const serviceDeskId = validateNumericId(input.serviceDeskId, 'Service Desk ID');
  const requestTypeId = validateNumericId(input.requestTypeId, 'Request Type ID');
  const summary = assertMinimizedFollowUpText(input.summary, 'JSM Request Summary');
  const description = assertMinimizedFollowUpText(input.description, 'JSM Request Description');

  const created = await adapters.createJsmRequest({
    serviceDeskId,
    requestTypeId,
    summary,
    description,
  });

  const vault = await loadCareVault(adapters);
  if (!vault.linkedRequestKeys.includes(created.issueKey)) {
    vault.linkedRequestKeys = [created.issueKey, ...vault.linkedRequestKeys].slice(0, 25);
  }
  if (input.taskIdToLink) {
    vault.tasks = vault.tasks.map((t) =>
      t.id === input.taskIdToLink
        ? {
            ...t,
            jsmRequestKey: created.issueKey,
            jsmRequestUrl: sanitizeAtlassianOpenUrl(created.openUrl),
            updatedAt: new Date().toISOString(),
          }
        : t
    );
  }
  vault.auditLog = [
    {
      id: `cb-audit-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
      action: 'jsm_request_created',
      summary: `Created JSM follow-up request ${created.issueKey} with data-minimized summary.`,
    },
    ...vault.auditLog,
  ].slice(0, 80);
  await saveCareVault(adapters, vault);
  return created;
}

export async function buildCareReentryBriefInForge(
  adapters: CareBridgeForgeAdapters,
  opts?: { issueKey?: string; query?: string }
): Promise<CareBridgeFourBucketBrief> {
  const vault = await loadCareVault(adapters);
  const verifiedSourceInformation: CareBridgeFourBucketBrief['verifiedSourceInformation'] = [];
  const missingOrUnavailableContext: string[] = [];

  if (opts?.issueKey) {
    const cleanKey = validateIssueKey(opts.issueKey);
    const req = await adapters.fetchJsmRequestByKey(cleanKey).catch(() => null);
    if (req) {
      verifiedSourceInformation.push({
        label: `JSM ${req.issueKey} (${req.status})`,
        detail: req.summary,
        openUrl: sanitizeAtlassianOpenUrl(req.openUrl),
      });
    } else {
      missingOrUnavailableContext.push(`Requested JSM issue ${cleanKey} is unavailable or not authorized.`);
    }
  } else {
    const requests = await adapters.fetchJsmRequests().catch(() => []);
    for (const req of requests.slice(0, 4)) {
      verifiedSourceInformation.push({
        label: `JSM ${req.issueKey} (${req.status})`,
        detail: req.summary,
        openUrl: sanitizeAtlassianOpenUrl(req.openUrl),
      });
    }
    if (requests.length === 0) {
      missingOrUnavailableContext.push('No authorized Jira Service Management follow-up requests found in current user scope.');
    }
  }

  const pages = await adapters.searchConfluencePages(sanitizeSearchQuery(opts?.query || '')).catch(() => []);
  for (const pg of pages.slice(0, 4)) {
    verifiedSourceInformation.push({
      label: `Confluence ${pg.id} — ${pg.title}`,
      detail: pg.excerpt || `Space ${pg.spaceKey}`,
      openUrl: sanitizeAtlassianOpenUrl(pg.openUrl),
    });
  }
  if (pages.length === 0) {
    missingOrUnavailableContext.push('No matching Confluence clinical knowledge pages retrieved in current user scope.');
  }

  const userRecordedInformation = vault.tasks.map((t) => ({
    taskId: t.id,
    description: t.description,
    status: t.status,
    priority: t.priority,
    dueDate: t.dueDate,
  }));

  if (userRecordedInformation.length === 0) {
    missingOrUnavailableContext.push('No CareBridge administrative follow-up tasks recorded yet.');
  }

  const openTask = vault.tasks.find((t) => t.status !== 'completed');
  const suggestedNextStep = openTask
    ? `Verify status of task "${openTask.description}" (due ${openTask.dueDate || 'unspecified'}) with ${openTask.responsibleAssignee}.`
    : 'Review authorized Confluence follow-up checklist and confirm whether a non-emergency JSM coordination request is needed.';

  return {
    generatedAt: new Date().toISOString(),
    navigationContext: vault.navigationContext,
    nonClinicalNotice:
      'CareBridge provides non-emergency administrative care-navigation support only. Never treat summaries as medical diagnosis or treatment instructions.',
    verifiedSourceInformation,
    userRecordedInformation,
    aiGeneratedSuggestionUnconfirmed: {
      label: 'AI-Generated Suggestion — Unconfirmed',
      suggestedNextStep,
      humanReviewed: false,
    },
    missingOrUnavailableContext,
  };
}
