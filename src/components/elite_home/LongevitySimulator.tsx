import React, { useState } from 'react';
import { RETIREMENT_DAILY_RHYTHMS, GLOBAL_MASTERCLASSES, MasterclassProgram } from './eliteHomeData';
import { 
  Sparkles, 
  Clock, 
  Activity, 
  Heart, 
  Sun, 
  Moon, 
  Compass, 
  Users, 
  BookOpen, 
  TreePine, 
  Flame, 
  Award, 
  Calendar,
  CheckCircle,
  GraduationCap
} from 'lucide-react';

export const LongevitySimulator: React.FC = () => {
  const [selectedArchetype, setSelectedArchetype] = useState<'naturalist' | 'scholar' | 'social' | 'creative' | 'active'>('naturalist');
  const [yearsAtEliteHome, setYearsAtEliteHome] = useState<number>(5);
  const [forestHoursPerWeek, setForestHoursPerWeek] = useState<number>(12);
  const [socialEventsPerWeek, setSocialEventsPerWeek] = useState<number>(8);
  const [hyperbaricSessionsPerMonth, setHyperbaricSessionsPerMonth] = useState<number>(6);

  // Calculate dynamic Longevity Metrics
  const calculatedBioAgeReduction = (yearsAtEliteHome * 1.8 + (forestHoursPerWeek / 4) * 0.9 + (socialEventsPerWeek / 3) * 0.8 + (hyperbaricSessionsPerMonth / 2) * 1.1).toFixed(1);
  const telomeraseElevation = Math.min(65, Math.round(18 + forestHoursPerWeek * 1.8 + yearsAtEliteHome * 2.2));
  const deepSleepBoostPercent = Math.min(55, Math.round(22 + forestHoursPerWeek * 1.4 + (hyperbaricSessionsPerMonth * 2.5)));
  const cognitiveVitalityIndex = Math.min(99, Math.round(82 + (socialEventsPerWeek * 1.5) + (yearsAtEliteHome * 1.2)));

  const archetypes = [
    { id: 'naturalist', name: 'The Mindful Naturalist', icon: '🌲', focus: 'Forest bathing, tea gardens, quiet streams, onsen therapy' },
    { id: 'scholar', name: 'The Sage Scholar', icon: '🔬', focus: 'AI research, global mentorship, philosophy, astronomy' },
    { id: 'social', name: 'The Social Epicurean', icon: '🍷', focus: 'Shared dinners, wine tasting, festivals, storytelling' },
    { id: 'creative', name: 'The Creative Visionary', icon: '🎨', focus: 'Sculpture, ceramics, orchestra, poetry salons' },
    { id: 'active', name: 'The Active Adventurer', icon: '⚡', focus: 'Pickleball, waterfall yoga, kayaking, mountain hikes' }
  ];

  return (
    <div className="space-y-6" id="longevity-simulator-root">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-teal-950/40 to-stone-900 p-6 rounded-3xl border border-teal-900/30 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase bg-teal-500/20 text-teal-300 px-2.5 py-0.5 rounded-full font-bold border border-teal-500/30">
              Longevity Science & Daily Rhythm
            </span>
            <span className="text-[10px] font-mono text-stone-400">Biological Age Optimization</span>
          </div>
          <h2 className="text-2xl font-black font-sans tracking-tight">
            A Day in the Life at eLite Home
          </h2>
          <p className="text-xs text-stone-300 max-w-2xl mt-1 leading-relaxed">
            Every hour is calibrated to synchronize circadian rhythms, stimulate cellular autophagy, foster deep human connection, and ignite lifelong intellectual vitality.
          </p>
        </div>

        <div className="bg-stone-950/90 p-4 rounded-2xl border border-teal-500/30 text-right">
          <span className="text-[9px] font-mono text-stone-400 uppercase font-bold block">Avg Biological Age Reversal</span>
          <span className="text-2xl font-black text-teal-400 font-mono">-{calculatedBioAgeReduction} Yrs</span>
        </div>
      </div>

      {/* Archetype Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {archetypes.map((arch) => (
          <button
            key={arch.id}
            onClick={() => setSelectedArchetype(arch.id as any)}
            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between
              ${selectedArchetype === arch.id
                ? 'bg-gradient-to-b from-stone-900 to-teal-950/80 border-teal-500 shadow-lg text-white ring-2 ring-teal-500/30'
                : 'bg-stone-900/80 border-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-900'}
            `}
          >
            <div>
              <div className="text-2xl mb-1">{arch.icon}</div>
              <h4 className="text-xs font-bold text-white font-sans">{arch.name}</h4>
              <p className="text-[10px] text-stone-400 mt-1 line-clamp-2 leading-relaxed">{arch.focus}</p>
            </div>
            <div className="mt-2 text-[9px] font-mono text-teal-400 font-bold">
              {selectedArchetype === arch.id ? '● Active Profile' : 'Select'}
            </div>
          </button>
        ))}
      </div>

      {/* Main Split: Daily Schedule Timeline & Longevity Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 24-Hour Circadian Timeline */}
        <div className="lg:col-span-7 bg-stone-900 border border-stone-800 rounded-3xl p-6 text-white space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-bold font-sans uppercase tracking-wider">
                Circadian Daily Life Rhythm
              </h3>
            </div>
            <span className="text-[9px] font-mono text-stone-400">Natural Light Synced</span>
          </div>

          <div className="space-y-3 max-h-[540px] overflow-y-auto pr-2 scrollbar-thin">
            {RETIREMENT_DAILY_RHYTHMS.map((rhythm, idx) => (
              <div 
                key={idx}
                className="bg-stone-950/80 p-3.5 rounded-2xl border border-stone-800/80 hover:border-teal-500/50 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-3"
              >
                <div className="space-y-1 max-w-md">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/40">
                      {rhythm.time}
                    </span>
                    <h4 className="text-xs font-bold text-white">{rhythm.name}</h4>
                  </div>
                  <span className="text-[10px] font-mono text-rose-300 block">{rhythm.location}</span>
                  <p className="text-[11px] text-stone-400 leading-relaxed">{rhythm.description}</p>
                </div>

                <div className="sm:text-right shrink-0 bg-stone-900/60 p-2 rounded-xl border border-stone-800">
                  <span className="text-[9px] font-mono text-stone-400 uppercase font-bold block">Biomarker Benefit</span>
                  <span className="text-[10px] font-mono text-teal-400 font-bold">{rhythm.healthBenefit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Biological Age & Healthspan Reversal Calculator */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 text-white space-y-5">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-400" />
              <h3 className="text-sm font-bold font-sans uppercase tracking-wider text-teal-300">
                Longevity Multiplier Simulator
              </h3>
            </div>

            {/* Sliders */}
            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between text-[11px] font-mono mb-1">
                  <span className="text-stone-300">Years in eLite Sanctuary:</span>
                  <span className="text-teal-400 font-bold">{yearsAtEliteHome} Years</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="20" 
                  value={yearsAtEliteHome} 
                  onChange={(e) => setYearsAtEliteHome(Number(e.target.value))}
                  className="w-full accent-teal-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-mono mb-1">
                  <span className="text-stone-300">Forest Bathing (Shinrin-yoku):</span>
                  <span className="text-teal-400 font-bold">{forestHoursPerWeek} Hours / Wk</span>
                </div>
                <input 
                  type="range" 
                  min="2" 
                  max="30" 
                  value={forestHoursPerWeek} 
                  onChange={(e) => setForestHoursPerWeek(Number(e.target.value))}
                  className="w-full accent-teal-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-mono mb-1">
                  <span className="text-stone-300">Social Dinners & Exchanges:</span>
                  <span className="text-teal-400 font-bold">{socialEventsPerWeek} Gatherings / Wk</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="14" 
                  value={socialEventsPerWeek} 
                  onChange={(e) => setSocialEventsPerWeek(Number(e.target.value))}
                  className="w-full accent-teal-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-mono mb-1">
                  <span className="text-stone-300">Hyperbaric / Cryo Sessions:</span>
                  <span className="text-teal-400 font-bold">{hyperbaricSessionsPerMonth} Sessions / Mo</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="16" 
                  value={hyperbaricSessionsPerMonth} 
                  onChange={(e) => setHyperbaricSessionsPerMonth(Number(e.target.value))}
                  className="w-full accent-teal-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Simulated Biomarkers Results Grid */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-stone-800">
              <div className="bg-stone-950 p-3 rounded-2xl border border-stone-800">
                <span className="text-[9px] font-mono text-stone-400 uppercase font-bold block">Telomerase Activity</span>
                <span className="text-base font-black text-emerald-400 font-mono">+{telomeraseElevation}%</span>
              </div>

              <div className="bg-stone-950 p-3 rounded-2xl border border-stone-800">
                <span className="text-[9px] font-mono text-stone-400 uppercase font-bold block">Deep REM Sleep</span>
                <span className="text-base font-black text-sky-400 font-mono">+{deepSleepBoostPercent}%</span>
              </div>

              <div className="bg-stone-950 p-3 rounded-2xl border border-stone-800">
                <span className="text-[9px] font-mono text-stone-400 uppercase font-bold block">Cognitive Vitality</span>
                <span className="text-base font-black text-purple-400 font-mono">{cognitiveVitalityIndex}/100</span>
              </div>

              <div className="bg-stone-950 p-3 rounded-2xl border border-stone-800">
                <span className="text-[9px] font-mono text-stone-400 uppercase font-bold block">Chronic Stress Index</span>
                <span className="text-base font-black text-rose-400 font-mono">-76% Cortisol</span>
              </div>
            </div>
          </div>

          {/* Masterclasses Box */}
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 text-white space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-purple-400" />
                <h4 className="text-xs font-bold font-sans uppercase tracking-wider">
                  Senior Fellow Masterclasses
                </h4>
              </div>
              <span className="text-[9px] font-mono text-stone-400">94 Nations</span>
            </div>

            <div className="space-y-2">
              {GLOBAL_MASTERCLASSES.map((cls) => (
                <div key={cls.id} className="bg-stone-950/80 p-2.5 rounded-xl border border-stone-800 text-xs">
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                    <span className="text-purple-400 font-bold">{cls.flag} {cls.category}</span>
                    <span className="text-stone-400">{cls.schedule.split(',')[0]}</span>
                  </div>
                  <h5 className="font-bold text-white line-clamp-1">{cls.title}</h5>
                  <p className="text-[10px] text-stone-400 mt-0.5">{cls.mentorName} • {cls.mentorTitle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
