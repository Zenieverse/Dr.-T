# PIANIST — The Living Sound Garden
## Meta Quest & WebXR Simulator Manual Test Plan

**Parent platform:** Dr. T (`https://github.com/Zenieverse/Dr.-T`)  
**Experience:** PIANIST — The Living Sound Garden (*Grow music with your hands.*)  
**Target runtime:** Meta Quest Browser (WebXR `immersive-vr` + `hand-tracking` + `local-floor`) & Meta Immersive Web Emulator / XR Simulator  
**Execution status:** `NOT VERIFIED ON PHYSICAL META QUEST OR XR SIMULATOR` (sandbox environment has no Quest headset or XR Simulator runtime attached)

---

## 1. Prerequisites & Test Environment Setup

### Hardware / Simulator Options
1. **Primary (Required for Competition Sign-Off):** Meta Quest 3, Meta Quest 3S, or Meta Quest 2 running current Meta Horizon OS with **Hand Tracking enabled** (`Settings -> Movement Tracking -> Hand Tracking`) and updated **Meta Quest Browser**.
2. **Secondary (Pre-Headset Desktop Validation):** Chromium / Chrome with **Meta Immersive Web Emulator (IWE)** or **Meta XR Simulator** configured for `immersive-vr` + articulated WebXR hand tracking.

### Network & Secure Context Requirements
- WebXR (`navigator.xr`) requires a **secure context** (`https://` or `http://localhost`).
- **IMPORTANT RELEASE BLOCKER NOTE:** As verified during this audit, the existing AI Studio URLs (`ais-dev-4s4jvpipr3mh3mz6x2hpfp-*.run.app` and `ais-pre-4s4jvpipr3mh3mz6x2hpfp-*.run.app`) redirect unauthenticated requests with `HTTP/2 302` to `/__cookie_check.html`. They **cannot** serve as the public unauthenticated Quest Browser URL for competition judges.
- Before running physical Quest tests, use one of:
  1. **Dedicated Public HTTPS Release Host** (recommended for both QA and Devpost judging): `https://<public-release-domain>/#living-sound-garden`
  2. **USB-C Local Development Bridge (QA only):** Connect Quest via USB with Developer Mode enabled, run `adb reverse tcp:3000 tcp:3000`, and open `http://localhost:3000/#living-sound-garden` inside Meta Quest Browser.

### Audio & Privacy Setup
- Wear Quest integrated spatial audio speakers or wired low-latency stereo headphones (avoid high-latency Bluetooth earbuds during HRTF verification).
- Ensure room lighting is even and unobstructed so Quest optical hand-tracking cameras track wrists and all five fingertips reliably.

---

## 2. Step-by-Step Meta Quest WebXR Verification Protocol

Record actual observations directly in the **Actual Result**, **Pass / Fail**, and **Evidence** columns during physical Quest / XR Simulator testing.

