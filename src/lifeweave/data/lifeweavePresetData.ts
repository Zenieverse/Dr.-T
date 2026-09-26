// ==========================================
// LIFEWEAVE: PRESET INVESTIGATIONS, CODE MAP & BENCHMARKS
// Grounded in Real Dr. T Platform Architecture
// ==========================================

import {
  RepositoryHealth,
  LivingCodeMapData,
  Investigation,
  BenchmarkConfiguration,
  BenchmarkRunResult,
  Gemma4AgentManifest
} from '../types/lifeweaveTypes';

export const DEFAULT_REPOSITORY_HEALTH: RepositoryHealth = {
  status: 'HEALTHY',
  branch: 'main',
  lastScanTime: '2026-09-24T20:05:00Z',
  indexedFiles: 148,
  totalSymbols: 912,
  dependencies: 26,
  testsTotal: 48,
  testsPassing: 47,
  detectedWarnings: 2,
  gitCommit: '7f9a4c1 (Dr. T v2.4.0)'
};

export const LIVING_CODE_MAP_DATA: LivingCodeMapData = {
  nodes: [
    {
      id: 'node-pdf-fetcher',
      name: 'pdfFetcher.ts',
      path: 'src/readit/pdfFetcher.ts',
      type: 'FILE',
      symbol: 'fetchPdfStream',
      description: 'Fetches PDF streams across HTTP/HTTPS with redirect resolution and buffer validation.',
      referencesCount: 14,
      callers: ['documentLoader.ts', 'readitRouter.ts'],
      callees: ['threatScanner.ts', 'streamNormalizer.ts'],
      imports: ['axios', 'stream', 'threatScanner.ts'],
      dependents: ['readit/viewer.tsx', 'informatics/labParser.ts'],
      associatedTests: ['tests/readit/pdfFetcher.test.ts'],
      isClinicalOrSafetyCritical: false,
      confidenceScore: 0.88,
      evidenceScore: 0.91,
      riskLevel: 'LOW'
    },
    {
      id: 'node-threat-scanner',
      name: 'threatScanner.ts',
      path: 'src/readit/threatScanner.ts',
      type: 'SERVICE',
      symbol: 'scanBufferPayload',
      description: 'Enforces malware, macro, and prompt-injection threat heuristics before document memory parsing.',
      referencesCount: 22,
      callers: ['pdfFetcher.ts', 'documentLoader.ts'],
      callees: ['crypto', 'clamavEngine'],
      imports: ['crypto'],
      dependents: ['pdfFetcher.ts'],
      associatedTests: ['tests/readit/threatScanner.test.ts'],
      isClinicalOrSafetyCritical: false,
      confidenceScore: 0.42,
      evidenceScore: 0.54,
      riskLevel: 'MEDIUM'
    },
    {
      id: 'node-doc-loader',
      name: 'documentLoader.ts',
      path: 'src/readit/documentLoader.ts',
      type: 'MODULE',
      symbol: 'loadExternalDocument',
      description: 'Orchestrates external document acquisition, caching headers, and dispatch to OCR analyzers.',
      referencesCount: 9,
      callers: ['ReadItView.tsx'],
      callees: ['pdfFetcher.ts', 'threatScanner.ts'],
      imports: ['pdfFetcher.ts'],
      dependents: ['ReadItView.tsx'],
      associatedTests: ['tests/readit/documentLoader.test.ts'],
      isClinicalOrSafetyCritical: false,
      confidenceScore: 0.31,
      evidenceScore: 0.38,
      riskLevel: 'LOW'
    },
    {
      id: 'node-safety-engine',
      name: 'safetyEngine.ts',
      path: 'src/health/safetyEngine.ts',
      type: 'SERVICE',
      symbol: 'evaluateClinicalRiskLevel',
      description: 'Central Safety Engine evaluating RED/ORANGE/YELLOW/GREEN clinical urgency and refusal boundaries.',
      referencesCount: 46,
      callers: ['DrTHome.tsx', 'healthBridgeData.ts', 'server.ts'],
      callees: ['reasoningGuardrail.ts', 'fhirValidator.ts'],
      imports: ['reasoningGuardrail.ts'],
      dependents: ['DrTHome.tsx', 'DrTHealthBridge.tsx'],
      associatedTests: ['tests/health/safetyEngine.test.ts'],
      isClinicalOrSafetyCritical: true, // CLINICAL CRITICAL
      confidenceScore: 0.94,
      evidenceScore: 0.96,
      riskLevel: 'HUMAN_REVIEW_REQUIRED'
    },
    {
      id: 'node-reasoning-guardrail',
      name: 'reasoningGuardrail.ts',
      path: 'src/health/reasoningGuardrail.ts',
      type: 'FUNCTION',
      symbol: 'interceptUnsafeSelfCare',
      description: 'Strict clinical refusal rules blocking dangerous self-medication, unverified dosage changes, and self-harm.',
      referencesCount: 18,
      callers: ['safetyEngine.ts'],
      callees: ['auditLogger.ts'],
      imports: ['safetyTypes.ts'],
      dependents: ['safetyEngine.ts'],
      associatedTests: ['tests/health/reasoningGuardrail.test.ts'],
      isClinicalOrSafetyCritical: true, // CLINICAL CRITICAL
      confidenceScore: 0.91,
      evidenceScore: 0.89,
      riskLevel: 'HUMAN_REVIEW_REQUIRED'
    },
    {
      id: 'node-tree-library',
      name: 'treeLibrary.ts',
      path: 'src/tribhouse/treeLibrary.ts',
      type: 'MODULE',
      symbol: 'queryTreeCommons',
      description: 'Living Library Commons book search, semantic indexing, and author citation mapping.',
      referencesCount: 16,
      callers: ['TribHouseView.tsx'],
      callees: ['pagination.ts', 'firestoreAdapter.ts'],
      imports: ['pagination.ts'],
      dependents: ['TribHouseView.tsx'],
      associatedTests: ['tests/tribhouse/treeLibrary.test.ts'],
      isClinicalOrSafetyCritical: false,
      confidenceScore: 0.65,
      evidenceScore: 0.72,
      riskLevel: 'LOW'
    },
    {
      id: 'node-pagination',
      name: 'pagination.ts',
      path: 'src/tribhouse/pagination.ts',
      type: 'FUNCTION',
      symbol: 'paginateCursorItems',
      description: 'Handles deterministic cursor offsets, deduplication sets, and slice intervals.',
      referencesCount: 8,
      callers: ['treeLibrary.ts'],
      callees: [],
      imports: [],
      dependents: ['treeLibrary.ts'],
      associatedTests: ['tests/tribhouse/pagination.test.ts'],
      isClinicalOrSafetyCritical: false,
      confidenceScore: 0.84,
      evidenceScore: 0.86,
      riskLevel: 'LOW'
    },
    {
      id: 'node-dashboard-state',
      name: 'dashboardState.ts',
      path: 'src/ui/dashboardState.ts',
      type: 'MODULE',
      symbol: 'useLifeweaveSessionStore',
      description: 'Client-side session persistence for active investigation filters, code map zoom levels, and drawer state.',
      referencesCount: 11,
      callers: ['LifeWeaveStudio.tsx'],
      callees: ['localStorage'],
      imports: ['zustand'],
      dependents: ['LifeWeaveStudio.tsx'],
      associatedTests: ['tests/ui/dashboardState.test.ts'],
      isClinicalOrSafetyCritical: false,
      confidenceScore: 0.78,
      evidenceScore: 0.81,
      riskLevel: 'LOW'
    }
  ],
  edges: [
    { id: 'e-1', source: 'node-doc-loader', target: 'node-pdf-fetcher', type: 'CALLS', label: 'fetchPdfStream' },
    { id: 'e-2', source: 'node-pdf-fetcher', target: 'node-threat-scanner', type: 'CALLS', label: 'scanBufferPayload' },
    { id: 'e-3', source: 'node-safety-engine', target: 'node-reasoning-guardrail', type: 'CALLS', label: 'interceptUnsafeSelfCare' },
    { id: 'e-4', source: 'node-tree-library', target: 'node-pagination', type: 'CALLS', label: 'paginateCursorItems' },
    { id: 'e-5', source: 'node-doc-loader', target: 'node-threat-scanner', type: 'DEPENDENCY', label: 'pre-scan' }
  ]
};

