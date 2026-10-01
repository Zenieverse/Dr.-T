export function computeBackoff(attempt: number, baseMs: number = 100, maxMs: number = 5000): number {
  if (attempt < 0 || baseMs <= 0) {
    return 100; // Safe clamp
  }
  const calculated = baseMs * Math.pow(2, attempt);
  return Math.min(Math.max(calculated, 100), maxMs);
}
