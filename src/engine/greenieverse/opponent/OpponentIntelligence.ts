// ============================================================================
// 🌌 GREENIEVERSE - OPPONENT INTELLIGENCE & STRATEGY CLASSIFIER
// Analyzes competitor behavior, classifies strategy, and forecasts harvest waves
// ============================================================================

import { 
  CommodityType, 
  CropType, 
  AnimalType, 
  OpponentState, 
  OpponentStrategyType 
} from '../../../types/greenieverse';

export class OpponentIntelligence {
  /**
   * Evaluates opponent tile state, crop maturity, animal assets, and spending
   * to classify their strategy and produce a 24-turn supply forecast.
   */
  public static analyzeOpponent(
    crops: Record<CropType, number>,
    animals: Record<AnimalType, number>,
    cash: number,
    unlockedTiles: number,
    workers: number
  ): {
    strategyClass: OpponentStrategyType;
    confidence: number;
    forecast: Array<{ commodity: CommodityType; count: number; marketImpact: string }>;
    summary: string;
  } {
    const totalCrops = Object.values(crops).reduce((a, b) => a + b, 0);
    const highValueCrops = (crops.TOMATO || 0) + (crops.STRAWBERRY || 0) + (crops.MELON || 0);
    const wheatCrops = crops.WHEAT || 0;
    const totalAnimals = Object.values(animals).reduce((a, b) => a + b, 0);

    let strategyClass: OpponentStrategyType = 'BALANCED FARMER';
    let confidence = 82;
    let summary = '';

    if (totalAnimals >= 3 && totalAnimals > totalCrops * 0.4) {
      strategyClass = 'LIVESTOCK FARMER';
      confidence = 89;
      summary = 'Opponent prioritizes animal husbandry (cows & sheep), generating steady daily cashflow and milk/wool surpluses.';
    } else if (highValueCrops > totalCrops * 0.6 && highValueCrops >= 4) {
      strategyClass = 'AGGRESSIVE HIGH-VALUE FARMER';
      confidence = 91;
      summary = 'Opponent heavily leverages high-margin long-cycle crops (Tomatoes & Melons), vulnerable to supply-shock price erosion.';
    } else if (wheatCrops > totalCrops * 0.6) {
      strategyClass = 'WHEAT FARMER';
      confidence = 94;
      summary = 'Opponent relies on ultra-short-cycle Wheat farming. Low risk, but low ceiling potential.';
    } else if (unlockedTiles >= 50) {
      strategyClass = 'EXPANSION FARMER';
      confidence = 86;
      summary = 'Opponent is spending aggressively on land acquisition to maximize total grid throughput.';
    } else if (cash > 2500 && workers < 2) {
      strategyClass = 'CASH FARMER';
      confidence = 79;
      summary = 'Opponent is hoarding cash reserves with minimal capital reinvestment into workers or land.';
    } else {
      strategyClass = 'BALANCED FARMER';
      confidence = 77;
      summary = 'Opponent maintains a diversified mix of staple grains, vegetables, and small livestock pens.';
    }

    // Supply forecast for next 24 turns
    const forecast: Array<{ commodity: CommodityType; count: number; marketImpact: string }> = [
      {
        commodity: 'TOMATO',
        count: Math.max(2, (crops.TOMATO || 0) * 2),
        marketImpact: 'HIGH TOMATO SUPPLY → Predicted price collapse -18%',
      },
      {
        commodity: 'MELON',
        count: Math.max(1, (crops.MELON || 0)),
        marketImpact: 'MODERATE SUPPLY → Local market absorption expected',
      },
      {
        commodity: 'MILK',
        count: (animals.COW || 0) * 2,
        marketImpact: animals.COW ? 'STEADY SUPPLY → Stable pricing' : 'LOW SUPPLY → Scarcity premium',
      },
      {
        commodity: 'WHEAT',
        count: (crops.WHEAT || 0) * 3,
        marketImpact: 'REGULAR GRAIN FLOW → Low price sensitivity',
      },
    ];

    return {
      strategyClass,
      confidence,
      forecast,
      summary,
    };
  }

  public static createInitialOpponent(): OpponentState {
    const crops: Record<CropType, number> = {
      WHEAT: 4,
      CARROT: 2,
      TOMATO: 6,
      STRAWBERRY: 1,
      MELON: 2,
    };

    const animals: Record<AnimalType, number> = {
      GOOSE: 1,
      COW: 1,
      SHEEP: 0,
    };

    const analysis = OpponentIntelligence.analyzeOpponent(crops, animals, 480, 25, 1);

    return {
      name: 'TitanAgri-7 (Baseline Kaggle Bot)',
      cash: 520,
      estimatedNetWorth: 2480,
      unlockedTiles: 25,
      cropsCount: crops,
      animalCount: animals,
      workerCount: 1,
      strategyClass: analysis.strategyClass,
      strategyConfidence: analysis.confidence,
      marketActivitySummary: analysis.summary,
      next24TurnsSupplyForecast: analysis.forecast,
      recentHarvests: [
        { turn: 18, item: 'TOMATO', quantity: 6 },
        { turn: 22, item: 'WHEAT', quantity: 8 },
        { turn: 24, item: 'MILK', quantity: 2 },
      ],
    };
  }
}
