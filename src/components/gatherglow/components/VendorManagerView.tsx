import React, { useState } from 'react';
import { GatherEvent, VendorRecord, VendorCategory, VendorStatus } from '../types';
import { 
  Building2, 
  Plus, 
  Phone, 
  Mail, 
  Globe, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  X,
  FileCheck2,
  DollarSign
} from 'lucide-react';

interface VendorManagerViewProps {
  event: GatherEvent;
  vendors: VendorRecord[];
  onSaveVendor: (vendor: VendorRecord) => void;
  onDeleteVendor: (vendorId: string) => void;
}

const CATEGORIES: Array<{ id: VendorCategory; label: string; icon: string }> = [
  { id: 'venue', label: 'Venue & Grounds', icon: '🏰' },
  { id: 'catering', label: 'Catering & Beverages', icon: '🍽️' },
  { id: 'photography', label: 'Photography', icon: '📸' },
  { id: 'videography', label: 'Videography & Cinema', icon: '🎥' },
  { id: 'flowers', label: 'Flowers & Floral Craft', icon: '🌺' },
  { id: 'decor', label: 'Theme Decor & Lighting', icon: '🌸' },
  { id: 'entertainment', label: 'Music & Entertainment', icon: '🎵' },
  { id: 'attire', label: 'Attire & Styling', icon: '👗' },
  { id: 'transport', label: 'Transportation & Shuttles', icon: '🚐' },
  { id: 'invitations', label: 'Stationery & Printing', icon: '💌' },
  { id: 'rentals', label: 'Equipment & Rentals', icon: '🎪' },
  { id: 'staffing', label: 'Staffing & Coordination', icon: '🤝' },
  { id: 'other', label: 'Other Vendors', icon: '✨' },
];

