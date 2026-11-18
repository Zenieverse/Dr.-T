# PIANIST — The Living Sound Garden
## Final XR Readiness, Hand-Tracking, Release & Demo Audit

**Parent Platform:** Dr. T (`https://github.com/Zenieverse/Dr.-T`)  
**Prior Experience:** Dr. T — PIANIST: Touch Grass  
**Audited Experience:** PIANIST — The Living Sound Garden (*Grow music with your hands.*)  
**Competition:** Meta VR Start Developer Competition 2026  
**Track / Division:** Entertainment · Adapted / Significantly Updated Experience  
**Primary Target Runtime:** Meta Quest Browser (W3C WebXR `immersive-vr` + `hand-tracking` + `local-floor`)  
**Audit Standard:** Evidence-based code, automated logic, build, security, and release-readiness audit. Zero fabricated headset, simulator, FPS, or deployment claims.

---

## 1. Executive Verdict

| Gate | Verdict | Summary |
| --- | --- | --- |
| **Core 3D & Musical Architecture** | **VERIFIED IN CODE & AUTOMATED TESTS** | Procedural Three.js `0.187.0` botanical sanctuary, 5 species voices, 5 scales, 16-step radial ring, 3 Touch Grass seed presets, and harmonic arcs verified cleanly. |
| **WebXR & Hand-Tracking Logic** | **REPAIRED & AUTOMATED LOGIC TESTED (`NOT QUEST VERIFIED`)** | 7 critical XR/audio/lifecycle defects identified in pre-audit code and fixed directly in source (`xrHandController.ts`, `LivingSoundGardenEngine.ts`, `spatialAudioEngine.ts`, `gardenMeshes.ts`, `musicTheory.ts`, `LivingSoundGardenModule.tsx`). Verified via 19/19 deterministic automated tests. Physical Meta Quest / XR Simulator verification remains `NOT VERIFIED`. |
| **Competition Build Path** | **BROWSER-NATIVE WEBXR (`NOT META IWSDK`)** | Uses `three@0.187.0` + browser-native `navigator.xr` + Web Audio HRTF. `@iwsdk/*` is **not** installed or used. Devpost submission must transparently select WebXR/browser build path. |
| **Public Playable Release URL** | **BLOCKED / NOT DEPLOYED** | Both existing AI Studio URLs (`ais-dev-*` and `ais-pre-*`) return `HTTP/2 302` -> `/__cookie_check.html` (Google auth wall) and restrict embedding (`frame-ancestors 'self' https://*.google.com`). A dedicated unauthenticated public HTTPS endpoint is required before submission. |
| **Demo Video** | **NOT RECORDED** | Storyboard & recording checklist prepared (`docs/PIANIST_LIVING_SOUND_GARDEN_DEMO_STORYBOARD.md`), but no 2–3 minute on-device capture has been recorded yet. |
| **Overall Submission Readiness** | **NOT READY TO SUBMIT (3 EXTERNAL BLOCKERS)** | Code, tests, and documentation are competition-ready; submission is blocked solely by (1) public HTTPS deployment, (2) physical Meta Quest / XR Simulator sign-off, and (3) demo video capture. |

---

## 2. Complete Audited Source File Inventory

