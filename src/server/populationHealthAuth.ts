// ============================================================================
// DR. T — POPULATION HEALTH CRYPTOGRAPHIC AUTH, RBAC & RATE-LIMITING
// Server-authoritative Firebase ID Token RS256 verification + Signed Guest Sandbox
// ============================================================================

import crypto from 'crypto';
import { CanonicalPopulationRole, PopulationRole } from '../types/populationHealth';
import { resolveServerFirebaseConfig } from './runtimeEnvironment';

const GOOGLE_CERTS_URL =
  'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';

const ADMIN_EMAIL_ALLOWLIST = new Set(['zenieverse@gmail.com']);

function getFirebaseProjectId(): string {
  return resolveServerFirebaseConfig(process.env).projectId;
}

// Ephemeral CSPRNG secret permitted ONLY in development; staging/production/public_judging
// require Secret Manager provisioned POPULATION_GUEST_TOKEN_SECRET (>=32 chars).
let devEphemeralGuestSecret: string | null = null;
function getGuestHmacSecret(): string {
  const cfg = resolveServerFirebaseConfig(process.env);
  if (cfg.hasGuestTokenSecret && process.env.POPULATION_GUEST_TOKEN_SECRET) {
    return process.env.POPULATION_GUEST_TOKEN_SECRET.trim();
  }
  if (!devEphemeralGuestSecret) {
    devEphemeralGuestSecret = crypto.randomBytes(32).toString('hex');
  }
  return devEphemeralGuestSecret;
}

export class HttpAuthError extends Error {
  public readonly statusCode: 401 | 403;
  public readonly code: 'UNAUTHORIZED' | 'FORBIDDEN';
  constructor(statusCode: 401 | 403, message: string) {
    super(message);
    this.name = 'HttpAuthError';
    this.statusCode = statusCode;
    this.code = statusCode === 401 ? 'UNAUTHORIZED' : 'FORBIDDEN';
  }
}

export class RateLimitError extends Error {
  public readonly statusCode = 429;
  constructor(message: string) {
    super(message);
    this.name = 'RateLimitError';
  }
}

// ============================================================================
// Role Canonicalization & Rank Hierarchy
// ============================================================================
export function canonicalizeRole(role: PopulationRole): CanonicalPopulationRole {
  if (role === 'population_health_manager') return 'programme_manager';
  if (role === 'read_only_reviewer') return 'community_viewer';
  return role;
}

const ROLE_PRIVILEGE_RANK: Record<CanonicalPopulationRole, number> = {
  community_viewer: 1,
  guest_demo: 2,
  research_analyst: 3,
  care_navigator: 4,
  clinician: 5,
  programme_manager: 6,
  platform_admin: 7,
};

const CANONICAL_ALLOWED_SET = new Set<PopulationRole>([
  'platform_admin',
  'programme_manager',
  'population_health_manager',
  'clinician',
  'care_navigator',
  'research_analyst',
  'community_viewer',
  'read_only_reviewer',
  'guest_demo',
]);

export function isValidPopulationRoleString(val?: string | null): val is PopulationRole {
  if (!val) return false;
  return CANONICAL_ALLOWED_SET.has(val.trim() as PopulationRole);
}

// ============================================================================
// Google Secure Token Public Key Cache & RS256 JWT Verifier
// ============================================================================
let certCache: { certs: Record<string, string>; expiresAtMs: number } | null = null;

async function fetchGooglePublicCerts(): Promise<Record<string, string>> {
  const now = Date.now();
  if (certCache && now < certCache.expiresAtMs && Object.keys(certCache.certs).length > 0) {
    return certCache.certs;
  }

  const res = await fetch(GOOGLE_CERTS_URL);
  if (!res.ok) {
    throw new HttpAuthError(401, `Unable to fetch Firebase verification certificates (${res.status}).`);
  }
  const cacheControl = res.headers.get('cache-control') || '';
  const maxAgeMatch = cacheControl.match(/max-age=(\d+)/i);
  const maxAgeSec = maxAgeMatch ? Math.min(21600, Math.max(60, Number(maxAgeMatch[1]))) : 3600;
  const certs = (await res.json()) as Record<string, string>;

  certCache = {
    certs,
    expiresAtMs: now + maxAgeSec * 1000,
  };
  return certs;
}

