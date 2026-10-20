import { GoogleGenAI } from '@google/genai';

/**
 * MicroBiz AI Service — Multi-Provider Inference Architecture
 * Supports Open-Weight Gemma (gemma-4-26b-a4b-it) & Gemini 2.5 Flash
 * Verified for DEV Hacktoberfest 2026 Challenge
 */

export type ModelProviderChoice = 'gemma' | 'gemini' | 'auto';

export interface AiMetadata {
  isGenuineAi: boolean;
  isHeuristicFallback: boolean;
  provider: string;
  modelFamily: 'gemma' | 'gemini' | 'heuristic';
  fallbackNotice?: string;
  executionTimeMs?: number;
}

export const MICROBIZ_MODELS = {
  GEMMA_PRIMARY: 'gemma-4-26b-a4b-it',
  GEMINI_FALLBACK: 'gemini-3.5-flash-lite',
  HEURISTIC_TEXT: 'microbiz-heuristic-engine',
  HEURISTIC_OCR: 'microbiz-heuristic-ocr',
} as const;

// Safe JSON parser and sanitizer for LLM text responses
export function sanitizeAndParseJson<T = any>(rawText: string): T | null {
  if (!rawText || typeof rawText !== 'string') return null;
  const clean = rawText
    .replace(/^[\s\S]*?```json\s*/i, '')
    .replace(/```[\s\S]*$/, '')
    .trim();

  // Try direct parse first
  try {
    return JSON.parse(clean);
  } catch {
    // If wrapping failed, try regex match for JSON object or array
    const jsonMatch = rawText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (err) {
        console.warn('[MicroBiz AI] Regex JSON parse error:', err);
      }
    }
  }
  return null;
}

// ==========================================
// SCHEMA VALIDATORS
// ==========================================

export function validateCourseSchema(data: any): boolean {
  if (!data || typeof data !== 'object') return false;
  if (typeof data.title !== 'string' || !data.title.trim()) return false;
  if (typeof data.description !== 'string' || !data.description.trim()) return false;
  if (!Array.isArray(data.learningObjectives) || data.learningObjectives.length === 0) return false;
  if (!Array.isArray(data.modules) || data.modules.length === 0) return false;
  return true;
}

export function validateCopySchema(data: any): boolean {
  if (!data || typeof data !== 'object') return false;
  if (typeof data.tagline !== 'string' || !data.tagline.trim()) return false;
  if (typeof data.storyDescription !== 'string' || !data.storyDescription.trim()) return false;
  if (!Array.isArray(data.keyFeatures) || data.keyFeatures.length === 0) return false;
  if (typeof data.socialPostSnippet !== 'string' || !data.socialPostSnippet.trim()) return false;
  return true;
}

export function validatePlanSchema(data: any): boolean {
  if (!data || typeof data !== 'object') return false;
  if (typeof data.valueProposition !== 'string' || !data.valueProposition.trim()) return false;
  if (!Array.isArray(data.customerSegments) || data.customerSegments.length === 0) return false;
  if (!Array.isArray(data.coreProductsServices) || data.coreProductsServices.length === 0) return false;
  if (!Array.isArray(data.channelsToReachCustomers) || data.channelsToReachCustomers.length === 0) return false;
  return true;
}

export function validateExtractionSchema(data: any): boolean {
  if (!data || typeof data !== 'object') return false;
  if (typeof data.vendorName !== 'string' || !data.vendorName.trim()) return false;
  if (typeof data.totalAmount !== 'number' && typeof data.totalAmount !== 'string') return false;
  return true;
}

// ==========================================
// MODEL CALL RUNNER WITH HIERARCHICAL FALLBACK
// ==========================================

interface GenerateOptions {
  prompt: string;
  systemInstruction?: string;
  requestedProvider?: ModelProviderChoice;
  client: GoogleGenAI | null;
  imagePart?: { mimeType: string; data: string };
  validator: (parsed: any) => boolean;
  heuristicFallback: () => any;
}

