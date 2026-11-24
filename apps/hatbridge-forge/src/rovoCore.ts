// ============================================================================
// HATBRIDGE FORGE — ROVO ACTION CORE DISPATCHER
// Pure adapter-injected Rovo logic used by rovoActions.ts and automated tests.
// ============================================================================

import {
  buildGroundedForgeReentryBrief,
  ForgeAdapters,
  MISSING_CONTEXT_TEXT,
  searchAuthorizedDecisionsAndDocs,
} from './coreService.js';

export interface RovoActionPayload {
  actionKey?: string;
  action?: string;
  roleName?: string;
  issueKey?: string;
  query?: string;
  context?: {
    accountId?: string;
    cloudId?: string;
    principal?: { accountId?: string };
    extension?: { key?: string };
  };
}

export async function dispatchRovoActionWithAdapters(
  adapters: ForgeAdapters,
  payload: RovoActionPayload
): Promise<Record<string, unknown>> {
  const key = payload.actionKey || payload.action || payload.context?.extension?.key || 'get-reentry-brief';

  if (key === 'get-reentry-brief') {
    const brief = await buildGroundedForgeReentryBrief(adapters, {
      roleName: payload.roleName,
      issueKey: payload.issueKey,
    });
    return {
      action: 'get-reentry-brief',
      brief,
      confirmedDecisions: brief.confirmedDecisions,
      inferredSuggestions: brief.inferredSuggestions,
      capturesCount: brief.captures.length,
      groundingSummary: brief.groundingNote,
    };
  }

  if (key === 'search-authorized-decisions') {
    const search = await searchAuthorizedDecisionsAndDocs(adapters, payload.query || '');
    return {
      action: 'search-authorized-decisions',
      query: search.query,
      observedDecisions: search.vaultDecisions,
      authorizedJiraMatches: search.jiraMatches,
      authorizedConfluenceMatches: search.confluenceMatches,
      groundingNote:
        search.vaultDecisions.length === 0 &&
        search.jiraMatches.length === 0 &&
        search.confluenceMatches.length === 0
          ? MISSING_CONTEXT_TEXT
          : 'Only user-authorized workplace decisions, Jira issues, and Confluence pages are returned.',
    };
  }

  if (key === 'prepare-role-handoff') {
    const brief = await buildGroundedForgeReentryBrief(adapters, {
      roleName: payload.roleName,
      issueKey: payload.issueKey,
    });
    return {
      action: 'prepare-role-handoff',
      roleName: brief.roleName,
      draftOnlyNotice: 'Draft prepared from observed facts—confirm and save in HatBridge before switching.',
      proposedCurrentSituation: brief.questions.whatWasWorkingOn,
      proposedRemainingWork: brief.questions.stillUnfinished,
      proposedNextAction: brief.questions.nextMeaningfulAction,
      whatCanSafelyWait: brief.questions.whatCanSafelyWait,
      citations: brief.citations,
    };
  }

  if (key === 'suggest-next-action') {
    const brief = await buildGroundedForgeReentryBrief(adapters, {
      roleName: payload.roleName,
      issueKey: payload.issueKey,
    });
    return {
      action: 'suggest-next-action',
      roleName: brief.roleName,
      observedFacts: brief.observedFacts,
      confirmedDecisions: brief.confirmedDecisions,
      suggestedNextAction: brief.questions.nextMeaningfulAction,
      inferredSuggestions: brief.inferredSuggestions,
      citations: brief.citations,
      requiresUserApproval: true,
    };
  }

  return {
    error: `Unknown Rovo action "${key}".`,
    supportedActions: [
      'get-reentry-brief',
      'search-authorized-decisions',
      'prepare-role-handoff',
      'suggest-next-action',
    ],
  };
}
