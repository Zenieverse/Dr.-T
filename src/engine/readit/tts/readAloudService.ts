// ============================================================================
// 🔊 DR. T READIT — READ ALOUD (TTS) SPEECH ENGINE
// Natural Voice Reader with Word-level tracking, Multi-Speed, Multi-Voice
// ============================================================================

import { ReadAloudState } from '../../../types/readit';

export interface TTSVoiceOption {
  id: string;
  name: string;
  lang: string;
  gender: 'female' | 'male';
  isDrT?: boolean;
}

export class ReadAloudService {
  private static instance: ReadAloudService;
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private onStateChangeCallback?: (state: ReadAloudState) => void;
  private onHighlightChunkCallback?: (chunkIndex: number, text: string) => void;

  private state: ReadAloudState = {
    isPlaying: false,
    isPaused: false,
    currentPage: 1,
    currentChunkIndex: 0,
    totalChunks: 0,
    speed: 1.0,
    pitch: 1.0,
    voice: 'default',
    language: 'en-US',
    mode: 'page',
  };

  private chunksQueue: string[] = [];

  private constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public static getInstance(): ReadAloudService {
    if (!ReadAloudService.instance) {
      ReadAloudService.instance = new ReadAloudService();
    }
    return ReadAloudService.instance;
  }

  public getVoices(): TTSVoiceOption[] {
    if (!this.synth) return [];
    const sysVoices = this.synth.getVoices();
    if (!sysVoices || sysVoices.length === 0) {
      return [
        { id: 'en-drt', name: 'Dr. T Warm Empathetic Voice (Natural)', lang: 'en-US', gender: 'female', isDrT: true },
        { id: 'en-clinical', name: 'Dr. T Clinical Precision Voice', lang: 'en-US', gender: 'female', isDrT: true },
        { id: 'vi-drt', name: 'Dr. T Tiếng Việt (Thân Thiện)', lang: 'vi-VN', gender: 'female', isDrT: true },
        { id: 'es-drt', name: 'Dr. T Español Cálido', lang: 'es-ES', gender: 'female', isDrT: true },
      ];
    }

    return sysVoices.map((v, i) => ({
      id: v.voiceURI || `voice_${i}`,
      name: v.name.includes('Google') || v.name.includes('Natural') ? `${v.name} (Dr. T Enhanced)` : v.name,
      lang: v.lang,
      gender: v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira') ? 'female' : 'male',
      isDrT: i === 0 || v.lang.startsWith('en'),
    }));
  }

  public subscribe(
    onStateChange: (state: ReadAloudState) => void,
    onHighlightChunk?: (chunkIndex: number, text: string) => void
  ): () => void {
    this.onStateChangeCallback = onStateChange;
    this.onHighlightChunkCallback = onHighlightChunk;
    onStateChange({ ...this.state });
    return () => {
      this.onStateChangeCallback = undefined;
      this.onHighlightChunkCallback = undefined;
    };
  }

  public speakText(text: string, options?: Partial<ReadAloudState>) {
    if (!this.synth) {
      console.warn('Speech synthesis not supported in this browser environment.');
      return;
    }

    this.stop();

    if (options) {
      this.state = { ...this.state, ...options };
    }

    // Split text into digestible sentence/paragraph chunks for smooth playback
    const rawChunks = text
      .split(/(?<=[.?!;:\n])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    this.chunksQueue = rawChunks.length > 0 ? rawChunks : [text];
    this.state.totalChunks = this.chunksQueue.length;
    this.state.currentChunkIndex = 0;
    this.state.isPlaying = true;
    this.state.isPaused = false;

    this.notifyState();
    this.playNextChunk();
  }

  private playNextChunk() {
    if (!this.synth) return;
    if (this.state.currentChunkIndex >= this.chunksQueue.length) {
      this.stop();
      return;
    }

    const chunkText = this.chunksQueue[this.state.currentChunkIndex];
    this.state.currentlySpokenText = chunkText;
    this.notifyState();

    if (this.onHighlightChunkCallback) {
      this.onHighlightChunkCallback(this.state.currentChunkIndex, chunkText);
    }

    const utterance = new SpeechSynthesisUtterance(chunkText);
    utterance.rate = this.state.speed;
    utterance.pitch = this.state.pitch;

    // Pick system voice if available
    const voices = this.synth.getVoices();
    if (voices && voices.length > 0) {
      const matched = voices.find(v => v.voiceURI === this.state.voice || v.lang === this.state.language);
      if (matched) utterance.voice = matched;
    }

    utterance.onend = () => {
      if (this.state.isPlaying && !this.state.isPaused) {
        this.state.currentChunkIndex += 1;
        this.notifyState();
        this.playNextChunk();
      }
    };

    utterance.onerror = (e) => {
      console.warn('TTS chunk error:', e);
      if (this.state.isPlaying) {
        this.state.currentChunkIndex += 1;
        this.playNextChunk();
      }
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public pause() {
    if (this.synth && this.state.isPlaying && !this.state.isPaused) {
      this.synth.pause();
      this.state.isPaused = true;
      this.notifyState();
    }
  }

  public resume() {
    if (this.synth && this.state.isPaused) {
      this.synth.resume();
      this.state.isPaused = false;
      this.notifyState();
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.state.isPlaying = false;
    this.state.isPaused = false;
    this.state.currentChunkIndex = 0;
    this.state.currentlySpokenText = undefined;
    this.chunksQueue = [];
    this.notifyState();
  }

  public nextChunk() {
    if (this.state.currentChunkIndex < this.chunksQueue.length - 1) {
      if (this.synth) this.synth.cancel();
      this.state.currentChunkIndex += 1;
      this.playNextChunk();
    }
  }

  public prevChunk() {
    if (this.state.currentChunkIndex > 0) {
      if (this.synth) this.synth.cancel();
      this.state.currentChunkIndex -= 1;
      this.playNextChunk();
    }
  }

  public setSpeed(speed: number) {
    this.state.speed = speed;
    this.notifyState();
    if (this.state.isPlaying && !this.state.isPaused) {
      // Re-trigger current chunk with new rate
      if (this.synth) this.synth.cancel();
      this.playNextChunk();
    }
  }

  public setPitch(pitch: number) {
    this.state.pitch = pitch;
    this.notifyState();
  }

  public setVoice(voice: string) {
    this.state.voice = voice;
    this.notifyState();
  }

  public setMode(mode: ReadAloudState['mode']) {
    this.state.mode = mode;
    this.notifyState();
  }

  private notifyState() {
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback({ ...this.state });
    }
  }
}
