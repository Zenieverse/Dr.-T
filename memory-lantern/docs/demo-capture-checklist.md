# 🎬 2-Minute Judge Demonstration Flow & Video Recording Checklist

This checklist provides a reproducible, step-by-step walkthrough for evaluating **Memory Lantern — Stories That Stay** during the DEV Hacktoberfest Week 4 judging period.

---

## ⏱️ Video Script (Target: 120 Seconds)

### [00:00 - 00:20] Introduction & The "Ghost in the Machine" Theme
1. Navigate to `http://localhost:3000` (or the deployed preview URL).
2. Click the **Memory Lantern** tab (glowing amber flame icon in the top navigation).
3. **Voiceover / Caption**:
   > *"Welcome to Memory Lantern — Stories That Stay, built for DEV Hacktoberfest 2026 Week 4. In response to the 'Ghost in the Machine' theme, we rejected the uncanny idea of building synthetic AI replicas of deceased people. Instead, we built a digital sanctuary where open-weight Gemma AI acts as a gentle lantern bearer—organizing real family memories, recipes, and traditions into editable living narratives."*

### [00:20 - 00:45] Exploring the Lantern Garden & Fictional Samples
1. Scroll through the **Lantern Garden**:
   - Highlight *"Grandmother Elena's Lemon Verbena Tea"* (Tradition).
   - Highlight *"Uncle Marco's Cedar Woodworking Shop"* (Wisdom).
   - Highlight *"The Floating Lanterns of Thu Bon River"* (Remembrance).
2. Note the clear **"Fictional Sample"** badges and the category filters (*Remembrance*, *Tradition*, *Everyday Joy*).
3. Click the **"+ Select"** button on two memories.

### [00:45 - 01:15] Open-Weight Gemma Narrative Generation
1. Click **"Lantern Stories (Gemma AI)"** in the top action ribbon.
2. Show the **Inference Engine status strip** displaying the open-weight Gemma model (`gemma2:2b` or `gemma-2-9b-it`).
3. Select the mode: **"Voices & Traditions"** and style: **"Warm & Simple"**.
4. Click **"Generate Lantern Story"** (or **"Run Verification Fixture"**).
5. Highlight the key outputs:
   - Generation latency and provider badge.
   - **Supplied Facts Honored**: Elena's 7-minute verbena recipe, Marco's red cedar woodcraft proverb.
   - **Narrative Enhancements**: The connective prose added for readability.
   - **Ethical Safeguard**: The notice confirming no impersonation or synthetic quotes.

### [01:15 - 01:35] Editing, Saving & Chronicle Timeline
1. Edit the generated draft directly in the text area (e.g., customize the closing sentence).
2. Click **"Save as Lantern"** — show the toast notification and the newly placed lantern card glowing in the garden.
3. Switch to the **Chronicle Timeline** sub-tab to demonstrate chronological ordering across decades (1982 ➔ 1994 ➔ 2005).

### [01:35 - 02:00] Printable Tribute & Privacy Sanctuary
1. Click **"Read Lantern"** on any card to open the **Remembrance Reading Mode**.
2. Show the clean typography, traditions list, and the one-click **Print** / **Copy** buttons.
3. Switch to the **Sanctuary & Privacy** sub-tab:
   - Point out the user-isolated storage policy (Firestore rules for signed-in users, isolated local sandbox for guests).
   - Click **"Export Archive (JSON)"** and **"Export Storybook (Markdown)"** to demonstrate full data portability.
   - Point out the **"Permanently Delete All Memories"** safety control.

---

## 📋 Evaluation Checklist for Judges

- [x] **New Original Project**: Built specifically for Hacktoberfest Week 4 (October 26–31, 2026).
- [x] **Meaningful Open AI**: Open-weight Gemma 2 model handles real narrative synthesis via local Ollama or hosted inference.
- [x] **Ethical Guardrails**: Strictly forbids deceased persona impersonation and hallucinated facts.
- [x] **Real Data Controls**: Instant CRUD, search, category filtering, JSON/Markdown export, and permanent deletion.
- [x] **Non-Regressive Integration**: Existing Dr. T modules (HealthAlert Companion, MicroBiz, Pianist) remain 100% operational.
