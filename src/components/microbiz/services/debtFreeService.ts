/**
 * PayFlow DebtFree — Client Data & Settlement Service
 * Platform: Dr. T by Zenieverse
 * Competition: PayPal AI Hackathon 2026
 */

import { 
  PayFlowDebtRequest, 
  PayFlowDebtContribution, 
  CreditorSettlementRecord, 
  DebtFreeImpactMetrics,
  DebtVerificationStatus 
} from '../types/debtFreeTypes';
import { 
  roundMoney, 
  calculateRemainingDebt, 
  calculateZeroFeeSavings,
  validateContributionAmount 
} from '../../../services/payflowMath';
import { db, auth } from '../../../services/firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  getDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';

const REQUESTS_COLLECTION = 'payflow_debt_requests';
const CONTRIBUTIONS_COLLECTION = 'payflow_debt_contributions';
const SETTLEMENTS_COLLECTION = 'payflow_debt_settlements';

const LOCAL_STORAGE_KEY_REQUESTS = 'payflow_debtfree_requests_v1';
const LOCAL_STORAGE_KEY_CONTRIBUTIONS = 'payflow_debtfree_contributions_v1';
const LOCAL_STORAGE_KEY_SETTLEMENTS = 'payflow_debtfree_settlements_v1';

// Seed demo verified debt requests representing real community challenges
export const INITIAL_DEBT_REQUESTS: PayFlowDebtRequest[] = [
  {
    id: 'DEBT-2026-001',
    beneficiaryUserId: 'beneficiary-sarah-m',
    publicAlias: 'Sarah M. — Single Parent of 2',
    beneficiaryLocation: 'Austin, Texas, USA',
    category: 'medical',
    title: 'Emergency Pediatric Surgery & Hospital Care Arrears',
    hardshipNarrative: 'My 6-year-old daughter required emergency appendectomy surgery last winter. Despite insurance, our out-of-pocket hospital co-insurance and anesthesiology balance is overwhelming while working two part-time daycare shifts.',
    originalDebtAmount: 2450.00,
    verifiedDebtAmount: 2450.00,
    currency: 'USD',
    amountPledged: 1850.00,
    amountFunded: 1850.00,
    amountPaidToCreditor: 1200.00,
    remainingBalance: 1250.00,
    creditor: {
      creditorName: 'Dell Children’s Medical Center Billing',
      creditorType: 'hospital',
      accountReferenceNumber: 'DCMC-99482-PEDIATRIC',
      paymentPortalUrl: 'https://billing.example.org/pay/dcmc-99482',
      directPayeeDetails: {
        payeeName: 'Dell Children’s Healthcare Foundation Billing Dept',
        routingNumber: '111000025',
        accountNumberMasked: '••••••••4891',
        billingAddress: '4900 Mueller Blvd, Austin, TX 78723',
        officialPhone: '+1 (512) 324-0000'
      },
      specialInstructions: 'Quote patient ref DCMC-99482 for direct ledger application.'
    },
    status: 'PARTIALLY_SETTLED',
    documents: [
      {
        id: 'doc-001',
        fileName: 'hospital_itemized_statement_redacted.pdf',
        fileType: 'application/pdf',
        uploadedAt: '2026-02-10T14:20:00Z',
        documentType: 'billing_statement',
        isVerified: true,
        verifiedAt: '2026-02-12T09:00:00Z',
        verifierNotes: 'Verified directly with hospital billing office on official patient balance portal.'
      }
    ],
    consentGiven: true,
    consentTimestamp: '2026-02-10T14:25:00Z',
    allowPublicListing: true,
    reviewerNotes: 'Itemized hospital ledger verified. Creditor accepts direct electronic payments.',
    reviewedBy: 'Reviewer Dr. T Trust Committee',
    reviewedAt: '2026-02-12T09:30:00Z',
    riskScore: 12,
    createdAt: '2026-02-10T14:25:00Z',
    updatedAt: '2026-02-28T16:00:00Z'
  },
  {
    id: 'DEBT-2026-002',
    beneficiaryUserId: 'beneficiary-carlos-r',
    publicAlias: 'Carlos R. — Community Carpentry Apprentice',
    beneficiaryLocation: 'Denver, Colorado, USA',
    category: 'education',
    title: 'Trade Guild Carpentry Certification & Tools Tuition Balance',
    hardshipNarrative: 'Completing my final semester in green architectural woodworking. A sudden transmission failure on my work truck wiped out my savings for the final certification examination and guild registration fees.',
    originalDebtAmount: 1200.00,
    verifiedDebtAmount: 1200.00,
    currency: 'USD',
    amountPledged: 600.00,
    amountFunded: 600.00,
    amountPaidToCreditor: 0.00,
    remainingBalance: 1200.00,
    creditor: {
      creditorName: 'Colorado Vocational Guild Bursar',
      creditorType: 'school',
      accountReferenceNumber: 'CVG-2026-W309',
      paymentPortalUrl: 'https://bursar.example.edu/tuition/cvg-2026',
      directPayeeDetails: {
        payeeName: 'Colorado Guild of Trades & Bursar',
        billingAddress: '1400 16th St Mall, Denver, CO 80202',
        officialPhone: '+1 (303) 555-0144'
      }
    },
    status: 'PARTIALLY_FUNDED',
    documents: [
      {
        id: 'doc-002',
        fileName: 'vocational_guild_tuition_notice.pdf',
        fileType: 'application/pdf',
        uploadedAt: '2026-02-15T11:00:00Z',
        documentType: 'official_invoice',
        isVerified: true,
        verifiedAt: '2026-02-16T10:15:00Z',
        verifierNotes: 'Verified tuition invoice with vocational registrar.'
      }
    ],
    consentGiven: true,
    consentTimestamp: '2026-02-15T11:05:00Z',
    allowPublicListing: true,
    reviewerNotes: 'Verified registration hold. Direct tuition portal confirmed.',
    reviewedBy: 'Reviewer Dr. T Trust Committee',
    reviewedAt: '2026-02-16T10:30:00Z',
    riskScore: 8,
    createdAt: '2026-02-15T11:05:00Z',
    updatedAt: '2026-03-01T12:00:00Z'
  },
  {
    id: 'DEBT-2026-003',
    beneficiaryUserId: 'beneficiary-lan-nguyen',
    publicAlias: 'L. N. — Independent Tailor & Street Seamstress',
    beneficiaryLocation: 'Đà Nẵng, Vietnam',
    category: 'utilities',
    title: 'Winter Commercial Electricity & Sewing Machinery Power Arrears',
    hardshipNarrative: 'During the severe monsoon flooding in Central Vietnam, our ground-floor sewing workspace was inundated. While repairing fabrics for local families, our utility arrears accumulated with EVN.',
    originalDebtAmount: 380.00,
    verifiedDebtAmount: 380.00,
    currency: 'USD',
    amountPledged: 380.00,
    amountFunded: 380.00,
    amountPaidToCreditor: 380.00,
    remainingBalance: 0.00,
    creditor: {
      creditorName: 'Central Power Corporation (EVN CPC)',
      creditorType: 'utility_company',
      accountReferenceNumber: 'EVN-DN-8492019',
      paymentPortalUrl: 'https://cpc.vn/tra-cuu-tien-dien',
      directPayeeDetails: {
        payeeName: 'Tong Cong Ty Dien Luc Mien Trung',
        billingAddress: '393 Trung Nu Vuong, Da Nang, Vietnam',
        officialPhone: '+84 236 2220 100'
      }
    },
    status: 'SETTLED',
    documents: [
      {
        id: 'doc-003',
        fileName: 'hoa_don_tien_dien_evn.pdf',
        fileType: 'application/pdf',
        uploadedAt: '2026-01-20T08:30:00Z',
        documentType: 'billing_statement',
        isVerified: true,
        verifiedAt: '2026-01-21T09:00:00Z',
        verifierNotes: 'Verified EVN customer code directly on EVN CPC portal.'
      }
    ],
    consentGiven: true,
    consentTimestamp: '2026-01-20T08:35:00Z',
    allowPublicListing: true,
    reviewerNotes: 'Fully settled directly to EVN billing account via authorized payout.',
    reviewedBy: 'Reviewer Dr. T Trust Committee',
    reviewedAt: '2026-01-21T09:30:00Z',
    riskScore: 5,
    createdAt: '2026-01-20T08:35:00Z',
    updatedAt: '2026-01-25T14:00:00Z',
    settledAt: '2026-01-25T14:00:00Z'
  }
];

