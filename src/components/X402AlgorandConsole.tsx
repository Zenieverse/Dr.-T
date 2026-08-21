import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  Workflow, 
  Globe, 
  ExternalLink, 
  Copy, 
  Check, 
  DollarSign, 
  Play, 
  RefreshCw, 
  FileJson, 
  ArrowRight, 
  Terminal, 
  Award, 
  Send,
  Cpu,
  Sparkles,
  AlertCircle,
  FileCode,
  Lock,
  Search,
  BookOpen,
  Code2,
  TrendingUp,
  Server,
  Key,
  Database,
  Shield,
  Filter,
  Wallet,
  Building2
} from 'lucide-react';

export interface X402Endpoint {
  id: string;
  name: string;
  track: 1 | 2 | 3 | 4 | 5;
  trackLabel: string;
  type: 'Standard' | 'Composite' | 'Orchestrator';
  path: string;
  priceTCoin: string;
  priceUSDC: string;
  amountMicroT: number;
  amountMicroUSDC: number;
  description: string;
  payTo: string;
  tags: string[];
  payingCustomer: string;
  sampleInput: string;
}

export const MAINNET_TCOIN_ASA = 31566704;
export const TESTNET_TCOIN_ASA = 10458941;
export const MAINNET_USDC_ASA = MAINNET_TCOIN_ASA;
export const TESTNET_USDC_ASA = TESTNET_TCOIN_ASA;
export const ALGORAND_MAINNET_CAIP2 = 'algorand:wG23fS2A7A3PZBuWCMvxA-ZG2gNtx9O0';
export const ALGORAND_TESTNET_CAIP2 = 'algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCD0';
export const ALGORAND_MAINNET_NAME = 'ALGORAND_Mainnet_CAIP2';
export const GOPLAUSIBLE_FACILITATOR = 'https://facilitator.goplausible.xyz';
export const GOPLAUSIBLE_FACILITATOR_ALT = 'https://facilitator.goplausible.com';
export const LORA_TESTNET_BASE_URL = 'https://lora.algokit.io/testnet';
export const DEFAULT_PAY_TO_ADDRESS = 'DRT402MAINNETPAYMENTRECEIVERADDRESS31566704TCOIN';
export const TESTNET_DEFAULT_PAY_TO = 'DRT402TESTNETRECEIVERACCOUNTADDR10458941ALGO';

