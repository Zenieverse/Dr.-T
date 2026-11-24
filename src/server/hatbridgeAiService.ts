// ============================================================================
// DR. T — HATBRIDGE SERVER-SIDE GEMINI AI SERVICE
// Grounded continuity reasoning using @google/genai (gemini-4-hydrogen)
// Strict structured 6-section output, explicit consent gates, zero PHI.
// ============================================================================

import { GoogleGenAI, Type } from '@google/genai';
import {
  HatBridgeContextItem,
  HatBridgeDecision,
  HatBridgeHandoff,
  HatBridgeRole,
  HatBridgeStructuredAiResponse,
} from '../types/hatbridgeTypes';

export const HATBRIDGE_GEMINI_MODEL = 'gemini-4-hydrogen';

export class HatBridgeAiConsentError extends Error {
  public readonly statusCode = 403;
  public readonly code = 'CONSENT_REQUIRED';
  constructor(message: string) {
    super(message);
    this.name = 'HatBridgeAiConsentError';
  }
}

export class HatBridgeAiUnavailableError extends Error {
  public readonly statusCode = 503;
  public readonly code: 'GEMINI_KEY_MISSING' | 'GEMINI_UPSTREAM_ERROR';
  constructor(code: 'GEMINI_KEY_MISSING' | 'GEMINI_UPSTREAM_ERROR', message: string) {
    super(message);
    this.name = 'HatBridgeAiUnavailableError';
    this.code = code;
  }
}

export interface HatBridgeAiQueryInput {
  mode: 'reentry_brief' | 'handoff_draft' | 'decision_qa' | 'daily_briefing' | 'assistant_query';
  prompt: string;
  aiConsentGranted: boolean;
  allowPrivatePersonal: boolean;
  activeRole?: HatBridgeRole;
  roles: HatBridgeRole[];
  contextItems: HatBridgeContextItem[];
  decisions: HatBridgeDecision[];
  handoffs: HatBridgeHandoff[];
}

export function sanitizeAndScopeContextForAi(input: HatBridgeAiQueryInput): {
  scopedRoles: HatBridgeRole[];
  scopedItems: HatBridgeContextItem[];
  scopedDecisions: HatBridgeDecision[];
  scopedHandoffs: HatBridgeHandoff[];
  redactedPrivateCount: number;
} {
  if (!input.aiConsentGranted) {
    throw new HatBridgeAiConsentError(
      'AI consent is not enabled. Enable AI Continuity Consent in HatBridge Settings & Privacy before sending workspace notes to Gemini.'
    );
  }

  let redactedPrivateCount = 0;
  const allowPriv = Boolean(input.allowPrivatePersonal);

  const filterPriv = <T extends { privacyLevel: string }>(arr: T[]): T[] =>
    arr.filter((entry) => {
      if (entry.privacyLevel === 'private_personal' && !allowPriv) {
        redactedPrivateCount += 1;
        return false;
      }
      return true;
    });

  return {
    scopedRoles: filterPriv(input.roles).slice(0, 20),
    scopedItems: filterPriv(input.contextItems).slice(0, 40),
    scopedDecisions: filterPriv(input.decisions).slice(0, 30),
    scopedHandoffs: filterPriv(input.handoffs).slice(0, 15),
    redactedPrivateCount,
  };
}

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    observedFacts: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Strictly verified facts present in the supplied HatBridge records.',
    },
    sourceReferences: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING },
          type: { type: Type.STRING },
          id: { type: Type.STRING },
          url: { type: Type.STRING },
        },
        required: ['label', 'type'],
      },
      description: 'Citations referencing actual IDs, Jira keys, Confluence pages, or decision records.',
    },
    userConfirmedDecisions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Only decisions explicitly marked status=confirmed by the user.',
    },
    aiSuggestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Helpful, calm AI suggestions clearly separated from confirmed facts.',
    },
    missingInformation: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Explicit gaps in the supplied context. Never guess or invent missing data.',
    },
    proposedNextAction: {
      type: Type.STRING,
      description: 'Single concrete, non-destructive next step grounded in the supplied context.',
    },
  },
  required: [
    'observedFacts',
    'sourceReferences',
    'userConfirmedDecisions',
    'aiSuggestions',
    'missingInformation',
    'proposedNextAction',
  ],
};

