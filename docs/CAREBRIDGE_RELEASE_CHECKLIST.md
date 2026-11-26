# Dr. T — CareBridge Codegeist 2026 Release Readiness Checklist

**Status Legend:** `IMPLEMENTED` · `TESTED` · `LIVE VERIFIED` · `DEPLOYED` · `INSTALLED` · `READY FOR REVIEW` · `SUBMITTED` · `BLOCKED BY EXTERNAL DEPENDENCY`

| Area / Requirement | Verification Artifact / Command | Current Status | Notes / Blocking Dependency |
| --- | --- | --- | --- |
| 1. CareBridge 8-Section Web UI (iPad/Desktop) | `src/components/carebridge/CareBridgeModule.tsx` | `TESTED` | Responsive layout, 44px touch targets, 7-item Care Overview, uppercase 4-bucket Brief, Exact Payload Preview. |
| 2. Non-Diagnostic & PHI Data Minimization Guard | `src/components/carebridge/utils/carebridgeEngine.ts`, `src/server/carebridgeAtlassianService.ts` | `TESTED` | Blocks SSN, MRN, DOB, lab/diagnosis text locally and server-side (`npm run test:carebridge`). |
| 3. Server-Side Credential & Redirect Safety | `src/server/carebridgeAtlassianService.ts` (`safeAtlassianFetch`, `sanitizeCareBridgeErrorText`) | `TESTED` | HTTPS + `*.atlassian.net` / `api.atlassian.com` allowlist, `redirect: 'manual'`, dynamic credential redaction. |
| 4. Read-Only Atlassian Verifier (`CR2` / Desk `2` / Type `5`) | `GET /api/carebridge/atlassian/verify` | `BLOCKED BY EXTERNAL DEPENDENCY` | Code & unit tests pass; live server env `ATLASSIAN_SITE_URL` in AI Studio Secrets fails validation (32 chars, missing `.atlassian.net`) until user updates Secret to `https://zenieverse.atlassian.net`. |
| 5. Explicitly Authorized JSM Test-Request & Creation UI | `CareBridgeAtlassianSections.tsx` | `TESTED` | Locked until status = `Connected`, requires Privacy Consent + Transmission Preview confirmation. |
| 6. Confluence Knowledge Hub & Source/AI Separation | `CareBridgeAtlassianSections.tsx`, `src/server/carebridgeAiService.ts` | `TESTED` | Consent-gated CQL lookup + PII-scrubbed Gemini `gemini-4-hydrogen` labeled Unverified. |
| 7. Distinct CareBridge Forge Manifest (`nodejs22.x`) | `apps/carebridge-forge/manifest.yml`, `validate-manifest.mjs` | `TESTED` | Distinct `app.id` placeholder, `jiraServiceManagement:portalRequestDetailPanel`, Jira/Confluence modules, `rovo:agent` + 4 `action`s. |
| 8. CareBridge Forge Backend & UI Bundle | `apps/carebridge-forge/src/*`, `static/carebridge-ui/app.js` | `TESTED` | `npm --prefix apps/carebridge-forge run build:ui`, `typecheck`, `validate:manifest` pass. |
| 9. HatBridge & Existing Dr. T Modules Preservation | `npm run test:hatbridge`, `src/App.tsx`, `src/components/layout/Navbar.tsx` | `TESTED` | Zero HatBridge or Dr. T regressions; distinct Forge folder & storage keys. |
| 10. Firestore Blueprint & Immutable Audit Rules | `firebase-blueprint.json`, `firestore.rules`, `test-firestore-security-rules.ts` | `TESTED` | Owner-isolated collections & `allow update, delete: if false;` audit rules verified locally; remote `firebase deploy --only firestore:rules` needed externally. |
| 11. Live `forge register` / `deploy` / `install` | `docs/CAREBRIDGE_FORGE_SETUP.md` | `BLOCKED BY EXTERNAL DEPENDENCY` | Forge CLI not installed in AI Studio sandbox; must be run in GitHub Codespaces (`forge register`, `forge deploy`, `forge install`). |
| 12. Demo Script, Architecture Diagram & Devpost Copy | `docs/CAREBRIDGE_DEMO_SCRIPT.md`, `docs/CAREBRIDGE_CODEGEIST_SUBMISSION.md` | `READY FOR REVIEW` | Final screenshots (<5m video) & Devpost submission depend on live Atlassian secret fix + Forge deployment. |
