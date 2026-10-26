# Technical Specification: Dr. T — Build With AI Companion

> **Challenge Track**: [Devpost Learn AI Basics](https://learn-ai-basics.devpost.com/)  
> **Technology Stack**: React 18, TypeScript 5.7, Tailwind CSS 4, Express 5, Node.js 22, Firebase Firestore & Auth, Google GenAI SDK (`@google/genai`)  
> **Status**: Verified in Production (Commit: `c80b42c` on `main`)

---

## 1. System Architecture

The Build With AI architecture follows a modular, dual-tier pattern integrated into the Dr. T platform:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER (React 18 SPA)                     │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    BuildWithAiModule (Router / Shell)            │  │
│  ├─────────────┬─────────────┬─────────────┬───────────┬────────────┤  │
│  │  Dashboard  │  Lifecycle  │  Documents  │ TaskBoard │ CodeAssist │  │
│  │    View     │    View     │   Studio    │  (Kanban) │   & Chat   │  │
│  └─────────────┴─────────────┴─────────────┴───────────┴────────────┘  │
│          │                           │                       │         │
│          v                           v                       v         │
│  ┌───────────────────┐     ┌───────────────────┐   ┌─────────────────┐ │
│  │BuildWithAiService │     │Section Validator  │   │Consistency Engine││
│  └─────────┬─────────┘     └───────────────────┘   └─────────────────┘ │
└────────────┼───────────────────────────────────────────────────────────┘
             │                                       │
      (HTTP REST API)                     (Firebase SDK / Cache)
             v                                       v
┌──────────────────────────────┐     ┌───────────────────────────────────┐
│     SERVER TIER (Express 5)  │     │       PERSISTENCE & SECURITY      │
│  • /api/build-with-ai/brief  │     │  • Firestore: buildwithai_projects│
│  • /api/build-with-ai/draft  │     │  • Rules: userId == auth.uid      │
│  • /api/build-with-ai/code   │     │  • LocalStorage (Guest fallback)  │
│  • 2500ms Race Timeout       │     └───────────────────────────────────┘
│  • Gemini 3.8 Flash + Fallback│
└──────────────────────────────┘
```

### Key Architectural Invariants
1. **First-Class Isolation**: The module resides cleanly in `src/components/buildwithai/` and communicates with the rest of Dr. T via standard React navigation (`setActiveTab('buildwithai')`).
2. **Zero Client Secrets**: The Google GenAI SDK is executed strictly server-side in `src/server/buildWithAiServerService.ts`. No API keys or service credentials are leaked to the client bundle.
3. **Deterministic Resilience**: Every AI request is wrapped in a `Promise.race` with a 2,500ms timeout. If the AI model fails or times out, a deterministic heuristic engine generates structured fallback results.

---

## 2. Component Design

| Component | Path | Responsibility |
| :--- | :--- | :--- |
| **BuildWithAiModule** | `src/components/buildwithai/BuildWithAiModule.tsx` | Main workspace container, project selector dropdown, "+ New Project" modal, stage stepper, and tab router. |
| **DashboardView** | `src/components/buildwithai/views/DashboardView.tsx` | High-level metrics, active stage overview, deliverable progress cards, blocker badges, and action recommendations. |
| **LifecycleView** | `src/components/buildwithai/views/LifecycleView.tsx` | 8-stage interactive stepper with stage-specific deliverables, objectives, tasks, and stage progression controls. |
| **IntakeBriefView** | `src/components/buildwithai/views/IntakeBriefView.tsx` | 6-step guided intake form capturing problem, audience, solution, features, constraints, and Gemini brief synthesis. |
| **DocumentEditorView**| `src/components/buildwithai/views/DocumentEditorView.tsx`| Markdown editor with live preview, real-time section completeness validation, cross-consistency checks, and file export. |
| **TaskBoardView** | `src/components/buildwithai/views/TaskBoardView.tsx` | 6-column Kanban board (Backlog, Ready, In Progress, Testing, Done, Blocked) with task creator and priority tags. |
| **CodingAssistantView**| `src/components/buildwithai/views/CodingAssistantView.tsx`| Code review workbench, defect/security analysis, suggested tests, plain-language explainer, and agent prompt generator. |
| **LearnAiBasicsView** | `src/components/buildwithai/views/LearnAiBasicsView.tsx` | Devpost challenge checklist, Learn Skill Pack installation guide, CLI copy shortcuts, and submission verification status. |

---

## 3. Data Models and Contracts

### Core TypeScript Interfaces (`src/components/buildwithai/types.ts`)

```typescript
export type LifecycleStage = 
  | 'discover' | 'scope' | 'plan' | 'specify' 
  | 'build' | 'test' | 'document' | 'publish';

export interface ProjectDocument {
  id: string;
  filename: 'scope.md' | 'prd.md' | 'spec.md' | 'README.md';
  title: string;
  content: string;
  status: 'draft' | 'in_review' | 'approved';
  lastUpdated: string;
  isApproved: boolean;
  sourceOfTruth: 'human_authored' | 'ai_generated' | 'dr_t_draft';
  requiredSections: string[];
  validationErrors: string[];
}

export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'backlog' | 'ready' | 'in_progress' | 'testing' | 'done' | 'blocked';
  stage: LifecycleStage;
  acceptanceCriteria: string[];
  testExpectations: string;
  estimatedHours: number;
  linkedDocId?: string;
}

