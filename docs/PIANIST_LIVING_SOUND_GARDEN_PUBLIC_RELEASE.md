# PIANIST — The Living Sound Garden
## Isolated Public Release Architecture, Security Model & Deployment Runbook
### Meta VR Start Developer Competition 2026

**Parent Platform:** Dr. T (`https://github.com/Zenieverse/Dr.-T`)  
**Feature:** PIANIST — The Living Sound Garden (*Grow music with your hands.*)  
**Canonical Route:** `/#living-sound-garden` (and `/` on the dedicated static release host)  
**Build Path:** Browser-Native WebXR (`three@0.187.0` + W3C WebXR Device API + Web Audio HRTF) — **NOT Meta IWSDK**  
**Target Environment Name:** `public_judging`  
**Deployment Status:** **PREPARED & VALIDATED LOCALLY ONLY — NOT DEPLOYED** *(zero cloud infrastructure, IAM, Secret Manager, Firestore, or DNS mutations performed)*

---

## 1. Architecture Decision (Backed by Direct Source Audit)

Direct inspection of `src/components/pianist/soundgarden/*`, `src/App.tsx`, `src/services/firebase.ts`, `server.impl.ts`, `vite.config.ts`, `src/config/clientFirebaseValidation.ts`, and `src/server/runtimeEnvironment.ts` established the following facts:

| Audit Question | Verified Code Reality |
|---|---|
| Which parts of Dr. T require authentication? | `PopulationHealthModule` (`/api/population-health/*` Bearer Firebase ID token or signed Guest HMAC token) and user-scoped Firestore services in `src/services/firebase.ts` (`healthRecords`, `consultations`, `skinAnalyses`, `cloudAuditLogs`). |
| Can Living Sound Garden run without a signed-in user? | **Yes.** It never reads or writes Firebase Auth or Firestore. |
| Does Living Sound Garden have any mandatory backend dependency? | **No.** Zero `fetch()` calls and zero `/api/*` requests across all 7 files in `src/components/pianist/soundgarden/`. |
| Is browser-local composition storage sufficient for public judging? | **Yes.** Non-destructive browser `localStorage` (`drt_living_sound_garden_v1`) plus user-initiated JSON export & strict schema-validated JSON import (`validateAndDeserializeGardenSnapshot`) fulfill all save/load/share flows with zero server storage. |
| Are Gemini or other external AI APIs required? | **No.** All 5 botanical audio voices, 2.7s stereo woodland convolution reverb, 3D sanctuary meshes, lighting, and gesture mechanics are 100% procedural in-browser. |
| Do existing Dr. T server routes expose unrelated surfaces? | **Yes.** `server.impl.ts` mounts **163 Express routes** across unrelated clinical, PayPal, Hedera, Presage, and AI modules, and `src/App.tsx` statically imports Firebase SDK + 37+ modules (~9.0 MB uncompressed JS bundle). |
| Can Living Sound Garden operate safely without development services? | **Yes.** Completely standalone when built via its dedicated static WebXR entry (`sound-garden.html` -> `src/soundgarden-public/main.tsx` -> `dist-soundgarden/`). |

### Selected Release Architecture: **Minimal Static WebXR Release (`dist-soundgarden/`)**

Because PIANIST — The Living Sound Garden requires **zero backend APIs, zero Firestore databases, zero Firebase Auth, zero Gemini keys, and zero server-side secrets**, the safest and fastest public judging architecture is an **isolated static HTTPS WebXR bundle** (`dist-soundgarden/`) hosted on a dedicated public judging project (Firebase Hosting primary option, or an isolated static Cloud Run nginx container alternative).

**Why Static-Only Is Strictly Superior to Deploying the Full Dr. T Monolith for Quest Judging:**
1. **Zero Database & Zero Secret Attack Surface:** Eliminates Firestore provisioning, Secret Manager runtime secrets, and Cloud Run Admin API `maxInstanceCount=1` single-instance constraints for the Quest judging endpoint.
2. **Zero Unrelated Module Exposure:** Excludes all 163 Express API routes, Firebase SDK (`firestore.googleapis.com`, `identitytoolkit.googleapis.com`), clinical mock data (`MOCK_PATIENT`, `MOCK_ICU_PATIENTS`), and unrelated `/public` artifacts (`publicDir: false` in `vite.soundgarden.config.ts`).
3. **Quest Mobile Browser Performance:** Dramatically smaller split chunks (`three-vendor` + `ui-vendor` + app entry) vs. the ~9.0 MB full Dr. T monolith, with zero third-party font or CDN fetches.
4. **Hard Browser-Enforced Zero-Exfiltration:** Allows strict `Content-Security-Policy: ... connect-src 'none'`, guaranteeing at the browser level that zero network calls leave the client.