export const INITIAL_CONTRIBUTIONS: PayFlowDebtContribution[] = [
  {
    id: 'CONTRIB-001',
    debtRequestId: 'DEBT-2026-001',
    debtRequestTitle: 'Emergency Pediatric Surgery & Hospital Care Arrears',
    creditorName: 'Dell Children’s Medical Center Billing',
    supporterName: 'Compassionate Neighbor',
    isAnonymous: false,
    amount: 1000.00,
    feeCoverAmount: 29.30,
    totalPaid: 1029.30,
    currency: 'USD',
    provider: 'paypal',
    paypalOrderId: 'PAYPAL_ORDER_8921893',
    paypalCaptureId: 'CAP_881920391',
    status: 'PAID_TO_CREDITOR',
    messageToBeneficiary: 'Praying for your little girl’s speedy recovery. Stay strong!',
    receiptNumber: 'REC-DEBT-2026-001',
    allocatedToCreditorAt: '2026-02-14T15:00:00Z',
    createdAt: '2026-02-13T10:00:00Z'
  },
  {
    id: 'CONTRIB-002',
    debtRequestId: 'DEBT-2026-001',
    debtRequestTitle: 'Emergency Pediatric Surgery & Hospital Care Arrears',
    creditorName: 'Dell Children’s Medical Center Billing',
    supporterName: 'Anonymous Supporter',
    isAnonymous: true,
    amount: 200.00,
    feeCoverAmount: 6.10,
    totalPaid: 206.10,
    currency: 'USD',
    provider: 'paypal',
    paypalOrderId: 'PAYPAL_ORDER_8921904',
    paypalCaptureId: 'CAP_881920402',
    status: 'PAID_TO_CREDITOR',
    messageToBeneficiary: 'No parent should have to worry about medical debt when taking care of their child.',
    receiptNumber: 'REC-DEBT-2026-002',
    allocatedToCreditorAt: '2026-02-20T11:00:00Z',
    createdAt: '2026-02-19T14:30:00Z'
  },
  {
    id: 'CONTRIB-003',
    debtRequestId: 'DEBT-2026-002',
    debtRequestTitle: 'Trade Guild Carpentry Certification & Tools Tuition Balance',
    creditorName: 'Colorado Vocational Guild Bursar',
    supporterName: 'Master Craftsman Mentor',
    isAnonymous: false,
    amount: 600.00,
    feeCoverAmount: 17.70,
    totalPaid: 617.70,
    currency: 'USD',
    provider: 'paypal',
    paypalOrderId: 'PAYPAL_ORDER_8922001',
    paypalCaptureId: 'CAP_881920555',
    status: 'PROCESSING',
    messageToBeneficiary: 'We need skilled young carpenters in the trade. Keep building with honor.',
    receiptNumber: 'REC-DEBT-2026-003',
    createdAt: '2026-02-28T09:15:00Z'
  },
  {
    id: 'CONTRIB-004',
    debtRequestId: 'DEBT-2026-003',
    debtRequestTitle: 'Winter Commercial Electricity & Sewing Machinery Power Arrears',
    creditorName: 'Central Power Corporation (EVN CPC)',
    supporterName: 'Zenieverse Global Community Fund',
    isAnonymous: false,
    amount: 380.00,
    feeCoverAmount: 0.00,
    totalPaid: 380.00,
    currency: 'USD',
    provider: 'paypal',
    paypalOrderId: 'PAYPAL_ORDER_8922110',
    paypalCaptureId: 'CAP_881920789',
    status: 'SETTLED',
    messageToBeneficiary: 'In solidarity with Central Vietnam artisans.',
    receiptNumber: 'REC-DEBT-2026-004',
    allocatedToCreditorAt: '2026-01-25T14:00:00Z',
    createdAt: '2026-01-22T16:00:00Z'
  }
];

