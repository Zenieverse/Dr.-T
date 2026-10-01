export function normalizeVersion(v: string): number[] {
  // Strips leading v and splits by dot or hyphen/dev
  const clean = v.replace(/^v/, '').split(/[-+.]/)[0];
  const parts = v.replace(/^v/, '').split(/[-+.]/).slice(0, 3).map(p => parseInt(p, 10) || 0);
  while (parts.length < 3) parts.push(0);
  return parts;
}

export function compareVersions(a: string, b: string): number {
  const normA = normalizeVersion(a);
  const normB = normalizeVersion(b);
  for (let i = 0; i < 3; i++) {
    if (normA[i] > normB[i]) return 1;
    if (normA[i] < normB[i]) return -1;
  }
  return 0;
}
