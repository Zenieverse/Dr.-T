# Physical Even Realities G2 & R1 Test Checklist — Dr. T CareCue G2

> **Current Verification Status:** **NOT RUN** on physical Even Realities G2 glasses or physical R1 ring hardware (cloud sandbox has no Bluetooth/USB hardware bridge). Complete each step on physical hardware before marking a build physical-device verified.

---

## 1. Prerequisites & Pairing

- [ ] **Hardware:** Even Realities G2 glasses (charged > 25%) + Even R1 ring paired in the official **Even** mobile app.
- [ ] **Hosted HTTPS Entry:** Express + Vite server running behind a reachable HTTPS origin (no mixed HTTP content) or packaged via `@evenrealities/evenhub-cli`.
- [ ] **Server Environment (no `VITE_` prefix):**
  - `TELEGRAM_BOT_TOKEN` configured with dedicated test bot (`@DrTCareCueBot` or your hackathon `@BotFather` bot).
  - `TELEGRAM_DEFAULT_CHAT_ID` configured if running `Send Test Message`.
  - `GEMINI_API_KEY` configured (or omit to verify deterministic fallback mode).
- [ ] **QR Pairing:**
  1. Start server (`npm run dev` or production `npm start`) behind HTTPS URL `https://<host>/carecue-g2`.
  2. Generate developer QR code with `evenhub qr --url "https://<host>/carecue-g2"`.
  3. Open **Even** mobile app -> **Even Hub** -> **QR Scanner / Dev Prototype** -> scan QR.
  4. Verify top-left HUD indicator transitions from `SIMULATOR MODE` to **`LIVE EVEN G2 DEVICE`** and `Host Probe` shows connected device model + battery percentage (`DeviceInfo.status.batteryLevel`).

---

## 2. Launching CareCue G2

- [ ] Launch via **App Menu** (`launchSource = "appMenu"`) and confirm `createStartUpPageContainer()` returns `0` (`StartUpPageCreateResult.success`).
- [ ] Optionally launch via **Glasses Menu** (`launchSource = "glassesMenu"`) and confirm `HOME` renders cleanly at `576 × 288` 4-bit monochrome without clipped borders.
- [ ] Confirm Telegram bot connection status in HUD header (`TG LIVE` when active, `TG DEMO` if token unset).

---

## 3. Expected Seven-Screen Flow (`576 × 288` Waveguide)

Verify each screen renders cleanly on the physical G2 waveguide without truncation defects or SDK container rejection (`SDK: VALID`):

1. **`HOME`** — Header (`CARECUE · TG LIVE`), open thread count, `> INBOX` / `> SETTINGS & CONNECTION` list selector, footer hint.
2. **`INCOMING_MESSAGE`** — Selected message index (`1/N`), sender name, handle, clock time, wrapped body lines, source badge.
3. **`AI_SUMMARY`** — Concise `glanceHeadline`, urgency (`LOW`/`MEDIUM`/`HIGH`), max 2–3 bullets, `ASK:` action line.
4. **`REPLY_DRAFT`** — Explicitly labeled **`DRAFT · UNCONFIRMED`**, 3 selectable options (`[DIRECT]`, `[WARM]`, `[DEFER]`).
5. **`CONFIRM_SEND`** — Displays recipient (`TO:`), exact reply text (`OUT:`), `[DELIBERATE CONFIRM] OR [TEMPLE: CANCEL]`, and **`GATE ACTIVE`** (or **`SENT LOCKED`** if already replied).
6. **`SENT`** — Displays recipient and Telegram `TELEGRAM MSG ID: #<id> (CONFIRMED)` (or local receipt in demo mode).
7. **`SETTINGS`** — 3 rows: connection status (`STATUS: TG LIVE`), brightness (`1/4`–`4/4`), typography (`STANDARD` / `COMPACT`).

---

## 4. Gesture-by-Gesture Physical Checks

