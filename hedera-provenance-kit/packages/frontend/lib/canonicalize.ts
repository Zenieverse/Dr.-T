// ==========================================
// HEDERA PROVENANCE KIT: RFC 8785 CANONICALIZER
// Deterministic JSON Stringification Engine
// ==========================================

export function canonicalize(obj: unknown): string {
  if (obj === null || obj === undefined) {
    return 'null';
  }

  if (typeof obj === 'number') {
    if (!Number.isFinite(obj)) return 'null';
    return Object.is(obj, -0) ? '0' : String(obj);
  }

  if (typeof obj === 'boolean') {
    return obj ? 'true' : 'false';
  }

  if (typeof obj === 'string') {
    return JSON.stringify(obj.normalize('NFC'));
  }

  if (Array.isArray(obj)) {
    const elements = obj.map(item => (item === undefined ? 'null' : canonicalize(item)));
    return `[${elements.join(',')}]`;
  }

  if (typeof obj === 'object') {
    const keys = Object.keys(obj as Record<string, unknown>).sort();
    const pairs: string[] = [];

    for (const key of keys) {
      const val = (obj as Record<string, unknown>)[key];
      if (val === undefined || typeof val === 'function' || typeof val === 'symbol') {
        continue;
      }
      pairs.push(`${JSON.stringify(key.normalize('NFC'))}:${canonicalize(val)}`);
    }

    return `{${pairs.join(',')}}`;
  }

  return 'null';
}
