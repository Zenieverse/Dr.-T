# Future Health Challenge 2026 — Master Submission Dossier
## Dr. T — Community Health Signal Intelligence (Population Health Track)

**Project:** Dr. T — Community Health Signal Intelligence (`#population-health`)  
**Track / Focus Area:** Population Health  
**Tagline:** *"From individual health signals to healthier communities."*  
**Repository:** `https://github.com/Zenieverse/Dr.-T`

---

## 1. Executive Summary

**Dr. T — Community Health Signal Intelligence** extends the existing Dr. T multimodal health platform into a production-hardened, privacy-first **Population Health intelligence, early-risk stratification, and closed-loop care navigation workspace**. Across 12 integrated modules at `#population-health`, community health coordinators, clinicians, care navigators, analysts, and evaluators can register consented community cohorts, ingest multi-source signals (`Health Alert Mini`, `Presage SmartSpectra`, lab & manual clinics), inspect explainable biomarker rules, track `k`-anonymity-protected trends, navigate referrals through a 6-stage follow-up loop, draft bilingual English/Tiếng Việt outreach with human gates, synthesize aggregated metrics with `gemini-3.8-flash` (plus a deterministic verified fallback), and enforce cryptographic RBAC with immutable audit logging.

---

## 2. Competition Track Fit (Population Health)

1. **Emerging Risk Pattern Detection:** Aggregates consented community telemetry across **Blood Health** (Haemoglobin/Ferritin), **Cardiometabolic Health** (BP/HbA1c/Glucose/eGFR), and **Maternal Health** (Gestational BP/Hb/ANC continuity).
2. **Population Needs & Privacy (`k`-Anonymity):** Computes Cohort × Region coverage while automatically suppressing subgroup cells and filtered dashboard/export slices whenever `0 < n < k` (default `k=5`).
3. **Prioritised Screening & Parity:** Applies uniform WHO / AHA / ADA / KDIGO thresholds (`Demographic Threshold Parity = 1.00`, zero race/gender multipliers) with explicit human review requirements and `"Not a medical diagnosis"` guardrails.
4. **Access Gaps & Closed-Loop Care Navigation:** Tracks overdue screenings (`>7 days`), rural outreach disparities, and 6-stage referrals (`SIGNAL_IDENTIFIED -> HUMAN_REVIEW -> SCREENING_ASSESSMENT -> REFERRAL_ISSUED -> FOLLOW_UP_IN_PROGRESS -> RESOLVED`).
5. **Multilingual Accessibility & Programme Impact:** Supports English and Tiếng Việt engagement templates with browser Speech API previews, separating **OPERATIONAL** metrics from longitudinal **CLINICAL_OUTCOME** proxies.

---

## 3. Team & Scope

- **Platform Scope:** Integrated directly inside the Dr. T monorepo (`server.impl.ts` + Vite React 18 SPA) with strict preservation of all existing Dr. T modules (`Health Alert Mini`, `Presage SmartSpectra`, `Vision Alert`, `MicroBiz PayFlow + DebtFree`, `PIANIST`, `ChatQuest Live`, `Gather & Glow`, `Solar Filament Lab`, `BuildArena S02`).
- **Clinical Authority Boundary:** Clinical decision-support and care-navigation software only. Does **not** autonomously diagnose, prescribe, or dispatch emergency services.

---

## 4. Technical Architecture & Integrations

- **Backend Security & API (`server.impl.ts`, `src/server/populationHealthAuth.ts`, `src/server/populationHealthService.ts`):**
  - Cryptographic RS256 Firebase ID Token verification via Google Secure Token public keys (`securetoken@system.gserviceaccount.com`).
  - Ephemeral session-isolated **Guest Sandbox** minted via `POST /api/population-health/guest-session` (`gdemo.<payload>.<hmac-sha256>`), bounded strictly to preview roles (`guest_demo`, `research_analyst`, `community_viewer`).
  - Bridges to existing Dr. T services: `evaluateHealthAlertHeuristics` (`HEALTH_ALERT_MINI`) and `PresageServerService` (`PRESAGE_OPTICAL`), plus `GeminiCircuitBreaker` (`gemini-3.8-flash`, `10000ms` timeout, non-secret `getDiagnostics()`).
- **Firestore Rules & Persistence Adapter (`firestore.rules`, `src/server/populationHealthFirestoreStore.ts`):**
  - `firestore.rules` (covering all 7 `population_*` collections with canonical `'programme_manager'` + `'population_health_manager'`) **DEPLOYED** to project `gen-lang-client-0611153209`.
  - Full idempotent Firestore REST v1 repository (`PopulationHealthFirestoreStore`) implementing startup hydration (`loadFullSnapshot`), write-through `syncSnapshot` with retry on `409`/`429`/`503`, append-only `population_audit_logs` (`POST ?documentId=`), PDPL erasure `deleteDocument`, and strict zero-write isolation for Guest Sandbox sessions.
  - Transparently surfaces `FIRESTORE_LIVE`, `FILE_SANDBOX_FALLBACK` (`.data/population-health-state.json`), or `EPHEMERAL_GUEST_SANDBOX` via `/api/population-health/health` and UI status cards.

