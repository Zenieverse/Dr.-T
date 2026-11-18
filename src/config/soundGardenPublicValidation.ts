// ============================================================================
// PIANIST — THE LIVING SOUND GARDEN: PUBLIC JUDGING RELEASE VALIDATION
// Fail-closed build validation and WebXR security header contract for the
// isolated static WebXR release (`public_judging`). Zero development fallback.
// ============================================================================

import {
  isDevelopmentFirestoreDatabaseId,
  normalizeConfigEnvValue,
} from './clientFirebaseValidation';

const DEV_PROJECT_FINGERPRINT = '1ecb2e93:f53bc22e:26';

function fnv1a32Hex(input: string): string {
  let x = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    x ^= input.charCodeAt(i);
    x = Math.imul(x, 0x01000193);
  }
  return (x >>> 0).toString(16).padStart(8, '0');
}

export function isDevelopmentGcpProjectId(projectId: string | undefined): boolean {
  const s = (projectId || '').trim();
  if (!s) return false;
  return `${fnv1a32Hex(s)}:${fnv1a32Hex('drt-proj-salt:' + s)}:${s.length}` === DEV_PROJECT_FINGERPRINT;
}

const KNOWN_PLACEHOLDERS = new Set([
  'changeme',
  'replace-me',
  'your-api-key',
  'your-app-id',
  'your-secret-here',
  'placeholder',
  'dev-placeholder',
  'test-placeholder',
  'secret',
  'test-secret',
  'default',
  'dev-secret',
]);

export interface SoundGardenPublicBuildEnvInput {
  VITE_RUNTIME_ENV?: string;
  DRT_RUNTIME_ENV?: string;
  VITE_SYNTHETIC_ONLY?: string;
  DRT_SYNTHETIC_ONLY?: string;
  VITE_FIREBASE_PROJECT_ID?: string;
  VITE_FIRESTORE_DATABASE_ID?: string;
  VITE_FIREBASE_API_KEY?: string;
  VITE_FIREBASE_APP_ID?: string;
  VITE_FIREBASE_AUTH_DOMAIN?: string;
  VITE_FIREBASE_STORAGE_BUCKET?: string;
  VITE_FIREBASE_MESSAGING_SENDER_ID?: string;
  GOOGLE_CLOUD_PROJECT?: string;
  DRT_FIREBASE_PROJECT_ID?: string;
  FIRESTORE_DATABASE_ID?: string;
  POPULATION_GUEST_TOKEN_SECRET?: string;
  DRT_JUDGING_RESET_TOKEN?: string;
  [key: string]: string | undefined;
}

export interface ValidatedSoundGardenPublicConfig {
  environment: 'public_judging';
  releaseArchitecture: 'static_webxr_only';
  isSyntheticOnly: true;
  backendRequired: false;
  firestoreRequired: false;
}

function rejectIfPlaceholder(key: string, rawVal: string | undefined): void {
  const val = normalizeConfigEnvValue(key, rawVal);
  if (!val) return;
  const lower = val.toLowerCase();
  if (
    KNOWN_PLACEHOLDERS.has(lower) ||
    (val.startsWith('<') && val.endsWith('>')) ||
    lower.includes('placeholder') ||
    lower.includes('replace_me') ||
    lower.includes('replace-me')
  ) {
    throw new Error(
      `[Living Sound Garden Public Build BLOCKED] ${key} contains a placeholder literal ('${val}'). Remove unused backend variables or provide explicit non-placeholder public_judging values.`
    );
  }
}

