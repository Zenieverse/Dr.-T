// =======================================================
// AUDIO FEATURE EXTRACTOR & LOCAL PRIVACY PIPELINE
// Uses Web Audio API AnalyserNode locally in browser
// Raw audio is immediately discarded after feature extraction
// =======================================================

import { ExtractedAudioFeatures } from '../types/touchGrassTypes';

class AudioFeatureExtractor {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private isListening: boolean = false;

  // Initialize Web Audio Context
  private initContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Request temporary microphone stream with explicit user consent
  public async startMicrophoneCapture(): Promise<boolean> {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      return false;
    }

    try {
      this.initContext();
      if (!this.audioCtx) return false;

      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: false, // keep natural environmental texture
          autoGainControl: true,
        },
        video: false
      });

      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 2048;
      this.analyser.smoothingTimeConstant = 0.8;

      const source = this.audioCtx.createMediaStreamSource(this.mediaStream);
      source.connect(this.analyser);
      this.isListening = true;
      return true;
    } catch (err) {
      console.warn('Microphone permission not granted or device unavailable:', err);
      this.stopCapture();
      return false;
    }
  }

  // Process live stream for a fixed window (e.g. 3-5 seconds), extract musical features, and immediately stop
  public async captureAndExtractFeatures(durationSeconds: number = 3.5): Promise<ExtractedAudioFeatures> {
    const hasMic = await this.startMicrophoneCapture();

    if (!hasMic || !this.analyser || !this.audioCtx) {
      // Fallback: return clean simulated outdoor acoustic capture
      return this.generateSimulatedCapture();
    }

    return new Promise((resolve) => {
      const bufferLength = this.analyser!.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      const timeDomainData = new Uint8Array(bufferLength);

      const spectralCentroids: number[] = [];
      const energyLevels: number[] = [];
      const onsets: number[] = [];
      let lastEnergy = 0;

      const startTime = performance.now();
      const interval = setInterval(() => {
        if (!this.analyser) return;

        this.analyser.getByteFrequencyData(dataArray);
        this.analyser.getByteTimeDomainData(timeDomainData);

        // Compute RMS energy
        let sumSquares = 0;
        for (let i = 0; i < bufferLength; i++) {
          const norm = (timeDomainData[i] - 128) / 128;
          sumSquares += norm * norm;
        }
        const rms = Math.sqrt(sumSquares / bufferLength);
        energyLevels.push(rms);

        // Compute Spectral Centroid (brightness)
        let num = 0;
        let den = 0;
        const nyquist = this.audioCtx!.sampleRate / 2;
        for (let i = 0; i < bufferLength; i++) {
          const freq = (i / bufferLength) * nyquist;
          num += freq * dataArray[i];
          den += dataArray[i];
        }
        const centroid = den > 0 ? num / den : 1000;
        spectralCentroids.push(centroid);

        // Simple peak/onset detection for rhythm pulse
        if (rms > 0.08 && rms > lastEnergy * 1.4) {
          onsets.push(performance.now() - startTime);
        }
        lastEnergy = rms;
      }, 50);

      // Stop after fixed duration
      setTimeout(() => {
        clearInterval(interval);
        this.stopCapture();

        // Calculate average centroid
        const avgCentroid = spectralCentroids.reduce((a, b) => a + b, 0) / (spectralCentroids.length || 1);

        // Estimate tempo from onsets if at least 2 detected
        let estimatedBpm = 90;
        let pulseDetected = false;
        if (onsets.length >= 2) {
          const intervals: number[] = [];
          for (let i = 1; i < onsets.length; i++) {
            intervals.push(onsets[i] - onsets[i - 1]);
          }
          const avgIntervalMs = intervals.reduce((a, b) => a + b, 0) / intervals.length;
          if (avgIntervalMs > 250 && avgIntervalMs < 1500) {
            estimatedBpm = Math.round(60000 / avgIntervalMs);
            pulseDetected = true;
          }
        }

        // Determine pitch direction trend
        const firstThird = spectralCentroids.slice(0, Math.floor(spectralCentroids.length / 3));
        const lastThird = spectralCentroids.slice(-Math.floor(spectralCentroids.length / 3));
        const avgFirst = firstThird.reduce((a, b) => a + b, 0) / (firstThird.length || 1);
        const avgLast = lastThird.reduce((a, b) => a + b, 0) / (lastThird.length || 1);

        let pitchDirection: ExtractedAudioFeatures['pitchDirection'] = 'steady';
        if (avgLast - avgFirst > 250) pitchDirection = 'ascending';
        else if (avgFirst - avgLast > 250) pitchDirection = 'descending';

        resolve({
          durationSeconds,
          detectedTempoBpm: estimatedBpm,
          pulseDetected,
          spectralCentroidHz: Math.round(avgCentroid),
          pitchDirection,
          rhythmicPattern: pulseDetected ? 'steady periodic stride' : 'ambient organic flow',
          energyLevel: avgCentroid > 2000 ? 'high' : avgCentroid > 800 ? 'medium' : 'low',
          isRealMicrophoneInput: true
        });
      }, durationSeconds * 1000);
    });
  }

  // Stop microphone capture and release stream hardware
  public stopCapture() {
    this.isListening = false;
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
  }

  // Deterministic clean fallback for demo and offline use
  public generateSimulatedCapture(category: string = 'Footsteps / Walking'): ExtractedAudioFeatures {
    return {
      durationSeconds: 3.5,
      detectedTempoBpm: category.includes('Foot') ? 94 : category.includes('Rain') ? 82 : 110,
      pulseDetected: true,
      spectralCentroidHz: category.includes('Bird') ? 2840 : category.includes('Rain') ? 1420 : 680,
      pitchDirection: category.includes('Bird') ? 'oscillating' : 'steady',
      rhythmicPattern: 'steady duple stride',
      energyLevel: 'medium',
      isRealMicrophoneInput: false
    };
  }
}

export const audioFeatureExtractor = new AudioFeatureExtractor();
