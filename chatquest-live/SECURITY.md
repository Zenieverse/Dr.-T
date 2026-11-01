# Security and Privacy

- Client ID and Client Secret are read only from server environment variables.
- Access and refresh tokens are not sent to the browser or written to quest JSON.
- Session cookie is HttpOnly, Secure, SameSite=Lax; production requires HTTPS.
- OAuth state is cryptographically random, single-use, and expires after ten minutes.
- Host mutation routes require the session cookie; overlay is read-only.
- Quest inputs and chat contribution length are bounded.
- Viewer contributions remain private to the studio until host approval.
- ChatQuest participation points are not Twitch Channel Points.
- Never log OAuth codes, cookies, access tokens, or refresh tokens.

## Production hardening required
Before public multi-creator production, add CSRF protection for cookie-authenticated mutations, origin allowlisting, per-user session binding, encrypted shared session/token storage, Firestore transactional persistence, multi-tenant ownership checks, rate limiting, and security/dependency scans. The current MVP uses one active in-memory broadcaster session per process.
