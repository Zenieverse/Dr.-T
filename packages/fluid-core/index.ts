/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Grid, gridsEqual, cloneGrid, ARCTask, InferenceMetrics } from '../common';
import { runBeamSearch, getPrioritizedOperators } from '../search';
import { extractCanonicalObjects } from '../operators';
import { formulateHypothesis, SpatialHypothesis } from '../reasoning';

export interface EvaluationResult {
  solved: boolean;
  operationPath: string[];
  finalGrid: Grid;
  hypotheses: SpatialHypothesis[];
  accuracy: number;
}

export interface ExplanationPayload {
  taskTitle: string;
  operationPath: string[];
  hypotheses: SpatialHypothesis[];
}

export interface PredictionOutput {
  prediction: Grid;
  metrics: InferenceMetrics;
  success: boolean;
}

/**
 * Frozen Competition Inference Entry Point: solve_task(task) -> prediction
 * Completely decoupled from React and any browser elements.
 */
export function solve_task(task: ARCTask): PredictionOutput {
  const startTime = performance.now();
  let bestMetrics: InferenceMetrics = {
    operatorsTried: 0,
    beamWidth: 4,
    maxDepth: 5,
    bestHypothesisScore: 1.0,
    searchTimeMs: 0,
    finalOperatorSequence: []
  };

  // 1. Object Extraction (Canonical object analysis)
  const train0InputObjects = extractCanonicalObjects(task.train[0].input);
  
  // 2. Hypothesis Generation from training examples
  const hypotheses = formulateHypothesis(task.train[0].input, task.train[0].output);

  // 3. Beam Search on Train 0 (or first training pair)
  // We search for a composition of operators that transforms train[0].input -> train[0].output
  const beamWidth = 8;
  const maxDepth = 5;
  const searchResult = runBeamSearch(task.train[0].input, task.train[0].output, beamWidth, maxDepth);

  // Update running metrics counters
  bestMetrics.operatorsTried = searchResult.metrics.operatorsTried;
  bestMetrics.bestHypothesisScore = searchResult.metrics.bestHypothesisScore;
  bestMetrics.finalOperatorSequence = searchResult.path;

  let chosenSequence = searchResult.path;
  let isTrainConsistent = searchResult.success;

  // 4. Operator execution & validation across all other train pairs
  if (isTrainConsistent && task.train.length > 1) {
    for (let i = 1; i < task.train.length; i++) {
      const pair = task.train[i];
      let tempGrid = cloneGrid(pair.input);

      // Apply the sequence of operations we found
      for (const opName of chosenSequence) {
        const prioritizedOps = getPrioritizedOperators(tempGrid);
        const op = prioritizedOps.find(o => o.name === opName);
        if (op) {
          tempGrid = op.apply(tempGrid);
        }
      }

      // If the sequence fails to translate another train pair, set consistency flag to false
      if (!gridsEqual(tempGrid, pair.output)) {
        isTrainConsistent = false;
        break;
      }
    }
  }

  // 5. Export Prediction: Generate final test grid prediction
  const testInput = task.test[0].input;
  let predictionGrid = cloneGrid(testInput);

  if (isTrainConsistent) {
    // Apply the validated sequence
    for (const opName of chosenSequence) {
      const prioritizedOps = getPrioritizedOperators(predictionGrid);
      const op = prioritizedOps.find(o => o.name === opName);
      if (op) {
        predictionGrid = op.apply(predictionGrid);
      }
    }
  } else {
    // Fallback: apply the best single operator based on feature priors
    const priors = getPrioritizedOperators(testInput);
    if (priors.length > 0) {
      predictionGrid = priors[0].apply(predictionGrid);
      bestMetrics.finalOperatorSequence = [priors[0].name];
    }
  }

  bestMetrics.searchTimeMs = performance.now() - startTime;

  return {
    prediction: predictionGrid,
    metrics: bestMetrics,
    success: isTrainConsistent
  };
}

/**
 * Core Orchestrator: Executes offline inference using heuristic search.
 * This runs completely without Gemini or any external dependencies.
 */
export function solveTaskOffline(input: Grid, target: Grid): EvaluationResult {
  // 1. Hypothesis Generation
  const hypotheses = formulateHypothesis(input, target);
  
  // 2. Operator Graph Search
  const searchResult = runBeamSearch(input, target, 4, 5);
  
  // 3. Validation
  const isCorrect = gridsEqual(searchResult.finalGrid, target);
  
  let matchCount = 0;
  const totalCells = target.length * target[0].length;
  for (let r = 0; r < target.length; r++) {
    for (let c = 0; c < target[0].length; c++) {
      if (searchResult.finalGrid[r][c] === target[r][c]) {
        matchCount++;
      }
    }
  }

  return {
    solved: isCorrect,
    operationPath: searchResult.path,
    finalGrid: searchResult.finalGrid,
    hypotheses: hypotheses,
    accuracy: matchCount / totalCells
  };
}

/**
 * Separate Explanation Engine: Generates human explanations of solved puzzles.
 * This can be disabled during offline competition evaluation.
 */
export function generateSocraticExplanation(payload: ExplanationPayload): string {
  const { taskTitle, operationPath, hypotheses } = payload;
  const steps = operationPath.map((op, i) => `Step ${i + 1}: Applied [${op}] operator.`).join(' ');
  const bestHypothesis = hypotheses[0]?.description || 'Formulated structural logic pattern.';
  
  return `Oh, my dear child! For the task "${taskTitle}", through elegant observation, we see that "${bestHypothesis}" holds true. We resolved this puzzle by following these beautiful actions: ${steps} Everything is now balanced and at peace.`;
}
