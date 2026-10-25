export type LifecycleStage = 
  | 'discover' 
  | 'scope' 
  | 'plan' 
  | 'specify' 
  | 'build' 
  | 'test' 
  | 'document' 
  | 'publish';

export type DeliverableStatus = 
  | 'not_started' 
  | 'draft' 
  | 'skill_pack_generated' 
  | 'reviewed' 
  | 'exported';

export type TaskStatus = 
  | 'backlog' 
  | 'ready' 
  | 'in_progress' 
  | 'testing' 
  | 'done' 
  | 'blocked';

export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';

export interface ProjectDocument {
  id: string;
  filename: 'scope.md' | 'prd.md' | 'spec.md' | 'README.md';
  title: string;
  content: string;
  status: DeliverableStatus;
  lastUpdated: string;
  validationErrors: string[];
  requiredSections: string[];
  isApproved: boolean;
  sourceOfTruth: 'dr_t_draft' | 'skill_pack_agent' | 'user_manual';
}

export interface ProjectBrief {
  problemStatement: string;
  targetAudience: string;
  userPersonas: Array<{ name: string; role: string; needs: string; painPoints: string }>;
  userStories: Array<{ asA: string; iWant: string; soThat: string }>;
  proposedSolution: string;
  workflow: string;
  functionalRequirements: string[];
  nonFunctionalRequirements: string[];
  scopeBoundaries: {
    inScope: string[];
    outOfScope: string[];
  };
  acceptanceCriteria: string[];
  technicalRisks: string[];
  securityAndPrivacy: string[];
  milestones: Array<{ name: string; targetDate: string; done: boolean }>;
  testStrategy: string;
  definitionOfDone: string[];
  isApproved: boolean;
  generatedByAi?: boolean;
  lastGeneratedAt?: string;
}

export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  acceptanceCriteria: string[];
  testExpectations: string;
  estimatedHours: number;
  stage: LifecycleStage;
  sourceArtifact?: 'scope' | 'prd' | 'spec' | 'manual';
}

export interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  category: 'eligibility' | 'skill_pack' | 'artifacts' | 'repository' | 'submission';
  required: boolean;
  completed: boolean;
  evidence?: string;
  verified: boolean;
}

export interface ChallengeChecklist {
  officialChallengeUrl: string;
  lastVerifiedDate: string;
  repositoryUrl: string;
  demoVideoUrl: string;
  devpostProjectUrl?: string;
  items: ChecklistItem[];
}

export interface CodeReviewFinding {
  type: 'defect' | 'security' | 'performance' | 'best_practice';
  message: string;
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
  lineHint?: string;
}

export interface CodeReviewRecord {
  id: string;
  filename: string;
  codeSnippet: string;
  language: string;
  timestamp: string;
  findings: CodeReviewFinding[];
  suggestedTests: string[];
  implementationInstructions: string;
  explainedInPlainLanguage: string;
}

export interface BuildWithAiProject {
  id: string;
  userId: string;
  name: string;
  tagline: string;
  description: string;
  stage: LifecycleStage;
  modelPreference: string;
  targetAudience: string;
  problemStatement: string;
  proposedSolution: string;
  keyFeatures: string[];
  workflow: string;
  constraints: string;
  privacyConsiderations: string;
  successCriteria: string;
  submissionDestination: string;
  isTemplate?: boolean;
  createdAt: string;
  updatedAt: string;
  brief: ProjectBrief;
  documents: Record<'scope.md' | 'prd.md' | 'spec.md' | 'README.md', ProjectDocument>;
  tasks: ProjectTask[];
  checklist: ChallengeChecklist;
  codeReviews: CodeReviewRecord[];
}
