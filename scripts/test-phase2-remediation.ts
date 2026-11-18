// ============================================================================
// DR. T — PHASE 2 PRODUCTION ISOLATION REMEDIATION VERIFICATION SUITE
// Tests Remediations A (Vite/Frontend Fail-Closed Config), B (Multi-Instance &
// Cloud Run Admin API Verification), C (Public Judging Write/Seed/Reset
// Guardrails), and D (Honest Cloud Status & Frontend/Backend Env Agreement).
// ============================================================================

import assert from 'assert';
import { execFileSync } from 'child_process';
import fs from 'fs';
import http from 'http';
import path from 'path';
import {
  checkFrontendBackendEnvAgreement,
  resolveAndValidateClientFirebaseConfig,
} from '../src/config/clientFirebaseValidation';
import {
  DEV_FIRESTORE_DATABASE_ID,
  DEV_FIRESTORE_PROJECT_ID,
  PROCESS_LOCAL_STATE_INVENTORY,
  ProductionConfigurationError,
  validateStartupConfiguration,
  verifyStartupConfigurationAsync,
} from '../src/server/runtimeEnvironment';
import {
  authenticatePopulationHeaders,
  HttpAuthError,
  mintGuestDemoToken,
  RATE_LIMITER_GLOBALLY_ENFORCED,
  RATE_LIMITER_SCOPE,
  verifyPrivilegedResetToken,
} from '../src/server/populationHealthAuth';
import {
  AuthorizationError,
  POPULATION_HEALTH_ROUTE_INVENTORY,
  PopulationHealthService,
  ValidationError,
} from '../src/server/populationHealthService';

let passed = 0;
const failures: string[] = [];

