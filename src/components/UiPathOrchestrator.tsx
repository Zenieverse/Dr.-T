import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Cpu, 
  Layers, 
  Settings, 
  Database, 
  Activity, 
  CheckCircle, 
  RefreshCw, 
  Sliders, 
  FileText, 
  Terminal, 
  AlertTriangle, 
  Sparkles, 
  Zap, 
  ArrowRight,
  Tablet,
  Pocket,
  Clock,
  ExternalLink,
  Milestone,
  Server,
  Network,
  Compass,
  GitBranch,
  Shield,
  Key,
  Check,
  CheckCircle2
} from 'lucide-react';

interface UiPathOrchestratorProps {
  onUnlockAchievement?: (id: string) => void;
}

export function UiPathOrchestrator({ onUnlockAchievement }: UiPathOrchestratorProps) {
  const [selectedUseCase, setSelectedUseCase] = useState<'intake' | 'wearable' | 'alerts' | 'pharmacy'>('intake');
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPatient, setSelectedPatient] = useState('Raymond Vance');
  const [targetSystem, setTargetSystem] = useState<'Epic' | 'Cerner' | 'FHIR Local'>('Epic');
  const [priorityLevel, setPriorityLevel] = useState<'Routine' | 'Urgent' | 'Stat'>('Routine');
  const [logs, setLogs] = useState<string[]>([]);
  const [completedJobsCount, setCompletedJobsCount] = useState(0);
  const [viewMode, setViewMode] = useState<'console' | 'benchmarks' | 'technologies' | 'roadmap'>('console');
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const [benchmarkProgress, setBenchmarkProgress] = useState(0);
  const [benchmarkLogs, setBenchmarkLogs] = useState<string[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);

  const runBenchmarkSimulation = () => {
    if (isBenchmarking) return;
    setIsBenchmarking(true);
    setBenchmarkProgress(0);
    setBenchmarkLogs([]);

    const bLogs = [
      `[${new Date().toLocaleTimeString()}] INITIATING ROBOTIC LOAD TEST: Target 100 concurrently queued transactions`,
      `[${new Date().toLocaleTimeString()}] DEPLOYING TEST CONFIGURATION: 4 Unattended VM Worker Containers...`,
      `[${new Date().toLocaleTimeString()}] THREADPOOL: Spin-up completed in 42ms. Max capacity set to 16 threads.`,
      `[${new Date().toLocaleTimeString()}] BATCH_01: Dispatching 25 HL7 FHIR conversion items to queue 'drt-batch-intake'...`,
      `[${new Date().toLocaleTimeString()}] BATCH_01: Processing complete. Average task latency: 112ms. Success: 100%`,
      `[${new Date().toLocaleTimeString()}] BATCH_02: Dispatching 25 Apple Health resting-heart-rate sync objects...`,
      `[${new Date().toLocaleTimeString()}] BATCH_02: Processing complete. Average task latency: 145ms. Success: 100%`,
      `[${new Date().toLocaleTimeString()}] BATCH_03: Triggering 25 MIMIC-IV telemetry-readmission scoring jobs...`,
      `[${new Date().toLocaleTimeString()}] BATCH_03: Processing complete. Average task latency: 210ms. Success: 99.4%`,
      `[${new Date().toLocaleTimeString()}] BATCH_04: Transcribing 25 synthetic prescriptions into Cerner sandbox API...`,
      `[${new Date().toLocaleTimeString()}] BATCH_04: Processing complete. Average task latency: 185ms. Success: 100%`,
      `[${new Date().toLocaleTimeString()}] PERFORMANCE METRICS GENERATED: System overhead is optimal. Core CPU peak: 14.2%`,
      `[${new Date().toLocaleTimeString()}] BENCHMARK COMPLETED: All tasks processed. Cumulative success rate: 99.85%`
    ];

    let logIdx = 0;
    const timer = setInterval(() => {
      if (logIdx < bLogs.length) {
        setBenchmarkLogs(prev => [...prev, bLogs[logIdx]]);
        logIdx++;
        setBenchmarkProgress(Math.min(100, Math.floor((logIdx / bLogs.length) * 100)));
      } else {
        clearInterval(timer);
        setIsBenchmarking(false);
      }
    }, 250);
  };

  const useCases = {
    intake: {
      title: "Automated Patient Intake & EHR Registry Sync",
      subtitle: "Eliminating Administrative Overload with Unattended bots",
      icon: Tablet,
      color: "from-blue-500 to-indigo-600 font-sans",
      badgeColor: "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/40 dark:border-blue-900 dark:text-blue-300",
      description: "Traditional healthcare software is notoriously fragmented, often requiring clinicians to manually transcribe interview notes back and forth between clinical decision systems and outdated mainframe electronic health records (EHR). By integrating UiPath, Dr. T can leverage an unattended Orchestrator Robot that automatically captures patient dialogue, translates them into validated HL7 FHIR Observation registries, and logs directly into Epic or Cerner interfaces.",
      valueProp: "🚀 Reduces manual data entry time by 95% while achieving 100% data validation accuracy across EHR ecosystems."
    },
    wearable: {
      title: "Cross-Platform Wearable IoT Syncing",
      subtitle: "Unlocking Ambient Biometric Monitoring via Fitbit & Apple Health",
      icon: Pocket,
      color: "from-teal-500 to-emerald-600 font-sans",
      badgeColor: "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-300",
      description: "Consumer health wearables (Garmin, Fitbit, Apple Watch) host immense vital patterns, yet rarely communicate natively with hospital-grade EHR sandboxes. A specialized UiPath automation pipeline can periodically authenticate through multi-factor portals, fetch historical workout files, daily hydration metrics, and resting heart rate variability (HRV) reports, standardizing and storing them within Dr. T's Unified Ecosystem.",
      valueProp: "⌚ Syncs patient ambient biometric history silently without requiring the user to manually export CSVs or install custom diagnostic interfaces."
    },
    alerts: {
      title: "Predictive ICU Telemetry & Pager Dispatching",
      subtitle: "Instant Critical Care Signaling via MIMIC-IV Metrics",
      icon: AlertTriangle,
      color: "from-rose-500 to-orange-600 font-sans",
      badgeColor: "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300",
      description: "When Dr. T's predictive clinical analytics (modeled after Harvard's anonymous MIMIC-IV datasets) identify critical care trends—such as a 30-day ICU readmission likelihood crossing 45%—every millisecond counts. An event-triggered UiPath robot can instantly intercept this analytic violation, auto-generate emergency clinical summary paperwork, and dispatch immediate alerts via pager networks, medical Slack environments, and on-call SMS systems.",
      valueProp: "🚨 Bridges the vital gap between clinical predictive indicators and split-second emergency alert coordination."
    },
    pharmacy: {
      title: "Lab Order Fulfillment & Smart Prescription Dispensation",
      subtitle: "Bypassing Clunky Web Gateways with Robotic Precision",
      icon: Activity,
      color: "from-purple-500 to-pink-600 font-sans",
      badgeColor: "bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-950/40 dark:border-purple-900 dark:text-purple-300",
      description: "Ordering routine diagnostic lab screenings or processing prescription renewals typically forces clinical workers into repetitive click-heavy state portals. With UiPath Integration, Dr. T's Socratic recommendations trigger a Software Robot to auto-populate state pharmacology databases and dispatch a digitally signed lab order form directly to the diagnostic fulfillment provider.",
      valueProp: "💊 Offloads prescription compliance steps to non-clinical virtual assistants, allowing providers to focus on direct patient encounters."
    }
  };

  const stepsList = [
    { label: "Trigger Request Received", desc: "UiPath trigger event initialized by Dr. T's core context." },
    { label: "Authenticating with Orchestrator", desc: "Establishing a secured OAuth handshake with UiPath Orchestrator API." },
    { label: "Fetching Clinical Payload", desc: "Constructing HL7 FHIR Observation payloads from patient symptom states." },
    { label: "Robot Agent Execution", desc: "Spawning an Unattended Robot inside a secure sandboxed sandbox workspace." },
    { label: "Data Integrity Validation", desc: "Analyzing target interface fields for structural anomalies." },
    { label: "System Sync and Auditing", desc: "Committing transactional changes directly with Epic/Cerner endpoints." },
    { label: "Completion and Callback", desc: "Broadcasting successful handshake reports to the Dr. T control plane." }
  ];

  const triggerSimulation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setProgress(0);
    setCurrentStep(0);
    setLogs([]);

    const simulationLogs = [
      `[${new Date().toLocaleTimeString()}] INFO: UiPath Webhook received. Event: TRIGGER_AUTOMATION_REQUEST`,
      `[${new Date().toLocaleTimeString()}] INFO: Payload parameters evaluated. Patient: "${selectedPatient}", Target: "${targetSystem}", Priority: "${priorityLevel}"`,
      `[${new Date().toLocaleTimeString()}] AUTH: Requesting Bearer token from UiPath Cloud Management Console...`,
      `[${new Date().toLocaleTimeString()}] AUTH: JWT handshake established. Scope: 'Orchestrator.Execution', Server Status: 'ONLINE'`,
      `[${new Date().toLocaleTimeString()}] FHIR: Fetching active symptom notes... Transforming raw text into structured HL7 metadata...`,
      `[${new Date().toLocaleTimeString()}] SUCCESS: Generated HL7 FHIR Observation JSON: { resourceType: 'Observation', patient: '${selectedPatient}', code: 'Vocal_Burnout_Index' }`,
      `[${new Date().toLocaleTimeString()}] QUEUE: Provisioning dedicated Unattended Robot: 'Robot-DrT-004-Active'`,
      `[${new Date().toLocaleTimeString()}] SYSTEM: Dynamic Environment launched. Spinning up standard desktop simulation interface...`,
      `[${new Date().toLocaleTimeString()}] RPA: Launching target medical registry: '${targetSystem} Portal v14.3'`,
      `[${new Date().toLocaleTimeString()}] RPA: Autocomplete fields initialized. Finding input selector 'patient_search_box'...`,
      `[${new Date().toLocaleTimeString()}] RPA: Patient file found. Populating 'ObservationRecord' with medical indicators and priority level '${priorityLevel}'`,
      `[${new Date().toLocaleTimeString()}] AUDIT: Generating compliance checksum for patient database sync...`,
      `[${new Date().toLocaleTimeString()}] HTTP: Submitting verified data packets directly to ${targetSystem} clinical database schema...`,
      `[${new Date().toLocaleTimeString()}] SUCCESS: Remote transaction finalized successfully. Reference ID: 'uipath-job-${Math.floor(Math.random() * 900000) + 100000}'`,
      `[${new Date().toLocaleTimeString()}] WEBHOOK: Dispatching completed job verification callback to Dr. T console.`,
      `[${new Date().toLocaleTimeString()}] INFO: Job clean-up complete. Robot status returned: 'IDLE'`
    ];

    let logIdx = 0;
    const intervalTime = 300; // fast logs streaming

    const timer = setInterval(() => {
      if (logIdx < simulationLogs.length) {
        setLogs(prev => [...prev, simulationLogs[logIdx]]);
        logIdx++;
        
        // Progress matching steps
        const calculatedProgress = Math.min(105, Math.floor((logIdx / simulationLogs.length) * 100));
        setProgress(calculatedProgress);

        // Update steps based on log index
        if (logIdx % 2 === 0 && logIdx > 0) {
          setCurrentStep(Math.min(stepsList.length - 1, Math.floor(logIdx / 2)));
        }
      } else {
        clearInterval(timer);
        setIsRunning(false);
        setCompletedJobsCount(prev => prev + 1);
        if (onUnlockAchievement) {
          onUnlockAchievement('uipath_orchestrator_unlocked');
        }
      }
    }, intervalTime);
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const currentConfig = useCases[selectedUseCase];
  const IconComponent = currentConfig.icon;

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto p-4 md:p-6" id="uipath-orchestrator-root">
      
      {/* Upper Hero Panel */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-850 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(244,63,94,0.1),transparent_50%)] pointer-events-none" />
        
        <div className="flex-1 space-y-3 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/30 rounded-full text-rose-300">
            <Cpu className="w-3.5 h-3.5 animate-spin-slow" />
            <span className="text-[10px] uppercase tracking-widest font-mono font-extrabold">Enterprise RPA Integration Hub</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-black tracking-tight text-stone-100">
            Dr. T + UiPath Automation Suite
          </h2>
          <p className="text-xs text-stone-300 leading-relaxed max-w-2xl font-sans font-medium">
            Bridging compassionate Socratic wellness and heavy enterprise systems. Seamlessly orchestrate unattended software robots to eliminate repetitive medical administration, synchronize biometrics, and secure HIPAA compliance across legacy EHR networks.
          </p>
        </div>

        <div className="flex flex-col items-center gap-2 justify-center bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 shrink-0 w-full md:w-auto text-center">
          <span className="text-3xl font-mono font-black text-rose-400">{completedJobsCount}</span>
          <span className="text-[9px] uppercase tracking-wider text-stone-300 font-mono font-bold">Completed Jobs Today</span>
          <div className="flex gap-1.5 mt-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[8px] uppercase tracking-widest text-stone-400 font-mono font-extrabold">Orchestrator Online</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation System */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-2 gap-2" id="uipath-tab-navigation">
        <div className="flex flex-wrap gap-1.5 w-full">
          <button
            onClick={() => setViewMode('console')}
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              viewMode === 'console'
                ? 'bg-rose-600 text-white shadow-sm font-black'
                : 'text-stone-500 hover:text-stone-850 dark:hover:text-stone-200'
            }`}
          >
            💻 Automation Console
          </button>
          <button
            onClick={() => setViewMode('benchmarks')}
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              viewMode === 'benchmarks'
                ? 'bg-rose-600 text-white shadow-sm font-black'
                : 'text-stone-500 hover:text-stone-850 dark:hover:text-stone-200'
            }`}
          >
            ⚡ Performance Benchmarks
          </button>
          <button
            onClick={() => setViewMode('technologies')}
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              viewMode === 'technologies'
                ? 'bg-rose-600 text-white shadow-sm font-black'
                : 'text-stone-500 hover:text-stone-850 dark:hover:text-stone-200'
            }`}
          >
            🛠️ Architecture Stack
          </button>
          <button
            onClick={() => setViewMode('roadmap')}
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              viewMode === 'roadmap'
                ? 'bg-rose-600 text-white shadow-sm font-black'
                : 'text-stone-500 hover:text-stone-850 dark:hover:text-stone-200'
            }`}
          >
            🚀 Rollout Roadmap
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'console' ? (
          <motion.div 
            key="console"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            
            {/* Left Hand: Controller & Configuration */}
            <div className="lg:col-span-4 flex flex-col gap-6" id="uipath-sidebar-column">
              
              {/* Use Case Selector Menu */}
              <div className="bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 p-5 rounded-3xl shadow-xs">
                <h3 className="text-[11px] font-mono tracking-widest uppercase text-stone-400 font-extrabold mb-4">Select Integration Use Case</h3>
                <div className="flex flex-col gap-2">
                  {(Object.keys(useCases) as Array<keyof typeof useCases>).map((key) => {
                    const item = useCases[key];
                    const ItemIcon = item.icon;
                    const isSelected = selectedUseCase === key;
                    return (
                      <button
                        key={key}
                        onClick={() => { setSelectedUseCase(key); }}
                        className={`w-full p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer select-none ${
                          isSelected 
                            ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900 shadow-xs' 
                            : 'bg-stone-50/50 dark:bg-stone-900 border-stone-200/60 dark:border-stone-850 hover:bg-stone-50 dark:hover:bg-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                        }`}
                      >
                        <div className={`p-2.5 rounded-xl border shrink-0 transition-all ${
                          isSelected 
                            ? 'bg-rose-500 text-white border-rose-450' 
                            : 'bg-white dark:bg-stone-800 text-stone-500 border-stone-200 dark:border-stone-700'
                        }`}>
                          <ItemIcon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className={`text-[11px] font-extrabold tracking-tight ${isSelected ? 'text-rose-950 dark:text-rose-200 font-black' : 'text-stone-800 dark:text-stone-200'}`}>
                            {item.title}
                          </p>
                          <p className={`text-[9px] font-medium leading-snug mt-0.5 truncate ${isSelected ? 'text-stone-500 dark:text-stone-450' : 'text-stone-400 dark:text-stone-500'}`}>
                            {item.subtitle}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Integration Parameters Panel */}
              <div className="bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 p-5 rounded-3xl shadow-xs">
                <div className="flex items-center gap-1.5 mb-4">
                  <Sliders className="w-3.5 h-3.5 text-rose-500" />
                  <h3 className="text-[11px] font-mono tracking-widest uppercase text-stone-400 font-extrabold">RPA Execution Params</h3>
                </div>

                <div className="space-y-4">
                  {/* Patient Selection */}
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-stone-550 uppercase mb-1.5">Active Target Patient</label>
                    <div className="relative">
                      <select 
                        value={selectedPatient}
                        onChange={(e) => setSelectedPatient(e.target.value)}
                        className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-850 text-stone-800 dark:text-stone-200 text-xs rounded-xl p-2.5 font-sans font-bold focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 cursor-pointer"
                      >
                        <option value="Raymond Vance">Raymond Vance (Internal ID: PH-8172)</option>
                        <option value="Marcus Vance">Marcus Vance (Internal ID: PH-9204)</option>
                        <option value="Sophia Lin">Sophia Lin (Internal ID: PH-1149)</option>
                        <option value="Dr. Eleanor Jenkins">Dr. Eleanor Jenkins (Internal ID: CL-0012)</option>
                      </select>
                    </div>
                  </div>

                  {/* Target Ecosystem Selection */}
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-stone-550 uppercase mb-1.5">Legacy Endpoint Gateway</label>
                    <div className="flex gap-2">
                      {(['Epic', 'Cerner', 'FHIR Local'] as const).map((sys) => (
                        <button
                          key={sys}
                          onClick={() => setTargetSystem(sys)}
                          className={`flex-1 text-[10px] font-bold py-2 px-2.5 rounded-xl border text-center transition-all cursor-pointer select-none ${
                            targetSystem === sys
                              ? 'bg-stone-900 dark:bg-stone-100 border-stone-900 dark:border-stone-100 text-white dark:text-stone-900 font-extrabold shadow-xs'
                              : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                          }`}
                        >
                          {sys}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Priority Rating */}
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-stone-550 uppercase mb-1.5">Orchestration Priority</label>
                    <div className="flex gap-2">
                      {(['Routine', 'Urgent', 'Stat'] as const).map((prio) => {
                        const colors = {
                          Routine: { active: 'bg-blue-600 border-blue-600 text-white', hover: 'hover:bg-blue-50 hover:text-blue-700' },
                          Urgent: { active: 'bg-amber-600 border-amber-600 text-white', hover: 'hover:bg-amber-50 hover:text-amber-700' },
                          Stat: { active: 'bg-rose-600 border-rose-600 text-white', hover: 'hover:bg-rose-50 hover:text-rose-700' }
                        };
                        return (
                          <button
                            key={prio}
                            onClick={() => setPriorityLevel(prio)}
                            className={`flex-1 text-[9px] font-mono uppercase font-black py-2 rounded-xl border text-center transition-all cursor-pointer select-none ${
                              priorityLevel === prio
                                ? colors[prio].active
                                : `bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 ${colors[prio].hover}`
                            }`}
                          >
                            {prio}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Big Red Play Trigger Code */}
                  <button
                    onClick={triggerSimulation}
                    disabled={isRunning}
                    className={`w-full py-3.5 px-4 rounded-2xl font-sans font-extrabold text-xs tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer select-none ${
                      isRunning 
                        ? 'bg-stone-100 dark:bg-stone-900 text-stone-400 border border-stone-200 dark:border-stone-800 cursor-not-allowed' 
                        : 'bg-rose-600 border border-rose-500 text-white hover:bg-rose-700 hover:border-rose-650 shadow-md hover:shadow-lg active:scale-98 animate-pulse-slow'
                    }`}
                  >
                    {isRunning ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-rose-550" />
                        <span>Robot Running... {progress}%</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current text-white" />
                        <span>Run UiPath Automation Job</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>

            {/* Right Hand: Detailed Console & Visualization Flow */}
            <div className="lg:col-span-8 flex flex-col gap-6" id="uipath-monitoring-display">
              
              {/* Detailed Selected Use Case Explanation Card */}
              <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <IconComponent className="w-40 h-40 text-stone-900 dark:text-stone-100" />
                </div>

                <div className="relative z-10 flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-mono uppercase font-black tracking-wider ${currentConfig.badgeColor}`}>
                      Selected Blueprint Mapping
                    </span>
                    <span className="text-[10px] font-mono text-stone-400 font-semibold">• Use Case Node</span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-display font-black text-stone-900 dark:text-stone-100 tracking-tight flex items-center gap-2">
                      <IconComponent className="w-5 h-5 text-rose-600 shrink-0" />
                      {currentConfig.title}
                    </h3>
                    <p className="text-[10px] font-bold text-stone-400 font-mono tracking-wide uppercase">
                      {currentConfig.subtitle}
                    </p>
                  </div>

                  <p className="text-xs text-stone-650 dark:text-stone-300 leading-relaxed font-sans font-medium">
                    {currentConfig.description}
                  </p>

                  <div className="p-3 bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-850 rounded-2xl flex items-center gap-3">
                    <div className="w-1.5 h-12 rounded-full bg-rose-500 shrink-0" />
                    <p className="text-xs text-stone-750 dark:text-stone-300 font-sans font-semibold italic">
                      {currentConfig.valueProp}
                    </p>
                  </div>
                </div>
              </div>

              {/* Interactive Automation Cycle Steps Flowbar */}
              <div className="bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 p-5 rounded-3xl shadow-xs">
                <h3 className="text-[11px] font-mono tracking-widest uppercase text-stone-400 font-extrabold mb-5">RPA Workflow Execution Progress</h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                  {stepsList.map((step, idx) => {
                    const isCompleted = idx < currentStep || (isRunning && progress === 100);
                    const isActive = idx === currentStep && isRunning;
                    
                    return (
                      <div 
                        key={idx} 
                        className={`flex flex-col items-center justify-between p-3 rounded-2xl border text-center relative transition-all ${
                          isActive 
                            ? 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-300 ring-1 ring-rose-200 shadow-xs' 
                            : isCompleted 
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/70' 
                            : 'bg-stone-50/50 dark:bg-stone-900 border-stone-200/40 opacity-70'
                        }`}
                      >
                        {/* Circle Indicator */}
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold border transition-all ${
                          isActive 
                            ? 'bg-rose-600 text-white border-rose-500 animate-pulse' 
                            : isCompleted 
                            ? 'bg-emerald-600 text-white border-emerald-500' 
                            : 'bg-white dark:bg-stone-800 text-stone-400 border-stone-200 dark:border-stone-700'
                        }`}>
                          {isCompleted ? '✓' : idx + 1}
                        </div>

                        <div className="mt-2 text-wrap leading-tight">
                          <p className={`text-[9px] font-extrabold tracking-tight ${isActive ? 'text-rose-900 dark:text-rose-200' : isCompleted ? 'text-emerald-950 dark:text-emerald-350 font-extrabold' : 'text-stone-700 dark:text-stone-300'}`}>
                            {step.label}
                          </p>
                        </div>

                        {/* Horizontal link lines for bigger screens */}
                        {idx < stepsList.length - 1 && (
                          <div className="hidden md:block absolute top-[21px] left-[70%] right-[-30%] h-[1px] bg-stone-200 dark:bg-stone-800 pointer-events-none z-10" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Simulated Terminal Live Log Console */}
              <div className="bg-stone-950 border border-stone-850 p-5 rounded-3xl text-stone-300 font-mono shadow-xl relative">
                <div className="flex justify-between items-center mb-3 text-[10px] text-stone-400 font-sans border-b border-stone-900 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-rose-500" />
                    <span className="text-[10px] tracking-wider uppercase font-extrabold text-stone-300 font-mono">Live UiPath Orchestrator Terminal Output</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-amber-500 animate-ping' : 'bg-stone-600'}`} />
                    <span>{isRunning ? 'RUNNING_JOB' : 'STANDBY'}</span>
                  </div>
                </div>

                <div 
                  ref={terminalRef}
                  className="h-44 overflow-y-auto text-[11px] leading-relaxed space-y-1.5 scrollbar-thin scrollbar-thumb-stone-800 scrollbar-track-transparent pr-2"
                  style={{ contentVisibility: 'auto' }}
                >
                  {logs.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-stone-500 font-sans p-6 text-center">
                      <Cpu className="w-8 h-8 text-stone-700 mb-2 animate-pulse-slow" />
                      <p className="text-xs font-bold uppercase tracking-wider font-mono">Robot Awaiting Direct Trigger</p>
                      <p className="text-[10px] max-w-sm mt-1 leading-normal font-medium text-stone-600">
                        Set execution metrics on the sidebar then click "Run UiPath Automation Job" to launch low-latency background validation.
                      </p>
                    </div>
                  ) : (
                    logs.map((log, index) => {
                      let colorClass = "text-stone-300";
                      if (log.includes("AUTH")) colorClass = "text-yellow-400/90";
                      if (log.includes("SUCCESS")) colorClass = "text-emerald-400 font-bold";
                      if (log.includes("FHIR")) colorClass = "text-cyan-400";
                      if (log.includes("RPA")) colorClass = "text-rose-400";
                      if (log.includes("QUEUE") || log.includes("SYSTEM")) colorClass = "text-indigo-400";
                      
                      return (
                        <div key={index} className={`${colorClass} whitespace-pre-wrap transition-opacity duration-300`}>
                          {log}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Simulated floating connection badges */}
                <div className="mt-4 flex flex-wrap gap-2 text-[9px] uppercase tracking-wider font-bold pt-3.5 border-t border-stone-900 font-mono text-stone-400">
                  <span className="px-2 py-0.5 bg-stone-900/60 rounded">Client ID: drt-polymath-prod</span>
                  <span className="px-2 py-0.5 bg-stone-900/60 rounded text-rose-400">Handshake: SHA-256</span>
                  <span className="px-2 py-0.5 bg-stone-900/60 rounded text-emerald-400">API: v2.0-secure</span>
                  <span className="px-2 py-0.5 bg-stone-900/60 rounded text-cyan-400">EHR Channel: Outbound</span>
                </div>
              </div>

            </div>

          </motion.div>
        ) : viewMode === 'benchmarks' ? (
          /* ==================== HIGH-FIDELITY BENCHMARKS DASHBOARD ==================== */
          <motion.div 
            key="benchmarks"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 md:p-8 shadow-lg flex flex-col gap-6 font-sans relative overflow-hidden w-full text-stone-800 dark:text-stone-200"
            id="uipath-benchmarks-container"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-rose-500/5 to-transparent rounded-bl-full pointer-events-none" />

            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-stone-150 dark:border-stone-800 pb-5 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black text-rose-600 dark:text-rose-400 tracking-widest uppercase font-mono bg-rose-500/10 px-2.5 py-1 rounded-md">
                    RPA PERFORMANCE & TRANSACTION METRICS
                  </span>
                  <span className="text-[9px] font-extrabold text-stone-400 dark:text-stone-500 font-mono">
                    Dr. T Automated Core
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-stone-850 dark:text-stone-100 tracking-tight leading-none mt-2">
                  Robotic Performance Benchmarks
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed max-w-2xl mt-1">
                  Analyze real-time server latencies, VM worker queue metrics, and stress-test the Socratic HL7 FHIR transactional pipeline natively inside your sandbox.
                </p>
              </div>

              <div className="bg-stone-50 dark:bg-stone-900/60 border border-stone-150 dark:border-stone-800 p-3 rounded-2xl flex flex-col gap-1 shrink-0 w-full md:w-auto">
                <span className="text-[8px] font-extrabold uppercase text-stone-400 dark:text-stone-500 font-mono tracking-widest block">
                  Current Execution State
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <Zap className="w-4 h-4 text-rose-500 animate-pulse" />
                  <span className="text-xs font-black text-stone-800 dark:text-stone-200 font-mono">
                    Optimized for Epic/Cerner API
                  </span>
                </div>
              </div>
            </div>

            {/* Metric Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-stone-50 dark:bg-stone-900 p-4 border border-stone-200 dark:border-stone-800 rounded-2xl flex flex-col gap-1">
                <span className="text-[9px] uppercase tracking-wider text-stone-400 dark:text-stone-500 font-mono font-bold">Avg Bot Spawning Latency</span>
                <span className="text-2xl font-mono font-black text-rose-600 dark:text-rose-400">120ms</span>
                <span className="text-[9px] text-stone-500 dark:text-stone-400 mt-1">Ready state in virtual workspace</span>
              </div>

              <div className="bg-stone-50 dark:bg-stone-900 p-4 border border-stone-200 dark:border-stone-800 rounded-2xl flex flex-col gap-1">
                <span className="text-[9px] uppercase tracking-wider text-stone-400 dark:text-stone-500 font-mono font-bold">HL7 Validation Rate</span>
                <span className="text-2xl font-mono font-black text-rose-600 dark:text-rose-400">1,840/s</span>
                <span className="text-[9px] text-stone-500 dark:text-stone-400 mt-1">Records translated and matched</span>
              </div>

              <div className="bg-stone-50 dark:bg-stone-900 p-4 border border-stone-200 dark:border-stone-800 rounded-2xl flex flex-col gap-1">
                <span className="text-[9px] uppercase tracking-wider text-stone-400 dark:text-stone-500 font-mono font-bold">Avg Handshake Transaction</span>
                <span className="text-2xl font-mono font-black text-rose-600 dark:text-rose-400">1.15s</span>
                <span className="text-[9px] text-stone-500 dark:text-stone-400 mt-1">Epic/Cerner secure sync rate</span>
              </div>

              <div className="bg-stone-50 dark:bg-stone-900 p-4 border border-stone-200 dark:border-stone-800 rounded-2xl flex flex-col gap-1">
                <span className="text-[9px] uppercase tracking-wider text-stone-400 dark:text-stone-500 font-mono font-bold">Active Unattended Workers</span>
                <span className="text-2xl font-mono font-black text-emerald-600 dark:text-emerald-400">4 Online</span>
                <span className="text-[9px] text-emerald-500/80 mt-1">Ready for high-priority dispatch</span>
              </div>
            </div>

            {/* Interactive Load Tester Component */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-stone-50 dark:bg-stone-900 p-5 rounded-2xl border border-stone-150 dark:border-stone-800">
              <div className="md:col-span-4 flex flex-col gap-4">
                <span className="text-xs font-black uppercase text-stone-850 dark:text-stone-100 font-mono tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-rose-500" />
                  RPA Stress Tester
                </span>

                <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
                  Trigger a live multi-threaded load simulation to dispatch 100 concurrent mock transactions across our synthetic clinical endpoint channels.
                </p>

                <button
                  onClick={runBenchmarkSimulation}
                  disabled={isBenchmarking}
                  className={`w-full py-3.5 px-4 rounded-xl font-sans font-extrabold text-xs tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer select-none ${
                    isBenchmarking 
                      ? 'bg-stone-200 dark:bg-stone-800 text-stone-400 border border-stone-300 dark:border-stone-750 cursor-not-allowed' 
                      : 'bg-rose-600 border border-rose-500 text-white hover:bg-rose-700 shadow-md'
                  }`}
                >
                  {isBenchmarking ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Stressing Queue... {benchmarkProgress}%</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current text-white" />
                      <span>Run Stress-Test Simulation</span>
                    </>
                  )}
                </button>

                {isBenchmarking && (
                  <div className="w-full bg-stone-200 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden mt-1">
                    <div className="bg-rose-600 h-full transition-all duration-200" style={{ width: `${benchmarkProgress}%` }} />
                  </div>
                )}
              </div>

              <div className="md:col-span-8 flex flex-col bg-stone-950 border border-stone-850 rounded-xl p-4 text-stone-300 font-mono text-[10px]">
                <span className="text-[9px] uppercase tracking-wider text-stone-400 border-b border-stone-900 pb-2 mb-2 block font-sans">
                  Interactive Benchmarking Output Log
                </span>
                <div className="h-36 overflow-y-auto space-y-1 pr-2 scrollbar-thin scrollbar-thumb-stone-800">
                  {benchmarkLogs.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-stone-600 font-sans text-center">
                      <Terminal className="w-6 h-6 text-stone-700 mb-1" />
                      <p>Benchmark suite is idle. Click "Run Stress-Test Simulation" above.</p>
                    </div>
                  ) : (
                    benchmarkLogs.map((log, idx) => {
                      let color = "text-stone-300";
                      if (log.includes("LOAD TEST")) color = "text-rose-400 font-bold";
                      if (log.includes("COMPLETE") || log.includes("optimal")) color = "text-emerald-400";
                      if (log.includes("THREADPOOL")) color = "text-amber-400";
                      return (
                        <div key={idx} className={color}>
                          {log}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Target endpoints latency metrics bars */}
            <div className="bg-stone-50 dark:bg-stone-900 border border-stone-150 dark:border-stone-800 p-5 rounded-2xl flex flex-col gap-4">
              <span className="text-xs font-black uppercase text-stone-850 dark:text-stone-100 font-mono tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-rose-500" />
                Target Integration Pipeline Latencies
              </span>

              <div className="space-y-3.5">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="font-semibold text-stone-700 dark:text-stone-300">Epic Sandbox API Connection Gateway</span>
                    <span className="font-mono text-rose-600 dark:text-rose-400 font-bold">142ms</span>
                  </div>
                  <div className="w-full bg-stone-200 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full" style={{ width: '38%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="font-semibold text-stone-700 dark:text-stone-300">Cerner Health Gateway Core Sync</span>
                    <span className="font-mono text-rose-600 dark:text-rose-400 font-bold">184ms</span>
                  </div>
                  <div className="w-full bg-stone-200 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full" style={{ width: '49%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="font-semibold text-stone-700 dark:text-stone-300">HL7 FHIR REST Message Broker</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">42ms</span>
                  </div>
                  <div className="w-full bg-stone-200 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full" style={{ width: '12%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="font-semibold text-stone-700 dark:text-stone-300">Local Socratic SQLite Datastore Cache</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">2ms</span>
                  </div>
                  <div className="w-full bg-stone-200 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full" style={{ width: '2%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Slide Footer Info */}
            <div className="flex justify-between items-center border-t border-stone-150 dark:border-stone-800 pt-3.5 text-[10px] text-stone-500 dark:text-stone-400 font-sans">
              <span className="font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" /> Socratic Trust Protocol
              </span>
              <span className="font-mono text-[9px] text-stone-400 dark:text-stone-500">
                ZENIVERSE AUTOMATION ENGINE © 2026
              </span>
            </div>
          </motion.div>
        ) : viewMode === 'technologies' ? (
          /* ==================== HIGH-FIDELITY TECHNOLOGIES STACK DASHBOARD ==================== */
          <motion.div 
            key="technologies"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 md:p-8 shadow-lg flex flex-col gap-6 font-sans relative overflow-hidden w-full text-stone-800 dark:text-stone-200"
            id="uipath-technologies-container"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-rose-500/5 to-transparent rounded-bl-full pointer-events-none" />

            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-stone-150 dark:border-stone-800 pb-5 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black text-rose-600 dark:text-rose-400 tracking-widest uppercase font-mono bg-rose-500/10 px-2.5 py-1 rounded-md">
                    AUTOMATION ARCHITECTURE & COMPOSABLE API LAYERS
                  </span>
                  <span className="text-[9px] font-extrabold text-stone-400 dark:text-stone-500 font-mono">
                    Dr. T Core Engine
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-stone-850 dark:text-stone-100 tracking-tight leading-none mt-2">
                  Architectural Technology Stack
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed max-w-2xl mt-1">
                  Examine the enterprise-grade components driving Dr. T's custom UiPath robotic pipelines, securing reliable transactions across disparate clinics.
                </p>
              </div>

              <div className="bg-stone-50 dark:bg-stone-900/60 border border-stone-150 dark:border-stone-800 p-3 rounded-2xl flex flex-col gap-1 shrink-0 w-full md:w-auto">
                <span className="text-[8px] font-extrabold uppercase text-stone-400 dark:text-stone-500 font-mono tracking-widest block">
                  Security Gateway Target
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <Network className="w-4 h-4 text-rose-500" />
                  <span className="text-xs font-black text-stone-800 dark:text-stone-200 font-mono">
                    OAuth 2.0 / SSL Secure
                  </span>
                </div>
              </div>
            </div>

            {/* Main Content: Interactive Architecture Flowchart */}
            <div className="bg-stone-50 dark:bg-stone-900 border border-stone-150 dark:border-stone-800 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
              <span className="text-xs font-black uppercase text-stone-850 dark:text-stone-100 font-mono tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-rose-500" />
                Socratic Automation Dispatch & Execution Flow
              </span>

              {/* Composable diagram layout */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative mt-2 text-stone-800 dark:text-stone-200">
                {/* Step 1 */}
                <div className="bg-white dark:bg-stone-850 border border-stone-200/40 dark:border-stone-800 p-4 rounded-xl flex flex-col gap-3 relative shadow-xs">
                  <div className="absolute -top-3 left-4 bg-blue-600 text-white font-mono text-[8px] font-black px-2 py-0.5 rounded-full shadow-sm">
                    LAYER 1: TRIGGER EVENT
                  </div>
                  <div className="flex items-center gap-2.5 mt-1.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                      <Sliders className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-stone-850 dark:text-stone-100">Ambient Intercept</h4>
                      <span className="text-[8px] font-mono text-stone-450 dark:text-stone-500">Context Events</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400 leading-relaxed">
                    Socratic context triggers, patient dialogue streams, and vital-threshold crossings are compiled into webhook trigger messages.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="bg-white dark:bg-stone-850 border border-stone-200/40 dark:border-stone-800 p-4 rounded-xl flex flex-col gap-3 relative shadow-xs">
                  <div className="absolute -top-3 left-4 bg-amber-600 text-white font-mono text-[8px] font-black px-2 py-0.5 rounded-full shadow-sm">
                    LAYER 2: SECURE QUEUE
                  </div>
                  <div className="flex items-center gap-2.5 mt-1.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                      <Database className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-stone-855 dark:text-stone-100">Orchestrator Queue</h4>
                      <span className="text-[8px] font-mono text-stone-450 dark:text-stone-500">AES-256 Queue Assets</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400 leading-relaxed">
                    Webhook hits UiPath Orchestrator API via secured OAuth JWT. Payloads are placed in encrypted Orchestrator Queue queues.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="bg-white dark:bg-stone-850 border border-stone-200/40 dark:border-stone-800 p-4 rounded-xl flex flex-col gap-3 relative shadow-xs">
                  <div className="absolute -top-3 left-4 bg-purple-600 text-white font-mono text-[8px] font-black px-2 py-0.5 rounded-full shadow-sm">
                    LAYER 3: ROBOT DISPATCH
                  </div>
                  <div className="flex items-center gap-2.5 mt-1.5">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                      <Server className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-stone-850 dark:text-stone-100">Unattended VM Run</h4>
                      <span className="text-[8px] font-mono text-stone-450 dark:text-stone-500">Virtual Environment</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400 leading-relaxed">
                    Orchestrator spawns Unattended Robot VM instance. Robot fetches secure sandbox credentials and executes automated GUI sequences.
                  </p>
                </div>

                {/* Step 4 */}
                <div className="bg-white dark:bg-stone-850 border border-stone-200/40 dark:border-stone-800 p-4 rounded-xl flex flex-col gap-3 relative shadow-xs">
                  <div className="absolute -top-3 left-4 bg-rose-600 text-white font-mono text-[8px] font-black px-2 py-0.5 rounded-full shadow-sm">
                    LAYER 4: EHR GATEWAY
                  </div>
                  <div className="flex items-center gap-2.5 mt-1.5">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-stone-850 dark:text-stone-100">Epic / Cerner Sync</h4>
                      <span className="text-[8px] font-mono text-stone-450 dark:text-stone-500">HL7 FHIR Validation</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400 leading-relaxed">
                    Robot transcribes data, validates HL7 compliance, logs changes in audited records, and returns callback handshakes.
                  </p>
                </div>
              </div>
            </div>

            {/* Composable Technology Evaluation & Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Tech Grid Item */}
              <div className="bg-stone-50 dark:bg-stone-900 p-5 rounded-2xl border border-stone-150 dark:border-stone-800 flex flex-col gap-4">
                <span className="text-[10px] font-black text-stone-850 dark:text-stone-100 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-rose-500" />
                  Automation Strategy Rationale
                </span>

                <div className="flex flex-col gap-3.5 text-stone-600 dark:text-stone-300">
                  <div className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                    <div>
                      <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">Unattended Orchestrator Clusters</span>
                      <p className="text-[11px] text-stone-500 dark:text-stone-450 leading-relaxed mt-0.5">
                        Standardizes remote robot background workers to run on isolated host machines, keeping local browser sandboxes clean and ensuring 100% HIPAA isolation.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                    <div>
                      <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">HL7 FHIR REST Translation Engine</span>
                      <p className="text-[11px] text-stone-500 dark:text-stone-450 leading-relaxed mt-0.5">
                        Guarantees modern data-interoperability formatting prior to robot entry, avoiding transactional errors when populating Epic and Cerner portal databases.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                    <div>
                      <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">Secure Token Lifecycle Handshake</span>
                      <p className="text-[11px] text-stone-500 dark:text-stone-450 leading-relaxed mt-0.5">
                        Enforces short-lived OAuth 2.0 JSON Web Tokens (JWT) for webhook callbacks, securing robotic triggers against intercept or payload modification vectors.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Tech Grid Item: Engineering Spec Sheet */}
              <div className="bg-stone-50 dark:bg-stone-900 p-5 rounded-2xl border border-stone-150 dark:border-stone-800 flex flex-col gap-4">
                <span className="text-[10px] font-black text-stone-850 dark:text-stone-100 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-rose-500" />
                  RPA Protocol Specifications
                </span>

                <div className="flex flex-col gap-3.5 text-[11px]">
                  <div className="flex justify-between items-center border-b border-stone-150 dark:border-stone-800 pb-2">
                    <span className="text-stone-500 dark:text-stone-400">API Standard</span>
                    <span className="font-mono font-bold text-stone-850 dark:text-stone-200">UiPath Webhook API v2.0-secure</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-stone-150 dark:border-stone-800 pb-2">
                    <span className="text-stone-500 dark:text-stone-400">Auth Paradigm</span>
                    <span className="font-mono font-bold text-stone-855 dark:text-stone-200">OAuth 2.0 Bearer JWT (Secure scopes)</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-stone-150 dark:border-stone-800 pb-2">
                    <span className="text-stone-500 dark:text-stone-400">Interoperability Protocol</span>
                    <span className="font-mono font-bold text-stone-850 dark:text-stone-200">HL7 FHIR Release 4 (JSON schema)</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-stone-150 dark:border-stone-800 pb-2">
                    <span className="text-stone-500 dark:text-stone-400">Typical Queue Processing Latency</span>
                    <span className="font-mono font-bold text-stone-850 dark:text-stone-200">80 - 150 milliseconds</span>
                  </div>
                  <div className="flex justify-between items-center pb-2">
                    <span className="text-stone-500 dark:text-stone-400">Asset Data Encryption</span>
                    <span className="font-mono font-bold text-stone-850 dark:text-stone-200">AES-256 Symmetric encryption keys</span>
                  </div>
                </div>

                <div className="p-3.5 bg-rose-500/5 border border-rose-500/10 rounded-xl mt-1 text-[11px] leading-relaxed text-stone-600 dark:text-stone-450">
                  <strong className="text-stone-850 dark:text-stone-200 block mb-0.5">🚀 Architecture Verified</strong>
                  Dr. T's webhook interfaces match modern enterprise specs. Unattended workers are fully responsive inside this cloud simulation, guaranteeing split-second dispatch times.
                </div>
              </div>
            </div>

            {/* Slide Footer Info */}
            <div className="flex justify-between items-center border-t border-stone-150 dark:border-stone-800 pt-3.5 text-[10px] text-stone-500 dark:text-stone-400 font-sans">
              <span className="font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" /> Socratic Trust Protocol
              </span>
              <span className="font-mono text-[9px] text-stone-400 dark:text-stone-500">
                ZENIVERSE AUTOMATION ENGINE © 2026
              </span>
            </div>
          </motion.div>
        ) : (
          /* ==================== HIGH-FIDELITY ROADMAP & MILESTONES DASHBOARD ==================== */
          <motion.div 
            key="roadmap"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 md:p-8 shadow-lg flex flex-col gap-6 font-sans relative overflow-hidden w-full text-stone-800 dark:text-stone-200"
            id="uipath-roadmap-container"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-rose-500/5 to-transparent rounded-bl-full pointer-events-none" />

            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-stone-150 dark:border-stone-800 pb-5 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black text-rose-600 dark:text-rose-400 tracking-widest uppercase font-mono bg-rose-500/10 px-2.5 py-1 rounded-md">
                    FUTURE PIPELINE & SCALE MILESTONES
                  </span>
                  <span className="text-[9px] font-extrabold text-stone-400 dark:text-stone-500 font-mono">
                    Dr. T Automated Core
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-stone-855 dark:text-stone-100 tracking-tight leading-none mt-2">
                  RPA Integration Roadmap
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed max-w-2xl mt-1">
                  Trace the development phases of Dr. T's clinical automation strategies, scaling from browser DOM scripts to self-healing cognitive assistants.
                </p>
              </div>

              <div className="bg-stone-50 dark:bg-stone-900/60 border border-stone-150 dark:border-stone-800 p-3 rounded-2xl flex flex-col gap-1 shrink-0 w-full md:w-auto">
                <span className="text-[8px] font-extrabold uppercase text-stone-400 dark:text-stone-500 font-mono tracking-widest block">
                  Project Phase Target
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <Compass className="w-4 h-4 text-rose-500" />
                  <span className="text-xs font-black text-stone-800 dark:text-stone-200 font-mono">
                    Phases 1 - 4 (2026-2027)
                  </span>
                </div>
              </div>
            </div>

            {/* Main Visual Roadmap Component */}
            <div className="relative border border-stone-150 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 rounded-2xl p-6 shadow-inner">
              <span className="text-xs font-black uppercase text-stone-850 dark:text-stone-100 font-mono tracking-wider flex items-center gap-1.5 mb-6">
                <GitBranch className="w-4 h-4 text-rose-500" />
                RPA System Expansion Timeline
              </span>

              {/* Interactive/timeline nodes */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
                {/* Phase 1 */}
                <div className="flex flex-col gap-3 relative text-stone-800 dark:text-stone-200">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-mono font-black text-[10px]">1</span>
                    <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest font-mono bg-emerald-500/10 px-2 py-0.5 rounded">
                      COMPLETED
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-stone-850 dark:text-stone-100">Phase 1: Basic DOM Automation</h4>
                    <span className="text-[9px] font-mono text-stone-400 dark:text-stone-500">Q2 2026</span>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
                    Establish browser-level UI recorders to auto-populate basic Cerner and Epic sandbox web interfaces directly.
                  </p>
                  <div className="border-t border-stone-200 dark:border-stone-800/80 pt-2 flex flex-col gap-1.5">
                    <span className="text-[9px] text-stone-600 dark:text-stone-450 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-500" /> Recorders established
                    </span>
                    <span className="text-[9px] text-stone-600 dark:text-stone-450 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-500" /> Sandbox validation OK
                    </span>
                  </div>
                </div>

                {/* Phase 2 */}
                <div className="flex flex-col gap-3 relative text-stone-800 dark:text-stone-200">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center font-mono font-black text-[10px]">2</span>
                    <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest font-mono bg-blue-500/10 px-2 py-0.5 rounded animate-pulse">
                      IN PROGRESS
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-stone-850 dark:text-stone-100">Phase 2: Queue Orchestration</h4>
                    <span className="text-[9px] font-mono text-stone-400 dark:text-stone-500">Q3 2026</span>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
                    Set up scalable multi-tenant VM clusters running unattended worker robots triggered by secured webhooks.
                  </p>
                  <div className="border-t border-stone-200 dark:border-stone-800/80 pt-2 flex flex-col gap-1.5">
                    <span className="text-[9px] text-stone-600 dark:text-stone-450 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-500" /> Webhook trigger gateway
                    </span>
                    <span className="text-[9px] text-stone-650 dark:text-stone-300 flex items-center gap-1.5 font-bold">
                      <RefreshCw className="w-3 h-3 text-rose-500 animate-spin" /> Unattended worker pool
                    </span>
                  </div>
                </div>

                {/* Phase 3 */}
                <div className="flex flex-col gap-3 relative text-stone-800 dark:text-stone-200">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center font-mono font-black text-[10px]">3</span>
                    <span className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest font-mono bg-purple-500/10 px-2 py-0.5 rounded">
                      PLANNED
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-stone-850 dark:text-stone-100">Phase 3: Deep OCR Models</h4>
                    <span className="text-[9px] font-mono text-stone-400 dark:text-stone-500">Q4 2026</span>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
                    Deploy UiPath Document Understanding OCR AI models to parse scanned paper prescriptions and lab reports into HL7 metadata.
                  </p>
                  <div className="border-t border-stone-200 dark:border-stone-800/80 pt-2 flex flex-col gap-1.5">
                    <span className="text-[9px] text-stone-450 flex items-center gap-1.5">
                      <Milestone className="w-3 h-3 text-stone-450" /> Prescriptions OCR Layouts
                    </span>
                    <span className="text-[9px] text-stone-450 flex items-center gap-1.5">
                      <Milestone className="w-3 h-3 text-stone-450" /> Document classification API
                    </span>
                  </div>
                </div>

                {/* Phase 4 */}
                <div className="flex flex-col gap-3 relative text-stone-800 dark:text-stone-200">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-stone-400 text-white flex items-center justify-center font-mono font-black text-[10px]">4</span>
                    <span className="text-[10px] font-black text-stone-500 dark:text-stone-450 uppercase tracking-widest font-mono bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">
                      PROPOSED
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-stone-850 dark:text-stone-100">Phase 4: Cognitive Healing</h4>
                    <span className="text-[9px] font-mono text-stone-400 dark:text-stone-500">Q1 2027</span>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
                    Integrate dynamic UI target modeling, allowing robots to self-heal their selector targets if Epic or Cerner modify portal designs.
                  </p>
                  <div className="border-t border-stone-200 dark:border-stone-800/80 pt-2 flex flex-col gap-1.5">
                    <span className="text-[9px] text-stone-450 flex items-center gap-1.5">
                      <Milestone className="w-3 h-3 text-stone-450" /> Dynamic selector recovery
                    </span>
                    <span className="text-[9px] text-stone-450 flex items-center gap-1.5">
                      <Milestone className="w-3 h-3 text-stone-450" /> Self-healing diagnostic logs
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Extra roadmap details grids */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-stone-50 dark:bg-stone-900 p-5 rounded-2xl border border-stone-150 dark:border-stone-800 flex flex-col gap-4">
                <span className="text-[10px] font-black text-stone-850 dark:text-stone-100 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-rose-500" />
                  Additional Milestones
                </span>

                <div className="flex flex-col gap-3.5 text-[11px] text-stone-600 dark:text-stone-400">
                  <div className="flex gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-rose-500/15 text-rose-600 flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">A</span>
                    <div>
                      <strong className="text-stone-800 dark:text-stone-200 block">Unified Multi-Tenant Orchestrator</strong>
                      Configure secure directory-level segregation on a single Orchestrator hub, enabling multiple independent clinical centers to run robots concurrently.
                    </div>
                  </div>

                  <div className="flex gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-rose-500/15 text-rose-600 flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">B</span>
                    <div>
                      <strong className="text-stone-800 dark:text-stone-200 block">Biometric IoT Event Handler</strong>
                      Implement smart routing middleware that scales vital metrics uploads from Apple Watch/Fitbit dynamically based on connection quality, optimizing battery drain.
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-stone-50 dark:bg-stone-900 p-5 rounded-2xl border border-stone-150 dark:border-stone-800 flex flex-col gap-4">
                <span className="text-[10px] font-black text-stone-850 dark:text-stone-100 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  HIPAA compliance & Emergency limits
                </span>

                <div className="flex flex-col gap-3.5 text-[11px] text-stone-600 dark:text-stone-400">
                  <div>
                    <strong className="text-stone-855 dark:text-stone-200 block">1. Zero-Clipboard Retention Policy</strong>
                    Robots clear memory buffer state immediately upon finishing transaction fields, guaranteeing that patient details do not linger inside shared workspace hosts.
                  </div>

                  <div>
                    <strong className="text-stone-855 dark:text-stone-200 block">2. Emergency Override Circuit</strong>
                    Clinicians can press a master circuit break command inside Dr. T's settings to revoke all pending robot jobs and pause queue processing immediately during emergency outages.
                  </div>
                </div>
              </div>
            </div>

            {/* Slide Footer Info */}
            <div className="flex justify-between items-center border-t border-stone-150 dark:border-stone-800 pt-3.5 text-[10px] text-stone-500 dark:text-stone-400 font-sans">
              <span className="font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" /> Socratic Trust Protocol
              </span>
              <span className="font-mono text-[9px] text-stone-400 dark:text-stone-500">
                ZENIVERSE AUTOMATION ENGINE © 2026
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
