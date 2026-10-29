/**
 * Dr. T — HealthAlert Companion MCP Server & Agent Orchestrator
 * Amazon Developer Hackathon 2026 (Alexa+ Track)
 * Model Context Protocol (MCP) Specification compliant (JSON-RPC 2.0 & Streamable HTTP)
 * Protocols supported: 2025-11-25 (Latest), 2024-11-05
 */

import { GoogleGenAI } from '@google/genai';
import { 
  getEmergencyGuidanceByRegion, 
  ST_COOL_DISCLAIMER 
} from './stCoolService';
import { GeminiCircuitBreaker } from './geminiCircuitBreaker';

export const SUPPORTED_MCP_PROTOCOL_VERSIONS = ['2025-11-25', '2024-11-05'];
export const DEFAULT_MCP_PROTOCOL_VERSION = '2025-11-25';

export interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}

export const HEALTH_ALERT_MCP_TOOLS: McpToolDefinition[] = [
  {
    name: 'check_safety_escalation',
    description: 'Evaluates emergency red-flag warning signs (chest pain, stroke signs, respiratory distress) using deterministic rules independent of AI generation. Safety rules strictly supersede all AI output.',
    inputSchema: {
      type: 'object',
      properties: {
        symptoms: {
          type: 'array',
          items: { type: 'string' },
          description: 'Observed patient symptoms and sensations (e.g. chest pain, shortness of breath, fatigue).'
        },
        bloodPressure: {
          type: 'string',
          description: 'Blood pressure in systolic/diastolic format (e.g. 138/88 or 185/110).'
        },
        heartRate: {
          type: 'number',
          description: 'Resting heart rate in beats per minute.'
        },
        region: {
          type: 'string',
          description: 'User country/region for localized emergency dispatch (e.g. Vietnam, UAE, UK, Europe, US).'
        }
      },
      required: ['symptoms']
    }
  },
  {
    name: 'explain_health_alert',
    description: 'Explains health observations, wearable biometrics, or lab findings in plain language with epistemic uncertainty bounds. Distinguishes supplied facts from interpretations without hallucinating missing context.',
    inputSchema: {
      type: 'object',
      properties: {
        alert: {
          type: 'string',
          description: 'User-provided observation, alert text, or health concern.'
        },
        measurement: {
          type: 'number',
          description: 'Optional numeric measurement value.'
        },
        unit: {
          type: 'string',
          description: 'Optional unit of measurement (e.g. ng/mL, mmHg, %, mg/dL).'
        },
        referenceRange: {
          type: 'string',
          description: 'Optional normal clinical reference range if known.'
        },
        symptoms: {
          type: 'array',
          items: { type: 'string' },
          description: 'Associated patient symptoms.'
        },
        context: {
          type: 'string',
          description: 'Clinical context or lifestyle factors (e.g. marathon runner, sedentary office worker).'
        }
      },
      required: ['alert']
    }
  },
  {
    name: 'prepare_follow_up_questions',
    description: 'Generates concise, non-diagnostic physician consultation questions and a pre-appointment checklist based on supplied health signals.',
    inputSchema: {
      type: 'object',
      properties: {
        primaryConcern: {
          type: 'string',
          description: 'Main health question or symptom.'
        },
        triageTier: {
          type: 'string',
          enum: ['ROUTINE_WELLNESS', 'PLANNED_CLINICAL_ASSESSMENT', 'URGENT_EVALUATION', 'EMERGENT_ESCALATION'],
          description: 'Evaluated triage tier.'
        },
        findings: {
          type: 'array',
          items: { type: 'string' },
          description: 'Key clinical or biometric findings identified.'
        }
      },
      required: ['primaryConcern']
    }
  }
];

export interface SafetyEscalationResult {
  isEmergency: boolean;
  triageTier: 'ROUTINE_WELLNESS' | 'PLANNED_CLINICAL_ASSESSMENT' | 'URGENT_EVALUATION' | 'EMERGENT_ESCALATION';
  actionSummary: string;
  urgencyTimeline: string;
  emergencyDirective: string;
  localizedEmergency: {
    ambulanceNumber: string;
    regionalTitle: string;
    emergencyInstructions: string;
  };
  triggeredRules: string[];
}

