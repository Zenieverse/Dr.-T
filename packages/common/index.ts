/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Grid = number[][];

export interface Point {
  r: number;
  c: number;
}

export interface BoundingBox {
  minR: number;
  maxR: number;
  minC: number;
  maxC: number;
}

export interface CanonicalObject {
  id: string;
  color: number;
  pixels: Point[];
  boundingBox: BoundingBox;
  centroid: Point;
  area: number;
  symmetryScore: number;
  hasHoles: boolean;
  orientation: 'horizontal' | 'vertical' | 'square' | 'none';
}

export interface InferenceMetrics {
  operatorsTried: number;
  beamWidth: number;
  maxDepth: number;
  bestHypothesisScore: number;
  searchTimeMs: number;
  finalOperatorSequence: string[];
}

export interface OperatorPrior {
  operatorName: string;
  successRate: number; // e.g. 0.73 for Reflection
}

export interface ARCKeyPair {
  input: Grid;
  output: Grid;
}

export interface ARCTask {
  id: string;
  train: ARCKeyPair[];
  test: ARCKeyPair[];
}

export interface SearchNode {
  grid: Grid;
  path: string[];
  cost: number;
  heuristicScore: number;
}

/**
 * Validates if two grids are identical.
 */
export function gridsEqual(g1: Grid, g2: Grid): boolean {
  if (g1.length !== g2.length) return false;
  if (g1[0].length !== g2[0].length) return false;
  for (let r = 0; r < g1.length; r++) {
    for (let c = 0; c < g1[0].length; c++) {
      if (g1[r][c] !== g2[r][c]) return false;
    }
  }
  return true;
}

/**
 * Calculates a match score (fraction of matching cells) between two grids.
 */
export function gridMatchAccuracy(g1: Grid, g2: Grid): number {
  if (g1.length !== g2.length || g1[0].length !== g2[0].length) return 0;
  let matches = 0;
  const total = g1.length * g1[0].length;
  for (let r = 0; r < g1.length; r++) {
    for (let c = 0; c < g1[0].length; c++) {
      if (g1[r][c] === g2[r][c]) matches++;
    }
  }
  return matches / total;
}

/**
 * Creates a deep copy of a 2D grid.
 */
export function cloneGrid(grid: Grid): Grid {
  return grid.map(row => [...row]);
}
