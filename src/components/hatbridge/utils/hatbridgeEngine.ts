// ============================================================================
// DR. T — HATBRIDGE DETERMINISTIC ENGINE
// Grounded Re-entry Brief builder, Conflict Detection, Time Load Calculator,
// Decision Search, Handoff Pre-filler & Privacy Boundary Guardrails.
// Zero fabrication: missing fields explicitly report "Not available in the connected context."
// ============================================================================

import {
  HatBridgeAnalyticsSnapshot,
  HatBridgeAtlassianIssue,
  HatBridgeConfluencePage,
  HatBridgeConflict,
  HatBridgeContextItem,
  HatBridgeDecision,
  HatBridgeHandoff,
  HatBridgeReentryBrief,
  HatBridgeRole,
  HatBridgeStructuredAiResponse,
  HatBridgeTimeBlock,
} from '../../../types/hatbridgeTypes';

export const MISSING_CONTEXT_TEXT = 'Not available in the connected context.';

function parseTimeToMinutes(hhmm?: string): number | null {
  if (!hhmm || !/^\d{2}:\d{2}$/.test(hhmm)) return null;
  const [h, m] = hhmm.split(':').map(Number);
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return h * 60 + m;
}

function intervalsOverlap(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return Math.max(aStart, bStart) < Math.min(aEnd, bEnd);
}

// ============================================================================
// 1. CROSS-ROLE CONFLICT & PROTECTED TIME DETECTOR
// Never silently alters schedules — surfaces explanations & resolution choices.
// ============================================================================
export function detectCrossRoleConflicts(params: {
  contextItems: HatBridgeContextItem[];
  timeBlocks: HatBridgeTimeBlock[];
  roles: HatBridgeRole[];
}): HatBridgeConflict[] {
  const { contextItems, timeBlocks, roles } = params;
  const roleMap = new Map(roles.map((r) => [r.id, r]));
  const conflicts: HatBridgeConflict[] = [];

  const activeItems = contextItems.filter(
    (item) =>
      item.commitmentStatus !== 'completed' &&
      item.commitmentStatus !== 'deferred' &&
      item.dueDate &&
      item.startTime &&
      item.endTime
  );

  // Check commitment-vs-commitment overlap across different roles
  for (let i = 0; i < activeItems.length; i++) {
    const a = activeItems[i];
    const aStart = parseTimeToMinutes(a.startTime);
    const aEnd = parseTimeToMinutes(a.endTime);
    if (aStart === null || aEnd === null || aEnd <= aStart) continue;

    for (let j = i + 1; j < activeItems.length; j++) {
      const b = activeItems[j];
      if (a.dueDate !== b.dueDate) continue;
      const bStart = parseTimeToMinutes(b.startTime);
      const bEnd = parseTimeToMinutes(b.endTime);
      if (bStart === null || bEnd === null || bEnd <= bStart) continue;

      if (intervalsOverlap(aStart, aEnd, bStart, bEnd)) {
        const roleA = roleMap.get(a.roleId)?.name || 'Role A';
        const roleB = roleMap.get(b.roleId)?.name || 'Role B';
        conflicts.push({
          id: `conflict-${a.id}-${b.id}`,
          severity: a.roleId !== b.roleId ? 'high' : 'attention',
          title: `${roleA} overlaps with ${roleB}`,
          explanation: `"${a.title}" (${a.startTime}–${a.endTime}) overlaps with "${b.title}" (${b.startTime}–${b.endTime}) on ${a.dueDate}.`,
          itemAId: a.id,
          itemALabel: `${roleA}: ${a.title}`,
          itemBId: b.id,
          itemBLabel: `${roleB}: ${b.title}`,
          involvesProtectedTime: false,
          suggestedResolution: `Shift "${b.title}" after ${a.endTime} or defer the lower-urgency item after confirming with participants.`,
          recommendedActionType: a.priority === 'high' && b.priority !== 'high' ? 'defer_item_b' : 'reschedule_slot',
        });
      }
    }

    // Check commitment-vs-protected-time conflict
    for (const block of timeBlocks) {
      if (!block.protected || block.date !== a.dueDate) continue;
      const bStart = parseTimeToMinutes(block.startTime);
      const bEnd = parseTimeToMinutes(block.endTime);
      if (bStart === null || bEnd === null || bEnd <= bStart) continue;

      if (intervalsOverlap(aStart, aEnd, bStart, bEnd)) {
        const roleA = roleMap.get(a.roleId)?.name || 'Role';
        conflicts.push({
          id: `conflict-prot-${a.id}-${block.id}`,
          severity: 'high',
          title: `Commitment overlaps Protected ${block.category} window`,
          explanation: `${roleA} item "${a.title}" (${a.startTime}–${a.endTime}) runs into protected block "${block.title}" (${block.startTime}–${block.endTime}).`,
          itemAId: a.id,
          itemALabel: `${roleA}: ${a.title}`,
          itemBId: block.id,
          itemBLabel: `Protected: ${block.title}`,
          involvesProtectedTime: true,
          suggestedResolution: `Honor "${block.title}" by deferring or moving "${a.title}" earlier in the day.`,
          recommendedActionType: 'protect_boundary',
        });
      }
    }
  }

  return conflicts;
}

