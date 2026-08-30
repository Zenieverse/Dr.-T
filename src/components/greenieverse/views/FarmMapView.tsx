// ============================================================================
// 🌌 GREENIEVERSE - EXPANDED FARM MAP & QUADRANT VIEW
// Interactive 10x10 tile inspector, soil health, and land expansion ROI engine
// ============================================================================

import React, { useState } from 'react';
import { 
  GameState, 
  TileState, 
  QuadrantId, 
  CropType 
} from '../../../types/greenieverse';
import { CROP_SPECS, LIVESTOCK_SPECS } from '../../../engine/greenieverse/constants';
import { 
  Layers, 
  Droplets, 
  Sparkles, 
  Lock, 
  Unlock, 
  TrendingUp, 
  Shovel, 
  Sprout, 
  ShieldCheck 
} from 'lucide-react';

interface FarmMapViewProps {
  state: GameState;
  onSelectTile: (tile: TileState) => void;
  onPlantCrop: (x: number, y: number, crop: CropType) => void;
  onWaterTile: (x: number, y: number) => void;
  onHarvestTile: (x: number, y: number) => void;
  onUnlockQuadrant: (quadrantId: QuadrantId) => void;
}

export const FarmMapView: React.FC<FarmMapViewProps> = ({
  state,
  onSelectTile,
  onPlantCrop,
  onWaterTile,
  onHarvestTile,
  onUnlockQuadrant,
}) => {
  const [selectedCoords, setSelectedCoords] = useState<{ x: number; y: number }>({ x: 1, y: 1 });
  const [selectedCropToPlant, setSelectedCropToPlant] = useState<CropType>('STRAWBERRY');

  const selectedTile = state.grid[selectedCoords.y]?.[selectedCoords.x] || state.grid[0][0];

  const getTileColor = (tile: TileState) => {
    if (!tile.isUnlocked) return 'bg-slate-950/80 border-slate-900 text-slate-700 opacity-60';
    if (tile.status === 'ANIMAL_PEN') return 'bg-purple-950/50 border-purple-500 text-purple-300';
    if (tile.status === 'MATURE') return 'bg-emerald-950/70 border-emerald-400 text-emerald-300 ring-1 ring-emerald-400 animate-pulse';
    if (tile.status === 'PLANTED') {
      return tile.isWatered 
        ? 'bg-teal-950/60 border-teal-500 text-teal-300' 
        : 'bg-amber-950/50 border-amber-500 text-amber-300';
    }
    if (tile.status === 'TILL') return 'bg-amber-950/30 border-amber-800 text-amber-400';
    return 'bg-slate-900/60 border-slate-800 hover:border-emerald-500 text-slate-500';
  };

  const getTileIcon = (tile: TileState) => {
    if (!tile.isUnlocked) return <Lock className="w-4 h-4 text-slate-700" />;
    if (tile.status === 'ANIMAL_PEN') return <span className="text-base">🪿</span>;
    if (tile.status === 'MATURE' && tile.crop) return <span className="text-base">{CROP_SPECS[tile.crop]?.icon || '🌾'}</span>;
    if (tile.status === 'PLANTED' && tile.crop) {
      return <span className="text-sm">{tile.isWatered ? '💧🌱' : '🌱'}</span>;
    }
    if (tile.status === 'TILL') return <span className="text-xs">🟤</span>;
    return <span className="text-xs text-slate-600">·</span>;
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Quadrant Expansion Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {(['NW', 'NE', 'SW', 'SE'] as QuadrantId[]).map(qId => {
          const q = state.quadrants[qId];
          const canUnlock = !q.isUnlocked && state.cash >= q.unlockCost;

          return (
            <div
              key={qId}
              className={`p-4 rounded-2xl border transition ${
                q.isUnlocked
                  ? 'bg-slate-900/80 border-emerald-500/40 shadow-md shadow-emerald-950/20'
                  : canUnlock
                  ? 'bg-slate-900/90 border-cyan-500/60 shadow-md shadow-cyan-950/30'
                  : 'bg-slate-950/60 border-slate-800/80 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-white font-mono text-xs">{q.name}</span>
                {q.isUnlocked ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                    ACTIVE (25/25)
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400">
                    LOCKED
                  </span>
                )}
              </div>

              <p className="text-[11px] text-slate-400 mb-3">{q.soilQualityRating}</p>

              <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-slate-800">
                <span className="text-slate-400">Expected ROI:</span>
                <span className="text-emerald-400 font-bold">+{q.expectedROI}%</span>
              </div>

              {!q.isUnlocked && (
                <button
                  onClick={() => onUnlockQuadrant(qId)}
                  disabled={!canUnlock}
                  className={`w-full mt-3 py-1.5 rounded-xl font-mono text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                    canUnlock
                      ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20 cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Unlock (${q.unlockCost} Credits)</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Main Grid + Tile Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Cols: Full Grid */}
        <div className="lg:col-span-8 p-5 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="text-sm font-bold text-white font-mono">Planetary Farm Array (100 Tiles)</h3>
                <p className="text-[11px] text-slate-400">Select any tile for soil diagnostics or manual agricultural intervention</p>
              </div>
            </div>

            <div className="text-xs font-mono text-slate-400">
              Unlocked: <strong className="text-emerald-400">
                {state.grid.flat().filter(t => t.isUnlocked).length} / 100
              </strong>
            </div>
          </div>

          <div className="grid grid-cols-10 gap-2 w-full max-w-[620px] aspect-square bg-slate-900/50 p-3.5 rounded-2xl border border-slate-800/80">
            {state.grid.map((row, y) =>
              row.map((tile, x) => (
                <button
                  key={`${x}-${y}`}
                  onClick={() => {
                    setSelectedCoords({ x, y });
                    onSelectTile(tile);
                  }}
                  className={`aspect-square rounded-xl border transition flex flex-col items-center justify-center relative cursor-pointer group ${getTileColor(
                    tile
                  )} ${selectedTile.x === x && selectedTile.y === y ? 'ring-2 ring-cyan-400 scale-105 z-10' : ''}`}
                >
                  {getTileIcon(tile)}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right 4 Cols: Tile Inspector & Control Panel */}
        <div className="lg:col-span-4 p-5 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-4">
          
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[11px] font-mono uppercase text-emerald-400 font-bold">Tile Diagnostic Probe</span>
                <h4 className="text-base font-bold text-white font-mono">
                  Coordinates: ({selectedTile.x}, {selectedTile.y})
                </h4>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                selectedTile.isUnlocked ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
              }`}>
                {selectedTile.quadrant} • {selectedTile.status}
              </span>
            </div>

            {/* Diagnostic Metrics */}
            <div className="grid grid-cols-2 gap-3 my-4">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
                <span className="text-slate-400">Soil Health Index</span>
                <div className="text-base font-bold text-emerald-400 mt-1">
                  {selectedTile.soilHealth} / 100
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
                <span className="text-slate-400">Moisture Content</span>
                <div className="text-base font-bold text-teal-400 mt-1">
                  {selectedTile.moisture}% {selectedTile.isWatered ? '💧' : '☀️'}
                </div>
              </div>
            </div>

            {/* Crop Info if planted */}
            {selectedTile.crop && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 mb-4 text-xs font-sans">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white font-mono flex items-center space-x-1.5">
                    <span>{CROP_SPECS[selectedTile.crop]?.icon}</span>
                    <span>{CROP_SPECS[selectedTile.crop]?.name}</span>
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">
                    Age: {selectedTile.cropAge?.toFixed(0)} / {selectedTile.cropMaxAge} turns
                  </span>
                </div>

                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, ((selectedTile.cropAge || 0) / (selectedTile.cropMaxAge || 1)) * 100)}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Manual Action Palette */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-slate-400">Manual Directives:</span>

              {/* Plant selector */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-[11px] font-mono text-slate-300">Select Seed Variety:</div>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['WHEAT', 'CARROT', 'TOMATO', 'STRAWBERRY', 'MELON'] as CropType[]).map(c => (
                    <button
                      key={c}
                      onClick={() => setSelectedCropToPlant(c)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition flex items-center justify-center space-x-1 ${
                        selectedCropToPlant === c
                          ? 'bg-emerald-500 text-slate-950 shadow-xs'
                          : 'bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      <span>{CROP_SPECS[c].icon}</span>
                      <span>{c}</span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => onPlantCrop(selectedTile.x, selectedTile.y, selectedCropToPlant)}
                  disabled={!selectedTile.isUnlocked || state.cash < CROP_SPECS[selectedCropToPlant].seedCost}
                  className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold font-mono text-xs transition cursor-pointer shadow-md shadow-emerald-500/20 flex items-center justify-center space-x-1.5"
                >
                  <Sprout className="w-3.5 h-3.5" />
                  <span>Sow {selectedCropToPlant} (${CROP_SPECS[selectedCropToPlant].seedCost})</span>
                </button>
              </div>

              {/* Water & Harvest buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onWaterTile(selectedTile.x, selectedTile.y)}
                  disabled={!selectedTile.isUnlocked}
                  className="py-2 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white font-bold font-mono text-xs transition cursor-pointer flex items-center justify-center space-x-1"
                >
                  <Droplets className="w-3.5 h-3.5" />
                  <span>Water Plot</span>
                </button>

                <button
                  onClick={() => onHarvestTile(selectedTile.x, selectedTile.y)}
                  disabled={selectedTile.status !== 'MATURE'}
                  className="py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold font-mono text-xs transition cursor-pointer flex items-center justify-center space-x-1"
                >
                  <Shovel className="w-3.5 h-3.5" />
                  <span>Harvest Now</span>
                </button>
              </div>
            </div>

          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 font-mono flex items-center justify-between">
            <span>Soil Matrix Status:</span>
            <span className="text-emerald-400 font-bold">OPTIMAL PHOTO-FLOW</span>
          </div>

        </div>

      </div>

    </div>
  );
};
