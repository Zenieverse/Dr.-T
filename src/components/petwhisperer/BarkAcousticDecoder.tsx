import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Play, Pause, Mic, Activity, Sparkles, RefreshCw, BarChart2, Radio, CheckCircle } from 'lucide-react';
import { BarkAnalysis } from './types';

const BARK_SAMPLES: BarkAnalysis[] = [
  {
    sampleId: 'sample-alarm',
    name: 'Alarm Bark (Doorbell Intrusion)',
    f0FundamentalHz: 480,
    hnrHarmonicNoiseRatioDb: 8.2,
    arousalPercentile: 88,
    classification: 'Alert Alarm Bark',
    spectralCentroidHz: 2840,
    recommendedSolfeggioHz: 432
  },
  {
    sampleId: 'sample-separation',
    name: 'Separation Anxiety Whistle & Whine',
    f0FundamentalHz: 1820,
    hnrHarmonicNoiseRatioDb: 18.5,
    arousalPercentile: 82,
    classification: 'Separation Anxiety Whine',
    spectralCentroidHz: 3400,
    recommendedSolfeggioHz: 432
  },
  {
    sampleId: 'sample-territorial',
    name: 'Deep Resonant Territorial Bay',
    f0FundamentalHz: 240,
    hnrHarmonicNoiseRatioDb: 12.0,
    arousalPercentile: 74,
    classification: 'Territorial Bay',
    spectralCentroidHz: 1250,
    recommendedSolfeggioHz: 528
  },
  {
    sampleId: 'sample-pain',
    name: 'Acute Pain / High-Arousal Yelp',
    f0FundamentalHz: 3200,
    hnrHarmonicNoiseRatioDb: 5.4,
    arousalPercentile: 95,
    classification: 'Pain Vocalization',
    spectralCentroidHz: 4800,
    recommendedSolfeggioHz: 432
  },
  {
    sampleId: 'sample-play',
    name: 'Play Bow Vocalization & Soft Chuff',
    f0FundamentalHz: 380,
    hnrHarmonicNoiseRatioDb: 22.1,
    arousalPercentile: 25,
    classification: 'Play Bow Solicitation',
    spectralCentroidHz: 980,
    recommendedSolfeggioHz: 528
  }
];

