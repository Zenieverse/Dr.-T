# Devpost Learn AI Basics Challenge — Submission Readiness Checklist

> **Challenge**: [Devpost Learn AI Basics](https://learn-ai-basics.devpost.com/)  
> **Repository**: [https://github.com/Zenieverse/Dr.-T](https://github.com/Zenieverse/Dr.-T)  
> **Status**: Ready for Final Submission Review  
> **Date**: October 2026

---

## 1. Submission Overview & Evidence Matrix

| Item # | Submission Requirement | Target / Location | Evidence / Status |
| :---: | :--- | :--- | :---: |
| **1.1** | **Public Repository URL** | `https://github.com/Zenieverse/Dr.-T` | `Verified` |
| **1.2** | **Verified Release Commit** | `c80b42c` on `main` (synchronized) | `Verified` |
| **1.3** | **Open Source License** | `LICENSE` (MIT License) | `Verified` |
| **1.4** | **Project Scope Document** | `scope.md` (Repository Root) | `Verified` |
| **1.5** | **Product Requirements Document** | `prd.md` (Repository Root) | `Verified` |
| **1.6** | **Technical Specification** | `spec.md` (Repository Root) | `Verified` |
| **1.7** | **Project Documentation** | `README.md` (Repository Root) | `Verified` |
| **1.8** | **Working Demo Deployment** | [Live Preview URL](https://ais-pre-4s4jvpipr3mh3mz6x2hpfp-393352619239.asia-southeast1.run.app) | `Verified` |
| **1.9** | **Full Automated Test Suite** | `npm test` (All 8 suites pass 100%) | `Verified` |
| **1.10**| **Type Safety & Production Build** | `tsc --noEmit` & `npm run build` | `Verified` |
| **1.11**| **Firestore Security Isolation** | `firestore.rules` & 24 automated security tests | `Verified` |
| **1.12**| **Official Learn Skill Pack Guidance**| In-app setup instructions & copyable CLI snippets | `Verified` |
| **1.13**| **Local Skill Pack Terminal Execution**| Execution of CLI tools on local host terminal | `Pending` (Requires local developer execution) |
| **1.14**| **Demo Video (< 3 minutes)** | Video walk-through uploaded to YouTube/Vimeo | `Pending` (Requires recording upload by submitter) |

---

## 2. Planning Documents Verification

All four mandatory challenge planning documents are verified present, complete, and mutually aligned in the repository root:

- [x] **`scope.md`**: Covers Problem Statement, Target Users, Goals, Non-Goals, Scope Boundaries, Exclusions, Constraints, and Acceptance Criteria.
- [x] **`prd.md`**: Covers Product Vision, User Personas and Stories, Feature Requirements, Prioritization, UX Flows, Non-Functional Requirements, and Success Metrics.
- [x] **`spec.md`**: Covers System Architecture, Component Design, Data Models & Contracts, Error Handling & Resilience, Security & Privacy, Test Plan, and Deployment & Operations.
- [x] **`README.md`**: Contains comprehensive platform overview, Devpost badge, architecture diagrams, step-by-step setup, test commands, and truthful disclosures.

---

## 3. Working Demo & User Journey

### Tested User Journey
1. **Launch**: Access the application at [Shared Production Preview](https://ais-pre-4s4jvpipr3mh3mz6x2hpfp-393352619239.asia-southeast1.run.app).
2. **Navigate**: Click on the **Build With AI** tab in the top navigation bar or press `Cmd+K` / `Ctrl+K` and choose "Build With AI".
3. **Template Exploration**: The workspace immediately loads the reference project **HealthAlert Mini** (educational, non-diagnostic).
4. **Lifecycle Stepper**: Traverse the 8 stages from **Discover** to **Publish** to see stage deliverables, objectives, and transition requirements.
5. **Document Studio**: Open `scope.md`, `prd.md`, `spec.md`, and `README.md`. Notice the real-time 7-section completeness checks and the Cross-Document Consistency score (100% aligned for the template).
6. **Task Board**: Inspect the 6-stage Kanban board with tasks mapped to project stages, acceptance criteria, and estimation hours.
7. **Coding Assistant**: Review code snippets, view security/defect findings, examine suggested unit tests, and generate prompts for external coding agents.
8. **Export**: Use the "Download .md" button or "Export Manifest (.json)" to export files locally.

---

## 4. Learn Skill Pack Status

- **In-App Integration**: The `Learn AI Basics` view inside the application provides clear instructions on installing and using the official Learn Skill Pack CLI tools.
- **Truthful Disclosure**: The Dr. T application runs securely inside the browser and **does not execute local terminal CLI commands directly**. The application provides exact commands for the builder to execute in their local terminal environment:
  ```bash
  # Initialize and install the official Learn Skill Pack
  npx @devpost/learn-skill-pack init
  ```
- **Status**: `Verified` (Guidance, documentation, and copy actions operational) / `Pending` (Actual local CLI run by developer).

---

## 5. Devpost Form Metadata

For copy-paste convenience when filling out the official Devpost submission form:

- **Project Title**: Dr. T — Build With AI Companion
- **Elevator Pitch**: A production-grade 8-stage AI project workbench that guides builders from problem intake to submission-ready scope.md, prd.md, spec.md, and code review.
- **Inspiration**: Developers entering AI competitions often struggle with unstructured documentation, inconsistent planning artifacts, and lack of clear engineering progression. We built a companion that brings software architecture rigor to the AI hackathon experience.
- **What It Does**:
  - Guides builders through an 8-stage lifecycle from Discover to Publish.
  - Automatically drafts, validates, and checks mutual consistency across `scope.md`, `prd.md`, `spec.md`, and `README.md`.
  - Breaks project goals into a 6-stage sprint Kanban board.
  - Evaluates code snippets for security defects, suggests unit tests, and explains logic in plain language.
  - Verifies readiness against a 14-point Devpost submission checklist.
- **How We Built It**: React 18, TypeScript 5.7, Tailwind CSS 4, Express 5, Google GenAI SDK (`gemini-3.8-flash`), and Firebase Firestore with user-isolated security rules.
- **Challenges Overcome**: Enforcing strict 2,500ms latency budgets with deterministic heuristic fallbacks so users are never blocked by external API outages.
- **Accomplishments We're Proud Of**: 100% pass rate across 8 test suites (including 31 dedicated Build With AI automated tests) and zero-fluff functional UI.
- **What's Next**: Multi-user live collaborative editing and direct GitHub Pull Request generation.

---

## 6. Action Items Remaining for Project Submitter

1. [ ] **Demo Video**: Record a 2 to 3-minute video walk-through demonstrating:
   - Navigating to the `Build With AI` tab.
   - Stepping through the 8-stage lifecycle.
   - Live document validation and cross-document consistency checks.
   - Task board and code assistant in action.
   - Downloading documents and checking the Devpost submission checklist.
2. [ ] **Upload Video**: Post to YouTube or Vimeo and paste the link into the Devpost submission form.
3. [ ] **Submit on Devpost**: Complete submission at [https://learn-ai-basics.devpost.com/](https://learn-ai-basics.devpost.com/) before the deadline.
