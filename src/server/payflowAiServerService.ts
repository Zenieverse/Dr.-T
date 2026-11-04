/**
 * MicroBiz PayFlow AI — Server-Side Gemini Financial Assistant
 * Competition: PayPal AI Hackathon 2026
 * Model: gemini-3.8-flash via @google/genai SDK
 * 
 * Functions:
 * 1. Financial Invoicing Copilot (Draft line-items from natural language)
 * 2. Natural-Language Expense Categorization
 * 3. Cash-Flow & Overdue Accounts Analysis
 * 4. Professional Payment Reminder Letter Generator
 * 5. Facts vs. Recommendations Verification
 */

import { GoogleGenAI } from '@google/genai';
import { sanitizeAndParseJson } from './microbizAiService';
import { calculateInvoiceTotals, roundMoney } from '../services/payflowMath';
import { PayFlowInvoice, PayFlowTransaction, PayFlowExpense, PayFlowBusinessProfile } from '../components/microbiz/types/payflowTypes';

export interface PayFlowFinancialContext {
  invoices: PayFlowInvoice[];
  transactions: PayFlowTransaction[];
  expenses: PayFlowExpense[];
  businessProfile?: PayFlowBusinessProfile;
  dateRange?: string;
}

export interface PayFlowAiResponse {
  answer: string;
  structuredData?: {
    type: 'invoice_draft' | 'financial_summary' | 'reminder_draft' | 'expense_categorization' | 'general_advice';
    invoiceDraft?: {
      customerName: string;
      customerEmail?: string;
      items: Array<{ description: string; quantity: number; unitPrice: number }>;
      currency: string;
      notes?: string;
    };
    financialMetrics?: {
      totalRevenue: number;
      totalExpenses: number;
      netCashFlow: number;
      overdueCount: number;
      overdueAmount: number;
      currency: string;
    };
    suggestedReminder?: {
      subject: string;
      body: string;
      recipientEmail: string;
    };
  };
  facts: string[];
  recommendations: string[];
  disclaimer: string;
  modelUsed: string;
  executionTimeMs: number;
}

const MANDATORY_FINANCIAL_DISCLAIMER = 
  'Notice: PayFlow AI provides operational insights and draft calculations based on your recorded ledger. ' +
  'AI suggestions are strictly for informational and planning purposes and do not constitute certified public accountant (CPA), legal, or tax filing advice.';

export class PayFlowAiServerService {
  /**
   * Main AI query router for PayFlow
   */
  public static async answerFinancialQuery(
    queryText: string,
    context: PayFlowFinancialContext,
    client: GoogleGenAI | null
  ): Promise<PayFlowAiResponse> {
    const startTime = Date.now();

    // Compute ground-truth ledger facts locally to guarantee zero hallucination on math
    const totalInvoiced = roundMoney(
      context.invoices.reduce((sum, inv) => sum + (inv.total || 0), 0)
    );
    const totalPaid = roundMoney(
      context.transactions
        .filter(t => t.status === 'COMPLETED')
        .reduce((sum, t) => sum + (t.grossAmount || 0), 0)
    );
    const totalExpenses = roundMoney(
      context.expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0)
    );
    const netCashFlow = roundMoney(totalPaid - totalExpenses);

    const nowIso = new Date().toISOString().split('T')[0];
    const overdueInvoices = context.invoices.filter(inv => {
      return (inv.status === 'OVERDUE' || (inv.status === 'PENDING' && inv.dueDate < nowIso));
    });
    const overdueTotal = roundMoney(
      overdueInvoices.reduce((sum, inv) => sum + (inv.balanceDue || inv.total || 0), 0)
    );

    const baseCurrency = context.businessProfile?.defaultCurrency || 
      context.invoices[0]?.currency || 
      'USD';

