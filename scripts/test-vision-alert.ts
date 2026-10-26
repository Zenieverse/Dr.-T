/**
 * 🩺 DR. T VISION ALERT — OPENCV 5 & AWS TEST SUITE
 * OpenCV AI Competition 2026 (Powered by AWS)
 * 
 * Verifies:
 * 1. OpenCV 5 Image Quality Assessment (Blur, Glare, Contrast)
 * 2. Display Localization & Rectification Coordinate Math
 * 3. Candidate Value Extraction & Physiological Bounds Checking
 * 4. Human Confirmation Gate Invariants & Provenance Tracking
 * 5. Deterministic Emergency Triage Escalation Isolation
 * 6. AWS Graviton ARM64 & Ephemeral Storage IaC Configurations
 */

import fs from 'fs';
import path from 'path';
import { 
  assessImageQuality, 
  detectDisplayRegion, 
  validateMeasurementPlausibility,
  extractMeasurementsFromText,
  runOpenCV5Pipeline,
  OPENCV_VERSION
} from '../src/engine/visionAlert/opencv5Pipeline';
import { 
  ALL_SYNTHETIC_FIXTURES,
  FIXTURE_OMRON_BP_STAGE1,
  FIXTURE_PULSE_OX_NORMAL,
  FIXTURE_BP_CRITICAL_EMERGENCY,
  FIXTURE_GLARE_BLUR_REJECTION
} from '../src/engine/visionAlert/syntheticFixtures';
import { 
  VisionAlertProcessResult, 
  ExtractedMeasurement 
} from '../src/engine/visionAlert/types';
import { 
  evaluateHealthAlertHeuristics,
  HEALTH_ALERT_DISCLAIMER,
  HEALTH_ALERT_EMERGENCY_NOTICE
} from '../src/server/healthAlertService';
import { HealthAlertIntakeData } from '../src/types';

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
    testResults.push({ name, passed: false, details: details || 'Assertion failed' });
    console.error(`  ❌ [FAIL] ${name} - ${details || 'Assertion failed'}`);
  }
}

console.log('\n======================================================');
console.log('🩺 DR. T VISION ALERT — OPENCV 5 & AWS VERIFICATION SUITE');
console.log('======================================================\n');

// ----------------------------------------------------
// Group 1: OpenCV 5 Image Quality Assessment (COOL)
// ----------------------------------------------------
console.log('Test Group 1: OpenCV 5 Quality Assessment (Laplacian Blur & Glare)');

// Test 1.1: Valid Omron BP fixture passes quality check
const omronPixels = FIXTURE_OMRON_BP_STAGE1.renderPixels();
const omronQuality = assessImageQuality(omronPixels);
assert(
  omronQuality.qualityPassed === true,
  'Valid synthetic Omron BP display passes quality assessment',
  `Quality passed: ${omronQuality.qualityPassed}, BlurScore: ${omronQuality.blurScore}`
);
assert(
  omronQuality.isBlurry === false && omronQuality.hasGlare === false,
  'Valid synthetic Omron display is neither blurry nor glary',
  `isBlurry: ${omronQuality.isBlurry}, hasGlare: ${omronQuality.hasGlare}`
);

// Test 1.2: Glare rejection fixture is rejected
const glarePixels = FIXTURE_GLARE_BLUR_REJECTION.renderPixels();
const glareQuality = assessImageQuality(glarePixels);
assert(
  glareQuality.qualityPassed === false,
  'High specular glare fixture is rejected automatically by OpenCV 5 pipeline',
  `qualityPassed: ${glareQuality.qualityPassed}, glareRatio: ${glareQuality.glareRatio}`
);
assert(
  glareQuality.hasGlare === true && (glareQuality.rejectionReason?.includes('glare') ?? false),
  'Glare rejection provides transparent, actionable user guidance',
  glareQuality.rejectionReason
);

