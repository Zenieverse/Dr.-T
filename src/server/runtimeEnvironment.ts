// ============================================================================
// DR. T — ENVIRONMENT ISOLATION & FAIL-CLOSED PRODUCTION STARTUP VALIDATOR
// Prevents staging/production/public-judging builds from silently falling back
// to development Firestore databases, config JSONs, ephemeral guest secrets,
// or unverified multi-instance Cloud Run deployments.
// ============================================================================

import fs from 'fs';
import path from 'path';
import { normalizeConfigEnvValue } from '../config/clientFirebaseValidation';

export type DrTRuntimeEnvironment =
  | 'development'
  | 'staging'
  | 'production'
  | 'public_judging';

export const DEV_FIRESTORE_PROJECT_ID = 'gen-lang-client-0611153209';
export const DEV_FIRESTORE_DATABASE_ID =
  'ai-studio-drt-2e1619d9-9932-4538-9b6c-26b489ebfec2';

const VALID_ENVIRONMENTS = new Set<DrTRuntimeEnvironment>([
  'development',
  'staging',
  'production',
  'public_judging',
]);

const KNOWN_PLACEHOLDER_SECRETS = new Set([
  'changeme',
  'replace-me',
  'your-secret-here',
  'secret',
  'test-secret',
  'default',
  'dev-secret',
]);

export class ProductionConfigurationError extends Error {
  public readonly environment: DrTRuntimeEnvironment;
  constructor(environment: DrTRuntimeEnvironment, message: string) {
    super(message);
    this.name = 'ProductionConfigurationError';
    this.environment = environment;
  }
}

export type ScalingVerificationStatus =
  | 'verified_single_instance'
  | 'unverified_infrastructure_scaling'
  | 'unsafe_multi_instance';

export interface ProcessLocalStateEntry {
  store: string;
  module: string;
  classification:
    | 'critical_single_instance_required'
    | 'demo_isolated_session_map'
    | 'process_local_best_effort'
    | 'safe_public_key_cache'
    | 'process_local_observability'
    | 'module_scoped_session_state';
  multiInstanceImpact: string;
}

export const PROCESS_LOCAL_STATE_INVENTORY: ProcessLocalStateEntry[] = [
  {
    store: 'PopulationHealthService.state',
    module: 'src/server/populationHealthService.ts',
    classification: 'critical_single_instance_required',
    multiInstanceImpact:
      'Write-through updates local process memory without cross-instance cache invalidation; requires Cloud Run Admin API verified maxInstanceCount=1 or stateless Firestore/Redis cache migration.',
  },
  {
    store: 'PopulationHealthService.guestSandboxes',
    module: 'src/server/populationHealthService.ts',
    classification: 'demo_isolated_session_map',
    multiInstanceImpact:
      'In-memory bounded map (max 200 guest sandboxes, zero Firestore writes); multi-instance routing would split interactive guest sessions across containers.',
  },
  {
    store: 'populationHealthAuth.rateLimitBuckets',
    module: 'src/server/populationHealthAuth.ts',
    classification: 'process_local_best_effort',
    multiInstanceImpact:
      'Sliding-window per-IP/actor limiter stored in process memory; best-effort only and NOT globally enforced across Cloud Run instances.',
  },
  {
    store: 'populationHealthAuth.certCache',
    module: 'src/server/populationHealthAuth.ts',
    classification: 'safe_public_key_cache',
    multiInstanceImpact:
      'Read-only cache of Google RS256 public certificates honoring Cache-Control max-age; safe per instance.',
  },
  {
    store: 'populationHealthFirestoreStore.cachedProbe',
    module: 'src/server/populationHealthFirestoreStore.ts',
    classification: 'process_local_observability',
    multiInstanceImpact:
      'Diagnostic connectivity cache (15s TTL, bypassed with ?refresh=1); per-instance observability only.',
  },
  {
    store: 'GeminiCircuitBreaker.breakers',
    module: 'src/server/geminiCircuitBreaker.ts',
    classification: 'process_local_best_effort',
    multiInstanceImpact:
      'Per-instance 30s model cooldown circuit breaker; independent instances open/close independently.',
  },
  {
    store: 'mcpSseSessions / capturedOrdersCache / investigations / uploadedBuffers',
    module: 'server.impl.ts / src/server/payflowServerService.ts / src/server/solarFilamentService.ts',
    classification: 'module_scoped_session_state',
    multiInstanceImpact:
      'In-process SSE/session buffers for optional non-Population modules; require single instance or sticky sessions in production.',
  },
];

