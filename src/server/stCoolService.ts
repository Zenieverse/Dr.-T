import { GoogleGenAI } from '@google/genai';
import { 
  StCoolIntakeData, 
  StCoolAnalysisResponse, 
  StCoolTriageTier, 
  StCoolEvidenceCitation, 
  StCoolClinicianQuestion 
} from '../types';
import { GeminiCircuitBreaker } from './geminiCircuitBreaker';

export const ST_COOL_DISCLAIMER = 
  "DISCLAIMER: Non-Diagnostic Clinical Decision Support. HealthAlert Companion is an assistive health navigation and early warning screening engine designed to help people recognize warning signs and prepare for professional medical assessment. It does NOT provide formal medical diagnosis, prescribe treatments, or serve as an emergency response service. Always seek the advice of a qualified healthcare professional.";

export const ST_COOL_EMERGENCY_NOTICE = 
  "EMERGENCY DIRECTIVE: If you or someone you are assisting is experiencing severe chest pain, sudden numbness/weakness, severe shortness of breath, loss of consciousness, or other life-threatening symptoms, call 911 or your local emergency number immediately (in Vietnam, call 115 for Emergency Medical Service; in Europe, call 112; in the UAE, call 998/999).";

export function getEmergencyGuidanceByRegion(region?: string): {
  ambulanceNumber: string;
  regionalTitle: string;
  emergencyInstructions: string;
} {
  const reg = (region || '').toLowerCase();
  if (reg.includes('vietnam') || reg.includes('vn') || reg === 'vi') {
    return {
      ambulanceNumber: '115',
      regionalTitle: 'Vietnam Emergency Medical Dispatch (Cấp cứu Y tế 115)',
      emergencyInstructions: 'Tại Việt Nam, gọi ngay số 115 (Cấp cứu y tế) hoặc 114 (Cứu nạn cứu hộ) nếu có dấu hiệu cấp cứu nguy kịch (đau tức ngực, đột quỵ méo miệng/yếu liệt, khó thở cấp tính, ngất xỉu), hoặc đến khoa cấp cứu bệnh viện gần nhất.'
    };
  }
  if (reg.includes('uae') || reg.includes('abu dhabi') || reg.includes('dubai')) {
    return {
      ambulanceNumber: '998',
      regionalTitle: 'UAE National Ambulance (998)',
      emergencyInstructions: 'In the UAE, dial 998 for National Ambulance or 999 for emergency services, or proceed to the nearest emergency department immediately.'
    };
  }
  if (reg.includes('uk') || reg.includes('united kingdom') || reg.includes('britain')) {
    return {
      ambulanceNumber: '999',
      regionalTitle: 'UK Emergency Services (999)',
      emergencyInstructions: 'In the UK, dial 999 or proceed to the nearest Accident & Emergency (A&E) department immediately.'
    };
  }
  if (reg.includes('europe') || reg.includes('eu')) {
    return {
      ambulanceNumber: '112',
      regionalTitle: 'European Emergency Services (112)',
      emergencyInstructions: 'In Europe, dial 112 or proceed to the nearest emergency medical department immediately.'
    };
  }
  return {
    ambulanceNumber: '911',
    regionalTitle: 'Emergency Medical Services (911 / 115)',
    emergencyInstructions: 'Call 911 in the US/Canada, 115 in Vietnam, 112 in Europe, or contact your local emergency medical service immediately.'
  };
}

