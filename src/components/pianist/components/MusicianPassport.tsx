import React from 'react';
import { PianistProfile } from '../../../types/pianistTypes';
import { Award, Zap, Flame, Clock, Trophy, CheckCircle, BarChart3, Star } from 'lucide-react';

interface PassportProps {
  profile: PianistProfile;
}

const BADGES_ALL = [
  { id: 'First Note', title: 'First Note', icon: '🎹', desc: 'Played your very first note on Middle C' },
  { id: 'Middle C Master', title: 'Middle C Master', icon: '🎯', desc: 'Identified all landmark C notes on keyboard' },
  { id: '3-Day Streak', title: '3-Day Streak', icon: '🔥', desc: 'Maintained practice consistency for 3 days' },
  { id: 'First Melody by Ear', title: 'First Melody by Ear', icon: '👂', desc: 'Reproduced a 3-note melody without sheet music' },
  { id: 'First Outdoor Mission', title: 'Touch Grass Pioneer', icon: '🌿', desc: 'Completed your first 60-second outdoor listening walk' },
  { id: 'First Sound-to-Piano', title: 'World to Piano', icon: '👣', desc: 'Transformed an environmental rhythm into a piano exercise' },
  { id: 'Major Chord Pioneer', title: 'Major Chord Pioneer', icon: '✨', desc: 'Built and voiced C Major triad in root position' },
  { id: 'Silent Listener', title: 'Silent Listener', icon: '🤫', desc: 'Completed 60 seconds of phone-free active listening' },
  { id: 'Two-Hand Harmony', title: 'Two-Hand Harmony', icon: '🙌', desc: 'Played left hand bass and right hand melody together' },
  { id: 'Sight-Reader', title: 'Sight-Reader', icon: '🎼', desc: 'Sight-read a full 8-measure exercise at 85%+ accuracy' },
  { id: 'Independent Pianist', title: 'Independent Pianist', icon: '👑', desc: 'Completed the Ultimate Milestone Challenge' },
];

export const MusicianPassport: React.FC<PassportProps> = ({ profile }) => {
  const { passport, badges } = profile;

  const categories = [
    { label: 'Technique', value: passport.technique, icon: '🎹', color: 'bg-emerald-500' },
    { label: 'Reading', value: passport.reading, icon: '🎼', color: 'bg-teal-500' },
    { label: 'Ear', value: passport.ear, icon: '👂', color: 'bg-amber-500' },
    { label: 'Rhythm', value: passport.rhythm, icon: '🥁', color: 'bg-purple-500' },
    { label: 'Theory', value: passport.theory, icon: '🧠', color: 'bg-indigo-500' },
    { label: 'Creativity', value: passport.creativity, icon: '🎨', color: 'bg-rose-500' },
    { label: 'Performance', value: passport.performance, icon: '🎤', color: 'bg-sky-500' },
    { label: 'Listening', value: passport.activeListening || 70, icon: '🌿', color: 'bg-emerald-400' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            Musician Passport & Skill Radar
          </h2>
          <p className="text-xs text-slate-400">
            Holistic musical growth across 7 foundational pillars
          </p>
        </div>

        {/* Global XP & Level */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Level {profile.levelNumber} Pianist</span>
          </div>
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 font-bold">
            <Zap className="w-4 h-4 text-teal-400" />
            <span>{profile.totalXp} XP</span>
          </div>
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 font-bold">
            <Flame className="w-4 h-4 text-rose-400" />
            <span>{profile.streakDays} Day Streak</span>
          </div>
        </div>
      </div>

      {/* 7 Skill Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3 mb-8">
        {categories.map((cat) => (
          <div
            key={cat.label}
            className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-center flex flex-col justify-between"
          >
            <div>
              <span className="text-2xl mb-1 block">{cat.icon}</span>
              <span className="text-xs font-bold text-slate-300 block">{cat.label}</span>
            </div>
            <div className="mt-3">
              <div className="text-lg font-mono font-black text-white">{cat.value}%</div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                <div
                  className={`h-full rounded-full ${cat.color}`}
                  style={{ width: `${cat.value}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Milestone Badges Collection */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Star className="w-3.5 h-3.5 text-amber-400" />
          Milestone Badges ({badges.length} of {BADGES_ALL.length} Unlocked)
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {BADGES_ALL.map((b) => {
            const isUnlocked = badges.includes(b.id);
            return (
              <div
                key={b.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isUnlocked
                    ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-amber-500/40 text-slate-200 shadow-md ring-1 ring-amber-500/20'
                    : 'bg-slate-950/40 border-slate-800/80 text-slate-600 opacity-60'
                }`}
              >
                <div className="text-2xl mb-1.5">{b.icon}</div>
                <div className="font-bold text-xs text-white">{b.title}</div>
                <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">{b.desc}</div>
                <div className="mt-2 text-[10px] font-mono">
                  {isUnlocked ? (
                    <span className="text-amber-400 font-bold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Unlocked
                    </span>
                  ) : (
                    <span className="text-slate-500">Locked</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