---

## 5. Security & Authentication Audit Summary

- **Fail-Closed Endpoints:** All `/api/population-health/*` business routes reject missing or invalid `Authorization: Bearer` tokens with HTTP `401 UNAUTHORIZED`. Spoofing `X-Population-Role: platform_admin` without a verified admin token returns `401`/`403`.
- **Privilege Escalation Prevention:** Authenticated Firebase users default to least-privilege `community_viewer` unless verified `zenieverse@gmail.com` (`email_verified: true`) or carrying verified custom staff claims. Guest Sandbox sessions receive HTTP `403 FORBIDDEN` on `platform_admin`, `programme_manager`, `clinician`, `care_navigator`, `PATCH /governance/k-threshold`, and `DELETE /participants/:id`.
- **Rate Limiting & Transport Headers:** Sliding-window per-actor/IP rate limiters (`checkRateLimit`) plus `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, and `Cache-Control: no-store`.

---

## 6. Privacy, Consent, PDPL & `k`-Anonymity Compliance

- **Active Consent & Dynamic Revocation:** Revoked/pending participants (`PART-SYN-REV-01`) are excluded synchronously from risk scoring, observations, referrals, and AI prompts.
- **Direct PII Rejection (`containsDirectIdentifier`):** Rejects emails, US/international phones, Vietnamese `+84`/`09x` mobile numbers, Vietnamese 12-digit CCCD national IDs, and SSNs with HTTP `400`.
- **PDPL (Vietnam Law No. 91/2025/QH15 & Decree 356/2025/ND-CP) & Erasure:** Dedicated `DELETE /api/population-health/participants/:id` (`platform_admin` only) erases observations, risk signals, and referrals while marking the consent ledger revoked.
- **Filter-Bypass Privacy Defense:** Filtering any dashboard or JSON export slice to `0 < consented < k` forces `kpis.suppressedForPrivacy = true`, `trends = []`, and `trendsSuppressedForPrivacy = true`.

---

## 7. Clinical Safety, Bias & Non-Diagnostic Boundaries

- Every risk signal carries `nonDiagnosticNotice`, `humanReviewRequired: true`, linked `contributingObservations`, and clinician review actions (`NEW -> ACKNOWLEDGED -> ACTIONED -> DISMISSED`).
- **Urgent Triage Redirect Notice:** Explicitly clarifies internal referral redirect only (`Vietnam: 115 | US/Canada: 911 | EU: 112 | UAE: 998`); Dr. T never dials ambulances automatically.
- **Fairness Honesty Label:** Displays *Uniform Biomarker Cutoffs (No Demographic Multipliers; Parity != Clinical Fairness Proof)* — transparently noting cutoff parity does not claim validated epidemiological equity across external populations.

---

## 8. Judge Guest Access & End-to-End Walkthrough

- Judges open `http://localhost:3000/#population-health` (no Birthday modal interruption) and either immediately begin in **Guest Sandbox Mode** or click **`CONTINUE AS GUEST`** with zero login credentials required.
- Guided **End-to-End Demo Flow** bar jumps smoothly across the 5 primary demonstration stages, and **`Verify Server 403 Boundary`** in Governance tests server RBAC live from the browser.

---

## 9. Software Bill of Materials (SBOM) & Third-Party Licences (from `package.json`)

| Package | Version Spec | Licence | Role in Dr. T / Population Health |
|---|---|---|---|
| `react` / `react-dom` | `^18.3.1` | MIT | Core frontend UI rendering |
| `express` | `^5.2.1` | MIT | Server HTTP routing & middleware |
| `@google/genai` | `latest` | Apache-2.0 | Server-side Gemini (`gemini-3.8-flash`) proxy |
| `firebase` | `^12.18.0` | Apache-2.0 | Client Firebase Auth sign-in (`GoogleAuthProvider`) |
| `@smartspectra/node-sdk` | `^3.4.0` | Commercial / SDK Licence | Presage optical telemetry diagnostics bridge |
| `@hashgraph/sdk` | `^2.81.0` | Apache-2.0 | Existing Dr. T Hedera module (preserved) |
| `lucide-react` | `^0.475.0` | ISC | Monochrome UI icons |
| `clsx` / `tailwind-merge` | `^2.1.1` / `^2.6.0` | MIT | Class merging utilities |
| `cors` | `^2.8.6` | MIT | Server CORS policy |
| `canvas-confetti` | `^1.9.4` | ISC | Existing Dr. T celebration UX |
| `vite` / `typescript` / `tailwindcss` / `tsx` / `esbuild` | DevDeps (`^6.1.0`, `^5.7.3`, `^4.0.0`, `^4.23.12`, `^0.28.2`) | MIT / Apache-2.0 | Build, typecheck, bundling, and test runner |

