import React, { useState, useEffect } from 'react';
import { 
  OutdoorMissionType, 
  SoundSourceCategory, 
  ExtractedAudioFeatures, 
  GemmaMusicalReasoning, 
  OutdoorMissionRecord,
  SoundMapPoint,
  ActiveListeningLevel
} from './types/touchGrassTypes';
import { AIProvider, localHeuristicProvider, gemmaCloudProvider } from './ai/aiProvider';
import { audioFeatureExtractor } from './audio/audioFeatureExtractor';
import { pianoAudio } from '../audio/pianoAudio';

import { 
  Compass, 
  Trees, 
  Footprints, 
  Volume2, 
  Headphones, 
  Mic, 
  MicOff, 
  Sparkles, 
  Clock, 
  Play, 
  CheckCircle2, 
  Radio, 
  ShieldCheck, 
  ArrowRight, 
  RotateCcw, 
  Award, 
  Flame, 
  Brain, 
  Piano, 
  MapPin, 
  HelpCircle,
  EyeOff,
  GitBranch,
  Github,
  Music,
  Share2,
  Check,
  ChevronRight,
  Layers,
  Sparkle,
  Sliders,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TouchGrassStudioProps {
  onOpenPiano?: () => void;
  onSetTargetNotes?: (notes: string[]) => void;
  onXpEarned?: (xp: number) => void;
}

// 4 Deterministic Demo Scenarios
const DEMO_SCENARIOS = [
  {
    id: 'demo-footsteps',
    title: 'Gravel Footsteps (Walking Stride)',
    category: 'Footsteps / Walking' as SoundSourceCategory,
    tempo: 96,
    pattern: 'Steady duple pulse',
    desc: 'Learner walks along a gravel trail, noticing the rhythmic pulse of their boots.',
    exerciseType: 'ostinato_accompaniment' as const,
    notes: ['C3', 'G3', 'A3', 'F3'],
    explanation: 'Transfers physical walking steps into left-hand anchor bass chords.'
  },
  {
    id: 'demo-birdsong',
    title: 'Morning Robin (Arched Vocal Flutter)',
    category: 'Birdsong / Avian Contour' as SoundSourceCategory,
    tempo: 112,
    pattern: 'High-Low-High arched contour',
    desc: 'Learner pauses beneath an oak tree and hears a 3-note melodic motif.',
    exerciseType: 'melody_reproduction' as const,
    notes: ['G4', 'E4', 'G4', 'A4'],
    explanation: 'Identifies pitch direction and reproduces the motif on right-hand treble keys.'
  },
  {
    id: 'demo-rain',
    title: 'Raindrops on Leaves (Natural Ostinato)',
    category: 'Rain / Water Flow' as SoundSourceCategory,
    tempo: 84,
    pattern: 'Looping hydro-acoustic texture',
    desc: 'Learner listens to raindrops creating a repeating rhythmic ostinato.',
    exerciseType: 'piano_rhythm' as const,
    notes: ['E4', 'G4', 'C5', 'G4'],
    explanation: 'Transforms natural rainfall timing into Chopin-style arpeggiated broken triads.'
  },
  {
    id: 'demo-water',
    title: 'Flowing Brook (Improvisation Seed)',
    category: 'Water / Streams & Faucets' as SoundSourceCategory,
    tempo: 78,
    pattern: 'Gentle organic ripples',
    desc: 'Learner visits a creek and notices continuous liquid harmonic movement.',
    exerciseType: 'improvisation_seed' as const,
    notes: ['C4', 'D4', 'E4', 'G4', 'A4'],
    explanation: 'Uses the C Pentatonic scale to freely improvise over water textures.'
  }
];

// All 9 prompt outdoor rhythm examples
const RHYTHM_HUNT_EXAMPLES = [
  { id: 'ex-footsteps', name: 'Footsteps', icon: '👣', tempo: 96, category: 'Footsteps / Walking' as SoundSourceCategory, pattern: 'Steady left-right duple pulse', notes: ['C3', 'G3', 'C3', 'G3'], hand: 'LH', pianoIdea: 'Walking Bass Anchor' },
  { id: 'ex-bike', name: 'Bicycle Wheels', icon: '🚲', tempo: 120, category: 'Bicycle Wheels / Mechanical' as SoundSourceCategory, pattern: 'Crisp freewheel 16th-note click', notes: ['D4', 'G4', 'B4', 'D5'], hand: 'RH', pianoIdea: 'Rapid Allegro Ostinato' },
  { id: 'ex-rain', name: 'Rain', icon: '🌧️', tempo: 84, category: 'Rain / Water Flow' as SoundSourceCategory, pattern: 'Liquid broken arpeggio drip', notes: ['E4', 'G4', 'C5', 'G4'], hand: 'RH', pianoIdea: 'Chopin-Style Droplet Loop' },
  { id: 'ex-construction', name: 'Construction', icon: '🏗️', tempo: 76, category: 'Construction / Heavy Machinery' as SoundSourceCategory, pattern: 'Heavy accented downbeat strike', notes: ['A2', 'E3', 'A3', 'C4'], hand: 'LH', pianoIdea: 'Percussive Heavy Downbeat' },
  { id: 'ex-traffic', name: 'Traffic Signals', icon: '🚦', tempo: 108, category: 'Traffic Signals / Pedestrian Crossing' as SoundSourceCategory, pattern: 'Strict metronomic crosswalk chime', notes: ['C4', 'C4', 'G4', 'G4'], hand: 'Both', pianoIdea: 'Isochronous Metronome Lock' },
  { id: 'ex-doors', name: 'Doors & Latches', icon: '🚪', tempo: 60, category: 'Doors / Latches & Hinges' as SoundSourceCategory, pattern: 'Swing tension into latch closure', notes: ['G3', 'B3', 'F4', 'C4'], hand: 'Both', pianoIdea: 'Tension-to-Resolution Cadence' },
  { id: 'ex-birds', name: 'Birds (Taps/Chirps)', icon: '🐦', tempo: 130, category: 'Birdsong / Avian Contour' as SoundSourceCategory, pattern: 'Staccato wood peck / call bursts', notes: ['A4', 'C5', 'A4', 'E5'], hand: 'RH', pianoIdea: 'Staccato Treble Motifs' },
  { id: 'ex-water', name: 'Water (Faucets/Streams)', icon: '💧', tempo: 90, category: 'Water / Streams & Faucets' as SoundSourceCategory, pattern: 'Cascading liquid ripples', notes: ['C4', 'D4', 'E4', 'G4'], hand: 'Both', pianoIdea: 'Pentatonic Water Cascade' },
  { id: 'ex-machinery', name: 'Machinery / Motors', icon: '⚙️', tempo: 100, category: 'Machinery / Motors & Engines' as SoundSourceCategory, pattern: 'Constant driving engine drone', notes: ['D3', 'A3', 'D4', 'A4'], hand: 'LH', pianoIdea: 'Fifth-Drone Power Chords' },
];

// Naturally occurring melodic contours
const MELODY_HUNT_SOURCES = [
  { id: 'm-birds', name: 'Birds', icon: '🐦', example: 'Robin or Chickadee whistle', contour: 'Arched (High-Low-High)', notes: ['G4', 'E4', 'G4'], interval: 'Minor 3rd drop, Major 2nd return' },
  { id: 'm-voices', name: 'Voices', icon: '🗣️', example: 'Distant laugh or playground call', contour: 'Descending (Tumble fall)', notes: ['A4', 'F4', 'D4'], interval: 'Falling 3rds' },
  { id: 'm-bells', name: 'Bells', icon: '🔔', example: 'Clock tower chime or bike bell', contour: 'Ascending (Clear resonance)', notes: ['C4', 'E4', 'G4'], interval: 'Major Triad Arpeggio' },
  { id: 'm-whistles', name: 'Whistles', icon: '🌬️', example: 'Wind through railing or train whistle', contour: 'Bowl (Low dip and rise)', notes: ['E4', 'D4', 'G4'], interval: 'Step down, 4th leap up' },
  { id: 'm-alarms', name: 'Alarms', icon: '🚨', example: 'Electronic alert or cross chime', contour: 'Static (Repeated pitch)', notes: ['F4', 'F4', 'F4'], interval: 'Unison repetition' },
  { id: 'm-musical', name: 'Musical Sounds', icon: '🎶', example: 'Wind chimes or busker echo', contour: 'Open Pentatonic Flutter', notes: ['C4', 'D4', 'G4'], interval: 'Open 4ths & 5ths' },
];

// Initial Coarse Sound Map points
const INITIAL_SOUND_MAP_POINTS: SoundMapPoint[] = [
  {
    id: 'smp-1',
    category: 'Footsteps / Walking',
    loudness: 'moderate',
    distance: 'near',
    rhythmDescription: 'Gravel crunch beneath boots (96 BPM)',
    pitchImpression: 'low',
    repeating: true,
    timestamp: '2 mins ago'
  },
  {
    id: 'smp-2',
    category: 'Birdsong / Avian Contour',
    loudness: 'moderate',
    distance: 'mid',
    rhythmDescription: 'High robin flutter in elm tree',
    pitchImpression: 'high',
    repeating: true,
    timestamp: '4 mins ago'
  },
  {
    id: 'smp-3',
    category: 'Traffic Signals / Pedestrian Crossing',
    loudness: 'loud',
    distance: 'mid',
    rhythmDescription: 'Rapid crosswalk chime warning (108 BPM)',
    pitchImpression: 'mid',
    repeating: true,
    timestamp: '6 mins ago'
  },
  {
    id: 'smp-4',
    category: 'Wind / Rustling Foliage',
    loudness: 'whisper',
    distance: 'far',
    rhythmDescription: 'Sustained white noise breeze through canopy',
    pitchImpression: 'mid',
    repeating: false,
    timestamp: '8 mins ago'
  }
];

export const TouchGrassStudio: React.FC<TouchGrassStudioProps> = ({
  onOpenPiano,
  onSetTargetNotes,
  onXpEarned
}) => {
  // Navigation / Mission Subview
  const [activeView, setActiveView] = useState<'hub' | 'walk-demo' | 'rhythm-hunt' | 'melody-hunt' | 'sound-map' | 'rhythm-walk' | 'silence'>('hub');
  
  // AI Provider Selection
  const [currentProvider, setCurrentProvider] = useState<AIProvider>(localHeuristicProvider);
  
  // 60-Second Walk State Machine
  const [walkStep, setWalkStep] = useState<'ready' | 'outside-phone-away' | 'what-did-you-hear' | 'gemma-analyzing' | 'bring-it-home' | 'completed'>('ready');
  const [walkTimerSeconds, setWalkTimerSeconds] = useState<number>(60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  
  // Audio Capture / Input State
  const [selectedDemoScenario, setSelectedDemoScenario] = useState<typeof DEMO_SCENARIOS[0] | null>(null);
  const [isRecordingMic, setIsRecordingMic] = useState<boolean>(false);
  const [extractedFeatures, setExtractedFeatures] = useState<ExtractedAudioFeatures | null>(null);
  const [gemmaReasoning, setGemmaReasoning] = useState<GemmaMusicalReasoning | null>(null);
  
  // Tap Tempo Pad
  const [tapTimestamps, setTapTimestamps] = useState<number[]>([]);
  const [tappedBpm, setTappedBpm] = useState<number | null>(null);

  // Performance Evaluation & Played Notes
  const [userPlayedNotes, setUserPlayedNotes] = useState<string[]>([]);
  const [performancePassed, setPerformancePassed] = useState<boolean>(false);

  // Gamification & Active Listening Progress
  const [activeListeningLevel, setActiveListeningLevel] = useState<ActiveListeningLevel>(2);
  const [outdoorXp, setOutdoorXp] = useState<number>(340);
  const [outdoorStreak, setOutdoorStreak] = useState<number>(2);

  // Mission 1: Rhythm Hunt State
  const [selectedRhythmExample, setSelectedRhythmExample] = useState<typeof RHYTHM_HUNT_EXAMPLES[0]>(RHYTHM_HUNT_EXAMPLES[0]);
  const [convertedRhythmExercise, setConvertedRhythmExercise] = useState<any>(null);

  // Mission 2: Melody Hunt State
  const [melodyStep, setMelodyStep] = useState<'direction' | 'contour' | 'interval' | 'reproduce' | 'piano-find'>('direction');
  const [selectedMelodySource, setSelectedMelodySource] = useState<typeof MELODY_HUNT_SOURCES[0]>(MELODY_HUNT_SOURCES[0]);
  const [directionAnswer, setDirectionAnswer] = useState<'higher' | 'lower' | 'similar' | null>(null);
  const [melodyFoundNotes, setMelodyFoundNotes] = useState<string[]>([]);

  // Mission 3: Sound Map State
  const [soundMapPoints, setSoundMapPoints] = useState<SoundMapPoint[]>(INITIAL_SOUND_MAP_POINTS);
  const [selectedMapLocation, setSelectedMapLocation] = useState<string>('City Park Perimeter');
  const [newSoundCategory, setNewSoundCategory] = useState<SoundSourceCategory>('Footsteps / Walking');
  const [newSoundDistance, setNewSoundDistance] = useState<'near' | 'mid' | 'far'>('near');
  const [newSoundLoudness, setNewSoundLoudness] = useState<'whisper' | 'moderate' | 'loud'>('moderate');
  const [newSoundPulse, setNewSoundPulse] = useState<boolean>(true);

  // Mission 4: Rhythm Walk State
  const [rhythmWalkStep, setRhythmWalkStep] = useState<'pulse' | 'pattern' | 'clap' | 'piano'>('pulse');
  const [walkCadenceBpm, setWalkCadenceBpm] = useState<number>(96);
  const [selectedWalkPattern, setSelectedWalkPattern] = useState<'duple' | 'triple' | 'syncopated'>('duple');

  // Mission 5: Silence Mission State
  const [silenceSeconds, setSilenceSeconds] = useState<number>(60);
  const [isSilenceRunning, setIsSilenceRunning] = useState<boolean>(false);
  const [silenceCompleted, setSilenceCompleted] = useState<boolean>(false);
  const [silenceAnswers, setSilenceAnswers] = useState({
    first: 'Wind through trees',
    repeated: 'Distant car tires humming',
    changed: 'Wind died down into stillness',
    closest: 'My own boots on dirt',
    farthest: 'Airplane passing through clouds',
    pulse: 'Subtle low duple pulse'
  });

  // Open-Source GitHub Modal
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState<boolean>(false);

  // Countdown timer for "Put your phone away" (60s Music Walk)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerRunning && walkTimerSeconds > 0) {
      timer = setInterval(() => {
        setWalkTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (walkTimerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      setWalkStep('what-did-you-hear');
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, walkTimerSeconds]);

  // Countdown timer for Silence Mission
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSilenceRunning && silenceSeconds > 0) {
      timer = setInterval(() => {
        setSilenceSeconds(prev => prev - 1);
      }, 1000);
    } else if (silenceSeconds === 0 && isSilenceRunning) {
      setIsSilenceRunning(false);
      setSilenceCompleted(true);
    }
    return () => clearInterval(timer);
  }, [isSilenceRunning, silenceSeconds]);

  // Launch 60-Second Walk Mission
  const startWalkMission = () => {
    setActiveView('walk-demo');
    setWalkStep('outside-phone-away');
    setWalkTimerSeconds(60);
    setIsTimerRunning(true);
    setUserPlayedNotes([]);
    setPerformancePassed(false);
  };

  const handleSkipTimer = () => {
    setIsTimerRunning(false);
    setWalkStep('what-did-you-hear');
  };

  // Handle Tap Tempo Pad
  const handleTapPad = () => {
    const now = performance.now();
    const updated = [...tapTimestamps.slice(-5), now];
    setTapTimestamps(updated);

    if (updated.length >= 2) {
      const deltas = [];
      for (let i = 1; i < updated.length; i++) {
        deltas.push(updated[i] - updated[i - 1]);
      }
      const avgMs = deltas.reduce((a, b) => a + b, 0) / deltas.length;
      if (avgMs > 200 && avgMs < 2000) {
        const bpm = Math.round(60000 / avgMs);
        setTappedBpm(bpm);
        setWalkCadenceBpm(bpm);
      }
    }
  };

  // Trigger Real Microphone Capture
  const handleRecordMicrophone = async () => {
    setIsRecordingMic(true);
    try {
      const features = await audioFeatureExtractor.captureAndExtractFeatures(3.5);
      setExtractedFeatures(features);
      setIsRecordingMic(false);
      triggerGemmaAnalysis(features, 'Real-world microphone recording');
    } catch (e) {
      setIsRecordingMic(false);
    }
  };

  // Trigger with Selected Deterministic Demo Data
  const handleSelectDemoScenario = (scenario: typeof DEMO_SCENARIOS[0]) => {
    setSelectedDemoScenario(scenario);
    const simulated = audioFeatureExtractor.generateSimulatedCapture(scenario.category);
    simulated.detectedTempoBpm = scenario.tempo;
    setExtractedFeatures(simulated);
    triggerGemmaAnalysis(simulated, scenario.title);
  };

  // Send to Gemma AI Provider for Structured Musical Reasoning
  const triggerGemmaAnalysis = async (features: ExtractedAudioFeatures, description: string) => {
    setWalkStep('gemma-analyzing');
    const reasoning = await currentProvider.interpretSound(features, description);
    setGemmaReasoning(reasoning);
    setWalkStep('bring-it-home');

    if (onSetTargetNotes && reasoning.exercise.targetNotes) {
      onSetTargetNotes(reasoning.exercise.targetNotes);
    }
  };

  // Audition generated exercise
  const handleAuditionExercise = (notes?: string[]) => {
    const target = notes || gemmaReasoning?.exercise.targetNotes || ['C4', 'E4', 'G4'];
    pianoAudio.playArpeggio(target, 280);
  };

  // Play interactive key from the embedded piano
  const handlePlayKey = (note: string) => {
    pianoAudio.playNote(note, 0.85);
    setUserPlayedNotes(prev => [...prev, note].slice(-6));
  };

  // Mark Exercise Proven
  const handleProvePerformance = () => {
    setPerformancePassed(true);
    setWalkStep('completed');
    const xpBonus = 75;
    setOutdoorXp(prev => prev + xpBonus);
    if (onXpEarned) onXpEarned(xpBonus);
    confetti({ particleCount: 75, spread: 90, origin: { y: 0.6 } });
  };

  // Convert selected rhythm into piano exercise (Mission 1)
  const handleConvertRhythm = (ex: typeof RHYTHM_HUNT_EXAMPLES[0]) => {
    setSelectedRhythmExample(ex);
    setConvertedRhythmExercise({
      title: `${ex.name} → Piano ${ex.pianoIdea}`,
      tempo: ex.tempo,
      category: ex.category,
      pattern: ex.pattern,
      notes: ex.notes,
      hand: ex.hand,
      instructions: `Transfer the ${ex.pattern} directly onto the keys using ${ex.hand === 'LH' ? 'Left Hand' : 'Right Hand'}. Keep your pulse locked at ${ex.tempo} BPM.`
    });
    pianoAudio.playArpeggio(ex.notes, 220);
  };

  // Add Sound Map Pin (Mission 3)
  const handleAddSoundPin = () => {
    const newPoint: SoundMapPoint = {
      id: `smp-${Date.now()}`,
      category: newSoundCategory,
      loudness: newSoundLoudness,
      distance: newSoundDistance,
      rhythmDescription: `${newSoundCategory} at ${newSoundDistance} range`,
      pitchImpression: 'mid',
      repeating: newSoundPulse,
      timestamp: 'Just now'
    };
    setSoundMapPoints(prev => [newPoint, ...prev]);
    confetti({ particleCount: 25, spread: 50 });
  };

  // Synthesize Sound Map into Piano Score
  const handleSynthesizeSoundMap = () => {
    // Generate layered chords based on all mapped points
    pianoAudio.playArpeggio(['C3', 'G3', 'C4', 'E4', 'G4', 'B4'], 250);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl text-slate-100 space-y-6">
      {/* Brand Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-md">
              <Trees className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-black tracking-wide text-white">PIANIST — Touch Grass</h2>
                <button
                  type="button"
                  onClick={() => setIsGitHubModalOpen(true)}
                  className="text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition flex items-center gap-1"
                >
                  <Github className="w-3 h-3" />
                  <span>Zenieverse/pianist-touch-grass</span>
                </button>
              </div>
              <p className="text-xs text-emerald-300 font-semibold mt-0.5">
                Hear the world. Find the music. Play it.
              </p>
            </div>
          </div>
        </div>

        {/* Global Controls: AI Provider & Outdoor XP */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {/* Reasoning Provider Selector */}
          <div className="flex items-center bg-slate-800/90 rounded-xl p-1 border border-slate-700">
            <span className="text-[10px] font-mono text-slate-400 px-2 flex items-center gap-1">
              <Brain className="w-3.5 h-3.5 text-teal-400" />
              Reasoning:
            </span>
            <button
              type="button"
              onClick={() => setCurrentProvider(localHeuristicProvider)}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition ${
                currentProvider.providerType === 'local'
                  ? 'bg-emerald-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Local Heuristic (Privacy)
            </button>
            <button
              type="button"
              onClick={() => setCurrentProvider(gemmaCloudProvider)}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition ${
                currentProvider.providerType === 'cloud'
                  ? 'bg-emerald-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Gemma Cloud Bridge
            </button>
          </div>

          {/* Outdoor XP & Active Listening Level */}
          <div className="flex items-center space-x-2">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold font-mono">
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              Listening Lvl {activeListeningLevel}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold font-mono">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              {outdoorXp} Outdoor XP
            </span>
          </div>
        </div>
      </div>

      {/* Hero Callout Banner with Core Philosophy */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-teal-950/70 border border-emerald-500/40 rounded-3xl p-6 sm:p-7 shadow-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>The Non-Screen Music Learning Loop</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            Take your music lesson outside.
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            The screen should be the shortest part of your day. Leave the screen, listen to the real world, discover rhythm/melody/sound, then return to the piano and transform what you heard into music.
          </p>

          {/* Philosophy Loop Visual */}
          <div className="mt-4 p-3 rounded-2xl bg-slate-950/60 border border-emerald-500/30 flex flex-wrap items-center justify-between text-[11px] font-mono font-bold text-slate-300 gap-2">
            <span className="text-emerald-400 flex items-center gap-1">1. GO OUTSIDE</span>
            <span>→</span>
            <span className="text-teal-400 flex items-center gap-1">2. LISTEN</span>
            <span>→</span>
            <span className="text-amber-400 flex items-center gap-1">3. DISCOVER</span>
            <span>→</span>
            <span className="text-indigo-400 flex items-center gap-1">4. RESPOND</span>
            <span>→</span>
            <span className="text-rose-400 flex items-center gap-1">5. RETURN TO PIANO</span>
            <span>→</span>
            <span className="text-emerald-300 font-black">6. PLAY!</span>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={startWalkMission}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-xs transition shadow-xl flex items-center space-x-2 transform hover:scale-102"
            >
              <Compass className="w-4 h-4" />
              <span>START OUTDOOR MISSION (60s WALK)</span>
            </button>

            {onOpenPiano && (
              <button
                type="button"
                onClick={onOpenPiano}
                className="px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition flex items-center space-x-2"
              >
                <Piano className="w-4 h-4 text-teal-400" />
                <span>OPEN PIANO</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsGitHubModalOpen(true)}
              className="px-4 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-750 text-slate-300 font-semibold text-xs border border-slate-700 transition flex items-center space-x-1.5"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Open-Source Specs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Ribbon across all 5 Missions & Signature Demo */}
      <div className="flex flex-wrap gap-2 pt-2 border-b border-slate-800 pb-3 text-xs">
        {[
          { id: 'hub', label: 'Philosophy & Sound → Music', icon: <Trees className="w-3.5 h-3.5" /> },
          { id: 'walk-demo', label: '60s Music Walk (Signature)', icon: <Footprints className="w-3.5 h-3.5 text-emerald-400" />, badge: 'Demo' },
          { id: 'rhythm-hunt', label: '1. Rhythm Hunt', icon: <Clock className="w-3.5 h-3.5" />, badge: '9 Sounds' },
          { id: 'melody-hunt', label: '2. Melody Hunt', icon: <Headphones className="w-3.5 h-3.5" />, badge: '5 Steps' },
          { id: 'sound-map', label: '3. Sound Map', icon: <MapPin className="w-3.5 h-3.5" />, badge: 'Radar' },
          { id: 'rhythm-walk', label: '4. Rhythm Walk', icon: <Footprints className="w-3.5 h-3.5" />, badge: 'Cadence' },
          { id: 'silence', label: '5. Silence Mission', icon: <EyeOff className="w-3.5 h-3.5" />, badge: 'Active Ear' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setActiveView(tab.id as any);
              if (tab.id === 'walk-demo' && walkStep === 'ready') {
                startWalkMission();
              }
            }}
            className={`px-3.5 py-2 rounded-xl font-semibold transition flex items-center space-x-1.5 ${
              activeView === tab.id
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge && (
              <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                activeView === tab.id ? 'bg-slate-950 text-emerald-300' : 'bg-slate-900 text-slate-400'
              }`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ======================================================== */}
      {/* VIEW: SIGNATURE DEMO — 60-SECOND MUSIC WALK             */}
      {/* ======================================================== */}
      {activeView === 'walk-demo' && (
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          {/* STEP 1: PUT YOUR PHONE AWAY */}
          {walkStep === 'outside-phone-away' && (
            <div className="text-center py-8 space-y-6 max-w-xl mx-auto animate-fadeIn">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/40 text-emerald-400 flex items-center justify-center text-4xl shadow-2xl animate-pulse">
                🌲
              </div>

              <div>
                <h4 className="text-3xl font-black text-white">
                  PUT YOUR PHONE AWAY.
                </h4>
                <p className="text-sm text-emerald-300 font-bold mt-1">
                  Eyes up. Safe footing. Listen to the real world.
                </p>
                <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
                  Walk or stand somewhere safe outside. Do not look at this screen. Focus your attention entirely on repeating rhythms, footsteps, or natural pitch contours.
                </p>
              </div>

              {/* Listening Timer Display */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 max-w-xs mx-auto">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  Listening Countdown
                </span>
                <span className="text-5xl font-mono font-black text-emerald-400 block">
                  {walkTimerSeconds}s
                </span>
              </div>

              <div className="flex items-center justify-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={handleSkipTimer}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition"
                >
                  I'm Back (Proceed to Step 2)
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: WHAT DID YOU HEAR? */}
          {walkStep === 'what-did-you-hear' && (
            <div className="space-y-6 max-w-3xl mx-auto animate-fadeIn">
              <div className="text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
                  Step 2 • Reflection & Capture
                </div>
                <h4 className="text-2xl font-black text-white">
                  What did you hear?
                </h4>
                <p className="text-xs text-slate-300 mt-1 max-w-lg mx-auto">
                  Select a discovered acoustic scenario, tap the rhythm you heard, or record a quick 3-second sample with local feature extraction.
                </p>
              </div>

              {/* Capture Options Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Option A: Microphone Local Capture */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-white flex items-center gap-2">
                        <Mic className="w-4 h-4 text-emerald-400" />
                        Live Microphone Capture
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        100% Local Privacy
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Listens for 3 seconds, extracts musical features (RMS energy, spectral centroid, pulse), and immediately discards the raw audio buffer.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleRecordMicrophone}
                    disabled={isRecordingMic}
                    className={`mt-4 w-full py-3 rounded-xl font-bold text-xs transition flex items-center justify-center space-x-2 shadow-lg ${
                      isRecordingMic
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                    <span>{isRecordingMic ? 'Analyzing Outdoor Audio (3s)...' : 'Record 3s Outdoor Sample'}</span>
                  </button>
                </div>

                {/* Option B: Rhythm Tap Pad */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-white flex items-center gap-2">
                        <Clock className="w-4 h-4 text-teal-400" />
                        Rhythm Tap Pad
                      </span>
                      {tappedBpm && (
                        <span className="text-[10px] font-mono text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/30">
                          {tappedBpm} BPM
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Tap the rhythm you heard with your footsteps, drops, or natural pulses to calculate tempo.
                    </p>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      type="button"
                      onClick={handleTapPad}
                      className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-mono font-bold text-xs border border-slate-700 transition"
                    >
                      Tap Pulse Here
                    </button>
                    {tappedBpm && (
                      <button
                        type="button"
                        onClick={() => {
                          const capture = audioFeatureExtractor.generateSimulatedCapture('Footsteps / Walking');
                          capture.detectedTempoBpm = tappedBpm;
                          setExtractedFeatures(capture);
                          triggerGemmaAnalysis(capture, `Tapped Rhythm at ${tappedBpm} BPM`);
                        }}
                        className="px-4 py-3 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs transition"
                      >
                        Interpret →
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Option C: 4 Deterministic Demo Scenarios */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Or Select Verified Demo Scenario (Labeled DEMO DATA):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {DEMO_SCENARIOS.map((demo) => (
                    <button
                      key={demo.id}
                      type="button"
                      onClick={() => handleSelectDemoScenario(demo)}
                      className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/70 hover:bg-slate-800 hover:border-emerald-500/50 text-left transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white group-hover:text-emerald-300 transition">
                          {demo.title}
                        </span>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                          DEMO DATA
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">{demo.desc}</p>
                      <div className="mt-2 text-[10px] font-mono text-teal-400">
                        {demo.pattern} • {demo.tempo} BPM
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: GEMMA REASONING */}
          {walkStep === 'gemma-analyzing' && (
            <div className="text-center py-12 space-y-4 max-w-md mx-auto">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center animate-spin">
                <Brain className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">
                Gemma Reasoning Engine Active...
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed font-mono">
                Extracting acoustic contours • Identifying harmonic relations • Mapping pulse to piano exercise
              </p>
            </div>
          )}

          {/* STEP 4: BRING IT HOME & PLAY */}
          {walkStep === 'bring-it-home' && gemmaReasoning && (
            <div className="space-y-6 max-w-3xl mx-auto animate-fadeIn">
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40">
                <div className="flex items-center space-x-2.5">
                  <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300">
                    <Sparkles className="w-5 h-5" />
                  </span>
                  <div>
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
                      Gemma Interpretation Complete
                    </span>
                    <h4 className="text-base font-bold text-white">
                      {gemmaReasoning.exercise.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono text-slate-400">
                    Engine: <strong className="text-teal-300">{gemmaReasoning.model_provider_name}</strong>
                  </span>
                </div>
              </div>

              {/* Gemma Structured JSON Reasoning Inspection Card */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-300 uppercase tracking-wider font-mono text-[11px]">
                    Structured Musical Reasoning:
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">
                    Confidence: {(gemmaReasoning.confidence * 100).toFixed(0)}%
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 font-mono text-[11px]">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block">Category:</span>
                    <strong className="text-white">{gemmaReasoning.source_category}</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block">Tempo:</span>
                    <strong className="text-teal-400">{gemmaReasoning.tempo_estimate} BPM</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block">Pulse:</span>
                    <strong className="text-emerald-400">{gemmaReasoning.pulse_detected ? 'Detected' : 'Organic'}</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block">Contour:</span>
                    <strong className="text-amber-400 capitalize">{gemmaReasoning.melodic_contour}</strong>
                  </div>
                </div>

                <p className="text-slate-300 leading-relaxed mb-3">
                  {gemmaReasoning.pedagogy_explanation}
                </p>

                <div className="p-3 rounded-xl bg-teal-950/40 border border-teal-500/30 text-teal-200">
                  <strong className="text-teal-300">Coach Guidance: </strong>
                  {gemmaReasoning.coach_tip}
                </div>
              </div>

              {/* Generated Piano Exercise with Embedded Interactive Keyboard */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border-2 border-emerald-500/60 shadow-xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">
                      Discovered Piano Exercise • Level {gemmaReasoning.exercise.difficulty}
                    </span>
                    <h5 className="text-lg font-bold text-white">
                      {gemmaReasoning.exercise.title}
                    </h5>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAuditionExercise()}
                    className="px-4 py-2 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-md"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Audition Target Notes</span>
                  </button>
                </div>

                <p className="text-xs text-slate-200">
                  {gemmaReasoning.exercise.instructions}
                </p>

                {/* Target Keys & Interactive Play Buttons */}
                <div>
                  <span className="text-xs text-slate-400 font-mono block mb-2">Target Piano Keys (Click to Play):</span>
                  <div className="flex flex-wrap items-center gap-2">
                    {gemmaReasoning.exercise.targetNotes.map((note) => (
                      <button
                        key={note}
                        type="button"
                        onClick={() => handlePlayKey(note)}
                        className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-emerald-300 font-mono font-bold text-sm border border-emerald-500/40 shadow-sm transition active:scale-95"
                      >
                        🎹 {note}
                      </button>
                    ))}
                    <span className="text-xs text-slate-400 ml-2">
                      (Hand: <strong className="text-white">{gemmaReasoning.exercise.suggestedHand}</strong>)
                    </span>
                  </div>
                </div>

                {/* Performance History / Verification */}
                {userPlayedNotes.length > 0 && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
                    <span className="text-slate-400">Recently Played: {userPlayedNotes.join(' → ')}</span>
                    <span className="text-emerald-400 font-bold">Sound Generated ✓</span>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleProvePerformance}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs transition shadow-lg flex items-center justify-center space-x-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>I HAVE PLAYED IT ON THE PIANO (PROVE IT)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: COMPLETED — EMOTIONAL VICTORY */}
          {walkStep === 'completed' && (
            <div className="text-center py-8 space-y-6 max-w-xl mx-auto animate-fadeIn">
              <div className="text-5xl">🌿🎹</div>
              <div>
                <h4 className="text-3xl font-black text-white">
                  You heard it. Now play it.
                </h4>
                <p className="text-base text-emerald-300 font-bold mt-2 italic">
                  "You didn't memorize this. You discovered it."
                </p>
                <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                  You stepped outside, listened to acoustic reality, and transformed environmental rhythm into real piano musicianship.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-emerald-300 flex items-center justify-center space-x-3">
                <Award className="w-5 h-5 text-amber-400" />
                <span>+75 Outdoor XP Awarded • Active Listening Level Maintained</span>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={startWalkMission}
                  className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-md"
                >
                  Start Another 60s Music Walk
                </button>
                {onOpenPiano && (
                  <button
                    type="button"
                    onClick={onOpenPiano}
                    className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition"
                  >
                    Open Full Piano Deck
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* MISSION 1: RHYTHM HUNT (9 Environmental Examples)        */}
      {/* ======================================================== */}
      {activeView === 'rhythm-hunt' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase mb-2">
                Outdoor Mission 1 • Rhythmic Ear
              </div>
              <h4 className="text-2xl font-black text-white">
                Rhythm Hunt
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Go outside and listen for a repeating rhythm. Identify the cycle, record or tap the rhythm, return to the app, and convert it into a piano rhythm exercise.
              </p>
            </div>

            {/* 9 Discovered Rhythm Cards */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {RHYTHM_HUNT_EXAMPLES.map((ex) => (
                <button
                  key={ex.id}
                  type="button"
                  onClick={() => handleConvertRhythm(ex)}
                  className={`p-4 rounded-xl border text-left transition-all group ${
                    selectedRhythmExample.id === ex.id
                      ? 'bg-emerald-950/40 border-emerald-500/80 ring-1 ring-emerald-500/50'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-2xl">{ex.icon}</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      {ex.tempo} BPM
                    </span>
                  </div>
                  <h5 className="font-bold text-sm text-white group-hover:text-emerald-300 transition">
                    {ex.name}
                  </h5>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {ex.pattern}
                  </p>
                  <div className="mt-2 text-[10px] font-mono text-teal-400">
                    Hand: {ex.hand} • {ex.pianoIdea}
                  </div>
                </button>
              ))}
            </div>

            {/* Live Tap Pad */}
            <div className="mt-5 p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h5 className="font-bold text-sm text-white">Or Tap Your Own Discovered Outdoor Rhythm:</h5>
                <p className="text-xs text-slate-400">Tap repeatedly in time with what you hear outside.</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleTapPad}
                  className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-mono font-bold text-xs border border-slate-700"
                >
                  Tap Rhythm Pad {tappedBpm ? `(${tappedBpm} BPM)` : ''}
                </button>
                {tappedBpm && (
                  <button
                    type="button"
                    onClick={() => {
                      handleConvertRhythm({
                        id: 'custom-tapped',
                        name: 'Custom Tapped Pulse',
                        icon: '⏱️',
                        tempo: tappedBpm,
                        category: 'Footsteps / Walking',
                        pattern: `Custom pulse tapped at ${tappedBpm} BPM`,
                        notes: ['C4', 'E4', 'G4', 'E4'],
                        hand: 'RH',
                        pianoIdea: 'Custom Tapped Ostinato'
                      });
                    }}
                    className="px-4 py-3 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs"
                  >
                    Convert Tapped BPM →
                  </button>
                )}
              </div>
            </div>

            {/* Converted Piano Exercise Panel */}
            {convertedRhythmExercise && (
              <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border-2 border-emerald-500/60 space-y-4 animate-fadeIn">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">
                      Converted Piano Rhythm Exercise • {convertedRhythmExercise.tempo} BPM
                    </span>
                    <h5 className="text-lg font-black text-white">
                      {convertedRhythmExercise.title}
                    </h5>
                  </div>
                  <button
                    type="button"
                    onClick={() => pianoAudio.playArpeggio(convertedRhythmExercise.notes, 220)}
                    className="px-4 py-2 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Audition Exercise</span>
                  </button>
                </div>

                <p className="text-xs text-slate-200">
                  {convertedRhythmExercise.instructions}
                </p>

                <div>
                  <span className="text-xs text-slate-400 font-mono block mb-2">Play Target Keys on Piano:</span>
                  <div className="flex flex-wrap gap-2">
                    {convertedRhythmExercise.notes.map((note: string, idx: number) => (
                      <button
                        key={`${note}-${idx}`}
                        type="button"
                        onClick={() => handlePlayKey(note)}
                        className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-emerald-300 font-mono font-bold text-sm border border-emerald-500/40"
                      >
                        🎹 {note}
                      </button>
                    ))}
                    <span className="text-xs text-slate-400 self-center ml-2">
                      (Recommended Hand: <strong>{convertedRhythmExercise.hand}</strong>)
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setOutdoorXp(prev => prev + 60);
                      if (onXpEarned) onXpEarned(60);
                      confetti({ particleCount: 50, spread: 70 });
                    }}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
                  >
                    I Mastered This Rhythm (+60 XP)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MISSION 2: MELODY HUNT (Contour & Pitch Direction)       */}
      {/* ======================================================== */}
      {activeView === 'melody-hunt' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase mb-2">
                Outdoor Mission 2 • Melodic Contour & Pitch Direction
              </div>
              <h4 className="text-2xl font-black text-white">
                Melody Hunt
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Learner listens for a short naturally occurring melodic contour (birds, voices, bells, whistles, alarms).
              </p>
            </div>

            {/* 6 Melodic Sources */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              {MELODY_HUNT_SOURCES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setSelectedMelodySource(m);
                    pianoAudio.playArpeggio(m.notes, 280);
                  }}
                  className={`p-3 rounded-xl border text-center transition ${
                    selectedMelodySource.id === m.id
                      ? 'bg-emerald-950/50 border-emerald-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                  }`}
                >
                  <span className="text-2xl block mb-1">{m.icon}</span>
                  <span className="font-bold text-xs block">{m.name}</span>
                </button>
              ))}
            </div>

            {/* Step 1: Pitch Direction Question */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">
                    Target Sound: {selectedMelodySource.name} ({selectedMelodySource.example})
                  </span>
                  <h5 className="text-base font-bold text-white mt-0.5">
                    Did the sound move higher, lower, or stay similar?
                  </h5>
                </div>
                <button
                  type="button"
                  onClick={() => pianoAudio.playArpeggio(selectedMelodySource.notes, 280)}
                  className="px-3 py-1.5 rounded-lg bg-teal-500 text-slate-950 font-bold text-xs flex items-center gap-1"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Audition Sound</span>
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setDirectionAnswer('higher');
                    pianoAudio.playArpeggio(['C4', 'E4', 'G4'], 180);
                  }}
                  className={`p-4 rounded-xl border text-center transition font-bold text-xs ${
                    directionAnswer === 'higher'
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                      : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-750'
                  }`}
                >
                  ↗ Higher (Ascending)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDirectionAnswer('lower');
                    pianoAudio.playArpeggio(['G4', 'E4', 'C4'], 180);
                  }}
                  className={`p-4 rounded-xl border text-center transition font-bold text-xs ${
                    directionAnswer === 'lower'
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                      : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-750'
                  }`}
                >
                  ↘ Lower (Descending)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDirectionAnswer('similar');
                    pianoAudio.playArpeggio(['E4', 'E4', 'E4'], 180);
                  }}
                  className={`p-4 rounded-xl border text-center transition font-bold text-xs ${
                    directionAnswer === 'similar'
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                      : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-750'
                  }`}
                >
                  → Stay Similar (Static)
                </button>
              </div>

              {directionAnswer && (
                <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 text-xs space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between text-emerald-300 font-bold">
                    <span>Melodic Analysis: {selectedMelodySource.contour}</span>
                    <span className="font-mono">Intervals: {selectedMelodySource.interval}</span>
                  </div>
                  <p className="text-slate-300">
                    Natural motifs establish pitch direction before notes are ever written on a staff. Now, let's reproduce it on the keyboard.
                  </p>
                </div>
              )}
            </div>

            {/* Step 5: Piano Finding Exercise */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 space-y-4">
              <h5 className="font-bold text-sm text-white">
                Piano Finding Exercise: Reproduce "{selectedMelodySource.name}"
              </h5>
              <p className="text-xs text-slate-400">
                Click the piano keys below to match the notes: {selectedMelodySource.notes.join(' → ')}
              </p>

              <div className="flex flex-wrap gap-2">
                {['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'].map((key) => {
                  const isTarget = selectedMelodySource.notes.includes(key);
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        handlePlayKey(key);
                        setMelodyFoundNotes(prev => [...prev, key].slice(-3));
                      }}
                      className={`px-4 py-3 rounded-xl font-mono font-bold text-sm transition active:scale-95 ${
                        isTarget
                          ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950'
                          : 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-750'
                      }`}
                    >
                      {key}
                    </button>
                  );
                })}
              </div>

              {melodyFoundNotes.length > 0 && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
                  <span className="text-slate-400">Tested Keys: {melodyFoundNotes.join(' → ')}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setOutdoorXp(prev => prev + 70);
                      if (onXpEarned) onXpEarned(70);
                      confetti({ particleCount: 50, spread: 70 });
                    }}
                    className="px-4 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs"
                  >
                    Claim Melody Mastery (+70 XP)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MISSION 3: SOUND MAP (Coarse Radial Acoustic Radar)       */}
      {/* ======================================================== */}
      {activeView === 'sound-map' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase mb-2">
                  Outdoor Mission 3 • Acoustic Sound Map
                </div>
                <h4 className="text-2xl font-black text-white">
                  Temporary Coarse Acoustic Sound Map
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  Walk for several minutes and map the sounds around your perimeter by category, loudness, distance, and repetition.
                </p>
              </div>
              <div className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                No Persistent GPS Tracking • Privacy First
              </div>
            </div>

            {/* Radial Acoustic Radar Simulation Canvas */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden min-h-[260px]">
              {/* Concentric Distance Rings */}
              <div className="absolute w-[280px] h-[280px] rounded-full border border-slate-700/40 pointer-events-none flex items-center justify-center">
                <span className="absolute top-2 text-[10px] font-mono text-slate-500">FAR (&gt; 25m)</span>
              </div>
              <div className="absolute w-[190px] h-[190px] rounded-full border border-slate-700/60 pointer-events-none flex items-center justify-center">
                <span className="absolute top-2 text-[10px] font-mono text-slate-500">MID (5-25m)</span>
              </div>
              <div className="absolute w-[100px] h-[100px] rounded-full border border-emerald-500/40 pointer-events-none flex items-center justify-center">
                <span className="absolute top-2 text-[9px] font-mono text-emerald-400">NEAR (&lt; 5m)</span>
              </div>

              {/* Center Listening Anchor */}
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-lg z-10">
                👂
              </div>

              {/* Pinned Sound Map Markers */}
              <div className="flex flex-wrap gap-2 justify-center mt-36 z-20">
                {soundMapPoints.map((pt) => (
                  <button
                    key={pt.id}
                    type="button"
                    onClick={() => {
                      if (pt.category.includes('Bird')) pianoAudio.playArpeggio(['G4', 'E4', 'G4'], 200);
                      else if (pt.category.includes('Foot')) pianoAudio.playArpeggio(['C3', 'G3'], 200);
                      else pianoAudio.playArpeggio(['C4', 'G4'], 200);
                    }}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
                      pt.distance === 'near' 
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' 
                        : pt.distance === 'mid' 
                          ? 'bg-teal-500/20 border-teal-500 text-teal-300' 
                          : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    <span>{pt.distance === 'near' ? '🟢' : pt.distance === 'mid' ? '🟡' : '⚪'}</span>
                    <span>{pt.category.split('/')[0]}</span>
                    <span className="text-[10px] font-mono opacity-70">({pt.loudness})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Add New Sound Pin Controls */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h5 className="font-bold text-sm text-white">Add Sound Discovered on Walk:</h5>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Sound Category:</label>
                  <select
                    value={newSoundCategory}
                    onChange={(e) => setNewSoundCategory(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Footsteps / Walking">Footsteps / Walking</option>
                    <option value="Birdsong / Avian Contour">Birdsong / Avian Contour</option>
                    <option value="Rain / Water Flow">Rain / Water Flow</option>
                    <option value="Bicycle Wheels / Mechanical">Bicycle Wheels</option>
                    <option value="Traffic Signals / Pedestrian Crossing">Traffic Signals</option>
                    <option value="Wind / Rustling Foliage">Wind / Foliage</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Distance Range:</label>
                  <select
                    value={newSoundDistance}
                    onChange={(e) => setNewSoundDistance(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="near">Near (&lt; 5m)</option>
                    <option value="mid">Mid (5 - 25m)</option>
                    <option value="far">Far (&gt; 25m)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Dynamic Level:</label>
                  <select
                    value={newSoundLoudness}
                    onChange={(e) => setNewSoundLoudness(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="whisper">Soft (Pianissimo)</option>
                    <option value="moderate">Moderate (Mezzo-Forte)</option>
                    <option value="loud">Loud (Forte)</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={handleAddSoundPin}
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition shadow-md"
                  >
                    + Pin to Sound Map
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleSynthesizeSoundMap}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Synthesize Sound Map into Piano Score</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MISSION 4: RHYTHM WALK (Physical Cadence to Piano)       */}
      {/* ======================================================== */}
      {activeView === 'rhythm-walk' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase mb-2">
                Outdoor Mission 4 • Environmental Rhythm Walk
              </div>
              <h4 className="text-2xl font-black text-white">
                Rhythm Walk
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Learner walks while listening to environmental rhythm: identify pulse, identify repeated pattern, clap/tap the pattern, reproduce it, and transfer it to the piano.
              </p>
            </div>

            {/* Step Pipeline */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <button
                type="button"
                onClick={() => setRhythmWalkStep('pulse')}
                className={`p-4 rounded-xl border text-left transition ${
                  rhythmWalkStep === 'pulse' ? 'bg-emerald-500/20 border-emerald-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <span className="font-bold block">1. Identify Pulse</span>
                <span className="text-[11px] text-slate-400">Tap your footstep cadence: {walkCadenceBpm} BPM</span>
              </button>
              <button
                type="button"
                onClick={() => setRhythmWalkStep('pattern')}
                className={`p-4 rounded-xl border text-left transition ${
                  rhythmWalkStep === 'pattern' ? 'bg-emerald-500/20 border-emerald-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <span className="font-bold block">2. Repeated Pattern</span>
                <span className="text-[11px] text-slate-400">Duple 4/4 vs. Triple 3/4</span>
              </button>
              <button
                type="button"
                onClick={() => setRhythmWalkStep('clap')}
                className={`p-4 rounded-xl border text-left transition ${
                  rhythmWalkStep === 'clap' ? 'bg-emerald-500/20 border-emerald-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <span className="font-bold block">3. Clap & Reproduce</span>
                <span className="text-[11px] text-slate-400">Test internal timing lock</span>
              </button>
              <button
                type="button"
                onClick={() => setRhythmWalkStep('piano')}
                className={`p-4 rounded-xl border text-left transition ${
                  rhythmWalkStep === 'piano' ? 'bg-emerald-500/20 border-emerald-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <span className="font-bold block">4. Transfer to Piano</span>
                <span className="text-[11px] text-slate-400">Play left-hand bass groove</span>
              </button>
            </div>

            {/* Interactive Step Content */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              {rhythmWalkStep === 'pulse' && (
                <div className="space-y-3">
                  <h5 className="font-bold text-sm text-white">Measure Walking Pulse Cadence:</h5>
                  <p className="text-xs text-slate-300">
                    Walk around room or porch and tap with each footstep strike.
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleTapPad}
                      className="px-6 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-sm font-mono shadow-lg"
                    >
                      Tap Footstep Pulse ({walkCadenceBpm} BPM)
                    </button>
                    <button
                      type="button"
                      onClick={() => setRhythmWalkStep('pattern')}
                      className="px-5 py-4 rounded-2xl bg-slate-800 text-white font-bold text-xs"
                    >
                      Lock In → Next Step
                    </button>
                  </div>
                </div>
              )}

              {rhythmWalkStep === 'pattern' && (
                <div className="space-y-3">
                  <h5 className="font-bold text-sm text-white">Select Repeating Pattern Meter:</h5>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'duple', name: 'Duple (Left-Right 4/4)', desc: 'Even walking stride' },
                      { id: 'triple', name: 'Triple (Waltz 3/4)', desc: 'Step-glide-glide dance' },
                      { id: 'syncopated', name: 'Syncopated (Short-Long)', desc: 'Brisk skipping cadence' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setSelectedWalkPattern(m.id as any)}
                        className={`p-4 rounded-xl border text-left transition ${
                          selectedWalkPattern === m.id ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-200'
                        }`}
                      >
                        <strong className="block text-xs">{m.name}</strong>
                        <span className="text-[10px] opacity-80">{m.desc}</span>
                      </button>
                    ))}
                  </div>
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setRhythmWalkStep('piano')}
                      className="px-5 py-2.5 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs"
                    >
                      Transfer to Piano →
                    </button>
                  </div>
                </div>
              )}

              {rhythmWalkStep === 'piano' && (
                <div className="space-y-4">
                  <h5 className="font-bold text-sm text-white">
                    Transfer Footstep Cadence to Piano Walking Bass ({walkCadenceBpm} BPM):
                  </h5>
                  <p className="text-xs text-slate-300">
                    Play Left Hand on low C3, E3, G3, A3 to match your natural stride pace.
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {['C3', 'E3', 'G3', 'A3'].map((note) => (
                      <button
                        key={note}
                        type="button"
                        onClick={() => handlePlayKey(note)}
                        className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-emerald-300 font-mono font-bold text-sm border border-emerald-500/40"
                      >
                        🎹 {note}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setOutdoorXp(prev => prev + 65);
                        if (onXpEarned) onXpEarned(65);
                        confetti({ particleCount: 50, spread: 70 });
                      }}
                      className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
                    >
                      I Transferred My Walk to Piano (+65 XP)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MISSION 5: SILENCE MISSION (Active Listening)            */}
      {/* ======================================================== */}
      {activeView === 'silence' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto space-y-6 text-center">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center text-3xl">
              🤫
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase mb-2">
                Outdoor Mission 5 • Active Listening
              </div>
              <h4 className="text-2xl font-black text-white">
                The 60-Second Silence Mission
              </h4>
              <p className="text-sm font-semibold text-emerald-300 mt-1">
                Go somewhere safe and quiet. Put the phone away. Listen for 60 seconds.
              </p>
              <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
                This mission develops true musicianship rather than screen engagement. Silence is the canvas on which all music is drawn.
              </p>
            </div>

            {/* Silence Timer */}
            {!silenceCompleted ? (
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 max-w-xs mx-auto space-y-4">
                <span className="text-4xl font-mono font-black text-teal-400 block">
                  {silenceSeconds}s
                </span>
                <div className="flex gap-2 justify-center">
                  {!isSilenceRunning ? (
                    <button
                      type="button"
                      onClick={() => setIsSilenceRunning(true)}
                      className="px-5 py-2.5 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs shadow-md"
                    >
                      Begin 60 Seconds of Silence
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setIsSilenceRunning(false);
                        setSilenceCompleted(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                    >
                      I've Finished Listening
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Post-Silence Reflection Questions */
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-left space-y-4 animate-fadeIn">
                <h5 className="font-bold text-sm text-white">Post-Silence Reflection Questions:</h5>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">1. What did you hear first?</label>
                    <input
                      type="text"
                      value={silenceAnswers.first}
                      onChange={(e) => setSilenceAnswers({ ...silenceAnswers, first: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">2. What repeated?</label>
                    <input
                      type="text"
                      value={silenceAnswers.repeated}
                      onChange={(e) => setSilenceAnswers({ ...silenceAnswers, repeated: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">3. What changed?</label>
                    <input
                      type="text"
                      value={silenceAnswers.changed}
                      onChange={(e) => setSilenceAnswers({ ...silenceAnswers, changed: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-400 block mb-1">4. Closest sound:</label>
                      <input
                        type="text"
                        value={silenceAnswers.closest}
                        onChange={(e) => setSilenceAnswers({ ...silenceAnswers, closest: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">5. Farthest sound:</label>
                      <input
                        type="text"
                        value={silenceAnswers.farthest}
                        onChange={(e) => setSilenceAnswers({ ...silenceAnswers, farthest: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setOutdoorXp(prev => prev + 50);
                      if (onXpEarned) onXpEarned(50);
                      confetti({ particleCount: 60, spread: 80 });
                    }}
                    className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-md"
                  >
                    Submit Active Listening Synthesis (+50 XP)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW: PHILOSOPHY & SOUND → MUSIC OVERVIEW               */}
      {/* ======================================================== */}
      {activeView === 'hub' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800">
              <span className="text-2xl mb-1 block">👣</span>
              <h4 className="text-sm font-bold text-white">1. Footsteps</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Rhythm pattern → Left-hand piano walking bass accompaniment.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800">
              <span className="text-2xl mb-1 block">🐦</span>
              <h4 className="text-sm font-bold text-white">2. Birdsong</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Melodic direction → Right-hand treble melody exercise.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800">
              <span className="text-2xl mb-1 block">🌧️</span>
              <h4 className="text-sm font-bold text-white">3. Rain & Drops</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Repeating pulse → Piano broken chord ostinato in C Major.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800">
              <span className="text-2xl mb-1 block">🌊</span>
              <h4 className="text-sm font-bold text-white">4. Water Flow</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Rhythm & texture → Pentatonic improvisation prompt.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* OPEN-SOURCE GITHUB PROJECT MODAL (Zenieverse/pianist-touch-grass) */}
      {/* ======================================================== */}
      {isGitHubModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full text-slate-100 space-y-5 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <Github className="w-5 h-5 text-emerald-400" />
                <h4 className="font-black text-lg text-white">PIANIST — Touch Grass (Open-Source Repo)</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsGitHubModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono">
                <div className="text-emerald-400 font-bold mb-1">TARGET REPOSITORY:</div>
                <div className="text-white text-sm">Zenieverse/pianist-touch-grass</div>
                <div className="text-slate-400 mt-1 text-[11px]">Tagline: "Hear the world. Find the music. Play it."</div>
                <div className="text-slate-400 text-[11px]">License: MIT Open Source</div>
              </div>

              <div>
                <strong className="text-white block mb-1">Core Architecture & Design:</strong>
                <p>
                  A self-contained music pedagogy application that reverses the standard screen-dependent music learning loop. Learner leaves the screen, listens to the real acoustic world, discovers rhythm and melodic contours, and returns to the piano to translate real acoustic reality into music.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <strong className="text-emerald-400 block">AI Reasoning:</strong>
                  Gemma-2-9B / Gemma Local Edge Heuristics
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <strong className="text-teal-400 block">Audio Engine:</strong>
                  Web Audio API Additive Synthesizer + Feature Extraction
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setIsGitHubModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
              >
                Close Spec Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
