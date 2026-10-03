# Hedera Provenance Kit Integration in Dr. T

> **Production Cryptographic Provenance & Verification Layer for the Dr. T Knowledge Ecosystem**  
> **Target Repository**: `Zenieverse/Dr.-T`  
> **Target Branch**: `feat/hedera-provenance-kit`  
> **Canonical Standalone Source**: `Zenieverse/hedera-provenance-kit`

---

## 1. Executive Summary

This document describes the architectural integration of the **Hedera Provenance Kit** into the **Dr. T** healthcare and knowledge intelligence platform.

By incorporating the proven provenance pattern from `Zenieverse/hedera-provenance-kit`, Dr. T transforms **Hedera Commons** into a decentralized trust layer. Any digital artifact—including research manuscripts, AI agent evaluations, living forest knowledge entries, clinical algorithm manifests, or ecological sensor registrations—can be deterministically canonicalized, hashed with SHA-256, and anchored directly to the **Hedera Consensus Service (HCS)**.

Downstream consumers, regulatory auditors, and patients can independently audit any record against a public **Hedera Mirror Node** without exposing sensitive health information or requiring private keys.

---

## 2. Architecture Overview

```text
Dr. T Knowledge Ecosystem
│
├── AI Health Intelligence (Clinical Swarms, USMLE MedQA)
├── Research & Publications (Living Library, Papers)
├── Trib-House (Living Forests, Ancestral Canopy)
├── GreenieVerse (Ecological IoT, Carbon Registry)
└── LIFEWEAVE (Autonomous Engineering Specifications)
        │
        ▼
   [ Off-Chain Storage & Canonicalization ]
        │  • RFC 8785 Deterministic JSON Serialization
        │  • 256-bit SHA-256 Digest Computation
        │  • Zero-PHI / Zero-PII Sanitization Gateway
        ▼
  [ Hedera Commons: Provenance Integration Layer ]
        │  • Minimal Schema: hpk.provenance.v1 / drt.provenance.v1
        │  • Strict Privacy Tier: PUBLIC | PRIVATE | SENSITIVE | PROTECTED
        ▼
  [ Hedera Consensus Service (HCS) ]
        │  • TopicMessageSubmitTransaction
        │  • Sub-2s Immutable Consensus Finality
        │  • Fixed $0.0001 USD Fee
        ▼
  [ Hedera Mirror Node & Hashscan Explorer ]
        │  • Universal Free REST Auditing
        │  • Byte-for-Byte Digest Verification
        ▼
     [ VERIFIED ]
```

---

## 3. Strict Health-Data Privacy Model (Zero-PHI)

Healthcare and biomedical research demand uncompromising data privacy. Hedera Provenance Kit enforces a strict boundary:

### 🟢 What Touches the Public Ledger (Hedera HCS):
* Deterministic SHA-256 content digest (32 bytes hex)
* Versioned provenance schema identifier (`hpk.provenance.v1` / `drt.provenance.v1`)
* Public artifact identifier and semantic version
* Consensus timestamp and sequence number
* Operator transaction reference ID

### 🔴 What Remains Strictly Off-Chain:
* Patient health records (PHI), clinical notes, and MRNs
* Personally identifiable information (PII) governed by HIPAA and GDPR
* Medical imagery, raw sensor telemetry, and patient conversation logs
* Private keys, API tokens, and authentication credentials
* Full text of proprietary research manuscripts or model weights

---

## 4. Canonical Live Hedera Testnet Proofs

Dr. T records and independently audits two genuine on-chain transactions on Hedera Testnet:

