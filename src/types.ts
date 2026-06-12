export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  isVoicePlaying?: boolean;
  audioBase64?: string; // Cache generated speech
  attachment?: {
    name: string;
    type: 'image' | 'document';
    url: string;
  }
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

// Dr. T Custom Appearance Modes
export type DrTAppearance = 'professional' | 'ao_dai' | 'scrubs' | 'cyber_suit' | 'casual';

export interface DrTAppearanceConfig {
  id: DrTAppearance;
  name: string;
  description: string;
  imageUrl: string;
}

// Life Graph Memory definitions
export interface MemoryNode {
  id: string;
  label: string;
  category: 'family' | 'preference' | 'health' | 'learning' | 'career' | 'landmark';
  description: string;
  connections: string[]; // Connected node IDs
  x?: number; // Spatial position for visual graph
  y?: number;
}

// Specialist Agents
export interface SpecialistAgent {
  id: string;
  name: string;
  title: string;
  avatarIcon: string;
  description: string;
  longDescription: string;
  status: 'idle' | 'thinking' | 'active' | 'collaborating';
  capabilities: string[];
}

// Healthcare Tracker Logs
export interface MedLog {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
}

export interface HealthMetric {
  id: string;
  type: 'Blood Pressure' | 'Heart Rate' | 'Sleep' | 'Steps' | 'Blood Sugar';
  value: string;
  date: string;
  status: 'optimal' | 'warning' | 'needs_attention';
}

// Education Skill Progression Tree
export interface SkillNode {
  id: string;
  label: string;
  category: string;
  description: string;
  level: number; // 0 for locked, 1 for in_progress, 2 for mastered
  quizPoints: number;
}

// Productivity Workspace Tasks & Calendar
export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
}

export interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  location?: string;
  type: 'medical' | 'workspace' | 'learning' | 'personal';
}

export interface SmartNote {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
  tag: string;
}

// Sustainability & Carbon Footprint Logs
export interface CarbonHabit {
  id: string;
  title: string;
  active: boolean;
  points: number;
  category: 'energy' | 'waste' | 'food' | 'transport';
}

// Gamification stats
export interface LifetimeStreak {
  healthStreak: number;
  learningStreak: number;
  productivityStreak: number;
  carbonSavedKg: number;
}
