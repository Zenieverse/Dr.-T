// ==========================================
// HEDERA COMMONS: PROVENANCE SERVICE
// Core Orchestrator for Registration & Audit
// ==========================================

import { 
  ProvenanceRecord, 
  RegisterProvenanceRequest, 
  VerifyProvenanceRequest, 
  VerificationResult,
  ProvenanceArtifactType,
  PrivacyClassification
} from '../types/provenance';
import { HederaActivityItem } from '../types/hedera';
import { hashArtifactSync, verifyHashMatch } from './hashingService';
import { sanitizeForHedera } from './privacyService';
import { hederaService } from './hederaService';
import { hederaMirrorNodeService } from './mirrorNodeService';
import { canonicalize } from '../utils/canonicalize';
import { validateProvenanceRegistrationInput } from '../utils/validation';

export class ProvenanceService {
  private records: Map<string, ProvenanceRecord> = new Map();
  private activityLog: HederaActivityItem[] = [];

  constructor() {
    this.seedDefaultRecords();
  }

  /**
   * Registers and anchors an artifact onto Hedera Consensus Service.
   * 1. Validates input
   * 2. Computes deterministic SHA-256 fingerprint
   * 3. Enforces zero-PHI privacy filter
   * 4. Submits to Hedera HCS
   * 5. Persists verifiable provenance record
   */
  public async registerProvenance(req: RegisterProvenanceRequest): Promise<{ success: boolean; record: ProvenanceRecord }> {
    const val = validateProvenanceRegistrationInput(req);
    if (!val.valid) {
      throw new Error(`Validation Error: ${val.errors.join(', ')}`);
    }

    const { hash: contentHash, byteLength, canonicalString } = hashArtifactSync(req.content);

    // Enforce privacy barrier (zero PHI/PII)
    const privacyEval = sanitizeForHedera({
      artifactId: req.artifactId,
      artifactType: req.artifactType,
      artifactTitle: req.artifactTitle,
      version: req.artifactVersion || '1.0.0',
      contentHash,
      privacyClassification: req.privacyClassification,
      actorId: req.actorId,
      rawContent: req.content
    });

    if (!privacyEval.allowed) {
      throw new Error(`Privacy Violation: ${privacyEval.violations.join(', ')}`);
    }

    // Submit to Hedera HCS
    const anchorResult = await hederaService.submitProvenance(privacyEval.sanitizedMessage);
    if (!anchorResult.success) {
      throw new Error(anchorResult.error || 'Hedera HCS submission failed');
    }

    const recordId = `prov-${req.artifactId}-${Date.now().toString(36)}`;
    const nowIso = new Date().toISOString();

    const record: ProvenanceRecord = {
      id: recordId,
      schemaVersion: 'drt.provenance.v1',
      artifactId: req.artifactId,
      artifactType: req.artifactType,
      artifactTitle: req.artifactTitle,
      artifactVersion: req.artifactVersion || '1.0.0',
      contentHash,
      hashAlgorithm: 'SHA-256',
      privacyClassification: privacyEval.classification,
      createdAt: nowIso,
      network: (anchorResult.network || 'testnet') as any,
      topicId: anchorResult.topicId || '0.0.5892147',
      sequenceNumber: anchorResult.sequenceNumber || 1042,
      transactionId: anchorResult.transactionId || 'mock-tx',
      consensusTimestamp: anchorResult.consensusTimestamp || `${Date.now() / 1000}`,
      runningHash: anchorResult.runningHash,
      hashscanUrl: anchorResult.hashscanUrl || null,
      verificationStatus: 'verified',
      lastVerifiedAt: nowIso,
      canonicalSerialization: canonicalString,
      metadata: {
        ...req.metadata,
        byteLength,
        actorId: privacyEval.sanitizedMessage.actorId
      }
    };

    this.records.set(record.id, record);

    // Record activity item
    const activityItem: HederaActivityItem = {
      id: `act-${Date.now()}`,
      transactionId: anchorResult.transactionId || 'mock-tx',
      topicId: anchorResult.topicId || '0.0.5892147',
      sequenceNumber: anchorResult.sequenceNumber || 1042,
      consensusTimestamp: anchorResult.consensusTimestamp || `${Date.now() / 1000}`,
      artifactId: record.artifactId,
      artifactTitle: record.artifactTitle,
      contentHash: record.contentHash,
      privacyClassification: record.privacyClassification,
      hashscanUrl: anchorResult.hashscanUrl || null
    };

    this.activityLog.unshift(activityItem);
    if (this.activityLog.length > 50) this.activityLog.pop();

    return { success: true, record };
  }

