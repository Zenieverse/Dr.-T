// ==========================================
// FLOW GRAND PIANO AUDIO ENGINE
// Concert Grand, Mellow, & Soft Piano Modeling with Web Audio API
// ==========================================

import { PianoPreset } from '../types/grandPianoTypes';

export interface RecordedNoteEvent {
  note: string;
  timestamp_ms: number;
  duration_ms: number;
  velocity: number;
}

class GrandPianoAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private presetFilter: BiquadFilterNode | null = null;
  private activeVoices: Map<string, { oscs: OscillatorNode[]; gains: GainNode[] }> = new Map();
  private sustainActive: boolean = false;
  private currentPreset: PianoPreset = 'concert-grand';
  private masterVolume: number = 0.8;
  private transpositionSemitones: number = 0;

  // Recording Engine
  private isRecording: boolean = false;
  private recordStartTime: number = 0;
  private recordedEvents: RecordedNoteEvent[] = [];
  private openRecordedNotes: Map<string, { startTime: number; velocity: number }> = new Map();

  // Metronome Engine
  private metronomeTimer: number | null = null;
  private isMetronomePlaying: boolean = false;
  private metronomeBpm: number = 90;
  private currentBeat: number = 0;
  private onBeatCallback?: (beat: number) => void;

  public init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);

        this.presetFilter = this.ctx.createBiquadFilter();
        this.applyPresetFilter();

        this.presetFilter.connect(this.masterGain);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setPreset(preset: PianoPreset) {
    this.currentPreset = preset;
    this.applyPresetFilter();
  }

  public getPreset(): PianoPreset {
    return this.currentPreset;
  }

  private applyPresetFilter() {
    if (!this.presetFilter || !this.ctx) return;
    const now = this.ctx.currentTime;
    switch (this.currentPreset) {
      case 'mellow-piano':
        this.presetFilter.type = 'lowpass';
        this.presetFilter.frequency.setValueAtTime(2200, now);
        this.presetFilter.Q.setValueAtTime(0.8, now);
        break;
      case 'soft-piano':
        this.presetFilter.type = 'lowpass';
        this.presetFilter.frequency.setValueAtTime(1400, now);
        this.presetFilter.Q.setValueAtTime(0.5, now);
        break;
      case 'bright-upright':
        this.presetFilter.type = 'peaking';
        this.presetFilter.frequency.setValueAtTime(3200, now);
        this.presetFilter.gain.setValueAtTime(3.5, now);
        this.presetFilter.Q.setValueAtTime(1.2, now);
        break;
      case 'concert-grand':
      default:
        this.presetFilter.type = 'allpass';
        this.presetFilter.frequency.setValueAtTime(8000, now);
        break;
    }
  }

  public setVolume(vol: number) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.masterVolume;
  }

  public setTransposition(semitones: number) {
    this.transpositionSemitones = Math.max(-12, Math.min(12, semitones));
  }

  public getTransposition(): number {
    return this.transpositionSemitones;
  }

  public setSustain(active: boolean) {
    this.sustainActive = active;
    if (!active) {
      // Release notes that were waiting for pedal release
      this.activeVoices.forEach((voice, note) => {
        this.stopNote(note, false);
      });
    }
  }

  public isSustainOn(): boolean {
    return this.sustainActive;
  }

  // Frequency calculation with transposition
  public noteToFreq(noteName: string): number {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const regex = /^([A-G][#b]?)([0-8])$/;
    const match = noteName.match(regex);
    if (!match) return 440;

    let [, pitch, octaveStr] = match;
    const octave = parseInt(octaveStr, 10);

    if (pitch === 'Db') pitch = 'C#';
    if (pitch === 'Eb') pitch = 'D#';
    if (pitch === 'Gb') pitch = 'F#';
    if (pitch === 'Ab') pitch = 'G#';
    if (pitch === 'Bb') pitch = 'A#';

    const semitone = notes.indexOf(pitch);
    if (semitone === -1) return 440;

    let midiNote = (octave + 1) * 12 + semitone;
    midiNote += this.transpositionSemitones;
    return 440 * Math.pow(2, (midiNote - 69) / 12);
  }

  // Play realistic acoustic piano voice
  public playNote(noteName: string, velocity: number = 0.8, durationSeconds?: number) {
    this.init();
    if (!this.ctx || !this.presetFilter) return;

    this.stopNote(noteName, true);

    const fundamental = this.noteToFreq(noteName);
    const now = this.ctx.currentTime;
    const voiceGains: GainNode[] = [];
    const voiceOscs: OscillatorNode[] = [];

    // Acoustic piano harmonics: fundamental, 2nd, 3rd, 4th, 5th, 6th
    const harmonics = [
      { mult: 1.0, gainMult: 1.0, decayMult: 1.0 },
      { mult: 2.0, gainMult: 0.55, decayMult: 0.8 },
      { mult: 3.01, gainMult: 0.28, decayMult: 0.6 },
      { mult: 4.02, gainMult: 0.15, decayMult: 0.45 },
      { mult: 5.04, gainMult: 0.08, decayMult: 0.35 },
      { mult: 6.06, gainMult: 0.04, decayMult: 0.25 },
    ];

    const baseDecay = Math.max(1.5, 4.0 - Math.log2(fundamental / 55) * 0.45);
    const velFactor = Math.max(0.2, Math.min(1.0, velocity));

    harmonics.forEach((h) => {
      if (!this.ctx || !this.presetFilter) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = h.mult === 1.0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(fundamental * h.mult, now);

      const targetGain = 0.25 * h.gainMult * velFactor;
      gain.gain.setValueAtTime(0.0001, now);
      // Fast acoustic hammer attack (3ms)
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, targetGain), now + 0.003);

      const decayTime = baseDecay * h.decayMult * (this.sustainActive ? 1.4 : 1.0);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + (durationSeconds || decayTime));

      osc.connect(gain);
      gain.connect(this.presetFilter);

      osc.start(now);
      if (durationSeconds) {
        osc.stop(now + durationSeconds + 0.1);
      }

      voiceOscs.push(osc);
      voiceGains.push(gain);
    });

    // Felt hammer knock impulse
    const noiseBuffer = this.createHammerTransientBuffer();
    if (noiseBuffer) {
      const noiseSource = this.ctx.createBufferSource();
      const noiseGain = this.ctx.createGain();
      noiseSource.buffer = noiseBuffer;
      noiseGain.gain.setValueAtTime(0.04 * velFactor, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);
      noiseSource.connect(noiseGain);
      noiseGain.connect(this.presetFilter);
      noiseSource.start(now);
      noiseSource.stop(now + 0.04);
    }

    this.activeVoices.set(noteName, { oscs: voiceOscs, gains: voiceGains });

    // Track for performance recording
    if (this.isRecording) {
      this.openRecordedNotes.set(noteName, {
        startTime: Date.now() - this.recordStartTime,
        velocity: velFactor
      });
    }

    if (durationSeconds) {
      setTimeout(() => {
        this.stopNote(noteName, false);
      }, durationSeconds * 1000);
    }
  }

  public stopNote(noteName: string, immediate: boolean = false) {
    const voice = this.activeVoices.get(noteName);
    if (!voice || !this.ctx) return;

    if (this.sustainActive && !immediate) {
      return; // Hold with sustain pedal
    }

    const now = this.ctx.currentTime;
    voice.gains.forEach((gain) => {
      try {
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(gain.gain.value, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08); // Smooth release damper
      } catch (e) {}
    });

    setTimeout(() => {
      voice.oscs.forEach((osc) => {
        try { osc.stop(); osc.disconnect(); } catch (e) {}
      });
      voice.gains.forEach((gain) => {
        try { gain.disconnect(); } catch (e) {}
      });
    }, 90);

    this.activeVoices.delete(noteName);

    // Finalize recording duration
    if (this.isRecording && this.openRecordedNotes.has(noteName)) {
      const open = this.openRecordedNotes.get(noteName)!;
      const duration = Math.max(100, (Date.now() - this.recordStartTime) - open.startTime);
      this.recordedEvents.push({
        note: noteName,
        timestamp_ms: open.startTime,
        duration_ms: duration,
        velocity: open.velocity
      });
      this.openRecordedNotes.delete(noteName);
    }
  }

  public playChord(notes: string[], durationSeconds: number = 2.0, velocity: number = 0.8) {
    notes.forEach((note) => {
      this.playNote(note, velocity, durationSeconds);
    });
  }

  // Create subtle percussive felt hammer transient
  private createHammerTransientBuffer(): AudioBuffer | null {
    if (!this.ctx) return null;
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.04);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
    }
    return buffer;
  }

  // Recording API
  public startRecording() {
    this.isRecording = true;
    this.recordStartTime = Date.now();
    this.recordedEvents = [];
    this.openRecordedNotes.clear();
  }

  public stopRecording(): RecordedNoteEvent[] {
    this.isRecording = false;
    // Close any held notes
    const endTime = Date.now() - this.recordStartTime;
    this.openRecordedNotes.forEach((open, note) => {
      this.recordedEvents.push({
        note,
        timestamp_ms: open.startTime,
        duration_ms: Math.max(100, endTime - open.startTime),
        velocity: open.velocity
      });
    });
    this.openRecordedNotes.clear();
    return [...this.recordedEvents];
  }

  public isRecordingActive(): boolean {
    return this.isRecording;
  }

  public replayTake(events: RecordedNoteEvent[], onFinished?: () => void) {
    if (!events.length) return;
    events.forEach((ev) => {
      setTimeout(() => {
        this.playNote(ev.note, ev.velocity, ev.duration_ms / 1000);
      }, ev.timestamp_ms);
    });

    const maxTime = Math.max(...events.map((e) => e.timestamp_ms + e.duration_ms));
    if (onFinished) {
      setTimeout(onFinished, maxTime + 200);
    }
  }

  // Metronome API
  public startMetronome(bpm: number, beatsPerMeasure: number = 4, onBeat?: (beat: number) => void) {
    this.init();
    this.stopMetronome();
    this.metronomeBpm = Math.max(30, Math.min(260, bpm));
    this.onBeatCallback = onBeat;
    this.currentBeat = 0;
    this.isMetronomePlaying = true;

    const intervalMs = (60 / this.metronomeBpm) * 1000;
    this.playMetronomeClick(this.currentBeat === 0);
    if (this.onBeatCallback) this.onBeatCallback(this.currentBeat);

    this.metronomeTimer = window.setInterval(() => {
      this.currentBeat = (this.currentBeat + 1) % beatsPerMeasure;
      this.playMetronomeClick(this.currentBeat === 0);
      if (this.onBeatCallback) this.onBeatCallback(this.currentBeat);
    }, intervalMs);
  }

  public stopMetronome() {
    if (this.metronomeTimer !== null) {
      clearInterval(this.metronomeTimer);
      this.metronomeTimer = null;
    }
    this.isMetronomePlaying = false;
  }

  public isMetronomeActive(): boolean {
    return this.isMetronomePlaying;
  }

  private playMetronomeClick(isDownbeat: boolean) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.frequency.setValueAtTime(isDownbeat ? 1200 : 800, now);
    gain.gain.setValueAtTime(isDownbeat ? 0.35 : 0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.05);
  }
}

export const grandPianoAudio = new GrandPianoAudioEngine();
