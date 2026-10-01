// ==========================================
// HEDERA HARNESS: MASTER VALIDATION RUNNER
// Tiered Validation Suite (Tiers 1 - 5)
// ==========================================

import fs from 'fs';
import path from 'path';
import { validateTier1 } from './validators/tier1_schema_crypto';
import { validateTier2 } from './validators/tier2_privacy_security';
import { validateTier3 } from './validators/tier3_hcs_transaction';
import { validateTier4 } from './validators/tier4_mirror_node';
import { validateTier5 } from './validators/tier5_e2e_tamper';

interface HarnessReport {
  timestamp: string;
  harnessVersion: string;
  platform: string;
  totalTiers: number;
  passedTiers: number;
  allTiersPassed: boolean;
  totalChecks: number;
  passedChecks: number;
  tiers: Array<{
    tier: number;
    name: string;
    passed: boolean;
    checksTotal: number;
    checksPassed: number;
    failures: string[];
  }>;
}

async function runHarness() {
  console.log('🛡️ ===============================================================');
  console.log('   HEDERA HARNESS: TIERED VALIDATION ENGINE v1.0');
  console.log('   Dr. T Healthcare Ecosystem & Hedera Commons Trust Center');
  console.log('=================================================================\n');

  const startTime = Date.now();
  const tiersToRun = [
    validateTier1,
    validateTier2,
    validateTier3,
    validateTier4,
    validateTier5
  ];

  const results = [];
  let totalChecks = 0;
  let passedChecks = 0;
  let passedTiers = 0;

  for (const validator of tiersToRun) {
    try {
      const res = await validator();
      results.push(res);
      totalChecks += res.checksTotal;
      passedChecks += res.checksPassed;
      if (res.passed) {
        passedTiers++;
        console.log(`✅ [TIER ${res.tier}] ${res.name}: ALL ${res.checksPassed}/${res.checksTotal} CHECKS PASSED`);
      } else {
        console.error(`❌ [TIER ${res.tier}] ${res.name}: FAILED (${res.checksPassed}/${res.checksTotal} checks passed)`);
        for (const fail of res.failures) {
          console.error(`   - Failure: ${fail}`);
        }
      }
    } catch (err: any) {
      console.error(`❌ Validator crashed:`, err);
      results.push({
        tier: 0,
        name: 'Validator Execution Error',
        passed: false,
        checksTotal: 1,
        checksPassed: 0,
        failures: [err.message || 'Execution crash']
      });
      totalChecks += 1;
    }
  }

  const durationMs = Date.now() - startTime;
  const allTiersPassed = passedTiers === tiersToRun.length;

  console.log('\n=================================================================');
  console.log(`📊 HARNESS SUMMARY: ${passedTiers}/${tiersToRun.length} Tiers Passed | ${passedChecks}/${totalChecks} Checks Passed (${((passedChecks / totalChecks) * 100).toFixed(1)}%)`);
  console.log(`⏱️ Duration: ${durationMs}ms`);
  console.log(`🏁 Final Verdict: ${allTiersPassed ? 'ACCEPTED & CERTIFIED' : 'REJECTED'}`);
  console.log('=================================================================\n');

  // Save report to hedera-harness-report.json
  const report: HarnessReport = {
    timestamp: new Date().toISOString(),
    harnessVersion: '1.0.0',
    platform: 'Dr. T & Hedera Commons',
    totalTiers: tiersToRun.length,
    passedTiers,
    allTiersPassed,
    totalChecks,
    passedChecks,
    tiers: results
  };

  const reportPath = path.join(process.cwd(), 'hedera-harness-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`📄 Saved machine-readable report to: ${reportPath}`);

  if (!allTiersPassed) {
    process.exit(1);
  }
}

runHarness().catch(err => {
  console.error('Fatal Harness error:', err);
  process.exit(1);
});
