import React, { useState } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2, AlertCircle, Music } from 'lucide-react';
import { pianoAudio } from '../audio/pianoAudio';

interface SheetMusicDisplayProps {
  title?: string;
  clef?: 'treble' | 'bass' | 'grand';
  notes: Array<{ note: string; duration: number; text?: string; finger?: number }>;
  currentNoteIndex?: number;
  onNoteSelected?: (note: string, index: number) => void;
  interactivePlayAlong?: boolean;
}

// Maps note pitch & octave to Y position offset on the SVG staff
// For Treble Clef:
// Line 5 (top) = F5 (y = 40)
// Space 4 = E5 (y = 50)
// Line 4 = D5 (y = 60)
// Space 3 = C5 (y = 70)
// Line 3 = B4 (y = 80)
// Space 2 = A4 (y = 90)
// Line 2 = G4 (y = 100) (Treble landmark line!)
// Space 1 = F4 (y = 110)
// Line 1 (bottom) = E4 (y = 120)
// Below staff = D4 (y = 130)
// Ledger line = C4 (Middle C) (y = 140)
const TREBLE_NOTE_Y: Record<string, number> = {
  'G5': 30,
  'F5': 40,
  'E5': 50,
  'D5': 60,
  'C5': 70,
  'B4': 80,
  'A4': 90,
  'G4': 100,
  'F4': 110,
  'E4': 120,
  'D4': 130,
  'C4': 140, // Middle C with ledger line
  'B3': 150,
  'A3': 160,
};

