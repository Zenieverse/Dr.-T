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

## 2. Scene-by-Scene Shot List & Narration (~4m 20s)

### Scene 1 — Problem & Clinical Safety Boundary (0:00 – 0:45)
- **Visual:** Open Dr. T -> `?tab=carebridge` -> **1. Care Overview** (iPad / desktop viewport). Point at the 7-item continuity readout, connection badge, and the **Non-Emergency & Non-Diagnostic Boundary** banner.
- **On-Screen Caption:** `Dr. T — CareBridge | Non-Emergency Healthcare Care-Navigation`
- **Narration:**  
  "Patients, caregivers, and clinic coordinators lose continuity between discharge instructions, scheduling portals, and follow-up tasks. Dr. T — CareBridge bridges that gap with Jira Service Management, Confluence, and Rovo while enforcing strict non-diagnostic safety: it coordinates scheduling and logistics only, never medical diagnosis or treatment."

### Scene 2 — Care Coordination & Real-Time PHI Guard (0:45 – 1:40)
- **Visual:** Switch to **2. Care Coordination**. Type a blocked test string containing `MRN: 99812` or `SSN 123-45-6789` to show the live Data Minimization Guard rejecting it. Replace with clean administrative wording (`Confirm outpatient scheduling window`), create the task, toggle status, and open its **Task Audit History**.
- **On-Screen Caption:** `Data Minimization First: SSN, MRN, DOB & Lab Values Blocked Locally & Server-Side`
- **Narration:**  
  "Every follow-up task tracks owner provenance, priority, and immutable history. CareBridge automatically blocks accidental Social Security numbers, Medical Record Numbers, or raw lab values before data ever leaves the workspace."

### Scene 3 — Live JSM Read-Only Verification & Confirmed Creation (1:40 – 2:40)
- **Visual:** Open **4. Jira Service Management** (`https://zenieverse.atlassian.net` / Desk `2` / `CR2`). Click **Verify Connection (Read-Only)** and show all green `VERIFIED` checks without creating any ticket. Then inspect the **Exact Request & Data Transmission Preview** card, tick the explicit confirmation checkbox, and either submit an explicitly confirmed administrative follow-up (`CR2-*`) or open the real returned JSM Portal link showing the **CareBridge Portal Panel** in Forge.
- **On-Screen Caption:** `Read-Only Verification -> Exact Payload Preview -> Explicit User Confirmation -> Live JSM CR2`
- **Narration:**  
  "Before CareBridge sends anything to Atlassian, a strictly read-only check verifies Service Desk 2 on CareBridge2, Request Type 5, and project permissions. Outbound writes stay locked unless Privacy Consent is enabled and the user explicitly confirms the exact transmitted payload."

### Scene 4 — Confluence Knowledge Hub & 4-Bucket Re-entry Brief (2:40 – 3:40)
- **Visual:** Open **3. Clinical Knowledge Hub** -> show verbatim Confluence excerpts + clickable URLs side-by-side with unverified AI summary. Open **5. Rovo Assistant** (`carebridge-navigator`) + **6. Care Re-entry Brief** highlighting the 4 separate uppercase buckets (`VERIFIED SOURCE INFORMATION`, `USER-RECORDED INFORMATION`, `AI-GENERATED SUGGESTION — UNCONFIRMED`, `MISSING OR UNAVAILABLE CONTEXT`). If deployed in Atlassian Cloud, show Rovo Chat invoking `CareBridge Healthcare Navigator`.
- **On-Screen Caption:** `Zero Hallucination Mixing: Sources vs. User Tasks vs. Unconfirmed AI vs. Missing Gaps`
- **Narration:**  
  "In Clinical Knowledge Hub, Rovo Assistant, and our Care Re-entry Brief, verified Atlassian records are never blended with AI guesses or user notes. Everything generated by AI stays explicitly labeled Unconfirmed until reviewed by a human, and missing information is called out upfront."

### Scene 5 — Privacy, Retention, Export & Close (3:40 – 4:20)
- **Visual:** Open **7. Privacy & Consent** and **8. Activity & Audit**. Show all consents opt-in, retention policy (`30`/`90`/`365`), JSON export, delete flow, and return to Overview.
- **On-Screen Caption:** `Owner-Isolated Storage · Default-Off Consents · Export & Full Purge`
- **Narration:**  
  "CareBridge puts user privacy in control with default-off outbound scopes, append-only audit logs, configurable retention, JSON export, and instant purge—built natively for Specialized Industries in Codegeist 2026."

---

## 3. Genuine Screenshot & Video Export Checklist

Verify every item before uploading to YouTube/Vimeo and Devpost:
- [ ] Video duration is under **5 minutes 00 seconds** (target `4:00–4:30`).
- [ ] Video shows real working UI (no mockups claiming fake live connections) and real JSM `CR2` / Confluence / Rovo screens once Forge is deployed.
- [ ] No API tokens, email addresses, `.env` files, or `Authorization` headers appear in any frame.
- [ ] Minimum 5 crisp 16:9 PNG screenshots captured:
  1. `01-carebridge-overview-7item.png` — Care Overview & Non-Diagnostic Banner
  2. `02-carebridge-phi-guard-and-tasks.png` — Care Coordination & Data Minimization Guard
  3. `03-carebridge-jsm-verified-and-portal.png` — JSM Read-Only Verify + Exact Payload Preview + `CR2` Ticket / Forge Panel
  4. `04-carebridge-4bucket-reentry-brief.png` — 4-Bucket Re-entry Brief & Clinical Knowledge Hub
  5. `05-carebridge-rovo-and-privacy-audit.png` — Rovo Navigator (`carebridge-navigator`) + Privacy/Audit Ledger
- [ ] Video uploaded as **Public** or **Unlisted** on YouTube/Vimeo (audio clear, English captions enabled).
