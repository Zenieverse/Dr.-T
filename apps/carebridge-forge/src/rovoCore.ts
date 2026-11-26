// ============================================================================
// CAREBRIDGE FORGE — ROVO AGENT DISPATCH CORE
// Handles the 4 manifest Rovo actions with strict non-diagnostic guardrails,
// explicit missing-context reporting, and unverified AI labeling.
// ============================================================================

import {
  buildCareReentryBriefInForge,
  CareBridgeForgeAdapters,
  loadCareVault,
} from './coreService.js';
import { sanitizeSearchQuery } from './privacyGuard.js';

export type CareRovoActionKey =
  | 'summarize-care-context'
  | 'retrieve-care-knowledge'
  | 'summarize-followup-tasks'
  | 'prepare-care-handoff';

export interface CareRovoActionPayload {
  actionKey?: CareRovoActionKey;
  contextRef?: string;
  issueKey?: string;
  query?: string;
  statusFilter?: string;
  context?: {
    accountId?: string;
    principal?: { accountId?: string };
    extension?: {
      issue?: { key?: string };
      request?: { key?: string };
    };
  };
}

export async function dispatchCareRovoAction(
  adapters: CareBridgeForgeAdapters,
  payload: CareRovoActionPayload
) {
  const actionKey: CareRovoActionKey = payload.actionKey || 'summarize-care-context';
  const unverifiedBanner = 'AI-Generated Output — Unverified until reviewed by an authorized human';
  const nonClinicalNotice =
    'CareBridge Healthcare Navigator assists with non-emergency care coordination and documentation lookup only. Not a clinician or diagnostic system.';

  if (actionKey === 'retrieve-care-knowledge') {
    const query = sanitizeSearchQuery(payload.query || '');
    const pages = await adapters.searchConfluencePages(query).catch(() => []);
    return {
      actionKey,
      unverifiedBanner,
      nonClinicalNotice,
      verifiedSourcePages: pages.map((pg) => ({
        id: pg.id,
        title: pg.title,
        spaceKey: pg.spaceKey,
        excerpt: pg.excerpt,
        openUrl: pg.openUrl,
      })),
      missingInformation:
        pages.length === 0
          ? ['No authorized Confluence pages matched this topic in current user scope.']
          : [],
    };
  }

  if (actionKey === 'summarize-followup-tasks') {
    const vault = await loadCareVault(adapters);
    const filter = (payload.statusFilter || '').trim().toLowerCase();
    const tasks = filter ? vault.tasks.filter((t) => t.status.toLowerCase() === filter) : vault.tasks;
    const missingDue = tasks.filter((t) => !t.dueDate).length;
    const missingInformation: string[] = [];
    if (tasks.length === 0) missingInformation.push('No CareBridge follow-up tasks matched the requested filter.');
    if (missingDue > 0) missingInformation.push(`${missingDue} task(s) do not yet have a confirmed target due date.`);

    return {
      actionKey,
      unverifiedBanner,
      nonClinicalNotice,
      userRecordedTasks: tasks.slice(0, 15).map((t) => ({
        id: t.id,
        contextRef: t.contextRef,
        description: t.description,
        priority: t.priority,
        status: t.status,
        dueDate: t.dueDate || null,
        responsibleAssignee: t.responsibleAssignee,
        jsmRequestKey: t.jsmRequestKey || null,
      })),
      missingInformation,
    };
  }

  // 'summarize-care-context' or 'prepare-care-handoff' -> 4-bucket brief
  const issueKey =
    payload.issueKey || payload.context?.extension?.request?.key || payload.context?.extension?.issue?.key;
  const brief = await buildCareReentryBriefInForge(adapters, {
    issueKey,
    query: payload.contextRef || payload.query,
  });

  return {
    actionKey,
    unverifiedBanner,
    nonClinicalNotice,
    brief,
  };
}
