# 🎩 Three Hats — Professional, Personal & Social

## Role-Mapping, Reflection & Life-Balance Commons

> “One person. Three hats. Many roles. One life to balance.”

---

## 1. Overview & Philosophy

Modern life fragments attention across competing expectations. In typical productivity applications, people are reduced to task lists or single professional titles. **Three Hats** rejects this reductionism, recognizing that every individual wears three core hats:

1. **Professional Hat**: How I contribute, work, learn, lead, and build.
   * *Typical categories:* Work and contribution, Learning and growth, Responsibility and stewardship.
2. **Personal Hat**: How I care for myself, manage private life, grow, and maintain close relationships.
   * *Typical categories:* Self and wellbeing, Family and close relationships (optional), Personal development.
3. **Social Hat**: How I relate to others, participate in society, build community, and contribute beyond private life.
   * *Typical categories:* Relationships and belonging, Contribution and leadership, Culture and shared knowledge.

### Multi-Hat Roles
Roles are not artificially boxed into single silos. An engineer mentoring a junior student occupies both **Professional** and **Social** hats. A **Lifelong Learner** spans both **Professional** and **Personal** growth. Three Hats provides first-class support for multi-hat assignments.

---

## 2. 3-Perspective Balance Model

Unlike systems that calculate an arbitrary single composite score or demand equal 33.3% splits, Three Hats separates three distinct perspectives rated on an independent 1–5 scale:

1. **Importance**: *How much does this area genuinely matter to me right now?*
2. **Recorded Attention**: *How much actual time, energy, and presence has this area received?*
3. **Satisfaction**: *How content am I with how this area is functioning in my life?*

This allows users to observe attention gaps (e.g. Personal Hat is 5/5 Importance, but only 2/5 Recorded Attention) with curiosity and self-compassion, rather than moral failure or shame.

---

## 3. The 6-Step Weekly Ritual

A 5-minute guided weekly reflection following a compassionate structure:

1. **Step 1 — Recognize:** What felt meaningful this week?
2. **Step 2 — Review:** Which roles received the attention intended for them?
3. **Step 3 — Notice:** Where did you experience conflicts between roles, time, energy, or expectations?
4. **Step 4 — Appreciate:** What went well, including something small?
5. **Step 5 — Choose:** What is one realistic, bounded adjustment for next week?
6. **Step 6 — Commit:** Select up to three concrete next actions for the coming week.

---

## 4. Privacy, Security & Data Isolation

### User Isolation in Firestore
All Three Hats documents are isolated in Firestore with strict rules:
* `three_hats_roles/{roleId}`: Read, update, and delete access strictly restricted to `request.auth.uid == resource.data.userId`.
* `three_hats_commitments/{commitmentId}`: Scoped strictly to authenticated owner.
* `three_hats_reflections/{reflectionId}`: Scoped strictly to authenticated owner.

### Offline & Demo Resilience
When unauthenticated, Three Hats automatically uses user-scoped local storage (`dr_t_three_hats_*`), syncing seamlessly to Cloud Firestore when the user signs in with Google Authentication.

### Explicit Permission for Memory Storage
Reflections are never automatically harvested or shared. Saving a reflection into **Lantern Keeper (Memory Sanctuary)** requires an explicit user button click with a visual confirmation dialog.

### AI Companion Guardrails
The **Three Hats Companion AI** reflects strictly from user-provided role names, stated commitments, and weekly ritual inputs:
* Never offers medical or psychiatric diagnoses.
* Never issues moral judgments or unsolicited advice.
* Always cites exact user inputs.
* Suggestions are fully editable and can be adopted into Commitments with one click.

---

## 5. Verification & Testing

Three Hats includes an automated regression test suite in `scripts/test-three-hats.ts`:
* **Test Group 1:** The Three Hats Framework Invariants (Themes, definitions, typical categories)
* **Test Group 2:** Curated Roles Library & Multi-Hat Support (17 starter roles, multi-hat detection)
* **Test Group 3:** 3-Perspective Balance Model Invariants (Independent 1–5 scaling)
* **Test Group 4:** 6-Step Weekly Ritual Flow (Step 1 to 6 data integrity)
* **Test Group 5:** Life Balance Export Engine (JSON and Markdown exports)
* **Test Group 6:** Three Hats Companion AI Reflection (Citation verification and permission gate)

Run tests via:
```bash
npm run test:threehats
# or full test suite
npm test
```
