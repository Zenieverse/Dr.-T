// ============================================================================
// MEMORY LANTERN — STORIES THAT STAY (HACKTOBERFEST WEEK 4 2026)
// TypeScript Contracts and Domain Types
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
  revokedAt?: string | null;
}

// ----------------------------------------------------------------------------
// OPEN-WEIGHT GEMMA STORYTELLING MODES & CONTRACTS
// ----------------------------------------------------------------------------

export type LanternStoryMode = 
  | 'story_to_keep'        // Coherent narrative from scattered memories
  | 'tribute_of_love'      // Respectful factual remembrance
  | 'family_storybook'     // Timeline/collection structured narrative
  | 'letters_for_future'   // Wisdom for future generations
  | 'voices_and_traditions';// Focus on recipes, songs, idioms, and sayings

export type LanternStoryStyle = 
  | 'warm_simple'          // Tender, direct, heartfelt
  | 'poetic'               // Lyric, reflective imagery
  | 'reflective'           // Thoughtful, philosophical
  | 'family_storytelling'; // Engaging, intergenerational oral style

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
  recipientOrAudience?: string; // e.g. "For my grandchildren", "In memory of Papa"
  additionalNotes?: string;
}

export type LanternStoryProviderType = 
  | 'local_ollama' 
  | 'hosted_open_weight' 
  | 'nebius_nvidia_nemotron'
  | 'deterministic_test_fixture' 
  | 'deterministic_heuristic_engine';

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

export interface GemmaProviderStatus {
  status: 'READY' | 'CONFIGURED' | 'UNREACHABLE' | 'NOT_CONFIGURED';
  providerType: 'ollama' | 'hosted_open_weight' | 'none';
  modelId: string;
  endpointUrl: string;
  message: string;
  isLocal: boolean;
  checkedAt: string;
  supportedModels: string[];
  reproductionCommand: string;
}

// Re-export full Lantern Keeper & Personal AI Types
export * from './lanternKeeperTypes';
