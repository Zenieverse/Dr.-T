/**
 * BuildArena S02 — Artifact Types for Frontend UI
 */

export type ArtifactStatus = 
  | 'VERIFIED'
  | 'PRESENT'
  | 'MISSING'
  | 'INVALID'
  | 'NOT VERIFIED'
  | 'NEEDS USER ACTION';

export type ArtifactType = 
  | 'BSG'
  | 'JSON'
  | 'CSV'
  | 'PYTHON'
  | 'MARKDOWN'
  | 'PDF'
  | 'ZIP'
  | 'IMAGE';

export interface DiscoveredArtifact {
  id: string;
  filename: string;
  fileType: ArtifactType;
  fileSizeBytes: number;
  sourceLocation: string;
  associatedExperimentId: string;
  associatedRunId: string;
  creationTimestamp?: string;
  machineIdentity: string;
  validationStatus: ArtifactStatus;
  integrityHash: string; // SHA-256
  isFinalRunArtifact: boolean;
  validationDetails: string[];
  contentPreview?: string;
  exportInstructions?: string;
}

export interface ArtifactValidationReport {
  timestamp: string;
  totalArtifactsChecked: number;
  verifiedCount: number;
  presentCount: number;
  missingCount: number;
  invalidCount: number;
  totalPackageSizeBytes: number;
  isWithinKaggleLimit: boolean;
  maxAllowedBytes: number;
  finalRunId: string;
  machineName: string;
  qualificationStatus: 'QUALIFIED' | 'NOT QUALIFIED' | 'NOT VERIFIED';
  complianceGates: {
    unpoweredPayloadVerified: boolean;
    minimumThreeOrbitsVerified: boolean;
    landingPadAccuracyVerified: boolean;
    controllerDocumented: boolean;
    auditTranscriptLogged: boolean;
  };
  artifacts: DiscoveredArtifact[];
}

export interface TelemetryAnalysis {
  sourceFile: string;
  totalPoints: number;
  durationSeconds: number;
  maxAltitudeMeters: number;
  maxVelocityMs: number;
  maxDynamicPressureKpa: number;
  stagingAltitudeMeters: number;
  stagingTimestampSeconds: number;
  orbitalRevolutionsAchieved: number;
  orbitalGateSatisfied: boolean;
  apoapsisKm: number;
  periapsisKm: number;
  boosterFuelBurnedKg: number;
  boosterResidualFuelPct: number;
  boosterTouchdownOffsetMeters: number;
  touchdownCoordinates: { x: number; z: number };
  touchdownVelocityMs: number;
  landingAccuracyTier: string;
  landingAccuracyScore: number;
  recoveryCompletenessRatio: number;
  recoveryCompletenessScore: number;
  orbitalPayloadScore: number;
  payloadFuelEfficiencyScore: number;
  totalOfficialScore: number;
  qualificationStatus: 'QUALIFIED' | 'NOT QUALIFIED';
  rawColumns: string[];
}
