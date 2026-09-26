// ==========================================
// LIFEWEAVE: EVIDENCE-GUIDED AUTONOMOUS SOFTWARE ENGINEERING
// Type Definitions & Data Models
// ==========================================

export type InvestigationStatus =
  | 'ORIENTING'
  | 'MAPPING'
  | 'LOCATING'
  | 'GATHERING_EVIDENCE'
  | 'HYPOTHESIS_FORMATION'
  | 'VALIDATION_PLANNING'
  | 'PATCH_PROPOSED'
  | 'TESTING'
  | 'RECOVERY'
  | 'COMPLETED'
  | 'HUMAN_REVIEW_REQUIRED';

export type PatchRiskLevel = 
  | 'LOW' 
  | 'MEDIUM' 
  | 'HIGH' 
  | 'HUMAN_REVIEW_REQUIRED';

export type NodeType =
  | 'FILE'
  | 'MODULE'
  | 'FUNCTION'
  | 'CLASS'
  | 'INTERFACE'
  | 'TEST'
  | 'API_ROUTE'
  | 'COMPONENT'
  | 'SERVICE';

export type EdgeType =
  | 'IMPORTS'
  | 'CALLS'
  | 'DEPENDENCY'
  | 'TESTS'
  | 'REFERENCES'
  | 'DATA_FLOW'
  | 'API_RELATIONSHIP';

export type FailureClass =
  | 'WRONG_LOCALIZATION'
  | 'WRONG_HYPOTHESIS'
  | 'INCOMPLETE_EVIDENCE'
  | 'INCORRECT_PATCH'
  | 'REGRESSION'
  | 'ENVIRONMENT_ISSUE'
  | 'DEPENDENCY_PROBLEM'
  | 'SECURITY_CONCERN';

// Repository Health & State
export interface RepositoryHealth {
  status: 'HEALTHY' | 'DEGRADED' | 'WARNING';
  branch: string;
  lastScanTime: string;
  indexedFiles: number;
  totalSymbols: number;
  dependencies: number;
  testsTotal: number;
  testsPassing: number;
  detectedWarnings: number;
  gitCommit: string;
}

// Code Map Graph
export interface CodeMapNode {
  id: string;
  name: string;
  path: string;
  type: NodeType;
  symbol?: string;
  description?: string;
  referencesCount?: number;
  callers?: string[];
  callees?: string[];
  imports?: string[];
  dependents?: string[];
  associatedTests?: string[];
  isClinicalOrSafetyCritical?: boolean;
  confidenceScore?: number; // 0 - 1
  evidenceScore?: number; // 0 - 1
  riskLevel?: PatchRiskLevel;
}

export interface CodeMapEdge {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
  label?: string;
}

export interface LivingCodeMapData {
  nodes: CodeMapNode[];
  edges: CodeMapEdge[];
}

// Evidence Field
export interface EvidenceMetrics {
  semanticRelevance: number | null; // null represents explicitly 'Unknown'
  structuralRelevance: number | null;
  dependencyRelevance: number | null;
  testRelevance: number | null;
  behavioralRelevance: number | null;
  issueClueRelevance: number | null;
  contradiction: number | null;
  uncertainty: number; // 0 - 1
  provenance: string;
}

export interface SupportingEvidenceItem {
  id: string;
  description: string;
  source: string;
  confidenceContribution: number; // e.g. +0.15
}

export interface ContradictoryEvidenceItem {
  id: string;
  description: string;
  source: string;
  confidenceImpact: number; // e.g. -0.12
}

export interface CandidateLocation {
  id: string;
  filePath: string;
  symbol: string;
  nodeType: NodeType;
  isClinicalOrSafetyCritical: boolean;
  evidence: EvidenceMetrics;
  supportingEvidence: SupportingEvidenceItem[];
  contradictoryEvidence: ContradictoryEvidenceItem[];
  confidence: number; // 0 - 1
  recommendedAction: string;
  codeSnippet?: string;
  lineNumbers?: { start: number; end: number };
}

// Hypotheses
export interface Hypothesis {
  id: string;
  code: string; // e.g. "H1", "H2", "H3"
  title: string;
  targetFile: string;
  targetSymbol?: string;
  explanation: string;
  confidence: number; // 0 - 1
  uncertainty: number; // 0 - 1
  supportingSummary: string[];
  contradictorySummary: string[];
  affectedNodes: string[];
  missingEvidence: string;
  nextRecommendedStep: string;
}

