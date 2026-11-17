// ============================================================================
// DR. T — ENVIRONMENT ISOLATION & FAIL-CLOSED PRODUCTION STARTUP VALIDATOR
// Prevents staging/production/public-judging builds from silently falling back
// to development Firestore databases, config JSONs, or ephemeral guest secrets.
// ============================================================================

import fs from 'fs';
import path from 'path';

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
    GEMINI_API_KEY: boolean;
    PRESAGE_API_KEY: boolean;
    K_SERVICE: boolean;
    K_REVISION: boolean;
  };
  guestTokenSecretSource: ResolvedServerFirebaseConfig['guestTokenSecretSource'];
  singleInstanceRecommended: boolean;
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
  const explicit = (env.DRT_RUNTIME_ENV || '').trim().toLowerCase();
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

export function resolveServerFirebaseConfig(
  env: NodeJS.ProcessEnv = process.env,
  options?: { projectId?: string; databaseId?: string; skipStrictEnvValidation?: boolean }
): ResolvedServerFirebaseConfig {
  const environment = resolveRuntimeEnvironment(env);
  const rawEnvProj = (options?.projectId || env.DRT_FIREBASE_PROJECT_ID || env.GOOGLE_CLOUD_PROJECT || '').trim();
  const validEnvProject = isValidGcpProjectId(rawEnvProj) ? rawEnvProj : '';
  const envDb = (options?.databaseId || env.FIRESTORE_DATABASE_ID || '').trim();
  const guestSecret = (env.POPULATION_GUEST_TOKEN_SECRET || '').trim();
  const devForbiddenDb = (env.DRT_DEV_FIRESTORE_DATABASE_ID || DEV_FIRESTORE_DATABASE_ID).trim();

  if (isNonDevIsolatedEnvironment(environment) && !options?.skipStrictEnvValidation) {
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
    if (envDb === devForbiddenDb || envDb === DEV_FIRESTORE_DATABASE_ID) {
      throw new ProductionConfigurationError(
        environment,
        `[${environment}] Refusing startup: FIRESTORE_DATABASE_ID ('${envDb}') matches the development Firestore database. Provision a separate ${environment} database.`
      );
    }
    if (environment === 'public_judging' && env.DRT_SYNTHETIC_ONLY !== 'true') {
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

    return {
      environment,
      projectId: validEnvProject,
      databaseId: envDb,
      configSource: 'environment_variables',
      hasGuestTokenSecret: true,
      guestTokenSecretSource: 'env_secret_manager',
      isSyntheticOnly: environment === 'public_judging' || env.DRT_SYNTHETIC_ONLY === 'true',
      singleInstanceRecommended: true,
    };
  }

  // Development environment preserves existing verified config:
  // firebase-applet-config.json takes precedence unless DRT_FIREBASE_PROJECT_ID
  // or a valid non-credential GOOGLE_CLOUD_PROJECT is explicitly provided without applet config.
  const cfgFile = readDevConfigFile();
  const fileProject = isValidGcpProjectId(cfgFile?.projectId) ? String(cfgFile?.projectId).trim() : '';
  const fileDb = String(cfgFile?.firestoreDatabaseId || '').trim();
  const explicitDevOverrideProj = isValidGcpProjectId(options?.projectId || env.DRT_FIREBASE_PROJECT_ID)
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
  env: NodeJS.ProcessEnv = process.env
): RedactedRuntimeDiagnostics {
  const cfg = resolveServerFirebaseConfig(env);
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
      GEMINI_API_KEY: Boolean(env.GEMINI_API_KEY),
      PRESAGE_API_KEY: Boolean(env.PRESAGE_API_KEY),
      K_SERVICE: Boolean(env.K_SERVICE),
      K_REVISION: Boolean(env.K_REVISION),
    },
    guestTokenSecretSource: cfg.guestTokenSecretSource,
    singleInstanceRecommended: cfg.singleInstanceRecommended,
  };
}

export function validateStartupConfiguration(
  env: NodeJS.ProcessEnv = process.env
): RedactedRuntimeDiagnostics {
  const diagnostics = redactEnvironmentDiagnostics(env);
  if (isNonDevIsolatedEnvironment(diagnostics.environment)) {
    const maxInst = Number(env.CLOUD_RUN_MAX_INSTANCES || '0');
    if (maxInst > 1 && env.DRT_ALLOW_MULTI_INSTANCE !== 'true') {
      throw new ProductionConfigurationError(
        diagnostics.environment,
        `[${diagnostics.environment}] Refusing startup with CLOUD_RUN_MAX_INSTANCES=${maxInst}: PopulationHealthService currently uses process-local state caching. Set max-instances=1 or complete stateless Firestore cache migration before enabling DRT_ALLOW_MULTI_INSTANCE=true.`
      );
    }
  }
  return diagnostics;
}
