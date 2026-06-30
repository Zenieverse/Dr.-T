---
name: vocal-bridge-instruction
description: Core escalation and calibration rules for coding agents (Claude Code, Cursor, Codex, Windsurf) to delegate critical decisions to users via Vocal Bridge (vb_call).
---

# Vocal Bridge (vb_call) Escalation & Calibration Skill

This skill provides comprehensive instructions, patterns, and templates to teach AI coding agents (Claude Code, Cursor, Codex, Windsurf, and custom developer agents) when and how to invoke a vocal bridge call (`vb_call`) to escalate critical decisions to a human developer.

---

## 1. Core Rule: The Golden Standard

A vocal bridge call (`vb_call`) exists for one single purpose:
**Obtain a human decision that is strictly required to continue execution.**

- If a decision is not required, **DO NOT CALL**. Keep working independently.
- If execution can continue safely without a decision, **DO NOT CALL**.

---

## 2. Decision Calibration Engine

To minimize misfires and ensure calls are only made when truly necessary, follow these strict calibration criteria.

### Call Only When All Conditions Are True (The 5 Rules)
An agent must ONLY trigger a call if **ALL FIVE** of the following conditions are met:
1. **The workflow is blocked:** The agent cannot proceed further without resolving the choice.
2. **A human decision is required:** The choice cannot be resolved autonomously by standard code logic, linting rules, or error handling.
3. **The decision changes what happens next:** It has a material impact on system architecture, code paths, or deployment state.
4. **The agent is not authorized to choose:** The agent has no credentials, authorization, or rights to make this specific high-risk or trade-off choice unilaterally.
5. **No existing preference or prior decision already answers the question:** The user has not previously specified a preference or rule covering this exact scenario.

### Clear Boundaries: When to Reach Out vs. Keep Working
*   **KEEP WORKING (Do NOT Call):**
    *   *Troubleshooting and Fixing:* Compiler errors, TypeScript complaints (e.g., missing type declarations or property errors), formatting/style guidelines, standard lint warnings. Fix these using best practices and documentation.
    *   *Minor Aesthetic Preferences:* Choosing button padding (8px vs 10px), standard layout alignments, color palette tweaks matching existing components, or choosing standard React icons.
    *   *Refactoring & Internal Structure:* Extracting clean sub-components, helper functions, or folder organization unless they violate explicit project rules.
*   **REACH OUT (Call Required):**
    *   *Financial Commitments:* Provisioning paid infrastructure, cloud databases, or subscribing to external APIs costing real-world currency or cloud credits.
    *   *Destructive Actions:* Overwriting database schemas, running migrations that wipe mock seed data, deleting file directories, or overwriting human-made custom implementations in production.
    *   *Public-Facing Operations:* Deploying live updates, sending automated systems emails (e.g. newsletters or notifications) to real-world users, or publishing public content.
    *   *Unresolved Blocked Requirements:* Conflicting user instructions that directly block execution and cannot be clarified via code context.

### Call/No-Call Calibration Chart

| Scenario | Call? | Reason |
| :--- | :---: | :--- |
| **Spending real money / cloud credits** (e.g. provisioning high-cost VMs) | **YES** | Irreversible financial impact; blocked until approved. |
| **Deleting database tables / user content in production** | **YES** | High-risk, irreversible action; requires human confirmation. |
| **Publishing content / sending external communications** (e.g. newsletters) | **YES** | Public-facing, permanent communication. |
| **Fixing a local compiler error or lint warning** | **NO** | Reversible, standard troubleshooting within agent capabilities. |
| **Choosing between two naming conventions** (e.g., camelCase vs. snake_case) | **NO** | Minor developer preference; not a blocker, agent should choose best practice. |
| **A database migration that wipes mock seed data on start** | **YES** | Potential loss of mock database state that could break workflow. |
| **Adding a standard React icon in the UI** | **NO** | Standard development work; fully reversible. |

---

## 3. Communication Protocol (No-Fluff Speech)

When placing a call, your message must never bury the decision under unnecessary detail. It must provide exactly what the listener needs to make an immediate, eyes-free decision.

### Structure of the Perfect Script
1.  **The Decision (First 10 Words):** Lead immediately with the core question requiring authorization.
2.  **The Situation (Context):** A brief, non-technical sentence explaining why this is happening. No technical jargon, no file paths, no code variables.
3.  **The Choices:** Present clear, numbered choices (Option 1 vs. Option 2) that are easy to remember and select.
4.  **The Stakes:** Explicitly describe the consequences of choosing each option, or of doing nothing.

### Hard Constraints
-   **Max 60 words** (strictly enforced).
-   **Max 30 seconds** of speech.
-   **Single decision per call.**
-   **No visual or technical dependencies:** Never speak file paths (e.g. `/src/types.ts`), UUIDs, hashes, CSS classes, or web URLs. Keep it in humble, plain speech.

### Script Comparison

*   **❌ BAD (Buries the decision, heavy jargon, too verbose):**
    > "Hello developer, I am in the process of running a migration in `/src/db/schema.ts` which will alter the tables. The problem is that running this schema modification will drop the current state and wipe our mock seed data in our database container on port 3000, causing a loss of your progress. Should I run `npm run migrate:force` or stop the build?"
    *Reason for Failure:* Buries the decision at the end, includes complex folder paths, port numbers, shell commands, and exceeds the word limit.

