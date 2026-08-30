// ============================================================================
// 🌌 GREENIEVERSE - STATE INSPECTOR & DEVELOPER MODAL
// Real-time observation dump, candidate action utility ranking, and state JSON
// ============================================================================

import React, { useState } from 'react';
import { GameState, CandidateAction } from '../../../types/greenieverse';
import { ActionPlanner } from '../../../engine/greenieverse/planner/ActionPlanner';
import { X, Code, Terminal, CheckCircle2, Play, RefreshCw, Cpu } from 'lucide-react';

interface StateInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: GameState;
  onRunStep: () => void;
}

export const StateInspectorModal: React.FC<StateInspectorModalProps> = ({
  isOpen,
  onClose,
  state,
  onRunStep,
}) => {
  const [activeTab, setActiveTab] = useState<'CANDIDATES' | 'JSON' | 'OBSERVATION'>('CANDIDATES');

  if (!isOpen) return null;

  const { selectedAction, candidatePool } = ActionPlanner.planNextAction(state);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-4xl max-h-[90vh] bg-slate-950 border border-cyan-500/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 font-sans">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center shadow-md shadow-cyan-500/20">
              <Cpu className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white font-mono">Developer State Inspector</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  TURN {state.currentTurn} / 720
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Inspect raw environment observations, candidate action scoring, and policy utilities
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher & action trigger */}
        <div className="px-6 py-3 bg-slate-900/40 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('CANDIDATES')}
              className={`px-3 py-1.5 rounded-lg font-mono transition ${
                activeTab === 'CANDIDATES'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Candidate Actions ({candidatePool.length})
            </button>
            <button
              onClick={() => setActiveTab('OBSERVATION')}
              className={`px-3 py-1.5 rounded-lg font-mono transition ${
                activeTab === 'OBSERVATION'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Kaggle Observation (obs)
            </button>
            <button
              onClick={() => setActiveTab('JSON')}
              className={`px-3 py-1.5 rounded-lg font-mono transition ${
                activeTab === 'JSON'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Raw GameState JSON
            </button>
          </div>

          <button
            onClick={onRunStep}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono transition shadow-md shadow-emerald-500/20"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run 1 AI Decision Step</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-4 overflow-y-auto bg-slate-950">
          {activeTab === 'CANDIDATES' && (
            <div className="space-y-3">
              <div className="text-xs font-mono text-cyan-400 mb-2">
                Evaluated Action Candidates Ranked by Utility (Max Expected Final Wealth):
              </div>
              {candidatePool.map((c, idx) => (
                <div
                  key={c.id}
                  className={`p-3.5 rounded-xl border transition ${
                    c.isSelected
                      ? 'bg-cyan-950/40 border-cyan-500/60 shadow-md shadow-cyan-900/20'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-mono text-[11px] font-bold text-slate-300">
                        #{idx + 1}
                      </span>
                      <span className="font-bold text-white font-mono">{c.actionType}</span>
                      {c.commodity && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-emerald-300">
                          {c.commodity}
                        </span>
                      )}
                      {c.isSelected && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500 text-slate-950">
                          SELECTED POLICY
                        </span>
                      )}
                    </div>

                    <div className="font-mono text-xs font-bold text-cyan-300">
                      Utility Score: {c.utilityScore.toFixed(0)} pts
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mb-2">{c.explanation}</p>

                  <div className="grid grid-cols-4 gap-2 text-[11px] font-mono text-slate-400 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                    <div>Expected Profit: <span className="text-emerald-400 font-bold">+${c.expectedProfit.toFixed(0)}</span></div>
                    <div>Risk Score: <span className="text-amber-400">{c.riskScore}/100</span></div>
                    <div>Time Cost: <span className="text-slate-300">{c.timeCost} turns</span></div>
                    <div>Opportunity Cost: <span className="text-slate-300">${c.opportunityCost}</span></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'OBSERVATION' && (
            <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
{JSON.stringify({
  turn: state.currentTurn,
  max_turns: state.maxTurns,
  cash: state.cash,
  net_worth: state.netWorth,
  season_phase: state.seasonPhase,
  inventory: state.inventory,
  workers_count: state.workers.length,
  opponent_summary: {
    name: state.opponent.name,
    strategy: state.opponent.strategyClass,
    confidence: state.opponent.strategyConfidence,
    crops: state.opponent.cropsCount,
  },
  market_snapshot: Object.fromEntries(
    Object.entries(state.market).map(([k, v]) => [k, { price: v.currentPrice, signal: v.aiRecommendation, scarcity: v.scarcityScore }])
  )
}, null, 2)}
            </pre>
          )}

          {activeTab === 'JSON' && (
            <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed">
              {JSON.stringify(state, null, 2)}
            </pre>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Observation state: <span className="text-emerald-400 font-bold">VALID & SYNCHRONIZED</span></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
};