// ============================================================================
// 2. TIME PROTECTION WORKLOAD ASSESSMENT (Human-first, zero guilt)
// ============================================================================
export interface DailyWorkloadOverview {
  date: string;
  committedMinutes: number;
  protectedMinutes: number;
  sustainableMinutes: number;
  isOverloaded: boolean;
  calmNotice: string;
}

export function calculateDailyWorkload(params: {
  date: string;
  contextItems: HatBridgeContextItem[];
  timeBlocks: HatBridgeTimeBlock[];
  sustainableDailyHours: number;
}): DailyWorkloadOverview {
  const { date, contextItems, timeBlocks, sustainableDailyHours } = params;
  const activeDayItems = contextItems.filter(
    (c) =>
      c.commitmentStatus !== 'completed' &&
      c.commitmentStatus !== 'deferred' &&
      (c.dueDate === date || (!c.dueDate && c.commitmentStatus === 'urgent'))
  );

  const committedMinutes = activeDayItems.reduce((sum, item) => {
    if (typeof item.estimatedMinutes === 'number' && item.estimatedMinutes > 0) {
      return sum + item.estimatedMinutes;
    }
    const s = parseTimeToMinutes(item.startTime);
    const e = parseTimeToMinutes(item.endTime);
    if (s !== null && e !== null && e > s) return sum + (e - s);
    return sum + 30;
  }, 0);

  const protectedMinutes = timeBlocks
    .filter((b) => b.protected && b.date === date)
    .reduce((sum, b) => {
      const s = parseTimeToMinutes(b.startTime);
      const e = parseTimeToMinutes(b.endTime);
      return sum + (s !== null && e !== null && e > s ? e - s : 60);
    }, 0);

  const sustainableMinutes = Math.max(2, sustainableDailyHours) * 60;
  const isOverloaded = committedMinutes > sustainableMinutes;
  const hours = (committedMinutes / 60).toFixed(1);

  const calmNotice = isOverloaded
    ? `Planned commitments total ~${hours}h today, above your ${sustainableDailyHours}h sustainable boundary. Consider deferring non-urgent items so protected rest stays intact.`
    : committedMinutes === 0
      ? `No timed commitments logged for ${date}. Protected windows remain open.`
      : `Planned workload is ~${hours}h within your ${sustainableDailyHours}h sustainable ceiling, leaving room for protected time.`;

  return {
    date,
    committedMinutes,
    protectedMinutes,
    sustainableMinutes,
    isOverloaded,
    calmNotice,
  };
}

