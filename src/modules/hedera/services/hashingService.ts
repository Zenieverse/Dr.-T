// ==========================================
// HEDERA COMMONS: HASHING SERVICE
// Secure SHA-256 Cryptographic Digest Engine
// ==========================================

import crypto from 'crypto';
import { canonicalize } from '../utils/canonicalize';

export interface HashDigestResult {
  hash: string;
  byteLength: number;
  canonicalString: string;
}

/**
 * Computes deterministic SHA-256 hash of an arbitrary artifact payload.
 * Canonicalizes data first using RFC 8785 sorting to ensure identical payloads
 * always produce the exact same cryptographic fingerprint.
 */
export async function hashArtifact(input: unknown): Promise<string> {
  const canonicalString = canonicalize(input);
  return crypto.createHash('sha256').update(canonicalString, 'utf8').digest('hex').toLowerCase();
}

/**
 * Synchronous variant returning full digest details (byteLength, canonicalString).
 */
export function hashArtifactSync(input: unknown): HashDigestResult {
  const canonicalString = canonicalize(input);
  const hash = crypto.createHash('sha256').update(canonicalString, 'utf8').digest('hex').toLowerCase();
  const byteLength = Buffer.byteLength(canonicalString, 'utf8');

  return {
    hash,
    byteLength,
    canonicalString
  };
}

/**
 * Constant-time hash equality comparison to prevent timing attacks.
 */
export function verifyHashMatch(hashA: string, hashB: string): boolean {
  if (!hashA || !hashB) return false;
  const cleanA = hashA.trim().toLowerCase();
  const cleanB = hashB.trim().toLowerCase();

  if (cleanA.length !== cleanB.length) return false;

  try {
    const bufA = Buffer.from(cleanA, 'hex');
    const bufB = Buffer.from(cleanB, 'hex');
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return cleanA === cleanB;
  }
}

// Aliases for compatibility
export const computeSha256 = hashArtifactSync;
