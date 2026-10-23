/**
 * HEALTH ALERT: Clinical Decision Support & Warning Engine
 * Future Health Digital Innovation Challenge 2026
 * Comprehensive Automated Verification & Invariant Test Suite
 */

import { 
  validateHealthAlertRequest, 
  evaluateHealthAlertHeuristics, 
  HEALTH_ALERT_DISCLAIMER,
  HEALTH_ALERT_EMERGENCY_NOTICE,
  HEALTH_ALERT_EVIDENCE_REGISTRY,
  getEmergencyGuidanceByRegion 
} from '../src/server/healthAlertService';
import { buildClinicianPrep } from '../src/server/stCoolService';
import { HealthAlertIntakeData } from '../src/types';
import fs from 'fs';
import path from 'path';

interface AssertionResult {
  name: string;
  passed: boolean;
  details?: string;
}

const testResults: AssertionResult[] = [];

function assert(condition: boolean, name: string, details?: string) {
  if (condition) {
    testResults.push({ name, passed: true, details });
    console.log(`  ✅ [PASS] ${name}`);
  } else {
    testResults.push({ name, passed: false, details: details || 'Assertion condition failed' });
    console.error(`  ❌ [FAIL] ${name} - ${details || 'Assertion condition failed'}`);
  }
}

console.log('\n======================================================');
console.log('🔔 HEALTH ALERT — FUTURE HEALTH VERIFICATION & INVARIANT SUITE');
console.log('======================================================\n');

// ----------------------------------------------------
// Group 1: Navigation & Integration Verification
// ----------------------------------------------------
console.log('Test Group 1: Dr. T Platform Navigation & Tab Integration');

const navbarPath = path.join(process.cwd(), 'src', 'components', 'layout', 'Navbar.tsx');
const navbarContent = fs.readFileSync(navbarPath, 'utf8');
assert(navbarContent.includes("label: 'HealthAlert Companion'"), 'Navbar renders consolidated tab "HealthAlert Companion"');
assert(navbarContent.includes("id: 'stcool'"), 'Navbar includes consolidated HealthAlert Companion tab ID');

const appPath = path.join(process.cwd(), 'src', 'App.tsx');
const appContent = fs.readFileSync(appPath, 'utf8');
assert(appContent.includes("activeTab === 'healthalert'"), 'App.tsx renders healthalert tab condition');
assert(appContent.includes('HealthAlertCompanionModule') || appContent.includes('HealthAlertModule'), 'App.tsx imports and renders HealthAlertCompanionModule');

// ----------------------------------------------------
// Group 2: Informed Consent & De-Identification
// ----------------------------------------------------
console.log('\nTest Group 2: Informed Consent & De-Identification');

const baseValidIntake: HealthAlertIntakeData = {
  patientAlias: 'RUNNER-29',
  age: 29,
  gender: 'Female',
  primaryConcern: 'Afternoon fatigue and exercise intolerance',
  durationDays: 42,
  severityScale: 6,
  vitals: { bloodPressure: '114/72', restingHeartRate: 58 },
  labs: { ferritin: 16, hba1c: 5.1 },
  symptoms: ['Afternoon cognitive fog', 'Restless legs'],
  medications: ['Multivitamin'],
  allergies: ['Penicillin'],
  consentGiven: true,
  deIdentifiedConfirmed: true
};

const reqNoConsent: HealthAlertIntakeData = { ...baseValidIntake, consentGiven: false };
const valNoConsent = validateHealthAlertRequest(reqNoConsent);
assert(!valNoConsent.isValid && valNoConsent.error?.includes('Informed consent is required'),
  'Rejects intake without explicit informed consent');

const reqNoDeId: HealthAlertIntakeData = { ...baseValidIntake, deIdentifiedConfirmed: false };
const valNoDeId = validateHealthAlertRequest(reqNoDeId);
assert(!valNoDeId.isValid && valNoDeId.error?.includes('confirm that no direct identifiers'),
  'Rejects intake without de-identification confirmation');

const reqWithEmail: HealthAlertIntakeData = { 
  ...baseValidIntake, 
  primaryConcern: 'Contact patient at doctor.smith@hospital.org for notes' 
};
const valEmail = validateHealthAlertRequest(reqWithEmail);
assert(!valEmail.isValid && valEmail.error?.includes('Direct personal identifier'),
  'Detects and rejects unscrubbed direct email identifier');

