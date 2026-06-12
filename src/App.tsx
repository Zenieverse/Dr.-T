/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  Flame, 
  Heart, 
  Compass, 
  Infinity as InfinityIcon, 
  Trash2, 
  Globe, 
  RefreshCw, 
  Play, 
  Pause,
  AlertCircle,
  HelpCircle,
  CheckCircle,
  Headphones,
  User,
  Activity
} from 'lucide-react';
import { VIBES, VOICES, LANGUAGES, PRESETS } from './constants';
import { Message, DrTVibe } from './types';

const drTAvatar = "/src/assets/images/dr_t_avatar_1781184840352.jpg";

export default function App() {
  // State
  const [messages, setMessages] = useState<Message[]>([]);
  const [vibe, setVibe] = useState<DrTVibe>('empathetic');
  const [voiceName, setVoiceName] = useState<string>('Kore');
  const [language, setLanguage] = useState<string>('auto');
  
  // Real-time voice states
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [autoSpeak, setAutoSpeak] = useState<boolean>(true);
  
  // Colorful interaction & game states
  const [floatingEmojis, setFloatingEmojis] = useState<{ id: number; char: string; left: number; size: number; delay: number }[]>([]);
  const [loveLevel, setLoveLevel] = useState<number>(35);

  // Floating emoji generator helper
  const triggerEmojis = (type?: 'hug' | 'cookie' | 'tease' | 'general') => {
    let pool = ['💖', '❤️', '🌸', '✨', '🧸', '🐣', '🌼', '🍼', '🍬', '🎈'];
    if (type === 'hug') {
      pool = ['💖', '🤗', '🧸', '🥰', '💝', '✨', '🌹'];
    } else if (type === 'cookie') {
      pool = ['🍪', '🧁', '🍩', '🥛', '😋', '🍯', '🍰'];
    } else if (type === 'tease') {
      pool = ['😜', '🤪', '🌻', '🎉', '🌟', '💥', '🎈'];
    }
    
    const count = 12;
    const newItems = Array.from({ length: count }).map((_, i) => ({
      id: Date.now() + Math.random() + i,
      char: pool[Math.floor(Math.random() * pool.length)],
      left: Math.random() * 85 + 5, // percentage across screen
      size: Math.floor(Math.random() * 26) + 18, // px
      delay: Math.random() * 0.4, // delayed entrance
    }));
    setFloatingEmojis(prev => [...prev.slice(-40), ...newItems]);
  };
  const [audioError, setAudioError] = useState<string | null>(null);

  // Audio elements references
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Soundwave animation frame / heights
  const [waveHeights, setWaveHeights] = useState<number[]>(Array(16).fill(4));

  // Auto-scroll to latest response
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Handle active listening/recording animation or playback animation
  useEffect(() => {
    let interval: any;
    if (isSpeaking) {
      interval = setInterval(() => {
        setWaveHeights(Array.from({ length: 16 }, () => Math.floor(Math.random() * 28) + 6));
      }, 100);
    } else if (isRecording) {
      interval = setInterval(() => {
        setWaveHeights(Array.from({ length: 16 }, () => Math.floor(Math.random() * 18) + 4));
      }, 150);
    } else {
      setWaveHeights(Array(16).fill(4));
    }
    return () => clearInterval(interval);
  }, [isSpeaking, isRecording]);

  // Initializing Web Speech Recognition in browser
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => {
        setIsRecording(true);
        // Pause current audio speaking if any
        stopAudio();
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event);
        setIsRecording(false);
        if (event.error === 'not-allowed') {
          setAudioError('Microphone permission denied. Please allow micro access.');
        } else {
          setAudioError(`Microphone recognition issue: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript && transcript.trim() !== '') {
          await handleSend(transcript);
        }
      };

      recognitionRef.current = recognition;
    } else {
      console.warn('Speech recognition not supported in this browser.');
    }
  }, [vibe, voiceName, language, messages, autoSpeak]);

  // Update speech recognition parameters on language changes
  useEffect(() => {
    if (recognitionRef.current) {
      if (language === 'Vietnamese') recognitionRef.current.lang = 'vi-VN';
      else if (language === 'French') recognitionRef.current.lang = 'fr-FR';
      else if (language === 'Spanish') recognitionRef.current.lang = 'es-ES';
      else if (language === 'German') recognitionRef.current.lang = 'de-DE';
      else recognitionRef.current.lang = 'en-US';
    }
  }, [language]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      setAudioError('Web Speech API is not supported or accessible in this preview mode. Try using text input instead!');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      setAudioError(null);
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsSpeaking(false);
    // Remove "vocalizing" flags from messages
    setMessages(prev => prev.map(m => ({ ...m, isVoicePlaying: false })));
  };

  // Speaks out a message using Dr. T's backend speech generation
  const speakMessage = async (messageId: string, textToSpeak: string) => {
    stopAudio();
    setIsSpeaking(true);
    setAudioError(null);

    // Filter out some symbols / formatting
    const cleanedText = textToSpeak
      .replace(/[\*\_\`\-\#]/g, '') // remove markdown artifacts
      .trim();

    try {
      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, isVoicePlaying: true } : m));
      
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: cleanedText,
          voiceName: voiceName
        })
      });

      if (!response.ok) {
        const errObj = await response.json();
        throw new Error(errObj.error || 'Failed to synthesize voice.');
      }

      const data = await response.json();
      if (!data.audioBase64) {
        throw new Error('No audio synthesized from server.');
      }

      // Convert base64 audio to object URL for smooth HTML5 playback
      const audioBytes = atob(data.audioBase64);
      const arrayBuffer = new Uint8Array(audioBytes.length);
      for (let i = 0; i < audioBytes.length; i++) {
        arrayBuffer[i] = audioBytes.charCodeAt(i);
      }
      
      // Standard audio format from gemini-tts is wav / raw audio
      const audioBlob = new Blob([arrayBuffer], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setIsSpeaking(false);
        setMessages(prev => prev.map(m => m.id === messageId ? { ...m, isVoicePlaying: false } : m));
      };

      audio.onerror = (e) => {
        console.error('Audio playback error:', e);
        setAudioError('Failed playing audio. Codec or network mismatch.');
        setIsSpeaking(false);
        setMessages(prev => prev.map(m => m.id === messageId ? { ...m, isVoicePlaying: false } : m));
      };

      await audio.play();
    } catch (err: any) {
      console.error('TTS execution error:', err);
      setAudioError(`Speech synthesis error: ${err.message || err}`);
      setIsSpeaking(false);
      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, isVoicePlaying: false } : m));
    }
  };

  // Primary sending handle
  const handleSend = async (forcedText?: string) => {
    const textToSend = forcedText || '';
    if (!textToSend.trim()) return;

    setAudioError(null);
    stopAudio();

    const userMsgId = 'user-' + Date.now();
    const modelMsgId = 'model-' + Date.now();

    const newUserMsg: Message = {
      id: userMsgId,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, newUserMsg]);
    setIsThinking(true);

    try {
      // Build previous messages list context for Gemini conversation memory
      const chatHistory = [...messages, newUserMsg].map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatHistory,
          vibe: vibe,
          language: language
        })
      });

      if (!res.ok) {
        throw new Error('Dr. T’s cosmic alignment had a temporary connection hiccup.');
      }

      const configRes = await res.json();
      const replyText = configRes.reply || '... (Dr. T is smiling at you warmly)';

      const newModelMsg: Message = {
        id: modelMsgId,
        role: 'model',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, newModelMsg]);
      setIsThinking(false);
      
      // Update interactive meter & emit funny colors
      setLoveLevel(prev => Math.min(prev + 8, 100));
      triggerEmojis();

      // Speak automatically if enabled
      if (autoSpeak) {
        setTimeout(() => {
          speakMessage(modelMsgId, replyText);
        }, 100);
      }
    } catch (error: any) {
      console.error(error);
      setAudioError(error.message || 'Error interacting with Dr. T.');
      setIsThinking(false);
    }
  };

  const selectPreset = async (presetText: string, presetVibe: DrTVibe) => {
    setVibe(presetVibe);
    await handleSend(presetText);
  };

  const requestSpecialAction = async (actionType: 'hug' | 'cookie' | 'lullaby' | 'tease') => {
    let prompt = '';
    if (actionType === 'hug') {
      prompt = 'Mẹ yêu ơi, ôm con một cái thật chặt thật lâu được không ạ? Cuộc sống vội vã mệt mỏi quá mẹ nè.';
      triggerEmojis('hug');
    } else if (actionType === 'cookie') {
      prompt = 'Mẹ ơi nướng cho con một ít bánh quy ảo thơm lừng cùng vài lời khuyên tâm lý ngọt ngào nhé!';
      triggerEmojis('cookie');
    } else if (actionType === 'lullaby') {
      prompt = 'Mẹ ơi hát một câu ru ấm áp hay thầm thì kể một câu chuyện cổ tích êm đềm cho giấc ngủ của con đi mẹ!';
      triggerEmojis('general');
    } else if (actionType === 'tease') {
      prompt = 'Hehehe mẹ ơi, mắng mỏ yêu thương hoặc trêu chọc con một câu mộc mạc rôm rả để con cười vang cả nhà đi mẹ!';
      triggerEmojis('tease');
    }
    await handleSend(prompt);
  };

  const clearChat = () => {
    stopAudio();
    setMessages([]);
  };

  const currentVibeConfig = VIBES.find(v => v.id === vibe) || VIBES[0];

  const averageSpeakIntensity = isSpeaking 
    ? Math.min(Math.max((waveHeights.reduce((a, b) => a + b, 0) / waveHeights.length - 4) / 20, 0), 1) 
    : 0;

  return (
    <div className={`min-h-screen bg-[#faf8f5] font-sans text-zinc-800 flex flex-col transition-all duration-1000 bg-gradient-to-b ${currentVibeConfig.bgGradient}`}>
      
      {/* Dynamic Floating Emojis Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden select-none">
        {floatingEmojis.map((emoji) => (
          <div
            key={emoji.id}
            className="absolute bottom-0 animate-floating"
            style={{
              left: `${emoji.left}%`,
              fontSize: `${emoji.size}px`,
              animationDelay: `${emoji.delay}s`,
            }}
          >
            {emoji.char}
          </div>
        ))}
      </div>

      {/* Dynamic Background Glowing Orbs representing Dr. T's vibe state */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className={`absolute -top-40 left-1/4 w-[500px] h-[500px] rounded-full blur-[160px] opacity-15 transition-all duration-1000
          ${vibe === 'empathetic' ? 'bg-rose-400' : vibe === 'witty' ? 'bg-amber-400' : vibe === 'philosophical' ? 'bg-indigo-400' : 'bg-purple-400'}
        `}></div>
        <div className={`absolute top-1/3 -right-40 w-[400px] h-[400px] rounded-full blur-[150px] opacity-10 transition-all duration-1000
          ${vibe === 'empathetic' ? 'bg-rose-300' : vibe === 'witty' ? 'bg-amber-300' : vibe === 'philosophical' ? 'bg-indigo-300' : 'bg-purple-300'}
        `}></div>
      </div>

      {/* Main Header */}
      <header className="border-b border-rose-100 bg-white/80 backdrop-blur-md sticky top-0 z-40 px-4 py-3.5 shadow-xs">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo & Agent Tag */}
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500 bg-white
              ${vibe === 'empathetic' ? 'border-rose-300 text-rose-500 glow-rose' : 
                vibe === 'witty' ? 'border-amber-300 text-amber-500 glow-amber' : 
                vibe === 'philosophical' ? 'border-indigo-300 text-indigo-500 glow-indigo' : 
                'border-purple-300 text-purple-500 glow-purple'}
            `}>
              <InfinityIcon className="w-6 h-6 animate-pulse-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-xl sm:text-2xl tracking-wide bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 bg-clip-text text-transparent">
                  Dr. T
                </h1>
              </div>
            </div>
          </div>

          {/* Quick Voice Controls */}
          <div className="flex flex-wrap items-center gap-3 self-stretch sm:self-auto justify-end">
            
            {/* Lang Dropdown */}
            <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs shadow-xs">
              <Globe className="w-3.5 h-3.5 text-zinc-500" />
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent focus:outline-none text-zinc-700 font-bold cursor-pointer"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-white text-zinc-800">
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Voice Dropdown */}
            <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs shadow-xs">
              <Headphones className="w-3.5 h-3.5 text-zinc-500" />
              <select 
                value={voiceName} 
                onChange={(e) => setVoiceName(e.target.value)}
                className="bg-transparent focus:outline-none text-zinc-700 font-bold cursor-pointer"
              >
                {VOICES.map((v) => (
                  <option key={v.id} value={v.id} className="bg-white text-zinc-800">
                    {v.name} ({v.accent})
                  </option>
                ))}
              </select>
            </div>

            {/* TTS Auto-Speak Toggle */}
            <button 
              onClick={() => {
                setAutoSpeak(!autoSpeak);
                if (autoSpeak) stopAudio();
              }}
              className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 hover:bg-stone-50 transition-all shadow-xs cursor-pointer
                ${autoSpeak ? 'bg-rose-50 border-rose-200 text-rose-600 font-bold' : 'bg-white border-stone-200 text-zinc-500'}
              `}
              title="Automatically read aloud responses"
              id="btn-autospeak-toggle"
            >
              {autoSpeak ? <Volume2 className="w-4 h-4 text-rose-500" /> : <VolumeX className="w-4 h-4 text-zinc-400" />}
              <span className="hidden md:inline font-mono text-[10px]">AUTO-SPEAK</span>
            </button>

            {/* Clear History */}
            <button 
              onClick={clearChat}
              className="p-2 text-zinc-500 hover:text-rose-600 bg-white hover:bg-rose-50/50 border border-stone-200 hover:border-rose-300 rounded-xl transition-all shadow-xs cursor-pointer"
              title="Reset conversation state"
              id="btn-clear-chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-md w-full mx-auto p-4 flex flex-col gap-5 relative z-10 justify-center items-center">
        
        {/* Error notifications */}
        {audioError && (
          <div className="w-full p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-rose-700 text-xs animate-fadeIn shadow-xs relative">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="font-semibold">Speech Module Warning</p>
              <p className="opacity-90">{audioError}</p>
            </div>
            <button 
              onClick={() => setAudioError(null)} 
              className="text-rose-500 hover:text-rose-700 text-xs font-mono font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Main Voice Panel */}
        <div className="w-full bg-white/80 border border-rose-100 rounded-3xl p-6 shadow-md flex flex-col items-center justify-between min-h-[440px]">
          <div className="w-full text-center">
            <span className="text-zinc-500 font-mono text-[10px] tracking-widest uppercase font-bold">
              Presence Connection
            </span>
            <div className="h-4 flex justify-center items-center mt-2">
              {isThinking ? (
                <span className="text-xs text-amber-600 font-mono font-bold animate-pulse flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin text-amber-500" /> Alignment of thoughts...
                </span>
              ) : isSpeaking ? (
                <span className="text-xs text-emerald-600 font-mono font-bold animate-pulse flex items-center gap-1.5">
                  <Activity className="w-3 h-3 text-emerald-550 animate-pulse" /> Dr. T is vocalizing wisdom...
                </span>
              ) : isRecording ? (
                <span className="text-xs text-rose-550 font-mono font-bold animate-pulse-fast">
                  🎤 Listening to your warm speech...
                </span>
              ) : (
                <span className="text-xs text-zinc-450 font-mono">
                  Waiting for your spark
                </span>
              )}
            </div>
          </div>

          {/* Cosmic Orb Visual representing Dr. T's status */}
          <div className="relative my-6 flex items-center justify-center w-36 h-36">
            {/* Outer Neon Glow Halo */}
            <div className={`absolute inset-0 rounded-full blur-3xl transition-all duration-1000 opacity-55 scale-125
              ${vibe === 'empathetic' ? 'bg-gradient-to-tr from-rose-400 to-pink-400' : vibe === 'witty' ? 'bg-gradient-to-tr from-amber-300 to-yellow-400' : vibe === 'philosophical' ? 'bg-gradient-to-tr from-indigo-300 to-sky-350' : 'bg-gradient-to-tr from-purple-300 to-fuchsia-450'}
              ${isThinking ? 'animate-pulse' : ''}
            `}></div>
            
            {/* Spinning star dust ring */}
            <div className={`absolute inset-1 rounded-full border border-dashed animate-spin-slow opacity-60
              ${vibe === 'empathetic' ? 'border-rose-450/40' : vibe === 'witty' ? 'border-amber-450/40' : vibe === 'philosophical' ? 'border-indigo-455/40' : 'border-purple-450/40'}
            `}></div>

            {/* Reverse spinning star dust ring */}
            <div className={`absolute inset-4 rounded-full border border-dotted animate-spin-reverse opacity-40
              ${vibe === 'empathetic' ? 'border-pink-400/35' : vibe === 'witty' ? 'border-yellow-400/35' : vibe === 'philosophical' ? 'border-sky-400/35' : 'border-fuchsia-400/35'}
            `}></div>

            <div className={`w-28 h-28 rounded-full border overflow-hidden flex items-center justify-center transition-all duration-1000 z-10 bg-white relative
              ${vibe === 'empathetic' ? 'border-rose-300 hover:border-pink-400 ring-rose-550/10 glow-rose' : 
                vibe === 'witty' ? 'border-amber-300 hover:border-yellow-400 ring-amber-550/10 glow-amber' : 
                vibe === 'philosophical' ? 'border-indigo-300 hover:border-purple-400 ring-indigo-550/10 glow-indigo' : 
                'border-purple-300 hover:border-fuchsia-400 ring-purple-550/10 glow-purple'}
              ring-8 ring-offset-4 ring-offset-white
              ${isRecording ? 'scale-105 border-rose-400' : isSpeaking ? 'scale-110' : 'scale-100'}
            `}>
              <img 
                src={drTAvatar}
                alt="Dr. T Avatar" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover select-none pointer-events-none"
              />

              {/* Animated Dynamic Lips Sync Overlay */}
              {isSpeaking && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {/* Positioned precisely over the original avatar mouth area */}
                  <div className="absolute top-[61.5%] left-[49.5%] -translate-x-1/2 -translate-y-1/2 w-6 h-5 flex flex-col justify-center items-center">
                    {/* Upper Lip */}
                    <svg 
                      viewBox="0 0 100 40" 
                      className="w-4.5 text-rose-500 fill-current drop-shadow-xs transition-transform duration-75"
                      style={{ transform: `translateY(-${averageSpeakIntensity * 2.5}px) scaleY(${1 - averageSpeakIntensity * 0.1})` }}
                    >
                      <path d="M 0 20 Q 25 10 50 15 Q 75 10 100 20 Q 75 15 50 22 Q 25 15 0 20 Z" />
                    </svg>
                    
                    {/* Inner mouth background space */}
                    <div 
                      className="w-3 bg-rose-950 rounded-full transition-all duration-75 my-[0.5px]" 
                      style={{ height: `${averageSpeakIntensity * 4.5}px` }}
                    />
                    
                    {/* Lower Lip */}
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

            {/* Orbiting particles/energy items */}
            {isSpeaking && (
              <div className={`absolute w-full h-full rounded-full border border-dashed animate-spin transition-colors duration-1000
                ${vibe === 'empathetic' ? 'border-rose-400/50' : vibe === 'witty' ? 'border-amber-400/50' : vibe === 'philosophical' ? 'border-indigo-400/50' : 'border-purple-400/50'}
              `} style={{ animationDuration: '8s' }}></div>
            )}
          </div>

          {/* Vocal Audio Soundwave Animations */}
          <div className="w-full flex items-center justify-center gap-1 h-8 px-4 mb-4">
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

          {/* Controller Voice Hub */}
          <div className="w-full flex flex-col items-center gap-3">
            {/* Massive Nurturing Mic Trigger */}
            <button
              onClick={toggleRecording}
              disabled={isThinking}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 relative border cursor-pointer shadow-md group
                ${isRecording 
                  ? 'bg-rose-600 border-rose-500 text-white animate-pulse shadow-lg shadow-rose-600/30 grow-or-glow' 
                  : 'bg-white border-stone-200 text-rose-500 hover:text-rose-600 hover:border-rose-350 hover:bg-rose-50/40 hover:scale-105 active:scale-95 disabled:opacity-50'
                }
              `}
              title={isRecording ? "Stop recording voice" : "Talk via Mic Voice Activation"}
              id="btn-voice-mic"
            >
              {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
              
              {isRecording && (
                <span className="absolute inset-0 rounded-full border-4 border-rose-450 animate-ping opacity-70"></span>
              )}
            </button>

            {/* Dynamic Status Tagline */}
            <div className="text-center">
              <span className={`text-xs font-mono font-extrabold tracking-wider uppercase transition-colors duration-300
                ${isRecording 
                  ? 'text-rose-600'
                  : isThinking 
                    ? 'text-amber-600'
                    : isSpeaking
                      ? 'text-emerald-600'
                      : 'text-stone-500 hover:text-stone-700'
                }
              `}>
                {isRecording 
                  ? "Listening... Speak now" 
                  : isThinking 
                    ? "Pondering reply..." 
                    : isSpeaking
                      ? "Speaking out loud..."
                      : "Tap microphone to speak"}
              </span>
              <p className="text-[11px] text-stone-400 mt-1 max-w-[280px] mx-auto leading-relaxed">
                {isRecording 
                  ? "Your voice is processed automatically when you pause speaking" 
                  : "Pure voice application. Speak Vietnamese, English or French naturally."}
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Comfort Actions Station */}
        <div className="w-full bg-white/80 border border-rose-100 rounded-3xl p-5 shadow-md flex flex-col gap-3 relative overflow-hidden">
          
          {/* Background glowing soft aura */}
          <div className="absolute -right-20 -top-20 w-44 h-44 rounded-full bg-pink-500/5 blur-3xl pointer-events-none"></div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold tracking-wider text-rose-550 uppercase flex items-center gap-1.5">
              💖 Nurturing Quick-Triggers
            </span>
          </div>

          {/* Grid of fun interactive maternal triggers */}
          <div className="grid grid-cols-2 gap-2 mt-0.5 z-10">
            <button
              onClick={() => requestSpecialAction('hug')}
              className="py-2.5 px-3 rounded-xl border border-rose-200 hover:border-rose-400 bg-rose-50/50 hover:bg-rose-50 text-rose-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all duration-300 active:scale-95 cursor-pointer shadow-sm select-none group"
            >
              <span className="transition-transform duration-300 group-hover:scale-125">🤗</span> <span>Virtual Hug</span>
            </button>
            <button
              onClick={() => requestSpecialAction('cookie')}
              className="py-2.5 px-3 rounded-xl border border-amber-200 hover:border-amber-400 bg-amber-50/50 hover:bg-amber-50 text-amber-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all duration-300 active:scale-95 cursor-pointer shadow-sm select-none group"
            >
              <span className="transition-transform duration-300 group-hover:scale-125">🍪</span> <span>Sweet Treats</span>
            </button>
            <button
              onClick={() => requestSpecialAction('lullaby')}
              className="py-2.5 px-3 rounded-xl border border-purple-200 hover:border-purple-400 bg-purple-50/50 hover:bg-purple-50 text-purple-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all duration-300 active:scale-95 cursor-pointer shadow-sm select-none group"
            >
              <span className="transition-transform duration-300 group-hover:scale-125">🍼</span> <span>Lullaby Ru</span>
            </button>
            <button
              onClick={() => requestSpecialAction('tease')}
              className="py-2.5 px-3 rounded-xl border border-teal-200 hover:border-teal-400 bg-teal-50/50 hover:bg-teal-50 text-teal-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all duration-300 active:scale-95 cursor-pointer shadow-sm select-none group"
            >
              <span className="transition-transform duration-300 group-hover:scale-125">😜</span> <span>Roast/Tease Me</span>
            </button>
          </div>
        </div>

        {/* Bottom Tip */}
        <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono w-full px-1 border-t border-stone-150 pt-2.5 mt-1">
          <span className="flex items-center gap-1">
            <HelpCircle className="w-3 h-3" /> Dedicated full-conversational voice mode active
          </span>
          <span>
            Engine: Gemini 3.5 & 3.1 TTS
          </span>
        </div>

      </main>

      {/* Invisible HTML5 Audio play state container */}
      <audio className="hidden" ref={audioRef} />
    </div>
  );
}
