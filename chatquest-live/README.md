# Dr. T — ChatQuest Live

> Don't just watch the stream. Shape the story together.

An isolated Twitch audience-participation module inside Dr. T. Streamers create quests, viewers join and vote in Twitch chat, contributions wait for host approval, and a read-only OBS browser-source overlay displays community outcomes.

## Implemented boundary
- Twitch OAuth authorization-code flow, server-side access/refresh token handling, Helix chat send, and EventSub WebSocket subscription.
- Commands: !quest, !join, !vote A, !suggest <idea>, !score, !help.
- Host-only quest creation/lifecycle/moderation; public read-only overlay.
- One vote per Twitch login; a new vote replaces the prior vote.
- Local JSON persistence survives restarts only where the configured data path is persistent.
- OAuth sessions/tokens are memory-resident and cleared on restart. Multi-instance deployments require shared encrypted storage and shared event delivery.
- AI idea endpoint currently uses a clearly labeled deterministic fallback; it does not claim AI inference succeeded.
- Team scoring, duration auto-close, EventSub webhook transport, official Twitch Channel Points, and multi-tenant broadcaster isolation are not implemented.

## Development
1. Install dependencies with bun install (or npm install).
2. Configure server variables using .env.example; never commit secrets.
3. Set CHATQUEST_DATA_FILE to a writable persistent path for local durability.
4. Start Dr. T using bun run dev.
5. Open /?tab=chatquestlive.
6. Configure Twitch OAuth as described in TWITCH_SETUP.md.

## Routes
- /api/chatquest/auth/twitch and /auth/callback — OAuth.
- /api/chatquest/status — integration and quest status.
- /api/chatquest/quests — quest list/create.
- /api/chatquest/quests/:id/action — lifecycle.
- /api/chatquest/quests/:id/contributions/:cid/moderate — host moderation.
- /api/chatquest/overlay — public read-only snapshot.
- /chatquest-overlay — OBS browser source.

## Tests
Run bunx tsx chatquest-live/tests/core.test.ts. These deterministic domain tests do not authenticate to Twitch. Live verification requires valid credentials, a real OAuth connection, an EventSub chat event, and an observed chat reply.
