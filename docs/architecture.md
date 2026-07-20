# ARC-AGI-3 Hybrid Generalization Architecture

This folder documents the separation of concerns between our development-time interactive workspace and our high-performance offline solver engine designed for Kaggle.

---

## 1. Directory Structure

```text
GitHub
│
├── apps/
│   ├── drt-web/                 ← React/Vite UI Dashboard
│   └── sandbox/                 ← Interactive visual grid playground
│
├── packages/
│   ├── fluid-core/              ← Orchestrator (formulateHypothesis + runBeamSearch + validate)
│   ├── heuristics/              ← Fitness evaluation, symmetry scoring, color frequency distance
│   ├── reasoning/               ← Spatial invariant rule generators, inductive premise formulators
│   ├── operators/               ← Categorized modular Operator Library (Movement, Geometry, Topology...)
│   ├── search/                  ← Heuristic Graph Explorers (Beam Search, simulated MCTS)
│   └── common/                  ← Core interfaces, cloned grids, accuracy scoring metrics
│
├── kaggle/
│   ├── notebook.ipynb           ← Lightweight Kaggle offline runner notebook
│   ├── inference.py             ← Clean, offline python solver (independent of APIs/Vite)
│   └── export_submission.py     ← Formats predictions to standard Kaggle `submission.json`
│
└── docs/
    └── architecture.md          ← (This file) Architectural Blueprint
```

---

## 2. Core Separation of Concerns

### A. Inference Pipeline (Kaggle Scoring)
The solver runs entirely offline in a sandboxed container. It depends strictly on:
1. **Task Loading**: Reading the unseen grid dimensions.
2. **Feature Extraction & Object Isolation**: Decomposing grids into independent blocks.
3. **Operator Heuristic Search**: Running Beam Search or Monte Carlo Tree Search to compose operators from our library.
4. **Validation**: Finding the optimal sequence of transformations on the training pairs before predicting test outputs.

```text
Task Grid -> Object Extraction -> Graph Search -> Validation Check -> Prediction Output
```

### B. Explanation Pipeline (Dr. T Socratic Guidance)
The visual styling and empathetic narrative are processed **independently**.
- **Production Execution**: The explanation layer is bypassed completely to maximize GPU/CPU execution speed and satisfy strict timeout budgets (9-hour runtime limits on Kaggle).
- **Development-Time Workspace**: Runs inside our React UI to provide researchers with rich, interactive Socratic logs and explanation cards.

---

## 3. Development-Time Gemini Support
Gemini is treated strictly as an **offline developer-time advisor**. It helps:
1. Suggest new grid operators for inclusion.
2. Formulate and critique failed hypotheses during dry-runs.
3. Generate synthetic ARC tasks to train our search weights.
4. Synthesize human-scannable explanations of composed rules.
