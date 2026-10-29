import fs from 'fs';
import path from 'path';
import { MemoryLanternServerService, GEMMA_ETHICAL_DISCLAIMER } from '../src/server/memoryLanternServerService';
import { MemoryLanternService } from '../src/components/memorylantern/services/memoryLanternService';
import { FICTIONAL_SAMPLE_MEMORIES } from '../src/components/memorylantern/data/sampleMemories';
import { LanternStoryRequest } from '../src/components/memorylantern/types';

async function runMemoryLanternVerification() {
  console.log('======================================================');
  console.log('🏮 MEMORY LANTERN — STORIES THAT STAY TEST SUITE');
  console.log('DEV Hacktoberfest 2026 Week 4: "Ghost in the Machine"');
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
  // TEST GROUP 4: Open-Weight Gemma Narrative Generation & Validation
  // --------------------------------------------------------------------------
  console.log('\nTest Group 4: Narrative Engine Execution & Test Fixture');
  
  // Validation on empty input
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

  // Generation using deterministic test fixture
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
  // TEST GROUP 7: Platform Invariants & Non-Regression
  // --------------------------------------------------------------------------
  console.log('\nTest Group 7: Platform Invariants & Security Integration');
  const rulesPath = path.resolve('firestore.rules');
  const rulesContent = fs.readFileSync(rulesPath, 'utf-8');
  assert(
    rulesContent.includes('/memory_lantern_memories/{memoryId}'),
    'firestore.rules includes dedicated rule for memory_lantern_memories'
  );
  assert(
    rulesContent.includes('request.resource.data.userId == request.auth.uid'),
    'firestore.rules enforces authenticated user isolation on create'
  );

  const typesPath = path.resolve('src/types.ts');
  const typesContent = fs.readFileSync(typesPath, 'utf-8');
  assert(
    typesContent.includes("'memorylantern'"),
    'src/types.ts includes memorylantern in NavTab union'
  );

  const navbarPath = path.resolve('src/components/layout/Navbar.tsx');
  const navbarContent = fs.readFileSync(navbarPath, 'utf-8');
  assert(
    navbarContent.includes("'memorylantern'"),
    'src/components/layout/Navbar.tsx registers Memory Lantern navItem'
  );

  const appPath = path.resolve('src/App.tsx');
  const appContent = fs.readFileSync(appPath, 'utf-8');
  assert(
    appContent.includes('<MemoryLanternModule'),
    'src/App.tsx renders MemoryLanternModule when tab is active'
  );
  assert(
    appContent.includes('getInitialTab') && appContent.includes('window.location.hash'),
    'src/App.tsx supports direct deep link initialization and refresh via URL search/hash'
  );
  assert(
    appContent.includes('replaceState') && appContent.includes('hashchange'),
    'src/App.tsx synchronizes URL hash and handles browser back/forward navigation'
  );
  assert(
    appContent.includes('<HealthAlertCompanionModule') || appContent.includes('<HealthAlertModule'),
    'Regression check: HealthAlert Companion preserved intact in App.tsx'
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
