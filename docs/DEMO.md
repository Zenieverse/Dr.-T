# 60-Second Music Walk — Signature Demo Guide

The **60-Second Music Walk** is the flagship signature demo of **PIANIST — Touch Grass**.

---

## 🌐 Live Experience
* **Live App**: [https://ais-pre-4s4jvpipr3mh3mz6x2hpfp-393352619239.asia-southeast1.run.app](https://ais-pre-4s4jvpipr3mh3mz6x2hpfp-393352619239.asia-southeast1.run.app)
* **Direct Navigation**: Select **🌿 Touch Grass** in the top navigation bar.
* **Evidence & Screenshots**: See [`docs/evidence/README.md`](evidence/README.md) for screenshot specifications and demo audit notes.

---

## 🎯 Demo Walkthrough Steps

### 1. Launch Mission
- Navigate to **PIANIST** → **🌿 Touch Grass**.
- Click the primary CTA: **START OUTDOOR MISSION (60s WALK)**.

### 2. The Physical Step: "Put Your Phone Away"
- The screen transitions to a clean, non-distracting screen displaying:
  > **PUT YOUR PHONE AWAY.**
  > *Eyes up. Safe footing. Listen.*
- A 60-second countdown runs while encouraging the learner to step outside, walk, or listen to their immediate acoustic surroundings.
- *(For rapid indoor evaluation, click "I'm Back (Skip Countdown)".)*

### 3. Return & Reflection: "What Did You Hear?"
- When the timer concludes, the learner returns to the screen.
- The app asks: **What did you hear?**
- Three capture pathways are available:
  1. **Record 3s Outdoor Sample**: Uses your device's microphone for local acoustic feature extraction.
  2. **Rhythm Tap Pad**: Tap the stride, footsteps, or periodic pattern you heard to calculate BPM.
  3. **Verified Demo Scenarios (Labeled `DEMO DATA`)**:
     - *Gravel Footsteps*: Duple pulse at 96 BPM.
     - *Morning Robin*: Arched melodic contour at 112 BPM.
     - *Raindrops on Leaves*: Broken triad ostinato at 84 BPM.
     - *Flowing Brook*: Pentatonic improvisation seed at 78 BPM.

### 4. Acoustic Interpretation & Structured Reasoning
- The captured audio features are analyzed by the active reasoning engine (`LocalHeuristicProvider` or `GemmaCloudProvider`).
- The engine outputs a structured reasoning payload conforming to the musical schema:
  ```json
  {
    "sound_type": "environmental_footstep_pulse",
    "source_category": "Footsteps / Walking",
    "pulse_detected": true,
    "tempo_estimate": 96,
    "pattern": "steady duple stride",
    "melodic_contour": "static",
    "confidence": 0.91,
    "recommended_skill": "rhythm",
    "exercise": {
      "title": "Footstep Walking Bass Anchor",
      "type": "ostinato_accompaniment",
      "difficulty": 1,
      "targetNotes": ["C3", "G3", "A3", "F3"],
      "suggestedHand": "LH"
    }
  }
  ```

### 5. Bring It Home & Play on the Piano
- Click **Audition Target Notes** to hear the generated phrase.
- Target notes light up on the interactive piano below.
- Play the keys with mouse, touch, or computer keyboard (`A-S-D-F-G-H-J-K`).

### 6. Prove It & Emotional Conclusion
- Click **I Have Played It on the Piano (Prove It)**.
- Confetti fires with the milestone conclusion:
  > **You heard it. Now play it.**
  > *"You didn't memorize this. You discovered it."*
- Awards **+75 Outdoor XP** and updates the **Active Listening** score in your Musician Passport.
