# Dr. T — Phase 2 Production Isolation Remediation Report

**Status:** Code Remediations A–D **IMPLEMENTED & VERIFIED** in the Dr. T development codebase. Cloud infrastructure provisioning (`staging`, `public_judging`, `production`), `ais-pre-*`, IAM, Secret Manager, and live Firestore databases/rules were **NOT modified**.

---

## 1. Root Causes Addressed (Audit Findings)

1. **Frontend Silent Development Fallback (`src/config/firebaseRuntimeConfig.ts`, `vite.config.ts`)**: Running `npm run build` (`vite build`) without `VITE_RUNTIME_ENV` silently resolved `VITE_RUNTIME_ENV` to `'development'`, bundling `firebase-applet-config.json` (`ai-studio-drt-2e1619d9-9932-4538-9b6c-26b489ebfec2`) and dev Firebase Web SDK credentials into production `dist/assets/*.js`. Also, static imports and literal constant comparisons could embed dev DB identifiers into production JS chunks.
2. **Self-Declared Multi-Instance Scaling Trust (`src/server/runtimeEnvironment.ts`, `src/server/populationHealthAuth.ts`)**: `validateStartupConfiguration` trusted `CLOUD_RUN_MAX_INSTANCES=1` env vars and allowed `DRT_ALLOW_MULTI_INSTANCE=true` without verifying Cloud Run's actual platform scaling ceiling (`template.scaling.maxInstanceCount`), while `PopulationHealthService.state`, `guestSandboxes`, and `rateLimitBuckets` reside in process-local RAM. Furthermore, `resolveServerFirebaseConfig(..., { skipStrictEnvValidation: true })` could previously fall through to `readDevConfigFile()` in diagnostics helpers.
3. **`staging` & `public_judging` Mutation Gaps (`src/server/populationHealthService.ts`, `server.impl.ts`)**: `staging` auto-seeded 20 synthetic cohorts on an empty DB; `public_judging` lacked shared-DB write blocking for authenticated Firebase users, strict synthetic-only validation on guest mutations, cross-session `X-Guest-Session-Id` verification, redacted `DENIED` audit logging on PII rejections, and constant-time privileged token gating for `/demo/load` and `/demo/reset`.
4. **Hardcoded Dev Strings & Unlabeled Simulated Metrics (`server.impl.ts`, `src/components/cloud/GoogleCloudHub.tsx`)**: `/api/cloud/infrastructure-status` returned hardcoded mock latencies/session counts (`14 ms`, `184`, `99.98%`) and `GoogleCloudHub.tsx` hardcoded `asia-southeast1`, `0 - 10 instances`, and `projects/gen-lang-client-0611153209/topics/...` `<option>` values regardless of runtime environment.

---

## 2. Remediations Implemented

### Remediation A: Frontend Fail-Closed Config & Zero Dev Bundle Leakage
- **`src/config/clientFirebaseValidation.ts`**:
  - Enforces fail-closed `resolveAndValidateClientFirebaseConfig()` across both Vite build time (`vite.config.ts`) and browser runtime (`src/config/firebaseRuntimeConfig.ts`).
  - Bare `vite build` / `npm run build` without explicit `VITE_RUNTIME_ENV` throws `[Dr. T Frontend Config BLOCKED]`. Added `npm run build:dev` (`VITE_RUNTIME_ENV=development vite build --mode development && ...`) specifically for local development artifact builds.
  - Rejects missing or placeholder `VITE_FIREBASE_*` keys, `(default)` DBs, and the dev Firestore DB in `staging`/`production`/`public_judging` using a deterministic dual-32-bit FNV-1a fingerprint (`isDevelopmentFirestoreDatabaseId`) so the plaintext dev DB string is never bundled into non-dev JS chunks.
  - Requires `VITE_SYNTHETIC_ONLY=true` when `VITE_RUNTIME_ENV=public_judging`.
  - Exports `checkFrontendBackendEnvAgreement()` to detect environment, GCP project, or Firestore DB mismatches between the client bundle and server API.
- **`vite.config.ts` & `src/config/firebaseRuntimeConfig.ts`**:
  - Validates `DRT_RUNTIME_ENV === VITE_RUNTIME_ENV` when both are supplied during builds.
  - Injects `__DRT_DEV_FIREBASE_CONFIG__ = null` for all non-dev builds and removes static JSON imports from browser source files.

