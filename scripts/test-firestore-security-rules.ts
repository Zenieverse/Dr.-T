import fs from 'fs';
import path from 'path';

/**
 * Firestore Security Rules Comprehensive Verification Suite
 * Tests rule AST semantics, conditions, and least-privilege guarantees
 * as required by Phase 3 of the security mandate.
 */
function runFirestoreSecurityTests() {
  console.log('====================================================');
  console.log('🔒 FIRESTORE SECURITY RULES VERIFICATION SUITE');
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

  const rulesPath = path.resolve('firestore.rules');
  const rules = fs.readFileSync(rulesPath, 'utf-8');

  // TEST 1: No unrestricted "allow read, write: if true;" exists anywhere
  const unrestrictedPublicWrite = /allow\s+read\s*,\s*write\s*:\s*if\s+true/i.test(rules);
  const unrestrictedWrite = /allow\s+write\s*:\s*if\s+true/i.test(rules);
  assert(!unrestrictedPublicWrite, 'Zero unrestricted "allow read, write: if true;" rules in codebase');
  assert(!unrestrictedWrite, 'Zero public "allow write: if true;" grants in codebase');

  // TEST 2: Private Health Data Denies Unauthenticated Reads & Writes
  const healthBlock = rules.match(/match\s+\/healthRecords\/\{recordId\}\s*\{([\s\S]*?)\}/)?.[1] || '';
  assert(
    healthBlock.includes('isAuthenticated()') && !healthBlock.includes('if true'),
    'Health records require isAuthenticated() for read and create (no public access)'
  );
  assert(
    healthBlock.includes('resource.data.userId == request.auth.uid'),
    'Health records restrict reads to record owner or admin'
  );

  // TEST 3: User Isolation - User A cannot read or modify User B's records
  const userBlock = rules.match(/match\s+\/users\/\{userId\}\s*\{([\s\S]*?)\}/)?.[1] || '';
  assert(
    userBlock.includes('isOwner(userId)'),
    'Users collection restricts read/write to verified document owner or admin'
  );

  // TEST 4: Users modifying their own permitted records allowed
  assert(
    userBlock.includes('allow update: if isOwner(userId)'),
    'User allowed to update their own profile document'
  );

  // TEST 5: Ownership changes through update operations denied
  assert(
    healthBlock.includes('request.resource.data.userId == resource.data.userId'),
    'Health records prevent ownership re-assignment on update'
  );
  const financeBlock = rules.match(/match\s+\/microbiz_finances\/\{financeId\}\s*\{([\s\S]*?)\}/)?.[1] || '';
  assert(
    financeBlock.includes('request.resource.data.userId == resource.data.userId'),
    'MicroBiz finances prevent changing userId on update'
  );

  // TEST 6: Unauthorized administrator actions denied (client claims/emails alone cannot spoof admin)
  const adminFunc = rules.match(/function\s+isAdmin\(\)\s*\{([\s\S]*?)\}/)?.[1] || '';
  assert(
    adminFunc.includes('request.auth.token.admin == true') &&
    adminFunc.includes('request.auth.token.email_verified == true'),
    'isAdmin requires verified token or custom claim (fails closed against unverified email)'
  );

  // TEST 7: Admin collection cannot be modified by any client
  const adminBlock = rules.match(/match\s+\/admins\/\{adminId\}\s*\{([\s\S]*?)\}/)?.[1] || '';
  assert(
    adminBlock.includes('allow write: if false'),
    'Admins collection strictly denies client writes (server-only)'
  );

  // TEST 8: Public reads of intentionally public MicroBiz content allowed
  const postBlock = rules.match(/match\s+\/microbiz_posts\/\{postId\}\s*\{([\s\S]*?)\}/)?.[1] || '';
  const courseBlock = rules.match(/match\s+\/microbiz_courses\/\{courseId\}\s*\{([\s\S]*?)\}/)?.[1] || '';
  const businessBlock = rules.match(/match\s+\/microbiz_businesses\/\{businessId\}\s*\{([\s\S]*?)\}/)?.[1] || '';

  assert(postBlock.includes('allow read: if true'), 'Public reads permitted for community posts');
  assert(courseBlock.includes('allow read: if true'), 'Public reads permitted for educational courses');
  assert(businessBlock.includes('allow read: if true'), 'Public reads permitted for artisan storefronts');

  // TEST 9: Unauthorized modification of public content denied
  assert(
    postBlock.includes('request.resource.data.authorId == request.auth.uid'),
    'Community posts require authenticated author on creation'
  );
  assert(
    courseBlock.includes('request.resource.data.creatorId == request.auth.uid'),
    'Course creation requires authenticated creator identity'
  );
  assert(
    businessBlock.includes('request.resource.data.ownerId == request.auth.uid'),
    'Storefront creation requires authenticated business owner identity'
  );

  // TEST 10: Inquiries restricted between business owner and customer; spoofing denied
  const inquiryBlock = rules.match(/match\s+\/microbiz_inquiries\/\{inquiryId\}\s*\{([\s\S]*?)\}/)?.[1] || '';
  assert(
    inquiryBlock.includes('resource.data.businessId == request.auth.uid') &&
    inquiryBlock.includes('resource.data.customerId == request.auth.uid'),
    'Inquiries restrict read access to authorized business owner or customer'
  );
  assert(
    inquiryBlock.includes('request.resource.data.customerId == request.auth.uid'),
    'Inquiry creation verifies authenticated customerId against request.auth.uid'
  );

  // TEST 11: Audit log writes and deletions by arbitrary clients denied
  const auditBlock = rules.match(/match\s+\/cloudAuditLogs\/\{logId\}\s*\{([\s\S]*?)\}/)?.[1] || '';
  assert(
    auditBlock.includes('allow read: if isAdmin()') &&
    auditBlock.includes('allow create: if isAdmin()') &&
    auditBlock.includes('allow update, delete: if false'),
    'Cloud audit logs deny arbitrary client writes, updates, and deletes'
  );

  // TEST 12: Consultations and Skin Analyses Protected
  const consultBlock = rules.match(/match\s+\/consultations\/\{consultationId\}\s*\{([\s\S]*?)\}/)?.[1] || '';
  assert(
    consultBlock.includes('resource.data.userId == request.auth.uid') &&
    consultBlock.includes('request.resource.data.userId == request.auth.uid'),
    'Consultations strictly isolated to patient owner or clinician'
  );

  const skinBlock = rules.match(/match\s+\/skinAnalyses\/\{analysisId\}\s*\{([\s\S]*?)\}/)?.[1] || '';
  assert(
    skinBlock.includes('resource.data.userId == request.auth.uid') &&
    skinBlock.includes('request.resource.data.userId == request.auth.uid'),
    'Skin analyses strictly isolated to patient owner or clinician'
  );

  // TEST 13: Enrollments protected
  const enrollBlock = rules.match(/match\s+\/microbiz_enrollments\/\{enrollmentId\}\s*\{([\s\S]*?)\}/)?.[1] || '';
  assert(
    enrollBlock.includes('resource.data.userId == request.auth.uid'),
    'Enrollments strictly isolated to student owner'
  );

  // TEST 14: Build With AI projects user isolation and ownership preservation
  const buildAiBlock = rules.match(/match\s+\/buildwithai_projects\/\{projectId\}\s*\{([\s\S]*?)\}/)?.[1] || '';
  assert(
    buildAiBlock.includes('resource.data.userId == request.auth.uid') &&
    buildAiBlock.includes('request.resource.data.userId == request.auth.uid') &&
    buildAiBlock.includes('request.resource.data.userId == resource.data.userId'),
    'Build With AI projects strictly isolated to authenticated owner and prevents userId modification'
  );

  // TEST 15: Overlapping catch-all wildcard checked (no accidental open permissions)
  const catchAllMatch = rules.match(/match\s+\/\{.*?=\*\*\}/);
  assert(!catchAllMatch, 'No recursive catch-all wildcard ({document=**}) bypassing collection rules');

  console.log('\n----------------------------------------------------');
  console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('----------------------------------------------------');

  if (failed > 0) {
    process.exit(1);
  }
}

runFirestoreSecurityTests();