### Core Living Sound Garden Module (`src/components/pianist/soundgarden/`)
| File | Role | Audit Action |
| --- | --- | --- |
| `src/components/pianist/soundgarden/types.ts` | Core musical, orb, preset, and engine snapshot types | **MODIFIED** — Added `AudioEngineState`, `XRSessionState`, `XRTrackingStatus`, and extended `GardenEngineSnapshot` (`bloomDwellProgress`, `audioState`, `xrSessionState`, `xrControllerCount`, `xrTrackingStatus`, `webcamPaused`, `reducedMotion`). |
| `src/components/pianist/soundgarden/xrHandController.ts` | Deterministic WebXR session manager & calibrated hand-tracking interaction controller | **CREATED** — Decouples `probeWebXRSupport`, `XRSessionLifecycleManager`, and `XRHandInteractionController` from browser globals so runtime and automated tests execute identical gesture/session logic. |
| `src/components/pianist/soundgarden/musicTheory.ts` | 5 botanical species, 5 scales, 16-step radial math, conducting metrics, 3 Touch Grass presets, JSON persistence | **MODIFIED** — Added `validateAndDeserializeGardenSnapshot()` (256 KB guard, `MAX_SAVED_ORBS = 28`, prototype-pollution key rejection, strict finite coordinate & known species validation) and hardened `saveGardenSnapshot()` via `mergeSavedGardenSnapshot()` so saves never silently overwrite prior gardens. |
| `src/components/pianist/soundgarden/spatialAudioEngine.ts` | Pure Web Audio 3D HRTF procedural synthesizer & convolution woodland reverb | **MODIFIED** — Added dual-stage dynamics (bus compressor `-16 dB / 3.5:1` + brickwall safety limiter `-2 dB / 18:1 / 1 ms`), soft polyphony headroom scaling, injectable `audioContextFactory` for automated testing, tracked `PannerNode` set & cleanup timers with leak-free `dispose()`, and `getState()`. |
| `src/components/pianist/soundgarden/gardenMeshes.ts` | Procedural outdoor sanctuary terrain, brook, 18 trees, instanced grass/pollen/step markers, 11-part orb sculptures, hand rigs, seed preview | **MODIFIED** — Added dirty-checked GPU upload caching on `stepMarkers.instanceColor` and `reducedMotion` scaling across plant & environment animations. |
| `src/components/pianist/soundgarden/LivingSoundGardenEngine.ts` | Three.js + WebXR engine, desktop pointer/sculpting, local webcam motion conducting, audio listener sync | **MODIFIED** — Wired `XRSessionLifecycleManager` & `XRHandInteractionController`; attached `renderer.xr.getHand(0/1)` to `this.scene`; added gated non-hand Touch controller rays + trigger sculpt fallback; fixed WebXR HRTF listener `up` vector with `activeCam.getWorldQuaternion(_xrQuat)`; cached `orbHitTargets`; throttled `rebuildHarmonicArcs()` during drags; paused/restarted loop on `webglcontextlost`/`webglcontextrestored`; released software-GL probe context; pre-warmed shaders on hardware GPUs; added `prefers-reduced-motion`, `webcamPaused`, `stopWebcamNow()`, and `unlockAudio()`. |
| `src/components/pianist/soundgarden/LivingSoundGardenModule.tsx` | Minimal spatial-first React HUD & controls | **MODIFIED** — Added `Enable Spatial Sound` audio-unlock cue, persistent always-visible `"Camera Active (Local Only)"` / `"Camera Paused (Local Only)"` pause/stop bar (visible even when dock is collapsed), honest XR/tracking/bloom-dwell metadata, disabled `Starting VR…` lock state, validated JSON **Import** file picker, `Escape` notice dismissal, and keyboard `focus-visible` outlines. |

### Parent Dr. T / PIANIST / Touch Grass Integration Points (Inspected, Preserved Unchanged)
- `src/App.tsx` (lines 81, 95, 108, 130, 167–168, 457, 478–486): Deep links `?tab=living-sound-garden` and `#living-sound-garden` / `#sound-garden` / `#soundgarden` / `#livingsoundgarden` open directly into `LivingSoundGardenModule` and bypass `isBirthdayModalOpen` (`getInitialTab() === 'drt'`).
- `src/types.ts` (line 9): `'living-sound-garden'` member in `NavTab`.
- `src/components/layout/Navbar.tsx` (line 100): Dedicated `Living Sound Garden` navigation item (`Quest VR` badge) alongside `Pianist` and `Touch Grass`.
- `src/types/pianistTypes.ts` (line 87): `'living-sound-garden'` member in `PianistSubTab`.
- `src/components/pianist/PianistApp.tsx` (lines 419–434): Embedded `LivingSoundGardenModule` sub-tab wired bidirectionally with `TouchGrassStudio` (`onOpenTouchGrass` / `onOpenSoundGarden`).
- `src/components/pianist/touchgrass/TouchGrassStudio.tsx` (lines 56, 76–100): Preserves prior *Touch Grass* scenarios (*Morning Robin*, *Raindrops on Leaves*, *Flowing Brook*) that inspired the 3 *Living Sound Garden* seed presets (*Morning Robin & Dew*, *Rain on Oak Leaves*, *Twilight Brook Nocturne*).
- `scripts/test-living-sound-garden.ts`: **MODIFIED** — Expanded from 9 to **19** automated tests.
- `server.impl.ts`, `vite.config.ts`, `package.json`, `index.html`, `metadata.json`: Inspected read-only (untouched).

