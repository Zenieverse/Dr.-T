import { TutorModule } from '../types/grandPianoTypes';

export const PIANO_TUTOR_MODULES: TutorModule[] = [
  // ========================================================
  // MODULE 1: POSTURE, HAND ARCH & 5-FINGER GEOGRAPHY
  // ========================================================
  {
    id: 'module-1-posture-geography',
    orderNumber: 1,
    title: 'Module 1: Meet Your Concert Grand & Hand Shape',
    subtitle: 'Natural Hand Arch, Finger Numbers 1–5 & Middle C Anchor',
    level: 'Beginner',
    estimatedMinutes: 6,
    summary: 'Sit tall, drop your shoulders, curve your fingers like holding a peach, and locate the central anchor of the keyboard: Middle C.',
    badgeName: 'Grand Posture & Middle C Anchor',
    steps: [
      {
        stepId: 'm1-step-1-posture',
        moduleId: 'module-1-posture-geography',
        stepNumber: 1,
        title: 'Step 1: The Virtuoso Posture & Hand Arch',
        subtitle: 'Shoulders relaxed, forearms parallel, fingers curved naturally',
        theoryExplanation: 'Great piano playing begins with zero physical tension. Sit on the front half of your bench with feet flat on the floor. Let your arms hang loosely from your shoulders. Form a gentle curve in your fingers as if you are gently cupping a tennis ball or ripe peach. Strike the keys using the fleshy pads of your fingertips, not the nails or flat finger joints.',
        coachAdvice: 'Keep wrists flexible and level with your forearms. Never collapse your knuckles downward into the keys.',
        targetHand: 'RH',
        suggestedFingers: [1, 2, 3],
        demonstrationNotes: [
          { note: 'C4', durationSec: 1.0, hand: 'RH' }
        ],
        targetExpectedNotes: ['C4'],
        clef: 'treble',
        keySignature: 'C Major',
        timeSignature: '4/4',
        tempoBpm: 60,
        xpAward: 15
      },
      {
        stepId: 'm1-step-2-finger-numbers',
        moduleId: 'module-1-posture-geography',
        stepNumber: 2,
        title: 'Step 2: Universal Piano Fingering (1 to 5)',
        subtitle: '1=Thumb, 2=Index, 3=Middle, 4=Ring, 5=Pinky',
        theoryExplanation: 'In piano sheet music worldwide, fingers are numbered symmetrically from 1 to 5 for both hands: 1 is the Thumb, 2 is the Index finger, 3 is the Middle finger, 4 is the Ring finger, and 5 is the Pinky. This numerical code allows composers to prescribe effortless hand positioning for fast runs and intricate counterpoint.',
        coachAdvice: 'Notice how finger 1 (Thumb) strikes with its side edge, while fingers 2 through 5 strike directly with their curved tips.',
        targetHand: 'RH',
        suggestedFingers: [1, 2, 3, 4, 5],
        demonstrationNotes: [
          { note: 'C4', durationSec: 0.6, hand: 'RH' },
          { note: 'D4', durationSec: 0.6, hand: 'RH' },
          { note: 'E4', durationSec: 0.6, hand: 'RH' },
          { note: 'F4', durationSec: 0.6, hand: 'RH' },
          { note: 'G4', durationSec: 0.8, hand: 'RH' }
        ],
        targetExpectedNotes: ['C4', 'D4', 'E4', 'F4', 'G4'],
        clef: 'treble',
        keySignature: 'C Major',
        timeSignature: '4/4',
        tempoBpm: 70,
        xpAward: 20
      },
      {
        stepId: 'm1-step-3-middle-c-anchor',
        moduleId: 'module-1-posture-geography',
        stepNumber: 3,
        title: 'Step 3: Finding Middle C (The Twin Black Keys)',
        subtitle: 'The center of gravity of the 88-key grand piano',
        theoryExplanation: 'Look across the keyboard: black keys alternate in groups of TWO and THREE. Find any group of TWO black keys. The white key located immediately to their left is ALWAYS a "C". Middle C (labeled C4) is the C situated closest to the middle of the keyboard, right beneath the grand piano brand logo.',
        coachAdvice: 'Whenever you feel lost, glance at the two black keys. The key on the left is always your home base C.',
        targetHand: 'RH',
        suggestedFingers: [1],
        demonstrationNotes: [
          { note: 'C4', durationSec: 1.2, hand: 'RH' }
        ],
        targetExpectedNotes: ['C4'],
        clef: 'treble',
        keySignature: 'C Major',
        timeSignature: '4/4',
        tempoBpm: 60,
        xpAward: 15
      },
      {
        stepId: 'm1-step-4-c-major-5-finger-scale',
        moduleId: 'module-1-posture-geography',
        stepNumber: 4,
        title: 'Step 4: The 5-Finger Position on C (C–D–E–F–G)',
        subtitle: 'Right Hand thumb on C4, pinky on G4',
        theoryExplanation: 'Rest your right hand in the C 5-finger pattern: Finger 1 on C4, Finger 2 on D4, Finger 3 on E4, Finger 4 on F4, and Finger 5 on G4. Play them in order from thumb to pinky with a smooth, connected (legato) touch, letting one note release exactly as the next note sounds.',
        coachAdvice: 'Press one key at a time. Do not let fingers fly up into the air; keep all 5 fingertips resting gently on their keys.',
        targetHand: 'RH',
        suggestedFingers: [1, 2, 3, 4, 5],
        demonstrationNotes: [
          { note: 'C4', durationSec: 0.6, hand: 'RH' },
          { note: 'D4', durationSec: 0.6, hand: 'RH' },
          { note: 'E4', durationSec: 0.6, hand: 'RH' },
          { note: 'F4', durationSec: 0.6, hand: 'RH' },
          { note: 'G4', durationSec: 0.8, hand: 'RH' }
        ],
        targetExpectedNotes: ['C4', 'D4', 'E4', 'F4', 'G4'],
        clef: 'treble',
        keySignature: 'C Major',
        timeSignature: '4/4',
        tempoBpm: 76,
        xpAward: 25
      }
    ]
  },

  // ========================================================
  // MODULE 2: THE MUSICAL ALPHABET & KEYBOARD LANDMARKS
  // ========================================================
  {
    id: 'module-2-alphabet-landmarks',
    orderNumber: 2,
    title: 'Module 2: The Musical Alphabet & Landmarks',
    subtitle: 'A–B–C–D–E–F–G, Black Key Twins & Triplets',
    level: 'Beginner',
    estimatedMinutes: 7,
    summary: 'Master the 7 natural notes of music, navigate black key groups of 2 and 3 effortlessly, and find every octave landmark across the full piano.',
    badgeName: 'Keyboard Navigator Badge',
    steps: [
      {
        stepId: 'm2-step-1-seven-notes',
        moduleId: 'module-2-alphabet-landmarks',
        stepNumber: 1,
        title: 'Step 1: The 7 Natural Letter Names',
        subtitle: 'A, B, C, D, E, F, G (and then it loops back to A!)',
        theoryExplanation: 'Unlike the spoken alphabet of 26 letters, the musical alphabet has only 7 letters: A, B, C, D, E, F, G. After G, it immediately loops back around to A at a higher pitch (one octave higher). Moving to the RIGHT goes forward in the alphabet (ascending pitch); moving to the LEFT goes backward in the alphabet (descending pitch).',
        coachAdvice: 'Recite the alphabet backward: G - F - E - D - C - B - A. Knowing the alphabet in reverse is crucial for reading descending melodies!',
        targetHand: 'RH',
        suggestedFingers: [1, 2, 3, 1, 2, 3, 4],
        demonstrationNotes: [
          { note: 'C4', durationSec: 0.5, hand: 'RH' },
          { note: 'D4', durationSec: 0.5, hand: 'RH' },
          { note: 'E4', durationSec: 0.5, hand: 'RH' },
          { note: 'F4', durationSec: 0.5, hand: 'RH' },
          { note: 'G4', durationSec: 0.5, hand: 'RH' },
          { note: 'A4', durationSec: 0.5, hand: 'RH' },
          { note: 'B4', durationSec: 0.5, hand: 'RH' }
        ],
        targetExpectedNotes: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'],
        clef: 'treble',
        keySignature: 'C Major',
        timeSignature: '4/4',
        tempoBpm: 80,
        xpAward: 20
      },
      {
        stepId: 'm2-step-2-twin-triplet-landmarks',
        moduleId: 'module-2-alphabet-landmarks',
        stepNumber: 2,
        title: 'Step 2: Black Key Twins (C-D-E) & Triplets (F-G-A-B)',
        subtitle: 'Visual landmarks that make searching white keys instant',
        theoryExplanation: 'Memorize these two landmark rules:\n1. The TWO black keys (Twins) frame C, D, and E. D sits right in the middle between the twins.\n2. The THREE black keys (Triplets) frame F, G, A, and B. F is to the left of the triplets; B is to the right of the triplets.',
        coachAdvice: 'Look at the keyboard without looking at note names. Can you instantly touch D? Just spot the twin black keys and land in the center!',
        targetHand: 'RH',
        suggestedFingers: [2],
        demonstrationNotes: [
          { note: 'D4', durationSec: 0.8, hand: 'RH' },
          { note: 'F4', durationSec: 0.8, hand: 'RH' },
          { note: 'B4', durationSec: 0.8, hand: 'RH' }
        ],
        targetExpectedNotes: ['D4', 'F4', 'B4'],
        clef: 'treble',
        keySignature: 'C Major',
        timeSignature: '3/4',
        tempoBpm: 70,
        xpAward: 20
      },
      {
        stepId: 'm2-step-3-octave-landmarks',
        moduleId: 'module-2-alphabet-landmarks',
        stepNumber: 3,
        title: 'Step 3: The Grand Octave Hop (Bass C3 to Treble C5)',
        subtitle: 'An octave spans 8 white keys from one C to the next',
        theoryExplanation: 'An "Octave" (from the Latin "octavus" meaning eighth) is the interval distance between any note and the next note of the same name above or below it. C3 (Low/Bass C), C4 (Middle C), and C5 (Treble High C) sound like the exact same musical pitch color, only deeper or higher in pitch.',
        coachAdvice: 'Practice leaping your hand from C3 to C4 to C5. Feel the open arm motion!',
        targetHand: 'both',
        suggestedFingers: [5, 1, 5],
        demonstrationNotes: [
          { note: 'C3', durationSec: 0.8, hand: 'LH' },
          { note: 'C4', durationSec: 0.8, hand: 'RH' },
          { note: 'C5', durationSec: 1.0, hand: 'RH' }
        ],
        targetExpectedNotes: ['C3', 'C4', 'C5'],
        clef: 'grand',
        keySignature: 'C Major',
        timeSignature: '3/4',
        tempoBpm: 70,
        xpAward: 25
      }
    ]
  },

  // ========================================================
  // MODULE 3: READING THE GRAND STAFF
  // ========================================================
  {
    id: 'module-3-grand-staff',
    orderNumber: 3,
    title: 'Module 3: Reading the Grand Staff',
    subtitle: 'Treble Clef, Bass Clef, Line Notes & Space Notes',
    level: 'Beginner',
    estimatedMinutes: 8,
    summary: 'Decode the universal language of written music: the 5 lines and 4 spaces of the Treble and Bass staves joined by Middle C.',
    badgeName: 'Staff Sight-Reader Badge',
    steps: [
      {
        stepId: 'm3-step-1-treble-lines',
        moduleId: 'module-3-grand-staff',
        stepNumber: 1,
        title: 'Step 1: Treble Clef Lines (E–G–B–D–F)',
        subtitle: '"Every Good Boy Does Fine"',
        theoryExplanation: 'The Treble Clef (𝄞), also known as the G Clef, wraps around the second line from the bottom, defining it as G4. The five horizontal staff lines from bottom to top are: E4, G4, B4, D5, and F5. Remember the mnemonic: "Every Good Boy Does Fine" (or "Elvis\' Guitar Broke Down Friday").',
        coachAdvice: 'Notice that note heads sit directly centered on the staff lines with the line cutting straight through the middle of the note.',
        targetHand: 'RH',
        suggestedFingers: [1, 2, 3, 4, 5],
        demonstrationNotes: [
          { note: 'E4', durationSec: 0.6, hand: 'RH' },
          { note: 'G4', durationSec: 0.6, hand: 'RH' },
          { note: 'B4', durationSec: 0.6, hand: 'RH' },
          { note: 'D5', durationSec: 0.6, hand: 'RH' },
          { note: 'F5', durationSec: 0.8, hand: 'RH' }
        ],
        targetExpectedNotes: ['E4', 'G4', 'B4', 'D5', 'F5'],
        clef: 'treble',
        keySignature: 'C Major',
        timeSignature: '4/4',
        tempoBpm: 75,
        xpAward: 25
      },
      {
        stepId: 'm3-step-2-treble-spaces',
        moduleId: 'module-3-grand-staff',
        stepNumber: 2,
        title: 'Step 2: Treble Clef Spaces (F–A–C–E)',
        subtitle: 'It spells "F-A-C-E"!',
        theoryExplanation: 'Between the five lines are four spaces. From bottom to top, the space notes on the treble staff spell the word "FACE": F4 (bottom space), A4 (second space), C5 (third space), and E5 (top space). Combined with the line notes, music alternates: Line, Space, Line, Space, Line, Space...',
        coachAdvice: 'Whenever a note sits between two lines, check if it fits into F-A-C-E!',
        targetHand: 'RH',
        suggestedFingers: [1, 2, 3, 5],
        demonstrationNotes: [
          { note: 'F4', durationSec: 0.6, hand: 'RH' },
          { note: 'A4', durationSec: 0.6, hand: 'RH' },
          { note: 'C5', durationSec: 0.6, hand: 'RH' },
          { note: 'E5', durationSec: 0.8, hand: 'RH' }
        ],
        targetExpectedNotes: ['F4', 'A4', 'C5', 'E5'],
        clef: 'treble',
        keySignature: 'C Major',
        timeSignature: '4/4',
        tempoBpm: 75,
        xpAward: 25
      },
      {
        stepId: 'm3-step-3-bass-clef-anchor',
        moduleId: 'module-3-grand-staff',
        stepNumber: 3,
        title: 'Step 3: Bass Clef Anchor (C3–E3–G3)',
        subtitle: 'Left Hand bass lines and deep harmonic foundations',
        theoryExplanation: 'The Bass Clef (𝄢), or F Clef, has two dots centered around the fourth line, marking it as F3. The spaces from bottom to top spell "All Cows Eat Grass" (A2, C3, E3, G3). In the left hand, C3, E3, and G3 form the primary bass anchor for classical accompaniments.',
        coachAdvice: 'Use fingers 5 (Pinky on C3), 3 (Middle on E3), and 1 (Thumb on G3) to play this rich left-hand triad.',
        targetHand: 'LH',
        suggestedFingers: [5, 3, 1],
        demonstrationNotes: [
          { note: 'C3', durationSec: 0.8, hand: 'LH' },
          { note: 'E3', durationSec: 0.8, hand: 'LH' },
          { note: 'G3', durationSec: 1.0, hand: 'LH' }
        ],
        targetExpectedNotes: ['C3', 'E3', 'G3'],
        clef: 'bass',
        keySignature: 'C Major',
        timeSignature: '3/4',
        tempoBpm: 65,
        xpAward: 25
      }
    ]
  },

  // ========================================================
  // MODULE 4: RHYTHM, METER & METRONOME LOCK
  // ========================================================
  {
    id: 'module-4-rhythm-meter',
    orderNumber: 4,
    title: 'Module 4: Rhythm, Pulse & Metronome Lock',
    subtitle: 'Quarter, Half, Whole Notes & Steady Internal Clock',
    level: 'Beginner',
    estimatedMinutes: 7,
    summary: 'Transform mechanical notes into living music with time values: whole notes (4 beats), half notes (2 beats), and quarter notes (1 beat).',
    badgeName: 'Rhythm Engine Badge',
    steps: [
      {
        stepId: 'm4-step-1-note-values',
        moduleId: 'module-4-rhythm-meter',
        stepNumber: 1,
        title: 'Step 1: Whole, Half & Quarter Notes',
        subtitle: 'Whole = 4 beats • Half = 2 beats • Quarter = 1 beat',
        theoryExplanation: 'In 4/4 time:\n• Whole note (𝅝): Hollow circle with no stem. Lasts 4 full beats: "1 - 2 - 3 - 4".\n• Half note (𝅗𝅥): Hollow circle with a stem. Lasts 2 beats: "1 - 2".\n• Quarter note (𝅘𝅥): Solid filled black circle with a stem. Lasts 1 beat: "1".\nCount out loud steadily as you play!',
        coachAdvice: 'Do not release a whole note early! Hold it firmly until beat 4 finishes.',
        targetHand: 'RH',
        suggestedFingers: [1, 2, 3],
        demonstrationNotes: [
          { note: 'C4', durationSec: 2.0, hand: 'RH' }, // 2 beats
          { note: 'E4', durationSec: 1.0, hand: 'RH' }, // 1 beat
          { note: 'G4', durationSec: 1.0, hand: 'RH' }  // 1 beat
        ],
        targetExpectedNotes: ['C4', 'E4', 'G4'],
        clef: 'treble',
        keySignature: 'C Major',
        timeSignature: '4/4',
        tempoBpm: 68,
        xpAward: 20
      },
      {
        stepId: 'm4-step-2-metronome-pulse',
        moduleId: 'module-4-rhythm-meter',
        stepNumber: 2,
        title: 'Step 2: Lock with the Metronome (4-Beat Stride)',
        subtitle: 'Strike exactly on the tick at 80 BPM',
        theoryExplanation: 'Musicians develop an unwavering "internal clock". When the metronome clicks, play precisely on the downbeat. Practice stepping four quarter notes in succession: C4 - D4 - E4 - C4 on beats 1, 2, 3, and 4.',
        coachAdvice: 'Listen for the metronome sound disappearing behind your key strike. When your strike perfectly aligns with the click, you have achieved metronomic lock!',
        targetHand: 'RH',
        suggestedFingers: [1, 2, 3, 1],
        demonstrationNotes: [
          { note: 'C4', durationSec: 0.75, hand: 'RH' },
          { note: 'D4', durationSec: 0.75, hand: 'RH' },
          { note: 'E4', durationSec: 0.75, hand: 'RH' },
          { note: 'C4', durationSec: 0.75, hand: 'RH' }
        ],
        targetExpectedNotes: ['C4', 'D4', 'E4', 'C4'],
        clef: 'treble',
        keySignature: 'C Major',
        timeSignature: '4/4',
        tempoBpm: 80,
        xpAward: 25
      }
    ]
  },

  // ========================================================
  // MODULE 5: INTERVALS & HARMONIC DISTANCE
  // ========================================================
  {
    id: 'module-5-intervals-harmony',
    orderNumber: 5,
    title: 'Module 5: Intervals & Ear Training',
    subtitle: 'Seconds, Thirds, Fifths & Octaves',
    level: 'Intermediate',
    estimatedMinutes: 8,
    summary: 'The distance between two notes creates tension, resolution, warmth, or power. Train your ear to distinguish steps from leaps.',
    badgeName: 'Interval Master Badge',
    steps: [
      {
        stepId: 'm5-step-1-seconds-and-thirds',
        moduleId: 'module-5-intervals-harmony',
        stepNumber: 1,
        title: 'Step 1: Steps (2nds) vs Skips (3rds)',
        subtitle: 'Line to Space is a Step; Line to Line is a 3rd',
        theoryExplanation: '• A Second (2nd): Moving to the very next neighbor note (e.g. C to D). On the staff, this is Line to Space or Space to Line.\n• A Third (3rd): Skipping one note (e.g. C to E). On the staff, this goes Line to Line or Space to Space! Thirds create sweet harmonic warmth.',
        coachAdvice: 'Sing the distance in your head: "C ... D" (step), then "C ... E" (skip).',
        targetHand: 'RH',
        suggestedFingers: [1, 2, 1, 3],
        demonstrationNotes: [
          { note: 'C4', durationSec: 0.6, hand: 'RH' },
          { note: 'D4', durationSec: 0.6, hand: 'RH' },
          { note: 'C4', durationSec: 0.6, hand: 'RH' },
          { note: 'E4', durationSec: 0.8, hand: 'RH' }
        ],
        targetExpectedNotes: ['C4', 'D4', 'C4', 'E4'],
        clef: 'treble',
        keySignature: 'C Major',
        timeSignature: '4/4',
        tempoBpm: 72,
        xpAward: 25
      },
      {
        stepId: 'm5-step-2-perfect-fifth-pillar',
        moduleId: 'module-5-intervals-harmony',
        stepNumber: 2,
        title: 'Step 2: The Perfect 5th & Octave Pillars',
        subtitle: 'The open, powerful interval that underpins all classical music',
        theoryExplanation: 'A Perfect 5th spans 5 letter names (e.g. C to G: C-D-E-F-G, 7 semitones). It contains pure acoustic resonance with zero dissonance. When sounded together, C and G form a bedrock power chord found in Beethoven symphonies and medieval chants.',
        coachAdvice: 'Play C4 and G4 together simultaneously with thumb and pinky.',
        targetHand: 'RH',
        suggestedFingers: [1, 5],
        demonstrationNotes: [
          { note: 'C4', durationSec: 1.5, hand: 'RH' },
          { note: 'G4', durationSec: 1.5, hand: 'RH' }
        ],
        targetExpectedNotes: ['C4', 'G4'],
        clef: 'treble',
        keySignature: 'C Major',
        timeSignature: '4/4',
        tempoBpm: 60,
        xpAward: 25
      }
    ]
  },

  // ========================================================
  // MODULE 6: CHORDS & LEFT-HAND ACCOMPANIMENT
  // ========================================================
  {
    id: 'module-6-chords-accompaniment',
    orderNumber: 6,
    title: 'Module 6: Chords & Left-Hand Accompaniment',
    subtitle: 'Major Triads, Arpeggios & The Alberti Bass',
    level: 'Intermediate',
    estimatedMinutes: 9,
    summary: 'Build three-note chords (triads) and master the accompaniment patterns used by Mozart, Haydn, and Bach.',
    badgeName: 'Harmonic Architect Badge',
    steps: [
      {
        stepId: 'm6-step-1-major-triad',
        moduleId: 'module-6-chords-accompaniment',
        stepNumber: 1,
        title: 'Step 1: The Tonic C Major Triad (I)',
        subtitle: 'Root (C) + Major 3rd (E) + Perfect 5th (G)',
        theoryExplanation: 'Stacking two thirds creates a Triad. The C Major Triad (C - E - G) is the "Tonic" or home chord (Roman numeral I) of C Major. Play the three notes together as a solid block chord, then play them broken (arpeggiated) one note at a time.',
        coachAdvice: 'Drop the weight of your arm gently into the keys so all three notes sound at the exact same millisecond.',
        targetHand: 'both',
        suggestedFingers: [5, 3, 1],
        demonstrationNotes: [
          { note: 'C3', durationSec: 1.2, hand: 'LH' },
          { note: 'E3', durationSec: 1.2, hand: 'LH' },
          { note: 'G3', durationSec: 1.2, hand: 'LH' },
          { note: 'C4', durationSec: 1.5, hand: 'RH' }
        ],
        targetExpectedNotes: ['C3', 'E3', 'G3', 'C4'],
        clef: 'grand',
        keySignature: 'C Major',
        timeSignature: '4/4',
        tempoBpm: 65,
        xpAward: 30
      },
      {
        stepId: 'm6-step-2-alberti-bass',
        moduleId: 'module-6-chords-accompaniment',
        stepNumber: 2,
        title: 'Step 2: The Classical Alberti Bass Pattern',
        subtitle: 'Bottom – Top – Middle – Top (C3 – G3 – E3 – G3)',
        theoryExplanation: 'Invented by Italian composer Domenico Alberti, this broken chord accompaniment pattern became Mozart and Haydn\'s trademark sound. Instead of striking chords simultaneously, the left hand rocks between Bottom (C3), Top (G3), Middle (E3), and Top (G3). This creates flowing rhythmic momentum without drowning out the melody!',
        coachAdvice: 'Keep the left hand light and whispery so the right hand melody can sing above it.',
        targetHand: 'LH',
        suggestedFingers: [5, 1, 3, 1],
        demonstrationNotes: [
          { note: 'C3', durationSec: 0.4, hand: 'LH' },
          { note: 'G3', durationSec: 0.4, hand: 'LH' },
          { note: 'E3', durationSec: 0.4, hand: 'LH' },
          { note: 'G3', durationSec: 0.4, hand: 'LH' }
        ],
        targetExpectedNotes: ['C3', 'G3', 'E3', 'G3'],
        clef: 'bass',
        keySignature: 'C Major',
        timeSignature: '4/4',
        tempoBpm: 88,
        xpAward: 35
      }
    ]
  },

  // ========================================================
  // MODULE 7: TOUCH, PEDALING & INTERPRETATION
  // ========================================================
  {
    id: 'module-7-touch-interpretation',
    orderNumber: 7,
    title: 'Module 7: Phrasing, Touch & Damper Pedaling',
    subtitle: 'Legato, Staccato, Dynamics & Syncopated Pedaling',
    level: 'Advanced',
    estimatedMinutes: 8,
    summary: 'Playing the piano is sculpting sound in time. Learn to phrase melodies like an opera singer and use the sustain pedal without harmonic mud.',
    badgeName: 'Cantabile Touch Badge',
    steps: [
      {
        stepId: 'm7-step-1-staccato-vs-legato',
        moduleId: 'module-7-touch-interpretation',
        stepNumber: 1,
        title: 'Step 1: Staccato (Crisp) vs Legato (Connected)',
        subtitle: 'A dot above the note means detach; a slur line means sing',
        theoryExplanation: '• Legato (Italian for "tied together"): Transfer weight from one finger to the next smoothly, like footsteps on soft grass.\n• Staccato (Italian for "detached"): Strike with a crisp springing bounce off the key, leaving clean silence between notes. In Mozart and Beethoven, staccatos add sparkle and wit.',
        coachAdvice: 'Imagine your fingertips are light springboards leaping off the keys for staccato.',
        targetHand: 'RH',
        suggestedFingers: [1, 2, 3, 4],
        demonstrationNotes: [
          { note: 'G4', durationSec: 0.2, hand: 'RH' },
          { note: 'E4', durationSec: 0.2, hand: 'RH' },
          { note: 'G4', durationSec: 0.2, hand: 'RH' },
          { note: 'C5', durationSec: 0.8, hand: 'RH' }
        ],
        targetExpectedNotes: ['G4', 'E4', 'G4', 'C5'],
        clef: 'treble',
        keySignature: 'C Major',
        timeSignature: '4/4',
        tempoBpm: 90,
        xpAward: 30
      },
      {
        stepId: 'm7-step-2-syncopated-pedaling',
        moduleId: 'module-7-touch-interpretation',
        stepNumber: 2,
        title: 'Step 2: Syncopated (Legato) Pedaling',
        subtitle: 'Clear the pedal immediately AFTER striking the new chord',
        theoryExplanation: 'The Damper Pedal (sustain pedal on the right) lifts all felt dampers off the strings, letting the entire acoustic piano resonate. To change chords without blurring dissonances together:\n1. Strike the new chord with your fingers.\n2. Immediately UP and DOWN with the pedal foot.\nThis catches the fresh harmony while erasing the ghost of the previous chord.',
        coachAdvice: 'Change pedal with your foot right after your fingers strike the new keys—never before!',
        targetHand: 'both',
        suggestedFingers: [5, 1],
        demonstrationNotes: [
          { note: 'C3', durationSec: 1.5, hand: 'LH' },
          { note: 'G3', durationSec: 1.5, hand: 'LH' },
          { note: 'E4', durationSec: 1.5, hand: 'RH' },
          { note: 'C5', durationSec: 1.5, hand: 'RH' }
        ],
        targetExpectedNotes: ['C3', 'G3', 'E4', 'C5'],
        clef: 'grand',
        keySignature: 'C Major',
        timeSignature: '4/4',
        tempoBpm: 60,
        xpAward: 35
      }
    ]
  },

  // ========================================================
  // MODULE 8: WHOLE MASTERPIECE RECITAL
  // ========================================================
  {
    id: 'module-8-masterpiece-recital',
    orderNumber: 8,
    title: 'Module 8: Whole Classical Masterpiece Recital',
    subtitle: 'From Practice to Full Concert Performance',
    level: 'Virtuoso',
    estimatedMinutes: 12,
    summary: 'Apply all theory, geography, notation, and touch to play iconic classical tracks from start to finish. Earn your Grand Piano Virtuoso Diploma.',
    badgeName: 'Concert Virtuoso Diploma',
    steps: [
      {
        stepId: 'm8-step-1-fur-elise-opening',
        moduleId: 'module-8-masterpiece-recital',
        stepNumber: 1,
        title: 'Recital Challenge: Beethoven\'s Für Elise Theme',
        subtitle: 'The iconic E5–D#5–E5 semitone flutter & A minor cascade',
        theoryExplanation: 'Beethoven composed this Bagatelle in 1810. The opening motive swings between E5 and D#5 with fingers 5 and 4, then drops down to B4, steps up to D5 and C5, resolving onto A4 over an arpeggiated A-minor bass chord (A2 - E3 - A3). Play this phrase with delicate, singing cantabile touch.',
        coachAdvice: 'Start softly (pianissimo). Let the semitone flutter whisper gently like a secret confession.',
        targetHand: 'both',
        suggestedFingers: [5, 4, 5, 4, 5, 1, 3, 2, 1],
        demonstrationNotes: [
          { note: 'E5', durationSec: 0.25, hand: 'RH' },
          { note: 'D#5', durationSec: 0.25, hand: 'RH' },
          { note: 'E5', durationSec: 0.25, hand: 'RH' },
          { note: 'D#5', durationSec: 0.25, hand: 'RH' },
          { note: 'E5', durationSec: 0.25, hand: 'RH' },
          { note: 'B4', durationSec: 0.25, hand: 'RH' },
          { note: 'D5', durationSec: 0.25, hand: 'RH' },
          { note: 'C5', durationSec: 0.25, hand: 'RH' },
          { note: 'A4', durationSec: 0.8, hand: 'RH' }
        ],
        targetExpectedNotes: ['E5', 'D#5', 'E5', 'D#5', 'E5', 'B4', 'D5', 'C5', 'A4'],
        clef: 'treble',
        keySignature: 'A Minor',
        timeSignature: '3/8',
        tempoBpm: 128,
        xpAward: 50
      },
      {
        stepId: 'm8-step-2-bach-prelude-arpeggio',
        moduleId: 'module-8-masterpiece-recital',
        stepNumber: 2,
        title: 'Recital Challenge: J.S. Bach Prelude in C Major',
        subtitle: 'The Well-Tempered Clavier BWV 846 Measure 1',
        theoryExplanation: 'Bach opens his monumental collection with an arpeggiated wave in C Major: Left hand holds C3 and E3, while Right Hand rolls upward across G3, C4, E4 twice. Every note sustains to form a resonant stained-glass acoustic cathedral.',
        coachAdvice: 'Play with completely steady 16th-note rhythm. Keep the wave fluid like moving water.',
        targetHand: 'both',
        suggestedFingers: [5, 3, 1, 2, 5],
        demonstrationNotes: [
          { note: 'C3', durationSec: 1.5, hand: 'LH' },
          { note: 'E3', durationSec: 1.5, hand: 'LH' },
          { note: 'G3', durationSec: 0.35, hand: 'RH' },
          { note: 'C4', durationSec: 0.35, hand: 'RH' },
          { note: 'E4', durationSec: 0.35, hand: 'RH' },
          { note: 'G3', durationSec: 0.35, hand: 'RH' },
          { note: 'C4', durationSec: 0.35, hand: 'RH' },
          { note: 'E4', durationSec: 0.35, hand: 'RH' }
        ],
        targetExpectedNotes: ['C3', 'E3', 'G3', 'C4', 'E4'],
        clef: 'grand',
        keySignature: 'C Major',
        timeSignature: '4/4',
        tempoBpm: 68,
        xpAward: 50
      }
    ]
  }
];