export interface MultiInstanceSafetyDiagnostics {
  environment: DrTRuntimeEnvironment;
  multiInstanceSafe: boolean;
  status: ScalingVerificationStatus;
  declaredMaxInstances: number | null;
  verifiedInfrastructureMaxInstances: number | null;
  verificationSource:
    | 'cloud_run_admin_api'
    | 'local_development_sandbox'
    | 'not_verified';
  rateLimiterScope: 'process_local_best_effort';
  rateLimiterGloballyEnforced: false;
  reason: string;
}

export interface InfrastructureScalingVerification {
  verifiedInfrastructureMaxInstances: number | null;
  verificationSource: 'cloud_run_admin_api' | 'not_verified';
  verificationError?: string;
}

export interface ResolvedServerFirebaseConfig {
  environment: DrTRuntimeEnvironment;
  projectId: string;
  databaseId: string;
  configSource: 'environment_variables' | 'firebase_applet_config' | 'dev_default';
  hasGuestTokenSecret: boolean;
  guestTokenSecretSource: 'env_secret_manager' | 'ephemeral_dev_csprng';
  isSyntheticOnly: boolean;
  singleInstanceRecommended: boolean;
}

export interface RedactedRuntimeDiagnostics {
  environment: DrTRuntimeEnvironment;
  projectId: string;
  databaseId: string;
  configSource: ResolvedServerFirebaseConfig['configSource'];
  isSyntheticOnly: boolean;
  varsPresent: {
    DRT_RUNTIME_ENV: boolean;
    GOOGLE_CLOUD_PROJECT: boolean;
    FIRESTORE_DATABASE_ID: boolean;
    POPULATION_GUEST_TOKEN_SECRET: boolean;
    DRT_JUDGING_RESET_TOKEN: boolean;
    GEMINI_API_KEY: boolean;
    PRESAGE_API_KEY: boolean;
    K_SERVICE: boolean;
    K_REVISION: boolean;
  };
  guestTokenSecretSource: ResolvedServerFirebaseConfig['guestTokenSecretSource'];
  singleInstanceRecommended: boolean;
  multiInstanceSafety: MultiInstanceSafetyDiagnostics;
}

function readDevConfigFile(): { projectId?: string; firestoreDatabaseId?: string } | null {
  try {
    const cfgPath = path.join(process.cwd(), 'firebase-applet-config.json');
    if (!fs.existsSync(cfgPath)) return null;
    return JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
  } catch {
    return null;
  }
}

export function resolveRuntimeEnvironment(
  env: NodeJS.ProcessEnv = process.env
): DrTRuntimeEnvironment {
  const explicit = normalizeConfigEnvValue('DRT_RUNTIME_ENV', env.DRT_RUNTIME_ENV).toLowerCase();
  if (explicit) {
    if (!VALID_ENVIRONMENTS.has(explicit as DrTRuntimeEnvironment)) {
      throw new ProductionConfigurationError(
        'production',
        `Invalid DRT_RUNTIME_ENV value '${explicit}'. Expected one of: development, staging, production, public_judging.`
      );
    }
    return explicit as DrTRuntimeEnvironment;
  }

  if (env.NODE_ENV === 'production') {
    return 'production';
  }

  // AI Studio dev sandbox runs under K_SERVICE=ais-dev-*. Any non-dev Cloud Run service
  // (e.g. ais-pre-* or standalone deployment) defaults to fail-closed production mode.
  if (env.K_SERVICE && !env.K_SERVICE.startsWith('ais-dev-')) {
    return 'production';
  }

  return 'development';
}

export function isNonDevIsolatedEnvironment(envName: DrTRuntimeEnvironment): boolean {
  return envName === 'production' || envName === 'staging' || envName === 'public_judging';
}

export function validateGuestTokenSecretValue(
  secret: string | undefined,
  environment: DrTRuntimeEnvironment
): boolean {
  const trimmed = (secret || '').trim();
  if (!trimmed) return false;
  if (trimmed.length < 32) {
    throw new ProductionConfigurationError(
      environment,
      `[${environment}] POPULATION_GUEST_TOKEN_SECRET must be at least 32 characters (Secret Manager provisioned); startup aborted.`
    );
  }
  if (KNOWN_PLACEHOLDER_SECRETS.has(trimmed.toLowerCase())) {
    throw new ProductionConfigurationError(
      environment,
      `[${environment}] POPULATION_GUEST_TOKEN_SECRET cannot use a placeholder literal; startup aborted.`
    );
  }
  return true;
}

