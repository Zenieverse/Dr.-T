import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Sliders, 
  Sparkles, 
  Compass, 
  Wind, 
  Waves, 
  Info, 
  X, 
  Music, 
  Flame, 
  Feather,
  Heart
} from 'lucide-react';

interface SolfeggioTrack {
  frequency: number;
  name: string;
  emoji: string;
  benefits: string;
  color: string;
  bgGradient: string;
}

const SOLFEGGIO_TRACKS: SolfeggioTrack[] = [
  {
    frequency: 174,
    name: "174 Hz Foundation",
    emoji: "🏔️",
    benefits: "Pain relief, grounding, security, and cellular energy",
    color: "text-stone-500 border-stone-200 bg-stone-50",
    bgGradient: "from-stone-500 to-zinc-700"
  },
  {
    frequency: 396,
    name: "396 Hz Liberation",
    emoji: "🎈",
    benefits: "Releasing fear, guilt, anxiety, and subconscious blockages",
    color: "text-rose-500 border-rose-200 bg-rose-50",
    bgGradient: "from-rose-500 to-pink-600"
  },
  {
    frequency: 417,
    name: "417 Hz Change",
    emoji: "🌊",
    benefits: "Facilitating change, clearing trauma, and removing negative energy",
    color: "text-orange-500 border-orange-200 bg-orange-50",
    bgGradient: "from-orange-500 to-amber-600"
  },
  {
    frequency: 432,
    name: "432 Hz Cosmic Tuning",
    emoji: "🌌",
    benefits: "Universal harmony, deep relaxation, mental clarity, and cosmic alignment",
    color: "text-indigo-500 border-indigo-200 bg-indigo-50",
    bgGradient: "from-indigo-500 to-purple-600"
  },
  {
    frequency: 528,
    name: "528 Hz Healing Pad",
    emoji: "💚",
    benefits: "DNA repair, cellular transformation, miracles, and unconditional love",
    color: "text-emerald-500 border-emerald-200 bg-emerald-50",
    bgGradient: "from-emerald-500 to-teal-600"
  },
  {
    frequency: 639,
    name: "639 Hz Connection",
    emoji: "🤝",
    benefits: "Harmonious relationships, empathy, cellular communication, and love",
    color: "text-blue-500 border-blue-200 bg-blue-50",
    bgGradient: "from-blue-500 to-indigo-600"
  },
  {
    frequency: 741,
    name: "741 Hz Intuition",
    emoji: "🦋",
    benefits: "Solving problems, self-expression, mental cleansing, and spiritual awakening",
    color: "text-cyan-500 border-cyan-200 bg-cyan-50",
    bgGradient: "from-cyan-500 to-sky-600"
  },
  {
    frequency: 852,
    name: "852 Hz Awakening",
    emoji: "👁️",
    benefits: "Returning to spiritual order, intuition, cellular restoration, and truth",
    color: "text-violet-500 border-violet-200 bg-violet-50",
    bgGradient: "from-violet-500 to-purple-700"
  },
  {
    frequency: 963,
    name: "963 Hz Crown Source",
    emoji: "👑",
    benefits: "Pure divine connection, cosmic alignment, oneness, and state of absolute presence",
    color: "text-pink-500 border-pink-200 bg-pink-50",
    bgGradient: "from-pink-500 to-rose-600"
  }
];

const NOTE_FREQS: { [key: string]: number } = {
  'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'E3': 164.81, 'F3': 174.61, 'F#3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'B3': 246.94,
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
  'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'B5': 987.77,
  'REST': 0
};

interface SymphonyItem {
  id: string;
  composer: string;
  name: string;
  emoji: string;
  description: string;
  benefits: string;
  notes: { note: string; dur: number }[];
  tempo: number;
  color: string;
  bgGradient: string;
  instrument?: 'piano' | 'violin' | 'sine' | 'musicbox';
}

