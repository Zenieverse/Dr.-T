# Dr. T — Production Data Isolation & Deployment Runbook

**Status:** Code-side isolation & fail-closed startup guards **IMPLEMENTED** (`src/server/runtimeEnvironment.ts`, `src/config/firebaseRuntimeConfig.ts`). Infrastructure actions below remain **PROPOSED (NOT EXECUTED)** — production (`ais-pre-*`) and live Firestore databases/rules were **NOT modified**.

---

## 1. Repository Audit: `firebase-applet-config.json`, `GOOGLE_CLOUD_PROJECT` & `FIRESTORE_DATABASE_ID`

| File | Previous Behavior | Updated Behavior (Implemented) |
|---|---|---|
| `src/server/runtimeEnvironment.ts` | Single source of truth resolving `development`, `staging`, `production`, `public_judging`; enforces `isValidGcpProjectId()`, keeps `isNonDevIsolatedEnvironment` completely isolated from `firebase-applet-config.json` (even under `skipStrictEnvValidation`), removes `DRT_ALLOW_MULTI_INSTANCE`, requires **Cloud Run Admin API** verification of `maxInstanceCount === 1` (`verifyCloudRunSingleInstanceFromApi`), and publishes `PROCESS_LOCAL_STATE_INVENTORY` |
| `src/server/populationHealthFirestoreStore.ts` | Delegates strictly to `resolveServerFirebaseConfig(process.env)` without silent fallback outside `development` |
| `src/server/populationHealthAuth.ts` | Verifies Firebase RS256 ID tokens, requires `POPULATION_GUEST_TOKEN_SECRET` (`>=32` chars) outside `development`, binds Guest Sandbox `X-Guest-Session-Id` against signed token `sid` (`403` on mismatch), validates `X-DrT-Admin-Reset-Token` via `crypto.timingSafeEqual`, and classifies `rateLimitBuckets` explicitly as `process_local_best_effort` (`RATE_LIMITER_GLOBALLY_ENFORCED = false`) |
| `src/server/populationHealthService.ts` | Scopes local snapshot fallback by runtime environment; disables empty-DB auto-seed across `staging`, `production`, and `public_judging` unless `DRT_SEED_DEMO_ON_EMPTY=true`; enforces `public_judging` read-only shared DB for authenticated users, synthetic-only Guest Sandbox mutations (`SIMULATED`, zero live hardware/PII), redacted `DENIED` audit logs, and privileged reset token checks across all 22 routes |
| `server.impl.ts` | Calls `await verifyStartupConfigurationAsync(process.env)` before `app.listen()` (`process.exit(1)` on unverified scaling or config violation); adds `X-DrT-Client-Env`/`X-DrT-Client-Db` (`409 ENV_MISMATCH`) checks; updates `/api/cloud/infrastructure-status` and `/api/population-health/health` with explicit `Verified`/`Configured`/`Not verified`/`Unavailable`/`Simulated` states |
| `src/config/clientFirebaseValidation.ts` & `vite.config.ts` | Shared Node/browser validator enforcing explicit `VITE_RUNTIME_ENV` during Vite builds (`vite build` fails closed if omitted); FNV-1a fingerprint check prevents bundling dev Firestore DB IDs or `firebase-applet-config.json` (`__DRT_DEV_FIREBASE_CONFIG__ = null`) outside `development`; enforces frontend/backend agreement (`checkFrontendBackendEnvAgreement`) |
| `src/config/firebaseRuntimeConfig.ts`, `src/components/cloud/GoogleCloudHub.tsx` & `src/services/populationHealthClient.ts` | Consumes validated client config; removes hardcoded regions/metrics/PubSub project strings in UI; sends `X-DrT-Client-Env`, `X-DrT-Client-Db`, and `X-Guest-Session-Id` headers on Population Health API requests and exports |
| `scripts/test-production-isolation.ts` & `scripts/test-phase2-remediation.ts` | Local/subprocess/Vite-build verification suites (`14/14` + `9/9`) validating fail-closed startup, bundle exclusion, Cloud Run API gating, `public_judging` guards, and status honesty |

---

## 2. Explicit Environment Matrix

