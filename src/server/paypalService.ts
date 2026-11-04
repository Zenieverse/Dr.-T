/**
 * MicroBiz PayFlow AI — Official PayPal REST API Service
 * Competition: PayPal AI Hackathon 2026
 * Platform: Dr. T by Zenieverse
 * 
 * Compliant with PayPal Orders v2 & Payments v2 REST APIs
 * Documentation: https://developer.paypal.com/docs/api/orders/v2/
 */

import { formatPayPalAmountString, validateMonetaryMatch } from '../services/payflowMath';

export interface PayPalConfigStatus {
  configured: boolean;
  environment: 'sandbox' | 'live';
  clientIdPreview: string;
  hasSecret: boolean;
  hasWebhookId: boolean;
  apiBaseUrl: string;
}

export interface CreateOrderParams {
  invoiceId: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  customerName?: string;
  customerEmail?: string;
  businessName?: string;
  returnUrl?: string;
  cancelUrl?: string;
}

export interface CaptureOrderParams {
  orderId: string;
  invoiceId: string;
  expectedAmount: number;
  expectedCurrency: string;
}

export interface CaptureResult {
  success: boolean;
  orderId: string;
  captureId?: string;
  status: string;
  grossAmount: number;
  feeAmount: number;
  netAmount: number;
  currency: string;
  payerEmail?: string;
  payerName?: string;
  payerId?: string;
  createTime?: string;
  error?: string;
}

export interface WebhookVerificationResult {
  verified: boolean;
  verificationStatus: string;
  reason?: string;
}

class PayPalService {
  private cachedToken: string | null = null;
  private tokenExpiresAt: number = 0;
  // In-memory idempotency cache to prevent duplicate capture of the same PayPal order
  private capturedOrdersCache: Map<string, CaptureResult> = new Map();

  private get environment(): 'sandbox' | 'live' {
    return (process.env.PAYPAL_ENVIRONMENT || 'sandbox').toLowerCase() === 'live' ? 'live' : 'sandbox';
  }

  private get apiBaseUrl(): string {
    return this.environment === 'live' 
      ? 'https://api-m.paypal.com' 
      : 'https://api-m.sandbox.paypal.com';
  }

  private get clientId(): string {
    return process.env.PAYPAL_CLIENT_ID || '';
  }

  private get clientSecret(): string {
    return process.env.PAYPAL_CLIENT_SECRET || '';
  }

  private get webhookId(): string {
    return process.env.PAYPAL_WEBHOOK_ID || '';
  }

  /**
   * Diagnostic summary of PayPal configuration state
   */
  public getConfigStatus(): PayPalConfigStatus {
    const cid = this.clientId;
    const preview = cid ? `${cid.slice(0, 8)}...${cid.slice(-4)}` : 'Not Configured';
    return {
      configured: Boolean(cid && this.clientSecret),
      environment: this.environment,
      clientIdPreview: preview,
      hasSecret: Boolean(this.clientSecret),
      hasWebhookId: Boolean(this.webhookId),
      apiBaseUrl: this.apiBaseUrl
    };
  }

  /**
   * Acquire or return cached OAuth 2.0 Bearer access token
   */
  public async getAccessToken(): Promise<string> {
    if (!this.clientId || !this.clientSecret) {
      throw new Error(
        'PayPal credentials are not configured. Please set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in environment variables.'
      );
    }

    const now = Date.now();
    if (this.cachedToken && this.tokenExpiresAt > now + 60000) {
      return this.cachedToken;
    }

    const authHeader = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    const response = await fetch(`${this.apiBaseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: 'grant_type=client_credentials'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[PayPalService] OAuth token error:', errorText);
      throw new Error(`Failed to obtain PayPal OAuth token (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    this.cachedToken = data.access_token;
    // expires_in is in seconds
    this.tokenExpiresAt = now + ((data.expires_in || 3600) * 1000);
    return this.cachedToken!;
  }

  /**
   * Create PayPal Order (v2) with strict amount and invoice custom identifier
   */
  public async createOrder(params: CreateOrderParams): Promise<{
    orderId: string;
    status: string;
    approveUrl?: string;
  }> {
    const token = await this.getAccessToken();
    const formattedAmount = formatPayPalAmountString(params.amount, params.currency);

    const payload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: params.invoiceId,
          custom_id: params.invoiceId,
          invoice_id: params.invoiceNumber,
          description: `MicroBiz PayFlow Invoice #${params.invoiceNumber}`,
          amount: {
            currency_code: params.currency.toUpperCase(),
            value: formattedAmount
          }
        }
      ],
      application_context: {
        brand_name: params.businessName || 'MicroBiz PayFlow AI',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: params.returnUrl || 'https://ais-dev-4s4jvpipr3mh3mz6x2hpfp-393352619239.asia-southeast1.run.app/?tab=microbiz&subtab=invoices',
        cancel_url: params.cancelUrl || 'https://ais-dev-4s4jvpipr3mh3mz6x2hpfp-393352619239.asia-southeast1.run.app/?tab=microbiz&subtab=invoices'
      }
    };