    // Verified mathematical facts derived directly from authorized records
    const verifiedFacts = [
      `Recorded Invoices: ${context.invoices.length} (${totalInvoiced} ${baseCurrency} invoiced)`,
      `Collected Payments: ${context.transactions.length} (${totalPaid} ${baseCurrency} gross collected)`,
      `Recorded Business Expenses: ${context.expenses.length} (${totalExpenses} ${baseCurrency})`,
      `Net Cash Flow: ${netCashFlow} ${baseCurrency}`,
      `Overdue Invoices: ${overdueInvoices.length} (${overdueTotal} ${baseCurrency} outstanding)`
    ];

    // If Gemini client is unavailable, execute deterministic heuristic response
    if (!client) {
      return this.generateDeterministicFallback(
        queryText,
        context,
        verifiedFacts,
        {
          totalRevenue: totalPaid,
          totalExpenses,
          netCashFlow,
          overdueCount: overdueInvoices.length,
          overdueAmount: overdueTotal,
          currency: baseCurrency
        },
        startTime
      );
    }

    try {
      const prompt = `
You are the MicroBiz PayFlow AI Financial Assistant for Dr. T's business operations ecosystem.
The user is asking a question or requesting financial assistance regarding their invoices, payments, expenses, or cash flow.

AUTHORIZED USER RECORD CONTEXT (Authoritative Ground Truth):
- Business Name: ${context.businessProfile?.businessName || 'My MicroBiz'}
- Default Currency: ${baseCurrency}
- Total Invoices Count: ${context.invoices.length}
- Total Invoiced Amount: ${totalInvoiced} ${baseCurrency}
- Total Paid Transactions: ${totalPaid} ${baseCurrency}
- Total Expenses: ${totalExpenses} ${baseCurrency}
- Net Cash Flow: ${netCashFlow} ${baseCurrency}
- Overdue Invoices: ${overdueInvoices.length} totalling ${overdueTotal} ${baseCurrency}

INVOICE SUMMARY (Latest 10):
${JSON.stringify(context.invoices.slice(0, 10).map(i => ({
  id: i.id,
  number: i.invoiceNumber,
  customer: i.customer.name,
  customerEmail: i.customer.email,
  total: i.total,
  balanceDue: i.balanceDue,
  status: i.status,
  dueDate: i.dueDate
})), null, 2)}

RECENT EXPENSES (Latest 10):
${JSON.stringify(context.expenses.slice(0, 10).map(e => ({
  merchant: e.merchant,
  category: e.category,
  amount: e.amount,
  date: e.date
})), null, 2)}

USER QUESTION / TASK:
"${queryText}"

CRITICAL INSTRUCTIONS:
1. Always base financial numbers strictly on the authoritative context provided above. Never invent numbers, payments, or customers.
2. Clearly distinguish between FACTUAL RECORDS and STRATEGIC RECOMMENDATIONS.
3. If the user asks to create/draft an invoice (e.g. "Invoice John for 10 hours consulting at $100"), output a structured "invoice_draft" object.
4. If the user asks to draft an overdue reminder email, output a structured "suggestedReminder" with a professional, polite subject and body.
5. If the user asks for a financial summary or cash flow comparison, provide clear, bulleted breakdown.

Respond in strict JSON format matching this schema:
{
  "answer": "Clear, friendly, professional response in plain text with bold highlights",
  "structuredData": {
    "type": "invoice_draft" | "financial_summary" | "reminder_draft" | "expense_categorization" | "general_advice",
    "invoiceDraft": {
      "customerName": "Customer Name",
      "customerEmail": "customer@email.com",
      "items": [{ "description": "Item description", "quantity": 1, "unitPrice": 100 }],
      "currency": "${baseCurrency}",
      "notes": "Thank you for your business!"
    },
    "suggestedReminder": {
      "subject": "Gentle Reminder: Invoice #... is past due",
      "body": "Dear ..., hope this finds you well...",
      "recipientEmail": "customer@email.com"
    }
  },
  "facts": ["Fact 1 based on actual records", "Fact 2 based on actual records"],
  "recommendations": ["Recommendation 1", "Recommendation 2"]
}
`;

      const response = await client.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      });

      const responseText = response.text || '';
      const parsed = sanitizeAndParseJson<any>(responseText);

      if (parsed && parsed.answer) {
        return {
          answer: parsed.answer,
          structuredData: parsed.structuredData,
          facts: Array.isArray(parsed.facts) && parsed.facts.length > 0 ? parsed.facts : verifiedFacts,
          recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
          disclaimer: MANDATORY_FINANCIAL_DISCLAIMER,
          modelUsed: 'gemini-3.8-flash',
          executionTimeMs: Date.now() - startTime
        };
      }
    } catch (err: any) {
      console.warn('[PayFlowAiServerService] Gemini inference failed, utilizing deterministic engine:', err?.message);
    }

    return this.generateDeterministicFallback(
      queryText,
      context,
      verifiedFacts,
      {
        totalRevenue: totalPaid,
        totalExpenses,
        netCashFlow,
        overdueCount: overdueInvoices.length,
        overdueAmount: overdueTotal,
        currency: baseCurrency
      },
      startTime
    );
  }

  /**
   * Deterministic financial reasoning fallback when external AI is unavailable or offline
   */
  private static generateDeterministicFallback(
    queryText: string,
    context: PayFlowFinancialContext,
    verifiedFacts: string[],
    metrics: {
      totalRevenue: number;
      totalExpenses: number;
      netCashFlow: number;
      overdueCount: number;
      overdueAmount: number;
      currency: string;
    },
    startTime: number
  ): PayFlowAiResponse {
    const q = queryText.toLowerCase();

    // 1. Overdue invoices query
    if (q.includes('overdue') || q.includes('unpaid') || q.includes('late')) {
      const nowIso = new Date().toISOString().split('T')[0];
      const overdueList = context.invoices.filter(i => i.status === 'OVERDUE' || (i.status === 'PENDING' && i.dueDate < nowIso));
      
      const answer = overdueList.length > 0
        ? `You currently have **${overdueList.length} overdue invoice(s)** totaling **${metrics.overdueAmount} ${metrics.currency}**:\n` +
          overdueList.map(i => `• Invoice **#${i.invoiceNumber}** for **${i.customer.name}** (${i.balanceDue} ${i.currency}) was due on ${i.dueDate}`).join('\n') +
          `\n\nWould you like me to generate a polite payment reminder email for any of these clients?`
        : `Great news! You have **0 overdue invoices** across your registered records. All current invoices are either paid or within their due dates.`;

      const firstOverdue = overdueList[0];
      const suggestedReminder = firstOverdue ? {
        subject: `Friendly Follow-up: Invoice #${firstOverdue.invoiceNumber} with ${context.businessProfile?.businessName || 'our team'}`,
        body: `Hi ${firstOverdue.customer.name},\n\nI hope you are having a wonderful week! This is a quick note regarding Invoice #${firstOverdue.invoiceNumber} for ${firstOverdue.balanceDue} ${firstOverdue.currency}, which was due on ${firstOverdue.dueDate}.\n\nYou can easily review and settle this invoice via PayPal or direct transfer here:\n${firstOverdue.paypalPaymentUrl || 'Please check your attached invoice.'}\n\nPlease let me know if you have any questions.\n\nWarm regards,\n${context.businessProfile?.ownerName || 'The Team'}`,
        recipientEmail: firstOverdue.customer.email
      } : undefined;

      return {
        answer,
        structuredData: {
          type: 'reminder_draft',
          financialMetrics: metrics,
          suggestedReminder
        },
        facts: verifiedFacts,
        recommendations: [
          'Send polite reminder 3 days before due date to reduce late settlements by up to 40%',
          'Enable PayPal one-click checkout to allow customers to pay immediately from mobile'
        ],
        disclaimer: MANDATORY_FINANCIAL_DISCLAIMER,
        modelUsed: 'microbiz-deterministic-finance',
        executionTimeMs: Date.now() - startTime
      };
    }

    // 2. Revenue & Cash Flow query
    if (q.includes('revenue') || q.includes('received') || q.includes('cash flow') || q.includes('money') || q.includes('earned')) {
      const answer = 
        `### Cash Flow & Revenue Summary\n` +
        `• **Gross Collected Revenue**: **${metrics.totalRevenue} ${metrics.currency}** (from ${context.transactions.filter(t => t.status === 'COMPLETED').length} completed transactions)\n` +
        `• **Total Recorded Expenses**: **${metrics.totalExpenses} ${metrics.currency}** (across ${context.expenses.length} line items)\n` +
        `• **Net Operating Cash Flow**: **${metrics.netCashFlow >= 0 ? '+' : ''}${metrics.netCashFlow} ${metrics.currency}**\n` +
        `• **Outstanding Receivables**: **${metrics.overdueAmount} ${metrics.currency}** in overdue payments`;

      return {
        answer,
        structuredData: {
          type: 'financial_summary',
          financialMetrics: metrics
        },
        facts: verifiedFacts,
        recommendations: [
          metrics.netCashFlow >= 0 
            ? 'Positive cash flow detected. Consider allocating 15-20% to an emergency reserve or business growth fund.'
            : 'Net cash flow is currently negative. Review recurring expenses and follow up on pending invoices to stabilize operating capital.',
          'Reconcile PayPal merchant fees against gross receipts for accurate net revenue bookkeeping.'
        ],
        disclaimer: MANDATORY_FINANCIAL_DISCLAIMER,
        modelUsed: 'microbiz-deterministic-finance',
        executionTimeMs: Date.now() - startTime
      };
    }

    // 3. Invoice drafting query
    if (q.includes('invoice') || q.includes('bill') || q.includes('charge')) {
      const sampleItem = {
        description: 'Professional Services / Deliverables',
        quantity: 1,
        unitPrice: 150
      };

      return {
        answer: `I have prepared an invoice draft framework for you. You can review the line items, adjust pricing, and attach PayPal payment processing with one click.`,
        structuredData: {
          type: 'invoice_draft',
          invoiceDraft: {
            customerName: 'Client Partner',
            customerEmail: 'client@example.com',
            items: [sampleItem],
            currency: metrics.currency,
            notes: 'Thank you for choosing to partner with us! Payment is due within 14 days.'
          }
        },
        facts: verifiedFacts,
        recommendations: [
          'Specify clear payment terms (e.g., Net 14 or Due on Receipt) to prevent delayed settlements.',
          'Itemize project phases or deliverables clearly to reduce client review friction.'
        ],
        disclaimer: MANDATORY_FINANCIAL_DISCLAIMER,
        modelUsed: 'microbiz-deterministic-finance',
        executionTimeMs: Date.now() - startTime
      };
    }

    // Default business overview
    return {
      answer: 
        `### PayFlow AI Business Overview\n` +
        `Here is the verified financial snapshot for **${context.businessProfile?.businessName || 'your business'}**:\n\n` +
        `• **Invoiced Total**: ${metrics.totalRevenue + metrics.overdueAmount} ${metrics.currency}\n` +
        `• **Collected Payments**: ${metrics.totalRevenue} ${metrics.currency}\n` +
        `• **Recorded Expenses**: ${metrics.totalExpenses} ${metrics.currency}\n` +
        `• **Net Cash Flow**: ${metrics.netCashFlow} ${metrics.currency}\n\n` +
        `You can ask me to draft invoices, explain overdue payments, analyze expense trends, or write polite payment reminders anytime!`,
      structuredData: {
        type: 'general_advice',
        financialMetrics: metrics
      },
      facts: verifiedFacts,
      recommendations: [
        'Regularly scan paper and digital receipts to capture all tax-deductible operational costs.',
        'Review client payment timelines monthly to identify repeat late-paying accounts.'
      ],
      disclaimer: MANDATORY_FINANCIAL_DISCLAIMER,
      modelUsed: 'microbiz-deterministic-finance',
      executionTimeMs: Date.now() - startTime
    };
  }
}