---

## 3. Competition Claims vs. Verified Code Matrix

| Competition Claim | Verified Code Reality | Status |
| --- | --- | --- |
| Procedural 3D botanical sanctuary | 140m × 140m heightfield meadow, radial limestone sequencer disc, circular garden brook, 18 composite cypress/willow trees, 14 mossy boulders, instanced swaying grass (`460` GPU / `220` SoftwareGL), luminous pollen/firefly motes (`220` GPU / `110` SoftwareGL), 3 sky moods | **VERIFIED** |
| Five botanical sound-orb species | `bellflower` (Dewdrop Bellflower), `lotus` (Sunburst Lotus), `reed` (Moss Lantern Reed), `fern` (Windchime Fern), `lily` (Raindrop Lily) — each with distinct procedural geometry & Web Audio voice | **VERIFIED** |
| Spatial Web Audio & HRTF positioning | Per-voice `PannerNode` (`panningModel = 'HRTF'`, inverse distance rolloff), procedural 2.7s stereo woodland convolution reverb, world-quaternion headset listener sync, dual-stage compressor + `-2 dB` brickwall safety limiter | **AUTOMATED LOGIC TESTED** (`NOT QUEST VERIFIED`) |
| Meta Quest immersive WebXR | `navigator.xr.isSessionSupported('immersive-vr')` & `requestSession('immersive-vr', { optionalFeatures: ['local-floor', 'bounded-floor', 'hand-tracking'] })` managed by `XRSessionLifecycleManager` | **IMPLEMENTED & AUTOMATED LOGIC TESTED** (`NOT QUEST VERIFIED`) |
| Native WebXR hand-tracking interactions | `renderer.xr.getHand(0/1)` parented to `this.scene`, 25-joint pearl visualizers, pinch hysteresis (`2.4cm`/`4.0cm`), `450ms` plant debounce, grab (`48cm`) + 3D pitch/step sculpt, `180ms` tracking-loss release, controller fallback gating | **IMPLEMENTED & AUTOMATED LOGIC TESTED** (`NOT QUEST VERIFIED`) |
| Plant, Sculpt, and Conduct modes | All 3 modes operational in desktop pointer view and mapped cleanly to natural pinch/grab/open-palm hand gestures in WebXR | **VERIFIED ON DESKTOP LOGIC / AUTOMATED XR TESTS** |
| Signature Conduct Bloom | Deliberate two-hand open-palm pose (`>= 1.38m`, spread `>= 0.34m`, `420ms` dwell, one-shot fire, `1400ms` cooldown) + desktop `Conduct Bloom` button / `Space` key driving chord swell, canopy light surge, full petal opening, and pollen spiral | **AUTOMATED LOGIC TESTED** (`NOT QUEST VERIFIED`) |
| Touch Grass integration | Bidirectional navigation between `LivingSoundGardenModule` and `TouchGrassStudio`, plus 3 curated presets derived directly from Touch Grass outdoor scenarios | **VERIFIED** |
| Local save/load & JSON export/import | Non-destructive local storage save (`mergeSavedGardenSnapshot`), JSON download export, and strict schema-validated JSON import (`validateAndDeserializeGardenSnapshot`) blocking prototype pollution & invalid payloads | **VERIFIED** |

