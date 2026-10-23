import React, { useState, useEffect } from 'react';
import { 
  HealthAlertIntakeData, 
  HealthAlertAnalysisResponse, 
  HealthAlertTriageTier, 
  NavTab 
} from '../../types';
import { 
  ShieldCheck, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  Clock, 
  Activity, 
  ArrowRight, 
  ChevronRight, 
  Copy, 
  Check, 
  RefreshCw, 
  Stethoscope, 
  RotateCcw, 
  Database, 
  Lock, 
  ExternalLink, 
  Users, 
  HelpCircle, 
  Trash2, 
  Download, 
  Heart,
  TrendingUp,
  Cpu,
  Layers,
  PhoneCall,
  BellRing,
  Bot,
  Send,
  Terminal,
  Sliders,
  Code
} from 'lucide-react';

export interface HealthAlertCompanionModuleProps {
  setActiveTab: (tab: NavTab) => void;
}

// Default empty intake form
const INITIAL_INTAKE: HealthAlertIntakeData = {
  patientAlias: '',
  age: 32,
  gender: 'Female',
  primaryConcern: '',
  durationDays: 7,
  severityScale: 5,
  vitals: {
    bloodPressure: '',
    restingHeartRate: undefined,
    temperatureC: undefined,
    spo2Percent: undefined
  },
  labs: {
    ferritin: undefined,
    hba1c: undefined,
    egfr: undefined,
    crp: undefined,
    ldl: undefined,
    hemoglobin: undefined
  },
  symptoms: [],
  medications: [],
  allergies: [],
  consentGiven: false,
  deIdentifiedConfirmed: true,
  countryOrRegion: 'Vietnam'
};

