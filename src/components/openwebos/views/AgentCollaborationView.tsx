import React, { useState } from 'react';
import { 
  Users, 
  Check, 
  X, 
  HelpCircle, 
  Sparkles, 
  TrendingUp, 
  DollarSign, 
  Leaf, 
  ArrowRight,
  Info
} from 'lucide-react';
import { AgentProposal } from '../../../webmcp/types';

interface AgentCollaborationViewProps {
  proposals: AgentProposal[];
  onAcceptProposal: (id: string) => void;
  onRejectProposal: (id: string) => void;
}

export const AgentCollaborationView: React.FC<AgentCollaborationViewProps> = ({
  proposals,
  onAcceptProposal,
  onRejectProposal,
}) => {
  const [activeWhyId, setActiveWhyId] = useState<string | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-black text-white uppercase tracking-wide">
              Human + Agent Collaboration Center
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Agents propose optimizations rather than silently making unilateral decisions. Human retains full sovereignty.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
          {proposals.filter(p => p.status === 'pending').length} Pending Decisions
        </span>
      </div>

      {/* Multi-Agent Collaboration Model Graphic */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 space-y-4">
        <div className="text-xs font-mono uppercase text-slate-400 font-bold flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>MULTI-AGENT REASONING PIPELINE (5 SPECIALIST ROLES)</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-[10px] font-mono text-cyan-400 font-bold">1. HUMAN</div>
            <div className="text-white font-bold">Goal Source</div>
            <div className="text-[10px] text-slate-500">Natural language</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-[10px] font-mono text-indigo-400 font-bold">2. EXPLORER</div>
            <div className="text-white font-bold">Discovery</div>
            <div className="text-[10px] text-slate-500">search_options</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-[10px] font-mono text-blue-400 font-bold">3. ANALYST</div>
            <div className="text-white font-bold">Comparison</div>
            <div className="text-[10px] text-slate-500">compare_options</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-[10px] font-mono text-amber-400 font-bold">4. PLANNER</div>
            <div className="text-white font-bold">Budget Ledger</div>
            <div className="text-[10px] text-slate-500">calculate_budget</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-[10px] font-mono text-rose-400 font-bold">5. CRITIC</div>
            <div className="text-white font-bold">Optimization</div>
            <div className="text-[10px] text-slate-500">Proposals &amp; checks</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-1">
            <div className="text-[10px] font-mono text-emerald-400 font-bold">6. CREATOR</div>
            <div className="text-white font-bold">Artifact</div>
            <div className="text-[10px] text-emerald-400">create_artifact</div>
          </div>
        </div>
      </div>

      {/* Proposals List */}
      <div className="space-y-4">
        {proposals.length === 0 ? (
          <div className="p-16 text-center rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-500 text-sm">
            No active proposals. Run the agent scenario from the Home tab to trigger the Critic optimization proposal.
          </div>
        ) : (
          proposals.map((proposal) => {
            const isPending = proposal.status === 'pending';
            const isAccepted = proposal.status === 'accepted';

            return (
              <div
                key={proposal.id}
                className={`p-6 rounded-2xl border space-y-4 shadow-xl transition ${
                  isPending
                    ? 'bg-slate-900/95 border-indigo-500/40 shadow-indigo-500/5'
                    : isAccepted
                    ? 'bg-slate-900/70 border-emerald-500/30'
                    : 'bg-slate-900/50 border-slate-800 opacity-60'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        AGENT PROPOSAL
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        Generated at {proposal.createdAt}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-1">
                      {proposal.title}
                    </h3>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${
                      isPending
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                        : isAccepted
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {proposal.status.toUpperCase()}
                  </span>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed font-sans bg-slate-950 p-3 rounded-xl border border-slate-800">
                  {proposal.description}
                </p>

                {/* Impact Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                  {proposal.costImpact && (
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      <div>
                        <div className="text-[10px] text-slate-400">Cost Impact</div>
                        <div className="text-emerald-400 font-bold">
                          {proposal.costImpact < 0 ? `-$${Math.abs(proposal.costImpact)} savings` : `+$${proposal.costImpact}`}
                        </div>
                      </div>
                    </div>
                  )}

                  {proposal.sustainabilityImpact && (
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center space-x-2">
                      <Leaf className="w-4 h-4 text-teal-400" />
                      <div>
                        <div className="text-[10px] text-slate-400">Eco Score</div>
                        <div className="text-teal-400 font-bold">{proposal.sustainabilityImpact}/100 Index</div>
                      </div>
                    </div>
                  )}

                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-indigo-400" />
                    <div>
                      <div className="text-[10px] text-slate-400">Transit Access</div>
                      <div className="text-indigo-300 font-bold">Direct Light Rail</div>
                    </div>
                  </div>
                </div>

                {/* Reasoning Bullet Points */}
                <div className="space-y-1 text-xs">
                  <div className="font-mono text-[11px] text-slate-400 font-bold uppercase">
                    Agent Justification Points:
                  </div>
                  <ul className="space-y-1 pl-4 list-disc text-slate-300 text-[11px]">
                    {proposal.reasoning.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>

                {/* Ask Why Explainer Modal / Drawer */}
                {activeWhyId === proposal.id && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 text-xs space-y-2 animate-fade-in">
                    <div className="flex items-center space-x-2 text-cyan-400 font-bold font-mono">
                      <Info className="w-4 h-4" />
                      <span>Deep Multi-Dimensional Trade-off Rationale</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      By comparing Solar Lofts against EcoLodge Canopy Suites across 50 items in the WebMCP repository, the agent identified that Canopy Suites is 4.2 miles from the nearest Light Rail stop (requiring an additional $28 taxi fee). Solar Lofts is situated directly above the Transit District Light Rail station (covered 100% by the $24 All-Electric 72hr Rail Pass). Swapping reduces net carbon footprint by 14kg CO2e and leaves $83 surplus in your $500 weekend budget envelope.
                    </p>
                  </div>
                )}

                {/* Decision Actions */}
                {isPending && (
                  <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800">
                    <button
                      onClick={() => setActiveWhyId(activeWhyId === proposal.id ? null : proposal.id)}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition"
                    >
                      <HelpCircle className="w-4 h-4 text-cyan-400" />
                      <span>{activeWhyId === proposal.id ? 'Hide Rationale' : 'Ask Why'}</span>
                    </button>
                    <button
                      onClick={() => onRejectProposal(proposal.id)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-300 text-slate-400 text-xs font-semibold flex items-center space-x-1.5 transition"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => onAcceptProposal(proposal.id)}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-emerald-500/20 transition transform active:scale-95"
                    >
                      <Check className="w-4 h-4" />
                      <span>Accept Proposal</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
