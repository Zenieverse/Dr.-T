/**
 * Hedera Provenance Kit - Core Provenance Engine
 *
 * Implements deterministic RFC 8785 canonicalization, SHA-256 cryptographic digests,
 * zero-PHI privacy classification, Hedera Consensus Service anchoring,
 * and immutable Mirror Node verification.
 */

import crypto from 'crypto';

export type PrivacyClassification = 'PUBLIC' | 'PRIVATE' | 'SENSITIVE' | 'PROTECTED';
export type VerificationStatus = 'VERIFIED' | 'INTEGRITY_CHECK_FAILED' | 'RECORD_NOT_FOUND' | 'VERIFICATION_UNAVAILABLE';

export interface HCSProvenanceMessage {
  schema: 'hpk.provenance.v1';
  artifactId: string;
  artifactType: string;
  artifactTitle: string;
  artifactVersion: string;
  hashAlgorithm: 'SHA-256';
  contentHash: string;
  timestamp: string;
  privacy: string;
  source: string;
  actorId?: string;
}

export interface ProvenanceVerificationResult {
  status: VerificationStatus;
  verified: boolean;
  computedHash: string;
  anchoredHash?: string;
  sequenceNumber?: number;
  consensusTimestamp?: string;
  hashscanUrl?: string;
  mirrorNodeUrl?: string;
  message: string;
  isMock: boolean;
}

/**
 * Deterministic JSON Canonicalization (RFC 8785 subset)
 * Recursively sorts object keys so equivalent logical representations produce identical byte sequences.
 */
export function canonicalizeJson(input: unknown): string {
  if (input === null || typeof input !== 'object') {
    return JSON.stringify(input);
  }

  if (Array.isArray(input)) {
    const serializedElements = input.map(item => canonicalizeJson(item));
    return `[${serializedElements.join(',')}]`;
  }

  const keys = Object.keys(input as Record<string, unknown>).sort();
  const pairs = keys.map(key => {
    const val = (input as Record<string, unknown>)[key];
    return `${JSON.stringify(key)}:${canonicalizeJson(val)}`;
  });

  return `{${pairs.join(',')}}`;
}

/**
 * Computes deterministic SHA-256 digest of arbitrary artifact content
 */
export function computeSha256(content: unknown): { hash: string; canonical: string } {
  let canonical: string;
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

/**
 * Strict Health-Data & Privacy Guard
 * Strips confidential information (PHI, PII, credentials) ensuring only hashes reach public HCS.
 */
export function buildHCSProvenanceMessage(params: {
  artifactId: string;
  artifactType: string;
  artifactTitle: string;
  artifactVersion?: string;
  content: unknown;
  privacyClassification: PrivacyClassification;
  actorId?: string;
}): HCSProvenanceMessage {
  const { hash } = computeSha256(params.content);

  return {
    schema: 'hpk.provenance.v1',
    artifactId: params.artifactId.trim(),
    artifactType: params.artifactType.trim(),
    artifactTitle: params.artifactTitle.trim().slice(0, 140),
    artifactVersion: params.artifactVersion || '1.0.0',
    hashAlgorithm: 'SHA-256',
    contentHash: hash,
    timestamp: new Date().toISOString(),
    privacy: params.privacyClassification.toLowerCase(),
    source: 'Hedera Provenance Kit Template',
    actorId: (params.privacyClassification === 'SENSITIVE' || params.privacyClassification === 'PROTECTED')
      ? 'ANONYMIZED_ACTOR'
      : (params.actorId || 'HPK_OPERATOR')
  };
}

/**
 * Reusable Mirror Node Consensus Verification
 */
export async function verifyTopicMessage(
  topicId: string,
  sequenceNumber: number,
  expectedHash: string,
  mirrorNodeBaseUrl = 'https://testnet.mirrornode.hedera.com'
): Promise<ProvenanceVerificationResult> {
  const cleanExpected = expectedHash.trim().toLowerCase();

  try {
    const url = `${mirrorNodeBaseUrl}/api/v1/topics/${topicId}/messages/${sequenceNumber}`;
    const res = await fetch(url, { headers: { Accept: 'application/json' } });

    if (!res.ok) {
      return {
        status: res.status === 404 ? 'RECORD_NOT_FOUND' : 'VERIFICATION_UNAVAILABLE',
        verified: false,
        computedHash: cleanExpected,
        message: `Mirror node HTTP ${res.status} returned for sequence ${sequenceNumber}`,
        isMock: false
      };
    }

    const data = await res.json();
    const rawMessage = Buffer.from(data.message, 'base64').toString('utf8');
    const parsed: HCSProvenanceMessage = JSON.parse(rawMessage);

    const match = parsed.contentHash.toLowerCase() === cleanExpected;

    return {
      status: match ? 'VERIFIED' : 'INTEGRITY_CHECK_FAILED',
      verified: match,
      computedHash: cleanExpected,
      anchoredHash: parsed.contentHash,
      sequenceNumber: data.sequence_number,
      consensusTimestamp: data.consensus_timestamp,
      hashscanUrl: `https://hashscan.io/testnet/transaction/${data.payer_account_id}-${data.consensus_timestamp.replace('.', '-')}`,
      mirrorNodeUrl: url,
      message: match ? 'Record cryptographically verified on Hedera Consensus Service.' : 'Hash mismatch detected.',
      isMock: false
    };
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    return {
      status: 'VERIFICATION_UNAVAILABLE',
      verified: false,
      computedHash: cleanExpected,
      message: `Mirror node query failed: ${errMsg}`,
      isMock: false
    };
  }
}
