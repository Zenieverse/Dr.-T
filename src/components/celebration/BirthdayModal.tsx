import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { DR_T_AVATAR } from '../../assets/drTAvatar';
import drTActualPhoto from '../../assets/images/dr_t_actual_photo_1790408669388.jpg';
import { GallopingHorseSvg } from './GallopingHorseSvg';
import { 
  PartyPopper, 
  Sparkles, 
  X, 
  Heart, 
  Cake, 
  Copy, 
  Check, 
  Flame, 
  Volume2, 
  VolumeX, 
  Stars, 
  Stethoscope
} from 'lucide-react';

interface BirthdayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BirthdayModal({ isOpen, onClose }: BirthdayModalProps) {
  // Layer state: 'blessed_dears' is in the foreground overlapping 'coat_of_white' which overlaps 'birthday'
  const [activeLayer, setActiveLayer] = useState<'blessed_dears' | 'coat_of_white' | 'birthday'>('blessed_dears');
  const [isBlessedDearsVisible, setIsBlessedDearsVisible] = useState<boolean>(true);
  const [isCoatOfWhiteVisible, setIsCoatOfWhiteVisible] = useState<boolean>(true);
  
  const [copiedBirthday, setCopiedBirthday] = useState<boolean>(false);
  const [copiedCoatOfWhite, setCopiedCoatOfWhite] = useState<boolean>(false);
  const [copiedBlessedDears, setCopiedBlessedDears] = useState<boolean>(false);
  
  const [candlesLit, setCandlesLit] = useState<boolean>(true);
  const [wishesCount, setWishesCount] = useState<number>(42);
  const [hasWished, setHasWished] = useState<boolean>(false);
  
  const [saluteCount, setSaluteCount] = useState<number>(88);
  const [hasSaluted, setHasSaluted] = useState<boolean>(false);

  const [cheersCount, setCheersCount] = useState<number>(2026);
  const [hasCheered, setHasCheered] = useState<boolean>(false);
  
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

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

  const launchConfettiBlast = (theme: 'birthday' | 'teal' | 'gold_red' = 'gold_red') => {
    try {
      if (theme === 'gold_red') {
        confetti({
          particleCount: 85,
          spread: 75,
          origin: { y: 0.6, x: 0.5 },
          colors: ['#c22227', '#e11d48', '#d97706', '#f59e0b', '#fbbf24', '#fef3c7', '#991b1b']
        });
      } else if (theme === 'teal') {
        confetti({
          particleCount: 80,
          spread: 75,
          origin: { y: 0.6, x: 0.5 },
          colors: ['#0d9488', '#14b8a6', '#06b6d4', '#38bdf8', '#3b82f6', '#f59e0b', '#ffffff']
        });
      } else {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6, x: 0.5 },
          colors: ['#f43f5e', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#fbbf24']
        });
      }

