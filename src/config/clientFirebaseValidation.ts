// ============================================================================
// DR. T — CLIENT FIREBASE ENVIRONMENT VALIDATION (SHARED NODE/BROWSER LOGIC)
// Used at Vite build time (vite.config.ts) AND runtime (firebaseRuntimeConfig.ts)
// to guarantee staging/production/public_judging builds never fall back silently
// to development configuration or firebase-applet-config.json.
// ============================================================================

const DEV_DB_FINGERPRINT = 'f56b74e2:156c4779:50';

function fnv1a32Hex(input: string): string {
  let x = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    x ^= input.charCodeAt(i);
    x = Math.imul(x, 0x01000193);
  }
  return (x >>> 0).toString(16).padStart(8, '0');
}

export function isDevelopmentFirestoreDatabaseId(dbId: string | undefined): boolean {
  const s = (dbId || '').trim();
  if (!s) return false;
  return `${fnv1a32Hex(s)}:${fnv1a32Hex('drt-salt:' + s)}:${s.length}` === DEV_DB_FINGERPRINT;
}

export type ClientRuntimeEnv =
  | 'development'
  | 'staging'
  | 'production'
  | 'public_judging';

export const VALID_CLIENT_ENVS = new Set<ClientRuntimeEnv>([
  'development',
  'staging',
  'production',
  'public_judging',
]);

const KNOWN_PLACEHOLDERS = new Set([
  'changeme',
  'replace-me',
  'your-api-key',
  'your-app-id',
  'placeholder',
  'dev-placeholder',
  'test-placeholder',
]);

export interface DevFirebaseConfigShape {
  projectId?: string;
  appId?: string;
  apiKey?: string;
  authDomain?: string;
  firestoreDatabaseId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
}

export interface ResolvedClientFirebaseConfig {
  environment: ClientRuntimeEnv;
  isSyntheticOnly: boolean;
  projectId: string;
  appId: string;
  apiKey: string;
  authDomain: string;
  firestoreDatabaseId: string;
  storageBucket: string;
  messagingSenderId: string;
}

export interface ClientEnvInput {
  VITE_RUNTIME_ENV?: string;
  VITE_FIREBASE_PROJECT_ID?: string;
  VITE_FIRESTORE_DATABASE_ID?: string;
  VITE_FIREBASE_API_KEY?: string;
  VITE_FIREBASE_APP_ID?: string;
  VITE_FIREBASE_AUTH_DOMAIN?: string;
  VITE_FIREBASE_STORAGE_BUCKET?: string;
  VITE_FIREBASE_MESSAGING_SENDER_ID?: string;
  VITE_SYNTHETIC_ONLY?: string;
  MODE?: string;
  DEV?: boolean;
  PROD?: boolean;
}

export function normalizeConfigEnvValue(key: string, raw: unknown): string {
  let val = String(raw ?? '').trim();
  if (!val) return '';

  const stripMatchingQuotes = (s: string): string => {
    if (
      s.length >= 2 &&
      ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'")))
    ) {
      return s.slice(1, -1).trim();
    }
    return s;
  };

  val = stripMatchingQuotes(val);

  // Guard against accidental "KEY=value" paste into a cloud deployment env-var Value box
  // (e.g. setting VITE_RUNTIME_ENV to "VITE_RUNTIME_ENV=development").
  const exactPrefix = `${key.toLowerCase()}=`;
  if (val.toLowerCase().startsWith(exactPrefix)) {
    val = stripMatchingQuotes(val.slice(exactPrefix.length).trim());
  }

  return val;
}

export function isValidGcpProjectIdClient(candidate: string | undefined): boolean {
  const val = (candidate || '').trim();
  return /^[a-z][a-z0-9-]{4,28}[a-z0-9]$/.test(val);
}

function requireNonPlaceholder(val: string | undefined, fieldName: string, envName: string): string {
  const trimmed = normalizeConfigEnvValue(fieldName, val);
  if (!trimmed || KNOWN_PLACEHOLDERS.has(trimmed.toLowerCase())) {
    throw new Error(
      `[Dr. T Frontend Config BLOCKED] VITE_RUNTIME_ENV=${envName} requires explicit non-placeholder ${fieldName} (silent fallback to development configuration is disabled).`
    );
  }
  return trimmed;
}