const reqWithPhone: HealthAlertIntakeData = { 
  ...baseValidIntake, 
  primaryConcern: 'Emergency call at 555-234-5678 immediately' 
};
const valPhone = validateHealthAlertRequest(reqWithPhone);
assert(!valPhone.isValid && valPhone.error?.includes('Direct personal identifier'),
  'Detects and rejects unscrubbed phone number identifier');

const valValid = validateHealthAlertRequest(baseValidIntake);
assert(valValid.isValid, 'Accepts valid de-identified intake with consent');

// ----------------------------------------------------
// Group 3: Physiological Plausibility & Range Validation
// ----------------------------------------------------
console.log('\nTest Group 3: Physiological Plausibility & Range Validation');

const reqBadAge = { ...baseValidIntake, age: 145 };
assert(!validateHealthAlertRequest(reqBadAge).isValid, 'Rejects implausible age (> 120)');

const reqBadSeverity = { ...baseValidIntake, severityScale: 15 };
assert(!validateHealthAlertRequest(reqBadSeverity).isValid, 'Rejects severity outside 1-10 range');

const reqBadBpFormat = { ...baseValidIntake, vitals: { bloodPressure: '120-80' } };
assert(!validateHealthAlertRequest(reqBadBpFormat).isValid, 'Rejects malformed blood pressure format');

const reqImplausibleBp = { ...baseValidIntake, vitals: { bloodPressure: '320/210' } };
assert(!validateHealthAlertRequest(reqImplausibleBp).isValid, 'Rejects physiologically implausible blood pressure');

const reqBadHeartRate = { ...baseValidIntake, vitals: { restingHeartRate: 350 } };
assert(!validateHealthAlertRequest(reqBadHeartRate).isValid, 'Rejects implausible heart rate (> 240 bpm)');

// ----------------------------------------------------
// Group 4: Multi-Tier Clinical Triage Stratification
// ----------------------------------------------------
console.log('\nTest Group 4: Multi-Tier Clinical Triage Stratification');

// 1. Routine
const routineIntake: HealthAlertIntakeData = {
  ...baseValidIntake,
  primaryConcern: 'Mild transient muscle stiffness after first marathon training run',
  durationDays: 2,
  severityScale: 2,
  vitals: { bloodPressure: '116/74', restingHeartRate: 60 },
  labs: { ferritin: 75, hba1c: 5.0, egfr: 105 },
  symptoms: []
};
const resRoutine = evaluateHealthAlertHeuristics(routineIntake);
assert(resRoutine.triageTier === 'ROUTINE_WELLNESS', 'Stratifies baseline normal metrics to ROUTINE_WELLNESS');

// 2. Planned Clinical Assessment (Subclinical Iron Depletion)
const ironIntake: HealthAlertIntakeData = {
  ...baseValidIntake,
  labs: { ferritin: 16, hba1c: 5.1, egfr: 98 }
};
const resIron = evaluateHealthAlertHeuristics(ironIntake);
assert(resIron.triageTier === 'PLANNED_CLINICAL_ASSESSMENT', 
  'Stratifies latent iron depletion (Ferritin 16 ng/mL) to PLANNED_CLINICAL_ASSESSMENT');

// 2b. Cardiometabolic Assessment: Blood pressure 138/88 mmHg + HbA1c 6.1%
const cardioIntake: HealthAlertIntakeData = {
  ...baseValidIntake,
  patientAlias: 'DEMO-CORP-44',
  vitals: { bloodPressure: '138/88', restingHeartRate: 78 },
  labs: { hba1c: 6.1, egfr: 92 },
  symptoms: ['Postprandial lethargy'],
  countryOrRegion: 'Vietnam'
};
const resCardio = evaluateHealthAlertHeuristics(cardioIntake);
assert(resCardio.triageTier === 'PLANNED_CLINICAL_ASSESSMENT', 
  'Stratifies Stage 1 HTN (138/88 mmHg) + Prediabetes (6.1%) to PLANNED_CLINICAL_ASSESSMENT (Non-Emergency)');
assert(!resCardio.urgencyTimeline.includes('IMMEDIATE'), 
  'Cardiometabolic 138/88 + 6.1% is not labeled as emergency care');

// 3. Urgent Evaluation (Stage 2 HTN + Prediabetes)
const urgentIntake: HealthAlertIntakeData = {
  ...baseValidIntake,
  vitals: { bloodPressure: '152/94', restingHeartRate: 78 },
  labs: { hba1c: 6.2, egfr: 75 }
};
const resUrgent = evaluateHealthAlertHeuristics(urgentIntake);
assert(resUrgent.triageTier === 'URGENT_EVALUATION', 
  'Stratifies Stage 2 HTN + Prediabetes to URGENT_EVALUATION');

