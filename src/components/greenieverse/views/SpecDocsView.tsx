// ============================================================================
// 🌌 GREENIEVERSE - SPECIFICATIONS & STRATEGY DOCUMENTATION VIEW
// In-app technical documentation, architecture blueprints, and Kaggle rules
// ============================================================================

import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';

export const SpecDocsView: React.FC = () => {
  const [docTab, setDocTab] = useState<'README' | 'ARCHITECTURE' | 'STRATEGY' | 'GREENIECULTURE'>('README');

  const docs = {
    README: `# 🌌 GreenieVerse: Galactic Farming Intelligence & Autonomous Agriculture Agent

GreenieVerse is an autonomous agricultural intelligence platform designed to maximize Final Wealth in the **GreenieCulture Galactic Agriculture Championship**.

### Core Features:
- **10x10 Galactic Farm Grid**: 100 tiles divided into 4 quadrants (NW, NE, SW, SE) with soil health indices and automated irrigation.
- **Market Arbitrage Engine**: Explores supply-lag differentials, price velocity, and luxury premiums across 8 galactic commodities.
- **Opponent Intelligence & Radar**: Real-time competitor pipeline classification, 24-turn harvest wave warning, and supply flood avoidance.
- **Agricultural Economics Engine**: Computes Expected Final Wealth (EFW) per crop and marginal value of additional worker agents.
- **Multi-Agent Worker Fleet**: Manhattan distance pathfinding and dynamic task value prioritization.
- **Endgame Optimizer**: 4-phase seasonal discipline ensuring 100% liquidation prior to Turn 720.
- **Evolutionary Strategy Optimizer**: 50+ generation parameter tuning for risk tolerance and endgame cutoffs.
`,
    ARCHITECTURE: `# 🏗️ GreenieVerse System Architecture

The GreenieVerse system is decoupled into high-performance, stateless TypeScript decision engines and deterministic state transformers.

\`\`\`
                                ┌─────────────────────────┐
                                │   Environment (obs)     │
                                └────────────┬────────────┘
                                             │
                                             ▼
                      ┌──────────────────────────────────────────────┐
                      │          ActionPlanner (Master VM)           │
                      └──────┬───────────────┬────────────────┬──────┘
                             │               │                │
            ┌────────────────┴─────┐  ┌──────┴─────────┐  ┌───┴────────────────┐
            │ MarketArbitrageEngine│  │OpponentIntel   │  │Economics / EFW     │
            └──────────────────────┘  └────────────────┘  └────────────────────┘
                             │               │                │
                             ▼               ▼                ▼
                      ┌──────────────────────────────────────────────┐
                      │    WorkerManager & Endgame Liquidation       │
                      └──────────────────────┬───────────────────────┘
                                             │
                                             ▼
                                ┌─────────────────────────┐
                                │ Selected Action & Telemetry
                                └─────────────────────────┘
\`\`\`
`,
    STRATEGY: `# 📈 Multi-Phase Championship Agricultural Strategy

### Phase 1: Bootstrap (Turns 1 - 168 / Days 1 - 7)
- Prioritize high-velocity cash compounding via Galactic Wheat and Cosmic Carrots.
- Maintain liquid buffer to avoid bankruptcy or delayed retooling.
- Unlock high-yield Northeast Solar Quadrant as soon as capital permits.

### Phase 2: Scale & Diversification (Turns 169 - 432 / Days 8 - 18)
- Scale into high-margin Nebula Strawberries and Supernova Melons.
- Hire Worker #2 once unlocked acreage reaches 40+ tiles.
- Establish livestock bio-pens (Goose & Sheep) for steady recurring yields.

### Phase 3: Market Arbitrage & Counter-Play (Turns 433 - 624 / Days 19 - 26)
- Monitor Opponent harvest pipeline for impending tomato supply gluts.
- Liquidate stored commodities during town luxury demand surges (+30% price premium).

### Phase 4: Endgame Liquidation (Turns 625 - 720 / Days 27 - 30)
- Cease all long-growth seed plantings (Melons/Strawberries) that cannot mature before Turn 720.
- Liquidate 100% of stored warehouse inventory to maximize Final Cash.
- Exploit ultra-fast 48-turn Wheat cycles only if remaining turns allow full payback.
`,
    GREENIECULTURE: `# 🏆 Official GreenieCulture Championship Specification

- **Total Horizon**: 720 discrete simulation turns (30 planetary solar days, 24 turns/day).
- **Initial Capital**: 250 Sol Credits.
- **Initial Land**: 25 unlocked tiles (Northwest Quadrant).
- **Target Goal**: Maximize Final Wealth (Cash + Realized Asset Value).
- **Rules Compliance**:
  - Deterministic evaluation (zero random seed dependence during action dispatch).
  - O(1) turn execution (<50ms per step).
  - Zero external network dependencies.
  - Full compatibility with the standard \`def agent(obs):\` execution entry point.
`,
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-950 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white font-mono">GreenieVerse Specifications</h3>
            <p className="text-xs text-slate-400">Technical architecture, strategy manuals, and GreenieCulture rules</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-mono">
        {(['README', 'ARCHITECTURE', 'STRATEGY', 'GREENIECULTURE'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setDocTab(tab)}
            className={`px-4 py-2 rounded-xl transition ${
              docTab === tab
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Doc Viewer */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl">
        <pre className="whitespace-pre-wrap font-sans text-xs text-slate-300 leading-relaxed overflow-x-auto">
          {docs[docTab]}
        </pre>
      </div>

    </div>
  );
};
