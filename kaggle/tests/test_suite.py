#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
@license: SPDX-License-Identifier: Apache-2.0
@description: Automated regression tests for all ARC symbolic operators and tasks.
"""

import unittest
import sys
import os

# Adjust path to import from parent directory
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from inference import solve_task
import operators

# Complete copy of regression task dataset ported from typescript
REGRESSION_TESTS = [
    {
        "id": "gravity_fall_test",
        "train": [
            {
                "input": [
                    [0, 1, 0, 0, 0],
                    [0, 0, 0, 1, 0],
                    [0, 2, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 2, 0, 0]
                ],
                "output": [
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 3, 0, 0, 0],
                    [0, 0, 0, 1, 0],
                    [0, 0, 3, 0, 0]
                ]
            }
        ],
        "test": [
            {
                "input": [
                    [0, 1, 0, 0, 0],
                    [0, 0, 0, 1, 0],
                    [0, 2, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 2, 0, 0]
                ],
                "output": [
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
        "id": "reflection_pivot_test",
        "train": [
            {
                "input": [
                    [7, 0, 4, 0, 0],
                    [0, 7, 4, 0, 0],
                    [7, 7, 4, 0, 0],
                    [0, 0, 4, 0, 0],
                    [7, 0, 4, 0, 0]
                ],
                "output": [
                    [7, 0, 4, 0, 7],
                    [0, 7, 4, 7, 0],
                    [7, 7, 4, 7, 7],
                    [0, 0, 4, 0, 0],
                    [7, 0, 4, 0, 7]
                ]
            }
        ],
        "test": [
            {
                "input": [
                    [7, 0, 4, 0, 0],
                    [0, 7, 4, 0, 0],
                    [7, 7, 4, 0, 0],
                    [0, 0, 4, 0, 0],
                    [7, 0, 4, 0, 0]
                ],
                "output": [
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
        "id": "boundary_flood_test",
        "train": [
            {
                "input": [
                    [0, 3, 3, 3, 0],
                    [3, 0, 0, 0, 3],
                    [3, 0, 3, 0, 3],
                    [3, 0, 0, 0, 3],
                    [0, 3, 3, 3, 0]
                ],
                "output": [
                    [0, 3, 3, 3, 0],
                    [3, 3, 3, 3, 3],
                    [3, 3, 3, 3, 3],
                    [3, 3, 3, 3, 3],
                    [0, 3, 3, 3, 0]
                ]
            }
        ],
        "test": [
            {
                "input": [
                    [0, 3, 3, 3, 0],
                    [3, 0, 0, 0, 3],
                    [3, 0, 3, 0, 3],
                    [3, 0, 0, 0, 3],
                    [0, 3, 3, 3, 0]
                ],
                "output": [
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
        "id": "color_replace_test",
        "train": [
            {
                "input": [
                    [0, 1, 0, 1, 0],
                    [1, 0, 1, 0, 1],
                    [0, 1, 0, 1, 0],
                    [1, 0, 1, 0, 1],
                    [0, 1, 0, 1, 0]
                ],
                "output": [
                    [0, 8, 0, 8, 0],
                    [8, 0, 8, 0, 8],
                    [0, 8, 0, 8, 0],
                    [8, 0, 8, 0, 8],
                    [0, 8, 0, 8, 0]
                ]
            }
        ],
        "test": [
            {
                "input": [
                    [0, 1, 0, 1, 0],
                    [1, 0, 1, 0, 1],
                    [0, 1, 0, 1, 0],
                    [1, 0, 1, 0, 1],
                    [0, 1, 0, 1, 0]
                ],
                "output": [
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
        "id": "rotate_90_test",
        "train": [
            {
                "input": [
                    [0, 0, 0, 0, 0],
                    [0, 1, 1, 1, 0],
                    [0, 0, 0, 1, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0]
                ],
                "output": [
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 1, 0],
                    [0, 0, 0, 1, 0],
                    [0, 0, 1, 1, 0],
                    [0, 0, 0, 0, 0]
                ]
            }
        ],
        "test": [
            {
                "input": [
                    [0, 0, 0, 0, 0],
                    [0, 1, 1, 1, 0],
                    [0, 0, 0, 1, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0]
                ],
                "output": [
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 1, 0],
                    [0, 0, 0, 1, 0],
                    [0, 0, 1, 1, 0],
                    [0, 0, 0, 0, 0]
                ]
            }
        ]
    }
]

class TestARCOperators(unittest.TestCase):
    
    def test_apply_gravity(self):
        grid = [
            [0, 1, 0],
            [0, 0, 0],
            [0, 2, 0]
        ]
        res = operators.apply_gravity(grid, 2)
        # Particle should fall down, hit the anchor and transform to color 3 (green)
        self.assertEqual(res, [
            [0, 0, 0],
            [0, 0, 0],
            [0, 3, 0]
        ])

    def test_mirror_pivot(self):
        grid = [
            [1, 0, 4, 0, 0],
            [0, 0, 4, 0, 0]
        ]
        res = operators.mirror_pivot(grid, 4)
        self.assertEqual(res, [
            [1, 0, 4, 0, 1],
            [0, 0, 4, 0, 0]
        ])

    def test_slide_color(self):
        grid = [
            [1, 0, 0],
            [0, 0, 0]
        ]
        res = operators.slide_color(grid, 1, 1, 1)
        self.assertEqual(res, [
            [0, 0, 0],
            [0, 1, 0]
        ])

    def test_mirror_grid_horizontal(self):
        grid = [
            [1, 2],
            [3, 4]
        ]
        res = operators.mirror_grid(grid, "horizontal")
        self.assertEqual(res, [
            [3, 4],
            [1, 2]
        ])

    def test_mirror_grid_vertical(self):
        grid = [
            [1, 2],
            [3, 4]
        ]
        res = operators.mirror_grid(grid, "vertical")
        self.assertEqual(res, [
            [2, 1],
            [4, 3]
        ])

    def test_rotate_grid_90(self):
        grid = [
            [1, 2],
            [3, 4]
        ]
        res = operators.rotate_grid(grid, 90)
        self.assertEqual(res, [
            [3, 1],
            [4, 2]
        ])

    def test_flood_fill(self):
        grid = [
            [3, 3, 3],
            [3, 0, 3],
            [3, 3, 3]
        ]
        res = operators.flood_fill(grid, 1, 1, 3, 3)
        self.assertEqual(res, [
            [3, 3, 3],
            [3, 3, 3],
            [3, 3, 3]
        ])

    def test_replace_color(self):
        grid = [
            [1, 2],
            [2, 1]
        ]
        res = operators.replace_color(grid, 1, 8)
        self.assertEqual(res, [
            [8, 2],
            [2, 8]
        ])


class TestRegressionSuite(unittest.TestCase):
    
    def test_solve_regression_tasks(self):
        print("\n\n--- Running Full Task Regression Suite ---")
        passed_count = 0
        for task in REGRESSION_TESTS:
            prediction = solve_task(task)
            expected = task["test"][0]["output"]
            is_correct = (prediction == expected)
            print(f"Task {task['id']}: {'✅ PASS' if is_correct else '❌ FAIL'}")
            self.assertEqual(prediction, expected)
            if is_correct:
                passed_count += 1
        print(f"Summary: Passed {passed_count}/{len(REGRESSION_TESTS)} tasks.")


if __name__ == "__main__":
    unittest.main()
