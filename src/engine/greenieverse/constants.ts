// ============================================================================
// 🌌 GREENIEVERSE - CONSTANTS & DEFAULT PARAMETERS
// ============================================================================

import { 
  AgriculturalCropSpec, 
  LivestockSpec, 
  CommodityType, 
  CropType, 
  GalacticPlanet, 
  GalacticResource, 
  QuadrantId, 
  FarmQuadrant, 
  TileState 
} from '../../types/greenieverse';

export const TARGET_SCORE = 3043.5;
export const MAX_TURNS = 720;
export const TURNS_PER_DAY = 24;
export const TOTAL_DAYS = 30;
export const GRID_SIZE = 10;

export const INITIAL_CASH = 250;
export const WORKER_HIRE_COST = 850;
export const WATER_WELL_COST = 200;

export const CROP_SPECS: Record<CropType, AgriculturalCropSpec> = {
  WHEAT: {
    type: 'WHEAT',
    name: 'Galactic Wheat',
    icon: '🌾',
    seedCost: 15,
    growthTurns: 48, // 2 days
    growthDays: 2,
    yieldPerTile: 3,
    waterNeed: 2,
    laborUnits: 1,
    expectedRevenue: 60,
    expectedProfit: 45,
    profitPerTurn: 0.94,
    profitPerTile: 45,
    profitPerWorker: 38,
    marketRisk: 'LOW',
    expectedFinalContribution: 38,
  },
  CARROT: {
    type: 'CARROT',
    name: 'Cosmic Carrot',
    icon: '🥕',
    seedCost: 28,
    growthTurns: 72, // 3 days
    growthDays: 3,
    yieldPerTile: 4,
    waterNeed: 3,
    laborUnits: 1.5,
    expectedRevenue: 130,
    expectedProfit: 102,
    profitPerTurn: 1.41,
    profitPerTile: 102,
    profitPerWorker: 74,
    marketRisk: 'LOW',
    expectedFinalContribution: 88,
  },
  TOMATO: {
    type: 'TOMATO',
    name: 'Solar Flare Tomato',
    icon: '🍅',
    seedCost: 55,
    growthTurns: 120, // 5 days
    growthDays: 5,
    yieldPerTile: 5,
    waterNeed: 4,
    laborUnits: 2,
    expectedRevenue: 310,
    expectedProfit: 255,
    profitPerTurn: 2.12,
    profitPerTile: 255,
    profitPerWorker: 190,
    marketRisk: 'MEDIUM',
    expectedFinalContribution: 215,
  },
  STRAWBERRY: {
    type: 'STRAWBERRY',
    name: 'Nebula Strawberry',
    icon: '🍓',
    seedCost: 95,
    growthTurns: 168, // 7 days
    growthDays: 7,
    yieldPerTile: 6,
    waterNeed: 5,
    laborUnits: 3,
    expectedRevenue: 680,
    expectedProfit: 585,
    profitPerTurn: 3.48,
    profitPerTile: 585,
    profitPerWorker: 420,
    marketRisk: 'HIGH',
    expectedFinalContribution: 490,
  },
  MELON: {
    type: 'MELON',
    name: 'Supernova Melon',
    icon: '🍈',
    seedCost: 180,
    growthTurns: 288, // 12 days
    growthDays: 12,
    yieldPerTile: 8,
    waterNeed: 7,
    laborUnits: 4,
    expectedRevenue: 1500,
    expectedProfit: 1320,
    profitPerTurn: 4.58,
    profitPerTile: 1320,
    profitPerWorker: 880,
    marketRisk: 'HIGH',
    expectedFinalContribution: 1210,
  },
};

