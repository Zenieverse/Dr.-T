# Dr. T — CareBridge Codespaces Patch & Release Handoff

**Repository:** `https://github.com/Zenieverse/Dr.-T`  
**Base Branch:** `main`  
**Verified Base SHA:** `f5c8f132f411aa38800bab6cd549a0d247c7da03` (PR `#5` + PR `#6` merged)  
**Target Branch:** `chore/carebridge-forge-schema-fixes`  
**Patch File:** `carebridge-forge-schema-fixes.patch`  
**Status of Patch:** Prepared and verified locally in Google AI Studio Build (`/app/applet`). **NOT yet committed, pushed, or merged to GitHub.**

---

## 1. Exact Seven-File Change List (`35 insertions(+), 23 deletions(-)`)

1. `apps/carebridge-forge/manifest.yml`
   - Shortened `rovo:agent` (`carebridge-navigator`) `name` from 31 chars (`CareBridge Healthcare Navigator`) to **25 chars** (`CareBridge Care Navigator`) to comply with Atlassian Forge's 30-character maximum (`prompt` updated consistently).
   - Shortened all 4 `modules.function` keys (and matching `action.*.function` references) to **<= 23 characters** (`valid-module-required`):
     - `rovo-summarize-care-context` (27) -> `rovo-care-context` (17)
     - `rovo-retrieve-care-knowledge` (28) -> `rovo-care-knowledge` (19)
     - `rovo-summarize-followup-tasks` (29) -> `rovo-followup-tasks` (19)
     - `rovo-prepare-care-handoff` (25) -> `rovo-care-handoff` (17)
   - Preserved `carebridge-resolver` (19 chars) and `id: ari:cloud:ecosystem::app/REPLACE_WITH_CAREBRIDGE_FORGE_REGISTER_APP_ID`.
2. `apps/carebridge-forge/scripts/validate-manifest.mjs`
   - Enforces `modules.function` keys `<= 23` characters and `rovo:agent` `name` length `1–30` characters locally.
3. `apps/carebridge-forge/README.md`
   - Replaced unsupported `--product jira-servicedesk` with `@forge/cli@16.0.0`-supported `--product jira -e development --site zenieverse.atlassian.net` alongside `--product confluence`.
4. `docs/CAREBRIDGE_DEMO_SCRIPT.md`
   - Aligned Forge KVS notation with `apps/carebridge-forge/src/coreService.ts` (`carebridge:v1:user:<accountId>:workspace`).
5. `docs/CAREBRIDGE_FORGE_SETUP.md`
   - Corrected `--product jira-servicedesk` -> `--product jira`, updated agent display name to `CareBridge Care Navigator`, and recorded `main` baseline `f5c8f132f411aa38800bab6cd549a0d247c7da03`.
6. `docs/CAREBRIDGE_RELEASE_CHECKLIST.md`
   - Updated the Post-Merge Verification Addendum with `f5c8f132` baseline, 5 `@forge/manifest` schema/CLI fixes, and remaining external Codespaces/production gates.
7. `docs/CAREBRIDGE_CODEGEIST_SUBMISSION.md`
   - Updated Release Verification Status with PR `#6` (`f5c8f132`) and Forge schema compliance status.

---

## 2. Verification & Preservation Checks (Observed Results)

| Check / Command | Exit Code | Result |
| --- | --- | --- |
| `git apply --check carebridge-forge-schema-fixes.patch` (against clean `f5c8f132` base) | `0` | Clean apply (`7 files changed, 35 insertions(+), 23 deletions(-)`); all 7 files verified byte-identical (`cmp -s`). |
| `npm --prefix apps/carebridge-forge run build:ui` | `0` | Built `static/carebridge-ui/app.js` (`232.9kb`). |
| `npm --prefix apps/carebridge-forge run typecheck` | `0` | TypeScript passed cleanly (`tsc --noEmit`). |
| `node apps/carebridge-forge/scripts/validate-manifest.mjs` | `0` | `PASS: CareBridge Forge manifest.yml verified (5 functions, 4 Rovo actions, 8 official scopes, JSM portal module & all local assets present).` |
| `npm run test:carebridge` | `0` | `ALL CAREBRIDGE TESTS PASSED (15/15).` |
| `npm run test:hatbridge` | `0` | `HatBridge Verification Suite Complete: 12/12 checks passed.` |
| `npx tsx scripts/test-firestore-security-rules.ts` | `0` | `SUMMARY: 33 PASSED, 0 FAILED` |
| HatBridge & base files vs `f5c8f132` | `0` | `apps/hatbridge-forge/{manifest.yml,package.json,src/index.ts,src/coreService.ts}`, `src/server/carebridgeService.ts`, and `.env.example` are completely unchanged (`cmp -s`). |
| `GET /api/carebridge/atlassian/jsm/requests/CR2-1` (read-only) | `200` | `issueKey: "CR2-1"`, `status: "To Do"` (`issueId: "10000"`); zero Jira/JSM requests created, updated, or deleted. |

