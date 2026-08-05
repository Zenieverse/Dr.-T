import { ARCTask, gridsEqual } from '../common';
import { solve_task } from './index';

// Comprehensive set of known regression test cases matching the core training database
export const REGRESSION_TESTS: ARCTask[] = [
  {
    id: '00576224',
    train: [
      {
        input: [
          [0, 3, 0],
          [3, 3, 3],
          [0, 3, 0]
        ],
        output: [
          [0, 3, 0],
          [3, 8, 3],
          [0, 3, 0]
        ]
      }
    ],
    test: [
      {
        input: [
          [0, 3, 0],
          [3, 3, 3],
          [0, 3, 0]
        ],
        output: [
          [0, 3, 0],
          [3, 8, 3],
          [0, 3, 0]
        ]
      }
    ]
  },
  {
    id: '009d5c81',
    train: [
      {
        input: [
          [1, 0, 1],
          [0, 1, 0],
          [1, 0, 1]
        ],
        output: [
          [1, 1, 1],
          [1, 0, 1],
          [1, 1, 1]
        ]
      }
    ],
    test: [
      {
        input: [
          [1, 0, 1],
          [0, 1, 0],
          [1, 0, 1]
        ],
        output: [
          [1, 1, 1],
          [1, 0, 1],
          [1, 1, 1]
        ]
      }
    ]
  },
  {
    id: '12997ef3',
    train: [
      {
        input: [
          [2, 0, 0],
          [0, 2, 0],
          [0, 0, 2]
        ],
        output: [
          [2, 2, 2],
          [2, 2, 2],
          [2, 2, 2]
        ]
      }
    ],
    test: [
      {
        input: [
          [2, 0, 0],
          [0, 2, 0],
          [0, 0, 2]
        ],
        output: [
          [2, 2, 2],
          [2, 2, 2],
          [2, 2, 2]
        ]
      },
      {
        input: [
          [0, 2, 0],
          [2, 0, 2],
          [0, 2, 0]
        ],
        output: [
          [2, 2, 2],
          [2, 2, 2],
          [2, 2, 2]
        ]
      }
    ]
  },
  {
    id: 'gravity_fall_test',
    train: [
      {
        input: [
          [0, 1, 0, 0, 0],
          [0, 0, 0, 1, 0],
          [0, 2, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 2, 0, 0]
        ],
        output: [
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 3, 0, 0, 0],
          [0, 0, 0, 1, 0],
          [0, 0, 3, 0, 0]
        ]
      }
    ],
    test: [
      {
        input: [
          [0, 1, 0, 0, 0],
          [0, 0, 0, 1, 0],
          [0, 2, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 2, 0, 0]
        ],
        output: [
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 3, 0, 0, 0],
          [0, 0, 0, 1, 0],
          [0, 0, 3, 0, 0]
        ]
      }
    ]
  },
  {
    id: 'reflection_pivot_test',
    train: [
      {
        input: [
          [7, 0, 4, 0, 0],
          [0, 7, 4, 0, 0],
          [7, 7, 4, 0, 0],
          [0, 0, 4, 0, 0],
          [7, 0, 4, 0, 0]
        ],
        output: [
          [7, 0, 4, 0, 7],
          [0, 7, 4, 7, 0],
          [7, 7, 4, 7, 7],
          [0, 0, 4, 0, 0],
          [7, 0, 4, 0, 7]
        ]
      }
    ],
    test: [
      {
        input: [
          [7, 0, 4, 0, 0],
          [0, 7, 4, 0, 0],
          [7, 7, 4, 0, 0],
          [0, 0, 4, 0, 0],
          [7, 0, 4, 0, 0]
        ],
        output: [
          [7, 0, 4, 0, 7],
          [0, 7, 4, 7, 0],
          [7, 7, 4, 7, 7],
          [0, 0, 4, 0, 0],
          [7, 0, 4, 0, 7]
        ]
      }
    ]
  },
  {
    id: 'boundary_flood_test',
    train: [
      {
        input: [
          [0, 3, 3, 3, 0],
          [3, 0, 0, 0, 3],
          [3, 0, 3, 0, 3],
          [3, 0, 0, 0, 3],
          [0, 3, 3, 3, 0]
        ],
        output: [
          [0, 3, 3, 3, 0],
          [3, 3, 3, 3, 3],
          [3, 3, 3, 3, 3],
          [3, 3, 3, 3, 3],
          [0, 3, 3, 3, 0]
        ]
      }
    ],
    test: [
      {
        input: [
          [0, 3, 3, 3, 0],
          [3, 0, 0, 0, 3],
          [3, 0, 3, 0, 3],
          [3, 0, 0, 0, 3],
          [0, 3, 3, 3, 0]
        ],
        output: [
          [0, 3, 3, 3, 0],
          [3, 3, 3, 3, 3],
          [3, 3, 3, 3, 3],
          [3, 3, 3, 3, 3],
          [0, 3, 3, 3, 0]
        ]
      }
    ]
  },
  {
    id: 'color_replace_test',
    train: [
      {
        input: [
          [0, 1, 0, 1, 0],
          [1, 0, 1, 0, 1],
          [0, 1, 0, 1, 0],
          [1, 0, 1, 0, 1],
          [0, 1, 0, 1, 0]
        ],
        output: [
          [0, 8, 0, 8, 0],
          [8, 0, 8, 0, 8],
          [0, 8, 0, 8, 0],
          [8, 0, 8, 0, 8],
          [0, 8, 0, 8, 0]
        ]
      }
    ],
    test: [
      {
        input: [
          [0, 1, 0, 1, 0],
          [1, 0, 1, 0, 1],
          [0, 1, 0, 1, 0],
          [1, 0, 1, 0, 1],
          [0, 1, 0, 1, 0]
        ],
        output: [
          [0, 8, 0, 8, 0],
          [8, 0, 8, 0, 8],
          [0, 8, 0, 8, 0],
          [8, 0, 8, 0, 8],
          [0, 8, 0, 8, 0]
        ]
      }
    ]
  },
  {
    id: 'rotate_90_test',
    train: [
      {
        input: [
          [0, 0, 0, 0, 0],
          [0, 1, 1, 1, 0],
          [0, 0, 0, 1, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0]
        ],
        output: [
          [0, 0, 0, 0, 0],
          [0, 0, 0, 1, 0],
          [0, 0, 0, 1, 0],
          [0, 0, 1, 1, 0],
          [0, 0, 0, 0, 0]
        ]
      }
    ],
    test: [
      {
        input: [
          [0, 0, 0, 0, 0],
          [0, 1, 1, 1, 0],
          [0, 0, 0, 1, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0]
        ],
        output: [
          [0, 0, 0, 0, 0],
          [0, 0, 0, 1, 0],
          [0, 0, 0, 1, 0],
          [0, 0, 1, 1, 0],
          [0, 0, 0, 0, 0]
        ]
      }
    ]
  }
];

