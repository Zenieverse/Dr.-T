// ============================================================================
// 🌌 GREENIEVERSE - AGRICULTURAL ECONOMICS ENGINE
// Evaluates true Expected Final Wealth (EFW) rather than naive immediate ROI
// ============================================================================

import { CropType, AgriculturalCropSpec, MarketProductInfo } from '../../../types/greenieverse';
import { CROP_SPECS } from '../constants';

export interface EconomicEvaluation {
  crop: CropType;
  seedCost: number;
  expectedRevenue: number;
  expectedNetProfit: number;
  profitPerTurn: number;
  profitPerTile: number;
  profitPerWorker: number;
  marketRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  expectedFinalWealthContribution: number;
  paybackTurns: number;
  recommendationRank: number;
  rationale: string;
}

export class AgriculturalEconomicsEngine {
  /**
   * Calculates Expected Final Wealth contribution across all crop varieties,
   * factoring in seed investment, labor requirements, growth timeline, and remaining turns.
   */
  public static evaluateAllCrops(
    market: Record<string, MarketProductInfo>,
    remainingTurns: number,
    unlockedTiles: number
  ): Record<CropType, EconomicEvaluation> {
    const evaluations: Partial<Record<CropType, EconomicEvaluation>> = {};

    (Object.keys(CROP_SPECS) as CropType[]).forEach(type => {
      const spec: AgriculturalCropSpec = CROP_SPECS[type];
      const marketInfo = market[type];
      const price = marketInfo ? marketInfo.currentPrice : spec.expectedRevenue / spec.yieldPerTile;

      const revenue = price * spec.yieldPerTile;
      const profit = revenue - spec.seedCost;
      const profitPerTurn = profit / spec.growthTurns;
      const profitPerTile = profit;
      const profitPerWorker = profit / spec.laborUnits;

      // Can this crop complete before turn 720?
      const canMature = remainingTurns >= spec.growthTurns;
      const cyclesPossible = Math.floor(remainingTurns / spec.growthTurns);

      let finalWealthContribution = canMature ? profit * Math.max(1, cyclesPossible) : -spec.seedCost;
      let rationale = '';

      if (!canMature) {
        finalWealthContribution = -spec.seedCost; // Stranded capital loss
        rationale = `CRITICAL: Crop requires ${spec.growthTurns} turns to mature, but only ${remainingTurns} remain. DO NOT PLANT.`;
      } else if (cyclesPossible >= 3) {
        rationale = `High velocity compounding: ${cyclesPossible} full harvest cycles achievable before season conclusion.`;
      } else if (spec.type === 'MELON' || spec.type === 'STRAWBERRY') {
        rationale = `Maximum capital extraction per tile ($${profit.toFixed(0)} net). Optimal for late-mid season wealth surges.`;
      } else {
        rationale = `Stable baseline turnaround with low upfront seed expenditure ($${spec.seedCost}).`;
      }

      evaluations[type] = {
        crop: type,
        seedCost: spec.seedCost,
        expectedRevenue: revenue,
        expectedNetProfit: profit,
        profitPerTurn: Number(profitPerTurn.toFixed(2)),
        profitPerTile: profitPerTile,
        profitPerWorker: Number(profitPerWorker.toFixed(1)),
        marketRisk: spec.marketRisk,
        expectedFinalWealthContribution: Math.round(finalWealthContribution),
        paybackTurns: spec.growthTurns,
        recommendationRank: 1,
        rationale,
      };
    });

    // Rank crops by expectedFinalWealthContribution descending
    const sorted = (Object.values(evaluations) as EconomicEvaluation[]).sort(
      (a, b) => b.expectedFinalWealthContribution - a.expectedFinalWealthContribution
    );

    sorted.forEach((item, index) => {
      evaluations[item.crop]!.recommendationRank = index + 1;
    });

    return evaluations as Record<CropType, EconomicEvaluation>;
  }
}
