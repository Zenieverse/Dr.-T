import React, { useState } from 'react';
import { 
  Award, 
  Flame, 
  TrendingUp, 
  Volume2, 
  Globe, 
  ShoppingBag, 
  CreditCard, 
  ShieldCheck, 
  Check, 
  Star 
} from 'lucide-react';
import { MedLog, TaskItem, CarbonHabit, LifetimeStreak } from '../types';

interface DashboardProps {
  medList: MedLog[];
  taskList: TaskItem[];
  carbonList: CarbonHabit[];
  streakData: LifetimeStreak;
  voiceName: string;
  setVoiceName: (v: string) => void;
  language: string;
  setLanguage: (l: string) => void;
}

export const ACHIEVEMENTS = [
  { id: 'poly', title: 'Hyperpolyglot Pioneer', desc: 'Sustained conversational practice across 3+ dialect zones in 24 hours', badge: '🗣️', score: 350 },
  { id: 'heart', title: 'Cardiovascular Zen Master', desc: 'Logged optimal blood pressure and heart rate metrics 7 days sequentially', badge: '🩺', score: 500 },
  { id: 'carbon', title: 'Carbon Neutral Sovereign', desc: 'Offset over 50kg of municipal emissions through proactive energy savings', badge: '🌱', score: 200 },
  { id: 'focus', title: 'Unyielding Mind', desc: 'Achieved 100% completion of Socratic bio-anatomy lesson drills', badge: '🧠', score: 400 },
];

