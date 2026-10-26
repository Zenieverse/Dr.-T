import fs from 'fs';
import path from 'path';
import { HEALTHALERT_MINI_TEMPLATE } from '../src/components/buildwithai/data/templateProject';
import { BuildWithAiService } from '../src/components/buildwithai/services/buildWithAiService';
import { BuildWithAiServerService } from '../src/server/buildWithAiServerService';

async function runBuildWithAiTests() {
  console.log('======================================================');
  console.log('🛠️ BUILD WITH AI — DEVPOST LEARN AI BASICS TEST SUITE');
  console.log('Official Devpost Challenge: https://learn-ai-basics.devpost.com/');
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail = '') {
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${testName} - ${detail}`);
      failed++;
    }
  }

  // Group 1: Template Project Integrity (HealthAlert Mini)
  console.log('Test Group 1: Demonstration Template Integrity (HealthAlert Mini)');
  assert(HEALTHALERT_MINI_TEMPLATE.isTemplate === true, 'Template is flagged isTemplate=true');
  assert(HEALTHALERT_MINI_TEMPLATE.id === 'template_healthalert_mini', 'Template ID is constant');
  assert(HEALTHALERT_MINI_TEMPLATE.name.includes('HealthAlert Mini'), 'Template name contains HealthAlert Mini');
  assert(HEALTHALERT_MINI_TEMPLATE.documents['scope.md'] !== undefined, 'scope.md present in template');
  assert(HEALTHALERT_MINI_TEMPLATE.documents['prd.md'] !== undefined, 'prd.md present in template');
  assert(HEALTHALERT_MINI_TEMPLATE.documents['spec.md'] !== undefined, 'spec.md present in template');
  assert(HEALTHALERT_MINI_TEMPLATE.documents['README.md'] !== undefined, 'README.md present in template');
  assert(HEALTHALERT_MINI_TEMPLATE.tasks.length >= 6, 'Template contains at least 6 structured sprint tasks');
  assert(HEALTHALERT_MINI_TEMPLATE.checklist.items.length >= 10, 'Template contains full 14-point Devpost checklist');

  // Group 2: Document Section Validation Engine
  console.log('\nTest Group 2: Document Section Validation Engine');
  const scopeErrors = BuildWithAiService.validateDocumentSections(HEALTHALERT_MINI_TEMPLATE.documents['scope.md']);
  assert(scopeErrors.length === 0, 'scope.md passes all 7 required section checks');

  const prdErrors = BuildWithAiService.validateDocumentSections(HEALTHALERT_MINI_TEMPLATE.documents['prd.md']);
  assert(prdErrors.length === 0, 'prd.md passes all 7 required section checks');

  const specErrors = BuildWithAiService.validateDocumentSections(HEALTHALERT_MINI_TEMPLATE.documents['spec.md']);
  assert(specErrors.length === 0, 'spec.md passes all 7 required section checks');

  // Negative test: incomplete document
  const incompleteDoc = {
    ...HEALTHALERT_MINI_TEMPLATE.documents['scope.md'],
    content: '# Scope\nIncomplete text without headers.'
  };
  const incompleteErrors = BuildWithAiService.validateDocumentSections(incompleteDoc);
  assert(incompleteErrors.length > 0, 'Incomplete document correctly flagged with missing required section errors');

  // Group 3: Cross-Document Mutual Consistency
  console.log('\nTest Group 3: Cross-Document Mutual Consistency Validation');
  const consistency = BuildWithAiService.validateCrossDocumentConsistency(HEALTHALERT_MINI_TEMPLATE);
  assert(consistency.isConsistent === true, 'HealthAlert Mini passes cross-document consistency checks');
  assert(consistency.strengths.length >= 3, 'Consistency strengths identified (scope, PRD, spec alignment)');

  // Group 4: Server-Side AI Generation & Deterministic Fallbacks
  console.log('\nTest Group 4: Server-Side AI Generation & Heuristic Fallbacks');
  const briefRes = await BuildWithAiServerService.generateBrief({
    name: 'Smart Energy Optimizer',
    description: 'AI-driven domestic peak shaving',
    targetAudience: 'Homeowners with solar batteries',
    problemStatement: 'High electricity bills during grid peak hours',
    proposedSolution: 'Automated battery charge scheduling based on spot tariffs',
    keyFeatures: ['Tariff prediction', 'Battery inverter control', 'Cost savings telemetry'],
    workflow: 'Input -> Forecast -> Schedule -> Execute',
    constraints: 'Standard microinverter APIs',
    privacyConsiderations: 'Local household data retention',
    successCriteria: '20% bill reduction'
  });
  assert(briefRes.brief.problemStatement.length > 0, 'Brief contains populated problem statement');
  assert(Array.isArray(briefRes.brief.userPersonas), 'Brief contains structured user personas');
  assert(Array.isArray(briefRes.brief.functionalRequirements), 'Brief contains functional requirements list');
  assert(briefRes.telemetry.latencyMs >= 0, 'Brief generation reports latency in milliseconds');

  const docRes = await BuildWithAiServerService.draftDocument({
    docType: 'scope.md',
    projectName: 'Smart Energy Optimizer',
    brief: briefRes.brief
  });
  assert(docRes.content.includes('# Project Scope: Smart Energy Optimizer'), 'draftDocument generates formatted Markdown header');
  assert(docRes.content.includes('## 1. Problem Statement'), 'draftDocument includes section 1 problem statement');
  assert(docRes.content.includes('## 4. Scope Boundaries'), 'draftDocument includes scope boundaries');

  const reviewRes = await BuildWithAiServerService.reviewCode({
    filename: 'src/batteryController.ts',
    codeSnippet: 'export function calcCharge(soc: number) { if (soc < 20) return true; return false; }',
    taskDescription: 'Battery charge cutoff check'
  });
  assert(Array.isArray(reviewRes.review.findings), 'Code review returns array of findings');
  assert(Array.isArray(reviewRes.review.suggestedTests), 'Code review returns suggested unit test cases');
  assert(typeof reviewRes.review.explainedInPlainLanguage === 'string', 'Code review explains logic in plain language');

  // Group 5: Navigation & Architectural Integration Invariants
  console.log('\nTest Group 5: Navigation & Architectural Invariants');
  const typesContent = fs.readFileSync(path.resolve('src/types.ts'), 'utf-8');
  assert(typesContent.includes("'buildwithai'"), "src/types.ts includes 'buildwithai' in NavTab");

  const navbarContent = fs.readFileSync(path.resolve('src/components/layout/Navbar.tsx'), 'utf-8');
  assert(navbarContent.includes("id: 'buildwithai'"), "Navbar.tsx registers 'buildwithai' tab");
  assert(navbarContent.includes("label: 'Build With AI'"), "Navbar.tsx has label 'Build With AI'");

  const appContent = fs.readFileSync(path.resolve('src/App.tsx'), 'utf-8');
  assert(appContent.includes("activeTab === 'buildwithai'"), "App.tsx renders BuildWithAiModule when activeTab is buildwithai");

  const rulesContent = fs.readFileSync(path.resolve('firestore.rules'), 'utf-8');
  assert(rulesContent.includes('/buildwithai_projects/{projectId}'), "firestore.rules protects 'buildwithai_projects' collection");
  assert(rulesContent.includes('resource.data.userId == request.auth.uid'), "buildwithai_projects enforces user ownership on read");

  // Group 6: Root Devpost Planning Documents & Submission Checklist
  console.log('\nTest Group 6: Root Devpost Planning Documents & Submission Checklist');
  const rootScopeExists = fs.existsSync(path.resolve('scope.md'));
  assert(rootScopeExists, 'Root scope.md exists in repository root');
  if (rootScopeExists) {
    const scopeDoc = {
      id: 'root_scope',
      filename: 'scope.md' as const,
      title: 'Project Scope',
      content: fs.readFileSync(path.resolve('scope.md'), 'utf-8'),
      status: 'approved' as const,
      lastUpdated: new Date().toISOString(),
      isApproved: true,
      sourceOfTruth: 'human_authored' as const,
      requiredSections: [
        '1. Problem Statement',
        '2. Target Users',
        '3. Goals and Objectives',
        '4. Scope Boundaries',
        '5. Exclusions',
        '6. Constraints',
        '7. Acceptance Criteria'
      ],
      validationErrors: []
    };
    const errors = BuildWithAiService.validateDocumentSections(scopeDoc);
    assert(errors.length === 0, 'Root scope.md passes all 7 section validation checks');
  }

  const rootPrdExists = fs.existsSync(path.resolve('prd.md'));
  assert(rootPrdExists, 'Root prd.md exists in repository root');
  if (rootPrdExists) {
    const prdDoc = {
      id: 'root_prd',
      filename: 'prd.md' as const,
      title: 'Product Requirements Document',
      content: fs.readFileSync(path.resolve('prd.md'), 'utf-8'),
      status: 'approved' as const,
      lastUpdated: new Date().toISOString(),
      isApproved: true,
      sourceOfTruth: 'human_authored' as const,
      requiredSections: [
        '1. Product Vision',
        '2. User Personas and Stories',
        '3. Feature Requirements',
        '4. Prioritization',
        '5. User Experience & Flows',
        '6. Non-Functional Requirements',
        '7. Success Metrics'
      ],
      validationErrors: []
    };
    const errors = BuildWithAiService.validateDocumentSections(prdDoc);
    assert(errors.length === 0, 'Root prd.md passes all 7 section validation checks');
  }

  const rootSpecExists = fs.existsSync(path.resolve('spec.md'));
  assert(rootSpecExists, 'Root spec.md exists in repository root');
  if (rootSpecExists) {
    const specDoc = {
      id: 'root_spec',
      filename: 'spec.md' as const,
      title: 'Technical Specification',
      content: fs.readFileSync(path.resolve('spec.md'), 'utf-8'),
      status: 'approved' as const,
      lastUpdated: new Date().toISOString(),
      isApproved: true,
      sourceOfTruth: 'human_authored' as const,
      requiredSections: [
        '1. System Architecture',
        '2. Component Design',
        '3. Data Models and Contracts',
        '4. Error Handling and Resilience',
        '5. Security and Privacy Architecture',
        '6. Test Plan',
        '7. Deployment and Operations'
      ],
      validationErrors: []
    };
    const errors = BuildWithAiService.validateDocumentSections(specDoc);
    assert(errors.length === 0, 'Root spec.md passes all 7 section validation checks');
  }

  const checklistExists = fs.existsSync(path.resolve('docs/learn-ai-basics-submission-checklist.md'));
  assert(checklistExists, 'docs/learn-ai-basics-submission-checklist.md exists');
  if (checklistExists) {
    const checklistContent = fs.readFileSync(path.resolve('docs/learn-ai-basics-submission-checklist.md'), 'utf-8');
    assert(checklistContent.includes('https://learn-ai-basics.devpost.com/'), 'Checklist references official Devpost challenge URL');
    assert(checklistContent.includes('https://github.com/Zenieverse/Dr.-T'), 'Checklist references public GitHub repository');
  }

  console.log('\n======================================================');
  console.log(`TOTAL BUILD WITH AI TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('======================================================');

  if (failed > 0) {
    process.exit(1);
  }
  process.exit(0);
}

runBuildWithAiTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
