/**
 * Future Health Digital Innovation Challenge 2026
 * Automated Invariant & End-to-End Verification Test Suite
 * Track: Population Health — Anticipatory Health Systems
 */

import { 
  validateScreeningRequest, 
  evaluateHeuristicRisk, 
  buildFhirRiskAssessment,
  MANDATORY_NON_DIAGNOSTIC_DISCLAIMER,
  CLINICAL_EVIDENCE_GUIDELINES
} from '../src/server/futureHealthService';
import { FutureHealthScreeningRequest } from '../src/types';

interface TestResult {
  name: string;
  passed: boolean;
  details?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, name: string, details?: string) {
  if (condition) {
    results.push({ name, passed: true, details });
    console.log(`  ✅ [PASS] ${name}`);
  } else {
    results.push({ name, passed: false, details: details || 'Assertion failed' });
    console.error(`  ❌ [FAIL] ${name} - ${details || 'Assertion failed'}`);
  }
}

console.log('\n======================================================');
console.log('🩺 DR. T — FUTURE HEALTH CHALLENGE VERIFICATION SUITE');
console.log('======================================================\n');

// ----------------------------------------------------
// Test 1: Consent & Privacy Guardrails
// ----------------------------------------------------
console.log('Test Group 1: Privacy by Design & Consent Enforcement');

const requestWithoutConsent: any = {
  demographics: { age: 35, gender: 'Male' },
  biometrics: {},
  labs: {},
  symptoms: [],
  consentGiven: false,
  deIdentified: true
};
const val1 = validateScreeningRequest(requestWithoutConsent);
assert(!val1.isValid && val1.error?.includes('Explicit informed patient consent is required'), 
  'Enforces explicit consent requirement');

const requestWithRawPhi: any = {
  demographics: { age: 35, gender: 'Male' },
  biometrics: {},
  labs: {},
  symptoms: ['Contact patient at john.doe@example.com for follow-up'],
  consentGiven: true,
  deIdentified: true
};
const val2 = validateScreeningRequest(requestWithRawPhi);
assert(!val2.isValid && val2.error?.includes('Unscrubbed direct identifier'), 
  'Detects and rejects unscrubbed direct identifiers (Email)');

const validSanitizedRequest: FutureHealthScreeningRequest = {
  patientId: 'ANON-PT-4829',
  demographics: { age: 35, gender: 'Male', ethnicity: 'Not Disclosed' },
  biometrics: { bloodPressure: '118/76', restingHeartRate: 64 },
  labs: { ferritin: 75, hba1c: 5.2, egfr: 102 },
  symptoms: [],
  consentGiven: true,
  deIdentified: true
};
const val3 = validateScreeningRequest(validSanitizedRequest);
assert(val3.isValid, 'Accepts properly de-identified request with explicit consent');

// ----------------------------------------------------
// Test 2: Multi-Tier Risk Stratification
// ----------------------------------------------------
console.log('\nTest Group 2: Multi-Tier Anticipatory Risk Stratification');

// Cohort A: Routine Baseline
const routineCase: FutureHealthScreeningRequest = {
  demographics: { age: 24, gender: 'Female' },
  biometrics: { bloodPressure: '112/70', restingHeartRate: 62 },
  labs: { ferritin: 80, hba1c: 5.0, egfr: 110, ldl: 85, crp: 0.4 },
  symptoms: [],
  consentGiven: true,
  deIdentified: true
};
const resRoutine = evaluateHeuristicRisk(routineCase);
assert(resRoutine.riskLevel === 'ROUTINE_PREVENTION' && resRoutine.riskScorePercent < 20,
  'Correctly stratifies healthy biometrics into ROUTINE_PREVENTION');
assert(!resRoutine.hitlRequired, 'Routine tier does not require urgent physician sign-off');

