# Dr. T — Community Health Signal Intelligence
## Judge & Evaluator Live Walkthrough Script (No Credentials Required)

**Direct Entry URL:** `http://localhost:3000/#population-health` (or `https://ais-dev-4s4jvpipr3mh3mz6x2hpfp-393352619239.asia-southeast1.run.app/#population-health` when signed into the AI Studio preview session; click **Population Health · FHC 2026** in the Dr. T top navigation bar).

---

### **0:00 – 0:25 | Zero-Friction Guest Entry & Honest Provenance Overview**
1. Open `#population-health`. The page loads directly into the workspace without modal interruptions, displaying the **Guest Sandbox Mode Active** banner and **`CONTINUE AS GUEST`** control (or optional **Staff Sign In (Google)** for verified administrators).
2. Review **Workspace 1 (Population Overview)**:
   - Inspect live KPI tiles, interactive `PopulationTrendsChart`, and **Database & Persistence Status** (`EPHEMERAL_GUEST_SANDBOX` for guest mode with zero Firestore writes; authenticated `/api/population-health/health?refresh=1` verifies **`FIRESTORE_LIVE`** durable persistence on `gen-lang-client-0611153209`).
   - Inspect **Signal Sources & Data Provenance** showing explicit `SIMULATED`, `IMPORTED`, or `UNAVAILABLE` states.
3. Use the **End-to-End Demo Flow** jump bar above the workspaces to step sequentially across Stages 1–5.

### **0:25 – 1:05 | Consent-First Intake, VN PII Guardrail & Presage Consent**
1. Click **Step 2: Community Registry**:
   - Attempt registering an email, `+84901234567`, or 12-digit CCCD (`079095001234`) -> server immediately rejects with HTTP `400 ValidationError`.
   - Register a clean pseudonymous resident (`Guest Resident D1-88`), then toggle consent on an existing member to confirm immediate exclusion from risk scoring.
2. Open **Health Signal Intake**:
   - Trigger **Run Health Alert Mini Bridge Intake** to normalize vitals/labs into structured observations (tagged `SIMULATED` inside Guest/Synthetic cohorts).
   - Confirm the mandatory **Presage Camera Consent** checkbox before importing simulated optical pulse/respiration/HRV vitals.

### **1:05 – 1:45 | Explainable Stratification & `k`-Anonymity Filter-Bypass Defense**
1. Open **Step 3: Risk Intelligence**: inspect Blood Health, Cardiometabolic, and Maternal signals, linked `contributingObservations`, and click **Acknowledge** / **Actioned** review states.
2. Open **Step 4: Community Trends**:
   - Inspect **`Cardiometabolic Health · Rural Outreach South`** (`<5 (suppressed)`, `SUPPRESSED (k-rule)`).
   - Select **Region -> Rural Outreach South** in the header filter to verify KPI cards and longitudinal trends automatically suppress (`suppressedForPrivacy: true`) rather than leaking `n=3` subgroup percentages.
   - Click **Export CSV** / **Export JSON** to verify downloadable files preserve the exact `k`-anonymity suppression mask.

### **1:45 – 2:30 | Closed-Loop Care Navigation, AI Gate & Multilingual Outreach**
1. Open **Step 5: Care Navigation**: create a referral, transition stages along the 6-stage pipeline, and log a Vietnamese follow-up note.
2. Open **AI Research Assistant**: run a cohort research prompt, inspect **1. Observed Cohort Data** vs. **2. AI Synthesis** with explicit provider badge (`Live Gemini (AI-Generated)` vs `Deterministic Evidence Fallback (Not AI-Generated)`), and test clinician approval (`PENDING_HUMAN_REVIEW -> APPROVED`).
3. Open **Multilingual Outreach**: preview English / Tiếng Việt templates + voice readout and test the `Approve -> Dispatch` human gate.

### **2:30 – 3:00 | Server-Enforced 403 RBAC Boundary & Immutable Audit Trail**
1. Open **Governance & Audit**:
   - Switch **Role View** to `research_analyst` -> navigate to Community Registry/Risk Intelligence to confirm participant aliases & notes are redacted (`Pseudonym SYN-...`).
   - Click **`Verify Server 403 Boundary`** to execute a live browser request attempting `PATCH /api/population-health/governance/k-threshold` from Guest Sandbox -> confirms server **`HTTP 403 FORBIDDEN`** rejection and immutable `DENIED` log entry.
