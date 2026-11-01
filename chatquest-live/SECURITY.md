# Security and Privacy

- Twitch client secret, access token and refresh token remain server-side.
- OAuth state is random, single-use, short-lived and bound to an HttpOnly browser cookie.
- Session cookie is HMAC-signed, HttpOnly, SameSite=Lax and Secure in production.
- Mutating requests reject cross-site Fetch Metadata and mismatched Origin headers.
- Host quest listing, creation, lifecycle and moderation require a valid session.
- The public overlay receives a deliberately reduced snapshot: no vote-to-user map, participant identities, pending contributions or rejected content.
- Contribution text is length-limited and control characters are removed. Host approval is required before public display.
- EventSub event IDs are deduplicated; per-user command cooldowns limit chat spam.
- Twitch API 429 receives one bounded retry. Errors never include credentials.
- Community score is an application feature, not official Twitch Channel Points.
- Never log OAuth codes, cookies, tokens or client secrets.

## Production hardening still required
This MVP is a single-process prototype. Before public multi-creator production, use encrypted shared session/token storage, per-broadcaster ownership and tenant isolation, Firestore transactions or equivalent durable shared storage, distributed event delivery, robust distributed rate limiting, CSRF tokens in addition to Origin checks, secret-manager injection, dependency and secret scanning, security headers, log redaction, backup/retention policies, and operational monitoring. Cloud Run's local container filesystem is ephemeral.
