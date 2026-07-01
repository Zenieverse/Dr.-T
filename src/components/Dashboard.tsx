import React, { useState } from 'react';
import { BirthdayCelebrator } from './BirthdayCelebrator';
import { 
  Award, 
  Flame, 
  Volume2, 
  Globe, 
  ShoppingBag, 
  CreditCard, 
  ShieldCheck, 
  Star,
  MapPin,
  Sparkles,
  Smile,
  X,
  Compass,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MedLog, TaskItem, CarbonHabit, LifetimeStreak, MemoryNode } from '../types';

import { DiagnosticsAnalytics } from './DiagnosticsAnalytics';
import { DiagnosticsMilestones } from './DiagnosticsMilestones';
import { DiagnosticsDeclarator } from './DiagnosticsDeclarator';
import { DiagnosticsLicensing } from './DiagnosticsLicensing';

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
  setActiveTab?: (tab: 'hub' | 'graph' | 'swarm' | 'trackers' | 'dashboard' | 'avatar' | 'suite' | 'showcase' | 'uipath' | 'stellar-zk' | 'decision') => void;
  setInputVal?: (val: string) => void;
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
  onAddMemoryNode,
  setActiveTab: setParentActiveTab,
  setInputVal
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

  // Diagnostics view tab state
  const [diagnosticsTab, setDiagnosticsTab] = useState<'analytics' | 'milestones' | 'declarator' | 'licensing'>('analytics');

  // Local state for licensing & badges
  const [subTier, setSubTier] = useState<'free' | 'premium' | 'family'>('free');
  const [tierFeedback, setTierFeedback] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'unlocked' | 'locked' | 'landmarks'>('all');
  const [selectedAch, setSelectedAch] = useState<any | null>(null);
  const [claimedList, setClaimedList] = useState<string[]>([]);
  const [localScore, setLocalScore] = useState<number>(1450);

  // Celebration effects
  const [celebrationSparkle, setCelebrationSparkle] = useState<boolean>(false);
  const [floatingStars, setFloatingStars] = useState<{ id: number; left: number; delay: number }[]>([]);

  // Filter personal landmarks from parent lifegraph memory
  const personalLandmarks = memoryNodes.filter(n => n.category === 'landmark');

  // Web Speech synthesis
  const speakCongratulate = (title: string, advice: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
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

  return (
    <div className="flex flex-col gap-6 relative w-full" id="dashboard-suite-container">
      
      {/* Educational Disclaimer Banner */}
      <div className="bg-rose-55/60 border border-rose-100/80 rounded-2xl p-4 text-xs text-rose-950 flex flex-col gap-2 shadow-xs animate-fadeIn select-none">
        <div className="flex items-center gap-2.5">
          <span className="text-base leading-none">⚠️</span>
          <p className="font-semibold leading-relaxed">
            <strong>Important Notice:</strong> Dr. T is an educational and decision-support platform and not a substitute for professional medical advice.
          </p>
        </div>
        <div className="border-t border-rose-100/50 pt-2 flex justify-center">
          <BirthdayCelebrator textSize="text-[10px]" />
        </div>
      </div>

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

      {/* Diagnostics Sub-Tab Navigation System */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-stone-50 border border-stone-200/60 rounded-2xl p-2 gap-2" id="diagnostics-tab-navigation">
        <div className="flex flex-wrap gap-1.5 w-full">
          <button
            onClick={() => setDiagnosticsTab('analytics')}
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
              diagnosticsTab === 'analytics'
                ? 'bg-rose-600 text-white shadow-sm font-black'
                : 'text-stone-500 hover:text-stone-850 bg-transparent'
            }`}
          >
            <Activity className="w-4 h-4" />
            Biofeedback &amp; Analytics
          </button>
          <button
            onClick={() => setDiagnosticsTab('milestones')}
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
              diagnosticsTab === 'milestones'
                ? 'bg-rose-600 text-white shadow-sm font-black'
                : 'text-stone-500 hover:text-stone-850 bg-transparent'
            }`}
          >
            <Award className="w-4 h-4" />
            Growth Milestones
          </button>
          <button
            onClick={() => setDiagnosticsTab('declarator')}
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
              diagnosticsTab === 'declarator'
                ? 'bg-rose-600 text-white shadow-sm font-black'
                : 'text-stone-500 hover:text-stone-850 bg-transparent'
            }`}
          >
            <MapPin className="w-4 h-4" />
            Landmark Declarator
          </button>
          <button
            onClick={() => setDiagnosticsTab('licensing')}
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
              diagnosticsTab === 'licensing'
                ? 'bg-rose-600 text-white shadow-sm font-black'
                : 'text-stone-500 hover:text-stone-850 bg-transparent'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Licensing &amp; Skills
          </button>
        </div>
      </div>

      {/* Main Content Render with AnimatePresence */}
      <div className="w-full">
        <AnimatePresence mode="wait">
          {diagnosticsTab === 'analytics' && (
            <DiagnosticsAnalytics
              key="analytics"
              medList={medList}
              taskList={taskList}
              carbonList={carbonList}
              streakData={streakData}
              emotionMeter={emotionMeter}
            />
          )}

          {diagnosticsTab === 'milestones' && (
            <DiagnosticsMilestones
              key="milestones"
              dynamicAchievements={dynamicAchievements}
              personalLandmarks={personalLandmarks}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              claimedList={claimedList}
              localScore={localScore}
              streakData={streakData}
              setStreakData={setStreakData}
              emotionMeter={emotionMeter}
              setEmotionMeter={setEmotionMeter}
              onSelectAch={setSelectedAch}
              speakCongratulate={speakCongratulate}
            />
          )}

          {diagnosticsTab === 'declarator' && (
            <DiagnosticsDeclarator
              key="declarator"
              personalLandmarks={personalLandmarks}
              onAddMemoryNode={onAddMemoryNode}
            />
          )}

          {diagnosticsTab === 'licensing' && (
            <DiagnosticsLicensing
              key="licensing"
              subTier={subTier}
              setSubTier={setSubTier}
              tierFeedback={tierFeedback}
              setTierFeedback={setTierFeedback}
              voiceName={voiceName}
              setVoiceName={setVoiceName}
              language={language}
              setLanguage={setLanguage}
            />
          )}
        </AnimatePresence>
      </div>

      {/* --- ELITE HIGH-FIDELITY BADGE / MILESTONE MODAL --- */}
      {selectedAch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-md animate-fadeIn">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-2xl relative max-w-md w-full flex flex-col gap-4 animate-scaleUp">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedAch(null)}
              className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-50 rounded-full transition-all cursor-pointer border-none"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            {/* Modal Header */}
            <div className="flex flex-col items-center text-center gap-2 mt-2">
              <span className="text-6xl p-4 bg-rose-50 border border-rose-100/50 rounded-2xl select-none inline-block shadow-sm animate-pulse">
                {selectedAch.badge}
              </span>
              
              <div className="mt-1">
                <span className={`text-[9px] font-mono font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                  selectedAch.unlocked 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                    : 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse'
                }`}>
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
                    className={`w-full py-2.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs uppercase font-mono tracking-wider ${
                      claimedList.includes(selectedAch.id)
                        ? 'bg-stone-50 border border-stone-200 text-stone-400 cursor-not-allowed'
                        : 'bg-rose-500 hover:bg-rose-600 text-white'
                    }`}
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
                  if (setParentActiveTab) {
                    setParentActiveTab('hub');
                  }
                  if (setInputVal) {
                    setInputVal(`Dear Dr. T, I want to learn more about achieving the "${selectedAch.title}" milestone. Please provide coaching support!`);
                  }
                  setTimeout(() => {
                    const activeInput = document.querySelector('textarea, input[placeholder*="talk to Dr. T"]') as HTMLInputElement || document.querySelector('input[type="text"]') as HTMLInputElement;
                    if (activeInput) {
                      activeInput.focus();
                    }
                  }, 150);
                }}
                className="w-full py-2 border border-stone-200 hover:bg-stone-50/70 hover:border-stone-350 text-stone-700 text-[10px] font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 font-mono uppercase bg-transparent"
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