export function isValidGcpProjectId(candidate: string | undefined): boolean {
  const val = (candidate || '').trim();
  // Valid GCP project IDs are 6-30 lowercase letters, digits, hyphens (never keys like sk-...).
  return /^[a-z][a-z0-9-]{4,28}[a-z0-9]$/.test(val);
}

function parseDeclaredMaxInstances(env: NodeJS.ProcessEnv): number | null {
  const raw = normalizeConfigEnvValue('CLOUD_RUN_MAX_INSTANCES', env.CLOUD_RUN_MAX_INSTANCES);
  if (!raw) return null;
  const num = Number(raw);
  return Number.isFinite(num) && num >= 0 ? Math.trunc(num) : null;
}

export function getMultiInstanceSafetyDiagnostics(
  env: NodeJS.ProcessEnv = process.env,
  infraVerification?: InfrastructureScalingVerification | null
): MultiInstanceSafetyDiagnostics {
  const environment = resolveRuntimeEnvironment(env);
  const declaredMaxInstances = parseDeclaredMaxInstances(env);
  const verifiedMax =
    typeof infraVerification?.verifiedInfrastructureMaxInstances === 'number'
      ? infraVerification.verifiedInfrastructureMaxInstances
      : null;

  if (!isNonDevIsolatedEnvironment(environment)) {
    return {
      environment,
      multiInstanceSafe: false,
      status: 'unverified_infrastructure_scaling',
      declaredMaxInstances,
      verifiedInfrastructureMaxInstances: verifiedMax,
      verificationSource:
        infraVerification?.verificationSource === 'cloud_run_admin_api'
          ? 'cloud_run_admin_api'
          : 'local_development_sandbox',
      rateLimiterScope: 'process_local_best_effort',
      rateLimiterGloballyEnforced: false,
      reason:
        'Development sandbox runs locally/single-container; process-local state caching and best-effort rate limiting are active.',
    };
  }

  if (verifiedMax === 1) {
    return {
      environment,
      multiInstanceSafe: false,
      status: 'verified_single_instance',
      declaredMaxInstances,
      verifiedInfrastructureMaxInstances: 1,
      verificationSource: 'cloud_run_admin_api',
      rateLimiterScope: 'process_local_best_effort',
      rateLimiterGloballyEnforced: false,
      reason:
        'Cloud Run Admin API verified maxInstanceCount=1; single-instance containment confirmed while process-local cache remains in service.',
    };
  }

  if (verifiedMax !== null && verifiedMax > 1) {
    return {
      environment,
      multiInstanceSafe: false,
      status: 'unsafe_multi_instance',
      declaredMaxInstances,
      verifiedInfrastructureMaxInstances: verifiedMax,
      verificationSource: 'cloud_run_admin_api',
      rateLimiterScope: 'process_local_best_effort',
      rateLimiterGloballyEnforced: false,
      reason: `Cloud Run Admin API reports maxInstanceCount=${verifiedMax}, which violates single-instance safety for process-local state caches.`,
    };
  }

  return {
    environment,
    multiInstanceSafe: false,
    status:
      declaredMaxInstances !== null && declaredMaxInstances > 1
        ? 'unsafe_multi_instance'
        : 'unverified_infrastructure_scaling',
    declaredMaxInstances,
    verifiedInfrastructureMaxInstances: null,
    verificationSource: 'not_verified',
    rateLimiterScope: 'process_local_best_effort',
    rateLimiterGloballyEnforced: false,
    reason:
      infraVerification?.verificationError ||
      'Cloud Run Admin API scaling limit (maxInstanceCount=1) is not verified; self-declared environment variables are insufficient proof of single-instance scaling.',
  };
}