// 4. Emergent Escalation (Acute Chest Pain) & Vietnam Localization
const emergentIntake: HealthAlertIntakeData = {
  ...baseValidIntake,
  primaryConcern: 'Sudden crushing chest pressure radiating to left arm with cold sweat',
  symptoms: ['Chest pain', 'Shortness of breath'],
  vitals: { bloodPressure: '168/104', restingHeartRate: 105 },
  countryOrRegion: 'Vietnam'
};
const resEmergent = evaluateHealthAlertHeuristics(emergentIntake);
assert(resEmergent.triageTier === 'EMERGENT_ESCALATION', 
  'Stratifies acute chest pain warning sign to EMERGENT_ESCALATION');
assert(resEmergent.urgencyTimeline.includes('115'), 
  'Localizes Vietnam emergency directive with ambulance 115');

// 4b. Conflicting Indicators Safety Guardrails
// Case A: Normal vitals but acute chest pain (Critical symptom must override reassuring vitals)
const normalVitalsAcuteSymptom: HealthAlertIntakeData = {
  ...baseValidIntake,
  vitals: { bloodPressure: '118/76', restingHeartRate: 72 },
  primaryConcern: 'Acute crushing substernal chest pressure',
  symptoms: ['Chest pain', 'Cold diaphoresis']
};
const resConflictAcute = evaluateHealthAlertHeuristics(normalVitalsAcuteSymptom);
assert(resConflictAcute.triageTier === 'EMERGENT_ESCALATION',
  'Safety invariant: Critical red-flag symptom escalates to EMERGENT_ESCALATION even with normal vitals');

// Case B: Moderate Stage 2 BP (152/94) with normal labs & no red flags (Must NOT over-escalate to emergency)
const stage2NoRedFlags: HealthAlertIntakeData = {
  ...baseValidIntake,
  vitals: { bloodPressure: '152/94', restingHeartRate: 74 },
  primaryConcern: 'Routine wellness review',
  symptoms: []
};
const resStage2 = evaluateHealthAlertHeuristics(stage2NoRedFlags);
assert(resStage2.triageTier === 'URGENT_EVALUATION',
  'Safety invariant: Stage 2 BP without red flags correctly stays URGENT_EVALUATION and does not over-escalate to emergency');

// Case C: Stage 1 BP 138/88 mmHg + HbA1c 6.1% (Cardiometabolic borderline must NOT be labeled emergency or urgent)
const stage1WithPrediabetes: HealthAlertIntakeData = {
  ...baseValidIntake,
  vitals: { bloodPressure: '138/88', restingHeartRate: 70 },
  labs: { hba1c: 6.1 },
  primaryConcern: 'Occasional mild afternoon tiredness',
  symptoms: []
};
const resStage1Prediabetes = evaluateHealthAlertHeuristics(stage1WithPrediabetes);
assert(resStage1Prediabetes.triageTier === 'PLANNED_CLINICAL_ASSESSMENT',
  'Safety invariant: BP 138/88 + HbA1c 6.1% strictly stratifies to PLANNED_CLINICAL_ASSESSMENT (2-4 weeks follow-up)');

// 4c. Geographic Localization Verification
const vnGuidance = getEmergencyGuidanceByRegion('Vietnam');
assert(vnGuidance.ambulanceNumber === '115' && vnGuidance.emergencyInstructions.includes('115'),
  'Vietnam localization returns ambulance number 115 and verified Vietnamese dispatch text');

const uaeGuidance = getEmergencyGuidanceByRegion('Abu Dhabi, UAE');
assert(uaeGuidance.ambulanceNumber === '998' && uaeGuidance.emergencyInstructions.includes('998'),
  'UAE localization returns National Ambulance 998 instructions');

const ukGuidance = getEmergencyGuidanceByRegion('United Kingdom');
assert(ukGuidance.ambulanceNumber === '999' && ukGuidance.emergencyInstructions.includes('999'),
  'UK localization returns 999 instructions');

const euGuidance = getEmergencyGuidanceByRegion('European Union');
assert(euGuidance.ambulanceNumber === '112' && euGuidance.emergencyInstructions.includes('112'),
  'Europe localization returns 112 instructions');