export function validateSoundGardenPublicBuildEnv(
  env: SoundGardenPublicBuildEnvInput
): ValidatedSoundGardenPublicConfig {
  const viteRuntimeEnv = normalizeConfigEnvValue(
    'VITE_RUNTIME_ENV',
    env.VITE_RUNTIME_ENV
  ).toLowerCase();
  const serverRuntimeEnv = normalizeConfigEnvValue(
    'DRT_RUNTIME_ENV',
    env.DRT_RUNTIME_ENV
  ).toLowerCase();

  if (!viteRuntimeEnv) {
    throw new Error(
      '[Living Sound Garden Public Build BLOCKED] Missing VITE_RUNTIME_ENV. Explicit VITE_RUNTIME_ENV=public_judging is mandatory (silent fallback to development is disabled).'
    );
  }

  if (viteRuntimeEnv !== 'public_judging') {
    throw new Error(
      `[Living Sound Garden Public Build BLOCKED] VITE_RUNTIME_ENV must be 'public_judging' for the public WebXR release (received '${viteRuntimeEnv}').`
    );
  }

  if (serverRuntimeEnv && serverRuntimeEnv !== 'public_judging') {
    throw new Error(
      `[Living Sound Garden Public Build BLOCKED] Environment mismatch: DRT_RUNTIME_ENV='${serverRuntimeEnv}' disagrees with VITE_RUNTIME_ENV='public_judging'.`
    );
  }

  const viteSynthetic = normalizeConfigEnvValue(
    'VITE_SYNTHETIC_ONLY',
    env.VITE_SYNTHETIC_ONLY
  ).toLowerCase();
  if (viteSynthetic !== 'true') {
    throw new Error(
      '[Living Sound Garden Public Build BLOCKED] VITE_SYNTHETIC_ONLY=true is mandatory for public_judging builds.'
    );
  }

  const serverSynthetic = normalizeConfigEnvValue(
    'DRT_SYNTHETIC_ONLY',
    env.DRT_SYNTHETIC_ONLY
  ).toLowerCase();
  if (serverSynthetic && serverSynthetic !== 'true') {
    throw new Error(
      `[Living Sound Garden Public Build BLOCKED] DRT_SYNTHETIC_ONLY must be 'true' when specified in public_judging builds (received '${serverSynthetic}').`
    );
  }

  // Reject any accidental development Firestore DB or implicit '(default)' binding
  for (const dbKey of ['VITE_FIRESTORE_DATABASE_ID', 'FIRESTORE_DATABASE_ID'] as const) {
    const dbVal = normalizeConfigEnvValue(dbKey, env[dbKey]);
    if (!dbVal) continue;
    rejectIfPlaceholder(dbKey, dbVal);
    if (isDevelopmentFirestoreDatabaseId(dbVal) || dbVal === '(default)') {
      throw new Error(
        `[Living Sound Garden Public Build BLOCKED] ${dbKey} targets the development Firestore database or implicit '(default)'. Public judging builds must remain completely isolated from development databases.`
      );
    }
  }

  // Reject any accidental development GCP project binding
  for (const projKey of [
    'VITE_FIREBASE_PROJECT_ID',
    'GOOGLE_CLOUD_PROJECT',
    'DRT_FIREBASE_PROJECT_ID',
  ] as const) {
    const projVal = normalizeConfigEnvValue(projKey, env[projKey]);
    if (!projVal) continue;
    rejectIfPlaceholder(projKey, projVal);
    if (isDevelopmentGcpProjectId(projVal)) {
      throw new Error(
        `[Living Sound Garden Public Build BLOCKED] ${projKey} targets the development GCP project. Public judging releases must not inherit development project bindings.`
      );
    }
  }

  // Reject placeholder credentials if any optional variables are set in the shell
  for (const credKey of [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_APP_ID',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'POPULATION_GUEST_TOKEN_SECRET',
    'DRT_JUDGING_RESET_TOKEN',
  ] as const) {
    rejectIfPlaceholder(credKey, env[credKey]);
  }

  return {
    environment: 'public_judging',
    releaseArchitecture: 'static_webxr_only',
    isSyntheticOnly: true,
    backendRequired: false,
    firestoreRequired: false,
  };
}

// ============================================================================
// CANONICAL HTTP SECURITY & WEBXR HEADERS FOR STATIC PUBLIC JUDGING HOST
// Minimal least-privilege policy tailored strictly to Living Sound Garden:
// - Allows WebXR spatial tracking (`xr-spatial-tracking=(self)`).
// - Allows same-origin optional desktop Webcam Conduct (`camera=(self)`).
// - Explicitly denies microphone, geolocation, payment, USB, and framing.
// - Enforces zero outbound XHR/fetch/WebSocket (`connect-src 'none'`).
// - Avoids unnecessary COEP `require-corp` (SharedArrayBuffer is unused).
// ============================================================================