// Cohort B: Moderate Monitoring (Non-Anemic Iron Deficiency)
const moderateIronCase: FutureHealthScreeningRequest = {
  demographics: { age: 29, gender: 'Female' },
  biometrics: { bloodPressure: '116/74', restingHeartRate: 60 },
  labs: { ferritin: 18, hba1c: 5.2, egfr: 98 },
  symptoms: ['Fatigue'],
  consentGiven: true,
  deIdentified: true
};
const resModerate = evaluateHeuristicRisk(moderateIronCase);
assert(resModerate.riskLevel === 'MODERATE_MONITORING' && resModerate.anticipatoryDomain === 'Hematologic/Iron',
  'Correctly stratifies latent iron depletion into MODERATE_MONITORING tier');

// Cohort C: Elevated Risk (Stage 2 HTN + Prediabetes)
const elevatedCase: FutureHealthScreeningRequest = {
  demographics: { age: 48, gender: 'Male' },
  biometrics: { bloodPressure: '146/92', restingHeartRate: 76 },
  labs: { hba1c: 6.2, egfr: 85, ldl: 152 },
  symptoms: [],
  consentGiven: true,
  deIdentified: true
};
const resElevated = evaluateHeuristicRisk(elevatedCase);
assert(resElevated.riskLevel === 'ELEVATED_RISK' && resElevated.hitlRequired === true,
  'Correctly stratifies Stage 2 HTN + Prediabetes into ELEVATED_RISK with mandatory HITL gate');

// Cohort D: Critical Escalation (Hypertensive Crisis / Chest Pain)
const criticalCase: FutureHealthScreeningRequest = {
  demographics: { age: 60, gender: 'Male' },
  biometrics: { bloodPressure: '184/122', restingHeartRate: 94 },
  labs: { egfr: 45 },
  symptoms: ['Chest pain'],
  consentGiven: true,
  deIdentified: true
};
const resCritical = evaluateHeuristicRisk(criticalCase);
assert(resCritical.riskLevel === 'CRITICAL_ESCALATION' && resCritical.hitlRequired === true,
  'Correctly escalates hypertensive urgency + chest pain to CRITICAL_ESCALATION');

// ----------------------------------------------------
// Test 3: Epistemic Uncertainty & Confidence Intervals
// ----------------------------------------------------
console.log('\nTest Group 3: Epistemic Uncertainty & Statistical Bounds');

assert(
  resRoutine.uncertaintyScore >= 0.0 && resRoutine.uncertaintyScore <= 1.0,
  'Uncertainty score bounded in [0.0, 1.0]'
);
assert(
  resRoutine.confidenceInterval.low <= resRoutine.riskScorePercent &&
  resRoutine.confidenceInterval.high >= resRoutine.riskScorePercent,
  'Confidence interval encompasses estimated risk score point estimate'
);
assert(
  resRoutine.confidenceInterval.low >= 0 && resRoutine.confidenceInterval.high <= 100,
  'Confidence interval bounded in [0%, 100%]'
);

// Incomplete labs should produce higher uncertainty than complete labs
const sparseCase: FutureHealthScreeningRequest = {
  demographics: { age: 50, gender: 'Female' },
  biometrics: {},
  labs: { hba1c: 5.6 }, // only 1 lab
  symptoms: [],
  consentGiven: true,
  deIdentified: true
};
const resSparse = evaluateHeuristicRisk(sparseCase);
assert(
  resSparse.uncertaintyScore > resRoutine.uncertaintyScore,
  'Epistemic uncertainty reflects missing laboratory data completeness'
);

// ----------------------------------------------------
// Test 4: Clinical Causality & Guideline Grounding
// ----------------------------------------------------
console.log('\nTest Group 4: Explainability & Clinical Guidelines');

assert(resElevated.causalityBreakdown.length >= 2, 'Produces explainable biomarker causality chain');
const hasGuideline = resElevated.causalityBreakdown.some(c => 
  c.guidelineSource.includes('AHA') || c.guidelineSource.includes('ADA')
);
assert(hasGuideline, 'Biomarker causality directly attributes AHA/ADA clinical guidelines');

assert(CLINICAL_EVIDENCE_GUIDELINES.length >= 4, 'Includes minimum 4 major guideline registries');

