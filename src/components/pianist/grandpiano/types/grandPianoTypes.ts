// ==========================================
// FLOW GRAND PIANO: COMPREHENSIVE DATA TYPES
// Classical Music Library, Digital Piano & Two-Mode Learning Studio
// ==========================================

export type MusicalPeriod = 'Baroque' | 'Classical' | 'Romantic' | 'Impressionist' | 'Modern';
export type WorkDifficulty = 'Beginner' | 'Intermediate' | 'Late Intermediate' | 'Advanced' | 'Virtuoso';
export type WorkInstrumentation = 'Solo Piano' | 'Orchestral' | 'Chamber' | 'Piano Concerto' | 'Choral';
export type GrandPianoSection = 
  | 'home' 
  | 'piano' 
  | 'library' 
  | 'learn-ear' 
  | 'learn-theory' 
  | 'play-along' 
  | 'sheet-music' 
  | 'practice' 
  | 'my-music' 
  | 'my-progress' 
  | 'settings';

export type PianoPreset = 'concert-grand' | 'mellow-piano' | 'soft-piano' | 'bright-upright';
export type HandAssignment = 'LH' | 'RH' | 'both';

// 9.1 Works Data Model
export interface ClassicalWork {
  work_id: string;
  title: string;
  composer: string;
  composer_lifespan: string;
  catalogue_number: string;
  composition_period: MusicalPeriod;
  composition_year?: number;
  genre: string;
  instrumentation: WorkInstrumentation;
  difficulty_level: WorkDifficulty;
  key_signature: string;
  time_signature: string;
  tempo_bpm: number;
  tempo_marking: string;
  description: string;
  tags: string[];
  movements_count: number;
  movements: ClassicalMovement[];
  has_audio: boolean;
  has_midi: boolean;
  has_sheet_music: boolean;
  cover_gradient: string;
  historical_context: string;
}

// 9.2 Movements & Practice Sections Model
export interface ClassicalMovement {
  movement_id: string;
  work_id: string;
  movement_number: number;
  title: string;
  tempo_marking: string;
  duration_seconds: number;
  key_signature: string;
  time_signature: string;
  tempo_bpm: number;
  practice_difficulty: WorkDifficulty;
  practice_sections: PracticeSection[];
  audio_url?: string;
  is_verified_complete: boolean;
}

export interface PracticeSection {
  section_id: string;
  title: string;
  measure_start: number;
  measure_end: number;
  hand: HandAssignment;
  notes: VerifiedNoteEvent[];
  contour: ('higher' | 'lower' | 'same')[];
  key_highlights: string[];
  theory_insight: string;
  rhythm_description: string;
  suggested_bpm: number;
}

// 9.4 MIDI Note Event Model
export interface VerifiedNoteEvent {
  id: string;
  note_name: string;      // e.g. "C4", "E4", "G4"
  midi_number: number;    // e.g. 60 for C4
  onset_time_sec: number; // relative start time
  duration_sec: number;   // note length in seconds
  velocity: number;       // 0.0 - 1.0
  hand: 'LH' | 'RH';
  measure: number;
  beat: number;
  finger_hint?: number;   // 1 (thumb) to 5 (pinky)
  staff_position?: {
    clef: 'treble' | 'bass';
    line_or_space: number; // e.g. -2 for Middle C on treble
  };
  pedal_hint?: 'down' | 'up' | 'change' | 'hold';
  lyric_or_annotation?: string;
}

// 5.3 Ear Learning Hint Levels (1 to 7)
export type EarHintLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7;

// 6.3 Theory Curriculum Stages (1 to 7)
export type TheoryStage = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface TheoryLesson {
  id: string;
  stage: TheoryStage;
  stage_title: string;
  topic: string;
  summary: string;
  details: string;
  exercise_prompt: string;
  target_notes: string[];
  target_chords?: string[][];
  clef: 'treble' | 'bass' | 'grand';
}

