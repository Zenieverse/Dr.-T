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
  ExternalLink
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
  const terminalRef = useRef<HTMLDivElement>(null);

  const useCases = {
    intake: {
      title: "Automated Patient Intake & EHR Registry Sync",
      subtitle: "Eliminating Administrative Overload with Unattended bots",
      icon: Tablet,
      color: "from-blue-500 to-indigo-600 font-sans",
      badgeColor: "bg-blue-50 border-blue-200 text-blue-700",
      description: "Traditional healthcare software is notoriously fragmented, often requiring clinicians to manually transcribe interview notes back and forth between clinical decision systems and outdated mainframe electronic health records (EHR). By integrating UiPath, Dr. T can leverage an unattended Orchestrator Robot that automatically captures patient dialogue, translates them into validated HL7 FHIR Observation registries, and logs directly into Epic or Cerner interfaces.",
      valueProp: "🚀 Reduces manual data entry time by 95% while achieving 100% data validation accuracy across EHR ecosystems."
    },
    wearable: {
      title: "Cross-Platform Wearable IoT Syncing",
      subtitle: "Unlocking Ambient Biometric Monitoring via Fitbit & Apple Health",
      icon: Pocket,
      color: "from-teal-500 to-emerald-600 font-sans",
      badgeColor: "bg-emerald-50 border-emerald-200 text-emerald-700",
      description: "Consumer health wearables (Garmin, Fitbit, Apple Watch) host immense vital patterns, yet rarely communicate natively with hospital-grade EHR sandboxes. A specialized UiPath automation pipeline can periodically authenticate through multi-factor portals, fetch historical workout files, daily hydration metrics, and resting heart rate variability (HRV) reports, standardizing and storing them within Dr. T's Unified Ecosystem.",
      valueProp: "⌚ Syncs patient ambient biometric history silently without requiring the user to manually export CSVs or install custom diagnostic interfaces."
    },
    alerts: {
      title: "Predictive ICU Telemetry & Pager Dispatching",
      subtitle: "Instant Critical Care Signaling via MIMIC-IV Metrics",
      icon: AlertTriangle,
      color: "from-rose-500 to-orange-600 font-sans",
      badgeColor: "bg-rose-50 border-rose-200 text-rose-700",
      description: "When Dr. T's predictive clinical analytics (modeled after Harvard's anonymous MIMIC-IV datasets) identify critical care trends—such as a 30-day ICU readmission likelihood crossing 45%—every millisecond counts. An event-triggered UiPath robot can instantly intercept this analytic violation, auto-generate emergency clinical summary paperwork, and dispatch immediate alerts via pager networks, medical Slack environments, and on-call SMS systems.",
      valueProp: "🚨 Bridges the vital gap between clinical predictive indicators and split-second emergency alert coordination."
    },
    pharmacy: {
      title: "Lab Order Fulfillment & Smart Prescription Dispensation",
      subtitle: "Bypassing Clunky Web Gateways with Robotic Precision",
      icon: Activity,
      color: "from-purple-500 to-pink-600 font-sans",
      badgeColor: "bg-purple-50 border-purple-200 text-purple-700",
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

      {/* Core Split Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Hand: Controller & Configuration */}
        <div className="lg:col-span-4 flex flex-col gap-6" id="uipath-sidebar-column">
          
          {/* Use Case Selector Menu */}
          <div className="bg-white border border-stone-200/60 p-5 rounded-3xl shadow-xs">
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
                        ? 'bg-rose-50/50 border-rose-200 shadow-xs' 
                        : 'bg-stone-50/50 border-stone-200/60 hover:bg-stone-50 hover:border-stone-300'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl border shrink-0 transition-all ${
                      isSelected 
                        ? 'bg-rose-500 text-white border-rose-450' 
                        : 'bg-white text-stone-500 border-stone-200'
                    }`}>
                      <ItemIcon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-[11px] font-extrabold tracking-tight ${isSelected ? 'text-rose-950 font-black' : 'text-stone-800 font-semibold'}`}>
                        {item.title}
                      </p>
                      <p className={`text-[9px] font-medium leading-snug mt-0.5 truncate ${isSelected ? 'text-stone-500' : 'text-stone-400'}`}>
                        {item.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Integration Parameters Panel */}
          <div className="bg-white border border-stone-200/60 p-5 rounded-3xl shadow-xs">
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
                    className="w-full bg-stone-50 border border-stone-200 text-stone-800 text-xs rounded-xl p-2.5 font-sans font-bold focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 cursor-pointer"
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
                          ? 'bg-stone-900 border-stone-900 text-white font-extrabold shadow-xs'
                          : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
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
                            : `bg-stone-50 border-stone-200 text-stone-600 ${colors[prio].hover}`
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
                    ? 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed' 
                    : 'bg-rose-600 border border-rose-500 text-white hover:bg-rose-700 hover:border-rose-650 shadow-md hover:shadow-lg active:scale-98 animate-pulse-slow'
                }`}
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-rose-500" />
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
          <div className="bg-stone-50 border border-stone-200/80 p-6 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <IconComponent className="w-40 h-40 text-stone-900" />
            </div>

            <div className="relative z-10 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-mono uppercase font-black tracking-wider ${currentConfig.badgeColor}`}>
                  Selected Blueprint Mapping
                </span>
                <span className="text-[10px] font-mono text-stone-400 font-semibold">• Use Case Node</span>
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-display font-black text-stone-900 tracking-tight flex items-center gap-2">
                  <IconComponent className="w-5 h-5 text-rose-600 shrink-0" />
                  {currentConfig.title}
                </h3>
                <p className="text-[10px] font-bold text-stone-400 font-mono tracking-wide uppercase">
                  {currentConfig.subtitle}
                </p>
              </div>

              <p className="text-xs text-stone-650 leading-relaxed font-sans font-medium">
                {currentConfig.description}
              </p>

              <div className="p-3 bg-white border border-stone-200 rounded-2xl flex items-center gap-3">
                <div className="w-1.5 h-12 rounded-full bg-rose-500 shrink-0" />
                <p className="text-xs text-stone-750 font-sans font-semibold italic">
                  {currentConfig.valueProp}
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Automation Cycle Steps Flowbar */}
          <div className="bg-white border border-stone-200/60 p-5 rounded-3xl shadow-xs">
            <h3 className="text-[11px] font-mono tracking-widest uppercase text-stone-400 font-extrabold mb-5">RPA Workflow Execution Progress</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
              {stepsList.map((step, idx) => {
                const isCompleted = idx < currentStep || (isRunning && progress === 100);
                const isActive = idx === currentStep && isRunning;
                const isFuture = idx > currentStep && !isCompleted;
                
                return (
                  <div 
                    key={idx} 
                    className={`flex flex-col items-center justify-between p-3 rounded-2xl border text-center relative transition-all ${
                      isActive 
                        ? 'bg-rose-50/70 border-rose-300 ring-1 ring-rose-200 shadow-xs' 
                        : isCompleted 
                        ? 'bg-emerald-50/50 border-emerald-200/70' 
                        : 'bg-stone-50/50 border-stone-200/40 opacity-70'
                    }`}
                  >
                    {/* Circle Indicator */}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold border transition-all ${
                      isActive 
                        ? 'bg-rose-600 text-white border-rose-500 animate-pulse' 
                        : isCompleted 
                        ? 'bg-emerald-600 text-white border-emerald-500' 
                        : 'bg-white text-stone-400 border-stone-200'
                    }`}>
                      {isCompleted ? '✓' : idx + 1}
                    </div>

                    <div className="mt-2 text-wrap leading-tight">
                      <p className={`text-[9px] font-extrabold tracking-tight ${isActive ? 'text-rose-900' : isCompleted ? 'text-emerald-950 font-extrabold' : 'text-stone-700'}`}>
                        {step.label}
                      </p>
                    </div>

                    {/* Horizontal link lines for bigger screens */}
                    {idx < stepsList.length - 1 && (
                      <div className="hidden md:block absolute top-[21px] left-[70%] right-[-30%] h-[1px] bg-stone-200 pointer-events-none z-10" />
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

      </div>

    </div>
  );
}
