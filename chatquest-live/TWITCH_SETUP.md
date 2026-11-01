# Twitch Developer Setup

1. Create an app in the [Twitch Developer Console](https://dev.twitch.tv/console/apps).
2. Choose the appropriate application category and register the exact callback URI, for example `https://YOUR_HOST/api/chatquest/auth/callback`. For local use, register `http://localhost:3000/api/chatquest/auth/callback` if Twitch accepts that URI under its current redirect rules.
3. Set these server-side environment variables:
   - `TWITCH_CLIENT_ID`
   - `TWITCH_CLIENT_SECRET`
   - `TWITCH_REDIRECT_URI` (must exactly match the registered URI)
   - `CHATQUEST_SESSION_SECRET` (random secret with at least 32 bytes)
   - `CHATQUEST_DATA_FILE` (writable local path)
4. Restart the server and open Dr. T → ChatQuest Live → Connect Twitch.
5. Approve the scopes `user:read:chat` and `user:write:chat`.
6. Confirm the connected channel in Studio, start a quest, then send a command from a second Twitch account in that channel.

## Twitch APIs and authorization model
This build uses Twitch's **installed chatbot / chat client model**: one broadcaster-authorized user access token is used to read and send messages as that account.
- OAuth authorization-code flow and refresh-token grant.
- Helix `GET /helix/users` to identify the authorized account.
- EventSub WebSocket `channel.chat.message`, using the same user token and the broadcaster's user ID as the chat user.
- Helix `POST /helix/eventsub/subscriptions`.
- Helix `POST /helix/chat/messages`.

Requested scopes are exactly `user:read:chat` (read messages as the user) and `user:write:chat` (send messages as the user). This implementation does not use an app access token or a separate bot account, so do not add the app-bot `user:bot` / `channel:bot` permission pair to this flow.

## Local callback note
If your registered Twitch callback uses localhost but you access Dr. T through a different hostname, OAuth may fail due to the exact redirect URI / cookie origin. Use one consistent host and scheme throughout the login flow.

## Live verification checklist
- OAuth returns to the exact callback and the account name appears.
- Status reports EventSub connected.
- A second account sends `!join` and `!vote A`.
- Studio and OBS update with real chat events.
- Twitch chat shows the bot reply.
