import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  CheckCircle, 
  Mic, 
  MicOff, 
  PhoneCall, 
  Heart, 
  Headphones, 
  Upload, 
  Send,
  RefreshCw,
  Infinity as InfinityIcon,
  Wind,
  Sparkles,
  Copy,
  ExternalLink,
  Video,
  Music,
  Play,
  Pause,
  Disc,
  SkipForward
} from 'lucide-react';
import { VOICES, VIBES } from '../constants';
import { APPEARANCES } from './AvatarSettings';
import { Message, DrTVibe, DrTAppearance } from '../types';
import { BirthdayCelebrator } from './BirthdayCelebrator';
import { ALL_SYMPHONIES, SymphonyMasterpiece } from '../data/symphonyTracks';

interface CompanionHubProps {
  messages: Message[];
  vibe: DrTVibe;
  voiceName: string;
  setVoiceName: (name: string) => void;
  language: string;
  hasGreeted: boolean;
  inputVal: string;
  setInputVal: (val: string) => void;
  userName: string;
  setUserName: (name: string) => void;
  simulatedGreets: any[];
  isRecording: boolean;
  isThinking: boolean;
  isSpeaking: boolean;
  ttsEngine: 'gemini' | 'browser';
  setTtsEngine: (engine: 'gemini' | 'browser') => void;
  ttsPitch: number;
  setTtsPitch: (pitch: number) => void;
  ttsRate: number;
  setTtsRate: (rate: number) => void;
  avatarAppearance: DrTAppearance;
  tAge: 'young' | 'mature' | 'elder';
  emotionMeter: { stress: number; fatigue: number; happiness: number };
  setEmotionMeter: (meter: { stress: number; fatigue: number; happiness: number }) => void;
  waveHeights: number[];
  uploadNotice: string | null;
  setUploadNotice: (notice: string | null) => void;
  langNotice: string | null;
  setLangNotice: (notice: string | null) => void;
  toastNotice: string | null;
  setToastNotice: (notice: string | null) => void;
  averageSpeakIntensity: number;
  drTAvatar: string;
  triggerGreeting: (customText?: string) => void;
  handleUpdateHeartRate: (bpm: number) => void;
  getHeartRateValue: () => number;
  toggleRecording: () => void;
  setIsVoiceAgentActive: (active: boolean) => void;
  setAutoSpeak: (active: boolean) => void;
  startBreathingOverlay: () => void;
  triggerEmojis: (type: 'sparkle' | 'hug' | 'wave' | 'heart' | 'star') => void;
  speakMessage: (id: string, text: string) => void;
  stopAudio: () => void;
  handleSend: (overrideText?: string) => void;
  triggerSimulationAttachment: (type: string) => void;
  handleCustomFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  getSpeechBubbleText: (lang: string) => string;
  getIcebreakerText: (lang: string) => string;
  showAmbientPlayer: boolean;
  setShowAmbientPlayer: (show: boolean) => void;
  isVoiceAvatarOptedIn?: boolean;
  setIsVoiceAvatarOptedIn?: (opted: boolean) => void;
  setActiveTab?: (tab: string) => void;
  // Extended props supported by App.tsx
  [key: string]: any;
}

