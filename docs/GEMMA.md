# Gemma AI Integration in PIANIST Touch Grass

## Overview

**Gemma** serves as the core reasoning engine for **PIANIST — Touch Grass**. Rather than serving as an open-ended conversational bot, Gemma performs structured musical pedagogy and acoustic translation.

---

## 🧠 Architectural Roles of Gemma

1. **Acoustic Interpretation**: Maps real-world audio features (transients, pitch brightness, spectral centroid) to musical concepts (pulse, meter, interval direction).
2. **Pedagogical Exercise Generation**: Synthesizes specific target notes, hand assignments, and fingering guidance adapted to the learner's skill level.
3. **Reflective Coaching**: Generates actionable, concise pedagogical tips grounded in established music pedagogy.

---

## 📑 Gemma Structured Output Schema

All Gemma reasoning responses conform to the following JSON schema:

```json
{
  "sound_type": "string",
  "source_category": "Footsteps / Walking | Birdsong / Wildlife | Rain / Water Flow | Traffic / Transit",
  "pulse_detected": true,
  "tempo_estimate": 96,
  "pattern": "string",
  "melodic_contour": "rising | falling | arched | static",
  "confidence": 0.88,
  "recommended_skill": "rhythm | melody | harmony | improvisation | active_listening",
  "pedagogy_explanation": "string",
  "exercise": {
    "title": "string",
    "type": "piano_rhythm | melody_reproduction | ostinato_accompaniment | improvisation_seed",
    "difficulty": 2,
    "keySignature": "C Major",
    "targetNotes": ["C3", "G3", "A3", "F3"],
    "suggestedHand": "LH | RH | Both",
    "instructions": "string"
  },
  "coach_tip": "string",
  "model_provider_name": "Gemma-2-9B (Cloud) | Gemma Local Heuristic Engine"
}
```

---

## 🔌 Provider Implementations

### 1. `GemmaLocalProvider` (Edge Heuristic)
- Runs locally in the browser client with 0ms network latency.
- Guaranteed deterministic analysis and offline availability.
- Zero data leaves the user's device.

### 2. `GemmaCloudProvider` (Hosted Models)
- Connects to hosted Gemma models (`gemma-2-9b-it`, `gemma-2-27b-it`, or Gemini model adapters).
- Falls back automatically to `GemmaLocalProvider` if network connectivity or API credentials are unavailable.
- Can be pointed to any OpenAI-compatible Gemma endpoint (Ollama, vLLM, Vertex AI).