*(The full monolithic Dr. T `public_judging` backend path remains fully intact and tested in `vite.config.ts`, `src/server/runtimeEnvironment.ts`, `test-production-isolation.ts`, and `test-phase2-remediation.ts`, documented in `docs/PRODUCTION_DEPLOYMENT_AND_ISOLATION.md`.)*

---

## 2. Public Judging Environment Design (`public_judging`)

The dedicated public build (`vite.soundgarden.config.ts` + `src/config/soundGardenPublicValidation.ts`) enforces explicit fail-closed `public_judging` rules without weakening any existing Dr. T Phase 2 guards:

- **Explicit Environment Identification:** Requires `VITE_RUNTIME_ENV=public_judging`. Fails closed if omitted or set to `development`, `staging`, `production`, or an unknown value.
- **Environment Agreement:** If `DRT_RUNTIME_ENV` is present in the build shell, it must also equal `public_judging` (fails closed on mismatch).
- **Synthetic-Only Guard:** Requires `VITE_SYNTHETIC_ONLY=true` (and if `DRT_SYNTHETIC_ONLY` is present, it must equal `true`).
- **Development Database & Project Rejection:** Reuses `isDevelopmentFirestoreDatabaseId()` (FNV-1a dual fingerprint from `src/config/clientFirebaseValidation.ts`) plus `isDevelopmentGcpProjectId()` to fail closed if `VITE_FIRESTORE_DATABASE_ID`, `FIRESTORE_DATABASE_ID`, `VITE_FIREBASE_PROJECT_ID`, `GOOGLE_CLOUD_PROJECT`, or `DRT_FIREBASE_PROJECT_ID` points to the development Firestore DB, `(default)`, or the development GCP project (`gen-lang-client-0611153209`).
- **Placeholder Rejection:** Fails closed if any optional credential/config env var contains placeholder literals (`changeme`, `replace-me`, `placeholder`, `<...>`, `your-api-key`, `your-secret-here`, etc.).
- **Zero Secret Leakage Into Client Bundles:** `vite.soundgarden.config.ts` restricts `envPrefix: 'VITE_SOUNDGARDEN_'` and forces `__DRT_DEV_FIREBASE_CONFIG__: 'null'`, ensuring `GEMINI_API_KEY`, `POPULATION_GUEST_TOKEN_SECRET`, `DRT_JUDGING_RESET_TOKEN`, and even accidental `VITE_FIREBASE_*` shell vars are never embedded in `dist-soundgarden/`.
- **Zero Unrelated Public Asset Leakage:** Sets `publicDir: false` so `/public` files (Kaggle PDFs, CSVs, notebooks, portraits) are never copied into `dist-soundgarden/`.

---

## 3. Environment Variable Inventory

Safe template file (placeholders only, zero real secrets): `config/public-judging/soundgarden.env.template`

### Recommended Static WebXR Build Variables (Required)
| Variable | Required Value | Purpose | Bundled in Client? |
|---|---|---|---|
| `VITE_RUNTIME_ENV` | `public_judging` | Mandatory fail-closed client environment identifier | Literal `'public_judging'` only |
| `DRT_RUNTIME_ENV` | `public_judging` | Enforces agreement with server/CI environment naming | No |
| `VITE_SYNTHETIC_ONLY` | `true` | Mandatory fail-closed synthetic-only flag | Literal `'true'` only |
| `DRT_SYNTHETIC_ONLY` | `true` | Enforces synthetic-only agreement when set | No |

### Operator Deployment CLI Placeholders (Not Used Inside Browser Bundle)
| Placeholder | Purpose |
|---|---|
| `PUBLIC_JUDGING_GCP_PROJECT_ID` | Dedicated isolated GCP project for public judging (never `gen-lang-client-0611153209`) |
| `PUBLIC_JUDGING_REGION` | Region if deploying optional static Cloud Run container (e.g., `us-central1` or `asia-southeast1`) |
| `PUBLIC_JUDGING_HOSTING_SITE` | Dedicated Firebase Hosting site ID (primary static hosting option) |
| `PUBLIC_JUDGING_CLOUD_RUN_SERVICE` | Dedicated Cloud Run static container service name (alternative static option) |

