import React, { useEffect, useState } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Sliders, 
  Settings2, 
  Mic, 
  Sparkles,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { ReadAloudState } from '../../../types/readit';
import { ReadAloudService, TTSVoiceOption } from '../../../engine/readit/tts/readAloudService';

interface ReadAloudPlayerBarProps {
  currentPageText: string;
  fullDocText: string;
  documentTitle: string;
  currentPageNumber: number;
  totalPageCount: number;
}

export const ReadAloudPlayerBar: React.FC<ReadAloudPlayerBarProps> = ({
  currentPageText,
  fullDocText,
  documentTitle,
  currentPageNumber,
  totalPageCount,
}) => {
  const [ttsState, setTtsState] = useState<ReadAloudState>({
    isPlaying: false,
    isPaused: false,
    currentPage: currentPageNumber,
    currentChunkIndex: 0,
    totalChunks: 0,
    speed: 1.0,
    pitch: 1.0,
    voice: 'default',
    language: 'en-US',
    mode: 'page',
  });

  const [availableVoices, setAvailableVoices] = useState<TTSVoiceOption[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const tts = ReadAloudService.getInstance();

  useEffect(() => {
    const unsubscribe = tts.subscribe((newState) => {
      setTtsState(newState);
    });

    // Populate voices
    setAvailableVoices(tts.getVoices());
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        setAvailableVoices(tts.getVoices());
      };
    }

    return () => {
      unsubscribe();
    };
  }, []);

  const handlePlayToggle = () => {
    if (ttsState.isPlaying) {
      if (ttsState.isPaused) {
        tts.resume();
      } else {
        tts.pause();
      }
    } else {
      // Start reading
      const textToRead = ttsState.mode === 'full' ? fullDocText : currentPageText;
      tts.speakText(textToRead, {
        mode: ttsState.mode,
        currentPage: currentPageNumber,
      });
    }
  };

  const handleStop = () => {
    tts.stop();
  };

  const speeds = [0.75, 1.0, 1.25, 1.5, 2.0];

  return (
    <div className="bg-slate-900 text-white border-t border-slate-800 shadow-2xl px-4 py-3 select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Left: Document & Playback status with animated waveform */}
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-400 shrink-0 shadow-sm">
            <Volume2 className={`w-5 h-5 ${ttsState.isPlaying && !ttsState.isPaused ? 'animate-bounce' : ''}`} />
          </div>
          
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                Dr. T Voice Reader
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                {ttsState.mode === 'full' ? `Full Doc (${totalPageCount} pages)` : `Page ${currentPageNumber} of ${totalPageCount}`}
              </span>
            </div>
            
            <p className="text-xs text-slate-200 truncate max-w-md font-medium mt-0.5">
              {ttsState.currentlySpokenText ? (
                <span className="text-white italic">"{ttsState.currentlySpokenText}"</span>
              ) : (
                `Ready to read: ${documentTitle}`
              )}
            </p>
          </div>
        </div>

        {/* Center: Playback Controls */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => tts.prevChunk()}
            disabled={!ttsState.isPlaying}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition"
            title="Previous sentence"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={handlePlayToggle}
            className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-black flex items-center justify-center shadow-lg shadow-teal-500/30 transition transform hover:scale-105 active:scale-95"
            title={ttsState.isPlaying ? (ttsState.isPaused ? 'Resume' : 'Pause') : 'Start Read Aloud'}
          >
            {ttsState.isPlaying && !ttsState.isPaused ? (
              <Pause className="w-5 h-5 fill-slate-950" />
            ) : (
              <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
            )}
          </button>

          <button
            onClick={handleStop}
            disabled={!ttsState.isPlaying}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 disabled:opacity-30 transition"
            title="Stop Speech"
          >
            <Square className="w-4 h-4 fill-current" />
          </button>

          <button
            onClick={() => tts.nextChunk()}
            disabled={!ttsState.isPlaying}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition"
            title="Next sentence"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Speeds, Mode & Voice Settings Drawer */}
        <div className="flex items-center space-x-2 shrink-0">
          
          {/* Speed Pills */}
          <div className="hidden sm:flex items-center bg-slate-800 rounded-xl p-0.5 border border-slate-700">
            {speeds.map((spd) => (
              <button
                key={spd}
                onClick={() => tts.setSpeed(spd)}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition ${
                  ttsState.speed === spd
                    ? 'bg-teal-500 text-slate-950 shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* Mode Selector */}
          <select
            value={ttsState.mode}
            onChange={(e) => tts.setMode(e.target.value as any)}
            className="bg-slate-800 text-slate-200 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-teal-400"
          >
            <option value="page">Current Page</option>
            <option value="full">Entire Document</option>
          </select>

          {/* Settings Drawer Toggle */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-xl border transition ${
              showSettings
                ? 'bg-teal-500 text-slate-950 border-teal-400'
                : 'bg-slate-800 text-slate-400 hover:text-white border-slate-700'
            }`}
            title="Voice & Speech Settings"
          >
            <Settings2 className="w-4 h-4" />
          </button>

        </div>

      </div>

      {/* Voice & Speech Pitch Settings Panel */}
      {showSettings && (
        <div className="max-w-7xl mx-auto mt-3 pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 font-bold mb-1">Voice Profile</label>
            <select
              value={ttsState.voice}
              onChange={(e) => tts.setVoice(e.target.value)}
              className="w-full bg-slate-800 text-slate-100 border border-slate-700 rounded-xl px-3 py-1.5 text-xs focus:ring-1 focus:ring-teal-400"
            >
              <option value="default">Dr. T Intelligent Natural Voice (Recommended)</option>
              {availableVoices.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between text-slate-400 font-bold mb-1">
              <span>Voice Pitch</span>
              <span className="text-teal-400 font-mono">{ttsState.pitch.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0.6"
              max="1.4"
              step="0.1"
              value={ttsState.pitch}
              onChange={(e) => tts.setPitch(parseFloat(e.target.value))}
              className="w-full accent-teal-400 cursor-pointer"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                tts.setSpeed(1.0);
                tts.setPitch(1.0);
              }}
              className="w-full py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium border border-slate-700 text-center transition"
            >
              Reset Speech Defaults
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