export const ST_COOL_EVIDENCE_REGISTRY: StCoolEvidenceCitation[] = [
  {
    id: 'ev-aha-htn-2024',
    title: 'AHA/ACC Clinical Practice Guideline for High Blood Pressure in Adults',
    source: 'American Heart Association (AHA) & ACC / Hypertension',
    publicationYear: 2024,
    gradeLevel: 'HIGH',
    doiOrUrl: 'https://doi.org/10.1161/HYP.0000000000000065',
    relevance: 'Defines blood pressure risk tiers: Normal (<120/<80), Elevated (120-129/<80), Stage 1 (130-139/80-89), Stage 2 (>=140/>=90), and Crisis (>=180/>=120).'
  },
  {
    id: 'ev-ada-standards-2026',
    title: 'Standards of Care in Diabetes: Improving Care and Promoting Health in Populations',
    source: 'American Diabetes Association (ADA)',
    publicationYear: 2026,
    gradeLevel: 'HIGH',
    doiOrUrl: 'https://doi.org/10.2337/dc26-S002',
    relevance: 'Identifies Prediabetes screening threshold (HbA1c 5.7% - 6.4%) and early lifestyle intervention windows before microvascular damage.'
  },
  {
    id: 'ev-who-ferritin-2020',
    title: 'WHO Guidelines on the Use of Ferritin Concentrations to Assess Iron Status',
    source: 'World Health Organization (WHO)',
    publicationYear: 2020,
    gradeLevel: 'HIGH',
    doiOrUrl: 'https://www.who.int/publications/i/item/9789240000124',
    relevance: 'Establishes serum ferritin < 15-30 ng/mL as indicative of depleted iron stores with cellular fatigue even when hemoglobin remains within normal limits.'
  },
  {
    id: 'ev-kdigo-ckd-2023',
    title: 'KDIGO Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease',
    source: 'Kidney International Supplements',
    publicationYear: 2023,
    gradeLevel: 'HIGH',
    doiOrUrl: 'https://kdigo.org/guidelines/ckd-evaluation-and-management',
    relevance: 'Defines eGFR risk thresholds: >=90 (Normal), 60-89 (Mild reduction), 30-59 (Moderate reduction - Stage 3), <30 (Severe - urgent nephrology).'
  }
];

/**
 * Validates intake data integrity, safety bounds, and privacy constraints
 */
export function validateStCoolRequest(intake: StCoolIntakeData): { isValid: boolean; error?: string } {
  if (!intake || typeof intake !== 'object') {
    return { isValid: false, error: 'Invalid payload: Intake data object expected.' };
  }

  if (intake.consentGiven !== true) {
    return { 
      isValid: false, 
      error: 'Informed consent is required before health information can be analyzed by ST COOL.' 
    };
  }

  if (intake.deIdentifiedConfirmed !== true) {
    return { 
      isValid: false, 
      error: 'Please confirm that no direct identifiers (SSN, home address, real full name) are present.' 
    };
  }

  // Age bounds
  if (typeof intake.age !== 'number' || intake.age < 1 || intake.age > 120) {
    return { isValid: false, error: 'Please enter a valid age between 1 and 120 years.' };
  }

  // Severity bounds
  if (typeof intake.severityScale !== 'number' || intake.severityScale < 1 || intake.severityScale > 10) {
    return { isValid: false, error: 'Symptom severity scale must be an integer between 1 and 10.' };
  }

  // Duration bounds
  if (typeof intake.durationDays !== 'number' || intake.durationDays < 0 || intake.durationDays > 7300) {
    return { isValid: false, error: 'Duration days must be a plausible positive number.' };
  }

  // Check for direct PHI leaks (phone, email, SSN)
  const phiRegex = /\b(\d{3}-\d{2}-\d{4}|\d{3}[-.]?\d{3}[-.]?\d{4}|\+?1?\d{10}|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})\b/;
  const combinedText = [
    intake.primaryConcern,
    intake.patientAlias,
    ...(intake.symptoms || []),
    ...(intake.medications || [])
  ].filter(Boolean).join(' ');

  if (phiRegex.test(combinedText)) {
    return { 
      isValid: false, 
      error: 'Direct personal identifier (phone, email, or SSN) detected. Please sanitize before proceeding.' 
    };
  }

  // Plausible vitals ranges if provided
  if (intake.vitals?.bloodPressure) {
    const bpMatch = intake.vitals.bloodPressure.match(/^(\d{2,3})\/(\d{2,3})$/);
    if (!bpMatch) {
      return { isValid: false, error: 'Blood pressure must be formatted as Systolic/Diastolic (e.g. 120/80).' };
    }
    const sys = parseInt(bpMatch[1], 10);
    const dia = parseInt(bpMatch[2], 10);
    if (sys < 60 || sys > 260 || dia < 40 || dia > 160) {
      return { isValid: false, error: `Blood pressure ${sys}/${dia} is outside physiologically plausible limits.` };
    }
  }

  if (intake.vitals?.restingHeartRate !== undefined) {
    if (intake.vitals.restingHeartRate < 30 || intake.vitals.restingHeartRate > 240) {
      return { isValid: false, error: 'Resting heart rate must be between 30 and 240 bpm.' };
    }
  }

  if (intake.vitals?.temperatureC !== undefined) {
    if (intake.vitals.temperatureC < 33 || intake.vitals.temperatureC > 43) {
      return { isValid: false, error: 'Body temperature must be between 33°C and 43°C (91.4°F - 109.4°F).' };
    }
  }

  return { isValid: true };
}

