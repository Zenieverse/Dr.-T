import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Flame, Activity, ShieldCheck, Heart, Zap, Thermometer, Brain } from 'lucide-react';
import { MedLog, TaskItem, CarbonHabit, LifetimeStreak } from '../types';

interface DiagnosticsAnalyticsProps {
  key?: string;
  medList: MedLog[];
  taskList: TaskItem[];
  carbonList: CarbonHabit[];
  streakData: LifetimeStreak;
  emotionMeter?: { stress: number; fatigue: number; happiness: number };
}

export function DiagnosticsAnalytics({
  medList,
  taskList,
  carbonList,
  streakData,
  emotionMeter
}: DiagnosticsAnalyticsProps) {
  // Calculations
  const medTotal = medList.length;
  const medTaken = medList.filter(m => m.taken).length;
  const medCompliancePercent = medTotal > 0 ? Math.round((medTaken / medTotal) * 100) : 100;

  const taskTotal = taskList.length;
  const taskDone = taskList.filter(t => t.status === 'done').length;
  const taskPercent = taskTotal > 0 ? Math.round((taskDone / taskTotal) * 100) : 100;

  const carbonSaved = carbonList.filter(h => h.active).reduce((sum, current) => sum + current.points, 0);

  const progressPoints = [
    { label: 'Mon', val: 30 },
    { label: 'Tue', val: 45 },
    { label: 'Wed', val: 40 },
    { label: 'Thu', val: 65 },
    { label: 'Fri', val: 78 },
    { label: 'Sat', val: 82 },
    { label: 'Sun', val: 95 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-6"
    >
      {/* Core Stats Bento Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4" id="diagnostics-stats-bento">
        {/* Card 1: Health Compliance */}
        <div className="bg-white border border-stone-200/60 p-5 rounded-2xl shadow-xs hover:border-rose-350 transition-all flex flex-col justify-between min-h-[120px]">
          <div>
            <span className="text-[9px] uppercase font-mono tracking-wider font-extrabold text-stone-400">MEDICATION COMPLIANCE</span>
            <p className="text-3xl font-black text-rose-600 mt-2">{medCompliancePercent}%</p>
          </div>
          <p className="text-[10px] text-stone-500 mt-2 leading-none">{medTaken} taken of {medTotal} total</p>
        </div>

        {/* Card 2: Learning Streak */}
        <div className="bg-white border border-stone-200/60 p-5 rounded-2xl shadow-xs hover:border-blue-350 transition-all flex flex-col justify-between min-h-[120px]">
          <div>
            <span className="text-[9px] uppercase font-mono tracking-wider font-extrabold text-stone-400">SOCRATIC STREAK</span>
            <p className="text-3xl font-black text-blue-600 mt-2 flex items-center gap-1">
              <Flame className="w-6 h-6 text-amber-500 animate-pulse fill-amber-500" /> {streakData.learningStreak} Days
            </p>
          </div>
          <p className="text-[10px] text-stone-500 mt-2 leading-none">Milestones logs verified</p>
        </div>

        {/* Card 3: Tasks completion */}
        <div className="bg-white border border-stone-200/60 p-5 rounded-2xl shadow-xs hover:border-purple-350 transition-all flex flex-col justify-between min-h-[120px]">
          <div>
            <span className="text-[9px] uppercase font-mono tracking-wider font-extrabold text-stone-400">PRODUCTIVITY RATIO</span>
            <p className="text-3xl font-black text-purple-600 mt-2">{taskPercent}%</p>
          </div>
          <p className="text-[10px] text-stone-500 mt-2 leading-none">{taskDone} accomplished of {taskTotal}</p>
        </div>

        {/* Card 4: Sustainability saved */}
        <div className="bg-white border border-stone-200/60 p-5 rounded-2xl shadow-xs hover:border-emerald-350 transition-all flex flex-col justify-between min-h-[120px]">
          <div>
            <span className="text-[9px] uppercase font-mono tracking-wider font-extrabold text-stone-400">CARBON OFFSET CO2</span>
            <p className="text-3xl font-black text-emerald-600 mt-2 font-bold">-{carbonSaved} KG</p>
          </div>
          <p className="text-[10px] text-stone-500 mt-2 leading-none">Sustainability logs sync active</p>
        </div>
      </div>

      {/* Main Grid: Graph + Biometrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Trend chart */}
        <div className="lg:col-span-8 bg-stone-900 border border-stone-850 p-6 rounded-3xl shadow-inner flex flex-col justify-between relative overflow-hidden min-h-[320px]">
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/20 to-transparent pointer-events-none" />
          
          <div className="flex justify-between items-center z-10 text-stone-200">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-stone-400 tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-rose-500 animate-pulse" /> Integrative Life Index
              </span>
              <h4 className="text-sm font-bold mt-1 text-stone-100">Empathetic Flourishing Progress Trend</h4>
            </div>
            <div className="flex gap-2 text-[10px] font-mono text-emerald-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Real-time analysis rating 98.4%
              </span>
            </div>
          </div>

          {/* Canvas SVG */}
          <div className="relative w-full h-[150px] mt-4 z-10">
            <svg viewBox="0 0 700 120" className="w-full h-full" preserveAspectRatio="none">
              {/* Grids */}
              <line x1="0" y1="20" x2="700" y2="20" stroke="#2a2a2a" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="60" x2="700" y2="60" stroke="#2a2a2a" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="100" x2="700" y2="100" stroke="#2a2a2a" strokeWidth="1" strokeDasharray="3 3" />

              {/* Shading area below path */}
              <path
                d="M 50,110 L 50,90 L 150,70 L 250,75 L 350,50 L 450,40 L 555,30 L 650,20 L 650,110 Z"
                fill="url(#grad2)"
                opacity="0.12"
              />

              {/* Glowing trend line */}
              <path
                d="M 50,90 L 150,70 L 250,75 L 350,50 L 450,40 L 555,30 L 650,20"
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Points indicators */}
              <circle cx="50" cy="90" r="5" fill="#f43f5e" className="animate-pulse" />
              <circle cx="150" cy="70" r="4" fill="#3b82f6" />
              <circle cx="250" cy="75" r="4" fill="#f59e0b" />
              <circle cx="350" cy="50" r="4" fill="#a855f7" />
              <circle cx="450" cy="40" r="4" fill="#10b981" />
              <circle cx="555" cy="30" r="5" fill="#e11d48" className="animate-pulse" />
              <circle cx="650" cy="20" r="6" fill="#10b981" className="animate-ping" style={{ animationDuration: '3s' }} />
              <circle cx="650" cy="20" r="6" fill="#10b981" />

              {/* Definitions */}
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="50%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
                <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="flex justify-between text-[9px] font-mono text-stone-400 mt-2 z-10 px-4">
            {progressPoints.map((p, idx) => (
              <span key={idx}>{p.label} (Index: {p.val}%)</span>
            ))}
          </div>
        </div>

        {/* Right Column: Real-time Biometric & Biofeedback Telemetry */}
        <div className="lg:col-span-4 bg-white border border-stone-200/80 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-rose-500" /> Biofeedback Diagnostics
            </span>
            <h4 className="font-bold text-stone-800 text-sm mt-1">Real-Time Somatic Indicators</h4>
            <p className="text-[11px] text-stone-400 leading-relaxed mt-1">
              Active physical telemetry signals received from your local smart health wrist node.
            </p>
          </div>

          <div className="space-y-3.5 my-4">
            {/* Heart Rate */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500 shrink-0 animate-pulse" />
                <span className="text-xs font-semibold text-stone-600">Heart Rate Variability</span>
              </div>
              <span className="font-mono text-xs font-black text-stone-800">72 ms</span>
            </div>

            {/* Skin Response */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-xs font-semibold text-stone-600">Electrodermal Activity</span>
              </div>
              <span className="font-mono text-xs font-black text-stone-800">4.2 µS (Stable)</span>
            </div>

            {/* Core Temp */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="text-xs font-semibold text-stone-600">Skin Temperature</span>
              </div>
              <span className="font-mono text-xs font-black text-stone-800">36.6 °C</span>
            </div>

            {/* Cognitive Stamina */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-500 shrink-0" />
                <span className="text-xs font-semibold text-stone-600">Cognitive Stamina</span>
              </div>
              <span className="font-mono text-xs font-black text-stone-850">94.2%</span>
            </div>
          </div>

          <div className="p-3 bg-emerald-55/60 border border-emerald-100 rounded-xl text-[10px] leading-relaxed text-emerald-800 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Telemetry signatures aligned. All somatic parameters safely in green ranges.</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
