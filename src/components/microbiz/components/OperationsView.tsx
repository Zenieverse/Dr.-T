import { FC, useState } from 'react';
import { FinancialRecord, InvoiceDocument, InvoiceLineItem, MicroBizProfile } from '../types/microbizTypes';
import { INITIAL_FINANCIAL_RECORDS } from '../data/initialMicroBizData';
import { MicroBizService } from '../services/microbizService';
import { 
  Calculator, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Download, 
  Trash2, 
  FileText, 
  Check, 
  ScanLine, 
  X,
  CreditCard,
  DollarSign,
  TrendingUp,
  Receipt,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface OperationsViewProps {
  records?: FinancialRecord[];
  searchQuery: string;
  currentLanguage?: string;
  currentUser?: MicroBizProfile;
  isAuthenticated?: boolean;
  onOpenScanner?: () => void;
}

export const OperationsView: FC<OperationsViewProps> = ({
  records: initialRecords = INITIAL_FINANCIAL_RECORDS,
  searchQuery,
  currentLanguage = 'en',
  currentUser,
  isAuthenticated = false,
  onOpenScanner
}) => {
  const isVi = currentLanguage === 'vi';
  const [records, setRecords] = useState<FinancialRecord[]>(initialRecords);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  
  // New Transaction Form Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [transType, setTransType] = useState<'income' | 'expense'>('expense');
  const [transCategory, setTransCategory] = useState('Raw Materials');
  const [transAmount, setTransAmount] = useState<number>(150000);
  const [transCurrency, setTransCurrency] = useState('VND');
  const [transCounterparty, setTransCounterparty] = useState('');
  const [transPaymentMethod, setTransPaymentMethod] = useState<'Cash' | 'Bank Transfer' | 'Momo / ZaloPay'>('Cash');
  const [transDescription, setTransDescription] = useState('');
  const [transDate, setTransDate] = useState(new Date().toISOString().slice(0, 10));

  // Invoice & Quote Generator Modal
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invCustomerName, setInvCustomerName] = useState('Organic Corner Cafe');
  const [invCustomerContact, setInvCustomerContact] = useState('contact@organiccorner.vn');
  const [invItems, setInvItems] = useState<InvoiceLineItem[]>([
    { id: '1', description: 'Batch 1 Handcrafted Botanical Soap Favors', quantity: 20, unitPrice: 45000, amount: 900000 },
    { id: '2', description: 'Recycled Kraft Box Packaging with Twine', quantity: 20, unitPrice: 5000, amount: 100000 },
  ]);
  const [invDiscount, setInvDiscount] = useState<number>(0);
  const [invTax, setInvTax] = useState<number>(0);
  const [isQuoteCopied, setIsQuoteCopied] = useState(false);

  // Filtered records
  const filteredRecords = records.filter(r => {
    const matchesSearch = !searchQuery ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.counterparty.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === 'all' || r.type === filterType;

    return matchesSearch && matchesType;
  });

  // Calculate totals
  const totalIncome = records.filter(r => r.type === 'income').reduce((sum, r) => sum + r.amount, 0);
  const totalExpense = records.filter(r => r.type === 'expense').reduce((sum, r) => sum + r.amount, 0);
  const netCashFlow = totalIncome - totalExpense;

  const handleCreateTransaction = async () => {
    if (!transDescription.trim() || transAmount <= 0) return;

    const effectiveUserId = isAuthenticated && currentUser ? currentUser.id : MicroBizService.getCurrentUserId();

    const newRecord = await MicroBizService.addFinancialRecord({
      userId: effectiveUserId,
      type: transType,
      category: transCategory,
      amount: transAmount,
      currency: transCurrency,
      counterparty: transCounterparty.trim() || (transType === 'income' ? 'Direct Customer' : 'Local Supplier'),
      date: transDate,
      paymentMethod: transPaymentMethod,
      description: transDescription.trim()
    });

    setRecords([newRecord, ...records]);
    setIsAddModalOpen(false);
    setTransDescription('');
  };

  const handleDeleteRecord = async (id: string) => {
    const updated = await MicroBizService.deleteFinancialRecord(id);
    setRecords(updated);
  };

  const handleExportCsv = () => {
    const csvContent = MicroBizService.exportFinancesCsv(records);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `microbiz_finances_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Invoice calculations
  const invoiceSubtotal = invItems.reduce((sum, i) => sum + i.amount, 0);
  const invoiceTotal = invoiceSubtotal - invDiscount + invTax;

  const handleAddInvoiceItem = () => {
    setInvItems([...invItems, {
      id: `it_${Date.now()}`,
      description: 'New product or service line',
      quantity: 1,
      unitPrice: 50000,
      amount: 50000
    }]);
  };

  const handleUpdateInvoiceItem = (id: string, field: 'description' | 'quantity' | 'unitPrice', val: any) => {
    setInvItems(invItems.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: val };
        updated.amount = updated.quantity * updated.unitPrice;
        return updated;
      }
      return item;
    }));
  };

  const handleRemoveInvoiceItem = (id: string) => {
    if (invItems.length <= 1) return;
    setInvItems(invItems.filter(i => i.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Top Ledger Status & Payment Policy Disclosure Banner */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-black text-slate-900 font-serif">
                {isVi ? 'Sổ Thu Chi & Dòng Tiền Thực Tế' : 'Operations & Everyday Bookkeeping Ledger'}
              </h2>
              {isAuthenticated && currentUser ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Cloud Synced ({currentUser.name})
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-100 text-slate-600 border border-slate-200 font-bold">
                  Guest Sandbox (Local Storage)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              {isVi 
                ? 'Ghi chép dòng tiền thực tế của bạn. Cổng thanh toán thẻ tự động bị tắt để đảm bảo minh bạch.' 
                : 'Itemized manual transactions and OCR receipts. Automated online payment processing is strictly disabled.'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            type="button"
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>
          <button
            type="button"
            onClick={() => setIsInvoiceModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold transition flex items-center space-x-1.5 border border-teal-200 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{isVi ? 'Tạo Báo Giá' : 'New Quote'}</span>
          </button>
          {onOpenScanner && (
            <button
              type="button"
              onClick={onOpenScanner}
              className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition flex items-center space-x-1.5 border border-emerald-200 cursor-pointer"
            >
              <ScanLine className="w-3.5 h-3.5" />
              <span>{isVi ? 'Quét HĐ' : 'Scan Doc'}</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isVi ? 'Ghi Giao Dịch' : 'Log Transaction'}</span>
          </button>
        </div>
      </div>

      {/* Financial Health Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Income Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500">
            <span>{isVi ? 'Tổng Thu Nhập' : 'Total Income'}</span>
            <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {totalIncome.toLocaleString()} VND
          </div>
          <p className="text-[11px] text-emerald-700 font-mono">
            +{records.filter(r => r.type === 'income').length} {isVi ? 'khoản thu' : 'recorded sales'}
          </p>
        </div>

        {/* Expense Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500">
            <span>{isVi ? 'Tổng Chi Phí' : 'Total Expenses'}</span>
            <div className="w-7 h-7 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {totalExpense.toLocaleString()} VND
          </div>
          <p className="text-[11px] text-rose-700 font-mono">
            -{records.filter(r => r.type === 'expense').length} {isVi ? 'khoản chi' : 'material costs'}
          </p>
        </div>

        {/* Net Flow Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500">
            <span>{isVi ? 'Dòng Tiền Thuần' : 'Net Cash Margin'}</span>
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${netCashFlow >= 0 ? 'bg-teal-100 text-teal-800' : 'bg-amber-100 text-amber-800'}`}>
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-black font-mono ${netCashFlow >= 0 ? 'text-teal-900' : 'text-amber-900'}`}>
            {netCashFlow.toLocaleString()} VND
          </div>
          <p className="text-[11px] text-slate-500 font-mono">
            {netCashFlow >= 0 ? (isVi ? 'Thặng dư an toàn' : 'Healthy operating surplus') : (isVi ? 'Cần bù đắp chi phí' : 'Deficit / Needs capital')}
          </p>
        </div>
      </div>

      {/* Ledger Table Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 font-serif text-sm">
              {isVi ? 'Nhật Ký Giao Dịch Chi Tiết' : 'Itemized Transaction Ledger'}
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              {filteredRecords.length} {isVi ? 'bản ghi hiển thị' : 'records displayed'}
            </p>
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-2xl text-xs font-medium">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-xl transition cursor-pointer ${filterType === 'all' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'}`}
            >
              {isVi ? 'Tất cả' : 'All'}
            </button>
            <button
              type="button"
              onClick={() => setFilterType('income')}
              className={`px-3 py-1 rounded-xl transition cursor-pointer ${filterType === 'income' ? 'bg-white text-emerald-800 shadow-2xs font-bold' : 'text-slate-600'}`}
            >
              {isVi ? 'Thu nhập' : 'Income'}
            </button>
            <button
              type="button"
              onClick={() => setFilterType('expense')}
              className={`px-3 py-1 rounded-xl transition cursor-pointer ${filterType === 'expense' ? 'bg-white text-rose-800 shadow-2xs font-bold' : 'text-slate-600'}`}
            >
              {isVi ? 'Chi phí' : 'Expenses'}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-mono text-[11px]">
              <tr>
                <th className="py-3 px-4">{isVi ? 'Ngày' : 'Date'}</th>
                <th className="py-3 px-4">{isVi ? 'Loại' : 'Type'}</th>
                <th className="py-3 px-4">{isVi ? 'Mô tả & Nguồn' : 'Description'}</th>
                <th className="py-3 px-4">{isVi ? 'Danh mục' : 'Category'}</th>
                <th className="py-3 px-4">{isVi ? 'Hình thức' : 'Method'}</th>
                <th className="py-3 px-4 text-right">{isVi ? 'Số tiền' : 'Amount'}</th>
                <th className="py-3 px-4 text-center">{isVi ? 'Xóa' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans text-slate-700">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((rec) => {
                  const isIncome = rec.type === 'income';
                  return (
                    <tr key={rec.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                        {rec.date}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                          isIncome 
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}>
                          {isIncome ? '+ Thu' : '- Chi'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{rec.description}</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {rec.counterparty}
                          {rec.isOcrExtracted && (
                            <span className="ml-2 text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded text-[9px]">
                              OCR Scanned
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {rec.category}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">
                        {rec.paymentMethod}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold whitespace-nowrap">
                        <span className={isIncome ? 'text-emerald-700' : 'text-rose-700'}>
                          {isIncome ? '+' : '-'}{rec.amount.toLocaleString()} {rec.currency}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteRecord(rec.id)}
                          className="p-1 text-slate-300 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                          title="Delete entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-mono">
                    {isVi ? 'Không tìm thấy giao dịch nào phù hợp.' : 'No matching transactions found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: LOG TRANSACTION */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 font-serif">
                {isVi ? 'Ghi Giao Dịch Mới Vào Sổ' : 'Record New Transaction'}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-xl bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Type Switcher */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setTransType('income')}
                className={`py-2 rounded-xl transition cursor-pointer ${transType === 'income' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'}`}
              >
                + Thu Nhập (Income)
              </button>
              <button
                type="button"
                onClick={() => setTransType('expense')}
                className={`py-2 rounded-xl transition cursor-pointer ${transType === 'expense' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600'}`}
              >
                - Chi Phí (Expense)
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-mono text-slate-500 font-bold">{isVi ? 'Mô Tả Giao Dịch' : 'Description'}</label>
                <input
                  type="text"
                  value={transDescription}
                  onChange={(e) => setTransDescription(e.target.value)}
                  placeholder="e.g. Bán 5 thanh xà phòng, Mua tre thô Bến Tre..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-mono text-slate-500 font-bold">{isVi ? 'Số Tiền' : 'Amount'}</label>
                  <input
                    type="number"
                    value={transAmount}
                    onChange={(e) => setTransAmount(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-slate-500 font-bold">{isVi ? 'Đơn Vị' : 'Currency'}</label>
                  <select
                    value={transCurrency}
                    onChange={(e) => setTransCurrency(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  >
                    <option value="VND">VND</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-mono text-slate-500 font-bold">{isVi ? 'Danh Mục' : 'Category'}</label>
                  <input
                    type="text"
                    value={transCategory}
                    onChange={(e) => setTransCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-slate-500 font-bold">{isVi ? 'Ngày Giao Dịch' : 'Date'}</label>
                  <input
                    type="date"
                    value={transDate}
                    onChange={(e) => setTransDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-slate-500 font-bold">{isVi ? 'Đối Tác / Khách Hàng' : 'Counterparty'}</label>
                <input
                  type="text"
                  value={transCounterparty}
                  onChange={(e) => setTransCounterparty(e.target.value)}
                  placeholder="e.g. Khách mua lẻ chợ phiên, Cửa hàng mộc An Dân"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-slate-500 font-bold">{isVi ? 'Phương Thức Thanh Toán' : 'Payment Method'}</label>
                <select
                  value={transPaymentMethod}
                  onChange={(e) => setTransPaymentMethod(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  <option value="Cash">Cash (Tiền mặt)</option>
                  <option value="Bank Transfer">Bank Transfer (Chuyển khoản)</option>
                  <option value="Momo / ZaloPay">Momo / ZaloPay</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!transDescription.trim()}
                onClick={handleCreateTransaction}
                className="px-5 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-xl cursor-pointer shadow-xs"
              >
                Save to Ledger
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: INVOICE & QUOTE GENERATOR */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 border border-slate-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-teal-700 font-bold block">
                  PROFESSIONAL ITEMIZATION TOOL
                </span>
                <h3 className="text-lg font-black text-slate-900 font-serif">
                  {isVi ? 'Bộ Tạo Báo Giá & Hóa Đơn Khách Hàng' : 'Invoice & Quotation Generator'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsInvoiceModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Customer Header Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-mono text-slate-500 font-bold">{isVi ? 'Tên Khách Hàng / Đối Tác' : 'Customer / Cafe Name'}</label>
                <input
                  type="text"
                  value={invCustomerName}
                  onChange={(e) => setInvCustomerName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="font-mono text-slate-500 font-bold">{isVi ? 'Liên Hệ Khách' : 'Customer Email / Phone'}</label>
                <input
                  type="text"
                  value={invCustomerContact}
                  onChange={(e) => setInvCustomerContact(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            {/* Line Items Table */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-600">
                <span>{isVi ? 'Danh Sách Hàng Hóa & Đơn Giá' : 'Itemized Line Items'}</span>
                <button
                  type="button"
                  onClick={handleAddInvoiceItem}
                  className="text-emerald-700 hover:text-emerald-800 text-[11px] flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>{isVi ? 'Thêm dòng' : 'Add Line'}</span>
                </button>
              </div>

              <div className="space-y-2">
                {invItems.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-2.5 rounded-2xl border border-slate-200/70 text-xs">
                    <div className="col-span-6">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleUpdateInvoiceItem(item.id, 'description', e.target.value)}
                        placeholder="Description"
                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleUpdateInvoiceItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => handleUpdateInvoiceItem(item.id, 'unitPrice', parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono text-right"
                      />
                    </div>
                    <div className="col-span-1 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveInvoiceItem(item.id)}
                        className="text-slate-400 hover:text-rose-600 transition cursor-pointer"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculations Summary */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>{invoiceSubtotal.toLocaleString()} VND</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Discount:</span>
                <span>- {invDiscount.toLocaleString()} VND</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 text-sm pt-2 border-t border-slate-200">
                <span>Total Quotation:</span>
                <span className="text-emerald-800">{invoiceTotal.toLocaleString()} VND</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-[11px] text-slate-500 font-mono">
                Quotation #{`QUOTE-${Date.now().toString().slice(-4)}`}
              </span>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    const quoteText = `MICROBIZ QUOTATION\nCustomer: ${invCustomerName}\nContact: ${invCustomerContact}\n` +
                      invItems.map(i => `- ${i.description} x ${i.quantity}: ${i.amount.toLocaleString()} VND`).join('\n') +
                      `\nTotal: ${invoiceTotal.toLocaleString()} VND\nTerms: Direct bank transfer / cash on delivery.`;
                    navigator.clipboard.writeText(quoteText);
                    setIsQuoteCopied(true);
                    setTimeout(() => {
                      setIsQuoteCopied(false);
                      setIsInvoiceModalOpen(false);
                    }, 1500);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer shadow-xs flex items-center space-x-1"
                >
                  {isQuoteCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <FileText className="w-3.5 h-3.5" />}
                  <span>{isQuoteCopied ? (isVi ? 'Đã Sao Chép!' : 'Copied!') : (isVi ? 'Xuất & Sao Chép Báo Giá' : 'Export & Copy Quote')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
