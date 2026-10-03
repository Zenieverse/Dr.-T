// ==========================================
// HEDERA COMMONS: VALIDATION UTILITY
// Input constraints, formats & invariants
// ==========================================

import { ProvenanceArtifactType, PrivacyClassification } from '../types/provenance';
import { HederaNetwork } from '../types/hedera';

export interface ValidationRuleResult {
  valid: boolean;
  errors: string[];
}

export function validateArtifactId(id: string): boolean {
  if (!id || typeof id !== 'string') return false;
  const trimmed = id.trim();
  return trimmed.length >= 3 && trimmed.length <= 128 && /^[a-zA-Z0-9_\-\.:]+$/.test(trimmed);
}

export function validateArtifactType(type: string): boolean {
  const allowed: ProvenanceArtifactType[] = [
    'research',
    'document',
    'dataset',
    'knowledge',
    'ai-model',
    'ai-evaluation',
    'greenieverse',
    'other'
  ];
  return allowed.includes(type.toLowerCase() as ProvenanceArtifactType);
}

export function validateSha256Hash(hash: string): boolean {
  if (!hash || typeof hash !== 'string') return false;
  return /^[0-9a-fA-F]{64}$/.test(hash.trim());
}

export function validateTopicId(topicId: string): boolean {
  if (!topicId || typeof topicId !== 'string') return false;
  return /^\d+\.\d+\.\d+$/.test(topicId.trim());
}

export function validateTransactionId(txId: string): boolean {
  if (!txId || typeof txId !== 'string') return false;
  // Hedera transaction IDs look like: 0.0.123456@1711929384.123456789 or 0.0.123456-1711929384-123456789
  return txId.length >= 8 && (/^\d+\.\d+\.\d+[@-]\d+/.test(txId.trim()) || txId.startsWith('mock-tx-'));
}

export function validateNetwork(network: string): boolean {
  const allowed: HederaNetwork[] = ['testnet', 'mainnet', 'previewnet'];
  return allowed.includes(network.toLowerCase() as HederaNetwork);
}

export function validateProvenanceRegistrationInput(input: any): ValidationRuleResult {
  const errors: string[] = [];

  if (!input) {
    return { valid: false, errors: ['Request payload is empty'] };
  }

  if (!validateArtifactId(input.artifactId)) {
    errors.push('artifactId must be between 3 and 128 alphanumeric characters (allowed: _ - . :)');
  }

  if (!input.artifactTitle || typeof input.artifactTitle !== 'string' || input.artifactTitle.trim().length === 0) {
    errors.push('artifactTitle is required');
  } else if (input.artifactTitle.length > 256) {
    errors.push('artifactTitle exceeds maximum length of 256 characters');
  }

  if (input.content === undefined || input.content === null) {
    errors.push('content is required for cryptographic hashing');
  }

  if (input.version && typeof input.version === 'string' && input.version.length > 32) {
    errors.push('version cannot exceed 32 characters');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