// ============================================================================
// 3. SIGNATURE GROUNDED RE-ENTRY BRIEF BUILDER (ZERO FABRICATION)
// ============================================================================
export function buildDeterministicReentryBrief(params: {
  userId: string;
  role: HatBridgeRole;
  contextItems: HatBridgeContextItem[];
  decisions: HatBridgeDecision[];
  handoffs: HatBridgeHandoff[];
  timeBlocks: HatBridgeTimeBlock[];
  jiraIssues?: HatBridgeAtlassianIssue[];
  confluencePages?: HatBridgeConfluencePage[];
}): HatBridgeReentryBrief {
  const {
    userId,
    role,
    contextItems,
    decisions,
    handoffs,
    timeBlocks,
    jiraIssues = [],
    confluencePages = [],
  } = params;

  const nowIso = new Date().toISOString();
  const todayStr = nowIso.slice(0, 10);

  const roleItems = contextItems
    .filter((i) => i.roleId === role.id)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  const roleDecisions = decisions
    .filter((d) => d.roleId === role.id)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  const roleHandoffs = handoffs
    .filter((h) => h.fromRoleId === role.id || h.toRoleId === role.id)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  const roleIssues = jiraIssues.filter((issue) => issue.linkedRoleId === role.id);
  const rolePages = confluencePages.filter((page) => page.linkedRoleId === role.id);

  const latestHandoff = roleHandoffs.find((h) => h.fromRoleId === role.id) || roleHandoffs[0];
  const latestItem = roleItems[0];
  const activeUnfinished = roleItems.filter(
    (i) => i.commitmentStatus !== 'completed' && i.commitmentStatus !== 'deferred'
  );
  const waitingItems = roleItems.filter(
    (i) => i.commitmentStatus === 'waiting' || Boolean(i.waitingOnPerson)
  );
  const deferredItems = roleItems.filter(
    (i) => i.commitmentStatus === 'deferred' || (i.priority === 'low' && i.commitmentStatus !== 'completed')
  );
  const confirmedDecisions = roleDecisions.filter((d) => d.status === 'confirmed');
  const openDecisions = roleDecisions.filter((d) => d.status === 'waiting_approval' || d.status === 'proposed');

  const datedItems = activeUnfinished
    .filter((i) => Boolean(i.dueDate))
    .sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''));

  const protectedToday = timeBlocks.filter((b) => b.protected && b.date === todayStr);

  const observedFacts: string[] = [];
  const missingInformation: string[] = [];
  const sourceReferences: HatBridgeReentryBrief['sourceReferences'] = [];

  // Q1. What was I working on?
  let whatWasWorkingOn = MISSING_CONTEXT_TEXT;
  if (latestHandoff?.currentSituation) {
    whatWasWorkingOn = latestHandoff.currentSituation;
    observedFacts.push(`Saved handoff situation: ${latestHandoff.currentSituation}`);
    sourceReferences.push({ label: 'Saved Handoff', kind: 'handoff', id: latestHandoff.id });
  } else if (latestItem) {
    whatWasWorkingOn = `${latestItem.title}${latestItem.relatedProject ? ` (${latestItem.relatedProject})` : ''}`;
    observedFacts.push(`Latest captured item: ${latestItem.title}`);
    sourceReferences.push({ label: latestItem.title, kind: 'context_item', id: latestItem.id });
  } else if (role.activeProjects.length > 0) {
    whatWasWorkingOn = role.activeProjects[0];
    observedFacts.push(`Role active project: ${role.activeProjects[0]}`);
  } else {
    missingInformation.push('No recent active task or handoff was found for this hat.');
  }

  // Q2. What was the last meaningful update?
  let lastMeaningfulUpdate = MISSING_CONTEXT_TEXT;
  if (latestItem) {
    lastMeaningfulUpdate = `${latestItem.title}: ${latestItem.content}`;
    observedFacts.push(`Last updated note (${latestItem.updatedAt.slice(0, 10)}): ${latestItem.title}`);
  } else if (rolePages[0]) {
    lastMeaningfulUpdate = `Confluence "${rolePages[0].title}": ${rolePages[0].excerpt}`;
    sourceReferences.push({
      label: `Confluence: ${rolePages[0].title}`,
      kind: 'confluence',
      id: rolePages[0].id,
      url: rolePages[0].url,
    });
  } else {
    missingInformation.push('No recent captured update or linked Confluence update found.');
  }

  // Q3. What decisions have already been made?
  let decisionsAlreadyMade = MISSING_CONTEXT_TEXT;
  if (confirmedDecisions.length > 0) {
    decisionsAlreadyMade = confirmedDecisions
      .slice(0, 3)
      .map((d) => `${d.title} — ${d.decision}`)
      .join(' | ');
    confirmedDecisions.slice(0, 3).forEach((d) => {
      observedFacts.push(`Confirmed decision: ${d.title}`);
      sourceReferences.push({
        label: `Decision: ${d.title}`,
        kind: 'decision',
        id: d.id,
        url: d.supportingUrl,
      });
    });
  } else if (openDecisions.length > 0) {
    decisionsAlreadyMade = `No final confirmed decisions yet; ${openDecisions.length} pending decision(s): ${openDecisions[0].title} (${openDecisions[0].status.replace('_', ' ')}).`;
    sourceReferences.push({ label: `Open Decision: ${openDecisions[0].title}`, kind: 'decision', id: openDecisions[0].id });
  } else if (role.recentDecisions.length > 0) {
    decisionsAlreadyMade = role.recentDecisions.join('; ');
  } else {
    missingInformation.push('No recorded decisions linked to this hat yet.');
  }

  // Q4. What remains unfinished?
  let whatRemainsUnfinished = MISSING_CONTEXT_TEXT;
  const remainingParts: string[] = [];
  if (latestHandoff && latestHandoff.remainingWork.length > 0) {
    remainingParts.push(...latestHandoff.remainingWork);
  }
  activeUnfinished.slice(0, 3).forEach((item) => {
    if (!remainingParts.includes(item.title)) remainingParts.push(item.title);
  });
  roleIssues
    .filter((j) => j.status.toLowerCase() !== 'done')
    .slice(0, 3)
    .forEach((j) => {
      remainingParts.push(`${j.key}: ${j.summary} (${j.status})`);
      sourceReferences.push({ label: `Jira ${j.key}`, kind: 'jira', id: j.key, url: j.url });
    });
  if (remainingParts.length > 0) {
    whatRemainsUnfinished = remainingParts.join(' · ');
  } else if (role.unfinishedWork.length > 0) {
    whatRemainsUnfinished = role.unfinishedWork.join(' · ');
  } else {
    missingInformation.push('No unfinished items recorded for this hat.');
  }

  // Q5. Who is waiting for a response?
  let whoIsWaiting = MISSING_CONTEXT_TEXT;
  const waiters = new Set<string>();
  waitingItems.forEach((w) => {
    waiters.add(w.waitingOnPerson ? `${w.waitingOnPerson} (${w.title})` : w.title);
  });
  if (latestHandoff?.dependencies?.length) {
    latestHandoff.dependencies.forEach((d) => waiters.add(d));
  }
  if (waiters.size > 0) {
    whoIsWaiting = Array.from(waiters).join('; ');
  } else {
    missingInformation.push('No pending stakeholder or follow-up waitlist recorded.');
  }

  // Q6. What is the next meaningful action?
  let nextMeaningfulAction = MISSING_CONTEXT_TEXT;
  if (latestHandoff?.nextAction) {
    nextMeaningfulAction = latestHandoff.nextAction;
  } else if (datedItems[0]) {
    nextMeaningfulAction = `Address "${datedItems[0].title}"${datedItems[0].confluencePageId ? ` (linked doc ${datedItems[0].confluencePageId})` : ''}.`;
  } else if (activeUnfinished[0]) {
    nextMeaningfulAction = `Continue "${activeUnfinished[0].title}".`;
  } else if (roleIssues[0]) {
    nextMeaningfulAction = `Review Jira ${roleIssues[0].key}: ${roleIssues[0].summary}.`;
  } else {
    missingInformation.push('No explicit next action was saved before leaving this hat.');
  }

  // Q7. What can safely wait?
  let whatCanSafelyWait = MISSING_CONTEXT_TEXT;
  if (deferredItems.length > 0) {
    whatCanSafelyWait = deferredItems.map((i) => i.title).join('; ');
  } else if (activeUnfinished.length > 2) {
    whatCanSafelyWait = activeUnfinished.slice(2).map((i) => i.title).join('; ');
  }

  // Q8. Is there a deadline or commitment I should not miss?
  let deadlineNotToMiss = MISSING_CONTEXT_TEXT;
  const urgentOrSoon = datedItems[0] || activeUnfinished.find((i) => i.commitmentStatus === 'urgent');
  const overdueIssue = roleIssues.find((i) => i.isOverdue || i.isBlocked);
  if (urgentOrSoon) {
    deadlineNotToMiss = `${urgentOrSoon.title}${urgentOrSoon.dueDate ? ` — due ${urgentOrSoon.dueDate}` : ''}${urgentOrSoon.startTime ? ` at ${urgentOrSoon.startTime}` : ''}`;
  } else if (overdueIssue) {
    deadlineNotToMiss = `Jira ${overdueIssue.key}: ${overdueIssue.summary} (${overdueIssue.isOverdue ? 'overdue' : 'blocked'})`;
  }

  const protectedTimeNote =
    protectedToday.length > 0
      ? `Protected today: ${protectedToday.map((b) => `${b.title} (${b.startTime}–${b.endTime})`).join(', ')}.`
      : 'No protected boundary block scheduled for today.';

  rolePages.slice(0, 2).forEach((p) => {
    if (!sourceReferences.some((s) => s.id === p.id)) {
      sourceReferences.push({ label: `Confluence: ${p.title}`, kind: 'confluence', id: p.id, url: p.url });
    }
  });

  const aiSuggestions: string[] = [];
  if (nextMeaningfulAction !== MISSING_CONTEXT_TEXT) {
    aiSuggestions.push(`Start with: ${nextMeaningfulAction}`);
  }
  if (openDecisions.length > 0) {
    aiSuggestions.push(`Confirm or follow up on pending decision "${openDecisions[0].title}".`);
  }
  if (missingInformation.length > 0) {
    aiSuggestions.push('Capture a 1-line next action before switching away so future resume stays complete.');
  }

  return {
    id: `hb-brief-${role.id}-${Date.now()}`,
    userId,
    roleId: role.id,
    roleName: role.name,
    status: 'draft',
    whatWasWorkingOn,
    lastMeaningfulUpdate,
    decisionsAlreadyMade,
    whatRemainsUnfinished,
    whoIsWaiting,
    nextMeaningfulAction,
    whatCanSafelyWait,
    deadlineNotToMiss,
    protectedTimeNote,
    observedFacts,
    sourceReferences,
    aiSuggestions,
    missingInformation,
    generatedBy: 'deterministic_context_builder',
    userEdited: false,
    privacyLevel: role.privacyLevel,
    createdAt: nowIso,
    updatedAt: nowIso,
  };
}

