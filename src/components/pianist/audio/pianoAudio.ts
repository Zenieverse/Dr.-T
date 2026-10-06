// ==========================================
// PIANIST WEB AUDIO ENGINE & SYNTHESIZER
// High-Fidelity Additive Acoustic Modeling + MIDI
// ==========================================

class PianoAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeVoices: Map<string, { oscillators: OscillatorNode[]; gains: GainNode[] }> = new Map();
  private sustainActive: boolean = false;
  private metronomeTimer: number | null = null;
  private metronomeBpm: number = 90;
  private isMetronomePlaying: boolean = false;
  private currentBeat: number = 0;
  private beatsPerMeasure: number = 4;
  private onMetronomeBeat?: (beat: number) => void;

  // Drum Groove state
  private grooveTimer: number | null = null;
  private isGroovePlaying: boolean = false;
  private currentGrooveStep: number = 0;
  private grooveStyle: 'pop' | 'ballad' | 'blues' | 'lofi' = 'pop';

  // MIDI status
  public midiConnected: boolean = false;
  public midiDeviceName: string = 'None';
  private onMidiNoteCallback?: (note: string, velocity: number, isNoteOn: boolean) => void;

  constructor() {
    // Lazy initialized on first user gesture to comply with browser autoplay policies
  }

  public init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.initMidi();
  }

  // Convert note name (e.g. "C4", "F#3", "Bb5") to frequency
  public noteToFreq(noteName: string): number {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const regex = /^([A-G][#b]?)([0-8])$/;
    const match = noteName.match(regex);
    if (!match) return 440;

    let [, pitch, octaveStr] = match;
    const octave = parseInt(octaveStr, 10);

    // Normalize flats to sharps
    if (pitch === 'Db') pitch = 'C#';
    if (pitch === 'Eb') pitch = 'D#';
    if (pitch === 'Gb') pitch = 'F#';
    if (pitch === 'Ab') pitch = 'G#';
    if (pitch === 'Bb') pitch = 'A#';

    const semitone = notes.indexOf(pitch);
    if (semitone === -1) return 440;

    // MIDI note number: C4 = 60, A4 = 69
    const midiNote = (octave + 1) * 12 + semitone;
    return 440 * Math.pow(2, (midiNote - 69) / 12);
  }

  public midiToNoteName(midi: number): string {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = Math.floor(midi / 12) - 1;
    const pitch = notes[midi % 12];
    return `${pitch}${octave}`;
  }

  // Play a realistic acoustic piano note with harmonic overtones and hammer strike transient
  public playNote(noteName: string, velocity: number = 0.8, durationSeconds?: number) {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    // Release any previous instance of this note
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
    ];

    const noteGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Dynamic low-pass filter (brighter on hard velocity, warmer on soft velocity)
    filter.type = 'lowpass';
    const cutoff = Math.min(8000, fundamental * (3 + velocity * 5));
    filter.frequency.setValueAtTime(cutoff, now);
    filter.frequency.exponentialRampToValueAtTime(Math.max(300, fundamental * 1.5), now + 1.2);

    // Hammer attack click transient
    const noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.015, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.003));
    }
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(velocity * 0.15, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);
    noiseSource.connect(noiseGain);
    noiseGain.connect(filter);
    noiseSource.start(now);

    // Additive harmonic oscillators
    harmonics.forEach(({ mult, gainMult, decayMult }) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();

      osc.type = mult === 1.0 ? 'triangle' : 'sine';
      // Slight acoustic inharmonicity detune
      osc.frequency.setValueAtTime(fundamental * mult, now);

      const peakLevel = velocity * gainMult * 0.25;
      oscGain.gain.setValueAtTime(0.0001, now);
      // Fast attack
      oscGain.gain.exponentialRampToValueAtTime(peakLevel, now + 0.004);

      // Natural acoustic decay envelope
      const decayTime = this.sustainActive ? 3.5 * decayMult : 1.6 * decayMult;
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + decayTime);

      osc.connect(oscGain);
      oscGain.connect(filter);

      osc.start(now);
      voiceOscs.push(osc);
      voiceGains.push(oscGain);

      // Stop oscillator after decay
      osc.stop(now + decayTime + 0.1);
    });

    filter.connect(noteGain);
    noteGain.connect(this.masterGain);

    this.activeVoices.set(noteName, { oscillators: voiceOscs, gains: voiceGains });

    if (durationSeconds) {
      setTimeout(() => {
        this.stopNote(noteName);
      }, durationSeconds * 1000);
    }
  }

  // Release a note with gentle damper damping
  public stopNote(noteName: string, immediate: boolean = false) {
    if (!this.ctx) return;
    const voice = this.activeVoices.get(noteName);
    if (!voice) return;

    const now = this.ctx.currentTime;
    const releaseTime = immediate ? 0.02 : (this.sustainActive ? 0.8 : 0.15);

    voice.gains.forEach(gainNode => {
      try {
        gainNode.gain.cancelScheduledValues(now);
        gainNode.gain.setValueAtTime(gainNode.gain.value, now);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + releaseTime);
      } catch (e) {
        // Safe fallback
      }
    });

    setTimeout(() => {
      voice.oscillators.forEach(osc => {
        try { osc.stop(); } catch (e) {}
      });
      this.activeVoices.delete(noteName);
    }, releaseTime * 1000 + 50);
  }

  public setSustain(active: boolean) {
    this.sustainActive = active;
    if (!active) {
      // Dampen ringing notes
      this.activeVoices.forEach((_, note) => {
        this.stopNote(note);
      });
    }
  }

  public getSustain(): boolean {
    return this.sustainActive;
  }

  // Play a chord simultaneously
  public playChord(notes: string[], durationSeconds: number = 1.8, velocity: number = 0.75) {
    notes.forEach(note => {
      this.playNote(note, velocity, durationSeconds);
    });
  }

  // Play an arpeggio in sequence
  public playArpeggio(notes: string[], stepDelayMs: number = 220, velocity: number = 0.75) {
    notes.forEach((note, index) => {
      setTimeout(() => {
        this.playNote(note, velocity, 1.5);
      }, index * stepDelayMs);
    });
  }

  // Metronome control
  public startMetronome(bpm: number = 90, beats: number = 4, onBeat?: (b: number) => void) {
    this.init();
    this.metronomeBpm = bpm;
    this.beatsPerMeasure = beats;
    this.onMetronomeBeat = onBeat;
    this.isMetronomePlaying = true;
    this.currentBeat = 0;

    const intervalMs = (60 / this.metronomeBpm) * 1000;
    this.tick();
    this.metronomeTimer = window.setInterval(() => {
      this.tick();
    }, intervalMs);
  }

  public stopMetronome() {
    this.isMetronomePlaying = false;
    if (this.metronomeTimer) {
      clearInterval(this.metronomeTimer);
      this.metronomeTimer = null;
    }
    this.currentBeat = 0;
  }

  public isMetronomeActive(): boolean {
    return this.isMetronomePlaying;
  }

  private tick() {
    if (!this.ctx || !this.masterGain) return;
    const isDownbeat = this.currentBeat === 0;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.frequency.setValueAtTime(isDownbeat ? 1200 : 800, now);
    gain.gain.setValueAtTime(isDownbeat ? 0.35 : 0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.05);

    if (this.onMetronomeBeat) {
      this.onMetronomeBeat(this.currentBeat);
    }

    this.currentBeat = (this.currentBeat + 1) % this.beatsPerMeasure;
  }

  // Backing band / AI Ensemble groove generator
  public startGroove(style: 'pop' | 'ballad' | 'blues' | 'lofi' = 'pop', bpm: number = 100) {
    this.init();
    this.stopGroove();
    this.grooveStyle = style;
    this.isGroovePlaying = true;
    this.currentGrooveStep = 0;

    const stepMs = (60 / bpm / 2) * 1000; // 8th notes
    this.playGrooveStep();
    this.grooveTimer = window.setInterval(() => {
      this.playGrooveStep();
    }, stepMs);
  }

  public stopGroove() {
    this.isGroovePlaying = false;
    if (this.grooveTimer) {
      clearInterval(this.grooveTimer);
      this.grooveTimer = null;
    }
  }

  public isGrooveActive(): boolean {
    return this.isGroovePlaying;
  }

  private playGrooveStep() {
    if (!this.ctx || !this.masterGain) return;
    const step = this.currentGrooveStep % 16;
    const now = this.ctx.currentTime;

    // Drum synthesis
    // Kick on steps 0, 8 (or 0, 6, 8, 14 for pop)
    if (step === 0 || step === 8 || (this.grooveStyle === 'pop' && (step === 6 || step === 14))) {
      this.playKick(now);
    }

    // Snare on steps 4, 12
    if (step === 4 || step === 12) {
      this.playSnare(now);
    }

    // Hi-hat on even steps
    if (step % 2 === 0) {
      this.playHiHat(now, step === 0 || step === 8);
    }

    // Subtle bass note on 1 and 3 (C2 / G1 / A1 / F1)
    if (step === 0) {
      this.playBass('C2', now);
    } else if (step === 8) {
      this.playBass('G1', now);
    }

    this.currentGrooveStep++;
  }

  private playKick(now: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(38, now + 0.12);
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  private playSnare(now: number) {
    if (!this.ctx || !this.masterGain) return;
    // Noise + tone
    const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.15, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.3, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1000, now);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    noise.start(now);
    noise.stop(now + 0.16);
  }

  private playHiHat(now: number, accented: boolean = false) {
    if (!this.ctx || !this.masterGain) return;
    const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.04, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(accented ? 0.15 : 0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(7000, now);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(now);
    noise.stop(now + 0.04);
  }

  private playBass(note: string, now: number) {
    if (!this.ctx || !this.masterGain) return;
    const freq = this.noteToFreq(note);
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, now);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(250, now);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.65);
  }

  // Web MIDI API integration
  private initMidi() {
    if (typeof navigator !== 'undefined' && (navigator as any).requestMIDIAccess) {
      (navigator as any).requestMIDIAccess()
        .then((midiAccess: any) => {
          this.setupMidiInputs(midiAccess);
          midiAccess.onstatechange = () => this.setupMidiInputs(midiAccess);
        })
        .catch(() => {
          this.midiConnected = false;
        });
    }
  }

  private setupMidiInputs(midiAccess: any) {
    const inputs = Array.from(midiAccess.inputs.values());
    if (inputs.length > 0) {
      this.midiConnected = true;
      const firstDevice: any = inputs[0];
      this.midiDeviceName = firstDevice.name || 'MIDI Keyboard';
      inputs.forEach((input: any) => {
        input.onmidimessage = (msg: any) => this.handleMidiMessage(msg);
      });
    } else {
      this.midiConnected = false;
      this.midiDeviceName = 'No MIDI device found';
    }
  }

  private handleMidiMessage(event: any) {
    const [status, noteNum, velocity] = event.data;
    const command = status >> 4;
    const noteName = this.midiToNoteName(noteNum);

    if (command === 9 && velocity > 0) {
      // Note On
      const normVelocity = velocity / 127;
      this.playNote(noteName, normVelocity);
      if (this.onMidiNoteCallback) {
        this.onMidiNoteCallback(noteName, normVelocity, true);
      }
    } else if (command === 8 || (command === 9 && velocity === 0)) {
      // Note Off
      this.stopNote(noteName);
      if (this.onMidiNoteCallback) {
        this.onMidiNoteCallback(noteName, 0, false);
      }
    } else if (command === 11 && noteNum === 64) {
      // Sustain Pedal (CC 64)
      this.setSustain(velocity >= 64);
    }
  }

  public setMidiCallback(callback: (note: string, velocity: number, isNoteOn: boolean) => void) {
    this.onMidiNoteCallback = callback;
  }
}

// Global Singleton for low-latency audio sharing across components
export const pianoAudio = new PianoAudioEngine();
