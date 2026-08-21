import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Music, 
  Sparkles, 
  Info, 
  Activity, 
  Sliders, 
  Cpu, 
  Flame, 
  Compass, 
  Heart, 
  Moon, 
  Sun,
  Award,
  Mic,
  MicOff,
  Radio,
  Save,
  Trash2,
  Search,
  Shuffle,
  Repeat,
  SkipForward,
  SkipBack,
  SlidersHorizontal,
  Layers,
  Volume1,
  Headphones
} from 'lucide-react';
import { 
  ALL_SYMPHONIES, 
  NOTE_FREQS, 
  POP_CHORDS_MAP, 
  POP_BASSLINES_MAP, 
  SymphonyMasterpiece,
  SymphonyNote 
} from '../data/symphonyTracks';

// AI Actor Vocal profiles who speak the lyrics/movements
const ACTORS = [
  { id: 'broadway_diva', name: 'Aria Sterling', role: 'Broadway Diva', emoji: '🎭', voiceTone: 'Dramatic, resonant theatrical delivery', description: 'Clear theatrical resonance with expressive vibrato' },
  { id: 'shakespearean', name: 'Sir Alistair', role: 'Classical Orator', emoji: '📜', voiceTone: 'Noble, rhythmic Shakespearean cadence', description: 'Deep, stately eloquence with poetic phrasing' },
  { id: 'cyberpunk', name: 'Kira-09', role: 'Cyber Synth Host', emoji: '🤖', voiceTone: 'Crisp, digitized melodic flow', description: 'Hyper-precise robotic tempo with subtle chorus' },
  { id: 'soulful', name: 'Marcus Vance', role: 'Gospel & Soul Poet', emoji: '🎷', voiceTone: 'Warm, velvety emotional phrasing', description: 'Smooth, rich baritone with soulful inflections' },
  { id: 'gentle_mentor', name: 'Dr. T Vocal', role: 'Maternal Socratic Guide', emoji: '🌸', voiceTone: 'Gentle, comforting motherly presence', description: 'Warm, nurturing acoustic presence that heals the soul' }
];

// Licensed Vocal Idols for CoSing Duet Mode
const VOCAL_IDOLS = [
  {
    id: 'aria',
    name: 'Aria Star',
    title: 'Electropop Virtuoso',
    genre: 'Synth-Pop',
    avatar: '🌟',
    voiceTone: 'Bright, soaring crystal soprano',
    licensedTrack: 'Neon Echoes (Symphonic)',
    trackBpm: 120,
    trackKey: 'F Minor',
    lyrics: [
      "Lost in the city lights, electric in the air...",
      "Heartbeats synchronizing everywhere!",
      "Take my hand into the midnight blue...",
      "Forever dancing under neon hues!"
    ],
    description: 'Specializes in high-energy euro-dance pop and soaring vocal hooks.'
  },
  {
    id: 'julian',
    name: 'Julian Woods',
    title: 'Indie Folk Master',
    genre: 'Acoustic Folk',
    avatar: '🌲',
    voiceTone: 'Warm, organic, earthy baritone',
    licensedTrack: 'Amber Pines (Warm Duet)',
    trackBpm: 96,
    trackKey: 'C# Minor',
    lyrics: [
      "Walking down the autumn trail where rivers run slow...",
      "Watching the sunset glow, golden and low...",
      "Singing out our stories to the mountain crest...",
      "In your arms my wanderlust finds rest."
    ],
    description: 'Rich acoustic harmonics, gentle fingerpicking resonance, and comforting folk melodies.'
  },
  {
    id: 'beatrix',
    name: 'Beatrix V',
    title: 'Cyberpunk Hyperpop Star',
    genre: 'Glitch / Nu-Disco',
    avatar: '⚡',
    voiceTone: 'Punchy, autotuned hyper-modern edge',
    licensedTrack: 'Cybernetic Love Circuit',
    trackBpm: 124,
    trackKey: 'E Minor',
    lyrics: [
      "Overclocked adrenaline surging in my veins!",
      "Breaking all the physical restraints and chains!",
      "Laser focus locked onto your digital smile...",
      "Let's stay connected across the light-year mile!"
    ],
    description: 'High-octane futuristic dance tracks with crisp synthesizer arpeggios.'
  },
  {
    id: 'leo',
    name: 'Leo Fontaine',
    title: 'Neo-Soul & R&B Legend',
    genre: 'Soul / R&B',
    avatar: '🎷',
    voiceTone: 'Silky, deep, emotive velvet soul',
    licensedTrack: 'Midnight Velvet Groove',
    trackBpm: 104,
    trackKey: 'F# Minor',
    lyrics: [
      "Underneath the velvet moon, sweet melodies start to bloom...",
      "Feel the baseline vibrating in the room...",
      "Every note we share is painted in gold...",
      "The greatest love song that was ever told."
    ],
    description: 'Intimate slow jams with lush 9th chords and soulful vocal runs.'
  }
];

const CATEGORIES = [
  { id: 'all', label: 'All 35+ Masterpieces', emoji: '🎼', count: ALL_SYMPHONIES.length },
  { id: 'mozart', label: 'Mozart (7)', emoji: '🎻', count: ALL_SYMPHONIES.filter(s => s.subCategory === 'mozart').length },
  { id: 'beethoven', label: 'Beethoven (6)', emoji: '⚡', count: ALL_SYMPHONIES.filter(s => s.subCategory === 'beethoven').length },
  { id: 'baroque', label: 'Bach & Vivaldi (9)', emoji: '🌿', count: ALL_SYMPHONIES.filter(s => s.subCategory === 'baroque').length },
  { id: 'romantic', label: 'Romantic & Ballet (10)', emoji: '🌙', count: ALL_SYMPHONIES.filter(s => s.subCategory === 'romantic' || s.subCategory === 'impressionist').length },
  { id: 'pop_modern', label: 'Pop & Modern Hits (12)', emoji: '✨', count: ALL_SYMPHONIES.filter(s => s.subCategory === 'pop_modern').length }
];

const INSTRUMENTS = [
  { id: 'piano', label: 'Concert Grand', icon: '🎹', desc: 'Harmonic acoustic grand piano with natural soundboard decay' },
  { id: 'violin', label: 'Solo Violin', icon: '🎻', desc: 'Expressive bowed string with subtle warm vibrato' },
  { id: 'flute', label: 'Silver Flute', icon: '🕊️', desc: 'Breathy, lyrical woodwind with pure high-order overtones' },
  { id: 'cello', label: 'Warm Cello', icon: '🎻', desc: 'Deep, resonant acoustic body vibrating in chest frequencies' },
  { id: 'synth', label: 'Analog Synth', icon: '⚡', desc: 'Lush detuned polyphonic saw/square synth pad' }
];

