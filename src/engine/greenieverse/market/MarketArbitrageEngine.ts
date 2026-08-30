// ============================================================================
// 🌌 GREENIEVERSE - MARKET ARBITRAGE ENGINE
// Calculates price velocity, acceleration, town demand, and arbitrage signals
// ============================================================================

import { CommodityType, MarketProductInfo, MarketSignal } from '../../../types/greenieverse';

export interface ArbitrageAnalysis {
  commodity: CommodityType;
  signal: MarketSignal;
  confidence: number;
  expectedPriceShift: number;
  reasoning: string;
  velocity: number;
  acceleration: number;
}

export class MarketArbitrageEngine {
  /**
   * Evaluates real-time price trend, opponent inventory, and town demand
   * to produce actionable BUY/SELL/HOLD/PRODUCE/AVOID directives.
   */
  public static evaluateCommodity(
    product: MarketProductInfo,
    opponentSupply: number,
    ourInventory: number,
    remainingTurns: number
  ): ArbitrageAnalysis {
    const { currentPrice, basePrice, priceVelocity, priceAcceleration, scarcityScore, demand } = product;

    const priceDeltaPercent = ((currentPrice - basePrice) / basePrice) * 100;
    let signal: MarketSignal = 'HOLD';
    let confidence = 75;
    let reasoning = '';
    let expectedPriceShift = product.forecast24Turn - currentPrice;

    // 1. Critical Endgame Liquidation Check
    if (remainingTurns <= 48 && ourInventory > 0) {
      return {
        commodity: product.id,
        signal: 'SELL',
        confidence: 98,
        expectedPriceShift,
        reasoning: `Endgame liquidation: Sell stored inventory before season concludes at Turn 720 to lock in final wealth.`,
        velocity: priceVelocity,
        acceleration: priceAcceleration,
      };
    }

    // 2. High Oversupply / Opponent Harvest Wave Alert
    if (opponentSupply >= 6 && (product.id === 'TOMATO' || product.id === 'MELON')) {
      signal = ourInventory > 0 ? 'SELL' : 'AVOID';
      confidence = 91;
      reasoning = `Competitor harvest wave imminent (+${opponentSupply} units in 24 turns). Market supply will surge, triggering price collapse. ${
        ourInventory > 0 ? 'Liquidate current stocks immediately.' : 'Cease new plantings and redirect labor.'
      }`;
    }
    // 3. Extreme Scarcity Opportunity (Produce or Sell at Peak)
    else if (scarcityScore >= 75 || demand === 'EXTREME') {
      if (ourInventory >= 2 && currentPrice > basePrice * 1.25) {
        signal = 'SELL';
        confidence = 88;
        reasoning = `Peak price anomaly ($${currentPrice} vs base $${basePrice}). Scarcity index at ${scarcityScore}/100. Sell high into peak demand.`;
      } else {
        signal = 'PRODUCE';
        confidence = 94;
        reasoning = `Severe structural shortage detected (${scarcityScore}/100 scarcity). Forecast predicts +$${expectedPriceShift.toFixed(0)} upward surge. Allocate tiles.`;
      }
    }
    // 4. Low Valuation Dip (Buy low or Hold inventory)
    else if (priceDeltaPercent <= -20) {
      if (product.category === 'CROP' && priceVelocity > 0) {
        signal = 'PRODUCE';
        confidence = 82;
        reasoning = `Bottom reached with positive price momentum (${priceVelocity.toFixed(2)}/turn). Great entry point for next harvest cycle.`;
      } else {
        signal = 'HOLD';
        confidence = 79;
        reasoning = `Market depressed at $${currentPrice} (-${Math.abs(priceDeltaPercent).toFixed(1)}% vs base). Retain inventory until demand recovers.`;
      }
    }
    // 5. Default Steady State Strategy
    else {
      if (priceVelocity > 0.5 && expectedPriceShift > 0) {
        signal = 'PRODUCE';
        confidence = 80;
        reasoning = `Positive price acceleration (+${priceVelocity.toFixed(2)}/turn) with stable town consumption.`;
      } else if (ourInventory > 5) {
        signal = 'SELL';
        confidence = 76;
        reasoning = `Excess warehouse inventory (${ourInventory} units). Liquidate surplus to finance land/worker expansion.`;
      } else {
        signal = 'HOLD';
        confidence = 70;
        reasoning = `Market balanced. Maintain baseline production quotas.`;
      }
    }

    return {
      commodity: product.id,
      signal,
      confidence,
      expectedPriceShift,
      reasoning,
      velocity: priceVelocity,
      acceleration: priceAcceleration,
    };
  }

