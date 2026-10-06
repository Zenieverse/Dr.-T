import React, { useState } from 'react';
import { SongPiece } from '../../../types/pianistTypes';
import { PIANIST_SONGS } from '../data/pianistData';
import { pianoAudio } from '../audio/pianoAudio';
import { Music2, Play, Pause, RotateCcw, Check, Sparkles, Sliders, ChevronRight, BookOpen } from 'lucide-react';

interface SongLabProps {
  onSelectSongNotes?: (notes: string[]) => void;
  onXpEarned?: (xp: number) => void;
}

const LEARNING_STEPS = [
  { step: 1, title: 'Listen & Absorb', desc: 'Listen to the full arrangement to internalize the emotional phrasing.' },
  { step: 2, title: 'Understand Structure', desc: 'Identify the motif, phrases, and recurring patterns.' },
  { step: 3, title: 'Learn Melody (RH)', desc: 'Isolate Right Hand melody note-by-note.' },
  { step: 4, title: 'Lock the Rhythm', desc: 'Tap and align notes to the metronome pulse.' },
  { step: 5, title: 'Learn Chords (LH)', desc: 'Ground the harmony with Left Hand bass roots.' },
  { step: 6, title: 'Hands Separately', desc: 'Master each hand independently until effortless.' },
  { step: 7, title: 'Hands Together Slow', desc: 'Coordinate both hands at half tempo (50% BPM).' },
  { step: 8, title: 'Play with Accompaniment', desc: 'Play in rhythm with the AI backing band.' },
  { step: 9, title: 'Play from Memory', desc: 'Close your eyes or look at your fingers without sheet music.' },
  { step: 10, title: 'Play by Ear', desc: 'Reproduce the phrases purely guided by pitch memory.' },
  { step: 11, title: 'Transpose Key', desc: 'Shift the melody to a new key signature (e.g. C to G).' },
  { step: 12, title: 'Your Own Arrangement', desc: 'Add left-hand arpeggios, syncopations, and personal dynamics!' },
];