  /**
   * Verifies an artifact's cryptographic integrity against the anchored Hedera Consensus record.
   */
  public async verifyProvenance(req: VerifyProvenanceRequest): Promise<VerificationResult> {
    let targetRecord: ProvenanceRecord | undefined;

    if (req.recordId) {
      targetRecord = this.records.get(req.recordId);
    } else if (req.artifactId) {
      targetRecord = Array.from(this.records.values()).find(r => r.artifactId === req.artifactId);
    }

    if (!targetRecord) {
      return {
        recordId: req.recordId || null,
        artifactId: req.artifactId || 'UNKNOWN',
        status: 'not-found',
        localHash: 'NONE',
        anchoredHash: null,
        hashesMatch: false,
        message: 'No anchored provenance record found matching the provided identifier.',
        verifiedAt: new Date().toISOString(),
        mirrorNodeCheck: {
          queried: false,
          consensusVerified: false,
          error: 'RECORD_NOT_FOUND'
        }
      };
    }

    // Compute local hash of provided content, or verify stored canonical payload
    let localHash = targetRecord.contentHash;
    if (req.content !== undefined && req.content !== null) {
      localHash = hashArtifactSync(req.content).hash;
    }

    const hashesMatch = verifyHashMatch(localHash, targetRecord.contentHash);

    // Query Hedera Mirror Node
    const topicId = targetRecord.topicId || hederaService.getTopicId();
    const seqNum = targetRecord.sequenceNumber || 1042;
    const mirrorCheck = await hederaMirrorNodeService.verifyTopicMessage(topicId, seqNum, targetRecord.contentHash);

    const verifiedAt = new Date().toISOString();
    let status: 'verified' | 'mismatch' | 'unavailable' = 'verified';
    let message = 'Cryptographic SHA-256 fingerprint verified against Hedera Consensus Service.';

    if (!hashesMatch) {
      status = 'mismatch';
      message = 'INTEGRITY CHECK FAILED: The recalculated local artifact hash does not match the anchored Hedera consensus record.';
    } else if (!mirrorCheck.consensusVerified) {
      status = 'unavailable';
      message = 'Consensus record unconfirmed on Mirror Node.';
    }

    // Update in-memory record state
    targetRecord.verificationStatus = status;
    targetRecord.lastVerifiedAt = verifiedAt;

    return {
      recordId: targetRecord.id,
      artifactId: targetRecord.artifactId,
      status,
      localHash,
      anchoredHash: targetRecord.contentHash,
      hashesMatch,
      message,
      verifiedAt,
      mirrorNodeCheck: {
        queried: mirrorCheck.queried,
        consensusVerified: mirrorCheck.consensusVerified,
        endpointUsed: mirrorCheck.endpointUsed,
        sequenceNumber: mirrorCheck.sequenceNumber,
        rawPayload: mirrorCheck.rawPayload,
        error: mirrorCheck.message
      }
    };
  }

