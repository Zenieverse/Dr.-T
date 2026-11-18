# PIANIST — The Living Sound Garden
## Competition Demo Video Storyboard & Recording Plan

**Status:** `DEMO VIDEO STATUS: NOT RECORDED`  
**Competition:** Meta VR Start Developer Competition 2026  
**Track:** Entertainment · **Division:** Adapted / Significantly Updated Experience  
**Target Duration:** **2 minutes 50 seconds** (strictly under the 3-minute Devpost limit)  
**Primary Capture Format:** 1920×1080 (16:9) @ 60 FPS, stereo binaural audio (`-14 LUFS` integrated, zero clipping)

---

## 1. Storyboard & Narration Script (0:00 – 2:50)

| Segment | Timecode | Visual Shot List | On-Screen Caption | Spoken Narration Script |
| :--- | :--- | :--- | :--- | :--- |
| **1. Opening Hook** | `0:00 – 0:15` | Wide establishing shot of the golden-dawn botanical sanctuary in Meta Quest VR: radial limestone sequencer ring, brook moat, swaying cypress groves, rotating conductor light beam. Hands enter frame gently. | `PIANIST — The Living Sound Garden` · `Grow music with your hands.` | *"What if instead of playing a conventional instrument, you grew your own living musical world? Welcome to PIANIST — The Living Sound Garden for Meta Quest WebXR."* |
| **2. Adapted Lineage (Touch Grass -> VR)** | `0:15 – 0:30` | Crisp 4-second inset of existing *Dr. T — PIANIST: Touch Grass* outdoor rhythm/listening companion transitioning smoothly into full 360° stereoscopic WebXR clearing with Touch Grass seed presets (*Morning Robin & Dew*, *Rain on Oak Leaves*, *Twilight Brook Nocturne*). | `Adapted from Dr. T — PIANIST: Touch Grass` · `New 3D Spatial VR & Hand-First Experience` | *"Built from Dr. T's PIANIST: Touch Grass, we reimagined musical mindfulness from a 2D outdoor companion into a full spatial WebXR sanctuary powered by Three.js, native WebXR hand tracking, and 3D HRTF Web Audio."* |
| **3. Mode 1 — Plant** | `0:30 – 0:55` | First-person Quest view: open index finger projects wireframe seed preview ring onto the clearing; crisp thumb-index pinches plant 4 contrasting species: **Bellflower** (melody), **Lotus Piano** (chords), **Moss Reed Bass** (warm foundation), and **Windchime Fern** (arpeggio shimmer). Each sprouts from mossy mound and rings on the 16-step compass. | `1. Plant — Pinch to seed 5 botanical instruments` | *"In Plant mode, pinch anywhere in the clearing to grow five distinct procedural voices—crystalline bellflowers, blooming lotus chords, deep moss-reed bass, windchime ferns, and raindrop lilies. Every flower anchors to the 16-step radial stone compass around you."* |
| **4. Mode 2 — Sculpt** | `0:55 – 1:25` | First-person Quest hand reaches within arm's length of a Bellflower, pinches to grab, lifts vertically from low `F4` up to bright `C6` (auditioning each scale degree live), then sweeps clockwise across radial beat stones as consonant harmonic constellation arcs glow between fifths and octaves. | `2. Sculpt — Lift for pitch · Sweep around the ring for rhythm` | *"To shape a melody, simply reach out and pinch an orb in mid-air. Raising its stem climbs the active musical scale—here in luminous F Lydian—while sweeping around the sanctuary shifts its rhythmic beat and lights up consonant harmonic links."* |
| **5. Mode 3 — Conduct** | `1:25 – 1:55` | Open both palms at chest height; lift and spread hands smoothly. Show audio warmth opening (low-pass filter & woodland convolution reverb), grass swaying, petals breathing wider, and Meadow Breeze ambience layering softly. Show brief 360° head turn as spatial sound rotates cleanly around the ears. | `3. Conduct — Open palms shape dynamics, brightness & spatial reverb` | *"When your garden comes alive, step back with open palms. Lifting and spreading your hands conducts dynamics, harmonic brightness, and woodland reverb in real time—with every bloom positioned around your head in true 3D HRTF spatial audio."* |
| **6. Signature Moment — The Conduct Bloom** | `1:55 – 2:25` | Both open palms rise high (`> 1.38m`) and hold steadily through the deliberate `420ms` dwell lock. The entire sound garden erupts into the **Signature Conduct Bloom**: golden horizon sky warms, center light surges, sweeping harmonic crescendo swells, every botanical flower opens its petals wide, and luminous firefly pollen spirals skyward. Hold 12 seconds of pure uninterrupted music & bloom! | `Signature Moment — Raise both open hands to bloom the entire garden` | *"And when your composition is ready, raise both open hands skyward..."* *(pause 12 seconds — let the living garden bloom and spatial chord swell speak for itself!)* |
| **7. Persistence & Cross-Device Fallback** | `2:25 – 2:38` | Quick clean cut showing desktop browser companion (`Enter VR` ready, collapsible dock hidden for clean cinema view, `Save`, `Export` & validated `Import` JSON composition preserving user gardens cleanly). | `Works on Meta Quest WebXR + Desktop Companion · Save / Export / Import JSON` | *"Compositions save locally without overwriting prior gardens, export and import cleanly as validated JSON, and open straight in Meta Quest Browser—with Touch controller and desktop fallbacks built in."* |
| **8. Closing Card** | `2:38 – 2:50` | Slow pull-back over the glowing twilight sanctuary as harmonic arcs pulse gently. Clean title card fades in. | `PIANIST — The Living Sound Garden` · `Grow music with your hands.` · `Built for Meta VR Start Developer Competition 2026` | *"PIANIST — The Living Sound Garden. Grow music with your hands."* |