### Variables Explicitly **NOT Required** by the Static WebXR Release
- `FIRESTORE_DATABASE_ID` / `VITE_FIRESTORE_DATABASE_ID` — Not needed (no Firestore dependency).
- `VITE_FIREBASE_*` — Not needed (no Firebase SDK bundled).
- `POPULATION_GUEST_TOKEN_SECRET` / `DRT_JUDGING_RESET_TOKEN` — Not needed (no backend auth routes).
- `GEMINI_API_KEY` / `PRESAGE_API_KEY` — Not needed (100% procedural in-browser synthesis & WebXR).

*(If an operator ever intentionally builds the full multi-module Dr. T monolith under `public_judging`, all existing fail-closed variables in `src/config/clientFirebaseValidation.ts` and `src/server/runtimeEnvironment.ts` remain mandatory and unchanged — see Section B of `config/public-judging/soundgarden.env.template`.)*

---

## 4. Isolation Model

| Existing Protected Resource | Isolation Guarantee |
|---|---|
| Development Cloud Run (`ais-dev-4s4jvpipr3mh3mz6x2hpfp`) | **Untouched.** Remains Google-auth gated behind AI Studio preview cookies. |
| Pre-Production Cloud Run (`ais-pre-4s4jvpipr3mh3mz6x2hpfp`) | **Untouched.** Never made public; env vars and IAM untouched. |
| Development Firestore (`ai-studio-drt-2e1619d9-9932-4538-9b6c-26b489ebfec2`) | **Unreachable & Build-Blocked.** Zero Firestore client SDK in `dist-soundgarden/`; build fails closed if DB ID is present in env. |
| Development GCP Project (`gen-lang-client-0611153209`) | **Isolated & Build-Blocked.** Deploy strictly to a separate `<DEDICATED_PUBLIC_JUDGING_GCP_PROJECT_ID>`. |
| Existing Dr. T Build & Test Pipeline (`npm run build`, `npm run build:dev`, `vite.config.ts`, `server.impl.ts`) | **100% Unchanged.** Verified via full regression suite (`105/105` prior tests + new public release smoke suite). |

---

## 5. Dedicated Public Judging Build Command

```bash
VITE_RUNTIME_ENV=public_judging \
DRT_RUNTIME_ENV=public_judging \
VITE_SYNTHETIC_ONLY=true \
DRT_SYNTHETIC_ONLY=true \
npm run build:soundgarden:public
```

- **Build Script (`package.json`):** `"build:soundgarden:public": "vite build --config vite.soundgarden.config.ts"`
- **Artifact Output Directory:** `dist-soundgarden/`
  - `dist-soundgarden/index.html` (promoted from `sound-garden.html`, zero inline `<script>`, zero third-party `<link>`)
  - `dist-soundgarden/assets/index-*.js` (Living Sound Garden app chunk)
  - `dist-soundgarden/assets/three-vendor-*.js` (Three.js 0.187.0 chunk)
  - `dist-soundgarden/assets/ui-vendor-*.js` (React + Lucide chunk)
  - `dist-soundgarden/assets/index-*.css` (Tailwind CSS bundle)
- **Fail-Closed Verification Command:**
  ```bash
  npm run test:soundgarden:release
  ```

---

## 6. Required Hosting Configuration

Two clean static-HTTPS options are prepared (choose **Option 1** unless organizational policy prefers containerized Cloud Run):

- **Option 1 (Primary — Dedicated Firebase Hosting Site in Isolated GCP Project):**
  - Ready-to-use config template: `config/public-judging/firebase.soundgarden.json`
  - Serves `dist-soundgarden/` over global HTTPS CDN with automatic TLS certificates, exact WebXR & security headers, SPA rewrite `** -> /index.html`, and zero runtime servers or secrets.
