// ============================================================================
// 🌌 GREENIEVERSE - GALACTIC FARMING INTELLIGENCE & AUTONOMOUS AGRICULTURE
// TypeScript Interfaces & Data Contracts
// ============================================================================

export type QuadrantId = 'NW' | 'NE' | 'SW' | 'SE';

export type CropType = 'WHEAT' | 'CARROT' | 'TOMATO' | 'STRAWBERRY' | 'MELON';

export type CommodityType = 
  | 'WHEAT'
  | 'CARROT'
  | 'TOMATO'
  | 'STRAWBERRY'
  | 'MELON'
  | 'EGG'
  | 'MILK'
  | 'WOOL';

export type AnimalType = 'GOOSE' | 'COW' | 'SHEEP';

export type TileStatus = 
  | 'LOCKED'
  | 'EMPTY'
  | 'TILL'
  | 'PLANTED'
  | 'WATERED'
  | 'MATURE'
  | 'WEED'
  | 'ANIMAL_PEN'
  | 'INFRASTRUCTURE';

export type WorkerTaskType = 
  | 'IDLE'
  | 'PLANT'
  | 'WATER'
  | 'HARVEST'
  | 'FEED'
  | 'FERTILIZE'
  | 'COLLECT'
  | 'MOVE'
  | 'TILL';

export type OpponentStrategyType = 
  | 'AGGRESSIVE HIGH-VALUE FARMER'
  | 'WHEAT FARMER'
  | 'CASH FARMER'
  | 'LIVESTOCK FARMER'
  | 'MARKET TRADER'
  | 'EXPANSION FARMER'
  | 'BALANCED FARMER'
  | 'DEFENSIVE FARMER';

export type MarketSignal = 'BUY' | 'SELL' | 'HOLD' | 'PRODUCE' | 'AVOID';

export type SeasonPhase = 
  | 'PHASE 1 — BOOTSTRAP'
  | 'PHASE 2 — SCALE'
  | 'PHASE 3 — ARBITRAGE'
  | 'PHASE 4 — LIQUIDATION';

export interface TileState {
  x: number;
  y: number;
  quadrant: QuadrantId;
  status: TileStatus;
  isUnlocked: boolean;
  crop?: CropType;
  cropAge?: number;
  cropMaxAge?: number;
  isWatered?: boolean;
  fertilized?: boolean;
  animal?: {
    type: AnimalType;
    fedToday: boolean;
    productionCountdown: number;
    totalProduced: number;
  };
  soilHealth: number; // 0-100
  moisture: number; // 0-100
}

export interface FarmQuadrant {
  id: QuadrantId;
  name: string;
  isUnlocked: boolean;
  unlockCost: number;
  tileCount: number;
  unlockedTiles: number;
  expectedROI: number; // Percentage
  expansionAvailable: boolean;
  soilQualityRating: string;
}

export interface MarketProductInfo {
  id: CommodityType;
  name: string;
  icon: string;
  category: 'CROP' | 'LIVESTOCK';
  currentPrice: number;
  basePrice: number;
  previousPrice: number;
  priceChangePercent: number;
  forecast24Turn: number;
  marketSupply: 'VERY LOW' | 'LOW' | 'BALANCED' | 'HIGH' | 'OVERSUPPLY';
  demand: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';
  scarcityScore: number; // 0-100
  priceVelocity: number; // Rate of change
  priceAcceleration: number; // 2nd derivative
  trend: 'UP_STRONG' | 'UP' | 'STABLE' | 'DOWN' | 'DOWN_STRONG';
  aiRecommendation: MarketSignal;
  aiReasoning: string;
  historicalPrices: Array<{ turn: number; actual: number; predicted: number; opponentSupply: number; ourSupply: number }>;
}

export interface OpponentState {
  name: string;
  cash: number;
  estimatedNetWorth: number;
  unlockedTiles: number;
  cropsCount: Record<CropType, number>;
  animalCount: Record<AnimalType, number>;
  workerCount: number;
  strategyClass: OpponentStrategyType;
  strategyConfidence: number; // 0-100
  marketActivitySummary: string;
  next24TurnsSupplyForecast: Array<{ commodity: CommodityType; count: number; marketImpact: string }>;
  recentHarvests: Array<{ turn: number; item: CommodityType; quantity: number }>;
}

export interface WorkerAgent {
  id: string;
  name: string;
  x: number;
  y: number;
  targetX?: number;
  targetY?: number;
  task: WorkerTaskType;
  targetDescription: string;
  taskValue: number;
  distanceToTarget: number;
  efficiency: number; // 0-100
  status: 'ACTIVE' | 'MOVING' | 'WAITING';
}

export interface AgriculturalCropSpec {
  type: CropType;
  name: string;
  icon: string;
  seedCost: number;
  growthTurns: number;
  growthDays: number;
  yieldPerTile: number;
  waterNeed: number;
  laborUnits: number;
  expectedRevenue: number;
  expectedProfit: number;
  profitPerTurn: number;
  profitPerTile: number;
  profitPerWorker: number;
  marketRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  expectedFinalContribution: number;
}