---

## 4. Critical WebXR, Audio & Stability Defects Found and Repaired

During direct inspection of the pre-audit code, **seven concrete runtime defects** were discovered and fixed before final sign-off:

1. **Missing WebXR Hand Parenting (`LivingSoundGardenEngine.ts`):**
   - *Before:* `renderer.xr.getHand(h)` was queried inside `updateWebXRHands()` without ever calling `this.scene.add(xrHand)`, meaning Three.js would not keep XR hand joint world matrices updated in the scene graph during an active Quest session.
   - *Fix:* Explicitly attached both `renderer.xr.getHand(0)` and `renderer.xr.getHand(1)` to `this.scene` during `setupWebXR()` and read world joint poses cleanly.
2. **Touch Controller vs. Native Hand Tracking Collision (`LivingSoundGardenEngine.ts`, `xrHandController.ts`):**
   - *Before:* Controller `selectstart` listeners ran unconditionally even when native optical hand tracking was active, risking double-plants or conflicting grabs.
   - *Fix:* Added `xrHandController.shouldAllowControllerFallback(handIdx, nowMs)` (suppressing controller fallback whenever hands are tracked or within `850ms` of tracking) and ignored `event.data?.hand` sources on controller `'connected'` events so controller rays never appear on bare hands.
3. **Unstable Pinch / Missing Debounce / Accidental Bloom Triggers (`xrHandController.ts`):**
   - *Before:* Single threshold `pinchDist < 0.028` caused finger-jitter double-plants; Conduct Bloom fired instantaneously on a single frame whenever `meanY > 1.48` with no open-palm check, no arm spread check, no dwell timer, and no re-arm cooldown; lost hand tracking could leave an orb permanently grabbed.
   - *Fix:* Implemented calibrated dual-threshold pinch hysteresis (`0.024m` engage / `0.040m` release), `450ms` plant debounce cooldown, `180ms` tracking-loss grace release, open-palm extension verification (`>= 0.11m`), and deliberate two-hand Conduct Bloom (`>= 1.38m` height, `>= 0.34m` spread, `420ms` dwell, one-shot edge trigger, `1400ms` cooldown).
4. **WebXR HRTF Listener `up` Vector Local-Space Bug (`LivingSoundGardenEngine.ts`):**
   - *Before:* `_vUp.set(0, 1, 0).applyQuaternion(activeCam.quaternion)` used local quaternion rather than world quaternion, which can skew spatial HRTF audio orientation inside WebXR camera rigs.
   - *Fix:* Changed to `activeCam.getWorldQuaternion(_xrQuat); _vUp.set(0, 1, 0).applyQuaternion(_xrQuat);`.
5. **Headset Audio Headroom & Resource Cleanup (`spatialAudioEngine.ts`):**
   - *Before:* Single bus compressor (`-14 dB`) with no brickwall peak ceiling during dense 28-orb blooms, and untracked `window.setTimeout` panner cleanups that survived `dispose()`.
   - *Fix:* Added dual-stage dynamics (compressor `-16 dB / 3.5:1` + brickwall safety limiter `-2 dB / 18:1 / 1 ms`), soft polyphony headroom scaling, and complete active `PannerNode` & timer tracking disconnected/cleared inside `dispose()`.
6. **GPU / Allocation Hygiene & Context Loss Recovery (`LivingSoundGardenEngine.ts`, `gardenMeshes.ts`):**
   - *Before:* `stepMarkers.instanceColor.needsUpdate = true` uploaded every frame even between beats; `Array.from(this.plantHandles.values()).map(...)` allocated fresh arrays on every `pointermove`; `rebuildHarmonicArcs()` rebuilt geometry unthrottled on every drag event; temporary software-GL probe context wasn't released; `webglcontextlost` did not stop the render loop.
   - *Fix:* Dirty-checked `stepMarkers` color uploads, cached `orbHitTargets` in `setOrbs()`, throttled harmonic arc rebuilds during drags (`65ms`), released probe context via `WEBGL_lose_context`, paused/resumed render loop cleanly on `webglcontextlost`/`webglcontextrestored`, and wired `prefers-reduced-motion`.
