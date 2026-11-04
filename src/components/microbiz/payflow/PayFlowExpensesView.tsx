import React, { FC, useState, useMemo } from 'react';
import { 
  Receipt, 
  Plus, 
  Search, 
  ScanLine, 
  Trash2, 
  CheckCircle2, 
  Tag, 
  Calendar, 
  DollarSign, 
  Upload, 
  X,
  Sparkles,
  PartyPopper
} from 'lucide-react';
import { PayFlowExpense, PayFlowBusinessProfile } from '../types/payflowTypes';
import { formatMoney } from '../../../services/payflowMath';
import { PayFlowService } from '../services/payflowService';

interface PayFlowExpensesViewProps {
  expenses: PayFlowExpense[];
  setExpenses: React.Dispatch<React.SetStateAction<PayFlowExpense[]>>;
  profile: PayFlowBusinessProfile;
  currentLanguage?: string;
}

export const PayFlowExpensesView: FC<PayFlowExpensesViewProps> = ({
  expenses,
  setExpenses,
  profile,
  currentLanguage = 'en'
}) => {
  const isVi = currentLanguage === 'vi';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Expense Form State
  const [merchant, setMerchant] = useState('');
  const [category, setCategory] = useState('Materials & Inventory');
  const [amount, setAmount] = useState<number>(50);
  const [taxAmount, setTaxAmount] = useState<number>(0);
  const [currency, setCurrency] = useState(profile.defaultCurrency || 'USD');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('PayPal Commercial Card');
  const [notes, setNotes] = useState('');

  // OCR Scan Simulation State
  const [isScanning, setIsScanning] = useState(false);

  const categories = [
    'ALL',
    'Materials & Inventory',
    'Software & Cloud Services',
    'Equipment & Tools',
    'Marketing & Advertising',
    'Utilities & Hosting',
    'Travel & Meals',
    'Professional Fees'
  ];

  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery ||
        exp.merchant.toLowerCase().includes(q) ||
        exp.category.toLowerCase().includes(q) ||
        (exp.notes && exp.notes.toLowerCase().includes(q));

      const matchesCat = selectedCategory === 'ALL' || exp.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [expenses, searchQuery, selectedCategory]);

  const totalExpenseSum = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const handleCreateExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchant.trim() || amount <= 0) return;

    const newExpense = await PayFlowService.saveExpense({
      merchant: merchant.trim(),
      category,
      amount: Number(amount),
      taxAmount: Number(taxAmount),
      currency,
      date,
      paymentMethod,
      notes: notes.trim() || undefined
    });

    setExpenses(prev => [newExpense, ...prev.filter(e => e.id !== newExpense.id)]);
    setIsAddModalOpen(false);
    // Reset form
    setMerchant('');
    setAmount(50);
    setNotes('');
  };

  const handleDeleteExpense = async (id: string) => {
    await PayFlowService.deleteExpense(id);
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  // Quick OCR Extraction Simulation
  const handleSimulateOcr = () => {
    setIsScanning(true);
    setTimeout(() => {
      setMerchant('AWS Cloud Infrastructure & Storage');
      setCategory('Software & Cloud Services');
      setAmount(84.50);
      setTaxAmount(7.18);
      setCurrency('USD');
      setPaymentMethod('PayPal Business Debit');
      setNotes('OCR Scan extracted from cloud invoice PDF receipt');
      setIsScanning(false);
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isVi ? 'Tìm theo nhà cung cấp, danh mục, ghi chú...' : 'Search vendor, expense category, notes...'}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{isVi ? 'Ghi Nhận Chi Phí' : 'Add Expense'}</span>
            </button>
          </div>
        </div>

        {/* Categories & Total Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-2xl">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl text-2xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="font-mono text-xs">
            <span className="text-slate-400">Total Deductions:</span>{' '}
            <strong className="text-slate-900">{formatMoney(totalExpenseSum, profile.defaultCurrency || 'USD')}</strong>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredExpenses.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs space-y-2">
            <Receipt className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-bold text-slate-700">No expense records found</p>
            <p>Upload receipts or record business expenses to calculate net cash flow and deductible tax.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-2xs uppercase tracking-wider text-slate-500 font-semibold">
                <tr>
                  <th className="py-3 px-4">Merchant / Vendor</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Tax (VAT)</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredExpenses.map(exp => (
                  <tr key={exp.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-indigo-500" />
                      <span>{exp.merchant}</span>
                      {exp.gatherGlowEventId && (
                        <span className="p-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-[10px]" title="Gather & Glow Event Expense">
                          <PartyPopper className="w-3 h-3" />
                        </span>
                      )}
                      {exp.isOcrExtracted && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-teal-50 text-teal-700 border border-teal-200 font-mono">
                          OCR
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-2xs font-medium bg-slate-100 text-slate-700">
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-2xs text-slate-500">
                      {exp.date}
                    </td>
                    <td className="py-3.5 px-4 text-2xs text-slate-600">
                      {exp.paymentMethod}
                    </td>
                    <td className="py-3.5 px-4 font-bold font-mono text-slate-900">
                      {formatMoney(exp.amount, exp.currency)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {exp.taxAmount > 0 ? formatMoney(exp.taxAmount, exp.currency) : '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteExpense(exp.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        title="Delete Expense"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD EXPENSE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-slate-200 shadow-2xl space-y-5 my-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 font-serif text-base">
                  Record Business Expense
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick OCR Scanner Simulator Tool */}
            <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-indigo-900">
                <ScanLine className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Simulate Intelligent Receipt OCR Extraction</span>
              </div>
              <button
                type="button"
                onClick={handleSimulateOcr}
                disabled={isScanning}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-2xs transition cursor-pointer disabled:opacity-50"
              >
                {isScanning ? 'Scanning...' : 'Auto-Extract'}
              </button>
            </div>

            <form onSubmit={handleCreateExpenseSubmit} className="space-y-4 text-xs text-slate-700">
              <div>
                <label className="block text-2xs font-bold text-slate-700 mb-1">Merchant / Vendor Name *</label>
                <input
                  type="text"
                  required
                  value={merchant}
                  onChange={(e) => setMerchant(e.target.value)}
                  placeholder="e.g. Google Cloud / Local Supply Store"
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs"
                  >
                    {categories.filter(c => c !== 'ALL').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-2xs font-bold text-slate-700 mb-1">Payment Method</label>
                  <input
                    type="text"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    placeholder="PayPal / Card / Cash"
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-2xs font-bold text-slate-700 mb-1">Amount *</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-bold text-slate-700 mb-1">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-mono font-bold"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="VND">VND (₫)</option>
                    <option value="SGD">SGD ($)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-700 mb-1">Tax / VAT Amount</label>
                  <input
                    type="number"
                    step="any"
                    value={taxAmount}
                    onChange={(e) => setTaxAmount(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-bold text-slate-700 mb-1">Expense Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-700 mb-1">Notes / Description</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Purpose of expense or project tag"
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