      setTimeout(() => {
        confetti({
          particleCount: 45,
          angle: 60,
          spread: 55,
          origin: { x: 0.1, y: 0.7 },
          colors: ['#c22227', '#d97706', '#fbbf24', '#f43f5e']
        });
        confetti({
          particleCount: 45,
          angle: 120,
          spread: 55,
          origin: { x: 0.9, y: 0.7 },
          colors: ['#f59e0b', '#b91c1c', '#fef3c7', '#06b6d4']
        });
      }, 250);
    } catch (e) {
      console.log('Confetti trigger:', e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setActiveLayer('blessed_dears');
      setIsBlessedDearsVisible(true);
      setIsCoatOfWhiteVisible(true);
      launchConfettiBlast('gold_red');
      playBirthdayChime();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const blessedDearsPoemText = `To Blessed Dears!
by Zen

2026

Two, Oh, Two, Six: What a Year!
Pumps up all veins with best Cheers,
Gallop here, there for Meets up
Bounce back to prime, ‘To blessed Dears!’`;

  const inCoatOfWhiteText = `Always comes first in line
Melting cold hearts, Feeling dold minds
Fighting to last, last vibes
Soul sewn, bold up, fear gone, game on!

In Coat of White
By ZEN

Salut, Cher Dr., Ça va?
Je prie: 'Toujours, Tu vas bien!'`;

  const birthdayPoemText = `Whose cries so crystal clear?
Three worlds all bless 'Happy, Whole Years!
Making your mark soon, Dear
Wow worlds with Heart, Found worlds with Mind
Cheers on your paths go wild
Wishing you Best running your ways 
Till time finds it 'assez'
Toujours, J'attends, Bonjour! Ça va?
Toujours, Je prie, Tu vas bien!`;

  const handleCopyBlessedDears = () => {
    try {
      navigator.clipboard.writeText(blessedDearsPoemText);
      setCopiedBlessedDears(true);
      setTimeout(() => setCopiedBlessedDears(false), 2000);
    } catch (err) {
      console.error('Failed to copy poem:', err);
    }
  };

  const handleCopyCoatOfWhite = () => {
    try {
      navigator.clipboard.writeText(inCoatOfWhiteText);
      setCopiedCoatOfWhite(true);
      setTimeout(() => setCopiedCoatOfWhite(false), 2000);
    } catch (err) {
      console.error('Failed to copy poem:', err);
    }
  };

  const handleCopyBirthday = () => {
    try {
      navigator.clipboard.writeText(birthdayPoemText);
      setCopiedBirthday(true);
      setTimeout(() => setCopiedBirthday(false), 2000);
    } catch (err) {
      console.error('Failed to copy poem:', err);
    }
  };

  const handleSendWish = () => {
    if (!hasWished) {
      setWishesCount(prev => prev + 1);
      setHasWished(true);
    }
    launchConfettiBlast('birthday');
    playBirthdayChime();
  };

  const handleSendSalute = () => {
    if (!hasSaluted) {
      setSaluteCount(prev => prev + 1);
      setHasSaluted(true);
    }
    launchConfettiBlast('teal');
    playBirthdayChime();
  };

  const handleBlessedCheers = () => {
    if (!hasCheered) {
      setCheersCount(prev => prev + 1);
      setHasCheered(true);
    }
    launchConfettiBlast('gold_red');
    playBirthdayChime();
  };

  const toggleCandles = () => {
    setCandlesLit(!candlesLit);
    if (!candlesLit) {
      launchConfettiBlast('birthday');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-300">
      
      {/* Dynamic Animated Ambient Background Balloons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {/* Balloon 1: Rose */}
        <div className="absolute top-6 left-8 sm:left-24 animate-bounce [animation-duration:3s]">
          <div className="w-12 h-14 sm:w-16 sm:h-20 bg-gradient-to-t from-rose-500 to-rose-300 rounded-full shadow-lg shadow-rose-500/30 flex items-center justify-center relative">
            <div className="w-3 h-5 bg-white/60 rounded-full absolute top-2 left-2 rotate-12"></div>
            <div className="absolute -bottom-1 w-2 h-2 bg-rose-600 rotate-45"></div>
            <div className="absolute -bottom-10 w-0.5 h-10 bg-amber-800/40"></div>
          </div>
        </div>

        {/* Balloon 2: Amber/Gold */}
        <div className="absolute top-12 right-8 sm:right-24 animate-bounce [animation-duration:3.5s]">
          <div className="w-11 h-14 sm:w-14 sm:h-18 bg-gradient-to-t from-amber-500 to-amber-300 rounded-full shadow-lg shadow-amber-500/30 flex items-center justify-center relative">
            <div className="w-2.5 h-4 bg-white/60 rounded-full absolute top-2 left-2 rotate-12"></div>
            <div className="absolute -bottom-1 w-2 h-2 bg-amber-600 rotate-45"></div>
            <div className="absolute -bottom-10 w-0.5 h-10 bg-amber-800/40"></div>
          </div>
        </div>

        {/* Balloon 3: Teal */}
        <div className="absolute bottom-16 left-6 sm:left-20 animate-bounce [animation-duration:4s]">
          <div className="w-10 h-12 sm:w-12 sm:h-16 bg-gradient-to-t from-teal-500 to-cyan-400 rounded-full shadow-lg shadow-teal-500/30 relative">
            <div className="w-2 h-3 bg-white/60 rounded-full absolute top-2 left-2 rotate-12"></div>
            <div className="absolute -bottom-1 w-1.5 h-1.5 bg-teal-700 rotate-45"></div>
            <div className="absolute -bottom-8 w-0.5 h-8 bg-amber-800/40"></div>
          </div>
        </div>

        {/* Balloon 4: Purple */}
        <div className="absolute bottom-20 right-6 sm:right-20 animate-bounce [animation-duration:3.2s]">
          <div className="w-10 h-12 sm:w-14 sm:h-18 bg-gradient-to-t from-purple-500 to-pink-400 rounded-full shadow-lg shadow-purple-500/30 relative">
            <div className="w-2 h-3 bg-white/60 rounded-full absolute top-2 left-2 rotate-12"></div>
            <div className="absolute -bottom-1 w-1.5 h-1.5 bg-purple-700 rotate-45"></div>
            <div className="absolute -bottom-8 w-0.5 h-8 bg-amber-800/40"></div>
          </div>
        </div>
      </div>

      {/* Outer Overlapping Wrapper Container */}
      <div className="relative w-full max-w-2xl flex flex-col items-center justify-center min-h-[580px]">

        {/* Layer Switcher Tabs at Very Top */}
        <div className="z-40 mb-3 flex flex-wrap items-center justify-center bg-slate-900/95 border border-slate-700/80 p-1.5 rounded-2xl shadow-xl backdrop-blur-md gap-1.5 text-xs font-semibold">
          
          {/* Tab 1: To Blessed Dears! (Foreground) */}
          <button
            onClick={() => {
              setActiveLayer('blessed_dears');
              setIsBlessedDearsVisible(true);
            }}
            className={`px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 cursor-pointer ${
              activeLayer === 'blessed_dears' && isBlessedDearsVisible
                ? 'bg-gradient-to-r from-red-700 via-rose-700 to-amber-700 text-white font-bold shadow-md ring-1 ring-amber-300/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span className="text-sm">🐎</span>
            <span>To Blessed Dears! (2026)</span>
            <span className="ml-1 px-1.5 py-0.2 bg-amber-400/20 text-amber-200 text-[10px] rounded-full border border-amber-400/40">
              Front
            </span>
          </button>

          {/* Tab 2: In Coat of White */}
          <button
            onClick={() => {
              setActiveLayer('coat_of_white');
              setIsCoatOfWhiteVisible(true);
            }}
            className={`px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 cursor-pointer ${
              activeLayer === 'coat_of_white' && isCoatOfWhiteVisible
                ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-bold shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5 text-teal-300" />
            <span>In Coat of White (Poem)</span>
          </button>

          {/* Tab 3: Happy Birthday Dr. T */}
          <button
            onClick={() => setActiveLayer('birthday')}
            className={`px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 cursor-pointer ${
              activeLayer === 'birthday' || (!isCoatOfWhiteVisible && !isBlessedDearsVisible)
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Cake className="w-3.5 h-3.5 text-amber-300" />
            <span>Happy Birthday Dr. T</span>
          </button>

          <div className="h-4 w-px bg-slate-700 mx-1 hidden sm:block" />

          {/* Audio Chime Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title={soundEnabled ? 'Mute chimes' : 'Unmute chimes'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
          </button>

          {/* Close Modal Button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-rose-500/20 hover:text-rose-300 transition cursor-pointer"
            title="Close all popups"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* OVERLAPPING CARDS CONTAINER (Relative stacking with z-index transitions) */}
        <div className="relative w-full flex items-center justify-center">

          {/* ======================================================== */}
          {/* CARD A: HAPPY BIRTHDAY MODAL (Base / Backing Layer) */}
          {/* ======================================================== */}
          <div 
            onClick={() => {
              if (activeLayer !== 'birthday') {
                setActiveLayer('birthday');
              }
            }}
            className={`w-full max-w-xl bg-gradient-to-b from-amber-50 via-white to-rose-50/80 border-2 border-amber-300 rounded-3xl shadow-2xl overflow-hidden text-slate-800 flex flex-col transition-all duration-300 ${
              activeLayer === 'birthday' || (!isCoatOfWhiteVisible && !isBlessedDearsVisible)
                ? 'relative z-30 scale-100 opacity-100 shadow-amber-500/30'
                : activeLayer === 'coat_of_white'
                ? 'absolute top-0 z-10 -translate-y-5 sm:-translate-y-6 scale-[0.92] sm:scale-[0.94] opacity-75 hover:opacity-95 shadow-amber-900/40 cursor-pointer pointer-events-auto'
                : 'absolute top-0 z-10 -translate-y-9 sm:-translate-y-10 scale-[0.88] sm:scale-[0.90] opacity-60 hover:opacity-90 shadow-amber-900/40 cursor-pointer pointer-events-auto'
            } max-h-[85vh]`}
          >
            {/* Top Festive Ribbon Banner */}
            <div className="bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500 px-4 py-2.5 text-white font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-between shadow-md">
              <div className="flex items-center space-x-2">
                <PartyPopper className="w-4 h-4 animate-bounce text-amber-200" />
                <span className="font-extrabold tracking-widest drop-shadow-sm">Happy Birthday Celebration! 🎉🎂✨</span>
              </div>
              <div className="flex items-center space-x-2">
                {isBlessedDearsVisible && activeLayer !== 'blessed_dears' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveLayer('blessed_dears');
                    }}
                    className="px-2 py-0.5 rounded-lg bg-red-700/90 hover:bg-red-700 text-white text-[11px] font-bold transition flex items-center space-x-1 cursor-pointer"
                    title="Bring To Blessed Dears! to the front"
                  >
                    <span>🐎</span>
                    <span>View 2026 Poem</span>
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className="p-1 hover:bg-white/25 rounded-lg text-white transition cursor-pointer"
                  title="Close window"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Birthday Content */}
            <div className="p-5 sm:p-7 overflow-y-auto space-y-5">
              
              {/* Header Visual with Dr. T and Birthday Cake */}
              <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-amber-100/90 via-rose-100/80 to-purple-100/90 border border-amber-200 shadow-sm">
                
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
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center space-x-1.5">
                      <span>Dr. T</span>
                      <Stars className="w-4 h-4 text-amber-500 fill-amber-400" />
                    </h2>
                    <p className="text-xs text-rose-700 font-semibold">Special Birthday Tribute</p>
                  </div>
                </div>

                {/* Animated Interactive Birthday Cake */}
                <div 
                  onClick={toggleCandles}
                  className="relative cursor-pointer group flex flex-col items-center bg-white/80 p-2.5 rounded-2xl border border-amber-200 shadow-sm hover:scale-105 transition"
                  title={candlesLit ? "Blow out candles!" : "Relight candles!"}
                >
                  <div className="flex space-x-1 -mb-1">
                    <Flame className={`w-3.5 h-3.5 ${candlesLit ? 'text-amber-500 fill-amber-400 animate-pulse' : 'text-slate-300'}`} />
                    <Flame className={`w-3.5 h-3.5 ${candlesLit ? 'text-rose-500 fill-rose-400 animate-pulse [animation-delay:150ms]' : 'text-slate-300'}`} />
                    <Flame className={`w-3.5 h-3.5 ${candlesLit ? 'text-amber-500 fill-amber-400 animate-pulse [animation-delay:300ms]' : 'text-slate-300'}`} />
                  </div>
                  <Cake className="w-9 h-9 text-rose-500" />
                  <span className="text-[10px] text-amber-900 font-bold mt-0.5">
                    {candlesLit ? "Blow 🕯️" : "Light 🕯️"}
                  </span>
                </div>

              </div>

              {/* Heartfelt Birthday Poem with Decorative Frame */}
              <div className="relative p-5 rounded-2xl bg-gradient-to-b from-amber-50/60 to-rose-50/60 border border-amber-200/80 shadow-inner">
                <div className="absolute top-2 left-2 text-amber-300 select-none">✦</div>
                <div className="absolute top-2 right-2 text-amber-300 select-none">✦</div>
                <div className="absolute bottom-2 left-2 text-amber-300 select-none">✦</div>
                <div className="absolute bottom-2 right-2 text-amber-300 select-none">✦</div>

                <div className="space-y-2 text-center font-serif text-slate-800 text-sm sm:text-base leading-relaxed">
                  <p className="text-rose-950 font-bold">Whose cries so crystal clear?</p>
                  <p className="text-amber-950 font-medium">Three worlds all bless 'Happy, Whole Years!</p>
                  <p className="text-slate-900 font-bold">Making your mark soon, Dear</p>
                  <p className="text-indigo-950 font-medium">Wow worlds with Heart, Found worlds with Mind</p>
                  <p className="text-rose-900 font-bold">Cheers on your paths go wild</p>
                  <p className="text-amber-900 font-medium">Wishing you Best running your ways</p>
                  <p className="text-slate-800 font-bold">Till time finds it 'assez'</p>
                  <div className="pt-2 border-t border-rose-200/80 mt-2 font-serif italic text-xs sm:text-sm text-slate-700 space-y-0.5">
                    <p className="font-semibold text-rose-800">Toujours, J'attends, Bonjour! Ça va?</p>
                    <p className="font-semibold text-slate-800">Toujours, Je prie, Tu vas bien!</p>
                  </div>
                </div>
              </div>

              {/* Interactive Celebration Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <button
                  onClick={handleSendWish}
                  className="flex-1 min-w-[140px] px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white text-xs font-bold shadow-md shadow-rose-500/20 flex items-center justify-center space-x-2 transition transform active:scale-95 cursor-pointer"
                >
                  <Heart className={`w-4 h-4 ${hasWished ? 'fill-white' : ''} text-white animate-pulse`} />
                  <span>{hasWished ? 'Blessing Sent! 💖' : 'Send Birthday Wish'}</span>
                  <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-black/20 rounded-full font-mono">
                    {wishesCount}
                  </span>
                </button>

                <button
                  onClick={() => launchConfettiBlast('birthday')}
                  className="px-3 py-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold flex items-center space-x-1.5 transition shadow-sm cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Confetti 🎊</span>
                </button>

                <button
                  onClick={handleCopyBirthday}
                  className="px-3 py-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition shadow-sm cursor-pointer"
                >
                  {copiedBirthday ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
                  <span>{copiedBirthday ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

            </div>

            {/* Bottom Footer Accent */}
            <div className="bg-amber-100/90 px-4 py-2 border-t border-amber-200 text-center text-[11px] text-amber-900 flex items-center justify-center space-x-2 font-medium">
              <span>🎂 Celebrate life, health, and mind</span>
              <span>•</span>
              <span className="text-rose-700 font-bold">Happy Birthday Dr. T</span>
            </div>
          </div>

          {/* ======================================================== */}
          {/* CARD B: "IN COAT OF WHITE" POPUP (Middle Layer) */}
          {/* ======================================================== */}
          {isCoatOfWhiteVisible && (
            <div 
              onClick={() => {
                if (activeLayer !== 'coat_of_white') {
                  setActiveLayer('coat_of_white');
                }
              }}
              className={`w-full max-w-xl bg-gradient-to-b from-teal-50 via-white to-cyan-50/90 border-2 border-teal-400 rounded-3xl shadow-2xl overflow-hidden text-slate-800 flex flex-col transition-all duration-300 ${
                activeLayer === 'coat_of_white' || (!isBlessedDearsVisible && activeLayer !== 'birthday')
                  ? 'relative z-30 scale-100 opacity-100 shadow-teal-500/35 pointer-events-auto'
                  : activeLayer === 'blessed_dears'
                  ? 'absolute top-0 z-20 -translate-y-4 sm:-translate-y-5 scale-[0.96] sm:scale-[0.97] opacity-90 hover:opacity-100 shadow-teal-900/40 cursor-pointer pointer-events-auto'
                  : 'absolute top-0 z-10 -translate-y-5 sm:-translate-y-6 scale-[0.92] sm:scale-[0.94] opacity-75 hover:opacity-95 shadow-teal-900/40 cursor-pointer pointer-events-auto'
              } max-h-[85vh]`}
            >
              
              {/* Header Ribbon: In Coat of White */}
              <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-indigo-600 px-4 py-2.5 text-white font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-between shadow-md">
                <div className="flex items-center space-x-2">
                  <Stethoscope className="w-4 h-4 text-cyan-200 animate-pulse" />
                  <span className="font-extrabold tracking-widest drop-shadow-sm">
                    In Coat of White • Tribute by ZEN
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {isBlessedDearsVisible && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveLayer('blessed_dears');
                      }}
                      className="px-2.5 py-0.5 rounded-lg bg-red-700/90 hover:bg-red-700 text-white text-[11px] font-bold transition flex items-center space-x-1 cursor-pointer shadow-xs"
                      title="Switch to To Blessed Dears! in front"
                    >
                      <span>🐎</span>
                      <span>View 2026 Front</span>
                    </button>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveLayer('birthday');
                    }}
                    className="px-2.5 py-0.5 rounded-lg bg-amber-400/90 hover:bg-amber-400 text-slate-950 text-[11px] font-bold transition flex items-center space-x-1 cursor-pointer shadow-xs"
                    title="Switch to Birthday Cake behind"
                  >
                    <Cake className="w-3 h-3 text-rose-700" />
                    <span>View Cake</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsCoatOfWhiteVisible(false);
                      if (isBlessedDearsVisible) {
                        setActiveLayer('blessed_dears');
                      } else {
                        setActiveLayer('birthday');
                      }
                    }}
                    className="p-1 hover:bg-white/20 rounded-lg text-white transition cursor-pointer"
                    title="Close In Coat of White popup (reveals layer behind)"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Scrollable Body Container */}
              <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
                
                {/* The Uploaded Image Card (Responsive with High Fidelity) */}
                <div className="relative rounded-2xl overflow-hidden border-2 border-teal-300/80 shadow-lg bg-slate-900 group">
                  <picture>
                    <source srcSet="/InCoatofWhite.svg" type="image/svg+xml" />
                    <img
                      src="/InCoatofWhite.png"
                      alt="In Coat of White - Always comes first in line - By ZEN"
                      referrerPolicy="no-referrer"
                      className="w-full h-auto max-h-[340px] sm:max-h-[380px] object-contain mx-auto bg-gradient-to-b from-teal-950 via-teal-900 to-slate-950"
                    />
                  </picture>
                  
                  {/* Subtle Badge Overlay in Corner */}
                  <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-teal-400/50 text-[10px] font-mono text-cyan-300 font-bold flex items-center space-x-1 shadow-md">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>In Coat of White • ZEN</span>
                  </div>
                </div>

                {/* Transcribed Text Plaque with Dr. T Operating Portrait as Permanent Background */}
                <div className="relative rounded-2xl overflow-hidden border-2 border-teal-400/90 shadow-xl group">
                  {/* Background Image: Dr. T in Surgical Cap & Mask (IMG_2165.jpg) */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-all duration-500 transform group-hover:scale-105"
                    style={{ backgroundImage: `url(${drTActualPhoto})` }}
                  />
                  
                  {/* Translucent Glass Scrim for Contrast & Legibility */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/30 to-teal-950/45 backdrop-blur-[0.5px]" />

                  {/* Golden & Teal Corner Accents */}
                  <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-teal-600 z-10"></div>
                  <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-teal-600 z-10"></div>
                  <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-teal-600 z-10"></div>
                  <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-teal-600 z-10"></div>

                  {/* Text Content inside container with relative z-10 */}
                  <div className="relative z-10 p-4 sm:p-5 space-y-3">

                    {/* Top Stanza */}
                    <div className="text-center space-y-1 font-serif text-slate-900 text-xs sm:text-sm leading-relaxed font-black drop-shadow-sm">
                      <p className="text-slate-950">Always comes first in line</p>
                      <p className="text-teal-950">Melting cold hearts, Feeling dold minds</p>
                      <p className="text-slate-950">Fighting to last, last vibes</p>
                      <p className="text-indigo-950">Soul sewn, bold up, fear gone, game on!</p>
                    </div>

                    {/* Galloping Horse Artistic Graphic in Golden / Teal Tones */}
                    <div className="py-1 flex items-center justify-center">
                      <GallopingHorseSvg className="w-36 h-20 sm:w-44 sm:h-24 mx-auto opacity-95 drop-shadow-md" color="#fef08a" secondaryColor="#d97706" />
                    </div>

                    {/* Title & Author */}
                    <div className="py-1.5 border-y border-teal-600/30 text-center bg-white/50 backdrop-blur-xs rounded-xl shadow-xs">
                      <h3 className="text-xl sm:text-2xl font-black text-blue-900 tracking-tight font-sans drop-shadow-sm">
                        In Coat of White
                      </h3>
                      <p className="text-xs font-mono text-slate-900 font-bold text-right sm:pr-6 mt-0.5">
                        By ZEN
                      </p>
                    </div>

                    {/* Bottom French Stanza */}
                    <div className="text-center space-y-0.5 font-serif italic text-xs sm:text-sm text-slate-950 font-black drop-shadow-sm">
                      <p className="text-teal-950 font-black">Salut, Cher Dr., Ça va?</p>
                      <p className="text-slate-950 font-black">Je prie: 'Toujours, Tu vas bien!'</p>
                    </div>

                  </div>
                </div>

                {/* Interactive Action Row */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
                  
                  <button
                    onClick={handleSendSalute}
                    className="flex-1 min-w-[150px] px-4 py-2.5 rounded-2xl bg-gradient-to-r from-teal-600 via-cyan-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-lg shadow-teal-500/25 flex items-center justify-center space-x-2 transition transform active:scale-95 cursor-pointer"
                  >
                    <Heart className={`w-4 h-4 ${hasSaluted ? 'fill-white' : ''} text-rose-300 animate-pulse`} />
                    <span>{hasSaluted ? 'Salute Sent! 🩺✨' : 'White Coat Salute 🩺'}</span>
                    <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-black/25 rounded-full font-mono">
                      {saluteCount}
                    </span>
                  </button>

                  <button
                    onClick={() => launchConfettiBlast('teal')}
                    className="px-3.5 py-2.5 rounded-2xl bg-teal-100 hover:bg-teal-200 border border-teal-300 text-teal-900 text-xs font-bold flex items-center space-x-1.5 transition shadow-sm cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-teal-700" />
                    <span>Blessing ✨</span>
                  </button>

                  <button
                    onClick={handleCopyCoatOfWhite}
                    className="px-3.5 py-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition shadow-sm cursor-pointer"
                    title="Copy Poem Text"
                  >
                    {copiedCoatOfWhite ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
                    <span>{copiedCoatOfWhite ? 'Copied' : 'Copy'}</span>
                  </button>

                </div>

              </div>

              {/* Bottom Footer Accent */}
              <div className="bg-teal-100/90 px-4 py-2 border-t border-teal-200 text-center text-[11px] text-teal-900 flex items-center justify-between font-medium">
                <span className="flex items-center space-x-1 text-teal-800">
                  <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                  <span>Medical Dedication</span>
                </span>
                
                <button
                  onClick={() => setActiveLayer('birthday')}
                  className="text-indigo-700 font-bold hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <span>See Happy Birthday Cake</span>
                  <Cake className="w-3.5 h-3.5 text-amber-600" />
                </button>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* CARD C: "TO BLESSED DEARS!" POPUP (Overlapping in Front) */}
          {/* ======================================================== */}
          {isBlessedDearsVisible && (
            <div 
              onClick={() => {
                if (activeLayer !== 'blessed_dears') {
                  setActiveLayer('blessed_dears');
                }
              }}
              className={`w-full max-w-xl bg-gradient-to-b from-[#FAF6EC] via-white to-[#F5EFE0] border-2 border-[#D4A759] rounded-3xl shadow-2xl overflow-hidden text-slate-800 flex flex-col transition-all duration-300 ${
                activeLayer === 'blessed_dears'
                  ? 'relative z-30 scale-100 opacity-100 shadow-[#B07D30]/35 pointer-events-auto'
                  : activeLayer === 'coat_of_white'
                  ? 'absolute top-0 z-20 -translate-y-4 sm:-translate-y-5 scale-[0.96] sm:scale-[0.97] opacity-90 hover:opacity-100 shadow-amber-950/40 cursor-pointer pointer-events-auto'
                  : 'absolute top-0 z-10 -translate-y-7 sm:-translate-y-8 scale-[0.91] sm:scale-[0.93] opacity-75 hover:opacity-95 shadow-amber-950/40 cursor-pointer pointer-events-auto'
              } max-h-[85vh]`}
            >
              
              {/* Header Ribbon: Crimson & Gold Theme */}
              <div className="bg-gradient-to-r from-red-700 via-rose-700 to-amber-700 px-4 py-2.5 text-white font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-between shadow-md">
                <div className="flex items-center space-x-2">
                  <span className="text-base select-none">🐎</span>
                  <span className="font-extrabold tracking-widest drop-shadow-sm">
                    To Blessed Dears! • by Zen (2026)
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {isCoatOfWhiteVisible && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveLayer('coat_of_white');
                      }}
                      className="px-2.5 py-0.5 rounded-lg bg-teal-600/90 hover:bg-teal-600 text-white text-[11px] font-bold transition flex items-center space-x-1 cursor-pointer shadow-xs"
                      title="Switch to In Coat of White behind"
                    >
                      <Stethoscope className="w-3 h-3 text-cyan-200" />
                      <span>View Coat of White Behind</span>
                    </button>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsBlessedDearsVisible(false);
                      if (isCoatOfWhiteVisible) {
                        setActiveLayer('coat_of_white');
                      } else {
                        setActiveLayer('birthday');
                      }
                    }}
                    className="p-1 hover:bg-white/20 rounded-lg text-white transition cursor-pointer"
                    title="Close To Blessed Dears popup (reveals layer behind)"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Scrollable Body Container Decorated Faithfully as Image */}
              <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
                
                {/* Visual Card with Galloping Horse & 2026 Art */}
                <div className="relative rounded-2xl overflow-hidden border-2 border-amber-300/80 shadow-lg bg-[#FAF6EC] group">
                  <picture>
                    <source srcSet="/ToBlessedDears.svg" type="image/svg+xml" />
                    <img
                      src="/ToBlessedDears.svg"
                      alt="To Blessed Dears! - 2026 - Galloping Horse Poem by Zen"
                      referrerPolicy="no-referrer"
                      className="w-full h-auto max-h-[460px] sm:max-h-[520px] object-contain mx-auto bg-[#FAF6EC]"
                    />
                  </picture>
                </div>

                {/* Decorative Transcribed Plaque with Gold Corner Accents */}
                <div className="relative rounded-2xl overflow-hidden border-2 border-red-300/80 bg-gradient-to-b from-[#FCF9F0] via-[#FAF6EC] to-[#F5EFE0] p-4 sm:p-5 shadow-md group">
                  
                  {/* Vintage Golden Corner Ornaments */}
                  <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-[#C22227]/70 z-10"></div>
                  <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-[#C22227]/70 z-10"></div>
                  <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-[#C22227]/70 z-10"></div>
                  <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-[#C22227]/70 z-10"></div>

                  <div className="relative z-10 space-y-3">
                    
                    {/* Header Row: Title & by Zen */}
                    <div className="flex items-baseline justify-between border-b border-red-200/80 pb-2">
                      <h3 className="text-xl sm:text-2xl font-serif font-black text-[#C22227] tracking-tight drop-shadow-xs">
                        To Blessed Dears!
                      </h3>
                      <span className="text-xs sm:text-sm font-serif font-semibold text-[#C22227]">
                        by Zen
                      </span>
                    </div>

                    {/* 2026 Year Outline Typography Banner */}
                    <div className="flex items-center justify-between py-1">
                      <span 
                        className="text-4xl sm:text-5xl font-black tracking-widest select-none"
                        style={{
                          WebkitTextStroke: '1.8px #C22227',
                          color: 'transparent',
                          fontFamily: 'system-ui, -apple-system, sans-serif'
                        }}
                      >
                        2026
                      </span>
                      <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-100/90 border border-amber-300 text-[11px] font-bold text-amber-900 shadow-xs">
                        <span className="text-sm">🐎</span>
                        <span>Year of the Galloping Horse</span>
                      </div>
                    </div>

                    {/* Galloping Horse Artistic Graphic in Rich Gold & Amber Tones */}
                    <div className="py-1 flex items-center justify-center">
                      <GallopingHorseSvg className="w-44 h-24 sm:w-52 sm:h-28 mx-auto opacity-95 drop-shadow-md" color="#D4A759" secondaryColor="#C29141" />
                    </div>

                    {/* Stanza: 4 Lines in Crimson Red */}
                    <div className="font-serif text-[#C22227] text-xs sm:text-sm md:text-base leading-relaxed font-bold space-y-1.5 py-1 text-left sm:text-center">
                      <p>Two, Oh, Two, Six: What a Year!</p>
                      <p>Pumps up all veins with best Cheers,</p>
                      <p>Gallop here, there for Meets up</p>
                      <p className="font-black text-sm sm:text-base md:text-lg">Bounce back to prime, ‘To blessed Dears!’</p>
                    </div>

                  </div>
                </div>

                {/* Interactive Action Row */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
                  
                  <button
                    onClick={handleBlessedCheers}
                    className="flex-1 min-w-[150px] px-4 py-2.5 rounded-2xl bg-gradient-to-r from-red-700 via-rose-700 to-amber-700 hover:from-red-600 hover:to-amber-600 text-white text-xs font-extrabold shadow-lg shadow-red-700/25 flex items-center justify-center space-x-2 transition transform active:scale-95 cursor-pointer"
                  >
                    <span className="text-base">🐎</span>
                    <span>{hasCheered ? 'Cheers Sent! 🥂✨' : 'Gallop Cheers 2026 🥂'}</span>
                    <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-black/25 rounded-full font-mono">
                      {cheersCount}
                    </span>
                  </button>

                  <button
                    onClick={() => launchConfettiBlast('gold_red')}
                    className="px-3.5 py-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-900 text-xs font-bold flex items-center space-x-1.5 transition shadow-sm cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-700" />
                    <span>Blessing ✨</span>
                  </button>

                  <button
                    onClick={handleCopyBlessedDears}
                    className="px-3.5 py-2.5 rounded-2xl bg-white hover:bg-amber-50 border border-amber-300 text-amber-950 text-xs font-semibold flex items-center space-x-1.5 transition shadow-sm cursor-pointer"
                    title="Copy Poem Text"
                  >
                    {copiedBlessedDears ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-amber-800" />}
                    <span>{copiedBlessedDears ? 'Copied' : 'Copy'}</span>
                  </button>

                </div>

              </div>

              {/* Bottom Footer Accent */}
              <div className="bg-amber-100/90 px-4 py-2 border-t border-amber-200 text-center text-[11px] text-amber-900 flex items-center justify-between font-medium">
                <span className="flex items-center space-x-1 text-amber-900 font-semibold">
                  <span>🐎</span>
                  <span>2026 Celebration • By ZEN</span>
                </span>
                
                {isCoatOfWhiteVisible && (
                  <button
                    onClick={() => setActiveLayer('coat_of_white')}
                    className="text-teal-800 font-bold hover:underline flex items-center space-x-1 cursor-pointer"
                  >
                    <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                    <span>See In Coat of White</span>
                  </button>
                )}
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