### Primary Bounty Proof: Sequence #2 (Hedera Provenance Kit Specification)
* **Network**: `Hedera Testnet`
* **HCS Topic ID**: `0.0.10818730`
* **Topic Sequence Number**: `2`
* **Transaction ID**: `0.0.6399349@1790909508.462971661`
* **Formatted Transaction ID**: `0.0.6399349-1790909508-462971661`
* **Consensus Timestamp**: `1790909516.734166434`
* **Artifact SHA-256**: `ae7e7030220cf6729fded7eee293059ade5e8d96b7160a1a2d7f3ce2949863d5`
* **Mirror Node REST Endpoint**: [https://testnet.mirrornode.hedera.com/api/v1/topics/0.0.10818730/messages/2](https://testnet.mirrornode.hedera.com/api/v1/topics/0.0.10818730/messages/2)
* **Hashscan Explorer**: [https://hashscan.io/testnet/transaction/0.0.6399349-1790909508-462971661](https://hashscan.io/testnet/transaction/0.0.6399349-1790909508-462971661)
* **Status**: **VERIFIED (100% Byte-for-byte match)**

### Reference Integration Proof: Sequence #1 (Dr. T Hedera Commons Initial Anchor)
* **Network**: `Hedera Testnet`
* **HCS Topic ID**: `0.0.10818730`
* **Topic Sequence Number**: `1`
* **Transaction ID**: `0.0.6399349@1790908963.573187309`
* **Consensus Timestamp**: `1790908970.043224069`
* **Artifact SHA-256**: `ca7c77d8e0aab26f85254783d3659484200514c59c78f3fbc59b582874a98f54`
* **Hashscan Explorer**: [https://hashscan.io/testnet/transaction/0.0.6399349-1790908963-573187309](https://hashscan.io/testnet/transaction/0.0.6399349-1790908963-573187309)

---

## 5. REST API Architecture in Dr. T

The Express backend in `server.ts` exposes standardized provenance endpoints:

| Endpoint | Method | Purpose |
| :--- | :---: | :--- |
| `/api/hedera/status` | `GET` | Retrieves operator connection status, network mode, and topic ID. |
| `/api/hedera/provenance` | `GET` | Lists all indexed provenance records with search and privacy filtering. |
| `/api/hedera/provenance/:id` | `GET` | Returns full provenance details and cryptographic metadata for a specific record. |
| `/api/hedera/provenance/register` | `POST` | Canonicalizes an artifact, computes SHA-256, applies privacy filters, and submits to HCS. |
| `/api/hedera/provenance/verify` | `POST` | Recomputes local hash and verifies against official Mirror Node REST consensus record. |
| `/api/hedera/activity` | `GET` | Returns recent on-chain transactions and consensus confirmations. |

---

## 6. Environment Configuration & Security

Credentials are strictly isolated server-side. Never expose `HEDERA_PRIVATE_KEY` to client-side bundles or Git.

```bash
# Target Hedera Network
HEDERA_NETWORK=testnet

# Execution Mode ('real' or 'mock')
HEDERA_MODE=testnet

# Operator Credentials (Server-only)
HEDERA_ACCOUNT_ID=0.0.1234567
HEDERA_PRIVATE_KEY=302e020100300506...

# HCS Topic Configuration
HEDERA_TOPIC_ID=0.0.10818730
HEDERA_MIRROR_NODE_URL=https://testnet.mirrornode.hedera.com
```

### Mock vs. Real Mode Discipline:
* **Mock Mode**: Calculates cryptographic digests locally with deterministic mock receipts. It clearly marks `isMock: true` and strictly avoids generating fake Hashscan URLs.
* **Real Mode**: Signs and submits transactions using `@hashgraph/sdk` via server API routes. Never silently degrades to mock mode on failure; blockchain errors are returned with precise diagnostic codes.

---

## 7. Verification Workflows

### Reusable Verification Function
```typescript
import { verifyProvenance } from './modules/hedera/services/mirrorNodeService';

const result = await verifyProvenance({
  topicId: '0.0.10818730',
  sequenceNumber: 2,
  expectedHash: 'ae7e7030220cf6729fded7eee293059ade5e8d96b7160a1a2d7f3ce2949863d5',
  network: 'testnet'
});

if (result.consensusVerified) {
  console.log('Record cryptographically verified on Hedera Consensus Service!');
}
```

---

## 8. Verification Matrix & Validation Gates

* **Unit Tests**: RFC 8785 canonicalization, collision resistance, and schema validation.
* **Security Audits**: Automated regex scanner ensuring zero private keys or credential files are tracked.
* **Live Testnet Confirmation**: Real-time Mirror Node queries confirming consensus timestamps and running hashes.
