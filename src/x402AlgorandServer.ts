import { Request, Response } from 'express';

export const MAINNET_TCOIN_ASA = 31566704;
export const TESTNET_TCOIN_ASA = 10458941;
export const ALGORAND_MAINNET_CAIP2 = 'algorand:wG23fS2A7A3PZBuWCMvxA-ZG2gNtx9O0';
export const ALGORAND_TESTNET_CAIP2 = 'algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCD0';
export const GOPLAUSIBLE_FACILITATOR = 'https://facilitator.goplausible.xyz';
export const GOPLAUSIBLE_FACILITATOR_ALT = 'https://facilitator.goplausible.com';
export const LORA_TESTNET_BASE_URL = 'https://lora.algokit.io/testnet';
export const DEFAULT_PAY_TO = 'DRT402MAINNETPAYMENTRECEIVERADDRESS31566704TCOIN';
export const TESTNET_DEFAULT_PAY_TO = 'DRT402TESTNETRECEIVERACCOUNTADDR10458941ALGO';

export function getLoraTestnetTxUrl(txId: string): string {
  return `${LORA_TESTNET_BASE_URL}/transaction/${encodeURIComponent(txId)}`;
}

export function getLoraTestnetAssetUrl(assetId: number | string): string {
  return `${LORA_TESTNET_BASE_URL}/asset/${encodeURIComponent(assetId)}`;
}

export function getLoraTestnetAccountUrl(account: string): string {
  return `${LORA_TESTNET_BASE_URL}/account/${encodeURIComponent(account)}`;
}

// Backward compatibility exports
export const MAINNET_USDC_ASA = MAINNET_TCOIN_ASA;
export const TESTNET_USDC_ASA = TESTNET_TCOIN_ASA;

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
    priceTCoin: string;
    priceUSDC: string;
    amountMicroT: number;
    amountMicroUSDC: number;
    tags: string[];
  }[];
}

