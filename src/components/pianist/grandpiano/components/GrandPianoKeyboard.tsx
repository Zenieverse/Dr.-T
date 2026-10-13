import React, { useState, useEffect, useCallback, useRef } from 'react';
import { grandPianoAudio, RecordedNoteEvent } from '../audio/grandPianoAudioEngine';
import { PianoPreset } from '../types/grandPianoTypes';
import { 
  Volume2, 
  VolumeX, 
  Clock, 
  Disc, 
  Square, 
  Play, 
  Sliders, 
  Maximize2, 
  Minimize2, 
  Sparkles,
  HelpCircle,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  RotateCcw
} from 'lucide-react';

interface GrandPianoKeyboardProps {
  activeNotes?: string[];      // Externally triggered notes (e.g. lesson play-along)
  targetNotes?: string[];      // Hints for ear training or practice
  onNotePlayed?: (note: string) => void;
  showFullControls?: boolean;
  className?: string;
}

// 2-Octave computer keyboard binding map (relative to base octave)
const COMPUTER_KEYS: Record<string, { noteOffset: number; isUpper?: boolean }> = {
  'a': { noteOffset: 0 },   // C
  'w': { noteOffset: 1 },   // C#
  's': { noteOffset: 2 },   // D
  'e': { noteOffset: 3 },   // D#
  'd': { noteOffset: 4 },   // E
  'f': { noteOffset: 5 },   // F
  't': { noteOffset: 6 },   // F#
  'g': { noteOffset: 7 },   // G
  'y': { noteOffset: 8 },   // G#
  'h': { noteOffset: 9 },   // A
  'u': { noteOffset: 10 },  // A#
  'j': { noteOffset: 11 },  // B
  // Upper Octave
  'k': { noteOffset: 12, isUpper: true }, // C+1
  'o': { noteOffset: 13, isUpper: true }, // C#+1
  'l': { noteOffset: 14, isUpper: true }, // D+1
  'p': { noteOffset: 15, isUpper: true }, // D#+1
  ';': { noteOffset: 16, isUpper: true }, // E+1
  "'": { noteOffset: 17, isUpper: true }, // F+1
};

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const GrandPianoKeyboard: React.FC<GrandPianoKeyboardProps> = ({
  activeNotes = [],
  targetNotes = [],
  onNotePlayed,
  showFullControls = true,
  className = ''
}) => {
  // Octave & Layout State
  const [baseOctave, setBaseOctave] = useState<number>(3); // Defaults to C3–B5 (3 octaves)
  const [octaveCount, setOctaveCount] = useState<number>(3); // 3 octaves (36 keys) or full 88 keys
  const [is88KeyMode, setIs88KeyMode] = useState<boolean>(false);
  
  // Audio & Timbre Settings
  const [volume, setVolume] = useState<number>(0.8);
  const [isSustainOn, setIsSustainOn] = useState<boolean>(false);
  const [preset, setPreset] = useState<PianoPreset>('concert-grand');
  const [transposition, setTransposition] = useState<number>(0);
  
  // Metronome State
  const [isMetronomeOn, setIsMetronomeOn] = useState<boolean>(false);
  const [bpm, setBpm] = useState<number>(90);
  const [currentBeat, setCurrentBeat] = useState<number>(0);
  
  // Recording State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedTakes, setRecordedTakes] = useState<RecordedNoteEvent[]>([]);
  const [isPlayingBack, setIsPlayingBack] = useState<boolean>(false);
  
  // Visual Labels & Key Guidance
  const [labelMode, setLabelMode] = useState<'names' | 'keyboard' | 'none'>('names');
  const [showKeyboardGuide, setShowKeyboardGuide] = useState<boolean>(false);
  const [pressedNotes, setPressedNotes] = useState<Set<string>>(new Set());
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const pianoContainerRef = useRef<HTMLDivElement>(null);

  // Sync Audio Settings
  useEffect(() => {
    grandPianoAudio.setVolume(volume);
  }, [volume]);

  useEffect(() => {
    grandPianoAudio.setPreset(preset);
  }, [preset]);

  useEffect(() => {
    grandPianoAudio.setTransposition(transposition);
  }, [transposition]);

  useEffect(() => {
    grandPianoAudio.setSustain(isSustainOn);
  }, [isSustainOn]);

  // Metronome Toggle
  const toggleMetronome = () => {
    if (isMetronomeOn) {
      grandPianoAudio.stopMetronome();
      setIsMetronomeOn(false);
    } else {
      grandPianoAudio.startMetronome(bpm, 4, (beat) => setCurrentBeat(beat));
      setIsMetronomeOn(true);
    }
  };

  // Recording Controls
  const toggleRecording = () => {
    if (isRecording) {
      const take = grandPianoAudio.stopRecording();
      setRecordedTakes(take);
      setIsRecording(false);
    } else {
      grandPianoAudio.startRecording();
      setIsRecording(true);
      setRecordedTakes([]);
    }
  };

  const handleReplayTake = () => {
    if (!recordedTakes.length || isPlayingBack) return;
    setIsPlayingBack(true);
    grandPianoAudio.replayTake(recordedTakes, () => {
      setIsPlayingBack(false);
    });
  };

  // Play Note Action
  const triggerNoteOn = useCallback((noteName: string, velocity = 0.8) => {
    grandPianoAudio.playNote(noteName, velocity);
    setPressedNotes(prev => new Set(prev).add(noteName));
    if (onNotePlayed) onNotePlayed(noteName);
  }, [onNotePlayed]);

  const triggerNoteOff = useCallback((noteName: string) => {
    grandPianoAudio.stopNote(noteName, false);
    setPressedNotes(prev => {
      const next = new Set(prev);
      next.delete(noteName);
      return next;
    });
  }, []);

  // Physical Computer Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      // Space bar toggles sustain pedal
      if (e.code === 'Space') {
        e.preventDefault();
        setIsSustainOn(prev => !prev);
        return;
      }

      const key = e.key.toLowerCase();
      if (COMPUTER_KEYS[key]) {
        e.preventDefault();
        const mapping = COMPUTER_KEYS[key];
        const oct = mapping.isUpper ? baseOctave + 1 : baseOctave;
        const pitchIndex = mapping.noteOffset % 12;
        const noteName = `${NOTE_NAMES[pitchIndex]}${oct}`;
        triggerNoteOn(noteName);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (COMPUTER_KEYS[key]) {
        const mapping = COMPUTER_KEYS[key];
        const oct = mapping.isUpper ? baseOctave + 1 : baseOctave;
        const pitchIndex = mapping.noteOffset % 12;
        const noteName = `${NOTE_NAMES[pitchIndex]}${oct}`;
        triggerNoteOff(noteName);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [baseOctave, triggerNoteOn, triggerNoteOff]);

  // Generate Key List (Exact 88 keys A0–C8 or Octave window)
  const generateKeys = () => {
    const keys: Array<{ name: string; isBlack: boolean; keyShortcut?: string; isMiddleC?: boolean }> = [];

    if (is88KeyMode) {
      // 88 key piano starts at A0, A#0, B0 (3 sub-contra octave notes)
      keys.push({ name: 'A0', isBlack: false });
      keys.push({ name: 'A#0', isBlack: true });
      keys.push({ name: 'B0', isBlack: false });

      // Octaves 1 through 7 (7 * 12 = 84 notes)
      for (let oct = 1; oct <= 7; oct++) {
        for (let i = 0; i < 12; i++) {
          const pitch = NOTE_NAMES[i];
          const name = `${pitch}${oct}`;
          const isBlack = pitch.includes('#');

          let shortcut: string | undefined;
          if (oct === baseOctave || oct === baseOctave + 1) {
            const relIndex = (oct - baseOctave) * 12 + i;
            for (const [k, map] of Object.entries(COMPUTER_KEYS)) {
              if (map.noteOffset === relIndex) {
                shortcut = k.toUpperCase();
                break;
              }
            }
          }

          keys.push({
            name,
            isBlack,
            keyShortcut: shortcut,
            isMiddleC: name === 'C4'
          });
        }
      }

      // 88 key piano ends on top C8 (1 note) -> Total: 3 + 84 + 1 = 88 unique keys
      keys.push({ name: 'C8', isBlack: false });
    } else {
      // 3-octave / custom octave window starting at baseOctave
      for (let oct = baseOctave; oct < baseOctave + octaveCount; oct++) {
        for (let i = 0; i < 12; i++) {
          const pitch = NOTE_NAMES[i];
          const name = `${pitch}${oct}`;
          const isBlack = pitch.includes('#');

          let shortcut: string | undefined;
          if (oct === baseOctave || oct === baseOctave + 1) {
            const relIndex = (oct - baseOctave) * 12 + i;
            for (const [k, map] of Object.entries(COMPUTER_KEYS)) {
              if (map.noteOffset === relIndex) {
                shortcut = k.toUpperCase();
                break;
              }
            }
          }

          keys.push({
            name,
            isBlack,
            keyShortcut: shortcut,
            isMiddleC: name === 'C4'
          });
        }
      }
    }

    // Guarantee strictly unique keys in keyboard list
    const seenNames = new Set<string>();
    const uniqueKeys: Array<{ name: string; isBlack: boolean; keyShortcut?: string; isMiddleC?: boolean }> = [];
    for (const key of keys) {
      if (!seenNames.has(key.name)) {
        seenNames.add(key.name);
        uniqueKeys.push(key);
      }
    }

    return uniqueKeys;
  };

  const keys = generateKeys();

  // Fullscreen Toggle
  const toggleFullscreen = () => {
    if (!pianoContainerRef.current) return;
    if (!isFullscreen) {
      if (pianoContainerRef.current.requestFullscreen) {
        pianoContainerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  return (
    <div 
      ref={pianoContainerRef}
      className={`rounded-3xl border border-amber-900/40 bg-gradient-to-b from-stone-950 via-slate-950 to-black text-slate-100 p-4 sm:p-6 shadow-2xl space-y-4 ${className}`}
    >
      {/* 1. Acoustic Grand Piano Header & Fallboard Trim */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-amber-900/30 pb-4">
        <div className="flex items-center space-x-3">
          {/* Polished Lacquer Emblem */}
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-700 via-yellow-500 to-amber-900 p-0.5 shadow-lg flex items-center justify-center">
            <div className="w-full h-full bg-stone-950 rounded-2xl flex items-center justify-center text-amber-300 font-serif font-black text-lg">
              𝄢
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-serif font-bold text-lg text-amber-100 tracking-wide">
                FLOW GRAND PIANO
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                Acoustic Modeling
              </span>
            </div>
            <p className="text-[11px] text-amber-200/60 font-serif italic">
              Concert Grand Soundboard • Multi-Harmonic Hammer Physics • Web Audio Polyphony
            </p>
          </div>
        </div>

        {/* 2. Top Tooling Toolbar */}
        {showFullControls && (
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            {/* Piano Timbre Preset Selector */}
            <div className="flex items-center space-x-1 bg-stone-900/90 border border-amber-900/40 rounded-xl px-2 py-1">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <select
                value={preset}
                onChange={(e) => setPreset(e.target.value as PianoPreset)}
                className="bg-transparent text-amber-200 text-xs font-bold outline-none cursor-pointer"
              >
                <option value="concert-grand" className="bg-stone-900">Concert Grand</option>
                <option value="mellow-piano" className="bg-stone-900">Mellow Steinway</option>
                <option value="soft-piano" className="bg-stone-900">Soft Felt Piano</option>
                <option value="bright-upright" className="bg-stone-900">Bright Upright</option>
              </select>
            </div>

            {/* Octave Range Shift */}
            <div className="flex items-center space-x-1 bg-stone-900/90 border border-amber-900/40 rounded-xl px-2 py-1">
              <span className="text-[10px] text-amber-400">Octave:</span>
              <button
                type="button"
                onClick={() => setBaseOctave(prev => Math.max(1, prev - 1))}
                disabled={is88KeyMode}
                className="hover:text-amber-300 disabled:opacity-30 cursor-pointer p-0.5"
                title="Shift Octave Down"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="font-bold text-amber-200 min-w-4 text-center">
                {is88KeyMode ? '88K' : `C${baseOctave}`}
              </span>
              <button
                type="button"
                onClick={() => setBaseOctave(prev => Math.min(6, prev + 1))}
                disabled={is88KeyMode}
                className="hover:text-amber-300 disabled:opacity-30 cursor-pointer p-0.5"
                title="Shift Octave Up"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 88-Key / 61-Key Toggle */}
            <button
              type="button"
              onClick={() => setIs88KeyMode(prev => !prev)}
              className={`px-2.5 py-1 rounded-xl border transition cursor-pointer ${
                is88KeyMode 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' 
                  : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-stone-200'
              }`}
            >
              {is88KeyMode ? 'Full 88-Key' : 'Compact 3-Oct'}
            </button>

            {/* Metronome Pill */}
            <div className="flex items-center space-x-1 bg-stone-900/90 border border-amber-900/40 rounded-xl px-2 py-1">
              <button
                type="button"
                onClick={toggleMetronome}
                className={`p-0.5 rounded transition flex items-center space-x-1 ${
                  isMetronomeOn ? 'text-amber-400 animate-pulse font-bold' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{bpm}</span>
              </button>
              {isMetronomeOn && (
                <div className="flex space-x-0.5">
                  {[0, 1, 2, 3].map((b) => (
                    <div
                      key={b}
                      className={`w-1.5 h-1.5 rounded-full ${
                        currentBeat === b ? 'bg-amber-400 scale-125' : 'bg-stone-700'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Sustain Pedal Toggle */}
            <button
              type="button"
              onClick={() => setIsSustainOn(prev => !prev)}
              className={`px-3 py-1 rounded-xl border transition flex items-center space-x-1 cursor-pointer ${
                isSustainOn 
                  ? 'bg-amber-600 text-stone-950 font-bold border-amber-500 shadow-md' 
                  : 'bg-stone-900 text-stone-400 border-amber-900/40 hover:text-stone-200'
              }`}
              title="Toggle Sustain Pedal (or press Spacebar)"
            >
              <span>Pedal</span>
              <span className={`text-[9px] px-1 rounded ${isSustainOn ? 'bg-stone-950 text-amber-300' : 'bg-stone-800'}`}>
                {isSustainOn ? 'ON' : 'OFF'}
              </span>
            </button>

            {/* Performance Recorder Button */}
            <button
              type="button"
              onClick={toggleRecording}
              className={`px-2.5 py-1 rounded-xl border transition flex items-center space-x-1 cursor-pointer ${
                isRecording 
                  ? 'bg-rose-950 text-rose-300 border-rose-500 animate-pulse font-bold' 
                  : 'bg-stone-900 text-stone-400 border-amber-900/40 hover:text-rose-300'
              }`}
            >
              {isRecording ? <Square className="w-3 h-3 text-rose-400 fill-current" /> : <Disc className="w-3 h-3 text-rose-400" />}
              <span>{isRecording ? 'Stop Rec' : 'Rec'}</span>
            </button>

            {/* Replay Take Button */}
            {recordedTakes.length > 0 && (
              <button
                type="button"
                onClick={handleReplayTake}
                disabled={isPlayingBack}
                className="px-2.5 py-1 rounded-xl bg-teal-950 text-teal-300 border border-teal-800 hover:bg-teal-900 text-xs flex items-center space-x-1 cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3 h-3 text-teal-400 fill-current" />
                <span>Replay ({recordedTakes.length})</span>
              </button>
            )}

            {/* Computer Keyboard Guide Button */}
            <button
              type="button"
              onClick={() => setShowKeyboardGuide(prev => !prev)}
              className={`p-1.5 rounded-xl border transition cursor-pointer ${
                showKeyboardGuide ? 'bg-amber-500/20 text-amber-300 border-amber-500' : 'bg-stone-900 text-stone-400 border-amber-900/40 hover:text-white'
              }`}
              title="Show Computer Keyboard Shortcuts Guide"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>

            {/* Fullscreen Button */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white border border-amber-900/40 transition cursor-pointer"
              title="Toggle Fullscreen Piano"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}
      </div>

      {/* 3. Computer Keyboard Mapping Guide Banner */}
      {showKeyboardGuide && (
        <div className="bg-stone-900/90 border border-amber-900/50 rounded-2xl p-3 text-xs font-mono text-stone-300 space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-300">Computer Keyboard Binding:</span>
            <span className="text-[10px] text-stone-400">Spacebar = Sustain Pedal</span>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px]">
            <div className="p-1.5 rounded-lg bg-stone-950 border border-stone-800">
              <span className="text-stone-400">Lower White: </span>
              <strong className="text-amber-200">A S D F G H J</strong> (C to B)
            </div>
            <div className="p-1.5 rounded-lg bg-stone-950 border border-stone-800">
              <span className="text-stone-400">Lower Black: </span>
              <strong className="text-amber-400">W E • T Y U</strong> (C# D# • F# G# A#)
            </div>
            <div className="p-1.5 rounded-lg bg-stone-950 border border-stone-800">
              <span className="text-stone-400">Upper Octave: </span>
              <strong className="text-amber-200">K L ; '</strong> (C+1 to F+1)
            </div>
          </div>
        </div>
      )}

      {/* 4. Grand Piano Fallboard Wood Trim */}
      <div className="h-2 rounded-t-lg bg-gradient-to-r from-amber-900 via-amber-700 to-amber-950 shadow-inner border-b border-amber-950" />

      {/* 5. The Grand Piano Keyboard Surface */}
      <div className="relative overflow-x-auto pb-4 select-none no-scrollbar">
        <div className="relative flex justify-center min-w-max bg-stone-950 p-2 sm:p-4 rounded-b-2xl border border-stone-900 shadow-2xl">
          {/* Piano Key Bed */}
          <div className="relative flex">
            {keys.map((key, idx) => {
              const isPressed = pressedNotes.has(key.name);
              const isActive = activeNotes.includes(key.name);
              const isTarget = targetNotes.includes(key.name);

              if (key.isBlack) {
                // Black Key (Ebony)
                return (
                  <button
                    key={`black-key-${key.name}-${idx}`}
                    type="button"
                    onMouseDown={() => triggerNoteOn(key.name)}
                    onMouseUp={() => triggerNoteOff(key.name)}
                    onMouseLeave={() => triggerNoteOff(key.name)}
                    onTouchStart={(e) => { e.preventDefault(); triggerNoteOn(key.name); }}
                    onTouchEnd={(e) => { e.preventDefault(); triggerNoteOff(key.name); }}
                    style={{
                      marginLeft: '-0.85rem',
                      marginRight: '-0.85rem',
                      zIndex: 20
                    }}
                    className={`w-7 sm:w-8 h-28 sm:h-36 rounded-b-md transition-all relative flex flex-col justify-end items-center pb-2 shadow-2xl cursor-pointer ${
                      isPressed
                        ? 'bg-amber-400 border-2 border-amber-200 scale-95 shadow-amber-500/50'
                        : isActive
                        ? 'bg-teal-500 border-2 border-teal-300 animate-pulse'
                        : isTarget
                        ? 'bg-amber-600/80 border-2 border-amber-300'
                        : 'bg-gradient-to-b from-stone-950 via-stone-900 to-black hover:from-stone-800 border-t-2 border-stone-800'
                    }`}
                  >
                    {/* Visual Key Labels */}
                    <div className="text-[9px] font-mono font-bold pointer-events-none flex flex-col items-center">
                      {labelMode === 'names' && (
                        <span className={isPressed ? 'text-stone-950' : 'text-stone-300'}>
                          {key.name}
                        </span>
                      )}
                      {showKeyboardGuide && key.keyShortcut && (
                        <span className="text-[8px] text-amber-400/80 mt-0.5">
                          {key.keyShortcut}
                        </span>
                      )}
                    </div>
                  </button>
                );
              }

              // White Key (Ivory)
              return (
                <button
                  key={`white-key-${key.name}-${idx}`}
                  type="button"
                  onMouseDown={() => triggerNoteOn(key.name)}
                  onMouseUp={() => triggerNoteOff(key.name)}
                  onMouseLeave={() => triggerNoteOff(key.name)}
                  onTouchStart={(e) => { e.preventDefault(); triggerNoteOn(key.name); }}
                  onTouchEnd={(e) => { e.preventDefault(); triggerNoteOff(key.name); }}
                  className={`w-10 sm:w-12 h-44 sm:h-56 rounded-b-xl border border-stone-300 transition-all relative flex flex-col justify-end items-center pb-3 shadow-md cursor-pointer ${
                    isPressed
                      ? 'bg-gradient-to-t from-amber-200 to-amber-300 border-amber-400 scale-y-98 shadow-inner'
                      : isActive
                      ? 'bg-gradient-to-t from-teal-200 to-teal-300 border-teal-400'
                      : isTarget
                      ? 'bg-gradient-to-t from-amber-100 to-yellow-200 border-amber-400'
                      : key.isMiddleC
                      ? 'bg-gradient-to-b from-amber-50/90 to-amber-100/90 hover:from-white hover:to-amber-50'
                      : 'bg-gradient-to-b from-white via-stone-50 to-stone-100 hover:from-stone-50 hover:to-white'
                  }`}
                >
                  {/* Middle C Indicator Marker */}
                  {key.isMiddleC && (
                    <div className="absolute top-2 w-2 h-2 rounded-full bg-amber-500 shadow-xs" title="Middle C (C4)" />
                  )}

                  {/* Visual Labels on White Keys */}
                  <div className="text-[10px] font-mono font-bold pointer-events-none flex flex-col items-center">
                    {labelMode === 'names' && (
                      <span className={isPressed ? 'text-stone-950' : 'text-stone-800'}>
                        {key.name}
                      </span>
                    )}
                    {showKeyboardGuide && key.keyShortcut && (
                      <span className="text-[9px] text-amber-700/70 font-semibold mt-0.5">
                        {key.keyShortcut}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 6. Lower Soundboard Status Bar */}
      <div className="flex flex-wrap items-center justify-between text-xs font-mono text-stone-400 border-t border-amber-900/30 pt-3">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-amber-200">Polyphony Active</span>
          </span>
          <span>•</span>
          <span>Pedal: <strong className={isSustainOn ? 'text-amber-400 font-bold' : 'text-stone-500'}>{isSustainOn ? 'ENGAGED' : 'RELEASED'}</strong></span>
          <span>•</span>
          <span>Timbre: <strong className="text-amber-300 capitalize">{preset.replace('-', ' ')}</strong></span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setLabelMode(prev => prev === 'names' ? 'keyboard' : prev === 'keyboard' ? 'none' : 'names')}
            className="hover:text-amber-200 underline cursor-pointer text-[11px]"
          >
            Labels: {labelMode.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
};
