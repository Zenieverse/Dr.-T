import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Trees, CloudRain, Waves, Bell, Wind, Sparkles } from 'lucide-react';
import { ambientSound, SoundscapeType } from '../services/ambientSoundService';

export const AmbientSoundBar: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentSoundscape, setCurrentSoundscape] = useState<SoundscapeType>('forest');
  const [volume, setVolume] = useState<number>(0.4);
  const [showSelector, setShowSelector] = useState<boolean>(false);
  const [justChimed, setJustChimed] = useState<boolean>(false);

  useEffect(() => {
    const unsub = ambientSound.subscribe((playing, soundscape, vol) => {
      setIsPlaying(playing);
      setCurrentSoundscape(soundscape);
      setVolume(vol);
    });
    return unsub;
  }, []);

  const handleTogglePlay = () => {
    ambientSound.togglePlay();
  };

  const handleSelectSoundscape = (type: SoundscapeType) => {
    setCurrentSoundscape(type);
    ambientSound.play(type);
    setShowSelector(false);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    ambientSound.setVolume(v);
  };

  const handleBellChime = () => {
    ambientSound.ringTempleBell(432);
    setJustChimed(true);
    setTimeout(() => setJustChimed(false), 2000);
  };

  const soundscapes: { type: SoundscapeType; label: string; icon: React.ReactNode; desc: string }[] = [
    { type: 'forest', label: 'Canopy Breeze', icon: <Trees className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />, desc: 'Procedural wind in ancient forest leaves' },
    { type: 'rain', label: 'Gentle Rain', icon: <CloudRain className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />, desc: 'Subtle rain on wooden treehouse roof' },
    { type: 'stream', label: 'Mountain Brook', icon: <Waves className="w-4 h-4 text-blue-600 dark:text-blue-400" />, desc: 'Binaural highland freshwater stream' },
    { type: 'temple', label: 'Zen Harmonic (432Hz)', icon: <Bell className="w-4 h-4 text-amber-600 dark:text-amber-400" />, desc: 'Deep overtone singing bowl drone' },
    { type: 'silence', label: 'Pure Silence', icon: <Wind className="w-4 h-4 text-stone-500" />, desc: 'Zero background synthesis' },
  ];

  return (
    <div id="ambient-sound-bar" className="relative flex items-center gap-2 px-3 py-1.5 bg-stone-100/90 dark:bg-stone-800/90 backdrop-blur-md rounded-full border border-stone-200/80 dark:border-stone-700/80 shadow-sm text-xs text-stone-700 dark:text-stone-300">
      {/* Play/Pause toggle */}
      <button
        id="ambient-play-toggle-btn"
        onClick={handleTogglePlay}
        title={isPlaying ? 'Pause Ambient Sound' : 'Play Biophilic Ambient Sound'}
        className={`p-1.5 rounded-full transition-colors ${
          isPlaying
            ? 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700'
            : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-600'
        }`}
      >
        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 translate-x-0.5" />}
      </button>

      {/* Soundscape Selector Button */}
      <div className="relative">
        <button
          id="ambient-soundscape-picker-btn"
          onClick={() => setShowSelector(!showSelector)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/70 dark:bg-stone-900/70 border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors font-medium"
        >
          {soundscapes.find(s => s.type === currentSoundscape)?.icon}
          <span className="hidden sm:inline">{soundscapes.find(s => s.type === currentSoundscape)?.label}</span>
          <span className="text-[10px] text-stone-400">▾</span>
        </button>

        {showSelector && (
          <div className="absolute top-full mt-2 left-0 w-64 bg-white dark:bg-stone-900 rounded-xl shadow-xl border border-stone-200 dark:border-stone-700 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider px-2 py-1">
              Biophilic Soundscapes
            </div>
            <div className="space-y-1 mt-1">
              {soundscapes.map(s => (
                <button
                  key={s.type}
                  id={`soundscape-opt-${s.type}`}
                  onClick={() => handleSelectSoundscape(s.type)}
                  className={`w-full flex items-start gap-2.5 p-2 rounded-lg text-left transition-colors ${
                    currentSoundscape === s.type
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                      : 'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <div className="mt-0.5">{s.icon}</div>
                  <div>
                    <div className="font-medium text-xs">{s.label}</div>
                    <div className="text-[10px] text-stone-500 dark:text-stone-400">{s.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Volume Slider */}
      <div className="hidden md:flex items-center gap-1.5 pl-1">
        {volume === 0 ? <VolumeX className="w-3.5 h-3.5 text-stone-400" /> : <Volume2 className="w-3.5 h-3.5 text-stone-500" />}
        <input
          id="ambient-volume-slider"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="w-16 h-1 bg-stone-300 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          title={`Volume: ${Math.round(volume * 100)}%`}
        />
      </div>

      {/* Tibetan Singing Bowl Bell Chime */}
      <button
        id="ambient-bell-chime-btn"
        onClick={handleBellChime}
        title="Ring 432 Hz Mindful Singing Bowl"
        className={`flex items-center gap-1 px-2 py-1 rounded-full transition-colors ${
          justChimed
            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300'
            : 'hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-400'
        }`}
      >
        <Sparkles className="w-3 h-3 text-amber-500" />
        <span className="hidden lg:inline text-[11px]">432Hz Bell</span>
      </button>
    </div>
  );
};
