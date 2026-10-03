// ==========================================
// HEDERA COMMONS: PROVENANCE TYPES
// Fully harmonized with DrTProvenanceRecord
// ==========================================

import { HederaNetwork } from '../types';

export type ArtifactType = 
  | 'research'
  | 'knowledge'
  | 'ai_model'
  | 'ai_evaluation'
  | 'ai-model'
  | 'ai-evaluation'
  | 'dataset'
  | 'document'
  | 'code'
  | 'greenieverse'
  | 'other';

export type ProvenanceArtifactType = ArtifactType;

export type PrivacyClassification = 
  | 'PUBLIC'
  | 'INTERNAL'
  | 'PRIVATE'
  | 'SENSITIVE'
  | 'PROTECTED'
  | 'public'
  | 'internal'
  | 'private'
  | 'sensitive'
  | 'protected';

export type VerificationStatus = 
  | 'VERIFIED'
  | 'INTEGRITY_CHECK_FAILED'
  | 'RECORD_NOT_FOUND'
  | 'VERIFICATION_UNAVAILABLE'
  | 'verified'
  | 'mismatch'
  | 'not-found'
  | 'unavailable';

export type TransactionState = 
  | 'IDLE'
  | 'PREPARING'
  | 'SUBMITTING'
  | 'PENDING'
  | 'CONFIRMED'
  | 'FAILED'
  | 'idle'
  | 'preparing'
  | 'submitting'
  | 'pending'
  | 'confirmed'
  | 'failed';

export interface ProvenanceRecord {
  id: string;
  schemaVersion: 'drt.provenance.v1' | string;
  artifactId: string;
  artifactType: ArtifactType;
  artifactTitle: string;
  artifactVersion: string;
  contentHash: string;
  hashAlgorithm: 'SHA-256';
  canonicalSerialization: string;
  createdAt: string;
  actorId?: string;
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
  isMock?: boolean;
  metadata?: {
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

export type DrTProvenanceRecord = ProvenanceRecord;

export interface HederaProvenancePayload {
  schema: 'drt.provenance.v1';
  artifactId: string;
  artifactType: string;
  artifactTitle: string;
  version: string;
  contentHash: string;
  hashAlgorithm: 'SHA-256';
  timestamp: string;
  platform: 'Dr. T';
  privacyClassification?: PrivacyClassification;
  actorId?: string;
}

export interface RegisterProvenanceRequest {
  artifactId: string;
  artifactType: ArtifactType;
  artifactTitle: string;
  artifactVersion?: string;
  content: string | Record<string, unknown> | unknown;
  privacyClassification: PrivacyClassification;
  actorId?: string;
  metadata?: Record<string, unknown>;
}

export interface VerifyProvenanceRequest {
  recordId?: string;
  artifactId?: string;
  content?: string | Record<string, unknown> | unknown;
  expectedHash?: string;
}

export interface VerificationResult {
  status: VerificationStatus;
  recordId: string | null;
  artifactId: string;
  localHash: string;
  anchoredHash: string | null;
  hashesMatch: boolean;
  network?: HederaNetwork;
  topicId?: string | null;
  transactionId?: string | null;
  consensusTimestamp?: string | null;
  verifiedAt: string;
  message?: string;
  mirrorNodeCheck: {
    queried: boolean;
    consensusVerified: boolean;
    endpointUsed?: string;
    sequenceNumber?: number;
    rawPayload?: unknown;
    error?: string;
  };
}
