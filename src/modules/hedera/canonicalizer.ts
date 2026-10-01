// ==========================================
// CANONICAL SERIALIZATION & SHA-256 ENGINE
// Deterministic Cryptographic Fingerprinting
// ==========================================

import crypto from 'crypto';

/**
 * Deterministically sorts object keys deeply to produce a canonical JSON string (RFC 8785 subset)
 */
export function canonicalizeJson(obj: unknown): string {
  if (obj === null || obj === undefined) {
    return 'null';
  }

  if (typeof obj === 'number' || typeof obj === 'boolean') {
    return JSON.stringify(obj);
  }

  if (typeof obj === 'string') {
    return JSON.stringify(obj);
  }

  if (Array.isArray(obj)) {
    const items = obj.map(item => canonicalizeJson(item));
    return `[${items.join(',')}]`;
  }

  if (typeof obj === 'object') {
    const keys = Object.keys(obj as Record<string, unknown>).sort();
    const pairs = keys.map(key => {
      const val = (obj as Record<string, unknown>)[key];
      // Skip undefined values to normalize
      if (val === undefined) return null;
      return `${JSON.stringify(key)}:${canonicalizeJson(val)}`;
    }).filter(Boolean);
    return `{${pairs.join(',')}}`;
  }

  return JSON.stringify(obj);
}

/**
 * Computes deterministic SHA-256 hexadecimal hash of any artifact content or object
 */
export function computeSha256(content: string | Record<string, unknown> | Buffer): {
  hash: string;
  canonicalString: string;
  byteLength: number;
} {
  let canonicalString: string;

  if (Buffer.isBuffer(content)) {
    const hash = crypto.createHash('sha256').update(content).digest('hex');
    return {
      hash,
      canonicalString: `<Binary Buffer ${content.length} bytes>`,
      byteLength: content.length,
    };
  }

  if (typeof content === 'string') {
    canonicalString = content;
  } else {
    canonicalString = canonicalizeJson(content);
  }

  const hash = crypto.createHash('sha256').update(canonicalString, 'utf8').digest('hex');
  const byteLength = Buffer.byteLength(canonicalString, 'utf8');

  return {
    hash,
    canonicalString,
    byteLength,
  };
}

/**
 * Compares two SHA-256 hashes in constant time to prevent timing attacks
 */
export function verifyHashMatch(hashA: string, hashB: string): boolean {
  if (!hashA || !hashB) return false;
  const cleanA = hashA.trim().toLowerCase();
  const cleanB = hashB.trim().toLowerCase();
  if (cleanA.length !== cleanB.length) return false;
  
  try {
    const bufA = Buffer.from(cleanA, 'hex');
    const bufB = Buffer.from(cleanB, 'hex');
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return cleanA === cleanB;
  }
}
