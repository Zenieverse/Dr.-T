import React, { useState } from 'react';
import { EconomyAgentService, NavTab } from '../../types';
import { 
  Zap, 
  Wallet, 
  Cpu, 
  Clock, 
  Star, 
  ArrowRight, 
  Play, 
  CheckCircle2, 
  RefreshCw, 
  Sparkles 
} from 'lucide-react';

interface AgentEconomyProps {
  services: EconomyAgentService[];
  setActiveTab: (tab: NavTab) => void;
}

export const AgentEconomy: React.FC<AgentEconomyProps> = ({
  services,
  setActiveTab,
}) => {
  const [walletBalanceUSD, setWalletBalanceUSD] = useState<number>(25.00);
  const [selectedService, setSelectedService] = useState<EconomyAgentService>(services[0]);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionOutput, setExecutionOutput] = useState<string | null>(null);

  const handleTestInvoke = (svc: EconomyAgentService) => {
    setIsExecuting(true);
    setExecutionOutput(null);

    setTimeout(() => {
      setWalletBalanceUSD(prev => Math.max(0, +(prev - svc.pricePerCallUSD).toFixed(4)));
      setIsExecuting(false);
      setExecutionOutput(JSON.stringify({
        status: 200,
        x402_receipt: `x402_txn_${Math.random().toString(36).substring(2, 11)}`,
        agent: svc.agentName,
        latency_ms: svc.avgLatencyMs + Math.floor(Math.random() * 8),
        settlement_status: "SETTLED_VIA_L2_CHANNEL",
        result: {
          success: true,
          processed_at: new Date().toISOString(),
          metrics: { confidence: 0.982, validation_passed: true }
        }
      }, null, 2));
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header & Simulated x402 Wallet */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200">
              <Zap className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              AI Agent Economy & x402 Marketplace
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Decentralized micro-transactions and machine-to-machine HTTP 402 payment settlement for specialized biomedical models.
          </p>
        </div>

        {/* Balance Card */}
        <div className="flex items-center space-x-3 p-3.5 rounded-2xl bg-slate-900 text-white shrink-0">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
            <Wallet className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-mono">x402 Credit Balance</div>
            <div className="text-base font-black text-amber-400 font-display">${walletBalanceUSD.toFixed(4)} USD</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Marketplace Listings & Live Invoke Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Agent Service Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Verified Healthcare Agent Services</h3>

            <div className="space-y-3">
              {services.map((svc) => {
                const isSelected = selectedService.id === svc.id;
                return (
                  <div
                    key={svc.id}
                    onClick={() => setSelectedService(svc)}
                    className={`p-4 rounded-2xl border transition cursor-pointer ${
                      isSelected
                        ? 'bg-slate-50 border-amber-500 shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-slate-900">{svc.agentName}</span>
                        <span className="px-2 py-0.2 rounded text-[10px] font-mono bg-slate-100 text-slate-700">
                          {svc.avgLatencyMs}ms avg
                        </span>
                      </div>

                      <div className="text-right font-mono">
                        <span className="text-xs font-black text-amber-600">${svc.pricePerCallUSD.toFixed(3)}</span>
                        <span className="text-[10px] text-slate-400"> / call</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{svc.capability}</p>

                    <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100 text-[11px] text-slate-500">
                      <div className="flex items-center space-x-1 text-amber-600 font-semibold">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{svc.reputationScore}% Reputation</span>
                      </div>

                      <span className="font-mono">{svc.totalCalls.toLocaleString()} Calls Processed</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Live x402 Payment & Invocation Console (5 cols) */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900">x402 Micro-Transaction Runner</h3>
              <p className="text-xs text-slate-500">{selectedService.agentName}</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block">Agent Endpoint:</span>
                <code className="font-mono text-slate-700 block">{selectedService.endpoint}</code>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-[11px] space-y-1 overflow-x-auto">
                <span className="text-slate-400 font-sans font-bold block">Input Payload:</span>
                <pre>{selectedService.sampleInput}</pre>
              </div>

              <button
                onClick={() => handleTestInvoke(selectedService)}
                disabled={isExecuting}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 disabled:opacity-40 transition flex items-center justify-center space-x-2"
              >
                {isExecuting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Settling x402 Micro-Debit...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Invoke Agent (${selectedService.pricePerCallUSD.toFixed(3)})</span>
                  </>
                )}
              </button>

              {/* Execution Output */}
              {executionOutput && (
                <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-teal-300 font-mono text-[11px] overflow-x-auto space-y-1 animate-in fade-in">
                  <span className="text-slate-400 font-sans font-bold block">Settlement & Response:</span>
                  <pre>{executionOutput}</pre>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
