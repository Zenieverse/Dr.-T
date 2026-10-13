import { ClassicalWork, TheoryLesson } from '../types/grandPianoTypes';

export const CLASSICAL_WORKS_DATABASE: ClassicalWork[] = [
  // ==========================================
  // BAROQUE
  // ==========================================
  {
    work_id: 'bach-prelude-c',
    title: 'Prelude in C Major, BWV 846',
    composer: 'Johann Sebastian Bach',
    composer_lifespan: '1685–1750',
    catalogue_number: 'BWV 846',
    composition_period: 'Baroque',
    composition_year: 1722,
    genre: 'Prelude / Polyphonic Study',
    instrumentation: 'Solo Piano',
    difficulty_level: 'Intermediate',
    key_signature: 'C Major',
    time_signature: '4/4',
    tempo_bpm: 68,
    tempo_marking: 'Moderato espressivo',
    description: 'The iconic opening to Book I of The Well-Tempered Clavier. Flowing arpeggiated figures outline pristine harmonic cadences over a steady organ-point bass.',
    tags: ['Well-Tempered Clavier', 'Arpeggios', 'Baroque Harmony', 'Essential Masterpiece'],
    movements_count: 1,
    has_audio: true,
    has_midi: true,
    has_sheet_music: true,
    cover_gradient: 'from-amber-900/80 via-slate-900 to-amber-950/80',
    historical_context: 'Written in Köthen, Bach composed this piece to demonstrate that keyboard instruments tuned in well-temperament could sound exquisite across all twenty-four major and minor keys.',
    movements: [
      {
        movement_id: 'bach-prelude-c-mov1',
        work_id: 'bach-prelude-c',
        movement_number: 1,
        title: 'Prelude in C Major',
        tempo_marking: 'Moderato',
        duration_seconds: 135,
        key_signature: 'C Major',
        time_signature: '4/4',
        tempo_bpm: 68,
        practice_difficulty: 'Intermediate',
        is_verified_complete: true,
        practice_sections: [
          {
            section_id: 'bach-c-phrase1',
            title: 'Measure 1: Tonic C Major Arpeggio (I)',
            measure_start: 1,
            measure_end: 1,
            hand: 'both',
            contour: ['higher', 'higher', 'higher', 'higher', 'same', 'same', 'same', 'same'],
            key_highlights: ['C3', 'E3', 'G3', 'C4', 'E4'],
            theory_insight: 'The pure C Major triad root position (C-E-G-C-E). Left hand anchors the root (C3) while right hand cascades upward twice.',
            rhythm_description: 'Continuous 16th notes (semiquavers) creating an unbroken shimmering wave.',
            suggested_bpm: 60,
            notes: [
              { id: 'b1-1', note_name: 'C3', midi_number: 48, onset_time_sec: 0.0, duration_sec: 2.0, velocity: 0.85, hand: 'LH', measure: 1, beat: 1, finger_hint: 5 },
              { id: 'b1-2', note_name: 'E3', midi_number: 52, onset_time_sec: 0.0, duration_sec: 2.0, velocity: 0.8, hand: 'LH', measure: 1, beat: 1, finger_hint: 3 },
              { id: 'b1-3', note_name: 'G3', midi_number: 55, onset_time_sec: 0.25, duration_sec: 0.4, velocity: 0.75, hand: 'RH', measure: 1, beat: 1.5, finger_hint: 1 },
              { id: 'b1-4', note_name: 'C4', midi_number: 60, onset_time_sec: 0.5, duration_sec: 0.4, velocity: 0.78, hand: 'RH', measure: 1, beat: 2, finger_hint: 2 },
              { id: 'b1-5', note_name: 'E4', midi_number: 64, onset_time_sec: 0.75, duration_sec: 0.4, velocity: 0.8, hand: 'RH', measure: 1, beat: 2.5, finger_hint: 5 },
              { id: 'b1-6', note_name: 'G3', midi_number: 55, onset_time_sec: 1.0, duration_sec: 0.4, velocity: 0.75, hand: 'RH', measure: 1, beat: 3, finger_hint: 1 },
              { id: 'b1-7', note_name: 'C4', midi_number: 60, onset_time_sec: 1.25, duration_sec: 0.4, velocity: 0.78, hand: 'RH', measure: 1, beat: 3.5, finger_hint: 2 },
              { id: 'b1-8', note_name: 'E4', midi_number: 64, onset_time_sec: 1.5, duration_sec: 0.4, velocity: 0.8, hand: 'RH', measure: 1, beat: 4, finger_hint: 5 }
            ]
          },
          {
            section_id: 'bach-c-phrase2',
            title: 'Measure 2: Supertonic D Minor 7th (ii7/4-2)',
            measure_start: 2,
            measure_end: 2,
            hand: 'both',
            contour: ['higher', 'higher', 'higher', 'higher', 'same', 'same', 'same', 'same'],
            key_highlights: ['C3', 'D3', 'A3', 'D4', 'F4'],
            theory_insight: 'Second inversion D minor seventh with pedal C in bass (C-D-A-D-F). Creates beautiful harmonic tension moving toward G7.',
            rhythm_description: 'Synchronized with measure 1; maintain identical touch and gentle phrasing.',
            suggested_bpm: 60,
            notes: [
              { id: 'b2-1', note_name: 'C3', midi_number: 48, onset_time_sec: 2.0, duration_sec: 2.0, velocity: 0.82, hand: 'LH', measure: 2, beat: 1, finger_hint: 5 },
              { id: 'b2-2', note_name: 'D3', midi_number: 50, onset_time_sec: 2.0, duration_sec: 2.0, velocity: 0.8, hand: 'LH', measure: 2, beat: 1, finger_hint: 4 },
              { id: 'b2-3', note_name: 'A3', midi_number: 57, onset_time_sec: 2.25, duration_sec: 0.4, velocity: 0.75, hand: 'RH', measure: 2, beat: 1.5, finger_hint: 1 },
              { id: 'b2-4', note_name: 'D4', midi_number: 62, onset_time_sec: 2.5, duration_sec: 0.4, velocity: 0.78, hand: 'RH', measure: 2, beat: 2, finger_hint: 2 },
              { id: 'b2-5', note_name: 'F4', midi_number: 65, onset_time_sec: 2.75, duration_sec: 0.4, velocity: 0.82, hand: 'RH', measure: 2, beat: 2.5, finger_hint: 5 },
              { id: 'b2-6', note_name: 'A3', midi_number: 57, onset_time_sec: 3.0, duration_sec: 0.4, velocity: 0.75, hand: 'RH', measure: 2, beat: 3, finger_hint: 1 },
              { id: 'b2-7', note_name: 'D4', midi_number: 62, onset_time_sec: 3.25, duration_sec: 0.4, velocity: 0.78, hand: 'RH', measure: 2, beat: 3.5, finger_hint: 2 },
              { id: 'b2-8', note_name: 'F4', midi_number: 65, onset_time_sec: 3.5, duration_sec: 0.4, velocity: 0.82, hand: 'RH', measure: 2, beat: 4, finger_hint: 5 }
            ]
          }
        ]
      }
    ]
  },
  {
    work_id: 'bach-invention-1',
    title: 'Two-Part Invention No. 1 in C Major, BWV 772',
    composer: 'Johann Sebastian Bach',
    composer_lifespan: '1685–1750',
    catalogue_number: 'BWV 772',
    composition_period: 'Baroque',
    composition_year: 1723,
    genre: 'Contrapuntal Keyboard Study',
    instrumentation: 'Solo Piano',
    difficulty_level: 'Late Intermediate',
    key_signature: 'C Major',
    time_signature: '4/4',
    tempo_bpm: 84,
    tempo_marking: 'Allegro moderato',
    description: 'The foundation of polyphonic independent hand playing. The right hand introduces the 7-note subject which the left hand immediately imitates one octave below.',
    tags: ['Counterpoint', 'Two-Part Invention', 'Hand Independence'],
    movements_count: 1,
    has_audio: true,
    has_midi: true,
    has_sheet_music: true,
    cover_gradient: 'from-amber-950 via-slate-900 to-yellow-950',
    historical_context: 'Written as didactic exercises for his eldest son Wilhelm Friedemann, Bach designed these to cultivate clean two-part touch and cantabile playing.',
    movements: [
      {
        movement_id: 'bach-inv1-mov1',
        work_id: 'bach-invention-1',
        movement_number: 1,
        title: 'Invention No. 1',
        tempo_marking: 'Allegro moderato',
        duration_seconds: 78,
        key_signature: 'C Major',
        time_signature: '4/4',
        tempo_bpm: 84,
        practice_difficulty: 'Late Intermediate',
        is_verified_complete: true,
        practice_sections: [
          {
            section_id: 'bach-inv1-subject',
            title: 'Measures 1–2: The Principal Subject',
            measure_start: 1,
            measure_end: 2,
            hand: 'RH',
            contour: ['same', 'higher', 'higher', 'lower', 'higher', 'higher', 'lower'],
            key_highlights: ['C4', 'D4', 'E4', 'F4', 'D4', 'E4', 'C4'],
            theory_insight: 'The 7-note motif starts with an eighth-note rest, rises through a four-note scalar step (C-D-E-F), drops a third to D, steps to E, and resolves to C.',
            rhythm_description: '16th-note motif followed by counterpoint accompaniment.',
            suggested_bpm: 72,
            notes: [
              { id: 'bi1-1', note_name: 'C4', midi_number: 60, onset_time_sec: 0.25, duration_sec: 0.25, velocity: 0.8, hand: 'RH', measure: 1, beat: 1.5, finger_hint: 1 },
              { id: 'bi1-2', note_name: 'D4', midi_number: 62, onset_time_sec: 0.5, duration_sec: 0.25, velocity: 0.82, hand: 'RH', measure: 1, beat: 2, finger_hint: 2 },
              { id: 'bi1-3', note_name: 'E4', midi_number: 64, onset_time_sec: 0.75, duration_sec: 0.25, velocity: 0.84, hand: 'RH', measure: 1, beat: 2.5, finger_hint: 3 },
              { id: 'bi1-4', note_name: 'F4', midi_number: 65, onset_time_sec: 1.0, duration_sec: 0.25, velocity: 0.86, hand: 'RH', measure: 1, beat: 3, finger_hint: 4 },
              { id: 'bi1-5', note_name: 'D4', midi_number: 62, onset_time_sec: 1.25, duration_sec: 0.25, velocity: 0.82, hand: 'RH', measure: 1, beat: 3.5, finger_hint: 2 },
              { id: 'bi1-6', note_name: 'E4', midi_number: 64, onset_time_sec: 1.5, duration_sec: 0.25, velocity: 0.84, hand: 'RH', measure: 1, beat: 4, finger_hint: 3 },
              { id: 'bi1-7', note_name: 'C4', midi_number: 60, onset_time_sec: 1.75, duration_sec: 0.5, velocity: 0.8, hand: 'RH', measure: 1, beat: 4.5, finger_hint: 1 }
            ]
          }
        ]
      }
    ]
  },
  {
    work_id: 'pachelbel-canon-d',
    title: 'Canon in D Major',
    composer: 'Johann Pachelbel',
    composer_lifespan: '1653–1706',
    catalogue_number: 'PWC 37',
    composition_period: 'Baroque',
    composition_year: 1694,
    genre: 'Chaconne / Ground Bass',
    instrumentation: 'Solo Piano',
    difficulty_level: 'Beginner',
    key_signature: 'D Major',
    time_signature: '4/4',
    tempo_bpm: 66,
    tempo_marking: 'Andante cantabile',
    description: 'The world-famous 8-note ostinato ground bass with soaring cascading melodies, loved for centuries for weddings, contemplation, and peaceful reflection.',
    tags: ['Ground Bass', 'Chaconne', 'Relaxing', 'Wedding Classic'],
    movements_count: 1,
    has_audio: true,
    has_midi: true,
    has_sheet_music: true,
    cover_gradient: 'from-amber-800 via-slate-900 to-rose-950',
    historical_context: 'Originally scored for three violins and basso continuo in Nuremberg, its harmonic sequence (I - V - vi - iii - IV - I - IV - V) formed the DNA of modern popular harmony.',
    movements: [
      {
        movement_id: 'pachelbel-canon-mov1',
        work_id: 'pachelbel-canon-d',
        movement_number: 1,
        title: 'Canon in D',
        tempo_marking: 'Andante',
        duration_seconds: 280,
        key_signature: 'D Major',
        time_signature: '4/4',
        tempo_bpm: 66,
        practice_difficulty: 'Beginner',
        is_verified_complete: true,
        practice_sections: [
          {
            section_id: 'pachelbel-ground-bass',
            title: 'Measures 1–4: The 8-Note Ground Bass',
            measure_start: 1,
            measure_end: 4,
            hand: 'LH',
            contour: ['lower', 'higher', 'lower', 'higher', 'lower', 'higher', 'lower'],
            key_highlights: ['D3', 'A2', 'B2', 'F#2', 'G2', 'D2', 'G2', 'A2'],
            theory_insight: 'The immutable 8-note harmonic backbone: D - A - B - F# - G - D - G - A. Each note holds for two beats.',
            rhythm_description: 'Steady half notes in 4/4 time.',
            suggested_bpm: 66,
            notes: [
              { id: 'pc-1', note_name: 'D3', midi_number: 50, onset_time_sec: 0.0, duration_sec: 1.8, velocity: 0.85, hand: 'LH', measure: 1, beat: 1, finger_hint: 1 },
              { id: 'pc-2', note_name: 'A2', midi_number: 45, onset_time_sec: 1.81, duration_sec: 1.8, velocity: 0.8, hand: 'LH', measure: 1, beat: 3, finger_hint: 5 },
              { id: 'pc-3', note_name: 'B2', midi_number: 47, onset_time_sec: 3.63, duration_sec: 1.8, velocity: 0.8, hand: 'LH', measure: 2, beat: 1, finger_hint: 4 },
              { id: 'pc-4', note_name: 'F#2', midi_number: 42, onset_time_sec: 5.45, duration_sec: 1.8, velocity: 0.78, hand: 'LH', measure: 2, beat: 3, finger_hint: 5 },
              { id: 'pc-5', note_name: 'G2', midi_number: 43, onset_time_sec: 7.27, duration_sec: 1.8, velocity: 0.82, hand: 'LH', measure: 3, beat: 1, finger_hint: 4 },
              { id: 'pc-6', note_name: 'D2', midi_number: 38, onset_time_sec: 9.09, duration_sec: 1.8, velocity: 0.8, hand: 'LH', measure: 3, beat: 3, finger_hint: 5 },
              { id: 'pc-7', note_name: 'G2', midi_number: 43, onset_time_sec: 10.9, duration_sec: 1.8, velocity: 0.82, hand: 'LH', measure: 4, beat: 1, finger_hint: 4 },
              { id: 'pc-8', note_name: 'A2', midi_number: 45, onset_time_sec: 12.72, duration_sec: 1.8, velocity: 0.85, hand: 'LH', measure: 4, beat: 3, finger_hint: 3 }
            ]
          }
        ]
      }
    ]
  },

  // ==========================================
  // CLASSICAL PERIOD
  // ==========================================
  {
    work_id: 'beethoven-fur-elise',
    title: 'Für Elise, WoO 59',
    composer: 'Ludwig van Beethoven',
    composer_lifespan: '1770–1827',
    catalogue_number: 'WoO 59',
    composition_period: 'Classical',
    composition_year: 1810,
    genre: 'Bagatelle in A Minor',
    instrumentation: 'Solo Piano',
    difficulty_level: 'Intermediate',
    key_signature: 'A Minor',
    time_signature: '3/8',
    tempo_bpm: 132,
    tempo_marking: 'Poco moto',
    description: 'The beloved semitone oscillation (E - D# - E - D# - E) that every pianist dreams of playing. Opens with a delicate romantic cantabile before unleashing dramatic storm episodes.',
    tags: ['Für Elise', 'A Minor', 'Beethoven Bagatelle', 'Legendary Theme'],
    movements_count: 1,
    has_audio: true,
    has_midi: true,
    has_sheet_music: true,
    cover_gradient: 'from-emerald-950 via-slate-900 to-teal-950',
    historical_context: 'Discovered in 1867 long after Beethoven passed away, the dedication was likely intended for Therese Malfatti or Elisabeth Röckel.',
    movements: [
      {
        movement_id: 'beethoven-fur-elise-mov1',
        work_id: 'beethoven-fur-elise',
        movement_number: 1,
        title: 'Poco moto',
        tempo_marking: 'Poco moto (♩. = 44 / ♪ = 132)',
        duration_seconds: 195,
        key_signature: 'A Minor',
        time_signature: '3/8',
        tempo_bpm: 132,
        practice_difficulty: 'Intermediate',
        is_verified_complete: true,
        practice_sections: [
          {
            section_id: 'fur-elise-opening-motif',
            title: 'Measures 1–4: Semitone Flutter & Arpeggiated A Minor',
            measure_start: 1,
            measure_end: 4,
            hand: 'both',
            contour: ['lower', 'higher', 'lower', 'higher', 'lower', 'lower', 'lower', 'lower'],
            key_highlights: ['E5', 'D#5', 'B4', 'D5', 'C5', 'A4'],
            theory_insight: 'The iconic E5 - D#5 semitone alternation builds yearning. Resolves down through the dominant triad B-D to tonic C-A over an A-minor broken bass.',
            rhythm_description: 'Flowing 16th notes in compound 3/8 meter.',
            suggested_bpm: 110,
            notes: [
              { id: 'fe-1', note_name: 'E5', midi_number: 76, onset_time_sec: 0.0, duration_sec: 0.22, velocity: 0.82, hand: 'RH', measure: 1, beat: 1, finger_hint: 5 },
              { id: 'fe-2', note_name: 'D#5', midi_number: 75, onset_time_sec: 0.23, duration_sec: 0.22, velocity: 0.8, hand: 'RH', measure: 1, beat: 2, finger_hint: 4 },
              { id: 'fe-3', note_name: 'E5', midi_number: 76, onset_time_sec: 0.45, duration_sec: 0.22, velocity: 0.82, hand: 'RH', measure: 1, beat: 3, finger_hint: 5 },
              { id: 'fe-4', note_name: 'D#5', midi_number: 75, onset_time_sec: 0.68, duration_sec: 0.22, velocity: 0.8, hand: 'RH', measure: 2, beat: 1, finger_hint: 4 },
              { id: 'fe-5', note_name: 'E5', midi_number: 76, onset_time_sec: 0.9, duration_sec: 0.22, velocity: 0.82, hand: 'RH', measure: 2, beat: 2, finger_hint: 5 },
              { id: 'fe-6', note_name: 'B4', midi_number: 71, onset_time_sec: 1.13, duration_sec: 0.22, velocity: 0.78, hand: 'RH', measure: 2, beat: 3, finger_hint: 1 },
              { id: 'fe-7', note_name: 'D5', midi_number: 74, onset_time_sec: 1.35, duration_sec: 0.22, velocity: 0.8, hand: 'RH', measure: 3, beat: 1, finger_hint: 3 },
              { id: 'fe-8', note_name: 'C5', midi_number: 72, onset_time_sec: 1.58, duration_sec: 0.22, velocity: 0.82, hand: 'RH', measure: 3, beat: 2, finger_hint: 2 },
              { id: 'fe-9', note_name: 'A4', midi_number: 69, onset_time_sec: 1.8, duration_sec: 0.6, velocity: 0.85, hand: 'RH', measure: 3, beat: 3, finger_hint: 1 },
              { id: 'fe-10', note_name: 'A2', midi_number: 45, onset_time_sec: 1.8, duration_sec: 0.6, velocity: 0.8, hand: 'LH', measure: 3, beat: 3, finger_hint: 5 },
              { id: 'fe-11', note_name: 'E3', midi_number: 52, onset_time_sec: 2.1, duration_sec: 0.4, velocity: 0.75, hand: 'LH', measure: 4, beat: 1, finger_hint: 2 },
              { id: 'fe-12', note_name: 'A3', midi_number: 57, onset_time_sec: 2.3, duration_sec: 0.4, velocity: 0.75, hand: 'LH', measure: 4, beat: 2, finger_hint: 1 }
            ]
          }
        ]
      }
    ]
  },
  {
    work_id: 'beethoven-moonlight',
    title: 'Moonlight Sonata, Op. 27 No. 2',
    composer: 'Ludwig van Beethoven',
    composer_lifespan: '1770–1827',
    catalogue_number: 'Op. 27 No. 2',
    composition_period: 'Classical',
    composition_year: 1801,
    genre: 'Piano Sonata in C-sharp Minor',
    instrumentation: 'Solo Piano',
    difficulty_level: 'Advanced',
    key_signature: 'C-sharp Minor',
    time_signature: '2/2 (Alla breve)',
    tempo_bpm: 54,
    tempo_marking: 'Adagio sostenuto',
    description: 'Subtitled "Sonata quasi una fantasia", this legendary three-movement work journeys from ethereal lake nocturnal triplets to an electrifying, stormy virtuoso finale.',
    tags: ['Moonlight Sonata', 'All 3 Movements', 'C# Minor', 'Epic Masterpiece'],
    movements_count: 3,
    has_audio: true,
    has_midi: true,
    has_sheet_music: true,
    cover_gradient: 'from-indigo-950 via-slate-900 to-blue-950',
    historical_context: 'Dedicated to his 16-year-old pupil Countess Giulietta Guicciardi, German music critic Ludwig Rellstab compared the first movement to moonlit boat ripples on Lake Lucerne.',
    movements: [
      {
        movement_id: 'moonlight-mov1',
        work_id: 'beethoven-moonlight',
        movement_number: 1,
        title: 'I. Adagio sostenuto',
        tempo_marking: 'Adagio sostenuto',
        duration_seconds: 340,
        key_signature: 'C-sharp Minor',
        time_signature: '2/2',
        tempo_bpm: 54,
        practice_difficulty: 'Intermediate',
        is_verified_complete: true,
        practice_sections: [
          {
            section_id: 'moonlight-mov1-theme',
            title: 'Measures 1–5: Sombre Ostinato Triplets & Melodic Entry',
            measure_start: 1,
            measure_end: 5,
            hand: 'both',
            contour: ['higher', 'higher', 'same', 'same'],
            key_highlights: ['C#3', 'G#3', 'C#4', 'E4', 'G#4'],
            theory_insight: 'The right-hand inner voices whisper unbroken G#3-C#4-E4 eighth-note triplets, while measure 5 introduces the solemn dotted melody note G#4 on the pinky.',
            rhythm_description: 'Eighth-note triplets against solemn half-note octaves in the bass.',
            suggested_bpm: 50,
            notes: [
              { id: 'ml1-1', note_name: 'C#2', midi_number: 37, onset_time_sec: 0.0, duration_sec: 3.5, velocity: 0.8, hand: 'LH', measure: 1, beat: 1, finger_hint: 5 },
              { id: 'ml1-2', note_name: 'C#3', midi_number: 49, onset_time_sec: 0.0, duration_sec: 3.5, velocity: 0.78, hand: 'LH', measure: 1, beat: 1, finger_hint: 1 },
              { id: 'ml1-3', note_name: 'G#3', midi_number: 56, onset_time_sec: 0.0, duration_sec: 0.35, velocity: 0.65, hand: 'RH', measure: 1, beat: 1, finger_hint: 1 },
              { id: 'ml1-4', note_name: 'C#4', midi_number: 61, onset_time_sec: 0.35, duration_sec: 0.35, velocity: 0.65, hand: 'RH', measure: 1, beat: 1.33, finger_hint: 2 },
              { id: 'ml1-5', note_name: 'E4', midi_number: 64, onset_time_sec: 0.7, duration_sec: 0.35, velocity: 0.65, hand: 'RH', measure: 1, beat: 1.66, finger_hint: 3 }
            ]
          }
        ]
      },
      {
        movement_id: 'moonlight-mov2',
        work_id: 'beethoven-moonlight',
        movement_number: 2,
        title: 'II. Allegretto (A flower between two chasms)',
        tempo_marking: 'Allegretto',
        duration_seconds: 145,
        key_signature: 'D-flat Major',
        time_signature: '3/4',
        tempo_bpm: 120,
        practice_difficulty: 'Intermediate',
        is_verified_complete: true,
        practice_sections: [
          {
            section_id: 'moonlight-mov2-menuetto',
            title: 'Scherzando Grace & Lyrical Respite',
            measure_start: 1,
            measure_end: 8,
            hand: 'both',
            contour: ['higher', 'lower', 'higher'],
            key_highlights: ['Db4', 'F4', 'Ab4'],
            theory_insight: 'Liszt famously called this movement "a flower between two abysses". Enharmonically shifts from C# minor to Db major.',
            rhythm_description: 'Syncopated lilting menuetto dance in 3/4.',
            suggested_bpm: 110,
            notes: []
          }
        ]
      },
      {
        movement_id: 'moonlight-mov3',
        work_id: 'beethoven-moonlight',
        movement_number: 3,
        title: 'III. Presto agitato',
        tempo_marking: 'Presto agitato',
        duration_seconds: 460,
        key_signature: 'C-sharp Minor',
        time_signature: '4/4',
        tempo_bpm: 168,
        practice_difficulty: 'Virtuoso',
        is_verified_complete: true,
        practice_sections: [
          {
            section_id: 'moonlight-mov3-arpeggio-storm',
            title: 'The Ascending Arpeggio Lightning Bolts',
            measure_start: 1,
            measure_end: 4,
            hand: 'both',
            contour: ['higher', 'higher', 'higher', 'higher'],
            key_highlights: ['C#3', 'E3', 'G#3', 'C#4', 'E4', 'G#4', 'C#5'],
            theory_insight: 'Ferocious 16th-note arpeggios rocket up the keyboard and slam into double-sforzando accents on beat 4.',
            rhythm_description: 'Relentless virtuosic torrent of 16th notes.',
            suggested_bpm: 130,
            notes: []
          }
        ]
      }
    ]
  },
  {
    work_id: 'mozart-sonata-c-545',
    title: 'Piano Sonata No. 16 in C Major, K. 545',
    composer: 'Wolfgang Amadeus Mozart',
    composer_lifespan: '1756–1791',
    catalogue_number: 'K. 545',
    composition_period: 'Classical',
    composition_year: 1788,
    genre: 'Sonata facile',
    instrumentation: 'Solo Piano',
    difficulty_level: 'Intermediate',
    key_signature: 'C Major',
    time_signature: '4/4',
    tempo_bpm: 120,
    tempo_marking: 'Allegro',
    description: 'The epitome of Viennese classical clarity. Features the textbook Alberti bass accompaniment in the left hand beneath sparkling diatonic melodies.',
    tags: ['Sonata Facile', 'Mozart K.545', 'Alberti Bass', 'Classical Perfection'],
    movements_count: 3,
    has_audio: true,
    has_midi: true,
    has_sheet_music: true,
    cover_gradient: 'from-sky-950 via-slate-900 to-indigo-950',
    historical_context: 'Entered in Mozart’s thematic catalogue as "a little piano sonata for beginners", yet demanding total precision, rhythmic poise, and crystalline touch.',
    movements: [
      {
        movement_id: 'mozart-545-mov1',
        work_id: 'mozart-sonata-c-545',
        movement_number: 1,
        title: 'I. Allegro',
        tempo_marking: 'Allegro',
        duration_seconds: 195,
        key_signature: 'C Major',
        time_signature: '4/4',
        tempo_bpm: 120,
        practice_difficulty: 'Intermediate',
        is_verified_complete: true,
        practice_sections: [
          {
            section_id: 'mozart-545-theme1',
            title: 'Measures 1–4: Opening Cantabile & Alberti Bass',
            measure_start: 1,
            measure_end: 4,
            hand: 'both',
            contour: ['higher', 'higher', 'lower', 'higher', 'lower', 'lower'],
            key_highlights: ['C5', 'E5', 'G5', 'B4', 'C5', 'D5', 'C5'],
            theory_insight: 'Right hand sings a noble ascending tonic triad arpeggio (C-E-G) over an unbroken left hand Alberti bass (C3-G3-E3-G3).',
            rhythm_description: 'Half note opening followed by flowing 16th-note scalar runs.',
            suggested_bpm: 100,
            notes: [
              { id: 'mz-1', note_name: 'C5', midi_number: 72, onset_time_sec: 0.0, duration_sec: 0.95, velocity: 0.85, hand: 'RH', measure: 1, beat: 1, finger_hint: 1 },
              { id: 'mz-2', note_name: 'E5', midi_number: 76, onset_time_sec: 1.0, duration_sec: 0.45, velocity: 0.82, hand: 'RH', measure: 1, beat: 3, finger_hint: 3 },
              { id: 'mz-3', note_name: 'G5', midi_number: 79, onset_time_sec: 1.5, duration_sec: 0.45, velocity: 0.85, hand: 'RH', measure: 1, beat: 4, finger_hint: 5 },
              { id: 'mz-4', note_name: 'B4', midi_number: 71, onset_time_sec: 2.0, duration_sec: 0.7, velocity: 0.8, hand: 'RH', measure: 2, beat: 1, finger_hint: 1 },
              { id: 'mz-5', note_name: 'C5', midi_number: 72, onset_time_sec: 2.75, duration_sec: 0.25, velocity: 0.82, hand: 'RH', measure: 2, beat: 2.5, finger_hint: 2 },
              { id: 'mz-6', note_name: 'D5', midi_number: 74, onset_time_sec: 3.0, duration_sec: 0.25, velocity: 0.83, hand: 'RH', measure: 2, beat: 3, finger_hint: 3 },
              { id: 'mz-7', note_name: 'C5', midi_number: 72, onset_time_sec: 3.25, duration_sec: 0.7, velocity: 0.8, hand: 'RH', measure: 2, beat: 3.5, finger_hint: 2 }
            ]
          }
        ]
      },
      {
        movement_id: 'mozart-545-mov2',
        work_id: 'mozart-sonata-c-545',
        movement_number: 2,
        title: 'II. Andante',
        tempo_marking: 'Andante',
        duration_seconds: 240,
        key_signature: 'G Major',
        time_signature: '3/4',
        tempo_bpm: 66,
        practice_difficulty: 'Intermediate',
        is_verified_complete: true,
        practice_sections: []
      },
      {
        movement_id: 'mozart-545-mov3',
        work_id: 'mozart-sonata-c-545',
        movement_number: 3,
        title: 'III. Rondo: Allegretto',
        tempo_marking: 'Allegretto',
        duration_seconds: 110,
        key_signature: 'C Major',
        time_signature: '2/4',
        tempo_bpm: 116,
        practice_difficulty: 'Intermediate',
        is_verified_complete: true,
        practice_sections: []
      }
    ]
  },

  // ==========================================
  // ROMANTIC PERIOD
  // ==========================================
  {
    work_id: 'chopin-nocturne-op9-2',
    title: 'Nocturne in E-flat Major, Op. 9 No. 2',
    composer: 'Frédéric Chopin',
    composer_lifespan: '1810–1849',
    catalogue_number: 'Op. 9 No. 2',
    composition_period: 'Romantic',
    composition_year: 1832,
    genre: 'Nocturne / Bel Canto Piano',
    instrumentation: 'Solo Piano',
    difficulty_level: 'Late Intermediate',
    key_signature: 'E-flat Major',
    time_signature: '12/8',
    tempo_bpm: 132,
    tempo_marking: 'Andante (♩. = 44)',
    description: 'Chopin’s most celebrated nocturne. Translates Italian bel canto opera into pure piano poetry, floating florid fiorituras over a gentle waltz-like accompaniment.',
    tags: ['Nocturne', 'Chopin', 'Bel Canto', 'Romantic Poetry'],
    movements_count: 1,
    has_audio: true,
    has_midi: true,
    has_sheet_music: true,
    cover_gradient: 'from-violet-950 via-slate-900 to-indigo-950',
    historical_context: 'Composed when Chopin was just twenty in Paris, dedicated to Marie Pleyel, wife of the famed piano builder Camille Pleyel.',
    movements: [
      {
        movement_id: 'chopin-op9-2-mov1',
        work_id: 'chopin-nocturne-op9-2',
        movement_number: 1,
        title: 'Andante',
        tempo_marking: 'Andante espressivo',
        duration_seconds: 275,
        key_signature: 'E-flat Major',
        time_signature: '12/8',
        tempo_bpm: 132,
        practice_difficulty: 'Late Intermediate',
        is_verified_complete: true,
        practice_sections: [
          {
            section_id: 'chopin-nocturne-main-theme',
            title: 'Measures 1–4: The Lyrical Opening Cantilena',
            measure_start: 1,
            measure_end: 4,
            hand: 'both',
            contour: ['higher', 'lower', 'higher', 'lower'],
            key_highlights: ['Bb4', 'G5', 'F5', 'Eb5', 'Bb4'],
            theory_insight: 'The melody ascends a gentle sixth from Bb4 to G5, then gracefully descends with expressive appoggiaturas over an Eb major triad bass.',
            rhythm_description: 'Compound quadruple 12/8 time: four dotted-quarter beats per bar.',
            suggested_bpm: 110,
            notes: [
              { id: 'ch-1', note_name: 'Bb4', midi_number: 70, onset_time_sec: 0.0, duration_sec: 0.7, velocity: 0.8, hand: 'RH', measure: 1, beat: 1, finger_hint: 1 },
              { id: 'ch-2', note_name: 'G5', midi_number: 79, onset_time_sec: 0.75, duration_sec: 1.1, velocity: 0.85, hand: 'RH', measure: 1, beat: 2, finger_hint: 5 },
              { id: 'ch-3', note_name: 'F5', midi_number: 77, onset_time_sec: 1.9, duration_sec: 0.4, velocity: 0.8, hand: 'RH', measure: 1, beat: 3.5, finger_hint: 4 },
              { id: 'ch-4', note_name: 'Eb5', midi_number: 75, onset_time_sec: 2.3, duration_sec: 0.8, velocity: 0.82, hand: 'RH', measure: 1, beat: 4, finger_hint: 3 }
            ]
          }
        ]
      }
    ]
  },
  {
    work_id: 'chopin-prelude-e-minor',
    title: 'Prelude in E Minor, Op. 28 No. 4',
    composer: 'Frédéric Chopin',
    composer_lifespan: '1810–1849',
    catalogue_number: 'Op. 28 No. 4',
    composition_period: 'Romantic',
    composition_year: 1839,
    genre: 'Prelude',
    instrumentation: 'Solo Piano',
    difficulty_level: 'Intermediate',
    key_signature: 'E Minor',
    time_signature: '2/2 (Alla breve)',
    tempo_bpm: 50,
    tempo_marking: 'Largo',
    description: 'A heartbreaking masterclass in chromatic voice leading. A simple, sobbing right-hand melody suspended over slowly sinking, sighing left-hand chords.',
    tags: ['Chopin Prelude', 'Chromatic Harmony', 'Melancholy', 'Funeral Prelude'],
    movements_count: 1,
    has_audio: true,
    has_midi: true,
    has_sheet_music: true,
    cover_gradient: 'from-stone-900 via-slate-900 to-rose-950',
    historical_context: 'Played on the organ at Chopin’s own funeral in the Church of the Madeleine in Paris, as requested in his final wishes.',
    movements: [
      {
        movement_id: 'chopin-e-minor-mov1',
        work_id: 'chopin-prelude-e-minor',
        movement_number: 1,
        title: 'Largo',
        tempo_marking: 'Largo',
        duration_seconds: 140,
        key_signature: 'E Minor',
        time_signature: '2/2',
        tempo_bpm: 50,
        practice_difficulty: 'Intermediate',
        is_verified_complete: true,
        practice_sections: [
          {
            section_id: 'chopin-prelude-sigh',
            title: 'Measures 1–4: The Chromatic Descent & Melodic Sigh',
            measure_start: 1,
            measure_end: 4,
            hand: 'both',
            contour: ['same', 'same', 'lower', 'lower'],
            key_highlights: ['B4', 'A#4', 'A4', 'G#4', 'G4'],
            theory_insight: 'Right hand holds the long sighing B4 note while the left hand pulses repeated eighth-note chords whose inner voices sink chromatically by semitones.',
            rhythm_description: 'Pulsing eighth-note chordal accompaniment under sustained singing melody.',
            suggested_bpm: 46,
            notes: [
              { id: 'cp-1', note_name: 'B4', midi_number: 71, onset_time_sec: 0.0, duration_sec: 3.5, velocity: 0.8, hand: 'RH', measure: 1, beat: 1, finger_hint: 4 },
              { id: 'cp-2', note_name: 'E3', midi_number: 52, onset_time_sec: 0.0, duration_sec: 0.5, velocity: 0.65, hand: 'LH', measure: 1, beat: 1, finger_hint: 5 },
              { id: 'cp-3', note_name: 'G3', midi_number: 55, onset_time_sec: 0.0, duration_sec: 0.5, velocity: 0.65, hand: 'LH', measure: 1, beat: 1, finger_hint: 3 },
              { id: 'cp-4', note_name: 'B3', midi_number: 59, onset_time_sec: 0.0, duration_sec: 0.5, velocity: 0.65, hand: 'LH', measure: 1, beat: 1, finger_hint: 1 }
            ]
          }
        ]
      }
    ]
  },
  {
    work_id: 'schumann-traumerei',
    title: 'Träumerei, Op. 15 No. 7',
    composer: 'Robert Schumann',
    composer_lifespan: '1810–1856',
    catalogue_number: 'Op. 15 No. 7',
    composition_period: 'Romantic',
    composition_year: 1838,
    genre: 'Character Piece (Kinderszenen)',
    instrumentation: 'Solo Piano',
    difficulty_level: 'Intermediate',
    key_signature: 'F Major',
    time_signature: '4/4',
    tempo_bpm: 56,
    tempo_marking: 'Andante espressivo',
    description: '"Dreaming" from Scenes from Childhood. An intimate, soaring four-bar arch that breathes like a child lost in innocent wonder.',
    tags: ['Kinderszenen', 'Dreaming', 'Romantic Miniature', 'Warm Lyrical'],
    movements_count: 1,
    has_audio: true,
    has_midi: true,
    has_sheet_music: true,
    cover_gradient: 'from-amber-950 via-slate-900 to-emerald-950',
    historical_context: 'Written by Robert for his beloved Clara Wieck during their painful separation, evoking the purity of nostalgic memories.',
    movements: [
      {
        movement_id: 'schumann-traum-mov1',
        work_id: 'schumann-traumerei',
        movement_number: 1,
        title: 'Träumerei',
        tempo_marking: 'Poco adagio',
        duration_seconds: 180,
        key_signature: 'F Major',
        time_signature: '4/4',
        tempo_bpm: 56,
        practice_difficulty: 'Intermediate',
        is_verified_complete: true,
        practice_sections: []
      }
    ]
  },

  // ==========================================
  // IMPRESSIONIST & RELAXING
  // ==========================================
  {
    work_id: 'debussy-clair-de-lune',
    title: 'Clair de Lune',
    composer: 'Claude Debussy',
    composer_lifespan: '1862–1918',
    catalogue_number: 'L. 75 No. 3',
    composition_period: 'Impressionist',
    composition_year: 1890,
    genre: 'Nocturnal Suite Movement',
    instrumentation: 'Solo Piano',
    difficulty_level: 'Late Intermediate',
    key_signature: 'D-flat Major',
    time_signature: '9/8',
    tempo_bpm: 50,
    tempo_marking: 'Andante très expressif',
    description: 'Inspired by Paul Verlaine’s moonlit poem, this piece paints shimmering pastel colours and delicate nocturnal water reflections through rich extended tertian harmonies.',
    tags: ['Clair de Lune', 'Impressionism', 'Moonlight', 'Debussy Masterpiece'],
    movements_count: 1,
    has_audio: true,
    has_midi: true,
    has_sheet_music: true,
    cover_gradient: 'from-cyan-950 via-slate-900 to-indigo-950',
    historical_context: 'The third movement of the Suite bergamasque, published in 1905, epitomizes musical Impressionism, where timbre and atmosphere supersede rigid functional harmony.',
    movements: [
      {
        movement_id: 'debussy-cdl-mov1',
        work_id: 'debussy-clair-de-lune',
        movement_number: 1,
        title: 'Clair de Lune',
        tempo_marking: 'Andante très expressif',
        duration_seconds: 310,
        key_signature: 'D-flat Major',
        time_signature: '9/8',
        tempo_bpm: 50,
        practice_difficulty: 'Late Intermediate',
        is_verified_complete: true,
        practice_sections: [
          {
            section_id: 'debussy-cdl-opening',
            title: 'Measures 1–4: Moonlit Parallel Thirds & Suspensions',
            measure_start: 1,
            measure_end: 4,
            hand: 'both',
            contour: ['same', 'lower', 'lower', 'higher'],
            key_highlights: ['F5', 'Eb5', 'Db5', 'C5', 'Bb4'],
            theory_insight: 'Opens on an upbeat with muted parallel thirds in the upper register, blurring the downbeat across compound triple 9/8 time in five-flat Db Major.',
            rhythm_description: 'Tied syncopated duplets against triplet beats producing a floating, weightless rubato.',
            suggested_bpm: 46,
            notes: [
              { id: 'cdl-1', note_name: 'F5', midi_number: 77, onset_time_sec: 0.0, duration_sec: 1.2, velocity: 0.75, hand: 'RH', measure: 1, beat: 2.5, finger_hint: 4 },
              { id: 'cdl-2', note_name: 'Eb5', midi_number: 75, onset_time_sec: 1.25, duration_sec: 1.2, velocity: 0.73, hand: 'RH', measure: 1, beat: 3.5, finger_hint: 3 },
              { id: 'cdl-3', note_name: 'Db5', midi_number: 73, onset_time_sec: 2.5, duration_sec: 1.2, velocity: 0.72, hand: 'RH', measure: 2, beat: 1, finger_hint: 2 },
              { id: 'cdl-4', note_name: 'C5', midi_number: 72, onset_time_sec: 3.75, duration_sec: 1.2, velocity: 0.7, hand: 'RH', measure: 2, beat: 2, finger_hint: 1 }
            ]
          }
        ]
      }
    ]
  },
  {
    work_id: 'satie-gymnopedie-1',
    title: 'Gymnopédie No. 1',
    composer: 'Erik Satie',
    composer_lifespan: '1866–1925',
    catalogue_number: 'Gymnopédies No. 1',
    composition_period: 'Impressionist',
    composition_year: 1888,
    genre: 'Minimalist Atmospheric Dance',
    instrumentation: 'Solo Piano',
    difficulty_level: 'Beginner',
    key_signature: 'D Major',
    time_signature: '3/4',
    tempo_bpm: 64,
    tempo_marking: 'Lent et douloureux',
    description: 'Ancient, hypnotic, and tranquil. Alternating major-seventh chords sway gently beneath a solitary, timeless modal melody in 3/4 time.',
    tags: ['Satie', 'Gymnopédie', 'Minimalist', 'Ambient Classical', 'Pure Peace'],
    movements_count: 1,
    has_audio: true,
    has_midi: true,
    has_sheet_music: true,
    cover_gradient: 'from-emerald-950 via-slate-900 to-cyan-950',
    historical_context: 'Written in Montmartre Paris, Satie was inspired by ancient Greek youths dancing at Spartan festivals, stripping music down to its absolute contemplative essence.',
    movements: [
      {
        movement_id: 'satie-gym1-mov1',
        work_id: 'satie-gymnopedie-1',
        movement_number: 1,
        title: 'Lent et douloureux',
        tempo_marking: 'Lent et douloureux',
        duration_seconds: 215,
        key_signature: 'D Major',
        time_signature: '3/4',
        tempo_bpm: 64,
        practice_difficulty: 'Beginner',
        is_verified_complete: true,
        practice_sections: [
          {
            section_id: 'satie-gym-chords',
            title: 'Measures 1–8: The Alternating Gmaj7 and Dmaj7 Pendulum',
            measure_start: 1,
            measure_end: 8,
            hand: 'both',
            contour: ['same', 'higher', 'lower', 'same'],
            key_highlights: ['G2', 'B3', 'D4', 'F#4', 'D2', 'F#3', 'A3', 'C#4'],
            theory_insight: 'The left hand creates a slow pendulum: bass note on beat 1, then high major-seventh chord on beats 2 & 3. Measure 5 introduces the lonely modal melody.',
            rhythm_description: 'Unbroken 3/4 waltz rhythm played with absolute stillness and tenderness.',
            suggested_bpm: 60,
            notes: [
              { id: 'sg-1', note_name: 'G2', midi_number: 43, onset_time_sec: 0.0, duration_sec: 0.9, velocity: 0.8, hand: 'LH', measure: 1, beat: 1, finger_hint: 5 },
              { id: 'sg-2', note_name: 'B3', midi_number: 59, onset_time_sec: 0.95, duration_sec: 1.8, velocity: 0.72, hand: 'LH', measure: 1, beat: 2, finger_hint: 3 },
              { id: 'sg-3', note_name: 'D4', midi_number: 62, onset_time_sec: 0.95, duration_sec: 1.8, velocity: 0.72, hand: 'LH', measure: 1, beat: 2, finger_hint: 2 },
              { id: 'sg-4', note_name: 'F#4', midi_number: 66, onset_time_sec: 0.95, duration_sec: 1.8, velocity: 0.74, hand: 'LH', measure: 1, beat: 2, finger_hint: 1 },
              { id: 'sg-5', note_name: 'D2', midi_number: 38, onset_time_sec: 2.85, duration_sec: 0.9, velocity: 0.8, hand: 'LH', measure: 2, beat: 1, finger_hint: 5 },
              { id: 'sg-6', note_name: 'F#3', midi_number: 54, onset_time_sec: 3.8, duration_sec: 1.8, velocity: 0.72, hand: 'LH', measure: 2, beat: 2, finger_hint: 3 },
              { id: 'sg-7', note_name: 'A3', midi_number: 57, onset_time_sec: 3.8, duration_sec: 1.8, velocity: 0.72, hand: 'LH', measure: 2, beat: 2, finger_hint: 2 },
              { id: 'sg-8', note_name: 'C#4', midi_number: 61, onset_time_sec: 3.8, duration_sec: 1.8, velocity: 0.74, hand: 'LH', measure: 2, beat: 2, finger_hint: 1 }
            ]
          }
        ]
      }
    ]
  },
  {
    work_id: 'clayderman-always',
    title: 'Always (Complete Romantic Ballad)',
    composer: 'Richard Clayderman',
    composer_lifespan: '1953–Present',
    catalogue_number: 'Arr. "Qin Qian 99" & Romantic Tour',
    composition_period: 'Romantic',
    composition_year: 1999,
    genre: 'New Romantic Lyrical Piano Ballad',
    instrumentation: 'Solo Piano',
    difficulty_level: 'Intermediate',
    key_signature: 'C Minor / Eb Major',
    time_signature: '4/4',
    tempo_bpm: 80,
    tempo_marking: 'Andante amoroso con rubato',
    description: 'The definitive modern French New Romantic piano piece. Rolling 10th-interval left-hand arpeggios carry a heartfelt cantabile melody with delicate rubato and rich soundboard warmth.',
    tags: ['Clayderman', 'Always', 'New Romantic', 'Cantabile', 'Arpeggio Masterclass', 'Lyrical Ballad'],
    movements_count: 1,
    has_audio: true,
    has_midi: true,
    has_sheet_music: true,
    cover_gradient: 'from-rose-950 via-stone-900 to-amber-950',
    historical_context: 'Recorded and popularized worldwide by Richard Clayderman on his celebrated Asian release "Qin Qian 99" (adapting "那么爱你为什么" / "Always"). It pioneered combining acoustic concert grand depth with intimate pop-romantic phrasing.',
    movements: [
      {
        movement_id: 'clayderman-always-mov1',
        work_id: 'clayderman-always',
        movement_number: 1,
        title: 'Andante amoroso con rubato',
        tempo_marking: 'Andante amoroso con rubato (♩ = 80)',
        duration_seconds: 240,
        key_signature: 'C Minor / Eb Major',
        time_signature: '4/4',
        tempo_bpm: 80,
        practice_difficulty: 'Intermediate',
        is_verified_complete: true,
        practice_sections: [
          {
            section_id: 'clayderman-always-sec1-prologue',
            title: 'Measures 1–4: The Arpeggiated Prologue & Theme A Entry',
            measure_start: 1,
            measure_end: 4,
            hand: 'both',
            contour: ['lower', 'higher', 'higher', 'lower'],
            key_highlights: ['C2', 'G2', 'C3', 'Eb3', 'G4', 'C5', 'D5', 'Eb5'],
            theory_insight: 'The left hand outlines a rolling C Minor arpeggio (C-G-C-Eb) spanning over an octave. Keep the wrist flexible. In measure 3, the right hand introduces the tender Theme A starting on G4.',
            rhythm_description: 'Fluid 16th-note arpeggio accompaniment beneath expressive quarter and eighth note cantabile phrasing.',
            suggested_bpm: 76,
            notes: [
              { id: 'ca-1', note_name: 'C2', midi_number: 36, onset_time_sec: 0.0, duration_sec: 0.8, velocity: 0.75, hand: 'LH', measure: 1, beat: 1, finger_hint: 5 },
              { id: 'ca-2', note_name: 'G2', midi_number: 43, onset_time_sec: 0.4, duration_sec: 0.7, velocity: 0.65, hand: 'LH', measure: 1, beat: 1.5, finger_hint: 3 },
              { id: 'ca-3', note_name: 'C3', midi_number: 48, onset_time_sec: 0.8, duration_sec: 0.7, velocity: 0.68, hand: 'LH', measure: 1, beat: 2, finger_hint: 2 },
              { id: 'ca-4', note_name: 'Eb3', midi_number: 51, onset_time_sec: 1.2, duration_sec: 0.9, velocity: 0.7, hand: 'LH', measure: 1, beat: 2.5, finger_hint: 1 },
              { id: 'ca-5', note_name: 'G4', midi_number: 67, onset_time_sec: 2.0, duration_sec: 0.8, velocity: 0.82, hand: 'RH', measure: 2, beat: 1, finger_hint: 1 },
              { id: 'ca-6', note_name: 'C5', midi_number: 72, onset_time_sec: 2.8, duration_sec: 0.8, velocity: 0.84, hand: 'RH', measure: 2, beat: 2, finger_hint: 3 },
              { id: 'ca-7', note_name: 'D5', midi_number: 74, onset_time_sec: 3.4, duration_sec: 0.8, velocity: 0.82, hand: 'RH', measure: 2, beat: 3, finger_hint: 4 },
              { id: 'ca-8', note_name: 'Eb5', midi_number: 75, onset_time_sec: 4.0, duration_sec: 1.2, velocity: 0.86, hand: 'RH', measure: 2, beat: 4, finger_hint: 5 }
            ]
          }
        ]
      }
    ]
  }
];