// ============================================================================
// 4. DECISION MEMORY GROUNDED SEARCH & Q&A
// ============================================================================
export function answerDecisionMemoryQuestion(params: {
  question: string;
  decisions: HatBridgeDecision[];
  roles: HatBridgeRole[];
  allowPrivatePersonal: boolean;
}): HatBridgeStructuredAiResponse {
  const { question, decisions, roles, allowPrivatePersonal } = params;
  const roleMap = new Map(roles.map((r) => [r.id, r]));

  const authorizedDecisions = decisions.filter(
    (d) => allowPrivatePersonal || d.privacyLevel !== 'private_personal'
  );

  const qLower = question.trim().toLowerCase();
  const terms = qLower
    .split(/\s+/)
    .map((t) => t.replace(/[^a-z0-9_-]/g, ''))
    .filter((t) => t.length >= 3 && !['why', 'did', 'what', 'which', 'this', 'that', 'with', 'from', 'the', 'show', 'choose', 'option', 'still', 'waiting', 'related'].includes(t));

  let matched = authorizedDecisions;
  if (qLower.includes('waiting') || qLower.includes('approval')) {
    matched = authorizedDecisions.filter((d) => d.status === 'waiting_approval' || d.status === 'proposed');
  } else if (qLower.includes('latest')) {
    matched = [...authorizedDecisions].sort((a, b) => b.decisionDate.localeCompare(a.decisionDate)).slice(0, 3);
  } else if (terms.length > 0) {
    matched = authorizedDecisions.filter((d) => {
      const hay = `${d.title} ${d.decision} ${d.reasoning} ${d.source} ${d.supportingDocument || ''} ${roleMap.get(d.roleId)?.name || ''}`.toLowerCase();
      return terms.some((term) => hay.includes(term));
    });
  }

  if (matched.length === 0) {
    return {
      observedFacts: ['No matching decision records were found within authorized contexts.'],
      sourceReferences: [],
      userConfirmedDecisions: [],
      aiSuggestions: ['Log the decision with reasoning or broaden search terms across roles.'],
      missingInformation: ['Insufficient evidence in saved or connected decision records to answer this question reliably.'],
      proposedNextAction: 'Record the decision or link the supporting Confluence page in Decision Memory.',
      generatedBy: 'deterministic_context_builder',
    };
  }

  const confirmed = matched.filter((d) => d.status === 'confirmed');
  const pending = matched.filter((d) => d.status !== 'confirmed');

  return {
    observedFacts: matched.map((d) => {
      const roleName = roleMap.get(d.roleId)?.name || 'Unknown role';
      return `[${roleName} · ${d.decisionDate} · ${d.status}] ${d.title}: ${d.decision} Reasoning: ${d.reasoning}`;
    }),
    sourceReferences: matched.map((d) => ({
      label: d.supportingDocument || d.source || d.title,
      type: d.confluencePageId ? 'confluence' : 'decision_record',
      id: d.confluencePageId || d.id,
      url: d.supportingUrl,
    })),
    userConfirmedDecisions: confirmed.map((d) => `${d.title}: ${d.decision}`),
    aiSuggestions: pending.length > 0
      ? [`${pending.length} matching decision(s) await confirmation/approval (not yet final): ${pending.map((p) => p.title).join(', ')}.`]
      : ['All matching decisions are confirmed in your Decision Memory log.'],
    missingInformation: matched.some((d) => !d.supportingDocument && !d.confluencePageId)
      ? ['One or more matching decisions do not yet link a supporting Confluence page or document.']
      : [],
    proposedNextAction: pending[0]
      ? `Follow up with ${pending[0].responsiblePerson} regarding "${pending[0].title}".`
      : `Review "${matched[0].title}" source link before proceeding.`,
    generatedBy: 'deterministic_context_builder',
  };
}