export const SOUNDGARDEN_PUBLIC_SECURITY_HEADERS: Record<string, string> = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy':
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self' blob:; connect-src 'none'; font-src 'self' data:; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests",
  'Permissions-Policy':
    'xr-spatial-tracking=(self), camera=(self), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
};

export const SOUNDGARDEN_HTML_CACHE_HEADER = 'no-cache, must-revalidate';
export const SOUNDGARDEN_IMMUTABLE_ASSET_CACHE_HEADER = 'public, max-age=31536000, immutable';

export interface HeaderAuditResult {
  ok: boolean;
  errors: string[];
}

export function validatePublicReleaseHeaders(
  rawHeaders: Record<string, string | string[] | undefined>,
  options?: { requireHsts?: boolean }
): HeaderAuditResult {
  const normalized: Record<string, string> = {};
  for (const [k, v] of Object.entries(rawHeaders)) {
    if (Array.isArray(v)) {
      normalized[k.toLowerCase()] = v.join(', ');
    } else if (typeof v === 'string') {
      normalized[k.toLowerCase()] = v;
    }
  }

  const errors: string[] = [];

  const location = normalized['location'] || '';
  if (
    location.includes('__cookie_check.html') ||
    location.includes('accounts.google.com')
  ) {
    errors.push(`Blocked authentication redirect header detected: Location=${location}`);
  }

  const perm = normalized['permissions-policy'] || '';
  if (!perm.includes('xr-spatial-tracking=(self)')) {
    errors.push('Permissions-Policy must explicitly permit xr-spatial-tracking=(self) for Meta Quest WebXR.');
  }
  if (perm.includes('xr-spatial-tracking=()')) {
    errors.push('Permissions-Policy blocks xr-spatial-tracking=(), breaking Meta Quest WebXR.');
  }
  if (!perm.includes('microphone=()')) {
    errors.push('Permissions-Policy must deny unused microphone=() permission.');
  }
  if (/camera=\(\s*\*\s*\)|camera=\*/.test(perm)) {
    errors.push('Permissions-Policy must never grant wildcard camera=* access.');
  }

  const csp = normalized['content-security-policy'] || '';
  if (!csp.includes("default-src 'self'")) {
    errors.push("Content-Security-Policy must enforce default-src 'self'.");
  }
  if (!csp.includes("script-src 'self'") || csp.includes("script-src 'self' 'unsafe-inline'") || csp.includes("'unsafe-eval'")) {
    errors.push("Content-Security-Policy script-src must restrict scripts to 'self' without unsafe-inline or unsafe-eval.");
  }
  if (!csp.includes("connect-src 'none'")) {
    errors.push("Content-Security-Policy for static WebXR release must enforce connect-src 'none' (zero backend calls).");
  }
  if (!csp.includes("frame-ancestors 'none'")) {
    errors.push("Content-Security-Policy must enforce frame-ancestors 'none' so WebXR runs top-level.");
  }

  if (normalized['x-content-type-options']?.toLowerCase() !== 'nosniff') {
    errors.push('X-Content-Type-Options must be nosniff.');
  }
  if (normalized['cross-origin-opener-policy']?.toLowerCase() !== 'same-origin') {
    errors.push('Cross-Origin-Opener-Policy must be same-origin.');
  }
  if (normalized['cross-origin-resource-policy']?.toLowerCase() !== 'same-origin') {
    errors.push('Cross-Origin-Resource-Policy must be same-origin.');
  }
  if (normalized['x-frame-options']?.toUpperCase() !== 'DENY') {
    errors.push('X-Frame-Options must be DENY.');
  }
  if (!normalized['referrer-policy']) {
    errors.push('Referrer-Policy header is required.');
  }
  if (options?.requireHsts !== false && !(normalized['strict-transport-security'] || '').includes('max-age=')) {
    errors.push('Strict-Transport-Security header with max-age is required for public HTTPS release.');
  }

  return {
    ok: errors.length === 0,
    errors,
  };
}
