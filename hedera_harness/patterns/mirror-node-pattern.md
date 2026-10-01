# Mirror Node REST Verification Pattern (Hedera Harness)

## Intent
Independently audit and verify a provenance record against the decentralized consensus ledger via official Hedera Mirror Nodes without requiring private keys or wallet connections.

## Pattern Definition

```typescript
// 1. Query Mirror Node REST endpoint
const url = `https://testnet.mirrornode.hedera.com/api/v1/topics/${topicId}/messages/${sequenceNumber}`;

const response = await fetch(url, {
  headers: { 'Accept': 'application/json' }
});

if (!response.ok) {
  throw new Error(`Mirror Node returned HTTP ${response.status}`);
}

const data = await response.json();

// 2. Decode base64 payload
const rawMessageString = Buffer.from(data.message, 'base64').toString('utf8');
const anchoredMessage = JSON.parse(rawMessageString);

// 3. Compare anchored contentHash with local recalculated hash
const isVerified = (
  anchoredMessage.contentHash.toLowerCase() === localRecalculatedHash.toLowerCase()
);

if (!isVerified) {
  return { status: 'INTEGRITY_CHECK_FAILED' };
}

return {
  status: 'VERIFIED',
  consensusTimestamp: data.consensus_timestamp,
  runningHash: data.running_hash
};
```

## Invariants
1. Never scrape explorer HTML; always query the official REST API.
2. Mirror Node propagation delay is typically 2–4 seconds after consensus.
3. Network connection failures must return `VERIFICATION_UNAVAILABLE`, never a false success.
