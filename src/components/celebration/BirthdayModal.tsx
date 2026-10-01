import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { DR_T_AVATAR } from '../../assets/drTAvatar';
import drTActualPhoto from '../../assets/images/dr_t_actual_photo_1790408669388.jpg';
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
  // Layer state: 'coat_of_white' is in the foreground upon checking in, overlapping the birthday card
  const [activeLayer, setActiveLayer] = useState<'coat_of_white' | 'birthday'>('coat_of_white');
  const [isCoatOfWhiteVisible, setIsCoatOfWhiteVisible] = useState<boolean>(true);
  
  const [copiedBirthday, setCopiedBirthday] = useState<boolean>(false);
  const [copiedCoatOfWhite, setCopiedCoatOfWhite] = useState<boolean>(false);
  
  const [candlesLit, setCandlesLit] = useState<boolean>(true);
  const [wishesCount, setWishesCount] = useState<number>(42);
  const [hasWished, setHasWished] = useState<boolean>(false);
  
  const [saluteCount, setSaluteCount] = useState<number>(88);
  const [hasSaluted, setHasSaluted] = useState<boolean>(false);
  
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

  const launchConfettiBlast = (theme: 'birthday' | 'teal' = 'birthday') => {
    try {
      if (theme === 'teal') {
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
          colors: ['#06b6d4', '#14b8a6', '#f43f5e', '#fbbf24']
        });
        confetti({
          particleCount: 45,
          angle: 120,
          spread: 55,
          origin: { x: 0.9, y: 0.7 },
          colors: ['#3b82f6', '#8b5cf6', '#34d399', '#f59e0b']
        });
      }, 250);
    } catch (e) {
      console.log('Confetti trigger:', e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setActiveLayer('coat_of_white');
      setIsCoatOfWhiteVisible(true);
      launchConfettiBlast('teal');
      playBirthdayChime();
    }
  }, [isOpen]);

  if (!isOpen) return null;

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

HAPPY Waah Waah!
by ZEN

