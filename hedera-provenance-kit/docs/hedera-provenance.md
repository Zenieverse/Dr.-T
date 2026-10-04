# Hedera Provenance Kit

> **Scaffold-HBAR Community Template for Cryptographic Provenance, HCS Anchoring, and Mirror Node Verification**  
> **Repository**: `Zenieverse/hedera-provenance-kit`  
> **Standard**: Scaffold-HBAR Community Specification

---

## 1. Overview & Architecture

The **Hedera Provenance Kit** is a reusable developer scaffold that brings tamper-evident trust, reproducible hashing, and decentralized consensus verification to Web3 applications on the Hedera network.

```text
Digital Artifact (JSON, Document, Model, Code, Sensor Data)
      │
      ▼
[ RFC 8785 Canonicalization ]
      │  • Keys sorted recursively in lexicographical order
      │  • Whitespace normalized
      ▼
[ 256-Bit SHA-256 Digest ]
      │  • Immutable cryptographic fingerprint
      │  • Zero-PHI / Zero-PII Guarantee: Content stays OFF-CHAIN
      ▼
[ Hedera Consensus Service (HCS) ]
      │  • TopicMessageSubmitTransaction
      │  • Sub-2s consensus finality
      │  • Immutable timestamp and sequence assignment
      ▼
[ Hedera Mirror Node & Hashscan ]
      │  • Independent, keyless REST verification
      │  • Universal consensus validation
      ▼
[ VERIFIED / INTEGRITY_CHECK_FAILED ]
```

---

## 2. Canonical Real Hedera Testnet Proof (Sequence #2)

The template's specification has been notarized on the **Hedera Testnet** and is independently verifiable by any third party without API keys:

* **Network**: `Hedera Testnet`
* **HCS Topic ID**: `0.0.10818730`
* **Topic Sequence Number**: `2`
* **Transaction ID**: `0.0.6399349@1790909508.462971661`
* **Consensus Timestamp**: `1790909516.734166434`
* **SHA-256 Content Hash**: `ae7e7030220cf6729fded7eee293059ade5e8d96b7160a1a2d7f3ce2949863d5`
* **Mirror Node REST Endpoint**: [https://testnet.mirrornode.hedera.com/api/v1/topics/0.0.10818730/messages/2](https://testnet.mirrornode.hedera.com/api/v1/topics/0.0.10818730/messages/2)
* **Hashscan Explorer**: [https://hashscan.io/testnet/transaction/0.0.6399349-1790909508-462971661](https://hashscan.io/testnet/transaction/0.0.6399349-1790909508-462971661)

### Canonical Payload:
```json
{
  "schema": "hpk.provenance.v1",
  "artifactId": "hpk-canonical-template-v1",
  "artifactType": "code",
  "artifactTitle": "Hedera Provenance Kit Community Scaffold-HBAR Template Specification",
  "artifactVersion": "1.0.0",
  "hashAlgorithm": "SHA-256",
  "contentHash": "ae7e7030220cf6729fded7eee293059ade5e8d96b7160a1a2d7f3ce2949863d5",
  "timestamp": "2026-10-02T02:51:56.172Z",
  "privacy": "public-provenance",
  "source": "Hedera Provenance Kit Template",
  "actorId": "HPK_CORE_ENGINE"
}
```

---

## 3. Strict Health-Data & Privacy Boundary (Zero-PHI)

Hedera Provenance Kit enforces strict data minimization:
* **ON-CHAIN**: Only the SHA-256 digest, schema version, topic sequence, and consensus timestamp are anchored.
* **OFF-CHAIN**: All confidential user data, clinical records, patient identifiers (PHI), credentials, and API keys are strictly retained off-chain.

---

## 4. Mock vs. Real Mode

The environment variable `HEDERA_MODE` dictates execution:
* `HEDERA_MODE=mock`: Generates deterministic cryptographic fingerprints locally for testing and development. Clearly identifies records with `isMock: true` and never fabricates fake Hashscan or transaction receipts.
* `HEDERA_MODE=real`: Connects to Hedera Testnet or Mainnet using server-side credentials (`HEDERA_ACCOUNT_ID`, `HEDERA_PRIVATE_KEY`). Transactions are signed server-side and submitted directly to HCS via `@hashgraph/sdk`.

---

## 5. Quickstart & Usage

```bash
# Clone the repository
git clone https://github.com/Zenieverse/hedera-provenance-kit.git

# Install dependencies across workspaces
npm install

# Run automated tests
npm test

# Build packages
npm run build
```
