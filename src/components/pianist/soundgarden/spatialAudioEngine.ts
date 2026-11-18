import {
  AudioEngineState,
  ConductingMetrics,
  ScaleId,
  SoundOrb,
} from './types';
import {
  clamp,
  degreeToMidi,
  getOrbMidi,
  midiToFreq,
} from './musicTheory';

export interface SpatialAudioEngineOptions {
  audioContextFactory?: () => AudioContext;
}

/**
 * Pure Web Audio API 3D Spatial Synthesis Engine for PIANIST — The Living Sound Garden.
 * Uses HRTF 3D panning synced to the Three.js / WebXR listener, procedural convolution
 * woodland reverb (zero external files), dual-stage dynamics + brickwall headset safety
 * limiter (-2 dB), and five organic botanical-piano voices.
 */
export class LivingSoundGardenAudioEngine {
  private audioContextFactory?: () => AudioContext;
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private dryGain: GainNode | null = null;
  private reverbNode: ConvolverNode | null = null;
  private reverbSendGain: GainNode | null = null;
  private masterFilter: BiquadFilterNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private safetyLimiter: DynamicsCompressorNode | null = null;

  private ambienceActive = false;
  private ambienceGain: GainNode | null = null;
  private ambienceSource: AudioBufferSourceNode | null = null;
  private ambienceFilter: BiquadFilterNode | null = null;

  private activePanners = new Set<PannerNode>();
  private cleanupTimers = new Set<ReturnType<typeof setTimeout>>();

  private muted = false;
  private lastBrushTime = 0;

  constructor(options?: SpatialAudioEngineOptions) {
    this.audioContextFactory = options?.audioContextFactory;
  }

  public getState(): AudioEngineState {
    if (!this.ctx) return 'uninitialized';
    if (this.ctx.state === 'running') return 'running';
    if (this.ctx.state === 'closed') return 'closed';
    return 'suspended';
  }

  public getActivePannerCount(): number {
    return this.activePanners.size;
  }

  public getPendingCleanupTimerCount(): number {
    return this.cleanupTimers.size;
  }

  public ensureStarted(): boolean {
    if (!this.ctx) {
      if (this.audioContextFactory) {
        this.ctx = this.audioContextFactory();
      } else {
        if (typeof window === 'undefined') return false;
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext;
        if (!AudioCtx) return false;
        this.ctx = new AudioCtx();
      }

      this.masterFilter = this.ctx.createBiquadFilter();
      this.masterFilter.type = 'lowpass';
      this.masterFilter.frequency.value = 6800;
      this.masterFilter.Q.value = 0.55;

      // Stage 1: Warm musical bus glue compressor
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.value = -16;
      this.compressor.knee.value = 18;
      this.compressor.ratio.value = 3.5;
      this.compressor.attack.value = 0.006;
      this.compressor.release.value = 0.22;

      // Stage 2: Fast brickwall headset comfort safety limiter (-2 dB ceiling)
      this.safetyLimiter = this.ctx.createDynamicsCompressor();
      this.safetyLimiter.threshold.value = -2;
      this.safetyLimiter.knee.value = 0;
      this.safetyLimiter.ratio.value = 18;
      this.safetyLimiter.attack.value = 0.001;
      this.safetyLimiter.release.value = 0.08;

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.muted ? 0.0001 : 0.8;

      this.dryGain = this.ctx.createGain();
      this.dryGain.gain.value = 0.85;

      this.reverbSendGain = this.ctx.createGain();
      this.reverbSendGain.gain.value = 0.34;

      this.reverbNode = this.ctx.createConvolver();
      this.reverbNode.buffer = this.createGardenImpulseResponse(this.ctx, 2.7, 2.3);

      this.dryGain.connect(this.masterFilter);
      this.reverbSendGain.connect(this.reverbNode);
      this.reverbNode.connect(this.masterFilter);

      this.masterFilter.connect(this.compressor);
      this.compressor.connect(this.safetyLimiter);
      this.safetyLimiter.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return true;
  }

  private createGardenImpulseResponse(
    ctx: AudioContext,
    durationSec: number,
    decay: number
  ): AudioBuffer {
    const sampleRate = ctx.sampleRate;
    const length = Math.floor(sampleRate * durationSec);
    const buffer = ctx.createBuffer(2, length, sampleRate);

    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      let lp = 0;
      for (let i = 0; i < length; i++) {
        const t = i / length;
        // Soft natural open-air canopy reflections: subtle early swell + warm exponential tail
        const env = Math.pow(1 - t, decay) * (0.28 + 0.72 * Math.min(1, t * 28));
        const white = Math.random() * 2 - 1;
        lp = lp * 0.68 + white * 0.32;
        data[i] = lp * env * 0.45;
      }
    }
    return buffer;
  }