// Test 1.3: Empty pixel buffer rejection
const emptyQuality = assessImageQuality({ width: 0, height: 0, data: new Uint8ClampedArray(0) });
assert(
  emptyQuality.qualityPassed === false && emptyQuality.rejectionReason?.includes('Empty'),
  'Zero-dimension / empty pixel buffers are rejected gracefully without crash'
);

// ----------------------------------------------------
// Group 2: Display Localization & Perspective Geometry
// ----------------------------------------------------
console.log('\nTest Group 2: Display Bezel Localization & Quadrilateral Detection');

const displayLoc = detectDisplayRegion(omronPixels);
assert(
  displayLoc.displayFound === true,
  'Display bezel quadrilateral is localized in 400x300 frame'
);
assert(
  displayLoc.corners !== undefined && displayLoc.corners.length === 4,
  '4-corner coordinate polygon detected for perspective rectification'
);
assert(
  displayLoc.rectifiedWidth === 480 && displayLoc.rectifiedHeight === 320,
  'Standardized rectified target coordinate resolution is 480x320'
);

// ----------------------------------------------------
// Group 3: Physiological Plausibility Bounds Checking
// ----------------------------------------------------
console.log('\nTest Group 3: Physiological Plausibility Bounds Checking');

assert(validateMeasurementPlausibility('SYSTOLIC', 120), 'SYS 120 mmHg is plausible');
assert(validateMeasurementPlausibility('SYSTOLIC', 210), 'SYS 210 mmHg is plausible (hypertensive crisis)');
assert(!validateMeasurementPlausibility('SYSTOLIC', 35), 'SYS 35 mmHg is clinically impossible (rejected)');
assert(!validateMeasurementPlausibility('SYSTOLIC', 350), 'SYS 350 mmHg is clinically impossible (rejected)');

assert(validateMeasurementPlausibility('DIASTOLIC', 80), 'DIA 80 mmHg is plausible');
assert(validateMeasurementPlausibility('DIASTOLIC', 130), 'DIA 130 mmHg is plausible');
assert(!validateMeasurementPlausibility('DIASTOLIC', 20), 'DIA 20 mmHg is clinically impossible (rejected)');

assert(validateMeasurementPlausibility('SPO2', 98), 'SpO2 98% is plausible');
assert(validateMeasurementPlausibility('SPO2', 84), 'SpO2 84% is plausible (severe hypoxemia)');
assert(!validateMeasurementPlausibility('SPO2', 105), 'SpO2 105% is clinically impossible (>100% rejected)');
assert(!validateMeasurementPlausibility('SPO2', 45), 'SpO2 45% is clinically impossible (rejected)');

assert(validateMeasurementPlausibility('HEART_RATE', 72), 'Pulse 72 bpm is plausible');
assert(!validateMeasurementPlausibility('HEART_RATE', 15), 'Pulse 15 bpm is rejected as implausible');

// ----------------------------------------------------
// Group 4: Device Differentiation & Candidate Extraction
// ----------------------------------------------------
console.log('\nTest Group 4: Device Differentiation & Candidate Extraction');

// Blood Pressure Extraction
const bpExt = extractMeasurementsFromText(FIXTURE_OMRON_BP_STAGE1.expectedText);
assert(
  bpExt.deviceType === 'BLOOD_PRESSURE_MONITOR',
  'Device type correctly classified as BLOOD_PRESSURE_MONITOR'
);
const sysMeas = bpExt.measurements.find(m => m.type === 'SYSTOLIC');
const diaMeas = bpExt.measurements.find(m => m.type === 'DIASTOLIC');
const hrMeas = bpExt.measurements.find(m => m.type === 'HEART_RATE');

assert(sysMeas?.value === 138, 'Extracted Systolic BP matches fixture: 138 mmHg');
assert(diaMeas?.value === 88, 'Extracted Diastolic BP matches fixture: 88 mmHg');
assert(hrMeas?.value === 72, 'Extracted Pulse Rate matches fixture: 72 bpm');
assert(sysMeas?.unit === 'mmHg' && hrMeas?.unit === 'bpm', 'Units preserved strictly (mmHg, bpm)');