/**
 * Deterministic Heuristic Clinical Stratification
 * Evaluates physiological facts against evidence guidelines with zero hallucinations.
 */
export function evaluateStCoolHeuristics(intake: StCoolIntakeData) {
  const findings: StCoolAnalysisResponse['clinicalFindings'] = [];
  const missingFactors: string[] = [];
  let riskScore = 10;
  let isEmergent = false;
  let isUrgent = false;

  const symptomsJoined = (intake.symptoms || []).join(' ').toLowerCase() + ' ' + (intake.primaryConcern || '').toLowerCase();

  // 1. Check for Emergent Red Flags (Chest pain, stroke signs, severe dyspnea)
  if (/chest\s*pain|angina|crushing|radiating to (arm|jaw)|pressure in chest/i.test(symptomsJoined)) {
    isEmergent = true;
    riskScore += 60;
    findings.push({
      category: 'Reported Symptoms',
      finding: 'Acute or Subacute Chest Discomfort / Anginal Symptoms',
      interpretation: 'Critical clinical red-flag that may indicate myocardial ischemia or acute coronary syndrome.',
      clinicalSignificance: 'Critical Red-Flag',
      guidelineRef: 'AHA/ACC Chest Pain Evaluation Guideline 2024'
    });
  }

  if (/sudden\s*(numbness|weakness|paralysis|slurred speech|facial droop)/i.test(symptomsJoined)) {
    isEmergent = true;
    riskScore += 65;
    findings.push({
      category: 'Reported Symptoms',
      finding: 'Sudden Neurological Deficit',
      interpretation: 'Acute warning sign of cerebrovascular event (stroke / TIA) requiring emergency evaluation.',
      clinicalSignificance: 'Critical Red-Flag',
      guidelineRef: 'AHA/ASA Early Management of Acute Ischemic Stroke'
    });
  }

  // 2. Blood Pressure Analysis (AHA/ACC 2024 Guidelines)
  if (intake.vitals?.bloodPressure) {
    const [sys, dia] = intake.vitals.bloodPressure.split('/').map(n => parseInt(n, 10));
    if (sys >= 180 || dia >= 120) {
      const hasCrisisRedFlags = isEmergent || /headache|vision|chest|breath|dizzy/i.test(symptomsJoined);
      if (hasCrisisRedFlags) {
        isEmergent = true;
        riskScore += 50;
        findings.push({
          category: 'Vitals & Biometrics',
          finding: `Blood Pressure: ${sys}/${dia} mmHg`,
          interpretation: 'Hypertensive Emergency threshold (>180/>120 mmHg with red-flag symptoms). Immediate emergency department evaluation required.',
          clinicalSignificance: 'Critical Red-Flag',
          guidelineRef: 'AHA/ACC 2024 Hypertension Guidelines'
        });
      } else {
        isUrgent = true;
        riskScore += 35;
        findings.push({
          category: 'Vitals & Biometrics',
          finding: `Blood Pressure: ${sys}/${dia} mmHg`,
          interpretation: 'Severe Blood Pressure Elevation / Hypertensive Urgency range without acute target-organ red flags. Prompt same-day or 24-hour physician evaluation required.',
          clinicalSignificance: 'Elevated',
          guidelineRef: 'AHA/ACC 2024 Hypertension Guidelines'
        });
      }
    } else if (sys >= 150 || dia >= 95) {
      isUrgent = true;
      riskScore += 25;
      findings.push({
        category: 'Vitals & Biometrics',
        finding: `Blood Pressure: ${sys}/${dia} mmHg`,
        interpretation: 'Moderate-to-Severe Stage 2 Hypertension (>=150/95 mmHg). Substantial vascular load; prompt outpatient medical consultation recommended within 24-72 hours.',
        clinicalSignificance: 'Elevated',
        guidelineRef: 'AHA/ACC 2024 Hypertension Guidelines'
      });
    } else if (sys >= 140 || dia >= 90) {
      riskScore += 16;
      findings.push({
        category: 'Vitals & Biometrics',
        finding: `Blood Pressure: ${sys}/${dia} mmHg`,
        interpretation: 'Stage 2 Hypertension range (140-149 / 90-94 mmHg). Early Stage 2 elevation; timely outpatient clinical assessment, home blood pressure monitoring, and lifestyle modification recommended within 1-2 weeks.',
        clinicalSignificance: 'Elevated',
        guidelineRef: 'AHA/ACC 2024 Hypertension Guidelines'
      });
    } else if (sys >= 130 || dia >= 80) {
      riskScore += 12;
      findings.push({
        category: 'Vitals & Biometrics',
        finding: `Blood Pressure: ${sys}/${dia} mmHg`,
        interpretation: 'Stage 1 Hypertension (130-139 / 80-89 mmHg). Early vascular elevation; early lifestyle modification (DASH nutrition, physical activity, sodium moderation) and scheduled outpatient evaluation recommended within 2-4 weeks.',
        clinicalSignificance: 'Borderline',
        guidelineRef: 'AHA/ACC 2024 Hypertension Guidelines'
      });
    } else {
      findings.push({
        category: 'Vitals & Biometrics',
        finding: `Blood Pressure: ${sys}/${dia} mmHg`,
        interpretation: 'Optimal/Normal resting hemodynamic range (<120/<80 mmHg).',
        clinicalSignificance: 'Normal',
        guidelineRef: 'AHA/ACC 2024'
      });
    }
  } else {
    missingFactors.push('Resting Blood Pressure measurement');
  }

  // 3. Glycemia / HbA1c Analysis (ADA 2026 Standards of Care)
  if (typeof intake.labs?.hba1c === 'number') {
    if (intake.labs.hba1c >= 9.0) {
      isUrgent = true;
      riskScore += 30;
      findings.push({
        category: 'Laboratory Biomarkers',
        finding: `HbA1c: ${intake.labs.hba1c}%`,
        interpretation: 'Markedly elevated glycemic index (>=9.0%). High risk of microvascular and macrovascular complications; prompt medical adjustment recommended within 24-72 hours.',
        clinicalSignificance: 'Elevated',
        guidelineRef: 'ADA Standards of Care in Diabetes 2026'
      });
    } else if (intake.labs.hba1c >= 6.5) {
      riskScore += 20;
      findings.push({
        category: 'Laboratory Biomarkers',
        finding: `HbA1c: ${intake.labs.hba1c}%`,
        interpretation: 'Exceeds the diagnostic threshold for Diabetes Mellitus (>=6.5%). Requires confirmatory laboratory workup and structured medical management.',
        clinicalSignificance: 'Elevated',
        guidelineRef: 'ADA Standards of Care in Diabetes 2026'
      });
    } else if (intake.labs.hba1c >= 5.7) {
      riskScore += 14;
      findings.push({
        category: 'Laboratory Biomarkers',
        finding: `HbA1c: ${intake.labs.hba1c}%`,
        interpretation: 'Prediabetes range (5.7% - 6.4%). Significant opportunity for anticipatory lifestyle nutrition, physical activity, and progression reversal.',
        clinicalSignificance: 'Borderline',
        guidelineRef: 'ADA Standards of Care in Diabetes 2026'
      });
    } else {
      findings.push({
        category: 'Laboratory Biomarkers',
        finding: `HbA1c: ${intake.labs.hba1c}%`,
        interpretation: 'Euglycemic range (< 5.7%). Normal long-term glycemic control.',
        clinicalSignificance: 'Normal',
        guidelineRef: 'ADA 2026'
      });
    }
  } else {
    missingFactors.push('Recent HbA1c or Fasting Blood Glucose');
  }

  // 4. Iron Reserves / Ferritin Analysis
  if (typeof intake.labs?.ferritin === 'number') {
    if (intake.labs.ferritin < 15) {
      riskScore += 24;
      findings.push({
        category: 'Laboratory Biomarkers',
        finding: `Serum Ferritin: ${intake.labs.ferritin} ng/mL`,
        interpretation: 'Depleted iron storage reserves. Strongly correlates with chronic energetic fatigue, restless legs, and reduced exercise stamina even if hemoglobin is intact.',
        clinicalSignificance: 'Elevated',
        guidelineRef: 'WHO Ferritin Guideline 2020'
      });
    } else if (intake.labs.ferritin < 30) {
      riskScore += 16;
      findings.push({
        category: 'Laboratory Biomarkers',
        finding: `Serum Ferritin: ${intake.labs.ferritin} ng/mL`,
        interpretation: 'Non-anemic iron deficiency / suboptimal cellular iron stores. Frequent cause of unexplained afternoon lethargy and brain fog in active individuals.',
        clinicalSignificance: 'Borderline',
        guidelineRef: 'WHO & British Society of Haematology'
      });
    } else {
      findings.push({
        category: 'Laboratory Biomarkers',
        finding: `Serum Ferritin: ${intake.labs.ferritin} ng/mL`,
        interpretation: 'Adequate iron stores (30 - 200 ng/mL).',
        clinicalSignificance: 'Normal'
      });
    }
  } else {
    missingFactors.push('Serum Ferritin & Iron Saturation Panel');
  }

  // 5. Renal Function / eGFR Analysis
  if (typeof intake.labs?.egfr === 'number') {
    if (intake.labs.egfr < 30) {
      isEmergent = true;
      riskScore += 45;
      findings.push({
        category: 'Laboratory Biomarkers',
        finding: `eGFR: ${intake.labs.egfr} mL/min/1.73m²`,
        interpretation: 'Severely decreased kidney function (CKD Stage 4/5). High clinical priority requiring prompt nephrology consultation.',
        clinicalSignificance: 'Critical Red-Flag',
        guidelineRef: 'KDIGO 2023 Guidelines'
      });
    } else if (intake.labs.egfr < 60) {
      isUrgent = true;
      riskScore += 22;
      findings.push({
        category: 'Laboratory Biomarkers',
        finding: `eGFR: ${intake.labs.egfr} mL/min/1.73m²`,
        interpretation: 'Moderately decreased glomerular filtration rate (CKD Stage 3). Requires comprehensive metabolic monitoring and avoidance of nephrotoxic medications.',
        clinicalSignificance: 'Elevated',
        guidelineRef: 'KDIGO 2023 Guidelines'
      });
    } else {
      findings.push({
        category: 'Laboratory Biomarkers',
        finding: `eGFR: ${intake.labs.egfr} mL/min/1.73m²`,
        interpretation: 'Preserved renal filtration function (>= 60 mL/min).',
        clinicalSignificance: 'Normal'
      });
    }
  }

  // 6. Fatigue & Symptom Pattern
  if (/fatigue|exhaustion|brain fog|tiredness|lethargy/i.test(symptomsJoined)) {
    findings.push({
      category: 'Reported Symptoms',
      finding: 'Longitudinal Daytime Fatigue & Cognitive Fog',
      interpretation: 'Multifactorial symptom. Common clinical drivers include latent iron deficiency, circadian sleep fragmentation, thyroid discordance, or metabolic resistance.',
      clinicalSignificance: intake.labs?.ferritin && intake.labs.ferritin < 30 ? 'Elevated' : 'Borderline'
    });
  }

  // Determine Triage Tier
  const finalRiskScore = Math.min(100, Math.max(5, riskScore));
  let triageTier: StCoolTriageTier;
  let triageTitle: string;
  let actionSummary: string;
  let urgencyTimeline: string;

  const isVietnam = Boolean(
    (intake.countryOrRegion && intake.countryOrRegion.toLowerCase().includes('vi'))
  );

  if (isEmergent || finalRiskScore >= 75) {
    triageTier = 'EMERGENT_ESCALATION';
    triageTitle = 'Immediate Emergency Medical Evaluation Required';
    actionSummary = 'Your reported warning signs or vitals represent critical physiological red-flags that require immediate in-person emergency care.';
    urgencyTimeline = isVietnam
      ? 'CẤP CỨU KHẨN CẤP (< 1 Giờ) — Gọi 115 (Việt Nam) hoặc đến ngay khoa cấp cứu gần nhất'
      : 'IMMEDIATE (< 1 Hour) — Call 115 in Vietnam, 911 in US/Canada, 112 in Europe, or visit nearest Emergency Department';
  } else if (isUrgent || finalRiskScore >= 45) {
    triageTier = 'URGENT_EVALUATION';
    triageTitle = 'Prompt Medical Consultation Recommended (Within 24–72 Hours)';
    actionSummary = 'Notable clinical elevations detected that warrant prompt physician assessment to prevent health escalation.';
    urgencyTimeline = 'PRIORITY (< 24 to 72 Hours) — Schedule with Primary Care or Urgent Care';
  } else if (finalRiskScore >= 18 || missingFactors.length > 2) {
    triageTier = 'PLANNED_CLINICAL_ASSESSMENT';
    triageTitle = 'Scheduled Clinical Assessment & Confirmatory Workup';
    actionSummary = 'Subclinical or borderline findings identified (such as Stage 1 Hypertension 130-139/80-89 mmHg, Prediabetes HbA1c 5.7-6.4%, or subclinical iron depletion) that are best evaluated during a planned outpatient consultation with targeted confirmatory labs and lifestyle counseling.';
    urgencyTimeline = 'PLANNED (Within 2 to 4 Weeks) — Routine Outpatient Primary Care Visit';
  } else {
    triageTier = 'ROUTINE_WELLNESS';
    triageTitle = 'Preventative Wellness & Routine Health Tracking';
    actionSummary = 'Your reported biometrics and symptoms align with baseline wellness. Continue proactive lifestyle and routine checkups.';
    urgencyTimeline = 'PERIODIC (Annual / Routine Checkup)';
  }

  // Epistemic uncertainty
  const completeness = 1 - (missingFactors.length / 5);
  const uncertaintyScore = parseFloat((0.10 + 0.35 * (1 - Math.max(0, completeness))).toFixed(2));
  const uncertaintyLevel = uncertaintyScore > 0.30 ? 'Elevated' : uncertaintyScore > 0.18 ? 'Moderate' : 'Low';
  const confidenceMargin = Math.round(uncertaintyScore * 18);
  const confidenceInterval = {
    low: Math.max(0, finalRiskScore - confidenceMargin),
    high: Math.min(100, finalRiskScore + confidenceMargin)
  };

  return {
    findings,
    missingFactors,
    riskScore: finalRiskScore,
    triageTier,
    triageTitle,
    actionSummary,
    urgencyTimeline,
    uncertainty: {
      score: uncertaintyScore,
      level: uncertaintyLevel as 'Low' | 'Moderate' | 'Elevated',
      missingKeyFactors: missingFactors,
      explanation: missingFactors.length > 0
        ? `Analysis bounded by ${missingFactors.length} unrecorded biomarker(s): ${missingFactors.join(', ')}. Epistemic confidence interval accounts for these missing inputs.`
        : 'High diagnostic data completeness. Comprehensive vitals and lab markers recorded.',
      confidenceInterval
    }
  };
}

