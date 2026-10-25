// ==========================================
// DR. T HEALTHCARE PLATFORM TYPES
// ==========================================

export type NavTab = 
  | 'drt'
  | 'pianist'
  | 'touchgrass'
  | 'cinema'
  | 'tribhouse'
  | 'readit'
  | 'openwebos'
  | 'greenieverse'
  | 'petwhisperer'
  | 'intelligence'
  | 'informatics'
  | 'swarm'
  | 'research'
  | 'smarist'
  | 'automation'
  | 'privacy'
  | 'economy'
  | 'x402'
  | 'copilot360'
  | 'bridge'
  | 'deck'
  | 'lifeweave'
  | 'hedera'
  | 'futurehealth'
  | 'healthalert'
  | 'stcool'
  | 'microbiz'
  | 'buildwithai'
  | 'gcp'
  | 'settings';

export type LanguageCode = 'en' | 'vi' | 'de' | 'fr' | 'es' | 'zh' | 'ja';

export type PersonalityMode = 
  | 'Empathetic'
  | 'Clinical'
  | 'Socratic'
  | 'Maternal'
  | 'Researcher'
  | 'Concise';

export type SafetyLevel = 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';

export interface SafetyAssessment {
  level: SafetyLevel;
  explanation: string;
  actionRecommendation: string;
}

// Conversational Health Companion
export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: string;
  safety?: SafetyAssessment;
  suggestedQuestions?: string[];
  citations?: Array<{ title: string; source: string; url?: string }>;
  isVoiceInput?: boolean;
}

// User Profile & Demographics
export interface PatientProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodType: string;
  allergies: string[];
  chronicConditions: string[];
  primaryCareProvider: string;
  emergencyContact: { name: string; relation: string; phone: string };
  metrics: {
    sleepAvgHours: number;
    restingHeartRate: number;
    stepsAvg: number;
    hydrationLiters: number;
    stressLevel: 'Low' | 'Moderate' | 'Elevated';
    bloodPressure: string;
  };
}

// Longitudinal Health Timeline
export type HealthEventCategory = 
  | 'ALL'
  | 'SYMPTOMS'
  | 'LABS'
  | 'MEDICATIONS'
  | 'VISITS'
  | 'LIFESTYLE'
  | 'AI_INSIGHTS';

export interface HealthEvent {
  id: string;
  timestamp: string;
  category: HealthEventCategory;
  title: string;
  source: string;
  confidence: number;
  summary: string;
  details?: Record<string, any>;
  tags: string[];
  severity?: 'normal' | 'attention' | 'critical';
}

// Health Intelligence & Biometrics
export interface HealthInsight {
  id: string;
  title: string;
  category: 'sleep' | 'metabolic' | 'cardiovascular' | 'stress' | 'nutrition';
  correlation: string;
  confidence: number;
  evidenceBasis: string;
  suggestedAction: string;
  questionsForClinician: string[];
  isAIGenerated: boolean;
}

// Clinical Laboratory Results
export interface LabResult {
  id: string;
  testName: string;
  category: string;
  value: number;
  unit: string;
  referenceRange: string;
  minNormal: number;
  maxNormal: number;
  date: string;
  status: 'NORMAL' | 'HIGH' | 'LOW' | 'CRITICAL';
  trend: 'improving' | 'stable' | 'worsening';
  whatItMeasures: string;
  clinicalContext: string;
  questionsForClinician: string[];
}

// FHIR Interoperability
export interface FHIRResourceNode {
  resourceType: string;
  id: string;
  title: string;
  status: string;
  code?: string;
  display?: string;
  date?: string;
  rawJson: Record<string, any>;
  relationships: string[]; // target IDs
}

// SOAP Clinical Documentation
export interface SOAPNote {
  id: string;
  patientName: string;
  encounterDate: string;
  clinician: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  status: 'draft' | 'reviewed' | 'exported';
  fhirDocumentReference?: Record<string, any>;
}

// AI Multi-Agent Swarm
export interface SwarmAgent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  specialty: string;
  status: 'idle' | 'analyzing' | 'completed' | 'disagreeing';
  currentTask: string;
  output: string;
  confidence: number;
  disagreementPoints: string[];
}

