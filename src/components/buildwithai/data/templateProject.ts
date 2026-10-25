import { BuildWithAiProject } from '../types';

export const HEALTHALERT_MINI_TEMPLATE: BuildWithAiProject = {
  id: 'template_healthalert_mini',
  userId: 'template',
  isTemplate: true,
  name: 'HealthAlert Mini (Demonstration Template)',
  tagline: 'Transparent, safety-oriented clinician handoff summary for user-reported vitals',
  description: 'An educational, synthetic reference project created for the Devpost Learn AI Basics challenge demonstrating end-to-end scoping, PRD generation, architectural specification, deterministic safety triage, and clinician handoff export.',
  stage: 'specify',
  modelPreference: 'gemini-3.8-flash',
  targetAudience: 'Patients monitoring ambulatory cardiometabolic vitals (BP, glucose) and primary care physicians receiving pre-visit intakes.',
  problemStatement: 'Patients frequently bring unorganized wearable and self-monitored vital logs to 15-minute primary care appointments, causing clinical cognitive overload and delayed detection of emergent warning signs.',
  proposedSolution: 'A responsive client-server web app that accepts patient vitals, applies deterministic clinical safety checks, generates an SBAR clinician handoff summary using Gemini AI, and exports an HL7 FHIR RiskAssessment JSON.',
  keyFeatures: [
    'Guided vital entry form with boundary validation (Systolic, Diastolic, Heart Rate, Glucose)',
    'Deterministic red-flag safety triage (immediate emergency dispatch guidance for BP >= 180/120 or chest pain)',
    'Structured SBAR (Situation-Background-Assessment-Recommendation) clinician handoff generator',
    'HL7 FHIR Release 4 RiskAssessment compliant export',
    'Zero-telemetry patient privacy mode with unscrubbed PII rejection'
  ],
  workflow: 'User inputs synthetic vitals -> Hardcoded safety rules evaluate emergency threshold -> If safe, Gemini generates structured SBAR brief -> Patient reviews and exports PDF/Markdown summary for clinician appointment.',
  constraints: 'Must run with scale-to-zero serverless architecture, 2500ms timeout on LLM enrichment, and zero external diagnostic claim without FDA SaMD clearance.',
  privacyConsiderations: 'Client-side sanitization of names, dates, and emails. No storage of patient health information without explicit authenticated consent.',
  successCriteria: '100% deterministic escalation of emergency indicators, sub-3 second SBAR generation, and valid FHIR R4 schema compliance.',
  submissionDestination: 'Devpost Learn AI Basics (https://learn-ai-basics.devpost.com/)',
  createdAt: '2026-10-24T08:00:00.000Z',
  updatedAt: '2026-10-24T12:00:00.000Z',
  brief: {
    problemStatement: 'Ambulatory patients lack a standard, safety-gated format to synthesize at-home blood pressure and blood glucose logs into a clinician-usable pre-visit summary.',
    targetAudience: 'Adults with Stage 1/2 Hypertension or Pre-diabetes and outpatient clinicians.',
    userPersonas: [
      {
        name: 'Alex Morgan',
        role: 'Ambulatory Patient',
        needs: 'Clear explanation of blood pressure readings and a concise report to show their doctor.',
        painPoints: 'Anxiety from searching online symptom checkers; disorganized paper logs.'
      },
      {
        name: 'Dr. Sarah Lin',
        role: 'Primary Care Physician',
        needs: 'A 30-second SBAR summary highlighting average vitals, trends, and patient concerns.',
        painPoints: 'Too little time during 15-minute consultations to manually review raw spreadsheets.'
      }
    ],
    userStories: [
      {
        asA: 'patient with elevated blood pressure',
        iWant: 'to enter my latest reading and know if it requires immediate emergency care or a routine doctor visit',
        soThat: 'I take the correct safety actions without panic.'
      },
      {
        asA: 'primary care physician',
        iWant: 'a standardized SBAR report with vitals and patient concerns',
        soThat: 'I can rapidly formulate an evidence-based care plan during the visit.'
      }
    ],
    proposedSolution: 'A dual-engine triage and documentation tool: hardcoded clinical invariants detect hypertensive crisis or angina, while Gemini 3.8 Flash formats safe readings into an SBAR brief with clinician discussion questions.',
    workflow: 'Input vitals -> Invariant Safety Rule Gate -> LLM SBAR Enrichment -> Patient Review -> Export.',
    functionalRequirements: [
      'Accept systolic BP (70-260 mmHg), diastolic BP (40-160 mmHg), and fasting glucose (40-500 mg/dL).',
      'Deterministic rule engine to escalate any reading with systolic >= 180 or diastolic >= 120 directly to emergency guidance.',
      'SBAR report generator producing Situation, Background, Assessment, and Recommendation blocks.',
      'Export feature generating Markdown and FHIR R4 JSON.'
    ],
    nonFunctionalRequirements: [
      'Sub-2500ms AI latency with deterministic fallback on timeout.',
      'Zero server persistence of unauthenticated guest health records.',
      'WCAG 2.1 AA accessibility compliance for form controls and contrast.'
    ],
    scopeBoundaries: {
      inScope: [
        'Vital sign intake and range validation',
        'Deterministic emergency triage rules',
        'SBAR summary formatting',
        'Clinician question checklist generation'
      ],
      outOfScope: [
        'Prescription drug dosage modifications',
        'Direct EHR writeback via proprietary APIs',
        'Autonomous diagnosis of cardiovascular disease'
      ]
    },
    acceptanceCriteria: [
      'Given BP of 185/115 mmHg, system displays immediate emergency escalation with local emergency numbers.',
      'Given BP of 138/88 mmHg, system categorizes as Stage 1 HTN and recommends primary care review within 2-4 weeks.',
      'All AI-generated summaries contain a prominent non-diagnostic educational disclaimer.'
    ],
    technicalRisks: [
      'LLM hallucinating medication changes: mitigated via system instruction bounding and strict heuristic output guardrails.',
      'Network failure during triage: mitigated by evaluating all emergency rules client-side before calling external APIs.'
    ],
    securityAndPrivacy: [
      'Client-side PII scrubber removing emails and phone numbers from free-text concerns.',
      'Encrypted transit via HTTPS and TLS 1.3.'
    ],
    milestones: [
      { name: 'Milestone 1: Project Scoping & PRD', targetDate: '2026-10-25', done: true },
      { name: 'Milestone 2: Deterministic Safety Rule Engine', targetDate: '2026-10-26', done: true },
      { name: 'Milestone 3: SBAR & Question Generator with Gemini API', targetDate: '2026-10-27', done: true },
      { name: 'Milestone 4: End-to-End Testing & Devpost Submission', targetDate: '2026-10-28', done: false }
    ],
    testStrategy: 'Automated unit tests for safety rules, edge-case validation for boundary values, and simulated offline fallback checks.',
    definitionOfDone: [
      'All unit and integration tests passing with zero failures',
      'scope.md, prd.md, and spec.md validated and mutually consistent',
      'Demo video recorded demonstrating emergency escalation and SBAR generation',
      'Public GitHub repository with MIT license and reproducible README'
    ],
    isApproved: true,
    generatedByAi: true,
    lastGeneratedAt: '2026-10-24T10:00:00.000Z'
  },
  documents: {
    'scope.md': {
      id: 'doc_scope_mini',
      filename: 'scope.md',
      title: 'Project Scope — HealthAlert Mini',
      status: 'reviewed',
      lastUpdated: '2026-10-24T10:15:00.000Z',
      isApproved: true,
      sourceOfTruth: 'dr_t_draft',
      requiredSections: [
        '1. Problem Statement',
        '2. Target Users',
        '3. Goals and Objectives',
        '4. Scope Boundaries',
        '5. Exclusions',
        '6. Constraints',
        '7. Acceptance Criteria'
      ],
      validationErrors: [],
      content: `# Project Scope: HealthAlert Mini

## 1. Problem Statement
Patients monitoring chronic cardiometabolic indicators (such as blood pressure and fasting blood glucose) face two compounding challenges:
1. Recognizing acute, time-sensitive warning signs that warrant emergent care versus routine outpatient consultation.
2. Synthesizing episodic at-home biometric readings into a clinically structured SBAR brief that a physician can rapidly parse during brief 15-minute consultations.

## 2. Target Users
- **Primary:** Adult ambulatory patients navigating hypertension or pre-diabetes seeking clarity on home readings.
- **Secondary:** Outpatient primary care clinicians who require structured, noise-reduced pre-visit patient data.

## 3. Goals and Objectives
- Deliver zero-delay, deterministic emergency triage for hypertensive crisis and acute angina.
- Structure non-emergent vital sign trends into standard SBAR format in under 2.5 seconds.
- Provide patients with 3 targeted, evidence-grounded questions to discuss with their clinician.
- Fully adhere to Devpost Learn AI Basics submission standards with verifiable artifacts.

## 4. Scope Boundaries
- **In-Scope:**
  - Standardized intake of systolic/diastolic blood pressure, pulse, and glucose.
  - Hardcoded safety rule evaluation based on AHA/ACC 2024 and ADA 2026 guidelines.
  - SBAR report synthesis with non-diagnostic disclaimers.
  - Export of Markdown report and HL7 FHIR Release 4 RiskAssessment JSON.

## 5. Exclusions
- Autonomous clinical diagnosis or pharmacological prescribing.
- Ingestion of continuous telemetry from proprietary Bluetooth hardware without user review.
- Multi-hospital EHR writeback integrations.

## 6. Constraints
- Must function reliably in offline or degraded network conditions using deterministic rule fallbacks.
- Cloud deployment must support scale-to-zero serverless operation.
- No storage of sensitive health records without explicit patient authentication and consent.

## 7. Acceptance Criteria
- [x] Readings with systolic BP >= 180 mmHg or diastolic BP >= 120 mmHg immediately prompt emergency guidance.
- [x] Stage 1 hypertension readings (130-139 / 80-89 mmHg) route strictly to routine primary care follow-up.
- [x] Generated reports clearly display mandatory non-diagnostic educational notices.
`
    },
    'prd.md': {
      id: 'doc_prd_mini',
      filename: 'prd.md',
      title: 'Product Requirements Document (PRD) — HealthAlert Mini',
      status: 'reviewed',
      lastUpdated: '2026-10-24T10:30:00.000Z',
      isApproved: true,
      sourceOfTruth: 'dr_t_draft',
      requiredSections: [
        '1. Product Vision',
        '2. User Personas and Stories',
        '3. Feature Requirements',
        '4. Prioritization',
        '5. User Experience & Flows',
        '6. Non-Functional Requirements',
        '7. Success Metrics'
      ],
      validationErrors: [],
      content: `# Product Requirements Document (PRD): HealthAlert Mini

## 1. Product Vision
HealthAlert Mini empowers ambulatory patients to understand their home vital signs safely and communicate effectively with their healthcare providers, bridging the gap between wearable data and clinical action without diagnostic overreach.

## 2. User Personas and Stories
### Persona A: Ambulatory Patient (Alex)
- *Story:* As a patient recording elevated blood pressure at home, I want to know immediately whether my reading is dangerous so that I can seek appropriate care without delay or unnecessary anxiety.

### Persona B: Primary Care Clinician (Dr. Lin)
- *Story:* As an outpatient clinician, I want to receive an organized SBAR summary of my patient's recent vitals so that I can focus our visit on shared decision-making rather than data collation.

## 3. Feature Requirements
### P0 (Critical Release Gate)
- **FR-01: Vital Signs Intake:** Form capturing systolic BP, diastolic BP, heart rate, and fasting glucose with client-side sanity bounds.
- **FR-02: Deterministic Safety Guardrails:** Hardcoded rule evaluator checking for hypertensive crisis and chest pain.
- **FR-03: Plain-Language Summary:** Non-diagnostic explanation of what the numbers mean under current clinical guidelines.
- **FR-04: Clinician Discussion Questions:** 3 tailored questions for the patient's next visit.

### P1 (High Priority)
- **FR-05: SBAR Handoff Generation:** Markdown and FHIR R4 JSON export.
- **FR-06: Regional Emergency Directory:** Localized emergency contact numbers (US 911, UK 999, UAE 998, Vietnam 115).

## 4. Prioritization
All P0 safety requirements must execute deterministically prior to any LLM API call. If the LLM call times out or fails, the system returns a verified deterministic template summary.

## 5. User Experience & Flows
1. **Intake:** User completes a 4-step progressive disclosure form.
2. **Safety Check:** System evaluates emergency rules instantaneously.
3. **Synthesis:** System streams or returns the SBAR brief.
4. **Export:** User copies or downloads the clinician handoff document.

## 6. Non-Functional Requirements
- **Performance:** Initial page load under 1.5 seconds; API triage response under 2.5 seconds.
- **Reliability:** 100% availability of emergency escalation even during cloud outage.
- **Security:** Zero client-side API key exposure; TLS 1.3 transmission.

## 7. Success Metrics
- 100% pass rate on clinical safety invariant test suite.
- Zero reported instances of diagnostic hallucination.
`
    },
    'spec.md': {
      id: 'doc_spec_mini',
      filename: 'spec.md',
      title: 'Technical Specification — HealthAlert Mini',
      status: 'reviewed',
      lastUpdated: '2026-10-24T10:45:00.000Z',
      isApproved: true,
      sourceOfTruth: 'dr_t_draft',
      requiredSections: [
        '1. System Architecture',
        '2. Component Design',
        '3. Data Models and Contracts',
        '4. Error Handling and Resilience',
        '5. Security and Privacy Architecture',
        '6. Test Plan',
        '7. Deployment and Operations'
      ],
      validationErrors: [],
      content: `# Technical Specification: HealthAlert Mini

## 1. System Architecture
HealthAlert Mini utilizes a modern full-stack TypeScript architecture:
- **Client:** React 19 SPA running on Vite with Tailwind CSS.
- **Server:** Node.js Express 5 proxy providing protected endpoints.
- **AI Engine:** Google GenAI SDK (@google/genai) calling Gemini 3.8 Flash with 2500ms race timeout.
- **Standards:** HL7 FHIR Release 4 RiskAssessment resource generation.

## 2. Component Design
- \`HealthAlertMiniIntake\`: Progressive biometric input component with real-time numeric bounds validation.
- \`SafetyRuleEvaluator\`: Deterministic pure TypeScript module containing emergency threshold logic.
- \`SbarSummaryCard\`: Render component displaying Situation, Background, Assessment, and Recommendation.
- \`HandoffExporter\`: Clipboard and file download utility for Markdown and FHIR R4 JSON.

## 3. Data Models and Contracts
\`\`\`typescript
interface VitalsInput {
  systolicBp: number;   // 70 - 260 mmHg
  diastolicBp: number;  // 40 - 160 mmHg
  heartRate?: number;   // 30 - 220 bpm
  fastingGlucose?: number; // 40 - 500 mg/dL
  symptoms?: string[];
  region: 'US' | 'UK' | 'UAE' | 'Vietnam' | 'Global';
}

interface TriageResult {
  urgencyTier: 'EMERGENT_ESCALATION' | 'URGENT_EVALUATION' | 'PLANNED_CLINICAL_ASSESSMENT' | 'ROUTINE_MONITORING';
  isEmergency: boolean;
  emergencyNumber: string;
  sbarSummary: {
    situation: string;
    background: string;
    assessment: string;
    recommendation: string;
  };
  questionsForDoctor: string[];
  fhirResource: Record<string, unknown>;
  telemetry: {
    engine: 'gemini-3.8-flash' | 'deterministic-heuristic-fallback';
    latencyMs: number;
  };
}
\`\`\`

## 4. Error Handling and Resilience
- **API Timeout Race:** Server initiates \`Promise.race([geminiCall, timeoutPromise(2500)])\`. If Gemini does not respond in 2500ms, the deterministic fallback engine generates the clinical SBAR immediately.
- **Client Offline:** Emergency rules are compiled into client bundle for zero-network execution.

## 5. Security and Privacy Architecture
- No API keys stored in client bundles.
- Express backend proxies all LLM requests with authenticated server-side keys.
- Free-text input is scrubbed of email addresses and phone numbers using regex sanitizers before processing.

## 6. Test Plan
- Unit tests verifying BP threshold boundaries (119/79, 138/88, 180/120, 200/130).
- Integration tests verifying FHIR R4 JSON schema validity.
- Performance tests verifying sub-2500ms fallback behavior.

## 7. Deployment and Operations
- Server container runs in Cloud Run (asia-southeast1).
- Health check route: \`GET /api/health\`.
- Scaled to zero when idle for minimal infrastructure footprint.
`
    },
    'README.md': {
      id: 'doc_readme_mini',
      filename: 'README.md',
      title: 'Project README — HealthAlert Mini',
      status: 'reviewed',
      lastUpdated: '2026-10-24T11:00:00.000Z',
      isApproved: true,
      sourceOfTruth: 'dr_t_draft',
      requiredSections: [
        '1. Overview',
        '2. Features',
        '3. Architecture',
        '4. Getting Started',
        '5. Testing',
        '6. Disclaimer and License'
      ],
      validationErrors: [],
      content: `# HealthAlert Mini — Transparent Clinician Handoff Assistant

> **Devpost Learn AI Basics Challenge Template**  
> An illustrative, synthetic demonstration project created to showcase structured AI scoping, specification, and safety-grounded implementation.

## 1. Overview
HealthAlert Mini helps patients transform home vital sign measurements into a structured SBAR clinician handoff summary while guaranteeing deterministic escalation for emergency warning signs.

## 2. Features
- **Deterministic Emergency Guardrails:** Immediate ambulance guidance for hypertensive crisis or angina.
- **Clinician SBAR Brief:** Situation-Background-Assessment-Recommendation formatted summary.
- **FHIR R4 Export:** Interoperable RiskAssessment JSON structure.
- **Offline Fallback:** Guaranteed operation even when AI services are unreachable.

## 3. Architecture
- Frontend: React 19 + TypeScript + Tailwind CSS
- Backend: Express 5 proxy with Gemini 3.8 Flash
- Standards: HL7 FHIR Release 4 RiskAssessment

## 4. Getting Started
\`\`\`bash
# 1. Clone repository
git clone https://github.com/your-username/healthalert-mini.git
cd healthalert-mini

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
\`\`\`

## 5. Testing
\`\`\`bash
npm test
\`\`\`

## 6. Disclaimer and License
**Clinical Disclaimer:** HealthAlert Mini is an educational demonstration project and is NOT a medical device, diagnostic tool, or replacement for professional healthcare.

Licensed under the MIT License.
`
    }
  },
  tasks: [
    {
      id: 'task_1',
      title: 'Initialize repository and configure TypeScript/Vite',
      description: 'Set up Vite React project with strict TypeScript settings and Tailwind CSS.',
      priority: 'high',
      status: 'done',
      stage: 'build',
      estimatedHours: 2,
      acceptanceCriteria: ['TypeScript builds with 0 errors', 'Vite dev server starts on port 3000'],
      testExpectations: 'Run npm run build and npm run lint.'
    },
    {
      id: 'task_2',
      title: 'Implement deterministic emergency triage rule engine',
      description: 'Create pure TypeScript functions evaluating blood pressure and symptoms against AHA 2024 guidelines.',
      priority: 'critical',
      status: 'done',
      stage: 'build',
      estimatedHours: 4,
      acceptanceCriteria: ['BP >= 180/120 flags EMERGENT_ESCALATION', 'Stage 1 HTN flags PLANNED_CLINICAL_ASSESSMENT'],
      testExpectations: 'Unit tests covering normal, elevated, stage 1, stage 2, and crisis ranges.'
    },
    {
      id: 'task_3',
      title: 'Build vital sign intake form with boundary validation',
      description: 'Create form capturing systolic, diastolic, pulse, glucose, and patient concern.',
      priority: 'high',
      status: 'done',
      stage: 'build',
      estimatedHours: 3,
      acceptanceCriteria: ['Rejects systolic > 260 or < 70', 'Rejects negative numbers with clear visual feedback'],
      testExpectations: 'Component tests for boundary value inputs.'
    },
    {
      id: 'task_4',
      title: 'Implement server-side SBAR generator with Gemini 3.8 Flash',
      description: 'Create Express proxy route calling Gemini API with 2500ms timeout race.',
      priority: 'high',
      status: 'done',
      stage: 'build',
      estimatedHours: 4,
      acceptanceCriteria: ['Generates SBAR markdown under 2500ms', 'Falls back gracefully on timeout'],
      testExpectations: 'Mock network test verifying fallback behavior on 3000ms delay.'
    },
    {
      id: 'task_5',
      title: 'Format and export HL7 FHIR R4 RiskAssessment resource',
      description: 'Map triage output to valid FHIR R4 RiskAssessment JSON structure.',
      priority: 'medium',
      status: 'ready',
      stage: 'build',
      estimatedHours: 3,
      acceptanceCriteria: ['Generates valid JSON matching FHIR R4 specification'],
      testExpectations: 'Schema validation test against FHIR R4 definition.'
    },
    {
      id: 'task_6',
      title: 'Create end-to-end integration and release gate test suite',
      description: 'Write automated test script executing all edge cases and validating exit codes.',
      priority: 'high',
      status: 'ready',
      stage: 'test',
      estimatedHours: 3,
      acceptanceCriteria: ['All tests pass with exit code 0 in CI environment'],
      testExpectations: 'Run npm test.'
    },
    {
      id: 'task_7',
      title: 'Record public demo video and prepare Devpost submission',
      description: 'Record 2-3 minute walk-through of HealthAlert Mini showing emergency escalation and SBAR export.',
      priority: 'high',
      status: 'backlog',
      stage: 'document',
      estimatedHours: 4,
      acceptanceCriteria: ['Video is public and demonstrates core features in under 3 minutes'],
      testExpectations: 'Peer review video quality and audio clarity.'
    }
  ],
  checklist: {
    officialChallengeUrl: 'https://learn-ai-basics.devpost.com/',
    lastVerifiedDate: '2026-10-24',
    repositoryUrl: 'https://github.com/Zenieverse/Dr.-T',
    demoVideoUrl: 'https://youtu.be/jQOC2qYPIvY',
    items: [
      {
        id: 'chk_01',
        category: 'eligibility',
        label: 'Review Official Challenge Rules',
        description: 'Read the official rules on Devpost, including eligibility, deadlines, and submission requirements.',
        required: true,
        completed: true,
        evidence: 'https://learn-ai-basics.devpost.com/',
        verified: true
      },
      {
        id: 'chk_02',
        category: 'eligibility',
        label: 'Disclose Relationship to Prior Work',
        description: 'Explicitly disclose in submission whether project is built anew or references an existing framework.',
        required: true,
        completed: true,
        evidence: 'Documented in README.md and Devpost submission fields.',
        verified: true
      },
      {
        id: 'chk_03',
        category: 'skill_pack',
        label: 'Learn Skill Pack Compliance Setup',
        description: 'Set up the official Learn Skill Pack workflow in an authorized coding agent environment.',
        required: true,
        completed: true,
        evidence: 'Official Skill Pack CLI executed in target workspace directory.',
        verified: true
      },
      {
        id: 'chk_04',
        category: 'artifacts',
        label: 'Create and Validate scope.md',
        description: 'Ensure scope.md contains problem statement, target users, goals, boundaries, exclusions, and acceptance criteria.',
        required: true,
        completed: true,
        evidence: 'scope.md reviewed and approved.',
        verified: true
      },
      {
        id: 'chk_05',
        category: 'artifacts',
        label: 'Create and Validate prd.md',
        description: 'Ensure prd.md defines product vision, user stories, feature prioritization (P0/P1), UX flows, and success metrics.',
        required: true,
        completed: true,
        evidence: 'prd.md reviewed and approved.',
        verified: true
      },
      {
        id: 'chk_06',
        category: 'artifacts',
        label: 'Create and Validate spec.md',
        description: 'Ensure spec.md details system architecture, component design, data contracts, error handling, security, and tests.',
        required: true,
        completed: true,
        evidence: 'spec.md reviewed and approved.',
        verified: true
      },
      {
        id: 'chk_07',
        category: 'artifacts',
        label: 'Verify Cross-Document Consistency',
        description: 'Ensure scope.md, prd.md, and spec.md are mutually consistent with zero contradictory requirements.',
        required: true,
        completed: true,
        evidence: 'Automated consistency check passed with 0 contradictions.',
        verified: true
      },
      {
        id: 'chk_08',
        category: 'repository',
        label: 'Prepare Dedicated Submission Repository',
        description: 'Set up clean, public GitHub repository containing all source code and documentation.',
        required: true,
        completed: true,
        evidence: 'https://github.com/Zenieverse/Dr.-T',
        verified: true
      },
      {
        id: 'chk_09',
        category: 'repository',
        label: 'Include Open-Source License',
        description: 'Ensure repository contains an approved open-source license file (e.g. MIT).',
        required: true,
        completed: true,
        evidence: 'MIT License committed at root.',
        verified: true
      },
      {
        id: 'chk_10',
        category: 'repository',
        label: 'Comprehensive README and Setup Instructions',
        description: 'Clear step-by-step instructions to install, configure, build, and run the project locally.',
        required: true,
        completed: true,
        evidence: 'README.md updated with full setup commands.',
        verified: true
      },
      {
        id: 'chk_11',
        category: 'submission',
        label: 'Automated Tests Executed and Recorded',
        description: 'Execute unit and integration tests, recording output logs and exit codes.',
        required: true,
        completed: true,
        evidence: 'npm test executed with 100% pass rate.',
        verified: true
      },
      {
        id: 'chk_12',
        category: 'submission',
        label: 'Public Demo Video Recorded (Max 3 Minutes)',
        description: 'Record and upload a public demonstration video highlighting real working features.',
        required: true,
        completed: true,
        evidence: 'https://youtu.be/jQOC2qYPIvY',
        verified: true
      },
      {
        id: 'chk_13',
        category: 'submission',
        label: 'Devpost Submission Text Form Completed',
        description: 'Complete all required Devpost fields: project inspiration, what it does, how we built it, challenges, and what is next.',
        required: true,
        completed: true,
        evidence: 'Submission draft prepared in project workspace.',
        verified: true
      },
      {
        id: 'chk_14',
        category: 'submission',
        label: 'Local Timezone Submission Deadline Checked',
        description: 'Verify the exact Devpost submission deadline converted to user local timezone.',
        required: true,
        completed: true,
        evidence: 'Deadline verified on official Devpost page.',
        verified: true
      }
    ]
  },
  codeReviews: [
    {
      id: 'rev_1',
      filename: 'src/safety/triageRules.ts',
      language: 'typescript',
      timestamp: '2026-10-24T11:30:00.000Z',
      codeSnippet: `export function evaluateBloodPressure(sys: number, dia: number): 'CRISIS' | 'STAGE_2' | 'STAGE_1' | 'NORMAL' {
  if (sys >= 180 || dia >= 120) return 'CRISIS';
  if (sys >= 140 || dia >= 90) return 'STAGE_2';
  if (sys >= 130 || dia >= 80) return 'STAGE_1';
  return 'NORMAL';
}`,
      findings: [
        {
          type: 'best_practice',
          message: 'Rule matches AHA 2024 thresholds accurately. Consider adding parameter bounds validation for extreme outliers (e.g. sys < 0 or sys > 300).',
          severity: 'info',
          lineHint: 'Line 2'
        }
      ],
      suggestedTests: [
        'Test boundary at 179/119 (should be STAGE_2)',
        'Test boundary at 180/120 (should be CRISIS)',
        'Test isolated systolic hypertension at 145/78 (should be STAGE_2)'
      ],
      implementationInstructions: 'Integrate numeric input clamps between 40 and 300 to prevent nonsensical inputs from reaching the evaluator.',
      explainedInPlainLanguage: 'This function checks blood pressure numbers against standard heart association guidelines. It correctly catches dangerous high blood pressure crises.'
    }
  ]
};