*   **✅ GOOD (The Gold Standard - Concise, front-loaded, plain speech):**
    > "Decision needed. We need to perform a database migration. We can wipe and rebuild the database, or stop the migration to keep the current data. Option one wipes all existing mock records. Option two preserves the data but halts the application start. Which do you choose?"
    *Why it succeeds:* The decision is in the first 2 words. Plain English is used. Option 1 vs. Option 2 is clear. Stakes of both options are explicit. Word count: 54 words.

---

## 4. Safe Execution Rules

To protect system integrity, your interaction flow must adhere to robust safety parameters.

1.  **Silence is Never Approval:**
    *   If a call goes unanswered, or is declined in the UI, **do not proceed** with the risky action.
    *   Leave the system unchanged, mark the decision as pending, and transition the conversation back to the text chat.
2.  **Explicit Affirmation Required:**
    *   Only execute high-risk actions when you receive a clear, unambiguous approval (e.g., "Yes", "Approve", "Proceed", "Go ahead", "Send it").
3.  **Secrets Stay Unspoken:**
    *   Never say passwords, API keys, tokens, auth credentials, or sensitive account numbers over the vocal channel. Only describe the associated service (e.g., "the Stripe integration").
4.  **Do Not Repeat Calls:**
    *   If a blocker is unchanged, or a decision was already made/rejected, **do not trigger a duplicate call**. Record the user's rejection/approval and proceed based on that settled state.

---

## 5. Guidance Completeness (Unhappy Paths & Edges)

A less capable model must not stumble when things go wrong. Handle these unhappy paths gracefully:

*   **Ambiguous Responses ("Maybe", "I don't know"):**
    *   Attempt exactly **one** brief clarification (e.g., "Just to confirm, should we proceed with wiping the database?").
    *   If the response remains ambiguous, treat it as a rejection. Hang up, do not proceed, and return to text chat.
*   **Abrupt Disconnections / Hang-ups:**
    *   If the connection fails mid-call, immediately rollback any staged, high-risk changes.
    *   Save your current draft script and state, and wait for the user to resume in text chat.
*   **SDK Errors / Call Failures:**
    *   If the `vb_call` fails to dial or connect, log the error locally.
    *   Do not retry in a loop. Gracefully notify the developer via the text console or chat box and halt execution.

---

## 6. Across the Conversation (State Preservation)

The agent must maintain state across turns to avoid repeating questions or ignoring user preferences.

*   **Respect "Stop Calls" Preferences:**
    *   If the user says "Stop calling," "Don't call me," or "Use chat instead," this preference **MUST** be persisted in the agent's memory or rules.
    *   **STRICTLY FORBIDDEN:** Ever placing another physical phone call for the duration of the task. All future escalations must be handled via the text-based chat.
*   **Persist Settled Decisions:**
    *   Do not re-ask a settled question in subsequent turns.
    *   If the user approved or rejected an action in Turn 1, do not ask them to confirm again in Turn 2 or Turn 3. Carry out the decision, or proceed with the alternative path.
*   **No Duplicate Dialing for Persistent Blockers:**
    *   If a blocker remains active and the user has already rejected or failed to answer the call, do not initiate a new call. Present the state clearly in the text chat.

---

## 7. Coding Agent Configurations

Inject the following configurations into your coding agent's settings to enforce this behavior:

### Cursor Configuration (`.cursorrules`)
```json
{
  "rules": [
    "Before editing, view files first. Prioritize user intent.",
    "Strictly follow the vb_call escalation policy specified in AGENTS.md.",
    "Do not make automatic high-risk decisions (financial, destructive, public-facing) without initiating vb_call.",
    "Formulate vb_call spoken scripts: front-load the decision in under 10 words, specify option 1 vs option 2, state stakes clearly, and keep under 60 words.",
    "Ensure silence is never treated as approval. Respect 'stop call' preferences permanently."
  ]
}
```

### Claude Code Configuration (`claude_code_config` / System Prompt)
```text
You have access to the `vb_call` tool to escalate blocked, critical workflows to the user over a real-time vocal bridge.
When to call:
- Blocked on spending money, deleting database records, publishing content, or irreversible changes.
- Ensure all 5 conditions in your system rules are met.
- NEVER call for minor preferences, code layout, refactoring, or reversible bugs.
How to speak:
- Front-load decision in the first 10 words.
- Offer numbered Choices (Option 1 vs Option 2).
- Under 60 words total.
Safe Execution:
- Respect "Stop calling" permanently. Silence is never approval. Never re-ask a settled question.
```

### Windsurf / Roo Code Config (`.windsurfrules` / `system-prompt`)
```text
Escalate human-critical decisions via `vb_call` according to the 5-point calibration protocol.
If a call is answered:
- Record the decision and continue immediately. Do not ask for duplicate confirmation.
- Respect stop requests and hold state across turns.
If no answer:
- Stop executing, rollback staged changes, and wait for instructions in chat.
```
