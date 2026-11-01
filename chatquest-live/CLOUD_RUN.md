# Cloud Run release and rollback runbook

## Safety boundary

**This branch is not approved for public Cloud Run deployment yet.** The current service reports `deploymentSafe:false` because quest data, OAuth sessions, refresh tokens, OAuth state and EventSub coordination are process-local. Cloud Run's writable container filesystem is ephemeral. A one-instance setting reduces concurrency hazards but does not make local JSON durable across restarts or deployments.

Do not deploy this build to, or change traffic on, the existing Dr. T service. The future ChatQuest service must be a separately named service, for example `drt-chatquest-live`, in `asia-southeast1`.

## Mandatory pre-deploy gate

All items must be completed and independently tested before deployment:

- [ ] Firestore repository implementation using transactions for quest mutations, vote replacement, deduplication and ownership checks.
- [ ] Encrypted, shared OAuth session and refresh-token storage (Cloud KMS envelope encryption or equivalent); no process-local session map.
- [ ] Per-broadcaster tenant isolation on every host endpoint and quest record.
- [ ] Distributed EventSub connection ownership, reconnect/migration and event idempotency across instances.
- [ ] CSRF protection for authenticated mutations, session rotation and revocation, secure cookie policy, bounded request bodies and rate limiting.
- [ ] OAuth integration verified against a real Twitch developer application and broadcaster account.
- [ ] Independent viewer account verified for chat commands, Helix replies, moderation and OBS updates.
- [ ] `GET /api/chatquest/health` reports `ready:true` and `deploymentSafe:true` only when durable storage and shared session/event services are active.
- [ ] CI, type-check, tests, production build, dependency audit and secret scan pass on the exact release commit.
- [ ] Secret Manager versions, Twitch redirect URI and Cloud Run service account permissions reviewed.

## Twitch developer configuration

Register the exact HTTPS callback:

`https://CHATQUEST_HOST/api/chatquest/auth/callback`

Set Secret Manager secrets and expose them to the container only at runtime:

- `TWITCH_CLIENT_ID`
- `TWITCH_CLIENT_SECRET`
- `TWITCH_REDIRECT_URI`
- `CHATQUEST_SESSION_SECRET` (32+ random bytes; use a secret manager, not an image build argument)
- `GEMINI_API_KEY` (optional)

The current MVP additionally uses `CHATQUEST_DATA_FILE`; this is not an acceptable production persistence mechanism.

## Isolated deployment procedure (after the gate passes)

Use the project and region approved for the separate ChatQuest service. Build from the verified commit, deploy with no traffic, and do not alter the existing Dr. T service:

```bash
gcloud builds submit --tag asia-southeast1-docker.pkg.dev/PROJECT_ID/chatquest/chatquest:RELEASE_SHA
gcloud run deploy drt-chatquest-live \
  --image asia-southeast1-docker.pkg.dev/PROJECT_ID/chatquest/chatquest:RELEASE_SHA \
  --region asia-southeast1 \
  --no-traffic \
  --max 1 \
  --set-secrets TWITCH_CLIENT_ID=TWITCH_CLIENT_ID:latest,TWITCH_CLIENT_SECRET=TWITCH_CLIENT_SECRET:latest,TWITCH_REDIRECT_URI=TWITCH_REDIRECT_URI:latest,CHATQUEST_SESSION_SECRET=CHATQUEST_SESSION_SECRET:latest
```

Before routing traffic, obtain the new service URL and verify:

1. `GET https://CHATQUEST_HOST/api/chatquest/health` returns HTTP 200, `ready:true`, `deploymentSafe:true`, and reports durable/shared services.
2. `GET https://CHATQUEST_HOST/api/chatquest/status` has the expected non-secret configuration state.
3. OAuth completes using the exact registered redirect URL.
4. A real second Twitch account can issue commands and observe real replies and overlay changes.
5. The OBS browser source at `https://CHATQUEST_HOST/chatquest-overlay` works at 1920×1080.
6. A restart/revision change does not lose quests, sessions or event delivery.

Only after all checks pass should traffic be moved to the new ChatQuest revision. Never route traffic from the existing Dr. T service to this service.

## Rollback

Record the previous ChatQuest revision before each release. If any smoke test fails, route the ChatQuest service back to its previous known-good revision using `gcloud run services update-traffic drt-chatquest-live --region asia-southeast1 --to-revisions PREVIOUS_REVISION=100`. This changes only the ChatQuest service. Do not change traffic on the existing Dr. T service.

## Current status

As of this branch's current implementation, the mandatory persistence/session/EventSub gates are not met. The health endpoint intentionally returns `ready:false` and `deploymentSafe:false`. Deployment commands above are a future gated procedure, not evidence of a deployment.
