// ==========================================
// HEDERA COMMONS: DOMAIN TYPES & SCHEMAS
// Trust, Provenance & Verification for Dr. T
// ==========================================

export type ArtifactType = 
  | 'research'
  | 'knowledge'
  | 'ai_model'
  | 'ai_evaluation'
  | 'dataset'
  | 'document'
  | 'greenieverse'
  | 'other';

export type PrivacyClassification = 
  | 'PUBLIC'       // Freely verifiable metadata, no confidential content
  | 'INTERNAL'     // Platform-internal record; off-chain storage with cryptographic proof
  | 'PRIVATE'      // Private data; only pure SHA-256 digest on-chain, all attributes stripped
  | 'SENSITIVE';   // Clinical/medical privacy tier: HIPAA/GDPR strict barrier, zero PHI/PII on-chain

export type VerificationStatus = 
  | 'VERIFIED'
  | 'INTEGRITY_CHECK_FAILED'
  | 'RECORD_NOT_FOUND'
  | 'VERIFICATION_UNAVAILABLE';

export type TransactionState = 
  | 'IDLE'
  | 'PREPARING'
  | 'SUBMITTING'
  | 'PENDING'
  | 'CONFIRMED'
  | 'FAILED'
  | 'VERIFICATION_PENDING'
  | 'VERIFIED';

export type HederaNetwork = 'testnet' | 'mainnet' | 'previewnet' | 'mock';

export interface HCSProvenanceMessage {
  schema: 'drt.provenance.v1';
  artifactId: string;
  artifactType: ArtifactType;
  artifactTitle: string;
  version: string;
  contentHash: string;
  hashAlgorithm: 'SHA-256';
  timestamp: string;
  platform: 'Dr. T';
  privacyClassification: PrivacyClassification;
  actorId?: string;
  metadataDigest?: string;
  customProperties?: Record<string, string | number | boolean>;
}

export interface DrTProvenanceRecord {
  id: string; // e.g. prv_1790458123456
  schemaVersion: 'drt.provenance.v1';
  artifactId: string;
  artifactType: ArtifactType;
  artifactTitle: string;
  artifactVersion: string;
  contentHash: string; // Hex-encoded SHA-256
  hashAlgorithm: 'SHA-256';
  canonicalSerialization: string;
  createdAt: string;
  actorId: string;
  privacyClassification: PrivacyClassification;
  network: HederaNetwork;
  topicId: string;
  transactionId: string;
  sequenceNumber: number;
  consensusTimestamp: string;
  runningHash?: string;
  hashscanUrl: string | null;
  verificationStatus: VerificationStatus;
  lastVerifiedAt: string | null;
  isMock: boolean;
  metadata: {
    author?: string;
    department?: string;
    description?: string;
    sourceModule?: string;
    fileSize?: number;
    mimeType?: string;
    tags?: string[];
    [key: string]: unknown;
  };
}

export interface HederaStatusResponse {
  status: 'CONNECTED' | 'NOT_CONFIGURED' | 'CONNECTING' | 'ERROR';
  mode: 'real' | 'mock';
  network: HederaNetwork;
  configured: boolean;
  accountId: string; // Masked if real
  topicId: string;
  mirrorNodeUrl: string;
  hbarBalance: string | null;
  consensusMessagesCount: number;
  lastConsensusTimestamp: string | null;
  connectionDetails: {
    sdkVersion: string;
    isMock: boolean;
    notice: string;
    clientPingMs?: number;
  };
}

export interface RegisterProvenanceRequest {
  artifactId: string;
  artifactType: ArtifactType;
  artifactTitle: string;
  artifactVersion?: string;
  content: string | Record<string, unknown>;
  privacyClassification: PrivacyClassification;
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
  recordId: string | null;
  artifactId: string;
  localHash: string;
  anchoredHash: string | null;
  hashesMatch: boolean;
  network: HederaNetwork;
  topicId: string | null;
  transactionId: string | null;
  consensusTimestamp: string | null;
  verifiedAt: string;
  mirrorNodeCheck: {
    queried: boolean;
    statusCode?: number;
    consensusVerified: boolean;
    rawMirrorResponse?: unknown;
    message?: string;
  };
  isMock: boolean;
  message: string;
}

export interface HederaActivityItem {
  id: string;
  sequenceNumber: number;
  topicId: string;
  transactionId: string;
  consensusTimestamp: string;
  artifactId: string;
  artifactType: ArtifactType;
  artifactTitle: string;
  contentHash: string;
  privacyClassification: PrivacyClassification;
  isMock: boolean;
  hashscanUrl: string | null;
}