export interface BuildWithAiProject {
  id: string;
  name: string;
  tagline: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  isTemplate?: boolean;
  currentStage: LifecycleStage;
  brief: ProjectBrief;
  documents: Record<string, ProjectDocument>;
  tasks: ProjectTask[];
  codeReviews: CodeReviewRecord[];
  checklist: ChallengeChecklist;
}
```

### Server API Contracts

#### 1. Generate Brief (`POST /api/build-with-ai/brief`)
- **Request Body**: `{ name, description, targetAudience, problemStatement, proposedSolution, keyFeatures, workflow, constraints, privacyConsiderations, successCriteria }`
- **Response**: `{ brief: ProjectBrief, telemetry: { engine: 'gemini-3.8-flash' | 'heuristic_fallback', latencyMs: number } }`

#### 2. Draft Document (`POST /api/build-with-ai/draft-doc`)
- **Request Body**: `{ docType: 'scope.md' | 'prd.md' | 'spec.md' | 'README.md', projectName: string, brief: ProjectBrief }`
- **Response**: `{ filename: string, content: string, telemetry: { engine: string, latencyMs: number } }`

#### 3. Code Review & Agent Prompt (`POST /api/build-with-ai/code-assist`)
- **Request Body**: `{ filename: string, codeSnippet: string, taskDescription?: string }`
- **Response**: `{ review: CodeReviewRecord, agentPrompt: string, telemetry: { engine: string, latencyMs: number } }`

---

## 4. Error Handling and Resilience

1. **AI Timeout Budget**: All Gemini calls run through `callGeminiWithTimeout` with a 2,500ms `Promise.race` limit. Timers are explicitly cleared via `try ... finally { clearTimeout(timer); }` to prevent event loop leaks.
2. **Deterministic Fallbacks**: If the Gemini client is unconfigured, network times out, or rate limits are encountered, the backend automatically calls deterministic heuristics:
   - `buildFallbackBrief()` generates complete personas, stories, and functional requirements.
   - `buildFallbackDraft()` generates complete Markdown documents passing all 7 section checks.
   - `buildFallbackReview()` performs regex and pattern analysis for security issues, test cases, and plain-language explanation.
3. **Client Degradation**: If the backend is unreachable, the client displays an inline warning banner and seamlessly uses client-side template generators and `localStorage`.

---

## 5. Security and Privacy Architecture

1. **Database Isolation (`firestore.rules`)**:
   ```javascript
   match /buildwithai_projects/{projectId} {
     allow read, update, delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
     allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
   }
   ```
2. **Zero Credential Exposure**: Client bundles never import Google GenAI SDK keys or private Firestore service account credentials.
3. **Ephemeral Guest Sandboxing**: Unauthenticated guests operate in isolated browser storage (`localStorage`), strictly isolated from production Firestore collections.
4. **Input Sanitization**: Document rendering uses sanitized Markdown display preventing cross-site scripting (XSS).

---

## 6. Test Plan

Automated test verification is implemented in `scripts/test-build-with-ai.ts` and integrated into the primary `npm test` script:

1. **Test Group 1 (Template Integrity)**: Verifies that `HEALTHALERT_MINI_TEMPLATE` contains all 4 mandatory documents, $\ge 6$ sprint tasks, and all 14 checklist items.
2. **Test Group 2 (Section Validation)**: Validates that `scope.md`, `prd.md`, and `spec.md` pass all 7 required section checks, and confirms negative detection on incomplete documents.
3. **Test Group 3 (Consistency Engine)**: Tests cross-document mutual consistency scoring, persona mapping, and architectural coherence.
4. **Test Group 4 (Server AI & Heuristic Fallbacks)**: Validates `generateBrief`, `draftDocument`, and `reviewCode` latency, payload integrity, and graceful fallback behavior.
5. **Test Group 5 (Navigation & Architectural Invariants)**: Verifies `NavTab` inclusion in `src/types.ts`, `Navbar.tsx`, `App.tsx`, and user isolation in `firestore.rules`.
6. **Test Group 6 (Root Planning Artifacts)**: Verifies that `scope.md`, `prd.md`, `spec.md`, and `docs/learn-ai-basics-submission-checklist.md` exist and are complete.

---

## 7. Deployment and Operations

- **Hosting Environment**: Google Cloud Run (Containerized Node.js service).
- **Build Pipeline**: `npm run build` runs `vite build`, bundles `server.impl.ts` via `esbuild` into `dist/server.cjs`, and synchronizes multi-target deployment artifacts (`dist/`, `build/`, `.next/`).
- **Production Server**: Express 5 on Node 22 (`server.ts` / `dist/server.cjs`).
- **Health Verification**: Built-in HTTP health endpoints and MCP diagnostic routes.
