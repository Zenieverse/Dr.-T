// =========================================================================
// TRIB-HOUSE AMBIENT SOUND SERVICE
// Zero-Dependency Web Audio API Synthesizer for Biophilic & Zen Reading
// =========================================================================

export type SoundscapeType = 'forest' | 'rain' | 'stream' | 'temple' | 'silence';

class AmbientSoundService {
  private static instance: AmbientSoundService | null = null;
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentSoundscape: SoundscapeType = 'forest';
  private masterGain: GainNode | null = null;
  private activeNodes: AudioNode[] = [];
  private volume: number = 0.4;
  private listeners: Array<(isPlaying: boolean, soundscape: SoundscapeType, volume: number) => void> = [];

  private constructor() {}

  public static getInstance(): AmbientSoundService {
    if (!AmbientSoundService.instance) {
      AmbientSoundService.instance = new AmbientSoundService();
    }
    return AmbientSoundService.instance;
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public subscribe(cb: (isPlaying: boolean, soundscape: SoundscapeType, volume: number) => void) {
    this.listeners.push(cb);
    cb(this.isPlaying, this.currentSoundscape, this.volume);
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  private notify() {
    this.listeners.forEach(l => l(this.isPlaying, this.currentSoundscape, this.volume));
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
    this.notify();
  }

  public getVolume(): number {
    return this.volume;
  }

  public getSoundscape(): SoundscapeType {
    return this.currentSoundscape;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public togglePlay(): boolean {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.play(this.currentSoundscape);
    }
    return this.isPlaying;
  }

  public play(type: SoundscapeType = 'forest') {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.stopNodes();
    this.currentSoundscape = type;

    if (type === 'silence') {
      this.isPlaying = false;
      this.notify();
      return;
    }

    try {
      if (type === 'forest') {
        this.generateForestWind();
      } else if (type === 'rain') {
        this.generateGentleRain();
      } else if (type === 'stream') {
        this.generateMountainStream();
      } else if (type === 'temple') {
        this.generateTempleDrone();
      }
      this.isPlaying = true;
      this.notify();
    } catch (e) {
      console.warn('Web Audio synthesis error:', e);
      this.isPlaying = false;
      this.notify();
    }
  }

  public stop() {
    this.stopNodes();
    this.isPlaying = false;
    this.notify();
  }

  private stopNodes() {
    this.activeNodes.forEach(node => {
      try {
        if ((node as any).stop) {
          (node as any).stop();
        }
        node.disconnect();
      } catch (e) {
        // ignore disconnect on already stopped node
      }
    });
    this.activeNodes = [];
  }

  // ==========================================
  // PROCEDURAL SOUND ENGINES
  // ==========================================

  private generateForestWind() {
    if (!this.ctx || !this.masterGain) return;

    // Pink noise buffer
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to simulate tree leaves & breeze
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.8, this.ctx.currentTime);

    // LFO for slow breathing wind modulation
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); // 8 second wave cycle
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(160, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.6, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    whiteNoise.start();
    lfo.start();

    this.activeNodes.push(whiteNoise, filter, lfo, lfoGain, gain);
  }

  private generateGentleRain() {
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.06;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(850, this.ctx.currentTime);

    const highpass = this.ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(180, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.7, this.ctx.currentTime);

    noise.connect(lowpass);
    lowpass.connect(highpass);
    highpass.connect(gain);
    gain.connect(this.masterGain);

    noise.start();
    this.activeNodes.push(noise, lowpass, highpass, gain);
  }

  private generateMountainStream() {
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.05;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter1 = this.ctx.createBiquadFilter();
    filter1.type = 'bandpass';
    filter1.frequency.setValueAtTime(540, this.ctx.currentTime);
    filter1.Q.setValueAtTime(3.2, this.ctx.currentTime);

    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.35, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(220, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter1.frequency);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.65, this.ctx.currentTime);

    noise.connect(filter1);
    filter1.connect(gain);
    gain.connect(this.masterGain);

    noise.start();
    lfo.start();
    this.activeNodes.push(noise, filter1, lfo, lfoGain, gain);
  }

  private generateTempleDrone() {
    if (!this.ctx || !this.masterGain) return;

    // Harmonic 432 Hz base drone
    const fundamental = 216; // 432 / 2
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(fundamental, this.ctx.currentTime);

    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(fundamental * 2, this.ctx.currentTime); // 432 Hz

    const osc3 = this.ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(fundamental * 3, this.ctx.currentTime); // 648 Hz (fifth)

    const gain1 = this.ctx.createGain();
    gain1.gain.setValueAtTime(0.18, this.ctx.currentTime);

    const gain2 = this.ctx.createGain();
    gain2.gain.setValueAtTime(0.12, this.ctx.currentTime);

    const gain3 = this.ctx.createGain();
    gain3.gain.setValueAtTime(0.04, this.ctx.currentTime);

    osc1.connect(gain1);
    osc2.connect(gain2);
    osc3.connect(gain3);

    gain1.connect(this.masterGain);
    gain2.connect(this.masterGain);
    gain3.connect(this.masterGain);

    osc1.start();
    osc2.start();
    osc3.start();

    this.activeNodes.push(osc1, osc2, osc3, gain1, gain2, gain3);
  }

  // Chime a single Tibetan Singing Bowl / Temple Bell
  public ringTempleBell(frequency: number = 432) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, now);
    // Subtle frequency drift
    osc.frequency.exponentialRampToValueAtTime(frequency * 0.998, now + 4);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 4.6);
  }
}

export const ambientSound = AmbientSoundService.getInstance();
