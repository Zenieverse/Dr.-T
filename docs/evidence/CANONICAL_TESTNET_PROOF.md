# CANONICAL HEDERA TESTNET PROVENANCE PROOF — Dr. T Hedera Commons

> **FROZEN CANONICAL TESTNET TRANSACTION**  
> This document records the permanent, immutable reference proof for the Dr. T Hedera Commons integration on Hedera Testnet.

---

## 1. TRANSACTION SPECIFICATION

| Parameter | Canonical Value |
| :--- | :--- |
| **Network** | **Hedera Testnet** |
| **Status** | **VERIFIED** |
| **HCS Topic ID** | `0.0.10818730` |
| **Topic Sequence Number** | `1` |
| **Transaction ID** | `0.0.6399349@1790908963.573187309` |
| **Formatted Transaction ID** | `0.0.6399349-1790908963-573187309` |
| **Consensus Timestamp** | `1790908970.043224069` (Nanosecond precision) |
| **Running Hash** | `211,250,43,58,182,142,217,30,146,220,152,254,196,224,125,140,43,221,36,174,25,218,18,205,250,216,145,46,204,24,74,56,36,155,33,55,210,113,181,247,34,185,137,109,3,213,197,41` |
| **Artifact ID** | `drt-hedera-testnet-verification` |
| **Artifact Type** | `research` |
| **Artifact Version** | `1.0.0` |
| **Canonical SHA-256** | `ca7c77d8e0aab26f85254783d3659484200514c59c78f3fbc59b582874a98f54` |
| **Mirror Node Verification** | **PASS** |
| **Hash Verification** | **PASS** |
| **Application Verification** | **PASS** |

---

## 2. VERIFIED LEDGER LINKS

* **Hashscan Explorer**:  
  [https://hashscan.io/testnet/transaction/0.0.6399349-1790908963-573187309](https://hashscan.io/testnet/transaction/0.0.6399349-1790908963-573187309)

* **Official Hedera Mirror Node Message Endpoint**:  
  [https://testnet.mirrornode.hedera.com/api/v1/topics/0.0.10818730/messages/1](https://testnet.mirrornode.hedera.com/api/v1/topics/0.0.10818730/messages/1)

---

## 3. CANONICAL PROVENANCE PAYLOAD (HCS Message)

```json
{
  "schema": "drt.provenance.v1",
  "artifactId": "drt-hedera-testnet-verification",
  "artifactType": "research",
  "artifactTitle": "Dr. T Hedera Commons public provenance verification artifact",
  "version": "1.0.0",
  "contentHash": "ca7c77d8e0aab26f85254783d3659484200514c59c78f3fbc59b582874a98f54",
  "hashAlgorithm": "SHA-256",
  "timestamp": "2026-10-02T02:42:49.562Z",
  "platform": "Dr. T",
  "privacyClassification": "PUBLIC",
  "actorId": "DR_T_SYSTEM"
}
```

---

## 4. PUBLIC TEST ARTIFACT TEXT

```text
Dr. T Hedera Commons public provenance verification artifact.

This artifact contains no personal data,
no patient information,
no clinical record,
and no confidential research information.

Purpose:
Verify end-to-end SHA-256 hashing,
Hedera Consensus Service anchoring,
Mirror Node retrieval,
and cryptographic provenance verification
for the Dr. T platform.
```

**Calculated Deterministic SHA-256**: `ca7c77d8e0aab26f85254783d3659484200514c59c78f3fbc59b582874a98f54`

---

## 5. ZERO-SECRETS COMPLIANCE CONFIRMATION

* No private keys (`HEDERA_PRIVATE_KEY` or other private credentials) are included in this document or exposed anywhere in source repositories.
* No patient identifiers, clinical health records, or private API tokens are contained within this evidence.
* All data recorded is strictly public cryptographic metadata verified directly on Hedera Testnet.
