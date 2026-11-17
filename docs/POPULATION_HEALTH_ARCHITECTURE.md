# Dr. T — Community Health Signal Intelligence
## Technical Architecture & API Reference

---

## 1. System Topology (Inside Existing Dr. T Monorepo)

The Population Health module extends Dr. T's Express + Vite React 18 TypeScript monorepo on port `3000` while preserving every existing route and workspace:

- **Contracts:** `src/types/populationHealth.ts` (canonical role unions `CanonicalPopulationRole`, legacy role aliases, `PersistenceStatusInfo`, `emergencyGuidance`, `complianceMetadata`, `PopulationRiskSignal` review/observation lineage).
- **Cryptographic Auth & Rate Limiting (`src/server/populationHealthAuth.ts`):**
  - Verifies Firebase ID tokens (`RS256`, `aud`, `iss`, `exp`, `iat`, `sub`) against cached Google Secure Token x509 certificates.
  - Mints and validates server-signed HMAC-SHA256 Guest Sandbox tokens (`gdemo.<payload>.<sig>`, ephemeral 256-bit secret per lifecycle, 6-hour expiry).
  - Prevents header spoofing (`X-Population-Role` / `?role=`) above verified role ceiling (`HTTP 403`) and applies per-actor/IP sliding-window rate limits (`HTTP 429`).
- **Firestore Persistence Adapter & Probe (`src/server/populationHealthFirestoreStore.ts`):**
  - Probes Cloud Run Metadata ADC token (`ais-sandbox@ais-asia-southeast1-a11562d113.iam.gserviceaccount.com`) + Firestore REST endpoint (`projects/gen-lang-client-0611153209/databases/ai-studio-drt-2e1619d9-9932-4538-9b6c-26b489ebfec2/documents/population_participants?pageSize=1`).
  - Implements full idempotent REST v1 persistence (`PopulationHealthFirestoreStore`): `listCollection`, `getDocument`, `upsertDocument`, chunked parallel `upsertAll` (chunk size 8), append-only `createImmutableDocument` (`population_audit_logs`), atomic `population_system_config/default` (`seededComplete: true` written last), PDPL `deleteDocument`, startup `loadFullSnapshot`, and queued write-through `syncSnapshot` with retry on `409`/`429`/`503`. Strictly skips Guest Sandbox writes.
  - Surface states cleanly: `FIRESTORE_LIVE` (currently active & verified), `FILE_SANDBOX_FALLBACK`, or `EPHEMERAL_GUEST_SANDBOX`.
- **Analytics & Privacy Core (`src/server/populationHealthEngine.ts`):**
  - `containsDirectIdentifier`: rejects emails, US/international phones, Vietnamese `+84`/`09x` phones, VN 12-digit CCCDs, and SSNs while permitting clinical ratios like `146/92 mmHg`.
  - `computeKAnonymityCohorts` & `computeTrendsAndImpact(..., suppressForPrivacy)`: enforces `k`-anonymity across Cohort × Region tables, KPI cards, trends, and exports.
- **Service Layer & Non-Blocking Boot (`src/server/populationHealthService.ts`, `server.impl.ts`):**
  - `resolveListenPort()` honors CLI `--port` ahead of container `PORT`, starting HTTP listening immediately while background `initializeDurablePersistence()` hydrates from Firestore (`initPromise` deduplicated); authenticated endpoints & `/health` await `ensurePersistenceReady()`, and non-guest mutations await `flushFirestoreSync()`. Maintains primary state + bounded per-session `guestSandboxes` map (`MAX_GUEST_SANDBOXES=200`, `TTL=6h`), enforces canonical RBAC roles + guest sandbox (`ROLE_PERMISSIONS`), redacts PII across all analyst payloads, runs PDPL erasure (`eraseParticipantData`), and audits every `ALLOWED`/`DENIED` call.

---

## 2. HTTP REST Endpoints (`server.impl.ts`)

Security headers enforced on `/api/population-health*`: `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, `Cache-Control: no-store`.

- `GET /api/population-health/health` — Public diagnostics returning `persistenceStatus`, `hasGeminiKey`, safe non-secret `geminiDiagnostics` (`LIVE_AI` | `DETERMINISTIC_FALLBACK` | `UNAVAILABLE`), and connector telemetry.
- `POST /api/population-health/guest-session` — Mints an isolated, signed Guest Sandbox token (`201`).
- **Authenticated Endpoints (require valid Bearer Firebase ID Token or `gdemo.*` Guest Token; return `401` if absent/invalid, `403` on privilege escalation/denied permission):**
  - `GET /api/population-health/dashboard` (`?dateRange=&cohort=&region=`)
  - `POST /api/population-health/participants`
  - `PATCH /api/population-health/participants/:id/consent`
  - `DELETE /api/population-health/participants/:id` *(PDPL Right to Erasure — `platform_admin` only; `403` for Guest Sandbox)*
  - `POST /api/population-health/observations`
  - `POST /api/population-health/integrations/health-alert-bridge`
  - `POST /api/population-health/integrations/presage-bridge`
  - `POST /api/population-health/risk-signals/:id/status`
  - `PATCH /api/population-health/alerts/:id` & `PATCH /api/population-health/alert-rules/:id`
  - `POST /api/population-health/referrals` & `PATCH /api/population-health/referrals/:id`
  - `POST /api/population-health/programmes/:id/action`
  - `POST /api/population-health/engagement/:id/gate`
  - `POST /api/population-health/ai/synthesize` & `POST /api/population-health/ai/:id/approve`
  - `PATCH /api/population-health/governance/k-threshold` *(`platform_admin` only)*
  - `GET /api/population-health/export?format=csv|json&dateRange=&cohort=&region=`
  - `POST /api/population-health/demo/load` & `POST /api/population-health/demo/reset`

---

## 3. Firestore Rules (`firestore.rules` — **DEPLOYED**)

Deployed to `gen-lang-client-0611153209` (`deploy_firebase`), covering `population_participants`, `population_consents`, `population_observations`, `population_alerts`, `population_programmes`, `population_referrals`, and append-only `population_audit_logs` (`allow update, delete: if false;`), supporting canonical `'programme_manager'` alongside `'population_health_manager'`, with zero wildcard `{document=**}` catch-alls.
