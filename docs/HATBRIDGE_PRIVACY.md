# Dr. T — HatBridge: Privacy, Safety & Data Boundaries

## 1. Zero Patient Data (PHI) Guarantee
HatBridge models life, leadership, scheduling, and engineering context only. Identifiable patient health records (PHI), lab results, and medical chart fields belong exclusively to Dr. T clinical modules and are never stored in HatBridge roles, handoffs, Jira issues, Confluence pages, or Rovo actions.

## 2. Three-Tier Context Classification
Every HatBridge role, capture, decision, handoff, and brief carries an explicit classification:
1. **`private_personal` (Personal / Family / Rest):**
   - Strictly restricted to the owner's private Firestore/local vault.
   - Blocked by server guardrails (`assertWorkplaceExportAllowed`) from Jira/Confluence exports or Forge KVS sync.
   - Excluded from Gemini AI prompts unless the user explicitly enables `allowPrivatePersonalInAi`.
2. **`work_team` (Workplace Team Context):**
   - Eligible for workplace Atlassian linking and Rovo search when authorized.
3. **`work_restricted` (Restricted Leadership Context):**
   - Treated with sensitivity labels and explicit confirmation before sharing.

## 3. Firestore Security Rules (`firestore.rules`)
All 9 `hatbridge_*` collections enforce strict owner-only isolation (`isOwner(userId)` or `resource.data.userId == request.auth.uid`):
- `/hatbridge_roles/{roleId}`
- `/hatbridge_context_items/{itemId}`
- `/hatbridge_decisions/{decisionId}`
- `/hatbridge_handoffs/{handoffId}`
- `/hatbridge_reentry_briefs/{briefId}`
- `/hatbridge_time_blocks/{blockId}`
- `/hatbridge_preferences/{userId}`
- `/hatbridge_integrations/{userId}`
- `/hatbridge_audit_events/{eventId}` (append-only from user session; client updates denied; deletion allowed on full account data purge).

## 4. Human-in-the-Loop & Non-Mutation Guarantees
- **No Auto-Rescheduling:** Overlapping commitments with protected family/rest blocks trigger visible conflict alerts requiring explicit user approval.
- **Confirmed Writes Only:** Jira issue creation rejects requests where `userConfirmed !== true` (web API) or `confirmedByUser !== true` (Forge backend).
- **Explicit AI Consent:** Gemini calls return HTTP 403 (`HatBridgeAiConsentError`) unless `aiConsentGranted === true`.
- **Permission-Scoped Rovo:** All Forge Rovo actions execute via `api.asUser().requestJira(...)` and `api.asUser().requestConfluence(...)`, never bypassing Atlassian permissions.
