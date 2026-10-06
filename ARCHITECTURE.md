# Technical Architecture — PIANIST Touch Grass

## System Topology

```
┌────────────────────────────────────────────────────────┐
│                   OUTDOOR ENVIRONMENT                  │
│       (Footsteps, Birds, Rain, Traffic, Voices)        │
└───────────────────────────┬────────────────────────────┘
                            │
               [Physical Listening Phase]
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                  WEB AUDIO INGESTION                   │
│          navigator.mediaDevices.getUserMedia()         │
└───────────────────────────┬────────────────────────────┘
                            │
               [Local Processing Window: 3.5s]
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│              FEATURE EXTRACTION PIPELINE               │
│  - AnalyserNode (FFT 2048)                             │
│  - RMS Energy Detector                                 │
│  - Onset / Peak Transients (BPM estimation)            │
│  - Spectral Centroid (Pitch brightness in Hz)          │
│  - Melodic Direction Trending (Asc / Desc / Arched)   │
└───────────────────────────┬────────────────────────────┘
                            │
              [Raw Audio Discarded Immediately]
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                AI PROVIDER ABSTRACTION                 │
│                   interface AIProvider                 │
│            ┌──────────────┴──────────────┐             │
│            ▼                             ▼             │
│   GemmaLocalProvider            GemmaCloudProvider     │
│   (On-device heuristic)         (Hosted Gemma-2 API)   │
└───────────────────────────┬────────────────────────────┘
                            │
               [Structured JSON Reasoning]
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│               PIANO EXERCISE GENERATION                │
│  - Target notes & fingering                            │
│  - Hand assignment (RH Melody / LH Bass Ostinato)      │
│  - Pedagogical explanation                             │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│          PHYSICAL MODELING PIANO SYNTHESIZER           │
│  - Additive synthesis (Harmonics 1..5)                 │
│  - Damper pedal simulation & low-latency scheduling    │
│  - Web MIDI hardware bridge                            │
└────────────────────────────────────────────────────────┘
```

---

## Component Layers

1. **Audio Feature Extractor (`src/components/pianist/touchgrass/audio/audioFeatureExtractor.ts`)**
   - Implements local browser-level FFT and peak transient extraction.
   - Computes RMS volume and spectral centroids to infer brightness and pitch direction.
   - Operates in strict ephemeral mode: stream tracks are stopped and unmounted after 3.5 seconds.

2. **AI Provider Abstraction (`src/components/pianist/touchgrass/ai/aiProvider.ts`)**
   - Decouples UI components from specific inference engines.
   - `GemmaLocalProvider`: Deterministic, offline edge reasoning engine.
   - `GemmaCloudProvider`: Production cloud interface for Gemma model servers.

3. **Touch Grass Studio (`src/components/pianist/touchgrass/TouchGrassStudio.tsx`)**
   - Orchestrates the state machine:
     `ready → outside-phone-away → what-did-you-hear → gemma-analyzing → bring-it-home → prove-it → completed`
   - Provides verified deterministic demo scenarios labeled `DEMO DATA`.

4. **Acoustic Piano Engine (`src/components/pianist/audio/pianoAudio.ts`)**
   - High-fidelity physical modeling using additive sine and triangle oscillators with exponential decay.
   - Integrates with the Web MIDI API (`navigator.requestMIDIAccess`).