// Interactive keyboard key definition (2 full octaves: C3 to B4 + C5)
const KEYBOARD_KEYS = [
  { note: 'C3', label: 'C3', isSharp: false },
  { note: 'C#3', label: 'C#3', isSharp: true },
  { note: 'D3', label: 'D3', isSharp: false },
  { note: 'D#3', label: 'D#3', isSharp: true },
  { note: 'E3', label: 'E3', isSharp: false },
  { note: 'F3', label: 'F3', isSharp: false },
  { note: 'F#3', label: 'F#3', isSharp: true },
  { note: 'G3', label: 'G3', isSharp: false },
  { note: 'G#3', label: 'G#3', isSharp: true },
  { note: 'A3', label: 'A3', isSharp: false },
  { note: 'A#3', label: 'A#3', isSharp: true },
  { note: 'B3', label: 'B3', isSharp: false },
  { note: 'C4', label: 'C4', isSharp: false },
  { note: 'C#4', label: 'C#4', isSharp: true },
  { note: 'D4', label: 'D4', isSharp: false },
  { note: 'D#4', label: 'D#4', isSharp: true },
  { note: 'E4', label: 'E4', isSharp: false },
  { note: 'F4', label: 'F4', isSharp: false },
  { note: 'F#4', label: 'F#4', isSharp: true },
  { note: 'G4', label: 'G4', isSharp: false },
  { note: 'G#4', label: 'G#4', isSharp: true },
  { note: 'A4', label: 'A4', isSharp: false },
  { note: 'A#4', label: 'A#4', isSharp: true },
  { note: 'B4', label: 'B4', isSharp: false },
  { note: 'C5', label: 'C5', isSharp: false }
];

function getVoiceForActor(actor: typeof ACTORS[0], voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;
  const preferredKeywords: Record<string, string[]> = {
    broadway_diva: ['victoria', 'samantha', 'karen', 'female', 'f'],
    shakespearean: ['george', 'oliver', 'daniel', 'male', 'm', 'en-gb'],
    cyberpunk: ['zira', 'hazel', 'robot', 'synthetic', 'en-us'],
    soulful: ['david', 'alex', 'fred', 'male', 'm'],
    gentle_mentor: ['katherine', 'serena', 'samantha', 'female']
  };
  const keywords = preferredKeywords[actor.id] || ['female', 'en'];
  for (const keyword of keywords) {
    const match = voices.find(v => 
      v.name.toLowerCase().includes(keyword.toLowerCase()) || 
      v.lang.toLowerCase().includes(keyword.toLowerCase())
    );
    if (match) return match;
  }
  const englishVoices = voices.filter(v => v.lang.startsWith('en'));
  if (englishVoices.length > 0) {
    return englishVoices[0];
  }
  return voices[0] || null;
}

