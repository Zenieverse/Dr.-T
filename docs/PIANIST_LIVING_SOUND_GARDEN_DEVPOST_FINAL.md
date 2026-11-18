# PIANIST — The Living Sound Garden
## Final Devpost Submission Draft — Meta VR Start Developer Competition 2026

> **COMPETITION SUBMISSION STATUS: NOT READY TO SUBMIT — BLOCKED**
>
> This draft is factually aligned with the verified repository implementation. Do **not** submit to Devpost until all three release blockers are cleared:
> 1. **Public HTTPS Release URL** is deployed outside Google AI Studio's authentication gate (`/__cookie_check.html`) and verified reachable from an unauthenticated Meta Quest Browser.
> 2. **Physical Meta Quest / Official Meta XR Simulator Verification** is executed against `docs/PIANIST_LIVING_SOUND_GARDEN_QUEST_TEST_PLAN.md` (all 12 manual steps currently `NOT VERIFIED`).
> 3. **2–3 Minute Demo Video** is recorded on-device with clear spatial audio following `docs/PIANIST_LIVING_SOUND_GARDEN_DEMO_STORYBOARD.md` (currently `NOT RECORDED`).

---

## 1. Submission Metadata

| Devpost Field | Verified Value |
| --- | --- |
| **Project Name** | **PIANIST — The Living Sound Garden** |
| **Tagline** | **Grow music with your hands.** |
| **Track** | **Entertainment** |
| **Division** | **Adapted / Significantly Updated Experience** |
| **Parent Platform / Prior Work** | **Dr. T — PIANIST: Touch Grass** (`https://github.com/Zenieverse/Dr.-T`) |
| **Primary Target Device** | **Meta Quest Browser (WebXR `immersive-vr` with Hand Tracking)** |
| **Build Path Classification** | **Browser-Native WebXR (`Three.js 0.187.0` + W3C WebXR Device API + Web Audio HRTF)** |
| **Meta IWSDK Usage** | **None (`@iwsdk/*` is NOT installed or used; do not select an IWSDK-only track/tag)** |
| **Source Repository** | `https://github.com/Zenieverse/Dr.-T` |
| **Public Playable Release URL** | `[PUBLIC_PLAYABLE_RELEASE_URL_REQUIRED_BEFORE_SUBMISSION — NOT YET DEPLOYED]` |
| **Demo Video URL (2–3 min)** | `[DEMO_VIDEO_URL_NOT_YET_RECORDED]` |

---

## 2. Short Description (Elevator Pitch)

**PIANIST — The Living Sound Garden** transforms music creation into a spatial, hands-first experience for Meta Quest. Users plant glowing botanical sound orbs, sculpt melodies and harmonic timing through natural hand gestures, and conduct living compositions in an immersive twilight garden. Instead of playing a conventional instrument, users grow their own musical world.

---

## 3. Recommended Competition Build Path

Submit under the **WebXR / Browser-Based Meta Quest** build path (Entertainment Track · Adapted / Significantly Updated Experience).

- **Verified Stack:** Built directly on `three` (`0.187.0`), W3C WebXR (`navigator.xr` requesting `immersive-vr` with `optionalFeatures: ['hand-tracking', 'local-floor']`), and the browser-native Web Audio API (`PannerNode` with `panningModel = 'HRTF'`).
- **Why not IWSDK:** The codebase does not use `@iwsdk/*` packages. It is a zero-install WebXR web application designed to launch directly in Meta Quest Browser via HTTPS URL (while keeping a companion desktop preview mode for non-headset review).

---

## 4. Inspiration

Music software usually traps creativity behind piano rolls, tiny sliders, and nested menus—and even in VR, many instruments replicate flat 2D keyboards floating in space. Our earlier module, **Dr. T — PIANIST: Touch Grass**, explored calm, nature-grounded mindfulness and piano interaction on the web. For the Meta VR Start Developer Competition 2026, we asked: *what if you did not play a keyboard at all—what if your hands planted, shaped, and conducted a living botanical ecosystem where every plant is a voice in 3D space?*