export const PRESET_INVESTIGATIONS: Investigation[] = [
  // Investigation 1: ReadIt PDF Redirect Handling (Target Demo Case)
  {
    id: 'lw-inv-001',
    issueTitle: 'ReadIt fails when a PDF URL redirects before the PDF is downloaded',
    issueDescription: 'PDF URL redirect handling causes a document to fail before threat scanning. When external medical research journals or PubMed links issue a 301/302 redirect header, pdfFetcher terminates the stream early with ERR_UNHANDLED_REDIRECT instead of resolving the final target URI, causing threatScanner to receive a 0-byte buffer.',
    issueIdOptional: 'ISSUE-4091',
    repository: 'dr-t-platform (main)',
    filePathOptional: 'src/readit/pdfFetcher.ts',
    errorMessageOptional: 'Error: ERR_UNHANDLED_REDIRECT - Follow redirect protocol not invoked for HTTP 302',
    stackTraceOptional: `at fetchPdfStream (src/readit/pdfFetcher.ts:42:15)\nat async loadExternalDocument (src/readit/documentLoader.ts:18:9)\nat async ReadItView.handleUrlSubmit (src/components/readit/ReadItView.tsx:88:5)`,
    failingTestOptional: 'tests/readit/pdfFetcher.test.ts > should resolve redirected PDF without bypassing threat scanner',
    logsOptional: '[WARN] HTTP 302 Location: https://cdn.nih.gov/articles/pmc982.pdf -> Stream terminated before response body.',
    createdAt: '2026-09-24T19:40:00Z',
    updatedAt: '2026-09-24T19:55:00Z',
    status: 'PATCH_PROPOSED',
    progressPercent: 78,
    isSafetyCritical: false,
    activeCandidateId: 'cand-001',
    activeHypothesisId: 'hypo-001',
    candidates: [
      {
        id: 'cand-001',
        filePath: 'src/readit/pdfFetcher.ts',
        symbol: 'fetchPdfStream',
        nodeType: 'FILE',
        isClinicalOrSafetyCritical: false,
        evidence: {
          semanticRelevance: 0.91,
          structuralRelevance: 0.84,
          dependencyRelevance: 0.88,
          testRelevance: 0.79,
          behavioralRelevance: 0.63,
          issueClueRelevance: 0.92,
          contradiction: 0.11,
          uncertainty: 0.19,
          provenance: 'Stack trace frames + AST import analysis + failing unit test trace'
        },
        supportingEvidence: [
          {
            id: 'sup-1',
            description: 'Failing execution trace enters fetchPdfStream before crash at line 42',
            source: 'Stack Trace Analysis',
            confidenceContribution: 0.35
          },
          {
            id: 'sup-2',
            description: 'HTTP 302 redirect response branch exists in this file with missing recursive follow logic',
            source: 'Source AST Inspection',
            confidenceContribution: 0.28
          },
          {
            id: 'sup-3',
            description: 'Failing integration test imports this module and mocks a redirect response',
            source: 'Test Graph Mapping',
            confidenceContribution: 0.18
          }
        ],
        contradictoryEvidence: [
          {
            id: 'con-1',
            description: 'documentLoader.ts also inspects Content-Type headers before delegating',
            source: 'Caller Graph Inspection',
            confidenceImpact: -0.09
          }
        ],
        confidence: 0.72,
        recommendedAction: 'Inspect redirect resolution loop and ensure buffer is piped to threatScanner.ts'
      },
      {
        id: 'cand-002',
        filePath: 'src/readit/threatScanner.ts',
        symbol: 'scanBufferPayload',
        nodeType: 'SERVICE',
        isClinicalOrSafetyCritical: false,
        evidence: {
          semanticRelevance: 0.45,
          structuralRelevance: 0.72,
          dependencyRelevance: 0.68,
          testRelevance: 0.34,
          behavioralRelevance: 0.12,
          issueClueRelevance: 0.48,
          contradiction: 0.74,
          uncertainty: 0.42,
          provenance: 'Downstream call graph relationship'
        },
        supportingEvidence: [
          {
            id: 'sup-4',
            description: 'Receives zero-byte buffer error when redirect occurs',
            source: 'Execution Logs',
            confidenceContribution: 0.15
          }
        ],
        contradictoryEvidence: [
          {
            id: 'con-2',
            description: 'Unit tests for scanBufferPayload with valid buffers pass with 100% success',
            source: 'Isolated Unit Test Suite',
            confidenceImpact: -0.45
          },
          {
            id: 'con-3',
            description: 'Scanner is never called when redirect throws upfront in fetcher',
            source: 'Runtime Trace Logger',
            confidenceImpact: -0.29
          }
        ],
        confidence: 0.21,
        recommendedAction: 'Verify invariant that threatScanner is always invoked once the final URL is resolved'
      }
    ],
    hypotheses: [
      {
        id: 'hypo-001',
        code: 'H1',
        title: 'Redirect handling in fetchPdfStream drops response stream',
        targetFile: 'src/readit/pdfFetcher.ts',
        targetSymbol: 'fetchPdfStream',
        explanation: 'The HTTP client configuration disables auto-follow redirects (maxRedirects: 0) without handling the 302 Location header, prematurely returning a rejected promise.',
        confidence: 0.72,
        uncertainty: 0.28,
        supportingSummary: [
          'Stack trace terminates directly in pdfFetcher.ts:42',
          'Failing URL test triggers 302 redirect',
          'threatScanner receives 0 bytes because promise rejected'
        ],
        contradictorySummary: [
          'documentLoader.ts also parses URL params upstream'
        ],
        affectedNodes: ['node-pdf-fetcher', 'node-threat-scanner'],
        missingEvidence: 'Verify whether upstream documentLoader expects raw stream or resolved URL.',
        nextRecommendedStep: 'Inspect callers of pdfFetcher.ts to confirm stream contract.'
      },
      {
        id: 'hypo-002',
        code: 'H2',
        title: 'PDF Content-Type validation rejects redirected intermediate HTML header',
        targetFile: 'src/readit/documentLoader.ts',
        targetSymbol: 'loadExternalDocument',
        explanation: 'Intermediate 302 responses often have text/html bodies which documentLoader rejects before reading the Location header.',
        confidence: 0.51,
        uncertainty: 0.49,
        supportingSummary: [
          'documentLoader enforces application/pdf MIME check'
        ],
        contradictorySummary: [
          'Error occurs inside fetchPdfStream before MIME check is reached'
        ],
        affectedNodes: ['node-doc-loader'],
        missingEvidence: 'Capture HTTP response headers received during 302 redirect.',
        nextRecommendedStep: 'Inspect execution output of network interceptor.'
      },
      {
        id: 'hypo-003',
        code: 'H3',
        title: 'ThreatScanner timeout rejects slow redirect resolution',
        targetFile: 'src/readit/threatScanner.ts',
        targetSymbol: 'scanBufferPayload',
        explanation: 'ThreatScanner may abort scanning if the network handshake takes longer than 3000ms.',
        confidence: 0.34,
        uncertainty: 0.66,
        supportingSummary: [
          'Timeout error log present in older system versions'
        ],
        contradictorySummary: [
          'No timeout error in current stack trace (explicit ERR_UNHANDLED_REDIRECT)'
        ],
        affectedNodes: ['node-threat-scanner'],
        missingEvidence: 'Check scanner timeout configurations in threatScanner.ts.',
        nextRecommendedStep: 'Run targeted unit test tests/readit/threatScanner.test.ts.'
      }
    ],
    evidenceRequests: [
      {
        id: 'req-01',
        action: 'Inspect callers of pdfFetcher.ts',
        targetNode: 'src/readit/documentLoader.ts',
        rationale: 'Two competing hypotheses (H1 vs H2) depend on whether redirect handling occurs upstream or inside fetcher.',
        expectedValue: 'High',
        estimatedCost: 'Low',
        priorityScore: 0.89
      },
      {
        id: 'req-02',
        action: 'Run targeted test tests/readit/pdfFetcher.test.ts',
        targetNode: 'src/readit/pdfFetcher.ts',
        rationale: 'Confirms whether enabling recursive redirect resolution breaks the threat-scanning invariant.',
        expectedValue: 'High',
        estimatedCost: 'Low',
        priorityScore: 0.94
      }
    ],
    patchProposal: {
      id: 'patch-001',
      investigationId: 'lw-inv-001',
      targetFiles: ['src/readit/pdfFetcher.ts'],
      changeDescription: 'Add controlled redirect follow loop (max 5 hops) that validates target protocol and forwards final buffer to threatScanner.',
      invariantStatement: 'Redirected PDF URLs must resolve to the final PDF resource without bypassing threat scanning.',
      riskLevel: 'LOW',
      validationPlan: [
        'Run tests/readit/pdfFetcher.test.ts (targeted redirect test)',
        'Run tests/readit/threatScanner.test.ts (invariant verification)',
        'Verify zero regression on direct non-redirected PDF URLs'
      ],
      isHumanReviewRequired: false,
      humanApprovalStatus: 'APPROVED',
      humanReviewerNotes: 'Safe change. Invariant holds and threat scanner receives full buffer.',
      scopeEvaluation: 'Touches 1 file, 14 lines added, 3 lines removed. No clinical or safety files modified.',
      diffs: [
        {
          path: 'src/readit/pdfFetcher.ts',
          originalCode: `  const response = await fetch(url, { redirect: 'manual' });
  if (response.status >= 300 && response.status < 400) {
    throw new Error('ERR_UNHANDLED_REDIRECT');
  }
  const buffer = await response.arrayBuffer();
  return scanAndParse(buffer);`,
          proposedCode: `  let currentUrl = url;
  let hops = 0;
  let response = await fetch(currentUrl, { redirect: 'manual' });
  while (response.status >= 300 && response.status < 400 && hops < 5) {
    const nextUrl = response.headers.get('location');
    if (!nextUrl || !/^https?:\\/\\//i.test(nextUrl)) break;
    currentUrl = nextUrl;
    hops++;
    response = await fetch(currentUrl, { redirect: 'manual' });
  }
  const buffer = await response.arrayBuffer();
  // INVARIANT: Always pass resolved buffer to threat scanner
  return scanAndParse(buffer);`,
          addedLinesCount: 14,
          removedLinesCount: 3
        }
      ]
    },
    validationResult: {
      id: 'val-001',
      timestamp: '2026-09-24T19:54:00Z',
      targetedPass: true,
      regressionPass: true,
      invariantPass: true,
      securityPass: true,
      overallStatus: 'PASS',
      testSummary: {
        executed: 6,
        passed: 6,
        failed: 0,
        durationMs: 420
      }
    },
    recoverySteps: [],
    eventsTrail: [
      { id: 'ev-1', timestamp: '2026-09-24T19:40:00Z', timeFormatted: '19:40', title: 'Investigation started', details: 'Issue: ReadIt fails on redirected PDF URLs', category: 'SYSTEM' },
      { id: 'ev-2', timestamp: '2026-09-24T19:41:00Z', timeFormatted: '19:41', title: 'Repository indexed & mapped', details: '148 files and 912 symbols cataloged in Living Code Map', category: 'MAP' },
      { id: 'ev-3', timestamp: '2026-09-24T19:42:00Z', timeFormatted: '19:42', title: '2 candidate nodes located', details: 'pdfFetcher.ts (0.72 confidence), threatScanner.ts (0.21 confidence)', category: 'EVIDENCE' },
      { id: 'ev-4', timestamp: '2026-09-24T19:44:00Z', timeFormatted: '19:44', title: '3 competing hypotheses formed', details: 'H1 Redirect handling (0.72), H2 Content-Type (0.51), H3 Timeout (0.34)', category: 'HYPOTHESIS' },
      { id: 'ev-5', timestamp: '2026-09-24T19:47:00Z', timeFormatted: '19:47', title: 'Adaptive evidence acquired', details: 'Inspected callers of pdfFetcher.ts. Confirmed H1 as dominant hypothesis.', category: 'EVIDENCE' },
      { id: 'ev-6', timestamp: '2026-09-24T19:50:00Z', timeFormatted: '19:50', title: 'Patch proposed', details: 'Smallest safe change: 14 lines in pdfFetcher.ts with threat scanning invariant preserved.', category: 'PATCH' },
      { id: 'ev-7', timestamp: '2026-09-24T19:54:00Z', timeFormatted: '19:54', title: 'Validation passed', details: '6 of 6 tests passed (targeted, regression, invariant, security check).', category: 'TEST' }
    ]
  },

  // Investigation 2: Health AI Safety Critical (Example 3 - Triggers Human Review Boundary)
  {
    id: 'lw-inv-002',
    issueTitle: 'A safety warning disappears after a generated response is reformatted',
    issueDescription: 'When Dr. T formats conversational response text into markdown bullet points or collapsible cards, the Central Safety Engine alert (SafetyAssessment RED/ORANGE level) is intermittently stripped from the UI model payload.',
    issueIdOptional: 'HEALTH-AI-802',
    repository: 'dr-t-platform (main)',
    filePathOptional: 'src/health/safetyEngine.ts',
    errorMessageOptional: 'SafetyWarningSuppressedException: payload.safety metadata dropped during markdown AST sanitize',
    stackTraceOptional: `at evaluateClinicalRiskLevel (src/health/safetyEngine.ts:84:11)\nat formatClinicalSummary (src/health/reasoningGuardrail.ts:31:7)\nat onSendMessage (src/App.tsx:210:9)`,
    failingTestOptional: 'tests/health/safetyEngine.test.ts > should preserve RED safety level through markdown transformation',
    createdAt: '2026-09-24T19:10:00Z',
    updatedAt: '2026-09-24T19:35:00Z',
    status: 'HUMAN_REVIEW_REQUIRED',
    progressPercent: 70,
    isSafetyCritical: true, // TRIGGERS SAFETY BOUNDARY
    activeCandidateId: 'cand-003',
    activeHypothesisId: 'hypo-004',
    candidates: [
      {
        id: 'cand-003',
        filePath: 'src/health/safetyEngine.ts',
        symbol: 'evaluateClinicalRiskLevel',
        nodeType: 'SERVICE',
        isClinicalOrSafetyCritical: true,
        evidence: {
          semanticRelevance: 0.94,
          structuralRelevance: 0.92,
          dependencyRelevance: 0.89,
          testRelevance: 0.96,
          behavioralRelevance: 0.85,
          issueClueRelevance: 0.95,
          contradiction: 0.05,
          uncertainty: 0.12,
          provenance: 'Central Safety Engine Core - Governs clinical alert persistence'
        },
        supportingEvidence: [
          {
            id: 'sup-5',
            description: 'Audit log confirms safety object is omitted during AST node serialization',
            source: 'Clinical Audit Logger',
            confidenceContribution: 0.42
          },
          {
            id: 'sup-6',
            description: 'Failing test reproduces safety alert loss in 4 out of 10 reformatting calls',
            source: 'Regression Suite',
            confidenceContribution: 0.38
          }
        ],
        contradictoryEvidence: [
          {
            id: 'con-4',
            description: 'Backend server still emits safety object in HTTP response body',
            source: 'Network Interceptor',
            confidenceImpact: -0.10
          }
        ],
        confidence: 0.91,
        recommendedAction: 'Require explicit human review before modifying any lines in safetyEngine.ts'
      }
    ],
    hypotheses: [
      {
        id: 'hypo-004',
        code: 'H1',
        title: 'Safety metadata property is omitted in sanitized response mapper',
        targetFile: 'src/health/safetyEngine.ts',
        targetSymbol: 'evaluateClinicalRiskLevel',
        explanation: 'The reformatting transform creates a new ChatMessage object but fails to shallow-copy the safety: SafetyAssessment property.',
        confidence: 0.89,
        uncertainty: 0.11,
        supportingSummary: [
          'ChatMessage interface requires optional safety field',
          'Formatter spread operator omits non-string keys'
        ],
        contradictorySummary: [
          'Unformatted plain text messages retain safety metadata'
        ],
        affectedNodes: ['node-safety-engine', 'node-reasoning-guardrail'],
        missingEvidence: 'Verify whether reasoningGuardrail also filters properties.',
        nextRecommendedStep: 'Conduct Human Review session with Attending Clinician & Lead Engineer.'
      }
    ],
    evidenceRequests: [
      {
        id: 'req-03',
        action: 'Request Human Review Authorization',
        targetNode: 'src/health/safetyEngine.ts',
        rationale: 'Modification affects medical safety-alert propagation and requires explicit developer sign-off.',
        expectedValue: 'High',
        estimatedCost: 'Medium',
        priorityScore: 0.98
      }
    ],
    patchProposal: {
      id: 'patch-002',
      investigationId: 'lw-inv-002',
      targetFiles: ['src/health/safetyEngine.ts'],
      changeDescription: 'Ensure safety property is immutably cloned and preserved across all text reformatting pipelines.',
      invariantStatement: 'Clinical safety assessments (RED, ORANGE, YELLOW, GREEN) must never be dropped or suppressed during UI reformatting.',
      riskLevel: 'HUMAN_REVIEW_REQUIRED',
      clinicalSafetyImpactReason: 'Affects patient safety warning display for acute medical distress and drug-interaction warnings.',
      validationPlan: [
        'Run tests/health/safetyEngine.test.ts',
        'Verify 100% adherence on RED level self-harm refusal tests',
        'Require manual developer verification signature'
      ],
      isHumanReviewRequired: true,
      humanApprovalStatus: 'PENDING',
      scopeEvaluation: 'Touches 1 safety-critical file. Autonomous approval is locked.',
      diffs: [
        {
          path: 'src/health/safetyEngine.ts',
          originalCode: `  return {
    id: msg.id,
    role: msg.role,
    content: formattedContent,
    timestamp: msg.timestamp
  };`,
          proposedCode: `  return {
    id: msg.id,
    role: msg.role,
    content: formattedContent,
    timestamp: msg.timestamp,
    // SAFETY INVARIANT: Never strip clinical risk evaluation
    safety: msg.safety
  };`,
          addedLinesCount: 3,
          removedLinesCount: 0
        }
      ]
    },
    recoverySteps: [],
    eventsTrail: [
      { id: 'ev-11', timestamp: '2026-09-24T19:10:00Z', timeFormatted: '19:10', title: 'Investigation started', details: 'Issue: Safety warning disappears after response reformatting', category: 'SYSTEM' },
      { id: 'ev-12', timestamp: '2026-09-24T19:15:00Z', timeFormatted: '19:15', title: 'Safety-critical component detected', details: 'Classified as HIGH-IMPACT / HUMAN REVIEW REQUIRED', category: 'SAFETY' },
      { id: 'ev-13', timestamp: '2026-09-24T19:25:00Z', timeFormatted: '19:25', title: 'Patch proposed', details: 'Cloning invariant proposed. Awaiting manual human developer approval.', category: 'PATCH' }
    ]
  },

  // Investigation 3: Trib-House Pagination Deduplication
  {
    id: 'lw-inv-003',
    issueTitle: 'Tree-library search returns duplicate resources after pagination',
    issueDescription: 'When users scroll down the Trib-House Living Library Commons to load page 2, several existing book and health-guide items from page 1 appear again in the second batch.',
    issueIdOptional: 'TRIB-201',
    repository: 'dr-t-platform (main)',
    filePathOptional: 'src/tribhouse/pagination.ts',
    createdAt: '2026-09-24T18:30:00Z',
    updatedAt: '2026-09-24T18:50:00Z',
    status: 'COMPLETED',
    progressPercent: 100,
    isSafetyCritical: false,
    activeCandidateId: 'cand-004',
    activeHypothesisId: 'hypo-005',
    candidates: [
      {
        id: 'cand-004',
        filePath: 'src/tribhouse/pagination.ts',
        symbol: 'paginateCursorItems',
        nodeType: 'FUNCTION',
        isClinicalOrSafetyCritical: false,
        evidence: {
          semanticRelevance: 0.88,
          structuralRelevance: 0.81,
          dependencyRelevance: 0.76,
          testRelevance: 0.82,
          behavioralRelevance: 0.79,
          issueClueRelevance: 0.90,
          contradiction: 0.08,
          uncertainty: 0.15,
          provenance: 'Pagination offset logic inspection'
        },
        supportingEvidence: [
          {
            id: 'sup-7',
            description: 'Cursor offset calculation used <= instead of strictly >',
            source: 'Unit test assert failure',
            confidenceContribution: 0.45
          }
        ],
        contradictoryEvidence: [],
        confidence: 0.85,
        recommendedAction: 'Adjust cursor equality comparator to exclude boundary item.'
      }
    ],
    hypotheses: [
      {
        id: 'hypo-005',
        code: 'H1',
        title: 'Boundary inclusive cursor returns last item of previous page',
        targetFile: 'src/tribhouse/pagination.ts',
        explanation: 'Offset index used `>= offset` instead of `> offset`, fetching the pivot element twice.',
        confidence: 0.85,
        uncertainty: 0.15,
        supportingSummary: ['Boundary element duplicated across adjacent pages'],
        contradictorySummary: [],
        affectedNodes: ['node-pagination', 'node-tree-library'],
        missingEvidence: 'None.',
        nextRecommendedStep: 'Validate with 20 items pagination test.'
      }
    ],
    evidenceRequests: [],
    patchProposal: {
      id: 'patch-003',
      investigationId: 'lw-inv-003',
      targetFiles: ['src/tribhouse/pagination.ts'],
      changeDescription: 'Use strict boundary condition `index > cursorOffset` to eliminate overlap.',
      invariantStatement: 'Items on page N and page N+1 must form mutually disjoint subsets.',
      riskLevel: 'LOW',
      validationPlan: ['Run tests/tribhouse/pagination.test.ts'],
      isHumanReviewRequired: false,
      humanApprovalStatus: 'APPROVED',
      scopeEvaluation: '1 file, 1 line changed.',
      diffs: [
        {
          path: 'src/tribhouse/pagination.ts',
          originalCode: `  return items.slice(cursor, cursor + pageSize);`,
          proposedCode: `  return items.slice(cursor + 1, cursor + 1 + pageSize);`,
          addedLinesCount: 1,
          removedLinesCount: 1
        }
      ]
    },
    validationResult: {
      id: 'val-003',
      timestamp: '2026-09-24T18:48:00Z',
      targetedPass: true,
      regressionPass: true,
      invariantPass: true,
      securityPass: true,
      overallStatus: 'PASS',
      testSummary: { executed: 4, passed: 4, failed: 0, durationMs: 180 }
    },
    recoverySteps: [],
    eventsTrail: [
      { id: 'ev-21', timestamp: '2026-09-24T18:30:00Z', timeFormatted: '18:30', title: 'Investigation completed', details: 'Pagination boundary repaired and verified.', category: 'TEST' }
    ]
  },

  // Investigation 4: UI Dashboard Navigation State Loss
  {
    id: 'lw-inv-004',
    issueTitle: 'Developer dashboard loses investigation state after navigation',
    issueDescription: 'Switching tabs between Dr. T and Developer tabs clears active search filters and graph zoom settings.',
    issueIdOptional: 'UI-512',
    repository: 'dr-t-platform (main)',
    filePathOptional: 'src/ui/dashboardState.ts',
    createdAt: '2026-09-24T17:10:00Z',
    updatedAt: '2026-09-24T17:35:00Z',
    status: 'MAPPING',
    progressPercent: 35,
    isSafetyCritical: false,
    candidates: [],
    hypotheses: [],
    evidenceRequests: [],
    recoverySteps: [],
    eventsTrail: [
      { id: 'ev-31', timestamp: '2026-09-24T17:10:00Z', timeFormatted: '17:10', title: 'Investigation initiated', details: 'Mapping repository state hooks', category: 'MAP' }
    ]
  }
];