// Adaptive Evidence Acquisition
export interface EvidenceRequest {
  id: string;
  action: string;
  targetNode: string;
  rationale: string;
  expectedValue: 'High' | 'Medium' | 'Low';
  estimatedCost: 'Low' | 'Medium' | 'High';
  priorityScore: number; // heuristic score
}

// Patch Proposal & Invariant
export interface CodeDiffFile {
  path: string;
  originalCode: string;
  proposedCode: string;
  addedLinesCount: number;
  removedLinesCount: number;
}

export interface PatchProposal {
  id: string;
  investigationId: string;
  targetFiles: string[];
  changeDescription: string;
  invariantStatement: string; // What behavior must remain true
  riskLevel: PatchRiskLevel;
  clinicalSafetyImpactReason?: string;
  validationPlan: string[];
  isHumanReviewRequired: boolean;
  humanApprovalStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'NOT_REQUIRED';
  humanReviewerNotes?: string;
  diffs: CodeDiffFile[];
  scopeEvaluation: string;
}

// Validation & Recovery
export interface ValidationResult {
  id: string;
  timestamp: string;
  targetedPass: boolean;
  regressionPass: boolean;
  invariantPass: boolean;
  securityPass: boolean;
  overallStatus: 'PASS' | 'FAIL' | 'IN_PROGRESS';
  testSummary: {
    executed: number;
    passed: number;
    failed: number;
    durationMs: number;
  };
  failureClass?: FailureClass;
  failureDetails?: string;
}

export interface RecoveryStep {
  stepNumber: number;
  timestamp: string;
  failureClass: FailureClass;
  observedFailure: string;
  agentInterpretation: string;
  correctiveAction: string;
  hypothesisAdjustment: string;
}

// Investigation Audit Trail
export interface InvestigationEvent {
  id: string;
  timestamp: string;
  timeFormatted: string; // e.g. "08:42"
  title: string;
  details?: string;
  category: 'SYSTEM' | 'MAP' | 'EVIDENCE' | 'HYPOTHESIS' | 'PATCH' | 'TEST' | 'SAFETY';
}

// Main Investigation Entity
export interface Investigation {
  id: string;
  issueTitle: string;
  issueDescription: string;
  issueIdOptional?: string;
  repository: string;
  filePathOptional?: string;
  errorMessageOptional?: string;
  stackTraceOptional?: string;
  failingTestOptional?: string;
  logsOptional?: string;
  createdAt: string;
  updatedAt: string;
  status: InvestigationStatus;
  progressPercent: number; // 0 - 100
  isSafetyCritical: boolean;
  isRealRepositoryInvestigation?: boolean;
  activeCandidateId?: string;
  activeHypothesisId?: string;
  candidates: CandidateLocation[];
  hypotheses: Hypothesis[];
  evidenceRequests: EvidenceRequest[];
  next_evidence_request?: EvidenceRequest | null;
  patchProposal?: PatchProposal;
  validationResult?: ValidationResult;
  recoverySteps: RecoveryStep[];
  eventsTrail: InvestigationEvent[];
}

// Benchmark & Lab
export interface BenchmarkConfiguration {
  id: string;
  name: string;
  description: string;
  category: 'BASELINE_A' | 'BASELINE_B' | 'BASELINE_C' | 'BASELINE_D' | 'LIFEWEAVE';
  retrievalStrategy: string;
  includesUncertainty: boolean;
  includesContradictions: boolean;
  includesAdaptiveAcquisition: boolean;
  includesFailureRecovery: boolean;
}

export interface BenchmarkRunResult {
  experimentId: string;
  configurationId: string;
  name: string;
  hasRun: boolean;
  patchPassRate: number | null; // null if "Not measured yet"
  repairSuccessRate: number | null;
  regressionRate: number | null;
  recallAt1: number | null;
  recallAt3: number | null;
  recallAt5: number | null;
  averageFilesInspected: number | null;
  averageTokens: number | null;
  averageWallClockSec: number | null;
  contradictionDetectionRate: number | null;
  recoverySuccessRate: number | null;
}

// Gemma 4 Competition Agent Manifest
export interface Gemma4AgentManifest {
  competition: string;
  targetModel: string; // gemma-4-31b-it-qat-w4a16-ct
  agentYamlContent: string;
  systemPromptContent: string;
  analyzerPromptContent: string;
  skillMdContent: string;
  samplingYamlContent: string;
}
