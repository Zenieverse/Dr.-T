import React, { useState } from 'react';
import { SwarmAgent, SwarmResult, NavTab } from '../../types';
import { 
  Cpu, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Send, 
  Layers, 
  ShieldCheck, 
  HeartPulse, 
  ArrowRight,
  GitPullRequest,
  Users,
  Compass
} from 'lucide-react';

interface AISwarmProps {
  agents: SwarmAgent[];
  setActiveTab: (tab: NavTab) => void;
  onRunSwarmOrchestration: (query: string) => Promise<SwarmResult>;
}

export const AISwarm: React.FC<AISwarmProps> = ({
  agents: initialAgents,
  setActiveTab,
  onRunSwarmOrchestration,
}) => {
  const [query, setQuery] = useState<string>(
    "Evaluate 34yo patient with persistent circadian fatigue, depleted ferritin (19 ng/mL), normal TSH/glucose, and 42% deep sleep deficit. Determine differential priority, patient education strategy, and primary care follow-up checklist."
  );
  const [agents, setAgents] = useState<SwarmAgent[]>(initialAgents);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [swarmSynthesis, setSwarmSynthesis] = useState<string>(
    "Dr. T Unified Synthesis: The clinical picture presents non-anemic iron deficiency combined with circadian phase delay. We recommend initiating gentle iron bisglycinate alongside morning sunlight synchronization. Dr. Med and Dr. Research evaluated both biochemical supplementation and autonomic circadian restoration, harmonized below."
  );
  const [disagreementReview, setDisagreementReview] = useState<{
    detected: boolean;
    summary: string;
    tensionPoints: string[];
  }>({
    detected: true,
    summary: "Dr. Med advocates repeat serum iron & TIBC panel within 4 weeks, whereas Dr. Research notes circadian sleep alignment resolves subjective fatigue in 60% of cases even before ferritin normalizes.",
    tensionPoints: [
      "Timeline for repeat lab evaluation (4 weeks vs 8 weeks)",
      "Relative weight of dietary iron vs circadian sleep timing on daytime vitality",
    ],
  });

  const handleRunSwarm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isRunning) return;

    setIsRunning(true);
    try {
      const result = await onRunSwarmOrchestration(query);
      if (result.agents && result.agents.length > 0) {
        setAgents(result.agents);
      }
      if (result.synthesis) {
        setSwarmSynthesis(result.synthesis);
      }
      if (result.disagreementReview) {
        setDisagreementReview(result.disagreementReview);
      }
    } catch (err) {
      console.error('Swarm error:', err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200">
              <Cpu className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              AI Multi-Agent Swarm & Reasoning Review
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            7 specialized clinical AI agents collaborating in parallel with automatic tension detection and unified empathetic synthesis.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-xl bg-purple-100 text-purple-800 text-xs font-bold flex items-center space-x-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>7 Active Specialists</span>
          </span>
        </div>
      </div>

      {/* Query Dispatch Box */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Multi-Agent Clinical Task Dispatch</h3>
          <span className="text-xs text-purple-700 font-semibold">Gemini 3.7 Flash Parallel Reasoning</span>
        </div>

        <form onSubmit={handleRunSwarm} className="space-y-3">
          <textarea
            rows={3}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe the clinical dilemma or patient case for multi-agent swarm decomposition..."
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-purple-500 leading-relaxed"
          />

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Tasks are assigned dynamically to Dr. Med, Dr. Research, Dr. Edu, Dr. Ops, Dr. Data, and Dr. Safety.
            </span>

            <button
              type="submit"
              disabled={isRunning || !query.trim()}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-purple-500/20 disabled:opacity-40 transition flex items-center space-x-2"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Swarm Analyzing in Parallel...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Execute Swarm Reasoning</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Signature Feature: Agent Disagreement System */}
      {disagreementReview.detected && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/80 space-y-3">
          <div className="flex items-center space-x-2 text-amber-900">
            <GitPullRequest className="w-5 h-5 text-amber-700" />
            <h3 className="text-sm font-black uppercase tracking-wider">
              Agent Disagreement & Reasoning Review
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900">
              Tension Identified
            </span>
          </div>

          <p className="text-xs text-slate-800 leading-relaxed">
            {disagreementReview.summary}
          </p>

          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
              Key Divergent Points Under Review:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {disagreementReview.tensionPoints.map((pt, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-white/80 border border-amber-200 text-xs text-slate-800 flex items-start space-x-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Dr. T Unified Empathetic Synthesis Box */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-400 to-cyan-400 text-slate-950 flex items-center justify-center font-black">
              🩺
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Dr. T Unified Orchestrator Synthesis</h3>
              <p className="text-[10px] text-teal-300">Empathetic consensus balancing clinical rigor and patient wellbeing</p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('drt')}
            className="px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition flex items-center space-x-1"
          >
            <span>Discuss with Dr. T</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
          {swarmSynthesis}
        </p>
      </div>

      {/* 6 Specialist Agent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between hover:border-purple-300 transition"
          >
            <div className="space-y-3">
              {/* Agent Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl p-2 rounded-2xl bg-purple-50 border border-purple-100">
                    {agent.avatar}
                  </span>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">{agent.name}</h4>
                    <p className="text-[10px] text-purple-700 font-semibold">{agent.role}</p>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                  {agent.status}
                </span>
              </div>

              {/* Specialty */}
              <div className="text-[11px] text-slate-500 font-medium">
                <span className="text-slate-400">Specialty:</span> {agent.specialty}
              </div>

              {/* Task */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-700">
                <span className="font-bold text-slate-900 block">Assigned Task:</span>
                <p className="mt-0.5 line-clamp-2">{agent.currentTask}</p>
              </div>

              {/* Output */}
              <div className="p-3 rounded-2xl bg-purple-50/40 border border-purple-100/80 text-xs text-slate-800 leading-relaxed">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 block mb-1">
                  Specialist Analysis
                </span>
                <p>{agent.output}</p>
              </div>
            </div>

            {/* Confidence Bar */}
            <div className="pt-3 border-t border-slate-100 space-y-1">
              <div className="flex items-center justify-between text-[11px] font-semibold">
                <span className="text-slate-500">Confidence Rating</span>
                <span className="text-purple-700 font-mono font-bold">{(agent.confidence * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div style={{ width: `${agent.confidence * 100}%` }} className="bg-purple-600 h-full" />
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
