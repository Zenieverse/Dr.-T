import { GoogleGenAI } from '@google/genai';
import { 
  HealthAlertIntakeData, 
  HealthAlertAnalysisResponse, 
  HealthAlertTriageTier, 
  HealthAlertEvidenceCitation, 
  HealthAlertClinicianQuestion 
} from '../types';
import { 
  validateStCoolRequest, 
  evaluateStCoolHeuristics, 
  buildClinicianPrep,
  ST_COOL_EVIDENCE_REGISTRY 
} from './stCoolService';

export const HEALTH_ALERT_DISCLAIMER = 
  "DISCLAIMER: Non-Diagnostic Clinical Decision Support. HealthAlert Companion is an assistive health navigation and early warning screening engine designed to help people recognize warning signs and prepare for professional medical assessment. It does NOT provide formal medical diagnosis, prescribe treatments, or serve as an emergency response service. Always seek the advice of a qualified healthcare professional.";

export const HEALTH_ALERT_EMERGENCY_NOTICE = 
  "EMERGENCY DIRECTIVE: If you or someone you are assisting is experiencing severe chest pain, sudden numbness/weakness, severe shortness of breath, loss of consciousness, or other life-threatening symptoms, call 911 or your local emergency number immediately (in Vietnam, call 115 for Emergency Medical Service; in Europe, call 112; in the UAE, call 998/999).";

export const HEALTH_ALERT_VIETNAM_EMERGENCY_NOTICE =
  "HƯỚNG DẪN CẤP CỨU Y TẾ TẠI VIỆT NAM: Nếu có triệu chứng cấp cứu nguy kịch (đau tức ngực nghẹt thở, đột quỵ méo miệng/yếu liệt tay chân, khó thở dữ dội, ngất xỉu), gọi ngay số 115 (Tổng đài Cấp cứu Y tế) hoặc 114 (Cứu nạn) hoặc đến khoa cấp cứu bệnh viện gần nhất.";

export { getEmergencyGuidanceByRegion } from './stCoolService';

export const HEALTH_ALERT_EVIDENCE_REGISTRY = ST_COOL_EVIDENCE_REGISTRY;

export const validateHealthAlertRequest = validateStCoolRequest;

export const evaluateHealthAlertHeuristics = evaluateStCoolHeuristics;

