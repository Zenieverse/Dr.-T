/**
 * MicroBiz PayFlow AI — Client-Side Operations & Persistence Service
 * Competition: PayPal AI Hackathon 2026
 * Platform: Dr. T by Zenieverse
 * 
 * Features:
 * - Realtime Firestore persistence for Invoices, Transactions, Expenses, Settings
 * - Decimal-safe math via payflowMath
 * - Official PayPal Server-side APIs integration (Create Order, Capture Order)
 * - Offline/Cash payments reconciliation
 * - Gather & Glow event bridge
 * - Safe LocalStorage cache with guest-isolation
 */

import { db, auth } from '../../../services/firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import { 
  PayFlowInvoice, 
  PayFlowTransaction, 
  PayFlowExpense, 
  PayFlowBusinessProfile, 
  InvoiceStatus, 
  DateFilterRange, 
  PayFlowDashboardMetrics 
} from '../types/payflowTypes';
import { 
  calculateInvoiceTotals, 
  roundMoney, 
  LineItemInput 
} from '../../../services/payflowMath';

const STORAGE_KEYS = {
  INVOICES: 'payflow_invoices_cache_v1',
  TRANSACTIONS: 'payflow_transactions_cache_v1',
  EXPENSES: 'payflow_expenses_cache_v1',
  SETTINGS: 'payflow_settings_cache_v1',
};

const DEFAULT_BUSINESS_PROFILE: PayFlowBusinessProfile = {
  userId: 'default',
  businessName: 'Zenieverse Creative Works',
  ownerName: 'Alex Rivera',
  email: 'business@zenieverse.com',
  phone: '+1 (415) 555-0199',
  address: '742 Market Street, Suite 400, San Francisco, CA 94102',
  taxId: 'US-94-3829102',
  defaultCurrency: 'USD',
  defaultTaxRate: 8.5,
  defaultPaymentTerms: 'Payment due within 14 days of issue.',
  invoicePrefix: 'INV-2026-',
  nextInvoiceSequence: 104,
  paypalEmail: 'merchant@zenieverse.com',
  paypalSandboxVerified: true,
  gatherGlowConnected: true,
  updatedAt: new Date().toISOString()
};