---

## 5. What It Does

**PIANIST — The Living Sound Garden** turns a 3D twilight botanical clearing into a spatial 16-step generative musical sanctuary:

1. **Five Botanical Sound-Orb Species** — Each species combines distinct procedural botanical geometry, glowing visual bloom reactivity, and a dedicated Web Audio synthesizer voice positioned via 3D HRTF audio:
   - **Dewdrop Bellflower (`bellflower`)** — Crystalline acoustic piano & celesta harmonic bells for soaring melodies.
   - **Sunburst Lotus (`lotus`)** — Warm grand-piano chord bloom that unfolds from dyads into luminous fifths and octaves as you conduct.
   - **Moss Lantern Reed (`reed`)** — Deep wooden marimba resonance & cello-piano root pedal anchoring the sanctuary.
   - **Windchime Fern (`fern`)** — Cascading harmonic chime arpeggios shimmering around the outer meadow ring.
   - **Raindrop Lily (`lily`)** — Pitched acoustic water-drop and soft wood pulse adding rhythmic motion.
2. **Three Hands-First Spatial Modes**:
   - **Plant Mode:** Pinch thumb and index finger in mid-air (with live translucent placement preview) to plant a new botanical sound orb. Its radial angle around the garden assigns its musical step (1–16), and its height snaps cleanly into any of the 5 musical scales (**F Lydian Dawn**, **C Major Pentatonic**, **D Dorian Meadow**, **A Minor Twilight**, or **G Mixolydian Breeze**).
   - **Sculpt Mode:** Reach out, pinch-grab an existing sound orb, and move your hand smoothly in 3D space—raise or lower to shift musical pitch, sweep around the ring to re-time its beat step—while glowing harmonic arcs reconnect to neighboring voices.
   - **Conduct Mode & Signature Conduct Bloom:** Open your palms to shape garden dynamics in real time. Raising both open hands high and wide (`>= 1.38 m` mean height, `>= 0.34 m` palm separation) charges and triggers the signature **Conduct Bloom**—a cascading musical flourish, warm golden canopy illumination, radial acoustic ripples, firefly pollen surge, and botanical petal expansion across the entire sanctuary.
3. **Comfort-First Companion Modes & Composition Persistence**:
   - **Touch Controller Fallback:** When native Meta Quest hand tracking is unavailable, Touch controller laser rays and trigger pull seamlessly support planting and sculpting without overriding active hands.
   - **Desktop Companion & Local-Only Webcam Mode:** Reviewers without a headset can orbit, plant, sculpt, trigger Conduct Bloom, and optionally enable strictly on-device webcam motion conducting (with a persistent, always-visible `"Camera Active (Local Only)"` privacy bar featuring Pause/Resume and Stop controls; zero frames ever leave the browser).
   - **Save, Load & Schema-Validated JSON Exchange:** Compositions save locally without overwriting prior slots, and can be exported to or imported from strictly validated JSON snapshots.
   - **Seamless Dr. T / Touch Grass Bridge:** Users can launch directly via deep link (`#living-sound-garden` or `?tab=living-sound-garden`), load three curated Touch Grass seed presets (**Morning Robin & Dew**, **Rain on Oak Leaves**, **Twilight Brook Nocturne**), or cross back and forth with **PIANIST — Touch Grass** and the rest of the Dr. T platform.

---

## 6. What Is New Compared to *Dr. T — PIANIST: Touch Grass*

