import React, { useState, useRef } from 'react';
import { 
  ChatMessage, 
  PersonalityMode, 
  SafetyAssessment, 
  PatientProfile, 
  NavTab 
} from '../../types';
import { DR_T_AVATAR } from '../../assets/drTAvatar';
import { 
  HeartPulse, 
  Send, 
  Mic, 
  Upload, 
  Sparkles, 
  AlertTriangle, 
  ShieldCheck, 
  AlertCircle, 
  Moon, 
  Activity, 
  Droplets, 
  Heart, 
  Pill, 
  Calendar, 
  HelpCircle, 
  FileText, 
  Volume2, 
  Copy, 
  Check, 
  ArrowRight,
  RefreshCw,
  Cpu,
  BadgeCheck
} from 'lucide-react';

interface DrTHomeProps {
  messages: ChatMessage[];
  onSendMessage: (text: string, isVoice?: boolean) => Promise<string>;
  personality: PersonalityMode;
  setPersonality: (p: PersonalityMode) => void;
  openVoiceMode: () => void;
  openBirthdayModal?: () => void;
  patient: PatientProfile;
  setActiveTab: (tab: NavTab) => void;
  isLoading: boolean;
}

const PERSONALITY_OPTIONS: Array<{ id: PersonalityMode; label: string; desc: string }> = [
  { id: 'Empathetic', label: 'Empathetic', desc: 'Warm, listening, compassionate tone' },
  { id: 'Socratic', label: 'Socratic', desc: 'Thoughtful clarifying questions' },
  { id: 'Clinical', label: 'Clinical', desc: 'Differential reasoning & evidence' },
  { id: 'Maternal', label: 'Maternal', desc: 'Nurturing & comforting care' },
  { id: 'Researcher', label: 'Researcher', desc: 'Biochemical mechanisms & citations' },
  { id: 'Concise', label: 'Concise', desc: 'Direct, clear, bulleted takeaways' },
];

const SUGGESTED_PROMPTS = [
  "I've been feeling unusually tired lately. Help me understand what questions I should ask.",
  "Can you explain what a low serum ferritin (19 ng/mL) result means alongside normal hemoglobin?",
  "I notice a slight drop in afternoon focus after 4 hours of desk work. What might cause this?",
  "Help me prepare a concise health summary for my doctor's visit with Dr. Chen.",
];