const SEED_INVOICES: PayFlowInvoice[] = [
  {
    id: 'inv_seed_001',
    userId: 'default',
    invoiceNumber: 'INV-2026-101',
    business: {
      name: 'Zenieverse Creative Works',
      email: 'business@zenieverse.com',
      phone: '+1 (415) 555-0199',
      address: '742 Market Street, San Francisco, CA 94102',
      taxId: 'US-94-3829102'
    },
    customer: {
      name: 'Acme Heritage Botanicals',
      email: 'finance@acmebotanicals.com',
      companyName: 'Acme Botanicals Inc.',
      address: '120 Organic Valley Rd, Petaluma, CA 94952'
    },
    issueDate: '2026-03-01',
    dueDate: '2026-03-15',
    items: [
      { id: 'item_1', description: 'Brand Identity Design & Artisan Packaging Guide', quantity: 1, unitPrice: 1200, amount: 1200 },
      { id: 'item_2', description: 'Custom Shopify Theme & PayPal Commerce Integration', quantity: 1, unitPrice: 850, amount: 850 }
    ],
    currency: 'USD',
    subtotal: 2050,
    discountRate: 5,
    discountAmount: 102.5,
    taxRate: 8.5,
    taxAmount: 165.54,
    total: 2113.04,
    amountPaid: 2113.04,
    balanceDue: 0,
    status: 'PAID',
    paypalOrderId: 'ORDER-89230192A',
    paypalCaptureId: 'CAPTURE-7729102K',
    history: [
      { id: 'hist_1', timestamp: '2026-03-01T10:00:00Z', action: 'CREATED', actor: 'Alex Rivera', note: 'Drafted and sent' },
      { id: 'hist_2', timestamp: '2026-03-03T15:22:10Z', action: 'PAYPAL_PAID', actor: 'PayPal System', note: 'Captured via PayPal Checkout $2,113.04 USD' }
    ],
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-03-03T15:22:10Z'
  },
  {
    id: 'inv_seed_002',
    userId: 'default',
    invoiceNumber: 'INV-2026-102',
    business: {
      name: 'Zenieverse Creative Works',
      email: 'business@zenieverse.com',
      phone: '+1 (415) 555-0199',
      address: '742 Market Street, San Francisco, CA 94102',
      taxId: 'US-94-3829102'
    },
    customer: {
      name: 'An Vien Heritage Garden Courtyard',
      email: 'events@anvienheritage.vn',
      companyName: 'An Vien Hospitality Group',
      address: 'Phu Nhuan, Ho Chi Minh City, Vietnam'
    },
    issueDate: '2026-03-10',
    dueDate: '2026-03-24',
    items: [
      { id: 'item_3', description: 'Gather & Glow Celebration Visual Assets & Run Sheets', quantity: 1, unitPrice: 1500, amount: 1500 },
      { id: 'item_4', description: 'On-site A/V Setup & Livestream Coordination', quantity: 1, unitPrice: 400, amount: 400 }
    ],
    currency: 'USD',
    subtotal: 1900,
    discountRate: 0,
    discountAmount: 0,
    taxRate: 0,
    taxAmount: 0,
    total: 1900,
    amountPaid: 950,
    balanceDue: 950,
    status: 'PARTIALLY_PAID',
    gatherGlowEventId: 'event_wedding_da_nang',
    history: [
      { id: 'hist_3', timestamp: '2026-03-10T09:00:00Z', action: 'CREATED', actor: 'Alex Rivera', note: 'Linked to Gather & Glow event' },
      { id: 'hist_4', timestamp: '2026-03-12T11:45:00Z', action: 'DEPOSIT_PAID', actor: 'Alex Rivera', note: 'Recorded initial 50% deposit' }
    ],
    createdAt: '2026-03-10T09:00:00Z',
    updatedAt: '2026-03-12T11:45:00Z'
  },
  {
    id: 'inv_seed_003',
    userId: 'default',
    invoiceNumber: 'INV-2026-103',
    business: {
      name: 'Zenieverse Creative Works',
      email: 'business@zenieverse.com',
      phone: '+1 (415) 555-0199',
      address: '742 Market Street, San Francisco, CA 94102',
      taxId: 'US-94-3829102'
    },
    customer: {
      name: 'Dr. Michael Chen',
      email: 'dr.chen@biomedconsult.org',
      companyName: 'BioMed Informatics LLC',
      address: '400 Parnassus Ave, San Francisco, CA 94143'
    },
    issueDate: '2026-02-15',
    dueDate: '2026-03-01',
    items: [
      { id: 'item_5', description: 'Clinical Informatics R4 HL7 FHIR Bridge Architecture', quantity: 10, unitPrice: 150, amount: 1500 }
    ],
    currency: 'USD',
    subtotal: 1500,
    discountRate: 0,
    discountAmount: 0,
    taxRate: 8.5,
    taxAmount: 127.50,
    total: 1627.50,
    amountPaid: 0,
    balanceDue: 1627.50,
    status: 'OVERDUE',
    history: [
      { id: 'hist_5', timestamp: '2026-02-15T08:00:00Z', action: 'CREATED', actor: 'Alex Rivera', note: 'Issued invoice' },
      { id: 'hist_6', timestamp: '2026-03-02T00:00:00Z', action: 'STATUS_OVERDUE', actor: 'System', note: 'Past due date' }
    ],
    createdAt: '2026-02-15T08:00:00Z',
    updatedAt: '2026-03-02T00:00:00Z'
  }
];