| Dimension | *Dr. T — PIANIST: Touch Grass* (Prior Experience) | *PIANIST — The Living Sound Garden* (New Adaptation) |
| --- | --- | --- |
| **Core Experience** | 2D piano/mindfulness studio focused on calm grounded play and breathing cues | Full 3D spatial musical garden where users plant, sculpt, and conduct living instruments |
| **Target Runtime** | Desktop & mobile 2D browser UI | Meta Quest WebXR `immersive-vr` (`local-floor`) + desktop companion |
| **Input Paradigm** | Keyboard, pointer, and 2D touch controls | Native WebXR 25-joint hand tracking (pinch hysteresis, grab/sculpt, two-hand open-palm Conduct Bloom), gated Touch controller ray fallback, plus optional local-only desktop webcam conducting |
| **3D Engine & Environment** | None (2D canvas/DOM layout) | Procedural Three.js `0.187.0` botanical sanctuary (`InstancedMesh` grass blades, pollen/firefly motes, 16-step inlaid stone ring, circular garden brook, mossy boulders, 18 composite cypress/willow trees, dynamic bloom lights, harmonic arcs) |
| **Spatial Audio** | Stereo piano playback | 5-voice procedural Web Audio engine with per-voice `PannerNode` (`HRTF`), live WebXR headset position/orientation sync, shared bus compressor (`-16 dB`), and `-2 dB` brickwall safety limiter |
| **Signature Moment** | Grounding session / piano performance | Two-hand **Conduct Bloom** gesture triggering synchronized audio flourish + garden-wide visual bloom cascade |
| **Persistence** | Touch Grass studio state | Non-destructive local composition library + schema-validated, prototype-pollution-safe JSON export/import |

---

## 7. How We Built It

- **Spatial 3D Botanical Engine (`src/components/pianist/soundgarden/LivingSoundGardenEngine.ts`, `gardenMeshes.ts`):** Built with `three` (`0.187.0`). Uses instanced geometry for swaying meadow grass (`460` GPU / `220` SoftwareGL blades), luminous pollen/firefly motes (`220` GPU / `110` SoftwareGL), and 16-step radial stone markers (with dirty-checked GPU color buffer uploads to avoid unnecessary per-frame uploads), cached raycast hit targets, throttled harmonic arc geometry rebuilds during sculpting, and WebGL `contextlost`/`contextrestored` pause-and-recovery handling.
- **Deterministic WebXR & Hand-Tracking Controller (`xrHandController.ts`):** Decouples pure WebXR session lifecycle management (`XRSessionLifecycleManager`) and hand gesture state machines (`XRHandInteractionController`) from browser globals so every gesture transition can be verified deterministically in automated tests. Implements pinch start/release hysteresis (`0.024 m` / `0.040 m`), a `450 ms` plant cooldown, `180 ms` tracking-loss grace recovery, deliberate two-hand Conduct Bloom dwell (`420 ms`) with one-shot edge triggering and `1400 ms` re-arm cooldown, and strict gating so controller events never override active hand tracking.
- **Spatial Web Audio Synthesizer (`spatialAudioEngine.ts`, `musicTheory.ts`):** Pure Web Audio API synthesis across 5 botanical voices routed through 3D HRTF `PannerNode`s synchronized with the active WebXR headset's world position, forward vector, and world-quaternion `up` vector. Protects headset comfort with dual-stage dynamics (bus compressor at `-16 dB` + brickwall safety limiter at `-2 dB` with `18:1` ratio and `1 ms` attack), polyphony headroom scaling, and complete timer/node teardown on `dispose()`.
- **Minimal Spatial-First React Shell (`LivingSoundGardenModule.tsx`):** Clean floating HUD with explicit WebXR readiness status, non-blocking spatial audio unlock cue, `prefers-reduced-motion` support, keyboard focus accessibility, persistent local-only camera privacy controls, and zero blocking modal overlays on launch.

---

## 8. Challenges We Ran Into

Building a reliable WebXR hand-tracking music app required solving several real XR engineering pitfalls uncovered during our code audit:

