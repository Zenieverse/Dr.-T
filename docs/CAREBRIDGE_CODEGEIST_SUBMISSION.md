# Dr. T — CareBridge (Codegeist 2026 Devpost Submission Package)

## Devpost Metadata Fields (Copy-Ready)

- **Project Title:** `Dr. T — CareBridge`
- **Tagline (Short Description):** `Healthcare context. Connected workflows. Better follow-through.`
- **Track / Primary Category:** `Apps for Specialized Industries` (Healthcare Care-Navigation & Post-Visit Continuity)
- **Competition Deadline:** December 22, 2026, at 12:00 PM PST (`https://codegeist2026.devpost.com/`)
- **Repository:** `https://github.com/Zenieverse/Dr.-T`
- **Atlassian Target Site:** `https://zenieverse.atlassian.net` (`CareBridge2`, Key `CR2`, Service Desk `2`, Request Type `5`)
- **Built With:** Atlassian Forge (`nodejs22.x`), Jira Service Management Cloud REST & Portal Modules, Confluence Cloud REST & Content Actions, Atlassian Rovo (`rovo:agent` + 4 `action` modules), React, TypeScript, Tailwind CSS, Express, Google Gemini (`gemini-4-hydrogen`), Firebase Firestore.

---

## Devpost Bonus Category Alignment (Verified Honestly)

- **Best Agents (`rovo:agent` + 4 `action` modules):** **Eligible once `apps/carebridge-forge/` is deployed (`forge deploy` + `forge install`).** CareBridge includes a genuine Rovo agent (`carebridge-navigator`) with 4 read-only `GET` action modules and strict non-diagnostic / unverified labeling rules.
- **Best MCP App / Best Teamwork Graph Integration / Best Marketplace-Published App:** **Not implemented / Not claimed.** CareBridge focuses squarely on Apps for Specialized Industries (+ Best Agents upon live Forge deployment).

---

## Required Devpost Essay Sections

### 1. Inspiration
Patients, caregivers, and clinic care coordinators routinely lose track of non-emergency post-visit follow-ups—referrals stall across patient portals, transport requests vanish in email threads, and discharge guidance sits buried in clinic documentation. Returning to coordinate care days later forces everyone to piece together what was officially confirmed versus what was casually noted versus what is still missing.

We built **Dr. T — CareBridge** directly inside the **Dr. T** healthcare ecosystem and integrated it deeply with **Atlassian Jira Service Management, Confluence, and Rovo** so families and care teams maintain clear, privacy-protected continuity without ever blurring source facts, human decisions, and AI drafts.

### 2. What it does
Dr. T — CareBridge pairs a responsive iPad- and desktop-ready **8-section CareBridge Workspace** (`?tab=carebridge`) with an independent **Atlassian Forge application** (`apps/carebridge-forge/`):
1. **Care Overview:** Continuity snapshot summarizing active navigation context, open tasks, latest activity, real-time Service Desk verification state (`Connected` / `Unauthorized` / `Permission Denied` / `Unavailable`), outstanding consents, missing context gaps, and unconfirmed suggested next administrative actions.
2. **Care Coordination:** Non-emergency follow-up task ledger with Task ID, context reference, assignee, priority (`Routine`, `Soon`, `Time-Sensitive`), due date, source provenance (`Verified Source` vs. `User Recorded`), and immutable per-task history—protected by real-time SSN, MRN, DOB, and clinical diagnosis blockers.
3. **Clinical Knowledge Hub:** Consent-gated Confluence Cloud REST search separating verbatim official source excerpts and direct URLs from clearly marked unverified AI summaries.
4. **Jira Service Management (`CR2` / Desk `2` / Request `CR2-1`):** Strictly read-only connection verification against `https://zenieverse.atlassian.net` (`/rest/api/3/myself`, `/rest/servicedeskapi/servicedesk/2`, `/requesttype/5/field`, `/mypermissions`), plus a **Post-Submission Follow-Up Workspace** tracking `CR2-1` with explicit 6-state UI handling (`Connected`, `Consent required`, `Follow-up available`, `Follow-up blocked`, `Request not found`, `Verification unavailable`), read-only status refresh, and human-approved follow-up action previews (`comment`, `notification`, `transition`, `field_update`).
5. **Rovo Healthcare Assistant (`carebridge-navigator`):** Runs 4 Forge `action` modules (`summarize-care-context`, `retrieve-care-knowledge`, `summarize-followup-tasks`, `prepare-care-handoff`) inside Atlassian Rovo and via CareBridge's PII-scrubbed Gemini synthesis endpoint—plus sanitized follow-up status drafts clearly marked as requiring human review.
6. **Care Re-entry Brief:** Structured 4-bucket handoff separating `VERIFIED SOURCE INFORMATION`, `USER-RECORDED INFORMATION`, `AI-GENERATED SUGGESTION — UNCONFIRMED`, and `MISSING OR UNAVAILABLE CONTEXT`.
7. **Privacy & Consent:** Default-off, revocable, expiring **Jira Service Management Follow-Up Consent** (`cb-jsm-followup-v1`) enforced server-side on every follow-up request (prior submissions never grant blanket follow-up access), configurable retention auto-pruning (`30`/`90`/`365`/`manual`), JSON workspace export, and permanent user purge.
8. **Activity & Audit History:** Dual client workspace history + owner-isolated append-only server audit trail (`consent_granted`, `consent_withdrawn`, `followup_status_retrieved`, `phi_scan_passed`, `phi_scan_blocked`, `proposed_action_previewed`, `human_approval_granted`, `human_approval_rejected`, `operation_submitted`, `operation_succeeded`, `operation_failed`, `ai_summary_drafted`) containing zero tokens or raw PHI.

