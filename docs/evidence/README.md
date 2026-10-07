# Evidence & Demonstration Guide — PIANIST Touch Grass

This directory provides judges with the visual, pipeline, and verification evidence for the **GitLab Transcend AI Hackathon** submission of **PIANIST — Touch Grass**.

---

## 🎯 Where to Find Verification Evidence

| Evidence Type | Location / Artifact | Description |
| :--- | :--- | :--- |
| **Live Working Application** | [ais-pre deployment](https://ais-pre-4s4jvpipr3mh3mz6x2hpfp-393352619239.asia-southeast1.run.app) | Live interactive deployment running the full Touch Grass experience. |
| **GitLab Showcase Repository** | [GitLab Repository](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/28080870/showcase) | Synchronized main branch containing all source code and documentation. |
| **CI / Pipeline Validation** | [`.gitlab-ci.yml`](../../.gitlab-ci.yml) | Automated build and TypeScript check pipeline configured for GitLab CI. |
| **Gemma Reasoning Engine** | [`docs/GEMMA.md`](../GEMMA.md) | Structured JSON output schemas and local/cloud fallback architecture. |
| **Acoustic Privacy Rules** | [`docs/PRIVACY.md`](../PRIVACY.md) | Ephemeral in-memory audio processing and zero-GPS privacy architecture. |
| **GitLab AI Workflow** | [`docs/GITLAB_AI.md`](../GITLAB_AI.md) | Verifiable development workflow and GitLab platform integration documentation. |

---

## 📸 Application Screenshots (Visual Submission Guide)

To maintain a clean repository tree and avoid committing binary assets prior to submission video finalization, judges and evaluators can verify the live UI directly in the running app or reference the required submission captures below:

### 1. 60-Second Walk / Outdoor Mission Screen
- **UI Location**: Select **🌿 Touch Grass** → click **START OUTDOOR MISSION (60s WALK)**.
- **Expected View**: The calming countdown interface prompting the user:
  > *"PUT YOUR PHONE AWAY. Eyes up. Safe footing. Listen."*
- **Pedagogical Function**: Removes the user from the digital screen to encourage physical acoustic listening.

### 2. Acoustic Feature Capture & Discovery
- **UI Location**: Reflection modal upon completing the 60s walk.
- **Expected View**:
  - Live microphone feature extraction card (3-second capture via Web Audio AnalyserNode).
  - Tap-tempo rhythm pad.
  - Verified demo datasets: *Gravel Footsteps (96 BPM)*, *Morning Robin (112 BPM)*, *Raindrops on Leaves (84 BPM)*, *Flowing Brook (78 BPM)*.
- **Pedagogical Function**: Captures environmental tempo, spectral centroid, and rhythmic pulse for Gemma analysis.

### 3. Interactive Physical-Modeling Piano Keyboard
- **UI Location**: Bottom half of the Touch Grass / Pianist Studio interface.
- **Expected View**:
  - Full interactive 88/61-key piano keyboard with responsive key states.
  - Target note illumination and notation ledger highlighting corresponding to outdoor discovery exercises.
  - Support for mouse, touch, computer keyboard (`A-S-D-F-G-H-J-K`), and Web MIDI devices.

### 4. End-to-End Flow: OUTSIDE → LISTEN → DISCOVER → PIANO
- **UI Location**: Post-exercise completion screen ("Prove It").
- **Expected View**:
  - Celebration dialog: *"You heard it. Now play it. You didn't memorize this. You discovered it."*
  - Award badge (+75 Outdoor XP) and updated Active Listening score in the learner's passport.

---

## 🎥 Video Demonstration
- **Status**: *To be added to Devpost and GitLab project metadata upon video hosting upload.*
- **Walkthrough Script**: See [`docs/DEMO.md`](../DEMO.md) for the exact 6-step deterministic demonstration script.