export function getBazaarManifest(network = 'mainnet', customPayTo?: string): X402BazaarManifest {
  const payTo = customPayTo || DEFAULT_PAY_TO;
  return {
    x402Version: '1.0',
    name: 'Dr. T Fluid Intelligence x402 Suite',
    description: 'Algorand Mainnet x402 Agentic Micro-Payment Services featuring T-Coins (T-COIN ASA 31566704) native platform currency for Socratic reasoning, Composite ARC matrix solving, Qwen math verification, and Multi-Agent Orchestrator pipelines.',
    facilitator: GOPLAUSIBLE_FACILITATOR,
    tags: ['x402-global-solution', 'dr-t', 't-coin', 'fluid-intelligence', 'arc-solver', 'agentic-commerce'],
    tag: 'x402-global-solution',
    extra: {
      tag: 'x402-global-solution',
      challenge: 'Algorand-x402-T-Coin-Challenge-3'
    },
    payTo: payTo,
    networks: {
      mainnet: {
        chain: 'Algorand Mainnet',
        caip2: ALGORAND_MAINNET_CAIP2,
        networkIdentifier: 'ALGORAND_Mainnet_CAIP2',
        assetId: MAINNET_TCOIN_ASA,
        symbol: 'T-COIN',
        decimals: 6
      },
      testnet: {
        chain: 'Algorand Testnet',
        caip2: 'algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCD0',
        networkIdentifier: 'ALGORAND_Testnet_CAIP2',
        assetId: TESTNET_TCOIN_ASA,
        symbol: 'T-COIN',
        decimals: 6
      }
    },
    endpoints: [
      {
        type: 'Standard',
        name: 'Track 1 — Clinical Contract & Bio Risk Analyzer',
        path: '/api/x402/app/clinical-risk-analyzer',
        description: 'Track 1 AI App: Monetized per-call clinical trial contract risk scorer & HIPAA compliance analyzer',
        priceTCoin: '0.05 T-Coins',
        priceUSDC: '$0.05',
        amountMicroT: 50000,
        amountMicroUSDC: 50000,
        tags: ['x402-global-solution', 'track-1-ai-app', 'clinical-risk', 'contract-analyzer', 't-coin']
      },
      {
        type: 'Standard',
        name: 'Track 1 — AI Agent Code & Guardrail Checker',
        path: '/api/x402/app/code-review-assistant',
        description: 'Track 1 AI App: Pay-per-call automated TypeScript/Python agent code reviewer & security guardrail inspector',
        priceTCoin: '0.02 T-Coins',
        priceUSDC: '$0.02',
        amountMicroT: 20000,
        amountMicroUSDC: 20000,
        tags: ['x402-global-solution', 'track-1-ai-app', 'code-reviewer', 'guardrails', 't-coin']
      },
      {
        type: 'Standard',
        name: 'Track 1 — Dr. T Socratic Oracle',
        path: '/api/x402/standard/dr-t-query',
        description: 'Track 1 AI App: Socratic AI reasoning engine returning empathetic advice & structured logic breakdown',
        priceTCoin: '0.01 T-Coins',
        priceUSDC: '$0.01',
        amountMicroT: 10000,
        amountMicroUSDC: 10000,
        tags: ['x402-global-solution', 'track-1-ai-app', 'dr-t-oracle', 't-coin']
      },
      {
        type: 'Orchestrator',
        name: 'Track 2 — Agent Payment Router & Spend Policy Engine',
        path: '/api/x402/infra/payment-router',
        description: 'Track 2 Infra: Autonomous payment router that verifies spend limits and settles micro-txs across multi-agent networks',
        priceTCoin: '0.04 T-Coins',
        priceUSDC: '$0.04',
        amountMicroT: 40000,
        amountMicroUSDC: 40000,
        tags: ['x402-global-solution', 'track-2-infra', 'payment-router', 'spend-policy', 't-coin']
      },
      {
        type: 'Standard',
        name: 'Track 2 — Cryptographic Receipt Verification Service',
        path: '/api/x402/infra/receipt-verifier',
        description: 'Track 2 Infra: On-chain transaction receipt verifier confirming Algorand/Stellar settlement proof headers',
        priceTCoin: '0.01 T-Coins',
        priceUSDC: '$0.01',
        amountMicroT: 10000,
        amountMicroUSDC: 10000,
        tags: ['x402-global-solution', 'track-2-infra', 'receipt-verifier', 'on-chain-proof', 't-coin']
      },
      {
        type: 'Standard',
        name: 'Track 3 — x402 Dev Toolkit & Header Simulator Generator',
        path: '/api/x402/devtools/sdk-manifest-generator',
        description: 'Track 3 DevTools: Automated OpenAPI & x402 header generator tool for client SDK integration',
        priceTCoin: '0.02 T-Coins',
        priceUSDC: '$0.02',
        amountMicroT: 20000,
        amountMicroUSDC: 20000,
        tags: ['x402-global-solution', 'track-3-devtools', 'sdk-generator', 'header-simulator', 't-coin']
      },
      {
        type: 'Composite',
        name: 'Track 4 — Streaming & Escrow Micropayment Settler',
        path: '/api/x402/defi/escrow-stream-settler',
        description: 'Track 4 DeFi: Time-locked escrow & per-second streaming T-Coin micropayment settlement smart contract wrapper',
        priceTCoin: '0.05 T-Coins',
        priceUSDC: '$0.05',
        amountMicroT: 50000,
        amountMicroUSDC: 50000,
        tags: ['x402-global-solution', 'track-4-defi', 'streaming-payments', 'escrow', 't-coin']
      },
      {
        type: 'Composite',
        name: 'Track 5 — Cosmos Green Harvest Arbitrage Agent',
        path: '/api/x402/open/cosmos-harvest-arbitrage',
        description: 'Track 5 Open Innovation: Interstellar crop yield arbitrage & bio-market autonomous trading agent',
        priceTCoin: '0.03 T-Coins',
        priceUSDC: '$0.03',
        amountMicroT: 30000,
        amountMicroUSDC: 30000,
        tags: ['x402-global-solution', 'track-5-open', 'cosmos-green', 'harvest-arbitrage', 't-coin']
      },
      {
        type: 'Composite',
        name: 'ARC Fluid Intelligence Solver',
        path: '/api/x402/composite/arc-solve',
        description: 'ARC 2D grid matrix solver: Evaluates visual spatial grid patterns using DSL transformations & beam search',
        priceTCoin: '0.05 T-Coins',
        priceUSDC: '$0.05',
        amountMicroT: 50000,
        amountMicroUSDC: 50000,
        tags: ['x402-global-solution', 'composite-endpoint', 'arc-solver', 't-coin']
      },
      {
        type: 'Composite',
        name: 'Qwen-2.5 Deep Math Engine',
        path: '/api/x402/composite/qwen-reasoning',
        description: 'Deep mathematical proof & formal logic verification using Qwen-2.5 72B',
        priceTCoin: '0.03 T-Coins',
        priceUSDC: '$0.03',
        amountMicroT: 30000,
        amountMicroUSDC: 30000,
        tags: ['x402-global-solution', 'composite-endpoint', 'qwen-math', 't-coin']
      },
      {
        type: 'Orchestrator',
        name: 'Multi-Agent Autonomous Orchestrator',
        path: '/api/x402/orchestrator/multi-agent-pipeline',
        description: 'Sequences downstream micro-payments across Socratic Oracle, ARC Solver, and Qwen Math to output unified consensus',
        priceTCoin: '0.10 T-Coins',
        priceUSDC: '$0.10',
        amountMicroT: 100000,
        amountMicroUSDC: 100000,
        tags: ['x402-global-solution', 'orchestrator-endpoint', 'multi-agent-settlement', 't-coin']
      }
    ]
  };
}

