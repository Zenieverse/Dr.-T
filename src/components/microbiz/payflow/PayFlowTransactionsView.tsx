import React, { FC, useState, useMemo } from 'react';
import { 
  CreditCard, 
  Search, 
  Download, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowUpRight, 
  Calendar, 
  FileText, 
  Sparkles,
  ExternalLink,
  DollarSign
} from 'lucide-react';
import { PayFlowTransaction, PayFlowBusinessProfile } from '../types/payflowTypes';
import { formatMoney } from '../../../services/payflowMath';

interface PayFlowTransactionsViewProps {
  transactions: PayFlowTransaction[];
  profile: PayFlowBusinessProfile;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  currentLanguage?: string;
}

export const PayFlowTransactionsView: FC<PayFlowTransactionsViewProps> = ({
  transactions,
  profile,
  searchQuery,
  setSearchQuery,
  currentLanguage = 'en'
}) => {
  const isVi = currentLanguage === 'vi';
  const [providerFilter, setProviderFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(txn => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery ||
        txn.providerTransactionId.toLowerCase().includes(q) ||
        txn.customerName.toLowerCase().includes(q) ||
        txn.customerEmail.toLowerCase().includes(q) ||
        (txn.invoiceNumber && txn.invoiceNumber.toLowerCase().includes(q));

      const matchesProvider = providerFilter === 'ALL' || txn.provider === providerFilter;
      const matchesStatus = statusFilter === 'ALL' || txn.status === statusFilter;

      return matchesSearch && matchesProvider && matchesStatus;
    });
  }, [transactions, searchQuery, providerFilter, statusFilter]);

  // Aggregate totals
  const totalGross = filteredTransactions
    .filter(t => t.status === 'COMPLETED')
    .reduce((sum, t) => sum + t.grossAmount, 0);

  const totalFees = filteredTransactions
    .filter(t => t.status === 'COMPLETED')
    .reduce((sum, t) => sum + t.feeAmount, 0);

  const totalNet = filteredTransactions
    .filter(t => t.status === 'COMPLETED')
    .reduce((sum, t) => sum + t.netAmount, 0);

  const currency = transactions[0]?.currency || profile.defaultCurrency || 'USD';

  // Export CSV
  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) return;

    const headers = ['Transaction ID', 'Invoice #', 'Customer Name', 'Customer Email', 'Provider', 'Gross Amount', 'Fee', 'Net Amount', 'Currency', 'Status', 'Date', 'Notes'];
    const rows = filteredTransactions.map(t => [
      t.providerTransactionId,
      t.invoiceNumber || '',
      `"${t.customerName.replace(/"/g, '""')}"`,
      t.customerEmail,
      t.provider,
      t.grossAmount,
      t.feeAmount,
      t.netAmount,
      t.currency,
      t.status,
      t.paymentDate,
      `"${(t.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PayFlow_Transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Ledger Header with Export & Filter */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isVi ? 'Tìm theo mã giao dịch, khách hàng, số hóa đơn...' : 'Search transaction ID, customer, invoice #...'}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCSV}
              disabled={filteredTransactions.length === 0}
              className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer disabled:opacity-40"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isVi ? 'Xuất Báo Cáo CSV' : 'Export CSV'}</span>
            </button>
          </div>
        </div>

        {/* Filters & Aggregate Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-medium">Provider:</span>
            {['ALL', 'paypal', 'bank_transfer', 'offline_cash'].map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setProviderFilter(p)}
                className={`px-2.5 py-1 rounded-lg text-2xs font-semibold uppercase transition cursor-pointer ${
                  providerFilter === p
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Quick Net Settlement Tally */}
          <div className="flex items-center gap-4 font-mono text-2xs">
            <div>
              <span className="text-slate-400">Gross:</span>{' '}
              <strong className="text-slate-900">{formatMoney(totalGross, currency)}</strong>
            </div>
            <div>
              <span className="text-slate-400">Fees:</span>{' '}
              <strong className="text-rose-600">-{formatMoney(totalFees, currency)}</strong>
            </div>
            <div>
              <span className="text-slate-400">Net Settled:</span>{' '}
              <strong className="text-emerald-700 font-bold">{formatMoney(totalNet, currency)}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs space-y-2">
            <CreditCard className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-bold text-slate-700">No transactions recorded</p>
            <p>Settled PayPal payments and recorded offline receipts will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-2xs uppercase tracking-wider text-slate-500 font-semibold">
                <tr>
                  <th className="py-3 px-4">Transaction Ref</th>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Provider</th>
                  <th className="py-3 px-4">Gross Amount</th>
                  <th className="py-3 px-4">Fee</th>
                  <th className="py-3 px-4">Net Settled</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.map(txn => (
                  <tr key={txn.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4 font-bold font-mono text-slate-900">
                      {txn.providerTransactionId}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">
                      {txn.invoiceNumber ? `#${txn.invoiceNumber}` : '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-900">{txn.customerName}</p>
                      <p className="text-2xs text-slate-400">{txn.customerEmail}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-2xs font-bold uppercase font-mono ${
                        txn.provider === 'paypal' 
                          ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {txn.provider}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold font-mono text-slate-900">
                      {formatMoney(txn.grossAmount, txn.currency)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-rose-600">
                      {txn.feeAmount > 0 ? `-${formatMoney(txn.feeAmount, txn.currency)}` : '$0.00'}
                    </td>
                    <td className="py-3.5 px-4 font-bold font-mono text-emerald-700">
                      +{formatMoney(txn.netAmount, txn.currency)}
                    </td>
                    <td className="py-3.5 px-4 text-2xs text-slate-500 whitespace-nowrap">
                      {new Date(txn.paymentDate).toLocaleDateString()} {new Date(txn.paymentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-2xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Completed</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
