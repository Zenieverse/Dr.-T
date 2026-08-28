export type PetWhispererTab = 
  | '01_taskmaster'
  | '02_strands'
  | 'gcp_cloud'
  | '03_vision'
  | '04_bark'
  | '05_partner'
  | '06_fleet'
  | '07_whistle'
  | '08_snowflake'
  | '09_solana';

export interface CanineSubject {
  id: string;
  name: string;
  breed: string;
  age: string;
  cgcCertified: boolean;
  baselineArousal: number;
  restingHeartRate: number;
  primaryTriggers: string[];
}

export interface TaskmasterEventResult {
  eventId: string;
  timestamp: string;
  trigger: string;
  arousalMagnitude: number;
  pipelineNodes: {
    node1SensorIngestion: { status: string; label: string; detail: string; latencyMs: number };
    node2GeminiDiagnosis: { status: string; label: string; detail: string; latencyMs: number; analysis: any };
    node3AcousticIntervention: { status: string; label: string; detail: string; latencyMs: number };
    node4SnowflakeStreaming: { status: string; label: string; detail: string; latencyMs: number };
    node5SolanaVerification: { status: string; label: string; detail: string; txSig: string; explorerUrl: string; latencyMs: number };
  };
  cognitiveBox: {
    diagnosedState: string;
    cortisolRisk: string;
    arousalScore: number;
    f0FrequencyHz: number;
    chainOfThought: string[];
    recommendedFrequencyHz: number;
    interventionStrategy: string;
    solanaTxSig: string;
    treatsMinted: number;
  };
  totalLatencyMs: number;
}

export interface IncidentAuditLog {
  id: string;
  timestamp: string;
  trigger: string;
  arousal: number;
  state: string;
  latencyMs: number;
  solanaTx: string;
  treats: number;
}