export function executeCheckSafetyEscalation(args: any): SafetyEscalationResult {
  const symptoms: string[] = Array.isArray(args.symptoms) ? args.symptoms : [];
  const bloodPressure: string = args.bloodPressure || '';
  const heartRate: number | undefined = typeof args.heartRate === 'number' ? args.heartRate : undefined;
  const region: string = args.region || 'Vietnam';

  const triggeredRules: string[] = [];
  let isEmergency = false;
  let triageTier: SafetyEscalationResult['triageTier'] = 'ROUTINE_WELLNESS';
  let actionSummary = 'Routine health orientation and preventative wellness.';
  let urgencyTimeline = 'Routine annual check-up or non-urgent outpatient review.';

  // 1. Critical Red-Flag Emergency Invariant
  const lowerSymptoms = symptoms.map(s => s.toLowerCase());
  const redFlags = [
    'crushing chest pain',
    'chest pain',
    'chest pressure',
    'radiating to left arm',
    'left arm pain',
    'stroke',
    'facial droop',
    'arm weakness',
    'slurred speech',
    'loss of consciousness',
    'syncope',
    'severe shortness of breath',
    'respiratory distress',
    'diaphoresis'
  ];

  const matchedRedFlags = redFlags.filter(rf => lowerSymptoms.some(s => s.includes(rf)));

  if (matchedRedFlags.length > 0) {
    isEmergency = true;
    triageTier = 'EMERGENT_ESCALATION';
    actionSummary = `CRITICAL WARNING: Acute red-flag warning signs detected (${matchedRedFlags.join(', ')}). Immediate emergency evaluation is required.`;
    urgencyTimeline = 'IMMEDIATE — Call emergency medical dispatch now. Do not delay.';
    triggeredRules.push(`CRITICAL_RED_FLAG_SYMPTOM: ${matchedRedFlags.join(', ')}`);
  }

  // 2. Hypertensive Crisis Invariant
  if (bloodPressure) {
    const parts = bloodPressure.split('/').map(p => parseInt(p.trim(), 10));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      const [sys, dia] = parts;
      if (sys >= 180 || dia >= 120) {
        isEmergency = true;
        triageTier = 'EMERGENT_ESCALATION';
        actionSummary = `HYPERTENSIVE CRISIS INVARIANT: Blood pressure ${sys}/${dia} mmHg meets AHA criteria for hypertensive emergency.`;
        urgencyTimeline = 'IMMEDIATE — Urgent emergency department evaluation.';
        triggeredRules.push(`AHA_HYPERTENSIVE_CRISIS: ${sys}/${dia} mmHg`);
      } else if (!isEmergency && (sys >= 140 || dia >= 90)) {
        triageTier = 'URGENT_EVALUATION';
        actionSummary = `Stage 2 Hypertension detected (${sys}/${dia} mmHg). Clinical evaluation recommended within 24-48 hours.`;
        urgencyTimeline = 'Within 24 to 48 hours with a primary healthcare provider.';
        triggeredRules.push(`AHA_STAGE_2_HTN: ${sys}/${dia} mmHg`);
      } else if (!isEmergency && (sys >= 130 || dia >= 80)) {
        // Stage 1 HTN (138/88) invariant: strictly PLANNED_CLINICAL_ASSESSMENT (2-4 weeks)
        triageTier = 'PLANNED_CLINICAL_ASSESSMENT';
        actionSummary = `Stage 1 Hypertension / Vascular strain (${sys}/${dia} mmHg). Schedule non-emergency outpatient review.`;
        urgencyTimeline = 'Within 2 to 4 weeks with a primary care clinician.';
        triggeredRules.push(`AHA_STAGE_1_HTN_OUTPATIENT: ${sys}/${dia} mmHg`);
      }
    }
  }

  const localizedEmergency = getEmergencyGuidanceByRegion(region);
  const emergencyDirective = isEmergency
    ? `EMERGENCY ESCALATION: Seek emergency medical services immediately. In ${region}, call ${localizedEmergency.ambulanceNumber} (${localizedEmergency.regionalTitle}).`
    : `In the event of acute chest pain, severe breathing difficulty, or sudden weakness, contact emergency services (${localizedEmergency.ambulanceNumber}).`;

  return {
    isEmergency,
    triageTier,
    actionSummary,
    urgencyTimeline,
    emergencyDirective,
    localizedEmergency,
    triggeredRules
  };
}

