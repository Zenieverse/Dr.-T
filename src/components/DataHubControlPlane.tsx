import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Database,
  GitPullRequest,
  Cpu,
  ShieldCheck,
  Layers,
  Network,
  Activity,
  Code,
  Bot,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Terminal,
  ArrowRight,
  Search,
  Tag,
  BookOpen,
  Download,
  Copy,
  Play,
  RefreshCw,
  FileCode,
  Share2,
  ExternalLink,
  Lock,
  ChevronRight,
  Sliders,
  Filter,
  Check,
  Workflow,
  Zap,
  Globe,
  Server,
  FileText
} from 'lucide-react';

// ==========================================
// MOCK DATAHUB METADATA ENTITIES & LINEAGE
// ==========================================

interface MetadataEntity {
  urn: string;
  name: string;
  type: 'Dataset' | 'MLModel' | 'FeatureTable' | 'Pipeline' | 'GlossaryTerm';
  platform: 'snowflake' | 's3' | 'dbt' | 'airflow' | 'medgemma' | 'feast';
  domain: 'Clinical AI' | 'Patient Telemetry' | 'Longevity Research' | 'Financial & Ops';
  description: string;
  owners: string[];
  tags: string[];
  glossaryTerms: string[];
  assertionsCount: number;
  healthScore: number;
  lastUpdated: string;
  upstreamUrns: string[];
  downstreamUrns: string[];
  schemaFields?: { name: string; type: string; description: string; pii: boolean; nullable: boolean }[];
}

