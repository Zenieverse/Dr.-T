# 🛡️ Privacy, Clinical Safety & Data Minimization

**Project:** Dr. T Vision Alert  
**OpenCV AI Competition 2026 (Powered by AWS)**

---

## 1. Core Safety Principles

Dr. T Vision Alert is built around three non-negotiable safety principles:

1. **Human Confirmation Gate (Zero Autonomous Import):**  
   Machine-extracted values are *never* autonomously committed to a patient's health record or triage form. A human user must review the bounding box, compare the extracted digits with the monitor display, edit any ambiguities, and explicitly check the confirmation box.

2. **Deterministic Emergency Escalation Isolation:**  
   When confirmed readings cross critical physiological boundaries (such as a Systolic blood pressure $\ge 180\text{ mmHg}$ or Diastolic $\ge 120\text{ mmHg}$), the deterministic rule engine immediately escalates the case to `EMERGENT_ESCALATION` (`CALL_911_NOW`). Probabilistic AI (e.g. Gemini) is *never* in the execution path of emergency triage and cannot override, delay, or soften an emergency warning.

3. **Data Minimization & Ephemeral Image Processing:**  
   Photographs of medical devices frequently contain accidental background details (faces, prescription pill bottles, family photos, room interiors). Dr. T implements a strict **zero-permanent-retention policy**. Images are processed in-memory. In cloud deployments, any diagnostic telemetry stored in Amazon S3 is permanently purged within 24 hours via automated lifecycle rules.

---

## 2. Provenance Architecture (FHIR R4 Alignment)

Every vital sign imported via Dr. T Vision Alert carries strict provenance metadata reflecting its origin:

| Provenance Level | Description | FHIR R4 Provenance / Extension |
|---|---|---|
| `MACHINE_EXTRACTED` | Number recognized by OpenCV 5 / OCR pipeline and verified unedited by user. | `http://dr-t.health/fhir/StructureDefinition/provenance#machine-extracted` |
| `USER_CORRECTED` | Number was recognized by machine, but adjusted by the user prior to confirmation. | `http://dr-t.health/fhir/StructureDefinition/provenance#user-corrected` |
| `MANUALLY_ENTERED` | User bypassed image scanning and entered the vitals directly into the form. | `http://dr-t.health/fhir/StructureDefinition/provenance#manual-entry` |

In the generated SBAR clinician brief, these distinctions are explicitly rendered to prevent clinicians from assuming an automated extraction was laboratory-certified.

---

## 3. Epistemic Uncertainty & Plausibility Bounds

Extracted values must pass physiological bounds checking before they are even presented for confirmation:

* **Systolic Blood Pressure:** $60 \le \text{SYS} \le 260\text{ mmHg}$
* **Diastolic Blood Pressure:** $40 \le \text{DIA} \le 160\text{ mmHg}$
* **Resting Heart Rate:** $35 \le \text{HR} \le 230\text{ bpm}$
* **Pulse Oximetry ($SpO_2$):** $65\% \le SpO_2 \le 100\%$

Any value outside these limits (e.g., an OCR artifact reading $320\text{ mmHg}$ or $110\%$) is flagged as implausible and blocked from selection.

---

## 4. Non-Diagnostic Disclaimer

> **DISCLAIMER:** Dr. T Vision Alert is an assistive visual transcription and triage navigation tool. It is NOT an FDA-cleared diagnostic medical device. It does not measure vitals independently; it transcribes readings displayed on certified third-party monitors with human oversight. For acute, sudden, or life-threatening symptoms, users must contact emergency medical services (911 in US/Canada, 115 in Vietnam, 112 in Europe) immediately.
