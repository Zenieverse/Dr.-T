# Kaggle Gemma 4 Developer Agent Competition Harness Specification

## Overview

This document specifies the interface, constraints, and execution requirements for the **Google - The Gemma 4 Developer Agent Competition** test harness.

All competition submissions are evaluated in an automated sandbox environment running target software engineering benchmarks across heterogeneous multi-language repositories.

---

## 1. Submission Package Format

The submission must be packaged as a single ZIP archive (`submission.zip`).
The root of the ZIP archive **MUST** contain `agent.yaml`. No enclosing top-level folder is permitted.

### Required Directory Structure:
```text
submission.zip
├── agent.yaml                 # Agent manifest (REQUIRED at root)
├── prompts/
│   ├── system.md              # Primary system prompt & methodology
│   └── analyzer.md            # Subagent localization & evidence prompt
├── skills/
│   └── lifeweave/
│       └── SKILL.md           # Domain skill instructions & protocols
└── configs/
    └── sampling.yaml          # Model inference sampling parameters
```

---

## 2. Target Model Architecture

The official competition benchmark model target is:
```yaml
model: gemma-4-31b-it-qat-w4a16-ct
```
* **Base Architecture:** Google Gemma 4 (31 Billion parameters)
* **Instruction Tuned:** `it`
* **Quantization Format:** `qat-w4a16-ct` (4-bit weight, 16-bit activation Quantization-Aware Training with compressed tensors)

---

## 3. Allowed Competition Tools

The evaluation harness exposes **exactly nine (9)** tools. Submissions defining or calling unrecognized tools will fail verification:

| Tool Name | Arguments | Description |
| :--- | :--- | :--- |
| `run_command` | `command: string` | Run non-interactive shell commands (tests, builds, linter, git) |
| `read_file` | `path: string, start_line?: int, end_line?: int` | Inspect file contents with optional slice boundaries |
| `write_file` | `path: string, content: string` | Create a new file |
| `edit_file` | `path: string, target_content: string, replacement_content: string` | Make single contiguous replacement in existing file |
| `get_status` | *(none)* | Check time budget remaining and execution status |
| `submit_patch` | `summary: string` | Conclude task and submit the current repository state |
| `search_similar_code` | `query: string` | Semantic code search across codebase ASTs and symbols |
| `get_code_neighbors` | `symbol: string \| node_id: string` | Discover callers, callees, and import relationships |
| `get_code_subgraph` | `node_ids: string[]` | Retrieve topological subgraph connecting candidate nodes |

---

## 4. Sampling Configuration (`configs/sampling.yaml`)

Supported sampling hyperparameters:
* `temperature`: float in range `[0.0, 1.0]` (Recommended: `0.1` to `0.3` for deterministic engineering reasoning)
* `top_p`: float in range `[0.1, 1.0]` (Recommended: `0.85` to `0.95`)
* `max_output_tokens`: integer in range `[512, 16384]` (Default: `8192`)

Unsupported or custom fields must not be included.

---

## 5. Harness Execution & Verification Lifecycle

The evaluation harness invokes the agent per task under the following execution lifecycle:
1. **Repository Mount:** Target repository checked out at clean commit state.
2. **Task Ingestion:** Harness feeds issue description, reproduction script path, and test command.
3. **Agent Loop:**
   - Agent perceives context via prompts and tools.
   - 12-hour wall-clock execution ceiling per task.
4. **Validation Gate:**
   - Harness verifies exit code of reproduction tests.
   - Harness verifies non-regression across repository test suite.
   - Harness checks diff minimality (smallest patch restoring invariant).
5. **Submission Ingestion:** Agent invokes `submit_patch`.

---

## 6. Manifest Validation Rules (`agent.yaml`)

Every submission is strictly validated by the harness before execution:
1. `agent.yaml` must exist at the archive root.
2. `model` must equal `gemma-4-31b-it-qat-w4a16-ct`.
3. All listed `tools` must belong to the 9 sanctioned competition tools.
4. All referenced prompt, skill, and config file paths must exist within the archive.
5. No extraneous execution scripts or unverified binary blobs may execute outside the sanctioned tool harness.
