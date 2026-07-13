import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Music, 
  Sparkles, 
  Info, 
  Activity, 
  Sliders, 
  Cpu, 
  Flame, 
  Compass, 
  Heart, 
  Moon, 
  Sun,
  Award,
  Mic,
  MicOff,
  Radio,
  Save,
  Trash2
} from 'lucide-react';

const NOTE_FREQS: { [key: string]: number } = {
  'G3': 196.00, 'G#3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'B3': 246.94,
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
  'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'B5': 987.77,
  'C6': 1046.50, 'REST': 0
};

interface SymphonyMasterpiece {
  id: string;
  composer: string;
  name: string;
  emoji: string;
  year: string;
  description: string;
  benefits: string;
  defaultInstrument: 'piano' | 'violin' | 'flute';
  tempo: number;
  bgGradient: string;
  cardColor: string;
  notes: { note: string; dur: number }[];
  lyrics: string[];
}

const MASTERPIECES: SymphonyMasterpiece[] = [
  {
    id: "pop_blinding",
    composer: "The Weeknd",
    name: "Blinding Lights",
    emoji: "⚡",
    year: "2019",
    description: "The ultimate modern synth-pop anthem. Bright, energetic, driving synth hook that is highly focusing and mood-boosting.",
    benefits: "High energy & upbeat momentum",
    defaultInstrument: "piano",
    tempo: 120,
    bgGradient: "from-amber-500 to-rose-600",
    cardColor: "border-amber-100 bg-amber-50/40 text-amber-900",
    notes: [
      { note: 'F4', dur: 0.3 }, { note: 'F4', dur: 0.3 }, { note: 'G4', dur: 0.3 }, { note: 'C4', dur: 0.3 },
      { note: 'D4', dur: 0.3 }, { note: 'F4', dur: 0.3 }, { note: 'G4', dur: 0.3 }, { note: 'F4', dur: 0.3 },
      { note: 'D4', dur: 0.3 }, { note: 'C4', dur: 0.3 }, { note: 'D4', dur: 0.6 }, { note: 'REST', dur: 0.6 }
    ],
    lyrics: [
      "I've been tryna call",
      "I've been on my own for long enough",
      "Maybe you can show me how to love, maybe",
      "I'm going through withdrawals",
      "You don't even have to do too much",
      "I'm blinded by the lights!",
      "No, I can't sleep until I feel your touch"
    ]
  },
  {
    id: "pop_shape",
    composer: "Ed Sheeran",
    name: "Shape of You",
    emoji: "➗",
    year: "2017",
    description: "Infectious marimba rhythmic hook. Wonderfully balanced tempo for motor entrainment and rhythmic focus.",
    benefits: "Rhythmic synchronization & motor clarity",
    defaultInstrument: "piano",
    tempo: 96,
    bgGradient: "from-sky-400 to-indigo-600",
    cardColor: "border-sky-100 bg-sky-50/40 text-sky-900",
    notes: [
      { note: 'C#4', dur: 0.25 }, { note: 'E4', dur: 0.25 }, { note: 'C#4', dur: 0.25 }, { note: 'C#4', dur: 0.25 },
      { note: 'E4', dur: 0.25 }, { note: 'C#4', dur: 0.25 }, { note: 'C#4', dur: 0.25 }, { note: 'E4', dur: 0.25 },
      { note: 'D#4', dur: 0.25 }, { note: 'C#4', dur: 0.25 }, { note: 'B3', dur: 0.5 }, { note: 'REST', dur: 0.4 }
    ],
    lyrics: [
      "The club isn't the best place to find a lover",
      "So the bar is where I go",
      "Me and my friends at the table doing shots",
      "Drinking fast and then we talk slow",
      "I'm in love with the shape of you",
      "We push and pull like a magnet do",
      "Every day discovering something brand new",
      "I'm in love with your body"
    ]
  },
  {
    id: "pop_badromance",
    composer: "Lady Gaga",
    name: "Bad Romance",
    emoji: "👑",
    year: "2009",
    description: "The theatrical and powerful synth-dance pop hook. Highly empowering, energetic, and confidence-building.",
    benefits: "Assertiveness & active stimulation",
    defaultInstrument: "piano",
    tempo: 119,
    bgGradient: "from-rose-500 to-purple-800",
    cardColor: "border-rose-100 bg-rose-50/40 text-rose-900",
    notes: [
      { note: 'G4', dur: 0.3 }, { note: 'G4', dur: 0.3 }, { note: 'A4', dur: 0.3 }, { note: 'G4', dur: 0.3 },
      { note: 'F4', dur: 0.3 }, { note: 'G4', dur: 0.3 }, { note: 'A4', dur: 0.3 }, { note: 'G4', dur: 0.6 },
      { note: 'C5', dur: 0.3 }, { note: 'REST', dur: 0.6 }
    ],
    lyrics: [
      "Oh-oh-oh-oh-oh",
      "I want your ugly, I want your disease",
      "I want your everything as long as it's free",
      "I want your love, love, love, love",
      "I want your love",
      "You and me could write a bad romance",
      "Caught in a bad romance!"
    ]
  },
  {
    id: "pop_stayin",
    composer: "Bee Gees",
    name: "Stayin' Alive",
    emoji: "🕺",
    year: "1977",
    description: "The legendary, high-groove disco masterpiece. Its rhythm is globally used for perfect tempo keeping and active pacing.",
    benefits: "Heart-rate coherence & steady pace",
    defaultInstrument: "flute",
    tempo: 104,
    bgGradient: "from-fuchsia-500 to-red-600",
    cardColor: "border-fuchsia-100 bg-fuchsia-50/40 text-fuchsia-900",
    notes: [
      { note: 'F4', dur: 0.3 }, { note: 'F4', dur: 0.3 }, { note: 'F4', dur: 0.3 }, { note: 'D#4', dur: 0.3 },
      { note: 'F4', dur: 0.3 }, { note: 'G#4', dur: 0.3 }, { note: 'G4', dur: 0.3 }, { note: 'F4', dur: 0.6 },
      { note: 'REST', dur: 0.6 }
    ],
    lyrics: [
      "Well, you can tell by the way I use my walk",
      "I'm a woman's man, no time to talk",
      "Music loud and women warm",
      "I've been kicked around since I was born",
      "And now it's all right, it's okay",
      "And you may look the other way",
      "Ah, ha, ha, ha, stayin' alive, stayin' alive!"
    ]
  },
  {
    id: "pop_rolling",
    composer: "Adele",
    name: "Rolling in the Deep",
    emoji: "🌊",
    year: "2010",
    description: "Soulful, pounding pop-rock masterpiece. Highly cathartic for emotional release, vocal resonance, and deep grounding.",
    benefits: "Catharsis & emotional release",
    defaultInstrument: "violin",
    tempo: 105,
    bgGradient: "from-teal-400 to-emerald-700",
    cardColor: "border-teal-100 bg-teal-50/40 text-teal-900",
    notes: [
      { note: 'C5', dur: 0.4 }, { note: 'C5', dur: 0.4 }, { note: 'C5', dur: 0.4 }, { note: 'B4', dur: 0.4 },
      { note: 'B4', dur: 0.4 }, { note: 'A4', dur: 0.4 }, { note: 'A4', dur: 0.4 }, { note: 'G4', dur: 0.4 },
      { note: 'G4', dur: 0.6 }, { note: 'REST', dur: 0.4 }
    ],
    lyrics: [
      "There's a fire starting in my heart",
      "Reaching a fever pitch and it's bringing me out the dark",
      "Finally, I can see you crystal clear",
      "Go ahead and sell me out and I'll lay your ship bare",
      "We could have had it all",
      "Rolling in the deep",
      "You had my heart inside of your hand",
      "And you played it to the beat"
    ]
  },
  {
    id: "pop_billiejean",
    composer: "Michael Jackson",
    name: "Billie Jean",
    emoji: "👞",
    year: "1982",
    description: "The legendary bassline and synth-funk groove. Extremely tight, crisp, and mentally organizing.",
    benefits: "Precision & rhythmic sharpness",
    defaultInstrument: "piano",
    tempo: 117,
    bgGradient: "from-slate-700 to-stone-900",
    cardColor: "border-stone-200 bg-stone-50/40 text-stone-900",
    notes: [
      { note: 'F#3', dur: 0.3 }, { note: 'C#4', dur: 0.3 }, { note: 'E4', dur: 0.3 }, { note: 'F#4', dur: 0.3 },
      { note: 'E4', dur: 0.3 }, { note: 'C#4', dur: 0.3 }, { note: 'B3', dur: 0.3 }, { note: 'C#4', dur: 0.5 },
      { note: 'REST', dur: 0.4 }
    ],
    lyrics: [
      "She was more like a beauty queen from a movie scene",
      "I said don't mind, but what do you mean, I am the one",
      "Who will dance on the floor in the round",
      "She said I am the one, who will dance on the floor in the round",
      "Billie Jean is not my lover",
      "She's just a girl who claims that I am the one",
      "But the kid is not my son"
    ]
  },
  {
    id: "pop_dontstart",
    composer: "Dua Lipa",
    name: "Don't Start Now",
    emoji: "💃",
    year: "2019",
    description: "The shimmering modern nu-disco hit. Upbeat, swift, and highly refreshing for mental processing speed.",
    benefits: "Processing speed & mental agility",
    defaultInstrument: "flute",
    tempo: 124,
    bgGradient: "from-emerald-400 to-cyan-600",
    cardColor: "border-emerald-100 bg-emerald-50/40 text-emerald-900",
    notes: [
      { note: 'B4', dur: 0.25 }, { note: 'B4', dur: 0.25 }, { note: 'A4', dur: 0.25 }, { note: 'B4', dur: 0.25 },
      { note: 'D5', dur: 0.25 }, { note: 'B4', dur: 0.25 }, { note: 'A4', dur: 0.25 }, { note: 'G4', dur: 0.25 },
      { note: 'A4', dur: 0.25 }, { note: 'B4', dur: 0.5 }, { note: 'REST', dur: 0.4 }
    ],
    lyrics: [
      "Did a full 180, crazy",
      "Thinking 'bout the way I was",
      "Did the heartbreak change me? Maybe",
      "But look at where I ended up",
      "Don't show up, don't start caring about me now",
      "Walk away, you know how",
      "Don't start now!"
    ]
  },
  {
    id: "pop_takeonme",
    composer: "A-ha",
    name: "Take On Me",
    emoji: "✍️",
    year: "1984",
    description: "The soaring, nostalgic 80s synth-pop anthem. Optimistic, airy, and exceptionally joyful.",
    benefits: "Cognitive elevation & positivity",
    defaultInstrument: "flute",
    tempo: 168,
    bgGradient: "from-violet-400 to-indigo-700",
    cardColor: "border-violet-100 bg-violet-50/40 text-violet-900",
    notes: [
      { note: 'B4', dur: 0.3 }, { note: 'B4', dur: 0.3 }, { note: 'G4', dur: 0.3 }, { note: 'E4', dur: 0.3 },
      { note: 'REST', dur: 0.15 }, { note: 'E4', dur: 0.3 }, { note: 'REST', dur: 0.15 }, { note: 'A4', dur: 0.3 },
      { note: 'REST', dur: 0.15 }, { note: 'A4', dur: 0.3 }, { note: 'REST', dur: 0.15 }, { note: 'A4', dur: 0.3 },
      { note: 'B4', dur: 0.3 }, { note: 'C#5', dur: 0.3 }, { note: 'D5', dur: 0.3 }, { note: 'REST', dur: 0.4 }
    ],
    lyrics: [
      "We're talking away",
      "I don't know what I'm to say",
      "I'll say it anyway",
      "Today's another day to find you",
      "Shying away",
      "I'll be coming for your love, okay?",
      "Take on me! (take on me)",
      "Take me on! (take on me)",
      "I'll be gone in a day or two!"
    ]
  }
];

