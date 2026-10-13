# Project: LIFEWEAVE — Evidence-Guided Software Engineering Agent

**Competition Entry:** Google — The Gemma 4 Developer Agent Competition  
**Target Model:** `gemma-4-31b-it-qat-w4a16-ct`  
**Package:** `submission.zip` (`LIFEWEAVE_OPTIMIZED_V1`)  
**SHA-256:** `cbcc8e59b7e0329c48f08169027df6341f3ea0039638a61e8011de1570075a12`  

---

## 🎯 Core Idea

> **"Map the code. Gather the evidence. Test the hypothesis. Make the smallest safe change."**

Standard autonomous software engineering agents frequently fail because they treat bug localization as a pure semantic search problem, jumping directly from keyword similarity to code editing. This leads to common pathologies:
1. **Confirmation Bias:** Patching the first function that looks relevant while ignoring upstream originators.
2. **Symptom Masking:** Adding guards at downstream failure points rather than repairing root-cause invariants.
3. **Refactoring Bloat:** Introducing large speculative edits that break unrelated system behaviors.

**LIFEWEAVE** introduces an empirical, evidence-guided scientific methodology to autonomous repository repair:
```text
ORIENT → MAP → LOCATE → GATHER EVIDENCE → HYPOTHESIZE → PLAN → PATCH → VALIDATE → RECOVER
```

---

## 🧠 Architectural Pillars

### 1. Semantic & Structural Code Localization
LIFEWEAVE initiates search by combining lexical and semantic queries (`search_similar_code`) with topological code graph navigation (`get_code_neighbors`, `get_code_subgraph`). Rather than dumping raw files into context, it extracts only candidate symbols, caller/callee fan-in/fan-out, and structural dependency paths.

### 2. Dependency & Test Evidence
Observations are prioritized strictly along the **Evidence Hierarchy**:
- *Observed Executable Behavior* (test stdout/stderr, exit codes) >
- *Observed Source Logic* (read code branches) >
- *Test Assertions* (existing suites) >
- *Code Graph Relationships* (callers/callees) >
- *Semantic Similarity* (vector matches) >
- *Assumptions* (never treated as evidence).

### 3. Supporting & Contradictory Evidence
For every defect hypothesis, LIFEWEAVE explicitly tracks both supporting and contradictory evidence. If a suspected module passes existing unit tests or is bypassed by an upstream guard, its confidence is immediately downgraded, preventing wasted edits on downstream victims.

### 4. Candidate Verification Gate (5 Invariants)
Before any candidate location is approved for patching, it must satisfy five rigorous criteria:
1. **Reachability:** Directly situated on the failing execution trace.
2. **Activity:** Actively imported and called in production code (not deprecated or dead code).
3. **Implication:** Directly implicated by failing tests or execution boundaries.
4. **Contradiction-Free:** Free of contradictory evidence indicating it is merely a symptom catcher.
5. **Upstream Causal Root:** Located at the causal origin rather than a superficial symptom boundary.

### 5. Causal Localization & Uncertainty Awareness
When evidence is missing, LIFEWEAVE explicitly records `UNKNOWN` rather than fabricating scores. It utilizes an adaptive search priority heuristic to acquire the single next piece of evidence that will most reduce epistemic uncertainty:
$$\text{Priority}(v) = \frac{\text{Evidence}(v) \times \text{InformationGain}(v) \times \text{StructuralCentrality}(v)}{\text{Cost}(v) + \text{Uncertainty}(v) + \varepsilon}$$

### 6. Minimal Patch Generation
Edits (`edit_file`) are constrained to single, contiguous, minimal replacements targeting only the violated invariant. Formatting rewrites, unrelated refactoring, and cosmetic cleanup are strictly prohibited.

### 7. Test-Driven Validation & Failure Recovery
Every patch is immediately validated against reproduction tests via `run_command`. If a validation test fails, the agent does not compound errors with further speculative edits—it reverts the change, incorporates the failure mode as new contradictory evidence, re-ranks competing hypotheses, and formulates an alternative repair plan.

---

## 📊 Optimization & Empirical Benchmark Results

During development, LIFEWEAVE was evaluated on a dedicated **ten-fixture repository benchmark** covering diverse failure modes: wrong function calls, downstream symptom traps, redirect security, boundary validation, configuration keys, version comparison, async job flushing, multi-file event emitters, misleading semantic matches, and recovery loops.

### Reported Benchmark Evolution:
* **Initial Benchmark (`LIFEWEAVE_BASELINE_V1`):**
  - Patch Pass Rate: **10/10 (100%)**
  - Localization Recall@1: **90%** (1 task selected a downstream symptom catcher first)
  - Localization Recall@3: **100%**
  - Localization Recall@5: **100%**
  - Total Tool Calls: **42**
  - Recovery Steps Required: **1**
* **Optimized Benchmark (`LIFEWEAVE_OPTIMIZED_V1`):**
  - Patch Pass Rate: **10/10 (100%)**
  - Localization Recall@1: **100%** (+10% improvement via Candidate Verification Gate)
  - Localization Recall@3: **100%**
  - Localization Recall@5: **100%**
  - Total Tool Calls: **38** (decreased from 42; 9.5% reduction in tool overhead)
  - Recovery Steps Required: **0** (eliminated downstream symptom trap)

### Empirical Evaluation Scope & Boundaries:
- **Verified Scope:** These measurements were obtained on the project's internal ten-fixture regression benchmark.
- **Unverified Scope:** Full competition-wide comparative ablations on unseen Kaggle benchmark problems remain **NOT RUN**.
- **No Overclaims:** Local fixture success does not guarantee specific leaderboard placement or general superiority over other competition entries.

---

## 📦 Package Manifest

The submission archive `submission.zip` contains exactly five files conforming to the official competition harness specification:
```text
submission.zip
├── agent.yaml                 # Root competition agent manifest (target: gemma-4-31b-it-qat-w4a16-ct)
├── configs/
│   └── sampling.yaml          # Inference parameters (temperature: 0.2, top_p: 0.9, max_tokens: 8192)
├── prompts/
│   ├── system.md              # 9-stage engineering loop and Evidence Hierarchy
│   └── analyzer.md            # Topological analyzer and Evidence Profile synthesis
└── skills/
    └── lifeweave/
        └── SKILL.md           # Domain skill instructions & Candidate Verification Gate
```
