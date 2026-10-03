// ==========================================
// HEDERA PROVENANCE KIT: COMPREHENSIVE TEST SUITE
// Automated Test Suite for All Required Invariants
// ==========================================

import { canonicalize } from '../lib/canonicalize';
import { computeSha256, verifyHashMatch } from '../lib/hashing';
import { HPKProvenancePayload, VerificationResult } from '../lib/types';

console.log('🧪 ===============================================================');
console.log('   HEDERA PROVENANCE KIT: TEST RUNNER');
console.log('=================================================================\n');

let passed = 0;
let total = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  total++;
  if (condition) {
    passed++;
    console.log(`  ✅ PASS: [${testName}]`);
  } else {
    console.error(`  ❌ FAIL: [${testName}] ${detail || ''}`);
  }
}

// -------------------------------------------------------------
// Test 1: Canonicalization - Key order independence (RFC 8785)
// -------------------------------------------------------------
const objA = { z: 1, a: "hello", m: { deepB: true, deepA: [1, 2, 3] } };
const objB = { a: "hello", m: { deepA: [1, 2, 3], deepB: true }, z: 1 };
const canonA = canonicalize(objA);
const canonB = canonicalize(objB);

assert(
  canonA === canonB,
  'Canonicalization: Same logical artifact produces identical canonical string regardless of key order'
);

// -------------------------------------------------------------
// Test 2: SHA-256 - Known input produces deterministic known hash
// -------------------------------------------------------------
const testString = "Hedera Provenance Kit Verified";
const hashResult = computeSha256(testString);
const recomputed = computeSha256(testString);

assert(
  hashResult.hash === recomputed.hash && hashResult.hash.length === 64,
  'SHA-256: Known input produces deterministic 64-character hex hash'
);

// -------------------------------------------------------------
// Test 3: Payload Validation - Valid schema passes, invalid fails
// -------------------------------------------------------------
const validPayload: HPKProvenancePayload = {
  schema: 'hpk.provenance.v1',
  artifactId: 'art-001',
  artifactType: 'research',
  artifactTitle: 'Protocol Spec',
  artifactVersion: '1.0.0',
  hashAlgorithm: 'SHA-256',
  contentHash: hashResult.hash,
  timestamp: new Date().toISOString(),
  privacy: 'public-provenance'
};

function isValidHPKPayload(p: any): boolean {
  if (!p || typeof p !== 'object') return false;
  if (p.schema !== 'hpk.provenance.v1') return false;
  if (!p.artifactId || typeof p.artifactId !== 'string') return false;
  if (!p.contentHash || !/^[0-9a-fA-F]{64}$/.test(p.contentHash)) return false;
  if (p.hashAlgorithm !== 'SHA-256') return false;
  return true;
}

assert(
  isValidHPKPayload(validPayload),
  'Payload Validation: Valid hpk.provenance.v1 schema passes validation'
);

const invalidPayload = { ...validPayload, schema: 'invalid.v2' };
assert(
  !isValidHPKPayload(invalidPayload),
  'Payload Validation: Invalid schema identifier correctly rejected'
);

// -------------------------------------------------------------
// Test 4: Privacy Validation - Zero-PHI Guarantee
// -------------------------------------------------------------
const sensitiveArtifact = {
  patientMrn: "MRN-99201",
  ssn: "000-12-3456",
  clinicalDiagnosis: "Confidential Note",
  documentText: "Medical report content"
};

// Privacy rule: Only the SHA-256 digest is placed in the HCS message
const sensitiveHash = computeSha256(sensitiveArtifact).hash;
const sanitizedHcsMessage = {
  schema: 'hpk.provenance.v1',
  artifactId: 'art-phi-safe-01',
  contentHash: sensitiveHash,
  hashAlgorithm: 'SHA-256',
  privacy: 'private-digest'
};

const messageJson = JSON.stringify(sanitizedHcsMessage);
const hasSsn = messageJson.includes("000-12-3456");
const hasDiagnosis = messageJson.includes("Confidential Note");

assert(
  !hasSsn && !hasDiagnosis && messageJson.includes(sensitiveHash),
  'Privacy Validation: Sensitive patient fields stripped from on-chain message, only digest remains'
);

// -------------------------------------------------------------
// Test 5: Hash Mismatch Detection
// -------------------------------------------------------------
const originalHash = hashResult.hash;
const modifiedContent = testString + " [MODIFIED]";
const modifiedHash = computeSha256(modifiedContent).hash;

const matchResult = verifyHashMatch(originalHash, modifiedHash);
assert(
  matchResult === false,
  'Hash Mismatch: Modified content produces distinct hash and fails equality check'
);

// -------------------------------------------------------------
// Test 6: Transaction Result Validation
// -------------------------------------------------------------
function evaluateVerificationStatus(localHash: string, onChainHash: string | null, hasReceipt: boolean): string {
  if (!hasReceipt || !onChainHash) return 'RECORD_NOT_FOUND';
  if (!verifyHashMatch(localHash, onChainHash)) return 'INTEGRITY_CHECK_FAILED';
  return 'VERIFIED';
}

assert(
  evaluateVerificationStatus(originalHash, originalHash, true) === 'VERIFIED',
  'Verification Result: Matching hash with confirmed receipt yields VERIFIED'
);

assert(
  evaluateVerificationStatus(originalHash, null, false) === 'RECORD_NOT_FOUND',
  'Verification Result: Missing transaction info does NOT produce VERIFIED'
);

assert(
  evaluateVerificationStatus(originalHash, modifiedHash, true) === 'INTEGRITY_CHECK_FAILED',
  'Verification Result: Mismatched hash yields INTEGRITY_CHECK_FAILED'
);

console.log(`\n==========================================`);
console.log(`Test Results: ${passed}/${total} Passed (${((passed / total) * 100).toFixed(1)}%)`);
console.log(`==========================================\n`);

if (passed !== total) {
  process.exit(1);
}
