# 3-Minute Demo Script — Dr. T CareCue G2

**Pitch:** *Telegram, without looking down.* Safe, glanceable Telegram triage on Even Realities G2 smart glasses with server-side AI summaries, AI reply drafts, and mandatory wearer confirmation before send.

---

### `0:00 – 0:30` | The Problem & CareCue Concept
- **Visual:** Show `http://localhost:3000/?tab=carecue-g2` showing the live `576 × 288` monochrome G2 optical HUD on **`01. Home`**.
- **Narration:** "Checking urgent Telegram chats during clinical shifts, transit, or hands-busy work forces people to pull out their phone and break focus. **Dr. T CareCue G2** brings calm, monochrome `576 × 288` Telegram triage directly into Even Realities G2 glasses — controlled by R1 ring swipes and temple taps, with zero auto-sending."

### `0:30 – 1:15` | Live Telegram Bot Verification & Real Incoming Message
- **Action 1:** Show the **Telegram Bot Backend & Delivery Verification** panel — point out that `TELEGRAM_BOT_TOKEN` is stored exclusively on the backend (`Configured on server`, masked chat ID `***1396`, `@DrTCareCueBot`). Click **Verify Bot (getMe)** to confirm live authentication.
- **Action 2:** Send a live message from Telegram on your phone to `@DrTCareCueBot`, then click **Poll Telegram Bot**.
- **Visual:** The new message lands at the top of the queue and opens on **`02. Incoming`** in the `576 × 288` waveguide HUD.

### `1:15 – 2:00` | AI Summary & Reply Drafts via `gemini-4-hydrogen`
- **Action:** Click **Summarize for G2** (or tap **R1 Tap / Select** into **`03. AI Summary`**).
- **Visual:** Point out the 4-bit green HUD rendering only high-signal info: a <=42-char `glanceHeadline`, 2–3 short bullets, and urgency tag.
- **Action:** Tap **R1 Tap / Select** to advance to **`04. Reply Draft`**, then swipe **`R1 Swipe Down`** / **`R1 Swipe Up`** (or arrow keys) to cycle `Direct`, `Warm`, and `Defer` drafts — all labeled `DRAFT · UNCONFIRMED`.

### `2:00 – 2:40` | Mandatory Wearer Confirmation Gate & Duplicate Lock
- **Action:** Tap **R1 Tap / Select** to stage the chosen reply onto **`05. Confirm Gate`**.
- **Narration:** "Even Hub AI drafts never leave the server silently. Calling `/api/carecue/telegram/send` without explicit `wearerConfirmed: true` fails with `403 CONFIRMATION_REQUIRED` and writes a safety audit entry."
- **Action:** Click **Confirm & Send Telegram Reply**. Show the message deliver live on the Telegram phone chat, watch the HUD flip to **`06. Sent`** with the returned Telegram `message_id`, and highlight the **Sent — Duplicate Locked** guard blocking accidental double-sends (`409 DUPLICATE_SEND_PREVENTED`).

### `2:40 – 3:00` | Settings, Privacy Boundary & Wrap-Up
- **Action:** Click **`07. Settings`** (or **Hold Home** -> **Settings**), cycle optical brightness `4/4 -> 1/4`, toggle compact typography, and demonstrate **Disconnect Session** (`409 SESSION_PAUSED` safety pause).
- **Close:** "Dr. T CareCue G2 uses verified `@evenrealities/even_hub_sdk@0.0.16` containers, server-only Telegram Bot credentials, and deliberate human confirmation — Telegram without looking down."
