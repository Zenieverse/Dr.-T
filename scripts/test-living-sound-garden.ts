import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  BOTANICAL_SPECIES,
  CLEARING_MAX_RADIUS,
  CLEARING_MIN_RADIUS,
  GARDEN_PRESETS,
  GARDEN_SCALES,
  MAX_ELEVATION,
  MAX_NOTE_DEGREE,
  MAX_SAVED_ORBS,
  MIN_ELEVATION,
  TOTAL_STEPS,
  computeConductingMetrics,
  computeHarmonicLinks,
  degreeToMidi,
  deserializeGardenSnapshot,
  elevationToNoteDegree,
  getOrbNoteLabel,
  instantiatePresetOrbs,
  mergeSavedGardenSnapshot,
  midiToFreq,
  midiToNoteName,
  noteDegreeToElevation,
  quantizeOrbPosition,
  radialStepToXZ,
  serializeGardenSnapshot,
  validateAndDeserializeGardenSnapshot,
  xzToRadialStep,
} from '../src/components/pianist/soundgarden/musicTheory';
import { groundHeightAt } from '../src/components/pianist/soundgarden/gardenMeshes';
import {
  BLOOM_COOLDOWN_MS,
  BLOOM_DWELL_MS,
  HAND_FALLBACK_SUPPRESS_MS,
  PLANT_COOLDOWN_MS,
  TRACKING_LOSS_GRACE_MS,
  XRHandFrameInput,
  XRHandInteractionController,
  XRSessionLifecycleManager,
  probeWebXRSupport,
} from '../src/components/pianist/soundgarden/xrHandController';
import { LivingSoundGardenAudioEngine } from '../src/components/pianist/soundgarden/spatialAudioEngine';
import { SavedGardenSnapshot, SoundSpeciesId } from '../src/components/pianist/soundgarden/types';

let passed = 0;

async function test(name: string, fn: () => void | Promise<void>): Promise<void> {
  await fn();
  passed++;
  console.log(`  PASS  ${name}`);
}

function makeMockAudioContext() {
  const createdNodes: Array<{ type: string; disconnected: boolean; extra?: Record<string, unknown> }> = [];
  let closed = false;
  let resumed = false;

  const makeParam = (initial = 0) => ({
    value: initial,
    setValueAtTime(v: number) {
      this.value = v;
    },
    linearRampToValueAtTime(v: number) {
      this.value = v;
    },
    exponentialRampToValueAtTime(v: number) {
      this.value = v;
    },
    setTargetAtTime(v: number) {
      this.value = v;
    },
  });

  const makeBaseNode = (type: string, extra?: Record<string, unknown>) => {
    const rec = { type, disconnected: false, extra };
    createdNodes.push(rec);
    return {
      connect() {
        return this;
      },
      disconnect() {
        rec.disconnected = true;
      },
    };
  };

  const panners: Array<{
    panningModel: string;
    distanceModel: string;
    positionX: { value: number };
    positionY: { value: number };
    positionZ: { value: number };
    disconnected: boolean;
  }> = [];

  const compressors: Array<{
    threshold: { value: number };
    knee: { value: number };
    ratio: { value: number };
    attack: { value: number };
    release: { value: number };
  }> = [];

  const listener = {
    positionX: makeParam(0),
    positionY: makeParam(0),
    positionZ: makeParam(0),
    forwardX: makeParam(0),
    forwardY: makeParam(0),
    forwardZ: makeParam(-1),
    upX: makeParam(0),
    upY: makeParam(1),
    upZ: makeParam(0),
  };

  const ctx = {
    sampleRate: 48000,
    currentTime: 1.25,
    state: 'suspended' as AudioContextState,
    destination: makeBaseNode('destination'),
    listener,
    async resume() {
      resumed = true;
      this.state = 'running';
    },
    async close() {
      closed = true;
      this.state = 'closed';
    },
    createBiquadFilter() {
      return {
        ...makeBaseNode('biquad'),
        type: 'lowpass',
        frequency: makeParam(1000),
        Q: makeParam(1),
      };
    },
    createDynamicsCompressor() {
      const node = {
        ...makeBaseNode('compressor'),
        threshold: makeParam(-24),
        knee: makeParam(30),
        ratio: makeParam(12),
        attack: makeParam(0.003),
        release: makeParam(0.25),
      };
      compressors.push(node);
      return node;
    },
    createGain() {
      return {
        ...makeBaseNode('gain'),
        gain: makeParam(1),
      };
    },
    createConvolver() {
      return {
        ...makeBaseNode('convolver'),
        buffer: null as unknown,
      };
    },
    createBuffer(channels: number, length: number, sampleRate: number) {
      const channelData = Array.from({ length: channels }, () => new Float32Array(length));
      return {
        numberOfChannels: channels,
        length,
        sampleRate,
        getChannelData(ch: number) {
          return channelData[ch];
        },
      };
    },
    createBufferSource() {
      return {
        ...makeBaseNode('bufferSource'),
        buffer: null as unknown,
        loop: false,
        start() {},
        stop() {},
      };
    },
    createOscillator() {
      return {
        ...makeBaseNode('oscillator'),
        type: 'sine',
        frequency: makeParam(440),
        start() {},
        stop() {},
      };
    },
    createPanner() {
      const base = makeBaseNode('panner');
      const node = {
        panningModel: 'equalpower',
        distanceModel: 'inverse',
        refDistance: 1,
        maxDistance: 10000,
        rolloffFactor: 1,
        positionX: makeParam(0),
        positionY: makeParam(0),
        positionZ: makeParam(0),
        disconnected: false,
        connect: base.connect,
        disconnect() {
          node.disconnected = true;
          base.disconnect();
        },
      };
      panners.push(node);
      return node;
    },
  };

  return {
    ctx: ctx as unknown as AudioContext,
    panners,
    compressors,
    listener,
    createdNodes,
    isClosed: () => closed,
    isResumed: () => resumed,
  };
}