export function SymphonyConcertHall() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentSymphony, setCurrentSymphony] = useState<SymphonyMasterpiece>(ALL_SYMPHONIES[0]);
  const [activeInstrument, setActiveInstrument] = useState<'piano' | 'violin' | 'flute' | 'cello' | 'synth'>('violin');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Playback modes
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isLoop, setIsLoop] = useState<boolean>(true);
  const [autoAdvance, setAutoAdvance] = useState<boolean>(true);
  const [spokenNarration, setSpokenNarration] = useState<boolean>(true);

  // Real Actor speech voices and lyric tracking
  const [selectedActorId, setSelectedActorId] = useState<string>('broadway_diva');
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [activeLyricIndex, setActiveLyricIndex] = useState<number>(0);

  // High-visibility stand-out master volume UX
  const [masterVolume, setMasterVolume] = useState<number>(75);
  const [tempoMultiplier, setTempoMultiplier] = useState<number>(1.0);
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [performanceLog, setPerformanceLog] = useState<{ time: string; note: string; hz: number; isManual: boolean }[]>([]);
  const [visualBars, setVisualBars] = useState<number[]>(Array(24).fill(10));

  // Right Panel display toggles
  const [rightPanelTab, setRightPanelTab] = useState<'orchestra' | 'cosing'>('orchestra');

  // CoSing AI Social Vocal states
  const [selectedIdolId, setSelectedIdolId] = useState<string>('aria');
  const [isMicActive, setIsMicActive] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [micLevel, setMicLevel] = useState<number>(0);
  const [effects, setEffects] = useState({
    reverb: true,
    autoTune: true,
    aiHarmony: true,
    saturation: false
  });
  const [mixerTracks, setMixerTracks] = useState({
    melody: true,
    chords: true,
    bass: true,
    drums: true
  });
  const [lyricsIndex, setLyricsIndex] = useState<number>(0);
  const [savedDuets, setSavedDuets] = useState<{ id: string; date: string; idolName: string; trackName: string; rating: number }[]>([
    { id: '1', date: '2026-07-04 18:30', idolName: 'Aria Star', trackName: 'Eine kleine Nachtmusik (Aria Vocal Duet)', rating: 5 },
    { id: '2', date: '2026-07-05 00:15', idolName: 'Julian Woods', trackName: 'Moonlight Sonata (Acoustic Folk Fusion)', rating: 5 }
  ]);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const synthGainRef = useRef<GainNode | null>(null);
  const sequencerTimeoutRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lyricsIntervalRef = useRef<number | null>(null);
  const micIntervalRef = useRef<number | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const isPlayingRef = useRef<boolean>(false);

  // Keep isPlayingRef in sync
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Filtered tracks based on category and search query
  const filteredTracks = ALL_SYMPHONIES.filter(track => {
    const matchesCategory = 
      selectedCategory === 'all' ? true :
      selectedCategory === 'mozart' ? track.subCategory === 'mozart' :
      selectedCategory === 'beethoven' ? track.subCategory === 'beethoven' :
      selectedCategory === 'baroque' ? track.subCategory === 'baroque' :
      selectedCategory === 'romantic' ? (track.subCategory === 'romantic' || track.subCategory === 'impressionist') :
      selectedCategory === 'pop_modern' ? track.subCategory === 'pop_modern' : true;

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      track.name.toLowerCase().includes(query) ||
      track.composer.toLowerCase().includes(query) ||
      track.description.toLowerCase().includes(query) ||
      track.benefits.toLowerCase().includes(query) ||
      (track.opus && track.opus.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  // Fetch system SpeechSynthesis voices dynamically
  useEffect(() => {
    const loadVoices = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const v = window.speechSynthesis.getVoices();
        if (v && v.length > 0) {
          setAvailableVoices(v);
        }
      }
    };
    loadVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Initialize Audio Context on demand
  const initAudio = () => {
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      return audioCtxRef.current;
    }
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(masterVolume / 100, ctx.currentTime);
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      const synthGain = ctx.createGain();
      synthGain.gain.setValueAtTime(0.85, ctx.currentTime);
      synthGain.connect(masterGain);
      synthGainRef.current = synthGain;

      return ctx;
    } catch (err) {
      console.error("Web Audio initialization failure in SymphonyConcertHall:", err);
      return null;
    }
  };

  // Synchronize Master Volume
  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.linearRampToValueAtTime(
        masterVolume / 100, 
        audioCtxRef.current.currentTime + 0.05
      );
    }
  }, [masterVolume]);

  // Set default instrument when symphony changes
  useEffect(() => {
    if (currentSymphony.defaultInstrument) {
      setActiveInstrument(currentSymphony.defaultInstrument);
    }
  }, [currentSymphony]);

  // Multi-instrument Physical Modeling Synthesis
  const playInstrumentMelodyNote = (
    ctx: AudioContext, 
    time: number, 
    freq: number, 
    durationSec: number, 
    instrument: 'piano' | 'violin' | 'flute' | 'cello' | 'synth'
  ) => {
    if (!mixerTracks.melody || freq <= 0) return;
    try {
      const mainGain = ctx.createGain();
      mainGain.connect(synthGainRef.current || masterGainRef.current || ctx.destination);

      if (instrument === 'piano') {
        // Acoustic Piano: Dual triangle oscillators with fast percussive attack & exponential soundboard decay
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.type = 'triangle';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(freq, time);
        osc2.frequency.setValueAtTime(freq * 2, time); // 2nd harmonic overtone

        const noteGain = ctx.createGain();
        noteGain.gain.setValueAtTime(0.001, time);
        noteGain.gain.linearRampToValueAtTime(0.35, time + 0.015);
        noteGain.gain.exponentialRampToValueAtTime(0.18, time + 0.12);
        noteGain.gain.exponentialRampToValueAtTime(0.001, time + durationSec);

        osc1.connect(noteGain);
        osc2.connect(noteGain);
        noteGain.connect(mainGain);

        osc1.start(time);
        osc2.start(time);
        osc1.stop(time + durationSec);
        osc2.stop(time + durationSec);

      } else if (instrument === 'violin') {
        // Solo Violin: Sawtooth + subtle square with smooth bowed attack, vibrato LFO (5.5 Hz) and resonant filter
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, time);

        // Vibrato LFO
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(5.5, time); // 5.5 Hz classical vibrato
        lfoGain.gain.setValueAtTime(freq * 0.018, time); // ±1.8% pitch wobble
        lfo.connect(osc.frequency);
        lfo.start(time + 0.08);
        lfo.stop(time + durationSec);

        // Warm violin body filter
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2200, time);
        filter.Q.setValueAtTime(3.0, time);

        const noteGain = ctx.createGain();
        noteGain.gain.setValueAtTime(0.001, time);
        noteGain.gain.linearRampToValueAtTime(0.28, time + 0.06); // smooth bow onset
        noteGain.gain.setValueAtTime(0.24, time + durationSec * 0.7);
        noteGain.gain.exponentialRampToValueAtTime(0.001, time + durationSec);

        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(mainGain);

        osc.start(time);
        osc.stop(time + durationSec);

      } else if (instrument === 'flute') {
        // Silver Flute: Pure sine + gentle triangle with soft breath envelope
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(3500, time);

        const noteGain = ctx.createGain();
        noteGain.gain.setValueAtTime(0.001, time);
        noteGain.gain.linearRampToValueAtTime(0.32, time + 0.04);
        noteGain.gain.setValueAtTime(0.28, time + durationSec * 0.8);
        noteGain.gain.exponentialRampToValueAtTime(0.001, time + durationSec);

        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(mainGain);

        osc.start(time);
        osc.stop(time + durationSec);

      } else if (instrument === 'cello') {
        // Warm Cello: Rich low-register sawtooth with deep resonance (450 Hz)
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, time);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, time);
        filter.Q.setValueAtTime(4.0, time);

        const noteGain = ctx.createGain();
        noteGain.gain.setValueAtTime(0.001, time);
        noteGain.gain.linearRampToValueAtTime(0.30, time + 0.08);
        noteGain.gain.exponentialRampToValueAtTime(0.001, time + durationSec * 1.1);

        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(mainGain);

        osc.start(time);
        osc.stop(time + durationSec * 1.1);

      } else {
        // Analog Synth: Dual detuned sawtooth with cutoff filter sweep
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.type = 'sawtooth';
        osc2.type = 'sawtooth';
        osc1.frequency.setValueAtTime(freq, time);
        osc2.frequency.setValueAtTime(freq * 1.004, time); // detune

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2500, time);
        filter.frequency.exponentialRampToValueAtTime(800, time + durationSec);

        const noteGain = ctx.createGain();
        noteGain.gain.setValueAtTime(0.001, time);
        noteGain.gain.linearRampToValueAtTime(0.25, time + 0.02);
        noteGain.gain.exponentialRampToValueAtTime(0.001, time + durationSec);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(mainGain);

        osc1.start(time);
        osc2.start(time);
        osc1.stop(time + durationSec);
        osc2.stop(time + durationSec);
      }
    } catch (e) {
      // Audio node cleanup safeguard
    }
  };

  // Backing Harmony Pad Synthesis
  const playChordPad = (ctx: AudioContext, time: number, chord: string[], durationSec: number) => {
    if (!mixerTracks.chords || !chord || chord.length === 0) return;
    try {
      chord.forEach((noteName) => {
        const freq = NOTE_FREQS[noteName];
        if (!freq || freq <= 0) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, time);

        gain.gain.setValueAtTime(0.001, time);
        gain.gain.linearRampToValueAtTime(0.08, time + 0.15); // gentle swell
        gain.gain.setValueAtTime(0.07, time + durationSec * 0.8);
        gain.gain.exponentialRampToValueAtTime(0.001, time + durationSec);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGainRef.current || ctx.destination);

        osc.start(time);
        osc.stop(time + durationSec);
      });
    } catch (e) {
      // ignore
    }
  };

  // Bassline Root Note Synthesis
  const playBassNote = (ctx: AudioContext, time: number, freq: number, durationSec: number) => {
    if (!mixerTracks.bass || freq <= 0) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, time);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(0.18, time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, time + durationSec);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGainRef.current || ctx.destination);

      osc.start(time);
      osc.stop(time + durationSec);
    } catch (e) {
      // ignore
    }
  };

  // Drum synthesis for pop tracks and lively classical allegros
  const playKick = (ctx: AudioContext, time: number) => {
    if (!mixerTracks.drums) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(masterGainRef.current || ctx.destination);

      osc.frequency.setValueAtTime(140, time);
      osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.18);

      gain.gain.setValueAtTime(0.5, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

      osc.start(time);
      osc.stop(time + 0.18);
    } catch (e) {
      // ignore
    }
  };

  const playSnare = (ctx: AudioContext, time: number) => {
    if (!mixerTracks.drums) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, time);
      osc.frequency.exponentialRampToValueAtTime(60, time + 0.1);

      gain.gain.setValueAtTime(0.18, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

      osc.connect(gain);
      gain.connect(masterGainRef.current || ctx.destination);

      osc.start(time);
      osc.stop(time + 0.1);
    } catch (e) {
      // ignore
    }
  };

  const playHiHat = (ctx: AudioContext, time: number) => {
    if (!mixerTracks.drums) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(6000, time);

      gain.gain.setValueAtTime(0.04, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

      osc.connect(gain);
      gain.connect(masterGainRef.current || ctx.destination);

      osc.start(time);
      osc.stop(time + 0.05);
    } catch (e) {
      // ignore
    }
  };

  // Manual interactive key trigger
  const playSynthesizedNote = (note: string, durationSec = 0.5, isManual = true) => {
    const ctx = initAudio();
    if (!ctx) return;
    if (isManual && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('stop-ambient-player'));
    }
    const freq = NOTE_FREQS[note] || 0;
    
    // Play on active instrument
    playInstrumentMelodyNote(ctx, ctx.currentTime, freq, durationSec, activeInstrument);

    // Update interactive visual UI state
    setActiveNote(note);
    
    // Update performance log tracker
    const nowStr = new Date().toLocaleTimeString('en-US', { hour12: false, minute: '2-digit', second: '2-digit' });
    setPerformanceLog(prev => [
      { time: nowStr, note, hz: Math.round(freq), isManual },
      ...prev.slice(0, 19)
    ]);

    // Handle auto-clearing note visual state
    setTimeout(() => {
      setActiveNote(prev => prev === note ? null : prev);
    }, durationSec * 1000 - 30);
  };

  // Core sequence runner: Plays note-by-note melodic progression, chords, basslines & spoken lyrics
  const runSequence = (symphonyToPlay: SymphonyMasterpiece) => {
    if (sequencerTimeoutRef.current) {
      window.clearTimeout(sequencerTimeoutRef.current);
      sequencerTimeoutRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    let noteIdx = 0;
    let lyricIdx = 0;
    let stepCounter = 0;
    const notesArray = symphonyToPlay.notes;
    const lyricsArray = symphonyToPlay.lyrics || [];

    const bpm = symphonyToPlay.tempo || 120;
    // Calculate base beat duration in seconds, scaled by user tempo multiplier
    const beatDurationSec = (60 / bpm) / tempoMultiplier;

    const executeStep = () => {
      if (!isPlayingRef.current) return;

      const ctx = audioCtxRef.current;
      if (!ctx) return;

      // 1. Play melodic note
      const currentNoteObj = notesArray[noteIdx];
      if (currentNoteObj) {
        const noteDurSec = (currentNoteObj.dur * beatDurationSec);
        const freq = NOTE_FREQS[currentNoteObj.note] || 0;

        if (freq > 0) {
          playInstrumentMelodyNote(ctx, ctx.currentTime, freq, noteDurSec * 0.92, activeInstrument);
          setActiveNote(currentNoteObj.note);

          const nowStr = new Date().toLocaleTimeString('en-US', { hour12: false, minute: '2-digit', second: '2-digit' });
          setPerformanceLog(prev => [
            { time: nowStr, note: currentNoteObj.note, hz: Math.round(freq), isManual: false },
            ...prev.slice(0, 19)
          ]);
        }
      }

      // 2. Play backing chords & bassline based on step count
      const barIndex = Math.floor(stepCounter / 4) % 4;
      const chords = symphonyToPlay.chords || [['C3', 'E3', 'G3'], ['G2', 'B2', 'D3'], ['A2', 'C3', 'E3'], ['F2', 'A2', 'C3']];
      const currentChord = chords[barIndex] || chords[0];
      const bassline = symphonyToPlay.bassline || ['C2', 'G1', 'A1', 'F1'];
      const bassNoteName = bassline[barIndex] || 'C2';
      const bassFreq = NOTE_FREQS[bassNoteName] || 65.4;

      // Downbeat chord pad & bass trigger (every 4 beats)
      if (stepCounter % 4 === 0) {
        playChordPad(ctx, ctx.currentTime, currentChord, beatDurationSec * 3.8);
        playBassNote(ctx, ctx.currentTime, bassFreq, beatDurationSec * 1.8);
      }

      // Rhythm percussion (Kick & Hi-hat)
      if (symphonyToPlay.category === 'pop' || symphonyToPlay.subCategory === 'mozart') {
        if (stepCounter % 4 === 0 || stepCounter % 4 === 2) {
          playKick(ctx, ctx.currentTime);
        }
        if (stepCounter % 4 === 2) {
          playSnare(ctx, ctx.currentTime);
        }
        playHiHat(ctx, ctx.currentTime);
      }

      // 3. Spoken lyric phrase or orchestral movement title (every 8 steps)
      if (spokenNarration && lyricsArray.length > 0 && stepCounter % 8 === 0) {
        setActiveLyricIndex(lyricIdx);
        const currentLine = lyricsArray[lyricIdx];
        if (currentLine && typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(currentLine);
          
          const actor = ACTORS.find(a => a.id === selectedActorId) || ACTORS[0];
          const matchVoice = getVoiceForActor(actor, availableVoices);
          if (matchVoice) {
            utterance.voice = matchVoice;
          }

          if (actor.id === 'shakespearean') {
            utterance.pitch = 0.8;
            utterance.rate = 0.85;
          } else if (actor.id === 'broadway_diva') {
            utterance.pitch = 1.2;
            utterance.rate = 1.0;
          } else if (actor.id === 'cyberpunk') {
            utterance.pitch = 0.5;
            utterance.rate = 1.2;
          } else if (actor.id === 'soulful') {
            utterance.pitch = 0.9;
            utterance.rate = 0.9;
          } else {
            utterance.pitch = 1.05;
            utterance.rate = 1.0;
          }

          window.speechSynthesis.speak(utterance);
        }
        lyricIdx = (lyricIdx + 1) % lyricsArray.length;
      }

      // Advance note pointer
      const currentNoteDur = (currentNoteObj?.dur || 0.5) * beatDurationSec;
      noteIdx++;

      // Check if end of notes array reached
      if (noteIdx >= notesArray.length) {
        if (isLoop) {
          noteIdx = 0;
        } else if (autoAdvance) {
          handleNextTrack();
          return;
        } else {
          setIsPlaying(false);
          return;
        }
      }

      stepCounter++;
      sequencerTimeoutRef.current = window.setTimeout(executeStep, currentNoteDur * 1000);
    };

    executeStep();
  };

  // Next / Previous Track navigation
  const handleNextTrack = () => {
    const list = filteredTracks.length > 0 ? filteredTracks : ALL_SYMPHONIES;
    if (isShuffle) {
      const randomIdx = Math.floor(Math.random() * list.length);
      setCurrentSymphony(list[randomIdx]);
    } else {
      const currentIdx = list.findIndex(s => s.id === currentSymphony.id);
      const nextIdx = (currentIdx + 1) % list.length;
      setCurrentSymphony(list[nextIdx]);
    }
  };

  const handlePrevTrack = () => {
    const list = filteredTracks.length > 0 ? filteredTracks : ALL_SYMPHONIES;
    const currentIdx = list.findIndex(s => s.id === currentSymphony.id);
    const prevIdx = (currentIdx - 1 + list.length) % list.length;
    setCurrentSymphony(list[prevIdx]);
  };

  // Handle Play/Pause toggles
  const handlePlayToggle = () => {
    initAudio();
    if (isPlaying) {
      if (sequencerTimeoutRef.current) {
        window.clearTimeout(sequencerTimeoutRef.current);
        sequencerTimeoutRef.current = null;
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
      setActiveNote(null);
    } else {
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    if (sequencerTimeoutRef.current) {
      window.clearTimeout(sequencerTimeoutRef.current);
      sequencerTimeoutRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setActiveNote(null);
    setActiveLyricIndex(0);
  };

  // Play sequence reactively when isPlaying, symphony, instrument, actor, or tempo changes
  useEffect(() => {
    if (isPlaying) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('stop-ambient-player'));
      }
      runSequence(currentSymphony);
    } else {
      handleStop();
    }
    return () => {
      if (sequencerTimeoutRef.current) {
        window.clearTimeout(sequencerTimeoutRef.current);
      }
    };
  }, [isPlaying, currentSymphony, activeInstrument, selectedActorId, tempoMultiplier, spokenNarration, isLoop, autoAdvance]);

  // Visualizer loop for bouncing sound bars
  useEffect(() => {
    if (isPlaying) {
      const updateVisualizer = () => {
        setVisualBars(prev => prev.map((_, idx) => {
          const factor = activeNote ? 0.9 : 0.3;
          return Math.floor(Math.sin(idx * 0.3 + Date.now() * 0.005) * 35 * factor + 45);
        }));
        animationFrameRef.current = requestAnimationFrame(updateVisualizer);
      };
      animationFrameRef.current = requestAnimationFrame(updateVisualizer);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setVisualBars(Array(24).fill(10));
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, activeNote]);

  // Listen for external triggers to stop symphony music
  useEffect(() => {
    const handleStopSymphony = () => {
      setIsPlaying(false);
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('stop-symphony-player', handleStopSymphony);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('stop-symphony-player', handleStopSymphony);
      }
    };
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (sequencerTimeoutRef.current) {
        window.clearTimeout(sequencerTimeoutRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 p-1 select-none" id="symphony-concert-hall-container">
      
      {/* LEFT COLUMN: 35+ Playlist Library, Category Tabs, Search & Neuro Benefits */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        
        {/* Playlist Card Header */}
        <div className="bg-white/95 border border-stone-200/80 rounded-2xl p-4 shadow-xs">
          
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-rose-50 border border-rose-150 text-rose-600">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-black text-sm text-stone-950 uppercase tracking-wide">
                  Classical & Pop Symphonies
                </h3>
                <p className="text-[10px] text-stone-400 font-mono font-bold leading-none mt-0.5">
                  35+ MASTERPIECES • MOZART, BEETHOVEN & POP
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
              {filteredTracks.length} / {ALL_SYMPHONIES.length} Tracks
            </span>
          </div>

          {/* Search Box */}
          <div className="relative mb-3">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search Mozart, Beethoven, Bach, Chopin, Pop..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8.5 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-rose-400 transition-colors font-medium"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 mb-3 scrollbar-none">
            {CATEGORIES.map(cat => {
              const isCatActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                    isCatActive
                      ? 'bg-stone-900 text-white shadow-3xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80 hover:text-stone-900'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Track List */}
          <div className="space-y-1.5 max-h-[340px] overflow-y-auto pr-1 scrollbar-thin">
            {filteredTracks.length === 0 ? (
              <div className="text-center py-8 text-stone-400 text-xs">
                No tracks match "{searchQuery}". Try searching for Mozart, Beethoven, or Bach.
              </div>
            ) : (
              filteredTracks.map((sym) => {
                const isSelected = currentSymphony.id === sym.id;
                return (
                  <button
                    key={sym.id}
                    onClick={() => {
                      setCurrentSymphony(sym);
                      setIsPlaying(true);
                    }}
                    className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer relative overflow-hidden ${
                      isSelected 
                        ? 'border-rose-400 bg-rose-50/60 ring-1 ring-rose-200 shadow-3xs' 
                        : 'border-stone-150 hover:border-stone-300 hover:bg-stone-50/80 bg-white/80'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl text-sm flex items-center justify-center font-bold bg-gradient-to-br ${sym.bgGradient} text-white shadow-3xs shrink-0`}>
                      {sym.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[8.5px] font-mono font-black text-rose-600 uppercase tracking-wider truncate">
                          {sym.composer}
                        </span>
                        <span className="text-[8.5px] font-mono text-stone-400 font-bold shrink-0">
                          {sym.year}
                        </span>
                      </div>
                      <h4 className="font-display font-bold text-stone-900 text-xs truncate leading-tight mt-0.5">
                        {sym.name}
                      </h4>
                      <p className="text-[9px] text-stone-400 font-mono truncate mt-0.5">
                        {sym.opus || sym.era} • {sym.tempo} BPM • {sym.keySignature}
                      </p>
                    </div>

                    {isSelected && (
                      <div className="flex items-center gap-1 shrink-0">
                        {isPlaying ? (
                          <div className="flex items-end gap-0.5 h-4">
                            <span className="w-1 bg-rose-500 rounded-full animate-bounce h-3" />
                            <span className="w-1 bg-rose-500 rounded-full animate-bounce h-4 delay-75" />
                            <span className="w-1 bg-rose-500 rounded-full animate-bounce h-2 delay-150" />
                          </div>
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-rose-500" />
                        )}
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>

        </div>

        {/* Selected Masterpiece Cognitive Resonance & Brainwave Guide */}
        <div className="bg-gradient-to-br from-stone-900 via-stone-850 to-stone-950 text-stone-100 rounded-2xl p-4 border border-stone-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Sparkles className="w-24 h-24 text-rose-500" />
          </div>

          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 text-[9px] font-mono text-rose-350 font-black uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-rose-400" /> Neuro-Acoustic Resonance
            </div>
            <span className="text-[9px] font-mono font-black text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-800/40">
              {currentSymphony.brainwave}
            </span>
          </div>

          <div className="flex items-baseline gap-1.5 mb-2">
            <h4 className="font-display font-black text-white text-base leading-tight">
              {currentSymphony.name}
            </h4>
            <span className="text-[10px] text-stone-400 font-mono font-medium">
              by {currentSymphony.composer}
            </span>
          </div>

          <p className="text-stone-300 text-xs leading-relaxed font-sans mb-3 font-medium">
            {currentSymphony.description}
          </p>

          <div className="bg-white/5 border border-white/10 p-2.5 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 shrink-0">
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[8px] font-mono text-stone-400 font-bold block leading-none uppercase">Cognitive Resonance</span>
                <p className="text-rose-200 font-bold text-xs font-display leading-tight mt-0.5">
                  {currentSymphony.benefits}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Player Engine, Instrument Switcher, Backing Tracks, Visualizer, Interactive Keyboard */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        
        {/* RIGHT COLUMN TABS: Orchestra Concert Hall vs CoSing AI Studio */}
        <div className="flex gap-1.5 p-1 bg-stone-100 border border-stone-200/50 rounded-2xl self-start animate-fade-in mb-1" id="symphony-tab-header">
          <button
            type="button"
            onClick={() => {
              setRightPanelTab('orchestra');
              setIsRecording(false);
            }}
            className={`px-4.5 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              rightPanelTab === 'orchestra'
                ? 'bg-white text-stone-900 shadow-sm border border-stone-250/20'
                : 'text-stone-500 hover:text-stone-850 bg-transparent'
            }`}
          >
            <Music className="w-4 h-4 text-[#9f1239]" />
            Symphony Concert Stage
          </button>
          <button
            type="button"
            onClick={() => {
              setRightPanelTab('cosing');
              setIsPlaying(false);
            }}
            className={`px-4.5 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              rightPanelTab === 'cosing'
                ? 'bg-[#9f1239] text-white shadow-sm'
                : 'text-stone-500 hover:text-stone-850 bg-transparent'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            CoSing AI Duets
          </button>
        </div>

        {rightPanelTab === 'orchestra' ? (
          <>
            {/* Main Stage Panel */}
            <div className="bg-white/95 border border-stone-200/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[460px] relative overflow-hidden">
              
              {/* Top Bar: Live Waveform Visualizer & Lead Instrument Selector */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 border-b border-stone-100 pb-4">
                
                {/* Visualizer Animation */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="h-8 flex items-end gap-0.5 px-3 py-1.5 bg-stone-900 rounded-xl min-w-[140px] justify-center shadow-3xs border border-stone-800">
                    {visualBars.map((val, i) => (
                      <motion.div 
                        key={i}
                        animate={{ height: isPlaying ? `${val}%` : "15%" }}
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        className="w-1 bg-gradient-to-t from-rose-500 to-amber-400 rounded-full"
                      />
                    ))}
                  </div>
                  <div className="leading-none">
                    <span className="text-[8.5px] font-mono font-bold text-stone-400 uppercase tracking-widest block">Acoustic Engine</span>
                    <span className="text-[11px] font-sans font-black text-rose-600 flex items-center gap-1 mt-0.5">
                      <Activity className="w-3 h-3 animate-pulse" /> {isPlaying ? 'POLYPHONIC BROADCAST' : 'STANDBY'}
                    </span>
                  </div>
                </div>

                {/* Lead Instrument Selector */}
                <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
                  {INSTRUMENTS.map((inst) => (
                    <button
                      key={inst.id}
                      onClick={() => setActiveInstrument(inst.id as any)}
                      className={`p-1.5 px-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-1
                        ${activeInstrument === inst.id 
                          ? 'bg-white shadow-3xs border border-rose-200/55 text-rose-600 font-black' 
                          : 'text-stone-500 hover:text-stone-800'
                        }
                      `}
                      title={inst.desc}
                    >
                      <span>{inst.icon}</span>
                      <span>{inst.label.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>

              </div>

              {/* Active Broadcast Center Display */}
              <div className="flex-1 flex flex-col items-center justify-center py-4 select-none relative z-10">
                
                {/* Pulsing Visual Center Orb */}
                <div className="relative mb-3">
                  <motion.div 
                    animate={{ scale: activeNote ? 1.18 : 1.0 }}
                    transition={{ duration: 0.15 }}
                    className={`w-24 h-24 rounded-full bg-gradient-to-tr ${currentSymphony.bgGradient} flex items-center justify-center text-white shadow-xl border-4 border-white`}
                  >
                    <span className="text-3xl animate-bounce-slow">{currentSymphony.emoji}</span>
                  </motion.div>
                  {isPlaying && (
                    <>
                      <span className="absolute -inset-2 rounded-full border border-rose-400/30 animate-ping pointer-events-none" />
                      <span className="absolute -inset-5 rounded-full border border-rose-300/10 animate-ping-slow pointer-events-none" />
                    </>
                  )}
                </div>

                <div className="text-center mb-3">
                  <h3 className="font-display font-black text-stone-900 text-xl tracking-tight leading-none mb-1">
                    {currentSymphony.name}
                  </h3>
                  <p className="text-xs text-stone-500 font-mono font-bold uppercase tracking-wider">
                    {currentSymphony.composer} • {currentSymphony.keySignature}
                  </p>
                </div>

                {/* STAGE TELEPROMPTER / LYRICS OR MOVEMENT POETRY */}
                <div className="w-full max-w-md bg-stone-50 border border-stone-200/70 rounded-2xl p-3.5 shadow-3xs flex flex-col items-center select-none">
                  <div className="flex items-center justify-between w-full mb-1.5">
                    <span className="text-[8px] font-mono font-black text-rose-500 uppercase tracking-widest flex items-center gap-1">
                      <Music className="w-2.5 h-2.5 animate-spin-slow" /> STAGE TELEPROMPTER & MOVEMENTS
                    </span>
                    <button
                      onClick={() => setSpokenNarration(!spokenNarration)}
                      className={`text-[8.5px] font-mono px-2 py-0.5 rounded cursor-pointer font-bold transition-all ${
                        spokenNarration ? 'bg-rose-100 text-rose-700' : 'bg-stone-200 text-stone-500'
                      }`}
                    >
                      {spokenNarration ? '🗣️ Actor Speech: ON' : '🔇 Speech: OFF'}
                    </button>
                  </div>
                  
                  <div className="text-center min-h-[44px] flex items-center justify-center px-2">
                    {currentSymphony.lyrics && currentSymphony.lyrics.length > 0 ? (
                      <p className="text-xs text-stone-700 font-display font-bold italic leading-relaxed animate-fade-in">
                        "{currentSymphony.lyrics[activeLyricIndex] || currentSymphony.lyrics[0]}"
                      </p>
                    ) : (
                      <p className="text-xs text-stone-400 font-mono italic">
                        Polyphonic instrumental acoustic resonance
                      </p>
                    )}
                  </div>
                </div>

                {/* Backing Tracks Mixer */}
                <div className="w-full max-w-md mt-3 bg-stone-50/70 border border-stone-200/50 rounded-xl p-2.5">
                  <div className="flex items-center justify-between mb-1.5 px-1">
                    <span className="text-[8.5px] font-mono font-black text-stone-500 uppercase tracking-wider flex items-center gap-1">
                      <Sliders className="w-3 h-3 text-rose-500" /> MULTI-TRACK ACOUSTIC MIXER
                    </span>
                    <span className="text-[8px] font-mono text-stone-400 font-bold uppercase">
                      {isPlaying ? 'ACTIVE' : 'STANDBY'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: 'melody', label: 'Melody', icon: Music, color: 'text-rose-500', bg: 'bg-rose-50' },
                      { id: 'chords', label: 'Chords', icon: Layers, color: 'text-indigo-500', bg: 'bg-indigo-50' },
                      { id: 'bass', label: 'Bass', icon: Flame, color: 'text-amber-500', bg: 'bg-amber-50' },
                      { id: 'drums', label: 'Rhythm', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                    ].map((track) => {
                      const isTrackActive = (mixerTracks as any)[track.id];
                      return (
                        <button
                          key={track.id}
                          onClick={() => setMixerTracks(prev => ({
                            ...prev,
                            [track.id]: !(prev as any)[track.id]
                          }))}
                          className={`py-1.5 px-2 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer border ${
                            isTrackActive 
                              ? `${track.bg} ${track.color} border-current/30 shadow-3xs` 
                              : 'bg-stone-100 text-stone-400 border-stone-200 opacity-60'
                          }`}
                        >
                          <track.icon className="w-3 h-3" />
                          <span>{track.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* STAND-OUT MASTER VOL UX & TEMPO CONTROLS */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-rose-50/45 border border-rose-100/70 p-3.5 rounded-2xl mb-4 shadow-3xs relative">
                
                {/* Master Volume Controller */}
                <div className="md:col-span-7 flex items-center gap-3 bg-white p-2.5 rounded-xl border border-rose-200/70 shadow-2xs w-full">
                  <button 
                    onClick={() => setMasterVolume(prev => prev > 0 ? 0 : 75)}
                    className="p-2 rounded-xl bg-rose-50 border border-rose-150 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                    title="Mute Master Output"
                  >
                    {masterVolume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-rose-600 animate-pulse" />}
                  </button>
                  
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-center leading-none">
                      <span className="text-[9.5px] font-mono font-black text-rose-600 uppercase tracking-widest">MASTER VOLUME</span>
                      <span className="text-[10px] font-mono font-black text-rose-700">{masterVolume}%</span>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max="100"
                      value={masterVolume}
                      onChange={(e) => setMasterVolume(Number(e.target.value))}
                      className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-rose-600 mt-1.5"
                      style={{
                        background: `linear-gradient(to right, #e11d48 0%, #e11d48 ${masterVolume}%, #f5f5f4 ${masterVolume}%, #f5f5f4 100%)`
                      }}
                    />
                  </div>
                </div>

                {/* Tempo Speed Multiplier Slider */}
                <div className="md:col-span-5 flex items-center gap-2 bg-white p-2.5 rounded-xl border border-stone-200/50 shadow-3xs w-full">
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-center leading-none">
                      <span className="text-[9px] font-mono font-black text-stone-500 uppercase tracking-wider">TEMPO SPEED</span>
                      <span className="text-[9.5px] font-mono font-black text-stone-700">{tempoMultiplier.toFixed(2)}x</span>
                    </div>
                    <input 
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.05"
                      value={tempoMultiplier}
                      onChange={(e) => setTempoMultiplier(Number(e.target.value))}
                      className="w-full h-1.5 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-stone-700 mt-1.5"
                    />
                  </div>
                </div>

              </div>

              {/* Player Controls Row (Prev, Play/Pause, Next, Shuffle, Loop) */}
              <div className="flex items-center justify-between gap-2 border-t border-stone-100 pt-3 mt-auto">
                
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsShuffle(!isShuffle)}
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                      isShuffle 
                        ? 'bg-rose-50 border-rose-300 text-rose-600 shadow-3xs' 
                        : 'bg-white border-stone-200 text-stone-400 hover:text-stone-700'
                    }`}
                    title="Toggle Shuffle"
                  >
                    <Shuffle className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsLoop(!isLoop)}
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                      isLoop 
                        ? 'bg-rose-50 border-rose-300 text-rose-600 shadow-3xs' 
                        : 'bg-white border-stone-200 text-stone-400 hover:text-stone-700'
                    }`}
                    title="Toggle Loop"
                  >
                    <Repeat className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handlePrevTrack}
                    className="p-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 hover:text-stone-900 transition-all cursor-pointer"
                    title="Previous Track"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handlePlayToggle}
                  className={`flex-1 max-w-xs p-3 rounded-2xl font-display font-black text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 text-white ${
                    isPlaying 
                      ? 'bg-stone-900 hover:bg-stone-850 shadow-inner' 
                      : `bg-gradient-to-r ${currentSymphony.bgGradient} hover:brightness-105 shadow-rose-200`
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-white stroke-none" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white stroke-none" /> Play Masterpiece
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleNextTrack}
                    className="p-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 hover:text-stone-900 transition-all cursor-pointer"
                    title="Next Track"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleStop}
                    className="p-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-500 hover:text-stone-800 transition-all cursor-pointer"
                    title="Reset Track"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>

            {/* INTERACTIVE 24-KEY PIANO ROLL / KEYBOARD */}
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 shadow-sm text-stone-100 select-none">
              
              <div className="flex items-center justify-between mb-3 border-b border-stone-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-[10px] font-mono font-black text-stone-300 uppercase tracking-widest">
                    Interactive Concert Keyboard ({activeInstrument.toUpperCase()})
                  </span>
                </div>
                <span className="text-[9px] font-mono text-stone-400">
                  Touch or click keys to play along in real-time
                </span>
              </div>

              {/* Keyboard keys container */}
              <div className="flex justify-center overflow-x-auto py-2 px-1 relative min-h-[110px] scrollbar-none">
                <div className="flex relative">
                  {KEYBOARD_KEYS.map((k) => {
                    const isActive = activeNote === k.note;
                    if (k.isSharp) {
                      return (
                        <button
                          key={k.note}
                          onClick={() => playSynthesizedNote(k.note, 0.4, true)}
                          className={`w-6 h-18 -mx-3 z-20 rounded-b-md transition-all cursor-pointer flex flex-col justify-end items-center pb-1 text-[7.5px] font-mono font-bold select-none ${
                            isActive
                              ? 'bg-rose-500 text-white shadow-lg scale-95 ring-2 ring-white'
                              : 'bg-stone-950 text-stone-400 hover:bg-stone-800 border-x border-b border-stone-700 shadow-md'
                          }`}
                        >
                          <span>{k.label.replace('3', '').replace('4', '').replace('5', '')}</span>
                        </button>
                      );
                    } else {
                      return (
                        <button
                          key={k.note}
                          onClick={() => playSynthesizedNote(k.note, 0.4, true)}
                          className={`w-8 h-28 z-10 rounded-b-lg transition-all cursor-pointer flex flex-col justify-end items-center pb-2 text-[8px] font-mono font-bold select-none border-x border-b ${
                            isActive
                              ? 'bg-rose-100 border-rose-400 text-rose-950 shadow-inner scale-98 ring-2 ring-rose-400'
                              : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-100 shadow-xs'
                          }`}
                        >
                          <span className="opacity-75">{k.label}</span>
                        </button>
                      );
                    }
                  })}
                </div>
              </div>

              {/* Real-time telemetry feed */}
              <div className="mt-3 pt-2.5 border-t border-stone-800 flex items-center justify-between text-[9px] font-mono text-stone-400">
                <span>Active Carrier: <strong className="text-rose-400">{activeNote || 'IDLE'}</strong></span>
                <span>Active Instrument: <strong className="text-white">{activeInstrument.toUpperCase()}</strong></span>
                <span>Tempo: <strong className="text-white">{Math.round((currentSymphony.tempo || 120) * tempoMultiplier)} BPM</strong></span>
              </div>

            </div>
          </>
        ) : (
          <div className="flex flex-col gap-4 animate-fade-in">
            {/* CoSing Main Studio Stage */}
            <div className="bg-white/95 border border-stone-200/80 rounded-2xl p-5 shadow-xs flex flex-col gap-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Radio className="w-32 h-32 text-rose-500 animate-pulse" />
              </div>

              {/* Header inside CoSing */}
              <div className="border-b border-stone-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-display font-black text-sm text-[#9f1239] uppercase tracking-wide flex items-center gap-1.5">
                    <Radio className="w-4 h-4 text-rose-600 animate-pulse" />
                    CoSing Social Studio
                  </h3>
                  <p className="text-[10px] text-stone-400 font-mono font-bold leading-none mt-0.5">
                    RECORD & PERFORM VOCAL SONGS ALONGSIDE LICENSED AI IDOLS
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-emerald-100 self-start sm:self-auto">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                  Voice Engine Online
                </div>
              </div>

              {/* Selection of Idols */}
              <div>
                <h4 className="text-[10px] font-mono font-black text-stone-500 uppercase tracking-wider mb-2">
                  1. Select your vocal idol partner:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {VOCAL_IDOLS.map(idol => {
                    const isSelected = selectedIdolId === idol.id;
                    return (
                      <button
                        key={idol.id}
                        type="button"
                        onClick={() => {
                          setSelectedIdolId(idol.id);
                          setIsRecording(false);
                        }}
                        className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer hover:shadow-3xs relative overflow-hidden ${
                          isSelected
                            ? 'border-rose-400 bg-rose-50/40 shadow-sm ring-1 ring-rose-200'
                            : 'border-stone-150 bg-stone-50/50 hover:bg-white'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-xl shadow-3xs mb-1">
                          {idol.avatar}
                        </div>
                        <h5 className="font-display font-bold text-stone-850 text-[11px] leading-tight truncate w-full">
                          {idol.name}
                        </h5>
                        <p className="text-[8px] text-stone-400 font-mono leading-none truncate w-full">
                          {idol.title}
                        </p>
                        {isSelected && (
                          <div className="absolute top-1 right-1">
                            <span className="flex h-2 w-2 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                            </span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Display Chosen Idol details */}
              {(() => {
                const idol = VOCAL_IDOLS.find(i => i.id === selectedIdolId) || VOCAL_IDOLS[0];
                return (
                  <div className="bg-stone-50 border border-stone-200/60 rounded-xl p-3 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                    <div className="md:col-span-8">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] px-1.5 py-0.5 font-mono font-black uppercase rounded bg-[#9f1239] text-white">
                          {idol.genre}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono">
                          Tone: <strong className="text-stone-600 font-bold">{idol.voiceTone}</strong>
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 leading-normal">
                        {idol.description}
                      </p>
                    </div>
                    <div className="md:col-span-4 border-l border-stone-200 pl-3 space-y-1 text-[10px] font-mono text-stone-500">
                      <div>Track: <strong className="text-stone-850 font-bold">{idol.licensedTrack}</strong></div>
                      <div>Key: <span className="text-[#9f1239] font-bold">{idol.trackKey}</span></div>
                      <div>BPM: <span className="text-stone-800 font-bold">{idol.trackBpm}</span></div>
                    </div>
                  </div>
                );
              })()}

              {/* Studio Microphone & Lyric Prompter section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Microphone console */}
                <div className="border border-stone-200/85 rounded-xl p-4 bg-stone-950 text-white flex flex-col justify-between min-h-[190px]">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-[10px] font-mono font-black text-rose-400 uppercase tracking-widest flex items-center gap-1">
                      <Mic className="w-3.5 h-3.5" /> Vocal Input Device
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsMicActive(!isMicActive)}
                      className={`px-2 py-1 rounded-lg text-[9px] font-mono font-black uppercase transition-all flex items-center gap-1 cursor-pointer ${
                        isMicActive
                          ? 'bg-emerald-500 text-white shadow-inner animate-pulse'
                          : 'bg-white/10 text-stone-300 hover:bg-white/15'
                      }`}
                    >
                      {isMicActive ? <Mic className="w-2.5 h-2.5" /> : <MicOff className="w-2.5 h-2.5" />}
                      {isMicActive ? 'MIC ON' : 'CONNECT MIC'}
                    </button>
                  </div>

                  {/* Meter Display */}
                  <div className="py-3">
                    <div className="flex items-center justify-between mb-1.5 text-[9px] font-mono text-stone-400">
                      <span>VOICE FEEDBACK FREQUENCY</span>
                      <span>{micLevel}% Volume</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden flex gap-0.5 p-0.5">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 rounded-full transition-all duration-75"
                        style={{ width: `${micLevel}%` }}
                      />
                    </div>
                    {/* Live Voice Graph Waveform */}
                    <div className="h-6 flex items-center justify-center gap-0.5 mt-2 overflow-hidden opacity-80">
                      {Array(24).fill(0).map((_, i) => {
                        const randomHeight = isMicActive ? Math.max(10, Math.floor((Math.sin(i * 0.4) + 1.2) * micLevel * 0.4)) : 4;
                        return (
                          <div 
                            key={i} 
                            className="w-1 bg-rose-500/80 rounded-full transition-all duration-75" 
                            style={{ height: `${randomHeight}%` }}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Perform Button */}
                  <div className="pt-2 border-t border-white/5 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        initAudio();
                        if (isRecording) {
                          setIsRecording(false);
                          const idol = VOCAL_IDOLS.find(i => i.id === selectedIdolId) || VOCAL_IDOLS[0];
                          const newDuet = {
                            id: Date.now().toString(),
                            date: new Date().toISOString().slice(0, 16).replace('T', ' '),
                            idolName: idol.name,
                            trackName: `${idol.licensedTrack} (AI Duet Mixdown)`,
                            rating: 5
                          };
                          setSavedDuets(prev => [newDuet, ...prev]);
                        } else {
                          setIsRecording(true);
                        }
                      }}
                      className={`flex-1 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        isRecording
                          ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                          : 'bg-white text-stone-900 hover:bg-stone-100'
                      }`}
                    >
                      {isRecording ? (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-current" />
                          Stop & Save Duet
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          Start AI Duet
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Lyrics Karaoke Display */}
                <div className="border border-stone-200/80 rounded-xl p-4 bg-stone-900 text-stone-100 flex flex-col justify-between min-h-[190px]">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-[10px] font-mono font-black text-amber-400 uppercase tracking-widest flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Studio Teleprompter
                    </span>
                    {isRecording && (
                      <span className="text-[8px] bg-rose-500 text-white px-1.5 py-0.5 rounded font-mono font-black uppercase tracking-wider animate-pulse">
                        REC LIVE
                      </span>
                    )}
                  </div>

                  <div className="py-4 text-center select-none flex-1 flex flex-col justify-center">
                    {isRecording ? (
                      (() => {
                        const idol = VOCAL_IDOLS.find(i => i.id === selectedIdolId) || VOCAL_IDOLS[0];
                        return (
                          <div className="space-y-2">
                            {idol.lyrics.map((line, idx) => {
                              const isActive = idx === lyricsIndex;
                              return (
                                <p 
                                  key={idx} 
                                  className={`text-xs font-bold transition-all duration-300 ${
                                    isActive 
                                      ? 'text-white text-sm tracking-wide font-extrabold bg-[#9f1239]/20 py-1 px-2 rounded-lg border border-[#9f1239]/30 scale-105' 
                                      : 'text-stone-500 scale-95 opacity-60'
                                  }`}
                                >
                                  {line}
                                </p>
                              );
                            })}
                          </div>
                        );
                      })()
                    ) : (
                      <div className="text-stone-400 italic text-[11px] space-y-1.5">
                        <p>🎤 Connect your microphone and click "Start AI Duet".</p>
                        <p className="text-[9px] text-stone-500 font-mono">
                          Immersive voice enhancements will harmonize in real-time.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-white/5 pt-1 text-center">
                    <span className="text-[8px] font-mono text-stone-500 uppercase tracking-widest">
                      AI Vocal Collaboration Active
                    </span>
                  </div>
                </div>

              </div>

              {/* Interactive FX Rack */}
              <div>
                <h4 className="text-[10px] font-mono font-black text-stone-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-stone-600" /> 2. Immersive AI Sound Effects Rack:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'reverb', label: 'Stereo Reverb', desc: 'Concert Hall Space' },
                    { id: 'autoTune', label: 'Pitch Correction', desc: 'Precise Vocal Alignment' },
                    { id: 'aiHarmony', label: 'AI Harmony Partner', desc: 'Automatic Backing Vocals' },
                    { id: 'saturation', label: 'Warm Saturation', desc: 'Analog Valve Preamp' }
                  ].map(fx => {
                    const active = (effects as any)[fx.id];
                    return (
                      <button
                        key={fx.id}
                        type="button"
                        onClick={() => setEffects(prev => ({ ...prev, [fx.id]: !active }))}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between hover:shadow-3xs ${
                          active
                            ? 'border-rose-450 bg-rose-50/20 shadow-3xs'
                            : 'border-stone-150 bg-stone-50/50 text-stone-400'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className={`text-[10px] font-bold ${active ? 'text-stone-900 font-black' : 'text-stone-400'}`}>
                            {fx.label}
                          </span>
                          <span className={`w-2 h-2 rounded-full ${active ? 'bg-rose-500 animate-pulse' : 'bg-stone-300'}`} />
                        </div>
                        <span className="text-[8px] font-mono leading-none text-stone-400 block">
                          {fx.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Duets History panel */}
            <div className="bg-stone-50 border border-stone-200/60 rounded-2xl p-4 shadow-3xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-black text-stone-500 uppercase tracking-widest flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-rose-500" /> CoSing Social Recordings
                </span>
                <span className="text-[9px] font-mono text-stone-400">
                  {savedDuets.length} Mixdowns Saved
                </span>
              </div>

              <div className="space-y-2">
                {savedDuets.map((duet) => (
                  <div 
                    key={duet.id} 
                    className="bg-white border border-stone-150 p-3 rounded-xl flex items-center justify-between gap-3 shadow-3xs hover:shadow-2xs transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-sm border border-rose-100 shadow-3xs">
                        🎙️
                      </div>
                      <div>
                        <h5 className="font-display font-bold text-[11px] text-stone-850 leading-tight">
                          {duet.trackName}
                        </h5>
                        <p className="text-[9px] text-stone-400 font-mono leading-none mt-0.5">
                          Artist: {duet.idolName} • {duet.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-100 font-mono font-black uppercase">
                          Licensed AI
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSavedDuets(prev => prev.filter(d => d.id !== duet.id));
                        }}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Mixdown"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
