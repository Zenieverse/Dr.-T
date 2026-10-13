import { WholeClassicalTrack } from '../types/grandPianoTypes';

export const WHOLE_CLASSICAL_TRACKS: WholeClassicalTrack[] = [
  // ========================================================
  // 1. BEETHOVEN: FÜR ELISE (COMPLETE ICONIC THEME)
  // ========================================================
  {
    trackId: 'track-fur-elise-complete',
    workId: 'beethoven-fur-elise',
    title: 'Für Elise, WoO 59 (Complete Main Theme)',
    composer: 'Ludwig van Beethoven',
    opusCatalog: 'WoO 59',
    keySignature: 'A Minor',
    timeSignature: '3/8',
    tempoBpm: 130,
    tempoMarking: 'Poco moto (♩. = 44)',
    difficulty: 'Intermediate',
    measuresTotal: 16,
    totalDurationSeconds: 42,
    coverGradient: 'from-amber-950 via-stone-900 to-rose-950',
    historicalContext: 'Discovered by Ludwig Nohl in 1867, forty years after Beethoven\'s death. The manuscript was inscribed "Für Elise am 27 April zur Erinnerung von L. v. Bthvn" (For Elise on April 27 in memory from L. v. Beethoven).',
    notes: [
      // Measure 1: Semitone flutter pickup
      { id: 'fe-1', note_name: 'E5', midi_number: 76, onset_time_sec: 0.0, duration_sec: 0.22, velocity: 0.8, hand: 'RH', measure: 1, beat: 1, finger_hint: 5 },
      { id: 'fe-2', note_name: 'D#5', midi_number: 75, onset_time_sec: 0.23, duration_sec: 0.22, velocity: 0.78, hand: 'RH', measure: 1, beat: 2, finger_hint: 4 },
      { id: 'fe-3', note_name: 'E5', midi_number: 76, onset_time_sec: 0.45, duration_sec: 0.22, velocity: 0.8, hand: 'RH', measure: 1, beat: 3, finger_hint: 5 },
      // Measure 2
      { id: 'fe-4', note_name: 'D#5', midi_number: 75, onset_time_sec: 0.68, duration_sec: 0.22, velocity: 0.78, hand: 'RH', measure: 2, beat: 1, finger_hint: 4 },
      { id: 'fe-5', note_name: 'E5', midi_number: 76, onset_time_sec: 0.9, duration_sec: 0.22, velocity: 0.8, hand: 'RH', measure: 2, beat: 2, finger_hint: 5 },
      { id: 'fe-6', note_name: 'B4', midi_number: 71, onset_time_sec: 1.13, duration_sec: 0.22, velocity: 0.75, hand: 'RH', measure: 2, beat: 3, finger_hint: 1 },
      // Measure 3
      { id: 'fe-7', note_name: 'D5', midi_number: 74, onset_time_sec: 1.35, duration_sec: 0.22, velocity: 0.78, hand: 'RH', measure: 3, beat: 1, finger_hint: 3 },
      { id: 'fe-8', note_name: 'C5', midi_number: 72, onset_time_sec: 1.58, duration_sec: 0.22, velocity: 0.8, hand: 'RH', measure: 3, beat: 2, finger_hint: 2 },
      { id: 'fe-9', note_name: 'A4', midi_number: 69, onset_time_sec: 1.8, duration_sec: 0.55, velocity: 0.82, hand: 'RH', measure: 3, beat: 3, finger_hint: 1 },
      // Measure 4: LH A-minor arpeggio
      { id: 'fe-10', note_name: 'A2', midi_number: 45, onset_time_sec: 1.8, duration_sec: 0.6, velocity: 0.8, hand: 'LH', measure: 3, beat: 3, finger_hint: 5 },
      { id: 'fe-11', note_name: 'E3', midi_number: 52, onset_time_sec: 2.1, duration_sec: 0.45, velocity: 0.75, hand: 'LH', measure: 4, beat: 1, finger_hint: 2 },
      { id: 'fe-12', note_name: 'A3', midi_number: 57, onset_time_sec: 2.35, duration_sec: 0.45, velocity: 0.75, hand: 'LH', measure: 4, beat: 2, finger_hint: 1 },
      // Measure 4 RH C4 - E4 - A4
      { id: 'fe-13', note_name: 'C4', midi_number: 60, onset_time_sec: 2.6, duration_sec: 0.22, velocity: 0.75, hand: 'RH', measure: 4, beat: 3, finger_hint: 1 },
      { id: 'fe-14', note_name: 'E4', midi_number: 64, onset_time_sec: 2.82, duration_sec: 0.22, velocity: 0.78, hand: 'RH', measure: 5, beat: 1, finger_hint: 2 },
      { id: 'fe-15', note_name: 'A4', midi_number: 69, onset_time_sec: 3.05, duration_sec: 0.22, velocity: 0.8, hand: 'RH', measure: 5, beat: 2, finger_hint: 4 },
      // Measure 5 RH B4
      { id: 'fe-16', note_name: 'B4', midi_number: 71, onset_time_sec: 3.28, duration_sec: 0.55, velocity: 0.82, hand: 'RH', measure: 5, beat: 3, finger_hint: 5 },
      // Measure 5 LH E-major chord
      { id: 'fe-17', note_name: 'E2', midi_number: 40, onset_time_sec: 3.28, duration_sec: 0.6, velocity: 0.8, hand: 'LH', measure: 5, beat: 3, finger_hint: 5 },
      { id: 'fe-18', note_name: 'E3', midi_number: 52, onset_time_sec: 3.55, duration_sec: 0.45, velocity: 0.75, hand: 'LH', measure: 6, beat: 1, finger_hint: 2 },
      { id: 'fe-19', note_name: 'G#3', midi_number: 56, onset_time_sec: 3.8, duration_sec: 0.45, velocity: 0.75, hand: 'LH', measure: 6, beat: 2, finger_hint: 1 },
      // Measure 6 RH E4 - G#4 - B4
      { id: 'fe-20', note_name: 'E4', midi_number: 64, onset_time_sec: 4.05, duration_sec: 0.22, velocity: 0.75, hand: 'RH', measure: 6, beat: 3, finger_hint: 1 },
      { id: 'fe-21', note_name: 'G#4', midi_number: 68, onset_time_sec: 4.28, duration_sec: 0.22, velocity: 0.78, hand: 'RH', measure: 7, beat: 1, finger_hint: 2 },
      { id: 'fe-22', note_name: 'B4', midi_number: 71, onset_time_sec: 4.5, duration_sec: 0.22, velocity: 0.8, hand: 'RH', measure: 7, beat: 2, finger_hint: 4 },
      // Measure 7 RH C5 (Resolution)
      { id: 'fe-23', note_name: 'C5', midi_number: 72, onset_time_sec: 4.75, duration_sec: 0.55, velocity: 0.82, hand: 'RH', measure: 7, beat: 3, finger_hint: 5 },
      { id: 'fe-24', note_name: 'A2', midi_number: 45, onset_time_sec: 4.75, duration_sec: 0.6, velocity: 0.8, hand: 'LH', measure: 7, beat: 3, finger_hint: 5 },
      { id: 'fe-25', note_name: 'E3', midi_number: 52, onset_time_sec: 5.05, duration_sec: 0.45, velocity: 0.75, hand: 'LH', measure: 8, beat: 1, finger_hint: 2 },
      { id: 'fe-26', note_name: 'A3', midi_number: 57, onset_time_sec: 5.3, duration_sec: 0.45, velocity: 0.75, hand: 'LH', measure: 8, beat: 2, finger_hint: 1 },
      // Measure 8: Return of the flutter
      { id: 'fe-27', note_name: 'E5', midi_number: 76, onset_time_sec: 5.55, duration_sec: 0.22, velocity: 0.8, hand: 'RH', measure: 8, beat: 3, finger_hint: 5 },
      { id: 'fe-28', note_name: 'D#5', midi_number: 75, onset_time_sec: 5.78, duration_sec: 0.22, velocity: 0.78, hand: 'RH', measure: 9, beat: 1, finger_hint: 4 },
      { id: 'fe-29', note_name: 'E5', midi_number: 76, onset_time_sec: 6.0, duration_sec: 0.22, velocity: 0.8, hand: 'RH', measure: 9, beat: 2, finger_hint: 5 },
      { id: 'fe-30', note_name: 'D#5', midi_number: 75, onset_time_sec: 6.23, duration_sec: 0.22, velocity: 0.78, hand: 'RH', measure: 9, beat: 3, finger_hint: 4 },
      { id: 'fe-31', note_name: 'E5', midi_number: 76, onset_time_sec: 6.45, duration_sec: 0.22, velocity: 0.8, hand: 'RH', measure: 10, beat: 1, finger_hint: 5 },
      { id: 'fe-32', note_name: 'B4', midi_number: 71, onset_time_sec: 6.68, duration_sec: 0.22, velocity: 0.75, hand: 'RH', measure: 10, beat: 2, finger_hint: 1 },
      { id: 'fe-33', note_name: 'D5', midi_number: 74, onset_time_sec: 6.9, duration_sec: 0.22, velocity: 0.78, hand: 'RH', measure: 10, beat: 3, finger_hint: 3 },
      { id: 'fe-34', note_name: 'C5', midi_number: 72, onset_time_sec: 7.13, duration_sec: 0.22, velocity: 0.8, hand: 'RH', measure: 11, beat: 1, finger_hint: 2 },
      { id: 'fe-35', note_name: 'A4', midi_number: 69, onset_time_sec: 7.35, duration_sec: 0.6, velocity: 0.85, hand: 'RH', measure: 11, beat: 2, finger_hint: 1 },
      // Measure 11 LH Cadence
      { id: 'fe-36', note_name: 'A2', midi_number: 45, onset_time_sec: 7.35, duration_sec: 1.2, velocity: 0.8, hand: 'LH', measure: 11, beat: 2, finger_hint: 5 },
      { id: 'fe-37', note_name: 'E3', midi_number: 52, onset_time_sec: 7.65, duration_sec: 0.8, velocity: 0.75, hand: 'LH', measure: 11, beat: 3, finger_hint: 3 },
      { id: 'fe-38', note_name: 'A3', midi_number: 57, onset_time_sec: 7.95, duration_sec: 0.8, velocity: 0.75, hand: 'LH', measure: 12, beat: 1, finger_hint: 1 }
    ]
  },

  // ========================================================
  // 2. J.S. BACH: PRELUDE IN C MAJOR (THE WELL-TEMPERED CLAVIER)
  // ========================================================
  {
    trackId: 'track-bach-prelude-c-complete',
    workId: 'bach-prelude-c',
    title: 'Prelude in C Major, BWV 846 (Complete Wave Cycle)',
    composer: 'Johann Sebastian Bach',
    opusCatalog: 'BWV 846',
    keySignature: 'C Major',
    timeSignature: '4/4',
    tempoBpm: 68,
    tempoMarking: 'Moderato espressivo (♩ = 68)',
    difficulty: 'Intermediate',
    measuresTotal: 12,
    totalDurationSeconds: 45,
    coverGradient: 'from-amber-900/80 via-slate-900 to-amber-950/80',
    historicalContext: 'Opening masterpiece of Das Wohltemperierte Klavier (1722). Charles Gounod famously superimposed his "Ave Maria" melody over these exact harmonic arpeggios in 1853.',
    notes: [
      // MEASURE 1: C Major (I)
      { id: 'b1-1', note_name: 'C3', midi_number: 48, onset_time_sec: 0.0, duration_sec: 2.0, velocity: 0.85, hand: 'LH', measure: 1, beat: 1, finger_hint: 5 },
      { id: 'b1-2', note_name: 'E3', midi_number: 52, onset_time_sec: 0.0, duration_sec: 2.0, velocity: 0.8, hand: 'LH', measure: 1, beat: 1, finger_hint: 3 },
      { id: 'b1-3', note_name: 'G3', midi_number: 55, onset_time_sec: 0.22, duration_sec: 0.4, velocity: 0.75, hand: 'RH', measure: 1, beat: 1.5, finger_hint: 1 },
      { id: 'b1-4', note_name: 'C4', midi_number: 60, onset_time_sec: 0.44, duration_sec: 0.4, velocity: 0.78, hand: 'RH', measure: 1, beat: 2, finger_hint: 2 },
      { id: 'b1-5', note_name: 'E4', midi_number: 64, onset_time_sec: 0.66, duration_sec: 0.4, velocity: 0.8, hand: 'RH', measure: 1, beat: 2.5, finger_hint: 5 },
      { id: 'b1-6', note_name: 'G3', midi_number: 55, onset_time_sec: 0.88, duration_sec: 0.4, velocity: 0.75, hand: 'RH', measure: 1, beat: 3, finger_hint: 1 },
      { id: 'b1-7', note_name: 'C4', midi_number: 60, onset_time_sec: 1.1, duration_sec: 0.4, velocity: 0.78, hand: 'RH', measure: 1, beat: 3.5, finger_hint: 2 },
      { id: 'b1-8', note_name: 'E4', midi_number: 64, onset_time_sec: 1.32, duration_sec: 0.6, velocity: 0.8, hand: 'RH', measure: 1, beat: 4, finger_hint: 5 },

      // MEASURE 2: D Minor 7th / C (ii7)
      { id: 'b2-1', note_name: 'C3', midi_number: 48, onset_time_sec: 1.76, duration_sec: 2.0, velocity: 0.82, hand: 'LH', measure: 2, beat: 1, finger_hint: 5 },
      { id: 'b2-2', note_name: 'D3', midi_number: 50, onset_time_sec: 1.76, duration_sec: 2.0, velocity: 0.8, hand: 'LH', measure: 2, beat: 1, finger_hint: 4 },
      { id: 'b2-3', note_name: 'A3', midi_number: 57, onset_time_sec: 1.98, duration_sec: 0.4, velocity: 0.75, hand: 'RH', measure: 2, beat: 1.5, finger_hint: 1 },
      { id: 'b2-4', note_name: 'D4', midi_number: 62, onset_time_sec: 2.2, duration_sec: 0.4, velocity: 0.78, hand: 'RH', measure: 2, beat: 2, finger_hint: 2 },
      { id: 'b2-5', note_name: 'F4', midi_number: 65, onset_time_sec: 2.42, duration_sec: 0.4, velocity: 0.8, hand: 'RH', measure: 2, beat: 2.5, finger_hint: 5 },
      { id: 'b2-6', note_name: 'A3', midi_number: 57, onset_time_sec: 2.64, duration_sec: 0.4, velocity: 0.75, hand: 'RH', measure: 2, beat: 3, finger_hint: 1 },
      { id: 'b2-7', note_name: 'D4', midi_number: 62, onset_time_sec: 2.86, duration_sec: 0.4, velocity: 0.78, hand: 'RH', measure: 2, beat: 3.5, finger_hint: 2 },
      { id: 'b2-8', note_name: 'F4', midi_number: 65, onset_time_sec: 3.08, duration_sec: 0.6, velocity: 0.8, hand: 'RH', measure: 2, beat: 4, finger_hint: 5 },

      // MEASURE 3: G7 / B (V7 first inversion)
      { id: 'b3-1', note_name: 'B2', midi_number: 47, onset_time_sec: 3.52, duration_sec: 2.0, velocity: 0.82, hand: 'LH', measure: 3, beat: 1, finger_hint: 5 },
      { id: 'b3-2', note_name: 'D3', midi_number: 50, onset_time_sec: 3.52, duration_sec: 2.0, velocity: 0.8, hand: 'LH', measure: 3, beat: 1, finger_hint: 3 },
      { id: 'b3-3', note_name: 'G3', midi_number: 55, onset_time_sec: 3.74, duration_sec: 0.4, velocity: 0.75, hand: 'RH', measure: 3, beat: 1.5, finger_hint: 1 },
      { id: 'b3-4', note_name: 'D4', midi_number: 62, onset_time_sec: 3.96, duration_sec: 0.4, velocity: 0.78, hand: 'RH', measure: 3, beat: 2, finger_hint: 2 },
      { id: 'b3-5', note_name: 'F4', midi_number: 65, onset_time_sec: 4.18, duration_sec: 0.4, velocity: 0.8, hand: 'RH', measure: 3, beat: 2.5, finger_hint: 5 },
      { id: 'b3-6', note_name: 'G3', midi_number: 55, onset_time_sec: 4.4, duration_sec: 0.4, velocity: 0.75, hand: 'RH', measure: 3, beat: 3, finger_hint: 1 },
      { id: 'b3-7', note_name: 'D4', midi_number: 62, onset_time_sec: 4.62, duration_sec: 0.4, velocity: 0.78, hand: 'RH', measure: 3, beat: 3.5, finger_hint: 2 },
      { id: 'b3-8', note_name: 'F4', midi_number: 65, onset_time_sec: 4.84, duration_sec: 0.6, velocity: 0.8, hand: 'RH', measure: 3, beat: 4, finger_hint: 5 },

      // MEASURE 4: C Major Resolution (I)
      { id: 'b4-1', note_name: 'C3', midi_number: 48, onset_time_sec: 5.28, duration_sec: 2.0, velocity: 0.85, hand: 'LH', measure: 4, beat: 1, finger_hint: 5 },
      { id: 'b4-2', note_name: 'E3', midi_number: 52, onset_time_sec: 5.28, duration_sec: 2.0, velocity: 0.8, hand: 'LH', measure: 4, beat: 1, finger_hint: 3 },
      { id: 'b4-3', note_name: 'G3', midi_number: 55, onset_time_sec: 5.5, duration_sec: 0.4, velocity: 0.75, hand: 'RH', measure: 4, beat: 1.5, finger_hint: 1 },
      { id: 'b4-4', note_name: 'C4', midi_number: 60, onset_time_sec: 5.72, duration_sec: 0.4, velocity: 0.78, hand: 'RH', measure: 4, beat: 2, finger_hint: 2 },
      { id: 'b4-5', note_name: 'E4', midi_number: 64, onset_time_sec: 5.94, duration_sec: 0.4, velocity: 0.8, hand: 'RH', measure: 4, beat: 2.5, finger_hint: 5 },
      { id: 'b4-6', note_name: 'G3', midi_number: 55, onset_time_sec: 6.16, duration_sec: 0.4, velocity: 0.75, hand: 'RH', measure: 4, beat: 3, finger_hint: 1 },
      { id: 'b4-7', note_name: 'C4', midi_number: 60, onset_time_sec: 6.38, duration_sec: 0.4, velocity: 0.78, hand: 'RH', measure: 4, beat: 3.5, finger_hint: 2 },
      { id: 'b4-8', note_name: 'E4', midi_number: 64, onset_time_sec: 6.6, duration_sec: 0.6, velocity: 0.8, hand: 'RH', measure: 4, beat: 4, finger_hint: 5 }
    ]
  },

  // ========================================================
  // 3. PACHELBEL: CANON IN D MAJOR (GROUND BASS & THEME)
  // ========================================================
  {
    trackId: 'track-canon-d-complete',
    workId: 'pachelbel-canon-d',
    title: 'Canon in D Major (Complete Ground Bass & Theme)',
    composer: 'Johann Pachelbel',
    opusCatalog: 'PWC 37',
    keySignature: 'D Major',
    timeSignature: '4/4',
    tempoBpm: 60,
    tempoMarking: 'Andante maestoso (♩ = 60)',
    difficulty: 'Beginner',
    measuresTotal: 8,
    totalDurationSeconds: 36,
    coverGradient: 'from-amber-950 via-stone-900 to-yellow-950',
    historicalContext: 'Composed around 1680 in Nuremberg, Germany. The famous 8-chord progression (I - V - vi - iii - IV - I - IV - V) has influenced hundreds of modern classical and pop masterpieces.',
    notes: [
      // Measure 1: D3 (I) & A2 (V)
      { id: 'can-1', note_name: 'D3', midi_number: 50, onset_time_sec: 0.0, duration_sec: 2.0, velocity: 0.85, hand: 'LH', measure: 1, beat: 1, finger_hint: 5 },
      { id: 'can-2', note_name: 'F#4', midi_number: 66, onset_time_sec: 0.0, duration_sec: 2.0, velocity: 0.8, hand: 'RH', measure: 1, beat: 1, finger_hint: 3 },
      { id: 'can-3', note_name: 'A2', midi_number: 45, onset_time_sec: 2.0, duration_sec: 2.0, velocity: 0.82, hand: 'LH', measure: 1, beat: 3, finger_hint: 1 },
      { id: 'can-4', note_name: 'E4', midi_number: 64, onset_time_sec: 2.0, duration_sec: 2.0, velocity: 0.78, hand: 'RH', measure: 1, beat: 3, finger_hint: 2 },

      // Measure 2: B2 (vi) & F#2 (iii)
      { id: 'can-5', note_name: 'B2', midi_number: 47, onset_time_sec: 4.0, duration_sec: 2.0, velocity: 0.82, hand: 'LH', measure: 2, beat: 1, finger_hint: 3 },
      { id: 'can-6', note_name: 'D4', midi_number: 62, onset_time_sec: 4.0, duration_sec: 2.0, velocity: 0.78, hand: 'RH', measure: 2, beat: 1, finger_hint: 1 },
      { id: 'can-7', note_name: 'F#2', midi_number: 42, onset_time_sec: 6.0, duration_sec: 2.0, velocity: 0.8, hand: 'LH', measure: 2, beat: 3, finger_hint: 5 },
      { id: 'can-8', note_name: 'C#4', midi_number: 61, onset_time_sec: 6.0, duration_sec: 2.0, velocity: 0.75, hand: 'RH', measure: 2, beat: 3, finger_hint: 2 },

      // Measure 3: G2 (IV) & D2 (I)
      { id: 'can-9', note_name: 'G2', midi_number: 43, onset_time_sec: 8.0, duration_sec: 2.0, velocity: 0.82, hand: 'LH', measure: 3, beat: 1, finger_hint: 4 },
      { id: 'can-10', note_name: 'B3', midi_number: 59, onset_time_sec: 8.0, duration_sec: 2.0, velocity: 0.78, hand: 'RH', measure: 3, beat: 1, finger_hint: 1 },
      { id: 'can-11', note_name: 'D2', midi_number: 38, onset_time_sec: 10.0, duration_sec: 2.0, velocity: 0.8, hand: 'LH', measure: 3, beat: 3, finger_hint: 5 },
      { id: 'can-12', note_name: 'A3', midi_number: 57, onset_time_sec: 10.0, duration_sec: 2.0, velocity: 0.75, hand: 'RH', measure: 3, beat: 3, finger_hint: 2 },

      // Measure 4: G2 (IV) & A2 (V) Cadence
      { id: 'can-13', note_name: 'G2', midi_number: 43, onset_time_sec: 12.0, duration_sec: 2.0, velocity: 0.82, hand: 'LH', measure: 4, beat: 1, finger_hint: 4 },
      { id: 'can-14', note_name: 'B3', midi_number: 59, onset_time_sec: 12.0, duration_sec: 2.0, velocity: 0.78, hand: 'RH', measure: 4, beat: 1, finger_hint: 3 },
      { id: 'can-15', note_name: 'A2', midi_number: 45, onset_time_sec: 14.0, duration_sec: 2.0, velocity: 0.85, hand: 'LH', measure: 4, beat: 3, finger_hint: 3 },
      { id: 'can-16', note_name: 'C#4', midi_number: 61, onset_time_sec: 14.0, duration_sec: 2.0, velocity: 0.8, hand: 'RH', measure: 4, beat: 3, finger_hint: 4 }
    ]
  },

  // ========================================================
  // 4. BEETHOVEN: MOONLIGHT SONATA (1ST MVT OPENING)
  // ========================================================
  {
    trackId: 'track-moonlight-sonata-mov1',
    workId: 'beethoven-moonlight',
    title: 'Moonlight Sonata, Op. 27 No. 2 (1st Mvt Adagio)',
    composer: 'Ludwig van Beethoven',
    opusCatalog: 'Op. 27 No. 2',
    keySignature: 'C-sharp Minor',
    timeSignature: '2/2',
    tempoBpm: 54,
    tempoMarking: 'Adagio sostenuto (♩ = 54)',
    difficulty: 'Advanced',
    measuresTotal: 10,
    totalDurationSeconds: 40,
    coverGradient: 'from-blue-950 via-slate-900 to-indigo-950',
    historicalContext: 'Beethoven marked: "Si deve suonare tutto questo pezzo delicatissimamente e senza sordino" (This whole piece must be played with the utmost delicacy and without dampers, holding sustain pedal down).',
    notes: [
      // Measure 1: C# Octave bass + G#3-C#4-E4 triplets
      { id: 'ml-1', note_name: 'C#2', midi_number: 37, onset_time_sec: 0.0, duration_sec: 4.0, velocity: 0.85, hand: 'LH', measure: 1, beat: 1, finger_hint: 5 },
      { id: 'ml-2', note_name: 'C#3', midi_number: 49, onset_time_sec: 0.0, duration_sec: 4.0, velocity: 0.8, hand: 'LH', measure: 1, beat: 1, finger_hint: 1 },
      { id: 'ml-3', note_name: 'G#3', midi_number: 56, onset_time_sec: 0.0, duration_sec: 0.35, velocity: 0.65, hand: 'RH', measure: 1, beat: 1, finger_hint: 1 },
      { id: 'ml-4', note_name: 'C#4', midi_number: 61, onset_time_sec: 0.35, duration_sec: 0.35, velocity: 0.65, hand: 'RH', measure: 1, beat: 1.3, finger_hint: 2 },
      { id: 'ml-5', note_name: 'E4', midi_number: 64, onset_time_sec: 0.7, duration_sec: 0.35, velocity: 0.7, hand: 'RH', measure: 1, beat: 1.6, finger_hint: 4 },
      // Triplet 2
      { id: 'ml-6', note_name: 'G#3', midi_number: 56, onset_time_sec: 1.05, duration_sec: 0.35, velocity: 0.65, hand: 'RH', measure: 1, beat: 2, finger_hint: 1 },
      { id: 'ml-7', note_name: 'C#4', midi_number: 61, onset_time_sec: 1.4, duration_sec: 0.35, velocity: 0.65, hand: 'RH', measure: 1, beat: 2.3, finger_hint: 2 },
      { id: 'ml-8', note_name: 'E4', midi_number: 64, onset_time_sec: 1.75, duration_sec: 0.35, velocity: 0.7, hand: 'RH', measure: 1, beat: 2.6, finger_hint: 4 },
      // Triplet 3
      { id: 'ml-9', note_name: 'G#3', midi_number: 56, onset_time_sec: 2.1, duration_sec: 0.35, velocity: 0.65, hand: 'RH', measure: 1, beat: 3, finger_hint: 1 },
      { id: 'ml-10', note_name: 'C#4', midi_number: 61, onset_time_sec: 2.45, duration_sec: 0.35, velocity: 0.65, hand: 'RH', measure: 1, beat: 3.3, finger_hint: 2 },
      { id: 'ml-11', note_name: 'E4', midi_number: 64, onset_time_sec: 2.8, duration_sec: 0.35, velocity: 0.7, hand: 'RH', measure: 1, beat: 3.6, finger_hint: 4 },
      // Triplet 4
      { id: 'ml-12', note_name: 'G#3', midi_number: 56, onset_time_sec: 3.15, duration_sec: 0.35, velocity: 0.65, hand: 'RH', measure: 1, beat: 4, finger_hint: 1 },
      { id: 'ml-13', note_name: 'C#4', midi_number: 61, onset_time_sec: 3.5, duration_sec: 0.35, velocity: 0.65, hand: 'RH', measure: 1, beat: 4.3, finger_hint: 2 },
      { id: 'ml-14', note_name: 'E4', midi_number: 64, onset_time_sec: 3.85, duration_sec: 0.35, velocity: 0.7, hand: 'RH', measure: 1, beat: 4.6, finger_hint: 4 },

      // Measure 2: The singing G#4 entry!
      { id: 'ml-15', note_name: 'B1', midi_number: 35, onset_time_sec: 4.2, duration_sec: 4.0, velocity: 0.85, hand: 'LH', measure: 2, beat: 1, finger_hint: 5 },
      { id: 'ml-16', note_name: 'B2', midi_number: 47, onset_time_sec: 4.2, duration_sec: 4.0, velocity: 0.8, hand: 'LH', measure: 2, beat: 1, finger_hint: 1 },
      { id: 'ml-17', note_name: 'G#4', midi_number: 68, onset_time_sec: 4.2, duration_sec: 2.5, velocity: 0.88, hand: 'RH', measure: 2, beat: 1, finger_hint: 5 },
      { id: 'ml-18', note_name: 'G#3', midi_number: 56, onset_time_sec: 4.2, duration_sec: 0.35, velocity: 0.6, hand: 'RH', measure: 2, beat: 1, finger_hint: 1 },
      { id: 'ml-19', note_name: 'D#4', midi_number: 63, onset_time_sec: 4.55, duration_sec: 0.35, velocity: 0.6, hand: 'RH', measure: 2, beat: 1.3, finger_hint: 2 },
      { id: 'ml-20', note_name: 'F#4', midi_number: 66, onset_time_sec: 4.9, duration_sec: 0.35, velocity: 0.65, hand: 'RH', measure: 2, beat: 1.6, finger_hint: 3 }
    ]
  },

  // ========================================================
  // 5. MOZART: SONATA FACILE IN C MAJOR, K. 545 (ALBERTI BASS)
  // ========================================================
  {
    trackId: 'track-mozart-sonata-c-complete',
    workId: 'mozart-sonata-c-545',
    title: 'Sonata in C Major, K. 545 ("Sonata Facile")',
    composer: 'Wolfgang Amadeus Mozart',
    opusCatalog: 'K. 545',
    keySignature: 'C Major',
    timeSignature: '4/4',
    tempoBpm: 116,
    tempoMarking: 'Allegro (♩ = 116)',
    difficulty: 'Intermediate',
    measuresTotal: 8,
    totalDurationSeconds: 24,
    coverGradient: 'from-amber-950 via-stone-900 to-amber-900',
    historicalContext: 'Entered into Mozart\'s own catalogue on June 26, 1788 as "Eine kleine Clavier Sonate für anfänger" (A small clavier sonata for beginners).',
    notes: [
      // Measure 1: RH Theme (C5 - E5 - G5 - B4 - C5 - D5 - C5) + LH Alberti Bass (C4-G4-E4-G4)
      { id: 'mz-1', note_name: 'C5', midi_number: 72, onset_time_sec: 0.0, duration_sec: 1.0, velocity: 0.85, hand: 'RH', measure: 1, beat: 1, finger_hint: 1 },
      { id: 'mz-2', note_name: 'C3', midi_number: 48, onset_time_sec: 0.0, duration_sec: 0.25, velocity: 0.75, hand: 'LH', measure: 1, beat: 1, finger_hint: 5 },
      { id: 'mz-3', note_name: 'G3', midi_number: 55, onset_time_sec: 0.25, duration_sec: 0.25, velocity: 0.7, hand: 'LH', measure: 1, beat: 1.5, finger_hint: 1 },
      { id: 'mz-4', note_name: 'E3', midi_number: 52, onset_time_sec: 0.5, duration_sec: 0.25, velocity: 0.7, hand: 'LH', measure: 1, beat: 2, finger_hint: 3 },
      { id: 'mz-5', note_name: 'G3', midi_number: 55, onset_time_sec: 0.75, duration_sec: 0.25, velocity: 0.7, hand: 'LH', measure: 1, beat: 2.5, finger_hint: 1 },

      { id: 'mz-6', note_name: 'E5', midi_number: 76, onset_time_sec: 1.0, duration_sec: 0.5, velocity: 0.82, hand: 'RH', measure: 1, beat: 3, finger_hint: 3 },
      { id: 'mz-7', note_name: 'G5', midi_number: 79, onset_time_sec: 1.5, duration_sec: 0.5, velocity: 0.85, hand: 'RH', measure: 1, beat: 4, finger_hint: 5 },
      { id: 'mz-8', note_name: 'C3', midi_number: 48, onset_time_sec: 1.0, duration_sec: 0.25, velocity: 0.75, hand: 'LH', measure: 1, beat: 3, finger_hint: 5 },
      { id: 'mz-9', note_name: 'G3', midi_number: 55, onset_time_sec: 1.25, duration_sec: 0.25, velocity: 0.7, hand: 'LH', measure: 1, beat: 3.5, finger_hint: 1 },
      { id: 'mz-10', note_name: 'E3', midi_number: 52, onset_time_sec: 1.5, duration_sec: 0.25, velocity: 0.7, hand: 'LH', measure: 1, beat: 4, finger_hint: 3 },
      { id: 'mz-11', note_name: 'G3', midi_number: 55, onset_time_sec: 1.75, duration_sec: 0.25, velocity: 0.7, hand: 'LH', measure: 1, beat: 4.5, finger_hint: 1 },

      // Measure 2: B4 - C5 - D5 - C5
      { id: 'mz-12', note_name: 'B4', midi_number: 71, onset_time_sec: 2.0, duration_sec: 0.75, velocity: 0.82, hand: 'RH', measure: 2, beat: 1, finger_hint: 2 },
      { id: 'mz-13', note_name: 'C5', midi_number: 72, onset_time_sec: 2.75, duration_sec: 0.25, velocity: 0.8, hand: 'RH', measure: 2, beat: 2.5, finger_hint: 3 },
      { id: 'mz-14', note_name: 'D5', midi_number: 74, onset_time_sec: 3.0, duration_sec: 0.5, velocity: 0.82, hand: 'RH', measure: 2, beat: 3, finger_hint: 4 },
      { id: 'mz-15', note_name: 'C5', midi_number: 72, onset_time_sec: 3.5, duration_sec: 0.5, velocity: 0.8, hand: 'RH', measure: 2, beat: 4, finger_hint: 3 }
    ]
  },

  // ========================================================
  // 6. ERIK SATIE: GYMNOPÉDIE NO. 1 (MODAL AMBIENCE)
  // ========================================================
  {
    trackId: 'track-satie-gymnopedie-complete',
    workId: 'satie-gymnopedie-1',
    title: 'Gymnopédie No. 1 (Complete Opening Theme)',
    composer: 'Erik Satie',
    opusCatalog: 'No. 1',
    keySignature: 'D Major',
    timeSignature: '3/4',
    tempoBpm: 66,
    tempoMarking: 'Lent et douloureux (♩ = 66)',
    difficulty: 'Intermediate',
    measuresTotal: 10,
    totalDurationSeconds: 32,
    coverGradient: 'from-stone-900 via-amber-950 to-stone-950',
    historicalContext: 'Published in Paris in 1888. Inspired by Gustave Flaubert\'s novel Salammbô and ancient Spartan ceremonial dances, this piece pioneered minimalist ambient piano music.',
    notes: [
      // Measure 1: G Bass + B3-D4-F#4 chord (Gmaj7)
      { id: 'sat-1', note_name: 'G2', midi_number: 43, onset_time_sec: 0.0, duration_sec: 1.0, velocity: 0.82, hand: 'LH', measure: 1, beat: 1, finger_hint: 5 },
      { id: 'sat-2', note_name: 'B3', midi_number: 59, onset_time_sec: 0.9, duration_sec: 1.6, velocity: 0.72, hand: 'LH', measure: 1, beat: 2, finger_hint: 3 },
      { id: 'sat-3', note_name: 'D4', midi_number: 62, onset_time_sec: 0.9, duration_sec: 1.6, velocity: 0.72, hand: 'LH', measure: 1, beat: 2, finger_hint: 2 },
      { id: 'sat-4', note_name: 'F#4', midi_number: 66, onset_time_sec: 0.9, duration_sec: 1.6, velocity: 0.75, hand: 'LH', measure: 1, beat: 2, finger_hint: 1 },

      // Measure 2: D Bass + F#3-A3-C#4 chord (Dmaj7)
      { id: 'sat-5', note_name: 'D2', midi_number: 38, onset_time_sec: 2.7, duration_sec: 1.0, velocity: 0.82, hand: 'LH', measure: 2, beat: 1, finger_hint: 5 },
      { id: 'sat-6', note_name: 'F#3', midi_number: 54, onset_time_sec: 3.6, duration_sec: 1.6, velocity: 0.72, hand: 'LH', measure: 2, beat: 2, finger_hint: 3 },
      { id: 'sat-7', note_name: 'A3', midi_number: 57, onset_time_sec: 3.6, duration_sec: 1.6, velocity: 0.72, hand: 'LH', measure: 2, beat: 2, finger_hint: 2 },
      { id: 'sat-8', note_name: 'C#4', midi_number: 61, onset_time_sec: 3.6, duration_sec: 1.6, velocity: 0.75, hand: 'LH', measure: 2, beat: 2, finger_hint: 1 },

      // Measure 5: Melody entry F#5 - E5 - D5 - B4 - C#5 - D5
      { id: 'sat-9', note_name: 'F#5', midi_number: 78, onset_time_sec: 5.4, duration_sec: 2.5, velocity: 0.85, hand: 'RH', measure: 3, beat: 1, finger_hint: 5 },
      { id: 'sat-10', note_name: 'G2', midi_number: 43, onset_time_sec: 5.4, duration_sec: 1.0, velocity: 0.8, hand: 'LH', measure: 3, beat: 1, finger_hint: 5 },
      { id: 'sat-11', note_name: 'B3', midi_number: 59, onset_time_sec: 6.3, duration_sec: 1.6, velocity: 0.7, hand: 'LH', measure: 3, beat: 2, finger_hint: 3 },
      { id: 'sat-12', note_name: 'D4', midi_number: 62, onset_time_sec: 6.3, duration_sec: 1.6, velocity: 0.7, hand: 'LH', measure: 3, beat: 2, finger_hint: 2 },
      { id: 'sat-13', note_name: 'F#4', midi_number: 66, onset_time_sec: 6.3, duration_sec: 1.6, velocity: 0.7, hand: 'LH', measure: 3, beat: 2, finger_hint: 1 }
    ]
  },

  // ========================================================
  // 7. RICHARD CLAYDERMAN: ALWAYS (COMPLETE ROMANTIC BALLAD)
  // ========================================================
  {
    trackId: 'track-clayderman-always-complete',
    workId: 'clayderman-always',
    title: 'Always (Complete Romantic Ballad)',
    composer: 'Richard Clayderman',
    opusCatalog: 'Arr. Asian Concert Tour & "Qin Qian 99"',
    keySignature: 'C Minor / Eb Major',
    timeSignature: '4/4',
    tempoBpm: 80,
    tempoMarking: 'Andante amoroso con rubato (♩ = 80)',
    difficulty: 'Intermediate',
    measuresTotal: 16,
    totalDurationSeconds: 48,
    coverGradient: 'from-rose-950 via-stone-900 to-amber-950',
    historicalContext: 'Popularized worldwide by Richard Clayderman across his legendary concert tours and celebrated Asian release "Qin Qian 99" (adapting the lyrical ballad "那么爱你为什么" / "Always"). Revered for its lush New Romantic grand piano soundboard color, rolling 10th arpeggios, and expressive cantabile melodic phrasing.',
    playAlongGuide: {
      overview: 'Richard Clayderman\'s "Always" is the gold standard of the French New Romantic piano idiom. It balances rolling 10th-interval arpeggios in the left hand beneath a soaring, singing cantabile melody in the right hand. Master the delicate rubato, wrist rotation, and syncopated pedaling with the measure-by-measure guide.',
      techniqueTips: [
        'Cantabile Voicing: Keep left-hand arpeggios pianissimo (whisper-soft) so the right-hand melody rings out with rich, warm vocal tone.',
        'Flexible Wrist Rotation: Do not stretch with a rigid hand on wide LH spans (C2 to G2 to Eb3). Rotate your wrist laterally to glide gracefully between notes.',
        'Syncopated Damper Pedaling: Depress pedal immediately after striking beat 1, clear and refresh on beat 3 when harmony shifts.',
        'Expressive Rubato: Linger tenderly on high climax notes (Eb5 and G5) before cascading gently down the lyrical line.'
      ],
      pedalAdvice: 'Clear pedal on every chord change (beats 1 & 3). Never let low bass notes bleed across bar lines.',
      phrasingAdvice: 'Shape each 4-measure phrase like a human breath: slight swell (crescendo) towards beat 3, gentle fade (decrescendo) at the phrase boundary.',
      chordProgression: ['Cm', 'Ab', 'Bb', 'Gm', 'Fm7', 'Bb7', 'Ebmaj7', 'G7', 'Cm'],
      measureHints: {
        1: 'Prologue: Gentle rolling C Minor arpeggio (C2-G2-C3-Eb3). Play with delicate, fluid touch.',
        2: 'Ascending bridge: LH lifts softly into beat 4, creating an airy breath for the melody entrance.',
        3: 'Theme A Opening: RH enters cantabile on G4, rising to C5 and D5. Keep fingers curved and supple.',
        4: 'Ab Major Shift: LH moves to deep Ab1/Ab2. RH sings Eb5 with warm arm weight, falling to D5-C5.',
        5: 'Bb Major Romantic Swell: Lean slightly into the tempo. LH sweeps through Bb2-F3-D4.',
        6: 'Gm Tenderness: RH resolves gently on Bb4. Soften your dynamic level to a warm piano (p).',
        7: 'Theme B Longing: Fm7 chord introduces deep nostalgia. RH leaps to F5 with finger 4.',
        8: 'Bb7 Preparation: Tension builds towards the climactic modulation. Crisp articulation.',
        9: 'Grand Climactic Peak: Eb Major release! Strike high G5 with supported pinky finger 5.',
        10: 'G7 Dominant Turn: Leading tone B3-D4 in LH creates dramatic tension before the recapitulation.',
        11: 'Theme Recapitulation: Melody returns with fuller harmonic voicing and passionate expression.',
        12: 'Cascading Descent: RH glides down Eb5-D5-C5-Bb4-C5 like gentle falling rain.',
        13: 'Lyrical Extension: Deep C2 octave anchor in the bass providing rich acoustic resonance.',
        14: 'Poco Ritardando: Gradually decelerate tempo, allowing each note to breathe fully.',
        15: 'The Cadence: Arpeggiated C Minor chord rolls upward across both staves.',
        16: 'Final Resolution: Hold sustain pedal; let the acoustic soundboard resonance fade into tranquility.'
      }
    },
    notes: [
      // MEASURE 1: The Romantic Arpeggiated Prologue (Cm)
      { id: 'cla-1', note_name: 'C2', midi_number: 36, onset_time_sec: 0.0, duration_sec: 0.8, velocity: 0.75, hand: 'LH', measure: 1, beat: 1, finger_hint: 5, pedal_hint: 'down', lyric_or_annotation: 'Bass Anchor (Cm)' },
      { id: 'cla-2', note_name: 'G2', midi_number: 43, onset_time_sec: 0.4, duration_sec: 0.7, velocity: 0.65, hand: 'LH', measure: 1, beat: 1.5, finger_hint: 3 },
      { id: 'cla-3', note_name: 'C3', midi_number: 48, onset_time_sec: 0.8, duration_sec: 0.7, velocity: 0.68, hand: 'LH', measure: 1, beat: 2, finger_hint: 2 },
      { id: 'cla-4', note_name: 'Eb3', midi_number: 51, onset_time_sec: 1.2, duration_sec: 0.9, velocity: 0.7, hand: 'LH', measure: 1, beat: 2.5, finger_hint: 1 },
      { id: 'cla-5', note_name: 'G3', midi_number: 55, onset_time_sec: 1.6, duration_sec: 0.9, velocity: 0.68, hand: 'LH', measure: 1, beat: 3, finger_hint: 1 },
      { id: 'cla-6', note_name: 'C4', midi_number: 60, onset_time_sec: 2.0, duration_sec: 1.1, velocity: 0.7, hand: 'LH', measure: 1, beat: 3.5, finger_hint: 2 },

      // MEASURE 2: Poetic Breath & Anacrusis
      { id: 'cla-7', note_name: 'C2', midi_number: 36, onset_time_sec: 2.8, duration_sec: 1.0, velocity: 0.72, hand: 'LH', measure: 2, beat: 1, finger_hint: 5, pedal_hint: 'change' },
      { id: 'cla-8', note_name: 'G3', midi_number: 55, onset_time_sec: 3.4, duration_sec: 0.8, velocity: 0.65, hand: 'LH', measure: 2, beat: 2, finger_hint: 2 },
      { id: 'cla-9', note_name: 'C4', midi_number: 60, onset_time_sec: 4.0, duration_sec: 0.8, velocity: 0.68, hand: 'LH', measure: 2, beat: 3, finger_hint: 1 },
      { id: 'cla-10', note_name: 'Eb4', midi_number: 63, onset_time_sec: 4.6, duration_sec: 0.6, velocity: 0.72, hand: 'RH', measure: 2, beat: 4, finger_hint: 2, lyric_or_annotation: 'Lead-in' },
      { id: 'cla-11', note_name: 'F4', midi_number: 65, onset_time_sec: 5.0, duration_sec: 0.6, velocity: 0.74, hand: 'RH', measure: 2, beat: 4.5, finger_hint: 3 },

      // MEASURE 3: Theme A Entry (G4 -> C5 -> D5 -> Eb5) over Cm
      { id: 'cla-12', note_name: 'C2', midi_number: 36, onset_time_sec: 5.5, duration_sec: 1.2, velocity: 0.8, hand: 'LH', measure: 3, beat: 1, finger_hint: 5, pedal_hint: 'down' },
      { id: 'cla-13', note_name: 'G4', midi_number: 67, onset_time_sec: 5.5, duration_sec: 0.7, velocity: 0.82, hand: 'RH', measure: 3, beat: 1, finger_hint: 1, lyric_or_annotation: 'Theme A: Always...' },
      { id: 'cla-14', note_name: 'G3', midi_number: 55, onset_time_sec: 6.0, duration_sec: 0.6, velocity: 0.65, hand: 'LH', measure: 3, beat: 1.5, finger_hint: 2 },
      { id: 'cla-15', note_name: 'C5', midi_number: 72, onset_time_sec: 6.4, duration_sec: 0.7, velocity: 0.84, hand: 'RH', measure: 3, beat: 2, finger_hint: 3 },
      { id: 'cla-16', note_name: 'Eb4', midi_number: 63, onset_time_sec: 6.8, duration_sec: 0.6, velocity: 0.66, hand: 'LH', measure: 3, beat: 2.5, finger_hint: 1 },
      { id: 'cla-17', note_name: 'D5', midi_number: 74, onset_time_sec: 7.2, duration_sec: 0.7, velocity: 0.82, hand: 'RH', measure: 3, beat: 3, finger_hint: 4 },
      { id: 'cla-18', note_name: 'Eb5', midi_number: 75, onset_time_sec: 7.8, duration_sec: 1.0, velocity: 0.86, hand: 'RH', measure: 3, beat: 4, finger_hint: 5, lyric_or_annotation: 'Cantabile peak' },

      // MEASURE 4: Ab Major Shift (Melody: D5 -> C5 -> Bb4)
      { id: 'cla-19', note_name: 'Ab2', midi_number: 44, onset_time_sec: 8.6, duration_sec: 1.2, velocity: 0.78, hand: 'LH', measure: 4, beat: 1, finger_hint: 5, pedal_hint: 'change' },
      { id: 'cla-20', note_name: 'D5', midi_number: 74, onset_time_sec: 8.6, duration_sec: 0.8, velocity: 0.82, hand: 'RH', measure: 4, beat: 1, finger_hint: 4 },
      { id: 'cla-21', note_name: 'Eb3', midi_number: 51, onset_time_sec: 9.1, duration_sec: 0.6, velocity: 0.65, hand: 'LH', measure: 4, beat: 1.5, finger_hint: 3 },
      { id: 'cla-22', note_name: 'C5', midi_number: 72, onset_time_sec: 9.6, duration_sec: 0.8, velocity: 0.8, hand: 'RH', measure: 4, beat: 2, finger_hint: 3 },
      { id: 'cla-23', note_name: 'C4', midi_number: 60, onset_time_sec: 10.1, duration_sec: 0.6, velocity: 0.65, hand: 'LH', measure: 4, beat: 2.5, finger_hint: 1 },
      { id: 'cla-24', note_name: 'Bb4', midi_number: 70, onset_time_sec: 10.6, duration_sec: 1.0, velocity: 0.82, hand: 'RH', measure: 4, beat: 3, finger_hint: 2 },
      { id: 'cla-25', note_name: 'C5', midi_number: 72, onset_time_sec: 11.4, duration_sec: 0.8, velocity: 0.84, hand: 'RH', measure: 4, beat: 4, finger_hint: 3 },

      // MEASURE 5: Bb Major Harmonic Swell
      { id: 'cla-26', note_name: 'Bb2', midi_number: 46, onset_time_sec: 12.0, duration_sec: 1.2, velocity: 0.78, hand: 'LH', measure: 5, beat: 1, finger_hint: 5, pedal_hint: 'change' },
      { id: 'cla-27', note_name: 'D5', midi_number: 74, onset_time_sec: 12.0, duration_sec: 0.8, velocity: 0.82, hand: 'RH', measure: 5, beat: 1, finger_hint: 4 },
      { id: 'cla-28', note_name: 'F3', midi_number: 53, onset_time_sec: 12.5, duration_sec: 0.6, velocity: 0.65, hand: 'LH', measure: 5, beat: 1.5, finger_hint: 3 },
      { id: 'cla-29', note_name: 'Eb5', midi_number: 75, onset_time_sec: 13.0, duration_sec: 0.8, velocity: 0.85, hand: 'RH', measure: 5, beat: 2, finger_hint: 5 },
      { id: 'cla-30', note_name: 'D4', midi_number: 62, onset_time_sec: 13.5, duration_sec: 0.6, velocity: 0.65, hand: 'LH', measure: 5, beat: 2.5, finger_hint: 1 },
      { id: 'cla-31', note_name: 'F5', midi_number: 77, onset_time_sec: 14.0, duration_sec: 1.1, velocity: 0.86, hand: 'RH', measure: 5, beat: 3, finger_hint: 5, lyric_or_annotation: 'Emotional lift' },

      // MEASURE 6: Gm Peaceful Resolution
      { id: 'cla-32', note_name: 'G2', midi_number: 43, onset_time_sec: 15.0, duration_sec: 1.2, velocity: 0.76, hand: 'LH', measure: 6, beat: 1, finger_hint: 5, pedal_hint: 'change' },
      { id: 'cla-33', note_name: 'Eb5', midi_number: 75, onset_time_sec: 15.0, duration_sec: 0.8, velocity: 0.8, hand: 'RH', measure: 6, beat: 1, finger_hint: 4 },
      { id: 'cla-34', note_name: 'D3', midi_number: 50, onset_time_sec: 15.5, duration_sec: 0.6, velocity: 0.65, hand: 'LH', measure: 6, beat: 1.5, finger_hint: 3 },
      { id: 'cla-35', note_name: 'D5', midi_number: 74, onset_time_sec: 16.0, duration_sec: 0.8, velocity: 0.78, hand: 'RH', measure: 6, beat: 2, finger_hint: 3 },
      { id: 'cla-36', note_name: 'Bb3', midi_number: 58, onset_time_sec: 16.5, duration_sec: 0.6, velocity: 0.65, hand: 'LH', measure: 6, beat: 2.5, finger_hint: 1 },
      { id: 'cla-37', note_name: 'C5', midi_number: 72, onset_time_sec: 17.0, duration_sec: 1.2, velocity: 0.8, hand: 'RH', measure: 6, beat: 3, finger_hint: 2 },

      // MEASURE 7: Theme B Fm7 Longing
      { id: 'cla-38', note_name: 'F2', midi_number: 41, onset_time_sec: 18.0, duration_sec: 1.2, velocity: 0.78, hand: 'LH', measure: 7, beat: 1, finger_hint: 5, pedal_hint: 'change' },
      { id: 'cla-39', note_name: 'C5', midi_number: 72, onset_time_sec: 18.0, duration_sec: 0.7, velocity: 0.82, hand: 'RH', measure: 7, beat: 1, finger_hint: 1 },
      { id: 'cla-40', note_name: 'C3', midi_number: 48, onset_time_sec: 18.5, duration_sec: 0.6, velocity: 0.65, hand: 'LH', measure: 7, beat: 1.5, finger_hint: 3 },
      { id: 'cla-41', note_name: 'Eb5', midi_number: 75, onset_time_sec: 19.0, duration_sec: 0.7, velocity: 0.84, hand: 'RH', measure: 7, beat: 2, finger_hint: 3 },
      { id: 'cla-42', note_name: 'Ab3', midi_number: 56, onset_time_sec: 19.5, duration_sec: 0.6, velocity: 0.65, hand: 'LH', measure: 7, beat: 2.5, finger_hint: 1 },
      { id: 'cla-43', note_name: 'F5', midi_number: 77, onset_time_sec: 20.0, duration_sec: 1.1, velocity: 0.86, hand: 'RH', measure: 7, beat: 3, finger_hint: 4, lyric_or_annotation: 'Longing Swell' },

      // MEASURE 8: Bb7 Transition into Major
      { id: 'cla-44', note_name: 'Bb2', midi_number: 46, onset_time_sec: 21.0, duration_sec: 1.2, velocity: 0.78, hand: 'LH', measure: 8, beat: 1, finger_hint: 5, pedal_hint: 'change' },
      { id: 'cla-45', note_name: 'F5', midi_number: 77, onset_time_sec: 21.0, duration_sec: 0.7, velocity: 0.82, hand: 'RH', measure: 8, beat: 1, finger_hint: 4 },
      { id: 'cla-46', note_name: 'F3', midi_number: 53, onset_time_sec: 21.5, duration_sec: 0.6, velocity: 0.65, hand: 'LH', measure: 8, beat: 1.5, finger_hint: 3 },
      { id: 'cla-47', note_name: 'D5', midi_number: 74, onset_time_sec: 22.0, duration_sec: 0.7, velocity: 0.8, hand: 'RH', measure: 8, beat: 2, finger_hint: 2 },
      { id: 'cla-48', note_name: 'Ab3', midi_number: 56, onset_time_sec: 22.5, duration_sec: 0.6, velocity: 0.65, hand: 'LH', measure: 8, beat: 2.5, finger_hint: 1 },
      { id: 'cla-49', note_name: 'Bb4', midi_number: 70, onset_time_sec: 23.0, duration_sec: 1.0, velocity: 0.82, hand: 'RH', measure: 8, beat: 3, finger_hint: 1 },

      // MEASURE 9: Grand Climactic Peak (Eb Major - High G5)
      { id: 'cla-50', note_name: 'Eb2', midi_number: 39, onset_time_sec: 24.0, duration_sec: 1.4, velocity: 0.85, hand: 'LH', measure: 9, beat: 1, finger_hint: 5, pedal_hint: 'down' },
      { id: 'cla-51', note_name: 'G5', midi_number: 79, onset_time_sec: 24.0, duration_sec: 1.2, velocity: 0.9, hand: 'RH', measure: 9, beat: 1, finger_hint: 5, lyric_or_annotation: 'Climax: Full Bloom!' },
      { id: 'cla-52', note_name: 'Bb2', midi_number: 46, onset_time_sec: 24.6, duration_sec: 0.7, velocity: 0.7, hand: 'LH', measure: 9, beat: 1.5, finger_hint: 3 },
      { id: 'cla-53', note_name: 'Eb3', midi_number: 51, onset_time_sec: 25.2, duration_sec: 0.7, velocity: 0.72, hand: 'LH', measure: 9, beat: 2, finger_hint: 2 },
      { id: 'cla-54', note_name: 'G3', midi_number: 55, onset_time_sec: 25.8, duration_sec: 0.8, velocity: 0.7, hand: 'LH', measure: 9, beat: 2.5, finger_hint: 1 },
      { id: 'cla-55', note_name: 'F5', midi_number: 77, onset_time_sec: 26.4, duration_sec: 0.8, velocity: 0.85, hand: 'RH', measure: 9, beat: 3, finger_hint: 4 },
      { id: 'cla-56', note_name: 'Eb5', midi_number: 75, onset_time_sec: 27.2, duration_sec: 0.9, velocity: 0.84, hand: 'RH', measure: 9, beat: 4, finger_hint: 3 },

      // MEASURE 10: G7 Dominant Dramatic Turnaround
      { id: 'cla-57', note_name: 'G2', midi_number: 43, onset_time_sec: 28.0, duration_sec: 1.2, velocity: 0.8, hand: 'LH', measure: 10, beat: 1, finger_hint: 5, pedal_hint: 'change' },
      { id: 'cla-58', note_name: 'D5', midi_number: 74, onset_time_sec: 28.0, duration_sec: 0.8, velocity: 0.82, hand: 'RH', measure: 10, beat: 1, finger_hint: 2 },
      { id: 'cla-59', note_name: 'D3', midi_number: 50, onset_time_sec: 28.6, duration_sec: 0.6, velocity: 0.68, hand: 'LH', measure: 10, beat: 1.5, finger_hint: 3 },
      { id: 'cla-60', note_name: 'B3', midi_number: 59, onset_time_sec: 29.2, duration_sec: 0.7, velocity: 0.7, hand: 'LH', measure: 10, beat: 2, finger_hint: 1 },
      { id: 'cla-61', note_name: 'F4', midi_number: 65, onset_time_sec: 29.8, duration_sec: 0.8, velocity: 0.72, hand: 'RH', measure: 10, beat: 2.5, finger_hint: 1 },
      { id: 'cla-62', note_name: 'G4', midi_number: 67, onset_time_sec: 30.4, duration_sec: 1.2, velocity: 0.8, hand: 'RH', measure: 10, beat: 3, finger_hint: 2, lyric_or_annotation: 'Leading tone tension' },

      // MEASURE 11: Main Chorus Recapitulation (High C6 octave reach)
      { id: 'cla-63', note_name: 'C2', midi_number: 36, onset_time_sec: 31.5, duration_sec: 1.5, velocity: 0.85, hand: 'LH', measure: 11, beat: 1, finger_hint: 5, pedal_hint: 'down' },
      { id: 'cla-64', note_name: 'C5', midi_number: 72, onset_time_sec: 31.5, duration_sec: 0.8, velocity: 0.84, hand: 'RH', measure: 11, beat: 1, finger_hint: 1 },
      { id: 'cla-65', note_name: 'G4', midi_number: 67, onset_time_sec: 32.2, duration_sec: 0.7, velocity: 0.75, hand: 'LH', measure: 11, beat: 1.5, finger_hint: 2 },
      { id: 'cla-66', note_name: 'Eb5', midi_number: 75, onset_time_sec: 32.8, duration_sec: 0.8, velocity: 0.86, hand: 'RH', measure: 11, beat: 2, finger_hint: 3 },
      { id: 'cla-67', note_name: 'G5', midi_number: 79, onset_time_sec: 33.4, duration_sec: 1.0, velocity: 0.88, hand: 'RH', measure: 11, beat: 3, finger_hint: 5, lyric_or_annotation: 'Virtuoso arch' },

      // MEASURE 12: Cascading Lyrical Descent
      { id: 'cla-68', note_name: 'Ab2', midi_number: 44, onset_time_sec: 34.4, duration_sec: 1.2, velocity: 0.78, hand: 'LH', measure: 12, beat: 1, finger_hint: 5, pedal_hint: 'change' },
      { id: 'cla-69', note_name: 'F5', midi_number: 77, onset_time_sec: 34.4, duration_sec: 0.6, velocity: 0.82, hand: 'RH', measure: 12, beat: 1, finger_hint: 4 },
      { id: 'cla-70', note_name: 'Eb5', midi_number: 75, onset_time_sec: 35.0, duration_sec: 0.6, velocity: 0.8, hand: 'RH', measure: 12, beat: 2, finger_hint: 3 },
      { id: 'cla-71', note_name: 'D5', midi_number: 74, onset_time_sec: 35.6, duration_sec: 0.6, velocity: 0.78, hand: 'RH', measure: 12, beat: 3, finger_hint: 2 },
      { id: 'cla-72', note_name: 'C5', midi_number: 72, onset_time_sec: 36.2, duration_sec: 1.0, velocity: 0.82, hand: 'RH', measure: 12, beat: 4, finger_hint: 1, lyric_or_annotation: 'Liquid descent' },

      // MEASURE 13: Lyrical Extension over Bb -> Gm
      { id: 'cla-73', note_name: 'Bb2', midi_number: 46, onset_time_sec: 37.2, duration_sec: 1.2, velocity: 0.78, hand: 'LH', measure: 13, beat: 1, finger_hint: 5, pedal_hint: 'change' },
      { id: 'cla-74', note_name: 'D5', midi_number: 74, onset_time_sec: 37.2, duration_sec: 0.8, velocity: 0.8, hand: 'RH', measure: 13, beat: 1, finger_hint: 4 },
      { id: 'cla-75', note_name: 'C5', midi_number: 72, onset_time_sec: 38.0, duration_sec: 0.8, velocity: 0.78, hand: 'RH', measure: 13, beat: 2, finger_hint: 3 },
      { id: 'cla-76', note_name: 'Bb4', midi_number: 70, onset_time_sec: 38.8, duration_sec: 1.0, velocity: 0.76, hand: 'RH', measure: 13, beat: 3, finger_hint: 2 },

      // MEASURE 14: Poco Ritardando & Expressive Poise
      { id: 'cla-77', note_name: 'G2', midi_number: 43, onset_time_sec: 39.8, duration_sec: 1.4, velocity: 0.75, hand: 'LH', measure: 14, beat: 1, finger_hint: 5, pedal_hint: 'change' },
      { id: 'cla-78', note_name: 'Ab4', midi_number: 68, onset_time_sec: 39.8, duration_sec: 0.8, velocity: 0.74, hand: 'RH', measure: 14, beat: 1, finger_hint: 2 },
      { id: 'cla-79', note_name: 'G4', midi_number: 67, onset_time_sec: 40.6, duration_sec: 1.0, velocity: 0.74, hand: 'RH', measure: 14, beat: 2, finger_hint: 1, lyric_or_annotation: 'Ritardando...' },
      { id: 'cla-80', note_name: 'F4', midi_number: 65, onset_time_sec: 41.6, duration_sec: 0.9, velocity: 0.72, hand: 'RH', measure: 14, beat: 3, finger_hint: 2 },

      // MEASURE 15: The Rolling Arpeggio Cadence (pp)
      { id: 'cla-81', note_name: 'C2', midi_number: 36, onset_time_sec: 42.5, duration_sec: 2.0, velocity: 0.75, hand: 'LH', measure: 15, beat: 1, finger_hint: 5, pedal_hint: 'down', lyric_or_annotation: 'Final Arpeggio' },
      { id: 'cla-82', note_name: 'G2', midi_number: 43, onset_time_sec: 43.0, duration_sec: 1.8, velocity: 0.65, hand: 'LH', measure: 15, beat: 1.5, finger_hint: 3 },
      { id: 'cla-83', note_name: 'C3', midi_number: 48, onset_time_sec: 43.5, duration_sec: 1.6, velocity: 0.68, hand: 'LH', measure: 15, beat: 2, finger_hint: 2 },
      { id: 'cla-84', note_name: 'Eb3', midi_number: 51, onset_time_sec: 44.0, duration_sec: 1.5, velocity: 0.7, hand: 'LH', measure: 15, beat: 2.5, finger_hint: 1 },
      { id: 'cla-85', note_name: 'G3', midi_number: 55, onset_time_sec: 44.5, duration_sec: 1.5, velocity: 0.68, hand: 'RH', measure: 15, beat: 3, finger_hint: 1 },
      { id: 'cla-86', note_name: 'C4', midi_number: 60, onset_time_sec: 45.0, duration_sec: 1.5, velocity: 0.72, hand: 'RH', measure: 15, beat: 3.5, finger_hint: 2 },
      { id: 'cla-87', note_name: 'Eb4', midi_number: 63, onset_time_sec: 45.5, duration_sec: 1.5, velocity: 0.74, hand: 'RH', measure: 15, beat: 4, finger_hint: 3 },

      // MEASURE 16: Final Timeless Resolution (Concert Grand Soundboard Fade)
      { id: 'cla-88', note_name: 'C5', midi_number: 72, onset_time_sec: 46.2, duration_sec: 3.5, velocity: 0.78, hand: 'RH', measure: 16, beat: 1, finger_hint: 5, pedal_hint: 'hold', lyric_or_annotation: 'Always (Morendo)' }
    ]
  }
];

