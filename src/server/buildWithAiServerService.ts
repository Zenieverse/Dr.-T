import { GoogleGenAI } from '@google/genai';

let genAIClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY || '';
  if (!apiKey) return null;
  if (!genAIClient) {
    try {
      genAIClient = new GoogleGenAI({ apiKey });
    } catch (e) {
      console.warn('[BuildWithAi Server] Failed to initialize GoogleGenAI client:', e);
      return null;
    }
  }
  return genAIClient;
}

async function callGeminiWithTimeout(prompt: string, systemInstruction: string, timeoutMs = 2500): Promise<string> {
  const client = getGenAI();
  if (!client) {
    throw new Error('GoogleGenAI client unavailable');
  }

  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('AI generation timed out')), timeoutMs);
  });

  const modelPromise = client.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: {
      systemInstruction,
      temperature: 0.4,
    }
  }).then(res => res.text || '');

  try {
    return await Promise.race([modelPromise, timeoutPromise]);
  } finally {
    clearTimeout(timer!);
  }
}

export class BuildWithAiServerService {
  /**
   * Generate structured project brief from guided intake
   */
  static async generateBrief(intake: {
    name: string;
    description: string;
    targetAudience: string;
    problemStatement: string;
    proposedSolution: string;
    keyFeatures: string[];
    workflow: string;
    constraints: string;
    privacyConsiderations: string;
    successCriteria: string;
  }): Promise<{ brief: any; telemetry: { engine: string; latencyMs: number } }> {
    const startTime = Date.now();
    const systemInstruction = `You are a Principal AI Architect and Product Strategist helping a developer prepare a high-impact AI project for the Devpost Learn AI Basics challenge.
Analyze the user's project intake and generate a comprehensive, structured project brief in valid JSON format.
Ensure you detail problem statement, personas, user stories, functional requirements, scope boundaries, acceptance criteria, technical risks, milestones, and test strategy.`;

    const prompt = `Project Name: ${intake.name}
Description: ${intake.description}
Problem Statement: ${intake.problemStatement}
Target Audience: ${intake.targetAudience}
Proposed Solution: ${intake.proposedSolution}
Key Features: ${intake.keyFeatures.join(', ')}
Workflow: ${intake.workflow}
Constraints: ${intake.constraints}
Privacy: ${intake.privacyConsiderations}
Success Criteria: ${intake.successCriteria}

Output JSON with these exact keys:
{
  "problemStatement": string,
  "targetAudience": string,
  "userPersonas": [{"name": string, "role": string, "needs": string, "painPoints": string}],
  "userStories": [{"asA": string, "iWant": string, "soThat": string}],
  "proposedSolution": string,
  "workflow": string,
  "functionalRequirements": [string],
  "nonFunctionalRequirements": [string],
  "scopeBoundaries": {"inScope": [string], "outOfScope": [string]},
  "acceptanceCriteria": [string],
  "technicalRisks": [string],
  "securityAndPrivacy": [string],
  "milestones": [{"name": string, "targetDate": string, "done": boolean}],
  "testStrategy": string,
  "definitionOfDone": [string]
}`;

    try {
      const raw = await callGeminiWithTimeout(prompt, systemInstruction);
      const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      return {
        brief: { ...parsed, isApproved: false, generatedByAi: true, lastGeneratedAt: new Date().toISOString() },
        telemetry: { engine: 'gemini-3.8-flash', latencyMs: Date.now() - startTime }
      };
    } catch {
      // Deterministic heuristic fallback
      return {
        brief: {
          problemStatement: intake.problemStatement || 'Users face friction accomplishing workflows without intelligent automation.',
          targetAudience: intake.targetAudience || 'Software developers and end users.',
          userPersonas: [
            {
              name: 'Core Practitioner',
              role: intake.targetAudience || 'Developer',
              needs: 'Fast, automated execution and clear transparency.',
              painPoints: 'Fragmented tools and slow manual data synthesis.'
            }
          ],
          userStories: [
            {
              asA: intake.targetAudience || 'user',
              iWant: `to ${intake.proposedSolution || 'automate routine tasks'}`,
              soThat: 'I can achieve consistent, verifiable outcomes.'
            }
          ],
          proposedSolution: intake.proposedSolution || 'A robust full-stack solution utilizing AI assistance with deterministic fallbacks.',
          workflow: intake.workflow || 'Intake -> Process -> Triage -> Review -> Export',
          functionalRequirements: intake.keyFeatures.length ? intake.keyFeatures : ['Core workflow processing', 'Input validation', 'Output export'],
          nonFunctionalRequirements: ['Sub-3s latency for core actions', 'Zero unhandled runtime errors', 'Responsive accessible layout'],
          scopeBoundaries: {
            inScope: intake.keyFeatures.length ? intake.keyFeatures : ['Core feature MVP'],
            outOfScope: ['Complex legacy migrations', 'Custom hardware integrations (Phase 2)']
          },
          acceptanceCriteria: [
            'All core inputs are sanitized and validated before processing.',
            'System gracefully handles service degradation with clear user feedback.',
            intake.successCriteria || 'Core workflow delivers expected output.'
          ],
          technicalRisks: [
            'Model timeout or external API latency: mitigated via timeout race and fallback heuristics.',
            'Input data boundary exceptions: mitigated via schema clamps.'
          ],
          securityAndPrivacy: [
            intake.privacyConsiderations || 'Server-side key storage and PII scrubbing.',
            'Zero plaintext secret logging.'
          ],
          milestones: [
            { name: 'Milestone 1: Project Scope & PRD', targetDate: 'Day 1', done: true },
            { name: 'Milestone 2: Technical Specification', targetDate: 'Day 2', done: false },
            { name: 'Milestone 3: Implementation & Local Verification', targetDate: 'Day 4', done: false },
            { name: 'Milestone 4: Testing & Devpost Submission', targetDate: 'Day 6', done: false }
          ],
          testStrategy: 'Unit tests for core functions, automated boundary checks, and regression test suites.',
          definitionOfDone: [
            'Code adheres to strict TypeScript standards with 0 compiler errors',
            'All unit tests pass with exit code 0',
            'Documentation (scope.md, prd.md, spec.md, README.md) fully verified'
          ],
          isApproved: false,
          generatedByAi: false,
          lastGeneratedAt: new Date().toISOString()
        },
        telemetry: { engine: 'deterministic-heuristic-fallback', latencyMs: Date.now() - startTime }
      };
    }
  }

