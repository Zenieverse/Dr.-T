import React, { useState } from 'react';
import { pianoAudio } from '../audio/pianoAudio';
import { BookOpen, Sparkles, Volume2, ArrowRight, Layers, Compass } from 'lucide-react';

interface TheoryAcademyProps {
  onHighlightNotes?: (notes: string[]) => void;
}

// Circle of Fifths data
const CIRCLE_KEYS = [
  { key: 'C', sharps: 0, relative: 'Am', iv: 'F', v: 'G', notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'] },
  { key: 'G', sharps: 1, relative: 'Em', iv: 'C', v: 'D', notes: ['G', 'A', 'B', 'C', 'D', 'E', 'F#'] },
  { key: 'D', sharps: 2, relative: 'Bm', iv: 'G', v: 'A', notes: ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'] },
  { key: 'A', sharps: 3, relative: 'F#m', iv: 'D', v: 'E', notes: ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'] },
  { key: 'E', sharps: 4, relative: 'C#m', iv: 'A', v: 'B', notes: ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'] },
  { key: 'B', sharps: 5, relative: 'G#m', iv: 'E', v: 'F#', notes: ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#'] },
  { key: 'F#', sharps: 6, relative: 'D#m', iv: 'B', v: 'C#', notes: ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'E#'] },
  { key: 'Db', sharps: -5, relative: 'Bbm', iv: 'Gb', v: 'Ab', notes: ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C'] },
  { key: 'Ab', sharps: -4, relative: 'Fm', iv: 'Db', v: 'Eb', notes: ['Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G'] },
  { key: 'Eb', sharps: -3, relative: 'Cm', iv: 'Ab', v: 'Bb', notes: ['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D'] },
  { key: 'Bb', sharps: -2, relative: 'Gm', iv: 'Eb', v: 'F', notes: ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A'] },
  { key: 'F', sharps: -1, relative: 'Dm', iv: 'Bb', v: 'C', notes: ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'] },
];

const CHORD_TYPES = [
  { name: 'Major Triad', formula: '1 - 3 - 5', semitones: [0, 4, 7], mood: 'Bright, joyful, stable' },
  { name: 'Minor Triad', formula: '1 - b3 - 5', semitones: [0, 3, 7], mood: 'Melancholic, contemplative' },
  { name: 'Dominant 7th', formula: '1 - 3 - 5 - b7', semitones: [0, 4, 7, 10], mood: 'Bluesy, expectant, seeking resolution' },
  { name: 'Major 7th', formula: '1 - 3 - 5 - 7', semitones: [0, 4, 7, 11], mood: 'Lush, dreamy, nostalgic, jazz' },
  { name: 'Minor 7th', formula: '1 - b3 - 5 - b7', semitones: [0, 3, 7, 10], mood: 'Mellow, soulful, lo-fi' },
  { name: 'Diminished', formula: '1 - b3 - b5', semitones: [0, 3, 6], mood: 'Tense, dramatic, suspenseful' },
  { name: 'Suspended 4th (Sus4)', formula: '1 - 4 - 5', semitones: [0, 5, 7], mood: 'Floating, unresolved tension' },
];

const ROOT_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const TheoryAcademy: React.FC<TheoryAcademyProps> = ({ onHighlightNotes }) => {
  const [activeTab, setActiveTab] = useState<'circle' | 'chords' | 'scales'>('circle');
  const [selectedCircleKey, setSelectedCircleKey] = useState<string>('C');
  const [chordRoot, setChordRoot] = useState<string>('C');
  const [chordQualityIndex, setChordQualityIndex] = useState<number>(0);

  const currentCircle = CIRCLE_KEYS.find(k => k.key === selectedCircleKey) || CIRCLE_KEYS[0];
  const currentChordType = CHORD_TYPES[chordQualityIndex];

  // Calculate notes for current chord
  const calculateChordNotes = () => {
    const rootIdx = ROOT_NOTES.indexOf(chordRoot);
    return currentChordType.semitones.map(semi => {
      const targetMidiIndex = (rootIdx + semi) % 12;
      const pitch = ROOT_NOTES[targetMidiIndex];
      // Default to octave 4 or 5
      const oct = rootIdx + semi >= 12 ? 5 : 4;
      return `${pitch}${oct}`;
    });
  };

  const chordNotes = calculateChordNotes();

  const handlePlayChord = () => {
    pianoAudio.playChord(chordNotes, 2.0);
    if (onHighlightNotes) onHighlightNotes(chordNotes);
  };

  const handlePlayArpeggio = () => {
    pianoAudio.playArpeggio(chordNotes, 200);
    if (onHighlightNotes) onHighlightNotes(chordNotes);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            Theory Academy: Connect Harmony to the Keyboard
          </h2>
          <p className="text-xs text-slate-400">
            Never teach theory as isolated memorization • See, hear, understand, and apply
          </p>
        </div>

        {/* Section Tabs */}
        <div className="flex bg-slate-800 rounded-xl p-1 border border-slate-700 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('circle')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'circle' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Circle of Fifths
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('chords')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'chords' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Chord Laboratory
          </button>
        </div>
      </div>

      {/* TAB 1: CIRCLE OF FIFTHS */}
      {activeTab === 'circle' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Wheel Selector */}
          <div className="lg:col-span-7 bg-slate-950/70 border border-slate-800 rounded-2xl p-5 text-center">
            <h3 className="text-sm font-bold text-slate-200 mb-1 flex items-center justify-center gap-2">
              <Compass className="w-4 h-4 text-indigo-400" />
              Interactive Key Wheel
            </h3>
            <p className="text-xs text-slate-400 mb-4">Click any key to explore its family of chords and accidentals</p>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {CIRCLE_KEYS.map((k) => (
                <button
                  key={k.key}
                  type="button"
                  onClick={() => {
                    setSelectedCircleKey(k.key);
                    pianoAudio.playChord([`${k.key}4`], 1.2);
                  }}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedCircleKey === k.key
                      ? 'bg-indigo-600 border-indigo-400 text-white font-bold ring-2 ring-indigo-400/40 shadow-lg scale-105'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-750 hover:text-white'
                  }`}
                >
                  <span className="block text-base font-bold font-mono">{k.key}</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">rel. {k.relative}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Key Details Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 to-indigo-950/40 border border-indigo-900/50 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
                Key of {currentCircle.key} Major
              </div>

              <h4 className="text-xl font-bold text-white mb-1">
                {currentCircle.key} Major & {currentCircle.relative}
              </h4>
              <p className="text-xs text-slate-300 mb-4">
                {currentCircle.sharps > 0 && `${currentCircle.sharps} Sharp${currentCircle.sharps > 1 ? 's' : ''}`}
                {currentCircle.sharps < 0 && `${Math.abs(currentCircle.sharps)} Flat${Math.abs(currentCircle.sharps) > 1 ? 's' : ''}`}
                {currentCircle.sharps === 0 && 'Natural Key (0 Sharps / 0 Flats)'}
              </p>

              {/* Primary Harmonic Triad */}
              <div className="space-y-2 mb-4 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400">Tonic (I - Home):</span>
                  <span className="font-mono font-bold text-emerald-400">{currentCircle.key} Major</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400">Subdominant (IV - Journey):</span>
                  <span className="font-mono font-bold text-sky-400">{currentCircle.iv} Major</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400">Dominant (V - Tension):</span>
                  <span className="font-mono font-bold text-amber-400">{currentCircle.v} Major</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400">Relative Minor (vi):</span>
                  <span className="font-mono font-bold text-purple-400">{currentCircle.relative}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const oct = '4';
                pianoAudio.playChord([`${currentCircle.key}${oct}`, `${currentCircle.iv}${oct}`, `${currentCircle.v}${oct}`], 2);
              }}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center justify-center space-x-2 shadow-md"
            >
              <Volume2 className="w-4 h-4" />
              <span>Audition I - IV - V Cadence</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: CHORD LABORATORY */}
      {activeTab === 'chords' && (
        <div className="space-y-6">
          {/* Root Selector & Chord Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Root Note Picker */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                1. Select Root Pitch
              </label>
              <div className="grid grid-cols-6 gap-1.5">
                {ROOT_NOTES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setChordRoot(r)}
                    className={`py-2 text-center rounded-lg font-mono text-xs font-bold transition ${
                      chordRoot === r
                        ? 'bg-teal-500 text-slate-950 shadow-md font-extrabold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Chord Quality Picker */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                2. Select Chord Quality
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {CHORD_TYPES.map((type, idx) => (
                  <button
                    key={type.name}
                    type="button"
                    onClick={() => setChordQualityIndex(idx)}
                    className={`py-2 px-2.5 text-left rounded-lg text-xs transition ${
                      chordQualityIndex === idx
                        ? 'bg-indigo-600 text-white font-bold shadow-md'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                    }`}
                  >
                    {type.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chord Result Display */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/50 border border-indigo-900/60 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black text-white font-mono">
                  {chordRoot} {currentChordType.name}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {currentChordType.formula}
                </span>
              </div>
              <p className="text-xs text-indigo-300 mt-1 italic">
                "{currentChordType.mood}"
              </p>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs text-slate-400">Notes:</span>
                {chordNotes.map(n => (
                  <span key={n} className="px-2 py-1 rounded bg-slate-800 text-teal-300 font-mono font-bold text-xs border border-slate-700">
                    {n}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <button
                type="button"
                onClick={handlePlayChord}
                className="px-4 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition flex items-center space-x-2 shadow-lg"
              >
                <Volume2 className="w-4 h-4" />
                <span>Play Chord</span>
              </button>
              <button
                type="button"
                onClick={handlePlayArpeggio}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition flex items-center space-x-2 border border-slate-700"
              >
                <Layers className="w-4 h-4" />
                <span>Play Arpeggio</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
