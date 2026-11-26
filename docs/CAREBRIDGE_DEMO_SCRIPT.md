# Dr. T — CareBridge Demo & Recording Package (Codegeist 2026)

**Target Maximum Video Length:** 4 minutes 20 seconds (strictly under the 5-minute Codegeist limit)  
**Format:** Screen capture (1920x1080 MP4/WebM) with live narration + crisp subtitles/captions  
**Target Atlassian Site:** `https://zenieverse.atlassian.net` (`CareBridge2` / `CR2`, Service Desk `2`, Request Type `5`)  
**Recording Rule:** Never display API tokens, email credentials, raw browser storage, or unverified mockups presented as live Atlassian data.

---

## 1. Architecture Diagram (Include at 0:30 or in Devpost Gallery)

```
┌───────────────────────────────────────────────────────────────────────────┐
│                         DR. T WEB APP (?tab=carebridge)                   │
│  React + Tailwind (iPad/Desktop) · 8 Sections · Owner-Isolated Firestore  │
│  [1.Overview] [2.Coordination] [3.Confluence] [4.JSM] [5.Rovo] [6.Brief]  │
└───────────────────────────────┬───────────────────────┬───────────────────┘
                                │ HTTPS (Explicit       │ Firebase Auth +
                                │ Consent & Confirm)    │ Owner Rules
                                ▼                       ▼
┌──────────────────────────────────────────┐   ┌────────────────────────────┐
│  DR. T EXPRESS SERVER (/api/carebridge)  │   │  FIRESTORE (carebridge_*)  │
│  • Server-side Secrets (ATLASSIAN_*)     │   │  • tasks / briefs          │
│  • Strict *.atlassian.net + No-Redirect  │   │  • consents / integrations │
│  • PHI & Diagnosis Pattern Blocker       │   │  • immutable audit logs    │
│  • PII-Scrubbed Gemini 4 Hydrogen Proxy  │   └────────────────────────────┘
└───────────────────────┬──────────────────┘
                        │ REST v3 + JSM ServiceDesk API
                        ▼
┌───────────────────────────────────────────────────────────────────────────┐
│            ATLASSIAN CLOUD (https://zenieverse.atlassian.net)             │
│  • JSM Project CareBridge2 (Key: CR2 · Service Desk 2 · Request Type 5)   │
│  • Confluence Spaces (asUser() / authorized REST read-only lookup)        │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │           CAREBRIDGE FORGE APP (apps/carebridge-forge/)             │  │
│  │  • JSM Portal Panel (carebridge-jsm-portal-panel)                   │  │
│  │  • Jira Issue Panel + Jira/Confluence Global Hubs                   │  │
│  │  • Rovo Agent: carebridge-navigator + 4 Action Modules              │  │
│  │  • Forge KVS (cb:<accountId>:*) with @forge/api asUser()            │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 2. 9-Step Demonstration Sequence & Narration (~4m 20s)

### Step 1 — CareBridge Care Overview & Non-Diagnostic Safety Boundary (0:00 – 0:30)
- **Visual:** Open Dr. T -> `?tab=carebridge` -> **1. Care Overview** (iPad / desktop viewport). Highlight the 7-item continuity readout, connection badge, and the **Non-Emergency & Non-Diagnostic Boundary** banner.
- **On-Screen Caption:** `Dr. T — CareBridge | Non-Emergency Healthcare Care-Navigation`
- **Narration:**  
  "Patients, caregivers, and clinic coordinators lose continuity between discharge instructions, scheduling portals, and follow-up tasks. Dr. T — CareBridge integrates Jira Service Management, Confluence, and Rovo inside Dr. T while enforcing a strict non-diagnostic boundary: administrative coordination only, never medical diagnosis or clinical triage."

### Step 2 — Live Atlassian `Connected` Verification (`CR2` / Desk `2` / Request Type `5`) (0:30 – 1:00)
- **Visual:** Open **4. Jira Service Management** (`https://zenieverse.atlassian.net` / Desk `2` / `CR2`). Click **Verify Connection (Read-Only)** and show all 5 `VERIFIED` checks (`Server-side credential isolation`, `Atlassian REST authentication`, `Service Desk 2 CareBridge2 / CR2`, `Request type 5 Submit a request or incident`, `Account permissions BROWSE_PROJECTS + CREATE_ISSUES`) without creating any new ticket.
- **On-Screen Caption:** `Live Verified: https://zenieverse.atlassian.net · Desk 2 (CR2) · Request Type 5`

### Step 3 — Default-Off Consent State (`Consent required`) (1:00 – 1:25)
- **Visual:** In the **Post-Submission Follow-Up Workspace** for verified synthetic request `CR2-1`, show that Follow-Up Consent starts disabled by default (`Consent required`) even after a prior JSM submission, blocking follow-up reads/actions until explicitly opted in.
- **On-Screen Caption:** `Default-Off Consent (cb-jsm-followup-v1): Prior Submission Grants Zero Blanket Access`

