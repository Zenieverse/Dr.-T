---
title: "Lantern Keeper — A Personal AI That Remembers With Permission: Featuring Three Hats Role-Mapping & NVIDIA Nemotron on Nebius Token Factory"
published: true
tags: devchallenge, personalai, nvidia, nebius, opensource, threehats
cover_image: https://raw.githubusercontent.com/Zenieverse/Dr.-T/main/public/lantern-keeper-banner.png
canonical_url: https://dev.to/zenieverse/lantern-keeper-personal-ai-with-permission
---

*This project upgrades the Memory Lantern foundation inside Dr. T into **Lantern Keeper — A Personal AI That Remembers With Permission**, powered by **NVIDIA Nemotron** open models on **Nebius Token Factory**, featuring the **Three Hats — Professional, Personal & Social** life-balance role mapper.*

---

## 1. The Human Problem: Personal AI With Permission

Most AI assistants either claim to know everything about you (surreptitiously scraping background context and private chats) or attempt to guess your thoughts.

**Lantern Keeper rejects intrusive surveillance and synthetic resurrection.**

Instead, we built **Lantern Keeper** as a personal AI that remembers strictly with explicit permission:
* **Evidence-Backed Memory Retrieval**: Answers are grounded strictly in your authorized memories. Exact excerpts, relevance scores, and source citations are shown with every answer.
* **Explicit Gap Identification**: When asked about missing or unrecorded facts, the system explicitly states that the information is absent from your memories—**zero hallucinations, zero fabricated dates or quotes**.
* **Reusable Personal Skills**: Modular capabilities (Family Story Keeper, Weekly Life Review, Memory Inspector, Three Hats Companion) with defined schemas, permissions, and error handling.
* **Permission-Controlled Actions**: Shows users which memories and tools an action will use before execution, requiring explicit approval for consequential tasks.
* **Open-Source NVIDIA Nemotron on Nebius Token Factory**: Server-side inference adapter communicating with Nebius Token Factory (`https://api.tokenfactory.nebius.com/v1/chat/completions`) using NVIDIA Nemotron open models (`nvidia/llama-3.1-nemotron-70b-instruct`, `nvidia/nemotron-mini-4b-instruct`), with transparent deterministic fallback.
* **Three Hats Life-Balance Experience**: A dedicated role-mapping, reflection, and weekly ritual dashboard:
  > *“One person. Three hats. Many roles. One life to balance.”*
  > *“I am more than any single role I play.”*

---

## 2. Core Capabilities Delivered

### A. Evidence-Backed Memory Retrieval
1. **Source Precision**: Evaluates user queries against authorized memories (`revokedAt == null`), ranking sources by relevance.
2. **Citation Transparency**: Highlights matched facts, associated family members, and dates.
3. **Revocation Enforcement**: Revoking permission immediately excludes a memory from subsequent AI retrieval while keeping it safe in the user's garden.

### B. Reusable Personal Skills
1. **Family Story Keeper**: Synthesizes scattered memories into an editable narrative keepsake while preserving verbatim heirloom recipes and proverbs.
2. **Weekly Life Review**: Audits mapped commitments across your Three Hats and prepares an actionable, realistic checklist for balance.
3. **Memory Inspector**: Audits record provenance, verified facts vs narrative, and allows testing of permission revocation and permanent deletion.
4. **Three Hats Companion**: Guided AI reflection that cites user-stated roles and commitments, notices competing time demands, and requests explicit permission before saving persistent memories.

### C. Permission-Controlled Action Gate & Audit
1. **Permission Manifest**: Displays tool name, targeted memory IDs, action scope, and consequential impact.
2. **Server-Side Allowlist**: Enforces strict allowlist (`family_story_keeper`, `weekly_life_review`, `memory_inspector`, `three_hats_companion`, `role_reflection_keeper`).
3. **Zero-Leakage Audit Trail**: Records approvals and executions in an immutable ledger without logging sensitive memory contents.

### D. Three Hats — Professional, Personal & Social
1. **Three Visual Domain Cards**: Professional Hat (contribute, lead, build), Personal Hat (self, optional family, wellbeing), Social Hat (community, belonging, culture).
2. **3-Perspective Balance Model**: Evaluates Importance (1-5), Recorded Attention (1-5), and Satisfaction (1-5) as three distinct perspectives—refusing to collapse life into a single fake "success score".
3. **Explore Roles Library**: Categorized roles library with multi-hat assignment, custom role creation, and status markers (*current*, *occasional*, *aspirational*, *paused*, *completed*).
4. **Weekly Three Hats Ritual**: 6-step guided reflection (Recognize, Review, Notice, Appreciate, Choose, Commit) with optional export into Lantern Keeper.

---

## 3. Nebius Token Factory & NVIDIA Nemotron Integration

* **Service**: Nebius Token Factory (`https://api.tokenfactory.nebius.com/v1`)
* **Model**: NVIDIA Nemotron (`nvidia/llama-3.1-nemotron-70b-instruct`)
* **Security**: Credentials remain strictly in server-side environment variables (`NEBIUS_API_KEY`), never exposed to browser bundles or committed to git.
* **Graceful Degradation**: When unconfigured or offline, provider diagnostics report `NOT_CONFIGURED` or `UNREACHABLE` with setup instructions, seamlessly engaging our deterministic heuristic engine truthfully labeled.

---

## 4. Verification Results

All tests, lint checks, and production builds pass with 100% success:

* **Platform Automated Test Suites**: 10 Suites Passing (**372 total assertions, 0 failed**).
* **Lantern Keeper × Three Hats Integration Suite (`scripts/test-memory-lantern.ts`)**: **62/62 Passed**.
* **Lantern Keeper Package Suite (`memory-lantern/test-memory-lantern.ts`)**: **18/18 Passed**.
* **TypeScript Typecheck (`tsc --noEmit`)**: **0 errors (Clean)**.
* **Production Build (`npm run build`)**: Bundled successfully in 23.4s; `dist/server.cjs` populated.
* **Live Server Endpoints**:
  - `GET /api/lantern-keeper/provider-status` (HTTP 200)
  - `POST /api/lantern-keeper/retrieve` (HTTP 200)
  - `POST /api/lantern-keeper/execute-skill` (HTTP 200)
  - `POST /api/lantern-keeper/action-gate` (HTTP 200)
  - `POST /api/three-hats/companion-reflect` (HTTP 200)
  - `POST /api/memory-lantern/generate-story` (HTTP 200)

---

## 5. Links & Reproducibility

* **Live Demo (Lantern Keeper)**: [https://ais-dev-4s4jvpipr3mh3mz6x2hpfp-393352619239.asia-southeast1.run.app#memorylantern](https://ais-dev-4s4jvpipr3mh3mz6x2hpfp-393352619239.asia-southeast1.run.app#memorylantern)
* **Live Demo (Three Hats)**: [https://ais-dev-4s4jvpipr3mh3mz6x2hpfp-393352619239.asia-southeast1.run.app#threehats](https://ais-dev-4s4jvpipr3mh3mz6x2hpfp-393352619239.asia-southeast1.run.app#threehats)
* **Parent GitHub Repository**: [https://github.com/Zenieverse/Dr.-T](https://github.com/Zenieverse/Dr.-T)
* **Dedicated Package Directory**: [https://github.com/Zenieverse/Dr.-T/tree/main/memory-lantern](https://github.com/Zenieverse/Dr.-T/tree/main/memory-lantern)
* **License**: MIT License (Permissive Open Source).
