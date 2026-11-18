# Dr. T — Final Production Isolation Audit & Deployment Readiness Verification

**Audit Date:** 2026-11-17T12:58Z  
**Audit Mode:** Strictly Read-Only Independent Verification (Zero source modifications, zero infrastructure mutations, zero secret exposure)  
**Target System:** Dr. T — Community Health Signal Intelligence (`#population-health`, Future Health Challenge 2026)  
**Verified Development Runtime:** `ais-dev-4s4jvpipr3mh3mz6x2hpfp` (`K_REVISION=ais-dev-4s4jvpipr3mh3mz6x2hpfp-00008-nwk`, `asia-southeast1`)

---

## A. Executive Decision

| Deployment Target | Verdict | Primary Rationale |
|---|---|---|
| **1. Synthetic Development Demonstration (`ais-dev-*`)** | **GO** | Live dev server responds HTTP 200 with `environment: "development"`, `persistenceStatus.mode: "FIRESTORE_LIVE"`, `geminiDiagnostics.status: "LIVE_AI"`, 20 synthetic participants verified via read-only Firestore REST, and all 8 test suites + `npm run build` + `tsc --noEmit` exit `0`. |
| **2. Public Competition Judging (`public_judging`)** | **CONDITIONAL GO (Blocked on Infra)** | Server fail-closed validation and Guest Sandbox isolation (`GS-*` in-memory ephemeral state, `0` Firestore writes) work as designed, **but** no isolated `public_judging` Cloud Run service, Firestore DB (`drt-judging-synthetic-2026`), or Secret Manager `POPULATION_GUEST_TOKEN_SECRET` exists yet, and `ais-pre-*` redirects behind AI Studio auth (`HTTP 302`). |
| **3. Internal Testing with Real Patient Data (`staging`)** | **NO-GO** | No staging Firestore DB or staging SA exists in `gen-lang-client-0611153209`; client builds default `VITE_RUNTIME_ENV` to `'development'` if omitted; `staging` auto-seeds synthetic demo cohorts on an empty DB; PITR and delete protection are disabled on dev DB. |
| **4. Production Clinical / Live-Patient-Data Promotion (`production`)** | **NO-GO** | Code-side server startup guards are solid, **but** infrastructure is unprovisioned (`drt-prod-clinical` absent in project, Secret Manager & Cloud Run IAM `NOT VERIFIED` due to `HTTP 403`), client Vite config silently falls back to dev JSON if `VITE_RUNTIME_ENV` is unset, and `CLOUD_RUN_MAX_INSTANCES` check is self-declared rather than platform-enforced. |

---

## B. Verified Implementation Matrix

