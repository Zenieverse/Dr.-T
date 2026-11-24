// ============================================================================
// HATBRIDGE FORGE — CORE SERVICE (PERMISSION-SCOPED & GROUNDED)
// Works cleanly with real @forge/api asUser() + @forge/kvs in Jira/Confluence/Rovo
// and accepts clean adapters for deterministic automated testing.
// ============================================================================

import {
  assertUserConfirmedWrite,
  assertWorkplaceExportAllowed,
  ForgeBoundaryError,
  sanitizeSearchQuery,
  validateConfluencePageId,
  validateJiraIssueKey,
  validateJiraProjectKey,
} from './privacyGuard.js';

export const MISSING_CONTEXT_TEXT = 'Not available in the connected context.';

export interface ForgeRoleLink {
  roleId: string;
  roleName: string;
  privacyLevel: 'work_team' | 'work_restricted';
  issueKeys: string[];
  pageIds: string[];
  updatedAt: string;
}

export interface ForgeCapturedContextItem {
  id: string;
  roleId: string;
  roleName: string;
  sourceKind: 'jira' | 'confluence';
  sourceId: string;
  title: string;
  summary: string;
  openUrl: string;
  privacyLevel: 'work_team' | 'work_restricted';
  capturedAt: string;
}

export interface ForgeSavedDecision {
  id: string;
  roleName: string;
  title: string;
  reasoning: string;
  sourceRef: string;
  openUrl?: string;
  privacyLevel: 'work_team' | 'work_restricted';
  createdAt: string;
}

export interface ForgeSavedHandoff {
  id: string;
  roleName: string;
  currentSituation: string;
  nextAction: string;
  remainingWork: string[];
  waitingOn: string;
  linkedIssueKey?: string;
  privacyLevel: 'work_team' | 'work_restricted';
  createdAt: string;
}

export interface ForgeUserVault {
  accountId: string;
  roleLinks: ForgeRoleLink[];
  captures: ForgeCapturedContextItem[];
  decisions: ForgeSavedDecision[];
  handoffs: ForgeSavedHandoff[];
  updatedAt: string;
}

export interface ForgeJiraIssueSummary {
  key: string;
  summary: string;
  status: string;
  projectKey: string;
  assignee?: string;
  openUrl?: string;
  updatedAt: string;
}

export interface ForgeConfluencePageSummary {
  id: string;
  title: string;
  spaceKey: string;
  excerpt: string;
  openUrl?: string;
  updatedAt: string;
}

export interface ForgeReentryBriefResult {
  roleName: string;
  generatedAt: string;
  groundingNote: string;
  observedFacts: string[];
  confirmedDecisions: ForgeSavedDecision[];
  inferredSuggestions: string[];
  captures: ForgeCapturedContextItem[];
  citations: Array<{
    kind: 'jira' | 'confluence' | 'handoff' | 'decision' | 'capture';
    id: string;
    label: string;
    openUrl?: string;
  }>;
  questions: {
    whatWasWorkingOn: string;
    whyItMatters: string;
    lastCompleted: string;
    stillUnfinished: string;
    decisionsAlreadyMade: string;
    waitingOnWhom: string;
    whatCanSafelyWait: string;
    upcomingDeadlines: string;
    nextMeaningfulAction: string;
  };
  missingFields: string[];
}

export interface ForgeAdapters {
  getUserAccountId: () => string;
  kvsGet: <T>(key: string) => Promise<T | undefined>;
  kvsSet: (key: string, value: unknown) => Promise<void>;
  fetchJiraIssues: (jql: string) => Promise<ForgeJiraIssueSummary[]>;
  fetchJiraIssueByKey: (issueKey: string) => Promise<ForgeJiraIssueSummary | null>;
  createJiraIssue: (payload: {
    projectKey: string;
    summary: string;
    description: string;
    issueType?: string;
  }) => Promise<{ id: string; key: string }>;
  searchConfluencePages: (query: string) => Promise<ForgeConfluencePageSummary[]>;
  fetchConfluencePageById: (pageId: string) => Promise<ForgeConfluencePageSummary | null>;
}

