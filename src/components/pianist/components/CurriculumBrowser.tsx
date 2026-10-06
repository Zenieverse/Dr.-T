import React, { useState } from 'react';
import { Lesson } from '../../../types/pianistTypes';
import { PIANIST_LESSONS } from '../data/pianistData';
import { pianoAudio } from '../audio/pianoAudio';
import { BookOpen, CheckCircle, Play, Sparkles, Clock, ArrowRight, ShieldCheck, Video } from 'lucide-react';

interface CurriculumProps {
  onSelectLessonNotes?: (notes: string[]) => void;
  onXpEarned?: (xp: number) => void;
}

const PATHS = [
  { id: 'all', title: 'All Paths' },
  { id: 'first-notes', title: '1. First Notes' },
  { id: 'rhythm', title: '2. Rhythm & Time' },
  { id: 'note-reading', title: '3. Note Reading' },
  { id: 'chords', title: '4. Chords & Harmony' },
  { id: 'play-by-ear', title: '5. Play by Ear' },
  { id: 'improvisation', title: '6. Improvisation' },
];

export const CurriculumBrowser: React.FC<CurriculumProps> = ({ onSelectLessonNotes, onXpEarned }) => {
  const [selectedPath, setSelectedPath] = useState<string>('all');
  const [activeLesson, setActiveLesson] = useState<Lesson>(PIANIST_LESSONS[0]);
  const [activeLoopStep, setActiveLoopStep] = useState<'learn' | 'hear' | 'play' | 'prove'>('learn');

  const filteredLessons = selectedPath === 'all'
    ? PIANIST_LESSONS
    : PIANIST_LESSONS.filter(l => l.pathId === selectedPath);

  const handleAuditionLessonNotes = () => {
    pianoAudio.playArpeggio(activeLesson.notesToPlay, 260);
    if (onSelectLessonNotes) {
      onSelectLessonNotes(activeLesson.notesToPlay);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-400" />
            Curriculum & Guided Musical Pathways
          </h2>
          <p className="text-xs text-slate-400">
            Learn → Watch → Hear → Play → Practice → Prove → Apply → Create
          </p>
        </div>

        {/* Path Filter Tabs */}
        <div className="flex flex-wrap gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
          {PATHS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedPath(p.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                selectedPath === p.id
                  ? 'bg-teal-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Lesson Browser & Active Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Lesson List */}
        <div className="lg:col-span-4 space-y-2 max-h-[520px] overflow-y-auto pr-1">
          {filteredLessons.map((lesson) => {
            const isSelected = activeLesson.id === lesson.id;
            return (
              <button
                key={lesson.id}
                type="button"
                onClick={() => {
                  setActiveLesson(lesson);
                  setActiveLoopStep('learn');
                }}
                className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-teal-950/70 border-teal-500/60 ring-1 ring-teal-500/40 text-white shadow-md'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-teal-400 uppercase">
                    {lesson.category}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" /> {lesson.estimatedMinutes}m
                  </span>
                </div>
                <div className="font-bold text-sm text-white mt-1">{lesson.title}</div>
                <div className="text-xs text-slate-400 mt-0.5 truncate">{lesson.subtitle}</div>
              </button>
            );
          })}
        </div>

        {/* Active Lesson Studio */}
        <div className="lg:col-span-8 bg-slate-950/70 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            {/* Lesson Title Banner */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono text-teal-400 font-bold uppercase tracking-wider">
                  {activeLesson.category} • {activeLesson.level}
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">{activeLesson.title}</h3>
                <p className="text-xs text-slate-300 mt-1">{activeLesson.description}</p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleAuditionLessonNotes}
                  className="px-3.5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition flex items-center space-x-1.5 shadow-md"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Audition Notes</span>
                </button>
              </div>
            </div>

            {/* Learning Loop Stepper */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {[
                { id: 'learn', label: '1. Learn', desc: 'Concept' },
                { id: 'hear', label: '2. Hear', desc: 'Acoustic Sound' },
                { id: 'play', label: '3. Play', desc: 'Guided Touch' },
                { id: 'prove', label: '4. Prove', desc: 'Without Hints' },
              ].map((step) => (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveLoopStep(step.id as any)}
                  className={`p-2.5 rounded-xl border text-center transition ${
                    activeLoopStep === step.id
                      ? 'bg-teal-500 border-teal-400 text-slate-950 font-bold shadow-md'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="block text-xs font-bold">{step.label}</span>
                  <span className="block text-[10px] text-slate-400">{step.desc}</span>
                </button>
              ))}
            </div>

            {/* Step Body Content */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 mb-6">
              {activeLoopStep === 'learn' && (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-teal-300">Pedagogical Explanation:</h4>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {activeLesson.learnText}
                  </p>
                </div>
              )}

              {activeLoopStep === 'hear' && (
                <div className="space-y-3 text-center py-4">
                  <h4 className="text-sm font-bold text-teal-300">Acoustic Demonstration:</h4>
                  <p className="text-xs text-slate-300">
                    Listen to the pitch relationships:
                  </p>
                  <div className="flex justify-center gap-2">
                    {activeLesson.notesToPlay.map((n) => (
                      <span key={n} className="px-3 py-1.5 rounded-lg bg-slate-800 text-teal-300 font-mono font-bold text-xs border border-slate-700">
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {activeLoopStep === 'play' && (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-teal-300">Your Turn on the Keys:</h4>
                  <p className="text-xs text-slate-200">
                    {activeLesson.interactivePrompt}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>Target keys:</span>
                    {activeLesson.notesToPlay.map((n) => (
                      <strong key={n} className="text-teal-300 font-mono">{n}</strong>
                    ))}
                  </div>
                </div>
              )}

              {activeLoopStep === 'prove' && (
                <div className="space-y-3 text-center py-2">
                  <h4 className="text-sm font-bold text-amber-300">Mastery Assessment:</h4>
                  <p className="text-xs text-slate-200">
                    Play the sequence smoothly from memory without looking at note letter labels!
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (onXpEarned) onXpEarned(50);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition inline-flex items-center space-x-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Mark Lesson Mastered (+50 XP)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
