// =========================================================================
// ONE MINUTE OF SILENCE: MINDFUL BREATHING MODAL
// Honoring the quiet sacred stillness of forests and reading rooms
// =========================================================================

import React, { useState, useEffect } from 'react';
import { X, Trees, Wind, Sparkles, RefreshCw } from 'lucide-react';

interface ZenMinuteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ZenMinuteModal: React.FC<ZenMinuteModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(60);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');

  useEffect(() => {
    if (!isOpen) {
      setSecondsLeft(60);
      setIsActive(true);
      return;
    }

    let interval: NodeJS.Timeout | null = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, isActive, secondsLeft]);

  // 16-second box breathing cycle (4s Inhale, 4s Hold, 4s Exhale, 4s Rest)
  useEffect(() => {
    if (!isOpen) return;
    const cyclePos = (60 - secondsLeft) % 16;
    if (cyclePos < 4) {
      setBreathPhase('Inhale');
    } else if (cyclePos < 8) {
      setBreathPhase('Hold');
    } else if (cyclePos < 12) {
      setBreathPhase('Exhale');
    } else {
      setBreathPhase('Rest');
    }
  }, [secondsLeft, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        id="zen-minute-modal"
        className="relative w-full max-w-md bg-stone-900 text-white rounded-3xl shadow-2xl border border-emerald-500/30 p-8 text-center space-y-6 my-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <div className="flex items-center justify-center space-x-1.5 text-xs text-emerald-400 font-bold uppercase tracking-wider">
            <Trees className="w-4 h-4" />
            <span>One Minute of Silence</span>
          </div>
          <h3 className="text-xl font-black font-display text-white">
            Quiet Mind, Deep Roots
          </h3>
          <p className="text-xs text-stone-400">
            Pause from the noise of the world. Breathe with the canopy of the earth.
          </p>
        </div>

        {/* Breathing Animation Circle */}
        <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
          {/* Animated pulsing outer ring */}
          <div 
            className={`absolute inset-0 rounded-full border-2 border-emerald-400/40 transition-all duration-1000 ${
              breathPhase === 'Inhale' ? 'scale-110 bg-emerald-500/10' :
              breathPhase === 'Hold' ? 'scale-110 bg-teal-500/15' :
              breathPhase === 'Exhale' ? 'scale-90 bg-emerald-950/40' : 'scale-95 bg-stone-950'
            }`} 
          />

          <div className="relative z-10 space-y-1">
            <div className="text-3xl font-black font-mono text-emerald-300">
              {secondsLeft}s
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              {breathPhase}
            </div>
          </div>
        </div>

        {/* Wisdom quote */}
        <p className="text-xs italic text-stone-300 max-w-xs mx-auto leading-relaxed">
          "In the quiet of a library, in the silence of a forest, the soul remembers how to grow."
        </p>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              setSecondsLeft(60);
              setIsActive(true);
            }}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
            title="Restart Timer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors"
          >
            Return to Forest
          </button>
        </div>
      </div>
    </div>
  );
};
