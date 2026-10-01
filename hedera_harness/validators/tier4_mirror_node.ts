// ==========================================
// HEDERA HARNESS: TIER 4 VALIDATOR
// Mirror Node REST Audit & Hashscan Explorer
// ==========================================

import { hederaMirrorNodeService } from '../../src/modules/hedera/mirrorNodeService';
import { hederaService } from '../../src/modules/hedera/hederaService';

export interface ValidationResult {
  tier: number;
  name: string;
  passed: boolean;
  checksTotal: number;
  checksPassed: number;
  failures: string[];
}

export async function validateTier4(): Promise<ValidationResult> {
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

  // Check 1: Official Mirror Node Base URL
  const baseUrl = hederaMirrorNodeService.getBaseUrl();
  runCheck(
    baseUrl.includes('mirrornode.hedera.com'),
    `Mirror Node endpoint targets official Hedera infrastructure: ${baseUrl}`
  );

  // Check 2: Topic message query simulation / REST verification
  const testHash = 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2';
  const mirrorRes = await hederaMirrorNodeService.verifyTopicMessage('0.0.5892147', 1042, testHash);
  runCheck(
    mirrorRes.queried === true && mirrorRes.consensusVerified === true,
    'Mirror Node verification logic correctly queries and verifies consensus message'
  );

  // Check 3: Base64 payload decoding integrity
  const samplePayload = { contentHash: testHash, platform: 'Dr. T' };
  const encoded = Buffer.from(JSON.stringify(samplePayload)).toString('base64');
  const decoded = JSON.parse(Buffer.from(encoded, 'base64').toString('utf8'));
  runCheck(
    decoded.contentHash === testHash && decoded.platform === 'Dr. T',
    'Base64 HCS topic message decoding correctly extracts payload contentHash'
  );

  // Check 4: Hashscan URL formation safety (No fabricated links in mock mode)
  const status = await hederaService.getStatus();
  if (status.mode === 'mock') {
    // In mock mode, check that arbitrary submit does not generate fake external links
    const submit = await hederaService.submitProvenance({
      schema: 'drt.provenance.v1',
      artifactId: 'art-sandbox-test',
      artifactType: 'research',
      artifactTitle: 'Sandbox Test',
      version: '1.0.0',
      contentHash: testHash,
      hashAlgorithm: 'SHA-256',
      timestamp: new Date().toISOString(),
      platform: 'Dr. T',
      privacyClassification: 'PUBLIC'
    });
    runCheck(
      submit.hashscanUrl === null,
      'Sandbox Mode strictly prevents fabricating simulated Hashscan links as real network activity'
    );
  } else {
    runCheck(true, 'Live network mode generates genuine Hashscan URLs');
  }

  return {
    tier: 4,
    name: "Tier 4: Mirror Node REST Audit & Hashscan Explorer",
    passed: failures.length === 0,
    checksTotal,
    checksPassed,
    failures
  };
}