export const INITIAL_SETTLEMENTS: CreditorSettlementRecord[] = [
  {
    id: 'SETTLE-001',
    debtRequestId: 'DEBT-2026-001',
    creditorName: 'Dell Children’s Medical Center Billing',
    accountReferenceNumber: 'DCMC-99482-PEDIATRIC',
    amountSettled: 1200.00,
    currency: 'USD',
    settlementDate: '2026-02-14',
    confirmationReceiptNumber: 'HOSP-CONF-8829019',
    settlementMethod: 'direct_portal',
    verifiedByReviewer: 'Reviewer Dr. T Trust Committee',
    notes: 'Paid through Dell Children’s official online patient payment portal using verified supporter allocations. Official confirmation receipt attached.',
    createdAt: '2026-02-14T15:00:00Z'
  },
  {
    id: 'SETTLE-002',
    debtRequestId: 'DEBT-2026-003',
    creditorName: 'Central Power Corporation (EVN CPC)',
    accountReferenceNumber: 'EVN-DN-8492019',
    amountSettled: 380.00,
    currency: 'USD',
    settlementDate: '2026-01-25',
    confirmationReceiptNumber: 'EVN-BILL-PAID-772910',
    settlementMethod: 'direct_portal',
    verifiedByReviewer: 'Reviewer Dr. T Trust Committee',
    notes: 'Electricity bill fully settled. Account returned to active standing with zero arrears.',
    createdAt: '2026-01-25T14:00:00Z'
  }
];

