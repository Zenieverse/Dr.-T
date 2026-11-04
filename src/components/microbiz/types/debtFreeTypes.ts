/**
 * PayFlow DebtFree — Domain Types & Data Contracts
 * Competition: PayPal AI Hackathon 2026
 * Platform: Dr. T by Zenieverse
 * 
 * Purpose: Dignity-first, verified community debt relief connecting beneficiaries, 
 * supporters, and verified creditors with transparent, non-custodial direct settlement.
 */

export type DebtCategory = 
  | 'medical'
  | 'education'
  | 'utilities'
  | 'essential_housing'
  | 'microbiz_obligation'
  | 'family_emergency'
  | 'other';

export type DebtVerificationStatus = 
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'PUBLISHED'
  | 'PARTIALLY_FUNDED'
  | 'PAYMENT_PROCESSING'
  | 'PARTIALLY_SETTLED'
  | 'SETTLED'
  | 'REJECTED'
  | 'SUSPENDED';

export type ContributionPaymentStatus = 
  | 'PLEDGED'
  | 'AUTHORIZED'
  | 'PROCESSING'
  | 'PAID_TO_CREDITOR'
  | 'REFUNDED'
  | 'SETTLED';

export interface CreditorPaymentInstructions {
  creditorName: string;
  creditorType: 'hospital' | 'utility_company' | 'school' | 'landlord' | 'bank_vendor' | 'other';
  accountReferenceNumber: string; // Account # or billing invoice #
  paymentPortalUrl?: string;       // Official creditor payment link
  directPayeeDetails?: {
    payeeName: string;
    routingNumber?: string;
    accountNumberMasked?: string;
    ibanMasked?: string;
    billingAddress?: string;
    officialPhone?: string;
  };
  specialInstructions?: string;
}

export interface DebtSupportingDocument {
  id: string;
  fileName: string;
  fileType: string;
  fileUrl?: string;
  uploadedAt: string;
  documentType: 'billing_statement' | 'official_invoice' | 'hardship_notice' | 'identity_verification';
  isVerified: boolean;
  verifiedAt?: string;
  verifierNotes?: string;
}

export interface PayFlowDebtRequest {
  id: string;
  beneficiaryUserId: string;
  publicAlias: string;            // e.g. "M. K. — Single Parent of 2" (protects dignity)
  beneficiaryLegalName?: string;  // Private: only visible to reviewers
  beneficiaryEmail?: string;      // Private
  beneficiaryLocation: string;    // City, Region, Country
  category: DebtCategory;
  title: string;
  hardshipNarrative: string;
  
  // Financial Amounts (Decimal-Safe)
  originalDebtAmount: number;     // Reported by user
  verifiedDebtAmount: number;     // Verified by reviewer
  currency: string;               // USD, EUR, GBP, VND, etc.
  
  // Real-Time Allocation Totals
  amountPledged: number;          // Total committed by supporters
  amountFunded: number;           // Successfully captured via payment gateway
  amountPaidToCreditor: number;   // Formally disbursed/settled with creditor
  remainingBalance: number;       // verifiedDebtAmount - amountPaidToCreditor
  
  // Creditor Information
  creditor: CreditorPaymentInstructions;
  
  // Verification & Compliance
  status: DebtVerificationStatus;
  documents: DebtSupportingDocument[];
  consentGiven: boolean;
  consentTimestamp: string;
  allowPublicListing: boolean;    // false = private/direct link only
  reviewerNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  
  // Duplicate / Risk Assessment
  riskScore?: number;             // 0-100 (AI generated risk indicator)
  duplicateCheckHash?: string;    // Hash of creditor + account reference
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  settledAt?: string;
}

export interface PayFlowDebtContribution {
  id: string;
  debtRequestId: string;
  debtRequestTitle: string;
  creditorName: string;
  supporterUserId?: string;
  supporterName: string;          // "Anonymous Supporter" or custom name
  supporterEmail?: string;
  isAnonymous: boolean;
  amount: number;
  feeCoverAmount: number;         // Supporter opted to cover payment processing fees
  totalPaid: number;
  currency: string;
  
  // Payment Provider Reference
  provider: 'paypal' | 'bank_direct' | 'offline_verified';
  paypalOrderId?: string;
  paypalCaptureId?: string;
  status: ContributionPaymentStatus;
  
  messageToBeneficiary?: string;
  receiptNumber: string;
  allocatedToCreditorAt?: string;
  settlementProofUrl?: string;
  createdAt: string;
}

export interface CreditorSettlementRecord {
  id: string;
  debtRequestId: string;
  creditorName: string;
  accountReferenceNumber: string;
  amountSettled: number;
  currency: string;
  settlementDate: string;
  confirmationReceiptNumber: string;
  settlementMethod: 'paypal_payout' | 'direct_bank_wire' | 'verified_check' | 'direct_portal';
  verifiedByReviewer: string;
  notes: string;
  proofDocumentUrl?: string;
  createdAt: string;
}

export interface DebtFreeImpactMetrics {
  totalVerifiedAssistance: number;
  totalPaidToCreditors: number;
  totalPledged: number;
  beneficiariesAssistedCount: number;
  fullySettledCount: number;
  partiallySettledCount: number;
  activeRequestsCount: number;
  averageReliefAmount: number;
  zeroPlatformFeeSavings: number; // 0% platform fee savings vs typical 5% crowdfunding cut
  currency: string;
  updatedAt: string;
}

export type DebtFreeViewSubSection = 
  | 'discover'
  | 'request'
  | 'my-requests'
  | 'my-contributions'
  | 'impact'
  | 'verification-panel'
  | 'ai-guidance';