// Interactive keyboard key layouts for visualization & user play
const PIANO_KEYS = [
  { note: 'C4', isBlack: false }, { note: 'C#4', isBlack: true },
  { note: 'D4', isBlack: false }, { note: 'D#4', isBlack: true },
  { note: 'E4', isBlack: false },
  { note: 'F4', isBlack: false }, { note: 'F#4', isBlack: true },
  { note: 'G4', isBlack: false }, { note: 'G#4', isBlack: true },
  { note: 'A4', isBlack: false }, { note: 'A#4', isBlack: true },
  { note: 'B4', isBlack: false },
  { note: 'C5', isBlack: false }, { note: 'C#5', isBlack: true },
  { note: 'D5', isBlack: false }, { note: 'D#5', isBlack: true },
  { note: 'E5', isBlack: false },
  { note: 'F5', isBlack: false }, { note: 'F#5', isBlack: true },
  { note: 'G5', isBlack: false }, { note: 'G#5', isBlack: true },
  { note: 'A5', isBlack: false }, { note: 'A#5', isBlack: true },
  { note: 'B5', isBlack: false }, { note: 'C6', isBlack: false }
];

interface VocalIdol {
  id: string;
  name: string;
  title: string;
  avatar: string;
  genre: string;
  description: string;
  licensedTrack: string;
  trackKey: string;
  trackBpm: number;
  voiceTone: string;
  notes: string[];
  lyrics: string[];
}

const VOCAL_IDOLS: VocalIdol[] = [
  {
    id: 'aria',
    name: 'Aria Star',
    title: 'AI Pop Diva',
    avatar: '✨',
    genre: 'Synth-Pop / Future Bass',
    description: 'High-octane energetic pop melodies with crisp, glass-like harmonies and pristine high notes.',
    licensedTrack: 'Neon Echoes',
    trackKey: 'C Major',
    trackBpm: 120,
    voiceTone: 'Silky, Vibrant, High-Range',
    notes: ['C4', 'E4', 'G4', 'C5', 'G4', 'E4', 'C4'],
    lyrics: [
      "★ NEON ECHOES ★",
      "Standing under neon glows...",
      "Waiting for your voice to show...",
      "AI and human hearts align...",
      "In this symphony of time!"
    ]
  },
  {
    id: 'julian',
    name: 'Julian Woods',
    title: 'AI Indie Folk Pioneer',
    avatar: '🌲',
    genre: 'Indie Acoustic / Folk',
    description: 'Warm, earthy baritone tones featuring rich acoustic resonance and comforting vocal duets.',
    licensedTrack: 'Amber Pines',
    trackKey: 'G Major',
    trackBpm: 90,
    voiceTone: 'Warm, Melancholic, Resonant',
    notes: ['G3', 'B3', 'D4', 'G4', 'D4', 'B3', 'G3'],
    lyrics: [
      "★ AMBER PINES ★",
      "Walking through the quiet trees...",
      "Singing with the autumn breeze...",
      "Warm acoustic strings entwine...",
      "Your sweet harmony with mine!"
    ]
  },
  {
    id: 'beatrix',
    name: 'Beatrix V',
    title: 'AI Cyberpunk Vocalist',
    avatar: '👾',
    genre: 'Electronic / Industrial',
    description: 'Edge-driven, robotic-tuned cyberpunk vocalists specializing in vocoded harmonies.',
    licensedTrack: 'Silicon Heartbeat',
    trackKey: 'A Minor',
    trackBpm: 130,
    voiceTone: 'Vocoded, Sharp, Hyper-Processed',
    notes: ['A3', 'C4', 'E4', 'A4', 'E4', 'C4', 'A3'],
    lyrics: [
      "★ SILICON HEARTBEAT ★",
      "Digital pulses in my head...",
      "Words that we have never said...",
      "Synthesized into the night...",
      "We are glowing, we are light!"
    ]
  },
  {
    id: 'leo',
    name: 'Leo Grand',
    title: 'AI Soul & Opera Legend',
    avatar: '🦁',
    genre: 'Classical Crossover / Soul',
    description: 'Deeply expressive, cinematic tenor style with powerful operatic resonance and vibrato.',
    licensedTrack: 'Vesper Sky',
    trackKey: 'E Minor',
    trackBpm: 75,
    voiceTone: 'Operatic, Deep, Rich Vibrato',
    notes: ['E3', 'G3', 'B3', 'E4', 'B3', 'G3', 'E3'],
    lyrics: [
      "★ VESPER SKY ★",
      "Shadows stretch across the bay...",
      "As the gold light fades away...",
      "Singing to the silent stars...",
      "This eternal soul of ours!"
    ]
  }
];

const CO_SING_PROGRESSIONS: Record<string, string[][]> = {
  aria: [
    ['C3', 'E3', 'G3'], // C Major
    ['G2', 'B2', 'D3'], // G Major
    ['A2', 'C3', 'E3'], // A Minor
    ['F2', 'A2', 'C3']  // F Major
  ],
  julian: [
    ['G2', 'B2', 'D3'],  // G Major
    ['D2', 'F#2', 'A2'], // D Major
    ['E2', 'G2', 'B2'],  // E Minor
    ['C2', 'E2', 'G2']   // C Major
  ],
  beatrix: [
    ['A2', 'C3', 'E3'], // A Minor
    ['G2', 'B2', 'D3'], // G Major
    ['F2', 'A2', 'C3'], // F Major
    ['E2', 'G#2', 'B2'] // E Major
  ],
  leo: [
    ['E2', 'G2', 'B2'], // E Minor
    ['C2', 'E2', 'G2'], // C Major
    ['G2', 'B2', 'D3'], // G Major
    ['D2', 'F#2', 'A2'] // D Major
  ]
};

const CO_SING_BASSLINES: Record<string, string> = {
  aria: 'C2',
  julian: 'G1',
  beatrix: 'A1',
  leo: 'E1'
};

