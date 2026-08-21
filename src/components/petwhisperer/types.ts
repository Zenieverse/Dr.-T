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
