# 🩺 Dr. T — Biomedical Intelligence, Hedera Commons & MicroBiz Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore%20%26%20Auth-FFCA28.svg?logo=firebase)](https://firebase.google.com/)
[![Gemini](https://img.shields.io/badge/Google%20GenAI-Gemini%202.5%20Flash-8E75B2.svg?logo=google)](https://ai.google.dev/)
[![Hedera](https://img.shields.io/badge/Hedera-HCS%20Provenance-222222.svg)](https://hedera.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **Dr. T** is a multi-dimensional AI ecosystem unifying clinical informatics, Socratic health intelligence, outdoor acoustics, cryptographically verifiable provenance, and grassroots economic empowerment (**MicroBiz: Made for All, By All**).

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

### 2. 🩺 Biomedical Intelligence & Clinical Decision Support
* **Socratic Consultation (`DrTHome.tsx`)**: Longitudinal health dialogue analyzing wearable telemetry, metabolic blood markers, and circadian sleep phases.
* **Clinical Informatics (`ClinicalInformatics.tsx`)**: FHIR R4 interoperability, LOINC/SNOMED CT structured data, and automated SOAP clinical summary generation.
* **Health Bridge (`DrTHealthBridge.tsx`)**: 11 clinical pillars for health record migration and wellness coordination.
* **Patient 360 Copilot (`PatientMember360Copilot.tsx`)**: Unified patient record with risk stratification and preventative reminders.
* **Research Lab (`ResearchLab.tsx`)**: Evidence synthesis across biomedical literature and ICU cohort profiles.

---

### 3. 🎹 PIANIST & Touch Grass 🌿
* **Adaptive Grand Piano (`GrandPianoWorkspace.tsx`)**: Physical modeling acoustic piano synthesizer utilizing additive synthesis, realistic overtones, hammer strike transients, and damper pedal simulation.
* **88-Key Repertoire Player (`ClassicalTrackPlayer.tsx`)**: Full interactive guided play-along for classical works, including **Richard Clayderman's "Always"**, Chopin, and Bach, with note-by-note synchronization, pedal hints, and measure annotations.
* **Touch Grass Outdoor Sound-to-Music (`TouchGrassStudio.tsx`)**: Converts real-world acoustic feature extraction (spectral centroid, RMS energy, and onset detection via Web Audio API `AnalyserNode`) into melodic contours and piano missions.

---

### 4. 🛡️ Hedera Commons & Hedera Provenance Kit (HPK)
* **Consensus Service Integration (`HederaCommonsPage.tsx`)**: Submits cryptographically canonical JSON hashes to Hedera Consensus Service (HCS) topics for immutable audit records.
* **Cryptographic Invariants (`provenanceStore.ts`)**: RFC 8785 canonical JSON serialization with SHA-256 fingerprinting.

---

### 5. 🕸️ LIFEWEAVE Studio, x402 & Multimodal Extensions
* **LIFEWEAVE (`LifeWeaveStudio.tsx`)**: Multi-agent software engineering orchestration workspace.
* **x402 Pay-Per-Request Studio (`X402PayPerRequestStudio.tsx`)**: Decentralized machine-to-machine micropayment bazaar and challenge verification.
* **Dr. T Cinema & Trib-House (`CinemaContainer.tsx`, `TribHouseContainer.tsx`)**: Multimodal biomedical media and living library commons.

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
├── .env.example                               # Environment template (zero secrets)
├── firebase-applet-config.json                # Firebase client configuration
├── firestore.rules                            # Firestore RBAC and ownership security rules
├── package.json                               # Dependencies & build scripts
├── server.impl.ts                             # Express server & Gemini API proxy routes
├── server.ts                                  # Full-stack server entry point
├── scripts/
│   ├── audit-secret-scan.cjs                  # Secret scanning utility
│   ├── test-microbiz-invariants.ts            # MicroBiz automated verification suite
│   ├── test-hashing-invariants.ts             # Cryptographic canonical serialization test
│   └── prepare-build-artifacts.cjs            # Multi-target build bundler
├── src/
│   ├── App.tsx                                # Main application orchestrator & navigation
│   ├── main.tsx                               # React DOM entry point
│   ├── services/
│   │   └── firebase.ts                        # Firebase SDK & Auth helpers
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx                     # Top primary navigation bar
│   │   │   └── CommandPalette.tsx             # Cmd+K quick navigation palette
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

## 🔄 GitHub Synchronization

To synchronize this codebase with the connected GitHub repository [`https://github.com/Zenieverse/Dr.-T`](https://github.com/Zenieverse/Dr.-T):

1. Click the **GitHub** button in the upper-right corner of the **Google AI Studio** interface.
2. Ensure the connected repository is `Zenieverse/Dr.-T` and branch is `main` (or your feature branch).
3. Review staged changes:
   * Updated `README.md` with complete platform documentation, architecture, and verification results.
   * `src/components/microbiz/` hardened components, services, and live auth state.
   * `server.impl.ts` safe JSON parse fixes on AI endpoints.
   * `firestore.rules` security rules.
   * `scripts/test-microbiz-invariants.ts` verification suite.
4. Commit with message:
   ```
   docs(readme): update repository documentation with Dr. T platform architecture, MicroBiz hardening, and verification results
   ```
5. Click **Commit & Push** to complete synchronization.

---

## 📄 License & Medical Disclaimer

* **License**: Licensed under the [MIT License](LICENSE).
* **Mandatory Medical Notice**: Dr. T is an educational wellness and clinical decision-support AI platform. It is NOT a replacement for a licensed healthcare professional, formal diagnosis, or medical treatment.
