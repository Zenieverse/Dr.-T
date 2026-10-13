import React, { useState, useEffect } from 'react';
import { 
  ClassicalWork, 
  TheoryLesson, 
  PianoPreset, 
  MusicalPeriod, 
  WorkDifficulty,
  GrandPianoSection 
} from '../types/grandPianoTypes';
import { CLASSICAL_WORKS_DATABASE, THEORY_CURRICULUM_STAGES } from '../data/classicalCatalogueData';
import { grandPianoAudio } from '../audio/grandPianoAudioEngine';
import { GrandPianoKeyboard } from './GrandPianoKeyboard';
import { GrandPianoStaffViewer } from './GrandPianoStaffViewer';
import { LearnByEarWorkspace } from './LearnByEarWorkspace';
import { GrandPianoTutorEngine } from './GrandPianoTutorEngine';
import { ClassicalTrackPlayer } from './ClassicalTrackPlayer';
import { VirtuosoDiplomaModal } from './VirtuosoDiplomaModal';
import { 
  Piano, 
  Music, 
  Headphones, 
  BookOpen, 
  Sparkles, 
  Play, 
  Volume2, 
  Clock, 
  Search, 
  Filter, 
  Compass, 
  ChevronRight, 
  CheckCircle2, 
  Award, 
  Flame, 
  Layers, 
  Sliders, 
  Trees, 
  RotateCcw,
  ExternalLink,
  Info,
  GraduationCap,
  Trophy,
  Radio,
  Printer
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface GrandPianoWorkspaceProps {
  onXpEarned?: (xp: number) => void;
  importedNotes?: string[];
  outdoorSoundContext?: {
    title: string;
    category: string;
    tempo: number;
    pattern: string;
    notes: string[];
    explanation: string;
  } | null;
  onBackToMissions?: () => void;
  initialSubTab?: 'tutor' | 'whole-tracks' | 'studio' | 'library' | 'learn-ear' | 'theory' | 'outdoor-bridge';
  initialTrackId?: string;
}

const FAMOUS_CLASSICAL_SNIPPETS = [
  { 
    name: 'Always (Richard Clayderman)', 
    notes: ['G4', 'C5', 'D5', 'Eb5', 'D5', 'C5', 'Bb4', 'C5'], 
    key: 'C Minor', 
    composer: 'Richard Clayderman',
    bpm: 80
  },
  { 
    name: 'Für Elise (Beethoven)', 
    notes: ['E5', 'D#5', 'E5', 'D#5', 'E5', 'B4', 'D5', 'C5', 'A4'], 
    key: 'A Minor', 
    composer: 'Beethoven',
    bpm: 130
  },
  { 
    name: 'Prelude in C (Bach)', 
    notes: ['C3', 'E3', 'G3', 'C4', 'E4', 'G3', 'C4', 'E4'], 
    key: 'C Major', 
    composer: 'J.S. Bach',
    bpm: 68
  },
  { 
    name: 'Moonlight Sonata (Beethoven)', 
    notes: ['C#3', 'G#3', 'C#4', 'E4', 'G#3', 'C#4', 'E4'], 
    key: 'C# Minor', 
    composer: 'Beethoven',
    bpm: 54
  },
  { 
    name: 'Canon in D Ground Bass (Pachelbel)', 
    notes: ['D3', 'A2', 'B2', 'F#2', 'G2', 'D2', 'G2', 'A2'], 
    key: 'D Major', 
    composer: 'Pachelbel',
    bpm: 58
  },
  { 
    name: 'Gymnopédie No. 1 (Satie)', 
    notes: ['G2', 'B3', 'D4', 'F#4', 'D2', 'F#3', 'A3', 'C#4'], 
    key: 'D Major', 
    composer: 'Erik Satie',
    bpm: 66
  },
  { 
    name: 'Sonata Facile (Mozart)', 
    notes: ['C4', 'E4', 'G4', 'B3', 'C4', 'D4', 'C4'], 
    key: 'C Major', 
    composer: 'W.A. Mozart',
    bpm: 120
  }
];

// Outdoor to Grand Piano Transformations
const OUTDOOR_TRANSFORMATIONS = [
  {
    title: 'Rustling Meadow Breeze → Clayderman "Always" Lyrical Arpeggios',
    icon: '🌾',
    outdoorOrigin: 'Sustained natural acoustic wind in nature with grass harmonic overtone waves',
    preset: 'concert-grand' as PianoPreset,
    notes: ['C2', 'G2', 'C3', 'Eb3', 'G4', 'C5', 'Eb5'],
    bpm: 80,
    harmony: 'C Minor / Eb Major Romantic Cadence',
    pedagogicalInsight: 'The undulating rise and fall of wind through open fields translates directly into Clayderman\'s sweeping 10th-interval left-hand arpeggios supporting a tender, heartfelt melody.'
  },
  {
    title: 'Gravel Footstep Cadence → Chopin Walking Bass',
    icon: '👣',
    outdoorOrigin: 'Duple pulse recorded walking at 96 BPM',
    preset: 'concert-grand' as PianoPreset,
    notes: ['C3', 'G3', 'A3', 'F3'],
    bpm: 96,
    harmony: 'I - V - vi - IV Root Anchor',
    pedagogicalInsight: 'The physical weight of human walking translates directly into left-hand anchor bass chords with steady momentum.'
  },
  {
    title: 'Morning Robin Flutter → Scarlatti Staccato Motif',
    icon: '🐦',
    outdoorOrigin: 'High-Low-High 3-note melodic birdsong flutter',
    preset: 'bright-upright' as PianoPreset,
    notes: ['G4', 'E4', 'G4', 'A4'],
    bpm: 116,
    harmony: 'C Pentatonic Arched Flutter',
    pedagogicalInsight: 'Birdsong naturally utilizes arched melodic contours. On the treble keys, execute crisp staccato touch mimicking quick vocal calls.'
  },
  {
    title: 'Raindrops on Leaves → Romantic Liquid Arpeggios',
    icon: '🌧️',
    outdoorOrigin: 'Repeating hydro-acoustic droplet textures at 84 BPM',
    preset: 'mellow-piano' as PianoPreset,
    notes: ['E4', 'G4', 'C5', 'G4', 'E4', 'G4'],
    bpm: 84,
    harmony: 'Broken C Major Triad Waves',
    pedagogicalInsight: 'The stochastic rhythm of rainfall inspires Chopin & Debussy arpeggiated water textures. Let notes ring with gentle damper pedaling.'
  },
  {
    title: 'Flowing Creek Water → Pentatonic Impressionist Cascade',
    icon: '💧',
    outdoorOrigin: 'Gentle organic liquid ripples and continuous stream movement',
    preset: 'soft-piano' as PianoPreset,
    notes: ['C4', 'D4', 'E4', 'G4', 'A4', 'C5'],
    bpm: 78,
    harmony: 'Pure Pentatonic Scale',
    pedagogicalInsight: 'Water has no sharp edges or harsh dissonances. The 5-note pentatonic scale allows effortless flowing improvisation with zero dissonance.'
  }
];

export const GrandPianoWorkspace: React.FC<GrandPianoWorkspaceProps> = ({
  onXpEarned,
  importedNotes,
  outdoorSoundContext,
  onBackToMissions,
  initialSubTab,
  initialTrackId
}) => {
  // Navigation Subtabs: Defaults to Tutor or initialSubTab
  const [activeTab, setActiveTab] = useState<'tutor' | 'whole-tracks' | 'studio' | 'library' | 'learn-ear' | 'theory' | 'outdoor-bridge'>(initialSubTab || 'tutor');
  const [currentTrackId, setCurrentTrackId] = useState<string>(initialTrackId || 'track-clayderman-always-complete');

  useEffect(() => {
    if (initialSubTab) {
      setActiveTab(initialSubTab);
    }
  }, [initialSubTab]);

  useEffect(() => {
    if (initialTrackId) {
      setCurrentTrackId(initialTrackId);
    }
  }, [initialTrackId]);

  // Virtuoso Diploma Modal State
  const [isDiplomaOpen, setIsDiplomaOpen] = useState<boolean>(false);

  // Web MIDI Hardware Connection State
  const [midiStatusText, setMidiStatusText] = useState<string>('Web MIDI Ready');

  // Audio Engine Preset & Settings
  const [currentPreset, setCurrentPreset] = useState<PianoPreset>('concert-grand');
  const [masterVolume, setMasterVolume] = useState<number>(0.8);

  // Live Sounding Note and Target Notes
  const [activeSoundingNote, setActiveSoundingNote] = useState<string | null>(null);
  const [activeTargetNotes, setActiveTargetNotes] = useState<string[]>(importedNotes || ['C4', 'E4', 'G4']);
  const [activeKeySignature, setActiveKeySignature] = useState<string>('C Major');
  const [activeTimeSignature, setActiveTimeSignature] = useState<string>('4/4');
  const [activeTempoBpm, setActiveTempoBpm] = useState<number>(80);

  // Auto-detect Web MIDI devices (Yamaha, Roland, Casio, etc.)
  useEffect(() => {
    if (typeof navigator !== 'undefined' && (navigator as any).requestMIDIAccess) {
      (navigator as any).requestMIDIAccess().then(
        (midiAccess: any) => {
          const inputs = midiAccess.inputs.values();
          let count = 0;
          for (const input of inputs) {
            count++;
            setMidiStatusText(input.name || 'USB MIDI Connected');
            input.onmidimessage = (msg: any) => {
              const [status, noteNumber, velocity] = msg.data;
              const command = status >> 4;
              if (command === 9 && velocity > 0) {
                const NOTE_NAMES_LIST = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
                const octave = Math.floor(noteNumber / 12) - 1;
                const noteName = `${NOTE_NAMES_LIST[noteNumber % 12]}${octave}`;
                grandPianoAudio.playNote(noteName, velocity / 127);
                handleNotePlayed(noteName);
              }
            };
          }
          if (count === 0) setMidiStatusText('Plug in USB/BT Keyboard');
        },
        () => setMidiStatusText('MIDI Web Not Allowed')
      );
    }
  }, []);

  // Classical Library State
  const [selectedWorkId, setSelectedWorkId] = useState<string>('bach-prelude-c');
  const [periodFilter, setPeriodFilter] = useState<string>('All');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Theory Masterclass State
  const [selectedTheoryStage, setSelectedTheoryStage] = useState<number>(1);

  // Currently selected work object
  const selectedWork: ClassicalWork = CLASSICAL_WORKS_DATABASE.find(w => w.work_id === selectedWorkId) || CLASSICAL_WORKS_DATABASE[0];
  const activeTheoryLesson: TheoryLesson = THEORY_CURRICULUM_STAGES.find(t => t.stage === selectedTheoryStage) || THEORY_CURRICULUM_STAGES[0];

  // Sync preset changes with GrandPianoAudioEngine
  const handlePresetChange = (preset: PianoPreset) => {
    setCurrentPreset(preset);
    grandPianoAudio.setPreset(preset);
  };

  // Note played handler
  const handleNotePlayed = (note: string) => {
    setActiveSoundingNote(note);
    if (onXpEarned) onXpEarned(2);
    // Clear active sounding note after 1.2s for clean UI
    setTimeout(() => {
      setActiveSoundingNote(prev => (prev === note ? null : prev));
    }, 1200);
  };

  // Quick motif audition
  const handlePlaySnippet = (snippet: typeof FAMOUS_CLASSICAL_SNIPPETS[0]) => {
    setActiveTargetNotes(snippet.notes);
    setActiveKeySignature(snippet.key);
    setActiveTempoBpm(snippet.bpm);

    const stepMs = Math.round((60 / snippet.bpm) * 750);
    snippet.notes.forEach((note, idx) => {
      setTimeout(() => {
        grandPianoAudio.playNote(note, 0.85, 0.6);
        setActiveSoundingNote(note);
      }, idx * stepMs);
    });

    setTimeout(() => {
      setActiveSoundingNote(null);
    }, snippet.notes.length * stepMs + 500);
  };

  // Load outdoor transform onto piano
  const handleLoadOutdoorTransform = (item: typeof OUTDOOR_TRANSFORMATIONS[0]) => {
    handlePresetChange(item.preset);
    setActiveTargetNotes(item.notes);
    setActiveTempoBpm(item.bpm);
    setActiveTab('studio');

    // Audition immediately
    const stepMs = Math.round((60 / item.bpm) * 800);
    item.notes.forEach((n, idx) => {
      setTimeout(() => {
        grandPianoAudio.playNote(n, 0.85, 0.7);
        setActiveSoundingNote(n);
      }, idx * stepMs);
    });
    setTimeout(() => {
      setActiveSoundingNote(null);
    }, item.notes.length * stepMs + 600);
  };

  // Load theory exercise onto piano
  const handleLoadTheoryExercise = (lesson: TheoryLesson) => {
    setActiveTargetNotes(lesson.target_notes);
    setActiveTab('studio');
    lesson.target_notes.forEach((n, idx) => {
      setTimeout(() => {
        grandPianoAudio.playNote(n, 0.8, 0.8);
        setActiveSoundingNote(n);
      }, idx * 400);
    });
  };

  // Filtered Classical Works
  const filteredWorks = CLASSICAL_WORKS_DATABASE.filter(work => {
    const matchesPeriod = periodFilter === 'All' || work.composition_period === periodFilter;
    const matchesDifficulty = difficultyFilter === 'All' || work.difficulty_level === difficultyFilter;
    const matchesSearch = searchQuery === '' || 
      work.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      work.composer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      work.catalogue_number.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPeriod && matchesDifficulty && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* ======================================================== */}
      {/* 1. LUXURY GRAND PIANO HEADER & ACOUSTIC TIMBRE BAR       */}
      {/* ======================================================== */}
      <div className="bg-gradient-to-r from-stone-950 via-amber-950/40 to-stone-950 border border-amber-900/50 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative golden background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold tracking-wider uppercase flex items-center space-x-1.5 shadow-xs">
                <Piano className="w-3.5 h-3.5" />
                <span>GRAND PIANO • CONCERT ACOUSTICS</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-stone-900 border border-stone-800 text-[11px] font-mono text-stone-300 flex items-center space-x-1.5">
                <Radio className={`w-3 h-3 ${midiStatusText.includes('Connected') ? 'text-emerald-400 animate-pulse' : 'text-amber-400'}`} />
                <span>{midiStatusText}</span>
              </span>
              <button
                type="button"
                onClick={() => setIsDiplomaOpen(true)}
                className="px-3 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-mono font-bold flex items-center space-x-1.5 cursor-pointer shadow-xs transition"
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Virtuoso Diploma</span>
              </button>
              {outdoorSoundContext && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono flex items-center gap-1">
                  <Trees className="w-3 h-3" />
                  <span>Linked to {outdoorSoundContext.title}</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-black text-amber-100 tracking-tight">
              Concert Grand Piano & Classical Studio
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl leading-relaxed">
              Step-by-step interactive tutor walking beginners through all theory and practice. Play whole classical masterpieces, train your ear, read the Grand Staff, and perform with physical acoustic resonance.
            </p>
          </div>

          {/* Timbre Modeling Presets */}
          <div className="p-3.5 rounded-2xl bg-stone-900/90 border border-amber-900/40 shadow-xl shrink-0 w-full lg:w-auto">
            <span className="text-[10px] font-mono uppercase font-bold text-amber-300 tracking-wider block mb-2">
              Acoustic Physical Modeling Preset
            </span>
            <div className="grid grid-cols-2 gap-1.5 sm:flex sm:items-center">
              {[
                { id: 'concert-grand', label: 'Concert Grand', desc: 'Steinway D' },
                { id: 'mellow-piano', label: 'Mellow Grand', desc: 'Bösendorfer' },
                { id: 'soft-piano', label: 'Soft Intimate', desc: 'Felt Piano' },
                { id: 'bright-upright', label: 'Bright Upright', desc: 'Yamaha U3' }
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handlePresetChange(p.id as PianoPreset)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition text-left cursor-pointer ${
                    currentPreset === p.id
                      ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                      : 'bg-stone-950 text-stone-400 hover:text-white hover:bg-stone-800 border border-stone-800'
                  }`}
                >
                  <div className="font-bold">{p.label}</div>
                  <div className={`text-[9px] ${currentPreset === p.id ? 'text-stone-900' : 'text-stone-500'}`}>{p.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sub-navigation Tabs across Grand Piano features */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-amber-900/30 text-xs">
          {[
            { id: 'tutor', label: 'Piano Tutor (Walkthrough)', icon: <GraduationCap className="w-3.5 h-3.5 text-amber-400" />, badge: '8 Modules' },
            { id: 'whole-tracks', label: 'Play Whole Tracks', icon: <Trophy className="w-3.5 h-3.5 text-amber-400" />, badge: 'Full Pieces' },
            { id: 'studio', label: 'Grand Piano & Staff', icon: <Piano className="w-3.5 h-3.5" />, badge: 'Live 88 Keys' },
            { id: 'library', label: 'Classical Repertoire', icon: <BookOpen className="w-3.5 h-3.5" />, badge: `${CLASSICAL_WORKS_DATABASE.length} Works` },
            { id: 'learn-ear', label: 'Learn by Ear Studio', icon: <Headphones className="w-3.5 h-3.5" />, badge: '7 Levels' },
            { id: 'theory', label: 'Theory & Masterclass', icon: <Music className="w-3.5 h-3.5" />, badge: '7 Stages' },
            { id: 'outdoor-bridge', label: 'Outdoor Sound → Piano Bridge', icon: <Trees className="w-3.5 h-3.5 text-emerald-400" />, badge: 'Touch Grass' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl font-bold transition flex items-center space-x-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/20'
                  : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                  activeTab === tab.id ? 'bg-stone-950 text-amber-300' : 'bg-stone-950 text-stone-500'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* SUBVIEW 0: INTERACTIVE PIANO TUTOR (WALKTHROUGH)         */}
      {/* ======================================================== */}
      {activeTab === 'tutor' && (
        <GrandPianoTutorEngine
          onXpEarned={onXpEarned}
          onOpenDiploma={() => setIsDiplomaOpen(true)}
          onOpenWholeTracks={() => setActiveTab('whole-tracks')}
        />
      )}

      {/* ======================================================== */}
      {/* SUBVIEW 0.5: PLAY WHOLE CLASSICAL TRACKS (REPERTOIRE)    */}
      {/* ======================================================== */}
      {activeTab === 'whole-tracks' && (
        <ClassicalTrackPlayer
          initialTrackId={currentTrackId}
          onXpEarned={onXpEarned}
          onOpenDiploma={() => setIsDiplomaOpen(true)}
        />
      )}

      {/* ======================================================== */}
      {/* SUBVIEW 1: GRAND PIANO & NOTATION STAFF LIVE STUDIO     */}
      {/* ======================================================== */}
      {activeTab === 'studio' && (
        <div className="space-y-6">
          {/* Quick Classical Motifs Audition Ribbon */}
          <div className="p-4 rounded-2xl bg-stone-950 border border-amber-900/30 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-stone-400">
              <span className="font-bold text-amber-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Audition Iconic Classical Motifs on Concert Grand:</span>
              </span>
              <span className="text-[11px] text-stone-500 hidden sm:inline">Click any motif to load onto staff and audition</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
              {FAMOUS_CLASSICAL_SNIPPETS.map((snippet, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePlaySnippet(snippet)}
                  className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-amber-950/60 border border-stone-800 hover:border-amber-700/50 text-stone-300 hover:text-amber-200 transition font-mono whitespace-nowrap flex items-center space-x-1.5 cursor-pointer shadow-xs"
                >
                  <Play className="w-3 h-3 text-amber-400 fill-current" />
                  <span>{snippet.name}</span>
                  <span className="text-[10px] text-stone-500">({snippet.key})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Visual Dual Grand Staff Notation Viewer */}
          <GrandPianoStaffViewer
            activeNote={activeSoundingNote}
            targetNotes={activeTargetNotes}
            keySignature={activeKeySignature}
            timeSignature={activeTimeSignature}
            tempoBpm={activeTempoBpm}
            onNoteSelected={handleNotePlayed}
          />

          {/* Interactive Concert Grand Keyboard */}
          <GrandPianoKeyboard
            activeNotes={activeSoundingNote ? [activeSoundingNote] : []}
            targetNotes={activeTargetNotes}
            onNotePlayed={handleNotePlayed}
            showFullControls={true}
          />
        </div>
      )}

      {/* ======================================================== */}
      {/* SUBVIEW 2: CLASSICAL MASTERWORKS REPERTOIRE LIBRARY     */}
      {/* ======================================================== */}
      {activeTab === 'library' && (
        <div className="space-y-6">
          {/* Search & Filters */}
          <div className="p-5 rounded-2xl bg-stone-950 border border-amber-900/30 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search works, composers, keys..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-200 placeholder-stone-500 text-xs focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs font-mono">
              {/* Period Filter */}
              <div className="flex items-center space-x-1.5">
                <span className="text-stone-400">Period:</span>
                <select
                  value={periodFilter}
                  onChange={(e) => setPeriodFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-amber-200 text-xs focus:outline-hidden"
                >
                  <option value="All">All Periods</option>
                  <option value="Baroque">Baroque</option>
                  <option value="Classical">Classical</option>
                  <option value="Romantic">Romantic</option>
                  <option value="Impressionist">Impressionist</option>
                  <option value="Modern">Modern</option>
                </select>
              </div>

              {/* Difficulty Filter */}
              <div className="flex items-center space-x-1.5">
                <span className="text-stone-400">Difficulty:</span>
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-amber-200 text-xs focus:outline-hidden"
                >
                  <option value="All">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Late Intermediate">Late Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Virtuoso">Virtuoso</option>
                </select>
              </div>
            </div>
          </div>

          {/* Repertoire Works Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredWorks.map((work) => (
              <div
                key={work.work_id}
                className="p-5 rounded-2xl bg-stone-950 border border-amber-900/30 hover:border-amber-500/50 transition shadow-xl space-y-4 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                      {work.composition_period}
                    </span>
                    <span className="text-stone-400">
                      {work.difficulty_level}
                    </span>
                  </div>

                  <h3 className="font-serif font-black text-lg text-amber-100 group-hover:text-amber-300 transition">
                    {work.title}
                  </h3>
                  <p className="text-xs text-amber-200/80 font-serif italic">
                    {work.composer} ({work.composer_lifespan})
                  </p>

                  <p className="text-xs text-stone-400 mt-2 line-clamp-2 leading-relaxed">
                    {work.description}
                  </p>

                  <div className="mt-3 pt-3 border-t border-stone-900 flex flex-wrap items-center gap-2 text-[11px] font-mono text-stone-400">
                    <span>Key: <strong className="text-amber-200">{work.key_signature}</strong></span>
                    <span>•</span>
                    <span>Meter: <strong className="text-amber-200">{work.time_signature}</strong></span>
                    <span>•</span>
                    <span>{work.movements_count} Mvt(s)</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedWorkId(work.work_id);
                      setActiveTab('learn-ear');
                    }}
                    className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs transition flex items-center justify-center space-x-1.5 shadow-md cursor-pointer"
                  >
                    <Headphones className="w-3.5 h-3.5" />
                    <span>Learn by Ear</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (work.movements[0]?.practice_sections[0]) {
                        const sec = work.movements[0].practice_sections[0];
                        setActiveTargetNotes(sec.notes.map(n => n.note_name));
                        setActiveKeySignature(work.key_signature);
                        setActiveTimeSignature(work.time_signature);
                        setActiveTempoBpm(work.tempo_bpm);
                        setActiveTab('studio');
                      }
                    }}
                    className="px-3 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 text-xs font-bold transition flex items-center justify-center cursor-pointer"
                    title="Load piece onto Grand Piano & Staff"
                  >
                    <Piano className="w-3.5 h-3.5 text-amber-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUBVIEW 3: LEARN BY EAR STUDIO EMBEDDED                 */}
      {/* ======================================================== */}
      {activeTab === 'learn-ear' && (
        <div className="space-y-6">
          {/* Work Selector Ribbon */}
          <div className="p-4 rounded-2xl bg-stone-950 border border-amber-900/30 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center space-x-2">
              <span className="text-stone-400 font-bold">Select Masterpiece:</span>
              <select
                value={selectedWorkId}
                onChange={(e) => setSelectedWorkId(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 text-amber-200 text-xs font-serif font-bold focus:outline-hidden"
              >
                {CLASSICAL_WORKS_DATABASE.map(w => (
                  <option key={w.work_id} value={w.work_id}>
                    {w.composer}: {w.title} ({w.difficulty_level})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('theory')}
              className="text-stone-400 hover:text-amber-300 underline cursor-pointer text-xs flex items-center gap-1"
            >
              <span>Explore Theory Masterclass</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Interactive Learn By Ear Workspace */}
          <LearnByEarWorkspace
            work={selectedWork}
            onSwitchToTheory={() => setActiveTab('theory')}
            onXpEarned={onXpEarned}
          />
        </div>
      )}

      {/* ======================================================== */}
      {/* SUBVIEW 4: THEORY CURRICULUM & MASTERCLASS               */}
      {/* ======================================================== */}
      {activeTab === 'theory' && (
        <div className="space-y-6">
          {/* Stage Selector 1 through 7 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {THEORY_CURRICULUM_STAGES.map((lesson) => (
              <button
                key={lesson.stage}
                type="button"
                onClick={() => setSelectedTheoryStage(lesson.stage)}
                className={`p-3 rounded-2xl text-left transition cursor-pointer border ${
                  selectedTheoryStage === lesson.stage
                    ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-lg shadow-amber-500/20 font-bold'
                    : 'bg-stone-950 text-stone-300 hover:bg-stone-900 border-stone-800'
                }`}
              >
                <div className={`text-[10px] font-mono uppercase tracking-wider ${selectedTheoryStage === lesson.stage ? 'text-stone-900' : 'text-stone-500'}`}>
                  Stage {lesson.stage}
                </div>
                <div className="text-xs font-bold mt-1 line-clamp-1">
                  {lesson.topic}
                </div>
              </button>
            ))}
          </div>

          {/* Active Theory Lesson Deep View */}
          <div className="p-6 sm:p-8 rounded-3xl bg-stone-950 border border-amber-900/40 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-900 pb-5">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold uppercase tracking-wider">
                  {activeTheoryLesson.stage_title}
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-black text-amber-100 mt-2">
                  {activeTheoryLesson.topic}
                </h2>
                <p className="text-xs text-stone-300 mt-1">
                  {activeTheoryLesson.summary}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleLoadTheoryExercise(activeTheoryLesson)}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs transition flex items-center space-x-2 shadow-lg cursor-pointer shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Practice on Grand Piano</span>
              </button>
            </div>

            {/* In-depth details */}
            <div className="prose prose-invert max-w-none text-xs sm:text-sm text-stone-300 leading-relaxed font-sans bg-stone-900/60 p-5 rounded-2xl border border-stone-800">
              {activeTheoryLesson.details}
            </div>

            {/* Exercise Box */}
            <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-200 text-xs flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Interactive Stage Exercise:</span>
                </span>
                <span className="text-[11px] font-mono text-stone-400">
                  Target Notes: {activeTheoryLesson.target_notes.join(', ')}
                </span>
              </div>
              <p className="text-xs text-stone-300 font-mono">
                {activeTheoryLesson.exercise_prompt}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUBVIEW 5: OUTDOOR SOUND → GRAND PIANO BRIDGE           */}
      {/* ======================================================== */}
      {activeTab === 'outdoor-bridge' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-stone-950 to-amber-950/40 border border-emerald-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                  <Trees className="w-3.5 h-3.5" />
                  <span>TOUCH GRASS ↔ GRAND PIANO SYNTHESIS</span>
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-white">
                Transform Nature's Sounds into Classical Masterpieces
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl leading-relaxed">
                Every classical piano technique originated from listening to the physical world: walking strides became walking basses, rainfall became broken arpeggios, and bird whistles became arched melodies.
              </p>
            </div>

            {onBackToMissions && (
              <button
                type="button"
                onClick={onBackToMissions}
                className="px-4 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs transition flex items-center space-x-1.5 cursor-pointer shrink-0"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Return to Outdoor Missions</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {OUTDOOR_TRANSFORMATIONS.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-stone-950 border border-stone-800 hover:border-amber-500/50 transition shadow-xl space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{item.icon}</span>
                    <h3 className="font-serif font-black text-base text-amber-100">
                      {item.title}
                    </h3>
                  </div>

                  <div className="text-[11px] font-mono text-emerald-400 bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-900/30">
                    <strong>Sound Origin:</strong> {item.outdoorOrigin}
                  </div>

                  <p className="text-xs text-stone-300 leading-relaxed">
                    {item.pedagogicalInsight}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] font-mono text-stone-400">
                    <span>Notes: <strong className="text-amber-300">{item.notes.join(' - ')}</strong></span>
                    <span>•</span>
                    <span>Tempo: <strong className="text-amber-300">{item.bpm} BPM</strong></span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleLoadOutdoorTransform(item)}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs transition flex items-center justify-center space-x-2 shadow-md cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Audition on Concert Grand Piano</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIRTUOSO DIPLOMA GRADUATION MODAL                        */}
      {/* ======================================================== */}
      <VirtuosoDiplomaModal
        isOpen={isDiplomaOpen}
        onClose={() => setIsDiplomaOpen(false)}
      />
    </div>
  );
};