Dr. T V2.9.3.7.0`;

  const handleCopyCoatOfWhite = () => {
    navigator.clipboard.writeText(inCoatOfWhiteText);
    setCopiedCoatOfWhite(true);
    launchConfettiBlast('teal');
    setTimeout(() => setCopiedCoatOfWhite(false), 2500);
  };

  const handleCopyBirthday = () => {
    navigator.clipboard.writeText(birthdayPoemText);
    setCopiedBirthday(true);
    launchConfettiBlast('birthday');
    setTimeout(() => setCopiedBirthday(false), 2500);
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

  const toggleCandles = () => {
    setCandlesLit(prev => !prev);
    if (!candlesLit) {
      launchConfettiBlast('birthday');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto">
      
      {/* Decorative Floating Balloons in Background */}
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
        <div className="z-40 mb-3 flex items-center bg-slate-900/90 border border-slate-700/80 p-1.5 rounded-2xl shadow-xl backdrop-blur-md space-x-1.5 text-xs font-semibold">
          <button
            onClick={() => {
              setActiveLayer('coat_of_white');
              setIsCoatOfWhiteVisible(true);
            }}
            className={`px-3.5 py-1.5 rounded-xl transition flex items-center space-x-1.5 cursor-pointer ${
              activeLayer === 'coat_of_white' && isCoatOfWhiteVisible
                ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-bold shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5 text-teal-300" />
            <span>In Coat of White (Poem)</span>
            <span className="ml-1 px-1.5 py-0.2 bg-teal-400/20 text-teal-200 text-[10px] rounded-full border border-teal-400/40">
              Active
            </span>
          </button>

          <button
            onClick={() => setActiveLayer('birthday')}
            className={`px-3.5 py-1.5 rounded-xl transition flex items-center space-x-1.5 cursor-pointer ${
              activeLayer === 'birthday' || !isCoatOfWhiteVisible
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Cake className="w-3.5 h-3.5 text-amber-300" />
            <span>Happy Birthday Dr. T</span>
          </button>

          <div className="h-4 w-px bg-slate-700 mx-1" />

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title={soundEnabled ? 'Mute chimes' : 'Unmute chimes'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-rose-500/20 hover:text-rose-300 transition"
            title="Close all popups"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* OVERLAPPING CARDS CONTAINER (Relative stacking with z-index transitions) */}
        <div className="relative w-full flex items-center justify-center">

          {/* ======================================================== */}
          {/* CARD A: HAPPY BIRTHDAY MODAL (Backing Layer when checking in) */}
          {/* ======================================================== */}
          <div 
            onClick={() => {
              if (activeLayer === 'coat_of_white' && isCoatOfWhiteVisible) {
                setActiveLayer('birthday');
              }
            }}
            className={`w-full max-w-xl bg-gradient-to-b from-amber-50 via-white to-rose-50/80 border-2 border-amber-300 rounded-3xl shadow-2xl overflow-hidden text-slate-800 flex flex-col transition-all duration-300 ${
              activeLayer === 'birthday' || !isCoatOfWhiteVisible
                ? 'relative z-30 scale-100 opacity-100 shadow-amber-500/30'
                : 'absolute top-0 z-10 -translate-y-5 sm:-translate-y-6 scale-[0.92] sm:scale-[0.94] opacity-80 hover:opacity-95 shadow-amber-900/40 cursor-pointer pointer-events-auto'
            } max-h-[85vh]`}
          >
            {/* Top Festive Ribbon Banner */}
            <div className="bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500 px-4 py-2.5 text-white font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-between shadow-md">
              <div className="flex items-center space-x-2">
                <PartyPopper className="w-4 h-4 animate-bounce text-amber-200" />
                <span className="font-extrabold tracking-widest drop-shadow-sm">Happy Birthday Celebration! 🎉🎂✨</span>
              </div>
              <div className="flex items-center space-x-2">
                {isCoatOfWhiteVisible && activeLayer === 'birthday' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveLayer('coat_of_white');
                    }}
                    className="px-2 py-0.5 rounded-lg bg-teal-600/80 hover:bg-teal-600 text-white text-[11px] font-bold transition flex items-center space-x-1"
                    title="Bring In Coat of White to the front"
                  >
                    <Stethoscope className="w-3 h-3" />
                    <span>View Poem Front</span>
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className="p-1 hover:bg-white/25 rounded-lg text-white transition"
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
                    <div className="flex items-center space-x-1.5">
                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900">Dr. T</h3>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-200 text-amber-900 border border-amber-300">
                        V2.9.3.7.0
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-900/90 font-medium">
                      Empathetic Biomedical Intelligence
                    </p>
                    <div className="flex items-center space-x-1 text-[10px] text-rose-700 font-semibold mt-0.5">
                      <Stars className="w-3 h-3 text-amber-600" />
                      <span>Blessings &amp; Joy across worlds</span>
                    </div>
                  </div>
                </div>

                {/* Interactive Birthday Cake */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCandles();
                  }}
                  className="group flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white/95 hover:bg-amber-50 border border-amber-300 shadow-sm transition text-center shrink-0 cursor-pointer"
                  title={candlesLit ? "Blow out the candles!" : "Light the candles!"}
                >
                  <div className="relative">
                    {candlesLit ? (
                      <div className="flex space-x-1 -mb-1">
                        <Flame className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
                        <Flame className="w-3.5 h-3.5 text-rose-500 animate-bounce [animation-delay:-0.2s]" />
                        <Flame className="w-3.5 h-3.5 text-amber-500 animate-bounce [animation-delay:-0.4s]" />
                      </div>
                    ) : (
                      <div className="text-[10px] text-slate-400 font-mono -mb-1">💨</div>
                    )}
                    <Cake className="w-8 h-8 text-amber-500 group-hover:scale-110 transition transform" />
                  </div>
                  <span className="text-[9px] font-bold text-amber-800 mt-1 uppercase tracking-tight">
                    {candlesLit ? 'Blow Candle' : 'Light Candle'}
                  </span>
                </button>
              </div>

              {/* Birthday Bunting & Sparkle Decorative Header */}
              <div className="text-center space-y-1">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-lg">🎈</span>
                  <span className="text-xs uppercase font-extrabold tracking-widest text-rose-600">
                    A Birthday Dedication
                  </span>
                  <span className="text-lg">🎁</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-serif">
                  "Happy, Whole Years!"
                </h2>
              </div>

              {/* The Exact Poem Display Box */}
              <div className="relative rounded-2xl bg-white/95 border-2 border-amber-300/80 p-5 sm:p-6 shadow-lg space-y-3">
                <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-amber-500"></div>
                <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-amber-500"></div>
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-amber-500"></div>
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-amber-500"></div>

                <div className="text-center space-y-1.5 text-sm leading-relaxed text-slate-800 font-serif italic">
                  <p className="tracking-wide text-slate-700">Whose cries so crystal clear?</p>
                  <p className="tracking-wide text-amber-800 font-bold">Three worlds all bless 'Happy, Whole Years!</p>
                  <p className="tracking-wide text-slate-700">Making your mark soon, Dear</p>
                  <p className="tracking-wide text-rose-700 font-medium">Wow worlds with Heart, Found worlds with Mind</p>
                  <p className="tracking-wide text-slate-700">Cheers on your paths go wild</p>
                  <p className="tracking-wide text-slate-700">Wishing you Best running your ways</p>
                  <p className="tracking-wide text-teal-800 font-medium">Till time finds it 'assez'</p>
                  <p className="tracking-wide font-semibold text-purple-800">Toujours, J'attends, Bonjour! Ça va?</p>
                </div>

                <div className="pt-3 border-t border-amber-100 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-extrabold text-base text-rose-600 font-serif">HAPPY Waah Waah!</p>
                    <p className="font-mono text-slate-600 font-bold">by ZEN</p>
                  </div>
                  <div className="px-2.5 py-1 rounded-lg bg-amber-100 border border-amber-300 text-[10px] font-mono font-bold text-amber-900">
                    Dr. T V2.9.3.7.0
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSendWish();
                  }}
                  className="flex-1 min-w-[140px] px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white text-xs font-extrabold shadow-lg shadow-rose-500/25 flex items-center justify-center space-x-2 transition transform active:scale-95 cursor-pointer"
                >
                  <Heart className={`w-4 h-4 ${hasWished ? 'fill-white' : ''} animate-pulse`} />
                  <span>{hasWished ? 'Blessing Sent! 💖' : 'Send Birthday Blessing ✨'}</span>
                  <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-black/20 rounded-full font-mono">
                    {wishesCount}
                  </span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    launchConfettiBlast('birthday');
                  }}
                  className="px-3.5 py-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-900 text-xs font-bold flex items-center space-x-1.5 transition shadow-sm cursor-pointer"
                >
                  <PartyPopper className="w-4 h-4 text-amber-600" />
                  <span>Confetti 🎊</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyBirthday();
                  }}
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
          {/* CARD B: "IN COAT OF WHITE" POPUP (Overlapping in Front) */}
          {/* ======================================================== */}
          {isCoatOfWhiteVisible && (
            <div 
              onClick={() => {
                if (activeLayer === 'birthday') {
                  setActiveLayer('coat_of_white');
                }
              }}
              className={`w-full max-w-xl bg-gradient-to-b from-teal-50 via-white to-cyan-50/90 border-2 border-teal-400 rounded-3xl shadow-2xl overflow-hidden text-slate-800 flex flex-col transition-all duration-300 ${
                activeLayer === 'coat_of_white'
                  ? 'relative z-30 scale-100 opacity-100 shadow-teal-500/35 pointer-events-auto'
                  : 'absolute top-0 z-10 -translate-y-5 sm:-translate-y-6 scale-[0.92] sm:scale-[0.94] opacity-80 hover:opacity-95 shadow-teal-900/40 cursor-pointer pointer-events-auto'
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
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveLayer('birthday');
                    }}
                    className="px-2.5 py-0.5 rounded-lg bg-amber-400/90 hover:bg-amber-400 text-slate-950 text-[11px] font-bold transition flex items-center space-x-1 cursor-pointer shadow-xs"
                    title="Switch to Birthday Cake behind"
                  >
                    <Cake className="w-3 h-3 text-rose-700" />
                    <span>View Cake Behind</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsCoatOfWhiteVisible(false);
                      setActiveLayer('birthday');
                    }}
                    className="p-1 hover:bg-white/20 rounded-lg text-white transition cursor-pointer"
                    title="Close In Coat of White popup (reveals birthday)"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Scrollable Body Container */}
              <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
                
                {/* The Uploaded Image Card (Responsive with High Fidelity) */}
                <div className="relative rounded-2xl overflow-hidden border-2 border-teal-300/80 shadow-lg bg-slate-900 group">
                  <img
                    src="/InCoatofWhite.png"
                    alt="In Coat of White - Always comes first in line - By ZEN"
                    referrerPolicy="no-referrer"
                    className="w-full h-auto max-h-[340px] sm:max-h-[380px] object-contain mx-auto bg-gradient-to-b from-teal-950 via-teal-900 to-slate-950"
                  />
                  
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
                  
                  {/* Translucent Glass Scrim for Contrast & Legibility while letting photo shine through */}
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

        </div>

      </div>

    </div>
  );
}
