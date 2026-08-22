export interface StageTrace {
  id: string;
  stageNumber: 1 | 2 | 3 | 4 | 5;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  latencyMs: number;
  summary: string;
  details: Record<string, any>;
}

export interface CognitiveTriageReport {
  arousalIndex: number; // 0 - 100
  cortisolRisk: 'Low' | 'Medium' | 'High' | 'Severe';
  confidence: number; // 0 - 100
  primaryTrigger: string;
  ethologicalAssessment: string;
  reasoningSteps: string[];
  recommendedIntervention: {
    frequencyHz: 432 | 528;
    waveform: 'sine' | 'triangle';
    durationSec: number;
    ultrasonicPulseKhz: number;
    volumeRampAttackMs: number;
    volumeRampDecayMs: number;
  };
  soapDraft: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
}

export interface PipelineExecutionResult {
  eventId: string;
  timestamp: string;
  triggerType: string;
  arousalMagnitude: number;
  ambientDecibels: number;
  totalLatencyMs: number;
  stages: {
    stage1_ingestion: {
      latencyMs: number;
      audioSpikeDb: number;
      samplingRateHz: number;
      fftPeakBinHz: number;
      sensorSource: string;
    };
    stage2_triage: CognitiveTriageReport & {
      latencyMs: number;
      modelUsed: string;
    };
    stage3_intervention: {
      latencyMs: number;
      frequencyHz: number;
      harmonicTarget: string;
      gainPeakDb: number;
      status: string;
    };
    stage4_snowflake: {
      latencyMs: number;
      queryId: string;
      targetTable: string;
      cortexVectorDimension: number;
      cortexVectorSample: number[];
      sqlQuery: string;
    };
    stage5_solana: {
      latencyMs: number;
      network: string;
      signature: string;
      explorerUrl: string;
      memoPayload: string;
      treatsEarned: number;
      newTreatsBalance: number;
    };
  };
}

export interface CanineVisionAnalysis {
  patientName: string;
  breed: string;
  stressGrade: number; // 0 - 5
  emotionalValence: 'Calm / Social' | 'Alert / Vigilant' | 'Mild Anxiety' | 'Acute Panic / Fear' | 'Defensive Threat';
  microExpressions: {
    earPinnaTension: { score: number; description: string; unit: string };
    lipCommissureRetraction: { score: number; description: string; unit: string };
    spinalRigidityVector: { score: number; description: string; unit: string };
    scleraWhaleEyeExposure: { score: number; description: string; unit: string };
    cervicalTension: { score: number; description: string; unit: string };
  };
  keyFindings: string[];
  recommendedAction: string;
  confidenceScore: number;
}

export interface BarkAnalysis {
  sampleId: string;
  name: string;
  f0FundamentalHz: number;
  hnrHarmonicNoiseRatioDb: number;
  arousalPercentile: number;
  classification: 'Alert Alarm Bark' | 'Separation Anxiety Whine' | 'Territorial Bay' | 'Pain Vocalization' | 'Play Bow Solicitation';
  spectralCentroidHz: number;
  recommendedSolfeggioHz: 432 | 528;
}

export interface PatientRAGMemoryProfile {
  id: string;
  name: string;
  breed: string;
  age: string;
  weightKg: number;
  knownTriggers: string[];
  currentMedications: string[];
  preferredCalmingToneHz: 432 | 528;
  pastIncidentsCount: number;
  baselineCortisolIndex: number;
  notes: string;
}

export interface EthologyChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  timestamp: string;
  text: string;
  soapExcerpt?: {
    s: string;
    o: string;
    a: string;
    p: string;
  };
}

export interface ModelArmorAuditResult {
  prompt: string;
  safe: boolean;
  riskLevel: 'None' | 'Low' | 'High' | 'Critical';
  flaggedCategories: string[];
  triageRoute: 'Standard Automated Scribe' | 'Licensed DVM Telehealth Review' | 'Immediate Emergency ER Vet Dispatch';
  explanation: string;
  blockedDosageDetected?: boolean;
}