function vaultKey(accountId: string): string {
  const clean = (accountId || 'anonymous').replace(/[^a-zA-Z0-9:_-]/g, '_');
  return `hatbridge:vault:${clean}`;
}

export function sanitizeAtlassianPathOrUrl(raw?: string): string | undefined {
  const val = (raw || '').trim();
  if (!val) return undefined;
  if (val.startsWith('/') && !val.startsWith('//')) return val;
  if (/^https:\/\/[a-zA-Z0-9.-]+\.atlassian\.net(\/|$)/i.test(val)) return val;
  return undefined;
}

export function safeRoleId(roleName: string, explicitRoleId?: string): string {
  const cleanExplicit = (explicitRoleId || '').trim();
  if (cleanExplicit) return cleanExplicit.slice(0, 80);
  const slug = (roleName || 'workplace-hat')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `role-${slug || 'workplace-hat'}`;
}

export async function loadUserVault(adapters: ForgeAdapters): Promise<ForgeUserVault> {
  const accountId = adapters.getUserAccountId();
  const existing = await adapters.kvsGet<ForgeUserVault>(vaultKey(accountId));
  if (existing && existing.accountId === accountId) {
    return {
      accountId: existing.accountId,
      roleLinks: Array.isArray(existing.roleLinks) ? existing.roleLinks : [],
      captures: Array.isArray(existing.captures) ? existing.captures : [],
      decisions: Array.isArray(existing.decisions) ? existing.decisions : [],
      handoffs: Array.isArray(existing.handoffs) ? existing.handoffs : [],
      updatedAt: existing.updatedAt || new Date().toISOString(),
    };
  }
  return {
    accountId,
    roleLinks: [],
    captures: [],
    decisions: [],
    handoffs: [],
    updatedAt: new Date().toISOString(),
  };
}

export async function saveUserVault(adapters: ForgeAdapters, vault: ForgeUserVault): Promise<ForgeUserVault> {
  const updated: ForgeUserVault = {
    ...vault,
    updatedAt: new Date().toISOString(),
  };
  await adapters.kvsSet(vaultKey(adapters.getUserAccountId()), updated);
  return updated;
}

export async function getWorkspaceSnapshot(
  adapters: ForgeAdapters,
  context: { issueKey?: string; pageId?: string }
): Promise<{
  accountId: string;
  vault: ForgeUserVault;
  currentIssue: ForgeJiraIssueSummary | null;
  currentPage: ForgeConfluencePageSummary | null;
  recentIssues: ForgeJiraIssueSummary[];
  recentPages: ForgeConfluencePageSummary[];
}> {
  const vault = await loadUserVault(adapters);

  let currentIssue: ForgeJiraIssueSummary | null = null;
  if (context.issueKey) {
    const cleanKey = validateJiraIssueKey(context.issueKey);
    currentIssue = await adapters.fetchJiraIssueByKey(cleanKey);
  }

  let currentPage: ForgeConfluencePageSummary | null = null;
  if (context.pageId) {
    const cleanId = validateConfluencePageId(context.pageId);
    currentPage = await adapters.fetchConfluencePageById(cleanId);
  }

  const [recentIssues, recentPages] = await Promise.all([
    adapters.fetchJiraIssues('ORDER BY updated DESC').catch(() => []),
    adapters.searchConfluencePages('').catch(() => []),
  ]);

  return {
    accountId: vault.accountId,
    vault,
    currentIssue,
    currentPage,
    recentIssues: recentIssues.slice(0, 10),
    recentPages: recentPages.slice(0, 10),
  };
}

