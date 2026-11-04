import React, { FC, useState, useMemo } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  Copy, 
  Trash2, 
  Printer, 
  Share2, 
  CreditCard, 
  DollarSign, 
  Calendar, 
  Building2, 
  Mail, 
  Eye, 
  Sparkles, 
  Check, 
  X,
  ExternalLink,
  PartyPopper
} from 'lucide-react';
import { 
  PayFlowInvoice, 
  PayFlowInvoiceLineItem, 
  InvoiceStatus, 
  PayFlowBusinessProfile 
} from '../types/payflowTypes';
import { 
  calculateInvoiceTotals, 
  formatMoney, 
  roundMoney 
} from '../../../services/payflowMath';
import { PayFlowService } from '../services/payflowService';

interface PayFlowInvoicesViewProps {
  invoices: PayFlowInvoice[];
  setInvoices: React.Dispatch<React.SetStateAction<PayFlowInvoice[]>>;
  profile: PayFlowBusinessProfile;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenCreateModal: boolean;
  onCloseCreateModal: () => void;
  onSelectForPayment?: (invoice: PayFlowInvoice) => void;
  currentLanguage?: string;
}

export const PayFlowInvoicesView: FC<PayFlowInvoicesViewProps> = ({
  invoices,
  setInvoices,
  profile,
  searchQuery,
  setSearchQuery,
  onOpenCreateModal,
  onCloseCreateModal,
  onSelectForPayment,
  currentLanguage = 'en'
}) => {
  const isVi = currentLanguage === 'vi';
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [activePreviewInvoice, setActivePreviewInvoice] = useState<PayFlowInvoice | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(onOpenCreateModal);

  // New Invoice Form State
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [currency, setCurrency] = useState(profile.defaultCurrency || 'USD');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]);
  const [items, setItems] = useState<PayFlowInvoiceLineItem[]>([
    { id: '1', description: 'Consulting & Deliverables Phase 1', quantity: 1, unitPrice: 250, amount: 250 }
  ]);
  const [discountRate, setDiscountRate] = useState<number>(0);
  const [taxRate, setTaxRate] = useState<number>(profile.defaultTaxRate || 8.5);
  const [notes, setNotes] = useState('Payment is due within 14 days. Thank you for your partnership!');

  // Offline Payment Modal State
  const [offlinePaymentModalInvoice, setOfflinePaymentModalInvoice] = useState<PayFlowInvoice | null>(null);
  const [offlineAmount, setOfflineAmount] = useState<number>(0);
  const [offlineMethod, setOfflineMethod] = useState<'offline_cash' | 'bank_transfer'>('bank_transfer');
  const [offlineNote, setOfflineNote] = useState('');

  // Copy link toast state
  const [copiedLink, setCopiedLink] = useState(false);

  // Filtered invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const matchesSearch = !searchQuery ||
        inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.customer.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = selectedStatus === 'ALL' || inv.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchQuery, selectedStatus]);

  // Live calculations for new invoice form
  const formCalcs = useMemo(() => {
    return calculateInvoiceTotals(items, discountRate, taxRate, currency);
  }, [items, discountRate, taxRate, currency]);

  // Handle adding line item
  const handleAddItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), description: 'New Service Item', quantity: 1, unitPrice: 100, amount: 100 }
    ]);
  };

  // Handle updating line item
  const handleUpdateItem = (id: string, field: keyof PayFlowInvoiceLineItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          const qty = field === 'quantity' ? Number(value) : item.quantity;
          const price = field === 'unitPrice' ? Number(value) : item.unitPrice;
          updated.amount = roundMoney(qty * price, currency);
        }
        return updated;
      }
      return item;
    }));
  };

  // Handle deleting line item
  const handleDeleteItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(items.filter(item => item.id !== id));
  };

  // Submit new invoice
  const handleCreateInvoiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || items.length === 0) return;

    const newInvoice = await PayFlowService.saveInvoice({
      customer: {
        name: customerName.trim(),
        email: customerEmail.trim() || 'customer@example.com',
        address: customerAddress.trim()
      },
      items,
      currency,
      discountRate,
      taxRate,
      issueDate,
      dueDate,
      notes,
      status: 'PENDING'
    });

    setInvoices(prev => [newInvoice, ...prev.filter(i => i.id !== newInvoice.id)]);
    setIsCreateModalOpen(false);
    onCloseCreateModal();
    // Reset form
    setCustomerName('');
    setCustomerEmail('');
    setCustomerAddress('');
    setItems([{ id: '1', description: 'Consulting & Deliverables Phase 1', quantity: 1, unitPrice: 250, amount: 250 }]);
  };

  // Duplicate invoice
  const handleDuplicateInvoice = async (invoice: PayFlowInvoice) => {
    const duplicated = await PayFlowService.saveInvoice({
      ...invoice,
      id: undefined,
      invoiceNumber: undefined,
      status: 'DRAFT',
      amountPaid: 0,
      balanceDue: invoice.total,
      createdAt: undefined,
      updatedAt: undefined,
      history: []
    });

    setInvoices(prev => [duplicated, ...prev]);
    setActivePreviewInvoice(duplicated);
  };

  // Cancel invoice
  const handleCancelInvoice = async (invoice: PayFlowInvoice) => {
    const updated = await PayFlowService.saveInvoice({
      ...invoice,
      status: 'CANCELLED'
    });
    setInvoices(prev => prev.map(i => i.id === updated.id ? updated : i));
    if (activePreviewInvoice?.id === updated.id) {
      setActivePreviewInvoice(updated);
    }
  };

  // Record offline payment submit
  const handleOfflinePaymentSubmit = async () => {
    if (!offlinePaymentModalInvoice || offlineAmount <= 0) return;

    const res = await PayFlowService.recordOfflinePayment(
      offlinePaymentModalInvoice,
      offlineAmount,
      offlineMethod,
      offlineNote
    );

    setInvoices(prev => prev.map(i => i.id === res.invoice.id ? res.invoice : i));
    if (activePreviewInvoice?.id === res.invoice.id) {
      setActivePreviewInvoice(res.invoice);
    }
    setOfflinePaymentModalInvoice(null);
    setOfflineAmount(0);
    setOfflineNote('');
  };

  // Copy shareable link
  const handleCopyShareLink = (invoice: PayFlowInvoice) => {
    const shareUrl = `${window.location.origin}/?tab=microbiz&subtab=invoices&invoice_id=${invoice.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case 'PAID':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-2xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 className="w-3 h-3" /> Paid</span>;
      case 'PARTIALLY_PAID':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-2xs font-bold bg-teal-50 text-teal-700 border border-teal-200"><Clock className="w-3 h-3" /> Partial</span>;
      case 'PENDING':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-2xs font-bold bg-amber-50 text-amber-700 border border-amber-200"><Clock className="w-3 h-3" /> Pending</span>;
      case 'OVERDUE':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-2xs font-bold bg-rose-50 text-rose-700 border border-rose-200"><AlertTriangle className="w-3 h-3" /> Overdue</span>;
      case 'CANCELLED':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-2xs font-bold bg-slate-100 text-slate-500 border border-slate-200"><XCircle className="w-3 h-3" /> Cancelled</span>;
      case 'DRAFT':
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-2xs font-bold bg-slate-100 text-slate-700 border border-slate-300">Draft</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search, Status Filters & Action Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isVi ? 'Tìm theo mã hóa đơn, tên khách hàng hoặc email...' : 'Search by invoice #, customer name, email...'}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* New Invoice Button */}
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{isVi ? 'Tạo Hóa Đơn Mới' : 'Create Invoice'}</span>
          </button>
        </div>

        {/* Status Pill Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'ALL', label: isVi ? 'Tất Cả' : 'All Invoices' },
            { id: 'PENDING', label: isVi ? 'Chờ Thu' : 'Pending' },
            { id: 'PAID', label: isVi ? 'Đã Thanh Toán' : 'Paid' },
            { id: 'PARTIALLY_PAID', label: isVi ? 'Một Phần' : 'Partially Paid' },
            { id: 'OVERDUE', label: isVi ? 'Quá Hạn' : 'Overdue' },
            { id: 'DRAFT', label: isVi ? 'Bản Nháp' : 'Draft' },
            { id: 'CANCELLED', label: isVi ? 'Đã Hủy' : 'Cancelled' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition cursor-pointer ${
                selectedStatus === tab.id
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Invoice Data Table / Card Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredInvoices.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-3">
            <FileText className="w-10 h-10 mx-auto text-slate-300" />
            <h4 className="font-bold text-slate-700 font-serif">
              {isVi ? 'Không tìm thấy hóa đơn phù hợp' : 'No invoices found'}
            </h4>
            <p className="text-xs max-w-sm mx-auto text-slate-500">
              {isVi 
                ? 'Nhấp "+ Tạo Hóa Đơn Mới" để tạo hóa đơn chuyên nghiệp và kích hoạt thanh toán PayPal.' 
                : 'Click "+ Create Invoice" to issue a professional invoice with PayPal checkout.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/70 border-b border-slate-200/80 text-2xs uppercase tracking-wider text-slate-500 font-semibold">
                <tr>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Issue / Due Date</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Balance Due</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/60 transition group">
                    <td className="py-3.5 px-4 font-bold font-mono text-slate-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-500" />
                      <span>{inv.invoiceNumber}</span>
                      {inv.gatherGlowEventId && (
                        <span className="p-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-[10px]" title="Linked to Gather & Glow Event">
                          <PartyPopper className="w-3 h-3" />
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-900">{inv.customer.name}</p>
                      <p className="text-2xs text-slate-400">{inv.customer.email}</p>
                    </td>
                    <td className="py-3.5 px-4 text-2xs">
                      <div>Issued: {inv.issueDate}</div>
                      <div className={inv.status === 'OVERDUE' ? 'text-rose-600 font-bold' : 'text-slate-400'}>
                        Due: {inv.dueDate}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold font-mono text-slate-900">
                      {formatMoney(inv.total, inv.currency)}
                    </td>
                    <td className="py-3.5 px-4 font-bold font-mono">
                      {inv.balanceDue > 0 ? (
                        <span className="text-amber-700">{formatMoney(inv.balanceDue, inv.currency)}</span>
                      ) : (
                        <span className="text-emerald-700">$0.00</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(inv.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setActivePreviewInvoice(inv)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                          title="Preview & Print"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {inv.balanceDue > 0 && inv.status !== 'CANCELLED' && (
                          <button
                            type="button"
                            onClick={() => {
                              if (onSelectForPayment) {
                                onSelectForPayment(inv);
                              } else {
                                setActivePreviewInvoice(inv);
                              }
                            }}
                            className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-2xs transition cursor-pointer flex items-center gap-1"
                            title="Collect Payment"
                          >
                            <CreditCard className="w-3 h-3" />
                            <span>Pay</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE NEW INVOICE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-7 border border-slate-200 shadow-2xl space-y-6 my-auto max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-black text-slate-900 font-serif">
                  {isVi ? 'Tạo Hóa Đơn Thương Mại Mới' : 'Create Professional Invoice'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  onCloseCreateModal();
                }}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoiceSubmit} className="space-y-5 text-xs text-slate-700">
              {/* Customer Details Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-2xs font-bold text-slate-700 mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Acme Corp / Dr. Chen"
                    className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-bold text-slate-700 mb-1">Customer Email *</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="billing@customer.com"
                    className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-bold text-slate-700 mb-1">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 font-bold font-mono"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CAD">CAD ($)</option>
                    <option value="AUD">AUD ($)</option>
                    <option value="VND">VND (₫)</option>
                    <option value="SGD">SGD ($)</option>
                  </select>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-bold text-slate-700 mb-1">Issue Date</label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-bold text-slate-700 mb-1">Payment Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300"
                  />
                </div>
              </div>

              {/* Line Items List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span>Line Items</span>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {items.map((item, idx) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <div className="col-span-6">
                        <input
                          type="text"
                          required
                          value={item.description}
                          onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                          placeholder="Description of work, product or workshop"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          min="1"
                          step="1"
                          value={item.quantity}
                          onChange={(e) => handleUpdateItem(item.id, 'quantity', e.target.value)}
                          placeholder="Qty"
                          className="w-full px-2 py-1.5 rounded-lg bg-white border border-slate-300 text-center"
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={item.unitPrice}
                          onChange={(e) => handleUpdateItem(item.id, 'unitPrice', e.target.value)}
                          placeholder="Price"
                          className="w-full px-2 py-1.5 rounded-lg bg-white border border-slate-300 text-right font-mono"
                        />
                      </div>
                      <div className="col-span-1 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item.id)}
                          disabled={items.length <= 1}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 disabled:opacity-30 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Discounts & Tax */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <div>
                    <label className="block text-2xs font-bold text-slate-700 mb-1">Discount Rate (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={discountRate}
                      onChange={(e) => setDiscountRate(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-2xs font-bold text-slate-700 mb-1">Sales Tax Rate (%)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={taxRate}
                      onChange={(e) => setTaxRate(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300"
                    />
                  </div>
                </div>

                {/* Calculation Box */}
                <div className="p-3.5 rounded-2xl bg-slate-900 text-white space-y-1.5 font-mono text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Subtotal:</span>
                    <span>{formCalcs.formattedSubtotal}</span>
                  </div>
                  {formCalcs.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount ({discountRate}%):</span>
                      <span>-{formCalcs.formattedDiscount}</span>
                    </div>
                  )}
                  {formCalcs.taxAmount > 0 && (
                    <div className="flex justify-between text-slate-300">
                      <span>Tax ({taxRate}%):</span>
                      <span>+{formCalcs.formattedTax}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-slate-700 flex justify-between font-bold text-sm text-white">
                    <span>Total Amount:</span>
                    <span className="text-emerald-400">{formCalcs.formattedTotal}</span>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    onCloseCreateModal();
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition shadow-xs cursor-pointer"
                >
                  Save & Issue Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INVOICE PREVIEW & ACTIONS MODAL */}
      {activePreviewInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6 my-auto max-h-[92vh] overflow-y-auto animate-in fade-in duration-200">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900 font-serif">
                  Invoice #{activePreviewInvoice.invoiceNumber}
                </h3>
                {getStatusBadge(activePreviewInvoice.status)}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyShareLink(activePreviewInvoice)}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                  title="Copy Direct Link"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied' : 'Share'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActivePreviewInvoice(null)}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable Paper Canvas */}
            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-inner space-y-6 text-slate-800 text-xs">
              {/* Header: Business & Invoice Info */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-100 pb-5">
                <div>
                  <h2 className="text-lg font-black text-slate-900 font-serif">{activePreviewInvoice.business.name}</h2>
                  <p className="text-slate-500">{activePreviewInvoice.business.address}</p>
                  <p className="text-slate-500">{activePreviewInvoice.business.email} • {activePreviewInvoice.business.phone}</p>
                  {activePreviewInvoice.business.taxId && (
                    <p className="text-2xs text-slate-400">Tax ID: {activePreviewInvoice.business.taxId}</p>
                  )}
                </div>

                <div className="text-left sm:text-right">
                  <h1 className="text-xl font-black text-slate-900 font-mono">INVOICE</h1>
                  <p className="font-bold text-slate-700">#{activePreviewInvoice.invoiceNumber}</p>
                  <p className="text-slate-500 text-2xs mt-1">Issue Date: {activePreviewInvoice.issueDate}</p>
                  <p className="text-slate-500 text-2xs">Payment Due: {activePreviewInvoice.dueDate}</p>
                </div>
              </div>

              {/* Bill To */}
              <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80">
                <p className="text-2xs font-bold uppercase tracking-wider text-slate-400 mb-1">Billed To:</p>
                <p className="font-bold text-slate-900">{activePreviewInvoice.customer.name}</p>
                <p className="text-slate-600">{activePreviewInvoice.customer.email}</p>
                {activePreviewInvoice.customer.address && (
                  <p className="text-slate-500">{activePreviewInvoice.customer.address}</p>
                )}
              </div>

              {/* Items Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 text-2xs uppercase font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Description</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Unit Price</th>
                      <th className="py-2.5 px-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activePreviewInvoice.items.map(item => (
                      <tr key={item.id}>
                        <td className="py-2.5 px-3 font-medium text-slate-800">{item.description}</td>
                        <td className="py-2.5 px-3 text-center">{item.quantity}</td>
                        <td className="py-2.5 px-3 text-right font-mono">{formatMoney(item.unitPrice, activePreviewInvoice.currency)}</td>
                        <td className="py-2.5 px-3 text-right font-bold font-mono">{formatMoney(item.amount, activePreviewInvoice.currency)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Summary */}
              <div className="flex justify-end">
                <div className="w-64 space-y-1.5 font-mono text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span>{formatMoney(activePreviewInvoice.subtotal, activePreviewInvoice.currency)}</span>
                  </div>
                  {activePreviewInvoice.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount ({activePreviewInvoice.discountRate}%):</span>
                      <span>-{formatMoney(activePreviewInvoice.discountAmount, activePreviewInvoice.currency)}</span>
                    </div>
                  )}
                  {activePreviewInvoice.taxAmount > 0 && (
                    <div className="flex justify-between text-slate-600">
                      <span>Tax ({activePreviewInvoice.taxRate}%):</span>
                      <span>+{formatMoney(activePreviewInvoice.taxAmount, activePreviewInvoice.currency)}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-slate-300 flex justify-between font-bold text-sm text-slate-900">
                    <span>Total:</span>
                    <span>{formatMoney(activePreviewInvoice.total, activePreviewInvoice.currency)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-2xs">
                    <span>Amount Paid:</span>
                    <span>{formatMoney(activePreviewInvoice.amountPaid, activePreviewInvoice.currency)}</span>
                  </div>
                  <div className="pt-1 flex justify-between font-bold text-amber-800">
                    <span>Balance Due:</span>
                    <span>{formatMoney(activePreviewInvoice.balanceDue, activePreviewInvoice.currency)}</span>
                  </div>
                </div>
              </div>

              {/* Notes & Terms */}
              {(activePreviewInvoice.notes || activePreviewInvoice.terms) && (
                <div className="pt-4 border-t border-slate-100 text-2xs text-slate-500 space-y-1">
                  {activePreviewInvoice.notes && <p><strong>Notes:</strong> {activePreviewInvoice.notes}</p>}
                  {activePreviewInvoice.terms && <p><strong>Terms:</strong> {activePreviewInvoice.terms}</p>}
                </div>
              )}
            </div>

            {/* Bottom Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDuplicateInvoice(activePreviewInvoice)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Duplicate
                </button>
                {activePreviewInvoice.status !== 'CANCELLED' && activePreviewInvoice.status !== 'PAID' && (
                  <button
                    type="button"
                    onClick={() => handleCancelInvoice(activePreviewInvoice)}
                    className="px-3 py-1.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-semibold cursor-pointer"
                  >
                    Cancel Invoice
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {activePreviewInvoice.balanceDue > 0 && activePreviewInvoice.status !== 'CANCELLED' && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setOfflinePaymentModalInvoice(activePreviewInvoice);
                        setOfflineAmount(activePreviewInvoice.balanceDue);
                      }}
                      className="px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs cursor-pointer"
                    >
                      Record Offline Payment
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActivePreviewInvoice(null);
                        if (onSelectForPayment) onSelectForPayment(activePreviewInvoice);
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Collect via PayPal</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OFFLINE PAYMENT RECORDING MODAL */}
      {offlinePaymentModalInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-900 font-serif">Record Offline Payment</h3>
              <button
                type="button"
                onClick={() => setOfflinePaymentModalInvoice(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600">
                Record a direct payment received via Cash, Bank Wire, or Check for <strong>#{offlinePaymentModalInvoice.invoiceNumber}</strong>.
              </p>

              <div>
                <label className="block text-2xs font-bold text-slate-700 mb-1">Payment Method</label>
                <select
                  value={offlineMethod}
                  onChange={(e: any) => setOfflineMethod(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="bank_transfer">Direct Bank Transfer / Wire</option>
                  <option value="offline_cash">Physical Cash</option>
                </select>
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-700 mb-1">Amount Received</label>
                <input
                  type="number"
                  step="any"
                  max={offlinePaymentModalInvoice.balanceDue}
                  value={offlineAmount}
                  onChange={(e) => setOfflineAmount(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-mono"
                />
                <span className="text-2xs text-slate-400 mt-0.5 block">
                  Remaining balance: {formatMoney(offlinePaymentModalInvoice.balanceDue, offlinePaymentModalInvoice.currency)}
                </span>
              </div>

              <div>
                <label className="block text-2xs font-bold text-slate-700 mb-1">Reference Notes (Optional)</label>
                <input
                  type="text"
                  value={offlineNote}
                  onChange={(e) => setOfflineNote(e.target.value)}
                  placeholder="e.g. Bank wire reference #99210"
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOfflinePaymentModalInvoice(null)}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleOfflinePaymentSubmit}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                >
                  Confirm Settlement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