// ============================================================================
// 5. HANDOFF PRE-FILL BUILDER
// ============================================================================
export function buildDraftHandoffFromRole(params: {
  userId: string;
  fromRole: HatBridgeRole;
  toRoleId?: string;
  contextItems: HatBridgeContextItem[];
  decisions: HatBridgeDecision[];
}): Omit<HatBridgeHandoff, 'id' | 'createdAt' | 'updatedAt'> {
  const { userId, fromRole, toRoleId, contextItems, decisions } = params;
  const roleItems = contextItems.filter((i) => i.roleId === fromRole.id);
  const completed = roleItems.filter((i) => i.commitmentStatus === 'completed').map((i) => i.title);
  const remaining = roleItems
    .filter((i) => i.commitmentStatus !== 'completed' && i.commitmentStatus !== 'deferred')
    .map((i) => i.title);
  const waitingDeps = roleItems
    .filter((i) => Boolean(i.waitingOnPerson))
    .map((i) => `${i.waitingOnPerson} (${i.title})`);

  const roleDecisions = decisions.filter((d) => d.roleId === fromRole.id);
  const links: Array<{ label: string; url?: string; refId?: string }> = [];
  roleItems.forEach((i) => {
    if (i.jiraIssueKey) links.push({ label: `Jira ${i.jiraIssueKey}`, url: i.jiraIssueUrl, refId: i.jiraIssueKey });
    if (i.confluencePageId) links.push({ label: `Confluence ${i.confluencePageId}`, url: i.confluencePageUrl, refId: i.confluencePageId });
  });

  return {
    userId,
    fromRoleId: fromRole.id,
    toRoleId,
    currentSituation: roleItems[0]
      ? `Stepping out of ${fromRole.name}; latest focus was "${roleItems[0].title}".`
      : `Pausing work in ${fromRole.name}.`,
    completedWork: completed,
    remainingWork: remaining,
    importantDecisions: roleDecisions.slice(0, 3).map((d) => `${d.title} (${d.status})`),
    outstandingQuestions: roleDecisions
      .filter((d) => d.status === 'waiting_approval' || d.status === 'proposed')
      .map((d) => `Approval/clarification needed: ${d.title}`),
    dependencies: waitingDeps,
    nextAction: remaining[0] || `Resume ${fromRole.name} priorities when returning.`,
    relevantLinks: links.slice(0, 6),
    suggestedReturnDate: roleItems.find((i) => Boolean(i.dueDate))?.dueDate || '',
    privacyLevel: fromRole.privacyLevel,
    aiDraftUsed: false,
    confirmedByUser: false,
  };
}

