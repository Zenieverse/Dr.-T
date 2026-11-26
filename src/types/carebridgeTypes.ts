// ============================================================================
// DR. T — CAREBRIDGE DOMAIN TYPES (CODEGEIST 2026: SPECIALIZED INDUSTRIES)
// Healthcare care-navigation & non-emergency follow-up continuity platform.
// Distinct from HatBridge; never replaces clinical diagnosis or treatment.
// ============================================================================

export type CareBridgeSectionId =
  | 'overview'
  | 'coordination'
  | 'knowledge'
  | 'jsm'
  | 'rovo'
  | 'reentry-brief'
  | 'privacy'
  | 'audit';

export type CareBridgePriority = 'routine' | 'soon' | 'time_sensitive';

export type CareBridgeTaskStatus =
  | 'open'
  | 'scheduled'
  | 'waiting_external'
  | 'completed'
  | 'deferred';

export type CareBridgeProvenanceType =
  | 'verified_source'
  | 'user_recorded'
  | 'ai_unconfirmed'
  | 'missing_unavailable';

export interface CareBridgeTaskAuditEntry {
  id: string;
  timestamp: string;
  action: 'created' | 'updated' | 'status_changed' | 'jsm_linked' | 'confluence_linked';
  summary: string;
  actorLabel: string;
}

export interface CareBridgeTaskSource {
  kind: 'manual' | 'jsm_request' | 'confluence_page' | 'healthalert_ref' | 'sample_fixture';
  label: string;
  provenance: 'verified_source' | 'user_recorded';
  jsmRequestKey?: string;
  jsmRequestUrl?: string;
  jsmStatus?: string;
  confluencePageId?: string;
  confluenceUrl?: string;
}