  /**
   * Draft or refine a required markdown document (scope.md, prd.md, spec.md, README.md)
   */
  static async draftDocument(params: {
    docType: 'scope.md' | 'prd.md' | 'spec.md' | 'README.md';
    projectName: string;
    brief: any;
  }): Promise<{ content: string; telemetry: { engine: string; latencyMs: number } }> {
    const startTime = Date.now();
    const systemInstruction = `You are a Principal Technical Writer and Software Engineer drafting production-grade Markdown planning documents for the Devpost Learn AI Basics challenge.
Draft complete, exhaustive, professional Markdown with clear section headers. Do NOT use placeholder dots or abbreviated hand-waving.`;

    const prompt = `Document Type: ${params.docType}
Project Name: ${params.projectName}
Brief Context: ${JSON.stringify(params.brief)}

Generate a complete, fully fleshed-out ${params.docType} adhering strictly to standard software engineering best practices.`;

    try {
      const raw = await callGeminiWithTimeout(prompt, systemInstruction);
      return {
        content: raw.replace(/```markdown/g, '').replace(/```/g, '').trim(),
        telemetry: { engine: 'gemini-3.8-flash', latencyMs: Date.now() - startTime }
      };
    } catch {
      // Deterministic fallback templates
      let fallbackContent = '';
      if (params.docType === 'scope.md') {
        fallbackContent = `# Project Scope: ${params.projectName}

## 1. Problem Statement
${params.brief?.problemStatement || 'Users encounter persistent friction in completing critical tasks due to lack of accessible, intelligent automation.'}

## 2. Target Users
${params.brief?.targetAudience || 'Software developers, domain practitioners, and end-users.'}

## 3. Goals and Objectives
- Deliver an intuitive, AI-assisted solution addressing the core problem statement.
- Guarantee predictable, bounded execution times with fallback safety mechanisms.
- Satisfy all submission requirements for the Devpost Learn AI Basics challenge.

## 4. Scope Boundaries
### In-Scope
${(params.brief?.scopeBoundaries?.inScope || ['Core functional workflow', 'Input validation', 'Markdown report generation']).map((s: string) => `- ${s}`).join('\n')}

### Out-of-Scope
${(params.brief?.scopeBoundaries?.outOfScope || ['Enterprise legacy migrations', 'Custom hardware firmware interfaces']).map((s: string) => `- ${s}`).join('\n')}

## 5. Exclusions
- Third-party commercial API lock-in without fallback alternatives.
- Autonomous diagnostic or safety-critical decisions without human review.

## 6. Constraints
- Strict serverless cloud scaling and cost control.
- Sub-3000ms latency on interactive user operations.
- Privacy compliance with zero unauthorized credential or PII retention.

## 7. Acceptance Criteria
${(params.brief?.acceptanceCriteria || ['System executes end-to-end with valid inputs.', 'Graceful error states when dependencies fail.']).map((s: string) => `- [x] ${s}`).join('\n')}
`;
      } else if (params.docType === 'prd.md') {
        fallbackContent = `# Product Requirements Document (PRD): ${params.projectName}

## 1. Product Vision
${params.brief?.proposedSolution || 'An intelligent, responsive software solution that transforms complex workflows into guided, verified steps.'}

## 2. User Personas and Stories
${(params.brief?.userPersonas || [{ name: 'Alex', role: 'Practitioner', needs: 'Fast execution', painPoints: 'Manual overhead' }]).map((p: any) => `### Persona: ${p.name} (${p.role})\n- **Needs:** ${p.needs}\n- **Pain Points:** ${p.painPoints}`).join('\n\n')}

### User Stories
${(params.brief?.userStories || [{ asA: 'user', iWant: 'to process inputs', soThat: 'I get verified results' }]).map((u: any) => `- **As a** ${u.asA}, **I want** ${u.iWant}, **so that** ${u.soThat}.`).join('\n')}

## 3. Feature Requirements
### Priority 0 (Must Have for MVP)
${(params.brief?.functionalRequirements || ['Core input intake', 'Triage & processing', 'Result export']).map((f: string, i: number) => `- **FR-${i + 1}:** ${f}`).join('\n')}

## 4. Prioritization
P0 items are essential for challenge submission and must be completed with 100% test pass rates before P1 enhancements are scoped.

## 5. User Experience & Flows
\`\`\`
[1. User Input] -> [2. Safety Validation] -> [3. AI Synthesis] -> [4. Review & Approval] -> [5. Export]
\`\`\`

## 6. Non-Functional Requirements
${(params.brief?.nonFunctionalRequirements || ['Sub-2.5s response latency', 'Zero unhandled exceptions', 'WCAG 2.1 AA accessibility']).map((n: string) => `- ${n}`).join('\n')}

## 7. Success Metrics
- 100% test pass rate across unit and integration suites.
- Sub-3 second turnaround on user-initiated actions.
`;
      } else if (params.docType === 'spec.md') {
        fallbackContent = `# Technical Specification: ${params.projectName}

## 1. System Architecture
- **Frontend:** React 19 SPA running on Vite with TypeScript and Tailwind CSS.
- **Backend:** Node.js Express 5 server providing authenticated proxy endpoints.
- **AI Integration:** Google GenAI SDK (@google/genai) with 2500ms race timeout and deterministic fallback.
- **Data Persistence:** Cloud Firestore with authenticated user isolation and client-side offline cache.

## 2. Component Design
- \`IntakeController\`: Captures, sanitizes, and validates user inputs.
- \`TriageEngine\`: Pure TypeScript deterministic evaluation engine.
- \`ReportGenerator\`: Assembles structured markdown and JSON payloads.
- \`ExportManager\`: Handles clipboard synchronization and file downloads.

## 3. Data Models and Contracts
\`\`\`typescript
export interface ProjectPayload {
  id: string;
  timestamp: string;
  data: Record<string, unknown>;
  status: 'PENDING' | 'SUCCESS' | 'ERROR';
}
\`\`\`

## 4. Error Handling and Resilience
- All network and AI calls are bounded with \`Promise.race\` against a 2500ms timeout.
- Unhandled rejections are caught at the Express error handler middleware and return clean JSON-RPC or REST errors.

## 5. Security and Privacy Architecture
- All API keys remain strictly on the server side.
- User input is scrubbed of email addresses, phone numbers, and potential script injection strings.

## 6. Test Plan
- Unit tests covering pure utility functions and rule boundaries.
- Integration tests simulating network timeouts and fallback execution.
- Release gate script verifying exit code 0.

## 7. Deployment and Operations
- Scalable containerized service deployed on Google Cloud Run (asia-southeast1).
- Health check route: \`GET /api/health\`.
`;
      } else {
        fallbackContent = `# ${params.projectName}

> ${params.brief?.proposedSolution || 'AI-assisted project built for Devpost Learn AI Basics'}

## 1. Overview
${params.brief?.problemStatement || 'A modern solution designed for impact and clarity.'}

## 2. Features
${(params.brief?.functionalRequirements || ['Intelligent workflow', 'Deterministic safety', 'Markdown export']).map((f: string) => `- ${f}`).join('\n')}

## 3. Architecture
TypeScript + React 19 + Express 5 + Google GenAI SDK.

## 4. Getting Started
\`\`\`bash
npm install
npm run dev
\`\`\`

## 5. Testing
\`\`\`bash
npm test
\`\`\`

## 6. Disclaimer and License
MIT License.
`;
      }

      return {
        content: fallbackContent,
        telemetry: { engine: 'deterministic-heuristic-fallback', latencyMs: Date.now() - startTime }
      };
    }
  }

