// ============================================================================
// 🌌 GREENIEVERSE - LIVESTOCK ECONOMICS
// Compares Livestock investments vs Crops for capital efficiency and payback
// ============================================================================

import { AnimalType, LivestockSpec } from '../../../types/greenieverse';
import { LIVESTOCK_SPECS } from '../constants';

export interface LivestockComparison {
  animal: AnimalType;
  spec: LivestockSpec;
  netProfitRemainingSeason: number;
  cropAlternativeROI: number;
  verdict: 'RECOMMENDED' | 'FEASIBLE' | 'REJECT';
  reason: string;
}

export class LivestockEconomics {
  /**
   * Compares animal purchase vs allocating the same capital to high-value crops
   */
  public static compareAgainstCrops(
    animalType: AnimalType,
    remainingTurns: number,
    currentDay: number
  ): LivestockComparison {
    const spec = LIVESTOCK_SPECS[animalType];
    const daysLeft = Math.max(0, 30 - currentDay);

    const totalFeedCost = spec.feedCostPerDay * daysLeft;
    const productionCycles = Math.floor(daysLeft / spec.productionIntervalDays);
    const totalGrossRevenue = productionCycles * spec.unitSalePrice;
    const netProfit = totalGrossRevenue - (spec.purchaseCost + totalFeedCost);

    // Equivalent crop investment (e.g. Melons or Strawberries)
    const melonCycles = Math.floor(daysLeft / 12);
    const cropAlternativeROI = melonCycles * 1320 * (spec.purchaseCost / 180);

    let verdict: 'RECOMMENDED' | 'FEASIBLE' | 'REJECT' = 'FEASIBLE';
    let reason = '';

    if (daysLeft < Math.ceil(spec.paybackTurns / 24)) {
      verdict = 'REJECT';
      reason = `Season too short (${daysLeft} days left). Payback requires at least ${Math.ceil(spec.paybackTurns / 24)} days. Stranded capital loss.`;
    } else if (netProfit > cropAlternativeROI * 0.7) {
      verdict = 'RECOMMENDED';
      reason = `Consistent daily cash generation (${spec.profitPerDay}/day). High resilience against crop market fluctuations.`;
    } else {
      verdict = 'FEASIBLE';
      reason = `Positive expected return (+${netProfit.toFixed(0)} credits), but high-margin crops offer higher terminal ceiling if water is abundant.`;
    }

    return {
      animal: animalType,
      spec,
      netProfitRemainingSeason: netProfit,
      cropAlternativeROI: Math.round(cropAlternativeROI),
      verdict,
      reason,
    };
  }
}
