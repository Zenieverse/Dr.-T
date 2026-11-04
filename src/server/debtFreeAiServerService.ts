/**
 * PayFlow DebtFree — Server-Side Gemini Debt Relief & Dignity Assistant
 * Competition: PayPal AI Hackathon 2026
 * Model: gemini-3.8-flash via @google/genai SDK
 * 
 * Capabilities:
 * 1. Application Guidance & Document Verification Checklist
 * 2. Dignity-Preserving Public Narrative Drafting
 * 3. Creditor Communication Draft (Hardship / Settlement Payout Notice)
 * 4. Duplicate & Risk Review Indicator
 * 5. Transparent Impact Summaries
 */

import { GoogleGenAI } from '@google/genai';
import { sanitizeAndParseJson } from './microbizAiService';
import { PayFlowDebtRequest, CreditorPaymentInstructions } from '../components/microbiz/types/debtFreeTypes';
import { formatMoney } from '../services/payflowMath';

export interface DebtFreeAiRequest {
  type: 
    | 'application_guidance' 
    | 'narrative_refinement' 
    | 'creditor_letter_draft' 
    | 'risk_assessment' 
    | 'impact_summary';
  category?: string;
  creditorName?: string;
  amount?: number;
  currency?: string;
  userDraft?: string;
  debtRequest?: PayFlowDebtRequest;
  language?: string;
}

export interface DebtFreeAiResponse {
  answer: string;
  checklist?: string[];
  suggestedNarrative?: string;
  creditorLetter?: {
    subject: string;
    recipient: string;
    body: string;
  };
  riskAssessment?: {
    score: number; // 0-100
    riskLevel: 'LOW' | 'MODERATE' | 'ELEVATED';
    indicators: string[];
    recommendHumanReview: boolean;
  };
  facts: string[];
  recommendations: string[];
  disclaimer: string;
  modelUsed: string;
  executionTimeMs: number;
}

const MANDATORY_DEBT_RELIEF_DISCLAIMER = 
  'Important Notice: PayFlow DebtFree AI provides informational assistance, application guidance, and draft communication. ' +
  'It does NOT provide legal advice, credit counseling, bankruptcy consulting, or guarantees of creditor debt forgiveness. ' +
  'All creditor settlements require verifiable official proof of payment directly to the identified institution.';