function upsertRoleLinkInVault(
  vault: ForgeUserVault,
  params: {
    roleId: string;
    roleName: string;
    privacyLevel: 'work_team' | 'work_restricted';
    issueKey?: string;
    pageId?: string;
  }
): void {
  const existingIdx = vault.roleLinks.findIndex(
    (r) => r.roleId === params.roleId || r.roleName.toLowerCase() === params.roleName.trim().toLowerCase()
  );
  const now = new Date().toISOString();

  if (existingIdx >= 0) {
    const current = vault.roleLinks[existingIdx];
    const nextKeys =
      params.issueKey && !current.issueKeys.includes(params.issueKey)
        ? [...current.issueKeys, params.issueKey]
        : current.issueKeys;
    const nextIds =
      params.pageId && !current.pageIds.includes(params.pageId)
        ? [...current.pageIds, params.pageId]
        : current.pageIds;
    vault.roleLinks[existingIdx] = {
      ...current,
      roleName: params.roleName.trim() || current.roleName,
      privacyLevel: params.privacyLevel,
      issueKeys: nextKeys,
      pageIds: nextIds,
      updatedAt: now,
    };
  } else {
    vault.roleLinks.push({
      roleId: params.roleId,
      roleName: params.roleName.trim() || 'Linked Workplace Hat',
      privacyLevel: params.privacyLevel,
      issueKeys: params.issueKey ? [params.issueKey] : [],
      pageIds: params.pageId ? [params.pageId] : [],
      updatedAt: now,
    });
  }
}

export async function linkJiraIssueToRole(
  adapters: ForgeAdapters,
  params: { roleId: string; roleName: string; issueKey: string; privacyLevel?: string }
): Promise<ForgeUserVault> {
  const privacy = (params.privacyLevel || 'work_team') as 'work_team' | 'work_restricted';
  assertWorkplaceExportAllowed(privacy);
  const cleanKey = validateJiraIssueKey(params.issueKey);
  const issue = await adapters.fetchJiraIssueByKey(cleanKey);
  if (!issue) {
    throw new ForgeBoundaryError('ISSUE_NOT_ACCESSIBLE', `Jira issue ${cleanKey} could not be accessed by current user.`);
  }

  const vault = await loadUserVault(adapters);
  const roleName = params.roleName.trim() || 'Linked Workplace Hat';
  upsertRoleLinkInVault(vault, {
    roleId: safeRoleId(roleName, params.roleId),
    roleName,
    privacyLevel: privacy,
    issueKey: cleanKey,
  });

  return saveUserVault(adapters, vault);
}

export async function linkConfluencePageToRole(
  adapters: ForgeAdapters,
  params: { roleId: string; roleName: string; pageId: string; privacyLevel?: string }
): Promise<ForgeUserVault> {
  const privacy = (params.privacyLevel || 'work_team') as 'work_team' | 'work_restricted';
  assertWorkplaceExportAllowed(privacy);
  const cleanPageId = validateConfluencePageId(params.pageId);
  const page = await adapters.fetchConfluencePageById(cleanPageId);
  if (!page) {
    throw new ForgeBoundaryError('PAGE_NOT_ACCESSIBLE', `Confluence page ${cleanPageId} could not be accessed by current user.`);
  }

  const vault = await loadUserVault(adapters);
  const roleName = params.roleName.trim() || 'Linked Workplace Hat';
  upsertRoleLinkInVault(vault, {
    roleId: safeRoleId(roleName, params.roleId),
    roleName,
    privacyLevel: privacy,
    pageId: cleanPageId,
  });

  return saveUserVault(adapters, vault);
}

