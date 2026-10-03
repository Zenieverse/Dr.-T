# AGENTS.md — Hedera Provenance Kit
## Autonomous Agent & Developer Rules of Engagement

This document defines architectural constraints, security invariants, and coding standards for AI coding agents (and human engineers) modifying, extending, or maintaining the **Hedera Provenance Kit** repository.

---

## 1. Load-Bearing Hedera Consensus Service (HCS)

* **HCS Is Primary**: Always use Hedera Consensus Service (`TopicMessageSubmitTransaction`) as the core trust mechanism for cryptographic provenance.
* **Do NOT Replace HCS with EVM**: Smart contracts (e.g., in `packages/contracts`) are secondary bridges for EVM dApps. Never replace or deprecate HCS in favor of an EVM-only solution.
* **Preserve Provenance Schema**: All messages published to HCS must conform to the `hpk.provenance.v1` schema specification:
  ```json
  {
    "schema": "hpk.provenance.v1",
    "artifactId": "<unique-identifier>",
    "artifactType": "<type>",
    "artifactTitle": "<title>",
    "artifactVersion": "<version>",
    "hashAlgorithm": "SHA-256",
    "contentHash": "<64-char-hex-sha256>",
    "timestamp": "<iso-8601-utc>",
    "privacy": "public-provenance",
    "source": "Hedera Provenance Kit",
    "actorId": "<operator-id>"
  }
  ```

---

## 2. Zero-PHI & Privacy Guarantees

* **Strict Off-Chain Architecture**:
  * **NEVER** put private health information (PHI), clinical notes, personally identifiable information (PII), confidential research data, or raw user documents directly onto Hedera Consensus Service.
  * Only deterministic cryptographic digests (SHA-256) and non-sensitive descriptive metadata may be anchored on-chain.
* **Privacy Field Enforcement**: Ensure that artifacts tagged with `internal-anchor` or `private-digest` have all descriptive strings stripped before HCS message construction.

---

## 3. Cryptographic Invariants & Canonicalization

* **RFC 8785 Canonicalization**: Always serialize JSON payloads using deterministic lexicographical key ordering via `canonicalize()` in `packages/frontend/lib/canonicalize.ts`.
* **Avalanche / Collision Resistance**: Any change to artifact content must produce a radically different SHA-256 digest. Never use loose hashes or non-standard hash algorithms.
* **Timing-Safe Equality**: Hash comparisons during verification must use constant-time comparison (`crypto.timingSafeEqual`) to prevent timing attacks.

---

## 4. Mirror Node Verification Discipline

* **Independent REST Queries**: Verification must query the official Hedera Mirror Node REST endpoint (`/api/v1/topics/{topicId}/messages/{sequenceNumber}`).
* **Never Assume Status**: Never mark a provenance record as `VERIFIED` merely because a transaction ID is present. A record is only `VERIFIED` if:
  1. The transaction receipt is confirmed by consensus.
  2. The message is indexed by a Mirror Node.
  3. The decoded payload `contentHash` matches the local recomputed hash exactly.
* **Never Fabricate Values**: Never generate mock or synthetic Hashscan URLs. In mock mode, explicitly mark `isMock: true` and set `hashscanUrl: ''`.

---

## 5. Security & Secret Handling

* **Zero-Credential Commits**:
  * NEVER commit `.env`, `.env.local`, `.dev.env.json`, private keys, seed phrases, or operator secrets.
  * `HEDERA_PRIVATE_KEY` must **never** be imported or referenced in client-side Next.js code (`'use client'`). All signing and HCS interactions must reside in server-side API routes or scripts.
  * Always maintain `.env.example` with non-secret dummy placeholders.
* **No Silent Fallback**: If real credentials fail in `HEDERA_MODE=real`, fail loudly with an informative error. Do NOT silently downgrade a real transaction failure into a mock success.

---

## 6. Development & Verification Lifecycle

After making any changes:
1. Run static typecheck: `npm --workspace=packages/frontend run lint`
2. Run automated test suites: `npm test`
3. Verify that production builds succeed: `npm run build`
4. Inspect `git status` to ensure no temporary credential files or artifacts are tracked.