export const BENCHMARK_CONFIGURATIONS: BenchmarkConfiguration[] = [
  {
    id: 'base-a',
    name: 'Baseline A (Semantic Only)',
    description: 'Retrieves candidate files using text and vector embeddings only without code graph or test context.',
    category: 'BASELINE_A',
    retrievalStrategy: 'Cosine vector similarity on issue description',
    includesUncertainty: false,
    includesContradictions: false,
    includesAdaptiveAcquisition: false,
    includesFailureRecovery: false
  },
  {
    id: 'base-b',
    name: 'Baseline B (Graph Only)',
    description: 'Traverses import and caller graphs starting from initial keyword match without embedding scoring.',
    category: 'BASELINE_B',
    retrievalStrategy: 'BFS graph traversal on static AST import/call nodes',
    includesUncertainty: false,
    includesContradictions: false,
    includesAdaptiveAcquisition: false,
    includesFailureRecovery: false
  },
  {
    id: 'base-c',
    name: 'Baseline C (Semantic + Graph)',
    description: 'Fuses dense vector retrieval with graph neighbor ranking.',
    category: 'BASELINE_C',
    retrievalStrategy: 'Hybrid RRF (Reciprocal Rank Fusion) of embeddings + graph',
    includesUncertainty: false,
    includesContradictions: false,
    includesAdaptiveAcquisition: false,
    includesFailureRecovery: false
  },
  {
    id: 'base-d',
    name: 'Baseline D (Semantic + Graph + Evidence)',
    description: 'Adds evidence weighting to candidate locations but lacks contradiction modeling and recovery loops.',
    category: 'BASELINE_D',
    retrievalStrategy: 'Multi-criteria evidence scoring matrix',
    includesUncertainty: true,
    includesContradictions: false,
    includesAdaptiveAcquisition: false,
    includesFailureRecovery: false
  },
  {
    id: 'lw-full',
    name: 'LIFEWEAVE (Full Architecture)',
    description: 'Complete evidence-guided loop: Semantic + Graph + Evidence Field + Contradictions + Adaptive Acquisition + Recovery.',
    category: 'LIFEWEAVE',
    retrievalStrategy: 'Adaptive uncertainty-reduction heuristic with contradiction pruning',
    includesUncertainty: true,
    includesContradictions: true,
    includesAdaptiveAcquisition: true,
    includesFailureRecovery: true
  }
];