export const VendorManagerView: React.FC<VendorManagerViewProps> = ({
  event,
  vendors,
  onSaveVendor,
  onDeleteVendor
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [selectedVendorIds, setSelectedVendorIds] = useState<string[]>([]);
  const [editingVendor, setEditingVendor] = useState<VendorRecord | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<VendorCategory>('venue');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [quotedPrice, setQuotedPrice] = useState<number>(1000);
  const [depositAmount, setDepositAmount] = useState<number>(500);
  const [depositPaid, setDepositPaid] = useState<boolean>(false);
  const [paymentDeadline, setPaymentDeadline] = useState('');
  const [status, setStatus] = useState<VendorStatus>('inquiring');
  const [notes, setNotes] = useState('');

  const openAddModal = () => {
    setEditingVendor(null);
    setName('');
    setCategory('venue');
    setContactPerson('');
    setPhone('');
    setEmail('');
    setWebsite('');
    setQuotedPrice(1000);
    setDepositAmount(500);
    setDepositPaid(false);
    setPaymentDeadline(event.date);
    setStatus('inquiring');
    setNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (vendor: VendorRecord) => {
    setEditingVendor(vendor);
    setName(vendor.name);
    setCategory(vendor.category);
    setContactPerson(vendor.contactPerson);
    setPhone(vendor.phone);
    setEmail(vendor.email);
    setWebsite(vendor.website || '');
    setQuotedPrice(vendor.quotedPrice);
    setDepositAmount(vendor.depositAmount);
    setDepositPaid(vendor.depositPaid);
    setPaymentDeadline(vendor.paymentDeadline || '');
    setStatus(vendor.status);
    setNotes(vendor.notes);
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newVendor: VendorRecord = {
      id: editingVendor?.id || `vendor-${Date.now()}`,
      eventId: event.id,
      name: name.trim(),
      category,
      contactPerson: contactPerson.trim(),
      phone: phone.trim(),
      email: email.trim(),
      website: website.trim() || undefined,
      quotedPrice: Number(quotedPrice) || 0,
      depositAmount: Number(depositAmount) || 0,
      depositPaid,
      paymentDeadline: paymentDeadline || undefined,
      status,
      notes: notes.trim(),
      isVerifiedQuote: true
    };

    onSaveVendor(newVendor);
    setIsModalOpen(false);
  };

  const filteredVendors = selectedCategory === 'all'
    ? vendors
    : vendors.filter(v => v.category === selectedCategory);

  const totalQuoted = vendors.reduce((acc, v) => acc + (v.quotedPrice || 0), 0);
  const totalDepositPaid = vendors.reduce((acc, v) => acc + (v.depositPaid ? v.depositAmount : 0), 0);

  const getStatusBadge = (st: VendorStatus) => {
    switch (st) {
      case 'contracted':
      case 'paid_in_full':
        return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Contracted / Confirmed</span>;
      case 'deposit_paid':
        return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">Deposit Paid</span>;
      case 'quoted':
        return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">Quotation Received</span>;
      case 'inquiring':
        return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">Inquiring / Pending</span>;
      case 'declined':
        return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">Declined</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Quick Summary */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Partner Vendors & Quotations</h3>
          <p className="text-xs text-slate-500">
            Compare vendor quotes, contracts, deposit deadlines, and direct contact details.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <span className="text-[11px] text-slate-400 block font-medium">Total Quotations</span>
            <span className="font-bold text-sm text-slate-800">
              {event.currency} {totalQuoted.toLocaleString()}
            </span>
          </div>

          {selectedVendorIds.length >= 2 && (
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="inline-flex items-center space-x-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs active:scale-98 transition-all"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Compare Quotes ({selectedVendorIds.length})</span>
            </button>
          )}

          <button
            onClick={openAddModal}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs active:scale-98 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Record New Vendor</span>
          </button>
        </div>
      </div>

      {/* Disclaimers & Invariant Notice */}
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-start space-x-3 text-xs text-slate-600">
        <FileCheck2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <p>
          <strong>Transparency Notice:</strong> All vendor names, contact numbers, and quotations listed below are user-recorded. 
          Gather & Glow does not fabricate vendor availability, publish sponsored vendor ads, or charge booking commissions.
        </p>
      </div>

      {/* Categories Filter */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
            selectedCategory === 'all'
              ? 'bg-slate-900 text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
          }`}
        >
          All Categories ({vendors.length})
        </button>
        {CATEGORIES.map(c => {
          const count = vendors.filter(v => v.category === c.id).length;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap flex items-center space-x-1.5 ${
                selectedCategory === c.id
                  ? 'bg-rose-600 text-white font-bold'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <span>{c.icon}</span>
              <span>{c.label} ({count})</span>
            </button>
          );
        })}
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredVendors.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 text-xs">
            No vendors recorded in this category. Click "Record New Vendor" to add quotes and contact details.
          </div>
        ) : (
          filteredVendors.map(vendor => (
            <div 
              key={vendor.id}
              className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start space-x-2.5">
                    <input
                      type="checkbox"
                      checked={selectedVendorIds.includes(vendor.id)}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedVendorIds([...selectedVendorIds, vendor.id]);
                        } else {
                          setSelectedVendorIds(selectedVendorIds.filter(id => id !== vendor.id));
                        }
                      }}
                      className="mt-1 w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300"
                      title="Select for quotation comparison"
                    />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                        {vendor.category}
                      </span>
                      <h4 className="text-base font-bold text-slate-900 mt-1">{vendor.name}</h4>
                      {vendor.contactPerson && (
                        <p className="text-xs text-slate-500">Contact: {vendor.contactPerson}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    {getStatusBadge(vendor.status)}
                  </div>
                </div>

                {/* Pricing & Deposit */}
                <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Quoted Total</span>
                    <span className="font-bold text-slate-800 text-sm">
                      {event.currency} {vendor.quotedPrice.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Deposit Status</span>
                    <span className={`font-semibold ${vendor.depositPaid ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {vendor.depositPaid ? `Paid (${event.currency} ${vendor.depositAmount.toLocaleString()})` : `Pending (${event.currency} ${vendor.depositAmount.toLocaleString()})`}
                    </span>
                  </div>
                </div>

                {/* Notes */}
                {vendor.notes && (
                  <p className="text-xs text-slate-600 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                    {vendor.notes}
                  </p>
                )}

                {/* Contact Links */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                  {vendor.phone && (
                    <a href={`tel:${vendor.phone}`} className="inline-flex items-center space-x-1 hover:text-slate-800">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{vendor.phone}</span>
                    </a>
                  )}
                  {vendor.email && (
                    <a href={`mailto:${vendor.email}`} className="inline-flex items-center space-x-1 hover:text-slate-800">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{vendor.email}</span>
                    </a>
                  )}
                  {vendor.website && (
                    <a href={vendor.website} target="_blank" rel="noreferrer" className="inline-flex items-center space-x-1 text-rose-600 hover:text-rose-700 font-medium">
                      <Globe className="w-3.5 h-3.5" />
                      <span>Website</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">
                  {vendor.paymentDeadline ? `Deadline: ${vendor.paymentDeadline}` : 'No deadline'}
                </span>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => openEditModal(vendor)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete vendor "${vendor.name}"?`)) {
                        onDeleteVendor(vendor.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Vendor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <h4 className="font-bold text-base">
                {editingVendor ? 'Edit Vendor Quotation' : 'Record New Vendor'}
              </h4>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Vendor Name / Business *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lotus & Sea Artisan Catering"
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
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as VendorStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  >
                    <option value="inquiring">Inquiring / Pending</option>
                    <option value="quoted">Quotation Received</option>
                    <option value="contracted">Contracted / Booked</option>
                    <option value="deposit_paid">Deposit Paid</option>
                    <option value="paid_in_full">Paid in Full</option>
                    <option value="declined">Declined</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Chef Quang"
                    value={contactPerson}
                    onChange={e => setContactPerson(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +84 91 388 9900"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. contact@lotussea.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Website or Portfolio URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={website}
                    onChange={e => setWebsite(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Quoted Price ({event.currency})
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={quotedPrice}
                    onChange={e => setQuotedPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Deposit Amount ({event.currency})
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={depositAmount}
                    onChange={e => setDepositAmount(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={depositPaid}
                    onChange={e => setDepositPaid(e.target.checked)}
                    className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
                  />
                  <span>Deposit has been paid to vendor</span>
                </label>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Payment Balance Deadline
                  </label>
                  <input
                    type="date"
                    value={paymentDeadline}
                    onChange={e => setPaymentDeadline(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Contract Terms & Vendor Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Includes setup at 09:00, 6 course tasting, sound permit included..."
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
                  Save Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quotation Comparison Modal */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden my-8">
            <div className="px-6 py-4 bg-indigo-50/80 border-b border-indigo-100 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-indigo-900 font-bold text-sm">
                <FileCheck2 className="w-4 h-4 text-indigo-600" />
                <span>Side-by-Side Quotation Comparison ({selectedVendorIds.length} Selected)</span>
              </div>
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-3 font-bold border-r border-slate-200 w-36">Metric / Detail</th>
                    {vendors.filter(v => selectedVendorIds.includes(v.id)).map(v => (
                      <th key={v.id} className="p-3 font-bold border-r border-slate-200 text-slate-900 text-sm">
                        {v.name}
                        <span className="block text-[10px] uppercase font-normal text-slate-500 mt-0.5">{v.category}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="p-3 font-semibold text-slate-600 border-r border-slate-200 bg-slate-50/50">Quoted Total</td>
                    {vendors.filter(v => selectedVendorIds.includes(v.id)).map(v => (
                      <td key={v.id} className="p-3 font-bold text-slate-900 text-sm border-r border-slate-200">
                        {event.currency} {v.quotedPrice.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-3 font-semibold text-slate-600 border-r border-slate-200 bg-slate-50/50">Deposit Required</td>
                    {vendors.filter(v => selectedVendorIds.includes(v.id)).map(v => (
                      <td key={v.id} className="p-3 border-r border-slate-200">
                        {event.currency} {v.depositAmount.toLocaleString()} ({v.depositPaid ? '✅ Paid' : '⏳ Pending'})
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-3 font-semibold text-slate-600 border-r border-slate-200 bg-slate-50/50">Payment Deadline</td>
                    {vendors.filter(v => selectedVendorIds.includes(v.id)).map(v => (
                      <td key={v.id} className="p-3 border-r border-slate-200 font-mono">
                        {v.paymentDeadline || 'Upon final delivery'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="p-3 font-semibold text-slate-600 border-r border-slate-200 bg-slate-50/50">Contact Person</td>
                    {vendors.filter(v => selectedVendorIds.includes(v.id)).map(v => (
                      <td key={v.id} className="p-3 border-r border-slate-200">
                        {v.contactPerson || 'General inquiries'} • {v.phone || v.email || 'N/A'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-600 border-r border-slate-200 bg-slate-50/50">Notes & Contract Terms</td>
                    {vendors.filter(v => selectedVendorIds.includes(v.id)).map(v => (
                      <td key={v.id} className="p-3 border-r border-slate-200 text-slate-600 italic">
                        {v.notes || 'No private terms recorded.'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end space-x-2">
              <button
                onClick={() => setSelectedVendorIds([])}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
              >
                Clear Selection
              </button>
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="px-4 py-1.5 bg-slate-900 text-white font-bold text-xs rounded-xl"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
