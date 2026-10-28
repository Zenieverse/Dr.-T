import fs from 'fs';
import path from 'path';
import { MemoryLanternServerService, GEMMA_ETHICAL_DISCLAIMER } from './src/server/memoryLanternServerService';
import { MemoryLanternService } from './src/services/memoryLanternService';
import { FICTIONAL_SAMPLE_MEMORIES } from './src/data/sampleMemories';
import { LanternStoryRequest } from './src/types';

async function runMemoryLanternVerification() {
  console.log('======================================================');
  console.log('🏮 MEMORY LANTERN (STANDALONE) — VERIFICATION SUITE');
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

  // TEST GROUP 1: Sample Data Integrity
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

  // TEST GROUP 2: Export & Sanitization Invariants
  console.log('\nTest Group 2: Client Export & Sanitization Invariants');
  const sample = FICTIONAL_SAMPLE_MEMORIES[0];
  const markdownExport = MemoryLanternService.exportToMarkdown(sample);
  assert(markdownExport.includes('# 🏮 Grandmother Elena'), 'Markdown export contains title header');
  assert(markdownExport.includes('Evening Verbena Infusion'), 'Markdown export preserves meaningful recipe detail');

  const shareableText = MemoryLanternService.exportShareableText(sample);
  assert(!shareableText.includes('sample-user-demo'), 'Shareable text excludes private user ID metadata');
  assert(!shareableText.includes('sample-lantern-1'), 'Shareable text excludes internal document ID');

  // TEST GROUP 3: Ethical Guardrail & Prompt Architecture
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

  // TEST GROUP 4: Narrative Engine Execution & Test Fixture
  console.log('\nTest Group 4: Narrative Engine Execution & Test Fixture');
  const fixtureResponse = await MemoryLanternServerService.generateStory(mockReq, {
    isTestFixture: true,
    mockLatencyMs: 200
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
    fixtureResponse.disclaimer === GEMMA_ETHICAL_DISCLAIMER,
    'Mandatory ethical disclaimer attached to generated story'
  );

  // TEST GROUP 5: Provider Status Diagnostics
  console.log('\nTest Group 5: Provider Status Diagnostics');
  const status = await MemoryLanternServerService.checkProviderStatus();
  assert(
    ['READY', 'CONFIGURED', 'NOT_CONFIGURED', 'UNREACHABLE'].includes(status.status),
    `Provider status is valid standard state (${status.status})`
  );

  console.log('\n======================================================');
  console.log(`✨ STANDALONE TEST SUITE COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================================\n');

  if (failed > 0) process.exit(1);
}

runMemoryLanternVerification().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
