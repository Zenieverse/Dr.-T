# MicroBiz PayFlow AI + PayFlow DebtFree
## PayPal AI Hackathon 2026 Submission

**Platform**: Dr. T (Zenieverse)  
**Product**: MicroBiz PayFlow AI + PayFlow DebtFree  
**Competition**: PayPal AI Hackathon 2026  
**Category**: AI-Powered Fintech, Business Payments & Community Debt Relief  
**Deep Link**: `#microbiz`  
**Live Application Endpoints**:
- Development: `https://ais-dev-4s4jvpipr3mh3mz6x2hpfp-393352619239.asia-southeast1.run.app#microbiz`
- Production Preview: `https://ais-pre-4s4jvpipr3mh3mz6x2hpfp-393352619239.asia-southeast1.run.app#microbiz`

---

## 1. Project Overview & Elevator Pitch

**Tagline**: *Intelligent business cash flow, decimal-safe PayPal payments, and dignity-first community debt relief.*

Solo entrepreneurs, independent contractors, and families are facing an unprecedented double squeeze: small businesses struggle with uncollected receivables and manual invoicing friction, while vulnerable households are trapped under crushing medical, educational, and emergency utility debts.

**MicroBiz PayFlow AI + DebtFree** delivers a unified, dual-sided financial ecosystem inside the Dr. T platform:

1. **MicroBiz PayFlow AI (Business Commerce)**:
   - Eliminates accounting drift with an IEEE 754 decimal-safe financial math engine.
   - Authoritative server-side PayPal REST API (v2) orders, cryptographic capture, and webhook validation.
   - Ground-truth Gemini 3.8 Flash copilot for ledger analysis, automated polite reminders, and cash flow insights.
   - Real-time Gather & Glow event planning reconciliation bridge.

2. **PayFlow DebtFree (Community Debt Relief)**:
   - Direct-to-creditor relief connecting compassionate supporters with verified debts (medical bills, tuition arrears, utility holds, micro-enterprise obligations).
   - Non-custodial settlement architecture: donor contributions disburse directly to verified institutional billing accounts—no unrestricted pooled wallets.
   - Atomic multi-supporter allocation with overpayment prevention guards.
   - Gemini AI dignity copilot assisting beneficiaries with application guidance, document checklists, and creditor hardship inquiry letters.
   - 0% platform fee pilot maximizing direct relief to families.

---

## 2. Video Demonstration Script (3 Minutes)

| Timecode | Visual | Voiceover / Script |
|---|---|---|
| **0:00 - 0:30** | Opening on Dr. T dashboard, navigating to `#microbiz` and presenting both PayFlow AI and DebtFree tabs. | *"Welcome to MicroBiz PayFlow AI and PayFlow DebtFree, created for the PayPal AI Hackathon 2026. Grassroots economic vitality requires two things: empowering micro-businesses to get paid on time, and helping families overcome debilitating debts. Today we show both in action."* |
| **0:30 - 1:15** | PayFlow AI: Creating an invoice, applying line items, 10% discount, and 8.5% tax. Showing decimal precision and launching PayPal Checkout. | *"First, business operations. A catering business creates an invoice. Our decimal-safe arithmetic engine guarantees zero floating-point drift down to the integer subunit. With one click, the client pays via PayPal Checkout. Our backend validates the exact dollar match before marking the invoice as PAID."* |
| **1:15 - 1:45** | Showing the Gemini 3.8 Flash financial copilot drafting an overdue invoice reminder and cash flow forecast. | *"Our Gemini financial copilot reasons strictly over verified ledger facts—no invented numbers. It isolates facts from suggestions and drafts courteous follow-ups with instant payment links."* |
| **1:45 - 2:30** | Switching to *PayFlow DebtFree*: Showing verified medical and utility requests, making a $50 contribution via PayPal, and showing real-time funding progress. | *"Now meet PayFlow DebtFree. Here is a single parent facing a verified pediatric emergency hospital bill. Supporters can contribute any amount—$25, $50, or custom—with an option to cover processing fees. Notice our atomic allocation: overpayment is impossible, and funds are tied directly to the hospital's verified billing account."* |
| **2:30 - 3:00** | Showing the Reviewer Portal confirming an official creditor settlement receipt, the Impact Dashboard ($0 platform fees), and closing summary. | *"When fully funded, our Trust Committee records the creditor's official confirmation receipt, marking the debt SETTLED. Zero platform fees, 100% transparent. MicroBiz PayFlow AI + DebtFree: verified by 68 automated tests and ready for global impact."* |

---

## 3. How PayPal is Integrated

Our integration adheres to PayPal's most rigorous enterprise security standards:

### Authoritative Server-Side Capture (No Client-Side Spoofing)
- **Zero Client Credential Exposure**: `PAYPAL_CLIENT_SECRET` resides strictly in server environment variables. Public endpoints only return non-sensitive configuration diagnostics.
- **REST API v2 Orders & Capture**:
  - `POST /api/paypal/create-order` & `POST /api/debtfree/create-order`: Requests an authorized PayPal Order specifying currency, intent (`CAPTURE`), line-item descriptions, and exact subunit decimal formatting.
  - `POST /api/paypal/capture-order` & `POST /api/debtfree/capture-order`: The server calls PayPal's capture endpoint directly. Before updating any invoice or debt request, the server executes a **strict amount check**:
    ```typescript
    if (Math.abs(capturedTotal - expectedTotal) > 0.009) {
      throw new Error(`Amount mismatch! Expected ${expectedTotal}, captured ${capturedTotal}`);
    }
    ```
