# Hedera Commons: Trust, Provenance & Verification for Dr. T

**Hedera Commons** is Dr. T's enterprise trust and provenance layer, providing decentralized, tamper-evident cryptographic verification for research artifacts, living library manuscripts, AI model benchmarks, and ecological registries across the Dr. T platform.

---

## 1. What It Is & Why It Exists

In medical informatics, clinical AI, scientific publishing, and federated knowledge systems, proving that a model specification, research paper, or ethical guideline has not been tampered with or retroactively altered is paramount.

Hedera Commons connects Dr. T's knowledge ecosystem to the public **Hedera Consensus Service (HCS)**:
* **Off-Chain Storage:** Confidential documents, patient data, clinical notes, and proprietary weights remain securely in off-chain databases (Google Cloud Firestore, encrypted Cloud Storage, or local disk).
* **On-Chain Cryptographic Proof:** A deterministic 256-bit SHA-256 fingerprint (RFC 8785) is anchored to an immutable HCS topic with a nanosecond consensus timestamp.
* **Independent Auditability:** Any party can recalculate the hash of an artifact and audit it against an independent Hedera Mirror Node via REST API without requiring special software or private keys.

---

## 2. Core Principle: Zero-PHI On-Chain Guarantee

```text
[ CONFIDENTIAL CLINICAL / RESEARCH DATA ]
                   │
                   ▼ (Strict Privacy Filter)
   [ Secure Off-Chain Encrypted Storage ]
                   │
                   ▼ (Deterministic Canonicalization RFC 8785)
      [ SHA-256 Cryptographic Hash ]
                   │
                   ▼ (Hedera Consensus Service - HCS)
       [ Topic Sequence # & Consensus Timestamp ]
                   │
                   ▼ (Hedera Mirror Node REST API)
          [ Independent Verification: VERIFIED ]
```

> **NEVER put patient medical records, personally identifiable information (PII), passwords, clinical notes, or private health information (PHI) directly onto Hedera.**

Hedera Commons enforces a strict privacy gate:
1. `PUBLIC`: Public research abstracts, open-source code manifests, and open datasets.
2. `INTERNAL`: Institutional research; descriptive payload withheld, only metadata digest anchored.
3. `PRIVATE`: Proprietary models and research; all descriptive fields stripped, only the non-reversible SHA-256 hash is anchored.
4. `SENSITIVE`: Clinical/biomedical privacy tier. Strictly enforces HIPAA/GDPR constraints: zero PII, zero PHI, and auto-rejection if sensitive tokens are detected in public payloads.

---

## 3. Architecture & Components

### 3.1 Backend Service Layer (`src/modules/hedera/`)
* **`types.ts`**: Stable versioned schema (`drt.provenance.v1`), TypeScript interfaces, and privacy enums.
* **`canonicalizer.ts`**: Deterministic recursive key sorting and formatting (RFC 8785 subset) + SHA-256 generation.
* **`privacyFilter.ts`**: Automated regex and semantic scanning preventing any PHI, SSN, MRN, or passwords from entering HCS messages.
* **`hederaService.ts`**: Official `@hashgraph/sdk` client wrapper. Manages client lifecycle, operator keys, topic submission, and dual-mode execution (real vs mock sandbox).
* **`mirrorNodeService.ts`**: REST client querying official Hedera Mirror Nodes (`https://testnet.mirrornode.hedera.com`) for consensus timestamp and sequence validation.
* **`provenanceStore.ts`**: Repository and state engine pre-seeded with authentic Dr. T ecosystem research, knowledge, and AI artifacts.

### 3.2 Frontend UI Components (`src/components/hedera/`)
* **`HederaCommonsHome.tsx`**: Production dashboard with network status indicators, summary metric cards, ecosystem bridge banners, and responsive searchable explorer.
* **`RegisterProvenanceModal.tsx`**: 5-step registration wizard (Select Artifact → Generate Proof → Review Privacy → Anchor to HCS → Confirmation).
* **`VerifyRecordModal.tsx`**: Dual-hash verification modal comparing local content digest against HCS anchored record and Mirror Node.
* **`ProvenanceDetailModal.tsx`**: Full cryptographic audit detail, timeline, and canonical payload inspection.
* **`HowItWorksModal.tsx`**: Visual 5-step trust architecture guide.
* **`NetworkActivityDrawer.tsx`**: Live stream of HCS topic consensus messages.

---