export async function runHatBridgeGeminiReasoning(
  input: HatBridgeAiQueryInput,
  geminiClient: GoogleGenAI | null,
  options?: { timeoutMs?: number }
): Promise<HatBridgeStructuredAiResponse> {
  const scoped = sanitizeAndScopeContextForAi(input);

  if (!geminiClient) {
    throw new HatBridgeAiUnavailableError(
      'GEMINI_KEY_MISSING',
      'GEMINI_API_KEY is not configured on the server. Gemini reasoning is unavailable; you can still use the deterministic local Re-entry Brief builder.'
    );
  }

  const timeoutMs = Math.max(250, Math.min(options?.timeoutMs ?? 18_000, 60_000));

  const systemInstruction = `You are HatBridge Context Navigator inside Dr. T — HatBridge ("Many Hats. One Life. Nothing Important Lost.").
CRITICAL RULES:
1. Ground every single claim strictly in the authorized JSON context below. NEVER invent Jira issues, Confluence pages, deadlines, meetings, or decisions.
2. If evidence is missing for part of the user's question, list it explicitly inside "missingInformation" and write "Not available in the connected context." where appropriate.
3. NEVER present an AI suggestion or a "proposed"/"waiting_approval" decision as a user-confirmed decision.
4. NEVER suggest cancelling or modifying protected personal/family time automatically; require human approval.
5. Do NOT include any clinical diagnosis or identifiable patient data.`;

  const contextPayload = {
    mode: input.mode,
    activeRole: input.activeRole
      ? { id: input.activeRole.id, name: input.activeRole.name, priorities: input.activeRole.currentPriorities }
      : null,
    redactedPrivateRecordsCount: scoped.redactedPrivateCount,
    roles: scoped.scopedRoles.map((r) => ({ id: r.id, name: r.name, privacy: r.privacyLevel, priorities: r.currentPriorities })),
    contextItems: scoped.scopedItems.map((i) => ({
      id: i.id,
      roleId: i.roleId,
      title: i.title,
      content: i.content,
      category: i.category,
      status: i.commitmentStatus,
      dueDate: i.dueDate,
      waitingOn: i.waitingOnPerson,
      jiraIssueKey: i.jiraIssueKey,
      confluencePageId: i.confluencePageId,
    })),
    decisions: scoped.scopedDecisions.map((d) => ({
      id: d.id,
      roleId: d.roleId,
      title: d.title,
      decision: d.decision,
      reasoning: d.reasoning,
      status: d.status,
      date: d.decisionDate,
      responsiblePerson: d.responsiblePerson,
      supportingDocument: d.supportingDocument,
      confluencePageId: d.confluencePageId,
    })),
    handoffs: scoped.scopedHandoffs.map((h) => ({
      id: h.id,
      fromRoleId: h.fromRoleId,
      situation: h.currentSituation,
      remainingWork: h.remainingWork,
      nextAction: h.nextAction,
      suggestedReturnDate: h.suggestedReturnDate,
    })),
  };

  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const generatePromise = geminiClient.models.generateContent({
      model: HATBRIDGE_GEMINI_MODEL,
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Task mode: ${input.mode}\nUser prompt: ${input.prompt}\n\nAuthorized Context JSON:\n${JSON.stringify(contextPayload)}`,
            },
          ],
        },
      ],
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.2,
      },
    });

    const timeoutPromise = new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        reject(new HatBridgeAiUnavailableError('GEMINI_UPSTREAM_ERROR', 'Gemini AI request timed out. Falling back to deterministic local continuity records.'));
      }, timeoutMs);
    });

    const response = await Promise.race([generatePromise, timeoutPromise]);
    const parsed = JSON.parse(response.text || '{}') as Partial<HatBridgeStructuredAiResponse>;
    return {
      observedFacts: Array.isArray(parsed.observedFacts) ? parsed.observedFacts : [],
      sourceReferences: Array.isArray(parsed.sourceReferences) ? parsed.sourceReferences : [],
      userConfirmedDecisions: Array.isArray(parsed.userConfirmedDecisions) ? parsed.userConfirmedDecisions : [],
      aiSuggestions: Array.isArray(parsed.aiSuggestions) ? parsed.aiSuggestions : [],
      missingInformation: [
        ...(Array.isArray(parsed.missingInformation) ? parsed.missingInformation : []),
        ...(scoped.redactedPrivateCount > 0
          ? [`${scoped.redactedPrivateCount} private_personal item(s) were withheld from AI context per your privacy settings.`]
          : []),
      ],
      proposedNextAction: parsed.proposedNextAction || 'Review the observed context above before taking action.',
      generatedBy: 'gemini',
      model: HATBRIDGE_GEMINI_MODEL,
    };
  } catch (err: any) {
    if (err instanceof HatBridgeAiUnavailableError) {
      throw err;
    }
    const cleanMsg = String(err?.message || 'Gemini AI request failed upstream.')
      .replace(/AIza[0-9A-Za-z_-]+/g, '[REDACTED]')
      .slice(0, 220);
    throw new HatBridgeAiUnavailableError('GEMINI_UPSTREAM_ERROR', cleanMsg);
  } finally {
    if (timer) clearTimeout(timer);
  }
}