const defaultGuidance = getEmergencyGuidanceByRegion('International');
assert(defaultGuidance.ambulanceNumber === '911' && defaultGuidance.emergencyInstructions.includes('local emergency'),
  'Default localization instructs contacting local emergency medical services');

// ----------------------------------------------------
// Group 5: Epistemic Uncertainty & Statistical Bounds
// ----------------------------------------------------
console.log('\nTest Group 5: Epistemic Uncertainty & Statistical Bounds');

assert(resRoutine.uncertainty.score >= 0.0 && resRoutine.uncertainty.score <= 1.0,
  'Uncertainty score bounded in [0.0, 1.0]');
assert(resRoutine.uncertainty.confidenceInterval.low <= resRoutine.riskScore &&
       resRoutine.uncertainty.confidenceInterval.high >= resRoutine.riskScore,
  'Confidence interval encompasses estimated risk score point estimate');
assert(resRoutine.uncertainty.confidenceInterval.low >= 0 &&
       resRoutine.uncertainty.confidenceInterval.high <= 100,
  'Confidence interval bounds remain within [0%, 100%]');

const sparseIntake: HealthAlertIntakeData = {
  ...baseValidIntake,
  vitals: {},
  labs: {}
};
const resSparse = evaluateHealthAlertHeuristics(sparseIntake);
assert(resSparse.uncertainty.score > resRoutine.uncertainty.score,
  'Epistemic uncertainty penalizes missing vitals and laboratory markers');

// ----------------------------------------------------
// Group 6: Clinician SBAR Handoff & Patient Questions
// ----------------------------------------------------
console.log('\nTest Group 6: Clinician SBAR Handoff & Patient Questions');

const prep = buildClinicianPrep(ironIntake, resIron);
assert(Boolean(prep.sbarBrief.situation), 'SBAR contains Situation');
assert(Boolean(prep.sbarBrief.background), 'SBAR contains Background');
assert(Boolean(prep.sbarBrief.assessment), 'SBAR contains Assessment');
assert(Boolean(prep.sbarBrief.recommendation), 'SBAR contains Recommendation');
assert(prep.suggestedQuestions.length >= 3, 'Generates at least 3 clinician visit questions');
assert(prep.checklist.length >= 4, 'Generates actionable pre-appointment checklist');

// ----------------------------------------------------
// Group 7: Evidence Citations & Guideline Attribution
// ----------------------------------------------------
console.log('\nTest Group 7: Evidence Citations & Guideline Attribution');

assert(HEALTH_ALERT_EVIDENCE_REGISTRY.length >= 4, 'Includes minimum 4 peer-reviewed clinical guidelines');
assert(
  HEALTH_ALERT_EVIDENCE_REGISTRY.some(e => e.source.includes('American Heart Association')),
  'Attributes AHA clinical guidelines'
);
assert(
  HEALTH_ALERT_EVIDENCE_REGISTRY.some(e => e.source.includes('American Diabetes Association')),
  'Attributes ADA Standards of Care'
);
assert(
  HEALTH_ALERT_EVIDENCE_REGISTRY.some(e => e.source.includes('World Health Organization')),
  'Attributes WHO Ferritin guidance'
);

// ----------------------------------------------------
// Group 8: Safety Disclaimers & Clinical Non-Diagnostic Boundary
// ----------------------------------------------------
console.log('\nTest Group 8: Safety Disclaimers & Clinical Non-Diagnostic Boundary');

assert(
  HEALTH_ALERT_DISCLAIMER.includes('Non-Diagnostic Clinical Decision Support'),
  'Verbatim non-diagnostic disclaimer present'
);
assert(
  HEALTH_ALERT_DISCLAIMER.includes('does NOT provide formal medical diagnosis'),
  'Explicitly disclaims diagnostic authority'
);
assert(
  HEALTH_ALERT_EMERGENCY_NOTICE.includes('call 911'),
  'Clear emergency 911 escalation directive in safety notice'
);

// ----------------------------------------------------
// Summary
// ----------------------------------------------------
console.log('\n======================================================');
const total = testResults.length;
const passed = testResults.filter(t => t.passed).length;
const failed = total - passed;
console.log(`TOTAL TESTS: ${total} | PASSED: ${passed} | FAILED: ${failed}`);
console.log('======================================================\n');

if (failed > 0) {
  console.error('❌ SOME TESTS FAILED!');
  process.exit(1);
} else {
  console.log('🎉 ALL HEALTH ALERT VERIFICATION AND INVARIANT TESTS PASSED!\n');
  process.exit(0);
}