export function executeExplainHealthAlert(
  args: any,
  geminiClient: GoogleGenAI | null
): Promise<{
  summary: string;
  factsSupplied: Record<string, any>;
  missingInformation: string[];
  interpretations: string[];
  recommendedNextSteps: string[];
  urgency: string;
  telemetry: {
    providerUsed: string;
    latencyMs: number;
    heuristicFallbackEngaged: boolean;
  };
}> {
  return new Promise(async (resolve) => {
    const startTime = Date.now();
    const alert = String(args.alert || 'Health Alert Observation');
    const measurement = args.measurement;
    const unit = args.unit;
    const referenceRange = args.referenceRange;
    const symptoms = Array.isArray(args.symptoms) ? args.symptoms : [];
    const context = args.context || 'General health self-monitoring';

    const factsSupplied: Record<string, any> = { alert, symptoms, context };
    if (measurement !== undefined) factsSupplied.measurement = measurement;
    if (unit) factsSupplied.unit = unit;
    if (referenceRange) factsSupplied.referenceRange = referenceRange;

    const missingInformation: string[] = [];
    if (measurement !== undefined && !unit) {
      missingInformation.push('Measurement unit not specified (e.g. mg/dL, ng/mL, mmHg).');
    }
    if (!referenceRange) {
      missingInformation.push('Lab assay standard reference range not provided; ranges vary by testing laboratory.');
    }
    if (symptoms.length === 0) {
      missingInformation.push('No functional clinical symptoms reported (e.g. fatigue, shortness of breath, dizziness).');
    }

    // Deterministic interpretations
    const interpretations: string[] = [];
    const recommendedNextSteps: string[] = [
      'Document your home readings or lab reports chronologically.',
      'Schedule a formal review with your primary care physician to contextualize these findings.',
      'Do not start or modify prescription medications or high-dose supplements without medical oversight.'
    ];

    let urgency = 'PLANNED_CLINICAL_ASSESSMENT';

    const lowerAlert = alert.toLowerCase();
    if (lowerAlert.includes('ferritin') || (unit && unit.toLowerCase().includes('ng/ml') && measurement && measurement < 30)) {
      interpretations.push(
        'Possible subclinical iron depletion without overt anemia. Ferritin represents intracellular iron stores essential for mitochondrial cellular respiration.',
        'Low iron stores can impair energy metabolism even when hemoglobin concentration is preserved.'
      );
      recommendedNextSteps.unshift('Discuss a complete iron panel (Serum Iron, TIBC, Transferrin Saturation) with your physician.');
    } else if (lowerAlert.includes('blood pressure') || lowerAlert.includes('hba1c') || lowerAlert.includes('glucose')) {
      interpretations.push(
        'Cardiometabolic vascular and glycemic strain. Mild elevations in blood pressure and HbA1c interact synergistically on endothelial health.',
        'Early lifestyle adjustments (aerobic activity, sodium moderation, sleep hygiene) produce significant restorative benefits.'
      );
      recommendedNextSteps.unshift('Track home morning and evening resting blood pressure in a structured 7-day log.');
    } else {
      interpretations.push(
        `Observation '${alert}' warrants standard clinical contextualization alongside comprehensive physical examination.`,
        'Biometric findings require interpretation against personal health history, family history, and medication review.'
      );
    }

    let summary = `Evaluation of '${alert}': Informational clinical orientation grounded in evidence guidelines.`;
    let providerUsed = 'healthalert-mcp-deterministic-engine';
    let heuristicFallbackEngaged = false;

    if (geminiClient && !GeminiCircuitBreaker.isCircuitOpen('gemini-3.8-flash')) {
      const prompt = `You are HealthAlert Companion, an evidence-grounded clinical decision-support agent within Dr. T for the Amazon Developer Hackathon 2026.
Explain this health observation clearly and empathetically at a Grade 7 reading level:
- Alert/Observation: ${alert}
- Measurement: ${measurement ? `${measurement} ${unit || ''}` : 'Not provided'}
- Context: ${context}
- Symptoms: ${symptoms.join(', ') || 'None reported'}

Instructions:
1. Provide a 2-3 sentence plain-language explanation of what this marker represents physiologically.
2. Clearly distinguish what facts were provided from what is still unconfirmed.
3. Explicitly state this is non-diagnostic information.
Do not invent missing numbers, medical history, or diagnostic claims.`;

      const aiText = await GeminiCircuitBreaker.executeWithFallback(
        geminiClient,
        'gemini-3.8-flash',
        prompt,
        2500
      );

      if (aiText) {
        summary = aiText;
        providerUsed = 'gemini-3.8-flash (AI-Enriched MCP Tool)';
      } else {
        providerUsed = 'healthalert-mcp-deterministic-engine (Verified Fallback)';
        heuristicFallbackEngaged = true;
      }
    } else {
      providerUsed = 'healthalert-mcp-deterministic-engine (Verified Engine)';
      heuristicFallbackEngaged = true;
    }

    const latencyMs = Date.now() - startTime;

    resolve({
      summary,
      factsSupplied,
      missingInformation,
      interpretations,
      recommendedNextSteps,
      urgency,
      telemetry: {
        providerUsed,
        latencyMs,
        heuristicFallbackEngaged
      }
    });
  });
}