// ============================================================================
// 6. PRIVACY-CONSCIOUS ANALYTICS SUMMARY (Honest, opt-in only)
// ============================================================================
export function computeHatBridgeAnalytics(params: {
  analyticsEnabled: boolean;
  briefs: HatBridgeReentryBrief[];
  handoffs: HatBridgeHandoff[];
  contextItems: HatBridgeContextItem[];
  lastCheckInBurden?: number | null;
}): HatBridgeAnalyticsSnapshot {
  if (!params.analyticsEnabled) {
    return {
      reentryBriefsConfirmed: 0,
      handoffsCompleted: 0,
      averageResumeRating: null,
      followUpsTrackedCount: 0,
      aiSuggestionsAccepted: 0,
      aiCorrectionsRecorded: 0,
      contextSwitchingBurdenCheckIn: null,
      analyticsOptedIn: false,
    };
  }

  const confirmedBriefs = params.briefs.filter((b) => b.status === 'confirmed' || b.status === 'saved');
  const rated = confirmedBriefs.filter((b) => typeof b.usefulnessRating === 'number');
  const avgRating =
    rated.length > 0
      ? Number((rated.reduce((s, b) => s + (b.usefulnessRating || 0), 0) / rated.length).toFixed(1))
      : null;

  return {
    reentryBriefsConfirmed: confirmedBriefs.length,
    handoffsCompleted: params.handoffs.filter((h) => h.confirmedByUser).length,
    averageResumeRating: avgRating,
    followUpsTrackedCount: params.contextItems.filter((i) => i.category === 'follow_up' || Boolean(i.waitingOnPerson)).length,
    aiSuggestionsAccepted: confirmedBriefs.filter((b) => !b.userEdited && b.generatedBy === 'gemini').length,
    aiCorrectionsRecorded: params.briefs.filter((b) => b.userEdited).length,
    contextSwitchingBurdenCheckIn: params.lastCheckInBurden ?? null,
    analyticsOptedIn: true,
  };
}