export interface CareBridgeTask {
  id: string;
  userId: string;
  contextRef: string;
  description: string;
  priority: CareBridgePriority;
  dueDate?: string;
  responsibleAssignee: string;
  status: CareBridgeTaskStatus;
  source: CareBridgeTaskSource;
  auditTrail: CareBridgeTaskAuditEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface CareBridgeJsmServiceDesk {
  id: string;
  projectId: string;
  projectKey: string;
  projectName: string;
  requestTypes: Array<{
    id: string;
    name: string;
    description?: string;
  }>;
}

export interface CareBridgeJsmRequest {
  issueId: string;
  issueKey: string;
  serviceDeskId: string;
  requestTypeId: string;
  summary: string;
  status: string;
  statusDate?: string;
  createdDate: string;
  reporterName?: string;
  requestUrl: string;
  dataOrigin: 'live_jsm' | 'sample_fixture';
}

export interface CareBridgeConfluencePage {
  id: string;
  title: string;
  spaceKey: string;
  spaceName: string;
  excerpt: string;
  lastUpdated: string;
  author?: string;
  url: string;
  dataOrigin: 'live_confluence' | 'sample_fixture';
}

export interface CareBridgeKnowledgeSummary {
  pageId: string;
  pageTitle: string;
  sourceUrl: string;
  sourceExcerpt: string;
  aiSummaryText: string;
  unverifiedLabel: string;
  missingInformation: string[];
  generatedBy: 'gemini' | 'unavailable';
  model?: string;
  generatedAt: string;
}

export interface CareBridgeReentryBrief {
  id: string;
  userId: string;
  generatedAt: string;
  currentNavigationContext: string;
  lastRecordedActivity: string;
  // Explicit 4-bucket provenance separation
  verifiedSourceInformation: Array<{
    text: string;
    sourceLabel: string;
    sourceUrl?: string;
  }>;
  userRecordedInformation: Array<{
    text: string;
    taskId?: string;
    recordedAt?: string;
  }>;
  aiGeneratedSuggestionUnconfirmed: {
    suggestedNextAdminAction: string;
    supportingRationale: string;
    label: 'AI-Generated Suggestion — Unconfirmed';
    humanReviewed: boolean;
    generatedBy: 'deterministic_helper' | 'gemini';
  };
  missingOrUnavailableContext: string[];
  openFollowUpTaskIds: string[];
  knowledgeLinks: Array<{
    id: string;
    title: string;
    url: string;
    dataOrigin: 'live_confluence' | 'sample_fixture';
  }>;
}

export interface CareBridgeRovoAssistantOutput {
  id: string;
  actionType:
    | 'summarize-care-context'
    | 'retrieve-care-knowledge'
    | 'summarize-followup-tasks'
    | 'prepare-care-handoff';
  prompt: string;
  unverifiedBanner: 'AI-Generated Output — Unverified until reviewed by an authorized human';
  nonClinicalNotice: string;
  verifiedSourceFacts: string[];
  userRecordedFacts: string[];
  aiNarrativeDraft: string;
  missingInformation: string[];
  sourceLinks: Array<{ label: string; url?: string }>;
  generatedBy: 'gemini' | 'local_grounded';
  model?: string;
  generatedAt: string;
}

export type CareBridgeRetentionPolicy = '30_days' | '90_days' | '365_days' | 'manual_only';

export interface CareBridgeConsentState {
  userId: string;
  jsmMinimalSyncConsent: boolean;
  confluenceReadConsent: boolean;
  rovoAssistantConsent: boolean;
  geminiSynthesisConsent: boolean;
  wellnessReferenceOptIn: boolean;
  retentionPolicy: CareBridgeRetentionPolicy;
  consentGrantedAt?: string;
  updatedAt: string;
}

export interface CareBridgeIntegrationState {
  userId: string;
  connectionMode: 'disconnected' | 'live_atlassian_configured' | 'forge_app_linked' | 'sample_sandbox';
  siteUrl: string;
  jsmConnected: boolean;
  confluenceConnected: boolean;
  forgeAppInstalled: boolean;
  statusMessage: string;
  isSampleSandboxActive: boolean;
  updatedAt: string;
}

export interface CareBridgeAuditEntry {
  id: string;
  userId: string;
  timestamp: string;
  category: 'task' | 'jsm' | 'confluence' | 'rovo_ai' | 'privacy' | 'system';
  action: string;
  outcome: 'allowed' | 'blocked' | 'error';
  summary: string;
  actorUid: string;
}

export interface CareBridgeWorkspaceBundle {
  navigationContextTitle: string;
  tasks: CareBridgeTask[];
  linkedRequests: CareBridgeJsmRequest[];
  knowledgePages: CareBridgeConfluencePage[];
  latestBrief: CareBridgeReentryBrief | null;
  consents: CareBridgeConsentState;
  integration: CareBridgeIntegrationState;
  auditLogs: CareBridgeAuditEntry[];
}

export type CareBridgeConnectionDisplayStatus =
  | 'Connected'
  | 'Unauthorized'
  | 'Permission Denied'
  | 'Unavailable';

export type CareBridgeVerificationOutcome = 'VERIFIED' | 'FAILED' | 'NOT TESTED';

export interface CareBridgeVerificationCheckItem {
  id:
    | 'credentials'
    | 'authentication'
    | 'service_desk'
    | 'request_type'
    | 'permissions';
  label: string;
  outcome: CareBridgeVerificationOutcome;
  detail: string;
}

export interface CareBridgeVerificationReport {
  status: CareBridgeConnectionDisplayStatus;
  verifiedAt: string;
  siteUrl: string;
  expectedServiceDeskId: string;
  expectedProjectKey: string;
  expectedProjectName: string;
  expectedRequestTypeId: string;
  expectedRequestTypeName: string;
  actualProjectKey?: string;
  actualServiceDeskName?: string;
  actualRequestTypeName?: string;
  accessibleServiceDeskCount?: number;
  requestTypeCreatable?: boolean;
  allChecksPassed: boolean;
  safeError?: string;
  checks: CareBridgeVerificationCheckItem[];
  requestTypeRequiredFields?: string[];
}