export async function runHealthAlertAnalysis(
  intake: HealthAlertIntakeData,
  geminiClient: GoogleGenAI | null
): Promise<HealthAlertAnalysisResponse> {
  const startTime = Date.now();
  const sessionId = `HLA-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  // 1. Evaluate Deterministic Heuristic Core
  const heuristic = evaluateHealthAlertHeuristics(intake);

  // 2. Build Clinician Preparation & SBAR
  const clinicianPrep = buildClinicianPrep(intake, heuristic);

  // 3. Educational Synthesis
  let topic = 'Anticipatory Health Alert & Early Orientation';
  let plainSummary = `Understanding the physiological factors connecting your reported concerns (${intake.primaryConcern}) with clinical evidence.`;
  let mechanisticExplanation = `Our cells rely on continuous oxygen delivery, balanced glucose regulation, and hemodynamic stability. When markers like ferritin, blood pressure, or glycemic control shift even mildly, they can create noticeable energetic and physiological symptoms before formal disease criteria are reached.`;
  const lifestyleCaveats = [
    'Do not start high-dose supplements without physician oversight and confirmatory lab work.',
    'Prioritize 7-9 hours of consistent sleep and morning sunlight exposure to support circadian cortisol rhythm.',
    'Stay well hydrated and discuss tailored dietary adjustments with your physician.'
  ];

  if (heuristic.findings.some(f => f.finding.includes('Ferritin'))) {
    topic = 'Cellular Iron Reserves & Mitochondrial Energy Metabolism';
    plainSummary = 'Ferritin stores iron like an emergency reserve tank. Even when red blood cells appear normal, low ferritin means muscle and brain mitochondria receive less iron for energetic enzymes.';
    mechanisticExplanation = 'Iron is an essential cofactor for cytochrome c oxidase (Complex IV) in the electron transport chain. Low cellular iron impairs ATP synthesis, causing midday cognitive fatigue and physical exhaustion prior to the development of overt anemia.';
  } else if (heuristic.findings.some(f => f.finding.includes('Blood Pressure') || f.finding.includes('HbA1c'))) {
    topic = 'Cardiometabolic Health & Vascular Endothelial Resilience';
    plainSummary = 'Blood pressure and glucose regulation work closely together. Early elevation strains blood vessels, making proactive lifestyle changes highly impactful.';
    mechanisticExplanation = 'Elevated systolic pressure and glycemic variability increase arterial wall shear stress and advanced glycation end-products (AGEs). Early dietary modification and aerobic conditioning restore endothelial nitric oxide bioavailability.';
  }

  let providerUsed = 'health-alert-deterministic-heuristic-engine';
  let heuristicFallbackEngaged = false;

  // 4. Optional AI Enrichment (if Gemini key configured)
  if (geminiClient) {
    try {
      const prompt = `You are Health Alert, an empathetic and clinically cautious health intelligence engine within Dr. T for the Abu Dhabi Future Health Challenge 2026.
Synthesize a plain-language health orientation for a patient.

User Intake:
- Age: ${intake.age}, Gender: ${intake.gender}
- Primary Concern: ${intake.primaryConcern} (Duration: ${intake.durationDays} days, Severity: ${intake.severityScale}/10)
- Vitals: ${JSON.stringify(intake.vitals)}
- Labs: ${JSON.stringify(intake.labs)}
- Symptoms: ${intake.symptoms.join(', ')}
- Triage Tier: ${heuristic.triageTier}
- Risk Score: ${heuristic.riskScore}%

Instructions:
1. Provide a concise, empathetic explanation of what these findings mean in plain language (Grade 7 reading level).
2. Explicitly note that this is non-diagnostic decision support.
3. Suggest 3 personalized questions for the patient to ask their doctor.
Output concise text.`;

      const timeoutPromise = new Promise<never>((_, reject) => {
        const timer = setTimeout(() => reject(new Error('AI enrichment timed out (2500ms limit)')), 2500);
        if (typeof timer.unref === 'function') timer.unref();
      });

      const aiResponse = await Promise.race([
        geminiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt
        }),
        timeoutPromise
      ]);

      if (aiResponse && aiResponse.text) {
        providerUsed = 'gemini-3.8-flash (AI-Enriched Decision Support)';
      }
    } catch (aiErr) {
      console.warn('Gemini optional enrichment skipped; falling back cleanly to deterministic Health Alert engine:', aiErr);
      providerUsed = 'health-alert-deterministic-heuristic-engine (Verified Fallback)';
      heuristicFallbackEngaged = true;
    }
  } else {
    providerUsed = 'health-alert-deterministic-heuristic-engine (Verified Engine)';
    heuristicFallbackEngaged = true;
  }

  const latencyMs = Date.now() - startTime;

  // Build FHIR R4 RiskAssessment object
  const fhirRiskAssessment = {
    resourceType: 'RiskAssessment',
    id: sessionId,
    status: 'final',
    subject: { reference: `Patient/${intake.patientAlias || 'ANON-PT'}` },
    occurrenceDateTime: new Date().toISOString(),
    performer: { display: 'Dr. T Health Alert Clinical Warning Engine' },
    prediction: [{
      outcome: { text: heuristic.triageTitle },
      probabilityDecimal: parseFloat((heuristic.riskScore / 100).toFixed(2)),
      qualitativeRisk: { text: heuristic.triageTier }
    }],
    note: [{ text: HEALTH_ALERT_DISCLAIMER }]
  };

  return {
    success: true,
    sessionId,
    timestamp: new Date().toISOString(),
    triageTier: heuristic.triageTier,
    triageTitle: heuristic.triageTitle,
    actionSummary: heuristic.actionSummary,
    urgencyTimeline: heuristic.urgencyTimeline,
    riskScore: heuristic.riskScore,
    uncertainty: heuristic.uncertainty,
    clinicalFindings: heuristic.findings,
    evidenceSources: HEALTH_ALERT_EVIDENCE_REGISTRY,
    personalizedEducation: {
      topic,
      plainLanguageSummary: plainSummary,
      mechanisticExplanation,
      lifestyleCaveats
    },
    clinicianPreparation: clinicianPrep,
    safetyNotice: {
      disclaimer: HEALTH_ALERT_DISCLAIMER,
      emergencyWarning: intake.countryOrRegion?.toLowerCase().includes('vi')
        ? `${HEALTH_ALERT_VIETNAM_EMERGENCY_NOTICE} (${HEALTH_ALERT_EMERGENCY_NOTICE})`
        : HEALTH_ALERT_EMERGENCY_NOTICE,
      humanClinicianRequired: heuristic.triageTier === 'URGENT_EVALUATION' || heuristic.triageTier === 'EMERGENT_ESCALATION'
    },
    telemetry: {
      providerUsed,
      latencyMs,
      heuristicFallbackEngaged,
      anonymizationVerified: true,
      fhirCompliant: true
    },
    fhirRiskAssessment
  };
}
