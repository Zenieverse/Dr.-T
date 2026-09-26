---
name: lifeweave
description: Evidence-guided repository reasoning, contradiction detection, graph-informed candidate localization, minimal patching, and failure recovery.
---

# LIFEWEAVE: Evidence-Guided Software Engineering Skill

Use this skill when investigating and resolving defects, feature bugs, and regressions across arbitrary software repositories.

---

## 1. The Evidence Hierarchy

When reasoning about defects or selecting candidate files, strictly rank information by its empirical reliability:

1. **Observed Executable Behavior:** Direct stdout/stderr from reproduction tests, exit codes, and live stack traces run via `run_command`.
2. **Test Assertions:** Existing test specifications, unit tests, and integration test assertions.
3. **Observed Source Logic:** Verified control flow, branch conditions, and return statements read via `read_file`.
4. **Code Graph Relationships:** Callers, callees, and type imports mapped via `get_code_neighbors` and `get_code_subgraph`.
5. **Semantic Similarity:** Code fragments retrieved via `search_similar_code`.
6. **Assumptions:** Unverified intuitions—never treat an assumption as factual evidence.

---

## 2. Candidate Localization Protocol

Never modify the first code search match. Follow this protocol:

1. **Discover Candidates:** Formulate search queries based on issue keywords, error messages, and domain entities. Execute `search_similar_code`.
2. **Form Candidate Set:** Identify 2 to 4 distinct candidates (e.g., input handler, core domain logic, downstream serializer, test file).
3. **Map Structural Context:** For top candidates, call `get_code_neighbors` to inspect:
   - Callers (who invokes this?)
   - Callees (what dependencies does it rely on?)
   - Imported types and utility modules
4. **Extract Focused Subgraph:** Call `get_code_subgraph` with top candidate identifiers to observe how they connect.
5. **Inspect Source:** Read the exact implementation lines with `read_file`.

---

## 3. Hypothesis & Contradiction Protocol

Maintain competing explanations before editing:

### Formulating Hypotheses
* Formulate `H1` (primary hypothesis) and at least one alternative `H2` when uncertainty is non-trivial.
* Explicitly record supporting evidence (source lines, graph paths, reproduction output).

### Active Contradiction Search
Search for observations that invalidate `H1`:
- Is the suspected code bypassed by an early return?
- Does an upstream caller sanitize input before this component?
- Does a passing test already cover the exact condition?
- Is an unhandled exception caught and re-thrown elsewhere?

If contradiction is detected, decrement confidence, elevate `H2`, and do NOT patch the contradicted file.

---

## 4. Adaptive Evidence Acquisition

Before taking an expensive action, determine:
> *"What available tool call would most reduce uncertainty with the least cost?"*

Priority formula:
$$\text{Priority} = \frac{\text{InformationGain} \times \text{Relevance}}{\text{Cost} + \text{Uncertainty}}$$

* Cheap: `read_file` around suspected lines, `get_code_neighbors`
* Moderate: `get_code_subgraph`, `search_similar_code`
* High Cost: full test suite execution, building the entire project

---

## 5. Minimal Patch & Invariant Enforcement

Before calling `edit_file`:
1. **Define the Invariant:** What existing system behavior must remain unchanged?
2. **Formulate the Minimal Delta:** Change only the lines necessary to satisfy the invariant.
3. **Safety Rules:**
   - No stylistic refactoring or code cleanup.
   - No renaming of unrelated variables or functions.
   - No dependency version bumps unless specifically requested by the issue.
   - Never weaken or remove assertions to force a test pass.
   - Never insert dummy `try/catch` blocks that swallow errors.

---

## 6. Validation & Failure Recovery

### Step 1: Targeted Validation
Run the single most specific reproduction test using `run_command`.

### Step 2: Failure Classification
If the test fails, classify the root cause before attempting another change:
* `WRONG_LOCALIZATION`: Code was changed in the wrong file or module.
* `WRONG_HYPOTHESIS`: Assumption about runtime behavior was incorrect.
* `INCOMPLETE_EVIDENCE`: Overlooked an edge case or secondary branch.
* `INCORRECT_PATCH`: Correct location, but logic error in fix.
* `REGRESSION`: Fix broke an invariant in neighboring code.
* `TEST_ENVIRONMENT`: Harness, mock, or environment configuration issue.

### Step 3: Recovery Action
- Re-read the failed test output.
- Re-evaluate competing hypothesis `H2`.
- Gather new evidence rather than repeating variations of the failed patch.
- Re-validate until all tests pass.

---

## 7. Patch Submission

Only after both targeted tests and relevant regression tests pass cleanly:
1. Verify git status / clean diff.
2. Call `submit_patch` with a concise, factual summary of the invariant restored.
