# Dr. T — HatBridge: Codegeist 2026 Judge Installation & Demonstration Guide

> **Data Honesty Disclosure:** When no Atlassian Cloud credentials or Forge installation are present, HatBridge displays an explicit **Disconnected** status and offers an isolated **Demo Atlassian Sandbox** labeled `(Sample Sandbox — Not Live Data)`. Never treat sandbox items as live Jira/Confluence data.

---

## 1. Prerequisites & Automated Local Verification
Run these verified repository checks from the workspace root:
```bash
node apps/hatbridge-forge/scripts/validate-manifest.mjs
npx tsc --noEmit -p apps/hatbridge-forge/tsconfig.json
npm run test:hatbridge
npx tsx scripts/test-firestore-security-rules.ts
npx tsx scripts/test-production-isolation.ts
npx tsx scripts/test-phase2-remediation.ts
npm run test:population-health
npm run test:soundgarden:release
npm run build:dev
```

## 2. Launching Dr. T — HatBridge Mission Control (Local)
```bash
npm install
npm run dev
```
Open `http://localhost:3000/?tab=hatbridge` (or `#hatbridge`).

## 3. Installing the Forge App into an Evaluation Atlassian Cloud Site
For live Jira, Confluence, and Rovo evaluation (requires Node 22 and `@forge/cli` logged into your Atlassian Cloud developer site):
```bash
cd apps/hatbridge-forge
npm install
npm run validate:manifest
npm run typecheck
npm run build:ui
npm run build
npm install -g @forge/cli
forge login
forge register
forge lint
forge deploy -e development
forge install --product jira -e development
forge install --product confluence -e development
```

---

## 4. End-to-End 9-Step Judge Demonstration Script

### Path A: With Live Atlassian Cloud Site (After Section 3 Deployment)
1. **Open HatBridge in Dr. T:** Navigate to `http://localhost:3000/?tab=hatbridge` (`Today Bridge` view).
2. **Select a Hat:** Use the top **Wearing:** selector (or **My Hats**) to choose a workplace Hat (e.g., *University Dean* or *Clinic Lead*).
3. **Capture a Real Jira Issue:** Inside Jira, open any authorized issue -> launch **HatBridge — Role & Re-entry Context** (`jira:issuePanel`) -> select your Hat -> click **Capture to Hat** -> test **Open Issue** (`router.open()`).
4. **Capture a Real Confluence Page:** Inside Confluence, open any page -> launch **Link Page to HatBridge Decision** (`confluence:contentAction`) -> click **Capture to Hat** -> test **Open Page**.
5. **Record a Decision:** In the Forge panel or Dr. T **Atlassian Workspace**, fill **Record Decision with Source Reference** linking the Confluence page as its source and click **Save Grounded Decision**.
6. **Generate Grounded Re-entry Brief:** Open **Re-entry Brief** (in Forge or Dr. T). Verify all 8 questions plus separate labels for **Verified Source Information**, **User-Recorded Information**, **AI-Generated Suggestions (Unconfirmed)**, and **Missing / Unavailable Context**.
7. **Prepare a Handoff:** Open **Handoffs**, pre-fill from current records, and click **Save Handoff & Switch Role** into another Hat.
8. **Invoke Rovo Agent:** Open Rovo Chat -> choose **HatBridge Context Navigator** -> run `"Prepare my re-entry brief for my active hat"` (`getReentryBrief`) and `"Search authorized decisions"` (`searchAuthorizedDecisions`). Confirm observed facts cite real Jira keys/Confluence IDs and respect user permissions.
9. **Show Confirmation & Privacy Controls:**
   - Demonstrate that Jira issue creation remains blocked until explicit checkbox confirmation (`confirmedByUser === true`).
   - Show that `private_personal` Hats/notes (and **Protected Human Time** blocks) are blocked from Jira/Confluence/Rovo export and excluded from Gemini unless explicitly opted in under **Settings & Privacy**.

### Path B: Offline / Unconfigured Evaluation Mode (Without Atlassian Credentials)
- Follow Steps 1–2 and 5–7 using **Load Sample Workflow** in **My Hats** and **Open Demo Atlassian Sandbox** in **Atlassian Workspace**.
- Point out explicitly to reviewers: status shows **`Disconnected from Live Atlassian Site`** / **`Demo Atlassian Sandbox Active (Not Live Data)`**, while Steps 3, 4, and 8 live cloud actions await Section 3 Forge deployment.
