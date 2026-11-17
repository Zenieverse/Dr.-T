/**
 * BuildArena S02 — Human AI Engineering Challenge Types
 * Competition Track: Build with Agent — Copilot
 * Mission: Deliver. Separate. Return.
 */

export type MissionStageId = 
  | 'engineering'
  | 'launch'
  | 'separation'
  | 'orbit_validation'
  | 'recovery'
  | 'landing'
  | 'qualification';

export interface MissionStageInfo {
  id: MissionStageId;
  stageNumber: number;
  name: string;
  shortDescription: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'PASSED' | 'FAILED';
  criteria: string;
  metric?: string;
}

export type VerificationStatus = 
  | 'IMPLEMENTED'
  | 'TESTED'
  | 'CONNECTED'
  | 'VERIFIED WITH REAL SIMULATION DATA'
  | 'BLOCKED BY EXTERNAL DEPENDENCY';

export interface BuildArenaScoring {
  orbitalPayloadScore: number;    // Max 15 points
  payloadFuelEfficiencyScore: number; // Max 15 points
  recoveryCompletenessScore: number;  // Max 30 points
  landingAccuracyScore: number;       // Max 40 points
  totalScore: number;                 // Max 100 points
  orbitCount: number;                 // Gate: minimum 3 revolutions
  landingDistanceMeters: number;      // Distance to pad center
  recoveryMassRatio: number;          // 0.0 to 1.0 (mass recovered / booster mass)
  payloadFuelRemainingPercent: number;// 0 to 100%
  qualified: boolean;                 // true if 3 orbits and landed within threshold
  evaluationNotes: string[];
}

export interface TelemetryPoint {
  timeSeconds: number;
  altitudeMeters: number;
  velocityMs: number;
  fuelMassKg: number;
  totalMassKg: number;
  stage: number;
  distanceToPadMeters: number;
  orbitRevolutions: number;
  dynamicPressureKpa: number;
  throttlePercent: number;
  apoapsisKm: number;
  periapsisKm: number;
}

export interface SpacecraftBlock {
  id: string;
  blockType: string;
  category: 'Structure' | 'Propulsion' | 'Separation' | 'Aerodynamics' | 'Control' | 'Payload';
  count: number;
  massKg: number;
  dlcRequired?: 'None' | 'The Splintered Sea' | 'The Broken Beyond';
}

export interface SpacecraftDesign {
  name: string;
  version: string;
  totalBlocks: number;
  dryMassKg: number;
  wetMassKg: number;
  payloadMassKg: number;
  estimatedDeltaV: number; // m/s
  blocks: SpacecraftBlock[];
  controllerScript: string;
  bsgXmlExcerpt?: string;
}

export interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, any>;
  category: 'Simulation' | 'Building' | 'Control' | 'Telemetry';
  requiresDesktopSteam: boolean;
}

export interface DesktopBridgeStatus {
  connected: boolean;
  bridgeUrl: string;
  hostPlatform: string;
  steamDetected: boolean;
  besiegeDetected: boolean;
  toolkitModInstalled: boolean;
  mcpServerRunning: boolean;
  activeSessionId?: string;
  latencyMs: number;
  lastHeartbeat?: string;
  diagnosticNotes: string[];
}

export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedAction?: {
    type: 'APPLY_DESIGN' | 'UPDATE_CONTROLLER' | 'RUN_SIMULATION' | 'EXPORT_SUBMISSION';
    label: string;
    payload?: any;
  };
}

export interface BuildArenaExperiment {
  id: string;
  title: string;
  timestamp: string;
  design: SpacecraftDesign;
  scoring: BuildArenaScoring;
  telemetrySummary: {
    maxAltitudeMeters: number;
    maxVelocityMs: number;
    durationSeconds: number;
    pointsLogged: number;
  };
  artifacts: {
    hasBsgMachine: boolean;
    hasBuildHistory: boolean;
    hasTrajectoryCsv: boolean;
    hasChatTranscript: boolean;
  };
  verificationStatus: VerificationStatus;
}
