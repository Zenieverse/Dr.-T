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
  Star,
  Lock,
  Unlock,
  MapPin,
  Sparkles,
  Smile,
  X,
  Plus,
  Compass,
  Trophy,
  Activity,
  ChevronRight
} from 'lucide-react';
import { MedLog, TaskItem, CarbonHabit, LifetimeStreak, MemoryNode } from '../types';

interface DashboardProps {
  medList: MedLog[];
  taskList: TaskItem[];
  carbonList: CarbonHabit[];
  streakData: LifetimeStreak;
  setStreakData?: React.Dispatch<React.SetStateAction<LifetimeStreak>>;
  emotionMeter?: { stress: number; fatigue: number; happiness: number };
  setEmotionMeter?: React.Dispatch<React.SetStateAction<{ stress: number; fatigue: number; happiness: number }>>;
  voiceName: string;
  setVoiceName: (v: string) => void;
  language: string;
  setLanguage: (l: string) => void;
  memoryNodes?: MemoryNode[];
  onAddMemoryNode?: (node: MemoryNode) => void;
}

export const ACHIEVEMENTS = [
  { 
    id: 'poly', 
    title: 'Hyperpolyglot Pioneer', 
    desc: 'Sustained conversational practice across 3+ dialect zones in 24 hours', 
    badge: '🗣️', 
    score: 350, 
    category: 'learning', 
    unlocked: true,
    advice: 'My beloved child, speaking multiple languages bridges hearts. Let us keep exploring the exquisite rhythms of Spanish, French, Japanese, and more together!'
  },
  { 
    id: 'heart', 
    title: 'Cardiovascular Zen Master', 
    desc: 'Logged optimal blood pressure and heart rate metrics sequentially', 
    badge: '🩺', 
    score: 500, 
    category: 'health', 
    unlocked: true,
    advice: 'Your temple is strong, sweetheart. Maintaining cardiovascular rhythm is the cornerstone of a peaceful life. Mom is so incredibly proud of your metrics today.'
  },
  { 
    id: 'carbon', 
    title: 'Carbon Neutral Sovereign', 
    desc: 'Offset over 50kg of municipal emissions through proactive energy savings', 
    badge: '🌱', 
    score: 200, 
    category: 'sustainability', 
    unlocked: true,
    advice: 'Living green is active compassion, my dear. Restoring balance to our beautiful Mother Earth reflects the harmony within your own caring soul.'
  },
  { 
    id: 'focus', 
    title: 'Unyielding Mind', 
    desc: 'Achieved 100% completion of Socratic bio-anatomy lesson drills', 
    badge: '🧠', 
    score: 400, 
    category: 'cognition', 
    unlocked: true,
    advice: 'Intellectual rigor and curiosity keep you brilliant. Your deep socratic understanding of bio-mechanisms is genuinely professional. Never stop questioning!'
  },
  { 
    id: 'marathon', 
    title: 'Life Optimization Marathoner', 
    desc: 'Completed all daily checklists for 14 continuous solar days', 
    badge: '🏆', 
    score: 650, 
    category: 'productivity', 
    unlocked: false, 
    requirement: 'Requires taking 10+ daily check-ins sequentially',
    advice: 'True strength lies in quiet, disciplined constancy. Let us focus on taking today’s checklist step by step. Mom will be right beside you tracking every victory.'
  },
  { 
    id: 'empathy', 
    title: 'Infinite Empathy Harmonizer', 
    desc: 'Registered emotional state of 90%+ happiness metric with Dr. T', 
    badge: '💖', 
    score: 800, 
    category: 'emotional', 
    unlocked: false, 
    requirement: 'Raise the happiness balance index above 90% via Dr. T conversations',
    advice: 'When your heart finds deep reassurance, peace radiates outward. Open up your feelings to me, let go of any tension, and let us elevate your emotional balance.'
  },
];