1. **WebXR Hand Space Parenting:** Three.js `renderer.xr.getHand(0/1)` spaces must be explicitly added to the active `THREE.Scene` so WebXR joint world matrices update every frame. Catching and wiring `scene.add(hand)` plus proper world-quaternion listener orientation (`up` vector sync) was essential for accurate 3D hand poses and HRTF audio localization when tilting the headset.
2. **Preventing Noisy Gestures & Accidental Blooms:** Raw thumb-index pinch distances jitter near thresholds and can double-plant orbs or trigger blooms accidentally when users raise their hands casually. We implemented dual-threshold pinch hysteresis (`0.024 m` engage / `0.040 m` release), a `450 ms` plant cooldown, open-palm extension verification, a `420 ms` deliberate two-hand dwell window, and a `1400 ms` bloom cooldown.
3. **Preventing Controller Fallback Collisions & Stuck Grabs:** Meta Quest can expose both hands and controller events; without gating, controller `selectstart` events can conflict with native hand pinches. We introduced strict hand-activity precedence (`shouldAllowControllerFallback`) and a `180 ms` tracking-loss grace window so an orb never stays permanently stuck if a hand leaves the camera frustum.
4. **Headset Audio Safety & Zero-Leak Cleanup:** Rapidly conducting dense orb gardens can stack oscillators and clip harshly in headphones. Adding a dedicated `-2 dB` brickwall safety limiter, polyphony scaling, and explicit tracking/disconnection of every active `PannerNode` and cleanup timer ensured clean audio and zero resource leaks across session restarts.
5. **Safe Composition Imports:** Supporting JSON sharing required strict schema validation, finite numeric checks, orb count caps (`<= 28`), and explicit rejection of prototype-pollution keys (`__proto__`, `constructor`, `prototype`) without ever silently overwriting existing saved gardens.

---

## 9. Accomplishments That We're Proud Of

- **Zero-Install Spatial Music Creation:** Transforming *Touch Grass* into a full procedural 3D WebXR sanctuary that starts playing harmonic, scale-locked music immediately with five bespoke spatial instruments.
- **Deterministic Automated XR Logic Verification:** Writing 19 focused automated tests (`scripts/test-living-sound-garden.ts`) that verify WebXR capability probing, session locking/rollback, pinch hysteresis, grab/sculpt/release, tracking-loss recovery, two-hand Conduct Bloom dwell & cooldown, controller fallback gating, full mock-`AudioContext` HRTF synthesis & limiter graph teardown, and malicious JSON rejection—all passing `19/19` alongside `0` TypeScript errors and zero regressions across Dr. T's Population Health (`62/62`), Production Isolation (`14/14`), and Phase 2 Remediation suites.
- **Privacy-First Local Companion Design:** Desktop webcam tracking runs strictly in-browser with zero network upload, auto-stops immediately when entering VR, and displays a persistent local-only pause/stop indicator even when the control dock is collapsed.

---

## 10. What We Learned

- Separating pure XR state machines (`xrHandController.ts`) from Three.js rendering (`LivingSoundGardenEngine.ts`) makes subtle hand-tracking edge cases (hysteresis, dwell timing, tracking-loss release, and fallback precedence) dramatically easier to reason about and test before putting on a headset.
- Spatial audio comfort is just as important as spatial visuals: syncing the listener's world `up` vector during head tilt and enforcing a brickwall safety limiter keeps harmonic swells enveloping rather than fatiguing.
- Hosting an authentic public WebXR judging build requires an unauthenticated public HTTPS endpoint—development preview environments behind cloud authentication redirects (`/__cookie_check.html`) cannot be opened directly in Meta Quest Browser by judges.

---

## 11. What's Next

1. **Public HTTPS Judging Deployment:** Deploy a dedicated, unauthenticated public HTTPS build serving `#living-sound-garden` cleanly for Meta Quest Browser judges, completely isolated from Dr. T's development clinical/Firestore services.
2. **Physical Meta Quest Verification & Tuning:** Execute all 12 manual verification steps in `docs/PIANIST_LIVING_SOUND_GARDEN_QUEST_TEST_PLAN.md` on Meta Quest hardware to profile live Quest frame timing, comfort, pinch ergonomics, and binaural HRTF clarity.
3. **Demo Video Recording:** Capture the 2:50 headset + spatial audio showcase outlined in `docs/PIANIST_LIVING_SOUND_GARDEN_DEMO_STORYBOARD.md`.
4. **Future Spatial Enhancements:** Explore WebXR `immersive-ar` passthrough so users can plant sound orbs in their real living room, plus shared collaborative multi-user gardens.