const SYMPHONIES: SymphonyItem[] = [
  {
    id: "beth_elise",
    composer: "Beethoven",
    name: "Für Elise (🎹 Piano)",
    emoji: "🎹",
    description: "The iconic, lyrical piano masterpiece. Deeply nostalgic, comforting, and restorative.",
    benefits: "Emotional balance & recall",
    tempo: 130,
    color: "text-amber-600 border-amber-200 bg-amber-50",
    bgGradient: "from-amber-500 to-orange-600",
    instrument: "piano",
    notes: [
      { note: 'E5', dur: 0.25 }, { note: 'D#5', dur: 0.25 }, { note: 'E5', dur: 0.25 }, { note: 'D#5', dur: 0.25 }, { note: 'E5', dur: 0.25 }, { note: 'B4', dur: 0.25 }, { note: 'D5', dur: 0.25 }, { note: 'C5', dur: 0.25 }, { note: 'A4', dur: 0.8 }, { note: 'REST', dur: 0.4 }
    ]
  },
  {
    id: "vivaldi_spring",
    composer: "Vivaldi",
    name: "Spring - Four Seasons (🎻 Violin)",
    emoji: "🌸",
    description: "The bright, joyful sound of spring awakening. Excellent for positive drive and clarity.",
    benefits: "High-frequency morning focus",
    tempo: 110,
    color: "text-emerald-600 border-emerald-200 bg-emerald-50",
    bgGradient: "from-emerald-500 to-teal-600",
    instrument: "violin",
    notes: [
      { note: 'E5', dur: 0.35 }, { note: 'G#5', dur: 0.18 }, { note: 'G#5', dur: 0.18 }, { note: 'G#5', dur: 0.35 }, { note: 'F#5', dur: 0.18 }, { note: 'E5', dur: 0.18 }, { note: 'B4', dur: 0.7 }, { note: 'REST', dur: 0.4 }
    ]
  },
  {
    id: "chopin_nocturne",
    composer: "Chopin",
    name: "Nocturne Op. 9 (✨ Piano)",
    emoji: "✨",
    description: "Dreamy, warm romantic piano poetry. Perfect for deep relaxation, healing, or sleeping.",
    benefits: "Deep heart opening & solace",
    tempo: 84,
    color: "text-purple-600 border-purple-200 bg-purple-50",
    bgGradient: "from-purple-500 to-indigo-600",
    instrument: "piano",
    notes: [
      { note: 'A#4', dur: 0.5 }, { note: 'G5', dur: 0.75 }, { note: 'F5', dur: 0.25 }, { note: 'G5', dur: 0.25 }, { note: 'F5', dur: 0.5 }, { note: 'D5', dur: 0.5 }, { note: 'C5', dur: 0.5 }, { note: 'A#4', dur: 0.8 }, { note: 'REST', dur: 0.6 }
    ]
  },
  {
    id: "pachelbel_canon",
    composer: "Pachelbel",
    name: "Canon in D (⛪ Music Box)",
    emoji: "🔔",
    description: "Heavenly cyclic sequence of divine geometric order. Highly soothing for active minds.",
    benefits: "Solfeggio-like cosmic order",
    tempo: 80,
    color: "text-rose-600 border-rose-200 bg-rose-50",
    bgGradient: "from-rose-500 to-pink-600",
    instrument: "musicbox",
    notes: [
      { note: 'F#5', dur: 0.5 }, { note: 'E5', dur: 0.5 }, { note: 'D5', dur: 0.5 }, { note: 'C#5', dur: 0.5 }, { note: 'B4', dur: 0.5 }, { note: 'A4', dur: 0.5 }, { note: 'B4', dur: 0.5 }, { note: 'C#5', dur: 0.5 }
    ]
  },
  {
    id: "moza_nacht",
    composer: "Mozart",
    name: "Eine kleine Nachtmusik (🎻)",
    emoji: "🌙",
    description: "The ultimate bright classical serenade. Sharp, lively, and cognitively stimulating.",
    benefits: "High spatial-temporal intelligence",
    tempo: 124,
    color: "text-sky-600 border-sky-200 bg-sky-50",
    bgGradient: "from-sky-500 to-indigo-600",
    instrument: "violin",
    notes: [
      { note: 'G4', dur: 0.4 }, { note: 'D4', dur: 0.2 }, { note: 'G4', dur: 0.4 }, { note: 'D4', dur: 0.2 }, { note: 'G4', dur: 0.2 }, { note: 'D4', dur: 0.2 }, { note: 'G4', dur: 0.2 }, { note: 'B4', dur: 0.2 }, { note: 'D5', dur: 0.6 }, { note: 'REST', dur: 0.4 }
    ]
  },
  {
    id: "beth_5",
    composer: "Beethoven",
    name: "Symphony No. 5 (⚡ Fate Motif)",
    emoji: "⚡",
    description: "The famous motif of fate knocking at the door. Uplifting, bold, and energizing.",
    benefits: "Focus & mental determination",
    tempo: 100,
    color: "text-amber-600 border-amber-200 bg-amber-50",
    bgGradient: "from-amber-500 to-orange-600",
    instrument: "sine",
    notes: [
      { note: 'G4', dur: 0.25 }, { note: 'G4', dur: 0.25 }, { note: 'G4', dur: 0.25 }, { note: 'D#4', dur: 0.9 },
      { note: 'REST', dur: 0.3 },
      { note: 'F4', dur: 0.25 }, { note: 'F4', dur: 0.25 }, { note: 'F4', dur: 0.25 }, { note: 'D4', dur: 1.0 },
      { note: 'REST', dur: 0.8 }
    ]
  },
  {
    id: "moza_40",
    composer: "Mozart",
    name: "Symphony No. 40 (🎻 Flow)",
    emoji: "🎻",
    description: "Flowing G-minor beauty. Excellent for enhancing cognitive flow and calming over-analysis.",
    benefits: "Cognitive resonance & clarity",
    tempo: 110,
    color: "text-sky-600 border-sky-200 bg-sky-50",
    bgGradient: "from-sky-500 to-indigo-600",
    instrument: "violin",
    notes: [
      { note: 'D5', dur: 0.2 }, { note: 'C#5', dur: 0.2 }, { note: 'D5', dur: 0.4 },
      { note: 'D5', dur: 0.2 }, { note: 'C#5', dur: 0.2 }, { note: 'D5', dur: 0.4 },
      { note: 'D5', dur: 0.2 }, { note: 'C#5', dur: 0.2 }, { note: 'D5', dur: 0.4 },
      { note: 'Bb4', dur: 0.6 }, { note: 'REST', dur: 0.2 },
      { note: 'C5', dur: 0.2 }, { note: 'B4', dur: 0.2 }, { note: 'C5', dur: 0.4 },
      { note: 'C5', dur: 0.2 }, { note: 'B4', dur: 0.2 }, { note: 'C5', dur: 0.4 },
      { note: 'A4', dur: 0.6 }, { note: 'REST', dur: 0.8 }
    ]
  },
  {
    id: "beth_9",
    composer: "Beethoven",
    name: "Symphony No. 9 (☀️ Ode to Joy)",
    emoji: "☀️",
    description: "The legendary anthem of hope, unity, and triumph of positive consciousness.",
    benefits: "Uplifting spirits & heart warmth",
    tempo: 120,
    color: "text-rose-600 border-rose-200 bg-rose-50",
    bgGradient: "from-rose-500 to-pink-600",
    instrument: "sine",
    notes: [
      { note: 'E4', dur: 0.35 }, { note: 'E4', dur: 0.35 }, { note: 'F4', dur: 0.35 }, { note: 'G4', dur: 0.35 },
      { note: 'G4', dur: 0.35 }, { note: 'F4', dur: 0.35 }, { note: 'E4', dur: 0.35 }, { note: 'D4', dur: 0.35 },
      { note: 'C4', dur: 0.35 }, { note: 'C4', dur: 0.35 }, { note: 'D4', dur: 0.35 }, { note: 'E4', dur: 0.35 },
      { note: 'E4', dur: 0.45 }, { note: 'D4', dur: 0.15 }, { note: 'D4', dur: 0.6 }, { note: 'REST', dur: 0.6 }
    ]
  },
  {
    id: "bach_air",
    composer: "Bach",
    name: "Air on the G String (🕯️ Calm)",
    emoji: "🕯️",
    description: "Deeply serene, slow Baroque masterpiece. Highly effective for grounding & stress reduction.",
    benefits: "Slowing heartbeat & relaxation",
    tempo: 70,
    color: "text-emerald-600 border-emerald-200 bg-emerald-50",
    bgGradient: "from-emerald-500 to-teal-600",
    instrument: "violin",
    notes: [
      { note: 'F#4', dur: 0.7 }, { note: 'REST', dur: 0.1 }, { note: 'A4', dur: 0.3 }, { note: 'D5', dur: 0.3 },
      { note: 'F#5', dur: 0.7 }, { note: 'E5', dur: 0.15 }, { note: 'D5', dur: 0.15 }, { note: 'C#5', dur: 0.3 },
      { note: 'B4', dur: 0.5 }, { note: 'A4', dur: 0.5 }, { note: 'REST', dur: 0.8 }
    ]
  }
];