7. **Persistence & Camera Privacy Hardening (`musicTheory.ts`, `LivingSoundGardenModule.tsx`):**
   - *Before:* Saving could overwrite matching IDs; no UI existed to import JSON snapshots; no prototype-pollution check existed on JSON parse; desktop webcam indicator disappeared if controls were collapsed.
   - *Fix:* Added `mergeSavedGardenSnapshot()` non-overwrite logic, `validateAndDeserializeGardenSnapshot()` with `__proto__`/`constructor`/`prototype` & `MAX_SAVED_ORBS` checks, validated **Import** file button, `Enable Spatial Sound` audio-unlock cue, and a persistent always-visible `"Camera Active (Local Only)"` bar with Pause/Resume & Stop controls.

---

## 5. Build Path Classification (Honest Technical Disclosure)

Verified directly from `package.json`:
- **Installed 3D / UI / Build Packages:** `three@^0.187.0`, `react@^18.3.1`, `react-dom@^18.3.1`, `lucide-react@^0.475.0`, `tailwindcss@^4.0.0`, `typescript@^5.7.3`, `vite@^6.1.0`.
- **WebXR Implementation:** Standard browser-native W3C WebXR Device API (`navigator.xr`) + Three.js `WebXRManager` (`renderer.xr.enabled = true`).
- **Meta IWSDK (`@iwsdk/*`):** **NOT USED and NOT INSTALLED.**
- **Guidance for Competition Submission:** Select the **WebXR / Browser** build path on Devpost. Do **not** claim Meta IWSDK, Unity, Unreal, Godot, or Native Android.

---

## 6. Public Release & Deployment Readiness Audit (Read-Only Probe)

No infrastructure was deployed or modified during this audit. Read-only HTTP probes confirmed:

| Endpoint | Observed HTTP Response | Verdict for Meta Quest Judging |
| --- | --- | --- |
| `http://127.0.0.1:3000/` (local dev server) | `HTTP/1.1 200 OK` (`Content-Type: text/html`, no blocking `CSP` or `Permissions-Policy`) | Local QA only (usable on Quest only via USB-C `adb reverse tcp:3000 tcp:3000`). |
| `https://ais-dev-4s4jvpipr3mh3mz6x2hpfp-393352619239.asia-southeast1.run.app/` | `HTTP/2 302` -> `location: /__cookie_check.html?return_url=...` with `content-security-policy: frame-ancestors 'self' https://*.google.com ...` | **BLOCKED** — Auth-gated AI Studio development preview cannot be opened by unauthenticated Quest Browser judges. |
| `https://ais-pre-4s4jvpipr3mh3mz6x2hpfp-393352619239.asia-southeast1.run.app/` | `HTTP/2 302` -> `location: /__cookie_check.html?return_url=...` with `content-security-policy: frame-ancestors 'self' https://*.google.com ...` | **BLOCKED** — Auth-gated AI Studio shared preview cannot be opened by unauthenticated Quest Browser judges. |
| AI Studio iFrame Container (`metadata.json`) | `requestFramePermissions: ["camera", "microphone"]` (no `xr-spatial-tracking`) | **BLOCKED INSIDE IFRAME** — WebXR requires a top-level HTTPS browsing context outside AI Studio's preview iframe. |

