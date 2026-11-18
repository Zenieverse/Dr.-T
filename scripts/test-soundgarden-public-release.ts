// ============================================================================
// PIANIST — THE LIVING SOUND GARDEN: PUBLIC RELEASE & WEBXR SMOKE-TEST SUITE
// Verifies fail-closed `public_judging` static WebXR build, zero secret / dev
// leakage, browser security & WebXR Permissions-Policy headers, local static
// HTTP serving, and full automated WebXR/audio/interaction smoke contracts.
// NOTE: Automated verification is strictly distinct from physical Meta Quest
// hardware or Meta XR Simulator verification (which remain NOT VERIFIED here).
// ============================================================================

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {
  SOUNDGARDEN_HTML_CACHE_HEADER,
  SOUNDGARDEN_IMMUTABLE_ASSET_CACHE_HEADER,
  SOUNDGARDEN_PUBLIC_SECURITY_HEADERS,
  validatePublicReleaseHeaders,
  validateSoundGardenPublicBuildEnv,
} from '../src/config/soundGardenPublicValidation';
import {
  DEV_FIRESTORE_DATABASE_ID,
  DEV_FIRESTORE_PROJECT_ID,
} from '../src/server/runtimeEnvironment';
import {
  GARDEN_PRESETS,
  instantiatePresetOrbs,
  mergeSavedGardenSnapshot,
  serializeGardenSnapshot,
  validateAndDeserializeGardenSnapshot,
} from '../src/components/pianist/soundgarden/musicTheory';
import {
  BLOOM_DWELL_MS,
  XRHandInteractionController,
  XRSessionLifecycleManager,
  probeWebXRSupport,
} from '../src/components/pianist/soundgarden/xrHandController';

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'dist-soundgarden');

const TEST_GEMINI_SENTINEL = 'AIzaSy_TEST_SENTINEL_NEVER_BUNDLE_GEMINI_998877';
const TEST_GUEST_SECRET_SENTINEL = 'SENTINEL_GUEST_HMAC_NEVER_BUNDLE_0123456789ABCDEF';
const TEST_RESET_SECRET_SENTINEL = 'SENTINEL_RESET_TOKEN_NEVER_BUNDLE_0123456789';
const TEST_FIREBASE_KEY_SENTINEL = 'AIzaSy_TEST_SENTINEL_NEVER_BUNDLE_FIREBASE_554433';

let passed = 0;

async function check(name: string, fn: () => void | Promise<void>): Promise<void> {
  await fn();
  passed++;
  console.log(`  PASS  ${name}`);
}

function runPublicViteBuild(extraEnv: Record<string, string | undefined>): void {
  const cleanEnv: NodeJS.ProcessEnv = { ...process.env };
  for (const key of [
    'VITE_RUNTIME_ENV',
    'DRT_RUNTIME_ENV',
    'VITE_SYNTHETIC_ONLY',
    'DRT_SYNTHETIC_ONLY',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIRESTORE_DATABASE_ID',
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_APP_ID',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'GOOGLE_CLOUD_PROJECT',
    'DRT_FIREBASE_PROJECT_ID',
    'FIRESTORE_DATABASE_ID',
    'POPULATION_GUEST_TOKEN_SECRET',
    'DRT_JUDGING_RESET_TOKEN',
    'GEMINI_API_KEY',
  ]) {
    delete cleanEnv[key];
  }
  for (const [k, v] of Object.entries(extraEnv)) {
    if (v === undefined) delete cleanEnv[k];
    else cleanEnv[k] = v;
  }

  execFileSync('npx', ['vite', 'build', '--config', 'vite.soundgarden.config.ts'], {
    cwd: ROOT,
    env: cleanEnv,
    stdio: 'pipe',
    timeout: 90_000,
  });
}

function collectFilesRecursive(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectFilesRecursive(full));
    } else {
      results.push(full);
    }
  }
  return results;
}

