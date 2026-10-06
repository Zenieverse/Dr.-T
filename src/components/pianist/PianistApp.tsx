import React, { useState, useEffect } from 'react';
import { 
  PianistSubTab, 
  PianistProfile, 
  TodayMission, 
  PracticeDuration 
} from '../../types/pianistTypes';
import { DEFAULT_PIANIST_PROFILE, generateTodayMission, PIANIST_LESSONS, PIANIST_SONGS } from './data/pianistData';
import { InteractivePianoKeyboard } from './components/InteractivePianoKeyboard';
import { SheetMusicDisplay } from './components/SheetMusicDisplay';
import { EarTrainingLab } from './components/EarTrainingLab';
import { TheoryAcademy } from './components/TheoryAcademy';
import { SongLab } from './components/SongLab';
import { ImprovCompositionLab } from './components/ImprovCompositionLab';
import { AIPianoCoach } from './components/AIPianoCoach';
import { MusicianPassport } from './components/MusicianPassport';
import { PracticeCalendar } from './components/PracticeCalendar';
import { IndependentPianistChallenge } from './components/IndependentPianistChallenge';
import { TeacherParentView } from './components/TeacherParentView';
import { CurriculumBrowser } from './components/CurriculumBrowser';
import { PianistOnboardingModal } from './components/PianistOnboardingModal';
import { TouchGrassStudio } from './touchgrass/TouchGrassStudio';
import { pianoAudio } from './audio/pianoAudio';