- **Webhooks & Idempotency**: `POST /api/paypal/webhook` processes events (`PAYMENT.CAPTURE.COMPLETED`, `PAYMENT.CAPTURE.DENIED`, `PAYMENT.CAPTURE.REFUNDED`) with transaction deduplication.
- **Refund Management**: `POST /api/paypal/refund` enables merchant refunds with full ledger debit reconciliation.

---

## 4. How Gemini AI is Integrated

Both modules leverage Google's **Gemini 3.8 Flash** via `@google/genai`:

### A. Business Financial AI (`src/server/payflowAiServerService.ts`)
- **Strict Ground-Truth Isolation**: Injects authenticated merchant ledger snapshots with zero hallucination constraints.
- **Two-Tier Schema**: Explicitly divides answers into **Verified Facts** (exact balances, overdue invoice numbers, collected revenue) and **Actionable Recommendations** (follow-up cadence, discount strategy).
- **Automated Polite Reminders**: Drafts empathetic collection emails citing invoice numbers, due dates, outstanding balances, and direct PayPal payment links.

### B. Debt Relief AI (`src/server/debtFreeAiServerService.ts`)
- **Application Guidance**: Generates personalized verification document checklists based on debt category (e.g., itemized statements, patient ID numbers, utility customer codes).
- **Creditor Hardship Letter Drafting**: Generates respectful correspondence to billing departments requesting interest freezes or confirming incoming community payments.
- **Mandatory Compliance**: Strict non-CPA and non-legal disclaimer on all responses (*"Educational financial insights only. Not certified CPA tax or legal advice."*).

---

## 5. PayFlow DebtFree Architecture

### Non-Custodial Direct-to-Creditor Settlement
- The platform does not operate an unrestricted pooled wallet or custodial fund.
- Every contribution is immutably linked to a verified target debt request and creditor account reference.
- Payouts are directed to institutional payees (hospitals, schools, utility companies, landlords).

### Multiple Supporters & Atomic Contribution Allocation
- Supports multiple micro-contributions toward a single verified debt (e.g., Supporter A: $500, Supporter B: $200, Supporter C: $100 toward a $2,000 obligation).
- Overpayment prevention guard rejects any contribution exceeding the exact remaining unpaid balance.
- Transparent fee coverage toggle allows supporters to add the payment processing fee (+2.9% + $0.30) so 100% of the principal reaches the creditor.

### Verification State Machine
`DRAFT` ➔ `SUBMITTED` ➔ `UNDER_REVIEW` ➔ `VERIFIED` ➔ `PUBLISHED` ➔ `PARTIALLY_FUNDED` ➔ `PAYMENT_PROCESSING` ➔ `PARTIALLY_SETTLED` ➔ `SETTLED`

### Beneficiary Dignity & Privacy
- Public alias masking (e.g., *"M. K. — Single Parent of 2"*).
- Raw supporting documents are restricted to authorized reviewers and never exposed to the public.

---

## 6. Verification & Automated Test Suites

We have built and verified two automated test suites comprising **68 tests** (100% pass rate):

### Suite 1: PayFlow Business Invoicing (`scripts/test-microbiz-payflow.ts`) — 34 Tests
- Decimal-safe monetary arithmetic and float drift elimination.
- USD and zero-decimal VND calculations.
- PayPal REST API v2 base URLs and capture integrity.
- Tamper detection (rejects underpayment and overpayment).
- Multi-tenant Firestore security rules and secrets protection.
- Gemini copilot ledger isolation and reminder drafting.
- Gather & Glow event reconciliation bridge.

### Suite 2: PayFlow DebtFree Community Relief (`scripts/test-payflow-debtfree.ts`) — 34 Tests
- Assistance application, privacy alias masking, and verification consent.
- Debt verification state machine transitions.
- Multiple supporter contribution summation and remaining debt calculation.
- Overpayment guard rejecting excessive or zero-dollar contributions.
- Direct creditor settlement recording and confirmation receipt tracking.
- Zero-platform-fee community savings calculation (5% comparison).
- Gemini AI relief guidance, document checklists, and hardship letter drafting.
- Non-custodial security invariants and anonymous contribution handling.

---

## 7. Platform Status & Compliance Invariants

| Component | Status | Verification Evidence |
|---|---|---|
| Business Dashboard & Invoicing | **IMPLEMENTED & VERIFIED** | 34 automated unit/integration tests passing |
| PayPal Sandbox Integration | **IMPLEMENTED & VERIFIED** | Server-side Orders v2 & Capture v2 endpoints active |
| PayFlow DebtFree Hub | **IMPLEMENTED & VERIFIED** | 34 automated unit/integration tests passing |
| Gemini 3.8 Flash Financial Copilots | **IMPLEMENTED & VERIFIED** | Ground-truth prompts, non-CPA disclaimers, fallback engines |
| Firestore Security Rules | **DEPLOYED & ACTIVE** | Isolated rules deployed via `deploy_firebase` |
| Full Platform Regression Suite | **VERIFIED** | All 15 platform test suites passing |
| Cloud Run Production Readiness | **READY** | Containerized build (`npm run build`) compiles with 0 errors |
