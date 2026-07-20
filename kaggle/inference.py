#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
@license: SPDX-License-Identifier: Apache-2.0
@description: Kaggle ARC-AGI-3 offline inference engine.
              Zero-dependency, standalone heuristic search logic.
"""

import sys
import json

class ARCOperators:
    @staticmethod
    def apply_gravity(grid, anchor_color=2):
        """Simulates downward gravity where particles fall until hitting obstacles or diagonal support."""
        R = len(grid)
        C = len(grid[0])
        # Deep copy list of lists
        curr = [row[:] for row in grid]
        changed = True
        while changed:
            changed = False
            for r in range(R - 2, -1, -1):
                for c in range(C):
                    val = curr[r][c]
                    if val == 1: # Active particle
                        next_val = curr[r + 1][c]
                        blocked = next_val != 0
                        # Check diagonal anchor support below-left and below-right
                        if c - 1 >= 0 and curr[r + 1][c - 1] == anchor_color:
                            blocked = True
                        if c + 1 < C and curr[r + 1][c + 1] == anchor_color:
                            blocked = True
                        
                        if not blocked:
                            curr[r + 1][c] = 1
                            curr[r][c] = 0
                            changed = True
        
        # Transformation phase
        for r in range(R):
            for c in range(C):
                if curr[r][c] == anchor_color:
                    # Direct contact above (absorption)
                    if r - 1 >= 0 and curr[r - 1][c] == 1:
                        curr[r - 1][c] = 0
                        curr[r][c] = 3
                    
                    # Diagonal contacts trigger transformation
                    diagonal_offsets = [
                        (-1, -1), (-1, 1), (1, -1), (1, 1), (0, -1), (0, 1)
                    ]
                    has_diagonal = False
                    for dr, dc in diagonal_offsets:
                        nr, nc = r + dr, c + dc
                        if 0 <= nr < R and 0 <= nc < C:
                            if curr[nr][nc] == 1:
                                has_diagonal = True
                    if has_diagonal:
                        curr[r][c] = 3
        return curr

    @staticmethod
    def mirror_horizontal(grid):
        """Mirrors the grid horizontally."""
        return grid[::-1]

    @staticmethod
    def mirror_vertical(grid):
        """Mirrors the grid vertically."""
        return [row[::-1] for row in grid]

    @staticmethod
    def mirror_pivot(grid, pivot_color=4):
        """Mirrors across an offset vertical column (yellow line, pivot value 4)."""
        R = len(grid)
        C = len(grid[0])
        curr = [row[:] for row in grid]
        pivot_c = -1
        for r in range(R):
            for c in range(C):
                if curr[r][c] == pivot_color:
                    pivot_c = c
                    break
            if pivot_c != -1:
                break
        
        if pivot_c != -1:
            for r in range(R):
                for offset in range(1, C):
                    left_c = pivot_c - offset
                    right_c = pivot_c + offset
                    if left_c >= 0 and right_c < C:
                        if grid[r][left_c] != 0:
                            curr[r][right_c] = grid[r][left_c]
        return curr

    @staticmethod
    def rotate_90(grid):
        """Rotates the grid 90 degrees clockwise."""
        return [list(x) for x in zip(*grid[::-1])]


def evaluate_fitness(candidate, target):
    """Calculates cell-by-cell mismatch score. Lower is better."""
    R1, C1 = len(candidate), len(candidate[0])
    R2, C2 = len(target), len(target[0])
    if R1 != R2 or C1 != C2:
        return 9999
    
    mismatch = 0
    for r in range(R1):
        for c in range(C1):
            if candidate[r][c] != target[r][c]:
                mismatch += 1
    return mismatch


def run_beam_search(input_grid, target_grid, beam_width=8, max_depth=5):
    """Explores compositions of operators to find a solution."""
    operators = [
        {"name": "Gravity", "func": ARCOperators.apply_gravity},
        {"name": "Mirror-H", "func": ARCOperators.mirror_horizontal},
        {"name": "Mirror-V", "func": ARCOperators.mirror_vertical},
        {"name": "Mirror-Pivot", "func": ARCOperators.mirror_pivot},
        {"name": "Rotate-90", "func": ARCOperators.rotate_90}
    ]

    # Node: (grid, path, fitness_score)
    initial_score = evaluate_fitness(input_grid, target_grid)
    beam = [(input_grid, [], initial_score)]

    for depth in range(max_depth):
        # Quick exit if we hit exact match
        perfect = [node for node in beam if node[2] == 0]
        if perfect:
            return perfect[0][1], perfect[0][0], True

        candidates = []
        for current_grid, path, _ in beam:
            for op in operators:
                try:
                    next_grid = op["func"](current_grid)
                    score = evaluate_fitness(next_grid, target_grid)
                    candidates.append((next_grid, path + [op["name"]], score))
                except Exception:
                    pass

        if not candidates:
            break

        # Sort by fitness (lower is better) and select top width
        candidates.sort(key=lambda x: x[2])
        
        # Deduplicate states in beam
        seen = set()
        next_beam = []
        for item in candidates:
            grid_str = json.dumps(item[0])
            if grid_str not in seen:
                seen.add(grid_str)
                next_beam.append(item)
                if len(next_beam) >= beam_width:
                    break
        beam = next_beam

    beam.sort(key=lambda x: x[2])
    return beam[0][1], beam[0][0], (beam[0][2] == 0)


def solve_task(task_data):
    """Loops through task's train pairs to find winning operator sequence, then applies to test input."""
    # Find sequence that solves all training cases
    best_sequence = []
    found_sequence = False
    
    # We test single-operator or sequential beam search on the first train pair
    first_train = task_data["train"][0]
    path, _, success = run_beam_search(first_train["input"], first_train["output"])
    
    if success:
        best_sequence = path
        found_sequence = True

    # Run on test input
    test_input = task_data["test"][0]["input"]
    current_grid = test_input
    
    if found_sequence:
        for op_name in best_sequence:
            if op_name == "Gravity":
                current_grid = ARCOperators.apply_gravity(current_grid)
            elif op_name == "Mirror-H":
                current_grid = ARCOperators.mirror_horizontal(current_grid)
            elif op_name == "Mirror-V":
                current_grid = ARCOperators.mirror_vertical(current_grid)
            elif op_name == "Mirror-Pivot":
                current_grid = ARCOperators.mirror_pivot(current_grid)
            elif op_name == "Rotate-90":
                current_grid = ARCOperators.rotate_90(current_grid)

    return current_grid


if __name__ == "__main__":
    print("[Kaggle Offline Solver] Standalone validation check...")
    sample_task = {
        "train": [{
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
        }],
        "test": [{
            "input": [
                [0, 1, 0, 0, 0],
                [0, 0, 0, 1, 0],
                [0, 2, 0, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 2, 0, 0]
            ]
        }]
    }
    
    result = solve_task(sample_task)
    formatted = "\n".join(str(row) for row in result)
    print(f"Inference complete! Test output grid:\n{formatted}")
