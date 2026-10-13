import React, { useState, useEffect, useRef } from 'react';
import { WholeClassicalTrack, VerifiedNoteEvent, HandAssignment, TrackPlayAssessment } from '../types/grandPianoTypes';
import { WHOLE_CLASSICAL_TRACKS } from '../data/wholeClassicalTracksData';
import { grandPianoAudio } from '../audio/grandPianoAudioEngine';
import { GrandPianoKeyboard } from './GrandPianoKeyboard';
import { GrandPianoStaffViewer } from './GrandPianoStaffViewer';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  Sliders, 
  Volume2, 
  Sparkles, 
  CheckCircle2, 
  Trophy, 
  Award, 
  Repeat, 
  HelpCircle, 
  Eye, 
  EyeOff,
  ChevronRight,
  Hand,
  FastForward
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ClassicalTrackPlayerProps {
  initialTrackId?: string;
  onXpEarned?: (xp: number) => void;
  onOpenDiploma?: () => void;
}

export const ClassicalTrackPlayer: React.FC<ClassicalTrackPlayerProps> = ({
  initialTrackId,
  onXpEarned,
  onOpenDiploma
}) => {
  // Track Selection State
  const [selectedTrackId, setSelectedTrackId] = useState<string>(initialTrackId || 'track-clayderman-always-complete');
  const activeTrack: WholeClassicalTrack = WHOLE_CLASSICAL_TRACKS.find(t => t.trackId === selectedTrackId) || WHOLE_CLASSICAL_TRACKS[0];

  // Hints Panel Toggle
  const [showHintsPanel, setShowHintsPanel] = useState<boolean>(true);

  // Sync initialTrackId when prop changes
  useEffect(() => {
    if (initialTrackId) {
      setSelectedTrackId(initialTrackId);
    }
  }, [initialTrackId]);

  // Playback Modes: 'listen' | 'wait-for-me' | 'strict-performance'
  const [playMode, setPlayMode] = useState<'listen' | 'wait-for-me' | 'strict-performance'>('wait-for-me');

  // Hand Isolation: 'both' | 'RH' | 'LH'
  const [handFilter, setHandFilter] = useState<HandAssignment>('both');

  // Speed Multiplier: 0.5 | 0.75 | 1.0 | 1.25
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);

  // Playback State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentNoteIndex, setCurrentNoteIndex] = useState<number>(0);
  const [soundingNotes, setSoundingNotes] = useState<string[]>([]);
  const [isLooping, setIsLooping] = useState<boolean>(false);

  // Performance Assessment Metrics
  const [notesHitCount, setNotesHitCount] = useState<number>(0);
  const [notesMissedCount, setNotesMissedCount] = useState<number>(0);
  const [assessmentResult, setAssessmentResult] = useState<TrackPlayAssessment | null>(null);

  // Filter notes by hand assignment
  const trackNotes = activeTrack.notes.filter(n => {
    if (handFilter === 'both') return true;
    return n.hand === handFilter;
  });

  const activeTargetNote: VerifiedNoteEvent | undefined = trackNotes[currentNoteIndex];

  // Reset playback when track changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentNoteIndex(0);
    setSoundingNotes([]);
    setNotesHitCount(0);
    setNotesMissedCount(0);
    setAssessmentResult(null);
  }, [selectedTrackId, handFilter]);

  // Concert Listen Mode Playback Loop
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isPlaying && playMode === 'listen') {
      if (currentNoteIndex < trackNotes.length) {
        const currentEvent = trackNotes[currentNoteIndex];
        const nextEvent = trackNotes[currentNoteIndex + 1];

        // Play note
        grandPianoAudio.playNote(currentEvent.note_name, currentEvent.velocity, currentEvent.duration_sec / speedMultiplier);
        setSoundingNotes([currentEvent.note_name]);

        const currentOnset = currentEvent.onset_time_sec;
        const nextOnset = nextEvent ? nextEvent.onset_time_sec : currentOnset + currentEvent.duration_sec;
        const deltaMs = Math.max(50, ((nextOnset - currentOnset) / speedMultiplier) * 1000);

        timer = setTimeout(() => {
          setCurrentNoteIndex(prev => prev + 1);
        }, deltaMs);
      } else {
        // Track completed!
        if (isLooping) {
          setCurrentNoteIndex(0);
        } else {
          setIsPlaying(false);
          setSoundingNotes([]);
          confetti({ particleCount: 30, spread: 60 });
        }
      }
    }

    return () => clearTimeout(timer);
  }, [isPlaying, currentNoteIndex, playMode, trackNotes, speedMultiplier, isLooping]);

  // Handle Note Played by User (Interactive Wait-for-Me or Strict Performance)
  const handleNotePlayed = (note: string) => {
    setSoundingNotes([note]);
    setTimeout(() => setSoundingNotes([]), 800);

    if (!activeTargetNote) return;

    if (playMode === 'wait-for-me') {
      if (note === activeTargetNote.note_name) {
        const nextIdx = currentNoteIndex + 1;
        setNotesHitCount(prev => prev + 1);
        setCurrentNoteIndex(nextIdx);

        if (nextIdx >= trackNotes.length) {
          // Finished Whole Track in Wait-for-Me mode!
          handleFinishTrack(true);
        }
      }
    } else if (playMode === 'strict-performance' && isPlaying) {
      if (note === activeTargetNote.note_name) {
        setNotesHitCount(prev => prev + 1);
      } else {
        setNotesMissedCount(prev => prev + 1);
      }
    }
  };

  // Finish track calculation
  const handleFinishTrack = (isWaitForMe: boolean) => {
    setIsPlaying(false);
    const total = trackNotes.length;
    const hit = isWaitForMe ? total : notesHitCount;
    const accuracy = Math.round((hit / total) * 100);

    let letter: 'S' | 'A' | 'B' | 'C' = 'C';
    let xp = 25;
    if (accuracy >= 95) { letter = 'S'; xp = 75; }
    else if (accuracy >= 85) { letter = 'A'; xp = 50; }
    else if (accuracy >= 70) { letter = 'B'; xp = 35; }

    const assessment: TrackPlayAssessment = {
      trackTitle: activeTrack.title,
      accuracyPercent: accuracy,
      totalNotes: total,
      notesHit: hit,
      notesMissed: total - hit,
      letterGrade: letter,
      tempoStability: 96,
      xpAwarded: xp,
      coachVerdict: letter === 'S' 
        ? 'Virtuoso Flawless Recital! Your touch, timing, and phrasing were sublime!' 
        : 'Superb classical performance! Continue refining legato touch.',
      date: new Date().toLocaleDateString()
    };

    setAssessmentResult(assessment);
    confetti({ particleCount: 50, spread: 80, origin: { y: 0.6 } });
    if (onXpEarned) onXpEarned(xp);
  };

  const currentPercent = Math.min(100, Math.round((currentNoteIndex / Math.max(1, trackNotes.length)) * 100));

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* ======================================================== */}
      {/* 1. WHOLE TRACK HEADER & MASTERPIECE SELECTOR             */}
      {/* ======================================================== */}
      <div className="bg-gradient-to-r from-stone-950 via-amber-950/40 to-stone-950 border border-amber-900/40 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold tracking-wider uppercase flex items-center space-x-1.5 shadow-xs">
                <Trophy className="w-3.5 h-3.5" />
                <span>PLAY WHOLE CLASSICAL TRACKS • REPERTOIRE ENGINE</span>
              </span>
              <span className="text-xs text-stone-400 font-mono">
                {activeTrack.composer} • {activeTrack.opusCatalog} • {activeTrack.tempoMarking}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-black text-amber-100">
              {activeTrack.title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl leading-relaxed">
              {activeTrack.historicalContext}
            </p>
          </div>

          {/* Track Selector Dropdown */}
          <div className="p-3.5 rounded-2xl bg-stone-900/90 border border-amber-900/40 shadow-xl shrink-0 w-full lg:w-auto">
            <span className="text-[10px] font-mono uppercase font-bold text-amber-300 tracking-wider block mb-1.5">
              Select Classical Masterpiece
            </span>
            <select
              value={selectedTrackId}
              onChange={(e) => setSelectedTrackId(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-amber-100 text-xs font-serif font-bold focus:outline-hidden w-full lg:w-72 cursor-pointer"
            >
              {WHOLE_CLASSICAL_TRACKS.map(t => (
                <option key={t.trackId} value={t.trackId}>
                  {t.composer}: {t.title} ({t.difficulty})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Playback Controls & Mode Switches */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-amber-900/30 text-xs font-mono">
          {/* Play / Pause & Modes */}
          <div className="flex flex-wrap items-center gap-2">
            {playMode === 'listen' ? (
              <button
                type="button"
                onClick={() => setIsPlaying(prev => !prev)}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs transition flex items-center space-x-2 shadow-lg cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isPlaying ? 'Pause Playback' : 'Listen Whole Track'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setCurrentNoteIndex(0);
                  setNotesHitCount(0);
                  setAssessmentResult(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-200 border border-stone-800 font-bold text-xs transition flex items-center space-x-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restart Track</span>
              </button>
            )}

            {/* Play Modes (Wait-for-Me vs Listen vs Performance) */}
            <div className="flex items-center rounded-xl bg-stone-900 border border-stone-800 p-0.5">
              {[
                { id: 'wait-for-me', label: 'Wait-for-Me (Practice)' },
                { id: 'listen', label: 'Concert Listen' },
                { id: 'strict-performance', label: 'Recital Challenge' }
              ].map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setPlayMode(m.id as any);
                    setIsPlaying(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg transition font-bold text-[11px] cursor-pointer ${
                    playMode === m.id
                      ? 'bg-amber-500 text-stone-950 shadow-xs'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Hand Isolation & Speed Select */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Hand Filter */}
            <div className="flex items-center space-x-1.5 bg-stone-900 border border-stone-800 rounded-xl px-2 py-1">
              <span className="text-stone-400 text-[10px]">HAND:</span>
              {(['both', 'RH', 'LH'] as HandAssignment[]).map(h => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setHandFilter(h)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition cursor-pointer ${
                    handFilter === h ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-stone-400'
                  }`}
                >
                  {h === 'both' ? 'Both' : h}
                </button>
              ))}
            </div>

            {/* Speed Multiplier */}
            <div className="flex items-center space-x-1 bg-stone-900 border border-stone-800 rounded-xl px-2 py-1">
              <span className="text-stone-400 text-[10px]">SPEED:</span>
              {[0.5, 0.75, 1.0, 1.25].map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSpeedMultiplier(s)}
                  className={`px-1.5 py-0.5 rounded-md text-[11px] font-bold transition cursor-pointer ${
                    speedMultiplier === s ? 'bg-amber-500 text-stone-950' : 'text-stone-400'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Progress & Measure Bar */}
        <div className="space-y-1.5 border-t border-stone-900 pt-3">
          <div className="flex items-center justify-between text-xs font-mono text-stone-400">
            <span>
              Note <strong className="text-amber-300">{currentNoteIndex}</strong> of {trackNotes.length} • Measure {activeTargetNote?.measure || 1} of {activeTrack.measuresTotal}
            </span>
            <span className="text-amber-200 font-bold">{currentPercent}% Completed</span>
          </div>

          <div className="w-full h-2 rounded-full bg-stone-950 border border-stone-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-300 shadow-xs"
              style={{ width: `${currentPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. NEXT NOTE / UPCOMING NOTES STRIP (FALLING TIMELINE)   */}
      {/* ======================================================== */}
      <div className="p-4 rounded-2xl bg-stone-950 border border-amber-900/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <span className="text-xs font-mono text-stone-400 font-bold">NEXT TARGET KEY:</span>
          {activeTargetNote ? (
            <div className="flex items-center space-x-2">
              <span className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-stone-950 font-black text-sm font-mono shadow-md animate-pulse">
                {activeTargetNote.note_name}
              </span>
              <span className="text-xs font-mono text-stone-300">
                Hand: <strong className="text-amber-300">{activeTargetNote.hand}</strong> • 
                Finger: <strong className="text-amber-300">{activeTargetNote.finger_hint || 'Free'}</strong>
              </span>
            </div>
          ) : (
            <span className="text-emerald-400 font-mono text-xs font-bold">Track Completed!</span>
          )}
        </div>

        {/* Upcoming Rolling Note Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar font-mono text-xs">
          <span className="text-[10px] text-stone-500 uppercase mr-1">Upcoming:</span>
          {trackNotes.slice(currentNoteIndex + 1, currentNoteIndex + 9).map((n, idx) => (
            <span
              key={n.id || `${n.note_name}-${idx}`}
              className="px-2 py-1 rounded-lg bg-stone-900 border border-stone-800 text-stone-400 text-[11px]"
            >
              {n.note_name} <span className="text-[9px] text-stone-500">({n.hand})</span>
            </span>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2.5 PLAY-ALONG MASTERCLASS HINTS & REAL-TIME COACH       */}
      {/* ======================================================== */}
      {activeTrack.playAlongGuide && (
        <div className="p-5 rounded-3xl bg-stone-950 border border-amber-900/40 shadow-xl space-y-4">
          {/* Real-time Dynamic Measure Guidance Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-to-r from-amber-950/40 via-stone-900 to-amber-950/40 p-3.5 rounded-2xl border border-amber-500/30">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-bold text-base shrink-0">
                💡
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-amber-400">
                    Live Measure {activeTargetNote?.measure || 1} Hint
                  </span>
                  {activeTargetNote?.lyric_or_annotation && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                      {activeTargetNote.lyric_or_annotation}
                    </span>
                  )}
                  {activeTargetNote?.pedal_hint && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40">
                      Pedal: {activeTargetNote.pedal_hint.toUpperCase()}
                    </span>
                  )}
                </div>
                <p className="text-xs text-amber-100 font-serif font-medium mt-0.5 leading-snug">
                  {activeTrack.playAlongGuide.measureHints?.[activeTargetNote?.measure || 1] || activeTrack.playAlongGuide.overview}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowHintsPanel(prev => !prev)}
              className="text-xs font-mono text-amber-400 hover:text-amber-200 underline cursor-pointer shrink-0"
            >
              {showHintsPanel ? 'Hide Full Play-Along Guide' : 'View Full Play-Along Guide'}
            </button>
          </div>

          {/* Full Expanded Masterclass Guidance */}
          {showHintsPanel && (
            <div className="space-y-4 pt-2 text-xs">
              <p className="text-stone-300 leading-relaxed font-sans text-xs sm:text-[13px]">
                {activeTrack.playAlongGuide.overview}
              </p>

              {/* Harmonic Chord Progression Badges */}
              {activeTrack.playAlongGuide.chordProgression && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider font-bold block">
                    Harmonic Structure & Progression:
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {activeTrack.playAlongGuide.chordProgression.map((chord, cIdx) => (
                      <span
                        key={`chord-${chord}-${cIdx}`}
                        className="px-2.5 py-1 rounded-xl bg-stone-900 border border-amber-900/40 text-amber-300 font-mono font-bold text-xs shadow-xs"
                      >
                        {chord}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Technique & Pedaling Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-2">
                  <div className="flex items-center space-x-2 text-amber-300 font-bold font-serif">
                    <Hand className="w-3.5 h-3.5" />
                    <span>Touch, Hand Posture & Voicing Tips</span>
                  </div>
                  <ul className="space-y-1.5 text-stone-300 text-[11px] list-disc list-inside leading-relaxed">
                    {activeTrack.playAlongGuide.techniqueTips.map((tip, tIdx) => (
                      <li key={`tip-${tIdx}`}>{tip}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-2">
                  <div className="flex items-center space-x-2 text-amber-300 font-bold font-serif">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Pedaling & Expressive Phrasing</span>
                  </div>
                  <div className="space-y-2 text-[11px] text-stone-300 leading-relaxed">
                    <p>
                      <strong className="text-amber-200">Damper Pedal:</strong> {activeTrack.playAlongGuide.pedalAdvice}
                    </p>
                    <p>
                      <strong className="text-amber-200">Phrasing & Breath:</strong> {activeTrack.playAlongGuide.phrasingAdvice}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. PERFORMANCE ASSESSMENT MODAL                         */}
      {/* ======================================================== */}
      {assessmentResult && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/60 via-stone-950 to-amber-950/60 border border-amber-500/50 shadow-2xl space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-900/40 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-black text-2xl font-serif">
                {assessmentResult.letterGrade}
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400 tracking-wider font-bold">
                  Recital Performance Evaluation
                </span>
                <h3 className="text-lg font-serif font-black text-amber-100">
                  {assessmentResult.trackTitle}
                </h3>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-xs font-mono">
              <span className="text-stone-300">Accuracy: <strong className="text-amber-300">{assessmentResult.accuracyPercent}%</strong></span>
              <span className="text-stone-500">•</span>
              <span className="text-stone-300">+{assessmentResult.xpAwarded} XP Earned</span>
            </div>
          </div>

          <p className="text-xs text-stone-200 leading-relaxed font-sans">
            {assessmentResult.coachVerdict}
          </p>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setAssessmentResult(null)}
              className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs font-bold transition border border-stone-800 cursor-pointer"
            >
              Dismiss
            </button>
            {onOpenDiploma && (
              <button
                type="button"
                onClick={onOpenDiploma}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-md"
              >
                <Award className="w-3.5 h-3.5" />
                <span>View Virtuoso Diploma</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. SYNCHRONIZED STAFF NOTATION & INTERACTIVE KEYBOARD    */}
      {/* ======================================================== */}
      <GrandPianoStaffViewer
        activeNote={soundingNotes[0] || null}
        targetNotes={activeTargetNote ? [activeTargetNote.note_name] : []}
        keySignature={activeTrack.keySignature}
        timeSignature={activeTrack.timeSignature}
        tempoBpm={activeTrack.tempoBpm}
        onNoteSelected={handleNotePlayed}
      />

      <GrandPianoKeyboard
        activeNotes={soundingNotes}
        targetNotes={activeTargetNote ? [activeTargetNote.note_name] : []}
        onNotePlayed={handleNotePlayed}
        showFullControls={true}
      />
    </div>
  );
};
