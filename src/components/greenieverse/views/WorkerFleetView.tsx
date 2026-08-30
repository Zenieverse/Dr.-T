// ============================================================================
// 🌌 GREENIEVERSE - WORKER FLEET & PATH OPTIMIZATION
// Multi-agent worker routing, task priorities, and hiring marginal value engine
// ============================================================================

import React from 'react';
import { GameState, WorkerAgent } from '../../../types/greenieverse';
import { WorkerManager } from '../../../engine/greenieverse/workers/WorkerManager';
import { 
  Users, 
  Bot, 
  MapPin, 
  Navigation, 
  PlusCircle, 
  TrendingUp, 
  Zap, 
  Activity, 
  ShieldCheck 
} from 'lucide-react';

interface WorkerFleetViewProps {
  state: GameState;
  onHireWorker: () => void;
}

export const WorkerFleetView: React.FC<WorkerFleetViewProps> = ({ state, onHireWorker }) => {
  const remainingTurns = state.maxTurns - state.currentTurn;
  const unlockedTiles = state.grid.flat().filter(t => t.isUnlocked).length;
  
  const hiringAnalysis = WorkerManager.evaluateHiringWorker(
    state.workers.length,
    unlockedTiles,
    state.cash,
    remainingTurns
  );

  const canHire = hiringAnalysis.recommendation === 'HIRE' && state.cash >= hiringAnalysis.cost;

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Worker Fleet Telemetry & Marginal ROI Engine */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Fleet Status */}
        <div className="md:col-span-2 p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold">
                  🤖
                </div>
                <div>
                  <h4 className="text-base font-bold text-white font-mono">Autonomous Worker Fleet</h4>
                  <p className="text-xs text-slate-400">Multi-agent path optimization (Manhattan Routing)</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                {state.workers.length} ACTIVE DRONES
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 my-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Total Unlocked Tiles</span>
                <div className="text-lg font-bold text-white mt-1">{unlockedTiles} Tiles</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Tiles / Worker Ratio</span>
                <div className="text-lg font-bold text-cyan-400 mt-1">
                  {(unlockedTiles / Math.max(1, state.workers.length)).toFixed(1)} : 1
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Fleet Efficiency</span>
                <div className="text-lg font-bold text-emerald-400 mt-1">94.2%</div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>Routing Algorithm:</span>
            <span className="text-cyan-400 font-bold">Manhattan Min-Distance + Scarcity Weighting</span>
          </div>
        </div>

        {/* Card 2: Marginal Hiring Value Calculator */}
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono uppercase text-amber-400 font-bold">Marginal Value Engine</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                hiringAnalysis.recommendation === 'HIRE'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {hiringAnalysis.recommendation}
              </span>
            </div>

            <div className="space-y-2 mt-3 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Next Worker Salary:</span>
                <span className="text-white font-bold">${hiringAnalysis.cost}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Marginal Revenue:</span>
                <span className="text-emerald-400 font-bold">+${hiringAnalysis.expectedAdditionalRevenue}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Expected Net Profit:</span>
                <span className="text-cyan-400 font-bold">+${hiringAnalysis.expectedProfit}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 font-sans mt-3 pt-3 border-t border-slate-800 leading-relaxed">
              {hiringAnalysis.reason}
            </p>
          </div>

          <button
            onClick={onHireWorker}
            disabled={!canHire}
            className={`w-full mt-4 py-2.5 rounded-xl font-mono text-xs font-bold transition flex items-center justify-center space-x-2 ${
              canHire
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Hire Worker #{state.workers.length + 1} (${hiringAnalysis.cost})</span>
          </button>
        </div>

      </div>

      {/* Active Worker Agents List */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-cyan-400" />
            <h4 className="text-sm font-bold text-white font-mono">Real-Time Worker Dispatches</h4>
          </div>
          <span className="text-xs font-mono text-slate-400">Autonomous Task Engine</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {state.workers.map((w, idx) => (
            <div
              key={w.id}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
                  <span className="font-bold text-white font-mono text-sm">{w.name}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  {w.status}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 font-mono">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Current Task: <strong className="text-emerald-400">{w.task}</strong></span>
                  <span>Position: <strong>({w.x}, {w.y})</strong></span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans pt-1">
                  {w.targetDescription}
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Task Value Priority: <strong className="text-cyan-300">{w.taskValue} pts</strong></span>
                <span>Distance to Target: <strong className="text-slate-200">{w.distanceToTarget} steps</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
