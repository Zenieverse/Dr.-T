// ==========================================
// PIANIST TOUCH GRASS TYPES
// ==========================================

export type OutdoorMissionType = 
  | 'sixty-second-walk'
  | 'rhythm-hunt'
  | 'melody-hunt'
  | 'sound-map'
  | 'rhythm-walk'
  | 'silence-mission';

export type SoundSourceCategory = 
  | 'Footsteps / Walking'
  | 'Bicycle Wheels / Mechanical'
  | 'Rain / Water Flow'
  | 'Construction / Heavy Machinery'
  | 'Traffic Signals / Pedestrian Crossing'
  | 'Doors / Latches & Hinges'
  | 'Birdsong / Avian Contour'
  | 'Water / Streams & Faucets'
  | 'Machinery / Motors & Engines'
  | 'Human Voices / Distant Murmur'
  | 'Wind / Rustling Foliage'
  | 'Bells & Whistles / Chimes';

export interface ExtractedAudioFeatures {
  durationSeconds: number;
  detectedTempoBpm?: number;
  pulseDetected: boolean;
  spectralCentroidHz: number;
  pitchDirection: 'ascending' | 'descending' | 'oscillating' | 'steady';
  rhythmicPattern: string; // e.g. "short-short-long", "steady quarter-notes"
  energyLevel: 'low' | 'medium' | 'high';
  isRealMicrophoneInput: boolean;
}

export interface GemmaMusicalReasoning {
  sound_type: string;
  source_category: SoundSourceCategory;
  pulse_detected: boolean;
  tempo_estimate: number;
  pattern: string;
  melodic_contour: 'rising' | 'falling' | 'arched' | 'static';
  confidence: number;
  recommended_skill: 'rhythm' | 'melody' | 'harmony' | 'improvisation' | 'active_listening';
  pedagogy_explanation: string;
  exercise: {
    title: string;
    type: 'piano_rhythm' | 'melody_reproduction' | 'ostinato_accompaniment' | 'improvisation_seed';
    difficulty: 1 | 2 | 3 | 4 | 5;
    keySignature: string;
    targetNotes: string[];
    suggestedHand: 'RH' | 'LH' | 'Both';
    instructions: string;
  };
  coach_tip: string;
  model_provider_name: string; // e.g. "Gemma-2-9B (Cloud)" or "Gemma Local Heuristic Engine"
}

export interface OutdoorMissionRecord {
  id: string;
  missionType: OutdoorMissionType;
  title: string;
  completedAt: string;
  soundCategory: SoundSourceCategory;
  outdoorXpEarned: number;
  reasoning: GemmaMusicalReasoning;
  performanceAccuracy?: number;
  reflectionNotes?: string;
  isDemoData: boolean;
}

export interface SoundMapPoint {
  id: string;
  category: SoundSourceCategory;
  loudness: 'whisper' | 'moderate' | 'loud';
  distance: 'near' | 'mid' | 'far';
  rhythmDescription: string;
  pitchImpression: 'high' | 'mid' | 'low';
  repeating: boolean;
  timestamp: string;
}

export type ActiveListeningLevel = 1 | 2 | 3 | 4 | 5;

export interface TouchGrassState {
  activeListeningLevel: ActiveListeningLevel;
  activeListeningScore: number; // 0-100
  outdoorXp: number;
  outdoorStreakDays: number;
  completedMissions: OutdoorMissionRecord[];
  soundMapPoints: SoundMapPoint[];
  achievements: string[];
}
