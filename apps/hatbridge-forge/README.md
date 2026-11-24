# HatBridge Forge App (`apps/hatbridge-forge`)

Official Atlassian Forge companion app for **Dr. T — HatBridge** (*"Many Hats. One Life. Nothing Important Lost."*).

## Modules Included in `manifest.yml`
- **`jira:issuePanel`** (`hatbridge-jira-issue-panel`): Captures the active Jira issue to a chosen Hat, links decisions, saves handoffs, and renders the grounded Re-entry Brief.
- **`jira:globalPage`** (`hatbridge-jira-hub`, route `hatbridge`): Cross-issue workplace Mission Control inside Jira.
- **`confluence:globalPage`** (`hatbridge-confluence-hub`, route `hatbridge`): Cross-page workplace continuity workspace inside Confluence.
- **`confluence:contentAction`** (`hatbridge-confluence-decision-link`): Captures a Confluence page directly into a Hat or records a source-referenced decision.
- **`rovo:agent`** (`hatbridge-context-navigator`): Rovo assistant backed by 4 dedicated read-only/draft action handlers (`getReentryBrief`, `searchAuthorizedDecisions`, `prepareRoleHandoff`, `suggestNextAction`).

## Security & Permission Architecture
- Uses `api.asUser()` on every Jira and Confluence REST request — never escalates past the signed-in Atlassian user's permissions.
- Stores per-user workplace links, captures, decisions, and handoffs in Forge `@forge/kvs` keyed strictly by Forge-verified `context.principal.accountId || context.accountId` (never payload-supplied IDs).
- Rejects `private_personal` data classification across all Forge resolvers via `src/privacyGuard.ts`.
- Requires explicit user checkbox confirmation (`confirmedByUser === true`) before calling Jira `POST /rest/api/3/issue`.
- Custom UI uses `@forge/bridge` `router.open(...)` for source links inside sandboxed Atlassian iframes.

## Scripts & Local Verification
```bash
cd apps/hatbridge-forge
npm install
npm run validate:manifest
npm run typecheck
npm run build:ui
npm run build
```

## Deploy & Install (Requires Authenticated Forge CLI)
```bash
npm install -g @forge/cli
forge login
forge register
forge lint
forge deploy -e development
forge install --product jira -e development
forge install --product confluence -e development
```

> **Sandbox Notice:** In build sandboxes without `@forge/cli` or Atlassian credentials, `forge register`, `forge lint`, `forge deploy`, and `forge install` are pending operator execution on a developer machine or CI runner.
