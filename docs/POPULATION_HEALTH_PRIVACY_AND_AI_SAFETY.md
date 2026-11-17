# Dr. T — Community Health Signal Intelligence
## Privacy, Security, Governance & Responsible AI Safety

---

## 1. Consent, PDPL Compliance & Data Minimisation

- **Explicit Active Consent Enforcement:** Participants whose consent is `REVOKED`, `PENDING`, or `EXPIRED` (demonstrated by `PART-SYN-REV-01` and live consent toggle) are synchronously excluded from signal ingestion, risk scoring, trend aggregation, referral creation, and AI synthesis prompts. Unauthorized attempts throw `403 AuthorizationError` and write a `DENIED` entry in `GovernanceAuditLog`.
- **Direct PII Rejection (`containsDirectIdentifier`):** Server validation blocks emails, US/international phones, Vietnamese `+84`/`09x` phones, Vietnamese 12-digit CCCD national IDs (`\b0\d{11}\b`), and SSNs across participant intake, observation provenance notes, referral reasons, outreach communication logs, and AI research queries (`400 ValidationError`), while continuing to allow clinical ratios such as `146/92 mmHg`.
- **Vietnam PDPL Right to Erasure & Retention Policy:** Supports `DELETE /api/population-health/participants/:id` (`platform_admin` only; `403` for all lower roles and Guest Sandbox) to erase participant observations, risk signals, and referrals while marking consent withdrawn, aligned with Vietnam PDPL Law No. 91/2025/QH15 & Decree 356/2025/ND-CP (`retentionPolicyDays: 365`). Formal institutional DPO & legal review is required before processing live patient data.
- **Filter-Bypass Protected `k`-Anonymity Suppression:** Subgroup cells (`Region × Cohort`) with `n < k` (default `k=5`, configurable `3..20` exclusively by `platform_admin`) suppress counts, elevated counts, and screening percentages across UI tables, dashboard KPI cards (`suppressedForPrivacy: true`), longitudinal trends (`trendsSuppressedForPrivacy: true`), CSV exports (`<5,true,SUPPRESSED`), and filtered JSON exports.

---

## 2. Cryptographic Authentication & RBAC Enforcement

All business endpoints under `/api/population-health/*` fail closed with HTTP `401` unless authenticated via either:
1. **Verified Firebase ID Token (`RS256`):** Verified against Google Secure Token certificates (`aud`, `iss`, `sub`, `exp`, `iat`, `auth_time`). Authenticated users default to least-privilege `community_viewer`; `platform_admin` requires `zenieverse@gmail.com` (`email_verified: true`) or verified custom claims. Spoofing higher roles via `X-Population-Role` fails with `HTTP 403`.
2. **Signed Guest Sandbox Session (`gdemo.<payload>.<sig>`):** Minted server-side with HMAC-SHA256, isolated per session ID inside ephemeral memory, stamped `isSynthetic: true` & `SIMULATED`, strictly blocked from `MANAGE_GOVERNANCE` & `ERASE_PARTICIPANT` (`403`), and prevented from escalating to `clinician`/`programme_manager`/`platform_admin` (`403`).

| Canonical Role (Aliases) | View Aggregate | Alias & Notes Redaction | Ingest & Referrals | Signal Review & AI Approve | Dispatch Outreach | `k`-Threshold & PDPL Erasure |
|---|---|---|---|---|---|---|
| `platform_admin` | Yes | Unredacted | Yes | Yes | Yes | **Yes** |
| `programme_manager` (`population_health_manager`) | Yes | Unredacted | Yes | Yes | Yes | Demo Reset Only |
| `clinician` | Yes | Unredacted | Yes | Yes | Draft Only | No (`403`) |
| `care_navigator` | Yes | Unredacted | Yes | No (`403`) | Draft Only | No (`403`) |
| `research_analyst` | Yes | **Full PII Redacted** (aliases, notes, signals, referrals, audit `actorId`) | No (`403`) | Run AI / Export Only | No (`403`) | No (`403`) |
| `community_viewer` (`read_only_reviewer`) | Yes | **Full PII Redacted** | No (`403`) | No (`403`) | No (`403`) | No (`403`) |
| `guest_demo` (Isolated Sandbox) | Yes (Synthetic) | Isolated Sandbox Only | Sandbox Only | Sandbox Only | Sandbox Only | **Denied (`403`)** |

---

## 3. Responsible AI, Clinical Safety & Fairness Honesty

1. **Zero Raw PII to LLMs:** Only aggregated consented metrics leave the server to `gemini-3.8-flash` (zero Guest Sandbox data ever writes to live Cloud Firestore `ai-studio-drt-2e1619d9-9932-4538-9b6c-26b489ebfec2`).
2. **Honest Provider & Fallback Attribution:** `AiResearchSynthesisResult` reports `isAiGenerated: true` **only** when live Gemini synthesis succeeds; if fallback engages (`404`/`503`/timeout), `isAiGenerated: false`, `fallbackEngaged: true`, and `providerUsed` displays `population-health-deterministic-evidence-engine (Verified Fallback)`.
3. **Human-in-the-Loop Clinical Gate:** Risk signals require human review (`humanReviewRequired: true`) and carry `"Not a medical diagnosis"` disclaimers; AI syntheses enter `PENDING_HUMAN_REVIEW`; multilingual community broadcasts cannot transition to `SENT` without explicit `APPROVED_TO_SEND`.
4. **Emergency Redirect Boundary:** Alerts surface local emergency numbers (`Vietnam: 115 | US/Canada: 911 | EU: 112 | UAE: 998`) as an **internal clinical triage redirect notice only** — Dr. T does not dispatch EMS automatically.
5. **Cutoff Parity Honesty:** Uniform physiological thresholds (`Uniform Biomarker Cutoffs — No Demographic Multipliers; Parity != Clinical Fairness Proof`) achieve `1.00` rule parity across identical biomarker profiles without claiming validated clinical outcomes parity across external cohorts.
