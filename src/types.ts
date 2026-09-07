// ==========================================
// DR. T HEALTHCARE PLATFORM TYPES
// ==========================================

export type NavTab = 
  | 'drt'
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
  | 'gcp'
  | 'cinema'
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

// x402 Pay-Per-Request Service Models
export interface X402ServiceEndpoint {
  id: string;
  name: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT';
  priceUsdc: number;
  payTo: string;
  network: 'algorand-mainnet' | 'algorand-testnet';
  assetId: number;
  category: string;
  description: string;
  active: boolean;
  totalCalls: number;
  totalVolumeUsdc: number;
  createdAt: string;
  sampleInput?: Record<string, any>;
  sampleOutput?: Record<string, any>;
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
}
