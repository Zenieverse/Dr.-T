import React, { FC, useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  Download, 
  PartyPopper, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  ExternalLink,
  ShieldCheck,
  Building2,
  Sparkles
} from 'lucide-react';
import { 
  PayFlowInvoice, 
  PayFlowTransaction, 
  PayFlowExpense, 
  PayFlowBusinessProfile 
} from '../types/payflowTypes';
import { formatMoney, roundMoney } from '../../../services/payflowMath';
import { PayFlowService } from '../services/payflowService';

interface PayFlowReportsViewProps {
  invoices: PayFlowInvoice[];
  transactions: PayFlowTransaction[];
  expenses: PayFlowExpense[];
  profile: PayFlowBusinessProfile;
  setInvoices: React.Dispatch<React.SetStateAction<PayFlowInvoice[]>>;
  currentLanguage?: string;
}

export const PayFlowReportsView: FC<PayFlowReportsViewProps> = ({
  invoices,
  transactions,
  expenses,
  profile,
  setInvoices,
  currentLanguage = 'en'
}) => {
  const isVi = currentLanguage === 'vi';
  const currency = profile.defaultCurrency || 'USD';

  // Financial calculations
  const totalInvoiced = roundMoney(invoices.reduce((sum, i) => sum + i.total, 0), currency);
  const totalPaidRevenue = roundMoney(
    transactions.filter(t => t.status === 'COMPLETED').reduce((sum, t) => sum + t.grossAmount, 0),
    currency
  );
  const totalFees = roundMoney(
    transactions.filter(t => t.status === 'COMPLETED').reduce((sum, t) => sum + t.feeAmount, 0),
    currency
  );
  const netRevenue = roundMoney(totalPaidRevenue - totalFees, currency);

  const totalDeductibleExpenses = roundMoney(
    expenses.reduce((sum, e) => sum + e.amount, 0),
    currency
  );

  const netOperatingIncome = roundMoney(netRevenue - totalDeductibleExpenses, currency);

  // Gather & Glow Linked Records
  const gatherGlowInvoices = invoices.filter(i => !!i.gatherGlowEventId);
  const gatherGlowExpenses = expenses.filter(e => !!e.gatherGlowEventId);

  // Import Gather & Glow Mock Vendor Demo
  const handleImportGatherGlowSample = async () => {
    const imported = await PayFlowService.importGatherGlowVendorToInvoice({
      eventId: 'event_wedding_da_nang',
      eventTitle: 'Golden Hour Garden Celebration',
      vendorId: 'vendor_lotus_sea',
      vendorName: 'Lotus & Sea Artisan Catering',
      quotedPrice: 3200,
      depositPaid: 1600,
      currency: 'USD',
      serviceCategory: 'Artisan Banquet & Botanical Cocktails'
    });

    setInvoices(prev => [imported, ...prev]);
  };

  return (
    <div className="space-y-6">
      {/* Top Statement Header */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-black font-serif text-slate-900">
                {isVi ? 'Báo Cáo Thu Nhập & Điều Hòa Thuế' : 'Financial Statement & Tax Worksheet'}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {isVi 
                ? 'Bảng cân đối thu chi thực tế, khấu trừ thuế và đối soát sự kiện Gather & Glow.' 
                : 'Accrual and cash accounting summary with deductible expense tracking.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Print Statement</span>
            </button>
          </div>
        </div>

        {/* P&L Breakdown Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-2xs uppercase tracking-wider font-bold text-slate-400">Gross Invoiced vs Received</span>
            <div className="text-lg font-bold font-mono text-slate-900">{formatMoney(totalPaidRevenue, currency)}</div>
            <p className="text-2xs text-slate-500">From {formatMoney(totalInvoiced, currency)} invoiced receivables</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-2xs uppercase tracking-wider font-bold text-slate-400">Total Deductible Costs</span>
            <div className="text-lg font-bold font-mono text-rose-700">-{formatMoney(totalDeductibleExpenses, currency)}</div>
            <p className="text-2xs text-slate-500">Across {expenses.length} verified expense receipts</p>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-1">
            <span className="text-2xs uppercase tracking-wider font-bold text-indigo-700">Net Operating Income</span>
            <div className={`text-xl font-black font-mono ${netOperatingIncome >= 0 ? 'text-teal-700' : 'text-rose-700'}`}>
              {netOperatingIncome >= 0 ? '+' : ''}{formatMoney(netOperatingIncome, currency)}
            </div>
            <p className="text-2xs text-indigo-900/70">Estimated taxable business margin</p>
          </div>
        </div>
      </div>

      {/* Gather & Glow Celebration Event Financial Bridge */}
      <div className="bg-gradient-to-r from-amber-900/90 via-amber-950 to-stone-900 rounded-3xl p-6 sm:p-7 text-white shadow-lg space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold">
              <PartyPopper className="w-3.5 h-3.5 text-amber-400" />
              <span>Gather & Glow Event Planning Integration</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-serif text-white">
              Event Vendor Invoicing & Budget Reconciliation
            </h3>
            <p className="text-xs text-amber-200/80 max-w-xl">
              Link celebration vendor quotations directly into PayFlow to track deposits, issue client invoices, and reconcile vendor payments with PayPal.
            </p>
          </div>

          <button
            type="button"
            onClick={handleImportGatherGlowSample}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Bridge Event Quotation to Invoice</span>
          </button>
        </div>

        {/* Linked Records List */}
        <div className="bg-stone-900/60 rounded-2xl p-4 border border-amber-800/50 space-y-3">
          <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
            Connected Event Records ({gatherGlowInvoices.length} invoices, {gatherGlowExpenses.length} expenses)
          </h4>

          {gatherGlowInvoices.length === 0 ? (
            <p className="text-xs text-stone-400 py-3 text-center">
              No Gather & Glow events linked yet. Click "Bridge Event Quotation to Invoice" above to convert a celebration vendor quote.
            </p>
          ) : (
            <div className="divide-y divide-amber-900/40 text-xs">
              {gatherGlowInvoices.map(inv => (
                <div key={inv.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div>
                    <span className="font-bold font-mono text-white">#{inv.invoiceNumber}</span>
                    <span className="text-amber-200/70 ml-2">{inv.customer.name}</span>
                    <p className="text-2xs text-stone-400 mt-0.5">{inv.notes}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold font-mono text-amber-300">{formatMoney(inv.total, inv.currency)}</span>
                    <span className="block text-2xs text-stone-400">Balance: {formatMoney(inv.balanceDue, inv.currency)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
