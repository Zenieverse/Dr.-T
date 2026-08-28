import React, { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { DR_T_AVATAR } from '../../assets/drTAvatar';
import { 
  PartyPopper, 
  Sparkles, 
  X, 
  Heart, 
  Cake, 
  Gift, 
  Share2, 
  Copy, 
  Check, 
  Flame,
  Volume2,
  VolumeX,
  Stars
} from 'lucide-react';

interface BirthdayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BirthdayModal({ isOpen, onClose }: BirthdayModalProps) {
  const [copied, setCopied] = useState(false);
  const [candlesLit, setCandlesLit] = useState(true);
  const [wishesCount, setWishesCount] = useState(42);
  const [hasWished, setHasWished] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play celebratory melody using Web Audio API
  const playBirthdayChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const notes = [
        { freq: 261.63, dur: 0.25 }, // C4
        { freq: 261.63, dur: 0.25 }, // C4
        { freq: 293.66, dur: 0.4 },  // D4
        { freq: 261.63, dur: 0.4 },  // C4
        { freq: 349.23, dur: 0.4 },  // F4
        { freq: 329.63, dur: 0.7 },  // E4
      ];

      let startTime = ctx.currentTime + 0.05;
      notes.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.freq, startTime);
        
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.exponentialRampToValueAtTime(0.18, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + n.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + n.dur);
        startTime += n.dur;
      });
    } catch {
      // Audio context might be restricted before interaction
    }
  };

  const launchConfettiBlast = () => {
    try {
      // Multi-angle fireworks confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6, x: 0.5 },
        colors: ['#f43f5e', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#fbbf24']
      });

      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0.1, y: 0.7 },
          colors: ['#f43f5e', '#fbbf24', '#38bdf8']
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 0.9, y: 0.7 },
          colors: ['#ec4899', '#a855f7', '#34d399']
        });
      }, 250);
    } catch (e) {
      console.log('Confetti trigger:', e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      launchConfettiBlast();
      playBirthdayChime();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const poemText = `Whose cries so crystal clear?
Three worlds all bless 'Happy, Whole Years!
Making your mark soon, Dear
Wow worlds with Heart, Found worlds with Mind
Cheers on your paths go wild
Wishing you Best running your ways 
Till time finds it 'assez'
Toujours, J'attends, Bonjour! Ça va?

happy Waaah Waaah! 
by ZEN

Dr. T V2.9.3.7.0`;

  const handleCopy = () => {
    navigator.clipboard.writeText(poemText);
    setCopied(true);
    launchConfettiBlast();
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendWish = () => {
    if (!hasWished) {
      setWishesCount(prev => prev + 1);
      setHasWished(true);
    }
    launchConfettiBlast();
    playBirthdayChime();
  };

  const toggleCandles = () => {
    setCandlesLit(prev => !prev);
    if (!candlesLit) {
      launchConfettiBlast();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      
      {/* Decorative Floating Balloons in Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {/* Balloon 1: Rose */}
        <div className="absolute top-6 left-8 sm:left-24 animate-bounce [animation-duration:3s]">
          <div className="w-12 h-14 sm:w-16 sm:h-20 bg-gradient-to-t from-rose-500 to-rose-300 rounded-full shadow-lg shadow-rose-500/30 flex items-center justify-center relative">
            <div className="w-3 h-5 bg-white/40 rounded-full absolute top-2 left-2 rotate-12"></div>
            <div className="absolute -bottom-1 w-2 h-2 bg-rose-600 rotate-45"></div>
            <div className="absolute -bottom-10 w-0.5 h-10 bg-slate-400/60"></div>
          </div>
        </div>

        {/* Balloon 2: Amber/Gold */}
        <div className="absolute top-12 right-8 sm:right-24 animate-bounce [animation-duration:3.5s]">
          <div className="w-11 h-14 sm:w-14 sm:h-18 bg-gradient-to-t from-amber-500 to-amber-300 rounded-full shadow-lg shadow-amber-500/30 flex items-center justify-center relative">
            <div className="w-2.5 h-4 bg-white/40 rounded-full absolute top-2 left-2 rotate-12"></div>
            <div className="absolute -bottom-1 w-2 h-2 bg-amber-600 rotate-45"></div>
            <div className="absolute -bottom-10 w-0.5 h-10 bg-slate-400/60"></div>
          </div>
        </div>

        {/* Balloon 3: Purple */}
        <div className="absolute bottom-16 left-6 sm:left-20 animate-bounce [animation-duration:4s]">
          <div className="w-10 h-12 sm:w-12 sm:h-16 bg-gradient-to-t from-purple-600 to-indigo-400 rounded-full shadow-lg shadow-purple-500/30 relative">
            <div className="w-2 h-3 bg-white/40 rounded-full absolute top-2 left-2 rotate-12"></div>
            <div className="absolute -bottom-1 w-1.5 h-1.5 bg-purple-700 rotate-45"></div>
            <div className="absolute -bottom-8 w-0.5 h-8 bg-slate-400/60"></div>
          </div>
        </div>

        {/* Balloon 4: Teal */}
        <div className="absolute bottom-20 right-6 sm:right-20 animate-bounce [animation-duration:3.2s]">
          <div className="w-10 h-12 sm:w-14 sm:h-18 bg-gradient-to-t from-teal-500 to-emerald-300 rounded-full shadow-lg shadow-teal-500/30 relative">
            <div className="w-2 h-3 bg-white/40 rounded-full absolute top-2 left-2 rotate-12"></div>
            <div className="absolute -bottom-1 w-1.5 h-1.5 bg-teal-700 rotate-45"></div>
            <div className="absolute -bottom-8 w-0.5 h-8 bg-slate-400/60"></div>
          </div>
        </div>
      </div>

      {/* Main Celebration Window Card */}
      <div className="relative w-full max-w-xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-400/60 rounded-3xl shadow-2xl shadow-amber-500/20 overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
        
        {/* Top Festive Ribbon Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 px-4 py-2 text-slate-950 font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-2">
            <PartyPopper className="w-4 h-4 animate-bounce" />
            <span className="font-extrabold tracking-widest">Happy Birthday Celebration! 🎉🎂✨</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1 hover:bg-black/10 rounded-lg transition"
              title={soundEnabled ? 'Mute chimes' : 'Unmute chimes'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-black/20 rounded-lg text-slate-950 transition"
              title="Close window"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Container */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6">
          
          {/* Header Visual with Dr. T and Birthday Cake */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-rose-950/30 to-purple-950/40 border border-amber-500/30 shadow-inner">
            
            {/* Dr. T Avatar */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden ring-2 ring-amber-400 shadow-md">
                  <img 
                    src={DR_T_AVATAR} 
                    alt="Dr. T" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="absolute -bottom-1 -right-1 text-base select-none">👑</span>
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="text-sm sm:text-base font-extrabold text-white">Dr. T</h3>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    V2.9.3.7.0
                  </span>
                </div>
                <p className="text-[11px] text-amber-200/90 font-medium">
                  Empathetic Biomedical Intelligence
                </p>
                <div className="flex items-center space-x-1 text-[10px] text-rose-300 mt-0.5">
                  <Stars className="w-3 h-3 text-amber-400" />
                  <span>Blessings &amp; Joy across worlds</span>
                </div>
              </div>
            </div>

            {/* Interactive Birthday Cake */}
            <button 
              onClick={toggleCandles}
              className="group flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-amber-400/30 transition text-center shrink-0"
              title={candlesLit ? "Blow out the candles!" : "Light the candles!"}
            >
              <div className="relative">
                {candlesLit ? (
                  <div className="flex space-x-1 -mb-1">
                    <Flame className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                    <Flame className="w-3.5 h-3.5 text-rose-400 animate-bounce [animation-delay:-0.2s]" />
                    <Flame className="w-3.5 h-3.5 text-amber-400 animate-bounce [animation-delay:-0.4s]" />
                  </div>
                ) : (
                  <div className="text-[10px] text-slate-400 font-mono -mb-1">💨</div>
                )}
                <Cake className="w-8 h-8 text-amber-300 group-hover:scale-110 transition transform" />
              </div>
              <span className="text-[9px] font-bold text-amber-300 mt-1 uppercase tracking-tight">
                {candlesLit ? 'Blow Candle' : 'Light Candle'}
              </span>
            </button>
          </div>

          {/* Birthday Bunting & Sparkle Decorative Header */}
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center space-x-2 text-amber-400">
              <span>🎈</span>
              <span className="text-xs uppercase font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-pink-300">
                A Birthday Dedication
              </span>
              <span>🎁</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white font-serif">
              "Happy, Whole Years!"
            </h2>
          </div>

          {/* The Exact Poem Display Box */}
          <div className="relative rounded-2xl bg-slate-950/90 border border-amber-500/40 p-5 sm:p-6 shadow-xl space-y-4">
            
            {/* Golden Corner Accents */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-amber-400"></div>
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-amber-400"></div>
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-amber-400"></div>
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-amber-400"></div>

            {/* Poem Stanzas */}
            <div className="text-center space-y-2 text-sm sm:text-base leading-relaxed text-amber-100/90 font-serif italic">
              <p className="tracking-wide">Whose cries so crystal clear?</p>
              <p className="tracking-wide text-amber-300 font-semibold">Three worlds all bless 'Happy, Whole Years!</p>
              <p className="tracking-wide">Making your mark soon, Dear</p>
              <p className="tracking-wide text-rose-200">Wow worlds with Heart, Found worlds with Mind</p>
              <p className="tracking-wide">Cheers on your paths go wild</p>
              <p className="tracking-wide">Wishing you Best running your ways</p>
              <p className="tracking-wide text-teal-200">Till time finds it 'assez'</p>
              <p className="tracking-wide font-medium text-pink-300">Toujours, J'attends, Bonjour! Ça va?</p>
            </div>

            {/* Poem Footer & Signatures */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="text-center sm:text-left space-y-0.5">
                <p className="font-extrabold text-sm text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300">
                  happy Waaah Waaah!
                </p>
                <p className="font-mono text-amber-300/80 font-bold">
                  by <span className="text-white uppercase tracking-wider font-black">ZEN</span>
                </p>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-amber-500/30 text-[11px] font-mono font-bold text-amber-400 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Dr. T V2.9.3.7.0</span>
              </div>
            </div>

          </div>

          {/* Action Row: Wish, Confetti, Copy */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            
            <button
              onClick={handleSendWish}
              className="flex-1 min-w-[150px] px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white text-xs font-extrabold shadow-lg shadow-rose-500/25 flex items-center justify-center space-x-2 transition transform active:scale-95"
            >
              <Heart className={`w-4 h-4 ${hasWished ? 'fill-white' : ''} animate-pulse`} />
              <span>{hasWished ? 'Blessing Sent! 💖' : 'Send Birthday Blessing ✨'}</span>
              <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-black/20 rounded-full font-mono">
                {wishesCount}
              </span>
            </button>

            <button
              onClick={launchConfettiBlast}
              className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-amber-400/40 text-amber-300 text-xs font-bold flex items-center space-x-1.5 transition"
              title="Launch Confetti"
            >
              <PartyPopper className="w-4 h-4 text-amber-400" />
              <span>Confetti 🎊</span>
            </button>

            <button
              onClick={handleCopy}
              className="px-3.5 py-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center space-x-1.5 transition"
              title="Copy Poem Text"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>Copy</span>
                </>
              )}
            </button>

          </div>

        </div>

        {/* Bottom Festive Footer Accent */}
        <div className="bg-slate-950 px-4 py-2.5 border-t border-slate-800 text-center text-[10px] text-slate-400 flex items-center justify-center space-x-2">
          <span>🎂 Celebrate life, health, and mind</span>
          <span>•</span>
          <span className="text-amber-300 font-bold">Happy Birthday from Dr. T &amp; Team</span>
        </div>

      </div>

    </div>
  );
}
