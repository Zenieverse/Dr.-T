---
name: lifeweave
description: Evidence-guided repository reasoning, code graph navigation, competing hypothesis comparison, contradiction detection, adaptive evidence acquisition, minimal patching, targeted validation, failure recovery, and budget awareness.
---

# LIFEWEAVE: Evidence-Guided Software Engineering Skill

Use this skill to navigate, localize, verify, and resolve software engineering issues across arbitrary codebases.

---

## 1. Evidence-First Localization

Rank every observation strictly according to the Evidence Hierarchy:
```text
1. Observed Executable Behavior: Direct stdout/stderr from reproduction tests, exit codes, and live stack traces run via run_command.
2. Observed Source Logic: Verified control flow, branch conditions, and return statements read via read_file.
3. Test Assertions: Existing unit tests, integration assertions, and regression boundaries.
4. Code Graph Relationships: Callers, callees, and type dependencies mapped via get_code_neighbors and get_code_subgraph.
5. Semantic Similarity: Text and vector matches retrieved via search_similar_code.
6. Assumptions: Never treat unverified intuitions or assumptions as evidence.
```

---

## 2. Graph Navigation Protocol

To prevent context saturation, use graph tools to prune the search space:
1. **Semantic Seed:** Query `search_similar_code` with domain identifiers.
2. **Neighbor Expansion:** Query `get_code_neighbors` on the top 2–4 candidates to inspect caller/callee fan-in and fan-out.
3. **Subgraph Extraction:** Query `get_code_subgraph` with candidate node IDs to trace data and control paths between callers, targets, and tests.
4. **Focused Source Inspection:** Read only the relevant line slice with `read_file(path, start_line, end_line)`.

---

## 3. Hypothesis Comparison, Contradiction Tracking & Candidate Verification Gate

Always construct competing explanations before editing:
* Formulate `H1` (primary candidate) and `H2` (alternative candidate).
* For each hypothesis, actively search for **contradictory evidence**:
  - Is the suspected function bypassed by an early return?
  - Does an upstream caller normalize or sanitize the data first?
  - Does an existing unit test for this function pass?
  - Does another module independently trigger the same failure?
* If contradictory evidence is found, decrement hypothesis confidence and shift focus to alternatives. Never patch a contradicted file.

### Candidate Verification Gate (5 Invariants):
Before selecting a candidate as the primary patch target, verify:
1. **Reachability:** Candidate is on the active failing execution path.
2. **Activity:** Candidate has active callers and imports (not dead/legacy code).
3. **Implication:** Direct test failure or trace implicates the candidate logic.
4. **Contradiction:** No contradictory evidence indicates candidate is a downstream victim.
5. **Causal Hierarchy:** Fix the defect at the upstream source rather than masking symptoms downstream.

---

## 4. Adaptive Evidence Acquisition

Evaluate prospective actions with the search heuristic:
$$\text{Priority}(v) = \frac{\text{Evidence}(v) \times \text{InformationGain}(v) \times \text{StructuralCentrality}(v)}{\text{Cost}(v) + \text{Uncertainty}(v) + \varepsilon}$$

*Practical heuristic guidance:*
* Prefer cheap, high-information queries (e.g., targeted `read_file` around line numbers in trace, `get_code_neighbors`).
* Use moderate-cost actions next (e.g., `get_code_subgraph`, running a focused test).
* Avoid repeated low-value queries or full-repository scans.

---

## 5. Minimal Patching & Invariant Enforcement

Before calling `edit_file`:
1. **Target:** Identify the exact file and minimal line range.
2. **Invariant:** Define what existing system behaviors must remain intact.
3. **Minimal Delta:** Change only the lines strictly necessary to restore the invariant.
4. **Restraint:**
   - No stylistic refactoring or code cleanup.
   - No renaming of unrelated variables or functions.
   - No dependency version bumps unless specifically requested.
   - Never weaken test assertions or delete tests to force a pass.
   - Never swallow errors with empty catch blocks.

---

## 6. Targeted Validation & Failure Recovery

### Targeted Validation Loop:
1. Run the smallest existing reproduction test via `run_command`.
2. Verify exit code equals 0 and assertions pass.
3. Run neighboring regression tests to ensure no unintended side effects.

### Failure Recovery Protocol:
If validation fails, **DO NOT re-edit the same file with the same assumption**.
1. **Classify failure:**
   - `WRONG_LOCALIZATION`: Bug is in a caller, callee, or config.
   - `WRONG_HYPOTHESIS`: Assumption about runtime behavior was invalid.
   - `INCOMPLETE_EVIDENCE`: Overlooked an edge case or secondary branch.
   - `INCORRECT_PATCH`: Correct location, but logic error in fix.
   - `REGRESSION`: Fix broke an invariant in neighboring code.
   - `TEST_ENVIRONMENT`: Harness, mock, or environment configuration issue.
   - `DEPENDENCY`: External package behavior differs from assumption.
   - `CONFIGURATION`: Build flag, environment variable, or config file mismatch.
2. Formulate alternative hypothesis `H2`.
3. Gather new evidence targeting the discrepancy.
4. Formulate a new minimal patch and revalidate.

---

## 7. Budget Awareness

* Maintain continuous awareness of the 12-hour task budget.
* Call `get_status` periodically to monitor elapsed execution time.
* Cease tool calls and submit promptly via `submit_patch` once tests pass and invariants hold.
