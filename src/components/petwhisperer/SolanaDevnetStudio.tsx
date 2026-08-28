import React, { useState } from 'react';
import { 
  Coins, 
  ShieldCheck, 
  ExternalLink, 
  Copy, 
  CheckCircle2, 
  Sparkles, 
  ArrowUpRight, 
  Layers, 
  Wallet,
  Plus
} from 'lucide-react';

export const SolanaDevnetStudio: React.FC = () => {
  const [walletAddress] = useState('7XpZ8...PetWhispererDevnet...9aL2');
  const [treatsBalance, setTreatsBalance] = useState(250);
  const [copiedTx, setCopiedTx] = useState<string | null>(null);
  const [isMinting, setIsMinting] = useState(false);

  const [onChainEvents, setOnChainEvents] = useState([
    {
      txSig: '5KqY8x7mDevnetTxn7x9aP2b',
      type: 'CANINE_DE_ESCALATION_REWARD',
      subject: 'Buster (Golden Retriever)',
      arousalReduction: '-38%',
      treatsAmount: 26,
      slot: 284910244,
      timestamp: '2 mins ago'
    },
    {
      txSig: '3NmP4k2L8wQ9xDevnet77a',
      type: 'CANINE_DE_ESCALATION_REWARD',
      subject: 'Buster (Golden Retriever)',
      arousalReduction: '-45%',
      treatsAmount: 28,
      slot: 284909810,
      timestamp: '18 mins ago'
    },
    {
      txSig: '8VxL1q9M4zP2kDevnet12c',
      type: 'CANINE_DE_ESCALATION_REWARD',
      subject: 'Buster (Golden Retriever)',
      arousalReduction: '-28%',
      treatsAmount: 23,
      slot: 284908950,
      timestamp: '45 mins ago'
    }
  ]);

  const handleMintDevnetTreats = () => {
    setIsMinting(true);
    setTimeout(() => {
      setTreatsBalance(prev => prev + 50);
      const newTx = {
        txSig: '4YtN9' + Math.random().toString(36).substring(2, 10) + 'DevnetTx',
        type: 'MANUAL_DECENTRALIZED_GRANT',
        subject: 'Buster (Golden Retriever)',
        arousalReduction: 'N/A',
        treatsAmount: 50,
        slot: 284910300 + Math.floor(Math.random() * 100),
        timestamp: 'Just now'
      };
      setOnChainEvents(prev => [newTx, ...prev]);
      setIsMinting(false);
    }, 600);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTx(text);
    setTimeout(() => setCopiedTx(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1A1A1A]/20 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-extrabold bg-[#1A1A1A] text-white">
              SOLANA DEVNET WEB3
            </span>
            <span className="text-xs font-mono text-stone-500">
              09 ED25519 CANINE PASSPORT &amp; TREATS MINT
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif italic font-light text-[#1A1A1A] mt-1">
            Solana Devnet On-Chain Ledger
          </h1>
          <p className="text-xs sm:text-sm font-mono text-stone-600 max-w-3xl mt-1">
            Cryptographic ed25519 behavioral passports, decentralized de-escalation proof recording, and TREATS token minting on Solana Devnet.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleMintDevnetTreats}
            disabled={isMinting}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-stone-800 text-white font-mono font-bold text-xs transition shadow-xs disabled:opacity-50"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>{isMinting ? 'Minting on Devnet...' : 'Claim +50 Devnet TREATS'}</span>
          </button>
        </div>
      </div>

      {/* Wallet Balance & Passport Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
        
        <div className="p-6 rounded-2xl bg-white border border-[#1A1A1A] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[10px] uppercase font-bold">TREATS TOKEN BALANCE</span>
            <Coins className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-stone-900">
            {treatsBalance} <span className="text-sm font-normal text-stone-500">TREATS</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-bold">
            +$0.00 Gas on Devnet
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#1A1A1A] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[10px] uppercase font-bold">CANINE ON-CHAIN PASSPORT</span>
            <ShieldCheck className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-base font-bold text-stone-900 truncate">
            🐾 Buster (CGC Certified)
          </div>
          <div className="text-[11px] text-purple-800 font-mono truncate">
            ed25519 ID: 9f8a...c3d1
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-[#1A1A1A] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[10px] uppercase font-bold">SOLANA CLUSTER</span>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="text-base font-bold text-stone-900">
            Solana Devnet
          </div>
          <div className="text-[11px] text-stone-500 font-mono">
            Slot: 284,910,244 (&lt;400ms finality)
          </div>
        </div>

      </div>

      {/* Verified On-Chain Transactions */}
      <div className="p-6 rounded-2xl bg-white border border-[#1A1A1A] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center space-x-2">
            <Coins className="w-4 h-4 text-purple-600" />
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#1A1A1A]">
              Immutable Behavioral De-escalation Proofs
            </h2>
          </div>
          <span className="text-xs font-mono text-stone-500">{onChainEvents.length} On-Chain Records</span>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {onChainEvents.map((evt, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[#FAF9F6] border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-stone-900">{evt.type}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 font-bold">
                    Slot {evt.slot}
                  </span>
                </div>
                <div className="text-[11px] text-stone-600 flex items-center space-x-2">
                  <span>Tx: {evt.txSig}</span>
                  <button
                    onClick={() => handleCopy(evt.txSig)}
                    className="hover:text-stone-900 text-stone-400"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  {copiedTx === evt.txSig && <span className="text-[9px] text-emerald-600 font-bold">Copied!</span>}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="font-bold text-emerald-700 text-sm">+{evt.treatsAmount} TREATS</div>
                  <div className="text-[10px] text-stone-400">{evt.timestamp}</div>
                </div>

                <a
                  href={`https://explorer.solana.com/tx/${evt.txSig}?cluster=devnet`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-white hover:bg-stone-200 border border-stone-300 text-stone-700 transition"
                  title="View on Solana Explorer"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
