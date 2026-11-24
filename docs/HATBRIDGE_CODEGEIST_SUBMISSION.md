# Codegeist 2026 Devpost Submission Draft — Dr. T — HatBridge

## Project Title
**Dr. T — HatBridge**

## Tagline
**Many Hats. One Life. Nothing Important Lost.**

## Category & Track
- **Primary Platform:** Atlassian Forge (`apps/hatbridge-forge/`)
- **Selected Category:** **Apps for Specialized Industries**
- **Rovo / Assignable Agent Note:** `rovo:agent` (`hatbridge-context-navigator`) and 4 dedicated action functions (`getReentryBrief`, `searchAuthorizedDecisions`, `prepareRoleHandoff`, `suggestNextAction`) are implemented and verified in local unit/handler tests. Live Forge registration, deployment, and Rovo verification on an Atlassian Cloud site are still required before claiming live Rovo functionality.

---

## 1. Inspiration
Clinicians, university deans, researchers, engineers, and family caregivers do not burn out because of a single ticket—they struggle because of **fragmented role transitions**. Switching between clinical duties, academic governance, Jira engineering priorities, Confluence architecture decisions, and protected family responsibilities forces people to rebuild from scratch what they were doing, why a decision was made, who is waiting on them, and what can safely wait. **HatBridge** (*"Many Hats. One Life. Nothing Important Lost."*) preserves continuity across every hat without crossing personal and workplace privacy boundaries.

## 2. What It Does
Dr. T — HatBridge connects personal multi-hat continuity in Dr. T (`?tab=hatbridge` / `#hatbridge`) with an Atlassian Forge companion app (`apps/hatbridge-forge/`):
- **My Hats:** Organizes work and personal hats (`clinical_academic` and `general_professional` packs), each tagged with explicit classification (`private_personal`, `work_team`, `work_restricted`).
- **Today Bridge:** Aggregates commitments across hats, calculates workload against user-chosen sustainable hours, and surfaces cross-role schedule conflicts against protected family/rest blocks without ever silently moving calendar commitments.
- **Context Capture:** Captures manual notes, Jira issues, and Confluence pages into a chosen Hat while maintaining source references.
- **Decision Memory:** Records decisions with rationale, revision history, and Confluence/Jira attribution; answers grounded questions without exposing `private_personal` entries when disallowed.
- **Handoffs:** Executes *Finish this context -> Save handoff -> Switch role* transitions when stepping out of a Hat.
- **Time Protection:** Guards protected human recovery, family, and rest windows inside the owner's private vault.
- **Re-entry Brief (Signature Feature):** Displays Active Hat, Last Relevant Activity, Confirmed Decisions, Unfinished Commitments, Linked Jira & Confluence References, Next Actionable Step, and Items That Can Safely Wait—explicitly separating **Verified Source Information**, **User-Recorded Information**, **AI-Generated Suggestions**, and **Missing / Unavailable Context** (never inventing dates, completions, or approvals).

## 3. How We Built It (Verified Stack Only)
- **Atlassian Forge (`nodejs22.x`, `@forge/api`, `@forge/kvs`, `@forge/resolver`, `@forge/bridge`):** Powers `jira:issuePanel`, `jira:globalPage`, `confluence:globalPage`, `confluence:contentAction`, and `rovo:agent` + 4 `action` modules inside `apps/hatbridge-forge/`. All Jira/Confluence API requests execute via `api.asUser()`.
- **Jira & Confluence:** Integrated both via Forge resolvers/Custom UI (`router.open()`, issue/page capture, confirmed Jira creation, Confluence decision linking) and optional server-side REST routes (`/api/hatbridge/atlassian/*` protected by `*.atlassian.net` SSRF allowlist and explicit confirmation gates).
- **Atlassian Rovo:** Implemented agent `hatbridge-context-navigator` backed by 4 dedicated TypeScript handlers (`getReentryBrief`, `searchAuthorizedDecisions`, `prepareRoleHandoff`, `suggestNextAction`) in `apps/hatbridge-forge/src/rovoActions.ts` and `rovoCore.ts`.
- **Google Gemini (`@google/genai`, `gemini-4-hydrogen`):** Optional server-side continuity synthesis (`/api/hatbridge/ai/reason`) gated by explicit user consent, JSON schema output, `18s` timeout guard, and deterministic fallback when `GEMINI_API_KEY` is unset.
- **Cloud Firestore & Firebase Auth:** Persists owner-scoped personal continuity collections (`hatbridge_roles`, `hatbridge_context_items`, `hatbridge_decisions`, `hatbridge_handoffs`, `hatbridge_reentry_briefs`, `hatbridge_time_blocks`, `hatbridge_preferences`, `hatbridge_integrations`, `hatbridge_audit_events`) under strict `userId == request.auth.uid` security rules, with sanitized client browser storage when unauthenticated.
- **React, TypeScript & Node.js (Express):** Powers the integrated Dr. T Web Mission Control frontend, REST bridge, manifest validation script (`validate-manifest.mjs`), and automated test suites.

---

## 4. Technology Requirement Answer
> **Prompt:** *"Explain how your project meets the main technology requirement. Name each product you used and what it does in your project."*

