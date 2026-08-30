// ============================================================================
// 🌌 GREENIEVERSE - SCARCITY ENGINE
// Quantifies market scarcity indices (0-100), price momentum, and future shortfalls
// ============================================================================

import { CommodityType, MarketProductInfo } from '../../../types/greenieverse';

export interface ScarcityReport {
  commodity: CommodityType;
  scarcityScore: number; // 0-100
  demandScore: number; // 0-100
  futureSupplyPressure: 'DEFICIT' | 'NORMAL' | 'SURPLUS';
  recommendedShift: 'INCREASE_PRODUCTION' | 'MAINTAIN' | 'REDUCE_PRODUCTION';
  reasoning: string;
}

export class ScarcityEngine {
  /**
   * Evaluates macro supply and demand across town metrics to find future scarcities.
   */
  public static calculateScarcity(
    market: Record<CommodityType, MarketProductInfo>,
    opponentSupplyForecast: Record<CommodityType, number>
  ): Record<CommodityType, ScarcityReport> {
    const report: Partial<Record<CommodityType, ScarcityReport>> = {};

    (Object.keys(market) as CommodityType[]).forEach(id => {
      const product = market[id];
      const oppSupply = opponentSupplyForecast[id] || 0;

      let scarcity = product.scarcityScore;
      // Adjust scarcity down if opponent has large supply in pipeline
      if (oppSupply >= 6) {
        scarcity = Math.max(10, scarcity - 30);
      } else if (oppSupply === 0 && product.demand === 'EXTREME') {
        scarcity = Math.min(100, scarcity + 15);
      }

      let demandScore = 50;
      if (product.demand === 'EXTREME') demandScore = 95;
      else if (product.demand === 'HIGH') demandScore = 78;
      else if (product.demand === 'MODERATE') demandScore = 52;
      else demandScore = 25;

      let futureSupplyPressure: 'DEFICIT' | 'NORMAL' | 'SURPLUS' = 'NORMAL';
      if (scarcity >= 70) futureSupplyPressure = 'DEFICIT';
      else if (scarcity <= 35 || oppSupply >= 5) futureSupplyPressure = 'SURPLUS';

      let recommendedShift: 'INCREASE_PRODUCTION' | 'MAINTAIN' | 'REDUCE_PRODUCTION' = 'MAINTAIN';
      let reasoning = '';

      if (futureSupplyPressure === 'DEFICIT') {
        recommendedShift = 'INCREASE_PRODUCTION';
        reasoning = `Severe supply deficit expected. Competitor pipeline empty. Strong pricing power available.`;
      } else if (futureSupplyPressure === 'SURPLUS') {
        recommendedShift = 'REDUCE_PRODUCTION';
        reasoning = `Upcoming market oversupply. Divert land and worker capacity to higher-margin commodities.`;
      } else {
        recommendedShift = 'MAINTAIN';
        reasoning = `Market equilibrium. Maintain balanced production schedules.`;
      }

      report[id] = {
        commodity: id,
        scarcityScore: scarcity,
        demandScore,
        futureSupplyPressure,
        recommendedShift,
        reasoning,
      };
    });

    return report as Record<CommodityType, ScarcityReport>;
  }
}
