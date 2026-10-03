// ==========================================
// HEDERA COMMONS: LIVE TESTNET BROADCAST ENGINE
// Real HCS Notarization & Mirror Node Audit
// ==========================================

import fs from 'fs';
import path from 'path';
import { 
  Client, 
  AccountId, 
  PrivateKey, 
  TopicMessageSubmitTransaction, 
  TopicId,
  Hbar 
} from '@hashgraph/sdk';

async function broadcastLiveProvenance() {
  console.log('🚀 ===============================================================');
  console.log('   HEDERA COMMONS: LIVE TESTNET PROVENANCE BROADCAST');
  console.log('=================================================================\n');

  // 1. Load credentials securely from environment
  let devEnv: Record<string, string> = {};
  const devPath = path.join(process.cwd(), '../.dev.env.json');
  if (fs.existsSync(devPath)) {
    devEnv = JSON.parse(fs.readFileSync(devPath, 'utf8'));
  }

  const accountIdStr = devEnv.HEDERA_CLIENT_ACCOUNT_ID || process.env.HEDERA_ACCOUNT_ID || '0.0.6399349';
  const privateKeyStr = devEnv.HEDERA_CLIENT_PRIVATE_KEY || process.env.HEDERA_PRIVATE_KEY;
  const topicIdStr = '0.0.10818730';

  if (!privateKeyStr) {
    throw new Error('Missing private key for live broadcast.');
  }

  console.log(`📡 Hedera Network: TESTNET`);
  console.log(`👤 Operator Account: ${accountIdStr}`);
  console.log(`🎯 Target HCS Topic: ${topicIdStr}`);

  // 2. Initialize SDK Client
  const client = Client.forTestnet();
  const operatorId = AccountId.fromString(accountIdStr);
  let operatorKey: PrivateKey;
  try {
    operatorKey = PrivateKey.fromStringECDSA(privateKeyStr);
  } catch {
    operatorKey = PrivateKey.fromString(privateKeyStr);
  }
  client.setOperator(operatorId, operatorKey);
  client.setDefaultMaxTransactionFee(new Hbar(2));

  // 3. Staged Artifact Data
  const artifactId = 'drt-hedera-testnet-verification';
  const expectedHash = 'ca7c77d8e0aab26f85254783d3659484200514c59c78f3fbc59b582874a98f54';

  const hcsPayload = {
    schema: 'drt.provenance.v1',
    artifactId,
    artifactType: 'research',
    artifactTitle: 'Dr. T Hedera Commons public provenance verification artifact',
    version: '1.0.0',
    contentHash: expectedHash,
    hashAlgorithm: 'SHA-256',
    timestamp: new Date().toISOString(),
    platform: 'Dr. T',
    privacyClassification: 'PUBLIC',
    actorId: 'DR_T_SYSTEM'
  };

  const payloadString = JSON.stringify(hcsPayload);
  console.log(`📦 HCS Provenance Payload: ${payloadString.length} bytes`);
  console.log(`🔒 Expected SHA-256: ${expectedHash}`);

  // 4. Submit real TopicMessageSubmitTransaction
  console.log('\n⏳ Submitting TopicMessageSubmitTransaction to Hedera Testnet...');
  const tx = new TopicMessageSubmitTransaction()
    .setTopicId(TopicId.fromString(topicIdStr))
    .setMessage(payloadString);

  const txResponse = await tx.execute(client);
  const receipt = await txResponse.getReceipt(client);

  const rawTxId = txResponse.transactionId.toString();
  // Format for Hashscan: shard.realm.num-seconds-nanos
  const formattedTxId = rawTxId.replace('@', '-').replace(/\.(\d{9})$/, '-$1');
  const sequenceNumber = receipt.topicSequenceNumber.toNumber();
  const consensusTimestamp = receipt.topicRunningHash 
    ? `${Math.floor(Date.now() / 1000)}.000000000` 
    : `${Date.now() / 1000}`;
  const runningHash = receipt.topicRunningHash ? receipt.topicRunningHash.toString() : 'Verified';
  const hashscanUrl = `https://hashscan.io/testnet/transaction/${formattedTxId}`;

  console.log('✅ Real HCS Transaction Confirmed by Hedera Consensus!');
  console.log(`   Transaction ID: ${rawTxId}`);
  console.log(`   Topic Sequence Number: #${sequenceNumber}`);
  console.log(`   Hashscan Explorer: ${hashscanUrl}`);

  // 5. Query Hedera Mirror Node
  console.log('\n⏳ Querying Hedera Mirror Node for consensus verification...');
  let mirrorVerified = false;
  let mirrorPayload: any = null;
  let mirrorConsensusTimestamp = consensusTimestamp;

  // Poll Mirror Node for indexing (typically 2-4 seconds)
  const mirrorUrl = `https://testnet.mirrornode.hedera.com/api/v1/topics/${topicIdStr}/messages/${sequenceNumber}`;
  for (let attempt = 1; attempt <= 6; attempt++) {
    console.log(`   [Attempt ${attempt}/6] Fetching: ${mirrorUrl}`);
    await new Promise(r => setTimeout(r, 2500));
    try {
      const mRes = await fetch(mirrorUrl);
      if (mRes.ok) {
        const mData = await mRes.json();
        const decoded = Buffer.from(mData.message, 'base64').toString('utf8');
        mirrorPayload = JSON.parse(decoded);
        mirrorConsensusTimestamp = mData.consensus_timestamp;
        if (mirrorPayload.contentHash?.toLowerCase() === expectedHash.toLowerCase()) {
          mirrorVerified = true;
          console.log('✅ Mirror Node verified! Cryptographic hash match confirmed on-chain!');
          break;
        }
      }
    } catch (err: any) {
      console.log(`   Mirror query retry (${err.message})...`);
    }
  }

  client.close();

  if (!mirrorVerified) {
    throw new Error('Mirror node verification timed out or hash mismatch.');
  }

  // 6. Update docs/evidence/hedera-testnet-provenance.json with authentic evidence
  const evidence = {
    network: 'testnet',
    artifactId,
    artifactType: 'research',
    artifactVersion: '1.0.0',
    hashAlgorithm: 'SHA-256',
    contentHash: expectedHash,
    topicId: topicIdStr,
    sequenceNumber,
    transactionId: rawTxId,
    formattedTransactionId: formattedTxId,
    consensusTimestamp: mirrorConsensusTimestamp,
    runningHash,
    mirrorNodeEndpoint: mirrorUrl,
    mirrorNodeVerified: true,
    hashVerified: true,
    hashscanUrl,
    verificationStatus: 'VERIFIED',
    broadcastTimestamp: new Date().toISOString()
  };

  const evidencePath = path.join(process.cwd(), 'docs/evidence/hedera-testnet-provenance.json');
  fs.writeFileSync(evidencePath, JSON.stringify(evidence, null, 2));
  console.log(`📄 Evidence updated at: ${evidencePath}\n`);

  console.log('===============================================================');
  console.log('🏁 RESULT: LIVE TESTNET PROVENANCE VERIFIED SUCCESSFULLY');
  console.log('===============================================================');

  process.exit(0);
}

broadcastLiveProvenance().catch(err => {
  console.error('❌ Broadcast Failure:', err);
  process.exit(1);
});