- **Option 2 (Alternative — Dedicated Static Cloud Run Nginx Container in Isolated GCP Project):**
  - Serves only static `dist-soundgarden/` files via read-only `nginx:alpine` on port `8080` with `--allow-unauthenticated`, zero environment secrets, zero database bindings, and the exact header block in Section 7.
  - Note: Because no Express server or `PopulationHealthService` process-local state runs in the static nginx container, horizontal auto-scaling is inherently stateless and safe.

---

## 7. HTTPS & Browser Header Requirements (Exact Least-Privilege Policy)

Canonical policy defined in `src/config/soundGardenPublicValidation.ts` and mirrored verbatim in `config/public-judging/firebase.soundgarden.json`:

| Header | Required Value | Rationale |
|---|---|---|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | Forces HTTPS; WebXR (`navigator.xr`) requires a Secure Context. |
| `Permissions-Policy` | `xr-spatial-tracking=(self), camera=(self), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()` | Permits same-origin WebXR (`immersive-vr` + hand tracking) and optional user-initiated desktop Webcam Conduct; explicitly blocks unused microphone, geolocation, payment, and USB. *(If deploying strictly for headset-only judging without desktop Webcam Conduct, `camera=()` is also safe because VR never requests camera access.)* |
| `Content-Security-Policy` | `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self' blob:; connect-src 'none'; font-src 'self' data:; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests` | Zero inline scripts, zero `unsafe-eval`, zero framing (`frame-ancestors 'none'` so WebXR runs top-level), zero outbound XHR/fetch/WebSocket (`connect-src 'none'`), permits React inline style props (`style-src 'self' 'unsafe-inline'`) and SVG data favicon / blob JSON export. |
| `Cross-Origin-Opener-Policy` | `same-origin` | Isolates top-level browsing context cleanly without breaking WebXR. |
| `Cross-Origin-Embedder-Policy` | **Omitted intentionally** | `SharedArrayBuffer` / WASM threads are **not used**; omitting unnecessary COEP avoids avoidable browser compatibility friction on Quest Browser. |
| `Cross-Origin-Resource-Policy` | `same-origin` | Prevents unauthorized cross-origin resource embedding. |
| `X-Content-Type-Options` | `nosniff` | Enforces strict MIME types (`text/javascript` for ES modules, `text/css` for stylesheets). |
| `X-Frame-Options` | `DENY` | Legacy clickjacking defense paired with `frame-ancestors 'none'`. |
| `Referrer-Policy` | `no-referrer` | Sends zero referrer leakage on any navigation. |
| `Cache-Control` (`/index.html`) | `no-cache, must-revalidate` | Ensures judges always receive the latest entry HTML. |
| `Cache-Control` (`/assets/**`) | `public, max-age=31536000, immutable` | Long-term immutable caching for content-hashed Vite JS/CSS chunks. |

---

## 8. Public Accessibility Validation Commands (Post-Deployment)

> **Important:** The public release URL does **not** exist yet. Replace `<PUBLIC_PLAYABLE_RELEASE_URL>` (for example `https://<site>.web.app`) **only after** manual human-approved deployment.

### A. Unauthenticated `curl` Accessibility & Header Checks
```bash
PUBLIC_URL="<PUBLIC_PLAYABLE_RELEASE_URL>"

# 1. Confirm HTTP 200 (zero 302 redirect to /__cookie_check.html or accounts.google.com)
curl -sSI "${PUBLIC_URL}/"

# 2. Verify specific WebXR & security headers cleanly
curl -sSI "${PUBLIC_URL}/" | grep -iE '^(http/|location:|strict-transport-security:|permissions-policy:|content-security-policy:|cross-origin-opener-policy:|cross-origin-resource-policy:|x-content-type-options:|x-frame-options:|referrer-policy:|cache-control:)'

# 3. Verify HTML contains standalone Living Sound Garden title & zero inline scripts
curl -sS "${PUBLIC_URL}/" | grep -E '<title>|<script'

# 4. Fetch main JS module from index.html and confirm HTTP 200 + text/javascript MIME + zero dev IDs
JS_ASSET="$(curl -sS "${PUBLIC_URL}/" | grep -oE '/assets/[^"]+\.js' | head -n 1)"
curl -sSI "${PUBLIC_URL}${JS_ASSET}" | grep -iE '^(http/|content-type:|x-content-type-options:|cache-control:)'
curl -sS "${PUBLIC_URL}${JS_ASSET}" | grep -E 'ai-studio-drt-2e1619d9-9932-4538-9b6c-26b489ebfec2|gen-lang-client-0611153209|/api/population-health|firebase-applet-config' && echo "FAIL: LEAK DETECTED" || echo "PASS: BUNDLE CLEAN"
```

