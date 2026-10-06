// ==========================================
// PIANIST PLATFORM TYPES & DATA STRUCTURES
// ==========================================

export type PianistLevel = 
  | 'Complete Beginner'
  | 'Beginner'
  | 'Early Intermediate'
  | 'Intermediate'
  | 'Advanced'
  | 'Returning Learner'
  | 'Beginner to Advanced';

export type PracticeDuration = 5 | 10 | 20 | 30 | 45 | 60;

export type LearningStyle = 'Watch' | 'Listen' | 'Read' | 'Play' | 'Games' | 'Theory';

export type InstrumentType = 
  | 'Yamaha digital piano'
  | 'Acoustic piano'
  | 'Other digital piano'
  | 'Keyboard'
  | 'MIDI keyboard'
  | 'No piano yet (Screen only)';

export interface PianistProfile {
  name: string;
  level: PianistLevel;
  goals: string[];
  dailyPracticeMinutes: PracticeDuration;
  preferredLearningStyles: LearningStyle[];
  instrument: InstrumentType;
  streakDays: number;
  totalPracticeMinutes: number;
  totalXp: number;
  levelNumber: number;
  passport: MusicianPassport;
  badges: string[];
  currentSongId: string;
  currentLessonId: string;
  onboardingCompleted: boolean;
}

export interface MusicianPassport {
  technique: number;       // 0 - 100
  reading: number;         // 0 - 100
  ear: number;             // 0 - 100
  rhythm: number;          // 0 - 100
  theory: number;          // 0 - 100
  creativity: number;      // 0 - 100
  performance: number;     // 0 - 100
  activeListening?: number; // 0 - 100 (Outdoor Active Listening)
}

export interface NoteInfo {
  name: string;       // e.g. "C4"
  pitch: string;      // "C"
  octave: number;     // 4
  midi: number;       // 60
  freq: number;       // 261.63
  isBlack: boolean;
  keyLabel?: string;  // Keyboard shortcut e.g. "A"
  solfege?: string;   // "Do"
  fingerHint?: number; // 1-5
}

export type KeyLabelMode = 'names' | 'solfege' | 'shortcuts' | 'fingers' | 'none';

export interface TodayMission {
  id: string;
  durationMinutes: PracticeDuration;
  date: string;
  steps: Array<{
    id: string;
    title: string;
    category: 'warmup' | 'ear' | 'theory' | 'technique' | 'song' | 'improv';
    durationMin: number;
    description: string;
    completed: boolean;
    icon: string;
    actionTab: PianistSubTab;
  }>;
}

export type PianistSubTab = 
  | 'home'
  | 'touch-grass'
  | 'outdoor'
  | 'keyboard'
  | 'learn'
  | 'ear'
  | 'sight-reading'
  | 'theory'
  | 'songs'
  | 'improv'
  | 'coach'
  | 'passport'
  | 'schedule'
  | 'independent-test'
  | 'teacher-view';

export interface Lesson {
  id: string;
  pathId: 'first-notes' | 'rhythm' | 'note-reading' | 'chords' | 'play-by-ear' | 'improvisation';
  title: string;
  subtitle: string;
  level: PianistLevel;
  estimatedMinutes: number;
  description: string;
  learnText: string;
  notesToPlay: string[]; // e.g. ['C4', 'D4', 'E4']
  rhythmPattern?: string; // e.g. "Quarter Quarter Half"
  interactivePrompt: string;
  videoUrl?: string;
  category: string;
  completed?: boolean;
}

export interface SongPiece {
  id: string;
  title: string;
  composer: string;
  genre: 'Classical' | 'Pop' | 'Jazz' | 'Traditional' | 'Soundtrack';
  keySignature: string;
  bpm: number;
  timeSignature: string;
  difficulty: 'Beginner' | 'Easy' | 'Intermediate' | 'Advanced';
  description: string;
  stepsCount: number;
  melodyNotes: Array<{ note: string; duration: number; hand: 'RH' | 'LH'; time: number }>;
  chords: string[];
  beginnerTips: string;
}

export interface EarExercise {
  id: string;
  levelNumber: number;
  title: string;
  type: 'high-low' | 'same-diff' | 'direction' | 'steps-skips' | 'intervals' | 'major-minor' | 'listen-find-play' | 'progression';
  prompt: string;
  notes: string[];
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface PracticeSessionRecord {
  id: string;
  date: string;
  durationMinutes: number;
  accuracy: number;
  rhythmScore: number;
  earScore: number;
  notesPlayed: number;
  improvedSkill: string;
  keepPracticingSkill: string;
  tomorrowFocus: string;
}
