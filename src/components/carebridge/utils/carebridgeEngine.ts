// ============================================================================
// DR. T — CAREBRIDGE CORE ENGINE
// Pure, deterministic TypeScript helpers for:
//   - Non-diagnostic care coordination task lifecycle & audit trail
//   - Client-side data minimization / PHI pre-check (mirrored server-side)
//   - 4-Bucket Care Re-entry Brief generation (8 required elements)
//   - Deterministic offline Rovo fallback (strictly labeled unverified)
//   - Retention policy pruning
// ============================================================================

import {
  CareBridgeAuditEntry,
  CareBridgeConfluencePage,
  CareBridgeJsmRequest,
  CareBridgePriority,
  CareBridgeReentryBrief,
  CareBridgeRetentionPolicy,
  CareBridgeRovoAssistantOutput,
  CareBridgeTask,
  CareBridgeTaskStatus,
  CareBridgeWorkspaceBundle,
} from '../../../types/carebridgeTypes';

const BLOCKED_PHI_CHECKS: Array<{ pattern: RegExp; reason: string }> = [
  { pattern: /\b\d{3}-\d{2}-\d{4}\b/, reason: 'Social Security Number format detected' },
  { pattern: /\b(?:mrn|medical record number)\s*[:#-]?\s*[a-z0-9-]{3,}/i, reason: 'Medical Record Number (MRN) detected' },
  { pattern: /\b(?:dob|date of birth|born on)\s*[:#-]?\s*\d{1,4}[/-]\d{1,2}[/-]\d{1,4}/i, reason: 'Date of Birth identifier detected' },
  { pattern: /\b(?:icd-?10|hba1c|egfr|biopsy|pathology|dosage|mg\/dl)\b/i, reason: 'Clinical lab/diagnostic or medication value detected' },
];

const DIAGNOSTIC_PHRASE_CHECKS = [
  /\byou have\b.*\b(disease|cancer|diabetes|infection|syndrome)\b/i,
  /\bprescribe\b|\bdiagnose\b|\btreatment plan\b|\bstart taking\b|\bstop taking\b/i,
];

export function checkCareBridgeDataMinimization(text: string): {
  safe: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];
  const val = (text || '').trim();
  for (const rule of BLOCKED_PHI_CHECKS) {
    if (rule.pattern.test(val)) warnings.push(rule.reason);
  }
  for (const diag of DIAGNOSTIC_PHRASE_CHECKS) {
    if (diag.test(val)) warnings.push('CareBridge records administrative follow-ups only, never clinical diagnoses or prescriptions.');
  }
  return { safe: warnings.length === 0, warnings };
}

export function createCareTaskRecord(
  userId: string,
  input: {
    contextRef: string;
    description: string;
    priority: CareBridgePriority;
    dueDate?: string;
    responsibleAssignee: string;
    sourceKind?: CareBridgeTask['source']['kind'];
    sourceLabel?: string;
    jsmRequestKey?: string;
    jsmRequestUrl?: string;
    jsmStatus?: string;
    confluencePageId?: string;
    confluenceUrl?: string;
  }
): CareBridgeTask {
  const now = new Date().toISOString();
  const id = `cb-task-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  const kind = input.sourceKind || (input.jsmRequestKey ? 'jsm_request' : input.confluencePageId ? 'confluence_page' : 'manual');
  const provenance: 'verified_source' | 'user_recorded' =
    kind === 'jsm_request' || kind === 'confluence_page' ? 'verified_source' : 'user_recorded';

  return {
    id,
    userId,
    contextRef: input.contextRef.trim() || 'General Care Navigation',
    description: input.description.trim(),
    priority: input.priority,
    dueDate: input.dueDate?.trim() || undefined,
    responsibleAssignee: input.responsibleAssignee.trim() || 'Care Coordinator',
    status: 'open',
    source: {
      kind,
      label: input.sourceLabel?.trim() || (kind === 'manual' ? 'User-recorded administrative task' : 'Linked Atlassian reference'),
      provenance,
      jsmRequestKey: input.jsmRequestKey,
      jsmRequestUrl: input.jsmRequestUrl,
      jsmStatus: input.jsmStatus,
      confluencePageId: input.confluencePageId,
      confluenceUrl: input.confluenceUrl,
    },
    auditTrail: [
      {
        id: `cb-ta-${Date.now().toString(36)}`,
        timestamp: now,
        action: 'created',
        summary: `Created follow-up task (${input.priority}) assigned to ${input.responsibleAssignee.trim() || 'Care Coordinator'}.`,
        actorLabel: userId,
      },
    ],
    createdAt: now,
    updatedAt: now,
  };
}

export function updateCareTaskStatus(
  task: CareBridgeTask,
  nextStatus: CareBridgeTaskStatus,
  actorUid: string,
  note?: string
): CareBridgeTask {
  const now = new Date().toISOString();
  return {
    ...task,
    status: nextStatus,
    updatedAt: now,
    auditTrail: [
      {
        id: `cb-ta-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`,
        timestamp: now,
        action: 'status_changed',
        summary: note || `Status updated from ${task.status} to ${nextStatus}.`,
        actorLabel: actorUid,
      },
      ...task.auditTrail,
    ],
  };
}

export function linkJsmRequestToCareTask(
  task: CareBridgeTask,
  request: CareBridgeJsmRequest,
  actorUid: string
): CareBridgeTask {
  const now = new Date().toISOString();
  return {
    ...task,
    source: {
      ...task.source,
      kind: 'jsm_request',
      provenance: request.dataOrigin === 'live_jsm' ? 'verified_source' : 'user_recorded',
      label: `${request.dataOrigin === 'live_jsm' ? 'Live JSM' : 'Sample Fixture'} · ${request.issueKey}`,
      jsmRequestKey: request.issueKey,
      jsmRequestUrl: request.requestUrl,
      jsmStatus: request.status,
    },
    updatedAt: now,
    auditTrail: [
      {
        id: `cb-ta-${Date.now().toString(36)}`,
        timestamp: now,
        action: 'jsm_linked',
        summary: `Linked JSM request ${request.issueKey} (${request.status}).`,
        actorLabel: actorUid,
      },
      ...task.auditTrail,
    ],
  };
}

export function appendWorkspaceAudit(
  bundle: CareBridgeWorkspaceBundle,
  entry: Omit<CareBridgeAuditEntry, 'id' | 'timestamp' | 'userId' | 'actorUid'>
): CareBridgeAuditEntry[] {
  const record: CareBridgeAuditEntry = {
    id: `cb-aud-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    userId: bundle.consents.userId,
    timestamp: new Date().toISOString(),
    actorUid: bundle.consents.userId,
    ...entry,
  };
  return [record, ...bundle.auditLogs].slice(0, 120);
}

export function buildCareReentryBrief(
  bundle: CareBridgeWorkspaceBundle,
  aiOverride?: { suggestionText: string; rationale: string; generatedBy: 'deterministic_helper' | 'gemini' }
): CareBridgeReentryBrief {
  const now = new Date().toISOString();
  const userId = bundle.consents.userId;

  // 1. Verified Source Information (strictly from live Atlassian JSM/Confluence records; sample_fixture marked distinctly)
  const verifiedSourceInformation: CareBridgeReentryBrief['verifiedSourceInformation'] = [];
  for (const req of bundle.linkedRequests) {
    if (req.dataOrigin === 'live_jsm') {
      verifiedSourceInformation.push({
        text: `JSM ${req.issueKey} (${req.status}): ${req.summary}`,
        sourceLabel: `Live Jira Service Management · ${req.issueKey}`,
        sourceUrl: req.requestUrl,
      });
    }
  }
  for (const pg of bundle.knowledgePages) {
    if (pg.dataOrigin === 'live_confluence') {
      verifiedSourceInformation.push({
        text: `${pg.title} — ${pg.excerpt.slice(0, 160)}`,
        sourceLabel: `Live Confluence (${pg.spaceKey})`,
        sourceUrl: pg.url,
      });
    }
  }

  // 2. User-Recorded Information (tasks & sample fixtures clearly separated from live verified Atlassian data)
  const userRecordedInformation: CareBridgeReentryBrief['userRecordedInformation'] = bundle.tasks.map((t) => ({
    text: `[${t.status}] ${t.description} (Assignee: ${t.responsibleAssignee}${t.dueDate ? `, Due: ${t.dueDate}` : ''})`,
    taskId: t.id,
    recordedAt: t.updatedAt,
  }));

  // Include clearly flagged sample preview records inside User-Recorded / Sandbox context if active
  if (bundle.integration.isSampleSandboxActive) {
    for (const req of bundle.linkedRequests.filter((r) => r.dataOrigin === 'sample_fixture')) {
      userRecordedInformation.push({
        text: `[Sample Fixture Only — Not Live JSM] ${req.issueKey} (${req.status}): ${req.summary}`,
        recordedAt: req.createdDate,
      });
    }
  }

  // 4. Missing or Unavailable Context
  const missingOrUnavailableContext: string[] = [];
  if (!bundle.integration.jsmConnected) {
    missingOrUnavailableContext.push(
      'Jira Service Management live REST bridge is not connected; live service-desk request status is unavailable.'
    );
  } else if (bundle.linkedRequests.filter((r) => r.dataOrigin === 'live_jsm').length === 0) {
    missingOrUnavailableContext.push('No live Jira Service Management requests are currently linked.');
  }

  if (!bundle.integration.confluenceConnected) {
    missingOrUnavailableContext.push(
      'Confluence Cloud live knowledge bridge is not connected; verified institutional guidance pages are unavailable.'
    );
  } else if (bundle.knowledgePages.filter((p) => p.dataOrigin === 'live_confluence').length === 0) {
    missingOrUnavailableContext.push('No live Confluence care-navigation pages have been retrieved in this session.');
  }

  const tasksWithoutDueDate = bundle.tasks.filter((t) => t.status !== 'completed' && !t.dueDate);
  if (tasksWithoutDueDate.length > 0) {
    missingOrUnavailableContext.push(
      `${tasksWithoutDueDate.length} open follow-up task(s) do not yet have an assigned target due date.`
    );
  }

  if (!bundle.consents.geminiSynthesisConsent) {
    missingOrUnavailableContext.push(
      'External Gemini synthesis consent is currently off; AI suggestions use deterministic local helper wording only.'
    );
  }

  const openTasks = bundle.tasks.filter((t) => t.status !== 'completed' && t.status !== 'deferred');
  const topTask = openTasks[0];

  // 3. AI-Generated Suggestion — Unconfirmed
  const defaultSuggestion = topTask
    ? `Coordinate "${topTask.description}" with ${topTask.responsibleAssignee}${topTask.dueDate ? ` before ${topTask.dueDate}` : ''}.`
    : 'Add a non-emergency follow-up task or connect your authorized JSM/Confluence workspace to begin tracking.';

  const lastLog = bundle.auditLogs[0];

  return {
    id: `cb-brief-${Date.now().toString(36)}`,
    userId,
    generatedAt: now,
    currentNavigationContext: bundle.navigationContextTitle,
    lastRecordedActivity: lastLog ? `${lastLog.action} (${lastLog.timestamp.slice(0, 16).replace('T', ' ')})` : 'No activity recorded yet',
    verifiedSourceInformation,
    userRecordedInformation,
    aiGeneratedSuggestionUnconfirmed: {
      suggestedNextAdminAction: aiOverride?.suggestionText || defaultSuggestion,
      supportingRationale:
        aiOverride?.rationale ||
        'Generated strictly from user-recorded administrative tasks and authorized non-clinical navigation metadata.',
      label: 'AI-Generated Suggestion — Unconfirmed',
      humanReviewed: false,
      generatedBy: aiOverride?.generatedBy || 'deterministic_helper',
    },
    missingOrUnavailableContext,
    openFollowUpTaskIds: openTasks.map((t) => t.id),
    knowledgeLinks: bundle.knowledgePages.map((p) => ({
      id: p.id,
      title: p.title,
      url: p.url,
      dataOrigin: p.dataOrigin,
    })),
  };
}

export function buildLocalGroundedRovoOutput(
  actionType: CareBridgeRovoAssistantOutput['actionType'],
  prompt: string,
  tasks: CareBridgeTask[],
  pages: CareBridgeConfluencePage[],
  requests: CareBridgeJsmRequest[]
): CareBridgeRovoAssistantOutput {
  const verifiedSourceFacts: string[] = [];
  for (const r of requests.filter((x) => x.dataOrigin === 'live_jsm')) {
    verifiedSourceFacts.push(`JSM ${r.issueKey} [${r.status}]: ${r.summary}`);
  }
  for (const p of pages.filter((x) => x.dataOrigin === 'live_confluence')) {
    verifiedSourceFacts.push(`Confluence "${p.title}" (${p.spaceKey}): ${p.excerpt.slice(0, 120)}`);
  }

  const userRecordedFacts = tasks.map(
    (t) => `[${t.status} · ${t.priority}] ${t.description} (${t.responsibleAssignee}${t.dueDate ? `, due ${t.dueDate}` : ''})`
  );

  const missingInformation: string[] = [];
  if (verifiedSourceFacts.length === 0) {
    missingInformation.push('No live Atlassian JSM or Confluence source items connected in current session.');
  }
  if (tasks.length === 0) {
    missingInformation.push('No administrative follow-up tasks recorded yet.');
  }

  let aiNarrativeDraft = 'Review open administrative follow-up items and confirm dates with the assigned care team.';
  if (actionType === 'retrieve-care-knowledge') {
    aiNarrativeDraft =
      pages.length > 0
        ? `Found ${pages.length} knowledge page(s) in current workspace scope; review original Confluence source links directly before acting.`
        : 'No matching Confluence knowledge pages are loaded. Connect Confluence with authorized credentials or adjust your search query.';
  } else if (actionType === 'summarize-followup-tasks') {
    const openCount = tasks.filter((t) => t.status !== 'completed').length;
    aiNarrativeDraft = `${openCount} non-completed follow-up task(s) are tracked. Verify due dates and external JSM ticket links with your coordinator.`;
  } else if (actionType === 'prepare-care-handoff') {
    aiNarrativeDraft = `Handoff draft prepared across ${tasks.length} task(s) and ${requests.length} JSM item(s). All missing fields are highlighted for human check.`;
  }

  return {
    id: `cb-rovo-${Date.now().toString(36)}`,
    actionType,
    prompt,
    unverifiedBanner: 'AI-Generated Output — Unverified until reviewed by an authorized human',
    nonClinicalNotice:
      'Administrative care-navigation summary only. CareBridge is not a clinician and never replaces licensed medical evaluation.',
    verifiedSourceFacts,
    userRecordedFacts,
    aiNarrativeDraft,
    missingInformation,
    sourceLinks: pages.map((p) => ({ label: p.title, url: p.url })),
    generatedBy: 'local_grounded',
    generatedAt: new Date().toISOString(),
  };
}

export function applyRetentionPolicyCutoff(
  bundle: CareBridgeWorkspaceBundle,
  policy: CareBridgeRetentionPolicy
): CareBridgeWorkspaceBundle {
  if (policy === 'manual_only') return bundle;
  const daysMap: Record<Exclude<CareBridgeRetentionPolicy, 'manual_only'>, number> = {
    '30_days': 30,
    '90_days': 90,
    '365_days': 365,
  };
  const cutoffMs = Date.now() - daysMap[policy] * 86_400_000;
  const keptTasks = bundle.tasks.filter((t) => {
    if (t.status !== 'completed' && t.status !== 'deferred') return true;
    return Date.parse(t.updatedAt) >= cutoffMs;
  });
  return {
    ...bundle,
    tasks: keptTasks,
    consents: {
      ...bundle.consents,
      retentionPolicy: policy,
      updatedAt: new Date().toISOString(),
    },
  };
}