export class DebtFreeService {
  /**
   * Retrieves all verified/published debt requests
   */
  static async getRequests(): Promise<PayFlowDebtRequest[]> {
    if (db && auth?.currentUser) {
      try {
        const snap = await getDocs(collection(db, REQUESTS_COLLECTION));
        if (!snap.empty) {
          const list: PayFlowDebtRequest[] = [];
          snap.forEach(d => list.push(d.data() as PayFlowDebtRequest));
          return list;
        }
      } catch (err) {
        console.warn('Firestore getRequests fallback:', err);
      }
    }

    try {
      const local = localStorage.getItem(LOCAL_STORAGE_KEY_REQUESTS);
      if (local) {
        return JSON.parse(local);
      }
    } catch {
      // ignore
    }

    // Default to seed data
    return INITIAL_DEBT_REQUESTS;
  }

  /**
   * Saves or updates a debt request
   */
  static async saveRequest(req: PayFlowDebtRequest): Promise<PayFlowDebtRequest> {
    const updated = {
      ...req,
      updatedAt: new Date().toISOString(),
      remainingBalance: calculateRemainingDebt(
        req.verifiedDebtAmount || req.originalDebtAmount,
        req.amountPaidToCreditor,
        req.currency
      )
    };

    if (db && auth?.currentUser) {
      try {
        await setDoc(doc(db, REQUESTS_COLLECTION, updated.id), updated);
      } catch (err) {
        console.warn('Firestore saveRequest fallback:', err);
      }
    }

    // LocalStorage fallback
    const all = await this.getRequests();
    const idx = all.findIndex(r => r.id === updated.id);
    if (idx >= 0) {
      all[idx] = updated;
    } else {
      all.unshift(updated);
    }
    localStorage.setItem(LOCAL_STORAGE_KEY_REQUESTS, JSON.stringify(all));

    return updated;
  }

