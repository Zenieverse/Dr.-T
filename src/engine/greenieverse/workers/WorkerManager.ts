// ============================================================================
// 🌌 GREENIEVERSE - WORKER AI & PATH OPTIMIZATION
// Multi-agent worker routing, task prioritization, and marginal revenue analysis
// ============================================================================

import { WorkerAgent, TileState, WorkerTaskType } from '../../../types/greenieverse';

export interface WorkerHiringAnalysis {
  cost: number;
  expectedAdditionalRevenue: number;
  expectedProfit: number;
  marginalEfficiencyGain: number; // Percentage
  recommendation: 'HIRE' | 'WAIT' | 'REJECT';
  reason: string;
}

export class WorkerManager {
  /**
   * Calculates the economic justification for hiring an additional worker
   */
  public static evaluateHiringWorker(
    currentWorkersCount: number,
    unlockedTiles: number,
    cash: number,
    remainingTurns: number
  ): WorkerHiringAnalysis {
    const cost = 850 * Math.pow(1.35, currentWorkersCount);
    const daysLeft = Math.floor(remainingTurns / 24);

    // Tiles managed per worker ratio
    const tilesPerWorker = unlockedTiles / Math.max(1, currentWorkersCount);

    // If each worker can execute 24 actions/day, unworked tiles lose value
    const unworkedTilePressure = Math.max(0, tilesPerWorker - 12);
    const expectedAdditionalRevenue = unworkedTilePressure * 45 * daysLeft;
    const expectedProfit = expectedAdditionalRevenue - cost;

    let recommendation: 'HIRE' | 'WAIT' | 'REJECT' = 'WAIT';
    let reason = '';

    if (remainingTurns < 120) {
      recommendation = 'REJECT';
      reason = `Endgame phase: Only ${remainingTurns} turns remain. Worker salary ($${cost.toFixed(0)}) cannot achieve positive economic payback.`;
    } else if (cash < cost + 200) {
      recommendation = 'WAIT';
      reason = `Insufficient liquid cash ($${cash} vs $${(cost + 200).toFixed(0)} required reserve). Hiring now creates liquidity bankruptcy risk.`;
    } else if (expectedProfit > 600 && unworkedTilePressure > 5) {
      recommendation = 'HIRE';
      reason = `High labor deficit on ${unlockedTiles} unlocked tiles. Marginal productivity gain estimated at +$${expectedProfit.toFixed(0)} net wealth.`;
    } else {
      recommendation = 'WAIT';
      reason = `Current workforce (${currentWorkersCount} workers) sufficiently covers active tile workload. Maintain capital reserves.`;
    }

    return {
      cost: Math.round(cost),
      expectedAdditionalRevenue: Math.round(expectedAdditionalRevenue),
      expectedProfit: Math.round(expectedProfit),
      marginalEfficiencyGain: Math.round(Math.min(95, unworkedTilePressure * 6)),
      recommendation,
      reason,
    };
  }

  /**
   * Assigns optimal tasks to each worker minimizing Manhattan distance and maximizing task value
   */
  public static assignWorkerTasks(
    workers: WorkerAgent[],
    grid: TileState[][]
  ): WorkerAgent[] {
    const assignedTiles = new Set<string>();

    return workers.map(worker => {
      let bestTask: WorkerTaskType = 'IDLE';
      let bestTile: { x: number; y: number } | undefined = undefined;
      let highestValue = -1;
      let targetDesc = 'Monitoring agricultural sectors';

      // 1. Priority A: Harvest Mature Crops (Highest Value / Immediate Liquidity)
      for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
          const tile = grid[y][x];
          const key = `${x},${y}`;
          if (!tile.isUnlocked || assignedTiles.has(key)) continue;

          const dist = Math.abs(worker.x - x) + Math.abs(worker.y - y);

          if (tile.status === 'MATURE') {
            const value = 100 - dist * 2;
            if (value > highestValue) {
              highestValue = value;
              bestTask = 'HARVEST';
              bestTile = { x, y };
              targetDesc = `Harvesting mature ${tile.crop || 'crop'} at (${x}, ${y})`;
            }
          }
        }
      }

      // 2. Priority B: Water Parched Planted Crops
      if (highestValue < 50) {
        for (let y = 0; y < grid.length; y++) {
          for (let x = 0; x < grid[y].length; x++) {
            const tile = grid[y][x];
            const key = `${x},${y}`;
            if (!tile.isUnlocked || assignedTiles.has(key)) continue;

            const dist = Math.abs(worker.x - x) + Math.abs(worker.y - y);

            if (tile.status === 'PLANTED' && !tile.isWatered) {
              const value = 80 - dist * 2;
              if (value > highestValue) {
                highestValue = value;
                bestTask = 'WATER';
                bestTile = { x, y };
                targetDesc = `Irrigating parched ${tile.crop || 'seedling'} at (${x}, ${y})`;
              }
            }
          }
        }
      }

      // 3. Priority C: Plant on Empty Tilled Soil
      if (highestValue < 40) {
        for (let y = 0; y < grid.length; y++) {
          for (let x = 0; x < grid[y].length; x++) {
            const tile = grid[y][x];
            const key = `${x},${y}`;
            if (!tile.isUnlocked || assignedTiles.has(key)) continue;

            const dist = Math.abs(worker.x - x) + Math.abs(worker.y - y);

            if (tile.status === 'EMPTY' || tile.status === 'TILL') {
              const value = 60 - dist * 2;
              if (value > highestValue) {
                highestValue = value;
                bestTask = 'PLANT';
                bestTile = { x, y };
                targetDesc = `Planting high-scarcity seeds at (${x}, ${y})`;
              }
            }
          }
        }
      }

      if (bestTile) {
        assignedTiles.add(`${bestTile.x},${bestTile.y}`);
        const dist = Math.abs(worker.x - bestTile.x) + Math.abs(worker.y - bestTile.y);
        return {
          ...worker,
          task: bestTask,
          targetX: bestTile.x,
          targetY: bestTile.y,
          taskValue: Math.max(10, highestValue),
          distanceToTarget: dist,
          targetDescription: targetDesc,
          status: dist > 0 ? 'MOVING' : 'ACTIVE',
        };
      }

      return {
        ...worker,
        task: 'IDLE',
        taskValue: 0,
        distanceToTarget: 0,
        targetDescription: 'All tiles serviced. Standby for next growth cycle.',
        status: 'WAITING',
      };
    });
  }

  public static createInitialWorkers(): WorkerAgent[] {
    return [
      {
        id: 'worker-01',
        name: 'Unit Alpha-1 (Lead Farmer)',
        x: 1,
        y: 1,
        targetX: 1,
        targetY: 2,
        task: 'HARVEST',
        targetDescription: 'Harvesting mature Galactic Wheat at (1, 2)',
        taskValue: 95,
        distanceToTarget: 1,
        efficiency: 94,
        status: 'ACTIVE',
      },
      {
        id: 'worker-02',
        name: 'Unit Beta-2 (Irrigation Drone)',
        x: 2,
        y: 1,
        targetX: 2,
        targetY: 1,
        task: 'WATER',
        targetDescription: 'Irrigating Cosmic Carrot at (2, 1)',
        taskValue: 88,
        distanceToTarget: 0,
        efficiency: 91,
        status: 'ACTIVE',
      },
    ];
  }
}
