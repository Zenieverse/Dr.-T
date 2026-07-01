import React from "react";
import { motion } from "motion/react";
import { 
  Network, 
  Layers, 
  Sliders, 
  Sparkles, 
  Shield, 
  Server, 
  Cpu, 
  FileText 
} from "lucide-react";

export function DecisionTechnologies() {
  return (
    <motion.div 
      key="technologies"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-6 font-sans relative overflow-hidden w-full text-stone-800"
      id="decision-technologies-container"
    >
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-bl-full pointer-events-none" />

      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-stone-150 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black text-rose-600 tracking-widest uppercase font-mono bg-rose-500/10 px-2.5 py-1 rounded-md">
              MULTI-CRITERIA DECISION PIPELINES
            </span>
            <span className="text-[9px] font-extrabold text-stone-400 font-mono">
              Enterprise AI Sandbox
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-stone-900 tracking-tight leading-none mt-2">
            Architectural Technology Stack
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed max-w-2xl mt-1">
            Examine the enterprise-grade composable API structures executing Gemini 3.5 multi-criteria planning rules inside the Zeniverse network.
          </p>
        </div>

        <div className="bg-stone-50 border border-stone-150 p-3 rounded-2xl flex flex-col gap-1 shrink-0 w-full md:w-auto">
          <span className="text-[8px] font-extrabold uppercase text-stone-450 font-mono tracking-widest block">
            Security Certificate Type
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <Network className="w-4 h-4 text-rose-500" />
            <span className="text-xs font-black text-stone-800 font-mono">
              Grounded TLS / Socratic Key
            </span>
          </div>
        </div>
      </div>

      {/* Composable diagram layout */}
      <div className="bg-stone-50 border border-stone-150 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
        <span className="text-xs font-black uppercase text-stone-850 font-mono tracking-wider flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-rose-500" />
          Decisional Inference &amp; Automation Flow
        </span>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative mt-2 text-stone-850">
          {/* Step 1 */}
          <div className="bg-white border border-stone-200/40 p-4 rounded-xl flex flex-col gap-3 relative shadow-xs">
            <div className="absolute -top-3 left-4 bg-blue-600 text-white font-mono text-[8px] font-black px-2 py-0.5 rounded-full shadow-sm">
              LAYER 1: PARAMETER CAPTURE
            </div>
            <div className="flex items-center gap-2.5 mt-1.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-stone-900 font-sans">Ambient Intercept</h4>
                <span className="text-[8px] font-mono text-stone-450">Telemetry inputs</span>
              </div>
            </div>
            <p className="text-[10px] text-stone-550 leading-relaxed">
              Local state values, community vital-threshold parameter crossings, and civic inputs are compiled into webhook payloads.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white border border-stone-200/40 p-4 rounded-xl flex flex-col gap-3 relative shadow-xs">
            <div className="absolute -top-3 left-4 bg-amber-600 text-white font-mono text-[8px] font-black px-2 py-0.5 rounded-full shadow-sm">
              LAYER 2: GEMINI FORECAST
            </div>
            <div className="flex items-center gap-2.5 mt-1.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-stone-900 font-sans">Semantic Engine</h4>
                <span className="text-[8px] font-mono text-stone-450">Gemini 3.5 Inference</span>
              </div>
            </div>
            <p className="text-[10px] text-stone-550 leading-relaxed">
              Payload targets hit the Vertex API server gateway. Gemini models analyze proposals across multi-criteria objectives.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white border border-stone-200/40 p-4 rounded-xl flex flex-col gap-3 relative shadow-xs">
            <div className="absolute -top-3 left-4 bg-purple-600 text-white font-mono text-[8px] font-black px-2 py-0.5 rounded-full shadow-sm">
              LAYER 3: RISK STRATEGY
            </div>
            <div className="flex items-center gap-2.5 mt-1.5">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-stone-900 font-sans">Governance Checker</h4>
                <span className="text-[8px] font-mono text-stone-450">Pareto Guidelines</span>
              </div>
            </div>
            <p className="text-[10px] text-stone-550 leading-relaxed">
              Socratic heuristics assess trade-offs. The engine maps pros &amp; cons, validating findings against budget bounds.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white border border-stone-200/40 p-4 rounded-xl flex flex-col gap-3 relative shadow-xs">
            <div className="absolute -top-3 left-4 bg-rose-600 text-white font-mono text-[8px] font-black px-2 py-0.5 rounded-full shadow-sm">
              LAYER 4: AUTOMATION DISPATCH
            </div>
            <div className="flex items-center gap-2.5 mt-1.5">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center">
                <Server className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-stone-900 font-sans">Active Webhooks</h4>
                <span className="text-[8px] font-mono text-stone-450">Unattended Workers</span>
              </div>
            </div>
            <p className="text-[10px] text-stone-550 leading-relaxed">
              Trigger logs initiate active dispatch webhooks. Unattended robots run GUI field updates or trigger grid notifications.
            </p>
          </div>
        </div>
      </div>

      {/* Composable Technology Evaluation & Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Tech Grid Item */}
        <div className="bg-stone-50 p-5 rounded-2xl border border-stone-150 flex flex-col gap-4">
          <span className="text-[10px] font-black text-stone-850 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-rose-500" />
            Decision Optimization Rationale
          </span>

          <div className="flex flex-col gap-3.5 text-stone-650">
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
              <div>
                <span className="text-xs font-bold text-stone-800 block">Stochastic Robustness Validation</span>
                <p className="text-[11px] text-stone-500 leading-relaxed mt-0.5">
                  By integrating multi-run sensitivity audits directly into decision pipelines, the system mitigates high bias errors typical in linear models.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
              <div>
                <span className="text-xs font-bold text-stone-800 block">Grounded Search Verification</span>
                <p className="text-[11px] text-stone-500 leading-relaxed mt-0.5">
                  Utilizes Vertex search and geolocation API integration to reference real public datasources and geographic parameters, preventing LLM hallucinations.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
              <div>
                <span className="text-xs font-bold text-stone-800 block">Local Edge Caching</span>
                <p className="text-[11px] text-stone-500 leading-relaxed mt-0.5">
                  Guarantees seamless service continuity via client-side caching of simulation runs, allowing immediate forecasting queries even under network dropouts.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Tech Grid Item: Engineering Spec Sheet */}
        <div className="bg-stone-50 p-5 rounded-2xl border border-stone-150 flex flex-col gap-4">
          <span className="text-[10px] font-black text-stone-850 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-rose-500" />
            Decision Engine Specifications
          </span>

          <div className="flex flex-col gap-3.5 text-[11px]">
            <div className="flex justify-between items-center border-b border-stone-150 pb-2">
              <span className="text-stone-500">LLM Inference Node</span>
              <span className="font-mono font-bold text-stone-850">Gemini 3.5 Flash &amp; 3.1 TTS</span>
            </div>
            <div className="flex justify-between items-center border-b border-stone-150 pb-2">
              <span className="text-stone-500">Integration Gateway</span>
              <span className="font-mono font-bold text-stone-855">Express server.ts REST Proxy</span>
            </div>
            <div className="flex justify-between items-center border-b border-stone-150 pb-2">
              <span className="text-stone-500">Authentication Scheme</span>
              <span className="font-mono font-bold text-stone-850">OAuth 2.0 Bearer JWT Tokens</span>
            </div>
            <div className="flex justify-between items-center border-b border-stone-150 pb-2">
              <span className="text-stone-500">Database &amp; Storage Cache</span>
              <span className="font-mono font-bold text-stone-850">LocalState &amp; In-Memory Map</span>
            </div>
            <div className="flex justify-between items-center pb-2">
              <span className="text-stone-500">Security Rule Protocol</span>
              <span className="font-mono font-bold text-stone-850">TLS 1.3 / AES-256 Symmetric</span>
            </div>
          </div>

          <div className="p-3.5 bg-rose-500/5 border border-rose-500/10 rounded-xl mt-1 text-[11px] leading-relaxed text-stone-600">
            <strong className="text-stone-850 block mb-0.5">🚀 Architecture Certified</strong>
            The multi-criteria simulation pipeline has been verified for security and performance. Webhook trigger callbacks execute under 250 milliseconds.
          </div>
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
