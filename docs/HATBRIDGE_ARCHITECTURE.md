# Dr. T — HatBridge: System Architecture

## 1. Non-Destructive Integration inside Dr. T
HatBridge is added cleanly as a dedicated isolated module (`#hatbridge` / `?tab=hatbridge`) inside the existing Dr. T React + Express + Firebase platform. Existing modules (`Dr. T`, `Three Hats`, `PIANIST`, `Living Sound Garden`, `Population Health`, `Health Alert`, `Presage Sense`, `MicroBiz`, `ChatQuest Live`, `BuildArena`) remain completely intact.

## 2. Two-Tier Runtime Architecture

### Tier A — Dr. T Web Application (`src/`)
- **Client UI (`src/components/hatbridge/`):**
  - `HatBridgeModule.tsx`: Responsive iPad-first shell (`md:` sidebar rail + `<md` horizontal tab bar, `>=44px` touch targets), global search, Quick Capture modal, and section orchestration.
  - `utils/hatbridgeEngine.ts`: Deterministic offline-first engine for Re-entry Brief construction, cross-role conflict detection, daily workload tracking, handoff drafting, and cited Decision Memory Q&A.
  - `services/hatbridgeStorageService.ts`: Signed-in Firestore owner-scoped synchronization (`hatbridge_*` collections) paired with local browser fallback for signed-out exploration.
- **Server Endpoints (`src/server/` registered in `server.impl.ts`):**
  - `hatbridgeService.ts`: Express routes `/api/hatbridge/status`, `/api/hatbridge/ai/reason`, `/api/hatbridge/atlassian/jira/issues`, `/api/hatbridge/atlassian/jira/issue`, and `/api/hatbridge/atlassian/confluence/pages`.
  - `hatbridgeAiService.ts`: Server-side `@google/genai` (`gemini-4-hydrogen`) JSON schema client requiring explicit `aiConsentGranted === true` and reporting missing `GEMINI_API_KEY` honestly.
  - `hatbridgeAtlassianService.ts`: SSRF-protected (`*.atlassian.net` and `api.atlassian.com` `cloudId`) Jira REST v3 & Confluence REST adapter enforcing `work_team`/`work_restricted` classification and `userConfirmed === true` on writes.

### Tier B — Atlassian Forge Application (`apps/hatbridge-forge/`)
- **Runtime:** `nodejs22.x` (`manifest.yml`).
- **Jira & Confluence Modules:** `jira:issuePanel`, `jira:globalPage`, `confluence:globalPage`, `confluence:contentAction`.
- **Rovo Integration:** `rovo:agent` (`hatbridge-context-navigator`) backed by 4 `action` handlers (`get-reentry-brief`, `search-authorized-decisions`, `prepare-role-handoff`, `suggest-next-action`).
- **Forge Storage & User Permissions:** `@forge/kvs` keyed per Atlassian `accountId` (`hatbridge:vault:<accountId>`) and `@forge/api` (`api.asUser()`) so Rovo and Custom UI strictly inherit each user's Jira/Confluence ACLs.