  /**
   * Generates initial market state with historical simulated price candles
   */
  public static createInitialMarket(): Record<CommodityType, MarketProductInfo> {
    const baseItems: Array<{
      id: CommodityType;
      name: string;
      icon: string;
      category: 'CROP' | 'LIVESTOCK';
      basePrice: number;
      currentPrice: number;
      forecast24Turn: number;
      scarcityScore: number;
      demand: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';
      supply: 'VERY LOW' | 'LOW' | 'BALANCED' | 'HIGH' | 'OVERSUPPLY';
    }> = [
      { id: 'WHEAT', name: 'Galactic Wheat', icon: '🌾', category: 'CROP', basePrice: 20, currentPrice: 22, forecast24Turn: 24, scarcityScore: 42, demand: 'HIGH', supply: 'BALANCED' },
      { id: 'CARROT', name: 'Cosmic Carrot', icon: '🥕', category: 'CROP', basePrice: 32, currentPrice: 35, forecast24Turn: 38, scarcityScore: 56, demand: 'HIGH', supply: 'LOW' },
      { id: 'TOMATO', name: 'Solar Flare Tomato', icon: '🍅', category: 'CROP', basePrice: 60, currentPrice: 64, forecast24Turn: 51, scarcityScore: 28, demand: 'MODERATE', supply: 'HIGH' },
      { id: 'STRAWBERRY', name: 'Nebula Strawberry', icon: '🍓', category: 'CROP', basePrice: 110, currentPrice: 128, forecast24Turn: 146, scarcityScore: 84, demand: 'EXTREME', supply: 'VERY LOW' },
      { id: 'MELON', name: 'Supernova Melon', icon: '🍈', category: 'CROP', basePrice: 190, currentPrice: 215, forecast24Turn: 240, scarcityScore: 78, demand: 'HIGH', supply: 'LOW' },
      { id: 'EGG', name: 'Graviton Eggs', icon: '🥚', category: 'LIVESTOCK', basePrice: 26, currentPrice: 28, forecast24Turn: 30, scarcityScore: 50, demand: 'MODERATE', supply: 'BALANCED' },
      { id: 'MILK', name: 'Stellar Milk', icon: '🥛', category: 'LIVESTOCK', basePrice: 75, currentPrice: 88, forecast24Turn: 98, scarcityScore: 88, demand: 'EXTREME', supply: 'VERY LOW' },
      { id: 'WOOL', name: 'Quantum Wool', icon: '🧶', category: 'LIVESTOCK', basePrice: 220, currentPrice: 245, forecast24Turn: 270, scarcityScore: 82, demand: 'HIGH', supply: 'LOW' },
    ];

    const result: Partial<Record<CommodityType, MarketProductInfo>> = {};

    baseItems.forEach(item => {
      const history = [];
      let p = item.basePrice;
      for (let t = 0; t < 24; t += 2) {
        const jitter = (Math.sin(t / 3) * 0.1 + (item.scarcityScore > 70 ? 0.05 : -0.02)) * item.basePrice;
        p = Math.max(10, Math.round(item.basePrice + jitter));
        history.push({
          turn: t,
          actual: p,
          predicted: Math.round(p * 1.05),
          opponentSupply: item.id === 'TOMATO' ? 4 : 1,
          ourSupply: item.id === 'WHEAT' ? 6 : 2,
        });
      }

      const diff = item.currentPrice - item.basePrice;
      const changePct = Number(((diff / item.basePrice) * 100).toFixed(1));

      result[item.id] = {
        id: item.id,
        name: item.name,
        icon: item.icon,
        category: item.category,
        currentPrice: item.currentPrice,
        basePrice: item.basePrice,
        previousPrice: item.basePrice,
        priceChangePercent: changePct,
        forecast24Turn: item.forecast24Turn,
        marketSupply: item.supply,
        demand: item.demand,
        scarcityScore: item.scarcityScore,
        priceVelocity: Number(((item.forecast24Turn - item.currentPrice) / 24).toFixed(2)),
        priceAcceleration: 0.04,
        trend: item.forecast24Turn > item.currentPrice ? 'UP' : 'DOWN',
        aiRecommendation: item.id === 'STRAWBERRY' || item.id === 'MILK' ? 'PRODUCE' : item.id === 'TOMATO' ? 'AVOID' : 'HOLD',
        aiReasoning: item.id === 'TOMATO' 
          ? 'Opponent tomato harvest incoming; market oversupply predicted.'
          : item.id === 'STRAWBERRY'
          ? 'High scarcity score (84/100) and surging town luxury demand.'
          : 'Stable baseline commodity trading within standard variance.',
        historicalPrices: history,
      };
    });

    return result as Record<CommodityType, MarketProductInfo>;
  }
}
