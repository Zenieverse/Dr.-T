export interface SymphonyNote {
  note: string;
  dur: number; // in beats (e.g. 0.25 = 16th, 0.5 = 8th, 1.0 = quarter)
}

export interface SymphonyMasterpiece {
  id: string;
  category: 'classical' | 'pop';
  subCategory: 'mozart' | 'beethoven' | 'baroque' | 'romantic' | 'impressionist' | 'pop_modern';
  composer: string;
  name: string;
  opus?: string;
  emoji: string;
  year: string;
  era: 'Classical' | 'Baroque' | 'Romantic' | 'Impressionism' | 'Contemporary Pop';
  description: string;
  benefits: string;
  brainwave: 'Alpha (8-12 Hz)' | 'Theta (4-8 Hz)' | 'Gamma (30-50 Hz)' | 'Beta (13-30 Hz)' | 'Delta (0.5-4 Hz)';
  defaultInstrument: 'piano' | 'violin' | 'flute' | 'cello' | 'synth';
  tempo: number; // BPM
  keySignature: string;
  bgGradient: string;
  cardColor: string;
  notes: SymphonyNote[];
  chords: string[][];
  bassline: string[];
  lyrics?: string[];
  movements?: string[];
}

export const NOTE_FREQS: Record<string, number> = {
  'REST': 0,
  'C1': 32.70, 'C#1': 34.65, 'D1': 36.71, 'D#1': 38.89, 'E1': 41.20, 'F1': 43.65, 'F#1': 46.25, 'G1': 49.00, 'G#1': 51.91, 'A1': 55.00, 'A#1': 58.27, 'B1': 61.74,
  'C2': 65.41, 'C#2': 69.30, 'D2': 73.42, 'D#2': 77.78, 'E2': 82.41, 'F2': 87.31, 'F#2': 92.50, 'G2': 98.00, 'G#2': 103.83, 'A2': 110.00, 'A#2': 116.54, 'B2': 123.47,
  'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'E3': 164.81, 'F3': 174.61, 'F#3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'B3': 246.94,
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
  'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'B5': 987.77,
  'C6': 1046.50, 'C#6': 1108.73, 'D6': 1174.66, 'D#6': 1244.51, 'E6': 1318.51, 'F6': 1396.91, 'F#6': 1479.98, 'G6': 1567.98, 'G#6': 1661.22, 'A6': 1760.00, 'A#6': 1864.66, 'B6': 1975.53,
  'C7': 2093.00,
  // Harmonic aliases for flat notation
  'Db3': 138.59, 'Eb3': 155.56, 'Gb3': 185.00, 'Ab3': 207.65, 'Bb3': 233.08,
  'Db4': 277.18, 'Eb4': 311.13, 'Gb4': 369.99, 'Ab4': 415.30, 'Bb4': 466.16,
  'Db5': 554.37, 'Eb5': 622.25, 'Gb5': 739.99, 'Ab5': 830.61, 'Bb5': 932.33,
  'Db2': 69.30, 'Eb2': 77.78, 'Gb2': 92.50, 'Ab2': 103.83, 'Bb2': 116.54,
  'Db1': 34.65, 'Eb1': 38.89, 'Gb1': 46.25, 'Ab1': 51.91, 'Bb1': 58.27,
  'B#4': 523.25, 'E#4': 349.23
};

