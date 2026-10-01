# HCS Provenance Anchoring Pattern (Hedera Harness)

## Intent
Anchor an immutable, timestamped cryptographic proof of an arbitrary off-chain artifact (research paper, AI model weights, dataset, or health protocol) onto Hedera Consensus Service without exposing underlying data.

## Pattern Definition

```typescript
import { 
  Client, 
  TopicMessageSubmitTransaction, 
  TopicId 
} from '@hashgraph/sdk';

// 1. Compute canonical SHA-256 digest of artifact
const digest = computeSha256(artifactContent).hash;

// 2. Prepare standardized HCS message payload (drt.provenance.v1)
const hcsPayload = {
  schema: 'drt.provenance.v1',
  artifactId: 'art-001',
  artifactType: 'research',
  artifactTitle: 'Longitudinal Longevity Invariants',
  version: '1.0.0',
  contentHash: digest,
  hashAlgorithm: 'SHA-256',
  timestamp: new Date().toISOString(),
  platform: 'Dr. T',
  privacyClassification: 'PUBLIC'
};

// 3. Submit transaction to HCS topic
const tx = new TopicMessageSubmitTransaction()
  .setTopicId(TopicId.fromString(topicIdStr))
  .setMessage(JSON.stringify(hcsPayload));

const response = await tx.execute(client);
const receipt = await response.getReceipt(client);

// 4. Capture consensus attributes
const sequenceNumber = receipt.topicSequenceNumber.toNumber();
const consensusTimestamp = receipt.topicRunningHash 
  ? new Date().toISOString() 
  : `${Date.now() / 1000}`;
```

## Invariants
1. `contentHash` must always be lowercase 64-character hexadecimal SHA-256.
2. Raw data or confidential notes must never appear in `setMessage()`.
3. Client must enforce max transaction fee (e.g. `2 HBAR`).
