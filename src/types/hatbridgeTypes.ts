// ============================================================================
// DR. T — HATBRIDGE TYPES
// "Many Hats. One Life. Nothing Important Lost."
// Codegeist 2026 | Isolated domain types (no patient PHI fields)
// ============================================================================

export type HatBridgeSectionId =
  | 'my-hats'
  | 'today-bridge'
  | 'reentry-brief'
  | 'context-capture'
  | 'decision-memory'
  | 'handoffs'
  | 'time-protection'
  | 'atlassian-workspace'
  | 'ai-assistant'
  | 'settings-privacy';

export type HatBridgePrivacyLevel =
  | 'private_personal'
  | 'work_team'
  | 'work_restricted';

export type HatBridgeColorToken =
  | 'teal'
  | 'indigo'
  | 'amber'
  | 'rose'
  | 'emerald'
  | 'sky'
  | 'slate'
  | 'violet';

export type HatBridgeCommitmentStatus =
  | 'urgent'
  | 'important'
  | 'scheduled'
  | 'waiting'
  | 'deferred'
  | 'completed';

export type HatBridgeCaptureCategory =
  | 'task'
  | 'decision'
  | 'follow_up'
  | 'meeting_note'
  | 'reminder'
  | 'commitment';

export type HatBridgeDecisionStatus =
  | 'confirmed'
  | 'waiting_approval'
  | 'proposed'
  | 'superseded';

export type HatBridgeTimeCategory =
  | 'family'
  | 'rest'
  | 'appointment'
  | 'exercise'
  | 'learning'
  | 'recovery'
  | 'unavailable';