export function resolveServerFirebaseConfig(
  env: NodeJS.ProcessEnv = process.env,
  options?: { projectId?: string; databaseId?: string; skipStrictEnvValidation?: boolean }
): ResolvedServerFirebaseConfig {
  const environment = resolveRuntimeEnvironment(env);
  const rawEnvProj = (
    options?.projectId ||
    normalizeConfigEnvValue('DRT_FIREBASE_PROJECT_ID', env.DRT_FIREBASE_PROJECT_ID) ||
    normalizeConfigEnvValue('GOOGLE_CLOUD_PROJECT', env.GOOGLE_CLOUD_PROJECT) ||
    ''
  ).trim();
  const validEnvProject = isValidGcpProjectId(rawEnvProj) ? rawEnvProj : '';
  const envDb = (
    options?.databaseId ||
    normalizeConfigEnvValue('FIRESTORE_DATABASE_ID', env.FIRESTORE_DATABASE_ID) ||
    ''
  ).trim();
  const guestSecret = (env.POPULATION_GUEST_TOKEN_SECRET || '').trim();
  const devForbiddenDb = (
    normalizeConfigEnvValue('DRT_DEV_FIRESTORE_DATABASE_ID', env.DRT_DEV_FIRESTORE_DATABASE_ID) ||
    DEV_FIRESTORE_DATABASE_ID
  ).trim();
  const syntheticOnlyFlag =
    normalizeConfigEnvValue('DRT_SYNTHETIC_ONLY', env.DRT_SYNTHETIC_ONLY).toLowerCase() === 'true';

  if (isNonDevIsolatedEnvironment(environment)) {
    if (!options?.skipStrictEnvValidation) {
      if (!validEnvProject) {
        throw new ProductionConfigurationError(
          environment,
          `[${environment}] Refusing startup: a valid GCP project ID must be provided via DRT_FIREBASE_PROJECT_ID or GOOGLE_CLOUD_PROJECT (silent fallback to firebase-applet-config.json is disabled).`
        );
      }
      if (!envDb) {
        throw new ProductionConfigurationError(
          environment,
          `[${environment}] Refusing startup: FIRESTORE_DATABASE_ID must be set explicitly (silent fallback to development Firestore database is disabled).`
        );
      }
      if (envDb === devForbiddenDb || envDb === DEV_FIRESTORE_DATABASE_ID || envDb === '(default)') {
        throw new ProductionConfigurationError(
          environment,
          `[${environment}] Refusing startup: FIRESTORE_DATABASE_ID ('${envDb}') matches the development Firestore database or implicit '(default)'. Provision a separate ${environment} database.`
        );
      }
      if (environment === 'public_judging' && !syntheticOnlyFlag) {
        throw new ProductionConfigurationError(
          environment,
          `[public_judging] Refusing startup: DRT_SYNTHETIC_ONLY=true is mandatory for public judging deployments.`
        );
      }
      if (!validateGuestTokenSecretValue(guestSecret, environment)) {
        throw new ProductionConfigurationError(
          environment,
          `[${environment}] Refusing startup: POPULATION_GUEST_TOKEN_SECRET must be provisioned via Secret Manager (ephemeral random secret is disabled outside development).`
        );
      }
    }

    const hasValidSecret =
      guestSecret.length >= 32 && !KNOWN_PLACEHOLDER_SECRETS.has(guestSecret.toLowerCase());

    return {
      environment,
      projectId: validEnvProject || 'Not verified',
      databaseId: envDb || 'Not verified',
      configSource: 'environment_variables',
      hasGuestTokenSecret: hasValidSecret,
      guestTokenSecretSource: hasValidSecret ? 'env_secret_manager' : 'ephemeral_dev_csprng',
      isSyntheticOnly: environment === 'public_judging' || syntheticOnlyFlag,
      singleInstanceRecommended: true,
    };
  }

  const cfgFile = readDevConfigFile();
  const fileProject = isValidGcpProjectId(cfgFile?.projectId)
    ? String(cfgFile?.projectId).trim()
    : '';
  const fileDb = String(cfgFile?.firestoreDatabaseId || '').trim();
  const explicitDevOverrideProj = isValidGcpProjectId(
    options?.projectId || env.DRT_FIREBASE_PROJECT_ID
  )
    ? String(options?.projectId || env.DRT_FIREBASE_PROJECT_ID).trim()
    : '';

  const projectId =
    explicitDevOverrideProj || fileProject || validEnvProject || DEV_FIRESTORE_PROJECT_ID;
  const databaseId = envDb || fileDb || DEV_FIRESTORE_DATABASE_ID;
  const configSource: ResolvedServerFirebaseConfig['configSource'] =
    explicitDevOverrideProj && envDb
      ? 'environment_variables'
      : fileProject
        ? 'firebase_applet_config'
        : validEnvProject && envDb
          ? 'environment_variables'
          : 'dev_default';

  const hasValidGuestSecret =
    guestSecret.length > 0 ? validateGuestTokenSecretValue(guestSecret, environment) : false;

  return {
    environment,
    projectId,
    databaseId,
    configSource,
    hasGuestTokenSecret: hasValidGuestSecret,
    guestTokenSecretSource: hasValidGuestSecret ? 'env_secret_manager' : 'ephemeral_dev_csprng',
    isSyntheticOnly: true,
    singleInstanceRecommended: true,
  };
}

