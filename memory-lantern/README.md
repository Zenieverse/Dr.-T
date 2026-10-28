# 🏮 Memory Lantern — Stories That Stay

[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)
[![Hacktoberfest 2026](https://img.shields.io/badge/Hacktoberfest%202026-Week%204%20Open%20Source%20AI-orange.svg)](https://dev.to/challenges/hacktoberfest-week4-2026-10-26)
[![Model: Gemma 2](https://img.shields.io/badge/Open--Weight%20AI-Gemma%202%20(2B%20%2F%209B)-blue.svg)](https://ai.google.dev/gemma)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://react.dev/)

> **A peaceful digital sanctuary for intergenerational remembrance, family traditions, and living stories powered by open-weight Gemma AI.**
> Built for the **DEV Hacktoberfest 2026 Week 4 Challenge: “Ghost in the Machine”** (October 26–31, 2026).

---

## 🌟 The Vision: "Ghost in the Machine" Reimagined

In speculative fiction, the "Ghost in the Machine" is often portrayed as something uncanny—synthetic resurrection, creepy digital replicas, or AI trying to mimic the voice of someone who has passed away.

**Memory Lantern rejects that approach.** 

Instead of generating false replicas or pretending to channel the dead, Memory Lantern uses open-weight AI as a gentle, transparent lantern bearer:
* It helps living families organize fragmented memories into coherent storybooks.
* It preserves the exact names, dates, recipes, sayings, and places that people hold dear.
* It explicitly safeguards against biographical hallucination or supernatural deception.
* It places every memory in a glowing digital garden, keeping traditions alive across generations.

---

## ✨ Core Features

1. **🏮 Glowing Lantern Garden**:
   - An accessible night-garden interface where each memory rests inside a warm lantern.
   - Filter by categories: *Remembrance*, *Tradition*, *Milestone*, *Everyday Joy*, *Wisdom*.
   - Instant search across story text, family members remembered, recipes, and sayings.

2. **📖 Lantern Stories (Open-Weight Gemma AI)**:
   - Select one or more lanterns from your garden and synthesize them into editable narratives.
   - **5 Story Modes**:
     - *A Story to Keep*: Weaves scattered moments into a cohesive life reflection.
     - *A Tribute of Love*: Factual, respectful remembrance honoring someone remembered.
     - *Family Storybook*: Timelines or chapters for younger generations.
     - *Letters for the Future*: Living messages carrying advice, values, and traditions.
     - *Voices & Traditions*: Focuses on family recipes, songs, idioms, and woodcraft/craftsmanship lessons.
   - **4 Narrative Styles**: Warm & Simple, Poetic & Lyrical, Reflective & Philosophical, and Family Storytelling.
   - **Mandatory Review & Edit**: Every draft is fully editable before saving or exporting.
   - **Fact Provenance**: Separates *Supplied Facts Honored* from *Narrative Enhancements*.

3. **⏳ Chronicle Timeline**:
   - Time-ordered visual chronicle mapping memories across decades and generations.

4. **🕊️ Printable Remembrance Mode**:
   - Clean reading typography with one-click print styling (`@media print`) and copyable text stripped of database keys.

5. **🔒 Privacy & Data Sanctuary**:
   - Authenticated Firestore ownership (`/memory_lantern_memories`) or isolated browser sandbox for guests.
   - Zero telemetry of memory text or personal names.
   - Complete data export in JSON and Markdown, plus one-click permanent deletion.

---

## 🤖 Open-Weight Gemma Architecture

Memory Lantern is built around an open AI provider adapter:

```
┌────────────────────────────────────────────────────────┐
│             Memory Lantern Client (React 18)           │
└───────────────────────────┬────────────────────────────┘
                            │ POST /api/memory-lantern/generate-story
                            ▼
┌────────────────────────────────────────────────────────┐
│     MemoryLanternServerService (Node.js Express)       │
│     • Strict Ethical Safety Prompting                  │
│     • Provenance Extraction & Validation               │
└─────────────┬───────────────────────────┬──────────────┘
              │                           │
              ▼ (Option A: Local)         ▼ (Option B: Hosted)
   ┌───────────────────────┐   ┌───────────────────────────────┐
   │ Local Ollama Server   │   │ Hosted Open-Weight Gemma API  │
   │ http://localhost:11434│   │ (Groq, HF, OpenRouter, vLLM)  │
   │ Model: gemma2:2b / 9b │   │ Model: google/gemma-2-9b-it   │
   └───────────────────────┘   └───────────────────────────────┘
```

### Ethical Safety Invariants Enforced in Prompt & Server
* **Zero First-Person Impersonation**: Never speaks as "I am watching you from beyond."
* **No Supernatural Claims**: Never claims to channel, resurrect, or speak for the deceased.
* **Factual Invariance**: Preserves all user-provided names, dates, recipes, and quotes verbatim.

---

## 🚀 Quick Start & Local Setup

### 1. Prerequisites
- **Node.js**: v20+ or v22+
- **npm**: v10+
- **Ollama** (optional, for 100% offline local inference): [ollama.com](https://ollama.com)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/Zenieverse/Dr.-T.git
cd Dr.-T

# Install dependencies
npm install
```

### 3. Running Open-Weight Gemma Locally (Ollama)
```bash
# Pull and start the lightweight open-weight Gemma 2 model
ollama run gemma2:2b
```

### 4. Running the Application
```bash
# Start development server
npm run dev
```
Navigate to `http://localhost:3000` and click the **Memory Lantern** tab.

### 5. Running the Automated Test Suite
```bash
# Runs Memory Lantern invariant and ethical guardrail tests
npx tsx scripts/test-memory-lantern.ts
```

---

## 📂 Project Structure

```
memory-lantern/
├── README.md                          # Project overview, mission & quickstart
├── ARCHITECTURE.md                    # Detailed architectural specification
├── OPEN_AI_SETUP.md                   # Guide to running Gemma via Ollama or hosted API
├── .env.example                       # Environment template (zero secrets)
├── package.json                       # Standalone dependencies & scripts
├── LICENSE                            # MIT License
└── docs/
    ├── privacy-and-data-flow.md       # Privacy, Firestore rules & data minimization
    ├── demo-capture-checklist.md      # 2-minute judge demonstration flow
    └── hacktoberfest-submission-draft.md # Official DEV Week 4 article submission
```

---

## 📄 License & Attribution

* **License**: Licensed under the [MIT License](LICENSE).
* **Attribution**: Memory Lantern originated as a flagship module within the Dr. T healthcare and civic empowerment platform, reusing base design tokens, icon libraries (`lucide-react`), and Firebase configuration. All Memory Lantern components, Gemma prompting architectures, and narrative engines are original work created during October 26–31, 2026.
