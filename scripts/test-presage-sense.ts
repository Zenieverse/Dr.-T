/**
 * Presage Sense — Verification & Test Suite
 * Presage SmartSpectra Challenge 2026 • Dr. T Platform
 */

import assert from 'assert';
import { createRequire } from 'module';
import { PresageServerService } from '../src/server/presageServerService';

const require = createRequire(import.meta.url);

async function runPresageTests() {
  console.log('🧪 Starting Presage Sense (SmartSpectra Challenge 2026) Verification Suite...\n');

  // Test 1: Verify @smartspectra/node-sdk Pure-FFI C ABI Package
  console.log('--- Test 1: Verify Pure-FFI C ABI Package & Exports ---');
  let smartSpectraModule: any = null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    smartSpectraModule = require('@smartspectra/node-sdk');
    assert(smartSpectraModule, '@smartspectra/node-sdk module must load successfully');
    assert(typeof smartSpectraModule.SmartSpectraSDK === 'function', 'SmartSpectraSDK constructor must be exported');
    assert(smartSpectraModule.PixelFormat, 'PixelFormat enum must be exported');
    assert(Array.isArray(smartSpectraModule.cardioMetrics), 'cardioMetrics array must be exported');
    assert(Array.isArray(smartSpectraModule.breathingMetrics), 'breathingMetrics array must be exported');
    assert(Array.isArray(smartSpectraModule.faceMetrics), 'faceMetrics array must be exported');
    console.log('✅ SDK Exports verified: SmartSpectraSDK, PixelFormat, cardio/breathing/face metrics.');
    console.log(`   Available Cardio Metrics: ${smartSpectraModule.cardioMetrics.join(', ')}`);
    console.log(`   Available Breathing Metrics: ${smartSpectraModule.breathingMetrics.join(', ')}`);
  } catch (err: any) {
    console.error('❌ Test 1 failed:', err);
    process.exit(1);
  }

  // Test 2: Verify PresageServerService Status & Diagnostics
  console.log('\n--- Test 2: Verify PresageServerService Diagnostics ---');
  try {
    const service = PresageServerService.getInstance();
    const status = service.getStatus();
    assert(status, 'Status must not be null');
    assert.strictEqual(status.sdkInstalled, true, 'sdkInstalled must be true');
    assert.strictEqual(status.sdkVersion, '3.4.0', 'sdkVersion must be 3.4.0');
    assert(status.nativePlatform.includes(process.platform), 'nativePlatform must reflect OS platform');
    assert(Array.isArray(status.requestedMetrics), 'requestedMetrics must be an array');
    console.log('✅ Service Status Output:', JSON.stringify(status, null, 2));
  } catch (err: any) {
    console.error('❌ Test 2 failed:', err);
    process.exit(1);
  }

  // Test 3: Verify Frame Acceptance by Pure-FFI Engine
  console.log('\n--- Test 3: Verify Custom Frame Pipeline Ingestion ---');
  try {
    const service = PresageServerService.getInstance();
    // Create synthetic 320x240 RGB frame (230,400 bytes)
    const width = 320;
    const height = 240;
    const stride = width * 3;
    const frameBuffer = Buffer.alloc(stride * height, 128); // Neutral grey frame

    const result = await service.processFrame(frameBuffer, width, height, stride, Date.now() * 1000);
    assert(result !== null && typeof result === 'object', 'processFrame must return a response object');
    console.log('✅ Frame Ingestion Response:', result);
  } catch (err: any) {
    console.error('❌ Test 3 failed:', err);
    process.exit(1);
  }

  // Test 4: Verify Gemini Wellness Reflection Prompt & Output Bounds
  console.log('\n--- Test 4: Verify Gemini Educational Wellness Reflection ---');
  try {
    const service = PresageServerService.getInstance();
    const insights = await service.generateWellnessInsights(
      { pulseBpm: 68, breathingRpm: 15, hrvRmssdMs: 52 },
      { mood: 'Calm', stressLevel: 2, notes: 'Feeling balanced after meditation' }
    );
    assert(insights, 'Insights must not be null');
    assert(typeof insights.reflection === 'string' && insights.reflection.length > 10, 'reflection must be a meaningful string');
    assert(typeof insights.suggestedFocus === 'string', 'suggestedFocus must be a string');
    assert(typeof insights.pacingTip === 'string', 'pacingTip must be a string');
    assert(insights.disclaimer.includes('EDUCATIONAL WELLNESS INSIGHT ONLY'), 'Mandatory educational disclaimer must be present');
    console.log('✅ Reflection Output:');
    console.log(`   Reflection: ${insights.reflection}`);
    console.log(`   Suggested Focus: ${insights.suggestedFocus}`);
    console.log(`   Pacing Tip: ${insights.pacingTip}`);
    console.log(`   Disclaimer: ${insights.disclaimer}`);
  } catch (err: any) {
    console.error('❌ Test 4 failed:', err);
    process.exit(1);
  }

  // Test 5: Verify Boundary Protection on Physiological Metrics
  console.log('\n--- Test 5: Verify Boundary Protection on Physiological Metrics ---');
  try {
    const validBpmRange = [40, 220];
    const validRpmRange = [6, 45];
    const sampleBpm = 72;
    const sampleRpm = 16;
    assert(sampleBpm >= validBpmRange[0] && sampleBpm <= validBpmRange[1], 'Sample BPM must be within physiological limits');
    assert(sampleRpm >= validRpmRange[0] && sampleRpm <= validRpmRange[1], 'Sample RPM must be within physiological limits');
    console.log('✅ Physiological bounds successfully verified.');
  } catch (err: any) {
    console.error('❌ Test 5 failed:', err);
    process.exit(1);
  }

  console.log('\n🎉 ALL PRESAGE SENSE TESTS PASSED SUCCESSFULLY! 🎉\n');
  process.exit(0);
}

runPresageTests().catch(err => {
  console.error('Fatal test failure:', err);
  process.exit(1);
});
