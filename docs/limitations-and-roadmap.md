# 🗺️ Clinical Boundaries, Limitations & Engineering Roadmap

**Project:** Dr. T Vision Alert  
**OpenCV AI Competition 2026 (Powered by AWS)**

---

## 1. Current Supported Scope

In accordance with responsible clinical software engineering principles, Dr. T Vision Alert explicitly limits its scope to validated devices and states:

* **Supported Device Modalities:**
  * Digital Upper-Arm Blood Pressure Monitors (Oscillometric LCD screens displaying Systolic, Diastolic, and Pulse Rate).
  * Fingertip Pulse Oximeters (OLED / LED dual displays showing $SpO_2$ percentage and Heart Rate).
* **Unsupported Modalities (Explicitly Labeled):**
  * Continuous Glucose Monitors (CGM graphs).
  * 12-lead ECG strips and rhythm printouts.
  * Analog mercury sphygmomanometer dial gauges.
  * Digital thermometer LCDs (planned for Phase 2).
  * Multi-parameter bedside ICU telemetry displays.

Attempts to scan unsupported device modalities gracefully return `UNKNOWN` device status with clear guidance encouraging manual entry.

---

## 2. Known Technical Limitations & Mitigations

| Limitation | Impact | Architectural Mitigation |
|---|---|---|
| **Curved & Non-Planar Displays** | Severe fisheye or cylindrical distortion impairs affine rectification. | Rejection threshold on quadrilateral aspect ratio; user prompt to frame perpendicular to screen. |
| **Ultra-Low Ambient Light** | Poor signal-to-noise ratio in camera sensor. | RMS contrast check ($C_{\text{RMS}} < 14.0$) flags inadequate lighting before OCR. |
| **Segment LCD Ghosting** | Unlit 7-segment traces appearing faint in bright backlight. | Morphological opening and adaptive Otsu binarization in COOL pipeline. |
| **Missing Cloud Connectivity** | Mobile user in rural area with no cellular service. | Client-side OpenCV pipeline fallback executes locally in browser WebAssembly without sending bytes over the wire. |

---

## 3. Commercial & Clinical Roadmap

### Phase 2: Q3 2026
* **Expansion of Device Library:** Support for digital thermometry and blood glucose meters with standardized unit conversions ($\text{mg/dL} \leftrightarrow \text{mmol/L}$).
* **Hardware-Accelerated On-Device Cool:** WebAssembly SIMD build leveraging browser-level WebGPU / WebNN for offline zero-latency edge inference on low-power mobile devices.

### Phase 3: Q4 2026
* **FDA 510(k) Pre-Market Submission Guidance:** Formal software validation according to IEC 62304 (Medical device software lifecycle) and ISO 14971 (Risk management).
* **EHR Integration via SMART on FHIR:** Direct bi-directional synchronization with Epic Systems, Cerner / Oracle Health, and Athenahealth with full provenance auditing.

---

## 4. Clinical Governance & Human-in-the-Loop Policy
Under no circumstances will automated model confidence or high-scoring OCR readings bypass the **Human Confirmation Gate**. Transcribed measurements remain in a provisional state until validated by a human operator, preserving clinical accountability and patient safety.
