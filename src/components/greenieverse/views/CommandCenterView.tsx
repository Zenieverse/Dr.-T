// ============================================================================
// 🌌 GREENIEVERSE - COMMAND CENTER VIEW
// Central futuristic command hub with 10x10 farm grid, AI status, and live telemetry
// ============================================================================

import React, { useState } from 'react';
import { 
  GameState, 
  GreenieViewTab, 
  TileState, 
  QuadrantId, 
  CropType, 
  CommodityType 
} from '../../../types/greenieverse';
import { 
  CROP_SPECS, 
  LIVESTOCK_SPECS 
} from '../../../engine/greenieverse/constants';
import { 
  Bot, 
  TrendingUp, 
  Activity, 
  ShieldAlert, 
  Coins, 
  Sparkles, 
  Zap, 
  ChevronRight, 
  Layers, 
  Users, 
  Droplet, 
  Lock, 
  Unlock,
  AlertTriangle,
  Compass
} from 'lucide-react';

interface CommandCenterViewProps {
  state: GameState;
  onSelectTile: (tile: TileState) => void;
  setActiveView: (view: GreenieViewTab) => void;
  onStep: () => void;
}

export const CommandCenterView: React.FC<CommandCenterViewProps> = ({
  state,
  onSelectTile,
  setActiveView,
  onStep,
}) => {
  const [selectedQuadrant, setSelectedQuadrant] = useState<QuadrantId>('NW');
  const [hoveredTile, setHoveredTile] = useState<TileState | null>(null);

  // Quadrant stats
  const activeQuad = state.quadrants[selectedQuadrant];

  const getTileColor = (tile: TileState) => {
    if (!tile.isUnlocked) return 'bg-slate-950/80 border-slate-900 text-slate-700 opacity-60';
    if (tile.status === 'ANIMAL_PEN') return 'bg-purple-950/40 border-purple-500/50 text-purple-300';
    if (tile.status === 'MATURE') return 'bg-emerald-950/60 border-emerald-400 text-emerald-300 ring-1 ring-emerald-400/50 animate-pulse';
    if (tile.status === 'PLANTED') {
      return tile.isWatered 
        ? 'bg-teal-950/50 border-teal-500/60 text-teal-300' 
        : 'bg-amber-950/40 border-amber-500/50 text-amber-300';
    }
    if (tile.status === 'TILL') return 'bg-amber-950/30 border-amber-800 text-amber-400';
    return 'bg-slate-900/50 border-slate-800 hover:border-emerald-500/50 text-slate-500';
  };

  const getTileIcon = (tile: TileState) => {
    if (!tile.isUnlocked) return <Lock className="w-3.5 h-3.5 text-slate-600" />;
    if (tile.status === 'ANIMAL_PEN') return <span className="text-sm">🪿</span>;
    if (tile.status === 'MATURE' && tile.crop) return <span className="text-sm">{CROP_SPECS[tile.crop]?.icon || '🌾'}</span>;
    if (tile.status === 'PLANTED' && tile.crop) {
      return <span className="text-xs">{tile.isWatered ? '💧🌱' : '🌱'}</span>;
    }
    if (tile.status === 'TILL') return <span className="text-xs">🟤</span>;
    return <span className="text-[10px] text-slate-600">·</span>;
  };

  return (
    <div className="space-y-6">
      
      {/* Hero Mission Control Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card 1: Greenie AI Status */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 to-emerald-950/30 border border-emerald-500/30 shadow-lg shadow-emerald-950/20 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
              <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-emerald-400">
                GREENIE AI CORE
              </span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-900/60 text-emerald-300 border border-emerald-500/30">
              OPTIMIZING
            </span>
          </div>
          <div className="text-lg font-black text-white font-display tracking-tight mb-1">
            Maximum Final Wealth
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Confidence: <strong className="text-emerald-400">91%</strong></span>
            <span>Policy: <strong className="text-cyan-400">{state.seasonPhase.split('—')[1] || 'BOOTSTRAP'}</strong></span>
          </div>
        </div>

        {/* Card 2: Net Worth vs Benchmark */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 to-cyan-950/30 border border-cyan-500/30 shadow-lg shadow-cyan-950/20 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-cyan-400">
              PROJECTED FINAL WEALTH
            </span>
            <span className="text-[10px] font-mono text-slate-400">Target: 3043.5</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black text-white font-mono">
              ${state.netWorth.toLocaleString()}
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400">
              +{((state.netWorth / 3043.5) * 100 - 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (state.netWorth / 3043.5) * 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Card 3: Liquid Sol Credits */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 to-amber-950/30 border border-amber-500/30 shadow-lg shadow-amber-950/20 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-amber-400">
              LIQUID SOL CREDITS
            </span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300 font-mono">
            ${state.cash.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 font-mono mt-1">
            Warehouse Stockpile: <strong className="text-slate-200">
              {Object.values(state.inventory).reduce((a, b) => a + b, 0)} units
            </strong>
          </div>
        </div>

        {/* Card 4: Opponent Radar */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 to-rose-950/30 border border-rose-500/30 shadow-lg shadow-rose-950/20 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-rose-400">
              COMPETITOR RADAR
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-rose-950 text-rose-300 border border-rose-500/40">
              {state.opponent.strategyConfidence}% CONF
            </span>
          </div>
          <div className="text-sm font-bold text-white font-mono truncate">
            {state.opponent.strategyClass}
          </div>
          <div className="text-xs text-slate-400 font-mono mt-1 flex items-center justify-between">
            <span>Net Worth: ~${state.opponent.estimatedNetWorth.toLocaleString()}</span>
            <span className="text-rose-400 font-bold">Looming Wave: 🍅</span>
          </div>
        </div>
      </div>

      {/* Main Grid & Command Center Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Cols: Interactive 10x10 Galactic Farm Map */}
        <div className="lg:col-span-8 p-5 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-2xl backdrop-blur-xl flex flex-col">
          
          {/* Farm Header Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
            <div className="flex items-center space-x-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="text-sm font-bold text-white font-mono">Galactic Farm Bio-Grid (10×10)</h3>
                <p className="text-[11px] text-slate-400">Autonomous multi-agent field operations</p>
              </div>
            </div>

            {/* Quadrant Quick Selectors */}
            <div className="flex items-center space-x-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
              {(['NW', 'NE', 'SW', 'SE'] as QuadrantId[]).map(q => (
                <button
                  key={q}
                  onClick={() => setSelectedQuadrant(q)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition ${
                    selectedQuadrant === q
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {q} {state.quadrants[q].isUnlocked ? '✓' : '🔒'}
                </button>
              ))}
            </div>
          </div>

          {/* 10x10 Grid View */}
          <div className="flex-1 flex items-center justify-center p-2">
            <div className="grid grid-cols-10 gap-1.5 w-full max-w-[560px] aspect-square bg-slate-900/40 p-2.5 rounded-2xl border border-slate-800/80">
              {state.grid.map((row, y) =>
                row.map((tile, x) => (
                  <button
                    key={`${x}-${y}`}
                    onClick={() => onSelectTile(tile)}
                    onMouseEnter={() => setHoveredTile(tile)}
                    className={`aspect-square rounded-xl border transition flex flex-col items-center justify-center relative cursor-pointer group ${getTileColor(
                      tile
                    )}`}
                  >
                    {getTileIcon(tile)}
                    
                    {/* Worker Position Overlay */}
                    {state.workers.some(w => w.x === x && w.y === y) && (
                      <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-400 text-slate-950 font-black text-[9px] flex items-center justify-center ring-2 ring-slate-950 shadow-md">
                        🤖
                      </div>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Tile Status Bar & Hover Legend */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400">
            <div className="flex items-center space-x-3">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
                <span>Mature</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-teal-500"></span>
                <span>Watered</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span>
                <span>Dry</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-purple-500"></span>
                <span>Livestock</span>
              </span>
            </div>

            {hoveredTile ? (
              <div className="text-emerald-300 font-bold">
                Tile ({hoveredTile.x}, {hoveredTile.y}) • {hoveredTile.quadrant} • {hoveredTile.crop || hoveredTile.status}
              </div>
            ) : (
              <div>Click any tile to inspect or issue manual directive</div>
            )}
          </div>

        </div>

        {/* Right 4 Cols: Live Telemetry & Arbitrage Tickers */}
        <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
          
          {/* Active Quadrant Details & ROI */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs font-sans">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-white font-mono">{activeQuad.name}</span>
              {activeQuad.isUnlocked ? (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                  UNLOCKED
                </span>
              ) : (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-400">
                  LOCKED (${activeQuad.unlockCost})
                </span>
              )}
            </div>
            <p className="text-slate-400 text-[11px] mb-2">{activeQuad.soilQualityRating}</p>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 pt-2 border-t border-slate-800">
              <span>Expected Expansion ROI:</span>
              <span className="text-emerald-400 font-bold">+{activeQuad.expectedROI}%</span>
            </div>
          </div>

          {/* Market Arbitrage Quick Feed */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white font-mono">Market Arbitrage Signals</span>
                </div>
                <button
                  onClick={() => setActiveView('MARKET_TERMINAL')}
                  className="text-[11px] font-mono text-emerald-400 hover:underline flex items-center"
                >
                  <span>Terminal</span>
                  <ChevronRight className="w-3 h-3 ml-0.5" />
                </button>
              </div>

              <div className="space-y-2">
                {(['STRAWBERRY', 'TOMATO', 'MELON', 'MILK'] as CommodityType[]).map(id => {
                  const p = state.market[id];
                  if (!p) return null;
                  return (
                    <div
                      key={id}
                      className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-base">{p.icon}</span>
                        <div>
                          <div className="font-bold text-slate-200 font-mono">{p.name}</div>
                          <div className="text-[10px] text-slate-400">Scarcity: {p.scarcityScore}/100</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono font-bold text-white">${p.currentPrice}</div>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                            p.aiRecommendation === 'PRODUCE'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                              : p.aiRecommendation === 'SELL'
                              ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                              : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                          }`}
                        >
                          {p.aiRecommendation}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Arbitrage Engine Status:</span>
              <span className="text-emerald-400 font-mono font-bold">ACTIVE (O(1) Policy)</span>
            </div>
          </div>

          {/* Last Action Telemetry Banner */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/40 border border-emerald-500/20 text-xs font-mono text-slate-300 flex items-center space-x-2">
            <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">{state.lastActionSummary}</span>
          </div>

        </div>

      </div>

    </div>
  );
};