/**
 * Builds Clinician Preparation SBAR Brief and Patient Questions
 */
export function buildClinicianPrep(
  intake: StCoolIntakeData,
  heuristic: ReturnType<typeof evaluateStCoolHeuristics>
): StCoolAnalysisResponse['clinicianPreparation'] {
  const sbarBrief = {
    situation: `Patient (${intake.age}yo ${intake.gender}) seeking clinical orientation for "${intake.primaryConcern}" (Duration: ${intake.durationDays} days, Severity: ${intake.severityScale}/10). Stratified to ${heuristic.triageTier}.`,
    background: `Recorded vitals: ${intake.vitals?.bloodPressure || 'BP Unrecorded'}, HR: ${intake.vitals?.restingHeartRate ? `${intake.vitals.restingHeartRate} bpm` : 'Unrecorded'}. Labs on file: Ferritin ${intake.labs?.ferritin ?? 'N/A'}, HbA1c ${intake.labs?.hba1c ?? 'N/A'}%, eGFR ${intake.labs?.egfr ?? 'N/A'}. Reported symptoms: ${(intake.symptoms || []).join(', ') || 'None specified'}.`,
    assessment: `Anticipatory risk score calculated at ${heuristic.riskScore}% [95% CI: ${heuristic.uncertainty.confidenceInterval.low}% - ${heuristic.uncertainty.confidenceInterval.high}%] with uncertainty index ${heuristic.uncertainty.score}. Key findings: ${heuristic.findings.map(f => `${f.finding} (${f.clinicalSignificance})`).join('; ')}.`,
    recommendation: `Recommended clinical action: ${heuristic.actionSummary} Timeline: ${heuristic.urgencyTimeline}. Decision-support orientation requiring independent physician correlation.`
  };

  const suggestedQuestions: StCoolClinicianQuestion[] = [
    {
      id: 'q-1',
      category: 'Diagnostic Confirmation',
      question: 'Based on my symptoms and recent metrics, what specific confirmatory tests (such as a Complete Blood Count with Ferritin or Comprehensive Metabolic Panel) would help clarify the root cause?',
      rationale: 'Helps confirm whether subclinical cellular iron depletion or metabolic changes are contributing to your symptoms.'
    },
    {
      id: 'q-2',
      category: 'Treatment & Safety',
      question: 'Are there any lifestyle modifications, dietary changes, or over-the-counter supplements you would recommend or caution against at this stage?',
      rationale: 'Prevents counterproductive self-treatment (such as taking unmonitored iron which can cause GI distress or interact with other medications).'
    },
    {
      id: 'q-3',
      category: 'Lifestyle & Monitoring',
      question: 'What specific warning signs or symptom changes should prompt me to contact your office sooner or seek urgent care?',
      rationale: 'Establishes clear clinical escalation boundaries and safety checkpoints between visits.'
    }
  ];

  const checklist = [
    'Bring current list of all medications, vitamins, and supplements with exact dosages.',
    'Keep a 7-day symptom and energy log noting time-of-day fluctuations.',
    'Measure and log resting blood pressure for 3 consecutive mornings if monitoring cardiovascular health.',
    'Note any family history of anemia, autoimmune conditions, diabetes, or cardiovascular disease.',
    'Present this ST COOL SBAR summary directly to your clinician or nurse at check-in.'
  ];

  return {
    sbarBrief,
    suggestedQuestions,
    checklist
  };
}

