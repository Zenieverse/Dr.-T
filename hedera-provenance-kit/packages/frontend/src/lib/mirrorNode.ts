// ==========================================
// HEDERA PROVENANCE KIT: MIRROR NODE VERIFIER
// REST-based Independent Consensus Verification
// ==========================================

import { verifyHashMatch } from './hashing';
import { 
  VerificationResult, 
  VerificationStatus, 
  HederaNetwork, 
  HPKProvenancePayload 
} from './types';

export interface VerifyProvenanceParams {
  topicId: string;
  sequenceNumber?: number;
  expectedHash: string;
  network?: HederaNetwork;
  mirrorNodeUrl?: string;
  transactionId?: string;
  artifactId?: string;
}

/**
 * Independently audits cryptographic provenance against the official Hedera Mirror Node
 */
export async function verifyProvenance(params: VerifyProvenanceParams): Promise<VerificationResult> {
  const {
    topicId,
    sequenceNumber,
    expectedHash,
    network = 'testnet',
    mirrorNodeUrl = 'https://testnet.mirrornode.hedera.com',
    transactionId = null,
    artifactId = 'UNKNOWN'
  } = params;

  const nowIso = new Date().toISOString();

  // If no sequence number is supplied, attempt to find latest message for topic
  let url = `${mirrorNodeUrl}/api/v1/topics/${topicId}/messages`;
  if (sequenceNumber !== undefined && sequenceNumber !== null) {
    url = `${mirrorNodeUrl}/api/v1/topics/${topicId}/messages/${sequenceNumber}`;
  } else {
    url = `${mirrorNodeUrl}/api/v1/topics/${topicId}/messages?limit=1&order=desc`;
  }

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return {
        status: 'RECORD_NOT_FOUND',
        hashesMatch: false,
        mirrorNodeVerified: false,
        artifactId,
        localHash: expectedHash,
        anchoredHash: null,
        network,
        topicId,
        transactionId,
        consensusTimestamp: null,
        hashscanUrl: null,
        verifiedAt: nowIso,
        message: `Mirror Node lookup returned HTTP ${res.status}: Message not found on topic ${topicId}`
      };
    }

    const data = await res.json();
    let messageItem = data;
    if (data.messages && Array.isArray(data.messages)) {
      if (data.messages.length === 0) {
        return {
          status: 'RECORD_NOT_FOUND',
          hashesMatch: false,
          mirrorNodeVerified: false,
          artifactId,
          localHash: expectedHash,
          anchoredHash: null,
          network,
          topicId,
          transactionId,
          consensusTimestamp: null,
          hashscanUrl: null,
          verifiedAt: nowIso,
          message: 'No consensus messages indexed for this topic.'
        };
      }
      messageItem = data.messages[0];
    }

    if (!messageItem.message) {
      return {
        status: 'RECORD_NOT_FOUND',
        hashesMatch: false,
        mirrorNodeVerified: false,
        artifactId,
        localHash: expectedHash,
        anchoredHash: null,
        network,
        topicId,
        transactionId,
        consensusTimestamp: null,
        hashscanUrl: null,
        verifiedAt: nowIso,
        message: 'Empty or missing message field in Mirror Node record.'
      };
    }

    // Decode base64 message
    const decodedUtf8 = Buffer.from(messageItem.message, 'base64').toString('utf8');
    let payload: HPKProvenancePayload;
    try {
      payload = JSON.parse(decodedUtf8);
    } catch {
      return {
        status: 'INTEGRITY_CHECK_FAILED',
        hashesMatch: false,
        mirrorNodeVerified: false,
        artifactId,
        localHash: expectedHash,
        anchoredHash: null,
        network,
        topicId,
        transactionId,
        consensusTimestamp: messageItem.consensus_timestamp || null,
        hashscanUrl: null,
        verifiedAt: nowIso,
        message: 'Decoded Mirror Node payload is not valid JSON.'
      };
    }

    // Validate schema
    if (payload.schema !== 'hpk.provenance.v1' && (payload as any).schema !== 'drt.provenance.v1') {
      return {
        status: 'INTEGRITY_CHECK_FAILED',
        hashesMatch: false,
        mirrorNodeVerified: false,
        artifactId: payload.artifactId || artifactId,
        localHash: expectedHash,
        anchoredHash: payload.contentHash || null,
        network,
        topicId,
        transactionId,
        consensusTimestamp: messageItem.consensus_timestamp || null,
        hashscanUrl: null,
        verifiedAt: nowIso,
        message: `Schema mismatch: expected hpk.provenance.v1, got ${(payload as any).schema}`
      };
    }

    const anchoredHash = payload.contentHash || '';
    const hashesMatch = verifyHashMatch(expectedHash, anchoredHash);

    // Format transaction ID for Hashscan
    let hashscanUrl: string | null = null;
    const payerId = messageItem.payer_account_id || (messageItem.chunk_info?.initial_transaction_id?.account_id);
    const validStart = messageItem.chunk_info?.initial_transaction_id?.transaction_valid_start;
    if (payerId && validStart) {
      const formatted = `${payerId}-${validStart.replace('.', '-')}`;
      hashscanUrl = `https://hashscan.io/${network}/transaction/${formatted}`;
    }

    const status: VerificationStatus = hashesMatch ? 'VERIFIED' : 'INTEGRITY_CHECK_FAILED';

    return {
      status,
      hashesMatch,
      mirrorNodeVerified: true,
      artifactId: payload.artifactId || artifactId,
      localHash: expectedHash,
      anchoredHash,
      network,
      topicId,
      transactionId: transactionId || (validStart ? `${payerId}@${validStart}` : null),
      consensusTimestamp: messageItem.consensus_timestamp || null,
      hashscanUrl,
      verifiedAt: nowIso,
      message: hashesMatch
        ? 'VERIFIED: Cryptographic SHA-256 fingerprint matches anchored Hedera Consensus record exactly.'
        : 'INTEGRITY CHECK FAILED: Recomputed hash does NOT match anchored on-chain consensus digest.'
    };

  } catch (err: any) {
    return {
      status: 'MIRROR_NODE_UNAVAILABLE',
      hashesMatch: false,
      mirrorNodeVerified: false,
      artifactId,
      localHash: expectedHash,
      anchoredHash: null,
      network,
      topicId,
      transactionId,
      consensusTimestamp: null,
      hashscanUrl: null,
      verifiedAt: nowIso,
      message: `Mirror Node network error: ${err.message}`
    };
  }
}
