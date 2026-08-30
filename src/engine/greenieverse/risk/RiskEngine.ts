// ============================================================================
// 🌌 GREENIEVERSE - RISK ENGINE & ECONOMIC PORTFOLIO
// Quantifies farm portfolio diversification, liquidity, and exposure
// ============================================================================

import { 
  GameState, 
  RiskMetrics, 
  PortfolioAssetAllocation, 
  CommodityType 
} from '../../../types/greenieverse';

export class RiskEngine {
  /**
   * Computes comprehensive risk breakdown and portfolio asset distribution
   */
  public static evaluateRiskAndPortfolio(state: GameState): {
    risk: RiskMetrics;
    portfolio: PortfolioAssetAllocation[];
  } {
    const remainingTurns = state.maxTurns - state.currentTurn;

    // 1. Calculate Asset Values
    const cashValue = state.cash;

    let activeCropsValue = 0;
    for (let y = 0; y < state.grid.length; y++) {
      for (let x = 0; x < state.grid[y].length; x++) {
        const tile = state.grid[y][x];
        if (tile.status === 'PLANTED' || tile.status === 'MATURE') {
          activeCropsValue += 65;
        }
      }
    }

    let animalValue = 0;
    for (let y = 0; y < state.grid.length; y++) {
      for (let x = 0; x < state.grid[y].length; x++) {
        if (state.grid[y][x].status === 'ANIMAL_PEN') {
          animalValue += 550;
        }
      }
    }

    let landEquity = 0;
    Object.values(state.quadrants).forEach(q => {
      if (q.isUnlocked) landEquity += 500;
    });

    let inventoryValue = 0;
    (Object.keys(state.inventory) as CommodityType[]).forEach(item => {
      const count = state.inventory[item] || 0;
      const price = state.market[item]?.currentPrice || 30;
      inventoryValue += count * price;
    });

    const workerFleetValue = state.workers.length * 850;

    const totalNetWorth = cashValue + activeCropsValue + animalValue + landEquity + inventoryValue + workerFleetValue;

    // 2. Risk Metrics Analysis
    const liquidityRatio = cashValue / Math.max(1, totalNetWorth);

    const liquidityRisk: 'LOW' | 'MEDIUM' | 'HIGH' = liquidityRatio > 0.25 ? 'LOW' : liquidityRatio > 0.1 ? 'MEDIUM' : 'HIGH';
    const endgameRisk: 'LOW' | 'MEDIUM' | 'HIGH' = remainingTurns > 120 ? 'LOW' : remainingTurns > 48 ? 'MEDIUM' : 'HIGH';
    const opponentRisk: 'LOW' | 'MEDIUM' | 'HIGH' = state.opponent.estimatedNetWorth > totalNetWorth * 1.15 ? 'HIGH' : 'LOW';
    const marketRisk: 'LOW' | 'MEDIUM' | 'HIGH' = state.market.TOMATO?.marketSupply === 'OVERSUPPLY' ? 'HIGH' : 'LOW';
    const cropRisk: 'LOW' | 'MEDIUM' | 'HIGH' = activeCropsValue > totalNetWorth * 0.5 ? 'HIGH' : 'LOW';
    const investmentRisk: 'LOW' | 'MEDIUM' | 'HIGH' = (animalValue + workerFleetValue) > totalNetWorth * 0.6 ? 'HIGH' : 'LOW';

    let score = 20;
    if (liquidityRisk === 'HIGH') score += 25;
    if (endgameRisk === 'HIGH') score += 20;
    if (opponentRisk === 'HIGH') score += 15;
    if (marketRisk === 'HIGH') score += 10;

    let summary = 'Healthy agricultural portfolio with strong liquidity reserves and high market resilience.';
    if (score > 60) {
      summary = 'Elevated operational risk detected: high exposure to long-cycle capital lockup as Turn 720 approaches.';
    }

    const risk: RiskMetrics = {
      marketRisk,
      cropRisk,
      opponentRisk,
      liquidityRisk,
      investmentRisk,
      endgameRisk,
      overallScore: Math.min(100, score),
      summary,
    };

    // 3. Portfolio Asset Breakdown
    const portfolio: PortfolioAssetAllocation[] = [
      {
        category: 'CASH',
        label: 'Liquid Sol Credits',
        value: cashValue,
        percentage: Math.round((cashValue / Math.max(1, totalNetWorth)) * 100),
        color: '#10B981', // Emerald
      },
      {
        category: 'ACTIVE_CROPS',
        label: 'Growing Crop Field Assets',
        value: activeCropsValue,
        percentage: Math.round((activeCropsValue / Math.max(1, totalNetWorth)) * 100),
        color: '#F59E0B', // Amber
      },
      {
        category: 'LAND_EQUITY',
        label: 'Planetary Quadrant Land',
        value: landEquity,
        percentage: Math.round((landEquity / Math.max(1, totalNetWorth)) * 100),
        color: '#6366F1', // Indigo
      },
      {
        category: 'WORKER_FLEET',
        label: 'Automated Worker Fleet',
        value: workerFleetValue,
        percentage: Math.round((workerFleetValue / Math.max(1, totalNetWorth)) * 100),
        color: '#06B6D4', // Cyan
      },
      {
        category: 'INVENTORY',
        label: 'Warehouse Commodity Stockpile',
        value: inventoryValue,
        percentage: Math.round((inventoryValue / Math.max(1, totalNetWorth)) * 100),
        color: '#EC4899', // Pink
      },
      {
        category: 'ANIMALS',
        label: 'Livestock Bio-Assets',
        value: animalValue,
        percentage: Math.round((animalValue / Math.max(1, totalNetWorth)) * 100),
        color: '#8B5CF6', // Purple
      },
    ];

    return { risk, portfolio };
  }
}
