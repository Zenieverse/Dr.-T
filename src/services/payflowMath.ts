/**
 * PayFlow Decimal-Safe Monetary Arithmetic Engine
 * Eliminates JavaScript IEEE 754 floating-point inaccuracies
 * Compliant with PayPal REST API decimal format specifications
 */

export const ZERO_DECIMAL_CURRENCIES = new Set(['VND', 'JPY', 'KRW', 'CLP', 'PYG', 'UGX']);

/**
 * Returns the currency subunit factor (100 for cents, 1 for zero-decimal currencies like VND)
 */
export function getCurrencySubunitFactor(currency: string): number {
  return ZERO_DECIMAL_CURRENCIES.has(currency.toUpperCase()) ? 1 : 100;
}

/**
 * Rounds an amount to exact decimal precision according to currency rules
 */
export function roundMoney(amount: number, currency: string = 'USD'): number {
  if (isNaN(amount) || !isFinite(amount)) return 0;
  const factor = getCurrencySubunitFactor(currency);
  // Math.round on scaled integer avoids float drift
  return Math.round(amount * factor) / factor;
}

/**
 * Formats a monetary amount into a clean, locale-aware string with currency symbol/code
 */
export function formatMoney(amount: number, currency: string = 'USD', locale: string = 'en-US'): string {
  const safeAmount = roundMoney(amount, currency);
  const isZeroDecimal = ZERO_DECIMAL_CURRENCIES.has(currency.toUpperCase());

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: isZeroDecimal ? 0 : 2,
      maximumFractionDigits: isZeroDecimal ? 0 : 2
    }).format(safeAmount);
  } catch {
    // Fallback if locale or currency code is unrecognized
    const decimals = isZeroDecimal ? 0 : 2;
    return `${currency.toUpperCase()} ${safeAmount.toFixed(decimals)}`;
  }
}

/**
 * Formats amount into PayPal REST API string representation (e.g., "45.00" or "100000")
 */
export function formatPayPalAmountString(amount: number, currency: string = 'USD'): string {
  const safeAmount = roundMoney(amount, currency);
  const isZeroDecimal = ZERO_DECIMAL_CURRENCIES.has(currency.toUpperCase());
  return safeAmount.toFixed(isZeroDecimal ? 0 : 2);
}

export interface LineItemInput {
  quantity: number;
  unitPrice: number;
}

export interface InvoiceCalculations {
  subtotal: number;
  discountAmount: number;
  taxableAmount: number;
  taxAmount: number;
  total: number;
  formattedSubtotal: string;
  formattedDiscount: string;
  formattedTax: string;
  formattedTotal: string;
}

/**
 * Calculates complete invoice totals with strict decimal safety
 */
export function calculateInvoiceTotals(
  items: LineItemInput[],
  discountRatePercent: number = 0,
  taxRatePercent: number = 0,
  currency: string = 'USD'
): InvoiceCalculations {
  const factor = getCurrencySubunitFactor(currency);

  // Compute subtotal by summing items scaled to subunits
  let subtotalSubunits = 0;
  for (const item of items) {
    const qty = Math.max(0, item.quantity || 0);
    const unitPriceSubunits = Math.round((item.unitPrice || 0) * factor);
    subtotalSubunits += Math.round(qty * unitPriceSubunits);
  }

  const subtotal = subtotalSubunits / factor;

  // Discount calculation
  const safeDiscountRate = Math.min(100, Math.max(0, discountRatePercent || 0));
  const discountSubunits = Math.round((subtotalSubunits * safeDiscountRate) / 100);
  const discountAmount = discountSubunits / factor;

  // Net taxable subtotal
  const taxableSubunits = Math.max(0, subtotalSubunits - discountSubunits);
  const taxableAmount = taxableSubunits / factor;

  // Tax calculation
  const safeTaxRate = Math.max(0, taxRatePercent || 0);
  const taxSubunits = Math.round((taxableSubunits * safeTaxRate) / 100);
  const taxAmount = taxSubunits / factor;

  // Grand total
  const totalSubunits = taxableSubunits + taxSubunits;
  const total = totalSubunits / factor;

  return {
    subtotal,
    discountAmount,
    taxableAmount,
    taxAmount,
    total,
    formattedSubtotal: formatMoney(subtotal, currency),
    formattedDiscount: formatMoney(discountAmount, currency),
    formattedTax: formatMoney(taxAmount, currency),
    formattedTotal: formatMoney(total, currency)
  };
}

/**
 * Validates that an incoming payment capture matches the expected invoice total
 * Allows an epsilon of 1 subunit for fractional edge cases
 */
export function validateMonetaryMatch(
  expectedAmount: number,
  receivedAmount: number,
  currency: string = 'USD'
): boolean {
  const factor = getCurrencySubunitFactor(currency);
  const expectedSubunits = Math.round(expectedAmount * factor);
  const receivedSubunits = Math.round(receivedAmount * factor);
  return Math.abs(expectedSubunits - receivedSubunits) <= 1;
}

/**
 * Calculates remaining verified debt with decimal precision
 */
export function calculateRemainingDebt(
  verifiedDebtAmount: number,
  amountPaidToCreditor: number,
  currency: string = 'USD'
): number {
  const factor = getCurrencySubunitFactor(currency);
  const verifiedSubunits = Math.round(Math.max(0, verifiedDebtAmount) * factor);
  const paidSubunits = Math.round(Math.max(0, amountPaidToCreditor) * factor);
  const remainingSubunits = Math.max(0, verifiedSubunits - paidSubunits);
  return remainingSubunits / factor;
}

/**
 * Calculates funded percentage (0 to 100%)
 */
export function calculateDebtFundingPercentage(
  amountFunded: number,
  verifiedDebtAmount: number
): number {
  if (verifiedDebtAmount <= 0) return 0;
  const ratio = (amountFunded / verifiedDebtAmount) * 100;
  return Math.min(100, Math.max(0, Math.round(ratio * 10) / 10));
}

/**
 * Validates a supporter's contribution against the remaining verified balance
 * Prevents overpayments from exceeding remaining obligation
 */
export function validateContributionAmount(
  proposedAmount: number,
  remainingDebt: number,
  currency: string = 'USD'
): { isValid: boolean; maxAllowed: number; error?: string } {
  const factor = getCurrencySubunitFactor(currency);
  const propSubunits = Math.round((proposedAmount || 0) * factor);
  const remSubunits = Math.round(Math.max(0, remainingDebt) * factor);

  if (propSubunits <= 0) {
    return { isValid: false, maxAllowed: remainingDebt, error: 'Contribution amount must be greater than zero.' };
  }

  if (propSubunits > remSubunits) {
    return {
      isValid: false,
      maxAllowed: remSubunits / factor,
      error: `Contribution exceeds remaining verified debt balance of ${formatMoney(remSubunits / factor, currency)}.`
    };
  }

  return { isValid: true, maxAllowed: remSubunits / factor };
}

/**
 * Calculates the platform fee savings delivered to the community (comparing 0% vs standard 5% crowdfunding platforms)
 */
export function calculateZeroFeeSavings(
  totalProcessed: number,
  standardCutPercent: number = 5,
  currency: string = 'USD'
): number {
  return roundMoney((totalProcessed * standardCutPercent) / 100, currency);
}

