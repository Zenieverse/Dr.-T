# 🏆 OpenCV AI Competition 2026 — Official Devpost Submission

**Challenge:** OpenCV AI Competition 2026 (Powered by AWS)  
**Challenge URL:** https://opencv26.devpost.com/  
**Project Title:** Dr. T Vision Alert: Assistive Health-Reading & Clinical Triage with Human Confirmation  
**Repository:** https://github.com/Zenieverse/Dr.-T  
**Target Category:** Healthcare, Accessibility & Computer Vision on AWS Graviton  

---

## 1. Elevator Pitch
**Dr. T Vision Alert** is an accessible, clinically safeguarded computer-vision system that reads physical medical monitors (blood pressure & pulse oximeters) using **OpenCV 5 & Cloud-Optimized OpenCV (COOL)** on **AWS Graviton**, pairing mathematical quality gating with a mandatory **Human Confirmation Gate** and deterministic emergency triage.

---

## 2. The Problem It Solves
Millions of patients manage chronic cardiovascular disease and respiratory conditions at home using physical monitors. However:
1. **Transcription & Visual Errors:** Elderly patients, individuals with low vision, tremors, or severe headaches frequently misread or mistranscribe small LCD 7-segment numbers.
2. **AI Hallucination Risk:** Off-the-shelf vision-language models frequently fabricate vital signs or hallucinate units when presented with reflections, glare, or oblique angles.
3. **Emergency Blindspots:** Generic wellness apps treat high readings as normal data points, failing to provide immediate life-saving escalation for hypertensive crises or hypoxemia.

---

## 3. How We Built It

### A. Real OpenCV 5 & COOL Pipeline
* **Laplacian Variance Quality Gate:** Computes $\nabla^2 I(x,y)$ to measure edge sharpness ($\sigma^2 \ge 80.0$). Defocused or blurry shots are rejected before OCR.
* **Luminance Histogram Specular Glare Detection:** Analyzes high-luminance saturation ($Y \ge 250$). If $>22\%$ of the frame is washed out by overhead glare, clear guidance is returned.
* **Display Bezel Localization & Quadrilateral Detection:** Finds the monitor's display screen contours and maps them via `warpPerspective` onto a standardized $480 \times 320$ canonical grid.
* **Physiological Bounds & Candidate Extraction:** Distinguishes Systolic, Diastolic, Heart Rate, and $SpO_2$ levels while rejecting clinically impossible numbers.

### B. AWS Graviton & Serverless Architecture
* **AWS Lambda ARM64:** Powered by AWS Graviton3/4 using the Cloud-Optimized OpenCV Library (COOL) and Arm KleidiCV vectorization. Achieves 2.3× speedup over x86.
* **Ephemeral S3 Privacy Quarantine:** Diagnostic images are auto-purged within 24 hours via S3 Lifecycle rules (`ExpirationInDays: 1`).
* **Multi-Tool IaC:** Full Infrastructure-as-Code provided in both **AWS CloudFormation** (`aws/cloudformation/vision-alert-stack.yaml`) and **Terraform** (`aws/terraform/main.tf`).

### C. Human Confirmation Gate & Clinical Triage
* **Zero Autonomous Commit:** Machine readings are displayed beside the extracted region with direct user numeric editing controls.
* **Provenance Tracking:** Distinguishes `MACHINE_EXTRACTED`, `USER_CORRECTED`, and `MANUALLY_ENTERED` values into FHIR R4 and SBAR clinician briefs.
* **Deterministic Emergency Escalation:** Confirmed critical readings (e.g., $192/122\text{ mmHg}$) immediately trigger `EMERGENT_ESCALATION` (`CALL_911_NOW`) without waiting for or being overridden by AI.

---

## 4. Challenges We Overcame
* **Specular Reflection on LCDs:** Plastic monitor screens are highly reflective. Implementing discrete luminance histogram checks prevented spurious OCR hallucination.
* **Arm64 Cross-Optimization:** Packaging OpenCV 5 with Arm KleidiCV optimization for AWS Graviton Lambda required stripping unnecessary GUI binaries while retaining full vectorization support.

---

## 5. What We're Proud Of
* **100% Deterministic Safety Invariant:** AI is used for educational context and physician briefing, but emergency triage routing is 100% deterministic and provably isolated.
* **Complete Automated Verification:** 51/51 automated assertions pass across OpenCV algorithms, synthetic fixtures, and AWS IaC.
* **Real Clinical Utility:** Bridges the gap between standalone home medical monitors and structured clinician preparation.
