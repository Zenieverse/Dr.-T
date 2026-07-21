#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
@license: SPDX-License-Identifier: Apache-2.0
@description: Standalone modular inference pipeline for Kaggle ARC-AGI-3 offline execution.
"""

import sys
import json
import os

# Ensure search path includes the current directory for direct imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from operators import (
    apply_gravity, mirror_grid, mirror_pivot, rotate_grid,
    slide_color, flood_fill, replace_color
)
from search import run_beam_search, apply_flood_fill_fallback

OP_MAP = {
    'Gravity': lambda g: apply_gravity(g, 2),
    'Mirror-H': lambda g: mirror_grid(g, 'horizontal'),
    'Mirror-V': lambda g: mirror_grid(g, 'vertical'),
    'Mirror-Pivot': lambda g: mirror_pivot(g, 4),
    'Rotate-90': lambda g: rotate_grid(g, 90),
    'Rotate-180': lambda g: rotate_grid(g, 180),
    'Rotate-270': lambda g: rotate_grid(g, 270),
    'Slide-Right': lambda g: slide_color(g, 1, 0, 1),
    'Slide-Left': lambda g: slide_color(g, 1, 0, -1),
    'Slide-Down': lambda g: slide_color(g, 1, 1, 0),
    'FloodFill': apply_flood_fill_fallback,
    'ColorReplace': lambda g: replace_color(g, 1, 8)
}

def solve_task(task_data):
    """
    Solves an ARC task by:
    1. Running beam search on the first training pair to find a sequence of operators.
    2. Verifying if that sequence correctly transforms all other training pairs.
    3. Applying the verified sequence to the test inputs.
    """
    if not task_data.get("train") or not task_data.get("test"):
        return None

    first_train = task_data["train"][0]
    search_res = run_beam_search(first_train["input"], first_train["output"])
    
    best_sequence = []
    found_sequence = False
    
    if search_res["success"]:
        candidate_path = search_res["path"]
        all_train_passed = True
        
        # Verify correctness across the remaining training pairs
        for pair in task_data["train"][1:]:
            curr = [row[:] for row in pair["input"]]
            for op_name in candidate_path:
                if op_name in OP_MAP:
                    curr = OP_MAP[op_name](curr)
            if curr != pair["output"]:
                all_train_passed = False
                break
                
        if all_train_passed:
            best_sequence = candidate_path
            found_sequence = True
            
    # Apply to the first test input
    test_input = task_data["test"][0]["input"]
    current_grid = [row[:] for row in test_input]
    
    if found_sequence:
        for op_name in best_sequence:
            if op_name in OP_MAP:
                current_grid = OP_MAP[op_name](current_grid)
                
    return current_grid

if __name__ == "__main__":
    print("[Kaggle Offline Inference] Standalone pipeline validation...")
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
    print(f"Inference complete! Sample output grid:\n{formatted}")
