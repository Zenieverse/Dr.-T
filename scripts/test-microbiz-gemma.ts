import assert from 'assert';
import { 
  validateCourseSchema, 
  validateCopySchema, 
  validatePlanSchema, 
  validateExtractionSchema, 
  MICROBIZ_MODELS 
} from '../src/server/microbizAiService';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

async function runGemmaTestSuite() {
  console.log('====================================================');
  console.log('DR. T / MICROBIZ — GEMMA INTEGRATION VERIFICATION');
  console.log('DEV Hacktoberfest 2026 Challenge Suite');
  console.log('Base URL:', BASE_URL);
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  async function test(name: string, fn: () => Promise<void>) {
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`[FAIL] ${name}`);
      console.error('       Error:', err.message || err);
      failed++;
    }
  }

  // 1. Verify Diagnostics & Model Registration API
  await test('GET /api/microbiz/ai/models returns Gemma 4 configuration', async () => {
    const res = await fetch(`${BASE_URL}/api/microbiz/ai/models`);
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const data = await res.json();
    assert.strictEqual(data.status, 'OPERATIONAL');
    assert.strictEqual(data.openWeightVerified, true);
    assert.strictEqual(data.models.gemma, MICROBIZ_MODELS.GEMMA_PRIMARY);
    assert.strictEqual(data.models.gemini, MICROBIZ_MODELS.GEMINI_FALLBACK);
  });

  // 2. Verify Course Generation with Gemma
  await test('POST /api/microbiz/ai/generate-course (Gemma 4 curriculum architect)', async () => {
    const res = await fetch(`${BASE_URL}/api/microbiz/ai/generate-course`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic: 'Natural Herbal Soap Making',
        skillLevel: 'Beginner',
        category: 'Practical Skills',
        language: 'en',
        provider: 'gemma'
      })
    });
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(body.course, 'Expected course payload');
    assert.ok(validateCourseSchema(body.course), 'Expected course to satisfy validation schema');
    assert.strictEqual(body.isGenuineAi, true, 'Expected genuine AI generation, not fallback');
    assert.strictEqual(body.isHeuristicFallback, false, 'Expected no heuristic fallback');
    assert.strictEqual(body.provider, MICROBIZ_MODELS.GEMMA_PRIMARY, `Expected provider ${MICROBIZ_MODELS.GEMMA_PRIMARY}`);
    assert.strictEqual(body.modelFamily, 'gemma', 'Expected modelFamily gemma');
    console.log(`       Provider: ${body.provider} (Genuine AI: ${body.isGenuineAi}, Latency: ${body.executionTimeMs}ms)`);
  });

  // 3. Verify Product Copywriting with Gemma
  await test('POST /api/microbiz/ai/generate-copy (Gemma 4 artisan storyteller)', async () => {
    const res = await fetch(`${BASE_URL}/api/microbiz/ai/generate-copy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productName: 'Hand-Carved Coconut Shell Bowls',
        category: 'Eco-Crafts',
        details: 'Crafted from reclaimed coconut shells by local artisans, polished with organic coconut oil.',
        targetAudience: 'Conscious home cooks and zero-waste gift seekers',
        language: 'en',
        provider: 'gemma'
      })
    });
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(body.copy, 'Expected copy payload');
    assert.ok(validateCopySchema(body.copy), 'Expected copy to satisfy validation schema');
    assert.strictEqual(body.isGenuineAi, true, 'Expected genuine AI generation');
    assert.strictEqual(body.provider, MICROBIZ_MODELS.GEMMA_PRIMARY, `Expected provider ${MICROBIZ_MODELS.GEMMA_PRIMARY}`);
    console.log(`       Tagline: "${body.copy.tagline}" (Provider: ${body.provider})`);
  });

  // 4. Verify Lean Canvas Business Plan with Gemma
  await test('POST /api/microbiz/ai/generate-business-plan (Gemma 4 lean canvas)', async () => {
    const res = await fetch(`${BASE_URL}/api/microbiz/ai/generate-business-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        businessName: 'Saigon Urban Herb Garden',
        ideaSummary: 'Micro-rooftop cultivation of organic culinary and medicinal herbs for neighborhood markets and cafes.',
        location: 'District 3, HCMC & Online',
        language: 'en',
        provider: 'gemma'
      })
    });
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(body.plan, 'Expected plan payload');
    assert.ok(validatePlanSchema(body.plan), 'Expected plan to satisfy validation schema');
    assert.strictEqual(body.isGenuineAi, true, 'Expected genuine AI generation');
    assert.strictEqual(body.provider, MICROBIZ_MODELS.GEMMA_PRIMARY, `Expected provider ${MICROBIZ_MODELS.GEMMA_PRIMARY}`);
    console.log(`       Value Prop: "${body.plan.valueProposition.slice(0, 70)}..."`);
  });

  // 5. Verify Document & Receipt OCR with Gemma
  await test('POST /api/microbiz/ocr/extract-document (Financial receipt parsing)', async () => {
    const receiptText = `CỬA HÀNG VẬT LIỆU XANH
Ngày: 2026-10-12
Số HĐ: #8821
1. Tre Bến Tre loại A: 350,000 VND
2. Dầu dừa hữu cơ ép lạnh: 150,000 VND
Tổng cộng: 500,000 VND
Thanh toán: Tiền mặt`;

    const res = await fetch(`${BASE_URL}/api/microbiz/ocr/extract-document`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rawText: receiptText,
        documentType: 'receipt',
        provider: 'gemma'
      })
    });
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(body.extraction, 'Expected extraction payload');
    assert.ok(validateExtractionSchema(body.extraction), 'Expected valid extraction schema');
    assert.strictEqual(body.isGenuineAi, true, 'Expected genuine AI generation');
    assert.strictEqual(body.provider, MICROBIZ_MODELS.GEMMA_PRIMARY, `Expected provider ${MICROBIZ_MODELS.GEMMA_PRIMARY}`);
    assert.ok(body.extraction.totalAmount > 0, 'Expected positive total amount');
    console.log(`       Vendor: ${body.extraction.vendorName}, Amount: ${body.extraction.totalAmount} ${body.extraction.currency}`);
  });

  // 6. Verify Negative Input Validation (Course requires topic)
  await test('Negative Validation: Missing topic rejects with 400', async () => {
    const res = await fetch(`${BASE_URL}/api/microbiz/ai/generate-course`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skillLevel: 'Beginner' })
    });
    assert.strictEqual(res.status, 400, `Expected 400, got ${res.status}`);
    const data = await res.json();
    assert.strictEqual(data.error, 'Topic is required');
  });

  // 7. Verify Negative Input Validation (Copy requires productName)
  await test('Negative Validation: Missing product name rejects with 400', async () => {
    const res = await fetch(`${BASE_URL}/api/microbiz/ai/generate-copy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: 'Eco-Crafts' })
    });
    assert.strictEqual(res.status, 400, `Expected 400, got ${res.status}`);
    const data = await res.json();
    assert.strictEqual(data.error, 'Product or service name is required');
  });

  // 8. Verify Negative Input Validation (Plan requires businessName & ideaSummary)
  await test('Negative Validation: Missing plan params rejects with 400', async () => {
    const res = await fetch(`${BASE_URL}/api/microbiz/ai/generate-business-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessName: 'Solo Biz' })
    });
    assert.strictEqual(res.status, 400, `Expected 400, got ${res.status}`);
    const data = await res.json();
    assert.strictEqual(data.error, 'Business name and idea summary are required');
  });

  // 9. Verify Multi-Provider Selection: Gemini provider choice works as well
  await test('Provider Switch: Explicit Gemini selection generates with Gemini', async () => {
    const res = await fetch(`${BASE_URL}/api/microbiz/ai/generate-copy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productName: 'Herbal Tea Sampler',
        category: 'Wellness',
        provider: 'gemini'
      })
    });
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(body.copy, 'Expected copy payload');
    assert.strictEqual(body.isGenuineAi, true, 'Expected genuine AI generation with Gemini');
    assert.strictEqual(body.provider, MICROBIZ_MODELS.GEMINI_FALLBACK, `Expected provider ${MICROBIZ_MODELS.GEMINI_FALLBACK}`);
    assert.strictEqual(body.modelFamily, 'gemini', 'Expected modelFamily gemini');
    console.log(`       Provider used: ${body.provider} (Requested: gemini)`);
  });

  // 10. Verify Resilient Offline Heuristic Fallback & Honest Attribution
  await test('Resilience Engine: Offline fallback returns valid schema and never mislabels output as Gemma', async () => {
    const { runMicroBizInference } = await import('../src/server/microbizAiService');
    const result = await runMicroBizInference({
      prompt: 'dummy prompt',
      requestedProvider: 'gemma',
      client: null, // simulates no API key or disconnected environment
      validator: validateCopySchema,
      heuristicFallback: () => ({
        tagline: 'Crafted with care, honesty, and local dedication.',
        storyDescription: 'Authentic local product description generated offline.',
        keyFeatures: ['Feature 1', 'Feature 2'],
        socialPostSnippet: 'Authentic announcement #MadeForAll',
        ethicalGuarantee: 'Guaranteed local quality'
      })
    });

    assert.strictEqual(result.meta.isGenuineAi, false, 'Expected isGenuineAi: false for heuristic');
    assert.strictEqual(result.meta.isHeuristicFallback, true, 'Expected isHeuristicFallback: true');
    assert.strictEqual(result.meta.provider, MICROBIZ_MODELS.HEURISTIC_TEXT);
    assert.strictEqual(result.meta.modelFamily, 'heuristic');
    assert.ok(result.meta.fallbackNotice, 'Expected truthful fallback notice');
    assert.ok(validateCopySchema(result.data), 'Expected heuristic fallback to satisfy schema');
    console.log(`       Fallback Provider: ${result.meta.provider} (Genuine AI: ${result.meta.isGenuineAi})`);
  });

  console.log('\n====================================================');
  console.log(`TEST SUITE COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runGemmaTestSuite().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