const INITIAL_ENTITIES: MetadataEntity[] = [
  {
    urn: 'urn:li:dataset:(urn:li:dataPlatform:s3,drt-raw-telemetry/patient_vitals_stream,PROD)',
    name: 's3://drt-raw-telemetry/patient_vitals_stream',
    type: 'Dataset',
    platform: 's3',
    domain: 'Patient Telemetry',
    description: 'Raw high-frequency wearable sensor telemetry stream (Heart rate, HRV, SpO2, Continuous Glucose, ECG).',
    owners: ['data-eng@drt.org', 'dr-t-ingestion-bot'],
    tags: ['RawData', 'HIPAA_Sensitive', 'Streaming'],
    glossaryTerms: ['VitalSigns', 'PHI_Data'],
    assertionsCount: 4,
    healthScore: 98,
    lastUpdated: '2 mins ago',
    upstreamUrns: [],
    downstreamUrns: [
      'urn:li:dataset:(urn:li:dataPlatform:dbt,stg_patient_vitals_normalized,PROD)',
      'urn:li:dataJob:(urn:li:dataFlow:airflow,drt_ingestion_pipeline,clean_telemetry)'
    ],
    schemaFields: [
      { name: 'patient_id', type: 'VARCHAR(64)', description: 'Unique anonymized patient identifier (UUIDv4)', pii: true, nullable: false },
      { name: 'timestamp_utc', type: 'TIMESTAMP_NTZ', description: 'UTC timestamp of biometric reading', pii: false, nullable: false },
      { name: 'heart_rate_bpm', type: 'FLOAT', description: 'Heart rate in beats per minute', pii: false, nullable: true },
      { name: 'spo2_pct', type: 'FLOAT', description: 'Blood oxygen saturation percentage (0-100)', pii: false, nullable: true },
      { name: 'glucose_mg_dl', type: 'FLOAT', description: 'Continuous glucose monitor reading', pii: false, nullable: true },
      { name: 'raw_device_signature', type: 'VARCHAR(128)', description: 'Wearable firmware cryptographic verification hash', pii: false, nullable: false }
    ]
  },
  {
    urn: 'urn:li:dataset:(urn:li:dataPlatform:dbt,stg_patient_vitals_normalized,PROD)',
    name: 'dbt.marts.stg_patient_vitals_normalized',
    type: 'Dataset',
    platform: 'dbt',
    domain: 'Patient Telemetry',
    description: 'Cleaned, deduplicated, and time-binned biometric signals formatted for ML feature store ingestion.',
    owners: ['dbt-analytics-team', 'datahub-sentinel-agent'],
    tags: ['GoldLayer', 'dbt_verified', 'PII_Masked'],
    glossaryTerms: ['VitalSigns', 'CleanData'],
    assertionsCount: 8,
    healthScore: 100,
    lastUpdated: '12 mins ago',
    upstreamUrns: ['urn:li:dataset:(urn:li:dataPlatform:s3,drt-raw-telemetry/patient_vitals_stream,PROD)'],
    downstreamUrns: [
      'urn:li:dataset:(urn:li:dataPlatform:feast,dr_t_feature_store.vitals_30d,PROD)',
      'urn:li:dataset:(urn:li:dataPlatform:snowflake,marts.longevity_risk_factors,PROD)'
    ],
    schemaFields: [
      { name: 'patient_hash', type: 'VARCHAR(64)', description: 'SHA-256 masked patient ID for HIPAA compliance', pii: false, nullable: false },
      { name: 'window_start', type: 'TIMESTAMP', description: '5-minute aggregation window start timestamp', pii: false, nullable: false },
      { name: 'avg_hr_bpm', type: 'FLOAT', description: 'Mean heart rate over 5 min window', pii: false, nullable: false },
      { name: 'hrv_rmssd_ms', type: 'FLOAT', description: 'Heart rate variability root mean square of successive differences', pii: false, nullable: false },
      { name: 'glucose_variability_idx', type: 'FLOAT', description: 'Standard deviation of glucose values over window', pii: false, nullable: false }
    ]
  },
  {
    urn: 'urn:li:dataset:(urn:li:dataPlatform:feast,dr_t_feature_store.vitals_30d,PROD)',
    name: 'Feast FeatureStore: vitals_30d_aggregates',
    type: 'FeatureTable',
    platform: 'feast',
    domain: 'Clinical AI',
    description: 'Online & offline feature view providing 30-day rolling biological age metrics for MedGemma models.',
    owners: ['mlops-team@drt.org', 'feature-agent'],
    tags: ['FeatureStore', 'OnlineFeature', 'ProductionML'],
    glossaryTerms: ['Biomarkers', 'BiologicalAge'],
    assertionsCount: 6,
    healthScore: 94,
    lastUpdated: '1 min ago',
    upstreamUrns: ['urn:li:dataset:(urn:li:dataPlatform:dbt,stg_patient_vitals_normalized,PROD)'],
    downstreamUrns: [
      'urn:li:mlModel:(urn:li:dataPlatform:medgemma,medgemma_v2_longevity_risk,PROD)',
      'urn:li:mlModel:(urn:li:dataPlatform:medgemma,nemotron_clinical_reasoning_v1,PROD)'
    ],
    schemaFields: [
      { name: 'patient_hash', type: 'STRING', description: 'Primary entity key', pii: false, nullable: false },
      { name: 'hrv_30d_trend_slope', type: 'FLOAT', description: 'Linear regression slope of 30-day HRV trend', pii: false, nullable: false },
      { name: 'autonomic_stability_score', type: 'FLOAT', description: 'Derived parasympathetic recovery score (0.0 - 1.0)', pii: false, nullable: false },
      { name: 'metabolic_inflexibility_idx', type: 'FLOAT', description: 'Derived glucose spike intensity factor', pii: false, nullable: false }
    ]
  },
  {
    urn: 'urn:li:mlModel:(urn:li:dataPlatform:medgemma,medgemma_v2_longevity_risk,PROD)',
    name: 'MedGemma-7B Longevity Risk & Mortality Model',
    type: 'MLModel',
    platform: 'medgemma',
    domain: 'Clinical AI',
    description: 'Fine-tuned MedGemma multimodal LLM evaluating cellular age, cardiometabolic risk, and 10-year longevity trajectory.',
    owners: ['dr-t-clinical-ai-lab', 'ml-governance-bot'],
    tags: ['MedGemma', 'ClinicalGrade', 'FDA_ClassII_Target', 'Production'],
    glossaryTerms: ['BiologicalAge', 'ClinicalRiskScore'],
    assertionsCount: 12,
    healthScore: 99,
    lastUpdated: '4 mins ago',
    upstreamUrns: ['urn:li:dataset:(urn:li:dataPlatform:feast,dr_t_feature_store.vitals_30d,PROD)'],
    downstreamUrns: [
      'urn:li:dataset:(urn:li:dataPlatform:snowflake,clinical_predictions_endpoint,PROD)'
    ],
    schemaFields: [
      { name: 'input_features', type: 'JSON', description: 'Feast feature payload vector', pii: false, nullable: false },
      { name: 'predicted_biological_age', type: 'FLOAT', description: 'Model output: estimated biological age in years', pii: false, nullable: false },
      { name: 'longevity_index_score', type: 'FLOAT', description: 'Composite health score scale 0-100', pii: false, nullable: false },
      { name: 'confidence_interval_95', type: 'ARRAY<FLOAT>', description: '95% confidence bounds [lower, upper]', pii: false, nullable: false }
    ]
  }
];

// ==========================================
// CODE GENERATION TEMPLATES (dbt, Airflow, Ingestion)
// ==========================================

