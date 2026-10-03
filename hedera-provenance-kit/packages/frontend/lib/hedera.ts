// ==========================================
// HEDERA PROVENANCE KIT: HCS CLIENT
// Hedera Consensus Service Client Wrapper
// ==========================================

import fs from 'fs';
import path from 'path';
import {
  Client,
  TopicMessageSubmitTransaction,
  TopicId,
  AccountId,
  PrivateKey,
  Hbar
} from '@hashgraph/sdk';
import { 
  HPKProvenancePayload, 
  HederaNetwork, 
  HederaStatus 
} from './types';

export class HederaHcsClient {
  private client: Client | null = null;
  private network: HederaNetwork = 'testnet';
  private topicIdStr: string = '0.0.10818730';
  private accountIdStr: string = '';
  private mirrorNodeUrl: string = 'https://testnet.mirrornode.hedera.com';
  private isConfigured: boolean = false;

  constructor() {
    this.initFromEnv();
  }

  private initFromEnv() {
    let devEnv: Record<string, string> = {};
    try {
      const devPath = path.join(process.cwd(), '../../../.dev.env.json');
      if (fs.existsSync(devPath)) {
        devEnv = JSON.parse(fs.readFileSync(devPath, 'utf8'));
      }
    } catch {
      // ignore
    }

    const rawNetwork = (process.env.HEDERA_NETWORK || devEnv.HEDERA_NETWORK || 'testnet').toLowerCase() as HederaNetwork;
    const rawMode = (process.env.HEDERA_MODE || devEnv.HEDERA_MODE || '').toLowerCase();
    
    let rawAccountId = (process.env.HEDERA_ACCOUNT_ID || '').trim();
    if (!/^\d+\.\d+\.\d+$/.test(rawAccountId)) {
      rawAccountId = (devEnv.HEDERA_CLIENT_ACCOUNT_ID || devEnv.HEDERA_ACCOUNT_ID || '').trim();
    }
    const accountId = /^\d+\.\d+\.\d+$/.test(rawAccountId) ? rawAccountId : '';

    let privateKey = (process.env.HEDERA_PRIVATE_KEY || '').trim();
    if (!privateKey || privateKey.length > 200 || privateKey.startsWith('MIGf')) {
      privateKey = (devEnv.HEDERA_CLIENT_PRIVATE_KEY || devEnv.HEDERA_PRIVATE_KEY || '').trim();
    }

    const rawTopicId = (process.env.HEDERA_TOPIC_ID || devEnv.HEDERA_TOPIC_ID || '').trim();
    const topicId = /^\d+\.\d+\.\d+/.test(rawTopicId) ? rawTopicId : '0.0.10818730';
    const customMirrorUrl = (process.env.HEDERA_MIRROR_NODE_URL || devEnv.HEDERA_MIRROR_NODE_URL || '').trim();

    this.network = rawNetwork === 'mainnet' ? 'mainnet' : rawNetwork === 'previewnet' ? 'previewnet' : 'testnet';
    this.topicIdStr = topicId;
    this.accountIdStr = accountId;

    if (customMirrorUrl && /^https?:\/\//i.test(customMirrorUrl)) {
      this.mirrorNodeUrl = customMirrorUrl;
    } else {
      this.mirrorNodeUrl = this.network === 'mainnet' 
        ? 'https://mainnet.mirrornode.hedera.com' 
        : 'https://testnet.mirrornode.hedera.com';
    }

    const shouldConnectReal = (rawMode === 'real' || Boolean(devEnv.HEDERA_CLIENT_ACCOUNT_ID)) && accountId && privateKey;
    if (shouldConnectReal) {
      try {
        let clientInstance: Client;
        if (this.network === 'mainnet') {
          clientInstance = Client.forMainnet();
        } else if (this.network === 'previewnet') {
          clientInstance = Client.forPreviewnet();
        } else {
          clientInstance = Client.forTestnet();
        }

        const operatorId = AccountId.fromString(accountId);
        let operatorKey: PrivateKey;
        try {
          operatorKey = PrivateKey.fromStringECDSA(privateKey);
        } catch {
          try {
            operatorKey = PrivateKey.fromStringDer(privateKey);
          } catch {
            operatorKey = PrivateKey.fromString(privateKey);
          }
        }

        clientInstance.setOperator(operatorId, operatorKey);
        clientInstance.setDefaultMaxTransactionFee(new Hbar(2));

        this.client = clientInstance;
        this.isConfigured = true;
      } catch (err) {
        console.warn('[HederaHcsClient] Real client setup failed, falling back to mock sandbox:', err);
        this.client = null;
        this.isConfigured = false;
      }
    } else {
      this.client = null;
      this.isConfigured = false;
    }
  }

  public getStatus(): HederaStatus {
    const isReal = this.isConfigured && this.client !== null;
    return {
      status: isReal ? 'CONNECTED' : 'MOCK_SANDBOX',
      network: this.network,
      mode: isReal ? 'real' : 'mock',
      operatorAccountMasked: this.accountIdStr ? `${this.accountIdStr.slice(0, 3)}****` : '0.0.sandbox',
      topicId: this.topicIdStr,
      mirrorNodeUrl: this.mirrorNodeUrl,
      isMock: !isReal
    };
  }

  /**
   * Submits a compact provenance payload to Hedera Consensus Service
   */
  public async submitProvenance(payload: HPKProvenancePayload): Promise<{
    transactionId: string;
    formattedTransactionId: string;
    topicId: string;
    sequenceNumber: number;
    consensusTimestamp: string;
    runningHash: string;
    hashscanUrl: string;
    isMock: boolean;
  }> {
    const messageJson = JSON.stringify(payload);

    if (this.isConfigured && this.client) {
      const topicId = TopicId.fromString(this.topicIdStr);
      const tx = new TopicMessageSubmitTransaction()
        .setTopicId(topicId)
        .setMessage(messageJson);

      const txResponse = await tx.execute(this.client);
      const receipt = await txResponse.getReceipt(this.client);

      const rawTxId = txResponse.transactionId.toString();
      const formattedTxId = rawTxId.replace('@', '-').replace(/\.(\d{9})$/, '-$1');
      const sequenceNumber = receipt.topicSequenceNumber ? receipt.topicSequenceNumber.toNumber() : 0;
      const consensusTimestamp = `${Date.now() / 1000}`;
      const runningHash = receipt.topicRunningHash ? receipt.topicRunningHash.toString() : 'Verified';
      const hashscanUrl = `https://hashscan.io/${this.network}/transaction/${formattedTxId}`;

      return {
        transactionId: rawTxId,
        formattedTransactionId: formattedTxId,
        topicId: this.topicIdStr,
        sequenceNumber,
        consensusTimestamp,
        runningHash,
        hashscanUrl,
        isMock: false
      };
    }

    // Mock Mode fallback
    const mockSec = Math.floor(Date.now() / 1000);
    const mockTx = `0.0.mock@${mockSec}.100200300`;
    return {
      transactionId: mockTx,
      formattedTransactionId: `0.0.mock-${mockSec}-100200300`,
      topicId: this.topicIdStr,
      sequenceNumber: 1042,
      consensusTimestamp: `${mockSec}.100200300`,
      runningHash: '0xmockrunninghash',
      hashscanUrl: '', // Explicitly no fake hashscan link in mock mode
      isMock: true
    };
  }

  public getTopicId(): string {
    return this.topicIdStr;
  }

  public getMirrorNodeUrl(): string {
    return this.mirrorNodeUrl;
  }
}

export const hederaClient = new HederaHcsClient();
