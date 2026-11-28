# Package Manifest — Dr. T CareCue G2

- **Target Repository:** `Zenieverse/Dr.-T`
- **Target Branch:** `feat/even-g2-carecue`
- **Preserved Remote File:** `even-g2-carecue/BUILD_VERIFICATION_HANDOFF.md` (not included or overwritten by this archive)
- **Total Files in Archive:** 26 (24 existing validated workspace files + `PACKAGE_MANIFEST.md` + `PUBLICATION_INSTRUCTIONS.md`)

## CareCue G2 Module (`even-g2-carecue/`, 17 files)

| Path | Purpose |
| :--- | :--- |
| `even-g2-carecue/CareCueG2Module.tsx` | CareCue G2 wearable HUD optical simulator (`576x288`), live Even Hub bridge probes, and `?wearable=1` / `/carecue-g2` mode |
| `even-g2-carecue/README.md` | CareCue G2 module documentation, architecture diagram, Telegram privacy scope, solo build-period & pre-existing code disclosures |
| `even-g2-carecue/aiService.ts` | Gemini (`gemini-4-hydrogen`) message summarization and 3-option draft generation with deterministic fallback |
| `even-g2-carecue/app.json` | Even Hub manifest configuration pointing entry route to `/carecue-g2` |
| `even-g2-carecue/g2Protocol.ts` | 7-screen monochrome G2 HUD state machine (`HOME`, `INCOMING_MESSAGE`, `AI_SUMMARY`, `REPLY_DRAFT`, `CONFIRM_SEND`, `SENT`, `SETTINGS`) and `@evenrealities/even_hub_sdk` payload builders |
| `even-g2-carecue/server.ts` | Express `/api/carecue/*` routes with `403 CONFIRMATION_REQUIRED`, `409 DUPLICATE_SEND_PREVENTED`, `409 SESSION_PAUSED`, and audit trail |
| `even-g2-carecue/syntheticData.ts` | Offline synthetic demo message fixtures |
| `even-g2-carecue/telegramClient.ts` | Telegram Bot API client (`getMe`, `getUpdates`, `sendMessage`) with `bot[REDACTED]` error sanitization |
| `even-g2-carecue/types.ts` | Shared TypeScript interfaces for CareCue G2 screens, messages, drafts, settings, and audit records |
| `even-g2-carecue/tests/carecue.test.ts` | CareCue G2 regression test suite (8 tests; line 145 uses a synthetic dummy string to verify token redaction) |
| `even-g2-carecue/docs/DEMO_SCRIPT_3MIN.md` | 3-minute hackathon live demo script |
| `even-g2-carecue/docs/DORAHACKS_SUBMISSION.md` | DoraHacks submission text and track alignment details |
| `even-g2-carecue/docs/ENVIRONMENT.md` | Server-side environment variable documentation (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_DEFAULT_CHAT_ID`, `GEMINI_API_KEY`) |
| `even-g2-carecue/docs/INSTALLATION.md` | Local installation and verification instructions |
| `even-g2-carecue/docs/SCREENSHOTS.md` | Visual capture checklist for G2 simulator screens |
| `even-g2-carecue/docs/SIMULATOR_AND_PAIRING.md` | Optical simulator and physical G2 QR pairing guide |
| `even-g2-carecue/docs/TEST_REPORT.md` | Verification and test summary report |

## Dr. T Host Integration Files (7 files)

| Path | Purpose |
| :--- | :--- |
| `README.md` | Root README updated with top CareCue G2 hackathon link and pre-existing code / solo build-period disclosure |
| `package.json` | Adds `@evenrealities/even_hub_sdk` dependency and `test:carecue` npm script |
| `server.impl.ts` | Registers `registerCareCueRoutes(app, getGemini)` on the Express server |
| `src/App.tsx` | Adds CareCue G2 route/tab support (`/carecue-g2`, `/?wearable=1`, `?tab=carecue-g2`) while preserving existing modules |
| `src/types.ts` | Adds `'carecue-g2'` to `ActiveTab` union type |
| `src/components/layout/Navbar.tsx` | Adds CareCue G2 navigation item in top navigation bar |
| `src/components/layout/CommandPalette.tsx` | Adds CareCue G2 entry to command palette search |

## Package Metadata & Instructions (2 files)

| Path | Purpose |
| :--- | :--- |
| `PACKAGE_MANIFEST.md` | Complete file inventory and purpose summary for this publication package |
| `PUBLICATION_INSTRUCTIONS.md` | Safe Git instructions to apply this package onto `feat/even-g2-carecue` without modifying `main` or `BUILD_VERIFICATION_HANDOFF.md` |

## Required Server Environment Variable Names (Not Bundled)

Do not commit `.env` or real secrets. Configure these server-side environment variable names at runtime as needed:
- `TELEGRAM_BOT_TOKEN` (optional; enables live Telegram Bot API mode instead of simulator fixtures)
- `TELEGRAM_DEFAULT_CHAT_ID` (optional; target chat ID for test-send endpoint)
- `GEMINI_API_KEY` (optional; enables live `gemini-4-hydrogen` summarization instead of deterministic fallback)
