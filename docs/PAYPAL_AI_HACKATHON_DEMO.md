# MicroBiz PayFlow + DebtFree — 3-Minute Video Demo Script & Recording Guide
**Project:** MicroBiz PayFlow + DebtFree  
**Competition:** PayPal AI Hackathon 2026  
**Platform:** Dr. T — Zenieverse  
**Target URL:** `https://ais-dev-4s4jvpipr3mh3mz6x2hpfp-393352619239.asia-southeast1.run.app#microbiz`  
**Max Duration:** 3:00 (180 seconds)

---

## Pre-Recording Checklist

- [ ] Browser window sized to 1080p (1920x1080) at 100% zoom.
- [ ] Navigate to `https://ais-dev-4s4jvpipr3mh3mz6x2hpfp-393352619239.asia-southeast1.run.app#microbiz`.
- [ ] Verify that `#microbiz` loads with navigation tabs: **Invoices**, **Receipts**, **Ledger**, **POS**, **AI Copilot**, **Gather Bridge**, **DebtFree**.
- [ ] Verify microphone audio clarity.
- [ ] Ensure honesty standard: When launching PayPal Checkout, state clearly that live Sandbox authorization requires merchant credentials, and show the clean, server-validated failure/readiness message without fabricating a mock approval.

---

## 3-Minute Timeline & Narration Script

### Scene 1: Introduction & Mission (0:00 – 0:30)
- **Visual:** Open on the Dr. T platform header, click into `#microbiz`. Show the dual-mode header banner: **MicroBiz PayFlow + DebtFree**.
- **On-Screen Action:** Hover over the tabs (**Invoices**, **AI Copilot**, **DebtFree**) to show the unified business and mutual aid dashboard.
- **Spoken Narration:**
  > *"Welcome to MicroBiz PayFlow + DebtFree on the Dr. T platform, built for the PayPal AI Hackathon 2026. Grassroots economic vitality requires two things: empowering small businesses and artisans to get paid on time with zero accounting drift, and helping vulnerable families resolve sudden debt emergencies with dignity. Today, we demonstrate both in action."*

---

### Scene 2: Decimal-Safe Invoicing & PayPal Integration (0:30 – 1:15)
- **Visual:** Invoicing Studio (`#microbiz` $\rightarrow$ Invoices). Click **+ New Invoice**.
- **On-Screen Action:**
  1. Set Customer: `"Acme Heritage Botanicals"`.
  2. Add line items: `"Brand Identity Guide"` ($1,200), `"Artisan Packaging"` ($850).
  3. Apply 5% discount and 8.5% tax.
  4. Point out the exact totals ($2,113.04). Explain that our `payflowMath` engine eliminates IEEE 754 floating-point drift down to the integer subunit, even handling zero-decimal currencies like Vietnamese Dong.
  5. Click **Pay with PayPal** or launch Checkout.
  6. **Honest Sandbox Disclosure:** Show the modal initiating `/api/paypal/create-order`. State clearly:
  > *"Notice that our backend initiates an authoritative Orders v2 call directly to PayPal's API. Because production merchant credentials are not stored in the demo environment, our server safely refuses to simulate false approvals, demonstrating strict server-authoritative security rather than a client-side mock."*

---

### Scene 3: Gemini 3.8 Flash Financial Copilot (1:15 – 1:45)
- **Visual:** Switch to the **AI Copilot** tab.
- **On-Screen Action:**
  1. Click **"Analyze Receivables & Overdue Accounts"**.
  2. Watch Gemini 3.8 Flash evaluate the live ledger.
  3. Show the two-tier response: **Verified Ledger Facts** separated from **Actionable Recommendations**.
  4. Point out the drafted polite reminder email citing overdue invoice `#INV-2026-102` with direct PayPal payment links.
  5. Highlight the mandatory compliance disclaimer: *"Educational financial insights only. Not certified CPA tax or legal advice."*
- **Spoken Narration:**
  > *"Our Gemini Financial Copilot reasons exclusively over verified ledger data—never hallucinating financial facts or inventing balances. It drafts customized, respectful payment reminders and provides cash-flow insights, always accompanied by clear regulatory disclaimers."*

---

### Scene 4: PayFlow DebtFree — Dignity-First Mutual Aid (1:45 – 2:30)
- **Visual:** Click into the **DebtFree** tab.
- **On-Screen Action:**
  1. Show active verified debt relief campaigns: Medical Emergency, Educational Tuition, Utilities.
  2. Point out applicant privacy alias masking: `"S. J. — Single Parent of 2"`, protecting beneficiary legal identity.
  3. Click **Support** on a verified medical obligation.
  4. Demonstrate the **Atomic Overpayment Guard**: Enter an amount higher than the remaining debt ($2,500 on a $1,200 balance) and show the instant validation guard preventing overfunding.
  5. Enter a valid contribution ($50), toggle the **"Cover processing fee (+2.9% + $0.30)"** switch, and show the exact fee breakdown ensuring 100% of the pledge settles the bill.
- **Spoken Narration:**
  > *"Now meet PayFlow DebtFree. Unlike typical crowdfunding that sends untracked cash to personal accounts, DebtFree enforces a non-custodial model: every dollar is immutably allocated to a verified institutional creditor account—like a hospital or utility provider. Beneficiary dignity is protected with privacy aliases, and our atomic overpayment guard ensures campaigns cannot be overfunded."*

---

### Scene 5: Reviewer Portal, 0% Platform Fee & Wrap-Up (2:30 – 3:00)
- **Visual:** Switch to **Reviewer Portal** and then **Impact Dashboard**.
- **On-Screen Action:**
  1. Show the Reviewer audit view where committee members inspect billing statements and record official institutional confirmation receipts.
  2. Show the Impact Dashboard highlighting **0% Platform Fees** and the calculation demonstrating $2,500 returned to families for every $50,000 raised compared to 5% commercial platforms.
  3. Briefly display the automated test terminal: 324/324 tests passed.
- **Spoken Narration:**
  > *"In the Reviewer Portal, trust-and-safety officers verify creditor invoices and record official settlement receipt numbers. With zero platform fees, every dollar goes directly to debt relief. Verified by 324 automated tests across the platform, MicroBiz PayFlow + DebtFree brings enterprise financial tools to small businesses and transparent relief to communities. Built for the PayPal AI Hackathon 2026."*

---

## Post-Recording Review Standards

- [ ] Duration is strictly under 3:00.
- [ ] No claim of real live bank disbursement was made.
- [ ] Live Sandbox status was honestly explained as requiring external merchant credentials.
- [ ] Audio and video are synchronized with no confidential keys shown.