| Setting | `development` *(Active Dev)* | `staging` *(Proposed)* | `production` *(Proposed)* | `public_judging` *(Proposed)* |
|---|---|---|---|---|
| `DRT_RUNTIME_ENV` | `development` | `staging` | `production` | `public_judging` |
| `GOOGLE_CLOUD_PROJECT` | `gen-lang-client-0611153209` | Dedicated staging project | Dedicated prod project (`drt-prod-...`) | Dedicated judging project |
| `FIRESTORE_DATABASE_ID` | `ai-studio-drt-2e1619d9-9932-4538-9b6c-26b489ebfec2` | `drt-staging-db` | `drt-prod-clinical` *(Never dev DB)* | `drt-judging-synthetic-2026` |
| Silent Fallback to `firebase-applet-config.json` | Allowed | **BLOCKED (Fail-Closed)** | **BLOCKED (Fail-Closed)** | **BLOCKED (Fail-Closed)** |
| `POPULATION_GUEST_TOKEN_SECRET` | Optional (ephemeral dev CSPRNG) | **MANDATORY (>=32 chars, Secret Manager)** | **MANDATORY (>=32 chars, Secret Manager)** | **MANDATORY (>=32 chars, Secret Manager)** |
| `DRT_SYNTHETIC_ONLY` | `true` | `true` | `false` | **MANDATORY `true`** |
| Empty DB Auto-Seed | `true` (20 demo cohorts) | **`false` (Clean empty unless `DRT_SEED_DEMO_ON_EMPTY=true`)** | **`false` (Clean zero-cohort clinical start)** | **`false` unless explicitly seeded (`DRT_SEED_DEMO_ON_EMPTY=true`) or admin reset token** |
| `VITE_RUNTIME_ENV` Build Guard | `npm run build:dev` (`VITE_RUNTIME_ENV=development`) | **Mandatory `staging`** + all `VITE_FIREBASE_*` | **Mandatory `production`** + all `VITE_FIREBASE_*` | **Mandatory `public_judging`** + `VITE_SYNTHETIC_ONLY=true` + all `VITE_FIREBASE_*` |
| Cloud Run Scaling Enforcement | Local sandbox | **Cloud Run Admin API verified `maxInstanceCount=1`** | **Cloud Run Admin API verified `maxInstanceCount=1`** | **Cloud Run Admin API verified `maxInstanceCount=1`** |

---

## 3. Proposed Process: Provisioning a Separate Production Firestore Database *(Not Executed)*

1. **Create dedicated Firestore Native database** in the isolated production GCP project (`<PROD_PROJECT_ID>`):
   ```bash
   gcloud firestore databases create \
     --project="<PROD_PROJECT_ID>" \
     --database="drt-prod-clinical" \
     --location="asia-southeast1" \
     --type="firestore-native" \
     --enable-delete-protection
   ```
2. **Deploy hardened `firestore.rules` cleanly** to the production project/database (without removing any existing rule guards).
3. **Create a dedicated least-privilege runtime service account** (`drt-prod-runner@<PROD_PROJECT_ID>.iam.gserviceaccount.com`) holding **only** `roles/datastore.user` and Secret Manager accessor roles (`roles/secretmanager.secretAccessor`) on required secrets.
4. **Update CI/CD build args** explicitly per target environment (`npm run build` fails closed if `VITE_RUNTIME_ENV` or any `VITE_FIREBASE_*` field is missing; use `npm run build:dev` only for local dev bundles):
   - `VITE_RUNTIME_ENV=production`
   - `VITE_FIREBASE_PROJECT_ID=<PROD_PROJECT_ID>`
   - `VITE_FIRESTORE_DATABASE_ID=drt-prod-clinical`
   - `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_APP_ID`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - Note: Current dev Firestore lives in `us-west1`; choose your production DB region deliberately (`asia-southeast1` or `us-west1`) to co-locate Cloud Run compute with Firestore.

---

## 4. Secret Manager Configuration (`POPULATION_GUEST_TOKEN_SECRET` & Runtime Secrets)

- **Never commit secrets** in `.env`, git history, or `firebase-applet-config.json`.
- **Provision secrets in Google Secret Manager** *(Proposed — Not Executed)*:
  ```bash
  # Generate random 48-byte base64url secret offline/in memory and store directly without shell history logging:
  openssl rand -base64 48 | gcloud secrets create POPULATION_GUEST_TOKEN_SECRET \
    --project="<PROD_PROJECT_ID>" --data-file=-
  ```
