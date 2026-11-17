/**
 * Solar Filament Lab — TypeScript Definitions
 * Kaggle Solar Filament Segmentation Challenge 2026
 * Evaluation Metric: Panoptic Quality (PQ) | Target Resolution: 2048 x 2048
 */

export type SolarWavelength = 'H_ALPHA_6563' | 'AIA_193' | 'AIA_304' | 'WHITE_LIGHT';

export type DatasetSplit = 'TRAIN' | 'VALIDATION' | 'TEST';

export interface SolarDiskGeometry {
  centerX: number; // Pixels (e.g. 1024 in 2048x2048)
  centerY: number; // Pixels (e.g. 1024 in 2048x2048)
  radiusPixels: number; // e.g. 940 px
  limbDarkeningCoefficient: number; // u in I(mu) = I_0 * (1 - u*(1 - mu))
}

export interface FilamentInstance {
  id: string; // e.g. "fil_20260315_001_1"
  imageId: string;
  label: string; // e.g. "Quiescent Filament", "Active Region Filament", "Prominence"
  lengthArcsec: number; // Filament length in solar arcseconds (~725 km/arcsec)
  lengthMm: number; // Mega-meters (1 Mm = 1,000 km)
  areaSqMm: number; // Area in square Mega-meters
  spineCurvature: number; // Dimensionless curvature ratio
  tiltAngleDegrees: number; // Orientation relative to solar equator
  averageAbsorptionDepth: number; // Normalized contrast drop (0.0 to 1.0)
  bbox: [number, number, number, number]; // [minX, minY, maxX, maxY]
  spinePoints: Array<[number, number]>; // Central spine coordinates [[x, y], ...]
  contourPoints: Array<[number, number]>; // Outer boundary polygon
  rle: string; // Run-Length Encoding string
}

export interface SolarImageMetadata {
  id: string; // e.g. "20260101000001Bh" or "solar_20260315_081200"
  originalImageId?: string; // Official Kaggle competition image identifier (e.g. "20260101000001Bh")
  filename: string;
  observatory: string; // e.g. "Kanzelhöhe Solar Observatory", "GONG Network", "BBSO"
  instrument: string; // e.g. "Full-Disk H-alpha Telescope"
  wavelength: SolarWavelength;
  timestamp: string;
  width: number; // 2048
  height: number; // 2048
  split: DatasetSplit;
  geometry: SolarDiskGeometry;
  groundTruthFilamentCount: number;
  filaments: FilamentInstance[];
  previewUrl: string;
  isCorrupted: boolean;
  fileSizeBytes: number;
}

export interface SegmentationHyperparameters {
  limbDarkeningCorrection: boolean;
  limbDarkeningCoeff: number; // Default 0.62 for H-alpha
  diskMaskRadiusRatio: number; // Default 0.98 of solar radius
  claheClipLimit: number; // Contrast stretch (e.g. 2.5)
  claheGridSize: number; // 8 or 16
  multiscaleHessianSigmaMin: number; // Tubular filter min scale
  multiscaleHessianSigmaMax: number; // Tubular filter max scale
  adaptiveThresholdWindowSize: number; // e.g. 31 px
  adaptiveThresholdConstant: number; // e.g. 4.5
  morphologicalClosingKernel: number; // Reconnect fragments (e.g. 3 px)
  minFilamentAreaPixels: number; // Filter noise (e.g. 120 px)
  maxFilamentCount: number; // Safety threshold
  antiFragmentationSensitivity: number; // 0.0 to 1.0
  overMergeSeparationStrictness: number; // Watershed distance threshold
  watershedMinDistance?: number;
  modelArchitecture: 'CLASSICAL_FRANGI' | 'UNET_RESNET34' | 'SEGFORMER_B2' | 'ENSEMBLE_HYBRID';
}

export interface PQMatchPair {
  predId: string;
  gtId: string;
  iou: number;
  isMatch: boolean; // IoU > 0.5
}

export interface PanopticQualityEvaluation {
  imageId: string;
  truePositivesCount: number; // |TP| (pairs with IoU > 0.5)
  truePositives?: number;
  falsePositivesCount: number; // |FP| (unmatched predictions)
  falsePositives?: number;
  falseNegativesCount: number; // |FN| (unmatched ground truths)
  falseNegatives?: number;
  segmentationQuality: number; // SQ = sum(IoU of TP) / |TP|
  recognitionQuality: number; // RQ = |TP| / (|TP| + 0.5*|FP| + 0.5*|FN|)
  panopticQuality: number; // PQ = SQ * RQ
  diceScore: number;
  meanIoU: number;
  matchedPairs: PQMatchPair[];
  fragmentationAlerts: Array<{ gtId: string; fragmentCount: number; note: string }>;
  overMergeAlerts: Array<{ predId: string; mergedGtCount: number; note: string }>;
  overMergingAlerts?: Array<{ predId: string; mergedGtCount: number; note: string }>;
  evaluationTimestamp: string;
}

export interface FilamentExperimentRecord {
  id: string; // e.g. "exp-filament-v1"
  name: string;
  timestamp: string;
  datasetVersion: string; // e.g. "v1.2-kaggle-s01"
  architecture: string;
  modelArchitecture?: string;
  parameters: SegmentationHyperparameters;
  hyperparameters?: SegmentationHyperparameters;
  panopticQuality: number; // Overall validation PQ (0.0 to 1.0)
  pqScore?: number;
  segmentationQuality: number; // SQ
  sqScore?: number;
  recognitionQuality: number; // RQ
  rqScore?: number;
  meanDice: number;
  diceScore?: number;
  meanIoU: number;
  iouScore?: number;
  inferenceTimeMs: number;
  hardwareDevice: 'CPU' | 'NVIDIA_A100' | 'NVIDIA_T4' | 'APPLE_NEURAL';
  epochsTrained: number;
  trainLoss: number;
  valLoss: number;
  isBestModel: boolean;
  status?: string;
  notes: string;
  trainingHistory: Array<{
    epoch: number;
    trainLoss: number;
    valLoss: number;
    valPQ: number;
    valDice: number;
    learningRate: number;
  }>;
}

export interface KaggleSubmissionRow {
  filament_id: string;
  segmentation_rle: string;
  imageId?: string;
  instanceIndex?: number;
  pixelCount?: number;
  confidence?: number;
}

export interface KaggleValidationResult {
  isValid: boolean;
  totalRows: number;
  uniqueFilamentIds: number;
  imagesRepresented: number;
  emptyRleCount: number;
  formatCompliant: boolean;
  duplicateIds: string[];
  dimensionCompliant: boolean; // verified 2048x2048 bounds
  errors: string[];
  warnings: string[];
}