export const LIVESTOCK_SPECS: Record<'GOOSE' | 'COW' | 'SHEEP', LivestockSpec> = {
  GOOSE: {
    type: 'GOOSE',
    name: 'Graviton Goose',
    icon: '🪿',
    purchaseCost: 350,
    feedCostPerDay: 12,
    product: 'EGG',
    productionIntervalDays: 1,
    unitSalePrice: 28,
    profitPerDay: 16,
    paybackTurns: 525, // ~21.8 days
    recommendation: 'FEASIBLE',
    reason: 'Rapid initial yield with steady low-risk egg income in early-to-mid season.',
  },
  COW: {
    type: 'COW',
    name: 'Stellar Dairy Cow',
    icon: '🐄',
    purchaseCost: 980,
    feedCostPerDay: 28,
    product: 'MILK',
    productionIntervalDays: 1,
    unitSalePrice: 85,
    profitPerDay: 57,
    paybackTurns: 412, // ~17.1 days
    recommendation: 'RECOMMENDED',
    reason: 'High daily cash-flow generator if purchased before Day 13.',
  },
  SHEEP: {
    type: 'SHEEP',
    name: 'Quantum Wool Sheep',
    icon: '🐑',
    purchaseCost: 650,
    feedCostPerDay: 20,
    product: 'WOOL',
    productionIntervalDays: 3,
    unitSalePrice: 240,
    profitPerDay: 60,
    paybackTurns: 260, // ~10.8 days
    recommendation: 'RECOMMENDED',
    reason: 'Highest margin luxury commodity; peak value when textile scarcity index spikes.',
  },
};

export const INITIAL_QUADRANTS: Record<QuadrantId, FarmQuadrant> = {
  NW: {
    id: 'NW',
    name: 'Northwest Quadrant (Home Valley)',
    isUnlocked: true,
    unlockCost: 0,
    tileCount: 25,
    unlockedTiles: 25,
    expectedROI: 100,
    expansionAvailable: false,
    soilQualityRating: 'A+ Loamy Bio-Matrix',
  },
  NE: {
    id: 'NE',
    name: 'Northeast Quadrant (Solar Terrace)',
    isUnlocked: false,
    unlockCost: 450,
    tileCount: 25,
    unlockedTiles: 0,
    expectedROI: 142,
    expansionAvailable: true,
    soilQualityRating: 'A Radiant Volcanic Soil',
  },
  SW: {
    id: 'SW',
    name: 'Southwest Quadrant (Aquifer Basin)',
    isUnlocked: false,
    unlockCost: 680,
    tileCount: 25,
    unlockedTiles: 0,
    expectedROI: 185,
    expansionAvailable: true,
    soilQualityRating: 'S+ Hydro-Infused Alluvial',
  },
  SE: {
    id: 'SE',
    name: 'Southeast Quadrant (High-Yield Plateau)',
    isUnlocked: false,
    unlockCost: 1100,
    tileCount: 25,
    unlockedTiles: 0,
    expectedROI: 220,
    expansionAvailable: true,
    soilQualityRating: 'S Quantum Enriched Peat',
  },
};

export const GALACTIC_PLANETS: GalacticPlanet[] = [
  {
    id: 'earth',
    name: 'Planet Earth (GreenieCulture Ground Zero)',
    tagline: 'Standard 1.0G biological biosphere and primary testing proving grounds.',
    status: 'ACTIVE',
    gravity: '1.0 G',
    atmosphere: 'N2/O2 Nitrogen-Oxygen',
    specialMultiplier: '1.0x Baseline Season Mechanics',
    climate: 'Temperate Seasonal',
    unlocked: true,
  },
  {
    id: 'mars',
    name: 'Ares Prime (Red Sands Colony)',
    tagline: 'Sub-surface geothermal biodomes with high solar radiation boosts.',
    status: 'PROBING',
    gravity: '0.38 G',
    atmosphere: 'CO2 Pressurized Domes',
    specialMultiplier: '+35% Photosynthetic Acceleration',
    climate: 'Hyper-Arid Polar Frost',
    unlocked: true,
  },
  {
    id: 'nova',
    name: 'Nova Auroris (Binary Sun Basin)',
    tagline: 'Dual-star illumination allowing non-stop 24-turn continuous photoperiods.',
    status: 'TERRAFORMING',
    gravity: '0.92 G',
    atmosphere: 'Oxygen-Rich Aurora Canopy',
    specialMultiplier: '2.1x Strawberry & Melon Growth Velocity',
    climate: 'Continuous Luminescence',
    unlocked: false,
  },
  {
    id: 'verdant',
    name: 'Verdant Nexus (Spore Jungle Exoplanet)',
    tagline: 'Super-dense mycorrhizal networks providing near-infinite soil regeneration.',
    status: 'TERRAFORMING',
    gravity: '1.14 G',
    atmosphere: 'High Density Nitrogen-Bio-Mist',
    specialMultiplier: '0 Water Depletion on Tilled Soil',
    climate: 'Ultra-Humid Tropical Canopy',
    unlocked: false,
  },
  {
    id: 'gaia-x',
    name: 'Gaia-X (Quantum Core Hyper-Farm)',
    tagline: 'Type-II Civilization automated orbital agricultural ring world.',
    status: 'COLONIZED',
    gravity: 'Artificial 1.0 G',
    atmosphere: 'Filtered Synthesis Standard',
    specialMultiplier: 'Autonomous Drone Swarm Synergy (+500% ROI)',
    climate: 'Perfect Digital Microclimate',
    unlocked: false,
  },
];

