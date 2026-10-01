// ==========================================
// HEDERA HARNESS: TIER 5 VALIDATOR
// End-to-End Orchestration & Tamper Resilience
// ==========================================

import { provenanceStore } from '../../src/modules/hedera/provenanceStore';
import { generateProvenanceCertificateJson } from '../../src/modules/hedera/certificateGenerator';

export interface ValidationResult {
  tier: number;
  name: string;
  passed: boolean;
  checksTotal: number;
  checksPassed: number;
  failures: string[];
}

export async function validateTier5(): Promise<ValidationResult> {
  const failures: string[] = [];
  let checksPassed = 0;
  let checksTotal = 0;

  function runCheck(condition: boolean, desc: string) {
    checksTotal++;
    if (condition) {
      checksPassed++;
    } else {
      failures.push(desc);
    }
  }

  // Check 1: Register real artifact in store
  const originalPayload = {
    studyId: "EXP-2026-LONGEVITY-01",
    author: "Dr. T Polymath Consortium",
    biomarkers: { ferritin: 35, sleepEfficiencyPct: 91.5 },
    findings: "Mitochondrial metabolic flux stabilized"
  };

  const reg = await provenanceStore.register({
    artifactId: "art-e2e-tamper-test",
    artifactType: "research",
    artifactTitle: "E2E Tamper Resistance Evaluation Study",
    artifactVersion: "1.0.0",
    content: originalPayload,
    privacyClassification: "PUBLIC"
  });

  runCheck(
    reg.record && reg.record.verificationStatus === 'VERIFIED',
    `Artifact successfully registered and anchored with initial status VERIFIED (Record ID: ${reg.record?.id})`
  );

  // Check 2: Verify against untouched payload
  const verifyUntouched = await provenanceStore.verify({
    recordId: reg.record.id,
    content: originalPayload
  });

  runCheck(
    verifyUntouched.status === 'VERIFIED' && verifyUntouched.hashesMatch === true,
    'Untouched artifact verification returns VERIFIED with exact hash match'
  );

  // Check 3: Tamper with single field in payload -> MUST fail
  const tamperedPayload = {
    ...originalPayload,
    findings: "Mitochondrial metabolic flux corrupted" // Altered single word
  };

  const verifyTampered = await provenanceStore.verify({
    recordId: reg.record.id,
    content: tamperedPayload
  });

  runCheck(
    verifyTampered.status === 'INTEGRITY_CHECK_FAILED' && verifyTampered.hashesMatch === false,
    'Tampered payload triggers INTEGRITY_CHECK_FAILED with audible failure'
  );

  // Check 4: Query non-existent ID
  const verifyNonExistent = await provenanceStore.verify({
    artifactId: "art-non-existent-99999",
    content: originalPayload
  });

  runCheck(
    verifyNonExistent.status === 'RECORD_NOT_FOUND',
    'Non-existent artifact lookup safely returns RECORD_NOT_FOUND'
  );

  // Check 5: Certificate generator contains exact consensus properties
  const certJson = generateProvenanceCertificateJson(reg.record);
  const parsedCert = JSON.parse(certJson);

  runCheck(
    parsedCert.artifact.canonicalDigest.hash === reg.record.contentHash &&
    parsedCert.hederaConsensusProof.topicId === reg.record.topicId &&
    parsedCert.hederaConsensusProof.sequenceNumber === reg.record.sequenceNumber,
    'Exported Provenance Certificate matches registered HCS topic ID, sequence number, and contentHash'
  );

  return {
    tier: 5,
    name: "Tier 5: End-to-End Orchestration & Tamper Resilience",
    passed: failures.length === 0,
    checksTotal,
    checksPassed,
    failures
  };
}
