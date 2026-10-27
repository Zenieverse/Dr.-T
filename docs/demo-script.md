# 🎬 Dr. T Vision Alert — Video Demonstration Script

**Competition:** OpenCV AI Competition 2026 (Powered by AWS)  
**Target Video Duration:** 3 to 4.5 minutes (Strictly under 5 minutes)  
**Format:** Screen recording + voiceover with live browser interaction

---

## Timecode & Scene Breakdown

### [0:00 – 0:40] Introduction & The Problem
* **Visual:** Open Dr. T platform in browser (`http://localhost:3000`). Navigate to **Health Alert Mini**.
* **Audio / Script:**  
  *"Hello! This is Dr. T Vision Alert, our submission for the OpenCV AI Competition 2026, powered by AWS.  
  Millions of patients monitor chronic hypertension and cardiovascular conditions at home. But reading small, low-contrast LCD screens on blood pressure monitors and pulse oximeters is prone to transcription errors—especially for elderly patients or someone experiencing an acute migraine or dizziness.  
  Generic AI models hallucinate when presented with reflections or glare. We built Vision Alert to provide mathematically rigorous computer vision using OpenCV 5 and AWS Graviton, backed by a non-negotiable Human Confirmation Gate and deterministic emergency triage."*

---

### [0:40 – 1:30] Live Computer Vision Pipeline (OpenCV 5 & COOL)
* **Visual:** Click on the **Vision Alert (OpenCV 5 + AWS)** mode tab. Show the quality indicator meters (Sharpness, Glare, Contrast, Latency). Select the **Stage 1 HTN (Omron BP 138/88)** synthetic preset.
* **Audio / Script:**  
  *"Here in the Vision Alert module, users can capture a reading using their device camera, upload an image file, or test using mathematically verified synthetic fixtures.  
  When an image is processed, our OpenCV 5 pipeline executes the mathematical quality gating algorithms.  
  First, it evaluates image quality using Laplacian variance for blur detection ($\sigma^2 \ge 80$), specular luminance histogram analysis for glare, and RMS contrast.  
  Second, it localizes the LCD bezel contours and performs perspective rectification with `warpPerspective` into a standardized coordinate space.  
  Third, it extracts the physiological parameters while enforcing strict plausibility bounds—ensuring Systolic, Diastolic, and Pulse values are clinically plausible."*

---

### [1:30 – 2:20] The Mandatory Human Confirmation Gate
* **Visual:** Point to the **Candidate Values & Human Confirmation Gate** panel. Edit Systolic value from 138 to 136 to demonstrate manual correction. Click the confirmation checkbox.
* **Audio / Script:**  
  *"Crucially, machine-extracted numbers NEVER enter a patient's health record automatically.  
  Notice the Human Confirmation Gate. Vision Alert highlights each candidate alongside the source crop. The patient can verify each number, make adjustments if needed, or enter values manually.  
  When I adjust this reading, the provenance updates from `MACHINE_EXTRACTED` to `USER_CORRECTED`.  
  Only when I explicitly check the verification box and click 'Confirm & Import into Health Alert' do these vitals flow into the intake workflow."*

---

### [2:20 – 3:15] Deterministic Emergency Triage & Failure Rejection
* **Visual:** Select the **Critical Crisis (192/122 mmHg)** preset. Confirm and import. Show the immediate red-flag escalation banner (`CALL_911_NOW`). Next, click the **Glare / Blur Rejection** preset to show the rejection notice and safe manual entry fallback.
* **Audio / Script:**  
  *"Now let's test a life-threatening scenario: a Hypertensive Crisis with a reading of 192 over 122 mmHg.  
  As soon as this reading is confirmed, our deterministic safety engine immediately escalates the case to `EMERGENT_ESCALATION`. Notice this happens instantly and deterministically: probabilistic AI cannot override, delay, or soften life-saving emergency advice.  
  Next, notice what happens when an unreadable image is presented: selecting the Glare Rejection preset instantly rejects the frame, explaining that specular glare occludes the LCD and instructing the user on how to angle the device, with a safe manual entry fallback."*

---

### [3:15 – 4:00] AWS Graviton Architecture & Ephemeral Privacy
* **Visual:** Display `aws/cloudformation/vision-alert-stack.yaml` and `aws/lambda/vision_alert_handler.py`. Run `npx tsx scripts/test-vision-alert.ts` in terminal showing 51/51 tests passing.
* **Audio / Script:**  
  *"For production cloud deployment, Vision Alert includes an AWS serverless architecture defined in both CloudFormation and Terraform. The Lambda handler runs on AWS Graviton3/4 ARM64 with opencv-python-headless.  
  For patient privacy, our S3 quarantine bucket enforces an automated 1-day lifecycle purge rule—ensuring zero permanent retention of private monitor photographs.  
  All 51 automated assertions pass across our OpenCV algorithms, clinical safety invariants, and AWS infrastructure.  
  Thank you for reviewing Dr. T Vision Alert!"*

---

## 2. Quick Screen Recording Checklist (For Participant)

1. **Tool:** Use OBS Studio, Loom, or QuickTime Screen Recording at 1080p resolution.
2. **Audio:** Connect a clear microphone or headset to narrate the script above.
3. **Sequence:**
   * Tab 1: Browser open at `http://localhost:3000` (navigate to Health Alert ➔ Vision Alert).
   * Tab 2: Code editor showing `aws/cloudformation/vision-alert-stack.yaml` and `aws/lambda/vision_alert_handler.py`.
   * Terminal: Run `npx tsx scripts/test-vision-alert.ts` to show 51/51 tests passing.
4. **Duration:** Keep the total recording between 3 and 4.5 minutes (strictly < 5 minutes).
5. **Upload:** Upload as **Unlisted** on YouTube or Vimeo, and paste the URL into the Devpost submission form.
