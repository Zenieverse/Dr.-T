// ============================================================================
// DR. T — PRODUCTION DATA ISOLATION & FAIL-CLOSED STARTUP TEST SUITE
// Verifies Tasks 1-4 & Secret Redaction without touching real Firestore/prod.
// ============================================================================

import assert from 'assert';
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import {
  DEV_FIRESTORE_DATABASE_ID,
  DEV_FIRESTORE_PROJECT_ID,
  ProductionConfigurationError,
  redactEnvironmentDiagnostics,
  resolveRuntimeEnvironment,
  resolveServerFirebaseConfig,
  validateStartupConfiguration,
} from '../src/server/runtimeEnvironment';
import { PopulationHealthService } from '../src/server/populationHealthService';

let passed = 0;
function check(name: string, fn: () => void) {
  try {
    fn();
    console.log(`✅ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`❌ FAIL: ${name}`, err);
    process.exitCode = 1;
  }
}

console.log('🔒 DR. T PRODUCTION DATA ISOLATION & STARTUP VALIDATION SUITE');
console.log('==============================================================');

// 1. Development continues using verified dev config cleanly
check('Development resolves existing verified Firestore project & database', () => {
  const env = { DRT_RUNTIME_ENV: 'development' } as NodeJS.ProcessEnv;
  const cfg = resolveServerFirebaseConfig(env);
  assert.strictEqual(cfg.environment, 'development');
  assert.strictEqual(cfg.projectId, DEV_FIRESTORE_PROJECT_ID);
  assert.strictEqual(cfg.databaseId, DEV_FIRESTORE_DATABASE_ID);
});

check('AI Studio dev K_SERVICE=ais-dev-* resolves to development mode', () => {
  const env = {
    K_SERVICE: 'ais-dev-4s4jvpipr3mh3mz6x2hpfp',
    NODE_ENV: 'development',
  } as NodeJS.ProcessEnv;
  assert.strictEqual(resolveRuntimeEnvironment(env), 'development');
});

check('Non-dev Cloud Run K_SERVICE=ais-pre-* defaults to production fail-closed mode', () => {
  const env = {
    K_SERVICE: 'ais-pre-4s4jvpipr3mh3mz6x2hpfp',
  } as NodeJS.ProcessEnv;
  assert.strictEqual(resolveRuntimeEnvironment(env), 'production');
});

const SECRET_SENTINEL = 'SENTINEL_TOP_SECRET_VALUE_998877665544332211';

check('AI Studio sk-* control-plane token in GOOGLE_CLOUD_PROJECT never overrides dev config or leaks in prod errors', () => {
  const devCfg = resolveServerFirebaseConfig({
    DRT_RUNTIME_ENV: 'development',
    GOOGLE_CLOUD_PROJECT: 'sk-FAKE_TOKEN_SHOULD_NEVER_BE_PROJECT_ID',
  });
  assert.strictEqual(devCfg.projectId, DEV_FIRESTORE_PROJECT_ID);
  assert.strictEqual(devCfg.databaseId, DEV_FIRESTORE_DATABASE_ID);

  let caughtMsg = '';
  try {
    validateStartupConfiguration({
      DRT_RUNTIME_ENV: 'production',
      GOOGLE_CLOUD_PROJECT: 'sk-FAKE_TOKEN_SHOULD_NEVER_LEAK',
      FIRESTORE_DATABASE_ID: 'drt-prod-clinical-db',
      POPULATION_GUEST_TOKEN_SECRET: SECRET_SENTINEL,
    });
  } catch (err: any) {
    caughtMsg = err?.message || '';
  }
  assert.ok(caughtMsg.includes('Refusing startup'));
  assert.strictEqual(caughtMsg.includes('sk-FAKE_TOKEN_SHOULD_NEVER_LEAK'), false);
});

// 2. Production refuses to start with missing / shared dev database config or weak guest secret

check('Production refuses startup when GOOGLE_CLOUD_PROJECT is missing', () => {
  assert.throws(
    () =>
      validateStartupConfiguration({
        DRT_RUNTIME_ENV: 'production',
        FIRESTORE_DATABASE_ID: 'drt-prod-clinical-db',
        POPULATION_GUEST_TOKEN_SECRET: SECRET_SENTINEL,
      }),
    ProductionConfigurationError
  );
});

check('Production refuses startup when FIRESTORE_DATABASE_ID is missing (no silent dev fallback)', () => {
  assert.throws(
    () =>
      validateStartupConfiguration({
        DRT_RUNTIME_ENV: 'production',
        GOOGLE_CLOUD_PROJECT: 'drt-prod-project',
        POPULATION_GUEST_TOKEN_SECRET: SECRET_SENTINEL,
      }),
    ProductionConfigurationError
  );
});

check('Production refuses startup when FIRESTORE_DATABASE_ID equals development DB', () => {
  assert.throws(
    () =>
      validateStartupConfiguration({
        DRT_RUNTIME_ENV: 'production',
        GOOGLE_CLOUD_PROJECT: DEV_FIRESTORE_PROJECT_ID,
        FIRESTORE_DATABASE_ID: DEV_FIRESTORE_DATABASE_ID,
        POPULATION_GUEST_TOKEN_SECRET: SECRET_SENTINEL,
      }),
    (err: any) =>
      err instanceof ProductionConfigurationError &&
      err.message.includes('matches the development Firestore database')
  );
});

check('Staging refuses startup when pointing to development Firestore DB', () => {
  assert.throws(
    () =>
      validateStartupConfiguration({
        DRT_RUNTIME_ENV: 'staging',
        GOOGLE_CLOUD_PROJECT: DEV_FIRESTORE_PROJECT_ID,
        FIRESTORE_DATABASE_ID: DEV_FIRESTORE_DATABASE_ID,
        POPULATION_GUEST_TOKEN_SECRET: SECRET_SENTINEL,
      }),
    ProductionConfigurationError
  );
});

check('Production refuses startup when POPULATION_GUEST_TOKEN_SECRET is missing or short', () => {
  assert.throws(
    () =>
      validateStartupConfiguration({
        DRT_RUNTIME_ENV: 'production',
        GOOGLE_CLOUD_PROJECT: 'drt-prod-project',
        FIRESTORE_DATABASE_ID: 'drt-prod-clinical-db',
      }),
    ProductionConfigurationError
  );
  assert.throws(
    () =>
      validateStartupConfiguration({
        DRT_RUNTIME_ENV: 'production',
        GOOGLE_CLOUD_PROJECT: 'drt-prod-project',
        FIRESTORE_DATABASE_ID: 'drt-prod-clinical-db',
        POPULATION_GUEST_TOKEN_SECRET: 'too-short',
      }),
    ProductionConfigurationError
  );
  assert.throws(
    () =>
      validateStartupConfiguration({
        DRT_RUNTIME_ENV: 'production',
        GOOGLE_CLOUD_PROJECT: 'drt-prod-project',
        FIRESTORE_DATABASE_ID: 'drt-prod-clinical-db',
        POPULATION_GUEST_TOKEN_SECRET: 'changeme',
      }),
    ProductionConfigurationError
  );
});

check('Production refuses CLOUD_RUN_MAX_INSTANCES=4 AND fails closed when CLOUD_RUN_MAX_INSTANCES=1 is only an unverified env var', () => {
  assert.throws(
    () =>
      validateStartupConfiguration({
        DRT_RUNTIME_ENV: 'production',
        GOOGLE_CLOUD_PROJECT: 'drt-prod-project',
        FIRESTORE_DATABASE_ID: 'drt-prod-clinical-db',
        POPULATION_GUEST_TOKEN_SECRET: SECRET_SENTINEL,
        CLOUD_RUN_MAX_INSTANCES: '4',
      }),
    ProductionConfigurationError
  );
  // Env var alone cannot prove Cloud Run infrastructure scaling
  assert.throws(
    () =>
      validateStartupConfiguration({
        DRT_RUNTIME_ENV: 'production',
        GOOGLE_CLOUD_PROJECT: 'drt-prod-project',
        FIRESTORE_DATABASE_ID: 'drt-prod-clinical-db',
        POPULATION_GUEST_TOKEN_SECRET: SECRET_SENTINEL,
        CLOUD_RUN_MAX_INSTANCES: '1',
      }),
    ProductionConfigurationError
  );
  // Verified Cloud Run Admin API maxInstanceCount=1 passes
  const verified = validateStartupConfiguration(
    {
      DRT_RUNTIME_ENV: 'production',
      GOOGLE_CLOUD_PROJECT: 'drt-prod-project',
      FIRESTORE_DATABASE_ID: 'drt-prod-clinical-db',
      POPULATION_GUEST_TOKEN_SECRET: SECRET_SENTINEL,
    },
    {
      verifiedInfrastructureMaxInstances: 1,
      verificationSource: 'cloud_run_admin_api',
    }
  );
  assert.strictEqual(verified.multiInstanceSafety.status, 'verified_single_instance');
});

check('public_judging enforces DRT_SYNTHETIC_ONLY=true, dedicated non-dev DB, and verified single instance', () => {
  assert.throws(
    () =>
      validateStartupConfiguration(
        {
          DRT_RUNTIME_ENV: 'public_judging',
          GOOGLE_CLOUD_PROJECT: 'drt-judging-project',
          FIRESTORE_DATABASE_ID: 'drt-judging-db',
          POPULATION_GUEST_TOKEN_SECRET: SECRET_SENTINEL,
          DRT_SYNTHETIC_ONLY: 'false',
        },
        {
          verifiedInfrastructureMaxInstances: 1,
          verificationSource: 'cloud_run_admin_api',
        }
      ),
    ProductionConfigurationError
  );
  const ok = validateStartupConfiguration(
    {
      DRT_RUNTIME_ENV: 'public_judging',
      GOOGLE_CLOUD_PROJECT: 'drt-judging-project',
      FIRESTORE_DATABASE_ID: 'drt-judging-synthetic-2026',
      POPULATION_GUEST_TOKEN_SECRET: SECRET_SENTINEL,
      DRT_SYNTHETIC_ONLY: 'true',
    },
    {
      verifiedInfrastructureMaxInstances: 1,
      verificationSource: 'cloud_run_admin_api',
    }
  );
  assert.strictEqual(ok.environment, 'public_judging');
  assert.strictEqual(ok.isSyntheticOnly, true);
  assert.strictEqual(ok.databaseId, 'drt-judging-synthetic-2026');
});

// 3. Valid production config + secret redaction guarantee
check('Valid isolated production config passes without exposing secret values', () => {
  const env = {
    DRT_RUNTIME_ENV: 'production',
    GOOGLE_CLOUD_PROJECT: 'drt-prod-project',
    FIRESTORE_DATABASE_ID: 'drt-prod-clinical-db',
    POPULATION_GUEST_TOKEN_SECRET: SECRET_SENTINEL,
    GEMINI_API_KEY: 'GEMINI_SECRET_SENTINEL_123456',
    CLOUD_RUN_MAX_INSTANCES: '1',
  } as NodeJS.ProcessEnv;

  const diag = redactEnvironmentDiagnostics(env);
  const serialized = JSON.stringify(diag);
  assert.strictEqual(diag.environment, 'production');
  assert.strictEqual(diag.projectId, 'drt-prod-project');
  assert.strictEqual(diag.databaseId, 'drt-prod-clinical-db');
  assert.strictEqual(diag.varsPresent.POPULATION_GUEST_TOKEN_SECRET, true);
  assert.strictEqual(diag.varsPresent.GEMINI_API_KEY, true);
  assert.strictEqual(diag.multiInstanceSafety.rateLimiterScope, 'process_local_best_effort');
  assert.strictEqual(serialized.includes(SECRET_SENTINEL), false);
  assert.strictEqual(serialized.includes('GEMINI_SECRET_SENTINEL_123456'), false);
});

// 4. Empty production service boot does not auto-seed synthetic cohorts
check('Production PopulationHealthService starts clean (zero synthetic cohorts seeded on empty DB)', () => {
  const prevEnv = process.env.DRT_RUNTIME_ENV;
  const prevProj = process.env.GOOGLE_CLOUD_PROJECT;
  const prevDb = process.env.FIRESTORE_DATABASE_ID;
  const prevSec = process.env.POPULATION_GUEST_TOKEN_SECRET;
  const prevSeed = process.env.DRT_SEED_DEMO_ON_EMPTY;
  const tmpFile = path.join('/tmp', `prod-clean-init-${Date.now()}.json`);
  try {
    process.env.DRT_RUNTIME_ENV = 'production';
    process.env.GOOGLE_CLOUD_PROJECT = 'drt-prod-project';
    process.env.FIRESTORE_DATABASE_ID = 'drt-prod-clinical-db';
    process.env.POPULATION_GUEST_TOKEN_SECRET = SECRET_SENTINEL;
    delete process.env.DRT_SEED_DEMO_ON_EMPTY;
    const svc = PopulationHealthService.createIsolatedForTest(tmpFile);
    const dash = svc.getDashboard('platform_admin');
    const saved = JSON.parse(fs.readFileSync(tmpFile, 'utf8'));
    assert.strictEqual(saved.demoActive, false);
    assert.strictEqual(dash.participants.length, 0);
    assert.strictEqual(dash.referrals.length, 0);
    assert.strictEqual(dash.observations.length, 0);
  } finally {
    const restore = (k: string, v: string | undefined) => {
      if (v === undefined) delete process.env[k];
      else process.env[k] = v;
    };
    restore('DRT_RUNTIME_ENV', prevEnv);
    restore('GOOGLE_CLOUD_PROJECT', prevProj);
    restore('FIRESTORE_DATABASE_ID', prevDb);
    restore('POPULATION_GUEST_TOKEN_SECRET', prevSec);
    restore('DRT_SEED_DEMO_ON_EMPTY', prevSeed);
    if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
  }
});

// 5. Real server process refusal check (`server.ts` subprocess exits non-zero cleanly with redacted output)
check('Server entrypoint refuses startup (exit != 0) with missing/dev DB in production mode & leaks zero secrets', () => {
  let exitCode = 0;
  let combinedOutput = '';
  try {
    execFileSync('npx', ['tsx', 'server.ts'], {
      cwd: process.cwd(),
      env: {
        ...process.env,
        NODE_ENV: 'production',
        DRT_RUNTIME_ENV: 'production',
        GOOGLE_CLOUD_PROJECT: DEV_FIRESTORE_PROJECT_ID,
        FIRESTORE_DATABASE_ID: DEV_FIRESTORE_DATABASE_ID,
        POPULATION_GUEST_TOKEN_SECRET: SECRET_SENTINEL,
        PORT: '3999',
      },
      timeout: 15000,
      stdio: 'pipe',
    });
  } catch (err: any) {
    exitCode = err.status ?? 1;
    combinedOutput = `${err.stdout ? err.stdout.toString() : ''}${err.stderr ? err.stderr.toString() : ''}`;
  }
  assert.notStrictEqual(exitCode, 0);
  assert.ok(combinedOutput.includes('[Dr. T Startup BLOCKED]'), `Unexpected output: ${combinedOutput}`);
  assert.strictEqual(combinedOutput.includes(SECRET_SENTINEL), false);
});

console.log('==============================================================');
console.log(`PRODUCTION ISOLATION SUITE: ${passed} PASSED`);
if (process.exitCode && process.exitCode !== 0) {
  process.exit(process.exitCode);
}
