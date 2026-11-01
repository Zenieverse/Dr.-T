# Dr. T — ChatQuest Live

> Don't just watch the stream. Shape the story together.

A new, isolated Twitch audience-participation feature in Dr. T. Streamers create quests; viewers join, vote, submit story lines or mystery clues in Twitch chat; the host moderates submissions; and an OBS browser source shows approved community outcomes.

## Capabilities
- Twitch OAuth authorization-code flow; server-side access and refresh tokens; signed HttpOnly session cookie; browser-bound one-time OAuth state.
- EventSub WebSocket subscription to `channel.chat.message`.
- Helix Send Chat Message replies, with token refresh, one retry for rate limiting, event deduplication, reconnect handling and per-user command cooldown.
- Commands: `!quest`, `!join`, `!vote A`, `!suggest idea`, `!story a line`, `!clue a hint`, `!score`, `!help`.
- Quest modes: voting, collaborative story, mystery, creative and balanced Ember/Tide team assignment.
- Host-only quest creation, lifecycle, private submission review and approval/rejection.
- One vote per Twitch login; a changed vote replaces the previous vote.
- Automatic quest expiry; pause/resume preserves remaining time.
- Public overlay contains approved contributions only and never includes private viewer vote maps or pending submissions.
- Participation points are independent of official Twitch Channel Points.
- Deterministic quest-idea fallback clearly reports `isGenuineAi:false`.

## Local development
1. Install dependencies: `bun install`.
2. Copy `.env.example` to `.env` and configure the Twitch values below. The host process must load your environment variables (or inject them through your shell/deployment).
3. Set `CHATQUEST_DATA_FILE` to a writable path. Local JSON is for local/single-instance use only.
4. Start Dr. T with `bun run dev`.
5. Open `http://localhost:3000/?tab=chatquestlive`.
6. Configure Twitch as described in [TWITCH_SETUP.md](./TWITCH_SETUP.md).

## Routes
- `GET /api/chatquest/auth/twitch`, `GET /api/chatquest/auth/callback`, `POST /api/chatquest/auth/logout`
- `GET /api/chatquest/status`, `GET /api/chatquest/health`
- `GET /api/chatquest/quests` (authenticated studio data), `POST /api/chatquest/quests`
- `POST /api/chatquest/quests/:id/action`
- `POST /api/chatquest/quests/:id/contributions/:cid/moderate`
- `GET /api/chatquest/overlay` (public, sanitized), `GET /api/chatquest/events` (public SSE)
- `/chatquest-overlay` — OBS browser source.

## Tests
- `bun run test:chatquest` runs deterministic domain tests and a mocked Twitch HTTP/EventSub integration test.
- `bun run lint` checks the existing Dr. T TypeScript project.
- `bun run build` builds the production frontend and server bundle.
- CI runs those checks for ChatQuest changes.

The mocked server integration test does not authenticate against Twitch's live production service. A real Twitch test requires valid developer credentials, an actual channel, and an independent viewer account. Never describe mocks as live verification.

## Known production boundaries
- Quest data uses atomic local JSON. It is not safe for multi-instance Cloud Run and ephemeral Cloud Run disks are not durable.
- OAuth sessions and token refresh state are memory-resident and are cleared on process restart.
- Multi-broadcaster tenancy, encrypted shared token/session storage, Firestore transactional persistence, distributed event delivery, webhook transport and cross-instance WebSocket coordination remain required before public multi-tenant production.
- Streamer-authorized account mode is used; there is no separate bot identity.
- AI provider inference is not wired in this release; the deterministic fallback is explicit.

Read [ARCHITECTURE.md](./ARCHITECTURE.md), [TWITCH_SETUP.md](./TWITCH_SETUP.md), [SECURITY.md](./SECURITY.md), [DEMO.md](./DEMO.md), [SUBMISSION.md](./SUBMISSION.md) and [VIDEO_SCRIPT.md](./VIDEO_SCRIPT.md).
