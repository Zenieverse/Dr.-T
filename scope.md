# Project Scope: Dr. T — Build With AI Companion

> **Challenge Track**: [Devpost Learn AI Basics](https://learn-ai-basics.devpost.com/)  
> **Repository**: [https://github.com/Zenieverse/Dr.-T](https://github.com/Zenieverse/Dr.-T)  
> **Status**: Verified & Operational in Production Application (Tab: `Build With AI` / `buildwithai`)

---

## 1. Problem Statement

Developers participating in AI hackathons (such as the Devpost Learn AI Basics challenge) frequently face friction transitioning from high-level project ideation to structured execution. Typical challenges include:
- Generating unstructured, fragmented design documentation that fails challenge criteria.
- Missing mandatory planning artifacts (`scope.md`, `prd.md`, `spec.md`, and structured `README.md`).
- Inconsistent terminology, personas, and architectural boundaries across separate documents.
- Lack of sprint task breakdown connecting specifications to code implementation.
- Complex local CLI skill setups without clear guidance on how agents and skill packs operate.
- Reliance on brittle external AI APIs without timeout budgets or deterministic fallbacks.

**Build With AI** in Dr. T provides an integrated, guided project workbench that helps builders conceive, document, structure, test, and prepare their AI applications for hackathon submission with zero fluff and full cross-document consistency.

---

## 2. Target Users

1. **Hackathon Builders & Solo Developers**: Creators building functional prototypes for AI competitions who need fast, structured scaffolding from intake questionnaire to submission-ready deliverables.
2. **First-Time AI Engineers (Devpost Learn AI Basics Learners)**: Developers learning how to use AI coding agents, craft proper planning specifications, and follow best-practice software engineering lifecycles.
3. **Cross-Functional Product Architects**: Engineers and designers requiring mutual consistency checks between product requirements, technical architecture, and execution task boards.

---

## 3. Goals and Objectives

### Primary Goals
- **8-Stage Lifecycle Guidance**: Guide users sequentially through Discover, Scope, Plan, Specify, Build, Test, Document, and Publish.
- **Automated Planning Deliverables**: Scaffold and maintain the core Devpost challenge planning documents (`scope.md`, `prd.md`, `spec.md`, `README.md`).
- **Section Completeness & Mutual Consistency Validation**: Automatically verify required headers and analyze semantic consistency between documents.
- **Sprint Task Breakdown**: Organize tasks on a 6-stage Kanban board (Backlog, Ready, In Progress, Testing, Done, Blocked).
- **Code Review & Agent Prompt Synthesis**: Provide plain-language logic explanation, defect/security reviews, and structured prompt generation for external coding agents.
- **Reference Demonstration Template**: Provide **HealthAlert Mini**, a pre-populated, verified reference project showcasing a compliant submission bundle.

### Non-Goals (Explicitly Out-of-Scope)
- Executing local CLI tools or terminal skill packs directly inside the browser sandbox (Dr. T runs in a secure browser sandbox; it provides verified commands and instructions for users to run on their local systems).
- Fully autonomous code generation replacing human developers.
- Diagnostic medical advice (the template project is strictly educational and non-diagnostic).
- Arbitrary cloud deployment provisioning for arbitrary third-party stacks outside Dr. T's existing hosting.

---

## 4. Scope Boundaries

| Capability Area | In-Scope (Implemented & Verified) | Out-of-Scope / Deferred |
| :--- | :--- | :--- |
| **Document Authoring** | Live Markdown editor, live preview, required section checks, copy to clipboard, `.md` file download, JSON manifest bundle export. | Collaborative multi-cursor live Google Docs-style editing. |
| **Consistency Engine** | Algorithmic cross-document lexical and structural coherence analyzer reporting strengths and gaps. | LLM-based continuous real-time semantic drift tracking. |
| **AI Integration** | Server-side proxy (`/api/build-with-ai/*`) using `@google/genai` (model: `gemini-3.8-flash`) with 2,500ms race timeout and deterministic heuristic fallbacks. | Fine-tuning custom models or calling unauthorized third-party LLMs. |
| **Data Persistence** | Firebase Firestore (`buildwithai_projects` collection) isolated by authenticated user ID; localStorage fallback for guest users. | Multi-tenant team shared workspace access control lists. |
| **Devpost Compliance** | 14-point verifiable readiness checklist, Learn Skill Pack guide with command copy. | Automated direct submission via unofficial Devpost APIs. |

---

## 5. Exclusions

- **No Mock or Decorative Buttons**: Every button in the Build With AI module performs real actions (data updates, AI generation, copy, file download, or navigation).
- **No Direct Browser CLI Execution**: Dr. T explicitly does NOT claim to execute local terminal commands inside the web browser.
- **No Replacement of Dr. T Modules**: Build With AI is a standalone tab (`buildwithai`) and does not alter HealthAlert Companion, MicroBiz, or clinical workflows.

---

## 6. Constraints

1. **Model Governance**: Restricted to Google GenAI SDK (`@google/genai`) using verified model `gemini-3.8-flash`. Deprecated models are strictly prohibited.
2. **Latency Budget**: Server-side AI calls enforce a 2,500ms race timeout, immediately degrading to deterministic heuristics if AI is unresponsive or unconfigured.
3. **Database Security**: Firestore security rules must enforce `resource.data.userId == request.auth.uid` on read and write, preventing unauthorized access or user ID spoofing.
4. **Environment Isolation**: Client applications cannot hold backend Gemini API keys; all calls route through `/api/build-with-ai/*`.

---

## 7. Acceptance Criteria

- [x] Dedicated first-class `Build With AI` navigation tab operational in `Navbar.tsx` and `CommandPalette.tsx`.
- [x] Pre-loaded, fully valid **HealthAlert Mini** reference template accessible to all users.
- [x] Project creator allows starting from scratch or cloning the demonstration template.
- [x] Document Studio generates and validates `scope.md`, `prd.md`, `spec.md`, and `README.md`.
- [x] In-browser single `.md` download and full JSON bundle manifest export functional.
- [x] 6-stage Kanban board allows task creation, status updates, priority setting, and code review linkage.
- [x] Coding assistant reviews code snippets, highlights defects, suggests unit tests, and explains logic.
- [x] 14-point Devpost submission checklist with interactive tracking and clear verification statuses.
- [x] All 8 test suites pass (`npm test`), including 31 Build With AI automated assertions.
- [x] Firestore security rules verified against unauthenticated access and cross-user data tampering.