// ==========================================
// 6.3 THEORY CURRICULUM LESSONS (STAGES 1 - 7)
// ==========================================
export const THEORY_CURRICULUM_STAGES: TheoryLesson[] = [
  {
    id: 'th-st1-notes',
    stage: 1,
    stage_title: 'Stage 1: Piano Note Recognition',
    topic: 'The Musical Alphabet & Keyboard Landmarks',
    summary: 'Master the keys A through G, Middle C, and how black key groups of 2 and 3 guide your fingers.',
    details: 'The piano keyboard uses seven natural letter names: A, B, C, D, E, F, G. The black keys appear in alternating groups of TWO and THREE. Find the group of two black keys: the white key immediately to their left is always C. Middle C (C4) sits directly in the center of the piano.',
    exercise_prompt: 'Play Middle C (C4), E4, and G4 to hear the natural major triad.',
    target_notes: ['C4', 'E4', 'G4'],
    clef: 'treble'
  },
  {
    id: 'th-st2-staff',
    stage: 2,
    stage_title: 'Stage 2: Reading Musical Notation',
    topic: 'Treble Clef, Bass Clef & Grand Staff',
    summary: 'Understand the 5 lines and 4 spaces of the staff, ledger lines, and how notes map to the keys.',
    details: 'Piano music uses the Grand Staff. The upper staff with the Treble Clef (G Clef) typically handles right-hand melody. Its lines are E-G-B-D-F ("Every Good Boy Does Fine") and spaces are F-A-C-E. The lower staff with Bass Clef (F Clef) handles left-hand bass. Middle C floats on its own ledger line between both staves.',
    exercise_prompt: 'Play the Treble staff space notes: F4, A4, C5, E5.',
    target_notes: ['F4', 'A4', 'C5', 'E5'],
    clef: 'treble'
  },
  {
    id: 'th-st3-rhythm',
    stage: 3,
    stage_title: 'Stage 3: Rhythm, Beats & Meter',
    topic: 'Note Values, Time Signatures & Metronomic Lock',
    summary: 'Whole, half, quarter, and eighth notes; time signatures like 4/4 and 3/4; syncopation and rests.',
    details: 'In 4/4 time, there are four quarter-note beats per measure. A whole note lasts 4 beats, a half note lasts 2 beats, and quarter notes last 1 beat. In compound meters like 3/8 (Für Elise) or 9/8 (Clair de Lune), the beat pulses in groupings of three eighth notes.',
    exercise_prompt: 'Tap a steady 4-beat pulse while holding C3 in the bass and stepping C4-D4-E4-F4.',
    target_notes: ['C3', 'C4', 'D4', 'E4'],
    clef: 'grand'
  },
  {
    id: 'th-st4-intervals',
    stage: 4,
    stage_title: 'Stage 4: Intervals & Pitch Distance',
    topic: 'Seconds, Thirds, Fourths, Fifths & Octaves',
    summary: 'The distance between two pitches defines harmony and emotion. Learn melodic vs harmonic intervals.',
    details: 'An interval measures pitch distance. A semitone (half-step) is the distance from any key to the very next key (like E to F, or C to C#). A tone (whole-step) is two semitones. Thirds create warmth (Major 3rd = 4 semitones, Minor 3rd = 3 semitones). Perfect 5ths (7 semitones) form powerful harmonic pillars.',
    exercise_prompt: 'Play the Perfect 5th interval: C4 and G4 together.',
    target_notes: ['C4', 'G4'],
    clef: 'treble'
  },
  {
    id: 'th-st5-scales',
    stage: 5,
    stage_title: 'Stage 5: Scales & Key Signatures',
    topic: 'Major, Natural Minor & Tonal Centers',
    summary: 'The formula of whole and half steps that builds every musical key, tonic, and dominant.',
    details: 'A Major Scale follows the formula: Whole - Whole - Half - Whole - Whole - Whole - Half. C Major has no sharps or flats. A Minor is the relative minor of C Major, sharing all identical white keys but centering emotional gravity on A.',
    exercise_prompt: 'Play the ascending C Major 5-finger scale: C4, D4, E4, F4, G4.',
    target_notes: ['C4', 'D4', 'E4', 'F4', 'G4'],
    clef: 'treble'
  },
  {
    id: 'th-st6-chords',
    stage: 6,
    stage_title: 'Stage 6: Chords & Harmony',
    topic: 'Triads, Inversions & Harmonic Progressions',
    summary: 'Major and minor triads, root position, inversions, seventh chords, and the I - IV - V - I cadences.',
    details: 'A triad is built by stacking two thirds. A Major triad has a Major third on the bottom and a minor third on top (Root - 3rd - 5th). Inverting a chord moves the root to the top, creating 1st inversion (6/3) and 2nd inversion (6/4). In C Major: I = C, IV = F, V = G.',
    exercise_prompt: 'Play the primary chord progression: C Major (C-E-G), F Major (C-F-A), G Major (B-D-G).',
    target_notes: ['C4', 'E4', 'G4'],
    target_chords: [['C4', 'E4', 'G4'], ['C4', 'F4', 'A4'], ['B3', 'D4', 'G4']],
    clef: 'grand'
  },
  {
    id: 'th-st7-interpretation',
    stage: 7,
    stage_title: 'Stage 7: Musical Interpretation & Structure',
    topic: 'Phrasing, Dynamics, Pedaling & Expression',
    summary: 'Transform technical notes into moving musical poetry: cantabile touch, rubato, and damper pedal technique.',
    details: 'Playing the piano is not merely pressing correct keys—it is sculpting sound in time. Learn to voice the melody above the accompaniment so the upper voice sings like an opera singer. Use syncopated pedaling (clearing the pedal immediately after the new chord sounds) to blend tones without harmonic muddying.',
    exercise_prompt: 'Play the opening of Für Elise focusing on soft pianissimo (pp) touch and delicate phrasing.',
    target_notes: ['E5', 'D#5', 'E5'],
    clef: 'treble'
  }
];