---

## 2. Meta Quest & PCVR Recording Checklist

- [ ] **Deploy Public HTTPS URL First:** Ensure the live URL opens directly in Meta Quest Browser at `/#living-sound-garden` with zero Google login or cookie redirect.
- [ ] **Capture Aspect Ratio (16:9 Widescreen):** Enable **Landscape 16:9 (1920×1080 @ 60 FPS)** in Quest Camera Settings (`Settings -> System -> Camera -> Aspect Ratio: Landscape 16:9`, `Image Stabilization: Medium`), OR cast via Meta Quest Developer Hub / `scrcpy --crop` so footage is crisp widescreen rather than raw square eye crop.
- [ ] **Show Real Hand Tracking:** Record Segments 1, 3, 4, 5, and 6 inside Meta Quest with **native optical hand tracking active** (pearl joint visualizers clearly visible, zero fake overlays).
- [ ] **Label Device Footage Honestly:** Keep on-screen captions transparent if mixing a brief desktop UI cut (Segment 2/7) with Meta Quest headset capture (Segments 1, 3, 4, 5, 6).
- [ ] **Clean Room & Frame Stability:** Stand in a well-lit room with smooth head turns (`<= 30°/sec`) to avoid jarring camera shake for judges.

---

## 3. Spatial Audio Capture Checklist

- [ ] **Capture Direct Stereo / Binaural Output:** Record system audio directly from Quest Browser capture (or PCVR mirror audio) rather than room microphone pickup so HRTF left/right panning and woodland reverb tails remain crystal clear.
- [ ] **Voiceover Ducking:** Mix spoken narration cleanly at `-16 LUFS` and duck musical garden bed `-6 dB` during narration, then bring the garden mix up to full lush volume during the **12-second uninterrupted Signature Conduct Bloom** (`2:03 – 2:15`).
- [ ] **Headroom & Zero Clipping Verification:** Confirm peak meter never exceeds `-1.0 dBTP` during the full-garden Conduct Bloom swell.
- [ ] **Captions & Accessibility:** Burn subtle, high-contrast captions or upload `.srt` subtitles to YouTube/Vimeo before attaching the Demo Video URL to Devpost.
