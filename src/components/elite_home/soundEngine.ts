// Procedural Nature & Longevity Soundscape Engine using Web Audio API

class EliteSoundEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private activeNodes: { stop: () => void }[] = [];
  private currentAmbience: 'golden-hour' | 'forest-stream' | 'ocean-breeze' | 'zen-bowl' = 'golden-hour';

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(val: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, val)), this.ctx.currentTime, 0.1);
    }
  }

  public playAmbience(type: 'golden-hour' | 'forest-stream' | 'ocean-breeze' | 'zen-bowl' = 'golden-hour') {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.stopAll();
    this.isPlaying = true;
    this.currentAmbience = type;

    if (type === 'golden-hour') {
      this.createWarmWindNode();
      this.createZenHarmonicChord();
    } else if (type === 'forest-stream') {
      this.createWaterfallNode();
      this.createBirdTweetLoop();
    } else if (type === 'ocean-breeze') {
      this.createOceanWavesNode();
    } else if (type === 'zen-bowl') {
      this.createSingingBowlLoop();
    }
  }

  public stopAll() {
    this.activeNodes.forEach(node => {
      try {
        node.stop();
      } catch (e) {
        // ignore
      }
    });
    this.activeNodes = [];
    this.isPlaying = false;
  }

  public togglePlay(type?: 'golden-hour' | 'forest-stream' | 'ocean-breeze' | 'zen-bowl') {
    if (this.isPlaying) {
      this.stopAll();
    } else {
      this.playAmbience(type || this.currentAmbience);
    }
    return this.isPlaying;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public triggerChime(freq: number = 528) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 3.0);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 3.2);
  }

  // --- Procedural Generators ---

  private createWarmWindNode() {
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(280, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.06, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    whiteNoise.start();

    // Gentle LFO on filter frequency
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.15, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(80, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    this.activeNodes.push({
      stop: () => {
        try {
          whiteNoise.stop();
          lfo.stop();
        } catch (e) {}
      }
    });
  }

  private createWaterfallNode() {
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    whiteNoise.start();

    this.activeNodes.push({
      stop: () => {
        try {
          whiteNoise.stop();
        } catch (e) {}
      }
    });
  }

  private createOceanWavesNode() {
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = this.ctx.sampleRate * 3;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.02, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    // LFO for wave surges
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.1, this.ctx.currentTime); // 10s wave cycle
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);

    whiteNoise.start();
    lfo.start();

    this.activeNodes.push({
      stop: () => {
        try {
          whiteNoise.stop();
          lfo.stop();
        } catch (e) {}
      }
    });
  }

  private createZenHarmonicChord() {
    if (!this.ctx || !this.masterGain) return;

    const freqs = [432, 540, 648]; // 432 Hz Pythagorean Major Triad
    const oscs: OscillatorNode[] = [];

    freqs.forEach(freq => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.015, this.ctx.currentTime);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      oscs.push(osc);
    });

    this.activeNodes.push({
      stop: () => {
        oscs.forEach(o => {
          try {
            o.stop();
          } catch (e) {}
        });
      }
    });
  }

  private createSingingBowlLoop() {
    if (!this.ctx || !this.masterGain) return;

    const freqs = [216, 432, 864]; // Tibetan singing bowl harmonics
    const oscs: OscillatorNode[] = [];

    freqs.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq + (idx === 1 ? 0.5 : 0), this.ctx.currentTime); // Slight binaural beat
      gain.gain.setValueAtTime(0.025 / (idx + 1), this.ctx.currentTime);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      oscs.push(osc);
    });

    this.activeNodes.push({
      stop: () => {
        oscs.forEach(o => {
          try {
            o.stop();
          } catch (e) {}
        });
      }
    });
  }

  private createBirdTweetLoop() {
    // Periodically trigger a gentle bird chirp
    const interval = setInterval(() => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      if (Math.random() > 0.4) {
        const baseFreq = 2200 + Math.random() * 800;
        this.triggerBirdChirp(baseFreq);
      }
    }, 4500);

    this.activeNodes.push({
      stop: () => {
        clearInterval(interval);
      }
    });
  }

  private triggerBirdChirp(baseFreq: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.3, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.9, now + 0.16);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.02, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.22);
  }
}

export const soundEngine = new EliteSoundEngine();