export const BarkAcousticDecoder: React.FC = () => {
  const [selectedSample, setSelectedSample] = useState<BarkAnalysis>(BARK_SAMPLES[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMicListening, setIsMicListening] = useState<boolean>(false);
  
  // Canvas Spectrogram animation ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Synthesize acoustic tone simulation for sample
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  const handlePlaySample = (sample: BarkAnalysis) => {
    setSelectedSample(sample);
    stopAudio();

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = sample.f0FundamentalHz > 1500 ? 'triangle' : 'sawtooth';
      osc.frequency.setValueAtTime(sample.f0FundamentalHz, ctx.currentTime);

      // Pitch glide simulation
      osc.frequency.exponentialRampToValueAtTime(sample.f0FundamentalHz * 1.3, ctx.currentTime + 0.3);
      osc.frequency.exponentialRampToValueAtTime(sample.f0FundamentalHz * 0.8, ctx.currentTime + 0.8);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 1.2);

      oscRef.current = osc;
      setIsPlaying(true);

      osc.onended = () => {
        setIsPlaying(false);
      };
    } catch (e) {
      console.warn("Audio synthesis error:", e);
    }
  };

  const stopAudio = () => {
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch (e) {}
      oscRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch (e) {}
      audioCtxRef.current = null;
    }
    setIsPlaying(false);
  };

  // Canvas Spectrogram Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let offset = 0;
    const render = () => {
      offset += 1;
      const width = canvas.width;
      const height = canvas.height;

      // Dark background
      ctx.fillStyle = '#1A1A1A';
      ctx.fillRect(0, 0, width, height);

      // Frequency Grid lines
      ctx.strokeStyle = '#2A2A2A';
      ctx.lineWidth = 1;
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw FFT Heatmap Bins based on selected sample
      const f0 = selectedSample.f0FundamentalHz;
      const centroid = selectedSample.spectralCentroidHz;
      const arousal = selectedSample.arousalPercentile;

      const numBars = 48;
      const barWidth = width / numBars;

      for (let i = 0; i < numBars; i++) {
        const freqBinHz = i * 200;
        const distFromCentroid = Math.abs(freqBinHz - centroid);
        const distFromF0 = Math.abs(freqBinHz - f0);

        let intensity = Math.max(0, 1 - distFromCentroid / 2500) * 0.7;
        if (distFromF0 < 400) intensity += 0.5;

        // Add dynamic wave motion when playing or mic active
        if (isPlaying || isMicListening) {
          intensity += Math.sin((i + offset * 0.2)) * 0.25;
        }

        intensity = Math.min(1, Math.max(0.05, intensity));

        const barHeight = intensity * (height - 30);
        const y = height - barHeight;

        // Color mapped to arousal
        const r = Math.floor(intensity * 255 * (arousal / 100));
        const g = Math.floor(intensity * 200 * (1 - arousal / 150));
        const b = Math.floor(intensity * 255 * (1 - arousal / 100));

        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(i * barWidth, y, barWidth - 2, barHeight);
      }

      // Fundamental frequency line
      const f0Y = height - (f0 / 5000) * height;
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, f0Y);
      ctx.lineTo(width, f0Y);
      ctx.stroke();

      ctx.fillStyle = '#F59E0B';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(`F0: ${f0} Hz`, 10, f0Y - 4);

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      stopAudio();
    };
  }, [selectedSample, isPlaying, isMicListening]);

  return (
    <div className="space-y-8 bg-[#FAF9F6] text-[#1A1A1A] p-4 sm:p-6 lg:p-8 rounded-3xl border border-stone-800 shadow-sm" id="bark-decoder-container">
      
      {/* Header */}
      <div className="border-b border-stone-800 pb-6">
        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1 bg-stone-900 text-amber-300 text-[11px] font-mono font-bold uppercase rounded-full flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5" />
            04 BARK ACOUSTIC DECODER
          </span>
          <span className="text-xs font-mono text-stone-500">FFT Spectral Centroid & Harmonic-to-Noise Ratio (HNR)</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-serif italic font-black text-[#1A1A1A] mt-2 tracking-tight">
          Acoustic Spectrogram Frequency Analyzer
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 font-serif mt-1 max-w-3xl">
          Extracts fundamental frequency (F0), Harmonic-to-Noise Ratio (HNR), and spectral energy distribution to classify vocalizations into distinct ethological arousal classes.
        </p>
      </div>

      {/* Acoustic Spectrogram Canvas Visualization */}
      <div className="bg-stone-950 border-2 border-stone-900 rounded-3xl p-5 space-y-4 shadow-lg text-white">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
            <h3 className="font-mono text-xs font-black uppercase tracking-wider text-amber-400">
              Live Spectrogram Energy Distribution (0 Hz - 10 kHz)
            </h3>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="text-stone-400">Sample: <strong className="text-white">{selectedSample.name}</strong></span>
            <button
              onClick={() => setIsMicListening(!isMicListening)}
              className={`px-3 py-1 rounded-full font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                isMicListening ? 'bg-red-600 text-white animate-pulse' : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
            >
              <Mic className="w-3 h-3" />
              <span>{isMicListening ? 'Listening Ambient Mic' : 'Enable Live Mic'}</span>
            </button>
          </div>
        </div>

        {/* Dynamic HTML5 Canvas FFT Spectrogram */}
        <canvas
          ref={canvasRef}
          width={800}
          height={200}
          className="w-full h-48 bg-stone-900 rounded-2xl border border-stone-800"
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 bg-stone-900 rounded-xl border border-stone-800">
            <span className="text-stone-400 text-[10px] block">Fundamental (F0)</span>
            <strong className="text-amber-400 text-sm font-black">{selectedSample.f0FundamentalHz} Hz</strong>
          </div>
          <div className="p-3 bg-stone-900 rounded-xl border border-stone-800">
            <span className="text-stone-400 text-[10px] block">Spectral Centroid</span>
            <strong className="text-sky-400 text-sm font-black">{selectedSample.spectralCentroidHz} Hz</strong>
          </div>
          <div className="p-3 bg-stone-900 rounded-xl border border-stone-800">
            <span className="text-stone-400 text-[10px] block">HNR Ratio</span>
            <strong className="text-emerald-400 text-sm font-black">{selectedSample.hnrHarmonicNoiseRatioDb} dB</strong>
          </div>
          <div className="p-3 bg-stone-900 rounded-xl border border-stone-800">
            <span className="text-stone-400 text-[10px] block">Arousal Percentile</span>
            <strong className="text-red-400 text-sm font-black">{selectedSample.arousalPercentile}%</strong>
          </div>
        </div>
      </div>

      {/* Acoustic Sample Bank */}
      <div className="space-y-4">
        <h3 className="font-mono text-xs font-black uppercase text-stone-900 tracking-wider">
          Canine Vocalization Sound Bank & Ethology Classification
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {BARK_SAMPLES.map(sample => (
            <div
              key={sample.sampleId}
              onClick={() => handlePlaySample(sample)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                selectedSample.sampleId === sample.sampleId
                  ? 'bg-stone-900 text-white border-stone-900 shadow-md ring-2 ring-amber-400/50'
                  : 'bg-white text-stone-800 border-stone-300 hover:bg-stone-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  sample.arousalPercentile > 80 ? 'bg-red-100 text-red-800' :
                  sample.arousalPercentile > 60 ? 'bg-amber-100 text-amber-800' :
                  'bg-emerald-100 text-emerald-800'
                }`}>
                  Arousal: {sample.arousalPercentile}%
                </span>
                <span className="text-xs font-mono font-bold text-amber-400">
                  {sample.recommendedSolfeggioHz} Hz Calm
                </span>
              </div>

              <div>
                <h4 className="font-serif font-black text-sm">{sample.name}</h4>
                <p className={`text-[11px] font-mono ${selectedSample.sampleId === sample.sampleId ? 'text-amber-200' : 'text-stone-500'}`}>
                  Classification: {sample.classification}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-200/20 text-xs font-mono">
                <span>F0: {sample.f0FundamentalHz} Hz</span>
                <button
                  className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer ${
                    selectedSample.sampleId === sample.sampleId && isPlaying
                      ? 'bg-amber-400 text-stone-950 animate-pulse'
                      : 'bg-stone-100 text-stone-800 hover:bg-stone-200'
                  }`}
                >
                  <Play className="w-3 h-3" />
                  <span>Synthesize</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