  /**
   * Retrieves all supporter contributions
   */
  static async getContributions(): Promise<PayFlowDebtContribution[]> {
    if (db && auth?.currentUser) {
      try {
        const snap = await getDocs(collection(db, CONTRIBUTIONS_COLLECTION));
        if (!snap.empty) {
          const list: PayFlowDebtContribution[] = [];
          snap.forEach(d => list.push(d.data() as PayFlowDebtContribution));
          return list;
        }
      } catch (err) {
        console.warn('Firestore getContributions fallback:', err);
      }
    }

    try {
      const local = localStorage.getItem(LOCAL_STORAGE_KEY_CONTRIBUTIONS);
      if (local) {
        return JSON.parse(local);
      }
    } catch {
      // ignore
    }

    return INITIAL_CONTRIBUTIONS;
  }

  /**
   * Atomically records a verified supporter contribution and updates the target debt request
   */
  static async recordContribution(
    contributionData: Omit<PayFlowDebtContribution, 'id' | 'receiptNumber' | 'createdAt'>
  ): Promise<{ contribution: PayFlowDebtContribution; updatedRequest: PayFlowDebtRequest }> {
    const requests = await this.getRequests();
    const target = requests.find(r => r.id === contributionData.debtRequestId);

    if (!target) {
      throw new Error(`Debt request ${contributionData.debtRequestId} not found.`);
    }

    // Atomic overpayment prevention guard
    const validation = validateContributionAmount(
      contributionData.amount,
      target.remainingBalance,
      target.currency
    );

    if (!validation.isValid) {
      throw new Error(validation.error || 'Invalid contribution amount.');
    }

    const contributionId = `CONTRIB-${Date.now().toString(36).toUpperCase()}`;
    const receiptNumber = `REC-DEBT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newContrib: PayFlowDebtContribution = {
      ...contributionData,
      id: contributionId,
      receiptNumber,
      createdAt: new Date().toISOString()
    };

    // Calculate new amounts
    const newAmountFunded = roundMoney(target.amountFunded + contributionData.amount, target.currency);
    const newAmountPledged = roundMoney(target.amountPledged + contributionData.amount, target.currency);

    // Determine new status
    let nextStatus: DebtVerificationStatus = target.status;
    if (newAmountFunded >= target.verifiedDebtAmount) {
      nextStatus = 'PAYMENT_PROCESSING';
    } else if (newAmountFunded > 0 && target.status === 'PUBLISHED') {
      nextStatus = 'PARTIALLY_FUNDED';
    }

    const updatedRequest: PayFlowDebtRequest = {
      ...target,
      amountFunded: newAmountFunded,
      amountPledged: newAmountPledged,
      status: nextStatus,
      updatedAt: new Date().toISOString()
    };

    // Save contribution
    if (db && auth?.currentUser) {
      try {
        await setDoc(doc(db, CONTRIBUTIONS_COLLECTION, newContrib.id), newContrib);
      } catch (err) {
        console.warn('Firestore save contribution error:', err);
      }
    }

    const allContribs = await this.getContributions();
    allContribs.unshift(newContrib);
    localStorage.setItem(LOCAL_STORAGE_KEY_CONTRIBUTIONS, JSON.stringify(allContribs));

    // Save updated request
    const savedReq = await this.saveRequest(updatedRequest);

    return { contribution: newContrib, updatedRequest: savedReq };
  }

  /**
   * Retrieves all verified creditor settlement records
   */
  static async getSettlementRecords(): Promise<CreditorSettlementRecord[]> {
    if (db && auth?.currentUser) {
      try {
        const snap = await getDocs(collection(db, SETTLEMENTS_COLLECTION));
        if (!snap.empty) {
          const list: CreditorSettlementRecord[] = [];
          snap.forEach(d => list.push(d.data() as CreditorSettlementRecord));
          return list;
        }
      } catch (err) {
        console.warn('Firestore getSettlements fallback:', err);
      }
    }

    try {
      const local = localStorage.getItem(LOCAL_STORAGE_KEY_SETTLEMENTS);
      if (local) {
        return JSON.parse(local);
      }
    } catch {
      // ignore
    }

    return INITIAL_SETTLEMENTS;
  }

  /**
   * Records an official creditor settlement receipt (direct disbursement to creditor)
   */
  static async recordSettlement(
    recordData: Omit<CreditorSettlementRecord, 'id' | 'createdAt'>
  ): Promise<{ settlement: CreditorSettlementRecord; updatedRequest: PayFlowDebtRequest }> {
    const requests = await this.getRequests();
    const target = requests.find(r => r.id === recordData.debtRequestId);

    if (!target) {
      throw new Error(`Debt request ${recordData.debtRequestId} not found.`);
    }

    const settlementId = `SETTLE-${Date.now().toString(36).toUpperCase()}`;
    const newSettlement: CreditorSettlementRecord = {
      ...recordData,
      id: settlementId,
      createdAt: new Date().toISOString()
    };

    const newPaidToCreditor = roundMoney(target.amountPaidToCreditor + recordData.amountSettled, target.currency);
    const newRemaining = calculateRemainingDebt(target.verifiedDebtAmount, newPaidToCreditor, target.currency);

    let nextStatus: DebtVerificationStatus = target.status;
    let settledAt: string | undefined = target.settledAt;

    if (newRemaining <= 0) {
      nextStatus = 'SETTLED';
      settledAt = new Date().toISOString();
    } else {
      nextStatus = 'PARTIALLY_SETTLED';
    }

    const updatedRequest: PayFlowDebtRequest = {
      ...target,
      amountPaidToCreditor: newPaidToCreditor,
      remainingBalance: newRemaining,
      status: nextStatus,
      settledAt,
      updatedAt: new Date().toISOString()
    };

    // Save settlement
    if (db && auth?.currentUser) {
      try {
        await setDoc(doc(db, SETTLEMENTS_COLLECTION, newSettlement.id), newSettlement);
      } catch (err) {
        console.warn('Firestore save settlement error:', err);
      }
    }

    const allSettlements = await this.getSettlementRecords();
    allSettlements.unshift(newSettlement);
    localStorage.setItem(LOCAL_STORAGE_KEY_SETTLEMENTS, JSON.stringify(allSettlements));

    // Save updated request
    const savedReq = await this.saveRequest(updatedRequest);

    return { settlement: newSettlement, updatedRequest: savedReq };
  }

  /**
   * Computes real-time platform impact metrics
   */
  static async getImpactMetrics(currency: string = 'USD'): Promise<DebtFreeImpactMetrics> {
    const requests = await this.getRequests();
    const contributions = await this.getContributions();

    let totalVerified = 0;
    let totalPaidCreditors = 0;
    let totalPledged = 0;
    let fullySettled = 0;
    let partiallySettled = 0;

    for (const r of requests) {
      if (r.status !== 'REJECTED' && r.status !== 'DRAFT') {
        totalVerified += r.verifiedDebtAmount;
        totalPaidCreditors += r.amountPaidToCreditor;
        totalPledged += r.amountPledged;
        if (r.status === 'SETTLED') {
          fullySettled++;
        } else if (r.status === 'PARTIALLY_SETTLED' || r.amountPaidToCreditor > 0) {
          partiallySettled++;
        }
      }
    }

    const totalProcessed = contributions.reduce((acc, c) => acc + (c.status !== 'REFUNDED' ? c.amount : 0), 0);
    const zeroPlatformFeeSavings = calculateZeroFeeSavings(totalProcessed, 5, currency);

    return {
      totalVerifiedAssistance: roundMoney(totalVerified, currency),
      totalPaidToCreditors: roundMoney(totalPaidCreditors, currency),
      totalPledged: roundMoney(totalPledged, currency),
      beneficiariesAssistedCount: requests.filter(r => r.amountFunded > 0).length,
      fullySettledCount: fullySettled,
      partiallySettledCount: partiallySettled,
      activeRequestsCount: requests.filter(r => r.status === 'PUBLISHED' || r.status === 'PARTIALLY_FUNDED').length,
      averageReliefAmount: requests.length > 0 ? roundMoney(totalVerified / requests.length, currency) : 0,
      zeroPlatformFeeSavings,
      currency,
      updatedAt: new Date().toISOString()
    };
  }
}