export const GALACTIC_RESOURCES: GalacticResource[] = [
  {
    id: 'water',
    name: 'Pure Hydration Matrix',
    icon: '💧',
    amount: 1420,
    capacity: 2500,
    ratePerTurn: +15,
    description: 'Sub-surface aquifer reserves feeding automated irrigation trenches.',
    unit: 'kL',
  },
  {
    id: 'sunlight',
    name: 'Solar Flux Irradiance',
    icon: '☀️',
    amount: 98,
    capacity: 100,
    ratePerTurn: 0,
    description: 'Atmospheric photon absorption efficiency across all canopy arrays.',
    unit: '%',
  },
  {
    id: 'soil',
    name: 'Bio-Organic Soil Health',
    icon: '🪴',
    amount: 92,
    capacity: 100,
    ratePerTurn: -0.2,
    description: 'Microbial diversity and carbon sequestration index.',
    unit: 'SHI',
  },
  {
    id: 'energy',
    name: 'Orbital Solar Power',
    icon: '⚡',
    amount: 340,
    capacity: 500,
    ratePerTurn: +8,
    description: 'Powering automated worker exosuits and climate stabilizers.',
    unit: 'kWh',
  },
  {
    id: 'biomass',
    name: 'Enriched Compost Biomass',
    icon: '🌱',
    amount: 85,
    capacity: 200,
    ratePerTurn: +2,
    description: 'Recycled agricultural residues converted to high-potency fertilizer.',
    unit: 'kg',
  },
  {
    id: 'credits',
    name: 'Galactic Sol Credits',
    icon: '🪙',
    amount: 250,
    capacity: 999999,
    ratePerTurn: 0,
    description: 'Universal trade currency recognized by Kaggle Agricultural Exchange.',
    unit: 'credits',
  },
];

export function generateInitialGrid(): TileState[][] {
  const grid: TileState[][] = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    const row: TileState[] = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      const isNW = x < 5 && y < 5;
      const isNE = x >= 5 && y < 5;
      const isSW = x < 5 && y >= 5;
      const quadrant: QuadrantId = isNW ? 'NW' : isNE ? 'NE' : isSW ? 'SW' : 'SE';
      const isUnlocked = isNW; // Northwest starts unlocked

      // Pre-seed some starting tiles in NW
      let status: TileState['status'] = isUnlocked ? 'EMPTY' : 'LOCKED';
      let crop: CropType | undefined = undefined;
      let cropAge: number | undefined = undefined;
      let cropMaxAge: number | undefined = undefined;
      let isWatered: boolean | undefined = false;

      if (isNW) {
        if (x === 1 && y === 1) {
          status = 'PLANTED';
          crop = 'WHEAT';
          cropAge = 24;
          cropMaxAge = 48;
          isWatered = true;
        } else if (x === 2 && y === 1) {
          status = 'PLANTED';
          crop = 'CARROT';
          cropAge = 36;
          cropMaxAge = 72;
          isWatered = true;
        } else if (x === 1 && y === 2) {
          status = 'MATURE';
          crop = 'WHEAT';
          cropAge = 48;
          cropMaxAge = 48;
          isWatered = false;
        } else if (x === 3 && y === 3) {
          status = 'ANIMAL_PEN';
        }
      }

      row.push({
        x,
        y,
        quadrant,
        status,
        isUnlocked,
        crop,
        cropAge,
        cropMaxAge,
        isWatered,
        soilHealth: isUnlocked ? 92 : 75,
        moisture: isWatered ? 85 : 40,
        animal: status === 'ANIMAL_PEN' ? {
          type: 'GOOSE',
          fedToday: true,
          productionCountdown: 6,
          totalProduced: 3,
        } : undefined,
      });
    }
    grid.push(row);
  }
  return grid;
}
