# Installation Guide — Dr. T CareCue G2

## Prerequisites

- **Node.js** `20+` and **npm** `10+`
- Repository root checkout of `Zenieverse/Dr.-T` on branch `feat/even-g2-carecue`
- Optional for live Telegram Bot API testing: a Telegram bot token created via `@BotFather`
- Optional for live AI summaries/drafts: a `GEMINI_API_KEY`
- Optional for hardware packaging / official Even Hub simulator:
  - `@evenrealities/evenhub-cli`
  - `@evenrealities/evenhub-simulator`

## 1. Install Dependencies

From the repository root:

```bash
npm install
```

`@evenrealities/even_hub_sdk` (`^0.0.16`), `@google/genai`, `express`, `tsx`, `typescript`, and `vite` are declared in root `package.json`.

## 2. Configure Server Environment Variables

Copy `.env.example` to `.env` for local development (never commit `.env` with real tokens):

```bash
cp .env.example .env
```

Set at minimum:
- `GEMINI_API_KEY` (optional; falls back cleanly to deterministic formatter if omitted)
- `TELEGRAM_BOT_TOKEN` (optional; falls back cleanly to synthetic demo / webhook simulation if omitted)
- `TELEGRAM_DEFAULT_CHAT_ID` (optional; enables live `Test Send` delivery verification)

See [`ENVIRONMENT.md`](./ENVIRONMENT.md) for details.

## 3. Run Locally on Port 3000

```bash
npm run dev
```

Open:
- **Full Console + 576×288 Simulator:** `http://localhost:3000/?tab=carecue-g2`
- **Standalone Even Hub Wearable WebView:** `http://localhost:3000/carecue-g2`

## 4. Verify Before Submitting

```bash
npm run test:carecue
npm run test:carebridge
npm run test:hatbridge
npm run lint
npm run build:dev
```
