# Devpost Submission — Dr. T: ChatQuest Live

**Tagline:** Don't just watch the stream. Shape the story together.

**Description:** ChatQuest Live transforms Twitch chat into a shared game board. A streamer creates a quest, viewers join and vote using familiar chat commands, and audience members contribute story lines, mystery clues and creative ideas. Every contribution waits for the host's approval before it appears in the OBS browser-source overlay. Automatic quest timing, community scores and team assignments help turn passive viewing into collaborative play.

**Why it matters:** Live audiences are communities, not just view counts. ChatQuest Live gives viewers a simple, low-friction way to influence a shared experience while leaving account settings and moderation authority with the streamer.

**Three Hats:** Creator designs the experience; Host guides and moderates; Community Builder welcomes and celebrates participation.

**New work:** An isolated implementation under `chatquest-live/` in the Dr. T repository, with its own source, Twitch integration, UI, OBS overlay, tests, CI and documentation. It is a new Twitch product surface, not a repackaged Dr. T health module.

**Twitch APIs:** OAuth authorization-code flow, Helix Users, EventSub WebSocket `channel.chat.message`, EventSub subscriptions, and Helix Send Chat Message. Scopes: `user:read:chat`, `user:write:chat`.

**Open-source repository:** https://github.com/Zenieverse/Dr.-T

**Demo URL:** Add only after the new build is deployed and independently verified. Do not reuse the older Dr. T demo URL as evidence of ChatQuest deployment.

**Verification disclosure:** Clearly distinguish CI/mocked Twitch integration tests from real Twitch verification. Record an actual Twitch OAuth session, independent viewer chat commands, resulting Twitch chat replies, and OBS overlay in the demo video. Record the actual Codex session ID from `/status` in the main Codex session.