- Bind secrets into Cloud Run via `--set-secrets`:
  - `POPULATION_GUEST_TOKEN_SECRET=POPULATION_GUEST_TOKEN_SECRET:latest`
  - `GEMINI_API_KEY=GEMINI_API_KEY:latest`
  - Optional: `PRESAGE_API_KEY=PRESAGE_API_KEY:latest`
- Runtime validation guarantees: server startup (`validateStartupConfiguration`) refuses boot if `POPULATION_GUEST_TOKEN_SECRET` is absent, `< 32` characters, or a placeholder, and never logs the secret value.

---

## 5. Multi-Instance Cloud Run Analysis & Scaling Architecture

### Process-Local State Inventory & Scaling Behavior
1. **Guest HMAC Tokens (`gdemo.<payload>.<sig>`):** Signed tokens resolve deterministically across instances **when** `POPULATION_GUEST_TOKEN_SECRET` is mounted consistently via Secret Manager (`>=32` chars, fail-closed outside `development`).
2. **Process-Local Stores (`PROCESS_LOCAL_STATE_INVENTORY` in `src/server/runtimeEnvironment.ts`):**
   - `PopulationHealthService.state` (`critical_single_instance_required`): write-through cache in Node RAM. Multi-instance Cloud Run scaling would serve stale reads across containers without shared cache invalidation.
   - `PopulationHealthService.guestSandboxes` (`demo_isolated_session_map`): bounded in-memory sandbox map (`0` Firestore writes); multi-instance routing without affinity would split a judge's session across instances.
   - `populationHealthAuth.rateLimitBuckets` (`process_local_best_effort`): sliding-window limiter in RAM (`RATE_LIMITER_GLOBALLY_ENFORCED = false`); provides per-container flood protection only, **not** global fleet enforcement (use Cloud Armor WAF for fleet rate limiting).
   - `populationHealthAuth.certCache` (`safe_public_key_cache`), `cachedProbe` (`process_local_observability`), `GeminiCircuitBreaker.breakers` (`process_local_best_effort`), and optional SSE/module maps (`module_scoped_session_state`).

### Safe Scaling Enforcement (Phase 2 Fail-Closed Model)
- **Cloud Run Admin API Verification (`IMPLEMENTED GUARDRAIL`):** `verifyStartupConfigurationAsync()` calls `run.googleapis.com/v2/projects/<PROJECT>/locations/<REGION>/services/<K_SERVICE>` using container ADC credentials and refuses startup outside `development` unless `template.scaling.maxInstanceCount === 1`. Self-declared `CLOUD_RUN_MAX_INSTANCES=1` env vars are **not trusted** as proof, and legacy `DRT_ALLOW_MULTI_INSTANCE` overrides have been **removed**. Ensure the Cloud Run runtime SA has read-only `roles/run.viewer` (or deploy `template.scaling.maxInstanceCount=1`) so startup verification can confirm the scaling ceiling.
- **Future Horizontal-Scale Target Architecture (`PROPOSED`):**
  1. Replace process-local `this.state` cache reads in `PopulationHealthService` with scoped Firestore queries + `updateTime`/transaction reads.
  2. Persist ephemeral Guest Sandbox deltas to TTL-expiring Firestore subcollections (`population_guest_sandboxes/{sid}`) with Cloud Firestore TTL expiration policies.
  3. Enforce global fleet rate limiting at Cloud Armor / API Gateway / Memorystore Redis in front of Cloud Run (`populationHealthAuth.ts` remains best-effort per container).

---

## 6. Production Runtime Service Account Verification Checklist *(Read-Only Admin Steps)*

Before any promotion to `ais-pre-*` or standalone production Cloud Run:
- [ ] Run `gcloud run services describe ais-pre-4s4jvpipr3mh3mz6x2hpfp --region=asia-southeast1 --format='value(spec.template.spec.serviceAccountName)'` (or check standalone production service).
- [ ] Confirm production runtime service account is distinct from `ais-sandbox@...` dev SA.
- [ ] Verify SA has `roles/datastore.user` **only** on `<PROD_PROJECT_ID>` (`gcloud projects get-iam-policy <PROD_PROJECT_ID> --flatten=bindings --filter="bindings.members:<SA>"`).
- [ ] Verify SA does **not** hold broad `roles/editor`, `roles/owner`, or cross-project access into `gen-lang-client-0611153209` dev Firestore DB.
- [ ] Verify SA holds `roles/secretmanager.secretAccessor` scoped strictly to `POPULATION_GUEST_TOKEN_SECRET`, `GEMINI_API_KEY`, and optional `PRESAGE_API_KEY`.
- [ ] Confirm `GET /api/population-health/health?refresh=1` on staging/prod returns `environment: "production"`, `persistenceStatus.mode: "FIRESTORE_LIVE"`, and `isSyntheticOnly: false`.

