# Dr. T — Community Health Signal Intelligence
## Product Specification | Future Health Challenge 2026 (Population Health Track)

**Tagline:** *"From individual health signals to healthier communities."*

---

## 1. Mission & Focus Area Alignment

Dr. T — Community Health Signal Intelligence extends the existing Dr. T clinical and community platform into a full-stack **Population Health Intelligence & Care Navigation** workspace serving community clinics, municipal health coordinators, clinical triage teams, and public-health analysts inside `#population-health`.

Core capabilities:
1. **Identify emerging health-risk patterns** across consented cohorts without replacing clinical judgement.
2. **Understand health needs across cohorts** (Blood Health, Cardiometabolic Health, Maternal Health) with subgroup privacy protections (`k`-anonymity, filter-bypass protected).
3. **Prioritise screening and follow-up** via explainable WHO/AHA/ADA/KDIGO physiological thresholds (`humanReviewRequired: true`).
4. **Detect gaps in access and continuity** (overdue screenings, delayed referrals, small-group clinic suppression).
5. **Coordinate closed-loop care navigation** across a 6-stage pathway with multilingual outreach logs.
6. **Measure programme outcomes** separating **OPERATIONAL** metrics from **CLINICAL_OUTCOME** proxies.
7. **Communicate accessibly** (English & Tiếng Việt templates, Web Speech API readout previews, mandatory human approval gates).

---

## 2. Implemented Workspaces (12 Connected Views)

| # | Workspace | Verified Functional Capabilities |
|---|---|---|
| 1 | `Population Overview` | Privacy-safe KPI cards (suppressed if filtered `0 < n < k`), honest Persistence Status badge (`FIRESTORE_LIVE` / `FILE_SANDBOX_FALLBACK` / `EPHEMERAL_GUEST_SANDBOX`), interactive SVG trends, data provenance connectors, emergency redirect notice (`115/911/112/998`) |
| 2 | `Community Registry` | Searchable registry, pseudonymous registration rejecting emails/phones/SSN/VN CCCD/VN mobile, instant consent revocation & restoration, PDPL `Erase (PDPL)` admin action |
| 3 | `Health Signal Intake` | BP/HR/SpO2/Glucose/HbA1c/Hb/Ferritin/eGFR intake with outlier/staleness validation, Health Alert Mini heuristic bridge, Presage optical vitals bridge with explicit optical camera consent checkbox |
| 4 | `Population Risk Intelligence` | Explainable signal cards across 5 domains with `contributingObservations` links, guideline citations, clinician review status workflow (`ACKNOWLEDGED`, `ACTIONED`, `DISMISSED`), and honest cutoff parity label |
| 5 | `Community Health Trends` | Multi-series interactive SVG trend chart (suppressed cleanly when filtered `n < k`), Cohort × Region `k`-anonymity matrix, live CSV & filtered JSON exports |
| 6 | `Early Warning & Alerts` | Population trend/clinical/bottleneck queue, status review/escalation, toggleable alert rules, emergency internal redirect warning (`115/911/112`) |
| 7 | `Screening & Prevention Programmes` | Funnel tracking across cohorts (invited/consented/screened/completed/overdue), invite/completion recording, status toggle |
| 8 | `Care Navigation & Referral` | 6-stage closed-loop tracker (`SIGNAL_IDENTIFIED -> ... -> RESOLVED`), referral creation, EN/VI communication logs, overdue delay flags |
| 9 | `AI Health Research Assistant` | Server-side `gemini-3.8-flash` proxy with `GeminiCircuitBreaker` (`10s` timeout) & verified deterministic fallback; displays honest badge (`Live Gemini (AI-Generated)` vs `Deterministic Evidence Fallback (Not AI-Generated)`), observed-vs-AI separation, clinician approval gate |
| 10 | `Multilingual Community Engagement` | Plain-language EN/VI templates, browser Speech Synthesis readout, mandatory `Approve -> Dispatch` gate |
| 11 | `Impact & Outcomes` | Period deltas + data completeness metrics separated into `OPERATIONAL` vs `CLINICAL_OUTCOME` rows |
| 12 | `Governance, Privacy & Audit` | Canonical Role selector bounded by verified session ceiling, `Verify Server 403 Boundary` interactive check, `kThreshold` control (`platform_admin` only), PDPL retention & IAM remediation cards, immutable `GovernanceAuditLog` |

---

## 3. Guest Sandbox, Durable Persistence & Authentication Model

- Evaluators enter `#population-health` with **no login walls** (`CONTINUE AS GUEST` banner + automatic server-signed Guest Sandbox session via `POST /api/population-health/guest-session`).
- Guest sessions run inside an isolated in-memory sandbox (`SIMULATED` provenance only, 6h TTL) that **never writes to Firestore**, never alters primary state or exposes real audit logs, and is strictly denied governance/erasure actions (`HTTP 403`).
- Authenticated clinical staff sign in via Firebase Auth (`GoogleAuthProvider`), with verified server-side role bounds (`zenieverse@gmail.com` -> `platform_admin`; unprivileged signed-in accounts -> `community_viewer`), backed by `PopulationHealthFirestoreStore` in verified **`FIRESTORE_LIVE`** mode against `gen-lang-client-0611153209` (`ai-studio-drt-2e1619d9-9932-4538-9b6c-26b489ebfec2`).