*(Note: Presage `@smartspectra/node-sdk` remote model features remain gated under Presage's SDK terms and require `PRESAGE_API_KEY` at runtime.)*

---

## 10. Honest Verification Status

| Capability | Status | Evidence & Notes |
|---|---|---|
| Live Cloud Firestore Server Persistence (`FIRESTORE_LIVE`) | **INTEGRATION VERIFIED** | `/api/population-health/health?refresh=1` returns `HTTP 200` and `persistenceStatus.mode === "FIRESTORE_LIVE"` (`durableAcrossRestarts: true`) against `gen-lang-client-0611153209` / `ai-studio-drt-2e1619d9-9932-4538-9b6c-26b489ebfec2`. Verified real Firestore writes (`PART-MWK4DUQN`, `REF-MWK4DUQW`), idempotent updates (`21 -> 21`), append-only audit logs (`2 -> 8`), zero Guest Firestore writes (`PART-MWK4E952` -> `HTTP 404`), actual server restart hydration after deleting `.data/population-health-state.json`, and PDPL erasure (`HTTP 404`) |
| Firestore Rules Deployment (`firestore.rules`) | **DEPLOYED & VERIFIED** | Hardened rules (preserving all Dr. T collections + `population_*` + append-only `population_audit_logs`) deployed to `gen-lang-client-0611153209` (`test-firestore-security-rules.ts`: **28 PASSED, 0 FAILED**) |
| 12 Population Health Workspaces UI & Guest Flow | **LOCALLY VERIFIED** | Playwright E2E on `http://localhost:3000/#population-health`: 12/12 workspaces rendered, PII blocked, CSV downloaded, AI + referral flows verified, `PopulationHealthModule` mobile width `390 <= 390`, 0 page errors, 0 HTTP 5xx |
| Security, Cryptographic Auth, Guest Isolation & `k`-Anonymity | **VERIFIED** | `npm run test:population-health` (**62 PASSED, 0 FAILED**) |
| Future Health Fairness & Existing Dr. T Regression Suites | **VERIFIED** | `test-future-health.ts` (**28 PASSED, 0 FAILED**), `test-health-alert.ts` (**46 PASSED, 0 FAILED**), `test-presage-sense.ts` (**5/5 groups PASSED**), `test-vision-alert.ts` (**51/51 PASSED**), `test-solar-filament.ts` (**10/10 PASSED**) |
| Gemini AI Server Proxy (`gemini-3.8-flash` + Fallback) | **LIVE_AI VERIFIED (+ Fallback Tested)** | `/api/population-health/health` confirms `hasGeminiKey: true`; live `POST /api/population-health/ai/synthesize` returned `HTTP 201` with `isAiGenerated: true`, `fallbackEngaged: false`, `geminiDiagnostics.status: "LIVE_AI"` (`gemini-3.8-flash (Server-Side Proxy)`), and transient upstream timeouts verified deterministic fallback (`isAiGenerated: false`) |
| Cloud Run Dev Container Runtime (`K_SERVICE=ais-dev-4s4jvpipr3mh3mz6x2hpfp`) | **CONTAINER VERIFIED / EXTERNAL PROXY GATED** | Dev container serves `:3000` & nginx `:8080` (`HTTP 200`, `FIRESTORE_LIVE`); anonymous external HTTPS requests to `ais-dev-*` & `ais-pre-*` are redirected (`HTTP 302 -> /__cookie_check.html` / `applet-auth-bridge`) by AI Studio's Google authentication proxy |
| Production Cloud Run Promotion (`ais-pre-4s4jvpipr3mh3mz6x2hpfp`) | **NOT MODIFIED (Stopped Before Prod)** | Per deployment policy, `ais-pre-*` production service was intentionally left untouched |

---

## 11. Remaining Production Promotion Blockers & Recommendations

1. **Optional Optical Sensor Key (`PRESAGE_API_KEY`):** Not configured in this environment; optical intake remains cleanly labelled `SIMULATED` / `UNAVAILABLE`.
2. **Institutional Approvals & Production (`ais-pre-*`) Promotion:** Before promoting `ais-pre-4s4jvpipr3mh3mz6x2hpfp` for live clinical operations, obtain institutional DPO/clinical safety sign-offs, verify `roles/datastore.user` on the production runtime service account in `gen-lang-client-0611153209`, deploy the verified revision, and confirm `GET /api/population-health/health?refresh=1` reports `FIRESTORE_LIVE`.
