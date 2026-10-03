// ==========================================
// HEDERA MIRROR NODE VERIFICATION SERVICE
// REST API Client for Immutable Verification
// ==========================================

import { HederaNetwork } from './types';

export interface MirrorNodeConfig {
  network: HederaNetwork;
  baseUrl: string;
  isMock: boolean;
}

export interface MirrorTopicMessage {
  consensus_timestamp: string;
  topic_id: string;
  message: string; // base64 encoded
  running_hash: string;
  sequence_number: number;
  payer_account_id?: string;
}

export interface MirrorVerificationResult {
  queried: boolean;
  statusCode?: number;
  consensusVerified: boolean;
  consensusTimestamp?: string;
  sequenceNumber?: number;
  runningHash?: string;
  rawPayload?: unknown;
  message?: string;
  isMock: boolean;
}

export class HederaMirrorNodeService {
  private config: MirrorNodeConfig;

  constructor(network: HederaNetwork = 'testnet', customUrl?: string, isMock: boolean = true) {
    let defaultUrl = 'https://testnet.mirrornode.hedera.com';
    if (network === 'mainnet') defaultUrl = 'https://mainnet.mirrornode.hedera.com';
    if (network === 'previewnet') defaultUrl = 'https://previewnet.mirrornode.hedera.com';

    const validUrl = customUrl && /^https?:\/\//i.test(customUrl) ? customUrl : defaultUrl;

    this.config = {
      network,
      baseUrl: validUrl,
      isMock,
    };
  }

  public setConfig(network: HederaNetwork, customUrl?: string, isMock: boolean = false) {
    let defaultUrl = 'https://testnet.mirrornode.hedera.com';
    if (network === 'mainnet') defaultUrl = 'https://mainnet.mirrornode.hedera.com';
    if (network === 'previewnet') defaultUrl = 'https://previewnet.mirrornode.hedera.com';

    const validUrl = customUrl && /^https?:\/\//i.test(customUrl) ? customUrl : defaultUrl;

    this.config = {
      network,
      baseUrl: validUrl,
      isMock,
    };
  }

  public getBaseUrl(): string {
    return this.config.baseUrl;
  }

  /**
   * Queries Mirror Node by Topic ID and Sequence Number to verify anchored message
   */
  public async verifyTopicMessage(
    topicId: string, 
    sequenceNumber: number, 
    expectedContentHash: string
  ): Promise<MirrorVerificationResult> {
    const isRealOnChainTopic = topicId === '0.0.10818730';

    if (this.config.isMock && !isRealOnChainTopic) {
      // In mock mode for simulated mock topics, Mirror Node verification is resolved locally with explicit notice
      return {
        queried: true,
        statusCode: 200,
        consensusVerified: true,
        sequenceNumber,
        isMock: true,
        message: 'Local Verification Gate: Simulated Mirror Node check passed in Development/Mock mode.',
      };
    }

    try {
      const url = `${this.config.baseUrl}/api/v1/topics/${topicId}/messages/${sequenceNumber}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const resp = await fetch(url, {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      });
      clearTimeout(timeoutId);

      if (!resp.ok) {
        return {
          queried: true,
          statusCode: resp.status,
          consensusVerified: false,
          isMock: false,
          message: `Mirror Node returned HTTP ${resp.status} for topic ${topicId} seq ${sequenceNumber}`,
        };
      }

      const data: MirrorTopicMessage = await resp.json();
      
      // Decode base64 message
      let decodedJson: any = null;
      try {
        const decodedText = Buffer.from(data.message, 'base64').toString('utf8');
        decodedJson = JSON.parse(decodedText);
      } catch {
        // Raw message format
      }

      const anchoredHash = decodedJson?.contentHash || '';
      const consensusVerified = Boolean(
        anchoredHash && 
        anchoredHash.toLowerCase() === expectedContentHash.toLowerCase()
      );

      return {
        queried: true,
        statusCode: 200,
        consensusVerified,
        consensusTimestamp: data.consensus_timestamp,
        sequenceNumber: data.sequence_number,
        runningHash: data.running_hash,
        rawPayload: decodedJson,
        isMock: false,
        message: consensusVerified 
          ? 'Cryptographic integrity verified against Hedera Mirror Node consensus ledger.'
          : 'Mirror Node message found, but anchored hash did not match expected artifact digest.',
      };
    } catch (err: any) {
      return {
        queried: false,
        consensusVerified: false,
        isMock: false,
        message: `Mirror Node network error: ${err.message || 'Connection timed out'}`,
      };
    }
  }

  /**
   * Fetches latest messages on a given topic
   */
  public async getRecentTopicMessages(topicId: string, limit = 10): Promise<MirrorTopicMessage[]> {
    if (this.config.isMock) {
      return [];
    }

    try {
      const url = `${this.config.baseUrl}/api/v1/topics/${topicId}/messages?limit=${limit}&order=desc`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const resp = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!resp.ok) return [];
      const data = await resp.json();
      return data.messages || [];
    } catch {
      return [];
    }
  }

  /**
   * Fetches real account balance (HBAR) from Mirror Node
   */
  public async getAccountBalance(accountId: string): Promise<string | null> {
    if (this.config.isMock || !accountId || accountId.includes('*')) {
      return null;
    }

    try {
      const url = `${this.config.baseUrl}/api/v1/accounts/${accountId}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const resp = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!resp.ok) return null;
      const data = await resp.json();
      const tinybars = data.balance?.balance;
      if (tinybars !== undefined) {
        const hbars = (Number(tinybars) / 100_000_000).toFixed(4);
        return `${hbars} ℏ`;
      }
      return null;
    } catch {
      return null;
    }
  }
}

export const hederaMirrorNodeService = new HederaMirrorNodeService();
