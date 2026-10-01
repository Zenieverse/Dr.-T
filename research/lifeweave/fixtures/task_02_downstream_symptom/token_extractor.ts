export function extractBearerToken(headerValue?: string): string | null {
  if (!headerValue) return null;
  const match = headerValue.match(/^bearer\s+(.+)$/i);
  return match ? match[1].trim() : null;
}
