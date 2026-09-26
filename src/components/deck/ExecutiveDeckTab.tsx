import React, { useState, useEffect } from 'react';
import { NavTab } from '../../types';
import { 
  MVP_BRIEF_1020_TEXT, 
  PROBLEM_BRIEF_DATA, 
  ARCHITECTURE_DATA, 
  IMPACT_STATEMENT_DATA,
  ArchitectureNode 
} from '../../data/executiveDeckData';
import { 
  Check, 
  Copy, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  Presentation, 
  FileText, 
  Cpu, 
  Activity, 
  ShieldCheck, 
  Terminal, 
  Stethoscope, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  Sliders, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Download,
  Printer,
  Info
} from 'lucide-react';

interface ExecutiveDeckTabProps {
  setActiveTab: (tab: NavTab) => void;
}

export const ExecutiveDeckTab: React.FC<ExecutiveDeckTabProps> = ({ setActiveTab }) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'SLIDES' | 'GRID'>('SLIDES');
  const [copiedBrief, setCopiedBrief] = useState<boolean>(false);
  const [selectedPersonaId, setSelectedPersonaId] = useState<'patient' | 'clinician'>('patient');
  const [selectedNode, setSelectedNode] = useState<ArchitectureNode>(ARCHITECTURE_DATA.layers[2].nodes[0]);
  const [simStep, setSimStep] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // ROI Interactive Calculator State
  const [patientVolume, setPatientVolume] = useState<number>(4500);
  const [clinicianCount, setClinicianCount] = useState<number>(8);

  const slides = [
    { id: 0, title: "1. Problem Brief", subtitle: "Macro Costs & Dual Personas", icon: FileText, color: "text-rose-500", bg: "bg-rose-50 border-rose-200" },
    { id: 1, title: "2. Architecture Diagram", subtitle: "CoCo CLI Skills & Data Flow", icon: Cpu, color: "text-indigo-500", bg: "bg-indigo-50 border-indigo-200" },
    { id: 2, title: "3. Impact Statement", subtitle: "Measurable Outcomes & ROI", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-50 border-emerald-200" },
    { id: 3, title: "4. MVP Brief (<=1024c)", subtitle: "11 Pillars Strict Specification", icon: ShieldCheck, color: "text-purple-500", bg: "bg-purple-50 border-purple-200" },
  ];

  // Handle keyboard arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== 'SLIDES') return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        setCurrentSlide(prev => (prev < slides.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        setCurrentSlide(prev => (prev > 0 ? prev - 1 : prev));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, slides.length]);

  const handleCopyBrief = () => {
    navigator.clipboard.writeText(MVP_BRIEF_1020_TEXT);
    setCopiedBrief(true);
    setTimeout(() => setCopiedBrief(false), 2400);
  };

  const handleDownloadDeck = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      problemBrief: PROBLEM_BRIEF_DATA,
      architecture: ARCHITECTURE_DATA,
      impact: IMPACT_STATEMENT_DATA,
      mvpBrief1024: MVP_BRIEF_1020_TEXT
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `dr-t-health-bridge-deck-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Pipeline simulation runner
  const handleStartSim = () => {
    setIsSimulating(true);
    setSimStep(1);
    const timer1 = setTimeout(() => setSimStep(2), 700);
    const timer2 = setTimeout(() => setSimStep(3), 1500);
    const timer3 = setTimeout(() => setSimStep(4), 2300);
    const timer4 = setTimeout(() => setSimStep(5), 3100);
    const timer5 = setTimeout(() => {
      setIsSimulating(false);
    }, 3900);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  };

  // ROI calculations
  const annualHoursSaved = Math.round((patientVolume * 6.8) / 60);
  const estimatedCostSaved = Math.round(annualHoursSaved * 185); // $185/hr clinical average
  const anxietyAvertedPatients = Math.round(patientVolume * 0.74);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Executive Deck Top Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-rose-500 text-white shadow-sm">
              <Presentation className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-black text-slate-900 tracking-tight font-display">
                  Executive Pitch Deck & MVP Brief
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                  Investor & Clinical Suite
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
                  1013 / 1024 chars
                </span>
              </div>
              <p className="text-xs text-slate-500">
                1-Slide Problem Brief • CoCo CLI Architecture • Measurable Impact • Shrunk 1024-Char Spec
              </p>
            </div>
          </div>
        </div>

        {/* Global Deck Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View mode toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setViewMode('SLIDES')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                viewMode === 'SLIDES' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>1-Slide Deck</span>
            </button>
            <button
              onClick={() => setViewMode('GRID')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                viewMode === 'GRID' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Overview Grid</span>
            </button>
          </div>

          <button
            onClick={handleCopyBrief}
            className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200 transition flex items-center space-x-1.5"
            title="Copy 1024-char spec to clipboard"
          >
            {copiedBrief ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedBrief ? 'Copied 1013c Brief!' : 'Copy 1024c Spec'}</span>
          </button>

          <button
            onClick={handleDownloadDeck}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition flex items-center space-x-1.5"
            title="Download JSON deck specification"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">JSON</span>
          </button>

          <button
            onClick={() => window.print()}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition"
            title="Print Slide Deck"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTab('bridge')}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white text-xs font-bold shadow-xs transition flex items-center space-x-1.5"
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Open Health Bridge</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Slide Navigation Ribbon (when in SLIDES mode) */}
      {viewMode === 'SLIDES' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-1.5 overflow-x-auto py-1">
            {slides.map((s, idx) => {
              const IconComp = s.icon;
              const isActive = currentSlide === idx;
              return (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlide(idx)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 shrink-0 ${
                    isActive 
                      ? `${s.bg} ${s.color} border shadow-xs` 
                      : 'text-slate-600 hover:bg-slate-100 border border-transparent'
                  }`}
                >
                  <IconComp className={`w-3.5 h-3.5 ${isActive ? s.color : 'text-slate-400'}`} />
                  <span>{s.title}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center space-x-2 shrink-0 ml-auto">
            <span className="text-xs font-mono font-semibold text-slate-400 mr-2">
              Slide {currentSlide + 1} of {slides.length}
            </span>
            <button
              onClick={() => setCurrentSlide(prev => (prev > 0 ? prev - 1 : prev))}
              disabled={currentSlide === 0}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 transition"
              title="Previous Slide (← key)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentSlide(prev => (prev < slides.length - 1 ? prev + 1 : prev))}
              disabled={currentSlide === slides.length - 1}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 transition"
              title="Next Slide (→ key)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* SLIDE 1: PROBLEM BRIEF (1 SLIDE) */}
      {/* ============================================================ */}
      {(viewMode === 'GRID' || currentSlide === 0) && (
        <section className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
                  SLIDE 1 • PROBLEM BRIEF
                </span>
                <span className="text-xs text-slate-400 font-mono">Executive Summary</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight mt-1 font-display">
                {PROBLEM_BRIEF_DATA.headline}
              </h2>
              <p className="text-xs text-slate-500">{PROBLEM_BRIEF_DATA.subheadline}</p>
            </div>
            <div className="shrink-0 flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-500">Persona View:</span>
              <div className="bg-slate-100 p-1 rounded-xl flex items-center space-x-1">
                <button
                  onClick={() => setSelectedPersonaId('patient')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                    selectedPersonaId === 'patient' ? 'bg-white text-rose-600 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  🧑‍💻 Patient
                </button>
                <button
                  onClick={() => setSelectedPersonaId('clinician')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                    selectedPersonaId === 'clinician' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  🩺 Clinician
                </button>
              </div>
            </div>
          </div>

          {/* Macro Industry Problem Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-rose-50/60 rounded-2xl p-4 border border-rose-200/80">
              <div className="text-2xl font-black text-rose-700 font-display">
                {PROBLEM_BRIEF_DATA.macroProblem.economicLoss}
              </div>
              <p className="text-xs text-rose-900 font-bold mt-1">Economic & Workflow Waste</p>
              <p className="text-[11px] text-rose-800/80 mt-1 leading-relaxed">
                {PROBLEM_BRIEF_DATA.macroProblem.economicDesc}
              </p>
            </div>
            <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-200/80">
              <div className="text-2xl font-black text-amber-700 font-display">
                {PROBLEM_BRIEF_DATA.macroProblem.readabilityGap}
              </div>
              <p className="text-xs text-amber-900 font-bold mt-1">Severe Health Literacy Divide</p>
              <p className="text-[11px] text-amber-800/80 mt-1 leading-relaxed">
                {PROBLEM_BRIEF_DATA.macroProblem.readabilityDesc}
              </p>
            </div>
            <div className="bg-indigo-50/60 rounded-2xl p-4 border border-indigo-200/80">
              <div className="text-2xl font-black text-indigo-700 font-display">
                {PROBLEM_BRIEF_DATA.macroProblem.clinicianBurnout}
              </div>
              <p className="text-xs text-indigo-900 font-bold mt-1">Physician Time & Charting Crisis</p>
              <p className="text-[11px] text-indigo-800/80 mt-1 leading-relaxed">
                {PROBLEM_BRIEF_DATA.macroProblem.clinicianDesc}
              </p>
            </div>
          </div>

          {/* Deep Persona Breakdown: Pain Point vs How Dr. T Improves It */}
          {(() => {
            const persona = PROBLEM_BRIEF_DATA.personas.find(p => p.id === selectedPersonaId)!;
            const isPatient = persona.id === 'patient';
            return (
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl p-2 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                      {persona.avatar}
                    </span>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 font-display">{persona.name}</h3>
                      <p className="text-xs text-slate-500 font-medium">{persona.role}</p>
                    </div>
                  </div>
                  <div className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center space-x-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">{persona.metrics.label}:</span>
                    <span className={`text-sm font-black ${isPatient ? 'text-rose-600' : 'text-indigo-600'}`}>
                      {persona.metrics.value}
                    </span>
                  </div>
                </div>

                <div className="italic text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200/80">
                  "{persona.quote}"
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  {/* Current Pain Points */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-rose-700 uppercase tracking-wide">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Current Pain Points (Without Dr. T)</span>
                    </div>
                    <ul className="space-y-1.5">
                      {persona.painPoints.map((pt, idx) => (
                        <li key={idx} className="flex items-start space-x-2 text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-rose-100">
                          <span className="text-rose-500 font-bold shrink-0">✕</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 10x Improvements */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wide">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>How Dr. T Health Bridge Solves It</span>
                    </div>
                    <ul className="space-y-1.5">
                      {persona.solvedWithDrT.map((sol, idx) => (
                        <li key={idx} className="flex items-start space-x-2 text-xs text-slate-800 bg-white p-2.5 rounded-xl border border-emerald-100">
                          <span className="text-emerald-500 font-bold shrink-0">✓</span>
                          <span>{sol}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Industry & Regulatory Context */}
          <div className="border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Industry & Regulatory Domain Anchors
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {PROBLEM_BRIEF_DATA.industryContext.map((c, idx) => (
                <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                  <div className="font-extrabold text-slate-900">{c.title}</div>
                  <div className="text-[11px] text-slate-500 mt-1 leading-snug">{c.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* SLIDE 2: ARCHITECTURE DIAGRAM & COCO CLI SKILLS (1 SLIDE) */}
      {/* ============================================================ */}
      {(viewMode === 'GRID' || currentSlide === 1) && (
        <section className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-800 border border-indigo-200">
                  SLIDE 2 • ARCHITECTURE & COCO CLI
                </span>
                <span className="text-xs text-slate-400 font-mono">System Design & Data Flow</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight mt-1 font-display">
                {ARCHITECTURE_DATA.headline}
              </h2>
              <p className="text-xs text-slate-500">{ARCHITECTURE_DATA.subheadline}</p>
            </div>

            {/* Pipeline simulator trigger */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleStartSim}
                disabled={isSimulating}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-2xs"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{isSimulating ? 'Simulating Trace...' : 'Simulate Live Trace'}</span>
              </button>
              {simStep > 0 && (
                <button
                  onClick={() => setSimStep(0)}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                  title="Reset trace"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Interactive Flow Simulator Ribbon */}
          {simStep > 0 && (
            <div className="bg-indigo-900 text-white p-3.5 rounded-2xl shadow-xs space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-indigo-300 font-bold uppercase">Live Data Packet Trace:</span>
                <span className="text-indigo-200">Step {simStep} of 5</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] font-mono">
                <div className={`p-1.5 rounded-lg border ${simStep >= 1 ? 'bg-indigo-700 border-indigo-400 text-white font-bold' : 'bg-indigo-950/50 border-indigo-800 text-indigo-400'}`}>
                  1. Lab PDF Upload
                </div>
                <div className={`p-1.5 rounded-lg border ${simStep >= 2 ? 'bg-indigo-700 border-indigo-400 text-white font-bold' : 'bg-indigo-950/50 border-indigo-800 text-indigo-400'}`}>
                  2. HIPAA Scrub (0 PHI)
                </div>
                <div className={`p-1.5 rounded-lg border ${simStep >= 3 ? 'bg-indigo-700 border-indigo-400 text-white font-bold' : 'bg-indigo-950/50 border-indigo-800 text-indigo-400'}`}>
                  3. CoCo Skills Exec
                </div>
                <div className={`p-1.5 rounded-lg border ${simStep >= 4 ? 'bg-indigo-700 border-indigo-400 text-white font-bold' : 'bg-indigo-950/50 border-indigo-800 text-indigo-400'}`}>
                  4. Med-Gemini Grounding
                </div>
                <div className={`p-1.5 rounded-lg border ${simStep >= 5 ? 'bg-emerald-600 border-emerald-400 text-white font-bold' : 'bg-indigo-950/50 border-indigo-800 text-indigo-400'}`}>
                  5. SBAR & Patient Audio
                </div>
              </div>
            </div>
          )}

          {/* Visual Architecture Layers Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Layers Flow Column (2 Columns wide) */}
            <div className="lg:col-span-2 space-y-4">
              {ARCHITECTURE_DATA.layers.map((layer, lIdx) => (
                <div key={lIdx} className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800 uppercase tracking-wide font-display">
                      {layer.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {layer.nodes.length} component{layer.nodes.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">{layer.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {layer.nodes.map(node => {
                      const isSelected = selectedNode.id === node.id;
                      return (
                        <div
                          key={node.id}
                          onClick={() => setSelectedNode(node)}
                          className={`p-3 rounded-xl border cursor-pointer transition text-left space-y-1.5 ${
                            isSelected 
                              ? 'bg-white border-indigo-500 shadow-sm ring-2 ring-indigo-200' 
                              : 'bg-white hover:bg-slate-100/80 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 truncate">
                              {node.title}
                            </span>
                            {node.cocoSkill && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                                CoCo Skill
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                            {node.shortDesc}
                          </p>
                          <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400 font-mono">
                            <span>Latency: {node.latency}</span>
                            <span className="text-emerald-600 font-semibold">{node.safetyProfile}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Node Inspector Column */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 border border-slate-800 space-y-4 shadow-sm sticky top-24">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <Terminal className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-300">
                      CoCo Node Inspector
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-800">
                    {selectedNode.category}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-white font-display">
                    {selectedNode.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {selectedNode.shortDesc}
                  </p>
                </div>

                {selectedNode.cocoCommand && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">CoCo CLI Invocation:</span>
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-400 break-all select-all">
                      $ {selectedNode.cocoCommand}
                    </div>
                  </div>
                )}

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Inputs:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedNode.inputs.map((inp, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-mono">
                          {inp}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Outputs:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedNode.outputs.map((out, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-800 text-indigo-300 text-[10px] font-mono">
                          {out}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">P95 Latency:</span>
                  <span className="text-indigo-400 font-bold">{selectedNode.latency}</span>
                </div>

                <button
                  onClick={() => setActiveTab('bridge')}
                  className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center justify-center space-x-1.5"
                >
                  <span>Test in 11 Pillars Sandbox</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* SLIDE 3: MEASURABLE IMPACT & SCALABILITY (1 SLIDE) */}
      {/* ============================================================ */}
      {(viewMode === 'GRID' || currentSlide === 2) && (
        <section className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                  SLIDE 3 • IMPACT & SCALABILITY
                </span>
                <span className="text-xs text-slate-400 font-mono">Clinical Outcomes & ROI</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight mt-1 font-display">
                {IMPACT_STATEMENT_DATA.headline}
              </h2>
              <p className="text-xs text-slate-500">{IMPACT_STATEMENT_DATA.subheadline}</p>
            </div>
          </div>

          {/* 6 Core Measurable Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {IMPACT_STATEMENT_DATA.metrics.map((m, idx) => (
              <div key={idx} className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">{m.metric}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-100 text-emerald-800">
                    {m.delta}
                  </span>
                </div>
                <div className="text-2xl md:text-3xl font-black text-slate-900 font-display">
                  {m.value}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  Baseline: {m.baseline}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed pt-1 border-t border-slate-200/60">
                  {m.description}
                </p>
                <div className="text-[10px] text-slate-400 font-mono italic">
                  Ref: {m.citation}
                </div>
              </div>
            ))}
          </div>

          {/* Interactive ROI & Clinical Time Calculator */}
          <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-teal-950 text-white rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-800/80 pb-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-teal-300 font-mono">
                  Interactive Practice ROI Calculator
                </h3>
                <p className="text-xs text-indigo-200">
                  Model clinical hours saved and economic return based on your clinic panel size
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Formula: 6.8 min saved / patient @ $185/hr
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="text-slate-300">Annual Patient Visits:</span>
                    <span className="text-teal-300 font-bold">{patientVolume.toLocaleString()} visits</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="30000"
                    step="500"
                    value={patientVolume}
                    onChange={(e) => setPatientVolume(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-400"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                    <span>500 (Solo)</span>
                    <span>15,000 (Group)</span>
                    <span>30,000 (Health System)</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="text-slate-300">Primary Care Physicians:</span>
                    <span className="text-teal-300 font-bold">{clinicianCount} doctors</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    step="1"
                    value={clinicianCount}
                    onChange={(e) => setClinicianCount(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-400"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                    <span>1 MD</span>
                    <span>25 MDs</span>
                    <span>50 MDs</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Results Card */}
              <div className="grid grid-cols-3 gap-3 bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                <div className="space-y-1">
                  <div className="text-xl md:text-2xl font-black text-teal-300 font-display">
                    {annualHoursSaved.toLocaleString()}h
                  </div>
                  <div className="text-[10px] text-slate-300 font-mono uppercase">Annual Clinical Time Saved</div>
                </div>
                <div className="space-y-1 border-x border-white/10">
                  <div className="text-xl md:text-2xl font-black text-emerald-300 font-display">
                    ${(estimatedCostSaved / 1000).toFixed(1)}k
                  </div>
                  <div className="text-[10px] text-slate-300 font-mono uppercase">Estimated Cost Savings</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xl md:text-2xl font-black text-rose-300 font-display">
                    {anxietyAvertedPatients.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-300 font-mono uppercase">Anxiety Episodes Averted</div>
                </div>
              </div>
            </div>
          </div>

          {/* Scalability & Beyond Demo Roadmap */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Scalability Architecture Potential
              </h3>
              <div className="space-y-2">
                {IMPACT_STATEMENT_DATA.scalabilityPotential.map((p, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <span className="font-extrabold text-slate-900">{p.title}:</span>{' '}
                    <span className="text-slate-600">{p.detail}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Beyond-The-Demo Phased Commercial Roadmap
              </h3>
              <div className="space-y-2">
                {IMPACT_STATEMENT_DATA.beyondDemoRoadmap.map((r, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <span className="font-extrabold text-slate-900">{r.phase}:</span>{' '}
                    <span className="text-slate-600">{r.focus}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/* SLIDE 4: PROTOTYPE / MVP BRIEF (STRICT <= 1024 CHARACTERS) */}
      {/* ============================================================ */}
      {(viewMode === 'GRID' || currentSlide === 3) && (
        <section className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200">
                  SLIDE 4 • PROTOTYPE / MVP BRIEF
                </span>
                <span className="text-xs text-slate-400 font-mono">Strict Constraint Fulfillment</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight mt-1 font-display">
                Ultra-Crisp MVP Brief (Maximum 1024 Characters)
              </h2>
              <p className="text-xs text-slate-500">
                Fully functional specification shrunk to 1013 characters without losing a single pillar.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <div className="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-xs font-mono font-bold text-purple-800 flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                <span>{MVP_BRIEF_1020_TEXT.length} / 1024 Chars (98.9%)</span>
              </div>

              <button
                onClick={handleCopyBrief}
                className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center space-x-1.5"
              >
                {copiedBrief ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedBrief ? 'Copied to Clipboard!' : 'Copy Brief'}</span>
              </button>
            </div>
          </div>

          {/* Raw Monospaced Brief Display */}
          <div className="relative">
            <div className="bg-slate-950 text-slate-100 p-6 rounded-2xl border border-slate-800 font-mono text-xs leading-relaxed whitespace-pre-wrap select-all shadow-inner">
              {MVP_BRIEF_1020_TEXT}
            </div>
            <div className="absolute top-3 right-3 text-[10px] font-mono text-slate-500 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800">
              Plaintext • UTF-8 • {MVP_BRIEF_1020_TEXT.length} bytes
            </div>
          </div>

          {/* Interactive 11 MVP Pillars Status Matrix */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                11 MVP Pillars Implementation Status
              </h3>
              <span className="text-[11px] text-emerald-600 font-bold font-mono">
                11 / 11 Complete in Health Bridge
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {[
                { num: '1', title: 'GRADE Evidence', desc: 'PubMed, AHA, ADA citations & prep questions', pillarKey: 'evidence', icon: '📜' },
                { num: '2', title: 'HL7 FHIR R4', desc: 'LOINC, SNOMED, RxNorm live schema validator', pillarKey: 'fhir', icon: '🗄️' },
                { num: '3', title: 'Medical AI Models', desc: 'Med-Gemini, Med-PaLM 2 reasoning benchmarks', pillarKey: 'models', icon: '🧠' },
                { num: '4', title: 'Multimodal Triage', desc: 'Lab PDFs, ECG strips, skin lesion glossary', pillarKey: 'multimodal', icon: '👁️' },
                { num: '5', title: 'Accessible Voice', desc: 'Web Speech API & medical phonetic guide', pillarKey: 'voice', icon: '🎙️' },
                { num: '6', title: 'Blood & Nutrition', desc: 'Biomarker-to-diet & drug-food interactions', pillarKey: 'nutrition', icon: '🥗' },
                { num: '7', title: 'Clinical HITL', desc: 'Physician sign-off gate & SBAR handoffs', pillarKey: 'oversight', icon: '🩺' },
                { num: '8', title: 'HIPAA Safe Harbor', desc: 'Client-side 18-PHI de-identification engine', pillarKey: 'privacy', icon: '🔒' },
                { num: '9', title: 'Language Equity', desc: '8 underserved tongues at Grade 6 level', pillarKey: 'multilingual', icon: '🌐' },
                { num: '10', title: 'Clinician Portal', desc: 'Dual-view triage roster & 1-click EHR export', pillarKey: 'clinician', icon: '👥' },
                { num: '11', title: 'Safety Scorecard', desc: '98.4% Safety Index; 100% emergency refusal', pillarKey: 'safety', icon: '🛡️' },
              ].map((p) => (
                <div
                  key={p.num}
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition flex items-center justify-between text-xs group"
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="text-base">{p.icon}</span>
                    <div>
                      <div className="font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {p.num}. {p.title}
                      </div>
                      <div className="text-[10px] text-slate-500 line-clamp-1">{p.desc}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('bridge')}
                    className="p-1.5 rounded-lg bg-white group-hover:bg-indigo-600 group-hover:text-white text-slate-400 border border-slate-200 transition shrink-0 ml-2"
                    title={`Open ${p.title} in Health Bridge`}
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick jump to interactive Health Bridge */}
          <div className="bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 text-white rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div>
              <h4 className="text-base font-black font-display">Experience All 11 Pillars Live in the Sandbox</h4>
              <p className="text-xs text-purple-100 mt-0.5">
                Every slide capability documented here is completely implemented and testable in the Dr. T Health Bridge.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('bridge')}
              className="px-5 py-2.5 rounded-xl bg-white text-purple-700 hover:bg-purple-50 text-xs font-black shadow-md transition shrink-0 flex items-center space-x-2"
            >
              <span>Launch 11 Pillars Sandbox</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

    </div>
  );
};
