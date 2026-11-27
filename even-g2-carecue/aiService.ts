import { GoogleGenAI, Type } from '@google/genai';
import {
  CareCueAiSummary,
  CareCueMessageItem,
  CareCueReplyDraft,
  CareCueUrgency,
} from './types';

function truncate(text: string, maxLen: number): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLen) return clean;
  return `${clean.slice(0, Math.max(1, maxLen - 3))}...`;
}

function buildDeterministicFallback(
  message: CareCueMessageItem,
  fallbackReason: string
): CareCueAiSummary {
  const textLower = message.rawText.toLowerCase();
  const urgency: CareCueUrgency =
    /urgent|asap|immediately|emergency|late|reroute|standup/.test(textLower)
      ? 'HIGH'
      : /\?/.test(message.rawText)
        ? 'MEDIUM'
        : 'LOW';

  const words = message.rawText.replace(/\s+/g, ' ').trim();
  const firstClause = words.split(/[.!?]/)[0] || words;

  const drafts: CareCueReplyDraft[] = [
    {
      id: `draft-${message.id}-1`,
      tone: 'Direct',
      text: truncate('Got it — checking now and will confirm shortly.', 90),
      unverifiedUntilConfirmed: true,
    },
    {
      id: `draft-${message.id}-2`,
      tone: 'Warm',
      text: truncate(`Thanks ${message.senderName.split(' ')[0]}, seen on glasses — following up right away.`, 90),
      unverifiedUntilConfirmed: true,
    },
    {
      id: `draft-${message.id}-3`,
      tone: 'Defer',
      text: truncate('Saw your note — let me get back to you in 15 mins.', 90),
      unverifiedUntilConfirmed: true,
    },
  ];

  return {
    glanceHeadline: truncate(`${message.senderName}: ${firstClause}`, 44),
    bulletPoints: [
      truncate(firstClause, 50),
      message.rawText.length > 52 ? truncate(message.rawText.slice(firstClause.length).trim() || 'Reply requested', 50) : 'Tap R1 to choose a short reply draft',
    ].filter(Boolean),
    urgency,
    recommendedAction: 'Review drafts on G2 and explicitly confirm before sending.',
    drafts,
    generatedAt: new Date().toISOString(),
    modelProvider: 'deterministic_fallback',
    fallbackReason,
  };
}

export async function summarizeMessageForG2(
  message: CareCueMessageItem,
  geminiClient: GoogleGenAI | null
): Promise<CareCueAiSummary> {
  if (!geminiClient) {
    return buildDeterministicFallback(
      message,
      'GEMINI_API_KEY is not configured on the server; using deterministic G2 glance formatter.'
    );
  }

  try {
    const response = await geminiClient.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: `Summarize this incoming Telegram message for an Even Realities G2 smart-glasses monochrome 576x288 HUD and propose 3 short reply drafts.\n\nSender: ${message.senderName} (${message.senderHandle})\nChat type: ${message.chatType}\nMessage: "${message.rawText}"`,
      config: {
        systemInstruction:
          'You format Telegram messages for tiny smart-glasses micro-LED screens. Be concise, accurate to the sender text only, never invent facts, and NEVER fabricate medical urgency or clinical triage claims. Base urgency strictly on explicit operational/time cues in the message text. Keep glanceHeadline <= 42 chars, bulletPoints <= 3 items each <= 48 chars, and drafts strictly 3 items each <= 88 chars ready for wearer confirmation.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            glanceHeadline: { type: Type.STRING },
            bulletPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            urgency: { type: Type.STRING },
            recommendedAction: { type: Type.STRING },
            drafts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  tone: { type: Type.STRING },
                  text: { type: Type.STRING },
                },
                required: ['tone', 'text'],
              },
            },
          },
          required: ['glanceHeadline', 'bulletPoints', 'urgency', 'recommendedAction', 'drafts'],
        },
      },
    });

    const parsed = JSON.parse((response.text ?? '{}').trim()) as {
      glanceHeadline?: string;
      bulletPoints?: string[];
      urgency?: string;
      recommendedAction?: string;
      drafts?: Array<{ tone?: string; text?: string }>;
    };

    const urgency: CareCueUrgency =
      parsed.urgency === 'HIGH' || parsed.urgency === 'MEDIUM' || parsed.urgency === 'LOW'
        ? parsed.urgency
        : 'MEDIUM';

    const bullets = Array.isArray(parsed.bulletPoints)
      ? parsed.bulletPoints
          .map((b) => truncate(String(b || ''), 50))
          .filter(Boolean)
          .slice(0, 3)
      : [];

    const rawDrafts = Array.isArray(parsed.drafts) ? parsed.drafts.slice(0, 3) : [];
    const tones: Array<'Direct' | 'Warm' | 'Defer'> = ['Direct', 'Warm', 'Defer'];
    const drafts: CareCueReplyDraft[] = tones.map((fallbackTone, idx) => {
      const candidate = rawDrafts[idx];
      const tone =
        candidate?.tone === 'Direct' || candidate?.tone === 'Warm' || candidate?.tone === 'Defer'
          ? candidate.tone
          : fallbackTone;
      const text = truncate(
        String(candidate?.text || 'Received — checking now and will reply shortly.'),
        92
      );
      return {
        id: `draft-${message.id}-${idx + 1}`,
        tone,
        text,
        unverifiedUntilConfirmed: true,
      };
    });

    return {
      glanceHeadline: truncate(
        parsed.glanceHeadline || `${message.senderName}: Telegram Note`,
        44
      ),
      bulletPoints: bullets.length > 0 ? bullets : [truncate(message.rawText, 50)],
      urgency,
      recommendedAction: truncate(
        parsed.recommendedAction || 'Select draft on G2 and confirm before sending.',
        90
      ),
      drafts,
      generatedAt: new Date().toISOString(),
      modelProvider: 'gemini-4-hydrogen',
    };
  } catch (err) {
    const reason = err instanceof Error ? err.message : 'Gemini request failed';
    return buildDeterministicFallback(
      message,
      `Gemini unavailable (${truncate(reason, 90)}); fell back to deterministic formatter.`
    );
  }
}