export const Dashboard: React.FC<DashboardProps> = ({
  medList,
  taskList,
  carbonList,
  streakData,
  voiceName,
  setVoiceName,
  language,
  setLanguage
}) => {
  // Local state for active subscription level
  const [subTier, setSubTier] = useState<'free' | 'premium' | 'family'>('free');
  
  // Calculations
  const medTotal = medList.length;
  const medTaken = medList.filter(m => m.taken).length;
  const medCompliancePercent = medTotal > 0 ? Math.round((medTaken / medTotal) * 100) : 100;

  const taskTotal = taskList.length;
  const taskDone = taskList.filter(t => t.status === 'done').length;
  const taskPercent = taskTotal > 0 ? Math.round((taskDone / taskTotal) * 100) : 100;

  const carbonSaved = carbonList.filter(h => h.active).reduce((sum, current) => sum + current.points, 0);

  // SVG Custom line map coordinates representing simulated weekly progress (Mon to Sun)
  // 6 coordinates: (x, y) coordinates where coordinates match day growth trends
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="dashboard-suite-container">
      
      {/* High level metrics panels (first 2 spans) */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        
        {/* Core Stats Bento row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Card 1: Health Compliance */}
          <div className="bg-white/80 border border-stone-200/60 p-4 rounded-2xl shadow-xs">
            <span className="text-[9px] uppercase font-mono tracking-wider font-extrabold text-stone-400">MEDICATION COMPLIANCE</span>
            <p className="text-2xl font-black text-rose-600 mt-1.5">{medCompliancePercent}%</p>
            <p className="text-[10px] text-stone-500 mt-1 leading-none">{medTaken} taken of {medTotal} total</p>
          </div>

          {/* Card 2: Learning Streak */}
          <div className="bg-white/80 border border-stone-200/60 p-4 rounded-2xl shadow-xs">
            <span className="text-[9px] uppercase font-mono tracking-wider font-extrabold text-stone-400">SOCRATIC STREAK</span>
            <p className="text-2xl font-black text-blue-600 mt-1.5 flex items-center gap-1">
              <Flame className="w-5 h-5 text-amber-500 animate-pulse fill-amber-500" /> {streakData.learningStreak} Days
            </p>
            <p className="text-[10px] text-stone-500 mt-1 leading-none">Milestones logs verified</p>
          </div>

          {/* Card 3: Tasks completion */}
          <div className="bg-white/80 border border-stone-200/60 p-4 rounded-2xl shadow-xs">
            <span className="text-[9px] uppercase font-mono tracking-wider font-extrabold text-stone-400">PRODUCTIVITY RATIO</span>
            <p className="text-2xl font-black text-purple-600 mt-1.5">{taskPercent}%</p>
            <p className="text-[10px] text-stone-500 mt-1 leading-none">{taskDone} accomplished of {taskTotal}</p>
          </div>

          {/* Card 4: Sustainability saved */}
          <div className="bg-white/80 border border-stone-200/60 p-4 rounded-2xl shadow-xs">
            <span className="text-[9px] uppercase font-mono tracking-wider font-extrabold text-stone-400">CARBON OFFSET CO2</span>
            <p className="text-2xl font-black text-emerald-600 mt-1.5 font-bold">-{carbonSaved} KG</p>
            <p className="text-[10px] text-stone-500 mt-1 leading-none">Sustainability logs sync active</p>
          </div>
        </div>

        {/* Custom SVG Trend Map (Progress Trend line chart) */}
        <div className="bg-stone-900 border border-stone-850 p-5 rounded-3xl shadow-inner flex flex-col justify-between relative overflow-hidden min-h-[280px]">
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/20 to-transparent pointer-events-none"></div>
          
          <div className="flex justify-between items-center z-10 text-stone-200">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-stone-400 tracking-wider flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-rose-500" /> Integrative Life Index
              </span>
              <h4 className="text-sm font-bold mt-1 text-stone-200">Empathetic Flourishing Progress Trend</h4>
            </div>
            <div className="flex gap-2 text-[10px] font-mono text-emerald-400">
              <span className="flex items-center gap-1">● Real-time analysis rating 98.4%</span>
            </div>
          </div>

          {/* Canvas SVG */}
          <div className="relative w-full h-[140px] mt-4 z-10">
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
                  <stop offset="0%" stopColor="#ef4444" />
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

        {/* Milestone Trophy Log */}
        <div className="bg-white/80 border border-stone-200/60 p-5 rounded-3xl shadow-xs">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-550 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> Milestones & Growth Achievements
            </span>
            <h4 className="font-bold text-stone-800 text-sm mt-1">Acquired Personal Flourishing Badges</h4>
            <p className="text-[11px] text-stone-400 leading-relaxed mt-0.5">
              These badges unlock dynamically based on your persistent health parameters and language coaching with Dr. T.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {ACHIEVEMENTS.map((ach) => (
              <div 
                key={ach.id} 
                className="p-3 border border-stone-150 bg-white hover:border-rose-455 rounded-2xl flex items-start gap-3.5 transition-all shadow-xs"
              >
                <span className="text-3xl bg-amber-50 rounded-xl w-12 h-12 flex items-center justify-center border border-amber-100 select-none shadow-sm">
                  {ach.badge}
                </span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-stone-800 leading-none">{ach.title}</p>
                    <span className="text-[8px] font-bold font-mono bg-amber-50 text-amber-700 px-1 py-0.5 rounded leading-none">
                      +{ach.score} XP
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-400 leading-snug mt-1.5">{ach.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subscription tier & Skill voice marketplace (last span) */}
      <div className="flex flex-col gap-6">
        
        {/* Upgrade Pricing Box */}
        <div className="bg-gradient-to-b from-stone-900 to-stone-950 border border-stone-850 p-5 rounded-3xl shadow-md text-white relative overflow-hidden flex flex-col justify-between min-h-[220px]">
          {/* Subtle neon glowing gradient circle */}
          <div className="absolute -left-20 -bottom-20 w-36 h-36 rounded-full bg-rose-500/10 blur-[90px] pointer-events-none"></div>

          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono tracking-widest text-amber-450 font-bold flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5" /> Platform Licensing
              </span>
              <span className="text-[8px] font-mono bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                {subTier === 'free' ? 'FREEMIUM ACTIVE' : subTier === 'premium' ? 'PREMIUM AGENT' : 'FAMILY MODE ACTIVE'}
              </span>
            </div>
            <h4 className="text-sm font-bold mt-1 text-stone-200">Infinity License Plan Options</h4>
            <p className="text-[10px] text-stone-400 leading-relaxed mt-1">
              Select a tier plan below. Upgrading unlocks premium neural TTS synthesizers, deep Socratic tracking, and unlimited multi-agent consultations.
            </p>
          </div>

          {/* Pricing tiers buttons */}
          <div className="grid grid-cols-3 gap-1.5 bg-stone-900 border border-stone-800 rounded-xl p-1 shrink-0 mt-4">
            <button
              onClick={() => setSubTier('free')}
              className={`py-1.5 text-[9px] font-mono font-bold uppercase rounded-lg transition-all cursor-pointer ${subTier === 'free' ? 'bg-white text-stone-900 font-black' : 'text-stone-400 hover:text-stone-200'}`}
            >
              FREE
            </button>
            <button
              onClick={() => setSubTier('premium')}
              className={`py-1.5 text-[9px] font-mono font-bold uppercase rounded-lg transition-all cursor-pointer ${subTier === 'premium' ? 'bg-white text-stone-900 font-black' : 'text-stone-400 hover:text-stone-200'}`}
            >
              $9 Premium
            </button>
            <button
              onClick={() => setSubTier('family')}
              className={`py-1.5 text-[9px] font-mono font-bold uppercase rounded-lg transition-all cursor-pointer ${subTier === 'family' ? 'bg-white text-stone-900 font-black' : 'text-stone-400 hover:text-stone-200'}`}
            >
              $19 Family
            </button>
          </div>

          <div className="text-[10px] leading-snug mt-3 text-stone-400 flex items-center gap-2 border-t border-stone-850 pt-3">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              {subTier === 'free' 
                ? 'Standard TTS speeds with local falls. Upgrading bypasses quotas.' 
                : subTier === 'premium' 
                  ? 'Premium hyper-realistic avatars, 100% server TTS speed unlocked.' 
                  : 'Family dashboard unlocked. Complete smart tracking for 5 profiles.'}
            </span>
          </div>
        </div>

        {/* Skill & Voice Marketplace */}
        <div className="bg-white/80 border border-stone-200/60 p-5 rounded-3xl shadow-xs flex flex-col justify-between flex-1 gap-4">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-550 flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5" /> Skill & Voice Store
            </span>
            <h4 className="font-bold text-stone-800 text-sm mt-1">Orchestration Marketplaces</h4>
            <p className="text-[11px] text-stone-400 leading-relaxed mt-1">
              Download premium sub-intelligence modules and professional custom voice templates made by top psychologists and linguists.
            </p>
          </div>

          {/* Voices list */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[9px] font-mono tracking-widest text-stone-400 font-bold uppercase">Trending integrations</span>
            <div className="flex flex-col gap-2">
              <div 
                onClick={() => setVoiceName('Puck')}
                className="p-2.5 bg-white border border-stone-150 hover:border-rose-455 rounded-xl flex items-center justify-between cursor-pointer transition-all shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <Volume2 className="text-stone-400 w-4 h-4 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-stone-800">French Lyricism (Dr. Puck)</p>
                    <p className="text-[9px] text-stone-400 font-mono">1.2m downloads • Poetry specialist</p>
                  </div>
                </div>
                {voiceName === 'Puck' ? (
                  <Check className="w-4 h-4 text-rose-600 shrink-0" />
                ) : (
                  <span className="text-[8px] font-bold bg-stone-100 p-1 rounded font-mono text-stone-500 uppercase">APPLY</span>
                )}
              </div>

              <div 
                onClick={() => setVoiceName('Charon')}
                className="p-2.5 bg-white border border-stone-150 hover:border-indigo-400 rounded-xl flex items-center justify-between cursor-pointer transition-all shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <Volume2 className="text-stone-400 w-4 h-4 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-stone-800">Deep Bass Socratic (Dr. Charon)</p>
                    <p className="text-[9px] text-stone-400 font-mono">750k downloads • Deep baritone comfort</p>
                  </div>
                </div>
                {voiceName === 'Charon' ? (
                  <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                ) : (
                  <span className="text-[8px] font-bold bg-stone-100 p-1 rounded font-mono text-stone-500 uppercase">APPLY</span>
                )}
              </div>

              <div 
                onClick={() => {
                  setLanguage('Spanish');
                  setVoiceName('Fenrir');
                }}
                className="p-2.5 bg-white border border-stone-150 hover:border-amber-400 rounded-xl flex items-center justify-between cursor-pointer transition-all shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <Globe className="text-stone-400 w-4 h-4 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-stone-800">Castilian Español Mode</p>
                    <p className="text-[9px] text-stone-400 font-mono">3.4m downloads • Spanish language drill</p>
                  </div>
                </div>
                {language === 'Spanish' ? (
                  <Check className="w-4 h-4 text-amber-500 shrink-0" />
                ) : (
                  <span className="text-[8px] font-bold bg-stone-100 p-1 rounded font-mono text-stone-500 uppercase">LOAD</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
