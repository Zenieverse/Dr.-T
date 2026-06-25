# vb_call Escalation Policy

## Core Rule

A vb_call exists for one purpose:

**Obtain a human decision that is required to continue execution.**

If a decision is not required, do not call.

If execution can continue safely without a decision, do not call.

---

# Decision Calibration

## Call Only When All Conditions Are True

1. The workflow is blocked.
2. A human decision is required.
3. The decision changes what happens next.
4. The agent is not authorized to choose.
5. No existing preference or prior decision already answers the question.

If any condition is false:

Do not call.

---

## Do Not Call For

* Status updates
* Progress reports
* Routine notifications
* Information gathering
* Research tasks
* Reversible actions
* Preference questions that are not blocking
* Questions already answered
* Decisions already made
* Problems the agent can solve independently

---

## Call For

* Spending money
* Sending external communications
* Publishing content
* Deleting information
* Legal or compliance approvals
* Irreversible actions
* Safety-critical actions
* Material business decisions

Only if the workflow is blocked pending that decision.

---

# Communication

## Every Call Must Contain

1. **The Decision**: Front-loaded in the first 10 words, stating exactly what requires authorization.
2. **The Situation**: A concise, non-technical context of the current state, free of history or fluff.
3. **The Choices**: Clear, numbered options (e.g., Option One vs. Option Two) that the user can distinguish via speech.
4. **The Stakes**: The direct positive or negative consequences of choosing each option or of doing nothing.

If any of these four elements are missing, the call is incomplete.

---

## Required Order

Lead with the decision first.

Then state:
* **Situation**
* **Choices**
* **Stakes**
* **Request for answer**

*Example:*
"Decision needed. We need to perform a database migration. We can wipe and rebuild the database, or stop the migration to keep the current data. Option one wipes all existing mock records. Option two preserves the data but halts the application start. Which do you choose?"

---

## Brevity & High Density

Every single word must count. Eliminate polite filler, greeting padding, detailed system history, or repeat explanations.

Maximums:
* **60 words**
* **30 seconds**
* **One decision**

---

## No-Screen Rule (Eyes-Free & Hands-Free)

Assume the user:
* Is driving, walking, or multitasking.
* Cannot see, touch, or interact with a screen.

The spoken message must be 100% understandable, coherent, and actionable through voice alone.

Never depend on or mention:
* Web URLs or API links
* Database IDs, UUIDs, or hashes
* Complex folder paths, file names, or code snippets
* Screenshots, visual layouts, or colored UI components

---

# Safe Execution

## Silence

Silence is never approval.

No response is never approval.

A missed call is never approval.

If no answer:
1. Mark the decision pending.
2. Leave the system unchanged.
3. Stop calling.
4. Wait for a response through any channel (such as chat).

---

## Clear Approval

Examples:
* "Yes"
* "Approve"
* "Proceed"
* "Go ahead"
* "Send it"

Upon approval:
1. Record approval.
2. Execute the approved action.
3. Continue the workflow.
4. Never ask for the same approval again.

---

## Clear Rejection

Examples:
* "No"
* "Reject"
* "Stop"
* "Cancel"

Upon rejection:
1. Record rejection.
2. Do not execute.
3. Do not ask again unless circumstances materially change.

---

## Unclear Response

Examples:
* "Maybe"
* "Later"
* "Not sure"
* "What do you think?"

Allowed:
One clarification attempt.

If still unclear:
1. Do not continue questioning.
2. End escalation.
3. Return to chat.

---

## Sensitive Information

Never speak:
* Passwords
* API keys
* Tokens
* Authentication codes
* Secrets
* Full account numbers
* Unnecessary personal information

Only share information required to make the decision.

---

# State Management

The agent must maintain:
* Approved decisions
* Rejected decisions
* Pending decisions
* Stop-call preferences
* Existing user instructions

State must be checked before every call.

---

# Stop Requests

If the user says:
* "Stop calling"
* "Don't call me"
* "Ask in chat instead"

Then:
1. Record the preference.
2. Stop future calls for the task.
3. Use chat instead.

Do not ask for confirmation.
Do not call again unless the user explicitly re-enables calling.

---

# Repeat Call Prevention

Before every call ask:
* Was this question already asked?
* Was this decision already made?
* Is the blocker unchanged?

If yes:
Do not call.

The same unresolved blocker must not generate repeated calls.

---

# Resuming After Approval

After approval:
1. Execute immediately.
2. Continue the workflow.
3. Do not re-confirm.
4. Do not request duplicate approval.

*Bad:* "You approved earlier. Can you confirm again?"
*Good:* "Approved. Proceeding."

---

# Gold Standard

"Decision needed. The report is ready. You can publish now or keep it in draft. Publishing now meets today's deadline. Keeping it in draft delays release until tomorrow. Which do you choose?"
