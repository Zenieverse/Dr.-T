import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Play, 
  Volume2, 
  VolumeX, 
  Activity, 
  Cpu, 
  Database, 
  Coins, 
  Radio, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Sliders, 
  RefreshCw,
  Bell,
  CloudLightning,
  HeartCrack,
  Flame,
  Layers,
  ArrowRight,
  Eye
} from 'lucide-react';
import { audioSynth } from './audioSynth';
import { TaskmasterEventResult, IncidentAuditLog } from './types';
import { ArchitectureDiagramModal } from './ArchitectureDiagramModal';

export const AutonomousTaskmasterCanvas: React.FC = () => {
  // Preset Triggers
  const PRESET_TRIGGERS = [
    { id: 'doorbell', title: 'Doorbell Ringing (92 dB Acoustic Spike)', db: 92, defaultArousal: 86, icon: <Bell className="w-4 h-4 text-amber-600" /> },
    { id: 'thunder', title: 'Thunderstorm Acoustic Spike & Infrasound (92 dB)', db: 92, defaultArousal: 94, icon: <CloudLightning className="w-4 h-4 text-purple-600" /> },
    { id: 'anxiety', title: 'Separation Anxiety Pacing & Whining (78 dB)', db: 78, defaultArousal: 72, icon: <HeartCrack className="w-4 h-4 text-rose-600" /> },
    { id: 'leash', title: 'Leash Reactivity & Spinal Stiffening (74 dB)', db: 74, defaultArousal: 80, icon: <Flame className="w-4 h-4 text-orange-600" /> }
  ];

  const [selectedTrigger, setSelectedTrigger] = useState(PRESET_TRIGGERS[0].title);
  const [arousalMagnitude, setArousalMagnitude] = useState<number>(86);
  const [isAutonomousLoopActive, setIsAutonomousLoopActive] = useState<boolean>(false);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState<boolean>(false);

  // Active Pipeline Execution Result
  const [pipelineResult, setPipelineResult] = useState<TaskmasterEventResult | null>({
    eventId: 'evt_init_894f2a',
    timestamp: new Date().toISOString(),
    trigger: 'Doorbell Ringing (92 dB Acoustic Spike)',
    arousalMagnitude: 86,
    pipelineNodes: {
      node1SensorIngestion: { status: 'COMPLETED', label: 'Sensor Ingestion', detail: 'Acoustic FFT & Video Stream Watcher ➔ Ingested', latencyMs: 18 },
      node2GeminiDiagnosis: { 
        status: 'COMPLETED', 
        label: 'Gemini Diagnosis', 
        detail: 'Ethology Cognitive Core (Arousal 86/100)', 
        latencyMs: 240,
        analysis: {
          diagnosedState: 'Acute Auditory Reactivity / Territorial Vigilance',
          cortisolRisk: 'HIGH_CORTISOL_SURGE',
          arousalScore: 86,
          f0FrequencyHz: 620,
          chainOfThought: [
            '[Sensory Intake]: Detected sharp 92 dB transient spike with high onset velocity.',
            '[Ethological Triage]: Sympathetic activation and thoracic muscle rigidity detected.',
            '[Acoustic Intervention]: 432 Hz counter-conditioning sine wave tone emitted via Web Audio API.',
            '[Data Ledger]: Incident logged to Snowflake DW and verified on Solana Devnet with +26 TREATS.'
          ],
          recommendedFrequencyHz: 432,
          interventionStrategy: '432 Hz Harmonic Resonator + Olfactory Scatter Reset',
          solanaTxSig: '5KqY8x7mDevnetTxn7x9aP2b',
          treatsMinted: 26
        }
      },
      node3AcousticIntervention: { status: 'COMPLETED', label: 'Acoustic Intervention', detail: 'Dispatched 432 Hz Restorative Resonator', latencyMs: 14 },
      node4SnowflakeStreaming: { status: 'COMPLETED', label: 'Snowflake DW Telemetry', detail: 'Cortex ML Incident Logged ➔ Table CANINE_INCIDENT_STREAM', latencyMs: 45 },
      node5SolanaVerification: { 
        status: 'COMPLETED', 
        label: 'Solana Devnet Proof', 
        detail: 'ed25519 Passport Verified ➔ +26 TREATS Minted', 
        txSig: '5KqY8x7mDevnetTxn7x9aP2b',
        explorerUrl: 'https://explorer.solana.com/tx/5KqY8x7mDevnetTxn7x9aP2b?cluster=devnet',
        latencyMs: 110 
      }
    },
    cognitiveBox: {
      diagnosedState: 'Acute Auditory Reactivity / Territorial Vigilance',
      cortisolRisk: 'HIGH_CORTISOL_SURGE',
      arousalScore: 86,
      f0FrequencyHz: 620,
      chainOfThought: [
        '[Sensory Intake]: Detected sharp 92 dB transient spike with high onset velocity.',
        '[Ethological Triage]: Sympathetic activation and thoracic muscle rigidity detected.',
        '[Acoustic Intervention]: 432 Hz counter-conditioning sine wave tone emitted via Web Audio API.',
        '[Data Ledger]: Incident logged to Snowflake DW and verified on Solana Devnet with +26 TREATS.'
      ],
      recommendedFrequencyHz: 432,
      interventionStrategy: '432 Hz Harmonic Resonator + Olfactory Scatter Reset',
      solanaTxSig: '5KqY8x7mDevnetTxn7x9aP2b',
      treatsMinted: 26
    },
    totalLatencyMs: 427
  });

  // Incident Audit Log History
  const [auditLogs, setAuditLogs] = useState<IncidentAuditLog[]>([
    {
      id: 'evt_98f12a',
      timestamp: new Date(Date.now() - 1000 * 60 * 4).toLocaleTimeString(),
      trigger: 'Doorbell Ringing (92 dB Acoustic Spike)',
      arousal: 86,
      state: 'Acute Territorial Reactivity',
      latencyMs: 427,
      solanaTx: '5KqY8x7m...Devnet',
      treats: 26
    },
    {
      id: 'evt_44e87c',
      timestamp: new Date(Date.now() - 1000 * 60 * 18).toLocaleTimeString(),
      trigger: 'Thunderstorm Acoustic Spike & Infrasound (92 dB)',
      arousal: 94,
      state: 'Severe Infrasound Phobia',
      latencyMs: 388,
      solanaTx: '3NmP4k2...Devnet',
      treats: 28
    },
    {
      id: 'evt_12b90d',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toLocaleTimeString(),
      trigger: 'Separation Anxiety Pacing & Whining (78 dB)',
      arousal: 72,
      state: 'Isolation Stress Cascade',
      latencyMs: 412,
      solanaTx: '8VxL1q9...Devnet',
      treats: 23
    }
  ]);

  const stopAudioRef = useRef<(() => void) | null>(null);

  // Play / Stop 432 Hz Tone
  const handleToggle432HzTone = () => {
    if (isPlayingAudio) {
      if (stopAudioRef.current) stopAudioRef.current();
      audioSynth.stopCurrent();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      const stopFn = audioSynth.play432HzTone(6, 0.3);
      stopAudioRef.current = stopFn;
      setTimeout(() => {
        setIsPlayingAudio(false);
      }, 6000);
    }
  };

  // Execute the 5-Stage Pipeline
  const handleExecutePipeline = async () => {
    setIsExecuting(true);
    try {
      // Play 432 Hz tone automatically on de-escalation intervention
      audioSynth.play432HzTone(5, 0.25);
      setIsPlayingAudio(true);
      setTimeout(() => setIsPlayingAudio(false), 5000);

      const res = await fetch('/api/taskmaster/execute-pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trigger: selectedTrigger,
          arousalMagnitude: arousalMagnitude,
          subject: 'Buster (Golden Retriever, 3yo / CGC Certified)',
        })
      });

      if (res.ok) {
        const data = await res.json();
        setPipelineResult(data);

        // Add to audit logs
        const newLog: IncidentAuditLog = {
          id: data.eventId,
          timestamp: new Date().toLocaleTimeString(),
          trigger: selectedTrigger,
          arousal: arousalMagnitude,
          state: data.cognitiveBox.diagnosedState,
          latencyMs: data.totalLatencyMs,
          solanaTx: data.cognitiveBox.solanaTxSig.slice(0, 10) + '...',
          treats: data.cognitiveBox.treatsMinted
        };
        setAuditLogs(prev => [newLog, ...prev.slice(0, 10)]);
      }
    } catch (err) {
      console.warn('Pipeline execution error:', err);
    } finally {
      setIsExecuting(false);
    }
  };

  // Autonomous background loop
  useEffect(() => {
    let interval: any;
    if (isAutonomousLoopActive) {
      interval = setInterval(() => {
        const randomPreset = PRESET_TRIGGERS[Math.floor(Math.random() * PRESET_TRIGGERS.length)];
        setSelectedTrigger(randomPreset.title);
        const randomArousal = Math.floor(Math.random() * 40) + 60;
        setArousalMagnitude(randomArousal);
        handleExecutePipeline();
      }, 12000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutonomousLoopActive]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner: Control Strip & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1A1A1A]/20 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-extrabold bg-amber-400 text-black border border-amber-500 animate-pulse">
              TRACK 1 PRIMARY
            </span>
            <span className="text-xs font-mono text-stone-500">
              5-STAGE AUTONOMOUS ETHOLOGY ENGINE
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif italic font-light text-[#1A1A1A] mt-1">
            Autonomous Taskmaster Pipeline
          </h1>
          <p className="text-xs sm:text-sm font-mono text-stone-600 max-w-3xl mt-1">
            Real-time multimodal de-escalation workflow correlating ambient acoustic spikes, Gemini 3.7 cognitive triage, 432 Hz restorative audio synthesis, Snowflake DW telemetry, and Solana Devnet on-chain proof verification.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsArchitectureModalOpen(true)}
            className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-white border border-[#1A1A1A] text-xs font-mono font-bold text-[#1A1A1A] hover:bg-stone-100 transition shadow-xs"
          >
            <Layers className="w-4 h-4 text-amber-600" />
            <span>Architecture Blueprint</span>
          </button>

          <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-xl border border-[#1A1A1A] shadow-xs">
            <div className="text-[11px] font-mono font-bold text-[#1A1A1A]">Autonomous Loop:</div>
            <button
              onClick={() => setIsAutonomousLoopActive(!isAutonomousLoopActive)}
              className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
                isAutonomousLoopActive ? 'bg-emerald-600' : 'bg-stone-300'
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                  isAutonomousLoopActive ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-[10px] font-mono font-bold ${isAutonomousLoopActive ? 'text-emerald-700' : 'text-stone-400'}`}>
              {isAutonomousLoopActive ? 'WATCHING' : 'OFF'}
            </span>
          </div>
        </div>
      </div>

      {/* Simulator Control Board */}
      <div className="p-6 rounded-2xl bg-white border border-[#1A1A1A] shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-[#1A1A1A]" />
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#1A1A1A]">
              Sensory Trigger & Arousal Control Board
            </h2>
          </div>
          <span className="text-xs font-mono text-stone-500">
            Current Subject: <strong>Buster (Golden Retriever, 3yo)</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESET_TRIGGERS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                setSelectedTrigger(preset.title);
                setArousalMagnitude(preset.defaultArousal);
              }}
              className={`p-3.5 rounded-xl text-left border transition text-xs font-mono flex flex-col justify-between space-y-2 ${
                selectedTrigger === preset.title
                  ? 'bg-amber-50 border-amber-500 shadow-2xs'
                  : 'bg-[#FAF9F6] border-stone-200 hover:border-stone-400'
              }`}
            >
              <div className="flex items-center justify-between">
                {preset.icon}
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white border border-stone-200 text-stone-800">
                  {preset.db} dB Peak
                </span>
              </div>
              <div className="font-bold text-stone-900 leading-snug line-clamp-2">
                {preset.title}
              </div>
              <div className="text-[10px] text-stone-500 flex justify-between">
                <span>Default Arousal:</span>
                <span className="font-bold text-amber-700">{preset.defaultArousal}%</span>
              </div>
            </button>
          ))}
        </div>

        {/* Magnitude Slider & Dispatch Button */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 items-center">
          <div className="md:col-span-2 space-y-2">
            <div className="flex justify-between text-xs font-mono text-[#1A1A1A]">
              <span className="font-bold">Arousal Magnitude Index:</span>
              <span className="font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                {arousalMagnitude}% / 100 (Sympathetic Activation)
              </span>
            </div>
            <input
              type="range"
              min="30"
              max="100"
              value={arousalMagnitude}
              onChange={(e) => setArousalMagnitude(Number(e.target.value))}
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#1A1A1A]"
            />
            <div className="flex justify-between text-[10px] font-mono text-stone-400">
              <span>30% Mild Vigilance</span>
              <span>65% Active Barking</span>
              <span>100% Acute Panic / Cortisol Surge</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleExecutePipeline}
              disabled={isExecuting}
              className="flex-1 py-3 px-4 rounded-xl bg-[#1A1A1A] hover:bg-stone-800 text-white font-mono font-bold text-xs flex items-center justify-center space-x-2 transition shadow-md disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 text-amber-400 ${isExecuting ? 'animate-spin' : ''}`} />
              <span>{isExecuting ? 'Triaging Incident...' : 'Dispatch Event & Execute'}</span>
            </button>

            <button
              onClick={handleToggle432HzTone}
              title="Test 432 Hz Restorative Sine Tone"
              className={`p-3 rounded-xl border transition text-xs font-mono font-bold ${
                isPlayingAudio 
                  ? 'bg-amber-400 border-amber-500 text-black animate-pulse' 
                  : 'bg-white border-[#1A1A1A] text-[#1A1A1A] hover:bg-stone-100'
              }`}
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* 5-Node Visual Horizontal Trace */}
      <div className="p-6 rounded-2xl bg-white border border-[#1A1A1A] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#1A1A1A]">
              5-Stage Autonomous Execution Trace
            </h2>
          </div>
          <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Total End-to-End Latency: {pipelineResult?.totalLatencyMs || 427} ms
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          
          {/* Node 1: Sensor Ingestion */}
          <div className="p-4 rounded-xl bg-[#FAF9F6] border border-stone-300 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-stone-500">NODE 01</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <h3 className="text-xs font-mono font-bold text-stone-900">Sensor Ingestion</h3>
            <p className="text-[11px] font-mono text-stone-600">
              {pipelineResult?.pipelineNodes.node1SensorIngestion.detail}
            </p>
            <div className="text-[10px] font-mono text-stone-400 pt-1 border-t border-stone-200">
              Latency: {pipelineResult?.pipelineNodes.node1SensorIngestion.latencyMs} ms
            </div>
          </div>

          {/* Node 2: Gemini Diagnosis */}
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-300 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-amber-800">NODE 02</span>
              <Cpu className="w-4 h-4 text-amber-600" />
            </div>
            <h3 className="text-xs font-mono font-bold text-stone-900">Gemini Diagnosis</h3>
            <p className="text-[11px] font-mono text-amber-900">
              {pipelineResult?.pipelineNodes.node2GeminiDiagnosis.detail}
            </p>
            <div className="text-[10px] font-mono text-amber-800 pt-1 border-t border-amber-200">
              Latency: {pipelineResult?.pipelineNodes.node2GeminiDiagnosis.latencyMs} ms
            </div>
          </div>

          {/* Node 3: Acoustic Intervention */}
          <div className="p-4 rounded-xl bg-[#FAF9F6] border border-stone-300 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-stone-500">NODE 03</span>
              <Volume2 className="w-4 h-4 text-sky-600" />
            </div>
            <h3 className="text-xs font-mono font-bold text-stone-900">Acoustic Intervention</h3>
            <p className="text-[11px] font-mono text-stone-600">
              {pipelineResult?.pipelineNodes.node3AcousticIntervention.detail}
            </p>
            <div className="text-[10px] font-mono text-stone-400 pt-1 border-t border-stone-200">
              Latency: {pipelineResult?.pipelineNodes.node3AcousticIntervention.latencyMs} ms
            </div>
          </div>

          {/* Node 4: Snowflake DW Streaming */}
          <div className="p-4 rounded-xl bg-[#FAF9F6] border border-stone-300 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-stone-500">NODE 04</span>
              <Database className="w-4 h-4 text-indigo-600" />
            </div>
            <h3 className="text-xs font-mono font-bold text-stone-900">Snowflake SQL DW</h3>
            <p className="text-[11px] font-mono text-stone-600">
              {pipelineResult?.pipelineNodes.node4SnowflakeStreaming.detail}
            </p>
            <div className="text-[10px] font-mono text-stone-400 pt-1 border-t border-stone-200">
              Latency: {pipelineResult?.pipelineNodes.node4SnowflakeStreaming.latencyMs} ms
            </div>
          </div>

          {/* Node 5: Solana Verification */}
          <div className="p-4 rounded-xl bg-purple-50/80 border border-purple-300 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-purple-800">NODE 05</span>
              <Coins className="w-4 h-4 text-purple-600" />
            </div>
            <h3 className="text-xs font-mono font-bold text-stone-900">Solana On-Chain Proof</h3>
            <p className="text-[11px] font-mono text-purple-900">
              {pipelineResult?.pipelineNodes.node5SolanaVerification.detail}
            </p>
            <div className="text-[10px] font-mono text-purple-800 pt-1 border-t border-purple-200 flex justify-between items-center">
              <span>{pipelineResult?.pipelineNodes.node5SolanaVerification.latencyMs} ms</span>
              <a
                href={pipelineResult?.pipelineNodes.node5SolanaVerification.explorerUrl || '#'}
                target="_blank"
                rel="noreferrer"
                className="text-purple-700 hover:underline flex items-center space-x-0.5"
              >
                <span>Explorer</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Inspectable Gemini 3.7 Cognitive Box */}
      <div className="p-6 rounded-2xl bg-[#1A1A1A] text-white space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-serif italic text-white">
              Gemini 3.7 Cognitive Ethology Engine Rationale
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-stone-800 text-amber-400 border border-stone-700">
              Model: gemini-3.7-flash
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-stone-800 text-emerald-400 border border-stone-700">
              Triage Status: RESOLVED
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 space-y-1">
            <div className="text-[10px] font-mono text-stone-400 uppercase">Diagnosed Ethological State</div>
            <div className="text-xs font-mono font-bold text-amber-300">
              {pipelineResult?.cognitiveBox.diagnosedState}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 space-y-1">
            <div className="text-[10px] font-mono text-stone-400 uppercase">Autonomic Cortisol Risk Tier</div>
            <div className="text-xs font-mono font-bold text-rose-400">
              {pipelineResult?.cognitiveBox.cortisolRisk}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 space-y-1">
            <div className="text-[10px] font-mono text-stone-400 uppercase">Recommended Harmonic Resonator</div>
            <div className="text-xs font-mono font-bold text-sky-400">
              {pipelineResult?.cognitiveBox.recommendedFrequencyHz} Hz Restorative Sine Wave
            </div>
          </div>
        </div>

        {/* Step-by-Step Chain of Thought */}
        <div className="space-y-2 pt-2">
          <div className="text-xs font-mono uppercase text-stone-400 tracking-wider">
            Step-by-Step Multimodal Chain of Thought:
          </div>
          <div className="space-y-1.5 font-mono text-xs text-stone-300 bg-stone-900/90 p-4 rounded-xl border border-stone-800">
            {pipelineResult?.cognitiveBox.chainOfThought.map((thought, idx) => (
              <div key={idx} className="flex items-start space-x-2">
                <span className="text-amber-400 font-bold">[{idx + 1}]</span>
                <span>{thought}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Incident Audit Log Table */}
      <div className="p-6 rounded-2xl bg-white border border-[#1A1A1A] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-[#1A1A1A]" />
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#1A1A1A]">
              Autonomous Incident Audit Stream (Snowflake DW & Solana)
            </h2>
          </div>
          <span className="text-xs font-mono text-stone-500">{auditLogs.length} Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 bg-stone-50 text-[11px]">
                <th className="p-3">EVENT ID</th>
                <th className="p-3">TIMESTAMP</th>
                <th className="p-3">TRIGGER PRESET</th>
                <th className="p-3">AROUSAL</th>
                <th className="p-3">DIAGNOSED STATE</th>
                <th className="p-3">LATENCY</th>
                <th className="p-3">SOLANA TX</th>
                <th className="p-3">TREATS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-stone-50 transition">
                  <td className="p-3 font-bold text-stone-900">{log.id}</td>
                  <td className="p-3 text-stone-500">{log.timestamp}</td>
                  <td className="p-3 text-stone-800 max-w-[200px] truncate">{log.trigger}</td>
                  <td className="p-3">
                    <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">
                      {log.arousal}%
                    </span>
                  </td>
                  <td className="p-3 text-stone-700">{log.state}</td>
                  <td className="p-3 text-stone-500">{log.latencyMs} ms</td>
                  <td className="p-3 text-purple-700">
                    <span className="underline cursor-pointer">{log.solanaTx}</span>
                  </td>
                  <td className="p-3 font-bold text-emerald-700">+{log.treats}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Architecture Modal */}
      <ArchitectureDiagramModal 
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
      />

    </div>
  );
};
