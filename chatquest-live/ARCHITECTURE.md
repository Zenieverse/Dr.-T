# ChatQuest Live Architecture

## Runtime
The host platform remains React 18 + TypeScript + Vite and Express 5. The isolated feature lives under chatquest-live/, is mounted at /api/chatquest, and is exposed as the chatquestlive Dr. T tab.

## Twitch flow
1. Studio redirects to the server OAuth start route.
2. Server creates cryptographically random, expiring OAuth state.
3. Callback validates state, exchanges code, verifies identity via Helix Users, stores tokens server-side, and sets an HttpOnly/Secure/SameSite cookie.
4. Server opens EventSub WebSocket and subscribes to channel.chat.message.
5. Chat commands update the active quest and Helix sends a reply.
6. Studio polls status; OBS overlay polls a public read-only snapshot.

## Domain model
Pure deterministic logic lives in core.ts. A viewer has one vote per quest; changing a vote decrements the old option and increments the new one. Contributions begin pending and appear on the overlay only after host approval.

## Persistence and scaling
Quest state is atomically written to local JSON (CHATQUEST_DATA_FILE). This is suitable for local development or a single instance with persistent disk. Cloud Run container filesystems are ephemeral and instances do not share files. Production multi-instance operation requires Firestore transactions and encrypted shared OAuth session/token storage.

## AI
The quest-ideas endpoint returns a deterministic idea fallback and labels it isGenuineAi:false. No AI provider is invoked in this MVP.
