// ============================================================================
// 🩺 DR. T VISION ALERT — OPENCV 5 HEALTH-READING ASSISTANCE TYPES
// OpenCV AI Competition 2026 (Powered by AWS)
// ============================================================================

export type VisionDeviceType = 
  | 'BLOOD_PRESSURE_MONITOR' 
  | 'PULSE_OXIMETER' 
  | 'UNKNOWN';

export type ReadingProvenance = 
  | 'MACHINE_EXTRACTED' 
  | 'USER_CORRECTED' 
  | 'MANUALLY_ENTERED';

export type MeasurementType = 
  | 'SYSTOLIC' 
  | 'DIASTOLIC' 
  | 'HEART_RATE' 
  | 'SPO2';

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Point2D {
  x: number;
  y: number;
}

export interface ExtractedMeasurement {
  id: string;
  type: MeasurementType;
  label: string;
  value: number;
  unit: string;
  confidence: number; // 0.0 - 1.0
  boundingBox?: BoundingBox;
  isPlausible: boolean;
  provenance: ReadingProvenance;
  userEditedValue?: number;
}

export interface ImageQualityMetrics {
  blurScore: number; // Laplacian variance
  isBlurry: boolean;
  glareRatio: number; // Percentage of saturated pixels (>250)
  hasGlare: boolean;
  averageBrightness: number; // 0 - 255
  contrastRms: number; // RMS contrast
  width: number;
  height: number;
  qualityPassed: boolean;
  rejectionReason?: string;
}

export interface DisplayLocalization {
  displayFound: boolean;
  corners?: [Point2D, Point2D, Point2D, Point2D]; // TL, TR, BR, BL
  aspectRatio?: number;
  rectifiedWidth: number;
  rectifiedHeight: number;
  rectifiedImageUri?: string;
  annotatedImageUri?: string;
}

export interface VisionAlertProcessResult {
  sessionId: string;
  timestamp: string;
  deviceType: VisionDeviceType;
  quality: ImageQualityMetrics;
  display: DisplayLocalization;
  measurements: ExtractedMeasurement[];
  opencvVersion: string;
  processingTimeMs: number;
  cloudOptimizedCool: boolean;
  isConfirmed: boolean;
  confirmedAt?: string;
}

export interface VisionAlertExplanation {
  topic: string;
  summary: string;
  mechanisticDetails: string;
  clinicalQuestions: string[];
  disclaimer: string;
  latencyMs: number;
  provider: 'gemini-3.8-flash' | 'deterministic-offline-fallback';
}
