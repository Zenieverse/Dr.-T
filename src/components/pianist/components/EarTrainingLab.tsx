import React, { useState } from 'react';
import { EarExercise } from '../../../types/pianistTypes';
import { EAR_EXERCISES } from '../data/pianistData';
import { pianoAudio } from '../audio/pianoAudio';
import { Headphones, Volume2, CheckCircle, XCircle, Award, Sparkles, RefreshCw, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface EarTrainingLabProps {
  onXpEarned?: (xp: number) => void;
  onSelectTargetNotes?: (notes: string[]) => void;
}

export const EarTrainingLab: React.FC<EarTrainingLabProps> = ({
  onXpEarned,
  onSelectTargetNotes,
}) => {
  const [currentLvlIdx, setCurrentLvlIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [totalAttempts, setTotalAttempts] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [listenFindUserInput, setListenFindUserInput] = useState<string[]>([]);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const currentExercise = EAR_EXERCISES[currentLvlIdx] || EAR_EXERCISES[0];

  // Play the exercise audio sample
  const handlePlayPrompt = () => {
    setIsPlayingAudio(true);
    if (currentExercise.type === 'major-minor') {
      // Play as chord
      pianoAudio.playChord(currentExercise.notes, 1.8);
      setTimeout(() => setIsPlayingAudio(false), 1800);
    } else {
      // Play as melody sequence
      currentExercise.notes.forEach((note, idx) => {
        setTimeout(() => {
          pianoAudio.playNote(note, 0.85, 0.7);
          if (idx === currentExercise.notes.length - 1) {
            setIsPlayingAudio(false);
          }
        }, idx * 600);
      });
    }
  };

  // Submit answer
  const handleSelectOption = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);
    setTotalAttempts(prev => prev + 1);

    const isCorrect = option === currentExercise.correctAnswer;
    if (isCorrect) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
      if (onXpEarned) onXpEarned(25);
      if (streak + 1 >= 3) {
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
      }
    } else {
      setStreak(0);
    }
  };

  const handleNextExercise = () => {
    setIsAnswered(false);
    setSelectedOption(null);
    setListenFindUserInput([]);
    const nextIdx = (currentLvlIdx + 1) % EAR_EXERCISES.length;
    setCurrentLvlIdx(nextIdx);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl">
      {/* Header & Stats Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
              <Headphones className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Ear Lab: Hear → Understand → Find → Play
              </h2>
              <p className="text-xs text-slate-400">
                Level {currentExercise.levelNumber} of {EAR_EXERCISES.length}: {currentExercise.title}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Pills */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Score: <strong className="text-white font-mono">{score}/{totalAttempts}</strong></span>
          </div>
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Streak: <strong className="font-mono">{streak}🔥</strong></span>
          </div>
        </div>
      </div>

      {/* Main Exercise Card */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-6 sm:p-8 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-semibold uppercase tracking-wider mb-3">
          Exercise {currentExercise.levelNumber}
        </div>

        <h3 className="text-xl font-bold text-white mb-2">
          {currentExercise.prompt}
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Press "Listen Sound" to audition the musical mystery, then choose your answer.
        </p>

        {/* Play Sound Button */}
        <div className="flex justify-center mb-8">
          <button
            type="button"
            onClick={handlePlayPrompt}
            disabled={isPlayingAudio}
            className={`px-6 py-4 rounded-2xl text-base font-bold flex items-center space-x-3 transition-all transform shadow-xl ${
              isPlayingAudio
                ? 'bg-amber-500 text-slate-950 scale-105 animate-pulse'
                : 'bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 hover:scale-105 active:scale-95'
            }`}
          >
            <Volume2 className="w-6 h-6" />
            <span>{isPlayingAudio ? 'Listening...' : 'Audition Mystery Sound (Listen)'}</span>
          </button>
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {currentExercise.options.map((option) => {
            const isSelected = selectedOption === option;
            const isCorrect = option === currentExercise.correctAnswer;

            let buttonStyle = 'bg-slate-800/90 text-slate-200 border-slate-700 hover:bg-slate-750 hover:border-slate-600';
            if (isAnswered) {
              if (isCorrect) {
                buttonStyle = 'bg-emerald-600/30 border-emerald-500 text-emerald-200 font-bold ring-2 ring-emerald-500';
              } else if (isSelected && !isCorrect) {
                buttonStyle = 'bg-rose-600/30 border-rose-500 text-rose-300 line-through';
              }
            }

            return (
              <button
                key={option}
                type="button"
                onClick={() => handleSelectOption(option)}
                disabled={isAnswered}
                className={`py-3.5 px-4 rounded-xl border text-sm font-semibold transition-all flex items-center justify-between ${buttonStyle}`}
              >
                <span>{option}</span>
                {isAnswered && isCorrect && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-400" />}
              </button>
            );
          })}
        </div>

        {/* Feedback & Explanation */}
        {isAnswered && (
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-left mb-6 animate-fadeIn">
            <div className="flex items-center space-x-2 mb-1">
              {selectedOption === currentExercise.correctAnswer ? (
                <>
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="font-bold text-emerald-400 text-sm">Brilliant! Exactly Right (+25 XP)</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-amber-400 shrink-0" />
                  <span className="font-bold text-amber-400 text-sm">Good try! Here is the musical clue:</span>
                </>
              )}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pl-7">
              {currentExercise.explanation}
            </p>
          </div>
        )}

        {/* Next Button */}
        {isAnswered && (
          <button
            type="button"
            onClick={handleNextExercise}
            className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition shadow-lg flex items-center justify-center space-x-2"
          >
            <span>Continue to Next Level</span>
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