// 1. Wearable IoT Biosensor Types
export interface SmartCollarDevice {
  id: string;
  name: string;
  brand: 'Fi Series 3' | 'Whistle Health' | 'Invoxia Biometric' | 'Halo Collar 3' | 'PetPace Medical Pro';
  patientId: string;
  patientName: string;
  batteryPct: number;
  connectionStatus: 'Connected (BLE 5.3)' | 'LTE-M Connected' | 'Syncing' | 'Offline';
  firmwareVersion: string;
  lastSyncTimestamp: string;
}

export interface CollarTelemetrySample {
  timestamp: string;
  heartRateBpm: number;
  hrvRmssdMs: number;
  hrvSdnnMs: number;
  respiratoryRateBrpm: number;
  surfaceTempCelsius: number;
  accelerometer: {
    x: number;
    y: number;
    z: number;
    gForce: number;
  };
  activityState: 'Deep Sleep' | 'Resting' | 'Active Walking' | 'Intense Pacing' | 'Pruritic Scratching' | 'Head Shaking' | 'Arousal Surge';
  dailyRestPercentage: number;
  dailyScratchCount: number;
  stressIndexScore: number; // 0 - 100
}

// 2. Cross-Species Ethology Types
export type TargetSpecies = 'canine' | 'feline' | 'equine' | 'avian';

export interface SpeciesEthogramSpec {
  id: TargetSpecies;
  name: string;
  scientificName: string;
  facsStandard: string;
  keyActionUnits: string[];
  acousticVocalizationRange: string;
  restFrequencyTargetHz: 432 | 528 | 639 | 741;
  commonStressIndicators: string[];
}

export interface CrossSpeciesAnalysisResult {
  species: TargetSpecies;
  subjectName: string;
  facsFramework: string;
  valenceClassification: string;
  confidenceScore: number;
  actionUnitsDetected: {
    code: string;
    name: string;
    intensity: number; // 0 - 5
    description: string;
  }[];
  acousticProfile?: {
    primaryVocalization: string;
    f0FundamentalHz: number;
    harmonicEnergy: string;
    distressProbability: number;
  };
  ethologicalConclusion: string;
  recommendedCarePlan: string;
}

// 3. Direct EHR Veterinary Clinic Connector Types
export type EHRPlatformId = 'idexx-cornerstone' | 'idexx-neo' | 'covetrus-pulse' | 'ezyvet' | 'provet-cloud' | 'shepherd-ehr';

export interface EHRClinicConfig {
  id: EHRPlatformId;
  name: string;
  vendor: string;
  protocol: 'HL7 FHIR v4.0.1' | 'HL7 FHIR R5' | 'Vet-XML Direct API' | 'Covetrus OpenConnect';
  endpointUrl: string;
  status: 'Active Two-Way Sync' | 'Standby' | 'Auth Required';
  activePatientsCount: number;
  lastWebhookSync: string;
}

export interface LongitudinalEHRRecord {
  patientId: string;
  patientName: string;
  species: string;
  breed: string;
  ageYears: number;
  microchipId: string;
  weightHistory: { date: string; weightKg: number }[];
  allergies: string[];
  chronicConditions: string[];
  activeMedications: {
    drugName: string;
    dosage: string;
    frequency: string;
    prescribingDvm: string;
  }[];
  recentEncounters: {
    date: string;
    clinicName: string;
    type: string;
    primaryDiagnosis: string;
    soapNoteId: string;
  }[];
  pendingLabOrders: {
    orderId: string;
    testName: string;
    status: 'Collected' | 'In Processing' | 'Completed' | 'Pending Draw';
    orderingVet: string;
  }[];
}

// 4. Edge Deployment & Compilation Engine Types
export type EdgeHardwareTarget = 'raspberry-pi-5' | 'nvidia-jetson-orin' | 'apple-homepod' | 'coral-edge-tpu' | 'smart-pet-cam';
export type EdgeRuntimeFormat = 'wasm-simd' | 'onnx-runtime-int8' | 'tensorrt-fp16' | 'tflite-micro';

export interface EdgeCompiledModelArtifact {
  modelId: string;
  name: string;
  targetHardware: EdgeHardwareTarget;
  runtimeFormat: EdgeRuntimeFormat;
  binarySizeBytes: number;
  inferenceLatencyMs: number;
  powerConsumptionWatts: number;
  ramUsageMb: number;
  quantization: 'INT8' | 'FP16' | 'WASM SIMD';
  sha256Checksum: string;
  compilationTimestamp: string;
}

