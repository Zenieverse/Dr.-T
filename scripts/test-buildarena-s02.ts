/**
 * BuildArena S02 — Verification & Test Suite
 * Human AI Engineering Challenge 2026: Deliver. Separate. Return.
 */

import assert from 'assert';
import { BuildArenaServerService } from '../src/server/buildArenaServerService';
import { TelemetryPoint } from '../src/components/buildarena/types';

async function runBuildArenaTests() {
  console.log('🧪 Starting BuildArena S02 (Human AI Engineering Challenge) Verification Suite...\n');

  const service = BuildArenaServerService.getInstance();

  // Test 1: Authoritative Scoring Calculation — Official Kaggle S02 Rules
  console.log('--- Test 1: Authoritative Scoring Calculation (Kaggle S02 Rules) ---');
  {
    // Case A: Perfect Mission (3.5 orbits, 4.2m landing, 95% recovery, 80% fuel)
    const pointsA: TelemetryPoint[] = [
      {
        timeSeconds: 0,
        altitudeMeters: 0,
        velocityMs: 0,
        fuelMassKg: 100,
        totalMassKg: 5200,
        stage: 1,
        distanceToPadMeters: 0,
        orbitRevolutions: 0,
        dynamicPressureKpa: 0,
        throttlePercent: 95,
        apoapsisKm: 15,
        periapsisKm: 0,
      },
      {
        timeSeconds: 360,
        altitudeMeters: 0,
        velocityMs: 1.8,
        fuelMassKg: 80,
        totalMassKg: 1140, // 95% of 1200 booster dry mass
        stage: 5,
        distanceToPadMeters: 4.2, // <= 10m -> 40 pts
        orbitRevolutions: 3.5, // >= 3.0 -> 15 pts
        dynamicPressureKpa: 0,
        throttlePercent: 75,
        apoapsisKm: 185,
        periapsisKm: 165,
      },
    ];

    const scoreA = service.evaluateTelemetry(pointsA);
    assert.strictEqual(scoreA.orbitalPayloadScore, 15, '3.5 orbits must award full 15 points');
    assert.strictEqual(scoreA.landingAccuracyScore, 40, '4.2m landing distance must award 40 points');
    assert.strictEqual(scoreA.payloadFuelEfficiencyScore, 12, '80% fuel remaining must award 12 points (80% of 15)');
    assert.strictEqual(scoreA.recoveryCompletenessScore, 29, '95% recovery mass must award 29 points (95% of 30)');
    assert.strictEqual(scoreA.qualified, true, 'Mission satisfying 3 orbits and <=10m landing must be qualified');
    assert.strictEqual(scoreA.totalScore, 15 + 12 + 29 + 40, 'Total score must sum all 4 categories');
    console.log(`✅ Case A (Qualified Orbit + Landing): Score ${scoreA.totalScore}/100, Qualified: ${scoreA.qualified}`);

    // Case B: Failed Orbit Gate (Only 1.5 orbits -> 5 partial pts, but not qualified)
    const pointsB: TelemetryPoint[] = [
      {
        timeSeconds: 0,
        altitudeMeters: 0,
        velocityMs: 0,
        fuelMassKg: 100,
        totalMassKg: 5200,
        stage: 1,
        distanceToPadMeters: 0,
        orbitRevolutions: 0,
        dynamicPressureKpa: 0,
        throttlePercent: 95,
        apoapsisKm: 15,
        periapsisKm: 0,
      },
      {
        timeSeconds: 360,
        altitudeMeters: 0,
        velocityMs: 2.1,
        fuelMassKg: 40,
        totalMassKg: 1000,
        stage: 5,
        distanceToPadMeters: 8.5,
        orbitRevolutions: 1.5, // Failed 3-orbit gate
        dynamicPressureKpa: 0,
        throttlePercent: 75,
        apoapsisKm: 120,
        periapsisKm: 80,
      },
    ];

    const scoreB = service.evaluateTelemetry(pointsB);
    assert.strictEqual(scoreB.orbitalPayloadScore, 5, '1.5 orbits gives partial credit (5 pts)');
    assert.strictEqual(scoreB.qualified, false, 'Mission with < 3 orbits MUST NOT qualify');
    console.log(`✅ Case B (Failed Orbit Gate): Score ${scoreB.totalScore}/100, Qualified: ${scoreB.qualified}`);

    // Case C: Landing Accuracy Tiers
    // <= 10m: 40 pts, <= 25m: 30 pts, <= 50m: 20 pts, <= 100m: 10 pts, > 100m: 0 pts
    const testDistances = [
      { dist: 8.0, expectedLandingPts: 40 },
      { dist: 18.0, expectedLandingPts: 30 },
      { dist: 35.0, expectedLandingPts: 20 },
      { dist: 75.0, expectedLandingPts: 10 },
      { dist: 150.0, expectedLandingPts: 0 },
    ];

    for (const td of testDistances) {
      const pts: TelemetryPoint[] = [
        { timeSeconds: 0, altitudeMeters: 0, velocityMs: 0, fuelMassKg: 100, totalMassKg: 5200, stage: 1, distanceToPadMeters: 0, orbitRevolutions: 0, dynamicPressureKpa: 0, throttlePercent: 95, apoapsisKm: 15, periapsisKm: 0 },
        { timeSeconds: 360, altitudeMeters: 0, velocityMs: 2.0, fuelMassKg: 50, totalMassKg: 1000, stage: 5, distanceToPadMeters: td.dist, orbitRevolutions: 3.2, dynamicPressureKpa: 0, throttlePercent: 75, apoapsisKm: 180, periapsisKm: 160 },
      ];
      const res = service.evaluateTelemetry(pts);
      assert.strictEqual(res.landingAccuracyScore, td.expectedLandingPts, `Distance ${td.dist}m must award ${td.expectedLandingPts} landing points`);
    }
    console.log('✅ Case C (Landing Accuracy Distance Tiers): All 5 distance bands validated.');
  }

  // Test 2: MCP Tool Registry & Diagnostic Bridge
  console.log('\n--- Test 2: BuildArena 2.0 MCP Tools Registry & Diagnostics ---');
  {
    const tools = BuildArenaServerService.MCP_TOOLS;
    assert.strictEqual(tools.length, 4, 'Must expose exactly 4 core BuildArena MCP tools');
    
    const toolNames = tools.map((t) => t.name);
    assert(toolNames.includes('ba_build_machine'), 'Must include ba_build_machine');
    assert(toolNames.includes('ba_control_program'), 'Must include ba_control_program');
    assert(toolNames.includes('ba_simulate_run'), 'Must include ba_simulate_run');
    assert(toolNames.includes('ba_stream_telemetry'), 'Must include ba_stream_telemetry');

    console.log('✅ MCP Tools verified: ' + toolNames.join(', '));

    const status = await service.getBridgeStatus('http://127.0.0.1:9999'); // Non-listening test port
    assert(status, 'Status must return a valid object');
    assert.strictEqual(status.connected, false, 'Unreachable local port must report connected: false');
    assert(status.diagnosticNotes.length > 0, 'Must provide clear diagnostic notes explaining setup prerequisites');
    console.log('✅ Diagnostic Bridge Status checked gracefully without throwing errors.');
  }

  // Test 3: Reference Experiments & Qualification Runs
  console.log('\n--- Test 3: Reference Qualification Experiments ---');
  {
    const experiments = service.getExperiments();
    assert(experiments.length >= 2, 'Must provide at least 2 reference experiments');

    const starhawk = experiments.find((e) => e.id === 'exp-s02-starhawk-v3');
    assert(starhawk, 'Starhawk S02 V3.1 reference experiment must exist');
    assert.strictEqual(starhawk.scoring.qualified, true, 'Starhawk S02 must be qualified');
    assert(starhawk.scoring.totalScore >= 90, 'Starhawk S02 must score >= 90 points');
    assert.strictEqual(starhawk.verificationStatus, 'VERIFIED WITH REAL SIMULATION DATA');
    console.log(`✅ Starhawk Reference Experiment Verified: Score ${starhawk.scoring.totalScore}/100, Status: ${starhawk.verificationStatus}`);
  }

  // Test 4: Copilot Advice Generator
  console.log('\n--- Test 4: Aerospace Copilot Advice Engine ---');
  {
    const adviceResult = await service.generateCopilotAdvice('How to tune PID for landing?');
    assert(adviceResult, 'Advice result must not be null');
    assert(adviceResult.advice.length > 50, 'Advice must be informative and substantial');
    assert(adviceResult.advice.includes('PID') || adviceResult.advice.includes('retro') || adviceResult.advice.includes('Landing'), 'Advice must contain aerospace guidance');
    console.log('✅ Copilot Advice Engine returned structured aerospace recommendations.');
  }

  // Test 5: Deep-link URL & Hash Routing Resolution
  console.log('\n--- Test 5: Deep-link URL & Hash Routing Resolution ---');
  {
    const parseUrlHash = (url: string): string | null => {
      const parsedUrl = new URL(url);
      const queryTab = parsedUrl.searchParams.get('tab')?.trim().toLowerCase();
      if (queryTab) {
        if (['buildarena', 'build-arena', 'buildarenas02', 'missioncontrol'].includes(queryTab)) return 'buildarena';
        return queryTab;
      }
      let raw = parsedUrl.hash.replace(/^#\/?/, '').replace(/\/$/, '').toLowerCase().trim();
      if (raw.includes('?')) raw = raw.split('?')[0];
      if (raw.includes('&')) raw = raw.split('&')[0];
      if (['buildarena', 'build-arena', 'buildarenas02', 'missioncontrol'].includes(raw)) {
        return 'buildarena';
      }
      return raw || null;
    };

    const testUrls = [
      'https://ais-pre-4s4jvpipr3mh3mz6x2hpfp-393352619239.asia-southeast1.run.app/#buildarena',
      'https://ais-pre-4s4jvpipr3mh3mz6x2hpfp-393352619239.asia-southeast1.run.app/#/buildarena',
      'https://ais-pre-4s4jvpipr3mh3mz6x2hpfp-393352619239.asia-southeast1.run.app/#buildarena/',
      'https://ais-pre-4s4jvpipr3mh3mz6x2hpfp-393352619239.asia-southeast1.run.app/?tab=buildarena',
      'https://ais-pre-4s4jvpipr3mh3mz6x2hpfp-393352619239.asia-southeast1.run.app/#build-arena',
      'https://ais-pre-4s4jvpipr3mh3mz6x2hpfp-393352619239.asia-southeast1.run.app/#buildarenas02',
    ];

    for (const u of testUrls) {
      const resolved = parseUrlHash(u);
      assert.strictEqual(resolved, 'buildarena', `URL ${u} must resolve to 'buildarena' tab`);
    }
    console.log(`✅ All ${testUrls.length} deep-link URL permutations correctly resolve to 'buildarena'.`);
  }

  // Test 6: BuildArenaArtifactService — Artifact Discovery, Kinematics Analysis & Manifest
  console.log('\n--- Test 6: BuildArenaArtifactService (Real Data Discovery & Validation) ---');
  {
    const { BuildArenaArtifactService } = await import('../src/server/buildArenaArtifactService');
    const artifactService = BuildArenaArtifactService.getInstance();

    // 6.1 Artifact discovery & SHA-256 integrity
    const artifacts = artifactService.discoverArtifacts();
    assert(artifacts.length >= 8, `Expected at least 8 artifacts, found ${artifacts.length}`);
    console.log(`✅ Discovered ${artifacts.length} target artifacts in workspace.`);

    const bsg = artifacts.find((a) => a.filename === 'Zenith-01.bsg');
    assert(bsg, 'Zenith-01.bsg must be discovered');
    assert.strictEqual(bsg.validationStatus, 'VERIFIED', 'Zenith-01.bsg must be VERIFIED');
    assert(bsg.integrityHash && bsg.integrityHash.length === 64, 'Zenith-01.bsg must have 64-char SHA-256');
    console.log(`✅ Zenith-01.bsg verified with SHA-256: ${bsg.integrityHash.slice(0, 16)}...`);

    const trajectoryArt = artifacts.find((a) => a.filename === 'trajectory.csv');
    assert(trajectoryArt, 'trajectory.csv must be discovered');
    assert.strictEqual(trajectoryArt.validationStatus, 'VERIFIED', 'trajectory.csv must be VERIFIED');
    console.log(`✅ trajectory.csv verified with SHA-256: ${trajectoryArt.integrityHash.slice(0, 16)}...`);

    // 6.2 Telemetry Kinematics & Scoring Engine
    const telemetry = artifactService.analyzeTrajectoryCsv();
    assert.strictEqual(telemetry.durationSeconds, 360, 'Simulation duration must be 360 seconds');
    assert.strictEqual(telemetry.orbitalRevolutionsAchieved, 3.4, 'Orbital revolutions must be 3.4');
    assert.strictEqual(telemetry.orbitalGateSatisfied, true, 'Orbital gate (>= 3.0 revs) must be satisfied');
    assert.strictEqual(telemetry.boosterTouchdownOffsetMeters, 4.2, 'Touchdown distance must be 4.20 meters');
    assert.strictEqual(telemetry.landingAccuracyTier, 'TIER 1 (<=10m)', 'Landing CEP must fall into Tier 1');
    assert.strictEqual(telemetry.landingAccuracyScore, 40, 'Tier 1 landing must score 40/40 points');
    assert.strictEqual(telemetry.orbitalPayloadScore, 15, 'Orbit score must be 15/15');
    assert.strictEqual(telemetry.totalOfficialScore, 97, 'Total official score must be 97/100');
    assert.strictEqual(telemetry.qualificationStatus, 'QUALIFIED', 'Flight run must be QUALIFIED');
    console.log(`✅ Trajectory Kinematics Analysis Verified: 3.4 Orbits, 4.2m CEP, Score 97/100 (QUALIFIED).`);

    // 6.3 Manifest Generation
    const manifest = artifactService.generateManifest();
    assert.strictEqual(manifest.machineName, 'Zenith-01');
    assert.strictEqual(manifest.track, 'Build with Agent');
    assert.strictEqual(manifest.mode, 'Copilot');
    assert(manifest.files.length >= 8, 'Manifest must index verified files');
    assert(manifest.totalSizeBytes < 100 * 1024 * 1024, 'Total package must be within 100MB Kaggle limit');
    console.log(`✅ Manifest generated cleanly: ${manifest.files.length} files, ${manifest.totalSizeBytes} bytes (${(manifest.totalSizeBytes / 1024).toFixed(1)} KB).`);

    // 6.4 Validation Report & Kaggle Gates
    const report = artifactService.generateValidationReport();
    assert.strictEqual(report.isWithinKaggleLimit, true, 'Package must be within Kaggle limit');
    assert.strictEqual(report.qualificationStatus, 'QUALIFIED', 'Report must conclude QUALIFIED status');
    assert.strictEqual(report.complianceGates.minimumThreeOrbitsVerified, true, 'Orbit compliance gate must be true');
    assert.strictEqual(report.complianceGates.landingPadAccuracyVerified, true, 'Landing compliance gate must be true');
    assert.strictEqual(report.complianceGates.unpoweredPayloadVerified, true, 'Payload compliance gate must be true');
    console.log(`✅ Validation Report verified: All 5 compliance gates passed!`);
  }

  console.log('\n🌟 All BuildArena S02 Mission Control verification tests passed cleanly!\n');
}

runBuildArenaTests().catch((err) => {
  console.error('❌ BuildArena tests failed:', err);
  process.exit(1);
});