const SEED_TRANSACTIONS: PayFlowTransaction[] = [
  {
    id: 'txn_seed_001',
    userId: 'default',
    invoiceId: 'inv_seed_001',
    invoiceNumber: 'INV-2026-101',
    provider: 'paypal',
    providerTransactionId: 'CAPTURE-7729102K',
    paypalOrderId: 'ORDER-89230192A',
    customerName: 'Acme Heritage Botanicals',
    customerEmail: 'finance@acmebotanicals.com',
    grossAmount: 2113.04,
    feeAmount: 61.28,
    netAmount: 2051.76,
    currency: 'USD',
    status: 'COMPLETED',
    paymentDate: '2026-03-03T15:22:10Z',
    payerDetails: {
      email: 'treasury@acmebotanicals.com',
      name: 'Acme Botanicals Treasury',
      countryCode: 'US'
    },
    notes: 'Official PayPal Express Checkout settlement',
    createdAt: '2026-03-03T15:22:10Z'
  },
  {
    id: 'txn_seed_002',
    userId: 'default',
    invoiceId: 'inv_seed_002',
    invoiceNumber: 'INV-2026-102',
    provider: 'bank_transfer',
    providerTransactionId: 'WIRE-2026-8812',
    customerName: 'An Vien Heritage Garden Courtyard',
    customerEmail: 'events@anvienheritage.vn',
    grossAmount: 950.00,
    feeAmount: 0.00,
    netAmount: 950.00,
    currency: 'USD',
    status: 'COMPLETED',
    paymentDate: '2026-03-12T11:45:00Z',
    notes: '50% celebration deposit linked to Gather & Glow',
    gatherGlowEventId: 'event_wedding_da_nang',
    createdAt: '2026-03-12T11:45:00Z'
  }
];

const SEED_EXPENSES: PayFlowExpense[] = [
  {
    id: 'exp_seed_001',
    userId: 'default',
    merchant: 'GitHub Inc.',
    category: 'Software & Cloud Services',
    date: '2026-03-02',
    amount: 48.00,
    taxAmount: 4.08,
    currency: 'USD',
    paymentMethod: 'PayPal Commercial Card',
    notes: 'Enterprise Copilot & CI/CD compute minutes',
    verifiedByUser: true,
    createdAt: '2026-03-02T10:00:00Z'
  },
  {
    id: 'exp_seed_002',
    userId: 'default',
    merchant: 'Hoi An Lantern Guild Craft',
    category: 'Materials & Equipment',
    date: '2026-03-11',
    amount: 320.00,
    taxAmount: 0.00,
    currency: 'USD',
    paymentMethod: 'Bank Transfer',
    notes: 'Silk lanterns for Gather & Glow courtyard lighting',
    gatherGlowEventId: 'event_wedding_da_nang',
    verifiedByUser: true,
    createdAt: '2026-03-11T14:30:00Z'
  }
];

function getSafeStorage<T>(key: string, fallback: T): T {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const val = window.localStorage.getItem(key);
      if (val) return JSON.parse(val);
    }
  } catch {
    // fallback
  }
  return fallback;
}

function setSafeStorage<T>(key: string, data: T): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, JSON.stringify(data));
    }
  } catch {
    // fallback
  }
}

export class PayFlowService {
  public static getCurrentUserId(): string {
    if (auth && auth.currentUser) {
      return auth.currentUser.uid;
    }
    let guestId = sessionStorage.getItem('payflow_guest_id');
    if (!guestId) {
      guestId = `guest_pf_${Date.now().toString(36)}`;
      sessionStorage.setItem('payflow_guest_id', guestId);
    }
    return guestId;
  }

  // ----------------------------------------------------
  // BUSINESS PROFILE & SETTINGS
  // ----------------------------------------------------
  public static async getBusinessProfile(): Promise<PayFlowBusinessProfile> {
    const userId = this.getCurrentUserId();
    const stored = getSafeStorage<PayFlowBusinessProfile>(
      `${STORAGE_KEYS.SETTINGS}_${userId}`,
      { ...DEFAULT_BUSINESS_PROFILE, userId }
    );

    try {
      if (db && auth && auth.currentUser) {
        const docRef = doc(db, 'microbiz_business_settings', userId);
        const snapshot = await getDocs(query(collection(db, 'microbiz_business_settings'), where('userId', '==', userId)));
        if (!snapshot.empty) {
          const remoteData = snapshot.docs[0].data() as PayFlowBusinessProfile;
          setSafeStorage(`${STORAGE_KEYS.SETTINGS}_${userId}`, remoteData);
          return remoteData;
        }
      }
    } catch (err) {
      console.warn('[PayFlowService] Firestore settings fetch notice:', err);
    }

    return stored;
  }