export function resolveAndValidateClientFirebaseConfig(
  env: ClientEnvInput,
  options?: {
    viteCommand?: 'serve' | 'build';
    viteMode?: string;
    devFallbackConfig?: DevFirebaseConfigShape | null;
  }
): ResolvedClientFirebaseConfig {
  const rawEnv = normalizeConfigEnvValue('VITE_RUNTIME_ENV', env.VITE_RUNTIME_ENV).toLowerCase();
  const viteMode = String(options?.viteMode || env.MODE || '').trim().toLowerCase();
  const viteCommand = options?.viteCommand;

  let environment: ClientRuntimeEnv;
  if (rawEnv) {
    if (!VALID_CLIENT_ENVS.has(rawEnv as ClientRuntimeEnv)) {
      throw new Error(
        `[Dr. T Frontend Config BLOCKED] Invalid VITE_RUNTIME_ENV='${rawEnv}'. Expected one of: development, staging, production, public_judging.`
      );
    }
    environment = rawEnv as ClientRuntimeEnv;
  } else {
    // Only Vite's interactive dev server (`vite` / `serve` in `development` mode)
    // is permitted to resolve as explicit development without VITE_RUNTIME_ENV.
    // All `vite build` / production-mode executions fail closed when VITE_RUNTIME_ENV is missing.
    const isExplicitLocalServeDev =
      (viteCommand === 'serve' && viteMode === 'development') ||
      (viteCommand !== 'build' && env.DEV === true && env.PROD !== true && viteMode === 'development');

    if (!isExplicitLocalServeDev) {
      throw new Error(
        `[Dr. T Frontend Config BLOCKED] Missing VITE_RUNTIME_ENV during ${viteCommand || 'production'} build (mode='${viteMode || 'unknown'}'). Silent fallback to development configuration is disabled. Set VITE_RUNTIME_ENV explicitly (development | staging | production | public_judging).`
      );
    }
    environment = 'development';
  }

  // Prevent contradictory Vite mode vs VITE_RUNTIME_ENV when running `vite build --mode development`
  // with non-dev VITE_RUNTIME_ENV, or `vite build --mode production` with `development`?
  // Note: CI dev builds may run `VITE_RUNTIME_ENV=development vite build`, which is explicitly tagged `development`.
  if (environment !== 'development') {
    const projectId = requireNonPlaceholder(env.VITE_FIREBASE_PROJECT_ID, 'VITE_FIREBASE_PROJECT_ID', environment);
    if (!isValidGcpProjectIdClient(projectId)) {
      throw new Error(
        `[Dr. T Frontend Config BLOCKED] VITE_RUNTIME_ENV=${environment} received invalid VITE_FIREBASE_PROJECT_ID format.`
      );
    }

    const firestoreDatabaseId = requireNonPlaceholder(
      env.VITE_FIRESTORE_DATABASE_ID,
      'VITE_FIRESTORE_DATABASE_ID',
      environment
    );
    if (isDevelopmentFirestoreDatabaseId(firestoreDatabaseId) || firestoreDatabaseId === '(default)') {
      throw new Error(
        `[Dr. T Frontend Config BLOCKED] VITE_RUNTIME_ENV=${environment} cannot target '${firestoreDatabaseId}' (development database or implicit default disallowed).`
      );
    }

    const apiKey = requireNonPlaceholder(env.VITE_FIREBASE_API_KEY, 'VITE_FIREBASE_API_KEY', environment);
    const appId = requireNonPlaceholder(env.VITE_FIREBASE_APP_ID, 'VITE_FIREBASE_APP_ID', environment);
    const messagingSenderId = requireNonPlaceholder(
      env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      'VITE_FIREBASE_MESSAGING_SENDER_ID',
      environment
    );
    const syntheticOnlyVal = normalizeConfigEnvValue(
      'VITE_SYNTHETIC_ONLY',
      env.VITE_SYNTHETIC_ONLY
    ).toLowerCase();

    if (environment === 'public_judging' && syntheticOnlyVal !== 'true') {
      throw new Error(
        `[Dr. T Frontend Config BLOCKED] VITE_RUNTIME_ENV=public_judging requires VITE_SYNTHETIC_ONLY=true.`
      );
    }

    return {
      environment,
      isSyntheticOnly: environment === 'public_judging' || syntheticOnlyVal === 'true',
      projectId,
      firestoreDatabaseId,
      appId,
      apiKey,
      authDomain:
        normalizeConfigEnvValue('VITE_FIREBASE_AUTH_DOMAIN', env.VITE_FIREBASE_AUTH_DOMAIN) ||
        `${projectId}.firebaseapp.com`,
      storageBucket:
        normalizeConfigEnvValue('VITE_FIREBASE_STORAGE_BUCKET', env.VITE_FIREBASE_STORAGE_BUCKET) ||
        `${projectId}.firebasestorage.app`,
      messagingSenderId,
    };
  }

  const devCfg = options?.devFallbackConfig || null;
  const projectId =
    normalizeConfigEnvValue('VITE_FIREBASE_PROJECT_ID', env.VITE_FIREBASE_PROJECT_ID) ||
    String(devCfg?.projectId || '').trim();
  const firestoreDatabaseId =
    normalizeConfigEnvValue('VITE_FIRESTORE_DATABASE_ID', env.VITE_FIRESTORE_DATABASE_ID) ||
    String(devCfg?.firestoreDatabaseId || '').trim();
  const appId =
    normalizeConfigEnvValue('VITE_FIREBASE_APP_ID', env.VITE_FIREBASE_APP_ID) ||
    String(devCfg?.appId || '').trim();
  const apiKey =
    normalizeConfigEnvValue('VITE_FIREBASE_API_KEY', env.VITE_FIREBASE_API_KEY) ||
    String(devCfg?.apiKey || '').trim();
  const messagingSenderId =
    normalizeConfigEnvValue('VITE_FIREBASE_MESSAGING_SENDER_ID', env.VITE_FIREBASE_MESSAGING_SENDER_ID) ||
    String(devCfg?.messagingSenderId || '').trim();

  if (!projectId || !firestoreDatabaseId || !apiKey || !appId) {
    throw new Error(
      `[Dr. T Frontend Config BLOCKED] Development mode requires valid Firebase configuration (firebase-applet-config.json or explicit VITE_FIREBASE_* variables).`
    );
  }

  return {
    environment: 'development',
    isSyntheticOnly: true,
    projectId,
    firestoreDatabaseId,
    appId,
    apiKey,
    authDomain:
      normalizeConfigEnvValue('VITE_FIREBASE_AUTH_DOMAIN', env.VITE_FIREBASE_AUTH_DOMAIN) ||
      String(devCfg?.authDomain || `${projectId}.firebaseapp.com`).trim(),
    storageBucket:
      normalizeConfigEnvValue('VITE_FIREBASE_STORAGE_BUCKET', env.VITE_FIREBASE_STORAGE_BUCKET) ||
      String(devCfg?.storageBucket || `${projectId}.firebasestorage.app`).trim(),
    messagingSenderId,
  };
}