---

## 12. Built With

Verified directly from `package.json` and browser runtime APIs:

- `React` (`18.3.1`)
- `TypeScript` (`5.7.3`)
- `Three.js` (`0.187.0`)
- `WebXR Device API` (`immersive-vr`, `hand-tracking`, `local-floor`)
- `Web Audio API` (procedural synthesis + HRTF 3D spatialization)
- `Tailwind CSS` (`4.0.0`)
- `Vite` (`6.1.0`)
- `Lucide React` (`0.475.0`)

*(No Unity, Unreal, Godot, Native Android, or Meta IWSDK packages are used.)*

---

## 13. Judge Testing Instructions

> **Prerequisite:** Insert the dedicated public HTTPS URL below once deployed outside Google AI Studio's auth gate.

### Option A — Meta Quest Headset (Primary Experience)
1. Enable **Hand Tracking** in Meta Quest Settings (`Settings → Movement Tracking → Hand Tracking`).
2. Open **Meta Quest Browser** and navigate to:
   `[PUBLIC_PLAYABLE_RELEASE_URL_REQUIRED_BEFORE_SUBMISSION]/#living-sound-garden`
3. Wait for the twilight garden clearing to load, then select **Enter VR** (WebXR `immersive-vr`).
4. If audio is muted by browser autoplay policy, tap **Enable Spatial Sound** or pinch any orb to unlock Web Audio.
5. **Plant:** In **Plant** mode, pinch thumb and index finger in mid-air to plant new sound orbs (switch between the 5 botanical species in the compact bar).
6. **Sculpt:** Switch to **Sculpt** mode, pinch an existing orb, and lift/lower or sweep it around the clearing to reshape pitch and rhythm.
7. **Conduct Bloom (Signature Moment):** Switch to **Conduct** mode (or raise both open palms high and wide above shoulder height for ~0.5 seconds) and watch the entire garden bloom in light, petals, fireflies, and cascading harmony.
8. Exit VR via the Quest menu button or **Exit VR** control to confirm clean session teardown.

### Option B — Desktop Browser Companion (No Headset Required)
1. Open `[PUBLIC_PLAYABLE_RELEASE_URL_REQUIRED_BEFORE_SUBMISSION]/#living-sound-garden` in Chrome or Edge.
2. Click **Enable Spatial Sound** (or click the garden) to start playback.
3. Click the clearing to plant orbs, drag orbs in **Sculpt** mode to reshape melodies, press **Conduct Bloom** (or `Space` / Bloom button) for the signature bloom, and test **Save**, **Export JSON**, and **Import JSON** in the garden drawer.
4. *(Optional)* Toggle **Hand Cam** to test strictly local-only desktop camera motion guidance (zero frames uploaded; pause/stop control stays visible at all times).
5. Click **Touch Grass** to verify seamless continuity back to the parent *Dr. T — PIANIST: Touch Grass* experience.

---

## 14. Pre-Submission Release Gate Checklist

- [ ] Deploy public, unauthenticated HTTPS judging endpoint serving `#living-sound-garden` and replace `[PUBLIC_PLAYABLE_RELEASE_URL_REQUIRED_BEFORE_SUBMISSION]`.
- [ ] Complete all 12 manual verification steps on physical Meta Quest hardware (`docs/PIANIST_LIVING_SOUND_GARDEN_QUEST_TEST_PLAN.md`) and record actual frame-rate / comfort notes.
- [ ] Record and upload the 2–3 minute on-device demo video (`docs/PIANIST_LIVING_SOUND_GARDEN_DEMO_STORYBOARD.md`) and replace `[DEMO_VIDEO_URL_NOT_YET_RECORDED]`.
- [ ] Confirm Devpost build path is set to **WebXR / Browser** (do **not** claim Meta IWSDK).
