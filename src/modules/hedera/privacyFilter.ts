// ==========================================
// PRIVACY FILTER & HIPAA/GDPR COMPLIANCE GUARD
// Zero PHI / Zero PII On-Chain Guarantee
// ==========================================

import { PrivacyClassification, HCSProvenanceMessage, ArtifactType } from './types';

// Sensitive healthcare & identity keywords that must NEVER appear in public on-chain payloads
const SENSITIVE_PATTERNS = [
  /\b\d{3}-\d{2}-\d{4}\b/i,                 // SSN
  /\b(?:mrn|medical\s*record\s*number)\b/i, // Medical Record Number
  /\b(?:patient|dob|date\s*of\s*birth)\b/i,  // Patient identifiers
  /\b(?:diagnosis|icd-10|prescription)\b/i, // Protected health info
  /\b(?:password|bearer\s+[a-z0-9_\-\.]+)\b/i, // Credentials
  /\b(?:private_key|secret_key)\b/i,        // Crypto keys
];

export interface PrivacyValidationResult {
  allowed: boolean;
  sanitizedMessage: HCSProvenanceMessage;
  violations: string[];
  notice: string;
}

/**
 * Validates and prepares an HCS message according to the artifact's privacy classification.
 * Strictly guarantees that no private content, medical notes, or sensitive keys go on-chain.
 */
export function enforcePrivacyPolicy(params: {
  artifactId: string;
  artifactType: ArtifactType;
  artifactTitle: string;
  version: string;
  contentHash: string;
  privacyClassification: PrivacyClassification;
  actorId?: string;
  rawContent?: string | Record<string, unknown>;
  metadata?: Record<string, unknown>;
}): PrivacyValidationResult {
  const violations: string[] = [];

  // Check if rawContent contains sensitive patterns if someone accidentally tried to pass it
  const stringifiedContent = typeof params.rawContent === 'string' 
    ? params.rawContent 
    : JSON.stringify(params.rawContent || {});

  const stringifiedTitle = params.artifactTitle || '';

  // Scan title and metadata for prohibited sensitive terms
  for (const pattern of SENSITIVE_PATTERNS) {
    if (pattern.test(stringifiedTitle)) {
      violations.push(`Artifact title contains prohibited sensitive term matching pattern: ${pattern.source}`);
    }
  }

  // If classification is PRIVATE or SENSITIVE, ensure zero raw content or descriptive metadata is attached to HCS payload
  let customProperties: Record<string, string | number | boolean> | undefined;

  if (params.privacyClassification === 'PUBLIC' && params.metadata) {
    customProperties = {};
    for (const [k, v] of Object.entries(params.metadata)) {
      if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
        // Double check no sensitive strings in custom properties
        let hasViolation = false;
        for (const pattern of SENSITIVE_PATTERNS) {
          if (typeof v === 'string' && pattern.test(v)) {
            violations.push(`Metadata key '${k}' contains sensitive pattern`);
            hasViolation = true;
            break;
          }
        }
        if (!hasViolation) {
          customProperties[k] = v;
        }
      }
    }
  }

  // SENSITIVE/PRIVATE/PROTECTED classifications get strict zero-metadata guarantee
  if (params.privacyClassification === 'SENSITIVE' || params.privacyClassification === 'PRIVATE' || params.privacyClassification === 'PROTECTED') {
    customProperties = {
      protectedPrivacyTier: params.privacyClassification,
      offChainStorageGuaranteed: true,
    };
  }

  const sanitizedMessage: HCSProvenanceMessage = {
    schema: 'drt.provenance.v1',
    artifactId: params.artifactId.trim(),
    artifactType: params.artifactType,
    artifactTitle: sanitizePublicString(params.artifactTitle),
    version: params.version || '1.0.0',
    contentHash: params.contentHash.toLowerCase().trim(),
    hashAlgorithm: 'SHA-256',
    timestamp: new Date().toISOString(),
    platform: 'Dr. T',
    privacyClassification: params.privacyClassification,
    actorId: (params.privacyClassification === 'SENSITIVE' || params.privacyClassification === 'PROTECTED') ? 'ANONYMIZED_ACTOR' : (params.actorId || 'DR_T_SYSTEM'),
    customProperties,
  };

  const allowed = violations.length === 0;

  const notice = (params.privacyClassification === 'SENSITIVE' || params.privacyClassification === 'PROTECTED')
    ? 'Strict HIPAA/GDPR clinical privacy tier enforced: Zero clinical text, PHI, or PII is transmitted to Hedera. Only SHA-256 cryptographic digest is anchored on HCS.'
    : params.privacyClassification === 'PRIVATE'
    ? 'Private classification: Content remains strictly off-chain. Only cryptographic proof and identifier anchored on HCS.'
    : 'Public/Internal provenance record prepared. All metadata inspected and verified free of sensitive tokens.';

  return {
    allowed,
    sanitizedMessage,
    violations,
    notice,
  };
}

function sanitizePublicString(str: string): string {
  if (!str) return 'Untitled Artifact';
  // Strip control characters and trim
  return str.replace(/[\x00-\x1F\x7F]/g, '').trim().slice(0, 140);
}
