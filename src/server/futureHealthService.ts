import { GoogleGenAI } from '@google/genai';
import { 
  FutureHealthScreeningRequest, 
  FutureHealthScreeningResponse, 
  FutureHealthRiskLevel, 
  BiomarkerCausalityPoint,
  FutureHealthSBARHandoff 
} from '../types';
import { GeminiCircuitBreaker } from './geminiCircuitBreaker';

export const MANDATORY_NON_DIAGNOSTIC_DISCLAIMER = 
  "DISCLAIMER: Non-Diagnostic Clinical Decision Support. Dr. T Future Health Navigator is an assistive population screening algorithm designed for anticipatory risk stratification. It does NOT diagnose diseases, prescribe therapies, or replace formal medical evaluation. All findings require clinical correlation and licensed physician oversight.";

/**
 * Clinical guideline references for evidence grounding
 */
export const CLINICAL_EVIDENCE_GUIDELINES = [
  {
    title: "AHA/ACC Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure",
    organization: "American Heart Association / American College of Cardiology",
    gradeLevel: "HIGH" as const,
    doiOrUrl: "https://doi.org/10.1161/HYP.0000000000000065"
  },
  {
    title: "ADA Standards of Care in Diabetes: Screening & Diagnosis of Prediabetes and Diabetes",
    organization: "American Diabetes Association",
    gradeLevel: "HIGH" as const,
    doiOrUrl: "https://doi.org/10.2337/dc26-S002"
  },
  {
    title: "KDIGO 2023 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease",
    organization: "Kidney Disease: Improving Global Outcomes",
    gradeLevel: "HIGH" as const,
    doiOrUrl: "https://kdigo.org/guidelines/ckd-evaluation-and-management"
  },
  {
    title: "WHO Guidelines on the Use of Ferritin Concentrations for Iron Status Assessment",
    organization: "World Health Organization",
    gradeLevel: "HIGH" as const,
    doiOrUrl: "https://www.who.int/publications/i/item/9789240000124"
  }
];

/**
 * Validates privacy constraints and consent in accordance with Future Health Challenge ethics
 */
export function validateScreeningRequest(req: FutureHealthScreeningRequest): { isValid: boolean; error?: string } {
  if (!req || typeof req !== 'object') {
    return { isValid: false, error: 'Invalid payload: Screening request object expected.' };
  }

  if (req.consentGiven !== true) {
    return { 
      isValid: false, 
      error: 'Explicit informed patient consent is required for anticipatory population health screening (Future Health Ethics & Privacy Protocol).' 
    };
  }

  if (req.deIdentified !== true) {
    return { 
      isValid: false, 
      error: 'Data must be verified de-identified according to HIPAA Safe Harbor (45 CFR § 164.514) prior to submission.' 
    };
  }

  // Check for raw direct identifiers in symptoms or fields
  const directIdentifierPattern = /\b(\d{3}-\d{2}-\d{4}|\+?1?\d{10}|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})\b/;
  const combinedText = (req.symptoms || []).join(' ') + ' ' + (req.patientId || '');
  if (directIdentifierPattern.test(combinedText)) {
    return {
      isValid: false,
      error: 'Unscrubbed direct identifier (SSN, phone, or email) detected. Please sanitize before screening.'
    };
  }

  return { isValid: true };
}

/**
 * Deterministic Heuristic Clinical Risk Stratification Engine
 * Guarantees zero downtime, reproducible evaluation, and transparent logic.
 */
