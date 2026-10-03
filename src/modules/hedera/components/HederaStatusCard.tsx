// ==========================================
// HEDERA COMMONS: HederaStatusCard COMPONENT
// ==========================================

import React, { useState } from 'react';
import { Network, Radio, Copy, Check, ExternalLink, Sparkles, RefreshCw } from 'lucide-react';
import { HederaStatusResponse } from '../types/hedera';

interface HederaStatusCardProps {
  status: HederaStatusResponse | null;
  isLoading?: boolean;
  onRefresh?: () => void;
  className?: string;
}

export const HederaStatusCard: React.FC<HederaStatusCardProps> = ({
  status,
  isLoading = false,
  onRefresh,
  className = ''
}) => {
  const [copiedTopic, setCopiedTopic] = useState(false);

  const copyTopic = () => {
    if (!status?.topicId) return;
    navigator.clipboard.writeText(status.topicId);
    setCopiedTopic(true);
    setTimeout(() => setCopiedTopic(false), 2000);
  };

  const isReal = status?.mode === 'real';

  return (
    <div className={`p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 shadow-inner">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm text-slate-900">
                Hedera {status?.network ? status.network.toUpperCase() : 'TESTNET'}
              </span>
              <span className={`w-2 h-2 rounded-full ${
                status?.status === 'CONNECTED' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`} />
            </div>
            <span className="text-[11px] text-slate-500">
              {isReal ? 'Live Hedera Consensus Network' : 'Development / Mock Mode (Cryptographic Sandbox)'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition disabled:opacity-50"
              title="Refresh connection status"
              aria-label="Refresh status"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          )}

          {isReal ? (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
              Production Live
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              <span>Dev Sandbox</span>
            </span>
          )}
        </div>
      </div>

      {/* Attributes Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono pt-1">
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <span className="text-[10px] text-slate-500 block uppercase font-sans font-bold">HCS Topic ID</span>
          <div className="flex items-center justify-between font-bold text-purple-700">
            <span>{status?.topicId || '0.0.5892147'}</span>
            <button onClick={copyTopic} className="text-slate-400 hover:text-purple-600 transition" title="Copy Topic ID">
              {copiedTopic ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <span className="text-[10px] text-slate-500 block uppercase font-sans font-bold">Operator Account</span>
          <span className="font-bold text-slate-800 truncate block">
            {status?.operatorAccountMasked || '0.0.******'}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <span className="text-[10px] text-slate-500 block uppercase font-sans font-bold">HBAR Balance</span>
          <span className="font-bold text-emerald-700 truncate block">
            {status?.hbarBalance || 'Sandbox'}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <span className="text-[10px] text-slate-500 block uppercase font-sans font-bold">Mirror Node</span>
          <span className="font-bold text-indigo-700 truncate block" title={status?.mirrorNodeUrl}>
            Hedera REST v1
          </span>
        </div>
      </div>
    </div>
  );
};