export async function captureJiraOrConfluenceContext(
  adapters: ForgeAdapters,
  params: {
    sourceKind: 'jira' | 'confluence';
    sourceId: string;
    roleId?: string;
    roleName: string;
    note?: string;
    privacyLevel?: string;
  }
): Promise<{ capture: ForgeCapturedContextItem; vault: ForgeUserVault }> {
  const privacy = (params.privacyLevel || 'work_team') as 'work_team' | 'work_restricted';
  assertWorkplaceExportAllowed(privacy);
  const roleName = (params.roleName || '').trim() || 'Workplace Hat';
  const roleId = safeRoleId(roleName, params.roleId);
  const vault = await loadUserVault(adapters);

  let capture: ForgeCapturedContextItem;

  if (params.sourceKind === 'jira') {
    const cleanKey = validateJiraIssueKey(params.sourceId);
    const issue = await adapters.fetchJiraIssueByKey(cleanKey);
    if (!issue) {
      throw new ForgeBoundaryError(
        'ISSUE_NOT_ACCESSIBLE',
        `Jira issue ${cleanKey} could not be accessed by the signed-in user.`
      );
    }
    upsertRoleLinkInVault(vault, {
      roleId,
      roleName,
      privacyLevel: privacy,
      issueKey: cleanKey,
    });
    capture = {
      id: `fcap-jira-${cleanKey}-${Date.now()}`,
      roleId,
      roleName,
      sourceKind: 'jira',
      sourceId: cleanKey,
      title: `${cleanKey}: ${issue.summary}`,
      summary: (params.note || '').trim().slice(0, 500) || `Jira status: ${issue.status}`,
      openUrl: sanitizeAtlassianPathOrUrl(issue.openUrl) || `/browse/${encodeURIComponent(cleanKey)}`,
      privacyLevel: privacy,
      capturedAt: new Date().toISOString(),
    };
  } else {
    const cleanPageId = validateConfluencePageId(params.sourceId);
    const page = await adapters.fetchConfluencePageById(cleanPageId);
    if (!page) {
      throw new ForgeBoundaryError(
        'PAGE_NOT_ACCESSIBLE',
        `Confluence page ${cleanPageId} could not be accessed by the signed-in user.`
      );
    }
    upsertRoleLinkInVault(vault, {
      roleId,
      roleName,
      privacyLevel: privacy,
      pageId: cleanPageId,
    });
    capture = {
      id: `fcap-conf-${cleanPageId}-${Date.now()}`,
      roleId,
      roleName,
      sourceKind: 'confluence',
      sourceId: cleanPageId,
      title: page.title,
      summary: (params.note || '').trim().slice(0, 500) || page.excerpt || `Confluence Space ${page.spaceKey}`,
      openUrl: sanitizeAtlassianPathOrUrl(page.openUrl) || `/wiki/pages/${encodeURIComponent(cleanPageId)}`,
      privacyLevel: privacy,
      capturedAt: new Date().toISOString(),
    };
  }

  vault.captures = [
    capture,
    ...vault.captures.filter(
      (c) => !(c.roleId === capture.roleId && c.sourceKind === capture.sourceKind && c.sourceId === capture.sourceId)
    ),
  ].slice(0, 60);

  const saved = await saveUserVault(adapters, vault);
  return { capture, vault: saved };
}

export async function removeCapturedContextItem(
  adapters: ForgeAdapters,
  captureId: string
): Promise<ForgeUserVault> {
  const cleanId = (captureId || '').trim();
  const vault = await loadUserVault(adapters);
  vault.captures = vault.captures.filter((c) => c.id !== cleanId);
  return saveUserVault(adapters, vault);
}

export async function saveWorkplaceHandoff(
  adapters: ForgeAdapters,
  params: {
    roleName: string;
    currentSituation: string;
    nextAction: string;
    remainingWork?: string[];
    waitingOn?: string;
    linkedIssueKey?: string;
    privacyLevel?: string;
  }
): Promise<{ handoff: ForgeSavedHandoff; vault: ForgeUserVault }> {
  assertWorkplaceExportAllowed(params.privacyLevel || 'work_team');
  const vault = await loadUserVault(adapters);
  const handoff: ForgeSavedHandoff = {
    id: `fho-${Date.now()}`,
    roleName: params.roleName.trim() || 'Workplace Hat',
    currentSituation: params.currentSituation.trim().slice(0, 600),
    nextAction: params.nextAction.trim().slice(0, 400),
    remainingWork: (params.remainingWork || []).map((w) => w.trim()).filter(Boolean).slice(0, 10),
    waitingOn: (params.waitingOn || '').trim().slice(0, 240),
    linkedIssueKey: params.linkedIssueKey ? validateJiraIssueKey(params.linkedIssueKey) : undefined,
    privacyLevel: (params.privacyLevel as 'work_team' | 'work_restricted') || 'work_team',
    createdAt: new Date().toISOString(),
  };
  vault.handoffs = [handoff, ...vault.handoffs].slice(0, 50);
  const saved = await saveUserVault(adapters, vault);
  return { handoff, vault: saved };
}