| Physical Input | SDK Event Expected | Expected CareCue G2 Action | Status |
| :--- | :--- | :--- | :--- |
| R1 Swipe Up | `SCROLL_TOP_EVENT` (`1`) | Moves selection up (`HOME`, `INCOMING_MESSAGE`, `REPLY_DRAFT`, `SETTINGS`) | [ ] NOT RUN |
| R1 Swipe Down | `SCROLL_BOTTOM_EVENT` (`2`) | Moves selection down | [ ] NOT RUN |
| R1 Tap / Right-Temple Tap | `CLICK_EVENT` (`0`) | Advances (`HOME` -> `INCOMING_MESSAGE` -> `AI_SUMMARY` -> `REPLY_DRAFT` -> `CONFIRM_SEND`); cycles brightness/typography in `SETTINGS` | [ ] NOT RUN |
| Left-Temple Tap | `CLICK_EVENT` + `TOUCH_EVENT_FROM_GLASSES_L` (`3`) | Navigates back (`CONFIRM_SEND` -> `REPLY_DRAFT`, etc.; opens `SETTINGS` from `HOME`) | [ ] NOT RUN |
| Right-Temple Tap on `CONFIRM_SEND` | `CLICK_EVENT` + `TOUCH_EVENT_FROM_GLASSES_R` (`1`) | **Safety cancel guard:** returns to `REPLY_DRAFT` instead of auto-sending | [ ] NOT RUN |
| Double-Click | `DOUBLE_CLICK_EVENT` (`3`) | Navigates back (`TEMPLE_BACK`) | [ ] NOT RUN |
| Long Press | `LONG_PRESS_EVENT` (`9`) | Returns directly to `HOME` (`TEMPLE_HOLD_HOME`) and clears staged draft | [ ] NOT RUN |
| Glasses Action Menu | `menuItemClickEvent.itemID` (`1`–`4`) | `1`=Select, `2`=Back, `3`=Home, `4`=Settings | [ ] NOT RUN |
| Brightness Toggle (`SETTINGS` row 2) | `textContainerUpgrade` (`textColor` 1–4) | Visible waveguide brightness steps across levels `1/4` through `4/4` | [ ] NOT RUN |

---

## 5. Telegram Confirmation & Duplicate-Send Test

- [ ] Send `/start` and a short test message from a secondary Telegram test account to `@DrTCareCueBot` (synthetic test text only — no personal/patient info).
- [ ] Poll incoming message on console (`Poll Telegram Bot`) and verify it appears on Screen 2 (`INCOMING_MESSAGE`).
- [ ] Summarize (`AI Summarize Active`) and verify Screen 3 (`AI_SUMMARY`) + Screen 4 (`REPLY_DRAFT` badged `DRAFT · UNCONFIRMED`).
- [ ] Stage Screen 5 (`CONFIRM_SEND`): verify **no Telegram message is sent** simply by reaching Screen 5 or tapping Left/Right temple cancel.
- [ ] Execute deliberate wearer confirmation (`Confirm & Send Telegram Reply`): verify Screen 6 (`SENT`) displays returned Telegram `message_id` and recipient chat receives the reply.
- [ ] Re-attempt send on the same thread: verify `CONFIRM_SEND` shows **`SENT LOCKED`** / `ALREADY REPLIED — DUPLICATE SEND PREVENTED` (`409 DUPLICATE_SEND_PREVENTED`).

---

## 6. Disconnect / Reconnect & Device Status Test

- [ ] **Telegram Session Pause:** In `SETTINGS` / console, click `Disconnect Session` -> HUD header switches to **`TG PAUSED`**; verify `Poll Telegram Bot` and `Confirm & Send` are blocked with `409 SESSION_PAUSED`.
- [ ] **Telegram Session Reconnect:** Click `Reconnect Session` -> HUD header returns to **`TG LIVE`** and polling resumes.
- [ ] **Physical BLE Disconnect:** Power off / place G2 glasses into charging case -> verify `onDeviceStatusChanged` transitions `connectType` to `disconnected`, HUD banner safely falls back to `SIMULATOR MODE`, and zero uncaught errors occur.
- [ ] **Physical BLE Reconnect:** Remove G2 from case / reconnect in Even app -> verify `onDeviceStatusChanged` (`connected`) restores `LIVE EVEN G2 DEVICE` and updates HUD containers cleanly.

---

## 7. Failure Recovery Checks

- [ ] **Bridge Timeout / Desktop Browser:** Load `/carecue-g2` without Even App WebView -> verify timeout (~600ms) cleanly falls back to interactive `SIMULATOR MODE`.
- [ ] **Network Loss During Poll/Send:** Disable Wi-Fi briefly and trigger poll/send -> verify clear error banner appears without wiping local HUD state or crashing WebView.
- [ ] **Gemini Upstream Timeout/503:** Verify `aiService.ts` degrades cleanly to `deterministic_fallback` with 3 still-unconfirmed reply drafts.

---

## 8. Evidence to Capture for Hackathon Demonstration

- [ ] Photo/video through the G2 waveguide lens showing `HOME`, `AI_SUMMARY`, `CONFIRM_SEND` (`GATE ACTIVE`), and `SENT` (`TELEGRAM MSG ID: #...`).
- [ ] Side-by-side recording of R1 ring scroll/tap advancing the G2 screen + Telegram client receiving the confirmed reply.
- [ ] Screenshot of the CareCue Event & Safety Audit Log showing `TELEGRAM_BOT_VERIFIED`, `AI_SUMMARIZED`, and `REPLY_CONFIRMED_AND_SENT` (with zero raw tokens visible).