export interface SwarmResult {
  orchestrationPlan: string;
  agents: SwarmAgent[];
  disagreementReview: {
    detected: boolean;
    summary: string;
    tensionPoints: string[];
  };
  synthesis: string;
}

// Research Lab & Evidence
export interface ResearchSynthesis {
  query: string;
  aiSynthesis: string;
  keyFindings: string[];
  evidenceStrength: 'HIGH CONFIDENCE' | 'MODERATE' | 'LIMITED' | 'UNCERTAIN';
  uncertaintyNotes: string;
  sources: Array<{
    title: string;
    journal: string;
    year: number;
    doi: string;
    studyType: string;
    sampleSize: string;
  }>;
}

export interface ICUAnalyticsPatient {
  id: string;
  bed: string;
  age: number;
  diagnosis: string;
  sofaScore: number;
  apsiiiScore: number;
  losHours: number;
  mortalityRiskSignal: number;
  deteriorationRisk: 'Low' | 'Moderate' | 'High' | 'Critical';
  vitalTrends: Array<{ time: string; map: number; hr: number; lactate: number; spo2: number }>;
  featureImportance: Array<{ feature: string; weight: number }>;
}

// SmArist AR & Wellness
export interface SkinMetric {
  id: string;
  name: string;
  score: number; // 0 - 100 (higher = better health or lower severity)
  benchmark: number;
  status: 'optimal' | 'good' | 'moderate' | 'needs_attention';
  zone: 'Forehead' | 'Periorbital' | 'Malar Cheeks' | 'Nose / T-Zone' | 'Jawline';
  description: string;
  clinicalConsideration: string;
}

export interface FashionOutfit {
  id: string;
  title: string;
  prompt: string;
  occasion: string;
  pieces: Array<{ name: string; category: string; material: string; color: string; price: number }>;
  sustainabilityScore: number;
  colorHarmony: string[];
  stylingAdvice: string;
  imageUrl: string;
}

export interface RetailROIScenario {
  visitorsMonthly: number;
  conversionRatePct: number;
  avgOrderValue: number;
  returnRatePct: number;
  returnProcessingCost: number;
}

// RPA Workflow Automation
export interface ClinicalWorkflowItem {
  id: string;
  title: string;
  type: 'Patient Intake' | 'Chart Update' | 'Lab Processing' | 'Appointment Dispatch' | 'Alert Routing';
  status: 'QUEUED' | 'RUNNING' | 'WAITING FOR HUMAN' | 'COMPLETED' | 'FAILED';
  startedAt: string;
  payload: Record<string, any>;
  proposedAction: string;
  riskRating: 'Low' | 'Medium' | 'High';
}

// Sovereign Privacy & Identity
export interface ConsentRecord {
  id: string;
  purpose: string;
  category: 'AI Diagnostic Reasoning' | 'Research Aggregation' | 'Wearable Streaming' | 'EHR Interoperability';
  status: 'ACTIVE' | 'REVOKED' | 'EXPIRED';
  grantedAt: string;
  expiresAt: string;
  zkpProofHash: string;
  recipient: string;
}

export interface UserMemoryItem {
  id: string;
  category: 'Preferences' | 'Health Goals' | 'Important Events' | 'Medications' | 'Allergies' | 'Lifestyle';
  content: string;
  source: string;
  date: string;
  confidence: number;
}

// Agent Economy & x402
export interface EconomyAgentService {
  id: string;
  agentName: string;
  capability: string;
  pricePerCallUSD: number;
  avgLatencyMs: number;
  reputationScore: number;
  totalCalls: number;
  endpoint: string;
  sampleInput: string;
}

// Notifications
export interface PlatformNotification {
  id: string;
  type: 'URGENT' | 'IMPORTANT' | 'INFO';
  title: string;
  message: string;
  timestamp: string;
  actionTab?: NavTab;
  read: boolean;
}