export const HealthAlertCompanionModule: React.FC<HealthAlertCompanionModuleProps> = ({ setActiveTab }) => {
  // Navigation & Step State: 'welcome' -> 'intake' -> 'review' -> 'results'
  const [currentStep, setCurrentStep] = useState<'welcome' | 'intake' | 'review' | 'results'>('welcome');
  const [intakeData, setIntakeData] = useState<HealthAlertIntakeData>(INITIAL_INTAKE);
  const [analysisResult, setAnalysisResult] = useState<HealthAlertAnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [presets, setPresets] = useState<any[]>([]);

  // Sub-tabs on results view
  const [resultsSubTab, setResultsSubTab] = useState<'triage' | 'findings' | 'clinician' | 'education' | 'fhir'>('triage');

  // Interaction Mode: 'agent' (Alexa+-style conversational agent with live MCP tools) vs 'guided' (step-by-step form)
  const [activeMode, setActiveMode] = useState<'agent' | 'guided'>('agent');

  // Alexa+ Agent State
  const [agentQuery, setAgentQuery] = useState<string>('');
  const [agentRegion, setAgentRegion] = useState<string>('Vietnam');
  const [agentLoading, setAgentLoading] = useState<boolean>(false);
  const [agentResult, setAgentResult] = useState<any | null>(null);
  const [agentError, setAgentError] = useState<string | null>(null);
  const [showTraceDetails, setShowTraceDetails] = useState<boolean>(true);

  // Conversational Agent Orchestrator Call
  const handleRunAgent = async (queryText?: string) => {
    const q = (queryText !== undefined ? queryText : agentQuery).trim();
    if (!q) return;
    setAgentLoading(true);
    setAgentError(null);
    try {
      const resp = await fetch('/api/health-alert/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, region: agentRegion })
      });
      const data = await resp.json();
      if (data.success) {
        setAgentResult(data);
      } else {
        setAgentError(data.error || 'Agent service could not process query.');
      }
    } catch (err: any) {
      console.error('Agent API error:', err);
      setAgentError('Could not connect to HealthAlert Agent service.');
    } finally {
      setAgentLoading(false);
    }
  };

  const handleResetAgent = () => {
    setAgentQuery('');
    setAgentResult(null);
    setAgentError(null);
  };

  // Load Presets on Mount
  useEffect(() => {
    fetch('/api/health-alert/presets')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.presets) {
          setPresets(data.presets);
        }
      })
      .catch(err => console.warn('Could not load presets:', err));
  }, []);

  // Handle Preset Selection
  const handleApplyPreset = (preset: any) => {
    setIntakeData({
      ...preset.intake,
      consentGiven: true,
      deIdentifiedConfirmed: true
    });
    setAnalysisResult(null);
    setErrorMessage(null);
    setCurrentStep('review');
  };

  // Run Health Alert API Call
  const handleRunAnalysis = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const resp = await fetch('/api/health-alert/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(intakeData)
      });
      const data: HealthAlertAnalysisResponse = await resp.json();
      if (data.success) {
        setAnalysisResult(data);
        setCurrentStep('results');
      } else {
        setErrorMessage((data as any).error || 'HealthAlert Companion service could not process request.');
      }
    } catch (err: any) {
      console.error('Health Alert API error:', err);
      setErrorMessage('Network or server connection error. Please verify the backend service is running.');
    } finally {
      setIsLoading(false);
    }
  };

  // Copy helper
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Clear / Reset intake
  const handleReset = () => {
    if (window.confirm('Reset all entered health details and start a new session?')) {
      setIntakeData(INITIAL_INTAKE);
      setAnalysisResult(null);
      setErrorMessage(null);
      setCurrentStep('welcome');
    }
  };

  // Export session JSON
  const handleExportJson = () => {
    const payload = {
      intake: intakeData,
      analysis: analysisResult,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `healthalert-companion-assessment-${analysisResult?.sessionId || 'draft'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getTriageColor = (tier: HealthAlertTriageTier) => {
    switch (tier) {
      case 'EMERGENT_ESCALATION':
        return {
          bg: 'bg-rose-50',
          text: 'text-rose-800',
          border: 'border-rose-400',
          badge: 'bg-rose-600 text-white',
          alertBox: 'bg-rose-100 border-rose-300 text-rose-950'
        };
      case 'URGENT_EVALUATION':
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-800',
          border: 'border-amber-400',
          badge: 'bg-amber-600 text-white',
          alertBox: 'bg-amber-100 border-amber-300 text-amber-950'
        };
      case 'PLANNED_CLINICAL_ASSESSMENT':
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-800',
          border: 'border-blue-400',
          badge: 'bg-blue-600 text-white',
          alertBox: 'bg-blue-100 border-blue-300 text-blue-950'
        };
      case 'ROUTINE_WELLNESS':
      default:
        return {
          bg: 'bg-emerald-50',
          text: 'text-emerald-800',
          border: 'border-emerald-400',
          badge: 'bg-emerald-600 text-white',
          alertBox: 'bg-emerald-100 border-emerald-300 text-emerald-950'
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Header Banner & Identity */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-8 text-white shadow-xl border border-indigo-900/50">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-400/30">
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              <span>Future Health Challenge 2026</span>
              <span className="text-teal-500">|</span>
              <span className="text-slate-300">Population Health & Anticipatory Sensing</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-300 border border-rose-500/30">
                <BellRing className="w-6 h-6 text-rose-400" />
              </span>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-sans">
                HealthAlert Companion
              </h1>
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-600/60 text-indigo-200 border border-indigo-400/30">
                Clinical Warning Sensing
              </span>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              An evidence-grounded health navigation and warning alert engine within Dr. T. Helping people recognize subtle physiological signals, bound epistemic uncertainty, prepare for professional consultations, and coordinate timely medical appointments.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-300">
              <span className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                HIPAA Safe Harbor De-Identification
              </span>
              <span className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                <Stethoscope className="w-3.5 h-3.5 text-rose-400" />
                Non-Diagnostic Clinical Orientation
              </span>
              <span className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                HL7 FHIR R4 Interoperability
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('bridge')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/20 transition shadow-xs cursor-pointer"
            >
              <Activity className="w-4 h-4 text-teal-300" />
              <span>Dr. T Health Bridge</span>
            </button>
            <button
              onClick={() => setActiveTab('deck')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition shadow-md shadow-indigo-600/30 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Executive Deck & Brief</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mandatory Clinical Safety Notice Banner */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-2xl shadow-xs">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
              Mandatory Clinical Safety Notice
            </h4>
            <p className="text-xs text-amber-800 leading-relaxed">
              HealthAlert Companion is an assistive health navigation and decision-support engine. It does <strong>NOT</strong> provide medical diagnoses, prescribe prescription pharmaceuticals, or substitute for licensed physician care. If you are experiencing sudden severe chest pain, stroke symptoms, or breathing distress, contact emergency medical services immediately (dial 115 in Vietnam, 911 in US/Canada, 112 in Europe, or your local emergency dispatch).
            </p>
          </div>
        </div>
      </div>

      
      {/* Interaction Mode Selector: Alexa+ Agent Experience vs Guided Clinical Intake */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between bg-slate-900/95 backdrop-blur-md p-2.5 rounded-2xl border border-slate-800 shadow-md gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveMode('agent')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeMode === 'agent'
                ? 'bg-gradient-to-r from-rose-500 via-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25 ring-1 ring-white/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Bot className="w-4 h-4 text-rose-300" />
            <span>Alexa+ Agent Experience (Hackathon 2026)</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-rose-500/20 text-rose-200 border border-rose-500/30">MCP Live</span>
          </button>
          <button
            onClick={() => setActiveMode('guided')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeMode === 'guided'
                ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-md shadow-teal-500/25 ring-1 ring-white/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Activity className="w-4 h-4 text-teal-300" />
            <span>Guided Clinical Intake (4-Step Form)</span>
          </button>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 bg-slate-800/80 rounded-xl border border-slate-700 text-[11px] text-slate-300">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>MCP Protocol: <code className="text-cyan-300 font-mono">/api/mcp (2024-11-05)</code></span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* ALEXA+ CONVERSATIONAL AGENT PANEL (AMAZON HACKATHON 2026) */}
      {/* ======================================================== */}
      {activeMode === 'agent' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                  <Bot className="w-3.5 h-3.5 text-rose-600" />
                  <span>Amazon Developer Hackathon 2026 (Alexa+ Track)</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  HealthAlert Companion Conversational Agent
                </h2>
                <p className="text-xs text-slate-600">
                  A tool-using conversational health navigation agent simulated for Alexa+. Evaluates emergency safety rules with strict deterministic precedence, bounding epistemic uncertainty without diagnostic hallucination.
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <span className="text-xs text-slate-500 font-semibold">Emergency Region:</span>
                <select
                  value={agentRegion}
                  onChange={e => setAgentRegion(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Vietnam">Vietnam (115)</option>
                  <option value="UAE">UAE (998)</option>
                  <option value="UK">UK (999)</option>
                  <option value="Europe">Europe (112)</option>
                  <option value="US">US / Canada (911)</option>
                </select>
              </div>
            </div>

            {/* Quick Demonstration Scenarios */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Synthetic Demonstration Scenarios (Click to test live tools)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {[
                  {
                    title: 'Desk Worker Cardiometabolic',
                    badge: 'AHA Stage 1 HTN',
                    query: 'My blood pressure is 138/88 mmHg and my fasting HbA1c is 6.1%. I have afternoon fatigue and occipital headaches.'
                  },
                  {
                    title: 'Runner Subclinical Iron',
                    badge: 'WHO Ferritin < 30',
                    query: '29yo female amateur marathoner with 6-week progressive midday exhaustion, preserved hemoglobin, and serum ferritin of 15 ng/mL.'
                  },
                  {
                    title: 'Crushing Chest Pain',
                    badge: '🚨 Critical Red-Flag',
                    query: 'Sudden substernal crushing chest pressure radiating to left arm with cold sweat and shortness of breath.'
                  },
                  {
                    title: 'Hypertensive Crisis',
                    badge: 'AHA Crisis Invariant',
                    query: 'Severe throbbing occipital headache with home blood pressure reading 185/115 mmHg.'
                  }
                ].map((sc, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setAgentQuery(sc.query);
                      handleRunAgent(sc.query);
                    }}
                    className="p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-300 text-left transition cursor-pointer space-y-1 shadow-2xs group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-700">{sc.title}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200">{sc.badge}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{sc.query}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Conversational Query Box */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-slate-700 block">
                Conversational Health Alert Query:
              </label>
              <div className="relative">
                <textarea
                  rows={3}
                  value={agentQuery}
                  onChange={e => setAgentQuery(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleRunAgent();
                    }
                  }}
                  placeholder="Ask HealthAlert Companion (e.g. 'My blood pressure has been 138/88 and I feel exhausted in the afternoon, what does this mean?')"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-xs text-slate-900 shadow-inner"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>On-device PII scrubbing enabled. Non-diagnostic decision support.</span>
                </div>

                <div className="flex items-center gap-2">
                  {agentResult && (
                    <button
                      onClick={handleResetAgent}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    onClick={() => handleRunAgent()}
                    disabled={agentLoading || !agentQuery.trim()}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-indigo-500/25 transition cursor-pointer"
                  >
                    {agentLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Orchestrating MCP Tools...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Execute Agent Tools</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {agentError && (
                <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{agentError}</span>
                </div>
              )}
            </div>

            {/* Agent Results & Visual Trace */}
            {agentResult && (
              <div className="space-y-6 pt-4 border-t border-slate-200">

                {/* Critical Emergency Banner if Escalated */}
                {agentResult.safetySummary?.isEmergency && (
                  <div className="p-5 rounded-2xl bg-rose-600 text-white shadow-lg space-y-3 animate-pulse">
                    <div className="flex items-center gap-2.5">
                      <AlertTriangle className="w-6 h-6 text-white shrink-0" />
                      <h3 className="text-base font-black uppercase tracking-wider">
                        CRITICAL SAFETY ESCALATION: EMERGENCY WARNING TRIGGERED
                      </h3>
                    </div>
                    <p className="text-xs text-rose-100 leading-relaxed font-medium">
                      {agentResult.safetySummary.actionSummary}
                    </p>
                    <div className="p-3 bg-white/10 rounded-xl border border-white/20 text-xs font-bold flex items-center justify-between">
                      <span>Emergency Directive ({agentResult.safetySummary.localizedEmergency?.regionalTitle}):</span>
                      <span className="px-3 py-1 bg-white text-rose-700 rounded-lg text-sm font-black">
                        CALL {agentResult.safetySummary.localizedEmergency?.ambulanceNumber} NOW
                      </span>
                    </div>
                  </div>
                )}

                {/* Synthesized Response Area */}
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-950 flex items-center gap-2">
                      <Bot className="w-4 h-4 text-indigo-600" />
                      Agent Synthesis & Orientation Response
                    </span>
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                      agentResult.urgencyTier === 'EMERGENT_ESCALATION'
                        ? 'bg-rose-600 text-white'
                        : agentResult.urgencyTier === 'URGENT_EVALUATION'
                        ? 'bg-amber-600 text-white'
                        : 'bg-indigo-600 text-white'
                    }`}>
                      {agentResult.urgencyTier}
                    </span>
                  </div>

                  <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-line font-sans space-y-2">
                    {agentResult.agentResponse}
                  </div>
                </div>

                {/* Visible Tool Execution Trace (Amazon Alexa+ & MCP Requirement) */}
                <div className="p-5 rounded-2xl bg-slate-900 text-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                        Model Context Protocol (MCP) Tool Execution Trace ({agentResult.toolExecutionTrace?.length || 0} Tools)
                      </span>
                    </div>
                    <button
                      onClick={() => setShowTraceDetails(!showTraceDetails)}
                      className="text-[11px] text-cyan-300 hover:text-cyan-100 font-mono underline cursor-pointer"
                    >
                      {showTraceDetails ? 'Collapse Trace' : 'Expand Trace Details'}
                    </button>
                  </div>

                  {showTraceDetails && (
                    <div className="space-y-3 pt-2">
                      {agentResult.toolExecutionTrace?.map((trace: any, idx: number) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-[11px]">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                              <span>[{idx + 1}]</span>
                              <span>tools/call: <strong className="text-white">{trace.toolName}</strong></span>
                            </span>
                            <div className="flex items-center gap-2 text-[10px]">
                              <span className="text-slate-400">{trace.executionTimeMs} ms</span>
                              <span className={`px-2 py-0.5 rounded font-bold uppercase ${
                                trace.status === 'escalated'
                                  ? 'bg-rose-900 text-rose-200 border border-rose-700'
                                  : trace.status === 'fallback'
                                  ? 'bg-amber-900 text-amber-200 border border-amber-700'
                                  : 'bg-emerald-900 text-emerald-200 border border-emerald-700'
                              }`}>
                                {trace.status}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px] text-slate-300">
                            <div className="p-2 rounded bg-slate-900 border border-slate-800/80">
                              <span className="text-slate-400 block mb-1">Input Arguments:</span>
                              <pre className="overflow-x-auto text-[10px] text-teal-300">{JSON.stringify(trace.input, null, 2)}</pre>
                            </div>
                            <div className="p-2 rounded bg-slate-900 border border-slate-800/80">
                              <span className="text-slate-400 block mb-1">Validated Output Payload:</span>
                              <pre className="overflow-x-auto text-[10px] text-indigo-300 max-h-36">{JSON.stringify(trace.output, null, 2)}</pre>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Inference: {agentResult.telemetry?.providerUsed}</span>
                    <span>Total Latency: {agentResult.telemetry?.totalLatencyMs} ms</span>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* GUIDED CLINICAL INTAKE WORKFLOW                        */}
      {/* ======================================================== */}
      {activeMode === "guided" && (
        <>
          {/* Progress Stepper Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between overflow-x-auto text-xs">
        {[
          { id: 'welcome', label: '1. Welcome & Consent' },
          { id: 'intake', label: '2. Guided Intake' },
          { id: 'review', label: '3. Review & Validate' },
          { id: 'results', label: '4. Alerts & Next Steps' },
        ].map((step, idx) => {
          const isCurrent = currentStep === step.id;
          const isCompleted = 
            (step.id === 'welcome' && currentStep !== 'welcome') ||
            (step.id === 'intake' && (currentStep === 'review' || currentStep === 'results')) ||
            (step.id === 'review' && currentStep === 'results');

          return (
            <div key={step.id} className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (isCompleted || isCurrent) setCurrentStep(step.id as any);
                }}
                disabled={!isCompleted && !isCurrent}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold transition ${
                  isCurrent 
                    ? 'bg-indigo-600 text-white shadow-xs' 
                    : isCompleted 
                    ? 'bg-slate-100 text-slate-800 hover:bg-slate-200 cursor-pointer' 
                    : 'text-slate-400 cursor-not-allowed'
                }`}
              >
                {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <span>{idx + 1}.</span>}
                <span>{step.label}</span>
              </button>
              {idx < 3 && <ChevronRight className="w-4 h-4 text-slate-300" />}
            </div>
          );
        })}
      </div>

      {/* Error Display */}
      {errorMessage && (
        <div className="bg-rose-50 border border-rose-300 p-4 rounded-2xl flex items-center justify-between text-xs text-rose-800">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-rose-600 hover:text-rose-800 font-bold">Dismiss</button>
        </div>
      )}

      {/* ======================================================== */}
      {/* STEP 1: WELCOME & INFORMED CONSENT                       */}
      {/* ======================================================== */}
      {currentStep === 'welcome' && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              Welcome to HealthAlert Companion: Early Warning & Symptom Orientation
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Before we begin your health navigation session, please review how HealthAlert Companion handles your information and the purpose of this clinical decision-support tool.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-600" />
                Privacy & Data Minimization
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                All data is analyzed ephemerally or in isolated session state. Direct identifiers (real full names, SSN, street addresses) are strictly prohibited and filtered on-device.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                Evidence-Grounded Alerts
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Findings are checked against peer-reviewed clinical guidelines (AHA, ADA, KDIGO, WHO) with transparent epistemic uncertainty scoring.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-rose-600" />
                Physician Preparation
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generates a structured SBAR handoff note, custom appointment questions, and pre-visit checklists so you can make the most of your in-person medical appointment.
              </p>
            </div>
          </div>

          {/* Synthetic Demo Presets Bar */}
          <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-700" />
                Quick-Start Demonstration Journeys (Synthetic Case Personas)
              </span>
              <span className="text-[10px] bg-white px-2 py-0.5 rounded text-indigo-700 font-semibold border border-indigo-200">
                1-Click Load
              </span>
            </div>
            <p className="text-xs text-slate-600">
              For evaluation and testing without typing personal data, select one of these realistic synthetic clinical cohorts:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {presets.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleApplyPreset(p)}
                  className="p-3 rounded-xl bg-white hover:bg-indigo-100/60 border border-indigo-200 text-left transition shadow-2xs cursor-pointer space-y-1"
                >
                  <span className="text-xs font-bold text-slate-900 block">{p.title}</span>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{p.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Consent Checkbox */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={intakeData.consentGiven}
                onChange={e => setIntakeData({ ...intakeData, consentGiven: e.target.checked })}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-slate-800 leading-relaxed">
                <strong>Informed Consent:</strong> I understand that HealthAlert Companion provides assistive health information and clinical navigation support only. It does not provide formal medical diagnoses or emergency medical treatment. I consent to having the health details I provide evaluated against evidence-based clinical guidelines.
              </span>
            </label>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400">Step 1 of 4: Welcome & Consent</span>
            <button
              onClick={() => {
                if (!intakeData.consentGiven) {
                  alert('Please check the informed consent box before proceeding.');
                  return;
                }
                setCurrentStep('intake');
              }}
              disabled={!intakeData.consentGiven}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition cursor-pointer"
            >
              <span>Begin Guided Intake</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STEP 2: GUIDED HEALTH INTAKE                             */}
      {/* ======================================================== */}
      {currentStep === 'intake' && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Guided Clinical Intake</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Record your symptoms, vitals, and optional laboratory data. All fields validate plausible physiological bounds.
              </p>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-600 font-semibold transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Form</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            
            {/* Left Column: Demographics & Primary Concern */}
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-indigo-700">
                1. Context & Chief Health Concern
              </h3>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Patient Alias / Reference (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Self, Runner-29, Alex-M"
                  value={intakeData.patientAlias || ''}
                  onChange={e => setIntakeData({ ...intakeData, patientAlias: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Age (Years)</label>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={intakeData.age}
                    onChange={e => setIntakeData({ ...intakeData, age: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Biological Sex</label>
                  <select
                    value={intakeData.gender}
                    onChange={e => setIntakeData({ ...intakeData, gender: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Region / Location (For Localized Emergency Guidance)</label>
                <select
                  value={intakeData.countryOrRegion || 'Vietnam'}
                  onChange={e => setIntakeData({ ...intakeData, countryOrRegion: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                >
                  <option value="Vietnam">Vietnam (Emergency Ambulance: 115 / Rescue: 114)</option>
                  <option value="US">United States / Canada (Emergency: 911)</option>
                  <option value="UAE">United Arab Emirates (National Ambulance: 998 / Police: 999)</option>
                  <option value="Europe">Europe / EU (European Emergency: 112)</option>
                  <option value="UK">United Kingdom (Emergency: 999)</option>
                  <option value="International">Other / International Local Emergency</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Primary Health Concern or Symptom *</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Afternoon exhaustion, brain fog around 2:30 PM, or elevated morning blood pressure"
                  value={intakeData.primaryConcern}
                  onChange={e => setIntakeData({ ...intakeData, primaryConcern: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    min={0}
                    value={intakeData.durationDays}
                    onChange={e => setIntakeData({ ...intakeData, durationDays: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Severity Scale (1 - 10)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={intakeData.severityScale}
                      onChange={e => setIntakeData({ ...intakeData, severityScale: parseInt(e.target.value, 10) })}
                      className="w-full accent-indigo-600"
                    />
                    <span className="font-bold text-slate-800 w-6 text-center">{intakeData.severityScale}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Associated Symptoms (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Fatigue, Restless legs, Afternoon cognitive slump"
                  value={intakeData.symptoms.join(', ')}
                  onChange={e => setIntakeData({
                    ...intakeData,
                    symptoms: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Right Column: Vitals & Lab Biomarkers */}
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-indigo-700">
                2. Vitals & Laboratory Values (If Available)
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Blood Pressure (mmHg)</label>
                  <input
                    type="text"
                    placeholder="e.g. 120/80"
                    value={intakeData.vitals.bloodPressure || ''}
                    onChange={e => setIntakeData({
                      ...intakeData,
                      vitals: { ...intakeData.vitals, bloodPressure: e.target.value }
                    })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Resting Heart Rate (bpm)</label>
                  <input
                    type="number"
                    placeholder="e.g. 68"
                    value={intakeData.vitals.restingHeartRate ?? ''}
                    onChange={e => setIntakeData({
                      ...intakeData,
                      vitals: { ...intakeData.vitals, restingHeartRate: e.target.value ? parseInt(e.target.value, 10) : undefined }
                    })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Serum Ferritin (ng/mL)</label>
                  <input
                    type="number"
                    placeholder="Ref: 30 - 200"
                    value={intakeData.labs.ferritin ?? ''}
                    onChange={e => setIntakeData({
                      ...intakeData,
                      labs: { ...intakeData.labs, ferritin: e.target.value ? parseFloat(e.target.value) : undefined }
                    })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">HbA1c (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Ref: < 5.7%"
                    value={intakeData.labs.hba1c ?? ''}
                    onChange={e => setIntakeData({
                      ...intakeData,
                      labs: { ...intakeData.labs, hba1c: e.target.value ? parseFloat(e.target.value) : undefined }
                    })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">eGFR (mL/min/1.73m²)</label>
                  <input
                    type="number"
                    placeholder="Ref: >= 60"
                    value={intakeData.labs.egfr ?? ''}
                    onChange={e => setIntakeData({
                      ...intakeData,
                      labs: { ...intakeData.labs, egfr: e.target.value ? parseFloat(e.target.value) : undefined }
                    })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">LDL-C (mg/dL)</label>
                  <input
                    type="number"
                    placeholder="Ref: < 100"
                    value={intakeData.labs.ldl ?? ''}
                    onChange={e => setIntakeData({
                      ...intakeData,
                      labs: { ...intakeData.labs, ldl: e.target.value ? parseFloat(e.target.value) : undefined }
                    })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Current Medications & Supplements</label>
                <input
                  type="text"
                  placeholder="e.g. Cholecalciferol (Vit D3) 2000 IU, Magnesium"
                  value={intakeData.medications.join(', ')}
                  onChange={e => setIntakeData({
                    ...intakeData,
                    medications: e.target.value.split(',').map(m => m.trim()).filter(Boolean)
                  })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep('welcome')}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Back to Consent
            </button>

            <button
              onClick={() => {
                if (!intakeData.primaryConcern.trim()) {
                  alert('Please enter your primary health concern before reviewing.');
                  return;
                }
                setCurrentStep('review');
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition cursor-pointer"
            >
              <span>Review Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STEP 3: REVIEW & CONFIRM                                 */}
      {/* ======================================================== */}
      {currentStep === 'review' && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-600" />
              Review & Validate Intake Facts
            </h2>
            <p className="text-xs text-slate-500">
              Confirm your supplied facts below. HealthAlert Companion will separate your factual inputs from AI-generated clinical interpretations.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Patient Alias</span>
                <span className="font-bold text-slate-900">{intakeData.patientAlias || 'Anonymous'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Age / Sex</span>
                <span className="font-bold text-slate-900">{intakeData.age}yo • {intakeData.gender}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Duration</span>
                <span className="font-bold text-slate-900">{intakeData.durationDays} days</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Severity</span>
                <span className="font-bold text-indigo-700">{intakeData.severityScale} / 10</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Primary Concern</span>
              <p className="font-medium text-slate-800 text-sm mt-0.5">{intakeData.primaryConcern}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-200/60">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Blood Pressure</span>
                <span className="font-bold text-slate-800">{intakeData.vitals.bloodPressure || 'Unrecorded'}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Resting Heart Rate</span>
                <span className="font-bold text-slate-800">{intakeData.vitals.restingHeartRate ? `${intakeData.vitals.restingHeartRate} bpm` : 'Unrecorded'}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Serum Ferritin</span>
                <span className="font-bold text-slate-800">{intakeData.labs.ferritin !== undefined ? `${intakeData.labs.ferritin} ng/mL` : 'Not on file'}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block">HbA1c</span>
                <span className="font-bold text-slate-800">{intakeData.labs.hba1c !== undefined ? `${intakeData.labs.hba1c}%` : 'Not on file'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setCurrentStep('intake')}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Edit Details
            </button>

            <button
              onClick={handleRunAnalysis}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Evaluating Clinical Warnings...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Execute HealthAlert Companion Evaluation</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STEP 4: HEALTH ALERTS & TRANSPARENCY                     */}
      {/* ======================================================== */}
      {currentStep === 'results' && analysisResult && (
        <div className="space-y-6">
          
          {/* Main Results Card */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-6">
            
            {/* Header: Session & Triage Tier */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase font-mono">
                    Session: {analysisResult.sessionId}
                  </span>
                  <span className="text-[10px] text-slate-300">•</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">
                    HIPAA De-Identified
                  </span>
                </div>
                <h2 className="text-xl font-black text-slate-900">
                  {analysisResult.triageTitle}
                </h2>
              </div>

              {/* Triage Badge */}
              {(() => {
                const colors = getTriageColor(analysisResult.triageTier);
                return (
                  <div className={`px-4 py-2.5 rounded-2xl border flex items-center gap-2.5 ${colors.bg} ${colors.border}`}>
                    <AlertTriangle className={`w-4 h-4 ${colors.text}`} />
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider block text-slate-500">Alert Classification</span>
                      <span className={`text-xs font-black ${colors.text}`}>{analysisResult.triageTier}</span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Emergency Alert Card if Emergent */}
            {analysisResult.triageTier === 'EMERGENT_ESCALATION' && (
              <div className="p-4 rounded-2xl bg-rose-100 border-2 border-rose-400 text-rose-950 flex items-start gap-3 shadow-md">
                <PhoneCall className="w-6 h-6 text-rose-700 shrink-0 mt-0.5 animate-pulse" />
                <div className="space-y-1 text-xs">
                  <h4 className="font-black text-sm text-rose-900 uppercase tracking-wide">
                    Emergency Alert — Call {intakeData.countryOrRegion?.toLowerCase().includes('vi') ? '115 (Vietnam)' : 'Emergency Services (115 in Vietnam / 911 / 112)'} or Seek Immediate Medical Attention
                  </h4>
                  <p className="leading-relaxed">
                    {analysisResult.safetyNotice.emergencyWarning}
                  </p>
                </div>
              </div>
            )}

            {/* Primary Action & Timeline Banner */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs space-y-1 text-indigo-950">
              <span className="font-bold uppercase tracking-wider text-[10px] text-indigo-700 block">Recommended Action & Timeline</span>
              <p className="font-medium text-sm text-slate-900">{analysisResult.actionSummary}</p>
              <div className="flex items-center gap-1.5 text-indigo-800 font-semibold pt-1">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <span>{analysisResult.urgencyTimeline}</span>
              </div>
            </div>

            {/* Metrics Overview: Risk Score, Epistemic Uncertainty, Confidence Interval */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 block">Calculated Alert Risk Score</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-slate-900">{analysisResult.riskScore}%</span>
                  <span className="text-xs text-slate-400">/ 100%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-2">
                  <div 
                    className={`h-full ${analysisResult.riskScore >= 60 ? 'bg-rose-500' : analysisResult.riskScore >= 35 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${analysisResult.riskScore}%` }}
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 block">95% Confidence Interval</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-lg font-bold text-indigo-700">
                    [{analysisResult.uncertainty.confidenceInterval.low}% – {analysisResult.uncertainty.confidenceInterval.high}%]
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 block mt-2">Accounts for measurement variance</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500 block">Epistemic Uncertainty</span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-lg font-bold text-slate-800">{analysisResult.uncertainty.score}</span>
                  <span className="text-[10px] font-semibold text-indigo-600">({analysisResult.uncertainty.level} uncertainty)</span>
                </div>
                <span className="text-[10px] text-slate-500 block mt-2 leading-tight">
                  {analysisResult.uncertainty.explanation}
                </span>
              </div>
            </div>

            {/* Subtab Navigation for Detailed Results */}
            <div className="flex items-center gap-2 border-b border-slate-200 pt-2 pb-2 overflow-x-auto">
              {[
                { id: 'triage', label: 'Clinical Findings', icon: Activity },
                { id: 'clinician', label: 'Clinician SBAR & Questions', icon: Stethoscope },
                { id: 'education', label: 'Personalized Education', icon: FileText },
                { id: 'fhir', label: 'HL7 FHIR Interoperability', icon: Database },
              ].map(sub => {
                const Icon = sub.icon;
                const isActive = resultsSubTab === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setResultsSubTab(sub.id as any)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      isActive 
                        ? 'bg-slate-900 text-white shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{sub.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT 1: Clinical Findings */}
            {resultsSubTab === 'triage' && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Categorized Findings & Guidelines Reference
                </h4>
                <div className="space-y-2.5">
                  {analysisResult.clinicalFindings.map((f, i) => (
                    <div key={i} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 flex items-center gap-2">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200 font-semibold">
                            {f.category}
                          </span>
                          <span>{f.finding}</span>
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          f.clinicalSignificance === 'Critical Red-Flag' ? 'bg-rose-100 text-rose-700' :
                          f.clinicalSignificance === 'Elevated' ? 'bg-amber-100 text-amber-700' :
                          f.clinicalSignificance === 'Borderline' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {f.clinicalSignificance}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">{f.interpretation}</p>
                      {f.guidelineRef && (
                        <span className="text-[10px] text-slate-400 block pt-0.5">
                          Standard: {f.guidelineRef}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: Clinician SBAR & Questions */}
            {resultsSubTab === 'clinician' && (
              <div className="space-y-6">
                {/* SBAR Brief */}
                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3 text-xs text-indigo-950">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold uppercase tracking-wider text-[11px] text-indigo-900 flex items-center gap-1.5">
                      <Stethoscope className="w-4 h-4 text-indigo-700" />
                      SBAR Structured Clinician Handoff Brief
                    </h4>
                    <button
                      onClick={() => handleCopy(JSON.stringify(analysisResult.clinicianPreparation.sbarBrief, null, 2), 'sbar')}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-indigo-700 hover:bg-indigo-100 transition flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'sbar' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy SBAR</span>
                    </button>
                  </div>

                  <div className="space-y-1.5 leading-relaxed">
                    <p><strong>Situation:</strong> {analysisResult.clinicianPreparation.sbarBrief.situation}</p>
                    <p><strong>Background:</strong> {analysisResult.clinicianPreparation.sbarBrief.background}</p>
                    <p><strong>Assessment:</strong> {analysisResult.clinicianPreparation.sbarBrief.assessment}</p>
                    <p><strong>Recommendation:</strong> {analysisResult.clinicianPreparation.sbarBrief.recommendation}</p>
                  </div>
                </div>

                {/* Suggested Questions */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Recommended Questions to Ask Your Doctor
                  </h4>
                  <div className="space-y-2">
                    {analysisResult.clinicianPreparation.suggestedQuestions.map((q) => (
                      <div key={q.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-indigo-700 uppercase">{q.category}</span>
                          <button
                            onClick={() => handleCopy(q.question, q.id)}
                            className="text-[11px] text-slate-400 hover:text-slate-700 flex items-center gap-1 cursor-pointer"
                          >
                            {copiedKey === q.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            <span>Copy</span>
                          </button>
                        </div>
                        <p className="font-semibold text-slate-900">"{q.question}"</p>
                        <p className="text-[11px] text-slate-500">{q.rationale}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Checklist */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Pre-Appointment Action Checklist
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {analysisResult.clinicianPreparation.checklist.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: Personalized Education */}
            {resultsSubTab === 'education' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-900 block text-sm">
                    {analysisResult.personalizedEducation.topic}
                  </span>
                  <p className="text-slate-700 leading-relaxed">
                    {analysisResult.personalizedEducation.plainLanguageSummary}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-2">
                  <span className="font-bold text-indigo-900 block">
                    Underlying Physiological Mechanism
                  </span>
                  <p className="text-slate-600 leading-relaxed">
                    {analysisResult.personalizedEducation.mechanisticExplanation}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="font-bold text-slate-800 block">Important Lifestyle & Safety Caveats:</span>
                  <ul className="space-y-1 text-slate-600">
                    {analysisResult.personalizedEducation.lifestyleCaveats.map((c, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Evidence Sources */}
                <div className="pt-3 border-t border-slate-200 space-y-2">
                  <span className="font-bold text-slate-800 block">Authoritative Clinical Sources:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {analysisResult.evidenceSources.map(ev => (
                      <div key={ev.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 text-[11px]">{ev.source} ({ev.publicationYear})</span>
                          <span className="text-[10px] font-semibold text-indigo-700">{ev.gradeLevel}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 line-clamp-1">{ev.title}</p>
                        <a href={ev.doiOrUrl} target="_blank" rel="noreferrer" className="text-[10px] text-indigo-600 hover:underline flex items-center gap-1">
                          <span>View Guideline Reference</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 4: HL7 FHIR Interoperability */}
            {resultsSubTab === 'fhir' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Standard HL7 FHIR Release 4 RiskAssessment format ready for health system integration.
                  </span>
                  <button
                    onClick={() => handleCopy(JSON.stringify(analysisResult.fhirRiskAssessment, null, 2), 'fhir')}
                    className="px-3 py-1 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition flex items-center gap-1"
                  >
                    {copiedKey === 'fhir' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy FHIR JSON</span>
                  </button>
                </div>
                <div className="bg-slate-950 text-slate-100 p-4 rounded-2xl overflow-x-auto text-[11px] font-mono max-h-72 border border-slate-800">
                  <pre>{JSON.stringify(analysisResult.fhirRiskAssessment, null, 2)}</pre>
                </div>
              </div>
            )}

            {/* Transparency Footer */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
              <span className="flex items-center gap-1">
                <Cpu className="w-3 h-3 text-slate-400" />
                <span>Engine: {analysisResult.telemetry.providerUsed} ({analysisResult.telemetry.latencyMs} ms)</span>
              </span>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={handleExportJson}
                  className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Session JSON</span>
                </button>
                <button
                  onClick={handleReset}
                  className="text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Start New Session</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

        </>
      )}
    </div>
  );
};