### B. Browser / Meta Quest Remote DevTools Console Checks
Open `<PUBLIC_PLAYABLE_RELEASE_URL>/#living-sound-garden` in Meta Quest Browser (or desktop Chromium for initial check) and run in DevTools Console:
```js
// 1. Verify Secure Context, canonical hash, WebGL2, AudioContext, and WebXR API availability
(async () => {
  const c = document.querySelector('canvas');
  const gl = c ? (c.getContext('webgl2') || c.getContext('webgl')) : null;
  const xrSupported = navigator.xr ? await navigator.xr.isSessionSupported('immersive-vr') : false;
  console.table({
    secureContext: window.isSecureContext,
    hash: window.location.hash,
    hasCanvas: Boolean(c),
    webglActive: Boolean(gl),
    hasAudioContext: Boolean(window.AudioContext || window.webkitAudioContext),
    hasNavigatorXR: Boolean(navigator.xr),
    immersiveVrSupported: xrSupported,
    localStorageKeys: Object.keys(localStorage),
  });
})();
```
Verify in the DevTools **Network** tab:
- Zero requests to `/api/*`, `firestore.googleapis.com`, `identitytoolkit.googleapis.com`, `accounts.google.com`, or `fonts.googleapis.com`.
- Zero console CSP violations.
- Camera indicator does **NOT** trigger on page load or when clicking **Enter VR**.

---

## 9. WebXR Release Smoke Checks (Automated vs. Physical Quest Separation)

| Check Layer | Scope | Current Status |
|---|---|---|
| **Automated Build & Logic Smoke Suite** (`npm run test:soundgarden:release` & `npx tsx scripts/test-living-sound-garden.ts`) | Fail-closed env matrix, real Vite static build, zero secret/dev/API/Firebase leak scan, HTTP 200 + strict MIME + WebXR header validation on loopback server, `probeWebXRSupport`, `XRSessionLifecycleManager` (`immersive-vr`, `local-floor`, `bounded-floor`, `hand-tracking`), hand-tracking unavailable & Touch controller fallback gating, Plant/Sculpt/Conduct/Conduct Bloom dwell & cooldown, mock `AudioContext` HRTF + `-2 dB` limiter + zero-leak `dispose()`, non-overwrite save & validated JSON export/import. | **VERIFIED LOCALLY** *(see Final Acceptance Report)* |
| **Physical Meta Quest / XR Simulator Verification** (`docs/PIANIST_LIVING_SOUND_GARDEN_QUEST_TEST_PLAN.md`, Steps 01–12) | Real Meta Quest Browser `Enter VR` permission flow, stereoscopic rendering comfort, 72–90 FPS stability, optical 25-joint hand tracking, pinch/grab/sculpt feel, two-hand Conduct Bloom height ergonomics, headset binaural HRTF localization, and guardian/tracking-loss recovery. | **NOT VERIFIED** *(requires physical Quest 2/3/3S or Meta XR Simulator after public deployment)* |

---

## 10. Privacy & Data-Handling Model

- **Zero Patient or Clinical Data:** No clinical tables, mock patients, or health records exist in `dist-soundgarden/`.
- **Zero Development Records or Private Credentials:** No Firebase SDK, no `firebase-applet-config.json`, no dev DB/project IDs, no server secrets.
- **Zero Public Write API:** No backend exists; no user can write to any cloud database or modify any Dr. T data.
- **Safe JSON Import:** `validateAndDeserializeGardenSnapshot()` parses user files strictly with `JSON.parse()` (never `eval`/`Function`), caps size at `256 KB` and `28` orbs, validates known species/scales and finite coordinates, and rejects `__proto__`, `constructor`, and `prototype` keys.
- **Strictly Local Compositions:** Saved gardens remain solely in browser `localStorage` (`drt_living_sound_garden_v1`) unless the user explicitly clicks **Export** to download a local `.json` file.
- **Strictly Local Optional Webcam Conduct:** Disabled by default; never requested to enter VR; never requests microphone audio; processed exclusively on an offscreen `48×36` browser canvas with zero network uploads (`connect-src 'none'`); displays a persistent always-visible `"Camera Active (Local Only)"` bar with Pause/Resume & Stop controls; stops all `MediaStreamTrack`s (`video.pause(); video.srcObject = null;`) immediately on exit, unmount, or VR entry.
- **Zero Hidden Analytics or Tracking:** No telemetry SDKs, cookies, beacons, or third-party scripts.

