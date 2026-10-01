export interface CacheConfig {
  ttlSeconds: number;
}

export function loadCacheConfig(env: Record<string, string | undefined>): CacheConfig {
  const raw = env.CACHE_EXPIRY_SECONDS || env.ttl_seconds;
  const parsed = raw ? parseInt(raw, 10) : 300;
  return {
    ttlSeconds: isNaN(parsed) || parsed <= 0 ? 300 : parsed
  };
}