### Remediation B: Cloud Run Admin API Single-Instance Verification & Process-Local Inventory
- **`src/server/runtimeEnvironment.ts`**:
  - Removed `DRT_ALLOW_MULTI_INSTANCE` override and stopped trusting `CLOUD_RUN_MAX_INSTANCES=1` env vars without platform proof.
  - `verifyCloudRunSingleInstanceFromApi()` queries `run.googleapis.com/v2/projects/{project}/locations/{region}/services/{K_SERVICE}` using ADC/metadata server tokens and checks `template.scaling.maxInstanceCount === 1`.
  - `setupApp()` in `server.impl.ts` awaits `verifyStartupConfigurationAsync(process.env)` before `app.listen()` and exits non-zero (`process.exit(1)`) on unverified or multi-instance (`> 1`) scaling outside `development`.
  - Fixed `resolveServerFirebaseConfig(..., { skipStrictEnvValidation: true })` so non-dev environments never fall through to `firebase-applet-config.json`.
  - Exported complete `PROCESS_LOCAL_STATE_INVENTORY`:

| Store | Module | Classification | Multi-Instance Impact |
|---|---|---|---|
| `PopulationHealthService.state` | `src/server/populationHealthService.ts` | `critical_single_instance_required` | Write-through RAM cache without cross-instance invalidation; requires Cloud Run Admin API `maxInstanceCount=1` or stateless refactor |
| `PopulationHealthService.guestSandboxes` | `src/server/populationHealthService.ts` | `demo_isolated_session_map` | Ephemeral bounded map (`max 200`, `0` Firestore writes); multi-instance routing splits guest sessions |
| `populationHealthAuth.rateLimitBuckets` | `src/server/populationHealthAuth.ts` | `process_local_best_effort` | Per-container sliding-window limiter (`RATE_LIMITER_GLOBALLY_ENFORCED = false`); requires Cloud Armor WAF / Redis for global limits |
| `populationHealthAuth.certCache` | `src/server/populationHealthAuth.ts` | `safe_public_key_cache` | Read-only Google RS256 public certificate cache |
| `populationHealthFirestoreStore.cachedProbe` | `src/server/populationHealthFirestoreStore.ts` | `process_local_observability` | 15s connectivity probe cache (bypassed via `?refresh=1`) |
| `GeminiCircuitBreaker.breakers` | `src/server/geminiCircuitBreaker.ts` | `process_local_best_effort` | Per-container 30s Gemini fallback circuit breaker |
| `mcpSseSessions / capturedOrdersCache / investigations / uploadedBuffers` | `server.impl.ts`, `payflowServerService.ts`, `solarFilamentService.ts` | `module_scoped_session_state` | In-process session buffers for auxiliary modules |

### Remediation C: `public_judging` Write, Guest Sandbox, Reset & Audit Guardrails
- **Clean-Empty-DB Across Non-Dev Environments**: Both `PopulationHealthService` constructor and `runInitializeDurablePersistence()` initialize clean empty state (`demoActive: false`, `0` cohorts) for `staging`, `production`, and `public_judging` unless `DRT_SEED_DEMO_ON_EMPTY=true`.
- **Session Binding & Reset Auth (`src/server/populationHealthAuth.ts`, `server.impl.ts`)**:
  - `X-Guest-Session-Id` must match the signed `gdemo.*` token `sid` (`403` on mismatch).
  - `X-DrT-Client-Env` and `X-DrT-Client-Db` mismatches return `HTTP 409 ENV_MISMATCH`.
  - `verifyPrivilegedResetToken()` compares `X-DrT-Admin-Reset-Token` against `DRT_JUDGING_RESET_TOKEN` (`>= 16` chars, rejecting placeholders) using `crypto.timingSafeEqual`.
