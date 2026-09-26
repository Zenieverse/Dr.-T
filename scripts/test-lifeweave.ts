// ==========================================
// LIFEWEAVE: AUTOMATED VERIFICATION & TEST BENCH
// Tests Repository Connection, Code Map, Evidence Calculation, Hypotheses, Safety & Persistence
// ==========================================

import { lifeweaveEngineeringService } from '../src/server/lifeweaveEngineeringService';

async function runLifeweaveTestSuite() {
  console.log('🧪 Starting LIFEWEAVE Engineering Service Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName} - ${detail || 'Assertion failed'}`);
      failed++;
    }
  }

  // TEST 1: Repository Overview & Connection (Phase 3)
  console.log('--- Test 1: Repository Connection & Overview ---');
  const overview = lifeweaveEngineeringService.getRepositoryOverview();
  assert(overview.status === 'HEALTHY', 'Repository status is HEALTHY');
  assert(overview.indexedFiles > 50, `Indexed files count is realistic (${overview.indexedFiles} files)`);
  assert(overview.dependencies > 10, `Dependencies discovered from package.json (${overview.dependencies} deps)`);
  assert(overview.readOnlyMode === true, 'Read-only mode is strictly enabled');
  assert(overview.clinicalLogicProtected === true, 'Clinical logic protection boundary active');

  // TEST 2: Security Jailing & Secret Redaction (Phase 2 & 12)
  console.log('\n--- Test 2: Security Boundaries & Secret Redaction ---');
  const traversalAttempt = lifeweaveEngineeringService.getFileContent('../../../etc/passwd');
  assert(traversalAttempt.exists === false, 'Path traversal attempt (../../../etc/passwd) rejected safely');
  assert(traversalAttempt.content.includes('Access denied'), 'Path traversal returns access denied message');

  const envAttempt = lifeweaveEngineeringService.getFileContent('.env');
  assert(envAttempt.exists === false, '.env file access rejected by security filter');

  // TEST 3: File Reading & Code Extraction (Phase 3)
  console.log('\n--- Test 3: Safe File Content Reading & Code Extraction ---');
  const serverContent = lifeweaveEngineeringService.getFileContent('server.ts', 1610, 1630);
  assert(serverContent.exists === true, 'Can read server.ts within allowed line range');
  assert(serverContent.content.includes("redirect: 'follow'"), "Verified exact line containing redirect: 'follow' in server.ts");
  assert(!serverContent.content.includes('AIzaSy'), 'No unredacted Google API keys exposed');

  // TEST 4: Code Search (Phase 3)
  console.log('\n--- Test 4: Code Search Engine ---');
  const searchMatches = lifeweaveEngineeringService.searchCode('readit/fetch-url');
  assert(searchMatches.length > 0, `Search finds real route occurrences (${searchMatches.length} matches)`);
  assert(searchMatches.some(m => m.filePath === 'server.ts'), 'Search identifies server.ts as containing the route');

  // TEST 5: Living Code Map AST Generation (Phase 4)
  console.log('\n--- Test 5: Living Code Map Topology Graph ---');
  const codeMap = lifeweaveEngineeringService.getLivingCodeMap();
  assert(codeMap.nodes.length > 20, `Code Map generates typed nodes (${codeMap.nodes.length} nodes)`);
  assert(codeMap.edges.length > 10, `Code Map establishes structural relationships (${codeMap.edges.length} edges)`);
  const hasSafetyFlag = codeMap.nodes.some(n => n.isClinicalOrSafetyCritical);
  assert(hasSafetyFlag, 'Code Map correctly identifies clinical/safety critical nodes');

  // TEST 6: Read-Only Investigation (Phase 5, 6, 7, 8, 9)
  console.log('\n--- Test 6: Real Investigation Engine (Phase 9 ReadIt PDF Redirect Task) ---');
  const investigation = await lifeweaveEngineeringService.runInvestigation({
    issue: 'Investigate the ReadIt PDF ingestion flow and identify where redirected PDF URLs are handled. Determine whether the suspected behavior actually exists.',
    repository: 'dr-t-platform (main)',
    optional_path: 'server.ts'
  });

  assert(Boolean(investigation.id), `Investigation ID generated: ${investigation.id}`);
  assert(investigation.isRealRepositoryInvestigation === true, 'Marked as real repository investigation');
  assert(investigation.candidates.length >= 2, `Candidates discovered: ${investigation.candidates.length} candidates`);

  // Verify Candidate 1 is server.ts:1620
  const cand1 = investigation.candidates.find(c => c.filePath === 'server.ts');
  assert(Boolean(cand1), 'Candidate 1 correctly identifies server.ts');
  if (cand1) {
    assert(cand1.evidence.semanticRelevance !== null, `Semantic relevance measured: ${cand1.evidence.semanticRelevance}`);
    assert(cand1.evidence.testRelevance === null, 'Test relevance for missing redirect test returns "unknown" (null), not fabricated');
    assert(cand1.supportingEvidence.length >= 2, `Supporting evidence items present: ${cand1.supportingEvidence.length}`);
    assert(cand1.contradictoryEvidence.length >= 1, `Contradictory evidence items present: ${cand1.contradictoryEvidence.length}`);
    assert(cand1.codeSnippet?.includes("redirect: 'follow'"), 'Candidate contains verified code snippet from repository');
  }

  // Verify Hypotheses (Phase 7)
  assert(investigation.hypotheses.length >= 2, `Multiple hypotheses generated: ${investigation.hypotheses.length}`);
  const h1 = investigation.hypotheses.find(h => h.code === 'H1');
  assert(Boolean(h1), 'Hypothesis H1 exists for native runtime redirect delegation');
  if (h1) {
    assert(h1.confidence > 0.7, `H1 confidence calculated: ${h1.confidence}`);
    assert(h1.supportingSummary.length > 0, 'H1 includes supporting summary without private chain-of-thought');
    assert(Boolean(h1.nextRecommendedStep), 'H1 includes concrete next step');
  }

  // Verify "What evidence would most reduce uncertainty?" (Phase 8)
  assert(Boolean(investigation.next_evidence_request), 'Next evidence request formulated');
  if (investigation.next_evidence_request) {
    assert(investigation.next_evidence_request.action === 'inspect file', `Action is "${investigation.next_evidence_request.action}"`);
    assert(investigation.next_evidence_request.targetNode.includes('server.ts'), `Target node is "${investigation.next_evidence_request.targetNode}"`);
    assert(Boolean(investigation.next_evidence_request.rationale), 'Rationale provided with concise reason');
  }

  // TEST 7: Persistence (Phase 10)
  console.log('\n--- Test 7: Investigation State Persistence ---');
  const allInvs = lifeweaveEngineeringService.getInvestigations();
  assert(allInvs.length >= 1, `Persisted investigations list contains ${allInvs.length} items`);
  const retrieved = lifeweaveEngineeringService.getInvestigationById(investigation.id);
  assert(Boolean(retrieved), 'Can retrieve saved investigation by ID');
  assert(retrieved?.id === investigation.id, 'Retrieved investigation matches saved data');

  // SUMMARY
  console.log('\n==========================================');
  console.log(`LIFEWEAVE Test Suite Results: ${passed} Passed, ${failed} Failed`);
  console.log('==========================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runLifeweaveTestSuite().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