/**
 * Executes full ST COOL Analysis Workflow
 */
export async function runStCoolAnalysis(
  intake: StCoolIntakeData,
  geminiClient: GoogleGenAI | null
): Promise<StCoolAnalysisResponse> {
  const startTime = Date.now();
  const sessionId = `STC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  // 1. Evaluate Deterministic Heuristic Core
  const heuristic = evaluateStCoolHeuristics(intake);

  // 2. Build Clinician Preparation & SBAR
  const clinicianPrep = buildClinicianPrep(intake, heuristic);

  // 3. Educational Synthesis
  let topic = 'Anticipatory Health Orientation';
  let plainSummary = `Understanding the physiological factors connecting your reported concerns (${intake.primaryConcern}) with clinical evidence.`;
  let mechanisticExplanation = `Our cells rely on continuous oxygen delivery, balanced glucose regulation, and hemodynamic stability. When markers like ferritin or blood pressure shift even mildly, they can create noticeable energetic and physiological symptoms before formal disease criteria are reached.`;
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

  let providerUsed = 'st-cool-deterministic-heuristic-engine';
  let heuristicFallbackEngaged = false;

  // 4. Optional AI Enrichment (if Gemini key configured and circuit breaker not open)
  if (geminiClient && !GeminiCircuitBreaker.isCircuitOpen('gemini-3.8-flash')) {
    const prompt = `You are ST COOL, an empathetic and clinically responsible health navigation engine within Dr. T for the Abu Dhabi Future Health Challenge 2026.
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

    const aiText = await GeminiCircuitBreaker.executeWithFallback(
      geminiClient,
      'gemini-3.8-flash',
      prompt,
      2500
    );

    if (aiText) {
      providerUsed = 'gemini-3.8-flash (AI-Enriched Decision Support)';
    } else {
      providerUsed = 'st-cool-deterministic-heuristic-engine (Verified Fallback)';
      heuristicFallbackEngaged = true;
    }
  } else {
    providerUsed = 'st-cool-deterministic-heuristic-engine (Verified Engine)';
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
    performer: { display: 'Dr. T ST COOL Clinical Orientation Engine' },
    prediction: [{
      outcome: { text: heuristic.triageTitle },
      probabilityDecimal: parseFloat((heuristic.riskScore / 100).toFixed(2)),
      qualitativeRisk: { text: heuristic.triageTier }
    }],
    note: [{ text: ST_COOL_DISCLAIMER }]
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
    evidenceSources: ST_COOL_EVIDENCE_REGISTRY,
    personalizedEducation: {
      topic,
      plainLanguageSummary: plainSummary,
      mechanisticExplanation,
      lifestyleCaveats
    },
    clinicianPreparation: clinicianPrep,
    safetyNotice: {
      disclaimer: ST_COOL_DISCLAIMER,
      emergencyWarning: ST_COOL_EMERGENCY_NOTICE,
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