- **Complete 22-Route `/api/population-health/*` Policy (`POPULATION_HEALTH_ROUTE_INVENTORY`)**:
  - `GET /health` (`PUBLIC_HEALTH`): redacted status + `runtimeSafety` + `publicJudgingPolicy`.
  - `POST /guest-session` (`GUEST_MINT`): mints signed `gdemo.*` session token.
  - `GET /dashboard`, `GET /export` (`READ_ONLY`): allowed for authenticated users and Guest Sandbox (k-anonymity + PII-stripped).
  - All 16 `WRITE_MUTATION` routes (`POST /participants`, `PATCH /participants/:id/consent`, `DELETE /participants/:id`, `POST /observations`, `POST /integrations/health-alert-bridge`, `POST /integrations/presage-bridge`, `POST /risk-signals/:id/status`, `PATCH /alerts/:id`, `PATCH /alert-rules/:id`, `POST /referrals`, `PATCH /referrals/:id`, `POST /programmes/:id/action`, `POST /engagement/:id/gate`, `POST /ai/synthesize`, `POST /ai/:id/approve`, `PATCH /governance/k-threshold`):
    - **Verified Firebase Users in `public_judging`:** Blocked (`403 FORBIDDEN`) with redacted `DENIED` audit entry — shared judging Firestore DB is strictly read-only for public mutations.
    - **Guest Sandbox in `public_judging`:** Writes stay strictly inside ephemeral RAM `guestSandboxes` (`0` Firestore writes); non-synthetic markers (`dataOrigin: 'LIVE' | 'IMPORTED'`, `isLiveHardware: true`, `isSynthetic: false`, `realPatient: true`) and privileged operations (`DELETE /participants/:id`, `PATCH /governance/k-threshold`) are rejected (`403`); PII submissions are rejected (`400`) and logged as redacted `DENIED` audit records containing **zero raw PII strings**.
  - `POST /demo/load` & `POST /demo/reset` (`ADMIN_RESET_OR_SEED`): blocked for guests and standard users (`403`); outside `development`, require `platform_admin` + valid `X-DrT-Admin-Reset-Token`.

### Remediation D: Honest Cloud Infrastructure Telemetry (`server.impl.ts`, `GoogleCloudHub.tsx`)
- Replaced hardcoded regions (`asia-southeast1`), fake latencies (`14 ms`), fake uptime (`99.98%`), fake instance ranges (`0 - 10 instances`), and static `gen-lang-client-0611153209` Pub/Sub topic `<option>` values with explicit operational states (`Verified`, `Configured`, `Not verified`, `Unavailable`, `Simulated`), dynamic `firebaseConfig.projectId`, actual probe latency (`probeLatencyMs`), and frontend/backend agreement alert banners.

---

## 3. Verification Summary

- **`npx tsx scripts/test-phase2-remediation.ts`**: **9/9 PASSED (exit 0)** — verified bare `vite build` fail-closed failure, prod/judging `vite build` exclusion of dev DB IDs, `verifyStartupConfigurationAsync` Cloud Run Admin API pass (`maxInstanceCount=1`) and reject (`maxInstanceCount=4` or env-var-only), `PROCESS_LOCAL_STATE_INVENTORY`, `public_judging` shared-DB `403`, synthetic-only guest sandbox, PII redacted `DENIED` audit logs, `X-Guest-Session-Id` spoof `403`, `X-DrT-Client-Env` mismatch `409`, timing-safe reset token checks, and `/api/cloud/infrastructure-status` telemetry honesty.
- **`npx tsx scripts/test-production-isolation.ts`**: **14/14 PASSED (exit 0)**.
- **Regression Suites & Typecheck**: `npm run lint` (`tsc --noEmit`), `npm run test:population-health`, `test-firestore-security-rules.ts`, `test-future-health.ts`, `test-health-alert.ts`, `test-presage-sense.ts`, `test-vision-alert.ts`, `test-solar-filament.ts` executed cleanly with `0` failures.

---

## 4. Remaining Unresolved Cloud Blockers (Non-Code)

1. Dedicated GCP projects / Firestore Native DBs (`drt-staging-db`, `drt-judging-synthetic-2026`, `drt-prod-clinical`) with PITR + delete protection are **Not provisioned**.
2. Secret Manager secrets (`POPULATION_GUEST_TOKEN_SECRET`, `DRT_JUDGING_RESET_TOKEN`, `GEMINI_API_KEY`) and Cloud Run IAM bindings (including `roles/run.viewer` for `maxInstanceCount=1` self-verification) remain **Unprovisioned / Not verified** from sandbox (`HTTP 403`).
3. Global multi-instance horizontal scaling (`maxInstanceCount > 1`) remains **Blocked by design** until `PopulationHealthService.state`, `guestSandboxes`, and `rateLimitBuckets` are migrated to Firestore transactions / Memorystore Redis / Cloud Armor.

### Owner Verification Commands (Cloud Shell)
```bash
# Confirm Cloud Run maxInstanceCount=1 and runtime service account
gcloud run services describe <SERVICE_NAME> --region=<REGION> --project=<PROJECT_ID> \
  --format='yaml(spec.template.spec.serviceAccountName,spec.template.scaling,status.traffic)'

# Confirm built client bundle contains zero dev database IDs
grep -rn "ai-studio-drt-2e1619d9-9932-4538-9b6c-26b489ebfec2" dist/assets || echo "CLEAN"
```
