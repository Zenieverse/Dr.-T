import { CareCueMessageItem } from './types';

const TELEGRAM_API_HOST = 'https://api.telegram.org';
const REQUEST_TIMEOUT_MS = 10_000;

export const TELEGRAM_PERMISSION_BOUNDARY =
  'Telegram Bot API only receives messages sent directly to your bot (/start) or messages in groups/channels where your bot is added. Bots cannot read unrelated private user-to-user DMs.';

export interface TelegramBotIdentity {
  id: number;
  username: string;
  firstName: string;
}

export interface TelegramPollResult {
  ok: boolean;
  bot?: TelegramBotIdentity;
  messages: CareCueMessageItem[];
  nextOffset?: number;
  error?: string;
}

export interface TelegramSendResult {
  ok: boolean;
  telegramMessageId?: number;
  sentAt: string;
  error?: string;
}

export function sanitizeTelegramError(raw: unknown): string {
  const msg = raw instanceof Error ? raw.message : String(raw || 'Unknown Telegram error');
  return msg.replace(/bot\d+:[A-Za-z0-9_-]+/g, 'bot[REDACTED]');
}

function assertTelegramApiUrl(endpointMethod: string, token: string): string {
  if (!token || !token.includes(':')) {
    throw new Error('TELEGRAM_BOT_TOKEN is missing or malformed.');
  }
  const cleanMethod = endpointMethod.replace(/[^a-zA-Z0-9_]/g, '');
  const url = new URL(`${TELEGRAM_API_HOST}/bot${token.trim()}/${cleanMethod}`);
  if (url.origin !== TELEGRAM_API_HOST) {
    throw new Error('Blocked outbound request outside https://api.telegram.org');
  }
  return url.toString();
}

async function callTelegramApi<T>(
  methodName: string,
  token: string,
  options: { method: 'GET' | 'POST'; body?: Record<string, unknown>; query?: Record<string, string> }
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const baseUrl = new URL(assertTelegramApiUrl(methodName, token));
    if (options.query) {
      for (const [k, v] of Object.entries(options.query)) {
        baseUrl.searchParams.set(k, v);
      }
    }

    const res = await fetch(baseUrl.toString(), {
      method: options.method,
      redirect: 'manual',
      signal: controller.signal,
      headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (res.status >= 300 && res.status < 400) {
      throw new Error(`Unexpected redirect (${res.status}) from Telegram API.`);
    }

    const payload = (await res.json()) as {
      ok?: boolean;
      description?: string;
      result?: T;
    };

    if (!res.ok || !payload.ok) {
      throw new Error(payload.description || `Telegram HTTP ${res.status}`);
    }

    return payload.result as T;
  } catch (err) {
    throw new Error(sanitizeTelegramError(err));
  } finally {
    clearTimeout(timeout);
  }
}

export async function getTelegramBotInfo(token: string): Promise<TelegramBotIdentity> {
  const me = await callTelegramApi<{ id: number; username?: string; first_name?: string }>(
    'getMe',
    token,
    { method: 'GET' }
  );
  return {
    id: me.id,
    username: me.username || 'telegram_bot',
    firstName: me.first_name || 'CareCue Bot',
  };
}

interface RawTelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    date: number;
    text?: string;
    caption?: string;
    chat: {
      id: number;
      type: string;
      title?: string;
      username?: string;
      first_name?: string;
    };
    from?: {
      username?: string;
      first_name?: string;
      last_name?: string;
    };
  };
}

export async function pollTelegramUpdates(
  token: string,
  offset?: number
): Promise<TelegramPollResult> {
  try {
    const bot = await getTelegramBotInfo(token);
    const query: Record<string, string> = { limit: '15', timeout: '0' };
    if (typeof offset === 'number' && Number.isFinite(offset) && offset > 0) {
      query.offset = String(offset);
    }

    const updates = await callTelegramApi<RawTelegramUpdate[]>('getUpdates', token, {
      method: 'GET',
      query,
    });

    let highestUpdateId = offset ? offset - 1 : 0;
    const messages: CareCueMessageItem[] = [];

    for (const upd of updates) {
      if (upd.update_id > highestUpdateId) {
        highestUpdateId = upd.update_id;
      }
      const msg = upd.message;
      const textBody = (msg?.text || msg?.caption || '').trim();
      if (!msg || !textBody) continue;

      const fullName = [msg.from?.first_name, msg.from?.last_name]
        .filter(Boolean)
        .join(' ')
        .trim();
      const senderName =
        fullName || msg.chat.title || msg.chat.first_name || `Chat ${msg.chat.id}`;
      const senderHandle = msg.from?.username
        ? `@${msg.from.username}`
        : msg.chat.username
          ? `@${msg.chat.username}`
          : `chat:${msg.chat.id}`;
      const chatType =
        msg.chat.type === 'group' || msg.chat.type === 'supergroup'
          ? 'group_supergroup'
          : 'private_bot_chat';

      messages.push({
        id: `tg-${msg.chat.id}-${msg.message_id}`,
        telegramChatId: String(msg.chat.id),
        telegramMessageId: msg.message_id,
        senderName,
        senderHandle,
        chatType,
        receivedAt: new Date(msg.date * 1000).toISOString(),
        rawText: textBody,
        source: 'telegram_bot_api',
        status: 'UNREAD',
      });
    }

    return {
      ok: true,
      bot,
      messages,
      nextOffset: highestUpdateId > 0 ? highestUpdateId + 1 : offset,
    };
  } catch (err) {
    return {
      ok: false,
      messages: [],
      error: sanitizeTelegramError(err),
    };
  }
}

export async function sendTelegramMessage(
  token: string,
  chatId: string,
  text: string,
  replyToMessageId?: number
): Promise<TelegramSendResult> {
  try {
    const body: Record<string, unknown> = {
      chat_id: chatId,
      text: text.trim(),
    };
    if (typeof replyToMessageId === 'number' && Number.isFinite(replyToMessageId)) {
      body.reply_parameters = { message_id: replyToMessageId };
    }

    const result = await callTelegramApi<{ message_id: number }>('sendMessage', token, {
      method: 'POST',
      body,
    });

    return {
      ok: true,
      telegramMessageId: result.message_id,
      sentAt: new Date().toISOString(),
    };
  } catch (err) {
    return {
      ok: false,
      sentAt: new Date().toISOString(),
      error: sanitizeTelegramError(err),
    };
  }
}