## 4. API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/hedera/status` | Current network status, topic ID, masked account, and mode |
| `GET` | `/api/hedera/provenance` | List provenance records with filters (`artifactType`, `privacy`, `query`) |
| `GET` | `/api/hedera/provenance/:id` | Get single provenance record with full audit metadata |
| `POST` | `/api/hedera/provenance/register` | Register & anchor artifact (validates privacy & submits to HCS) |
| `POST` | `/api/hedera/provenance/verify` | Dual-hash comparison & Mirror Node consensus check |
| `GET` | `/api/hedera/activity` | Recent HCS topic consensus events and transactions |

---

## 5. Configuration & Environment Variables

Add to your `.env` file:

```bash
# Network target: testnet (default), mainnet, previewnet
HEDERA_NETWORK=testnet

# Operating Mode: mock (default safe sandbox) or real (live network)
HEDERA_MODE=mock

# Operator Credentials (required only when HEDERA_MODE=real)
HEDERA_ACCOUNT_ID=0.0.1234567
HEDERA_PRIVATE_KEY=302e020100300506032b657004220420...

# HCS Topic for Dr. T Provenance
HEDERA_TOPIC_ID=0.0.5892147

# Mirror Node REST URL
HEDERA_MIRROR_NODE_URL=https://testnet.mirrornode.hedera.com
```

### 5.1 Safe Development / Mock Mode
When `HEDERA_MODE=mock` (or credentials are not supplied):
* The platform operates in a zero-cost local cryptographic sandbox.
* SHA-256 fingerprints are genuinely computed and verified against an internal deterministic ledger.
* Prominent UI badges clearly state **"Development / Mock Mode: Off-chain cryptographic sandbox"**.
* Fake Hashscan URLs are **strictly prevented** to eliminate misleading external links.

### 5.2 Real Hedera Mode
When `HEDERA_MODE=real` with valid testnet or mainnet credentials:
* The backend initializes the `@hashgraph/sdk` `Client`.
* Messages are submitted via `TopicMessageSubmitTransaction`.
* Official transaction IDs and consensus timestamps are captured.
* Real Hashscan explorer links are generated (`https://hashscan.io/testnet/transaction/{txId}`).
* Mirror Node REST queries independently verify consensus status.

---

## 6. Testing & Quality Verification

Run the automated test suite:

```bash
npx tsx scripts/test-hedera.ts
```

Tests cover all 7 mandatory verification cases:
1. **Case 1:** Deterministic hashing (RFC 8785 key-order independence).
2. **Case 2:** Tamper-evidence (Avalanche effect on modified content).
3. **Case 3:** Strict Zero-PHI privacy barrier.
4. **Case 4:** Valid Hedera record verification (`VERIFIED`).
5. **Case 5:** Hash mismatch detection (`INTEGRITY_CHECK_FAILED`).
6. **Case 6:** Graceful fallback in unconfigured environments.
7. **Case 7:** Transparent mock mode identification without fake URLs.

---

## 7. Ecosystem Integration

* **Trib-House Living Library:** Books and research papers include a direct `"Hedera Provenance Proof"` action triggering instantaneous audit.
* **LIFEWEAVE SWE Agent:** AI model specifications and 10-task competition benchmarks are anchored with immutable version proofs.
* **GreenieVerse Galactic Canopy:** Carbon sequestration and tree sensor telemetry are verified cryptographically.
* **Command Palette (⌘K):** Dedicated commands for registering, auditing, and inspecting consensus streams.

---

## 8. Canonical Hedera Testnet Provenance Proof

The official, frozen reference transaction for Dr. T Hedera Commons on Hedera Testnet:

* **Title**: `CANONICAL HEDERA TESTNET PROVENANCE PROOF — Dr. T Hedera Commons`
* **Network**: `Hedera Testnet`
* **Topic ID**: `0.0.10818730`
* **Sequence Number**: `1`
* **Transaction ID**: `0.0.6399349@1790908963.573187309`
* **Consensus Timestamp**: `1790908970.043224069`
* **Artifact SHA-256**: `ca7c77d8e0aab26f85254783d3659484200514c59c78f3fbc59b582874a98f54`
* **Mirror Node Verification**: `PASS`
* **Hash Verification**: `PASS`
* **Application Verification**: `PASS`
* **Hashscan Explorer Link**: [https://hashscan.io/testnet/transaction/0.0.6399349-1790908963-573187309](https://hashscan.io/testnet/transaction/0.0.6399349-1790908963-573187309)
* **Mirror Node REST Endpoint**: [https://testnet.mirrornode.hedera.com/api/v1/topics/0.0.10818730/messages/1](https://testnet.mirrornode.hedera.com/api/v1/topics/0.0.10818730/messages/1)
* **Documentation Evidence**: `docs/evidence/CANONICAL_TESTNET_PROOF.md` & `docs/evidence/hedera-testnet-provenance.json`