export const SheetMusicDisplay: React.FC<SheetMusicDisplayProps> = ({
  title = 'Sheet Music & Sight-Reading',
  clef = 'treble',
  notes = [],
  currentNoteIndex = 0,
  onNoteSelected,
  interactivePlayAlong = true,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeIdx, setActiveIdx] = useState<number>(currentNoteIndex);
  const [feedback, setFeedback] = useState<string>('Ready. Play each note on your keyboard or click to hear.');

  // Play demonstration melody
  const handlePlayDemo = () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }
    setIsPlaying(true);
    let step = 0;
    const interval = setInterval(() => {
      if (step >= notes.length) {
        clearInterval(interval);
        setIsPlaying(false);
        setActiveIdx(0);
        return;
      }
      const noteItem = notes[step];
      pianoAudio.playNote(noteItem.note, 0.8, 0.6);
      setActiveIdx(step);
      step++;
    }, 600);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setActiveIdx(0);
    setFeedback('Reset to start. Play first note.');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Music className="w-4 h-4 text-teal-400" />
            {title}
          </h3>
          <p className="text-xs text-slate-400">
            Interactive notation • Sight-read with accurate clefs, staff lines, and ledger markers
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handlePlayDemo}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
              isPlaying 
                ? 'bg-amber-500 text-slate-950 font-bold' 
                : 'bg-teal-500 text-slate-950 hover:bg-teal-400 font-bold'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause Demo' : 'Listen Demo'}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition"
            title="Reset to beginning"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Notation Canvas */}
      <div className="w-full bg-amber-50/95 rounded-xl p-4 sm:p-6 border border-amber-200/50 shadow-inner overflow-x-auto">
        <svg 
          viewBox="0 0 760 190" 
          className="w-full min-w-[550px] h-auto drop-shadow-xs"
          style={{ fontFamily: 'serif' }}
        >
          {/* Background cream texture */}
          <rect width="760" height="190" fill="#fdfbf7" rx="8" />

          {/* 5 Staff lines (Treble) */}
          {[40, 60, 80, 100, 120].map((y) => (
            <line 
              key={y} 
              x1="30" 
              y1={y} 
              x2="730" 
              y2={y} 
              stroke="#334155" 
              strokeWidth="1.5" 
            />
          ))}

          {/* Left and Right Bar Lines */}
          <line x1="30" y1="40" x2="30" y2="120" stroke="#334155" strokeWidth="2.5" />
          <line x1="720" y1="40" x2="720" y2="120" stroke="#334155" strokeWidth="1.5" />
          <line x1="726" y1="40" x2="726" y2="120" stroke="#334155" strokeWidth="4" />

          {/* Treble Clef Graphic Symbol */}
          <text 
            x="42" 
            y="114" 
            fontSize="68" 
            fill="#0f172a" 
            fontWeight="bold"
            className="select-none pointer-events-none"
          >
            𝄞
          </text>

          {/* 4/4 Time Signature */}
          <text x="85" y="75" fontSize="28" fontWeight="bold" fill="#0f172a" textAnchor="middle">4</text>
          <text x="85" y="115" fontSize="28" fontWeight="bold" fill="#0f172a" textAnchor="middle">4</text>

          {/* Measure bar lines (spaced every 4 notes approx) */}
          <line x1="390" y1="40" x2="390" y2="120" stroke="#64748b" strokeWidth="1.5" />

          {/* Render Notes */}
          {notes.map((item, idx) => {
            const cleanNote = item.note.replace('#', '').replace('b', '');
            const targetY = TREBLE_NOTE_Y[cleanNote] ?? 100;
            const x = 140 + idx * 64;
            const isNoteActive = idx === activeIdx;
            const hasLedger = targetY >= 140; // Middle C gets ledger line

            return (
              <g 
                key={`${item.note}-${idx}`}
                className="cursor-pointer transition-transform"
                onClick={() => {
                  setActiveIdx(idx);
                  pianoAudio.playNote(item.note, 0.85);
                  if (onNoteSelected) onNoteSelected(item.note, idx);
                }}
              >
                {/* Active note highlight aura */}
                {isNoteActive && (
                  <ellipse
                    cx={x}
                    cy={targetY}
                    rx="22"
                    ry="20"
                    fill="rgba(20, 184, 166, 0.25)"
                    className="animate-pulse"
                  />
                )}

                {/* Ledger line for Middle C or lower */}
                {hasLedger && (
                  <line 
                    x1={x - 14} 
                    y1={140} 
                    x2={x + 14} 
                    y2={140} 
                    stroke="#1e293b" 
                    strokeWidth="2" 
                  />
                )}

                {/* Sharp symbol if sharp */}
                {item.note.includes('#') && (
                  <text 
                    x={x - 14} 
                    y={targetY + 4} 
                    fontSize="18" 
                    fontWeight="bold" 
                    fill="#0f172a"
                  >
                    ♯
                  </text>
                )}

                {/* Notehead (slanted oval) */}
                <ellipse 
                  cx={x} 
                  cy={targetY} 
                  rx="8.5" 
                  ry="6.5" 
                  fill={isNoteActive ? '#0d9488' : '#0f172a'} 
                  transform={`rotate(-24 ${x} ${targetY})`}
                />

                {/* Note Stem */}
                <line 
                  x1={x + 7.5} 
                  y1={targetY} 
                  x2={x + 7.5} 
                  y2={targetY - 38} 
                  stroke={isNoteActive ? '#0d9488' : '#0f172a'} 
                  strokeWidth="2" 
                />

                {/* Note label underneath */}
                <text 
                  x={x} 
                  y="172" 
                  fontSize="12" 
                  fontWeight="bold" 
                  fontFamily="monospace"
                  fill={isNoteActive ? '#0f766e' : '#475569'} 
                  textAnchor="middle"
                >
                  {item.note}
                </text>

                {/* Finger hint indicator */}
                {item.finger && (
                  <text 
                    x={x} 
                    y="24" 
                    fontSize="11" 
                    fontWeight="bold" 
                    fontFamily="sans-serif"
                    fill="#0284c7" 
                    textAnchor="middle"
                  >
                    f.{item.finger}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Constructive Pedagogical Feedback Bar */}
      <div className="mt-3 flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs">
        <div className="flex items-center space-x-2 text-slate-300">
          <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
          <span>
            Current Note Target: <strong className="text-teal-300 font-mono text-sm">{notes[activeIdx]?.note || 'C4'}</strong>
            {' '}— {notes[activeIdx]?.text || 'Play this pitch on the piano below.'}
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Measure 1 • Note {activeIdx + 1} of {notes.length}
        </span>
      </div>
    </div>
  );
};
