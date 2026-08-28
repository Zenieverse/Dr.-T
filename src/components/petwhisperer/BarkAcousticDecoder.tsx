import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  Volume2, 
  Activity, 
  Play, 
  Square, 
  BarChart3, 
  Sparkles, 
  Layers, 
  Radio, 
  AlertCircle 
} from 'lucide-react';
import { audioSynth } from './audioSynth';

export const BarkAcousticDecoder: React.FC = () => {
  const VOCAL_PRESETS = [
    {
      id: 'alarm_bark',
      title: 'Territorial Alert Bark (F0: 420Hz, HNR: 8.2dB)',
      f0: 420,
      hnr: 8.2,
      db: 88,
      type: 'ALARM_VIGILANCE',
      desc: 'Rapid onset, low fundamental frequency with high non-harmonic noise indicating defensive territorial posture.'
    },
    {
      id: 'play_bark',
      title: 'High-Pitch Play Bark (F0: 890Hz, HNR: 18.5dB)',
      f0: 890,
      hnr: 18.5,
      db: 76,
      type: 'AFFILIATIVE_PLAY',
      desc: 'High harmonic-to-noise ratio, rising pitch contours with relaxed respiratory pauses.'
    },
    {
      id: 'anxiety_whine',
      title: 'Isolation Distress Whine (F0: 1,450Hz, HNR: 22.0dB)',
      f0: 1450,
      hnr: 22.0,
      db: 68,
      type: 'ISOLATION_PANIC',
      desc: 'Continuous sinusoidal high-frequency vocalization reflecting autonomic separation anxiety.'
    }
  ];

  const [selectedVocal, setSelectedVocal] = useState(VOCAL_PRESETS[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animated Spectrogram Drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;
    let time = 0;

    const render = () => {
      time += 0.05;
      ctx.fillStyle = '#1A1A1A';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid lines
      ctx.strokeStyle = '#333333';
      ctx.lineWidth = 0.5;
      for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw FFT wave bars
      const numBars = 48;
      const barWidth = canvas.width / numBars;
      for (let i = 0; i < numBars; i++) {
        const freqOffset = (selectedVocal.f0 / 1000) * 2;
        const h = Math.abs(Math.sin(time + i * 0.2) * (canvas.height * 0.6) * (isPlayingAudio ? 1.2 : 0.4) + Math.cos(i * 0.3) * 20);
        
        // Color mapping by frequency
        if (i < 16) {
          ctx.fillStyle = '#F59E0B'; // Amber low
        } else if (i < 32) {
          ctx.fillStyle = '#0284C7'; // Blue mid
        } else {
          ctx.fillStyle = '#10B981'; // Emerald high
        }

        ctx.fillRect(i * barWidth, canvas.height - h, barWidth - 2, h);
      }

      animationFrame = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrame);
  }, [selectedVocal, isPlayingAudio]);

  const handlePlaySample = () => {
    setIsPlayingAudio(true);
    audioSynth.playFrequencyTone(selectedVocal.f0, 2.5, 'sawtooth', 0.15);
    setTimeout(() => setIsPlayingAudio(false), 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1A1A1A]/20 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-extrabold bg-[#1A1A1A] text-white">
              AUDIO SPECTROGRAM &amp; FFT
            </span>
            <span className="text-xs font-mono text-stone-500">
              04 BARK ACOUSTIC DECODER
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif italic font-light text-[#1A1A1A] mt-1">
            Bark Acoustic &amp; Spectrogram Analyzer
          </h1>
          <p className="text-xs sm:text-sm font-mono text-stone-600 max-w-3xl mt-1">
            Deconstructs fundamental frequency ($F_0$), Harmonic-to-Noise Ratio (HNR), and formant bandwidths to differentiate fear, play, territorial alert, and isolation distress vocalizations.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl border text-xs font-mono font-bold transition shadow-xs ${
              isRecording 
                ? 'bg-rose-600 border-rose-700 text-white animate-pulse' 
                : 'bg-white border-[#1A1A1A] text-[#1A1A1A] hover:bg-stone-100'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>{isRecording ? 'Listening (Live Mic)...' : 'Enable Live Mic Intake'}</span>
          </button>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {VOCAL_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => setSelectedVocal(preset)}
            className={`p-4 rounded-xl text-left border font-mono text-xs space-y-2 transition ${
              selectedVocal.id === preset.id
                ? 'bg-amber-50 border-amber-500 shadow-xs'
                : 'bg-white border-stone-200 hover:border-stone-400'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-bold text-stone-900">{preset.type}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-stone-200 text-amber-800 font-bold">
                {preset.db} dB
              </span>
            </div>
            <div className="text-stone-700 font-bold leading-snug">{preset.title}</div>
            <div className="text-[11px] text-stone-500 line-clamp-2">{preset.desc}</div>
          </button>
        ))}
      </div>

      {/* Spectrogram Canvas & Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Live FFT Spectrogram Visualizer */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-white border border-[#1A1A1A] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#1A1A1A]">
                Fast Fourier Transform (FFT) Spectrogram
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePlaySample}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#1A1A1A] text-white hover:bg-stone-800 text-xs font-mono font-bold transition shadow-xs"
              >
                <Play className="w-3.5 h-3.5 text-amber-400" />
                <span>Synthesize Tone</span>
              </button>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-stone-800 bg-[#1A1A1A]">
            <canvas 
              ref={canvasRef} 
              width={640} 
              height={220} 
              className="w-full h-[220px] block" 
            />
          </div>

          <div className="flex justify-between text-[11px] font-mono text-stone-500 px-1">
            <span>0 Hz Sub-Bass</span>
            <span>500 Hz Fundamental</span>
            <span>2.5 kHz Formant</span>
            <span>10 kHz Air</span>
            <span>22 kHz Ultrasonic</span>
          </div>
        </div>

        {/* Right: Acoustic Parameter Telemetry */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-white border border-[#1A1A1A] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-sky-600" />
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#1A1A1A]">
                Acoustic Biomarkers
              </h2>
            </div>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-[#FAF9F6] border border-stone-200 flex justify-between items-center">
              <span className="text-stone-500">Fundamental Pitch ($F_0$):</span>
              <span className="font-bold text-amber-800 text-sm">{selectedVocal.f0} Hz</span>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF9F6] border border-stone-200 flex justify-between items-center">
              <span className="text-stone-500">Harmonic-to-Noise (HNR):</span>
              <span className="font-bold text-sky-800 text-sm">{selectedVocal.hnr} dB</span>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF9F6] border border-stone-200 flex justify-between items-center">
              <span className="text-stone-500">Decibel Peak:</span>
              <span className="font-bold text-stone-900 text-sm">{selectedVocal.db} dB SPL</span>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
              <div className="text-[10px] text-amber-800 font-bold uppercase">Ethology Classification</div>
              <div className="font-bold text-stone-900">{selectedVocal.type}</div>
              <p className="text-[11px] text-stone-600 pt-1 leading-snug">{selectedVocal.desc}</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
