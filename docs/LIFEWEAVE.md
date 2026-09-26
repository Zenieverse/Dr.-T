# LIFEWEAVE: Evidence-Guided Autonomous Software Engineering

> **Map the code. Gather the evidence. Test the hypothesis. Make the smallest safe change.**

---

## 1. What is LIFEWEAVE?

**LIFEWEAVE** is an integrated developer-intelligence and autonomous software-engineering workspace for the Dr. T platform. Rather than reacting blindly to error messages or jumping from vector search to code editing, LIFEWEAVE establishes an empirical scientific methodology for software repair:

```text
Map → Hypothesize → Gather Evidence → Assess Uncertainty → Patch → Validate → Learn → Reconsider
```

---

## 2. Why Evidence-Guided Engineering?

Standard AI code generation models suffer from common systemic pathologies:
1. **Confirmation Bias:** Looking only for code that matches the prompt and ignoring existing handlers.
2. **Refactoring Bloat:** Making large, unnecessary modifications that break unrelated invariants.
3. **Hallucinated Fixes:** Proposing fixes without checking whether the code path was actually executed.

LIFEWEAVE introduces the **Evidence Hierarchy**:
```text
Observed executable behavior
        ↓
Observed source behavior
        ↓
Test relationships
        ↓
Code graph relationships
        ↓
Semantic similarity
        ↓
Assumptions (never treated as evidence)
```

---

## 3. The Evidence Field & Contradiction Modeling

Every candidate localization point in the repository maintains an **Evidence Field** evaluated across 8 empirical dimensions:
* **Semantic relevance (0.00 – 1.00):** Vector similarity with issue vocabulary.
* **Structural relevance (0.00 – 1.00):** Position in AST hierarchy.
* **Dependency relevance (0.00 – 1.00):** Caller and callee coupling.
* **Test relevance (0.00 – 1.00):** Association with affected test assertions.
* **Behavioral relevance (0.00 – 1.00):** Presence in stack frames or execution traces.
* **Issue clue relevance (0.00 – 1.00):** Exact identifier matches to error messages.
* **Contradiction (0.00 – 1.00):** Data indicating this location is *not* the defect origin.
* **Uncertainty (0.00 – 1.00):** Remaining epistemic doubt.

> **Principle:** If data is unavailable, LIFEWEAVE explicitly records **Unknown** rather than fabricating numbers.

---

## 4. Protecting Health-Critical Dr. T Logic

LIFEWEAVE is a software engineering tool, **never** an autonomous clinical decision-maker.

When a proposed change touches:
* Clinical reasoning algorithms (`src/health/safetyEngine.ts`, `src/health/reasoningGuardrail.ts`)
* Medical advice or drug-nutrient interactions
* Patient data privacy or HIPAA scrubbing rules
* Health risk classification (RED / ORANGE / YELLOW / GREEN)

It is immediately flagged as:

```text
HIGH-IMPACT / HUMAN REVIEW REQUIRED
```

Autonomous merging and deployment are **permanently disabled**. Explicit developer and attending clinical review are mandatory before application.

---

## 5. Adaptive Evidence Acquisition

Before changing code, LIFEWEAVE asks:
> *"What evidence would most reduce uncertainty about the correct repair?"*

Actions are prioritized using the experimental heuristic:
$$\text{Priority} = \frac{\text{EvidenceValue} \times \text{InformationGain} \times \text{StructuralRelevance}}{\text{Cost} + \text{Uncertainty} + \varepsilon}$$

---

## 6. The 4 Specialized Agent Roles

1. **Orchestrator:** Coordinates investigation state, uncertainty budget, and active workflow step.
2. **Locator:** Traverses semantic indices, AST imports, and caller/callee graphs.
3. **Analyst:** Computes the Evidence Field, evaluates competing hypotheses, and surfaces contradictions.
4. **Patcher / Validator:** Formulates the minimal patch, verifies system invariants, executes test suites, and handles failure recovery.

---

## 7. Kaggle Gemma 4 Competition Export

LIFEWEAVE is designed to export directly into the Gemma 4 Developer Agent competition format:
* **Target Model:** `gemma-4-31b-it-qat-w4a16-ct`
* **Package Structure:**
  ```text
  submission.zip
  ├── agent.yaml
  ├── prompts/
  │   ├── system.md
  │   └── analyzer.md
  ├── skills/
  │   └── lifeweave/
  │       └── SKILL.md
  └── configs/
      └── sampling.yaml
  ```