export const SongLab: React.FC<SongLabProps> = ({ onSelectSongNotes, onXpEarned }) => {
  const [selectedSong, setSelectedSong] = useState<SongPiece>(PIANIST_SONGS[0]);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [difficultyTier, setDifficultyTier] = useState<'Beginner' | 'Easy' | 'Intermediate' | 'Ear' | 'Creative'>('Beginner');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeNoteIdx, setActiveNoteIdx] = useState<number>(0);
  const [playbackBpm, setPlaybackBpm] = useState<number>(selectedSong.bpm);

  const handlePlaySong = () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }
    setIsPlaying(true);
    let step = 0;
    const intervalMs = (60 / playbackBpm) * 1000 * 0.5;

    const interval = setInterval(() => {
      if (step >= selectedSong.melodyNotes.length) {
        clearInterval(interval);
        setIsPlaying(false);
        setActiveNoteIdx(0);
        if (onXpEarned) onXpEarned(40);
        return;
      }
      const noteItem = selectedSong.melodyNotes[step];
      pianoAudio.playNote(noteItem.note, 0.85, noteItem.duration * 0.8);
      setActiveNoteIdx(step);
      if (onSelectSongNotes) {
        onSelectSongNotes([noteItem.note]);
      }
      step++;
    }, intervalMs);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Music2 className="w-5 h-5 text-teal-400" />
            Song Lab: 12-Step Structured Repertoire
          </h2>
          <p className="text-xs text-slate-400">
            A single song teaches reading, ear, technique, harmony, and arrangement
          </p>
        </div>

        {/* Difficulty Tier Selector */}
        <div className="flex bg-slate-800 rounded-xl p-1 border border-slate-700 text-xs">
          {(['Beginner', 'Easy', 'Intermediate', 'Ear', 'Creative'] as const).map((tier) => (
            <button
              key={tier}
              type="button"
              onClick={() => setDifficultyTier(tier)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                difficultyTier === tier
                  ? 'bg-teal-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tier === 'Ear' ? '👂 Ear Version' : tier === 'Creative' ? '🎨 Creative' : tier}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Song Selector + Active Song Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Song List */}
        <div className="lg:col-span-4 space-y-2.5">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Repertoire Library ({PIANIST_SONGS.length} Pieces)
          </label>
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {PIANIST_SONGS.map((song) => {
              const isSelected = selectedSong.id === song.id;
              return (
                <button
                  key={song.id}
                  type="button"
                  onClick={() => {
                    setSelectedSong(song);
                    setPlaybackBpm(song.bpm);
                    setActiveNoteIdx(0);
                    setIsPlaying(false);
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-teal-950/70 to-slate-900 border-teal-500/60 ring-1 ring-teal-500/40 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white">{song.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-slate-800 text-teal-300 border border-slate-700">
                      {song.difficulty}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
                    <span>{song.composer}</span>
                    <span className="font-mono text-[11px]">{song.keySignature}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Song Learning Deck & 12 Steps */}
        <div className="lg:col-span-8 bg-slate-950/70 border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
          <div>
            {/* Song Hero Banner */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-white">{selectedSong.title}</span>
                  <span className="text-xs text-slate-400 font-mono">({selectedSong.composer})</span>
                </div>
                <p className="text-xs text-slate-300 mt-1 max-w-xl">
                  {selectedSong.description}
                </p>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handlePlaySong}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition shadow-md ${
                    isPlaying 
                      ? 'bg-amber-400 text-slate-950 animate-pulse' 
                      : 'bg-teal-500 hover:bg-teal-400 text-slate-950'
                  }`}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isPlaying ? 'Pause Melody' : 'Play & Practice Melody'}</span>
                </button>
              </div>
            </div>

            {/* Beginner Pedagogy Tip */}
            <div className="mb-4 p-3 rounded-xl bg-teal-950/40 border border-teal-500/30 text-xs text-teal-200 flex items-start space-x-2.5">
              <Sparkles className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-teal-300">Pianist Tip: </strong>
                {selectedSong.beginnerTips}
              </div>
            </div>

            {/* Note Sequence Tape */}
            {difficultyTier !== 'Ear' ? (
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Melody Phrasing Sequence ({selectedSong.melodyNotes.length} notes)
                </label>
                <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-slate-900 border border-slate-800">
                  {selectedSong.melodyNotes.map((item, idx) => (
                    <button
                      key={`${item.note}-${idx}`}
                      type="button"
                      onClick={() => {
                        pianoAudio.playNote(item.note, 0.85);
                        setActiveNoteIdx(idx);
                        if (onSelectSongNotes) onSelectSongNotes([item.note]);
                      }}
                      className={`px-2.5 py-1.5 rounded-lg font-mono text-xs font-bold transition ${
                        idx === activeNoteIdx
                          ? 'bg-teal-400 text-slate-950 scale-105 shadow-md ring-2 ring-teal-300'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {item.note}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-6 p-6 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <h4 className="text-base font-bold text-amber-300 mb-1">Ear Mode Active (No Sheet Music)</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Listen to the song's opening motif and find the notes on the piano keyboard below without visual aids!
                </p>
              </div>
            )}

            {/* 12-Step Progression Tracker */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  The 12-Step Mastery Journey
                </label>
                <span className="text-xs font-mono text-teal-400">
                  Step {currentStep} of 12: {LEARNING_STEPS[currentStep - 1]?.title}
                </span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 mb-3">
                {LEARNING_STEPS.map((stepItem) => {
                  const isCurrent = stepItem.step === currentStep;
                  const isCompleted = stepItem.step < currentStep;

                  return (
                    <button
                      key={stepItem.step}
                      type="button"
                      onClick={() => setCurrentStep(stepItem.step)}
                      className={`p-2 rounded-lg border text-center transition ${
                        isCurrent
                          ? 'bg-teal-500 border-teal-400 text-slate-950 font-bold shadow-md'
                          : isCompleted
                          ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="block text-xs font-mono">{stepItem.step}</span>
                      <span className="block text-[9px] truncate">{stepItem.title.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                <div>
                  <strong className="text-white">Step {currentStep}: {LEARNING_STEPS[currentStep - 1]?.title}</strong>
                  <p className="text-slate-400 mt-0.5">{LEARNING_STEPS[currentStep - 1]?.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => Math.min(12, prev + 1))}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded-lg font-semibold shrink-0 ml-3 transition"
                >
                  Complete Step
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
