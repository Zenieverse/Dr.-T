# Environment Variables — Dr. T CareCue G2

All secrets are **server-side only** (`server.ts` / `server.impl.ts` / `even-g2-carecue/server.ts`). Never prefix any Telegram token, chat ID, or Gemini key with `VITE_`.

| Variable | Required | Used By | Purpose |
| :--- | :--- | :--- | :--- |
| `TELEGRAM_BOT_TOKEN` | Optional (required for live Telegram) | `even-g2-carecue/server.ts`, `telegramClient.ts` | Authenticates Bot API calls (`getMe`, `getUpdates`, `sendMessage`) against `https://api.telegram.org`. Redacted as `bot[REDACTED]` in all errors and audit entries. |
| `TELEGRAM_DEFAULT_CHAT_ID` | Optional (required for `Send Test Message`) | `even-g2-carecue/server.ts` | Target chat ID for `/api/carecue/telegram/test-send` and simulated fallback target metadata. Masked in UI as `***XXXX`. |
| `GEMINI_API_KEY` | Optional (required for live Gemini AI) | `server.impl.ts` (`getGemini`), `even-g2-carecue/aiService.ts` | Enables live `gemini-4-hydrogen` G2 glance summaries and 3 draft replies. If omitted, deterministic fallback operates automatically with `modelProvider: "deterministic_fallback"`. |

## Behavior When Unconfigured

- **No `TELEGRAM_BOT_TOKEN`:** Simulator mode loads 3 realistic synthetic demo messages and supports `POST /api/carecue/telegram/simulate` (`source: "simulated_webhook"`). All confirmation gates, duplicate-send locks, and 7 G2 HUD screens work identically.
- **No `GEMINI_API_KEY`:** `aiService.ts` runs `buildDeterministicFallback()` and clearly surfaces `fallbackReason` to the console.

## Token Isolation Verification

Run after building to verify zero token leakage into frontend bundles:

```bash
grep -rn "TELEGRAM_BOT_TOKEN" src/ even-g2-carecue/CareCueG2Module.tsx dist/assets/
```

Expected: zero matches.
