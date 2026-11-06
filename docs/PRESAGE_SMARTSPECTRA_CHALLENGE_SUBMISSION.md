# DR. T — PRESAGE SENSE: CAMERA-POWERED WELLNESS
## Presage SmartSpectra Challenge 2026 Submission Dossier

**Challenge:** [Presage SmartSpectra Challenge 2026](https://dev.to/challenges/presage-2026-11-04)  
**Parent Platform:** Dr. T — Multilingual Healthcare Companion  
**Parent Module:** Health Alert Mini (`#healthalert`)  
**Feature Route:** Presage Sense (`#presagesense` & inside Health Alert Mini mode switcher)  
**SmartSpectra SDK Package:** `@smartspectra/node-sdk` v3.4.0 (Pure-FFI C ABI Binding via `koffi`)  
**AI Reflection Engine:** Gemini 3.8 Flash (Multimodal Physiological Synthesis)  
**Security & Storage:** Google Cloud Platform, Firestore (`/presage_sense_sessions`), zero video storage  

---

## 1. Executive Summary & Problem Solved

Traditional vital signs and autonomic wellness tracking depend on wearable hardware (smartwatches, chest straps, pulse oximeters) that creates financial, hygienic, and convenience friction. For billions of users globally—including desk workers experiencing postural fatigue, runners monitoring recovery, or elders in low-resource clinics—wearables are frequently unavailable, uncharged, or forgotten.

**Presage Sense** solves this through **contactless, camera-powered physiological sensing** embedded directly within Dr. T's **Health Alert Mini** platform. Using facial photoplethysmography (rPPG), the system captures micro-variations in ambient light absorption caused by pulsatile arterial blood volume changes beneath facial capillary beds, delivering:

1. **Pulse Rate (BPM)** with dynamic confidence scoring and stability tracking.
2. **Breathing Cadence (RPM)** via autonomic respiratory-sinus modulation.
3. **Heart Rate Variability (HRV - RMSSD in ms)** for objective autonomic stress assessment.
4. **4-4-4 Box Breathing Visual Pacer** to guide users into parasympathetic resonance.
5. **Gemini 3.8 Flash Wellness Reflection** providing non-diagnostic lifestyle and mindfulness insights tailored to physiological readings and subjective mood.
6. **Seamless Health Alert Intake Bridge**: 1-click import of resting pulse into Dr. T's clinical triage workflow.

---

## 2. Technical Architecture & SDK Integration

### A. Pure-FFI C ABI Integration (`@smartspectra/node-sdk` v3.4.0)

Dr. T integrates official Presage SmartSpectra C ABI bindings natively on Linux x64:
- Package: `@smartspectra/node-sdk` (installed in `package.json`).
- C ABI Shared Library: `libsmartspectra_capi.so` loaded via native FFI (`koffi`).
- Stream Mode: `sdk.useCustomInput()` accepts raw RGB pixel arrays from browser camera frames via `/api/presage/process-frame`.
- Requested Metrics:
  - `pulseRate` (Cardio metric 15)
  - `arterialPressureTrace` (Cardio metric 16)
  - `hrv` (Cardio metric 17)
  - `breathingRate` (Breathing metric 0)
  - `upperTrace`, `lowerTrace`, `faceLandmarks`

### B. Client-Side Optical Sampling Pipeline (`src/components/presagesense/PresageSenseModule.tsx`)

1. **Explicit Camera Consent Gate**: Mandatory informed consent banner must be acknowledged before `navigator.mediaDevices.getUserMedia` is invoked.
2. **Offscreen Canvas Ingestion**: Samples video frames at 30 FPS into an offscreen 320x240 RGB canvas buffer.
3. **Region of Interest (ROI) Capillary Filtering**: Extracts spatial green-channel (λ ~ 525nm, hemoglobin absorption peak) luminance across forehead and facial skin.
4. **Live Plethysmogram Waveform Canvas**: Draws continuous optical rPPG wave with peak-interval detection and signal-to-noise ratio (SNR) computation.
5. **Server Streaming**: Periodically serializes frames to `/api/presage/process-frame` for server-authoritative SmartSpectra C ABI processing.

### C. Server Endpoints (`server.impl.ts` & `src/server/presageServerService.ts`)

| Endpoint | Method | Functionality |
| :--- | :--- | :--- |
| `/api/presage/status` | `GET` | Returns SDK installation, C ABI platform, requested metrics, and API key authentication status. |
| `/api/presage/process-frame` | `POST` | Ingests base64-encoded frame buffer, invokes `sdk.sendFrame()`, and returns metric/validation callbacks. |
| `/api/presage/wellness-insights` | `POST` | Invokes Gemini 3.8 Flash to synthesize physiological readings with subjective check-in under strict non-diagnostic safety guardrails. |

---

## 3. Privacy, Consent & Medical Safety Guardrails

- **Zero Video Storage**: Video frames are processed in-memory for optical pulse extraction and immediately released. No full-resolution videos or facial images are written to disk.
- **Explicit Consent & Revocation**: Users must grant consent before camera initialization and can revoke consent with 1 click at any time.
- **Isolated User Persistence**: Session metrics and subjective notes are stored in Firestore under `/presage_sense_sessions` with owner-isolated security rules (`isOwner(userId)`).
- **Mandatory Medical Disclaimer**: Every AI reflection and UI screen displays clear FDA/medical disclaimers stating that Presage Sense is an educational wellness screening tool and NOT a medical diagnostic device.
- **No Hallucinated Readings**: If ambient lighting is inadequate or face alignment is lost, the system flags the signal quality and pauses estimation rather than producing fabricated vitals.

---

## 4. Verification & Reproducibility

Automated test suite:
```bash
npm run test:presage
```

Test Results Summary:
- **Test 1 (Pure-FFI Exports)**: PASS — `SmartSpectraSDK`, `PixelFormat`, cardio metrics [15, 16, 17], breathing metrics [0..7] verified.
- **Test 2 (Server Service Diagnostics)**: PASS — Status `OPERATIONAL`, `linux-x64`, `v3.4.0`.
- **Test 3 (Frame Ingestion)**: PASS — Synthetic 320x240 RGB frame accepted by C ABI pipeline (`accepted: true`).
- **Test 4 (Gemini Wellness Reflection)**: PASS — Multi-sentence contextual reflection generated with mandatory non-diagnostic disclaimer.
- **Test 5 (Physiological Bounds)**: PASS — Pulse (40–220 BPM) and Breathing (6–45 RPM) boundaries strictly enforced.