async function check(name: string, fn: () => void | Promise<void>) {
  try {
    await fn();
    console.log(`✅ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`❌ FAIL: ${name}`, err);
    failures.push(name);
    process.exitCode = 1;
  }
}

const SECRET_SENTINEL = 'SENTINEL_PHASE2_TEST_SECRET_998877665544332211';
const ADMIN_RESET_SECRET = 'ADMIN_RESET_TOKEN_TEST_0123456789ABCDEF';

function restoreEnv(snapshot: Record<string, string | undefined>) {
  for (const [k, v] of Object.entries(snapshot)) {
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
}

function readDistJsBundleContents(): string {
  const assetsDir = path.join(process.cwd(), 'dist', 'assets');
  if (!fs.existsSync(assetsDir)) return '';
  return fs
    .readdirSync(assetsDir)
    .filter((f) => f.endsWith('.js'))
    .map((f) => fs.readFileSync(path.join(assetsDir, f), 'utf8'))
    .join('\n');
}

function httpRequestJson(
  port: number,
  method: string,
  urlPath: string,
  headers: Record<string, string> = {},
  body?: unknown
): Promise<{ status: number; bodyText: string; json: any }> {
  return new Promise((resolve, reject) => {
    const payload = body !== undefined ? JSON.stringify(body) : undefined;
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port,
        path: urlPath,
        method,
        headers: {
          ...(payload ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) } : {}),
          ...headers,
        },
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          const bodyText = Buffer.concat(chunks).toString('utf8');
          let json: any = null;
          try {
            json = JSON.parse(bodyText);
          } catch {
            // non-JSON response
          }
          resolve({ status: res.statusCode || 0, bodyText, json });
        });
      }
    );
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function run() {
  console.log('🛡️ DR. T PHASE 2 PRODUCTION ISOLATION REMEDIATION SUITE');
  console.log('==============================================================');

  // --------------------------------------------------------------------------
  // REMEDIATION A: FRONTEND CONFIG & VITE BUILD FAIL-CLOSED VALIDATION
  // --------------------------------------------------------------------------
  await check('A1: Client resolver fails closed when VITE_RUNTIME_ENV missing on build/prod', () => {
    assert.throws(
      () =>
        resolveAndValidateClientFirebaseConfig(
          { MODE: 'production', PROD: true },
          { viteCommand: 'build', viteMode: 'production', devFallbackConfig: { projectId: 'x', firestoreDatabaseId: 'y', apiKey: 'k', appId: 'a' } }
        ),
      /Missing VITE_RUNTIME_ENV/
    );
  });

  await check('A2: Client resolver requires non-placeholder VITE_FIREBASE_* & non-dev DB for staging/production/public_judging', () => {
    assert.throws(
      () =>
        resolveAndValidateClientFirebaseConfig(
          {
            VITE_RUNTIME_ENV: 'production',
            VITE_FIREBASE_PROJECT_ID: 'drt-prod-app',
            VITE_FIRESTORE_DATABASE_ID: DEV_FIRESTORE_DATABASE_ID,
            VITE_FIREBASE_API_KEY: 'AIzaTestProdKey123',
            VITE_FIREBASE_APP_ID: '1:123:web:abc',
            VITE_FIREBASE_MESSAGING_SENDER_ID: '123456',
          },
          { viteCommand: 'build', viteMode: 'production' }
        ),
      /development database/
    );

    assert.throws(
      () =>
        resolveAndValidateClientFirebaseConfig(
          {
            VITE_RUNTIME_ENV: 'staging',
            VITE_FIREBASE_PROJECT_ID: 'drt-staging-app',
            VITE_FIRESTORE_DATABASE_ID: '(default)',
            VITE_FIREBASE_API_KEY: 'AIzaTestKey123',
            VITE_FIREBASE_APP_ID: '1:123:web:abc',
            VITE_FIREBASE_MESSAGING_SENDER_ID: '123456',
          },
          { viteCommand: 'build', viteMode: 'production' }
        ),
      /\(default\)/
    );

    assert.throws(
      () =>
        resolveAndValidateClientFirebaseConfig(
          {
            VITE_RUNTIME_ENV: 'public_judging',
            VITE_FIREBASE_PROJECT_ID: 'drt-judging-app',
            VITE_FIRESTORE_DATABASE_ID: 'drt-judging-db',
            VITE_FIREBASE_API_KEY: 'AIzaTestJudgingKey123',
            VITE_FIREBASE_APP_ID: '1:123:web:abc',
            VITE_FIREBASE_MESSAGING_SENDER_ID: '123456',
            VITE_SYNTHETIC_ONLY: 'false',
          },
          { viteCommand: 'build', viteMode: 'production' }
        ),
      /VITE_SYNTHETIC_ONLY=true/
    );

    const validProd = resolveAndValidateClientFirebaseConfig(
      {
        VITE_RUNTIME_ENV: 'production',
        VITE_FIREBASE_PROJECT_ID: 'drt-prod-project',
        VITE_FIRESTORE_DATABASE_ID: 'drt-prod-clinical-db',
        VITE_FIREBASE_API_KEY: 'AIzaProdExplicitKey',
        VITE_FIREBASE_APP_ID: '1:999:web:prod',
        VITE_FIREBASE_MESSAGING_SENDER_ID: '999888777',
      },
      { viteCommand: 'build', viteMode: 'production' }
    );
    assert.strictEqual(validProd.environment, 'production');
    assert.strictEqual(validProd.firestoreDatabaseId, 'drt-prod-clinical-db');
  });

  await check('A3: Frontend/backend env agreement detector catches mismatched env, project, and DB', () => {
    const clientProd = resolveAndValidateClientFirebaseConfig(
      {
        VITE_RUNTIME_ENV: 'production',
        VITE_FIREBASE_PROJECT_ID: 'drt-prod-project',
        VITE_FIRESTORE_DATABASE_ID: 'drt-prod-clinical-db',
        VITE_FIREBASE_API_KEY: 'AIzaProdKey',
        VITE_FIREBASE_APP_ID: '1:1:web:p',
        VITE_FIREBASE_MESSAGING_SENDER_ID: '111',
      },
      { viteCommand: 'build', viteMode: 'production' }
    );

    assert.strictEqual(
      checkFrontendBackendEnvAgreement(clientProd, {
        environment: 'production',
        gcpProjectId: 'drt-prod-project',
        persistenceStatus: { firestoreDatabaseId: 'drt-prod-clinical-db' },
      }).agrees,
      true
    );

    assert.strictEqual(
      checkFrontendBackendEnvAgreement(clientProd, {
        environment: 'development',
        gcpProjectId: 'drt-prod-project',
        persistenceStatus: { firestoreDatabaseId: 'drt-prod-clinical-db' },
      }).agrees,
      false
    );
  });

  await check('A4: Real Vite build matrix (fail-closed without VITE_RUNTIME_ENV; valid prod/judging omit dev DB & config)', () => {
    const runViteBuild = (extraEnv: Record<string, string | undefined>) => {
      const cleanEnv: NodeJS.ProcessEnv = { ...process.env };
      delete cleanEnv.VITE_RUNTIME_ENV;
      delete cleanEnv.DRT_RUNTIME_ENV;
      delete cleanEnv.VITE_FIREBASE_PROJECT_ID;
      delete cleanEnv.VITE_FIRESTORE_DATABASE_ID;
      delete cleanEnv.VITE_FIREBASE_API_KEY;
      delete cleanEnv.VITE_FIREBASE_APP_ID;
      delete cleanEnv.VITE_FIREBASE_MESSAGING_SENDER_ID;
      delete cleanEnv.VITE_SYNTHETIC_ONLY;
      for (const [k, v] of Object.entries(extraEnv)) {
        if (v === undefined) delete cleanEnv[k];
        else cleanEnv[k] = v;
      }
      execFileSync('npx', ['vite', 'build'], {
        cwd: process.cwd(),
        env: cleanEnv,
        stdio: 'pipe',
        timeout: 60000,
      });
    };

    // 1. Bare vite build with missing VITE_RUNTIME_ENV must fail
    assert.throws(() => runViteBuild({}), (err: any) => err?.status !== 0);

    // 2. Production vite build targeting dev DB must fail
    assert.throws(
      () =>
        runViteBuild({
          VITE_RUNTIME_ENV: 'production',
          VITE_FIREBASE_PROJECT_ID: 'drt-prod-isolated-2026',
          VITE_FIRESTORE_DATABASE_ID: DEV_FIRESTORE_DATABASE_ID,
          VITE_FIREBASE_API_KEY: 'AIzaProdBuildKey123',
          VITE_FIREBASE_APP_ID: '1:555:web:prod555',
          VITE_FIREBASE_MESSAGING_SENDER_ID: '555666',
        }),
      (err: any) => err?.status !== 0
    );

    // 3. Valid production vite build must succeed AND must NOT bundle dev DB ID or dev project ID
    runViteBuild({
      VITE_RUNTIME_ENV: 'production',
      VITE_FIREBASE_PROJECT_ID: 'drt-prod-isolated-2026',
      VITE_FIRESTORE_DATABASE_ID: 'drt-prod-clinical-isolated',
      VITE_FIREBASE_API_KEY: 'AIzaProdBuildKey123',
      VITE_FIREBASE_APP_ID: '1:555:web:prod555',
      VITE_FIREBASE_MESSAGING_SENDER_ID: '555666',
    });
    const prodBundle = readDistJsBundleContents();
    assert.ok(prodBundle.includes('drt-prod-clinical-isolated'), 'Expected prod DB ID in prod bundle');
    assert.strictEqual(
      prodBundle.includes(DEV_FIRESTORE_DATABASE_ID),
      false,
      'Dev Firestore DB ID must NOT appear in production Vite bundle!'
    );

    // 4. Valid public_judging vite build with VITE_SYNTHETIC_ONLY=true must succeed
    runViteBuild({
      VITE_RUNTIME_ENV: 'public_judging',
      VITE_FIREBASE_PROJECT_ID: 'drt-judging-isolated-2026',
      VITE_FIRESTORE_DATABASE_ID: 'drt-judging-synthetic-isolated',
      VITE_FIREBASE_API_KEY: 'AIzaJudgingBuildKey123',
      VITE_FIREBASE_APP_ID: '1:777:web:judging777',
      VITE_FIREBASE_MESSAGING_SENDER_ID: '777888',
      VITE_SYNTHETIC_ONLY: 'true',
    });
    const judgingBundle = readDistJsBundleContents();
    assert.ok(judgingBundle.includes('drt-judging-synthetic-isolated'));
    assert.strictEqual(judgingBundle.includes(DEV_FIRESTORE_DATABASE_ID), false);
  });

  await check('A5: Accidental KEY=value env pastes normalize cleanly without weakening mismatch or invalid-value fail-closed guards', () => {
    const runViteBuild = (extraEnv: Record<string, string | undefined>) => {
      const cleanEnv: NodeJS.ProcessEnv = { ...process.env };
      delete cleanEnv.VITE_RUNTIME_ENV;
      delete cleanEnv.DRT_RUNTIME_ENV;
      for (const [k, v] of Object.entries(extraEnv)) {
        if (v === undefined) delete cleanEnv[k];
        else cleanEnv[k] = v;
      }
      execFileSync('npx', ['vite', 'build'], {
        cwd: process.cwd(),
        env: cleanEnv,
        stdio: 'pipe',
        timeout: 60000,
      });
    };

    // Exact deployment failure reproduction: DRT_RUNTIME_ENV='development' + VITE_RUNTIME_ENV='VITE_RUNTIME_ENV=development'
    runViteBuild({
      DRT_RUNTIME_ENV: 'development',
      VITE_RUNTIME_ENV: 'VITE_RUNTIME_ENV=development',
    });

    // Mismatched envs must STILL fail closed even with KEY=value prefix
    assert.throws(
      () =>
        runViteBuild({
          DRT_RUNTIME_ENV: 'production',
          VITE_RUNTIME_ENV: 'VITE_RUNTIME_ENV=development',
        }),
      (err: any) => err?.status !== 0
    );

    // Wrong key prefix (OTHER_KEY=development) must STILL fail closed
    assert.throws(
      () =>
        runViteBuild({
          DRT_RUNTIME_ENV: 'development',
          VITE_RUNTIME_ENV: 'OTHER_KEY=development',
        }),
      (err: any) => err?.status !== 0
    );
  });

  // --------------------------------------------------------------------------
  // REMEDIATION B: REAL MULTI-INSTANCE SAFETY & CLOUD RUN ADMIN API VERIFIER
  // --------------------------------------------------------------------------
  await check('B1: Env var overrides (CLOUD_RUN_MAX_INSTANCES=1 / DRT_ALLOW_MULTI_INSTANCE=true) still fail closed without Cloud Run Admin API verification', async () => {
    assert.throws(
      () =>
        validateStartupConfiguration({
          DRT_RUNTIME_ENV: 'staging',
          GOOGLE_CLOUD_PROJECT: 'drt-staging-project',
          FIRESTORE_DATABASE_ID: 'drt-staging-db',
          POPULATION_GUEST_TOKEN_SECRET: SECRET_SENTINEL,
          CLOUD_RUN_MAX_INSTANCES: '1',
          DRT_ALLOW_MULTI_INSTANCE: 'true',
        } as NodeJS.ProcessEnv),
      ProductionConfigurationError
    );

    // Mock Cloud Run Admin API returning maxInstanceCount: 4 -> fails closed
    await assert.rejects(
      () =>
        verifyStartupConfigurationAsync(
          {
            DRT_RUNTIME_ENV: 'production',
            GOOGLE_CLOUD_PROJECT: 'drt-prod-project',
            FIRESTORE_DATABASE_ID: 'drt-prod-clinical-db',
            POPULATION_GUEST_TOKEN_SECRET: SECRET_SENTINEL,
            K_SERVICE: 'drt-prod-svc',
            DRT_CLOUD_REGION: 'asia-southeast1',
            GOOGLE_OAUTH_ACCESS_TOKEN: 'mock-token',
          },
          (async () =>
            new Response(
              JSON.stringify({ template: { scaling: { maxInstanceCount: 4 } } }),
              { status: 200 }
            )) as typeof fetch
        ),
      ProductionConfigurationError
    );

    // Mock Cloud Run Admin API returning maxInstanceCount: 1 -> passes verification
    const verified = await verifyStartupConfigurationAsync(
      {
        DRT_RUNTIME_ENV: 'production',
        GOOGLE_CLOUD_PROJECT: 'drt-prod-project',
        FIRESTORE_DATABASE_ID: 'drt-prod-clinical-db',
        POPULATION_GUEST_TOKEN_SECRET: SECRET_SENTINEL,
        K_SERVICE: 'drt-prod-svc',
        DRT_CLOUD_REGION: 'asia-southeast1',
        GOOGLE_OAUTH_ACCESS_TOKEN: 'mock-token',
      },
      (async () =>
        new Response(
          JSON.stringify({ template: { scaling: { maxInstanceCount: 1 } } }),
          { status: 200 }
        )) as typeof fetch
    );
    assert.strictEqual(verified.multiInstanceSafety.status, 'verified_single_instance');
    assert.strictEqual(verified.multiInstanceSafety.verificationSource, 'cloud_run_admin_api');
    assert.strictEqual(verified.multiInstanceSafety.rateLimiterScope, 'process_local_best_effort');
    assert.strictEqual(verified.multiInstanceSafety.rateLimiterGloballyEnforced, false);
  });

  await check('B2: Process-local state inventory & best-effort rate limiter classification are complete', () => {
    const stores = new Set(PROCESS_LOCAL_STATE_INVENTORY.map((e) => e.store));
    assert.ok(stores.has('PopulationHealthService.state'));
    assert.ok(stores.has('PopulationHealthService.guestSandboxes'));
    assert.ok(stores.has('populationHealthAuth.rateLimitBuckets'));
    assert.ok(stores.has('populationHealthAuth.certCache'));
    assert.strictEqual(RATE_LIMITER_SCOPE, 'process_local_best_effort');
    assert.strictEqual(RATE_LIMITER_GLOBALLY_ENFORCED, false);
  });

  // --------------------------------------------------------------------------
  // REMEDIATION C & D: PUBLIC_JUDGING GUARDRAILS + HTTP API HONESTY TESTS
  // --------------------------------------------------------------------------
  await check('C1: Public judging service enforces read-only shared DB for authenticated users, synthetic-only guest sandbox, PII redacted audits & reset token gate', async () => {
    const envSnap = {
      DRT_RUNTIME_ENV: process.env.DRT_RUNTIME_ENV,
      GOOGLE_CLOUD_PROJECT: process.env.GOOGLE_CLOUD_PROJECT,
      FIRESTORE_DATABASE_ID: process.env.FIRESTORE_DATABASE_ID,
      POPULATION_GUEST_TOKEN_SECRET: process.env.POPULATION_GUEST_TOKEN_SECRET,
      DRT_SYNTHETIC_ONLY: process.env.DRT_SYNTHETIC_ONLY,
      DRT_SEED_DEMO_ON_EMPTY: process.env.DRT_SEED_DEMO_ON_EMPTY,
      DRT_JUDGING_RESET_TOKEN: process.env.DRT_JUDGING_RESET_TOKEN,
    };
    const tmpFile = path.join('/tmp', `judging-svc-${Date.now()}.json`);

    try {
      process.env.DRT_RUNTIME_ENV = 'public_judging';
      process.env.GOOGLE_CLOUD_PROJECT = 'drt-judging-project';
      process.env.FIRESTORE_DATABASE_ID = 'drt-judging-synthetic-db';
      process.env.POPULATION_GUEST_TOKEN_SECRET = SECRET_SENTINEL;
      process.env.DRT_SYNTHETIC_ONLY = 'true';
      process.env.DRT_JUDGING_RESET_TOKEN = ADMIN_RESET_SECRET;
      delete process.env.DRT_SEED_DEMO_ON_EMPTY;

      const svc = PopulationHealthService.createIsolatedForTest(tmpFile);

      // 1. Empty DB in public_judging does not auto-seed
      const emptyDash = svc.getDashboard('platform_admin', undefined, {
        actorId: 'uid:judgeAdmin',
        authMode: 'VERIFIED_FIREBASE_USER',
        verifiedMaxRole: 'platform_admin',
      });
      assert.strictEqual(emptyDash.participants.length, 0);

      // 2. Authenticated Firebase user write is rejected (403) + logs redacted DENIED audit
      assert.throws(
        () =>
          svc.addParticipant(
            'programme_manager',
            {
              displayAlias: 'Real Clinic Cohort Alpha',
              age: 42,
              gender: 'Female',
              cohort: 'Blood Health',
              region: 'District 1 Clinic',
              consentGiven: true,
            },
            {
              actorId: 'uid:staffTest1',
              authMode: 'VERIFIED_FIREBASE_USER',
              verifiedMaxRole: 'programme_manager',
            }
          ),
        AuthorizationError
      );

      // 3. Guest sandbox can read + create safe SIMULATED participant without mutating shared DB
      const guestCtx = {
        actorId: 'GS-judging-1',
        authMode: 'GUEST_SANDBOX' as const,
        verifiedMaxRole: 'guest_demo' as const,
        guestSessionId: 'GS-judging-1',
      };
      const guestCreated = svc.addParticipant(
        'guest_demo',
        {
          displayAlias: 'Synthetic Judge Demo 01',
          age: 34,
          gender: 'Female',
          cohort: 'Maternal Health',
          region: 'River Ward',
          consentGiven: true,
          dataOrigin: 'SIMULATED',
        },
        guestCtx
      );
      assert.strictEqual(guestCreated.dataOrigin, 'SIMULATED');
      assert.strictEqual(
        svc.getDashboard('platform_admin', undefined, { authMode: 'VERIFIED_FIREBASE_USER' })
          .participants.length,
        0,
        'Guest sandbox write must never mutate shared public_judging database'
      );

      // 4. Guest sandbox rejects non-synthetic markers (dataOrigin=LIVE, isLiveHardware=true) & records redacted audit
      assert.throws(
        () =>
          svc.ingestObservation(
            'guest_demo',
            {
              participantId: guestCreated.id,
              sourceSystem: 'WEARABLE_BRIDGE',
              dataOrigin: 'LIVE',
              metricType: 'resting_hr',
              valueDisplay: '78 bpm',
              numericValue: 78,
            },
            guestCtx
          ),
        AuthorizationError
      );
      assert.throws(
        () =>
          svc.ingestPresageBridge(
            'guest_demo',
            guestCreated.id,
            {
              pulseRateBpm: 74,
              isLiveHardware: true,
              cameraConsentVerified: true,
            },
            guestCtx
          ),
        AuthorizationError
      );

      // 5. Guest PII submission throws ValidationError AND records redacted audit without logging PII
      const secretEmail = 'confidential.patient@example.org';
      assert.throws(
        () =>
          svc.addParticipant(
            'guest_demo',
            {
              displayAlias: secretEmail,
              age: 40,
              gender: 'Male',
              cohort: 'Cardiometabolic Health',
              region: 'Urban Core',
              consentGiven: true,
            },
            guestCtx
          ),
        ValidationError
      );
      const guestDashAfterDenials = svc.getDashboard('guest_demo', undefined, guestCtx);
      const serializedLogs = JSON.stringify(guestDashAfterDenials.auditLogs);
      assert.strictEqual(
        serializedLogs.includes(secretEmail),
        false,
        'Redacted DENIED audit log must NEVER store raw PII input!'
      );
      assert.ok(
        guestDashAfterDenials.auditLogs.some((l) => l.outcome === 'DENIED'),
        'Expected DENIED audit log entry'
      );

      // 6. Demo reset/load blocked for guest & unverified platform_admin; permitted ONLY for platform_admin + valid token
      assert.throws(() => svc.resetDemoToClean('guest_demo', guestCtx), AuthorizationError);
      assert.throws(
        () =>
          svc.loadSyntheticDemo('platform_admin', {
            actorId: 'uid:admin',
            authMode: 'VERIFIED_FIREBASE_USER',
            verifiedMaxRole: 'platform_admin',
            privilegedResetVerified: false,
          }),
        AuthorizationError
      );
      const adminLoaded = svc.loadSyntheticDemo('platform_admin', {
        actorId: 'uid:admin',
        authMode: 'VERIFIED_FIREBASE_USER',
        verifiedMaxRole: 'platform_admin',
        privilegedResetVerified: true,
      });
      assert.ok(adminLoaded.participants.length > 0);
      assert.strictEqual(POPULATION_HEALTH_ROUTE_INVENTORY.length, 22);
    } finally {
      restoreEnv(envSnap);
      if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    }
  });

  await check('C2: Cross-session X-Guest-Session-Id mismatch & privileged reset token timing-safe verifier', async () => {
    const envSnap = {
      DRT_RUNTIME_ENV: process.env.DRT_RUNTIME_ENV,
      POPULATION_GUEST_TOKEN_SECRET: process.env.POPULATION_GUEST_TOKEN_SECRET,
      DRT_JUDGING_RESET_TOKEN: process.env.DRT_JUDGING_RESET_TOKEN,
    };
    try {
      process.env.DRT_RUNTIME_ENV = 'development';
      process.env.POPULATION_GUEST_TOKEN_SECRET = SECRET_SENTINEL;
      const minted = mintGuestDemoToken();
      await assert.rejects(
        () =>
          authenticatePopulationHeaders({
            authorizationHeader: `Bearer ${minted.token}`,
            requestedRoleHeader: 'guest_demo',
            requestedGuestSessionIdHeader: 'GS-SPOOFED-OTHER-SESSION',
          }),
        (err: any) => err instanceof HttpAuthError && err.statusCode === 403
      );
      const valid = await authenticatePopulationHeaders({
        authorizationHeader: `Bearer ${minted.token}`,
        requestedRoleHeader: 'guest_demo',
        requestedGuestSessionIdHeader: minted.sessionId,
      });
      assert.strictEqual(valid.guestSessionId, minted.sessionId);

      assert.strictEqual(
        verifyPrivilegedResetToken(ADMIN_RESET_SECRET, { DRT_JUDGING_RESET_TOKEN: ADMIN_RESET_SECRET }).ok,
        true
      );
      assert.strictEqual(
        verifyPrivilegedResetToken('wrong-token-value-123', { DRT_JUDGING_RESET_TOKEN: ADMIN_RESET_SECRET }).ok,
        false
      );
      assert.strictEqual(
        verifyPrivilegedResetToken('short', { DRT_JUDGING_RESET_TOKEN: 'short' }).ok,
        false
      );
    } finally {
      restoreEnv(envSnap);
    }
  });

  await check('C3 & D1: Live Express HTTP route verification (/api/population-health/* & /api/cloud/infrastructure-status honesty & env mismatch 409)', async () => {
    const envSnap = {
      DRT_SKIP_SERVER_LISTEN: process.env.DRT_SKIP_SERVER_LISTEN,
      DRT_RUNTIME_ENV: process.env.DRT_RUNTIME_ENV,
      DRT_FIREBASE_PROJECT_ID: process.env.DRT_FIREBASE_PROJECT_ID,
      GOOGLE_CLOUD_PROJECT: process.env.GOOGLE_CLOUD_PROJECT,
      FIRESTORE_DATABASE_ID: process.env.FIRESTORE_DATABASE_ID,
      POPULATION_GUEST_TOKEN_SECRET: process.env.POPULATION_GUEST_TOKEN_SECRET,
      DRT_SYNTHETIC_ONLY: process.env.DRT_SYNTHETIC_ONLY,
      DRT_JUDGING_RESET_TOKEN: process.env.DRT_JUDGING_RESET_TOKEN,
      DRT_CLOUD_REGION: process.env.DRT_CLOUD_REGION,
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    };

    process.env.DRT_SKIP_SERVER_LISTEN = '1';
    process.env.DRT_RUNTIME_ENV = 'public_judging';
    delete process.env.DRT_FIREBASE_PROJECT_ID;
    process.env.GOOGLE_CLOUD_PROJECT = 'drt-judging-http-proj';
    process.env.FIRESTORE_DATABASE_ID = 'drt-judging-http-db';
    process.env.POPULATION_GUEST_TOKEN_SECRET = SECRET_SENTINEL;
    process.env.DRT_SYNTHETIC_ONLY = 'true';
    process.env.DRT_JUDGING_RESET_TOKEN = ADMIN_RESET_SECRET;
    delete process.env.DRT_CLOUD_REGION;

    const { app } = await import('../server.impl');
    const server = http.createServer(app);
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
    const addr = server.address();
    const port = typeof addr === 'object' && addr ? addr.port : 0;

    try {
      // 1. Infrastructure status honesty check
      const infra = await httpRequestJson(port, 'GET', '/api/cloud/infrastructure-status');
      assert.strictEqual(infra.status, 200);
      assert.strictEqual(infra.json.environment, 'public_judging');
      assert.strictEqual(infra.json.gcpProjectId, 'drt-judging-http-proj');
      assert.strictEqual(infra.json.region, 'Not verified');
      assert.strictEqual(infra.json.services.cloudRun.region, 'Not verified');
      assert.strictEqual(infra.json.services.cloudPubSub.state, 'Simulated');
      assert.strictEqual(infra.json.services.gkeMicroservices.state, 'Simulated');
      assert.strictEqual(infra.json.services.iamStatus.state, 'Not verified');
      assert.strictEqual(infra.json.runtimeSafety.rateLimiterScope, 'process_local_best_effort');
      assert.strictEqual(infra.json.runtimeSafety.rateLimiterGloballyEnforced, false);
      assert.strictEqual(infra.bodyText.includes('0 - 10 instances'), false);
      assert.strictEqual(infra.bodyText.includes('14 ms'), false);
      assert.strictEqual(infra.bodyText.includes('99.98'), false);
      assert.strictEqual(infra.bodyText.includes(DEV_FIRESTORE_PROJECT_ID), false);
      assert.strictEqual(infra.bodyText.includes(SECRET_SENTINEL), false);

      // 2. Unauthenticated write -> 401
      const unauthWrite = await httpRequestJson(port, 'POST', '/api/population-health/participants', {}, {
        displayAlias: 'Unauth Judge Test',
        age: 30,
        gender: 'Female',
        cohort: 'Blood Health',
        region: 'District 1 Clinic',
        consentGiven: true,
      });
      assert.strictEqual(unauthWrite.status, 401);

      // 3. Mint guest session -> guest read succeeds, cross-session spoof -> 403, client env mismatch -> 409
      const minted = await httpRequestJson(port, 'POST', '/api/population-health/guest-session');
      assert.strictEqual(minted.status, 201);
      const token = minted.json.token;
      const sid = minted.json.sessionId;

      const mismatchRes = await httpRequestJson(port, 'GET', '/api/population-health/dashboard', {
        Authorization: `Bearer ${token}`,
        'X-Population-Role': 'guest_demo',
        'X-Guest-Session-Id': sid,
        'X-DrT-Client-Env': 'development',
      });
      assert.strictEqual(mismatchRes.status, 409);
      assert.strictEqual(mismatchRes.json.code, 'ENV_MISMATCH');

      const spoofSidRes = await httpRequestJson(port, 'GET', '/api/population-health/dashboard', {
        Authorization: `Bearer ${token}`,
        'X-Population-Role': 'guest_demo',
        'X-Guest-Session-Id': 'GS-WRONG-SESSION',
        'X-DrT-Client-Env': 'public_judging',
        'X-DrT-Client-Db': 'drt-judging-http-db',
      });
      assert.strictEqual(spoofSidRes.status, 403);

      // 4. Guest /demo/reset blocked (403) in public_judging
      const guestResetRes = await httpRequestJson(port, 'POST', '/api/population-health/demo/reset', {
        Authorization: `Bearer ${token}`,
        'X-Population-Role': 'guest_demo',
        'X-Guest-Session-Id': sid,
        'X-DrT-Client-Env': 'public_judging',
        'X-DrT-Client-Db': 'drt-judging-http-db',
      });
      assert.strictEqual(guestResetRes.status, 403);

      // 5. Guest non-synthetic write rejected (403) & synthetic write allowed (201)
      const okGuestAdd = await httpRequestJson(
        port,
        'POST',
        '/api/population-health/participants',
        {
          Authorization: `Bearer ${token}`,
          'X-Population-Role': 'guest_demo',
          'X-Guest-Session-Id': sid,
          'X-DrT-Client-Env': 'public_judging',
          'X-DrT-Client-Db': 'drt-judging-http-db',
        },
        {
          displayAlias: 'Judging Guest Synthetic 01',
          age: 29,
          gender: 'Female',
          cohort: 'Blood Health',
          region: 'District 1 Clinic',
          consentGiven: true,
          dataOrigin: 'SIMULATED',
        }
      );
      assert.strictEqual(okGuestAdd.status, 201);

      const nonSynObs = await httpRequestJson(
        port,
        'POST',
        '/api/population-health/observations',
        {
          Authorization: `Bearer ${token}`,
          'X-Population-Role': 'guest_demo',
          'X-Guest-Session-Id': sid,
          'X-DrT-Client-Env': 'public_judging',
          'X-DrT-Client-Db': 'drt-judging-http-db',
        },
        {
          participantId: okGuestAdd.json.participant.id,
          sourceSystem: 'WEARABLE_BRIDGE',
          dataOrigin: 'LIVE',
          metricType: 'resting_hr',
          valueDisplay: '76 bpm',
          numericValue: 76,
        }
      );
      assert.strictEqual(nonSynObs.status, 403);

      // 6. Health endpoint exposes runtimeSafety summary cleanly without secrets
      const health = await httpRequestJson(port, 'GET', '/api/population-health/health');
      assert.strictEqual(health.status, 200);
      assert.strictEqual(health.json.environment, 'public_judging');
      assert.strictEqual(health.json.runtimeSafety.rateLimiterScope, 'process_local_best_effort');
      assert.strictEqual(health.json.runtimeSafety.publicJudgingPolicy.sharedDatabaseWriteMode, 'read_only_for_public_writes');
      assert.strictEqual(health.bodyText.includes(SECRET_SENTINEL), false);
    } finally {
      server.close();
      restoreEnv(envSnap);
    }
  });

  console.log('==============================================================');
  console.log(`PHASE 2 REMEDIATION SUITE: ${passed} PASSED, ${failures.length} FAILED`);
  if (failures.length > 0) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('Fatal suite error:', err);
  process.exit(1);
});