export function handle402Response(
  res: Response, 
  network: string, 
  amountMicroT: number, 
  priceTCoin: string, 
  endpointType: 'Standard' | 'Composite' | 'Orchestrator',
  endpointName: string,
  payToAddress?: string
) {
  const isMainnet = network !== 'testnet';
  const assetId = isMainnet ? MAINNET_TCOIN_ASA : TESTNET_TCOIN_ASA;
  const netName = isMainnet ? 'ALGORAND_Mainnet_CAIP2' : 'ALGORAND_Testnet_CAIP2';
  const caip2 = isMainnet ? ALGORAND_MAINNET_CAIP2 : ALGORAND_TESTNET_CAIP2;
  const payTo = payToAddress || (isMainnet ? DEFAULT_PAY_TO : TESTNET_DEFAULT_PAY_TO);
  const loraBase = isMainnet ? 'https://lora.algokit.io/mainnet' : LORA_TESTNET_BASE_URL;

  res.status(402)
    .set({
      'X-402-Version': '1.0',
      'X-402-Network': netName,
      'X-402-CAIP2': caip2,
      'X-402-PayTo': payTo,
      'X-402-Asset-ID': String(assetId),
      'X-402-Amount': String(amountMicroT),
      'X-402-Symbol': 'T-COIN',
      'X-402-Facilitator': GOPLAUSIBLE_FACILITATOR,
      'X-402-Explorer': loraBase,
      'X-402-Tag': 'x402-global-solution',
      'X-402-Challenge': 'Algorand-x402-T-Coin-Challenge-3',
      'X-402-Tags': 'x402-global-solution,dr-t,t-coin,agentic-commerce'
    })
    .json({
      x402Version: '1.0',
      status: 'Payment Required',
      network: netName,
      caip2: caip2,
      assetId: assetId,
      assetSymbol: 'T-COIN',
      amount: amountMicroT,
      priceTCoin: priceTCoin,
      priceUSDC: priceTCoin.replace('T-Coins', 'USD').replace('T-Coin', 'USD'),
      payTo: payTo,
      facilitator: GOPLAUSIBLE_FACILITATOR,
      endpointType: endpointType,
      endpointName: endpointName,
      tag: 'x402-global-solution',
      extra: {
        tag: 'x402-global-solution',
        challenge: 'Algorand-x402-T-Coin-Challenge-3'
      },
      tags: ['x402-global-solution', 'dr-t', 't-coin', 'fluid-intelligence', netName],
      bazaarDiscovery: '/.well-known/x402-bazaar.json',
      loraExplorer: {
        networkUrl: loraBase,
        assetUrl: `${loraBase}/asset/${assetId}`,
        accountUrl: `${loraBase}/account/${payTo}`
      },
      paymentInstructions: {
        header: 'X-402-Payment: <algorand_tx_id_or_goplausible_receipt>',
        description: `Transfer ${priceTCoin} (${amountMicroT.toLocaleString()} microT) on ${isMainnet ? 'Algorand Mainnet (T-COIN ASA 31566704 - ALGORAND_Mainnet_CAIP2)' : 'Algorand Testnet (ASA 10458941)'} to ${payTo}`,
        facilitatorUrl: GOPLAUSIBLE_FACILITATOR,
        loraExplorerUrl: loraBase
      }
    });
}

