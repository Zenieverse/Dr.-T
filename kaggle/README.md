# Kaggle ARC-AGI Offline Inference Package (ARC Prize 2026)

This directory contains a **zero-dependency, 100% offline-ready symbolic reasoning engine** extracted from the Dr. T Fluid Core workspace, pre-packaged for execution inside a locked-down Kaggle Notebook with internet disabled.

---

## 📂 Architecture & Directory Layout

```
kaggle/
├── README.md               # This documentation file
├── requirements.txt        # Package configuration (Zero external dependencies)
├── objects.py              # Connected component (BFS) and topological feature extraction
├── operators.py            # Standalone pure deterministic symbolic grid operators
├── search.py               # Prioritized heuristic Beam Search state space explorer
├── inference.py            # Task-level verification loop and multi-pair training validation
├── export_submission.py    # Competition submission package formatter (submission.json)
└── tests/
    ├── __init__.py
    └── test_suite.py       # Automated regression tests validating 100% solver accuracy
```

---

## 🛠️ Solver Pipeline

The offline reasoning pipeline is split into distinct modular phases for maximum maintainability:

```
Task JSON Data
      ↓
Object Extraction (objects.py)  ──→ Extracts topological priors (symmetry, holes, centroids)
      ↓
Prioritized Search Space (search.py) ──→ Adaptive weighting of candidate mutators
      ↓
Verification Loop (inference.py) ──→ Solves Train[0], verifies compatibility on rest of Train
      ↓
Execution (operators.py) ─────────→ Transforms Test input using the verified sequence
      ↓
Submission Export (export_submission.py) ──→ Produces competition-compliant submission.json
```

1. **Object Extraction & Feature Analysis (`objects.py`)**:
   - Implements a fast Breadth-First Search (BFS) component segmentation algorithm.
   - Computes local bounding box symmetry, centroids, area, orientation, and enclosed hole detection (via exterior-padded flood fills).

2. **Heuristic Beam Search (`search.py`)**:
   - Searches for composition sequences of grid-transforming operators.
   - Features **Learned Priors & Feature-Based Biases**: dynamically boosts the prior weight of relevant operators (e.g., boosting *Gravity* when a downward-empty pattern is detected, or *Mirror* when high baseline symmetry is measured).
   - Utilizes global visited-state caches (`SHA-256` equivalent stringified-grid hashing) to prevent cyclic or redundant state expansions.

3. **Symbolic Operator Library (`operators.py`)**:
   - High-fidelity deterministic symbolic operators, written in stateless, pure Python:
     - **Movement/Gravity**: Downward falling particles that trigger colored phase transforms upon diagonal anchor support.
     - **Reflection/Pivot**: Mirrors the grid across a custom color-defined coordinate pivot.
     - **Symmetry/Geometry**: Horizontal and vertical reflections, along with 90°, 180°, and 270° clockwise grid rotations.
     - **Topology/Flood Fill**: Enclosed boundary 4-way flood filling.
     - **Color Replacement**: Global value substitution.

4. **Kaggle-ready Integration (`inference.py` & `export_submission.py`)**:
   - Exposes `solve_task(task_data)` which searches for a program solving `train[0]`, programmatically verifies the found sequence across all other training pairs to ensure zero over-fitting, and applies the validated program sequence to the unseen `test` grids.

---

## 🚀 How to Run locally

### Run Automated Unit & Regression Tests
To run the standard python test suite to verify all operators and task generalizations:
```bash
python3 -m unittest kaggle.tests.test_suite
# Or run the script directly:
python3 kaggle/tests/test_suite.py
```

### Format a Submission
```bash
python3 kaggle/export_submission.py
```

---

## 📓 Kaggle Notebook Integration

To use this solver inside a Kaggle Notebook, upload these python files to your Kaggle Notebook resources or copy-paste them into your notebook script.

### 1. Load ARC Tasks & Run Inference
```python
import json
from inference import solve_task
from export_submission import export_submission

# Load the public task corpus (e.g. from /kaggle/input/arc-prize-2026/arc-agi_test_challenges.json)
with open("arc-agi_test_challenges.json", "r") as f:
    challenges = json.load(f)

predictions = {}
for task_id, task_data in challenges.items():
    # solve_task handles the entire pipeline: object detection, beam search, and validation
    predicted_grid = solve_task(task_data)
    
    if predicted_grid is not None:
        predictions[task_id] = predicted_grid
    else:
        # Fallback to empty grid if unsolvable
        predictions[task_id] = task_data["test"][0]["input"]

# Export in standard submission.json format
export_submission(predictions, "submission.json")
```
