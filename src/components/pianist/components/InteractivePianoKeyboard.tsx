import React, { useState, useEffect, useCallback, useRef } from 'react';
import { pianoAudio } from '../audio/pianoAudio';
import { KeyLabelMode, NoteInfo } from '../../../types/pianistTypes';
import { Volume2, VolumeX, Radio, Sparkles, Disc, RefreshCw } from 'lucide-react';

interface PianoKeyboardProps {
  startOctave?: number; // e.g. 3 (C3)
  octaveCount?: number; // e.g. 2 or 3
  activeNotes?: string[]; // notes highlighted by parent lesson or ear test
  targetNotes?: string[]; // target notes to play
  labelMode?: KeyLabelMode;
  onNotePlayed?: (note: string) => void;
  showPedal?: boolean;
  showControls?: boolean;
  className?: string;
  compact?: boolean;
}

// Computer keyboard map for 2 octaves (starting at C3 or C4)
const KEYBOARD_SHORTCUTS: Record<string, string> = {
  // Lower octave (White keys: a, s, d, f, g, h, j)
  'a': 'C',
  'w': 'C#',
  's': 'D',
  'e': 'D#',
  'd': 'E',
  'f': 'F',
  't': 'F#',
  'g': 'G',
  'y': 'G#',
  'h': 'A',
  'u': 'A#',
  'j': 'B',
  // Upper octave (k, o, l, p, ;, ')
  'k': 'C_UP',
  'o': 'C#_UP',
  'l': 'D_UP',
  'p': 'D#_UP',
  ';': 'E_UP',
  "'": 'F_UP',
};

const SOLFEGE_MAP: Record<string, string> = {
  'C': 'Do', 'C#': 'Di', 'D': 'Re', 'D#': 'Ri',
  'E': 'Mi', 'F': 'Fa', 'F#': 'Fi', 'G': 'Sol',
  'G#': 'Si', 'A': 'La', 'A#': 'Li', 'B': 'Ti'
};

