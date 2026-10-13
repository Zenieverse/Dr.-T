import React from 'react';
import { grandPianoAudio } from '../audio/grandPianoAudioEngine';

interface GrandPianoStaffViewerProps {
  activeNote?: string | null;
  targetNotes?: string[];
  keySignature?: string;
  timeSignature?: string;
  tempoBpm?: number;
  onNoteSelected?: (note: string) => void;
  className?: string;
}

// Maps note names to vertical offset on Treble or Bass clef
// Treble: Top line = F5, Bottom line = E4. Middle C (C4) has ledger line below.
// Bass: Top line = A3, Bottom line = G2. Middle C (C4) has ledger line above.
const STAFF_POSITIONS: Record<string, { clef: 'treble' | 'bass'; yPercent: number; isLedger?: boolean }> = {
  // Treble Clef
  'G5': { clef: 'treble', yPercent: 12 },
  'F5': { clef: 'treble', yPercent: 20 },
  'E5': { clef: 'treble', yPercent: 28 },
  'D5': { clef: 'treble', yPercent: 36 },
  'C5': { clef: 'treble', yPercent: 44 },
  'B4': { clef: 'treble', yPercent: 52 },
  'A4': { clef: 'treble', yPercent: 60 },
  'G4': { clef: 'treble', yPercent: 68 },
  'F4': { clef: 'treble', yPercent: 76 },
  'E4': { clef: 'treble', yPercent: 84 },
  'D4': { clef: 'treble', yPercent: 92 },
  'C4': { clef: 'treble', yPercent: 100, isLedger: true },

  // Bass Clef
  'B3': { clef: 'bass', yPercent: 12 },
  'A3': { clef: 'bass', yPercent: 20 },
  'G3': { clef: 'bass', yPercent: 28 },
  'F3': { clef: 'bass', yPercent: 36 },
  'E3': { clef: 'bass', yPercent: 44 },
  'D3': { clef: 'bass', yPercent: 52 },
  'C3': { clef: 'bass', yPercent: 60 },
  'B2': { clef: 'bass', yPercent: 68 },
  'A2': { clef: 'bass', yPercent: 76 },
  'G2': { clef: 'bass', yPercent: 84 },
  'F2': { clef: 'bass', yPercent: 92 },
  'E2': { clef: 'bass', yPercent: 100, isLedger: true },
};