  public getRecords(filter?: {
    artifactType?: string;
    privacy?: string;
    query?: string;
    verifiedOnly?: boolean;
  }): { records: ProvenanceRecord[]; stats: any } {
    let list = Array.from(this.records.values());

    if (filter?.artifactType && filter.artifactType !== 'all') {
      const targetType = filter.artifactType.toLowerCase();
      list = list.filter(r => r.artifactType.toLowerCase() === targetType);
    }

    if (filter?.privacy && filter.privacy !== 'all') {
      const targetPrivacy = filter.privacy.toUpperCase();
      list = list.filter(r => r.privacyClassification.toUpperCase() === targetPrivacy);
    }

    if (filter?.verifiedOnly) {
      list = list.filter(r => r.verificationStatus === 'verified' || r.verificationStatus === 'VERIFIED');
    }

    if (filter?.query) {
      const q = filter.query.toLowerCase().trim();
      list = list.filter(r =>
        r.artifactId.toLowerCase().includes(q) ||
        r.artifactTitle.toLowerCase().includes(q) ||
        r.contentHash.toLowerCase().includes(q) ||
        (r.topicId && r.topicId.toLowerCase().includes(q))
      );
    }

    const allRecords = Array.from(this.records.values());
    const stats = {
      totalRecords: allRecords.length,
      verifiedRecords: allRecords.filter(r => r.verificationStatus === 'verified' || r.verificationStatus === 'VERIFIED').length,
      researchArtifacts: allRecords.filter(r => r.artifactType === 'research').length,
      knowledgeRecords: allRecords.filter(r => r.artifactType === 'knowledge').length,
      aiArtifacts: allRecords.filter(r => r.artifactType === 'ai-model' || r.artifactType === 'ai-evaluation').length,
      ecologicalRecords: allRecords.filter(r => r.artifactType === 'greenieverse').length,
      lastVerificationTimestamp: allRecords.find(r => r.lastVerifiedAt)?.lastVerifiedAt || new Date().toISOString()
    };

    return { records: list, stats };
  }

  public getRecordById(id: string): ProvenanceRecord | null {
    return this.records.get(id) || Array.from(this.records.values()).find(r => r.artifactId === id) || null;
  }

  public getActivity(): HederaActivityItem[] {
    return this.activityLog;
  }