function base64UrlDecodeToBuffer(segment: string): Buffer {
  const normalized = segment.replace(/-/g, '+').replace(/_/g, '/');
  const pad = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
  return Buffer.from(`${normalized}${pad}`, 'base64');
}

function base64UrlEncodeBuffer(buf: Buffer | string): string {
  const b = typeof buf === 'string' ? Buffer.from(buf, 'utf8') : buf;
  return b.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

export interface VerifiedFirebaseClaims {
  sub: string;
  email?: string;
  email_verified?: boolean;
  admin?: boolean;
  populationRole?: string;
  aud: string;
  iss: string;
  iat: number;
  exp: number;
  auth_time?: number;
}

export async function verifyFirebaseIdToken(idToken: string): Promise<VerifiedFirebaseClaims> {
  const parts = idToken.split('.');
  if (parts.length !== 3) {
    throw new HttpAuthError(401, 'Malformed Firebase ID token.');
  }

  const [headerB64, payloadB64, sigB64] = parts;
  let header: { alg?: string; kid?: string };
  let claims: VerifiedFirebaseClaims;

  try {
    header = JSON.parse(base64UrlDecodeToBuffer(headerB64).toString('utf8'));
    claims = JSON.parse(base64UrlDecodeToBuffer(payloadB64).toString('utf8'));
  } catch {
    throw new HttpAuthError(401, 'Invalid Firebase ID token encoding.');
  }

  if (header.alg !== 'RS256' || !header.kid) {
    throw new HttpAuthError(401, 'Unsupported token algorithm or missing key ID.');
  }

  const projectId = getFirebaseProjectId();
  const nowSec = Math.floor(Date.now() / 1000);

  if (claims.aud !== projectId) {
    throw new HttpAuthError(401, 'Token audience does not match Dr. T Firebase project.');
  }
  if (claims.iss !== `https://securetoken.google.com/${projectId}`) {
    throw new HttpAuthError(401, 'Token issuer does not match Firebase Secure Token Service.');
  }
  if (!claims.sub || typeof claims.sub !== 'string') {
    throw new HttpAuthError(401, 'Token missing verified subject UID.');
  }
  if (typeof claims.exp !== 'number' || claims.exp <= nowSec) {
    throw new HttpAuthError(401, 'Firebase ID token has expired.');
  }
  if (typeof claims.iat !== 'number' || claims.iat > nowSec + 300) {
    throw new HttpAuthError(401, 'Firebase ID token issued-at timestamp invalid.');
  }
  if (typeof claims.auth_time === 'number' && claims.auth_time > nowSec + 300) {
    throw new HttpAuthError(401, 'Firebase ID token auth_time invalid.');
  }

  const certs = await fetchGooglePublicCerts();
  let certPem = certs[header.kid];
  if (!certPem) {
    // Force refresh once in case Google rotated signing keys
    certCache = null;
    const freshCerts = await fetchGooglePublicCerts();
    certPem = freshCerts[header.kid];
  }
  if (!certPem) {
    throw new HttpAuthError(401, 'Signing key ID not recognized for Firebase project.');
  }

  const verifier = crypto.createVerify('RSA-SHA256');
  verifier.update(`${headerB64}.${payloadB64}`);
  verifier.end();
  const signature = base64UrlDecodeToBuffer(sigB64);

  const validSig = verifier.verify(certPem, signature);
  if (!validSig) {
    throw new HttpAuthError(401, 'Firebase ID token signature verification failed.');
  }

  return claims;
}

export function deriveServerRoleFromFirebaseClaims(
  claims: VerifiedFirebaseClaims
): CanonicalPopulationRole {
  const emailLower = (claims.email || '').trim().toLowerCase();
  if (claims.admin === true || (claims.email_verified === true && ADMIN_EMAIL_ALLOWLIST.has(emailLower))) {
    return 'platform_admin';
  }
  if (claims.populationRole && isValidPopulationRoleString(claims.populationRole)) {
    const canon = canonicalizeRole(claims.populationRole);
    if (canon !== 'guest_demo') return canon;
  }
  // Authenticated Firebase users without custom staff claims start at least privilege.
  return 'community_viewer';
}

// ============================================================================
// Server-Minted Signed Guest Sandbox Tokens
// ============================================================================
interface GuestDemoPayload {
  typ: 'pop_guest_demo';
  sid: string;
  iat: number;
  exp: number;
}

export function mintGuestDemoToken(): {
  token: string;
  sessionId: string;
  expiresInSeconds: number;
} {
  const nowSec = Math.floor(Date.now() / 1000);
  const ttl = 6 * 3600;
  const sessionId = `GS-${crypto.randomBytes(12).toString('hex')}`;
  const payload: GuestDemoPayload = {
    typ: 'pop_guest_demo',
    sid: sessionId,
    iat: nowSec,
    exp: nowSec + ttl,
  };
  const payloadB64 = base64UrlEncodeBuffer(JSON.stringify(payload));
  const sig = base64UrlEncodeBuffer(
    crypto.createHmac('sha256', getGuestHmacSecret()).update(payloadB64).digest()
  );
  return {
    token: `gdemo.${payloadB64}.${sig}`,
    sessionId,
    expiresInSeconds: ttl,
  };
}

export function verifyGuestDemoToken(token: string): GuestDemoPayload {
  const parts = token.split('.');
  if (parts.length !== 3 || parts[0] !== 'gdemo') {
    throw new HttpAuthError(401, 'Malformed guest sandbox token.');
  }
  const [, payloadB64, sigB64] = parts;
  const expectedSig = base64UrlEncodeBuffer(
    crypto.createHmac('sha256', getGuestHmacSecret()).update(payloadB64).digest()
  );
  const providedBuf = Buffer.from(sigB64, 'utf8');
  const expectedBuf = Buffer.from(expectedSig, 'utf8');
  if (providedBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(providedBuf, expectedBuf)) {
    throw new HttpAuthError(401, 'Guest sandbox token signature mismatch.');
  }

  let payload: GuestDemoPayload;
  try {
    payload = JSON.parse(base64UrlDecodeToBuffer(payloadB64).toString('utf8')) as GuestDemoPayload;
  } catch {
    throw new HttpAuthError(401, 'Invalid guest sandbox token payload.');
  }

  const nowSec = Math.floor(Date.now() / 1000);
  if (payload.typ !== 'pop_guest_demo' || !payload.sid || payload.exp <= nowSec) {
    throw new HttpAuthError(401, 'Guest sandbox session has expired.');
  }
  return payload;
}

// ============================================================================
// Request Authentication & Privilege Escalation Guard
// ============================================================================
export interface AuthenticatedPopulationContext {
  effectiveRole: PopulationRole;
  canonicalRole: CanonicalPopulationRole;
  verifiedMaxRole: CanonicalPopulationRole;
  authMode: 'VERIFIED_FIREBASE_USER' | 'GUEST_SANDBOX';
  isGuestSandbox: boolean;
  actorId: string;
  guestSessionId?: string;
}

const GUEST_PREVIEWABLE_ROLES = new Set<CanonicalPopulationRole>([
  'guest_demo',
  'research_analyst',
  'community_viewer',
]);

export async function authenticatePopulationHeaders(params: {
  authorizationHeader?: string;
  requestedRoleHeader?: string;
  requestedGuestSessionIdHeader?: string;
}): Promise<AuthenticatedPopulationContext> {
  const authHeader = (params.authorizationHeader || '').trim();
  if (!authHeader.startsWith('Bearer ')) {
    throw new HttpAuthError(
      401,
      'Authentication required. Provide a verified Firebase ID token or obtain a signed Guest Sandbox session via POST /api/population-health/guest-session.'
    );
  }
  const token = authHeader.slice(7).trim();
  if (!token) {
    throw new HttpAuthError(401, 'Empty Bearer token.');
  }

  const reqRoleRaw = params.requestedRoleHeader?.trim();
  let requestedRole: PopulationRole | undefined;
  if (reqRoleRaw) {
    if (!isValidPopulationRoleString(reqRoleRaw)) {
      throw new HttpAuthError(403, `Unknown or unsupported role '${reqRoleRaw}'.`);
    }
    requestedRole = reqRoleRaw;
  }

  if (token.startsWith('gdemo.')) {
    const guestPayload = verifyGuestDemoToken(token);
    const reqSid = params.requestedGuestSessionIdHeader?.trim();
    if (reqSid && reqSid !== guestPayload.sid) {
      throw new HttpAuthError(
        403,
        'Cross-session guest sandbox access blocked: session header mismatch.'
      );
    }
    if (requestedRole) {
      const requestedCanon = canonicalizeRole(requestedRole);
      if (!GUEST_PREVIEWABLE_ROLES.has(requestedCanon)) {
        throw new HttpAuthError(
          403,
          `Privilege escalation blocked: Guest Sandbox sessions cannot assume '${requestedRole}'.`
        );
      }
      return {
        effectiveRole: requestedRole,
        canonicalRole: requestedCanon,
        verifiedMaxRole: 'guest_demo',
        authMode: 'GUEST_SANDBOX',
        isGuestSandbox: true,
        actorId: guestPayload.sid,
        guestSessionId: guestPayload.sid,
      };
    }
    return {
      effectiveRole: 'guest_demo',
      canonicalRole: 'guest_demo',
      verifiedMaxRole: 'guest_demo',
      authMode: 'GUEST_SANDBOX',
      isGuestSandbox: true,
      actorId: guestPayload.sid,
      guestSessionId: guestPayload.sid,
    };
  }

  const claims = await verifyFirebaseIdToken(token);
  const verifiedMax = deriveServerRoleFromFirebaseClaims(claims);

  if (requestedRole) {
    const requestedCanon = canonicalizeRole(requestedRole);
    if (ROLE_PRIVILEGE_RANK[requestedCanon] > ROLE_PRIVILEGE_RANK[verifiedMax]) {
      throw new HttpAuthError(
        403,
        `Privilege escalation blocked: verified identity max role is '${verifiedMax}', cannot assume '${requestedRole}'.`
      );
    }
    return {
      effectiveRole: requestedRole,
      canonicalRole: requestedCanon,
      verifiedMaxRole: verifiedMax,
      authMode: 'VERIFIED_FIREBASE_USER',
      isGuestSandbox: false,
      actorId: `uid:${claims.sub.slice(0, 12)}`,
    };
  }

  return {
    effectiveRole: verifiedMax,
    canonicalRole: verifiedMax,
    verifiedMaxRole: verifiedMax,
    authMode: 'VERIFIED_FIREBASE_USER',
    isGuestSandbox: false,
    actorId: `uid:${claims.sub.slice(0, 12)}`,
  };
}

// ============================================================================
// Privileged Server-Side Reset Token Verifier (Public Judging / Staging / Prod)
// ============================================================================
export function verifyPrivilegedResetToken(
  providedToken: string | undefined,
  env: NodeJS.ProcessEnv = process.env
): { ok: boolean; reason?: string } {
  const configured = (env.DRT_JUDGING_RESET_TOKEN || env.DRT_ADMIN_RESET_TOKEN || '').trim();
  if (!configured || configured.length < 16) {
    return {
      ok: false,
      reason: 'Privileged reset token is not configured on server (DRT_JUDGING_RESET_TOKEN / DRT_ADMIN_RESET_TOKEN, min 16 chars).',
    };
  }
  const provided = (providedToken || '').trim();
  if (!provided) {
    return { ok: false, reason: 'Missing X-DrT-Admin-Reset-Token header.' };
  }
  const a = Buffer.from(provided, 'utf8');
  const b = Buffer.from(configured, 'utf8');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return { ok: false, reason: 'Invalid privileged reset token.' };
  }
  return { ok: true };
}