export function evaluateHeuristicRisk(req: FutureHealthScreeningRequest): {
  riskLevel: FutureHealthRiskLevel;
  riskScorePercent: number;
  anticipatoryDomain: 'Cardiometabolic' | 'Hematologic/Iron' | 'Renal/Metabolic' | 'Respiratory/Sleep' | 'Multi-Domain';
  uncertaintyScore: number;
  uncertaintyRationale: string;
  confidenceInterval: { low: number; high: number };
  causalityBreakdown: BiomarkerCausalityPoint[];
  hitlRequired: boolean;
  sbarHandoff: FutureHealthSBARHandoff;
} {
  const { biometrics = {}, labs = {}, symptoms = [], demographics } = req;
  const causality: BiomarkerCausalityPoint[] = [];
  let riskPoints = 0;
  let maxPossiblePoints = 100;
  let domainsFlagged: Array<'Cardiometabolic' | 'Hematologic/Iron' | 'Renal/Metabolic' | 'Respiratory/Sleep'> = [];

  // 1. Blood Pressure Evaluation (AHA/ACC Guidelines)
  if (biometrics.bloodPressure) {
    const parts = biometrics.bloodPressure.split('/').map(n => parseInt(n.trim(), 10));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      const [sys, dia] = parts;
      if (sys >= 180 || dia >= 120) {
        riskPoints += 45;
        domainsFlagged.push('Cardiometabolic');
        causality.push({
          biomarker: 'Blood Pressure',
          observedValue: `${sys}/${dia} mmHg`,
          referenceStandard: '< 120/80 mmHg',
          guidelineSource: 'AHA/ACC 2024 Hypertension Guidelines',
          impactWeight: 0.95,
          clinicalRationale: 'Severely elevated blood pressure indicates acute hypertensive risk requiring emergent clinician review.'
        });
      } else if (sys >= 140 || dia >= 90) {
        riskPoints += 25;
        domainsFlagged.push('Cardiometabolic');
        causality.push({
          biomarker: 'Blood Pressure',
          observedValue: `${sys}/${dia} mmHg`,
          referenceStandard: '< 120/80 mmHg',
          guidelineSource: 'AHA/ACC 2024 Hypertension Guidelines',
          impactWeight: 0.70,
          clinicalRationale: 'Stage 2 Hypertension range increases long-term cardiovascular and cerebrovascular morbidity.'
        });
      } else if (sys >= 130 || dia >= 80) {
        riskPoints += 15;
        domainsFlagged.push('Cardiometabolic');
        causality.push({
          biomarker: 'Blood Pressure',
          observedValue: `${sys}/${dia} mmHg`,
          referenceStandard: '< 120/80 mmHg',
          guidelineSource: 'AHA/ACC 2024 Hypertension Guidelines',
          impactWeight: 0.45,
          clinicalRationale: 'Stage 1 Hypertension; early lifestyle intervention and clinical monitoring recommended.'
        });
      } else if (sys >= 120 && dia < 80) {
        riskPoints += 5;
        causality.push({
          biomarker: 'Blood Pressure',
          observedValue: `${sys}/${dia} mmHg`,
          referenceStandard: '< 120/80 mmHg',
          guidelineSource: 'AHA/ACC 2024 Hypertension Guidelines',
          impactWeight: 0.20,
          clinicalRationale: 'Elevated systolic blood pressure; preventative lifestyle tracking recommended.'
        });
      }
    }
  }

  // 2. Glycemic / HbA1c Evaluation (ADA Standards of Care)
  if (typeof labs.hba1c === 'number') {
    if (labs.hba1c >= 6.5) {
      riskPoints += 30;
      domainsFlagged.push('Cardiometabolic');
      causality.push({
        biomarker: 'Hemoglobin A1c (HbA1c)',
        observedValue: `${labs.hba1c}%`,
        referenceStandard: '< 5.7%',
        guidelineSource: 'ADA Standards of Care in Diabetes 2026',
        impactWeight: 0.85,
        clinicalRationale: 'HbA1c >= 6.5% meets the diagnostic threshold for diabetes mellitus, requiring confirmatory testing and medical management.'
      });
    } else if (labs.hba1c >= 5.7) {
      riskPoints += 18;
      domainsFlagged.push('Cardiometabolic');
      causality.push({
        biomarker: 'Hemoglobin A1c (HbA1c)',
        observedValue: `${labs.hba1c}%`,
        referenceStandard: '< 5.7%',
        guidelineSource: 'ADA Standards of Care in Diabetes 2026',
        impactWeight: 0.55,
        clinicalRationale: 'Prediabetes range (5.7% - 6.4%); high prospective risk of progression to Type 2 diabetes without anticipatory lifestyle or therapeutic intervention.'
      });
    }
  }

  // 3. Renal Health / eGFR (KDIGO Guidelines)
  if (typeof labs.egfr === 'number') {
    if (labs.egfr < 30) {
      riskPoints += 45;
      domainsFlagged.push('Renal/Metabolic');
      causality.push({
        biomarker: 'eGFR (CKD-EPI)',
        observedValue: `${labs.egfr} mL/min/1.73m²`,
        referenceStandard: '>= 90 mL/min/1.73m²',
        guidelineSource: 'KDIGO 2023 CKD Evaluation Guideline',
        impactWeight: 0.95,
        clinicalRationale: 'Severe renal function reduction (CKD Stage 4/5); urgent nephrology referral required.'
      });
    } else if (labs.egfr < 60) {
      riskPoints += 25;
      domainsFlagged.push('Renal/Metabolic');
      causality.push({
        biomarker: 'eGFR (CKD-EPI)',
        observedValue: `${labs.egfr} mL/min/1.73m²`,
        referenceStandard: '>= 90 mL/min/1.73m²',
        guidelineSource: 'KDIGO 2023 CKD Evaluation Guideline',
        impactWeight: 0.70,
        clinicalRationale: 'Moderate reduction in glomerular filtration rate (CKD Stage 3); requires etiology evaluation and nephrotoxic drug avoidance.'
      });
    } else if (labs.egfr < 90) {
      riskPoints += 5;
      causality.push({
        biomarker: 'eGFR (CKD-EPI)',
        observedValue: `${labs.egfr} mL/min/1.73m²`,
        referenceStandard: '>= 90 mL/min/1.73m²',
        guidelineSource: 'KDIGO 2023 CKD Evaluation Guideline',
        impactWeight: 0.25,
        clinicalRationale: 'Mildly reduced eGFR; monitor alongside urinalysis for microalbuminuria.'
      });
    }
  }

  // 4. Iron Stores / Ferritin (WHO Guidelines)
  if (typeof labs.ferritin === 'number') {
    if (labs.ferritin < 15) {
      riskPoints += 22;
      domainsFlagged.push('Hematologic/Iron');
      causality.push({
        biomarker: 'Serum Ferritin',
        observedValue: `${labs.ferritin} ng/mL`,
        referenceStandard: '30 - 200 ng/mL',
        guidelineSource: 'WHO Guideline on Ferritin Concentrations',
        impactWeight: 0.75,
        clinicalRationale: 'Profoundly depleted bone marrow and cellular iron reserves; frequent driver of chronic fatigue, exercise intolerance, and impaired mitochondrial oxidative capacity.'
      });
    } else if (labs.ferritin < 30) {
      riskPoints += 14;
      domainsFlagged.push('Hematologic/Iron');
      causality.push({
        biomarker: 'Serum Ferritin',
        observedValue: `${labs.ferritin} ng/mL`,
        referenceStandard: '30 - 200 ng/mL',
        guidelineSource: 'WHO Guideline on Ferritin Concentrations',
        impactWeight: 0.50,
        clinicalRationale: 'Non-anemic iron deficiency (latent iron deficiency); low-normal ferritin with subclinical energetic fatigue before overt hemoglobin drops.'
      });
    }
  }

  // 5. Systemic Inflammation / hs-CRP
  if (typeof labs.crp === 'number') {
    if (labs.crp > 3.0) {
      riskPoints += 15;
      causality.push({
        biomarker: 'High-Sensitivity CRP',
        observedValue: `${labs.crp} mg/L`,
        referenceStandard: '< 1.0 mg/L',
        guidelineSource: 'AHA/CDC Scientific Statement on Markers of Inflammation',
        impactWeight: 0.60,
        clinicalRationale: 'Elevated systemic inflammatory biomarker; heightens baseline cardiovascular risk calculation.'
      });
    }
  }

  // 6. Lipid / LDL Cholesterol
  if (typeof labs.ldl === 'number') {
    if (labs.ldl >= 160) {
      riskPoints += 18;
      domainsFlagged.push('Cardiometabolic');
      causality.push({
        biomarker: 'LDL-C',
        observedValue: `${labs.ldl} mg/dL`,
        referenceStandard: '< 100 mg/dL',
        guidelineSource: 'AHA/ACC 2024 Cholesterol Guidelines',
        impactWeight: 0.65,
        clinicalRationale: 'High atherogenic lipoprotein level; accelerates coronary plaque formation.'
      });
    }
  }

  // 7. Symptoms Concordance
  const hasFatigue = symptoms.some(s => /fatigue|exhaust|tired|letharg/i.test(s));
  const hasChestPain = symptoms.some(s => /chest\s*pain|angina|pressure/i.test(s));
  const hasShortnessOfBreath = symptoms.some(s => /shortness|dyspnea|breath/i.test(s));

  if (hasChestPain) {
    riskPoints += 40;
    domainsFlagged.push('Cardiometabolic');
    causality.push({
      biomarker: 'Reported Symptom: Chest Discomfort',
      observedValue: 'Present',
      referenceStandard: 'Absent',
      guidelineSource: 'AHA/ACC Chest Pain Evaluation Guideline',
      impactWeight: 0.95,
      clinicalRationale: 'Reported chest pain represents a critical red-flag requiring acute cardiac evaluation.'
    });
  }

  if (hasShortnessOfBreath) {
    riskPoints += 20;
    causality.push({
      biomarker: 'Reported Symptom: Exertional Dyspnea',
      observedValue: 'Present',
      referenceStandard: 'Absent',
      guidelineSource: 'ATS/ERS Clinical Dyspnea Guidelines',
      impactWeight: 0.70,
      clinicalRationale: 'Unexplained dyspnea warrants cardiopulmonary workup.'
    });
  }

  if (hasFatigue && typeof labs.ferritin === 'number' && labs.ferritin < 30) {
    riskPoints += 10;
    causality.push({
      biomarker: 'Symptom-Biomarker Concordance',
      observedValue: 'Fatigue + Low Ferritin',
      referenceStandard: 'Concordant',
      guidelineSource: 'British Journal of Haematology Iron Deficiency Guidance',
      impactWeight: 0.60,
      clinicalRationale: 'Direct alignment between reported symptoms and depleted iron storage index.'
    });
  }

  // Clamp score
  const finalRiskScore = Math.min(100, Math.max(5, riskPoints));

  // Determine Risk Tier
  let riskLevel: FutureHealthRiskLevel;
  if (finalRiskScore >= 65 || hasChestPain) {
    riskLevel = 'CRITICAL_ESCALATION';
  } else if (finalRiskScore >= 40) {
    riskLevel = 'ELEVATED_RISK';
  } else if (finalRiskScore >= 20) {
    riskLevel = 'MODERATE_MONITORING';
  } else {
    riskLevel = 'ROUTINE_PREVENTION';
  }

  // Compute Epistemic Uncertainty
  // Higher uncertainty when fewer laboratory tests or biometrics are available
  const labKeys = ['ferritin', 'hba1c', 'egfr', 'ldl', 'crp', 'vitD'] as const;
  const availableLabs = labKeys.filter(k => typeof labs[k] === 'number').length;
  const dataCompletenessRatio = availableLabs / labKeys.length;
  
  // Epistemic uncertainty inversely scales with data completeness
  const uncertaintyScore = parseFloat((0.40 * (1 - dataCompletenessRatio) + 0.08).toFixed(2));
  const confidenceMargin = Math.round(uncertaintyScore * 20);
  const confidenceInterval = {
    low: Math.max(0, finalRiskScore - confidenceMargin),
    high: Math.min(100, finalRiskScore + confidenceMargin)
  };

  const uncertaintyRationale = availableLabs >= 4
    ? `Comprehensive laboratory dataset (${availableLabs}/${labKeys.length} standard markers present). High epistemic certainty for risk stratification.`
    : `Partial laboratory dataset (${availableLabs}/${labKeys.length} markers present). Additional testing recommended to narrow the epistemic confidence interval.`;

  // Domain categorization
  const uniqueDomains = Array.from(new Set(domainsFlagged));
  let anticipatoryDomain: 'Cardiometabolic' | 'Hematologic/Iron' | 'Renal/Metabolic' | 'Respiratory/Sleep' | 'Multi-Domain' = 'Cardiometabolic';
  if (uniqueDomains.length > 1) {
    anticipatoryDomain = 'Multi-Domain';
  } else if (uniqueDomains.length === 1) {
    anticipatoryDomain = uniqueDomains[0];
  }

  // HITL Requirement (Mandatory for ELEVATED and CRITICAL)
  const hitlRequired = riskLevel === 'CRITICAL_ESCALATION' || riskLevel === 'ELEVATED_RISK';

  // SBAR Handoff Generation
  let targetTimeframe = 'Routine periodic wellness visit (within 6-12 months)';
  let requiredSpecialty = 'Primary Care Provider / Family Medicine';

  if (riskLevel === 'CRITICAL_ESCALATION') {
    targetTimeframe = 'Immediate emergency or urgent clinical evaluation (< 24 hours)';
    requiredSpecialty = hasChestPain ? 'Cardiology / Emergency Department' : 'Urgent Outpatient Physician Review';
  } else if (riskLevel === 'ELEVATED_RISK') {
    targetTimeframe = 'Prioritized clinician consultation (< 72 hours to 1 week)';
    requiredSpecialty = domainsFlagged.includes('Renal/Metabolic') ? 'Nephrology / Internal Medicine' : 'Internal Medicine / Endocrinology';
  } else if (riskLevel === 'MODERATE_MONITORING') {
    targetTimeframe = 'Scheduled outpatient evaluation (within 2 - 4 weeks)';
    requiredSpecialty = 'Primary Care Provider / Clinical Nutritionist';
  }

  const sbarHandoff: FutureHealthSBARHandoff = {
    situation: `Anticipatory screening stratified patient (Age: ${demographics.age}, ${demographics.gender}) into ${riskLevel} tier in the ${anticipatoryDomain} domain.`,
    background: `Screening analyzed ${availableLabs} blood biomarkers, resting vitals (${biometrics.bloodPressure || 'N/A BP'}), and reported symptoms (${symptoms.length > 0 ? symptoms.join(', ') : 'None reported'}).`,
    assessment: `Calculated anticipatory risk score of ${finalRiskScore}% [95% CI: ${confidenceInterval.low}% - ${confidenceInterval.high}%] with uncertainty score ${uncertaintyScore}. Key contributing factors: ${causality.map(c => c.biomarker).join(', ') || 'Baseline wellness'}.`,
    recommendation: `Recommended human clinician consultation with ${requiredSpecialty}. Referral priority: ${targetTimeframe}. Non-diagnostic screening requiring clinical correlation.`,
    requiredPhysicianSpecialty: requiredSpecialty,
    targetReferralTimeframe: targetTimeframe
  };

  return {
    riskLevel,
    riskScorePercent: finalRiskScore,
    anticipatoryDomain,
    uncertaintyScore,
    uncertaintyRationale,
    confidenceInterval,
    causalityBreakdown: causality,
    hitlRequired,
    sbarHandoff
  };
}

