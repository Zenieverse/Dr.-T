import React, { useState } from 'react';
import { pianoAudio } from '../audio/pianoAudio';
import { Trophy, Volume2, Sparkles, CheckCircle2, RotateCcw, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';
import confetti from 'canvas-confetti';

interface IndependentPianistProps {
  onChallengePassed?: () => void;
  onNoteTest?: (note: string) => void;
}

// The mystery melody: A calm, lyrical motif in C Major: E4 - G4 - A4 - G4 - E4 - D4 - C4
const MYSTERY_MELODY = ['E4', 'G4', 'A4', 'G4', 'E4', 'D4', 'C4'];

export const IndependentPianistChallenge: React.FC<IndependentPianistProps> = ({
  onChallengePassed,
  onNoteTest,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isPlayingMotif, setIsPlayingMotif] = useState<boolean>(false);
  const [userPlayedNotes, setUserPlayedNotes] = useState<string[]>([]);
  const [selectedHarmonies, setSelectedHarmonies] = useState<string[]>([]);
  const [isPassed, setIsPassed] = useState<boolean>(false);

  // Play mystery motif without hints
  const handleAuditionMotif = () => {
    setIsPlayingMotif(true);
    MYSTERY_MELODY.forEach((note, idx) => {
      setTimeout(() => {
        pianoAudio.playNote(note, 0.85, 0.6);
        if (idx === MYSTERY_MELODY.length - 1) {
          setIsPlayingMotif(false);
        }
      }, idx * 550);
    });
  };

  const handleInputNote = (note: string) => {
    pianoAudio.playNote(note, 0.85);
    const updated = [...userPlayedNotes, note];
    setUserPlayedNotes(updated);
    if (onNoteTest) onNoteTest(note);

    // Check step 2 (find starting note E4)
    if (currentStep === 2 && note === 'E4') {
      setCurrentStep(3);
      setUserPlayedNotes([]);
    }

    // Check step 3 (reproduce entire melody)
    if (currentStep === 3) {
      if (updated.length === MYSTERY_MELODY.length) {
        const matches = updated.every((n, i) => n === MYSTERY_MELODY[i]);
        if (matches) {
          setCurrentStep(4);
        } else {
          // Reset take
          setTimeout(() => setUserPlayedNotes([]), 1000);
        }
      }
    }
  };

  const handleCompleteFinalChallenge = () => {
    setIsPassed(true);
    confetti({ particleCount: 100, spread: 90, origin: { y: 0.5 } });
    if (onChallengePassed) onChallengePassed();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-8 shadow-xl max-w-3xl mx-auto">
      {/* Crown Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-3 shadow-md">
          <Trophy className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-white">
          The Ultimate Test: Independent Pianist
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
          No sheet music. No highlighted keys. Pure auditory perception, harmonic deduction, and musical independence.
        </p>
      </div>

      {!isPassed ? (
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 sm:p-8">
          {/* Step Progress Bar */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-6 pb-4 border-b border-slate-800">
            <span className="text-teal-400 font-bold">Step {currentStep} of 4</span>
            <span>
              {currentStep === 1 && 'Listen to the Unfamiliar Melody'}
              {currentStep === 2 && 'Find the Starting Pitch'}
              {currentStep === 3 && 'Reproduce the Full 7-Note Melody'}
              {currentStep === 4 && 'Identify Underlying Harmony & Transpose'}
            </span>
          </div>

          {/* STEP 1: Listen */}
          {currentStep === 1 && (
            <div className="text-center space-y-6">
              <p className="text-sm text-slate-200">
                You will hear an unfamiliar 7-note musical motif. Close your eyes, hum along, and internalize the sound contours.
              </p>
              <button
                type="button"
                onClick={handleAuditionMotif}
                disabled={isPlayingMotif}
                className="px-6 py-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition shadow-lg inline-flex items-center space-x-2"
              >
                <Volume2 className="w-5 h-5" />
                <span>{isPlayingMotif ? 'Listening to Melody...' : 'Listen to Unfamiliar Motif'}</span>
              </button>
              <div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-teal-300 hover:bg-slate-700 font-bold text-xs transition inline-flex items-center space-x-2 border border-slate-700"
                >
                  <span>I've Internalized It → Find Starting Pitch</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Find Starting Note */}
          {currentStep === 2 && (
            <div className="text-center space-y-4">
              <p className="text-sm text-slate-200">
                Play notes on the piano below to find the starting pitch. (Hint: Test keys near Middle C!).
              </p>
              <div className="flex justify-center gap-2">
                <button
                  type="button"
                  onClick={handleAuditionMotif}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition"
                >
                  Re-listen to Mystery Motif
                </button>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
                Target: Starting note is <strong>E4 (Mi)</strong>. When you play E4 on the keyboard below, Step 3 will automatically unlock!
              </div>
            </div>
          )}

          {/* STEP 3: Reproduce Melody */}
          {currentStep === 3 && (
            <div className="text-center space-y-4">
              <p className="text-sm text-slate-200">
                Play the 7 notes in order on the piano:
              </p>
              <div className="flex justify-center gap-2 font-mono text-xs">
                {MYSTERY_MELODY.map((n, i) => (
                  <span
                    key={i}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold border ${
                      userPlayedNotes[i]
                        ? userPlayedNotes[i] === n
                          ? 'bg-emerald-500/30 text-emerald-300 border-emerald-500'
                          : 'bg-rose-500/30 text-rose-300 border-rose-500'
                        : 'bg-slate-800 text-slate-500 border-slate-700'
                    }`}
                  >
                    {userPlayedNotes[i] || '?'}
                  </span>
                ))}
              </div>
              <p className="text-xs text-slate-400">
                Play: <span className="font-mono text-teal-300 font-bold">E4 → G4 → A4 → G4 → E4 → D4 → C4</span>
              </p>
              <button
                type="button"
                onClick={() => setUserPlayedNotes([])}
                className="text-xs text-slate-500 hover:text-slate-300 flex items-center justify-center gap-1 mx-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset current take</span>
              </button>
            </div>
          )}

          {/* STEP 4: Harmony & Transposition */}
          {currentStep === 4 && (
            <div className="text-center space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Melody Reproduced by Ear!
              </div>
              <p className="text-sm text-slate-200">
                Final Step: What are the two primary harmonic chords supporting this melody?
              </p>
              <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                <button
                  type="button"
                  onClick={handleCompleteFinalChallenge}
                  className="p-3.5 rounded-xl border border-teal-500/50 bg-teal-950/40 hover:bg-teal-900/60 text-white font-bold text-xs transition"
                >
                  C Major (I) & G Major (V)
                </button>
                <button
                  type="button"
                  onClick={handleCompleteFinalChallenge}
                  className="p-3.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs transition"
                >
                  F# Minor & B Major
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* VICTORY EMOTIONAL PRODUCT MOMENT */
        <div className="bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-950 border-2 border-amber-400 rounded-3xl p-8 text-center animate-fadeIn shadow-2xl">
          <div className="text-5xl mb-4">👑</div>
          <h3 className="text-3xl font-black text-white mb-2">
            🎉 YOU ARE AN INDEPENDENT PIANIST
          </h3>
          <p className="text-lg text-amber-300 font-medium italic mb-6">
            "You didn't memorize this song. You understood it."
          </p>

          <div className="max-w-md mx-auto p-5 rounded-2xl bg-slate-950/90 border border-amber-500/30 text-xs text-slate-300 space-y-2 mb-6 text-left">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" /> Identified melody through pitch perception
            </div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" /> Found starting pitch without visual assistance
            </div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" /> Deduced underlying harmonic foundation
            </div>
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Trophy className="w-4 h-4" /> Permanent Musician Credential Earned
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsPassed(false);
              setCurrentStep(1);
            }}
            className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition shadow-lg"
          >
            Review Milestone Archive
          </button>
        </div>
      )}
    </div>
  );
};
