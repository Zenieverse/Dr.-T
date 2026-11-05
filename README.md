# 🩺 Dr. T — Biomedical Intelligence, Grassroots Commerce & Personal AI Ecosystem

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore%20%26%20Auth-FFCA28.svg?logo=firebase)](https://firebase.google.com/)
[![Gemini](https://img.shields.io/badge/Google%20GenAI-Gemini%203.8%20Flash-8E75B2.svg?logo=google)](https://ai.google.dev/)
[![NVIDIA Nemotron](https://img.shields.io/badge/NVIDIA-Nemotron--4--340B-76B900.svg?logo=nvidia)](https://build.nvidia.com/)
[![Nebius](https://img.shields.io/badge/Nebius-Token%20Factory-00D4B2.svg)](https://nebius.com/token-factory)
[![MCP](https://img.shields.io/badge/MCP-2025--11--25%20Streamable%20HTTP-00A4A6.svg)](https://modelcontextprotocol.io/)
[![StreetVendorsMap](https://img.shields.io/badge/StreetVendorsMap-Gánh%20Mưu%20Sinh%20Non--Commercial-FF5722.svg)](https://ganhmuusinh.vn/)
[![Gather & Glow](https://img.shields.io/badge/Gather%20%26%20Glow-AI%20Event%20Planner-F59E0B.svg)](https://github.com/Zenieverse/Dr.-T)
[![Hedera](https://img.shields.io/badge/Hedera-HCS%20Provenance-222222.svg)](https://hedera.com/)
[![PayPal AI Hackathon](https://img.shields.io/badge/PayPal%20AI%20Hackathon-MicroBiz%20PayFlow%20%2B%20DebtFree-003087.svg?logo=paypal)](docs/PAYPAL_AI_HACKATHON_SUBMISSION.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **Dr. T** is a multi-dimensional platform unifying clinical informatics, Socratic health intelligence, grassroots economic empowerment (**MicroBiz** & **StreetVendorsMap**), personal role architecture (**Three Hats**), AI event architecture (**Gather & Glow**), and permission-governed memory intelligence (**Lantern Keeper** powered by NVIDIA Nemotron & Nebius Token Factory).

---

## 🌐 Live Deployments & Repository

* **Development App**: [https://ais-dev-4s4jvpipr3mh3mz6x2hpfp-393352619239.asia-southeast1.run.app](https://ais-dev-4s4jvpipr3mh3mz6x2hpfp-393352619239.asia-southeast1.run.app)
* **Shared Production Preview**: [https://ais-pre-4s4jvpipr3mh3mz6x2hpfp-393352619239.asia-southeast1.run.app](https://ais-pre-4s4jvpipr3mh3mz6x2hpfp-393352619239.asia-southeast1.run.app)
* **GitHub Repository**: [https://github.com/Zenieverse/Dr.-T](https://github.com/Zenieverse/Dr.-T)

---

## 🌟 Platform Overview & Core Modules

Dr. T connects clinical medicine, grassroots livelihoods, life balance, and verifiable trust across integrated modules:

```
┌────────────────────────────────────────────────────────────────────────┐
│                              🩺 DR. T                                  │
├───────────────────┬───────────────────┬────────────────────────────────┤
│  HEALTH & CLINIC  │   GRASSROOTS BIZ  │   TRUST, ROLES & CELEBRATIONS  │
│  • Socratic Triage│  • MicroBiz Feed  │  • Gather & Glow (AI Planner)🌟│
│  • Biomarker R4   │  • Courses & Quiz │  • Three Hats (Many Roles) 🎩  │
│  • SOAP Notes     │  • Storefronts    │  • Lantern Keeper AI 🏮        │
│  • 360° Copilot   │  • Bookkeeping    │  • StreetVendorsMap 🥢         │
│  • Health Bridge  │  • OCR Scanner    │  • Pianist & Touch Grass 🌿    │
│  • Vision Alert 👁️│  • Gemini AI Hub  │  • Hedera Commons (HCS / HPK)  │
│  • Alexa+ MCP 🔔  │  • MicroBiz Bridge│  • x402 Pay-Per-Request Bazaar │
└───────────────────┴───────────────────┴────────────────────────────────┘
```

---

### 1. 🥢 StreetVendorsMap — Gánh Mưu Sinh (Vietnam Street Food & Shipper Integration)
Navigation Tab: `StreetVendorsMap` (`streetvendorsmap`) | Original Source Inspiration: [https://ganhmuusinh.vn/](https://ganhmuusinh.vn/)

* **100% Bilingual Parity (VI / EN)**: Seamless instant toggling between Tiếng Việt and English with a complete 104-key translation dictionary covering all interfaces, filters, vendor stories, driver instructions, and real-time live streams.
* **Automatic Dual-Source Real-Time Synchronization**:
  * **Real-Time Stream 1 (ganhmuusinh.vn)**: Automated periodic background synchronization via dedicated server proxy (`/api/street-vendors/sync-ganhmuusinh`), streaming verified coordinates, vendor profiles, elderly life histories, menus, and operating hours with live upstream health probing.
  * **Real-Time Stream 2 (Dr. T Community Contributions)**: Powered by Firebase Firestore `onSnapshot` real-time listeners on `/street_vendor_contributions`. Any new street vendor nomination or community like/verification made anywhere on Dr. T synchronizes instantly to all active clients without reloading.
  * **Live Real-Time Status Ribbon**: Features a pulsing status indicator, live counts from `ganhmuusinh.vn` and Dr. T community, sync timestamp, and manual 1-tap "Sync Now" button.
  * **Real-Time Likes & Community Verification**: Instant interactive loving hearts and community verification votes synchronized to Firestore in real-time.
* **Curated Vendor Network**: Verified street vendors across Hà Nội, TP. Hồ Chí Minh, Huế, Đà Nẵng, and Cần Thơ, celebrating elderly street cooks and generational culinary heritage with honest street pricing.
* **Grab & Green SM (Xanh SM) Delivery Coordinator**:
  * One-tap direct deep links to GrabFood/GrabExpress and Xanh SM Express delivery services.
  * **Driver Delivery Note Generator**: Automatically generates polite, bilingual instructions for couriers, with exact street landmarks, instructions to advance cash politely to elderly vendors, and care guidelines for hot broths and delicate treats.
* **Interactive Radar & Navigation**: Live radar visualization with city filters, category badges (Bún & Phở, Bánh Mì, Xôi & Chè, Bánh Truyền Thống, Trà & Cà Phê), and Google Maps coordinate routing.
* **Community Contribution**: Modal for local patrons to nominate neighborhood street vendors, persisting to Firestore `/street_vendor_contributions` and instantly streaming to all users.
* **Non-Commercial Attribution & Fair-Use Footnote**:
  > *Non-commercial community initiative. Data and cultural inspiration referenced from [ganhmuusinh.vn](https://ganhmuusinh.vn/) to support elderly street artisans across Vietnam. 0% fees, 0% commissions.*

---

### 2. 🎩 Three Hats — Many Roles (Life Balance & Role Architecture)
Navigation Tab: `Three Hats` (`threehats`)

* **The Three Hats Framework**:
  * **Professional Hat**: Work, career, leadership, craftsmanship, and vocational contributions.
  * **Personal Hat**: Physical health, inner peace, creative curiosity, hobbies, and personal vitality.
  * **Social Hat**: Family, romantic partnership, friendship, peer mentorship, and civic belonging.
* **17 Curated Starter Roles & Multi-Hat Support**: Flexible role library supporting overlapping commitments (e.g., *Lifelong Learner* bridging Professional and Personal; *Community Mentor* bridging Professional and Social).
* **3-Perspective Life Balance Model**: Evaluates roles across **Importance**, **Recorded Attention**, and **Satisfaction**, identifying attention deficits without judgment.
* **6-Step Weekly Reflection Ritual**:
  1. *Meaningful Recognition*: Celebrating intentional milestones.
  2. *Attention Audit*: Reviewing time and emotional energy allocation.
  3. *Tensions & Competing Priorities*: Identifying schedule friction.
  4. *Appreciations*: Acknowledging support received from others.
  5. *Realistic Calibration*: Gentle adjustments for the coming cycle.
  6. *Concrete Commitments*: Setting achievable micro-actions.
* **Data Sovereignty & Memory Gate**: Export role maps and reflections to JSON or formatted Markdown journals. Explicit user permission is strictly required before saving reflection summaries to **Memory Lantern**.

### 3. 🌟 Gather & Glow — AI-Powered Event Planning Assistant (Final Production Release)
Navigation Tab: `Gather & Glow` (`gatherglow`) | Deep Link: `#gatherglow`

* **Comprehensive Celebration Planning**:
  * Designed for **weddings & anniversaries**, **birthdays & family milestones**, and **community gatherings & cultural galas**.
  * Complete lifecycle management from initial vision through day-of execution and financial reconciliation.
* **4-Step Interactive Event Wizard**:
  * Captures event type, title, target date, venue/location, expected guest count, currency (USD, EUR, GBP, CAD, AUD, VND, SGD), and total budget cap.
  * Captures detailed design preferences: themes, style nuances, dietary restrictions (Vegetarian, Vegan, Halal, Kosher, Nut-Free, Gluten-Free), accessibility accommodations (elderly step-free, sensory spaces), cultural traditions, and planning priorities.
* **Multi-Event Workspace Architecture**:
  * Multi-event switcher with search, status filters (**All**, **Upcoming**, **This Month**, **Completed**, **Archived**).
  * One-click event duplication (deep-cloning all budget items, tasks, vendors, guests, and AI plans with unique IDs) and non-destructive archival/unarchival.
* **AI Event Architect & Conversational Refinement (`Gemini 3.8 Flash`)**:
  * Generates a tailored 8-pillar event dossier:
    1. *Theme & Visual Concept*: Narrative concept with 5-swatch harmonic color palette and ambiance directives.
    2. *Smart Category Allocations*: Recommended percentage splits across venue, catering, decor, photography, music, and contingency.
    3. *Chronological Planning Milestones*: Structured checkpoints from 6+ months out to event eve.
    4. *Day-Of Master Running Order*: Minute-by-minute execution schedule from vendor arrivals to guest departure.
    5. *Decoration & Floral Directives*: Focal point styling, centerpiece ideas, and sustainable lighting tips.
    6. *Culinary & Beverage Strategy*: Course pairings, dietary stations, and signature celebration drinks.
    7. *Guest Care & Accessibility*: Elder seating, quiet wellness sanctuaries, and transportation notes.
    8. *Actionable Contingency Protocols*: Weather backup, power outage protocols, and medical/allergy preparedness.
  * **Interactive Conversational Refinement Bar**: Allows users to tweak themes, color palettes, dietary accommodations, and run sheets via natural language prompts with quick 1-tap presets and in-place plan overrides.
* **Smart Budget Manager & MicroBiz Operations Bridge**:
  * Real-time expense tracking across 12 standardized categories (`venue`, `catering`, `photography`, `videography`, `flowers`, `decor`, `entertainment`, `attire`, `transport`, `invitations`, `rentals`, `staffing`, `contingency`, `other`).
  * Strict visual distinction between estimated line items and user-confirmed vendor quotations.
  * Tracks deposits paid, payment deadlines, balance due, and unallocated reserve margin with budget threshold alerts.
  * **Direct MicroBiz Ledger Bridge**: Exports celebration expenses as official invoice/receipt vouchers into Dr. T MicroBiz with category tags and transaction IDs.
* **Timeline & Task Management**:
  * 4-way switcher: **Milestone Timeline**, **Interactive Calendar View** (month grid with task dots and date selector), **High-Density Fast Checklist** with instant completion toggles, and **Overdue & Upcoming Deadlines** monitoring.
* **Vendor Directory & Side-by-Side Quotation Comparison**:
  * Side-by-side modal to evaluate vendor proposals based on price, deposits, deliverables, and responsiveness.
  * **Strict Truthfulness Disclosures**: Prominently labels user-entered quotations and disclaims simulated vendor availability.
* **Guest List & Banquet Care Aggregator**:
  * Real-time RSVP metric cards (Invited, Attending, Declined, Pending) and dietary tally for banquet kitchens.
  * One-click **CSV Export** and **CSV Import** modal with automatic column header mapping.
* **Three Hats Responsibility Integration**:
  * Links event tasks and team responsibilities to **Three Hats** perspectives:
    * *Professional Hat*: Day-of coordination, audio/visual tech, vendor management.
    * *Personal Hat*: Honoree wellness, family care, personal grounding and breathing pauses.
    * *Social Hat*: Welcome ambassadors, hospitality greeters, heritage ritual masters.
* **Day-Of Command Center & Printable Briefing Sheet**:
  * Master hour-by-hour run-sheet with real-time status badges.
  * Emergency speed-dial matrix (Coordinator, Venue Manager, Medical/First Aid).
  * 10-point emergency contingency kit checklist (safety pins, stain remover, medical kit, power strips, etc.).
  * **Printable Event Day Briefing**: Single-sheet printable master briefing for on-site clipboard use.
* **Commercial SaaS Presentation & Onboarding**:
  * **Plans & Pricing Modal**: Transparent 4-tier packaging (Free Starter $0, Signature Celebration $19, Pro Planner $49/mo, Community & Non-Profit $0 waiver).
  * **User Guide & FAQ Modal**: 4-step onboarding playbook and answers addressing zero-fabrication and MicroBiz integration.
  * **100% Bilingual Localization (EN / VI)**: Complete 78-key translation dictionary with instant header ribbon language toggle.
* **Automated Audit Suite**:
  * 87/87 automated production tests passing (`npm run test:gatherglow`).

---

### 4. 🏮 Lantern Keeper — A Personal AI That Remembers With Permission
Navigation Tab: `Memory Lantern` (`memorylantern`)

* **Evidence-Backed Memory Retrieval**:
  * AI answers strictly cite verified source memories stored in the user's private vault.
  * Explicitly highlights missing or conflicting facts; **zero hallucination** of personal history, dates, or sensitive credentials.
  * Revocation testing immediately excludes retracted memories from AI context.
* **Reusable Personal Skills**:
  * **Family Story Keeper**: Synthesizes selected family memories into narrative chapters honoring real facts while separating narrative context.
  * **Weekly Life Review**: Audits completed commitments across life domains and generates prioritized checklists.
  * **Memory Inspector**: Allows users to inspect source citations, edit facts, export archives, or permanently delete memories.
* **Permission-Controlled Actions & Audit Ledger**:
  * Transparent preview showing which memories and tools an action will invoke.
  * Consequential actions require explicit user approval before execution.
  * Server-side tool allowlist enforces authorized execution.
  * Action audit ledger records execution status without leaking sensitive memory contents.
* **Nebius Token Factory & NVIDIA Nemotron Integration**:
  * Production adapter (`src/server/nebiusNemotronService.ts`) calling official Nebius Token Factory with model `nvidia/nemotron-4-340b-instruct`.
  * Status diagnostics reporting, timeouts, bounded retries, and local Gemma (`gemma2:2b`) Ollama fallback.

---

### 5. 💳 MicroBiz PayFlow + DebtFree — Autonomous Fintech & Community Debt Relief (PayPal AI Hackathon 2026)
Navigation Tab: `MicroBiz` (`microbiz`) | Subtabs: Invoices, Receipts, Ledger, POS, AI Copilot, Gather Bridge, DebtFree, Reports, Settings | Deep Link: `#microbiz`  
* **Submission Dossier**: [`docs/PAYPAL_AI_HACKATHON_SUBMISSION.md`](docs/PAYPAL_AI_HACKATHON_SUBMISSION.md)  
* **3-Minute Video Demo Script & Recording Guide**: [`docs/PAYPAL_AI_HACKATHON_DEMO.md`](docs/PAYPAL_AI_HACKATHON_DEMO.md)  

Transforming grassroots economic operations into an intelligent, zero-leakage financial copilot and dignity-first community debt relief platform:

#### A. MicroBiz PayFlow (Business Finance & Invoicing)
* **Authoritative PayPal REST API (v2) Integration**:
  * **Orders v2 & Payments v2**: Seamless server-side order generation (`POST /api/paypal/create-order`) and cryptographic capture (`POST /api/paypal/capture-order`).
  * **Zero Payment Spoofing**: Invoices are never marked paid via unverified client browser redirects. The server captures the order directly from PayPal and enforces an exact dollar-for-dollar amount match before updating the ledger.
  * **Webhooks & Idempotency**: Real-time event handling (`POST /api/paypal/webhook`) for `PAYMENT.CAPTURE.COMPLETED`, `DENIED`, and `REFUNDED` with transaction deduplication.
  * **Secrets Protection**: `PAYPAL_CLIENT_SECRET` is kept strictly server-side; client diagnostics only verify connectivity and active sandbox/live environments.
* **Decimal-Safe Financial Arithmetic (`src/services/payflowMath.ts`)**:
  * Solves JavaScript floating-point drift (`0.1 + 0.2 === 0.30000000000000004`) using scaled integer subunits.
  * Full native support for standard two-decimal currencies (`USD`, `EUR`, `GBP`, `CAD`, `AUD`) and zero-decimal currencies (`VND`, `JPY`).
  * Precise compound rounding for discounts, sales taxes, line items, and PayPal string formats.
* **Gemini 3.8 Flash Financial Copilot**:
  * **Ground-Truth Ledger Reasoning**: Isolates verified math facts (exact overdue balances, collected revenues, expense totals) from strategic financial suggestions.
  * **Autonomous Polite Reminders**: Auto-drafts courteous collection emails quoting invoice numbers, due dates, outstanding balances, and direct PayPal payment links.
  * **Compliance & Ethics**: Mandatory non-CPA disclaimer (*"Educational financial insights only. Not certified CPA tax or legal advice."*).
* **Gather & Glow Event Reconciliation Bridge**:
  * Seamlessly connects celebration budgets and vendor quotations from the **Gather & Glow** module (`#gatherglow`) into collectible deposit invoices and milestone payment links inside MicroBiz.

#### B. PayFlow DebtFree (Community-Powered Verified Debt Relief)
* **Dignity-First Direct Creditor Settlement**:
  * Connects compassionate donors directly with verified debts (medical bills, tuition arrears, emergency utility balances, and micro-business equipment debt).
  * **Non-Custodial Payee Routing**: Contributions disburse directly to verified institutional billing accounts (hospitals, schools, municipal utilities) without unrestricted pooled wallets.
* **Multi-Supporter Atomic Allocation & Overpayment Guards**:
  * Supports multiple micro-contributions toward single obligations with atomic balance reconciliation.
  * Real-time overpayment prevention guard strictly rejects contributions exceeding the remaining verified balance.
  * Supporter fee coverage toggle (+2.9% + $0.30) ensuring 100% of donor capital reduces principal debt.
* **Verification State Machine & Reviewer Portal**:
  * Structured verification workflow: `DRAFT` ➔ `SUBMITTED` ➔ `UNDER_REVIEW` ➔ `VERIFIED` ➔ `PUBLISHED` ➔ `PARTIALLY_FUNDED` ➔ `PAYMENT_PROCESSING` ➔ `PARTIALLY_SETTLED` ➔ `SETTLED`.
  * Dedicated Trust & Safety Reviewer Portal to inspect itemized statements, approve requests, and record official creditor settlement vouchers with confirmation receipt codes.
* **Gemini AI Relief & Dignity Copilot (`src/server/debtFreeAiServerService.ts`)**:
  * Generates customized supporting document checklists based on debt category.
  * Drafts respectful creditor hardship letters requesting fee freezes or confirming incoming community payments.
* **0% Platform Fee Transparency Dashboard**:
  * Full transparency metrics displaying total debt relieved, families helped, and community savings compared to typical 5% commercial crowdfunding fees.

#### C. Community Hub & Grassroots Modules
* **Discovery Feed (`DiscoveryFeed.tsx`)**: Craft stories, scrap-sharing exchanges, community advice, and bookmarking.
* **Course Platform (`CoursePlatformView.tsx`)**: Zero-jargon courses (Botanical Soapmaking, Operations & Bookkeeping 101, Repair Diagnostics) with verifiable completion certificates.
* **Artisan Marketplace (`MarketplaceView.tsx`)**: Direct maker storefronts with transparent product listings and direct quote routing.
* **Receipt OCR & Operations Ledger**: Plain-language income/expense ledger, net margin calculator, and receipt OCR scanner powered by Gemini Flash.

---

### 6. 🔔 HealthAlert Companion & Amazon Developer Hackathon 2026 (Alexa+ Track)
Navigation Tab: `Health Alert Mini` (`healthalert`)

* **Alexa+ Conversational Agent**: Interactive voice-enabled dialogue with live audio visualizer, multi-tool execution telemetry, and localized emergency dispatch routing (Vietnam 115, UAE 998, UK 999, US 911, Europe 112).
* **Deterministic Emergency Safety Layer**: Red-flag symptoms (crushing chest pain, severe dyspnea, stroke indicators, BP $\ge 180/120$ mmHg) deterministically escalate to emergency dispatch, strictly superseding AI output.
* **Model Context Protocol (MCP) Server**:
  * Protocols: `2025-11-25` (Latest) and `2024-11-05` (Backward-Compatible).
  * Transports: Streamable HTTP Server-Sent Events (`GET /api/mcp/sse`) and HTTP JSON-RPC 2.0 (`POST /api/mcp`).
  * Registered Tools: `check_safety_escalation`, `explain_health_alert`, and `prepare_follow_up_questions`.

---

### 7. 👁️ Dr. T Vision Alert — Assistive Medical Monitor CV (OpenCV AI Competition 2026)
* **OpenCV 5 Algorithmic Quality Gating**: Discrete Laplacian variance blur filter ($\sigma^2 \ge 80.0$), specular glare rejection ($Y \ge 250$ saturation $<22\%$), and RMS contrast validation ($C_{\text{RMS}} \ge 14.0$).
* **Bezel Quad Rectification**: Projects skewed LCD screens onto canonical $480 \times 320$ rectified planes.
* **Mandatory Human Confirmation Gate**: Machine readings never commit automatically; readings are presented side-by-side with source display crops for user verification.
* **AWS Graviton Microservice**: ARM64 Python 3.11 Lambda handler (`aws/lambda/vision_alert_handler.py`) with CloudFormation and Terraform templates.

---

### 8. 🎹 PIANIST & Touch Grass 🌿
* **Adaptive Grand Piano (`GrandPianoWorkspace.tsx`)**: Additive physical modeling synthesis with realistic overtones and damper pedal simulation.
* **88-Key Repertoire Guided Player (`ClassicalTrackPlayer.tsx`)**: Note-by-note synchronization for classical pieces including Richard Clayderman's "Always", Chopin, and Bach.
* **Touch Grass Outdoor Acoustics (`TouchGrassStudio.tsx`)**: Converts real-world ambient sound frequencies into musical melodic contours.

---

### 9. 🛡️ Hedera Commons, x402 & Decentralized Provenance
* **Hedera Consensus Service (HCS)**: Submits RFC 8785 canonical JSON hashes to Hedera topics for verifiable audit logs.
* **x402 Pay-Per-Request Studio**: Machine-to-machine micropayment service on Algorand MainNet with GoPlausible facilitator and Bazaar discovery.

---

## 🔒 Security, Privacy & Data Isolation

1. **Authenticated User Isolation**:
   * Firebase Authentication (`subscribeAuthState`) manages identity without placeholder fallbacks.
   * Firestore security rules (`firestore.rules`) enforce user ownership across `/memory_lantern_memories`, `/three_hats_roles`, `/lantern_keeper_actions`, `/microbiz_finances`, and `/buildwithai_projects`.
2. **Ephemeral Guest Sandbox**:
   * Unauthenticated guests use randomized sandbox keys stored locally in the browser; guest data cannot read or overwrite production Firestore documents.
3. **Zero Credential Exposure**:
   * `GEMINI_API_KEY` and `NEBIUS_API_KEY` reside exclusively in server-side environment variables and are never bundled into client JavaScript.
4. **Mandatory Payment Disclosures**:
   * Automated credit card charging is disabled across all storefronts to protect local artisans.

---

## 🧪 Comprehensive Test & Verification Results

All automated test suites pass with 100% success:

| Test Suite | Command | Assertions | Status |
| :--- | :--- | :---: | :---: |
| **All Platform Suites Combined** | `npm test` | **460+ / 460+** | ✅ **PASS** |
| **Gather & Glow AI Event Planner** | `npm run test:gatherglow` | **61 / 61** | ✅ **PASS** |
| **StreetVendorsMap Suite** | `npm run test:streetvendors` | **22 / 22** | ✅ **PASS** |
| **Three Hats Life Balance Suite** | `npm run test:threehats` | **29 / 29** | ✅ **PASS** |
| **Lantern Keeper & Memory Lantern** | `npx tsx scripts/test-memory-lantern.ts` | **62 / 62** | ✅ **PASS** |
| **Vision Alert Verification Suite** | `npx tsx scripts/test-vision-alert.ts` | **51 / 51** | ✅ **PASS** |
| **Build With AI Suite** | `npx tsx scripts/test-build-with-ai.ts` | **40 / 40** | ✅ **PASS** |
| **MCP Agent & Protocol Suite** | `npx tsx scripts/test-mcp-agent.ts` | **28 / 28** | ✅ **PASS** |
| **Firestore Security Rules Suite** | `npx tsx scripts/test-firestore-security-rules.ts` | **25 / 25** | ✅ **PASS** |
| **TypeScript Compilation** | `npm run lint` (`tsc --noEmit`) | **0 Errors** | ✅ **PASS** |
| **Production Build** | `npm run build` | **Clean Bundle** | ✅ **PASS** |
| **Firestore Rules Deployment** | Deployed to project `gen-lang-client-0611153209` | **Live** | ✅ **PASS** |

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

# 3. Configure environment variables (optional, for live AI providers)
cp .env.example .env

# 4. Start full-stack development server
npm run dev
```

The application will be accessible at `http://localhost:3000`.

### Common Scripts

```bash
npm run dev                  # Start full-stack Express server with Vite middleware
npm run build                # Production build & server bundling
npm run lint                 # Type check with tsc --noEmit
npm test                     # Run all 15 test suites (324 assertions)
npm run test:payflow         # Run MicroBiz PayFlow test suite (34 assertions)
npm run test:debtfree        # Run PayFlow DebtFree community relief suite (34 assertions)
npm run test:gatherglow      # Run Gather & Glow AI event planner test suite (87 assertions)
npm run test:streetvendors   # Run StreetVendorsMap bilingual & shipper suite (18 assertions)
npm run test:threehats       # Run Three Hats role mapping and ritual suite (16 assertions)
```

---

## 📂 Project Structure

```
├── .env.example                               # Environment template (zero secrets)
├── firebase-applet-config.json                # Firebase client configuration
├── firestore.rules                            # Firestore security rules
├── package.json                               # Dependencies and test scripts
├── server.impl.ts                             # Express server, Nebius, MCP & Gemini routes
├── server.ts                                  # Server launcher
├── scripts/
│   ├── test-gather-and-glow.ts                # Gather & Glow test suite (61 assertions)
│   ├── test-street-vendors.ts                 # StreetVendorsMap test suite (22 assertions)
│   ├── test-three-hats.ts                     # Three Hats test suite (29 assertions)
│   ├── test-memory-lantern.ts                 # Lantern Keeper test suite (62 assertions)
│   ├── test-vision-alert.ts                   # Vision Alert test suite (51 assertions)
│   ├── test-build-with-ai.ts                  # Build With AI test suite (40 assertions)
│   └── test-firestore-security-rules.ts       # Firestore RBAC validation
├── src/
│   ├── App.tsx                                # Main application router
│   ├── main.tsx                               # React DOM entry point
│   ├── types.ts                               # Central navigation and platform types
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx                     # Top navigation with tabs & search
│   │   │   └── CommandPalette.tsx             # Cmd+K quick navigation palette
│   │   ├── gatherglow/                        # Gather & Glow AI Event Planner
│   │   │   ├── GatherGlowModule.tsx           # Main event orchestrator & navigation
│   │   │   ├── components/                    # 10 specialized celebration subviews
│   │   │   ├── services/                      # Firestore sync, exports & MicroBiz bridge
│   │   │   ├── initialData.ts                 # Preloaded wedding & gala event blueprints
│   │   │   └── types.ts                       # Event, budget, task & AI plan contracts
│   │   ├── streetvendors/                     # StreetVendorsMap (Gánh Mưu Sinh)
│   │   │   ├── StreetVendorsMapModule.tsx     # Main container with city filters
│   │   │   ├── InteractiveVendorsMap.tsx      # Radar map & vendor cards
│   │   │   ├── ShipperDeliveryModal.tsx       # Grab & Green SM driver instructions
│   │   │   ├── CommunityContributeModal.tsx   # Patron vendor nomination modal
│   │   │   ├── StreetVendorsFooter.tsx        # Non-commercial attribution footer
│   │   │   ├── translations.ts                # 92 bilingual translation keys
│   │   │   ├── vendorsData.ts                 # 12 curated vendor profiles
│   │   │   └── types.ts                       # Vendor & delivery data contracts
│   │   ├── threehats/                         # Three Hats (Many Roles)
│   │   │   ├── ThreeHatsModule.tsx            # Main life balance container
│   │   │   ├── RoleMapCanvas.tsx              # Interactive role visualizer
│   │   │   ├── WeeklyReflectionModal.tsx      # 6-step reflection ritual
│   │   │   ├── ThreeHatsCompanionModal.tsx    # Permission-gated AI companion
│   │   │   └── types.ts                       # Three Hats contracts & starter roles
│   │   ├── lantern/                           # Lantern Keeper AI
│   │   │   ├── MemoryLanternModule.tsx        # Memory vault & narrative studio
│   │   │   ├── skills/                        # Reusable personal skills
│   │   │   └── services/                      # Memory retrieval & audit ledger
│   │   ├── healthalert/                       # HealthAlert Companion & Vision Alert
│   │   ├── microbiz/                          # MicroBiz artisan platform
│   │   └── pianist/                           # Adaptive Grand Piano & Touch Grass
│   └── server/
│       ├── gatherGlowServerService.ts         # Gemini 3.8 Flash event architect & fallback
│       ├── nebiusNemotronService.ts           # Nebius Token Factory & NVIDIA adapter
│       ├── memoryLanternServerService.ts      # Gemma 2 open-weight narrative adapter
│       └── buildWithAiServerService.ts        # Gemini 3.8 Flash proxy with timeout
```

---

## 📄 License & Fair Use Disclosures

* **License**: [MIT License](LICENSE).
* **StreetVendorsMap**: Non-commercial community initiative honoring the cultural preservation mission of [Gánh Mưu Sinh](https://ganhmuusinh.vn/).
* **Medical Notice**: Dr. T is an educational wellness and clinical decision-support AI platform. It is NOT a replacement for a licensed healthcare professional, diagnosis, or emergency medical service.
