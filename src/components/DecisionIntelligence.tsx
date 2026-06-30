import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Bus, 
  ShieldAlert, 
  Leaf, 
  Activity, 
  Zap, 
  Play, 
  CheckCircle, 
  AlertTriangle, 
  ArrowRight, 
  ArrowUpRight, 
  HelpCircle, 
  Sparkles, 
  Loader2, 
  Plus, 
  Users, 
  Send, 
  MapPin, 
  X, 
  Info,
  ChevronRight,
  Sparkle
} from "lucide-react";

interface KPIData {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  status: "positive" | "negative" | "neutral";
}

interface TrendPoint {
  month: string;
  impactValue: number;
  costIndex: number;
}

interface SimulationResult {
  synopsis: string;
  impactScores: {
    carbon: number;
    mobility: number;
    wellness: number;
    safety: number;
    trust: number;
  };
  kpis: KPIData[];
  recommendations: string[];
  pros: string[];
  cons: string[];
  trendlineData: TrendPoint[];
  isFallback?: boolean;
}

interface QueryResponse {
  answer: string;
  sources: Array<{ title: string; uri: string }>;
  isFallback?: boolean;
}

export function DecisionIntelligence() {
  // Scenario Planner State
  const [domain, setDomain] = useState<string>("mobility");
  const [proposal, setProposal] = useState<string>("Zero-Fare Downtown Electric Shuttle Loop");
  const [problemStatement, setProblemStatement] = useState<string>("Under-served public transit links in the central business district, causing severe congestion and high localized emissions.");
  const [description, setDescription] = useState<string>("Deploy a high-frequency fleet of autonomous electric mini-buses linking the central transit hub, healthcare centers, and business districts. Designed to decrease private vehicle volume by 30%.");
  const [sponsor, setSponsor] = useState<string>("City Council");
  
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationStep, setSimulationStep] = useState<string>("");
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  // Active hover point in the interactive chart
  const [hoveredPointIdx, setHoveredPointIdx] = useState<number | null>(null);

  // Query Hub State
  const [citizenQuery, setCitizenQuery] = useState<string>("");
  const [isQuerying, setIsQuerying] = useState<boolean>(false);
  const [queryResponse, setQueryResponse] = useState<QueryResponse | null>(null);

  // Workflow Automation Simulator Modal
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null);
  const [activeWorkflowLogs, setActiveWorkflowLogs] = useState<string[]>([]);
  const [isWorkflowRunning, setIsWorkflowRunning] = useState<boolean>(false);

  // Presets
  const presets = [
    {
      domain: "mobility",
      title: "Zero-Fare Downtown Electric Shuttle Loop",
      problem: "Under-served public transit links in the central business district, causing severe congestion and high localized emissions.",
      desc: "Deploy a high-frequency fleet of autonomous electric mini-buses linking the central transit hub, healthcare centers, and business districts. Designed to decrease private vehicle volume by 30%.",
      sponsor: "City Council"
    },
    {
      domain: "sustainability",
      title: "Solar-Powered Emergency Microgrid Network",
      problem: "Vulnerability of the central electrical grid to extreme weather events, leading to complete blackouts in community centers.",
      desc: "Establish decentralised solar panel + battery arrays on public community halls to secure backup energy, wireless communication hubs, and cooling centers during regional grid outages.",
      sponsor: "Citizen Coalition"
    },
    {
      domain: "wellness",
      title: "Automated IoT Waste & Resource Circularity",
      problem: "Extremely low municipal sorting compliance leading to organic waste rotting in general landfills and high methane emissions.",
      desc: "Install optical-sorting community recycling points with real-time fullness alarms and an associated mobile incentive wallet to gamify citizen composting.",
      sponsor: "Public Health Agency"
    }
  ];

  const domainConfig = {
    mobility: { label: "Urban Mobility & Transit", color: "text-blue-600 bg-blue-50 border-blue-200", icon: Bus },
    safety: { label: "Public Safety & Emergency", color: "text-rose-600 bg-rose-50 border-rose-200", icon: ShieldAlert },
    sustainability: { label: "Environmental & Climate", color: "text-emerald-600 bg-emerald-50 border-emerald-200", icon: Leaf },
    wellness: { label: "Healthcare & Well-being", color: "text-indigo-600 bg-indigo-50 border-indigo-200", icon: Activity },
    energy: { label: "Smart Energy & Grid", color: "text-amber-600 bg-amber-50 border-amber-200", icon: Zap }
  };

  // Domain Presets Map for target civic domain selection
  const domainPresets: Record<string, { title: string; desc: string; problem: string; sponsor: string }> = {
    mobility: {
      title: "Zero-Fare Downtown Electric Shuttle Loop",
      desc: "Deploy a high-frequency fleet of autonomous electric mini-buses linking the central transit hub, healthcare centers, and business districts. Designed to decrease private vehicle volume by 30%.",
      problem: "Under-served public transit links in the central business district, causing severe congestion and high localized emissions.",
      sponsor: "City Council"
    },
    safety: {
      title: "Acoustic Shot-Detection & Emergency Response Hubs",
      desc: "Integrate decentralized acoustic sensors with AI dispatch to automatically route emergency services and notify local community wardens during safety incidents, reducing dispatch delays.",
      problem: "Delayed emergency service response times and lack of localized wardens during high-stress public safety incidents.",
      sponsor: "Citizen Coalition"
    },
    sustainability: {
      title: "Solar-Powered Emergency Microgrid Network",
      desc: "Establish decentralised solar panel + battery arrays on public community halls to secure backup energy, wireless communication hubs, and cooling centers during regional grid outages.",
      problem: "Vulnerability of the central electrical grid to extreme weather events, leading to complete blackouts in community centers.",
      sponsor: "Citizen Coalition"
    },
    wellness: {
      title: "Automated IoT Waste & Resource Circularity",
      desc: "Install optical-sorting community recycling points with real-time fullness alarms and an associated mobile incentive wallet to gamify citizen composting.",
      problem: "Extremely low municipal sorting compliance leading to organic waste rotting in general landfills and high methane emissions.",
      sponsor: "Public Health Agency"
    },
    energy: {
      title: "Intelligent Dynamic Building Grid Balancing",
      desc: "Connect public municipal administrative buildings to a predictive load balancing network that automatically lowers HVAC consumption during extreme grid demand hours.",
      problem: "Surging peak-hour HVAC demand in administrative structures threatening neighborhood grid stability and raising cost indices.",
      sponsor: "Private Developer"
    }
  };

  const loadPreset = (preset: typeof presets[0]) => {
    setDomain(preset.domain);
    setProposal(preset.title);
    setProblemStatement(preset.problem);
    setDescription(preset.desc);
    setSponsor(preset.sponsor);
    handleSimulate(preset.domain, preset.title, preset.problem, preset.desc, preset.sponsor);
  };

  const handleSimulate = async (
    overrideDomain?: string,
    overrideProposal?: string,
    overrideProblem?: string,
    overrideDesc?: string,
    overrideSponsor?: string
  ) => {
    const activeDomain = overrideDomain !== undefined ? overrideDomain : domain;
    const activeProposal = overrideProposal !== undefined ? overrideProposal : proposal;
    const activeProblem = overrideProblem !== undefined ? overrideProblem : problemStatement;
    const activeDesc = overrideDesc !== undefined ? overrideDesc : description;
    const activeSponsor = overrideSponsor !== undefined ? overrideSponsor : sponsor;

    if (!activeProposal.trim()) return;

    setIsSimulating(true);
    setSimulationResult(null);

    // Simulated step-by-step progress for high visual craft
    const steps = [
      "Gathering municipal spatial parameters...",
      "Mapping local grid & traffic congestion corridors...",
      "Invoking multi-criteria forecasting algorithms via Gemini...",
      "Calculating carbon displacement & social well-being multipliers...",
      "Structuring Socratic strategic guidelines..."
    ];

    for (let i = 0; i < steps.length; i++) {
      setSimulationStep(steps[i]);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    try {
      const res = await fetch("/api/decision/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: activeDomain,
          proposal: activeProposal,
          problemStatement: activeProblem,
          description: activeDesc,
          sponsor: activeSponsor
        })
      });
      if (res.ok) {
        const data = await res.json();
        setSimulationResult(data);
        return data;
      } else {
        throw new Error("Simulation endpoint returned non-OK status");
      }
    } catch (err) {
      console.error("Simulation failed, rendering fallback result:", err);
    } finally {
      setIsSimulating(false);
    }
  };

  React.useEffect(() => {
    handleSimulate(domain, proposal, problemStatement, description, sponsor);
  }, []);

  const handleQuery = async (presetText?: string) => {
    const textToSend = presetText || citizenQuery;
    if (!textToSend.trim()) return;

    setIsQuerying(true);
    setQueryResponse(null);
    setCitizenQuery(textToSend);

    try {
      let currentContext = simulationResult;
      let activeDomain = domain;

      if (presetText) {
        let targetDomainKey: string | null = null;
        if (presetText.toLowerCase().includes("traffic") || presetText.toLowerCase().includes("transit") || presetText.toLowerCase().includes("delay") || presetText.toLowerCase().includes("bus")) {
          targetDomainKey = "mobility";
        } else if (presetText.toLowerCase().includes("waste") || presetText.toLowerCase().includes("bin") || presetText.toLowerCase().includes("recycling") || presetText.toLowerCase().includes("compliance")) {
          targetDomainKey = "wellness";
        } else if (presetText.toLowerCase().includes("microgrid") || presetText.toLowerCase().includes("resiliency") || presetText.toLowerCase().includes("storm") || presetText.toLowerCase().includes("failure")) {
          targetDomainKey = "sustainability";
        }

        if (targetDomainKey) {
          const p = domainPresets[targetDomainKey];
          if (p) {
            setDomain(targetDomainKey);
            setProposal(p.title);
            setProblemStatement(p.problem);
            setDescription(p.desc);
            setSponsor(p.sponsor);
            activeDomain = targetDomainKey;

            // Trigger simulation and wait for it
            const simData = await handleSimulate(targetDomainKey, p.title, p.problem, p.desc, p.sponsor);
            if (simData) {
              currentContext = simData;
            }
          }
        }
      }

      const res = await fetch("/api/decision/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: textToSend, domain: activeDomain, contextData: currentContext || {} })
      });
      if (res.ok) {
        const data = await res.json();
        setQueryResponse(data);
      } else {
        throw new Error("Query endpoint failed");
      }
    } catch (err) {
      console.error("Query failed, rendering fallback response:", err);
    } finally {
      setIsQuerying(false);
    }
  };

  const triggerWorkflowSimulation = (name: string) => {
    setSelectedWorkflow(name);
    setActiveWorkflowLogs([]);
    setIsWorkflowRunning(true);

    const logStatements = [
      "Initializing AI Automation Workflow agent...",
      `Binding target API proxies to the ${domainConfig[domain as keyof typeof domainConfig]?.label || "Urban"} API gateways.`,
      "Verifying device authorization signatures on remote nodes...",
      "Syncing telemetry channels (InfluxDB & standard webhooks)...",
      "Deploying Docker container overlay on nearest municipal edge cluster.",
      "Workflow configuration loaded. Launch successful!",
      "SYSTEM STATUS: ONLINE. Listening for microgrid sensor trigger events..."
    ];

    let logIndex = 0;
    const interval = setInterval(() => {
      if (logIndex < logStatements.length) {
        setActiveWorkflowLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${logStatements[logIndex]}`]);
        logIndex++;
      } else {
        clearInterval(interval);
        setIsWorkflowRunning(false);
      }
    }, 900);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-10" id="decision-platform-container">
      
      {/* Top Welcome Title Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-rose-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-stone-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-2xl -ml-20 -mb-2 pointer-events-none"></div>
        
        <div className="relative z-10 space-y-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-rose-500/20 text-rose-300 border border-rose-500/35 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            Decision Intelligence Platform
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight leading-tight">
            Multi-Criteria Community Simulation &amp; Automation Engine
          </h2>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Translate complex civic, transport, sustainability, and clinical datasets into highly structured 
            forecast models, strategic recommendations, and automated workflows. Powered by Google Cloud Vertex AI (Gemini 3.5) &amp; NVIDIA NIM.
          </p>
        </div>
      </div>

      {/* Grid Layout: Scenario Planner vs Results Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 5 Columns: Scenario Policy Builder */}
        <div className="lg:col-span-5 bg-white border border-stone-200/80 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div>
              <h3 className="font-sans font-bold text-stone-900 text-base">Policy Scenario Planner</h3>
              <p className="text-stone-400 text-xs font-mono">Configure policy proposals &amp; stakeholders</p>
            </div>
          </div>

          {/* Preset Scenarios Quick Loader */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500 font-bold block">
              Load Preset Civic Scenarios:
            </span>
            <div className="grid grid-cols-1 gap-2">
              {presets.map((preset, idx) => {
                const iconMap = domainConfig[preset.domain as keyof typeof domainConfig]?.icon || Bus;
                const Icon = iconMap;
                return (
                  <button
                    key={idx}
                    onClick={() => loadPreset(preset)}
                    className="flex items-start text-left p-2.5 rounded-xl border border-stone-100 bg-stone-50 hover:bg-stone-100/75 hover:border-stone-200 transition-all text-xs cursor-pointer group"
                  >
                    <div className="p-1.5 rounded-lg bg-white border border-stone-200 text-stone-600 mr-2.5 shrink-0 group-hover:text-rose-600 transition-colors">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="font-bold text-stone-850 line-clamp-1">{preset.title}</p>
                      <p className="text-stone-500 text-[10px] line-clamp-1 leading-snug">{preset.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4 pt-2">
            
            {/* Domain Picker */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-stone-500 font-bold block">
                Target Civic Domain:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(domainConfig).map(([key, config]) => {
                  const Icon = config.icon;
                  const isSelected = domain === key;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setDomain(key);
                        const p = domainPresets[key];
                        if (p) {
                          setProposal(p.title);
                          setProblemStatement(p.problem);
                          setDescription(p.desc);
                          setSponsor(p.sponsor);
                          handleSimulate(key, p.title, p.problem, p.desc, p.sponsor);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-all
                        ${isSelected 
                          ? "bg-stone-900 border-stone-900 text-white shadow-xs" 
                          : "bg-white border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-50"
                        }
                      `}
                    >
                      <Icon className="w-3 h-3" />
                      {config.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Proposal Title */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-stone-500 font-bold block">
                Proposal Title:
              </label>
              <input
                type="text"
                value={proposal}
                onChange={(e) => setProposal(e.target.value)}
                placeholder="e.g., Solar-Integrated Green Bus Shelters"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:border-stone-400 font-medium text-stone-800"
              />
            </div>

            {/* Problem Statement */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-stone-500 font-bold block">
                Problem Statement:
              </label>
              <textarea
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                placeholder="Detail the core issue, municipal friction, or structural deficiency that this proposal addresses..."
                rows={3}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:border-stone-400 font-medium text-stone-850 leading-relaxed resize-none"
              />
            </div>

            {/* Detailed Description */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-stone-500 font-bold block">
                Detailed Description &amp; Objectives:
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detail the operational logistics, physical assets, community impact goals, and anticipated capital expenditure..."
                rows={4}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:border-stone-400 font-medium text-stone-850 leading-relaxed resize-none"
              />
            </div>

            {/* Sponsor Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-stone-500 font-bold block">
                Sponsoring Stakeholder:
              </label>
              <select
                value={sponsor}
                onChange={(e) => setSponsor(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:border-stone-400 font-bold text-stone-800 cursor-pointer"
              >
                <option value="Citizen Coalition">Citizen Coalition &amp; Neighborhood Board</option>
                <option value="City Council">City Council &amp; Municipal Planners</option>
                <option value="Public Health Agency">Regional Public Health Agency</option>
                <option value="Private Developer">Private-Public Technology Partner</option>
              </select>
            </div>

            {/* Submit Action Button */}
            <button
              onClick={handleSimulate}
              disabled={isSimulating || !proposal.trim()}
              className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs
                ${!proposal.trim()
                  ? "bg-stone-100 border border-stone-200 text-stone-400 cursor-not-allowed"
                  : isSimulating
                  ? "bg-rose-50 text-rose-700 border border-rose-200 cursor-wait"
                  : "bg-rose-600 hover:bg-rose-700 text-white font-black"
                }
              `}
            >
              {isSimulating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Calculating Models...
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Generate Multi-Criteria Simulation
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right 7 Columns: Simulation Forecast Results */}
        <div className="lg:col-span-7 bg-stone-50 border border-stone-200/60 rounded-2xl p-6 min-h-[500px] flex flex-col justify-between shadow-xs">
          
          <AnimatePresence mode="wait">
            
            {/* Case A: Is Simulating (Loading Screens) */}
            {isSimulating && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="flex-1 flex flex-col items-center justify-center py-12 text-center space-y-6"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-rose-100 border-t-rose-600 animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-rose-600">
                    <Sparkle className="w-6 h-6 animate-pulse" />
                  </div>
                </div>
                <div className="space-y-2 max-w-sm">
                  <h4 className="font-display font-black text-stone-850 text-lg">Dr. T Decision Model Engine</h4>
                  <p className="text-stone-500 text-xs font-mono animate-pulse min-h-[32px] px-4">
                    {simulationStep}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Case B: Welcome Prompt State (No Result Yet) */}
            {!isSimulating && !simulationResult && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center text-center py-12 space-y-4 max-w-md mx-auto"
              >
                <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shadow-xs">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-sans font-extrabold text-stone-900 text-base">Prediction Stage Ready</h4>
                  <p className="text-stone-500 text-xs leading-relaxed">
                    Select a preset civic scenario or fill in your custom municipal proposal, then click 
                    <strong className="text-stone-800"> "Generate Multi-Criteria Simulation"</strong> to deploy Gemini predictive agents.
                  </p>
                </div>
                <div className="p-3.5 bg-amber-50/70 border border-amber-200/50 rounded-2xl text-[11px] text-amber-800 text-left space-y-1 leading-relaxed">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    Interactive Forecasting
                  </div>
                  <p>
                    Dr. T simulates 5 critical indicator metrics (Carbon, Mobility, Wellness, Safety, and Trust) 
                    and renders an interactive 6-month budget-vs-social impact trendline.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Case C: Simulation Complete, Display Dashboard */}
            {!isSimulating && simulationResult && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 flex-1"
              >
                {/* Header Badge */}
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <h4 className="font-display font-black text-stone-900 text-sm">
                      Simulation Analytics: <span className="font-sans font-bold text-stone-500 text-xs">{proposal}</span>
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono bg-stone-200 text-stone-700 px-2.5 py-0.5 rounded-md font-bold">
                    {simulationResult.isFallback ? "Deterministic Engine" : "Gemini 3.5 Flash"}
                  </span>
                </div>

                {/* Synopsis Narrative Card */}
                <div className="bg-white border border-stone-200 p-4 rounded-xl shadow-xs space-y-2">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-stone-400 font-extrabold block">
                    Synthesized Executive Synopsis
                  </span>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    {simulationResult.synopsis}
                  </p>
                </div>

                {/* Core Impact Indicators Gauges */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {[
                    { label: "Carbon Saved", value: `${simulationResult.impactScores.carbon} kg`, key: "carbon" },
                    { label: "Mobility Delta", value: `${simulationResult.impactScores.mobility >= 0 ? "+" : ""}${simulationResult.impactScores.mobility}%`, key: "mobility" },
                    { label: "Wellness Index", value: `${simulationResult.impactScores.wellness >= 0 ? "+" : ""}${simulationResult.impactScores.wellness}%`, key: "wellness" },
                    { label: "Safety Delta", value: `${simulationResult.impactScores.safety >= 0 ? "+" : ""}${simulationResult.impactScores.safety}%`, key: "safety" },
                    { label: "Public Trust", value: `${simulationResult.impactScores.trust >= 0 ? "+" : ""}${simulationResult.impactScores.trust}%`, key: "trust" }
                  ].map((score, i) => {
                    const numVal = parseInt(score.value) || 0;
                    const isPositive = numVal >= 0;
                    return (
                      <div key={i} className="bg-white border border-stone-200 p-2.5 rounded-xl text-center shadow-xs flex flex-col justify-between">
                        <span className="text-[10px] text-stone-500 font-medium block leading-tight">{score.label}</span>
                        <p className={`text-base font-black tracking-tight mt-1 ${isPositive ? "text-emerald-700" : "text-rose-600"}`}>
                          {score.value}
                        </p>
                        <div className="w-full bg-stone-100 h-1 rounded-full overflow-hidden mt-1.5">
                          <div 
                            className={`h-full ${isPositive ? "bg-emerald-500" : "bg-rose-500"}`} 
                            style={{ width: `${Math.min(100, Math.max(10, Math.abs(numVal)))}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Interactive SVG Trend Chart */}
                <div className="bg-white border border-stone-200 p-4 rounded-xl shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-mono uppercase tracking-widest text-stone-400 font-extrabold block">
                        Interactive 6-Month Projection Chart
                      </span>
                      <h5 className="font-sans font-bold text-stone-850 text-xs">
                        Social Impact Index vs implementation Cost Index
                      </h5>
                    </div>
                    {/* Legend */}
                    <div className="flex items-center gap-3 text-[10px] font-mono font-bold">
                      <div className="flex items-center gap-1">
                        <span className="w-2.5 h-1 bg-rose-500 inline-block rounded-xs"></span>
                        <span className="text-stone-500">Impact</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2.5 h-1 bg-zinc-400 inline-block rounded-xs"></span>
                        <span className="text-stone-500 font-bold">Cost</span>
                      </div>
                    </div>
                  </div>

                  {/* SVG Chart Drawing */}
                  <div className="relative pt-1">
                    <svg className="w-full h-36 overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="none">
                      <g className="opacity-15">
                        <line x1="0" y1="20" x2="500" y2="20" stroke="#78716c" strokeWidth="1" strokeDasharray="3 3" />
                        <line x1="0" y1="60" x2="500" y2="60" stroke="#78716c" strokeWidth="1" strokeDasharray="3 3" />
                        <line x1="0" y1="100" x2="500" y2="100" stroke="#78716c" strokeWidth="1" strokeDasharray="3 3" />
                      </g>

                      {/* Line paths */}
                      {(() => {
                        const pointsCount = simulationResult.trendlineData.length;
                        const spacing = 500 / (pointsCount - 1);
                        
                        // Construct SVG polyline path for Impact (0 to 100 max mapped to 110 to 10 height)
                        const impactPoints = simulationResult.trendlineData.map((pt, index) => {
                          const x = index * spacing;
                          const y = 110 - (pt.impactValue / 100) * 100;
                          return `${x},${y}`;
                        }).join(" ");

                        // Construct Cost line
                        const costPoints = simulationResult.trendlineData.map((pt, index) => {
                          const x = index * spacing;
                          const y = 110 - (pt.costIndex / 100) * 100;
                          return `${x},${y}`;
                        }).join(" ");

                        // Area fill under Impact
                        const areaPoints = `0,110 ${impactPoints} 500,110`;

                        return (
                          <>
                            {/* Area fill */}
                            <polygon points={areaPoints} fill="url(#impactGrad)" opacity="0.08" />

                            {/* Lines */}
                            <polyline points={impactPoints} fill="none" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            <polyline points={costPoints} fill="none" stroke="#71717a" strokeWidth="2" strokeDasharray="4 2" strokeLinecap="round" strokeLinejoin="round" />

                            {/* Circular Hover nodes */}
                            {simulationResult.trendlineData.map((pt, index) => {
                              const x = index * spacing;
                              const yImpact = 110 - (pt.impactValue / 100) * 100;
                              const isHovered = hoveredPointIdx === index;
                              return (
                                <g 
                                  key={index} 
                                  className="cursor-pointer" 
                                  onMouseEnter={() => setHoveredPointIdx(index)}
                                  onMouseLeave={() => setHoveredPointIdx(null)}
                                >
                                  <circle 
                                    cx={x} 
                                    cy={yImpact} 
                                    r={isHovered ? 5.5 : 3.5} 
                                    fill="#e11d48" 
                                    stroke="#ffffff" 
                                    strokeWidth="1.5" 
                                    className="transition-all duration-200"
                                  />
                                  {/* Label text for months on bottom */}
                                  <text x={x} y="118" textAnchor="middle" fill="#78716c" className="text-[8px] font-mono font-bold">
                                    {pt.month}
                                  </text>
                                </g>
                              );
                            })}

                            <defs>
                              <linearGradient id="impactGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#e11d48" />
                                <stop offset="100%" stopColor="#ffffff" />
                              </linearGradient>
                            </defs>
                          </>
                        );
                      })()}
                    </svg>

                    {/* Interactive Value Tooltip Box */}
                    <div className="min-h-[22px] flex items-center justify-center bg-stone-50 border border-stone-200 rounded-lg p-1.5 mt-2.5">
                      <p className="text-[10px] font-mono text-stone-600 text-center w-full">
                        {hoveredPointIdx !== null ? (
                          <span>
                            <strong className="text-stone-850 font-bold">{simulationResult.trendlineData[hoveredPointIdx].month}:</strong> Impact Index: 
                            <strong className="text-rose-600 font-extrabold"> {simulationResult.trendlineData[hoveredPointIdx].impactValue}/100</strong> | Cost Index: 
                            <strong className="text-stone-700 font-extrabold"> {simulationResult.trendlineData[hoveredPointIdx].costIndex}/100</strong>
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-1">
                            <Info className="w-3 h-3 text-stone-400" />
                            Hover over any circle node to read dynamic projected calculations
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recommendations and Pros & Cons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Strategic Socratic Guidelines */}
                  <div className="bg-white border border-stone-200 p-4 rounded-xl shadow-xs space-y-3">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-stone-400 font-extrabold block">
                      Strategic Action Guidelines
                    </span>
                    <ul className="space-y-2">
                      {simulationResult.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-stone-700">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pros & Cons Balancer */}
                  <div className="bg-white border border-stone-200 p-4 rounded-xl shadow-xs space-y-3">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-stone-400 font-extrabold block">
                      Risk Balancer Scoreboard
                    </span>
                    <div className="grid grid-cols-2 gap-3.5 text-[11px] leading-relaxed">
                      <div className="space-y-1.5">
                        <span className="font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-sm uppercase tracking-wide text-[9px] block">
                          Pros &amp; Opportunities
                        </span>
                        <ul className="space-y-1 text-stone-600 font-medium">
                          {simulationResult.pros.map((pro, idx) => (
                            <li key={idx} className="list-disc list-inside text-[10px] pl-1">{pro}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-1.5">
                        <span className="font-bold text-rose-800 bg-rose-50 px-1.5 py-0.5 rounded-sm uppercase tracking-wide text-[9px] block">
                          Cons &amp; Impediments
                        </span>
                        <ul className="space-y-1 text-stone-600 font-medium">
                          {simulationResult.cons.map((con, idx) => (
                            <li key={idx} className="list-disc list-inside text-[10px] pl-1">{con}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Dynamic Automation Trigger */}
                <div className="bg-rose-50/50 border border-rose-200/50 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                  <div className="space-y-1 text-center sm:text-left">
                    <span className="text-[10px] font-mono bg-rose-200/60 text-rose-850 px-2 py-0.5 rounded-md font-bold inline-block">
                      INTELLIGENT WORKFLOW DISPATCH
                    </span>
                    <p className="text-xs font-bold text-stone-950">
                      Deploy RPA &amp; IoT automation scripts for this policy simulation.
                    </p>
                  </div>
                  <button
                    onClick={() => triggerWorkflowSimulation(proposal)}
                    className="p-2 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs cursor-pointer flex items-center gap-1.5 whitespace-nowrap transition-all shadow-sm"
                  >
                    <span>🤖</span> Deploy Automation Workflow
                  </button>
                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

      {/* Interactive Citizen Ask Q&A Analytics Hub */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <div>
              <h3 className="font-sans font-extrabold text-stone-900 text-base">Citizen Q&amp;A Analytics Room</h3>
              <p className="text-stone-400 text-xs font-mono">Ask questions, verify datasets, and discover sources</p>
            </div>
          </div>
          <span className="text-[10px] text-stone-500 font-mono bg-stone-100 px-3 py-1 rounded-full font-bold">
            Grounding Tools Enabled • Search &amp; Maps
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Ask Prompt Panel */}
          <div className="md:col-span-5 space-y-4">
            <p className="text-xs text-stone-600 leading-relaxed">
              Inquire about transit adjustments, waste circularity parameters, or emergency microgrid allocations. 
              Our Decision Agent uses Search Grounding to verify actual research guidelines and public metrics.
            </p>

            {/* Curated Q&A Presets */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 font-bold block">
                Click Curated Citizen Questions:
              </span>
              <div className="flex flex-col gap-2">
                {[
                  "What is the expected reduction in peak traffic delay from regional bus lane prioritization?",
                  "How do we configure optic-sorting community waste bins for maximal compliance?",
                  "What parameters ensure community microgrid resiliency during storm grid failures?"
                ].map((txt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuery(txt)}
                    className="text-left text-xs text-stone-600 hover:text-stone-900 bg-stone-50 hover:bg-stone-100/80 border border-stone-200/60 rounded-xl p-2.5 font-medium transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <ChevronRight className="w-3 h-3 text-stone-400 shrink-0" />
                    <span className="line-clamp-2">{txt}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Query Input Area */}
            <div className="relative pt-2">
              <textarea
                value={citizenQuery}
                onChange={(e) => setCitizenQuery(e.target.value)}
                placeholder="Ask about sustainable transit loop details..."
                rows={2}
                className="w-full bg-stone-50 border border-stone-200 rounded-2xl pl-4 pr-12 py-3 text-xs focus:bg-white focus:outline-none focus:border-stone-400 font-medium text-stone-850 leading-relaxed resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleQuery();
                  }
                }}
              />
              <button
                onClick={() => handleQuery()}
                disabled={isQuerying || !citizenQuery.trim()}
                className={`absolute right-3.5 bottom-4 w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer
                  ${!citizenQuery.trim()
                    ? "bg-stone-100 text-stone-300"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }
                `}
              >
                {isQuerying ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Q&A Response Output Panel */}
          <div className="md:col-span-7 bg-stone-50 border border-stone-200/60 rounded-2xl p-5 min-h-[220px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              
              {isQuerying && (
                <motion.div
                  key="loading-query"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center py-8 text-center space-y-3"
                >
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                  <p className="text-stone-500 text-xs font-mono animate-pulse">
                    Querying municipal datasets and verifying web indicators...
                  </p>
                </motion.div>
              )}

              {!isQuerying && !queryResponse && (
                <motion.div
                  key="welcome-query"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center text-center py-8 space-y-2 max-w-sm mx-auto"
                >
                  <HelpCircle className="w-8 h-8 text-indigo-400 animate-pulse" />
                  <p className="text-xs text-stone-500 font-medium">
                    Response panel is empty. Type your specific civic question on the left side or trigger a preset button.
                  </p>
                </motion.div>
              )}

              {!isQuerying && queryResponse && (
                <motion.div
                  key="answer"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 flex-1 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-indigo-500 font-extrabold block">
                      Decision Assistant Response
                    </span>
                    <p className="text-xs text-stone-800 leading-relaxed whitespace-pre-line font-medium">
                      {queryResponse.answer}
                    </p>
                  </div>

                  {/* Citation Sources */}
                  {queryResponse.sources && queryResponse.sources.length > 0 && (
                    <div className="border-t border-stone-200 pt-3 mt-2">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-stone-400 font-extrabold block mb-2">
                        Grounded Sources &amp; Public References:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {queryResponse.sources.map((src, i) => (
                          <a
                            key={i}
                            href={src.uri}
                            target="_blank"
                            referrerPolicy="no-referrer"
                            className="inline-flex items-center gap-1 bg-white hover:bg-stone-100 border border-stone-200 px-2.5 py-1 rounded-lg text-[10px] text-stone-600 hover:text-stone-900 transition-all font-bold"
                          >
                            <MapPin className="w-2.5 h-2.5 text-indigo-500" />
                            {src.title}
                            <ArrowUpRight className="w-2.5 h-2.5 text-stone-400" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* Workflow Simulation Modal Popup */}
      <AnimatePresence>
        {selectedWorkflow && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-stone-900 border border-stone-800 rounded-3xl p-6 text-stone-100 shadow-2xl relative overflow-hidden"
              id="workflow-modal"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedWorkflow(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center hover:bg-stone-700 text-stone-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-bold uppercase tracking-widest">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                    Workflow Deployment Terminal
                  </div>
                  <h4 className="font-display font-black text-white text-base">
                    Executing Policy Script: {selectedWorkflow}
                  </h4>
                </div>

                {/* Console logs output */}
                <div className="bg-stone-950 border border-stone-800 rounded-xl p-4 h-56 font-mono text-[10px] text-stone-300 overflow-y-auto space-y-2 scrollbar-thin">
                  {activeWorkflowLogs.map((log, i) => (
                    <div key={i} className="leading-relaxed border-l-2 border-rose-500/30 pl-2">
                      {log}
                    </div>
                  ))}
                  {isWorkflowRunning && (
                    <div className="flex items-center gap-1 text-rose-400 animate-pulse font-bold">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Dispatching agents...
                    </div>
                  )}
                  {!isWorkflowRunning && activeWorkflowLogs.length > 0 && (
                    <div className="text-emerald-400 font-bold flex items-center gap-1 pt-1.5">
                      <CheckCircle className="w-3.5 h-3.5" />
                      DEPLOYMENT SUCCESSFUL. All systems operational.
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setSelectedWorkflow(null)}
                    disabled={isWorkflowRunning}
                    className={`p-2 px-5 rounded-xl font-bold text-xs cursor-pointer transition-all
                      ${isWorkflowRunning 
                        ? "bg-stone-800 text-stone-500 cursor-not-allowed" 
                        : "bg-rose-600 text-white hover:bg-rose-700 font-black"
                      }
                    `}
                  >
                    {isWorkflowRunning ? "Processing..." : "Close Terminal"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
