/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Grid } from '../common';

/**
 * Calculates the color frequency histogram of a grid.
 */
export function getColorHistogram(grid: Grid): Record<number, number> {
  const counts: Record<number, number> = {};
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      const val = grid[r][c];
      counts[val] = (counts[val] || 0) + 1;
    }
  }
  return counts;
}

/**
 * Evaluates the similarity of color distributions between two grids (0 = identical, higher is worse).
 */
export function colorDistributionDistance(g1: Grid, g2: Grid): number {
  const h1 = getColorHistogram(g1);
  const h2 = getColorHistogram(g2);
  let diff = 0;
  for (let i = 0; i <= 9; i++) {
    const count1 = h1[i] || 0;
    const count2 = h2[i] || 0;
    diff += Math.abs(count1 - count2);
  }
  return diff;
}

/**
 * Measures vertical symmetry (0.0 to 1.0, where 1.0 is perfectly symmetric across vertical midline).
 */
export function getVerticalSymmetry(grid: Grid): number {
  const R = grid.length;
  const C = grid[0].length;
  let matches = 0;
  let total = 0;
  
  for (let r = 0; r < R; r++) {
    for (let c = 0; c < Math.floor(C / 2); c++) {
      total++;
      if (grid[r][c] === grid[r][C - 1 - c]) {
        matches++;
      }
    }
  }
  return total === 0 ? 1.0 : matches / total;
}

/**
 * Heuristic scorer: Returns a value from 0 (perfect fit/exact match) upwards.
 * Low scores represent better candidate fits.
 */
export function calculateFitness(candidate: Grid, target: Grid): number {
  if (candidate.length !== target.length || candidate[0].length !== target[0].length) {
    return 1000; // Large penalty for incorrect dimensions
  }
  
  // Exact mismatch count
  let mismatches = 0;
  const R = candidate.length;
  const C = candidate[0].length;
  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      if (candidate[r][c] !== target[r][c]) {
        mismatches++;
      }
    }
  }
  
  const distPenalty = colorDistributionDistance(candidate, target) * 0.5;
  return mismatches + distPenalty;
}
