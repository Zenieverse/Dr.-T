// ============================================================================
// 🌌 GREENIEVERSE - OPPONENT INTELLIGENCE & HARVEST WAVE RADAR
// Strategy classification, competitor asset tracking, and 24-turn supply forecasts
// ============================================================================

import React from 'react';
import { GameState, CropType, AnimalType } from '../../../types/greenieverse';
import { CROP_SPECS, LIVESTOCK_SPECS } from '../../../engine/greenieverse/constants';
import { 
  ShieldAlert, 
  Eye, 
  TrendingDown, 
  AlertTriangle, 
  Radar, 
  Coins, 
  Users, 
  Layers 
} from 'lucide-react';

interface OpponentIntelViewProps {
  state: GameState;
}

export const OpponentIntelView: React.FC<OpponentIntelViewProps> = ({ state }) => {
  const opp = state.opponent;

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Opponent Profile & Strategy Radar */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-950 border border-rose-500/30 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-600 flex items-center justify-center shadow-lg shadow-rose-900/30 ring-2 ring-rose-400/40">
              <Radar className="w-7 h-7 text-slate-950 font-bold animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-black text-white font-mono">{opp.name}</h3>
                <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-rose-950 text-rose-300 border border-rose-500/40">
                  {opp.strategyConfidence}% CONFIDENCE
                </span>
              </div>
              <p className="text-xs text-rose-300 font-mono mt-0.5">
                Classified Strategy: <strong className="text-white font-bold">{opp.strategyClass}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-xs font-mono">
            <div>
              <span className="text-slate-400 block">Est. Net Worth</span>
              <span className="text-lg font-bold text-white">${opp.estimatedNetWorth.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Liquid Cash</span>
              <span className="text-lg font-bold text-amber-300">${opp.cash.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Active Workforce</span>
              <span className="text-lg font-bold text-cyan-300">{opp.workerCount} Workers</span>
            </div>
          </div>
        </div>

        <p className="mt-4 pt-3 border-t border-rose-900/40 text-xs text-slate-300 leading-relaxed font-sans">
          <strong>Tactical Assessment:</strong> {opp.marketActivitySummary}
        </p>
      </div>

      {/* Opponent Field Assets & Supply Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 6 Cols: Opponent Crop & Livestock Allocation */}
        <div className="lg:col-span-6 p-5 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-rose-400" />
              <h4 className="text-sm font-bold text-white font-mono">Competitor Planted Crops Field</h4>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Total Plots: {Object.values(opp.cropsCount).reduce((a, b) => a + b, 0)}
            </span>
          </div>

          <div className="space-y-3">
            {(Object.keys(opp.cropsCount) as CropType[]).map(crop => {
              const count = opp.cropsCount[crop] || 0;
              const spec = CROP_SPECS[crop];

              return (
                <div
                  key={crop}
                  className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{spec?.icon}</span>
                    <div>
                      <div className="font-bold text-white font-mono">{spec?.name}</div>
                      <div className="text-[10px] text-slate-400">Growth: {spec?.growthTurns} turns</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-black text-rose-400 font-mono">{count} plots</span>
                    {count >= 4 && (
                      <div className="text-[10px] text-rose-300 font-mono font-bold">
                        ⚠️ HIGH HARVEST CONCENTRATION
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Animals */}
          <div className="pt-3 border-t border-slate-800">
            <div className="text-xs font-mono text-slate-400 mb-2">Livestock Bio-Pens:</div>
            <div className="grid grid-cols-3 gap-2 text-xs font-mono text-center">
              {(Object.keys(opp.animalCount) as AnimalType[]).map(an => (
                <div key={an} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-lg">{LIVESTOCK_SPECS[an]?.icon}</div>
                  <div className="font-bold text-white mt-1">{opp.animalCount[an]} {an}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 6 Cols: 24-Turn Supply Forecast Radar */}
        <div className="lg:col-span-6 p-5 rounded-3xl bg-slate-950 border border-rose-500/30 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h4 className="text-sm font-bold text-white font-mono">24-Turn Supply Shock Forecast</h4>
              </div>
              <span className="text-xs font-mono text-amber-400 font-bold">PREDICTIVE RADAR</span>
            </div>

            <div className="space-y-3 mt-4">
              {opp.next24TurnsSupplyForecast.map((f, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs font-sans space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white font-mono text-sm">{f.commodity}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-500/30">
                      +{f.count} Units Maturing
                    </span>
                  </div>
                  <p className="text-xs text-rose-300 font-mono leading-relaxed">
                    {f.marketImpact}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/30 text-xs font-sans">
            <div className="font-bold text-white font-mono mb-1 text-emerald-400">
              Greenie AI Counter-Strategy:
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Since the opponent is heavily exposed to Tomato harvest gluts, Greenie AI has shifted 100% of high-value acreage to <strong>Nebula Strawberries</strong> and <strong>Supernova Melons</strong>, avoiding price erosion and maximizing final liquid wealth.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
