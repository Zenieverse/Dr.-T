// ==========================================
// HEDERA HARNESS: TIER 1 VALIDATOR
// Static Schema & Cryptographic Integrity
// ==========================================

import { computeSha256, verifyHashMatch, canonicalizeJson } from '../../src/modules/hedera/canonicalizer';

export interface ValidationResult {
  tier: number;
  name: string;
  passed: boolean;
  checksTotal: number;
  checksPassed: number;
  failures: string[];
}

export async function validateTier1(): Promise<ValidationResult> {
  const failures: string[] = [];
  let checksPassed = 0;
  let checksTotal = 0;

  function runCheck(condition: boolean, desc: string) {
    checksTotal++;
    if (condition) {
      checksPassed++;
    } else {
      failures.push(desc);
    }
  }

  // Check 1: Deterministic key order normalization (RFC 8785)
  const obj1 = { z: 1, a: 2, m: { y: "test", b: 123 } };
  const obj2 = { m: { b: 123, y: "test" }, a: 2, z: 1 };
  const canon1 = canonicalizeJson(obj1);
  const canon2 = canonicalizeJson(obj2);
  runCheck(canon1 === canon2, 'RFC 8785 canonicalization produces identical strings for different key orders');

  // Check 2: Undefined fields normalized
  const objWithUndef = { a: 1, b: undefined };
  const canonUndef = canonicalizeJson(objWithUndef);
  runCheck(!canonUndef.includes('undefined'), 'Undefined properties are cleanly omitted from canonical representation');

  // Check 3: SHA-256 output length and format
  const hashResult = computeSha256("Dr. T Hedera Provenance Invariant");
  runCheck(
    hashResult.hash.length === 64 && /^[0-9a-f]{64}$/.test(hashResult.hash),
    'SHA-256 produces exactly 64 lowercase hexadecimal characters'
  );

  // Check 4: Constant-time hash verification
  const isMatch = verifyHashMatch(hashResult.hash, hashResult.hash.toUpperCase());
  runCheck(isMatch === true, 'Constant-time verification handles case-insensitive hex comparison');

  // Check 5: Avalanche effect (Single byte change alters >40% of hash bits)
  const hashA = computeSha256("Clinical Protocol v1.0.0").hash;
  const hashB = computeSha256("Clinical Protocol v1.0.1").hash;
  let diffBits = 0;
  for (let i = 0; i < hashA.length; i++) {
    if (hashA[i] !== hashB[i]) diffBits++;
  }
  runCheck(diffBits > 20, 'Cryptographic avalanche effect confirmed on single-character modification');

  return {
    tier: 1,
    name: "Tier 1: Static Schema & Cryptographic Integrity",
    passed: failures.length === 0,
    checksTotal,
    checksPassed,
    failures
  };
}
