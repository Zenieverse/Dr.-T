// ============================================================================
// 🌌 GREENIEVERSE - PRIMARY APPLICATION COMPONENT
// Galactic Farming Intelligence & Autonomous Agriculture Simulation
// ============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { 
  GameState, 
  GreenieViewTab, 
  TileState, 
  QuadrantId, 
  CropType, 
  CommodityType,
  WorkerAgent 
} from '../../types/greenieverse';
import { GreenieSimulator } from '../../engine/greenieverse/simulation/GreenieSimulator';
import { CROP_SPECS, TARGET_SCORE } from '../../engine/greenieverse/constants';
import { CommandCenterView } from './views/CommandCenterView';
import { FarmMapView } from './views/FarmMapView';
import { MarketTerminalView } from './views/MarketTerminalView';
import { OpponentIntelView } from './views/OpponentIntelView';
import { EconomyPortfolioView } from './views/EconomyPortfolioView';
import { WorkerFleetView } from './views/WorkerFleetView';
import { GreenieLabView } from './views/GreenieLabView';
import { ReplayExplainerView } from './views/ReplayExplainerView';
import { GalacticExpansionView } from './views/GalacticExpansionView';
import { SpecDocsView } from './views/SpecDocsView';
import { MeteorShowerEffect } from './components/MeteorShowerEffect';
import { GreenieCopilotDrawer } from './components/GreenieCopilotDrawer';
import { KaggleExporterModal } from './components/KaggleExporterModal';
import { StateInspectorModal } from './components/StateInspectorModal';

import { 
  Play, 
  Pause, 
  FastForward, 
  RotateCcw, 
  Bot, 
  Download, 
  Cpu, 
  Trophy, 
  Layers, 
  TrendingUp, 
  Radar, 
  Scale, 
  Users, 
  Dna, 
  History, 
  Target, 
  Globe, 
  BookOpen, 
  Sparkles, 
  Coins, 
  Zap, 
  ShieldCheck 
} from 'lucide-react';