**Verified Answer:**
HatBridge satisfies Codegeist's Atlassian Forge requirement through a native **Atlassian Forge** application (`apps/hatbridge-forge/manifest.yml`, runtime `nodejs22.x`) integrated directly with the **Dr. T** web workspace:
1. **Atlassian Forge (Implemented & Validated Locally; Pending Cloud CLI Deploy):** Hosts our Forge `manifest.yml`, resolver definitions (`@forge/resolver`), per-user Forge Key-Value Store (`@forge/kvs`, keyed strictly by verified `context.principal.accountId || context.accountId`), and Custom UI bundled with `@forge/bridge` (`invoke`, `view`, `router.open`). Local manifest integrity, handler exports, and TypeScript compilation pass; live `forge register`, `forge lint`, `forge deploy`, and `forge install` remain pending `@forge/cli` authentication on an Atlassian Cloud site.
2. **Jira (Implemented & Unit/ACL Tested; Pending Live Site Install):** Provides a `jira:issuePanel` (`hatbridge-jira-issue-panel`) and `jira:globalPage` (`hatbridge-jira-hub`) using `api.asUser()`. Users capture issues into workplace Hats, link tasks, create new Jira issues only after explicit UI + backend confirmation (`confirmedByUser === true`), and open issues via `@forge/bridge` `router.open()`.
3. **Confluence (Implemented & Unit/ACL Tested; Pending Live Site Install):** Provides a `confluence:globalPage` (`hatbridge-confluence-hub`) and `confluence:contentAction` (`hatbridge-confluence-decision-link`, `viewportSize: medium`) via `api.asUser()` so users can capture Confluence pages into a Hat and record source-attributed Decisions directly from a page.
4. **Atlassian Rovo (Implemented & Handler Tested; Pending Live Rovo Verification):** Defines `rovo:agent` (`hatbridge-context-navigator`) and 4 distinct read-only/draft action modules (`get-reentry-brief` -> `rovoActions.getReentryBrief`, `search-authorized-decisions` -> `rovoActions.searchAuthorizedDecisions`, `prepare-role-handoff` -> `rovoActions.prepareRoleHandoff`, `suggest-next-action` -> `rovoActions.suggestNextAction`) that enforce user permissions and separate confirmed decisions from inferred suggestions.
5. **Google Gemini (`gemini-4-hydrogen` via `@google/genai`, Consent & Timeout Tested; Requires Runtime Key):** Synthesizes optional Re-entry Briefs, handoff drafts, and continuity queries on `/api/hatbridge/ai/reason` with explicit user opt-in, `private_personal` exclusion by default, strict JSON schema output, and safe fallback when `GEMINI_API_KEY` is absent.
6. **Firebase Cloud Firestore & Auth (Implemented & Security-Rule Tested):** Persists user-owned HatBridge continuity collections in Firestore (`firestore.rules` + `firebase-blueprint.json`) under owner-only read/write rules while keeping unrelated Dr. T modules isolated.
7. **React, TypeScript & Node.js / Express (Implemented, Compiled & Tested):** Runs the responsive Mission Control UI (`HatBridgeModule.tsx`), deterministic engine (`hatbridgeEngine.ts`), Atlassian/Gemini REST endpoints (`hatbridgeService.ts`), Forge UI (`ui/src/main.ts`), and automated verification scripts (`test-hatbridge.ts`).

---

## 5. Challenges, Accomplishments, Lessons & Next Steps
- **Challenges:** Enforcing hard boundaries between `private_personal` human/caregiver records and shared Jira/Confluence spaces; ensuring sandboxed Forge Custom UI navigation uses `router.open()` safely instead of blocked `<a target="_blank">` links; verifying that AI never elevates unconfirmed suggestions into confirmed decisions or invented deadlines; and sanitizing PII/auth tokens from all client/server logs.
- **Accomplishments:** Implemented complete Forge modules and 4 dedicated Rovo handlers, built deterministic + Gemini-synthesized 8-question Re-entry Briefs with 4-bucket provenance labeling, verified Firestore owner security rules, and passed all HatBridge, manifest, security, isolation, and sibling regression suites.
- **What We Learned:** Productivity and AI tools become trustworthy only when they strictly separate verified external source records, user-recorded human memory, AI-inferred suggestions, and missing context gaps (`"Not available in the connected context."`).
- **What's Next:** Install `@forge/cli` on a developer workstation, run `forge register`, `forge lint`, `forge deploy -e development`, and `forge install` into Jira & Confluence on an Atlassian Cloud site, verify real Atlassian & Rovo flows end-to-end, capture genuine screenshots/demo video, and submit to Devpost.

---

## 6. Devpost Image Gallery Plan (Genuine Screenshots Only)
Capture these 8 screenshots from verified running screens after Forge installation (never represent demo sandbox cards as live Atlassian data):
1. **`01-hatbridge-overview.png`** — Dr. T — HatBridge Mission Control shell with active Hat switcher, Quick Capture, and Finish & Switch header.
2. **`02-my-hats.png`** — My Hats configuration view showing clinical/academic and general workplace hats alongside `private_personal` isolation tags.
3. **`03-today-bridge.png`** — Today Bridge cross-role overview with workload meter and manual Protected Family Time overlap resolution card.
4. **`04-reentry-brief.png`** — Signature 8-question Re-entry Brief showing Active Hat, Confirmed Decisions, Next Step, What Can Safely Wait, and the 4-bucket Provenance Breakdown card.
5. **`05-jira-integration.png`** — Live Jira Issue Panel (`hatbridge-jira-issue-panel`) capturing a real Jira issue into a Hat and rendering safe `router.open()` links.
6. **`06-confluence-integration.png`** — Confluence Content Action (`hatbridge-confluence-decision-link`) recording a Decision backed by a real Confluence page.
7. **`07-rovo-agent.png`** — Live Rovo chat invoking `HatBridge Context Navigator` (`getReentryBrief` / `searchAuthorizedDecisions`) with grounded citations.
8. **`08-privacy-and-architecture.png`** — Settings & Privacy controls showing AI consent toggles, redaction policy, audit log, JSON export, and deletion controls.