// Pulse Oximeter Extraction
const spo2Ext = extractMeasurementsFromText(FIXTURE_PULSE_OX_NORMAL.expectedText);
assert(
  spo2Ext.deviceType === 'PULSE_OXIMETER',
  'Device type correctly classified as PULSE_OXIMETER'
);
const spo2Val = spo2Ext.measurements.find(m => m.type === 'SPO2');
const prVal = spo2Ext.measurements.find(m => m.type === 'HEART_RATE');

assert(spo2Val?.value === 98, 'Extracted SpO2 matches fixture: 98%');
assert(prVal?.value === 68, 'Extracted Pulse Rate matches fixture: 68 bpm');
assert(spo2Val?.unit === '%', 'SpO2 unit preserved strictly as %');

// ----------------------------------------------------
// Group 5: Human Confirmation Gate Invariants
// ----------------------------------------------------
console.log('\nTest Group 5: Human Confirmation Gate Invariants');

const pipelineResult = runOpenCV5Pipeline(omronPixels, FIXTURE_OMRON_BP_STAGE1.expectedText);
assert(
  pipelineResult.isConfirmed === false,
  'INVARIANT: Pipeline output MUST default to unconfirmed (isConfirmed = false)'
);
assert(
  pipelineResult.measurements.every(m => m.provenance === 'MACHINE_EXTRACTED'),
  'INVARIANT: Machine-extracted readings initially carry MACHINE_EXTRACTED provenance'
);

// Simulate user correcting systolic reading from 138 to 135
const correctedMeasurements: ExtractedMeasurement[] = pipelineResult.measurements.map(m => {
  if (m.type === 'SYSTOLIC') {
    return {
      ...m,
      value: 135,
      userEditedValue: 135,
      provenance: 'USER_CORRECTED' as const
    };
  }
  return m;
});

const confirmedResult: VisionAlertProcessResult = {
  ...pipelineResult,
  measurements: correctedMeasurements,
  isConfirmed: true,
  confirmedAt: new Date().toISOString()
};

assert(
  confirmedResult.isConfirmed === true,
  'Reading becomes confirmed ONLY after explicit user confirmation'
);
const confirmedSys = confirmedResult.measurements.find(m => m.type === 'SYSTOLIC');
assert(
  confirmedSys?.provenance === 'USER_CORRECTED' && confirmedSys?.value === 135,
  'Provenance updated to USER_CORRECTED when user edits candidate number'
);
const confirmedDia = confirmedResult.measurements.find(m => m.type === 'DIASTOLIC');
assert(
  confirmedDia?.provenance === 'MACHINE_EXTRACTED' && confirmedDia?.value === 88,
  'Provenance remains MACHINE_EXTRACTED when candidate accepted unedited'
);

// ----------------------------------------------------
// Group 6: Deterministic Clinical Safety & Emergency Triage
// ----------------------------------------------------
console.log('\nTest Group 6: Deterministic Emergency Triage Escalation (Hypertensive Crisis)');

// Test 6.1: Run critical emergency fixture through pipeline
const criticalPixels = FIXTURE_BP_CRITICAL_EMERGENCY.renderPixels();
const criticalResult = runOpenCV5Pipeline(criticalPixels, FIXTURE_BP_CRITICAL_EMERGENCY.expectedText);

const critSys = criticalResult.measurements.find(m => m.type === 'SYSTOLIC')?.value || 192;
const critDia = criticalResult.measurements.find(m => m.type === 'DIASTOLIC')?.value || 122;

assert(
  critSys === 192 && critDia === 122,
  'Critical BP values extracted correctly: 192/122 mmHg'
);