// ============================================================================
// Sliding-Window Rate Limiter (Process-Local Best Effort Only)
// ============================================================================
export const RATE_LIMITER_SCOPE = 'process_local_best_effort' as const;
export const RATE_LIMITER_GLOBALLY_ENFORCED = false as const;

// Best-effort in-process limiter; does NOT coordinate across multiple Cloud Run instances.
const rateLimitBuckets = new Map<string, number[]>();

export function checkRateLimit(
  bucketKey: string,
  maxRequests: number,
  windowMs: number
): void {
  const now = Date.now();
  const cutoff = now - windowMs;
  const timestamps = (rateLimitBuckets.get(bucketKey) || []).filter((ts) => ts > cutoff);
  if (timestamps.length >= maxRequests) {
    throw new RateLimitError(
      `Rate limit exceeded (${maxRequests} requests per ${Math.round(windowMs / 1000)}s; process-local limiter).`
    );
  }
  timestamps.push(now);
  rateLimitBuckets.set(bucketKey, timestamps);

  if (rateLimitBuckets.size > 2000) {
    for (const [k, list] of rateLimitBuckets.entries()) {
      if (list.every((ts) => ts <= cutoff)) {
        rateLimitBuckets.delete(k);
      }
    }
  }
}

export function sanitizeText(value: unknown, maxLength = 500): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, maxLength);
}