### 3. How we built it
- **Web Workspace & Storage Isolation:** React, TypeScript, and Tailwind CSS with 44px minimum touch hitboxes for iPad Safari, backed by owner-isolated Firestore (`carebridge_tasks`, `carebridge_briefs`, `carebridge_consents`, `carebridge_integrations`, `carebridge_audit_logs`) with immutable audit log rules (`allow update, delete: if false;`) and clean local browser fallback.
- **Hardened Server Adapter (`src/server/`):** Express API proxy reading `ATLASSIAN_*` secrets exclusively server-side, enforcing `https://*.atlassian.net` allowlisting, `redirect: 'manual'` cross-origin redirect blocking, `12_000ms` timeouts (`504 ATLASSIAN_TIMEOUT`), `GET`-only transient retries (`POST`/`PUT` never auto-retried), single-use human-approved previews with idempotency protection, unified client+server PHI detection and redaction (`src/utils/carebridgePhiGuard.ts`), per-route rate limiting, and mandatory PII scrubbing prior to Gemini `gemini-4-hydrogen`.
- **Independent Forge App (`apps/carebridge-forge/`):** Distinct Forge manifest (`nodejs22.x`) preserving sibling HatBridge (`apps/hatbridge-forge/`) completely untouched, using `@forge/api` (`asUser()`), `@forge/kvs`, Custom UI (`jiraServiceManagement:portalRequestDetailPanel`, `jira:issuePanel`, `jira:globalPage`, `confluence:globalPage`, `confluence:contentAction`), and 4 Rovo `GET` actions.

### 4. Challenges we ran into
- Preventing accidental leakage of sensitive identifiers (SSN, labeled/unlabeled MRN, DOB, contacts, diagnoses, lab findings, clinical measurements) or server credentials (`ATLASSIAN_API_TOKEN`, email addresses) across errors, drafts, and audit logs while still permitting clean synthetic test disclaimers—solved via the shared deterministic `scanAndRedactCareBridgePhi` engine (`src/utils/carebridgePhiGuard.ts`), `redirect: 'manual'` off-origin blocks, and dynamic error scrubbing.
- Guaranteeing safe post-submission follow-up writes without duplicate ticket/comment creation on transient errors—solved via single-use expiring action previews, idempotency deduplication keys, human-approval enforcement, `GET`-only retry isolation, and single read-back verification.

### 5. Accomplishments that we're proud of
- Full end-to-end architecture authored directly across iPad Safari + Google AI Studio Build while keeping zero hardcoded secrets, clean TypeScript/lint passing, 40+ automated regression and Firestore rule checks, and complete separation from HatBridge and companion Dr. T modules.

### 6. What we learned
- Healthcare-adjacent workflows in specialized industries demand explicit human confirmation before external ticket creation, strict provenance labeling on every AI sentence, and honest state reporting (`Unavailable` / `Unauthorized` / `Permission Denied` / `Connected`) rather than optimistic status flags.

### 7. What's next for Dr. T — CareBridge
- Live Forge registration, deployment, and installation onto `https://zenieverse.atlassian.net` (`CareBridge2` / `CR2`) from GitHub Codespaces (`docs/CAREBRIDGE_FORGE_SETUP.md`), followed by clinic coordinator usability testing and Devpost submission prior to **December 22, 2026 (12:00 PM PST)**.

---

## Testing & Verification Instructions for Judges

1. **Web Workspace Preview:** Open Dr. T -> select the **CareBridge** tab (`?tab=carebridge`). Enable optional Sample Preview Sandbox on Care Overview or sign in with Google/Firebase Auth to exercise live JSM follow-up verification against `https://zenieverse.atlassian.net` (`CareBridge2` / `CR2`, Desk `2`, Request Type `5`, synthetic baseline `CR2-1`).
2. **Automated Verification Suite:**
   - `npm run test:carebridge` (`15/15` passing: task lifecycle, PHI minimization, 4-bucket brief isolation, JSM/Confluence guards, host/redirect lock, read-only verifier, Gemini PII scrubbing, Forge core + 4 Rovo actions, Express API, consent/approval/audit, Firestore rules)
   - `npx tsx scripts/test-firestore-security-rules.ts` (`33/33` passing including `carebridge_*` owner isolation, query rules, and immutable audit logs; deployed to Firebase project `gen-lang-client-0611153209`)
   - `npm run test:hatbridge` (`12/12`), `npx tsx scripts/test-health-alert.ts` (`46/46`), `npm run test:population-health` (`62/62`), `npm run test:presage` (all groups passing)
   - `node apps/carebridge-forge/scripts/validate-manifest.mjs` & `npm --prefix apps/carebridge-forge run typecheck`
3. **Technical Safety Disclosure:** CareBridge is a non-diagnostic administrative care-navigation and follow-up coordination tool. It does not provide medical advice, diagnosis, triage, or prescriptions, and is not certified as a HIPAA-covered EHR system.


## Release Verification Status — 2026-11-26

The merged baseline includes PR #5 (`83a2b3490ea5625c62ce53a71da084776f79c4c5`) and PR #6 (`f5c8f132f411aa38800bab6cd549a0d247c7da03`). Reported Google AI Studio Build checks include CareBridge (15/15), HatBridge (12/12), Firestore security (33/33), TypeScript lint, Forge UI build/typecheck, and manifest validation. The live read-only Atlassian verifier reported Connected, and CR2-1 remained To Do.

**Not yet released:** the seven-file Forge schema/doc patch is prepared but not yet pushed or merged. The Forge app remains unregistered, undeployed and uninstalled until interactive Forge authentication and the CLI lifecycle are completed. Production build and signed-in browser walkthrough remain outstanding. Do not claim bonus eligibility dependent on a live deployed/installed Rovo agent until verified.
