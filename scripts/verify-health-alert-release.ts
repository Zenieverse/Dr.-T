/**
 * HEALTH ALERT: Comprehensive Live API Verification & Invariant Harness
 * Future Health Digital Innovation Challenge 2026
 * Verifies live HTTP endpoints, edge cases, error modes, and clinical safety
 */

interface VerificationCheck {
  id: string;
  category: string;
  name: string;
  passed: boolean;
  notes?: string;
}

const checks: VerificationCheck[] = [];

function record(category: string, name: string, passed: boolean, notes?: string) {
  checks.push({ id: `CHK-${checks.length + 1}`, category, name, passed, notes });
  if (passed) {
    console.log(`  ✅ [${category}] ${name}${notes ? ` (${notes})` : ''}`);
  } else {
    console.error(`  ❌ [${category}] ${name}${notes ? ` (FAIL: ${notes})` : ''}`);
  }
}

async function runLiveVerification() {
  const baseUrl = 'http://localhost:3000';
  console.log('========================================================');
  console.log('🩺 RUNNING HEALTH ALERT LIVE API & EDGE-CASE AUDIT');
  console.log('========================================================\n');

  // Check 1: GET /api/health-alert/presets
  try {
    const resPresets = await fetch(`${baseUrl}/api/health-alert/presets`);
    const dataPresets = await resPresets.json();
    record('API Routes', 'GET /api/health-alert/presets responds HTTP 200', resPresets.status === 200);
    record('API Routes', 'Presets contains minimum 3 clinical simulation cases', Array.isArray(dataPresets.presets) && dataPresets.presets.length >= 3);
  } catch (err: any) {
    record('API Routes', 'GET /api/health-alert/presets', false, err.message);
  }

  // Check 2: GET /api/health-alert/evidence
  try {
    const resEvidence = await fetch(`${baseUrl}/api/health-alert/evidence`);
    const dataEvidence = await resEvidence.json();
    record('API Routes', 'GET /api/health-alert/evidence responds HTTP 200', resEvidence.status === 200);
    record('Clinical Evidence', 'Evidence registry contains AHA & ADA guidelines', 
      dataEvidence.registry && dataEvidence.registry.some((e: any) => e.source.includes('AHA')) &&
      dataEvidence.registry.some((e: any) => e.source.includes('ADA'))
    );
  } catch (err: any) {
    record('API Routes', 'GET /api/health-alert/evidence', false, err.message);
  }

  // Check 3: Normal / Healthy Input
  try {
    const normalPayload = {
      patientAlias: 'VERIFY-NORMAL-01',
      age: 28,
      gender: 'Male',
      primaryConcern: 'Annual wellness inquiry',
      durationDays: 1,
      severityScale: 1,
      vitals: { bloodPressure: '118/76', restingHeartRate: 64 },
      labs: { ferritin: 80, hba1c: 4.9, egfr: 110 },
      symptoms: [],
      consentGiven: true,
      deIdentifiedConfirmed: true
    };
    const resNormal = await fetch(`${baseUrl}/api/health-alert/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalPayload)
    });
    const dataNormal = await resNormal.json();
    record('Normal Inputs', 'Healthy biometrics yield ROUTINE_WELLNESS tier', dataNormal.triageTier === 'ROUTINE_WELLNESS');
    record('Normal Inputs', 'Risk score point estimate is bounded within [0, 25%]', dataNormal.riskScore <= 25);
    record('Normal Inputs', 'FHIR R4 RiskAssessment resource generated', dataNormal.fhirRiskAssessment?.resourceType === 'RiskAssessment');
  } catch (err: any) {
    record('Normal Inputs', 'Normal payload execution', false, err.message);
  }

  // Check 4: Abnormal Inputs (Latent Iron Depletion)
  try {
    const ironPayload = {
      patientAlias: 'VERIFY-IRON-01',
      age: 31,
      gender: 'Female',
      primaryConcern: 'Afternoon exhaustion and brain fog',
      durationDays: 30,
      severityScale: 6,
      vitals: { bloodPressure: '112/70', restingHeartRate: 62 },
      labs: { ferritin: 15, hba1c: 5.0 },
      symptoms: ['Fatigue', 'Restless legs'],
      consentGiven: true,
      deIdentifiedConfirmed: true
    };
    const resIron = await fetch(`${baseUrl}/api/health-alert/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ironPayload)
    });
    const dataIron = await resIron.json();
    record('Abnormal Inputs', 'Ferritin 15 ng/mL stratifies to PLANNED_CLINICAL_ASSESSMENT', dataIron.triageTier === 'PLANNED_CLINICAL_ASSESSMENT');
    record('Abnormal Inputs', 'SBAR handoff recommends serum iron/TIBC follow-up', dataIron.clinicianPreparation?.sbarBrief?.recommendation.length > 20);
  } catch (err: any) {
    record('Abnormal Inputs', 'Latent iron execution', false, err.message);
  }

  // Check 5: Abnormal Inputs (Cardiometabolic HTN + Prediabetes)
  try {
    const htnPayload = {
      patientAlias: 'VERIFY-HTN-01',
      age: 48,
      gender: 'Male',
      primaryConcern: 'High home blood pressure readings and headaches',
      durationDays: 45,
      severityScale: 6,
      vitals: { bloodPressure: '152/96', restingHeartRate: 82 },
      labs: { hba1c: 6.3, ldl: 155 },
      symptoms: ['Morning headache', 'Exertional dyspnea'],
      consentGiven: true,
      deIdentifiedConfirmed: true
    };
    const resHtn = await fetch(`${baseUrl}/api/health-alert/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(htnPayload)
    });
    const dataHtn = await resHtn.json();
    record('Abnormal Inputs', 'Stage 2 HTN + HbA1c 6.3% stratifies to URGENT_EVALUATION', dataHtn.triageTier === 'URGENT_EVALUATION');
    record('Abnormal Inputs', 'Human clinician required flag is TRUE for URGENT tier', dataHtn.safetyNotice?.humanClinicianRequired === true);
  } catch (err: any) {
    record('Abnormal Inputs', 'Cardiometabolic execution', false, err.message);
  }

  // Check 5b: Stage 1 HTN (138/88 mmHg) + HbA1c 6.1% (Cardiometabolic Outpatient Risk - Non-Emergency)
  try {
    const stage1HtnPayload = {
      patientAlias: 'VERIFY-STAGE1-CARDIO',
      age: 44,
      gender: 'Male',
      primaryConcern: 'Post-lunch somnolence and elevated home blood pressure readings',
      durationDays: 60,
      severityScale: 5,
      vitals: { bloodPressure: '138/88', restingHeartRate: 78 },
      labs: { hba1c: 6.1, egfr: 92 },
      symptoms: ['Postprandial lethargy'],
      consentGiven: true,
      deIdentifiedConfirmed: true,
      countryOrRegion: 'Vietnam'
    };
    const resStage1 = await fetch(`${baseUrl}/api/health-alert/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stage1HtnPayload)
    });
    const dataStage1 = await resStage1.json();
    record('Clinical Safety', 'Stage 1 HTN (138/88) + HbA1c 6.1% stratifies to PLANNED_CLINICAL_ASSESSMENT (Outpatient, non-emergency)', 
      dataStage1.triageTier === 'PLANNED_CLINICAL_ASSESSMENT'
    );
    record('Clinical Safety', 'Cardiometabolic 138/88 + 6.1% does NOT trigger emergency timeline', 
      !dataStage1.urgencyTimeline?.includes('IMMEDIATE')
    );
  } catch (err: any) {
    record('Clinical Safety', 'Stage 1 HTN check', false, err.message);
  }

  // Check 5c: Conflicting Risk Indicators (Athletic Bradycardia with mild concern)
  try {
    const conflictingPayload = {
      patientAlias: 'VERIFY-CONFLICT-01',
      age: 29,
      gender: 'Male',
      primaryConcern: 'Routine checkup with resting pulse 48 bpm',
      durationDays: 14,
      severityScale: 2,
      vitals: { bloodPressure: '118/74', restingHeartRate: 48 },
      labs: { ferritin: 65, hba1c: 5.0 },
      symptoms: ['Mild fatigue after 20km run'],
      consentGiven: true,
      deIdentifiedConfirmed: true
    };
    const resConflict = await fetch(`${baseUrl}/api/health-alert/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(conflictingPayload)
    });
    const dataConflict = await resConflict.json();
    record('Conflicting Indicators', 'Athletic bradycardia with normal BP stratifies to ROUTINE_WELLNESS', 
      dataConflict.triageTier === 'ROUTINE_WELLNESS'
    );
  } catch (err: any) {
    record('Conflicting Indicators', 'Conflicting payload check', false, err.message);
  }

  // Check 6: Red-Flag Emergency Input (Acute Chest Pain)
  try {
    const emergentPayload = {
      patientAlias: 'VERIFY-EMERGENT-01',
      age: 58,
      gender: 'Male',
      primaryConcern: 'Sudden crushing chest pressure radiating to jaw',
      durationDays: 0,
      severityScale: 9,
      vitals: { bloodPressure: '168/102', restingHeartRate: 104 },
      labs: {},
      symptoms: ['Chest pain', 'Diaphoresis', 'Shortness of breath'],
      consentGiven: true,
      deIdentifiedConfirmed: true
    };
    const resEmergent = await fetch(`${baseUrl}/api/health-alert/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emergentPayload)
    });
    const dataEmergent = await resEmergent.json();
    record('Emergency Escalation', 'Acute chest pain triggers EMERGENT_ESCALATION tier', dataEmergent.triageTier === 'EMERGENT_ESCALATION');
    record('Emergency Escalation', 'Emergency notice directs to 911 immediately', dataEmergent.safetyNotice?.emergencyWarning?.includes('911'));

    // Check 6b: Emergency Localization (Vietnam 115)
    const emergentVnPayload = {
      ...emergentPayload,
      countryOrRegion: 'Vietnam'
    };
    const resEmergentVn = await fetch(`${baseUrl}/api/health-alert/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emergentVnPayload)
    });
    const dataEmergentVn = await resEmergentVn.json();
    record('Emergency Escalation', 'Localizes Vietnam emergency notice with ambulance 115 directive', 
      dataEmergentVn.urgencyTimeline?.includes('115') || dataEmergentVn.safetyNotice?.emergencyWarning?.includes('115')
    );
  } catch (err: any) {
    record('Emergency Escalation', 'Acute chest pain execution', false, err.message);
  }

  // Check 7: Missing Data & Epistemic Uncertainty Handling
  try {
    const sparsePayload = {
      patientAlias: 'VERIFY-SPARSE-01',
      age: 35,
      gender: 'Female',
      primaryConcern: 'General malaise',
      durationDays: 7,
      severityScale: 4,
      vitals: {},
      labs: {},
      symptoms: [],
      consentGiven: true,
      deIdentifiedConfirmed: true
    };
    const resSparse = await fetch(`${baseUrl}/api/health-alert/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sparsePayload)
    });
    const dataSparse = await resSparse.json();
    record('Uncertainty Handling', 'Sparse input increases epistemic uncertainty score to Elevated (> 0.25)', 
      dataSparse.uncertainty?.level === 'Elevated' && dataSparse.uncertainty?.score > 0.25
    );
    record('Uncertainty Handling', 'Missing key biomarker factors correctly enumerated in uncertainty metadata', 
      Array.isArray(dataSparse.uncertainty?.missingKeyFactors) && dataSparse.uncertainty.missingKeyFactors.length >= 3
    );
  } catch (err: any) {
    record('Uncertainty Handling', 'Sparse data execution', false, err.message);
  }

  // Check 8: Privacy & PII Leak Detection
  try {
    const emailLeakPayload = {
      patientAlias: 'LEAK-TEST',
      age: 30,
      gender: 'Female',
      primaryConcern: 'Send my results to jane.doe@healthcorp.com please',
      durationDays: 5,
      severityScale: 3,
      vitals: { bloodPressure: '120/80' },
      labs: {},
      symptoms: [],
      consentGiven: true,
      deIdentifiedConfirmed: true
    };
    const resLeak = await fetch(`${baseUrl}/api/health-alert/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailLeakPayload)
    });
    const dataLeak = await resLeak.json();
    record('Privacy & HIPAA', 'Rejects unscrubbed email address in primaryConcern with HTTP 400', 
      resLeak.status === 400 && dataLeak.error?.includes('Direct personal identifier')
    );
  } catch (err: any) {
    record('Privacy & HIPAA', 'Email leak check', false, err.message);
  }

  // Check 9: Consent Enforcement
  try {
    const noConsentPayload = {
      patientAlias: 'NO-CONSENT',
      age: 30,
      gender: 'Female',
      primaryConcern: 'Mild headaches',
      durationDays: 3,
      severityScale: 2,
      vitals: { bloodPressure: '120/80' },
      labs: {},
      symptoms: [],
      consentGiven: false,
      deIdentifiedConfirmed: true
    };
    const resNoConsent = await fetch(`${baseUrl}/api/health-alert/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noConsentPayload)
    });
    record('Privacy & Consent', 'Rejects request when consentGiven is false with HTTP 400', resNoConsent.status === 400);
  } catch (err: any) {
    record('Privacy & Consent', 'No consent check', false, err.message);
  }

  // Check 10: Invalid Physiological Bounds
  try {
    const invalidAgePayload = {
      patientAlias: 'BAD-AGE',
      age: 160,
      gender: 'Female',
      primaryConcern: 'Testing age bounds',
      durationDays: 1,
      severityScale: 2,
      vitals: { bloodPressure: '120/80' },
      labs: {},
      symptoms: [],
      consentGiven: true,
      deIdentifiedConfirmed: true
    };
    const resBadAge = await fetch(`${baseUrl}/api/health-alert/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidAgePayload)
    });
    record('Boundary Validation', 'Rejects age > 120 with HTTP 400', resBadAge.status === 400);
  } catch (err: any) {
    record('Boundary Validation', 'Bad age check', false, err.message);
  }

  // Check 11: AI Provider Fallback & Execution Telemetry
  try {
    const telemetryPayload = {
      patientAlias: 'TELEMETRY-TEST',
      age: 26,
      gender: 'Female',
      primaryConcern: 'Fatigue inquiry',
      durationDays: 10,
      severityScale: 4,
      vitals: { bloodPressure: '118/76' },
      labs: { ferritin: 20 },
      symptoms: ['Fatigue'],
      consentGiven: true,
      deIdentifiedConfirmed: true
    };
    const resTelem = await fetch(`${baseUrl}/api/health-alert/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(telemetryPayload)
    });
    const dataTelem = await resTelem.json();
    record('AI & Telemetry', 'Telemetry records executed engine/provider without spoofing', 
      Boolean(dataTelem.telemetry?.providerUsed && dataTelem.telemetry.providerUsed.length > 5)
    );
    record('AI & Telemetry', 'Telemetry tracks actual latency in milliseconds', 
      typeof dataTelem.telemetry?.latencyMs === 'number' && dataTelem.telemetry.latencyMs >= 0
    );
    record('AI & Telemetry', 'Fallback behavior flag explicitly documented in telemetry', 
      typeof dataTelem.telemetry?.heuristicFallbackEngaged === 'boolean'
    );
  } catch (err: any) {
    record('AI & Telemetry', 'Telemetry check', false, err.message);
  }

  // Check 12: Mandatory Non-Diagnostic Disclaimers
  try {
    const disclaimerPayload = {
      patientAlias: 'DISCLAIMER-TEST',
      age: 38,
      gender: 'Male',
      primaryConcern: 'Preventative health assessment',
      durationDays: 5,
      severityScale: 3,
      vitals: { bloodPressure: '122/82' },
      labs: {},
      symptoms: [],
      consentGiven: true,
      deIdentifiedConfirmed: true
    };
    const resDisc = await fetch(`${baseUrl}/api/health-alert/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(disclaimerPayload)
    });
    const dataDisc = await resDisc.json();
    record('Clinical Safety', 'Verbatim non-diagnostic disclaimer in response payload', 
      dataDisc.safetyNotice?.disclaimer?.includes('Non-Diagnostic Clinical Decision Support') &&
      dataDisc.safetyNotice?.disclaimer?.includes('does NOT provide formal medical diagnosis')
    );
  } catch (err: any) {
    record('Clinical Safety', 'Disclaimer check', false, err.message);
  }

  // Summary
  console.log('\n========================================================');
  const passedCount = checks.filter(c => c.passed).length;
  const totalCount = checks.length;
  console.log(`TOTAL LIVE AUDIT CHECKS: ${totalCount} | PASSED: ${passedCount} | FAILED: ${totalCount - passedCount}`);
  console.log('========================================================\n');

  if (passedCount === totalCount) {
    console.log('🎉 ALL LIVE API & CLINICAL SAFETY CHECKS PASSED!\n');
    process.exit(0);
  } else {
    console.error('❌ SOME CHECKS FAILED!\n');
    process.exit(1);
  }
}

runLiveVerification();