const POP_CHORDS: Record<string, string[][]> = {
  pop_lights: [
    ['F3', 'Ab3', 'C4'],  // Fm
    ['C3', 'Eb3', 'G3'],  // Cm
    ['Eb3', 'G3', 'Bb3'], // Eb
    ['Bb2', 'D3', 'F3']   // Bb
  ],
  pop_shape: [
    ['C#3', 'E3', 'G#3'], // C#m
    ['F#2', 'A2', 'C#3'], // F#m
    ['A2', 'C#3', 'E3'],  // A
    ['B2', 'D#3', 'F#3']  // B
  ],
  pop_romance: [
    ['F3', 'Ab3', 'C4'],  // Fm
    ['Bb2', 'D3', 'F3'],  // Bb
    ['Ab2', 'C3', 'Eb3'], // Ab
    ['C3', 'E3', 'G3']    // C
  ],
  pop_stayin: [
    ['F3', 'Ab3', 'C4'],  // Fm
    ['Eb3', 'G3', 'Bb3'], // Eb
    ['F3', 'Ab3', 'C4'],  // Fm
    ['Bb2', 'D3', 'F3']   // Bb
  ],
  pop_rolling: [
    ['C3', 'Eb3', 'G3'],  // Cm
    ['G2', 'B2', 'D3'],   // G
    ['Bb2', 'D3', 'F3'],  // Bb
    ['Ab2', 'C3', 'Eb3']  // Ab
  ],
  pop_billiejean: [
    ['F#2', 'A2', 'C#3'], // F#m
    ['B2', 'D#3', 'F#3'], // Bm
    ['A2', 'C#3', 'E3'],  // A
    ['G#2', 'B2', 'D#3']  // G#m
  ],
  pop_dontstart: [
    ['E3', 'G3', 'B3'],   // Em
    ['B2', 'D3', 'F#3'],  // Bm
    ['A2', 'C3', 'E3'],   // Am
    ['D3', 'F#3', 'A3']   // D
  ],
  pop_takeonme: [
    ['A2', 'C3', 'E3'],   // Am
    ['D3', 'F#3', 'A3'],  // D
    ['G2', 'B2', 'D3'],   // G
    ['C3', 'E3', 'G3']    // C
  ]
};

const POP_BASSLINES: Record<string, string[]> = {
  pop_lights: ['F2', 'C2', 'Eb2', 'Bb1'],
  pop_shape: ['C#2', 'F#2', 'A1', 'B1'],
  pop_romance: ['F2', 'Bb1', 'Ab1', 'C2'],
  pop_stayin: ['F2', 'Eb2', 'F2', 'Bb1'],
  pop_rolling: ['C2', 'G1', 'Bb1', 'Ab1'],
  pop_billiejean: ['F#2', 'C#2', 'E2', 'F#2'],
  pop_dontstart: ['E2', 'B1', 'A1', 'D2'],
  pop_takeonme: ['A1', 'D2', 'G1', 'C2']
};

interface Actor {
  id: string;
  name: string;
  title: string;
  emoji: string;
  description: string;
  gender: 'male' | 'female' | 'any';
  langKeywords: string[];
}

const ACTORS: Actor[] = [
  {
    id: 'broadway_diva',
    name: 'Eleanor Sterling',
    title: 'The Broadway Diva',
    emoji: '🎭',
    description: 'Expressive, dramatic female voice with pristine theatrical diction and crystal clarity.',
    gender: 'female',
    langKeywords: ['Samantha', 'Zira', 'female', 'en-US', 'en-GB']
  },
  {
    id: 'shakespearean',
    name: 'Lord Barnaby',
    title: 'The Shakespearean Dramatic',
    emoji: '👑',
    description: 'Resonant, poetic male baritone with classic British theater style and deliberate phrasing.',
    gender: 'male',
    langKeywords: ['Daniel', 'David', 'male', 'en-GB', 'en-US']
  },
  {
    id: 'cyberpunk',
    name: 'X-500 Vocal Unit',
    title: 'The Cyberpunk Vocalist',
    emoji: '🤖',
    description: 'Cold, robotic cybernetic synthesizer voice with high tempo and clinical delivery.',
    gender: 'any',
    langKeywords: ['Hazel', 'Mark', 'en-US', 'en-IN']
  },
  {
    id: 'soulful',
    name: 'Marcus Soul',
    title: 'The Soulful Narrator',
    emoji: '🎙️',
    description: 'Warm, intimate, mid-range male narrator with soothing presence and rhythmic timing.',
    gender: 'male',
    langKeywords: ['Google', 'en-US', 'en-AU']
  }
];

function getVoiceForActor(actor: Actor, voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  for (const keyword of actor.langKeywords) {
    const match = voices.find(v => 
      v.name.toLowerCase().includes(keyword.toLowerCase()) || 
      v.lang.toLowerCase().includes(keyword.toLowerCase())
    );
    if (match) return match;
  }
  const englishVoices = voices.filter(v => v.lang.startsWith('en'));
  if (englishVoices.length > 0) {
    return englishVoices[0];
  }
  return voices[0] || null;
}

