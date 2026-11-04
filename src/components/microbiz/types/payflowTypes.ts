/**
 * MicroBiz PayFlow AI — Domain Types & Data Contracts
 * Competition: PayPal AI Hackathon 2026
 * Platform: Dr. T by Zenieverse
 */

export type PayFlowSubTab = 
  | 'overview'
  | 'invoices'
  | 'payments'
  | 'transactions'
  | 'expenses'
  | 'ai-assistant'
  | 'reports'
  | 'settings';

export type InvoiceStatus = 
  | 'DRAFT' 
  | 'PENDING' 
  | 'PARTIALLY_PAID' 
  | 'PAID' 
  | 'OVERDUE' 
  | 'CANCELLED' 
  | 'REFUNDED';

export type PaymentMethodType = 
  | 'paypal' 
  | 'offline_cash' 
  | 'bank_transfer' 
  | 'credit_card_paypal' 
  | 'other';

export interface PayFlowInvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface PayFlowPartyDetails {
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  address?: string;
  city?: string;
  country?: string;
  taxId?: string;
  logoUrl?: string;
}

export interface PayFlowAuditEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  note: string;
  metadata?: Record<string, any>;
}

export interface PayFlowInvoice {
  id: string;
  userId: string;
  invoiceNumber: string;
  business: PayFlowPartyDetails;
  customer: PayFlowPartyDetails;
  issueDate: string; // YYYY-MM-DD
  dueDate: string;   // YYYY-MM-DD
  items: PayFlowInvoiceLineItem[];
  currency: string;  // USD, EUR, GBP, CAD, AUD, VND, SGD
  subtotal: number;
  discountRate: number; // Percent 0-100
  discountAmount: number;
  taxRate: number;      // Percent 0-100
  taxAmount: number;
  total: number;
  amountPaid: number;
  balanceDue: number;
  notes?: string;
  terms?: string;
  status: InvoiceStatus;
  paypalOrderId?: string;
  paypalCaptureId?: string;
  paypalPaymentUrl?: string;
  gatherGlowEventId?: string; // Connected event reference from Gather & Glow
  gatherGlowVendorId?: string;
  isDemo?: boolean;
  history: PayFlowAuditEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface PayFlowTransaction {
  id: string;
  userId: string;
  invoiceId?: string;
  invoiceNumber?: string;
  provider: 'paypal' | 'offline_cash' | 'bank_transfer';
  providerTransactionId: string; // PayPal Capture ID or manual ref
  paypalOrderId?: string;
  customerName: string;
  customerEmail: string;
  grossAmount: number;
  feeAmount: number;
  netAmount: number;
  currency: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED';
  paymentDate: string; // ISO string
  payerDetails?: {
    payerId?: string;
    email?: string;
    name?: string;
    countryCode?: string;
  };
  gatherGlowEventId?: string;
  notes?: string;
  isDemo?: boolean;
  createdAt: string;
}

export interface PayFlowExpense {
  id: string;
  userId: string;
  merchant: string;
  category: string;
  date: string; // YYYY-MM-DD
  amount: number;
  taxAmount: number;
  currency: string;
  paymentMethod: string;
  notes?: string;
  receiptUrl?: string;
  isOcrExtracted?: boolean;
  ocrConfidence?: number;
  verifiedByUser: boolean;
  gatherGlowEventId?: string;
  isDemo?: boolean;
  createdAt: string;
}

export interface PayFlowBusinessProfile {
  userId: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  logoUrl?: string;
  defaultCurrency: string;
  defaultTaxRate: number;
  defaultPaymentTerms: string;
  invoicePrefix: string;
  nextInvoiceSequence: number;
  paypalEmail?: string;
  paypalSandboxVerified: boolean;
  gatherGlowConnected: boolean;
  updatedAt: string;
}

export interface PayFlowAiInsight {
  id: string;
  type: 
    | 'cash_flow_warning' 
    | 'revenue_milestone' 
    | 'overdue_alert' 
    | 'expense_spike' 
    | 'tax_estimate' 
    | 'action_recommendation';
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'success' | 'alert';
  metricValue?: string;
  suggestedAction?: string;
  isCalculatedFromRealRecords: boolean;
  calculatedAt: string;
}

export type DateFilterRange = 
  | 'this_week' 
  | 'this_month' 
  | 'last_month' 
  | 'this_quarter' 
  | 'custom';

export interface PayFlowDashboardMetrics {
  totalInvoiced: number;
  totalCollected: number;
  outstandingBalance: number;
  overdueBalance: number;
  overdueInvoiceCount: number;
  paidInvoiceCount: number;
  pendingInvoiceCount: number;
  totalExpenses: number;
  netCashFlow: number;
  currency: string;
  filteredCount: number;
}