export const GreenieVerseApp: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => GreenieSimulator.createInitialState());
  const [activeView, setActiveView] = useState<GreenieViewTab>('COMMAND_CENTER');
  
  // Modals & Drawers
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isExporterOpen, setIsExporterOpen] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  // Auto-run simulation state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState<number>(1); // 1x, 5x, 10x
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Meteor Shower Effect State
  const [meteorIntensity, setMeteorIntensity] = useState<'calm' | 'active' | 'storm'>('active');
  const [triggerBurstCount, setTriggerBurstCount] = useState<number>(0);

  const triggerMeteorBurst = () => {
    setTriggerBurstCount(prev => prev + 1);
  };

  const toggleMeteorIntensity = () => {
    setMeteorIntensity(prev => {
      if (prev === 'calm') return 'active';
      if (prev === 'active') return 'storm';
      return 'calm';
    });
    triggerMeteorBurst();
  };

  // Simulation step handler
  const handleStep = () => {
    setGameState(prev => {
      const next = GreenieSimulator.step(prev);
      if (next.seasonPhase !== prev.seasonPhase) {
        triggerMeteorBurst();
      }
      return next;
    });
  };

  const handleFastForward = (turns: number) => {
    triggerMeteorBurst();
    setGameState(prev => GreenieSimulator.fastForward(prev, turns));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setGameState(GreenieSimulator.createInitialState());
  };

  // Auto-play effect
  useEffect(() => {
    if (isPlaying) {
      const interval = Math.max(100, 800 / playSpeed);
      timerRef.current = setInterval(() => {
        setGameState(prev => {
          if (prev.status === 'COMPLETED') {
            setIsPlaying(false);
            return prev;
          }
          return GreenieSimulator.step(prev);
        });
      }, interval);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playSpeed]);

  // Farm Interactive Handlers
  const handlePlantCrop = (x: number, y: number, crop: CropType) => {
    const spec = CROP_SPECS[crop];
    if (gameState.cash < spec.seedCost) return;

    setGameState(prev => {
      const nextGrid = prev.grid.map((row, rY) =>
        row.map((tile, rX) => {
          if (rX === x && rY === y) {
            return {
              ...tile,
              status: 'PLANTED' as const,
              crop,
              cropAge: 0,
              cropMaxAge: spec.growthTurns,
              isWatered: true,
            };
          }
          return tile;
        })
      );
      return {
        ...prev,
        cash: prev.cash - spec.seedCost,
        grid: nextGrid,
        lastActionSummary: `Commander manual action: Planted ${spec.name} at (${x}, ${y}) [-$${spec.seedCost}].`,
      };
    });
  };

  const handleWaterTile = (x: number, y: number) => {
    setGameState(prev => {
      const nextGrid = prev.grid.map((row, rY) =>
        row.map((tile, rX) => {
          if (rX === x && rY === y) {
            return { ...tile, isWatered: true };
          }
          return tile;
        })
      );
      return {
        ...prev,
        grid: nextGrid,
        lastActionSummary: `Commander manual action: Irrigated tile (${x}, ${y}).`,
      };
    });
  };

  const handleHarvestTile = (x: number, y: number) => {
    const tile = gameState.grid[y][x];
    if (tile.status !== 'MATURE' || !tile.crop) return;

    const spec = CROP_SPECS[tile.crop];
    setGameState(prev => {
      const nextGrid = prev.grid.map((row, rY) =>
        row.map((t, rX) => {
          if (rX === x && rY === y) {
            return {
              ...t,
              status: 'EMPTY' as const,
              crop: undefined,
              cropAge: 0,
            };
          }
          return t;
        })
      );
      const nextInv = { ...prev.inventory };
      nextInv[tile.crop!] = (nextInv[tile.crop!] || 0) + spec.yieldPerTile;

      return {
        ...prev,
        grid: nextGrid,
        inventory: nextInv,
        lastActionSummary: `Commander manual harvest: Harvested ${spec.yieldPerTile}x ${tile.crop} from (${x}, ${y}).`,
      };
    });
  };

  const handleSellCommodity = (item: CommodityType, count: number) => {
    if (count <= 0) return;
    const price = gameState.market[item]?.currentPrice || 40;
    const proceeds = count * price;

    setGameState(prev => {
      const nextInv = { ...prev.inventory };
      nextInv[item] = 0;
      return {
        ...prev,
        cash: prev.cash + proceeds,
        inventory: nextInv,
        lastActionSummary: `Commander manual sale: Liquidated ${count}x ${item} for +$${proceeds} Sol Credits.`,
      };
    });
  };

  const handleUnlockQuadrant = (qId: QuadrantId) => {
    const q = gameState.quadrants[qId];
    if (gameState.cash < q.unlockCost || q.isUnlocked) return;

    setGameState(prev => {
      const nextQuads = {
        ...prev.quadrants,
        [qId]: { ...prev.quadrants[qId], isUnlocked: true },
      };
      const nextGrid = prev.grid.map((row, y) =>
        row.map((tile, x) => {
          if (tile.quadrant === qId) {
            return { ...tile, isUnlocked: true };
          }
          return tile;
        })
      );
      return {
        ...prev,
        cash: prev.cash - q.unlockCost,
        quadrants: nextQuads,
        grid: nextGrid,
        lastActionSummary: `Expanded farm territory: Unlocked ${q.name} [-$${q.unlockCost}].`,
      };
    });
  };

  const handleHireWorker = () => {
    const cost = Math.round(850 * Math.pow(1.35, gameState.workers.length));
    if (gameState.cash < cost) return;

    setGameState(prev => {
      const newWorker: WorkerAgent = {
        id: `w-${prev.workers.length + 1}`,
        name: `Harvest-Drone 0${prev.workers.length + 1}`,
        x: 0,
        y: 0,
        task: 'TILL',
        efficiency: 95,
        status: 'ACTIVE',
        targetDescription: 'Automated field maintenance and hydration',
        taskValue: 120,
        distanceToTarget: 2,
      };
      return {
        ...prev,
        cash: prev.cash - cost,
        workers: [...prev.workers, newWorker],
        lastActionSummary: `Workforce expanded: Deployed ${newWorker.name} [-$${cost}].`,
      };
    });
  };

  const viewTabs: { id: GreenieViewTab; label: string; icon: React.ReactNode }[] = [
    { id: 'COMMAND_CENTER', label: 'Command Center', icon: <Layers className="w-4 h-4" /> },
    { id: 'FARM_GRID', label: 'Farm Array', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'MARKET_TERMINAL', label: 'Market Terminal', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'OPPONENT_INTEL', label: 'Competitor Radar', icon: <Radar className="w-4 h-4" /> },
    { id: 'ECONOMY_PORTFOLIO', label: 'Agri-Economics', icon: <Scale className="w-4 h-4" /> },
    { id: 'WORKERS_FLEET', label: 'Worker Fleet', icon: <Users className="w-4 h-4" /> },
    { id: 'GREENIE_LAB', label: 'Greenie Lab', icon: <Dna className="w-4 h-4" /> },
    { id: 'REPLAY_EXPLAINER', label: 'Decision Replay', icon: <History className="w-4 h-4" /> },
    { id: 'GALACTIC_EXPANSION', label: 'Galactic Colonies', icon: <Globe className="w-4 h-4" /> },
    { id: 'SPEC_DOCS', label: 'Specs & Docs', icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-900 selection:text-white pb-16 relative overflow-x-hidden">
      
      {/* 🌠 Galactic Meteor Shower & Starfield Layer */}
      <MeteorShowerEffect 
        intensity={meteorIntensity} 
        isSimulating={isPlaying} 
        triggerBurstCount={triggerBurstCount} 
      />

      {/* Top Galactic Command Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/95 border-b border-emerald-500/20 backdrop-blur-xl px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo & Season Phase Indicator */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400/40">
              <span className="text-xl">🌌</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base font-black tracking-wider text-white font-mono uppercase">
                  GreenieVerse
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                  {gameState.seasonPhase}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Galactic Farming Intelligence
              </p>
            </div>
          </div>

          {/* Turn Counter & Target Progress */}
          <div className="flex items-center space-x-6 text-xs font-mono">
            <div className="hidden sm:block">
              <span className="text-slate-400 block text-[10px]">SIMULATION PROGRESS</span>
              <div className="flex items-baseline space-x-1.5 font-bold text-white">
                <span className="text-emerald-400 text-sm">Turn {gameState.currentTurn}</span>
                <span className="text-slate-500">/ {gameState.maxTurns}</span>
                <span className="text-slate-400 text-[11px]">(Day {gameState.currentDay}/30)</span>
              </div>
              <div className="w-28 bg-slate-800 h-1 rounded-full mt-1 overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${(gameState.currentTurn / gameState.maxTurns) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px]">FINAL WEALTH FORECAST</span>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-base font-black text-white">${gameState.netWorth.toLocaleString()}</span>
                <span className="text-[10px] text-emerald-400 font-bold">
                  {gameState.netWorth >= TARGET_SCORE ? '✓ QUALIFIED' : 'CALIBRATING'}
                </span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px]">LIQUID CREDITS</span>
              <div className="text-base font-black text-amber-300">
                ${gameState.cash.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Simulation Control Bar */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleStep}
              disabled={isPlaying || gameState.status === 'COMPLETED'}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition disabled:opacity-40 cursor-pointer shadow-sm"
              title="Execute 1 Turn Step"
            >
              <span className="text-xs font-mono font-bold px-1">+1 Step</span>
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={gameState.status === 'COMPLETED'}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl font-mono text-xs font-bold transition shadow-md cursor-pointer ${
                isPlaying
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'Pause' : 'Auto Run'}</span>
            </button>

            {/* Speed Multiplier */}
            {isPlaying && (
              <button
                onClick={() => setPlaySpeed(playSpeed === 1 ? 5 : playSpeed === 5 ? 10 : 1)}
                className="px-2 py-2 rounded-xl bg-slate-900 border border-slate-700 text-cyan-400 font-mono text-xs font-bold"
              >
                {playSpeed}x
              </button>
            )}

            <button
              onClick={() => handleFastForward(24)}
              disabled={isPlaying || gameState.status === 'COMPLETED'}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition disabled:opacity-40 cursor-pointer"
              title="Fast-forward 1 Solar Day (24 Turns)"
            >
              <FastForward className="w-4 h-4" />
            </button>

            <button
              onClick={handleReset}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition cursor-pointer"
              title="Reset Simulation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Dev Modals & Copilot Triggers */}
            <div className="h-6 w-px bg-slate-800 mx-1"></div>

            <button
              onClick={() => setIsInspectorOpen(true)}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-700 transition cursor-pointer"
              title="Developer State Inspector"
            >
              <Cpu className="w-4 h-4" />
            </button>

            {/* Meteor Shower Cosmic Toggle */}
            <button
              onClick={toggleMeteorIntensity}
              className={`flex items-center space-x-1.5 px-2.5 py-2 rounded-xl border transition cursor-pointer shadow-sm font-mono text-xs ${
                meteorIntensity === 'storm'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-amber-500/20'
                  : meteorIntensity === 'active'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
              title={`Meteor Shower Mode: ${meteorIntensity.toUpperCase()} (Click to toggle / surge)`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="hidden lg:inline font-bold">
                {meteorIntensity === 'storm' ? '🌠 Storm' : meteorIntensity === 'active' ? '🌠 Meteors' : '✨ Calm'}
              </span>
            </button>

            <button
              onClick={() => setIsExporterOpen(true)}
              className="flex items-center space-x-1.5 px-2.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/40 transition cursor-pointer shadow-sm"
              title="Download Kaggle main.py and .ZIP Submission Archive"
            >
              <Download className="w-4 h-4" />
              <span className="hidden md:inline font-mono text-xs font-bold">main.py / .zip</span>
            </button>

            <button
              onClick={() => setIsCopilotOpen(true)}
              className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono text-xs font-bold transition shadow-md shadow-emerald-900/30 cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span className="hidden sm:inline">AI Copilot</span>
            </button>
          </div>

        </div>
      </header>

      {/* Navigation Tabs Bar */}
      <nav className="border-b border-slate-800/80 bg-slate-950/80 sticky top-[61px] z-30 px-4 lg:px-8 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center space-x-1 overflow-x-auto py-2.5 scrollbar-none">
          {viewTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl font-mono text-xs whitespace-nowrap transition cursor-pointer ${
                activeView === tab.id
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main View Area */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-6">
        {activeView === 'COMMAND_CENTER' && (
          <CommandCenterView
            state={gameState}
            onSelectTile={tile => setActiveView('FARM_GRID')}
            setActiveView={setActiveView}
            onStep={handleStep}
          />
        )}

        {activeView === 'FARM_GRID' && (
          <FarmMapView
            state={gameState}
            onSelectTile={() => {}}
            onPlantCrop={handlePlantCrop}
            onWaterTile={handleWaterTile}
            onHarvestTile={handleHarvestTile}
            onUnlockQuadrant={handleUnlockQuadrant}
          />
        )}

        {activeView === 'MARKET_TERMINAL' && (
          <MarketTerminalView
            state={gameState}
            onSellCommodity={handleSellCommodity}
          />
        )}

        {activeView === 'OPPONENT_INTEL' && (
          <OpponentIntelView state={gameState} />
        )}

        {activeView === 'ECONOMY_PORTFOLIO' && (
          <EconomyPortfolioView state={gameState} />
        )}

        {activeView === 'WORKERS_FLEET' && (
          <WorkerFleetView
            state={gameState}
            onHireWorker={handleHireWorker}
          />
        )}

        {activeView === 'GREENIE_LAB' && (
          <GreenieLabView />
        )}

        {activeView === 'REPLAY_EXPLAINER' && (
          <ReplayExplainerView state={gameState} />
        )}

        {activeView === 'GALACTIC_EXPANSION' && (
          <GalacticExpansionView />
        )}

        {activeView === 'SPEC_DOCS' && (
          <SpecDocsView />
        )}
      </main>

      {/* Global Modals & Drawers */}
      <GreenieCopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        state={gameState}
      />

      <KaggleExporterModal
        isOpen={isExporterOpen}
        onClose={() => setIsExporterOpen(false)}
      />

      <StateInspectorModal
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        state={gameState}
        onRunStep={handleStep}
      />

    </div>
  );
};
