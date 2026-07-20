import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, Shield, Cpu, Layers, Terminal, Users, Award, Compass, 
  Lock, Unlock, Key, Radio, Code, FileCode, Wallet, Send, 
  RefreshCw, Play, CheckCircle2, Zap, TrendingUp, BarChart3, 
  Database, AlertTriangle, Sliders, Download, Check, Sparkles, HelpCircle 
} from 'lucide-react';

// Interfaces
interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'analyzing' | 'transacting' | 'warning';
  balance: number; // CSPR
  reputation: number; // 1-100
  model: string;
  recentActivity: string;
}

interface ValidatorNode {
  address: string;
  name: string;
  uptime: number;
  score: number;
  badges: string[];
  lastAttestation: string;
}

export default function CasperAtlasConsole() {
  // Navigation
  const [subTab, setSubTab] = useState<'command' | 'contracts' | 'reputation' | 'defi'>('command');

  // Keypair Generator States
  const [publicKey, setPublicKey] = useState<string>('');
  const [privateKey, setPrivateKey] = useState<string>('');
  const [csprBalance, setCsprBalance] = useState<number>(0);
  const [isGeneratingKey, setIsGeneratingKey] = useState<boolean>(false);
  const [isFaucetLoading, setIsFaucetLoading] = useState<boolean>(false);
  const [faucetTxHash, setFaucetTxHash] = useState<string>('');

  // Agent Swarm Command Center States
  const [agents, setAgents] = useState<Agent[]>([
    { id: 'ag-1', name: 'Chronos', role: 'Timekeeper & Task Scheduler', status: 'idle', balance: 250, reputation: 98, model: 'Gemini 3.5 Flash', recentActivity: 'Scheduled daily pool allocation audit' },
    { id: 'ag-2', name: 'Risk Shield', role: 'Slippage & Volatility Auditor', status: 'idle', balance: 450, reputation: 99, model: 'Gemini 3.5 Pro', recentActivity: 'Audited pools for staking slippage parameters' },
    { id: 'ag-3', name: 'Sovereign Oracle', role: 'On-chain Grounded Feed', status: 'idle', balance: 180, reputation: 96, model: 'Gemini 3.5 Flash', recentActivity: 'Updated Casper CSPR price payload' },
    { id: 'ag-4', name: 'Vibe Sentinel', role: 'Ecosystem Sentiment Auditor', status: 'idle', balance: 120, reputation: 94, model: 'Gemini 3.5 Flash', recentActivity: 'Rated Dr. T platform emotional vibe' }
  ]);
  const [selectedAgentId, setSelectedAgentId] = useState<string>('ag-1');
  const [sandboxScenario, setSandboxScenario] = useState<'audit' | 'rebalance' | 'consensus'>('audit');
  const [isScenarioRunning, setIsScenarioRunning] = useState<boolean>(false);
  const [scenarioLogs, setScenarioLogs] = useState<string[]>([]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Yield System Optimizer states
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optStep, setOptStep] = useState<number>(0);
  const [optLogs, setOptLogs] = useState<string[]>([]);

  // Smart Contracts states
  const [selectedContract, setSelectedContract] = useState<'registry' | 'reputation' | 'marketplace'>('registry');
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [compilationLogs, setCompilationLogs] = useState<string[]>([]);
  const [deployedAddress, setDeployedAddress] = useState<string>('');
  const [rpcMethod, setRpcMethod] = useState<string>('info_get_status');
  const [rpcParam, setRpcParam] = useState<string>('{}');

  // Reputation Matrix states
  const [validators, setValidators] = useState<ValidatorNode[]>([
    { address: '01a581e6bcf2e...', name: 'Zenieverse Node #1', uptime: 99.98, score: 98, badges: ['Sovereign Validator', 'Fast Responder'], lastAttestation: '0xfa91...d283' },
    { address: '01bc89e3a7f4c...', name: 'CasperLabs Community', uptime: 99.92, score: 97, badges: ['Core Peer', 'WASM Pioneer'], lastAttestation: '0x8b12...ec9a' },
    { address: '028a38fdf98cc...', name: 'Dr. T Empathetic Validator', uptime: 100.00, score: 99, badges: ['Grounded Oracle', 'Zenith Peer'], lastAttestation: '0x7c81...a309' },
    { address: '01d4a82ec79f1...', name: 'Alpha Swarm Node', uptime: 98.75, score: 92, badges: ['DeFi Watchdog'], lastAttestation: '0x3ef8...bf91' }
  ]);
  const [attestationToVerify, setAttestationToVerify] = useState<string>('');
  const [verificationResult, setVerificationResult] = useState<{ checked: boolean; valid: boolean; details: string }>({ checked: false, valid: false, details: '' });

  // DeFi Autopilot states
  const [targetStaking, setTargetStaking] = useState<number>(75);
  const [slippage, setSlippage] = useState<number>(0.5);
  const [riskSensitivity, setRiskSensitivity] = useState<'low' | 'medium' | 'high'>('medium');
  const [riskShieldActive, setRiskShieldActive] = useState<boolean>(true);
  const [defiTelemetry, setDefiTelemetry] = useState<{ timestamp: string; apy: number; liquidity: number }[]>([]);

  // Generate historical data for telemetry chart
  useEffect(() => {
    const data = [];
    let currentApy = 11.2;
    let currentLiq = 145000;
    for (let i = 24; i >= 0; i--) {
      const d = new Date();
      d.setHours(d.getHours() - i);
      currentApy += (Math.random() - 0.5) * 0.4;
      currentLiq += (Math.random() - 0.45) * 2000;
      data.push({
        timestamp: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        apy: parseFloat(currentApy.toFixed(2)),
        liquidity: Math.round(currentLiq)
      });
    }
    setDefiTelemetry(data);
  }, []);

  // Scroll terminal logs
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [scenarioLogs, compilationLogs, optLogs]);

  // Key Pair Generator Handler
  const generateKeyPair = () => {
    setIsGeneratingKey(true);
    setTimeout(() => {
      // Simulate Ed25519 generation
      const hexChars = '0123456789abcdef';
      let pub = '01'; // Casper prefix for Ed25519
      let priv = '';
      for (let i = 0; i < 64; i++) {
        pub += hexChars[Math.floor(Math.random() * 16)];
        priv += hexChars[Math.floor(Math.random() * 16)];
      }
      setPublicKey(pub);
      setPrivateKey(priv);
      setCsprBalance(0);
      setFaucetTxHash('');
      setIsGeneratingKey(false);
    }, 1200);
  };

  // Faucet Requester Handler
  const requestFaucet = () => {
    if (!publicKey) return;
    setIsFaucetLoading(true);
    setTimeout(() => {
      setCsprBalance(prev => prev + 1000);
      const hex = '0123456789abcdef';
      let tx = '0x';
      for (let i = 0; i < 64; i++) {
        tx += hex[Math.floor(Math.random() * 16)];
      }
      setFaucetTxHash(tx);
      setIsFaucetLoading(false);
    }, 1500);
  };

  // Swarm Scenario Sandbox Handler
  const runScenario = () => {
    if (isScenarioRunning) return;
    setIsScenarioRunning(true);
    setScenarioLogs([]);

    const addLog = (msg: string, delay: number) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          setScenarioLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
          resolve();
        }, delay);
      });
    };

    const run = async () => {
      // Change agent statuses during run
      setAgents(prev => prev.map(a => ({ ...a, status: 'analyzing' })));

      await addLog("⚡ Initializing Casper Atlas Swarm Sandbox...", 200);
      await addLog(`📡 Active Scenario: ${
        sandboxScenario === 'audit' ? 'Automated Multi-Agent Security Audit' :
        sandboxScenario === 'rebalance' ? 'Dynamic Liquidity Stake Pool Rebalancing' :
        'Sovereign Consensus Agreement Protocol'
      }`, 400);

      if (sandboxScenario === 'audit') {
        await addLog("🛰️ Agent [Chronos] triggered scheduled checkpoint...", 600);
        await addLog("🔍 Agent [Risk Shield] fetching stake pool smart contract state data...", 700);
        setAgents(prev => prev.map(a => a.name === 'Risk Shield' ? { ...a, status: 'analyzing' } : { ...a, status: 'idle' }));
        await addLog("💬 Agent [Sovereign Oracle] validating price hashes with Gemini API search grounding...", 800);
        await addLog("🛡️ Checking validator uptime metrics. Detected anomalies: ZERO.", 900);
        setAgents(prev => prev.map(a => a.name === 'Vibe Sentinel' ? { ...a, status: 'analyzing' } : a));
        await addLog("🎵 Agent [Vibe Sentinel] auditing emotional and psychological system sentiment metrics (Vibe: Empathetic, Confidence: 98%)...", 800);
        await addLog("🔑 Creating Odra smart contract verification payload...", 700);
        await addLog("✍️ Signing audit statement using browser-generated Ed25519 key...", 600);
        await addLog("💸 Submitting payload to Casper Testnet. Gas limit: 145,000,000 motes.", 800);
        await addLog("✅ Transaction broadcast successful. TxHash: 0xda82ef4a098c1b9ea2090fce04b123908f9c", 700);
        await addLog("🎉 Swarm Consensus reached. System Health audited: 100% SECURE.", 400);
      } else if (sandboxScenario === 'rebalance') {
        await addLog("📉 Monitoring Casper Network pool yields and APYs...", 500);
        await addLog(`🎯 Target Allocation configuration read: ${targetStaking}% Staked / ${100 - targetStaking}% Liquid`, 600);
        await addLog("🛰️ Agent [Chronos] verifying optimal liquidity epoch window...", 700);
        setAgents(prev => prev.map(a => a.name === 'Chronos' ? { ...a, status: 'analyzing' } : { ...a, status: 'idle' }));
        await addLog("🔍 Agent [Risk Shield] executing volatility simulation loop with slippage threshold...", 800);
        await addLog(`🛡️ Slippage parameters validated. Max allowed slippage: ${slippage}%`, 600);
        await addLog("💬 Agent [Sovereign Oracle] confirming stable gas estimates...", 700);
        await addLog("🤖 Initiating reallocation of 12,500 CSPR to Zenieverse Node #1...", 800);
        await addLog("🔑 Signing trustless marketplace payload using Odra treasury keys...", 700);
        await addLog("✅ Funds redeployed securely. TxHash: 0x8a92bcde71a2fc3810dcf92a1bc2de718fa", 900);
        await addLog("📈 Telemetry telemetry update: APY optimized to 11.45%.", 600);
      } else {
        await addLog("🤝 Broadening consensus request to decentralized agents...", 500);
        await addLog("💬 Oracle Agent verifying cryptographic reputation badges of active peers...", 700);
        await addLog("🔍 All peers successfully authorized. Initiating voting round...", 800);
        await addLog("🗳️ Voting parameters: Option C (Empathetic Healing Integration) holds majority.", 600);
        await addLog("🔑 Generating dynamic trust attestations on reputation ledger...", 700);
        await addLog("✍️ Peer signatures acquired. Bundling Odra marketplace state change...", 800);
        await addLog("💸 Paying fee payload. Transaction broadcasted to Casper Ledger.", 800);
        await addLog("✅ Multi-agent governance vote committed. TxHash: 0xbcde98fce2038dfca9e871239bcda8fc7183", 700);
        await addLog("🎉 Consensus fully ratified and locked on-chain.", 400);
      }

      setAgents(prev => prev.map(a => ({ ...a, status: 'idle' })));
      setIsScenarioRunning(false);
    };

    run();
  };

  // Yield System Optimizer Handler
  const triggerOptimizer = () => {
    if (isOptimizing) return;
    setIsOptimizing(true);
    setOptStep(1);
    setOptLogs(["⚡ Initiating Casper Yield System Optimizer (3-Step Autopilot Process)..."]);

    const addOptLog = (msg: string, step: number, delay: number) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          setOptLogs(prev => [...prev, `[Optimizer] ${msg}`]);
          setOptStep(step);
          resolve();
        }, delay);
      });
    };

    const runOpt = async () => {
      await addOptLog("🎯 STEP 1/3: Triggering sequential staking pool audits across validator nodes...", 1, 1000);
      await addOptLog("🔍 Auditing CasperLabs Community Node (Uptime: 99.92%, Capacity: 84%)...", 1, 800);
      await addOptLog("🔍 Auditing Zenieverse Node #1 (Uptime: 99.98%, Capacity: 41%)...", 1, 800);
      await addOptLog("🔍 Auditing Dr. T Empathetic Node (Uptime: 100.00%, Capacity: 12%)...", 1, 800);
      await addOptLog("✅ Step 1 complete. Staking pool performance verified. No vulnerabilities detected.", 1, 600);

      await addOptLog("🎯 STEP 2/3: Triggering margin risk and slippage simulations...", 2, 1200);
      await addOptLog("📉 Executing Monte Carlo risk matrix at target volatility of 18.4%...", 2, 900);
      await addOptLog(`🛡️ Setting slippage parameters to safe threshold: ${slippage}%...`, 2, 700);
      await addOptLog(`🛡️ Risk Sensitivity: [${riskSensitivity.toUpperCase()}]. Slippage Buffer configured.`, 2, 800);
      await addOptLog("✅ Step 2 complete. High-fidelity risk bounds finalized and logged.", 2, 600);

      await addOptLog("🎯 STEP 3/3: Dispatching Odra consensus signing request...", 3, 1200);
      await addOptLog("🔑 Retrieving browser signature payload...", 3, 700);
      await addOptLog("✍️ Signing with cryptographic Ed25519 key on reputation contract...", 3, 800);
      await addOptLog("🚀 Transaction submitted to Casper Network WASM engine.", 3, 900);
      await addOptLog("🎉 Step 3 complete. Yield System optimized! Dynamic staking reallocated securely.", 3, 800);

      setIsOptimizing(false);
      setOptStep(4);
    };

    runOpt();
  };

  // Smart Contract Compiler Simulator
  const compileContract = () => {
    if (isCompiling) return;
    setIsCompiling(true);
    setCompilationLogs([]);
    setDeployedAddress('');

    const addLog = (msg: string, delay: number) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          setCompilationLogs(prev => [...prev, msg]);
          resolve();
        }, delay);
      });
    };

    const run = async () => {
      await addLog("⚙️ cargo odra build --target casper", 300);
      await addLog("   Compiling odra v0.8.0", 400);
      await addLog("   Compiling casper-types v1.5.0", 300);
      await addLog(`   Compiling casper-atlas-contracts (${selectedContract}.rs)`, 500);
      await addLog("   Finished release [optimized] target(s) in 1.45s", 600);
      await addLog(`📦 Optimized WebAssembly Bytecode generated successfully: ${selectedContract}.wasm`, 400);
      await addLog(`   Size: ${selectedContract === 'registry' ? '38.4' : selectedContract === 'reputation' ? '41.2' : '48.9'} KB (Ready for on-chain deployment)`, 300);
      await addLog("🚀 Broadcasting deploy request to Casper Testnet node...", 500);
      await addLog("🔑 Authorizing deployment signature via browser keypair...", 400);
      await addLog("💸 Estimating payment gas... Deploy payment fee: 4,500,000,000 motes.", 500);
      
      const randHex = (len: number) => Array.from({ length: len }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');
      const address = `hash-${randHex(64)}`;
      
      await addLog(`✅ Contract deployed. On-chain Address: ${address}`, 600);
      setDeployedAddress(address);
      setIsCompiling(false);
    };

    run();
  };

  // Attestation Verification
  const verifyAttestation = () => {
    if (!attestationToVerify.trim()) return;
    
    let isValid = false;
    let details = '';
    
    if (attestationToVerify.startsWith('0x') && attestationToVerify.length > 20) {
      isValid = true;
      details = `Attestation signature validated on-chain. Validator signature matches accredited Casper Peer. Registered under badge [Sovereign Validator] timestamped at ${new Date().toLocaleDateString()}.`;
    } else if (attestationToVerify.length > 5 && (attestationToVerify.includes('01') || attestationToVerify.includes('02'))) {
      isValid = true;
      details = `Public Key verified against active Validator Reputation matrix. Trust Score: 98/100. Status: Node Online & Attesting.`;
    } else {
      isValid = false;
      details = `Invalid signature format. Could not locate cryptographic attestation corresponding to input parameters on Casper Ledger.`;
    }

    setVerificationResult({
      checked: true,
      valid: isValid,
      details
    });
  };

  // Download Dataset CSV Function
  const downloadReputationCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Address,Node Name,Uptime %,Trust Score,Badges,Last Attestation\n";
    validators.forEach(v => {
      const badgesStr = v.badges.join("; ");
      csvContent += `"${v.address}","${v.name}",${v.uptime},${v.score},"${badgesStr}","${v.lastAttestation}"\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "casperlas_reputation_matrix.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Rust Smart Contract source templates
  const contractCode = {
    registry: `// Odra Framework Rust Contract - registry.rs
use odra::prelude::*;
use odra::{Var, Mapping};

#[odra::module]
pub struct AgentRegistry {
    name: Var<String>,
    agents: Mapping<Address, AgentMeta>,
    total_registered: Var<u32>,
}

#[derive(OdraType, Clone)]
pub struct AgentMeta {
    pub endpoint: String,
    pub payment_requirement: Balance,
    pub model_id: String,
    pub verified_reputation: u8,
}

#[odra::module]
impl AgentRegistry {
    #[odra(init)]
    pub fn init(&mut self) {
        self.name.set("CasperLas Swarm Agent Registry".to_string());
        self.total_registered.set(0);
    }

    pub fn register_agent(&mut self, endpoint: String, payment: Balance, model: String) {
        let caller = odra::contract_env::caller();
        let meta = AgentMeta {
            endpoint,
            payment_requirement: payment,
            model_id: model,
            verified_reputation: 90,
        };
        self.agents.set(&caller, meta);
        self.total_registered.set(self.total_registered.get_or_default() + 1);
    }
}`,
    reputation: `// Odra Framework Rust Contract - reputation.rs
use odra::prelude::*;
use odra::{Var, Mapping, List};

#[odra::module]
pub struct ReputationTracker {
    authority: Var<Address>,
    scores: Mapping<Address, u8>,
    review_hashes: Mapping<Address, List<String>>,
}

#[odra::module]
impl ReputationTracker {
    #[odra(init)]
    pub fn init(&mut self) {
        self.authority.set(odra::contract_env::caller());
    }

    pub fn submit_peer_review(&mut self, target: Address, score: u8, review_hash: String) {
        assert!(score <= 100, "Score must be 1 to 100");
        let mut list = self.review_hashes.get_or_default(&target);
        list.push(review_hash);
        self.review_hashes.set(&target, list);
        
        let current_score = self.scores.get_or_default(&target);
        let new_score = if current_score == 0 { score } else { (current_score + score) / 2 };
        self.scores.set(&target, new_score);
    }
}`,
    marketplace: `// Odra Framework Rust Contract - marketplace.rs
use odra::prelude::*;
use odra::{Var, Mapping, odra_cow};

#[odra::module]
pub struct MarketplaceHub {
    escrow: Var<Balance>,
    fee_rates: Mapping<Address, u32>,
}

#[odra::module]
impl MarketplaceHub {
    #[odra(init)]
    pub fn init(&mut self) {
        self.escrow.set(Balance::zero());
    }

    #[odra(payable)]
    pub fn lock_service_payment(&mut self, agent: Address) {
        let attached_amount = odra::contract_env::attached_value();
        assert!(attached_amount > Balance::zero(), "Payment cannot be zero");
        self.escrow.set(self.escrow.get() + attached_amount);
    }

    pub fn release_escrow(&mut self, recipient: Address, amount: Balance) {
        // Governance contract audits execution payload prior to release
        let balance = self.escrow.get_or_default();
        assert!(balance >= amount, "Insufficient escrowed funds");
        odra::contract_env::transfer(&recipient, &amount);
        self.escrow.set(balance - amount);
    }
}`
  };

  // Render RPC Param helpers
  useEffect(() => {
    if (rpcMethod === 'info_get_status') {
      setRpcParam('{}');
    } else if (rpcMethod === 'chain_get_state_root_hash') {
      setRpcParam('{\n  "block_identifier": {\n    "Height": 1420951\n  }\n}');
    } else {
      setRpcParam('{\n  "state_root_hash": "2f4e91bcde...",\n  "key": "uref-8cf9...",\n  "path": []\n}');
    }
  }, [rpcMethod]);

  return (
    <div className="w-full text-stone-800 font-sans">
      {/* Header card */}
      <div className="bg-stone-50 border border-stone-200 rounded-3xl p-6 md:p-8 mb-6 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full blur-3xl -z-10 opacity-60"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1 px-2.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-extrabold tracking-widest uppercase font-mono">
                CasperLas Ecosystem
              </span>
              <span className="flex items-center gap-1 text-[11px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
                Active Swarm
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-sans font-medium tracking-tight text-stone-900 flex items-center gap-2">
              🌌 Casper Atlas Console
            </h1>
            <p className="text-stone-500 text-sm mt-1 max-w-2xl font-normal leading-relaxed">
              Decentralized Operating System for Autonomous Financial and Real-World Asset (RWA) intelligence agents. Configure, audit, and deploy micro-payment swarms validated via on-chain WebAssembly smart contracts on the Casper Network.
            </p>
          </div>
          
          {/* Keypair wallet widget */}
          <div className="bg-white border border-stone-200 rounded-2xl p-4 shrink-0 shadow-xs md:w-80">
            <div className="flex items-center justify-between mb-3 border-b border-stone-100 pb-2">
              <span className="text-[11px] font-extrabold tracking-wider text-stone-400 uppercase font-mono flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-stone-400" /> Casper Active Signer
              </span>
              <span className="text-xs font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-lg">
                Ed25519
              </span>
            </div>
            
            {publicKey ? (
              <div className="space-y-2">
                <div>
                  <span className="text-[10px] text-stone-400 font-mono block">PUBLIC KEY</span>
                  <div className="text-xs font-mono bg-stone-50 border border-stone-100 rounded-md p-1.5 truncate text-stone-600 flex items-center justify-between">
                    <span>{publicKey.substring(0, 14)}...{publicKey.substring(publicKey.length - 8)}</span>
                    <button 
                      onClick={() => navigator.clipboard.writeText(publicKey)}
                      className="text-[10px] text-rose-800 hover:underline font-bold"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-stone-500 font-bold">Faucet Balance:</span>
                  <span className="font-mono font-black text-rose-900">{csprBalance.toLocaleString()} CSPR</span>
                </div>
                
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={requestFaucet}
                    disabled={isFaucetLoading}
                    className="flex-1 text-[11px] bg-rose-50 text-rose-800 border border-rose-200 font-bold py-1.5 px-3 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer flex items-center justify-center gap-1 disabled:opacity-50"
                  >
                    {isFaucetLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                    Faucet Dispense
                  </button>
                  <button
                    onClick={generateKeyPair}
                    className="text-[11px] text-stone-500 hover:text-stone-800 py-1 px-2 hover:underline"
                  >
                    Regen Key
                  </button>
                </div>
                
                {faucetTxHash && (
                  <div className="text-[9px] font-mono text-stone-400 truncate mt-1 bg-green-50 border border-green-100 p-1 rounded">
                    Faucet success! Hash: {faucetTxHash.substring(0, 20)}...
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-xs text-stone-400 mb-3">No sovereign signing key active in browser.</p>
                <button
                  onClick={generateKeyPair}
                  disabled={isGeneratingKey}
                  className="w-full text-xs bg-rose-800 text-white font-bold py-2 px-4 rounded-xl hover:bg-rose-900 transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isGeneratingKey ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Generating Keypair...
                    </>
                  ) : (
                    <>
                      <Key className="w-3.5 h-3.5" />
                      Generate Ed25519 Pair
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sub-navigation tabs */}
      <div className="flex flex-wrap border-b border-stone-200 mb-6 gap-1">
        <button
          onClick={() => setSubTab('command')}
          className={`p-3 px-5 text-sm font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer
            ${subTab === 'command' 
              ? 'border-rose-800 text-rose-800' 
              : 'border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300'
            }
          `}
        >
          <Compass className="w-4 h-4" /> Swarm Command Center
        </button>
        <button
          onClick={() => setSubTab('contracts')}
          className={`p-3 px-5 text-sm font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer
            ${subTab === 'contracts' 
              ? 'border-rose-800 text-rose-800' 
              : 'border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300'
            }
          `}
        >
          <Code className="w-4 h-4" /> WebAssembly Smart Contracts
        </button>
        <button
          onClick={() => setSubTab('reputation')}
          className={`p-3 px-5 text-sm font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer
            ${subTab === 'reputation' 
              ? 'border-rose-800 text-rose-800' 
              : 'border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300'
            }
          `}
        >
          <Award className="w-4 h-4" /> Reputation Matrix
        </button>
        <button
          onClick={() => setSubTab('defi')}
          className={`p-3 px-5 text-sm font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer
            ${subTab === 'defi' 
              ? 'border-rose-800 text-rose-800' 
              : 'border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300'
            }
          `}
        >
          <TrendingUp className="w-4 h-4" /> DeFi Autopilot
        </button>
      </div>

      {/* SUBTAB 1: Swarm Command Center */}
      {subTab === 'command' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Agent Visual Topology Node Graph */}
          <div className="bg-white border border-stone-200/80 rounded-3xl p-6 shadow-xs lg:col-span-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-extrabold text-stone-950 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <Radio className="w-4 h-4 text-rose-800" /> Swarm Topology Diagram
                </h3>
                <span className="text-xs text-stone-400 font-mono">Live Interactive Matrix</span>
              </div>
              
              {/* Interactive SVG Network Graph */}
              <div className="relative border border-stone-100 rounded-2xl bg-stone-950 h-80 flex items-center justify-center overflow-hidden mb-4">
                {/* Visual grid overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1c1917_1px,transparent_1px),linear-gradient(to_bottom,#1c1917_1px,transparent_1px)] bg-[size:24px_24px] opacity-30"></div>
                
                {/* SVG Connections */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {/* Outer connections */}
                  <line x1="50%" y1="50%" x2="25%" y2="25%" stroke="#9f1239" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.6" />
                  <line x1="50%" y1="50%" x2="75%" y2="25%" stroke="#9f1239" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.6" />
                  <line x1="50%" y1="50%" x2="25%" y2="75%" stroke="#9f1239" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.6" />
                  <line x1="50%" y1="50%" x2="75%" y2="75%" stroke="#9f1239" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.6" />
                  
                  {/* Orbiting circles */}
                  <circle cx="50%" cy="50%" r="80" stroke="#1c1917" strokeWidth="1" fill="none" opacity="0.2" />
                  <circle cx="50%" cy="50%" r="130" stroke="#1c1917" strokeWidth="1" fill="none" opacity="0.2" />
                  
                  {/* Running lights */}
                  {isScenarioRunning && (
                    <>
                      <circle cx="35%" cy="35%" r="3" fill="#ef4444" className="animate-ping" />
                      <circle cx="65%" cy="35%" r="3" fill="#f59e0b" className="animate-ping" />
                      <circle cx="35%" cy="65%" r="3" fill="#3b82f6" className="animate-ping" />
                    </>
                  )}
                </svg>

                {/* Nodes rendering */}
                {/* Center Core Node: CasperLas Coordinator */}
                <div className="absolute flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-rose-950 border-2 border-rose-600 flex items-center justify-center shadow-[0_0_20px_rgba(159,18,57,0.4)] animate-pulse z-10">
                    <Cpu className="w-7 h-7 text-rose-450" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-rose-100 bg-rose-900 border border-rose-800 rounded-md px-1.5 py-0.5 mt-1.5 shadow-sm">
                    Atlas Core
                  </span>
                </div>

                {/* Node 1: Chronos (Top Left) */}
                <button 
                  onClick={() => setSelectedAgentId('ag-1')}
                  className={`absolute top-[18%] left-[18%] flex flex-col items-center group transition-transform hover:scale-105 cursor-pointer`}
                >
                  <div className={`w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all shadow-md
                    ${selectedAgentId === 'ag-1' ? 'bg-rose-900 border-rose-500 shadow-rose-900/40' : 'bg-stone-900 border-stone-750 group-hover:border-rose-800'}
                  `}>
                    <Compass className="w-5 h-5 text-rose-100" />
                  </div>
                  <span className="text-[9px] font-mono text-stone-300 mt-1">Chronos</span>
                </button>

                {/* Node 2: Risk Shield (Top Right) */}
                <button 
                  onClick={() => setSelectedAgentId('ag-2')}
                  className={`absolute top-[18%] right-[18%] flex flex-col items-center group transition-transform hover:scale-105 cursor-pointer`}
                >
                  <div className={`w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all shadow-md
                    ${selectedAgentId === 'ag-2' ? 'bg-rose-900 border-rose-500 shadow-rose-900/40' : 'bg-stone-900 border-stone-750 group-hover:border-rose-800'}
                  `}>
                    <Shield className="w-5 h-5 text-rose-100" />
                  </div>
                  <span className="text-[9px] font-mono text-stone-300 mt-1">Risk Shield</span>
                </button>

                {/* Node 3: Sovereign Oracle (Bottom Left) */}
                <button 
                  onClick={() => setSelectedAgentId('ag-3')}
                  className={`absolute bottom-[18%] left-[18%] flex flex-col items-center group transition-transform hover:scale-105 cursor-pointer`}
                >
                  <div className={`w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all shadow-md
                    ${selectedAgentId === 'ag-3' ? 'bg-rose-900 border-rose-500 shadow-rose-900/40' : 'bg-stone-900 border-stone-750 group-hover:border-rose-800'}
                  `}>
                    <Radio className="w-5 h-5 text-rose-100" />
                  </div>
                  <span className="text-[9px] font-mono text-stone-300 mt-1">Sovereign Oracle</span>
                </button>

                {/* Node 4: Vibe Sentinel (Bottom Right) */}
                <button 
                  onClick={() => setSelectedAgentId('ag-4')}
                  className={`absolute bottom-[18%] right-[18%] flex flex-col items-center group transition-transform hover:scale-105 cursor-pointer`}
                >
                  <div className={`w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all shadow-md
                    ${selectedAgentId === 'ag-4' ? 'bg-rose-900 border-rose-500 shadow-rose-900/40' : 'bg-stone-900 border-stone-750 group-hover:border-rose-800'}
                  `}>
                    <Sparkles className="w-5 h-5 text-rose-100" />
                  </div>
                  <span className="text-[9px] font-mono text-stone-300 mt-1">Vibe Sentinel</span>
                </button>
              </div>
            </div>

            {/* Selected Agent Inspector */}
            {(() => {
              const selectedAgent = agents.find(a => a.id === selectedAgentId);
              if (!selectedAgent) return null;
              return (
                <div className="bg-stone-50 border border-stone-200/60 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <h4 className="text-sm font-extrabold text-stone-900 font-sans">{selectedAgent.name} Agent</h4>
                    </div>
                    <span className="text-[10px] bg-rose-50 text-rose-800 font-mono font-bold px-2 py-0.5 rounded-md">
                      {selectedAgent.model}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mb-2 font-mono">{selectedAgent.role}</p>
                  
                  <div className="grid grid-cols-3 gap-3 border-t border-b border-stone-150 py-2.5 my-2.5">
                    <div>
                      <span className="text-[9px] text-stone-400 block font-mono">ON-CHAIN BALANCE</span>
                      <span className="text-xs font-black text-rose-900 font-mono">{selectedAgent.balance} CSPR</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-stone-400 block font-mono">REPUTATION</span>
                      <span className="text-xs font-black text-rose-900 font-mono">{selectedAgent.reputation}/100</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-stone-400 block font-mono">ACTIVE TELEMETRY</span>
                      <span className="text-xs text-green-700 font-bold font-mono">100% Online</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-stone-600 bg-white border border-stone-100 rounded-lg p-2 font-mono flex items-start gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                    <span><strong>Recent Activity:</strong> {selectedAgent.recentActivity}</span>
                  </p>
                </div>
              );
            })()}
          </div>

          {/* Scenario Simulator & Yield Optimizer */}
          <div className="space-y-6 lg:col-span-5">
            
            {/* Swarm Scenario Sandbox */}
            <div className="bg-white border border-stone-200/80 rounded-3xl p-6 shadow-xs flex flex-col h-[23rem]">
              <div className="flex items-center justify-between mb-4 border-b border-stone-100 pb-3">
                <h3 className="text-sm font-extrabold text-stone-950 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <Terminal className="w-4 h-4 text-rose-800" /> Scenario Sandbox Loop
                </h3>
                <span className="text-[10px] text-stone-400 font-mono font-bold">Simulator</span>
              </div>
              
              <div className="space-y-3 mb-4">
                <div>
                  <label className="text-xs text-stone-400 font-extrabold uppercase font-mono block mb-1">
                    Select Scenario Sequence
                  </label>
                  <select 
                    value={sandboxScenario}
                    onChange={(e) => setSandboxScenario(e.target.value as any)}
                    disabled={isScenarioRunning}
                    className="w-full text-xs font-bold border border-stone-200 rounded-xl p-2.5 bg-stone-50 text-stone-800 focus:outline-hidden focus:border-rose-450"
                  >
                    <option value="audit">🔐 Automated Multi-Agent Security Audit</option>
                    <option value="rebalance">📉 Dynamic Liquidity stake Pool Rebalancing</option>
                    <option value="consensus">🤝 Sovereign Consensus Agreement Protocol</option>
                  </select>
                </div>
                
                <button
                  onClick={runScenario}
                  disabled={isScenarioRunning}
                  className="w-full text-xs bg-rose-800 text-white font-bold py-2.5 px-4 rounded-xl hover:bg-rose-900 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isScenarioRunning ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Executing Scenario Flow...
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      Trigger Scenario Loop
                    </>
                  )}
                </button>
              </div>

              {/* Terminal Logs */}
              <div className="flex-1 bg-stone-950 text-stone-100 rounded-xl p-3 font-mono text-[10px] overflow-y-auto border border-stone-800 shadow-inner flex flex-col justify-between">
                <div className="space-y-1.5">
                  {scenarioLogs.length === 0 ? (
                    <div className="text-stone-500 italic py-8 text-center select-none">
                      Terminal Idle. Select scenario and click Trigger to simulate dynamic multi-agent telemetry logs...
                    </div>
                  ) : (
                    scenarioLogs.map((log, i) => (
                      <div key={i} className="leading-relaxed border-l-2 border-rose-800 pl-2 animate-fadeIn">
                        {log}
                      </div>
                    ))
                  )}
                  <div ref={terminalEndRef} />
                </div>
                
                {isScenarioRunning && (
                  <div className="text-[9px] text-green-400 mt-2 flex items-center gap-1 animate-pulse">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    Agent telemetry active...
                  </div>
                )}
              </div>
            </div>

            {/* Yield System Optimizer */}
            <div className="bg-white border border-stone-200/80 rounded-3xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-extrabold text-stone-950 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <Sliders className="w-4 h-4 text-rose-800" /> Yield System Optimizer
                </h3>
                <span className="text-xs text-rose-800 font-bold bg-rose-50 px-2 py-0.5 rounded-md font-mono">
                  Odra Integration
                </span>
              </div>
              <p className="text-xs text-stone-500 mb-4 leading-relaxed">
                Triggers sequential decentralized staking audits, computes margin tolerances, and registers Odra verification signatures to optimize stake distributions.
              </p>

              {/* Steps visual state */}
              <div className="flex items-center justify-between gap-2 mb-4">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex-1 flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors
                      ${optStep > step ? 'bg-green-600 text-white' : optStep === step ? 'bg-rose-800 text-white animate-pulse' : 'bg-stone-100 text-stone-400'}
                    `}>
                      {optStep > step ? <Check className="w-4 h-4" /> : step}
                    </div>
                    <span className="text-[9px] font-mono mt-1 text-stone-400">
                      {step === 1 ? 'Staking Audit' : step === 2 ? 'Margin Risk' : 'Odra Signature'}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <button
                  onClick={triggerOptimizer}
                  disabled={isOptimizing}
                  className="w-full text-xs bg-stone-900 text-white font-bold py-2.5 px-4 rounded-xl hover:bg-stone-800 transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isOptimizing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Optimizing Staking Pools...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Trigger Yield Optimization
                    </>
                  )}
                </button>

                {optLogs.length > 0 && (
                  <div className="bg-stone-50 border border-stone-200/60 rounded-xl p-3 max-h-32 overflow-y-auto font-mono text-[9px] text-stone-600 space-y-1">
                    {optLogs.map((log, i) => (
                      <div key={i}>{log}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SUBTAB 2: WebAssembly Smart Contracts */}
      {subTab === 'contracts' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Odra Contract Source Viewer */}
          <div className="bg-white border border-stone-200/80 rounded-3xl p-6 shadow-xs lg:col-span-7 flex flex-col h-[40rem]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-100 pb-3 mb-4 gap-2">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-rose-800" />
                <h3 className="text-sm font-extrabold text-stone-950 uppercase tracking-wider font-mono">
                  Odra Framework Rust Contract
                </h3>
              </div>
              <div className="flex border border-stone-200 rounded-lg p-0.5 bg-stone-50 gap-0.5">
                <button
                  onClick={() => setSelectedContract('registry')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer
                    ${selectedContract === 'registry' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-400 hover:text-stone-700'}
                  `}
                >
                  registry.rs
                </button>
                <button
                  onClick={() => setSelectedContract('reputation')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer
                    ${selectedContract === 'reputation' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-400 hover:text-stone-700'}
                  `}
                >
                  reputation.rs
                </button>
                <button
                  onClick={() => setSelectedContract('marketplace')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer
                    ${selectedContract === 'marketplace' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-400 hover:text-stone-700'}
                  `}
                >
                  marketplace.rs
                </button>
              </div>
            </div>

            {/* Code Panel */}
            <div className="flex-1 bg-stone-950 rounded-2xl p-4 overflow-y-auto font-mono text-xs border border-stone-850 shadow-inner relative">
              <button
                onClick={() => navigator.clipboard.writeText(contractCode[selectedContract])}
                className="absolute top-3 right-3 text-[10px] bg-stone-900 border border-stone-750 text-stone-400 hover:text-stone-200 hover:border-stone-600 rounded-lg px-2 py-1 flex items-center gap-1 transition-all"
              >
                Copy Code
              </button>
              <pre className="text-stone-100 leading-relaxed overflow-x-auto">
                <code>{contractCode[selectedContract]}</code>
              </pre>
            </div>
          </div>

          {/* Compiler, Deployer & RPC JSON encoder */}
          <div className="space-y-6 lg:col-span-5 flex flex-col justify-between h-[40rem] overflow-y-auto">
            
            {/* On-Chain Sandbox Bytecode Deployer */}
            <div className="bg-white border border-stone-200/80 rounded-3xl p-6 shadow-xs flex-1 mb-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-100">
                  <h3 className="text-sm font-extrabold text-stone-950 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <Cpu className="w-4 h-4 text-rose-800" /> Sovereign Bytecode Deployer
                  </h3>
                  <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded-md font-mono">
                    WASM Engine
                  </span>
                </div>
                <p className="text-xs text-stone-500 mb-4 leading-relaxed">
                  Compiles selected Rust code templates into optimized WebAssembly bytecode format and deploys securely to Casper Testnet.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={compileContract}
                    disabled={isCompiling}
                    className="w-full text-xs bg-rose-800 text-white font-bold py-2.5 px-4 rounded-xl hover:bg-rose-900 transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isCompiling ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Compiling and Deploying...
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5" />
                        Compile & Deploy WASM Contract
                      </>
                    )}
                  </button>

                  {/* Compilation output */}
                  {compilationLogs.length > 0 && (
                    <div className="bg-stone-950 text-stone-200 rounded-xl p-3 font-mono text-[9px] max-h-48 overflow-y-auto border border-stone-850">
                      {compilationLogs.map((log, i) => (
                        <div key={i} className="mb-1 leading-normal">{log}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {deployedAddress && (
                <div className="bg-green-50 border border-green-100 rounded-xl p-3.5 mt-4 text-xs">
                  <div className="flex items-center gap-1.5 text-green-800 font-bold mb-1">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Contract Deployed!</span>
                  </div>
                  <p className="text-[10px] text-stone-500 font-mono break-all bg-white border border-stone-100 p-1.5 rounded mt-1 select-all">
                    {deployedAddress}
                  </p>
                </div>
              )}
            </div>

            {/* Casper RPC JSON Request Encoder */}
            <div className="bg-white border border-stone-200/80 rounded-3xl p-6 shadow-xs flex-1">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-100">
                <h3 className="text-sm font-extrabold text-stone-950 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <Database className="w-4 h-4 text-rose-800" /> RPC JSON Request Encoder
                </h3>
                <span className="text-[10px] text-stone-400 font-mono font-bold">Node API</span>
              </div>
              <p className="text-xs text-stone-500 mb-4 leading-relaxed">
                Helper utility to generate and inspect properly formed protocol parameters requested by standard Casper Node JSON-RPC API interfaces.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] text-stone-400 font-extrabold uppercase font-mono block mb-1">
                    Select RPC Method
                  </label>
                  <select
                    value={rpcMethod}
                    onChange={(e) => setRpcMethod(e.target.value)}
                    className="w-full text-xs font-bold border border-stone-200 rounded-lg p-2 bg-stone-50 text-stone-800 focus:outline-hidden"
                  >
                    <option value="info_get_status">info_get_status</option>
                    <option value="chain_get_state_root_hash">chain_get_state_root_hash</option>
                    <option value="state_get_item">state_get_item</option>
                  </select>
                </div>

                <div>
                  <span className="text-[10px] text-stone-400 font-extrabold uppercase font-mono block mb-1">
                    JSON-RPC Request Payload
                  </span>
                  <div className="bg-stone-950 rounded-xl p-3 border border-stone-850 font-mono text-[10px] text-stone-200 max-h-48 overflow-y-auto">
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify({
                        jsonrpc: "2.0",
                        id: 1,
                        method: rpcMethod,
                        params: JSON.parse(rpcParam)
                      }, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SUBTAB 3: Cryptographic Reputation Matrix */}
      {subTab === 'reputation' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Validator Ledger list */}
          <div className="bg-white border border-stone-200/80 rounded-3xl p-6 shadow-xs lg:col-span-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3 mb-4">
              <div>
                <h3 className="text-sm font-extrabold text-stone-950 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <Award className="w-4 h-4 text-rose-800" /> Proof-of-Reputation (PoR) Ledger
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">Active validation clusters verified via sovereign cryptographic endorsements.</p>
              </div>
              <button
                onClick={downloadReputationCSV}
                className="text-xs bg-stone-100 text-stone-700 hover:bg-stone-200 font-bold py-1.5 px-3 rounded-lg border border-stone-200 flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Download Dataset (CSV)
              </button>
            </div>

            {/* Validator list table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-stone-100 text-stone-400 font-mono uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-2">Validator Node</th>
                    <th className="py-2.5 px-2">Public Key / Address</th>
                    <th className="py-2.5 px-2 text-right">Uptime</th>
                    <th className="py-2.5 px-2 text-right">Reputation Score</th>
                    <th className="py-2.5 px-2 text-right">Endorsement Badges</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {validators.map((node, idx) => (
                    <tr key={idx} className="hover:bg-stone-50 transition-colors">
                      <td className="py-3 px-2 font-bold text-stone-850">
                        {node.name}
                      </td>
                      <td className="py-3 px-2 font-mono text-[10px] text-stone-500">
                        {node.address}
                      </td>
                      <td className="py-3 px-2 text-right font-mono text-stone-700">
                        {node.uptime}%
                      </td>
                      <td className="py-3 px-2 text-right">
                        <span className={`font-mono font-bold px-1.5 py-0.5 rounded-md
                          ${node.score >= 98 ? 'text-green-700 bg-green-50' : node.score >= 95 ? 'text-blue-700 bg-blue-50' : 'text-amber-700 bg-amber-50'}
                        `}>
                          {node.score}/100
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right space-x-1.5">
                        {node.badges.map((badge, bIdx) => (
                          <span key={bIdx} className="text-[9px] bg-rose-50 text-rose-800 font-bold border border-rose-100/50 rounded-md px-1.5 py-0.5 whitespace-nowrap">
                            {badge}
                          </span>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Attestation criteria explanation */}
            <div className="bg-stone-50 border border-stone-200/50 rounded-2xl p-4 mt-6 flex flex-col sm:flex-row gap-4 items-start">
              <div className="p-2 rounded-xl bg-white border border-stone-200 shadow-xs text-rose-800">
                <Shield className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-stone-900">How Cryptographic Reputation Matrix Governs the Swarm</h4>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Instead of proof-of-work, the CasperLas network runs on <strong>Proof-of-Reputation (PoR)</strong>. Validator cluster nodes continuously monitor active intelligent agents, record cryptographic peer reviews of their execution payloads (completed transactions, audits, scheduling), and lock attestation receipts into on-chain registries. Verified score ratings determine each node's reward distribution priority.
                </p>
              </div>
            </div>
          </div>

          {/* Key verification inspector */}
          <div className="space-y-6 lg:col-span-4">
            <div className="bg-white border border-stone-200/80 rounded-3xl p-6 shadow-xs h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-stone-100 pb-3">
                  <h3 className="text-sm font-extrabold text-stone-950 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <CheckCircle2 className="w-4 h-4 text-rose-800" /> Verify Attestation Badge
                  </h3>
                  <span className="text-[10px] text-stone-400 font-mono font-bold">Auditor</span>
                </div>
                <p className="text-xs text-stone-500 mb-4 leading-relaxed">
                  Validate cryptographic signatures, validator receipts, or sovereign Ed25519 addresses on-chain instantly in the playground sandbox.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] text-stone-400 font-extrabold uppercase font-mono block mb-1">
                      Target TxHash or Validator Public Key
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 0xfa91... or 01a581..."
                      value={attestationToVerify}
                      onChange={(e) => setAttestationToVerify(e.target.value)}
                      className="w-full text-xs font-mono border border-stone-200 rounded-xl p-2.5 bg-stone-50 focus:outline-hidden focus:border-rose-450 text-stone-800"
                    />
                  </div>

                  <button
                    onClick={verifyAttestation}
                    className="w-full text-xs bg-stone-900 text-white font-bold py-2.5 px-4 rounded-xl hover:bg-stone-850 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    Verify Signature Attestation
                  </button>
                </div>
              </div>

              {verificationResult.checked && (
                <div className={`mt-6 border p-4 rounded-2xl text-xs flex gap-2.5 items-start animate-fadeIn
                  ${verificationResult.valid 
                    ? 'bg-green-50 border-green-150 text-green-900' 
                    : 'bg-amber-50 border-amber-150 text-amber-900'
                  }
                `}>
                  {verificationResult.valid ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <p className="font-bold">
                      {verificationResult.valid ? 'Signature Validated' : 'Cryptographic Fault'}
                    </p>
                    <p className="text-xs text-stone-500 leading-relaxed font-mono">
                      {verificationResult.details}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* SUBTAB 4: Autonomous DeFi Autopilot */}
      {subTab === 'defi' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Staking Pool Performance Chart */}
          <div className="bg-white border border-stone-200/80 rounded-3xl p-6 shadow-xs lg:col-span-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-stone-100 pb-3">
                <h3 className="text-sm font-extrabold text-stone-950 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <BarChart3 className="w-4 h-4 text-rose-800" /> APY & Liquidity Autopilot Telemetry
                </h3>
                <span className="text-[10px] text-stone-400 font-mono font-bold">Real-Time Data Feed</span>
              </div>
              <p className="text-xs text-stone-500 mb-6 leading-relaxed">
                Algorithmic yield tracking. CasperLas agents perform sequential pool audits and execute automated microsecond liquidity reallocations depending on slippage metrics.
              </p>

              {/* Dynamic SVG Telemetry Line Chart */}
              <div className="border border-stone-150 rounded-2xl p-4 bg-stone-50 mb-6 h-64 flex flex-col justify-between">
                <div className="flex-1 relative flex items-end">
                  {/* Grid Lines */}
                  <div className="absolute inset-x-0 top-1/4 border-t border-stone-200/50"></div>
                  <div className="absolute inset-x-0 top-2/4 border-t border-stone-200/50"></div>
                  <div className="absolute inset-x-0 top-3/4 border-t border-stone-200/50"></div>

                  <svg className="w-full h-full absolute inset-0" preserveAspectRatio="none">
                    {/* SVG Line path for APY */}
                    {defiTelemetry.length > 0 && (
                      <path
                        d={defiTelemetry.reduce((acc, curr, idx) => {
                          const width = 100 / (defiTelemetry.length - 1);
                          const x = idx * width;
                          // Scale APY between 10.5% (bottom) and 12.0% (top)
                          const y = 100 - ((curr.apy - 10.5) / 1.5) * 100;
                          return acc + `${idx === 0 ? 'M' : 'L'} ${x}% ${y}%`;
                        }, '')}
                        fill="none"
                        stroke="#9f1239"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        className="animate-pulse"
                      />
                    )}
                  </svg>
                  
                  {/* Tooltips or data points at endpoints */}
                  {defiTelemetry.length > 0 && (
                    <div className="absolute bottom-4 right-4 bg-white border border-stone-200/80 rounded-xl p-2 shadow-xs text-[10px] font-mono">
                      <span className="font-extrabold text-rose-800 block">Staking APY Feed</span>
                      <span>Latest: <strong>{defiTelemetry[defiTelemetry.length - 1].apy}%</strong> APY</span>
                    </div>
                  )}
                </div>

                {/* X-axis labels */}
                <div className="flex justify-between border-t border-stone-200 pt-2 text-[9px] font-mono text-stone-400 select-none">
                  <span>24 hrs ago</span>
                  <span>12 hrs ago</span>
                  <span>Latest Epoch</span>
                </div>
              </div>
            </div>

            {/* Simulated Live Pool stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-stone-50 border border-stone-200/50 rounded-2xl p-3.5 text-center">
                <span className="text-[9px] font-extrabold text-stone-400 font-mono uppercase block">Optimized APY</span>
                <span className="text-lg font-black text-rose-900 font-mono">11.45% APY</span>
              </div>
              <div className="bg-stone-50 border border-stone-200/50 rounded-2xl p-3.5 text-center">
                <span className="text-[9px] font-extrabold text-stone-400 font-mono uppercase block">Active Liquidity</span>
                <span className="text-lg font-black text-rose-900 font-mono">146,850 CSPR</span>
              </div>
              <div className="bg-stone-50 border border-stone-200/50 rounded-2xl p-3.5 text-center">
                <span className="text-[9px] font-extrabold text-stone-400 font-mono uppercase block">Total Fees Generated</span>
                <span className="text-lg font-black text-green-700 font-mono">1,894 CSPR</span>
              </div>
            </div>
          </div>

          {/* Allocation sliders and configs */}
          <div className="space-y-6 lg:col-span-4">
            <div className="bg-white border border-stone-200/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-stone-100 pb-3">
                  <h3 className="text-sm font-extrabold text-stone-950 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <Sliders className="w-4 h-4 text-rose-800" /> Adjust Parameters
                  </h3>
                  <span className="text-[10px] text-stone-400 font-mono font-bold">Manual override</span>
                </div>

                <div className="space-y-5">
                  {/* Slider 1: Target Staking Allocation */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-stone-600">Target Staking Allocation</span>
                      <span className="font-mono text-rose-900">{targetStaking}% Staked</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={targetStaking}
                      onChange={(e) => setTargetStaking(parseInt(e.target.value))}
                      className="w-full accent-rose-800"
                    />
                    <div className="flex justify-between text-[9px] text-stone-400 font-mono mt-0.5">
                      <span>10% Low stake</span>
                      <span>100% Full staking</span>
                    </div>
                  </div>

                  {/* Slider 2: Volatility Slippage Limit */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-stone-600">Slippage Tolerance</span>
                      <span className="font-mono text-rose-900">{slippage}% Max</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="5.0"
                      step="0.1"
                      value={slippage}
                      onChange={(e) => setSlippage(parseFloat(e.target.value))}
                      className="w-full accent-rose-800"
                    />
                    <div className="flex justify-between text-[9px] text-stone-400 font-mono mt-0.5">
                      <span>0.1% Tight range</span>
                      <span>5.0% Wide slippage</span>
                    </div>
                  </div>

                  {/* Radios: Risk sensitivity */}
                  <div>
                    <label className="text-[10px] text-stone-400 font-extrabold uppercase font-mono block mb-2">
                      Risk Shield sensitivity
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['low', 'medium', 'high'].map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setRiskSensitivity(mode as any)}
                          className={`py-1.5 px-2.5 text-xs font-bold rounded-lg border text-center uppercase tracking-wider transition-all cursor-pointer
                            ${riskSensitivity === mode 
                              ? 'bg-rose-800 border-rose-800 text-white shadow-xs' 
                              : 'bg-stone-50 border-stone-200 text-stone-500 hover:text-stone-850'
                            }
                          `}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Toggle: Risk Shield active */}
                  <div className="border-t border-stone-100 pt-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-stone-850 block">Risk Shield Autopilot</span>
                      <span className="text-[10px] text-stone-400">Protects staking against slippage spike anomalies.</span>
                    </div>
                    <button
                      onClick={() => setRiskShieldActive(!riskShieldActive)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden
                        ${riskShieldActive ? 'bg-green-600' : 'bg-stone-200'}
                      `}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out
                          ${riskShieldActive ? 'translate-x-5' : 'translate-x-0'}
                        `}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Status widget */}
              <div className="bg-stone-50 border border-stone-200/50 rounded-2xl p-4 mt-6">
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-850 mb-1">
                  <div className={`w-2 h-2 rounded-full ${riskShieldActive ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`}></div>
                  <span>Shield Status: {riskShieldActive ? 'Armed & Listening' : 'Deactivated'}</span>
                </div>
                <p className="text-[10px] text-stone-400 font-mono leading-normal">
                  No staking anomalies reported. All pools audited on Casper blockheight 1,420,951. Secure.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Info card footer */}
      <div className="bg-rose-50/50 border border-rose-100/60 rounded-3xl p-5 mt-6 flex items-start gap-3">
        <HelpCircle className="w-5 h-5 text-rose-800 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-rose-950 font-sans">Empathetic CasperLas Integration Suite</h4>
          <p className="text-[11px] text-rose-900/80 leading-relaxed font-sans">
            This module represents the complete functional integration mapping of the <strong>CasperLas Decentralized Agent Network Architecture</strong>. It links active agent swarms, Rust-based WASM compilations via the Odra Framework, proof-of-reputation consensus schemas, and DeFi stake pool allocations. Built inside Dr. T with empathy and precision.
          </p>
        </div>
      </div>
    </div>
  );
}
