// ==========================================
// HEDERA COMMONS: CANONICALIZATION UTILITY
// Deterministic Serialization (RFC 8785 subset)
// ==========================================

/**
 * Recursively sorts keys of an object to ensure deterministic JSON stringification.
 * Complies with RFC 8785 JSON Canonicalization Scheme principles:
 * - Deterministic dictionary key sorting
 * - Omission of undefined properties
 * - Normalization of NaN / Infinity to null
 * - Stable Unicode serialization (UTF-8)
 */
export function canonicalize(obj: unknown): string {
  if (obj === null || obj === undefined) {
    return 'null';
  }

  if (typeof obj === 'string') {
    return JSON.stringify(obj.normalize('NFC').trim());
  }

  if (typeof obj === 'number') {
    if (isNaN(obj) || !isFinite(obj)) return 'null';
    return String(obj);
  }

  if (typeof obj === 'boolean') {
    return obj ? 'true' : 'false';
  }

  if (obj instanceof Date) {
    return JSON.stringify(obj.toISOString());
  }

  if (Array.isArray(obj)) {
    const items = obj.map(item => canonicalize(item));
    return `[${items.join(',')}]`;
  }

  if (typeof obj === 'object') {
    const sortedKeys = Object.keys(obj as Record<string, unknown>)
      .filter(key => (obj as Record<string, unknown>)[key] !== undefined)
      .sort((a, b) => a.localeCompare(b));

    const entries = sortedKeys.map(key => {
      const val = (obj as Record<string, unknown>)[key];
      return `${JSON.stringify(key)}:${canonicalize(val)}`;
    });

    return `{${entries.join(',')}}`;
  }

  return JSON.stringify(String(obj));
}

// Alias for compatibility
export const canonicalizeJson = canonicalize;