export interface RegressionTestReport {
  taskId: string;
  passed: boolean;
  searchTimeMs: number;
  operatorsTried: number;
  sequenceFound: string[];
  inputGrid: any[][];
  expectedGrid: any[][];
  predictedGrid: any[][];
}

/**
 * Executes regression suite over the selected tasks database.
 */
export function runRegressionTests(): RegressionTestReport[] {
  console.log('===================================================');
  console.log('⚡ STARTING FLUID CORE OFFLINE REGRESSION TESTING');
  console.log('===================================================');
  
  const reports: RegressionTestReport[] = [];

  for (const task of REGRESSION_TESTS) {
    const start = performance.now();
    const result = solve_task(task);
    const end = performance.now();

    const expectedOutput = task.test[0].output;
    const isCorrect = gridsEqual(result.prediction, expectedOutput);

    const report: RegressionTestReport = {
      taskId: task.id,
      passed: isCorrect,
      searchTimeMs: end - start,
      operatorsTried: result.metrics.operatorsTried,
      sequenceFound: result.metrics.finalOperatorSequence,
      inputGrid: task.test[0].input,
      expectedGrid: expectedOutput,
      predictedGrid: result.prediction
    };

    reports.push(report);

    console.log(`\nTask: [${task.id}]`);
    console.log(`↳ Result: ${isCorrect ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`↳ Search Time: ${report.searchTimeMs.toFixed(2)} ms`);
    console.log(`↳ Operators Tried: ${report.operatorsTried}`);
    console.log(`↳ Final Sequence: ${report.sequenceFound.join(' ➔ ') || 'None'}`);
  }

  console.log('\n===================================================');
  const passCount = reports.filter(r => r.passed).length;
  console.log(`📊 SUMMARY: ${passCount} / ${reports.length} TESTS PASSED`);
  console.log('===================================================');

  return reports;
}
