// ============================================================================
// 🌌 GREENIEVERSE - PRODUCTION OPTIMIZER
// Dynamically calculates the optimal multi-crop production allocation %
// ============================================================================

import { CropType, SeasonPhase } from '../../../types/greenieverse';

export interface ProductionAllocation {
  crop: CropType;
  label: string;
  percentage: number;
  tilesTarget: number;
  reason: string;
  color: string;
}

export class ProductionOptimizer {
  /**
   * Calculates the dynamic production allocation mix based on current season phase,
   * available cash reserves, remaining turns, and scarcity trends.
   */
  public static calculateDynamicAllocation(
    totalUnlockedTiles: number,
    currentCash: number,
    remainingTurns: number,
    phase: SeasonPhase,
    scarcityScores: Record<string, number>
  ): ProductionAllocation[] {
    let wheatPct = 20;
    let carrotPct = 15;
    let tomatoPct = 10;
    let strawberryPct = 25;
    let melonPct = 20;

    // Adjust based on Season Phase & Remaining Turns
    if (phase === 'PHASE 1 — BOOTSTRAP' || remainingTurns > 600) {
      // Early game: prioritize fast cash flow
      wheatPct = 40;
      carrotPct = 30;
      tomatoPct = 15;
      strawberryPct = 10;
      melonPct = 5;
    } else if (phase === 'PHASE 2 — SCALE' || (remainingTurns > 350 && remainingTurns <= 600)) {
      // Mid game: scale into high-value high-margin crops
      wheatPct = 15;
      carrotPct = 15;
      tomatoPct = 15;
      strawberryPct = 30;
      melonPct = 25;
    } else if (phase === 'PHASE 3 — ARBITRAGE' || (remainingTurns > 120 && remainingTurns <= 350)) {
      // Late mid game: exploit peak scarcity
      wheatPct = 10;
      carrotPct = 10;
      tomatoPct = 10;
      strawberryPct = 35;
      melonPct = 35;
    } else {
      // Phase 4: Liquidation / Endgame (Turn < 120)
      // Only short-cycle crops can mature before Turn 720
      if (remainingTurns < 48) {
        wheatPct = 0;
        carrotPct = 0;
        tomatoPct = 0;
        strawberryPct = 0;
        melonPct = 0; // 100% Cash / Liquidation
      } else if (remainingTurns < 72) {
        wheatPct = 100;
        carrotPct = 0;
        tomatoPct = 0;
        strawberryPct = 0;
        melonPct = 0;
      } else if (remainingTurns < 120) {
        wheatPct = 50;
        carrotPct = 50;
        tomatoPct = 0;
        strawberryPct = 0;
        melonPct = 0;
      }
    }

    // Dynamic adjustment for high scarcity items
    if (scarcityScores['STRAWBERRY'] && scarcityScores['STRAWBERRY'] > 80 && remainingTurns >= 168) {
      strawberryPct = Math.min(50, strawberryPct + 10);
      wheatPct = Math.max(5, wheatPct - 10);
    }
    if (scarcityScores['TOMATO'] && scarcityScores['TOMATO'] < 30) {
      // Low scarcity / oversupply: drop tomato
      const freed = tomatoPct;
      tomatoPct = 0;
      melonPct += freed;
    }

    const totalPct = wheatPct + carrotPct + tomatoPct + strawberryPct + melonPct || 100;

    const allocations: ProductionAllocation[] = [
      {
        crop: 'WHEAT',
        label: 'Galactic Wheat (Fast Turnover)',
        percentage: Math.round((wheatPct / totalPct) * 100),
        tilesTarget: Math.round(((wheatPct / totalPct) * totalUnlockedTiles)),
        reason: 'Maintains steady liquidity and low seed capital lockup.',
        color: '#EAB308', // Amber-500
      },
      {
        crop: 'CARROT',
        label: 'Cosmic Carrot (Reliable Margin)',
        percentage: Math.round((carrotPct / totalPct) * 100),
        tilesTarget: Math.round(((carrotPct / totalPct) * totalUnlockedTiles)),
        reason: 'Moderate 3-day turnaround with reliable profit velocity.',
        color: '#F97316', // Orange-500
      },
      {
        crop: 'TOMATO',
        label: 'Solar Flare Tomato (Selective)',
        percentage: Math.round((tomatoPct / totalPct) * 100),
        tilesTarget: Math.round(((tomatoPct / totalPct) * totalUnlockedTiles)),
        reason: 'Limited planting to avoid anticipated opponent oversupply wave.',
        color: '#EF4444', // Red-500
      },
      {
        crop: 'STRAWBERRY',
        label: 'Nebula Strawberry (Scarcity Arbitrage)',
        percentage: Math.round((strawberryPct / totalPct) * 100),
        tilesTarget: Math.round(((strawberryPct / totalPct) * totalUnlockedTiles)),
        reason: 'Scarcity score 84/100; peak pricing power in town market.',
        color: '#EC4899', // Pink-500
      },
      {
        crop: 'MELON',
        label: 'Supernova Melon (Maximum Wealth)',
        percentage: Math.round((melonPct / totalPct) * 100),
        tilesTarget: Math.round(((melonPct / totalPct) * totalUnlockedTiles)),
        reason: 'Highest absolute profit per tile ($1,320 net profit).',
        color: '#10B981', // Emerald-500
      },
    ];

    return allocations;
  }
}
