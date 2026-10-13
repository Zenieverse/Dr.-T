import fs from 'fs';
import path from 'path';

function runMicroBizTests() {
  console.log('====================================================');
  console.log('🧪 DR. T MICROBIZ INVARIANT & AUDIT TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail = '') {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName} - ${detail}`);
      failed++;
    }
  }

  // 1. Identity & Fallback Audit
  const initialDataPath = path.resolve('src/components/microbiz/data/initialMicroBizData.ts');
  const initialDataContent = fs.readFileSync(initialDataPath, 'utf-8');

  assert(
    initialDataContent.includes('export const DEFAULT_GUEST_PROFILE'),
    'DEFAULT_GUEST_PROFILE is explicitly defined'
  );

  assert(
    initialDataContent.includes("id: 'guest_unauthenticated'"),
    'Guest profile uses guest_unauthenticated rather than a hardcoded user identity'
  );

  assert(
    !initialDataContent.includes('export const CURRENT_USER_PROFILE: MicroBizProfile = SAMPLE_CREATOR_ALEX'),
    'CURRENT_USER_PROFILE does NOT impersonate Alex Rivera as active user'
  );

  // 2. Service Identity Resolution
  const servicePath = path.resolve('src/components/microbiz/services/microbizService.ts');
  const serviceContent = fs.readFileSync(servicePath, 'utf-8');

  assert(
    serviceContent.includes('static getCurrentUserId()') && serviceContent.includes('static isUserAuthenticated()'),
    'MicroBizService provides dynamic getCurrentUserId and isUserAuthenticated methods'
  );

  assert(
    serviceContent.includes('where(\'userId\', \'==\', auth.currentUser.uid)'),
    'Firestore private finances query is strictly isolated by authenticated uid'
  );

  assert(
    !serviceContent.includes('userId = CURRENT_USER_PROFILE.id'),
    'MicroBizService methods do not default to static Alex Rivera identity'
  );

  // 3. Firestore Security Rules
  const rulesPath = path.resolve('firestore.rules');
  const rulesContent = fs.readFileSync(rulesPath, 'utf-8');

  const requiredCollections = [
    'microbiz_finances',
    'microbiz_inquiries',
    'microbiz_reports',
    'microbiz_posts',
    'microbiz_courses',
    'microbiz_enrollments',
    'microbiz_businesses',
    'microbiz_groups',
    'microbiz_projects',
    'microbiz_profiles'
  ];

  for (const col of requiredCollections) {
    assert(
      rulesContent.includes(`match /${col}/`),
      `firestore.rules contains secure match definition for ${col}`
    );
  }

  assert(
    rulesContent.includes('resource.data.userId == request.auth.uid'),
    'firestore.rules enforces authenticated user ownership on private records'
  );

  // 4. Server-Side AI and OCR Endpoints
  const serverPath = path.resolve('server.impl.ts');
  const serverContent = fs.readFileSync(serverPath, 'utf-8');

  assert(
    serverContent.includes("app.post('/api/microbiz/ai/generate-course'"),
    'Server defines /api/microbiz/ai/generate-course route'
  );

  assert(
    serverContent.includes("app.post('/api/microbiz/ai/generate-copy'"),
    'Server defines /api/microbiz/ai/generate-copy route'
  );

  assert(
    serverContent.includes("app.post('/api/microbiz/ai/generate-business-plan'"),
    'Server defines /api/microbiz/ai/generate-business-plan route'
  );

  assert(
    serverContent.includes("app.post('/api/microbiz/ocr/extract-document'"),
    'Server defines /api/microbiz/ocr/extract-document route'
  );

  assert(
    serverContent.includes('isGenuineAi: true') && serverContent.includes('isHeuristicFallback: true'),
    'Server distinguishes genuine AI results from heuristic fallbacks'
  );

  assert(
    !serverContent.includes('course: parsed,') && !serverContent.includes('copy: parsed,'),
    'Server does not have undefined parsed variables in MicroBiz routes'
  );

  // 5. Payment Processing Disabled & Disclosure Verified
  const marketplacePath = path.resolve('src/components/microbiz/components/MarketplaceView.tsx');
  const marketplaceContent = fs.readFileSync(marketplacePath, 'utf-8');

  assert(
    marketplaceContent.includes('Payment Disclosure') && marketplaceContent.includes('disabled'),
    'MarketplaceView renders mandatory payment disclosure indicating checkout is disabled'
  );

  const operationsPath = path.resolve('src/components/microbiz/components/OperationsView.tsx');
  const operationsContent = fs.readFileSync(operationsPath, 'utf-8');

  assert(
    operationsContent.includes('Payment Disclosure') || operationsContent.includes('Cổng thanh toán thẻ tự động bị tắt'),
    'OperationsView renders payment policy disclosure'
  );

  assert(
    !operationsContent.includes('alert('),
    'OperationsView does not invoke window.alert (environment constraint)'
  );

  // 6. Navigation and Applet Mount Invariants
  const appPath = path.resolve('src/App.tsx');
  const appContent = fs.readFileSync(appPath, 'utf-8');

  assert(
    appContent.includes("<MicroBizApp currentLanguage={currentLanguage} />"),
    'MicroBizApp is mounted inside activeTab === "microbiz" in App.tsx'
  );

  const navbarPath = path.resolve('src/components/layout/Navbar.tsx');
  const navbarContent = fs.readFileSync(navbarPath, 'utf-8');

  assert(
    navbarContent.includes("{ id: 'microbiz', label: 'MicroBiz'"),
    'MicroBiz is registered in main navigation bar navItems'
  );

  console.log('\n----------------------------------------------------');
  console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('----------------------------------------------------');

  if (failed > 0) {
    process.exit(1);
  }
}

runMicroBizTests();
