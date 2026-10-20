import { 
  validateCourseSchema, 
  validateCopySchema, 
  validatePlanSchema, 
  validateExtractionSchema, 
  MICROBIZ_MODELS 
} from '../src/server/microbizAiService';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

async function verifyFourWorkflows() {
  console.log('=== FOUR-WORKFLOW INDIVIDUAL AUDIT (SYNTHETIC DATA ONLY) ===\n');

  // 1. Course Generation
  console.log('--- 1. POST /api/microbiz/ai/generate-course ---');
  const t0 = Date.now();
  const res1 = await fetch(`${BASE_URL}/api/microbiz/ai/generate-course`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      topic: 'Recycled Paper Crafts for Local Markets',
      skillLevel: 'Beginner',
      category: 'Practical Skills',
      language: 'en',
      provider: 'gemma'
    })
  });
  const lat1 = Date.now() - t0;
  const body1 = await res1.json();
  const valid1 = validateCourseSchema(body1.course);
  console.log({
    endpoint: '/api/microbiz/ai/generate-course',
    status: res1.status,
    success: body1.success,
    provider: body1.provider,
    modelFamily: body1.modelFamily,
    isGenuineAi: body1.isGenuineAi,
    isHeuristicFallback: body1.isHeuristicFallback,
    usedGemma: body1.provider === MICROBIZ_MODELS.GEMMA_PRIMARY && body1.isGenuineAi,
    schemaValid: valid1,
    latencyMs: lat1,
    courseTitle: body1.course?.title,
    modulesCount: body1.course?.modules?.length
  });

  // 2. Product Copywriting
  console.log('\n--- 2. POST /api/microbiz/ai/generate-copy ---');
  const t1 = Date.now();
  const res2 = await fetch(`${BASE_URL}/api/microbiz/ai/generate-copy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      productName: 'Hand-Woven Seagrass Storage Basket',
      category: 'Home Decor',
      details: 'Crafted from coastal natural seagrass with reinforced hemp handles. 100% biodegradable.',
      targetAudience: 'Conscious home organizers and eco-friendly shoppers',
      language: 'en',
      provider: 'gemma'
    })
  });
  const lat2 = Date.now() - t1;
  const body2 = await res2.json();
  const valid2 = validateCopySchema(body2.copy);
  console.log({
    endpoint: '/api/microbiz/ai/generate-copy',
    status: res2.status,
    success: body2.success,
    provider: body2.provider,
    modelFamily: body2.modelFamily,
    isGenuineAi: body2.isGenuineAi,
    isHeuristicFallback: body2.isHeuristicFallback,
    usedGemma: body2.provider === MICROBIZ_MODELS.GEMMA_PRIMARY && body2.isGenuineAi,
    schemaValid: valid2,
    latencyMs: lat2,
    tagline: body2.copy?.tagline
  });

  // 3. Business Plan Drafter
  console.log('\n--- 3. POST /api/microbiz/ai/generate-business-plan ---');
  const t2 = Date.now();
  const res3 = await fetch(`${BASE_URL}/api/microbiz/ai/generate-business-plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      businessName: 'Green Neighborhood Compost Collective',
      ideaSummary: 'Collecting neighborhood organic kitchen scraps to produce enriched bio-fertilizer for urban growers.',
      location: 'District 2 & Community Hubs',
      language: 'en',
      provider: 'gemma'
    })
  });
  const lat3 = Date.now() - t2;
  const body3 = await res3.json();
  const valid3 = validatePlanSchema(body3.plan);
  console.log({
    endpoint: '/api/microbiz/ai/generate-business-plan',
    status: res3.status,
    success: body3.success,
    provider: body3.provider,
    modelFamily: body3.modelFamily,
    isGenuineAi: body3.isGenuineAi,
    isHeuristicFallback: body3.isHeuristicFallback,
    usedGemma: body3.provider === MICROBIZ_MODELS.GEMMA_PRIMARY && body3.isGenuineAi,
    schemaValid: valid3,
    latencyMs: lat3,
    valuePropSnippet: body3.plan?.valueProposition?.slice(0, 80)
  });

  // 4. Document / Receipt OCR Extractor
  console.log('\n--- 4. POST /api/microbiz/ocr/extract-document ---');
  const syntheticReceipt = `CỬA HÀNG VẬT LIỆU TỰ NHIÊN
Ngày: 2026-10-14
Số Hóa Đơn: #SYNTH-9901
1. Cót ép mây tre đan: 220,000 VND
2. Dây cói buộc thô 50m: 60,000 VND
Tổng thanh toán: 280,000 VND
Hình thức: Chuyển khoản`;

  const t3 = Date.now();
  const res4 = await fetch(`${BASE_URL}/api/microbiz/ocr/extract-document`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      rawText: syntheticReceipt,
      documentType: 'receipt',
      provider: 'gemma'
    })
  });
  const lat4 = Date.now() - t3;
  const body4 = await res4.json();
  const valid4 = validateExtractionSchema(body4.extraction);
  console.log({
    endpoint: '/api/microbiz/ocr/extract-document',
    status: res4.status,
    success: body4.success,
    provider: body4.provider,
    modelFamily: body4.modelFamily,
    isGenuineAi: body4.isGenuineAi,
    isHeuristicFallback: body4.isHeuristicFallback,
    usedGemma: body4.provider === MICROBIZ_MODELS.GEMMA_PRIMARY && body4.isGenuineAi,
    schemaValid: valid4,
    latencyMs: lat4,
    vendorName: body4.extraction?.vendorName,
    totalAmount: body4.extraction?.totalAmount,
    currency: body4.extraction?.currency
  });
}

verifyFourWorkflows().catch(console.error);