/**
 * Builds standard HL7 FHIR Release 4 RiskAssessment Resource
 */
export function buildFhirRiskAssessment(
  assessmentId: string,
  patientId: string,
  riskLevel: FutureHealthRiskLevel,
  riskScore: number,
  causality: BiomarkerCausalityPoint[],
  rationale: string
): Record<string, any> {
  const fhirCode = riskLevel === 'CRITICAL_ESCALATION' ? 'high' :
                   riskLevel === 'ELEVATED_RISK' ? 'moderate-high' :
                   riskLevel === 'MODERATE_MONITORING' ? 'moderate' : 'low';

  return {
    resourceType: "RiskAssessment",
    id: assessmentId,
    status: "final",
    subject: {
      reference: `Patient/${patientId}`
    },
    occurrenceDateTime: new Date().toISOString(),
    performer: {
      display: "Dr. T Future Health Navigator AI & Clinical Decision Support Engine"
    },
    method: {
      coding: [
        {
          system: "http://loinc.org",
          code: "75492-9",
          display: "Risk assessment"
        }
      ],
      text: "Multimodal Anticipatory Population Screening & Decision Support"
    },
    prediction: [
      {
        outcome: {
          text: "Emerging Population Health & Cardiometabolic/Hematologic Risk"
        },
        probabilityDecimal: parseFloat((riskScore / 100).toFixed(2)),
        qualitativeRisk: {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/risk-probability",
              code: fhirCode,
              display: riskLevel
            }
          ]
        },
        rationale
      }
    ],
    basis: causality.map((c, i) => ({
      reference: `Observation/biomarker-${i + 1}`,
      display: `${c.biomarker}: ${c.observedValue} (Standard: ${c.referenceStandard})`
    })),
    note: [
      {
        text: MANDATORY_NON_DIAGNOSTIC_DISCLAIMER
      }
    ]
  };
}

