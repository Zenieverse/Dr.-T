# Dr. T — CareBridge Pause Checkpoint

**Status:** Temporarily paused (NOT cancelled, replaced, or deleted)  
**Active Priority Pivot:** Even Realities G2 Hackathon 2026 (`Dr. T CareCue G2`)  
**Pause Recorded At:** 2026-11-26  
**Repository:** `https://github.com/Zenieverse/Dr.-T`

---

## 1. Repository & Branch Checkpoint

- **Verified Remote GitHub `main` Baseline:** Commit `3d6584187520af88fb33d834451f9e8ea8845e0e` (`Merge pull request #9 from Zenieverse/docs/carebridge-codespaces-release-handoff`), incorporating merged PRs `#5`, `#6`, `#7` (`d6f108a25a6ad0f577e13d3ddf21ff92468b67af`), `#8` (`b8581b4fa8b29cbdc488e8736afcca6da0fee929`, CI `verify` passed), and `#9`.
- **Workspace Runtime Note:** This Google AI Studio Build container (`/app/applet`) does not contain `.git` metadata or interactive `@forge/cli` credentials; all CareBridge source files, Forge manifests, Firestore rules, and documentation in `/app/applet` match the verified baseline cleanly.
- **Hackathon Isolation Policy:** All Even Realities G2 hackathon work is isolated under `even-g2-carecue/` on hackathon branch `feat/even-g2-carecue` (when committed from GitHub Codespaces or a local Git clone). Zero CareBridge or HatBridge files are deleted, renamed, overwritten, or refactored during this pivot.

---

## 2. Preserved CareBridge Artifacts & Baseline

All CareBridge assets remain completely intact in `/app/applet`:

- **Web Application & UI:**
  - `src/components/carebridge/CareBridgeModule.tsx`
  - `src/components/carebridge/CareBridgeAtlassianSections.tsx`
  - `src/types/carebridgeTypes.ts`
- **Backend Services & Safety Guards:**
  - `src/server/carebridgeService.ts`
  - `src/server/carebridgeAtlassianService.ts`
  - `src/server/carebridgeAiService.ts`
  - `src/server/carebridgeFollowupStore.ts`
  - `src/server/carebridgeEngine.ts`
  - `src/utils/carebridgePhiGuard.ts`
- **Tests:**
  - `scripts/test-carebridge.ts` (`npm run test:carebridge` — 15/15 verified)
  - `scripts/test-firestore-security-rules.ts` (`33 PASSED, 0 FAILED`)
- **Firestore & Firebase Rules:**
  - `firebase-blueprint.json`, `firestore.rules` (deployed to `gen-lang-client-0611153209` / `ai-studio-drt-2e1619d9-9932-4538-9b6c-26b489ebfec2`)
- **Atlassian Forge App (`apps/carebridge-forge/`):**
  - `apps/carebridge-forge/manifest.yml` (`nodejs22.x`, distinct placeholder `ari:cloud:ecosystem::app/REPLACE_WITH_CAREBRIDGE_FORGE_REGISTER_APP_ID`, Rovo agent `CareBridge Care Navigator` [25 chars], 4 short `<=23`-char function keys)
  - `apps/carebridge-forge/scripts/validate-manifest.mjs`, `src/*`, `static/carebridge-ui/*`
- **Preserved External Targets (Untouched):**
  - Atlassian site: `https://zenieverse.atlassian.net`
  - Jira Service Management project: `CareBridge2` (`CR2`), Service Desk ID `2`, Request Type ID `5`
  - Existing synthetic verification request: `CR2-1` (preserved intact in `To Do` status)
  - **HatBridge (`apps/hatbridge-forge/`) & Jira `CAR` / Board 1:** Strictly untouched (`12/12` passing)

---

## 3. Unfinished CareBridge Release Tasks (At Pause Time)

Only the external interactive Forge deployment, signed-in browser check, and submission media steps remain:

1. **Authenticate Forge CLI in GitHub Codespaces / Local Terminal:**
   - Run `forge login` (using Atlassian email + API token).
2. **Verify Existing Apps & Register Distinct CareBridge Forge App ID:**
   - Run `forge apps list` or confirm no conflicting registration, then inside `apps/carebridge-forge/` run `forge register` to replace `REPLACE_WITH_CAREBRIDGE_FORGE_REGISTER_APP_ID` with a brand-new UUID (never HatBridge's App ID).
3. **Validate, Deploy & Install CareBridge Forge:**
   - Inside `apps/carebridge-forge/`: `npm ci && npm run build:ui && npm run typecheck && npm run validate:manifest && forge lint`
   - `forge deploy -e development`
   - `forge install --product jira -e development --site zenieverse.atlassian.net`
   - `forge install --product confluence -e development --site zenieverse.atlassian.net`
4. **Interactive End-to-End Signed-In Browser Verification & Media:**
   - Test signed-in Google Sign-In + JSM consent flow (`cb-jsm-followup-v1`) + live Jira/Confluence/Rovo panels on `zenieverse.atlassian.net`.
   - Record `< 5 min` demo video (`docs/CAREBRIDGE_DEMO_SCRIPT.md`), capture screenshots, and submit Codegeist 2026 entry (`docs/CAREBRIDGE_CODEGEIST_SUBMISSION.md`).

---

## 4. Exact Instructions to Resume CareBridge After the Hackathon

When the Even Realities G2 Hackathon work finishes:

```bash
# 1. Switch cleanly back to main (or a dedicated CareBridge deploy branch)
git fetch origin
git checkout main
git pull --ff-only origin main

# 2. Do NOT merge feat/even-g2-carecue into main until CareBridge release checks confirm clean isolation,
#    or deploy directly from main / chore/carebridge-forge-live-deploy:
git checkout -b chore/carebridge-forge-live-deploy origin/main

# 3. Run CareBridge & HatBridge baseline regression checks from repo root
npm run test:carebridge
npm run test:hatbridge
npx tsx scripts/test-firestore-security-rules.ts

# 4. Complete Forge CLI registration, deployment & installation
cd apps/carebridge-forge
npm ci
npm run build:ui
npm run typecheck
npm run validate:manifest
forge login
forge register
forge lint
forge deploy -e development
forge install --product jira -e development --site zenieverse.atlassian.net
forge install --product confluence -e development --site zenieverse.atlassian.net
```

Refer to `docs/CAREBRIDGE_FORGE_SETUP.md`, `docs/CAREBRIDGE_RELEASE_CHECKLIST.md`, and `docs/CAREBRIDGE_DEMO_SCRIPT.md` for full verification details.
