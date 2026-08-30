// ============================================================================
// 🌌 GREENIEVERSE - ACTION PLANNER & CANDIDATE SEARCH
// Generates, scores, and selects the optimal action to maximize Final Galactic Wealth
// ============================================================================

import { 
  GameState, 
  CandidateAction, 
  CropType, 
  CommodityType 
} from '../../../types/greenieverse';
import { CROP_SPECS } from '../constants';

export class ActionPlanner {
  /**
   * Generates candidate actions for the current turn, evaluates their expected utility,
   * and selects the highest ranked candidate.
   */
  public static planNextAction(state: GameState): {
    selectedAction: CandidateAction;
    candidatePool: CandidateAction[];
  } {
    const candidates: CandidateAction[] = [];
    const remainingTurns = state.maxTurns - state.currentTurn;

    // 1. Candidate: Harvest mature crops
    let matureCount = 0;
    let matureTile: { x: number; y: number } | undefined = undefined;
    let matureCrop: CropType | undefined = undefined;

    for (let y = 0; y < state.grid.length; y++) {
      for (let x = 0; x < state.grid[y].length; x++) {
        const tile = state.grid[y][x];
        if (tile.status === 'MATURE') {
          matureCount++;
          if (!matureTile) {
            matureTile = { x, y };
            matureCrop = tile.crop;
          }
        }
      }
    }

    if (matureCount > 0 && matureTile && matureCrop) {
      const spec = CROP_SPECS[matureCrop];
      const marketPrice = state.market[matureCrop]?.currentPrice || 50;
      const expectedProfit = marketPrice * spec.yieldPerTile;
      candidates.push({
        id: 'act-harvest',
        actionType: 'HARVEST',
        targetTile: matureTile,
        commodity: matureCrop,
        expectedProfit,
        riskScore: 5,
        timeCost: 1,
        opportunityCost: 0,
        utilityScore: 980 + expectedProfit,
        explanation: `Harvest mature ${matureCrop} at (${matureTile.x}, ${matureTile.y}). Yield: ${spec.yieldPerTile} units ($${expectedProfit} value).`,
        isSelected: false,
      });
    }

    // 2. Candidate: Sell high-scarcity inventory
    (Object.keys(state.inventory) as CommodityType[]).forEach(item => {
      const count = state.inventory[item] || 0;
      if (count > 0) {
        const market = state.market[item];
        const currentPrice = market ? market.currentPrice : 50;
        const totalValue = count * currentPrice;
        const isPeak = market?.scarcityScore > 75 || market?.aiRecommendation === 'SELL' || remainingTurns <= 48;

        candidates.push({
          id: `act-sell-${item}`,
          actionType: 'SELL_INVENTORY',
          commodity: item,
          expectedProfit: totalValue,
          riskScore: isPeak ? 10 : 35,
          timeCost: 1,
          opportunityCost: isPeak ? 0 : 25,
          utilityScore: isPeak ? 900 + totalValue : 450 + totalValue * 0.5,
          explanation: `Liquidate ${count}x ${item} at current market price ($${currentPrice}/ea, total: $${totalValue}).`,
          isSelected: false,
        });
      }
    });

    // 3. Candidate: Water dry planted crops
    let dryCount = 0;
    let dryTile: { x: number; y: number } | undefined = undefined;
    let dryCrop: CropType | undefined = undefined;

    for (let y = 0; y < state.grid.length; y++) {
      for (let x = 0; x < state.grid[y].length; x++) {
        const tile = state.grid[y][x];
        if (tile.status === 'PLANTED' && !tile.isWatered) {
          dryCount++;
          if (!dryTile) {
            dryTile = { x, y };
            dryCrop = tile.crop;
          }
        }
      }
    }

    if (dryCount > 0 && dryTile) {
      candidates.push({
        id: 'act-water',
        actionType: 'WATER',
        targetTile: dryTile,
        commodity: dryCrop,
        expectedProfit: 75,
        riskScore: 8,
        timeCost: 1,
        opportunityCost: 5,
        utilityScore: 820,
        explanation: `Irrigate dry ${dryCrop || 'seedling'} at (${dryTile.x}, ${dryTile.y}) to maintain uninterrupted photosynthetic growth.`,
        isSelected: false,
      });
    }

    // 4. Candidate: Plant high-scarcity seeds on empty land
    let emptyTile: { x: number; y: number } | undefined = undefined;
    for (let y = 0; y < state.grid.length; y++) {
      for (let x = 0; x < state.grid[y].length; x++) {
        const tile = state.grid[y][x];
        if (tile.isUnlocked && (tile.status === 'EMPTY' || tile.status === 'TILL')) {
          emptyTile = { x, y };
          break;
        }
      }
      if (emptyTile) break;
    }

    if (emptyTile && state.cash >= 30) {
      // Pick best crop that can finish before turn 720
      const bestCrop: CropType = remainingTurns >= 168 && state.cash >= 95
        ? 'STRAWBERRY'
        : remainingTurns >= 72 && state.cash >= 28
        ? 'CARROT'
        : 'WHEAT';

      const spec = CROP_SPECS[bestCrop];
      if (remainingTurns >= spec.growthTurns) {
        candidates.push({
          id: `act-plant-${bestCrop}`,
          actionType: 'PLANT',
          targetTile: emptyTile,
          commodity: bestCrop,
          expectedProfit: spec.expectedProfit,
          riskScore: 20,
          timeCost: 1,
          opportunityCost: 15,
          utilityScore: 780 + spec.expectedProfit * 0.5,
          explanation: `Sow ${spec.name} at (${emptyTile.x}, ${emptyTile.y}). Seed cost: $${spec.seedCost}, Net expected profit: +$${spec.expectedProfit}.`,
          isSelected: false,
        });
      }
    }

    // 5. Candidate: Land expansion (Unlock NE / SW / SE)
    const lockedQuadrants = Object.values(state.quadrants).filter(q => !q.isUnlocked && q.expansionAvailable);
    if (lockedQuadrants.length > 0) {
      const targetQuad = lockedQuadrants[0];
      if (state.cash >= targetQuad.unlockCost + 150 && remainingTurns >= 240) {
        candidates.push({
          id: `act-expand-${targetQuad.id}`,
          actionType: 'BUY_LAND',
          expectedProfit: targetQuad.unlockCost * (targetQuad.expectedROI / 100),
          riskScore: 25,
          timeCost: 2,
          opportunityCost: 30,
          utilityScore: 710 + targetQuad.expectedROI,
          explanation: `Unlock ${targetQuad.name}. Adds 25 fertile tiles. Expected ROI: +${targetQuad.expectedROI}%.`,
          isSelected: false,
        });
      }
    }

    // 6. Fallback idle candidate if nothing immediate
    if (candidates.length === 0) {
      candidates.push({
        id: 'act-inspect',
        actionType: 'WATER',
        expectedProfit: 0,
        riskScore: 0,
        timeCost: 1,
        opportunityCost: 0,
        utilityScore: 100,
        explanation: 'Surveying planetary microclimate and soil moisture levels. Standby for next turn.',
        isSelected: true,
      });
    }

    // Sort descending by utilityScore
    candidates.sort((a, b) => b.utilityScore - a.utilityScore);
    candidates[0].isSelected = true;

    return {
      selectedAction: candidates[0],
      candidatePool: candidates,
    };
  }
}