export interface HatBridgeRole {
  id: string;
  userId: string;
  name: string;
  icon: string;
  color: HatBridgeColorToken;
  description: string;
  goals: string[];
  currentPriorities: string[];
  relatedTasks: string[];
  relatedDocuments: Array<{ title: string; source: 'Confluence' | 'Jira' | 'Local' | 'External'; url?: string; refId?: string }>;
  relevantContacts: Array<{ name: string; relationOrRole: string }>;
  activeProjects: string[];
  recentDecisions: string[];
  unfinishedWork: string[];
  preferredAiContext: string;
  privacyLevel: HatBridgePrivacyLevel;
  archived: boolean;
  sortOrder: number;
  isStarterTemplate?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HatBridgeContextItem {
  id: string;
  userId: string;
  roleId: string;
  title: string;
  content: string;
  category: HatBridgeCaptureCategory;
  commitmentStatus: HatBridgeCommitmentStatus;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  startTime?: string; // HH:mm
  endTime?: string;   // HH:mm
  estimatedMinutes?: number;
  relatedProject?: string;
  jiraIssueKey?: string;
  jiraIssueUrl?: string;
  confluencePageId?: string;
  confluencePageUrl?: string;
  waitingOnPerson?: string;
  privacyLevel: HatBridgePrivacyLevel;
  storageLocation: 'firestore_user_vault' | 'browser_sandbox' | 'atlassian_linked';
  sourceReference?: string;
  capturedVia?: 'text' | 'voice' | 'quick_capture' | 'atlassian_sync' | 'sample_workflow';
  createdAt: string;
  updatedAt: string;
}

export interface HatBridgeDecisionRevision {
  timestamp: string;
  summary: string;
  editor: string;
}

export interface HatBridgeDecision {
  id: string;
  userId: string;
  roleId: string;
  title: string;
  decision: string;
  reasoning: string;
  decisionDate: string;
  responsiblePerson: string;
  source: string;
  supportingDocument?: string;
  supportingUrl?: string;
  confluencePageId?: string;
  relatedTaskId?: string;
  jiraIssueKey?: string;
  followUpDate?: string;
  status: HatBridgeDecisionStatus;
  privacyLevel: HatBridgePrivacyLevel;
  revisions: HatBridgeDecisionRevision[];
  createdAt: string;
  updatedAt: string;
}

export interface HatBridgeHandoff {
  id: string;
  userId: string;
  fromRoleId: string;
  toRoleId?: string;
  currentSituation: string;
  completedWork: string[];
  remainingWork: string[];
  importantDecisions: string[];
  outstandingQuestions: string[];
  dependencies: string[];
  nextAction: string;
  relevantLinks: Array<{ label: string; url?: string; refId?: string }>;
  suggestedReturnDate?: string;
  privacyLevel: HatBridgePrivacyLevel;
  aiDraftUsed: boolean;
  confirmedByUser: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HatBridgeReentryBrief {
  id: string;
  userId: string;
  roleId: string;
  roleName: string;
  status: 'draft' | 'confirmed' | 'saved' | 'dismissed';
  whatWasWorkingOn: string;
  lastMeaningfulUpdate: string;
  decisionsAlreadyMade: string;
  whatRemainsUnfinished: string;
  whoIsWaiting: string;
  nextMeaningfulAction: string;
  whatCanSafelyWait: string;
  deadlineNotToMiss: string;
  protectedTimeNote: string;
  observedFacts: string[];
  sourceReferences: Array<{ label: string; kind: string; id: string; url?: string }>;
  aiSuggestions: string[];
  missingInformation: string[];
  generatedBy: 'gemini' | 'deterministic_context_builder';
  userEdited: boolean;
  usefulnessRating?: 1 | 2 | 3 | 4 | 5;
  privacyLevel: HatBridgePrivacyLevel;
  createdAt: string;
  updatedAt: string;
}

export interface HatBridgeTimeBlock {
  id: string;
  userId: string;
  title: string;
  category: HatBridgeTimeCategory;
  date: string;       // YYYY-MM-DD
  startTime: string;  // HH:mm
  endTime: string;    // HH:mm
  protected: boolean;
  notes?: string;
  privacyLevel: HatBridgePrivacyLevel;
  createdAt: string;
  updatedAt: string;
}

export interface HatBridgeConflict {
  id: string;
  severity: 'attention' | 'high';
  title: string;
  explanation: string;
  itemAId: string;
  itemALabel: string;
  itemBId: string;
  itemBLabel: string;
  involvesProtectedTime: boolean;
  suggestedResolution: string;
  recommendedActionType: 'defer_item_a' | 'defer_item_b' | 'reschedule_slot' | 'protect_boundary';
}

export interface HatBridgePreferences {
  userId: string;
  aiConsentGranted: boolean;
  allowPrivatePersonalInAi: boolean;
  allowWorkplaceContextInAi: boolean;
  analyticsEnabled: boolean;
  retentionDays: 30 | 90 | 365 | 0; // 0 = manual only
  sustainableDailyHours: number;
  onboardingCompleted: boolean;
  subscriptionTier: 'personal_continuity' | 'multi_role_pro' | 'clinical_academic_team';
  voiceInputPreferred: boolean;
  updatedAt: string;
}

export interface HatBridgeAtlassianIssue {
  id: string;
  key: string;
  summary: string;
  status: string;
  priority: string;
  assignee?: string;
  dueDate?: string;
  projectKey: string;
  projectName: string;
  isOverdue: boolean;
  isBlocked: boolean;
  url: string;
  linkedRoleId?: string;
  linkedBriefId?: string;
  dataOrigin: 'live_atlassian' | 'sample_sandbox';
}

export interface HatBridgeConfluencePage {
  id: string;
  title: string;
  spaceKey: string;
  spaceName: string;
  excerpt: string;
  lastUpdated: string;
  author?: string;
  url: string;
  isMeetingNote: boolean;
  linkedDecisionIds?: string[];
  linkedRoleId?: string;
  dataOrigin: 'live_atlassian' | 'sample_sandbox';
}

export interface HatBridgeIntegrationState {
  userId: string;
  connectionMode: 'disconnected' | 'live_atlassian_configured' | 'forge_app_linked' | 'sample_sandbox';
  siteUrl: string;
  jiraConnected: boolean;
  confluenceConnected: boolean;
  forgeAppInstalled: boolean;
  accountLabel?: string;
  lastCheckedAt?: string;
  statusMessage: string;
  isDemoSandboxActive: boolean;
  updatedAt: string;
}

export interface HatBridgeAuditEvent {
  id: string;
  userId: string;
  action:
    | 'ROLE_CREATED'
    | 'ROLE_UPDATED'
    | 'ROLE_SWITCHED'
    | 'ROLE_ARCHIVED'
    | 'CONTEXT_CAPTURED'
    | 'DECISION_RECORDED'
    | 'DECISION_REVISED'
    | 'HANDOFF_SAVED'
    | 'REENTRY_BRIEF_GENERATED'
    | 'REENTRY_BRIEF_CONFIRMED'
    | 'CONFLICT_RESOLUTION_APPLIED'
    | 'TIME_PROTECTION_UPDATED'
    | 'AI_QUERY_EXECUTED'
    | 'AI_CONSENT_UPDATED'
    | 'ATLASSIAN_ISSUE_CREATED'
    | 'ATLASSIAN_LINKED'
    | 'DATA_EXPORTED'
    | 'DATA_DELETED';
  entityType: string;
  entityId: string;
  privacyLevel: HatBridgePrivacyLevel;
  detail: string;
  timestamp: string;
}

export interface HatBridgeAnalyticsSnapshot {
  reentryBriefsConfirmed: number;
  handoffsCompleted: number;
  averageResumeRating: number | null;
  followUpsTrackedCount: number;
  aiSuggestionsAccepted: number;
  aiCorrectionsRecorded: number;
  contextSwitchingBurdenCheckIn: number | null; // user self-reported 1-5
  analyticsOptedIn: boolean;
}

export interface HatBridgeStructuredAiResponse {
  observedFacts: string[];
  sourceReferences: Array<{ label: string; type: string; id?: string; url?: string }>;
  userConfirmedDecisions: string[];
  aiSuggestions: string[];
  missingInformation: string[];
  proposedNextAction: string;
  generatedBy: 'gemini' | 'deterministic_context_builder' | 'error';
  model?: string;
  errorCode?: string;
  errorMessage?: string;
}

export interface HatBridgeWorkspaceBundle {
  roles: HatBridgeRole[];
  activeRoleId: string;
  contextItems: HatBridgeContextItem[];
  decisions: HatBridgeDecision[];
  handoffs: HatBridgeHandoff[];
  reentryBriefs: HatBridgeReentryBrief[];
  timeBlocks: HatBridgeTimeBlock[];
  preferences: HatBridgePreferences;
  integration: HatBridgeIntegrationState;
  auditEvents: HatBridgeAuditEvent[];
  analytics: HatBridgeAnalyticsSnapshot;
}
