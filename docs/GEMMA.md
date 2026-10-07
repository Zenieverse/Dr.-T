# AI Architecture & Gemma Provider Integration in PIANIST Touch Grass

## Overview

**PIANIST — Touch Grass** bridges the physical outdoors with musical keyboard learning through an extensible **AI Provider Abstraction Layer** (`AIProvider`).

The system translates environmental acoustic features into structured, pedagogical piano exercises. To guarantee strict technical integrity and submission honesty, this document details exactly how musical reasoning is implemented and where AI models operate.

---

## 🏛️ AI Provider Architecture

The project implements a pluggable provider interface (`AIProvider`) with two concrete implementations:

```
                  Extracted Audio Features (RMS, Centroid, Tempo, Onsets)
                                            ↓
                                     AIProvider Interface
                                      /              \
                                     /                \
          LocalHeuristicProvider (Default)      GemmaCloudProvider (Hosted Bridge)
          --------------------------------      ----------------------------------
          • In-Browser Deterministic Engine     • Hosted LLM Endpoint (/api/gemma/interpret)
          • 100% Offline & Private              • Gemma / Gemini-Compatible Prompt Bridge
          • Zero Neural Weight Execution        • Strict JSON Schema Enforcement
          • Instant (0ms Network Latency)       • Automatic Local Heuristic Fallback
```

---

## 🔍 Provider Implementations Explained

### 1. `LocalHeuristicProvider` (Deterministic Local Music Reasoning Engine)
* **Execution Location**: Client-side (in-browser TypeScript).
* **AI / Weight Status**: **Deterministic heuristic rules only — does NOT execute neural model weights locally.**
* **Technical Function**: Maps acoustic features (detected BPM, pitch direction, energy transients) and environmental keyword cues (footsteps, birdsong, water, machinery, traffic) into appropriate pedagogical exercises, time signatures, hand assignments, and target piano notes.
* **Benefits**: 
  - 100% acoustic privacy (zero audio or feature data ever leaves the user's browser).
  - Works completely offline in remote parks and nature trails without cellular connectivity.
  - 0ms inference latency.

### 2. `GemmaCloudProvider` (Hosted Model Bridge)
* **Execution Location**: Server-side proxy (`/api/gemma/interpret`) or hosted inference endpoints.
* **Supported Models**: Configurable bridge for hosted Gemma runtimes (`gemma-2-9b-it`, `gemma-2-27b-it`, Vertex AI, Ollama, or vLLM endpoints).
* **Technical Function**: Sends extracted numerical acoustic features and contextual notes to the model with a strict system instruction constraining output to the musical reasoning JSON schema.
* **Fallback Behavior**: If network connectivity is lost, credentials are unconfigured, or the endpoint fails, it automatically and silently falls back to `LocalHeuristicProvider` to ensure uninterrupted learner experience.

---

## 📑 Structured Musical Reasoning Schema

Both providers output strictly formatted JSON conforming to this specification:

```json
{
  "sound_type": "string (e.g., environmental_footstep_pulse, avian_melodic_contour)",
  "source_category": "Footsteps / Walking | Birdsong / Avian Contour | Rain / Water Flow | Bicycle Wheels / Mechanical | Construction / Heavy Machinery | Traffic Signals / Pedestrian Crossing | Doors / Latches & Hinges",
  "pulse_detected": true,
  "tempo_estimate": 96,
  "pattern": "string describing rhythmic subdivision or cadence",
  "melodic_contour": "rising | falling | arched | static",
  "confidence": 0.91,
  "recommended_skill": "rhythm | melody | harmony | improvisation | active_listening",
  "pedagogy_explanation": "Detailed explanation linking real-world acoustics to piano technique",
  "exercise": {
    "title": "Exercise title",
    "type": "piano_rhythm | melody_reproduction | ostinato_accompaniment | improvisation_seed",
    "difficulty": 1,
    "keySignature": "C Major",
    "targetNotes": ["C3", "G3", "A3", "F3"],
    "suggestedHand": "LH | RH | Both",
    "instructions": "Step-by-step instructions for the student at the keyboard"
  },
  "coach_tip": "Short pedagogical cue (wrist angle, breathing, finger weight)",
  "model_provider_name": "Deterministic Local Heuristic Engine | Gemma-Compatible Hosted Reasoning Engine"
}
```

---

## 🎙️ Audio Processing Capabilities & Boundaries

To prevent overclaiming, here is what the client-side audio pipeline actually extracts:

### What Is Extracted:
* **RMS Energy**: Real-time signal amplitude used for onset detection.
* **Spectral Centroid**: Frequency brightness indicator distinguishing high-frequency chirps from low-frequency mechanical thuds.
* **Periodic Pulse & Tempo**: Peak-to-peak interval measurement estimating Beats Per Minute (BPM).
* **Pitch Direction Tendency**: Multi-frame centroid drift indicating rising, falling, or static contours.

### What Is NOT Claimed:
* ❌ Not claiming full polyphonic automatic music transcription.
* ❌ Not claiming fine-grained biological birdsong species identification.
* ❌ Not claiming local embedded Gemma model execution in browser memory.
* ❌ Verified demo scenarios are explicitly labeled as `DEMO DATA` for testing without outdoor microphone access.
