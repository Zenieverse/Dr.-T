# Dr. T — HatBridge: Codegeist 2026 Release & Readiness Checklist

## A. Code & Local Verification (Executed & Verified in Workspace)
- [x] Dr. T existing navigation (`Navbar.tsx`, `CommandPalette.tsx`, `App.tsx`) and sibling modules (`Health Alert Mini`, `Presage Sense`, `MicroBiz PayFlow`, `Vision Alert`, `PIANIST`, `Three Hats`, `ChatQuest Live`, `BuildArena`, `Population Health`, `Living Sound Garden`) preserved intact.
- [x] `apps/hatbridge-forge/manifest.yml` declares `nodejs22.x`, `jira:issuePanel`, `jira:globalPage`, `confluence:globalPage`, `confluence:contentAction` (`viewportSize: medium`), `rovo:agent`, 4 dedicated `action` -> `function` mappings, local SVG icon resource, and 6 verified Forge scopes.
- [x] `apps/hatbridge-forge/scripts/validate-manifest.mjs` exits `0`.
- [x] `npx tsc --noEmit -p apps/hatbridge-forge/tsconfig.json` and Custom UI `tsc` exit `0`.
- [x] `apps/hatbridge-forge/ui/src/main.ts` uses `@forge/bridge` (`invoke`, `view`, `router.open`) with `try/catch` error notices on every mutation.
- [x] Re-entry Brief UI separates **Verified Source Information**, **User-Recorded Information**, **AI-Generated Suggestions (Unconfirmed)**, and **Missing / Unavailable Context**.
- [x] Gemini AI service (`gemini-4-hydrogen`) enforces explicit consent, `private_personal` exclusion by default, missing-key fallback, 18s timeout guard, and API-key redaction.
- [x] Server & client privacy checks omit raw email from Firestore error logs, sanitize Bearer/Basic tokens, enforce Jira summary/project/SSRF checks, and enforce Forge KVS `accountId` + `api.asUser()` ownership.
- [x] Automated suites pass: `test:hatbridge`, `test-firestore-security-rules.ts`, `test-production-isolation.ts`, `test-phase2-remediation.ts`, `test:population-health`, `test:soundgarden:release`, `build:dev`, `compile_applet`, and `lint_applet`.

## B. External Cloud, Forge CLI & Submission Steps (Pending Credentials / Environment)
- [ ] Run `cd apps/hatbridge-forge && npm install && npm run build:ui && npm run build`.
- [ ] Install `@forge/cli`, run `forge login`, `forge register`, `forge lint`, `forge deploy -e development`, `forge install --product jira -e development`, and `forge install --product confluence -e development`.
- [ ] Verify Jira issue panel, Confluence content action, `router.open()`, and all 4 Rovo actions with real Atlassian Cloud data.
- [ ] Configure runtime secrets (`GEMINI_API_KEY`, optional `ATLASSIAN_*`) on target non-sandbox server if using server-side endpoints.
- [ ] Capture genuine 8-screenshot gallery and record end-to-end demo video.
- [ ] Push authorized Git commit to `https://github.com/Zenieverse/Dr.-T` (Git repo unavailable inside build sandbox) and complete Devpost / Marketplace submission.
