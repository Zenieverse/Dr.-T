/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Grid, cloneGrid } from '../common';

// ==========================================
// 1. MOVEMENT OPERATORS
// ==========================================

/**
 * Simulates gravity downward: non-zero particles fall until they hit a block (or specified anchor) or bottom.
 * If a falling particle (value 1) rests on/adjacent to an anchor (value 2), it triggers a phase transform to 3 (green).
 */
export function applyGravity(grid: Grid, anchorColor = 2): Grid {
  const result = cloneGrid(grid);
  const R = result.length;
  const C = result[0].length;
  
  // 1. Fall phase for value 1 particles
  let changed = true;
  while (changed) {
    changed = false;
    for (let r = R - 2; r >= 0; r--) {
      for (let c = 0; c < C; c++) {
        const val = result[r][c];
        if (val === 1) { // active particle
          const nextVal = result[r + 1][c];
          
          // Check vertical block
          let blocked = nextVal !== 0;
          
          // Check diagonal anchor support below-left and below-right
          if (r + 1 < R) {
            if (c - 1 >= 0 && result[r + 1][c - 1] === anchorColor) {
              blocked = true;
            }
            if (c + 1 < C && result[r + 1][c + 1] === anchorColor) {
              blocked = true;
            }
          }
          
          if (!blocked) {
            result[r + 1][c] = 1;
            result[r][c] = 0;
            changed = true;
          }
        }
      }
    }
  }

  // 2. Transformation phase
  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      if (result[r][c] === anchorColor) {
        // Direct contact above (absorption)
        if (r - 1 >= 0 && result[r - 1][c] === 1) {
          result[r - 1][c] = 0; // absorbed
          result[r][c] = 3;     // transformed
        }
        
        // Diagonal contacts (no absorption, but triggers transformation)
        const diagonalOffsets = [
          [-1, -1],
          [-1, 1],
          [1, -1],
          [1, 1],
          [0, -1],
          [0, 1]
        ];
        
        let hasDiagonalTouch = false;
        for (const [dr, dc] of diagonalOffsets) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < R && nc >= 0 && nc < C) {
            if (result[nr][nc] === 1) {
              hasDiagonalTouch = true;
            }
          }
        }
        
        if (hasDiagonalTouch) {
          result[r][c] = 3;
        }
      }
    }
  }

  return result;
}

/**
 * Mirror across an offset vertical column (yellow line, pivot value 4)
 */
export function mirrorPivot(grid: Grid, pivotColor = 4): Grid {
  const result = cloneGrid(grid);
  const R = result.length;
  const C = result[0].length;

  // Find the column index representing the pivot plane
  let pivotC = -1;
  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      if (grid[r][c] === pivotColor) {
        pivotC = c;
        break;
      }
    }
    if (pivotC !== -1) break;
  }

  if (pivotC !== -1) {
    for (let r = 0; r < R; r++) {
      for (let offset = 1; offset < C; offset++) {
        const leftC = pivotC - offset;
        const rightC = pivotC + offset;
        if (leftC >= 0 && rightC < C) {
          if (grid[r][leftC] !== 0) {
            result[r][rightC] = grid[r][leftC];
          }
        }
      }
    }
  }

  return result;
}

/**
 * Slides all cells of a specific color in a direction.
 */
export function slideColor(grid: Grid, color: number, dr: number, dc: number): Grid {
  const result = cloneGrid(grid);
  const R = result.length;
  const C = result[0].length;
  const toMove: { r: number; c: number; val: number }[] = [];
  
  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      if (result[r][c] === color) {
        toMove.push({ r, c, val: result[r][c] });
        result[r][c] = 0;
      }
    }
  }

  for (const item of toMove) {
    const targetR = item.r + dr;
    const targetC = item.c + dc;
    if (targetR >= 0 && targetR < R && targetC >= 0 && targetC < C) {
      result[targetR][targetC] = item.val;
    }
  }
  return result;
}

// ==========================================
// 2. GEOMETRY OPERATORS
// ==========================================

/**
 * Reflects grid horizontally or vertically around a central pivot.
 */
export function mirrorGrid(grid: Grid, axis: 'horizontal' | 'vertical'): Grid {
  const result = cloneGrid(grid);
  const R = result.length;
  const C = result[0].length;
  
  if (axis === 'vertical') {
    for (let r = 0; r < R; r++) {
      result[r].reverse();
    }
  } else {
    result.reverse();
  }
  return result;
}

