export function compareNumeric(a: string, b: string): number {
  return Number(a) - Number(b);
}

export function compareAlphanumeric(a: string, b: string): number {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

export function sortTags(tags: string[]): string[] {
  // Correct implementation uses compareAlphanumeric
  return [...tags].sort(compareAlphanumeric);
}