export async function saveWorkplaceDecision(
  adapters: ForgeAdapters,
  params: {
    roleName: string;
    title: string;
    reasoning: string;
    sourceRef?: string;
    openUrl?: string;
    privacyLevel?: string;
  }
): Promise<{ decision: ForgeSavedDecision; vault: ForgeUserVault }> {
  assertWorkplaceExportAllowed(params.privacyLevel || 'work_team');
  const vault = await loadUserVault(adapters);
  const decision: ForgeSavedDecision = {
    id: `fdec-${Date.now()}`,
    roleName: params.roleName.trim() || 'Workplace Hat',
    title: params.title.trim().slice(0, 180),
    reasoning: params.reasoning.trim().slice(0, 800),
    sourceRef: (params.sourceRef || 'Forge KVS User Record').trim().slice(0, 180),
    openUrl: sanitizeAtlassianPathOrUrl(params.openUrl),
    privacyLevel: (params.privacyLevel as 'work_team' | 'work_restricted') || 'work_team',
    createdAt: new Date().toISOString(),
  };
  vault.decisions = [decision, ...vault.decisions].slice(0, 50);
  const saved = await saveUserVault(adapters, vault);
  return { decision, vault: saved };
}

export async function createJiraIssueFromForgeConfirmed(
  adapters: ForgeAdapters,
  params: {
    projectKey: string;
    summary: string;
    description: string;
    issueType?: string;
    privacyLevel?: string;
    confirmedByUser: boolean;
  }
): Promise<{ id: string; key: string; openUrl: string }> {
  assertWorkplaceExportAllowed(params.privacyLevel || 'work_team');
  assertUserConfirmedWrite(params.confirmedByUser, 'creating a Jira issue');
  const cleanProject = validateJiraProjectKey(params.projectKey);
  if (!params.summary.trim()) {
    throw new ForgeBoundaryError('INVALID_SUMMARY', 'Jira issue summary cannot be empty.');
  }
  const created = await adapters.createJiraIssue({
    projectKey: cleanProject,
    summary: params.summary.trim().slice(0, 200),
    description: params.description.trim().slice(0, 4000),
    issueType: params.issueType || 'Task',
  });
  return {
    ...created,
    openUrl: `/browse/${encodeURIComponent(created.key)}`,
  };
}

