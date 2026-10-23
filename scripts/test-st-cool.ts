/**
 * ST COOL: Symptom-to-Care Clinical Orientation
 * Future Health Digital Innovation Challenge 2026
 * Comprehensive Automated Verification & Invariant Test Suite
 */

import { 
  validateStCoolRequest, 
  evaluateStCoolHeuristics, 
  buildClinicianPrep,
  ST_COOL_DISCLAIMER,
  ST_COOL_EMERGENCY_NOTICE,
  ST_COOL_EVIDENCE_REGISTRY 
} from '../src/server/stCoolService';
import { StCoolIntakeData } from '../src/types';
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
console.log('✨ ST COOL — FUTURE HEALTH VERIFICATION & INVARIANT SUITE');
console.log('======================================================\n');

// ----------------------------------------------------
// Group 1: Navigation & Integration Verification
// ----------------------------------------------------
console.log('Test Group 1: Dr. T Platform Navigation & Tab Integration');

const navbarPath = path.join(process.cwd(), 'src', 'components', 'layout', 'Navbar.tsx');
const navbarContent = fs.readFileSync(navbarPath, 'utf8');
assert(navbarContent.includes("label: 'HealthAlert Companion'"), 'Navbar renders tab with exact visible label "HealthAlert Companion"');
assert(navbarContent.includes("id: 'stcool'"), 'Navbar includes stcool tab ID');

const appPath = path.join(process.cwd(), 'src', 'App.tsx');
const appContent = fs.readFileSync(appPath, 'utf8');
assert(appContent.includes("activeTab === 'stcool'"), 'App.tsx renders stcool tab condition');
assert(appContent.includes('HealthAlertCompanionModule') || appContent.includes('StCoolModule'), 'App.tsx imports and renders HealthAlertCompanionModule');

const bridgePath = path.join(process.cwd(), 'src', 'components', 'bridge', 'DrTHealthBridge.tsx');
const bridgeContent = fs.readFileSync(bridgePath, 'utf8');
assert(bridgeContent.includes("setActiveTab('stcool')"), 'DrTHealthBridge links directly to HealthAlert Companion');

// ----------------------------------------------------
// Group 2: Consent & Privacy Guardrails
// ----------------------------------------------------
console.log('\nTest Group 2: Informed Consent & HIPAA De-Identification');

