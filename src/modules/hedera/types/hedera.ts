// ==========================================
// HEDERA COMMONS: HEDERA NETWORK & HCS TYPES
// ==========================================

export type HederaNetwork = 'testnet' | 'mainnet' | 'previewnet' | 'mock';

export interface HederaConfig {
  network: HederaNetwork;
  accountId: string;
  privateKey: string;
  topicId: string;
  mirrorNodeUrl: string;
  isMock: boolean;
}

export interface HederaAnchorResult {
  success: boolean;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  transactionId?: string;
  topicId?: string;
  sequenceNumber?: number;
  consensusTimestamp?: string;
  runningHash?: string;
  network: string;
  hashscanUrl?: string | null;
  error?: string;
}

export interface HederaStatusResponse {
  status: 'CONNECTED' | 'NOT_CONFIGURED' | 'CONNECTING' | 'ERROR';
  mode: 'real' | 'mock';
  network: HederaNetwork;
  configured?: boolean;
  accountId?: string;
  operatorAccountMasked?: string;
  topicId: string;
  mirrorNodeUrl: string;
  hbarBalance?: string | null;
  consensusMessagesCount?: number;
  lastConsensusTimestamp?: string | null;
  connectionDetails: {
    sdkVersion?: string;
    isMock: boolean;
    hasAccountId?: boolean;
    hasPrivateKey?: boolean;
    hasTopicId?: boolean;
    notice: string;
    clientPingMs?: number;
  };
}

export interface HederaActivityItem {
  id: string;
  transactionId: string;
  topicId: string;
  sequenceNumber: number;
  consensusTimestamp: string;
  artifactId: string;
  artifactTitle: string;
  contentHash: string;
  privacyClassification: string;
  hashscanUrl?: string | null;
}