  public static async saveBusinessProfile(profile: Partial<PayFlowBusinessProfile>): Promise<PayFlowBusinessProfile> {
    const userId = this.getCurrentUserId();
    const current = await this.getBusinessProfile();
    const updated: PayFlowBusinessProfile = {
      ...current,
      ...profile,
      userId,
      updatedAt: new Date().toISOString()
    };

    setSafeStorage(`${STORAGE_KEYS.SETTINGS}_${userId}`, updated);

    try {
      if (db && auth && auth.currentUser) {
        const docRef = doc(db, 'microbiz_business_settings', userId);
        await setDoc(docRef, updated, { merge: true });
      }
    } catch (err) {
      console.warn('[PayFlowService] Firestore settings save notice:', err);
    }

    return updated;
  }

  // ----------------------------------------------------
  // INVOICE LIFECYCLE
  // ----------------------------------------------------
  public static async getInvoices(): Promise<PayFlowInvoice[]> {
    const userId = this.getCurrentUserId();
    const stored = getSafeStorage<PayFlowInvoice[]>(
      `${STORAGE_KEYS.INVOICES}_${userId}`,
      userId === 'default' ? SEED_INVOICES : []
    );

    try {
      if (db && auth && auth.currentUser) {
        const q = query(
          collection(db, 'microbiz_invoices'),
          where('userId', '==', userId)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const remoteInvoices: PayFlowInvoice[] = [];
          snapshot.forEach(docSnap => {
            remoteInvoices.push({ id: docSnap.id, ...docSnap.data() } as PayFlowInvoice);
          });
          setSafeStorage(`${STORAGE_KEYS.INVOICES}_${userId}`, remoteInvoices);
          return remoteInvoices;
        }
      }
    } catch (err) {
      console.warn('[PayFlowService] Firestore invoices fetch notice:', err);
    }

    return stored;
  }