export function redactEnvironmentDiagnostics(
  env: NodeJS.ProcessEnv = process.env,
  infraVerification?: InfrastructureScalingVerification | null
): RedactedRuntimeDiagnostics {
  const cfg = resolveServerFirebaseConfig(env);
  const multiInstanceSafety = getMultiInstanceSafetyDiagnostics(env, infraVerification);
  return {
    environment: cfg.environment,
    projectId: cfg.projectId,
    databaseId: cfg.databaseId,
    configSource: cfg.configSource,
    isSyntheticOnly: cfg.isSyntheticOnly,
    varsPresent: {
      DRT_RUNTIME_ENV: Boolean(env.DRT_RUNTIME_ENV),
      GOOGLE_CLOUD_PROJECT: Boolean(env.GOOGLE_CLOUD_PROJECT),
      FIRESTORE_DATABASE_ID: Boolean(env.FIRESTORE_DATABASE_ID),
      POPULATION_GUEST_TOKEN_SECRET: Boolean(env.POPULATION_GUEST_TOKEN_SECRET),
      DRT_JUDGING_RESET_TOKEN: Boolean(
        env.DRT_JUDGING_RESET_TOKEN || env.DRT_ADMIN_RESET_TOKEN
      ),
      GEMINI_API_KEY: Boolean(env.GEMINI_API_KEY),
      PRESAGE_API_KEY: Boolean(env.PRESAGE_API_KEY),
      K_SERVICE: Boolean(env.K_SERVICE),
      K_REVISION: Boolean(env.K_REVISION),
    },
    guestTokenSecretSource: cfg.guestTokenSecretSource,
    singleInstanceRecommended: cfg.singleInstanceRecommended,
    multiInstanceSafety,
  };
}

export function validateStartupConfiguration(
  env: NodeJS.ProcessEnv = process.env,
  infraVerification?: InfrastructureScalingVerification | null
): RedactedRuntimeDiagnostics {
  const diagnostics = redactEnvironmentDiagnostics(env, infraVerification);

  if (isNonDevIsolatedEnvironment(diagnostics.environment)) {
    const safety = diagnostics.multiInstanceSafety;
    // Fail closed: env vars (including CLOUD_RUN_MAX_INSTANCES=1 or any legacy override)
    // CANNOT verify Cloud Run infrastructure scaling. Require verified maxInstanceCount === 1
    // from Cloud Run Admin API until process-local state caching is migrated out-of-process.
    if (safety.status !== 'verified_single_instance') {
      throw new ProductionConfigurationError(
        diagnostics.environment,
        `[${diagnostics.environment}] Refusing startup: PopulationHealthService uses process-local state caching (rateLimitBuckets is also process-local only). Self-declared env vars (such as CLOUD_RUN_MAX_INSTANCES) cannot verify scaling and overrides are disabled. Reason: ${safety.reason}`
      );
    }

    // Also fail closed if Vite client env mismatches server runtime env when explicitly present.
    const viteEnv = normalizeConfigEnvValue('VITE_RUNTIME_ENV', env.VITE_RUNTIME_ENV).toLowerCase();
    if (viteEnv && viteEnv !== diagnostics.environment) {
      throw new ProductionConfigurationError(
        diagnostics.environment,
        `[${diagnostics.environment}] Refusing startup: VITE_RUNTIME_ENV ('${viteEnv}') disagrees with server environment ('${diagnostics.environment}').`
      );
    }
  }

  return diagnostics;
}

