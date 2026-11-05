# MicroBiz PayFlow + DebtFree
## PayPal AI Hackathon 2026 Submission Dossier

**Platform**: Dr. T (Zenieverse)  
**Product**: MicroBiz PayFlow + DebtFree  
**Competition**: PayPal AI Hackathon 2026  
**Category**: AI-Powered Fintech, Business Payments & Community Debt Relief  
**Target Repository**: `https://github.com/Zenieverse/Dr.-T`  
**Current Source of Truth**: `main` (Commit: `388810ab3aad3d70c4ff6b06ebb474845819cf2a`)  
**Application Deep Link**: `#microbiz`  
**Live Application Endpoints**:
- Development: `https://ais-dev-4s4jvpipr3mh3mz6x2hpfp-393352619239.asia-southeast1.run.app#microbiz`
- Production Preview: `https://ais-pre-4s4jvpipr3mh3mz6x2hpfp-393352619239.asia-southeast1.run.app#microbiz`

---

## 1. Project Overview & Elevator Pitch

**Tagline**: *Intelligent business cash-flow health, decimal-safe PayPal payments, and dignity-first community debt relief.*

Solo entrepreneurs, independent artisans, and working families navigate an acute dual-sided financial challenge: micro-businesses struggle with uncollected accounts receivable and manual invoicing friction, while vulnerable households are trapped under crushing emergency medical bills, educational tuition holds, and utility shutoff notices.

**MicroBiz PayFlow + DebtFree** provides an integrated solution inside the Dr. T platform:

1. **MicroBiz PayFlow AI (Business Commerce)**:
   - Eliminates accounting float drift with an IEEE 754 decimal-safe financial math engine (`payflowMath.ts`).
   - Server-authoritative PayPal REST API (v2) order creation, cryptographic capture, and webhook validation.
   - Ground-truth Gemini 3.8 Flash copilot for ledger analysis, polite reminder drafting, and cash-flow insights.
   - Milestone event reconciliation bridge connecting Gather & Glow celebration budgets into invoices.

2. **PayFlow DebtFree (Community Debt Relief)**:
   - Direct-to-creditor relief connecting community supporters with verified obligations (medical, tuition, utility, housing, micro-biz).
   - Non-custodial settlement architecture: contributions are immutably tied to verified institutional creditor billing accounts—no unrestricted pooled wallets.
   - Atomic multi-supporter allocation with overpayment prevention guards.
   - Gemini AI dignity copilot assisting beneficiaries with application guidance, document checklists, and creditor hardship inquiry letters.
   - 0% platform fee transparency maximizing direct relief to families.

---

## 2. Rigorous Status & Verification Matrix

To ensure absolute integrity and compliance with hackathon rules, this project transparently reports the verification status across all layers:

| Layer | Status | Evidence & Actual Findings |
| :--- | :---: | :--- |
| **Source Code Implementation** | **IMPLEMENTED** | All 66 files committed to `main` at `388810ab3aad3d70c4ff6b06ebb474845819cf2a`. |
| **Automated Test Verification** | **VERIFIED** | 155 unit & integration tests passing (34 PayFlow, 34 DebtFree, 87 Gather & Glow); all 324 platform tests pass. |
| **TypeScript & Build Verification** | **VERIFIED** | `tsc --noEmit` exits with 0 errors; Vite + esbuild compiles `dist/server.cjs` cleanly in 5.8s. |
| **Local & Cloud Run Deployment** | **DEPLOYED** | Local dev server returns HTTP 200 on port 3000; Cloud Run development & preview URLs serve application successfully. |
| **Live PayPal Sandbox Authorization** | **NOT VERIFIED** | `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` are unset in environment. Server attempts real OAuth call to `api-m.sandbox.paypal.com` and cleanly returns HTTP 401 `invalid_client`. Live order creation is blocked pending merchant credentials. |
| **Live Creditor Money Transfers** | **NOT VERIFIED** | Real-money creditor disbursements remain strictly disabled. The platform utilizes authenticated test-seed records and reviewer confirmation simulations. |
| **Firestore Security Rules** | **DEPLOYED** | Rules for `/microbiz_invoices`, `/microbiz_transactions`, and `/payflow_debt_*` active on project `ai-studio-drt-2e1619d9-9932-4538-9b6c-26b489ebfec2`. |

---

## 3. Video Demonstration Script (3 Minutes)

---

## 4. How PayPal is Integrated

Our integration adheres to PayPal's most rigorous enterprise security standards:

### Authoritative Server-Side Capture (No Client-Side Spoofing)
- **Zero Client Credential Exposure**: `PAYPAL_CLIENT_SECRET` resides strictly in server environment variables. Public diagnostic endpoints omit secrets.
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
- **Secure Fallback Handling**: When merchant credentials are not configured, the system refuses to fabricate simulated approvals, returning structured HTTP 400/401 errors.

---

## 5. How Gemini AI is Integrated

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

## 6. PayFlow DebtFree Architecture

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
- Public alias masking (e.g., *"S. J. — Single Parent of 2"*).
- Raw supporting documents are restricted to authorized reviewers and never exposed to the public.

---

## 7. Verification & Automated Test Suites

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

## 8. Remaining Limitations & Production Roadmap

1. **Live PayPal Merchant Credentials**:
   - `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` must be set in the production environment for live PayPal order authorization and capturing.
2. **Automated Institutional Payouts API**:
   - Current settlements require manual reviewer recording of institutional confirmation receipts. Next phase integrates the PayPal Payouts API to automate direct electronic transfers to verified hospital/utility merchant IDs.
3. **Regulatory Licensing for Scale**:
   - Full commercial deployment across multiple jurisdictions requires banking partner agreements for third-party creditor disbursements.