---

## 3. GitHub Codespaces Git Commands (Apply, Inspect, Commit & Push)

Copy `carebridge-forge-schema-fixes.patch` into the root of your GitHub Codespaces checkout of `Zenieverse/Dr.-T` (or paste its contents into a file named `carebridge-forge-schema-fixes.patch`), then run:

```bash
# 1. Verify repository and fetch latest main
git remote -v
git fetch origin main

# 2. Verify base SHA matches f5c8f132f411aa38800bab6cd549a0d247c7da03
git rev-parse origin/main

# 3. Create target branch (if branch already exists remotely, inspect it before using)
git checkout -b chore/carebridge-forge-schema-fixes origin/main

# 4. Dry-run and apply patch cleanly
git apply --check carebridge-forge-schema-fixes.patch
git apply carebridge-forge-schema-fixes.patch

# 5. Inspect status and complete diff (confirm only the 7 expected files are modified, no secrets, no HatBridge edits)
git status
git diff --stat
git diff

# 6. Run post-patch validation checks in Codespaces
cd apps/carebridge-forge
npm ci
npm run build:ui
npm run typecheck
npm run validate:manifest
cd ../..
npm run test:carebridge
npm run test:hatbridge

# 7. Remove temporary patch/handoff staging copies if untracked in root, stage only the 7 tracked files, commit & push
git add \
  apps/carebridge-forge/manifest.yml \
  apps/carebridge-forge/scripts/validate-manifest.mjs \
  apps/carebridge-forge/README.md \
  docs/CAREBRIDGE_DEMO_SCRIPT.md \
  docs/CAREBRIDGE_FORGE_SETUP.md \
  docs/CAREBRIDGE_RELEASE_CHECKLIST.md \
  docs/CAREBRIDGE_CODEGEIST_SUBMISSION.md

git status
git commit -m "fix(carebridge): satisfy Forge manifest schema constraints"
git push -u origin chore/carebridge-forge-schema-fixes
```

---

## 4. Open Pull Request & Review Warning

1. Open a Pull Request on GitHub:
   - **Base:** `Zenieverse/Dr.-T` `main` (`f5c8f132f411aa38800bab6cd549a0d247c7da03`)
   - **Compare:** `chore/carebridge-forge-schema-fixes`
   - Or via GitHub CLI:
     ```bash
     gh pr create \
       --base main \
       --head chore/carebridge-forge-schema-fixes \
       --title "Fix CareBridge Forge manifest schema constraints" \
       --body "Applies validated @forge/manifest schema fixes (<=30-char rovo:agent name, <=23-char function keys), updates validate-manifest.mjs, and corrects forge install --product jira documentation. Preserves HatBridge and CR2-1."
     ```
2. **WARNING — DO NOT MERGE WITHOUT REVIEW:** Inspect the GitHub PR **Files changed** tab carefully before merging to confirm:
   - Only the **7 CareBridge/doc files** are included.
   - `apps/hatbridge-forge/` has zero modifications.
   - No `.env`, API tokens, `carebridge-forge-schema-fixes.patch`, or temporary artifacts are accidentally committed unless intentionally desired.
   - Do **not** force-push `main`.

---

## 5. Next Phase — Interactive Atlassian Forge Registration, Deployment & Installation (After PR Merge)

> **Update:** PR `#7` is now **merged** on `main` at `d6f108a25a6ad0f577e13d3ddf21ff92468b67af` (so `carebridge-forge-schema-fixes.patch` does **not** need to be re-applied). In GitHub Codespaces, switch to `main` (`git checkout main && git pull --ff-only origin main`) and run:

```bash
# 1. Authenticate interactively with Atlassian (email + Atlassian API token)
forge login
forge whoami
forge install list

# 2. Register, lint, deploy, and install CareBridge Forge (NEVER reuse HatBridge's App ID)
cd apps/carebridge-forge
npm ci
forge register
npm run build:ui
npm run typecheck
npm run validate:manifest
forge lint
forge deploy -e development
forge install --product jira -e development --site zenieverse.atlassian.net
forge install --product confluence -e development --site zenieverse.atlassian.net
forge install list
```

When prompted by `forge login`, complete the interactive email/API-token authentication, then return:
- The merged PR URL & commit SHA (`PR #7` merged at `d6f108a25a6ad0f577e13d3ddf21ff92468b67af`).
- The registered CareBridge Forge App ID (`ari:cloud:ecosystem::app/<uuid>`).
- `forge lint`, `forge deploy -e development`, and `forge install list` outputs.
