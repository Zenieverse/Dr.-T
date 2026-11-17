// ============================================================================
// DR. T — COMMUNITY HEALTH SIGNAL INTELLIGENCE
// Future Health Challenge 2026 | Population Health Track
// ============================================================================

export type PopulationRole =
  | 'platform_admin'
  | 'programme_manager'
  | 'population_health_manager'
  | 'clinician'
  | 'care_navigator'
  | 'research_analyst'
  | 'community_viewer'
  | 'read_only_reviewer'
  | 'guest_demo';

export type CanonicalPopulationRole =
  | 'platform_admin'
  | 'programme_manager'
  | 'clinician'
  | 'care_navigator'
  | 'research_analyst'
  | 'community_viewer'
  | 'guest_demo';

export type DataProvenance = 'LIVE' | 'IMPORTED' | 'SIMULATED' | 'UNAVAILABLE';

export type ConsentStatus = 'ACTIVE' | 'REVOKED' | 'PENDING' | 'EXPIRED';

export type ConsentScope =
  | 'population_analytics'
  | 'care_navigation'
  | 'ai_synthesis'
  | 'sensor_intake'
  | 'multilingual_outreach';

export type PopulationWorkspaceId =
  | 'overview'
  | 'registry'
  | 'intake'
  | 'risk'
  | 'trends'
  | 'alerts'
  | 'programmes'
  | 'navigation'
  | 'ai_assistant'
  | 'engagement'
  | 'impact'
  | 'governance';

export type DemoFocusTrack = 'Blood Health' | 'Cardiometabolic Health' | 'Maternal Health';

export interface ConsentRecordItem {
  id: string;
  participantId: string;
  scopes: ConsentScope[];
  status: ConsentStatus;
  purpose: string;
  grantedAt: string;
  updatedAt: string;
  expiresAt: string;
  withdrawnAt?: string;
  recordedBy: string;
}

