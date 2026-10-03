# Hedera Provenance Kit

> **Scaffold-HBAR Community Developer Template for Verifiable Cryptographic Provenance**  
> *"Start with cryptographic provenance on Hedera in one command."*

[![Hedera Consensus Service](https://img.shields.io/badge/Hedera-HCS-00E887?style=flat&logo=hedera)](https://hedera.com/consensus-service)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Scaffold-HBAR](https://img.shields.io/badge/Scaffold--HBAR-Template-1358FE)](https://github.com/hedera-dev/scaffold-hbar)
[![Testnet Provenance](https://img.shields.io/badge/Testnet%20HCS-Verified-success)](https://hashscan.io/testnet/transaction/0.0.6399349-1790909508-462971661)

---

## 1. What It Is

**Hedera Provenance Kit** is a developer template built for the **Scaffold-HBAR** ecosystem. It provides an enterprise-ready pattern for anchoring tamper-evident, verifiable cryptographic provenance to the public **Hedera Consensus Service (HCS)**.

Instead of storing expensive, sensitive, or heavy documents directly on distributed ledgers, the kit computes an immutable, deterministic **RFC 8785 SHA-256 fingerprint** of the artifact off-chain and anchors only the compact cryptographic proof on-chain with sub-2-second consensus finality.

Any auditor, downstream application, or end-user can independently recalculate the hash of their local file and verify its authenticity against an official **Hedera Mirror Node** via standard REST queries—without requiring browser wallets, private keys, or smart contract execution fees.

---

## 2. Why Hedera Consensus Service (HCS)?

* **Decentralized Fair Ordering**: Hedera's hashgraph consensus provides fair timestamping and fair transaction ordering guaranteed by mathematical consensus.
* **Sub-2-Second Finality**: Messages submitted to HCS achieve irreversible, immutable consensus within seconds.
* **Predictable, Fractional-Cent Fees**: Fixed fee structure ($0.0001 USD per message) denominated in USD, eliminating gas price volatility.
* **Universal Auditability via Mirror Nodes**: High-throughput public Mirror Nodes index every topic message and expose REST APIs for free, keyless auditing.

---

## 3. Cryptographic Pipeline Architecture

```text
       [ Public / Private Artifact ]
                    │
                    ▼
     [ RFC 8785 JSON Canonicalization ]
                    │
                    ▼
       [ 256-bit SHA-256 Digest ]
                    │
                    ▼
[ Compact Provenance Payload (hpk.provenance.v1) ]
                    │
                    ▼
[ Hedera Consensus Service: TopicMessageSubmitTransaction ]
                    │
                    ▼
   [ Topic Sequence # & Consensus Timestamp ]
                    │
                    ▼
[ Independent Mirror Node Verification REST Query ]
                    │
                    ▼
       [ VERIFIED / INTEGRITY FAILED ]
```

---

## 4. Quick Start

Create a new project using the official `create-scaffold-hbar` CLI:

```bash
npm create scaffold-hbar@latest -- --template Zenieverse/hedera-provenance-kit my-provenance-app
```

Then navigate into your project and install dependencies:

```bash
cd my-provenance-app
npm install
```

Start the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

| Variable | Required | Description | Example |
| :--- | :---: | :--- | :--- |
| `HEDERA_NETWORK` | Yes | Target network (`testnet`, `mainnet`, `previewnet`) | `testnet` |
| `HEDERA_MODE` | No | Execution mode (`real` or `mock`) | `real` |
| `HEDERA_ACCOUNT_ID` | Yes | Operator account ID | `0.0.1234567` |
| `HEDERA_PRIVATE_KEY` | Yes | Operator private key (DER or raw hex) | `302e020100300506...` |
| `HEDERA_TOPIC_ID` | Yes | HCS Topic ID for provenance records | `0.0.10818730` |
| `HEDERA_MIRROR_NODE_URL` | No | Mirror Node REST API endpoint | `https://testnet.mirrornode.hedera.com` |

> 🔒 **SECURITY NOTE:** Never commit `.env` or expose `HEDERA_PRIVATE_KEY` to client-side code. All HCS transaction submissions occur via server-side API routes (`/api/provenance/register`).

---

## 6. Zero-PHI Privacy Model

The template enforces a strict architectural boundary:

### 🟢 What Goes ON-CHAIN (Hedera HCS):
* Cryptographic SHA-256 content digest
* Schema identifier (`hpk.provenance.v1`)
* Public artifact identifier & version string
* Consensus timestamp & topic sequence number
* Operator transaction ID reference

### 🔴 What Remains OFF-CHAIN (Private Storage):
* Raw document text, uploaded files, or research manuscripts
* Personally Identifiable Information (PII) & GDPR-governed data
* Protected Health Information (PHI) & HIPAA-governed records
* Private keys, credentials, and API secrets
* Proprietary algorithms or model weights

---

## 7. Schema Specification: `hpk.provenance.v1`

```json
{
  "schema": "hpk.provenance.v1",
  "artifactId": "art-model-v2",
  "artifactType": "ai-model",
  "artifactTitle": "Autonomous Reasoning Model Specification",
  "artifactVersion": "2.1.0",
  "hashAlgorithm": "SHA-256",
  "contentHash": "ae7e7030220cf6729fded7eee293059ade5e8d96b7160a1a2d7f3ce2949863d5",
  "timestamp": "2026-10-02T02:51:56.172Z",
  "privacy": "public-provenance",
  "source": "Hedera Provenance Kit"
}
```

---

## 8. Mirror Node Verification

Verification requires no private keys or wallet connections:

```typescript
import { verifyProvenance } from '@/lib/mirrorNode';

const result = await verifyProvenance({
  topicId: '0.0.10818730',
  sequenceNumber: 2,
  expectedHash: 'ae7e7030220cf6729fded7eee293059ade5e8d96b7160a1a2d7f3ce2949863d5',
  network: 'testnet'
});

console.log(result.status); // "VERIFIED"
console.log(result.hashesMatch); // true
console.log(result.consensusTimestamp); // "1790909516.734166434"
```

---

## 9. Genuine Testnet Proofs

### Primary Bounty Submission Proof: Live Hedera Testnet Proof — Sequence #2

* **Network**: `Hedera Testnet`
* **HCS Topic ID**: `0.0.10818730`
* **Topic Sequence Number**: `2`
* **Transaction ID**: `0.0.6399349@1790909508.462971661`
* **Formatted Transaction ID**: `0.0.6399349-1790909508-462971661`
* **Consensus Timestamp**: `1790909516.734166434`
* **Artifact SHA-256**: `ae7e7030220cf6729fded7eee293059ade5e8d96b7160a1a2d7f3ce2949863d5`
* **Mirror Node REST Endpoint**: [https://testnet.mirrornode.hedera.com/api/v1/topics/0.0.10818730/messages/2](https://testnet.mirrornode.hedera.com/api/v1/topics/0.0.10818730/messages/2)
* **Live Hedera Testnet Proof — Sequence #2 (Hashscan Explorer)**:
  [https://hashscan.io/testnet/transaction/0.0.6399349-1790909508-462971661](https://hashscan.io/testnet/transaction/0.0.6399349-1790909508-462971661)

### Original Proof-of-Concept Integration: Reference Proof (Dr. T Hedera Commons)
* **Network**: `Hedera Testnet`
* **HCS Topic ID**: `0.0.10818730`
* **Topic Sequence Number**: `1`
* **Transaction ID**: `0.0.6399349@1790908963.573187309`
* **Consensus Timestamp**: `1790908970.043224069`
* **Artifact SHA-256**: `ca7c77d8e0aab26f85254783d3659484200514c59c78f3fbc59b582874a98f54`
* **Hashscan Explorer**: [https://hashscan.io/testnet/transaction/0.0.6399349-1790908963-573187309](https://hashscan.io/testnet/transaction/0.0.6399349-1790908963-573187309)

---

## 10. Monorepo Structure

```text
hedera-provenance-kit/
├── packages/
│   ├── frontend/            # Next.js App Router, Tailwind CSS, @hashgraph/sdk
│   │   ├── app/             # Registration, Verification, and Documentation UI
│   │   ├── lib/             # RFC 8785 canonicalizer, hashing, HCS client, Mirror Node verifier
│   │   └── test/            # Automated test suite for cryptographic invariants
│   └── contracts/           # Hardhat environment & optional EVM anchor registry
│       ├── contracts/       # ProvenanceAnchorRegistry.sol
│       └── test/            # Hardhat test suite
├── docs/evidence/           # Machine-readable Testnet evidence records
├── template.json            # Scaffold-HBAR external template registration manifest
├── AGENTS.md                # Engineering guidelines for autonomous coding agents
├── LICENSE                  # MIT License
└── README.md                # Developer documentation
```

---

## 11. Testing

Run all automated test suites:

```bash
npm test
```

Verifies:
* **Deterministic Canonicalization**: Inverted dictionary keys yield identical hashes (RFC 8785).
* **Collision Resistance**: Modifying one byte changes the digest (Avalanche effect).
* **Schema Validation**: Valid `hpk.provenance.v1` passes; malformed structures are rejected.
* **Zero-PHI Sanitation**: Clinical and personal data are strictly barred from on-chain payloads.
* **Mirror Node Integrity**: Detects hash discrepancies between local files and on-chain records.

---

## 12. License

Distributed under the [MIT License](LICENSE). Copyright (c) 2026 Zenieverse & Dr. T Healthcare Ecosystem.