const SAMPLE_DBT_MODEL = `-- =========================================================
-- GENERATED BY DR. T DATAHUB METADATA-AWARE CODE AGENT
-- Target DataHub URN: urn:li:dataset:(urn:li:dataPlatform:dbt,stg_patient_vitals_normalized,PROD)
-- Source Lineage: s3://drt-raw-telemetry/patient_vitals_stream
-- Auto-Verified Against DataHub Schema Assertions & Glossary Terms
-- =========================================================

WITH raw_telemetry AS (
    SELECT
        patient_id,
        timestamp_utc,
        heart_rate_bpm,
        spo2_pct,
        glucose_mg_dl,
        raw_device_signature
    FROM {{ source('raw_s3', 'patient_vitals_stream') }}
    WHERE timestamp_utc >= DATEADD(day, -30, CURRENT_TIMESTAMP())
),

anonymized_and_masked AS (
    SELECT
        -- HIPAA Compliance Rule enforced from DataHub Glossary Term: PHI_Data
        SHA2_HEX(patient_id) AS patient_hash,
        DATE_TRUNC('minute', timestamp_utc) AS window_start,
        AVG(heart_rate_bpm) OVER(PARTITION BY patient_id ORDER BY timestamp_utc RANGE BETWEEN INTERVAL '5 MINUTE' PRECEDING AND CURRENT ROW) AS avg_hr_bpm,
        STDDEV(heart_rate_bpm) OVER(PARTITION BY patient_id ORDER BY timestamp_utc RANGE BETWEEN INTERVAL '5 MINUTE' PRECEDING AND CURRENT ROW) AS hrv_rmssd_ms,
        STDDEV(glucose_mg_dl) OVER(PARTITION BY patient_id ORDER BY timestamp_utc RANGE BETWEEN INTERVAL '5 MINUTE' PRECEDING AND CURRENT ROW) AS glucose_variability_idx
    FROM raw_telemetry
    WHERE heart_rate_bpm IS NOT NULL AND heart_rate_bpm BETWEEN 30 AND 220
)

SELECT * FROM anonymized_and_masked;`;

const SAMPLE_AIRFLOW_DAG = `# =========================================================
# GENERATED BY DR. T DATAHUB MCP AIRFLOW PIPELINE BUILDER
# Includes Automatic DataHub RestEmitter Lineage Metadata Injection
# =========================================================

from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator
from datahub_provider.entities import Dataset
from datahub_provider.operators.datahub import DatahubEmitterOperator

default_args = {
    'owner': 'dr_t_datahub_agent',
    'depends_on_past': False,
    'email_on_failure': True,
    'email': ['data-alerts@drt.org'],
    'retries': 2,
    'retry_delay': timedelta(minutes=3),
}

dag = DAG(
    'drt_patient_ingestion_pipeline',
    default_args=default_args,
    description='DataHub Lineage-Aware Ingestion Pipeline for Clinical Telemetry & Feature Store Refresh',
    schedule_interval='*/15 * * * *',
    start_date=datetime(2026, 1, 1),
    catchup=False,
    tags=['DataHub_Managed', 'Clinical_AI', 'HIPAA_Compliant'],
)

def run_feature_store_ingestion():
    print("Ingesting normalized vitals into Feast Feature Store...")
    # Read lineage parameters from DataHub MCP Context
    return "Feast Feature Store updated successfully."

ingest_task = PythonOperator(
    task_id='ingest_to_feast',
    python_callable=run_feature_store_ingestion,
    dag=dag,
)

emit_datahub_lineage = DatahubEmitterOperator(
    task_id='emit_datahub_lineage',
    datahub_conn_id='datahub_mcp_default',
    mcp_raw={
        "entityType": "dataset",
        "entityUrn": "urn:li:dataset:(urn:li:dataPlatform:feast,dr_t_feature_store.vitals_30d,PROD)",
        "aspectName": "upstreamLineage",
        "aspect": {
            "upstreams": [
                {
                    "dataset": "urn:li:dataset:(urn:li:dataPlatform:dbt,stg_patient_vitals_normalized,PROD)",
                    "type": "TRANSFORMED"
                }
            ]
        }
    },
    dag=dag,
)

ingest_task >> emit_datahub_lineage`;

const SAMPLE_PYTHON_INGEST = `# =========================================================
# DR. T DATAHUB AGENT CONTEXT KIT - INGESTION & QUALITY SCRIPT
# Fetches DataHub Metadata & Emits Quality Assertions in Real-Time
# =========================================================

import datahub.emitter.mcp_builder as mcp_builder
from datahub.emitter.rest_emitter import DatahubRestEmitter
from datahub.metadata.com.linkedin.pegasus2avro.assertion import AssertionResult, AssertionResultType

emitter = DatahubRestEmitter(gms_server="http://datahub-gms.drt.internal:8080")

def emit_quality_assertion(dataset_urn: str, assertion_urn: str, passed: bool):
    assertion_result = mcp_builder.make_assertion_result_mcp(
        assertion_urn=assertion_urn,
        dataset_urn=dataset_urn,
        result=AssertionResult(
            type=AssertionResultType.SUCCESS if passed else AssertionResultType.FAILURE,
            timestampMillis=int(datetime.now().timestamp() * 1000),
            rowCount=48500,
            missingCount=0
        )
    )
    emitter.emit(assertion_result)
    print(f"Emitted Assertion Result to DataHub for {dataset_urn}: Passed={passed}")

if __name__ == "__main__":
    emit_quality_assertion(
        dataset_urn="urn:li:dataset:(urn:li:dataPlatform:dbt,stg_patient_vitals_normalized,PROD)",
        assertion_urn="urn:li:assertion:drt_heart_rate_bounds_check",
        passed=True
    )`;