| Step | Test Case | Exact Operator Action | Expected Result | Actual Result | Pass / Fail | Evidence Required |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **01** | **Launch Direct Deep Link on Meta Quest Browser** | Open `<PUBLIC_HTTPS_URL>/#living-sound-garden` (or `http://localhost:3000/#living-sound-garden` via `adb reverse`) in Meta Quest Browser. | Page loads directly into *PIANIST — The Living Sound Garden* with no login wall, no blocking birthday/welcome modal, calm 3D sanctuary rendered at full viewport, and non-blocking `Enable Spatial Sound` cue if audio is suspended. | `NOT VERIFIED — pending physical Meta Quest / XR Simulator test` | `PENDING` | Screenshot of Quest Browser 2D launch screen + URL bar |
| **02** | **Verify WebXR Feature Detection** | Observe top-left metadata line and top-right `Enter VR` button without clicking yet. | `navigator.xr.isSessionSupported('immersive-vr')` resolves `true`; header displays `Meta Quest WebXR Ready`; `Enter VR` button is enabled and clearly legible. | `NOT VERIFIED — pending physical Meta Quest / XR Simulator test` | `PENDING` | Screenshot showing `Meta Quest WebXR Ready` metadata |
| **03** | **Enter `immersive-vr` Session Cleanly** | Click `Enter VR` (with finger pinch/gaze or controller). Attempt a rapid double-click to verify duplicate-request locking. | Button briefly shows `Starting VR…` (disabled against duplicate requests), browser prompts if needed, headset transitions smoothly into stereo 3D sanctuary grounded at floor level (`local-floor`), spatial Web Audio unlocks, and any active desktop webcam stops automatically. | `NOT VERIFIED — pending physical Meta Quest / XR Simulator test` | `PENDING` | First-person headset screenshot/clip entering the clearing |
| **04** | **Verify Left & Right Hand Skeletons / Visualizers** | Hold both hands in front of your chest inside the Quest camera field of view. Rotate palms and wiggle fingers. | Pearl joint markers (up to 25 joints per hand) appear smoothly on both left and right hands in stereo 3D with accurate world-space alignment (`renderer.xr.getHand(0/1)` attached to scene), no mirrored/offset drift, and no Touch controller rays visible. | `NOT VERIFIED — pending physical Meta Quest / XR Simulator test` | `PENDING` | First-person clip showing both articulated hands aligned in 3D space |
| **05** | **Pinch-to-Plant Spatial Orb Placement & Debounce** | Move right index fingertip over an empty part of the stone clearing (`1.3m–6.0m` radius) without pinching; then perform one deliberate thumb-index pinch (`< 2.4cm`), hold briefly with slight finger tremor, and release (`> 4.0cm`). | Before pinching, the species-colored wireframe bud & ground ring preview tracks your fingertip projection. Pinching plants **exactly one** sound orb with sprouting animation and immediate HRTF note audition. Slight finger jitter does NOT double-plant; rapid re-pinch within `450ms` is debounced. | `NOT VERIFIED — pending physical Meta Quest / XR Simulator test` | `PENDING` | 10-second clip showing preview ring -> single crisp plant -> no duplicate orb |
| **06** | **Grab-and-Sculpt Pitch & 16-Step Rhythm** | Move right hand within `48cm` of an existing orb, pinch to grab, raise and lower hand vertically (`0.50m–3.15m`), sweep laterally clockwise around the sanctuary ring, and release pinch. | Grabbing selects the orb without planting a new one. Vertical motion smoothly raises/lowers stem height and auditions each musical scale degree crossed. Lateral sweep moves the orb across the 16 radial beat stones and updates harmonic constellation arcs. Releasing commits the new pitch & step cleanly. | `NOT VERIFIED — pending physical Meta Quest / XR Simulator test` | `PENDING` | 15-second clip showing live pitch raise + radial beat relocation + clean release |
| **07** | **Open-Palm Conducting Dynamics** | Open both hands (unpinched, fingers extended `>= 11cm` from wrist) at comfortable chest height (`~1.0m`), slowly lift upward toward `1.35m` and spread arms wider, then lower gently back down. | Audio dynamics, low-pass filter brightness, and woodland reverb mix swell smoothly and continuously with zero zipper noise, clicks, or abrupt volume jumps. | `NOT VERIFIED — pending physical Meta Quest / XR Simulator test` | `PENDING` | Headset audio+video capture demonstrating smooth dynamic swell |
| **08** | **Deliberate Two-Hand Conduct Bloom Trigger** | Raise **both open palms** above `1.38m` and spread `>= 34cm` apart. Hold steadily for `> 0.42s` (`420ms` dwell). Test false positives first: (a) one hand raised alone, (b) both hands pinched/fisted high, (c) brief `< 250ms` flick. | False-positive motions do NOT trigger bloom. Holding both open palms high charges dwell smoothly (`0% -> 100%`) and fires the **Signature Conduct Bloom** exactly once (one-shot trigger): sweeping harmonic chord swell plays, sky warms, golden light rises, every flower opens fully, pollen spirals skyward. Lowering hands releases bloom and enforces `1400ms` re-arm cooldown. | `NOT VERIFIED — pending physical Meta Quest / XR Simulator test` | `PENDING` | 20-second clip capturing both false-positive rejection and the full Conduct Bloom climax |
| **09** | **360° Spatial Audio (HRTF) Directionality & Anti-Clipping** | Plant a bright Bellflower at North (`-Z`), a Moss Reed Bass at East (`+X`), and a Windchime Fern at West (`-X`). Turn head slowly 360° and tilt head left/right while conducting a full 12–20 orb bloom. | Sound sources remain locked to their 3D botanical positions as your head rotates and tilts (world-quaternion `up` vector). Full-garden bloom sounds lush and expansive with zero digital distortion or harsh clipping (dual-stage compressor + `-2dB` brickwall safety limiter). | `NOT VERIFIED — pending physical Meta Quest / XR Simulator test` | `PENDING` | Binaural/headset audio recording + listener localization confirmation notes |
| **10** | **Hand-Tracking Loss & Graceful Recovery** | While grabbing an orb with your right hand, drop both hands behind your back (outside Quest tracking FOV) for `> 1 second`. Then bring hands back into view. | After the `180ms` grace window, the grabbed orb releases cleanly in place (does NOT fly to origin or remain stuck), audio lift eases gently instead of cutting harshly, and bringing hands back into view immediately restores smooth joint tracking and interaction. | `NOT VERIFIED — pending physical Meta Quest / XR Simulator test` | `PENDING` | Clip showing grab -> hide hands -> clean orb release -> smooth re-acquisition |
| **11** | **Touch Controller Fallback & Non-Conflict Check** | While in VR, place hands down and pick up Quest Touch controllers. Point ray at an orb and pull trigger to sculpt, then point at empty ground and pull trigger to plant. Put controllers down and resume native hand tracking. | Golden ray pointer appears ONLY when non-hand Touch controllers connect; trigger selects/sculpts/plants reliably. When native hand tracking reconnects, controller rays vanish and hand pinches NEVER double-trigger controller `selectstart`. | `NOT VERIFIED — pending physical Meta Quest / XR Simulator test` | `PENDING` | Clip showing controller ray fallback and clean return to hand-only mode |
| **12** | **Clean Exit VR & Repeated Session Stability** | Press Meta menu -> Exit WebXR (or click `Exit VR`). Wait 5 seconds in flat view, confirm controls work, then click `Enter VR` a second time and exit again. | Returning to flat view immediately restores OrbitControls, hides XR hand markers and rays, preserves all planted/sculpted orbs, and keeps audio clean without duplicate notes or stalled rendering. Second VR entry succeeds identically with zero console errors or memory runaway. | `NOT VERIFIED — pending physical Meta Quest / XR Simulator test` | `PENDING` | Screenshot of restored flat view + DevTools console check (0 errors) |