export function SymphonyConcertHall() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentSymphony, setCurrentSymphony] = useState<SymphonyMasterpiece>(MASTERPIECES[0]);
  const [activeInstrument, setActiveInstrument] = useState<'piano' | 'violin' | 'flute'>('piano');
  
  // Real Actor speech voices and lyric tracking
  const [selectedActorId, setSelectedActorId] = useState<string>('broadway_diva');
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [activeLyricIndex, setActiveLyricIndex] = useState<number>(0);

  // High-visibility stand-out master volume UX
  const [masterVolume, setMasterVolume] = useState<number>(70);
  const [tempoMultiplier, setTempoMultiplier] = useState<number>(1.0);
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [performanceLog, setPerformanceLog] = useState<{ time: string; note: string; hz: number; isManual: boolean }[]>([]);
  const [visualBars, setVisualBars] = useState<number[]>(Array(16).fill(10));

  // Right Panel display toggles
  const [rightPanelTab, setRightPanelTab] = useState<'orchestra' | 'cosing'>('orchestra');

  // CoSing AI Social Vocal states
  const [selectedIdolId, setSelectedIdolId] = useState<string>('aria');
  const [isMicActive, setIsMicActive] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [micLevel, setMicLevel] = useState<number>(0);
  const [effects, setEffects] = useState({
    reverb: true,
    autoTune: true,
    aiHarmony: true,
    saturation: false
  });
  const [mixerTracks, setMixerTracks] = useState({
    drums: true,
    bass: true,
    synth: true,
    arpeggios: true
  });
  const [lyricsIndex, setLyricsIndex] = useState<number>(0);
  const [savedDuets, setSavedDuets] = useState<{ id: string; date: string; idolName: string; trackName: string; rating: number }[]>([
    { id: '1', date: '2026-07-04 18:30', idolName: 'Aria Star', trackName: 'Neon Echoes (Symphonic)', rating: 5 },
    { id: '2', date: '2026-07-05 00:15', idolName: 'Julian Woods', trackName: 'Amber Pines (Warm Duet)', rating: 4 }
  ]);

  const micStreamRef = useRef<MediaStream | null>(null);
  const micAnalyserRef = useRef<AnalyserNode | null>(null);
  const micIntervalRef = useRef<number | null>(null);
  const lyricsIntervalRef = useRef<number | null>(null);

  // Fetch system SpeechSynthesis voices dynamically
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        setAvailableVoices(window.speechSynthesis.getVoices());
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
      return () => {
        window.speechSynthesis.onvoiceschanged = null;
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
      };
    }
  }, []);

  // Audio nodes and refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const synthGainRef = useRef<GainNode | null>(null);
  const sequencerTimeoutRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize Audio Context on demand
  const initAudio = () => {
    if (audioCtxRef.current) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(masterVolume / 100, ctx.currentTime);
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      const synthGain = ctx.createGain();
      synthGain.gain.setValueAtTime(0.8, ctx.currentTime);
      synthGain.connect(masterGain);
      synthGainRef.current = synthGain;
    } catch (err) {
      console.error("Web Audio initialization failure in SymphonyConcertHall:", err);
    }
  };

  // Synchronize Master Volume
  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.linearRampToValueAtTime(
        masterVolume / 100, 
        audioCtxRef.current.currentTime + 0.05
      );
    }
  }, [masterVolume]);

  // Helper functions - rich Web Audio synthesized pop instruments for background music tracks
  const playKick = (ctx: AudioContext, time: number) => {
    if (!mixerTracks.drums) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(masterGainRef.current || ctx.destination);

      osc.frequency.setValueAtTime(150, time);
      osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.18);

      gain.gain.setValueAtTime(0.7, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

      osc.start(time);
      osc.stop(time + 0.18);
    } catch (e) {
      // ignore
    }
  };

  const playSnare = (ctx: AudioContext, time: number) => {
    if (!mixerTracks.drums) return;
    try {
      // Snare drum skin oscillation
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, time);
      osc.frequency.exponentialRampToValueAtTime(80, time + 0.1);

      gain.gain.setValueAtTime(0.2, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

      osc.connect(gain);
      gain.connect(masterGainRef.current || ctx.destination);

      osc.start(time);
      osc.stop(time + 0.1);

      // White noise snap (creates a real "snare crunch"!)
      const bufferSize = ctx.sampleRate * 0.1;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'highpass';
      noiseFilter.frequency.setValueAtTime(1000, time);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.15, time);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(masterGainRef.current || ctx.destination);

      noise.start(time);
      noise.stop(time + 0.1);
    } catch (e) {
      // ignore
    }
  };

  const playHiHat = (ctx: AudioContext, time: number, isClosed = true) => {
    if (!mixerTracks.drums) return;
    try {
      const duration = isClosed ? 0.04 : 0.16;

      // Noise source
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(7000, time);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.07, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(masterGainRef.current || ctx.destination);

      noise.start(time);
      noise.stop(time + duration);
    } catch (e) {
      // ignore
    }
  };

  const playChordPad = (ctx: AudioContext, time: number, notes: string[], duration = 1.2, type: OscillatorType = 'triangle', gainValue = 0.08) => {
    if (!mixerTracks.synth) return;
    notes.forEach((noteName, idx) => {
      const freq = NOTE_FREQS[noteName];
      if (!freq) return;
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        // High quality warm poly-synth filtering
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, time);
        filter.frequency.exponentialRampToValueAtTime(400, time + duration);

        osc.type = type;
        // Introduce tiny detune for vintage analog chorus feel
        osc.frequency.setValueAtTime(freq, time);
        osc.detune.setValueAtTime((idx - 1) * 8, time);

        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(gainValue / notes.length, time + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGainRef.current || ctx.destination);

        osc.start(time);
        osc.stop(time + duration);
      } catch (e) {
        // ignore
      }
    });
  };

  const playBassNote = (ctx: AudioContext, time: number, freq: number, duration = 0.4, gainValue = 0.15) => {
    if (!mixerTracks.bass) return;
    try {
      const osc = ctx.createOscillator();
      const subOsc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Deep, juicy synth bass
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, time);

      // Add a sub-bass oscillator (sine wave, one octave lower)
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(freq / 2, time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(350, time);
      filter.frequency.exponentialRampToValueAtTime(120, time + duration);

      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(gainValue, time + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.connect(filter);
      subOsc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGainRef.current || ctx.destination);

      osc.start(time);
      subOsc.start(time);
      osc.stop(time + duration);
      subOsc.stop(time + duration);
    } catch (e) {
      // ignore
    }
  };

  const playArpNote = (ctx: AudioContext, time: number, freq: number, duration = 0.15, gainValue = 0.04) => {
    if (!mixerTracks.arpeggios) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(gainValue, time + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.connect(gain);
      gain.connect(masterGainRef.current || ctx.destination);

      osc.start(time);
      osc.stop(time + duration);
    } catch (e) {
      // ignore
    }
  };

  // Synthesize CoSing duets & harmonies with rich vocal modelling (omitted)
  const playCoSingNote = (note: string) => {};

  // CoSing Mic Stream Audio Capture & Analyzer loop
  useEffect(() => {
    if (isMicActive) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(stream => {
            micStreamRef.current = stream;
            if (audioCtxRef.current) {
              try {
                const source = audioCtxRef.current.createMediaStreamSource(stream);
                const analyser = audioCtxRef.current.createAnalyser();
                analyser.fftSize = 256;
                source.connect(analyser);
                micAnalyserRef.current = analyser;

                const dataArray = new Uint8Array(analyser.frequencyBinCount);
                const checkLevel = () => {
                  if (!micAnalyserRef.current) return;
                  analyser.getByteFrequencyData(dataArray);
                  let sum = 0;
                  for (let i = 0; i < dataArray.length; i++) {
                    sum += dataArray[i];
                  }
                  const avg = sum / dataArray.length;
                  setMicLevel(Math.min(100, Math.round(avg * 1.5)));
                  micIntervalRef.current = window.requestAnimationFrame(checkLevel);
                };
                micIntervalRef.current = window.requestAnimationFrame(checkLevel);
              } catch (err) {
                console.warn("Could not bind mic analyser, falling back to simulated:", err);
                let simLevel = 0;
                const interval = window.setInterval(() => {
                  simLevel = Math.floor(Math.random() * 40 + 10);
                  setMicLevel(simLevel);
                }, 100);
                return () => window.clearInterval(interval);
              }
            } else {
              let simLevel = 0;
              const interval = window.setInterval(() => {
                simLevel = Math.floor(Math.random() * 30 + 15);
                setMicLevel(simLevel);
              }, 100);
              return () => window.clearInterval(interval);
            }
          })
          .catch(err => {
            console.warn("Microphone access failed:", err);
            setIsMicActive(false);
          });
      } else {
        // Fallback for environments where getUserMedia is missing
        let simLevel = 0;
        const interval = window.setInterval(() => {
          simLevel = Math.floor(Math.random() * 30 + 15);
          setMicLevel(simLevel);
        }, 100);
        return () => window.clearInterval(interval);
      }
    } else {
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach(track => track.stop());
        micStreamRef.current = null;
      }
      if (micIntervalRef.current) {
        window.cancelAnimationFrame(micIntervalRef.current);
        micIntervalRef.current = null;
      }
      setMicLevel(0);
    }

    return () => {
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (micIntervalRef.current) {
        window.cancelAnimationFrame(micIntervalRef.current);
      }
    };
  }, [isMicActive]);

  // CoSing Lyrics and Playback Sequence (All instrument oscillators omitted)
  useEffect(() => {
    if (isRecording) {
      const idol = VOCAL_IDOLS.find(i => i.id === selectedIdolId) || VOCAL_IDOLS[0];
      setLyricsIndex(0);
      initAudio();

      const bpm = idol.trackBpm || 100;
      const stepDurationSec = 60 / bpm / 2; // eighth notes

      let stepCounter = 0;

      const runStep = () => {
        const ctx = audioCtxRef.current;
        if (!ctx) return;

        const currentBpm = idol.trackBpm || 100;
        const currentStepDurationSec = 60 / currentBpm / 2;

        const stepInBar = stepCounter % 8;
        const barIndex = Math.floor(stepCounter / 8) % 4;

        // 1. Play backing chord pad, kick, snare, hi-hat and bass oscillator
        const chordNotes = CO_SING_PROGRESSIONS[idol.id] 
          ? CO_SING_PROGRESSIONS[idol.id][barIndex] 
          : ['C3', 'E3', 'G3'];
        const bassNoteName = CO_SING_BASSLINES[idol.id] || 'C2';
        const bassFreq = NOTE_FREQS[bassNoteName] || 65.4;

        if (stepInBar === 0) {
          playChordPad(ctx, ctx.currentTime, chordNotes, currentStepDurationSec * 7.5, idol.id === 'julian' ? 'triangle' : 'sine', 0.12);
        }

        if (stepInBar === 0 || stepInBar === 3 || stepInBar === 4 || stepInBar === 6) {
          playBassNote(ctx, ctx.currentTime, bassFreq, currentStepDurationSec * 1.5, 0.15);
        }

        if (stepInBar === 0 || stepInBar === 4) {
          playKick(ctx, ctx.currentTime);
        }
        if (stepInBar === 2 || stepInBar === 6) {
          playSnare(ctx, ctx.currentTime);
        }
        if (stepInBar % 2 === 1) {
          playHiHat(ctx, ctx.currentTime, stepInBar !== 7);
        }

        // 2. Play Vocal Lyrics via Speech Synthesis
        if (stepInBar === 0) {
          const currentLyricIdx = Math.floor(stepCounter / 8) % 5;
          setLyricsIndex(currentLyricIdx);

          // Speak CoSing Idol lyrics with Speech Synthesis!
          const lyricLine = idol.lyrics[currentLyricIdx];
          if (lyricLine && typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(lyricLine);
            
            // Assign a high-quality voice according to the VocalIdol
            const voices = window.speechSynthesis.getVoices();
            let matchVoice = null;
            if (idol.id === 'aria') {
              matchVoice = voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('samantha')) || voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('female'));
              utterance.pitch = 1.3;
              utterance.rate = 1.0;
            } else if (idol.id === 'julian') {
              matchVoice = voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('daniel')) || voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('male'));
              utterance.pitch = 0.9;
              utterance.rate = 0.95;
            } else if (idol.id === 'beatrix') {
              matchVoice = voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('hazel')) || voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('zira'));
              utterance.pitch = 0.6;
              utterance.rate = 1.3;
            } else if (idol.id === 'leo') {
              matchVoice = voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('david')) || voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('male'));
              utterance.pitch = 0.85;
              utterance.rate = 0.85;
            }
            
            if (!matchVoice) {
              const englishVoices = voices.filter(v => v.lang.startsWith('en'));
              matchVoice = englishVoices[0] || voices[0] || null;
            }
            if (matchVoice) {
              utterance.voice = matchVoice;
            }
            window.speechSynthesis.speak(utterance);
          }

          // Trigger simulated pulse
          setActiveNote(`C${currentLyricIdx}`);
        }

        stepCounter = (stepCounter + 1) % 40;
        lyricsIntervalRef.current = window.setTimeout(runStep, currentStepDurationSec * 1000);
      };

      lyricsIntervalRef.current = window.setTimeout(runStep, 100);

    } else {
      if (lyricsIntervalRef.current) {
        window.clearTimeout(lyricsIntervalRef.current);
        lyricsIntervalRef.current = null;
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setLyricsIndex(0);
    }

    return () => {
      if (lyricsIntervalRef.current) {
        window.clearTimeout(lyricsIntervalRef.current);
      }
    };
  }, [isRecording, selectedIdolId, effects.aiHarmony, effects.reverb, effects.saturation]);

  // Set default instrument when symphony changes
  useEffect(() => {
    setActiveInstrument(currentSymphony.defaultInstrument || 'piano');
  }, [currentSymphony]);

  // Visualizer loop for simulated bouncing sound bars
  useEffect(() => {
    if (isPlaying) {
      const updateVisualizer = () => {
        setVisualBars(prev => prev.map(() => {
          const factor = activeNote ? 0.8 : 0.2;
          return Math.floor(Math.random() * 70 * factor + 10);
        }));
        animationFrameRef.current = requestAnimationFrame(updateVisualizer);
      };
      animationFrameRef.current = requestAnimationFrame(updateVisualizer);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setVisualBars(Array(16).fill(10));
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, activeNote]);

  // Synthesize single note sound in Web Audio (Muted to omit instruments)
  const playSynthesizedNote = (note: string, durationSec: number, isManual = false) => {
    if (isManual && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('stop-ambient-player'));
    }
    const freq = NOTE_FREQS[note] || 0;
    
    // Update interactive visual UI state
    setActiveNote(note);
    
    // Update performance log tracker
    const nowStr = new Date().toLocaleTimeString('en-US', { hour12: false, minute: '2-digit', second: '2-digit' });
    setPerformanceLog(prev => [
      { time: nowStr, note, hz: Math.round(freq), isManual },
      ...prev.slice(0, 19)
    ]);

    // Handle auto-clearing note visual state
    setTimeout(() => {
      setActiveNote(prev => prev === note ? null : prev);
    }, durationSec * 1000 - 30);
  };

  // Core lyric speech & sequence runner (with Actor Voices and synthesized background music tracks)
  const runSequence = (symphonyToPlay: SymphonyMasterpiece, startFromIndex = 0) => {
    if (sequencerTimeoutRef.current) {
      window.clearTimeout(sequencerTimeoutRef.current);
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    let lyricIdx = startFromIndex;
    const lyricsArray = symphonyToPlay.lyrics;
    let stepCounter = 0;

    const executeStep = () => {
      if (!isPlaying && startFromIndex === 0) return;

      const ctx = audioCtxRef.current;
      if (!ctx) return;

      const bpm = symphonyToPlay.tempo || 120;
      const stepDurationSec = (60 / bpm / 2) / tempoMultiplier; // 8th notes adjusted by tempo multiplier

      const stepInBar = stepCounter % 8;
      const barIndex = Math.floor(stepCounter / 8) % 4;

      // Look up chord and bass mappings for current pop song
      const chords = POP_CHORDS[symphonyToPlay.id] || [['C3', 'E3', 'G3'], ['F3', 'A3', 'C4'], ['G3', 'B3', 'D4'], ['C3', 'E3', 'G3']];
      const currentChord = chords[barIndex];
      const bassline = POP_BASSLINES[symphonyToPlay.id] || ['C2', 'F2', 'G2', 'C2'];
      const bassNoteName = bassline[barIndex] || 'C2';
      const bassFreq = NOTE_FREQS[bassNoteName] || 65.4;

      // 1. Play polyphonic chord pad on downbeats
      if (stepInBar === 0) {
        playChordPad(ctx, ctx.currentTime, currentChord, stepDurationSec * 7.6, 'sawtooth', 0.15);
      }

      // 2. Play bass notes on syncopated pop rhythm (steps 0, 3, 4, 6)
      if (stepInBar === 0 || stepInBar === 3 || stepInBar === 4 || stepInBar === 6) {
        playBassNote(ctx, ctx.currentTime, bassFreq, stepDurationSec * 1.5, 0.14);
      }

      // 3. Play drum backing beats
      const fourOnFloor = ['pop_lights', 'pop_romance', 'pop_dontstart', 'pop_stayin'].includes(symphonyToPlay.id);
      
      // Kick: 4-on-the-floor vs standard pop breakbeat
      if (fourOnFloor) {
        if (stepInBar === 0 || stepInBar === 2 || stepInBar === 4 || stepInBar === 6) {
          playKick(ctx, ctx.currentTime);
        }
      } else {
        if (stepInBar === 0 || stepInBar === 3 || stepInBar === 4) {
          playKick(ctx, ctx.currentTime);
        }
      }

      // Snare: clap/snare on steps 2 and 6
      if (stepInBar === 2 || stepInBar === 6) {
        playSnare(ctx, ctx.currentTime);
      }

      // Hi-Hats: closed on odds, open with syncopation on step 7
      if (stepInBar % 2 === 1) {
        playHiHat(ctx, ctx.currentTime, stepInBar !== 7);
      }

      // 4. Play shining high-pitch arpeggiator on even beats
      if (stepInBar % 2 === 0) {
        const noteIndex = (stepInBar / 2) % currentChord.length;
        const noteName = currentChord[noteIndex];
        if (noteName) {
          const noteBase = noteName.replace(/[0-9]/g, '');
          const originalOctave = parseInt(noteName.replace(/[^0-9]/g, '')) || 3;
          const arpFreq = NOTE_FREQS[`${noteBase}${originalOctave + 1}`] || 0;
          if (arpFreq > 0) {
            playArpNote(ctx, ctx.currentTime, arpFreq, stepDurationSec * 0.8, 0.04);
          }
        }
      }

      // 5. Speak lyric phrase every 16 steps (equivalent to 2 full bars)
      if (stepCounter % 16 === 0) {
        setActiveLyricIndex(lyricIdx);
        const currentLine = lyricsArray[lyricIdx];
        if (currentLine && typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(currentLine);
          
          // Match selected actor
          const actor = ACTORS.find(a => a.id === selectedActorId) || ACTORS[0];
          const matchVoice = getVoiceForActor(actor, availableVoices);
          if (matchVoice) {
            utterance.voice = matchVoice;
          }

          // Apply personality pitch and rates
          if (actor.id === 'shakespearean') {
            utterance.pitch = 0.8;
            utterance.rate = 0.85;
          } else if (actor.id === 'broadway_diva') {
            utterance.pitch = 1.25;
            utterance.rate = 1.05;
          } else if (actor.id === 'cyberpunk') {
            utterance.pitch = 0.5;
            utterance.rate = 1.25;
          } else if (actor.id === 'soulful') {
            utterance.pitch = 0.9;
            utterance.rate = 0.9;
          } else {
            utterance.pitch = 1.0;
            utterance.rate = 1.0;
          }

          window.speechSynthesis.speak(utterance);
        }

        // Set simulated active notes to animate the pulse
        setActiveNote(`L${lyricIdx}`);

        // Advance lyric pointer
        lyricIdx = (lyricIdx + 1) % lyricsArray.length;
      }

      // Increment sequencer position
      stepCounter = (stepCounter + 1) % 32;
      sequencerTimeoutRef.current = window.setTimeout(executeStep, stepDurationSec * 1000);
    };

    executeStep();
  };

  // Handle Play/Pause toggles and effect hooks
  const handlePlayToggle = () => {
    initAudio();
    if (isPlaying) {
      if (sequencerTimeoutRef.current) {
        window.clearTimeout(sequencerTimeoutRef.current);
        sequencerTimeoutRef.current = null;
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
      setActiveNote(null);
    } else {
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    if (sequencerTimeoutRef.current) {
      window.clearTimeout(sequencerTimeoutRef.current);
      sequencerTimeoutRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setActiveNote(null);
    setActiveLyricIndex(0);
  };

  // Play sequence reactively when isPlaying, symphony, actor, or tempo changes
  useEffect(() => {
    if (isPlaying) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('stop-ambient-player'));
      }
      runSequence(currentSymphony, 0);
    } else {
      handleStop();
    }
    return () => {
      if (sequencerTimeoutRef.current) {
        window.clearTimeout(sequencerTimeoutRef.current);
      }
    };
  }, [isPlaying, currentSymphony, selectedActorId, tempoMultiplier]);

  // Listen for external triggers to stop symphony music
  useEffect(() => {
    const handleStopSymphony = () => {
      setIsPlaying(false);
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('stop-symphony-player', handleStopSymphony);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('stop-symphony-player', handleStopSymphony);
      }
    };
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (sequencerTimeoutRef.current) {
        window.clearTimeout(sequencerTimeoutRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 p-1 select-none" id="symphony-concert-hall-container">
      
      {/* LEFT COLUMN: Chimes selector & Educational Insights */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        
        {/* Composer Selection & Header */}
        <div className="bg-white/90 border border-stone-200/80 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-rose-50 border border-rose-150">
              <Music className="w-4 h-4 text-rose-600" />
            </div>
            <div>
              <h3 className="font-display font-black text-sm text-stone-950 uppercase tracking-wide">
                Pop Hits Collection
              </h3>
              <p className="text-[10px] text-stone-400 font-mono font-bold leading-none mt-0.5">
                POP MASTERPIECES
              </p>
            </div>
          </div>

          <div className="space-y-1.5 max-h-[290px] overflow-y-auto pr-1 scrollbar-thin">
            {MASTERPIECES.map((sym) => {
              const isSelected = currentSymphony.id === sym.id;
              return (
                <button
                  key={sym.id}
                  onClick={() => {
                    setCurrentSymphony(sym);
                    setIsPlaying(true);
                  }}
                  className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer relative overflow-hidden
                    ${isSelected 
                      ? 'border-rose-300 bg-rose-50/50 ring-1 ring-rose-200' 
                      : 'border-stone-150 hover:border-stone-300 hover:bg-stone-50 bg-white/70'
                    }
                  `}
                >
                  <div className={`w-8 h-8 rounded-lg text-sm flex items-center justify-center font-bold bg-gradient-to-br ${sym.bgGradient} text-white shadow-3xs shrink-0`}>
                    {sym.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] font-mono font-black text-rose-500 uppercase tracking-wider">
                        {sym.composer}
                      </span>
                      <span className="text-[8px] font-mono text-stone-400 font-bold">
                        {sym.year}
                      </span>
                    </div>
                    <h4 className="font-display font-bold text-stone-850 text-[11px] truncate leading-tight">
                      {sym.name}
                    </h4>
                  </div>

                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Masterpiece Cognitive Benefits card */}
        <div className="bg-gradient-to-br from-stone-900 via-stone-850 to-stone-950 text-stone-100 rounded-2xl p-4 border border-stone-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Sparkles className="w-24 h-24 text-rose-500" />
          </div>

          <div className="flex items-center gap-1.5 text-[9px] font-mono text-rose-350 font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3 text-rose-400" /> Cognitive resonance guide
          </div>

          <div className="flex items-baseline gap-1.5 mb-2.5">
            <h4 className="font-display font-black text-white text-base leading-none">
              {currentSymphony.name}
            </h4>
            <span className="text-[10px] text-stone-400 font-mono font-medium">
              by {currentSymphony.composer}
            </span>
          </div>

          <p className="text-stone-300 text-xs leading-relaxed font-sans mb-3 font-medium">
            {currentSymphony.description}
          </p>

          <div className="bg-white/5 border border-white/10 p-2.5 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-rose-500/20 text-rose-300">
                <Heart className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[8px] font-mono text-stone-400 font-bold block leading-none uppercase">Neuro-Aesthetic Benefit</span>
                <p className="text-rose-200 font-bold text-[11px] font-display leading-tight mt-0.5">
                  {currentSymphony.benefits}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Player Engine, Standout Master Vol, Visualizer, Interactive Keyboard, Note logger */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        
        {/* RIGHT COLUMN TABS */}
        <div className="flex gap-1.5 p-1 bg-stone-100 border border-stone-200/50 rounded-2xl self-start animate-fade-in mb-1" id="symphony-tab-header">
          <button
            type="button"
            onClick={() => {
              setRightPanelTab('orchestra');
              setIsRecording(false);
            }}
            className={`px-4.5 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              rightPanelTab === 'orchestra'
                ? 'bg-white text-stone-900 shadow-sm border border-stone-250/20'
                : 'text-stone-500 hover:text-stone-850 bg-transparent'
            }`}
          >
            <Music className="w-4.5 h-4.5 text-[#9f1239]" />
            Pop Hits Player
          </button>
          <button
            type="button"
            onClick={() => {
              setRightPanelTab('cosing');
              setIsPlaying(false);
            }}
            className={`px-4.5 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              rightPanelTab === 'cosing'
                ? 'bg-[#9f1239] text-white shadow-sm'
                : 'text-stone-500 hover:text-stone-850 bg-transparent'
            }`}
          >
            <Sparkles className="w-4.5 h-4.5 text-amber-300 animate-pulse" />
            CoSing AI Duets
          </button>
        </div>

        {rightPanelTab === 'orchestra' ? (
          <>
            {/* Main Stage Panel */}
            <div className="bg-white/95 border border-stone-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[460px] relative overflow-hidden">
          
          {/* Top Bar: Live Waveform Visualizer & Instrument Selectors */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-5 border-b border-stone-100 pb-4">
            
            {/* Visualizer Animation */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="h-7 flex items-end gap-1 px-3 py-1 bg-stone-900 rounded-xl min-w-[130px] justify-center shadow-3xs border border-stone-800">
                {visualBars.map((val, i) => (
                  <motion.div 
                    key={i}
                    animate={{ height: isPlaying ? `${val}%` : "15%" }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className="w-1 bg-gradient-to-t from-rose-500 to-rose-400 rounded-full"
                  />
                ))}
              </div>
              <div className="leading-none">
                <span className="text-[9px] font-mono font-bold text-stone-400 uppercase tracking-widest block">Soundwave Engine</span>
                <span className="text-[11px] font-sans font-black text-rose-600 flex items-center gap-1 mt-0.5">
                  <Activity className="w-3 h-3 animate-pulse" /> {isPlaying ? 'POLYPHONIC BROADCAST' : 'ENGINE COLD / STANDBY'}
                </span>
              </div>
            </div>

            {/* Actor Voice Selectors (Real Actors who speak the lyrics) */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
              {ACTORS.map((actor) => (
                <button
                  key={actor.id}
                  onClick={() => {
                    setSelectedActorId(actor.id);
                    if (isPlaying && typeof window !== 'undefined' && 'speechSynthesis' in window) {
                      window.speechSynthesis.cancel();
                    }
                  }}
                  className={`p-1.5 px-3 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-1
                    ${selectedActorId === actor.id 
                      ? 'bg-white shadow-3xs border border-rose-200/55 text-rose-600 font-black' 
                      : 'text-stone-500 hover:text-stone-800'
                    }
                  `}
                  title={actor.description}
                >
                  <span>{actor.emoji}</span>
                  <span>{actor.name.split(' ').pop()}</span>
                </button>
              ))}
            </div>

          </div>

          {/* Active Broadcast Center Display */}
          <div className="flex-1 flex flex-col items-center justify-center py-6 select-none relative z-10">
            
            {/* Pulsing Visual Center Orb */}
            <div className="relative mb-4">
              <motion.div 
                animate={{ scale: activeNote ? 1.22 : 1.0 }}
                transition={{ duration: 0.15 }}
                className={`w-28 h-28 rounded-full bg-gradient-to-tr ${currentSymphony.bgGradient} flex items-center justify-center text-white shadow-xl border-4 border-white`}
              >
                <span className="text-4xl animate-bounce-slow">{currentSymphony.emoji}</span>
              </motion.div>
              {isPlaying && (
                <>
                  <span className="absolute -inset-2 rounded-full border border-rose-400/30 animate-ping pointer-events-none" />
                  <span className="absolute -inset-5 rounded-full border border-rose-300/10 animate-ping-slow pointer-events-none" />
                </>
              )}
            </div>

            <div className="text-center">
              <h3 className="font-display font-black text-stone-900 text-xl tracking-tight leading-none mb-1">
                {currentSymphony.name}
              </h3>
              <p className="text-xs text-stone-400 font-mono font-bold uppercase tracking-wider">
                {currentSymphony.composer}
              </p>
            </div>

            {/* STAGE TELEPROMPTER / LYRICS DISPLAY */}
            <div className="w-full max-w-md bg-stone-50 border border-stone-200 rounded-2xl p-4 mt-5 shadow-3xs flex flex-col items-center select-none">
              <span className="text-[8px] font-mono font-black text-rose-500 uppercase tracking-widest mb-2 block flex items-center gap-1">
                <Music className="w-2.5 h-2.5 animate-spin-slow" /> STAGE TELEPROMPTER
              </span>
              
              <div className="w-full space-y-1.5 py-1 max-h-36 overflow-y-auto scrollbar-none text-center transition-all duration-300">
                {currentSymphony.lyrics.map((line, idx) => {
                  const isActive = activeLyricIndex === idx && isPlaying;
                  return (
                    <motion.p
                      key={idx}
                      animate={{
                        scale: isActive ? 1.05 : 0.95,
                        opacity: isActive ? 1.0 : 0.35,
                      }}
                      transition={{ duration: 0.25 }}
                      className={`text-xs font-black transition-all leading-relaxed ${
                        isActive
                          ? 'text-rose-600 bg-rose-50/70 border border-rose-100/60 p-1.5 py-1 rounded-xl shadow-3xs font-display flex items-center justify-center gap-1.5'
                          : 'text-stone-600'
                      }`}
                    >
                      {isActive && <Mic className="w-3 h-3 text-rose-500 animate-pulse" />}
                      {line}
                    </motion.p>
                  );
                })}
              </div>
            </div>

            {/* LIVE MULTI-TRACK BACKING MIXER */}
            <div className="w-full max-w-md bg-stone-50 border border-stone-200 rounded-2xl p-4 mt-4 shadow-3xs">
              <div className="flex items-center justify-between mb-3 border-b border-stone-150 pb-2 select-none">
                <span className="text-[9px] font-mono font-black text-rose-500 uppercase tracking-widest flex items-center gap-1">
                  <Sliders className="w-3 h-3 text-rose-500 animate-pulse" /> BACKING TRACKS MIXER
                </span>
                <span className="text-[8px] font-mono font-black text-stone-400 uppercase tracking-wider">
                  {isPlaying ? 'ACTIVE SYNC' : 'STANDBY'}
                </span>
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'drums', label: 'Drums', icon: Activity, color: 'text-rose-500', bg: 'bg-rose-50/60' },
                  { id: 'bass', label: 'Bass', icon: Flame, color: 'text-amber-500', bg: 'bg-amber-50/60' },
                  { id: 'synth', label: 'Synth', icon: Music, color: 'text-emerald-500', bg: 'bg-emerald-50/60' },
                  { id: 'arpeggios', label: 'Arp', icon: Sparkles, color: 'text-cyan-500', bg: 'bg-cyan-50/60' },
                ].map((track) => {
                  const isTrackActive = mixerTracks[track.id as keyof typeof mixerTracks];
                  return (
                    <div 
                      key={track.id} 
                      className={`flex flex-col items-center p-2 rounded-xl border transition-all select-none ${
                        isTrackActive 
                          ? 'bg-white border-stone-200 shadow-3xs' 
                          : 'bg-stone-100/50 border-stone-150 opacity-60'
                      }`}
                    >
                      {/* Equalizer Wavelet inside each track block */}
                      <div className="h-6 flex items-end gap-0.5 justify-center mb-1.5 w-full">
                        {Array(4).fill(0).map((_, barIdx) => {
                          const heightVal = isPlaying && isTrackActive 
                            ? Math.floor(Math.random() * 80 + 20) 
                            : 10;
                          return (
                            <motion.div
                              key={barIdx}
                              animate={{ height: `${heightVal}%` }}
                              transition={{ type: "spring", stiffness: 300, damping: 20 }}
                              className={`w-0.5 rounded-full ${isTrackActive ? track.color.replace('text', 'bg') : 'bg-stone-300'}`}
                            />
                          );
                        })}
                      </div>

                      {/* Button Toggle */}
                      <button
                        onClick={() => setMixerTracks(prev => ({
                          ...prev,
                          [track.id]: !prev[track.id as keyof typeof mixerTracks]
                        }))}
                        className={`w-full py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          isTrackActive 
                            ? `${track.bg} ${track.color} border border-current/25 shadow-3xs` 
                            : 'bg-stone-150/40 text-stone-400 border border-stone-200'
                        }`}
                        title={`Toggle ${track.label} track`}
                      >
                        <track.icon className="w-3.5 h-3.5" />
                        <span className="text-[7.5px] tracking-normal font-black">{track.label}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* CRITICAL FEATURE: STAND-OUT MASTER VOL UX & TEMPO CONTROLS */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-rose-50/45 border border-rose-100/70 p-4 rounded-2xl mb-5 shadow-3xs relative">
            <div className="absolute top-1.5 left-2">
              <span className="text-[7px] font-mono text-rose-450 font-black tracking-widest uppercase">AUDIOPHILE STAGE LEVEL</span>
            </div>
            
            {/* Standing-out Master Volume Controller */}
            <div className="md:col-span-7 flex items-center gap-3.5 bg-white p-3 rounded-xl border border-rose-200/70 shadow-2xs hover:shadow-xs transition-all w-full mt-1.5">
              <button 
                onClick={() => setMasterVolume(prev => prev > 0 ? 0 : 70)}
                className="p-2 rounded-xl bg-rose-50 border border-rose-150 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                title="Mute Master Output"
              >
                {masterVolume === 0 ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-rose-600 animate-pulse" />}
              </button>
              
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-center leading-none">
                  <span className="text-[10px] font-mono font-black text-rose-600 uppercase tracking-widest">MASTER VOLUME STAGE LEVEL</span>
                  <span className="text-[11px] font-mono font-black text-rose-700">{masterVolume}%</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={masterVolume}
                  onChange={(e) => setMasterVolume(Number(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-rose-600 mt-2"
                  style={{
                    background: `linear-gradient(to right, #e11d48 0%, #e11d48 ${masterVolume}%, #f5f5f4 ${masterVolume}%, #f5f5f4 100%)`
                  }}
                />
              </div>
            </div>

            {/* Tempo Speed Multiplier Slider */}
            <div className="md:col-span-5 flex items-center gap-2 bg-white p-3 rounded-xl border border-stone-200/50 shadow-3xs w-full mt-1.5">
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-center leading-none">
                  <span className="text-[9px] font-mono font-black text-stone-500 uppercase tracking-wider">TEMPO BIAS</span>
                  <span className="text-[10px] font-mono font-black text-stone-700">{tempoMultiplier.toFixed(2)}x</span>
                </div>
                <input 
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.05"
                  value={tempoMultiplier}
                  onChange={(e) => setTempoMultiplier(Number(e.target.value))}
                  className="w-full h-1.5 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-stone-700 mt-2"
                />
              </div>
            </div>

          </div>

          {/* Player controls row */}
          <div className="flex items-center justify-between gap-3 border-t border-stone-100 pt-4 mt-auto">
            <button
              onClick={handleStop}
              className="p-2.5 px-4 rounded-xl border border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50 text-stone-600 hover:text-stone-900 transition-all font-mono font-black text-xs uppercase tracking-wider cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>

            <button
              onClick={handlePlayToggle}
              className={`flex-1 p-3.5 rounded-2xl font-display font-black text-sm uppercase tracking-widest transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 text-white
                ${isPlaying 
                  ? 'bg-stone-900 hover:bg-stone-850 shadow-inner' 
                  : `bg-gradient-to-r ${currentSymphony.bgGradient} hover:brightness-105 shadow-rose-200`
                }
              `}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5 fill-white stroke-none" /> Pause Broadcast
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-white stroke-none" /> Play Masterpiece
                </>
              )}
            </button>
          </div>

        </div>

        {/* LOG OF RECENT MELODIC SEQUENCE VECTORS */}
        <div className="bg-stone-50 border border-stone-200/60 rounded-2xl p-4 shadow-3xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono font-black text-stone-500 uppercase tracking-widest">
                Real-Time Acoustic Telemetry
              </span>
            </div>
            <span className="text-[9px] font-mono text-stone-400">
              Showing last 20 carriers
            </span>
          </div>

          <div className="bg-stone-900 border border-stone-800 rounded-xl p-3 max-h-[110px] overflow-y-auto font-mono text-[10px] text-stone-300 space-y-1 scrollbar-thin">
            {performanceLog.length === 0 ? (
              <div className="text-center text-stone-500 py-4 italic">
                Awaiting sequence carrier triggers. Play a masterpiece or click keyboard keys to begin stream.
              </div>
            ) : (
              performanceLog.map((log, i) => (
                <div key={i} className="flex items-center justify-between hover:bg-white/5 p-1 rounded transition-colors">
                  <span className="text-stone-500">[{log.time}]</span>
                  <span className={log.isManual ? "text-amber-400 font-bold" : "text-rose-400"}>
                    {log.isManual ? "👆 Manual Play" : "🤖 Sequencer"}
                  </span>
                  <span className="text-white font-black">{log.note}</span>
                  <span className="text-stone-400">{log.hz} Hz</span>
                  <span className="text-[9px] px-1 bg-white/10 rounded font-sans text-stone-400">
                    vector active
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
          </>
        ) : (
          <div className="flex flex-col gap-4 animate-fade-in">
            {/* CoSing Main Studio Stage */}
            <div className="bg-white/95 border border-stone-200/80 rounded-2xl p-5 shadow-xs flex flex-col gap-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Radio className="w-32 h-32 text-rose-500 animate-pulse" />
              </div>

              {/* Header inside CoSing */}
              <div className="border-b border-stone-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-display font-black text-sm text-[#9f1239] uppercase tracking-wide flex items-center gap-1.5">
                    <Radio className="w-4 h-4 text-rose-600 animate-pulse" />
                    CoSing Social Studio
                  </h3>
                  <p className="text-[10px] text-stone-400 font-mono font-bold leading-none mt-0.5">
                    RECORD & PERFORM VOCAL SONGS ALONGSIDE LICENSED AI IDOLS
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-emerald-100 self-start sm:self-auto">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                  Voice Engine Online
                </div>
              </div>

              {/* Selection of Idols */}
              <div>
                <h4 className="text-[10px] font-mono font-black text-stone-500 uppercase tracking-wider mb-2">
                  1. Select your vocal idol partner:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {VOCAL_IDOLS.map(idol => {
                    const isSelected = selectedIdolId === idol.id;
                    return (
                      <button
                        key={idol.id}
                        type="button"
                        onClick={() => {
                          setSelectedIdolId(idol.id);
                          setIsRecording(false);
                        }}
                        className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer hover:shadow-3xs relative overflow-hidden ${
                          isSelected
                            ? 'border-rose-400 bg-rose-50/40 shadow-sm ring-1 ring-rose-200'
                            : 'border-stone-150 bg-stone-50/50 hover:bg-white'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-xl shadow-3xs mb-1">
                          {idol.avatar}
                        </div>
                        <h5 className="font-display font-bold text-stone-850 text-[11px] leading-tight truncate w-full">
                          {idol.name}
                        </h5>
                        <p className="text-[8px] text-stone-400 font-mono leading-none truncate w-full">
                          {idol.title}
                        </p>
                        {isSelected && (
                          <div className="absolute top-1 right-1">
                            <span className="flex h-2 w-2 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                            </span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Display Chosen Idol details */}
              {(() => {
                const idol = VOCAL_IDOLS.find(i => i.id === selectedIdolId) || VOCAL_IDOLS[0];
                return (
                  <div className="bg-stone-50 border border-stone-200/60 rounded-xl p-3 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                    <div className="md:col-span-8">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] px-1.5 py-0.5 font-mono font-black uppercase rounded bg-[#9f1239] text-white">
                          {idol.genre}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono">
                          Tone: <strong className="text-stone-600 font-bold">{idol.voiceTone}</strong>
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 leading-normal">
                        {idol.description}
                      </p>
                    </div>
                    <div className="md:col-span-4 border-l border-stone-200 pl-3 space-y-1 text-[10px] font-mono text-stone-500">
                      <div>Track: <strong className="text-stone-850 font-bold">{idol.licensedTrack}</strong></div>
                      <div>Key: <span className="text-[#9f1239] font-bold">{idol.trackKey}</span></div>
                      <div>BPM: <span className="text-stone-800 font-bold">{idol.trackBpm}</span></div>
                    </div>
                  </div>
                );
              })()}

              {/* Studio Microphone & Lyric Prompter section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Microphone console */}
                <div className="border border-stone-200/85 rounded-xl p-4 bg-stone-950 text-white flex flex-col justify-between min-h-[190px]">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-[10px] font-mono font-black text-rose-400 uppercase tracking-widest flex items-center gap-1">
                      <Mic className="w-3.5 h-3.5" /> Vocal Input Device
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsMicActive(!isMicActive)}
                      className={`px-2 py-1 rounded-lg text-[9px] font-mono font-black uppercase transition-all flex items-center gap-1 cursor-pointer ${
                        isMicActive
                          ? 'bg-emerald-500 text-white shadow-inner animate-pulse'
                          : 'bg-white/10 text-stone-300 hover:bg-white/15'
                      }`}
                    >
                      {isMicActive ? <Mic className="w-2.5 h-2.5" /> : <MicOff className="w-2.5 h-2.5" />}
                      {isMicActive ? 'MIC ON' : 'CONNECT MIC'}
                    </button>
                  </div>

                  {/* Meter Display */}
                  <div className="py-3">
                    <div className="flex items-center justify-between mb-1.5 text-[9px] font-mono text-stone-400">
                      <span>VOICE FEEDBACK FREQUENCY</span>
                      <span>{micLevel}% Volume</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden flex gap-0.5 p-0.5">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 rounded-full transition-all duration-75"
                        style={{ width: `${micLevel}%` }}
                      />
                    </div>
                    {/* Simulated Voice Graph Waveform */}
                    <div className="h-6 flex items-center justify-center gap-0.5 mt-2 overflow-hidden opacity-80">
                      {Array(24).fill(0).map((_, i) => {
                        const randomHeight = isMicActive ? Math.max(10, Math.floor((Math.sin(i * 0.4) + 1.2) * micLevel * 0.4)) : 4;
                        return (
                          <div 
                            key={i} 
                            className="w-1 bg-rose-500/80 rounded-full transition-all duration-75" 
                            style={{ height: `${randomHeight}%` }}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Perform Button */}
                  <div className="pt-2 border-t border-white/5 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        initAudio();
                        if (isRecording) {
                          // Stop recording and auto-save
                          setIsRecording(false);
                          const idol = VOCAL_IDOLS.find(i => i.id === selectedIdolId) || VOCAL_IDOLS[0];
                          const newDuet = {
                            id: Date.now().toString(),
                            date: new Date().toISOString().slice(0, 16).replace('T', ' '),
                            idolName: idol.name,
                            trackName: `${idol.licensedTrack} (AI Duet Mixdown)`,
                            rating: 5
                          };
                          setSavedDuets(prev => [newDuet, ...prev]);
                        } else {
                          setIsRecording(true);
                        }
                      }}
                      className={`flex-1 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        isRecording
                          ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                          : 'bg-white text-stone-900 hover:bg-stone-100'
                      }`}
                    >
                      {isRecording ? (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-current" />
                          Stop & Save Duet
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          Start AI Duet
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Lyrics Karaoke Display */}
                <div className="border border-stone-200/80 rounded-xl p-4 bg-stone-900 text-stone-100 flex flex-col justify-between min-h-[190px]">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-[10px] font-mono font-black text-amber-400 uppercase tracking-widest flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Studio Teleprompter
                    </span>
                    {isRecording && (
                      <span className="text-[8px] bg-rose-500 text-white px-1.5 py-0.5 rounded font-mono font-black uppercase tracking-wider animate-pulse">
                        REC LIVE
                      </span>
                    )}
                  </div>

                  <div className="py-4 text-center select-none flex-1 flex flex-col justify-center">
                    {isRecording ? (
                      (() => {
                        const idol = VOCAL_IDOLS.find(i => i.id === selectedIdolId) || VOCAL_IDOLS[0];
                        return (
                          <div className="space-y-2">
                            {idol.lyrics.map((line, idx) => {
                              const isActive = idx === lyricsIndex;
                              return (
                                <p 
                                  key={idx} 
                                  className={`text-xs font-bold transition-all duration-300 ${
                                    isActive 
                                      ? 'text-white text-sm tracking-wide font-extrabold bg-[#9f1239]/20 py-1 px-2 rounded-lg border border-[#9f1239]/30 scale-105' 
                                      : 'text-stone-500 scale-95 opacity-60'
                                  }`}
                                >
                                  {line}
                                </p>
                              );
                            })}
                          </div>
                        );
                      })()
                    ) : (
                      <div className="text-stone-400 italic text-[11px] space-y-1.5">
                        <p>🎤 Connect your microphone and click "Start AI Duet".</p>
                        <p className="text-[9px] text-stone-500 font-mono">
                          Immersive voice enhancements will harmonize in real-time.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-white/5 pt-1 text-center">
                    <span className="text-[8px] font-mono text-stone-500 uppercase tracking-widest">
                      AI Vocal Collaboration Active
                    </span>
                  </div>
                </div>

              </div>

              {/* Interactive FX Rack */}
              <div>
                <h4 className="text-[10px] font-mono font-black text-stone-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5 text-stone-600" /> 2. Immersive AI Sound Effects Rack:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'reverb', label: 'Stereo Reverb', desc: 'Concert Hall Space' },
                    { id: 'autoTune', label: 'Pitch Correction', desc: 'Precise Vocal Alignment' },
                    { id: 'aiHarmony', label: 'AI Harmony Partner', desc: 'Automatic Backing Vocals' },
                    { id: 'saturation', label: 'Warm Saturation', desc: 'Analog Valve Preamp' }
                  ].map(fx => {
                    const active = (effects as any)[fx.id];
                    return (
                      <button
                        key={fx.id}
                        type="button"
                        onClick={() => setEffects(prev => ({ ...prev, [fx.id]: !active }))}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between hover:shadow-3xs ${
                          active
                            ? 'border-rose-450 bg-rose-50/20 shadow-3xs'
                            : 'border-stone-150 bg-stone-50/50 text-stone-400'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className={`text-[10px] font-bold ${active ? 'text-stone-900 font-black' : 'text-stone-400'}`}>
                            {fx.label}
                          </span>
                          <span className={`w-2 h-2 rounded-full ${active ? 'bg-rose-500 animate-pulse' : 'bg-stone-300'}`} />
                        </div>
                        <span className="text-[8px] font-mono leading-none text-stone-400 block">
                          {fx.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Duets History panel */}
            <div className="bg-stone-50 border border-stone-200/60 rounded-2xl p-4 shadow-3xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-black text-stone-500 uppercase tracking-widest flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-rose-500" /> CoSing Social Recordings
                </span>
                <span className="text-[9px] font-mono text-stone-400">
                  {savedDuets.length} Mixdowns Saved
                </span>
              </div>

              <div className="space-y-2">
                {savedDuets.map((duet) => (
                  <div 
                    key={duet.id} 
                    className="bg-white border border-stone-150 p-3 rounded-xl flex items-center justify-between gap-3 shadow-3xs hover:shadow-2xs transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-sm border border-rose-100 shadow-3xs">
                        🎙️
                      </div>
                      <div>
                        <h5 className="font-display font-bold text-[11px] text-stone-850 leading-tight">
                          {duet.trackName}
                        </h5>
                        <p className="text-[9px] text-stone-400 font-mono leading-none mt-0.5">
                          Artist: {duet.idolName} • {duet.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-100 font-mono font-black uppercase">
                          Licensed AI
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSavedDuets(prev => prev.filter(d => d.id !== duet.id));
                        }}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Mixdown"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