export function CompanionHub({
  showAmbientPlayer,
  setShowAmbientPlayer,
  messages,
  vibe,
  voiceName,
  setVoiceName,
  language,
  hasGreeted,
  inputVal,
  setInputVal,
  userName,
  setUserName,
  simulatedGreets,
  isRecording,
  isThinking,
  isSpeaking,
  ttsEngine,
  setTtsEngine,
  ttsPitch,
  setTtsPitch,
  ttsRate,
  setTtsRate,
  avatarAppearance,
  tAge,
  emotionMeter,
  setEmotionMeter,
  waveHeights,
  uploadNotice,
  setUploadNotice,
  langNotice,
  setLangNotice,
  toastNotice,
  setToastNotice,
  averageSpeakIntensity,
  drTAvatar,
  triggerGreeting,
  handleUpdateHeartRate,
  getHeartRateValue,
  toggleRecording,
  setIsVoiceAgentActive,
  setAutoSpeak,
  startBreathingOverlay,
  triggerEmojis,
  speakMessage,
  stopAudio,
  handleSend,
  triggerSimulationAttachment,
  handleCustomFileChange,
  getSpeechBubbleText,
  getIcebreakerText,
  isVoiceAvatarOptedIn = true,
  setIsVoiceAvatarOptedIn,
  setActiveTab,
}: CompanionHubProps) {
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const isInitialMount = useRef(true);
  
  // Local mini-player state for symphonies
  const [activeMiniSymphonyIndex, setActiveMiniSymphonyIndex] = useState(0);
  const [isMiniSymphonyPlaying, setIsMiniSymphonyPlaying] = useState(false);
  const miniAudioCtxRef = useRef<AudioContext | null>(null);
  const miniTimerRef = useRef<any>(null);

  const NOTE_FREQS: Record<string, number> = {
    'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
    'C4': 261.63, 'C#4': 277.18, 'Db4': 277.18, 'D4': 293.66, 'Eb4': 311.13, 'E4': 329.63, 'F4': 349.23,
    'F#4': 369.99, 'G4': 392.00, 'Ab4': 415.30, 'A4': 440.00, 'Bb4': 466.16, 'B4': 493.88,
    'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'Eb5': 622.25, 'E5': 659.25, 'F5': 698.46,
    'F#5': 739.99, 'G5': 783.99, 'Ab5': 830.61, 'A5': 880.00, 'Bb5': 932.33, 'B5': 987.77,
    'C6': 1046.50
  };

  const playMiniTone = (freq: number, duration: number) => {
    try {
      if (!miniAudioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        miniAudioCtxRef.current = new AudioCtx();
      }
      if (miniAudioCtxRef.current.state === 'suspended') {
        miniAudioCtxRef.current.resume();
      }
      const ctx = miniAudioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio fallback
    }
  };

  const toggleMiniSymphonyPlay = () => {
    if (isMiniSymphonyPlaying) {
      if (miniTimerRef.current) clearTimeout(miniTimerRef.current);
      setIsMiniSymphonyPlaying(false);
    } else {
      setIsMiniSymphonyPlaying(true);
      const currentTrack = ALL_SYMPHONIES[activeMiniSymphonyIndex] || ALL_SYMPHONIES[0];
      let stepIdx = 0;
      const loopNotes = () => {
        if (!currentTrack.notes || currentTrack.notes.length === 0) return;
        const noteName = currentTrack.notes[stepIdx % currentTrack.notes.length];
        const freq = NOTE_FREQS[noteName] || 440;
        playMiniTone(freq, 0.45);
        stepIdx++;
        miniTimerRef.current = setTimeout(loopNotes, 480);
      };
      loopNotes();
    }
  };

  const handleNextMiniTrack = () => {
    if (miniTimerRef.current) clearTimeout(miniTimerRef.current);
    const nextIdx = (activeMiniSymphonyIndex + 1) % ALL_SYMPHONIES.length;
    setActiveMiniSymphonyIndex(nextIdx);
    if (isMiniSymphonyPlaying) {
      setTimeout(() => {
        let stepIdx = 0;
        const track = ALL_SYMPHONIES[nextIdx];
        const loopNotes = () => {
          if (!track.notes || track.notes.length === 0) return;
          const noteName = track.notes[stepIdx % track.notes.length];
          const freq = NOTE_FREQS[noteName] || 440;
          playMiniTone(freq, 0.45);
          stepIdx++;
          miniTimerRef.current = setTimeout(loopNotes, 480);
        };
        loopNotes();
      }, 100);
    }
  };

  useEffect(() => {
    return () => {
      if (miniTimerRef.current) clearTimeout(miniTimerRef.current);
      if (miniAudioCtxRef.current) {
        try { miniAudioCtxRef.current.close(); } catch {}
      }
    };
  }, []);
  
  const [tavusUrl, setTavusUrl] = useState<string>(() => {
    return 'https://maker.tavus.io/deployments/c28965db-cea7-4d77-883f-5a499b97b916';
  });

  const handleStartTavusConversation = (overrideUrl?: string) => {
    const targetUrl = overrideUrl || tavusUrl.trim() || 'https://maker.tavus.io/deployments/c28965db-cea7-4d77-883f-5a499b97b916';
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleTavusUrlChange = (newUrl: string) => {
    setTavusUrl(newUrl);
    localStorage.setItem('tavus_deployment_url', newUrl);
  };

  // Auto scroll to bottom when messages list updates
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  return (
    <div 
      className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn transition-all duration-1000" 
      id="dr-t-infinity-hub"
      style={{
        '--orb-glow-color': getHeartRateValue() > 100 ? '#f59e0b' : '#f43f5e',
        '--orb-glow-start': getHeartRateValue() > 100 ? '#fbbf24' : '#fb7185',
        '--orb-glow-end': getHeartRateValue() > 100 ? '#d97706' : '#e11d48',
        '--orb-glow-ring': getHeartRateValue() > 100 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(244, 63, 94, 0.1)'
      } as React.CSSProperties}
    >
      
      {/* Left Spatial Voice & Parameter Dashboard Panel (span 5) */}
      <div className="lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 w-full">
        
        {/* Column A: Diagnostics & Biofeedback */}
        <div className="flex flex-col gap-6 w-full">
        
        {/* Giant Live Orb card */}
        <div className="w-full bg-white/80 border border-rose-100/70 rounded-3xl p-6 shadow-md flex flex-col items-center justify-between min-h-[460px] relative overflow-hidden">
          
          {/* SVG Live EKG Pulse Heartbeat Monitor background overlay */}
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes ekgPulse {
                0%, 100% {
                  opacity: 0.15;
                  transform: scaleY(0.95);
                  stroke-width: 2.2;
                }
                15% {
                  opacity: 0.95;
                  transform: scaleY(1.15);
                  stroke-width: 3.5;
                  filter: drop-shadow(0 0 6px var(--orb-glow-color, #f43f5e));
                }
                30% {
                  opacity: 0.25;
                  transform: scaleY(0.97);
                  stroke-width: 2.2;
                }
                45% {
                  opacity: 0.65;
                  transform: scaleY(1.05);
                  stroke-width: 2.8;
                  filter: drop-shadow(0 0 3px var(--orb-glow-color, #f43f5e));
                }
              }
              .ekg-active-pulse {
                transform-origin: center;
                animation: ekgPulse var(--ekg-duration, 1s) infinite ease-in-out;
              }
            `}} />
            <svg className="w-full h-full opacity-55" viewBox="0 0 400 300" preserveAspectRatio="none">
              <defs>
                <pattern id="heartgrid" width="16" height="16" patternUnits="userSpaceOnUse">
                  <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(244, 63, 94, 0.04)" strokeWidth="0.5"/>
                  <circle cx="8" cy="8" r="0.5" fill="rgba(244, 63, 94, 0.08)" />
                </pattern>
                <linearGradient id="ekgGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="transparent" />
                  <stop offset="20%" stopColor="var(--orb-glow-color, #f43f5e)" stopOpacity="0.25" />
                  <stop offset="50%" stopColor="var(--orb-glow-color, #f43f5e)" />
                  <stop offset="80%" stopColor="var(--orb-glow-color, #f43f5e)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
              
              {/* Grid Background */}
              <rect width="100%" height="100%" fill="url(#heartgrid)" />
              
              {/* The sweeping/pulsating heartbeat line */}
              <path
                d="M 0,150 L 40,150 Q 46,142 52,150 L 58,150 L 62,155 L 67,110 L 72,190 L 77,150 L 83,150 Q 90,140 97,150 L 140,150 L 180,150 Q 186,142 192,150 L 198,150 L 202,155 L 207,110 L 212,190 L 217,150 L 223,150 Q 230,140 237,150 L 280,150 L 320,150 Q 326,142 332,150 L 338,150 L 342,155 L 347,110 L 352,190 L 357,150 L 363,150 Q 370,140 377,150 L 400,150"
                fill="none"
                stroke="url(#ekgGlow)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ekg-active-pulse"
                style={{ '--ekg-duration': `${60 / getHeartRateValue()}s` } as React.CSSProperties}
              />
            </svg>
          </div>

          <div className="w-full text-center z-10">
            <span className="text-stone-400 font-mono text-[9px] tracking-widest uppercase font-bold">
              BIOMETRIC CORE PRESENCE
            </span>
            
            {/* Active verbal response description indicator */}
            <div className="h-5 flex justify-center items-center mt-1.5">
              {isThinking ? (
                <span className="text-xs text-amber-600 font-mono font-bold flex items-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-500" /> Synthesizing deep research...
                </span>
              ) : isSpeaking ? (
                <span className="text-xs text-emerald-600 font-mono font-bold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-500" /> Speaking...
                </span>
              ) : isRecording ? (
                <span className="text-xs text-rose-600 font-mono font-bold flex items-center gap-1">
                  🎤 Listening to speech inputs...
                </span>
              ) : !hasGreeted ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerGreeting();
                  }}
                  className="text-xs text-rose-600 font-mono font-extrabold flex items-center gap-1 hover:text-rose-700 underline decoration-dashed cursor-pointer"
                >
                  👋 Click to break the ice!
                </button>
              ) : (
                <span className="text-[10px] text-stone-400 font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-500" /> Core Synced & Safe
                </span>
              )}
            </div>
          </div>

          {/* Core animated neon orb wrapper */}
          <div 
            onClick={!hasGreeted ? () => triggerGreeting() : undefined}
            className={`relative my-6 flex items-center justify-center w-36 h-36 ${!hasGreeted ? 'cursor-pointer hover:scale-103' : ''} transition-all duration-300 z-10`}
          >
            {/* Speech bubble indicator callout */}
            {!hasGreeted && (
              <div 
                onClick={(e) => { e.stopPropagation(); triggerGreeting(); }}
                className="absolute -top-11 z-20 bg-white/95 border border-rose-100 px-3.5 py-1.5 rounded-2xl shadow-md text-[11px] font-extrabold text-rose-700 animate-bounce cursor-pointer whitespace-nowrap flex items-center gap-1"
              >
                <span>👋</span>
                <span>{getSpeechBubbleText(language)}</span>
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-0.5 w-1.5 h-1.5 bg-white border-r border-b border-rose-100 rotate-45"></div>
              </div>
            )}

            {/* Outer glowing backdrops */}
            <div 
              className={`absolute inset-0 rounded-full blur-3xl transition-all duration-1000 opacity-60 scale-125
                ${isThinking ? 'scale-135' : ''}
              `}
              style={{ 
                animationDuration: `${60 / getHeartRateValue()}s`,
                backgroundImage: 'radial-gradient(circle, var(--orb-glow-start, #fb7185) 0%, var(--orb-glow-end, #f43f5e) 70%, transparent 100%)'
              }}
            ></div>
            
            {/* Spatial coordinate dashed lines */}
            <div 
              className="absolute inset-0 rounded-full border border-dashed animate-spin-slow opacity-60"
              style={{ 
                animationDuration: `${120 / getHeartRateValue()}s`,
                borderColor: 'var(--orb-glow-color, rgba(244, 63, 94, 0.4))'
              }}
            ></div>

            <div 
              className="absolute inset-3 rounded-full border border-dotted animate-spin-reverse opacity-40"
              style={{ 
                animationDuration: `${180 / getHeartRateValue()}s`,
                borderColor: 'var(--orb-glow-color, rgba(244, 63, 94, 0.35))'
              }}
            ></div>

            {/* Dr. T Avatar Visual frame */}
            <div 
              className={`w-28 h-28 rounded-full border overflow-hidden flex items-center justify-center transition-all duration-1000 z-10 bg-white relative
                ring-8 ring-offset-4 ring-offset-white
                ${isRecording ? 'scale-105' : isSpeaking ? 'scale-110' : 'scale-100'}
              `}
              style={{
                borderColor: 'var(--orb-glow-color, #fda4af)',
                boxShadow: '0 0 0 8px var(--orb-glow-ring, rgba(244, 63, 94, 0.1))'
              }}
            >
              <img 
                src={drTAvatar}
                alt="Dr. T Avatar" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover select-none pointer-events-none"
              />

              {/* Mouth movement synchronous sync overlay */}
              {isSpeaking && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="absolute top-[61.5%] left-[49.5%] -translate-x-1/2 -translate-y-1/2 w-6 h-5 flex flex-col justify-center items-center">
                    <svg 
                      viewBox="0 0 100 40" 
                      className="w-4.5 text-rose-500 fill-current drop-shadow-xs transition-transform duration-75"
                      style={{ transform: `translateY(-${averageSpeakIntensity * 2.5}px) scaleY(${1 - averageSpeakIntensity * 0.1})` }}
                    >
                      <path d="M 0 20 Q 25 10 50 15 Q 75 10 100 20 Q 75 15 50 22 Q 25 15 0 20 Z" />
                    </svg>
                    <div 
                      className="w-2.5 bg-rose-950 rounded-full transition-all duration-75 my-[0.5px]" 
                      style={{ height: `${averageSpeakIntensity * 4.5}px` }}
                    />
                    <svg 
                      viewBox="0 0 100 40" 
                      className="w-4.5 text-rose-500 fill-current drop-shadow-xs transition-transform duration-75"
                      style={{ transform: `translateY(${averageSpeakIntensity * 2.5}px) scaleY(${1 - averageSpeakIntensity * 0.1})` }}
                    >
                      <path d="M 0 20 Q 50 40 100 20 Q 50 25 0 20 Z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Wearable Biometric Link Pulse Control */}
          <div className="w-full bg-stone-50/70 border border-stone-200/50 rounded-2xl p-3 flex flex-col gap-2 shadow-xs my-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="relative flex items-center justify-center">
                  <Heart 
                    className="w-4 h-4 text-rose-500 fill-current shrink-0" 
                  />
                </div>
                <span className="text-[10px] font-mono font-bold tracking-wider text-stone-650 uppercase">
                  Live Wearable Bio-Sync
                </span>
              </div>
              <span className="text-[10px] font-mono font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                {getHeartRateValue()} BPM
              </span>
            </div>

            {/* Slider or preset buttons */}
            <div className="flex items-center gap-3">
              <input 
                type="range" 
                min="50" 
                max="140" 
                value={getHeartRateValue()}
                onChange={(e) => handleUpdateHeartRate(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
            </div>

            <div className="flex justify-between gap-1.5">
              {[
                { bpm: 58, label: "🧘 Sleep/Zen", color: "hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200" },
                { bpm: 72, label: "☘️ Baseline", color: "hover:bg-stone-100 hover:text-stone-700 hover:border-stone-200" },
                { bpm: 115, label: "⚡ Stress Surge", color: "hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200" }
              ].map((preset) => (
                <button
                  key={preset.bpm}
                  type="button"
                  onClick={() => handleUpdateHeartRate(preset.bpm)}
                  className={`text-[9px] font-bold py-1 px-2 border rounded-lg transition-all cursor-pointer flex-1 text-center font-mono
                    ${getHeartRateValue() === preset.bpm 
                      ? 'bg-stone-900 border-stone-900 text-white shadow-xs' 
                      : `bg-white border-stone-200 text-stone-500 ${preset.color}`
                    }
                  `}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <span className="text-[9.5px] text-stone-500 text-center leading-sm font-sans block">
              Dr. T's Socratic companion orb dynamically shifts its pulsation wavelength to match your heart rate in real time.
            </span>
          </div>

          {/* Visual Audio Soundwave */}
          <div className="w-full flex items-center justify-center gap-1.5 h-8 px-4 mb-4">
            {waveHeights.map((h, idx) => (
              <span 
                key={idx} 
                className={`w-1 rounded-full transition-all duration-150
                  ${vibe === 'empathetic' ? 'bg-rose-400' : vibe === 'witty' ? 'bg-amber-400' : vibe === 'philosophical' ? 'bg-indigo-400' : 'bg-purple-400'}
                `}
                style={{ height: `${h}px` }}
              ></span>
            ))}
          </div>

          {/* Voice controls */}
          <div className="w-full flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={toggleRecording}
              disabled={isThinking}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 relative border cursor-pointer shadow-md group
                ${isRecording 
                  ? 'bg-rose-600 border-rose-500 text-white shadow-rose-600/30' 
                  : 'bg-white border-stone-200 text-rose-500 hover:text-rose-600 hover:scale-105 active:scale-95 disabled:opacity-50'
                }
              `}
              title="Speak out loud"
            >
              {isRecording ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
            </button>

            <div className="text-center">
              <span className="text-[10px] font-mono font-black uppercase tracking-widest text-stone-400">
                {isRecording ? "STATION STREAMING" : "TAP MIC TO ENGAGE SOCRATIC AUDIO"}
              </span>
              <p className="text-[10px] text-stone-400 mt-1 max-w-[260px] leading-relaxed italic">
                "Appearance apparel choice: {APPEARANCES.find(a => a.id === avatarAppearance)?.name}. Age range: {tAge === 'young' ? 'Young Specialist' : tAge === 'mature' ? 'Expert Clinical Partner' : 'Emeritus Socratic Mentor'}."
              </p>
            </div>

            {/* Tavus Conversational AI Video Agent launcher */}
            <div className="w-full bg-gradient-to-br from-stone-900 via-stone-950 to-indigo-950 text-white rounded-2xl p-4 border border-indigo-500/30 shadow-md space-y-3 mt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-indigo-500/20 border border-indigo-400/30">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <span className="text-xs font-bold font-display text-white block">Jack - Conversational AI Avatar</span>
                    <span className="text-[9px] text-stone-400 font-mono">Real-Time Video Agent Launcher</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Live Agent
                </span>
              </div>

              <p className="text-[10px] text-stone-300 leading-relaxed">
                Paste or enter your Tavus video deployment URL below to launch in a full-screen session:
              </p>

              {/* Editable Deployment URL Input Box */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={tavusUrl}
                    onChange={(e) => handleTavusUrlChange(e.target.value)}
                    placeholder="https://maker.tavus.io/deployments/..."
                    className="w-full px-3 py-2 text-xs font-mono bg-stone-900/90 border border-indigo-500/40 rounded-xl text-indigo-200 placeholder-stone-500 focus:outline-none focus:border-indigo-400 transition-all shadow-inner"
                  />
                </div>

                {/* Preset Chips */}
                <div className="flex flex-wrap items-center gap-1.5 text-[9px] font-mono">
                  <span className="text-stone-400 font-bold">Presets:</span>
                  <button
                    type="button"
                    onClick={() => handleTavusUrlChange('https://maker.tavus.io/deployments/c28965db-cea7-4d77-883f-5a499b97b916')}
                    className="px-2 py-0.5 rounded bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 font-bold cursor-pointer transition-colors"
                  >
                    #c28965db (Active)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTavusUrlChange('https://maker.tavus.io/deployments/f07a6f49-b2a9-457f-bb2f-796be7416816')}
                    className="px-2 py-0.5 rounded bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/30 cursor-pointer transition-colors"
                  >
                    #f07a6f49
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTavusUrlChange('https://maker.tavus.io/deployments/8b891163-ac8a-46bd-ac5e-4258b9faf9e6')}
                    className="px-2 py-0.5 rounded bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/30 cursor-pointer transition-colors"
                  >
                    #8b891163
                  </button>
                </div>

                {/* Launch Button */}
                <button
                  type="button"
                  onClick={() => handleStartTavusConversation()}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:from-indigo-600 hover:via-purple-700 hover:to-pink-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/25 transition-all cursor-pointer active:scale-98 mt-1"
                >
                  <Video className="w-4 h-4 text-emerald-300" />
                  <span>Launch Video Session (New Window)</span>
                  <ExternalLink className="w-3.5 h-3.5 text-indigo-200 ml-1" />
                </button>
              </div>
            </div>

            {/* Premium Therapy & Communication Suite */}
            <div className="w-full bg-stone-50/50 border border-stone-200/40 rounded-2xl p-4 flex flex-col gap-3 shadow-xs mt-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-black tracking-widest text-stone-400 uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-rose-400" /> THERAPY & SUITE HUB
                </span>
                <span className="text-[8px] font-mono font-bold text-stone-500 px-2 py-0.5 rounded-full bg-white border border-stone-100 uppercase">
                  Motherly Care
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {/* Live Voice Agent Call */}
                <button
                  type="button"
                  onClick={() => {
                    setIsVoiceAgentActive(true);
                    setAutoSpeak(true);
                  }}
                  className="flex flex-col items-center justify-between p-3.5 bg-white border border-stone-200/40 hover:border-emerald-300 hover:shadow-xs hover:shadow-emerald-500/5 hover:-translate-y-0.5 rounded-xl transition-all duration-300 cursor-pointer text-center group active:scale-97"
                  id="trigger-voice-agent-call-btn"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform duration-300">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <span className="text-[11px] font-extrabold tracking-tight text-stone-850 uppercase font-sans">
                      Agent Call
                    </span>
                    <span className="text-[8.5px] text-stone-400 mt-0.5 block font-mono font-semibold leading-none">
                      LIVE INTERCOM
                    </span>
                  </div>
                </button>

                {/* Dr. T Tab Button */}
                <div className="relative group/card">
                  <a
                    href="https://vocalbridgeai.com/shared/4ahTePkJBzlh0LQ1ndxolhqau3_hjYVfWWeM4-nwuhc?id=vb_YFqaOSEkoPlUix1yYWr2WVvSUN46YyQbJ6uk_5HGYeA&key=vb_YFqaOSEkoPlUix1yYWr2WVvSUN46YyQbJ6uk_5HGYeA&apiKey=vb_YFqaOSEkoPlUix1yYWr2WVvSUN46YyQbJ6uk_5HGYeA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-between p-3.5 bg-white border border-stone-200/40 hover:border-rose-300 hover:shadow-xs hover:shadow-rose-500/5 hover:-translate-y-0.5 rounded-xl transition-all duration-300 cursor-pointer text-center group active:scale-97 no-underline h-full"
                    id="dr-t-vocal-link-tab"
                  >
                    <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform duration-300">
                      <PhoneCall className="w-4 h-4 animate-bounce" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <span className="text-[11px] font-extrabold tracking-tight text-stone-850 uppercase font-sans flex items-center justify-center gap-1">
                        Dr. T <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover:scale-110 transition-transform" />
                      </span>
                      <span className="text-[8.5px] text-stone-400 mt-0.5 block font-mono font-semibold leading-none">
                        VOCAL BRIDGE
                      </span>
                    </div>
                  </a>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigator.clipboard.writeText("https://vocalbridgeai.com/shared/4ahTePkJBzlh0LQ1ndxolhqau3_hjYVfWWeM4-nwuhc?id=vb_YFqaOSEkoPlUix1yYWr2WVvSUN46YyQbJ6uk_5HGYeA&key=vb_YFqaOSEkoPlUix1yYWr2WVvSUN46YyQbJ6uk_5HGYeA&apiKey=vb_YFqaOSEkoPlUix1yYWr2WVvSUN46YyQbJ6uk_5HGYeA");
                      setToastNotice("Dr. T Vocal Bridge URL copied! Paste it in a new tab if popups are blocked by your browser.");
                      setTimeout(() => setToastNotice(null), 5000);
                    }}
                    className="absolute top-1.5 right-1.5 p-1 bg-stone-50 hover:bg-stone-100 border border-stone-200/55 rounded-md text-stone-400 hover:text-rose-600 transition-all cursor-pointer opacity-0 group-hover/card:opacity-100 shadow-2xs"
                    title="Copy Link to Clipboard"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>

                {/* Guided Breathing */}
                <button
                  type="button"
                  onClick={startBreathingOverlay}
                  className="flex flex-col items-center justify-between p-3.5 bg-white border border-stone-200/40 hover:border-pink-300 hover:shadow-xs hover:shadow-pink-500/5 hover:-translate-y-0.5 rounded-xl transition-all duration-300 cursor-pointer text-center group active:scale-97"
                >
                  <div className="w-10 h-10 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform duration-300">
                    <Wind className="w-4 h-4" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <span className="text-[11px] font-extrabold tracking-tight text-stone-850 uppercase font-sans">
                      Breathing
                    </span>
                    <span className="text-[8.5px] text-stone-400 mt-0.5 block font-mono font-semibold leading-none">
                      COHERENCE 🧘
                    </span>
                  </div>
                </button>

                {/* Dr. T Frequency Therapy */}
                <button
                  type="button"
                  onClick={() => setShowAmbientPlayer(true)}
                  className="flex flex-col items-center justify-between p-3.5 bg-white border border-stone-200/40 hover:border-amber-300 hover:shadow-xs hover:shadow-amber-500/5 hover:-translate-y-0.5 rounded-xl transition-all duration-300 cursor-pointer text-center group active:scale-97"
                >
                  <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform duration-300">
                    <Headphones className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <span className="text-[11px] font-extrabold tracking-tight text-stone-850 uppercase font-sans">
                      Therapy
                    </span>
                    <span className="text-[8.5px] text-stone-400 mt-0.5 block font-mono font-semibold leading-none">
                      SOLFEGGIO 🔔
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Classical Symphonies & Pop Playlist Jukebox (30+ Masterpiece Collection) */}
            <div className="w-full bg-gradient-to-br from-amber-50/90 via-rose-50/70 to-stone-50 border border-amber-200/70 rounded-2xl p-4 flex flex-col gap-3 shadow-xs mt-3.5" id="companion-symphony-jukebox">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-black tracking-widest text-amber-800 uppercase flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-amber-600 animate-spin" style={{ animationDuration: '8s' }} /> 
                  CLASSICAL & POP JUKEBOX
                </span>
                <span className="text-[8.5px] font-mono font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-200">
                  {ALL_SYMPHONIES.length} TRACKS
                </span>
              </div>

              {/* Mode indicator & quick toggle */}
              <div className="flex items-center justify-between text-[10px] bg-white/70 p-2 rounded-xl border border-amber-100">
                <span className="text-stone-600 font-medium">
                  {isVoiceAvatarOptedIn ? '🎙️ Voice Avatar Mode' : '🎼 Symphony Background Mode'}
                </span>
                <button
                  type="button"
                  onClick={() => setIsVoiceAvatarOptedIn && setIsVoiceAvatarOptedIn(!isVoiceAvatarOptedIn)}
                  className="text-rose-600 font-bold hover:underline cursor-pointer"
                >
                  {isVoiceAvatarOptedIn ? 'Switch to Symphonies' : 'Switch to Voice Avatar'}
                </button>
              </div>

              {/* Currently Selected Track Info */}
              {ALL_SYMPHONIES[activeMiniSymphonyIndex] && (
                <div className="p-3 bg-white/90 rounded-xl border border-amber-200/80 flex items-center justify-between gap-3 shadow-3xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-lg shrink-0 shadow-inner">
                      {ALL_SYMPHONIES[activeMiniSymphonyIndex].emoji}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-stone-900 truncate">
                        {ALL_SYMPHONIES[activeMiniSymphonyIndex].name}
                      </p>
                      <p className="text-[10px] text-stone-500 truncate">
                        {ALL_SYMPHONIES[activeMiniSymphonyIndex].composer} • {ALL_SYMPHONIES[activeMiniSymphonyIndex].benefits}
                      </p>
                    </div>
                  </div>

                  {/* Play/Pause & Next Controls */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={toggleMiniSymphonyPlay}
                      className="p-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-xs cursor-pointer active:scale-95 transition-all"
                      title={isMiniSymphonyPlaying ? 'Pause Melody' : 'Play Classical/Pop Symphony'}
                    >
                      {isMiniSymphonyPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                    </button>
                    <button
                      type="button"
                      onClick={handleNextMiniTrack}
                      className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer active:scale-95 transition-all"
                      title="Next Masterpiece"
                    >
                      <SkipForward className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Quick Select Masterpieces (Mozart, Beethoven, Bach, Chopin, Pop) */}
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'mozart_nachtmusik', label: '🎻 Mozart', idx: 0 },
                  { id: 'beethoven_5th', label: '⚡ Beethoven', idx: 1 },
                  { id: 'beethoven_moonlight', label: '🌙 Moonlight', idx: 2 },
                  { id: 'bach_air_g_string', label: '⛪ Bach', idx: 4 },
                  { id: 'vivaldi_spring', label: '🌸 Vivaldi', idx: 3 },
                  { id: 'pop_bohemian_rhapsody', label: '👑 Queen Pop', idx: 24 }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (miniTimerRef.current) clearTimeout(miniTimerRef.current);
                      setActiveMiniSymphonyIndex(item.idx);
                      if (isMiniSymphonyPlaying) {
                        setTimeout(() => {
                          let stepIdx = 0;
                          const track = ALL_SYMPHONIES[item.idx];
                          const loopNotes = () => {
                            if (!track.notes || track.notes.length === 0) return;
                            const noteName = track.notes[stepIdx % track.notes.length];
                            const freq = NOTE_FREQS[noteName] || 440;
                            playMiniTone(freq, 0.45);
                            stepIdx++;
                            miniTimerRef.current = setTimeout(loopNotes, 480);
                          };
                          loopNotes();
                        }, 80);
                      }
                    }}
                    className={`py-1.5 px-2 text-[9.5px] font-bold rounded-lg border transition-all cursor-pointer truncate ${
                      activeMiniSymphonyIndex === item.idx
                        ? 'bg-amber-500 border-amber-600 text-white shadow-xs'
                        : 'bg-white/80 border-stone-200 text-stone-700 hover:bg-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Full Symphony Concert Hall Link */}
              {setActiveTab && (
                <button
                  type="button"
                  onClick={() => setActiveTab('symphonies')}
                  className="w-full py-2 bg-white hover:bg-amber-50/80 border border-amber-200 text-amber-900 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-3xs"
                >
                  <Disc className="w-3.5 h-3.5 text-amber-600" />
                  <span>Open Full 35+ Track Symphony Concert Hall</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60 ml-0.5" />
                </button>
              )}
            </div>
          </div>
        </div>



      </div> {/* Close Column A */}

      {/* Column B: Active Neural Voice Console Card & Peer Greet Service */}
      <div className="flex flex-col gap-6 w-full">

          {/* Active Neural Voice Console Card */}
          <div className="bg-white/80 border border-rose-100/70 rounded-3xl p-5 shadow-xs flex flex-col gap-3.5" id="vocal-voice-synthesizer-card">
          <span className="text-[10px] font-mono font-bold tracking-widest text-rose-550 uppercase flex items-center gap-1.5">
            <Headphones className="w-3.5 h-3.5 text-rose-500" /> ACTIVE NEURAL VOICE CONSOLE
          </span>

          {/* Voice Character Select */}
          <div className="flex flex-col gap-1 text-xs">
            <span className="text-[10px] font-mono font-bold text-stone-500 uppercase">Select Vocal Signature</span>
            <select
              value={voiceName}
              onChange={(e) => setVoiceName(e.target.value)}
              className="w-full bg-white border border-stone-200 hover:border-stone-300 rounded-xl p-2 text-xs font-bold text-stone-700 cursor-pointer focus:border-rose-400 outline-none transition-all shadow-xs"
            >
              {VOICES.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.accent})
                </option>
              ))}
            </select>
          </div>

          {/* Engine Mode Section */}
          <div className="flex flex-col gap-1 text-xs">
            <span className="text-[10px] font-mono font-bold text-stone-500 uppercase">Cognition Vocal Engine</span>
            <div className="grid grid-cols-2 gap-1 p-1 bg-stone-100/80 rounded-xl border border-stone-200">
              <button
                type="button"
                onClick={() => setTtsEngine('gemini')}
                className={`py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${ttsEngine === 'gemini' ? 'bg-white shadow-xs text-rose-600 font-extrabold' : 'text-stone-500 hover:text-stone-850'}`}
                title="Generates sweet high-fidelity voice output using Gemini TTS Model"
              >
                🧠 Gemini AI Voice
              </button>
              <button
                type="button"
                onClick={() => setTtsEngine('browser')}
                className={`py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${ttsEngine === 'browser' ? 'bg-white shadow-xs text-indigo-600 font-extrabold' : 'text-stone-500 hover:text-stone-850'}`}
                title="High speed offline browser-native speech synthesis"
              >
                💻 Local Synthesis
              </button>
            </div>
          </div>

          {/* Vocal Modulation Sliders */}
          <div className="grid grid-cols-2 gap-3 mt-0.5">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[9px] font-mono text-stone-500">
                <span>VOCAL PITCH</span>
                <span className="font-bold text-rose-600">{ttsPitch.toFixed(2)}x</span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="2.0" 
                step="0.05" 
                value={ttsPitch} 
                onChange={(e) => setTtsPitch(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-rose-500" 
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[9px] font-mono text-stone-500">
                <span>READING SPEED</span>
                <span className="font-bold text-rose-600">{ttsRate.toFixed(2)}x</span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="2.0" 
                step="0.05" 
                value={ttsRate} 
                onChange={(e) => setTtsRate(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-rose-500" 
              />
            </div>
          </div>

          {/* Subtext info */}
          <p className="text-[9px] text-stone-400 font-sans leading-snug">
            {ttsEngine === 'gemini' 
              ? "💡 Pitch & Speed modulations apply exclusively to 'Local Synthesis' mode. Gemini AI Voice employs sweet preset cadences."
              : "✔️ Pitch and Speed adjustments calibrated. Listening to local speech synthesis is 100% responsive."
            }
          </p>

          {/* Test synthesis button */}
          <button
            type="button"
            onClick={() => {
              const textOptions = [
                "Hello sweetheart, I am Dr. T, your loving companion and intellectual soulmate. I am here to listen with all my heart, and answer with all my mind.",
                "Take a slow, deep breath, my child. Mommy is right here, and everything is going to be completely okay.",
                "Mẹ và người tri kỷ lớn bên con đây, thương lắm con yêu. Hãy tâm sự mọi vui buồn, thắc mắc về cuộc sống hay vũ trụ với mẹ nhé!",
                "Oh mon chéri, mon âme sœur et ta maman de sagesse ! Raconte-moi tes peines, tes projets de vie ou tes questions sur l'univers, je t'écoute de tout mon cœur.",
                "¡Mi querido corazón, mi alma gemela! Cuéntame tus penas de amor, tus dudas existenciales o tus retos con la ciencia. Mamá te comprende profundamente."
              ];
              let phrase = textOptions[0];
              const langLower = (language || 'auto').toLowerCase();
              if (langLower.includes('vietnamese') || langLower.includes('vi')) {
                phrase = textOptions[2];
              } else if (langLower.includes('french') || langLower.includes('fr')) {
                phrase = textOptions[3];
              } else if (langLower.includes('spanish') || langLower.includes('es')) {
                phrase = textOptions[4];
              } else {
                const rand = Math.floor(Math.random() * 2);
                phrase = textOptions[rand];
              }
              const testId = `test-tts-${Date.now()}`;
              speakMessage(testId, phrase);
            }}
            className="w-full py-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl text-[10px] font-bold font-mono uppercase tracking-wider transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5 hover:shadow-md active:scale-98"
          >
            <span>🔊</span> <span>Test Custom Accent Synthesis</span>
          </button>
        </div>

        {/* Socratic Platform Peer Greet Service Console */}
        <div className="bg-white/80 border border-stone-200/65 rounded-3xl p-5 shadow-xs flex flex-col gap-3.5" id="socratic-peer-greeting-service-card">
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#cf586e] uppercase flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            SOCRATIC PLATFORM INTERACTIVE GREET SERVICE
          </span>

          {/* Nickname Setter */}
          <div className="flex flex-col gap-1 text-xs">
            <span className="text-[10px] font-mono font-bold text-stone-500 uppercase flex justify-between">
              <span>Your Platform Nickname</span>
              <span className="text-rose-550 font-extrabold text-[9px] font-mono">ACTIVE ON PLATFORM</span>
            </span>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your nickname..."
                className="flex-1 bg-white border border-stone-200 text-stone-850 hover:border-stone-300 rounded-xl p-2 text-xs font-bold outline-none focus:border-rose-400 transition-all shadow-xs"
              />
              <button
                type="button"
                onClick={() => {
                  const capitalizedText = getIcebreakerText(language);
                  triggerGreeting(capitalizedText);
                }}
                className="px-3 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100/70 font-bold rounded-xl text-[10px] transition-all cursor-pointer font-mono uppercase"
                title="Click to force-greet you with this name!"
              >
                👋 Greet Me
              </button>
            </div>
            <p className="text-[9px] text-stone-400 font-sans mt-0.5 leading-tight">
              💡 Dr. T will instantly address you with this vocal identity in all greetings across the platform.
            </p>
          </div>

          {/* Live kindred connections greetings history */}
          <div className="flex flex-col gap-2 pt-1 border-t border-stone-100">
            <span className="text-[10px] font-mono font-bold text-stone-500 uppercase flex items-center justify-between">
              <span>Live Visitor Greetings (Global Feed)</span>
              <span className="text-stone-400 text-[8px] font-normal font-mono">Simulated Web RTC</span>
            </span>
            
            <div className="flex flex-col gap-1.5 max-h-[140px] overflow-y-auto pr-1">
              {simulatedGreets.map((greet) => (
                <div key={greet.id} className="p-2.5 bg-stone-55 border border-stone-100 rounded-xl flex flex-col gap-0.5 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-stone-700 flex items-center gap-1">
                      <span>{greet.flag}</span>
                      <span className="font-mono text-stone-850">{greet.name}</span>
                      <span className="text-[8px] bg-emerald-50 text-emerald-700 border border-emerald-100 rounded px-1 py-0.5 uppercase font-mono font-bold font-sans">GREETED</span>
                    </span>
                    <span className="text-[8px] font-mono text-stone-400">{greet.time}</span>
                  </div>
                  <p className="text-[10.5px] text-stone-500 italic mt-0.5 pl-4 border-l border-stone-200">
                    &ldquo;{greet.msg}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div> {/* Close Column B */}
    </div> {/* Close left dashboard container panels */}

    {/* Right Multimodal Conversation Console Panel (span 7) */}
    <div className="lg:col-span-7 flex flex-col gap-6 h-full">

      {/* Main chat log */}
      <div className="bg-white/85 border border-stone-200/50 rounded-3xl p-5 shadow-xs flex flex-col justify-between min-h-[460px] max-h-[580px] h-full relative" id="dialogue-console-chat-card">
        
        {/* Chat header */}
        <div className="flex items-center justify-between border-b border-stone-150 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <p className="text-xs font-mono font-bold tracking-wider text-stone-600 uppercase">Interactive Dialogue Console</p>
          </div>
          <span className="text-[10px] font-mono text-stone-400">Total conversation sync: {messages.length}</span>
        </div>

        {/* Messages scrollarea */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3.5 max-h-[380px] scroll-smooth">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-stone-400">
              <InfinityIcon className="w-9 h-9 text-rose-300 mb-2" />
              <p className="text-xs font-extrabold text-stone-600">Comforting Multilingual Counselor Hub</p>
              <p className="text-[11px] leading-relaxed text-stone-400 max-w-[340px] mt-1">
                Select a language option, then share any secret, vent relationship worries, ask life questions, or debug complex code. Dr. T Infinity knows everything and advises with maternal warmth!
              </p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div 
                  key={m.id}
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  className={`flex flex-col max-w-[85%]
                    ${m.role === 'user' ? 'self-end items-end' : 'self-start items-start'}
                  `}
                >
                  {/* Sender info */}
                  <span className="text-[9px] text-stone-400 font-mono font-extrabold mb-1 uppercase tracking-wider">
                    {m.role === 'user' ? 'Sweet Child (You)' : `Dr. T (${VIBES.find(v => v.id === vibe)?.name || 'Empathetic'})`} • {m.timestamp}
                  </span>

                  {/* Bubble */}
                  <div 
                    className={`p-3 rounded-2xl text-xs leading-relaxed transition-all shadow-sm relative duration-300
                      ${m.isVoicePlaying ? 'ring-2 ring-offset-1 ' + (
                        vibe === 'empathetic' ? 'ring-rose-300 bg-rose-50/90 shadow-lg shadow-rose-200/50' :
                        vibe === 'witty' ? 'ring-amber-300 bg-amber-50/90 shadow-lg shadow-amber-200/50' :
                        vibe === 'philosophical' ? 'ring-indigo-300 bg-indigo-50/90 shadow-lg shadow-indigo-200/50' :
                        'ring-purple-300 bg-purple-50/90 shadow-lg shadow-purple-200/50'
                      ) : ''}
                      ${m.role === 'user' 
                        ? 'bg-stone-900 border border-stone-950 text-white rounded-tr-none' 
                        : vibe === 'empathetic' ? 'bg-rose-50/70 border border-rose-100 text-rose-950 rounded-tl-none hover:bg-rose-50' 
                          : vibe === 'witty' ? 'bg-amber-50/70 border border-amber-100 text-amber-950 rounded-tl-none hover:bg-amber-50' 
                          : vibe === 'philosophical' ? 'bg-indigo-50/70 border border-indigo-100 text-indigo-950 rounded-tl-none hover:bg-indigo-50' 
                          : 'bg-purple-50/70 border border-purple-100 text-purple-950 rounded-tl-none hover:bg-purple-50'
                      }
                    `}
                  >
                    {/* Attachment rendering inside bubble */}
                    {m.attachment && (
                      <div className="mb-2 p-2 bg-stone-950/20 border border-white/10 rounded-xl flex items-center gap-2.5 text-[10px] text-stone-250 font-mono">
                        <span className="text-xl leading-none">📎</span>
                        <div className="truncate">
                          <p className="font-bold truncate">{m.attachment.name}</p>
                          <p className="opacity-80">Type: {m.attachment.type.toUpperCase()}</p>
                        </div>
                      </div>
                    )}

                    <p className="whitespace-pre-line select-text font-serif leading-relaxed text-sm">{m.content}</p>
                  </div>

                  {/* TTS Play controls for model answers */}
                  {m.role === 'model' && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <button
                        type="button"
                        onClick={() => speakMessage(m.id, m.content)}
                        className={`text-[9px] px-2 py-0.5 rounded-md font-mono font-bold tracking-wider cursor-pointer border transition-all flex items-center gap-1
                          ${m.isVoicePlaying 
                            ? 'bg-rose-50 border-rose-200 text-rose-600 font-extrabold' 
                            : 'bg-white hover:bg-stone-50 border-stone-150 text-stone-500'
                          }
                        `}
                      >
                        <span>🔊</span> <span>{m.isVoicePlaying ? 'SPEAKING' : 'READ ALOUD'}</span>
                      </button>
                      {isSpeaking && m.isVoicePlaying && (
                        <button
                          type="button"
                          onClick={stopAudio}
                          className="text-[9px] p-0.5 px-1.5 hover:bg-red-50 text-red-500 rounded border border-red-150 font-mono cursor-pointer"
                        >
                          STOP
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          <AnimatePresence>
            {isThinking && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.22 }}
                className="self-start flex flex-col items-start max-w-[80%]"
              >
                <span className="text-[9px] text-stone-400 font-mono font-extrabold mb-1 uppercase tracking-wider">
                  DR. T IS PONDERING...
                </span>
                <div className={`p-3.5 border rounded-2xl rounded-tl-none flex items-center gap-3 text-xs shadow-md transition-all duration-300
                  ${vibe === 'empathetic' ? 'bg-rose-50/95 border-rose-200/70 shadow-rose-100/40 text-rose-950' :
                    vibe === 'witty' ? 'bg-amber-50/95 border-amber-200/70 shadow-amber-100/40 text-amber-950' :
                    vibe === 'philosophical' ? 'bg-indigo-50/95 border-indigo-200/70 shadow-indigo-100/40 text-indigo-950' :
                    'bg-purple-50/95 border-purple-200/70 shadow-purple-100/40 text-purple-950'
                  }
                `}>
                  <RefreshCw className={`w-3.5 h-3.5 animate-spin shrink-0
                    ${vibe === 'empathetic' ? 'text-rose-550' :
                      vibe === 'witty' ? 'text-amber-650' :
                      vibe === 'philosophical' ? 'text-indigo-650' :
                      'text-purple-650'
                    }
                  `} />
                  <span className="text-[11px] font-mono tracking-wide">
                    Syncing semantic network
                  </span>
                  
                  {/* Elegant three bouncing dots typing sequence */}
                  <div className="flex items-center gap-1.5 ml-1.5 shrink-0 py-1">
                    <span className={`w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:-0.3s]
                      ${vibe === 'empathetic' ? 'bg-rose-500' :
                        vibe === 'witty' ? 'bg-amber-500' :
                        vibe === 'philosophical' ? 'bg-indigo-500' :
                        'bg-purple-500'
                      }
                    `}></span>
                    <span className={`w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:-0.15s]
                      ${vibe === 'empathetic' ? 'bg-rose-500' :
                        vibe === 'witty' ? 'bg-amber-500' :
                        vibe === 'philosophical' ? 'bg-indigo-500' :
                        'bg-purple-500'
                      }
                    `}></span>
                    <span className={`w-1.5 h-1.5 rounded-full animate-bounce
                      ${vibe === 'empathetic' ? 'bg-rose-500' :
                        vibe === 'witty' ? 'bg-amber-500' :
                        vibe === 'philosophical' ? 'bg-indigo-500' :
                        'bg-purple-500'
                      }
                    `}></span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Proactive alert scrolling advisory banner */}
        <div className="my-2.5 p-2 bg-gradient-to-r from-rose-50/50 via-amber-50/50 to-emerald-50/50 border border-stone-150 rounded-xl text-[10px] text-stone-500 flex items-center justify-between shadow-xs z-10">
          <span className="flex items-center gap-1.5 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-550"></span>
            <span className="font-extrabold text-stone-700 uppercase">PROACTIVE INTELLIGENCE:</span>
            <span className="truncate leading-none">Your passport expires in 5 months. You have not logged steps today.</span>
          </span>
          <button 
            type="button"
            onClick={() => { stopAudio(); handleSend("Prepare checklist to renew passport and plan local transport."); }}
            className="text-[9px] font-black text-rose-600 hover:text-rose-800 shrink-0 font-mono ml-2 underline underline-offset-2 cursor-pointer"
          >
            RESOLVE NOW
          </button>
        </div>

        {/* Link uploaded notification notice */}
        {uploadNotice && (
          <div className="mb-2 p-2 text-[10px] font-mono text-emerald-800 bg-emerald-50 rounded-lg flex items-center justify-between border border-emerald-100 animate-fadeIn">
            <span className="flex items-center gap-1">📎 {uploadNotice}</span>
            <button onClick={() => { setUploadNotice(null); }} className="text-stone-400 hover:text-stone-700">✕</button>
          </div>
        )}

        {/* Language Switch notification */}
        {langNotice && (
          <div className="mb-2 p-2 text-[10px] font-mono text-rose-800 bg-rose-50 rounded-lg flex items-center justify-between border border-rose-100 animate-fadeIn">
            <span className="flex items-center gap-1.5 font-bold">🌐 {langNotice}</span>
            <button onClick={() => setLangNotice(null)} className="text-rose-450 hover:text-rose-700 cursor-pointer">✕</button>
          </div>
        )}

        {/* Socratic Proactive Synchronizer notification toast */}
        {toastNotice && (
          <div className="mb-3 p-3 text-[11px] font-sans text-rose-900 bg-[#fff5f5] rounded-2xl flex items-start gap-2.5 justify-between border border-rose-200/65 shadow-xs animate-fadeIn">
            <span className="leading-relaxed font-semibold">
              {toastNotice}
            </span>
            <button onClick={() => setToastNotice(null)} className="text-rose-450 hover:text-rose-700 cursor-pointer font-bold shrink-0 text-xs">✕</button>
          </div>
        )}

        {/* Input station bar */}
        <div className="border-t border-stone-150 pt-3 z-10">
          <div className="flex gap-2">
            
            {/* Multimodal Quick Attachment simulation tray trigger */}
            <div className="relative group/tray">
              <button
                type="button"
                className="h-10 w-10 shrink-0 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-500 border border-stone-200 flex items-center justify-center transition-all cursor-pointer shadow-xs"
                title="Simulate snapping photo / document upload"
              >
                <Upload className="w-4 h-4" />
              </button>
              
              {/* Floating custom simulator list */}
              <div className="absolute bottom-11 left-0 bg-white border border-stone-200 rounded-2xl p-2.5 shadow-md flex flex-col gap-1.5 w-[240px] hidden group-hover/tray:flex group-focus-within/tray:flex animate-fadeIn z-50">
                <span className="text-[8px] font-mono font-bold tracking-wider text-stone-400 uppercase border-b border-stone-100 pb-1 mb-1 block">ATTACH SIMULATOR BIO-DATA</span>
                <button
                  type="button"
                  onClick={() => triggerSimulationAttachment('symptom_rash')}
                  className="p-1 px-2 hover:bg-stone-50 rounded-lg text-[10px] text-stone-700 font-extrabold text-left flex items-center gap-2 cursor-pointer"
                >
                  🩺 Skin irritation stress rash photo
                </button>
                <button
                  type="button"
                  onClick={() => triggerSimulationAttachment('blood_report')}
                  className="p-1 px-2 hover:bg-stone-50 rounded-lg text-[10px] text-stone-700 font-extrabold text-left flex items-center gap-2 cursor-pointer"
                >
                  🧪 Lab Report panel (Blood chem)
                </button>
                <button
                  type="button"
                  onClick={() => triggerSimulationAttachment('passport_expire')}
                  className="p-1 px-2 hover:bg-stone-50 rounded-lg text-[10px] text-stone-700 font-extrabold text-left flex items-center gap-2 cursor-pointer"
                >
                  🗺️ Scanned US Passport page
                </button>
                <button
                  type="button"
                  onClick={() => triggerSimulationAttachment('energy_audit')}
                  className="p-1 px-2 hover:bg-stone-50 rounded-lg text-[10px] text-stone-700 font-extrabold text-left flex items-center gap-2 cursor-pointer"
                >
                  🌱 Home heating & electric audit report
                </button>

                <div className="border-t border-stone-100 pt-2 mt-1 relative">
                  <label className="text-[8px] font-mono font-extrabold text-stone-400 block mb-1">UPLOAD OWN FILE</label>
                  <input
                    type="file"
                    onChange={handleCustomFileChange}
                    className="text-[9px] w-full cursor-pointer text-stone-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[9px] file:font-bold file:bg-stone-100 file:text-stone-700"
                  />
                </div>
              </div>
            </div>

            {/* Message input */}
            <input
              type="text"
              required
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
              placeholder="Vent your worries, ask for life advice, debug code, or ask Dr. T any question..."
              className="flex-1 bg-stone-55 border border-stone-200 rounded-xl p-2 px-3 text-xs outline-none focus:bg-white focus:border-rose-455 transition-all text-stone-850"
            />

            {/* Send button */}
            <button
              type="button"
              onClick={() => handleSend()}
              className="h-10 p-2.5 px-4 rounded-xl bg-stone-900 border border-stone-950 text-white font-black text-xs flex items-center justify-center gap-1.5 hover:bg-stone-850 active:scale-95 transition-all cursor-pointer shadow-xs select-none"
            >
              <Send className="w-3.5 h-3.5" /> <span className="hidden sm:inline">SEND</span>
            </button>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-[10px] text-stone-400 mt-2 text-center leading-normal border-t border-stone-100/50 pt-2 font-sans italic select-none">
          <p>Dr. T is an educational and decision-support platform and not a substitute for professional medical advice.</p>
          <div className="mt-2.5 flex justify-center">
            <BirthdayCelebrator textSize="text-[9px]" />
          </div>
        </div>

      </div>
    </div>
  </div>
  );
}
