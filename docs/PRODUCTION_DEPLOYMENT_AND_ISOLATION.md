# Dr. T — Production Data Isolation & Deployment Runbook

**Status:** Code-side isolation & fail-closed startup guards **IMPLEMENTED** (`src/server/runtimeEnvironment.ts`, `src/config/firebaseRuntimeConfig.ts`). Infrastructure actions below remain **PROPOSED (NOT EXECUTED)** — production (`ais-pre-*`) and live Firestore databases/rules were **NOT modified**.

---

## 1. Repository Audit: `firebase-applet-config.json`, `GOOGLE_CLOUD_PROJECT` & `FIRESTORE_DATABASE_ID`

| File | Previous Behavior | Updated Behavior (Implemented) |
|---|---|---|
| `src/server/runtimeEnvironment.ts` *(New)* | Did not exist | Single source of truth resolving `development`, `staging`, `production`, `public_judging`; blocks silent dev fallback outside `development` |
| `src/server/populationHealthFirestoreStore.ts` | Read `firebase-applet-config.json` first and silently fell back to hardcoded dev constants | Delegates to `resolveServerFirebaseConfig(process.env)` so non-dev envs require explicit `GOOGLE_CLOUD_PROJECT` & non-dev `FIRESTORE_DATABASE_ID` |
| `src/server/populationHealthAuth.ts` | Read `firebase-applet-config.json` first; silently generated random per-process `GUEST_HMAC_SECRET` | Uses `resolveServerFirebaseConfig()` for Firebase `aud`/`iss` project checks and requires Secret Manager `POPULATION_GUEST_TOKEN_SECRET` (>=32 chars) outside `development` |
| `src/server/populationHealthService.ts` | Auto-seeded 20 synthetic cohorts on any empty DB | In `production`, initializes clean empty state (`demoActive: false`) unless `DRT_SEED_DEMO_ON_EMPTY=true` is set |
| `server.impl.ts` | Started directly without DB env check; hardcoded dev strings in `/api/cloud/infrastructure-status` | Calls `validateStartupConfiguration()` synchronously inside `setupApp()` and **exits non-zero** before `app.listen()` on missing/shared dev DB config or missing guest secret |
| `src/config/firebaseRuntimeConfig.ts` *(New)* | Did not exist | Resolves Vite `VITE_RUNTIME_ENV`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIRESTORE_DATABASE_ID`; throws if non-dev client build lacks isolated DB or targets dev DB |
| `src/services/firebase.ts` & `src/components/cloud/GoogleCloudHub.tsx` | Direct static import of `firebase-applet-config.json` | Consumes `firebaseRuntimeConfig` so staging/production/judging frontend builds isolate client Firestore DBs cleanly |
| `scripts/test-live-firestore-permissions.ts` & `scripts/test-population-health.ts` | Dev permission/unit harness referencing dev config/REST URL mocks | Preserved strictly as local/dev verification harnesses |

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
| Empty DB Auto-Seed | `true` (20 demo cohorts) | Configurable | **`false` (Clean zero-cohort clinical start)** | `true` (Synthetic showcase only) |
| Cloud Run Scaling (`max-instances`) | `1` (Dev sandbox) | `1` | `1` *(Required until stateless cache refactor)* | `1` *(Or stateless mode)* |

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
4. **Update CI/CD build args** for production builds with `VITE_RUNTIME_ENV=production`, `VITE_FIREBASE_PROJECT_ID=<PROD_PROJECT_ID>`, and `VITE_FIRESTORE_DATABASE_ID=drt-prod-clinical`.

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

### Current Architecture Behavior Under `max-instances > 1`
1. **Guest HMAC Tokens (`gdemo.<payload>.<sig>`):** Resolved safely **if** `POPULATION_GUEST_TOKEN_SECRET` is mounted consistently across all instances via Secret Manager (already enforced fail-closed outside `development`).
2. **Process-Local Memory Cache (`PopulationHealthService`):**
   - Primary authenticated state, `guestSandboxes` in-memory map, and sliding-window rate-limiter buckets live inside process RAM on each Cloud Run container.
   - Under `max-instances > 1` without sticky sessions or shared backing store: writes on Instance A are persisted to Firestore (`FIRESTORE_LIVE`), but Instance B's warm memory cache will serve stale data until restart, and Guest Sandbox tokens routed to Instance B will spawn a fresh sandbox state or fail IP rate-limit consistency.

### Safe Scaling Recommendation
- **Immediate Safe Production Topology (`IMPLEMENTED GUARDRAIL`):** Pin Cloud Run `--min-instances=0 --max-instances=1 --concurrency=80`. Startup validation explicitly rejects `CLOUD_RUN_MAX_INSTANCES > 1` unless `DRT_ALLOW_MULTI_INSTANCE=true` is passed after full stateless refactoring.
- **Future Horizontal-Scale Target Architecture (`PROPOSED`):**
  1. Replace process-local `this.state` cache reads in `PopulationHealthService` with scoped Firestore reads (`loadFullSnapshot` or collection queries per request / short TTL with Firestore `updateTime` ETags).
  2. Persist ephemeral Guest Sandbox deltas to short-TTL Firestore subcollections (`population_guest_sandboxes/{sid}`) with Cloud Firestore TTL expiration policies (`expireAt`), removing in-memory instance affinity.
  3. Move rate limiting (`checkRateLimit`) to Memorystore Redis or Cloud Armor WAF policies.

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
  - `POPULATION_GUEST_TOKEN_SECRET` mounted via Secret Manager
  - `VITE_RUNTIME_ENV=public_judging`, `VITE_FIRESTORE_DATABASE_ID=drt-judging-synthetic-2026`
- **Access & Safety Controls:** Banner clearly marks synthetic-only showcase; real PII identifiers blocked by `containsDirectIdentifier`; Firestore writes strictly isolated from Guest Sandbox (`HTTP 404` in Firestore); periodic scheduled Cloud Run job resets showcase database to the 20 synthetic cohorts daily.

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
