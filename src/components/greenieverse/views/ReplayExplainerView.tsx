// ============================================================================
// 🌌 GREENIEVERSE - REPLAY & AI DECISION EXPLAINER VIEW
// Timeline scrubber (Turn 1..720) and transparent "Why did Greenie do this?" cards
// ============================================================================

import React, { useState } from 'react';
import { GameState, DecisionExplainerItem } from '../../../types/greenieverse';
import { 
  History, 
  HelpCircle, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  ArrowRight, 
  Zap, 
  Sliders, 
  Calendar 
} from 'lucide-react';

interface ReplayExplainerViewProps {
  state: GameState;
}

export const ReplayExplainerView: React.FC<ReplayExplainerViewProps> = ({ state }) => {
  const [selectedTurn, setSelectedTurn] = useState<number>(state.currentTurn);

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Timeline Scrubber */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-mono">Agricultural Decision Replay Engine</h3>
              <p className="text-xs text-slate-400">Scrub across the 30-day (720-turn) season timeline</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono">
            <span className="text-slate-400">Current Simulation:</span>
            <span className="px-3 py-1 rounded-lg bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/40">
              TURN {selectedTurn} / 720 (DAY {Math.floor(selectedTurn / 24) + 1})
            </span>
          </div>
        </div>

        {/* Range Scrubber */}
        <div className="space-y-2 pt-2">
          <input
            type="range"
            min={1}
            max={state.maxTurns}
            value={selectedTurn}
            onChange={e => setSelectedTurn(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />
          <div className="flex justify-between text-[11px] font-mono text-slate-500">
            <span>Day 1 (Bootstrap)</span>
            <span>Day 7 (Scale)</span>
            <span>Day 18 (Arbitrage)</span>
            <span>Day 26 (Liquidation)</span>
            <span>Day 30 (Final Wealth)</span>
          </div>
        </div>
      </div>

      {/* Decision Explainer Cards List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span>EXPLAINABLE AI REASONING LOGS:</span>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {state.recentDecisions.length} Major Recorded Actions
          </span>
        </div>

        {state.recentDecisions.map((dec, idx) => (
          <div
            key={dec.id}
            className="p-5 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl space-y-3 hover:border-emerald-500/40 transition"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
              <div className="flex items-center space-x-2.5">
                <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-900 text-cyan-300 border border-slate-700">
                  TURN {dec.turn} (DAY {dec.day})
                </span>
                <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                  {dec.decisionBadge}
                </span>
              </div>

              <div className="flex items-center space-x-3 text-xs font-mono">
                <span className="text-slate-400">Policy Confidence: <strong className="text-white">{dec.confidence}%</strong></span>
                <span className="text-emerald-400 font-bold">
                  Expected Gain: +${dec.expectedWealthDelta.toFixed(0)}
                </span>
              </div>
            </div>

            <h4 className="text-sm font-bold text-white font-mono flex items-center space-x-2">
              <span>{dec.title}</span>
            </h4>

            <div className="space-y-1.5 pl-2 border-l-2 border-emerald-500/40">
              {dec.bulletPoints.map((bp, bIdx) => (
                <div key={bIdx} className="text-xs text-slate-300 font-sans flex items-start space-x-2">
                  <span className="text-emerald-400 font-bold">›</span>
                  <span>{bp}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
