import React, { useState } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Square, 
  Sliders, 
  Sparkles, 
  Activity, 
  Radio, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { audioSynth } from './audioSynth';

export const AcousticWhistleStudio: React.FC = () => {
  const [frequencyKhz, setFrequencyKhz] = useState<number>(16.5);
  const [durationSec, setDurationSec] = useState<number>(2.5);
  const [waveType, setWaveType] = useState<OscillatorType>('sine');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const WHISTLE_PRESETS = [
    { name: 'Emergency Recall (High Piercing)', khz: 18.0, duration: 3.0, type: 'sine' as OscillatorType, desc: 'Ultra-high penetration for long-range outdoor emergency recall.' },
    { name: 'Attention / Focus Cue', khz: 14.5, duration: 1.5, type: 'sine' as OscillatorType, desc: 'Gentle auditory tap to break fixated stare and reset eye contact.' },
    { name: 'Boundary Proximity Warning', khz: 19.5, duration: 2.0, type: 'triangle' as OscillatorType, desc: 'Higher frequency cue indicating perimeter boundary threshold.' },
    { name: 'Calming Harmonic 432 Hz', khz: 0.432, duration: 5.0, type: 'sine' as OscillatorType, desc: 'Parasympathetic restorative frequency for de-escalating cortisol.' }
  ];

  const handlePlayTone = () => {
    if (isPlaying) {
      audioSynth.stopCurrent();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      const freqHz = frequencyKhz < 1 ? 432 : Math.round(frequencyKhz * 1000);
      audioSynth.playFrequencyTone(freqHz, durationSec, waveType, 0.25);
      setTimeout(() => {
        setIsPlaying(false);
      }, durationSec * 1000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1A1A1A]/20 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-extrabold bg-[#1A1A1A] text-white">
              WEB AUDIO API SYNTH
            </span>
            <span className="text-xs font-mono text-stone-500">
              07 ULTRASONIC &amp; CALIBRATED ACOUSTIC WHISTLE
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif italic font-light text-[#1A1A1A] mt-1">
            Ultrasonic Whistle &amp; Harmonic Studio
          </h1>
          <p className="text-xs sm:text-sm font-mono text-stone-600 max-w-3xl mt-1">
            Browser-native tone synthesis from 432 Hz harmonic de-escalation to 22.0 kHz ultrasonic canine recall with calibrated attack/decay envelopes.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-xl border border-[#1A1A1A] shadow-xs font-mono text-xs text-stone-700">
          <Radio className="w-4 h-4 text-sky-600" />
          <span>Calibrated Range: 20 Hz - 22 kHz</span>
        </div>
      </div>

      {/* Preset Cues */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {WHISTLE_PRESETS.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => {
              setFrequencyKhz(preset.khz);
              setDurationSec(preset.duration);
              setWaveType(preset.type);
            }}
            className={`p-4 rounded-xl text-left border font-mono text-xs space-y-2 transition ${
              frequencyKhz === preset.khz
                ? 'bg-amber-50 border-amber-500 shadow-xs'
                : 'bg-white border-stone-200 hover:border-stone-400'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-bold text-stone-900">{preset.name}</span>
            </div>
            <div className="text-amber-800 font-bold text-sm">
              {preset.khz < 1 ? '432 Hz' : `${preset.khz} kHz`}
            </div>
            <div className="text-[10px] text-stone-500 line-clamp-2">{preset.desc}</div>
          </button>
        ))}
      </div>

      {/* Main Synthesizer Controller */}
      <div className="p-6 rounded-2xl bg-white border border-[#1A1A1A] shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-[#1A1A1A]" />
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#1A1A1A]">
              Oscillator Parameter Controls
            </h2>
          </div>
          <span className="text-xs font-mono text-stone-500">AudioContext Status: Online</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Frequency Slider */}
          <div className="space-y-2 font-mono text-xs">
            <div className="flex justify-between text-stone-800">
              <span className="font-bold">Target Frequency:</span>
              <span className="font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {frequencyKhz < 1 ? '432 Hz (Harmonic)' : `${frequencyKhz.toFixed(1)} kHz (Ultrasonic)`}
              </span>
            </div>
            <input
              type="range"
              min="0.432"
              max="22.0"
              step="0.1"
              value={frequencyKhz}
              onChange={(e) => setFrequencyKhz(Number(e.target.value))}
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#1A1A1A]"
            />
            <div className="flex justify-between text-[10px] text-stone-400">
              <span>0.432 kHz (Human Audible)</span>
              <span>12.0 kHz</span>
              <span>22.0 kHz (Canine Ultrasonic)</span>
            </div>
          </div>

          {/* Duration & Wave Type */}
          <div className="space-y-4 font-mono text-xs">
            <div className="space-y-1">
              <div className="flex justify-between text-stone-800">
                <span className="font-bold">Emission Duration:</span>
                <span className="font-bold text-stone-900">{durationSec.toFixed(1)} Seconds</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="8.0"
                step="0.5"
                value={durationSec}
                onChange={(e) => setDurationSec(Number(e.target.value))}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#1A1A1A]"
              />
            </div>

            <div className="flex items-center space-x-2">
              <span className="font-bold text-stone-800">Waveform:</span>
              {(['sine', 'triangle', 'sawtooth'] as OscillatorType[]).map((w) => (
                <button
                  key={w}
                  onClick={() => setWaveType(w)}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase transition ${
                    waveType === w ? 'bg-[#1A1A1A] text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Play Action Button */}
        <div className="pt-2 flex justify-center">
          <button
            onClick={handlePlayTone}
            className={`w-full max-w-md py-4 px-6 rounded-xl font-mono font-bold text-sm flex items-center justify-center space-x-3 transition shadow-md ${
              isPlaying
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-[#1A1A1A] hover:bg-stone-800 text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <VolumeX className="w-5 h-5" />
                <span>Stop Tone Emission</span>
              </>
            ) : (
              <>
                <Volume2 className="w-5 h-5 text-amber-400" />
                <span>Emit {frequencyKhz < 1 ? '432 Hz Tone' : `${frequencyKhz.toFixed(1)} kHz Ultrasonic Pulse`}</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};
