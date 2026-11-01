# Demo Guide

## Prerequisites
- Twitch developer application with exact HTTPS redirect URI.
- Server environment configured and running on a public HTTPS deployment.
- Streamer Twitch account and an independent viewer account.
- OBS Studio with Browser Source.

## Live demo sequence
1. Open Dr. T → ChatQuest Live and connect the streamer account.
2. Create “The Community Compass” with three options and a 10-minute duration.
3. Open the overlay preview and add `https://YOUR_HOST/chatquest-overlay` as an OBS Browser Source (1920×1080 canvas recommended).
4. Start the quest.
5. From the independent viewer account, send `!quest`, `!join`, `!vote A`, and `!suggest A friendly dragon`.
6. Show the real Twitch chat replies and updated studio/overlay.
7. Approve the suggestion in Community Review; verify it only then appears on the overlay.
8. End the quest and show the community result.

## Other modes
- Story: viewers use `!story a line`; the host approves selected lines.
- Mystery: viewers use `!clue a hint`; the host approves clues.
- Teams: `!join` assigns participants alternately to Ember and Tide to keep team sizes balanced.
- Creative: viewers submit `!suggest` contributions for host approval.

## Honest evidence
The repository CI integration test uses mocked Twitch HTTP and WebSocket responses. It is not live Twitch verification. Capture the real OAuth consent, an independent viewer command, Twitch's chat reply, and the OBS overlay in the final video. If credentials or deployment are unavailable, disclose that limitation; do not stage mock chat as live.