export async function runMicroBizInference({
  prompt,
  requestedProvider = 'gemma',
  client,
  imagePart,
  validator,
  heuristicFallback,
}: GenerateOptions): Promise<{
  data: any;
  meta: AiMetadata;
}> {
  const startTime = Date.now();

  // If no Gemini/Gemma client is initialized or API key is absent, use honest heuristic fallback
  if (!client) {
    return {
      data: heuristicFallback(),
      meta: {
        isGenuineAi: false,
        isHeuristicFallback: true,
        provider: MICROBIZ_MODELS.HEURISTIC_TEXT,
        modelFamily: 'heuristic',
        fallbackNotice: 'Generated via deterministic offline heuristic engine because no AI API key is configured.',
        executionTimeMs: Date.now() - startTime,
      },
    };
  }

  // Model sequence order based on user/system preference
  // Default: Open-Weight Gemma (gemma-4-26b-a4b-it) primary, Gemini 2.5 Flash as resilience fallback
  const modelsToTry: Array<{ modelId: string; family: 'gemma' | 'gemini' }> = [];

  if (requestedProvider === 'gemini') {
    modelsToTry.push({ modelId: MICROBIZ_MODELS.GEMINI_FALLBACK, family: 'gemini' });
    modelsToTry.push({ modelId: MICROBIZ_MODELS.GEMMA_PRIMARY, family: 'gemma' });
  } else {
    // Default ('gemma' or 'auto'): Prioritize Open-Weight Gemma
    modelsToTry.push({ modelId: MICROBIZ_MODELS.GEMMA_PRIMARY, family: 'gemma' });
    modelsToTry.push({ modelId: MICROBIZ_MODELS.GEMINI_FALLBACK, family: 'gemini' });
  }

  for (const { modelId, family } of modelsToTry) {
    const maxAttempts = family === 'gemma' ? 2 : 1;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const contentsPayload = imagePart
          ? [
              {
                role: 'user',
                parts: [
                  { inlineData: { mimeType: imagePart.mimeType, data: imagePart.data } },
                  { text: prompt },
                ],
              },
            ]
          : prompt;

        const response = await client.models.generateContent({
          model: modelId,
          contents: contentsPayload,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.3,
          },
        });

        const responseText = response.text || '';
        const parsed = sanitizeAndParseJson(responseText);

        if (parsed && validator(parsed)) {
          return {
            data: parsed,
            meta: {
              isGenuineAi: true,
              isHeuristicFallback: false,
              provider: modelId,
              modelFamily: family,
              executionTimeMs: Date.now() - startTime,
            },
          };
        } else {
          console.warn(`[MicroBiz AI] Model ${modelId} returned response that failed schema validation.`);
        }
      } catch (err: any) {
        console.warn(`[MicroBiz AI] Inference attempt ${attempt}/${maxAttempts} with ${modelId} failed:`, err?.message || err);
        const errorMsg = typeof err?.message === 'string' ? err.message : '';
        const isTransient = 
          err?.status === 500 || 
          err?.status === 503 || 
          err?.status === 429 || 
          err?.code === 500 || 
          err?.code === 503 || 
          err?.code === 429 || 
          errorMsg.includes('500') || 
          errorMsg.includes('503') || 
          errorMsg.includes('429') || 
          errorMsg.includes('fetch failed') ||
          errorMsg.includes('INTERNAL');

        if (attempt < maxAttempts && isTransient) {
          // Bounded 800ms backoff before retry on transient server error
          await new Promise(resolve => setTimeout(resolve, 800));
        } else {
          // Non-transient error or max attempts reached: do not retry needlessly
          break;
        }
      }
    }
  }

  // If all live models failed, return deterministic honest fallback
  return {
    data: heuristicFallback(),
    meta: {
      isGenuineAi: false,
      isHeuristicFallback: true,
      provider: MICROBIZ_MODELS.HEURISTIC_TEXT,
      modelFamily: 'heuristic',
      fallbackNotice: 'Generated via local offline heuristic rule-engine because live AI model is unconfigured or rate-limited.',
      executionTimeMs: Date.now() - startTime,
    },
  };
}
