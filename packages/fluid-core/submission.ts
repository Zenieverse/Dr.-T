/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ARCTask, Grid, cloneGrid, gridsEqual, gridMatchAccuracy } from '../common';
import { runBeamSearch, getPrioritizedOperators } from '../search';
import * as ops from '../operators';

export interface TestAttemptPrediction {
  attempt_1: Grid;
  attempt_2: Grid;
}

export type ARCSubmissionJSON = Record<string, TestAttemptPrediction[]>;

export interface EvaluationSummary {
  totalTasks: number;
  totalOutputs: number;
  attempt1Hits: number;
  attempt2Hits: number;
  combinedHits: number;
  accuracyScore: number;
  accuracyPercentage: number;
  taskBreakdown: Array<{
    taskId: string;
    outputIndex: number;
    attempt1Match: boolean;
    attempt2Match: boolean;
    passed: boolean;
    accuracyAttempt1: number;
    accuracyAttempt2: number;
  }>;
}

/**
 * Generates two distinct candidate predictions for a specific test input using multi-hypothesis search DSL.
 */
export function solveTestInputDualAttempts(task: ARCTask, testInputIndex: number = 0): TestAttemptPrediction {
  const testInput = task.test[testInputIndex]?.input || task.train[0].input;
  
  // 1. Primary Beam Search on Train 0
  const searchResult = runBeamSearch(task.train[0].input, task.train[0].output, 8, 5);
  
  // Primary attempt (attempt_1)
  let attempt_1 = cloneGrid(testInput);
  if (searchResult.success && searchResult.path.length > 0) {
    for (const opName of searchResult.path) {
      const prioritizedOps = getPrioritizedOperators(attempt_1);
      const op = prioritizedOps.find(o => o.name === opName);
      if (op) {
        attempt_1 = op.apply(attempt_1);
      }
    }
  } else {
    // Top feature prior fallback
    const priors = getPrioritizedOperators(testInput);
    if (priors.length > 0) {
      attempt_1 = priors[0].apply(attempt_1);
    }
  }

  // 2. Secondary Attempt (attempt_2) - Secondary hypothesis or perturbation
  let attempt_2 = cloneGrid(testInput);
  const priors = getPrioritizedOperators(testInput);

  // If priors exist, pick secondary prioritized operator or alternative transformation
  if (priors.length > 1) {
    // Secondary operator from learned priors
    attempt_2 = priors[1].apply(attempt_2);
  } else if (priors.length > 0) {
    // Alternative geometric transform fallback
    attempt_2 = ops.rotateGrid(attempt_2, 90);
  }

  // If attempt_2 happened to produce the exact same grid as attempt_1, force a secondary candidate
  if (gridsEqual(attempt_1, attempt_2)) {
    if (priors.length > 2) {
      attempt_2 = priors[2].apply(cloneGrid(testInput));
    } else {
      attempt_2 = ops.mirrorGrid(cloneGrid(testInput), 'horizontal');
    }
  }

  return {
    attempt_1,
    attempt_2
  };
}

/**
 * Builds the official competition submission JSON for a set of ARC tasks.
 */
export function generateArcSubmission(tasks: ARCTask[]): ARCSubmissionJSON {
  const submission: ARCSubmissionJSON = {};

  for (const task of tasks) {
    submission[task.id] = [];
    for (let i = 0; i < task.test.length; i++) {
      const dualPred = solveTestInputDualAttempts(task, i);
      submission[task.id].push(dualPred);
    }
  }

  return submission;
}

/**
 * Evaluates a submission JSON against ground truth test outputs according to official ARC rules.
 */
export function evaluateArcSubmission(
  tasks: ARCTask[], 
  submission: ARCSubmissionJSON
): EvaluationSummary {
  let totalTasks = tasks.length;
  let totalOutputs = 0;
  let attempt1Hits = 0;
  let attempt2Hits = 0;
  let combinedHits = 0;

  const taskBreakdown: EvaluationSummary['taskBreakdown'] = [];

  for (const task of tasks) {
    const taskSub = submission[task.id];
    if (!taskSub) continue;

    for (let i = 0; i < task.test.length; i++) {
      totalOutputs++;
      const expectedOutput = task.test[i].output;
      const pred = taskSub[i] || solveTestInputDualAttempts(task, i);

      const att1Match = gridsEqual(pred.attempt_1, expectedOutput);
      const att2Match = gridsEqual(pred.attempt_2, expectedOutput);
      const passed = att1Match || att2Match;

      if (att1Match) attempt1Hits++;
      if (att2Match) attempt2Hits++;
      if (passed) combinedHits++;

      taskBreakdown.push({
        taskId: task.id,
        outputIndex: i,
        attempt1Match: att1Match,
        attempt2Match: att2Match,
        passed,
        accuracyAttempt1: gridMatchAccuracy(pred.attempt_1, expectedOutput),
        accuracyAttempt2: gridMatchAccuracy(pred.attempt_2, expectedOutput)
      });
    }
  }

  const accuracyScore = totalOutputs > 0 ? combinedHits / totalOutputs : 0;

  return {
    totalTasks,
    totalOutputs,
    attempt1Hits,
    attempt2Hits,
    combinedHits,
    accuracyScore,
    accuracyPercentage: Math.round(accuracyScore * 1000) / 10,
    taskBreakdown
  };
}