---

## 3. Meta Quest Performance, Thermal & Comfort Measurement Protocol

Use **Meta OVR Metrics Tool** (on-device overlay) or **Meta Quest Developer Hub (MQDH)** connected over USB/Wi-Fi during a 10-minute session:

| Metric | Target Threshold | How to Measure | Measured Value | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Frame Rate (Idle Garden — 10 Orbs)** | Steady 72–90 FPS (matching Quest refresh rate) | OVR Metrics Tool `FPS` counter over 60 seconds | `NOT MEASURED` | `PENDING` |
| **Frame Rate (Dense Garden — 20–28 Orbs + Full Conduct Bloom)** | `>= 72 FPS` without sustained reprojection / ASW stutter | Plant 24 orbs, trigger Conduct Bloom, record minimum & average FPS for 60s | `NOT MEASURED` | `PENDING` |
| **App GPU Frame Time** | `< 11.1 ms` (at 90 Hz) / `< 13.8 ms` (at 72 Hz) | MQDH Performance Analyzer GPU time | `NOT MEASURED` | `PENDING` |
| **Dropped / Stale Frames on Orb Plant** | `<= 1` transient frame on sprout | Plant 10 orbs sequentially while watching OVR stale frame counter | `NOT MEASURED` | `PENDING` |
| **Audio Glitch / XRun Check** | Zero audible crackles or clipping during 28-orb bloom | Listen through wired headphones while holding Conduct Bloom for 20s | `NOT MEASURED` | `PENDING` |
| **Comfort & Motion Sickness Check** | Stationary clearing (`local-floor`), zero forced camera locomotion, calm reduced-motion mode verified | 10-minute standing/seated session with 360° real head turns | `NOT MEASURED` | `PENDING` |
| **Repeated VR Enter/Exit Memory Stability** | Stable JS heap & WebGL resource count across 3 consecutive VR sessions | Remote Chrome DevTools (`chrome://inspect`) Memory Heap Snapshot before Session 1 vs after Session 3 | `NOT MEASURED` | `PENDING` |

---

## 4. Sign-Off Gate Criteria Before Devpost Submission

The experience MUST NOT be marked `QUEST VERIFIED` until:
1. Steps **01 through 12** above all achieve `PASS` on a physical Meta Quest headset (or clearly disclosed Quest + XR Simulator evidence).
2. The public HTTPS URL opens cleanly in Meta Quest Browser **without** Google login or cookie-check redirects.
3. No critical console errors, stuck grabs, double-plant pinches, audio clipping, or severe frame drops occur during the 10-minute test.