---

## 7. Separate Public Judging Deployment Design (`public_judging` — Synthetic-Only)

To allow public competition evaluators to test `#population-health` cleanly **without** exposing `production`, real patient data, or dev's database:
- **Separate Cloud Run Service:** e.g. `dr-t-fhc2026-judging` (`--allow-unauthenticated` ingress at Cloud Run layer, no AI Studio preview cookie barrier).
- **Mandatory Env Settings:**
  - `DRT_RUNTIME_ENV=public_judging`
  - `DRT_SYNTHETIC_ONLY=true`
  - `GOOGLE_CLOUD_PROJECT=<JUDGING_PROJECT_ID>`
  - `FIRESTORE_DATABASE_ID=drt-judging-synthetic-2026` *(Dedicated DB; never dev or prod)*
  - `POPULATION_GUEST_TOKEN_SECRET` & `DRT_JUDGING_RESET_TOKEN` (`>=24` chars) mounted via Secret Manager
  - `VITE_RUNTIME_ENV=public_judging`, `VITE_SYNTHETIC_ONLY=true`, `VITE_FIRESTORE_DATABASE_ID=drt-judging-synthetic-2026` (plus explicit `VITE_FIREBASE_*` keys)
- **Access & Safety Guardrails (`IMPLEMENTED IN CODE`):**
  - Authenticated Firebase shared-database writes across mutating `/api/population-health/*` routes are rejected (`403 FORBIDDEN`) in `public_judging`.
  - Guest Sandbox sessions (`X-Guest-Session-Id` verified against signed token `sid`) write exclusively to in-memory ephemeral sandboxes (`0` Firestore writes) and reject non-synthetic payloads (`dataOrigin: 'LIVE' | 'IMPORTED'`, `isLiveHardware: true`, `isSynthetic: false`, `realPatient: true`, direct PII identifiers). Denied attempts emit redacted `DENIED` audit log entries without storing raw PII.
  - `/api/population-health/demo/load` and `/demo/reset` are blocked for guests/public callers and require `platform_admin` + `X-DrT-Admin-Reset-Token` matched via `crypto.timingSafeEqual`.
  - `/api/cloud/infrastructure-status` and `/api/population-health/health` explicitly report `Simulated` for in-app Pub/Sub & GKE components and `Not verified` where platform telemetry/IAM is unavailable, enforcing `409 ENV_MISMATCH` if frontend/backend env or DB headers disagree.

---

## 8. Backup/PITR, Monitoring, Incident Response, Secret Rotation & Rollback

1. **Backup & Point-in-Time Recovery (PITR):**
   - Enable Firestore PITR (7-day recovery window) + daily scheduled Firestore exports (`gcloud firestore export gs://<PROD_BACKUP_BUCKET>/firestore-daily`) with bucket retention locks and CMEK encryption.
2. **Monitoring & Alerting (Cloud Monitoring):**
   - Alert on: Cloud Run HTTP `5xx` rate `> 1%`, `/api/population-health/health` `persistenceStatus.mode != "FIRESTORE_LIVE"`, elevated HTTP `401`/`403` spikes, latency `p95 > 2000ms`, and `DETERMINISTIC_FALLBACK` circuit-breaker openings.
3. **Incident Response & Secret Rotation:**
   - **Rotation Cadence:** Rotate `POPULATION_GUEST_TOKEN_SECRET` every 90 days (guest sandbox tokens expire within 6h naturally); rotate `GEMINI_API_KEY` every 90 days or immediately on anomaly.
   - **Leak Playbook:** Disable leaked key/secret version in Secret Manager -> promote new version -> deploy fresh revision -> audit `population_audit_logs` & Cloud Audit Logs for unauthorized mutations.
4. **Rollback Plan:**
   - Because all 8 `population_*` collections are additive and `population_audit_logs` is append-only (`allow update, delete: if false`), Cloud Run supports instant zero-downtime traffic rollback via `gcloud run services update-traffic <SERVICE> --to-revisions=<PRIOR_GOOD_REV>=100` without touching legacy Dr. T collections.
