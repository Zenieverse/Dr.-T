// Browser-native Web Audio API synthesis for PetWhisperer AI

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private currentOsc: OscillatorNode | null = null;
  private currentGain: GainNode | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // 1. Play 432 Hz Restorative Harmonic Sine Tone with smooth exponential attack/decay
  play432HzTone(durationSec: number = 5, volume: number = 0.25): () => void {
    try {
      this.initCtx();
      if (!this.ctx) return () => {};

      this.stopCurrent();

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(432, this.ctx.currentTime); // 432 Hz harmonic

      // Attack & Decay Envelope
      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(volume, now + 0.8); // 800ms gentle attack
      gain.gain.setValueAtTime(volume, now + durationSec - 1.0);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec); // gentle decay

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + durationSec);

      this.currentOsc = osc;
      this.currentGain = gain;

      return () => {
        try {
          osc.stop();
          osc.disconnect();
        } catch (e) {}
      };
    } catch (e) {
      console.warn('Web Audio 432Hz synth error:', e);
      return () => {};
    }
  }

  // 2. Play Calibrated Frequency (e.g. 12kHz to 22kHz Ultrasonic or Dual Tone)
  playFrequencyTone(freqHz: number, durationSec: number = 3, waveType: OscillatorType = 'sine', volume: number = 0.2): () => void {
    try {
      this.initCtx();
      if (!this.ctx) return () => {};

      this.stopCurrent();

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = waveType;
      osc.frequency.setValueAtTime(freqHz, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(volume, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + durationSec);

      this.currentOsc = osc;
      this.currentGain = gain;

      return () => {
        try {
          osc.stop();
          osc.disconnect();
        } catch (e) {}
      };
    } catch (e) {
      console.warn('Web Audio frequency synth error:', e);
      return () => {};
    }
  }

  stopCurrent() {
    try {
      if (this.currentOsc) {
        this.currentOsc.stop();
        this.currentOsc.disconnect();
        this.currentOsc = null;
      }
      if (this.currentGain) {
        this.currentGain.disconnect();
        this.currentGain = null;
      }
    } catch (e) {}
  }
}

export const audioSynth = new SoundSynthesizer();
