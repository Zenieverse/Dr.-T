// =========================================================================
// DR. T CINEMA — EVIDENCE-TO-SCREEN AUTONOMOUS PRODUCTION STUDIO
// TypeScript Core Data Models & Schemas
// =========================================================================

export type ProductionState = 
  | 'INTAKE'
  | 'BRIEFING'
  | 'RESEARCHING'
  | 'EVIDENCE_SYNTHESIS'
  | 'FACT_CHECKING'
  | 'STORY_DEVELOPMENT'
  | 'SCRIPTING'
  | 'STORYBOARDING'
  | 'PRODUCTION_PLANNING'
  | 'QUALITY_REVIEW'
  | 'HUMAN_APPROVAL'
  | 'EXPORTING'
  | 'COMPLETE';

export type VisualStyleKey = 
  | 'Documentary'
  | 'Clinical'
  | 'Humanist'
  | 'Futuristic'
  | 'Nature'
  | 'Investigative'
  | 'Editorial'
  | 'Minimal';

export type ClaimVerificationStatus = 
  | 'VERIFIED'
  | 'PARTIALLY_VERIFIED'
  | 'CONTESTED'
  | 'UNSUPPORTED'
  | 'REQUIRES_HUMAN_REVIEW';

export type ClaimConfidence = 'HIGH' | 'MODERATE' | 'LOW';

export interface CreativeBrief {
  projectTitle: string;
  logline: string;
  audience: string;
  objective: string;
  format: string; // e.g. "90-second cinematic educational explainer"
  durationSeconds: number;
  tone: string; // e.g. "Warm, contemplative, scientifically rigorous, human-centered"
  visualLanguage: VisualStyleKey;
  narrativeStrategy: string;
  successCriteria: string[];
}

export interface ResearchQuery {
  id: string;
  query: string;
  purpose: string;
  status: 'PENDING' | 'EXECUTING' | 'COMPLETED';
  sourcesFound: number;
  claimsDerived: number;
  timestamp: string;
}

export interface ResearchSource {
  id: string;
  title: string;
  publisher: string;
  author: string;
  publicationDate: string;
  url: string;
  snippet: string;
  credibilityScore: number; // 0 - 100
  methodology: string; // e.g. "Double-blind RCT", "Systematic Review", "Biochemical Assay"
  peerReviewed: boolean;
  doi?: string;
}

export interface EvidenceClaim {
  id: string; // e.g. "C-001", "C-014", "C-019"
  statement: string;
  category: 'biochemical' | 'physiological' | 'clinical' | 'lifestyle' | 'epidemiological';
  status: ClaimVerificationStatus;
  confidence: ClaimConfidence;
  sourceIds: string[];
  supportedQuotes: string[];
  scriptUsages: Array<{
    sceneId: string;
    shotId?: string;
    lineReference: string;
  }>;
  counterEvidence?: string;
  factCheckerNotes?: string;
  qualifiedRevision?: string;
}

export interface StoryBeat {
  id: string;
  type: 'HOOK' | 'HUMAN_QUESTION' | 'CONTEXT' | 'DISCOVERY' | 'TENSION' | 'EXPLANATION' | 'INSIGHT' | 'ACTION';
  title: string;
  objective: string;
  emotionalTone: string;
  estimatedSeconds: number;
}

export interface Scene {
  id: string; // e.g. "SCENE-01"
  sceneNumber: number;
  title: string;
  timecodeStart: string; // "00:00"
  timecodeEnd: string;   // "00:12"
  durationSeconds: number;
  location: string;
  visualAction: string;
  camera: string;
  narration: string;
  dialogue?: string;
  onScreenText?: string;
  sfx: string;
  music: string;
  transition: string;
  claimIds: string[]; // references EvidenceClaim.id
  safetyNotes?: string;
}

export type ShotType = 
  | 'extreme wide'
  | 'wide'
  | 'medium'
  | 'close-up'
  | 'extreme close-up'
  | 'over-the-shoulder'
  | 'POV'
  | 'macro'
  | 'aerial'
  | 'tracking'
  | 'static'
  | 'time-lapse'
  | 'conceptual visualization';

