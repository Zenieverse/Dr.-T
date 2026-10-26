# 🩺 Dr. T — Biomedical Intelligence, Hedera Commons & MicroBiz Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore%20%26%20Auth-FFCA28.svg?logo=firebase)](https://firebase.google.com/)
[![Gemini](https://img.shields.io/badge/Google%20GenAI-Gemini%203.8%20Flash-8E75B2.svg?logo=google)](https://ai.google.dev/)
[![MCP](https://img.shields.io/badge/MCP-2025--11--25%20Streamable%20HTTP-00A4A6.svg)](https://modelcontextprotocol.io/)
[![Amazon Alexa+](https://img.shields.io/badge/Amazon%20Developer%20Hackathon-Alexa%2B%20Track%202026-FF9900.svg?logo=amazonalexa)](https://amazonappdev2026.devpost.com/)
[![Devpost](https://img.shields.io/badge/Devpost-Learn%20AI%20Basics%202026-003E54.svg?logo=devpost)](https://learn-ai-basics.devpost.com/)
[![Hedera](https://img.shields.io/badge/Hedera-HCS%20Provenance-222222.svg)](https://hedera.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **Dr. T** is a multi-dimensional AI ecosystem unifying clinical informatics, Socratic health intelligence, outdoor acoustics, cryptographically verifiable provenance, and grassroots economic empowerment (**MicroBiz: Made for All, By All**), featuring the **HealthAlert Companion** with Model Context Protocol (MCP 2025-11-25) and Alexa+ Conversational Agent.

---

## 🌐 Live Deployments & Repository

* **Development App**: [https://ais-dev-4s4jvpipr3mh3mz6x2hpfp-393352619239.asia-southeast1.run.app](https://ais-dev-4s4jvpipr3mh3mz6x2hpfp-393352619239.asia-southeast1.run.app)
* **Shared Production Preview**: [https://ais-pre-4s4jvpipr3mh3mz6x2hpfp-393352619239.asia-southeast1.run.app](https://ais-pre-4s4jvpipr3mh3mz6x2hpfp-393352619239.asia-southeast1.run.app)
* **GitHub Repository**: [https://github.com/Zenieverse/Dr.-T](https://github.com/Zenieverse/Dr.-T)

---

## 🌟 Platform Overview & Core Modules

Dr. T connects clinical medicine, creative discovery, and community livelihoods across 10+ integrated workspaces:

```
┌────────────────────────────────────────────────────────────────────────┐
│                              🩺 DR. T                                  │
├───────────────────┬───────────────────┬────────────────────────────────┤
│  HEALTH & CLINIC  │   GRASSROOTS BIZ  │   ACOUSTICS, TRUST & AGENTS    │
│  • Socratic Triage│  • MicroBiz Feed  │  • Pianist & Touch Grass 🌿    │
│  • Biomarker R4   │  • Courses & Quiz │  • Hedera Commons (HCS / HPK)  │
│  • SOAP Notes     │  • Storefronts    │  • LIFEWEAVE Multi-Agent SWE   │
│  • 360° Copilot   │  • Bookkeeping    │  • PetWhisperer & OpenWebOS    │
│  • Health Bridge  │  • OCR Scanner    │  • x402 Pay-Per-Request Bazaar │
│  • Research Lab   │  • Gemini AI Hub  │  • Trib-House & Dr. T Cinema   │
└───────────────────┴───────────────────┴────────────────────────────────┘
```

---

### 1. 💼 Dr. T MicroBiz — "Made for All, By All"
An inclusive social learning and sustainable livelihood platform designed for everyday makers, smallholder artisans, repair technicians, and neighborhood learners:

* **Discovery Feed (`DiscoveryFeed.tsx`)**: Real-world craft stories, scrap-sharing exchanges, community advice, post reactions, and bookmarking.
* **Course Platform (`CoursePlatformView.tsx`)**: Practical, zero-jargon courses (Botanical Soapmaking, Operations & Bookkeeping 101, Repair Diagnostics), interactive quizzes with instant rationale, and verifiable completion certificates dynamically stamped with the active learner's name.
* **Community Groups & Collaboration (`CommunityGroupsView.tsx`)**: Grassroots artisan circles, collaborative project boards with task assignees, and a volunteer peer-mentorship directory.
* **Artisan Marketplace (`MarketplaceView.tsx`)**: Direct maker storefronts and itemized product listings with transparent unit costs. Features direct inquiry routing with **mandatory payment disclosures** (automated card charging disabled to protect local artisans from hidden transaction fees).
* **Everyday Operations Ledger (`OperationsView.tsx`)**: Plain-language income/expense ledger, net cash margin calculation, transaction logging, CSV data export, and customer-facing quote and invoice generation with in-modal clipboard export.
* **Receipt & Invoice OCR Scanner (`DocScannerView.tsx`)**: Digitizes paper invoices and payment slips via Gemini 2.5 Flash and heuristic regex parsing, automatically extracting vendor, date, line items, and totals into the operations ledger.
* **AI Studio (`AiStudioView.tsx`)**: Plain-language AI assistant powered by Gemini 2.5 Flash:
  * *Course Curriculum Architect*: Creates structured 2-module syllabi with learning objectives and quizzes.
  * *Artisan Product Storyteller*: Generates authentic craft descriptions, features, and social snippets.
  * *Lean Business Plan Drafter*: Generates 1-page Lean Business Canvases with community giveback initiatives.
  * *AI Transparency Badges*: Real-time indicators distinguishing **Live Gemini AI** from **Offline Heuristic Engine** fallbacks.
* **Trust & Safety (`TrustAdminView.tsx`)**: Transparent moderation queue, community standards enforcement, and anti-abuse safeguards.

---

### 2. 🔔 HealthAlert Companion & Amazon Developer Hackathon 2026 (Alexa+ Track)
An authoritative, evidence-grounded health monitoring, triage, and physician-handoff agent:

* **Dual-Mode Clinical Interface (`HealthAlertCompanionModule.tsx`)**:
  * **Alexa+ Conversational Agent Mode**: Interactive voice-enabled health dialogue with browser speech recognition, live audio visualizer, transparent multi-tool execution telemetry, and localized emergency dispatch routing (Vietnam 115, UAE 998, UK 999, US 911, Europe 112).
  * **Guided Clinical Intake Workflow**: 4-step intake analyzing presenting concerns, vitals, and lab measurements against AHA, ADA, and WHO clinical guidelines, generating valid HL7 FHIR Release 4 `RiskAssessment` resources and SBAR clinician handoff reports.
* **Deterministic Emergency Safety Layer**:
  * Critical red-flag symptoms (crushing chest pain, left arm pain, severe dyspnea, stroke indicators) and hypertensive crisis ($BP \ge 180/120$ mmHg) deterministically trigger immediate ambulance escalation, strictly superseding AI model output.
  * Cardiometabolic findings such as Stage 1 Hypertension (138/88 mmHg) with elevated HbA1c (6.1%) strictly stratify to outpatient primary care follow-up (2–4 weeks).
* **Model Context Protocol (MCP) Server**:
  * **Protocols Supported**: `2025-11-25` (Latest) and `2024-11-05` (Backward-Compatible negotiation).
  * **Transports**: Streamable HTTP Server-Sent Events (`GET /api/mcp/sse`) and HTTP JSON-RPC 2.0 (`POST /api/mcp`).
  * **Tools Exposed**:
    1. `check_safety_escalation`: Hardcoded clinical rules verifying emergency indicators.
    2. `explain_health_alert`: Factual biomarker explanation with epistemic uncertainty bounds.
    3. `prepare_follow_up_questions`: Clinician visit question generator and pre-appointment checklist.
  * **Agent Orchestrator (`POST /api/health-alert/agent`)**: Multi-tool sequential agent pipeline with transparent latency and provider telemetry (`gemini-3.8-flash` with deterministic verified fallback).

---

### 3. 🩺 Biomedical Intelligence & Clinical Decision Support
* **Socratic Consultation (`DrTHome.tsx`)**: Longitudinal health dialogue analyzing wearable telemetry, metabolic blood markers, and circadian sleep phases.
* **Clinical Informatics (`ClinicalInformatics.tsx`)**: FHIR R4 interoperability, LOINC/SNOMED CT structured data, and automated SOAP clinical summary generation.
* **Health Bridge (`DrTHealthBridge.tsx`)**: 11 clinical pillars for health record migration and wellness coordination.
* **Patient 360 Copilot (`PatientMember360Copilot.tsx`)**: Unified patient record with risk stratification and preventative reminders.
* **Research Lab (`ResearchLab.tsx`)**: Evidence synthesis across biomedical literature and ICU cohort profiles.

---

### 4. 🎹 PIANIST & Touch Grass 🌿
* **Adaptive Grand Piano (`GrandPianoWorkspace.tsx`)**: Physical modeling acoustic piano synthesizer utilizing additive synthesis, realistic overtones, hammer strike transients, and damper pedal simulation.
* **88-Key Repertoire Player (`ClassicalTrackPlayer.tsx`)**: Full interactive guided play-along for classical works, including **Richard Clayderman's "Always"**, Chopin, and Bach, with note-by-note synchronization, pedal hints, and measure annotations.
* **Touch Grass Outdoor Sound-to-Music (`TouchGrassStudio.tsx`)**: Converts real-world acoustic feature extraction (spectral centroid, RMS energy, and onset detection via Web Audio API `AnalyserNode`) into melodic contours and piano missions.

---

### 5. 🛡️ Hedera Commons & Hedera Provenance Kit (HPK)
* **Consensus Service Integration (`HederaCommonsPage.tsx`)**: Submits cryptographically canonical JSON hashes to Hedera Consensus Service (HCS) topics for immutable audit records.
* **Cryptographic Invariants (`provenanceStore.ts`)**: RFC 8785 canonical JSON serialization with SHA-256 fingerprinting.

---

### 6. 🕸️ LIFEWEAVE Studio, x402 & Multimodal Extensions
* **LIFEWEAVE (`LifeWeaveStudio.tsx`)**: Multi-agent software engineering orchestration workspace.
* **x402 Pay-Per-Request Studio (`X402PayPerRequestStudio.tsx`)**: Decentralized machine-to-machine micropayment bazaar and challenge verification.
* **Dr. T Cinema & Trib-House (`CinemaContainer.tsx`, `TribHouseContainer.tsx`)**: Multimodal biomedical media and living library commons.

---

### 7. 🛠️ Build With AI — Devpost Learn AI Basics Challenge Companion
Official Challenge: [Devpost Learn AI Basics](https://learn-ai-basics.devpost.com/) | Navigation Tab: `Build With AI` (`buildwithai`)

#### The Problem & Intended Users
* **The Problem**: Developers entering AI competitions often encounter severe friction moving from high-level ideas to disciplined software architecture. Projects frequently suffer from missing required challenge artifacts (`scope.md`, `prd.md`, `spec.md`), mismatched terminology across documents, unprioritized task execution, and unverified AI prompts.
* **Intended Users**: Hackathon builders, first-time AI developers participating in the Devpost Learn AI Basics challenge, and technical architects who need a structured, verifiable path from ideation to submission.

#### What Build With AI Does Today
* **8-Stage Project Lifecycle**: An interactive visual stepper guiding builders through `Discover` ➔ `Scope` ➔ `Plan` ➔ `Specify` ➔ `Build` ➔ `Test` ➔ `Document` ➔ `Publish`.
* **Guided Project Intake & Gemini Synthesis**: A structured questionnaire capturing problem statement, audience, proposed solution, features, and constraints, synthesized by `gemini-3.8-flash` into personas, user stories, and technical risks.
* **Document Studio with Section Validation**: A live Markdown authoring workbench for `scope.md`, `prd.md`, `spec.md`, and `README.md` with real-time completeness checks enforcing all 7 mandatory sections per document type.
* **Cross-Document Mutual Consistency Engine**: Analyzes terminology, persona traceability, and technical boundary alignment across documents to eliminate requirements drift.
* **Sprint Task Board (Kanban)**: 6 sprint stages (Backlog, Ready, In Progress, Testing, Done, Blocked) with acceptance criteria, time estimates, and direct links to code review.
* **Coding Assistant & Prompt Generator**: Code review workbench analyzing security flaws, edge cases, unit test coverage, and plain-language logic explanations, plus structured prompt formatting for external coding agents.
* **Devpost Compliance Center**: 14-point verifiable checklist mapped to official submission criteria, with one-click `.md` download and complete `.json` project bundle manifest export.
* **Reference Demonstration Template**: Includes **HealthAlert Mini**, a fully compliant pre-populated project (explicitly labeled as an educational, non-diagnostic template).

#### Architecture & Model Usage
* **Frontend**: React 18 SPA with TypeScript 5.7 and Tailwind CSS 4 (`src/components/buildwithai/`).
* **Backend Proxy**: Express 5 on Node.js 22 (`src/server/buildWithAiServerService.ts`).
* **GenAI Model**: `@google/genai` using model `gemini-3.8-flash`. Deprecated models are strictly prohibited.
* **Resilience & Timeout Budget**: All Gemini API calls enforce a strict 2,500ms `Promise.race` timeout, gracefully falling back to deterministic heuristic generation if the AI service times out or is unconfigured.
* **Persistence & Security**: Authenticated projects persist to Firebase Firestore collection `/buildwithai_projects/{projectId}` with ownership isolation (`userId == request.auth.uid`). Unauthenticated guests use an isolated browser `localStorage` sandbox.

#### Truthful Disclosures & Known Limitations
1. **Platform Integration**: Build With AI is natively integrated into the existing Dr. T platform and reuses its Express backend, Firebase authentication, and Cloud Run infrastructure. It preserves all existing Dr. T tabs (HealthAlert Companion, MicroBiz, PIANIST, Hedera Commons).
2. **Learn Skill Pack Execution**: The Dr. T application runs in a secure browser sandbox and **does NOT claim to execute local terminal CLI skill packs inside the browser**. The application provides official instructions and copyable commands for builders to execute in their local terminal:
   ```bash
   npx @devpost/learn-skill-pack init
   ```
3. **Collaboration**: Real-time collaborative multi-cursor document editing is currently deferred to post-hackathon releases.
4. **Non-Diagnostic**: The HealthAlert Mini template project is provided solely for educational reference and demonstration purposes.

---

## 🔒 Security, Authentication & Data Isolation

1. **Authenticated User Identity**:
   * Bound to real Firebase Authentication (`subscribeAuthState`).
   * No fallback to placeholder identities (e.g. Alex Rivera) for active sessions.
   * `MicroBizNavbar` features dynamic user chips showing verified account status, email, and Google Sign-In/Out controls.
2. **Ephemeral Guest Sandbox**:
   * Unauthenticated users receive an isolated, randomized guest session ID (`guest_<timestamp>_<random>`).
   * Guest operations are stored strictly in browser sandbox storage and **cannot read or overwrite authenticated production Firestore documents**.
3. **Firestore Security Rules (`firestore.rules`)**:
   * Rules verified and deployed directly to `ai-studio-drt-2e1619d9-9932-4538-9b6c-26b489ebfec2`.
   * `microbiz_finances`: Private to record owner (`resource.data.userId == request.auth.uid`) or admin (`zenieverse@gmail.com`).
   * `microbiz_inquiries`: Restricted to buyer and maker.
   * `microbiz_reports`: Private reporting queue accessible only to reporting user and system administrators.
   * `microbiz_posts`, `microbiz_courses`, `microbiz_businesses`: Public read; write/delete restricted to authenticated owners or admins.
4. **Server-Side API Proxy & Secret Zero-Exposure**:
   * `GEMINI_API_KEY` is loaded exclusively inside `server.impl.ts`. No secret keys exist in client bundles.
   * Clean separation between live model responses and resilient offline heuristic fallbacks.
5. **Strict Payment Disclosure**:
   * Automated credit card charging is disabled across all storefronts.
   * All orders are direct quote inquiries settled directly with the maker (cash on delivery, bank transfer QR, or local exchange).

---

## 🧪 Test Execution & Verification Results

All tests, type checks, and builds are fully verified:

| Test / Check | Command Executed | Result | Status |
| :--- | :--- | :--- | :--- |
| **MicroBiz Invariant Suite** | `npx tsx scripts/test-microbiz-invariants.ts` | **28 Passed / 0 Failed** | ✅ PASS |
| **Hashing Invariants (HPK)** | `npx tsx scripts/test-hashing-invariants.ts` | **3 Passed / 0 Failed** | ✅ PASS |
| **Secret Scan Audit** | `node scripts/audit-secret-scan.cjs` | **0 secrets across 68 files** | ✅ PASS |
| **TypeScript Typecheck** | `npm run lint` (`tsc --noEmit`) | **0 errors (Clean)** | ✅ PASS |
| **Full Production Build** | `npm run build` | **`dist/`, `build/`, `.next/` populated** | ✅ PASS |

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: `20.x` or `22.x`
* **npm**: `10.x` or higher

### Installation & Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/Zenieverse/Dr.-T.git
cd Dr.-T

# 2. Install dependencies
npm install

# 3. Configure environment variables (optional, for live Gemini features)
cp .env.example .env
# Set GEMINI_API_KEY=your_key_here

# 4. Start full-stack development server
npm run dev
```

The app will launch at `http://localhost:3000`.

### Scripts

```bash
npm run dev                  # Start Express full-stack dev server with Vite middleware
npm run build                # Run production Vite build, esbuild server bundle, and artifact sync
npm run lint                 # Type check with tsc --noEmit
npx tsx scripts/test-microbiz-invariants.ts  # Run MicroBiz audit invariant suite
npx tsx scripts/test-hashing-invariants.ts   # Run Hedera hashing invariant suite
node scripts/audit-secret-scan.cjs           # Run repository secret scan
```

---

## 📂 Project Architecture

```
├── scope.md                                   # Devpost challenge project scope
├── prd.md                                     # Devpost challenge product requirements
├── spec.md                                    # Devpost challenge technical architecture
├── docs/
│   ├── learn-ai-basics-submission-checklist.md# 14-point submission readiness checklist
│   └── patches/                               # Complete Git patch series
├── .env.example                               # Environment template (zero secrets)
├── firebase-applet-config.json                # Firebase client configuration
├── firestore.rules                            # Firestore RBAC, ownership & project rules
├── package.json                               # Dependencies & build scripts
├── server.impl.ts                             # Express server, Gemini & MCP routes
├── server.ts                                  # Full-stack server entry point
├── scripts/
│   ├── test-build-with-ai.ts                  # Build With AI test suite (31+ tests)
│   ├── test-firestore-security-rules.ts       # Security rules test suite (24 tests)
│   ├── audit-secret-scan.cjs                  # Secret scanning utility
│   ├── test-microbiz-invariants.ts            # MicroBiz automated verification suite
│   ├── test-hashing-invariants.ts             # Cryptographic canonical serialization test
│   └── prepare-build-artifacts.cjs            # Multi-target build bundler
├── src/
│   ├── App.tsx                                # Main application orchestrator & navigation
│   ├── main.tsx                               # React DOM entry point
│   ├── server/
│   │   └── buildWithAiServerService.ts        # Server-side GenAI service with timeout & fallbacks
│   ├── services/
│   │   └── firebase.ts                        # Firebase SDK & Auth helpers
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx                     # Top primary navigation bar
│   │   │   └── CommandPalette.tsx             # Cmd+K quick navigation palette
│   │   ├── buildwithai/                       # Build With AI companion workspace
│   │   │   ├── BuildWithAiModule.tsx          # Central tab shell & project manager
│   │   │   ├── types.ts                       # Project & document data contracts
│   │   │   ├── data/templateProject.ts        # HealthAlert Mini reference template
│   │   │   ├── services/buildWithAiService.ts # Local & Firestore sync, validation engines
│   │   ├── microbiz/                          # Dr. T MicroBiz platform
│   │   │   ├── MicroBizApp.tsx                # MicroBiz central container & subtab state
│   │   │   ├── components/
│   │   │   │   ├── MicroBizNavbar.tsx         # Secondary subtab ribbon & live Auth chip
│   │   │   │   ├── DiscoveryFeed.tsx          # Community updates & craft stories
│   │   │   │   ├── CoursePlatformView.tsx     # Courses, quizzes & completion certificates
│   │   │   │   ├── CommunityGroupsView.tsx    # Artisan groups & collaborative projects
│   │   │   │   ├── MarketplaceView.tsx        # Fair-trade storefronts & maker inquiries
│   │   │   │   ├── OperationsView.tsx         # Bookkeeping ledger & quote/invoice tool
│   │   │   │   ├── DocScannerView.tsx         # Receipt OCR extractor (Gemini + Regex)
│   │   │   │   ├── AiStudioView.tsx           # AI curriculum, copy, and business canvas
│   │   │   │   └── TrustAdminView.tsx         # Trust & community governance queue
│   │   │   ├── services/
│   │   │   │   └── microbizService.ts         # Firestore persistence & guest sandbox
│   │   │   ├── types/
│   │   │   │   └── microbizTypes.ts           # MicroBiz TypeScript schema definitions
│   │   │   └── data/
│   │   │       └── initialMicroBizData.ts     # Offline seed datasets & guest profiles
│   │   ├── pianist/                           # Adaptive Piano & Touch Grass core
│   │   │   ├── GrandPianoKeyboard.tsx         # 88-key physical modeling grand piano
│   │   │   ├── grandpiano/components/         # Classical repertoire play-along player
│   │   │   └── touchgrass/                    # Outdoor sound-to-music audio engine
│   │   ├── drt/                               # Socratic clinical wellness engine
│   │   ├── informatics/                       # FHIR R4 clinical informatics
│   │   └── settings/                          # User settings, language & personality
│   └── modules/
│       └── hedera/                            # Hedera Commons & HPK consensus tools
```

---

## 🧪 Hackathon Judge Testing & Verification Guide

### 1. Model Context Protocol (MCP) Verification
```bash
# Discovery manifest & Streamable HTTP discovery
curl -s http://localhost:3000/api/mcp | jq .

# Streamable HTTP Server-Sent Events endpoint
curl -s -N -H "Accept: text/event-stream" http://localhost:3000/api/mcp/sse

# Protocol negotiation (2025-11-25)
curl -s -X POST http://localhost:3000/api/mcp -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-11-25"}}' | jq .

# List registered tools
curl -s -X POST http://localhost:3000/api/mcp -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/list"}' | jq .
```

### 2. Conversational Agent Pipeline
```bash
# Non-emergency cardiometabolic alert (strictly stratifies to outpatient 2-4 weeks)
curl -s -X POST http://localhost:3000/api/health-alert/agent -H "Content-Type: application/json" \
  -d '{"query":"My blood pressure is 138/88 and my fasting HbA1c is 6.1%","region":"Vietnam"}' | jq .

# Acute emergency chest pain (strictly escalates to immediate ambulance dispatch)
curl -s -X POST http://localhost:3000/api/health-alert/agent -H "Content-Type: application/json" \
  -d '{"query":"Crushing chest pain radiating to left arm with shortness of breath","region":"UAE"}' | jq .
```

### 3. Full Automated Test Suite Execution
```bash
# Runs all 8 test suites (239+ assertions)
npm test

# Verify type safety
npm run lint

# Production build
npm run build
```

### 4. Build With AI Verification (Devpost Learn AI Basics)
```bash
# Direct execution of Build With AI test suite (35+ assertions)
npx tsx scripts/test-build-with-ai.ts

# Test Project Brief generation endpoint (server Gemini 3.8 Flash proxy with fallback)
curl -s -X POST http://localhost:3000/api/build-with-ai/brief -H "Content-Type: application/json" \
  -d '{"name":"EcoTracker","description":"Solar home energy monitor","targetAudience":"Homeowners","problemStatement":"High peak energy costs"}' | jq .

# Test Document Drafting endpoint
curl -s -X POST http://localhost:3000/api/build-with-ai/draft-doc -H "Content-Type: application/json" \
  -d '{"docType":"scope.md","projectName":"EcoTracker","brief":{"problemStatement":"High energy costs"}}' | jq .

# Test Code Assist & Review endpoint
curl -s -X POST http://localhost:3000/api/build-with-ai/code-assist -H "Content-Type: application/json" \
  -d '{"filename":"src/solar.ts","codeSnippet":"export function isPeak(hour: number) { return hour >= 16 && hour <= 21; }"}' | jq .
```

---

## 📄 License & Medical Disclaimer

* **License**: Licensed under the [MIT License](LICENSE).
* **Mandatory Medical Notice**: Dr. T is an educational wellness and clinical decision-support AI platform. It is NOT a replacement for a licensed healthcare professional, formal diagnosis, or medical treatment.
