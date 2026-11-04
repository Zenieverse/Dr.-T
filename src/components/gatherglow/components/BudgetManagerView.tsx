import React, { useState } from 'react';
import { GatherEvent, BudgetItem, VendorCategory } from '../types';
import { 
  DollarSign, 
  Plus, 
  ArrowUpRight, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Edit3, 
  Receipt,
  FileText,
  Filter,
  X
} from 'lucide-react';
import { MicroBizBridgeModal } from './MicroBizBridgeModal';

interface BudgetManagerViewProps {
  event: GatherEvent;
  budgetItems: BudgetItem[];
  onSaveBudgetItem: (item: BudgetItem) => void;
  onDeleteBudgetItem: (itemId: string) => void;
}

const CATEGORIES: Array<{ id: VendorCategory; label: string }> = [
  { id: 'venue', label: 'Venue & Grounds' },
  { id: 'catering', label: 'Food & Beverage' },
  { id: 'photography', label: 'Photography' },
  { id: 'videography', label: 'Videography & Cinema' },
  { id: 'flowers', label: 'Flowers & Centerpieces' },
  { id: 'decor', label: 'Lighting & Theme Decor' },
  { id: 'entertainment', label: 'Music & Entertainment' },
  { id: 'attire', label: 'Attire & Styling' },
  { id: 'transport', label: 'Transportation & Shuttles' },
  { id: 'invitations', label: 'Invitations & Printing' },
  { id: 'rentals', label: 'Equipment & Rentals' },
  { id: 'staffing', label: 'Event Staffing & Security' },
  { id: 'contingency', label: 'Contingency & Reserve' },
  { id: 'other', label: 'Other Sundries' }
];

const formatCurrency = (amount: number, currency: string) => {
  if (currency === 'VND') {
    return `${amount.toLocaleString()} ₫`;
  }
  const symbolMap: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'CA$',
    AUD: 'A$',
    SGD: 'S$'
  };
  const sym = symbolMap[currency] || '$';
  return `${sym}${amount.toLocaleString()}`;
};

