// ==========================================
// HEDERA PROVENANCE KIT: LIVE TESTNET BROADCAST
// Executes a genuine on-chain HCS provenance transaction
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
import { computeSha256 } from '../lib/hashing';
import { verifyProvenance } from '../lib/mirrorNode';
import { HPKProvenancePayload } from '../lib/types';

async function main() {
  console.log('🚀 ===============================================================');
  console.log('   HEDERA PROVENANCE KIT: LIVE TESTNET PROVENANCE BROADCAST');
  console.log('=================================================================\n');

  // Load credentials securely
  let devEnv: Record<string, string> = {};
  const possiblePaths = [
    path.join(process.cwd(), '../.dev.env.json'),
    path.join(process.cwd(), '.dev.env.json'),
    path.join(__dirname, '../../../../.dev.env.json'),
    path.join(__dirname, '../../../../../.dev.env.json')
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      try {
        devEnv = JSON.parse(fs.readFileSync(p, 'utf8'));
        break;
      } catch {
        // continue
      }
    }
  }

  let accountIdStr = (devEnv.HEDERA_CLIENT_ACCOUNT_ID || devEnv.HEDERA_ACCOUNT_ID || process.env.HEDERA_ACCOUNT_ID || '').trim();
  if (!/^\d+\.\d+\.\d+$/.test(accountIdStr)) {
    accountIdStr = '0.0.6399349';
  }

  let privateKeyStr = (devEnv.HEDERA_CLIENT_PRIVATE_KEY || devEnv.HEDERA_PRIVATE_KEY || process.env.HEDERA_PRIVATE_KEY || '').trim();
  if (privateKeyStr.startsWith('MIGf') && devEnv.HEDERA_CLIENT_PRIVATE_KEY) {
    privateKeyStr = devEnv.HEDERA_CLIENT_PRIVATE_KEY.trim();
  }

  const topicIdStr = '0.0.10818730';

  if (!privateKeyStr) {
    throw new Error('Missing private key for live broadcast.');
  }

  console.log(`📡 Hedera Network: TESTNET`);
  console.log(`👤 Operator Account: ${accountIdStr}`);
  console.log(`🎯 Target HCS Topic: ${topicIdStr}`);

  // Public non-sensitive artifact for Hedera Provenance Kit
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

  const { hash: contentHash, byteLength } = computeSha256(testArtifact);
  console.log(`🔒 Computed SHA-256 Digest: ${contentHash}`);
  console.log(`📦 Byte length: ${byteLength} bytes`);

  // Build minimal on-chain provenance message
  const payload: HPKProvenancePayload = {
    schema: "hpk.provenance.v1",
    artifactId: "hpk-canonical-template-v1",
    artifactType: "code",
    artifactTitle: "Hedera Provenance Kit Community Scaffold-HBAR Template Specification",
    artifactVersion: "1.0.0",
    hashAlgorithm: "SHA-256",
    contentHash,
    timestamp: new Date().toISOString(),
    privacy: "public-provenance",
    source: "Hedera Provenance Kit Template",
    actorId: "HPK_CORE_ENGINE"
  };

  const payloadString = JSON.stringify(payload);

  // Initialize Hedera SDK
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

  console.log('\n⏳ Submitting TopicMessageSubmitTransaction to Hedera Testnet...');
  const tx = new TopicMessageSubmitTransaction()
    .setTopicId(TopicId.fromString(topicIdStr))
    .setMessage(payloadString);

  const txResponse = await tx.execute(client);
  const receipt = await txResponse.getReceipt(client);

  const rawTxId = txResponse.transactionId.toString();
  const formattedTxId = rawTxId.replace('@', '-').replace(/\.(\d{9})$/, '-$1');
  const sequenceNumber = receipt.topicSequenceNumber ? receipt.topicSequenceNumber.toNumber() : 0;
  const hashscanUrl = `https://hashscan.io/testnet/transaction/${formattedTxId}`;

  console.log('✅ Real HCS Transaction Confirmed by Hedera Consensus!');
  console.log(`   Transaction ID: ${rawTxId}`);
  console.log(`   Topic Sequence Number: #${sequenceNumber}`);
  console.log(`   Hashscan Explorer: ${hashscanUrl}`);

  // Query Mirror Node to independently verify
  console.log('\n⏳ Querying Hedera Mirror Node for consensus verification...');
  let mirrorVerified = false;
  let consensusTimestamp = `${Date.now() / 1000}`;

  for (let attempt = 1; attempt <= 6; attempt++) {
    console.log(`   [Attempt ${attempt}/6] Polling Mirror Node for topic message #${sequenceNumber}...`);
    await new Promise(r => setTimeout(r, 2500));
    try {
      const vResult = await verifyProvenance({
        topicId: topicIdStr,
        sequenceNumber,
        expectedHash: contentHash,
        network: 'testnet',
        transactionId: rawTxId,
        artifactId: payload.artifactId
      });

      if (vResult.status === 'VERIFIED') {
        mirrorVerified = true;
        consensusTimestamp = vResult.consensusTimestamp || consensusTimestamp;
        console.log('✅ Mirror Node verified! Cryptographic hash match confirmed on-chain!');
        break;
      }
    } catch (err: any) {
      console.log(`   Mirror query retry (${err.message})...`);
    }
  }

  client.close();

  if (!mirrorVerified) {
    throw new Error('Mirror node verification timed out or hash mismatch.');
  }

  // Save evidence
  const evidenceDir = path.join(process.cwd(), '../../docs/evidence');
  if (!fs.existsSync(evidenceDir)) {
    fs.mkdirSync(evidenceDir, { recursive: true });
  }

  const evidence = {
    title: "CANONICAL HEDERA TESTNET PROVENANCE PROOF — Hedera Provenance Kit",
    network: "testnet",
    artifactId: payload.artifactId,
    artifactType: payload.artifactType,
    artifactVersion: payload.artifactVersion,
    artifactTitle: payload.artifactTitle,
    hashAlgorithm: "SHA-256",
    contentHash,
    topicId: topicIdStr,
    sequenceNumber,
    transactionId: rawTxId,
    formattedTransactionId: formattedTxId,
    consensusTimestamp,
    mirrorNodeEndpoint: `https://testnet.mirrornode.hedera.com/api/v1/topics/${topicIdStr}/messages/${sequenceNumber}`,
    mirrorNodeVerification: "PASS",
    hashVerification: "PASS",
    applicationVerification: "PASS",
    hashscanUrl,
    verificationStatus: "VERIFIED",
    broadcastTimestamp: new Date().toISOString(),
    isCanonicalTemplateProof: true
  };

  const evidencePath = path.join(evidenceDir, 'canonical-testnet-proof.json');
  fs.writeFileSync(evidencePath, JSON.stringify(evidence, null, 2));
  console.log(`📄 Evidence updated at: ${evidencePath}\n`);

  console.log('===============================================================');
  console.log('🏁 RESULT: LIVE TESTNET PROVENANCE VERIFIED SUCCESSFULLY');
  console.log('===============================================================');
}

main().catch(err => {
  console.error('❌ Broadcast Failure:', err);
  process.exit(1);
});
