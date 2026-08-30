// ============================================================================
// 🌌 GREENIEVERSE - GREENIECULTURE ARENA & LOSS ANALYSIS ENGINE
// Benchmark against Target 3043.5, win probability, and lost wealth breakdown
// ============================================================================

import React from 'react';
import { GameState } from '../../../types/greenieverse';
import { TARGET_SCORE } from '../../../engine/greenieverse/constants';
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  AlertCircle, 
  ShieldAlert, 
  PieChart, 
  CheckCircle2, 
  Cpu, 
  Flame 
} from 'lucide-react';

interface KaggricultureArenaViewProps {
  state: GameState;
  onOpenExporter: () => void;
}

export const KaggricultureArenaView: React.FC<KaggricultureArenaViewProps> = ({
  state,
  onOpenExporter,
}) => {
  const currentNetWorth = state.netWorth;
  const targetDiff = currentNetWorth - TARGET_SCORE;
  const isAhead = targetDiff >= 0;
  const winProbability = Math.min(99, Math.max(10, Math.round(50 + (targetDiff / 40))));

  const lostWealth = state.lossAnalysis?.lostWealthBreakdown || {
    marketTiming: 83,
    cropSelection: 61,
    workerInefficiency: 44,
    lateInvestment: 29,
    movementWaste: 18,
    opponentCounter: 15,
    liquidityShortage: 12,
  };

  const totalLostWealth = Object.values(lostWealth).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Benchmark Target Meter */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-950 border border-emerald-500/40 shadow-2xl backdrop-blur-xl flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400/40">
            <Target className="w-8 h-8 text-slate-950 font-black" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-black text-white font-mono">GreenieCulture Target Benchmark</h3>
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                OFFICIAL STANDARD
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Galactic Agricultural Championship • Real-Time Strategic Performance Analysis
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-6 text-xs font-mono">
          <div>
            <span className="text-slate-400 block">Current Forecast</span>
            <span className="text-2xl font-black text-emerald-400">
              ${currentNetWorth.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Delta vs Benchmark</span>
            <span className={`text-2xl font-black ${isAhead ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isAhead ? '+' : ''}${targetDiff.toFixed(1)}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Win Probability</span>
            <span className="text-2xl font-black text-cyan-400">{winProbability}%</span>
          </div>
        </div>
      </div>

      {/* Local Simulation vs Kaggle Comparison & Loss Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 6 Cols: Loss Analysis Engine (Where did wealth get lost?) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <h4 className="text-sm font-bold text-white font-mono">Loss Analysis Engine (Estimated Lost Wealth)</h4>
            </div>
            <span className="text-xs font-mono text-rose-400 font-bold">
              -${totalLostWealth} Sol Credits
            </span>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Market Timing (Oversupply Lag)', val: lostWealth.marketTiming, color: '#f43f5e' },
              { label: 'Suboptimal Crop Selection', val: lostWealth.cropSelection, color: '#fb923c' },
              { label: 'Worker Idle & Path Inefficiency', val: lostWealth.workerInefficiency, color: '#eab308' },
              { label: 'Late Season Capital Lockup', val: lostWealth.lateInvestment, color: '#a855f7' },
              { label: 'Movement Waste & Retooling', val: lostWealth.movementWaste, color: '#38bdf8' },
            ].map(item => (
              <div key={item.label} className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-slate-300">{item.label}</span>
                  <span className="font-mono font-bold text-rose-400">-${item.val} Credits</span>
                </div>
                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(item.val / Math.max(1, totalLostWealth)) * 100}%`,
                      backgroundColor: item.color,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 text-xs font-sans">
            <div className="font-bold text-emerald-400 font-mono mb-1">
              Prescribed Policy Adaptation:
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              {state.lossAnalysis?.prescribedAdaptation ||
                'Increase scarcity engine sensitivity and shift from tomatoes to strawberries 24 turns earlier.'}
            </p>
          </div>
        </div>

        {/* Right 6 Cols: Submission Exporter & Environment Parity */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-cyan-400" />
                <h4 className="text-sm font-bold text-white font-mono">Kaggle Environment Parity</h4>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                100% COMPLIANT
              </span>
            </div>

            <div className="space-y-3 mt-4 text-xs font-sans">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <strong className="text-white font-mono block mb-1">Deterministic Turn Progression:</strong>
                <p className="text-slate-400 text-[11px]">
                  Greenie AI runs with zero external HTTP requests, evaluating state observations in O(1) time complexity with strict memory bounds.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <strong className="text-white font-mono block mb-1">Endgame Liquidation Discipline:</strong>
                <p className="text-slate-400 text-[11px]">
                  Automatic Phase 4 triggers convert 100% of field and warehouse inventory to cash before Turn 720 to prevent stranded net worth.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onOpenExporter}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black font-mono text-xs transition shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Trophy className="w-4 h-4" />
            <span>Generate & Export submission/main.py</span>
          </button>
        </div>

      </div>

    </div>
  );
};
