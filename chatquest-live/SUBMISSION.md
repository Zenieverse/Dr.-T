# Hackathon Submission — Dr. T: ChatQuest Live

## Tagline
Don't just watch the stream. Shape the story together.

## Description
ChatQuest Live turns Twitch chat into a shared game board. Streamers create community quests, viewers join and vote using familiar chat commands, and creative contributions enter a host-controlled moderation queue. A browser-source overlay brings community choices into the stream.

## Original work
A separately scoped implementation in chatquest-live/, with domain logic, Twitch OAuth/EventSub integration, studio interface, OBS overlay, tests, and documentation. It is not a renamed pre-existing Dr. T health module.

## Three Hats
- Creator: designs the quest and participation rules.
- Host: starts, pauses, advances, and moderates.
- Community Builder: welcomes contributions and celebrates collective decisions.

## APIs
Twitch OAuth authorization-code flow, Helix Users, EventSub WebSocket channel.chat.message, EventSub subscriptions, and Helix Send Chat Message. Requested scopes: user:read:chat, user:write:chat.

## Readiness disclosure
Do not claim live Twitch verification until OAuth succeeds against a real channel, EventSub delivers a real chat event, and a reply is observed in Twitch chat. Local JSON is not Cloud Run durable storage. Capture the Codex session ID from the main Codex session with /status; a repository commit does not prove that session.
