// ==========================================
// HEDERA HARNESS: TIER 2 VALIDATOR
// Privacy, HIPAA/GDPR & Zero-PHI Compliance
// ==========================================

import { enforcePrivacyPolicy } from '../../src/modules/hedera/privacyFilter';
import { computeSha256 } from '../../src/modules/hedera/canonicalizer';
import fs from 'fs';
import path from 'path';

export interface ValidationResult {
  tier: number;
  name: string;
  passed: boolean;
  checksTotal: number;
  checksPassed: number;
  failures: string[];
}

export async function validateTier2(): Promise<ValidationResult> {
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

  // Check 1: SENSITIVE classification strips all raw metadata
  const sensitiveClinicalDoc = {
    patientName: "Jane Smith",
    mrn: "MRN-102938",
    icd10: "E61.1",
    clinicalNotes: "Patient displays extreme fatigue and diminished ferritin."
  };

  const privacyCheck = enforcePrivacyPolicy({
    artifactId: "art-clinical-patient-encounter",
    artifactType: "document",
    artifactTitle: "Clinical Encounter Evaluation",
    version: "1.0.0",
    contentHash: computeSha256(sensitiveClinicalDoc).hash,
    privacyClassification: "SENSITIVE",
    actorId: "DR_T_CLINICIAN",
    rawContent: sensitiveClinicalDoc
  });

  const serializedMsg = JSON.stringify(privacyCheck.sanitizedMessage);
  runCheck(
    privacyCheck.allowed &&
    !serializedMsg.includes("Jane Smith") &&
    !serializedMsg.includes("MRN-102938") &&
    !serializedMsg.includes("diminished ferritin"),
    'Zero-PHI Guard strictly strips patient names, MRN, and diagnostic text from on-chain HCS message'
  );

  // Check 2: Sensitive pattern in title triggers rejection
  const violationCheck = enforcePrivacyPolicy({
    artifactId: "art-bad-title",
    artifactType: "document",
    artifactTitle: "Patient SSN 123-45-6789 Records",
    version: "1.0.0",
    contentHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    privacyClassification: "PUBLIC"
  });

  runCheck(
    violationCheck.allowed === false && violationCheck.violations.length > 0,
    'Prohibited identity tokens (e.g. SSN patterns) in public artifact titles are actively rejected'
  );

  // Check 3: Client bundle security audit (Verify no hardcoded private keys in src/components or src/modules)
  const clientDir = path.join(process.cwd(), 'src');
  let hasLeakedKey = false;
  
  function scanDirForKeys(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory() && entry.name !== 'node_modules') {
        scanDirForKeys(fullPath);
      } else if (/\.(ts|tsx|js|json)$/.test(entry.name)) {
        const text = fs.readFileSync(fullPath, 'utf8');
        // Search for accidental hardcoded hex/DER 32-byte private keys
        if (text.includes('302e020100300506032b657004220420') && !entry.name.includes('test')) {
          hasLeakedKey = true;
        }
      }
    }
  }

  scanDirForKeys(clientDir);
  runCheck(!hasLeakedKey, 'Static code audit: Zero hardcoded Hedera private keys present in src/ directory');

  // Check 4: Actor ID anonymization on SENSITIVE records
  runCheck(
    privacyCheck.sanitizedMessage.actorId === 'ANONYMIZED_ACTOR',
    'Clinician/User actor identifier is anonymized on SENSITIVE clinical records'
  );

  return {
    tier: 2,
    name: "Tier 2: Privacy, HIPAA/GDPR & Zero-PHI Compliance",
    passed: failures.length === 0,
    checksTotal,
    checksPassed,
    failures
  };
}
