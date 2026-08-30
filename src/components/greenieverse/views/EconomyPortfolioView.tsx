// ============================================================================
// 🌌 GREENIEVERSE - AGRICULTURAL ECONOMICS & PORTFOLIO ENGINE
// Expected Final Wealth (EFW), dynamic production mix, and risk decomposition
// ============================================================================

import React from 'react';
import { GameState, CropType, AnimalType } from '../../../types/greenieverse';
import { CROP_SPECS, LIVESTOCK_SPECS } from '../../../engine/greenieverse/constants';
import { AgriculturalEconomicsEngine } from '../../../engine/greenieverse/economics/AgriculturalEconomicsEngine';
import { ProductionOptimizer } from '../../../engine/greenieverse/economics/ProductionOptimizer';
import { LivestockEconomics } from '../../../engine/greenieverse/economics/LivestockEconomics';
import { 
  PieChart, 
  Coins, 
  ShieldCheck, 
  TrendingUp, 
  Scale, 
  Layers, 
  Zap, 
  Sparkles 
} from 'lucide-react';

interface EconomyPortfolioViewProps {
  state: GameState;
}

export const EconomyPortfolioView: React.FC<EconomyPortfolioViewProps> = ({ state }) => {
  const remainingTurns = state.maxTurns - state.currentTurn;
  const unlockedTiles = state.grid.flat().filter(t => t.isUnlocked).length;

  const cropEvals = AgriculturalEconomicsEngine.evaluateAllCrops(state.market, remainingTurns, unlockedTiles);
  const productionAllocations = ProductionOptimizer.calculateDynamicAllocation(
    unlockedTiles,
    state.cash,
    remainingTurns,
    state.seasonPhase,
    Object.fromEntries(Object.entries(state.market).map(([k, v]) => [k, v.scarcityScore]))
  );

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Financial Portfolio Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Asset Portfolio Distribution */}
        <div className="md:col-span-2 p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <PieChart className="w-5 h-5 text-emerald-400" />
                <h4 className="text-sm font-bold text-white font-mono">Farm Asset Portfolio Allocation</h4>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">
                Total Net Worth: ${state.netWorth.toLocaleString()}
              </span>
            </div>

            {/* Visual Portfolio Bar */}
            <div className="w-full h-4 rounded-xl overflow-hidden flex my-4 bg-slate-900">
              {state.portfolio.map((p, idx) => (
                <div
                  key={idx}
                  style={{ width: `${Math.max(2, p.percentage)}%`, backgroundColor: p.color }}
                  className="h-full transition-all duration-500"
                  title={`${p.label}: ${p.percentage}% ($${p.value})`}
                ></div>
              ))}
            </div>

            {/* Legend Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
              {state.portfolio.map((p, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: p.color }}></span>
                    <span className="text-slate-300 truncate">{p.label.split(' ')[0]}</span>
                  </div>
                  <span className="font-bold text-white">${p.value.toLocaleString()} ({p.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>Portfolio Liquidity Ratio:</span>
            <span className="text-emerald-400 font-bold">
              {((state.cash / Math.max(1, state.netWorth)) * 100).toFixed(1)}% (Healthy)
            </span>
          </div>
        </div>

        {/* Card 2: Risk Radar */}
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <h4 className="text-sm font-bold text-white font-mono">Risk Engine Decomp</h4>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                SCORE {state.risk.overallScore}/100
              </span>
            </div>

            <div className="space-y-2 mt-4 text-xs font-mono">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Liquidity Risk:</span>
                <span className="text-emerald-400 font-bold">{state.risk.liquidityRisk}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Endgame Stranded Capital:</span>
                <span className="text-cyan-400 font-bold">{state.risk.endgameRisk}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Market Price Risk:</span>
                <span className="text-amber-400 font-bold">{state.risk.marketRisk}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Opponent Disruption:</span>
                <span className="text-emerald-400 font-bold">{state.risk.opponentRisk}</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 font-sans mt-3 pt-3 border-t border-slate-800 leading-relaxed">
            {state.risk.summary}
          </p>
        </div>

      </div>

      {/* Dynamic Production Allocation & Crop Economics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 6 Cols: Dynamic Production Optimizer */}
        <div className="lg:col-span-6 p-5 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Scale className="w-5 h-5 text-amber-400" />
              <h4 className="text-sm font-bold text-white font-mono">Dynamic Production Allocation</h4>
            </div>
            <span className="text-xs font-mono text-amber-400 font-bold">{state.seasonPhase.split('—')[1]}</span>
          </div>

          <div className="space-y-3">
            {productionAllocations.map(alloc => (
              <div
                key={alloc.crop}
                className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: alloc.color }}></span>
                    <span className="font-bold text-white font-mono">{alloc.label}</span>
                  </div>
                  <span className="font-mono font-bold text-white text-sm">
                    {alloc.percentage}% ({alloc.tilesTarget} tiles)
                  </span>
                </div>

                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${alloc.percentage}%`, backgroundColor: alloc.color }}
                  ></div>
                </div>

                <p className="text-[11px] text-slate-400 font-sans">{alloc.reason}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right 6 Cols: Expected Final Wealth (EFW) Comparison Table */}
        <div className="lg:col-span-6 p-5 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-bold text-white font-mono">Expected Final Wealth (EFW) Ranking</h4>
            </div>
            <span className="text-xs font-mono text-slate-400">Remaining: {remainingTurns} Turns</span>
          </div>

          <div className="space-y-3">
            {(Object.values(cropEvals) as any[]).map(evalItem => (
              <div
                key={evalItem.crop}
                className={`p-3.5 rounded-2xl border text-xs font-sans space-y-1.5 ${
                  evalItem.recommendationRank === 1
                    ? 'bg-emerald-950/40 border-emerald-500/50 ring-1 ring-emerald-500/30'
                    : 'bg-slate-900/80 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-mono font-bold text-[10px] text-emerald-400">
                      #{evalItem.recommendationRank}
                    </span>
                    <span className="font-bold text-white font-mono">{CROP_SPECS[evalItem.crop as CropType]?.name}</span>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-xs text-slate-400 mr-2">EFW Gain:</span>
                    <strong className="text-emerald-400 font-bold text-sm">
                      +${evalItem.expectedFinalWealthContribution.toLocaleString()}
                    </strong>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-slate-400 bg-slate-950/60 p-2 rounded-lg">
                  <div>Seed: <strong className="text-slate-200">${evalItem.seedCost}</strong></div>
                  <div>Turns: <strong className="text-slate-200">{evalItem.paybackTurns} turns</strong></div>
                  <div>Risk: <strong className="text-slate-200">{evalItem.marketRisk}</strong></div>
                </div>

                <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                  {evalItem.rationale}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