export function checkFrontendBackendEnvAgreement(
  clientConfig: ResolvedClientFirebaseConfig,
  serverStatus: {
    environment?: string;
    gcpProjectId?: string;
    persistenceStatus?: { firestoreProjectId?: string; firestoreDatabaseId?: string };
    services?: { cloudFirestore?: { databaseId?: string } };
  }
): { agrees: boolean; mismatchReason?: string } {
  const serverEnv = String(serverStatus.environment || '').trim().toLowerCase();
  if (!serverEnv) {
    return { agrees: false, mismatchReason: 'Backend environment missing from server status.' };
  }
  if (serverEnv !== clientConfig.environment) {
    return {
      agrees: false,
      mismatchReason: `Frontend (${clientConfig.environment}) disagrees with backend (${serverEnv}).`,
    };
  }
  const serverProject =
    serverStatus.persistenceStatus?.firestoreProjectId || serverStatus.gcpProjectId;
  const serverDb =
    serverStatus.persistenceStatus?.firestoreDatabaseId ||
    serverStatus.services?.cloudFirestore?.databaseId;

  if (serverProject && serverProject !== clientConfig.projectId) {
    return {
      agrees: false,
      mismatchReason: `Frontend Firebase project '${clientConfig.projectId}' disagrees with backend '${serverProject}'.`,
    };
  }
  if (serverDb && serverDb !== clientConfig.firestoreDatabaseId) {
    return {
      agrees: false,
      mismatchReason: `Frontend Firestore DB '${clientConfig.firestoreDatabaseId}' disagrees with backend '${serverDb}'.`,
    };
  }
  return { agrees: true };
}
