export type CareCueSourceMode = 'synthetic_demo' | 'simulated_webhook' | 'telegram_bot_api';

export type CareCueUrgency = 'LOW' | 'MEDIUM' | 'HIGH';

export type CareCueScreenId =
  | 'HOME'
  | 'INCOMING_MESSAGE'
  | 'AI_SUMMARY'
  | 'REPLY_DRAFT'
  | 'CONFIRM_SEND'
  | 'SENT'
  | 'SETTINGS';

export type CareCueHardwareGesture =
  | 'R1_NEXT'
  | 'R1_PREV'
  | 'R1_SELECT'
  | 'TEMPLE_BACK'
  | 'TEMPLE_HOLD_HOME';

export interface CareCueDisplayPrefs {
  brightnessLevel: 1 | 2 | 3 | 4;
  compactMode: boolean;
}

export interface CareCueMessageItem {
  id: string;
  telegramChatId: string;
  telegramMessageId?: number;
  senderName: string;
  senderHandle: string;
  chatType: 'private_bot_chat' | 'group_supergroup';
  receivedAt: string;
  rawText: string;
  source: CareCueSourceMode;
  status: 'UNREAD' | 'SUMMARIZED' | 'REPLIED';
  summary?: CareCueAiSummary;
  sentReply?: {
    text: string;
    sentAt: string;
    deliveryMode: 'telegram_bot_api' | 'simulated_local';
    telegramResultMessageId?: number;
  };
}

export interface CareCueReplyDraft {
  id: string;
  tone: 'Direct' | 'Warm' | 'Defer';
  text: string;
  unverifiedUntilConfirmed: true;
}

export interface CareCueAiSummary {
  glanceHeadline: string;
  bulletPoints: string[];
  urgency: CareCueUrgency;
  recommendedAction: string;
  drafts: CareCueReplyDraft[];
  generatedAt: string;
  modelProvider: 'gemini-4-hydrogen' | 'deterministic_fallback';
  fallbackReason?: string;
}

export interface CareCueG2ScreenState {
  screen: CareCueScreenId;
  selectedMessageIndex: number;
  selectedDraftIndex: number;
  settingsRowIndex: number;
  homeRowIndex: number;
  displayPrefs: CareCueDisplayPrefs;
  lastGesture: string;
  stagedReplyText: string;
  lastError?: string | null;
}

export interface CareCueAuditEntry {
  id: string;
  timestamp: string;
  eventType:
    | 'TELEGRAM_BOT_VERIFIED'
    | 'TELEGRAM_POLLED'
    | 'TELEGRAM_SESSION_TOGGLED'
    | 'MESSAGE_SIMULATED'
    | 'AI_SUMMARIZED'
    | 'REPLY_BLOCKED_UNCONFIRMED'
    | 'REPLY_BLOCKED_DUPLICATE'
    | 'REPLY_CONFIRMED_AND_SENT'
    | 'TEST_MESSAGE_SENT'
    | 'DEMO_RESET';
  messageId?: string;
  detail: string;
  sourceMode: CareCueSourceMode | 'system';
}

export interface CareCueDeliveryVerification {
  ok: boolean;
  telegramMessageId?: number;
  sentAt: string;
  maskedChatId: string;
  previewText: string;
  error?: string;
}

export interface CareCueBotStatus {
  telegramConfigured: boolean;
  defaultChatIdConfigured: boolean;
  defaultChatIdHint: string | null;
  sessionPaused: boolean;
  botVerified: boolean;
  botId: number | null;
  botUsername: string | null;
  botFirstName: string | null;
  botError?: string | null;
  telegramHost: string;
  geminiConfigured: boolean;
  permissionBoundary: string;
  messageCount: number;
  auditCount: number;
  lastDeliveryVerification: CareCueDeliveryVerification | null;
}
