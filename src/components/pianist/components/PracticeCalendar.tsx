import React, { useState } from 'react';
import { Calendar, Clock, Bell, CheckCircle2, TrendingUp, Sparkles, AlertCircle } from 'lucide-react';
import { PracticeDuration } from '../../../types/pianistTypes';

export const PracticeCalendar: React.FC = () => {
  const [weeklySchedule, setWeeklySchedule] = useState([
    { day: 'Mon', minutes: 20, completed: true, focus: 'Warm-up & Ear Lab' },
    { day: 'Tue', minutes: 20, completed: true, focus: 'C Major Scale & Chords' },
    { day: 'Wed', minutes: 0, completed: true, focus: 'Rest & Auditory Listening' },
    { day: 'Thu', minutes: 30, completed: true, focus: 'Für Elise Motif' },
    { day: 'Fri', minutes: 20, completed: false, focus: 'Sight-Reading Sprint' },
    { day: 'Sat', minutes: 45, completed: false, focus: 'AI Ensemble Jam' },
    { day: 'Sun', minutes: 20, completed: false, focus: 'Free Exploration & Review' },
  ]);

  const [reminderActive, setReminderActive] = useState<boolean>(true);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-400" />
            Practice Calendar & Smart Routine
          </h2>
          <p className="text-xs text-slate-400">
            Encouraging consistency over grueling repetition • Flexible 5 to 60 minute scheduling
          </p>
        </div>

        <button
          type="button"
          onClick={() => setReminderActive(!reminderActive)}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 border transition ${
            reminderActive
              ? 'bg-teal-500/10 border-teal-500/40 text-teal-300'
              : 'bg-slate-800 border-slate-700 text-slate-400'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Smart Reminders: {reminderActive ? 'Active' : 'Muted'}</span>
        </button>
      </div>

      {/* Encouraging Smart Notification Quote */}
      <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-teal-950/60 via-slate-900 to-slate-950 border border-teal-500/30 flex items-start space-x-3 text-xs">
        <Sparkles className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-teal-200">Daily Inspiration: </strong>
          <span className="text-slate-300">
            "Your piano is waiting for today's 20-minute mission. You are only one focused session away from solidifying your C Major to F Major voice leading!"
          </span>
        </div>
      </div>

      {/* Weekly Schedule Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-7 gap-2.5 mb-8">
        {weeklySchedule.map((item, idx) => (
          <div
            key={item.day}
            className={`p-3.5 rounded-xl border text-center flex flex-col justify-between ${
              item.completed
                ? 'bg-slate-950/90 border-emerald-500/40 text-slate-200'
                : 'bg-slate-950/60 border-slate-800 text-slate-400'
            }`}
          >
            <div>
              <span className="text-xs font-bold block text-white">{item.day}</span>
              <span className="text-lg font-mono font-bold block text-teal-400 mt-1">
                {item.minutes > 0 ? `${item.minutes}m` : 'Rest'}
              </span>
            </div>
            <div className="mt-3 text-[10px] leading-tight text-slate-400">
              {item.focus}
            </div>
            <div className="mt-2 text-[10px]">
              {item.completed ? (
                <span className="text-emerald-400 font-bold flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Done
                </span>
              ) : (
                <span className="text-slate-500 font-mono">Planned</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Session Diagnostics Review Card */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 sm:p-6">
        <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-teal-400" />
          Latest Practice Diagnostic Review (Yesterday)
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Non-judgmental performance telemetry framing mistakes as actionable learning data
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-center">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Note Accuracy</span>
            <span className="text-lg font-mono font-bold text-emerald-400">89%</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Rhythm Precision</span>
            <span className="text-lg font-mono font-bold text-teal-400">92%</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Tempo Stability</span>
            <span className="text-lg font-mono font-bold text-amber-400">76%</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Ear Recognition</span>
            <span className="text-lg font-mono font-bold text-sky-400">81%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300">
            <strong>✅ You Improved:</strong>
            <p className="text-slate-300 mt-0.5">Smooth C Major to G Major transition with relaxed thumb anchor.</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-300">
            <strong>🎯 Keep Practicing:</strong>
            <p className="text-slate-300 mt-0.5">Left-hand steady quarter-note pulse during measure 4.</p>
          </div>
          <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-indigo-300">
            <strong>🚀 Tomorrow's Focus:</strong>
            <p className="text-slate-300 mt-0.5">F Major chord inversion and two-octave arpeggio sweep.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
