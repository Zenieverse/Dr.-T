/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Grid } from '../common';
import { extractObjects } from '../operators';

export interface SpatialHypothesis {
  ruleName: string;
  description: string;
  confidence: number;
  invariants: string[];
}

/**
 * Automatically inspects input-output pairs to formulate initial geometric/spatial hypotheses.
 */
export function formulateHypothesis(input: Grid, output: Grid): SpatialHypothesis[] {
  const hypotheses: SpatialHypothesis[] = [];
  
  const inObjects = extractObjects(input);
  const outObjects = extractObjects(output);
  
  // Check if grid dimensions are constant
  const dimConstant = (input.length === output.length && input[0].length === output[0].length);
  
  if (dimConstant) {
    hypotheses.push({
      ruleName: 'Dimension Invariance',
      description: 'The grid maintains constant bounding dimensions during transformation.',
      confidence: 1.0,
      invariants: [`Rows: ${input.length}`, `Cols: ${input[0].length}`]
    });
  } else {
    hypotheses.push({
      ruleName: 'Dimensional Scaling',
      description: 'The grid undergoes scaling or structural expansion.',
      confidence: 0.8,
      invariants: [`Scale Ratio: ${output.length / input.length}x`]
    });
  }

  // Check color preservation
  const inColors = new Set(input.flat());
  const outColors = new Set(output.flat());
  const difference = [...outColors].filter(x => !inColors.has(x));
  
  if (difference.length === 0) {
    hypotheses.push({
      ruleName: 'Color Preservation',
      description: 'The puzzle is a rearrangement; no new colors are introduced.',
      confidence: 0.95,
      invariants: ['Unique Colors: ' + Array.from(inColors).join(', ')]
    });
  } else {
    hypotheses.push({
      ruleName: 'Color Infill or Phase Shift',
      description: `New values are generated at runtime. Introduced values: ${difference.join(', ')}`,
      confidence: 0.9,
      invariants: [`Introduced: ${difference.join(', ')}`]
    });
  }

  // Check object count
  if (inObjects.length === outObjects.length) {
    hypotheses.push({
      ruleName: 'Object Count Conservation',
      description: 'Core objects are translated or mutated but remain distinct.',
      confidence: 0.85,
      invariants: [`Object Count: ${inObjects.length}`]
    });
  }

  return hypotheses;
}