  public static async saveInvoice(invoiceData: Partial<PayFlowInvoice>): Promise<PayFlowInvoice> {
    const userId = this.getCurrentUserId();
    const profile = await this.getBusinessProfile();
    const currency = invoiceData.currency || profile.defaultCurrency || 'USD';

    // Calculate exact totals with decimal safety
    const items = invoiceData.items || [];
    const discountRate = invoiceData.discountRate || 0;
    const taxRate = invoiceData.taxRate !== undefined ? invoiceData.taxRate : profile.defaultTaxRate;
    
    const calcs = calculateInvoiceTotals(items, discountRate, taxRate, currency);

    const nowIso = new Date().toISOString();
    const invoiceId = invoiceData.id || `inv_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
    
    // Auto-generate invoice number if not provided
    let invoiceNumber = invoiceData.invoiceNumber;
    if (!invoiceNumber) {
      const seq = profile.nextInvoiceSequence || 101;
      invoiceNumber = `${profile.invoicePrefix}${seq}`;
      // increment sequence
      this.saveBusinessProfile({ nextInvoiceSequence: seq + 1 }).catch(() => {});
    }

    const amountPaid = invoiceData.amountPaid || 0;
    const balanceDue = roundMoney(Math.max(0, calcs.total - amountPaid), currency);

    let status: InvoiceStatus = invoiceData.status || 'DRAFT';
    if (balanceDue === 0 && calcs.total > 0) {
      status = 'PAID';
    } else if (amountPaid > 0 && balanceDue > 0) {
      status = 'PARTIALLY_PAID';
    }

    const history = invoiceData.history || [];
    history.push({
      id: `hist_${Date.now()}`,
      timestamp: nowIso,
      action: invoiceData.id ? 'UPDATED' : 'CREATED',
      actor: profile.ownerName || 'User',
      note: `Invoice total: ${calcs.formattedTotal}`
    });

    const fullInvoice: PayFlowInvoice = {
      id: invoiceId,
      userId,
      invoiceNumber,
      business: invoiceData.business || {
        name: profile.businessName,
        email: profile.email,
        phone: profile.phone,
        address: profile.address,
        taxId: profile.taxId,
        logoUrl: profile.logoUrl
      },
      customer: invoiceData.customer || {
        name: 'Client Partner',
        email: 'client@example.com'
      },
      issueDate: invoiceData.issueDate || nowIso.split('T')[0],
      dueDate: invoiceData.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      items,
      currency,
      subtotal: calcs.subtotal,
      discountRate,
      discountAmount: calcs.discountAmount,
      taxRate,
      taxAmount: calcs.taxAmount,
      total: calcs.total,
      amountPaid,
      balanceDue,
      notes: invoiceData.notes || 'Thank you for your business!',
      terms: invoiceData.terms || profile.defaultPaymentTerms,
      status,
      paypalOrderId: invoiceData.paypalOrderId,
      paypalCaptureId: invoiceData.paypalCaptureId,
      paypalPaymentUrl: invoiceData.paypalPaymentUrl,
      gatherGlowEventId: invoiceData.gatherGlowEventId,
      gatherGlowVendorId: invoiceData.gatherGlowVendorId,
      history,
      createdAt: invoiceData.createdAt || nowIso,
      updatedAt: nowIso
    };

    // Update local cache
    const current = await this.getInvoices();
    const existingIndex = current.findIndex(i => i.id === invoiceId);
    if (existingIndex >= 0) {
      current[existingIndex] = fullInvoice;
    } else {
      current.unshift(fullInvoice);
    }
    setSafeStorage(`${STORAGE_KEYS.INVOICES}_${userId}`, current);

    // Save to Firestore
    try {
      if (db && auth && auth.currentUser) {
        await setDoc(doc(db, 'microbiz_invoices', invoiceId), fullInvoice, { merge: true });
      }
    } catch (err) {
      console.warn('[PayFlowService] Firestore invoice save notice:', err);
    }

    return fullInvoice;
  }

  public static async deleteInvoice(invoiceId: string): Promise<void> {
    const userId = this.getCurrentUserId();
    const current = await this.getInvoices();
    const filtered = current.filter(i => i.id !== invoiceId);
    setSafeStorage(`${STORAGE_KEYS.INVOICES}_${userId}`, filtered);

    try {
      if (db && auth && auth.currentUser) {
        await deleteDoc(doc(db, 'microbiz_invoices', invoiceId));
      }
    } catch (err) {
      console.warn('[PayFlowService] Firestore invoice delete notice:', err);
    }
  }

  // ----------------------------------------------------
  // PAYPAL CHECKOUT & SERVER CAPTURE BRIDGE
  // ----------------------------------------------------
  public static async createPayPalOrder(invoice: PayFlowInvoice): Promise<{
    orderId: string;
    approveUrl?: string;
  }> {
    const res = await fetch('/api/paypal/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        amount: invoice.balanceDue > 0 ? invoice.balanceDue : invoice.total,
        currency: invoice.currency,
        customerName: invoice.customer.name,
        customerEmail: invoice.customer.email,
        businessName: invoice.business.name
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `PayPal Order creation failed (${res.status})`);
    }

    const data = await res.json();
    return {
      orderId: data.orderId,
      approveUrl: data.approveUrl
    };
  }

  public static async capturePayPalOrder(orderId: string, invoice: PayFlowInvoice): Promise<{
    success: boolean;
    transaction: PayFlowTransaction;
    invoice: PayFlowInvoice;
  }> {
    const expectedAmount = invoice.balanceDue > 0 ? invoice.balanceDue : invoice.total;

    const res = await fetch('/api/paypal/capture-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        invoiceId: invoice.id,
        expectedAmount,
        expectedCurrency: invoice.currency
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Payment capture failed (${res.status})`);
    }

    const captureResult = await res.json();
    if (!captureResult.success) {
      throw new Error(captureResult.error || 'Payment capture could not be confirmed by PayPal.');
    }

    // Record authoritative transaction
    const newTransaction = await this.recordTransaction({
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      provider: 'paypal',
      providerTransactionId: captureResult.captureId || orderId,
      paypalOrderId: orderId,
      customerName: invoice.customer.name,
      customerEmail: invoice.customer.email,
      grossAmount: captureResult.grossAmount,
      feeAmount: captureResult.feeAmount || 0,
      netAmount: captureResult.netAmount || captureResult.grossAmount,
      currency: captureResult.currency,
      status: 'COMPLETED',
      paymentDate: captureResult.createTime || new Date().toISOString(),
      payerDetails: {
        email: captureResult.payerEmail,
        name: captureResult.payerName,
        payerId: captureResult.payerId
      },
      notes: `Verified PayPal Capture ${captureResult.captureId}`
    });

    // Update invoice state
    const newAmountPaid = roundMoney(invoice.amountPaid + captureResult.grossAmount, invoice.currency);
    const newBalanceDue = roundMoney(Math.max(0, invoice.total - newAmountPaid), invoice.currency);
    
    const updatedInvoice = await this.saveInvoice({
      ...invoice,
      amountPaid: newAmountPaid,
      balanceDue: newBalanceDue,
      paypalOrderId: orderId,
      paypalCaptureId: captureResult.captureId,
      status: newBalanceDue === 0 ? 'PAID' : 'PARTIALLY_PAID'
    });

    return {
      success: true,
      transaction: newTransaction,
      invoice: updatedInvoice
    };
  }

  // ----------------------------------------------------
  // OFFLINE & DIRECT PAYMENTS RECORDING
  // ----------------------------------------------------
  public static async recordOfflinePayment(
    invoice: PayFlowInvoice, 
    amount: number, 
    method: 'offline_cash' | 'bank_transfer',
    notes?: string
  ): Promise<{ transaction: PayFlowTransaction; invoice: PayFlowInvoice }> {
    const safeAmount = roundMoney(amount, invoice.currency);
    const nowIso = new Date().toISOString();

    const transaction = await this.recordTransaction({
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      provider: method,
      providerTransactionId: `OFFLINE_${Date.now().toString(36)}`,
      customerName: invoice.customer.name,
      customerEmail: invoice.customer.email,
      grossAmount: safeAmount,
      feeAmount: 0,
      netAmount: safeAmount,
      currency: invoice.currency,
      status: 'COMPLETED',
      paymentDate: nowIso,
      notes: notes || `Direct manual settlement (${method})`
    });

    const newAmountPaid = roundMoney(invoice.amountPaid + safeAmount, invoice.currency);
    const newBalanceDue = roundMoney(Math.max(0, invoice.total - newAmountPaid), invoice.currency);

    const updatedInvoice = await this.saveInvoice({
      ...invoice,
      amountPaid: newAmountPaid,
      balanceDue: newBalanceDue,
      status: newBalanceDue === 0 ? 'PAID' : 'PARTIALLY_PAID'
    });

    return { transaction, invoice: updatedInvoice };
  }

  // ----------------------------------------------------
  // TRANSACTION MANAGEMENT
  // ----------------------------------------------------
  public static async getTransactions(): Promise<PayFlowTransaction[]> {
    const userId = this.getCurrentUserId();
    const stored = getSafeStorage<PayFlowTransaction[]>(
      `${STORAGE_KEYS.TRANSACTIONS}_${userId}`,
      userId === 'default' ? SEED_TRANSACTIONS : []
    );

    try {
      if (db && auth && auth.currentUser) {
        const q = query(
          collection(db, 'microbiz_transactions'),
          where('userId', '==', userId)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const remoteTxns: PayFlowTransaction[] = [];
          snapshot.forEach(docSnap => {
            remoteTxns.push({ id: docSnap.id, ...docSnap.data() } as PayFlowTransaction);
          });
          setSafeStorage(`${STORAGE_KEYS.TRANSACTIONS}_${userId}`, remoteTxns);
          return remoteTxns;
        }
      }
    } catch (err) {
      console.warn('[PayFlowService] Firestore transactions fetch notice:', err);
    }

    return stored;
  }

  public static async recordTransaction(data: Partial<PayFlowTransaction>): Promise<PayFlowTransaction> {
    const userId = this.getCurrentUserId();
    const txnId = data.id || `txn_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
    const nowIso = new Date().toISOString();

    const fullTxn: PayFlowTransaction = {
      id: txnId,
      userId,
      invoiceId: data.invoiceId,
      invoiceNumber: data.invoiceNumber,
      provider: data.provider || 'paypal',
      providerTransactionId: data.providerTransactionId || txnId,
      paypalOrderId: data.paypalOrderId,
      customerName: data.customerName || 'Customer',
      customerEmail: data.customerEmail || 'customer@example.com',
      grossAmount: data.grossAmount || 0,
      feeAmount: data.feeAmount || 0,
      netAmount: data.netAmount || (data.grossAmount || 0),
      currency: data.currency || 'USD',
      status: data.status || 'COMPLETED',
      paymentDate: data.paymentDate || nowIso,
      payerDetails: data.payerDetails,
      gatherGlowEventId: data.gatherGlowEventId,
      notes: data.notes,
      createdAt: nowIso
    };

    const current = await this.getTransactions();
    current.unshift(fullTxn);
    setSafeStorage(`${STORAGE_KEYS.TRANSACTIONS}_${userId}`, current);

    try {
      if (db && auth && auth.currentUser) {
        await setDoc(doc(db, 'microbiz_transactions', txnId), fullTxn);
      }
    } catch (err) {
      console.warn('[PayFlowService] Firestore transaction save notice:', err);
    }

    return fullTxn;
  }

  // ----------------------------------------------------
  // EXPENSES & RECEIPTS
  // ----------------------------------------------------
  public static async getExpenses(): Promise<PayFlowExpense[]> {
    const userId = this.getCurrentUserId();
    const stored = getSafeStorage<PayFlowExpense[]>(
      `${STORAGE_KEYS.EXPENSES}_${userId}`,
      userId === 'default' ? SEED_EXPENSES : []
    );

    try {
      if (db && auth && auth.currentUser) {
        const q = query(
          collection(db, 'microbiz_expenses'),
          where('userId', '==', userId)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const remoteExpenses: PayFlowExpense[] = [];
          snapshot.forEach(docSnap => {
            remoteExpenses.push({ id: docSnap.id, ...docSnap.data() } as PayFlowExpense);
          });
          setSafeStorage(`${STORAGE_KEYS.EXPENSES}_${userId}`, remoteExpenses);
          return remoteExpenses;
        }
      }
    } catch (err) {
      console.warn('[PayFlowService] Firestore expenses fetch notice:', err);
    }

    return stored;
  }

  public static async saveExpense(expenseData: Partial<PayFlowExpense>): Promise<PayFlowExpense> {
    const userId = this.getCurrentUserId();
    const expenseId = expenseData.id || `exp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
    const nowIso = new Date().toISOString();

    const fullExpense: PayFlowExpense = {
      id: expenseId,
      userId,
      merchant: expenseData.merchant || 'Supplier / Merchant',
      category: expenseData.category || 'Operations & Materials',
      date: expenseData.date || nowIso.split('T')[0],
      amount: expenseData.amount || 0,
      taxAmount: expenseData.taxAmount || 0,
      currency: expenseData.currency || 'USD',
      paymentMethod: expenseData.paymentMethod || 'PayPal Commercial Card',
      notes: expenseData.notes,
      receiptUrl: expenseData.receiptUrl,
      isOcrExtracted: Boolean(expenseData.isOcrExtracted),
      ocrConfidence: expenseData.ocrConfidence,
      verifiedByUser: true,
      gatherGlowEventId: expenseData.gatherGlowEventId,
      createdAt: nowIso
    };

    const current = await this.getExpenses();
    const existingIndex = current.findIndex(e => e.id === expenseId);
    if (existingIndex >= 0) {
      current[existingIndex] = fullExpense;
    } else {
      current.unshift(fullExpense);
    }
    setSafeStorage(`${STORAGE_KEYS.EXPENSES}_${userId}`, current);

    try {
      if (db && auth && auth.currentUser) {
        await setDoc(doc(db, 'microbiz_expenses', expenseId), fullExpense);
      }
    } catch (err) {
      console.warn('[PayFlowService] Firestore expense save notice:', err);
    }

    return fullExpense;
  }

  public static async deleteExpense(expenseId: string): Promise<void> {
    const userId = this.getCurrentUserId();
    const current = await this.getExpenses();
    const filtered = current.filter(e => e.id !== expenseId);
    setSafeStorage(`${STORAGE_KEYS.EXPENSES}_${userId}`, filtered);

    try {
      if (db && auth && auth.currentUser) {
        await deleteDoc(doc(db, 'microbiz_expenses', expenseId));
      }
    } catch (err) {
      console.warn('[PayFlowService] Firestore expense delete notice:', err);
    }
  }

  // ----------------------------------------------------
  // GATHER & GLOW CONNECTION BRIDGE
  // ----------------------------------------------------
  public static async importGatherGlowVendorToInvoice(eventData: {
    eventId: string;
    eventTitle: string;
    vendorId: string;
    vendorName: string;
    quotedPrice: number;
    depositPaid?: number;
    currency: string;
    serviceCategory: string;
  }): Promise<PayFlowInvoice> {
    const items = [
      {
        id: `item_${Date.now()}`,
        description: `Gather & Glow [${eventData.eventTitle}] — ${eventData.serviceCategory}: ${eventData.vendorName}`,
        quantity: 1,
        unitPrice: eventData.quotedPrice,
        amount: eventData.quotedPrice
      }
    ];

    return this.saveInvoice({
      customer: {
        name: eventData.vendorName,
        email: 'vendor-contact@gatherglow.org',
        companyName: eventData.vendorName
      },
      items,
      currency: eventData.currency || 'USD',
      amountPaid: eventData.depositPaid || 0,
      gatherGlowEventId: eventData.eventId,
      gatherGlowVendorId: eventData.vendorId,
      notes: `Generated via Gather & Glow Event Bridge for "${eventData.eventTitle}". Linked vendor quotation.`
    });
  }

  // ----------------------------------------------------
  // DASHBOARD METRICS CALCULATION
  // ----------------------------------------------------
  public static calculateDashboardMetrics(
    invoices: PayFlowInvoice[],
    transactions: PayFlowTransaction[],
    expenses: PayFlowExpense[],
    range: DateFilterRange = 'this_month'
  ): PayFlowDashboardMetrics {
    const now = new Date();
    const nowIso = now.toISOString().split('T')[0];

    // Filter items according to date range
    const filterByDate = (dateStr: string): boolean => {
      if (range === 'custom') return true;
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return true;

      if (range === 'this_week') {
        const weekAgo = new Date(now.getTime() - 7 * 86400000);
        return d >= weekAgo && d <= now;
      }
      if (range === 'this_month') {
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }
      if (range === 'last_month') {
        const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
        const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
        return d.getMonth() === lastMonth && d.getFullYear() === year;
      }
      if (range === 'this_quarter') {
        const currentQuarter = Math.floor(now.getMonth() / 3);
        const itemQuarter = Math.floor(d.getMonth() / 3);
        return currentQuarter === itemQuarter && d.getFullYear() === now.getFullYear();
      }
      return true;
    };

    const filteredInvoices = invoices.filter(i => filterByDate(i.issueDate));
    const filteredTxns = transactions.filter(t => filterByDate(t.paymentDate));
    const filteredExpenses = expenses.filter(e => filterByDate(e.date));

    const totalInvoiced = roundMoney(
      filteredInvoices.reduce((sum, i) => sum + (i.total || 0), 0)
    );
    const totalCollected = roundMoney(
      filteredTxns
        .filter(t => t.status === 'COMPLETED')
        .reduce((sum, t) => sum + (t.grossAmount || 0), 0)
    );
    const outstandingBalance = roundMoney(
      filteredInvoices.reduce((sum, i) => sum + (i.balanceDue || 0), 0)
    );

    const overdueInvoices = filteredInvoices.filter(i => 
      i.status === 'OVERDUE' || (i.status === 'PENDING' && i.dueDate < nowIso)
    );
    const overdueBalance = roundMoney(
      overdueInvoices.reduce((sum, i) => sum + (i.balanceDue || 0), 0)
    );

    const totalExpenses = roundMoney(
      filteredExpenses.reduce((sum, e) => sum + (e.amount || 0), 0)
    );
    const netCashFlow = roundMoney(totalCollected - totalExpenses);

    const currency = invoices[0]?.currency || 'USD';

    return {
      totalInvoiced,
      totalCollected,
      outstandingBalance,
      overdueBalance,
      overdueInvoiceCount: overdueInvoices.length,
      paidInvoiceCount: filteredInvoices.filter(i => i.status === 'PAID').length,
      pendingInvoiceCount: filteredInvoices.filter(i => i.status === 'PENDING' || i.status === 'PARTIALLY_PAID').length,
      totalExpenses,
      netCashFlow,
      currency,
      filteredCount: filteredInvoices.length
    };
  }
}
