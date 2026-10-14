import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

/**
 * Live Firestore Cloud Permissions Verification
 * Connects directly to the live Firebase project/database to verify
 * that security rules are actively enforced on the real Google Cloud backend.
 */
async function testLiveFirestorePermissions() {
  console.log('====================================================');
  console.log('🔥 LIVE FIRESTORE CLOUD PERMISSIONS VERIFICATION');
  console.log('====================================================\n');

  const configPath = path.resolve('firebase-applet-config.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

  console.log(`Target Project: ${config.projectId}`);
  console.log(`Target Database: ${config.firestoreDatabaseId}\n`);

  const app = initializeApp({
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
    messagingSenderId: config.messagingSenderId,
    appId: config.appId
  });

  const db = getFirestore(app, config.firestoreDatabaseId);

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

  // 1. healthRecords unauthenticated read (MUST be DENIED)
  try {
    await getDocs(collection(db, 'healthRecords'));
    assert(false, 'Unauthenticated read to /healthRecords was allowed');
  } catch (err: any) {
    assert(err.code === 'permission-denied', 'Unauthenticated read to /healthRecords strictly DENIED (permission-denied)');
  }

  // 2. users unauthenticated read (MUST be DENIED)
  try {
    await getDocs(collection(db, 'users'));
    assert(false, 'Unauthenticated read to /users was allowed');
  } catch (err: any) {
    assert(err.code === 'permission-denied', 'Unauthenticated read to /users strictly DENIED (permission-denied)');
  }

  // 3. cloudAuditLogs unauthenticated read (MUST be DENIED)
  try {
    await getDocs(collection(db, 'cloudAuditLogs'));
    assert(false, 'Unauthenticated read to /cloudAuditLogs was allowed');
  } catch (err: any) {
    assert(err.code === 'permission-denied', 'Unauthenticated read to /cloudAuditLogs strictly DENIED (permission-denied)');
  }

  // 4. microbiz_finances unauthenticated read (MUST be DENIED)
  try {
    await getDocs(collection(db, 'microbiz_finances'));
    assert(false, 'Unauthenticated read to /microbiz_finances was allowed');
  } catch (err: any) {
    assert(err.code === 'permission-denied', 'Unauthenticated read to /microbiz_finances strictly DENIED (permission-denied)');
  }

  // 5. healthRecords unauthenticated write (MUST be DENIED)
  const probeHealthRef = doc(db, 'healthRecords', `__security_probe_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`);
  try {
    await setDoc(probeHealthRef, { patientId: 'probe', test: 'probe' });
    try {
      const { deleteDoc } = await import('firebase/firestore');
      await deleteDoc(probeHealthRef);
    } catch {}
    assert(false, 'Unauthenticated write to /healthRecords was allowed');
  } catch (err: any) {
    assert(err.code === 'permission-denied', 'Unauthenticated write to /healthRecords strictly DENIED (permission-denied)');
  }

  // 6. microbiz_posts unauthenticated write (MUST be DENIED)
  const probePostRef = doc(db, 'microbiz_posts', `__security_probe_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`);
  try {
    await setDoc(probePostRef, { title: 'probe', __probe: true });
    try {
      const { deleteDoc } = await import('firebase/firestore');
      await deleteDoc(probePostRef);
    } catch {}
    assert(false, 'Unauthenticated write to /microbiz_posts was allowed');
  } catch (err: any) {
    assert(err.code === 'permission-denied', 'Unauthenticated write to /microbiz_posts strictly DENIED (permission-denied)');
  }

  // 7. microbiz_posts public read (MUST be ALLOWED)
  try {
    await getDocs(collection(db, 'microbiz_posts'));
    assert(true, 'Public read to /microbiz_posts permitted for community discovery feed');
  } catch (err: any) {
    assert(false, 'Public read to /microbiz_posts failed unexpectedly', err.message);
  }

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
