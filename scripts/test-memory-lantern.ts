import fs from 'fs';
import path from 'path';
import { MemoryLanternServerService, GEMMA_ETHICAL_DISCLAIMER } from '../src/server/memoryLanternServerService';
import { LanternKeeperServerService, NEMOTRON_ETHICAL_DISCLAIMER, ALLOWED_PERSONAL_SKILLS } from '../src/server/lanternKeeperServerService';
import { MemoryLanternService } from '../src/components/memorylantern/services/memoryLanternService';
import { FICTIONAL_SAMPLE_MEMORIES } from '../src/components/memorylantern/data/sampleMemories';
import { LanternStoryRequest, MemoryLanternItem } from '../src/components/memorylantern/types';
import { DEFAULT_ROLES_LIBRARY } from '../src/components/threehats/data/rolesLibrary';
import { THREE_HATS_DEFINITIONS } from '../src/components/threehats/types';

async function runMemoryLanternVerification() {
  console.log('======================================================');
  console.log('🏮 LANTERN KEEPER × THREE HATS TEST SUITE');
  console.log('A Personal AI That Remembers With Permission & Life Balance');
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail = '') {
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}: ${detail}`);
      failed++;
    }
  }

  // --------------------------------------------------------------------------
  // TEST GROUP 1: Sample Data Integrity & Labels
  // --------------------------------------------------------------------------
  console.log('Test Group 1: Fictional Sample Data & Public Safety');
  assert(FICTIONAL_SAMPLE_MEMORIES.length >= 3, 'Sample memory bank contains at least 3 curated memories');
  assert(
    FICTIONAL_SAMPLE_MEMORIES.every(m => m.isSample === true),
    'All sample memories are explicitly flagged with isSample = true'
  );
  assert(
    FICTIONAL_SAMPLE_MEMORIES.some(m => m.title.includes('Elena')),
    'Elena lemon verbena tradition sample memory exists'
  );
  assert(
    FICTIONAL_SAMPLE_MEMORIES.some(m => m.meaningfulDetails.some(d => d.type === 'recipe')),
    'Sample memories include structured heirloom recipes'
  );
  assert(
    FICTIONAL_SAMPLE_MEMORIES.some(m => m.meaningfulDetails.some(d => d.type === 'saying_or_proverb')),
    'Sample memories include structured proverbs/sayings'
  );

  // --------------------------------------------------------------------------
  // TEST GROUP 2: Search, Filter & Export Helpers
  // --------------------------------------------------------------------------
  console.log('\nTest Group 2: Client Export & Sanitization Invariants');
  const sample = FICTIONAL_SAMPLE_MEMORIES[0];
  const markdownExport = MemoryLanternService.exportToMarkdown(sample);
  assert(markdownExport.includes('# 🏮 Grandmother Elena'), 'Markdown export contains title header');
  assert(markdownExport.includes('Evening Verbena Infusion'), 'Markdown export preserves meaningful recipe detail');

  const shareableText = MemoryLanternService.exportShareableText(sample);
  assert(!shareableText.includes('sample-user-demo'), 'Shareable text excludes private user ID metadata');
  assert(!shareableText.includes('sample-lantern-1'), 'Shareable text excludes internal document ID');
  assert(shareableText.includes('Elena'), 'Shareable text preserves personal memory content');

  // --------------------------------------------------------------------------
  // TEST GROUP 3: Ethical Guardrail & Prompt Architecture
  // --------------------------------------------------------------------------
  console.log('\nTest Group 3: Gemma Ethical Safety Prompt Invariants');
  const mockReq: LanternStoryRequest = {
    mode: 'voices_and_traditions',
    style: 'warm_simple',
    selectedMemoryIds: [sample.id],
    memories: [{
      title: sample.title,
      dateOrPeriod: sample.dateOrPeriod,
      peopleRemembered: sample.peopleRemembered,
      story: sample.story,
      meaningfulDetails: sample.meaningfulDetails,
      tags: sample.tags
    }]
  };

  const { systemPrompt, userPrompt } = MemoryLanternServerService.buildGemmaPrompt(mockReq);

  assert(
    systemPrompt.includes('NEVER speak from the first-person voice of a deceased person'),
    'Prompt invariant: Strictly forbids speaking from deceased persona'
  );
  assert(
    systemPrompt.includes('NEVER claim or imply supernatural communication'),
    'Prompt invariant: Strictly forbids necromancy or supernatural channeling claims'
  );
  assert(
    systemPrompt.includes('PRESERVE all user-provided facts, names, dates, recipes'),
    'Prompt invariant: Strictly enforces factual preservation'
  );
  assert(
    userPrompt.includes('Evening Verbena Infusion'),
    'User prompt incorporates specific meaningful details from input memories'
  );

  // --------------------------------------------------------------------------
  // TEST GROUP 4: Open-Weight Narrative Generation & Test Fixture
  // --------------------------------------------------------------------------
  console.log('\nTest Group 4: Narrative Engine Execution & Test Fixture');
  
  let rejectedEmpty = false;
  try {
    await MemoryLanternServerService.generateStory({
      mode: 'story_to_keep',
      style: 'warm_simple',
      selectedMemoryIds: [],
      memories: []
    });
  } catch (err: any) {
    rejectedEmpty = err.message.includes('Validation Error');
  }
  assert(rejectedEmpty, 'Rejects empty memory list with explicit Validation Error');

  const fixtureResponse = await MemoryLanternServerService.generateStory(mockReq, {
    isTestFixture: true,
    mockLatencyMs: 245
  });

  assert(fixtureResponse.success === true, 'Deterministic story generation succeeds');
  assert(
    fixtureResponse.provider === 'deterministic_test_fixture',
    'Provider truthfully labeled as deterministic_test_fixture'
  );
  assert(
    fixtureResponse.modelUsed.includes('gemma-2-9b-it'),
    'Model truthfully reflects Gemma 2 open-weight architecture'
  );
  assert(
    fixtureResponse.ethicalSafetyVerified === true,
    'Ethical safety verification flag set to true'
  );
  assert(
    fixtureResponse.suppliedFactsSummary.length >= 2,
    'Supplied facts summary explicitly extracted and separated'
  );
  assert(
    fixtureResponse.disclaimer === GEMMA_ETHICAL_DISCLAIMER,
    'Mandatory ethical disclaimer attached to generated story'
  );

  // --------------------------------------------------------------------------
  // TEST GROUP 5: Provider Status & Truthful Diagnostics
  // --------------------------------------------------------------------------
  console.log('\nTest Group 5: Provider Status Diagnostics');
  const status = await MemoryLanternServerService.checkProviderStatus();
  assert(
    ['READY', 'CONFIGURED', 'NOT_CONFIGURED', 'UNREACHABLE'].includes(status.status),
    `Provider status is valid standard state (${status.status})`
  );
  assert(
    status.supportedModels.includes('gemma2:2b') && status.supportedModels.includes('google/gemma-2-9b-it'),
    'Status reports supported Gemma 2 open-weight models'
  );
  assert(
    status.reproductionCommand.includes('ollama run gemma2:2b'),
    'Status provides copyable reproduction command for Ollama'
  );

  // --------------------------------------------------------------------------
  // TEST GROUP 6: Standalone Package File Integrity
  // --------------------------------------------------------------------------
  console.log('\nTest Group 6: Standalone Package Files');
  const pkgJsonPath = path.resolve('memory-lantern/package.json');
  const readmePath = path.resolve('memory-lantern/README.md');
  const archPath = path.resolve('memory-lantern/ARCHITECTURE.md');
  const openAiSetupPath = path.resolve('memory-lantern/OPEN_AI_SETUP.md');
  const privacyPath = path.resolve('memory-lantern/docs/privacy-and-data-flow.md');
  const submissionPath = path.resolve('memory-lantern/docs/hacktoberfest-submission-draft.md');

  assert(fs.existsSync(pkgJsonPath), 'memory-lantern/package.json exists');
  assert(fs.existsSync(readmePath), 'memory-lantern/README.md exists');
  assert(fs.existsSync(archPath), 'memory-lantern/ARCHITECTURE.md exists');
  assert(fs.existsSync(openAiSetupPath), 'memory-lantern/OPEN_AI_SETUP.md exists');
  assert(fs.existsSync(privacyPath), 'memory-lantern/docs/privacy-and-data-flow.md exists');
  assert(fs.existsSync(submissionPath), 'memory-lantern/docs/hacktoberfest-submission-draft.md exists');

  // --------------------------------------------------------------------------
  // TEST GROUP 7: Platform Invariants & Security Integration
  // --------------------------------------------------------------------------
  console.log('\nTest Group 7: Platform Invariants & Security Integration');
  const rulesPath = path.resolve('firestore.rules');
  const rulesContent = fs.readFileSync(rulesPath, 'utf-8');
  assert(
    rulesContent.includes('/memory_lantern_memories/{memoryId}'),
    'firestore.rules includes dedicated rule for memory_lantern_memories'
  );
  assert(
    rulesContent.includes('/three_hats_roles/{roleId}') && rulesContent.includes('/lantern_keeper_actions/{actionId}'),
    'firestore.rules includes dedicated rules for three_hats_roles and lantern_keeper_actions'
  );
  assert(
    rulesContent.includes('request.resource.data.userId == request.auth.uid'),
    'firestore.rules enforces authenticated user isolation on create'
  );

  const typesPath = path.resolve('src/types.ts');
  const typesContent = fs.readFileSync(typesPath, 'utf-8');
  assert(
    typesContent.includes("'memorylantern'") && typesContent.includes("'threehats'"),
    'src/types.ts includes memorylantern and threehats in NavTab union'
  );

  const navbarPath = path.resolve('src/components/layout/Navbar.tsx');
  const navbarContent = fs.readFileSync(navbarPath, 'utf-8');
  assert(
    navbarContent.includes('Lantern Keeper'),
    'src/components/layout/Navbar.tsx registers Lantern Keeper navItem'
  );
  assert(
    navbarContent.includes('Three Hats'),
    'src/components/layout/Navbar.tsx registers Three Hats navItem'
  );

  const appPath = path.resolve('src/App.tsx');
  const appContent = fs.readFileSync(appPath, 'utf-8');
  assert(
    appContent.includes('<MemoryLanternModule') && appContent.includes('<ThreeHatsModule'),
    'src/App.tsx renders MemoryLanternModule and ThreeHatsModule when active'
  );

  // --------------------------------------------------------------------------
  // TEST GROUP 8: Lantern Keeper Evidence-Backed Memory Retrieval
  // --------------------------------------------------------------------------
  console.log('\nTest Group 8: Evidence-Backed Memory Retrieval');
  const sampleMemories: MemoryLanternItem[] = FICTIONAL_SAMPLE_MEMORIES.map(m => ({ ...m }));
  
  // 8A. Precision match on Elena's tea
  const retrieval1 = await LanternKeeperServerService.retrieveEvidence({
    query: 'What tea recipe did Grandmother Elena brew on Sunday afternoons?',
    userMemories: sampleMemories,
    isTestFixture: true
  });
  assert(retrieval1.success === true, 'Evidence retrieval succeeds');
  assert(retrieval1.citations.length >= 1, 'Returns at least 1 supporting evidence citation');
  assert(
    retrieval1.citations[0].title.includes('Elena'),
    'Source correctness: top citation points to Grandmother Elena memory'
  );
  assert(
    retrieval1.answer.includes('Elena') || retrieval1.answer.includes('verbena'),
    'Faithfulness: answer incorporates verified facts from memory'
  );

  // 8B. Unsupported fact / Zero-hallucination test
  const retrieval2 = await LanternKeeperServerService.retrieveEvidence({
    query: 'What is the secret banking password or telephone number?',
    userMemories: sampleMemories,
    isTestFixture: true
  });
  assert(
    retrieval2.missingOrConflictingFacts.length >= 1,
    'Identifies missing sensitive facts explicitly without hallucinating'
  );
  assert(
    !retrieval2.answer.includes('password123'),
    'Zero hallucination: Never fabricates non-existent passwords or phone numbers'
  );

  // 8C. Permission Revocation behavior in subsequent retrieval
  const revokedMemories: MemoryLanternItem[] = sampleMemories.map(m => 
    m.title.includes('Elena') ? { ...m, revokedAt: new Date().toISOString() } : m
  );
  const retrieval3 = await LanternKeeperServerService.retrieveEvidence({
    query: 'Tell me about Elena verbena tea',
    userMemories: revokedMemories,
    isTestFixture: true
  });
  assert(
    !retrieval3.citations.some(c => c.title.includes('Elena')),
    'Revocation behavior: Revoked memories are immediately excluded from AI retrieval'
  );

  // --------------------------------------------------------------------------
  // TEST GROUP 9: Reusable Personal Skills & Permission Gating
  // --------------------------------------------------------------------------
  console.log('\nTest Group 9: Personal Skills Execution & Approval Gates');

  // 9A. Rejects unapproved consequential skill
  let blockedUnapproved = false;
  try {
    await LanternKeeperServerService.executeSkill({
      skillName: 'family_story_keeper',
      userApproved: false,
      userMemories: sampleMemories,
      payload: { mode: 'story_to_keep' }
    });
  } catch (err: any) {
    blockedUnapproved = err.message.includes('requires explicit user approval');
  }
  assert(blockedUnapproved, 'Consequential skill execution strictly blocked when unapproved');

  // 9B. Allowed Skill Execution: Weekly Life Review
  const skillRes1 = await LanternKeeperServerService.executeSkill({
    skillName: 'weekly_life_review',
    userApproved: true,
    userMemories: sampleMemories,
    payload: {
      commitments: [
        { roleName: 'Mentor', title: 'Conduct 30-min mentoring call', status: 'completed' },
        { roleName: 'Caregiver', title: 'Prepare Sunday tea', status: 'in_progress', nextAction: 'Gather leaves' }
      ],
      roles: [{ name: 'Mentor' }, { name: 'Caregiver' }]
    },
    isTestFixture: true
  });
  assert(skillRes1.success === true, 'Weekly Life Review skill executes successfully when approved');
  assert(skillRes1.result.completedCount === 1, 'Skill correctly audits completed commitments');
  assert(skillRes1.result.realisticChecklist.length >= 2, 'Skill produces realistic action checklist');

  // 9C. Tool Allowlist enforcement: Rejects unknown skill
  let blockedUnknown = false;
  try {
    await LanternKeeperServerService.executeSkill({
      skillName: 'unauthorized_shadow_skill' as any,
      userApproved: true,
      payload: {}
    });
  } catch (err: any) {
    blockedUnknown = err.message.includes('not on the server-side tool allowlist');
  }
  assert(blockedUnknown, 'Server allowlist rejects unauthorized tool executions');

  // --------------------------------------------------------------------------
  // TEST GROUP 10: Consequential Action Audit Trail (Zero Sensitive Leakage)
  // --------------------------------------------------------------------------
  console.log('\nTest Group 10: Action Audit Trail & Privacy');
  const auditRec = LanternKeeperServerService.recordActionAudit(
    'execute_skill',
    'weekly_life_review',
    'APPROVED',
    'user-test-uid-123',
    2,
    'User approved weekly life review synthesis'
  );
  assert(auditRec.status === 'APPROVED', 'Audit record reflects APPROVED status');
  const retrievedAudits = LanternKeeperServerService.getAuditRecords('user-test-uid-123');
  assert(retrievedAudits.length >= 1, 'Audit ledger returns recorded audit events');
  assert(
    !JSON.stringify(retrievedAudits).includes('password') && !JSON.stringify(retrievedAudits).includes('lemon verbena leaves, wild mountain honey'),
    'Privacy invariant: Sensitive memory contents are never logged in audit trail'
  );

  // --------------------------------------------------------------------------
  // TEST GROUP 11: Nebius Token Factory & NVIDIA Nemotron Diagnostics
  // --------------------------------------------------------------------------
  console.log('\nTest Group 11: Nebius Token Factory & NVIDIA Nemotron Integration');
  const nebiusCheck = await LanternKeeperServerService.checkProviderStatus();
  assert(
    ['NOT_CONFIGURED', 'CONFIGURED', 'READY', 'UNREACHABLE'].includes(nebiusCheck.status),
    `Nebius provider status reports standard state: ${nebiusCheck.status}`
  );
  assert(
    nebiusCheck.supportedModels.some(m => m.includes('nemotron')),
    'Nebius status lists supported NVIDIA Nemotron model family'
  );
  assert(
    nebiusCheck.endpointUrl.includes('nebius.com') || nebiusCheck.endpointUrl.includes('chat/completions'),
    'Endpoint URL points to official Nebius Token Factory completion service'
  );

  // --------------------------------------------------------------------------
  // TEST GROUP 12: Three Hats — Professional, Personal & Social
  // --------------------------------------------------------------------------
  console.log('\nTest Group 12: Three Hats Hierarchy & AI Companion Reflection');
  
  // 12A. Three Hats categories & definitions
  assert(Boolean(THREE_HATS_DEFINITIONS.professional), 'Professional Hat definition exists');
  assert(Boolean(THREE_HATS_DEFINITIONS.personal), 'Personal Hat definition exists');
  assert(Boolean(THREE_HATS_DEFINITIONS.social), 'Social Hat definition exists');

  // 12B. Role library contains multi-hat roles
  const multiHatRoles = DEFAULT_ROLES_LIBRARY.filter(r => r.hatIds.length > 1);
  assert(multiHatRoles.length >= 3, 'Role library supports multi-hat roles (e.g. Lifelong Learner, Mentor)');

  // 12C. Three Hats Companion AI reflection cites user inputs
  const companionRes = await LanternKeeperServerService.executeSkill({
    skillName: 'three_hats_companion',
    userApproved: true,
    payload: {
      roles: DEFAULT_ROLES_LIBRARY.slice(0, 4),
      commitments: [
        { title: 'Sleep 8 hours', status: 'in_progress', nextAction: 'Turn off screens at 10 PM' }
      ]
    },
    isTestFixture: true
  });
  assert(companionRes.success === true, 'Three Hats Companion executes successfully');
  assert(companionRes.result.citedUserInputs.length >= 1, 'Three Hats Companion strictly cites user inputs');
  assert(
    companionRes.result.permissionRequiredToSaveMemory === true,
    'Three Hats Companion requires explicit permission before saving persistent memory'
  );

  console.log('\n======================================================');
  console.log(`✨ TEST SUITE COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runMemoryLanternVerification().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
