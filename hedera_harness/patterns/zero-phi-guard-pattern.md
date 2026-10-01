# Zero-PHI & HIPAA/GDPR Compliance Guard Pattern (Hedera Harness)

## Intent
Enforce a strict architectural boundary ensuring no Protected Health Information (PHI), Personally Identifiable Information (PII), clinical diagnosis text, or cryptographic secrets are transmitted to Hedera public ledgers.

## Pattern Definition

```typescript
// Architectural Flow:
// [ Raw Document / EHR / Patient Consultation ]
//                     │
//                     ▼
//        [ Local Privacy Audit Filter ]
//                     │
//                     ▼
//      [ SHA-256 One-Way Cryptographic Digest ]
//                     │
//                     ▼
//         [ HCS Public Consensus Proof ]

export function sanitizeProvenancePayload(input: RawArtifactInput): HCSMessage {
  // 1. Scan for prohibited sensitive patterns (SSN, MRN, phone, diagnosis codes)
  for (const pattern of SENSITIVE_PATTERNS) {
    if (pattern.test(input.title) || pattern.test(JSON.stringify(input.metadata))) {
      throw new Error(`Privacy Violation: Sensitive pattern detected in public metadata.`);
    }
  }

  // 2. Strict Zero-Data Rule for SENSITIVE & PRIVATE classifications
  // Only the irreversible SHA-256 hash is emitted.
  return {
    schema: 'drt.provenance.v1',
    artifactId: input.id,
    contentHash: computeSha256(input.content).hash,
    privacyClassification: input.privacyTier,
    timestamp: new Date().toISOString()
  };
}
```

## Invariants
1. Private health information must remain in off-chain encrypted databases.
2. An on-chain hash is irreversible and satisfies HIPAA de-identification standards (45 CFR § 164.514).
3. Secret keys and credentials must never appear in frontend browser bundles.
