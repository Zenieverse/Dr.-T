import fs from 'fs';
import http from 'http';
import os from 'os';
import path from 'path';
import {
  PopulationHealthService,
  AuthorizationError,
  ValidationError,
} from '../src/server/populationHealthService';
import {
  authenticatePopulationHeaders,
  deriveServerRoleFromFirebaseClaims,
  HttpAuthError,
  mintGuestDemoToken,
  verifyGuestDemoToken,
} from '../src/server/populationHealthAuth';
import {
  assessParticipantPopulationSignals,
  containsDirectIdentifier,
  validateObservationQuality,
} from '../src/server/populationHealthEngine';
import {
  POP_COLLECTIONS,
  probePopulationFirestorePersistence,
} from '../src/server/populationHealthFirestoreStore';
import { PopulationParticipant } from '../src/types/populationHealth';

let passed = 0;
let failed = 0;

function assert(condition: boolean, label: string, detail = '') {
  if (condition) {
    console.log(`✅ PASS: ${label}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${label}${detail ? ` — ${detail}` : ''}`);
    failed++;
  }
}

function assertThrows(fn: () => unknown, errClass: new (...args: any[]) => Error, label: string) {
  try {
    fn();
    console.error(`❌ FAIL: ${label} — Expected ${errClass.name} but succeeded`);
    failed++;
  } catch (err) {
    if (err instanceof errClass) {
      console.log(`✅ PASS: ${label}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${label} — Threw ${(err as Error).name}: ${(err as Error).message}`);
      failed++;
    }
  }
}

async function assertRejects(
  fn: () => Promise<unknown>,
  errClass: new (...args: any[]) => Error,
  label: string
) {
  try {
    await fn();
    console.error(`❌ FAIL: ${label} — Expected ${errClass.name} rejection but succeeded`);
    failed++;
  } catch (err) {
    if (err instanceof errClass) {
      console.log(`✅ PASS: ${label}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${label} — Rejected with ${(err as Error).name}: ${(err as Error).message}`);
      failed++;
    }
  }
}