export const GrandPianoStaffViewer: React.FC<GrandPianoStaffViewerProps> = ({
  activeNote,
  targetNotes = [],
  keySignature = 'C Major',
  timeSignature = '4/4',
  tempoBpm = 80,
  onNoteSelected,
  className = ''
}) => {
  const handleStaffNoteClick = (noteName: string) => {
    grandPianoAudio.playNote(noteName);
    if (onNoteSelected) onNoteSelected(noteName);
  };

  return (
    <div className={`p-5 rounded-2xl bg-stone-950 border border-amber-900/40 shadow-xl space-y-4 ${className}`}>
      {/* Top Staff Header */}
      <div className="flex flex-wrap items-center justify-between text-xs font-mono text-stone-300 border-b border-amber-900/30 pb-3">
        <div className="flex items-center space-x-3">
          <span className="font-bold text-amber-200">GRAND STAFF NOTATION</span>
          <span className="text-stone-500">•</span>
          <span>Key: <strong className="text-amber-300">{keySignature}</strong></span>
          <span className="text-stone-500">•</span>
          <span>Meter: <strong className="text-amber-300">{timeSignature}</strong></span>
          <span className="text-stone-500">•</span>
          <span>Tempo: <strong className="text-amber-300">{tempoBpm} BPM</strong></span>
        </div>

        {activeNote && (
          <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <span>Sounding Note:</span>
            <strong className="text-sm">{activeNote}</strong>
          </div>
        )}
      </div>

      {/* The Visual Grand Staff */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-900/60 p-4 rounded-xl border border-stone-800/80">
        
        {/* 1. Treble Clef Staff (Right Hand) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-stone-400">
            <span className="font-bold text-amber-200 flex items-center gap-1.5">
              <span className="text-xl font-serif">𝄞</span>
              <span>Treble Staff (RH Melody)</span>
            </span>
            <span className="text-[10px] text-stone-500">Lines: E4 G4 B4 D5 F5 • Spaces: F4 A4 C5 E5</span>
          </div>

          <div className="relative h-32 bg-stone-950/80 rounded-xl border border-stone-800 p-3 flex flex-col justify-between overflow-hidden">
            {/* 5 Staff Lines */}
            {[0, 1, 2, 3, 4].map((lineIndex) => (
              <div key={lineIndex} className="w-full h-0.5 bg-stone-600/80 shadow-xs" />
            ))}

            {/* Interactive Note Heads on Treble Clef */}
            <div className="absolute inset-0 p-3 pointer-events-auto">
              {['E4', 'G4', 'B4', 'D5', 'F5', 'C4', 'A4', 'C5', 'E5'].map((n) => {
                const pos = STAFF_POSITIONS[n];
                if (!pos || pos.clef !== 'treble') return null;
                const isSounding = activeNote === n;
                const isTarget = targetNotes.includes(n);

                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => handleStaffNoteClick(n)}
                    style={{ top: `${pos.yPercent}%`, left: `${25 + (['C4', 'E4', 'G4', 'B4', 'D5', 'F5'].indexOf(n) * 11)}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 w-6 h-4 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center text-[9px] font-mono font-bold ${
                      isSounding 
                        ? 'bg-amber-400 border-amber-100 text-stone-950 scale-125 shadow-lg shadow-amber-400/50' 
                        : isTarget
                        ? 'bg-amber-600 border-amber-300 text-white animate-pulse'
                        : 'bg-stone-800 border-stone-500 text-stone-300 hover:bg-stone-700'
                    }`}
                    title={`Click to play ${n} on Treble Staff`}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2. Bass Clef Staff (Left Hand) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-stone-400">
            <span className="font-bold text-amber-200 flex items-center gap-1.5">
              <span className="text-xl font-serif">𝄢</span>
              <span>Bass Staff (LH Accompaniment)</span>
            </span>
            <span className="text-[10px] text-stone-500">Lines: G2 B2 D3 F3 A3 • Spaces: A2 C3 E3 G3</span>
          </div>

          <div className="relative h-32 bg-stone-950/80 rounded-xl border border-stone-800 p-3 flex flex-col justify-between overflow-hidden">
            {/* 5 Staff Lines */}
            {[0, 1, 2, 3, 4].map((lineIndex) => (
              <div key={lineIndex} className="w-full h-0.5 bg-stone-600/80 shadow-xs" />
            ))}

            {/* Interactive Note Heads on Bass Clef */}
            <div className="absolute inset-0 p-3 pointer-events-auto">
              {['G2', 'B2', 'D3', 'F3', 'A3', 'C3', 'E3', 'G3'].map((n) => {
                const pos = STAFF_POSITIONS[n];
                if (!pos || pos.clef !== 'bass') return null;
                const isSounding = activeNote === n;
                const isTarget = targetNotes.includes(n);

                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => handleStaffNoteClick(n)}
                    style={{ top: `${pos.yPercent}%`, left: `${25 + (['G2', 'B2', 'D3', 'F3', 'A3'].indexOf(n) * 12)}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 w-6 h-4 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center text-[9px] font-mono font-bold ${
                      isSounding 
                        ? 'bg-amber-400 border-amber-100 text-stone-950 scale-125 shadow-lg shadow-amber-400/50' 
                        : isTarget
                        ? 'bg-amber-600 border-amber-300 text-white animate-pulse'
                        : 'bg-stone-800 border-stone-500 text-stone-300 hover:bg-stone-700'
                    }`}
                    title={`Click to play ${n} on Bass Staff`}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
