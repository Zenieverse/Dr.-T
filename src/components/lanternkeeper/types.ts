// ============================================================================
// LANTERN KEEPER — A PERSONAL AI THAT REMEMBERS WITH PERMISSION
// Domain Types, Evidence Retrieval, Skills Engine & Permission Manifest
// ============================================================================

export type LanternPrivacyLevel = 'PRIVATE' | 'FAMILY_EXPORTABLE' | 'ANONYMIZED';

export type MeaningfulDetailType = 
  | 'recipe'
  | 'favorite_song'
  | 'saying_or_proverb'
  | 'family_tradition'
  | 'special_place'
  | 'keepsake_or_object'
  | 'other';

export interface MeaningfulDetail {
  type: MeaningfulDetailType;
  label: string;
  value: string;
}

export interface MemoryLanternItem {
  id: string;
  userId: string;
  title: string;
  dateOrPeriod?: string; // e.g. "Summer 1984", "Circa 1965", "Unknown period"
  peopleRemembered?: string[]; // e.g. ["Grandmother Elena", "Uncle Marco"]
  story: string;
  meaningfulDetails: MeaningfulDetail[];
  tags: string[];
  category: 'Remembrance' | 'Tradition' | 'Milestone' | 'Everyday Joy' | 'Wisdom' | 'Three Hats Reflection';
  isSample?: boolean;
  privacyLevel: LanternPrivacyLevel;
  audioNote?: {
    recorded: boolean;
    durationSeconds: number;
    transcriptSummary?: string;
  };
  lanternColor?: 'amber' | 'emerald' | 'rose' | 'indigo' | 'warm_gold' | 'violet';
  createdAt: string;
  updatedAt: string;
  revokedAt?: string | null; // Permission revocation timestamp
}

// ----------------------------------------------------------------------------
// NEBIUS TOKEN FACTORY & NVIDIA NEMOTRON INFERENCE TYPES
// ----------------------------------------------------------------------------

export type LanternProviderType = 
  | 'nebius_nvidia_nemotron'
  | 'local_ollama'
  | 'hosted_open_weight'
  | 'deterministic_heuristic_engine'
  | 'deterministic_test_fixture';

export interface NebiusProviderStatus {
  status: 'READY' | 'CONFIGURED' | 'UNREACHABLE' | 'NOT_CONFIGURED';
  providerType: 'nebius_token_factory' | 'ollama' | 'hosted_open_weight' | 'none';
  modelId: string;
  endpointUrl: string;
  message: string;
  isLocal: boolean;
  checkedAt: string;
  supportedModels: string[];
  reproductionCommand: string;
  hasApiKey: boolean;
}

// ----------------------------------------------------------------------------
// EVIDENCE-BACKED MEMORY RETRIEVAL
// ----------------------------------------------------------------------------

export interface EvidenceCitation {
  memoryId: string;
  title: string;
  excerpt: string;
  matchedFact: string;
  relevanceScore: number; // 0.0 to 1.0
  peopleMentioned: string[];
  dateOrPeriod?: string;
}

export interface MemoryRetrievalRequest {
  query: string;
  userId?: string;
  filterCategory?: string;
  filterPeople?: string[];
  confidenceThreshold?: number;
  userMemories?: MemoryLanternItem[];
  isTestFixture?: boolean;
}

export interface MemoryRetrievalResponse {
  success: boolean;
  query: string;
  answer: string;
  citations: EvidenceCitation[];
  missingOrConflictingFacts: string[];
  isHallucinationFree: boolean;
  provider: LanternProviderType;
  modelUsed: string;
  latencyMs: number;
  timestamp: string;
  disclaimer: string;
}

// ----------------------------------------------------------------------------
// REUSABLE PERSONAL SKILLS
// ----------------------------------------------------------------------------

export type PersonalSkillName = 
  | 'family_story_keeper'
  | 'weekly_life_review'
  | 'memory_inspector'
  | 'three_hats_companion'
  | 'role_reflection_keeper';

export interface SkillManifest {
  name: PersonalSkillName;
  displayName: string;
  description: string;
  inputSchemaSummary: string;
  outputDescription: string;
  permissionsPolicy: string;
  isConsequential: boolean;
}

export interface SkillExecutionRequest {
  skillName: PersonalSkillName;
  userId?: string;
  payload: any;
  userMemories?: MemoryLanternItem[];
  userApproved?: boolean;
  isTestFixture?: boolean;
}

export interface SkillExecutionResponse {
  success: boolean;
  skillName: PersonalSkillName;
  result: any;
  sourcesUsed: EvidenceCitation[];
  missingFactsNoted: string[];
  provider: LanternProviderType;
  modelUsed: string;
  latencyMs: number;
  timestamp: string;
  auditRecordId?: string;
  errorMessage?: string;
}

// ----------------------------------------------------------------------------
// PERMISSION-CONTROLLED ACTIONS & AUDIT MANIFEST
// ----------------------------------------------------------------------------

export type ConsequentialActionType = 
  | 'execute_skill'
  | 'export_memories'
  | 'delete_memory_permanently'
  | 'revoke_memory_access'
  | 'save_role_reflection_as_memory'
  | 'create_three_hats_commitment';

export interface PermissionManifest {
  actionType: ConsequentialActionType;
  toolName: string;
  requiredMemoryIds: string[];
  requiredMemoryTitles: string[];
  scopeDescription: string;
  consequentialImpact: string;
  isConsequential: boolean;
  requiresExplicitApproval: boolean;
}

export interface ActionAuditRecord {
  id: string;
  userId: string;
  actionType: ConsequentialActionType;
  toolName: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'DENIED' | 'EXECUTED' | 'FAILED';
  summary: string;
  accessedMemoryCount: number;
  timestamp: string;
  // CRITICAL PRIVACY INVARIANT: Sensitive memory bodies are NEVER logged in audit records
}

// ----------------------------------------------------------------------------
// STORYTELLING TYPES (PRESERVED & EXPANDED)
// ----------------------------------------------------------------------------

export type LanternStoryMode = 
  | 'story_to_keep'
  | 'tribute_of_love'
  | 'family_storybook'
  | 'letters_for_future'
  | 'voices_and_traditions';

export type LanternStoryStyle = 
  | 'warm_simple'
  | 'poetic'
  | 'reflective'
  | 'family_storytelling';

export type LanternStoryProviderType = LanternProviderType;

export interface LanternStoryRequest {
  mode: LanternStoryMode;
  style: LanternStoryStyle;
  selectedMemoryIds: string[];
  memories: Array<{
    title: string;
    dateOrPeriod?: string;
    peopleRemembered?: string[];
    story: string;
    meaningfulDetails: MeaningfulDetail[];
    tags: string[];
  }>;
  recipientOrAudience?: string;
  additionalNotes?: string;
}

export interface LanternStoryResponse {
  success: boolean;
  storyTitle: string;
  storyNarrative: string;
  mode: LanternStoryMode;
  style: LanternStoryStyle;
  modelUsed: string;
  provider: LanternStoryProviderType;
  latencyMs: number;
  timestamp: string;
  ethicalSafetyVerified: boolean;
  suppliedFactsSummary: string[];
  creativeEnhancementsSummary: string[];
  disclaimer: string;
  errorMessage?: string;
}