### Step 4 — Granting Follow-Up Consent with Disclosure & Expiration (1:25 – 1:50)
- **Visual:** Open the **Jira Service Management Follow-Up Consent** disclosure card (here or in **7. Privacy & Consent**), review the plain-language disclosure (`cb-jsm-followup-v1`), choose an expiration window (e.g., `7 days`), and click **Grant Follow-Up Consent**. Watch the UI transition to `Follow-up available`.
- **On-Screen Caption:** `Server-Enforced Expiring & Revocable Per-User Consent Granted`

### Step 5 — Retrieving Live `CR2-1` Status Read-Only (1:50 – 2:15)
- **Visual:** Click **Refresh Request Status (Read-Only)** for `CR2-1` (`https://zenieverse.atlassian.net/servicedesk/customer/portal/2/CR2-1`). Confirm live status `To Do`, timestamps, and read-back URL appear without modifying the ticket.
- **On-Screen Caption:** `Live Read-Only Status Check: CR2-1 (Status: To Do)`

### Step 6 — Data Minimization / PHI Guard Blocking Sensitive Input (2:15 – 2:45)
- **Visual:** In **2. Care Coordination** and the **Post-Submission Follow-Up** composer, type a blocked synthetic string containing `MRN: 99812` or `SSN 123-45-6789` (or run **Step 1 · Run Server PHI Scan & Preview Payload**). Show the local and server-side PHI guard blocking transmission and redacting matched patterns. Replace with clean administrative wording (`Confirm outpatient scheduling window`).
- **On-Screen Caption:** `Unified Local + Server PHI Blocker: SSN, MRN, DOB, Contacts, Diagnoses & Labs Blocked`

### Step 7 — Exact Action Preview + Explicit Human Approval Gate (2:45 – 3:20)
- **Visual:** Show **Step 1 · Run Server PHI Scan & Preview Payload** generating a single-use expiring action preview (`comment`, `notification`, `transition`, or `field_update`) paired with **Step 2 · Explicit Human Approval** (`Approve & Execute` vs `Reject`), demonstrating that no state-changing Atlassian write occurs without explicit human confirmation. (Show the approval gate cleanly without adding test clutter to `CR2-1`.)
- **On-Screen Caption:** `Single-Use Payload Preview -> Explicit Human Approval Required Before Any JSM Write`

### Step 8 — Consent Withdrawal & Immutable Privacy-Preserving Audit Trail (3:20 – 3:55)
- **Visual:** Open **7. Privacy & Consent** and **8. Activity & Audit**. Withdraw Follow-Up Consent (`Withdraw Consent`) to confirm immediate re-lock (`Consent required`), show data retention / JSON export / purge controls, and inspect the **Server-Verified Follow-Up & Consent Audit Ledger** (`consent_granted`, `followup_status_retrieved`, `phi_scan_blocked`, `proposed_action_previewed`, `consent_withdrawn`) with `correlationId`, `policyVersion`, and zero credentials or raw PHI.
- **On-Screen Caption:** `Immediate Consent Withdrawal + Owner-Isolated Append-Only Audit Trail`

### Step 9 — Confluence Hub, 4-Bucket Re-entry Brief, Rovo & CareBridge Forge (3:55 – 4:20)
- **Visual:** Open **3. Clinical Knowledge Hub**, **5. Rovo Assistant** (`carebridge-navigator`), and **6. Care Re-entry Brief** highlighting the 4 separate uppercase buckets (`VERIFIED SOURCE INFORMATION`, `USER-RECORDED INFORMATION`, `AI-GENERATED SUGGESTION — UNCONFIRMED`, `MISSING OR UNAVAILABLE CONTEXT`). Show `apps/carebridge-forge/` JSM Portal Panel & Rovo Navigator modules (distinct from HatBridge).
- **On-Screen Caption:** `4-Bucket Provenance Separation · Atlassian Forge + Rovo CareBridge Navigator`

---

## 3. Genuine Screenshot & Video Export Checklist

Verify every item before uploading to YouTube/Vimeo and Devpost:
- [ ] Video duration is under **5 minutes 00 seconds** (target `4:00–4:30`).
- [ ] Video shows real working UI (no mockups claiming fake live connections) and real JSM `CR2` / Confluence / Rovo screens once Forge is deployed from Codespaces.
- [ ] No API tokens, email addresses, `.env` files, or `Authorization` headers appear in any frame.
- [ ] Minimum 5 crisp 16:9 PNG screenshots captured:
  1. `01-carebridge-overview-7item.png` — Care Overview & Non-Diagnostic Banner
  2. `02-carebridge-phi-guard-and-tasks.png` — Care Coordination & Data Minimization Guard
  3. `03-carebridge-jsm-verified-and-portal.png` — JSM Read-Only Verify (`Connected`) + `CR2-1` Tracker + Payload Preview / Approval Gate
  4. `04-carebridge-4bucket-reentry-brief.png` — 4-Bucket Re-entry Brief & Clinical Knowledge Hub
  5. `05-carebridge-rovo-and-privacy-audit.png` — Rovo Navigator (`carebridge-navigator`) + Consent Withdrawal + Immutable Audit Ledger
- [ ] Video uploaded as **Public** or **Unlisted** on YouTube/Vimeo (audio clear, English captions enabled).
