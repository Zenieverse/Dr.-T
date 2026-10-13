import React, { useState, useEffect } from 'react';
import { ClassicalWork, PracticeSection, EarHintLevel } from '../types/grandPianoTypes';
import { grandPianoAudio } from '../audio/grandPianoAudioEngine';
import { GrandPianoKeyboard } from './GrandPianoKeyboard';
import { 
  Headphones, 
  Play, 
  RotateCcw, 
  HelpCircle, 
  Eye, 
  EyeOff, 
  ArrowUpRight, 
  ArrowDownRight, 
  ArrowRight, 
  CheckCircle2, 
  Award, 
  Sliders, 
  Brain, 
  Sparkles,
  Volume2,
  Clock,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LearnByEarWorkspaceProps {
  work: ClassicalWork;
  onSwitchToTheory: () => void;
  onXpEarned?: (xp: number) => void;
}

export const LearnByEarWorkspace: React.FC<LearnByEarWorkspaceProps> = ({
  work,
  onSwitchToTheory,
  onXpEarned
}) => {
  const movement = work.movements[0];
  const [selectedSectionIndex, setSelectedSectionIndex] = useState<number>(0);
  const activeSection: PracticeSection | undefined = movement?.practice_sections[selectedSectionIndex];

  // 7 Levels of progressive hints
  const [hintLevel, setHintLevel] = useState<EarHintLevel>(1);
  const [isSlowMode, setIsSlowMode] = useState<boolean>(false);
  const [isPlayingPhrase, setIsPlayingPhrase] = useState<boolean>(false);
  
  // User Input & Evaluation State
  const [userPlayedNotes, setUserPlayedNotes] = useState<string[]>([]);
  const [activeTargetNoteIndex, setActiveTargetNoteIndex] = useState<number>(0);
  const [hasCompletedPhrase, setHasCompletedPhrase] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('Listen to the phrase first, then try finding the notes on the keyboard.');

  const targetNotesList = activeSection?.notes.map(n => n.note_name) || [];

  // Reset when section changes
  useEffect(() => {
    setUserPlayedNotes([]);
    setActiveTargetNoteIndex(0);
    setHasCompletedPhrase(false);
    setHintLevel(1);
    setFeedbackMessage('Listen to the phrase first, then try finding the notes on the keyboard.');
  }, [selectedSectionIndex, work.work_id]);

  // Audio Playback of target phrase
  const handlePlayPhrase = (slow = isSlowMode) => {
    if (!activeSection || isPlayingPhrase) return;
    setIsPlayingPhrase(true);
    const speedMultiplier = slow ? 1.4 : 1.0;

    activeSection.notes.forEach((ev, idx) => {
      setTimeout(() => {
        grandPianoAudio.playNote(ev.note_name, ev.velocity, (ev.duration_sec * speedMultiplier));
        if (idx === activeSection.notes.length - 1) {
          setTimeout(() => setIsPlayingPhrase(false), (ev.duration_sec * speedMultiplier) * 1000 + 100);
        }
      }, (ev.onset_time_sec * speedMultiplier) * 1000);
    });
  };

  // Learner Key Input Evaluation
  const handleNotePlayed = (note: string) => {
    setUserPlayedNotes(prev => [...prev.slice(-12), note]);

    if (!targetNotesList.length || hasCompletedPhrase) return;

    const expectedNote = targetNotesList[activeTargetNoteIndex];
    if (note === expectedNote) {
      const nextIndex = activeTargetNoteIndex + 1;
      setActiveTargetNoteIndex(nextIndex);

      if (nextIndex >= targetNotesList.length) {
        setHasCompletedPhrase(true);
        setFeedbackMessage('🎉 Mastered! You reproduced the full phrase by ear!');
        confetti({ particleCount: 30, spread: 60 });
        if (onXpEarned) onXpEarned(25);
      } else {
        setFeedbackMessage(`Correct! Found note ${nextIndex} of ${targetNotesList.length}. Keep going!`);
      }
    } else {
      setFeedbackMessage(`Auditioning ${note}. Listen closely to the pitch difference and try again.`);
    }
  };

  // Hint Controls
  const handleUnlockNextHint = () => {
    setHintLevel(prev => Math.min(7, prev + 1) as EarHintLevel);
  };

  const handleHideAllHints = () => {
    setHintLevel(7); // Level 7: Perform from memory (zero hints)
    setUserPlayedNotes([]);
    setActiveTargetNoteIndex(0);
    setHasCompletedPhrase(false);
    setFeedbackMessage('All visual hints hidden. Perform the phrase entirely from ear and memory!');
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Mode Switcher */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-stone-950 via-slate-950 to-amber-950/40 border border-amber-900/40 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center space-x-1">
              <Headphones className="w-3.5 h-3.5" />
              <span>LEARN BY EAR STUDIO</span>
            </span>
            <span className="text-xs text-stone-400 font-mono">
              7 Progressive Hint Levels
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-black text-amber-100">
            {work.title}
          </h2>
          <p className="text-xs text-amber-200/70 font-serif italic mt-0.5">
            {work.composer} • {movement?.title}
          </p>
        </div>

        {/* Switch to Learn by Theory button */}
        <button
          type="button"
          onClick={onSwitchToTheory}
          className="px-4 py-2.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 hover:text-white text-xs font-bold transition flex items-center space-x-2 shadow-md cursor-pointer"
        >
          <Brain className="w-4 h-4 text-indigo-400" />
          <span>Switch to Learn by Theory →</span>
        </button>
      </div>

      {/* 2. Practice Phrase Selector */}
      {movement?.practice_sections.length > 0 && (
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar text-xs font-mono">
          <span className="text-stone-400 font-bold shrink-0">Practice Phrases:</span>
          {movement.practice_sections.map((sec, idx) => (
            <button
              key={sec.section_id}
              type="button"
              onClick={() => setSelectedSectionIndex(idx)}
              className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap cursor-pointer ${
                selectedSectionIndex === idx 
                  ? 'bg-amber-600 text-stone-950 font-bold shadow-md' 
                  : 'bg-stone-900 border border-stone-800 text-stone-300 hover:text-white'
              }`}
            >
              {sec.title}
            </button>
          ))}
        </div>
      )}

      {/* 3. Ear Learning Workspace: 7 Progressive Hint Levels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Listen & Hint Visualization */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Reference Audio / Audition Box */}
          <div className="p-5 rounded-2xl bg-stone-900/80 border border-amber-900/40 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-amber-100 flex items-center space-x-2">
                  <Volume2 className="w-4 h-4 text-amber-400" />
                  <span>Reference Audio & Phrase Loop</span>
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Listen first. Absorb the contour, rhythm, and tone before pressing keys.
                </p>
              </div>

              {/* Transport Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsSlowMode(prev => !prev)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition ${
                    isSlowMode ? 'bg-amber-500/20 text-amber-300 border-amber-500' : 'bg-stone-950 text-stone-400 border-stone-800'
                  }`}
                >
                  Slow 70%
                </button>

                <button
                  type="button"
                  onClick={() => handlePlayPhrase()}
                  disabled={isPlayingPhrase}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs transition flex items-center space-x-1.5 shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isPlayingPhrase ? 'Playing...' : 'Hear Phrase'}</span>
                </button>
              </div>
            </div>

            {/* Hint Levels 1 to 7 Ribbon */}
            <div className="border-t border-stone-800 pt-3">
              <div className="flex items-center justify-between text-xs font-mono text-stone-400 mb-2">
                <span>Active Hint: <strong className="text-amber-300">Level {hintLevel} of 7</strong></span>
                <button
                  type="button"
                  onClick={handleHideAllHints}
                  className="text-stone-400 hover:text-amber-200 underline text-[11px] cursor-pointer"
                >
                  Level 7: Perform From Memory
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1">
                {[
                  { lvl: 1, label: '1. Listen' },
                  { lvl: 2, label: '2. Contour' },
                  { lvl: 3, label: '3. Keys' },
                  { lvl: 4, label: '4. Names' },
                  { lvl: 5, label: '5. Sequence' },
                  { lvl: 6, label: '6. Intervals' },
                  { lvl: 7, label: '7. Memory' },
                ].map((item) => (
                  <button
                    key={item.lvl}
                    type="button"
                    onClick={() => setHintLevel(item.lvl as EarHintLevel)}
                    className={`py-1.5 rounded-lg text-[10px] font-mono font-bold transition text-center cursor-pointer ${
                      hintLevel === item.lvl 
                        ? 'bg-amber-500 text-stone-950 shadow-md' 
                        : hintLevel > item.lvl
                        ? 'bg-amber-950/60 text-amber-300 border border-amber-900/50'
                        : 'bg-stone-950 text-stone-500 border border-stone-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Level 2 Hint: Melodic Contour Graph */}
            {hintLevel >= 2 && hintLevel < 7 && activeSection && (
              <div className="p-3.5 rounded-xl bg-stone-950 border border-amber-900/30 space-y-2 animate-in fade-in">
                <span className="text-[11px] font-mono font-bold text-amber-300 uppercase tracking-wider block">
                  Level 2 Hint: Melodic Contour (Pitch Direction)
                </span>
                <div className="flex items-center gap-2 overflow-x-auto text-xs font-mono py-1">
                  {activeSection.contour.map((dir, i) => (
                    <div 
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-stone-900 border border-stone-800 flex items-center space-x-1"
                    >
                      <span className="text-[10px] text-stone-500">#{i + 1}</span>
                      {dir === 'higher' && <span className="text-emerald-400 flex items-center font-bold">▲ Higher</span>}
                      {dir === 'lower' && <span className="text-rose-400 flex items-center font-bold">▼ Lower</span>}
                      {dir === 'same' && <span className="text-amber-400 flex items-center font-bold">► Same</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Level 5 Hint: Ordered Note Sequence */}
            {hintLevel >= 5 && hintLevel < 7 && (
              <div className="p-3.5 rounded-xl bg-stone-950 border border-amber-900/30 space-y-2 animate-in fade-in">
                <span className="text-[11px] font-mono font-bold text-teal-300 uppercase tracking-wider block">
                  Level 5 Hint: Verified Target Note Sequence
                </span>
                <div className="flex items-center gap-1.5 flex-wrap font-mono text-xs">
                  {targetNotesList.map((n, idx) => (
                    <span
                      key={idx}
                      className={`px-2 py-1 rounded-lg font-bold border ${
                        idx < activeTargetNoteIndex 
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800' 
                          : idx === activeTargetNoteIndex
                          ? 'bg-amber-500 text-stone-950 border-amber-400 animate-pulse'
                          : 'bg-stone-900 text-stone-400 border-stone-800'
                      }`}
                    >
                      {hintLevel >= 4 ? n : `Note ${idx + 1}`}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Level 6 Hint: Rhythm & Intervals Insight */}
            {hintLevel >= 6 && hintLevel < 7 && activeSection && (
              <div className="p-3.5 rounded-xl bg-stone-950 border border-amber-900/30 space-y-1.5 animate-in fade-in text-xs font-mono">
                <span className="font-bold text-amber-300 uppercase text-[10px]">Level 6: Musical Patterns</span>
                <p className="text-stone-300">{activeSection.theory_insight}</p>
                <p className="text-[11px] text-stone-400">Rhythm: {activeSection.rhythm_description}</p>
              </div>
            )}

            {/* Feedback & Progress Status */}
            <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between text-xs font-mono">
              <span className="text-amber-200">{feedbackMessage}</span>
              <div className="flex items-center space-x-2">
                <span className="text-stone-400">
                  {activeTargetNoteIndex} / {targetNotesList.length} notes found
                </span>
                {hintLevel < 6 && (
                  <button
                    type="button"
                    onClick={handleUnlockNextHint}
                    className="text-amber-400 hover:text-amber-300 underline text-[11px] cursor-pointer"
                  >
                    Need Hint? (+1 Lvl)
                  </button>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Right Col: Ear Training Theory Sidebar */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-stone-900/60 border border-amber-900/40 space-y-3 text-xs font-mono text-stone-300">
            <h4 className="font-bold text-amber-100 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Ear Training Principles</span>
            </h4>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              Classical ear training teaches your brain to associate physical hand geography with auditory pitch memory.
            </p>

            <div className="space-y-2 pt-2 border-t border-stone-800 text-[11px]">
              <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800/80">
                <strong className="text-amber-200">1. Pitch Direction:</strong>
                <p className="text-stone-400">Sing or hum the phrase. Does the pitch rise towards treble or fall into bass?</p>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800/80">
                <strong className="text-amber-200">2. Anchor Note:</strong>
                <p className="text-stone-400">Identify the home tonic note ({work.key_signature}). Most phrases resolve home.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800/80">
                <strong className="text-amber-200">3. Interval Distance:</strong>
                <p className="text-stone-400">Is the next note stepping to its neighbour or leaping across a third or fifth?</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleHideAllHints}
              className="w-full py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-200 font-bold text-xs transition border border-stone-700 cursor-pointer"
            >
              Test From Memory (Level 7)
            </button>
          </div>
        </div>

      </div>

      {/* 4. Interactive Digital Piano with Target Note Highlighting */}
      <GrandPianoKeyboard
        targetNotes={hintLevel >= 3 && hintLevel < 7 ? [targetNotesList[activeTargetNoteIndex]] : []}
        onNotePlayed={handleNotePlayed}
      />
    </div>
  );
};