export function executePrepareFollowUpQuestions(args: any): {
  questions: Array<{ id: string; question: string; category: string; rationale: string }>;
  checklist: string[];
  missingContextNoted: string[];
} {
  const primaryConcern = String(args.primaryConcern || 'Health review');
  const triageTier = args.triageTier || 'PLANNED_CLINICAL_ASSESSMENT';
  const findings: string[] = Array.isArray(args.findings) ? args.findings : [];

  const questions = [
    {
      id: 'q-1',
      question: `Given my reported concern regarding ${primaryConcern}, what confirmatory diagnostic tests or blood panels do you recommend?`,
      category: 'Diagnostic Clarification',
      rationale: 'Establishes an objective medical evaluation plan.'
    },
    {
      id: 'q-2',
      question: 'Are there specific red-flag symptoms or vital sign thresholds that should prompt me to seek urgent medical care?',
      category: 'Safety & Escalation',
      rationale: 'Provides explicit patient safety boundaries between appointments.'
    },
    {
      id: 'q-3',
      question: 'What evidence-based lifestyle, nutrition, or physical activity modifications would best support my recovery and long-term health?',
      category: 'Preventative Management',
      rationale: 'Aligns clinical strategy with actionable personal habits.'
    }
  ];

  const checklist = [
    'Bring copies of recent laboratory results or diagnostic imaging.',
    'Maintain a 7-day diary of symptoms, blood pressure readings, or relevant biometrics.',
    'Prepare an up-to-date list of all prescription medications, over-the-counter drugs, and dietary supplements.',
    'Note any changes in sleep, stress, or diet over the past 30 days.'
  ];

  const missingContextNoted = [
    'Personal baseline vitals when feeling healthy.',
    'Family medical history regarding cardiometabolic or hematological conditions.',
    'Current medication dosages and adherence frequency.'
  ];

  return { questions, checklist, missingContextNoted };
}

/**
 * Executes a full conversational agent session orchestration.
 */
