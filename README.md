# PIANIST — Touch Grass 🌿🎹

> **Hear the world. Find the music. Play it.**

An open-source AI music-learning platform that transforms real-world outdoor sounds into piano learning missions, melodic contours, and rhythmic exercises powered by **Gemma**.

---

## 🏆 GitLab Transcend AI Hackathon Showcase
**Transcend Hackathon Showcase workspace for @zenieverse (DevPost: zenieverse)**
* Visit the [onboarding issue](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/28080870/showcase/-/work_items/1) to get started.
* Official repository: [GitLab Transcend Showcase](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/28080870/showcase)
* Full GitLab onboarding guide preserved at [`docs/SHOWCASE_ONBOARDING.md`](docs/SHOWCASE_ONBOARDING.md).

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

2. **Gemma Open AI Reasoning Layer**
   - Abstraction interface (`AIProvider`) with zero vendor lock-in.
   - **Gemma Local Provider**: Deterministic on-device edge reasoning with full JSON schema compliance.
   - **Gemma Cloud Provider**: Configurable integration with hosted Gemma models (`gemma-2-9b-it`, `gemma-2-27b-it`, Ollama, vLLM).
   - Generates structured JSON describing sound classification, pulse detection, estimated BPM, melodic contours, and pedagogical exercises.

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
