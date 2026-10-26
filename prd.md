# Product Requirements Document (PRD): Dr. T — Build With AI Companion

> **Challenge Track**: [Devpost Learn AI Basics](https://learn-ai-basics.devpost.com/)  
> **Target Audience**: AI Hackathon Participants, Solo Developers, Technical Founders  
> **Status**: Production Operational (Module: `BuildWithAiModule.tsx`)

---

## 1. Product Vision

**Build With AI** transforms the often chaotic process of preparing an AI hackathon project into a structured, reliable, and evidence-backed engineering journey. By integrating automated document scaffolding, cross-document mutual consistency validation, sprint execution tracking, and an AI-assisted code reviewer, Build With AI equips builders to deliver high-quality, submission-ready software products aligned with Devpost standards.

---

## 2. User Personas and Stories

### Primary Personas
1. **Alex (Solo Hackathon Participant)**: A full-stack developer who wants to conceptualize, plan, and build an AI prototype over a weekend, requiring rapid generation of `scope.md`, `prd.md`, and `spec.md` without missing required challenge criteria.
2. **Priya (AI Basics Learner)**: A newcomer to generative AI learning how prompt engineering, coding agents, and technical specifications interact in a professional development cycle.
3. **Dr. Marcus (Domain Specialist & Creator)**: An innovator with subject-matter expertise (e.g., healthcare, climate) who needs plain-language explanations of code architecture, task decomposition, and verifiable submission packaging.

### User Stories
- **US-1 (Lifecycle Orientation)**: *As a builder, I want an 8-stage visual lifecycle roadmap so that I understand where my project stands from Discover to Publish.*
- **US-2 (Intake Synthesis)**: *As a developer, I want a guided intake form that converts my product ideas into structured personas, functional requirements, and risk boundaries using Gemini 3.8 Flash.*
- **US-3 (Document Authoring & Validation)**: *As a hackathon participant, I want real-time validation of mandatory sections in `scope.md`, `prd.md`, `spec.md`, and `README.md` so that I never submit an incomplete document.*
- **US-4 (Cross-Document Consistency)**: *As an architect, I want automated consistency checks comparing my scope, PRD, and technical spec so that terminology and requirements do not drift.*
- **US-5 (Task Execution & Kanban)**: *As a project lead, I want a sprint Kanban board connected to project stages so that I can track work items from Backlog to Done.*
- **US-6 (Coding Assistant & Prompt Synthesis)**: *As a developer, I want an in-app tool that reviews my code snippets for security flaws, suggests unit tests, explains logic in plain English, and formats instructions for external coding agents.*
- **US-7 (Devpost Compliance Tracking)**: *As a submitter, I want an interactive 14-point Devpost checklist so that I can track and verify submission criteria before the deadline.*
- **US-8 (Artifact Export)**: *As a builder, I want to download standalone `.md` files or export a complete JSON project manifest bundle to import into my local workspace or repository.*

---

## 3. Feature Requirements

### Core Modules & Capabilities

| ID | Feature Name | Priority | Status | Description |
| :--- | :--- | :---: | :---: | :--- |
| **FR-1** | Project Dashboard | P0 | Verified | Project metrics, active stage, deliverable statuses, next action recommendation, and blocker alerts. |
| **FR-2** | 8-Stage Lifecycle | P0 | Verified | Interactive lifecycle navigator with stage-specific tasks, objectives, and transition criteria. |
| **FR-3** | Guided Intake & Brief | P0 | Verified | Interactive questionnaire synthesizing problem, audience, solution, and boundaries via Gemini 3.8 Flash (with heuristic fallback). |
| **FR-4** | Document Studio | P0 | Verified | Live Markdown editor for `scope.md`, `prd.md`, `spec.md`, and `README.md` with section validators, copy, and file download. |
| **FR-5** | Cross-Consistency Engine | P0 | Verified | Semantic alignment analyzer evaluating persona coverage, scope boundary matching, and technical consistency. |
| **FR-6** | Sprint Kanban Board | P1 | Verified | 6-column task board with priority badges, acceptance criteria, estimated hours, and direct code review linking. |
| **FR-7** | Coding Assistant | P1 | Verified | Code review engine (security, defect detection, test suggestions, plain-language summary) and coding agent prompt builder. |
| **FR-8** | Devpost Checklist & Learn Guide | P0 | Verified | 14-point verifiable checklist and Learn Skill Pack setup documentation with copy-to-clipboard commands. |
| **FR-9** | Reference Template (HealthAlert Mini) | P0 | Verified | Complete pre-populated project showcasing full compliance for testing and immediate evaluation. |
| **FR-10**| Dual Storage Layer | P0 | Verified | Firestore persistence for authenticated accounts with automatic localStorage fallback for unauthenticated guests. |

---

## 4. Prioritization

- **P0 (Must-Have for Devpost Submission)**:
  - Guided project creation and template loading.
  - Generation, editing, section validation, and export of `scope.md`, `prd.md`, `spec.md`, and `README.md`.
  - Mutual cross-document consistency engine.
  - Devpost 14-point compliance checklist.
  - Server-side Gemini 3.8 Flash proxy with 2,500ms timeout and deterministic fallbacks.
  - Isolated Firestore security rules.
- **P1 (Core Value Enhancements)**:
  - Interactive 6-column Kanban task board.
  - In-app coding assistant (security review, test generator, plain-language explainer).
  - Coding agent prompt generator.
- **P2 (Future / Post-Hackathon Roadmap)**:
  - Multi-user collaborative editing via WebSockets.
  - Direct GitHub API PR creation from inside the browser.
  - Cloud Run one-click deployment orchestration.

---

## 5. User Experience & Flows

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  1. INTAKE   │ ──> │ 2. LIFECYCLE │ ──> │ 3. DOCUMENTS │ ──> │ 4. EXECUTION │
│  Answer      │     │ Select Stage │     │ Author &     │     │ Track Tasks  │
│  Guided Form │     │ (Discover to │     │ Validate     │     │ on Kanban    │
│  or Template │     │  Publish)    │     │ Scope/PRD/   │     │ & Review Code│
└──────────────┘     └──────────────┘     │ Spec/README  │     └──────────────┘
                                          └──────┬───────┘            │
                                                 │                    │
                                                 v                    v
                                          ┌──────────────┐     ┌──────────────┐
                                          │ 5. EXPORT    │ <── │ 6. PUBLISH   │
                                          │ Download .md │     │ Complete     │
                                          │ & Manifest   │     │ Devpost Gate │
                                          └──────────────┘     └──────────────┘
```

1. **Intake Flow**: User inputs core problem, audience, and solution, or loads the pre-configured **HealthAlert Mini** demonstration.
2. **Scaffolding Flow**: System automatically generates initialized drafts for `scope.md`, `prd.md`, `spec.md`, and `README.md`.
3. **Refinement Flow**: User edits documents in live Markdown view with real-time section header completeness validation.
4. **Execution Flow**: User creates tasks, reviews code snippets, generates coding agent prompts, and tracks sprint progress.
5. **Publish Flow**: User validates against the 14-point checklist, downloads artifacts, and executes local Learn Skill Pack workflows.

---

## 6. Non-Functional Requirements

- **Performance & Latency**: AI endpoints enforce a 2,500ms `Promise.race` timeout, degrading gracefully to deterministic heuristics so the user is never blocked by external API latency.
- **Security & Privacy**: Zero API keys or secrets exposed to client browsers. All calls routed through `/api/build-with-ai/*`.
- **Data Isolation**: User data isolated in Firestore collection `/buildwithai_projects/{projectId}` where `userId == request.auth.uid`.
- **Zero Fluff Discipline**: All UI controls trigger real state modifications, file downloads, or server actions. No placeholder buttons.
- **Responsive Layout**: Fluid layout across desktop, tablet, and mobile displays using Tailwind CSS.

---

## 7. Success Metrics

1. **Section Validation Pass Rate**: 100% of generated and template documents pass the 7 required section checks.
2. **Cross-Document Consistency**: Consistency engine scores over 85% on aligned projects with clear persona-to-spec traceability.
3. **Submission Readiness**: 14/14 points on the Devpost Learn AI Basics checklist verified before submission.
4. **Test Suite Integrity**: 100% green pass rate across all automated test suites (`scripts/test-build-with-ai.ts` and related tests).
