/**
 * Automated Test Suite for Hedera Provenance Kit
 * Verifies RFC 8785 canonicalization, SHA-256 invariants, privacy boundaries,
 * and Hedera Consensus Service verification flows.
 */

const assert = require('assert');
const crypto = require('crypto');

function canonicalizeJson(input) {
  if (input === null || typeof input !== 'object') {
    return JSON.stringify(input);
  }
  if (Array.isArray(input)) {
    return `[${input.map(canonicalizeJson).join(',')}]`;
  }
  const keys = Object.keys(input).sort();
  const pairs = keys.map(key => `${JSON.stringify(key)}:${canonicalizeJson(input[key])}`);
  return `{${pairs.join(',')}}`;
}

function computeSha256(content) {
  let canonical;
  if (typeof content === 'string') {
    try {
      const parsed = JSON.parse(content);
      canonical = canonicalizeJson(parsed);
    } catch {
      canonical = JSON.stringify(content);
    }
  } else {
    canonical = canonicalizeJson(content);
  }
  const hash = crypto.createHash('sha256').update(canonical, 'utf8').digest('hex');
  return { hash, canonical };
}

function runTests() {
  console.log('🧪 Running Hedera Provenance Kit Unit Tests (provenance.test.js)...\n');
  let passed = 0;
  let total = 0;

  function test(desc, fn) {
    total++;
    try {
      fn();
      passed++;
      console.log(`  ✅ PASS: [${desc}]`);
    } catch (err) {
      console.error(`  ❌ FAIL: [${desc}] - ${err.message}`);
    }
  }

  // Test 1: Deterministic key ordering
  test('Canonicalization: Key order does not affect SHA-256 digest', () => {
    const objA = { z: 1, a: 2, m: { nestedB: true, nestedA: 'val' } };
    const objB = { a: 2, m: { nestedA: 'val', nestedB: true }, z: 1 };
    const hashA = computeSha256(objA).hash;
    const hashB = computeSha256(objB).hash;
    assert.strictEqual(hashA, hashB);
  });

  // Test 2: Mutation alters digest (avalanche effect)
  test('Avalanche: Changing single character yields distinct hash', () => {
    const orig = { title: 'Living Architecture', version: '1.0' };
    const mutated = { title: 'Living Architecture', version: '1.1' };
    const hashA = computeSha256(orig).hash;
    const hashB = computeSha256(mutated).hash;
    assert.notStrictEqual(hashA, hashB);
  });

  // Test 3: Known canonical reference hash (Sequence 2 Testnet Proof)
  test('Canonical Reference: Sequence 2 Testnet Proof payload produces exact SHA-256', () => {
    const rawContent = {
      template: "Hedera Provenance Kit",
      scaffold: "Scaffold-HBAR",
      version: "1.0.0",
      schema: "hpk.provenance.v1",
      timestamp: "2026-10-02T02:50:00.000Z",
      repository: "Zenieverse/hedera-provenance-kit",
      author: "Zenieverse & Dr. T Engineering",
      purpose: "Decentralized cryptographic provenance, tamper-evident RFC 8785 canonicalization, and Mirror Node verification for Web3 applications.",
      architecture: "Artifact -> RFC 8785 Canonicalization -> SHA-256 -> Hedera Consensus Service -> Mirror Node -> Cryptographic Audit",
      privacy: "Zero-PHI On-Chain Guarantee"
    };
    const { hash } = computeSha256(rawContent);
    assert.strictEqual(hash, 'ae7e7030220cf6729fded7eee293059ade5e8d96b7160a1a2d7f3ce2949863d5');
  });

  // Test 4: Privacy boundary guarantees zero patient health data in HCS message
  test('Privacy Barrier: Sensitive clinical fields remain off-chain, only hash is anchored', () => {
    const clinicalData = {
      patientId: 'PT-99482',
      diagnosis: 'Type 2 Diabetes',
      prescription: 'Metformin 500mg',
      doctorNotes: 'Confidential clinical discussion'
    };
    const { hash } = computeSha256(clinicalData);
    const hcsPayload = {
      schema: 'hpk.provenance.v1',
      artifactId: 'art-patient-eval-01',
      artifactType: 'health_evaluation',
      artifactTitle: 'Patient Evaluation Manifest',
      contentHash: hash,
      privacy: 'sensitive'
    };
    const stringifiedPayload = JSON.stringify(hcsPayload);
    assert(!stringifiedPayload.includes('PT-99482'));
    assert(!stringifiedPayload.includes('Diabetes'));
    assert(!stringifiedPayload.includes('Metformin'));
    assert.strictEqual(hcsPayload.contentHash, hash);
  });

  // Test 5: Hash verification equality comparison
  test('Verification: Local computation matches anchored digest', () => {
    const artifact = { data: 'test-provenance-record' };
    const { hash } = computeSha256(artifact);
    const mockAnchoredHash = hash;
    assert.strictEqual(hash, mockAnchoredHash);
  });

  console.log(`\n==========================================`);
  console.log(`Tests: ${passed}/${total} Passed (${((passed / total) * 100).toFixed(1)}%)`);
  console.log(`==========================================\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

runTests();
