// ==========================================
// HEDERA PROVENANCE KIT: CRYPTOGRAPHIC HASHING
// Deterministic SHA-256 Digest Engine
// ==========================================

import crypto from 'crypto';
import { canonicalize } from './canonicalize';

export interface HashResult {
  hash: string;
  byteLength: number;
  canonicalString: string;
}

export function computeSha256(data: unknown): HashResult {
  const canonicalString = typeof data === 'string' ? data.normalize('NFC').trim() : canonicalize(data);
  const hash = crypto.createHash('sha256').update(canonicalString, 'utf8').digest('hex');
  const byteLength = Buffer.byteLength(canonicalString, 'utf8');

  return {
    hash,
    byteLength,
    canonicalString
  };
}

/**
 * Constant-time comparison preventing timing attacks
 */
export function verifyHashMatch(hashA: string, hashB: string): boolean {
  if (typeof hashA !== 'string' || typeof hashB !== 'string') return false;
  if (hashA.length !== hashB.length) return false;

  const bufA = Buffer.from(hashA.toLowerCase(), 'utf8');
  const bufB = Buffer.from(hashB.toLowerCase(), 'utf8');

  return crypto.timingSafeEqual(bufA, bufB);
}
