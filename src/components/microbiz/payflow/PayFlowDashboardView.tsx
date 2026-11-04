import React, { FC } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight, 
  PlusCircle, 
  Sparkles, 
  FileText, 
  CreditCard, 
  Receipt, 
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { 
  PayFlowInvoice, 
  PayFlowTransaction, 
  PayFlowExpense, 
  PayFlowBusinessProfile, 
  DateFilterRange, 
  PayFlowDashboardMetrics, 
  PayFlowSubTab 
} from '../types/payflowTypes';
import { formatMoney } from '../../../services/payflowMath';

interface PayFlowDashboardViewProps {
  metrics: PayFlowDashboardMetrics;
  invoices: PayFlowInvoice[];
  transactions: PayFlowTransaction[];
  expenses: PayFlowExpense[];
  profile: PayFlowBusinessProfile;
  dateRange: DateFilterRange;
  setDateRange: (range: DateFilterRange) => void;
  setActiveSubTab: (tab: PayFlowSubTab) => void;
  onOpenCreateInvoice: () => void;
  currentLanguage?: string;
}

export const PayFlowDashboardView: FC<PayFlowDashboardViewProps> = ({
  metrics,
  invoices,
  transactions,
  expenses,
  profile,
  dateRange,
  setDateRange,
  setActiveSubTab,
  onOpenCreateInvoice,
  currentLanguage = 'en'
}) => {
  const isVi = currentLanguage === 'vi';
  const currency = metrics.currency || 'USD';

  const overdueInvoices = invoices.filter(i => i.status === 'OVERDUE');
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner & Quick Controls */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 bottom-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>PayPal AI Hackathon 2026 • PayFlow Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-serif tracking-tight text-white">
              {profile.businessName || 'Business Command Center'}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {isVi 
                ? 'Trung tâm tài chính thông minh: Tự động hóa hóa đơn, xử lý thanh toán PayPal và điều phối dòng tiền bằng AI.'
                : 'Intelligent business operations: Seamless invoice lifecycles, PayPal Checkout, expense reconciliation, and AI cash flow intelligence.'}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onOpenCreateInvoice}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isVi ? '+ Tạo Hóa Đơn Mới' : '+ New Invoice'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('ai-assistant')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white font-semibold text-xs sm:text-sm backdrop-blur-md border border-indigo-400/30 flex items-center gap-2 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-indigo-300" />
              <span>{isVi ? 'Trợ Lý Tài Chính AI' : 'PayFlow AI Copilot'}</span>
            </button>
          </div>
        </div>

        {/* Date Filter Bar */}
        <div className="mt-8 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400 font-medium">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>{isVi ? 'Kỳ Báo Cáo:' : 'Reporting Window:'}</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-800/60 rounded-xl border border-slate-700/60">
            {(['this_week', 'this_month', 'last_month', 'this_quarter', 'custom'] as DateFilterRange[]).map((rng) => {
              const labels: Record<DateFilterRange, { en: string; vi: string }> = {
                this_week: { en: 'This Week', vi: 'Tuần này' },
                this_month: { en: 'This Month', vi: 'Tháng này' },
                last_month: { en: 'Last Month', vi: 'Tháng trước' },
                this_quarter: { en: 'This Quarter', vi: 'Quý này' },
                custom: { en: 'All Time', vi: 'Toàn bộ' }
              };
              const active = dateRange === rng;
              return (
                <button
                  key={rng}
                  type="button"
                  onClick={() => setDateRange(rng)}
                  className={`px-3 py-1 rounded-lg font-medium text-xs transition cursor-pointer ${
                    active 
                      ? 'bg-indigo-600 text-white shadow-xs' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isVi ? labels[rng].vi : labels[rng].en}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Overdue Alert Banner if Any */}
      {metrics.overdueInvoiceCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-700 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-amber-950 font-serif">
                {isVi 
                  ? `Có ${metrics.overdueInvoiceCount} hóa đơn quá hạn chưa thu (${formatMoney(metrics.overdueBalance, currency)})` 
                  : `${metrics.overdueInvoiceCount} invoice(s) are overdue (${formatMoney(metrics.overdueBalance, currency)})`}
              </h4>
              <p className="text-xs text-amber-800">
                {isVi 
                  ? 'Sử dụng PayFlow AI để tự động soạn email nhắc nhở thanh toán lịch sự gửi đến khách hàng.' 
                  : 'Use PayFlow AI to draft gentle payment reminder follow-ups with instant PayPal links.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveSubTab('invoices')}
            className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 transition cursor-pointer"
          >
            {isVi ? 'Xem Hóa Đơn Quá Hạn' : 'Review Overdue'}
          </button>
        </div>
      )}

      {/* Main KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Invoiced */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>{isVi ? 'Tổng Đã Xuất' : 'Total Invoiced'}</span>
            <FileText className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black font-serif text-slate-900">
            {formatMoney(metrics.totalInvoiced, currency)}
          </div>
          <div className="text-2xs text-slate-500 flex items-center justify-between">
            <span>{metrics.filteredCount} {isVi ? 'hóa đơn' : 'invoices recorded'}</span>
            <span className="text-indigo-600 font-medium">{metrics.paidInvoiceCount} {isVi ? 'đã trả' : 'paid'}</span>
          </div>
        </div>

        {/* Card 2: Total Collected */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>{isVi ? 'Đã Thu (PayPal & Offline)' : 'Total Paid / Collected'}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black font-serif text-emerald-700">
            {formatMoney(metrics.totalCollected, currency)}
          </div>
          <div className="text-2xs text-slate-500 flex items-center justify-between">
            <span>{isVi ? 'Đã thanh toán thực tế' : 'Authoritative settlements'}</span>
            <span className="text-emerald-700 font-semibold">{metrics.paidInvoiceCount} {isVi ? 'đơn' : 'settled'}</span>
          </div>
        </div>

        {/* Card 3: Outstanding Receivables */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>{isVi ? 'Còn Phải Thu' : 'Outstanding Balance'}</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black font-serif text-amber-700">
            {formatMoney(metrics.outstandingBalance, currency)}
          </div>
          <div className="text-2xs text-slate-500 flex items-center justify-between">
            <span>{isVi ? 'Đang chờ thanh toán' : 'Pending & partial balance'}</span>
            <span className="text-amber-700 font-semibold">{metrics.pendingInvoiceCount} {isVi ? 'đơn chờ' : 'pending'}</span>
          </div>
        </div>

        {/* Card 4: Net Cash Flow */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>{isVi ? 'Dòng Tiền Thuần' : 'Net Cash Flow'}</span>
            {metrics.netCashFlow >= 0 ? (
              <TrendingUp className="w-4 h-4 text-teal-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-rose-600" />
            )}
          </div>
          <div className={`text-2xl font-black font-serif ${metrics.netCashFlow >= 0 ? 'text-teal-700' : 'text-rose-700'}`}>
            {metrics.netCashFlow >= 0 ? '+' : ''}{formatMoney(metrics.netCashFlow, currency)}
          </div>
          <div className="text-2xs text-slate-500 flex items-center justify-between">
            <span>{isVi ? 'Chi phí' : 'Expenses'}: {formatMoney(metrics.totalExpenses, currency)}</span>
            <span className={`font-semibold ${metrics.netCashFlow >= 0 ? 'text-teal-700' : 'text-rose-700'}`}>
              {metrics.netCashFlow >= 0 ? 'Healthy' : 'Deficit'}
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Transactions + AI Quick Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Payment Activity (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-slate-900 font-serif text-sm sm:text-base">
                {isVi ? 'Hoạt Động Thanh Toán Gần Đây' : 'Recent Payment Activity'}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setActiveSubTab('transactions')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition cursor-pointer"
            >
              <span>{isVi ? 'Xem Toàn Bộ' : 'View All'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentTransactions.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs space-y-2">
              <CreditCard className="w-8 h-8 mx-auto text-slate-300" />
              <p>{isVi ? 'Chưa có giao dịch thanh toán nào được ghi nhận.' : 'No transactions recorded in this period yet.'}</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentTransactions.map((txn) => (
                <div key={txn.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 font-sans">{txn.customerName}</p>
                      <p className="text-2xs text-slate-400">
                        {txn.invoiceNumber ? `Invoice #${txn.invoiceNumber}` : 'Direct Payment'} • {new Date(txn.paymentDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-emerald-700 font-mono">
                      +{formatMoney(txn.grossAmount, txn.currency)}
                    </p>
                    <span className="px-2 py-0.5 rounded-full text-2xs font-semibold bg-emerald-50 text-emerald-800 uppercase font-mono">
                      {txn.provider}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: AI Financial Guidance Card */}
        <div className="bg-gradient-to-br from-indigo-50/70 via-white to-slate-50 rounded-2xl border border-indigo-100 p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-indigo-700">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold font-serif text-sm">
                {isVi ? 'Lời Khuyên Dòng Tiền AI' : 'AI Financial Insight'}
              </h3>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              {metrics.overdueInvoiceCount > 0
                ? (isVi
                    ? `Bạn có ${metrics.overdueInvoiceCount} hóa đơn quá hạn. Dòng tiền tuần này có thể tăng thêm ${formatMoney(metrics.overdueBalance, currency)} nếu gửi lời nhắc thanh toán PayPal qua email.`
                    : `You have ${metrics.overdueInvoiceCount} past due invoice(s). Recovering them will inject ${formatMoney(metrics.overdueBalance, currency)} back into your operating cash balance.`)
                : (isVi
                    ? `Dòng tiền của bạn đang ở trạng thái tốt với +${formatMoney(metrics.netCashFlow, currency)} thặng dư thuần. Bạn có thể trích 15% vào quỹ dự phòng kinh doanh.`
                    : `Your business has a healthy operating margin of +${formatMoney(metrics.netCashFlow, currency)}. Consider reserving 15-20% for upcoming tax obligations.`)}
            </p>

            <div className="p-3 rounded-xl bg-white border border-indigo-200/80 shadow-2xs space-y-1.5 text-2xs text-slate-600">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span>{isVi ? 'Tỷ Lệ Thu Hồi' : 'Collection Ratio'}</span>
                <span className="text-indigo-600">
                  {metrics.totalInvoiced > 0
                    ? `${Math.round((metrics.totalCollected / metrics.totalInvoiced) * 100)}%`
                    : '100%'}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 rounded-full"
                  style={{
                    width: `${metrics.totalInvoiced > 0 ? Math.min(100, Math.round((metrics.totalCollected / metrics.totalInvoiced) * 100)) : 100}%`
                  }}
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveSubTab('ai-assistant')}
            className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isVi ? 'Trò Chuyện Với Trợ Lý AI' : 'Open Financial Assistant'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
