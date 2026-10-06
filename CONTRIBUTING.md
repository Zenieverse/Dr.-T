# Contributing to PIANIST — Touch Grass

Thank you for your interest in contributing to **PIANIST — Touch Grass**!

We welcome contributions from musicians, software engineers, educators, audio scientists, and sound designers.

---

## 🧭 Core Principles

1. **Non-Screen Centric**: Features must encourage real-world listening, active auditory attention, or physical piano performance. Never build features that artificially maximize screen time.
2. **Audio Privacy First**: Never introduce continuous background audio recording, persistent GPS storage, or third-party telemetry.
3. **Gemma Model Agnosticism**: AI logic must conform to the `AIProvider` interface to support local edge execution and open-weights Gemma runtimes.
4. **Musically Sound**: Ensure music theory, rhythmic divisions, and interval representations are pedagogically accurate.

---

## 🛠️ Development Workflow

1. Fork the repository on GitHub: `https://github.com/Zenieverse/pianist-touch-grass`.
2. Clone your fork locally:
   ```bash
   git clone https://github.com/<your-username>/pianist-touch-grass.git
   cd pianist-touch-grass
   ```
3. Create a feature branch:
   ```bash
   git checkout -b feat/outdoor-water-mission
   ```
4. Install dependencies and run tests:
   ```bash
   npm install
   npm run lint
   npm run build
   ```
5. Commit your changes with conventional commit messages:
   ```bash
   git commit -m "feat(missions): add river and brook improvisation prompts"
   ```
6. Push to your branch and open a Pull Request.

---

## 🧪 Code Quality & Guidelines

- **TypeScript**: Strict type checking. Avoid `any` where structured interfaces exist.
- **Audio Synthesis**: Avoid external binary dependencies. Utilize standard Web Audio API oscillators, audio buffers, and gain nodes.
- **Responsive Design**: Ensure exercises remain usable on mobile phones and tablets during outdoor walks.

---

## 💬 Community & Code of Conduct

Be kind, encouraging, and welcoming to all learners and contributors. Music belongs to everyone.