export interface PopulationParticipant {
  id: string;
  syntheticCode: string;
  displayAlias: string;
  isSynthetic: boolean;
  age: number;
  ageBand: '18-29' | '30-44' | '45-59' | '60+';
  gender: 'Female' | 'Male' | 'Non-binary' | 'Unspecified';
  cohort: DemoFocusTrack;
  region: string;
  preferredLanguage: 'en' | 'vi' | 'es' | 'fr' | 'zh' | 'de' | 'ja';
  dataOrigin: DataProvenance;
  consentStatus: ConsentStatus;
  consentScopes: ConsentScope[];
  riskTier: 'ROUTINE' | 'MONITOR' | 'ELEVATED' | 'PRIORITY_FOLLOWUP';
  priorityScore: number;
  screeningStatus: 'UP_TO_DATE' | 'DUE_SOON' | 'OVERDUE' | 'IN_PROGRESS';
  activeProgrammeIds: string[];
  referralStage:
    | 'NONE'
    | 'SIGNAL_IDENTIFIED'
    | 'HUMAN_REVIEW'
    | 'SCREENING_ASSESSMENT'
    | 'REFERRAL_ISSUED'
    | 'FOLLOW_UP_IN_PROGRESS'
    | 'RESOLVED';
  lastSignalAt: string;
  followUpDueAt?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type SignalSourceSystem =
  | 'HEALTH_ALERT_MINI'
  | 'PRESAGE_OPTICAL'
  | 'CLINICAL_IMPORT'
  | 'WEARABLE_BRIDGE'
  | 'COMMUNITY_SCREENING';

export type SignalMetricType =
  | 'blood_pressure'
  | 'resting_hr'
  | 'spo2'
  | 'glucose'
  | 'hba1c'
  | 'haemoglobin'
  | 'ferritin'
  | 'egfr'
  | 'breathing_rate'
  | 'hrv'
  | 'anc_visit'
  | 'screening_record'
  | 'symptom_triage';

export interface HealthSignalObservation {
  id: string;
  participantId: string;
  sourceSystem: SignalSourceSystem;
  dataOrigin: DataProvenance;
  metricType: SignalMetricType;
  metricLabel: string;
  valueDisplay: string;
  numericValue?: number;
  secondaryNumericValue?: number;
  unit: string;
  referenceRange: string;
  qualityFlag: 'VALID' | 'OUTLIER_FLAGGED' | 'STALE' | 'MISSING_UNIT';
  qualityScore: number;
  recordedAt: string;
  provenanceNote: string;
  consentVerified: boolean;
}

export interface PopulationRiskSignal {
  id: string;
  participantId: string;
  participantAlias: string;
  cohort: DemoFocusTrack;
  region: string;
  domain:
    | 'Blood Health & Anaemia'
    | 'Cardiometabolic'
    | 'Maternal & Perinatal'
    | 'Preventive Screening Gap'
    | 'Follow-up Delay';
  riskTier: 'LOW' | 'MODERATE' | 'HIGH';
  priorityScore: number;
  indicators: string[];
  rationale: string;
  guidelineRefs: string[];
  uncertaintyNote: string;
  nonDiagnosticNotice: string;
  humanReviewRequired?: boolean;
  dataOrigin?: DataProvenance;
  observedAt?: string;
  contributingObservations?: Array<{
    id: string;
    metricLabel: string;
    valueDisplay: string;
    unit: string;
    qualityFlag: HealthSignalObservation['qualityFlag'];
    dataOrigin: DataProvenance;
    recordedAt: string;
  }>;
  status: 'OPEN' | 'ACKNOWLEDGED' | 'IN_NAVIGATION' | 'RESOLVED';
  reviewedBy?: string;
  reviewedAt?: string;
  detectedAt: string;
}

export interface PopulationAlert {
  id: string;
  category: 'POPULATION_TREND' | 'CLINICAL_REVIEW' | 'OPERATIONAL_BOTTLENECK';
  severity: 'INFO' | 'WATCH' | 'URGENT_REVIEW';
  title: string;
  summary: string;
  affectedCohort: string;
  affectedRegion: string;
  metricEvidence: string;
  status: 'OPEN' | 'ACKNOWLEDGED' | 'ESCALATED' | 'RESOLVED';
  assignedReviewer?: string;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  auditNotes: Array<{ timestamp: string; actor: string; note: string }>;
  urgentClinicalRedirect: boolean;
  createdAt: string;
}

export interface AlertRuleConfig {
  id: string;
  name: string;
  category: PopulationAlert['category'];
  enabled: boolean;
  thresholdDescription: string;
  severity: PopulationAlert['severity'];
}

export interface ScreeningProgramme {
  id: string;
  name: string;
  focusArea:
    | 'Blood Health'
    | 'Anaemia & Iron'
    | 'Maternal Health'
    | 'Cardiometabolic'
    | 'Diabetes Prevention'
    | 'Blood Pressure Screening'
    | 'Health Education'
    | 'Community Wellbeing';
  cohort: DemoFocusTrack | 'All Consented Adults';
  eligibilityCriteria: string;
  region: string;
  invitedCount: number;
  consentedCount: number;
  screenedCount: number;
  completedCount: number;
  overdueCount: number;
  operationalCompletionRatePct: number;
  clinicalOutcomeNote: string;
  dataOrigin: DataProvenance;
  status: 'ACTIVE' | 'PLANNED' | 'PAUSED';
}

export type CareNavigationStage =
  | 'SIGNAL_IDENTIFIED'
  | 'HUMAN_REVIEW'
  | 'SCREENING_ASSESSMENT'
  | 'REFERRAL_ISSUED'
  | 'FOLLOW_UP_IN_PROGRESS'
  | 'RESOLVED';

export interface CareReferralItem {
  id: string;
  participantId: string;
  participantAlias: string;
  cohort: DemoFocusTrack;
  region: string;
  signalId?: string;
  stage: CareNavigationStage;
  priority: 'STANDARD' | 'EXPEDITED' | 'PRIORITY';
  navigatorName: string;
  destinationService: string;
  reasonSummary: string;
  appointmentStatus: 'PENDING_SCHEDULING' | 'SCHEDULED' | 'ATTENDED' | 'MISSED' | 'COMPLETED';
  appointmentDate?: string;
  communications: Array<{
    id: string;
    timestamp: string;
    channel: 'SMS' | 'VOICE' | 'IN_CLINIC' | 'PORTAL';
    language: 'en' | 'vi';
    summary: string;
    actor: string;
  }>;
  overdueDays: number;
  escalated: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EngagementTemplate {
  id: string;
  title: string;
  cohort: DemoFocusTrack | 'General Preventive';
  channel: 'SMS' | 'VOICE_OUTREACH' | 'COMMUNITY_PORTAL';
  targetLanguage: 'en' | 'vi' | 'bilingual';
  status: 'DRAFT' | 'REVIEWED' | 'APPROVED_TO_SEND' | 'SENT';
  approvedBy?: string;
  approvedAt?: string;
  sentAt?: string;
  recipientCount: number;
  messageEn: string;
  messageVi: string;
  voicePromptEn: string;
  voicePromptVi: string;
  readingLevelNote: string;
}

export interface ImpactMetricRow {
  id: string;
  domain: string;
  metricType: 'OPERATIONAL' | 'CLINICAL_OUTCOME';
  label: string;
  baselineValue: number;
  reportingPeriodValue: number;
  currentValue: number;
  unit: string;
  deltaLabel: string;
  dataCompletenessPct: number;
  sourceProvenance: DataProvenance;
  limitationNote: string;
}

export interface GovernanceAuditLog {
  id: string;
  timestamp: string;
  actorRole: PopulationRole;
  actorId: string;
  action: string;
  targetType: string;
  targetId: string;
  outcome: 'ALLOWED' | 'DENIED';
  reason: string;
  dataMinimisationApplied: boolean;
}

export interface KAnonymityCell {
  key: string;
  label: string;
  count: number;
  suppressed: boolean;
  elevatedRiskCount: number | null;
  screeningCompletionPct: number | null;
}

export interface TrendPoint {
  period: string;
  screeningCoveragePct: number;
  elevatedRiskPct: number;
  referralCompletionPct: number;
  unmetFollowUpCount: number;
  programmeParticipationCount: number;
}

export interface AiResearchSynthesisResult {
  id: string;
  query: string;
  generatedAt: string;
  providerUsed: string;
  isAiGenerated: boolean;
  fallbackEngaged: boolean;
  observationalSummary: string;
  aiSynthesis: string;
  prioritisedActions: string[];
  uncertaintyNotes: string;
  citations: Array<{
    id: string;
    title: string;
    source: string;
    year: number;
    referenceUrl?: string;
  }>;
  humanApprovalStatus: 'PENDING_HUMAN_REVIEW' | 'APPROVED' | 'REJECTED';
  approvedBy?: string;
  approvedAt?: string;
}

export interface IntegrationConnectorStatus {
  id: 'health_alert_mini' | 'presage_optical' | 'wearable_bridge' | 'clinical_import';
  name: string;
  connectionState: DataProvenance;
  details: string;
  lastSyncAt?: string;
  recordsCount: number;
}

export interface PersistenceStatusInfo {
  mode: 'FIRESTORE_LIVE' | 'FILE_SANDBOX_FALLBACK' | 'EPHEMERAL_GUEST_SANDBOX';
  durableAcrossRestarts: boolean;
  firestoreProjectId: string;
  firestoreDatabaseId: string;
  limitationNote: string;
  requiredAction: string;
}

export interface PopulationHealthDashboardPayload {
  roleContext: {
    currentRole: PopulationRole;
    canonicalRole: CanonicalPopulationRole;
    verifiedMaxRole: CanonicalPopulationRole;
    authMode: 'VERIFIED_FIREBASE_USER' | 'GUEST_SANDBOX' | 'ISOLATED_TEST';
    isGuestSandbox: boolean;
    permissions: string[];
    piiRedacted: boolean;
  };
  filtersApplied: {
    dateRange: '30d' | '90d' | '180d' | 'all';
    cohort: string;
    region: string;
    kThreshold: number;
  };
  demoMode: {
    active: boolean;
    loadedTracks: DemoFocusTrack[];
    bannerText: string;
  };
  persistenceStatus: PersistenceStatusInfo;
  emergencyGuidance: {
    internalRedirectOnlyNotice: string;
    emergencyNumbers: string;
  };
  complianceMetadata: {
    retentionPolicyDays: number;
    legalFrameworks: string[];
    legalReviewNotice: string;
  };
  connectors: IntegrationConnectorStatus[];
  kpis: {
    totalParticipants: number;
    consentedParticipants: number;
    revokedParticipants: number;
    totalSignals: number;
    validSignalsPct: number;
    elevatedRiskCount: number;
    openAlertsCount: number;
    activeReferralsCount: number;
    overdueFollowUpsCount: number;
    screeningCompletionPct: number;
    avgReferralResolutionDays: number;
    suppressedForPrivacy?: boolean;
  };
  participants: PopulationParticipant[];
  consents: ConsentRecordItem[];
  observations: HealthSignalObservation[];
  riskSignals: PopulationRiskSignal[];
  alerts: PopulationAlert[];
  alertRules: AlertRuleConfig[];
  programmes: ScreeningProgramme[];
  referrals: CareReferralItem[];
  engagementTemplates: EngagementTemplate[];
  impactMetrics: ImpactMetricRow[];
  trends: TrendPoint[];
  trendsSuppressedForPrivacy?: boolean;
  kAnonymitySummary: {
    kThreshold: number;
    suppressedCount: number;
    totalCells: number;
    cells: KAnonymityCell[];
  };
  auditLogs: GovernanceAuditLog[];
  aiSyntheses: AiResearchSynthesisResult[];
  nonDiagnosticBanner: string;
}