### Recommended Non-Destructive Public Release Plan (Do Not Modify Dev/Pre Services)
1. **Create a dedicated public static or Cloud Run HTTPS judging host** (separate from `ais-dev-*`, `ais-pre-*`, and development Firestore `ai-studio-drt-2e1619d9-9932-4538-9b6c-26b489ebfec2`).
2. **Build cleanly under `public_judging` isolation** (`VITE_RUNTIME_ENV=public_judging` with dedicated non-dev `VITE_FIREBASE_*` values per `src/config/clientFirebaseValidation.ts` so `__DRT_DEV_FIREBASE_CONFIG__` compiles to `null` and zero development clinical/Firestore credentials ship in the client bundle).
3. **Configure HTTPS response headers cleanly:** Do **not** emit a restrictive `Permissions-Policy: xr-spatial-tracking=()` header; allow `xr-spatial-tracking=(self)` and `camera=(self)` so Meta Quest Browser exposes `navigator.xr` cleanly on top-level navigation.
4. **Publish the direct deep link** `https://<public-judging-domain>/#living-sound-garden` as the Devpost Playable Release URL and verify `HTTP/2 200 OK` from an unauthenticated device before submission.

---

## 7. Automated Verification & Build Results

All verification commands below were executed sequentially against the codebase (with zero changes to `server.impl.ts`, `vite.config.ts`, `metadata.json`, or unrelated Dr. T modules):

| Command | Result | Exit Code | Notes |
| --- | --- | --- | --- |
| `npx tsc --noEmit` | **PASS (0 errors)** | `0` | Clean full-repository TypeScript check across Dr. T & Living Sound Garden (post-final-edits). |
| `npx tsx scripts/test-living-sound-garden.ts` | **PASS (19/19)** | `0` | Music theory, WebXR probe/session lifecycle, hand pinch/grab/sculpt/tracking-loss/two-hand Conduct Bloom/controller gating, mock-`AudioContext` HRTF + `-2 dB` limiter + zero-leak `dispose()`, non-overwrite save & prototype-pollution JSON validation, and Dr. T integration contracts (post-final-edits). |
| `npx tsx scripts/test-production-isolation.ts` | **PASS (14/14)** | `0` | Zero regressions in Dr. T production data isolation & fail-closed startup guards (post-final-edits). |
| `npm run test:population-health` | **PASS (62/62)** | `0` | Zero regressions in Dr. T Population Health module (post-final-edits). |
| `npx tsx scripts/test-phase2-remediation.ts` | **PASS (10/10)** | `0` | Verified during this audit against untouched Phase 2 client/server env isolation & Vite build matrix. |
| `npm run build:dev` | **PASS (`dist/`, `build/`, `.next/` synced)** | `0` | Vite `v6.4.3` transformed `1966` modules (`25.51s`, `dist/index.html` `5.30 kB`, `dist/assets/index-*.js` `8,995.74 kB` / gzip `1,724.07 kB`), esbuild bundled `dist/server.cjs` (`7.6mb`, `1311ms`), and `scripts/prepare-build-artifacts.cjs` populated all targets cleanly. *(Note: plain `npm run build` without `VITE_RUNTIME_ENV` intentionally fails closed by Phase 2 production-isolation design in `vite.config.ts` and was preserved untouched.)* |

---

## 8. Sandbox Limitations & Mandatory Pre-Submission Actions

1. **No Physical Meta Quest Hardware or Meta XR Simulator in Sandbox:** Frame rates (72–90 FPS), optical hand-tracking comfort, stereoscopic depth, spatial binaural ear localization, and Quest Browser permission prompts **could not be executed here** and remain `NOT VERIFIED`. Execute `docs/PIANIST_LIVING_SOUND_GARDEN_QUEST_TEST_PLAN.md` (Steps 01–12) on hardware before submission.
2. **No Public Unauthenticated HTTPS Release Deployed Yet:** Deploy outside Google AI Studio's `/__cookie_check.html` auth gate before pasting the Playable URL into Devpost.
3. **No Recorded Demo Video Yet:** Record the 2:50 showcase on Meta Quest with clean stereo binaural audio using `docs/PIANIST_LIVING_SOUND_GARDEN_DEMO_STORYBOARD.md`.