// ----------------------------------------------------
// Test 5: SBAR Handoff & Physician Escalation
// ----------------------------------------------------
console.log('\nTest Group 5: Human-in-the-Loop SBAR Handoff');

assert(Boolean(resElevated.sbarHandoff.situation), 'SBAR contains Situation');
assert(Boolean(resElevated.sbarHandoff.background), 'SBAR contains Background');
assert(Boolean(resElevated.sbarHandoff.assessment), 'SBAR contains Assessment');
assert(Boolean(resElevated.sbarHandoff.recommendation), 'SBAR contains Recommendation');
assert(Boolean(resElevated.sbarHandoff.requiredPhysicianSpecialty), 'SBAR specifies physician specialty');
assert(resCritical.sbarHandoff.targetReferralTimeframe.includes('< 24 hours') || resCritical.sbarHandoff.targetReferralTimeframe.includes('Immediate'),
  'Critical case SBAR enforces acute referral timeframe (< 24 hours)');

// ----------------------------------------------------
// Test 6: HL7 FHIR Release 4 RiskAssessment Resource
// ----------------------------------------------------
console.log('\nTest Group 6: HL7 FHIR R4 Interoperability');

const fhir = buildFhirRiskAssessment(
  'FHC-TEST-001',
  'PT-ANON-101',
  resElevated.riskLevel,
  resElevated.riskScorePercent,
  resElevated.causalityBreakdown,
  resElevated.sbarHandoff.assessment
);

assert(fhir.resourceType === 'RiskAssessment', 'FHIR resourceType is RiskAssessment');
assert(fhir.status === 'final', 'FHIR status is final');
assert(fhir.method?.coding?.[0]?.code === '75492-9', 'FHIR method conforms to LOINC 75492-9 (Risk assessment)');
assert(Array.isArray(fhir.prediction) && fhir.prediction.length > 0, 'FHIR contains prediction array');
assert(fhir.note?.[0]?.text?.includes('Non-Diagnostic Clinical Decision Support'), 'FHIR note embeds non-diagnostic disclaimer');

// ----------------------------------------------------
// Test 7: Non-Diagnostic Clinical Disclaimer Invariance
// ----------------------------------------------------
console.log('\nTest Group 7: Clinical Safety & Disclaimer Invariance');

assert(
  MANDATORY_NON_DIAGNOSTIC_DISCLAIMER.includes('Non-Diagnostic Clinical Decision Support') &&
  MANDATORY_NON_DIAGNOSTIC_DISCLAIMER.includes('does NOT diagnose diseases'),
  'Mandatory non-diagnostic disclaimer is verbatim and non-ambiguous'
);

// ----------------------------------------------------
// Test 8: Demographic Fairness Parity
// ----------------------------------------------------
console.log('\nTest Group 8: Demographic Fairness Parity Invariance');

const maleCohort: FutureHealthScreeningRequest = {
  ...moderateIronCase,
  demographics: { age: 30, gender: 'Male' }
};
const femaleCohort: FutureHealthScreeningRequest = {
  ...moderateIronCase,
  demographics: { age: 30, gender: 'Female' }
};
const resMale = evaluateHeuristicRisk(maleCohort);
const resFemale = evaluateHeuristicRisk(femaleCohort);

assert(
  resMale.riskLevel === resFemale.riskLevel,
  'Identical biomarkers yield invariant risk tier across gender cohorts (Disparate Impact Ratio = 1.00)'
);

// ----------------------------------------------------
// Summary
// ----------------------------------------------------
console.log('\n======================================================');
const passedCount = results.filter(r => r.passed).length;
const totalCount = results.length;
console.log(`TOTAL TESTS: ${totalCount} | PASSED: ${passedCount} | FAILED: ${totalCount - passedCount}`);
console.log('======================================================\n');

if (passedCount === totalCount) {
  console.log('🎉 ALL FUTURE HEALTH CHALLENGE INVARIANTS VERIFIED SUCCESSFULLY!\n');
  process.exit(0);
} else {
  console.error('❌ SOME TESTS FAILED!\n');
  process.exit(1);
}
