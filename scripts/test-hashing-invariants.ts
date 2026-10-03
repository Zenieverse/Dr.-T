// ==========================================
// HASHING INVARIANTS TEST (Tests A, B, C)
// Required by Final Validation Gate
// ==========================================

import { canonicalize } from '../src/modules/hedera/utils/canonicalize';
import { hashArtifactSync, verifyHashMatch } from '../src/modules/hedera/services/hashingService';

console.log('🧪 Executing Hashing Invariant Tests (A, B, C)...\n');

let passed = 0;
let total = 0;

function assert(condition: boolean, testName: string) {
  total++;
  if (condition) {
    passed++;
    console.log(`  ✅ PASS: [${testName}]`);
  } else {
    console.error(`  ❌ FAIL: [${testName}]`);
  }
}

// -------------------------------------------------------------
// Test A: Identical canonical artifacts produce identical SHA-256 hashes
// -------------------------------------------------------------
const artifact1 = {
  id: "art-research-sleep-01",
  title: "Longitudinal Slow-Wave Sleep Architecture",
  version: "1.0.0",
  metrics: { deepSleepPct: 22.4, remSleepPct: 24.1, hrvMs: 68 }
};

const artifact1Duplicate = {
  id: "art-research-sleep-01",
  title: "Longitudinal Slow-Wave Sleep Architecture",
  version: "1.0.0",
  metrics: { deepSleepPct: 22.4, remSleepPct: 24.1, hrvMs: 68 }
};

const hash1A = hashArtifactSync(artifact1).hash;
const hash1B = hashArtifactSync(artifact1Duplicate).hash;

assert(
  hash1A === hash1B && verifyHashMatch(hash1A, hash1B),
  "Test A: Identical canonical artifacts produce identical SHA-256 hashes"
);

// -------------------------------------------------------------
// Test B: Changing one meaningful field produces a different hash
// -------------------------------------------------------------
const artifactModified = {
  ...artifact1,
  metrics: { ...artifact1.metrics, hrvMs: 69 } // Changed single value from 68 to 69
};

const hashModified = hashArtifactSync(artifactModified).hash;

assert(
  hash1A !== hashModified,
  "Test B: Changing one meaningful field produces a different hash"
);

// -------------------------------------------------------------
// Test C: Key ordering produces identical hash
// -------------------------------------------------------------
const artifactUnordered = {
  metrics: { hrvMs: 68, remSleepPct: 24.1, deepSleepPct: 22.4 }, // inverted nested keys
  version: "1.0.0",
  title: "Longitudinal Slow-Wave Sleep Architecture",
  id: "art-research-sleep-01" // inverted top-level keys
};

const canonA = canonicalize(artifact1);
const canonC = canonicalize(artifactUnordered);
const hashUnordered = hashArtifactSync(artifactUnordered).hash;

assert(
  canonA === canonC && hash1A === hashUnordered,
  "Test C: Different JSON key orderings produce identical canonical serialization & SHA-256 hash"
);

console.log(`\n==========================================`);
console.log(`Hashing Invariant Results: ${passed}/${total} Passed (${((passed / total) * 100).toFixed(1)}%)`);
console.log(`==========================================\n`);

if (passed !== total) {
  process.exit(1);
}
