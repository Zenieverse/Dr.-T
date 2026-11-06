/**
 * Presage Sense — Camera-Powered Wellness Types
 * SmartSpectra Challenge 2026 • Dr. T Platform
 */

export type PresageMeasurementState = 
  | 'idle'
  | 'consent'
  | 'positioning'
  | 'measuring'
  | 'paused'
  | 'completed'
  | 'error';

export type SignalQualityLevel = 'excellent' | 'good' | 'fair' | 'poor' | 'searching' | 'LOW' | 'MEDIUM' | 'HIGH' | 'OPTIMAL';

export type LightingCondition = 'optimal' | 'suboptimal_dim' | 'suboptimal_glare' | 'checking';

export interface PresageVitalsData {
  pulseRateBpm: number | null;
  pulseBpm?: number | null;
  breathingRateRpm: number | null;
  breathingRpm?: number | null;
  hrvRmssdMs: number | null;
  hrvSdnnMs?: number | null;
  signalQuality: SignalQualityLevel | number;
  signalQualityScore: number; // 0 - 100
  confidenceScore?: number; // 0 - 100
  stability?: boolean;
  signalStability?: 'LOW' | 'MEDIUM' | 'HIGH' | 'OPTIMAL';
  elapsedSeconds?: number;
  faceDetected?: boolean;
  isFaceDetected?: boolean;
  lightingCondition?: LightingCondition;
  lightingAdequate?: boolean;
  positioningFeedback?: string;
  opticalWaveform?: number[]; // Rolling green-channel optical absorption points
  breathingWaveform?: number[]; // Rolling respiratory expansion points
  lastUpdated?: number;
}

export type WellnessMood = 
  | 'Energized'
  | 'Energetic'
  | 'Calm'
  | 'Focused'
  | 'Stressed'
  | 'Fatigued'
  | 'Anxious'
  | 'Tired'
  | 'Restless';

export interface SubjectiveCheckIn {
  mood: WellnessMood;
  stressLevel: number; // 1 (lowest) to 5 (highest)
  notes?: string;
}

export interface PresageSdkProvenance {
  engine: string;
  sdkVersion: string;
  platformArch: string;
  isLiveAuthorized: boolean;
  requestedMetrics: string[];
  telemetryOptOut: boolean;
}

export interface PresageVitalsSummary {
  averagePulseBpm: number;
  averageBreathingRpm: number;
  hrvRmssdMs: number;
  signalQualityScore?: number;
  confidence?: string;
}

export interface PresageSenseSession {
  id: string;
  userId: string;
  timestamp: string;
  durationSeconds: number;
  meanPulseBpm?: number | null;
  meanBreathingRpm?: number | null;
  hrvRmssdMs?: number | null;
  minPulseBpm?: number | null;
  maxPulseBpm?: number | null;
  signalQualitySummary?: SignalQualityLevel;
  vitalsSummary?: PresageVitalsSummary;
  subjectiveCheckIn?: SubjectiveCheckIn;
  aiWellnessReflection?: string;
  aiReflection?: string;
  tags?: string[];
  provenance?: PresageSdkProvenance;
}

export interface PresageServerStatus {
  status: 'OPERATIONAL' | 'INITIALIZING' | 'ERROR';
  sdkInstalled: boolean;
  sdkVersion: string;
  nativePlatform: string;
  hasApiKey: boolean;
  requestedMetrics: string[];
  apiAuthStatus: 'AUTHORIZED' | 'UNAUTHORIZED_OR_PENDING' | 'NOT_CONFIGURED';
  notice?: string;
}