export const DrTHome: React.FC<DrTHomeProps> = ({
  messages,
  onSendMessage,
  personality,
  setPersonality,
  openVoiceMode,
  openBirthdayModal,
  patient,
  setActiveTab,
  isLoading,
}) => {
  const [inputText, setInputText] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const lastModelMessage = [...messages].reverse().find(m => m.role === 'model');
  const currentSafety: SafetyAssessment = lastModelMessage?.safety || {
    level: 'GREEN',
    explanation: 'Educational health information and general wellness guidance.',
    actionRecommendation: 'Explore wellness optimization, lifestyle habits, and preventative health metrics.',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const userText = inputText;
    setInputText('');
    await onSendMessage(userText);
  };

  const handlePromptClick = async (promptText: string) => {
    setInputText('');
    await onSendMessage(promptText);
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const clean = text.replace(/[*#_`]/g, '');
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const prompt = `I uploaded a clinical document: "${file.name}" (${(file.size / 1024).toFixed(1)} KB). Please help me interpret its key health observations and prepare discussion questions.`;
      onSendMessage(prompt);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Hero Experience with Dr. T Portrait Avatar */}
      <div className="relative rounded-3xl bg-gradient-to-r from-rose-500 via-pink-500 to-teal-500 border border-rose-300/60 p-6 sm:p-10 text-white shadow-xl shadow-rose-500/15 overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center space-x-2.5">
              <span className="p-1.5 rounded-xl bg-white/20 text-white border border-white/30 flex items-center justify-center">
                <HeartPulse className="w-4 h-4 animate-pulse" />
              </span>
              <span className="text-xs uppercase font-extrabold tracking-widest text-rose-100">
                Dr. T — Empathetic Intelligence
              </span>
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30 text-[10px] font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                <span>Active On Duty</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white drop-shadow-xs">
              Healthcare intelligence, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-teal-100 to-white">
                with heart & humanity.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-rose-50 leading-relaxed font-medium">
              Dr. T connects conversation, clinical knowledge, health data, AI agents and human oversight into one compassionate intelligence layer.
            </p>

            {/* Quick CTA row */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={openVoiceMode}
                className="px-4 py-2.5 rounded-2xl bg-white hover:bg-rose-50 text-rose-600 text-xs font-black shadow-lg shadow-rose-900/10 flex items-center space-x-2 transition transform active:scale-98"
              >
                <Mic className="w-4 h-4 text-rose-600" />
                <span>Talk with Dr. T Live</span>
              </button>

              <button
                onClick={() => setActiveTab('intelligence')}
                className="px-4 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 border border-white/30 text-white text-xs font-bold flex items-center space-x-2 transition backdrop-blur-xs"
              >
                <Activity className="w-4 h-4 text-teal-200" />
                <span>Explore Intelligence</span>
              </button>

              <button
                onClick={() => setActiveTab('swarm')}
                className="px-4 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 border border-white/30 text-white text-xs font-bold flex items-center space-x-2 transition backdrop-blur-xs"
              >
                <Cpu className="w-4 h-4 text-pink-200" />
                <span>Open AI Swarm</span>
              </button>
              {openBirthdayModal && (
                <button
                  onClick={openBirthdayModal}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-200 hover:from-amber-400 hover:to-yellow-400 text-amber-950 text-xs font-black flex items-center space-x-2 transition shadow-md shadow-amber-900/20 transform hover:scale-105 border border-amber-400/50"
                >
                  <Sparkles className="w-4 h-4 text-amber-900" />
                  <span>🎉 Birthday Dedication</span>
                </button>
              )}
            </div>
          </div>

          {/* Dr. T Avatar Hero Profile */}
          <div 
            onClick={openBirthdayModal}
            className="relative shrink-0 flex items-center justify-center cursor-pointer group"
            title="Dr. T - Click for Birthday Celebration"
          >
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden ring-4 ring-white/60 group-hover:ring-amber-300 transition-all duration-300 shadow-2xl bg-white/30 backdrop-blur-md">
              <img 
                src={DR_T_AVATAR} 
                alt="Dr. T - Asian Lady Doctor with Glasses"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition transform duration-300"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 p-1.5 bg-emerald-500 rounded-full text-white shadow-lg ring-4 ring-white" title="Board Certified Physician">
              <BadgeCheck className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Subtle Decorative SVG / Glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-white/20 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* 2. Central Safety Engine Alert Banner */}
      <div className={`p-4 rounded-2xl border transition-all ${
        currentSafety.level === 'RED'
          ? 'bg-rose-50 border-rose-300 text-rose-950 ring-2 ring-rose-500/20'
          : currentSafety.level === 'ORANGE'
            ? 'bg-amber-50 border-amber-300 text-amber-950'
            : currentSafety.level === 'YELLOW'
              ? 'bg-yellow-50/80 border-yellow-200 text-yellow-950'
              : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
      }`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start space-x-3">
            <span className={`p-1.5 rounded-xl mt-0.5 ${
              currentSafety.level === 'RED' ? 'bg-rose-200 text-rose-800' :
              currentSafety.level === 'ORANGE' ? 'bg-amber-200 text-amber-800' :
              currentSafety.level === 'YELLOW' ? 'bg-yellow-200 text-yellow-800' :
              'bg-emerald-200 text-emerald-800'
            }`}>
              {currentSafety.level === 'RED' ? <AlertCircle className="w-4 h-4" /> :
               currentSafety.level === 'ORANGE' || currentSafety.level === 'YELLOW' ? <AlertTriangle className="w-4 h-4" /> :
               <ShieldCheck className="w-4 h-4" />}
            </span>
            <div className="space-y-0.5">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Clinical Safety Level: {currentSafety.level}
                </span>
                <span className="text-[10px] text-slate-500">(Central Safety Engine)</span>
              </div>
              <p className="text-xs font-medium leading-relaxed">{currentSafety.explanation}</p>
              <p className="text-[11px] text-slate-600 font-semibold">{currentSafety.actionRecommendation}</p>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 italic max-w-xs text-right hidden md:block">
            Dr. T is educational decision support and not a substitute for professional medical diagnosis.
          </div>
        </div>
      </div>

      {/* 3. Main Workspace: Conversational Socratic Dialogue & Entry (Left 8 cols, Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Conversational Socratic Interface */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Personality Mode Selector */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Dr. T Personality Style:
              </span>
              <span className="text-[11px] text-teal-700 font-semibold">
                {PERSONALITY_OPTIONS.find(p => p.id === personality)?.desc}
              </span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {PERSONALITY_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setPersonality(opt.id)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold transition text-center ${
                    personality === opt.id
                      ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-500/20 ring-1 ring-rose-300'
                      : 'bg-rose-50/40 hover:bg-rose-100/60 text-slate-700 border border-rose-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Socratic Conversation Stream */}
          <div className="bg-white rounded-3xl border border-rose-100/90 shadow-sm overflow-hidden flex flex-col min-h-[460px]">
            
            {/* Chat header with Dr. T Avatar */}
            <div className="p-4 bg-gradient-to-r from-rose-50/70 via-white to-teal-50/40 border-b border-rose-100/80 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl overflow-hidden ring-2 ring-rose-400/50 shadow-xs">
                    <img 
                      src={DR_T_AVATAR} 
                      alt="Dr. T" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <h3 className="text-xs font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-teal-600 bg-clip-text text-transparent">
                      Dr. T
                    </h3>
                  </div>
                  <p className="text-[10px] text-slate-500">Empathetic Socratic Health Consultation</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePromptClick("Summarize our dialogue into a clinical discussion summary")}
                  className="px-2.5 py-1 rounded-xl bg-white hover:bg-rose-50 text-slate-700 text-xs font-semibold border border-rose-200/80 transition flex items-center space-x-1 shadow-2xs"
                >
                  <FileText className="w-3.5 h-3.5 text-rose-600" />
                  <span>To SOAP</span>
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 max-h-[520px]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col space-y-2 ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {msg.role === 'model' && (
                      <div className="w-5 h-5 rounded-full overflow-hidden ring-1 ring-rose-400/50 shrink-0">
                        <img 
                          src={DR_T_AVATAR} 
                          alt="Dr. T" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <span className={`text-[11px] font-bold ${msg.role === 'user' ? 'text-rose-700' : 'text-slate-600'}`}>
                      {msg.role === 'user' ? 'You' : 'Dr. T'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className={`p-5 rounded-3xl text-sm leading-relaxed max-w-2xl whitespace-pre-line shadow-xs ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white rounded-tr-xs shadow-md shadow-rose-500/15'
                      : 'bg-rose-50/30 border border-rose-100/90 text-slate-800 rounded-tl-xs'
                  }`}>
                    {msg.content}

                    {/* Suggested Questions for Clinician if attached */}
                    {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-rose-200/60 space-y-1.5">
                        <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider flex items-center space-x-1">
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>Questions to bring to your doctor:</span>
                        </span>
                        <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                          {msg.suggestedQuestions.map((q, idx) => (
                            <li key={idx}>{q}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Actions under Model Message */}
                  {msg.role === 'model' && (
                    <div className="flex items-center space-x-2 pl-2">
                      <button
                        onClick={() => speakText(msg.content)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-700 hover:bg-rose-50 transition"
                        title="Listen to audio"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleCopyMessage(msg.id, msg.content)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-rose-50 transition"
                        title="Copy message"
                      >
                        {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('informatics');
                        }}
                        className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 transition flex items-center space-x-1"
                      >
                        <span>Generate SOAP Note</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center space-x-2.5 text-rose-800 text-xs font-semibold p-4 bg-rose-50/80 rounded-2xl border border-rose-200 animate-pulse max-w-sm">
                  <HeartPulse className="w-4 h-4 text-rose-500 animate-spin" />
                  <span>Dr. T is formulating Socratic clinical reasoning...</span>
                </div>
              )}
            </div>

            {/* Suggested Starter Prompts */}
            <div className="p-3 bg-slate-50 border-t border-slate-100">
              <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none py-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 whitespace-nowrap pl-1">
                  Explore:
                </span>
                {SUGGESTED_PROMPTS.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePromptClick(p)}
                    className="px-3 py-1 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-[11px] text-slate-700 whitespace-nowrap font-medium transition shadow-2xs"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Conversational Input Form */}
            <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-slate-100 flex items-center space-x-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.csv,.json,.png,.jpg,.jpeg"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition border border-slate-200"
                title="Upload Lab / Medical Document / Image"
              >
                <Upload className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={openVoiceMode}
                className="p-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition border border-rose-200"
                title="Speak via Microphone"
              >
                <Mic className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Tell me what is happening. (e.g., 'I feel unusually tired in the afternoons')"
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition"
              />

              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 disabled:opacity-40 transition flex items-center space-x-1.5"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

          </div>

        </div>

        {/* Right Column: Today's Health Snapshot Cards (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                  <Activity className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-bold text-slate-900">Today's Health Snapshot</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400 font-semibold">PAT-88492-X</span>
            </div>

            <p className="text-xs text-slate-500">
              Synchronized from wearable biometric streams & FHIR clinical records for <span className="font-bold text-slate-700">{patient.name}</span>.
            </p>

            {/* Metric Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              
              {/* Sleep */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-1">
                <div className="flex items-center justify-between text-indigo-700">
                  <span className="text-[10px] font-bold uppercase">Sleep</span>
                  <Moon className="w-3.5 h-3.5" />
                </div>
                <div className="text-lg font-black text-slate-900 font-display">
                  {patient.metrics.sleepAvgHours} <span className="text-xs font-normal text-slate-500">hrs</span>
                </div>
                <div className="text-[10px] text-indigo-700 font-medium">N3 Deficit: -42%</div>
              </div>

              {/* Resting HR */}
              <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-1">
                <div className="flex items-center justify-between text-rose-700">
                  <span className="text-[10px] font-bold uppercase">Resting HR</span>
                  <Heart className="w-3.5 h-3.5" />
                </div>
                <div className="text-lg font-black text-slate-900 font-display">
                  {patient.metrics.restingHeartRate} <span className="text-xs font-normal text-slate-500">bpm</span>
                </div>
                <div className="text-[10px] text-rose-700 font-medium">HRV: 48ms (Stable)</div>
              </div>

              {/* Hydration */}
              <div className="p-3.5 rounded-2xl bg-cyan-50/60 border border-cyan-100 space-y-1">
                <div className="flex items-center justify-between text-cyan-700">
                  <span className="text-[10px] font-bold uppercase">Hydration</span>
                  <Droplets className="w-3.5 h-3.5" />
                </div>
                <div className="text-lg font-black text-slate-900 font-display">
                  {patient.metrics.hydrationLiters} <span className="text-xs font-normal text-slate-500">/ 2.5L</span>
                </div>
                <div className="text-[10px] text-cyan-700 font-medium">84% of daily target</div>
              </div>

              {/* Blood Pressure */}
              <div className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-100 space-y-1">
                <div className="flex items-center justify-between text-teal-700">
                  <span className="text-[10px] font-bold uppercase">Blood Pressure</span>
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <div className="text-lg font-black text-slate-900 font-display">
                  {patient.metrics.bloodPressure}
                </div>
                <div className="text-[10px] text-teal-700 font-medium">Optimal Normotensive</div>
              </div>

            </div>

            {/* Active Medication Reminder */}
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 rounded-xl bg-amber-200 text-amber-900">
                  <Pill className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Cholecalciferol (D3) 2000 IU</h4>
                  <p className="text-[10px] text-slate-600">Daily with breakfast • 96% adherence</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Taken
              </span>
            </div>

            {/* Upcoming Clinical Encounter */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 rounded-xl bg-slate-200 text-slate-800">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Dr. Sarah Chen, MD</h4>
                  <p className="text-[10px] text-slate-500">Integrative Internal Medicine • Aug 31</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('informatics')}
                className="text-[11px] text-teal-700 hover:text-teal-900 font-bold"
              >
                Prep Visit
              </button>
            </div>

          </div>

          {/* Connected Data Integration Status */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-rose-50/70 via-white to-teal-50/60 border border-rose-200/80 text-slate-900 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-800">
                Connected Sources
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                Sync Active
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-rose-100">
                <span className="text-slate-700 font-medium">Apple Health & Oura Ring</span>
                <span className="text-rose-600 font-mono text-[11px] font-semibold">Sync 8 mins ago</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-rose-100">
                <span className="text-slate-700 font-medium">Quest Diagnostics (Labs)</span>
                <span className="text-slate-500 font-mono text-[11px]">Aug 25, 2026</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-700 font-medium">HL7 FHIR R4 Interop Hub</span>
                <span className="text-teal-700 font-mono text-[11px] font-bold">Connected</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