  private seedDefaultRecords() {
    // 0. Genuine Hedera Testnet Verified Broadcast Record
    const testnetRecord: ProvenanceRecord = {
      id: 'prov-hedera-testnet-verification-01',
      schemaVersion: 'drt.provenance.v1',
      artifactId: 'drt-hedera-testnet-verification',
      artifactType: 'research',
      artifactTitle: 'Dr. T Hedera Commons public provenance verification artifact',
      artifactVersion: '1.0.0',
      contentHash: 'ca7c77d8e0aab26f85254783d3659484200514c59c78f3fbc59b582874a98f54',
      hashAlgorithm: 'SHA-256',
      privacyClassification: 'public',
      createdAt: '2026-10-02T02:42:56.053Z',
      network: 'testnet',
      topicId: '0.0.10818730',
      sequenceNumber: 1,
      transactionId: '0.0.6399349@1790908963.573187309',
      consensusTimestamp: '1790908970.043224069',
      runningHash: '211,250,43,58,182,142,217,30,146,220,152,254,196,224,125,140,43,221,36,174,25,218,18,205,250,216,145,46,204,24,74,56,36,155,33,55,210,113,181,247,34,185,137,109,3,213,197,41',
      hashscanUrl: 'https://hashscan.io/testnet/transaction/0.0.6399349-1790908963-573187309',
      verificationStatus: 'verified',
      lastVerifiedAt: '2026-10-02T02:42:58.000Z',
      canonicalSerialization: '"Dr. T Hedera Commons public provenance verification artifact.\\n\\nThis artifact contains no personal data,\\nno patient information,\\nno clinical record,\\nand no confidential research information.\\n\\nPurpose:\\nVerify end-to-end SHA-256 hashing,\\nHedera Consensus Service anchoring,\\nMirror Node retrieval,\\nand cryptographic provenance verification\\nfor the Dr. T platform."',
      metadata: { byteLength: 373 }
    };
    this.records.set(testnetRecord.id, testnetRecord);

    const seeds: Array<{
      id: string;
      artifactId: string;
      artifactType: ProvenanceArtifactType;
      artifactTitle: string;
      version: string;
      privacy: PrivacyClassification;
      seq: number;
      payload: unknown;
    }> = [
      {
        id: 'prov-seed-trib-01',
        artifactId: 'art-trib-paper-p2p',
        artifactType: 'knowledge',
        artifactTitle: 'Trib-House: Autonomous Peer-to-Peer Gossip Pruning Protocol',
        version: '1.2.0',
        privacy: 'public',
        seq: 1001,
        payload: {
          title: "Trib-House: Autonomous Peer-to-Peer Gossip Pruning Protocol",
          author: "Trib-House Living Library Consortium",
          consensusLatencyMs: 320
        }
      },
      {
        id: 'prov-seed-lifeweave-02',
        artifactId: 'art-lifeweave-ablation',
        artifactType: 'ai-model',
        artifactTitle: 'LIFEWEAVE Gemma 4 SWE Agent: Candidate Verification Gate Ablation Matrix',
        version: '2.0.0',
        privacy: 'public',
        seq: 1002,
        payload: {
          agent: "LIFEWEAVE Gemma 4 Developer Agent",
          model: "gemma-4-31b-it-qat-w4a16-ct",
          patchPassRate: 1.00
        }
      },
      {
        id: 'prov-seed-research-03',
        artifactId: 'art-research-circadian-ferritin',
        artifactType: 'research',
        artifactTitle: 'Longitudinal Biomarker Study: Ferritin & Circadian Phase Delay in Chronic Fatigue',
        version: '3.1.0',
        privacy: 'sensitive',
        seq: 1003,
        payload: {
          protocolId: "PROT-FE-CIRC-2026",
          biomarkerTargets: { ferritinMinNgMl: 24, sleepCurfewHours: 22 }
        }
      },
      {
        id: 'prov-seed-greenie-04',
        artifactId: 'art-greenieverse-canopy-quadrant',
        artifactType: 'greenieverse',
        artifactTitle: 'GreenieVerse Galactic Canopy: Alpha Quadrant Photosynthetic Yield Audit',
        version: '1.0.4',
        privacy: 'public',
        seq: 1004,
        payload: {
          quadrant: "Galactic-Alpha-7",
          biomassIndex: 88.4,
          co2CapturedKgPerDay: 8420.5
        }
      }
    ];

    for (const seed of seeds) {
      const { hash, byteLength, canonicalString } = hashArtifactSync(seed.payload);
      const record: ProvenanceRecord = {
        id: seed.id,
        schemaVersion: 'drt.provenance.v1',
        artifactId: seed.artifactId,
        artifactType: seed.artifactType,
        artifactTitle: seed.artifactTitle,
        artifactVersion: seed.version,
        contentHash: hash,
        hashAlgorithm: 'SHA-256',
        privacyClassification: seed.privacy,
        createdAt: '2026-09-30T18:00:00.000Z',
        network: 'testnet',
        topicId: '0.0.5892147',
        sequenceNumber: seed.seq,
        transactionId: `0.0.5892147@1759255200.${seed.seq}`,
        consensusTimestamp: `1759255200.${seed.seq * 1000000}`,
        runningHash: `sha256-seed-running-hash-${seed.seq}`,
        hashscanUrl: null,
        verificationStatus: 'verified',
        lastVerifiedAt: '2026-09-30T20:00:00.000Z',
        canonicalSerialization: canonicalString,
        metadata: { byteLength }
      };

      this.records.set(record.id, record);

      this.activityLog.push({
        id: `act-seed-${seed.seq}`,
        transactionId: record.transactionId!,
        topicId: record.topicId!,
        sequenceNumber: seed.seq,
        consensusTimestamp: record.consensusTimestamp!,
        artifactId: record.artifactId,
        artifactTitle: record.artifactTitle,
        contentHash: record.contentHash,
        privacyClassification: record.privacyClassification,
        hashscanUrl: null
      });
    }
  }
}

export const provenanceService = new ProvenanceService();
export const provenanceStore = provenanceService;
