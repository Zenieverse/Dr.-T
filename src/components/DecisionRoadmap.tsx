import React from "react";
import { motion } from "motion/react";
import { 
  Compass, 
  GitBranch, 
  Check, 
  Loader2, 
  Milestone, 
  Sparkles, 
  ShieldAlert 
} from "lucide-react";

export function DecisionRoadmap() {
  return (
    <motion.div 
      key="roadmap"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-6 font-sans relative overflow-hidden w-full text-stone-800"
      id="decision-roadmap-container"
    >
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-rose-500/5 to-transparent rounded-bl-full pointer-events-none" />

      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-stone-150 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black text-rose-600 tracking-widest uppercase font-mono bg-rose-500/10 px-2.5 py-1 rounded-md">
              FUTURE PIPELINE &amp; SCALE MILESTONES
            </span>
            <span className="text-[9px] font-extrabold text-stone-400 font-mono">
              Civic Resiliency System
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-stone-900 tracking-tight leading-none mt-2">
            Strategic Rollout Roadmap
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed max-w-2xl mt-1">
            Follow the structural stages of our policy intelligence engines, scaling from initial ambient data capture to self-healing municipal policies.
          </p>
        </div>

        <div className="bg-stone-50 border border-stone-150 p-3 rounded-2xl flex flex-col gap-1 shrink-0 w-full md:w-auto">
          <span className="text-[8px] font-extrabold uppercase text-stone-450 font-mono tracking-widest block">
            Project Phase Target
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <Compass className="w-4 h-4 text-rose-500" />
            <span className="text-xs font-black text-stone-800 font-mono">
              Phases 1 - 4 (2026-2027)
            </span>
          </div>
        </div>
      </div>

      {/* Main Visual Roadmap Component */}
      <div className="relative border border-stone-150 bg-stone-50 rounded-2xl p-6 shadow-inner animate-fade-in">
        <span className="text-xs font-black uppercase text-stone-850 font-mono tracking-wider flex items-center gap-1.5 mb-6">
          <GitBranch className="w-4 h-4 text-rose-500" />
          Decision Engine Scale Timeline
        </span>

        {/* Interactive/timeline nodes */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
          {/* Phase 1 */}
          <div className="flex flex-col gap-3 relative text-stone-800">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-mono font-black text-[10px]">1</span>
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest font-mono bg-emerald-500/10 px-2 py-0.5 rounded">
                COMPLETED
              </span>
            </div>
            <div>
              <h4 className="text-xs font-black text-stone-900 font-sans">Phase 1: Ambient Civic Sensing</h4>
              <span className="text-[9px] font-mono text-stone-400">Q1 2026</span>
            </div>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Set up local databases, symptom-parameter inputs, Socratic citizen surveys, and the grounding Q&amp;A platform.
            </p>
            <div className="border-t border-stone-200 pt-2 flex flex-col gap-1.5">
              <span className="text-[9px] text-stone-600 flex items-center gap-1.5 font-sans">
                <Check className="w-3.5 h-3.5 text-emerald-500" /> Local state datastore
              </span>
              <span className="text-[9px] text-stone-600 flex items-center gap-1.5 font-sans">
                <Check className="w-3.5 h-3.5 text-emerald-500" /> Grounding engine setup
              </span>
            </div>
          </div>

          {/* Phase 2 */}
          <div className="flex flex-col gap-3 relative text-stone-800">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center font-mono font-black text-[10px]">2</span>
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest font-mono bg-blue-500/10 px-2 py-0.5 rounded animate-pulse">
                IN PROGRESS
              </span>
            </div>
            <div>
              <h4 className="text-xs font-black text-stone-900 font-sans">Phase 2: Predictive Forecasting</h4>
              <span className="text-[9px] font-mono text-stone-400">Q3 2026</span>
            </div>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Integrate multi-criteria models, live SVG trend forecasting, and generative policy risk assessments.
            </p>
            <div className="border-t border-stone-200 pt-2 flex flex-col gap-1.5">
              <span className="text-[9px] text-stone-600 flex items-center gap-1.5 font-sans">
                <Check className="w-3.5 h-3.5 text-emerald-500" /> Multi-criteria Gemini run
              </span>
              <span className="text-[9px] text-stone-750 flex items-center gap-1.5 font-bold font-sans">
                <Loader2 className="w-3 h-3 text-rose-500 animate-spin" /> Interactive charts loop
              </span>
            </div>
          </div>

          {/* Phase 3 */}
          <div className="flex flex-col gap-3 relative text-stone-800">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center font-mono font-black text-[10px]">3</span>
              <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest font-mono bg-purple-500/10 px-2 py-0.5 rounded">
                PLANNED
              </span>
            </div>
            <div>
              <h4 className="text-xs font-black text-stone-900 font-sans">Phase 3: Automation Gateways</h4>
              <span className="text-[9px] font-mono text-stone-400">Q4 2026</span>
            </div>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Deploy secure active webhooks, unattended robotic workflow dispatchers, and IoT physical grid integrations.
            </p>
            <div className="border-t border-stone-200 pt-2 flex flex-col gap-1.5">
              <span className="text-[9px] text-stone-450 flex items-center gap-1.5 font-sans">
                <Milestone className="w-3.5 h-3.5 text-stone-400" /> Active webhook bridges
              </span>
              <span className="text-[9px] text-stone-450 flex items-center gap-1.5 font-sans">
                <Milestone className="w-3.5 h-3.5 text-stone-400" /> Robot process script VM
              </span>
            </div>
          </div>

          {/* Phase 4 */}
          <div className="flex flex-col gap-3 relative text-stone-800">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-stone-400 text-white flex items-center justify-center font-mono font-black text-[10px]">4</span>
              <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest font-mono bg-stone-100 px-2 py-0.5 rounded">
                PROPOSED
              </span>
            </div>
            <div>
              <h4 className="text-xs font-black text-stone-900 font-sans">Phase 4: Self-Healing Policies</h4>
              <span className="text-[9px] font-mono text-stone-400">Q2 2027</span>
            </div>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Establish automated closed-loop parameter adaptation, self-optimizing criteria triggers, and dynamic policy revisions.
            </p>
            <div className="border-t border-stone-200 pt-2 flex flex-col gap-1.5">
              <span className="text-[9px] text-stone-450 flex items-center gap-1.5 font-sans">
                <Milestone className="w-3.5 h-3.5 text-stone-400" /> Self-adapting score bounds
              </span>
              <span className="text-[9px] text-stone-450 flex items-center gap-1.5 font-sans">
                <Milestone className="w-3.5 h-3.5 text-stone-400" /> Autonomous grid feedback
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Extra roadmap details grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-stone-50 p-5 rounded-2xl border border-stone-150 flex flex-col gap-4">
          <span className="text-[10px] font-black text-stone-855 uppercase tracking-wider font-mono flex items-center gap-1.5 font-sans">
            <Sparkles className="w-4 h-4 text-rose-500" />
            Strategic Community Milestones
          </span>

          <div className="flex flex-col gap-3.5 text-[11px] text-stone-600 font-sans">
            <div className="flex gap-2.5">
              <span className="w-4 h-4 rounded-full bg-rose-500/15 text-rose-600 flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5 font-mono">A</span>
              <div>
                <strong className="text-stone-800 block">Civic Assembly Calibration</strong>
                Review policy criteria weights with local community boards, ensuring AI objectives line up with neighborhood-level priorities.
              </div>
            </div>

            <div className="flex gap-2.5">
              <span className="w-4 h-4 rounded-full bg-rose-500/15 text-rose-600 flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5 font-mono">B</span>
              <div>
                <strong className="text-stone-800 block">Biometric IoT Integration</strong>
                Connect local clinical sensors and mobile wellness parameters dynamically, scaling transit response dispatch directly to localized urgent needs.
              </div>
            </div>
          </div>
        </div>

        <div className="bg-stone-50 p-5 rounded-2xl border border-stone-150 flex flex-col gap-4">
          <span className="text-[10px] font-black text-stone-855 uppercase tracking-wider font-mono flex items-center gap-1.5 font-sans">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            Security Protocols &amp; Fail-Safes
          </span>

          <div className="flex flex-col gap-3.5 text-[11px] text-stone-600 font-sans">
            <div>
              <strong className="text-stone-855 block">1. Non-PII Storage Vault</strong>
              Ensures all telemetry values, simulation runs, and citizen query transcripts remain strictly aggregated and cleared of any personally identifiable info.
            </div>

            <div>
              <strong className="text-stone-855 block">2. Master Policy Circuit Breaker</strong>
              Clinicians and operators can freeze automated dispatches instantly, transitioning the grid back into manually managed fallback modes during unforeseen events.
            </div>
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
