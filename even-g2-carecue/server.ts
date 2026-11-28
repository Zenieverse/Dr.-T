import express from 'express';
import type { GoogleGenAI } from '@google/genai';
import { createSyntheticDemoMessages } from './syntheticData';
import {
  TELEGRAM_PERMISSION_BOUNDARY,
  getTelegramBotInfo,
  pollTelegramUpdates,
  sanitizeTelegramError,
  sendTelegramMessage,
} from './telegramClient';
import { summarizeMessageForG2 } from './aiService';
import {
  CareCueAuditEntry,
  CareCueBotStatus,
  CareCueDeliveryVerification,
  CareCueMessageItem,
} from './types';

function maskChatId(chatId: string): string {
  const clean = chatId.trim();
  if (!clean) return '***';
  if (clean.length <= 4) return `***${clean}`;
  return `***${clean.slice(-4)}`;
}

interface CareCueServerState {
  messages: CareCueMessageItem[];
  audit: CareCueAuditEntry[];
  telegramOffset?: number;
  sessionPaused: boolean;
  cachedBot: { id: number; username: string; firstName: string } | null;
  lastDeliveryVerification: CareCueDeliveryVerification | null;
}

export function createCareCueRouter(getGemini: () => GoogleGenAI | null) {
  const router = express.Router();
  const inFlightMessageIds = new Set<string>();

  const state: CareCueServerState = {
    messages: createSyntheticDemoMessages(),
    audit: [],
    sessionPaused: false,
    cachedBot: null,
    lastDeliveryVerification: null,
  };

  function appendAudit(
    eventType: CareCueAuditEntry['eventType'],
    detail: string,
    sourceMode: CareCueAuditEntry['sourceMode'],
    messageId?: string
  ) {
    const entry: CareCueAuditEntry = {
      id: `audit-${Date.now()}-${state.audit.length + 1}`,
      timestamp: new Date().toISOString(),
      eventType,
      messageId,
      detail: sanitizeTelegramError(detail),
      sourceMode,
    };
    state.audit.unshift(entry);
    if (state.audit.length > 100) {
      state.audit.length = 100;
    }
    return entry;
  }

  function buildStatusPayload(botError: string | null = null): CareCueBotStatus {
    const botToken = (process.env.TELEGRAM_BOT_TOKEN || '').trim();
    const defaultChatId = (process.env.TELEGRAM_DEFAULT_CHAT_ID || '').trim();
    const geminiConfigured = Boolean((process.env.GEMINI_API_KEY || '').trim());

    return {
      telegramConfigured: Boolean(botToken),
      defaultChatIdConfigured: Boolean(defaultChatId),
      defaultChatIdHint: defaultChatId ? maskChatId(defaultChatId) : null,
      sessionPaused: state.sessionPaused,
      botVerified: Boolean(botToken && state.cachedBot),
      botId: state.cachedBot?.id ?? null,
      botUsername: state.cachedBot?.username ?? null,
      botFirstName: state.cachedBot?.firstName ?? null,
      botError,
      telegramHost: 'https://api.telegram.org',
      geminiConfigured,
      permissionBoundary: TELEGRAM_PERMISSION_BOUNDARY,
      messageCount: state.messages.length,
      auditCount: state.audit.length,
      lastDeliveryVerification: state.lastDeliveryVerification,
    };
  }

  router.get('/status', async (_req, res) => {
    const botToken = (process.env.TELEGRAM_BOT_TOKEN || '').trim();
    let botError: string | null = null;

    if (botToken && !state.cachedBot && !state.sessionPaused) {
      try {
        const me = await getTelegramBotInfo(botToken);
        state.cachedBot = { id: me.id, username: me.username, firstName: me.firstName };
      } catch (err) {
        botError = sanitizeTelegramError(err);
      }
    }

    res.json(buildStatusPayload(botError));
  });

  router.post('/telegram/session', (req, res) => {
    if (typeof req.body?.paused !== 'boolean') {
      return res.status(400).json({
        code: 'VALIDATION_ERROR',
        error: 'Boolean field "paused" is required.',
      });
    }
    state.sessionPaused = req.body.paused;
    appendAudit(
      'TELEGRAM_SESSION_TOGGLED',
      state.sessionPaused
        ? 'Wearer paused/disconnected active Telegram session from CareCue Settings.'
        : 'Wearer reconnected Telegram session from CareCue Settings.',
      'system'
    );
    return res.json({
      ok: true,
      sessionPaused: state.sessionPaused,
      status: buildStatusPayload(null),
    });
  });

  router.post('/telegram/verify-bot', async (_req, res) => {
    const botToken = (process.env.TELEGRAM_BOT_TOKEN || '').trim();
    if (!botToken) {
      return res.status(400).json({
        code: 'BOT_NOT_CONFIGURED',
        error: 'TELEGRAM_BOT_TOKEN is not configured on the backend.',
      });
    }
    if (state.sessionPaused) {
      return res.status(409).json({
        code: 'SESSION_PAUSED',
        error: 'Telegram session is paused in CareCue Settings. Reconnect first to verify the bot.',
      });
    }

    try {
      const me = await getTelegramBotInfo(botToken);
      state.cachedBot = { id: me.id, username: me.username, firstName: me.firstName };
      appendAudit(
        'TELEGRAM_BOT_VERIFIED',
        `Verified Telegram bot @${me.username} (ID ${me.id}) via getMe.`,
        'telegram_bot_api'
      );
      return res.json({
        ok: true,
        bot: me,
        status: buildStatusPayload(null),
      });
    } catch (err) {
      const sanitized = sanitizeTelegramError(err);
      return res.status(502).json({
        code: 'TELEGRAM_VERIFY_FAILED',
        error: sanitized,
      });
    }
  });

  router.post('/telegram/test-send', async (req, res) => {
    const botToken = (process.env.TELEGRAM_BOT_TOKEN || '').trim();
    const defaultChatId = (process.env.TELEGRAM_DEFAULT_CHAT_ID || '').trim();
    const wearerConfirmed = req.body?.wearerConfirmed === true;
    const text =
      String(req.body?.text || '').trim().slice(0, 400) ||
      'Dr. T CareCue G2 verification check: live Telegram Bot API delivery confirmed.';

    if (!wearerConfirmed) {
      appendAudit(
        'REPLY_BLOCKED_UNCONFIRMED',
        'Blocked outbound Telegram test send: explicit wearer confirmation was not true.',
        'system'
      );
      return res.status(403).json({
        code: 'CONFIRMATION_REQUIRED',
        error: 'Explicit user confirmation is required before sending any Telegram message.',
      });
    }

    if (state.sessionPaused) {
      return res.status(409).json({
        code: 'SESSION_PAUSED',
        error: 'Telegram session is paused in CareCue Settings. Reconnect before sending.',
      });
    }

    if (!botToken) {
      return res.status(400).json({
        code: 'BOT_NOT_CONFIGURED',
        error: 'TELEGRAM_BOT_TOKEN is not configured on the backend.',
      });
    }

    if (!defaultChatId) {
      return res.status(400).json({
        code: 'DEFAULT_CHAT_ID_NOT_CONFIGURED',
        error: 'TELEGRAM_DEFAULT_CHAT_ID is not configured on the backend.',
      });
    }

    const result = await sendTelegramMessage(botToken, defaultChatId, text);
    if (!result.ok) {
      const failedVerification: CareCueDeliveryVerification = {
        ok: false,
        sentAt: result.sentAt,
        maskedChatId: maskChatId(defaultChatId),
        previewText: text,
        error: result.error || 'Telegram sendMessage failed.',
      };
      state.lastDeliveryVerification = failedVerification;
      return res.status(502).json({
        code: 'TELEGRAM_SEND_FAILED',
        error: failedVerification.error,
        deliveryVerification: failedVerification,
      });
    }

    const verification: CareCueDeliveryVerification = {
      ok: true,
      telegramMessageId: result.telegramMessageId,
      sentAt: result.sentAt,
      maskedChatId: maskChatId(defaultChatId),
      previewText: text,
    };
    state.lastDeliveryVerification = verification;

    appendAudit(
      'TEST_MESSAGE_SENT',
      `Sent confirmed test message (msg_id=${result.telegramMessageId}) to configured chat ${verification.maskedChatId}.`,
      'telegram_bot_api'
    );

    return res.json({
      ok: true,
      deliveryVerification: verification,
      status: buildStatusPayload(null),
    });
  });

  router.get('/messages', (_req, res) => {
    const sorted = [...state.messages].sort(
      (a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
    );
    res.json({ messages: sorted });
  });

  router.post('/telegram/poll', async (_req, res) => {
    if (state.sessionPaused) {
      return res.status(409).json({
        code: 'SESSION_PAUSED',
        error: 'Telegram session is paused in CareCue Settings. Reconnect before polling updates.',
      });
    }

    const botToken = (process.env.TELEGRAM_BOT_TOKEN || '').trim();
    if (!botToken) {
      return res.status(400).json({
        code: 'BOT_NOT_CONFIGURED',
        error:
          'TELEGRAM_BOT_TOKEN is not configured on the server. Set it in server environment variables or use Simulate Incoming Message to test the full G2 flow.',
      });
    }

    const poll = await pollTelegramUpdates(botToken, state.telegramOffset);
    if (!poll.ok) {
      return res.status(502).json({
        code: 'TELEGRAM_UPSTREAM_ERROR',
        error: poll.error || 'Failed to poll Telegram Bot API.',
      });
    }

    if (poll.bot) {
      state.cachedBot = {
        id: poll.bot.id,
        username: poll.bot.username,
        firstName: poll.bot.firstName,
      };
    }
    if (poll.nextOffset) {
      state.telegramOffset = poll.nextOffset;
    }

    let added = 0;
    const existingIds = new Set(state.messages.map((m) => m.id));
    for (const incoming of poll.messages) {
      if (!existingIds.has(incoming.id)) {
        state.messages.unshift(incoming);
        existingIds.add(incoming.id);
        added += 1;
      }
    }

    appendAudit(
      'TELEGRAM_POLLED',
      `Polled @${poll.bot?.username || 'bot'}: ${poll.messages.length} updates inspected, ${added} new messages queued.`,
      'telegram_bot_api'
    );

    return res.json({
      ok: true,
      bot: poll.bot,
      added,
      messages: [...state.messages].sort(
        (a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
      ),
    });
  });

  router.post('/telegram/simulate', (req, res) => {
    const senderName = String(req.body?.senderName || '').trim().slice(0, 60);
    const senderHandle = String(req.body?.senderHandle || '').trim().slice(0, 40);
    const rawText = String(req.body?.rawText || '').trim().slice(0, 600);
    const chatType =
      req.body?.chatType === 'group_supergroup' ? 'group_supergroup' : 'private_bot_chat';

    if (!senderName || !rawText) {
      return res.status(400).json({
        code: 'VALIDATION_ERROR',
        error: 'Both senderName and rawText are required to simulate an incoming Telegram message.',
      });
    }

    const item: CareCueMessageItem = {
      id: `sim-tg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      telegramChatId:
        (process.env.TELEGRAM_DEFAULT_CHAT_ID || '').trim() || `sim-chat-${Date.now()}`,
      senderName,
      senderHandle: senderHandle || `@${senderName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
      chatType,
      receivedAt: new Date().toISOString(),
      rawText,
      source: 'simulated_webhook',
      status: 'UNREAD',
    };

    state.messages.unshift(item);
    appendAudit(
      'MESSAGE_SIMULATED',
      `Simulated incoming Telegram note from ${item.senderName} (${item.senderHandle}).`,
      'simulated_webhook',
      item.id
    );

    return res.status(201).json({ message: item });
  });

  router.post('/ai/summarize', async (req, res) => {
    const messageId = String(req.body?.messageId || '').trim();
    const target = state.messages.find((m) => m.id === messageId);
    if (!target) {
      return res.status(404).json({
        code: 'MESSAGE_NOT_FOUND',
        error: `Message "${messageId}" was not found in the active queue.`,
      });
    }

    const summary = await summarizeMessageForG2(target, getGemini());
    target.summary = summary;
    if (target.status === 'UNREAD') {
      target.status = 'SUMMARIZED';
    }

    appendAudit(
      'AI_SUMMARIZED',
      `Generated G2 glance summary (${summary.modelProvider}, urgency=${summary.urgency}) with ${summary.drafts.length} unverified drafts.`,
      target.source,
      target.id
    );

    return res.json({ message: target, summary });
  });

  router.post('/telegram/send', async (req, res) => {
    const messageId = String(req.body?.messageId || '').trim();
    const replyText = String(req.body?.replyText || '').trim().slice(0, 500);
    const wearerConfirmed = req.body?.wearerConfirmed === true;

    if (!messageId || !replyText) {
      return res.status(400).json({
        code: 'VALIDATION_ERROR',
        error: 'messageId and non-empty replyText are required.',
      });
    }

    if (!wearerConfirmed) {
      appendAudit(
        'REPLY_BLOCKED_UNCONFIRMED',
        'Blocked outbound Telegram send: explicit wearer confirmation was not true.',
        'system',
        messageId
      );
      return res.status(403).json({
        code: 'CONFIRMATION_REQUIRED',
        error:
          'Wearer confirmation is required before sending any Telegram reply from CareCue G2.',
      });
    }

    if (state.sessionPaused) {
      return res.status(409).json({
        code: 'SESSION_PAUSED',
        error: 'Telegram session is paused in CareCue Settings. Reconnect before sending.',
      });
    }

    const target = state.messages.find((m) => m.id === messageId);
    if (!target) {
      return res.status(404).json({
        code: 'MESSAGE_NOT_FOUND',
        error: `Message "${messageId}" was not found.`,
      });
    }

    if (inFlightMessageIds.has(messageId) || target.status === 'REPLIED') {
      appendAudit(
        'REPLY_BLOCKED_DUPLICATE',
        `Blocked duplicate reply attempt for message ${messageId} (${target.senderName}).`,
        target.source,
        target.id
      );
      return res.status(409).json({
        code: 'DUPLICATE_SEND_PREVENTED',
        error: 'A reply has already been sent for this message; duplicate sends are blocked.',
      });
    }

    inFlightMessageIds.add(messageId);
    try {
      const botToken = (process.env.TELEGRAM_BOT_TOKEN || '').trim();
      const shouldSendLive = target.source === 'telegram_bot_api' && Boolean(botToken);

      if (shouldSendLive) {
        const result = await sendTelegramMessage(
          botToken,
          target.telegramChatId,
          replyText,
          target.telegramMessageId
        );
        if (!result.ok) {
          return res.status(502).json({
            code: 'TELEGRAM_SEND_FAILED',
            error: result.error || 'Telegram sendMessage failed.',
          });
        }

        target.status = 'REPLIED';
        target.sentReply = {
          text: replyText,
          sentAt: result.sentAt,
          deliveryMode: 'telegram_bot_api',
          telegramResultMessageId: result.telegramMessageId,
        };
        state.lastDeliveryVerification = {
          ok: true,
          telegramMessageId: result.telegramMessageId,
          sentAt: result.sentAt,
          maskedChatId: maskChatId(target.telegramChatId),
          previewText: replyText,
        };
      } else {
        target.status = 'REPLIED';
        target.sentReply = {
          text: replyText,
          sentAt: new Date().toISOString(),
          deliveryMode: 'simulated_local',
        };
      }

      appendAudit(
        'REPLY_CONFIRMED_AND_SENT',
        `Wearer confirmed and dispatched reply to ${target.senderName} via ${target.sentReply.deliveryMode}.`,
        target.source,
        target.id
      );

      return res.json({
        ok: true,
        message: target,
        deliveryMode: target.sentReply.deliveryMode,
      });
    } finally {
      inFlightMessageIds.delete(messageId);
    }
  });

  router.get('/audit', (_req, res) => {
    res.json({ entries: state.audit });
  });

  router.post('/demo/reset', (_req, res) => {
    state.messages = createSyntheticDemoMessages();
    state.audit = [];
    state.sessionPaused = false;
    appendAudit(
      'DEMO_RESET',
      'Reset CareCue G2 queue to 3 synthetic demo Telegram threads.',
      'synthetic_demo'
    );
    return res.json({
      ok: true,
      messages: state.messages,
      audit: state.audit,
      status: buildStatusPayload(null),
    });
  });

  return router;
}

export function registerCareCueRoutes(
  app: express.Application,
  getGemini: () => GoogleGenAI | null
) {
  app.use('/api/carecue', createCareCueRouter(getGemini));
}
