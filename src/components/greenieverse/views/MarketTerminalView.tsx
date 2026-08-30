// ============================================================================
// 🌌 GREENIEVERSE - GALACTIC MARKET TERMINAL & ARBITRAGE ENGINE
// Real-time market terminal, interactive price charts, and multi-timeframe overlays
// ============================================================================

import React, { useState } from 'react';
import { 
  GameState, 
  CommodityType, 
  MarketProductInfo 
} from '../../../types/greenieverse';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  BarChart3, 
  Coins, 
  Layers, 
  AlertCircle, 
  CheckCircle2, 
  ShieldAlert 
} from 'lucide-react';

interface MarketTerminalViewProps {
  state: GameState;
  onSellCommodity: (item: CommodityType, count: number) => void;
}

export const MarketTerminalView: React.FC<MarketTerminalViewProps> = ({
  state,
  onSellCommodity,
}) => {
  const [selectedCommodity, setSelectedCommodity] = useState<CommodityType>('STRAWBERRY');
  const [timeframe, setTimeframe] = useState<'1D' | '3D' | '7D' | 'SEASON'>('7D');
  const [showOverlays, setShowOverlays] = useState({
    predicted: true,
    opponentSupply: true,
    townDemand: true,
  });

  const activeProduct: MarketProductInfo = state.market[selectedCommodity];
  const storedCount = state.inventory[selectedCommodity] || 0;

  // Generate SVG path for price graph
  const history = activeProduct?.historicalPrices || [];
  const minP = Math.min(...history.map(h => h.actual), activeProduct.currentPrice) * 0.85;
  const maxP = Math.max(...history.map(h => h.predicted), activeProduct.forecast24Turn) * 1.15;

  const getPoints = (key: 'actual' | 'predicted') => {
    if (!history.length) return '';
    return history
      .map((h, idx) => {
        const x = (idx / (history.length - 1)) * 500;
        const val = key === 'actual' ? h.actual : h.predicted;
        const y = 200 - ((val - minP) / (maxP - minP || 1)) * 180;
        return `${x},${y}`;
      })
      .join(' ');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Commodity Cards Ticker Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {(Object.keys(state.market) as CommodityType[]).map(id => {
          const item = state.market[id];
          const isSelected = selectedCommodity === id;
          const isUp = item.priceChangePercent >= 0;

          return (
            <button
              key={id}
              onClick={() => setSelectedCommodity(id)}
              className={`p-3 rounded-2xl border text-left transition relative cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 border-emerald-500 ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-950/30'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xl">{item.icon}</span>
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    item.aiRecommendation === 'PRODUCE'
                      ? 'bg-emerald-950 text-emerald-300'
                      : item.aiRecommendation === 'SELL'
                      ? 'bg-cyan-950 text-cyan-300'
                      : 'bg-rose-950 text-rose-300'
                  }`}
                >
                  {item.aiRecommendation}
                </span>
              </div>

              <div className="text-xs font-bold text-slate-200 font-mono truncate">{item.name}</div>
              <div className="text-sm font-black text-white font-mono mt-0.5">${item.currentPrice}</div>

              <div className={`text-[10px] font-mono flex items-center mt-1 ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isUp ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                <span>{isUp ? '+' : ''}{item.priceChangePercent}%</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Chart & Arbitrage Engine Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Cols: Chart & Technical Indicators */}
        <div className="lg:col-span-8 p-5 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl flex flex-col justify-between">
          
          <div>
            {/* Header Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{activeProduct.icon}</span>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-white font-mono">{activeProduct.name}</h3>
                    <span className="text-xs text-slate-400 font-mono">[{activeProduct.category}]</span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    Scarcity Index: <strong className="text-emerald-400">{activeProduct.scarcityScore}/100</strong> • Demand: <strong className="text-cyan-400">{activeProduct.demand}</strong>
                  </div>
                </div>
              </div>

              {/* Timeframe switch */}
              <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-mono">
                {(['1D', '3D', '7D', 'SEASON'] as const).map(tf => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-3 py-1 rounded-lg transition ${
                      timeframe === tf
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* SVG Price Chart */}
            <div className="my-6 relative bg-slate-900/40 p-4 rounded-2xl border border-slate-800/80">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                <span>Galactic Exchange Spot Price (Sol Credits)</span>
                <span>24-Turn Forecast: <strong className="text-emerald-400">${activeProduct.forecast24Turn}</strong></span>
              </div>

              <svg viewBox="0 0 500 200" className="w-full h-48 overflow-visible">
                {/* Horizontal Grid lines */}
                <line x1="0" y1="50" x2="500" y2="50" stroke="#334155" strokeDasharray="3 3" opacity="0.4" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="#334155" strokeDasharray="3 3" opacity="0.4" />
                <line x1="0" y1="150" x2="500" y2="150" stroke="#334155" strokeDasharray="3 3" opacity="0.4" />

                {/* Predicted Path (Dashed Cyan) */}
                {showOverlays.predicted && (
                  <polyline
                    fill="none"
                    stroke="#06B6D4"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    points={getPoints('predicted')}
                  />
                )}

                {/* Actual Price Path (Solid Emerald) */}
                <polyline
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="3"
                  points={getPoints('actual')}
                />

                {/* Markers */}
                {activeProduct.scarcityScore >= 80 && (
                  <g transform="translate(420, 30)">
                    <circle r="4" fill="#EC4899" className="animate-ping" />
                    <circle r="4" fill="#EC4899" />
                    <text x="8" y="4" fill="#EC4899" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      SCARCITY PEAK
                    </text>
                  </g>
                )}
              </svg>

              {/* Chart Legend / Toggle Overlays */}
              <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-800/80 text-xs font-mono text-slate-400">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1.5 text-emerald-400 font-bold">
                    <span className="w-3 h-0.5 bg-emerald-400"></span>
                    <span>Actual Price (${activeProduct.currentPrice})</span>
                  </span>
                  <span className="flex items-center space-x-1.5 text-cyan-400">
                    <span className="w-3 h-0.5 bg-cyan-400 border-t border-dashed"></span>
                    <span>Predicted Path (${activeProduct.forecast24Turn})</span>
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[11px]">Price Velocity: <strong className="text-slate-200">+{activeProduct.priceVelocity}/turn</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Arbitrage Reason & Warehouse Stockpile Action */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs">
              <span className="text-slate-400 font-mono">Stored Inventory: </span>
              <strong className="text-white font-mono text-sm">{storedCount} units </strong>
              <span className="text-emerald-400 font-mono font-bold">(${storedCount * activeProduct.currentPrice} total value)</span>
            </div>

            <button
              onClick={() => onSellCommodity(selectedCommodity, storedCount)}
              disabled={storedCount <= 0}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 disabled:opacity-30 text-slate-950 font-bold font-mono text-xs transition shadow-md shadow-cyan-500/20 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Coins className="w-4 h-4" />
              <span>Liquidate Stockpile (+${storedCount * activeProduct.currentPrice})</span>
            </button>
          </div>

        </div>

        {/* Right 4 Cols: Market Arbitrage Engine Insights */}
        <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
          
          <div className="p-5 rounded-3xl bg-slate-900 border border-emerald-500/30 shadow-xl space-y-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-bold text-white font-mono">Market Arbitrage Engine</h4>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">Greenie AI Directive:</span>
                <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-black bg-emerald-500 text-slate-950 shadow-xs">
                  {activeProduct.aiRecommendation}
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed pt-2 border-t border-slate-800">
                {activeProduct.aiReasoning}
              </p>
            </div>

            {/* Macro Metrics List */}
            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Current Market Supply:</span>
                <span className="text-white font-bold">{activeProduct.marketSupply}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Town Demand Index:</span>
                <span className="text-cyan-400 font-bold">{activeProduct.demand}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">24-Turn Forecast Shift:</span>
                <span className="text-emerald-400 font-bold">
                  {activeProduct.forecast24Turn >= activeProduct.currentPrice ? '+' : ''}
                  ${activeProduct.forecast24Turn - activeProduct.currentPrice}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-400 leading-relaxed">
            <strong className="text-emerald-400">Trading Rule:</strong> Greenie AI exploits supply-lag arbitrage. Never sell into an opponent harvest wave; produce into scarcity and liquidate at peak.
          </div>

        </div>

      </div>

    </div>
  );
};
