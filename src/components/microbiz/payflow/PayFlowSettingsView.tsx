import React, { FC, useState } from 'react';
import { 
  Building2, 
  CreditCard, 
  ShieldCheck, 
  Download, 
  Trash2, 
  Check, 
  AlertTriangle, 
  Save, 
  HelpCircle, 
  ExternalLink,
  Copy
} from 'lucide-react';
import { PayFlowBusinessProfile, PayFlowInvoice, PayFlowTransaction, PayFlowExpense } from '../types/payflowTypes';
import { PayFlowService } from '../services/payflowService';

interface PayFlowSettingsViewProps {
  profile: PayFlowBusinessProfile;
  setProfile: React.Dispatch<React.SetStateAction<PayFlowBusinessProfile>>;
  invoices: PayFlowInvoice[];
  transactions: PayFlowTransaction[];
  expenses: PayFlowExpense[];
  setInvoices: React.Dispatch<React.SetStateAction<PayFlowInvoice[]>>;
  setTransactions: React.Dispatch<React.SetStateAction<PayFlowTransaction[]>>;
  setExpenses: React.Dispatch<React.SetStateAction<PayFlowExpense[]>>;
  currentLanguage?: string;
}

export const PayFlowSettingsView: FC<PayFlowSettingsViewProps> = ({
  profile,
  setProfile,
  invoices,
  transactions,
  expenses,
  setInvoices,
  setTransactions,
  setExpenses,
  currentLanguage = 'en'
}) => {
  const isVi = currentLanguage === 'vi';
  const [formData, setFormData] = useState<PayFlowBusinessProfile>(profile);
  const [isSaved, setIsSaved] = useState(false);
  const [copiedWebhookUrl, setCopiedWebhookUrl] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const webhookUrl = `${window.location.origin}/api/paypal/webhook`;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = await PayFlowService.saveBusinessProfile(formData);
    setProfile(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleExportFullData = () => {
    const backup = {
      exportDate: new Date().toISOString(),
      profile: formData,
      invoices,
      transactions,
      expenses
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PayFlow_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetData = () => {
    localStorage.removeItem(`payflow_invoices_cache_v1_${profile.userId}`);
    localStorage.removeItem(`payflow_transactions_cache_v1_${profile.userId}`);
    localStorage.removeItem(`payflow_expenses_cache_v1_${profile.userId}`);
    setInvoices([]);
    setTransactions([]);
    setExpenses([]);
    setIsResetConfirmOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile & Business Details Form */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 font-serif text-base">
              Business Entity & Invoicing Profile
            </h3>
          </div>
          {isSaved && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 animate-in fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>Saved Successfully</span>
            </span>
          )}
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs text-slate-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-2xs font-bold text-slate-700 mb-1">Business Name *</label>
              <input
                type="text"
                required
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
              />
            </div>

            <div>
              <label className="block text-2xs font-bold text-slate-700 mb-1">Owner / Primary Contact *</label>
              <input
                type="text"
                required
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-2xs font-bold text-slate-700 mb-1">Business Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
              />
            </div>

            <div>
              <label className="block text-2xs font-bold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
              />
            </div>

            <div>
              <label className="block text-2xs font-bold text-slate-700 mb-1">Tax ID / VAT Registration</label>
              <input
                type="text"
                value={formData.taxId}
                onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-2xs font-bold text-slate-700 mb-1">Business Street Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
            />
          </div>

          {/* Numbering & Currency Defaults */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-2xs font-bold text-slate-700 mb-1">Default Invoicing Currency</label>
              <select
                value={formData.defaultCurrency}
                onChange={(e) => setFormData({ ...formData, defaultCurrency: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono font-bold"
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

            <div>
              <label className="block text-2xs font-bold text-slate-700 mb-1">Invoice Prefix</label>
              <input
                type="text"
                value={formData.invoicePrefix}
                onChange={(e) => setFormData({ ...formData, invoicePrefix: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-2xs font-bold text-slate-700 mb-1">Default Sales Tax Rate (%)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={formData.defaultTaxRate}
                onChange={(e) => setFormData({ ...formData, defaultTaxRate: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Business Settings</span>
            </button>
          </div>
        </form>
      </div>

      {/* PayPal Gateway & Webhook Deployment Guide */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-4 text-xs text-slate-700">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <CreditCard className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-slate-900 font-serif text-base">
            PayPal Developer Gateway Configuration
          </h3>
        </div>

        <p className="leading-relaxed">
          PayFlow AI connects to official PayPal REST APIs using client credentials. When deploying to production or using your developer sandbox:
        </p>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-2xs space-y-1.5">
          <div className="text-slate-500 font-sans font-bold text-xs mb-1">Required Environment Variables:</div>
          <div>PAYPAL_ENVIRONMENT=sandbox (or live)</div>
          <div>PAYPAL_CLIENT_ID=&lt;Your-PayPal-REST-Client-ID&gt;</div>
          <div>PAYPAL_CLIENT_SECRET=&lt;Your-PayPal-REST-Secret&gt;</div>
          <div>PAYPAL_WEBHOOK_ID=&lt;Your-Webhook-ID-from-PayPal-Dashboard&gt;</div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-2xs font-bold text-slate-700">Server Webhook Listener URL for PayPal Dashboard:</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={webhookUrl}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 font-mono text-2xs select-all"
            />
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(webhookUrl);
                setCopiedWebhookUrl(true);
                setTimeout(() => setCopiedWebhookUrl(false), 2000);
              }}
              className="px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 font-bold text-2xs flex items-center gap-1 cursor-pointer"
            >
              {copiedWebhookUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedWebhookUrl ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Data Export & Account Deletion */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 font-serif text-base">
          Data Sovereignty & Account Privacy
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 text-xs">Export Complete Business Data</h4>
            <p className="text-2xs text-slate-500 leading-relaxed">
              Download all your invoices, payment transactions, expenses, and business settings as structured JSON.
            </p>
            <button
              type="button"
              onClick={handleExportFullData}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download JSON Archive</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-2">
            <h4 className="font-bold text-rose-950 text-xs">Reset Local Financial Data</h4>
            <p className="text-2xs text-rose-800/80 leading-relaxed">
              Clear client-side cache and reset demonstration records. This action cannot be undone.
            </p>
            <button
              type="button"
              onClick={() => setIsResetConfirmOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Ledger</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 text-center">
            <AlertTriangle className="w-10 h-10 text-rose-600 mx-auto" />
            <h4 className="font-bold text-slate-900 font-serif">Confirm Reset</h4>
            <p className="text-xs text-slate-600">
              Are you sure you want to clear your local ledger cache and reset invoices?
            </p>
            <div className="flex justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetData}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs cursor-pointer"
              >
                Yes, Reset Ledger
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
