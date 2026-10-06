import React, { useState } from 'react';
import { Users, GraduationCap, Heart, CheckCircle, Clock, BookOpen, Send, Sparkles } from 'lucide-react';

export const TeacherParentView: React.FC = () => {
  const [roleMode, setRoleMode] = useState<'teacher' | 'parent'>('teacher');
  const [feedbackSent, setFeedbackSent] = useState<boolean>(false);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-teal-400" />
            Teacher & Family Mentorship Portal
          </h2>
          <p className="text-xs text-slate-400">
            Monitor real musical growth, assign personalized repertoire, and encourage consistency
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex bg-slate-800 rounded-xl p-1 border border-slate-700 text-xs">
          <button
            type="button"
            onClick={() => setRoleMode('teacher')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              roleMode === 'teacher' ? 'bg-teal-500 text-slate-950 font-bold shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Teacher Dashboard
          </button>
          <button
            type="button"
            onClick={() => setRoleMode('parent')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              roleMode === 'parent' ? 'bg-teal-500 text-slate-950 font-bold shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Parent & Family View
          </button>
        </div>
      </div>

      {roleMode === 'teacher' ? (
        /* TEACHER DASHBOARD */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-xs text-slate-400 block">Student Active</span>
              <span className="text-base font-bold text-white mt-1 block">Anna M. (Beginner II)</span>
              <span className="text-xs text-teal-400">Weekly Practice: 86 Minutes</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-xs text-slate-400 block">Curriculum Status</span>
              <span className="text-base font-bold text-white mt-1 block">Path 3: Note Reading</span>
              <span className="text-xs text-emerald-400">7 of 10 Lessons Mastered</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-xs text-slate-400 block">Active Repertoire</span>
              <span className="text-base font-bold text-white mt-1 block">Minuet in G (Petzold)</span>
              <span className="text-xs text-amber-400">Step 7: Hands Together Slow</span>
            </div>
          </div>

          {/* Student Skills Breakdown */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Student Competency Assessment
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[11px] text-slate-400">Reading</span>
                <span className="text-lg font-mono font-bold text-white block mt-1">74%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[11px] text-slate-400">Ear Radar</span>
                <span className="text-lg font-mono font-bold text-teal-400 block mt-1">61%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[11px] text-slate-400">Rhythm</span>
                <span className="text-lg font-mono font-bold text-emerald-400 block mt-1">83%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[11px] text-slate-400">Technique</span>
                <span className="text-lg font-mono font-bold text-amber-400 block mt-1">69%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[11px] text-slate-400">Theory</span>
                <span className="text-lg font-mono font-bold text-indigo-400 block mt-1">72%</span>
              </div>
            </div>
          </div>

          {/* Teacher Recommendation & Assignment Dispatch */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <strong className="text-xs text-teal-400 uppercase tracking-wider">Teacher Guidance Note:</strong>
              <p className="text-xs text-slate-200 mt-1 max-w-lg">
                Recommended focus for Anna: F to G transition and left-hand steady pulse. Assign Hanon No. 1 and Ear Lab Level 4.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFeedbackSent(true)}
              className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition flex items-center space-x-2 shadow-md shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{feedbackSent ? 'Assignment Dispatched ✓' : 'Dispatch Assignment'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* PARENT & FAMILY VIEW */
        <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-6">
          <div className="flex items-center space-x-3 text-rose-400">
            <Heart className="w-6 h-6 fill-current" />
            <h3 className="text-base font-bold text-white">Leo's Piano Journey</h3>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            At PIANIST, we celebrate consistency, curiosity, and musical confidence rather than stressful testing. Here is a view of your child's weekly achievements:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-xs text-slate-400 block">Weekly Practice</span>
              <span className="text-2xl font-mono font-bold text-emerald-400 block mt-1">65 Min</span>
              <span className="text-[11px] text-slate-500">Above 10 min/day target</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-xs text-slate-400 block">Songs Learned</span>
              <span className="text-2xl font-mono font-bold text-teal-400 block mt-1">3 Pieces</span>
              <span className="text-[11px] text-slate-500">Ode to Joy, Heart & Soul</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-xs text-slate-400 block">Badges Collected</span>
              <span className="text-2xl font-mono font-bold text-amber-400 block mt-1">5 Badges</span>
              <span className="text-[11px] text-slate-500">Ear Pioneer, 3-Day Streak</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