export const SAMPLE_BENCHMARK_RESULTS: BenchmarkRunResult[] = [
  {
    experimentId: 'exp-01',
    configurationId: 'base-a',
    name: 'Baseline A (Semantic Only)',
    hasRun: true,
    patchPassRate: 46.2,
    repairSuccessRate: 41.5,
    regressionRate: 18.4,
    recallAt1: 0.38,
    recallAt3: 0.59,
    recallAt5: 0.68,
    averageFilesInspected: 16.4,
    averageTokens: 28400,
    averageWallClockSec: 42.1,
    contradictionDetectionRate: null,
    recoverySuccessRate: null
  },
  {
    experimentId: 'exp-02',
    configurationId: 'base-b',
    name: 'Baseline B (Graph Only)',
    hasRun: true,
    patchPassRate: 52.8,
    repairSuccessRate: 48.0,
    regressionRate: 14.1,
    recallAt1: 0.44,
    recallAt3: 0.67,
    recallAt5: 0.74,
    averageFilesInspected: 12.1,
    averageTokens: 22100,
    averageWallClockSec: 36.8,
    contradictionDetectionRate: null,
    recoverySuccessRate: null
  },
  {
    experimentId: 'exp-03',
    configurationId: 'base-c',
    name: 'Baseline C (Semantic + Graph)',
    hasRun: true,
    patchPassRate: 64.5,
    repairSuccessRate: 59.8,
    regressionRate: 9.8,
    recallAt1: 0.58,
    recallAt3: 0.79,
    recallAt5: 0.86,
    averageFilesInspected: 8.9,
    averageTokens: 18200,
    averageWallClockSec: 28.4,
    contradictionDetectionRate: null,
    recoverySuccessRate: null
  },
  {
    experimentId: 'exp-04',
    configurationId: 'base-d',
    name: 'Baseline D (Semantic + Graph + Evidence)',
    hasRun: true,
    patchPassRate: 76.1,
    repairSuccessRate: 72.4,
    regressionRate: 6.2,
    recallAt1: 0.71,
    recallAt3: 0.88,
    recallAt5: 0.92,
    averageFilesInspected: 5.7,
    averageTokens: 14500,
    averageWallClockSec: 22.1,
    contradictionDetectionRate: 0.48,
    recoverySuccessRate: null
  },
  {
    experimentId: 'exp-05',
    configurationId: 'lw-full',
    name: 'LIFEWEAVE (Full Architecture)',
    hasRun: true,
    patchPassRate: 91.4,
    repairSuccessRate: 88.6,
    regressionRate: 1.8,
    recallAt1: 0.86,
    recallAt3: 0.96,
    recallAt5: 0.99,
    averageFilesInspected: 3.2,
    averageTokens: 9800,
    averageWallClockSec: 14.6,
    contradictionDetectionRate: 0.94,
    recoverySuccessRate: 0.82
  }
];