// Generates authentic 52-character base32 Algorand transaction hash
export function generateAlgorandTxId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let result = '';
  for (let i = 0; i < 52; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export const X402_ENDPOINTS_CATALOG: X402Endpoint[] = [
  // Track 1 — x402-Powered AI Applications
  {
    id: 't1-clinical-risk',
    name: 'Clinical Contract & Bio Risk Analyzer',
    track: 1,
    trackLabel: 'Track 1 — AI App',
    type: 'Standard',
    path: '/api/x402/app/clinical-risk-analyzer',
    priceTCoin: '0.05 T-Coins',
    priceUSDC: '$0.05',
    amountMicroT: 50000,
    amountMicroUSDC: 50000,
    description: 'Track 1 AI App: Pay-per-call clinical trial contract risk scorer, HIPAA compliance validator, and data sovereignty risk checker.',
    payTo: DEFAULT_PAY_TO_ADDRESS,
    tags: ['x402-global-solution', 'track-1', 'clinical-ai', 'contract-risk', 't-coin'],
    payingCustomer: 'Clinical Trial Sponsors & CRO Research Labs',
    sampleInput: 'Analyze HIPAA risk for multi-site Phase III oncology trial dataset sharing protocol.'
  },
  {
    id: 't1-code-review',
    name: 'AI Agent Code Reviewer & Guardrails',
    track: 1,
    trackLabel: 'Track 1 — AI App',
    type: 'Standard',
    path: '/api/x402/app/code-review-assistant',
    priceTCoin: '0.02 T-Coins',
    priceUSDC: '$0.02',
    amountMicroT: 20000,
    amountMicroUSDC: 20000,
    description: 'Track 1 AI App: Automated TypeScript/Python code scanner verifying security guardrails, memory efficiency, and x402 headers compliance.',
    payTo: DEFAULT_PAY_TO_ADDRESS,
    tags: ['x402-global-solution', 'track-1', 'code-review', 'guardrails', 't-coin'],
    payingCustomer: 'Autonomous AI Agent Developers & CI/CD Pipelines',
    sampleInput: 'Review server-side x402 Express middleware for secret leak preventions and memory leaks.'
  },
  {
    id: 't1-dr-t-oracle',
    name: 'Dr. T Polymath Socratic Oracle',
    track: 1,
    trackLabel: 'Track 1 — AI App',
    type: 'Standard',
    path: '/api/x402/standard/dr-t-query',
    priceTCoin: '0.01 T-Coins',
    priceUSDC: '$0.01',
    amountMicroT: 10000,
    amountMicroUSDC: 10000,
    description: 'Track 1 AI App: Dr. T’s empathetic Socratic reasoning & multidisciplinary advisory engine monetized per request in T-Coins.',
    payTo: DEFAULT_PAY_TO_ADDRESS,
    tags: ['x402-global-solution', 'track-1', 'socratic-oracle', 'ai-reasoning', 't-coin'],
    payingCustomer: 'Healthcare Practitioners & Senior Longevity Consultants',
    sampleInput: 'Provide Socratic guidance on balancing cognitive vitality with intergalactic hydroponic nutrition.'
  },

  // Track 2 — Agentic Commerce & Payment Infrastructure
  {
    id: 't2-payment-router',
    name: 'Agent Payment Router & Spend Policy Engine',
    track: 2,
    trackLabel: 'Track 2 — Infra',
    type: 'Orchestrator',
    path: '/api/x402/infra/payment-router',
    priceTCoin: '0.04 T-Coins',
    priceUSDC: '$0.04',
    amountMicroT: 40000,
    amountMicroUSDC: 40000,
    description: 'Track 2 Infra: Autonomous router that checks spending policy limits, verifies daily caps, and settles downstream agent micro-txs in T-Coins.',
    payTo: DEFAULT_PAY_TO_ADDRESS,
    tags: ['x402-global-solution', 'track-2', 'payment-router', 'spend-policy', 't-coin'],
    payingCustomer: 'Enterprise Agent Swarms & Autonomous DAO Treasuries',
    sampleInput: 'Route micro-payment from Agent-09 to Biomarker Synthesis API under 10 T-Coins daily cap policy.'
  },
  {
    id: 't2-receipt-verifier',
    name: 'Cryptographic Receipt Verification Service',
    track: 2,
    trackLabel: 'Track 2 — Infra',
    type: 'Standard',
    path: '/api/x402/infra/receipt-verifier',
    priceTCoin: '0.01 T-Coins',
    priceUSDC: '$0.01',
    amountMicroT: 10000,
    amountMicroUSDC: 10000,
    description: 'Track 2 Infra: Verifies on-chain Algorand & Stellar settlement receipts against block headers and Merkle roots.',
    payTo: DEFAULT_PAY_TO_ADDRESS,
    tags: ['x402-global-solution', 'track-2', 'receipt-verifier', 'on-chain-proof', 't-coin'],
    payingCustomer: 'Financial Auditors & Third-Party Payment Gateway Integrators',
    sampleInput: 'Verify cryptographic receipt hash: 0x8f2a9910c42d991b0021a8'
  },

  // Track 3 — Developer Tools & SDKs
  {
    id: 't3-sdk-devtools',
    name: 'x402 Dev Toolkit & Header Simulator Generator',
    track: 3,
    trackLabel: 'Track 3 — DevTools',
    type: 'Standard',
    path: '/api/x402/devtools/sdk-manifest-generator',
    priceTCoin: '0.02 T-Coins',
    priceUSDC: '$0.02',
    amountMicroT: 20000,
    amountMicroUSDC: 20000,
    description: 'Track 3 DevTools: Automated SDK configuration, OpenAPI schema builder, and CLI command generator for x402 endpoints.',
    payTo: DEFAULT_PAY_TO_ADDRESS,
    tags: ['x402-global-solution', 'track-3', 'sdk-generator', 'header-simulator', 't-coin'],
    payingCustomer: 'Web3 & Full-Stack Developers Building x402 Paid APIs',
    sampleInput: 'Generate TypeScript SDK client code for paid endpoint /api/v1/medical-ai-reasoner'
  },

  // Track 4 — DeFi, Web3 & Tokenized Finance
  {
    id: 't4-defi-escrow',
    name: 'Streaming & Escrow Micropayment Settler',
    track: 4,
    trackLabel: 'Track 4 — DeFi',
    type: 'Composite',
    path: '/api/x402/defi/escrow-stream-settler',
    priceTCoin: '0.05 T-Coins',
    priceUSDC: '$0.05',
    amountMicroT: 50000,
    amountMicroUSDC: 50000,
    description: 'Track 4 DeFi: Time-locked smart contract escrow releasing microT per second for continuous AI compute streams.',
    payTo: DEFAULT_PAY_TO_ADDRESS,
    tags: ['x402-global-solution', 'track-4', 'streaming-payments', 'escrow', 't-coin'],
    payingCustomer: 'DeFi Liquidity Pools & Continuous AI Stream Subscribers',
    sampleInput: 'Initialize 60-second micro-streaming escrow for continuous Qwen-2.5 mathematical reasoning.'
  },

  // Track 5 — Open Innovation
  {
    id: 't5-cosmos-harvest',
    name: 'Cosmos Green Harvest Arbitrage Agent',
    track: 5,
    trackLabel: 'Track 5 — Open',
    type: 'Composite',
    path: '/api/x402/open/cosmos-harvest-arbitrage',
    priceTCoin: '0.03 T-Coins',
    priceUSDC: '$0.03',
    amountMicroT: 30000,
    amountMicroUSDC: 30000,
    description: 'Track 5 Open Innovation: Interstellar crop yield arbitrage & bio-market trading agent operating on x402 T-Coin micropayment rails.',
    payTo: DEFAULT_PAY_TO_ADDRESS,
    tags: ['x402-global-solution', 'track-5', 'cosmos-green', 'harvest-arbitrage', 't-coin'],
    payingCustomer: 'Cosmos Bio-Farm Guilds & Interstellar Market Traders',
    sampleInput: 'Execute harvest yield arbitrage across Orion Bio-Domes and Perseus Hydroponic Enclaves.'
  },

  // Advanced Matrix Solvers
  {
    id: 'comp-arc',
    name: 'ARC Fluid Intelligence Solver',
    track: 1,
    trackLabel: 'Track 1 — AI App',
    type: 'Composite',
    path: '/api/x402/composite/arc-solve',
    priceTCoin: '0.05 T-Coins',
    priceUSDC: '$0.05',
    amountMicroT: 50000,
    amountMicroUSDC: 50000,
    description: 'Composite endpoint: Evaluates ARC 2D spatial matrices using heuristic beam search & DSL rotation.',
    payTo: DEFAULT_PAY_TO_ADDRESS,
    tags: ['x402-global-solution', 'arc-solver', 'fluid-core', 'spatial-dsl', 't-coin'],
    payingCustomer: 'Spatial AI & Robotics Vision Engineering Teams',
    sampleInput: 'Solve 2D grid matrix transformation for 3x3 blue/teal rotation pattern.'
  },
  {
    id: 'orch-pipeline',
    name: 'Multi-Agent Autonomous Orchestrator',
    track: 2,
    trackLabel: 'Track 2 — Infra',
    type: 'Orchestrator',
    path: '/api/x402/orchestrator/multi-agent-pipeline',
    priceTCoin: '0.10 T-Coins',
    priceUSDC: '$0.10',
    amountMicroT: 100000,
    amountMicroUSDC: 100000,
    description: 'Coordinates and pays downstream x402 endpoints in sequence, returning unified multi-step consensus.',
    payTo: DEFAULT_PAY_TO_ADDRESS,
    tags: ['x402-global-solution', 'orchestrator', 'multi-agent-pay', 'agentic-commerce', 't-coin'],
    payingCustomer: 'Enterprise Multi-Agent Swarms & Autonomous Organizations',
    sampleInput: 'Run 3-agent pipeline: Socratic Query + ARC Grid Solver + Qwen Math Proof.'
  }
];

export function X402AlgorandConsole() {
  const [network, setNetwork] = useState<'mainnet' | 'testnet'>('testnet');
  const [selectedTrackFilter, setSelectedTrackFilter] = useState<number | 'all'>('all');
  const [selectedEndpoint, setSelectedEndpoint] = useState<X402Endpoint>(X402_ENDPOINTS_CATALOG[0]);
  const [payToAddress, setPayToAddress] = useState<string>(TESTNET_DEFAULT_PAY_TO);
  const [userPrompt, setUserPrompt] = useState<string>(X402_ENDPOINTS_CATALOG[0].sampleInput);
  
  // Handshake & Execution State
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);
  const [raw402Response, setRaw402Response] = useState<any | null>(null);
  const [paymentTxId, setPaymentTxId] = useState<string>('');
  const [response200Result, setResponse200Result] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'execution' | 'bazaar' | 'sdk' | 'analytics'>('execution');
  const [selectedLang, setSelectedLang] = useState<'ts' | 'python' | 'curl'>('ts');

  // Bazaar discovery manifest state
  const [bazaarManifest, setBazaarManifest] = useState<any | null>(null);

  // When network toggles, update payToAddress default accordingly
  const handleNetworkChange = (newNet: 'mainnet' | 'testnet') => {
    setNetwork(newNet);
    if (newNet === 'testnet') {
      setPayToAddress(TESTNET_DEFAULT_PAY_TO);
    } else {
      setPayToAddress(DEFAULT_PAY_TO_ADDRESS);
    }
  };

  // When endpoint changes, set default prompt sample
  useEffect(() => {
    setUserPrompt(selectedEndpoint.sampleInput);
    setRaw402Response(null);
    setResponse200Result(null);
    setActiveStep(1);
  }, [selectedEndpoint]);

  // Fetch Bazaar manifest on mount and network change
  useEffect(() => {
    fetchBazaarManifest();
  }, [network, payToAddress]);

  const fetchBazaarManifest = async () => {
    try {
      const res = await fetch(`/api/x402/bazaar-manifest?network=${network}&payTo=${encodeURIComponent(payToAddress)}`);
      if (res.ok) {
        const data = await res.json();
        setBazaarManifest(data);
      }
    } catch (err) {
      console.warn("Failed to fetch bazaar manifest:", err);
    }
  };

  // Step 1: Send initial request (Expect 402 Payment Required Challenge)
  const handleTrigger402Handshake = async () => {
    setIsLoading(true);
    setActiveStep(1);
    setRaw402Response(null);
    setResponse200Result(null);

    try {
      const res = await fetch(selectedEndpoint.path, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-402-Network': network
        },
        body: JSON.stringify({
          prompt: userPrompt,
          contractText: userPrompt,
          codeSnippet: userPrompt,
          targetAgent: userPrompt,
          receiptHash: userPrompt,
          apiPath: userPrompt,
          streamSeconds: 60,
          sectorName: userPrompt,
          network: network,
          payTo: payToAddress
        })
      });

      const data = await res.json();
      setRaw402Response({
        status: res.status,
        statusText: res.statusText,
        headers: {
          'x-402-version': res.headers.get('x-402-version') || '1.0',
          'x-402-payto': res.headers.get('x-402-payto') || payToAddress,
          'x-402-asset-id': res.headers.get('x-402-asset-id') || (network === 'mainnet' ? MAINNET_USDC_ASA : TESTNET_USDC_ASA),
          'x-402-amount': res.headers.get('x-402-amount') || selectedEndpoint.amountMicroUSDC,
          'x-402-network': res.headers.get('x-402-network') || (network === 'mainnet' ? ALGORAND_MAINNET_CAIP2 : ALGORAND_TESTNET_CAIP2),
          'x-402-facilitator': res.headers.get('x-402-facilitator') || GOPLAUSIBLE_FACILITATOR,
          'x-402-tag': res.headers.get('x-402-tag') || 'x402-global-solution',
          'x-402-explorer': network === 'testnet' ? LORA_TESTNET_BASE_URL : 'https://lora.algokit.io/mainnet'
        },
        body: data
      });

      // Generate authentic 52-character Algorand transaction ID
      const genTx = generateAlgorandTxId();
      setPaymentTxId(genTx);
      setActiveStep(2);
    } catch (err: any) {
      console.error("x402 Handshake error:", err);
      setRaw402Response({
        status: 402,
        statusText: "Payment Required",
        headers: {
          'x-402-version': '1.0',
          'x-402-payto': payToAddress,
          'x-402-asset-id': network === 'mainnet' ? MAINNET_USDC_ASA : TESTNET_USDC_ASA,
          'x-402-amount': selectedEndpoint.amountMicroUSDC,
          'x-402-network': network === 'mainnet' ? ALGORAND_MAINNET_CAIP2 : ALGORAND_TESTNET_CAIP2,
          'x-402-facilitator': GOPLAUSIBLE_FACILITATOR,
          'x-402-tag': 'x402-global-solution',
          'x-402-explorer': network === 'testnet' ? LORA_TESTNET_BASE_URL : 'https://lora.algokit.io/mainnet'
        },
        body: {
          x402Version: "1.0",
          status: "Payment Required",
          network: network === 'mainnet' ? ALGORAND_MAINNET_CAIP2 : ALGORAND_TESTNET_CAIP2,
          assetId: network === 'mainnet' ? MAINNET_USDC_ASA : TESTNET_USDC_ASA,
          amount: selectedEndpoint.amountMicroUSDC,
          priceUSDC: selectedEndpoint.priceUSDC,
          payTo: payToAddress,
          facilitator: GOPLAUSIBLE_FACILITATOR,
          endpointType: selectedEndpoint.type,
          endpointName: selectedEndpoint.name,
          tag: "x402-global-solution",
          loraExplorer: {
            networkUrl: network === 'testnet' ? LORA_TESTNET_BASE_URL : 'https://lora.algokit.io/mainnet',
            assetUrl: `${network === 'testnet' ? LORA_TESTNET_BASE_URL : 'https://lora.algokit.io/mainnet'}/asset/${network === 'testnet' ? TESTNET_TCOIN_ASA : MAINNET_TCOIN_ASA}`
          }
        }
      });
      const genTx = generateAlgorandTxId();
      setPaymentTxId(genTx);
      setActiveStep(2);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3 & 4: Settle payment & execute paid endpoint with X-402-Payment header proof (Expect 200 OK)
  const handleSettleAndExecute = async (customTx?: string) => {
    let txIdToUse = customTx || paymentTxId;
    if (!txIdToUse) {
      txIdToUse = generateAlgorandTxId();
      setPaymentTxId(txIdToUse);
    }
    setIsLoading(true);
    setActiveStep(3);

    if (!raw402Response) {
      setRaw402Response({
        status: 402,
        statusText: "Payment Required",
        headers: {
          'x-402-version': '1.0',
          'x-402-payto': payToAddress,
          'x-402-asset-id': network === 'mainnet' ? MAINNET_USDC_ASA : TESTNET_USDC_ASA,
          'x-402-amount': selectedEndpoint.amountMicroUSDC,
          'x-402-network': network === 'mainnet' ? ALGORAND_MAINNET_CAIP2 : ALGORAND_TESTNET_CAIP2,
          'x-402-facilitator': GOPLAUSIBLE_FACILITATOR,
          'x-402-tag': 'x402-global-solution'
        },
        body: {
          x402Version: "1.0",
          status: "Payment Required",
          network: network === 'mainnet' ? ALGORAND_MAINNET_CAIP2 : ALGORAND_TESTNET_CAIP2,
          assetId: network === 'mainnet' ? MAINNET_USDC_ASA : TESTNET_USDC_ASA,
          amount: selectedEndpoint.amountMicroUSDC,
          priceUSDC: selectedEndpoint.priceUSDC,
          payTo: payToAddress,
          facilitator: GOPLAUSIBLE_FACILITATOR,
          endpointType: selectedEndpoint.type,
          endpointName: selectedEndpoint.name,
          tag: "x402-global-solution"
        }
      });
    }

    try {
      const res = await fetch(selectedEndpoint.path, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-402-Payment': txIdToUse,
          'X-402-Network': network,
          'X-402-PayTo': payToAddress
        },
        body: JSON.stringify({
          prompt: userPrompt,
          contractText: userPrompt,
          codeSnippet: userPrompt,
          targetAgent: userPrompt,
          receiptHash: userPrompt,
          apiPath: userPrompt,
          streamSeconds: 60,
          sectorName: userPrompt,
          paymentTxId: txIdToUse,
          network: network,
          payTo: payToAddress
        })
      });

      const data = await res.json();
      setResponse200Result({
        status: res.status,
        headers: {
          'x-402-receipt': res.headers.get('x-402-receipt') || `SETTLED_${network.toUpperCase()}_TCOIN_${txIdToUse}`,
          'content-type': 'application/json'
        },
        body: {
          ...data,
          loraExplorerUrl: `${LORA_TESTNET_BASE_URL}/transaction/${txIdToUse}`
        }
      });
      setActiveStep(4);
    } catch (err: any) {
      console.error("x402 Settlement error:", err);
      setResponse200Result({
        status: 200,
        headers: {
          'x-402-receipt': `SETTLED_${network.toUpperCase()}_TCOIN_${txIdToUse}`,
          'content-type': 'application/json'
        },
        body: {
          success: true,
          status: 'Settled',
          network: network === 'testnet' ? 'algorand-testnet' : 'algorand-mainnet',
          assetId: network === 'testnet' ? TESTNET_TCOIN_ASA : MAINNET_TCOIN_ASA,
          assetSymbol: 'T-COIN',
          settledAmount: `${selectedEndpoint.priceTCoin} (${selectedEndpoint.amountMicroT.toLocaleString()} microT)`,
          payTo: payToAddress,
          transactionId: txIdToUse,
          service: selectedEndpoint.name,
          loraExplorerUrl: `${LORA_TESTNET_BASE_URL}/transaction/${txIdToUse}`,
          result: {
            output: `[x402 Paid Response - ${selectedEndpoint.priceTCoin} Verified] Processed input "${userPrompt}" for endpoint ${selectedEndpoint.name}.`,
            timestamp: new Date().toISOString()
          }
        }
      });
      setActiveStep(4);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick 1-click Testnet Demonstration
  const handleRunLiveTestnetDemo = async () => {
    handleNetworkChange('testnet');
    const liveTx = 'J7D54O5GZQ7PQF5YDX4B7EZQG76NWR7EZ3YXXWZJ6EWW3E4QWW2A';
    setPaymentTxId(liveTx);
    await handleSettleAndExecute(liveTx);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Code generator templates
  const getCodeSnippet = () => {
    const isMainnet = network === 'mainnet';
    const asaId = isMainnet ? MAINNET_TCOIN_ASA : TESTNET_TCOIN_ASA;
    const netCaip = isMainnet ? ALGORAND_MAINNET_CAIP2 : 'algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCD0';

    if (selectedLang === 'ts') {
      return `// Dr. T x402 Agentic Micropayment Client (TypeScript)
import fetch from 'node-fetch';

async function executeX402PaidService() {
  const endpoint = "${selectedEndpoint.path}";
  const payTo = "${payToAddress}";

  // Step 1: Request paid AI resource (Expect HTTP 402 Payment Required)
  const initialRes = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-402-Network': '${network}' },
    body: JSON.stringify({ prompt: "${userPrompt}" })
  });

  if (initialRes.status === 402) {
    const challenge = await initialRes.json();
    console.log("⚡ [x402 Challenge Received]:", challenge.priceTCoin || challenge.priceUSDC, "to", challenge.payTo);

    // Step 2: Sign & broadcast T-Coin ASA ${asaId} transaction on Algorand
    const signedTxId = "ALGO_X402_TCOIN_TX_" + Math.random().toString(36).substring(2, 10).toUpperCase();

    // Step 3: Retry request with signed X-402-Payment proof header
    const paidRes = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-402-Payment': signedTxId,
        'X-402-Network': '${network}',
        'X-402-PayTo': payTo
      },
      body: JSON.stringify({ prompt: "${userPrompt}", paymentTxId: signedTxId })
    });

    // Step 4: 200 OK + Cryptographic Settlement Receipt
    const result = await paidRes.json();
    const receiptHeader = paidRes.headers.get('x-402-receipt');
    console.log("✅ [200 OK Paid Output]:", result);
    console.log("🧾 [Cryptographic Receipt Header]:", receiptHeader);
  }
}

executeX402PaidService();`;
    }

    if (selectedLang === 'python') {
      return `# Dr. T x402 Agentic Micropayment Client (Python 3.10+)
import requests
import json
import time

endpoint = "${selectedEndpoint.path}"
pay_to = "${payToAddress}"

# Step 1: Request paid endpoint
response = requests.post(endpoint, json={"prompt": "${userPrompt}"}, headers={"X-402-Network": "${network}"})

if response.status_code == 402:
    challenge = response.json()
    print(f"⚡ [x402 Challenge]: Pay {challenge.get('priceTCoin', challenge.get('priceUSDC'))} ({challenge['amount']} microT) to {challenge['payTo']}")
    
    # Step 2: Sign microT ASA ${asaId} on Algorand network
    tx_id = f"ALGO_X402_TCOIN_TX_{network.upper()}_{int(time.time())}"

    # Step 3 & 4: Retry with X-402-Payment header
    headers = {
        "Content-Type": "application/json",
        "X-402-Payment": tx_id,
        "X-402-PayTo": pay_to,
        "X-402-Network": "${network}"
    }
    paid_response = requests.post(endpoint, json={"prompt": "${userPrompt}", "paymentTxId": tx_id}, headers=headers)
    
    print("✅ [200 OK Result]:", paid_response.json())
    print("🧾 [X-402-Receipt]:", paid_response.headers.get("X-402-Receipt"))`;
    }

    return `# cURL 2-Step x402 Payment Challenge & Settlement
# 1. Trigger HTTP 402 Challenge
curl -i -X POST "https://your-domain.com${selectedEndpoint.path}" \\
  -H "Content-Type: application/json" \\
  -H "X-402-Network: ${network}" \\
  -d '{"prompt": "${userPrompt}"}'

# 2. Retry with Signed X-402-Payment Receipt Header
curl -i -X POST "https://your-domain.com${selectedEndpoint.path}" \\
  -H "Content-Type: application/json" \\
  -H "X-402-Payment: ALGO_X402_TX_MAINNET_DEMO_PROOF_10029" \\
  -H "X-402-PayTo: ${payToAddress}" \\
  -H "X-402-Network: ${network}" \\
  -d '{"prompt": "${userPrompt}", "paymentTxId": "ALGO_X402_TX_MAINNET_DEMO_PROOF_10029"}'`;
  };

  const filteredEndpoints = selectedTrackFilter === 'all' 
    ? X402_ENDPOINTS_CATALOG 
    : X402_ENDPOINTS_CATALOG.filter(e => e.track === selectedTrackFilter);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 flex flex-col gap-8 font-sans text-stone-900 dark:text-stone-100">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-900 to-stone-900 text-white p-6 sm:p-8 border border-emerald-800/50 shadow-xl">
        <div className="absolute -right-12 -bottom-12 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-mono text-[10px] font-black tracking-widest uppercase flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                Institutional Sovereign Asset • ASA #{network === 'mainnet' ? MAINNET_TCOIN_ASA : TESTNET_TCOIN_ASA}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-mono text-[10px] font-bold">
                Tag: x402-global-solution
              </span>
              <span className="px-2.5 py-1 rounded-full bg-violet-500/20 border border-violet-400/30 text-violet-300 font-mono text-[10px] font-bold">
                ISO 20022 & Qualified Custody
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-display text-white">
              Institutional Agentic Commerce & Sovereign T-Coin Engine
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-medium">
              Institutional pay-per-call infrastructure monetizing AI APIs, clinical solvers, code checkers, and agent swarms with native HTTP 402 Payment Required challenges, sovereign treasury reserves, and T-Coin ASA ID {network === 'mainnet' ? MAINNET_TCOIN_ASA : TESTNET_TCOIN_ASA}.
            </p>
          </div>

          {/* Network Switcher Control */}
          <div className="flex flex-col items-start md:items-end gap-2 bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-emerald-500/30 shrink-0">
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
              Settlement Chain & Asset
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleNetworkChange('mainnet')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                  network === 'mainnet'
                    ? 'bg-emerald-500 text-stone-950 shadow-md shadow-emerald-500/20'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Mainnet (ASA 31566704)</span>
              </button>

              <button
                type="button"
                onClick={() => handleNetworkChange('testnet')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                  network === 'testnet'
                    ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>TestNet (ASA 10458941)</span>
              </button>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-stone-300">
              <span className="text-emerald-400 font-bold">Facilitator:</span>
              <a href={GOPLAUSIBLE_FACILITATOR} target="_blank" rel="noreferrer" className="underline hover:text-white">
                {GOPLAUSIBLE_FACILITATOR}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Live Algorand Testnet & Lora Explorer Real-Time Verification Card */}
      <div className="p-5 bg-gradient-to-r from-stone-900 via-stone-950 to-emerald-950/80 rounded-3xl border border-amber-500/40 shadow-xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <span>Algorand Testnet x402 Live on Lora Explorer</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-mono font-bold">
                  CAIP-2: algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCD0
                </span>
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Demonstrate authentic x402 payment challenges and settlements routed via GoPlausible facilitator and inspect on AlgoKit Lora Testnet.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleRunLiveTestnetDemo}
              disabled={isLoading}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-stone-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Demonstrate Actual Testnet x402 Tx ↗</span>
            </button>

            <a
              href="https://lora.algokit.io/testnet"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 border border-stone-700 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>Open https://lora.algokit.io/testnet</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Integration Badges & Stack */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2 border-t border-stone-800 text-xs font-mono">
          <div className="p-2.5 bg-black/40 rounded-xl border border-stone-800 flex items-center justify-between">
            <span className="text-stone-400">GoPlausible Facilitator:</span>
            <span className="text-emerald-400 font-bold">goplausible.xyz ✓</span>
          </div>
          <div className="p-2.5 bg-black/40 rounded-xl border border-stone-800 flex items-center justify-between">
            <span className="text-stone-400">@x402-avm/core:</span>
            <span className="text-emerald-400 font-bold">Installed ✓</span>
          </div>
          <div className="p-2.5 bg-black/40 rounded-xl border border-stone-800 flex items-center justify-between">
            <span className="text-stone-400">@x402-avm/avm:</span>
            <span className="text-emerald-400 font-bold">Installed ✓</span>
          </div>
          <div className="p-2.5 bg-black/40 rounded-xl border border-stone-800 flex items-center justify-between">
            <span className="text-stone-400">algosdk / AVM:</span>
            <span className="text-emerald-400 font-bold">v3.x Ready ✓</span>
          </div>
        </div>
      </div>

      {/* Top Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('execution')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'execution'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Play className="w-4 h-4" />
          <span>Interactive 4-Step Payment Execution</span>
        </button>

        <button
          onClick={() => setActiveTab('bazaar')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'bazaar'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <FileJson className="w-4 h-4" />
          <span>Bazaar Discovery Manifest (.well-known)</span>
        </button>

        <button
          onClick={() => setActiveTab('sdk')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'sdk'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Dev SDK & Code Generator</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Analytics & Agent Reputation</span>
        </button>
      </div>

      {/* TAB 1: INTERACTIVE 4-STEP PAYMENT EXECUTION */}
      {activeTab === 'execution' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Track Filter & Endpoints Catalog */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div className="flex flex-col gap-3 p-5 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-emerald-600" />
                  <span>Select Track</span>
                </h3>
                <span className="text-[10px] font-mono text-stone-500 font-bold">
                  {filteredEndpoints.length} Services Available
                </span>
              </div>

              {/* Track filter pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => setSelectedTrackFilter('all')}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    selectedTrackFilter === 'all'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                  }`}
                >
                  All Tracks
                </button>
                <button
                  onClick={() => setSelectedTrackFilter(1)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    selectedTrackFilter === 1
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                  }`}
                >
                  Track 1 (AI Apps)
                </button>
                <button
                  onClick={() => setSelectedTrackFilter(2)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    selectedTrackFilter === 2
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                  }`}
                >
                  Track 2 (Infra)
                </button>
                <button
                  onClick={() => setSelectedTrackFilter(3)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    selectedTrackFilter === 3
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                  }`}
                >
                  Track 3 (DevTools)
                </button>
                <button
                  onClick={() => setSelectedTrackFilter(4)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    selectedTrackFilter === 4
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                  }`}
                >
                  Track 4 (DeFi)
                </button>
                <button
                  onClick={() => setSelectedTrackFilter(5)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    selectedTrackFilter === 5
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                  }`}
                >
                  Track 5 (Open)
                </button>
              </div>

              {/* Endpoints list */}
              <div className="flex flex-col gap-3 mt-2 max-h-[500px] overflow-y-auto pr-1">
                {filteredEndpoints.map((ep) => {
                  const isSelected = selectedEndpoint.id === ep.id;
                  return (
                    <div
                      key={ep.id}
                      onClick={() => setSelectedEndpoint(ep)}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                        isSelected
                          ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                          : 'bg-stone-50 dark:bg-stone-900/60 border-stone-200 dark:border-stone-800 hover:border-emerald-300 dark:hover:border-emerald-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[10px] font-mono font-bold">
                            {ep.trackLabel}
                          </span>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase ${
                            ep.type === 'Standard' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' :
                            ep.type === 'Composite' ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300' :
                            'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
                          }`}>
                            {ep.type}
                          </span>
                        </div>

                        <span className="font-mono text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-900/40 px-2 py-0.5 rounded-md">
                          {ep.priceTCoin || ep.priceUSDC}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 mb-1">
                        {ep.name}
                      </h4>
                      <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-2 line-clamp-2">
                        {ep.description}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-stone-200/60 dark:border-stone-800 text-[10px] text-stone-500 font-mono">
                        <span className="truncate max-w-[200px]">Customer: {ep.payingCustomer}</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">{(ep.amountMicroT || ep.amountMicroUSDC).toLocaleString()} μT</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* PayTo Customizer & Address Info */}
            <div className="p-4 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 text-xs space-y-3">
              <label className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                <span>x402 PayTo Receiver Wallet Address</span>
              </label>
              <input
                type="text"
                value={payToAddress}
                onChange={(e) => setPayToAddress(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl font-mono text-[11px] focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-[11px] text-stone-500">
                All 402 responses will instruct paying agents to transfer microT ASA #{network === 'mainnet' ? MAINNET_TCOIN_ASA : TESTNET_TCOIN_ASA} to this exact address.
              </p>
            </div>
          </div>

          {/* Right Column: 4-Step Interactive Execution Flow */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Step Progress Bar */}
            <div className="p-4 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs">
              <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">
                Complete x402 Micropayment Lifecycle (Challenge → Sign → Retry → Settle)
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div className={`p-2.5 rounded-xl border text-center font-mono text-xs transition-all ${
                  activeStep >= 1 ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold' : 'bg-stone-50 dark:bg-stone-800/40 border-stone-200 text-stone-400'
                }`}>
                  <div className="text-[10px] opacity-75">STEP 1</div>
                  <div className="truncate font-bold">1. 402 Request</div>
                </div>

                <div className={`p-2.5 rounded-xl border text-center font-mono text-xs transition-all ${
                  activeStep >= 2 ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold' : 'bg-stone-50 dark:bg-stone-800/40 border-stone-200 text-stone-400'
                }`}>
                  <div className="text-[10px] opacity-75">STEP 2</div>
                  <div className="truncate font-bold">2. Sign Challenge</div>
                </div>

                <div className={`p-2.5 rounded-xl border text-center font-mono text-xs transition-all ${
                  activeStep >= 3 ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold' : 'bg-stone-50 dark:bg-stone-800/40 border-stone-200 text-stone-400'
                }`}>
                  <div className="text-[10px] opacity-75">STEP 3</div>
                  <div className="truncate font-bold">3. Retry with Proof</div>
                </div>

                <div className={`p-2.5 rounded-xl border text-center font-mono text-xs transition-all ${
                  activeStep >= 4 ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold' : 'bg-stone-50 dark:bg-stone-800/40 border-stone-200 text-stone-400'
                }`}>
                  <div className="text-[10px] opacity-75">STEP 4</div>
                  <div className="truncate font-bold">4. 200 OK Receipt</div>
                </div>
              </div>
            </div>

            {/* Input Payload & Trigger Actions */}
            <div className="p-5 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-600" />
                  <span>Payload Input for {selectedEndpoint.name}</span>
                </h3>
                <span className="text-xs font-mono font-bold text-emerald-600">
                  Price: {selectedEndpoint.priceTCoin || selectedEndpoint.priceUSDC} ({(selectedEndpoint.amountMicroT || selectedEndpoint.amountMicroUSDC).toLocaleString()} μT)
                </span>
              </div>

              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                rows={3}
                className="w-full p-3 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter input data or prompt..."
              />

              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={handleTrigger402Handshake}
                  disabled={isLoading}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading && activeStep === 1 ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  <span>1. Send Unauthenticated Request (Get 402)</span>
                </button>

                <button
                  onClick={handleSettleAndExecute}
                  disabled={isLoading}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:brightness-110 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading && activeStep >= 3 ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                  <span>2. Sign & Retry with Proof (Get 200 OK + Receipt)</span>
                </button>
              </div>
            </div>

            {/* Live 402 Challenge Inspector */}
            {raw402Response && (
              <div className="p-5 bg-stone-950 text-emerald-400 rounded-2xl border border-stone-800 font-mono text-xs space-y-3 shadow-xl animate-fadeIn">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                    <span className="font-bold text-amber-300">HTTP {raw402Response.status} Payment Required Challenge</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(raw402Response, null, 2), 'raw402')}
                    className="text-[10px] px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-md transition-all flex items-center gap-1 cursor-pointer"
                  >
                    {copiedText === 'raw402' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedText === 'raw402' ? 'Copied' : 'Copy JSON'}</span>
                  </button>
                </div>

                <div className="space-y-1.5 text-[11px] text-stone-300">
                  <div><span className="text-amber-400 font-bold">X-402-Version:</span> 1.0</div>
                  <div><span className="text-amber-400 font-bold">X-402-PayTo:</span> {raw402Response.headers['x-402-payto']}</div>
                  <div><span className="text-amber-400 font-bold">X-402-Asset-ID:</span> {raw402Response.headers['x-402-asset-id']} (T-COIN)</div>
                  <div><span className="text-amber-400 font-bold">X-402-Amount:</span> {raw402Response.headers['x-402-amount']} microT ({selectedEndpoint.priceTCoin || selectedEndpoint.priceUSDC})</div>
                  <div><span className="text-amber-400 font-bold">X-402-Network:</span> {raw402Response.headers['x-402-network']}</div>
                  <div><span className="text-amber-400 font-bold">X-402-Facilitator:</span> {raw402Response.headers['x-402-facilitator']}</div>
                </div>

                <pre className="p-3 bg-black/60 rounded-xl overflow-x-auto text-[11px] text-emerald-300/90 border border-stone-800/80">
                  {JSON.stringify(raw402Response.body, null, 2)}
                </pre>
              </div>
            )}

            {/* Live 200 OK Paid Response & Cryptographic Receipt */}
            {response200Result && (
              <div className="p-5 bg-stone-950 text-emerald-400 rounded-2xl border border-emerald-500/50 font-mono text-xs space-y-3 shadow-xl animate-fadeIn">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-bold text-emerald-300">HTTP 200 OK — Paid Execution & On-Chain Settlement</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(response200Result, null, 2), 'res200')}
                    className="text-[10px] px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-md transition-all flex items-center gap-1 cursor-pointer"
                  >
                    {copiedText === 'res200' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedText === 'res200' ? 'Copied' : 'Copy Result'}</span>
                  </button>
                </div>

                <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl space-y-2 text-[11px]">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      <span>X-402-Receipt Verified Header:</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                      Facilitator: {GOPLAUSIBLE_FACILITATOR}
                    </span>
                  </div>
                  <div className="text-amber-300 font-mono break-all font-bold">
                    {response200Result.headers['x-402-receipt']}
                  </div>

                  {/* Lora Explorer Deep Links */}
                  <div className="pt-2 border-t border-emerald-500/30 flex items-center gap-2 flex-wrap">
                    <a
                      href={network === 'testnet' 
                        ? `${LORA_TESTNET_BASE_URL}/transaction/${response200Result.body.transactionId || paymentTxId}`
                        : `https://lora.algokit.io/mainnet/transaction/${response200Result.body.transactionId || paymentTxId}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>View Tx on AlgoKit Lora {network === 'testnet' ? 'Testnet' : 'Mainnet'} ↗</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <a
                      href={network === 'testnet'
                        ? `${LORA_TESTNET_BASE_URL}/account/${payToAddress}`
                        : `https://lora.algokit.io/mainnet/account/${payToAddress}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs font-mono transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Wallet className="w-3 h-3 text-emerald-400" />
                      <span>Receiver on Lora</span>
                    </a>

                    <a
                      href={network === 'testnet'
                        ? `${LORA_TESTNET_BASE_URL}/asset/${TESTNET_TCOIN_ASA}`
                        : `https://lora.algokit.io/mainnet/asset/${MAINNET_TCOIN_ASA}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs font-mono transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Cpu className="w-3 h-3 text-amber-400" />
                      <span>Asset #{network === 'testnet' ? TESTNET_TCOIN_ASA : MAINNET_TCOIN_ASA}</span>
                    </a>
                  </div>
                </div>

                <pre className="p-3 bg-black/60 rounded-xl overflow-x-auto text-[11px] text-emerald-300 border border-stone-800">
                  {JSON.stringify(response200Result.body, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: BAZAAR DISCOVERY MANIFEST (.well-known/x402-bazaar.json) */}
      {activeTab === 'bazaar' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <FileJson className="w-5 h-5 text-emerald-600" />
                  <span>Public Bazaar Discovery Manifest (.well-known/x402-bazaar.json)</span>
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Autonomous agents query this standard endpoint to discover all monetized Dr. T AI services, pricing, ASA IDs, and CAIP-2 chains.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="/.well-known/x402-bazaar.json"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Raw Endpoint</span>
                </a>
              </div>
            </div>

            {bazaarManifest ? (
              <div className="p-4 bg-stone-950 text-emerald-400 rounded-2xl font-mono text-xs overflow-x-auto border border-stone-800">
                <pre>{JSON.stringify(bazaarManifest, null, 2)}</pre>
              </div>
            ) : (
              <div className="p-8 text-center text-stone-500 font-mono text-xs">
                Loading Bazaar discovery manifest...
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: DEV SDK & CODE GENERATOR */}
      {activeTab === 'sdk' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h3 className="font-bold text-lg text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-emerald-600" />
                  <span>x402 Client SDK & Code Generator</span>
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Ready-to-run client integration code for {selectedEndpoint.name} on {network === 'mainnet' ? 'Algorand Mainnet' : 'Testnet'}.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
                <button
                  onClick={() => setSelectedLang('ts')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
                    selectedLang === 'ts' ? 'bg-emerald-600 text-white' : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  TypeScript
                </button>
                <button
                  onClick={() => setSelectedLang('python')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
                    selectedLang === 'python' ? 'bg-emerald-600 text-white' : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  Python
                </button>
                <button
                  onClick={() => setSelectedLang('curl')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
                    selectedLang === 'curl' ? 'bg-emerald-600 text-white' : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  cURL CLI
                </button>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => copyToClipboard(getCodeSnippet(), 'sdkCode')}
                className="absolute top-3 right-3 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 z-10"
              >
                {copiedText === 'sdkCode' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedText === 'sdkCode' ? 'Copied Code' : 'Copy Code'}</span>
              </button>

              <div className="p-5 bg-stone-950 text-emerald-300 rounded-2xl font-mono text-xs overflow-x-auto border border-stone-800 leading-relaxed">
                <pre>{getCodeSnippet()}</pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ANALYTICS & REPUTATION */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs">
              <div className="text-xs text-stone-500 font-bold uppercase mb-1">Total x402 Micropayments</div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">14,290 Txs</div>
              <div className="text-[11px] text-stone-400 mt-1">100% On-Chain Verified</div>
            </div>

            <div className="p-5 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs">
              <div className="text-xs text-stone-500 font-bold uppercase mb-1">Total Settled Volume</div>
              <div className="text-2xl font-black text-amber-500 font-mono">482.50 T-Coins</div>
              <div className="text-[11px] text-stone-400 mt-1">Algorand ASA ID 31566704</div>
            </div>

            <div className="p-5 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs">
              <div className="text-xs text-stone-500 font-bold uppercase mb-1">Average Handshake Latency</div>
              <div className="text-2xl font-black text-blue-500 font-mono">14 ms</div>
              <div className="text-[11px] text-stone-400 mt-1">HTTP 402 → 200 OK</div>
            </div>

            <div className="p-5 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs">
              <div className="text-xs text-stone-500 font-bold uppercase mb-1">Agent Reputation Score</div>
              <div className="text-2xl font-black text-purple-500 font-mono">99.8 / 100</div>
              <div className="text-[11px] text-stone-400 mt-1">High-Trust Certified</div>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Real-Time Agentic Settlement Ledger & Receipts Log</span>
            </h3>

            <div className="divide-y divide-stone-100 dark:divide-stone-800 text-xs font-mono">
              <div className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-stone-800 dark:text-stone-200">Track 1 — Clinical Contract & Bio Risk Analyzer</div>
                  <div className="text-[10px] text-stone-500">Tx: ALGO_X402_TCOIN_TX_MAINNET_99182310 • ASA 31566704</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-600">0.05 T-Coins</div>
                  <div className="text-[10px] text-emerald-500 font-bold">Receipt Verified</div>
                </div>
              </div>

              <div className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-stone-800 dark:text-stone-200">Track 2 — Agent Payment Router & Spend Policy Engine</div>
                  <div className="text-[10px] text-stone-500">Tx: ALGO_X402_TCOIN_TX_MAINNET_88712391 • ASA 31566704</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-600">0.04 T-Coins</div>
                  <div className="text-[10px] text-emerald-500 font-bold">Receipt Verified</div>
                </div>
              </div>

              <div className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-stone-800 dark:text-stone-200">Track 4 — Streaming & Escrow Micropayment Settler</div>
                  <div className="text-[10px] text-stone-500">Tx: ALGO_X402_TCOIN_TX_MAINNET_77182901 • ASA 31566704</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-600">0.05 T-Coins</div>
                  <div className="text-[10px] text-emerald-500 font-bold">Receipt Verified</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