// x402 Pay-Per-Request Service Models (Algorand MainNet & GoPlausible Facilitator)
export interface X402ServiceEndpoint {
  id: string;
  name: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT';
  priceUsdc: number;
  payTo: string;
  network: 'algorand-mainnet' | 'algorand-testnet';
  caip2Network?: string;
  assetId: number;
  category: string;
  description: string;
  active: boolean;
  totalCalls: number;
  totalVolumeUsdc: number;
  createdAt: string;
  sampleInput?: Record<string, any>;
  sampleOutput?: Record<string, any>;
  // Global Challenge & Bazaar specifications
  facilitatorUrl?: string;
  bazaarDiscoveryEnabled?: boolean;
  challengeTag?: string;
  tags?: string[];
  publicHttpsUrl?: string;
  hasMainnetPayment?: boolean;
  bazaarStatus?: 'INDEXED' | 'SYNCING' | 'PENDING';
  trustScore?: number;
}

export interface X402Transaction {
  id: string;
  txId: string;
  endpointId: string;
  endpointName: string;
  amountUsdc: number;
  payerAddress: string;
  payTo: string;
  confirmedRound: number;
  network: string;
  timestamp: string;
  settlementSeconds: number;
  feeAlgo?: number;
  status?: 'CONFIRMED' | 'SETTLING' | 'VERIFIED';
  explorerUrl?: string;
  facilitator?: string;
  challengeTag?: string;
}

export interface X402LeaderboardEntry {
  rank: number;
  name: string;
  merchantAddress: string;
  serviceCategory: string;
  endpointCount: number;
  totalVolumeUsdc: number;
  realMainnetPayments: number;
  lastPaymentRound: number;
  lastSettledAt: string;
  facilitator: string;
  tags: string[];
  challengeQualified: boolean;
  isCurrentPlatform?: boolean;
}

// ==========================================
// PATIENT & MEMBER 360 & CLINICAL/REGULATORY COPILOT
// ==========================================

export interface UnstructuredDocCitation {
  citationId: string;
  documentId: string;
  documentTitle: string;
  documentType: 'EHR_NOTE' | 'PATHOLOGY' | 'FDA_LABEL' | 'PAYER_POLICY' | 'CLINICAL_TRIAL_PROTOCOL' | 'DSMB_SAFETY' | 'LEGAL_REGULATORY';
  section: string;
  pageNumber?: number;
  verbatimQuote: string;
  sourceAuthority: string;
  timestamp?: string;
  relevanceExplanation: string;
}

export interface StructuredClinicalPoint {
  id: string;
  sourceSystem: 'Epic EHR' | 'Cerner Millennium' | 'Optum Claims Engine' | 'Medicaid/Medicare Claims' | 'Specialty Pharmacy (NCPDP)' | 'EDC Rave';
  category: 'VITAL' | 'LAB' | 'DIAGNOSIS_ICD10' | 'PROCEDURE_CPT' | 'CLAIM_PA' | 'PHARMACY_NDC';
  code: string;
  display: string;
  value?: string | number;
  date: string;
  status: 'active' | 'denied' | 'paid' | 'abnormal' | 'normal' | 'adjudicated';
  relevanceToQuestion?: string;
}

export interface UnstructuredDocument {
  id: string;
  title: string;
  documentType: 'EHR_NOTE' | 'PATHOLOGY' | 'FDA_LABEL' | 'PAYER_POLICY' | 'CLINICAL_TRIAL_PROTOCOL' | 'DSMB_SAFETY' | 'LEGAL_REGULATORY';
  date: string;
  facilityOrAgency: string;
  classification: string;
  sha256Hash: string;
  content: string;
  keyExcerpts: Array<{
    id: string;
    section: string;
    text: string;
    page: number;
    tags: string[];
  }>;
}

export interface RiskStratificationScore {
  riskName: string;
  category: 'Clinical Safety' | 'Regulatory Compliance' | 'Financial & Claims' | 'Protocol Adherence';
  tier: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  scorePercent: number;
  summary: string;
  mitigationProtocol: string;
  evidenceFactors: Array<{
    sourceType: 'structured' | 'unstructured';
    description: string;
    sourceRef: string;
    quoteOrValue: string;
  }>;
}

export interface CopilotQAResponse {
  id: string;
  question: string;
  patientOrMemberId: string;
  answerSummary: string;
  detailedClinicalOrRegulatorySynthesis: string;
  safetyCaveats: string[];
  structuredEvidence: StructuredClinicalPoint[];
  unstructuredCitations: UnstructuredDocCitation[];
  riskStratifications: RiskStratificationScore[];
  actionableNextSteps: string[];
  timestamp: string;
  isAiGenerated: boolean;
  confidenceScore: number;
}

