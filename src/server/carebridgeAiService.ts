// ============================================================================
// DR. T — CAREBRIDGE SERVER-SIDE GEMINI AI SERVICE
// Uses @google/genai ('gemini-4-hydrogen') strictly server-side with:
//   - Explicit user consent checks
//   - Identifiable health info scrubbing before outbound calls
//   - Clear separation of source facts vs AI-generated unconfirmed output
//   - Mandatory non-clinician / non-diagnostic guardrails
//   - 18s timeout & secret redaction
// ============================================================================

import { GoogleGenAI, Type } from '@google/genai';
import {
  CareBridgeConfluencePage,
  CareBridgeTask,
} from '../types/carebridgeTypes';
import { scanAndRedactCareBridgePhi } from '../utils/carebridgePhiGuard';

export const CAREBRIDGE_GEMINI_MODEL = 'gemini-4-hydrogen';

export class CareBridgeAiConsentError extends Error {
  public readonly statusCode = 403;
  public readonly code = 'CONSENT_REQUIRED';
  constructor(message: string) {
    super(message);
    this.name = 'CareBridgeAiConsentError';
  }
}

export class CareBridgeAiUnavailableError extends Error {
  public readonly statusCode = 503;
  public readonly code: 'GEMINI_KEY_MISSING' | 'GEMINI_UPSTREAM_ERROR';
  constructor(code: 'GEMINI_KEY_MISSING' | 'GEMINI_UPSTREAM_ERROR', message: string) {
    super(message);
    this.name = 'CareBridgeAiUnavailableError';
    this.code = code;
  }
}

export interface CareBridgeAiAssistRequest {
  actionType:
    | 'summarize-care-context'
    | 'retrieve-care-knowledge'
    | 'summarize-followup-tasks'
    | 'prepare-care-handoff'
    | 'knowledge_page_summary'
    | 'reentry_brief_suggestion'
    | 'followup_status_summary';
  prompt: string;
  geminiConsentGranted: boolean;
  rovoConsentGranted?: boolean;
  navigationContext: string;
  tasks: CareBridgeTask[];
  knowledgePages: CareBridgeConfluencePage[];
}

export interface CareBridgeAiAssistResult {
  unverifiedBanner: 'AI-Generated Output — Unverified until reviewed by an authorized human';
  nonClinicalNotice: string;
  verifiedSourceFacts: string[];
  userRecordedFacts: string[];
  aiSummaryOrSuggestion: string;
  missingInformation: string[];
  sourceLinks: Array<{ label: string; url?: string }>;
  generatedBy: 'gemini';
  model: string;
}

export function scrubIdentifiableDetailsForExternalAi(raw: string): string {
  return scanAndRedactCareBridgePhi(raw || '').redactedText.slice(0, 600);
}

const ASSIST_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    verifiedSourceFacts: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Only facts directly quoting linked Confluence excerpts or confirmed JSM request metadata.',
    },
    userRecordedFacts: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Only administrative task details recorded by the user in CareBridge.',
    },
    aiSummaryOrSuggestion: {
      type: Type.STRING,
      description: 'Administrative summary or next follow-up suggestion clearly written as non-diagnostic and subject to human review.',
    },
    missingInformation: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Missing or unavailable context gaps.',
    },
  },
  required: ['verifiedSourceFacts', 'userRecordedFacts', 'aiSummaryOrSuggestion', 'missingInformation'],
};

