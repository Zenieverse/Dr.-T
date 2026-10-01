// ==========================================
// HEDERA COMMONS: TEST SUITE
// Automated Verification of Core Cases (1 - 7)
// ==========================================

import { computeSha256, verifyHashMatch, canonicalizeJson } from '../src/modules/hedera/canonicalizer';
import { enforcePrivacyPolicy } from '../src/modules/hedera/privacyFilter';
import { provenanceStore } from '../src/modules/hedera/provenanceStore';
import { hederaService } from '../src/modules/hedera/hederaService';
import { hederaMirrorNodeService } from '../src/modules/hedera/mirrorNodeService';

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: [Case ${totalTests}] ${testName}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: [Case ${totalTests}] ${testName}`);
    if (detail) console.error(`     Detail: ${detail}`);
  }
}

async function runTestSuite() {
  console.log('🧪 Executing Hedera Commons Test Suite (Cases 1 - 7)...\n');

  // Case 1: Same artifact -> same hash (Determinism & Canonicalization)
  const artifactA = {
    title: "Quantum Circadian Dynamics",
    version: "1.0",
    tags: ["biology", "quantum", "sleep"],
    author: "Dr. T"
  };
  const artifactA_reordered = {
    author: "Dr. T",
    tags: ["biology", "quantum", "sleep"],
    title: "Quantum Circadian Dynamics",
    version: "1.0"
  };
  const hash1A = computeSha256(artifactA).hash;
  const hash1B = computeSha256(artifactA_reordered).hash;
  assert(
    hash1A === hash1B && verifyHashMatch(hash1A, hash1B),
    'Same artifact produces identical SHA-256 hash regardless of object key order (RFC 8785 Canonicalization)',
    `hash1A: ${hash1A}, hash1B: ${hash1B}`
  );

  // Case 2: Modified artifact -> different hash (Tamper Evidence)
  const artifactModified = {
    ...artifactA,
    version: "1.0.1" // Single character modification
  };
  const hash2 = computeSha256(artifactModified).hash;
  assert(
    hash1A !== hash2,
    'Modified artifact produces distinctly different SHA-256 hash (Avalanche / Collision Resistance)',
    `Expected difference, got equal hashes: ${hash1A}`
  );

  // Case 3: Private data -> never included in Hedera payload (Zero-PHI Guard)
  const sensitiveClinicalPayload = {
    patientName: "John Doe",
    mrn: "MRN-998877",
    dob: "1980-01-01",
    diagnosis: "Severe Refractory Fatigue ICD-10 R53.83",
    serumFerritin: 12
  };
  const privacyCheck = enforcePrivacyPolicy({
    artifactId: "art-patient-record-001",
    artifactType: "document",
    artifactTitle: "Clinical Consultation Summary",
    version: "1.0.0",
    contentHash: computeSha256(sensitiveClinicalPayload).hash,
    privacyClassification: "SENSITIVE",
    actorId: "DR_T_CLINICIAN",
    rawContent: sensitiveClinicalPayload
  });
  
  const serializedOnChainMsg = JSON.stringify(privacyCheck.sanitizedMessage);
  const containsPhi = (
    serializedOnChainMsg.includes('John Doe') ||
    serializedOnChainMsg.includes('MRN-998877') ||
    serializedOnChainMsg.includes('Severe Refractory Fatigue')
  );
  assert(
    privacyCheck.allowed && !containsPhi && privacyCheck.sanitizedMessage.privacyClassification === 'SENSITIVE',
    'Strict Zero-PHI Barrier: Sensitive clinical fields stripped from HCS on-chain payload, only SHA-256 digest remains',
    `On-chain message leaked sensitive text: ${serializedOnChainMsg}`
  );

  // Case 4: Valid Hedera record -> VERIFIED
  const regResult = await provenanceStore.register({
    artifactId: "art-test-verified-case4",
    artifactType: "research",
    artifactTitle: "Longitudinal Cellular Longevity Invariant Protocol",
    artifactVersion: "1.0.0",
    content: "Canonical empirical longevity dataset v1",
    privacyClassification: "PUBLIC"
  });

  const verifySuccess = await provenanceStore.verify({
    recordId: regResult.record.id,
    content: "Canonical empirical longevity dataset v1"
  });
  assert(
    verifySuccess.status === 'VERIFIED' && verifySuccess.hashesMatch === true,
    'Valid Hedera record verification returns VERIFIED status with matching hashes',
    `Status: ${verifySuccess.status}, message: ${verifySuccess.message}`
  );

  // Case 5: Hash mismatch -> INTEGRITY CHECK FAILED
  const verifyMismatch = await provenanceStore.verify({
    recordId: regResult.record.id,
    content: "Tampered / Modified content that was NOT anchored"
  });
  assert(
    verifyMismatch.status === 'INTEGRITY_CHECK_FAILED' && verifyMismatch.hashesMatch === false,
    'Hash mismatch correctly triggers INTEGRITY_CHECK_FAILED with audible failure status',
    `Expected INTEGRITY_CHECK_FAILED, got: ${verifyMismatch.status}`
  );

  // Case 6: No Hedera configuration -> safe configuration state
  const status = await hederaService.getStatus();
  assert(
    status.network !== undefined && status.topicId.length > 0 && status.connectionDetails.notice.length > 0,
    'Safe configuration handling: Default unconfigured environment falls back gracefully to sandbox status',
    `Status received: ${JSON.stringify(status)}`
  );

  // Case 7: Mock mode -> clearly marked as mock, never presented as real blockchain activity
  assert(
    status.mode === 'mock' ? (status.connectionDetails.isMock === true && regResult.record.hashscanUrl === null) : true,
    'Development / Mock Mode clearly identifies itself and strictly avoids generating fake Hashscan URLs',
    `isMock: ${status.connectionDetails.isMock}, hashscanUrl: ${regResult.record.hashscanUrl}`
  );

  console.log('\n==========================================');
  console.log(`Test Results: ${passedTests}/${totalTests} Passed (${((passedTests / totalTests) * 100).toFixed(1)}%)`);
  console.log('==========================================');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runTestSuite().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