import { 
  Piano, 
  Home, 
  BookOpen, 
  Music, 
  Headphones, 
  Brain, 
  Sparkles, 
  Award, 
  Bot, 
  Calendar, 
  Trophy, 
  GraduationCap, 
  Flame, 
  Play, 
  Radio, 
  Sliders, 
  CheckCircle2, 
  Clock, 
  Disc,
  Compass,
  Trees,
  Footprints
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface PianistAppProps {
  initialSubTab?: PianistSubTab;
}

export const PianistApp: React.FC<PianistAppProps> = ({ initialSubTab = 'home' }) => {
  const [activeSubTab, setActiveSubTab] = useState<PianistSubTab>(initialSubTab);

  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  const [profile, setProfile] = useState<PianistProfile>(() => {
    const saved = localStorage.getItem('pianist_profile_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_PIANIST_PROFILE;
  });

  const [todayMission, setTodayMission] = useState<TodayMission>(() => 
    generateTodayMission(profile.dailyPracticeMinutes)
  );

  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [activeKeyboardNotes, setActiveKeyboardNotes] = useState<string[]>([]);
  const [targetKeyboardNotes, setTargetKeyboardNotes] = useState<string[]>([]);
  const [isMetronomeOn, setIsMetronomeOn] = useState<boolean>(false);
  const [metronomeBpm, setMetronomeBpm] = useState<number>(90);
  const [currentBeat, setCurrentBeat] = useState<number>(0);

  // Sync profile to localStorage
  useEffect(() => {
    localStorage.setItem('pianist_profile_v1', JSON.stringify(profile));
  }, [profile]);

  // Metronome control
  const toggleMetronome = () => {
    if (isMetronomeOn) {
      pianoAudio.stopMetronome();
      setIsMetronomeOn(false);
    } else {
      pianoAudio.startMetronome(metronomeBpm, 4, (beat) => setCurrentBeat(beat));
      setIsMetronomeOn(true);
    }
  };

  const handleBpmChange = (newBpm: number) => {
    setMetronomeBpm(newBpm);
    if (isMetronomeOn) {
      pianoAudio.startMetronome(newBpm, 4, (beat) => setCurrentBeat(beat));
    }
  };

  // XP & Progress helper
  const handleEarnXp = (amount: number) => {
    setProfile(prev => {
      const nextXp = prev.totalXp + amount;
      const nextLevel = Math.floor(nextXp / 500) + 1;
      return {
        ...prev,
        totalXp: nextXp,
        levelNumber: nextLevel,
      };
    });
  };

  const handleUpdateDuration = (duration: PracticeDuration) => {
    setProfile(prev => ({ ...prev, dailyPracticeMinutes: duration }));
    setTodayMission(generateTodayMission(duration));
  };

  // Nav items configuration
  const navItems: Array<{ id: PianistSubTab; label: string; icon: React.ReactNode; badge?: string }> = [
    { id: 'home', label: 'Today', icon: <Home className="w-4 h-4" /> },
    { id: 'touch-grass', label: '🌿 Touch Grass', icon: <Trees className="w-4 h-4 text-emerald-400" />, badge: 'Outdoor' },
    { id: 'keyboard', label: 'Free Piano', icon: <Piano className="w-4 h-4" /> },
    { id: 'learn', label: 'Curriculum', icon: <BookOpen className="w-4 h-4" />, badge: '6 Paths' },
    { id: 'sight-reading', label: 'Sight-Reading', icon: <Music className="w-4 h-4" /> },
    { id: 'ear', label: 'Ear Lab', icon: <Headphones className="w-4 h-4" />, badge: '8 Levels' },
    { id: 'theory', label: 'Theory', icon: <Brain className="w-4 h-4" /> },
    { id: 'songs', label: 'Song Lab', icon: <Disc className="w-4 h-4" />, badge: '12-Step' },
    { id: 'improv', label: 'Improv Jam', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'passport', label: 'Passport', icon: <Award className="w-4 h-4" /> },
    { id: 'coach', label: 'AI Coach', icon: <Bot className="w-4 h-4" /> },
    { id: 'schedule', label: 'Calendar', icon: <Calendar className="w-4 h-4" /> },
    { id: 'independent-test', label: 'The Ultimate Test', icon: <Trophy className="w-4 h-4 text-amber-400" />, badge: 'Milestone' },
    { id: 'teacher-view', label: 'Mentorship', icon: <GraduationCap className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Pianist Brand Header */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Logo & Tagline */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 via-emerald-400 to-indigo-500 p-0.5 shadow-lg flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center text-teal-400 font-black text-xl">
                🎹
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-black tracking-wider text-white">PIANIST</h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">
                  v2.0 Adaptive Platform
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Learn piano. Understand music. Play by ear. Read by sight. Become a pianist.
              </p>
            </div>
          </div>

          {/* Quick Tooling: Metronome & XP Pills */}
          <div className="flex items-center space-x-3">
            {/* Metronome Pill */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1 text-xs space-x-2">
              <button
                type="button"
                onClick={toggleMetronome}
                className={`p-1 rounded-lg transition font-mono font-bold flex items-center gap-1 ${
                  isMetronomeOn 
                    ? 'bg-amber-500 text-slate-950 animate-pulse' 
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Toggle Metronome"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{metronomeBpm} BPM</span>
              </button>

              {isMetronomeOn && (
                <div className="flex space-x-1">
                  {[0, 1, 2, 3].map((b) => (
                    <div
                      key={b}
                      className={`w-2 h-2 rounded-full transition-all ${
                        currentBeat === b 
                          ? b === 0 ? 'bg-amber-400 scale-125' : 'bg-teal-400 scale-110' 
                          : 'bg-slate-700'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Streak & XP */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold font-mono">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                {profile.streakDays}d
              </span>
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 font-bold font-mono">
                {profile.totalXp} XP
              </span>
            </div>

            {/* Retake Placement / Setup Profile */}
            <button
              type="button"
              onClick={() => setIsOnboardingOpen(true)}
              className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition"
            >
              Profile / Level
            </button>
          </div>
        </div>

        {/* Sub-Tabs Horizontal Navigation Ribbon */}
        <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-slate-800/80 overflow-x-auto no-scrollbar">
          <div className="flex items-center space-x-1 min-w-max py-0.5">
            {navItems.map((item) => {
              const isActive = activeSubTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSubTab(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center space-x-1.5 transition whitespace-nowrap ${
                    isActive
                      ? 'bg-teal-500 text-slate-950 font-bold shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-md font-mono ${
                      isActive ? 'bg-slate-950 text-teal-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Feature Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* SUBTAB: HOME / TODAY'S MISSION */}
        {activeSubTab === 'home' && (
          <div className="space-y-6">
            {/* Hero Today's Mission & Touch Grass Banner */}
            <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-teal-950/70 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
                  <Trees className="w-3.5 h-3.5" />
                  <span>PIANIST — Touch Grass • Hear the World. Find the Music. Play It.</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  Learn piano. Become a musician.
                </h2>
                <p className="text-sm sm:text-base font-semibold text-emerald-300 mt-1">
                  Take your music lesson outside.
                </p>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed max-w-2xl">
                  Leave the screen behind. Step outdoors, listen to natural rhythms, footsteps, raindrops, and birdcalls, then return to the piano and transform what you heard into music.
                </p>

                {/* Primary & Secondary CTAs */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveSubTab('touch-grass')}
                    className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-xs transition shadow-xl flex items-center space-x-2 transform hover:scale-102"
                  >
                    <Compass className="w-4 h-4" />
                    <span>START OUTDOOR MISSION</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSubTab('keyboard')}
                    className="px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition flex items-center space-x-2"
                  >
                    <Piano className="w-4 h-4 text-teal-400" />
                    <span>OPEN PIANO</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSubTab(todayMission.steps[0].actionTab)}
                    className="px-4 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-750 text-slate-300 font-bold text-xs border border-slate-700 transition flex items-center space-x-1.5"
                  >
                    <Play className="w-3.5 h-3.5 text-teal-400 fill-current" />
                    <span>Today's {todayMission.durationMinutes}m Routine</span>
                  </button>
                </div>

                {/* Duration Pills */}
                <div className="flex items-center gap-2 mt-5 text-xs pt-4 border-t border-slate-800/80">
                  <span className="text-slate-400">Daily practice target:</span>
                  {([5, 10, 20, 30, 45, 60] as PracticeDuration[]).map((dur) => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => handleUpdateDuration(dur)}
                      className={`px-2.5 py-1 rounded-lg font-mono font-bold transition ${
                        todayMission.durationMinutes === dur
                          ? 'bg-emerald-400 text-slate-950 shadow-xs'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {dur}m
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Daily Mission Breakdown Steps Cards */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Mission Roadmap ({todayMission.steps.length} Segments)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {todayMission.steps.map((step, idx) => (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setActiveSubTab(step.actionTab)}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-teal-500/40 text-left transition-all hover:scale-102 flex flex-col justify-between shadow-lg"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{step.icon}</span>
                        <span className="text-xs font-mono font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-md">
                          {step.durationMin}m
                        </span>
                      </div>
                      <div className="font-bold text-sm text-white">{step.title}</div>
                      <p className="text-xs text-slate-400 mt-1 leading-snug">{step.description}</p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-teal-400 font-semibold flex items-center justify-between">
                      <span>Launch Step →</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Two Pillars Preview: Read Mode vs Ear Mode */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-teal-950/40 border border-teal-500/30">
                <span className="text-xs font-mono font-bold text-teal-300 uppercase tracking-wider block mb-1">
                  READ MODE (See → Understand → Play)
                </span>
                <h4 className="text-base font-bold text-white mb-2">
                  Staff Reading & Geometric Keyboard Landmark Recognition
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Master Treble and Bass clefs, key signatures, intervals, and chord charts. Never get stuck counting mnemonic rhymes.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('sight-reading')}
                  className="px-4 py-2 rounded-xl bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 border border-teal-500/40 text-xs font-bold transition"
                >
                  Open Sight-Reading Lab
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-indigo-500/30">
                <span className="text-xs font-mono font-bold text-indigo-300 uppercase tracking-wider block mb-1">
                  EAR MODE (Hear → Understand → Find → Play)
                </span>
                <h4 className="text-base font-bold text-white mb-2">
                  Relative Pitch, Melody Memory & Play-by-Ear Intuition
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Recognize chord qualities, intervals, and bass movements. Figure out songs directly on the keys without sheet music.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveSubTab('ear')}
                  className="px-4 py-2 rounded-xl bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/40 text-xs font-bold transition"
                >
                  Open Ear Lab
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB: TOUCH GRASS (OUTDOOR MISSIONS) */}
        {(activeSubTab === 'touch-grass' || activeSubTab === 'outdoor') && (
          <TouchGrassStudio
            onOpenPiano={() => setActiveSubTab('keyboard')}
            onSetTargetNotes={(notes) => setTargetKeyboardNotes(notes)}
            onXpEarned={handleEarnXp}
          />
        )}

        {/* SUBTAB: FREE PIANO */}
        {activeSubTab === 'keyboard' && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Piano className="w-5 h-5 text-teal-400" />
                  Free Play & Physical Modeling Synthesizer
                </h2>
                <p className="text-xs text-slate-400">
                  Experiment freely, play any piece, or plug in your USB/Bluetooth Yamaha or MIDI keyboard!
                </p>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <button
                  type="button"
                  onClick={() => pianoAudio.playChord(['C4', 'E4', 'G4', 'C5'], 2.5)}
                  className="px-3 py-1.5 rounded-lg bg-teal-500 text-slate-950 font-bold"
                >
                  Audition C Major Chord
                </button>
              </div>
            </div>

            <InteractivePianoKeyboard
              startOctave={3}
              octaveCount={3}
              activeNotes={activeKeyboardNotes}
              targetNotes={targetKeyboardNotes}
              onNotePlayed={(note) => {
                handleEarnXp(2);
              }}
              showPedal={true}
              showControls={true}
            />
          </div>
        )}

        {/* SUBTAB: LEARN (CURRICULUM) */}
        {activeSubTab === 'learn' && (
          <CurriculumBrowser
            onSelectLessonNotes={(notes) => setTargetKeyboardNotes(notes)}
            onXpEarned={handleEarnXp}
          />
        )}

        {/* SUBTAB: SIGHT-READING */}
        {activeSubTab === 'sight-reading' && (
          <div className="space-y-6">
            <SheetMusicDisplay
              title="Ode to Joy Sight-Reading Exercise (Measures 1-4)"
              clef="treble"
              notes={[
                { note: 'E4', duration: 1, text: 'Right Hand Finger 3 on E4', finger: 3 },
                { note: 'E4', duration: 1, text: 'Play E4 again with finger 3', finger: 3 },
                { note: 'F4', duration: 1, text: 'Step up to F4 with finger 4', finger: 4 },
                { note: 'G4', duration: 1, text: 'Step up to G4 with finger 5', finger: 5 },
                { note: 'G4', duration: 1, text: 'Repeat G4 landmark note', finger: 5 },
                { note: 'F4', duration: 1, text: 'Step down to F4', finger: 4 },
                { note: 'E4', duration: 1, text: 'Step down to E4', finger: 3 },
                { note: 'D4', duration: 1, text: 'Step down to D4', finger: 2 },
                { note: 'C4', duration: 2, text: 'Resolve to Middle C (Ledger line!)', finger: 1 },
              ]}
              onNoteSelected={(note) => setTargetKeyboardNotes([note])}
            />
          </div>
        )}

        {/* SUBTAB: EAR LAB */}
        {activeSubTab === 'ear' && (
          <EarTrainingLab
            onXpEarned={handleEarnXp}
            onSelectTargetNotes={(notes) => setTargetKeyboardNotes(notes)}
          />
        )}

        {/* SUBTAB: THEORY ACADEMY */}
        {activeSubTab === 'theory' && (
          <TheoryAcademy
            onHighlightNotes={(notes) => setTargetKeyboardNotes(notes)}
          />
        )}

        {/* SUBTAB: SONG LAB */}
        {activeSubTab === 'songs' && (
          <SongLab
            onSelectSongNotes={(notes) => setTargetKeyboardNotes(notes)}
            onXpEarned={handleEarnXp}
          />
        )}

        {/* SUBTAB: IMPROV & COMPOSITION */}
        {activeSubTab === 'improv' && (
          <ImprovCompositionLab
            onSafeNotesHighlight={(notes) => setTargetKeyboardNotes(notes)}
          />
        )}

        {/* SUBTAB: MUSICIAN PASSPORT */}
        {activeSubTab === 'passport' && (
          <MusicianPassport profile={profile} />
        )}

        {/* SUBTAB: AI COACH */}
        {activeSubTab === 'coach' && (
          <AIPianoCoach />
        )}

        {/* SUBTAB: PRACTICE CALENDAR */}
        {activeSubTab === 'schedule' && (
          <PracticeCalendar />
        )}

        {/* SUBTAB: INDEPENDENT PIANIST CHALLENGE */}
        {activeSubTab === 'independent-test' && (
          <IndependentPianistChallenge
            onChallengePassed={() => {
              handleEarnXp(200);
              setProfile(prev => ({
                ...prev,
                badges: prev.badges.includes('Independent Pianist') 
                  ? prev.badges 
                  : [...prev.badges, 'Independent Pianist']
              }));
            }}
          />
        )}

        {/* SUBTAB: TEACHER / PARENT VIEW */}
        {activeSubTab === 'teacher-view' && (
          <TeacherParentView />
        )}

        {/* PERSISTENT DOCKABLE KEYBOARD (shown underneath interactive exercises when not in pure free piano tab) */}
        {activeSubTab !== 'keyboard' && (
          <div className="mt-8 pt-6 border-t border-slate-800">
            <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Piano className="w-4 h-4 text-teal-400" />
                Live Piano Deck • Play Along with Lesson
              </span>
              <span className="hidden sm:inline font-mono text-[11px] text-slate-500">
                Click keys, touch, or use keyboard A-S-D-F-G-H-J-K
              </span>
            </div>
            <InteractivePianoKeyboard
              startOctave={3}
              octaveCount={3}
              activeNotes={activeKeyboardNotes}
              targetNotes={targetKeyboardNotes}
              onNotePlayed={() => handleEarnXp(1)}
              showPedal={true}
              showControls={true}
              compact={false}
            />
          </div>
        )}
      </main>

      {/* Onboarding Dialog */}
      <PianistOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={(newProfile) => {
          setProfile(prev => ({ ...prev, ...newProfile }));
          if (newProfile.dailyPracticeMinutes) {
            setTodayMission(generateTodayMission(newProfile.dailyPracticeMinutes));
          }
          confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
        }}
      />
    </div>
  );
};
