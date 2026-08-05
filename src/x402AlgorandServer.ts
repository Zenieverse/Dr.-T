import { Request, Response } from 'express';

export const MAINNET_USDC_ASA = 31566704;
export const TESTNET_USDC_ASA = 10458941;
export const ALGORAND_MAINNET_CAIP2 = 'algorand:wG23fS2A7A3PZBuWCMvxA-ZG2gNtx9O0';
export const GOPLAUSIBLE_FACILITATOR = 'https://facilitator.goplausible.com';
export const DEFAULT_PAY_TO = 'DRT402MAINNETPAYMENTRECEIVERADDRESS31566704USDC';

export interface X402BazaarManifest {
  x402Version: string;
  name: string;
  description: string;
  facilitator: string;
  tags: string[];
  tag: string;
  extra: {
    tag: string;
    challenge: string;
  };
  payTo: string;
  networks: {
    mainnet: { chain: string; caip2?: string; networkIdentifier?: string; assetId: number; symbol: string; decimals: number };
    testnet: { chain: string; caip2?: string; networkIdentifier?: string; assetId: number; symbol: string; decimals: number };
  };
  endpoints: {
    type: 'Standard' | 'Composite' | 'Orchestrator';
    name: string;
    path: string;
    description: string;
    priceUSDC: string;
    amountMicroUSDC: number;
    tags: string[];
  }[];
}

export function getBazaarManifest(network = 'mainnet', customPayTo?: string): X402BazaarManifest {
  const payTo = customPayTo || DEFAULT_PAY_TO;
  return {
    x402Version: '1.0',
    name: 'Dr. T Fluid Intelligence x402 Suite',
    description: 'Algorand Mainnet x402 Agentic Micro-Payment Services featuring Standard Socratic reasoning, Composite ARC matrix solving and Qwen math verification, and Multi-Agent Orchestrator pipelines.',
    facilitator: GOPLAUSIBLE_FACILITATOR,
    tags: ['x402-global-solution', 'dr-t', 'fluid-intelligence', 'arc-solver', 'agentic-commerce'],
    tag: 'x402-global-solution',
    extra: {
      tag: 'x402-global-solution',
      challenge: 'Algorand-x402 Challenge-3'
    },
    payTo: payTo,
    networks: {
      mainnet: {
        chain: 'Algorand Mainnet',
        caip2: ALGORAND_MAINNET_CAIP2,
        networkIdentifier: 'ALGORAND_Mainnet_CAIP2',
        assetId: MAINNET_USDC_ASA,
        symbol: 'USDC',
        decimals: 6
      },
      testnet: {
        chain: 'Algorand Testnet',
        caip2: 'algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCD0',
        networkIdentifier: 'ALGORAND_Testnet_CAIP2',
        assetId: TESTNET_USDC_ASA,
        symbol: 'USDC',
        decimals: 6
      }
    },
    endpoints: [
      {
        type: 'Standard',
        name: 'Track 1 — Clinical Contract & Bio Risk Analyzer',
        path: '/api/x402/app/clinical-risk-analyzer',
        description: 'Track 1 AI App: Monetized per-call clinical trial contract risk scorer & HIPAA compliance analyzer',
        priceUSDC: '$0.05',
        amountMicroUSDC: 50000,
        tags: ['x402-global-solution', 'track-1-ai-app', 'clinical-risk', 'contract-analyzer']
      },
      {
        type: 'Standard',
        name: 'Track 1 — AI Agent Code & Guardrail Checker',
        path: '/api/x402/app/code-review-assistant',
        description: 'Track 1 AI App: Pay-per-call automated TypeScript/Python agent code reviewer & security guardrail inspector',
        priceUSDC: '$0.02',
        amountMicroUSDC: 20000,
        tags: ['x402-global-solution', 'track-1-ai-app', 'code-reviewer', 'guardrails']
      },
      {
        type: 'Standard',
        name: 'Track 1 — Dr. T Socratic Oracle',
        path: '/api/x402/standard/dr-t-query',
        description: 'Track 1 AI App: Socratic AI reasoning engine returning empathetic advice & structured logic breakdown',
        priceUSDC: '$0.01',
        amountMicroUSDC: 10000,
        tags: ['x402-global-solution', 'track-1-ai-app', 'dr-t-oracle']
      },
      {
        type: 'Orchestrator',
        name: 'Track 2 — Agent Payment Router & Spend Policy Engine',
        path: '/api/x402/infra/payment-router',
        description: 'Track 2 Infra: Autonomous payment router that verifies spend limits and settles micro-txs across multi-agent networks',
        priceUSDC: '$0.04',
        amountMicroUSDC: 40000,
        tags: ['x402-global-solution', 'track-2-infra', 'payment-router', 'spend-policy']
      },
      {
        type: 'Standard',
        name: 'Track 2 — Cryptographic Receipt Verification Service',
        path: '/api/x402/infra/receipt-verifier',
        description: 'Track 2 Infra: On-chain transaction receipt verifier confirming Algorand/Stellar settlement proof headers',
        priceUSDC: '$0.01',
        amountMicroUSDC: 10000,
        tags: ['x402-global-solution', 'track-2-infra', 'receipt-verifier', 'on-chain-proof']
      },
      {
        type: 'Standard',
        name: 'Track 3 — x402 Dev Toolkit & Header Simulator Generator',
        path: '/api/x402/devtools/sdk-manifest-generator',
        description: 'Track 3 DevTools: Automated OpenAPI & x402 header generator tool for client SDK integration',
        priceUSDC: '$0.02',
        amountMicroUSDC: 20000,
        tags: ['x402-global-solution', 'track-3-devtools', 'sdk-generator', 'header-simulator']
      },
      {
        type: 'Composite',
        name: 'Track 4 — Streaming & Escrow Micropayment Settler',
        path: '/api/x402/defi/escrow-stream-settler',
        description: 'Track 4 DeFi: Time-locked escrow & per-second streaming USDC micropayment settlement smart contract wrapper',
        priceUSDC: '$0.05',
        amountMicroUSDC: 50000,
        tags: ['x402-global-solution', 'track-4-defi', 'streaming-payments', 'escrow']
      },
      {
        type: 'Composite',
        name: 'Track 5 — Cosmos Green Harvest Arbitrage Agent',
        path: '/api/x402/open/cosmos-harvest-arbitrage',
        description: 'Track 5 Open Innovation: Interstellar crop yield arbitrage & bio-market autonomous trading agent',
        priceUSDC: '$0.03',
        amountMicroUSDC: 30000,
        tags: ['x402-global-solution', 'track-5-open', 'cosmos-green', 'harvest-arbitrage']
      },
      {
        type: 'Composite',
        name: 'ARC Fluid Intelligence Solver',
        path: '/api/x402/composite/arc-solve',
        description: 'ARC 2D grid matrix solver: Evaluates visual spatial grid patterns using DSL transformations & beam search',
        priceUSDC: '$0.05',
        amountMicroUSDC: 50000,
        tags: ['x402-global-solution', 'composite-endpoint', 'arc-solver']
      },
      {
        type: 'Composite',
        name: 'Qwen-2.5 Deep Math Engine',
        path: '/api/x402/composite/qwen-reasoning',
        description: 'Deep mathematical proof & formal logic verification using Qwen-2.5 72B',
        priceUSDC: '$0.03',
        amountMicroUSDC: 30000,
        tags: ['x402-global-solution', 'composite-endpoint', 'qwen-math']
      },
      {
        type: 'Orchestrator',
        name: 'Multi-Agent Autonomous Orchestrator',
        path: '/api/x402/orchestrator/multi-agent-pipeline',
        description: 'Sequences downstream micro-payments across Socratic Oracle, ARC Solver, and Qwen Math to output unified consensus',
        priceUSDC: '$0.10',
        amountMicroUSDC: 100000,
        tags: ['x402-global-solution', 'orchestrator-endpoint', 'multi-agent-settlement']
      }
    ]
  };
}