  /**
   * Code review and implementation assistance
   */
  static async reviewCode(params: {
    filename: string;
    codeSnippet: string;
    taskDescription?: string;
  }): Promise<{ review: any; telemetry: { engine: string; latencyMs: number } }> {
    const startTime = Date.now();
    const systemInstruction = `You are a Senior Principal Code Reviewer and Security Engineer.
Analyze the provided code snippet for software defects, security vulnerabilities, performance anti-patterns, and testability.
Output valid JSON only.`;

    const prompt = `File: ${params.filename}
Task Context: ${params.taskDescription || 'General implementation'}
Code:
\`\`\`
${params.codeSnippet}
\`\`\`

Output JSON format:
{
  "findings": [{"type": "defect"|"security"|"performance"|"best_practice", "message": string, "severity": "info"|"low"|"medium"|"high"|"critical", "lineHint": string}],
  "suggestedTests": [string],
  "implementationInstructions": string,
  "explainedInPlainLanguage": string
}`;

    try {
      const raw = await callGeminiWithTimeout(prompt, systemInstruction);
      const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      return {
        review: parsed,
        telemetry: { engine: 'gemini-3.8-flash', latencyMs: Date.now() - startTime }
      };
    } catch {
      // Deterministic heuristic code analysis
      const findings: any[] = [];
      const suggestedTests: string[] = [];

      if (/eval\(|new Function\(|innerHTML/.test(params.codeSnippet)) {
        findings.push({
          type: 'security',
          message: 'Potential code injection risk detected: avoid eval(), new Function(), or unescaped innerHTML.',
          severity: 'high',
          lineHint: 'Review dynamic execution expressions'
        });
      }

      if (/apiKey|secret|password|token/i.test(params.codeSnippet) && !/process\.env|import\.meta/.test(params.codeSnippet)) {
        findings.push({
          type: 'security',
          message: 'Possible hardcoded credential token: move secret keys to environment variables.',
          severity: 'critical',
          lineHint: 'Check credential string literals'
        });
      }

      if (params.codeSnippet.includes('any')) {
        findings.push({
          type: 'best_practice',
          message: 'Usage of "any" type found: specify strict TypeScript interfaces to improve type safety.',
          severity: 'low',
          lineHint: 'Replace any with concrete types or generics'
        });
      }

      suggestedTests.push('Unit test verifying null, undefined, and empty string inputs.');
      suggestedTests.push('Boundary test verifying numeric extremes and boundary conditions.');
      suggestedTests.push('Mock test validating timeout race condition handling.');

      return {
        review: {
          findings: findings.length ? findings : [{ type: 'best_practice', message: 'No critical anti-patterns detected in snippet.', severity: 'info' }],
          suggestedTests,
          implementationInstructions: 'Ensure all inputs are validated before execution and encapsulate external network calls with timeout handlers.',
          explainedInPlainLanguage: 'This code handles data transformation and application logic. The logic is clean, and adding strict input boundaries will maximize reliability.'
        },
        telemetry: { engine: 'deterministic-heuristic-fallback', latencyMs: Date.now() - startTime }
      };
    }
  }
}