---

## 11. Rollback Plan

### Option 1 (Firebase Hosting)
```bash
# Instant rollback to previous verified static release in Firebase Hosting console or CLI:
firebase hosting:clone <PUBLIC_JUDGING_SITE_ID>:<PREVIOUS_VERSION_ID> <PUBLIC_JUDGING_SITE_ID>:live \
  --project "<DEDICATED_PUBLIC_JUDGING_GCP_PROJECT_ID>"

# Emergency takedown (disable public judging site immediately without touching Dr. T dev/pre/prod):
firebase hosting:disable --project "<DEDICATED_PUBLIC_JUDGING_GCP_PROJECT_ID>" --site "<PUBLIC_JUDGING_SITE_ID>"
```

### Option 2 (Dedicated Static Cloud Run Container)
```bash
# Shift 100% traffic back to prior known-good revision:
gcloud run services update-traffic "<PUBLIC_JUDGING_CLOUD_RUN_SERVICE>" \
  --project "<DEDICATED_PUBLIC_JUDGING_GCP_PROJECT_ID>" \
  --region "<PUBLIC_JUDGING_REGION>" \
  --to-revisions "<PRIOR_GOOD_REVISION>=100"

# Emergency takedown (remove public invoker binding without touching ais-dev-* or ais-pre-*):
gcloud run services remove-iam-policy-binding "<PUBLIC_JUDGING_CLOUD_RUN_SERVICE>" \
  --project "<DEDICATED_PUBLIC_JUDGING_GCP_PROJECT_ID>" \
  --region "<PUBLIC_JUDGING_REGION>" \
  --member="allUsers" \
  --role="roles/run.invoker"
```

---

## 12. Known Limitations

1. **Physical Meta Quest / XR Simulator QA Not Yet Performed:** Automated Node/TypeScript verification cannot substitute for real headset testing of optical hand tracking, 72–90 FPS thermal stability, or spatial HRTF ear localization.
2. **Public HTTPS Host Not Yet Provisioned or Deployed:** Requires human operator approval to provision an isolated GCP project and deploy `dist-soundgarden/`.
3. **Demo Video Not Yet Recorded:** Must be recorded on Meta Quest after deploying the public URL (see `docs/PIANIST_LIVING_SOUND_GARDEN_DEMO_STORYBOARD.md`).
4. **Standalone Release Omits Parent Dr. T Navigation:** Intentionally excludes Dr. T clinical/health tabs and the `Touch Grass` tab switcher button while retaining all 3 curated Touch Grass Seed presets (*Morning Robin & Dew*, *Rain on Oak Leaves*, *Twilight Brook Nocturne*) directly inside the experience.

---

## 13. Manual Deployment Runbook (Human-Approved Execution Only — NOT EXECUTED)

> **CRITICAL:** Do **NOT** reuse `gen-lang-client-0611153209`, `ais-dev-*`, `ais-pre-*`, `ais-sandbox@...`, or Firestore database `ai-studio-drt-2e1619d9-9932-4538-9b6c-26b489ebfec2`.

### Prerequisites (Provisioned Separately by Project Owner)
- **GCP Project:** Dedicated isolated project `<DEDICATED_PUBLIC_JUDGING_GCP_PROJECT_ID>` (separate from development & production projects).
- **Region:** `<DEDICATED_PUBLIC_JUDGING_REGION>` (e.g., `us-central1` or `asia-southeast1`, required only for Option 2 Cloud Run static container; Firebase Hosting is global CDN).
- **Isolated Service / Site Name:**
  - Option 1 (Recommended): Firebase Hosting site `<PUBLIC_JUDGING_SITE_ID>` (e.g., `pianist-living-sound-garden-2026`).
  - Option 2 (Alternative): Cloud Run service `<PUBLIC_JUDGING_CLOUD_RUN_SERVICE>` (e.g., `pianist-soundgarden-public`).