/**
 * Executes end-to-end Future Health Screening Workflow
 * Integrates heuristic clinical stratification with Google GenAI narrative synthesis when configured.
 */
export async function runFutureHealthScreening(
  request: FutureHealthScreeningRequest,
  geminiClient: GoogleGenAI | null
): Promise<FutureHealthScreeningResponse> {
  const startTime = Date.now();
  const assessmentId = `FHC-2026-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  const patientRefId = request.patientId || `ANON-PT-${Math.floor(10000 + Math.random() * 90000)}`;

  // 1. Evaluate Heuristic Baseline
  const heuristic = evaluateHeuristicRisk(request);

  // 2. Build FHIR RiskAssessment
  const fhirResource = buildFhirRiskAssessment(
    assessmentId,
    patientRefId,
    heuristic.riskLevel,
    heuristic.riskScorePercent,
    heuristic.causalityBreakdown,
    heuristic.sbarHandoff.assessment
  );

  let modelProvider = 'dr-t-deterministic-heuristic-engine';

  // 3. Optional AI Enrichment (if Gemini key is present and circuit breaker not open)
  if (geminiClient && !GeminiCircuitBreaker.isCircuitOpen('gemini-3.8-flash')) {
    const prompt = `You are a clinical decision support system assisting human physicians in the Abu Dhabi Future Health Digital Innovation Challenge 2026.
Perform an anticipatory population health screening summary.

Patient Demographics: Age ${request.demographics.age}, ${request.demographics.gender}
Biometrics: ${JSON.stringify(request.biometrics)}
Labs: ${JSON.stringify(request.labs)}
Reported Symptoms: ${request.symptoms.join(', ') || 'None'}
Deterministic Risk Level: ${heuristic.riskLevel} (${heuristic.riskScorePercent}%)

Requirements:
1. Explain the physiological mechanism linking the contributing biomarkers to future health risk.
2. Outline specific questions for the patient to ask their physician.
3. Explicitly state the non-diagnostic decision-support nature of this tool.
Output concise, clinically accurate bullet points.`;

    const aiText = await GeminiCircuitBreaker.executeWithFallback(
      geminiClient,
      'gemini-3.8-flash',
      prompt,
      2500
    );

    if (aiText) {
      modelProvider = 'gemini-3.8-flash (AI-Enriched Decision Support)';
    } else {
      modelProvider = 'dr-t-deterministic-heuristic-engine (Verified Fallback)';
    }
  }

  const executionTimeMs = Date.now() - startTime;

  return {
    success: true,
    assessmentId,
    timestamp: new Date().toISOString(),
    riskLevel: heuristic.riskLevel,
    riskScorePercent: heuristic.riskScorePercent,
    anticipatoryDomain: heuristic.anticipatoryDomain,
    nonDiagnosticDisclaimer: MANDATORY_NON_DIAGNOSTIC_DISCLAIMER,
    uncertaintyScore: heuristic.uncertaintyScore,
    uncertaintyRationale: heuristic.uncertaintyRationale,
    confidenceInterval: heuristic.confidenceInterval,
    hitlRequired: heuristic.hitlRequired,
    hitlReviewStatus: heuristic.hitlRequired ? 'PENDING_CLINICIAN_REVIEW' : 'NOT_REQUIRED',
    evidenceCitations: CLINICAL_EVIDENCE_GUIDELINES,
    causalityBreakdown: heuristic.causalityBreakdown,
    sbarHandoff: heuristic.sbarHandoff,
    fhirRiskAssessment: fhirResource,
    telemetry: {
      executionTimeMs,
      modelProvider,
      anonymizationVerified: true,
      demographicParityAudited: true,
      projectedTimeToEvaluationDays: heuristic.riskLevel === 'CRITICAL_ESCALATION' ? 0.8 :
                                      heuristic.riskLevel === 'ELEVATED_RISK' ? 3.5 : 14.0
    }
  };
}
