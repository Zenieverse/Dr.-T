// ============================================================================
// THREE HATS — PROFESSIONAL, PERSONAL & SOCIAL
// Interactive Role-Mapping, Reflection & Life-Balance Experience
// ============================================================================

export type HatType = 'professional' | 'personal' | 'social';

export interface HatDefinition {
  id: HatType;
  title: string;
  theme: string;
  accentColor: string;
  badgeBg: string;
  borderColor: string;
  description: string;
  typicalCategories: string[];
}

export const THREE_HATS_DEFINITIONS: Record<HatType, HatDefinition> = {
  professional: {
    id: 'professional',
    title: 'Professional Hat',
    theme: 'How I contribute, work, learn, lead, and build.',
    accentColor: 'text-sky-400',
    badgeBg: 'bg-sky-950/80 text-sky-300 border-sky-700/60',
    borderColor: 'border-sky-500/40',
    description: 'Work, leadership, skill mastery, problem-solving, and career exploration.',
    typicalCategories: [
      'Work and contribution',
      'Learning and growth',
      'Responsibility and stewardship'
    ]
  },
  personal: {
    id: 'personal',
    title: 'Personal Hat',
    theme: 'How I care for myself, manage my private life, grow, and maintain close relationships.',
    accentColor: 'text-emerald-400',
    badgeBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60',
    borderColor: 'border-emerald-500/40',
    description: 'Self & wellbeing, optional family & relationship roles, rest, creativity, and habits.',
    typicalCategories: [
      'Self and wellbeing',
      'Family and close relationships (optional)',
      'Personal development'
    ]
  },
  social: {
    id: 'social',
    title: 'Social Hat',
    theme: 'How I relate to others, participate in society, build community, and contribute beyond my private life.',
    accentColor: 'text-amber-400',
    badgeBg: 'bg-amber-950/80 text-amber-300 border-amber-700/60',
    borderColor: 'border-amber-500/40',
    description: 'Belonging, community participation, volunteering, traditions, and culture.',
    typicalCategories: [
      'Relationships and belonging',
      'Contribution and leadership',
      'Culture and shared knowledge (optional)'
    ]
  }
};

export type RoleStatus = 'current' | 'occasional' | 'aspirational' | 'paused' | 'completed';
export type RoleImportance = 'core' | 'high' | 'moderate' | 'low';
export type RoleEnergy = 'energizing' | 'neutral' | 'draining';

export interface ThreeHatsRole {
  id: string;
  userId: string;
  name: string;
  description: string;
  category: string;
  hatIds: HatType[]; // Roles can span multiple hats when appropriate
  status: RoleStatus;
  importance: RoleImportance;
  energyLevel?: RoleEnergy;
  timeDemand?: string; // e.g. "4 hrs/wk", "Occasional"
  values: string[];
  commitments: string[];
  createdAt: string;
  updatedAt: string;
  isLibraryTemplate?: boolean;
}

export type CommitmentPriority = 'high' | 'medium' | 'low';
export type CommitmentStatus = 'planned' | 'in_progress' | 'completed' | 'paused';

export interface ThreeHatsCommitment {
  id: string;
  userId: string;
  roleId: string;
  roleName: string;
  hatId: HatType;
  title: string;
  targetDate?: string;
  estimatedHours?: number;
  priority: CommitmentPriority;
  status: CommitmentStatus;
  personalValue: string;
  nextAction: string;
  createdAt: string;
  updatedAt: string;
}

export interface HatPerspectiveScores {
  importance: number; // 1-5 scale (How much does this hat matter to me now?)
  attention: number;  // 1-5 scale (How much time/attention recorded?)
  satisfaction: number; // 1-5 scale (How satisfied am I with this area?)
}

export interface ThreeHatsWeeklyReflection {
  id: string;
  userId: string;
  weekStartDate: string;
  // 6-Step Weekly Ritual
  step1_meaningful: string; // What felt meaningful this week?
  step2_attentionReview: string; // Which roles received intended attention?
  step3_conflictsNoticed: string; // Conflicts between roles, time, energy, expectations?
  step4_appreciations: string; // What went well, including something small?
  step5_realisticAdjustment: string; // One realistic adjustment for next week?
  step6_committedActions: string[]; // Up to 3 next actions
  // 3-Perspective Balance Model
  perspectives: Record<HatType, HatPerspectiveScores>;
  savedToLanternKeeper?: boolean;
  lanternMemoryId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ThreeHatsCompanionRequest {
  roles: ThreeHatsRole[];
  commitments: ThreeHatsCommitment[];
  recentReflection?: Partial<ThreeHatsWeeklyReflection>;
  userQuery?: string;
}

export interface ThreeHatsCompanionResponse {
  success: boolean;
  observation: string;
  citedUserInputs: string[];
  competingRolesNotice?: string;
  gentleOptions: string[];
  suggestedAdjustment?: string;
  permissionRequiredToSaveMemory: boolean;
  provider: string;
  timestamp: string;
}