export class DebtFreeAiServerService {
  /**
   * Main entrypoint for DebtFree AI queries
   */
  static async processRequest(req: DebtFreeAiRequest): Promise<DebtFreeAiResponse> {
    const startTime = Date.now();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return this.generateFallbackResponse(req, startTime, 'Local Fallback Engine (No API Key)');
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = this.buildPrompt(req);

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          temperature: 0.2, // Low temperature for high factual precision
          maxOutputTokens: 1500
        }
      });

      const responseText = response.text || '';
      const parsed = sanitizeAndParseJson<any>(responseText);

      if (parsed && parsed.answer) {
        return {
          answer: parsed.answer,
          checklist: Array.isArray(parsed.checklist) ? parsed.checklist : undefined,
          suggestedNarrative: parsed.suggestedNarrative || undefined,
          creditorLetter: parsed.creditorLetter || undefined,
          riskAssessment: parsed.riskAssessment || undefined,
          facts: Array.isArray(parsed.facts) ? parsed.facts : ['All creditor payments must be verified with formal receipts.'],
          recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : ['Ensure account reference is verified.'],
          disclaimer: MANDATORY_DEBT_RELIEF_DISCLAIMER,
          modelUsed: 'gemini-3.8-flash',
          executionTimeMs: Date.now() - startTime
        };
      }

      // If text response without JSON
      return {
        answer: responseText,
        facts: ['Guidance generated based on user provided creditor data.'],
        recommendations: ['Review supporting documents with official billing statements.'],
        disclaimer: MANDATORY_DEBT_RELIEF_DISCLAIMER,
        modelUsed: 'gemini-3.8-flash',
        executionTimeMs: Date.now() - startTime
      };
    } catch (err: any) {
      console.warn('DebtFree Gemini AI error, falling back:', err.message);
      return this.generateFallbackResponse(req, startTime, 'Local Rule-Based Engine (AI Timeout/Fallback)');
    }
  }

  private static buildPrompt(req: DebtFreeAiRequest): string {
    return `You are PayFlow DebtFree AI, a respectful, ethical, and mathematically precise financial relief assistant for the PayPal AI Hackathon 2026.
Platform: Dr. T by Zenieverse.
Task Type: ${req.type}
Category: ${req.category || 'General Hardship'}
Creditor: ${req.creditorName || 'Official Creditor'}
Amount: ${req.amount ? `${req.amount} ${req.currency || 'USD'}` : 'Unspecified'}
User Draft / Context: ${req.userDraft || (req.debtRequest ? JSON.stringify(req.debtRequest) : 'No user draft')}

RULES:
1. Maintain utmost respect, dignity, and empathy for the beneficiary. Never use judgmental, condescending, or stigmatizing language.
2. Ground all mathematical figures in verified reality. NEVER invent balances, creditor account numbers, or fictional payment confirmations.
3. If drafting a creditor letter, address the billing department respectfully, quote the exact reference number, and request forbearance, payment plan consideration, or application of community-contributed funds.
4. If assessing risk, evaluate missing documentation, realistic amounts, and account number plausibility without making binding legal decisions.
5. You MUST return your response as a valid, parseable JSON object matching this schema:
{
  "answer": "string",
  "checklist": ["string"],
  "suggestedNarrative": "string (optional)",
  "creditorLetter": {
    "subject": "string",
    "recipient": "string",
    "body": "string"
  },
  "riskAssessment": {
    "score": number, // 0 to 100
    "riskLevel": "LOW" | "MODERATE" | "ELEVATED",
    "indicators": ["string"],
    "recommendHumanReview": boolean
  },
  "facts": ["verified fact 1", "verified fact 2"],
  "recommendations": ["actionable advice 1", "actionable advice 2"]
}
`;
  }

  private static generateFallbackResponse(
    req: DebtFreeAiRequest, 
    startTime: number, 
    modelUsed: string
  ): DebtFreeAiResponse {
    const currency = req.currency || 'USD';
    const amountStr = req.amount ? formatMoney(req.amount, currency) : 'your stated balance';
    const creditor = req.creditorName || 'your creditor';

    if (req.type === 'creditor_letter_draft') {
      const subject = `Request for Hardship Account Review & Community Assistance Payment — Ref: ${req.debtRequest?.creditor.accountReferenceNumber || 'Account Inactive'}`;
      const body = `Dear Billing & Financial Hardship Department at ${creditor},

I am writing to formally request a hardship review regarding my outstanding balance of ${amountStr}. 

Due to unforeseen circumstances, I am currently collaborating with community supporters through the verified PayFlow DebtFree platform to arrange direct payments toward this account. 

Could you please confirm the direct payment instructions, official billing portal link, and whether late fee penalties or interest accumulation can be temporarily frozen while these community contributions are being processed?

Thank you for your understanding and partnership.

Sincerely,
${req.debtRequest?.publicAlias || 'Account Holder'}`;

      return {
        answer: `I have prepared a respectful hardship inquiry draft for ${creditor}. This letter requests direct payment confirmation and asks the creditor to freeze late fees while community contributions are mobilized.`,
        creditorLetter: {
          subject,
          recipient: `${creditor} Patient / Customer Billing Department`,
          body
        },
        facts: [
          `Creditor identified as ${creditor}.`,
          `Target balance stated as ${amountStr}.`,
          'Direct-to-creditor settlement avoids intermediary custody.'
        ],
        recommendations: [
          'Verify the creditor customer service telephone number before sending.',
          'Always keep a copy of timestamped billing correspondence.'
        ],
        disclaimer: MANDATORY_DEBT_RELIEF_DISCLAIMER,
        modelUsed,
        executionTimeMs: Date.now() - startTime
      };
    }

    if (req.type === 'application_guidance') {
      return {
        answer: `To verify your debt relief request for ${creditor} (${amountStr}), our Trust & Safety committee requires objective documentation to protect both your privacy and supporter transparency.`,
        checklist: [
          'Most recent billing statement showing creditor name and customer account number',
          'Document date within the last 60-90 days confirming active balance',
          'Creditor official payment portal URL, billing address, or remittance voucher',
          'Signed verification consent authorizing our reviewers to confirm balance status'
        ],
        suggestedNarrative: `Facing an unexpected hardship with ${amountStr} in ${req.category || 'emergency'} expenses owed to ${creditor}. Seeking community support to settle this debt directly with the creditor so our household can regain financial stability.`,
        facts: [
          'Supporting documents are restricted to authorized reviewers and never published publicly.',
          'Supporters will only see your verified badge and dignity-safe alias.'
        ],
        recommendations: [
          'Redact unnecessary personal ID numbers (like full Social Security or national ID numbers) prior to uploading.',
          'Ensure the outstanding balance matches the exact amount on the billing voucher.'
        ],
        disclaimer: MANDATORY_DEBT_RELIEF_DISCLAIMER,
        modelUsed,
        executionTimeMs: Date.now() - startTime
      };
    }

    // Default impact / narrative summary
    return {
      answer: `PayFlow DebtFree connects people in financial distress with verified community supporters. By channeling contributions directly to verified creditors like ${creditor}, we eliminate predatory fees and ensure 100% of donor funds provide real debt freedom.`,
      facts: [
        'Zero platform fees charged to beneficiaries or donors.',
        'Direct settlement prevents misuse of funds.'
      ],
      recommendations: [
        'Complete all verification steps promptly to achieve PUBLISHED status.',
        'Share your verified request link with community mutual-aid networks.'
      ],
      disclaimer: MANDATORY_DEBT_RELIEF_DISCLAIMER,
      modelUsed,
      executionTimeMs: Date.now() - startTime
    };
  }
}
