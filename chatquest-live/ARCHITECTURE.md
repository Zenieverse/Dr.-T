# ChatQuest Live Architecture

## Boundaries
React 18 + TypeScript + Vite frontend, Express 5 server. The new module is isolated in `chatquest-live/`, mounted at `/api/chatquest`, and exposed as the `chatquestlive` tab. Existing Dr. T modules and Build With AI are not repurposed.

## Twitch authorization
OAuth authorization-code flow with random, short-lived state bound to an HttpOnly cookie. The server exchanges the code, verifies the user through Helix, validates `user:read:chat` and `user:write:chat`, and stores access/refresh tokens in process memory. The session cookie is HMAC signed, HttpOnly, SameSite=Lax and Secure in production.

The product uses Twitch's installed-chatbot model: one broadcaster user token reads and sends chat as that broadcaster. It is not the app-token bot model.

## Event flow
1. The server opens an EventSub WebSocket.
2. On `session_welcome`, it creates a `channel.chat.message` subscription using the broadcaster's user token.
3. Incoming command messages are deduplicated and throttled per viewer/command.
4. Pure domain functions validate commands and update quest state.
5. Helix Send Chat Message replies as the broadcaster.
6. Studio polls authenticated quest data; OBS polls a sanitized public snapshot.

## Domain
- One participant record per Twitch login.
- One vote per login; a new selection replaces the old vote.
- Suggestions, story lines and mystery clues begin pending.
- Only approved contributions appear in the public overlay.
- Teams are assigned alternately to the currently smaller Ember/Tide team.
- Duration expiry ends an active quest. Pausing stores remaining time; resuming restores it.

## Persistence and scale
Quest state is atomically written to a local JSON file. This supports a single process on persistent local storage, not Cloud Run multi-instance production. OAuth sessions and token refresh state are in memory and clear on restart. Production requires Firestore or equivalent transactional storage, encrypted shared sessions, per-broadcaster tenant isolation and shared event delivery.

## AI
When `GEMINI_API_KEY` is configured, the server uses the Google Gen AI SDK and `CHATQUEST_GEMINI_MODEL` (default `gemini-3.8-flash`) for quest ideation, organizing pending submissions, and summarizing completed quests. Prompts treat viewer text as untrusted data. AI suggestions never approve or reject contributions. A bounded timeout, response validation and deterministic fallback are used; every response labels `provider` and `isGenuineAi` honestly. The Gemini key remains server-side.
