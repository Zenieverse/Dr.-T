export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  isVoicePlaying?: boolean;
  audioBase64?: string; // Cache generated speech
}

export type DrTVibe = 'empathetic' | 'witty' | 'philosophical' | 'playful';

export interface VibeConfig {
  id: DrTVibe;
  name: string;
  description: string;
  colorClass: string;
  bgGradient: string;
  tagline: string;
}

export interface VoiceChoice {
  id: string;
  name: string;
  gender: 'female' | 'male';
  description: string;
  accent: string;
}

export interface ChatRequest {
  messages: { role: 'user' | 'model'; content: string }[];
  vibe: DrTVibe;
  language: string;
}

export interface ChatResponse {
  reply: string;
}

export interface TTSRequest {
  text: string;
  voiceName: string;
}

export interface TTSResponse {
  audioBase64: string;
}