    const response = await fetch(`${this.apiBaseUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error('[PayPalService] Create Order failed:', errBody);
      throw new Error(`PayPal Create Order error (${response.status}): ${errBody}`);
    }

    const orderData = await response.json();
    const approveLink = orderData.links?.find((l: any) => l.rel === 'approve')?.href;

    return {
      orderId: orderData.id,
      status: orderData.status,
      approveUrl: approveLink
    };
  }

  /**
   * Authoritative Server-Side Payment Capture
   * Validates amount, currency, prevents duplicate capture, and returns fee/net breakdowns
   */
  public async captureOrder(params: CaptureOrderParams): Promise<CaptureResult> {
    // 1. Idempotency Check: Prevent duplicate capture
    if (this.capturedOrdersCache.has(params.orderId)) {
      console.log(`[PayPalService] Returning idempotent cached capture for order ${params.orderId}`);
      return this.capturedOrdersCache.get(params.orderId)!;
    }

    const token = await this.getAccessToken();

    const response = await fetch(`${this.apiBaseUrl}/v2/checkout/orders/${params.orderId}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'PayPal-Request-Id': `capture_${params.orderId}`
      }
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error('[PayPalService] Capture Order failed:', errBody);
      return {
        success: false,
        orderId: params.orderId,
        status: 'FAILED',
        grossAmount: 0,
        feeAmount: 0,
        netAmount: 0,
        currency: params.expectedCurrency,
        error: `Capture failed (${response.status}): ${errBody}`
      };
    }

    const data = await response.json();
    const purchaseUnit = data.purchase_units?.[0];
    const capture = purchaseUnit?.payments?.captures?.[0];

    if (!capture) {
      return {
        success: false,
        orderId: params.orderId,
        status: data.status || 'UNKNOWN',
        grossAmount: 0,
        feeAmount: 0,
        netAmount: 0,
        currency: params.expectedCurrency,
        error: 'No payment capture details found in PayPal response'
      };
    }

    const grossValue = parseFloat(capture.amount?.value || '0');
    const currency = capture.amount?.currency_code || params.expectedCurrency;
    const feeValue = parseFloat(capture.seller_receivable_breakdown?.paypal_fee?.value || '0');
    const netValue = parseFloat(capture.seller_receivable_breakdown?.net_amount?.value || (grossValue - feeValue).toString());

    // 2. Strict Server-Side Validation: Ensure captured amount and currency match invoice
    const isAmountValid = validateMonetaryMatch(params.expectedAmount, grossValue, currency);
    const isCurrencyValid = currency.toUpperCase() === params.expectedCurrency.toUpperCase();

    if (!isAmountValid || !isCurrencyValid) {
      const mismatchMsg = `Amount or currency mismatch: Expected ${params.expectedAmount} ${params.expectedCurrency}, received ${grossValue} ${currency}`;
      console.error('[PayPalService] Security Alert:', mismatchMsg);
      return {
        success: false,
        orderId: params.orderId,
        captureId: capture.id,
        status: 'AMOUNT_MISMATCH',
        grossAmount: grossValue,
        feeAmount: feeValue,
        netAmount: netValue,
        currency,
        error: mismatchMsg
      };
    }

    const payer = data.payer || {};
    const payerName = [payer.name?.given_name, payer.name?.surname].filter(Boolean).join(' ');

    const result: CaptureResult = {
      success: capture.status === 'COMPLETED',
      orderId: params.orderId,
      captureId: capture.id,
      status: capture.status,
      grossAmount: grossValue,
      feeAmount: feeValue,
      netAmount: netValue,
      currency,
      payerEmail: payer.email_address,
      payerName: payerName || undefined,
      payerId: payer.payer_id,
      createTime: capture.create_time || new Date().toISOString()
    };

    // Cache to prevent duplicate capture
    if (result.success) {
      this.capturedOrdersCache.set(params.orderId, result);
    }

    return result;
  }

  /**
   * Cryptographic Webhook Signature Verification
   * Authenticates that webhooks legitimately originated from PayPal
   */
  public async verifyWebhookSignature(
    headers: Record<string, string | undefined>,
    rawBody: any
  ): Promise<WebhookVerificationResult> {
    if (!this.webhookId) {
      return {
        verified: false,
        verificationStatus: 'NOT_CONFIGURED',
        reason: 'PAYPAL_WEBHOOK_ID is not configured in server environment'
      };
    }

    const authAlgo = headers['paypal-auth-algo'];
    const certUrl = headers['paypal-cert-url'];
    const transmissionId = headers['paypal-transmission-id'];
    const transmissionSig = headers['paypal-transmission-sig'];
    const transmissionTime = headers['paypal-transmission-time'];

    if (!authAlgo || !certUrl || !transmissionId || !transmissionSig || !transmissionTime) {
      return {
        verified: false,
        verificationStatus: 'MISSING_HEADERS',
        reason: 'Required PayPal webhook transmission headers are missing'
      };
    }

    try {
      const token = await this.getAccessToken();
      const verificationPayload = {
        auth_algo: authAlgo,
        cert_url: certUrl,
        transmission_id: transmissionId,
        transmission_sig: transmissionSig,
        transmission_time: transmissionTime,
        webhook_id: this.webhookId,
        webhook_event: typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody
      };

      const response = await fetch(`${this.apiBaseUrl}/v1/notifications/verify-webhook-signature`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(verificationPayload)
      });

      if (!response.ok) {
        return {
          verified: false,
          verificationStatus: 'VERIFICATION_CALL_FAILED',
          reason: `PayPal verification API returned HTTP ${response.status}`
        };
      }

      const resJson = await response.json();
      return {
        verified: resJson.verification_status === 'SUCCESS',
        verificationStatus: resJson.verification_status,
        reason: resJson.verification_status === 'SUCCESS' ? undefined : 'Signature did not match'
      };
    } catch (err: any) {
      console.error('[PayPalService] Webhook verification error:', err);
      return {
        verified: false,
        verificationStatus: 'ERROR',
        reason: err?.message || 'Internal verification exception'
      };
    }
  }

  /**
   * Refund a captured payment
   */
  public async refundCapture(
    captureId: string,
    amount?: number,
    currency?: string,
    noteToPayer?: string
  ): Promise<{ success: boolean; refundId?: string; status?: string; error?: string }> {
    const token = await this.getAccessToken();

    const payload: any = {};
    if (amount && currency) {
      payload.amount = {
        value: formatPayPalAmountString(amount, currency),
        currency_code: currency.toUpperCase()
      };
    }
    if (noteToPayer) {
      payload.note_to_payer = noteToPayer;
    }

    const response = await fetch(`${this.apiBaseUrl}/v2/payments/captures/${captureId}/refund`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: Object.keys(payload).length > 0 ? JSON.stringify(payload) : undefined
    });

    if (!response.ok) {
      const errText = await response.text();
      return {
        success: false,
        error: `Refund failed (${response.status}): ${errText}`
      };
    }

    const refundData = await response.json();
    return {
      success: refundData.status === 'COMPLETED' || refundData.status === 'PENDING',
      refundId: refundData.id,
      status: refundData.status
    };
  }
}

export const paypalService = new PayPalService();
