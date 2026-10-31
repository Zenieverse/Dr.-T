# 🏮 Lantern Keeper — A Personal AI That Remembers With Permission
### Featuring Three Hats — Professional, Personal & Social Life Balance

[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)
[![NVIDIA Nemotron](https://img.shields.io/badge/NVIDIA%20Nemotron-Open--Source-76B900.svg)](https://build.nvidia.com)
[![Nebius Token Factory](https://img.shields.io/badge/Nebius-Token%20Factory%20API-6366f1.svg)](https://tokenfactory.nebius.com)
[![Gemma 2](https://img.shields.io/badge/Open--Weight%20AI-Gemma%202-blue.svg)](https://ai.google.dev/gemma)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://react.dev/)

> **A real, working Personal AI that preserves family memories, retrieves authorized facts with exact source citations, executes reusable personal skills under strict permission control, and balances roles across Professional, Personal, and Social life domains.**

---

## 🌟 The Vision: Personal AI With Permission

Most AI assistants either claim to know everything about you (surreptitiously scraping background context) or pretend to channel synthetic personas.

**Lantern Keeper takes a radically different approach:**
1. **User-Owned Memory Sanctuary**: Your memories, traditions, heirloom recipes, and life lessons belong to you.
2. **Evidence-Backed Retrieval**: Answers are grounded strictly in your authorized memories. Exact excerpts and source citations are shown with every response.
3. **Zero Fabrication**: Lantern Keeper explicitly notes missing or conflicting facts instead of inventing biographical details or quotes.
4. **Permission-Controlled Actions**: Consequential tasks require an explicit Permission Manifest approval before execution.
5. **NVIDIA Nemotron on Nebius Token Factory**: Powered by state-of-the-art open-source NVIDIA Nemotron models served on Nebius Token Factory high-performance infrastructure, with graceful deterministic fallback.
6. **Three Hats Role Balance**: Role-mapping across Professional, Personal, and Social life domains—anchored in the core statement:
   > *“I am more than any single role I play.”*

---

## 🏗️ Architecture & Three Core Capabilities

### 1. Evidence-Backed Memory Retrieval
* **Authorized Scoping**: Queries only access memories the user has explicitly authorized (`revokedAt === null`).
* **Source Citations**: Returns exact excerpts, relevance scores, and people remembered.
* **Gap Identification**: Transparently notes missing facts (e.g. absent dates or intentionally omitted private credentials) rather than guessing.
* **Deterministic Fallback Engine**: If live inference is offline, a deterministic heuristic engine synthesizes factual responses truthfully.

### 2. Reusable Personal Skills
* **Family Story Keeper**: Synthesizes editable narrative drafts from selected memories while preserving verbatim recipes, proverbs, and timestamps.
* **Weekly Life Review**: Audits mapped commitments across your Three Hats and prepares an actionable, realistic checklist.
* **Memory Inspector**: Inspects raw record provenance, tests permission revocation, and audits permanent deletion.
* **Three Hats Companion**: AI reflection assistant citing user inputs, noticing competing roles, and offering gentle options without psychological diagnosis.

### 3. Permission-Controlled Actions
* **Server-Side Tool Allowlist**: Enforces an explicit allowlist (`family_story_keeper`, `weekly_life_review`, `memory_inspector`, `three_hats_companion`, `role_reflection_keeper`).
* **Consequential Action Gate**: Shows a Permission Manifest before execution and requests explicit user approval.
* **Privacy-Preserving Audit Trail**: Records action approvals/executions in an immutable audit ledger without logging private memory bodies.

---

## 🤖 Nebius Token Factory & NVIDIA Integration

* **Service**: Nebius Token Factory (`https://api.tokenfactory.nebius.com/v1/chat/completions`)
* **Primary NVIDIA Model**: `nvidia/llama-3.1-nemotron-70b-instruct`
* **Supported Models**: `nvidia/nemotron-mini-4b-instruct`, `nvidia/nemotron-4-340b-instruct`
* **Local Alternative**: Local Ollama with `gemma2:2b` or hosted open-weight endpoints.
* **Truthful Provider Labeling**:
  - `● Live Nebius Token Factory` when active.
  - `○ Standby (Deterministic Engine Active)` when unconfigured.

### Environment Configuration

Configure server environment variables in `.env` (never exposed to client bundles or git):

```bash
# Nebius Token Factory API Key (Required for live NVIDIA Nemotron inference)
NEBIUS_API_KEY=your_nebius_token_factory_key_here
NEBIUS_BASE_URL=https://api.tokenfactory.nebius.com/v1
NEBIUS_MODEL_ID=nvidia/llama-3.1-nemotron-70b-instruct

# Optional: Local Ollama Fallback
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=gemma2:2b

# Optional: Hosted Gemma Open-Weight
GEMMA_API_BASE_URL=
GEMMA_API_KEY=
```

---

## 🎩 Three Hats — Professional, Personal & Social

* **Person**: The individual using the platform.
* **Hat**: A broad life domain — Professional, Personal, or Social.
* **Role**: A capacity or responsibility the person occupies (e.g., Team Member, Lifelong Learner, Caretaker of Wellbeing, Community Volunteer).
* **Commitment**: Something actionable the person wants or needs to do.
* **Value**: The principle giving the role meaning.
* **Action**: A practical next step.

### 3-Perspective Role Balance Model
Rather than imposing an arbitrary "33% third" formula or a fake single "life score", Three Hats provides three independent user-rated perspectives:
1. **Importance**: How much does this hat matter to me now?
2. **Attention**: How much time/focus have I recorded for it?
3. **Satisfaction**: How satisfied am I with this area of life?

### 6-Step Weekly Ritual
1. **Recognize**: What felt meaningful this week?
2. **Review**: Which roles received intended attention?
3. **Notice**: Where did you experience conflicts between roles, time, or energy?
4. **Appreciate**: What went well, including something small?
5. **Choose**: What is one realistic adjustment for next week?
6. **Commit**: Select up to three next actions.
7. **Lantern Keeper Sync**: Save the reflection as a private memory with explicit user permission.

---

## 🧪 Automated Verification & Quality Gates

Run the test suite:

```bash
# Run parent integration verification (62 automated assertions)
npx tsx scripts/test-memory-lantern.ts

# Run standalone package verification (18 automated assertions)
npx tsx memory-lantern/test-memory-lantern.ts

# Full platform test suite
npm test
```

### Verified Assertions:
* ✅ Fictional sample data integrity & public safety flags.
* ✅ Evidence-backed retrieval precision and source correctness.
* ✅ Absence of hallucinations & explicit missing-fact detection.
* ✅ Permission revocation: revoked memories immediately excluded from AI retrieval.
* ✅ Server-side tool allowlist & consequential approval enforcement.
* ✅ Consequential action audit trail without private memory content leakage.
* ✅ Nebius Token Factory diagnostics & NVIDIA Nemotron contracts.
* ✅ Three Hats role hierarchy, multi-hat roles, and weekly ritual steps.
* ✅ TypeScript compilation (`tsc --noEmit`) passes with 0 errors.

---

## ⚖️ Ethical Invariants & License

* **Zero Persona Imitation**: Never speaks from the voice of a deceased person.
* **Zero Necromancy**: Never claims supernatural communication.
* **Zero Medical Diagnosis**: Never diagnoses mental health conditions or claims to dictate human identity.
* **User Permission**: Requires approval before consequential tool execution or persistent storage.
* **License**: MIT License (Permissive Open Source).