export interface Shot {
  shotId: string; // e.g. "SHOT-01"
  sceneId: string; // e.g. "SCENE-01"
  shotNumber: number;
  durationSeconds: number;
  shotType: ShotType;
  cameraMovement: string;
  lensStyle: string; // e.g. "35mm anamorphic T1.5, shallow depth of field"
  composition: string;
  subject: string;
  environment: string;
  lighting: string;
  colorMood: string;
  visualAction: string;
  transition: string;
  thumbnailUrl?: string;
  thumbnailPrompt: string;
  claimId?: string; // signature traceability connection
}

export interface ShotListEntry {
  id: string;
  sceneId: string;
  shotId: string;
  duration: string;
  location: string;
  talent: string;
  props: string;
  camera: string;
  audio: string;
  vfx: string;
  status: 'PLANNED' | 'READY' | 'FILMED' | 'IN_EDIT';
}

export interface ProductionScheduleBlock {
  day: number;
  timeRange: string;
  activity: string;
  location: string;
  sceneReferences: string[];
  crewNotes: string;
}

export interface AssetChecklistItem {
  id: string;
  category: 'footage' | 'narration' | 'music' | 'sfx' | 'graphics' | 'captions' | 'citations' | 'thumbnails';
  item: string;
  status: 'PENDING' | 'GENERATED' | 'APPROVED';
  formatSpecs: string;
}

export interface QualityReport {
  factualityScore: number; // 0 - 100
  sourceQualityScore: number;
  safetyScore: number;
  narrativeScore: number;
  productionScore: number;
  accessibilityScore: number;
  overallScore: number;
  factualityNotes: string[];
  medicalSafetyNotes: string[];
  copyrightNotes: string[];
  privacyNotes: string[];
  accessibilityNotes: string[];
  approvedForDistribution: boolean;
  timestamp: string;
}

export type StudioAgentRole = 
  | 'Parallel Research Producer'
  | 'Creative Director'
  | 'Research Producer'
  | 'Parallel Search'
  | 'Fact Checker'
  | 'Story Architect'
  | 'Screenwriter'
  | 'Storyboard Director'
  | 'Production Manager'
  | 'Quality Supervisor'
  | 'Safety Supervisor';

export interface AgentActivityLog {
  id: string;
  timestamp: string;
  agentName?: string;
  agentRole?: StudioAgentRole;
  action: string;
  status: 'RUNNING' | 'SUCCESS' | 'WARNING' | 'FAILED' | 'COMPLETED' | string;
  details?: string;
}

export interface PartnerRuntimeStats {
  provider: 'PARALLEL';
  status: 'LIVE' | 'CONNECTED';
  requestsCount: number;
  sourcesCount: number;
  evidenceExtractedCount: number;
  claimsVerifiedCount: number;
  lastQuery: string;
  lastTimestamp: string;
  latencyMs: number;
}

export interface HumanApprovalGate {
  id: string;
  stage: 'CREATIVE_BRIEF' | 'RESEARCH_EVIDENCE' | 'SCRIPT' | 'STORYBOARD' | 'PRODUCTION_PLAN' | 'FINAL_QA' | 'SCREENPLAY' | 'FINAL_PACKAGE' | string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVISION_REQUESTED';
  approvedBy?: string;
  timestamp?: string;
  notes?: string;
}

export interface CinemaProject {
  id: string;
  title: string;
  logline: string;
  targetAudience: string;
  durationSeconds: number;
  format: string;
  visualStyle: VisualStyleKey;
  currentState?: ProductionState;
  status?: string;
  pipelineStage?: string;
  createdAt: string;
  updatedAt: string;
  version?: number;
  brief: CreativeBrief;
  researchQueries?: ResearchQuery[];
  queries?: ResearchQuery[];
  sources: ResearchSource[];
  claims: EvidenceClaim[];
  storyBeats?: StoryBeat[];
  beats?: StoryBeat[];
  scenes: Scene[];
  shots: Shot[];
  shotList: ShotListEntry[];
  schedule: ProductionScheduleBlock[];
  assets: AssetChecklistItem[];
  qualityReport: QualityReport;
  approvals: HumanApprovalGate[];
  activityLogs?: AgentActivityLog[];
  agentLogs?: AgentActivityLog[];
  partnerTelemetry?: PartnerRuntimeStats;
  partnerStats?: PartnerRuntimeStats;
  targetLanguage?: string;
}

export type CinemaViewTab = 
  | 'studio'
  | 'dashboard'
  | 'brief'
  | 'research'
  | 'evidence'
  | 'script'
  | 'storyboard'
  | 'shotlist'
  | 'production'
  | 'qa'
  | 'export'
  | 'agents'
  | 'projects';