export async function runCareBridgeAiAssist(
  input: CareBridgeAiAssistRequest,
  geminiClient: GoogleGenAI | null,
  options?: { timeoutMs?: number }
): Promise<CareBridgeAiAssistResult> {
  if (!input.geminiConsentGranted) {
    throw new CareBridgeAiConsentError(
      'Explicit Gemini Synthesis Consent is disabled. Enable consent in CareBridge Privacy and Consent before generating AI summaries.'
    );
  }
  if (
    (input.actionType === 'summarize-care-context' ||
      input.actionType === 'retrieve-care-knowledge' ||
      input.actionType === 'summarize-followup-tasks' ||
      input.actionType === 'prepare-care-handoff') &&
    input.rovoConsentGranted === false
  ) {
    throw new CareBridgeAiConsentError(
      'Rovo Healthcare Assistant Consent is disabled in CareBridge Privacy and Consent.'
    );
  }

  if (!geminiClient) {
    throw new CareBridgeAiUnavailableError(
      'GEMINI_KEY_MISSING',
      'GEMINI_API_KEY is not configured on the server. AI summary generation is unavailable; verified records remain accessible offline.'
    );
  }

  const timeoutMs = Math.max(250, Math.min(options?.timeoutMs ?? 18_000, 60_000));

  const minimizedTasks = input.tasks.slice(0, 25).map((t) => ({
    id: t.id,
    contextRef: scrubIdentifiableDetailsForExternalAi(t.contextRef),
    description: scrubIdentifiableDetailsForExternalAi(t.description),
    priority: t.priority,
    dueDate: t.dueDate || 'unscheduled',
    assignee: scrubIdentifiableDetailsForExternalAi(t.responsibleAssignee),
    status: t.status,
    sourceKind: t.source.kind,
    jsmRequestKey: t.source.jsmRequestKey,
  }));

  const minimizedPages = input.knowledgePages.slice(0, 10).map((p) => ({
    id: p.id,
    title: p.title,
    spaceKey: p.spaceKey,
    excerpt: scrubIdentifiableDetailsForExternalAi(p.excerpt),
    url: p.url,
    dataOrigin: p.dataOrigin,
  }));

  const systemInstruction = `You are CareBridge Healthcare Navigator Assistant inside Dr. T — CareBridge.
MANDATORY SAFETY & PROVENANCE RULES:
1. You assist ONLY with non-emergency care navigation, administrative follow-up scheduling, and authorized Confluence documentation retrieval.
2. NEVER provide clinical diagnosis, triage decisions, medication dosing, or treatment recommendations.
3. Strictly separate verified Confluence/JSM source facts from user-recorded tasks and AI suggestions.
4. NEVER fabricate clinical guidelines, citations, request keys, or deadlines. If context is absent, list the gap in "missingInformation".
5. All AI output is unverified administrative guidance until reviewed by an authorized human.`;

  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const generatePromise = geminiClient.models.generateContent({
      model: CAREBRIDGE_GEMINI_MODEL,
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: JSON.stringify({
                actionType: input.actionType,
                navigationContext: scrubIdentifiableDetailsForExternalAi(input.navigationContext),
                prompt: scrubIdentifiableDetailsForExternalAi(input.prompt),
                tasks: minimizedTasks,
                confluencePages: minimizedPages,
              }),
            },
          ],
        },
      ],
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: ASSIST_SCHEMA,
      },
    });

    const timeoutPromise = new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        reject(new CareBridgeAiUnavailableError('GEMINI_UPSTREAM_ERROR', 'CareBridge Gemini request timed out cleanly.'));
      }, timeoutMs);
    });

    const response = await Promise.race([generatePromise, timeoutPromise]);
    const parsed = JSON.parse(response.text || '{}') as Partial<CareBridgeAiAssistResult>;

    return {
      unverifiedBanner: 'AI-Generated Output — Unverified until reviewed by an authorized human',
      nonClinicalNotice: 'Administrative care-navigation support only. Not a licensed clinician or diagnostic engine.',
      verifiedSourceFacts: Array.isArray(parsed.verifiedSourceFacts) ? parsed.verifiedSourceFacts : [],
      userRecordedFacts: Array.isArray(parsed.userRecordedFacts) ? parsed.userRecordedFacts : [],
      aiSummaryOrSuggestion:
        typeof parsed.aiSummaryOrSuggestion === 'string' && parsed.aiSummaryOrSuggestion.trim()
          ? parsed.aiSummaryOrSuggestion.trim()
          : 'Review open non-emergency follow-up tasks and authorized Confluence guidance with your care coordinator.',
      missingInformation: Array.isArray(parsed.missingInformation) ? parsed.missingInformation : [],
      sourceLinks: minimizedPages.map((p) => ({ label: p.title, url: p.url })),
      generatedBy: 'gemini',
      model: CAREBRIDGE_GEMINI_MODEL,
    };
  } catch (err: any) {
    if (err instanceof CareBridgeAiUnavailableError) throw err;
    const sanitized = String(err?.message || 'Gemini service error.')
      .replace(/AIza[0-9A-Za-z_-]+/g, '[REDACTED]')
      .slice(0, 220);
    throw new CareBridgeAiUnavailableError('GEMINI_UPSTREAM_ERROR', sanitized);
  } finally {
    if (timer) clearTimeout(timer);
  }
}