export const DataHubControlPlane: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'agents' | 'codegen' | 'mlops' | 'graph' | 'mcp_console'>('agents');
  const [selectedEntityUrn, setSelectedEntityUrn] = useState<string>(INITIAL_ENTITIES[0].urn);
  const [entities, setEntities] = useState<MetadataEntity[]>(INITIAL_ENTITIES);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Challenge 1: Agents State
  const [agentLog, setAgentLog] = useState<string[]>([
    '🤖 [DataHub Sentinel Agent] Connected to DataHub MCP Server (mcp.datahubproject.io/v1/graphql)',
    '🔍 [DataHub Sentinel Agent] Inspecting schema for s3://drt-raw-telemetry/patient_vitals_stream...',
    '🏷️ [Glossary Agent] Detected column "patient_id" without HIPAA tag. Applying term: PHI_Data',
    '✅ [Assertion Agent] Evaluated 4 assertions: 100% Passed. Quality score updated to 98/100.',
    '⚡ [Lineage Agent] Mapped 4 downstream dependencies (dbt models -> Feast -> MedGemma ML).'
  ]);
  const [isAgentRunning, setIsAgentRunning] = useState(false);

  // Challenge 2: CodeGen State
  const [codeType, setCodeType] = useState<'dbt' | 'airflow' | 'python'>('dbt');
  const [copiedCode, setCopiedCode] = useState(false);
  const [prSubmitted, setPrSubmitted] = useState(false);

  // Challenge 3: MLOps Production Agent State
  const [driftDetected, setDriftDetected] = useState(false);
  const [circuitBreakerTriggered, setCircuitBreakerTriggered] = useState(false);
  const [mlIncidentLog, setMlIncidentLog] = useState<string[]>([]);

  // Challenge 4: MCP Console query
  const [gqlQuery, setGqlQuery] = useState<string>(
    `query getDatasetLineage {
  dataset(urn: "${selectedEntityUrn}") {
    urn
    name
    platform { name }
    upstreamLineage {
      upstreams {
        dataset { urn name }
      }
    }
  }
}`
  );
  const [gqlResult, setGqlResult] = useState<string>('');

  const selectedEntity = entities.find(e => e.urn === selectedEntityUrn) || entities[0];

  useEffect(() => {
    setGqlQuery(
      `query getDatasetLineage {
  dataset(urn: "${selectedEntityUrn}") {
    urn
    name
    platform { name }
    upstreamLineage {
      upstreams {
        dataset { urn name }
      }
    }
  }
}`
    );
  }, [selectedEntityUrn]);

  const handleRunAgentSwarm = () => {
    setIsAgentRunning(true);
    setAgentLog(prev => [
      `🚀 [Swarm Triggered] Initiating DataHub Multi-Agent Audit across all 4 entities...`,
      ...prev
    ]);

    setTimeout(() => {
      setAgentLog(prev => [
        `📊 [DataHub MCP Reader] Evaluated lineage graph depth: 4 layers. All entities healthy.`,
        `🏷️ [Auto-Governance] Tagged "stg_patient_vitals_normalized" with @dbt_verified and @drt_gold_layer`,
        `🛡️ [Assertion Engine] Verified 30 assertions across Snowflake & Feast feature store.`,
        `🎉 [Task Complete] Wrote updated metadata aspects back to DataHub Control Plane!`,
        ...prev
      ]);
      setIsAgentRunning(false);
    }, 1200);
  };

  const handleTriggerDriftSimulation = () => {
    setDriftDetected(true);
    setCircuitBreakerTriggered(true);
    setMlIncidentLog(prev => [
      `🚨 [DRIFT SENTINEL ALERT] Upstream schema anomaly detected in s3://drt-raw-telemetry/patient_vitals_stream!`,
      `⚠️ [DataHub Lineage Impact] Traced downstream path: s3 -> dbt.stg_vitals -> Feast.vitals_30d -> MedGemma-7B ML Model!`,
      `🛑 [Automated Circuit Breaker] Paused MedGemma-7B inference endpoint to prevent flawed diagnosis output.`,
      `📝 [DataHub Incident Manager] Created incident URN urn:li:incident:drt-drift-2026-982 & notified MLOps team.`,
      `🔧 [Auto-PR Agent] Generated Pull Request #142 to patch schema mapping & restore normal model evaluation.`,
      ...prev
    ]);
  };

  const handleResolveDrift = () => {
    setDriftDetected(false);
    setCircuitBreakerTriggered(false);
    setMlIncidentLog(prev => [
      `✅ [DRIFT RESOLVED] PR #142 merged! Schema assertions passed 100%. MedGemma-7B model status restored to ONLINE.`,
      `🎉 [DataHub Metadata Sync] Updated ML Model health score back to 99/100.`,
      ...prev
    ]);
  };

  const handleExecuteGql = () => {
    setGqlResult(JSON.stringify({
      data: {
        dataset: {
          urn: selectedEntity.urn,
          name: selectedEntity.name,
          platform: { name: selectedEntity.platform },
          domain: selectedEntity.domain,
          healthScore: selectedEntity.healthScore,
          assertionsCount: selectedEntity.assertionsCount,
          upstreamCount: selectedEntity.upstreamUrns.length,
          downstreamCount: selectedEntity.downstreamUrns.length,
          schemaFields: selectedEntity.schemaFields?.map(f => f.name)
        }
      }
    }, null, 2));
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6 text-stone-900 dark:text-stone-100 font-sans">
      
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-stone-900 via-stone-850 to-amber-950 text-white p-6 sm:p-8 shadow-2xl border border-stone-800">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-amber-400" /> DATAHUB OPEN SOURCE CONTROL PLANE
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> MCP SERVER CONNECTED
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black font-display tracking-tight text-white flex items-center gap-3">
              DataHub Metadata & AI Agent Suite
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 max-w-3xl leading-relaxed">
              Powered by DataHub's open-source stack (MCP Server, Agent Context Kit, Metadata Control Plane).
              Automating schema discovery, end-to-end lineage traversal, metadata-aware DAG/dbt code generation, and production ML model protection for Dr. T's Clinical AI platform.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <a
              href="https://datahubproject.io"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition-all flex items-center justify-center gap-2 border border-stone-700 shadow-xs"
            >
              <ExternalLink className="w-4 h-4 text-amber-400" /> DataHub Docs
            </a>
            <button
              onClick={handleRunAgentSwarm}
              disabled={isAgentRunning}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-black text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isAgentRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-stone-950" /> Running Swarm...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-stone-950" /> Run Agent Swarm Audit
                </>
              )}
            </button>
          </div>
        </div>

        {/* METRICS STRIP */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-stone-800/80 text-xs font-mono">
          <div className="bg-stone-900/60 p-3 rounded-xl border border-stone-800">
            <span className="text-stone-400 block text-[10px] uppercase font-bold">Cataloged Entities</span>
            <span className="text-lg font-black text-white">{entities.length} Core Nodes</span>
          </div>
          <div className="bg-stone-900/60 p-3 rounded-xl border border-stone-800">
            <span className="text-stone-400 block text-[10px] uppercase font-bold">Lineage Connections</span>
            <span className="text-lg font-black text-amber-400">8 Cross-Platform Edges</span>
          </div>
          <div className="bg-stone-900/60 p-3 rounded-xl border border-stone-800">
            <span className="text-stone-400 block text-[10px] uppercase font-bold">Active Quality Assertions</span>
            <span className="text-lg font-black text-emerald-400">30 Passing (100%)</span>
          </div>
          <div className="bg-stone-900/60 p-3 rounded-xl border border-stone-800">
            <span className="text-stone-400 block text-[10px] uppercase font-bold">ML Model Protection</span>
            <span className={`text-lg font-black ${circuitBreakerTriggered ? 'text-rose-400' : 'text-cyan-400'}`}>
              {circuitBreakerTriggered ? 'BREAKER ACTIVE' : 'MEDGEMMA PROTECTED'}
            </span>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS (CHALLENGES 1-4) */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-inner">
        <button
          onClick={() => setActiveTab('agents')}
          className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer
            ${activeTab === 'agents' ? 'bg-amber-500 text-stone-950 shadow-md' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'}
          `}
        >
          <Bot className="w-4 h-4" /> Challenge 1: Agents That Do Real Work
        </button>

        <button
          onClick={() => setActiveTab('codegen')}
          className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer
            ${activeTab === 'codegen' ? 'bg-amber-500 text-stone-950 shadow-md' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'}
          `}
        >
          <GitPullRequest className="w-4 h-4" /> Challenge 2: Metadata-Aware CodeGen
        </button>

        <button
          onClick={() => setActiveTab('mlops')}
          className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer
            ${activeTab === 'mlops' ? 'bg-amber-500 text-stone-950 shadow-md' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'}
          `}
        >
          <ShieldCheck className="w-4 h-4" /> Challenge 3: Production ML Protection
        </button>

        <button
          onClick={() => setActiveTab('graph')}
          className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer
            ${activeTab === 'graph' ? 'bg-amber-500 text-stone-950 shadow-md' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'}
          `}
        >
          <Network className="w-4 h-4" /> Lineage & Catalog Explorer
        </button>

        <button
          onClick={() => setActiveTab('mcp_console')}
          className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer
            ${activeTab === 'mcp_console' ? 'bg-amber-500 text-stone-950 shadow-md' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'}
          `}
        >
          <Terminal className="w-4 h-4" /> DataHub MCP Query Console
        </button>
      </div>

      {/* TAB CONTENT PANELS */}
      <div className="space-y-6">

        {/* ========================================================
            CHALLENGE 1: AGENTS THAT DO REAL WORK
           ======================================================== */}
        {activeTab === 'agents' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
            {/* AGENT ROSTER */}
            <div className="lg:col-span-4 space-y-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold font-display text-sm flex items-center gap-2">
                    <Bot className="w-4 h-4 text-amber-500" /> Active DataHub Agent Team
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                    4 AGENTS ONLINE
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 space-y-1">
                    <div className="flex items-center justify-between font-bold text-amber-600 dark:text-amber-400">
                      <span>🔍 DataHub Sentinel Agent</span>
                      <span className="text-[10px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded">MCP Reader</span>
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400">Reads schema aspects, checks for drift, and monitors entity health scores in DataHub GMS.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 space-y-1">
                    <div className="flex items-center justify-between font-bold text-emerald-600 dark:text-emerald-400">
                      <span>🏷️ Glossary & Tag Agent</span>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded">Metadata Writer</span>
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400">Automatically applies HIPAA tags, glossary terms (PHI_Data, VitalSigns), and owners back to DataHub.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 space-y-1">
                    <div className="flex items-center justify-between font-bold text-cyan-600 dark:text-cyan-400">
                      <span>🛡️ Assertion & Quality Agent</span>
                      <span className="text-[10px] bg-cyan-500/10 text-cyan-500 px-1.5 py-0.5 rounded">Test Evaluator</span>
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400">Executes range checks & row count assertions, emitting test results directly to DataHub MCP.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 space-y-1">
                    <div className="flex items-center justify-between font-bold text-purple-600 dark:text-purple-400">
                      <span>⚡ Lineage & Impact Agent</span>
                      <span className="text-[10px] bg-purple-500/10 text-purple-500 px-1.5 py-0.5 rounded">Lineage Graph</span>
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400">Traverses end-to-end lineage from S3 raw telemetry to MedGemma clinical models to prevent silent breaks.</p>
                  </div>
                </div>

                <button
                  onClick={handleRunAgentSwarm}
                  disabled={isAgentRunning}
                  className="w-full py-2.5 rounded-xl bg-stone-900 dark:bg-stone-800 hover:bg-stone-800 dark:hover:bg-stone-700 text-white font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 text-amber-400" /> Trigger Multi-Agent Task Run
                </button>
              </div>
            </div>

            {/* REAL-TIME AGENT WORKSPACE LOG */}
            <div className="lg:col-span-8 space-y-4">
              <div className="p-5 rounded-2xl bg-stone-950 text-stone-200 border border-stone-800 shadow-xl space-y-4 font-mono">
                <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-xs text-white">DataHub Agent Workspace & Action Log</span>
                  </div>
                  <span className="text-[10px] text-stone-400">DataHub Context Kit v2.4</span>
                </div>

                <div className="h-80 overflow-y-auto space-y-2 p-3 bg-stone-900/80 rounded-xl border border-stone-800 text-xs">
                  {agentLog.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-stone-300 leading-relaxed font-mono">
                      <span className="text-stone-500 select-none">[{idx + 1}]</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] text-stone-400 border-t border-stone-800/80">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    DataHub GraphQL Server: ONLINE
                  </span>
                  <span>MCP REST Endpoint: http://localhost:8080/gms</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            CHALLENGE 2: METADATA-AWARE CODE GENERATION & DEVELOPMENT
           ======================================================== */}
        {activeTab === 'codegen' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
            {/* CODE GEN CONTROLS */}
            <div className="lg:col-span-4 space-y-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
                <div className="space-y-1">
                  <h3 className="font-bold font-display text-sm flex items-center gap-2">
                    <GitPullRequest className="w-4 h-4 text-amber-500" /> Metadata-Aware Code Generator
                  </h3>
                  <p className="text-xs text-stone-500">Reads schemas & lineage from DataHub before writing production code.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-stone-600 dark:text-stone-400 block uppercase font-mono">Select Code Artifact Type</label>
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl text-xs font-bold font-mono">
                    <button
                      onClick={() => setCodeType('dbt')}
                      className={`py-2 rounded-lg transition-all ${codeType === 'dbt' ? 'bg-amber-500 text-stone-950 shadow-xs' : 'text-stone-500'}`}
                    >
                      dbt Model
                    </button>
                    <button
                      onClick={() => setCodeType('airflow')}
                      className={`py-2 rounded-lg transition-all ${codeType === 'airflow' ? 'bg-amber-500 text-stone-950 shadow-xs' : 'text-stone-500'}`}
                    >
                      Airflow DAG
                    </button>
                    <button
                      onClick={() => setCodeType('python')}
                      className={`py-2 rounded-lg transition-all ${codeType === 'python' ? 'bg-amber-500 text-stone-950 shadow-xs' : 'text-stone-500'}`}
                    >
                      Python Ingest
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between font-bold text-stone-700 dark:text-stone-300">
                    <span>Target DataHub Entity</span>
                  </div>
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 font-bold truncate">
                    {selectedEntity.name}
                  </p>
                  <div className="text-[10px] text-stone-500 space-y-1 pt-1 border-t border-stone-200 dark:border-stone-700">
                    <div>• Upstreams: {selectedEntity.upstreamUrns.length} dataset(s)</div>
                    <div>• Assertions Rule: 100% HIPAA Masking Enforced</div>
                  </div>
                </div>

                <button
                  onClick={() => setPrSubmitted(true)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <GitPullRequest className="w-4 h-4" /> Create GitHub Pull Request Artifact
                </button>

                {prSubmitted && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> PR #142 Merged into `main`!
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-300">DataHub metadata tests validated 100% schema alignment on first try.</p>
                  </motion.div>
                )}
              </div>
            </div>

            {/* GENERATED CODE PREVIEW */}
            <div className="lg:col-span-8 space-y-4">
              <div className="p-5 rounded-2xl bg-stone-950 text-stone-200 border border-stone-800 shadow-xl space-y-3 font-mono">
                <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-xs text-white">
                      Generated Production Artifact: {codeType === 'dbt' ? 'models/marts/stg_patient_vitals_normalized.sql' : codeType === 'airflow' ? 'dags/drt_patient_ingestion_pipeline.py' : 'scripts/ingest_fhir_telemetry.py'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopyCode(codeType === 'dbt' ? SAMPLE_DBT_MODEL : codeType === 'airflow' ? SAMPLE_AIRFLOW_DAG : SAMPLE_PYTHON_INGEST)}
                    className="px-3 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                    {copiedCode ? 'Copied!' : 'Copy Code'}
                  </button>
                </div>

                <pre className="p-4 rounded-xl bg-stone-900/90 text-amber-200/90 text-xs overflow-x-auto h-96 leading-relaxed font-mono border border-stone-800">
                  {codeType === 'dbt' && SAMPLE_DBT_MODEL}
                  {codeType === 'airflow' && SAMPLE_AIRFLOW_DAG}
                  {codeType === 'python' && SAMPLE_PYTHON_INGEST}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            CHALLENGE 3: PRODUCTION ML AGENTS (DRIFT & LINEAGE SENTINEL)
           ======================================================== */}
        {activeTab === 'mlops' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
                <div className="space-y-1">
                  <h3 className="font-bold font-display text-sm flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-500" /> Production ML Lineage & Protection Agent
                  </h3>
                  <p className="text-xs text-stone-500">Monitors end-to-end path: Training Data -&gt; Feature Store -&gt; MedGemma Models -&gt; Clinical API.</p>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-700 dark:text-stone-300">MedGemma-7B Protection Status</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${circuitBreakerTriggered ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'}`}>
                      {circuitBreakerTriggered ? 'CIRCUIT BREAKER ENGAGED' : 'HEALTHY (99/100)'}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-[11px] text-stone-600 dark:text-stone-400">
                    <div className="flex justify-between">
                      <span>Feature Store View:</span>
                      <span className="font-bold text-stone-900 dark:text-stone-100">Feast: vitals_30d_aggregates</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Upstream Table:</span>
                      <span className="font-bold text-stone-900 dark:text-stone-100">dbt.marts.stg_patient_vitals</span>
                    </div>
                    <div className="flex justify-between">
                      <span>DataHub Incident URN:</span>
                      <span className="font-bold text-amber-500 truncate">{driftDetected ? 'urn:li:incident:drt-drift-2026' : 'None Active'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {!driftDetected ? (
                    <button
                      onClick={handleTriggerDriftSimulation}
                      className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <AlertTriangle className="w-4 h-4" /> Simulate Upstream Data Drift Anomaly
                    </button>
                  ) : (
                    <button
                      onClick={handleResolveDrift}
                      className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Merge PR #142 & Restore ML Endpoint
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="p-5 rounded-2xl bg-stone-950 text-stone-200 border border-stone-800 shadow-xl space-y-3 font-mono">
                <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-rose-400" />
                    <span className="font-bold text-xs text-white">DataHub ML Incident & Remediation Stream</span>
                  </div>
                  <span className="text-[10px] text-stone-400">Agent Context Kit ML Sentinel</span>
                </div>

                <div className="h-80 overflow-y-auto space-y-2 p-3 bg-stone-900/80 rounded-xl border border-stone-800 text-xs">
                  {mlIncidentLog.length === 0 ? (
                    <div className="text-center py-20 text-stone-500">
                      No active ML incidents detected. Click "Simulate Upstream Data Drift Anomaly" to test automatic model protection.
                    </div>
                  ) : (
                    mlIncidentLog.map((log, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-stone-300 leading-relaxed">
                        <span className="text-stone-500 select-none">[{idx + 1}]</span>
                        <span>{log}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            LINEAGE & CATALOG EXPLORER
           ======================================================== */}
        {activeTab === 'graph' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
            {/* ENTITY LIST */}
            <div className="lg:col-span-4 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                <input
                  type="text"
                  placeholder="Filter DataHub catalog..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {entities
                  .filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(entity => (
                    <div
                      key={entity.urn}
                      onClick={() => setSelectedEntityUrn(entity.urn)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all space-y-1.5 font-mono
                        ${selectedEntityUrn === entity.urn ? 'bg-amber-500/10 border-amber-500 text-amber-900 dark:text-amber-200 shadow-sm' : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'}
                      `}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className="truncate max-w-[200px]">{entity.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 font-bold uppercase text-stone-600 dark:text-stone-400">
                          {entity.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 line-clamp-1">{entity.description}</p>
                      <div className="flex items-center gap-2 text-[10px] text-stone-400 pt-1">
                        <span>Platform: {entity.platform}</span>
                        <span>•</span>
                        <span>Score: {entity.healthScore}/100</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* ENTITY DETAIL & LINEAGE CARD */}
            <div className="lg:col-span-8 space-y-4">
              <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      URN: {selectedEntity.urn}
                    </span>
                    <h2 className="text-xl font-bold font-display text-stone-900 dark:text-stone-100">
                      {selectedEntity.name}
                    </h2>
                    <p className="text-xs text-stone-500">{selectedEntity.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      Health: {selectedEntity.healthScore}/100
                    </span>
                  </div>
                </div>

                {/* SCHEMA FIELDS */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold font-mono text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                    DataHub Schema Aspects ({selectedEntity.schemaFields?.length || 0} fields)
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-stone-200 dark:border-stone-800 text-stone-500 text-[10px]">
                          <th className="py-2 px-3">Field Name</th>
                          <th className="py-2 px-3">Type</th>
                          <th className="py-2 px-3">Description</th>
                          <th className="py-2 px-3">Security & PII</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
                        {selectedEntity.schemaFields?.map((field, idx) => (
                          <tr key={idx} className="hover:bg-stone-50 dark:hover:bg-stone-800/30">
                            <td className="py-2 px-3 font-bold text-amber-600 dark:text-amber-400">{field.name}</td>
                            <td className="py-2 px-3 text-stone-600 dark:text-stone-400">{field.type}</td>
                            <td className="py-2 px-3 text-stone-500">{field.description}</td>
                            <td className="py-2 px-3">
                              {field.pii ? (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center gap-1 w-fit">
                                  <Lock className="w-3 h-3" /> PII / HIPAA
                                </span>
                              ) : (
                                <span className="text-stone-400 text-[10px]">Standard</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            DATAHUB MCP QUERY CONSOLE
           ======================================================== */}
        {activeTab === 'mcp_console' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
            <div className="lg:col-span-6 space-y-4">
              <div className="p-5 rounded-2xl bg-stone-950 text-stone-200 border border-stone-800 shadow-xl space-y-3 font-mono">
                <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                  <span className="font-bold text-xs text-white flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-amber-400" /> DataHub MCP GraphQL Request
                  </span>
                  <button
                    onClick={handleExecuteGql}
                    className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-black transition-all cursor-pointer"
                  >
                    Execute Query
                  </button>
                </div>
                <textarea
                  value={gqlQuery}
                  onChange={(e) => setGqlQuery(e.target.value)}
                  className="w-full h-80 p-3 bg-stone-900 rounded-xl text-xs text-amber-300 font-mono border border-stone-800 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <div className="p-5 rounded-2xl bg-stone-950 text-stone-200 border border-stone-800 shadow-xl space-y-3 font-mono">
                <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                  <span className="font-bold text-xs text-white">DataHub GMS Response Payload</span>
                  <span className="text-[10px] text-emerald-400 font-bold">200 OK</span>
                </div>
                <pre className="w-full h-80 p-3 bg-stone-900 rounded-xl text-xs text-emerald-300 font-mono overflow-auto border border-stone-800">
                  {gqlResult || '// Click "Execute Query" to inspect live GraphQL response from DataHub GMS'}
                </pre>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
