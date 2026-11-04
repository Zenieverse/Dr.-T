import React, { useState } from 'react';
import { BudgetItem, GatherEvent } from '../types';
import { X, Check, Copy, ArrowUpRight, ShieldCheck, DollarSign, FileText } from 'lucide-react';

interface MicroBizBridgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: BudgetItem | null;
  event: GatherEvent;
  onConfirmBridge?: (receiptId: string) => void;
}

export const MicroBizBridgeModal: React.FC<MicroBizBridgeModalProps> = ({
  isOpen,
  onClose,
  item,
  event,
  onConfirmBridge
}) => {
  const [copied, setCopied] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [synced, setSynced] = useState(false);

  if (!isOpen || !item) return null;

  const receiptNumber = item.receiptId || `REC-GG-${Math.floor(100000 + Math.random() * 900000)}`;
  const amount = item.vendorQuotation || item.actualCost || item.estimatedCost;
  const balanceDue = Math.max(0, amount - item.paidAmount);

  const payload = {
    source: 'Gather & Glow Event Manager',
    eventId: event.id,
    eventTitle: event.title,
    ledgerCategory: 'Operations & Event Production',
    vendorCategory: item.category,
    itemName: item.name,
    amount,
    paidAmount: item.paidAmount,
    balanceDue,
    currency: event.currency,
    dueDate: item.dueDate || event.date,
    paymentStatus: item.paymentStatus,
    receiptNumber,
    notes: item.notes,
    timestamp: new Date().toISOString()
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSyncToMicroBiz = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSynced(true);
      if (onConfirmBridge) {
        onConfirmBridge(receiptNumber);
      }
      setTimeout(() => {
        onClose();
        setSynced(false);
      }, 1500);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-xs">
              <DollarSign className="w-6 h-6 text-emerald-100" />
            </div>
            <div>
              <h3 className="text-lg font-bold">MicroBiz Ledger Integration</h3>
              <p className="text-xs text-emerald-100">Export expense voucher directly to Dr. T MicroBiz operations ledger</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Voucher Preview Card */}
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {item.category}
                </span>
                <h4 className="font-bold text-slate-800 text-base mt-1">{item.name}</h4>
                <p className="text-xs text-slate-500">{event.title}</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Voucher No.</span>
                <span className="font-mono text-sm font-semibold text-slate-700">{receiptNumber}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="p-2.5 bg-white rounded-xl border border-slate-100">
                <span className="text-xs text-slate-400 block">Total Quoted</span>
                <span className="font-bold text-slate-800">
                  {event.currency} {amount.toLocaleString()}
                </span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-100">
                <span className="text-xs text-slate-400 block">Paid Amount</span>
                <span className="font-bold text-emerald-600">
                  {event.currency} {item.paidAmount.toLocaleString()}
                </span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-100">
                <span className="text-xs text-slate-400 block">Balance Due</span>
                <span className={`font-bold ${balanceDue > 0 ? 'text-amber-600' : 'text-slate-700'}`}>
                  {event.currency} {balanceDue.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>Payment Status: <strong className="uppercase text-slate-700">{item.paymentStatus}</strong></span>
              <span>Due Date: <strong>{item.dueDate || event.date}</strong></span>
            </div>
          </div>

          {/* MicroBiz Bridge Explanation */}
          <div className="flex items-start space-x-3 p-3.5 bg-emerald-50/60 border border-emerald-200/60 rounded-xl text-xs text-emerald-900">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              By bridging to MicroBiz, this expenditure will be logged under your private business or event bookkeeping records. 
              Automated card charging is disabled to protect local artisans and vendors from unexpected processing fees.
            </p>
          </div>

          {/* JSON Payload Preview */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
              <span>Financial Data Payload:</span>
              <button
                onClick={handleCopy}
                className="inline-flex items-center space-x-1 text-emerald-600 hover:text-emerald-700"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-900 text-slate-300 rounded-xl text-[11px] font-mono overflow-x-auto max-h-36">
              {JSON.stringify(payload, null, 2)}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={handleSyncToMicroBiz}
            disabled={isSyncing || synced}
            className={`inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl font-medium text-sm text-white transition-all shadow-md ${
              synced
                ? 'bg-emerald-600'
                : 'bg-emerald-600 hover:bg-emerald-700 active:scale-98 shadow-emerald-500/20'
            }`}
          >
            {synced ? (
              <>
                <Check className="w-4 h-4" />
                <span>Bridged to MicroBiz!</span>
              </>
            ) : isSyncing ? (
              <span>Syncing Ledger...</span>
            ) : (
              <>
                <ArrowUpRight className="w-4 h-4" />
                <span>Record in MicroBiz Ledger</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