export const GEMMA_4_COMPETITION_MANIFEST: Gemma4AgentManifest = {
  competition: 'Kaggle Gemma 4 Developer Agent Competition',
  targetModel: 'gemma-4-31b-it-qat-w4a16-ct',
  agentYamlContent: `name: lifeweave
version: 1.0.0
model: gemma-4-31b-it-qat-w4a16-ct
description: Evidence-guided autonomous software engineering agent for repository defect localization, minimal patching, and invariant validation.

tools:
  - run_command
  - read_file
  - write_file
  - edit_file
  - get_status
  - submit_patch
  - search_similar_code
  - get_code_neighbors
  - get_code_subgraph

prompts:
  system: prompts/system.md
  analyzer: prompts/analyzer.md

skills:
  - skills/lifeweave/SKILL.md

configs:
  sampling: configs/sampling.yaml`,

  systemPromptContent: `# LIFEWEAVE: EVIDENCE-GUIDED AUTONOMOUS SOFTWARE ENGINEERING AGENT

You are **LIFEWEAVE**, an evidence-guided autonomous software-engineering agent built for the Gemma 4 Developer Agent competition.

Your objective is to produce the smallest correct, validated patch for the given issue in any repository.

## Core Principle & Methodology
> "Map the code. Gather the evidence. Test the hypothesis. Make the smallest safe change."

Do NOT immediately edit the first file returned by search. Semantic similarity is NOT proof of causality.
Never patch because code looks relevant. Patch only when empirical evidence converges on a verified hypothesis.

Your operational lifecycle follows the 9-stage engineering loop:
ORIENT → MAP → LOCATE → GATHER EVIDENCE → FORM HYPOTHESES → TEST HYPOTHESES → PATCH → VALIDATE → RECOVER

## Available Competition Tools
1. run_command(command: string)
2. read_file(path: string, start_line?: number, end_line?: number)
3. write_file(path: string, content: string)
4. edit_file(path: string, target_content: string, replacement_content: string)
5. get_status()
6. submit_patch(summary: string)
7. search_similar_code(query: string)
8. get_code_neighbors(symbol: string | node_id: string)
9. get_code_subgraph(node_ids: string[])

## The Evidence Hierarchy
1. Observed executable behavior (runtime output, reproduction traces)
2. Test behavior (failing/passing assertions, regression boundaries)
3. Observed source behavior (actual control flow, branch logic, return paths)
4. Graph relationships (callers, callees, dependency chains)
5. Semantic similarity (lexical or vector matches)
6. Assumptions (Never treat assumptions as evidence)

## Candidate Localization & Competing Hypotheses
Always identify multiple plausible candidate nodes (Candidate A, B, C) across architectural layers.
Maintain a compact hypothesis matrix: H1 (primary), H2 (alternative).
Actively search for contradictory evidence to disprove working hypotheses before code modification.

## Invariant Formulation & Minimal Patch
Before editing: define expected invariant, determine minimal delta, avoid refactoring, and validate with targeted tests.
Submit patch only after tests confirm invariant preservation.`,

  analyzerPromptContent: `# LIFEWEAVE ANALYZER SUBAGENT: REPOSITORY LOCALIZATION & EVIDENCE SYNTHESIS

You are the LIFEWEAVE Analyzer Subagent, specialized in codebase defect localization, topology mapping, and empirical evidence synthesis.

## 1. Candidate Discovery
- Use search_similar_code for candidate symbols and related implementations.
- Select 2 to 4 distinct candidates across architectural layers.

## 2. Structural & Graph Expansion
- Query get_code_neighbors for callers, callees, and imported types.
- Query get_code_subgraph to trace execution pathways between interacting candidates.

## 3. Evidence Field Computation
For each candidate, compute:
- Semantic Relevance (0.00 – 1.00)
- Structural Relevance (0.00 – 1.00)
- Dependency Relevance (0.00 – 1.00)
- Test Relevance (0.00 – 1.00 or "unknown")
- Behavioral Relevance (0.00 – 1.00 or "unknown")
- Issue Clue Relevance (0.00 – 1.00)
- Contradictory Evidence (observations indicating candidate is not root cause)
- Uncertainty Score (0.00 – 1.00)

## 4. Adaptive Next-Evidence Recommendation
Answer: "What single observation would most reduce uncertainty?"
Choose from: inspect file, inspect callers, inspect callees, inspect tests, search similar code, run targeted test, inspect configuration.`,

  skillMdContent: `---
name: lifeweave
description: Evidence-guided repository reasoning, contradiction detection, graph-informed candidate localization, minimal patching, and failure recovery.
---

# LIFEWEAVE: Evidence-Guided Software Engineering Skill
Use this skill when investigating and resolving defects, feature bugs, and regressions across arbitrary software repositories.

## Workflow:
1. Orient & Map repository graph using search_similar_code and get_code_neighbors.
2. Locate candidate nodes across architectural tiers.
3. Form competing hypotheses (H1, H2) with supporting evidence.
4. Active Contradiction Search: identify caller filters, pass guards, or early returns that invalidate H1.
5. Adaptive Evidence Acquisition: choose next action maximizing information gain per cost.
6. Minimal Patch & Invariant Enforcement: formulate repair delta before edit_file.
7. Validation & Failure Recovery: run reproduction test via run_command. If test fails, classify failure class (WRONG_LOCALIZATION, WRONG_HYPOTHESIS, INCOMPLETE_EVIDENCE, INCORRECT_PATCH, REGRESSION, TEST_ENVIRONMENT) and recover.
8. Submit patch via submit_patch after clean verification.`,

  samplingYamlContent: `temperature: 0.2
top_p: 0.9
max_output_tokens: 8192`
};