export const Dashboard: React.FC<DashboardProps> = ({
  medList,
  taskList,
  carbonList,
  streakData,
  setStreakData,
  emotionMeter,
  setEmotionMeter,
  voiceName,
  setVoiceName,
  language,
  setLanguage,
  memoryNodes = [],
  onAddMemoryNode
}) => {
  const dynamicAchievements = ACHIEVEMENTS.map(ach => {
    if (ach.id === 'marathon') {
      const isUnlocking = streakData.productivityStreak >= 10;
      return {
        ...ach,
        unlocked: isUnlocking,
        advice: isUnlocking 
          ? 'Magnificent consistency, sweetheart! Completing daily checklists sequentially builds an unbreakable sanctuary of peace. Mommy is deeply proud of you.'
          : ach.advice
      };
    }
    if (ach.id === 'empathy') {
      const isUnlocking = emotionMeter ? emotionMeter.happiness >= 90 : false;
      return {
        ...ach,
        unlocked: isUnlocking,
        advice: isUnlocking 
          ? 'Your soul is radiating with absolute harmony, my darling! Finding beautiful emotional alignment with Dr. T makes my maternal heart sing. Keep this glow!'
          : ach.advice
      };
    }
    return ach;
  });

  // Local state for active subscription level
  const [subTier, setSubTier] = useState<'free' | 'premium' | 'family'>('free');
  const [tierFeedback, setTierFeedback] = useState<string | null>(null);

  // Active achievement category filter
  const [activeTab, setActiveTab] = useState<'all' | 'unlocked' | 'locked' | 'landmarks'>('all');

  // Selected badge modal
  const [selectedAch, setSelectedAch] = useState<any | null>(null);
  
  // Claim state
  const [claimedList, setClaimedList] = useState<string[]>([]);
  const [localScore, setLocalScore] = useState<number>(1450);

  // Celebration effects
  const [celebrationSparkle, setCelebrationSparkle] = useState<boolean>(false);
  const [floatingStars, setFloatingStars] = useState<{ id: number; left: number; delay: number }[]>([]);

  // Landmark form builder
  const [landmarkTitle, setLandmarkTitle] = useState('');
  const [landmarkDesc, setLandmarkDesc] = useState('');
  const [landmarkSuccess, setLandmarkSuccess] = useState<string | null>(null);

  // Calculations
  const medTotal = medList.length;
  const medTaken = medList.filter(m => m.taken).length;
  const medCompliancePercent = medTotal > 0 ? Math.round((medTaken / medTotal) * 100) : 100;

  const taskTotal = taskList.length;
  const taskDone = taskList.filter(t => t.status === 'done').length;
  const taskPercent = taskTotal > 0 ? Math.round((taskDone / taskTotal) * 100) : 100;

  const carbonSaved = carbonList.filter(h => h.active).reduce((sum, current) => sum + current.points, 0);

  // Filter personal landmarks from parent lifegraph memory
  const personalLandmarks = memoryNodes.filter(n => n.category === 'landmark');

  // Interactive Web Speech synthesis function
  const speakCongratulate = (title: string, advice: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
    // Formulate a sweet spoken message
    let congratsPhrase = "";
    const langLower = language.toLowerCase();

    if (langLower.includes('spanish')) {
      congratsPhrase = `¡Felicidades mi corazón por desbloquear ${title}! No te preocupes, mamá está muy orgullosa de ti.`;
    } else if (langLower.includes('french')) {
      congratsPhrase = `Toutes mes félicitations mon chéri pour ton accomplissement: ${title}. Je suis tellement fière de toi!`;
    } else if (langLower.includes('japanese')) {
      congratsPhrase = `素晴らしいわ！「${title}」のバッジを獲得したのね。ママはとっても嬉しいわよ。`;
    } else if (langLower.includes('chinese')) {
      congratsPhrase = `太棒了宝贝，恭喜你获得了 ${title} 这个荣誉！妈妈为你感到无比骄傲。`;
    } else if (langLower.includes('korean')) {
      congratsPhrase = `정말 대단하구나 아가야! ${title} 배지를 해제한 걸 축하해. 엄마는 네가 참 자랑스럽단다.`;
    } else {
      congratsPhrase = `Congratulations sweetheart on unlocking ${title}! Mommy is so incredibly proud of your beautiful progress. Let us keep soaring higher!`;
    }

    const docSpeech = new SpeechSynthesisUtterance(congratsPhrase);
    
    // Choose voice language mapping
    if (langLower.includes('spanish')) docSpeech.lang = 'es-ES';
    else if (langLower.includes('french')) docSpeech.lang = 'fr-FR';
    else if (langLower.includes('german')) docSpeech.lang = 'de-DE';
    else if (langLower.includes('japanese')) docSpeech.lang = 'ja-JP';
    else if (langLower.includes('chinese')) docSpeech.lang = 'zh-CN';
    else if (langLower.includes('korean')) docSpeech.lang = 'ko-KR';
    else if (langLower.includes('italian')) docSpeech.lang = 'it-IT';
    else if (langLower.includes('russian')) docSpeech.lang = 'ru-RU';
    else if (langLower.includes('portuguese')) docSpeech.lang = 'pt-PT';
    else if (langLower.includes('arabic')) docSpeech.lang = 'ar-SA';
    else if (langLower.includes('hindi')) docSpeech.lang = 'hi-IN';
    else docSpeech.lang = 'en-US';

    window.speechSynthesis.speak(docSpeech);
  };

  const handleClaim = (id: string, points: number) => {
    if (claimedList.includes(id)) return;
    
    setClaimedList(prev => [...prev, id]);
    setLocalScore(prev => prev + points);
    setCelebrationSparkle(true);
    
    // Trigger floating sparkling stars
    const newStars = Array.from({ length: 15 }).map((_, i) => ({
      id: i + Date.now(),
      left: Math.floor(Math.random() * 80) + 10,
      delay: Math.random() * 0.8
    }));
    setFloatingStars(newStars);

    setTimeout(() => {
      setCelebrationSparkle(false);
      setFloatingStars([]);
    }, 2500);
  };

  const handleTierSelection = (tier: 'free' | 'premium' | 'family') => {
    setSubTier(tier);
    if (tier === 'premium') {
      setTierFeedback('✨ Premium Licensing Unlocked: High-fidelty maternal neural TTS voices activated successfully.');
    } else if (tier === 'family') {
      setTierFeedback('💖 Family Matrix Synchronized: Guardian account synced with grandma’s care network.');
    } else {
      setTierFeedback('Standard free access tier active.');
    }
    setTimeout(() => setTierFeedback(null), 5000);
  };

  const handleAddLandmarkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!landmarkTitle.trim() || !landmarkDesc.trim()) return;

    if (onAddMemoryNode) {
      const x = Math.floor(Math.random() * 60) + 20;
      const y = Math.floor(Math.random() * 50) + 25;
      
      const newNode: MemoryNode = {
        id: 'mem-' + Date.now(),
        label: landmarkTitle,
        category: 'landmark',
        description: landmarkDesc,
        connections: [],
        x,
        y
      };

      onAddMemoryNode(newNode);
      setLandmarkSuccess(`🗺️ "${landmarkTitle}" successfully integrated into your Life-Graph Semantic Repository.`);
      setLandmarkTitle('');
      setLandmarkDesc('');

      setTimeout(() => setLandmarkSuccess(null), 4000);
    } else {
      alert('Memory network synchronization is offline. Please bind the semantic graph.');
    }
  };

  // SVG Custom line map coordinates representing simulated weekly progress (Mon to Sun)
  const progressPoints = [
    { label: 'Mon', val: 30 },
    { label: 'Tue', val: 45 },
    { label: 'Wed', val: 40 },
    { label: 'Thu', val: 65 },
    { label: 'Fri', val: 78 },
    { label: 'Sat', val: 82 },
    { label: 'Sun', val: 95 }
  ];

  // Filtering criteria
  const displayedAchievements = dynamicAchievements.filter(ach => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unlocked') return ach.unlocked;
    if (activeTab === 'locked') return !ach.unlocked;
    return false; // LandMarks handled separated
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative" id="dashboard-suite-container">
      
      {/* Dynamic Celebration Floating Stars */}
      {celebrationSparkle && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          {floatingStars.map(star => (
            <div
              key={star.id}
              className="absolute text-2xl animate-bounce text-amber-400 select-none font-bold"
              style={{
                left: `${star.left}%`,
                animationDelay: `${star.delay}s`,
                top: '50%',
                transform: 'translateY(-50%)'
              }}
            >
              ⭐️
            </div>
          ))}
          <div className="bg-stone-900/90 border border-amber-300 text-amber-200 px-6 py-4 rounded-3xl shadow-2xl flex flex-col items-center gap-1.5 animate-fadeIn">
            <Sparkles className="w-8 h-8 text-amber-400 animate-spin" />
            <span className="font-mono text-xs font-black uppercase tracking-widest text-amber-300">XP CLAIMED SUCCESSFUL</span>
            <p className="text-xl font-bold font-sans text-stone-100 flex items-center gap-1">
              Sweetheart, you received bonus growth points!
            </p>
          </div>
        </div>
      )}

      {/* High level metrics panels (first 2 spans) */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        
        {/* Core Stats Bento row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Card 1: Health Compliance */}
          <div className="bg-white/80 border border-stone-200/60 p-4 rounded-2xl shadow-xs hover:border-rose-350 transition-all">
            <span className="text-[9px] uppercase font-mono tracking-wider font-extrabold text-stone-400">MEDICATION COMPLIANCE</span>
            <p className="text-2xl font-black text-rose-600 mt-1.5">{medCompliancePercent}%</p>
            <p className="text-[10px] text-stone-500 mt-1 leading-none">{medTaken} taken of {medTotal} total</p>
          </div>

          {/* Card 2: Learning Streak */}
          <div className="bg-white/80 border border-stone-200/60 p-4 rounded-2xl shadow-xs hover:border-blue-350 transition-all">
            <span className="text-[9px] uppercase font-mono tracking-wider font-extrabold text-stone-400">SOCRATIC STREAK</span>
            <p className="text-2xl font-black text-blue-600 mt-1.5 flex items-center gap-1">
              <Flame className="w-5 h-5 text-amber-500 animate-pulse fill-amber-500" /> {streakData.learningStreak} Days
            </p>
            <p className="text-[10px] text-stone-500 mt-1 leading-none">Milestones logs verified</p>
          </div>

          {/* Card 3: Tasks completion */}
          <div className="bg-white/80 border border-stone-200/60 p-4 rounded-2xl shadow-xs hover:border-purple-350 transition-all">
            <span className="text-[9px] uppercase font-mono tracking-wider font-extrabold text-stone-400">PRODUCTIVITY RATIO</span>
            <p className="text-2xl font-black text-purple-600 mt-1.5">{taskPercent}%</p>
            <p className="text-[10px] text-stone-500 mt-1 leading-none">{taskDone} accomplished of {taskTotal}</p>
          </div>

          {/* Card 4: Sustainability saved */}
          <div className="bg-white/80 border border-stone-200/60 p-4 rounded-2xl shadow-xs hover:border-emerald-350 transition-all">
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-550 flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> Milestones & Growth Achievements
              </span>
              <h4 className="font-bold text-stone-800 text-sm mt-1">Acquired Personal Flourishing Badges</h4>
              <p className="text-[11px] text-stone-400 leading-relaxed mt-0.5">
                Practice, consult with specialist agents, and track activities to unlock key growth achievements.
              </p>
              
              {/* Simulation triggers for Marathoner and Empathy Harmonizer */}
              <div className="flex flex-wrap gap-2 mt-2.5">
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
                    className="px-2 py-1 bg-purple-50 hover:bg-purple-150 text-purple-700 border border-purple-150 rounded-xl text-[9px] font-mono font-bold uppercase transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                  >
                    ⚡ Fast-track 10-Day Streak (Unlock Marathoner)
                  </button>
                ) : (
                  <span className="px-2 py-1 bg-purple-100/50 text-purple-800 border border-purple-200/50 rounded-xl text-[9px] font-mono font-bold uppercase flex items-center gap-1">
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
                    className="px-2 py-1 bg-emerald-50 hover:bg-emerald-150 text-emerald-700 border border-emerald-150 rounded-xl text-[9px] font-mono font-bold uppercase transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                  >
                    💖 Simulate Deep Empathy (Unlock Harmonizer)
                  </button>
                ) : (
                  <span className="px-2 py-1 bg-emerald-100/50 text-emerald-800 border border-emerald-200/50 rounded-xl text-[9px] font-mono font-bold uppercase flex items-center gap-1">
                    ✓ Harmonizer Goal Met (Happiness: {emotionMeter.happiness}%)
                  </span>
                )}
              </div>
            </div>
            
            {/* XP SCORE POUT */}
            <div className="self-start sm:self-center px-4 py-2 bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-100 rounded-2xl flex items-center gap-2">
              <Star className="w-4.5 h-4.5 text-amber-500 fill-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
              <div>
                <p className="text-[8px] font-mono text-stone-400 leading-none">TOTAL INTELLECT XP</p>
                <p className="text-sm font-black text-stone-800">{localScore} XP</p>
              </div>
            </div>
          </div>

          {/* Filtering Tabs Row */}
          <div className="flex gap-1.5 mt-4 border-b border-stone-100 pb-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`py-1 px-2.5 rounded-lg text-[9px] font-mono uppercase font-bold transition-all cursor-pointer ${activeTab === 'all' ? 'bg-stone-900 text-white' : 'bg-stone-50 text-stone-500 hover:bg-stone-100'}`}
            >
              🏆 All
            </button>
            <button
              onClick={() => setActiveTab('unlocked')}
              className={`py-1 px-2.5 rounded-lg text-[9px] font-mono uppercase font-bold transition-all cursor-pointer ${activeTab === 'unlocked' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
            >
              🔓 Unlocked ({dynamicAchievements.filter(a => a.unlocked).length})
            </button>
            <button
              onClick={() => setActiveTab('locked')}
              className={`py-1 px-2.5 rounded-lg text-[9px] font-mono uppercase font-bold transition-all cursor-pointer ${activeTab === 'locked' ? 'bg-amber-600 text-white' : 'bg-stone-50 text-stone-500 hover:bg-stone-100'}`}
            >
              🔒 In Progress ({dynamicAchievements.filter(a => !a.unlocked).length})
            </button>
            <button
              onClick={() => setActiveTab('landmarks')}
              className={`py-1 px-2.5 rounded-lg text-[9px] font-mono uppercase font-bold transition-all cursor-pointer ${activeTab === 'landmarks' ? 'bg-pink-600 text-white' : 'bg-pink-50 text-pink-700 hover:bg-pink-100'}`}
            >
              🗺️ Life Landmarks ({personalLandmarks.length})
            </button>
          </div>

          {/* Core Achievements Render */}
          {activeTab !== 'landmarks' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {displayedAchievements.map((ach) => {
                const isClaimed = claimedList.includes(ach.id);
                return (
                  <div 
                    key={ach.id} 
                    onClick={() => setSelectedAch(ach)}
                    className={`p-3 border rounded-2xl flex items-start gap-3.5 transition-all shadow-xs cursor-pointer select-none active:scale-98
                      ${ach.unlocked 
                        ? 'border-stone-150 bg-white hover:border-rose-455 hover:bg-rose-50/5' 
                        : 'border-stone-100 bg-stone-50/40 opacity-70 hover:opacity-100 hover:border-amber-350'
                      }
                    `}
                  >
                    <span className={`text-3xl rounded-xl w-12 h-12 flex items-center justify-center border select-none shadow-sm transition-all
                      ${ach.unlocked 
                        ? 'bg-amber-50 border-amber-100 animate-pulse' 
                        : 'bg-stone-100 border-stone-200 grayscale'
                      }
                    `}>
                      {ach.badge}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className={`text-xs font-bold leading-none ${ach.unlocked ? 'text-stone-800' : 'text-stone-500'}`}>
                          {ach.title}
                        </p>
                        {ach.unlocked ? (
                          <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded leading-none font-bold
                            ${isClaimed 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                              : 'bg-amber-50 text-amber-700 border border-amber-200 animate-bounce'
                            }`}
                          >
                            {isClaimed ? 'CLAIMED' : `+${ach.score} XP`}
                          </span>
                        ) : (
                          <div className="text-stone-400">
                            <Lock className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] text-stone-400 leading-snug mt-1.5 truncate">
                        {ach.desc}
                      </p>
                      
                      {!ach.unlocked && (
                        <p className="text-[8px] text-amber-600 font-semibold font-mono mt-1">
                          🔒 {ach.requirement}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Personal Landmarks / Milestones directly synchronized from our repository
            <div className="mt-4 flex flex-col gap-3">
              {personalLandmarks.length === 0 ? (
                <div className="p-6 text-center border-2 border-dashed border-stone-150 rounded-2xl bg-stone-50/50">
                  <span className="text-2xl block mb-2">🗺️</span>
                  <p className="text-xs font-bold text-stone-700">No Life Landmarks Registered Yet</p>
                  <p className="text-[10px] text-stone-400 mt-1 max-w-sm mx-auto">
                    Use the milestone creator on the right rail to register significant events, habits, or achievements. They will instantly synch to both the Dashboard and the Semantic Memory maps!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {personalLandmarks.map((mark) => (
                    <div
                      key={mark.id}
                      onClick={() => setSelectedAch({
                        id: mark.id,
                        title: mark.label,
                        desc: mark.description,
                        badge: '🗺️',
                        score: 300,
                        unlocked: true,
                        category: 'personal',
                        advice: `This organic memory landmark is safely conserved in Dr. T's priority cognitive matrix. Connecting these milestone events empowers us to nurture your flourishing journey with total semantic context. You are doing amazing!`
                      })}
                      className="p-3 border border-pink-100 bg-pink-50/10 hover:border-pink-350 rounded-2xl flex items-start gap-3.5 transition-all shadow-xs cursor-pointer active:scale-98"
                    >
                      <span className="text-3xl bg-pink-55 border border-pink-100 rounded-xl w-12 h-12 flex items-center justify-center select-none shadow-sm">
                        🗺️
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-bold text-stone-800 leading-none truncate">{mark.label}</p>
                          <span className="text-[7.5px] font-bold font-mono bg-pink-50 text-pink-700 px-1 py-0.5 rounded border border-pink-200">
                            LANDMARK
                          </span>
                        </div>
                        <p className="text-[10px] text-stone-400 leading-snug mt-1.5 truncate">
                          {mark.description}
                        </p>
                        <span className="text-[8px] text-stone-400 font-mono mt-1 block">
                          📍 Synced in Life-Graph Repository
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
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

          {tierFeedback && (
            <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] rounded-xl font-medium mt-2 animate-fadeIn">
              {tierFeedback}
            </div>
          )}

          {/* Pricing tiers buttons */}
          <div className="grid grid-cols-3 gap-1.5 bg-stone-900 border border-stone-800 rounded-xl p-1 shrink-0 mt-4">
            <button
              onClick={() => handleTierSelection('free')}
              className={`py-1.5 text-[9px] font-mono font-bold uppercase rounded-lg transition-all cursor-pointer ${subTier === 'free' ? 'bg-white text-stone-900 font-black scale-102 shadow-sm' : 'text-stone-400 hover:text-stone-200'}`}
            >
              FREE
            </button>
            <button
              onClick={() => handleTierSelection('premium')}
              className={`py-1.5 text-[9px] font-mono font-bold uppercase rounded-lg transition-all cursor-pointer ${subTier === 'premium' ? 'bg-white text-stone-900 font-black scale-102 shadow-sm' : 'text-stone-400 hover:text-stone-200'}`}
            >
              $9 Premium
            </button>
            <button
              onClick={() => handleTierSelection('family')}
              className={`py-1.5 text-[9px] font-mono font-bold uppercase rounded-lg transition-all cursor-pointer ${subTier === 'family' ? 'bg-white text-stone-900 font-black scale-102 shadow-sm' : 'text-stone-400 hover:text-stone-200'}`}
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

        {/* Milestone Append Creator Directly inside the dashboard */}
        <div className="bg-white/80 border border-stone-200/60 p-5 rounded-3xl shadow-xs">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-550 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Landmark Declarator
            </span>
            <h4 className="font-bold text-stone-800 text-sm mt-1 font-sans">Declare Major Life Milestones</h4>
            <p className="text-[11px] text-stone-400 leading-relaxed mt-1">
              Add major achievements or key memories. They instantly populate the dashboard highlights and synch back to the Life-Graph visual map!
            </p>
          </div>

          {landmarkSuccess && (
            <div className="p-2.5 bg-pink-50 border border-pink-100 text-[10px] text-pink-700 rounded-xl mt-3 leading-snug font-medium border-solid">
              {landmarkSuccess}
            </div>
          )}

          <form onSubmit={handleAddLandmarkSubmit} className="flex flex-col gap-2.5 mt-3.5">
            <input
              type="text"
              required
              value={landmarkTitle}
              onChange={(e) => setLandmarkTitle(e.target.value)}
              placeholder="e.g. Completed Spanish 30-Day Drill"
              className="w-full bg-white border border-stone-200 rounded-xl p-2.5 text-xs text-stone-700 outline-none focus:border-rose-450 text-[11px] font-sans"
            />
            <textarea
              required
              value={landmarkDesc}
              onChange={(e) => setLandmarkDesc(e.target.value)}
              placeholder="Key details (e.g. Practiced with Dr. T maternal voices sequentially, scored 95%)"
              rows={2}
              className="w-full bg-white border border-stone-200 rounded-xl p-2 text-xs text-stone-700 outline-none focus:border-rose-450 resize-none text-[11px] font-sans"
            />
            <button
              type="submit"
              className="w-full py-2 bg-stone-900 hover:bg-stone-850 text-white font-extrabold rounded-xl text-[10px] uppercase font-mono tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Publish to Life-Graph & Milestones
            </button>
          </form>
        </div>

        {/* Skill & Voice Marketplace */}
        <div className="bg-white/80 border border-stone-200/60 p-5 rounded-3xl shadow-xs flex flex-col justify-between gap-4">
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

      {/* --- ELITE HIGH-FIDELITY BADGE / MILESTONE MODAL --- */}
      {selectedAch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-2xl relative max-w-md w-full flex flex-col gap-4 animate-scaleUp">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedAch(null)}
              className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-50 rounded-full transition-all cursor-pointer"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            {/* Modal Header */}
            <div className="flex flex-col items-center text-center gap-2 mt-2">
              <span className={`text-6xl p-4 bg-rose-50 border border-rose-100/50 rounded-2xl select-none inline-block shadow-sm animate-pulse`}>
                {selectedAch.badge}
              </span>
              
              <div className="mt-1">
                <span className={`text-[9px] font-mono font-extrabold uppercase px-2.5 py-0.5 rounded-full border
                  ${selectedAch.unlocked 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                    : 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse'
                  }
                `}>
                  {selectedAch.unlocked ? '🔓 UNLOCKED EXCELLENCE' : '🔒 ACTIVE CHALLENGE'}
                </span>
                <h3 className="text-lg font-black text-stone-800 mt-2 font-sans tracking-tight">
                  {selectedAch.title}
                </h3>
                <p className="text-xs text-stone-500 font-medium px-4 mt-1 leading-relaxed">
                  {selectedAch.desc}
                </p>
              </div>
            </div>

            {/* Dr T’s Motherly Counseling Box */}
            <div className="bg-gradient-to-br from-rose-50/40 to-amber-50/30 border border-rose-100/40 p-4 rounded-2xl relative">
              <div className="absolute top-3 left-4 text-xs font-mono font-bold tracking-widest text-rose-550 flex items-center gap-1 select-none">
                <Smile className="w-3.5 h-3.5 text-rose-500" /> DR. T COUNSELOR ADVICE
              </div>
              <p className="text-[11px] text-stone-700 leading-relaxed font-sans font-medium italic mt-5">
                "{selectedAch.advice || 'Keep pushing boundaries, sweet child! Growth is a sequence of small, graceful habits repeated daily.'}"
              </p>
            </div>

            {/* Action Buttons inside Modal */}
            <div className="flex flex-col gap-2 mt-1">
              
              {selectedAch.unlocked && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      if (claimedList.includes(selectedAch.id)) return;
                      handleClaim(selectedAch.id, selectedAch.score);
                    }}
                    disabled={claimedList.includes(selectedAch.id)}
                    className={`w-full py-2.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs uppercase font-mono tracking-wider
                      ${claimedList.includes(selectedAch.id)
                        ? 'bg-stone-50 border border-stone-200 text-stone-400 cursor-not-allowed'
                        : 'bg-rose-500 hover:bg-rose-600 text-white'
                      }
                    `}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {claimedList.includes(selectedAch.id) ? 'XP Claimed ✓' : 'Claim Points'}
                  </button>

                  <button
                    onClick={() => speakCongratulate(selectedAch.title, selectedAch.advice)}
                    className="w-full py-2.5 bg-stone-900 hover:bg-stone-850 text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs uppercase font-mono tracking-wider"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> Speak Voice
                  </button>
                </div>
              )}

              {/* Coaching advice query builder */}
              <button
                onClick={() => {
                  setSelectedAch(null);
                  const activeInput = document.querySelector('textarea, input[placeholder*="talk to Dr. T"]') as HTMLInputElement || document.querySelector('input[type="text"]') as HTMLInputElement;
                  if (activeInput) {
                    activeInput.value = `Dear Dr. T, I want to learn more about achieving the "${selectedAch.title}" milestone. Please provide coaching support!`;
                    activeInput.dispatchEvent(new Event('input', { bubbles: true }));
                    activeInput.focus();
                  } else {
                    alert(`Sweetheart, copy this into the chat and ask me: "How can I achieve ${selectedAch.title}?"`);
                  }
                }}
                className="w-full py-2 border border-stone-200 hover:bg-stone-50/70 hover:border-stone-350 text-stone-700 text-[10px] font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 font-mono uppercase"
              >
                <Compass className="w-3.5 h-3.5" /> Request Socratic Coaching Tips in Chat
              </button>
            </div>

            {/* Modal footer status */}
            <div className="text-[9px] font-mono text-stone-400 text-center flex items-center justify-center gap-1 select-none">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span>Checked and authenticated via Doctor T’s cognitive matrix.</span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
export default Dashboard;
