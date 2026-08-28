import React, { useState, useEffect, useRef } from 'react';
import { PersonalityMode } from '../../types';
import { Mic, MicOff, Volume2, VolumeX, X, Sparkles, HeartPulse, StopCircle, RefreshCw } from 'lucide-react';

interface VoiceModeOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: (text: string) => Promise<string>;
  personality: PersonalityMode;
}

export const VoiceModeOverlay: React.FC<VoiceModeOverlayProps> = ({
  isOpen,
  onClose,
  onSendMessage,
  personality,
}) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [lastResponse, setLastResponse] = useState<string>('Hello! I am Dr. T. Tell me what is happening, and we will explore it together.');
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    // Initialize Web Speech API SpeechRecognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const resultText = event.results[current][0].transcript;
        setTranscript(resultText);

        if (event.results[current].isFinal) {
          handleUserVoiceComplete(resultText);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (synthRef.current) synthRef.current.cancel();
      if (recognitionRef.current) recognitionRef.current.abort();
    };
  }, []);

  const speakText = (text: string) => {
    if (isMuted || !synthRef.current) return;
    synthRef.current.cancel();

    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    // Pick pleasant English voice if available
    const voices = synthRef.current.getVoices();
    const naturalVoice = voices.find(v => v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.lang.startsWith('en'));
    if (naturalVoice) utterance.voice = naturalVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  const handleToggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (synthRef.current) synthRef.current.cancel();
      setIsSpeaking(false);
      setTranscript('');
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Failed to start speech recognition:', err);
        // Fallback simulation
        setIsListening(true);
        setTimeout(() => {
          const demoInput = "I've been feeling unusually tired lately in the afternoons.";
          setTranscript(demoInput);
          handleUserVoiceComplete(demoInput);
        }, 3000);
      }
    }
  };

  const handleUserVoiceComplete = async (userText: string) => {
    setIsListening(false);
    if (!userText.trim()) return;

    try {
      const response = await onSendMessage(userText);
      setLastResponse(response);
      speakText(response);
    } catch (err) {
      console.error('Voice message error:', err);
    }
  };

  const handleInterrupt = () => {
    if (synthRef.current) synthRef.current.cancel();
    setIsSpeaking(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-between p-6 sm:p-12 text-white animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="w-full max-w-4xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shadow-lg shadow-rose-500/20">
            <HeartPulse className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-black tracking-tight">Dr. T Live Voice</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/30 text-rose-300 border border-rose-500/40">
                {personality} Mode
              </span>
            </div>
            <p className="text-xs text-slate-400">Natural biomedical conversation & empathetic listening</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <button
            onClick={onClose}
            className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Central Visualizer Waveform */}
      <div className="w-full max-w-2xl flex flex-col items-center justify-center text-center space-y-8 my-auto">
        
        {/* Dynamic Orb / Waveform Visualizer */}
        <div className="relative flex items-center justify-center">
          {/* Animated Pulsing Ring Layers */}
          <div className={`absolute w-64 h-64 rounded-full transition-all duration-700 ${
            isSpeaking 
              ? 'bg-rose-500/20 scale-125 animate-ping' 
              : isListening 
                ? 'bg-cyan-500/20 scale-110 animate-pulse' 
                : 'bg-slate-800/40'
          }`} />

          <div className={`absolute w-48 h-48 rounded-full blur-xl transition-all duration-500 ${
            isSpeaking ? 'bg-rose-500/30' : isListening ? 'bg-teal-500/30' : 'bg-slate-800/30'
          }`} />

          {/* Center Orb */}
          <div className={`relative z-10 w-36 h-36 rounded-full flex flex-col items-center justify-center shadow-2xl border transition-all duration-300 ${
            isSpeaking
              ? 'bg-gradient-to-tr from-rose-600 to-pink-500 border-rose-300 shadow-rose-500/50 scale-105'
              : isListening
                ? 'bg-gradient-to-tr from-cyan-600 to-teal-500 border-cyan-300 shadow-cyan-500/50 scale-105'
                : 'bg-gradient-to-tr from-slate-900 to-slate-800 border-slate-700'
          }`}>
            {isSpeaking ? (
              <div className="flex items-center space-x-1">
                <span className="w-1.5 h-6 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-10 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-8 bg-white rounded-full animate-bounce [animation-delay:-0.4s]" />
                <span className="w-1.5 h-5 bg-white rounded-full animate-bounce" />
              </div>
            ) : isListening ? (
              <Mic className="w-10 h-10 text-white animate-pulse" />
            ) : (
              <Sparkles className="w-8 h-8 text-slate-400" />
            )}
            <span className="text-[11px] font-bold mt-2 uppercase tracking-widest text-white/90">
              {isSpeaking ? 'Speaking' : isListening ? 'Listening...' : 'Ready'}
            </span>
          </div>
        </div>

        {/* Live Subtitle Transcript & Response Box */}
        <div className="w-full p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-xl text-left space-y-3">
          {transcript && (
            <div className="text-xs text-cyan-300 font-mono flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>You: "{transcript}"</span>
            </div>
          )}
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-h-48 overflow-y-auto">
            {lastResponse}
          </p>
        </div>

      </div>

      {/* Bottom Action Controls */}
      <div className="w-full max-w-md flex items-center justify-center space-x-4">
        {isSpeaking && (
          <button
            onClick={handleInterrupt}
            className="px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold flex items-center space-x-2 transition"
          >
            <StopCircle className="w-4 h-4 text-rose-400" />
            <span>Interrupt</span>
          </button>
        )}

        <button
          onClick={handleToggleListening}
          className={`flex-1 py-4 rounded-2xl font-black text-sm flex items-center justify-center space-x-3 shadow-xl transition transform active:scale-98 ${
            isListening
              ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/30'
              : 'bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white shadow-teal-500/30'
          }`}
        >
          {isListening ? (
            <>
              <MicOff className="w-5 h-5" />
              <span>Tap to Stop Listening</span>
            </>
          ) : (
            <>
              <Mic className="w-5 h-5" />
              <span>Tap to Speak</span>
            </>
          )}
        </button>

        <button
          onClick={() => speakText(lastResponse)}
          className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition"
          title="Replay Response Audio"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
