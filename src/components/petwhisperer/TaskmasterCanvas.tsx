import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, Play, Pause, Volume2, ShieldCheck, Sparkles, Database, 
  ExternalLink, Zap, Award, Layers, Eye, RefreshCw, Sliders, 
  Download, CheckCircle2, Clock, AlertTriangle, Cpu, Terminal, ArrowRight
} from 'lucide-react';
import { PipelineExecutionResult, StageTrace } from './types';

interface TaskmasterCanvasProps {
  treatsBalance: number;
  onTreatsEarned: (amount: number) => void;
}

export const TaskmasterCanvas: React.FC<TaskmasterCanvasProps> = ({
  treatsBalance,
  onTreatsEarned
}) => {
  // Simulator Controls
  const [triggerType, setTriggerType] = useState<string>('doorbell-92db');
  const [arousalMagnitude, setArousalMagnitude] = useState<number>(78);
  const [ambientDb, setAmbientDb] = useState<number>(92.4);
  const [solfeggioFreq, setSolfeggioFreq] = useState<432 | 528>(432);
  const [ultrasonicEnabled, setUltrasonicEnabled] = useState<boolean>(true);
  const [isAutonomousLoopActive, setIsAutonomousLoopActive] = useState<boolean>(false);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  // Execution state & History
  const [currentResult, setCurrentResult] = useState<PipelineExecutionResult | null>(null);
  const [activeStageStep, setActiveStageStep] = useState<number>(0);
  const [executionLogs, setExecutionLogs] = useState<PipelineExecutionResult[]>([]);
  const [showArchDiagramModal, setShowArchDiagramModal] = useState<boolean>(false);

  // Web Audio Context & Oscillator Synthesizer Ref
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorNodeRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Autonomous Sensor Loop Timer
  useEffect(() => {
    let interval: any = null;
    if (isAutonomousLoopActive) {
      interval = setInterval(() => {
        if (!isExecuting) {
          const triggers = ['doorbell-92db', 'thunderstorm-infrasound', 'separation-anxiety', 'postural-tension'];
          const randomTrigger = triggers[Math.floor(Math.random() * triggers.length)];
          const randomArousal = Math.floor(Math.random() * 45) + 48; // 48-93%
          const randomDb = Number((75 + Math.random() * 20).toFixed(1));
          
          handleExecutePipeline(randomTrigger, randomArousal, randomDb);
        }
      }, 9000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutonomousLoopActive, isExecuting]);

  // Cleanup Audio
  useEffect(() => {
    return () => {
      stopAudioSynthesis();
    };
  }, []);

  // Web Audio API Synthesizer (432 Hz / 528 Hz Solfeggio with smooth attack/decay)
  const playSolfeggioSynthesis = (freq: number, durationSec: number = 6) => {
    try {
      stopAudioSynthesis();
      
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Smooth attack & decay
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationSec);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + durationSec);

      oscillatorNodeRef.current = osc;
      gainNodeRef.current = gain;
      setIsPlayingAudio(true);

      osc.onended = () => {
        setIsPlayingAudio(false);
      };
    } catch (e) {
      console.warn("Web Audio API synthesis initialization error:", e);
    }
  };

  const stopAudioSynthesis = () => {
    try {
      if (oscillatorNodeRef.current) {
        oscillatorNodeRef.current.stop();
        oscillatorNodeRef.current.disconnect();
        oscillatorNodeRef.current = null;
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      setIsPlayingAudio(false);
    } catch (e) {
      // ignore
    }
  };

  // Main 5-Stage Pipeline Execution
  const handleExecutePipeline = async (
    tType: string = triggerType,
    arousal: number = arousalMagnitude,
    db: number = ambientDb
  ) => {
    if (isExecuting) return;
    setIsExecuting(true);
    setActiveStageStep(1);

    try {
      // Step 1: Sensory Ingestion transition animation
      await new Promise(r => setTimeout(r, 200));
      setActiveStageStep(2);

      const response = await fetch('/api/taskmaster/execute-pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          triggerType: tType,
          arousalMagnitude: arousal,
          ambientDb: db,
          audioInterventionFreq: solfeggioFreq,
          userWalletAddress: 'Sol7x9B...treats'
        })
      });

      const data: PipelineExecutionResult = await response.json();

      if (data && data.stages) {
        // Step 3: Bio-acoustic dispatch
        setActiveStageStep(3);
        playSolfeggioSynthesis(solfeggioFreq, 8);

        // Step 4: Snowflake Data Lake Telemetry
        await new Promise(r => setTimeout(r, 250));
        setActiveStageStep(4);

        // Step 5: Solana Devnet On-Chain Proof
        await new Promise(r => setTimeout(r, 300));
        setActiveStageStep(5);

        setCurrentResult(data);
        setExecutionLogs(prev => [data, ...prev.slice(0, 19)]);
        onTreatsEarned(25);
      }
    } catch (err) {
      console.error("Pipeline execution error:", err);
    } finally {
      setIsExecuting(false);
    }
  };

  // 4K Architecture Diagram Blueprint SVG/PNG Download Generator
  const handleDownloadBlueprint = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 3840;
    canvas.height = 2160;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background Canvas
    ctx.fillStyle = '#FAF9F6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines
    ctx.strokeStyle = '#E5E4E0';
    ctx.lineWidth = 2;
    for (let x = 0; x < canvas.width; x += 120) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 120) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Border Frame
    ctx.strokeStyle = '#1A1A1A';
    ctx.lineWidth = 12;
    ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);

    // Title Section
    ctx.fillStyle = '#1A1A1A';
    ctx.font = 'bold 84px "Playfair Display", serif';
    ctx.fillText('PETWHISPERER AI (CANINEWHISPERER)', 140, 200);

    ctx.font = '36px "JetBrains Mono", monospace';
    ctx.fillStyle = '#666666';
    ctx.fillText('AUTONOMOUS 5-STAGE VETERINARY ETHOLOGY & MULTIMODAL DE-ESCALATION PIPELINE', 140, 260);

    // 5 Stages Nodes Box
    const stages = [
      { num: 'STAGE 01', title: 'SENSORY INGESTION', desc: 'Passive Acoustic FFT (92dB) + Video Frame Stream', color: '#1A1A1A' },
      { num: 'STAGE 02', title: 'GEMINI 3.7 FLASH TRIAGE', desc: 'Canine Arousal Index & Cognitive Cortisol Assessment', color: '#B45309' },
      { num: 'STAGE 03', title: 'BIO-ACOUSTIC DISPATCH', desc: 'Web Audio API 432Hz / 528Hz Solfeggio Sine Entrainment', color: '#047857' },
      { num: 'STAGE 04', title: 'SNOWFLAKE DW TELEMETRY', desc: 'Cortex ML Feature Vector & Parametric SQL Ingestion', color: '#0284C7' },
      { num: 'STAGE 05', title: 'SOLANA DEVNET PROOFS', desc: 'ed25519 On-Chain Memo Transaction & +25 $TREATS Mint', color: '#7C3AED' }
    ];

    stages.forEach((st, idx) => {
      const boxX = 140 + idx * 720;
      const boxY = 480;
      const boxW = 660;
      const boxH = 920;

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(boxX, boxY, boxW, boxH);
      ctx.strokeStyle = '#1A1A1A';
      ctx.lineWidth = 6;
      ctx.strokeRect(boxX, boxY, boxW, boxH);

      ctx.fillStyle = st.color;
      ctx.fillRect(boxX, boxY, boxW, 80);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 32px "JetBrains Mono", monospace';
      ctx.fillText(st.num, boxX + 30, boxY + 52);

      ctx.fillStyle = '#1A1A1A';
      ctx.font = 'bold 40px "Playfair Display", serif';
      ctx.fillText(st.title, boxX + 30, boxY + 160);

      ctx.font = '28px "JetBrains Mono", monospace';
      ctx.fillStyle = '#444444';
      ctx.fillText(st.desc, boxX + 30, boxY + 240, boxW - 60);

      // Connecting Arrow
      if (idx < 4) {
        ctx.fillStyle = '#1A1A1A';
        ctx.font = '48px monospace';
        ctx.fillText('➔', boxX + boxW + 15, boxY + 450);
      }
    });

    // Technical Footer Specs
    ctx.fillStyle = '#1A1A1A';
    ctx.font = '30px "JetBrains Mono", monospace';
    ctx.fillText('RUNTIME: Node.js Express Port 3000 | MODEL: Gemini 3.7 Flash | ON-CHAIN: Solana Devnet | DATA LAKE: Snowflake Cortex', 140, 2020);

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `PetWhisperer_4K_System_Architecture_Blueprint_${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="space-y-8 bg-[#FAF9F6] text-[#1A1A1A] p-4 sm:p-6 lg:p-8 rounded-3xl border border-stone-800 shadow-sm" id="petwhisperer-canvas-container">
      
      {/* Editorial Header & Command Strip */}
      <div className="border-b border-stone-800 pb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 bg-amber-500/20 text-amber-900 border border-amber-500/40 text-[11px] font-mono font-black tracking-widest uppercase rounded-full flex items-center gap-1.5 animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              TRACK 1 PRIMARY: AUTONOMOUS TASKMASTER
            </span>
            <span className="text-xs font-mono text-stone-500">v3.7-Flash Autonomous</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif italic font-black text-[#1A1A1A] mt-2 tracking-tight">
            Autonomous Taskmaster Workflow Canvas
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 font-serif mt-1 max-w-3xl">
            Cross-species veterinary ethology engine combining real-time passive acoustic triggers, cognitive reasoning with Gemini 3.7 Flash, Solfeggio bio-harmonic tone synthesis, Snowflake Data Lake telemetry, and Solana on-chain verifiable proof.
          </p>
        </div>

        {/* Global Controls & Wallet Treats */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="px-4 py-2 bg-stone-900 text-amber-400 font-mono text-xs font-bold rounded-2xl border border-amber-500/40 flex items-center gap-2 shadow-sm">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Balance: <strong className="text-white">{treatsBalance}</strong> $TREATS</span>
          </div>

          <button
            onClick={() => setShowArchDiagramModal(true)}
            className="px-3.5 py-2 bg-white hover:bg-stone-100 text-stone-900 text-xs font-mono font-bold rounded-2xl border border-stone-800 flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
            id="view-4k-blueprint-btn"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>4K Architecture</span>
          </button>

          <button
            onClick={handleDownloadBlueprint}
            className="px-3.5 py-2 bg-stone-900 hover:bg-black text-white text-xs font-mono font-bold rounded-2xl border border-stone-900 flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
            id="download-blueprint-png-btn"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PNG Diagram</span>
          </button>
        </div>
      </div>

      {/* Interactive Trigger Simulator & Arousal Controller Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Event Simulator (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-stone-800 rounded-3xl p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-700" />
              <h2 className="text-sm font-mono font-black uppercase tracking-wider text-stone-900">
                01 Event Simulator
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[11px] font-mono text-stone-600 font-bold">Autonomous Sensor Loop:</label>
              <button
                onClick={() => setIsAutonomousLoopActive(!isAutonomousLoopActive)}
                className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold transition-all cursor-pointer ${
                  isAutonomousLoopActive 
                    ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400/40' 
                    : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                }`}
                id="toggle-sensor-loop-btn"
              >
                {isAutonomousLoopActive ? 'ACTIVE (Hands-Free)' : 'PAUSED'}
              </button>
            </div>
          </div>

          {/* Trigger Selection */}
          <div className="space-y-2.5">
            <label className="text-xs font-mono text-stone-700 font-bold block">
              Simulated Ingestion Trigger:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'doorbell-92db', label: 'Doorbell Chime (92dB)', icon: '🔔', desc: 'High-frequency acute spike' },
                { id: 'thunderstorm-infrasound', label: 'Thunder Infrasound', icon: '⚡', desc: 'Barometric low resonance' },
                { id: 'separation-anxiety', label: 'Separation Whine & Pacing', icon: '🐕', desc: 'Cyclic displacement pattern' },
                { id: 'postural-tension', label: 'Postural Tension & Whale Eye', icon: '👀', desc: 'Sympathetic freezing state' }
              ].map(trig => (
                <button
                  key={trig.id}
                  onClick={() => setTriggerType(trig.id)}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                    triggerType === trig.id 
                      ? 'bg-stone-900 text-white border-stone-900 shadow-sm' 
                      : 'bg-stone-50 text-stone-800 border-stone-300 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{trig.icon}</span>
                    <span className="text-xs font-bold font-serif leading-tight">{trig.label}</span>
                  </div>
                  <span className={`text-[10px] font-mono mt-1 ${triggerType === trig.id ? 'text-amber-300' : 'text-stone-500'}`}>
                    {trig.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Arousal Magnitude Slider */}
          <div className="space-y-2 bg-stone-50 p-4 rounded-2xl border border-stone-200">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-stone-700">Arousal Magnitude Index:</span>
              <span className={`px-2 py-0.5 rounded font-black text-xs ${
                arousalMagnitude > 80 ? 'bg-red-100 text-red-700 border border-red-300' :
                arousalMagnitude > 60 ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                'bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}>
                {arousalMagnitude}% ({arousalMagnitude > 80 ? 'Severe Cortisol' : arousalMagnitude > 60 ? 'High Agitation' : 'Moderate Alert'})
              </span>
            </div>
            <input
              type="range"
              min={30}
              max={100}
              value={arousalMagnitude}
              onChange={e => setArousalMagnitude(Number(e.target.value))}
              className="w-full h-2 bg-stone-300 rounded-lg appearance-none cursor-pointer accent-stone-900"
            />
            <div className="flex justify-between text-[10px] font-mono text-stone-500">
              <span>30% (Mild Alert)</span>
              <span>65% (Displacement)</span>
              <span>100% (Acute Panic)</span>
            </div>
          </div>

          {/* Bio-Acoustic Calming Frequency Selector */}
          <div className="space-y-2 bg-stone-50 p-4 rounded-2xl border border-stone-200">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-stone-700">Intervention Waveform:</span>
              <button 
                onClick={() => playSolfeggioSynthesis(solfeggioFreq, 4)}
                className="text-[11px] text-amber-700 hover:text-amber-900 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                {isPlayingAudio ? 'Playing...' : 'Test Sound Wave'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSolfeggioFreq(432)}
                className={`p-2.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer text-center ${
                  solfeggioFreq === 432 
                    ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs' 
                    : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                }`}
              >
                432 Hz Solfeggio (Alpha Wave)
              </button>
              <button
                onClick={() => setSolfeggioFreq(528)}
                className={`p-2.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer text-center ${
                  solfeggioFreq === 528 
                    ? 'bg-purple-700 text-white border-purple-800 shadow-xs' 
                    : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                }`}
              >
                528 Hz (Cellular Harmony)
              </button>
            </div>
          </div>

          {/* Trigger Dispatch Button */}
          <button
            onClick={() => handleExecutePipeline()}
            disabled={isExecuting}
            className={`w-full p-4 rounded-2xl font-mono text-sm font-black flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-md ${
              isExecuting 
                ? 'bg-stone-400 text-stone-200 cursor-not-allowed' 
                : 'bg-stone-900 hover:bg-black text-amber-300 hover:text-amber-200 border-2 border-stone-900 active:scale-[0.99]'
            }`}
            id="dispatch-pipeline-cta-btn"
          >
            {isExecuting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                <span>Executing 5-Stage Autonomous Pipeline...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Dispatch Event & Execute Pipeline (+25 $TREATS)</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: 5-Node Visual Trace & Real-Time Output (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-stone-800 rounded-3xl p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-stone-900" />
              <h2 className="text-sm font-mono font-black uppercase tracking-wider text-stone-900">
                02 Real-Time 5-Node Execution Trace
              </h2>
            </div>
            {currentResult && (
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded text-[11px] font-mono font-bold flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-600" />
                {currentResult.totalLatencyMs}ms Total Latency
              </span>
            )}
          </div>

          {/* 5-Node Horizontal Visual Trace */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {[
              { step: 1, name: '1. Ingested', tag: 'Acoustic FFT', color: 'border-stone-800' },
              { step: 2, name: '2. Triaged', tag: 'Gemini 3.7', color: 'border-amber-600' },
              { step: 3, name: '3. Dispatched', tag: '432Hz Audio', color: 'border-emerald-600' },
              { step: 4, name: '4. Streamed', tag: 'Snowflake DW', color: 'border-sky-600' },
              { step: 5, name: '5. Verified', tag: 'Solana Devnet', color: 'border-purple-600' }
            ].map((node) => {
              const isPassed = activeStageStep >= node.step || (currentResult && !isExecuting);
              const isCurrent = activeStageStep === node.step && isExecuting;

              return (
                <div
                  key={node.step}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col justify-between ${
                    isCurrent 
                      ? 'bg-amber-100 border-amber-600 shadow-md ring-2 ring-amber-400' 
                      : isPassed 
                        ? 'bg-stone-900 text-white border-stone-900' 
                        : 'bg-stone-50 text-stone-400 border-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold">Node 0{node.step}</span>
                    {isPassed && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                  </div>
                  <div className="font-serif font-black text-xs my-1">{node.name}</div>
                  <span className={`text-[9px] font-mono uppercase ${isPassed ? 'text-amber-300' : 'text-stone-500'}`}>
                    {node.tag}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Live Stage Details Accordion / Display */}
          {currentResult ? (
            <div className="space-y-4 animate-fadeIn">
              
              {/* Gemini 3.7 Flash Cognitive Assessment Box */}
              <div className="p-4 bg-stone-50 border border-stone-300 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <h3 className="text-xs font-mono font-black uppercase text-stone-900">
                      Gemini 3.7 Flash Cognitive Triage & Ethology Assessment
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-stone-500 font-bold">
                    Confidence: <strong className="text-emerald-700">{currentResult.stages.stage2_triage.confidence}%</strong>
                  </span>
                </div>

                <p className="text-xs font-serif text-stone-800 leading-relaxed italic">
                  "{currentResult.stages.stage2_triage.ethologicalAssessment}"
                </p>

                <div className="space-y-1 pt-2 border-t border-stone-200">
                  <span className="text-[10px] font-mono text-stone-500 font-bold uppercase block">Clinical Reasoning Chain:</span>
                  <ul className="grid grid-cols-1 gap-1">
                    {currentResult.stages.stage2_triage.reasoningSteps.map((step, idx) => (
                      <li key={idx} className="text-[11px] font-mono text-stone-700 flex items-start gap-1.5">
                        <span className="text-amber-600 font-bold">›</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Technical Telemetry Grid (Snowflake & Solana) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Snowflake Telemetry Card */}
                <div className="p-3.5 bg-sky-50/70 border border-sky-300 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase font-black text-sky-900 flex items-center gap-1">
                      <Database className="w-3.5 h-3.5 text-sky-700" /> Snowflake Cortex Telemetry
                    </span>
                    <span className="text-[10px] font-mono text-sky-700">{currentResult.stages.stage4_snowflake.latencyMs}ms</span>
                  </div>
                  <div className="font-mono text-[10px] text-sky-950 bg-sky-100/80 p-2 rounded-xl border border-sky-200 overflow-x-auto">
                    <code>{currentResult.stages.stage4_snowflake.sqlQuery.substring(0, 160)}...</code>
                  </div>
                  <div className="text-[10px] font-mono text-sky-800">
                    Query ID: <strong className="text-stone-900">{currentResult.stages.stage4_snowflake.queryId}</strong>
                  </div>
                </div>

                {/* Solana Devnet On-Chain Proof Card */}
                <div className="p-3.5 bg-purple-50/70 border border-purple-300 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase font-black text-purple-900 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-700" /> Solana Devnet Memo Proof
                    </span>
                    <span className="text-[10px] font-mono text-purple-700">{currentResult.stages.stage5_solana.latencyMs}ms</span>
                  </div>
                  <div className="font-mono text-[10px] text-purple-950 bg-purple-100/80 p-2 rounded-xl border border-purple-200 break-all">
                    <span>{currentResult.stages.stage5_solana.memoPayload}</span>
                  </div>
                  <a
                    href={currentResult.stages.stage5_solana.explorerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-purple-800 hover:text-purple-950 underline cursor-pointer"
                  >
                    <span>View Solana Devnet Tx</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

              </div>

            </div>
          ) : (
            <div className="p-12 text-center border-2 border-dashed border-stone-300 rounded-2xl space-y-3">
              <Cpu className="w-8 h-8 text-stone-400 mx-auto animate-bounce" />
              <h3 className="font-serif font-black text-base text-stone-700">Autonomous Sensor Pipeline Standing By</h3>
              <p className="text-xs font-mono text-stone-500 max-w-md mx-auto">
                Select an acoustic or behavioral trigger on the left, adjust arousal parameters, and dispatch the 5-node autonomous pipeline.
              </p>
            </div>
          )}

        </div>

      </div>

      {/* Latency Tracking Audit Table */}
      <div className="bg-white border border-stone-800 rounded-3xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-stone-900" />
            <h2 className="text-sm font-mono font-black uppercase tracking-wider text-stone-900">
              03 Pipeline Latency Tracking & Incident Audit Table
            </h2>
          </div>
          <span className="text-xs font-mono text-stone-500">
            {executionLogs.length} Processed Autonomous Events
          </span>
        </div>

        {executionLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-stone-300 bg-stone-50 text-stone-600 font-bold uppercase text-[10px]">
                  <th className="p-2.5">Event ID</th>
                  <th className="p-2.5">Trigger</th>
                  <th className="p-2.5">Arousal</th>
                  <th className="p-2.5">Cortisol</th>
                  <th className="p-2.5">Triage (G3.7)</th>
                  <th className="p-2.5">Snowflake DW</th>
                  <th className="p-2.5">Solana Devnet</th>
                  <th className="p-2.5">Total Latency</th>
                  <th className="p-2.5">Solana Proof</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {executionLogs.map((log) => (
                  <tr key={log.eventId} className="hover:bg-stone-50 transition-colors">
                    <td className="p-2.5 font-bold text-stone-900">{log.eventId}</td>
                    <td className="p-2.5">{log.triggerType}</td>
                    <td className="p-2.5 font-bold text-amber-700">{log.arousalMagnitude}%</td>
                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.stages.stage2_triage.cortisolRisk === 'Severe' ? 'bg-red-100 text-red-800' :
                        log.stages.stage2_triage.cortisolRisk === 'High' ? 'bg-amber-100 text-amber-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {log.stages.stage2_triage.cortisolRisk}
                      </span>
                    </td>
                    <td className="p-2.5">{log.stages.stage2_triage.latencyMs}ms</td>
                    <td className="p-2.5">{log.stages.stage4_snowflake.latencyMs}ms</td>
                    <td className="p-2.5">{log.stages.stage5_solana.latencyMs}ms</td>
                    <td className="p-2.5 font-bold text-stone-900">{log.totalLatencyMs}ms</td>
                    <td className="p-2.5">
                      <a
                        href={log.stages.stage5_solana.explorerUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-purple-700 hover:text-purple-950 underline flex items-center gap-1 font-bold"
                      >
                        <span>Tx Hash</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-xs font-mono text-stone-400">
            No previous execution events logged in this session yet. Dispatch an event above to initialize the telemetry audit feed.
          </div>
        )}
      </div>

      {/* 4K System Architecture Diagram Modal */}
      {showArchDiagramModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn" id="arch-modal">
          <div className="max-w-4xl w-full bg-[#FAF9F6] border-2 border-stone-900 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <h3 className="text-lg font-serif font-black text-stone-900">
                  PetWhisperer AI: 4K System Architecture Blueprint
                </h3>
                <p className="text-xs font-mono text-stone-500">
                  5-Stage Distributed Edge & Cloud Coordination Model
                </p>
              </div>
              <button
                onClick={() => setShowArchDiagramModal(false)}
                className="px-3 py-1.5 bg-stone-900 text-white hover:bg-black font-mono text-xs rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>

            {/* Architecture Node Blueprint */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {[
                  { title: 'Stage 1: Sensory Ingestion', badge: 'Passive IoT Node', desc: '48kHz acoustic FFT sensor + RTSP camera frame watcher.' },
                  { title: 'Stage 2: Gemini 3.7 Flash', badge: 'Cognitive Triage', desc: 'Canine Arousal Index & SOAP medical assessment vectors.' },
                  { title: 'Stage 3: Bio-Acoustics', badge: 'Web Audio API', desc: '432Hz / 528Hz Solfeggio pure harmonic sine de-escalation.' },
                  { title: 'Stage 4: Snowflake DW', badge: 'Data Lake Lakehouse', desc: 'Parametric INSERT & Cortex ML incident feature embeddings.' },
                  { title: 'Stage 5: Solana Devnet', badge: 'On-Chain Verifiable', desc: 'ed25519 memo proof & +25 $TREATS wallet minting.' }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 bg-white border border-stone-800 rounded-2xl space-y-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-stone-100 rounded border border-stone-300 font-bold block w-fit">
                      {item.badge}
                    </span>
                    <h4 className="font-serif font-black text-xs text-stone-900">{item.title}</h4>
                    <p className="text-[11px] font-mono text-stone-600">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-stone-900 text-amber-300 font-mono text-xs rounded-2xl border border-stone-800 space-y-1">
                <div className="font-bold text-white uppercase text-[10px] tracking-wider">Production Deployment Parameters:</div>
                <div>Runtime: Node.js Express 4.21.2 | Ingress Host: 0.0.0.0:3000 | SDK: @google/genai 2.4.0</div>
                <div>Solana Network: Devnet RPC Endpoint | Snowflake Schema: CANINE_TELEMETRY.AUTONOMOUS_INCIDENTS</div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-stone-200">
              <button
                onClick={handleDownloadBlueprint}
                className="px-5 py-2.5 bg-stone-900 hover:bg-black text-amber-300 font-mono text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download High-Resolution PNG Blueprint</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
