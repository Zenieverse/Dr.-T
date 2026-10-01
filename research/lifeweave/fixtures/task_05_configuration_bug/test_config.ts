import { loadCacheConfig } from './config_loader';

// Supports CACHE_EXPIRY_SECONDS
const cfg1 = loadCacheConfig({ CACHE_EXPIRY_SECONDS: '600' });
if (cfg1.ttlSeconds !== 600) process.exit(1);

// Supports ttl_seconds
const cfg2 = loadCacheConfig({ ttl_seconds: '120' });
if (cfg2.ttlSeconds !== 120) process.exit(1);

// Defaults to 300 on empty
const cfg3 = loadCacheConfig({});
if (cfg3.ttlSeconds !== 300) process.exit(1);

console.log('PASS: loadCacheConfig supports both keys and defaults cleanly to 300s');
process.exit(0);
