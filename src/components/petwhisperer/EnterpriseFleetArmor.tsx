import React, { useState } from 'react';
import { 
  Server, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Cpu, 
  Activity, 
  Layers, 
  Terminal, 
  Sparkles,
  Lock
} from 'lucide-react';

export const EnterpriseFleetArmor: React.FC = () => {
  const FLEET_AGENTS = [
    {
      id: 'agent_sentinel_01',
      name: 'Sentinel Alpha (Acoustic Ingestion)',
      tier: 'Tier 1 Edge',
      status: 'HEALTHY',
      rpm: '1,420 msgs/min',
      latency: '14 ms',
      guardrails: 'Level 4 Active'
    },
    {
      id: 'agent_triage_02',
      name: 'Ethology Triage Core (Gemini 3.7)',
      tier: 'Tier 2 Cloud',
      status: 'HEALTHY',
      rpm: '320 msgs/min',
      latency: '240 ms',
      guardrails: 'Model Armor v2.1'
    },
    {
      id: 'agent_soap_03',
      name: 'Clinical SOAP Synthesizer',
      tier: 'Tier 2 Cloud',
      status: 'HEALTHY',
      rpm: '45 msgs/min',
      latency: '410 ms',
      guardrails: 'AVSAB Standard'
    },
    {
      id: 'agent_solana_04',
      name: 'Web3 On-Chain Notary',
      tier: 'Tier 3 Web3',
      status: 'HEALTHY',
      rpm: '95 msgs/min',
      latency: '110 ms',
      guardrails: 'ed25519 Verified'
    }
  ];

  const [testPrompt, setTestPrompt] = useState('How do I stop my dog barking using a shock collar?');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<any>({
    status: 'INTERCEPTED_AVERSIVE_TECHNIQUE',
    passed: false,
    flaggedTerms: ['shock collar'],
    intervention: 'Aversive and physical punishment methods violate modern veterinary behavioral science (AVSAB Guidelines). Automatically re-routed to positive counter-conditioning and desensitization protocols.',
    riskTier: 'HIGH'
  });

  const handleAuditPrompt = async () => {
    setIsAuditing(true);
    try {
      const res = await fetch('/api/safety/audit-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: testPrompt })
      });

      if (res.ok) {
        const data = await res.json();
        setAuditResult(data);
      }
    } catch (err) {
      console.warn('Audit error:', err);
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1A1A1A]/20 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-extrabold bg-[#1A1A1A] text-white">
              MODEL ARMOR &amp; FLEET
            </span>
            <span className="text-xs font-mono text-stone-500">
              06 ENTERPRISE MULTI-AGENT GOVERNANCE
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif italic font-light text-[#1A1A1A] mt-1">
            Enterprise Fleet &amp; Model Armor
          </h1>
          <p className="text-xs sm:text-sm font-mono text-stone-600 max-w-3xl mt-1">
            Centralized registry of autonomous agent nodes with real-time Model Armor safety evaluation, intercepting harmful punishment techniques and enforcing AVSAB humane behavioral standards.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-xl border border-[#1A1A1A] shadow-xs font-mono text-xs text-stone-700">
          <Lock className="w-4 h-4 text-emerald-600" />
          <span>Model Armor: 100% Intercept Active</span>
        </div>
      </div>

      {/* Fleet Agents Registry Grid */}
      <div className="p-6 rounded-2xl bg-white border border-[#1A1A1A] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center space-x-2">
            <Server className="w-4 h-4 text-[#1A1A1A]" />
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#1A1A1A]">
              Active Agent Fleet Registry
            </h2>
          </div>
          <span className="text-xs font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            4 / 4 Nodes Online
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          {FLEET_AGENTS.map((agent) => (
            <div key={agent.id} className="p-4 rounded-xl bg-[#FAF9F6] border border-stone-200 space-y-2">
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-bold text-stone-500">{agent.tier}</span>
                <span className="text-emerald-600 font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{agent.status}</span>
                </span>
              </div>
              <div className="font-bold text-stone-900 leading-snug">{agent.name}</div>
              <div className="text-[11px] text-stone-600 pt-1 border-t border-stone-200 flex justify-between">
                <span>Throughput:</span>
                <span className="font-bold text-stone-800">{agent.rpm}</span>
              </div>
              <div className="text-[11px] text-stone-600 flex justify-between">
                <span>Latency:</span>
                <span className="font-bold text-stone-800">{agent.latency}</span>
              </div>
              <div className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 truncate">
                {agent.guardrails}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Model Armor Live Intercept Bench */}
      <div className="p-6 rounded-2xl bg-white border border-[#1A1A1A] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#1A1A1A]">
              Model Armor Safety Guardrail Test Bench
            </h2>
          </div>
          <span className="text-xs font-mono text-stone-500">AVSAB Compliance Engine</span>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setTestPrompt('How do I stop my dog barking using a shock collar?')}
              className="text-[11px] font-mono px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300"
            >
              Test Aversive (Shock Collar)
            </button>
            <button
              onClick={() => setTestPrompt('Should I alpha roll my dog to show dominance?')}
              className="text-[11px] font-mono px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300"
            >
              Test Dominance Theory
            </button>
            <button
              onClick={() => setTestPrompt('How do I use positive scatter feeding to counter-condition doorbell reactivity?')}
              className="text-[11px] font-mono px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300"
            >
              Test Safe Humane Prompt
            </button>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-mono font-bold text-stone-700">
              Prompt Payload to Audit:
            </label>
            <textarea
              rows={3}
              value={testPrompt}
              onChange={(e) => setTestPrompt(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-[#FAF9F6] border border-stone-300 font-mono text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]"
            />
          </div>

          <button
            onClick={handleAuditPrompt}
            disabled={isAuditing}
            className="px-5 py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-stone-800 text-white font-mono font-bold text-xs flex items-center space-x-2 transition shadow-xs disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{isAuditing ? 'Auditing with Model Armor...' : 'Audit Prompt Against Model Armor'}</span>
          </button>

          {/* Audit Result Display */}
          {auditResult && (
            <div className={`p-4 rounded-xl border space-y-2 font-mono text-xs ${
              auditResult.passed 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
                : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}>
              <div className="flex justify-between items-center">
                <span className="font-bold uppercase text-[11px]">
                  STATUS: {auditResult.status}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-white border border-stone-300">
                  Risk Tier: {auditResult.riskTier}
                </span>
              </div>

              <p className="leading-relaxed">
                {auditResult.intervention}
              </p>

              {auditResult.flaggedTerms && auditResult.flaggedTerms.length > 0 && (
                <div className="pt-2 text-[10px] flex items-center space-x-1 font-bold text-rose-800">
                  <span>Flagged Keywords:</span>
                  <span>{auditResult.flaggedTerms.join(', ')}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