  public setMuted(muted: boolean): void {
    this.muted = muted;
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.setTargetAtTime(
        muted ? 0.0001 : 0.82,
        this.ctx.currentTime,
        0.04
      );
    }
  }

  public updateConductingMix(metrics: ConductingMetrics): void {
    if (!this.ctx || !this.masterFilter || !this.reverbSendGain) return;
    const now = this.ctx.currentTime;
    const cutoff = 2600 + metrics.brilliance * 7600;
    this.masterFilter.frequency.setTargetAtTime(cutoff, now, 0.09);
    this.reverbSendGain.gain.setTargetAtTime(metrics.reverbSend, now, 0.12);

    if (this.ambienceActive && this.ambienceFilter && this.ambienceGain) {
      this.ambienceFilter.frequency.setTargetAtTime(
        340 + metrics.bloomLevel * 520,
        now,
        0.2
      );
      this.ambienceGain.gain.setTargetAtTime(
        0.032 + metrics.bloomLevel * 0.025,
        now,
        0.2
      );
    }
  }

  public setAmbienceEnabled(enabled: boolean): void {
    this.ambienceActive = enabled;
    if (!enabled) {
      if (this.ambienceGain && this.ctx) {
        this.ambienceGain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.18);
      }
      return;
    }

    if (!this.ensureStarted() || !this.ctx || !this.masterFilter) return;

    if (!this.ambienceSource) {
      const length = this.ctx.sampleRate * 4;
      const noiseBuf = this.ctx.createBuffer(2, length, this.ctx.sampleRate);
      for (let ch = 0; ch < 2; ch++) {
        const out = noiseBuf.getChannelData(ch);
        let b0 = 0;
        let b1 = 0;
        let b2 = 0;
        for (let i = 0; i < length; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.997 * b0 + white * 0.029;
          b1 = 0.985 * b1 + white * 0.032;
          b2 = 0.95 * b2 + white * 0.048;
          out[i] = (b0 + b1 + b2) * 0.32;
        }
      }

      this.ambienceSource = this.ctx.createBufferSource();
      this.ambienceSource.buffer = noiseBuf;
      this.ambienceSource.loop = true;

      this.ambienceFilter = this.ctx.createBiquadFilter();
      this.ambienceFilter.type = 'bandpass';
      this.ambienceFilter.frequency.value = 420;
      this.ambienceFilter.Q.value = 0.7;

      this.ambienceGain = this.ctx.createGain();
      this.ambienceGain.gain.value = 0.0001;

      this.ambienceSource.connect(this.ambienceFilter);
      this.ambienceFilter.connect(this.ambienceGain);
      this.ambienceGain.connect(this.masterFilter);
      this.ambienceSource.start();
    }

    if (this.ambienceGain) {
      this.ambienceGain.gain.setTargetAtTime(0.038, this.ctx.currentTime, 0.35);
    }
  }

  public syncListener(
    posX: number,
    posY: number,
    posZ: number,
    fwdX: number,
    fwdY: number,
    fwdZ: number,
    upX: number,
    upY: number,
    upZ: number
  ): void {
    if (!this.ctx) return;
    const listener = this.ctx.listener;
    const now = this.ctx.currentTime;
    if (listener.positionX) {
      listener.positionX.setTargetAtTime(posX, now, 0.03);
      listener.positionY.setTargetAtTime(posY, now, 0.03);
      listener.positionZ.setTargetAtTime(posZ, now, 0.03);
      listener.forwardX.setTargetAtTime(fwdX, now, 0.03);
      listener.forwardY.setTargetAtTime(fwdY, now, 0.03);
      listener.forwardZ.setTargetAtTime(fwdZ, now, 0.03);
      listener.upX.setTargetAtTime(upX, now, 0.03);
      listener.upY.setTargetAtTime(upY, now, 0.03);
      listener.upZ.setTargetAtTime(upZ, now, 0.03);
    } else if (typeof listener.setPosition === 'function') {
      listener.setPosition(posX, posY, posZ);
      listener.setOrientation(fwdX, fwdY, fwdZ, upX, upY, upZ);
    }
  }

  private createSpatialPanner(x: number, y: number, z: number): PannerNode | null {
    if (!this.ctx || !this.dryGain || !this.reverbSendGain) return null;
    const panner = this.ctx.createPanner();
    panner.panningModel = 'HRTF';
    panner.distanceModel = 'inverse';
    panner.refDistance = 2.6;
    panner.maxDistance = 32;
    panner.rolloffFactor = 0.72;
    panner.positionX.value = x;
    panner.positionY.value = y;
    panner.positionZ.value = z;
    panner.connect(this.dryGain);
    panner.connect(this.reverbSendGain);
    this.activePanners.add(panner);
    return panner;
  }

  private schedulePannerCleanup(panner: PannerNode, delayMs: number): void {
    const timer = globalThis.setTimeout(() => {
      this.cleanupTimers.delete(timer);
      this.activePanners.delete(panner);
      try {
        panner.disconnect();
      } catch {
        // already disconnected
      }
    }, delayMs);
    this.cleanupTimers.add(timer);
  }

  public triggerOrb(
    orb: SoundOrb,
    scaleId: ScaleId,
    metrics: ConductingMetrics
  ): void {
    if (orb.muted || this.muted) return;
    if (!this.ensureStarted() || !this.ctx) return;

    const now = this.ctx.currentTime;
    const midi = getOrbMidi(orb, scaleId);
    const freq = midiToFreq(midi);
    // Soft polyphony headroom scaling prevents harsh stacking during dense Conduct Blooms
    const polyphonyScale = 1 / Math.sqrt(1 + Math.max(0, this.activePanners.size - 4) * 0.22);
    const vel = clamp(orb.velocity * metrics.dynamics * polyphonyScale, 0.14, 1.25);
    const sustainSec = 0.45 + orb.sustain * (1.7 + metrics.bloomLevel * 1.15);

    const panner = this.createSpatialPanner(orb.x, orb.elevation + 0.35, orb.z);
    if (!panner) return;

    switch (orb.species) {
      case 'bellflower':
        this.playBellflowerVoice(now, freq, vel, sustainSec, metrics, panner);
        break;
      case 'lotus':
        this.playLotusPianoChordVoice(now, orb, scaleId, vel, sustainSec, metrics, panner);
        break;
      case 'reed':
        this.playMossReedBassVoice(now, freq, vel, sustainSec, metrics, panner);
        break;
      case 'fern':
        this.playWindchimeFernVoice(now, orb, scaleId, vel, sustainSec, metrics, panner);
        break;
      case 'lily':
        this.playRaindropLilyVoice(now, freq, vel, sustainSec, panner);
        break;
    }

    // Track and cleanly disconnect panner after voice completes
    this.schedulePannerCleanup(panner, Math.ceil((sustainSec + 0.9) * 1000));
  }

  private playBellflowerVoice(
    now: number,
    freq: number,
    vel: number,
    sustainSec: number,
    metrics: ConductingMetrics,
    dest: AudioNode
  ): void {
    if (!this.ctx) return;
    const partials: Array<[number, OscillatorType, number]> = [
      [1, 'triangle', 0.24],
      [2, 'sine', 0.11 + metrics.brilliance * 0.08],
      [3.004, 'sine', 0.055 + metrics.bloomLevel * 0.04],
      [5.4, 'sine', 0.018 * metrics.brilliance],
    ];

    for (const [ratio, type, amp] of partials) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq * ratio, now);

      const peak = Math.max(0.001, amp * vel);
      const decayTime = ratio > 2.5 ? sustainSec * 0.48 : sustainSec;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(peak, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(peak * 0.28, now + decayTime * 0.35);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + decayTime);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + decayTime + 0.05);
    }
  }

  private playLotusPianoChordVoice(
    now: number,
    orb: SoundOrb,
    scaleId: ScaleId,
    vel: number,
    sustainSec: number,
    metrics: ConductingMetrics,
    dest: AudioNode
  ): void {
    if (!this.ctx) return;
    // Root + scale third; when conducting bloom swells, add glowing fifth & octave harmonic
    const degrees = [orb.noteDegree, orb.noteDegree + 2];
    if (metrics.bloomLevel > 0.36) degrees.push(orb.noteDegree + 4);
    if (metrics.bloomLevel > 0.72) degrees.push(orb.noteDegree + 7);

    degrees.forEach((deg, idx) => {
      if (!this.ctx) return;
      const start = now + idx * 0.028;
      const freq = midiToFreq(degreeToMidi(scaleId, deg, 0));
      const voiceScale = idx === 0 ? 0.21 : idx === 1 ? 0.14 : 0.1;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400 + metrics.brilliance * 2400, start);
      filter.frequency.exponentialRampToValueAtTime(650, start + sustainSec);

      const env = this.ctx.createGain();
      const peak = Math.max(0.001, voiceScale * vel);
      env.gain.setValueAtTime(0.0001, start);
      env.gain.linearRampToValueAtTime(peak, start + 0.018);
      env.gain.exponentialRampToValueAtTime(peak * 0.36, start + sustainSec * 0.42);
      env.gain.exponentialRampToValueAtTime(0.0001, start + sustainSec);

      const osc1 = this.ctx.createOscillator();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, start);

      const osc2 = this.ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2.002, start);

      const osc2Gain = this.ctx.createGain();
      osc2Gain.gain.value = 0.28 + metrics.harmonyShimmer * 0.16;

      osc1.connect(filter);
      osc2.connect(osc2Gain);
      osc2Gain.connect(filter);
      filter.connect(env);
      env.connect(dest);

      osc1.start(start);
      osc2.start(start);
      osc1.stop(start + sustainSec + 0.06);
      osc2.stop(start + sustainSec + 0.06);
    });
  }

  private playMossReedBassVoice(
    now: number,
    freq: number,
    vel: number,
    sustainSec: number,
    metrics: ConductingMetrics,
    dest: AudioNode
  ): void {
    if (!this.ctx) return;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(460 + metrics.brilliance * 520, now);
    filter.Q.value = 1.2;

    const env = this.ctx.createGain();
    const peak = Math.max(0.001, 0.28 * vel);
    env.gain.setValueAtTime(0.0001, now);
    env.gain.linearRampToValueAtTime(peak, now + 0.045);
    env.gain.exponentialRampToValueAtTime(peak * 0.52, now + sustainSec * 0.55);
    env.gain.exponentialRampToValueAtTime(0.0001, now + sustainSec + 0.2);

    const fundamental = this.ctx.createOscillator();
    fundamental.type = 'sine';
    fundamental.frequency.setValueAtTime(freq, now);

    const warmth = this.ctx.createOscillator();
    warmth.type = 'triangle';
    warmth.frequency.setValueAtTime(freq * 2, now);
    const warmthGain = this.ctx.createGain();
    warmthGain.gain.value = 0.22;

    fundamental.connect(filter);
    warmth.connect(warmthGain);
    warmthGain.connect(filter);
    filter.connect(env);
    env.connect(dest);

    fundamental.start(now);
    warmth.start(now);
    fundamental.stop(now + sustainSec + 0.25);
    warmth.stop(now + sustainSec + 0.25);
  }

  private playWindchimeFernVoice(
    now: number,
    orb: SoundOrb,
    scaleId: ScaleId,
    vel: number,
    sustainSec: number,
    metrics: ConductingMetrics,
    dest: AudioNode
  ): void {
    if (!this.ctx) return;
    const offsets = metrics.bloomLevel > 0.5 ? [0, 2, 4, 7] : [0, 2, 4];
    offsets.forEach((stepOff, idx) => {
      if (!this.ctx) return;
      const start = now + idx * 0.068;
      const f = midiToFreq(degreeToMidi(scaleId, orb.noteDegree + stepOff, 1));
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, start);

      const peak = Math.max(0.001, (0.14 - idx * 0.015) * vel);
      const dur = sustainSec * 0.72;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(peak, start + 0.009);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);

      osc.connect(gain);
      gain.connect(dest);
      osc.start(start);
      osc.stop(start + dur + 0.04);
    });
  }

  private playRaindropLilyVoice(
    now: number,
    freq: number,
    vel: number,
    sustainSec: number,
    dest: AudioNode
  ): void {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    // Signature acoustic water-drop upward micro-chirp into resonant wood pitch
    osc.frequency.setValueAtTime(freq * 0.78, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.01, now + 0.036);
    osc.frequency.exponentialRampToValueAtTime(freq, now + 0.12);

    const dur = Math.min(0.62, sustainSec * 0.55);
    const peak = Math.max(0.001, 0.24 * vel);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(peak, now + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    osc.connect(gain);
    gain.connect(dest);
    osc.start(now);
    osc.stop(now + dur + 0.04);
  }

  /** Plays a gentle rising harp shimmer when the user's hand brushes a flower in Conduct mode */
  public playPetalBrush(x: number, y: number, z: number, midi: number): void {
    if (this.muted || !this.ensureStarted() || !this.ctx) return;
    const now = this.ctx.currentTime;
    if (now - this.lastBrushTime < 0.085) return;
    this.lastBrushTime = now;

    const panner = this.createSpatialPanner(x, y, z);
    if (!panner) return;
    const freq = midiToFreq(midi + 12);
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.09, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.75);
    osc.connect(gain);
    gain.connect(panner);
    osc.start(now);
    osc.stop(now + 0.78);
    this.schedulePannerCleanup(panner, 900);
  }

  /** Signature harmonic garden swell played when the user triggers full-garden Bloom Crescendo */
  public playBloomCrescendoSwell(scaleId: ScaleId): void {
    if (this.muted || !this.ensureStarted() || !this.ctx || !this.reverbSendGain || !this.dryGain) {
      return;
    }
    const now = this.ctx.currentTime;
    const chordDegrees = [0, 2, 4, 6, 7, 9, 11];

    chordDegrees.forEach((deg, idx) => {
      if (!this.ctx || !this.reverbSendGain || !this.dryGain) return;
      const start = now + idx * 0.075;
      const freq = midiToFreq(degreeToMidi(scaleId, deg, idx >= 4 ? 1 : 0));
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = idx < 3 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(0.068, start + 0.24);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 2.6);

      osc.connect(gain);
      gain.connect(this.reverbSendGain);
      gain.connect(this.dryGain);
      osc.start(start);
      osc.stop(start + 2.7);
    });
  }

  public dispose(): void {
    for (const timer of this.cleanupTimers) {
      globalThis.clearTimeout(timer);
    }
    this.cleanupTimers.clear();

    for (const panner of this.activePanners) {
      try {
        panner.disconnect();
      } catch {
        // already disconnected
      }
    }
    this.activePanners.clear();

    try {
      this.ambienceSource?.stop();
    } catch {
      // noop
    }
    try {
      this.ambienceSource?.disconnect();
      this.ambienceFilter?.disconnect();
      this.ambienceGain?.disconnect();
      this.dryGain?.disconnect();
      this.reverbSendGain?.disconnect();
      this.reverbNode?.disconnect();
      this.masterFilter?.disconnect();
      this.compressor?.disconnect();
      this.safetyLimiter?.disconnect();
      this.masterGain?.disconnect();
    } catch {
      // ignore disconnect errors during teardown
    }

    this.ambienceSource = null;
    this.ambienceFilter = null;
    this.ambienceGain = null;
    this.dryGain = null;
    this.reverbSendGain = null;
    this.reverbNode = null;
    this.masterFilter = null;
    this.compressor = null;
    this.safetyLimiter = null;
    this.masterGain = null;
    this.ambienceActive = false;

    if (this.ctx) {
      void this.ctx.close();
      this.ctx = null;
    }
  }
}
