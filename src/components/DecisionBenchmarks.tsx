import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Activity, 
  Settings, 
  Cpu, 
  Leaf, 
  Bus, 
  Play, 
  Loader2, 
  Terminal, 
  CheckCircle, 
  Layers, 
  FileText 
} from "lucide-react";

export function DecisionBenchmarks() {
  const [isBenchmarking, setIsBenchmarking] = useState<boolean>(false);
  const [benchmarkProgress, setBenchmarkProgress] = useState<number>(0);
  const [benchmarkLogs, setBenchmarkLogs] = useState<string[]>([]);
  const [selectedBenchmark, setSelectedBenchmark] = useState<string>("monte-carlo");

  const runBenchmarkSimulation = () => {
    if (isBenchmarking) return;
    setIsBenchmarking(true);
    setBenchmarkProgress(0);
    setBenchmarkLogs([]);

    let bLogs: string[] = [];
    if (selectedBenchmark === "monte-carlo") {
      bLogs = [
        `[${new Date().toLocaleTimeString()}] INITIATING STOCHASTIC MONTE CARLO ANALYSIS: 500 scenarios queue...`,
        `[${new Date().toLocaleTimeString()}] VARIABLES BOUND: Budget Multipliers vs Citizen Trust Index`,
        `[${new Date().toLocaleTimeString()}] LLM INITIALIZATION: Calibrating variance seed with Gemini 3.5...`,
        `[${new Date().toLocaleTimeString()}] TRIAL 1-150: Simulating budget cuts. Expected trust variance: ±3.8%`,
        `[${new Date().toLocaleTimeString()}] TRIAL 151-300: Simulating administrative bottlenecks. Delays simulated up to 45%`,
        `[${new Date().toLocaleTimeString()}] TRIAL 301-500: Injecting emergency grid blackout conditions.`,
        `[${new Date().toLocaleTimeString()}] CALCULATING DISTRIBUTION: Standard deviation: 1.18. Mean confidence: 93.4%`,
        `[${new Date().toLocaleTimeString()}] POLICY GUIDELINE: 92.5% likelihood of achieving targets with optimized Socratic restructurings.`
      ];
    } else if (selectedBenchmark === "compliance") {
      bLogs = [
        `[${new Date().toLocaleTimeString()}] INITIATING CITIZEN COMPLIANCE & INCENTIVE ELASTICITY TRIAL...`,
        `[${new Date().toLocaleTimeString()}] VARIABLES BOUND: Community Wallet Coins vs Composting Sort Compliance`,
        `[${new Date().toLocaleTimeString()}] BASELINE AUDIT: Sorting compliance is currently 22.4% with zero incentives.`,
        `[${new Date().toLocaleTimeString()}] STAGE 1 ($0.50/cycle): compliance rises to 38.5% (+71% improvement)`,
        `[${new Date().toLocaleTimeString()}] STAGE 2 ($1.50/cycle + Leaderboard): compliance rises to 68.4%`,
        `[${new Date().toLocaleTimeString()}] STAGE 3 (Co-op Vouchers + Socratic Nudges): compliance peaks at 88.5%`,
        `[${new Date().toLocaleTimeString()}] ELASTICITY CALCULATION: 1.45x compliance multiplier per dollar allocated.`,
        `[${new Date().toLocaleTimeString()}] BUDGET ASSESSMENT: Wallet rewards offset municipal tipping fees perfectly.`
      ];
    } else {
      bLogs = [
        `[${new Date().toLocaleTimeString()}] INITIATING TRANSIT SYSTEM EMERGENCY OVERLOAD & ESCALATION TEST...`,
        `[${new Date().toLocaleTimeString()}] TRANSIT FLEET CONFIGURATION: 25 Autonomous Electric Buses`,
        `[${new Date().toLocaleTimeString()}] ROUTING PARAMETERS: Central Terminal loop connecting Clinical Core`,
        `[${new Date().toLocaleTimeString()}] DELAY COEFFICIENT: Adding 45% peak-hour traffic corridor bottlenecks...`,
        `[${new Date().toLocaleTimeString()}] BATCH_01: Dispatched 15 shuttles. Peak passenger congestion: 142% capacity.`,
        `[${new Date().toLocaleTimeString()}] DISPATCH CORRECTION: Dynamic routing algorithm redirects 4 idle buses to healthcare hubs.`,
        `[${new Date().toLocaleTimeString()}] PERFORMANCE AUDIT: Average travel delay reduced by 28.5 minutes per passenger.`,
        `[${new Date().toLocaleTimeString()}] CRITICAL RESULT: Battery drain rate remains stable under peak heater/cooler demand.`
      ];
    }

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

  return (
    <motion.div 
      key="benchmarks"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-6 font-sans relative overflow-hidden w-full text-stone-800"
      id="decision-benchmarks-container"
    >
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-rose-500/5 to-transparent rounded-bl-full pointer-events-none" />

      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-stone-150 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black text-rose-600 tracking-widest uppercase font-mono bg-rose-500/10 px-2.5 py-1 rounded-md">
              SOCRATIC EVALUATION &amp; STRESS ASSAYS
            </span>
            <span className="text-[9px] font-extrabold text-stone-400 font-mono">
              Decision Resiliency Core
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-stone-900 tracking-tight leading-none mt-2">
            Systemic Load &amp; Resiliency Testing
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed max-w-2xl mt-1">
            Execute micro-simulation trials to stress-test regional compliance, transit overloads, and fiscal sensitivity margins under volatile conditions.
          </p>
        </div>

        <div className="bg-stone-50 border border-stone-150 p-3 rounded-2xl flex flex-col gap-1 shrink-0 w-full md:w-auto">
          <span className="text-[8px] font-extrabold uppercase text-stone-450 font-mono tracking-widest block">
            Testing Compute Node
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <Activity className="w-4 h-4 text-rose-500" />
            <span className="text-xs font-black text-stone-800 font-mono">
              Vertex AI TensorCore Sandbox
            </span>
          </div>
        </div>
      </div>

      {/* Benchmarking Console Control Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Stress-test selection */}
        <div className="md:col-span-5 bg-stone-50 border border-stone-150 p-5 rounded-2xl flex flex-col gap-5">
          <span className="text-xs font-black uppercase text-stone-850 font-mono tracking-wider flex items-center gap-1.5">
            <Settings className="w-4 h-4 text-rose-500" />
            Assay Configuration
          </span>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase text-stone-500 font-mono">
                Target Stress Paradigm
              </label>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setSelectedBenchmark("monte-carlo")}
                  disabled={isBenchmarking}
                  className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                    selectedBenchmark === "monte-carlo"
                      ? "bg-white border-rose-500 shadow-xs"
                      : "bg-stone-100/50 border-stone-200 hover:bg-stone-100"
                  }`}
                >
                  <span className="text-xs font-bold flex items-center gap-1.5 text-stone-850">
                    <Cpu className="w-3.5 h-3.5 text-rose-500" />
                    Monte Carlo Sensitivity Assay
                  </span>
                  <span className="text-[10px] text-stone-500 leading-relaxed">
                    Runs 500 stochastic trials predicting public sentiment variance under administrative budget changes.
                  </span>
                </button>

                <button
                  onClick={() => setSelectedBenchmark("compliance")}
                  disabled={isBenchmarking}
                  className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                    selectedBenchmark === "compliance"
                      ? "bg-white border-rose-500 shadow-xs"
                      : "bg-stone-100/50 border-stone-200 hover:bg-stone-100"
                  }`}
                >
                  <span className="text-xs font-bold flex items-center gap-1.5 text-stone-850">
                    <Leaf className="w-3.5 h-3.5 text-emerald-500" />
                    Incentive Elasticity Analysis
                  </span>
                  <span className="text-[10px] text-stone-500 leading-relaxed">
                    Models organic composting sorting compliance curves relative to wallet coin reward allocation.
                  </span>
                </button>

                <button
                  onClick={() => setSelectedBenchmark("congestion")}
                  disabled={isBenchmarking}
                  className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                    selectedBenchmark === "congestion"
                      ? "bg-white border-rose-500 shadow-xs"
                      : "bg-stone-100/50 border-stone-200 hover:bg-stone-100"
                  }`}
                >
                  <span className="text-xs font-bold flex items-center gap-1.5 text-stone-850">
                    <Bus className="w-3.5 h-3.5 text-indigo-500" />
                    Transit Peak Overload Test
                  </span>
                  <span className="text-[10px] text-stone-500 leading-relaxed">
                    Simulates a 45% peak transit surge during grid bottleneck/storm events using idle autonomous mini-buses.
                  </span>
                </button>
              </div>
            </div>

            <button
              onClick={runBenchmarkSimulation}
              disabled={isBenchmarking}
              className="w-full py-3 bg-stone-900 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-rose-600 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isBenchmarking ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
                  Stress Assay Running ({benchmarkProgress}%)
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-rose-500" />
                  Run Resiliency Assay
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Console Output & Graphical Results */}
        <div className="md:col-span-7 flex flex-col gap-6">
          <div className="bg-stone-950 border border-stone-900 rounded-2xl p-5 shadow-md flex flex-col gap-4">
            <span className="text-[10px] font-black text-rose-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Terminal className="w-4 h-4" />
              Interactive Telemetry Console
            </span>

            <div className="bg-stone-900 border border-stone-850 rounded-xl p-4 h-64 font-mono text-[10px] text-stone-300 overflow-y-auto space-y-2 scrollbar-thin">
              {benchmarkLogs.length === 0 ? (
                <div className="text-stone-500 flex flex-col items-center justify-center h-full gap-2">
                  <Activity className="w-8 h-8 text-stone-700 animate-pulse" />
                  <span>Ready to capture telemetry streams... Click "Run Resiliency Assay" to start.</span>
                </div>
              ) : (
                <>
                  {benchmarkLogs.map((log, idx) => (
                    <div key={idx} className="leading-relaxed border-l-2 border-rose-500/30 pl-2">
                      {log}
                    </div>
                  ))}
                  {isBenchmarking && (
                    <div className="flex items-center gap-1 text-rose-400 animate-pulse font-bold">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Streaming stochastic variables...
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Progress Bar */}
            {isBenchmarking && (
              <div className="w-full bg-stone-900 h-1.5 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full transition-all duration-300" style={{ width: `${benchmarkProgress}%` }} />
              </div>
            )}
          </div>

          {/* Final Results Display card */}
          {!isBenchmarking && benchmarkLogs.length > 0 && (
            <div className="bg-emerald-500/5 border border-emerald-500/15 p-5 rounded-2xl flex flex-col gap-4">
              <div className="flex items-center gap-2 text-emerald-600">
                <CheckCircle className="w-5 h-5" />
                <span className="text-xs font-black uppercase font-mono tracking-wider">Assay Completed • Resiliency Verified</span>
              </div>

              {selectedBenchmark === "monte-carlo" ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white p-3 rounded-xl border border-stone-150 text-center">
                    <span className="text-[9px] font-bold text-stone-400 font-mono block uppercase">Standard Deviation</span>
                    <span className="text-base font-black text-stone-800 font-mono">1.18</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-stone-150 text-center">
                    <span className="text-[9px] font-bold text-stone-400 font-mono block uppercase">Confidence Interval</span>
                    <span className="text-base font-black text-stone-800 font-mono">93.4%</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-stone-150 text-center">
                    <span className="text-[9px] font-bold text-stone-400 font-mono block uppercase">Success Likelihood</span>
                    <span className="text-base font-black text-emerald-600 font-mono">92.5%</span>
                  </div>
                </div>
              ) : selectedBenchmark === "compliance" ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white p-3 rounded-xl border border-stone-150 text-center">
                    <span className="text-[9px] font-bold text-stone-400 font-mono block uppercase">Baseline Compliance</span>
                    <span className="text-base font-black text-stone-800 font-mono">22.4%</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-stone-150 text-center">
                    <span className="text-[9px] font-bold text-stone-400 font-mono block uppercase">Incentivized Sorting</span>
                    <span className="text-base font-black text-stone-800 font-mono">88.5%</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-stone-150 text-center">
                    <span className="text-[9px] font-bold text-stone-400 font-mono block uppercase">Elasticity Delta</span>
                    <span className="text-base font-black text-emerald-600 font-mono">1.45x</span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white p-3 rounded-xl border border-stone-150 text-center">
                    <span className="text-[9px] font-bold text-stone-400 font-mono block uppercase">Corridor Overload</span>
                    <span className="text-base font-black text-rose-500 font-mono">142%</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-stone-150 text-center">
                    <span className="text-[9px] font-bold text-stone-400 font-mono block uppercase">Dynamic Dispatched</span>
                    <span className="text-base font-black text-stone-800 font-mono">4 units</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-stone-150 text-center">
                    <span className="text-[9px] font-bold text-stone-400 font-mono block uppercase">Travel Time Delta</span>
                    <span className="text-base font-black text-emerald-600 font-mono">-28.5m</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Slide Footer Info */}
      <div className="flex justify-between items-center border-t border-stone-150 pt-3.5 text-[10px] text-stone-500 font-sans">
        <span className="font-semibold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" /> Socratic Trust Protocol
        </span>
        <span className="font-mono text-[9px] text-stone-450">
          ZENIVERSE AUTOMATION ENGINE © 2026
        </span>
      </div>
    </motion.div>
  );
}
