import React, { useState, useEffect } from 'react';
import { TutorModule, TutorStep, HandAssignment } from '../types/grandPianoTypes';
import { PIANO_TUTOR_MODULES } from '../data/pianoTutorCurriculumData';
import { grandPianoAudio } from '../audio/grandPianoAudioEngine';
import { GrandPianoKeyboard } from './GrandPianoKeyboard';
import { GrandPianoStaffViewer } from './GrandPianoStaffViewer';
import { 
  BookOpen, 
  CheckCircle2, 
  Play, 
  RotateCcw, 
  HelpCircle, 
  Award, 
  Sparkles, 
  Flame, 
  Volume2, 
  ChevronRight, 
  ChevronLeft, 
  Brain, 
  Clock, 
  Lightbulb, 
  Check, 
  ArrowRight,
  Hand,
  Trophy,
  GraduationCap
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface GrandPianoTutorEngineProps {
  onXpEarned?: (xp: number) => void;
  onOpenDiploma?: () => void;
  onOpenWholeTracks?: () => void;
}

export const GrandPianoTutorEngine: React.FC<GrandPianoTutorEngineProps> = ({
  onXpEarned,
  onOpenDiploma,
  onOpenWholeTracks
}) => {
  // Module & Step Navigation State
  const [activeModuleIndex, setActiveModuleIndex] = useState<number>(0);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const activeModule: TutorModule = PIANO_TUTOR_MODULES[activeModuleIndex] || PIANO_TUTOR_MODULES[0];
  const activeStep: TutorStep = activeModule.steps[activeStepIndex] || activeModule.steps[0];

  // Interactive Learner Progress & Verification State
  const [userPlayedNotes, setUserPlayedNotes] = useState<string[]>([]);
  const [currentNoteIndex, setCurrentNoteIndex] = useState<number>(0);
  const [isStepCompleted, setIsStepCompleted] = useState<boolean>(false);
  const [isPlayingDemo, setIsPlayingDemo] = useState<boolean>(false);
  const [soundingNote, setSoundingNote] = useState<string | null>(null);

  // Gamification & Completion Tracking
  const [completedStepIds, setCompletedStepIds] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('grand_piano_tutor_completed_steps');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [tutorStreak, setTutorStreak] = useState<number>(3);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('Read the theory, listen to the demonstration, then play the target notes.');

  // Save completion state
  useEffect(() => {
    localStorage.setItem('grand_piano_tutor_completed_steps', JSON.stringify(completedStepIds));
  }, [completedStepIds]);

  // Reset note evaluation when step changes
  useEffect(() => {
    setUserPlayedNotes([]);
    setCurrentNoteIndex(0);
    setIsStepCompleted(completedStepIds[activeStep.stepId] || false);
    setFeedbackMessage('Ready. Play the target notes on the keyboard below.');
  }, [activeStep.stepId, activeStepIndex, activeModuleIndex]);

  // Play audio demonstration of the step
  const handlePlayDemonstration = () => {
    if (isPlayingDemo || !activeStep.demonstrationNotes.length) return;
    setIsPlayingDemo(true);

    let delayMs = 0;
    activeStep.demonstrationNotes.forEach((item, idx) => {
      setTimeout(() => {
        grandPianoAudio.playNote(item.note, 0.85, item.durationSec);
        setSoundingNote(item.note);

        if (idx === activeStep.demonstrationNotes.length - 1) {
          setTimeout(() => {
            setIsPlayingDemo(false);
            setSoundingNote(null);
          }, item.durationSec * 1000 + 100);
        }
      }, delayMs);
      delayMs += item.durationSec * 1000;
    });
  };

  // Learner Key Input Evaluation
  const handleNotePlayed = (note: string) => {
    setSoundingNote(note);
    setTimeout(() => setSoundingNote(null), 1000);

    const targetList = activeStep.targetExpectedNotes;
    if (!targetList.length || isStepCompleted) return;

    const expectedNote = targetList[currentNoteIndex];

    if (note === expectedNote) {
      const nextIndex = currentNoteIndex + 1;
      setUserPlayedNotes(prev => [...prev, note]);
      setCurrentNoteIndex(nextIndex);

      if (nextIndex >= targetList.length) {
        // Step Completed!
        setIsStepCompleted(true);
        setCompletedStepIds(prev => ({ ...prev, [activeStep.stepId]: true }));
        setFeedbackMessage('🎉 Mastered! Outstanding precision and hand shape!');
        confetti({ particleCount: 35, spread: 70, origin: { y: 0.7 } });
        if (onXpEarned) onXpEarned(activeStep.xpAward);
      } else {
        setFeedbackMessage(`Correct note (${note})! Found ${nextIndex} of ${targetList.length}. Keep going!`);
      }
    } else {
      setFeedbackMessage(`Auditioning ${note}. Expected ${expectedNote}. Listen closely and try again!`);
    }
  };

  // Next / Previous step controls
  const handleNextStep = () => {
    if (activeStepIndex < activeModule.steps.length - 1) {
      setActiveStepIndex(prev => prev + 1);
    } else if (activeModuleIndex < PIANO_TUTOR_MODULES.length - 1) {
      setActiveModuleIndex(prev => prev + 1);
      setActiveStepIndex(0);
    }
  };

  const handlePrevStep = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex(prev => prev - 1);
    } else if (activeModuleIndex > 0) {
      setActiveModuleIndex(prev => prev - 1);
      setActiveStepIndex(PIANO_TUTOR_MODULES[activeModuleIndex - 1].steps.length - 1);
    }
  };

  const totalStepsCount = PIANO_TUTOR_MODULES.reduce((acc, m) => acc + m.steps.length, 0);
  const completedCount = Object.keys(completedStepIds).filter(k => completedStepIds[k]).length;
  const progressPercent = Math.round((completedCount / totalStepsCount) * 100);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* ======================================================== */}
      {/* 1. TUTOR PROGRESS BANNER & MODULE SELECTOR               */}
      {/* ======================================================== */}
      <div className="bg-gradient-to-r from-stone-950 via-amber-950/40 to-stone-950 border border-amber-900/40 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold tracking-wider uppercase flex items-center space-x-1.5 shadow-xs">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>INTERACTIVE PIANO TUTOR • 8 MODULES</span>
              </span>
              <span className="text-xs text-stone-400 font-mono">
                Guided Theory • Hands-On Verification • Real Acoustic Piano
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-black text-amber-100">
              {activeModule.title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl leading-relaxed">
              {activeModule.summary}
            </p>
          </div>

          {/* Overall Curriculum Progress Bar & Diploma CTA */}
          <div className="p-4 rounded-2xl bg-stone-900/90 border border-amber-900/40 shadow-xl shrink-0 w-full lg:w-72 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-stone-300 font-bold">Curriculum Mastery:</span>
              <span className="text-amber-300 font-black">{progressPercent}%</span>
            </div>
            
            <div className="w-full h-2.5 rounded-full bg-stone-950 border border-stone-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-500 shadow-xs"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-stone-400 pt-1">
              <span>{completedCount} of {totalStepsCount} Steps</span>
              {progressPercent >= 50 && onOpenDiploma && (
                <button
                  type="button"
                  onClick={onOpenDiploma}
                  className="text-amber-300 hover:text-amber-200 underline font-bold cursor-pointer"
                >
                  View Diploma
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Module Ribbon (8 Modules) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-t border-amber-900/30 pt-4">
          {PIANO_TUTOR_MODULES.map((mod, idx) => {
            const isModActive = activeModuleIndex === idx;
            const modCompleted = mod.steps.every(s => completedStepIds[s.stepId]);
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => {
                  setActiveModuleIndex(idx);
                  setActiveStepIndex(0);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition whitespace-nowrap flex items-center space-x-2 cursor-pointer ${
                  isModActive
                    ? 'bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/20'
                    : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-850'
                }`}
              >
                <span>{idx + 1}. {mod.title.replace('Module ', '').split(':')[1] || mod.title}</span>
                {modCompleted && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-950" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. ACTIVE STEP PEDAGOGICAL WORKBENCH                     */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Step Lesson, Theory & Demonstration */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-3xl bg-stone-950 border border-amber-900/40 shadow-2xl space-y-5">
            {/* Step Header & Step Dots */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-900 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                  Step {activeStep.stepNumber} of {activeModule.steps.length} • Hand: {activeStep.targetHand}
                </span>
                <h3 className="text-xl font-serif font-black text-amber-100 mt-0.5">
                  {activeStep.title}
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  {activeStep.subtitle}
                </p>
              </div>

              {/* Step Navigation Dots */}
              <div className="flex items-center space-x-1.5 shrink-0">
                {activeModule.steps.map((s, idx) => (
                  <button
                    key={s.stepId}
                    type="button"
                    onClick={() => setActiveStepIndex(idx)}
                    className={`w-3 h-3 rounded-full transition cursor-pointer ${
                      activeStepIndex === idx
                        ? 'bg-amber-400 scale-125'
                        : completedStepIds[s.stepId]
                        ? 'bg-emerald-500'
                        : 'bg-stone-800'
                    }`}
                    title={s.title}
                  />
                ))}
              </div>
            </div>

            {/* In-Depth Theory Explanation */}
            <div className="prose prose-invert max-w-none text-xs sm:text-sm text-stone-300 leading-relaxed font-sans bg-stone-900/60 p-4 rounded-2xl border border-stone-800/80">
              {activeStep.theoryExplanation}
            </div>

            {/* Coach Tip Box */}
            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-900/40 flex items-start space-x-3 text-xs">
              <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-200 font-mono uppercase text-[11px] block mb-0.5">Coach's Pedagogical Tip:</strong>
                <p className="text-stone-300 leading-relaxed">{activeStep.coachAdvice}</p>
              </div>
            </div>

            {/* Interactive Target Verification Controls */}
            <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handlePlayDemonstration}
                  disabled={isPlayingDemo}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs transition flex items-center space-x-2 shadow-lg cursor-pointer disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isPlayingDemo ? 'Demonstrating...' : 'Hear Teacher Demo'}</span>
                </button>

                <div className="text-xs font-mono">
                  <span className="text-stone-400 block text-[10px]">TARGET SEQUENCE:</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {activeStep.targetExpectedNotes.map((note, idx) => (
                      <span
                        key={idx}
                        className={`px-2 py-0.5 rounded-md font-bold text-xs border ${
                          idx < currentNoteIndex
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                            : idx === currentNoteIndex
                            ? 'bg-amber-500 text-stone-950 border-amber-400 animate-pulse'
                            : 'bg-stone-950 text-stone-400 border-stone-800'
                        }`}
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Hand & Finger Guide */}
              {activeStep.suggestedFingers && (
                <div className="text-xs font-mono text-stone-400 bg-stone-950 px-3 py-1.5 rounded-xl border border-stone-800">
                  <span>Fingers: </span>
                  <strong className="text-amber-300">{activeStep.suggestedFingers.join(' - ')}</strong>
                  <span className="text-stone-500 text-[10px] ml-1">({activeStep.targetHand})</span>
                </div>
              )}
            </div>

            {/* Feedback & Step Completion Banner */}
            <div className="p-3.5 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-between text-xs font-mono">
              <span className={isStepCompleted ? 'text-emerald-400 font-bold' : 'text-amber-200'}>
                {feedbackMessage}
              </span>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={activeModuleIndex === 0 && activeStepIndex === 0}
                  className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 disabled:opacity-30 cursor-pointer"
                  title="Previous Step"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={activeModuleIndex === PIANO_TUTOR_MODULES.length - 1 && activeStepIndex === activeModule.steps.length - 1}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center space-x-1 cursor-pointer disabled:opacity-30"
                >
                  <span>Next Step</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Right Col: Tutor Guidepost & Fingering Anatomy */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-stone-950 border border-amber-900/40 shadow-xl space-y-4 text-xs font-mono">
            <h4 className="font-bold text-amber-100 flex items-center space-x-2 text-sm">
              <Hand className="w-4 h-4 text-amber-400" />
              <span>Virtuoso Hand Anatomy</span>
            </h4>

            <div className="p-3.5 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-2 text-[11px] text-stone-300">
              <div className="flex justify-between items-center border-b border-stone-800 pb-1.5">
                <span className="text-amber-300 font-bold">1 = Thumb</span>
                <span className="text-stone-400">Pivot & Anchor</span>
              </div>
              <div className="flex justify-between items-center border-b border-stone-800 pb-1.5">
                <span className="text-amber-300 font-bold">2 = Index</span>
                <span className="text-stone-400">Directional Guide</span>
              </div>
              <div className="flex justify-between items-center border-b border-stone-800 pb-1.5">
                <span className="text-amber-300 font-bold">3 = Middle</span>
                <span className="text-stone-400">Longest Balance Beam</span>
              </div>
              <div className="flex justify-between items-center border-b border-stone-800 pb-1.5">
                <span className="text-amber-300 font-bold">4 = Ring</span>
                <span className="text-stone-400">Delicate Tendon Link</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-amber-300 font-bold">5 = Pinky</span>
                <span className="text-stone-400">Octave & Melody Cantabile</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-900/30 text-[11px] text-stone-300 leading-relaxed">
              <strong className="text-amber-200 block mb-1">XP Reward on Step Pass:</strong>
              <span>Passing this step awards <strong className="text-amber-300">+{activeStep.xpAward} Virtuoso XP</strong> toward your Academy Diploma.</span>
            </div>

            {onOpenWholeTracks && (
              <button
                type="button"
                onClick={onOpenWholeTracks}
                className="w-full py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 border border-amber-900/40 text-amber-200 font-bold text-xs transition flex items-center justify-center space-x-2 cursor-pointer shadow-md"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Play Whole Classical Tracks →</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 3. SYNCHRONIZED NOTATION & CONCERT KEYBOARD             */}
      {/* ======================================================== */}
      <GrandPianoStaffViewer
        activeNote={soundingNote}
        targetNotes={activeStep.targetExpectedNotes}
        keySignature={activeStep.keySignature}
        timeSignature={activeStep.timeSignature}
        tempoBpm={activeStep.tempoBpm}
        onNoteSelected={handleNotePlayed}
      />

      <GrandPianoKeyboard
        activeNotes={soundingNote ? [soundingNote] : []}
        targetNotes={[activeStep.targetExpectedNotes[currentNoteIndex]]}
        onNotePlayed={handleNotePlayed}
        showFullControls={true}
      />
    </div>
  );
};
