import React, { useState } from 'react';
import { PianistProfile, PianistLevel, PracticeDuration, LearningStyle, InstrumentType } from '../../../types/pianistTypes';
import { Sparkles, Check, ArrowRight, Music, Piano, X } from 'lucide-react';

interface OnboardingProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (profile: Partial<PianistProfile>) => void;
}

export const PianistOnboardingModal: React.FC<OnboardingProps> = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState<number>(1);
  const [level, setLevel] = useState<PianistLevel>('Beginner');
  const [goals, setGoals] = useState<string[]>(['Play songs', 'Play by ear']);
  const [duration, setDuration] = useState<PracticeDuration>(20);
  const [learningStyles, setLearningStyles] = useState<LearningStyle[]>(['Play', 'Listen', 'Theory']);
  const [instrument, setInstrument] = useState<InstrumentType>('Yamaha digital piano');

  if (!isOpen) return null;

  const toggleGoal = (g: string) => {
    setGoals(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
  };

  const toggleStyle = (s: LearningStyle) => {
    setLearningStyles(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const handleFinish = () => {
    onComplete({
      level,
      goals,
      dailyPracticeMinutes: duration,
      preferredLearningStyles: learningStyles,
      instrument,
      onboardingCompleted: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative text-slate-100">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Progress Bar */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-6">
          <span className="font-bold text-teal-400 uppercase tracking-wider">
            PIANIST • Question {step} of 5
          </span>
          <div className="flex space-x-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`w-6 h-1.5 rounded-full transition-all ${
                  s === step ? 'bg-teal-400' : s < step ? 'bg-emerald-500' : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Q1: Piano Level */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">What is your current piano level?</h3>
            <p className="text-xs text-slate-400">Let's discover where your musical journey begins.</p>
            <div className="space-y-2">
              {([
                'Complete Beginner',
                'Beginner',
                'Early Intermediate',
                'Intermediate',
                'Advanced',
                'Returning Learner'
              ] as PianistLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setLevel(lvl)}
                  className={`w-full p-3.5 rounded-xl border text-left text-xs font-semibold transition flex items-center justify-between ${
                    level === lvl
                      ? 'bg-teal-500/20 border-teal-400 text-teal-200'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{lvl}</span>
                  {level === lvl && <Check className="w-4 h-4 text-teal-400" />}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full mt-4 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition flex items-center justify-center space-x-2 shadow-lg"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Q2: Goals */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">What are your main musical goals?</h3>
            <p className="text-xs text-slate-400">Select all that inspire you.</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                'Play songs',
                'Read sheet music',
                'Play by ear',
                'Improve technique',
                'Understand music theory',
                'Improvise',
                'Compose original music',
                'Become confident pianist'
              ].map((g) => {
                const isSelected = goals.includes(g);
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => toggleGoal(g)}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-teal-500/20 border-teal-400 text-teal-200'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{g}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-teal-400" />}
                  </button>
                );
              })}
            </div>
            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs transition"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="w-2/3 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition shadow-lg"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Q3: Practice Duration */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">How much time can you practice daily?</h3>
            <p className="text-xs text-slate-400">Our adaptive practice engine will tailor sessions to your schedule.</p>
            <div className="grid grid-cols-3 gap-2">
              {([5, 10, 20, 30, 45, 60] as PracticeDuration[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setDuration(m)}
                  className={`p-4 rounded-xl border text-center transition ${
                    duration === m
                      ? 'bg-teal-500/20 border-teal-400 text-teal-200 ring-1 ring-teal-400'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="block text-lg font-black font-mono">{m}</span>
                  <span className="block text-[11px] text-slate-400">Minutes</span>
                </button>
              ))}
            </div>
            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-1/3 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs transition"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="w-2/3 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition shadow-lg"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Q4: Preferred Learning Style */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">How do you prefer to learn?</h3>
            <p className="text-xs text-slate-400">Choose your favorite pathways.</p>
            <div className="grid grid-cols-2 gap-2">
              {(['Watch', 'Listen', 'Read', 'Play', 'Games', 'Theory'] as LearningStyle[]).map((style) => {
                const isSelected = learningStyles.includes(style);
                return (
                  <button
                    key={style}
                    type="button"
                    onClick={() => toggleStyle(style)}
                    className={`p-3.5 rounded-xl border text-left text-xs font-semibold transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-teal-500/20 border-teal-400 text-teal-200'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{style}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-teal-400" />}
                  </button>
                );
              })}
            </div>
            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="w-1/3 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs transition"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(5)}
                className="w-2/3 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition shadow-lg"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Q5: Instrument Type */}
        {step === 5 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">What instrument are you using?</h3>
            <p className="text-xs text-slate-400">PIANIST seamlessly integrates with MIDI, digital, acoustic or touchscreen.</p>
            <div className="space-y-2">
              {([
                'Yamaha digital piano',
                'Acoustic piano',
                'Other digital piano',
                'Keyboard',
                'MIDI keyboard',
                'No piano yet (Screen only)'
              ] as InstrumentType[]).map((inst) => (
                <button
                  key={inst}
                  type="button"
                  onClick={() => setInstrument(inst)}
                  className={`w-full p-3 rounded-xl border text-left text-xs font-semibold transition flex items-center justify-between ${
                    instrument === inst
                      ? 'bg-teal-500/20 border-teal-400 text-teal-200'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{inst}</span>
                  {instrument === inst && <Check className="w-4 h-4 text-teal-400" />}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={handleFinish}
              className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-extrabold text-sm transition shadow-xl"
            >
              Generate My Pianist Starting Profile 🎹
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
