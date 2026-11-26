# CareBridge — Codespaces Release Handoff

This checklist completes the remaining **interactive Atlassian Forge release steps** for Dr. T — CareBridge. It is intentionally separate from the Dr. T web deployment and from HatBridge.

## Current repository baseline

- Repository: https://github.com/Zenieverse/Dr.-T
- Base branch: `main`
- Latest known merged baseline when this handoff was prepared: `b8581b4fa8b29cbdc488e8736afcca6da0fee929` (PR #8).
- PR #8 adds GitHub Actions verification for the CareBridge Forge package. Its successful CI run does **not** register, deploy, or install a Forge app.
- CareBridge manifest: `apps/carebridge-forge/manifest.yml`
- CareBridge app ID is still a placeholder until Forge registration is completed.
- HatBridge has its own manifest and app ID. **Never copy, replace, or reuse the HatBridge app ID.**

Before running commands, sync and inspect the actual branch state:

```bash
git status --short
git fetch origin
git switch main
git pull --ff-only origin main
git rev-parse HEAD
git status --short
```

If the working tree is not clean, stop and inspect the changes. Do not discard or overwrite unrelated work.

## 1. Open Codespaces from iPad Safari

1. Open https://github.com/Zenieverse/Dr.-T
2. Select **Code → Codespaces**.
3. Create a Codespace from the current `main` branch (or open the existing one).
4. In the terminal, run the sync commands above.

## 2. Authenticate and inspect Forge before registering anything

From the repository root:

```bash
node --version
npm --version
npm install --global @forge/cli@16.0.0
forge --version
forge login
forge whoami
forge install list
```

Use the interactive browser login. Do not paste API tokens into source files, terminal command history, chat, or screenshots.

**Registration safety gate:** inspect the output of `forge install list` and the Atlassian developer console for an existing CareBridge app first. If a CareBridge app already exists, recover and use its existing app ID. Only if no CareBridge registration exists, run the following from the CareBridge app directory:

```bash
cd apps/carebridge-forge
forge register
```

Follow the CLI prompts to register a distinct app named for CareBridge. Do not register a duplicate if an app already exists. After registration, inspect `manifest.yml` and confirm `app.id` is a real CareBridge app ID and is **not** the HatBridge ID.

## 3. Validate the package

From `apps/carebridge-forge`:

```bash
npm ci
npm run build:ui
npm run typecheck
npm run validate:manifest
forge lint
```

Stop and fix any errors before deployment. Do not bypass lint or weaken validation to force a pass.

## 4. Deploy and install to development only

Only after registration and validation succeed:

```bash
forge deploy -e development
forge install --product jira -e development --site zenieverse.atlassian.net
forge install --product confluence -e development --site zenieverse.atlassian.net
forge install list
```

The app targets Jira/Jira Service Management and Confluence modules. Do not substitute an unsupported `jira-servicedesk` product flag. Confirm the installed products and environment in the final `forge install list` output.

## 5. Verify the actual experience

After installation, open the Atlassian site and verify each surface that is available to the account:

- Jira global page: CareBridge Navigator.
- Jira issue panel.
- JSM portal request detail panel (test only with the existing approved synthetic request `CR2-1`).
- Confluence global page and content action.
- Rovo Chat agent: `CareBridge Care Navigator` (`carebridge-navigator`), including all four declared read-only actions.

Record actual outcomes, timestamps, app version/deployment ID, environment, and screenshots with tokens, email addresses, customer identifiers, and private data excluded.

**Do not create, edit, transition, comment on, or delete JSM tickets during verification.** Preserve the approved synthetic request `CR2-1` unchanged (expected current status: `To Do`). Do not use real patient data.

## 6. What remains separate from Forge

Forge deployment does not prove that the Dr. T web application is deployed or that its production Firebase configuration is correct. The production web build remains blocked until the deployment environment supplies approved production values:

- `VITE_RUNTIME_ENV=production`
- `VITE_FIREBASE_PROJECT_ID` (non-development project)
- `VITE_FIRESTORE_DATABASE_ID` (non-development database)
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`

Do not use the development Firestore database as production configuration or bypass the fail-closed production validator.

The signed-in Firebase browser walkthrough also requires an interactive authenticated browser session. Automated tests and unauthenticated HTTP probes are not substitutes for that walkthrough.

## 7. Report release status accurately

Use separate statuses:

| Capability | Mark complete only when |
|---|---|
| Source merged | GitHub shows the PR merged into `main` |
| CI tested | Required workflow runs pass on the merged commit |
| Forge registered | CLI/developer console confirms a real CareBridge app ID |
| Forge deployed | `forge deploy` reports success for the target environment |
| Forge installed | `forge install list` confirms Jira and Confluence installations |
| Rovo verified | Agent appears and each action is exercised with authorized test data |
| Web production built | Production build succeeds with approved production environment values |
| Signed-in browser tested | Full authenticated user journey is completed |

Never describe a feature as connected, deployed, installed, or verified solely because its source code or manifest exists.