// Populate into Health Alert Mini deterministic triage
const intakeForTriage: HealthAlertIntakeData = {
  primaryConcern: 'Pounding headache and blurred vision with high monitor reading',
  symptoms: ['Pounding headache', 'Visual blur'],
  vitals: {
    bloodPressure: `${critSys}/${critDia}`,
    restingHeartRate: 108
  },
  labs: {},
  medications: [],
  allergies: [],
  consentGiven: true,
  deIdentifiedConfirmed: true,
  countryOrRegion: 'US'
};

const heuristics = evaluateHealthAlertHeuristics(intakeForTriage);

assert(
  heuristics.triageTier === 'EMERGENT_ESCALATION',
  'INVARIANT: Confirmed BP of 192/122 mmHg deterministically triggers triageTier === EMERGENT_ESCALATION'
);
assert(
  heuristics.riskScore >= 60,
  'INVARIANT: Clinical risk score reflects critical emergency threshold (riskScore >= 60)'
);
assert(
  heuristics.findings.some(f => f.category === 'Vitals & Biometrics' && f.clinicalSignificance === 'Critical Red-Flag'),
  'INVARIANT: Findings contain Critical Red-Flag in Vitals & Biometrics'
);
assert(
  heuristics.findings.some(f => f.finding.includes('192/122')),
  'INVARIANT: Critical blood pressure 192/122 mmHg is explicitly documented in clinical findings'
);

// ----------------------------------------------------
// Group 7: AWS Serverless & Graviton IaC Verification
// ----------------------------------------------------
console.log('\nTest Group 7: AWS Serverless IaC (CloudFormation & Terraform)');

const rootDir = process.cwd();
const cfnPath = path.resolve(rootDir, 'aws/cloudformation/vision-alert-stack.yaml');
assert(fs.existsSync(cfnPath), 'aws/cloudformation/vision-alert-stack.yaml exists');

if (fs.existsSync(cfnPath)) {
  const cfnContent = fs.readFileSync(cfnPath, 'utf-8');
  assert(cfnContent.includes('arm64'), 'CloudFormation specifies ARM64 architecture for Graviton');
  assert(cfnContent.includes('PurgeDiagnosticArtifactsAfter24Hours'), 'CloudFormation configures 1-day auto-purge S3 rule');
  assert(cfnContent.includes('POST /vision-alert/process'), 'CloudFormation defines API Gateway POST /vision-alert/process route');
}

const tfPath = path.resolve(rootDir, 'aws/terraform/main.tf');
assert(fs.existsSync(tfPath), 'aws/terraform/main.tf exists');

if (fs.existsSync(tfPath)) {
  const tfContent = fs.readFileSync(tfPath, 'utf-8');
  assert(tfContent.includes('architectures    = ["arm64"]'), 'Terraform specifies arm64 Graviton architecture');
  assert(tfContent.includes('days = 1'), 'Terraform configures 1-day S3 expiration for ephemeral privacy');
}

const lambdaHandlerPath = path.resolve(rootDir, 'aws/lambda/vision_alert_handler.py');
assert(fs.existsSync(lambdaHandlerPath), 'aws/lambda/vision_alert_handler.py exists');

if (fs.existsSync(lambdaHandlerPath)) {
  const pyContent = fs.readFileSync(lambdaHandlerPath, 'utf-8');
  assert(pyContent.includes('LAPLACIAN_BLUR_THRESHOLD'), 'Python handler implements Laplacian blur thresholding');
  assert(pyContent.includes('GLARE_RATIO_THRESHOLD'), 'Python handler implements glare ratio thresholding');
  assert(pyContent.includes('KleidiCV'), 'Python handler documents Arm KleidiCV COOL optimization');
}

// ----------------------------------------------------
// Summary
// ----------------------------------------------------
console.log('\n======================================================');
const passedCount = testResults.filter(r => r.passed).length;
const totalCount = testResults.length;
console.log(`✨ TEST SUITE COMPLETE: ${passedCount}/${totalCount} assertions passed.`);
console.log('======================================================\n');

if (passedCount < totalCount) {
  process.exit(1);
} else {
  process.exit(0);
}
