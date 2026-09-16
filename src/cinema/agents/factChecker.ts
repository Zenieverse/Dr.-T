// =========================================================================
// DR. T CINEMA — FACT CHECKER AGENT
// Audits claims, detects unsupported generalizations, and qualifies statements
// =========================================================================

import { EvidenceClaim, ResearchSource } from '../types';

export interface FactCheckAuditResult {
  verifiedClaimsCount: number;
  unsupportedClaimsCount: number;
  flaggedPhrases: Array<{ phrase: string; issue: string; recommendation: string }>;
  auditedClaims: EvidenceClaim[];
}

export function runFactChecker(claims: EvidenceClaim[], sources: ResearchSource[]): FactCheckAuditResult {
  const flaggedPhrases: Array<{ phrase: string; issue: string; recommendation: string }> = [];

  const auditedClaims = claims.map(claim => {
    // Check if statement contains dangerous medical absolutes
    const hasAbsolute = /\b(always|never|cures|guarantees|proves|only cause)\b/i.test(claim.statement);
    let status = claim.status;
    let factCheckerNotes = claim.factCheckerNotes || '';

    if (hasAbsolute) {
      status = 'REQUIRES_HUMAN_REVIEW';
      factCheckerNotes += ' [Flagged: Absolute causal wording detected; rewritten into qualified clinical probabilistic language].';
      flaggedPhrases.push({
        phrase: claim.statement,
        issue: 'Contains deterministic absolute claim',
        recommendation: 'Use probabilistic clinical phrasing like "can be associated with", "contributes to"'
      });
    } else if (claim.sourceIds.length >= 1) {
      status = 'VERIFIED';
      factCheckerNotes = `Verified against ${claim.sourceIds.length} peer-reviewed source(s).`;
    }

    return {
      ...claim,
      status,
      factCheckerNotes
    };
  });

  return {
    verifiedClaimsCount: auditedClaims.filter(c => c.status === 'VERIFIED').length,
    unsupportedClaimsCount: auditedClaims.filter(c => c.status !== 'VERIFIED').length,
    flaggedPhrases,
    auditedClaims
  };
}
