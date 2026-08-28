import React, { useState } from 'react';
import { 
  PatientProfile, 
  HealthEvent, 
  HealthInsight, 
  HealthEventCategory, 
  NavTab 
} from '../../types';
import { 
  Activity, 
  Calendar, 
  Clock, 
  Sparkles, 
  HelpCircle, 
  TrendingUp, 
  Target, 
  FileDown, 
  ChevronRight, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  Search,
  ExternalLink,
  Layers
} from 'lucide-react';

interface HealthIntelligenceProps {
  patient: PatientProfile;
  events: HealthEvent[];
  insights: HealthInsight[];
  setActiveTab: (tab: NavTab) => void;
}

export const HealthIntelligence: React.FC<HealthIntelligenceProps> = ({
  patient,
  events,
  insights,
  setActiveTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'timeline' | 'trends' | 'patterns' | 'questions' | 'goals' | 'report'>('timeline');
  const [categoryFilter, setCategoryFilter] = useState<HealthEventCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<HealthEvent | null>(events[0] || null);
  const [copiedQuestion, setCopiedQuestion] = useState<string | null>(null);

  const categories: Array<{ id: HealthEventCategory; label: string }> = [
    { id: 'ALL', label: 'All Events' },
    { id: 'AI_INSIGHTS', label: 'AI Insights' },
    { id: 'LABS', label: 'Labs' },
    { id: 'SYMPTOMS', label: 'Symptoms' },
    { id: 'VISITS', label: 'Visits' },
    { id: 'MEDICATIONS', label: 'Medications' },
    { id: 'LIFESTYLE', label: 'Lifestyle' },
  ];

  const filteredEvents = events.filter((evt) => {
    const matchesCategory = categoryFilter === 'ALL' || evt.category === categoryFilter;
    const matchesSearch = evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          evt.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          evt.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedQuestion(text);
    setTimeout(() => setCopiedQuestion(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Activity className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Personal Health Intelligence & Timeline
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Synthesizing longitudinal biometrics, clinical encounters, lab trends and AI-discovered correlations.
          </p>
        </div>

        {/* Subtab Navigation Pill */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-2xl overflow-x-auto">
          {[
            { id: 'timeline', label: 'Timeline', icon: <Layers className="w-3.5 h-3.5" /> },
            { id: 'trends', label: 'Trends & Biometrics', icon: <TrendingUp className="w-3.5 h-3.5" /> },
            { id: 'patterns', label: 'AI Patterns', icon: <Sparkles className="w-3.5 h-3.5" /> },
            { id: 'questions', label: 'Clinician Questions', icon: <HelpCircle className="w-3.5 h-3.5" /> },
            { id: 'goals', label: 'Goals', icon: <Target className="w-3.5 h-3.5" /> },
            { id: 'report', label: 'Encounter Report', icon: <FileDown className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                activeSubTab === tab.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Subtab Content */}

      {/* 1. TIMELINE SUBTAB */}
      {activeSubTab === 'timeline' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Filterable Event Stream (8 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Search & Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search events, symptoms, medications, labs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-teal-500 transition"
                />
              </div>

              <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none py-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                      categoryFilter === cat.id
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline Nodes */}
            <div className="space-y-3 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
              {filteredEvents.map((evt) => {
                const isSelected = selectedEvent?.id === evt.id;
                return (
                  <div
                    key={evt.id}
                    onClick={() => setSelectedEvent(evt)}
                    className={`relative pl-9 cursor-pointer transition`}
                  >
                    {/* Node Dot */}
                    <div className={`absolute left-2.5 top-4 w-3.5 h-3.5 rounded-full border-2 border-white -translate-x-1/2 transition ${
                      evt.category === 'AI_INSIGHTS' ? 'bg-purple-500 ring-2 ring-purple-200' :
                      evt.category === 'LABS' ? 'bg-blue-500 ring-2 ring-blue-200' :
                      evt.category === 'SYMPTOMS' ? 'bg-amber-500 ring-2 ring-amber-200' :
                      evt.category === 'MEDICATIONS' ? 'bg-rose-500 ring-2 ring-rose-200' :
                      'bg-teal-500 ring-2 ring-teal-200'
                    }`} />

                    <div className={`p-4 rounded-2xl border transition ${
                      isSelected
                        ? 'bg-white border-teal-500 shadow-md ring-1 ring-teal-500/20'
                        : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-2xs'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          evt.category === 'AI_INSIGHTS' ? 'bg-purple-100 text-purple-800' :
                          evt.category === 'LABS' ? 'bg-blue-100 text-blue-800' :
                          evt.category === 'SYMPTOMS' ? 'bg-amber-100 text-amber-800' :
                          evt.category === 'MEDICATIONS' ? 'bg-rose-100 text-rose-800' :
                          'bg-teal-100 text-teal-800'
                        }`}>
                          {evt.category.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {new Date(evt.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>

                      <h3 className="text-xs font-bold text-slate-900 mt-2">{evt.title}</h3>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">{evt.summary}</p>

                      <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2 border-t border-slate-100 text-[10px]">
                        <span className="text-slate-400 font-medium">Source: {evt.source}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-teal-700 font-bold">Confidence: {(evt.confidence * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Right Column: Selected Event Inspector Drawer (5 cols) */}
          <div className="lg:col-span-5 sticky top-24">
            {selectedEvent ? (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <span className="p-1.5 rounded-xl bg-teal-100 text-teal-800 font-bold text-xs">
                      {selectedEvent.category}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{selectedEvent.id}</span>
                  </div>
                  <span className="text-xs text-slate-500 font-semibold">
                    {new Date(selectedEvent.timestamp).toLocaleDateString()}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-black text-slate-900">{selectedEvent.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Recorded via {selectedEvent.source}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-800 leading-relaxed space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Clinical Synthesis
                  </span>
                  <p>{selectedEvent.summary}</p>
                </div>

                {/* Tags */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Clinical Tags
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedEvent.tags.map((t, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200/60">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action CTA */}
                <div className="pt-2 flex items-center space-x-2">
                  <button
                    onClick={() => setActiveTab('drt')}
                    className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center space-x-1.5"
                  >
                    <span>Discuss with Dr. T</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setActiveTab('informatics')}
                    className="py-2.5 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold transition"
                  >
                    FHIR
                  </button>
                </div>

              </div>
            ) : (
              <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-xs text-slate-400">
                Select an event from the timeline to inspect clinical details.
              </div>
            )}
          </div>

        </div>
      )}

      {/* 2. TRENDS & BIOMETRICS SUBTAB */}
      {activeSubTab === 'trends' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Chart 1: Sleep Stages vs Subjective Fatigue */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Sleep Architecture (Deep N3 vs REM)</h3>
              <span className="text-[10px] font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full font-bold">Oura Sync</span>
            </div>
            <p className="text-xs text-slate-500">Average N3 restorative deep sleep is 48 mins (Recommended: 75–100 mins).</p>

            {/* Custom SVG Bar Chart */}
            <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-100 pb-2">
              {[
                { day: 'Mon', deep: 38, rem: 85, target: 80 },
                { day: 'Tue', deep: 45, rem: 90, target: 80 },
                { day: 'Wed', deep: 32, rem: 75, target: 80 },
                { day: 'Thu', deep: 55, rem: 105, target: 80 },
                { day: 'Fri', deep: 40, rem: 80, target: 80 },
                { day: 'Sat', deep: 65, rem: 110, target: 80 },
                { day: 'Sun', deep: 48, rem: 95, target: 80 },
              ].map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1 group relative">
                  {/* Tooltip on hover */}
                  <div className="hidden group-hover:block absolute -top-8 bg-slate-900 text-white text-[10px] py-1 px-2 rounded-lg whitespace-nowrap z-10 font-mono">
                    Deep: {d.deep}m | REM: {d.rem}m
                  </div>
                  <div className="w-full flex items-end justify-center gap-1 h-32">
                    <div style={{ height: `${(d.deep / 120) * 100}%` }} className="w-2.5 bg-indigo-600 rounded-t-sm" />
                    <div style={{ height: `${(d.rem / 120) * 100}%` }} className="w-2.5 bg-cyan-400 rounded-t-sm" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 mt-1">{d.day}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center space-x-6 text-xs text-slate-600 pt-2">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-indigo-600" />
                <span>N3 Deep Sleep</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-cyan-400" />
                <span>REM Sleep</span>
              </div>
            </div>
          </div>

          {/* Chart 2: Serum Ferritin & Iron Dynamics */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Serum Ferritin Trajectory (ng/mL)</h3>
              <span className="text-[10px] font-mono text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full font-bold">19 ng/mL (Low-Normal)</span>
            </div>
            <p className="text-xs text-slate-500">Target physiological storage reserve: 50 – 100 ng/mL.</p>

            <div className="h-44 flex items-end justify-between gap-4 pt-6 px-4 border-b border-slate-100 pb-2">
              {[
                { date: 'Nov 2025', val: 34 },
                { date: 'Feb 2026', val: 28 },
                { date: 'May 2026', val: 22 },
                { date: 'Aug 2026', val: 19 },
              ].map((pt) => (
                <div key={pt.date} className="flex-1 flex flex-col items-center gap-1 group relative">
                  <div className="hidden group-hover:block absolute -top-8 bg-slate-900 text-white text-[10px] py-1 px-2 rounded-lg whitespace-nowrap z-10 font-mono">
                    {pt.val} ng/mL
                  </div>
                  <div className="w-full flex items-end justify-center h-32">
                    <div style={{ height: `${(pt.val / 60) * 100}%` }} className="w-4 bg-gradient-to-t from-rose-500 to-amber-400 rounded-t-lg" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 mt-1">{pt.date}</span>
                </div>
              ))}
            </div>
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100 text-xs text-amber-900 flex items-center justify-between">
              <span>Non-anemic tissue iron storage depletion flagged.</span>
              <button onClick={() => setActiveTab('informatics')} className="font-bold underline text-amber-950">
                View Lab Details
              </button>
            </div>
          </div>

        </div>
      )}

      {/* 3. AI PATTERNS SUBTAB */}
      {activeSubTab === 'patterns' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {insights.map((ins) => (
            <div key={ins.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-100 text-purple-800 flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-purple-600" />
                    <span>AI-Generated Insight</span>
                  </span>
                  <span className="text-[10px] font-mono text-teal-700 font-bold">
                    Confidence: {(ins.confidence * 100).toFixed(0)}%
                  </span>
                </div>

                <h3 className="text-sm font-black text-slate-900">{ins.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{ins.correlation}</p>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-700 space-y-1">
                  <span className="font-bold text-slate-900 block">Evidence Basis:</span>
                  <p className="italic text-slate-600">{ins.evidenceBasis}</p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="text-xs text-teal-900 font-semibold">
                  <span className="font-bold text-teal-700">Action:</span> {ins.suggestedAction}
                </div>
                <button
                  onClick={() => setActiveTab('drt')}
                  className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
                >
                  Explore with Dr. T
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. QUESTIONS FOR CLINICIAN SUBTAB */}
      {activeSubTab === 'questions' && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">Curated Questions for Dr. Sarah Chen, MD</h3>
              <p className="text-xs text-slate-500">Formulated by Dr. T from your longitudinal biometrics, labs, and reported fatigue patterns.</p>
            </div>
            <button
              onClick={() => handleCopy(insights.flatMap(i => i.questionsForClinician).join('\n• '))}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center space-x-2"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy All Questions</span>
            </button>
          </div>

          <div className="space-y-3">
            {insights.flatMap(i => i.questionsForClinician).map((q, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-4 hover:bg-slate-100/70 transition"
              >
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs font-semibold text-slate-800 leading-relaxed">{q}</p>
                </div>

                <button
                  onClick={() => handleCopy(q)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition"
                  title="Copy question"
                >
                  {copiedQuestion === q ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. GOALS SUBTAB */}
      {activeSubTab === 'goals' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Serum Ferritin Optimization', target: '> 50 ng/mL', current: '19 ng/mL', progress: 38, color: 'bg-rose-500' },
            { title: 'Nightly Sleep Consistency', target: '7.5 hours avg', current: '6.2 hours', progress: 82, color: 'bg-indigo-500' },
            { title: 'Zone 2 Aerobic Conditioning', target: '150 min / week', current: '140 min', progress: 93, color: 'bg-teal-500' },
          ].map((g, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900">{g.title}</h3>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-slate-900">{g.current}</span>
                <span className="text-xs text-slate-500">Target: {g.target}</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div style={{ width: `${g.progress}%` }} className={`h-full ${g.color}`} />
              </div>
              <span className="text-[11px] font-bold text-slate-500">{g.progress}% Achieved</span>
            </div>
          ))}
        </div>
      )}

      {/* 6. REPORT SUBTAB */}
      {activeSubTab === 'report' && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-3xl mx-auto space-y-6">
          <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900">Dr. T Pre-Encounter Health Summary</h2>
              <p className="text-xs text-slate-500">Generated for Alex Morgan (MRN: PAT-88492-X) • {new Date().toLocaleDateString()}</p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center space-x-2"
            >
              <FileDown className="w-4 h-4" />
              <span>Export / Print</span>
            </button>
          </div>

          <div className="space-y-4 text-xs text-slate-800 leading-relaxed">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">Primary Chief Concern:</h4>
              <p className="mt-1">Subtle circadian fatigue and mid-afternoon energy drop over the past 4 weeks, with preserved morning baseline.</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">Key Laboratory Findings:</h4>
              <p className="mt-1">Serum Ferritin 19 ng/mL (Low-normal). 25-OH Vitamin D 28 ng/mL (Suboptimal). TSH 2.15 uIU/mL (Normal). Glucose 88 mg/dL.</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">Wearable Biometric Trends:</h4>
              <p className="mt-1">Sleep average 6.2 hours with 42% reduction in slow-wave N3 cycles on late sleep onset days (&gt;12:30 AM). Resting HR 68 bpm, HRV 48ms.</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