export const ALL_SYMPHONIES: SymphonyMasterpiece[] = [
  // ==========================================
  // 1. MOZART COLLECTION (7 Masterpieces)
  // ==========================================
  {
    id: "mozart_nachtmusik",
    category: "classical",
    subCategory: "mozart",
    composer: "Wolfgang Amadeus Mozart",
    name: "Eine kleine Nachtmusik",
    opus: "Serenade No. 13 in G Major, K. 525",
    emoji: "🎻",
    year: "1787",
    era: "Classical",
    description: "Mozart's universally revered serenade. Perfectly symmetrical phrasing and lively string buoyancy that stimulates bilateral cortical coherence.",
    benefits: "Alpha brainwave entrainment & spatial reasoning (The Mozart Effect)",
    brainwave: "Alpha (8-12 Hz)",
    defaultInstrument: "violin",
    tempo: 132,
    keySignature: "G Major",
    bgGradient: "from-amber-400 to-yellow-600",
    cardColor: "border-amber-200 bg-amber-50/50 text-amber-950",
    notes: [
      { note: 'G4', dur: 0.5 }, { note: 'REST', dur: 0.25 }, { note: 'D4', dur: 0.25 },
      { note: 'G4', dur: 0.5 }, { note: 'REST', dur: 0.25 }, { note: 'D4', dur: 0.25 },
      { note: 'G4', dur: 0.25 }, { note: 'D4', dur: 0.25 }, { note: 'G4', dur: 0.25 }, { note: 'B4', dur: 0.25 },
      { note: 'D5', dur: 0.75 }, { note: 'REST', dur: 0.25 },
      { note: 'C5', dur: 0.5 }, { note: 'REST', dur: 0.25 }, { note: 'A4', dur: 0.25 },
      { note: 'C5', dur: 0.5 }, { note: 'REST', dur: 0.25 }, { note: 'A4', dur: 0.25 },
      { note: 'C5', dur: 0.25 }, { note: 'A4', dur: 0.25 }, { note: 'F#4', dur: 0.25 }, { note: 'A4', dur: 0.25 },
      { note: 'D4', dur: 0.75 }, { note: 'REST', dur: 0.25 }
    ],
    chords: [
      ['G3', 'B3', 'D4'],
      ['D3', 'F#3', 'A3'],
      ['G3', 'B3', 'D4'],
      ['D3', 'F#3', 'C4']
    ],
    bassline: ['G2', 'D2', 'G2', 'D2'],
    lyrics: [
      "Allegro: Joyous evening serenade under the Vienna stars",
      "Romanze: Tender and poetic conversational strings",
      "Menuetto & Trio: Regal courtly dance and harmonic balance",
      "Rondo: Sparkling finale bursting with Austrian sunshine"
    ]
  },
  {
    id: "mozart_symphony40",
    category: "classical",
    subCategory: "mozart",
    composer: "Wolfgang Amadeus Mozart",
    name: "Symphony No. 40 in G Minor",
    opus: "Molto Allegro, K. 550",
    emoji: "🎼",
    year: "1788",
    era: "Classical",
    description: "The dramatic heart of Mozart's symphonic output. Pulsing violas beneath an unforgettable tragic theme that sharpens mental focus and emotional processing.",
    benefits: "Dopamine modulation, intense focus & emotional resolution",
    brainwave: "Beta (13-30 Hz)",
    defaultInstrument: "violin",
    tempo: 116,
    keySignature: "G Minor",
    bgGradient: "from-rose-500 to-indigo-700",
    cardColor: "border-rose-200 bg-rose-50/50 text-rose-950",
    notes: [
      { note: 'Eb4', dur: 0.25 }, { note: 'D4', dur: 0.25 }, { note: 'D4', dur: 0.5 },
      { note: 'Eb4', dur: 0.25 }, { note: 'D4', dur: 0.25 }, { note: 'D4', dur: 0.5 },
      { note: 'Eb4', dur: 0.25 }, { note: 'D4', dur: 0.25 }, { note: 'D4', dur: 0.25 }, { note: 'Bb4', dur: 0.75 },
      { note: 'A4', dur: 0.5 }, { note: 'G4', dur: 0.5 },
      { note: 'C4', dur: 0.25 }, { note: 'Bb3', dur: 0.25 }, { note: 'Bb3', dur: 0.5 },
      { note: 'C4', dur: 0.25 }, { note: 'Bb3', dur: 0.25 }, { note: 'Bb3', dur: 0.5 },
      { note: 'C4', dur: 0.25 }, { note: 'Bb3', dur: 0.25 }, { note: 'Bb3', dur: 0.25 }, { note: 'G4', dur: 0.75 },
      { note: 'F#4', dur: 0.5 }, { note: 'G4', dur: 0.5 }
    ],
    chords: [
      ['G3', 'Bb3', 'D4'],
      ['D3', 'F#3', 'A3'],
      ['G3', 'Bb3', 'D4'],
      ['C3', 'Eb3', 'G3']
    ],
    bassline: ['G2', 'D2', 'G2', 'C2'],
    lyrics: [
      "I. Molto Allegro: Urgent melancholic longing in G minor",
      "II. Andante: Graceful woodwinds weaving contemplative peace",
      "III. Menuetto: Stately polyphonic counterpoint",
      "IV. Allegro assai: Explosive rockets of virtuoso mastery"
    ]
  },
  {
    id: "mozart_turca",
    category: "classical",
    subCategory: "mozart",
    composer: "Wolfgang Amadeus Mozart",
    name: "Rondo alla Turca",
    opus: "Turkish March (Piano Sonata No. 11, K. 331)",
    emoji: "🎹",
    year: "1783",
    era: "Classical",
    description: "Infectious, galloping Ottoman Janissary rhythm imitating cymbals and military bells. Highly stimulating for motor processing and cognitive vigor.",
    benefits: "Motor coordination, reaction speed & morning alertness",
    brainwave: "Gamma (30-50 Hz)",
    defaultInstrument: "piano",
    tempo: 126,
    keySignature: "A Minor / A Major",
    bgGradient: "from-amber-500 to-red-600",
    cardColor: "border-amber-200 bg-amber-50/50 text-amber-950",
    notes: [
      { note: 'B4', dur: 0.25 }, { note: 'A4', dur: 0.25 }, { note: 'G#4', dur: 0.25 }, { note: 'A4', dur: 0.25 },
      { note: 'C5', dur: 0.5 }, { note: 'REST', dur: 0.25 },
      { note: 'D5', dur: 0.25 }, { note: 'C5', dur: 0.25 }, { note: 'B4', dur: 0.25 }, { note: 'C5', dur: 0.25 },
      { note: 'E5', dur: 0.5 }, { note: 'REST', dur: 0.25 },
      { note: 'F5', dur: 0.25 }, { note: 'E5', dur: 0.25 }, { note: 'D#5', dur: 0.25 }, { note: 'E5', dur: 0.25 },
      { note: 'B5', dur: 0.25 }, { note: 'A5', dur: 0.25 }, { note: 'G#5', dur: 0.25 }, { note: 'A5', dur: 0.25 },
      { note: 'B5', dur: 0.25 }, { note: 'A5', dur: 0.25 }, { note: 'G#5', dur: 0.25 }, { note: 'A5', dur: 0.25 },
      { note: 'C6', dur: 0.75 }, { note: 'REST', dur: 0.25 }
    ],
    chords: [
      ['A3', 'C4', 'E4'],
      ['E3', 'G#3', 'B3'],
      ['A3', 'C4', 'E4'],
      ['D3', 'F3', 'A3']
    ],
    bassline: ['A2', 'E2', 'A2', 'D2'],
    lyrics: [
      "Galloping staccato octaves mimicking the Janissary drums",
      "Bright modal shift into sunny A Major fireworks",
      "Celebratory Turkish march echoing through imperial Vienna"
    ]
  },
  {
    id: "mozart_sonata16",
    category: "classical",
    subCategory: "mozart",
    composer: "Wolfgang Amadeus Mozart",
    name: "Piano Sonata No. 16 in C Major",
    opus: "Sonata facile, K. 545",
    emoji: "✨",
    year: "1788",
    era: "Classical",
    description: "The epitome of classical elegance and transparent balance. Alberti bass arpeggios providing grounding mental calm and clean working memory.",
    benefits: "Stress reduction, study flow & serene mental clarity",
    brainwave: "Alpha (8-12 Hz)",
    defaultInstrument: "piano",
    tempo: 118,
    keySignature: "C Major",
    bgGradient: "from-sky-400 to-teal-600",
    cardColor: "border-sky-200 bg-sky-50/50 text-sky-950",
    notes: [
      { note: 'C5', dur: 0.75 }, { note: 'E5', dur: 0.25 }, { note: 'G5', dur: 0.5 },
      { note: 'B4', dur: 0.75 }, { note: 'C5', dur: 0.25 }, { note: 'D5', dur: 0.25 }, { note: 'C5', dur: 0.25 },
      { note: 'A4', dur: 0.5 }, { note: 'G4', dur: 0.5 }, { note: 'C5', dur: 0.5 },
      { note: 'F4', dur: 0.5 }, { note: 'E4', dur: 0.5 }, { note: 'D4', dur: 0.5 },
      { note: 'C4', dur: 0.75 }, { note: 'REST', dur: 0.25 }
    ],
    chords: [
      ['C3', 'E3', 'G3'],
      ['G2', 'B2', 'D3'],
      ['C3', 'E3', 'G3'],
      ['F2', 'A2', 'C3']
    ],
    bassline: ['C2', 'G1', 'C2', 'F1'],
    lyrics: [
      "Pure geometric symmetry designed for peaceful academic study",
      "Cascading scalic runs soothing the autonomic nervous system",
      "Luminous C Major clarity dispelling mental fog"
    ]
  },
  {
    id: "mozart_magicflute",
    category: "classical",
    subCategory: "mozart",
    composer: "Wolfgang Amadeus Mozart",
    name: "The Magic Flute (Queen of the Night)",
    opus: "Der Hölle Rache kocht in meinem Herzen, K. 620",
    emoji: "👑",
    year: "1791",
    era: "Classical",
    description: "The most famous coloratura soprano tour-de-force in music history. High staccato F6 notes creating pristine auditory frequency stimulation.",
    benefits: "High-frequency auditory stimulation & peak attention",
    brainwave: "Gamma (30-50 Hz)",
    defaultInstrument: "flute",
    tempo: 138,
    keySignature: "D Minor",
    bgGradient: "from-purple-500 to-indigo-900",
    cardColor: "border-purple-200 bg-purple-50/50 text-purple-950",
    notes: [
      { note: 'D5', dur: 0.5 }, { note: 'F5', dur: 0.5 }, { note: 'A5', dur: 0.5 }, { note: 'D6', dur: 0.5 },
      { note: 'C6', dur: 0.25 }, { note: 'Bb5', dur: 0.25 }, { note: 'A5', dur: 0.25 }, { note: 'G5', dur: 0.25 },
      { note: 'F5', dur: 0.5 }, { note: 'D5', dur: 0.5 },
      { note: 'A5', dur: 0.25 }, { note: 'A5', dur: 0.25 }, { note: 'A5', dur: 0.25 }, { note: 'A5', dur: 0.25 },
      { note: 'F6', dur: 0.5 }, { note: 'E6', dur: 0.25 }, { note: 'D6', dur: 0.25 }, { note: 'C#6', dur: 0.5 },
      { note: 'D6', dur: 0.75 }, { note: 'REST', dur: 0.25 }
    ],
    chords: [
      ['D3', 'F3', 'A3'],
      ['A2', 'C#3', 'E3'],
      ['D3', 'F3', 'A3'],
      ['G2', 'Bb2', 'D3']
    ],
    bassline: ['D2', 'A1', 'D2', 'G1'],
    lyrics: [
      "Hell's vengeance boils within my sovereign heart!",
      "Starlight coloratura piercing through the shadows",
      "Cosmic defiance echoing across the midnight amphitheater"
    ]
  },
  {
    id: "mozart_clarinet",
    category: "classical",
    subCategory: "mozart",
    composer: "Wolfgang Amadeus Mozart",
    name: "Clarinet Concerto in A Major",
    opus: "Adagio, K. 622",
    emoji: "🕊️",
    year: "1791",
    era: "Classical",
    description: "Mozart's final completed instrumental work. Sublime, breathable melodies that lower resting heart rate and soothe anxiety.",
    benefits: "Parasympathetic nervous activation & deep emotional warmth",
    brainwave: "Theta (4-8 Hz)",
    defaultInstrument: "flute",
    tempo: 60,
    keySignature: "A Major",
    bgGradient: "from-emerald-400 to-teal-700",
    cardColor: "border-emerald-200 bg-emerald-50/50 text-emerald-950",
    notes: [
      { note: 'E4', dur: 0.75 }, { note: 'A4', dur: 0.75 }, { note: 'C#5', dur: 0.75 },
      { note: 'B4', dur: 0.5 }, { note: 'A4', dur: 0.25 }, { note: 'G#4', dur: 0.5 }, { note: 'A4', dur: 0.25 },
      { note: 'B4', dur: 0.75 }, { note: 'E4', dur: 0.75 },
      { note: 'D5', dur: 0.5 }, { note: 'C#5', dur: 0.25 }, { note: 'B4', dur: 0.5 }, { note: 'A4', dur: 0.25 },
      { note: 'G#4', dur: 0.75 }, { note: 'A4', dur: 0.75 }
    ],
    chords: [
      ['A2', 'C#3', 'E3'],
      ['E2', 'G#2', 'B2'],
      ['F#2', 'A2', 'C#3'],
      ['D2', 'F#2', 'A2']
    ],
    bassline: ['A1', 'E1', 'F#1', 'D1'],
    lyrics: [
      "Velvet lyrical woodwind phrases drifting on a warm summer evening",
      "Serene harmonic dialogue easing all bodily tension",
      "Unconditional motherly acceptance and timeless peace"
    ]
  },
  {
    id: "mozart_lacrimosa",
    category: "classical",
    subCategory: "mozart",
    composer: "Wolfgang Amadeus Mozart",
    name: "Lacrimosa (Requiem)",
    opus: "Requiem in D Minor, K. 626",
    emoji: "💧",
    year: "1791",
    era: "Classical",
    description: "The weeping strings and ascending vocal prayers of Mozart's legendary swansong. Transports the listener into profound contemplative awe.",
    benefits: "Profound catharsis, emotional decompression & reverence",
    brainwave: "Theta (4-8 Hz)",
    defaultInstrument: "violin",
    tempo: 62,
    keySignature: "D Minor",
    bgGradient: "from-slate-600 to-stone-900",
    cardColor: "border-stone-300 bg-stone-50/60 text-stone-950",
    notes: [
      { note: 'A3', dur: 0.5 }, { note: 'D4', dur: 0.5 }, { note: 'F4', dur: 0.5 },
      { note: 'E4', dur: 0.5 }, { note: 'D4', dur: 0.5 }, { note: 'C#4', dur: 0.5 },
      { note: 'D4', dur: 0.75 }, { note: 'F4', dur: 0.5 }, { note: 'A4', dur: 0.5 },
      { note: 'G4', dur: 0.5 }, { note: 'F4', dur: 0.5 }, { note: 'E4', dur: 0.5 },
      { note: 'F4', dur: 0.75 }, { note: 'REST', dur: 0.25 }
    ],
    chords: [
      ['D3', 'F3', 'A3'],
      ['A2', 'C#3', 'E3'],
      ['D3', 'F3', 'A3'],
      ['G2', 'Bb2', 'D3']
    ],
    bassline: ['D2', 'A1', 'D2', 'G1'],
    lyrics: [
      "Lacrimosa dies illa: Full of tears shall be that day",
      "Qua resurget ex favilla: When from the ashes shall arise",
      "Dona eis requiem: Grant them eternal rest and peace"
    ]
  },

  // ==========================================
  // 2. BEETHOVEN COLLECTION (6 Masterpieces)
  // ==========================================
  {
    id: "beethoven_symphony5",
    category: "classical",
    subCategory: "beethoven",
    composer: "Ludwig van Beethoven",
    name: "Symphony No. 5 in C Minor",
    opus: "Fate Theme (Allegro con brio, Op. 67)",
    emoji: "⚡",
    year: "1808",
    era: "Classical",
    description: "The most iconic four notes in Western music history: 'Fate knocking at the door'. Unyielding rhythmic drive that triggers resolve, courage, and neuro-motor drive.",
    benefits: "Executive determination, grit & cognitive stamina",
    brainwave: "Gamma (30-50 Hz)",
    defaultInstrument: "violin",
    tempo: 108,
    keySignature: "C Minor",
    bgGradient: "from-rose-600 to-stone-900",
    cardColor: "border-rose-300 bg-rose-50/50 text-rose-950",
    notes: [
      { note: 'G4', dur: 0.25 }, { note: 'G4', dur: 0.25 }, { note: 'G4', dur: 0.25 }, { note: 'Eb4', dur: 1.0 },
      { note: 'REST', dur: 0.5 },
      { note: 'F4', dur: 0.25 }, { note: 'F4', dur: 0.25 }, { note: 'F4', dur: 0.25 }, { note: 'D4', dur: 1.25 },
      { note: 'REST', dur: 0.5 },
      { note: 'G4', dur: 0.25 }, { note: 'G4', dur: 0.25 }, { note: 'G4', dur: 0.25 }, { note: 'Eb4', dur: 0.5 },
      { note: 'Ab4', dur: 0.25 }, { note: 'Ab4', dur: 0.25 }, { note: 'Ab4', dur: 0.25 }, { note: 'G4', dur: 0.5 },
      { note: 'F4', dur: 0.25 }, { note: 'F4', dur: 0.25 }, { note: 'F4', dur: 0.25 }, { note: 'Eb4', dur: 0.5 },
      { note: 'D4', dur: 1.0 }
    ],
    chords: [
      ['C3', 'Eb3', 'G3'],
      ['G2', 'B2', 'D3'],
      ['C3', 'Eb3', 'G3'],
      ['Ab2', 'C3', 'Eb3']
    ],
    bassline: ['C2', 'G1', 'C2', 'Ab1'],
    lyrics: [
      "Thus Fate knocks at the threshold of human destiny!",
      "Relentless perseverance turning tragedy into triumph",
      "Unconquerable will overcoming every earthly obstacle"
    ]
  },
  {
    id: "beethoven_ode_to_joy",
    category: "classical",
    subCategory: "beethoven",
    composer: "Ludwig van Beethoven",
    name: "Symphony No. 9 (Ode to Joy)",
    opus: "An die Freude (Finale, Op. 125)",
    emoji: "🌟",
    year: "1824",
    era: "Romantic",
    description: "The universal anthem of human brotherhood and transcendent joy. Composed in profound total deafness, uniting hearts in euphoric shared humanity.",
    benefits: "Oxytocin release, global connection & mood elevation",
    brainwave: "Beta (13-30 Hz)",
    defaultInstrument: "violin",
    tempo: 120,
    keySignature: "D Major",
    bgGradient: "from-amber-400 to-orange-600",
    cardColor: "border-amber-200 bg-amber-50/50 text-amber-950",
    notes: [
      { note: 'E4', dur: 0.5 }, { note: 'E4', dur: 0.5 }, { note: 'F#4', dur: 0.5 }, { note: 'G4', dur: 0.5 },
      { note: 'G4', dur: 0.5 }, { note: 'F#4', dur: 0.5 }, { note: 'E4', dur: 0.5 }, { note: 'D4', dur: 0.5 },
      { note: 'C4', dur: 0.5 }, { note: 'C4', dur: 0.5 }, { note: 'D4', dur: 0.5 }, { note: 'E4', dur: 0.5 },
      { note: 'E4', dur: 0.75 }, { note: 'D4', dur: 0.25 }, { note: 'D4', dur: 0.75 }, { note: 'REST', dur: 0.25 },
      { note: 'E4', dur: 0.5 }, { note: 'E4', dur: 0.5 }, { note: 'F#4', dur: 0.5 }, { note: 'G4', dur: 0.5 },
      { note: 'G4', dur: 0.5 }, { note: 'F#4', dur: 0.5 }, { note: 'E4', dur: 0.5 }, { note: 'D4', dur: 0.5 },
      { note: 'C4', dur: 0.5 }, { note: 'C4', dur: 0.5 }, { note: 'D4', dur: 0.5 }, { note: 'E4', dur: 0.5 },
      { note: 'D4', dur: 0.75 }, { note: 'C4', dur: 0.25 }, { note: 'C4', dur: 0.75 }, { note: 'REST', dur: 0.25 }
    ],
    chords: [
      ['C3', 'E3', 'G3'],
      ['G2', 'B2', 'D3'],
      ['C3', 'E3', 'G3'],
      ['G2', 'B2', 'D3']
    ],
    bassline: ['C2', 'G1', 'C2', 'G1'],
    lyrics: [
      "Freude, schöner Götterfunken: Joy, divine spark of the gods!",
      "Alle Menschen werden Brüder: All humankind shall be brothers",
      "Embracing millions under the gentle canopy of the stars"
    ]
  },
  {
    id: "beethoven_fur_elise",
    category: "classical",
    subCategory: "beethoven",
    composer: "Ludwig van Beethoven",
    name: "Für Elise",
    opus: "Bagatelle No. 25 in A Minor, WoO 59",
    emoji: "🌹",
    year: "1810",
    era: "Romantic",
    description: "The beloved lyrical romantic miniature. Gentle chromatic oscillating semitones promoting fine-motor entrainment and soothing emotional contemplation.",
    benefits: "Fine-motor synchronization, delicate study & sweet nostalgia",
    brainwave: "Alpha (8-12 Hz)",
    defaultInstrument: "piano",
    tempo: 130,
    keySignature: "A Minor",
    bgGradient: "from-rose-400 to-pink-600",
    cardColor: "border-rose-200 bg-rose-50/50 text-rose-950",
    notes: [
      { note: 'E5', dur: 0.25 }, { note: 'D#5', dur: 0.25 }, { note: 'E5', dur: 0.25 }, { note: 'D#5', dur: 0.25 },
      { note: 'E5', dur: 0.25 }, { note: 'B4', dur: 0.25 }, { note: 'D5', dur: 0.25 }, { note: 'C5', dur: 0.25 },
      { note: 'A4', dur: 0.75 }, { note: 'REST', dur: 0.25 },
      { note: 'C4', dur: 0.25 }, { note: 'E4', dur: 0.25 }, { note: 'A4', dur: 0.25 },
      { note: 'B4', dur: 0.75 }, { note: 'REST', dur: 0.25 },
      { note: 'E4', dur: 0.25 }, { note: 'G#4', dur: 0.25 }, { note: 'B4', dur: 0.25 },
      { note: 'C5', dur: 0.75 }, { note: 'REST', dur: 0.25 }
    ],
    chords: [
      ['A3', 'C4', 'E4'],
      ['E3', 'G#3', 'B3'],
      ['A3', 'C4', 'E4'],
      ['E3', 'G#3', 'B3']
    ],
    bassline: ['A2', 'E2', 'A2', 'E2'],
    lyrics: [
      "A tender handwritten musical keepsake for a cherished companion",
      "Gentle semitones weaving sweet memories across ivory keys",
      "Delicate romantic yearning echoing through the quiet parlor"
    ]
  },
  {
    id: "beethoven_moonlight",
    category: "classical",
    subCategory: "beethoven",
    composer: "Ludwig van Beethoven",
    name: "Moonlight Sonata",
    opus: "Piano Sonata No. 14 in C# Minor (Adagio sostenuto, Op. 27 No. 2)",
    emoji: "🌙",
    year: "1801",
    era: "Romantic",
    description: "Flowing nocturnal triplet arpeggios beneath a solemn cantabile melody. Resembles a solitary boat gliding over Lake Lucerne by moonlit twilight.",
    benefits: "Delta-Theta deep relaxation, sleep induction & meditative calm",
    brainwave: "Delta (0.5-4 Hz)",
    defaultInstrument: "piano",
    tempo: 54,
    keySignature: "C# Minor",
    bgGradient: "from-indigo-600 to-slate-900",
    cardColor: "border-indigo-200 bg-indigo-50/50 text-indigo-950",
    notes: [
      { note: 'G#3', dur: 0.33 }, { note: 'C#4', dur: 0.33 }, { note: 'E4', dur: 0.33 },
      { note: 'G#3', dur: 0.33 }, { note: 'C#4', dur: 0.33 }, { note: 'E4', dur: 0.33 },
      { note: 'G#3', dur: 0.33 }, { note: 'C#4', dur: 0.33 }, { note: 'E4', dur: 0.33 },
      { note: 'G#4', dur: 0.75 }, { note: 'G#4', dur: 0.75 }, { note: 'G#4', dur: 0.75 },
      { note: 'A4', dur: 0.75 }, { note: 'G#4', dur: 0.5 }, { note: 'F#4', dur: 0.25 },
      { note: 'E4', dur: 0.75 }, { note: 'D#4', dur: 0.75 }
    ],
    chords: [
      ['C#3', 'E3', 'G#3'],
      ['A2', 'C#3', 'E3'],
      ['F#2', 'A2', 'C#3'],
      ['G#2', 'B#2', 'D#3']
    ],
    bassline: ['C#2', 'A1', 'F#1', 'G#1'],
    lyrics: [
      "Adagio sostenuto: Quasi una fantasia over midnight waters",
      "Hypnotic triplet waves gently dissolving conscious thoughts",
      "Serene lunar peace guiding the mind into restorative slumber"
    ]
  },
  {
    id: "beethoven_symphony7",
    category: "classical",
    subCategory: "beethoven",
    composer: "Ludwig van Beethoven",
    name: "Symphony No. 7 in A Major",
    opus: "Allegretto (Movement II, Op. 92)",
    emoji: "🏛️",
    year: "1812",
    era: "Romantic",
    description: "Wagner hailed this symphony as the 'Apotheosis of the Dance'. The Allegretto features an unshakeable hypnotic ostinato rhythm that instills profound inner balance.",
    benefits: "Rhythmic grounding, emotional equilibrium & working memory",
    brainwave: "Alpha (8-12 Hz)",
    defaultInstrument: "violin",
    tempo: 76,
    keySignature: "A Minor",
    bgGradient: "from-stone-600 to-amber-900",
    cardColor: "border-stone-300 bg-stone-50/50 text-stone-950",
    notes: [
      { note: 'E4', dur: 0.5 }, { note: 'E4', dur: 0.25 }, { note: 'E4', dur: 0.25 }, { note: 'E4', dur: 0.5 }, { note: 'E4', dur: 0.5 },
      { note: 'E4', dur: 0.5 }, { note: 'E4', dur: 0.25 }, { note: 'E4', dur: 0.25 }, { note: 'E4', dur: 0.5 }, { note: 'E4', dur: 0.5 },
      { note: 'G4', dur: 0.5 }, { note: 'G4', dur: 0.25 }, { note: 'G4', dur: 0.25 }, { note: 'G4', dur: 0.5 }, { note: 'F4', dur: 0.5 },
      { note: 'E4', dur: 0.5 }, { note: 'D4', dur: 0.5 }, { note: 'E4', dur: 1.0 }
    ],
    chords: [
      ['A3', 'C4', 'E4'],
      ['E3', 'G#3', 'B3'],
      ['C3', 'E3', 'G3'],
      ['D3', 'F3', 'A3']
    ],
    bassline: ['A2', 'E2', 'C2', 'D2'],
    lyrics: [
      "The stately, eternal pulse of the human journey",
      "Building layer by layer into majestic orchestral reverence",
      "Unbroken rhythmic dignity marching towards the light"
    ]
  },
  {
    id: "beethoven_pathetique",
    category: "classical",
    subCategory: "beethoven",
    composer: "Ludwig van Beethoven",
    name: "Pathétique Sonata",
    opus: "Piano Sonata No. 8 in C Minor (Adagio cantabile, Op. 13)",
    emoji: "🕊️",
    year: "1798",
    era: "Classical",
    description: "One of the most heart-soothing cantabile melodies ever penned. A warm embrace of unconditional solace and soulful healing.",
    benefits: "Emotional healing, somatic calm & parasympathetic restoration",
    brainwave: "Theta (4-8 Hz)",
    defaultInstrument: "piano",
    tempo: 58,
    keySignature: "Ab Major",
    bgGradient: "from-teal-500 to-indigo-800",
    cardColor: "border-teal-200 bg-teal-50/50 text-teal-950",
    notes: [
      { note: 'C4', dur: 0.5 }, { note: 'Eb4', dur: 0.5 }, { note: 'Ab4', dur: 0.75 },
      { note: 'G4', dur: 0.25 }, { note: 'F4', dur: 0.25 }, { note: 'Eb4', dur: 0.25 }, { note: 'Db4', dur: 0.25 },
      { note: 'C4', dur: 0.5 }, { note: 'Bb3', dur: 0.5 }, { note: 'C4', dur: 0.75 },
      { note: 'Db4', dur: 0.25 }, { note: 'Eb4', dur: 0.5 }, { note: 'C4', dur: 0.75 }
    ],
    chords: [
      ['Ab2', 'C3', 'Eb3'],
      ['Eb2', 'G2', 'Bb2'],
      ['F2', 'Ab2', 'C3'],
      ['Db2', 'F2', 'Ab2']
    ],
    bassline: ['Ab1', 'Eb1', 'F1', 'Db1'],
    lyrics: [
      "Adagio cantabile: Singing straight to the weary heart",
      "A soothing balm for deep grief and anxious turbulence",
      "Gentle reassurance that everything will be well"
    ]
  },

  // ==========================================
  // 3. BAROQUE GIANTS: BACH & VIVALDI (9 Masterpieces)
  // ==========================================
  {
    id: "vivaldi_spring",
    category: "classical",
    subCategory: "baroque",
    composer: "Antonio Vivaldi",
    name: "The Four Seasons: Spring",
    opus: "La Primavera (Allegro, Op. 8 No. 1)",
    emoji: "🌸",
    year: "1725",
    era: "Baroque",
    description: "The burst of vernal life! Singing birds, murmuring streams, and gentle spring breezes in vibrant E Major joy.",
    benefits: "Circadian morning awakening, optimism & cognitive vitality",
    brainwave: "Alpha (8-12 Hz)",
    defaultInstrument: "violin",
    tempo: 110,
    keySignature: "E Major",
    bgGradient: "from-emerald-400 to-green-600",
    cardColor: "border-emerald-200 bg-emerald-50/50 text-emerald-950",
    notes: [
      { note: 'E5', dur: 0.5 }, { note: 'G#5', dur: 0.25 }, { note: 'G#5', dur: 0.25 }, { note: 'G#5', dur: 0.5 },
      { note: 'F#5', dur: 0.25 }, { note: 'E5', dur: 0.25 }, { note: 'B5', dur: 0.75 },
      { note: 'B5', dur: 0.25 }, { note: 'A5', dur: 0.25 }, { note: 'G#5', dur: 0.25 }, { note: 'F#5', dur: 0.5 },
      { note: 'G#5', dur: 0.25 }, { note: 'F#5', dur: 0.25 }, { note: 'E5', dur: 0.75 }, { note: 'REST', dur: 0.25 }
    ],
    chords: [
      ['E3', 'G#3', 'B3'],
      ['B2', 'D#3', 'F#3'],
      ['C#3', 'E3', 'G#3'],
      ['A2', 'C#3', 'E3']
    ],
    bassline: ['E2', 'B1', 'C#2', 'A1'],
    lyrics: [
      "Spring has arrived! Joyous birds celebrate with festive song",
      "Brooks flow murmuring softly in sweet spring breezes",
      "Thunder and lightning crown the sky before sunshine returns"
    ]
  },
  {
    id: "vivaldi_summer",
    category: "classical",
    subCategory: "baroque",
    composer: "Antonio Vivaldi",
    name: "The Four Seasons: Summer (Storm)",
    opus: "L'Estate (Presto, Op. 8 No. 2)",
    emoji: "⚡",
    year: "1725",
    era: "Baroque",
    description: "The fierce summer hailstorm unleashing tempestuous fury. Rapid 16th-note string cascades providing high-intensity cardio drive.",
    benefits: "High energy, workout stimulation & mental alertness",
    brainwave: "Gamma (30-50 Hz)",
    defaultInstrument: "violin",
    tempo: 144,
    keySignature: "G Minor",
    bgGradient: "from-orange-500 to-red-700",
    cardColor: "border-orange-200 bg-orange-50/50 text-orange-950",
    notes: [
      { note: 'G4', dur: 0.25 }, { note: 'G4', dur: 0.25 }, { note: 'Bb4', dur: 0.25 }, { note: 'A4', dur: 0.25 },
      { note: 'G4', dur: 0.25 }, { note: 'F#4', dur: 0.25 }, { note: 'G4', dur: 0.25 }, { note: 'D5', dur: 0.25 },
      { note: 'C5', dur: 0.25 }, { note: 'Bb4', dur: 0.25 }, { note: 'A4', dur: 0.25 }, { note: 'G4', dur: 0.25 },
      { note: 'D5', dur: 0.5 }, { note: 'D5', dur: 0.5 }
    ],
    chords: [
      ['G3', 'Bb3', 'D4'],
      ['D3', 'F#3', 'A3'],
      ['Eb3', 'G3', 'Bb3'],
      ['C3', 'Eb3', 'G3']
    ],
    bassline: ['G2', 'D2', 'Eb2', 'C2'],
    lyrics: [
      "The skies rumble with furious summer thunder!",
      "Hailstones batter the golden wheat fields",
      "Unbridled natural power sweeping across the Venetian countryside"
    ]
  },
  {
    id: "vivaldi_winter",
    category: "classical",
    subCategory: "baroque",
    composer: "Antonio Vivaldi",
    name: "The Four Seasons: Winter",
    opus: "L'Inverno (Allegro non molto, Op. 8 No. 4)",
    emoji: "❄️",
    year: "1725",
    era: "Baroque",
    description: "Crisp shivering string pulses mimicking icy frost, followed by the cozy warmth of a crackling hearth while rain pours outside.",
    benefits: "Sensory crispness, tactile clarity & cozy comfort",
    brainwave: "Beta (13-30 Hz)",
    defaultInstrument: "violin",
    tempo: 100,
    keySignature: "F Minor",
    bgGradient: "from-cyan-500 to-blue-800",
    cardColor: "border-cyan-200 bg-cyan-50/50 text-cyan-950",
    notes: [
      { note: 'F4', dur: 0.25 }, { note: 'F4', dur: 0.25 }, { note: 'F4', dur: 0.25 }, { note: 'F4', dur: 0.25 },
      { note: 'Ab4', dur: 0.25 }, { note: 'Ab4', dur: 0.25 }, { note: 'G4', dur: 0.25 }, { note: 'G4', dur: 0.25 },
      { note: 'F4', dur: 0.25 }, { note: 'F4', dur: 0.25 }, { note: 'E4', dur: 0.25 }, { note: 'E4', dur: 0.25 },
      { note: 'F4', dur: 0.5 }, { note: 'C5', dur: 0.5 }
    ],
    chords: [
      ['F3', 'Ab3', 'C4'],
      ['C3', 'E3', 'G3'],
      ['Db3', 'F3', 'Ab3'],
      ['Bb2', 'Db3', 'F3']
    ],
    bassline: ['F2', 'C2', 'Db2', 'Bb1'],
    lyrics: [
      "Shivering in the icy cold amidst bitter snows",
      "Stamping feet against the biting winter wind",
      "Finding peace by the blazing fireside while cold rains fall"
    ]
  },
  {
    id: "bach_air",
    category: "classical",
    subCategory: "baroque",
    composer: "Johann Sebastian Bach",
    name: "Air on the G String",
    opus: "Orchestral Suite No. 3 in D Major, BWV 1068",
    emoji: "🎻",
    year: "1731",
    era: "Baroque",
    description: "The quintessential piece of tranquil baroque serenity. A continuous walking bassline supporting an airborne, heavenly violin cantilena.",
    benefits: "Blood pressure regulation, heart coherence & cellular calm",
    brainwave: "Theta (4-8 Hz)",
    defaultInstrument: "violin",
    tempo: 56,
    keySignature: "D Major",
    bgGradient: "from-amber-300 to-yellow-600",
    cardColor: "border-amber-200 bg-amber-50/50 text-amber-950",
    notes: [
      { note: 'F#5', dur: 1.0 }, { note: 'E5', dur: 0.25 }, { note: 'D5', dur: 0.25 },
      { note: 'C#5', dur: 0.5 }, { note: 'B4', dur: 0.25 }, { note: 'A4', dur: 0.25 },
      { note: 'B4', dur: 0.5 }, { note: 'C#5', dur: 0.5 }, { note: 'D5', dur: 1.0 },
      { note: 'E5', dur: 0.5 }, { note: 'F#5', dur: 0.5 }, { note: 'G5', dur: 0.75 }
    ],
    chords: [
      ['D3', 'F#3', 'A3'],
      ['B2', 'D3', 'F#3'],
      ['G2', 'B2', 'D3'],
      ['A2', 'C#3', 'E3']
    ],
    bassline: ['D2', 'B1', 'G1', 'A1'],
    lyrics: [
      "Airborne strings floating weightless across the sanctuary",
      "Steady, reassuring walking bass anchoring the human soul",
      "Sacred harmonic architecture bringing order to the universe"
    ]
  },
  {
    id: "bach_jesu",
    category: "classical",
    subCategory: "baroque",
    composer: "Johann Sebastian Bach",
    name: "Jesu, Joy of Man's Desiring",
    opus: "Herz und Mund und Tat und Leben, BWV 147",
    emoji: "🌿",
    year: "1723",
    era: "Baroque",
    description: "Cascading triplets in 9/8 pastoral time wrapping around a solid choral hymn. Induces profound feelings of warmth, safety, and gratitude.",
    benefits: "Serotonin elevation, comfort & gratitude reinforcement",
    brainwave: "Alpha (8-12 Hz)",
    defaultInstrument: "flute",
    tempo: 78,
    keySignature: "G Major",
    bgGradient: "from-emerald-400 to-teal-600",
    cardColor: "border-emerald-200 bg-emerald-50/50 text-emerald-950",
    notes: [
      { note: 'G4', dur: 0.33 }, { note: 'A4', dur: 0.33 }, { note: 'B4', dur: 0.33 },
      { note: 'D5', dur: 0.33 }, { note: 'C5', dur: 0.33 }, { note: 'C5', dur: 0.33 },
      { note: 'E5', dur: 0.33 }, { note: 'D5', dur: 0.33 }, { note: 'D5', dur: 0.33 },
      { note: 'G5', dur: 0.33 }, { note: 'F#5', dur: 0.33 }, { note: 'G5', dur: 0.33 },
      { note: 'D5', dur: 0.33 }, { note: 'B4', dur: 0.33 }, { note: 'G4', dur: 0.33 },
      { note: 'A4', dur: 0.33 }, { note: 'B4', dur: 0.33 }, { note: 'C5', dur: 0.33 }
    ],
    chords: [
      ['G3', 'B3', 'D4'],
      ['C3', 'E3', 'G3'],
      ['D3', 'F#3', 'A3'],
      ['G3', 'B3', 'D4']
    ],
    bassline: ['G2', 'C2', 'D2', 'G2'],
    lyrics: [
      "Pastoral woodwinds dancing in circular 9/8 sunshine",
      "Unbroken flow of gratitude and life-affirming grace",
      "Resting in the embrace of boundless compassion"
    ]
  },
  {
    id: "bach_toccata",
    category: "classical",
    subCategory: "baroque",
    composer: "Johann Sebastian Bach",
    name: "Toccata and Fugue in D Minor",
    opus: "BWV 565",
    emoji: "⛪",
    year: "1704",
    era: "Baroque",
    description: "The thunderous organ masterpiece. Imposing flourishes, dramatic pauses, and intricate 4-voice fugal counterpoint.",
    benefits: "Complex spatial geometry & neural network architecture",
    brainwave: "Beta (13-30 Hz)",
    defaultInstrument: "piano",
    tempo: 85,
    keySignature: "D Minor",
    bgGradient: "from-stone-700 to-zinc-950",
    cardColor: "border-stone-300 bg-stone-50/50 text-stone-950",
    notes: [
      { note: 'A4', dur: 0.25 }, { note: 'G4', dur: 0.25 }, { note: 'A4', dur: 0.75 }, { note: 'REST', dur: 0.25 },
      { note: 'G4', dur: 0.25 }, { note: 'F4', dur: 0.25 }, { note: 'E4', dur: 0.25 }, { note: 'D4', dur: 0.25 },
      { note: 'C#4', dur: 0.5 }, { note: 'D4', dur: 1.0 }, { note: 'REST', dur: 0.5 },
      { note: 'A3', dur: 0.25 }, { note: 'G3', dur: 0.25 }, { note: 'A3', dur: 0.75 }
    ],
    chords: [
      ['D3', 'F3', 'A3'],
      ['A2', 'C#3', 'E3'],
      ['D3', 'F3', 'A3'],
      ['Bb2', 'D3', 'F3']
    ],
    bassline: ['D2', 'A1', 'D2', 'Bb1'],
    lyrics: [
      "Cathedral organ pipes shaking the very foundations",
      "Towering counterpoint exploring multi-dimensional logic",
      "Sublime mathematical precision carved into timeless stone"
    ]
  },
  {
    id: "bach_minuet",
    category: "classical",
    subCategory: "baroque",
    composer: "Johann Sebastian Bach / Petzold",
    name: "Minuet in G Major",
    opus: "BWV Anh. 114",
    emoji: "👑",
    year: "1725",
    era: "Baroque",
    description: "The beloved graceful 3/4 courtly dance from the Notebook for Anna Magdalena Bach. Clean, joyous, and mentally organizing.",
    benefits: "Cognitive symmetry, gentle balance & mood brightening",
    brainwave: "Alpha (8-12 Hz)",
    defaultInstrument: "piano",
    tempo: 116,
    keySignature: "G Major",
    bgGradient: "from-yellow-400 to-amber-600",
    cardColor: "border-yellow-200 bg-yellow-50/50 text-yellow-950",
    notes: [
      { note: 'D5', dur: 0.5 }, { note: 'G4', dur: 0.25 }, { note: 'A4', dur: 0.25 }, { note: 'B4', dur: 0.25 }, { note: 'C5', dur: 0.25 },
      { note: 'D5', dur: 0.5 }, { note: 'G4', dur: 0.5 }, { note: 'G4', dur: 0.5 },
      { note: 'E5', dur: 0.5 }, { note: 'C5', dur: 0.25 }, { note: 'D5', dur: 0.25 }, { note: 'E5', dur: 0.25 }, { note: 'F#5', dur: 0.25 },
      { note: 'G5', dur: 0.5 }, { note: 'G4', dur: 0.5 }, { note: 'G4', dur: 0.5 }
    ],
    chords: [
      ['G3', 'B3', 'D4'],
      ['D3', 'F#3', 'A3'],
      ['C3', 'E3', 'G3'],
      ['G3', 'B3', 'D4']
    ],
    bassline: ['G2', 'D2', 'C2', 'G2'],
    lyrics: [
      "A charming domestic minuet dedicated with love to Anna Magdalena",
      "Symmetrical 3/4 steps restoring clarity to thoughts",
      "Gentle domestic joy brightening the working day"
    ]
  },
  {
    id: "bach_cello1",
    category: "classical",
    subCategory: "baroque",
    composer: "Johann Sebastian Bach",
    name: "Cello Suite No. 1 in G Major",
    opus: "Prelude, BWV 1007",
    emoji: "🎻",
    year: "1720",
    era: "Baroque",
    description: "The most famous solo cello work in existence. Seamless arpeggiated waves creating a full polyphonic world from a single resonant instrument.",
    benefits: "Somatosensory resonance, deep grounding & cellular stabilization",
    brainwave: "Theta (4-8 Hz)",
    defaultInstrument: "cello",
    tempo: 80,
    keySignature: "G Major",
    bgGradient: "from-amber-600 to-stone-900",
    cardColor: "border-amber-300 bg-amber-50/50 text-amber-950",
    notes: [
      { note: 'G3', dur: 0.25 }, { note: 'D4', dur: 0.25 }, { note: 'B4', dur: 0.25 }, { note: 'A4', dur: 0.25 },
      { note: 'B4', dur: 0.25 }, { note: 'D4', dur: 0.25 }, { note: 'B4', dur: 0.25 }, { note: 'D4', dur: 0.25 },
      { note: 'G3', dur: 0.25 }, { note: 'D4', dur: 0.25 }, { note: 'B4', dur: 0.25 }, { note: 'A4', dur: 0.25 },
      { note: 'B4', dur: 0.25 }, { note: 'D4', dur: 0.25 }, { note: 'B4', dur: 0.25 }, { note: 'D4', dur: 0.25 }
    ],
    chords: [
      ['G2', 'B2', 'D3'],
      ['E2', 'G2', 'B2'],
      ['C2', 'E2', 'G2'],
      ['D2', 'F#2', 'A2']
    ],
    bassline: ['G1', 'E1', 'C1', 'D1'],
    lyrics: [
      "Rich wooden cello resonances vibrating deeply through the body",
      "Solitary meditation connecting earth and sky",
      "Pure acoustic beauty without artificial distraction"
    ]
  },
  {
    id: "pachelbel_canon",
    category: "classical",
    subCategory: "baroque",
    composer: "Johann Pachelbel",
    name: "Canon in D Major",
    opus: "P. 37",
    emoji: "🕊️",
    year: "1680",
    era: "Baroque",
    description: "The timeless 8-measure ground bass upon which three violins weave 28 intricate variations. The universal symbol of harmony and sacred vows.",
    benefits: "Heart-rate entrainment, emotional grounding & unconditional safety",
    brainwave: "Alpha (8-12 Hz)",
    defaultInstrument: "violin",
    tempo: 62,
    keySignature: "D Major",
    bgGradient: "from-sky-300 to-indigo-600",
    cardColor: "border-sky-200 bg-sky-50/50 text-sky-950",
    notes: [
      { note: 'F#5', dur: 0.5 }, { note: 'E5', dur: 0.5 }, { note: 'D5', dur: 0.5 }, { note: 'C#5', dur: 0.5 },
      { note: 'B4', dur: 0.5 }, { note: 'A4', dur: 0.5 }, { note: 'B4', dur: 0.5 }, { note: 'C#5', dur: 0.5 },
      { note: 'D5', dur: 0.25 }, { note: 'C#5', dur: 0.25 }, { note: 'B4', dur: 0.25 }, { note: 'A4', dur: 0.25 },
      { note: 'G4', dur: 0.25 }, { note: 'F#4', dur: 0.25 }, { note: 'G4', dur: 0.25 }, { note: 'E4', dur: 0.25 }
    ],
    chords: [
      ['D3', 'F#3', 'A3'],
      ['A2', 'C#3', 'E3'],
      ['B2', 'D3', 'F#3'],
      ['F#2', 'A2', 'C#3']
    ],
    bassline: ['D2', 'A1', 'B1', 'F#1'],
    lyrics: [
      "The unshakeable eight-note bassline underpinning all creation",
      "Violin harmonies embracing one another across generations",
      "Timeless vows of devotion, fidelity, and peace"
    ]
  },

  // ==========================================
  // 4. ROMANTIC & IMPRESSIONIST MASTERS (10 Masterpieces)
  // ==========================================
  {
    id: "chopin_nocturne_op9",
    category: "classical",
    subCategory: "romantic",
    composer: "Frédéric Chopin",
    name: "Nocturne in E-flat Major",
    opus: "Op. 9 No. 2",
    emoji: "🌙",
    year: "1832",
    era: "Romantic",
    description: "Chopin's most celebrated nocturne. Bel canto operatic ornamentations gliding over warm 12/8 waltz chords in velvety Parisian salon elegance.",
    benefits: "Deep relaxation, REM sleep preparation & gentle emotional release",
    brainwave: "Theta (4-8 Hz)",
    defaultInstrument: "piano",
    tempo: 64,
    keySignature: "Eb Major",
    bgGradient: "from-indigo-400 to-purple-800",
    cardColor: "border-indigo-200 bg-indigo-50/50 text-indigo-950",
    notes: [
      { note: 'Bb4', dur: 0.5 }, { note: 'G5', dur: 0.75 }, { note: 'F5', dur: 0.25 }, { note: 'Eb5', dur: 0.5 },
      { note: 'D5', dur: 0.25 }, { note: 'Eb5', dur: 0.25 }, { note: 'F5', dur: 0.5 }, { note: 'Bb4', dur: 0.5 },
      { note: 'G5', dur: 0.75 }, { note: 'F5', dur: 0.25 }, { note: 'Eb5', dur: 0.5 }, { note: 'D5', dur: 0.25 },
      { note: 'C5', dur: 0.5 }, { note: 'Bb4', dur: 0.75 }
    ],
    chords: [
      ['Eb3', 'G3', 'Bb3'],
      ['C3', 'Eb3', 'G3'],
      ['Ab2', 'C3', 'Eb3'],
      ['Bb2', 'D3', 'F3']
    ],
    bassline: ['Eb2', 'C2', 'Ab1', 'Bb1'],
    lyrics: [
      "Parisian twilight glowing softly through sheer lace curtains",
      "Bel canto poetry singing to the quiet night",
      "Dissolving day's worries into tranquil starlight"
    ]
  },
  {
    id: "chopin_fantaisie",
    category: "classical",
    subCategory: "romantic",
    composer: "Frédéric Chopin",
    name: "Fantaisie-Impromptu",
    opus: "Op. 66 in C# Minor",
    emoji: "⚡",
    year: "1834",
    era: "Romantic",
    description: "The dazzling 4-against-3 cross-rhythm masterpiece with a heartbreakingly gorgeous cantabile middle section in Db Major.",
    benefits: "Cross-hemispheric neuroplasticity & rapid cognitive synchronization",
    brainwave: "Gamma (30-50 Hz)",
    defaultInstrument: "piano",
    tempo: 140,
    keySignature: "C# Minor",
    bgGradient: "from-rose-500 to-indigo-900",
    cardColor: "border-rose-200 bg-rose-50/50 text-rose-950",
    notes: [
      { note: 'G#4', dur: 0.25 }, { note: 'C#5', dur: 0.25 }, { note: 'E5', dur: 0.25 }, { note: 'D#5', dur: 0.25 },
      { note: 'C#5', dur: 0.25 }, { note: 'B4', dur: 0.25 }, { note: 'C#5', dur: 0.25 }, { note: 'D#5', dur: 0.25 },
      { note: 'E5', dur: 0.25 }, { note: 'F#5', dur: 0.25 }, { note: 'G#5', dur: 0.5 },
      { note: 'F#5', dur: 0.25 }, { note: 'E5', dur: 0.25 }, { note: 'D#5', dur: 0.25 }, { note: 'C#5', dur: 0.5 }
    ],
    chords: [
      ['C#3', 'E3', 'G#3'],
      ['G#2', 'B#2', 'D#3'],
      ['A2', 'C#3', 'E3'],
      ['F#2', 'A2', 'C#3']
    ],
    bassline: ['C#2', 'G#1', 'A1', 'F#1'],
    lyrics: [
      "Polyrhythmic waves rushing like lightning across the keyboard",
      "Sudden oasis of romantic tenderness in Db Major",
      "A whirlwind of pure passion and brilliant keyboard craft"
    ]
  },
  {
    id: "debussy_clair_de_lune",
    category: "classical",
    subCategory: "impressionist",
    composer: "Claude Debussy",
    name: "Clair de Lune",
    opus: "Suite Bergamasque, L. 75",
    emoji: "🌌",
    year: "1905",
    era: "Impressionism",
    description: "Inspired by Paul Verlaine's poem. Ethereal, floating impressionist chords evoking shimmering moonlight reflected on quiet fountain waters.",
    benefits: "Profound parasympathetic ease, sensory decompression & tranquil bliss",
    brainwave: "Delta (0.5-4 Hz)",
    defaultInstrument: "piano",
    tempo: 52,
    keySignature: "Db Major",
    bgGradient: "from-cyan-400 to-indigo-800",
    cardColor: "border-cyan-200 bg-cyan-50/50 text-cyan-950",
    notes: [
      { note: 'F5', dur: 0.75 }, { note: 'Eb5', dur: 0.75 },
      { note: 'Db5', dur: 0.5 }, { note: 'C5', dur: 0.25 }, { note: 'Db5', dur: 0.75 },
      { note: 'Ab4', dur: 1.0 },
      { note: 'F4', dur: 0.75 }, { note: 'Db4', dur: 0.75 }
    ],
    chords: [
      ['Db3', 'F3', 'Ab3'],
      ['Gb2', 'Bb2', 'Db3'],
      ['Ab2', 'C3', 'Eb3'],
      ['Db3', 'F3', 'Ab3']
    ],
    bassline: ['Db2', 'Gb1', 'Ab1', 'Db2'],
    lyrics: [
      "Votre âme est un paysage choisi: Your soul is a chosen landscape",
      "Moonlight shimmering soft and sad upon the fountains",
      "Weightless dreaming suspended in cool silver twilight"
    ]
  },
  {
    id: "tchaikovsky_swan_lake",
    category: "classical",
    subCategory: "romantic",
    composer: "Pyotr Ilyich Tchaikovsky",
    name: "Swan Lake (Main Theme)",
    opus: "Scene (Act II, Op. 20)",
    emoji: "🦢",
    year: "1876",
    era: "Romantic",
    description: "The world's most evocative ballet theme. An oboe solo crying out over tremolo strings, capturing tragic enchantment and mythical transformation.",
    benefits: "Visuospatial imagination, rich emotion & cinematic inspiration",
    brainwave: "Theta (4-8 Hz)",
    defaultInstrument: "flute",
    tempo: 72,
    keySignature: "B Minor",
    bgGradient: "from-slate-500 to-indigo-900",
    cardColor: "border-slate-300 bg-slate-50/50 text-slate-950",
    notes: [
      { note: 'B4', dur: 0.5 }, { note: 'F#4', dur: 0.25 }, { note: 'B4', dur: 0.25 }, { note: 'C#5', dur: 0.25 }, { note: 'D5', dur: 0.25 },
      { note: 'E5', dur: 0.25 }, { note: 'F#5', dur: 0.5 }, { note: 'D5', dur: 0.5 },
      { note: 'B4', dur: 0.5 }, { note: 'C#5', dur: 0.25 }, { note: 'D5', dur: 0.25 }, { note: 'B4', dur: 0.5 },
      { note: 'F#4', dur: 1.0 }
    ],
    chords: [
      ['B2', 'D3', 'F#3'],
      ['G2', 'B2', 'D3'],
      ['E2', 'G2', 'B2'],
      ['F#2', 'A#2', 'C#3']
    ],
    bassline: ['B1', 'G1', 'E1', 'F#1'],
    lyrics: [
      "White swans gliding across the enchanted moonlit lake",
      "Odette's sorrowful melody soaring above shivering strings",
      "True love breaking the spell of darkness and illusion"
    ]
  },
  {
    id: "tchaikovsky_sugar_plum",
    category: "classical",
    subCategory: "romantic",
    composer: "Pyotr Ilyich Tchaikovsky",
    name: "Dance of the Sugar Plum Fairy",
    opus: "The Nutcracker, Op. 71a",
    emoji: "🍬",
    year: "1892",
    era: "Romantic",
    description: "The historical premiere of the celesta in ballet. Delicate crystalline bells dancing in staccato wonder through the Kingdom of Sweets.",
    benefits: "Sensory curiosity, childlike delight & mental playfulness",
    brainwave: "Gamma (30-50 Hz)",
    defaultInstrument: "piano",
    tempo: 115,
    keySignature: "E Minor",
    bgGradient: "from-pink-400 to-purple-700",
    cardColor: "border-pink-200 bg-pink-50/50 text-pink-950",
    notes: [
      { note: 'E5', dur: 0.25 }, { note: 'B4', dur: 0.25 }, { note: 'G4', dur: 0.25 }, { note: 'E4', dur: 0.25 },
      { note: 'D#4', dur: 0.25 }, { note: 'E4', dur: 0.25 }, { note: 'F#4', dur: 0.25 }, { note: 'G4', dur: 0.25 },
      { note: 'B4', dur: 0.5 }, { note: 'E5', dur: 0.5 },
      { note: 'D#5', dur: 0.25 }, { note: 'E5', dur: 0.25 }, { note: 'F#5', dur: 0.25 }, { note: 'G5', dur: 0.25 },
      { note: 'E5', dur: 0.75 }, { note: 'REST', dur: 0.25 }
    ],
    chords: [
      ['E3', 'G3', 'B3'],
      ['B2', 'D#3', 'F#3'],
      ['C3', 'E3', 'G3'],
      ['A2', 'C3', 'E3']
    ],
    bassline: ['E2', 'B1', 'C2', 'A1'],
    lyrics: [
      "Glistening glass bells tiptoeing through the Sugar Kingdom",
      "Delicate drops of sugar crystals falling from frosty branches",
      "Magical holiday wonder awakening the inner child"
    ]
  },
  {
    id: "tchaikovsky_waltz_flowers",
    category: "classical",
    subCategory: "romantic",
    composer: "Pyotr Ilyich Tchaikovsky",
    name: "Waltz of the Flowers",
    opus: "The Nutcracker, Op. 71a",
    emoji: "🌺",
    year: "1892",
    era: "Romantic",
    description: "Majestic golden harp cadenza unfolding into a grand, radiant waltz driven by singing French horns and blooming orchestral strings.",
    benefits: "Heart coherence, expansive joy & open-hearted optimism",
    brainwave: "Alpha (8-12 Hz)",
    defaultInstrument: "flute",
    tempo: 142,
    keySignature: "D Major",
    bgGradient: "from-rose-400 to-amber-600",
    cardColor: "border-rose-200 bg-rose-50/50 text-rose-950",
    notes: [
      { note: 'D4', dur: 0.5 }, { note: 'F#4', dur: 0.5 }, { note: 'A4', dur: 0.5 },
      { note: 'D5', dur: 0.75 }, { note: 'F#5', dur: 0.5 }, { note: 'E5', dur: 0.25 },
      { note: 'D5', dur: 0.5 }, { note: 'C#5', dur: 0.5 }, { note: 'B4', dur: 0.5 },
      { note: 'A4', dur: 1.0 }
    ],
    chords: [
      ['D3', 'F#3', 'A3'],
      ['A2', 'C#3', 'E3'],
      ['G2', 'B2', 'D3'],
      ['D3', 'F#3', 'A3']
    ],
    bassline: ['D2', 'A1', 'G1', 'D2'],
    lyrics: [
      "Golden harp cascades opening a grand floral ball",
      "Lush roses and blossoms swirling in imperial waltz cadence",
      "Celebrating the boundless beauty of flourishing life"
    ]
  },
  {
    id: "brahms_lullaby",
    category: "classical",
    subCategory: "romantic",
    composer: "Johannes Brahms",
    name: "Brahms' Lullaby",
    opus: "Wiegenlied (Guten Abend, gut' Nacht, Op. 49 No. 4)",
    emoji: "🧸",
    year: "1868",
    era: "Romantic",
    description: "The world's standard lullaby composed for the birth of a dear friend's son. Soothing rocking motion that cradles infant and adult minds into deep tranquility.",
    benefits: "Motherly safety, cortisol reduction & gentle sleep induction",
    brainwave: "Delta (0.5-4 Hz)",
    defaultInstrument: "flute",
    tempo: 68,
    keySignature: "Eb Major",
    bgGradient: "from-amber-300 to-rose-400",
    cardColor: "border-amber-200 bg-amber-50/50 text-amber-950",
    notes: [
      { note: 'Eb4', dur: 0.5 }, { note: 'Eb4', dur: 0.5 }, { note: 'G4', dur: 0.75 },
      { note: 'Eb4', dur: 0.5 }, { note: 'Eb4', dur: 0.5 }, { note: 'G4', dur: 0.75 },
      { note: 'Eb4', dur: 0.25 }, { note: 'G4', dur: 0.25 }, { note: 'Bb4', dur: 0.75 },
      { note: 'Ab4', dur: 0.5 }, { note: 'F4', dur: 0.25 }, { note: 'G4', dur: 0.25 }, { note: 'Ab4', dur: 0.75 }
    ],
    chords: [
      ['Eb3', 'G3', 'Bb3'],
      ['Bb2', 'D3', 'F3'],
      ['Eb3', 'G3', 'Bb3'],
      ['Ab2', 'C3', 'Eb3']
    ],
    bassline: ['Eb2', 'Bb1', 'Eb2', 'Ab1'],
    lyrics: [
      "Guten Abend, gut' Nacht: Good evening, good night",
      "Mit Rosen bedacht: Covered with roses and guarded by angels",
      "Rest peacefully in motherly love until morning shines"
    ]
  },
  {
    id: "schubert_ave_maria",
    category: "classical",
    subCategory: "romantic",
    composer: "Franz Schubert",
    name: "Ave Maria",
    opus: "Ellens Gesang III, D. 839",
    emoji: "🕯️",
    year: "1825",
    era: "Romantic",
    description: "Schubert's heavenly prayer in Bb Major. Rippling harp-like piano arpeggios that envelop the soul in divine peace, protection, and unconditional forgiveness.",
    benefits: "Spiritual serenity, trauma release & inner peace",
    brainwave: "Theta (4-8 Hz)",
    defaultInstrument: "violin",
    tempo: 56,
    keySignature: "Bb Major",
    bgGradient: "from-sky-300 to-indigo-700",
    cardColor: "border-sky-200 bg-sky-50/50 text-sky-950",
    notes: [
      { note: 'F4', dur: 0.5 }, { note: 'Bb4', dur: 0.75 }, { note: 'D5', dur: 0.5 },
      { note: 'C5', dur: 0.5 }, { note: 'Bb4', dur: 0.5 }, { note: 'A4', dur: 0.25 }, { note: 'Bb4', dur: 0.5 },
      { note: 'C5', dur: 0.5 }, { note: 'F4', dur: 0.75 },
      { note: 'D5', dur: 0.5 }, { note: 'C5', dur: 0.5 }, { note: 'Bb4', dur: 1.0 }
    ],
    chords: [
      ['Bb2', 'D3', 'F3'],
      ['F2', 'A2', 'C3'],
      ['G2', 'Bb2', 'D3'],
      ['Eb2', 'G2', 'Bb2']
    ],
    bassline: ['Bb1', 'F1', 'G1', 'Eb1'],
    lyrics: [
      "Ave Maria! Maiden mild, hear a maiden's prayer",
      "Thou canst hear though from the wild, thou canst save amid despair",
      "Safe beneath the wings of eternal divine mercy"
    ]
  },
  {
    id: "strauss_blue_danube",
    category: "classical",
    subCategory: "romantic",
    composer: "Johann Strauss II",
    name: "The Blue Danube",
    opus: "An der schönen blauen Donau, Op. 314",
    emoji: "🌊",
    year: "1866",
    era: "Romantic",
    description: "The unofficial anthem of Austria. Shimmering French horn arpeggios opening into the grandest, most buoyant 3/4 waltz ever created.",
    benefits: "Fluid joy, physical relaxation & buoyant optimism",
    brainwave: "Alpha (8-12 Hz)",
    defaultInstrument: "violin",
    tempo: 132,
    keySignature: "D Major",
    bgGradient: "from-blue-400 to-indigo-700",
    cardColor: "border-blue-200 bg-blue-50/50 text-blue-950",
    notes: [
      { note: 'D4', dur: 0.5 }, { note: 'F#4', dur: 0.5 }, { note: 'A4', dur: 0.5 }, { note: 'A4', dur: 0.5 }, { note: 'A4', dur: 0.5 },
      { note: 'F#4', dur: 0.5 }, { note: 'F#4', dur: 0.5 }, { note: 'D4', dur: 0.5 }, { note: 'F#4', dur: 0.5 }, { note: 'A4', dur: 0.5 },
      { note: 'A4', dur: 0.5 }, { note: 'A4', dur: 0.5 }, { note: 'G4', dur: 0.5 }, { note: 'E4', dur: 0.5 }, { note: 'G4', dur: 0.5 },
      { note: 'B4', dur: 0.5 }, { note: 'B4', dur: 0.5 }, { note: 'B4', dur: 0.5 }
    ],
    chords: [
      ['D3', 'F#3', 'A3'],
      ['A2', 'C#3', 'E3'],
      ['G2', 'B2', 'D3'],
      ['D3', 'F#3', 'A3']
    ],
    bassline: ['D2', 'A1', 'G1', 'D2'],
    lyrics: [
      "Danube so blue, so bright and fair, through vale and field you float along",
      "Vienna smiles as your clear waves flow, bringing joy where'er you go",
      "A floating celebration of life, spring, and European grace"
    ]
  },

  // ==========================================
  // 5. POP & MODERN HIT ANTHEMS (12 Masterpieces)
  // ==========================================
  {
    id: "pop_blinding",
    category: "pop",
    subCategory: "pop_modern",
    composer: "The Weeknd",
    name: "Blinding Lights",
    emoji: "⚡",
    year: "2019",
    era: "Contemporary Pop",
    description: "The ultimate modern synth-pop anthem. Bright, driving retro-synth hook that is exceptionally focusing, motivating, and mood-boosting.",
    benefits: "High energy, tempo entrainment & upbeat momentum",
    brainwave: "Beta (13-30 Hz)",
    defaultInstrument: "synth",
    tempo: 120,
    keySignature: "F Minor",
    bgGradient: "from-amber-500 to-rose-600",
    cardColor: "border-amber-200 bg-amber-50/50 text-amber-950",
    notes: [
      { note: 'F4', dur: 0.3 }, { note: 'F4', dur: 0.3 }, { note: 'G4', dur: 0.3 }, { note: 'C4', dur: 0.3 },
      { note: 'D4', dur: 0.3 }, { note: 'F4', dur: 0.3 }, { note: 'G4', dur: 0.3 }, { note: 'F4', dur: 0.3 },
      { note: 'D4', dur: 0.3 }, { note: 'C4', dur: 0.3 }, { note: 'D4', dur: 0.6 }, { note: 'REST', dur: 0.6 }
    ],
    chords: [
      ['F3', 'Ab3', 'C4'],
      ['C3', 'Eb3', 'G3'],
      ['Eb3', 'G3', 'Bb3'],
      ['Bb2', 'D3', 'F3']
    ],
    bassline: ['F2', 'C2', 'Eb2', 'Bb1'],
    lyrics: [
      "I've been tryna call, I've been on my own for long enough",
      "Maybe you can show me how to love, maybe",
      "I'm going through withdrawals, you don't even have to do too much",
      "I'm blinded by the lights! No, I can't sleep until I feel your touch"
    ]
  },
  {
    id: "pop_shape",
    category: "pop",
    subCategory: "pop_modern",
    composer: "Ed Sheeran",
    name: "Shape of You",
    emoji: "➗",
    year: "2017",
    era: "Contemporary Pop",
    description: "Infectious marimba rhythmic hook. Wonderfully balanced tempo for motor synchronization, workout pacing, and active focus.",
    benefits: "Rhythmic synchronization & motor clarity",
    brainwave: "Alpha (8-12 Hz)",
    defaultInstrument: "piano",
    tempo: 96,
    keySignature: "C# Minor",
    bgGradient: "from-sky-400 to-indigo-600",
    cardColor: "border-sky-200 bg-sky-50/50 text-sky-950",
    notes: [
      { note: 'C#4', dur: 0.25 }, { note: 'E4', dur: 0.25 }, { note: 'C#4', dur: 0.25 }, { note: 'C#4', dur: 0.25 },
      { note: 'E4', dur: 0.25 }, { note: 'C#4', dur: 0.25 }, { note: 'C#4', dur: 0.25 }, { note: 'E4', dur: 0.25 },
      { note: 'D#4', dur: 0.25 }, { note: 'C#4', dur: 0.25 }, { note: 'B3', dur: 0.5 }, { note: 'REST', dur: 0.4 }
    ],
    chords: [
      ['C#3', 'E3', 'G#3'],
      ['F#2', 'A2', 'C#3'],
      ['A2', 'C#3', 'E3'],
      ['B2', 'D#3', 'F#3']
    ],
    bassline: ['C#2', 'F#2', 'A1', 'B1'],
    lyrics: [
      "The club isn't the best place to find a lover, so the bar is where I go",
      "Me and my friends at the table doing shots, drinking fast and we talk slow",
      "I'm in love with the shape of you, we push and pull like a magnet do",
      "Every day discovering something brand new, I'm in love with your body!"
    ]
  },
  {
    id: "pop_badromance",
    category: "pop",
    subCategory: "pop_modern",
    composer: "Lady Gaga",
    name: "Bad Romance",
    emoji: "👑",
    year: "2009",
    era: "Contemporary Pop",
    description: "Theatrical, powerhouse dance-pop hook. High self-empowerment, confidence building, and vibrant energetic drive.",
    benefits: "Assertiveness, cardiovascular stimulation & confidence",
    brainwave: "Beta (13-30 Hz)",
    defaultInstrument: "synth",
    tempo: 119,
    keySignature: "F Minor",
    bgGradient: "from-rose-500 to-purple-800",
    cardColor: "border-rose-200 bg-rose-50/50 text-rose-950",
    notes: [
      { note: 'G4', dur: 0.3 }, { note: 'G4', dur: 0.3 }, { note: 'A4', dur: 0.3 }, { note: 'G4', dur: 0.3 },
      { note: 'F4', dur: 0.3 }, { note: 'G4', dur: 0.3 }, { note: 'A4', dur: 0.3 }, { note: 'G4', dur: 0.6 },
      { note: 'C5', dur: 0.3 }, { note: 'REST', dur: 0.6 }
    ],
    chords: [
      ['F3', 'Ab3', 'C4'],
      ['Bb2', 'D3', 'F3'],
      ['Ab2', 'C3', 'Eb3'],
      ['C3', 'E3', 'G3']
    ],
    bassline: ['F2', 'Bb1', 'Ab1', 'C2'],
    lyrics: [
      "Rah-rah-ah-ah-ah, roma-roma-ma, gaga-ooh-la-la!",
      "I want your ugly, I want your disease, I want your everything as long as it's free",
      "I want your love, love, love, love, I want your love",
      "You and me could write a bad romance!"
    ]
  },
  {
    id: "pop_stayin",
    category: "pop",
    subCategory: "pop_modern",
    composer: "Bee Gees",
    name: "Stayin' Alive",
    emoji: "🕺",
    year: "1977",
    era: "Contemporary Pop",
    description: "The legendary, high-groove disco anthem. Its 104 BPM tempo is internationally taught for life-saving CPR chest compressions.",
    benefits: "Heart-rate synchronization, CPR tempo entrainment & resilience",
    brainwave: "Alpha (8-12 Hz)",
    defaultInstrument: "flute",
    tempo: 104,
    keySignature: "F Minor",
    bgGradient: "from-fuchsia-500 to-red-600",
    cardColor: "border-fuchsia-200 bg-fuchsia-50/50 text-fuchsia-950",
    notes: [
      { note: 'F4', dur: 0.3 }, { note: 'F4', dur: 0.3 }, { note: 'F4', dur: 0.3 }, { note: 'Eb4', dur: 0.3 },
      { note: 'F4', dur: 0.3 }, { note: 'Ab4', dur: 0.3 }, { note: 'G4', dur: 0.3 }, { note: 'F4', dur: 0.6 },
      { note: 'REST', dur: 0.6 }
    ],
    chords: [
      ['F3', 'Ab3', 'C4'],
      ['Eb3', 'G3', 'Bb3'],
      ['F3', 'Ab3', 'C4'],
      ['Bb2', 'D3', 'F3']
    ],
    bassline: ['F2', 'Eb2', 'F2', 'Bb1'],
    lyrics: [
      "Well, you can tell by the way I use my walk, I'm a woman's man, no time to talk",
      "Music loud and women warm, I've been kicked around since I was born",
      "And now it's all right, it's okay, and you may look the other way",
      "Ah, ha, ha, ha, stayin' alive, stayin' alive!"
    ]
  },
  {
    id: "pop_rolling",
    category: "pop",
    subCategory: "pop_modern",
    composer: "Adele",
    name: "Rolling in the Deep",
    emoji: "🌊",
    year: "2010",
    era: "Contemporary Pop",
    description: "Soulful, pounding gospel-pop masterpiece. Deeply cathartic for emotional release, vocal power, and inner grounding.",
    benefits: "Catharsis, emotional release & diaphragm opening",
    brainwave: "Beta (13-30 Hz)",
    defaultInstrument: "piano",
    tempo: 105,
    keySignature: "C Minor",
    bgGradient: "from-teal-400 to-emerald-700",
    cardColor: "border-teal-200 bg-teal-50/50 text-teal-950",
    notes: [
      { note: 'C5', dur: 0.4 }, { note: 'C5', dur: 0.4 }, { note: 'C5', dur: 0.4 }, { note: 'B4', dur: 0.4 },
      { note: 'B4', dur: 0.4 }, { note: 'A4', dur: 0.4 }, { note: 'A4', dur: 0.4 }, { note: 'G4', dur: 0.4 },
      { note: 'G4', dur: 0.6 }, { note: 'REST', dur: 0.4 }
    ],
    chords: [
      ['C3', 'Eb3', 'G3'],
      ['G2', 'B2', 'D3'],
      ['Bb2', 'D3', 'F3'],
      ['Ab2', 'C3', 'Eb3']
    ],
    bassline: ['C2', 'G1', 'Bb1', 'Ab1'],
    lyrics: [
      "There's a fire starting in my heart, reaching a fever pitch bringing me out the dark",
      "Finally I can see you crystal clear, go ahead and sell me out and I'll lay your ship bare",
      "We could have had it all, rolling in the deep!",
      "You had my heart inside of your hand, and you played it to the beat"
    ]
  },
  {
    id: "pop_billiejean",
    category: "pop",
    subCategory: "pop_modern",
    composer: "Michael Jackson",
    name: "Billie Jean",
    emoji: "👞",
    year: "1982",
    era: "Contemporary Pop",
    description: "The quintessential bassline and synth-funk groove. Crisp, tight, and mentally organizing for high spatial awareness.",
    benefits: "Precision, rhythmic sharpness & focus sharpening",
    brainwave: "Beta (13-30 Hz)",
    defaultInstrument: "synth",
    tempo: 117,
    keySignature: "F# Minor",
    bgGradient: "from-slate-700 to-stone-900",
    cardColor: "border-stone-300 bg-stone-50/50 text-stone-950",
    notes: [
      { note: 'F#3', dur: 0.3 }, { note: 'C#4', dur: 0.3 }, { note: 'E4', dur: 0.3 }, { note: 'F#4', dur: 0.3 },
      { note: 'E4', dur: 0.3 }, { note: 'C#4', dur: 0.3 }, { note: 'B3', dur: 0.3 }, { note: 'C#4', dur: 0.5 },
      { note: 'REST', dur: 0.4 }
    ],
    chords: [
      ['F#2', 'A2', 'C#3'],
      ['B2', 'D#3', 'F#3'],
      ['A2', 'C#3', 'E3'],
      ['G#2', 'B2', 'D#3']
    ],
    bassline: ['F#2', 'C#2', 'E2', 'F#2'],
    lyrics: [
      "She was more like a beauty queen from a movie scene",
      "I said don't mind, but what do you mean, I am the one",
      "Who will dance on the floor in the round?",
      "Billie Jean is not my lover, she's just a girl who claims that I am the one"
    ]
  },
  {
    id: "pop_dontstart",
    category: "pop",
    subCategory: "pop_modern",
    composer: "Dua Lipa",
    name: "Don't Start Now",
    emoji: "💃",
    year: "2019",
    era: "Contemporary Pop",
    description: "The shimmering modern nu-disco hit. Fast, agile basslines that trigger quick cognitive processing and joyful body movement.",
    benefits: "Processing speed, dopamine uplift & mental agility",
    brainwave: "Beta (13-30 Hz)",
    defaultInstrument: "synth",
    tempo: 124,
    keySignature: "E Minor",
    bgGradient: "from-emerald-400 to-cyan-600",
    cardColor: "border-emerald-200 bg-emerald-50/50 text-emerald-950",
    notes: [
      { note: 'B4', dur: 0.25 }, { note: 'B4', dur: 0.25 }, { note: 'A4', dur: 0.25 }, { note: 'B4', dur: 0.25 },
      { note: 'D5', dur: 0.25 }, { note: 'B4', dur: 0.25 }, { note: 'A4', dur: 0.25 }, { note: 'G4', dur: 0.25 },
      { note: 'A4', dur: 0.25 }, { note: 'B4', dur: 0.5 }, { note: 'REST', dur: 0.4 }
    ],
    chords: [
      ['E3', 'G3', 'B3'],
      ['B2', 'D3', 'F#3'],
      ['A2', 'C3', 'E3'],
      ['D3', 'F#3', 'A3']
    ],
    bassline: ['E2', 'B1', 'A1', 'D2'],
    lyrics: [
      "Did a full 180, crazy, thinking 'bout the way I was",
      "Did the heartbreak change me? Maybe, but look at where I ended up",
      "Don't show up, don't start caring about me now, walk away, you know how",
      "Don't start now!"
    ]
  },
  {
    id: "pop_takeonme",
    category: "pop",
    subCategory: "pop_modern",
    composer: "A-ha",
    name: "Take On Me",
    emoji: "✍️",
    year: "1984",
    era: "Contemporary Pop",
    description: "The soaring, nostalgic 80s synth-pop anthem. Optimistic, airy, and exceptionally joyful.",
    benefits: "Cognitive elevation, positivity & memory boost",
    brainwave: "Beta (13-30 Hz)",
    defaultInstrument: "synth",
    tempo: 168,
    keySignature: "A Minor",
    bgGradient: "from-violet-400 to-indigo-700",
    cardColor: "border-violet-200 bg-violet-50/50 text-violet-950",
    notes: [
      { note: 'B4', dur: 0.3 }, { note: 'B4', dur: 0.3 }, { note: 'G4', dur: 0.3 }, { note: 'E4', dur: 0.3 },
      { note: 'E4', dur: 0.3 }, { note: 'A4', dur: 0.3 }, { note: 'A4', dur: 0.3 }, { note: 'A4', dur: 0.3 },
      { note: 'B4', dur: 0.3 }, { note: 'C#5', dur: 0.3 }, { note: 'D5', dur: 0.3 }, { note: 'REST', dur: 0.4 }
    ],
    chords: [
      ['A2', 'C3', 'E3'],
      ['D3', 'F#3', 'A3'],
      ['G2', 'B2', 'D3'],
      ['C3', 'E3', 'G3']
    ],
    bassline: ['A1', 'D2', 'G1', 'C2'],
    lyrics: [
      "We're talking away, I don't know what I'm to say",
      "I'll say it anyway, today's another day to find you",
      "Take on me! (take on me), Take me on! (take on me)",
      "I'll be gone in a day or two!"
    ]
  },
  {
    id: "pop_bohemian",
    category: "pop",
    subCategory: "pop_modern",
    composer: "Queen (Freddie Mercury)",
    name: "Bohemian Rhapsody",
    emoji: "👑",
    year: "1975",
    era: "Contemporary Pop",
    description: "The operatic rock masterpiece. Seamlessly blending classical choral harmony, ballad vulnerability, and blazing rock vitality.",
    benefits: "Creative divergent thinking, vocal freedom & emotional catharsis",
    brainwave: "Gamma (30-50 Hz)",
    defaultInstrument: "piano",
    tempo: 72,
    keySignature: "Bb Major / Eb Major",
    bgGradient: "from-purple-600 to-amber-600",
    cardColor: "border-purple-200 bg-purple-50/50 text-purple-950",
    notes: [
      { note: 'Bb3', dur: 0.5 }, { note: 'D4', dur: 0.5 }, { note: 'F4', dur: 0.5 }, { note: 'G4', dur: 0.5 },
      { note: 'F4', dur: 0.5 }, { note: 'Eb4', dur: 0.5 }, { note: 'D4', dur: 0.5 }, { note: 'C4', dur: 0.5 },
      { note: 'Bb3', dur: 1.0 }, { note: 'REST', dur: 0.5 }
    ],
    chords: [
      ['Bb2', 'D3', 'F3'],
      ['G2', 'Bb2', 'D3'],
      ['C3', 'Eb3', 'G3'],
      ['F2', 'A2', 'C3']
    ],
    bassline: ['Bb1', 'G1', 'C2', 'F1'],
    lyrics: [
      "Is this the real life? Is this just fantasy?",
      "Caught in a landslide, no escape from reality",
      "Open your eyes, look up to the skies and see!",
      "I'm just a poor boy, I need no sympathy"
    ]
  },
  {
    id: "pop_vivalavida",
    category: "pop",
    subCategory: "pop_modern",
    composer: "Coldplay",
    name: "Viva La Vida",
    emoji: "🎻",
    year: "2008",
    era: "Contemporary Pop",
    description: "Baroque-pop masterpiece powered by rhythmic string ostinatos, marching timpanis, and majestic choir hums.",
    benefits: "Historical perspective, resilience & uplifting vigor",
    brainwave: "Alpha (8-12 Hz)",
    defaultInstrument: "violin",
    tempo: 138,
    keySignature: "Ab Major",
    bgGradient: "from-amber-400 to-rose-600",
    cardColor: "border-amber-200 bg-amber-50/50 text-amber-950",
    notes: [
      { note: 'C5', dur: 0.25 }, { note: 'Db5', dur: 0.25 }, { note: 'Eb5', dur: 0.5 },
      { note: 'Db5', dur: 0.25 }, { note: 'C5', dur: 0.25 }, { note: 'Bb4', dur: 0.5 },
      { note: 'Ab4', dur: 0.5 }, { note: 'C5', dur: 0.5 }, { note: 'Bb4', dur: 1.0 }
    ],
    chords: [
      ['Db3', 'F3', 'Ab3'],
      ['Eb3', 'G3', 'Bb3'],
      ['Ab2', 'C3', 'Eb3'],
      ['F2', 'Ab2', 'C3']
    ],
    bassline: ['Db2', 'Eb2', 'Ab1', 'F1'],
    lyrics: [
      "I used to rule the world, seas would rise when I gave the word",
      "Now in the morning I sleep alone, sweep the streets I used to own",
      "I hear Jerusalem bells a-ringing, Roman cavalry choirs are singing",
      "Be my mirror, my sword and shield, my missionaries in a foreign field"
    ]
  },
  {
    id: "pop_dancingqueen",
    category: "pop",
    subCategory: "pop_modern",
    composer: "ABBA",
    name: "Dancing Queen",
    emoji: "👑",
    year: "1976",
    era: "Contemporary Pop",
    description: "The gold standard of europop euphoria. Shimmering piano glissandos and infectious bass hooks that release instant serotonin.",
    benefits: "Instant happiness, celebration & spontaneous dance",
    brainwave: "Alpha (8-12 Hz)",
    defaultInstrument: "piano",
    tempo: 100,
    keySignature: "A Major",
    bgGradient: "from-sky-400 to-pink-500",
    cardColor: "border-pink-200 bg-pink-50/50 text-pink-950",
    notes: [
      { note: 'C#5', dur: 0.5 }, { note: 'B4', dur: 0.25 }, { note: 'A4', dur: 0.5 },
      { note: 'F#4', dur: 0.25 }, { note: 'A4', dur: 0.5 }, { note: 'B4', dur: 0.5 },
      { note: 'C#5', dur: 0.75 }, { note: 'A4', dur: 0.5 }
    ],
    chords: [
      ['A2', 'C#3', 'E3'],
      ['D3', 'F#3', 'A3'],
      ['A2', 'C#3', 'E3'],
      ['E2', 'G#2', 'B2']
    ],
    bassline: ['A1', 'D2', 'A1', 'E1'],
    lyrics: [
      "You can dance, you can jive, having the time of your life",
      "See that girl, watch that scene, digging the Dancing Queen!",
      "Friday night and the lights are low, looking out for a place to go",
      "Where they play the right music, getting in the swing!"
    ]
  },
  {
    id: "pop_antihero",
    category: "pop",
    subCategory: "pop_modern",
    composer: "Taylor Swift",
    name: "Anti-Hero",
    emoji: "🪞",
    year: "2022",
    era: "Contemporary Pop",
    description: "Self-reflective synth-pop hit. Crisp 80s drum machines and vulnerable melodies supporting self-acceptance and honest introspection.",
    benefits: "Self-acceptance, psychological grounding & honest reflection",
    brainwave: "Alpha (8-12 Hz)",
    defaultInstrument: "synth",
    tempo: 97,
    keySignature: "E Major",
    bgGradient: "from-purple-400 to-indigo-600",
    cardColor: "border-purple-200 bg-purple-50/50 text-purple-950",
    notes: [
      { note: 'G#4', dur: 0.25 }, { note: 'G#4', dur: 0.25 }, { note: 'F#4', dur: 0.25 }, { note: 'E4', dur: 0.25 },
      { note: 'G#4', dur: 0.25 }, { note: 'G#4', dur: 0.25 }, { note: 'F#4', dur: 0.25 }, { note: 'E4', dur: 0.25 },
      { note: 'B4', dur: 0.5 }, { note: 'G#4', dur: 0.5 }, { note: 'F#4', dur: 0.75 }
    ],
    chords: [
      ['E3', 'G#3', 'B3'],
      ['C#3', 'E3', 'G#3'],
      ['A2', 'C#3', 'E3'],
      ['B2', 'D#3', 'F#3']
    ],
    bassline: ['E2', 'C#2', 'A1', 'B1'],
    lyrics: [
      "It's me, hi, I'm the problem, it's me",
      "At tea time, everybody agrees",
      "I'll stare directly at the sun but never in the mirror",
      "It must be exhausting always rooting for the anti-hero"
    ]
  }
];

export const POP_CHORDS_MAP: Record<string, string[][]> = ALL_SYMPHONIES.reduce((acc, curr) => {
  acc[curr.id] = curr.chords;
  return acc;
}, {} as Record<string, string[][]>);

export const POP_BASSLINES_MAP: Record<string, string[]> = ALL_SYMPHONIES.reduce((acc, curr) => {
  acc[curr.id] = curr.bassline;
  return acc;
}, {} as Record<string, string[]>);