interface AmbientMusicPlayerProps {
  onClose?: () => void;
  isOpen?: boolean;
  currentVibe?: string;
}

export function AmbientMusicPlayer({ onClose, isOpen = true, currentVibe = 'empathetic' }: AmbientMusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedFreq, setSelectedFreq] = useState<number>(528);
  const [masterVolume, setMasterVolume] = useState<number>(50); // percentage
  
  // Mixer channels (percentages)
  const [oscVol, setOscVol] = useState<number>(60);
  const [binauralVol, setBinauralVol] = useState<number>(40);
  const [rainVol, setRainVol] = useState<number>(25);
  const [oceanVol, setOceanVol] = useState<number>(30);
  const [droneVol, setDroneVol] = useState<number>(45);

  const [activeTab, setActiveTab] = useState<'tracks' | 'mixer' | 'about'>('tracks');
  const [presetName, setPresetName] = useState<string>('Custom');
  const [currentSymphonyId, setCurrentSymphonyId] = useState<string | null>(null);

  const sequencerTimeoutRef = useRef<number | null>(null);

  // Web Audio refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  
  // Mixer node gains
  const masterGainRef = useRef<GainNode | null>(null);
  const oscGainRef = useRef<GainNode | null>(null);
  const binauralGainRef = useRef<GainNode | null>(null);
  const rainGainRef = useRef<GainNode | null>(null);
  const oceanGainRef = useRef<GainNode | null>(null);
  const droneGainRef = useRef<GainNode | null>(null);

  // Audio Nodes (to start/stop/update)
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const binauralOscLeftRef = useRef<OscillatorNode | null>(null);
  const binauralOscRightRef = useRef<OscillatorNode | null>(null);
  const rainSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const oceanSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const droneOscsRef = useRef<OscillatorNode[]>([]);
  const droneLfoRef = useRef<OscillatorNode | null>(null);
  const oceanLfoRef = useRef<OscillatorNode | null>(null);

  // Dynamic visualizer values
  const [waveSegments, setWaveSegments] = useState<number[]>([15, 20, 18, 25, 30, 12, 10, 24, 35, 28, 15, 12, 18, 25, 15]);

  // Selected track details
  const currentTrack = SOLFEGGIO_TRACKS.find(t => t.frequency === selectedFreq) || SOLFEGGIO_TRACKS[4];

  // Random animation for visualizer wave
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setWaveSegments(prev => prev.map(val => {
          const delta = (Math.random() - 0.5) * 15;
          const masterMod = masterVolume / 100;
          return Math.min(Math.max(val + delta, 6), 55) * (0.6 + masterMod * 0.4);
        }));
      }, 120);
    } else {
      setWaveSegments([6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6]);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, masterVolume]);

  // Initialize Audio Context and Mixer nodes
  const initAudio = () => {
    if (audioCtxRef.current) return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      // Master Gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(masterVolume / 100, ctx.currentTime);
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      // Channels Gains
      const oGain = ctx.createGain();
      oGain.gain.setValueAtTime(oscVol / 100, ctx.currentTime);
      oGain.connect(masterGain);
      oscGainRef.current = oGain;

      const bGain = ctx.createGain();
      bGain.gain.setValueAtTime(binauralVol / 100, ctx.currentTime);
      bGain.connect(masterGain);
      binauralGainRef.current = bGain;

      const rGain = ctx.createGain();
      rGain.gain.setValueAtTime(rainVol / 100, ctx.currentTime);
      rGain.connect(masterGain);
      rainGainRef.current = rGain;

      const ocGain = ctx.createGain();
      ocGain.gain.setValueAtTime(oceanVol / 100, ctx.currentTime);
      ocGain.connect(masterGain);
      oceanGainRef.current = ocGain;

      const drGain = ctx.createGain();
      drGain.gain.setValueAtTime(droneVol / 100, ctx.currentTime);
      drGain.connect(masterGain);
      droneGainRef.current = drGain;

    } catch (err) {
      console.error("Failed to initialize Web Audio API:", err);
    }
  };

  // Noise generators (rain/ocean waves)
  const createNoiseBuffer = (type: 'white' | 'pink' | 'brown') => {
    if (!audioCtxRef.current) return null;
    const ctx = audioCtxRef.current;
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let lastOut = 0.0;
    // Pink noise filtering variables
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      
      if (type === 'white') {
        output[i] = white;
      } else if (type === 'pink') {
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11; // scale down
        b6 = white * 0.115926;
      } else if (type === 'brown') {
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // loss compensation
      }
    }
    return noiseBuffer;
  };

  const startConstantCarriers = () => {
    if (!audioCtxRef.current || !oscGainRef.current) return;
    const ctx = audioCtxRef.current;
    const oGain = oscGainRef.current;

    if (osc1Ref.current || osc2Ref.current) return;

    try {
      const osc1 = ctx.createOscillator();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(selectedFreq, ctx.currentTime);
      osc1.connect(oGain);
      osc1.start();
      osc1Ref.current = osc1;

      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(selectedFreq + 1.2, ctx.currentTime);
      osc2.connect(oGain);
      osc2.start();
      osc2Ref.current = osc2;
    } catch (e) {
      console.warn("Error starting constant carriers:", e);
    }
  };

  const playSymphonyMelody = () => {
    if (!audioCtxRef.current || !oscGainRef.current) return;
    const ctx = audioCtxRef.current;
    const oGain = oscGainRef.current;

    const sym = SYMPHONIES.find(s => s.id === currentSymphonyId);
    if (!sym) return;

    let noteIndex = 0;

    const playNextNote = () => {
      if (currentSymphonyId !== sym.id || !audioCtxRef.current) return;

      const noteObj = sym.notes[noteIndex];
      const frequency = NOTE_FREQS[noteObj.note];

      if (frequency && frequency > 0) {
        try {
          const osc = ctx.createOscillator();
          const noteGain = ctx.createGain();

          let oscType: OscillatorType = 'triangle';
          let attack = 0.05;
          let decay = noteObj.dur - 0.02;
          let peakVolume = 0.35;
          let needsFilter = false;
          let filterNode: BiquadFilterNode | null = null;
          let lfo: OscillatorNode | null = null;

          if (sym.instrument === 'piano') {
            oscType = 'triangle';
            attack = 0.01;
            peakVolume = 0.45;
          } else if (sym.instrument === 'violin') {
            oscType = 'sawtooth';
            attack = 0.12;
            peakVolume = 0.22;
            needsFilter = true;
          } else if (sym.instrument === 'musicbox') {
            oscType = 'sine';
            attack = 0.01;
            peakVolume = 0.5;
          }

          osc.type = oscType;
          osc.frequency.setValueAtTime(frequency, ctx.currentTime);

          if (needsFilter) {
            filterNode = ctx.createBiquadFilter();
            filterNode.type = 'lowpass';
            filterNode.frequency.setValueAtTime(1200, ctx.currentTime);
            osc.connect(filterNode);
          }

          if (sym.instrument === 'violin') {
            const lfoGain = ctx.createGain();
            lfoGain.gain.setValueAtTime(4.5, ctx.currentTime);
            lfo = ctx.createOscillator();
            lfo.frequency.setValueAtTime(6.2, ctx.currentTime);
            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);
            lfo.start();
          }

          noteGain.gain.setValueAtTime(0, ctx.currentTime);
          noteGain.gain.linearRampToValueAtTime(peakVolume, ctx.currentTime + attack);
          noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + attack + decay);

          if (filterNode) {
            filterNode.connect(noteGain);
          } else {
            osc.connect(noteGain);
          }

          noteGain.connect(oGain);
          osc.start();
          osc.stop(ctx.currentTime + noteObj.dur);

          if (lfo) {
            lfo.stop(ctx.currentTime + noteObj.dur);
          }
        } catch (e) {
          console.warn("Symphony sequencer note playback warning:", e);
        }
      }

      const durationMs = noteObj.dur * 1000;
      noteIndex = (noteIndex + 1) % sym.notes.length;

      sequencerTimeoutRef.current = window.setTimeout(playNextNote, durationMs);
    };

    if (osc1Ref.current) {
      try { osc1Ref.current.stop(); } catch(e){}
      osc1Ref.current.disconnect();
      osc1Ref.current = null;
    }
    if (osc2Ref.current) {
      try { osc2Ref.current.stop(); } catch(e){}
      osc2Ref.current.disconnect();
      osc2Ref.current = null;
    }

    playNextNote();
  };

  // Start synthesizing audio stream
  const startAudio = () => {
    // Stop any active classical masterpieces symphonies
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('stop-symphony-player'));
    }

    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const oGain = oscGainRef.current;
    const bGain = binauralGainRef.current;
    const rGain = rainGainRef.current;
    const ocGain = oceanGainRef.current;
    const drGain = droneGainRef.current;

    if (!oGain || !bGain || !rGain || !ocGain || !drGain) return;

    // 1. Solfeggio Carriers or Symphony Melodizer
    if (currentSymphonyId) {
      playSymphonyMelody();
    } else {
      startConstantCarriers();
    }

    // 2. Binaural Beats Engine (Generates true stereo beats)
    try {
      const channelMerger = ctx.createChannelMerger(2);
      
      // Left ear carrier
      const binOscL = ctx.createOscillator();
      binOscL.type = 'sine';
      binOscL.frequency.setValueAtTime(selectedFreq, ctx.currentTime);
      
      // Right ear carrier slightly detuned for Alpha (8Hz difference)
      const binOscR = ctx.createOscillator();
      binOscR.type = 'sine';
      binOscR.frequency.setValueAtTime(selectedFreq + 8, ctx.currentTime);

      // Connect L and R to stereo channels
      const gainL = ctx.createGain();
      const gainR = ctx.createGain();
      gainL.gain.value = 0.5;
      gainR.gain.value = 0.5;

      binOscL.connect(gainL).connect(channelMerger, 0, 0);
      binOscR.connect(gainR).connect(channelMerger, 0, 1);
      
      channelMerger.connect(bGain);
      
      binOscL.start();
      binOscR.start();
      
      binauralOscLeftRef.current = binOscL;
      binauralOscRightRef.current = binOscR;
    } catch (e) {
      console.warn("Error starting binaural beat generators:", e);
    }

    // 3. Relaxing Natural Rain Simulator
    try {
      const rainBuffer = createNoiseBuffer('pink');
      if (rainBuffer) {
        const source = ctx.createBufferSource();
        source.buffer = rainBuffer;
        source.loop = true;

        // Bandpass Filter to emulate downpour
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);
        filter.Q.setValueAtTime(1.5, ctx.currentTime);

        source.connect(filter).connect(rGain);
        source.start();
        rainSourceRef.current = source;
      }
    } catch (e) {
      console.warn("Error starting rain noise simulation:", e);
    }

    // 4. Meditative Ocean Waves Simulator (Modulated Noise)
    try {
      const oceanBuffer = createNoiseBuffer('brown');
      if (oceanBuffer) {
        const source = ctx.createBufferSource();
        source.buffer = oceanBuffer;
        source.loop = true;

        // Lowpass Filter for ocean depths
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(350, ctx.currentTime);
        filter.Q.setValueAtTime(1.0, ctx.currentTime);

        // LFO (Low Frequency Oscillator) to modulate waves depth
        const waveLfo = ctx.createOscillator();
        waveLfo.type = 'sine';
        waveLfo.frequency.setValueAtTime(0.08, ctx.currentTime); // very slow wave cycle (12 seconds)

        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(250, ctx.currentTime); // modulation range (250Hz)

        // Connect LFO to filter frequency
        waveLfo.connect(lfoGain).connect(filter.frequency);
        waveLfo.start();
        oceanLfoRef.current = waveLfo;

        source.connect(filter).connect(ocGain);
        source.start();
        oceanSourceRef.current = source;
      }
    } catch (e) {
      console.warn("Error starting ocean waves simulation:", e);
    }

    // 5. Warm Calming Deep Healing Drone Synth
    try {
      const numDroneOscs = 3;
      const droneOscs: OscillatorNode[] = [];
      const baseFreq = selectedFreq / 4; // 2 octaves down for deep resonance

      for (let i = 0; i < numDroneOscs; i++) {
        const dOsc = ctx.createOscillator();
        dOsc.type = 'sawtooth';
        // detune slightly for super lush chorus drone
        const detuneAmount = (i - 1) * 0.55; 
        dOsc.frequency.setValueAtTime(baseFreq + detuneAmount, ctx.currentTime);

        // Lowpass Filter to remove harsh harmonics
        const dFilter = ctx.createBiquadFilter();
        dFilter.type = 'lowpass';
        dFilter.frequency.setValueAtTime(220, ctx.currentTime);

        dOsc.connect(dFilter).connect(drGain);
        dOsc.start();
        droneOscs.push(dOsc);
      }
      droneOscsRef.current = droneOscs;
    } catch (e) {
      console.warn("Error starting deep drone synthesizer:", e);
    }

    setIsPlaying(true);
  };

  // Stop synthesis and clean up
  const stopAudioTracks = () => {
    // Stop and disconnect primary oscillators
    if (osc1Ref.current) {
      try { osc1Ref.current.stop(); } catch(e){}
      osc1Ref.current.disconnect();
      osc1Ref.current = null;
    }
    if (osc2Ref.current) {
      try { osc2Ref.current.stop(); } catch(e){}
      osc2Ref.current.disconnect();
      osc2Ref.current = null;
    }

    // Stop binaural left/right oscillators
    if (binauralOscLeftRef.current) {
      try { binauralOscLeftRef.current.stop(); } catch(e){}
      binauralOscLeftRef.current.disconnect();
      binauralOscLeftRef.current = null;
    }
    if (binauralOscRightRef.current) {
      try { binauralOscRightRef.current.stop(); } catch(e){}
      binauralOscRightRef.current.disconnect();
      binauralOscRightRef.current = null;
    }

    // Stop rain sound
    if (rainSourceRef.current) {
      try { rainSourceRef.current.stop(); } catch(e){}
      rainSourceRef.current.disconnect();
      rainSourceRef.current = null;
    }

    // Stop ocean LFO & waves
    if (oceanLfoRef.current) {
      try { oceanLfoRef.current.stop(); } catch(e){}
      oceanLfoRef.current.disconnect();
      oceanLfoRef.current = null;
    }
    if (oceanSourceRef.current) {
      try { oceanSourceRef.current.stop(); } catch(e){}
      oceanSourceRef.current.disconnect();
      oceanSourceRef.current = null;
    }

    // Stop deep drone oscillators
    if (droneOscsRef.current.length > 0) {
      droneOscsRef.current.forEach(osc => {
        try { osc.stop(); } catch(e){}
        osc.disconnect();
      });
      droneOscsRef.current = [];
    }

    if (sequencerTimeoutRef.current) {
      window.clearTimeout(sequencerTimeoutRef.current);
      sequencerTimeoutRef.current = null;
    }

    setIsPlaying(false);
  };

  // Update master volume
  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.linearRampToValueAtTime(
        masterVolume / 100,
        audioCtxRef.current.currentTime + 0.1
      );
    }
  }, [masterVolume]);

  // Update channels volume
  useEffect(() => {
    if (oscGainRef.current && audioCtxRef.current) {
      oscGainRef.current.gain.linearRampToValueAtTime(oscVol / 100, audioCtxRef.current.currentTime + 0.1);
    }
  }, [oscVol]);

  useEffect(() => {
    if (binauralGainRef.current && audioCtxRef.current) {
      binauralGainRef.current.gain.linearRampToValueAtTime(binauralVol / 100, audioCtxRef.current.currentTime + 0.1);
    }
  }, [binauralVol]);

  useEffect(() => {
    if (rainGainRef.current && audioCtxRef.current) {
      rainGainRef.current.gain.linearRampToValueAtTime(rainVol / 100, audioCtxRef.current.currentTime + 0.1);
    }
  }, [rainVol]);

  useEffect(() => {
    if (oceanGainRef.current && audioCtxRef.current) {
      oceanGainRef.current.gain.linearRampToValueAtTime(oceanVol / 100, audioCtxRef.current.currentTime + 0.1);
    }
  }, [oceanVol]);

  useEffect(() => {
    if (droneGainRef.current && audioCtxRef.current) {
      droneGainRef.current.gain.linearRampToValueAtTime(droneVol / 100, audioCtxRef.current.currentTime + 0.1);
    }
  }, [droneVol]);

  // Update Solfeggio frequency on-the-fly without stopping audio
  useEffect(() => {
    if (isPlaying && audioCtxRef.current && !currentSymphonyId) {
      const ctx = audioCtxRef.current;
      const t = ctx.currentTime;
      
      // Update carrier frequency
      if (osc1Ref.current) {
        osc1Ref.current.frequency.exponentialRampToValueAtTime(selectedFreq, t + 0.4);
      }
      if (osc2Ref.current) {
        osc2Ref.current.frequency.exponentialRampToValueAtTime(selectedFreq + 1.2, t + 0.4);
      }

      // Update binaural carriers
      if (binauralOscLeftRef.current) {
        binauralOscLeftRef.current.frequency.exponentialRampToValueAtTime(selectedFreq, t + 0.4);
      }
      if (binauralOscRightRef.current) {
        binauralOscRightRef.current.frequency.exponentialRampToValueAtTime(selectedFreq + 8, t + 0.4);
      }

      // Update deep drone synth frequency (2 octaves down)
      if (droneOscsRef.current.length > 0) {
        const baseFreq = selectedFreq / 4;
        droneOscsRef.current.forEach((osc, idx) => {
          const detuneAmount = (idx - 1) * 0.55;
          osc.frequency.exponentialRampToValueAtTime(baseFreq + detuneAmount, t + 0.6);
        });
      }
    }
  }, [selectedFreq, isPlaying, currentSymphonyId]);

  // Handle Symphony melody transition or reversion to pure frequencies
  useEffect(() => {
    if (sequencerTimeoutRef.current) {
      window.clearTimeout(sequencerTimeoutRef.current);
      sequencerTimeoutRef.current = null;
    }

    if (isPlaying) {
      if (currentSymphonyId) {
        playSymphonyMelody();
      } else {
        startConstantCarriers();
      }
    } else {
      if (osc1Ref.current) {
        try { osc1Ref.current.stop(); } catch(e){}
        osc1Ref.current.disconnect();
        osc1Ref.current = null;
      }
      if (osc2Ref.current) {
        try { osc2Ref.current.stop(); } catch(e){}
        osc2Ref.current.disconnect();
        osc2Ref.current = null;
      }
    }
  }, [currentSymphonyId, isPlaying]);

  // Handle Preset Choices
  const applyPreset = (preset: 'focus' | 'heal' | 'sleep' | 'cosmic' | 'nature' | 'silent') => {
    switch (preset) {
      case 'focus':
        setSelectedFreq(432);
        setOscVol(75);
        setBinauralVol(65);
        setRainVol(10);
        setOceanVol(15);
        setDroneVol(30);
        setPresetName('Deep Focus (432 Hz)');
        break;
      case 'heal':
        setSelectedFreq(528);
        setOscVol(60);
        setBinauralVol(50);
        setRainVol(20);
        setOceanVol(30);
        setDroneVol(65);
        setPresetName('Cellular Healing (528 Hz)');
        break;
      case 'sleep':
        setSelectedFreq(396);
        setOscVol(30);
        setBinauralVol(70);
        setRainVol(40);
        setOceanVol(60);
        setDroneVol(50);
        setPresetName('Sleep Aid & Release (396 Hz)');
        break;
      case 'cosmic':
        setSelectedFreq(963);
        setOscVol(50);
        setBinauralVol(45);
        setRainVol(5);
        setOceanVol(20);
        setDroneVol(80);
        setPresetName('Crown Consciousness (963 Hz)');
        break;
      case 'nature':
        setSelectedFreq(528);
        setOscVol(15);
        setBinauralVol(20);
        setRainVol(75);
        setOceanVol(75);
        setDroneVol(20);
        setPresetName('Nature Sanctuary (Rain & Sea)');
        break;
      case 'silent':
        setOscVol(0);
        setBinauralVol(0);
        setRainVol(0);
        setOceanVol(0);
        setDroneVol(0);
        setPresetName('Completely Silent');
        break;
    }
  };

  // Sync initial preset with current platform Vibe on open
  useEffect(() => {
    if (currentVibe === 'philosophical') {
      applyPreset('cosmic');
    } else if (currentVibe === 'empathetic') {
      applyPreset('heal');
    } else if (currentVibe === 'witty') {
      applyPreset('focus');
    } else {
      applyPreset('heal');
    }
  }, [currentVibe]);

  // Listen for external triggers to stop ambient music
  useEffect(() => {
    const handleStopAmbient = () => {
      stopAudioTracks();
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('stop-ambient-player', handleStopAmbient);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('stop-ambient-player', handleStopAmbient);
      }
    };
  }, []);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      stopAudioTracks();
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopAudioTracks();
    } else {
      startAudio();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 15, scale: 0.98 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-white/95 backdrop-blur-md rounded-3xl border border-rose-100/80 shadow-2xl overflow-hidden w-full max-w-md mx-auto z-50 flex flex-col relative"
      id="ambient-sound-player"
    >
      {/* Decorative colored glow matching selected frequency */}
      <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${currentTrack.bgGradient}`} />

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-stone-100 bg-stone-50/50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-rose-50 border border-rose-100/50 text-rose-500 animate-pulse">
            <Music className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-black text-stone-900 text-sm tracking-tight flex items-center gap-1.5">
              Dr. T's Healing Sound Bath
            </h3>
            <p className="text-[10px] text-stone-400 font-mono">Solfeggio & Binaural Synth Engine</p>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-rose-50 text-stone-600 hover:text-rose-650 border border-stone-200/60 hover:border-rose-200 text-[11px] font-extrabold uppercase tracking-wide transition-all cursor-pointer shadow-3xs flex items-center gap-1"
          id="close-sound-player"
          title="Close Player"
        >
          <X className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Close</span>
        </button>
      </div>

      {/* Audio Wave Visualizer Area */}
      <div className="p-5 flex flex-col items-center bg-stone-900 text-white relative h-40 justify-center">
        {/* Animated Background particle grid */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f43f5e_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Visualizer bars */}
        <div className="flex items-end gap-1.5 z-10 h-16 w-full justify-center max-w-[280px]">
          {waveSegments.map((h, idx) => (
            <motion.div
              key={idx}
              className={`w-1.5 rounded-full bg-gradient-to-t ${currentTrack.bgGradient} shadow-md`}
              animate={{ height: isPlaying ? `${h}px` : '4px' }}
              transition={{ type: "spring", stiffness: 350, damping: 15 }}
            />
          ))}
        </div>

        {/* Track Label */}
        <div className="z-10 text-center mt-4">
          <span className="text-[10px] font-mono tracking-widest text-rose-400/80 font-bold uppercase">
            {isPlaying ? "ACTIVELY SYNTHESIZING" : "SYSTEM PAUSED"}
          </span>
          <h4 className="text-base font-display font-bold tracking-tight text-white flex items-center justify-center gap-1.5 mt-0.5">
            <span>{currentTrack.emoji}</span> {currentTrack.name}
          </h4>
          <p className="text-[10px] text-stone-300 mt-1 max-w-[280px] mx-auto leading-relaxed line-clamp-1 italic font-medium">
            "{currentTrack.benefits}"
          </p>
        </div>
      </div>

      {/* Primary Audio Controls */}
      <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/20">
        <button
          onClick={handleTogglePlay}
          className={`flex items-center justify-center gap-2 p-3 px-6 rounded-2xl font-black text-xs tracking-wider uppercase transition-all shadow-md cursor-pointer
            ${isPlaying 
              ? 'bg-stone-800 text-white hover:bg-stone-900 border border-stone-700' 
              : 'bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white hover:opacity-95'
            }
          `}
          id="toggle-ambient-play"
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause Healing</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Start Sound Bath</span>
            </>
          )}
        </button>

        {/* Master Volume */}
        <div className="flex items-center gap-3.5 max-w-[170px] w-full bg-white hover:bg-stone-50/50 p-2.5 rounded-2xl border border-rose-200/60 shadow-xs hover:shadow-sm transition-all">
          <button 
            onClick={() => setMasterVolume(prev => prev > 0 ? 0 : 50)}
            className="p-1.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
          >
            {masterVolume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-rose-600 animate-pulse" />}
          </button>
          <div className="flex-1 flex flex-col">
            <span className="text-[9px] font-mono leading-none text-rose-600 font-black uppercase tracking-wider">MASTER VOL</span>
            <input 
              type="range"
              min="0"
              max="100"
              value={masterVolume}
              onChange={(e) => setMasterVolume(Number(e.target.value))}
              className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-rose-600 transition-all mt-1.5"
              style={{
                background: `linear-gradient(to right, #e11d48 0%, #e11d48 ${masterVolume}%, #f5f5f4 ${masterVolume}%, #f5f5f4 100%)`
              }}
            />
          </div>
          <span className="text-[11px] font-mono font-black text-rose-600 bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded-md min-w-[34px] text-center shadow-3xs">
            {masterVolume}%
          </span>
        </div>
      </div>

      {/* Tabs / Panel Selectors */}
      <div className="flex border-b border-stone-100 bg-stone-50/50">
        <button
          onClick={() => {
            setActiveTab('tracks');
            setCurrentSymphonyId(null);
          }}
          className={`flex-1 py-2.5 text-[10px] font-black tracking-wider uppercase transition-all border-b-2 cursor-pointer
            ${activeTab === 'tracks' 
              ? 'border-rose-500 text-rose-600 bg-white' 
              : 'border-transparent text-stone-400 hover:text-stone-700'
            }
          `}
        >
          🔮 Frequencies
        </button>
        <button
          onClick={() => setActiveTab('mixer')}
          className={`flex-1 py-2.5 text-[10px] font-black tracking-wider uppercase transition-all border-b-2 cursor-pointer
            ${activeTab === 'mixer' 
              ? 'border-rose-500 text-rose-600 bg-white' 
              : 'border-transparent text-stone-400 hover:text-stone-700'
            }
          `}
        >
          🎛️ Mixer Desk
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`flex-1 py-2.5 text-[10px] font-black tracking-wider uppercase transition-all border-b-2 cursor-pointer
            ${activeTab === 'about' 
              ? 'border-rose-500 text-rose-600 bg-white' 
              : 'border-transparent text-stone-400 hover:text-stone-700'
            }
          `}
        >
          📜 Lore
        </button>
      </div>

      {/* Tab Panels */}
      <div className="p-4 flex-1 overflow-y-auto max-h-[220px]">
        {activeTab === 'tracks' && (
          <div className="grid grid-cols-3 gap-1.5">
            {SOLFEGGIO_TRACKS.map((t) => (
              <button
                key={t.frequency}
                onClick={() => {
                  setSelectedFreq(t.frequency);
                  setPresetName('Custom');
                  if (!isPlaying) {
                    startAudio();
                  }
                }}
                className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-between h-20 group relative overflow-hidden cursor-pointer
                  ${selectedFreq === t.frequency 
                    ? `border-rose-400 ring-2 ring-rose-200 ${t.color}` 
                    : 'border-stone-200/70 hover:border-stone-400 hover:bg-stone-50 bg-white'
                  }
                `}
              >
                <span className="text-xl group-hover:scale-110 transition-transform">{t.emoji}</span>
                <span className="font-mono text-[10px] font-black leading-none mt-1 text-stone-700">
                  {t.frequency} Hz
                </span>
                <span className="text-[8px] font-black text-stone-400 uppercase leading-none mt-1 truncate w-full text-center">
                  {t.name.split(' ')[1]}
                </span>
                
                {selectedFreq === t.frequency && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-rose-500" />
                )}
              </button>
            ))}
          </div>
        )}

        {activeTab === 'mixer' && (
          <div className="space-y-3.5">
            {/* Quick Presets row */}
            <div className="flex flex-col gap-1.5 bg-stone-100/90 border border-stone-300 p-2.5 rounded-xl">
              <span className="text-[9px] font-mono leading-none text-stone-700 font-black uppercase tracking-wider">CALMING AMBIENT PRESETS</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {(['focus', 'heal', 'sleep', 'nature'] as const).map((pr) => {
                  const isActive = (pr === 'focus' && presetName.includes('Focus')) ||
                                   (pr === 'heal' && presetName.includes('Healing')) ||
                                   (pr === 'sleep' && presetName.includes('Sleep')) ||
                                   (pr === 'nature' && presetName.includes('Nature'));
                  return (
                    <button
                      key={pr}
                      onClick={() => applyPreset(pr)}
                      className={`p-1.5 px-3 border text-[10px] font-black transition-all capitalize cursor-pointer rounded-lg shadow-xs
                        ${isActive 
                          ? 'bg-stone-900 text-white border-stone-950 font-extrabold scale-102' 
                          : 'bg-white border-stone-300 text-stone-850 hover:text-rose-700 hover:border-rose-300 hover:bg-rose-50'
                        }
                      `}
                    >
                      {pr === 'focus' ? '🎯 focus' : pr === 'heal' ? '🧬 heal' : pr === 'sleep' ? '🌙 sleep' : '🌲 nature'}
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-stone-900 font-bold mt-1.5 flex items-center gap-1.5">
                <span>Active Configuration:</span>
                <span className="text-rose-600 font-black bg-white px-2 py-0.5 rounded border border-rose-100 shadow-2xs">{presetName}</span>
              </p>
            </div>

            {/* Mixer Channel Sliders */}
            <div className="space-y-3">
              {/* Channel 1: Primary Solfeggio Tone */}
              <div className="flex items-center gap-3.5 bg-stone-50/90 hover:bg-white border border-stone-200 hover:border-rose-300 hover:shadow-sm transition-all p-3 rounded-2xl">
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 shadow-2xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-display font-black text-stone-900 text-xs tracking-tight">Solfeggio Note</span>
                    <span className="font-mono text-[10px] font-black bg-rose-600 text-white px-2 py-0.5 rounded-md min-w-[32px] text-center shadow-3xs">
                      {oscVol}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={oscVol}
                    onChange={(e) => setOscVol(Number(e.target.value))}
                    className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-rose-600 transition-all"
                    style={{
                      background: `linear-gradient(to right, #e11d48 0%, #e11d48 ${oscVol}%, #e7e5e4 ${oscVol}%, #e7e5e4 100%)`
                    }}
                  />
                </div>
              </div>

              {/* Channel 2: Binaural Waves */}
              <div className="flex items-center gap-3.5 bg-stone-50/90 hover:bg-white border border-stone-200 hover:border-indigo-300 hover:shadow-sm transition-all p-3 rounded-2xl">
                <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 shadow-2xs">
                  <Compass className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-display font-black text-stone-900 text-xs tracking-tight">Binaural Pulse (Alpha/Theta)</span>
                    <span className="font-mono text-[10px] font-black bg-indigo-600 text-white px-2 py-0.5 rounded-md min-w-[32px] text-center shadow-3xs">
                      {binauralVol}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={binauralVol}
                    onChange={(e) => setBinauralVol(Number(e.target.value))}
                    className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-indigo-600 transition-all"
                    style={{
                      background: `linear-gradient(to right, #4f46e5 0%, #4f46e5 ${binauralVol}%, #e7e5e4 ${binauralVol}%, #e7e5e4 100%)`
                    }}
                  />
                </div>
              </div>

              {/* Channel 3: Rain Downpour */}
              <div className="flex items-center gap-3.5 bg-stone-50/90 hover:bg-white border border-stone-200 hover:border-sky-300 hover:shadow-sm transition-all p-3 rounded-2xl">
                <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-100 text-sky-600 shadow-2xs">
                  <Wind className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-display font-black text-stone-900 text-xs tracking-tight">Calming Rain Simulation</span>
                    <span className="font-mono text-[10px] font-black bg-sky-600 text-white px-2 py-0.5 rounded-md min-w-[32px] text-center shadow-3xs">
                      {rainVol}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={rainVol}
                    onChange={(e) => setRainVol(Number(e.target.value))}
                    className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-sky-600 transition-all"
                    style={{
                      background: `linear-gradient(to right, #0284c7 0%, #0284c7 ${rainVol}%, #e7e5e4 ${rainVol}%, #e7e5e4 100%)`
                    }}
                  />
                </div>
              </div>

              {/* Channel 4: Ocean Waves */}
              <div className="flex items-center gap-3.5 bg-stone-50/90 hover:bg-white border border-stone-200 hover:border-emerald-300 hover:shadow-sm transition-all p-3 rounded-2xl">
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 shadow-2xs">
                  <Waves className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-display font-black text-stone-900 text-xs tracking-tight">Ocean Shoreline (LFO Wave)</span>
                    <span className="font-mono text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-md min-w-[32px] text-center shadow-3xs">
                      {oceanVol}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={oceanVol}
                    onChange={(e) => setOceanVol(Number(e.target.value))}
                    className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-emerald-600 transition-all"
                    style={{
                      background: `linear-gradient(to right, #059669 0%, #059669 ${oceanVol}%, #e7e5e4 ${oceanVol}%, #e7e5e4 100%)`
                    }}
                  />
                </div>
              </div>

              {/* Channel 5: Deep Drone Synth */}
              <div className="flex items-center gap-3.5 bg-stone-50/90 hover:bg-white border border-stone-200 hover:border-purple-300 hover:shadow-sm transition-all p-3 rounded-2xl">
                <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 shadow-2xs">
                  <Flame className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-display font-black text-stone-900 text-xs tracking-tight">Deep Healing Cosmic Drone</span>
                    <span className="font-mono text-[10px] font-black bg-purple-600 text-white px-2 py-0.5 rounded-md min-w-[32px] text-center shadow-3xs">
                      {droneVol}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={droneVol}
                    onChange={(e) => setDroneVol(Number(e.target.value))}
                    className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-purple-600 transition-all"
                    style={{
                      background: `linear-gradient(to right, #7c3aed 0%, #7c3aed ${droneVol}%, #e7e5e4 ${droneVol}%, #e7e5e4 100%)`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-2 text-[11px] leading-relaxed text-stone-600 font-medium p-1">
            <div className="bg-rose-50 border border-rose-100/50 p-2 rounded-xl text-rose-950 font-bold mb-2 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
              <span>Calming & Healing Wisdom</span>
            </div>
            <p>
              Ancient cultures used pure frequencies to calibrate human health. These Solfeggio frequencies (like 528Hz and 432Hz) stimulate repair, bring mental quietude, and release anxiety.
            </p>
            <p>
              Our sound engine synthesizes real-time binaural waves inside your browser. Wear headphones to feel the brainwave entrainment (alpha/theta state) as a gentle rhythmic pulse.
            </p>
            <div className="border-t border-stone-100 pt-1.5 mt-1.5 flex items-center justify-between font-mono text-[9px] text-stone-400">
              <span>Client-Side Web Audio API</span>
              <span>100% Zero Delay 🧬</span>
            </div>
          </div>
        )}
      </div>

      {/* Mini indicator footer */}
      <div className="bg-stone-50 border-t border-stone-100 p-3 flex items-center justify-between gap-4">
        <span className="text-[9px] font-mono font-extrabold text-stone-400 tracking-wider flex items-center gap-1">
          <Feather className="w-3 h-3 text-stone-400" />
          <span>CURED & HEALED • LAST LEAVES CREATORS</span>
        </span>
        <button
          onClick={onClose}
          className="px-3 py-1 rounded-lg bg-stone-200/65 hover:bg-stone-300/80 text-stone-750 hover:text-stone-900 font-mono text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer border border-stone-300/40"
          id="footer-close-btn"
        >
          Close
        </button>
      </div>
    </motion.div>
  );
}
