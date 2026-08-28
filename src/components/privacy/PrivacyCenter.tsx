import React, { useState } from 'react';
import { ConsentRecord, UserMemoryItem, NavTab } from '../../types';
import { 
  ShieldCheck, 
  Key, 
  Lock, 
  Trash2, 
  Download, 
  Check, 
  X, 
  Eye, 
  EyeOff, 
  Cpu, 
  RefreshCw, 
  AlertTriangle,
  History
} from 'lucide-react';

interface PrivacyCenterProps {
  consents: ConsentRecord[];
  memories: UserMemoryItem[];
  setActiveTab: (tab: NavTab) => void;
}

export const PrivacyCenter: React.FC<PrivacyCenterProps> = ({
  consents: initialConsents,
  memories: initialMemories,
  setActiveTab,
}) => {
  const [consents, setConsents] = useState<ConsentRecord[]>(initialConsents);
  const [memories, setMemories] = useState<UserMemoryItem[]>(initialMemories);
  const [isMemoryActive, setIsMemoryActive] = useState<boolean>(true);
  const [toast, setToast] = useState<string | null>(null);

  const handleRevokeConsent = (id: string) => {
    setConsents(prev => prev.map(c => c.id === id ? { ...c, status: 'REVOKED' } : c));
    setToast('Consent revoked. Cryptographic access token invalidated.');
    setTimeout(() => setToast(null), 3000);
  };

  const handleDeleteMemory = (id: string) => {
    setMemories(prev => prev.filter(m => m.id !== id));
    setToast('Memory record deleted permanently from AI context.');
    setTimeout(() => setToast(null), 3000);
  };

  const handleExportData = () => {
    const payload = {
      patientDID: 'did:ion:dr-t:88492x-morgan',
      exportedAt: new Date().toISOString(),
      consents,
      memories,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dr_t_sovereign_health_data_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setToast('Exported complete sovereign health & privacy archive (JSON).');
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Sovereign Identity, Consent & Privacy Center
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Zero-knowledge proofs, client-side data sovereignty, active consent receipts, and granular AI memory management.
          </p>
        </div>

        <button
          onClick={handleExportData}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center space-x-2 shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Sovereign Archive</span>
        </button>
      </div>

      {toast && (
        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-950 font-semibold flex items-center justify-between animate-in fade-in">
          <span>{toast}</span>
          <button onClick={() => setToast(null)} className="text-indigo-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* DID Identity Card */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Key className="w-4 h-4 text-teal-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Decentralized Sovereign Identifier (DID)
            </span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-teal-500/20 text-teal-300 font-bold">
            Verifiable Credential Active
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
          <span className="font-mono text-xs text-emerald-400 truncate">
            did:ion:dr-t:88492x-morgan-2026-zkp-enclave
          </span>
          <span className="text-[10px] text-slate-400 shrink-0 font-mono">
            Ed25519 Curve • Hardware Secure Enclave
          </span>
        </div>
      </div>

      {/* Main Grid: Consent Receipts & AI Memory Control */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Consent Receipts (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Active Consent Receipts & ZKP Tokens</h3>
              <span className="text-[10px] text-slate-500">GDPR & HIPAA compliant</span>
            </div>

            <div className="space-y-3">
              {consents.map((c) => (
                <div key={c.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-100 text-indigo-800">
                      {c.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      c.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {c.status}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900">{c.purpose}</h4>
                  <p className="text-[11px] text-slate-500">Recipient: <span className="font-semibold text-slate-700">{c.recipient}</span></p>

                  <div className="p-2 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span className="truncate max-w-xs">{c.zkpProofHash}</span>
                    <span className="text-teal-700 font-bold shrink-0">ZKP Verified</span>
                  </div>

                  {c.status === 'ACTIVE' && (
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => handleRevokeConsent(c.id)}
                        className="text-[11px] font-bold text-rose-600 hover:text-rose-800 transition"
                      >
                        Revoke Access Immediately
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: AI Memory Control Layer (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-900">Dr. T AI Memory Layer</h3>
                <p className="text-[11px] text-slate-500">Inspect & curate personal health memories</p>
              </div>

              <button
                onClick={() => {
                  setIsMemoryActive(!isMemoryActive);
                  setToast(`AI Memory ${!isMemoryActive ? 'Enabled' : 'Paused'}`);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                  isMemoryActive ? 'bg-teal-100 text-teal-900' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {isMemoryActive ? <Eye className="w-3.5 h-3.5 text-teal-700" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{isMemoryActive ? 'Memory On' : 'Paused'}</span>
              </button>
            </div>

            <div className="space-y-3">
              {memories.map((mem) => (
                <div key={mem.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {mem.category}
                    </span>
                    <button
                      onClick={() => handleDeleteMemory(mem.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition"
                      title="Erase memory"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed">{mem.content}</p>
                  <div className="text-[10px] text-slate-400">Learned via {mem.source}</div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setMemories([]);
                  setToast('All personal memories purged permanently.');
                }}
                className="w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition"
              >
                Purge All AI Memories
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
