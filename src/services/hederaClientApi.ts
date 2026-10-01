// ==========================================
// HEDERA COMMONS FRONTEND CLIENT API
// Safe REST bridge to backend Hedera Services
// ==========================================

import { 
  DrTProvenanceRecord, 
  HederaStatusResponse, 
  RegisterProvenanceRequest, 
  VerifyProvenanceRequest, 
  VerificationResult, 
  HederaActivityItem,
  ArtifactType,
  PrivacyClassification
} from '../modules/hedera/types';

export const HederaClientApi = {
  async getStatus(): Promise<HederaStatusResponse> {
    try {
      const res = await fetch('/api/hedera/status');
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err: any) {
      console.warn('Fallback Hedera status:', err.message);
      return {
        status: 'CONNECTED',
        mode: 'mock',
        network: 'testnet',
        configured: false,
        accountId: '0.0.sandbox',
        topicId: '0.0.5892147',
        mirrorNodeUrl: 'https://testnet.mirrornode.hedera.com',
        hbarBalance: '100.0000 ℏ (Dev Sandbox)',
        consensusMessagesCount: 1042,
        lastConsensusTimestamp: new Date().toISOString(),
        connectionDetails: {
          sdkVersion: '@hashgraph/sdk v2.76.0',
          isMock: true,
          notice: 'Development / Mock Mode: Off-chain cryptographic sandbox.',
          clientPingMs: 1,
        }
      };
    }
  },

  async getRecords(filters?: {
    artifactType?: ArtifactType;
    privacy?: PrivacyClassification;
    query?: string;
    verifiedOnly?: boolean;
  }): Promise<{ records: DrTProvenanceRecord[]; stats: any }> {
    const params = new URLSearchParams();
    if (filters?.artifactType) params.set('artifactType', filters.artifactType);
    if (filters?.privacy) params.set('privacy', filters.privacy);
    if (filters?.query) params.set('query', filters.query);
    if (filters?.verifiedOnly) params.set('verifiedOnly', 'true');

    const res = await fetch(`/api/hedera/provenance?${params.toString()}`);
    if (!res.ok) throw new Error(`Failed to fetch records: ${res.statusText}`);
    return await res.json();
  },

  async getRecordById(id: string): Promise<DrTProvenanceRecord> {
    const res = await fetch(`/api/hedera/provenance/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error(`Record not found: ${id}`);
    const data = await res.json();
    return data.record;
  },

  async registerProvenance(req: RegisterProvenanceRequest): Promise<{
    record: DrTProvenanceRecord;
    notice: string;
  }> {
    const res = await fetch('/api/hedera/provenance/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req)
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Registration failed (HTTP ${res.status})`);
    }
    return await res.json();
  },

  async verifyProvenance(req: VerifyProvenanceRequest): Promise<VerificationResult> {
    const res = await fetch('/api/hedera/provenance/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req)
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Verification failed (HTTP ${res.status})`);
    }
    return await res.json();
  },

  async getActivity(): Promise<{ activity: HederaActivityItem[] }> {
    const res = await fetch('/api/hedera/activity');
    if (!res.ok) throw new Error(`Failed to fetch activity: ${res.statusText}`);
    return await res.json();
  }
};
