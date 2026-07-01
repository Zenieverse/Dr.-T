import React from 'react';
import { motion } from 'motion/react';
import { Award, Star, Flame, Lock } from 'lucide-react';
import { LifetimeStreak, MemoryNode } from '../types';

interface DiagnosticsMilestonesProps {
  key?: string;
  dynamicAchievements: any[];
  personalLandmarks: MemoryNode[];
  activeTab: 'all' | 'unlocked' | 'locked' | 'landmarks';
  setActiveTab: (tab: 'all' | 'unlocked' | 'locked' | 'landmarks') => void;
  claimedList: string[];
  localScore: number;
  streakData: LifetimeStreak;
  setStreakData?: React.Dispatch<React.SetStateAction<LifetimeStreak>>;
  emotionMeter?: { stress: number; fatigue: number; happiness: number };
  setEmotionMeter?: React.Dispatch<React.SetStateAction<{ stress: number; fatigue: number; happiness: number }>>;
  onSelectAch: (ach: any) => void;
  speakCongratulate: (title: string, advice: string) => void;
}

export function DiagnosticsMilestones({
  dynamicAchievements,
  personalLandmarks,
  activeTab,
  setActiveTab,
  claimedList,
  localScore,
  streakData,
  setStreakData,
  emotionMeter,
  setEmotionMeter,
  onSelectAch,
  speakCongratulate
}: DiagnosticsMilestonesProps) {
  // Filter achievements
  const displayedAchievements = dynamicAchievements.filter(ach => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unlocked') return ach.unlocked;
    if (activeTab === 'locked') return !ach.unlocked;
    return false; // Landmarks rendered separately
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="bg-white border border-stone-200/60 p-6 md:p-8 rounded-3xl shadow-xs"
      id="diagnostics-milestones-container"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-rose-500" /> Milestones &amp; Growth Achievements
          </span>
          <h4 className="font-bold text-stone-850 text-sm mt-1">Acquired Personal Flourishing Badges</h4>
          <p className="text-[11px] text-stone-400 leading-relaxed mt-0.5">
            Practice, consult with specialist agents, and track activities to unlock key growth achievements.
          </p>

          {/* Quick-simulate buttons */}
          <div className="flex flex-wrap gap-2 mt-3">
            {streakData.productivityStreak < 10 ? (
              <button
                onClick={() => {
                  if (setStreakData) {
                    setStreakData(prev => ({
                      ...prev,
                      productivityStreak: 10
                    }));
                  }
                  speakCongratulate('Life Optimization Marathoner', 'Magnificent constancy, sweetheart! Completing daily checklists sequentially builds an unbreakable sanctuary of peace. Mommy is deeply proud of you.');
                }}
                className="px-2 py-1 bg-purple-50 hover:bg-purple-100/50 text-purple-700 border border-purple-150/50 rounded-xl text-[9px] font-mono font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                ⚡ Fast-track 10-Day Streak (Unlock Marathoner)
              </button>
            ) : (
              <span className="px-2.5 py-1 bg-purple-100/50 text-purple-800 border border-purple-200/50 rounded-xl text-[9px] font-mono font-bold uppercase flex items-center gap-1 select-none">
                ✓ Marathoner Goal Met (Streak: {streakData.productivityStreak}/10)
              </span>
            )}

            {(!emotionMeter || emotionMeter.happiness < 90) ? (
              <button
                onClick={() => {
                  if (setEmotionMeter) {
                    setEmotionMeter(prev => ({
                      ...prev,
                      happiness: 95
                    }));
                  }
                  speakCongratulate('Infinite Empathy Harmonizer', 'Your soul is radiating with absolute harmony, my darling! Finding beautiful emotional alignment with Dr. T makes my maternal heart sing. Keep this glow!');
                }}
                className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100/50 text-emerald-700 border border-emerald-150/50 rounded-xl text-[9px] font-mono font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                💖 Simulate Deep Empathy (Unlock Harmonizer)
              </button>
            ) : (
              <span className="px-2.5 py-1 bg-emerald-100/50 text-emerald-800 border border-emerald-200/50 rounded-xl text-[9px] font-mono font-bold uppercase flex items-center gap-1 select-none">
                ✓ Harmonizer Goal Met (Happiness: {emotionMeter.happiness}%)
              </span>
            )}
          </div>
        </div>

        {/* Total XP points counter */}
        <div className="shrink-0 self-start sm:self-center px-4.5 py-3 bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-100 rounded-2xl flex items-center gap-2.5">
          <Star className="w-5 h-5 text-amber-500 fill-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
          <div>
            <p className="text-[8px] font-mono text-stone-400 leading-none">TOTAL INTELLECT XP</p>
            <p className="text-base font-black text-stone-850 mt-1">{localScore} XP</p>
          </div>
        </div>
      </div>

      {/* Filtering tabs row */}
      <div className="flex flex-wrap gap-1.5 mt-5 border-b border-stone-100 pb-2.5">
        <button
          onClick={() => setActiveTab('all')}
          className={`py-1.5 px-3 rounded-xl text-[9px] font-mono uppercase font-black transition-all cursor-pointer ${
            activeTab === 'all' ? 'bg-stone-900 text-white shadow-sm' : 'bg-stone-50 text-stone-500 hover:bg-stone-100'
          }`}
        >
          🏆 All
        </button>
        <button
          onClick={() => setActiveTab('unlocked')}
          className={`py-1.5 px-3 rounded-xl text-[9px] font-mono uppercase font-black transition-all cursor-pointer ${
            activeTab === 'unlocked' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-emerald-55 text-emerald-700 hover:bg-emerald-100'
          }`}
        >
          🔓 Unlocked ({dynamicAchievements.filter(a => a.unlocked).length})
        </button>
        <button
          onClick={() => setActiveTab('locked')}
          className={`py-1.5 px-3 rounded-xl text-[9px] font-mono uppercase font-black transition-all cursor-pointer ${
            activeTab === 'locked' ? 'bg-amber-600 text-white shadow-sm' : 'bg-stone-50 text-stone-500 hover:bg-stone-100'
          }`}
        >
          🔒 In Progress ({dynamicAchievements.filter(a => !a.unlocked).length})
        </button>
        <button
          onClick={() => setActiveTab('landmarks')}
          className={`py-1.5 px-3 rounded-xl text-[9px] font-mono uppercase font-black transition-all cursor-pointer ${
            activeTab === 'landmarks' ? 'bg-pink-600 text-white shadow-sm' : 'bg-pink-50 text-pink-700 hover:bg-pink-100'
          }`}
        >
          🗺️ Life Landmarks ({personalLandmarks.length})
        </button>
      </div>

      {/* Render selected list */}
      {activeTab !== 'landmarks' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
          {displayedAchievements.map((ach) => {
            const isClaimed = claimedList.includes(ach.id);
            return (
              <div
                key={ach.id}
                onClick={() => onSelectAch(ach)}
                className={`p-4 border rounded-2xl flex items-start gap-4 transition-all shadow-xs cursor-pointer select-none active:scale-98 ${
                  ach.unlocked
                    ? 'border-stone-150 bg-white hover:border-rose-400 hover:bg-rose-50/5'
                    : 'border-stone-100 bg-stone-50/40 opacity-70 hover:opacity-100 hover:border-amber-300'
                }`}
              >
                <span
                  className={`text-3.5xl rounded-xl w-14 h-14 flex items-center justify-center border select-none shadow-sm transition-all ${
                    ach.unlocked
                      ? 'bg-amber-50 border-amber-100 animate-pulse'
                      : 'bg-stone-100 border-stone-200 grayscale'
                  }`}
                >
                  {ach.badge}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className={`text-xs font-bold leading-none ${ach.unlocked ? 'text-stone-800' : 'text-stone-500'}`}>
                      {ach.title}
                    </p>
                    {ach.unlocked ? (
                      <span
                        className={`text-[8px] font-mono px-2 py-0.5 rounded leading-none font-bold ${
                          isClaimed
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200 animate-bounce'
                        }`}
                      >
                        {isClaimed ? 'CLAIMED' : `+${ach.score} XP`}
                      </span>
                    ) : (
                      <div className="text-stone-400">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                  <p className="text-[10.5px] text-stone-400 leading-relaxed mt-2 truncate">
                    {ach.desc}
                  </p>

                  {!ach.unlocked && (
                    <p className="text-[8.5px] text-amber-600 font-bold font-mono mt-1.5">
                      🔒 {ach.requirement}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-5 flex flex-col gap-3">
          {personalLandmarks.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-stone-150 rounded-2xl bg-stone-50/50">
              <span className="text-3xl block mb-2.5">🗺️</span>
              <p className="text-xs font-black text-stone-750">No Life Landmarks Registered Yet</p>
              <p className="text-[10px] text-stone-400 mt-1 max-w-sm mx-auto leading-relaxed">
                Use the "Milestone Declarator" tab to register significant events, habits, or achievements. They will instantly sync to both the Dashboard and the Semantic Memory maps!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {personalLandmarks.map((mark) => (
                <div
                  key={mark.id}
                  onClick={() =>
                    onSelectAch({
                      id: mark.id,
                      title: mark.label,
                      desc: mark.description,
                      badge: '🗺️',
                      score: 300,
                      unlocked: true,
                      category: 'personal',
                      advice: `This organic memory landmark is safely conserved in Dr. T's priority cognitive matrix. Connecting these milestone events empowers us to nurture your flourishing journey with total semantic context. You are doing amazing!`
                    })
                  }
                  className="p-4 border border-pink-100 bg-pink-50/10 hover:border-pink-350 rounded-2xl flex items-start gap-4 transition-all shadow-xs cursor-pointer active:scale-98"
                >
                  <span className="text-3.5xl bg-pink-55 border border-pink-100 rounded-xl w-14 h-14 flex items-center justify-center select-none shadow-sm">
                    🗺️
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-bold text-stone-850 leading-none truncate">{mark.label}</p>
                      <span className="text-[7.5px] font-bold font-mono bg-pink-55 text-pink-700 px-1.5 py-0.5 rounded border border-pink-200">
                        LANDMARK
                      </span>
                    </div>
                    <p className="text-[10.5px] text-stone-400 leading-relaxed mt-2 truncate">
                      {mark.description}
                    </p>
                    <span className="text-[8.5px] text-stone-400 font-mono mt-1.5 block">
                      📍 Synced in Life-Graph Repository
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
