import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

/**
 * Live Firestore Permissions Verification Suite
 * Connects directly to the live Firebase project/database or Emulator
 * to verify that security rules are actively enforced on the real backend.
 *
 * Safety Principles:
 * 1. Supports Emulator if FIRESTORE_EMULATOR_HOST is defined.
 * 2. Unauthenticated write probes use synthetic non-patient markers only.
 * 3. Unexpected successful writes immediately trigger a fatal security violation.
 * 4. Cleanup failures are NEVER silently ignored; they trigger explicit test failures.
 * 5. Supports SKIP_LIVE_WRITE_PROBE=true for strictly read-only production audits.
 */
async function testLiveFirestorePermissions() {
  console.log('====================================================');
  console.log('🔥 FIRESTORE PERMISSIONS VERIFICATION');
  console.log('====================================================\n');

  const configPath = path.resolve('firebase-applet-config.json');
  if (!fs.existsSync(configPath)) {
    console.error('❌ Configuration file firebase-applet-config.json not found!');
    process.exit(1);
  }
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

  console.log(`Target Project: ${config.projectId}`);
  console.log(`Target Database: ${config.firestoreDatabaseId}`);

  const app = initializeApp({
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
    messagingSenderId: config.messagingSenderId,
    appId: config.appId
  });

  const db = getFirestore(app, config.firestoreDatabaseId);

  // Connect to emulator if configured
  if (process.env.FIRESTORE_EMULATOR_HOST) {
    const [host, portStr] = process.env.FIRESTORE_EMULATOR_HOST.split(':');
    const port = parseInt(portStr, 10) || 8080;
    const { connectFirestoreEmulator } = await import('firebase/firestore');
    connectFirestoreEmulator(db, host, port);
    console.log(`🔧 Mode: Firebase Firestore Emulator (${host}:${port})\n`);
  } else {
    console.log('🌐 Mode: Live Google Cloud Production Backend\n');
  }

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail = '') {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}${detail ? ` - ${detail}` : ''}`);
      failed++;
    }
  }

  // Helper to test unauthenticated read denial on private collections
  async function testUnauthenticatedReadDenied(collectionName: string, description: string) {
    try {
      await getDocs(collection(db, collectionName));
      assert(false, `Unauthenticated read to /${collectionName} was unexpectedly ALLOWED`);
    } catch (err: any) {
      if (err.code === 'permission-denied') {
        assert(true, `${description} strictly DENIED (permission-denied)`);
      } else {
        assert(false, `${description} received unexpected error`, `${err.code || 'unknown'}: ${err.message}`);
      }
    }
  }

  // Helper to safely probe unauthenticated write denial
  // Ensures:
  // - Zero real patient or production data
  // - Clear non-patient synthetic payload
  // - Unexpected write success triggers explicit test failure
  // - Cleanup failure is NEVER silently swallowed; it triggers an explicit failure
  async function testUnauthenticatedWriteDenied(collectionName: string, description: string) {
    const probeDocId = `security_probe_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const probeRef = doc(db, collectionName, probeDocId);

    // Strictly synthetic probe payload - NO patient data or real entity properties
    const probePayload = {
      isSecurityProbe: true,
      probePurpose: 'security_rules_authorization_check',
      testTimestamp: Date.now()
    };

    let writeSucceeded = false;
    let writeErrorCode: string | null = null;
    let writeErrorMessage: string | null = null;

    try {
      await setDoc(probeRef, probePayload);
      writeSucceeded = true;
    } catch (err: any) {
      writeErrorCode = err.code || 'unknown';
      writeErrorMessage = err.message || String(err);
    }

    if (writeSucceeded) {
      // SECURITY VIOLATION: An unauthenticated client successfully wrote to a protected collection!
      assert(false, `SECURITY VIOLATION: ${description} was unexpectedly ALLOWED`);

      // Attempt cleanup immediately
      try {
        const { deleteDoc } = await import('firebase/firestore');
        await deleteDoc(probeRef);
        console.warn(`⚠️ Warning: Ephemeral probe document /${collectionName}/${probeDocId} was deleted after unexpected write.`);
      } catch (cleanupErr: any) {
        // Cleanup failure is reported as an explicit failure, NEVER ignored
        assert(
          false,
          `CRITICAL CLEANUP FAILURE: Ephemeral probe document /${collectionName}/${probeDocId} could not be deleted`,
          `${cleanupErr.code || cleanupErr.name}: ${cleanupErr.message}`
        );
      }
    } else {
      if (writeErrorCode === 'permission-denied') {
        assert(true, `${description} strictly DENIED (permission-denied)`);
      } else {
        assert(false, `${description} failed with unexpected error code`, `${writeErrorCode}: ${writeErrorMessage}`);
      }
    }
  }

  // Helper to test legitimate public reads
  async function testPublicReadAllowed(collectionName: string, description: string) {
    try {
      await getDocs(collection(db, collectionName));
      assert(true, `${description} permitted`);
    } catch (err: any) {
      assert(false, `${description} failed unexpectedly`, `${err.code || 'unknown'}: ${err.message}`);
    }
  }

  console.log('--- 1. Private Collection Read Authorization ---');
  await testUnauthenticatedReadDenied('healthRecords', 'Unauthenticated read to /healthRecords');
  await testUnauthenticatedReadDenied('users', 'Unauthenticated read to /users');
  await testUnauthenticatedReadDenied('cloudAuditLogs', 'Unauthenticated read to /cloudAuditLogs');
  await testUnauthenticatedReadDenied('microbiz_finances', 'Unauthenticated read to /microbiz_finances');
  await testUnauthenticatedReadDenied('consultations', 'Unauthenticated read to /consultations');
  await testUnauthenticatedReadDenied('skinAnalyses', 'Unauthenticated read to /skinAnalyses');
  await testUnauthenticatedReadDenied('microbiz_reports', 'Unauthenticated read to /microbiz_reports');

  console.log('\n--- 2. Write Authorization Protection ---');
  if (process.env.SKIP_LIVE_WRITE_PROBE === 'true') {
    console.log('ℹ️ SKIP_LIVE_WRITE_PROBE=true: Skipping write probe in live environment to preserve zero-write isolation.');
  } else {
    await testUnauthenticatedWriteDenied('healthRecords', 'Unauthenticated write to /healthRecords');
    await testUnauthenticatedWriteDenied('microbiz_posts', 'Unauthenticated write to /microbiz_posts');
    await testUnauthenticatedWriteDenied('cloudAuditLogs', 'Unauthenticated write to /cloudAuditLogs');
  }

  console.log('\n--- 3. Public Discovery Read Access ---');
  await testPublicReadAllowed('microbiz_posts', 'Public read to /microbiz_posts (community feed)');
  await testPublicReadAllowed('microbiz_courses', 'Public read to /microbiz_courses (educational curricula)');
  await testPublicReadAllowed('microbiz_businesses', 'Public read to /microbiz_businesses (artisan storefronts)');

  console.log('\n----------------------------------------------------');
  console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('----------------------------------------------------');

  try {
    const { terminate } = await import('firebase/firestore');
    await terminate(db);
  } catch {}

  process.exit(failed > 0 ? 1 : 0);
}

testLiveFirestorePermissions().catch(err => {
  console.error('Fatal live test error:', err);
  process.exit(1);
});