export const InteractivePianoKeyboard: React.FC<PianoKeyboardProps> = ({
  startOctave = 3,
  octaveCount = 3,
  activeNotes = [],
  targetNotes = [],
  labelMode: initialLabelMode = 'names',
  onNotePlayed,
  showPedal = true,
  showControls = true,
  className = '',
  compact = false,
}) => {
  const [baseOctave, setBaseOctave] = useState<number>(startOctave);
  const [pressedNotes, setPressedNotes] = useState<Set<string>>(new Set());
  const [labelMode, setLabelMode] = useState<KeyLabelMode>(initialLabelMode);
  const [sustainActive, setSustainActive] = useState<boolean>(false);
  const [midiConnected, setMidiConnected] = useState<boolean>(false);
  const [midiDevice, setMidiDevice] = useState<string>('None');
  const [recentNotes, setRecentNotes] = useState<string[]>([]);
  const keyboardRef = useRef<HTMLDivElement>(null);

  // Generate keys for the specified range
  const generateKeys = useCallback(() => {
    const whitePitches = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const allKeys: NoteInfo[] = [];

    for (let oct = baseOctave; oct < baseOctave + octaveCount; oct++) {
      whitePitches.forEach((pitch) => {
        const whiteNote = `${pitch}${oct}`;
        allKeys.push({
          name: whiteNote,
          pitch,
          octave: oct,
          midi: 0,
          freq: pianoAudio.noteToFreq(whiteNote),
          isBlack: false,
          solfege: SOLFEGE_MAP[pitch],
        });

        // Add corresponding sharp black key if exists
        if (pitch !== 'E' && pitch !== 'B') {
          const blackNote = `${pitch}#${oct}`;
          allKeys.push({
            name: blackNote,
            pitch: `${pitch}#`,
            octave: oct,
            midi: 0,
            freq: pianoAudio.noteToFreq(blackNote),
            isBlack: true,
            solfege: SOLFEGE_MAP[`${pitch}#`],
          });
        }
      });
    }

    // Add trailing C of top octave
    const topC = `C${baseOctave + octaveCount}`;
    allKeys.push({
      name: topC,
      pitch: 'C',
      octave: baseOctave + octaveCount,
      midi: 0,
      freq: pianoAudio.noteToFreq(topC),
      isBlack: false,
      solfege: 'Do',
    });

    return allKeys;
  }, [baseOctave, octaveCount]);

  const keys = generateKeys();

  // Play note handler
  const handleNoteDown = useCallback((noteName: string) => {
    pianoAudio.playNote(noteName, 0.85);
    setPressedNotes(prev => new Set(prev).add(noteName));
    setRecentNotes(prev => [noteName, ...prev.slice(0, 7)]);
    if (onNotePlayed) {
      onNotePlayed(noteName);
    }
  }, [onNotePlayed]);

  const handleNoteUp = useCallback((noteName: string) => {
    pianoAudio.stopNote(noteName);
    setPressedNotes(prev => {
      const next = new Set(prev);
      next.delete(noteName);
      return next;
    });
  }, []);

  // Sustain toggle
  const toggleSustain = useCallback(() => {
    setSustainActive(prev => {
      const next = !prev;
      pianoAudio.setSustain(next);
      return next;
    });
  }, []);

  // Computer keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        toggleSustain();
        return;
      }

      const keyChar = e.key.toLowerCase();
      const mapped = KEYBOARD_SHORTCUTS[keyChar];
      if (mapped) {
        let noteName = '';
        if (mapped.endsWith('_UP')) {
          const pitch = mapped.replace('_UP', '');
          noteName = `${pitch}${baseOctave + 1}`;
        } else {
          noteName = `${mapped}${baseOctave}`;
        }
        handleNoteDown(noteName);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const keyChar = e.key.toLowerCase();
      const mapped = KEYBOARD_SHORTCUTS[keyChar];
      if (mapped) {
        let noteName = '';
        if (mapped.endsWith('_UP')) {
          const pitch = mapped.replace('_UP', '');
          noteName = `${pitch}${baseOctave + 1}`;
        } else {
          noteName = `${mapped}${baseOctave}`;
        }
        handleNoteUp(noteName);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [baseOctave, handleNoteDown, handleNoteUp, toggleSustain]);

  // Web MIDI setup listener
  useEffect(() => {
    pianoAudio.setMidiCallback((note, vel, isDown) => {
      if (isDown) {
        setPressedNotes(prev => new Set(prev).add(note));
        setRecentNotes(prev => [note, ...prev.slice(0, 7)]);
        if (onNotePlayed) onNotePlayed(note);
      } else {
        setPressedNotes(prev => {
          const next = new Set(prev);
          next.delete(note);
          return next;
        });
      }
    });

    const checkMidi = setInterval(() => {
      setMidiConnected(pianoAudio.midiConnected);
      setMidiDevice(pianoAudio.midiDeviceName);
    }, 1500);

    return () => clearInterval(checkMidi);
  }, [onNotePlayed]);

  // Separate white and black keys for realistic layout
  const whiteKeys = keys.filter(k => !k.isBlack);

  return (
    <div className={`flex flex-col select-none bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-5 shadow-2xl ${className}`}>
      {/* Top Controls Bar */}
      {showControls && (
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-800 text-xs text-slate-300">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Acoustic Grand (Concert 440Hz)
            </span>
            <span className="text-slate-500">|</span>
            <span className="hidden sm:inline text-slate-400">
              Octave: <strong className="text-teal-400">C{baseOctave} - C{baseOctave + octaveCount}</strong>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Octave Shifters */}
            <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
              <button
                type="button"
                onClick={() => setBaseOctave(prev => Math.max(1, prev - 1))}
                className="px-2 py-1 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition font-mono font-bold"
                title="Lower Octave"
              >
                -8va
              </button>
              <span className="px-2 text-slate-400 font-mono text-[11px]">C{baseOctave}</span>
              <button
                type="button"
                onClick={() => setBaseOctave(prev => Math.min(5, prev + 1))}
                className="px-2 py-1 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition font-mono font-bold"
                title="Higher Octave"
              >
                +8va
              </button>
            </div>

            {/* Label Mode Switcher */}
            <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
              {(['names', 'solfege', 'shortcuts', 'none'] as KeyLabelMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setLabelMode(mode)}
                  className={`px-2 py-1 capitalize rounded transition text-[11px] font-medium ${
                    labelMode === mode 
                      ? 'bg-teal-500 text-slate-950 font-bold shadow-xs' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {mode === 'none' ? 'Ear Mode' : mode}
                </button>
              ))}
            </div>

            {/* Sustain Pedal Button */}
            {showPedal && (
              <button
                type="button"
                onClick={toggleSustain}
                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition border ${
                  sustainActive
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md ring-2 ring-amber-400/30'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                }`}
                title="Toggle Sustain Pedal (Shortcut: Spacebar)"
              >
                <Disc className={`w-3.5 h-3.5 ${sustainActive ? 'animate-spin' : ''}`} />
                <span>Damper Pedal {sustainActive ? 'DOWN' : 'UP'}</span>
              </button>
            )}

            {/* MIDI Device Status */}
            <div 
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg border text-[11px] ${
                midiConnected 
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' 
                  : 'bg-slate-800/80 border-slate-700 text-slate-400'
              }`}
              title={midiConnected ? `Connected to ${midiDevice}` : 'Plug in any USB/Bluetooth MIDI keyboard'}
            >
              <Radio className={`w-3 h-3 ${midiConnected ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
              <span className="hidden md:inline font-mono">
                {midiConnected ? `MIDI: ${midiDevice}` : 'MIDI Ready'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Note Memory Tape */}
      {recentNotes.length > 0 && (
        <div className="flex items-center space-x-2 mb-2 px-1 text-[11px] text-slate-400 overflow-x-auto no-scrollbar">
          <span className="text-slate-500 font-mono shrink-0">Recent:</span>
          {recentNotes.map((n, idx) => (
            <span
              key={`${n}-${idx}`}
              className={`px-1.5 py-0.5 rounded font-mono font-bold shrink-0 transition-all ${
                idx === 0 
                  ? 'bg-teal-400 text-slate-950 scale-105 shadow-xs' 
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {n}
            </span>
          ))}
        </div>
      )}

      {/* The Piano Keyboard Surface */}
      <div 
        ref={keyboardRef}
        className="relative flex justify-center w-full overflow-x-auto py-2 px-1 rounded-xl bg-slate-950 border border-slate-800/90 shadow-inner"
        style={{ minHeight: compact ? '150px' : '220px' }}
      >
        <div className="relative flex h-full">
          {whiteKeys.map((whiteKey, whiteIdx) => {
            const isPressed = pressedNotes.has(whiteKey.name);
            const isActive = activeNotes.includes(whiteKey.name);
            const isTarget = targetNotes.includes(whiteKey.name);

            // Determine if there is a black key immediately following this white key
            const hasBlackRight = whiteKey.pitch !== 'E' && whiteKey.pitch !== 'B' && whiteIdx < whiteKeys.length - 1;
            const blackKeyName = `${whiteKey.pitch}#${whiteKey.octave}`;
            const isBlackPressed = pressedNotes.has(blackKeyName);
            const isBlackActive = activeNotes.includes(blackKeyName);
            const isBlackTarget = targetNotes.includes(blackKeyName);

            // Shortcut mapping
            let shortcutLabel = '';
            if (labelMode === 'shortcuts') {
              if (whiteKey.octave === baseOctave) {
                const map: Record<string, string> = { 'C': 'A', 'D': 'S', 'E': 'D', 'F': 'F', 'G': 'G', 'A': 'H', 'B': 'J' };
                shortcutLabel = map[whiteKey.pitch] || '';
              } else if (whiteKey.octave === baseOctave + 1) {
                const map: Record<string, string> = { 'C': 'K', 'D': 'L', 'E': ';', 'F': "'" };
                shortcutLabel = map[whiteKey.pitch] || '';
              }
            }

            return (
              <div key={whiteKey.name} className="relative flex">
                {/* White Key */}
                <button
                  type="button"
                  onMouseDown={() => handleNoteDown(whiteKey.name)}
                  onMouseUp={() => handleNoteUp(whiteKey.name)}
                  onMouseLeave={() => isPressed && handleNoteUp(whiteKey.name)}
                  onTouchStart={(e) => { e.preventDefault(); handleNoteDown(whiteKey.name); }}
                  onTouchEnd={(e) => { e.preventDefault(); handleNoteUp(whiteKey.name); }}
                  className={`relative select-none rounded-b-md transition-all flex flex-col justify-end items-center pb-2.5
                    ${compact ? 'w-8 sm:w-10 h-36' : 'w-10 sm:w-12 md:w-14 h-48 sm:h-56'}
                    border-x border-b border-slate-400/40
                    ${isPressed
                      ? 'bg-gradient-to-t from-teal-200 via-teal-100 to-white shadow-inner translate-y-1 ring-2 ring-teal-400'
                      : isTarget
                      ? 'bg-gradient-to-t from-emerald-100 via-emerald-50 to-white ring-2 ring-emerald-500 animate-pulse'
                      : isActive
                      ? 'bg-gradient-to-t from-cyan-100 via-sky-50 to-white ring-2 ring-cyan-400'
                      : 'bg-gradient-to-b from-slate-100 via-white to-slate-200 hover:from-slate-50 hover:to-slate-150 shadow-md'
                    }
                  `}
                  style={{
                    boxShadow: isPressed 
                      ? 'inset 0 4px 10px rgba(0,0,0,0.3)' 
                      : '0 4px 6px rgba(0,0,0,0.25), inset 0 -2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  {/* Middle C Indicator Marker */}
                  {whiteKey.name === 'C4' && (
                    <div className="absolute top-2 w-2 h-2 rounded-full bg-rose-500 shadow-xs" title="Middle C (C4)" />
                  )}

                  {/* Key Label */}
                  {labelMode !== 'none' && (
                    <div className="text-center font-mono pointer-events-none">
                      {labelMode === 'names' && (
                        <span className={`block font-bold text-xs ${isPressed ? 'text-teal-900' : 'text-slate-800'}`}>
                          {whiteKey.name}
                        </span>
                      )}
                      {labelMode === 'solfege' && (
                        <span className={`block font-bold text-xs ${isPressed ? 'text-teal-900' : 'text-slate-800'}`}>
                          {whiteKey.solfege}
                        </span>
                      )}
                      {labelMode === 'shortcuts' && shortcutLabel && (
                        <span className="block font-bold text-[10px] bg-slate-300 text-slate-800 px-1 rounded-sm mt-0.5">
                          {shortcutLabel}
                        </span>
                      )}
                    </div>
                  )}
                </button>

                {/* Black Key Overlay */}
                {hasBlackRight && (
                  <button
                    type="button"
                    onMouseDown={(e) => { e.stopPropagation(); handleNoteDown(blackKeyName); }}
                    onMouseUp={(e) => { e.stopPropagation(); handleNoteUp(blackKeyName); }}
                    onMouseLeave={() => isBlackPressed && handleNoteUp(blackKeyName)}
                    onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); handleNoteDown(blackKeyName); }}
                    onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); handleNoteUp(blackKeyName); }}
                    className={`absolute z-20 rounded-b-md transition-all flex flex-col justify-end items-center pb-2 select-none
                      ${compact ? 'w-5 sm:w-6 h-22 -right-2.5 sm:-right-3' : 'w-6 sm:w-7 md:w-8 h-28 sm:h-34 -right-3 sm:-right-3.5 md:-right-4'}
                      border-x border-b border-black
                      ${isBlackPressed
                        ? 'bg-gradient-to-t from-teal-500 via-teal-600 to-slate-900 translate-y-0.5 shadow-inner ring-2 ring-teal-300'
                        : isBlackTarget
                        ? 'bg-gradient-to-t from-emerald-600 via-emerald-800 to-slate-950 ring-2 ring-emerald-400 animate-pulse'
                        : isBlackActive
                        ? 'bg-gradient-to-t from-cyan-600 via-cyan-800 to-slate-950 ring-2 ring-cyan-300'
                        : 'bg-gradient-to-b from-slate-950 via-slate-900 to-black hover:from-slate-800 hover:to-slate-950 shadow-xl'
                      }
                    `}
                    style={{
                      boxShadow: isBlackPressed 
                        ? 'inset 0 3px 6px rgba(0,0,0,0.6)' 
                        : '0 4px 8px rgba(0,0,0,0.6), inset 0 1px 2px rgba(255,255,255,0.2)'
                    }}
                  >
                    {labelMode !== 'none' && (
                      <div className="text-center font-mono pointer-events-none">
                        {labelMode === 'names' && (
                          <span className={`block font-bold text-[9px] ${isBlackPressed ? 'text-white' : 'text-slate-300'}`}>
                            {blackKeyName}
                          </span>
                        )}
                        {labelMode === 'solfege' && (
                          <span className={`block font-bold text-[9px] ${isBlackPressed ? 'text-white' : 'text-slate-300'}`}>
                            {SOLFEGE_MAP[whiteKey.pitch + '#']}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Helper Footer Tip */}
      <div className="flex flex-wrap items-center justify-between mt-2 pt-2 text-[11px] text-slate-400 px-1">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          <span>Interactive keys: Click with mouse, touch on tablet, or play keys <kbd className="px-1 py-0.5 bg-slate-800 rounded font-mono text-slate-200">A-S-D-F-G-H-J</kbd></span>
        </span>
        <span className="hidden sm:inline font-mono text-slate-500">
          Polyphonic • Zero-Latency WebAudio
        </span>
      </div>
    </div>
  );
};
