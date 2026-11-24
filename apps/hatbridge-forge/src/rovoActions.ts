// ============================================================================
// HATBRIDGE FORGE — ROVO AGENT ACTION HANDLER ENTRYPOINTS
// Maps each manifest action function (getReentryBrief, searchAuthorizedDecisions,
// prepareRoleHandoff, suggestNextAction) to @forge/api asUser() + @forge/kvs.
// ============================================================================

import { buildLiveForgeAdapters } from './index.js';
import { dispatchRovoActionWithAdapters, RovoActionPayload } from './rovoCore.js';

export { dispatchRovoActionWithAdapters } from './rovoCore.js';
export type { RovoActionPayload } from './rovoCore.js';

function accountIdFromRovoContext(context?: RovoActionPayload['context']): string {
  // Never read arbitrary user/account IDs from Rovo user prompt inputs; use Forge verified context.
  return (context?.principal?.accountId || context?.accountId || '').trim();
}

export async function getReentryBrief(payload: RovoActionPayload, context?: RovoActionPayload['context']) {
  const adapters = buildLiveForgeAdapters(accountIdFromRovoContext(context));
  return dispatchRovoActionWithAdapters(adapters, {
    ...payload,
    actionKey: 'get-reentry-brief',
    context,
  });
}

export async function searchAuthorizedDecisions(payload: RovoActionPayload, context?: RovoActionPayload['context']) {
  const adapters = buildLiveForgeAdapters(accountIdFromRovoContext(context));
  return dispatchRovoActionWithAdapters(adapters, {
    ...payload,
    actionKey: 'search-authorized-decisions',
    context,
  });
}

export async function prepareRoleHandoff(payload: RovoActionPayload, context?: RovoActionPayload['context']) {
  const adapters = buildLiveForgeAdapters(accountIdFromRovoContext(context));
  return dispatchRovoActionWithAdapters(adapters, {
    ...payload,
    actionKey: 'prepare-role-handoff',
    context,
  });
}

export async function suggestNextAction(payload: RovoActionPayload, context?: RovoActionPayload['context']) {
  const adapters = buildLiveForgeAdapters(accountIdFromRovoContext(context));
  return dispatchRovoActionWithAdapters(adapters, {
    ...payload,
    actionKey: 'suggest-next-action',
    context,
  });
}

export async function rovoHandler(payload: RovoActionPayload, context?: RovoActionPayload['context']) {
  const adapters = buildLiveForgeAdapters(accountIdFromRovoContext(context));
  return dispatchRovoActionWithAdapters(adapters, { ...payload, context });
}