export interface PatientMember360Profile {
  id: string;
  type: 'PATIENT_CLINICAL' | 'HEALTH_PLAN_MEMBER' | 'TRIAL_SUBJECT';
  name: string;
  dob: string;
  age: number;
  gender: string;
  mrnOrMemberId: string;
  payerOrSponsor: string;
  planOrTrialProtocol: string;
  primaryDiagnosis: string;
  keyPhenotypeOrCohort: string;
  summary360: string;
  structuredRecords: StructuredClinicalPoint[];
  unstructuredDocuments: UnstructuredDocument[];
  baselineRiskScores: RiskStratificationScore[];
  presetQuestions: Array<{
    category: 'Clinical Safety' | 'Regulatory & Compliance' | 'Claims & Coverage' | 'Trial Protocol';
    question: string;
  }>;
}

// ==========================================
// FUTURE HEALTH DIGITAL INNOVATION CHALLENGE 2026
// Track: Population Health — Anticipatory Health Systems
// ==========================================

export type FutureHealthRiskLevel = 
  | 'ROUTINE_PREVENTION'   // Green (Low baseline risk)
  | 'MODERATE_MONITORING'  // Yellow (Subclinical or borderline trends)
  | 'ELEVATED_RISK'        // Orange (Requires timely clinical referral & HITL review)
  | 'CRITICAL_ESCALATION'; // Red (Immediate urgent clinical evaluation)

export interface FutureHealthBiomarkers {
  bloodPressure?: string;
  restingHeartRate?: number;
  bmi?: number;
  sleepAvgHours?: number;
  ferritin?: number;
  hba1c?: number;
  egfr?: number;
  ldl?: number;
  crp?: number;
  vitD?: number;
}

export interface FutureHealthScreeningRequest {
  patientId?: string;
  demographics: {
    age: number;
    gender: string;
    ethnicity?: string;
  };
  biometrics: {
    bloodPressure?: string;
    restingHeartRate?: number;
    bmi?: number;
    sleepAvgHours?: number;
  };
  labs: {
    ferritin?: number;
    hba1c?: number;
    egfr?: number;
    ldl?: number;
    crp?: number;
    vitD?: number;
  };
  symptoms: string[];
  consentGiven: boolean;
  deIdentified: boolean;
}

export interface BiomarkerCausalityPoint {
  biomarker: string;
  observedValue: string | number;
  referenceStandard: string;
  guidelineSource: string; // e.g. "AHA 2024", "ADA Standards of Care", "KDIGO 2023"
  impactWeight: number; // 0 to 1
  clinicalRationale: string;
}

export interface FutureHealthSBARHandoff {
  situation: string;
  background: string;
  assessment: string;
  recommendation: string;
  requiredPhysicianSpecialty: string;
  targetReferralTimeframe: string;
}

export interface FutureHealthScreeningResponse {
  success: boolean;
  assessmentId: string;
  timestamp: string;
  riskLevel: FutureHealthRiskLevel;
  riskScorePercent: number; // 0 to 100
  anticipatoryDomain: 'Cardiometabolic' | 'Hematologic/Iron' | 'Renal/Metabolic' | 'Respiratory/Sleep' | 'Multi-Domain';
  nonDiagnosticDisclaimer: string;
  uncertaintyScore: number; // 0.00 to 1.00 (epistemic uncertainty)
  uncertaintyRationale: string;
  confidenceInterval: {
    low: number;
    high: number;
  };
  hitlRequired: boolean;
  hitlReviewStatus: 'PENDING_CLINICIAN_REVIEW' | 'NOT_REQUIRED' | 'SIGNED_OFF';
  evidenceCitations: Array<{
    title: string;
    organization: string;
    gradeLevel: 'HIGH' | 'MODERATE' | 'LOW';
    doiOrUrl?: string;
  }>;
  causalityBreakdown: BiomarkerCausalityPoint[];
  sbarHandoff: FutureHealthSBARHandoff;
  fhirRiskAssessment: Record<string, any>;
  telemetry: {
    executionTimeMs: number;
    modelProvider: string;
    anonymizationVerified: boolean;
    demographicParityAudited: boolean;
    projectedTimeToEvaluationDays: number; // Baseline ~42 days vs ~3.5 days
  };
}

