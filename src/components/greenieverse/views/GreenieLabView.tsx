// ============================================================================
// 🌌 GREENIEVERSE - GREENIE LAB & EVOLUTIONARY OPTIMIZER
// Self-play tournament engine, strategy benchmarks, and genome evolution
// ============================================================================

import React, { useState } from 'react';
import { MatchResult, EvolutionGenome } from '../../../types/greenieverse';
import { GreenieSimulator } from '../../../engine/greenieverse/simulation/GreenieSimulator';
import { EvolutionEngine } from '../../../engine/greenieverse/strategy/EvolutionEngine';
import { 
  FlaskConical, 
  Trophy, 
  Dna, 
  Play, 
  RefreshCw, 
  CheckCircle2, 
  TrendingUp, 
  Award, 
  ShieldCheck 
} from 'lucide-react';

export const GreenieLabView: React.FC = () => {
  const [matches, setMatches] = useState<MatchResult[]>([
    {
      matchId: 'match-104823-1',
      seed: 104823,
      greenieScore: 3187,
      opponentScore: 2974,
      opponentType: 'TitanAgri-7',
      winner: 'GREENIE',
      totalTurns: 720,
      timestamp: '14:22:04',
      keyTurningPoint: 'Liquidated Nebula Strawberries at peak scarcity index (+38% price premium).',
    },
    {
      matchId: 'match-104824-2',
      seed: 104824,
      greenieScore: 3240,
      opponentScore: 2890,
      opponentType: 'Greedy Bot',
      winner: 'GREENIE',
      totalTurns: 720,
      timestamp: '14:24:18',
      keyTurningPoint: 'Avoided competitor tomato supply glut and scaled into Supernova Melons.',
    },
    {
      matchId: 'match-104825-3',
      seed: 104825,
      greenieScore: 3110,
      opponentScore: 3010,
      opponentType: 'Market Trader Bot',
      winner: 'GREENIE',
      totalTurns: 720,
      timestamp: '14:26:50',
      keyTurningPoint: 'Late-game Phase 4 emergency liquidation cleared inventory before Turn 720.',
    },
  ]);

  const [genomes, setGenomes] = useState<EvolutionGenome[]>(EvolutionEngine.getHistoricalGenerations());
  const [isRunning, setIsRunning] = useState(false);
  const [activeGenomeGen, setActiveGenomeGen] = useState<number>(50);

  const totalMatches = matches.length;
  const wins = matches.filter(m => m.winner === 'GREENIE').length;
  const winRate = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;
  const avgScore = totalMatches > 0 ? Math.round(matches.reduce((a, b) => a + b.greenieScore, 0) / totalMatches) : 0;
  const bestScore = totalMatches > 0 ? Math.max(...matches.map(m => m.greenieScore)) : 0;

  const handleRunTournament = () => {
    setIsRunning(true);
    setTimeout(() => {
      const newMatches = GreenieSimulator.runTournament(5);
      setMatches(prev => [...newMatches, ...prev].slice(0, 15));
      
      // Evolve latest genome
      const latest = genomes[genomes.length - 1];
      const evolved = EvolutionEngine.mutateGenome(latest);
      setGenomes(prev => [...prev, evolved]);
      setActiveGenomeGen(evolved.generation);

      setIsRunning(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Lab Metrics & Run Trigger */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-950 border border-purple-500/30 shadow-2xl backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-purple-900/30 ring-2 ring-purple-400/40">
            <FlaskConical className="w-7 h-7 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-black text-white font-mono">Greenie Self-Play Lab</h3>
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-purple-950 text-purple-300 border border-purple-500/40">
                BENCHMARK ENGINE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Empirical self-play validation across diverse agricultural baselines
            </p>
          </div>
        </div>

        <button
          onClick={handleRunTournament}
          disabled={isRunning}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 disabled:opacity-50 text-slate-950 font-black font-mono text-sm transition shadow-lg shadow-purple-500/20 flex items-center space-x-2 cursor-pointer"
        >
          {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
          <span>{isRunning ? 'Simulating Matches...' : 'Run 5-Match Tournament'}</span>
        </button>
      </div>

      {/* Aggregate Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs font-mono">
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <span className="text-slate-400">Total Matches</span>
          <div className="text-xl font-black text-white mt-1">{totalMatches} Matches</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <span className="text-slate-400">Win Rate</span>
          <div className="text-xl font-black text-emerald-400 mt-1">{winRate}%</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <span className="text-slate-400">Avg Greenie Score</span>
          <div className="text-xl font-black text-cyan-400 mt-1">{avgScore}</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <span className="text-slate-400">Best Match Score</span>
          <div className="text-xl font-black text-amber-300 mt-1">{bestScore}</div>
        </div>
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <span className="text-slate-400">Target Benchmark</span>
          <div className="text-xl font-black text-slate-300 mt-1">3043.5</div>
        </div>
      </div>

      {/* Evolutionary Strategy Optimizer (50 Generations) */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Dna className="w-5 h-5 text-purple-400" />
            <h4 className="text-sm font-bold text-white font-mono">Evolutionary Strategy Optimizer (Genome Trajectory)</h4>
          </div>
          <span className="text-xs font-mono text-purple-400">Generations 1 → 50+</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {genomes.map(g => (
            <button
              key={g.generation}
              onClick={() => setActiveGenomeGen(g.generation)}
              className={`p-4 rounded-2xl border text-left transition relative cursor-pointer ${
                activeGenomeGen === g.generation
                  ? 'bg-purple-950/40 border-purple-500 ring-2 ring-purple-500/40 shadow-lg shadow-purple-950/30'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white font-mono">GEN {g.generation}</span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">{g.winRate}% Win</span>
              </div>

              <div className="text-2xl font-black text-white font-mono mb-1">
                {g.fitnessScore} pts
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                Cutoff: Turn {g.endgameTurnCutoff} • Risk Tol: {g.riskTolerance}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Match History Table */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h4 className="text-sm font-bold text-white font-mono">Verified Match Log History</h4>
          </div>
          <span className="text-xs font-mono text-slate-400">720 Turns / Match</span>
        </div>

        <div className="space-y-3">
          {matches.map(m => (
            <div
              key={m.matchId}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs font-mono"
            >
              <div className="flex items-center space-x-3">
                <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black ${
                  m.winner === 'GREENIE' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' : 'bg-rose-950 text-rose-400'
                }`}>
                  {m.winner === 'GREENIE' ? 'W' : 'L'}
                </span>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white">Greenie AI ({m.greenieScore}) vs {m.opponentType} ({m.opponentScore})</span>
                    <span className="text-[10px] text-slate-500">Seed: {m.seed}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                    Turning point: {m.keyTurningPoint}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs text-slate-400">{m.timestamp}</span>
                <div className="text-xs font-bold text-emerald-400">
                  +{m.greenieScore - m.opponentScore} pt delta
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