| # | Requirement / Component | Implemented? | Test Passed? | Independently Verified? | Evidence | Remaining Concern |
|---|---|---|---|---|---|---|
| 1 | Explicit env resolution & fail-closed startup (`src/server/runtimeEnvironment.ts`) | **Yes** | **Yes** (`14/14` in `test-production-isolation.ts`) | **Yes** | `resolveRuntimeEnvironment()`, `resolveServerFirebaseConfig()`, `validateStartupConfiguration()` reject missing GCP project, missing `FIRESTORE_DATABASE_ID`, `envDb === DEV_FIRESTORE_DATABASE_ID`, missing/short/placeholder `POPULATION_GUEST_TOKEN_SECRET`, and `public_judging` without `DRT_SYNTHETIC_ONLY=true`. | Rejects `envDb === DEV_FIRESTORE_DATABASE_ID` but allows reusing `DEV_FIRESTORE_PROJECT_ID` with another DB name; multi-instance guard inspects `env.CLOUD_RUN_MAX_INSTANCES` (unverified against Cloud Run platform `maxScale` if env var omitted). |
| 2 | Server startup blocking before listening (`server.impl.ts`) | **Yes** | **Yes** (real subprocess exit `!= 0` check) | **Yes** | `setupApp()` (lines 6061–6075) runs `validateStartupConfiguration(process.env)` synchronously and calls `process.exit(1)` on `ProductionConfigurationError` before `app.listen()`. `test-production-isolation.ts` spawns `npx tsx server.ts` in prod+devDB mode and asserts non-zero exit with `[Dr. T Startup BLOCKED]` and zero secret leakage. | Request routes `/api/population-health/health` (line 5711) and `/api/cloud/infrastructure-status` (line 152) pass `{ skipStrictEnvValidation: true }`; safe only while `setupApp()` remains the sole entrypoint. |
| 3 | Server Firestore adapter isolation (`src/server/populationHealthFirestoreStore.ts`) | **Yes** | **Yes** (unit + mock REST + live dev read) | **Yes** | `loadFirebaseConfig()` delegates to `resolveServerFirebaseConfig()`; `PopulationHealthFirestoreStore` uses `documentsRoot` bound to resolved `projectId`/`databaseId`. Live dev probe reports `FIRESTORE_LIVE`. | `getCachedPersistenceStatusSync()` fallback text (line 316) still hardcodes `ais-sandbox@...` SA hint when probe hasn't run; `loadFullSnapshot()` lists whole collections (`pageSize=500`) into process RAM. |
| 4 | Secret Manager guest HMAC enforcement & RS256 RBAC (`src/server/populationHealthAuth.ts`) | **Yes** | **Yes** (unit/token checks in `test-population-health.ts`) | **Yes** | `getGuestHmacSecret()` reads validated `POPULATION_GUEST_TOKEN_SECRET` (`>=32` chars, rejects placeholders) in non-dev; ephemeral CSPRNG allowed only in `development`. RS256 Firebase ID tokens validated against Google Secure Token X.509 certs (`aud`, `iss`, `exp`, `iat`, `auth_time`). | `ADMIN_EMAIL_ALLOWLIST` (`zenieverse@gmail.com`) is hardcoded alongside `firestore.rules`; rate-limit map (`rateLimitBuckets`) is process-local RAM. |
| 5 | Clean empty prod DB & PDPL/guest boundaries (`src/server/populationHealthService.ts`) | **Yes** | **Yes** (unit + isolated file + mock REST) | **Yes** | Lines 399–419 initialize `demoActive: false` with empty cohorts when `envMode === 'production'` and `DRT_SEED_DEMO_ON_EMPTY !== 'true'`. Guest sandboxes stored strictly in `this.guestSandboxes` Map (`persistState` returns early when `isGuestSandbox === true`). | Line 400 checks `envMode === 'production'` only — **`staging` still auto-seeds synthetic demo cohorts** on an empty DB. `this.state` cache is process-local RAM (`max-instances=1` dependency). |
| 6 | Client Firebase DB separation (`src/config/firebaseRuntimeConfig.ts`, `src/services/firebase.ts`) | **Partial** | **No** (no Vite non-dev build test) | **Yes** | `firebaseRuntimeConfig.ts` throws in `production`/`staging`/`public_judging` if `VITE_FIREBASE_PROJECT_ID` or `VITE_FIRESTORE_DATABASE_ID` is missing or targets dev DB. `src/services/firebase.ts` consumes it for `initializeApp` and `getFirestore(app, databaseId)`. | **GAP:** `VITE_RUNTIME_ENV` defaults to `'development'` (line 30) even when Vite `MODE === 'production'` (`npm run build`), so omitting `VITE_RUNTIME_ENV` silently bundles `firebase-applet-config.json` (dev DB) into `dist/assets/`. Also `apiKey`, `appId`, `messagingSenderId` fall back to `devFirebaseConfig` in non-dev (lines 58–65). |
| 7 | Cloud Hub UI & Telemetry endpoint (`src/components/cloud/GoogleCloudHub.tsx`, `/api/cloud/infrastructure-status`) | **Partial** | **Yes** (`tsc` + build) | **Yes** | Reads `firebaseConfig.projectId` and `firestoreDatabaseId` from `firebaseRuntimeConfig`; server endpoint resolves `cfg.projectId` and `cfg.databaseId` safely without exposing `sk-*`. | **GAP:** UI cards hardcode `asia-southeast1`, `0 - 10 instances`, `Gemini 3.7 Flash`, and Pub/Sub `<option>` values `projects/gen-lang-client-0611153209/topics/...` (lines 325, 333, 425, 525, 715–717). `/api/cloud/infrastructure-status` returns static mock metrics (`readLatencyP50Ms: 14`, `activeSessions: 184`, `firestoreDocumentOperationsToday: 4812`). Actual dev DB region is `us-west1`, not `asia-southeast1`. |
| 8 | Env documentation & zero committed secrets (`.env.example`, repo files) | **Yes** | **N/A** | **Yes** | `.env.example` documents `DRT_RUNTIME_ENV`, `FIRESTORE_DATABASE_ID`, `POPULATION_GUEST_TOKEN_SECRET`, `DRT_SYNTHETIC_ONLY`, `DRT_SEED_DEMO_ON_EMPTY`, `CLOUD_RUN_MAX_INSTANCES`, `VITE_*` with empty/safe placeholders. No `.env` file in workspace; `dist/assets/*.js` scan found `0` credential tokens (`hasSecretName: false`, only DOM button IDs `ask-trib-*` matched `/sk-/`). | `firebase-applet-config.json` contains public Firebase Web SDK `apiKey` (expected for client Firebase apps) and dev `projectId`/`firestoreDatabaseId` used if dev-default client build runs. |
| 9 | AI Studio `sk-*` token neutralization & log/diagnostics redaction | **Yes** | **Yes** (tests #4 & #13 in `test-production-isolation.ts`) | **Yes** | `isValidGcpProjectId()` (`^[a-z][a-z0-9-]{4,28}[a-z0-9]$`) rejects `sk-*` tokens; `safeRegion` regex (`/^[a-z]+-[a-z]+\d+$/`) blocks malformed `GOOGLE_CLOUD_LOCATION`; `redactEnvironmentDiagnostics()` outputs booleans (`varsPresent`) only. | Verified clean on dev `/api/population-health/health` and `/api/cloud/infrastructure-status` HTTP 200 responses. |
| 10 | Multi-instance Cloud Run safety guard (`CLOUD_RUN_MAX_INSTANCES`) | **Partial** | **Yes** (env-var unit check) | **Yes** | `validateStartupConfiguration` aborts if `Number(env.CLOUD_RUN_MAX_INSTANCES || '0') > 1` without `DRT_ALLOW_MULTI_INSTANCE=true`. | If Cloud Run deploys with default autoscaling (max 100) and `CLOUD_RUN_MAX_INSTANCES` is omitted (`'0'`), startup proceeds despite non-stateless RAM caches (`this.state`, `guestSandboxes`, `rateLimitBuckets`). |
| 11 | `public_judging` synthetic-only mode | **Partial** | **Yes** (startup check) | **Yes** | `resolveServerFirebaseConfig` requires `DRT_SYNTHETIC_ONLY=true` for `public_judging` and `/api/population-health/health` exposes `environment: "public_judging"` & `isSyntheticOnly: true`. | Beyond `containsDirectIdentifier()` PII regex and guest sandbox `isSynthetic=true` stamps, `public_judging` does **not** disable authenticated non-guest mutations or enforce `resetDemoToClean` / daily reset in code if a verified Firebase user signs in. |
| 12 | Deployment & isolation docs (`docs/PRODUCTION_DEPLOYMENT_AND_ISOLATION.md`, `scripts/test-production-isolation.ts`) | **Yes** | **Yes** | **Yes** | Docs accurately label code guards as implemented and infra provisioning as `PROPOSED (NOT EXECUTED)`. | Docs assume Firestore location `asia-southeast1` in CLI example, whereas live dev Firestore DB metadata shows `us-west1` (either region is valid for new prod DB, but alignment should be deliberate for data residency/latency). |

---

## C. Test & Build Verification Results

Every command below was executed directly during this audit (`0` failures across all 10 commands):

| Command | Passed | Failed | Skipped | Exit Code | Execution Environment (Mock vs Emulator vs Live Cloud) |
|---|---:|---:|---:|---:|---|
| `npx tsx scripts/test-production-isolation.ts` | 14 | 0 | 0 | `0` | **In-memory + Real subprocess (`npx tsx server.ts`)**: Uses synthetic env maps, temp JSON in `/tmp`, and spawns real `server.ts` to verify non-zero exit & redaction. **Zero live GCP calls.** |
| `npm run test:population-health` (`tsx scripts/test-population-health.ts`) | 62 | 0 | 0 | `0` | **In-memory + Local HTTP Mock**: 57 in-memory service/auth/RBAC/PII/k-anonymity tests + 5 persistence/restart/idempotency/PDPL/guest isolation tests against a **local `http.createServer` mock Firestore REST server**. **Zero live Firestore writes.** |
| `npx tsx scripts/test-firestore-security-rules.ts` | 28 | 0 | 0 | `0` | **Static regex/file analysis** on `firestore.rules`. **NOT** evaluated by Firebase Rules Emulator or live Firestore. |
| `npx tsx scripts/test-future-health.ts` | 28 | 0 | 0 | `0` | **In-memory unit suite** (clinical heuristics, FHIR, SBAR, parity, disclaimers). **No cloud calls.** |
| `npx tsx scripts/test-health-alert.ts` | 46 | 0 | 0 | `0` | **In-memory unit + static UI check** (`Navbar.tsx`, `App.tsx`, triage invariants). **No cloud calls.** |
| `npx tsx scripts/test-presage-sense.ts` | 5 groups | 0 | 0 | `0` | **Native local C++ FFI (`@smartspectra/node-sdk` v3.4.0 linux-x64) + Deterministic fallback**: Native SDK attempted live Presage cloud `/device/pair` and received **HTTP 403** (`PRESAGE_API_KEY` unset); frame ingestion + bounds + fallback reflection passed locally. |
| `npx tsx scripts/test-vision-alert.ts` | 51 | 0 | 0 | `0` | **In-memory synthetic pixel fixtures + static IaC check** (`aws/cloudformation/*`, `aws/terraform/*`, `aws/lambda/*`). **Zero live AWS calls.** |
| `npx tsx scripts/test-solar-filament.ts` | 10 groups (52 assertions) | 0 | 0 | `0` | **In-memory physics/PQ/RLE checks + static artifact checks** (`public/Solar_Filament_Technical_Report.pdf`, `solar-filament-segmentation/*`). |
| `npm run build` (`compile_applet`) | 1 | 0 | 0 | `0` | **Real Vite + esbuild + artifact copy** (`dist/`, `build/`, `.next/`, `server.cjs`). Note: default `npm run build` without `VITE_RUNTIME_ENV` bundles `firebase-applet-config.json` (dev DB) into `dist/assets/index-BLjHAeVC.js`. |
| `npm run lint` (`lint_applet`: `tsc --noEmit`) | 1 | 0 | 0 | `0` | **Real TypeScript type-checker** across entire project (`0` errors). |

---

## D. Environment Isolation Architecture (Zero Secrets)

| Attribute | `development` *(Active Dev)* | `staging` *(Proposed)* | `production` *(Proposed)* | `public_judging` *(Proposed)* |
|---|---|---|---|---|
| **`DRT_RUNTIME_ENV`** | `development` | `staging` | `production` | `public_judging` |
| **`GOOGLE_CLOUD_PROJECT`** | `gen-lang-client-0611153209` | `<STAGING_GCP_PROJECT_ID>` *(dedicated)* | `<PROD_GCP_PROJECT_ID>` *(dedicated)* | `<JUDGING_GCP_PROJECT_ID>` *(dedicated)* |
| **`FIRESTORE_DATABASE_ID`** | `ai-studio-drt-2e1619d9-9932-4538-9b6c-26b489ebfec2` | `drt-staging-db` | `drt-prod-clinical` | `drt-judging-synthetic-2026` |
| **Runtime Service Account** | `ais-sandbox@ais-asia-southeast1-a11562d113.iam.gserviceaccount.com` | `drt-staging-runner@<STAGING_PROJECT>.iam.gserviceaccount.com` | `drt-prod-runner@<PROD_PROJECT>.iam.gserviceaccount.com` | `drt-judging-runner@<JUDGING_PROJECT>.iam.gserviceaccount.com` |
| **`POPULATION_GUEST_TOKEN_SECRET`** | Optional (ephemeral dev CSPRNG; `<UNSET>` in shell) | Mandatory (`>=32` chars via Secret Manager) | Mandatory (`>=32` chars via Secret Manager) | Mandatory (`>=32` chars via Secret Manager) |
| **`DRT_SYNTHETIC_ONLY`** | `true` | `true` (or `false` only for controlled internal QA) | `false` *(real workflows)* | **Mandatory `true`** *(enforced at startup)* |
| **`DRT_SEED_DEMO_ON_EMPTY`** | Auto-seeds 20 demo cohorts | **Currently auto-seeds** *(code treats only `production` as clean-empty!)* | `false` *(starts empty with `demoActive: false`)* | `true` *(20 synthetic cohorts)* |
| **`VITE_RUNTIME_ENV` / Client Build** | `development` (`firebase-applet-config.json`) | `staging` + `VITE_FIREBASE_PROJECT_ID` + `VITE_FIRESTORE_DATABASE_ID` | `production` + all `VITE_FIREBASE_*` vars | `public_judging` + all `VITE_FIREBASE_*` vars |
| **Cloud Run Scaling** | Dev sandbox | `--max-instances=1` (`CLOUD_RUN_MAX_INSTANCES=1`) | `--max-instances=1` *(until stateless cache refactor)* | `--max-instances=1` *(or stateless guest store refactor)* |
| **Current Status** | **Verified in development (`FIRESTORE_LIVE`)** | **Not configured** | **Not configured / Prod `ais-pre-*` Not verified** | **Not configured** |

---

## E. Infrastructure Status

| Resource / Control | Status Classification | Direct Audit Evidence |
|---|---|---|
| Code-side runtime isolation (`runtimeEnvironment.ts`, `server.impl.ts`, store, auth, service) | **Implemented in code** | Inspected directly across `src/server/*`, `src/config/*`, `server.impl.ts`, `.env.example`, and `docs/PRODUCTION_DEPLOYMENT_AND_ISOLATION.md`. |
| Dev runtime identity & ADC token | **Verified in development** | Metadata server returns `ais-sandbox@ais-asia-southeast1-a11562d113.iam.gserviceaccount.com` (host project `ais-asia-southeast1-a11562d113`). Dev server shell has `K_SERVICE=ais-dev-4s4jvpipr3mh3mz6x2hpfp`, `K_REVISION=ais-dev-4s4jvpipr3mh3mz6x2hpfp-00008-nwk`, `NODE_ENV=development`. |
| Dev `/api/population-health/health?refresh=1` & `/api/cloud/infrastructure-status` | **Verified in development** | HTTP 200: `environment: "development"`, `isSyntheticOnly: true`, `hasGeminiKey: true`, `geminiDiagnostics.status: "LIVE_AI"`, `persistenceStatus.mode: "FIRESTORE_LIVE"`, `projectId: "gen-lang-client-0611153209"`, `databaseId: "ai-studio-drt-2e1619d9-9932-4538-9b6c-26b489ebfec2"`. |
| Dev Firestore REST live data (`ai-studio-drt-2e1619d9-9932-4538-9b6c-26b489ebfec2`) | **Verified in development / Configured in cloud** | Read-only Firestore REST `GET` with ADC returned HTTP 200: `population_participants=20`, `population_consents=23`, `population_observations=21`, `population_alerts=3`, `population_programmes=4`, `population_referrals=5`, `population_audit_logs=18`, `population_system_config=1`, `healthRecords=0`. |
| Firestore Databases in `gen-lang-client-0611153209` | **Configured in cloud (Dev only) / Not configured (Staging/Prod/Judging)** | `GET https://firestore.googleapis.com/v1/projects/gen-lang-client-0611153209/databases` returned HTTP 200 listing **only 3 databases**, all in **`us-west1`**: `ai-studio-drt-2e1619d9-9932-4538-9b6c-26b489ebfec2` (`FIRESTORE_NATIVE`, **`POINT_IN_TIME_RECOVERY_DISABLED`**, **`DELETE_PROTECTION_DISABLED`**, `versionRetentionPeriod: 3600s`) plus two pre-existing `ai-studio-*` databases. Zero isolated staging/prod/judging DBs exist in this project. |
| Production / Pre-prod Cloud Run service (`ais-pre-4s4jvpipr3mh3mz6x2hpfp`) config, SA, env, revisions | **Not verified** | `gcloud` CLI unavailable (`NO_GCLOUD`). REST `run.googleapis.com/v2/...` returned **HTTP 403 (`Permission 'run.services.get' denied`)** on both `ais-asia-southeast1-a11562d113` and `gen-lang-client-0611153209`. External `https://ais-pre-4s4jvpipr3mh3mz6x2hpfp-393352619239.asia-southeast1.run.app/api/population-health/health` returned **HTTP 302** to `/_aistudio-iframe.js` (cannot confirm live revision or DB binding). |
| Project IAM Policy (`gen-lang-client-0611153209`) | **Not verified** | `POST cloudresourcemanager.googleapis.com/v1/projects/gen-lang-client-0611153209:getIamPolicy` returned **HTTP 403** (`Cloud Resource Manager API has not been used in project 393352619239 before or it is disabled`). |
| Secret Manager (`POPULATION_GUEST_TOKEN_SECRET`, `GEMINI_API_KEY`, `PRESAGE_API_KEY`) | **Not configured / Not verified** | `GET secretmanager.googleapis.com/v1/projects/gen-lang-client-0611153209/secrets` returned **HTTP 403** (`Secret Manager API has not been used in project gen-lang-client-0611153209 before or it is disabled`). |
| Deployed `firestore.rules` in cloud vs repo, backup schedules, monitoring alerts | **Not verified / Not configured** | No read-only Firebase Rules Release API scope from sandbox; PITR disabled (`POINT_IN_TIME_RECOVERY_DISABLED`) on dev DB. |

### Owner Read-Only Verification Commands (Run in Cloud Shell / Authorized Workstation)
```bash
# 1. Inspect pre-production/production Cloud Run service SA, env vars, secret refs & maxScale
gcloud run services describe ais-pre-4s4jvpipr3mh3mz6x2hpfp \
  --region=asia-southeast1 \
  --project=ais-asia-southeast1-a11562d113 \
  --format='yaml(spec.template.spec.serviceAccountName,spec.template.metadata.annotations,spec.template.spec.containers[0].env,status.traffic)'

# 2. Audit IAM roles on dev project (confirm prod SA does NOT have access to dev Firestore DB)
gcloud projects get-iam-policy gen-lang-client-0611153209 \
  --flatten="bindings[].members" \
  --format="table(bindings.role,bindings.members)"

# 3. Verify Secret Manager provisioning on target isolated project
gcloud secrets list --project=<PROD_OR_JUDGING_PROJECT_ID>
```

---

## F. Security and Governance Risks

| Severity | Finding | Location / Evidence | Risk & Impact |
|---|---|---|---|
| **Critical** | **Isolated Prod/Judging Infrastructure Absent or Unverified** | `firestore.googleapis.com` DB list (`0` isolated DBs in `gen-lang-client-0611153209`); Secret Manager & Cloud Run `ais-pre-*` `HTTP 403` | Deploying `ais-pre-*` or a new Cloud Run service before provisioning separate Firestore DBs, Secret Manager secrets, and least-privilege IAM either aborts startup (fail-closed) or, if old artifacts exist, risks writing to dev data. |
| **Critical** | **No PITR, No Delete Protection, 1h Retention on Observed DB** | `ai-studio-drt-2e1619d9-9932-4538-9b6c-26b489ebfec2` DB metadata | `POINT_IN_TIME_RECOVERY_DISABLED` and `DELETE_PROTECTION_DISABLED` leave no multi-day point-in-time recovery or accidental deletion safeguard for clinical data (must be enabled on prod DB at creation). |
| **High** | **Client Build Silently Defaults `VITE_RUNTIME_ENV` to `'development'`** | `src/config/firebaseRuntimeConfig.ts` lines 30–38 & 58–65 | Running `npm run build` (`vite build`) without explicitly setting `VITE_RUNTIME_ENV=production` bundles `firebase-applet-config.json` (`gen-lang-client-0611153209` / dev DB) into `dist/assets/index-*.js` even though Vite `MODE === 'production'`. Also `apiKey`, `appId`, `messagingSenderId` fall back to dev config in non-dev builds if omitted. |
| **High** | **Multi-Instance Guard Relies on Self-Declared `CLOUD_RUN_MAX_INSTANCES` Env Var** | `src/server/runtimeEnvironment.ts` line 267; `src/server/populationHealthService.ts` lines 204, 214; `populationHealthAuth.ts` line 395 | Cloud Run does **not** populate `CLOUD_RUN_MAX_INSTANCES` automatically. Deploying with default Cloud Run scaling (`maxScale=100`) without setting `CLOUD_RUN_MAX_INSTANCES` passes startup validation while serving stale process-local `this.state`, breaking sticky in-memory `guestSandboxes`, and splitting `rateLimitBuckets`. |
| **High** | **Pre-Production Service (`ais-pre-*`) Runtime Identity & Auth Boundary `NOT VERIFIED`** | `run.googleapis.com` `HTTP 403`; external ingress `HTTP 302` | Cannot confirm from sandbox whether `ais-pre-*` shares `ais-sandbox@` or another SA, what env/secret bindings it holds, or which code revision is currently live. |
| **Medium** | **`staging` Environment Auto-Seeds 20 Synthetic Cohorts on Empty DB** | `src/server/populationHealthService.ts` lines 399–400 | Clean-empty check tests only `envMode === 'production'`; if `staging` connects to a clean DB (e.g., internal realistic QA), it automatically seeds synthetic demo participants on boot. |
| **Medium** | **`public_judging` Does Not Enforce Read-Only / Guest-Only Mutation Guard Beyond PII Regex** | `src/server/runtimeEnvironment.ts` line 195; `src/server/populationHealthService.ts` | `isSyntheticOnly: true` is checked at startup and surfaced on `/health`, but authenticated non-guest Firebase routes (e.g. `addParticipant`, `resetDemoToClean`, `updateGovernanceThreshold`) remain active if a verified account logs in, mutating shared judging DB state without automated reset. |
| **Medium** | **Hardcoded Dev Strings & Simulated Metrics in Cloud Hub UI/API** | `src/components/cloud/GoogleCloudHub.tsx` lines 325, 333, 525, 715–717; `server.impl.ts` lines 166–225 | `GoogleCloudHub.tsx` hardcodes `asia-southeast1` (dev DB is actually in `us-west1`), `0 - 10 instances`, and Pub/Sub `<option>` strings `projects/gen-lang-client-0611153209/...`; `/api/cloud/infrastructure-status` returns static synthetic telemetry (`activeSessions: 184`, `readLatencyP50Ms: 14`). Also `src/services/firebase.ts` falls back silently to `localStorage` for `healthRecords` when unauthenticated or offline. |
| **Medium** | **Security Rules & Persistence Tests Do Not Exercise Live Cloud / Emulator** | `scripts/test-firestore-security-rules.ts`; `scripts/test-population-health.ts` | Rules suite is static regex matching (cannot catch Firestore runtime evaluation bugs or missing composite indexes); Population Health persistence suite uses an in-process mock REST server. |
| **Low** | **Permissive Non-Clinical Legacy Rules Co-Exist in `firestore.rules`** | `firestore.rules` lines 165–170, 375–379 | `payflow_debt_contributions` (`allow create: if true`) and `street_vendor_contributions` (`allow read, create, update: if true`) remain intentionally open for community features; separate GCP projects ensure blast-radius isolation for clinical prod. |
| **Low** | **Cross-DB Isolation Permitted Within Dev Project** | `src/server/runtimeEnvironment.ts` lines 169–174 | Rejects `DEV_FIRESTORE_DATABASE_ID` reuse, but permits `GOOGLE_CLOUD_PROJECT === DEV_FIRESTORE_PROJECT_ID` if a different DB ID is used. Separate GCP projects are strongly advised for clinical production. |

---

## G. Ordered Deployment Checklist

1. **Pre-Provisioning (Cloud Admin — Zero Code Changes Needed for Dev):**
   - [ ] Create dedicated GCP projects (recommended) or strictly isolated resources for `<STAGING_PROJECT>`, `<JUDGING_PROJECT>`, and `<PROD_PROJECT>`.
   - [ ] Provision isolated Firestore Native databases with `--enable-delete-protection` and PITR enabled (`--type=firestore-native`).
   - [ ] Configure daily scheduled Firestore exports (`gcloud firestore export`) to a retention-locked GCS bucket + Cloud Monitoring uptime/5xx/health-mode alerts.
2. **Rules & IAM Hardening:**
   - [ ] Deploy `firestore.rules` explicitly to each target project/database (`firebase deploy --only firestore:rules` or Rules API) and test against Firebase Rules Emulator.
   - [ ] Create dedicated least-privilege runtime SAs (`drt-judging-runner`, `drt-staging-runner`, `drt-prod-runner`) with `roles/datastore.user` scoped **only** to their respective project (verify **zero** cross-access to `gen-lang-client-0611153209`).
3. **Secret Manager Provisioning:**
   - [ ] Generate and store `POPULATION_GUEST_TOKEN_SECRET` (`openssl rand -base64 48`, `>=32` chars), `GEMINI_API_KEY`, and optional `PRESAGE_API_KEY` in Google Secret Manager in each target project.
   - [ ] Grant `roles/secretmanager.secretAccessor` solely to the corresponding environment's runtime SA on those secrets.
4. **Code Hardening Before Staging/Prod/Public Judging Release *(Out-of-Scope During Read-Only Audit)*:**
   - [ ] Fail Vite builds in `src/config/firebaseRuntimeConfig.ts` if `import.meta.env.PROD` (Vite production build) runs without explicit `VITE_RUNTIME_ENV`, and remove dev fallback for `apiKey`/`appId`/`messagingSenderId` outside `development`.
   - [ ] Remove hardcoded `gen-lang-client-0611153209` Pub/Sub `<option>` strings and hardcoded `asia-southeast1`/`0 - 10 instances` labels from `GoogleCloudHub.tsx`; align `/api/cloud/infrastructure-status` telemetry disclaimers.
   - [ ] Include `staging` in clean-empty-DB behavior (unless `DRT_SEED_DEMO_ON_EMPTY=true`) and enforce synthetic-only / read-only or scheduled reset safeguards on `public_judging`.
   - [ ] Either enforce Cloud Run `--max-instances=1` in CI deploy manifest alongside `CLOUD_RUN_MAX_INSTANCES=1` OR migrate `PopulationHealthService` cache, `guestSandboxes`, and `rateLimitBuckets` to Firestore/Memorystore before allowing `max-instances > 1`.
5. **Build & Deploy Sequence:**
   - [ ] Build frontend/server **inside CI per target environment** with explicit `VITE_RUNTIME_ENV`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIRESTORE_DATABASE_ID`, `VITE_FIREBASE_APP_ID`, `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`.
   - [ ] Verify built `dist/assets/*.js` contains **zero** references to `ai-studio-drt-2e1619d9-9932-4538-9b6c-26b489ebfec2`.
   - [ ] Deploy to **Staging** first (`DRT_RUNTIME_ENV=staging`, `--max-instances=1`, `CLOUD_RUN_MAX_INSTANCES=1`, Secret Manager mounts) -> verify `GET /api/population-health/health?refresh=1` returns `environment: "staging"`, `persistenceStatus.mode: "FIRESTORE_LIVE"`, and staging DB ID.
   - [ ] Deploy separate **`public_judging`** service (`DRT_RUNTIME_ENV=public_judging`, `DRT_SYNTHETIC_ONLY=true`, `--allow-unauthenticated`, `--max-instances=1`, `drt-judging-synthetic-2026`) -> verify anonymous judge Guest Sandbox flow + zero Firestore writes on guest actions.
   - [ ] Inspect **`ais-pre-*`** configuration via `gcloud run services describe` before any production traffic cutover; confirm rollback revision target (`gcloud run services update-traffic ... --to-revisions=<PRIOR_REV>=100`).

---

## H. Final Recommendation

1. **Synthetic Development Demonstration:** **GO** — Preserve the current `ais-dev-*` deployment (`FIRESTORE_LIVE` on `ai-studio-drt-2e1619d9-9932-4538-9b6c-26b489ebfec2` with `LIVE_AI` Gemini inference and synthetic cohorts). Do not introduce real patient data into this environment.
2. **Public Competition Judging:** **CONDITIONAL GO** — Proceed **only after** provisioning a dedicated `public_judging` Cloud Run service (`--allow-unauthenticated`), dedicated `drt-judging-synthetic-2026` Firestore DB, Secret Manager `POPULATION_GUEST_TOKEN_SECRET`, explicit `VITE_RUNTIME_ENV=public_judging` CI build args, and a scheduled dataset reset / non-guest write lock.
3. **Internal Testing with Real Patient Data:** **NO-GO** — Blocked until a dedicated staging GCP project/Firestore DB with delete protection + PITR, explicit `VITE_RUNTIME_ENV=staging` build guard, `staging` clean-empty-DB enforcement, and Firebase Rules Emulator + live staging verification are completed.
4. **Production Clinical / Live-Patient-Data Use:** **NO-GO** — Blocked until: (a) isolated production Firestore DB (`drt-prod-clinical`) with PITR and delete protection is provisioned; (b) `ais-pre-*` / production Cloud Run SA, IAM, and Secret Manager bindings are independently verified; (c) `firebaseRuntimeConfig.ts` removes silent dev fallback on Vite production builds; and (d) `--max-instances=1` is platform-verified or `PopulationHealthService` is refactored to stateless Firestore/Redis storage.

---

## I. Phase 2 Remediation Addendum

**Remediation Completion Note:** All **code-level gaps** identified in Section F above (`Vite build silent dev fallback`, `self-declared CLOUD_RUN_MAX_INSTANCES`, `staging auto-seeding`, `public_judging unrestricted mutations/resets`, and `hardcoded Cloud Hub region/metrics`) have been **REMEDIATED in source code** (see `docs/PRODUCTION_ISOLATION_REMEDIATION_PHASE2.md` for line-level evidence and `9/9` Phase 2 test verification).

| Section F Gap | Phase 2 Status | Code Evidence | Remaining Cloud / Infra Blocker |
|---|---|---|---|
| **Client Build Silently Defaults `VITE_RUNTIME_ENV` to `'development'`** | **REMEDIATED (Code & Build)** | `src/config/clientFirebaseValidation.ts`, `vite.config.ts`, `src/config/firebaseRuntimeConfig.ts`, `package.json` (`build` fail-closed vs `build:dev`) | None in code — CI/CD must supply explicit `VITE_RUNTIME_ENV` + `VITE_FIREBASE_*` per target environment |
| **Multi-Instance Guard Relies on Self-Declared `CLOUD_RUN_MAX_INSTANCES`** | **REMEDIATED (Code)** | `src/server/runtimeEnvironment.ts` (`verifyCloudRunSingleInstanceFromApi`, `verifyStartupConfigurationAsync`, removal of `DRT_ALLOW_MULTI_INSTANCE`, `PROCESS_LOCAL_STATE_INVENTORY`); `populationHealthAuth.ts` (`RATE_LIMITER_SCOPE = 'process_local_best_effort'`) | **BLOCKED (Infra):** Requires Cloud Run `maxInstanceCount=1` + runtime SA `roles/run.viewer` (or stateless Redis/Firestore cache migration) before non-dev Cloud Run startup passes |
| **`staging` Environment Auto-Seeds 20 Synthetic Cohorts on Empty DB** | **REMEDIATED (Code)** | `src/server/populationHealthService.ts` (`isNonDevIsolatedEnvironment(env)` clean-empty rule in constructor & `runInitializeDurablePersistence`) | **NOT CONFIGURED (Infra):** Isolated staging Firestore DB & project remain unprovisioned |
| **`public_judging` Lacks Shared-DB Read-Only & Reset Token Guardrails** | **REMEDIATED (Code)** | `src/server/populationHealthService.ts` (`POPULATION_HEALTH_ROUTE_INVENTORY`, `enforcePublicJudgingWriteGuard`, `rejectWithRedactedAuditOnPII`, `enforcePrivilegedDemoResetGuard`), `populationHealthAuth.ts` (`X-Guest-Session-Id` bind + `verifyPrivilegedResetToken`) | **NOT CONFIGURED (Infra):** Isolated `public_judging` Cloud Run service, `drt-judging-synthetic-2026` DB, `POPULATION_GUEST_TOKEN_SECRET`, and `DRT_JUDGING_RESET_TOKEN` remain unprovisioned |
| **Hardcoded Dev Strings & Simulated Metrics in Cloud Hub UI/API** | **REMEDIATED (Code)** | `server.impl.ts` (`/api/cloud/infrastructure-status`, `/api/cloud/pubsub/publish`), `src/components/cloud/GoogleCloudHub.tsx`, `src/services/populationHealthClient.ts` (`X-DrT-Client-Env`/`X-DrT-Client-Db` `409` guard) | Real GCP Pub/Sub broker & GKE cluster remain `Simulated`; IAM policy & rules release telemetry remain `Not verified` offline until cloud inspection |
| **Isolated Prod/Judging Infrastructure, PITR/Delete Protection, `ais-pre-*` Verification, Rules Emulator** | **NOT IN CODE SCOPE (Unchanged)** | Preserved per strict code-remediation boundary | **NO-GO** for `staging`/`production` & **CONDITIONAL GO (Blocked on Infra)** for `public_judging` remain in effect until GCP project, DB, IAM, Secret Manager, and Cloud Run admin actions execute |