const baseValidIntake: StCoolIntakeData = {
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

const reqNoConsent: StCoolIntakeData = { ...baseValidIntake, consentGiven: false };
const valNoConsent = validateStCoolRequest(reqNoConsent);
assert(!valNoConsent.isValid && valNoConsent.error?.includes('Informed consent is required'),
  'Rejects intake without explicit informed consent');

const reqNoDeId: StCoolIntakeData = { ...baseValidIntake, deIdentifiedConfirmed: false };
const valNoDeId = validateStCoolRequest(reqNoDeId);
assert(!valNoDeId.isValid && valNoDeId.error?.includes('confirm that no direct identifiers'),
  'Rejects intake without de-identification confirmation');

const reqWithEmail: StCoolIntakeData = { 
  ...baseValidIntake, 
  primaryConcern: 'Contact patient at doctor.smith@hospital.org for notes' 
};
const valEmail = validateStCoolRequest(reqWithEmail);
assert(!valEmail.isValid && valEmail.error?.includes('Direct personal identifier'),
  'Detects and rejects unscrubbed direct email identifier');

const reqWithPhone: StCoolIntakeData = { 
  ...baseValidIntake, 
  primaryConcern: 'Emergency call at 555-234-5678 immediately' 
};
const valPhone = validateStCoolRequest(reqWithPhone);
assert(!valPhone.isValid && valPhone.error?.includes('Direct personal identifier'),
  'Detects and rejects unscrubbed phone number identifier');

const valValid = validateStCoolRequest(baseValidIntake);
assert(valValid.isValid, 'Accepts valid de-identified intake with consent');

// ----------------------------------------------------
// Group 3: Input Validation & Physiological Bounds
// ----------------------------------------------------
console.log('\nTest Group 3: Physiological Plausibility & Range Validation');

const reqBadAge = { ...baseValidIntake, age: 145 };
assert(!validateStCoolRequest(reqBadAge).isValid, 'Rejects implausible age (> 120)');

const reqBadSeverity = { ...baseValidIntake, severityScale: 15 };
assert(!validateStCoolRequest(reqBadSeverity).isValid, 'Rejects severity outside 1-10 range');

const reqBadBpFormat = { ...baseValidIntake, vitals: { bloodPressure: '120-80' } };
assert(!validateStCoolRequest(reqBadBpFormat).isValid, 'Rejects malformed blood pressure format');

const reqImplausibleBp = { ...baseValidIntake, vitals: { bloodPressure: '320/210' } };
assert(!validateStCoolRequest(reqImplausibleBp).isValid, 'Rejects physiologically implausible blood pressure');

const reqBadHeartRate = { ...baseValidIntake, vitals: { restingHeartRate: 350 } };
assert(!validateStCoolRequest(reqBadHeartRate).isValid, 'Rejects implausible heart rate (> 240 bpm)');

// ----------------------------------------------------
// Group 4: Multi-Tier Triage Stratification
// ----------------------------------------------------
console.log('\nTest Group 4: Multi-Tier Clinical Triage Stratification');

// 1. Routine
const routineIntake: StCoolIntakeData = {
  ...baseValidIntake,
  primaryConcern: 'Mild transient muscle stiffness after first marathon training run',
  durationDays: 2,
  severityScale: 2,
  vitals: { bloodPressure: '116/74', restingHeartRate: 60 },
  labs: { ferritin: 75, hba1c: 5.0, egfr: 105 },
  symptoms: []
};
const resRoutine = evaluateStCoolHeuristics(routineIntake);
assert(resRoutine.triageTier === 'ROUTINE_WELLNESS', 'Stratifies baseline normal metrics to ROUTINE_WELLNESS');

// 2. Planned Clinical Assessment (Subclinical Iron Depletion)
const ironIntake: StCoolIntakeData = {
  ...baseValidIntake,
  labs: { ferritin: 16, hba1c: 5.1, egfr: 98 }
};
const resIron = evaluateStCoolHeuristics(ironIntake);
assert(resIron.triageTier === 'PLANNED_CLINICAL_ASSESSMENT', 
  'Stratifies latent iron depletion (Ferritin 16 ng/mL) to PLANNED_CLINICAL_ASSESSMENT');

// 2b. Cardiometabolic Assessment: Blood pressure 138/88 mmHg + HbA1c 6.1%
const cardioIntake: StCoolIntakeData = {
  ...baseValidIntake,
  patientAlias: 'DEMO-CORP-44',
  vitals: { bloodPressure: '138/88', restingHeartRate: 78 },
  labs: { hba1c: 6.1, egfr: 92 },
  symptoms: ['Postprandial lethargy'],
  countryOrRegion: 'Vietnam'
};
const resCardio = evaluateStCoolHeuristics(cardioIntake);
assert(resCardio.triageTier === 'PLANNED_CLINICAL_ASSESSMENT', 
  'Stratifies Stage 1 HTN (138/88 mmHg) + Prediabetes (6.1%) to PLANNED_CLINICAL_ASSESSMENT (Non-Emergency)');
assert(!resCardio.urgencyTimeline.includes('IMMEDIATE'), 
  'Cardiometabolic 138/88 + 6.1% is not labeled as emergency care');

// 3. Urgent Evaluation (Stage 2 HTN + Prediabetes)
const urgentIntake: StCoolIntakeData = {
  ...baseValidIntake,
  vitals: { bloodPressure: '152/94', restingHeartRate: 78 },
  labs: { hba1c: 6.2, egfr: 75 }
};
const resUrgent = evaluateStCoolHeuristics(urgentIntake);
assert(resUrgent.triageTier === 'URGENT_EVALUATION', 
  'Stratifies Stage 2 HTN + Prediabetes to URGENT_EVALUATION');

// 4. Emergent Escalation (Acute Chest Pain) & Vietnam Localization
const emergentIntake: StCoolIntakeData = {
  ...baseValidIntake,
  primaryConcern: 'Sudden crushing chest pressure radiating to left arm with cold sweat',
  symptoms: ['Chest pain', 'Shortness of breath'],
  vitals: { bloodPressure: '168/104', restingHeartRate: 105 },
  countryOrRegion: 'Vietnam'
};
const resEmergent = evaluateStCoolHeuristics(emergentIntake);
assert(resEmergent.triageTier === 'EMERGENT_ESCALATION', 
  'Stratifies acute chest pain warning sign to EMERGENT_ESCALATION');
assert(resEmergent.urgencyTimeline.includes('115'), 
  'Localizes Vietnam emergency directive with ambulance 115');

// ----------------------------------------------------
// Group 5: Epistemic Uncertainty Quantification
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

// Missing data penalty check
const sparseIntake: StCoolIntakeData = {
  ...baseValidIntake,
  vitals: {},
  labs: {}
};
const resSparse = evaluateStCoolHeuristics(sparseIntake);
assert(resSparse.uncertainty.score > resRoutine.uncertainty.score,
  'Epistemic uncertainty penalizes missing vitals and laboratory markers');

// ----------------------------------------------------
// Group 6: Clinician Preparation & SBAR Handoff
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
// Group 7: Evidence Citations & Guidelines
// ----------------------------------------------------
console.log('\nTest Group 7: Evidence Citations & Guideline Attribution');

assert(ST_COOL_EVIDENCE_REGISTRY.length >= 4, 'Includes minimum 4 peer-reviewed clinical guidelines');
assert(ST_COOL_EVIDENCE_REGISTRY.some(e => e.source.includes('American Heart Association')),
  'Attributes AHA clinical guidelines');
assert(ST_COOL_EVIDENCE_REGISTRY.some(e => e.source.includes('American Diabetes Association')),
  'Attributes ADA Standards of Care');
assert(ST_COOL_EVIDENCE_REGISTRY.some(e => e.source.includes('World Health Organization')),
  'Attributes WHO Ferritin guidance');

// ----------------------------------------------------
// Group 8: Safety Disclaimers & Emergency Warning
// ----------------------------------------------------
console.log('\nTest Group 8: Safety Disclaimers & Clinical Non-Diagnostic Boundary');

assert(ST_COOL_DISCLAIMER.includes('Non-Diagnostic Clinical Decision Support'),
  'Verbatim non-diagnostic disclaimer present');
assert(ST_COOL_DISCLAIMER.includes('does NOT provide formal medical diagnosis'),
  'Explicitly disclaims diagnostic authority');
assert(ST_COOL_EMERGENCY_NOTICE.includes('call 911'),
  'Clear emergency 911 escalation directive in safety notice');

// ----------------------------------------------------
// Summary
// ----------------------------------------------------
console.log('\n======================================================');
const passedTotal = testResults.filter(r => r.passed).length;
const totalTests = testResults.length;
console.log(`TOTAL TESTS: ${totalTests} | PASSED: ${passedTotal} | FAILED: ${totalTests - passedTotal}`);
console.log('======================================================\n');

if (passedTotal === totalTests) {
  console.log('🎉 ALL ST COOL VERIFICATION AND INVARIANT TESTS PASSED!\n');
  process.exit(0);
} else {
  console.error('❌ SOME TESTS FAILED!\n');
  process.exit(1);
}
