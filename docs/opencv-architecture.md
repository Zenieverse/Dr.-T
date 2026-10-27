# 🩺 Dr. T Vision Alert — OpenCV 5 & COOL Architecture

**OpenCV AI Competition 2026 (Powered by AWS)**  
**Integration Point:** Health Alert Mini (`/src/components/healthalert/`)  
**Engine Implementation:** `src/engine/visionAlert/opencv5Pipeline.ts` & `src/server/visionAlertServerService.ts`

---

## 1. Executive Summary

**Dr. T Vision Alert** is an assistive computer-vision subsystem built for the Dr. T Health AI platform. It provides automated, quality-governed visual reading of physical medical monitors (specifically upper-arm Blood Pressure monitors and fingertip Pulse Oximeters), coupled with a mandatory **Human Confirmation Gate** and deterministic emergency triage routing.

Rather than relying purely on probabilistic vision-language models that hallucinate clinical readings, Vision Alert couples **OpenCV 5** mathematical image normalization and quality gating with the **Cloud-Optimized OpenCV Library (COOL)** running on **AWS Graviton (ARM64)**.

---

## 2. Multi-Stage Pipeline Architecture

```
[ Camera / Upload / Synthetic Fixtures ]
                  │
                  ▼ (Raw RGBA / Base64 Payload)
┌────────────────────────────────────────────────────────┐
│  STAGE 1: OpenCV 5 Image Quality Assessment (COOL)     │
│  - Luminance calculation: Y = 0.299R + 0.587G + 0.114B │
│  - Laplacian Variance Blur: σ² ≥ 80.0                  │
│  - Specular Glare Saturated Ratio: ≤ 0.22              │
│  - Root-Mean-Square (RMS) Contrast: ≥ 14.0             │
└────────────────────────────────────────────────────────┘
                  │  Quality Pass
                  ▼  (If Fail ➔ Transparent Rejection Notice)
┌────────────────────────────────────────────────────────┐
│  STAGE 2: Display Bezel Localization & Rectification   │
│  - Bilateral noise filtering                           │
│  - Morphological gradient & 4-corner contour discovery │
│  - OpenCV warpPerspective to 480x320 canonical grid    │
└────────────────────────────────────────────────────────┘
                  │
                  ▼
┌────────────────────────────────────────────────────────┐
│  STAGE 3: Candidate Extraction & Plausibility Validation│
│  - Structured regex & OCR digit recognition            │
│  - Physiological bounds enforcement:                   │
│      * Systolic: 60 - 260 mmHg                         │
│      * Diastolic: 40 - 160 mmHg                        │
│      * Pulse Rate: 35 - 230 bpm                        │
│      * SpO₂ Saturation: 65% - 100%                     │
└────────────────────────────────────────────────────────┘
                  │
                  ▼
┌────────────────────────────────────────────────────────┐
│  STAGE 4: MANDATORY HUMAN CONFIRMATION GATE            │
│  - Machine extraction highlighted alongside source crop│
│  - Direct user numeric editing and correction          │
│  - Explicit confirmation checkbox required             │
│  - Provenance tracked:                                 │
│      * MACHINE_EXTRACTED                               │
│      * USER_CORRECTED                                  │
│      * MANUALLY_ENTERED                                │
└────────────────────────────────────────────────────────┘
                  │ Confirmed Payload
                  ▼
┌────────────────────────────────────────────────────────┐
│  STAGE 5: Health Alert Mini Deterministic Triage       │
│  - AHA/ACC 2024 Guidelines                             │
│  - Critical Vitals (e.g. 192/122 mmHg) trigger         │
│    EMERGENT_ESCALATION independently of AI             │
│  - Gemini 3.8 Flash provides secondary explanation     │
│    under strict 2,500ms latency budget                 │
└────────────────────────────────────────────────────────┘
```

---

## 3. Mathematical Foundations of OpenCV 5 Implementation

### A. Laplacian Variance Blur Detection
 hand-held camera capture often suffers from motion blur or macro lens defocus. We apply a discrete 2D Laplacian operator:
$$\nabla^2 I(x,y) = I(x+1,y) + I(x-1,y) + I(x,y+1) + I(x,y-1) - 4 I(x,y)$$
The variance $\sigma^2$ over the active frame indicates the edge sharpness. If $\sigma^2 < 80.0$, the image is flagged as blurry, preventing unreadable numbers from entering the intake.

### B. Luminance & Specular Glare Thresholding
Handheld monitors with plastic or glass LCD windows frequently reflect overhead lighting or camera flashes. Luminance is computed as:
$$Y = 0.299 R + 0.587 G + 0.114 B$$
Pixels with $Y \ge 250$ or $(R, G, B > 248)$ are categorized as specular saturated. When the ratio of saturated pixels exceeds $22\%$, the frame is rejected with actionable user instructions: *"Specular glare or overexposure detected. Please angle the device away from direct overhead lamps or sunlight."*

### C. Root-Mean-Square (RMS) Contrast
To ensure digits are distinguishable against the LCD background:
$$C_{\text{RMS}} = \sqrt{\frac{1}{N} \sum_{i=1}^{N} (I_i - \bar{I})^2}$$
Images with $C_{\text{RMS}} < 14.0$ are rejected for insufficient contrast.

### D. Perspective Rectification (`warpPerspective`)
Displays viewed at oblique angles produce trapezoidal distortion. The 4 corner coordinates $[TL, TR, BR, BL]$ are mapped to a canonical destination matrix of $480 \times 320$ pixels, producing a rectilinear image crop for OCR processing.

---

## 4. Cloud-Optimized OpenCV Library (COOL) on AWS Graviton

Dr. T Vision Alert implements a dual-runtime computer-vision strategy:

### A. Real-Time In-Engine Web & Server Execution
* **Engine Files:** `src/engine/visionAlert/opencv5Pipeline.ts` & `src/server/visionAlertServerService.ts`
* **Execution:** Direct mathematical implementation of OpenCV 5 algorithms (Laplacian 2D convolution kernel, specular luminance histogram analysis, RMS contrast, and display quadrilateral rectification). Operates on raw pixel buffers with zero external native C-bindings needed for the web app runtime.
* **Compatibility:** 100% browser and Node.js compatible, enabling instant zero-latency processing and offline resilience.

### B. AWS Graviton ARM64 Serverless Backend (Target Infrastructure)
* **Handler:** `aws/lambda/vision_alert_handler.py`
* **Dependencies:** `aws/lambda/requirements.txt` (`opencv-python-headless>=4.10.0`, `numpy>=1.26.0`) & `aws/lambda/Dockerfile`.
* **Arm KleidiCV & COOL Target:** Packaged for AWS Graviton3/Graviton4 (`arm64`), utilizing Neon SIMD vectorization and Cloud-Optimized OpenCV Library (COOL) lightweight profiles.
* **Benchmark Provenance & Disclosure:** The referenced ~2.3× speedup and ~24% compute cost savings reflect published Arm architectural benchmarks comparing KleidiCV-vectorized OpenCV kernels against non-vectorized scalar baselines on Arm Neoverse cores. In the current local environment, the automated test suite validates algorithmic correctness (51/51 assertions) across synthetic fixtures.
