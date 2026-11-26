// ============================================================================
// CAREBRIDGE FORGE — ROVO AGENT ACTION HANDLERS
// Exports each manifest action handler bound to user-scoped @forge/api & @forge/kvs.
// ============================================================================

import { buildCareBridgeForgeAdapters } from './index.js';
import { CareRovoActionPayload, dispatchCareRovoAction } from './rovoCore.js';

export { dispatchCareRovoAction } from './rovoCore.js';
export type { CareRovoActionPayload } from './rovoCore.js';

function accountIdFromRovoContext(context?: CareRovoActionPayload['context']): string {
  return (context?.principal?.accountId || context?.accountId || '').trim();
}

export async function summarizeCareContext(
  payload: CareRovoActionPayload,
  context?: CareRovoActionPayload['context']
) {
  const adapters = buildCareBridgeForgeAdapters(accountIdFromRovoContext(context));
  return dispatchCareRovoAction(adapters, {
    ...payload,
    actionKey: 'summarize-care-context',
    context,
  });
}

export async function retrieveCareKnowledge(
  payload: CareRovoActionPayload,
  context?: CareRovoActionPayload['context']
) {
  const adapters = buildCareBridgeForgeAdapters(accountIdFromRovoContext(context));
  return dispatchCareRovoAction(adapters, {
    ...payload,
    actionKey: 'retrieve-care-knowledge',
    context,
  });
}

export async function summarizeFollowupTasks(
  payload: CareRovoActionPayload,
  context?: CareRovoActionPayload['context']
) {
  const adapters = buildCareBridgeForgeAdapters(accountIdFromRovoContext(context));
  return dispatchCareRovoAction(adapters, {
    ...payload,
    actionKey: 'summarize-followup-tasks',
    context,
  });
}

export async function prepareCareHandoff(
  payload: CareRovoActionPayload,
  context?: CareRovoActionPayload['context']
) {
  const adapters = buildCareBridgeForgeAdapters(accountIdFromRovoContext(context));
  return dispatchCareRovoAction(adapters, {
    ...payload,
    actionKey: 'prepare-care-handoff',
    context,
  });
}
