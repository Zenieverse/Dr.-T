#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
@license: SPDX-License-Identifier: Apache-2.0
@description: Helper script to package and export solutions to Kaggle submission format.
"""

import os
import json

def format_prediction(prediction_grid):
    """Ensures prediction is structured properly as list of lists of integers."""
    return [[int(val) for val in row] for row in prediction_grid]

def export_submission(predictions, output_path="submission.json"):
    """
    Saves a dictionary of predictions to the target path.
    predictions format: { "task_id": [{"attempt_1": [...], "attempt_2": [...]}] }
    """
    submission = {}
    for task_id, pred_grid in predictions.items():
        submission[task_id] = [
            {
                "attempt_1": format_prediction(pred_grid),
                "attempt_2": format_prediction(pred_grid) # Fallback attempt is identical
            }
        ]
        
    with open(output_path, "w") as f:
        json.dump(submission, f, indent=2)
        
    print(f"✅ Successfully exported {len(predictions)} predictions to {output_path}!")

if __name__ == "__main__":
    dummy_preds = {
        "007dbb9a": [[0, 0, 0], [0, 1, 0], [0, 0, 0]]
    }
    export_submission(dummy_preds)
