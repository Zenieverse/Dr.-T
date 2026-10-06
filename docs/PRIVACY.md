# Privacy Constitution — PIANIST Touch Grass

## Core Privacy Statement

**PIANIST — Touch Grass** is built with privacy as an architectural pillar, not an afterthought. The platform is designed so learners can take music learning outside without compromising their personal or acoustic privacy.

---

## 🎙️ Audio Processing Lifecycle

1. **Explicit Consent**: Microphone access is only requested upon direct user action (clicking "Record 3s Outdoor Sample").
2. **Ephemeral Buffer**: The audio stream is captured for a fixed 3.5-second window inside an isolated browser-level `AudioContext`.
3. **Local Feature Extraction**: The Web Audio API `AnalyserNode` computes acoustic features (RMS energy, spectral centroid, onsets).
4. **Immediate Deletion**: Raw PCM audio data and MediaStream tracks are **immediately terminated and deleted from memory**.
5. **No Telemetry / No Upload**: Raw audio recordings are never sent to external servers or logged in telemetry databases.

---

## 📍 Location & Geospatial Privacy

- Touch Grass **does not record or store persistent GPS coordinates**.
- Sound maps utilize only coarse, temporary descriptive tags entered by the user (e.g. "Footsteps", "Park Bench", "Distant Highway").
- Missions can be fully completed without granting device geolocation permissions.

---

## 🔒 Summary Table

| Data Type | Processed | Stored | Transmitted |
| --------- | --------- | ------ | ----------- |
| Raw Audio | In-Memory (3.5s) | No | No |
| Audio Features (BPM, Centroid) | Local Client | Local Storage (Optional) | Gemma Payload |
| GPS Coordinates | None | None | None |
| Piano Performance Events | Local Client | Local Storage | No |
