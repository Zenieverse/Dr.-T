# Dr. T — CareBridge Atlassian Forge Setup (GitHub Codespaces + iPad Safari)

Because Google AI Studio runs in an iPad-accessible web sandbox without the Atlassian Forge CLI or interactive OAuth login, follow this verified step-by-step workflow in **GitHub Codespaces** (works natively inside iPad Safari) to register, deploy, and install **CareBridge Forge** separately from HatBridge.

---

## 1. Prerequisites

- Atlassian Cloud developer site (`https://<your-site>.atlassian.net`) with **Jira Service Management** and **Confluence** enabled (Rovo enabled if testing Rovo Chat).
- Atlassian API token for `@forge/cli` login (`https://id.atlassian.com/manage-profile/security/api-tokens`).
- GitHub repository (`Zenieverse/Dr.-T`) opened in **GitHub Codespaces** via iPad Safari or desktop browser.

---

## 2. Register & Deploy CareBridge Forge (Distinct App ID)

**Never reuse HatBridge's Forge App ID.** CareBridge lives in `apps/carebridge-forge/`.

```bash
# 1. Install Node dependencies inside CareBridge Forge
cd apps/carebridge-forge
npm install

# 2. Authenticate Forge CLI (use Atlassian email + API token)
forge login

# 3. Register a brand-new CareBridge Forge App ID in manifest.yml
forge register
# Verify apps/carebridge-forge/manifest.yml now has a real UUID app.id

# 4. Build Custom UI bundle + validate TypeScript & manifest
npm run build:ui
npm run typecheck
npm run validate:manifest
forge lint

# 5. Deploy to Atlassian Forge development environment
forge deploy -e development

# 6. Install onto Jira Service Management & Confluence on your site
forge install --product jira-servicedesk -e development
forge install --product confluence -e development
```

To enable Atlassian Rovo testing, ensure your site has Rovo activated and verify the `CareBridge Healthcare Navigator` agent appears in Rovo Chat.

---

## 3. Optional Server-Side Live API Bridge for Dr. T Web App

If running the Dr. T Express backend with direct Atlassian REST integration for the CareBridge web tab (`?tab=carebridge`), configure **server-side** environment variables (never in client `VITE_*` vars):

```env
ATLASSIAN_SITE_URL=https://zenieverse.atlassian.net
ATLASSIAN_EMAIL=your-atlassian-account-email@example.com
ATLASSIAN_API_TOKEN=your-server-side-atlassian-api-token
CAREBRIDGE_DEFAULT_SERVICE_DESK_ID=2
CAREBRIDGE_DEFAULT_REQUEST_TYPE_ID=5
```

Verify configuration health cleanly via `GET /api/carebridge/status`.

---

## 4. Firestore Rules Deployment Reminder

CareBridge adds owner-isolated collections (`carebridge_tasks`, `carebridge_briefs`, `carebridge_consents`, `carebridge_integrations`, `carebridge_audit_logs`) to `firestore.rules` and `firebase-blueprint.json`. Deploy updated Firestore rules from a logged-in Firebase CLI session before production launch:

```bash
firebase deploy --only firestore:rules
```
