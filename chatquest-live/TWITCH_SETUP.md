# Twitch Developer Setup

1. Create an app at https://dev.twitch.tv/console/apps.
2. Register the exact redirect URL: https://YOUR_HOST/api/chatquest/auth/callback. For local development use http://localhost:3000/api/chatquest/auth/callback if accepted by Twitch's current redirect URI rules.
3. Add server environment variables: TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET, TWITCH_REDIRECT_URI, CHATQUEST_SESSION_SECRET (random secret, at least 32 bytes), and CHATQUEST_DATA_FILE (writable persistent path).
4. Restart Dr. T, open /?tab=chatquestlive, click Connect Twitch, and approve user:read:chat and user:write:chat.
5. Verify channel identity and EventSub connection status. Start a quest and test commands from a real viewer account.

## APIs and scopes
- Twitch OAuth authorization-code flow and token refresh.
- Helix GET /helix/users verifies broadcaster identity.
- EventSub WebSocket channel.chat.message receives chat.
- Helix POST /helix/eventsub/subscriptions registers the chat subscription.
- Helix POST /helix/chat/messages sends replies.
- Scopes requested: user:read:chat, user:write:chat.

This version uses the broadcaster's authorized user token; it does not configure a separate bot account. If Twitch rejects the subscription or chat send, inspect Twitch's returned error and confirm current Twitch API requirements before a live demo.