export const BudgetManagerView: React.FC<BudgetManagerViewProps> = ({
  event,
  budgetItems,
  onSaveBudgetItem,
  onDeleteBudgetItem
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null);
  const [bridgeModalItem, setBridgeModalItem] = useState<BudgetItem | null>(null);

  // Modal Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<VendorCategory>('catering');
  const [estimatedCost, setEstimatedCost] = useState<number>(1000);
  const [actualCost, setActualCost] = useState<number>(1000);
  const [vendorQuotation, setVendorQuotation] = useState<number>(1000);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [dueDate, setDueDate] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<BudgetItem['paymentStatus']>('unpaid');
  const [notes, setNotes] = useState('');

  // Calculations
  const totalBudget = event.totalBudget || 0;
  const totalEstimated = budgetItems.reduce((acc, item) => acc + (item.estimatedCost || 0), 0);
  const totalActualOrQuoted = budgetItems.reduce((acc, item) => acc + (item.vendorQuotation || item.actualCost || item.estimatedCost || 0), 0);
  const totalPaid = budgetItems.reduce((acc, item) => acc + (item.paidAmount || 0), 0);
  const remainingBalance = Math.max(0, totalBudget - totalActualOrQuoted);
  const totalUnpaidBalance = Math.max(0, totalActualOrQuoted - totalPaid);

  const budgetUsagePercent = totalBudget > 0 ? Math.min(150, Math.round((totalActualOrQuoted / totalBudget) * 100)) : 0;
  const isOverBudget = totalActualOrQuoted > totalBudget;

  const openAddModal = () => {
    setEditingItem(null);
    setName('');
    setCategory('venue');
    setEstimatedCost(1000);
    setActualCost(1000);
    setVendorQuotation(1000);
    setPaidAmount(0);
    setDueDate(event.date);
    setPaymentStatus('unpaid');
    setNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: BudgetItem) => {
    setEditingItem(item);
    setName(item.name);
    setCategory(item.category);
    setEstimatedCost(item.estimatedCost);
    setActualCost(item.actualCost);
    setVendorQuotation(item.vendorQuotation);
    setPaidAmount(item.paidAmount);
    setDueDate(item.dueDate || '');
    setPaymentStatus(item.paymentStatus);
    setNotes(item.notes);
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newItem: BudgetItem = {
      id: editingItem?.id || `budget-${Date.now()}`,
      eventId: event.id,
      name: name.trim(),
      category,
      estimatedCost: Number(estimatedCost) || 0,
      actualCost: Number(actualCost) || 0,
      vendorQuotation: Number(vendorQuotation) || 0,
      paidAmount: Number(paidAmount) || 0,
      dueDate: dueDate || undefined,
      paymentStatus,
      notes: notes.trim(),
      receiptId: editingItem?.receiptId
    };

    onSaveBudgetItem(newItem);
    setIsModalOpen(false);
  };

  const filteredItems = selectedCategory === 'all'
    ? budgetItems
    : budgetItems.filter(b => b.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Target Budget */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Target Budget Ceiling
          </span>
          <div className="text-2xl font-black text-slate-900">
            {event.currency} {totalBudget.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400">
            Per guest: {event.expectedGuests > 0 ? `${event.currency} ${Math.round(totalBudget / event.expectedGuests).toLocaleString()}` : '—'}
          </div>
        </div>

        {/* Total Committed / Quoted */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Committed / Quoted
            </span>
            {isOverBudget ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                Over by {event.currency} {(totalActualOrQuoted - totalBudget).toLocaleString()}
              </span>
            ) : (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {budgetUsagePercent}% Allocated
              </span>
            )}
          </div>
          <div className={`text-2xl font-black ${isOverBudget ? 'text-rose-600' : 'text-slate-900'}`}>
            {event.currency} {totalActualOrQuoted.toLocaleString()}
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mt-1.5">
            <div 
              className={`h-full rounded-full transition-all ${isOverBudget ? 'bg-rose-500' : 'bg-emerald-500'}`}
              style={{ width: `${Math.min(100, budgetUsagePercent)}%` }}
            />
          </div>
        </div>

        {/* Paid to Date */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Deposits & Paid to Date
          </span>
          <div className="text-2xl font-black text-emerald-600">
            {event.currency} {totalPaid.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500">
            {totalActualOrQuoted > 0 ? `${Math.round((totalPaid / totalActualOrQuoted) * 100)}% settled` : 'No expenses recorded'}
          </div>
        </div>

        {/* Remaining Unpaid Balance */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Remaining Unpaid Balance
          </span>
          <div className="text-2xl font-black text-amber-600">
            {event.currency} {totalUnpaidBalance.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500">
            Remaining buffer: {event.currency} {remainingBalance.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Category Breakdown & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 max-w-2xl">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            All Categories ({budgetItems.length})
          </button>
          {CATEGORIES.map(c => {
            const count = budgetItems.filter(b => b.category === c.id).length;
            if (count === 0 && selectedCategory !== c.id) return null;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === c.id
                    ? 'bg-rose-600 text-white font-bold'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {c.label} ({count})
              </button>
            );
          })}
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs shrink-0 active:scale-98 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Expense Item</span>
        </button>
      </div>

      {/* Itemized Budget Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Category & Item</th>
                <th className="py-3 px-4">Estimated</th>
                <th className="py-3 px-4">Quoted / Actual</th>
                <th className="py-3 px-4">Paid</th>
                <th className="py-3 px-4">Status & Due Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No budget items found in this category. Click "Add Expense Item" to begin.
                  </td>
                </tr>
              ) : (
                filteredItems.map(item => {
                  const amount = item.vendorQuotation || item.actualCost || item.estimatedCost;
                  const isDeposit = item.paymentStatus === 'deposit_paid';
                  const isPaid = item.paymentStatus === 'paid_in_full';

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Name & Category */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-sm">{item.name}</div>
                        <div className="flex items-center space-x-2 mt-0.5">
                          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                            {item.category}
                          </span>
                          {item.receiptId && (
                            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              {item.receiptId}
                            </span>
                          )}
                        </div>
                        {item.notes && (
                          <div className="text-[11px] text-slate-500 mt-1 max-w-xs truncate">
                            {item.notes}
                          </div>
                        )}
                      </td>

                      {/* Estimated */}
                      <td className="py-3.5 px-4 font-semibold text-slate-600">
                        {event.currency} {item.estimatedCost.toLocaleString()}
                      </td>

                      {/* Actual / Quoted */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">
                          {event.currency} {amount.toLocaleString()}
                        </div>
                        {item.vendorQuotation > 0 && (
                          <span className="text-[10px] text-slate-400 block">
                            Quoted: {event.currency} {item.vendorQuotation.toLocaleString()}
                          </span>
                        )}
                      </td>

                      {/* Paid */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-emerald-600">
                          {event.currency} {item.paidAmount.toLocaleString()}
                        </span>
                        {amount - item.paidAmount > 0 && (
                          <span className="text-[10px] text-slate-400 block">
                            Bal: {event.currency} {(amount - item.paidAmount).toLocaleString()}
                          </span>
                        )}
                      </td>

                      {/* Status & Due Date */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                            isPaid
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : isDeposit
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            <span>{item.paymentStatus.replace('_', ' ')}</span>
                          </span>
                          {item.dueDate && (
                            <span className="text-[11px] text-slate-500 block">
                              Due: {item.dueDate}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {/* MicroBiz Bridge Button */}
                          <button
                            onClick={() => setBridgeModalItem(item)}
                            title="Export Voucher to MicroBiz Ledger"
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                          >
                            <Receipt className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => openEditModal(item)}
                            title="Edit Item"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Delete "${item.name}" from budget?`)) {
                                onDeleteBudgetItem(item.id);
                              }
                            }}
                            title="Delete Item"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <h4 className="font-bold text-base">
                {editingItem ? 'Edit Budget Expense' : 'Add Expense Item'}
              </h4>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Item / Service Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bamboo Pavilion Rental (Full Day)"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as VendorCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Payment Status
                  </label>
                  <select
                    value={paymentStatus}
                    onChange={e => setPaymentStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="deposit_paid">Deposit Paid</option>
                    <option value="paid_in_full">Paid in Full</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Estimated Cost
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={estimatedCost}
                    onChange={e => setEstimatedCost(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Quoted / Actual
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={vendorQuotation}
                    onChange={e => setVendorQuotation(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Paid Amount
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={paidAmount}
                    onChange={e => setPaidAmount(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Payment Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Notes & Contract Terms
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. 50% deposit required upon booking. Remainder due 14 days before event."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MicroBiz Ledger Export Bridge Modal */}
      <MicroBizBridgeModal
        isOpen={Boolean(bridgeModalItem)}
        onClose={() => setBridgeModalItem(null)}
        item={bridgeModalItem}
        event={event}
        onConfirmBridge={(receiptId) => {
          if (bridgeModalItem) {
            onSaveBudgetItem({ ...bridgeModalItem, receiptId });
          }
        }}
      />
    </div>
  );
};