export async function runAgentOrchestration(
  userQuery: string,
  region: string = 'Vietnam',
  geminiClient: GoogleGenAI | null
): Promise<{
  success: boolean;
  sessionId: string;
  userQuery: string;
  toolExecutionTrace: Array<{
    toolName: string;
    input: any;
    output: any;
    executionTimeMs: number;
    status: 'success' | 'escalated' | 'fallback';
  }>;
  agentResponse: string;
  safetySummary: SafetyEscalationResult;
  urgencyTier: string;
  disclaimer: string;
  telemetry: {
    totalLatencyMs: number;
    providerUsed: string;
    toolsExecuted: number;
  };
}> {
  const overallStart = Date.now();
  const sessionId = `HAC-AGENT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  const toolExecutionTrace: any[] = [];

  // Parse query signals (vitals, symptoms, lab keywords)
  const lowerQuery = userQuery.toLowerCase();
  const extractedSymptoms: string[] = [];
  if (lowerQuery.includes('chest pain') || lowerQuery.includes('chest pressure')) extractedSymptoms.push('Chest pain / pressure');
  if (lowerQuery.includes('arm pain')) extractedSymptoms.push('Left arm pain');
  if (lowerQuery.includes('shortness of breath') || lowerQuery.includes('breathless')) extractedSymptoms.push('Shortness of breath');
  if (lowerQuery.includes('fatigue') || lowerQuery.includes('tired')) extractedSymptoms.push('Fatigue');
  if (lowerQuery.includes('headache')) extractedSymptoms.push('Headache');
  if (lowerQuery.includes('dizziness')) extractedSymptoms.push('Dizziness');

  // Extract BP if present
  let extractedBp = '';
  const bpMatch = userQuery.match(/\b(1\d\d|2\d\d)\s*\/\s*(\d\d|1\d\d)\b/);
  if (bpMatch) {
    extractedBp = `${bpMatch[1]}/${bpMatch[2]}`;
  }

  // Extract Ferritin if present
  let extractedFerritin: number | undefined;
  const ferritinMatch = userQuery.match(/ferritin\D*(\d+)/i);
  if (ferritinMatch) {
    extractedFerritin = parseFloat(ferritinMatch[1]);
  }

  // 1. Mandatory Safety Check FIRST (Step 3)
  const t0 = Date.now();
  const safetyResult = executeCheckSafetyEscalation({
    symptoms: extractedSymptoms.length > 0 ? extractedSymptoms : [userQuery],
    bloodPressure: extractedBp,
    region
  });
  toolExecutionTrace.push({
    toolName: 'check_safety_escalation',
    input: { symptoms: extractedSymptoms, bloodPressure: extractedBp, region },
    output: safetyResult,
    executionTimeMs: Date.now() - t0,
    status: safetyResult.isEmergency ? 'escalated' : 'success'
  });

  // 2. Health Alert Explanation (Step 4)
  const t1 = Date.now();
  const explainResult = await executeExplainHealthAlert({
    alert: userQuery,
    measurement: extractedFerritin,
    unit: extractedFerritin !== undefined ? 'ng/mL' : undefined,
    symptoms: extractedSymptoms,
    context: `User reported via HealthAlert Companion conversational interface (${region})`
  }, geminiClient);
  toolExecutionTrace.push({
    toolName: 'explain_health_alert',
    input: { alert: userQuery, measurement: extractedFerritin, symptoms: extractedSymptoms },
    output: explainResult,
    executionTimeMs: Date.now() - t1,
    status: explainResult.telemetry.heuristicFallbackEngaged ? 'fallback' : 'success'
  });

  // 3. Prepare Follow-up Questions (Step 5)
  const t2 = Date.now();
  const questionsResult = executePrepareFollowUpQuestions({
    primaryConcern: userQuery,
    triageTier: safetyResult.isEmergency ? safetyResult.triageTier : explainResult.urgency,
    findings: safetyResult.triggeredRules.concat(explainResult.interpretations)
  });
  toolExecutionTrace.push({
    toolName: 'prepare_follow_up_questions',
    input: { primaryConcern: userQuery, triageTier: safetyResult.triageTier },
    output: questionsResult,
    executionTimeMs: Date.now() - t2,
    status: 'success'
  });

  // 4. Synthesize Final Agent Response (Deterministic Safety Invariant MUST supersede AI)
  let agentResponse = '';
  if (safetyResult.isEmergency) {
    agentResponse = `🚨 **EMERGENCY WARNING DETECTED**\n\n${safetyResult.actionSummary}\n\n**Action Required:** ${safetyResult.emergencyDirective}\n\n*Emergency instructions for ${safetyResult.localizedEmergency.regionalTitle}:* Call **${safetyResult.localizedEmergency.ambulanceNumber}** immediately. Do not drive yourself.`;
  } else {
    agentResponse = `**HealthAlert Companion Assessment:**\n\n${explainResult.summary}\n\n**Clinical Timeline:** ${safetyResult.urgencyTimeline}\n\n**Next Steps:**\n${explainResult.recommendedNextSteps.map(s => `• ${s}`).join('\n')}\n\n**Questions for Your Healthcare Provider:**\n${questionsResult.questions.map(q => `• "${q.question}" (*${q.category}*)`).join('\n')}`;
  }

  const totalLatencyMs = Date.now() - overallStart;

  return {
    success: true,
    sessionId,
    userQuery,
    toolExecutionTrace,
    agentResponse,
    safetySummary: safetyResult,
    urgencyTier: safetyResult.triageTier,
    disclaimer: ST_COOL_DISCLAIMER,
    telemetry: {
      totalLatencyMs,
      providerUsed: explainResult.telemetry.providerUsed,
      toolsExecuted: toolExecutionTrace.length
    }
  };
}
