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
4. **Jira Service Management (`CR2` / Desk `2`):** Strictly read-only connection verification against `https://zenieverse.atlassian.net` (`/rest/api/3/myself`, `/rest/servicedeskapi/servicedesk/2`, `/requesttype/5/field`, `/mypermissions`) before unlocking data-minimized JSM ticket creation with an **Exact Request & Data Transmission Preview** and explicit confirmation checkbox.
5. **Rovo Healthcare Assistant (`carebridge-navigator`):** Runs 4 Forge `action` modules (`summarize-care-context`, `retrieve-care-knowledge`, `summarize-followup-tasks`, `prepare-care-handoff`) inside Atlassian Rovo and via CareBridge's PII-scrubbed Gemini synthesis endpoint.
6. **Care Re-entry Brief:** Structured 4-bucket handoff separating `VERIFIED SOURCE INFORMATION`, `USER-RECORDED INFORMATION`, `AI-GENERATED SUGGESTION — UNCONFIRMED`, and `MISSING OR UNAVAILABLE CONTEXT`.
7. **Privacy & Consent:** Default-off outbound integrations, configurable retention auto-pruning (`30`/`90`/`365`/`manual`), JSON workspace export, and permanent user purge.
8. **Activity & Audit History:** Append-only chronological audit trail filterable by subsystem.

### 3. How we built it
- **Web Workspace & Storage Isolation:** React, TypeScript, and Tailwind CSS with 44px minimum touch hitboxes for iPad Safari, backed by owner-isolated Firestore (`carebridge_tasks`, `carebridge_briefs`, `carebridge_consents`, `carebridge_integrations`, `carebridge_audit_logs`) with immutable audit log rules (`allow update, delete: if false;`) and clean local browser fallback.
- **Hardened Server Adapter (`src/server/`):** Express API proxy reading `ATLASSIAN_*` secrets exclusively server-side, enforcing `https://*.atlassian.net` allowlisting and `redirect: 'manual'` cross-origin redirect blocking, regex + header scrubbing (`sanitizeCareBridgeErrorText`), per-route rate limiting, and mandatory PII scrubbing prior to Gemini `gemini-4-hydrogen`.
- **Independent Forge App (`apps/carebridge-forge/`):** Distinct Forge manifest (`nodejs22.x`) preserving sibling HatBridge (`apps/hatbridge-forge/`) completely untouched, using `@forge/api` (`asUser()`), `@forge/kvs`, Custom UI (`jiraServiceManagement:portalRequestDetailPanel`, `jira:issuePanel`, `jira:globalPage`, `confluence:globalPage`, `confluence:contentAction`), and 4 Rovo `GET` actions.

### 4. Challenges we ran into
- Preventing accidental leakage of sensitive identifiers (SSN, MRN, DOB, lab findings) or server credentials (`ATLASSIAN_API_TOKEN`, email addresses) across both error paths and browser previews—solved via dual client+server data minimization checks, `redirect: 'manual'` off-origin blocks, and dynamic error scrubbing.
- Ensuring zero silent mixing between Sample Sandbox previews, user notes, AI drafts, and verified Atlassian records—solved via explicit `dataOrigin` tagging (`live_jsm` vs `sample_fixture`) and strict 4-bucket brief isolation.

### 5. Accomplishments that we're proud of
- Full end-to-end architecture authored directly across iPad Safari + Google AI Studio Build while keeping zero hardcoded secrets, clean TypeScript/lint passing, 40+ automated regression and Firestore rule checks, and complete separation from HatBridge and companion Dr. T modules.

### 6. What we learned
- Healthcare-adjacent workflows in specialized industries demand explicit human confirmation before external ticket creation, strict provenance labeling on every AI sentence, and honest state reporting (`Unavailable` / `Unauthorized` / `Permission Denied` / `Connected`) rather than optimistic status flags.

### 7. What's next for Dr. T — CareBridge
- Live Forge registration, deployment, and installation onto `https://zenieverse.atlassian.net` (`CareBridge2` / `CR2`) from GitHub Codespaces (`docs/CAREBRIDGE_FORGE_SETUP.md`), followed by clinic coordinator usability testing and Devpost submission prior to **December 22, 2026 (12:00 PM PST)**.

---

## Testing & Verification Instructions for Judges

1. **Web Workspace Preview:** Open Dr. T -> select the **CareBridge** tab (`?tab=carebridge`). Enable optional Sample Preview Sandbox on Care Overview or connect live JSM/Confluence via server-side environment variables (`docs/CAREBRIDGE_FORGE_SETUP.md`).
2. **Automated Verification Suite:**
   - `npm run test:carebridge` (Task lifecycle, PHI minimization, 4-bucket brief isolation, JSM/Confluence guards, host/redirect lock, read-only verifier, Gemini PII scrubbing, Forge core + 4 Rovo actions, Express API, Firestore rules)
   - `npm run test:hatbridge` & `npx tsx scripts/test-firestore-security-rules.ts`
   - `node apps/carebridge-forge/scripts/validate-manifest.mjs` & `npm --prefix apps/carebridge-forge run typecheck`
3. **Technical Safety Disclosure:** CareBridge is a non-diagnostic administrative care-navigation and follow-up coordination tool. It does not provide medical advice, diagnosis, triage, or prescriptions, and is not certified as a HIPAA-covered EHR system.