- **Isolated Data Store:** **NONE REQUIRED** (static WebXR architecture uses browser-local storage only).
- **Secret Manager Entries:** **NONE REQUIRED** for the static WebXR release. *(Only required if ever deploying the optional full Dr. T monolith: `POPULATION_GUEST_TOKEN_SECRET`, `DRT_JUDGING_RESET_TOKEN`, optional `GEMINI_API_KEY`.)*
- **Required Operator IAM Permissions (Described — NOT Applied Here):**
  - Option 1 (Firebase Hosting deploy): Human deployer or CI principal holds `roles/firebasehosting.admin` scoped strictly to `<DEDICATED_PUBLIC_JUDGING_GCP_PROJECT_ID>`. No runtime service account is needed.
  - Option 2 (Cloud Run Static Nginx deploy): Deployer holds `roles/run.admin`, `roles/artifactregistry.writer`, and `roles/iam.serviceAccountUser` on a dedicated zero-privilege runtime service account (`soundgarden-static-runner@<DEDICATED_PUBLIC_JUDGING_GCP_PROJECT_ID>.iam.gserviceaccount.com`) with **zero Firestore, zero Secret Manager, and zero cross-project IAM roles**; public ingress uses `roles/run.invoker` for `allUsers` scoped strictly to `<PUBLIC_JUDGING_CLOUD_RUN_SERVICE>`.

### Step 1 — Clean Local Build & Automated Verification
```bash
# Run full fail-closed public build & automated smoke audit locally
VITE_RUNTIME_ENV=public_judging \
DRT_RUNTIME_ENV=public_judging \
VITE_SYNTHETIC_ONLY=true \
DRT_SYNTHETIC_ONLY=true \
npm run build:soundgarden:public

npm run test:soundgarden:release
```

### Step 2A — Deploy Option 1 (Recommended: Isolated Firebase Hosting)
```bash
# Deploy ONLY the static dist-soundgarden/ bundle using the dedicated hosting config:
firebase deploy \
  --only hosting \
  --config config/public-judging/firebase.soundgarden.json \
  --project "<DEDICATED_PUBLIC_JUDGING_GCP_PROJECT_ID>"
```

### Step 2B — Deploy Option 2 (Alternative: Isolated Static Cloud Run Nginx Container)
If deploying via Cloud Run instead of Firebase Hosting, build a minimal static container from `dist-soundgarden/` with an nginx config emitting the exact Section 7 headers (`Permissions-Policy`, `Content-Security-Policy`, `Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Strict-Transport-Security`, SPA `try_files $uri /index.html;`) listening on port `8080`, then deploy to the isolated project:
```bash
gcloud run deploy "<PUBLIC_JUDGING_CLOUD_RUN_SERVICE>" \
  --project "<DEDICATED_PUBLIC_JUDGING_GCP_PROJECT_ID>" \
  --region "<DEDICATED_PUBLIC_JUDGING_REGION>" \
  --image "<PUBLIC_JUDGING_ARTIFACT_REGISTRY_IMAGE_URI>" \
  --service-account "soundgarden-static-runner@<DEDICATED_PUBLIC_JUDGING_GCP_PROJECT_ID>.iam.gserviceaccount.com" \
  --port 8080 \
  --cpu 1 \
  --memory 256Mi \
  --allow-unauthenticated
```

### Step 3 — Post-Deployment Validation (Unauthenticated + Physical Meta Quest)
1. Execute all `curl` header and bundle-cleanliness commands in **Section 8A** against the newly deployed `<PUBLIC_PLAYABLE_RELEASE_URL>`.
2. Confirm `HTTP/2 200 OK`, zero `__cookie_check.html` redirect, and exact `Permissions-Policy: xr-spatial-tracking=(self), camera=(self), microphone=(), ...`.
3. Open `<PUBLIC_PLAYABLE_RELEASE_URL>/#living-sound-garden` directly in **Meta Quest Browser** and complete **Steps 01–12** of `docs/PIANIST_LIVING_SOUND_GARDEN_QUEST_TEST_PLAN.md`.
4. Record the 2:50 stereo-audio competition showcase using `docs/PIANIST_LIVING_SOUND_GARDEN_DEMO_STORYBOARD.md`, then update the two URL placeholders in `docs/PIANIST_LIVING_SOUND_GARDEN_DEVPOST_FINAL.md`.