export function handle402Response(
  res: Response, 
  network: string, 
  amountMicroUSDC: number, 
  priceUSDC: string, 
  endpointType: 'Standard' | 'Composite' | 'Orchestrator',
  endpointName: string,
  payToAddress?: string
) {
  const isMainnet = network !== 'testnet';
  const assetId = isMainnet ? MAINNET_USDC_ASA : TESTNET_USDC_ASA;
  const netName = isMainnet ? 'ALGORAND_Mainnet_CAIP2' : 'ALGORAND_Testnet_CAIP2';
  const caip2 = isMainnet ? ALGORAND_MAINNET_CAIP2 : 'algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCD0';
  const payTo = payToAddress || DEFAULT_PAY_TO;

  res.status(402)
    .set({
      'X-402-Version': '1.0',
      'X-402-Network': netName,
      'X-402-CAIP2': caip2,
      'X-402-PayTo': payTo,
      'X-402-Asset-ID': String(assetId),
      'X-402-Amount': String(amountMicroUSDC),
      'X-402-Facilitator': GOPLAUSIBLE_FACILITATOR,
      'X-402-Tag': 'x402-global-solution',
      'X-402-Challenge': 'Algorand-x402 Challenge-3',
      'X-402-Tags': 'x402-global-solution,dr-t,agentic-commerce'
    })
    .json({
      x402Version: '1.0',
      status: 'Payment Required',
      network: netName,
      caip2: caip2,
      assetId: assetId,
      assetSymbol: 'USDC',
      amount: amountMicroUSDC,
      priceUSDC: priceUSDC,
      payTo: payTo,
      facilitator: GOPLAUSIBLE_FACILITATOR,
      endpointType: endpointType,
      endpointName: endpointName,
      tag: 'x402-global-solution',
      extra: {
        tag: 'x402-global-solution',
        challenge: 'Algorand-x402 Challenge-3'
      },
      tags: ['x402-global-solution', 'dr-t', 'fluid-intelligence', netName],
      bazaarDiscovery: '/.well-known/x402-bazaar.json',
      paymentInstructions: {
        header: 'X-402-Payment: <algorand_tx_id_or_goplausible_receipt>',
        description: `Transfer ${priceUSDC} (${amountMicroUSDC} microUSDC) on ${isMainnet ? 'Algorand Mainnet (ASA 31566704 - ALGORAND_Mainnet_CAIP2)' : 'Algorand Testnet (ASA 10458941)'} to ${payTo}`,
        facilitatorUrl: GOPLAUSIBLE_FACILITATOR
      }
    });
}
