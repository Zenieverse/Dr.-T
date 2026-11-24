# Dr. T — HatBridge: Product Specification

**Tagline:** *Many Hats. One Life. Nothing Important Lost.*

## 1. Problem Statement
Professionals across clinical medicine, academic leadership, engineering, research, and caregiving wear multiple high-stakes hats every day. Traditional productivity tools treat work as a flat to-do list, forcing manual context reconstruction each time a person switches roles. Worse, cross-role commitments silently collide with personal rest and family boundaries.

**Dr. T — HatBridge** transforms Dr. T into a continuous, cross-role Life & Work Mission Control bridged cleanly into Atlassian Jira, Confluence, and Rovo.

## 2. Primary Personas
- **Clinical & Academic Polymaths (e.g., University Dean + Physician + Hospital Director + Researcher + Caregiver/Parent):** Need instant role switching, strict personal/workplace privacy boundaries, protected rest/family blocks, and non-PHI workplace summaries.
- **Multidisciplinary Knowledge Workers & Engineers:** Start with the general professional hat pack (Lead, Architecture, Operations, Client Work, Research, Personal & Rest) and adapt roles anytime.

## 3. Core Capabilities (10 Mission Control Sections)
1. **My Hats:** Starter packs (`clinical_academic` and `general_professional`), custom role creation, icon/color/privacy configuration, drag-free priority reordering, archiving, and one-click *Load Sample Workflow*.
2. **Today Bridge:** Unified daily operating brief combining top must-do items (`must_do`, `important`, `can_wait`), cross-role conflict alerts (flagging collisions with protected time without silent auto-rescheduling), and role quick-switch cards.
3. **Re-entry Brief (Signature Capability):** Grounded 8-question brief answering:
   - What was I working on?
   - Why did it matter?
   - What did I complete last?
   - What is still unfinished?
   - What decisions were already made?
   - Who am I waiting on?
   - What deadlines are approaching?
   - What is the next meaningful action?
   - Strictly separates **Observed Facts & Source References**, **User-Confirmed Decisions**, **AI Suggestions**, and **Missing Information** (`"Not available in the connected context."` when absent).
4. **Context Capture:** Fast thought/note/task capture anywhere with optional browser speech-to-text voice dictation (only when supported and triggered by user), category tagging, and storage location visibility.
5. **Decision Memory:** Structured records (title, reasoning, alternatives considered, stakeholders, source links, chronological revision history) plus cited natural-language Q&A.
6. **Handoffs (*Finish → Save → Switch*):** Pre-filled exit snapshot capturing situation, remaining work, waiting dependencies, and next action before switching into another hat's Re-entry Brief.
7. **Time Protection:** Dedicated Family, Rest, Deep Work, and Recovery windows, daily sustainable workload limit gauge, and early overlap warnings.
8. **Atlassian Workspace:** Explicit connection status (`disconnected` / `sample_sandbox` / `live_atlassian_configured`), Jira issue linking, Confluence page linking, and user-confirmed Jira issue creation.
9. **AI Assistant:** Explicit consent-gated Gemini reasoning returning 6 structured sections (Observed Facts, Sources, Decisions, AI Suggestions, Missing Information, Proposed Next Action).
10. **Settings & Privacy:** Per-hat privacy controls, explicit AI & optional analytics opt-in, auditable activity log, full JSON export, irreversible account data purge, and subscription-ready tier definitions (`Personal Continuity`, `Multi-Role Pro`, `Department & Academic Team`).
