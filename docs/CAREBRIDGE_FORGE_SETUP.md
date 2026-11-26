# Dr. T — CareBridge Atlassian Forge Setup (GitHub Codespaces + iPad Safari)

Because Google AI Studio runs in an iPad-accessible web sandbox without the Atlassian Forge CLI or interactive OAuth login, follow this verified step-by-step workflow in **GitHub Codespaces** (works natively inside iPad Safari) to register, deploy, and install **CareBridge Forge** separately from HatBridge.

---

## 1. Prerequisites

- Atlassian Cloud developer site (`https://<your-site>.atlassian.net`) with **Jira Service Management** and **Confluence** enabled (Rovo enabled if testing Rovo Chat).
- Atlassian API token for `@forge/cli` login (`https://id.atlassian.com/manage-profile/security/api-tokens`).
- GitHub repository (`Zenieverse/Dr.-T`) opened in **GitHub Codespaces** via iPad Safari or desktop browser.

---

## 2. Synchronize `Zenieverse/Dr.-T` to GitHub (If Not Yet Synced)

Because this AI Studio workspace has no `.git` metadata or `gh` CLI credentials attached, push your exported CareBridge changes safely from GitHub Codespaces or your local clone (never force-push and never include `.env` or secret files):

```bash
git status
git diff --stat
# Stage CareBridge implementation, rules, tests, Forge app, and docs selectively
git add \
  src/components/carebridge/ \
  src/server/carebridge*.ts \
  src/types/carebridgeTypes.ts \
  src/utils/carebridgePhiGuard.ts \
  src/App.tsx \
  src/components/layout/Navbar.tsx \
  server.impl.ts \
  package.json \
  firebase-blueprint.json \
  firestore.rules \
  scripts/test-carebridge.ts \
  scripts/test-firestore-security-rules.ts \
  apps/carebridge-forge/ \
  docs/CAREBRIDGE_*.md

git status
git commit -m "Release harden Dr. T CareBridge JSM follow-up, Firestore rules, and Forge package"
git push origin HEAD
```

---

## 3. Register & Deploy CareBridge Forge (Distinct App ID)

**Never reuse HatBridge's Forge App ID.** CareBridge lives in `apps/carebridge-forge/` (`REPLACE_WITH_CAREBRIDGE_FORGE_REGISTER_APP_ID`), strictly separate from `apps/hatbridge-forge/` (`REPLACE_WITH_FORGE_REGISTER_APP_ID`).

```bash
# 1. Confirm Forge identity and verify no existing CareBridge registration conflicts
forge whoami

# 2. Install Node dependencies inside CareBridge Forge
cd apps/carebridge-forge
npm install

# 3. Authenticate Forge CLI if needed (Atlassian email + API token)
forge login

# 4. Register a brand-new CareBridge Forge App ID in apps/carebridge-forge/manifest.yml
forge register
# Verify apps/carebridge-forge/manifest.yml now has a real UUID app.id (not HatBridge's)

# 5. Build Custom UI bundle + validate TypeScript, manifest & Forge lint
npm run build:ui
npm run typecheck
npm run validate:manifest
forge lint

# 6. Deploy to Atlassian Forge development environment
forge deploy -e development

# 7. Install onto Jira Service Management & Confluence on https://zenieverse.atlassian.net
forge install --product jira-servicedesk -e development --site zenieverse.atlassian.net
forge install --product confluence -e development --site zenieverse.atlassian.net
```

To enable Atlassian Rovo testing, ensure `https://zenieverse.atlassian.net` has Rovo activated and verify the `CareBridge Healthcare Navigator` agent (`carebridge-navigator`) appears in Rovo Chat.

---

## 4. Server-Side Live API Bridge for Dr. T Web App

When running the Dr. T Express backend with direct Atlassian REST integration for the CareBridge web tab (`?tab=carebridge`), configure **server-side** environment variables (never in client `VITE_*` vars):

```env
ATLASSIAN_SITE_URL=https://zenieverse.atlassian.net
ATLASSIAN_EMAIL=your-atlassian-account-email@example.com
ATLASSIAN_API_TOKEN=your-server-side-atlassian-api-token
CAREBRIDGE_DEFAULT_SERVICE_DESK_ID=2
CAREBRIDGE_DEFAULT_REQUEST_TYPE_ID=5
```

Verify configuration health cleanly via `GET /api/carebridge/status` and read-only JSM connectivity via `GET /api/carebridge/atlassian/verify`. Follow-up endpoints (`/api/carebridge/consent/followup`, `/api/carebridge/followup/*`, `/api/carebridge/followup/audit`) additionally require a verified Firebase Auth Bearer ID token and explicit per-user **Jira Service Management Follow-Up Consent** (`cb-jsm-followup-v1`).

---

## 5. Firestore Rules Deployment Status

CareBridge adds owner-isolated collections (`carebridge_tasks`, `carebridge_briefs`, `carebridge_consents`, `carebridge_integrations`, `carebridge_audit_logs`) to `firestore.rules` and `firebase-blueprint.json` (including `allow get` + `allow list` owner checks on consents/integrations, `consentPolicyVersion`, `followUpConsentExpiresAt`, `followUpConsentWithdrawnAt`, `requestKey`, `operationType`, `policyVersion`, and `correlationId`).

- **Confirmed Firebase Project:** `gen-lang-client-0611153209` (`firestoreDatabaseId: ai-studio-drt-2e1619d9-9932-4538-9b6c-26b489ebfec2`)
- **Deployment Executed:** `deploy_firebase` completed (`Firestore rules deploy completed`), followed by passing `npx tsx scripts/test-firestore-security-rules.ts` (`33 PASSED, 0 FAILED`).

To re-deploy manually from a local or Codespaces Firebase CLI session:

```bash
firebase deploy --only firestore:rules --project gen-lang-client-0611153209
```