async function runTests() {
  console.log('===============================================================');
  console.log('🩺 DR. T — COMMUNITY HEALTH SIGNAL INTELLIGENCE TEST SUITE');
  console.log('===============================================================\n');

  const tmpFile = path.join(os.tmpdir(), `pop-health-test-${Date.now()}.json`);
  const svc = PopulationHealthService.createIsolatedForTest(tmpFile);

  // 1. Synthetic competition demo cohorts & baseline metrics
  const dash = svc.getDashboard('population_health_manager');
  assert(dash.demoMode.active === true, 'Synthetic competition demo mode initializes active');
  assert(
    dash.demoMode.loadedTracks.includes('Blood Health') &&
      dash.demoMode.loadedTracks.includes('Cardiometabolic Health') &&
      dash.demoMode.loadedTracks.includes('Maternal Health'),
    'All 3 competition tracks (Blood, Cardiometabolic, Maternal) loaded'
  );
  assert(
    dash.kpis.consentedParticipants >= 18 && dash.kpis.revokedParticipants >= 1,
    'Registry separates active consented participants from consent-revoked records'
  );
  assert(
    Boolean(dash.persistenceStatus && dash.emergencyGuidance && dash.complianceMetadata),
    'Dashboard returns honest persistenceStatus, emergencyGuidance, and complianceMetadata'
  );

  // 2. Consent withdrawal guardrail
  const revokedInObs = dash.observations.some((o) => o.participantId === 'PART-SYN-REV-01');
  const revokedInRisk = dash.riskSignals.some((s) => s.participantId === 'PART-SYN-REV-01');
  assert(
    !revokedInObs && !revokedInRisk,
    'Consent-revoked participant excluded from observations and population risk intelligence'
  );
  assertThrows(
    () =>
      svc.ingestObservation('clinician', {
        participantId: 'PART-SYN-REV-01',
        sourceSystem: 'COMMUNITY_SCREENING',
        metricType: 'blood_pressure',
        valueDisplay: '130/82 mmHg',
        numericValue: 130,
        secondaryNumericValue: 82,
        unit: 'mmHg',
      }),
    AuthorizationError,
    'Signal ingestion blocked with AuthorizationError for revoked consent participant'
  );

  // 3. Direct PII guardrails at intake & notes (including Vietnamese CCCD & phone)
  assert(containsDirectIdentifier('alice@example.com') === true, 'Detects email direct PII');
  assert(containsDirectIdentifier('555-234-5678') === true, 'Detects US 10-digit phone direct PII');
  assert(containsDirectIdentifier('123-45-6789') === true, 'Detects SSN direct PII');
  assert(containsDirectIdentifier('079095001234') === true, 'Detects Vietnamese 12-digit CCCD PII');
  assert(containsDirectIdentifier('+84901234567') === true, 'Detects Vietnamese +84 mobile PII');
  assert(containsDirectIdentifier('0912345678') === true, 'Detects Vietnamese 09x mobile PII');
  assert(containsDirectIdentifier('Resident D1-20 BP 146/92 mmHg') === false, 'Allows pseudonymous alias & BP reading');

  assertThrows(
    () =>
      svc.addParticipant('population_health_manager', {
        displayAlias: 'Nguyen 555-234-5678',
        age: 38,
        gender: 'Female',
        cohort: 'Blood Health',
        region: 'District 1 Clinic',
        consentGiven: true,
      }),
    ValidationError,
    'Direct PII (email / phone) blocked at intake validation'
  );

  assertThrows(
    () =>
      svc.addParticipant('programme_manager', {
        displayAlias: 'Citizen 079095001234',
        age: 34,
        gender: 'Female',
        cohort: 'Blood Health',
        region: 'District 1 Clinic',
        consentGiven: true,
      }),
    ValidationError,
    'Vietnamese 12-digit CCCD blocked at intake validation'
  );

  // 4. Signal quality validation (outlier + staleness)
  const outlierCheck = validateObservationQuality({
    metricType: 'blood_pressure',
    numericValue: 340,
    secondaryNumericValue: 180,
    unit: 'mmHg',
    recordedAt: new Date().toISOString(),
  });
  assert(outlierCheck.qualityFlag === 'OUTLIER_FLAGGED', 'Out-of-bounds physiological reading flagged as OUTLIER_FLAGGED');

  const staleCheck = validateObservationQuality({
    metricType: 'haemoglobin',
    numericValue: 12.4,
    unit: 'g/dL',
    recordedAt: new Date(Date.now() - 45 * 86400000).toISOString(),
  });
  assert(staleCheck.qualityFlag === 'STALE', 'Reading older than 30 days flagged as STALE');

  // 5. k-Anonymity suppression, filter-bypass prevention & configurable threshold
  const ruralCell = dash.kAnonymitySummary.cells.find((c) => c.label.includes('Rural Outreach South'));
  assert(
    Boolean(ruralCell && ruralCell.suppressed === true && ruralCell.elevatedRiskCount === null),
    'Subgroup cell with n=3 suppressed under k=5 anonymity threshold'
  );

  const ruralFilteredDash = svc.getDashboard('research_analyst', {
    region: 'Rural Outreach South',
  });
  assert(
    ruralFilteredDash.kpis.suppressedForPrivacy === true &&
      ruralFilteredDash.trends.length === 0 &&
      ruralFilteredDash.trendsSuppressedForPrivacy === true,
    'k-Anonymity filter-bypass prevented: filtering to n<k suppresses aggregate KPIs and trends'
  );
  const ruralJsonExport = svc.exportDeidentifiedReport('research_analyst', 'json', {
    region: 'Rural Outreach South',
  });
  const parsedRuralExport = JSON.parse(ruralJsonExport.body);
  assert(
    parsedRuralExport.suppressedForPrivacy === true &&
      parsedRuralExport.kpis.suppressedForPrivacy === true &&
      Array.isArray(parsedRuralExport.trends) &&
      parsedRuralExport.trends.length === 0,
    'JSON export preserves k-anonymity filter-bypass suppression for filtered subgroup n<k'
  );

  // 6. Explainable non-diagnostic rules & demographic threshold parity
  const baseParticipant: PopulationParticipant = {
    id: 'PARITY-A',
    syntheticCode: 'PAR-A',
    displayAlias: 'Parity A',
    isSynthetic: true,
    age: 35,
    ageBand: '30-44',
    gender: 'Female',
    cohort: 'Cardiometabolic Health',
    region: 'District 1 Clinic',
    preferredLanguage: 'en',
    dataOrigin: 'SIMULATED',
    consentStatus: 'ACTIVE',
    consentScopes: ['population_analytics'],
    riskTier: 'ROUTINE',
    priorityScore: 0,
    screeningStatus: 'UP_TO_DATE',
    activeProgrammeIds: [],
    referralStage: 'NONE',
    lastSignalAt: new Date().toISOString(),
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const parityObs = [
    {
      id: 'OBS-P1',
      participantId: 'PARITY-A',
      sourceSystem: 'COMMUNITY_SCREENING' as const,
      dataOrigin: 'SIMULATED' as const,
      metricType: 'hba1c' as const,
      metricLabel: 'HbA1c',
      valueDisplay: '7.4 %',
      numericValue: 7.4,
      unit: '%',
      referenceRange: '< 5.7%',
      qualityFlag: 'VALID' as const,
      qualityScore: 100,
      recordedAt: new Date().toISOString(),
      provenanceNote: 'Parity test',
      consentVerified: true,
    },
  ];
  const assessFemale = assessParticipantPopulationSignals(baseParticipant, parityObs);
  const assessMale = assessParticipantPopulationSignals(
    { ...baseParticipant, id: 'PARITY-B', gender: 'Male', age: 62, ageBand: '60+' },
    [{ ...parityObs[0], participantId: 'PARITY-B' }]
  );
  assert(
    assessFemale.priorityScore === assessMale.priorityScore && assessFemale.riskTier === assessMale.riskTier,
    'Demographic parity invariant holds for identical HbA1c observation across gender/age'
  );
  assert(
    assessFemale.signals[0].nonDiagnosticNotice.toLowerCase().includes('not a medical diagnosis') &&
      assessFemale.signals[0].humanReviewRequired === true &&
      assessFemale.signals[0].contributingObservations.length === 1,
    'Risk signal carries non-diagnostic disclaimer, humanReviewRequired, and contributing observation links'
  );

  // 7. Canonical Role RBAC enforcement & full analyst/viewer redaction
  const analystDash = svc.getDashboard('research_analyst');
  assert(
    analystDash.roleContext.piiRedacted === true &&
      analystDash.participants.every((p) => p.displayAlias.startsWith('Pseudonym ')) &&
      analystDash.riskSignals.every((s) => s.participantAlias.startsWith('Pseudonym ')) &&
      analystDash.referrals.every((r) => r.participantAlias.startsWith('Pseudonym ') && r.communications.length === 0) &&
      analystDash.auditLogs.every((a) => !a.actorId.startsWith('uid:')),
    'research_analyst receives redacted pseudonyms across participants, riskSignals, referrals, and auditLogs'
  );
  assertThrows(
    () =>
      svc.addParticipant('community_viewer', {
        displayAlias: 'Unauthorized Add',
        age: 30,
        gender: 'Male',
        cohort: 'Blood Health',
        region: 'District 1 Clinic',
        consentGiven: true,
      }),
    AuthorizationError,
    'community_viewer (and read_only_reviewer alias) denied participant mutation with AuthorizationError'
  );
  assertThrows(
    () => svc.exportDeidentifiedReport('read_only_reviewer', 'csv'),
    AuthorizationError,
    'read_only_reviewer denied CSV report export'
  );
  assertThrows(
    () => svc.updateGovernanceThreshold('clinician', 7),
    AuthorizationError,
    'clinician denied modifying governance kThreshold (platform_admin only)'
  );
  svc.updateGovernanceThreshold('platform_admin', 3);
  const updatedDash = svc.getDashboard('platform_admin');
  const ruralAfterK3 = updatedDash.kAnonymitySummary.cells.find((c) => c.label.includes('Rural Outreach South'));
  assert(
    updatedDash.kAnonymitySummary.kThreshold === 3 && ruralAfterK3?.suppressed === false,
    'platform_admin updates kThreshold=3 and unlocks cell with n=3'
  );
  svc.updateGovernanceThreshold('platform_admin', 5);

  // 8. Cryptographic auth fail-closed & privilege escalation checks
  await assertRejects(
    () => authenticatePopulationHeaders({ authorizationHeader: '' }),
    HttpAuthError,
    'Missing Authorization Bearer header rejected fail-closed (401)'
  );
  await assertRejects(
    () =>
      authenticatePopulationHeaders({
        authorizationHeader: 'Bearer forged.jwt.token',
        requestedRoleHeader: 'platform_admin',
      }),
    HttpAuthError,
    'Malformed Firebase ID token rejected fail-closed (401)'
  );
  const mintedGuest = mintGuestDemoToken();
  const verifiedGuest = verifyGuestDemoToken(mintedGuest.token);
  assert(
    verifiedGuest.sid === mintedGuest.sessionId,
    'Server-minted HMAC-SHA256 guest token verifies cleanly'
  );
  await assertRejects(
    () =>
      authenticatePopulationHeaders({
        authorizationHeader: `Bearer ${mintedGuest.token}tampered`,
      }),
    HttpAuthError,
    'Tampered guest HMAC token rejected (401)'
  );
  await assertRejects(
    () =>
      authenticatePopulationHeaders({
        authorizationHeader: `Bearer ${mintedGuest.token}`,
        requestedRoleHeader: 'platform_admin',
      }),
    HttpAuthError,
    'Guest Sandbox blocked from escalating to platform_admin (403)'
  );
  await assertRejects(
    () =>
      authenticatePopulationHeaders({
        authorizationHeader: `Bearer ${mintedGuest.token}`,
        requestedRoleHeader: 'clinician',
      }),
    HttpAuthError,
    'Guest Sandbox blocked from escalating to clinician (403)'
  );
  const guestAuthCtx = await authenticatePopulationHeaders({
    authorizationHeader: `Bearer ${mintedGuest.token}`,
    requestedRoleHeader: 'research_analyst',
  });
  assert(
    guestAuthCtx.isGuestSandbox === true && guestAuthCtx.canonicalRole === 'research_analyst',
    'Guest Sandbox permits bounded research_analyst preview without privilege escalation'
  );

  // Role derivation least-privilege check
  const derivedAdmin = deriveServerRoleFromFirebaseClaims({
    sub: 'uid1',
    email: 'zenieverse@gmail.com',
    email_verified: true,
    aud: 'gen-lang-client-0611153209',
    iss: 'https://securetoken.google.com/gen-lang-client-0611153209',
    iat: 1000,
    exp: 9999999999,
  });
  const derivedRegular = deriveServerRoleFromFirebaseClaims({
    sub: 'uid2',
    email: 'volunteer@example.org',
    email_verified: true,
    aud: 'gen-lang-client-0611153209',
    iss: 'https://securetoken.google.com/gen-lang-client-0611153209',
    iat: 1000,
    exp: 9999999999,
  });
  assert(
    derivedAdmin === 'platform_admin' && derivedRegular === 'community_viewer',
    'Firebase claims derive platform_admin only for verified admin and default others to least-privilege community_viewer'
  );

  // 9. Guest Sandbox session isolation & governance/erasure blocks
  const guestCtxA = {
    actorId: 'GS-TEST-A',
    authMode: 'GUEST_SANDBOX' as const,
    guestSessionId: 'GS-TEST-A',
  };
  const guestCtxB = {
    actorId: 'GS-TEST-B',
    authMode: 'GUEST_SANDBOX' as const,
    guestSessionId: 'GS-TEST-B',
  };
  const guestCreated = svc.addParticipant(
    'guest_demo',
    {
      displayAlias: 'Guest Sandbox Resident 01',
      age: 39,
      gender: 'Female',
      cohort: 'Maternal Health',
      region: 'District 1 Clinic',
      consentGiven: true,
    },
    guestCtxA
  );
  assert(
    guestCreated.isSynthetic === true && guestCreated.dataOrigin === 'SIMULATED',
    'Guest Sandbox participant is stamped isSynthetic=true and dataOrigin=SIMULATED'
  );
  const dashB = svc.getDashboard('guest_demo', undefined, guestCtxB);
  const primaryAfterGuest = svc.getDashboard('platform_admin');
  assert(
    !dashB.participants.some((p) => p.id === guestCreated.id) &&
      !primaryAfterGuest.participants.some((p) => p.id === guestCreated.id),
    'Guest Sandbox mutations are isolated per session and never leak into primary store or other guests'
  );
  assertThrows(
    () => svc.updateGovernanceThreshold('guest_demo', 3, guestCtxA),
    AuthorizationError,
    'Guest Sandbox denied MANAGE_GOVERNANCE threshold update'
  );
  assertThrows(
    () => svc.eraseParticipantData('guest_demo', guestCreated.id, guestCtxA),
    AuthorizationError,
    'Guest Sandbox denied ERASE_PARTICIPANT'
  );

  // 10. Register valid participant + dynamic consent revocation, risk signal review, and PDPL erasure
  const created = svc.addParticipant('programme_manager', {
    displayAlias: 'Community Test D1-99',
    age: 44,
    gender: 'Female',
    cohort: 'Blood Health',
    region: 'District 1 Clinic',
    preferredLanguage: 'vi',
    consentGiven: true,
  });
  svc.updateParticipantConsent('population_health_manager', created.id, 'REVOKED');
  assertThrows(
    () =>
      svc.createReferral('care_navigator', {
        participantId: created.id,
        destinationService: 'District Clinic',
        reasonSummary: 'Anaemia lab review',
      }),
    AuthorizationError,
    'Referral creation blocked after consent revoked'
  );
  svc.updateParticipantConsent('population_health_manager', created.id, 'ACTIVE');

  // 11. Health Alert Mini heuristic bridge & Presage SmartSpectra bridge
  const haBridge = svc.ingestHealthAlertBridge('clinician', created.id, {
    patientAlias: created.syntheticCode,
    age: created.age,
    gender: 'Female',
    primaryConcern: 'Elevated screening BP and fatigue',
    durationDays: 3,
    severityScale: 7,
    vitals: { bloodPressure: '154/96', restingHeartRate: 88, spo2Percent: 98 },
    labs: { ferritin: 9.5, hemoglobin: 10.2 },
    symptoms: ['Fatigue'],
    medications: [],
    allergies: [],
    consentGiven: true,
    deIdentifiedConfirmed: true,
    countryOrRegion: created.region,
  });
  assert(
    haBridge.observationsCreated.length >= 3 &&
      haBridge.observationsCreated.every((o) => o.sourceSystem === 'HEALTH_ALERT_MINI'),
    'Health Alert Mini bridge generates structured observations for BP, Ferritin & Hb'
  );
  const haGuestBridge = svc.ingestHealthAlertBridge(
    'guest_demo',
    guestCreated.id,
    {
      patientAlias: guestCreated.syntheticCode,
      age: guestCreated.age,
      gender: 'Female',
      primaryConcern: 'Gestational screening check',
      durationDays: 2,
      severityScale: 4,
      vitals: { bloodPressure: '142/90' },
      consentGiven: true,
      deIdentifiedConfirmed: true,
      countryOrRegion: guestCreated.region,
    },
    guestCtxA
  );
  assert(
    haGuestBridge.observationsCreated.every((o) => o.dataOrigin === 'SIMULATED'),
    'Health Alert Mini bridge marks Guest/Synthetic observations accurately as SIMULATED (not LIVE)'
  );

  const presageBridge = svc.ingestPresageBridge('clinician', created.id, {
    pulseRateBpm: 74,
    breathingRateRpm: 16,
    hrvRmssdMs: 41,
    isLiveHardware: false,
  });
  assert(
    presageBridge.observationsCreated.length === 3 && presageBridge.dataOrigin === 'SIMULATED',
    'Presage SmartSpectra bridge logs pulse/respiration/HRV with honest provenance'
  );

  // Risk signal status review workflow
  const createdSignals = svc.getDashboard('clinician').riskSignals.filter((s) => s.participantId === created.id);
  if (createdSignals.length > 0) {
    const reviewedSig = svc.reviewRiskSignal('clinician', createdSignals[0].id, 'ACKNOWLEDGED');
    assert(
      reviewedSig.status === 'ACKNOWLEDGED' && reviewedSig.reviewedBy === 'clinician',
      'Clinician can review and acknowledge PopulationRiskSignal'
    );
  } else {
    assert(false, 'Expected risk signals generated for elevated created participant');
  }

  // 12. 6-Stage Care Navigation & Multilingual Engagement Human Gate
  const referral = svc.createReferral('care_navigator', {
    participantId: created.id,
    destinationService: 'District 1 Haematology Clinic',
    reasonSummary: 'Ferritin & Hb follow-up',
    priority: 'PRIORITY',
  });
  const progressed = svc.advanceReferral('care_navigator', referral.id, {
    stage: 'REFERRAL_ISSUED',
    appointmentStatus: 'SCHEDULED',
    communicationNote: 'Đã đặt lịch khám kiểm tra sắt huyết thanh.',
    channel: 'SMS',
    language: 'vi',
  });
  assert(
    progressed.stage === 'REFERRAL_ISSUED' && progressed.communications.length === 1,
    'Care Navigation records stage transitions and Vietnamese outreach communication'
  );

  assertThrows(
    () => svc.gateEngagementTemplate('population_health_manager', 'ENG-MAT-01', 'SEND'),
    ValidationError,
    'Multilingual engagement dispatch blocked until human approval gate (APPROVED_TO_SEND)'
  );
  svc.gateEngagementTemplate('population_health_manager', 'ENG-MAT-01', 'APPROVE');
  const sentTpl = svc.gateEngagementTemplate('population_health_manager', 'ENG-MAT-01', 'SEND');
  assert(sentTpl.status === 'SENT', 'Approved multilingual template dispatches cleanly');

  // 13. AI Research Assistant deterministic fallback & human approval gate
  const aiRes = await svc.runAiResearchQuery(
    'research_analyst',
    'Summarize blood health ferritin gaps across districts',
    null
  );
  assert(
    aiRes.fallbackEngaged === true &&
      aiRes.isAiGenerated === false &&
      aiRes.humanApprovalStatus === 'PENDING_HUMAN_REVIEW' &&
      aiRes.citations.length >= 3 &&
      aiRes.observationalSummary.includes('De-identified Consented Cohorts'),
    'AI Research Assistant sets isAiGenerated=false on fallback, provides citations, and enters PENDING_HUMAN_REVIEW'
  );
  assertThrows(
    () => svc.approveAiSynthesis('research_analyst', aiRes.id, 'APPROVED'),
    AuthorizationError,
    'research_analyst blocked from self-approving AI synthesis (requires clinician/manager)'
  );
  const approvedAi = svc.approveAiSynthesis('clinician', aiRes.id, 'APPROVED');
  assert(approvedAi.humanApprovalStatus === 'APPROVED', 'Clinician approves AI synthesis with audit log');

  // 14. PDPL Right to Erasure
  assertThrows(
    () => svc.eraseParticipantData('clinician', created.id),
    AuthorizationError,
    'clinician denied PDPL erasure (platform_admin only)'
  );
  const erased = svc.eraseParticipantData('platform_admin', created.id);
  const dashAfterErase = svc.getDashboard('platform_admin');
  assert(
    erased.erasedParticipantId === created.id &&
      !dashAfterErase.participants.some((p) => p.id === created.id) &&
      !dashAfterErase.observations.some((o) => o.participantId === created.id) &&
      !dashAfterErase.riskSignals.some((s) => s.participantId === created.id) &&
      !dashAfterErase.referrals.some((r) => r.participantId === created.id),
    'platform_admin PDPL erasure removes participant observations, signals, and referrals cleanly'
  );

  // 15. Operational vs Clinical Outcome separation & De-identified Exports
  const csvExport = svc.exportDeidentifiedReport('research_analyst', 'csv');
  assert(
    csvExport.body.includes('Rural Outreach South') && csvExport.body.includes('<5,true,SUPPRESSED'),
    'CSV export preserves k-anonymity cell suppression for Rural Outreach South'
  );
  const impactOps = dash.impactMetrics.some((m) => m.metricType === 'OPERATIONAL');
  const impactClin = dash.impactMetrics.some((m) => m.metricType === 'CLINICAL_OUTCOME');
  assert(impactOps && impactClin, 'Impact module separates OPERATIONAL and CLINICAL_OUTCOME metrics');

  // 16. Clean reset & Demo reload + audit log verification
  const emptyDash = svc.resetDemoToClean('platform_admin');
  assert(
    emptyDash.demoMode.active === false && emptyDash.kpis.totalParticipants === 0,
    'Reset Clean clears synthetic cohorts cleanly'
  );
  const reloadedDash = svc.loadSyntheticDemo('platform_admin');
  assert(
    reloadedDash.demoMode.active === true && reloadedDash.kpis.consentedParticipants >= 18,
    'Load Demo restores full 3-track synthetic competition dataset'
  );
  assert(
    reloadedDash.auditLogs.some((l) => l.outcome === 'DENIED') &&
      reloadedDash.auditLogs.some((l) => l.outcome === 'ALLOWED'),
    'Immutable governance audit log records both ALLOWED and DENIED events'
  );

  // 17. Firestore REST v1 Durable Repository & Restart Simulation (Idempotency, PDPL Delete, Guest Isolation)
  const collections = new Map<string, Map<string, { name: string; fields: Record<string, any> }>>();
  let writeRequestCount = 0;

  const mockFirestoreServer = http.createServer((req, res) => {
    const auth = req.headers.authorization || '';
    if (auth !== 'Bearer test-firestore-token') {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: { code: 401, message: 'UNAUTHENTICATED' } }));
      return;
    }

    const reqUrl = new URL(req.url || '/', 'http://127.0.0.1');
    const prefix = '/v1/projects/gen-lang-client-0611153209/databases/ai-studio-drt-2e1619d9-9932-4538-9b6c-26b489ebfec2/documents';
    if (!reqUrl.pathname.startsWith(prefix)) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: { code: 404, message: 'Not Found' } }));
      return;
    }

    const relPath = reqUrl.pathname.slice(prefix.length).replace(/^\/+/, '');
    const parts = relPath.split('/').filter(Boolean).map((p) => decodeURIComponent(p));
    const colName = parts[0];
    const docId = parts[1];

    if (!collections.has(colName)) {
      collections.set(colName, new Map());
    }
    const colMap = collections.get(colName)!;

    let bodyRaw = '';
    req.on('data', (chunk) => {
      bodyRaw += chunk;
    });
    req.on('end', () => {
      if (req.method === 'GET' && !docId) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ documents: Array.from(colMap.values()) }));
        return;
      }
      if (req.method === 'GET' && docId) {
        const found = colMap.get(docId);
        if (!found) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: { code: 404, message: 'NOT_FOUND' } }));
          return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(found));
        return;
      }
      if (req.method === 'PATCH' && docId) {
        writeRequestCount++;
        const parsed = bodyRaw ? JSON.parse(bodyRaw) : {};
        const docRecord = {
          name: `projects/gen-lang-client-0611153209/databases/ai-studio-drt-2e1619d9-9932-4538-9b6c-26b489ebfec2/documents/${colName}/${docId}`,
          fields: parsed.fields || {},
        };
        colMap.set(docId, docRecord);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(docRecord));
        return;
      }
      if (req.method === 'POST' && !docId) {
        writeRequestCount++;
        const targetId = reqUrl.searchParams.get('documentId') || `DOC-${Date.now()}`;
        if (colMap.has(targetId)) {
          res.writeHead(409, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: { code: 409, message: 'ALREADY_EXISTS' } }));
          return;
        }
        const parsed = bodyRaw ? JSON.parse(bodyRaw) : {};
        const docRecord = {
          name: `projects/gen-lang-client-0611153209/databases/ai-studio-drt-2e1619d9-9932-4538-9b6c-26b489ebfec2/documents/${colName}/${targetId}`,
          fields: parsed.fields || {},
        };
        colMap.set(targetId, docRecord);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(docRecord));
        return;
      }
      if (req.method === 'DELETE' && docId) {
        writeRequestCount++;
        const existed = colMap.delete(docId);
        res.writeHead(existed ? 200 : 404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(existed ? {} : { error: { code: 404 } }));
        return;
      }
      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    });
  });

  await new Promise<void>((resolve) => mockFirestoreServer.listen(0, '127.0.0.1', resolve));
  const addr = mockFirestoreServer.address();
  const port = typeof addr === 'object' && addr ? addr.port : 0;
  const fsOrigin = `http://127.0.0.1:${port}`;
  const tmpFileFs1 = path.join(os.tmpdir(), `pop-health-fs1-${Date.now()}.json`);
  const tmpFileFs2 = path.join(os.tmpdir(), `pop-health-fs2-${Date.now()}.json`);

  try {
    const firestoreOpts = {
      firestoreApiOrigin: fsOrigin,
      accessTokenProvider: async () => 'test-firestore-token',
    };

    const liveProbe = await probePopulationFirestorePersistence(true, firestoreOpts);
    assert(
      liveProbe.mode === 'FIRESTORE_LIVE' && liveProbe.durableAcrossRestarts === true,
      'probePopulationFirestorePersistence detects FIRESTORE_LIVE when Firestore IAM succeeds'
    );

    const fsSvc1 = PopulationHealthService.createIsolatedForTest(tmpFileFs1, firestoreOpts);
    const init1 = await fsSvc1.initializeDurablePersistence();
    assert(
      init1.firestoreLive === true &&
        fsSvc1.isFirestoreEnabled() === true &&
        fsSvc1.getDashboard('platform_admin').persistenceStatus.mode === 'FIRESTORE_LIVE',
      'Service boot seeds Firestore and reports FIRESTORE_LIVE persistenceStatus'
    );

    // Mutate participant, consent, observation, referral + PDPL deletion of temporary record
    const durableParticipant = fsSvc1.addParticipant('programme_manager', {
      displayAlias: 'Durable Persistence D1-88',
      age: 48,
      gender: 'Female',
      cohort: 'Cardiometabolic Health',
      region: 'District 1 Clinic',
      preferredLanguage: 'vi',
      consentGiven: true,
    });
    const toEraseParticipant = fsSvc1.addParticipant('programme_manager', {
      displayAlias: 'Temporary Erasure D1-77',
      age: 51,
      gender: 'Male',
      cohort: 'Blood Health',
      region: 'District 1 Clinic',
      consentGiven: true,
    });
    fsSvc1.updateParticipantConsent('programme_manager', durableParticipant.id, 'REVOKED');
    fsSvc1.updateParticipantConsent('programme_manager', durableParticipant.id, 'ACTIVE');
    fsSvc1.ingestObservation('clinician', {
      participantId: durableParticipant.id,
      sourceSystem: 'COMMUNITY_SCREENING',
      metricType: 'hba1c',
      valueDisplay: '7.1 %',
      numericValue: 7.1,
      unit: '%',
    });
    fsSvc1.createReferral('care_navigator', {
      participantId: durableParticipant.id,
      destinationService: 'District 1 Endocrine Clinic',
      reasonSummary: 'HbA1c follow-up',
      priority: 'PRIORITY',
    });
    fsSvc1.eraseParticipantData('platform_admin', toEraseParticipant.id);
    await fsSvc1.flushFirestoreSync();

    // Verify Guest Sandbox does NOT write to Firestore
    const writesBeforeGuest = writeRequestCount;
    const fsGuestCtx = {
      actorId: 'GS-FS-TEST',
      authMode: 'GUEST_SANDBOX' as const,
      guestSessionId: 'GS-FS-TEST',
    };
    const fsGuestPart = fsSvc1.addParticipant(
      'guest_demo',
      {
        displayAlias: 'Ephemeral Guest Resident',
        age: 33,
        gender: 'Female',
        cohort: 'Maternal Health',
        region: 'District 1 Clinic',
        consentGiven: true,
      },
      fsGuestCtx
    );
    await fsSvc1.flushFirestoreSync();
    assert(
      writeRequestCount === writesBeforeGuest &&
        !collections.get(POP_COLLECTIONS.participants)?.has(fsGuestPart.id),
      'Guest Sandbox writes zero documents to Firestore REST API'
    );

    // Idempotency check: re-initializing or updating same entity does not duplicate rows
    const participantDocCountBefore = collections.get(POP_COLLECTIONS.participants)?.size || 0;
    fsSvc1.updateParticipantConsent('programme_manager', durableParticipant.id, 'ACTIVE');
    await fsSvc1.flushFirestoreSync();
    const participantDocCountAfter = collections.get(POP_COLLECTIONS.participants)?.size || 0;
    assert(
      participantDocCountAfter === participantDocCountBefore,
      'Idempotent Firestore upsert updates participant in-place without duplicates'
    );

    // Simulate process restart on completely empty local file path -> hydrate solely from Firestore
    const fsSvcRestarted = PopulationHealthService.createIsolatedForTest(tmpFileFs2, firestoreOpts);
    const init2 = await fsSvcRestarted.initializeDurablePersistence();
    const restartedDash = fsSvcRestarted.getDashboard('platform_admin');
    const survivedParticipant = restartedDash.participants.find((p) => p.id === durableParticipant.id);
    const survivedObs = restartedDash.observations.find((o) => o.participantId === durableParticipant.id);
    const survivedRef = restartedDash.referrals.find((r) => r.participantId === durableParticipant.id);
    const erasedStillGone = !restartedDash.participants.some((p) => p.id === toEraseParticipant.id);
    const guestDidNotSurvive = !restartedDash.participants.some((p) => p.id === fsGuestPart.id);
    assert(
      init2.hydratedFromFirestore === true &&
        Boolean(survivedParticipant && survivedObs && survivedRef) &&
        erasedStillGone &&
        guestDidNotSurvive &&
        restartedDash.auditLogs.length > 0,
      'Restarted server hydrates participant, observation, referral, audit logs, and PDPL deletion from Firestore'
    );
  } finally {
    await new Promise<void>((resolve) => mockFirestoreServer.close(() => resolve()));
    for (const f of [tmpFile, tmpFileFs1, tmpFileFs2]) {
      try {
        if (fs.existsSync(f)) fs.unlinkSync(f);
      } catch {
        // ignore cleanup error
      }
    }
  }

  console.log('\n===============================================================');
  console.log(`POPULATION HEALTH SUITE: ${passed} PASSED, ${failed} FAILED`);
  console.log('===============================================================');

  if (failed > 0) process.exit(1);
}

runTests().catch((err) => {
  console.error('Fatal test suite error:', err);
  process.exit(1);
});
