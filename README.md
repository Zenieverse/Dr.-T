# PIANIST — Touch Grass 🌿🎹

> **Hear the world. Find the music. Play it.**

An open-source AI music-learning platform that transforms real-world outdoor sounds into piano learning missions, melodic contours, and rhythmic exercises powered by **Gemma**.

---

## 🌐 Live Demo

* **PIANIST — Touch Grass**: [https://ais-pre-4s4jvpipr3mh3mz6x2hpfp-393352619239.asia-southeast1.run.app](https://ais-pre-4s4jvpipr3mh3mz6x2hpfp-393352619239.asia-southeast1.run.app)
* **GitLab Showcase**: [https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/28080870/showcase](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/28080870/showcase)

---

## 🏆 Hackathon Submission

* **Project**: PIANIST — Touch Grass
* **GitLab Showcase Repository**: [https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/28080870/showcase](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/28080870/showcase)
* **Live Demo**: [https://ais-pre-4s4jvpipr3mh3mz6x2hpfp-393352619239.asia-southeast1.run.app](https://ais-pre-4s4jvpipr3mh3mz6x2hpfp-393352619239.asia-southeast1.run.app)
* **Demo Video**: *To be added* (placeholder for post-recording submission upload)
* **Technology Stack**: React 18, TypeScript, Tailwind CSS, Web Audio API (Additive Synthesis & AnalyserNode), Gemma AI Reasoning Layer (Local & Cloud), Vite
* **Privacy Approach**: 100% Client-side in-memory acoustic feature extraction; raw audio buffers immediately discarded; zero persistent GPS tracking; zero external telemetry
* **GitLab AI / Agent Development Evidence**: See repository history and documented workflow in [`docs/GITLAB_AI.md`](docs/GITLAB_AI.md); no unsupported feature claims are made.
* **Onboarding & Work Items**: Official GitLab workspace for `@zenieverse` (DevPost: `zenieverse`). Onboarding guide preserved at [`docs/SHOWCASE_ONBOARDING.md`](docs/SHOWCASE_ONBOARDING.md).

---

## 🚶 Demo Flow: OUTSIDE → LISTEN → DISCOVER → PIANO

1. **OUTSIDE (60-Second Walk)**: Step away from screens. A calming 60-second timer reminds the learner: *"Put your phone away. Eyes up. Listen."*
2. **LISTEN (Acoustic Capture)**: Upon return, capture real environmental rhythms and melodies via short 3-second mic sampling, interactive tap tempo, or verified acoustic demo scenarios (gravel footsteps, birdcalls, raindrops, flowing water).
3. **DISCOVER (Gemma Reasoning)**: Gemma analyzes pulse, tempo (BPM), and melodic contours to translate ambient soundscapes into pedagogical exercises and target notes.
4. **PIANO (Interactive Performance)**: Audition the target phrase, practice on the responsive physical-modeling piano synthesizer (keyboard, touch, or MIDI), prove mastery, and earn outdoor ear-training milestones.

---

## 🌟 Overview

Most music learning platforms trap students in front of a glass screen:
`Screen → Lesson → Exercise → Screen`

**PIANIST — Touch Grass** reverses the cycle:
```
GO OUTSIDE → LISTEN → DISCOVER → RESPOND → RETURN TO THE PIANO → PLAY
```

The screen is the shortest part of the experience. Learners physically step away from digital devices, explore the outdoors, listen for real rhythms (footsteps, water, traffic, bicycle wheels) and melodic contours (birdcalls, voices, train whistles), and return to the piano to translate environmental sound into musicianship.

---

## 🎯 Target Repositories
- **GitLab Showcase**: [`gitlab-ai-hackathon/transcend-october-2026/28080870/showcase`](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/28080870/showcase)
- **GitHub Repository**: [`Zenieverse/pianist-touch-grass`](https://github.com/Zenieverse/pianist-touch-grass)
- **License**: MIT
- **Architecture**: Web Audio API Physical Modeling Synthesizer + Gemma Open AI Reasoning Layer + React 18 + Tailwind CSS

---

## ✨ Core Pillars

1. **The 60-Second Music Walk (Signature Demo)**
   - Guided outdoor mission: *"Put your phone away. Eyes up. Listen."*
   - Active countdown timer with acoustic awareness prompt.
   - Reflection & feature capture upon return.
   - Real-world microphone feature extraction or verified demo datasets.
   - Conversion to an interactive piano exercise.
   - Performance evaluation on the live keyboard.
   - *"You heard it. Now play it. You didn't memorize this. You discovered it."*

2. **AI Reasoning Layer (Local Heuristic & Gemma 4 Cloud Inference)**
   - Extensible abstraction interface (`AIProvider`) with zero vendor lock-in.
   - **Local Heuristic Provider (Default)**: 100% offline, client-side deterministic music theory and acoustic reasoning engine ensuring absolute privacy and 0ms latency.
   - **Gemma Cloud Provider**: Actively executes native hosted **Gemma 4 (`gemma-4-31b-it` / `gemma-4-26b-a4b-it`)** via the Google GenAI SDK with graceful fallback to local heuristic reasoning.
   - Generates structured JSON conforming to the musical reasoning schema (pulse detection, estimated BPM, melodic contours, pedagogical hand assignments, and target notes).

3. **100% Client-Side Audio Privacy**
   - Live audio is analyzed in-memory via the Web Audio API `AnalyserNode`.
   - Musical features (spectral centroid, RMS energy, onsets) are extracted in real time.
   - **Raw audio buffers are immediately discarded** and never transmitted to external servers without explicit consent.
   - Zero continuous background recording.

4. **Interactive Physical Modeling Piano**
   - Additive synthesis with realistic acoustic overtones, hammer strike transients, and damper pedal decay.
   - Works across touchscreen, mouse, computer keyboard shortcuts (`A-S-D-F-G-H-J-K`), and Web MIDI hardware digital pianos.

5. **Outdoor Missions Library**
   - **Rhythm Hunt**: Capture walking strides, machinery, or rainfall pulses and convert to left-hand bass ostinatos.
   - **Melody Hunt**: Isolate avian and human vocal contours (ascending, descending, arched) and map intervals to treble keys.
   - **Silence Mission**: 60 seconds of silent active listening with post-mission auditory reflection questions.
   - **Sound Map**: Coarse, privacy-safe acoustic mapping (near, mid, far distance) without persistent GPS tracking.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ or 22+
- npm 10+

### Installation
```bash
# Clone the repository
git clone https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/28080870/showcase.git
cd showcase

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to launch the experience.

---

## 📦 Project Structure

```
├── docs/
│   ├── ARCHITECTURE.md          # Technical design & audio pipeline
│   ├── CHALLENGE.md             # The Independent Pianist Ultimate Test
│   ├── DEMO.md                  # Deterministic demo guide (60s Walk)
│   ├── GEMMA.md                 # Gemma prompt schemas & provider integration
│   ├── OUTDOOR-MISSIONS.md      # Mission library & pedagogical milestones
│   ├── PRIVACY.md               # Privacy constitution & audio lifecycle
│   └── SHOWCASE_ONBOARDING.md   # Original GitLab Transcend onboarding instructions
├── src/
│   ├── components/
│   │   ├── pianist/
│   │   │   ├── touchgrass/      # Touch Grass outdoor core
│   │   │   │   ├── ai/          # AIProvider, GemmaLocal & GemmaCloud
│   │   │   │   ├── audio/       # Web Audio AnalyserNode feature extractor
│   │   │   │   └── TouchGrassStudio.tsx
│   │   │   ├── audio/           # Web Audio additive piano synthesizer
│   │   │   └── components/      # Interactive keyboard & notation staves
├── CONTRIBUTING.md
├── LICENSE
├── README.md
└── SECURITY.md
```

---

## 🔒 Privacy & Data Flow
See [`docs/PRIVACY.md`](docs/PRIVACY.md) for our full security and acoustic privacy policy.
- No continuous audio streaming.
- No persistent GPS coordinates stored.
- Local feature extraction runs completely inside the browser client.

---

## 🤝 Contributing
Contributions are warmly welcomed! Please read [`CONTRIBUTING.md`](CONTRIBUTING.md) and [`SECURITY.md`](SECURITY.md) before submitting pull requests.

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
