import React, { useState, useEffect } from 'react';
import { pianoAudio } from '../audio/pianoAudio';
import { Sparkles, Play, Square, Circle, Volume2, Music, Radio, Disc } from 'lucide-react';

interface ImprovLabProps {
  onSafeNotesHighlight?: (notes: string[]) => void;
}

const JAM_STYLES = [
  {
    id: 'pop',
    name: 'Pop Ballad (I - V - vi - IV)',
    chords: 'C - G - Am - F',
    bpm: 88,
    scaleType: 'C Pentatonic Major (C, D, E, G, A)',
    safeNotes: ['C4', 'D4', 'E4', 'G4', 'A4', 'C5', 'D5', 'E5'],
    tip: 'Play any of the highlighted keys in rhythm. Because there are no 4ths or 7ths, every note sounds gorgeous and harmonious!',
  },
  {
    id: 'blues',
    name: '12-Bar Blues Shuffle',
    chords: 'C7 - F7 - G7',
    bpm: 104,
    scaleType: 'C Blues Scale (C, Eb, F, F#, G, Bb)',
    safeNotes: ['C4', 'D#4', 'F4', 'F#4', 'G4', 'A#4', 'C5'],
    tip: 'Lean into the "blue note" (F# / Gb). Slide from F to F# to G for authentic blues and rock styling.',
  },
  {
    id: 'lofi',
    name: 'Chill Lofi Autumn (ii - V - I)',
    chords: 'Dm7 - G7 - Cmaj7',
    bpm: 76,
    scaleType: 'C Major Diatonic / D Dorian',
    safeNotes: ['D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5'],
    tip: 'Keep your notes sparse. Leave spacious pauses between phrases to let the cozy chords breathe.',
  },
  {
    id: 'ballad',
    name: 'Cinematic Dream (vi - IV - I - V)',
    chords: 'Am - F - C - G',
    bpm: 80,
    scaleType: 'A Minor Pentatonic (A, C, D, E, G)',
    safeNotes: ['A3', 'C4', 'D4', 'E4', 'G4', 'A4', 'C5'],
    tip: 'Start with single slow notes in the upper register, then build rolling arpeggios as the intensity rises.',
  },
];

export const ImprovCompositionLab: React.FC<ImprovLabProps> = ({ onSafeNotesHighlight }) => {
  const [selectedStyle, setSelectedStyle] = useState(JAM_STYLES[0]);
  const [isGroovePlaying, setIsGroovePlaying] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedNotes, setRecordedNotes] = useState<Array<{ note: string; timestamp: number }>>([]);
  const [isPlayingBack, setIsPlayingBack] = useState<boolean>(false);
  const [jamBpm, setJamBpm] = useState<number>(selectedStyle.bpm);

  // Toggle backing groove
  const toggleGroove = () => {
    if (isGroovePlaying) {
      pianoAudio.stopGroove();
      setIsGroovePlaying(false);
    } else {
      pianoAudio.startGroove(selectedStyle.id as any, jamBpm);
      setIsGroovePlaying(true);
      if (onSafeNotesHighlight) {
        onSafeNotesHighlight(selectedStyle.safeNotes);
      }
    }
  };

  // Stop groove on unmount
  useEffect(() => {
    return () => {
      pianoAudio.stopGroove();
    };
  }, []);

  const handleSelectStyle = (style: typeof JAM_STYLES[0]) => {
    setSelectedStyle(style);
    setJamBpm(style.bpm);
    if (isGroovePlaying) {
      pianoAudio.startGroove(style.id as any, style.bpm);
    }
    if (onSafeNotesHighlight) {
      onSafeNotesHighlight(style.safeNotes);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setRecordedNotes([]);
      setIsRecording(true);
    }
  };

  const handlePlaybackRecording = () => {
    if (recordedNotes.length === 0 || isPlayingBack) return;
    setIsPlayingBack(true);
    const start = recordedNotes[0].timestamp;
    recordedNotes.forEach((item, idx) => {
      const delay = item.timestamp - start;
      setTimeout(() => {
        pianoAudio.playNote(item.note, 0.85);
        if (idx === recordedNotes.length - 1) {
          setIsPlayingBack(false);
        }
      }, delay);
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Improvisation & AI Ensemble Lab
          </h2>
          <p className="text-xs text-slate-400">
            Jam with real drums, bass & accompaniment • "No Wrong Notes" Pentatonic Freedom
          </p>
        </div>

        {/* Master Groove Trigger */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={toggleGroove}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition shadow-lg ${
              isGroovePlaying
                ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                : 'bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950'
            }`}
          >
            {isGroovePlaying ? <Square className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isGroovePlaying ? 'Stop Ensemble Band' : 'Start AI Backing Band'}</span>
          </button>
        </div>
      </div>

      {/* Styles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        {JAM_STYLES.map((style) => {
          const isSelected = selectedStyle.id === style.id;
          return (
            <button
              key={style.id}
              type="button"
              onClick={() => handleSelectStyle(style)}
              className={`p-4 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-gradient-to-b from-amber-950/60 to-slate-900 border-amber-500/60 ring-2 ring-amber-500/30 text-white shadow-lg'
                  : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-white">{style.name}</span>
                <span className="text-[10px] font-mono text-amber-400">{style.bpm} BPM</span>
              </div>
              <div className="text-xs text-slate-400 font-mono mb-2">
                Chords: <strong className="text-teal-300">{style.chords}</strong>
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                {style.scaleType}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Jam Canvas */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
              Scale Mode: {selectedStyle.scaleType}
            </div>
            <h3 className="text-lg font-bold text-white">
              {selectedStyle.name} Jammer
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              {selectedStyle.tip}
            </p>
          </div>

          {/* Safe Notes Badge */}
          <div className="flex flex-col items-end">
            <span className="text-[11px] text-slate-400 mb-1">Safe Golden Keys:</span>
            <div className="flex flex-wrap gap-1">
              {selectedStyle.safeNotes.map(n => (
                <span key={n} className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  {n}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Recording Mini Studio */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center space-x-3 text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Disc className="w-4 h-4 text-rose-400" />
              Idea Studio
            </span>
            <span className="text-slate-400">
              {recordedNotes.length} notes captured
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={toggleRecording}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                isRecording
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <Circle className={`w-3 h-3 ${isRecording ? 'fill-white' : 'fill-rose-500'}`} />
              <span>{isRecording ? 'Recording (Stop)' : 'Record Take'}</span>
            </button>

            {recordedNotes.length > 0 && (
              <button
                type="button"
                onClick={handlePlaybackRecording}
                disabled={isPlayingBack}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-500 text-slate-950 hover:bg-teal-400 transition flex items-center space-x-1.5"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>{isPlayingBack ? 'Playing...' : 'Play Back Take'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