export async function verifyCloudRunSingleInstanceFromApi(
  env: NodeJS.ProcessEnv = process.env,
  customFetch?: typeof fetch
): Promise<InfrastructureScalingVerification> {
  const environment = resolveRuntimeEnvironment(env);
  if (!isNonDevIsolatedEnvironment(environment)) {
    return {
      verifiedInfrastructureMaxInstances: null,
      verificationSource: 'not_verified',
      verificationError: 'Local development mode does not require Cloud Run Admin API check.',
    };
  }

  const serviceName = (env.K_SERVICE || '').trim();
  const project =
    normalizeConfigEnvValue('DRT_FIREBASE_PROJECT_ID', env.DRT_FIREBASE_PROJECT_ID) ||
    normalizeConfigEnvValue('GOOGLE_CLOUD_PROJECT', env.GOOGLE_CLOUD_PROJECT);
  const rawRegion =
    normalizeConfigEnvValue('DRT_CLOUD_REGION', env.DRT_CLOUD_REGION) ||
    normalizeConfigEnvValue('GOOGLE_CLOUD_LOCATION', env.GOOGLE_CLOUD_LOCATION);
  const region = /^[a-z]+-[a-z]+\d+$/.test(rawRegion) ? rawRegion : '';

  if (!serviceName || !isValidGcpProjectId(project) || !region) {
    return {
      verifiedInfrastructureMaxInstances: null,
      verificationSource: 'not_verified',
      verificationError:
        'Cloud Run Admin API verification requires K_SERVICE, valid GCP project ID, and DRT_CLOUD_REGION/GOOGLE_CLOUD_LOCATION.',
    };
  }

  const fetcher = customFetch || fetch;
  try {
    let accessToken = (env.GOOGLE_OAUTH_ACCESS_TOKEN || '').trim();
    if (!accessToken) {
      const tokenRes = await fetcher(
        'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token',
        {
          headers: { 'Metadata-Flavor': 'Google' },
          signal: AbortSignal.timeout(2000),
        }
      );
      if (!tokenRes.ok) {
        return {
          verifiedInfrastructureMaxInstances: null,
          verificationSource: 'not_verified',
          verificationError: `Metadata server token lookup failed (HTTP ${tokenRes.status}).`,
        };
      }
      const tokenJson = (await tokenRes.json()) as { access_token?: string };
      accessToken = (tokenJson.access_token || '').trim();
    }

    if (!accessToken) {
      return {
        verifiedInfrastructureMaxInstances: null,
        verificationSource: 'not_verified',
        verificationError: 'No GCP access token available to query Cloud Run Admin API.',
      };
    }

    const url = `https://run.googleapis.com/v2/projects/${encodeURIComponent(project)}/locations/${encodeURIComponent(region)}/services/${encodeURIComponent(serviceName)}`;
    const runRes = await fetcher(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
      signal: AbortSignal.timeout(3000),
    });
    if (!runRes.ok) {
      return {
        verifiedInfrastructureMaxInstances: null,
        verificationSource: 'not_verified',
        verificationError: `Cloud Run Admin API lookup failed (HTTP ${runRes.status}).`,
      };
    }

    const svcJson = (await runRes.json()) as {
      template?: { scaling?: { maxInstanceCount?: number } };
    };
    const maxInstanceCount = svcJson?.template?.scaling?.maxInstanceCount;
    if (typeof maxInstanceCount !== 'number' || !Number.isFinite(maxInstanceCount)) {
      return {
        verifiedInfrastructureMaxInstances: null,
        verificationSource: 'not_verified',
        verificationError: 'Cloud Run Admin API response missing template.scaling.maxInstanceCount.',
      };
    }

    return {
      verifiedInfrastructureMaxInstances: maxInstanceCount,
      verificationSource: 'cloud_run_admin_api',
    };
  } catch (err: any) {
    return {
      verifiedInfrastructureMaxInstances: null,
      verificationSource: 'not_verified',
      verificationError: err?.message || 'Cloud Run Admin API verification request failed.',
    };
  }
}

export async function verifyStartupConfigurationAsync(
  env: NodeJS.ProcessEnv = process.env,
  customFetch?: typeof fetch
): Promise<RedactedRuntimeDiagnostics> {
  const environment = resolveRuntimeEnvironment(env);
  const infraVerification = isNonDevIsolatedEnvironment(environment)
    ? await verifyCloudRunSingleInstanceFromApi(env, customFetch)
    : undefined;
  return validateStartupConfiguration(env, infraVerification);
}
