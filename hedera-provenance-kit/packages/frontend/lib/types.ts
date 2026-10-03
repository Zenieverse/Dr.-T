// ==========================================
// HEDERA PROVENANCE KIT: CORE DOMAIN TYPES
// Schema: hpk.provenance.v1
// ==========================================

export type HederaNetwork = 'testnet' | 'mainnet' | 'previewnet' | 'mock';

export type ArtifactType = 
  | 'document'
  | 'research'
  | 'ai-model'
  | 'ai-evaluation'
  | 'dataset'
  | 'code'
  | 'certificate'
  | 'other';

export type PrivacyClassification = 
  | 'public-provenance'
  | 'internal-anchor'
  | 'private-digest';

export type VerificationStatus = 
  | 'VERIFIED'
  | 'INTEGRITY_CHECK_FAILED'
  | 'RECORD_NOT_FOUND'
  | 'MIRROR_NODE_UNAVAILABLE';

/**
 * On-chain HCS message payload
 * STRICT ZERO-PHI: Only non-sensitive public provenance metadata is anchored.
 */
export interface HPKProvenancePayload {
  schema: 'hpk.provenance.v1';
  artifactId: string;
  artifactType: ArtifactType | string;
  artifactTitle?: string;
  artifactVersion: string;
  hashAlgorithm: 'SHA-256';
  contentHash: string;
  timestamp: string;
  privacy: PrivacyClassification;
  source?: string;
  actorId?: string;
}

/**
 * Complete Provenance Record stored off-chain with on-chain cryptographic coordinates
 */
export interface ProvenanceRecord {
  id: string;
  schema: 'hpk.provenance.v1';
  artifactId: string;
  artifactType: ArtifactType | string;
  artifactTitle: string;
  artifactVersion: string;
  contentHash: string;
  hashAlgorithm: 'SHA-256';
  canonicalString?: string;
  privacy: PrivacyClassification;
  network: HederaNetwork;
  topicId: string;
  sequenceNumber: number;
  transactionId: string;
  formattedTransactionId: string;
  consensusTimestamp: string;
  runningHash?: string;
  hashscanUrl: string;
  mirrorNodeEndpoint: string;
  verificationStatus: VerificationStatus;
  lastVerifiedAt: string;
  isMock: boolean;
  metadata?: Record<string, unknown>;
}

export interface RegisterProvenanceRequest {
  artifactId: string;
  artifactType: ArtifactType | string;
  artifactTitle: string;
  artifactVersion?: string;
  content: string | Record<string, unknown>;
  privacy?: PrivacyClassification;
  actorId?: string;
  metadata?: Record<string, unknown>;
}

export interface VerifyProvenanceRequest {
  recordId?: string;
  artifactId?: string;
  content?: string | Record<string, unknown>;
  expectedHash?: string;
}

export interface VerificationResult {
  status: VerificationStatus;
  hashesMatch: boolean;
  mirrorNodeVerified: boolean;
  artifactId: string;
  localHash: string;
  anchoredHash: string | null;
  network: HederaNetwork;
  topicId: string | null;
  transactionId: string | null;
  consensusTimestamp: string | null;
  hashscanUrl: string | null;
  verifiedAt: string;
  message: string;
}

export interface HederaStatus {
  status: 'CONNECTED' | 'NOT_CONFIGURED' | 'MOCK_SANDBOX';
  network: HederaNetwork;
  mode: 'real' | 'mock';
  operatorAccountMasked: string;
  topicId: string;
  mirrorNodeUrl: string;
  isMock: boolean;
}