/**
 * Rotates grid by 90, 180, or 270 degrees clockwise.
 */
export function rotateGrid(grid: Grid, degrees: 90 | 180 | 270): Grid {
  const R = grid.length;
  const C = grid[0].length;
  
  if (degrees === 180) {
    return grid.map(row => [...row].reverse()).reverse();
  }
  
  if (degrees === 90) {
    const rotated: Grid = Array.from({ length: C }, () => Array(R).fill(0));
    for (let r = 0; r < R; r++) {
      for (let c = 0; c < C; c++) {
        rotated[c][R - 1 - r] = grid[r][c];
      }
    }
    return rotated;
  }
  
  if (degrees === 270) {
    const rotated: Grid = Array.from({ length: C }, () => Array(R).fill(0));
    for (let r = 0; r < R; r++) {
      for (let c = 0; c < C; c++) {
        rotated[C - 1 - c][r] = grid[r][c];
      }
    }
    return rotated;
  }
  
  return cloneGrid(grid);
}

// ==========================================
// 3. TOPOLOGY OPERATORS
// ==========================================

/**
 * Performs a standard flood fill inside an enclosed boundary.
 */
export function floodFill(grid: Grid, startR: number, startC: number, fillColor: number, boundaryColor: number): Grid {
  const result = cloneGrid(grid);
  const R = result.length;
  const C = result[0].length;
  const visited = Array.from({ length: R }, () => Array(C).fill(false));
  const queue: [number, number][] = [[startR, startC]];
  
  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    if (r < 0 || r >= R || c < 0 || c >= C) continue;
    if (visited[r][c]) continue;
    if (result[r][c] === boundaryColor || result[r][c] === fillColor) continue;
    
    visited[r][c] = true;
    result[r][c] = fillColor;
    
    queue.push([r + 1, c]);
    queue.push([r - 1, c]);
    queue.push([r, c + 1]);
    queue.push([r, c - 1]);
  }
  return result;
}

// ==========================================
// 4. COLOR OPERATORS
// ==========================================

/**
 * Replaces all instances of targetColor with replacementColor.
 */
export function replaceColor(grid: Grid, targetColor: number, replacementColor: number): Grid {
  return grid.map(row => row.map(cell => cell === targetColor ? replacementColor : cell));
}

// ==========================================
// 5. OBJECT OPERATORS
// ==========================================

export interface ARCComponent {
  color: number;
  pixels: { r: number; c: number }[];
  minR: number;
  maxR: number;
  minC: number;
  maxC: number;
}

import { CanonicalObject, BoundingBox, Point } from '../common';

/**
 * Calculates local horizontal and vertical symmetry of an isolated component's bounding box.
 */
function calculateComponentSymmetry(pixels: Point[], bbox: BoundingBox): number {
  const h = bbox.maxR - bbox.minR + 1;
  const w = bbox.maxC - bbox.minC + 1;
  const localGrid = Array.from({ length: h }, () => Array(w).fill(0));
  
  for (const p of pixels) {
    localGrid[p.r - bbox.minR][p.c - bbox.minC] = 1;
  }

  let symmetricMatches = 0;
  let totalCompares = 0;

  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      totalCompares += 2;
      // Horiz mirror
      if (localGrid[r][c] === localGrid[r][w - 1 - c]) {
        symmetricMatches++;
      }
      // Vert mirror
      if (localGrid[r][c] === localGrid[h - 1 - r][c]) {
        symmetricMatches++;
      }
    }
  }

  return totalCompares === 0 ? 1 : symmetricMatches / totalCompares;
}

/**
 * Detects if an isolated component's bounding box contains fully enclosed empty spaces (holes).
 */