function makeHand(
  handIndex: 0 | 1,
  opts: {
    x: number;
    y: number;
    z: number;
    pinchDist: number;
    palmExtension?: number;
  }
): XRHandFrameInput {
  const ext = opts.palmExtension ?? 0.16;
  return {
    handIndex,
    tracked: true,
    wrist: { x: opts.x, y: opts.y, z: opts.z },
    indexTip: { x: opts.x, y: opts.y + 0.04, z: opts.z - 0.1 },
    thumbTip: { x: opts.x + opts.pinchDist, y: opts.y + 0.04, z: opts.z - 0.1 },
    middleTip: { x: opts.x, y: opts.y + ext, z: opts.z - 0.02 },
  };
}

async function run(): Promise<void> {
  console.log('Running PIANIST — The Living Sound Garden verification suite...\n');

  await test('1. Botanical species catalog defines all 5 instruments with distinct colors', () => {
    const keys = Object.keys(BOTANICAL_SPECIES);
    assert.equal(keys.length, 5);
    const colors = new Set(Object.values(BOTANICAL_SPECIES).map((s) => s.petalColor));
    assert.equal(colors.size, 5);
  });

  await test('2. Scale degree to MIDI & frequency mapping stays musical and monotonic', () => {
    for (const scale of Object.values(GARDEN_SCALES)) {
      let prevMidi = -1;
      for (let d = 0; d <= MAX_NOTE_DEGREE; d++) {
        const midi = degreeToMidi(scale.id, d, 0);
        assert.ok(midi >= 36 && midi <= 96, `MIDI out of bounds for ${scale.id} degree ${d}`);
        assert.ok(midi > prevMidi, `Non-monotonic MIDI in ${scale.id}`);
        const freq = midiToFreq(midi);
        assert.ok(freq > 60 && freq < 2400);
        prevMidi = midi;
      }
    }
    assert.equal(midiToNoteName(69), 'A4');
    assert.equal(Math.round(midiToFreq(69)), 440);
    assert.equal(midiToNoteName(60), 'C4');
  });

  await test('3. Elevation <-> noteDegree round-trip stays within bounds', () => {
    assert.equal(elevationToNoteDegree(MIN_ELEVATION), 0);
    assert.equal(elevationToNoteDegree(MAX_ELEVATION), MAX_NOTE_DEGREE);
    for (let d = 0; d <= MAX_NOTE_DEGREE; d++) {
      const elev = noteDegreeToElevation(d);
      assert.ok(elev >= MIN_ELEVATION && elev <= MAX_ELEVATION);
      assert.equal(elevationToNoteDegree(elev), d);
    }
  });

  await test('4. Radial 16-step spatial ring mapping round-trips cleanly around compass', () => {
    for (let step = 0; step < TOTAL_STEPS; step++) {
      const { x, z } = radialStepToXZ(step, 4.2);
      const recovered = xzToRadialStep(x, z);
      assert.equal(recovered, step, `Step ${step} mapped to (${x}, ${z}) -> ${recovered}`);
    }
    assert.equal(xzToRadialStep(0, -4), 0);
    assert.equal(xzToRadialStep(4, 0), 4);
    assert.equal(xzToRadialStep(0, 4), 8);
    assert.equal(xzToRadialStep(-4, 0), 12);
  });

  await test('5. quantizeOrbPosition constrains extreme coordinates safely inside sanctuary clearing', () => {
    const inner = quantizeOrbPosition(0.01, -0.01, -5);
    assert.ok(Math.hypot(inner.x, inner.z) >= CLEARING_MIN_RADIUS - 0.01);
    assert.equal(inner.elevation, MIN_ELEVATION);
    assert.equal(inner.noteDegree, 0);

    const outer = quantizeOrbPosition(40, 30, 12);
    assert.ok(Math.hypot(outer.x, outer.z) <= CLEARING_MAX_RADIUS + 0.01);
    assert.equal(outer.elevation, MAX_ELEVATION);
    assert.equal(outer.noteDegree, MAX_NOTE_DEGREE);
  });

  await test('6. Touch Grass seed garden presets instantiate cleanly with valid orbs and harmonic links', () => {
    assert.ok(GARDEN_PRESETS.length >= 3);
    for (const preset of GARDEN_PRESETS) {
      const orbs = instantiatePresetOrbs(preset);
      assert.ok(orbs.length >= 8, `Preset ${preset.id} should have rich arrangement`);
      for (const orb of orbs) {
        assert.ok(orb.step >= 0 && orb.step < TOTAL_STEPS);
        assert.ok(orb.noteDegree >= 0 && orb.noteDegree <= MAX_NOTE_DEGREE);
        assert.ok(getOrbNoteLabel(orb, preset.scale).length >= 2);
      }
      const links = computeHarmonicLinks(orbs, preset.scale);
      assert.ok(links.length >= 4, `Preset ${preset.id} should generate consonant harmonic links`);
    }
  });

  await test('7. Conducting gesture metrics amplify dynamics, reverb bloom, and canopy openness on crescendo', () => {
    const resting = computeConductingMetrics(88, 0.15, 0.2, 0, false);
    const lifted = computeConductingMetrics(88, 0.85, 0.75, 0.05, false);
    const crescendo = computeConductingMetrics(88, 0.9, 0.9, 0, true);

    assert.ok(lifted.dynamics > resting.dynamics);
    assert.ok(lifted.bloomLevel > resting.bloomLevel);
    assert.ok(lifted.brilliance > resting.brilliance);
    assert.ok(crescendo.bloomLevel >= 0.86);
    assert.ok(crescendo.dynamics > lifted.dynamics);
    assert.ok(crescendo.reverbSend > resting.reverbSend);
    assert.ok(lifted.effectiveBpm > 88);
  });

  await test('8. Garden JSON snapshot serialization & deserialization preserves composition & rejects corrupt input', () => {
    const preset = GARDEN_PRESETS[0];
    const orbs = instantiatePresetOrbs(preset);
    const serialized = serializeGardenSnapshot({
      id: 'test-snap-1',
      name: 'Test Sound Garden',
      savedAt: '2026-11-17T00:00:00.000Z',
      scale: preset.scale,
      bpm: preset.bpm,
      skyMood: preset.skyMood,
      orbs,
    });
    const restored = deserializeGardenSnapshot(serialized);
    assert.ok(restored !== null);
    assert.equal(restored!.orbs.length, orbs.length);
    assert.equal(restored!.scale, preset.scale);
    assert.equal(restored!.bpm, preset.bpm);

    assert.equal(deserializeGardenSnapshot('not-json'), null);
    assert.equal(deserializeGardenSnapshot('{"scale":"invalid","orbs":[]}'), null);
  });

  await test('9. Sanctuary heightfield provides gentle clearing, sunken brook ring, and rising hills', () => {
    const centerY = groundHeightAt(0, 0);
    const brookY = groundHeightAt(8.1, 0);
    const outerHillY = groundHeightAt(32, 18);

    assert.ok(centerY > 0.05, 'Center sanctuary should sit gently crowned');
    assert.ok(brookY < -0.2, 'Garden brook moat should dip below water plane');
    assert.ok(outerHillY > 1.5, 'Outer terrain should rise into natural surrounding hills');
  });

  await test('10. WebXR capability probing handles absent, throwing, and supported runtimes cleanly', async () => {
    assert.equal(await probeWebXRSupport(undefined), false);
    assert.equal(
      await probeWebXRSupport({
        isSessionSupported: async () => {
          throw new Error('XR permission denied');
        },
      }),
      false
    );
    assert.equal(
      await probeWebXRSupport({
        isSessionSupported: async (mode) => mode === 'immersive-vr',
      }),
      true
    );
  });

  await test('11. XRSessionLifecycleManager prevents duplicate requests, rolls back attach failures, and ends idempotently', async () => {
    const mgr = new XRSessionLifecycleManager();
    assert.equal(mgr.getState(), 'unsupported');

    mgr.setSupported(true);
    assert.equal(mgr.getState(), 'ready');

    let requestedFeatures: string[] = [];
    let endCalls = 0;
    let endListeners: Array<() => void> = [];
    let resolveSession!: (s: {
      end: () => Promise<void>;
      addEventListener: (t: 'end', fn: () => void) => void;
    }) => void;

    const fakeXr = {
      requestSession: async (
        _mode: string,
        init?: { optionalFeatures?: string[] }
      ) => {
        requestedFeatures = init?.optionalFeatures ?? [];
        return new Promise<{
          end: () => Promise<void>;
          addEventListener: (t: 'end', fn: () => void) => void;
        }>((resolve) => {
          resolveSession = resolve;
        });
      },
    };

    let endedCallbackCount = 0;
    const req1 = mgr.requestImmersiveSession({
      xr: fakeXr,
      attachSession: async () => {},
      onSessionEnded: () => {
        endedCallbackCount++;
      },
    });
    assert.equal(mgr.getState(), 'requesting');

    // Duplicate concurrent click must be rejected safely
    const dup = await mgr.requestImmersiveSession({
      xr: fakeXr,
      attachSession: async () => {},
      onSessionEnded: () => {},
    });
    assert.equal(dup.started, false);
    assert.match(dup.message ?? '', /already in progress/i);

    resolveSession({
      end: async () => {
        endCalls++;
        endListeners.forEach((fn) => fn());
      },
      addEventListener: (_t, fn) => {
        endListeners.push(fn);
      },
    });

    const res1 = await req1;
    assert.equal(res1.started, true);
    assert.equal(mgr.getState(), 'active');
    assert.ok(requestedFeatures.includes('hand-tracking'));
    assert.ok(requestedFeatures.includes('local-floor'));

    // End cleanly
    await mgr.endSession();
    await mgr.endSession();
    assert.equal(mgr.getState(), 'ready');
    assert.equal(endedCallbackCount, 1);

    // Attach failure must roll back by calling session.end() and resetting state to 'ready'
    let rollbackEnded = false;
    const failedAttach = await mgr.requestImmersiveSession({
      xr: {
        requestSession: async () => ({
          end: async () => {
            rollbackEnded = true;
          },
          addEventListener: () => {},
        }),
      },
      attachSession: async () => {
        throw new Error('WebGL XR binding failed');
      },
      onSessionEnded: () => {},
    });
    assert.equal(failedAttach.started, false);
    assert.equal(rollbackEnded, true);
    assert.equal(mgr.getState(), 'ready');
    assert.ok(endCalls >= 1);
  });

  await test('12. XRHandInteractionController pinch hysteresis, 450ms plant debounce, and VR preview projection', () => {
    const ctrl = new XRHandInteractionController();
    const unTracked: XRHandFrameInput = { handIndex: 0, tracked: false };

    // Hover open hand over clearing -> emits previewPoint, no plant
    const hoverOut = ctrl.update({
      nowMs: 1000,
      dtSec: 0.016,
      hands: [unTracked, makeHand(1, { x: 2.8, y: 1.2, z: -2.0, pinchDist: 0.06 })],
      orbs: [],
      activeControllerCount: 0,
      canPlantMore: true,
    });
    assert.ok(hoverOut.previewPoint !== null);
    assert.equal(hoverOut.events.length, 0);

    // Engage pinch (< 0.024m) -> plants exactly 1 orb
    const pinch1 = ctrl.update({
      nowMs: 1050,
      dtSec: 0.016,
      hands: [unTracked, makeHand(1, { x: 2.8, y: 1.2, z: -2.0, pinchDist: 0.018 })],
      orbs: [],
      activeControllerCount: 0,
      canPlantMore: true,
    });
    assert.equal(pinch1.events.filter((e) => e.type === 'plant').length, 1);
    assert.equal(pinch1.pinchStates[1], true);

    // Hysteresis zone (0.032m, between 0.024m and 0.040m) MUST stay pinched and NOT double-plant
    const jitter = ctrl.update({
      nowMs: 1120,
      dtSec: 0.016,
      hands: [unTracked, makeHand(1, { x: 2.8, y: 1.2, z: -2.0, pinchDist: 0.032 })],
      orbs: [],
      activeControllerCount: 0,
      canPlantMore: true,
    });
    assert.equal(jitter.pinchStates[1], true);
    assert.equal(jitter.events.filter((e) => e.type === 'plant').length, 0);

    // Release pinch (> 0.040m) and re-pinch within PLANT_COOLDOWN_MS -> debounced!
    ctrl.update({
      nowMs: 1200,
      dtSec: 0.016,
      hands: [unTracked, makeHand(1, { x: 2.8, y: 1.2, z: -2.0, pinchDist: 0.055 })],
      orbs: [],
      activeControllerCount: 0,
      canPlantMore: true,
    });
    const tooSoon = ctrl.update({
      nowMs: 1050 + PLANT_COOLDOWN_MS - 50,
      dtSec: 0.016,
      hands: [unTracked, makeHand(1, { x: 3.1, y: 1.2, z: -2.1, pinchDist: 0.015 })],
      orbs: [],
      activeControllerCount: 0,
      canPlantMore: true,
    });
    assert.equal(tooSoon.events.filter((e) => e.type === 'plant').length, 0);

    // Release and pinch after PLANT_COOLDOWN_MS -> plants cleanly
    ctrl.update({
      nowMs: 1600,
      dtSec: 0.016,
      hands: [unTracked, makeHand(1, { x: 3.1, y: 1.2, z: -2.1, pinchDist: 0.055 })],
      orbs: [],
      activeControllerCount: 0,
      canPlantMore: true,
    });
    const allowedAgain = ctrl.update({
      nowMs: 1650,
      dtSec: 0.016,
      hands: [unTracked, makeHand(1, { x: 3.1, y: 1.2, z: -2.1, pinchDist: 0.015 })],
      orbs: [],
      activeControllerCount: 0,
      canPlantMore: true,
    });
    assert.equal(allowedAgain.events.filter((e) => e.type === 'plant').length, 1);
  });

  await test('13. XRHandInteractionController grabs nearby orb, sculpts smoothly in 3D, and releases cleanly', () => {
    const ctrl = new XRHandInteractionController();
    const unTracked: XRHandFrameInput = { handIndex: 0, tracked: false };
    const orbs = [{ id: 'orb-alpha', x: 2.0, y: 1.4, z: -2.1 }];

    const grab = ctrl.update({
      nowMs: 2000,
      dtSec: 0.016,
      hands: [unTracked, makeHand(1, { x: 2.02, y: 1.36, z: -2.0, pinchDist: 0.016 })],
      orbs,
      activeControllerCount: 0,
      canPlantMore: true,
    });
    assert.deepEqual(grab.events, [{ type: 'grab', handIndex: 1, orbId: 'orb-alpha' }]);
    assert.equal(grab.grabbedOrbIds[1], 'orb-alpha');

    const sculpt = ctrl.update({
      nowMs: 2032,
      dtSec: 0.032,
      hands: [unTracked, makeHand(1, { x: 2.4, y: 2.2, z: -1.8, pinchDist: 0.02 })],
      orbs,
      activeControllerCount: 0,
      canPlantMore: true,
    });
    assert.equal(sculpt.events[0]?.type, 'sculpt');

    const release = ctrl.update({
      nowMs: 2064,
      dtSec: 0.032,
      hands: [unTracked, makeHand(1, { x: 2.4, y: 2.2, z: -1.8, pinchDist: 0.055 })],
      orbs,
      activeControllerCount: 0,
      canPlantMore: true,
    });
    assert.deepEqual(release.events, [
      { type: 'release', handIndex: 1, orbId: 'orb-alpha', reason: 'unpinch' },
    ]);
    assert.equal(release.grabbedOrbIds[1], null);
  });

  await test('14. XRHandInteractionController releases stuck orb grabs after 180ms tracking-loss grace window', () => {
    const ctrl = new XRHandInteractionController();
    const unTracked0: XRHandFrameInput = { handIndex: 0, tracked: false };
    const unTracked1: XRHandFrameInput = { handIndex: 1, tracked: false };
    const orbs = [{ id: 'orb-beta', x: 1.5, y: 1.3, z: -1.6 }];

    ctrl.update({
      nowMs: 3000,
      dtSec: 0.016,
      hands: [unTracked0, makeHand(1, { x: 1.5, y: 1.26, z: -1.5, pinchDist: 0.015 })],
      orbs,
      activeControllerCount: 0,
      canPlantMore: true,
    });

    // Brief 60ms occlusion: stays grabbed inside grace window
    const briefDrop = ctrl.update({
      nowMs: 3060,
      dtSec: 0.06,
      hands: [unTracked0, unTracked1],
      orbs,
      activeControllerCount: 0,
      canPlantMore: true,
    });
    assert.equal(briefDrop.grabbedOrbIds[1], 'orb-beta');
    assert.equal(briefDrop.trackingStatus, 'lost');

    // Beyond TRACKING_LOSS_GRACE_MS -> auto-releases safely
    const prolongedDrop = ctrl.update({
      nowMs: 3000 + TRACKING_LOSS_GRACE_MS + 10,
      dtSec: 0.13,
      hands: [unTracked0, unTracked1],
      orbs,
      activeControllerCount: 0,
      canPlantMore: true,
    });
    assert.equal(prolongedDrop.grabbedOrbIds[1], null);
    assert.ok(
      prolongedDrop.events.some(
        (e) => e.type === 'release' && e.orbId === 'orb-beta' && e.reason === 'tracking-lost'
      )
    );
  });

  await test('15. Deliberate two-hand Conduct Bloom rejects false positives, triggers one-shot after 420ms dwell, and enforces cooldown', () => {
    const ctrl = new XRHandInteractionController();

    // False positive A: single hand raised high
    const singleHand = ctrl.update({
      nowMs: 4000,
      dtSec: 0.05,
      hands: [
        { handIndex: 0, tracked: false },
        makeHand(1, { x: 0.4, y: 1.55, z: -0.4, pinchDist: 0.08, palmExtension: 0.16 }),
      ],
      orbs: [],
      activeControllerCount: 0,
      canPlantMore: true,
    });
    assert.equal(singleHand.bloomActive, false);
    assert.equal(singleHand.bloomDwellProgress, 0);

    // False positive B: both hands raised high, but pinched/fisted (palmExtension < 0.11m)
    const fisted = ctrl.update({
      nowMs: 4500,
      dtSec: 0.5,
      hands: [
        makeHand(0, { x: -0.3, y: 1.55, z: -0.4, pinchDist: 0.06, palmExtension: 0.06 }),
        makeHand(1, { x: 0.3, y: 1.55, z: -0.4, pinchDist: 0.06, palmExtension: 0.06 }),
      ],
      orbs: [],
      activeControllerCount: 0,
      canPlantMore: true,
    });
    assert.equal(fisted.bloomActive, false);

    // True pose start: both open palms high (>= 1.38m) & wide (>= 0.34m)
    const startCharge = ctrl.update({
      nowMs: 5000,
      dtSec: 0.016,
      hands: [
        makeHand(0, { x: -0.25, y: 1.48, z: -0.4, pinchDist: 0.08, palmExtension: 0.16 }),
        makeHand(1, { x: 0.25, y: 1.48, z: -0.4, pinchDist: 0.08, palmExtension: 0.16 }),
      ],
      orbs: [],
      activeControllerCount: 0,
      canPlantMore: true,
    });
    assert.equal(startCharge.bloomActive, false);

    // Halfway dwell (< 420ms) -> still charging, no fire yet
    const midCharge = ctrl.update({
      nowMs: 5210,
      dtSec: 0.21,
      hands: [
        makeHand(0, { x: -0.25, y: 1.48, z: -0.4, pinchDist: 0.08, palmExtension: 0.16 }),
        makeHand(1, { x: 0.25, y: 1.48, z: -0.4, pinchDist: 0.08, palmExtension: 0.16 }),
      ],
      orbs: [],
      activeControllerCount: 0,
      canPlantMore: true,
    });
    assert.equal(midCharge.bloomActive, false);
    assert.ok(midCharge.bloomDwellProgress > 0.45 && midCharge.bloomDwellProgress < 0.6);

    // Crosses 420ms dwell -> fires bloom-start ONCE
    const fire = ctrl.update({
      nowMs: 5000 + BLOOM_DWELL_MS + 10,
      dtSec: 0.22,
      hands: [
        makeHand(0, { x: -0.25, y: 1.5, z: -0.4, pinchDist: 0.08, palmExtension: 0.16 }),
        makeHand(1, { x: 0.25, y: 1.5, z: -0.4, pinchDist: 0.08, palmExtension: 0.16 }),
      ],
      orbs: [],
      activeControllerCount: 0,
      canPlantMore: true,
    });
    assert.equal(fire.bloomActive, true);
    assert.equal(fire.events.filter((e) => e.type === 'bloom-start').length, 1);

    // Continuing to hold MUST NOT re-fire bloom-start (one-shot edge trigger)
    const hold = ctrl.update({
      nowMs: 5600,
      dtSec: 0.17,
      hands: [
        makeHand(0, { x: -0.25, y: 1.5, z: -0.4, pinchDist: 0.08, palmExtension: 0.16 }),
        makeHand(1, { x: 0.25, y: 1.5, z: -0.4, pinchDist: 0.08, palmExtension: 0.16 }),
      ],
      orbs: [],
      activeControllerCount: 0,
      canPlantMore: true,
    });
    assert.equal(hold.bloomActive, true);
    assert.equal(hold.events.filter((e) => e.type === 'bloom-start').length, 0);

    // Lower hands -> fires bloom-end and starts 1400ms cooldown
    const lowered = ctrl.update({
      nowMs: 6000,
      dtSec: 0.4,
      hands: [
        makeHand(0, { x: -0.25, y: 1.0, z: -0.4, pinchDist: 0.08, palmExtension: 0.16 }),
        makeHand(1, { x: 0.25, y: 1.0, z: -0.4, pinchDist: 0.08, palmExtension: 0.16 }),
      ],
      orbs: [],
      activeControllerCount: 0,
      canPlantMore: true,
    });
    assert.equal(lowered.bloomActive, false);
    assert.ok(lowered.events.some((e) => e.type === 'bloom-end'));

    // Raising hands during cooldown MUST NOT trigger bloom
    const duringCooldown = ctrl.update({
      nowMs: 6000 + BLOOM_COOLDOWN_MS - 100,
      dtSec: 0.5,
      hands: [
        makeHand(0, { x: -0.25, y: 1.55, z: -0.4, pinchDist: 0.08, palmExtension: 0.16 }),
        makeHand(1, { x: 0.25, y: 1.55, z: -0.4, pinchDist: 0.08, palmExtension: 0.16 }),
      ],
      orbs: [],
      activeControllerCount: 0,
      canPlantMore: true,
    });
    assert.equal(duringCooldown.bloomActive, false);
    assert.equal(duringCooldown.bloomDwellProgress, 0);
  });

  await test('16. Touch controller fallback is strictly gated whenever native hand tracking is active or recent', () => {
    const ctrl = new XRHandInteractionController();
    assert.equal(ctrl.shouldAllowControllerFallback(0, 1000), true);

    ctrl.update({
      nowMs: 2000,
      dtSec: 0.016,
      hands: [
        makeHand(0, { x: -0.3, y: 1.1, z: -0.4, pinchDist: 0.08 }),
        { handIndex: 1, tracked: false },
      ],
      orbs: [],
      activeControllerCount: 1,
      canPlantMore: true,
    });
    assert.equal(ctrl.shouldAllowControllerFallback(0, 2000), false);
    assert.equal(ctrl.shouldAllowControllerFallback(1, 2000), false);

    // Hands disappear, still inside suppression window -> still blocked
    ctrl.update({
      nowMs: 2300,
      dtSec: 0.3,
      hands: [
        { handIndex: 0, tracked: false },
        { handIndex: 1, tracked: false },
      ],
      orbs: [],
      activeControllerCount: 1,
      canPlantMore: true,
    });
    assert.equal(ctrl.shouldAllowControllerFallback(0, 2300), false);

    // After HAND_FALLBACK_SUPPRESS_MS -> Touch controller fallback re-enabled
    assert.equal(
      ctrl.shouldAllowControllerFallback(0, 2000 + HAND_FALLBACK_SUPPRESS_MS + 20),
      true
    );
  });

  await test('17. SpatialAudioEngine builds HRTF panners, 5 voices, -2dB brickwall safety limiter, and disposes with zero leaks', () => {
    const mock = makeMockAudioContext();
    const audio = new LivingSoundGardenAudioEngine({
      audioContextFactory: () => mock.ctx,
    });
    assert.equal(audio.getState(), 'uninitialized');

    const started = audio.ensureStarted();
    assert.equal(started, true);
    assert.equal(mock.isResumed(), true);
    assert.equal(audio.getState(), 'running');

    // Verify dual-stage dynamics: musical compressor (-16 dB) + brickwall safety limiter (-2 dB, 18:1, 1ms)
    assert.equal(mock.compressors.length, 2);
    assert.equal(mock.compressors[0].threshold.value, -16);
    assert.equal(mock.compressors[1].threshold.value, -2);
    assert.equal(mock.compressors[1].ratio.value, 18);
    assert.equal(mock.compressors[1].attack.value, 0.001);

    // Sync listener 3D pose including rolled up vector
    audio.syncListener(0, 1.65, 0, 0, 0, -1, 0.2, 0.98, 0);
    assert.equal(mock.listener.positionY.value, 1.65);
    assert.equal(mock.listener.upX.value, 0.2);

    const metrics = computeConductingMetrics(88, 0.85, 0.8, 0, true);
    const allSpecies: SoundSpeciesId[] = ['bellflower', 'lotus', 'reed', 'fern', 'lily'];
    allSpecies.forEach((species, idx) => {
      audio.triggerOrb(
        {
          id: `test-${species}`,
          species,
          x: idx - 2,
          z: -3,
          elevation: 1.5,
          step: idx * 2,
          noteDegree: 4 + idx,
          sustain: 0.75,
          velocity: 0.85,
          muted: false,
          plantedAt: Date.now(),
        },
        'f-lydian',
        metrics
      );
    });
    audio.playPetalBrush(1, 1.6, -2, 65);
    audio.playBloomCrescendoSwell('f-lydian');

    assert.equal(mock.panners.length, 6);
    assert.ok(mock.panners.every((p) => p.panningModel === 'HRTF'));
    assert.equal(audio.getActivePannerCount(), 6);
    assert.equal(audio.getPendingCleanupTimerCount(), 6);

    audio.dispose();
    assert.equal(audio.getActivePannerCount(), 0);
    assert.equal(audio.getPendingCleanupTimerCount(), 0);
    assert.ok(mock.panners.every((p) => p.disconnected));
    assert.equal(mock.isClosed(), true);
    assert.equal(audio.getState(), 'uninitialized');
  });

  await test('18. Non-destructive save preserves prior gardens & strict JSON validator blocks prototype pollution and invalid payloads', () => {
    const preset = GARDEN_PRESETS[0];
    const baseOrbs = instantiatePresetOrbs(preset);
    const first: SavedGardenSnapshot = {
      id: 'garden-same',
      name: 'Morning Meadow',
      savedAt: '2026-11-17T00:00:00.000Z',
      scale: preset.scale,
      bpm: preset.bpm,
      skyMood: preset.skyMood,
      orbs: baseOrbs,
    };

    const list1 = mergeSavedGardenSnapshot([], first);
    const list2 = mergeSavedGardenSnapshot(list1, { ...first });
    assert.equal(list2.length, 2, 'Saving with matching id/name must NEVER overwrite prior garden');
    assert.notEqual(list2[0].id, list2[1].id);
    assert.equal(list2[0].name, 'Morning Meadow (2)');

    // Prototype pollution payloads must be rejected
    const protoAttack =
      '{"__proto__":{"polluted":true},"scale":"f-lydian","bpm":88,"orbs":[]}';
    assert.equal(validateAndDeserializeGardenSnapshot(protoAttack).ok, false);

    const ctorAttack =
      '{"scale":"f-lydian","orbs":[{"species":"bellflower","x":2,"z":-2,"constructor":{"x":1}}]}';
    assert.equal(validateAndDeserializeGardenSnapshot(ctorAttack).ok, false);

    // Unknown species, non-finite coords, and > MAX_SAVED_ORBS must be rejected
    assert.equal(
      validateAndDeserializeGardenSnapshot(
        JSON.stringify({
          scale: 'f-lydian',
          orbs: [{ species: 'unknown-plant', x: 2, z: -2 }],
        })
      ).ok,
      false
    );
    assert.equal(
      validateAndDeserializeGardenSnapshot(
        JSON.stringify({
          scale: 'f-lydian',
          orbs: Array.from({ length: MAX_SAVED_ORBS + 1 }, () => ({
            species: 'bellflower',
            x: 2,
            z: -2,
          })),
        })
      ).ok,
      false
    );
    assert.equal(
      validateAndDeserializeGardenSnapshot(
        '{"scale":"f-lydian","orbs":[{"species":"bellflower","x":null,"z":-2}]}'
      ).ok,
      false
    );

    // Valid payload passes cleanly
    const valid = validateAndDeserializeGardenSnapshot(serializeGardenSnapshot(first));
    assert.equal(valid.ok, true);
    assert.equal(valid.snapshot?.orbs.length, baseOrbs.length);
  });

  await test('19. Dr. T, PIANIST, Touch Grass, and WebXR static integration contracts remain intact', () => {
    const root = process.cwd();
    const appSrc = fs.readFileSync(path.join(root, 'src/App.tsx'), 'utf8');
    const pianistSrc = fs.readFileSync(
      path.join(root, 'src/components/pianist/PianistApp.tsx'),
      'utf8'
    );
    const engineSrc = fs.readFileSync(
      path.join(root, 'src/components/pianist/soundgarden/LivingSoundGardenEngine.ts'),
      'utf8'
    );
    const moduleSrc = fs.readFileSync(
      path.join(root, 'src/components/pianist/soundgarden/LivingSoundGardenModule.tsx'),
      'utf8'
    );

    // Deep links to Living Sound Garden intact
    assert.ok(appSrc.includes('living-sound-garden'));
    assert.ok(pianistSrc.includes('LivingSoundGardenModule'));
    assert.ok(pianistSrc.includes('onOpenSoundGarden'));

    // Critical XR repairs present in engine
    assert.ok(engineSrc.includes('this.scene.add(xrHand)'));
    assert.ok(engineSrc.includes('activeCam.getWorldQuaternion(_xrQuat)'));
    assert.ok(engineSrc.includes('shouldAllowControllerFallback'));
    assert.ok(engineSrc.includes('WEBGL_lose_context'));

    // Privacy, audio unlock, and JSON import controls present in module UI
    assert.ok(moduleSrc.includes('Camera Active (Local Only)'));
    assert.ok(moduleSrc.includes('Enable Spatial Sound'));
    assert.ok(moduleSrc.includes('validateAndDeserializeGardenSnapshot'));
    assert.ok(!moduleSrc.includes('backdrop-blur'));
  });

  console.log(`\nAll ${passed}/${passed} Living Sound Garden tests passed.`);
}

run().catch((err) => {
  console.error('\nLiving Sound Garden verification suite FAILED:', err);
  process.exit(1);
});
