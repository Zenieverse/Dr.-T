# Dr. T CareCue G2 — Telegram, Without Looking Down

**Even Realities G2 Hackathon 2026**  
- **Track:** Messaging & News  
- **Special Prize Target:** Best Telegram Integration  
- **Team:** Solo Developer (`Zenieverse` · 1 team member)  
- **Hackathon Build Period:** **November 23–29, 2026**  
- **Repository & Branch:** [`https://github.com/Zenieverse/Dr.-T/tree/feat/even-g2-carecue`](https://github.com/Zenieverse/Dr.-T/tree/feat/even-g2-carecue)  
- **Live Development Demo URL:** [`https://ais-dev-4s4jvpipr3mh3mz6x2hpfp-393352619239.asia-southeast1.run.app/?tab=carecue-g2`](https://ais-dev-4s4jvpipr3mh3mz6x2hpfp-393352619239.asia-southeast1.run.app/?tab=carecue-g2)  
- **Standalone Even Hub Wearable Route:** `/carecue-g2` (or `/?wearable=1`)

---

## Pre-Existing Code & Build-Period Disclosure (Solo Team)

In accordance with hackathon transparency rules:
- **Team Size:** Solo developer (1 member).
- **Hackathon Work (November 23–29, 2026):** All CareCue G2 wearable code, Even Hub SDK protocol state machine, Telegram Bot API backend routes, Gemini summarization/drafting service, 7-screen UI + optical simulator, regression tests, and hackathon documentation in [`even-g2-carecue/`](./) were newly designed and built during **November 23–29, 2026**.
- **Pre-Existing Platform Code:** The host **Dr. T** repository (`src/`, `server.impl.ts`, CareBridge, HatBridge, and other domain modules) is pre-existing platform code created before this hackathon. Minimal integration wiring was added on branch `feat/even-g2-carecue` across `src/App.tsx`, `src/types.ts`, `src/components/layout/Navbar.tsx`, `src/components/layout/CommandPalette.tsx`, `server.impl.ts`, `package.json`, `.env.example`, and a top note in root `README.md`. Paused CareBridge work and `main` remain untouched.
- **Test Accounts & Data Hygiene:** Live Telegram testing uses a dedicated `@BotFather` test bot (`@DrTCareCueBot`) with server-side credentials only; zero API keys, bot tokens, secrets, or personal Telegram messages are committed. Unauthenticated/offline demos run against synthetic fixtures (`even-g2-carecue/syntheticData.ts`).

---

## Architecture

```
+-----------------------------------------------------------------------------+
| Even Realities G2 (576x288 Monochrome) & R1 Ring / Temple Inputs            |
|  - @evenrealities/even_hub_sdk@0.0.16                                       |
|  - CreateStartUpPageContainer / RebuildPageContainer / TextContainerUpgrade |
|  - Events: onEvenHubEvent, onDeviceStatusChanged, onLaunchSource            |
+--------------------------------------+--------------------------------------+
                                       |
                                       v
+-----------------------------------------------------------------------------+
| CareCue Wearable & Simulator Client (even-g2-carecue/CareCueG2Module.tsx)   |
|  - 7-Screen State Machine (g2Protocol.ts):                                  |
|    HOME -> INCOMING_MESSAGE -> AI_SUMMARY -> REPLY_DRAFT -> CONFIRM_SEND    |
|         -> SENT  (+ SETTINGS: brightness 1-4, compact type, session pause)  |
|  - Zero secrets, zero client-side Telegram tokens, explicit SIMULATOR badge |
+--------------------------------------+--------------------------------------+
                                       | HTTPS / Express REST (/api/carecue/*)
                                       v
+-----------------------------------------------------------------------------+
| Express Server Backend (even-g2-carecue/server.ts)                          |
|  - telegramClient.ts: Bot API getMe, getUpdates, sendMessage (redirect:     |
|    manual, 10s timeout, bot[REDACTED] error sanitization)                   |
|  - aiService.ts: @google/genai (gemini-4-hydrogen) + deterministic fallback |
|  - Safety Guards:                                                           |
|    * 403 CONFIRMATION_REQUIRED unless wearerConfirmed === true              |
|    * 409 DUPLICATE_SEND_PREVENTED on already-REPLIED or inflight IDs        |
|    * 409 SESSION_PAUSED when wearer disconnects session in Settings          |
+-----------------------------------------------------------------------------+
```

## 7-Screen Wearable Flow (`576 × 288` px, 4-bit Monochrome)

1. **`HOME`** — Live Telegram connection status (`TG LIVE` / `TG PAUSED` / `TG DEMO`), open unread count, latest thread preview, and quick menu to **Inbox** or **Settings**.
2. **`INCOMING_MESSAGE`** — Scrollable Telegram thread queue via R1 `Up`/`Down`, showing sender name, handle, timestamp, raw text preview, and status.
3. **`AI_SUMMARY`** — Server-generated concise `glanceHeadline`, max 3 short bullet points, operational urgency (`LOW`/`MEDIUM`/`HIGH`), and recommended next step.
4. **`REPLY_DRAFT`** — R1-selectable short reply options (`Direct`, `Warm`, `Defer`), explicitly badged as `DRAFT · UNCONFIRMED`.
5. **`CONFIRM_SEND`** — Mandatory wearer review gate showing recipient + final reply text. Requires deliberate confirmation; blocks duplicate sends if status is `REPLIED`.
6. **`SENT`** — Delivery confirmation showing recipient and live Telegram `message_id` (or local receipt in demo mode).
7. **`SETTINGS`** — Optical brightness (`1/4`–`4/4` via `TextContainerUpgrade`), compact typography toggle, and Telegram bot session Disconnect/Reconnect toggle (`POST /api/carecue/telegram/session`).

## Telegram Bot API Permissions & Privacy Restrictions

- **Scope:** Standard Telegram Bot API bots can **only** read messages sent directly to the bot (`/start` private bot conversation) or messages in groups/channels where an administrator explicitly adds the bot (subject to Telegram Bot Privacy Mode). CareCue **cannot** read arbitrary private user-to-user Telegram DMs.
- **Secret Isolation:** `TELEGRAM_BOT_TOKEN`, `TELEGRAM_DEFAULT_CHAT_ID`, and `GEMINI_API_KEY` reside strictly in server environment variables (`process.env`). Nothing is prefixed with `VITE_`, and all error messages scrub `bot<token>` patterns to `bot[REDACTED]`.
- **Confirmation & Idempotency:** Outbound messages never auto-send. `POST /api/carecue/telegram/send` rejects requests without `wearerConfirmed: true` (`403 CONFIRMATION_REQUIRED`) and rejects duplicate sends (`409 DUPLICATE_SEND_PREVENTED`).
- **Even G2 Hardware Honesty:** Uses only verified `@evenrealities/even_hub_sdk@0.0.16` APIs. No camera, microphone, speaker, or voice-input hardware is assumed or invented for Even G2.

## Quick Setup & Demo

```bash
npm install
cp .env.example .env   # Optional: set GEMINI_API_KEY, TELEGRAM_BOT_TOKEN, TELEGRAM_DEFAULT_CHAT_ID
npm run dev            # Starts Express + Vite on http://localhost:3000
```

- **Full Console + `576 × 288` Simulator:** `http://localhost:3000/?tab=carecue-g2`
- **Standalone Even Hub Wearable Entry:** `http://localhost:3000/carecue-g2`
- **Verify All Suites:** `npm run test:carecue && npm run test:carebridge && npm run test:hatbridge && npm run lint && npm run build:dev`

## Documentation Index

- [Installation & Setup](docs/INSTALLATION.md)
- [Environment Variables](docs/ENVIRONMENT.md)
- [Simulator & Physical G2 QR Pairing Guide](docs/SIMULATOR_AND_PAIRING.md)
- [3-Minute Hackathon Demo Script](docs/DEMO_SCRIPT_3MIN.md)
- [Screenshot & Visual Capture Checklist](docs/SCREENSHOTS.md)
- [DoraHacks Submission Copy](docs/DORAHACKS_SUBMISSION.md)
- [Verification & Test Report](docs/TEST_REPORT.md)