export async function buildGroundedForgeReentryBrief(
  adapters: ForgeAdapters,
  params: { roleName?: string; issueKey?: string }
): Promise<ForgeReentryBriefResult> {
  const vault = await loadUserVault(adapters);
  const roleLabel =
    (params.roleName || '').trim() ||
    vault.roleLinks[0]?.roleName ||
    vault.captures[0]?.roleName ||
    'Active Workplace Hat';

  const roleLink = vault.roleLinks.find((r) => r.roleName.toLowerCase() === roleLabel.toLowerCase());
  const matchingCaptures = vault.captures.filter(
    (c) => c.roleName.toLowerCase() === roleLabel.toLowerCase()
  );

  const linkedIssueKeys = new Set<string>(roleLink?.issueKeys || []);
  matchingCaptures
    .filter((c) => c.sourceKind === 'jira')
    .forEach((c) => linkedIssueKeys.add(c.sourceId));
  if (params.issueKey) {
    try {
      linkedIssueKeys.add(validateJiraIssueKey(params.issueKey));
    } catch {
      // ignore invalid optional key
    }
  }

  const linkedPageIds = new Set<string>(roleLink?.pageIds || []);
  matchingCaptures
    .filter((c) => c.sourceKind === 'confluence')
    .forEach((c) => linkedPageIds.add(c.sourceId));

  const fetchedIssues: ForgeJiraIssueSummary[] = [];
  for (const key of Array.from(linkedIssueKeys).slice(0, 5)) {
    const issue = await adapters.fetchJiraIssueByKey(key).catch(() => null);
    if (issue) fetchedIssues.push(issue);
  }

  const fetchedPages: ForgeConfluencePageSummary[] = [];
  for (const pid of Array.from(linkedPageIds).slice(0, 5)) {
    const page = await adapters.fetchConfluencePageById(pid).catch(() => null);
    if (page) fetchedPages.push(page);
  }

  const matchingHandoff = vault.handoffs.find(
    (h) => h.roleName.toLowerCase() === roleLabel.toLowerCase()
  );
  const matchingDecisions = vault.decisions.filter(
    (d) => d.roleName.toLowerCase() === roleLabel.toLowerCase()
  );

  const observedFacts: string[] = [];
  const citations: ForgeReentryBriefResult['citations'] = [];

  if (matchingHandoff) {
    observedFacts.push(`Saved handoff (${matchingHandoff.createdAt.slice(0, 10)}): ${matchingHandoff.currentSituation}`);
    citations.push({
      kind: 'handoff',
      id: matchingHandoff.id,
      label: `Handoff (${matchingHandoff.createdAt.slice(0, 10)})`,
    });
  }

  matchingCaptures.slice(0, 4).forEach((cap) => {
    observedFacts.push(`Captured ${cap.sourceKind.toUpperCase()} context (${cap.sourceId}): ${cap.title}`);
    citations.push({
      kind: 'capture',
      id: cap.id,
      label: `${cap.title} (${cap.capturedAt.slice(0, 10)})`,
      openUrl: sanitizeAtlassianPathOrUrl(cap.openUrl),
    });
  });

  fetchedIssues.forEach((iss) => {
    observedFacts.push(`Jira ${iss.key} [${iss.status}]: ${iss.summary}`);
    citations.push({
      kind: 'jira',
      id: iss.key,
      label: `${iss.key} — ${iss.summary}`,
      openUrl: sanitizeAtlassianPathOrUrl(iss.openUrl) || `/browse/${encodeURIComponent(iss.key)}`,
    });
  });

  fetchedPages.forEach((pg) => {
    observedFacts.push(`Confluence "${pg.title}" (${pg.spaceKey})`);
    citations.push({
      kind: 'confluence',
      id: pg.id,
      label: `${pg.title} (${pg.spaceKey})`,
      openUrl: sanitizeAtlassianPathOrUrl(pg.openUrl) || `/wiki/pages/${encodeURIComponent(pg.id)}`,
    });
  });

  matchingDecisions.slice(0, 5).forEach((dec) => {
    observedFacts.push(`Confirmed decision: ${dec.title} [${dec.sourceRef}]`);
    citations.push({
      kind: 'decision',
      id: dec.id,
      label: `${dec.title} (${dec.sourceRef})`,
      openUrl: sanitizeAtlassianPathOrUrl(dec.openUrl),
    });
  });

  const doneIssue = fetchedIssues.find((i) => /done|closed|resolved/i.test(i.status));
  const openIssues = fetchedIssues.filter((i) => !/done|closed|resolved/i.test(i.status));

  const whatCanSafelyWait =
    matchingHandoff && matchingHandoff.remainingWork.length > 1
      ? matchingHandoff.remainingWork.slice(1).join('; ')
      : openIssues.length > 1
        ? openIssues
            .slice(1)
            .map((i) => `${i.key}: ${i.summary}`)
            .join('; ')
        : MISSING_CONTEXT_TEXT;

  const questions = {
    whatWasWorkingOn:
      matchingHandoff?.currentSituation ||
      (matchingCaptures[0]
        ? `${matchingCaptures[0].title} — ${matchingCaptures[0].summary}`
        : fetchedIssues[0]
          ? `${fetchedIssues[0].key}: ${fetchedIssues[0].summary}`
          : MISSING_CONTEXT_TEXT),
    whyItMatters:
      matchingDecisions[0]?.reasoning ||
      (fetchedPages[0]?.excerpt ? `Confluence context: ${fetchedPages[0].excerpt}` : MISSING_CONTEXT_TEXT),
    lastCompleted: doneIssue ? `${doneIssue.key} (${doneIssue.status})` : MISSING_CONTEXT_TEXT,
    stillUnfinished: matchingHandoff?.remainingWork.length
      ? matchingHandoff.remainingWork.join('; ')
      : openIssues.map((i) => `${i.key}: ${i.summary}`).join('; ') || MISSING_CONTEXT_TEXT,
    decisionsAlreadyMade:
      matchingDecisions.length > 0
        ? matchingDecisions.map((d) => `${d.title} (${d.reasoning}) [${d.sourceRef}]`).join(' | ')
        : MISSING_CONTEXT_TEXT,
    waitingOnWhom: matchingHandoff?.waitingOn || MISSING_CONTEXT_TEXT,
    whatCanSafelyWait,
    upcomingDeadlines: MISSING_CONTEXT_TEXT,
    nextMeaningfulAction:
      matchingHandoff?.nextAction ||
      (openIssues[0]
        ? `Review Jira ${openIssues[0].key} (${openIssues[0].summary})`
        : matchingCaptures[0]
          ? `Follow up on captured item: ${matchingCaptures[0].title}`
          : MISSING_CONTEXT_TEXT),
  };

  const missingFields = Object.entries(questions)
    .filter(([, val]) => val === MISSING_CONTEXT_TEXT)
    .map(([key]) => key);

  const inferredSuggestions: string[] = [];
  if (questions.nextMeaningfulAction !== MISSING_CONTEXT_TEXT) {
    inferredSuggestions.push(`Inferred (unconfirmed): Prioritize "${questions.nextMeaningfulAction}" before starting unrelated work.`);
  }
  if (missingFields.length > 0) {
    inferredSuggestions.push(
      'Inferred (unconfirmed): Save a 1-line handoff or decision reference in HatBridge so future re-entry has full context.'
    );
  }

  return {
    roleName: roleLabel,
    generatedAt: new Date().toISOString(),
    groundingNote:
      'Observed facts strictly reflect user-authorized Jira/Confluence records and saved Forge KVS captures, handoffs, and decisions for this account.',
    observedFacts,
    confirmedDecisions: matchingDecisions,
    inferredSuggestions,
    captures: matchingCaptures,
    citations,
    questions,
    missingFields,
  };
}

export async function searchAuthorizedDecisionsAndDocs(
  adapters: ForgeAdapters,
  rawQuery: string
): Promise<{
  query: string;
  vaultDecisions: ForgeSavedDecision[];
  jiraMatches: ForgeJiraIssueSummary[];
  confluenceMatches: ForgeConfluencePageSummary[];
}> {
  const q = sanitizeSearchQuery(rawQuery);
  const lower = q.toLowerCase();
  const vault = await loadUserVault(adapters);

  const vaultDecisions = vault.decisions.filter(
    (d) =>
      !lower ||
      d.title.toLowerCase().includes(lower) ||
      d.reasoning.toLowerCase().includes(lower) ||
      d.roleName.toLowerCase().includes(lower)
  );

  const [jiraMatches, confluenceMatches] = await Promise.all([
    q ? adapters.fetchJiraIssues(`text ~ "${q}" ORDER BY updated DESC`).catch(() => []) : Promise.resolve([]),
    q ? adapters.searchConfluencePages(q).catch(() => []) : Promise.resolve([]),
  ]);

  return {
    query: q,
    vaultDecisions,
    jiraMatches: jiraMatches.slice(0, 6),
    confluenceMatches: confluenceMatches.slice(0, 6),
  };
}