function httpGet(
  port: number,
  urlPath: string
): Promise<{ status: number; headers: http.IncomingHttpHeaders; body: string }> {
  return new Promise((resolve, reject) => {
    const req = http.request(
      { hostname: '127.0.0.1', port, path: urlPath, method: 'GET' },
      (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          resolve({
            status: res.statusCode || 0,
            headers: res.headers,
            body: Buffer.concat(chunks).toString('utf8'),
          });
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

async function run() {
  console.log('🌿 PIANIST — THE LIVING SOUND GARDEN: PUBLIC RELEASE & WEBXR SMOKE SUITE');
  console.log('========================================================================');

  // 1. Fail-closed validation matrix
  await check('1. Fail-closed validator blocks missing env, non-public_judging, mismatch, dev DB/project & placeholders', () => {
    assert.throws(() => validateSoundGardenPublicBuildEnv({}), /Missing VITE_RUNTIME_ENV/);
    assert.throws(
      () => validateSoundGardenPublicBuildEnv({ VITE_RUNTIME_ENV: 'development', VITE_SYNTHETIC_ONLY: 'true' }),
      /must be 'public_judging'/
    );
    assert.throws(
      () =>
        validateSoundGardenPublicBuildEnv({
          VITE_RUNTIME_ENV: 'public_judging',
          DRT_RUNTIME_ENV: 'production',
          VITE_SYNTHETIC_ONLY: 'true',
        }),
      /Environment mismatch/
    );
    assert.throws(
      () =>
        validateSoundGardenPublicBuildEnv({
          VITE_RUNTIME_ENV: 'public_judging',
          VITE_SYNTHETIC_ONLY: 'false',
        }),
      /VITE_SYNTHETIC_ONLY=true/
    );
    assert.throws(
      () =>
        validateSoundGardenPublicBuildEnv({
          VITE_RUNTIME_ENV: 'public_judging',
          VITE_SYNTHETIC_ONLY: 'true',
          DRT_SYNTHETIC_ONLY: 'false',
        }),
      /DRT_SYNTHETIC_ONLY must be 'true'/
    );
    assert.throws(
      () =>
        validateSoundGardenPublicBuildEnv({
          VITE_RUNTIME_ENV: 'public_judging',
          VITE_SYNTHETIC_ONLY: 'true',
          FIRESTORE_DATABASE_ID: DEV_FIRESTORE_DATABASE_ID,
        }),
      /development Firestore database/
    );
    assert.throws(
      () =>
        validateSoundGardenPublicBuildEnv({
          VITE_RUNTIME_ENV: 'public_judging',
          VITE_SYNTHETIC_ONLY: 'true',
          VITE_FIRESTORE_DATABASE_ID: '(default)',
        }),
      /development Firestore database/
    );
    assert.throws(
      () =>
        validateSoundGardenPublicBuildEnv({
          VITE_RUNTIME_ENV: 'public_judging',
          VITE_SYNTHETIC_ONLY: 'true',
          GOOGLE_CLOUD_PROJECT: DEV_FIRESTORE_PROJECT_ID,
        }),
      /development GCP project/
    );
    assert.throws(
      () =>
        validateSoundGardenPublicBuildEnv({
          VITE_RUNTIME_ENV: 'public_judging',
          VITE_SYNTHETIC_ONLY: 'true',
          VITE_FIREBASE_API_KEY: 'changeme',
        }),
      /placeholder literal/
    );
    assert.throws(
      () =>
        validateSoundGardenPublicBuildEnv({
          VITE_RUNTIME_ENV: 'public_judging',
          VITE_SYNTHETIC_ONLY: 'true',
          VITE_FIREBASE_PROJECT_ID: '<DEDICATED_PROJECT_ID>',
        }),
      /placeholder literal/
    );

    const ok = validateSoundGardenPublicBuildEnv({
      VITE_RUNTIME_ENV: 'public_judging',
      DRT_RUNTIME_ENV: 'public_judging',
      VITE_SYNTHETIC_ONLY: 'true',
      DRT_SYNTHETIC_ONLY: 'true',
    });
    assert.equal(ok.environment, 'public_judging');
    assert.equal(ok.releaseArchitecture, 'static_webxr_only');
    assert.equal(ok.isSyntheticOnly, true);
    assert.equal(ok.backendRequired, false);
    assert.equal(ok.firestoreRequired, false);
  });

  // 2. Real Vite public_judging build matrix
  await check('2. Real Vite static WebXR build fails closed on bad env & succeeds cleanly on isolated public_judging', () => {
    // Missing env -> blocked
    assert.throws(() => runPublicViteBuild({}), (err: any) => err?.status !== 0);

    // Mismatched DRT_RUNTIME_ENV -> blocked
    assert.throws(
      () =>
        runPublicViteBuild({
          VITE_RUNTIME_ENV: 'public_judging',
          DRT_RUNTIME_ENV: 'development',
          VITE_SYNTHETIC_ONLY: 'true',
        }),
      (err: any) => err?.status !== 0
    );

    // Development Firestore DB present -> blocked
    assert.throws(
      () =>
        runPublicViteBuild({
          VITE_RUNTIME_ENV: 'public_judging',
          VITE_SYNTHETIC_ONLY: 'true',
          FIRESTORE_DATABASE_ID: DEV_FIRESTORE_DATABASE_ID,
        }),
      (err: any) => err?.status !== 0
    );

    // Clean isolated public_judging build (with secret sentinels in shell to prove zero leakage)
    runPublicViteBuild({
      VITE_RUNTIME_ENV: 'public_judging',
      DRT_RUNTIME_ENV: 'public_judging',
      VITE_SYNTHETIC_ONLY: 'true',
      DRT_SYNTHETIC_ONLY: 'true',
      GEMINI_API_KEY: TEST_GEMINI_SENTINEL,
      POPULATION_GUEST_TOKEN_SECRET: TEST_GUEST_SECRET_SENTINEL,
      DRT_JUDGING_RESET_TOKEN: TEST_RESET_SECRET_SENTINEL,
      VITE_FIREBASE_API_KEY: TEST_FIREBASE_KEY_SENTINEL,
    });

    assert.equal(fs.existsSync(path.join(OUT_DIR, 'index.html')), true);
    const assetsDir = path.join(OUT_DIR, 'assets');
    assert.equal(fs.existsSync(assetsDir), true);
    const assetFiles = fs.readdirSync(assetsDir);
    assert.ok(assetFiles.some((f) => f.endsWith('.js')), 'Expected JS module chunk in dist-soundgarden/assets');
    assert.ok(assetFiles.some((f) => f.endsWith('.css')), 'Expected CSS stylesheet in dist-soundgarden/assets');
  });

  // 3. Built artifact security, zero-secret & zero-dev-leakage audit
  await check('3. Built dist-soundgarden/ bundle contains zero secrets, zero dev IDs, zero Firebase/API routes & zero /public leaks', () => {
    const allFiles = collectFilesRecursive(OUT_DIR);
    assert.ok(allFiles.length >= 3, 'Expected built HTML, JS, and CSS artifacts');

    const indexHtml = fs.readFileSync(path.join(OUT_DIR, 'index.html'), 'utf8');
    assert.ok(indexHtml.includes('PIANIST — The Living Sound Garden'));
    // Zero inline scripts (strict CSP script-src 'self' compliance)
    const scriptTags = indexHtml.match(/<script\b[^>]*>[\s\S]*?<\/script>/gi) || [];
    assert.ok(scriptTags.length >= 1, 'Expected module script entry tag');
    for (const tag of scriptTags) {
      assert.ok(/\bsrc="\/assets\/[^"]+\.js"/i.test(tag), `Unexpected inline or non-local script tag: ${tag}`);
      assert.ok(/\btype="module"/i.test(tag), `Expected ES module script tag: ${tag}`);
    }
    // Zero external font/CDN links
    assert.equal(/https?:\/\/fonts\.googleapis\.com/i.test(indexHtml), false);
    assert.equal(/https?:\/\/cdn\./i.test(indexHtml), false);

    // Zero unrelated Dr. T /public files leaked
    for (const forbiddenPublicFile of [
      'Zenith-01_Submission_Writeup.pdf',
      'submission.csv',
      'dr_t_operating_portrait.jpg',
      'complete_pipeline.ipynb',
    ]) {
      assert.equal(
        fs.existsSync(path.join(OUT_DIR, forbiddenPublicFile)),
        false,
        `Unrelated /public artifact leaked into dist-soundgarden/: ${forbiddenPublicFile}`
      );
    }

    // Scan all built files for secrets, dev DB/project, Firebase SDK, backend routes, clinical strings
    const combinedBundle = allFiles.map((f) => fs.readFileSync(f, 'utf8')).join('\n');
    for (const forbidden of [
      TEST_GEMINI_SENTINEL,
      TEST_GUEST_SECRET_SENTINEL,
      TEST_RESET_SECRET_SENTINEL,
      TEST_FIREBASE_KEY_SENTINEL,
      DEV_FIRESTORE_DATABASE_ID,
      DEV_FIRESTORE_PROJECT_ID,
      'firebase-applet-config',
      'firestore.googleapis.com',
      'identitytoolkit.googleapis.com',
      '/api/population-health',
      '/api/cloud/infrastructure-status',
      '/api/chat',
      'MOCK_ICU_PATIENTS',
      'PopulationHealthModule',
    ]) {
      assert.equal(
        combinedBundle.includes(forbidden),
        false,
        `Forbidden token leaked into public static bundle: ${forbidden}`
      );
    }
  });

  // 4. Security & WebXR header policy audit + hosting template parity
  await check('4. WebXR & browser security header policy and firebase.soundgarden.json template pass strict validation', () => {
    const directCheck = validatePublicReleaseHeaders(SOUNDGARDEN_PUBLIC_SECURITY_HEADERS);
    assert.equal(directCheck.ok, true, `Header validation failed: ${directCheck.errors.join('; ')}`);

    // Verify negative detections work properly
    const authRedirectCheck = validatePublicReleaseHeaders({
      ...SOUNDGARDEN_PUBLIC_SECURITY_HEADERS,
      Location: '/__cookie_check.html?return_url=https://example.invalid',
    });
    assert.equal(authRedirectCheck.ok, false);

    const blockedXrCheck = validatePublicReleaseHeaders({
      ...SOUNDGARDEN_PUBLIC_SECURITY_HEADERS,
      'Permissions-Policy': 'xr-spatial-tracking=(), camera=(self), microphone=()',
    });
    assert.equal(blockedXrCheck.ok, false);

    const wildcardCamCheck = validatePublicReleaseHeaders({
      ...SOUNDGARDEN_PUBLIC_SECURITY_HEADERS,
      'Permissions-Policy': 'xr-spatial-tracking=(self), camera=(*), microphone=()',
    });
    assert.equal(wildcardCamCheck.ok, false);

    // Verify config/public-judging/firebase.soundgarden.json matches canonical headers verbatim
    const hostingCfgPath = path.join(ROOT, 'config', 'public-judging', 'firebase.soundgarden.json');
    const hostingCfg = JSON.parse(fs.readFileSync(hostingCfgPath, 'utf8'));
    assert.equal(hostingCfg.hosting.public, 'dist-soundgarden');
    const globalRule = hostingCfg.hosting.headers.find((h: any) => h.source === '**');
    assert.ok(globalRule, 'Expected global ** header rule in firebase.soundgarden.json');
    const mapped: Record<string, string> = {};
    for (const pair of globalRule.headers) {
      mapped[pair.key] = pair.value;
    }
    const hostingAudit = validatePublicReleaseHeaders(mapped);
    assert.equal(hostingAudit.ok, true, `firebase.soundgarden.json header errors: ${hostingAudit.errors.join('; ')}`);
    for (const [key, expectedVal] of Object.entries(SOUNDGARDEN_PUBLIC_SECURITY_HEADERS)) {
      assert.equal(mapped[key], expectedVal, `Header mismatch in firebase.soundgarden.json for ${key}`);
    }

    // Verify root vercel.json deploys ONLY dist-soundgarden with identical canonical WebXR security headers
    const vercelCfgPath = path.join(ROOT, 'vercel.json');
    const vercelCfg = JSON.parse(fs.readFileSync(vercelCfgPath, 'utf8'));
    assert.equal(vercelCfg.outputDirectory, 'dist-soundgarden');
    assert.ok(String(vercelCfg.buildCommand).includes('VITE_RUNTIME_ENV=public_judging'));
    assert.ok(String(vercelCfg.buildCommand).includes('VITE_SYNTHETIC_ONLY=true'));
    assert.ok(String(vercelCfg.buildCommand).includes('npm run build:soundgarden:public'));
    const vercelGlobalRule = vercelCfg.headers.find((h: any) => h.source === '/(.*)');
    assert.ok(vercelGlobalRule, 'Expected global /(.*) header rule in vercel.json');
    const vercelMapped: Record<string, string> = {};
    for (const pair of vercelGlobalRule.headers) {
      vercelMapped[pair.key] = pair.value;
    }
    const vercelAudit = validatePublicReleaseHeaders(vercelMapped);
    assert.equal(vercelAudit.ok, true, `vercel.json header errors: ${vercelAudit.errors.join('; ')}`);
    for (const [key, expectedVal] of Object.entries(SOUNDGARDEN_PUBLIC_SECURITY_HEADERS)) {
      assert.equal(vercelMapped[key], expectedVal, `Header mismatch in vercel.json for ${key}`);
    }
  });

  // 5. Local loopback static HTTP release server smoke test
  await check('5. Local static HTTP smoke check verifies HTTP 200, zero auth redirects, strict MIME types & WebXR headers', async () => {
    const server = http.createServer((req, res) => {
      const reqPath = (req.url || '/').split('?')[0];
      const safeRel = reqPath === '/' ? 'index.html' : reqPath.replace(/^\/+/, '');
      let fullPath = path.resolve(OUT_DIR, safeRel);
      if (!fullPath.startsWith(OUT_DIR) || !fs.existsSync(fullPath) || fs.statSync(fullPath).isDirectory()) {
        fullPath = path.join(OUT_DIR, 'index.html');
      }

      const ext = path.extname(fullPath).toLowerCase();
      const mime =
        ext === '.html'
          ? 'text/html; charset=utf-8'
          : ext === '.js'
            ? 'text/javascript; charset=utf-8'
            : ext === '.css'
              ? 'text/css; charset=utf-8'
              : 'application/octet-stream';

      for (const [k, v] of Object.entries(SOUNDGARDEN_PUBLIC_SECURITY_HEADERS)) {
        res.setHeader(k, v);
      }
      res.setHeader(
        'Cache-Control',
        ext === '.html' ? SOUNDGARDEN_HTML_CACHE_HEADER : SOUNDGARDEN_IMMUTABLE_ASSET_CACHE_HEADER
      );
      res.setHeader('Content-Type', mime);
      res.statusCode = 200;
      res.end(fs.readFileSync(fullPath));
    });

    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
    const addr = server.address();
    const port = typeof addr === 'object' && addr ? addr.port : 0;

    try {
      const rootRes = await httpGet(port, '/');
      assert.equal(rootRes.status, 200);
      assert.equal(rootRes.headers['location'], undefined);
      assert.ok(String(rootRes.headers['content-type']).startsWith('text/html'));
      assert.equal(rootRes.headers['cache-control'], SOUNDGARDEN_HTML_CACHE_HEADER);
      const headerAudit = validatePublicReleaseHeaders(rootRes.headers);
      assert.equal(headerAudit.ok, true, headerAudit.errors.join('; '));

      const jsMatch = rootRes.body.match(/src="(\/assets\/[^"]+\.js)"/);
      assert.ok(jsMatch, 'Expected hashed JS module path in index.html');
      const jsRes = await httpGet(port, jsMatch[1]);
      assert.equal(jsRes.status, 200);
      assert.ok(String(jsRes.headers['content-type']).startsWith('text/javascript'));
      assert.equal(jsRes.headers['x-content-type-options'], 'nosniff');
      assert.equal(jsRes.headers['cache-control'], SOUNDGARDEN_IMMUTABLE_ASSET_CACHE_HEADER);

      const cssMatch = rootRes.body.match(/href="(\/assets\/[^"]+\.css)"/);
      assert.ok(cssMatch, 'Expected hashed CSS path in index.html');
      const cssRes = await httpGet(port, cssMatch[1]);
      assert.equal(cssRes.status, 200);
      assert.ok(String(cssRes.headers['content-type']).startsWith('text/css'));
    } finally {
      server.close();
    }
  });

  // 6. WebXR lifecycle, hand/controller fallback, audio/privacy & composition smoke contract
  await check('6. Automated WebXR, hand-tracking fallback, privacy & persistence smoke matrix passes (distinct from headset QA)', async () => {
    // WebXR probe & lifecycle (hand-tracking optional feature negotiation + clean exit)
    let ended = false;
    let endListeners: Array<() => void> = [];
    let requestedFeatures: string[] = [];
    const mockSession = {
      addEventListener(_type: 'end', listener: () => void) {
        endListeners.push(listener);
      },
      removeEventListener(_type: 'end', listener: () => void) {
        endListeners = endListeners.filter((l) => l !== listener);
      },
      async end() {
        ended = true;
        for (const fn of [...endListeners]) fn();
      },
    };
    const mockXr = {
      async isSessionSupported(mode: 'immersive-vr') {
        return mode === 'immersive-vr';
      },
      async requestSession(_mode: 'immersive-vr', init?: { optionalFeatures?: string[] }) {
        requestedFeatures = init?.optionalFeatures || [];
        return mockSession;
      },
    };
    assert.equal(await probeWebXRSupport(mockXr), true);
    const mgr = new XRSessionLifecycleManager();
    mgr.setSupported(true);
    const startRes = await mgr.requestImmersiveSession({
      xr: mockXr,
      attachSession: async () => {},
      onSessionEnded: () => {},
    });
    assert.equal(startRes.started, true);
    assert.equal(mgr.getState(), 'active');
    assert.ok(requestedFeatures.includes('hand-tracking'));
    assert.ok(requestedFeatures.includes('local-floor'));
    await mgr.endSession();
    assert.equal(ended, true);
    assert.equal(mgr.getState(), 'ready');

    // Hand-tracking unavailable -> controller fallback allowed immediately; hands active -> suppressed
    const ctrl = new XRHandInteractionController();
    assert.equal(ctrl.shouldAllowControllerFallback(0, 1000), true);
    const openLeft = {
      handIndex: 0 as const,
      tracked: true,
      wrist: { x: -0.25, y: 1.46, z: -0.35 },
      thumbTip: { x: -0.2, y: 1.54, z: -0.35 },
      indexTip: { x: -0.28, y: 1.62, z: -0.35 },
      middleTip: { x: -0.3, y: 1.63, z: -0.35 },
    };
    const openRight = {
      handIndex: 1 as const,
      tracked: true,
      wrist: { x: 0.25, y: 1.46, z: -0.35 },
      thumbTip: { x: 0.2, y: 1.54, z: -0.35 },
      indexTip: { x: 0.28, y: 1.62, z: -0.35 },
      middleTip: { x: 0.3, y: 1.63, z: -0.35 },
    };
    ctrl.update({
      nowMs: 1000,
      dtSec: 0.016,
      hands: [openLeft, openRight],
      orbs: [],
      activeControllerCount: 0,
      canPlantMore: true,
    });
    assert.equal(ctrl.shouldAllowControllerFallback(0, 1100), false);
    const bloomOut = ctrl.update({
      nowMs: 1000 + BLOOM_DWELL_MS + 40,
      dtSec: 0.46,
      hands: [openLeft, openRight],
      orbs: [],
      activeControllerCount: 0,
      canPlantMore: true,
    });
    assert.equal(bloomOut.bloomActive, true);
    assert.ok(bloomOut.events.some((e) => e.type === 'bloom-start'));

    // Composition save/load & JSON export/import validation
    const preset = GARDEN_PRESETS[0];
    const snapshot = {
      id: 'smoke-1',
      name: 'Public Release Smoke Garden',
      savedAt: new Date().toISOString(),
      scale: preset.scale,
      bpm: preset.bpm,
      skyMood: preset.skyMood,
      orbs: instantiatePresetOrbs(preset),
    };
    const merged = mergeSavedGardenSnapshot([snapshot], { ...snapshot, name: 'Second Garden' });
    assert.equal(merged.length, 2, 'Non-overwrite save must keep prior garden');
    const serialized = serializeGardenSnapshot(snapshot);
    const parsed = validateAndDeserializeGardenSnapshot(serialized);
    assert.equal(parsed.ok, true);
    assert.equal(parsed.snapshot?.orbs.length, snapshot.orbs.length);

    // Privacy & WebGL fallback source verification
    const engineSrc = fs.readFileSync(
      path.join(ROOT, 'src/components/pianist/soundgarden/LivingSoundGardenEngine.ts'),
      'utf8'
    );
    assert.equal(/getUserMedia\(\{[^}]*audio\s*:\s*true/.test(engineSrc), false, 'Microphone must never be requested');
    assert.ok(engineSrc.includes('this.stopWebcam()'), 'Webcam must stop cleanly on exit and VR entry');
    assert.ok(engineSrc.includes('this.webcamVideo.srcObject = null'), 'Webcam video srcObject must detach on stop');
    assert.ok(engineSrc.includes('getWorldQuaternion(_xrQuat)'), 'HRTF listener must use world quaternion');

    const moduleSrc = fs.readFileSync(
      path.join(ROOT, 'src/components/pianist/soundgarden/LivingSoundGardenModule.tsx'),
      'utf8'
    );
    assert.ok(moduleSrc.includes('standalone?: boolean'), 'Standalone full-viewport prop must exist');
    assert.ok(moduleSrc.includes('WebGL 3D graphics unavailable'), 'Graceful WebGL error fallback must exist');
  });

  console.log('========================================================================');
  console.log(`PUBLIC RELEASE & WEBXR SMOKE SUITE: ${passed}/${passed} PASSED (exit 0)`);
  console.log('NOTE: Physical Meta Quest Browser & XR Simulator QA remain NOT VERIFIED in sandbox.');
}

run().catch((err) => {
  console.error('❌ PUBLIC RELEASE SMOKE SUITE FAILED:', err);
  process.exit(1);
});