export interface LivestockSpec {
  type: AnimalType;
  name: string;
  icon: string;
  purchaseCost: number;
  feedCostPerDay: number;
  product: CommodityType;
  productionIntervalDays: number;
  unitSalePrice: number;
  profitPerDay: number;
  paybackTurns: number;
  recommendation: 'RECOMMENDED' | 'FEASIBLE' | 'NOT_RECOMMENDED';
  reason: string;
}

export interface PortfolioAssetAllocation {
  category: 'CASH' | 'ACTIVE_CROPS' | 'ANIMALS' | 'LAND_EQUITY' | 'INVENTORY' | 'WORKER_FLEET';
  label: string;
  value: number;
  percentage: number;
  color: string;
}

export interface RiskMetrics {
  marketRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  cropRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  opponentRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  liquidityRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  investmentRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  endgameRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  overallScore: number; // 0-100
  summary: string;
}

export interface CandidateAction {
  id: string;
  actionType: 'PLANT' | 'WATER' | 'HARVEST' | 'FERTILIZE' | 'BUY_SEED' | 'SELL_INVENTORY' | 'HIRE_WORKER' | 'BUY_LAND' | 'FEED_ANIMAL';
  targetTile?: { x: number; y: number };
  commodity?: CommodityType;
  expectedProfit: number;
  riskScore: number; // 0-100
  timeCost: number;
  opportunityCost: number;
  utilityScore: number;
  explanation: string;
  isSelected: boolean;
}

export interface DecisionExplainerItem {
  id: string;
  turn: number;
  day: number;
  action: string;
  title: string;
  bulletPoints: string[];
  decisionBadge: string;
  confidence: number;
  expectedWealthDelta: number;
}

export interface LossAnalysisReport {
  scoreAchieved: number;
  targetBenchmark: number;
  won: boolean;
  lostWealthBreakdown: {
    marketTiming: number;
    cropSelection: number;
    workerInefficiency: number;
    lateInvestment: number;
    movementWaste: number;
    opponentCounter: number;
    liquidityShortage: number;
  };
  largestWeakness: string;
  prescribedAdaptation: string;
}

export interface EvolutionGenome {
  generation: number;
  workerThreshold: number;
  landThreshold: number;
  cashReserveRatio: number;
  cropWeights: Record<CropType, number>;
  marketWeight: number;
  opponentWeight: number;
  scarcityWeight: number;
  riskTolerance: number;
  fertilizerThreshold: number;
  endgameTurnCutoff: number;
  fitnessScore: number;
  winRate: number;
  matchesPlayed: number;
}

export interface MatchResult {
  matchId: string;
  seed: number;
  greenieScore: number;
  opponentScore: number;
  opponentType: string;
  winner: 'GREENIE' | 'OPPONENT' | 'TIE';
  totalTurns: number;
  timestamp: string;
  keyTurningPoint: string;
}

export interface GalacticPlanet {
  id: string;
  name: string;
  tagline: string;
  status: 'ACTIVE' | 'PROBING' | 'TERRAFORMING' | 'COLONIZED';
  gravity: string;
  atmosphere: string;
  specialMultiplier: string;
  climate: string;
  unlocked: boolean;
}

export interface GalacticResource {
  id: string;
  name: string;
  icon: string;
  amount: number;
  capacity: number;
  ratePerTurn: number;
  description: string;
  unit: string;
}

export interface GameState {
  currentTurn: number;
  maxTurns: number;
  currentDay: number;
  totalDays: number;
  seasonPhase: SeasonPhase;
  cash: number;
  inventory: Record<CommodityType, number>;
  grid: TileState[][];
  quadrants: Record<QuadrantId, FarmQuadrant>;
  market: Record<CommodityType, MarketProductInfo>;
  opponent: OpponentState;
  workers: WorkerAgent[];
  assetsValue: number;
  netWorth: number;
  targetScore: number;
  status: 'OPTIMIZING' | 'SIMULATING' | 'PAUSED' | 'COMPLETED';
  lastActionSummary: string;
  recentDecisions: DecisionExplainerItem[];
  risk: RiskMetrics;
  portfolio: PortfolioAssetAllocation[];
  lossAnalysis?: LossAnalysisReport;
}

export type GreenieViewTab = 
  | 'COMMAND_CENTER'
  | 'FARM_GRID'
  | 'MARKET_TERMINAL'
  | 'OPPONENT_INTEL'
  | 'ECONOMY_PORTFOLIO'
  | 'WORKERS_FLEET'
  | 'GREENIE_LAB'
  | 'REPLAY_EXPLAINER'
  | 'GALACTIC_EXPANSION'
  | 'SPEC_DOCS';