// 8.1 Play Along Performance Evaluation
export interface PerformanceAssessment {
  total_notes: number;
  correct_notes: number;
  missed_notes: number;
  extra_notes: number;
  accuracy_percentage: number;
  tempo_stability_score: number;
  feedback_message: string;
  xp_earned: number;
  recommended_next_step: string;
}

// 9.7 Learner Progress
export interface LearnerProgressState {
  completed_works_count: number;
  completed_sections: Record<string, boolean>; // section_id -> boolean
  mastery_percentage_by_work: Record<string, number>;
  favorite_work_ids: string[];
  recently_played_work_ids: string[];
  total_practice_seconds: number;
  streak_days: number;
  ear_mode_xp: number;
  theory_mode_xp: number;
  recordings: SavedPerformanceTake[];
}

export interface SavedPerformanceTake {
  id: string;
  work_title: string;
  timestamp: string;
  duration_seconds: number;
  notes_played_count: number;
  accuracy_percent: number;
  recorded_events: Array<{ note: string; timestamp_ms: number; duration_ms: number }>;
}

// Mini Player State
export interface MiniPlayerState {
  is_playing: boolean;
  active_work_id: string | null;
  active_movement_id: string | null;
  current_time_sec: number;
  duration_sec: number;
  volume: number;
  is_muted: boolean;
  playback_rate: number; // 0.5 to 1.25
  is_looping_section: boolean;
}

// ==========================================
// INTERACTIVE PIANO TUTOR ENGINE TYPES
// ==========================================
export type TutorModuleId = 
  | 'module-1-posture-geography'
  | 'module-2-alphabet-landmarks'
  | 'module-3-grand-staff'
  | 'module-4-rhythm-meter'
  | 'module-5-intervals-harmony'
  | 'module-6-chords-accompaniment'
  | 'module-7-touch-interpretation'
  | 'module-8-masterpiece-recital';

export interface TutorStep {
  stepId: string;
  moduleId: TutorModuleId;
  stepNumber: number;
  title: string;
  subtitle: string;
  theoryExplanation: string;
  coachAdvice: string;
  targetHand: HandAssignment;
  suggestedFingers?: number[]; // e.g. [1, 2, 3, 4, 5]
  demonstrationNotes: Array<{ note: string; durationSec: number; hand?: 'LH' | 'RH' }>;
  targetExpectedNotes: string[];
  isChordExercise?: boolean;
  expectedChords?: string[][];
  clef: 'treble' | 'bass' | 'grand';
  keySignature: string;
  timeSignature: string;
  tempoBpm: number;
  xpAward: number;
}

export interface TutorModule {
  id: TutorModuleId;
  orderNumber: number;
  title: string;
  subtitle: string;
  level: WorkDifficulty;
  estimatedMinutes: number;
  summary: string;
  badgeName: string;
  steps: TutorStep[];
}

// ==========================================
// WHOLE CLASSICAL TRACK PLAY-ALONG TYPES
// ==========================================
export interface PlayAlongGuide {
  overview: string;
  techniqueTips: string[];
  pedalAdvice: string;
  phrasingAdvice: string;
  chordProgression?: string[];
  measureHints?: Record<number, string>;
}

export interface WholeClassicalTrack {
  trackId: string;
  workId: string;
  title: string;
  composer: string;
  opusCatalog: string;
  keySignature: string;
  timeSignature: string;
  tempoBpm: number;
  tempoMarking: string;
  difficulty: WorkDifficulty;
  measuresTotal: number;
  totalDurationSeconds: number;
  coverGradient: string;
  historicalContext: string;
  notes: VerifiedNoteEvent[];
  playAlongGuide?: PlayAlongGuide;
}

export interface TrackPlayAssessment {
  trackTitle: string;
  accuracyPercent: number;
  totalNotes: number;
  notesHit: number;
  notesMissed: number;
  letterGrade: 'S' | 'A' | 'B' | 'C';
  tempoStability: number;
  xpAwarded: number;
  coachVerdict: string;
  date: string;
}

export interface VirtuosoDiplomaData {
  recipientName: string;
  completedDate: string;
  levelAchieved: string;
  masterpiecesLearned: string[];
  totalXp: number;
  academySealId: string;
}

