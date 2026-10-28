---
title: "Memory Lantern — Stories That Stay: Honoring Heritage with Open-Weight Gemma AI"
published: true
tags: devchallenge, hf26challenge, gemma, opensource, ai
cover_image: https://raw.githubusercontent.com/Zenieverse/Dr.-T/main/public/memory-lantern-banner.png
canonical_url: https://dev.to/zenieverse/memory-lantern-stories-that-stay-week-4
---

*This article is submitted for the **DEV Hacktoberfest Open-Source AI Challenge Week 4: “Ghost in the Machine”** (October 26–31, 2026).*

---

## 1. The Human Problem & "Ghost in the Machine"

When we lose someone we love, the world often tells us they are "gone." But what truly lingers—the real *ghost in the machine* of human existence—is not some spooky phantom or synthetic voice. It is the lingering scent of lemon verbena in a sunroom kettle, the woodworking lessons learned on autumn Saturdays, the handwritten recipes on yellowed index cards, and the quiet traditions handed down across generations.

Recently, generative AI has rushed toward uncanny, ethically troubling experiments: synthetic chatbots pretending to channel the dead, deepfake holograms claiming to speak from beyond the grave, and predictive models hallucinating autobiographies. 

**Memory Lantern rejects that approach entirely.**

We built **Memory Lantern — Stories That Stay** as a digital sanctuary where open-weight AI does not pretend to resurrect the dead or impersonate lost voices. Instead, it serves as a gentle, transparent lantern bearer: helping living families organize scattered memories, heirloom recipes, and oral sayings into dignified, editable storybooks that can be shared across generations.

---

## 2. What We Built & The User Experience

Memory Lantern delivers a warm, respectful digital garden experience:

1. **The Glowing Lantern Garden**:
   Every memory is represented as an interactive glowing lantern. Users can filter by life categories (*Remembrance*, *Tradition*, *Everyday Joy*, *Milestone*, *Wisdom*) or search across family names, recipes, and sayings.

2. **Lantern Stories (Gemma 2 Narrative Studio)**:
   Users select one or more lanterns from their garden to synthesize into editable prose across 5 specialized narrative modes:
   * **A Story to Keep**: Merges scattered memories into a cohesive life reflection.
   * **A Tribute of Love**: Factual, dignified remembrance honoring a loved one.
   * **Family Storybook**: Chapters formatted for children and grandchildren.
   * **Letters for the Future**: Passing down core values, recipes, and blessings.
   * **Voices & Traditions**: Centering on idioms, proverbs, and crafts.

3. **Mandatory Human Agency & Fact Separation**:
   Every AI-assisted narrative is strictly editable before saving. The system side-by-side separates **Supplied Facts Honored** (e.g. Grandma Elena's 7-minute lemon verbena tea recipe) from **Narrative Enhancements** (transitional poetic prose).

4. **Chronicle Timeline & Printable Tributes**:
   A vertical timeline traces stories across decades (1982 ➔ 1994 ➔ 2005), while a printable reading mode allows one-click paper exports without app UI clutter.

---

## 3. The Open-Weight Model: Gemma 2 & Architecture

To preserve deeply personal memories, proprietary closed-source models pose unacceptable privacy risks: personal stories, names, and traditions should never be locked behind private black-box APIs or used to train corporate models.

Memory Lantern integrates **Google's open-weight Gemma 2** model family (`gemma2:2b`, `gemma2:9b`, and `google/gemma-2-9b-it`).

### Architectural Implementation:
* **Client**: React 18, TypeScript 5.7, Tailwind CSS 4.
* **Server**: Express 5 on Node.js 22 with `MemoryLanternServerService`.
* **Dual Inference Adapter**:
  1. **100% Offline Local Ollama** (`http://localhost:11434/api/generate`): When running Ollama on localhost, zero bytes of story data leave the user's computer.
  2. **Hosted Open-Weight Inference** (`GEMMA_API_BASE_URL` & `GEMMA_API_KEY`): Connects to self-hosted vLLM, Groq, or Hugging Face Inference Endpoints.
* **No Closed-Model Substitutions**: If the open-weight model is offline, the system truthfully displays configuration instructions (`ollama run gemma2:2b`) or offers a clearly labeled deterministic test fixture for CI and grading—it never silently routes to closed APIs.

### Strict Ethical Guardrails:
* **Impersonation Prohibited**: Prompt invariants strictly forbid the model from speaking as a deceased person in the first person.
* **Biographical Integrity**: The model is prohibited from inventing relatives, conflicts, or biographical facts not supplied by the user.

---

## 4. Privacy, Ownership & Data Flow

* **Storage**: Authenticated users have their memories persisted to Firebase Firestore collection `/memory_lantern_memories` with security rules enforcing `resource.data.userId == request.auth.uid`. Unauthenticated guests use an isolated browser `localStorage` sandbox.
* **Zero Telemetry**: No personal memories, deceased names, or voice transcripts are collected in logging or analytics.
* **Full Data Portability**: Users can export their entire sanctuary as JSON or clean Markdown storybooks, or permanently delete all records with one click.

---

## 5. What Was Built During Hacktoberfest Week 4 vs. Reused

* **Built Specifically for Week 4 (October 26–31, 2026)**:
  * Complete Memory Lantern UX (Garden, Timeline, Storybook, Sanctuary).
  * Typed Open-Weight Gemma Provider Adapter & Prompt Builder.
  * Fact Provenance and Ethical Guardrail Verification Engines.
  * Firestore Security Rules for `/memory_lantern_memories`.
  * Comprehensive automated verification test suite (`scripts/test-memory-lantern.ts`).
  * Standalone repository package directory (`memory-lantern/`).
* **Reused from Host Platform (Dr. T)**:
  * Shared Express 5 server skeleton and Vite build toolchain.
  * Firebase Authentication and client SDK initialization.
  * Base Tailwind design tokens and `lucide-react` icons.

---

## 6. Verification Results

All tests, lint checks, and production builds pass with 100% success:

* **Platform Automated Test Suites**: 10 Suites Passing (300+ assertions).
* **Memory Lantern Verification Suite**: 15/15 Invariant Checks Passing.
* **TypeScript Typecheck (`tsc --noEmit`)**: 0 errors (Clean).
* **Production Build**: Bundled and verified.

---

## 7. Links & Reproducibility

* **Live Demo (Web Application)**: [https://ais-dev-4s4jvpipr3mh3mz6x2hpfp-393352619239.asia-southeast1.run.app](https://ais-dev-4s4jvpipr3mh3mz6x2hpfp-393352619239.asia-southeast1.run.app)
* **GitHub Repository**: [https://github.com/Zenieverse/Dr.-T](https://github.com/Zenieverse/Dr.-T) (Memory Lantern module inside `src/components/memorylantern/` and standalone package in `memory-lantern/`)
* **Local Reproduction Command**:
  ```bash
  git clone https://github.com/Zenieverse/Dr.-T.git
  cd Dr.-T
  npm install
  npm test
  npm run dev
  ```

---

*Memory Lantern reminds us that our loved ones' true presence is not trapped in a machine—it lives in the stories we keep, the love we carry, and the lights we choose to kindle.*
