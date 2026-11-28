# DoraHacks Submission Draft — Even Realities G2 Hackathon 2026

## Project Name
**Dr. T CareCue G2 — Telegram, Without Looking Down**

## Selected Track, Team & Build-Period Disclosure
- **Track:** Messaging & News
- **Special Prize Target:** Best Telegram Integration
- **Hackathon:** `https://dorahacks.io/hackathon/even-realities/detail#prizes`
- **Team Size:** Solo developer (1 member — `Zenieverse`)
- **Hackathon Build Period:** November 23–29, 2026
- **Pre-Existing Platform Disclosure:** Built inside the pre-existing **Dr. T** workspace (`main`), keeping all pre-existing modules (including CareBridge and HatBridge) intact. All CareCue G2 wearable code, Even Hub SDK protocol state machine, Telegram Bot API backend routes, Gemini summarizer/drafting adapter, tests, and submission docs in `even-g2-carecue/` were created specifically during November 23–29, 2026.

## One-Sentence Summary
Calm, glanceable Telegram triage on Even Realities G2 `576 × 288` monochrome optics using official `@evenrealities/even_hub_sdk` containers, Gemini (`gemini-4-hydrogen`) reply drafts, and mandatory wearer confirmation before sending.

## Problem
When your hands or attention are occupied—between shifts, commuting, cooking, or coordinating logistics—pulling out a smartphone to read multi-paragraph Telegram threads breaks situational presence. At the same time, automated messaging bots that fire off AI-generated replies without explicit human sign-off create high social and operational risk.

## Solution
Dr. T CareCue G2 bridges **live Telegram Bot API** messages onto **Even Realities G2 smart glasses** in a strict 7-screen monochrome flow designed for micro-LED readability:

1. **Home (`HOME`)** — Connection state (`TG LIVE` / `TG PAUSED` / `TG DEMO`), open message counter, Inbox & Settings entry.
2. **Incoming Message (`INCOMING_MESSAGE`)** — R1-scrollable thread queue with sender, timestamp, and wrapped snippet.
3. **AI Summary (`AI_SUMMARY`)** — Server-side `@google/genai` (`gemini-4-hydrogen`) distills raw text into a <=42-char headline, 2–3 short bullets, and operational urgency (`LOW` / `MEDIUM` / `HIGH`) without fabricating medical/clinical triage claims.
4. **Reply Draft (`REPLY_DRAFT`)** — Three ultra-short candidate replies (`Direct`, `Warm`, `Defer`), always marked `DRAFT · UNCONFIRMED`.
5. **Confirm Send Gate (`CONFIRM_SEND`)** — Mandatory wearer review screen; backend `/api/carecue/telegram/send` enforces `wearerConfirmed: true` (HTTP `403 CONFIRMATION_REQUIRED` otherwise) and prevents accidental double-sends (HTTP `409 DUPLICATE_SEND_PREVENTED`).
6. **Sent Receipt (`SENT`)** — Live Telegram `message_id` delivery confirmation receipt.
7. **Settings (`SETTINGS`)** — Live SDK brightness cycling (`TextContainerUpgrade`), compact typography toggle, and session Pause/Disconnect control (`HTTP 409 SESSION_PAUSED`).

## Technical Architecture, Privacy & Verification
- **Even Hub SDK (`0.0.16`):** Uses `waitForEvenAppBridge()`, `CreateStartUpPageContainer`, `RebuildPageContainer`, `TextContainerProperty`, `ListContainerProperty`, `MenuContainerProperty`, `TextContainerUpgrade`, `validateEvenHubPageContainer()`, `onDeviceStatusChanged`, `onLaunchSource`, and `onEvenHubEvent`. No camera, microphone, speaker, or voice capabilities are fabricated.
- **Dedicated Test Bot & Permission Scope:** Verified live against `@DrTCareCueBot` (`https://api.telegram.org`) using server-side credentials only (`TELEGRAM_BOT_TOKEN` & `TELEGRAM_DEFAULT_CHAT_ID` never enter frontend bundles). Telegram Bot API only reads `/start` chats with the bot or groups where the bot is explicitly added—never unrelated private DMs. Offline/unauthenticated demos use synthetic fixtures (`syntheticData.ts`).
- **Standalone & Console Routes:**
  - Even Hub WebView Entry: `/carecue-g2` (referenced in `even-g2-carecue/app.json`)
  - Web Console + Browser Simulator: `/?tab=carecue-g2`

## Links
- **GitHub Repository:** `https://github.com/Zenieverse/Dr.-T`
- **Branch:** `https://github.com/Zenieverse/Dr.-T/tree/feat/even-g2-carecue`
- **README:** `https://github.com/Zenieverse/Dr.-T/blob/feat/even-g2-carecue/even-g2-carecue/README.md`
- **Live Development App Demo URL:** `https://ais-dev-4s4jvpipr3mh3mz6x2hpfp-393352619239.asia-southeast1.run.app/?tab=carecue-g2`
- **Live Even Hub App Manifest:** `even-g2-carecue/app.json`
