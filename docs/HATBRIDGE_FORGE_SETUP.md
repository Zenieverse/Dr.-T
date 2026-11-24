# Dr. T — HatBridge: Atlassian Forge Setup & Deployment Guide

> **Operational Status Disclosure:** In the build sandbox, `@forge/cli` is not installed (`NO_FORGE_CLI`) and interactive Atlassian developer authentication / credentials are absent. Therefore `forge register`, `forge lint`, `forge deploy`, and `forge install` were **not** executed in the sandbox. All Forge TypeScript modules, Custom UI source (`@forge/bridge`), local assets, and `validate-manifest.mjs` checks pass locally.

---

## Verified Scripts in `apps/hatbridge-forge/package.json`
- `npm run validate:manifest` — runs `node scripts/validate-manifest.mjs`
- `npm run typecheck` — runs `tsc --noEmit`
- `npm run build:ui` — runs `npx esbuild ui/src/main.ts --bundle --format=esm --outfile=static/hatbridge-ui/app.js`
- `npm run build` — runs `tsc`

## Exact Deployment Workflow (Run on Developer Machine or CI with Node 22.x)
```bash
cd apps/hatbridge-forge
npm install
npm run validate:manifest
npm run typecheck
npm run build:ui
npm run build
npm install -g @forge/cli
forge login
forge register
forge lint
forge deploy -e development
forge install --product jira -e development
forge install --product confluence -e development
```

### Important Notes Before Live Verification
1. `forge register` writes your unique Atlassian Forge App ID into `apps/hatbridge-forge/manifest.yml` (`app.id`), replacing `REPLACE_WITH_FORGE_REGISTER_APP_ID`.
2. Ensure `npm run build:ui` succeeds before `forge deploy` so `@forge/bridge` (`invoke`, `view`, `router.open`) is bundled into `apps/hatbridge-forge/static/hatbridge-ui/app.js`.
3. Install onto both Jira and Confluence on an Atlassian Cloud site that has **Rovo** enabled to test `HatBridge Context Navigator` and all 4 action functions (`getReentryBrief`, `searchAuthorizedDecisions`, `prepareRoleHandoff`, `suggestNextAction`).

## Optional Server-Side REST Configuration for Standalone Dr. T Web App
To connect `/api/hatbridge/atlassian/*` outside the Forge iframe, configure these **server-side only** environment variables (never expose in client `VITE_*` variables):
- `ATLASSIAN_SITE_URL=https://your-site.atlassian.net`
- `ATLASSIAN_EMAIL=your-atlassian-email@example.com`
- `ATLASSIAN_API_TOKEN=your-api-token`
- `GEMINI_API_KEY=your-gemini-api-key` (for optional server-side `gemini-4-hydrogen` continuity synthesis)