function detectComponentHoles(pixels: Point[], bbox: BoundingBox): boolean {
  const h = bbox.maxR - bbox.minR + 3; // add padding to facilitate standard flood fill from outside
  const w = bbox.maxC - bbox.minC + 3;
  const tempGrid = Array.from({ length: h }, () => Array(w).fill(0));

  // Map component pixels into padded space
  for (const p of pixels) {
    tempGrid[p.r - bbox.minR + 1][p.c - bbox.minC + 1] = 1;
  }

  // Flood fill from (0,0) (which is guaranteed to be outside the component)
  const queue: [number, number][] = [[0, 0]];
  const visited = Array.from({ length: h }, () => Array(w).fill(false));
  visited[0][0] = true;

  while (queue.length > 0) {
    const [currR, currC] = queue.shift()!;
    const neighbors = [
      [currR + 1, currC],
      [currR - 1, currC],
      [currR, currC + 1],
      [currR, currC - 1]
    ];
    for (const [nr, nc] of neighbors) {
      if (nr >= 0 && nr < h && nc >= 0 && nc < w) {
        if (!visited[nr][nc] && tempGrid[nr][nc] === 0) {
          visited[nr][nc] = true;
          queue.push([nr, nc]);
        }
      }
    }
  }

  // Any unvisited cell in tempGrid that is still 0 must be an internal hole!
  for (let r = 1; r < h - 1; r++) {
    for (let c = 1; c < w - 1; c++) {
      if (tempGrid[r][c] === 0 && !visited[r][c]) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Extracts list of CanonicalObjects with structural descriptors.
 */
export function extractCanonicalObjects(grid: Grid, allowDiagonal = false): CanonicalObject[] {
  const R = grid.length;
  const C = grid[0].length;
  const rawComponents = extractObjects(grid, allowDiagonal);
  
  return rawComponents.map((comp, idx) => {
    const bbox: BoundingBox = {
      minR: comp.minR,
      maxR: comp.maxR,
      minC: comp.minC,
      maxC: comp.maxC
    };

    const totalR = comp.pixels.reduce((acc, p) => acc + p.r, 0);
    const totalC = comp.pixels.reduce((acc, p) => acc + p.c, 0);
    const centroid: Point = {
      r: Math.round(totalR / comp.pixels.length),
      c: Math.round(totalC / comp.pixels.length)
    };

    const area = comp.pixels.length;
    const symmetryScore = calculateComponentSymmetry(comp.pixels, bbox);
    const hasHoles = detectComponentHoles(comp.pixels, bbox);

    const h = bbox.maxR - bbox.minR + 1;
    const w = bbox.maxC - bbox.minC + 1;
    let orientation: 'horizontal' | 'vertical' | 'square' | 'none' = 'none';
    if (w > h) orientation = 'horizontal';
    else if (h > w) orientation = 'vertical';
    else if (h === w && h > 1) orientation = 'square';

    return {
      id: `obj-${idx}-${comp.color}-${bbox.minR}-${bbox.minC}`,
      color: comp.color,
      pixels: comp.pixels,
      boundingBox: bbox,
      centroid,
      area,
      symmetryScore,
      hasHoles,
      orientation
    };
  });
}

/**
 * Identifies connected components (objects) in the grid of non-zero colors.
 */
export function extractObjects(grid: Grid, allowDiagonal = false): ARCComponent[] {
  const R = grid.length;
  const C = grid[0].length;
  const visited = Array.from({ length: R }, () => Array(C).fill(false));
  const components: ARCComponent[] = [];

  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      const color = grid[r][c];
      if (color !== 0 && !visited[r][c]) {
        // BFS to find all pixels of this connected component
        const pixels: { r: number; c: number }[] = [];
        const queue: [number, number][] = [[r, c]];
        visited[r][c] = true;

        let minR = r, maxR = r, minC = c, maxC = c;

        while (queue.length > 0) {
          const [currR, currC] = queue.shift()!;
          pixels.push({ r: currR, c: currC });
          
          minR = Math.min(minR, currR);
          maxR = Math.max(maxR, currR);
          minC = Math.min(minC, currC);
          maxC = Math.max(maxC, currC);

          const dirs = [[1,0], [-1,0], [0,1], [0,-1]];
          if (allowDiagonal) {
            dirs.push([1,1], [1,-1], [-1,1], [-1,-1]);
          }

          for (const [dr, dc] of dirs) {
            const nr = currR + dr;
            const nc = currC + dc;
            if (nr >= 0 && nr < R && nc >= 0 && nc < C) {
              if (grid[nr][nc] === color && !visited[nr][nc]) {
                visited[nr][nc] = true;
                queue.push([nr, nc]);
              }
            }
          }
        }
        
        components.push({
          color,
          pixels,
          minR,
          maxR,
          minC,
          maxC
        });
      }
    }
  }
  return components;
}

// ==========================================
// 6. TRANSFORMATION AND COMPOSITION
// ==========================================

export type OperatorFunction = (g: Grid) => Grid;

/**
 * Composes a list of grid operator functions sequentially.
 */
export function composeOperators(operators: OperatorFunction[]): OperatorFunction {
  return (grid: Grid) => {
    let current = cloneGrid(grid);
    for (const op of operators) {
      current = op(current);
    }
    return current;
  };
}