// ==========================================
// ST COOL: SYMPTOM-TO-CARE CLINICAL ORIENTATION & LIAISON
// Future Health Digital Innovation Challenge 2026 Production Tab
// ==========================================

export type StCoolTriageTier = 
  | 'ROUTINE_WELLNESS'
  | 'PLANNED_CLINICAL_ASSESSMENT'
  | 'URGENT_EVALUATION'
  | 'EMERGENT_ESCALATION';

export interface StCoolIntakeData {
  patientAlias?: string;
  age: number;
  gender: 'Female' | 'Male' | 'Other' | 'Prefer not to say';
  primaryConcern: string;
  durationDays: number;
  severityScale: number; // 1 - 10
  vitals: {
    bloodPressure?: string;
    restingHeartRate?: number;
    temperatureC?: number;
    spo2Percent?: number;
  };
  labs: {
    ferritin?: number;
    hba1c?: number;
    egfr?: number;
    crp?: number;
    ldl?: number;
    hemoglobin?: number;
    tsh?: number;
  };
  symptoms: string[];
  medications: string[];
  allergies: string[];
  consentGiven: boolean;
  deIdentifiedConfirmed: boolean;
  countryOrRegion?: string;
}

export interface StCoolEvidenceCitation {
  id: string;
  title: string;
  source: string;
  publicationYear: number;
  gradeLevel: 'HIGH' | 'MODERATE' | 'LOW';
  doiOrUrl: string;
  relevance: string;
}

export interface StCoolClinicianQuestion {
  id: string;
  category: 'Diagnostic Confirmation' | 'Treatment & Safety' | 'Lifestyle & Monitoring';
  question: string;
  rationale: string;
}

export interface StCoolAnalysisResponse {
  success: boolean;
  sessionId: string;
  timestamp: string;
  triageTier: StCoolTriageTier;
  triageTitle: string;
  actionSummary: string;
  urgencyTimeline: string;
  riskScore: number; // 0 - 100
  uncertainty: {
    score: number; // 0.0 - 1.0
    level: 'Low' | 'Moderate' | 'Elevated';
    missingKeyFactors: string[];
    explanation: string;
    confidenceInterval: { low: number; high: number };
  };
  clinicalFindings: Array<{
    category: 'Vitals & Biometrics' | 'Laboratory Biomarkers' | 'Reported Symptoms' | 'Interactions & History';
    finding: string;
    interpretation: string;
    clinicalSignificance: 'Normal' | 'Borderline' | 'Elevated' | 'Critical Red-Flag';
    guidelineRef?: string;
  }>;
  evidenceSources: StCoolEvidenceCitation[];
  personalizedEducation: {
    topic: string;
    plainLanguageSummary: string;
    mechanisticExplanation: string;
    lifestyleCaveats: string[];
  };
  clinicianPreparation: {
    sbarBrief: {
      situation: string;
      background: string;
      assessment: string;
      recommendation: string;
    };
    suggestedQuestions: StCoolClinicianQuestion[];
    checklist: string[];
  };
  safetyNotice: {
    disclaimer: string;
    emergencyWarning: string;
    humanClinicianRequired: boolean;
  };
  telemetry: {
    providerUsed: string;
    latencyMs: number;
    heuristicFallbackEngaged: boolean;
    anonymizationVerified: boolean;
    fhirCompliant: boolean;
  };
  fhirRiskAssessment?: Record<string, any>;
}

// ==========================================
// HEALTH ALERT: CLINICAL WARNING SENSING & TRIAGE LIAISON
// Future Health Digital Innovation Challenge 2026 Production Tab
// ==========================================

export type HealthAlertTriageTier = StCoolTriageTier;
export type HealthAlertIntakeData = StCoolIntakeData;
export type HealthAlertEvidenceCitation = StCoolEvidenceCitation;
export type HealthAlertClinicianQuestion = StCoolClinicianQuestion;
export type HealthAlertAnalysisResponse = StCoolAnalysisResponse;




