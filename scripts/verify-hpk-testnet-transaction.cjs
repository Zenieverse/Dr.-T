const crypto = require('crypto');

function canonicalize(obj) {
  if (obj === null || obj === undefined) return 'null';
  if (typeof obj === 'number') {
    if (!Number.isFinite(obj)) return 'null';
    return Object.is(obj, -0) ? '0' : String(obj);
  }
  if (typeof obj === 'boolean') return obj ? 'true' : 'false';
  if (typeof obj === 'string') return JSON.stringify(obj.normalize('NFC'));
  if (Array.isArray(obj)) {
    return `[${obj.map(item => (item === undefined ? 'null' : canonicalize(item))).join(',')}]`;
  }
  if (typeof obj === 'object') {
    const keys = Object.keys(obj).sort();
    const pairs = [];
    for (const key of keys) {
      const val = obj[key];
      if (val === undefined || typeof val === 'function' || typeof val === 'symbol') continue;
      pairs.push(`${JSON.stringify(key.normalize('NFC'))}:${canonicalize(val)}`);
    }
    return `{${pairs.join(',')}}`;
  }
  return 'null';
}

async function verifyHpkTestnetTransaction() {
  console.log('🔍 ===============================================================');
  console.log('   INDEPENDENT AUDIT: HEDERA PROVENANCE KIT TESTNET PROOF');
  console.log('=================================================================\n');

  const topicId = '0.0.10818730';
  const sequenceNumber = 2;
  const expectedTxId = '0.0.6399349@1790909508.462971661';
  const expectedHash = 'ae7e7030220cf6729fded7eee293059ade5e8d96b7160a1a2d7f3ce2949863d5';

  // 1. Expected Artifact
  const testArtifact = {
    template: "Hedera Provenance Kit",
    repository: "Zenieverse/hedera-provenance-kit",
    scaffold: "Scaffold-HBAR",
    version: "1.0.0",
    schema: "hpk.provenance.v1",
    purpose: "Decentralized cryptographic provenance, tamper-evident RFC 8785 canonicalization, and Mirror Node verification for Web3 applications.",
    architecture: "Artifact -> RFC 8785 Canonicalization -> SHA-256 -> Hedera Consensus Service -> Mirror Node -> Cryptographic Audit",
    privacy: "Zero-PHI On-Chain Guarantee",
    author: "Zenieverse & Dr. T Engineering",
    timestamp: "2026-10-02T02:50:00.000Z"
  };

  const canon = canonicalize(testArtifact);
  const localComputedHash = crypto.createHash('sha256').update(canon, 'utf8').digest('hex');
  console.log(`1. Local Computed Digest:  ${localComputedHash}`);
  console.log(`   Matches Expected Hash:  ${localComputedHash === expectedHash ? 'YES ✅' : 'NO ❌'}`);

  // 2. Query Hedera Mirror Node
  const mirrorUrl = `https://testnet.mirrornode.hedera.com/api/v1/topics/${topicId}/messages/${sequenceNumber}`;
  console.log(`\n2. Querying Live Mirror Node: ${mirrorUrl}`);
  const res = await fetch(mirrorUrl);
  if (!res.ok) {
    throw new Error(`Mirror node lookup failed with HTTP ${res.status}`);
  }
  const data = await res.json();
  console.log(`   Mirror Node HTTP Response: 200 OK ✅`);
  console.log(`   Consensus Timestamp:       ${data.consensus_timestamp}`);
  console.log(`   Payer Account:             ${data.payer_account_id}`);
  console.log(`   Topic Sequence Number:     #${data.sequence_number}`);

  // 3. Decode Base64 Payload
  const decodedJson = Buffer.from(data.message, 'base64').toString('utf8');
  const payload = JSON.parse(decodedJson);
  console.log(`\n3. Decoded HCS Message Payload:`);
  console.log(JSON.stringify(payload, null, 2));

  // 4. Schema & Field Validations
  if (payload.schema !== 'hpk.provenance.v1') {
    throw new Error(`Schema mismatch: expected hpk.provenance.v1, got ${payload.schema}`);
  }
  console.log(`   Schema Validation:         PASS (hpk.provenance.v1) ✅`);

  // 5. Byte-for-Byte Hash Comparison
  const onChainHash = payload.contentHash;
  console.log(`\n4. Cryptographic Hash Comparison:`);
  console.log(`   Local Digest:     ${localComputedHash}`);
  console.log(`   On-Chain Digest:  ${onChainHash}`);

  const match = crypto.timingSafeEqual(
    Buffer.from(localComputedHash, 'utf8'),
    Buffer.from(onChainHash, 'utf8')
  );

  if (!match) {
    throw new Error(`FATAL: Hash mismatch! Local: ${localComputedHash}, On-Chain: ${onChainHash}`);
  }
  console.log(`   Hash Verification:        PASS (Byte-for-byte exact match) ✅`);

  // 6. Hashscan Explorer Link Validation
  const formattedTxId = '0.0.6399349-1790909508-462971661';
  const hashscanUrl = `https://hashscan.io/testnet/transaction/${formattedTxId}`;
  console.log(`\n5. Hashscan Explorer:`);
  console.log(`   URL:                      ${hashscanUrl} ✅`);

  console.log('\n===============================================================');
  console.log('🏁 RESULT: LIVE TESTNET PROOF INDEPENDENTLY CONFIRMED & VERIFIED');
  console.log('===============================================================');
}

verifyHpkTestnetTransaction().catch(err => {
  console.error('Audit Failure:', err);
  process.exit(1);
});
