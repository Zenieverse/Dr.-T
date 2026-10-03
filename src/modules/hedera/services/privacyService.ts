// ==========================================
// HEDERA COMMONS: PRIVACY SERVICE
// HIPAA Safe Harbor & GDPR Zero-PHI Barrier
// ==========================================

import { 
  PrivacyClassification, 
  HederaProvenancePayload 
} from '../types/provenance';

const PROHIBITED_PATTERNS = [
  /\b\d{3}-\d{2}-\d{4}\b/i, // US SSN
  /\bMRN[-:\s]?\d{4,10}\b/i, // Medical Record Number
  /\b(patient|pt)[\s_-]?name\b/i,
  /\b(dob|birthdate|date[\s_]of[\s_]birth)\b/i,
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
  /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/, // Phone
  /\b(password|passwd|secret|private[_-]?key|apikey|bearer[\s_-]?token)\b/i,
  /\bAIzaSy[A-Za-z0-9_-]{33}\b/, // Google API key
];

export interface PrivacyEvaluationResult {
  allowed: boolean;
  violations: string[];
  sanitizedMessage: HederaProvenancePayload;
  classification: PrivacyClassification;
}

export interface PrivacyInspectionInput {
  artifactId: string;
  artifactType: string;
  artifactTitle: string;
  version: string;
  contentHash: string;
  privacyClassification?: PrivacyClassification;
  actorId?: string;
  rawContent?: unknown;
}

/**
 * Enforces HIPAA Safe Harbor, GDPR Article 9, and Dr. T Zero-PHI constraints.
 * Strips all confidential notes, clinical diagnoses, and patient identifiers.
 * Only outputs minimal sanitized metadata and the irreversible SHA-256 fingerprint.
 */
export function sanitizeForHedera(input: PrivacyInspectionInput): PrivacyEvaluationResult {
  const violations: string[] = [];
  const classification = input.privacyClassification || 'PUBLIC';
  const normClassification = classification.toUpperCase() as PrivacyClassification;

  // 1. Audit public strings (artifactId, artifactTitle) for accidental leaks
  const titleToCheck = `${input.artifactId} ${input.artifactTitle}`;
  for (const pattern of PROHIBITED_PATTERNS) {
    if (pattern.test(titleToCheck)) {
      violations.push(`Public field contains prohibited identifier pattern (${pattern.toString()})`);
    }
  }

  // 2. Anonymize actor on SENSITIVE and PRIVATE records
  let safeActor = input.actorId || 'DR_T_SYSTEM';
  if (normClassification === 'SENSITIVE' || normClassification === 'PRIVATE') {
    safeActor = 'ANONYMIZED_ACTOR';
  }

  // 3. Assemble strictly sanitized on-chain message payload
  const sanitizedMessage: HederaProvenancePayload = {
    schema: 'drt.provenance.v1',
    artifactId: input.artifactId.trim(),
    artifactType: input.artifactType.toLowerCase(),
    artifactTitle: input.artifactTitle.trim(),
    version: input.version || '1.0.0',
    contentHash: input.contentHash.toLowerCase(),
    hashAlgorithm: 'SHA-256',
    timestamp: new Date().toISOString(),
    platform: 'Dr. T',
    privacyClassification: normClassification,
    actorId: safeActor
  };

  return {
    allowed: violations.length === 0,
    violations,
    sanitizedMessage,
    classification: normClassification
  };
}

// Aliases for compatibility
export const enforcePrivacyPolicy = sanitizeForHedera;
