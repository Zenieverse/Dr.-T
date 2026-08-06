import React, { useState, useEffect } from 'react';
import { 
  Sprout, Sun, Droplets, TrendingUp, Sparkles, Cpu, Award, Zap, 
  Heart, Volume2, VolumeX, Play, Pause, ArrowUpRight, ArrowDownRight, 
  Activity, Brain, DollarSign, Radio, Compass, Globe, Rocket, Orbit,
  Gift, Ticket, Flame, RotateCcw, CheckCircle2, ShoppingBag, Dices,
  Trophy, ExternalLink, ShieldCheck, Copy, Star
} from 'lucide-react';

// Types for Intergalactic Crops & Bio-Products
export interface Crop {
  id: string;
  name: string;
  category: 'Galactic Botanical' | 'Ion Algae' | 'Quantum Fungal' | 'Cosmic Bio-Herbal';
  icon: string;
  growthTimeSec: number;
  healthBenefit: string;
  basePrice: number;
  currentPrice: number;
  priceTrend: 'up' | 'down' | 'stable';
  priceChangePct: number;
  yieldPerPlot: number;
  demandIndex: number; // 0 to 100
  seniorAccessibilityNote: string;
  milkyWaySectorOrigin: string;
}

export interface Animal {
  id: string;
  name: string;
  species: string;
  icon: string;
  productName: string;
  productPrice: number;
  happiness: number; // 0 to 100
  healthBenefit: string;
  feedCostPerCycle: number;
  seniorTherapyScore: number;
  galacticHabitat: string;
}

export interface FarmPlot {
  id: number;
  crop: Crop | null;
  stage: 'empty' | 'planted' | 'growing' | 'mature';
  growthProgress: number; // 0 to 100
  waterLevel: number; // 0 to 100
  nutrientLevel: number; // 0 to 100
  isAutoManagedByAI: boolean;
  yieldBoost: number;
  sectorName: string;
}

export interface MarketEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  impactedItem: string;
  priceMultiplier: number;
  type: 'health_surge' | 'weather_boost' | 'demand_spike' | 'market_dip';
  starSystem: string;
}

export interface AgentDecisionLog {
  id: string;
  time: string;
  phase: 'Perception' | 'Planning' | 'Action' | 'Learning';
  message: string;
  detail: string;
  impactScore: number;
  galacticSector: string;
}

export interface LeaderboardEntry {
  rank: number;
  farmerName: string;
  starSystemOrigin: string;
  isAI: boolean;
  avatarIcon: string;
  badge: string;
  longevityPoints: number;
  bioRevenue: number;
  sustainabilityRating: string;
  activeCropsCount: number;
  seniorCareRating: number;
}

export interface GalacticSector {
  id: string;
  name: string;
  armName: string;
  icon: string;
  solarRadiation: string;
  gravityType: string;
  yieldBonusPct: number;
  description: string;
}

export interface Quest {
  id: string;
  title: string;
  category: 'Daily' | 'Dr. T Galaxy Challenge' | 'Ecosystem Goal';
  description: string;
  progress: number;
  maxProgress: number;
  rewardCoins: number;
  rewardPoints: number;
  isCompleted: boolean;
  icon: string;
}

export interface EcosystemReward {
  id: string;
  title: string;
  targetApp: string;
  appIcon: string;
  description: string;
  usdValue: number;
  coinCost: number;
  pointCost: number;
  discountCode: string;
  category: 'Academy Tuition' | 'Clinical AI Credit' | 'Caregiver Access' | 'Bio-Nutrient Plan' | 'Knowledge Vault';
}

export interface ClaimedVoucher {
  id: string;
  rewardTitle: string;
  targetApp: string;
  code: string;
  usdValue: number;
  claimedAt: string;
}

// Dr. T Galactic Sectors
const GALACTIC_SECTORS: GalacticSector[] = [
  {
    id: 'sol-orion',
    name: 'Orion Arm Bio-Domes',
    armName: 'Sol-3 & Earth Orbit',
    icon: '🪐',
    solarRadiation: 'Standard 1.0 AU Photon Beam',
    gravityType: '1.0g Earth Circadian Rhythm',
    yieldBonusPct: 15,
    description: 'Premier terra-formed bio-domes for classic longevity herbs and natural cellular repair.'
  },
  {
    id: 'perseus-nebula',
    name: 'Perseus Plasma Hydroponics',
    armName: 'Perseus Arm Outpost',
    icon: '🌌',
    solarRadiation: 'High-Ion Cosmic Radiation',
    gravityType: '0.35g Micro-Gravity Chambers',
    yieldBonusPct: 25,
    description: 'Enriched plasma spectrum boosting spirulina photosynthesis and cellular growth speed.'
  },
  {
    id: 'sagittarius-core',
    name: 'Sagittarius Quantum Ring',
    armName: 'Galactic Core Spore Ring',
    icon: '✨',
    solarRadiation: 'Core Galactic Starlight Pulse',
    gravityType: 'Zero-G Levitating Soil',
    yieldBonusPct: 30,
    description: 'Zero-gravity bio-chambers cultivating rare fungi that induce deep REM sleep and memory repair.'
  },
  {
    id: 'cygnus-sanctuary',
    name: 'Cygnus Senior Haven',
    armName: 'Cygnus Loop Sanctuary',
    icon: '🌿',
    solarRadiation: 'Gentle Amber Starlight Filter',
    gravityType: '0.85g Soothing Comfort Gravity',
    yieldBonusPct: 20,
    description: 'Designed specifically for senior elder wellness, tactile therapy gardens, and peaceful farming.'
  }
];

// Initial Intergalactic Crops Catalog
const INITIAL_CROPS: Crop[] = [
  {
    id: 'astragalus',
    name: 'Stellar Astragalus Radix',
    category: 'Galactic Botanical',
    icon: '🌱',
    growthTimeSec: 8,
    healthBenefit: 'Telomere lengthening & cellular longevity enhancement across star systems',
    basePrice: 140,
    currentPrice: 168,
    priceTrend: 'up',
    priceChangePct: +14.2,
    yieldPerPlot: 45,
    demandIndex: 94,
    seniorAccessibilityNote: 'Promotes deep cellular repair and immune stamina for vibrant aging.',
    milkyWaySectorOrigin: 'Orion Arm Bio-Domes'
  },
  {
    id: 'ginseng',
    name: 'Dr. T Galaxy Quantum Ginseng',
    category: 'Cosmic Bio-Herbal',
    icon: '🌿',
    growthTimeSec: 12,
    healthBenefit: 'Adaptogenic energy, mental clarity & galactic neural stamina',
    basePrice: 210,
    currentPrice: 235,
    priceTrend: 'up',
    priceChangePct: +9.8,
    yieldPerPlot: 30,
    demandIndex: 90,
    seniorAccessibilityNote: 'Gentle cognitive booster that restores natural daytime focus.',
    milkyWaySectorOrigin: 'Cygnus Senior Haven'
  },
  {
    id: 'reishi',
    name: 'Zero-G Cosmic Reishi Spores',
    category: 'Quantum Fungal',
    icon: '🍄',
    growthTimeSec: 10,
    healthBenefit: 'Immune modulation & restorative REM sleep induction in space',
    basePrice: 180,
    currentPrice: 175,
    priceTrend: 'down',
    priceChangePct: -2.8,
    yieldPerPlot: 38,
    demandIndex: 82,
    seniorAccessibilityNote: 'Nourishes nervous system and supports peaceful nighttime rest.',
    milkyWaySectorOrigin: 'Sagittarius Quantum Ring'
  },
  {
    id: 'spirulina',
    name: 'Perseus Solar Spirulina Algae',
    category: 'Ion Algae',
    icon: '🧪',
    growthTimeSec: 6,
    healthBenefit: 'Essential amino acids, phycocyanin & antioxidant starlight energy',
    basePrice: 95,
    currentPrice: 118,
    priceTrend: 'up',
    priceChangePct: +18.4,
    yieldPerPlot: 65,
    demandIndex: 96,
    seniorAccessibilityNote: 'Superfood micro-algae that strengthens muscle tissue and joints.',
    milkyWaySectorOrigin: 'Perseus Plasma Hydroponics'
  },
  {
    id: 'curcumin',
    name: 'Golden Curcumin Flora',
    category: 'Galactic Botanical',
    icon: '🌼',
    growthTimeSec: 7,
    healthBenefit: 'Joint comfort, anti-inflammatory & mobility renewal',
    basePrice: 120,
    currentPrice: 129,
    priceTrend: 'up',
    priceChangePct: +6.2,
    yieldPerPlot: 50,
    demandIndex: 86,
    seniorAccessibilityNote: 'Natural soothing remedy for flexible knees and comfortable movement.',
    milkyWaySectorOrigin: 'Orion Arm Bio-Domes'
  },
  {
    id: 'lavender',
    name: 'Andromeda Blue Starlight Lavender',
    category: 'Galactic Botanical',
    icon: '🪻',
    growthTimeSec: 5,
    healthBenefit: 'Aromatherapeutic stress reduction & calm blood pressure',
    basePrice: 85,
    currentPrice: 84,
    priceTrend: 'down',
    priceChangePct: -1.2,
    yieldPerPlot: 60,
    demandIndex: 75,
    seniorAccessibilityNote: 'Fragrant therapeutic flower that calms heart rate and relaxes mind.',
    milkyWaySectorOrigin: 'Cygnus Senior Haven'
  }
];

// Initial Galactic Animals
const INITIAL_ANIMALS: Animal[] = [
  {
    id: 'honeybees',
    name: 'Royal Pulsar Honeybees',
    species: 'Pulsar Bio-Apis',
    icon: '🐝',
    productName: 'Galactic Royal Jelly & Propolis',
    productPrice: 260,
    happiness: 96,
    healthBenefit: 'Antimicrobial throat protection & tissue rejuvenation in zero gravity',
    feedCostPerCycle: 15,
    seniorTherapyScore: 98,
    galacticHabitat: 'Orion & Cygnus Star Systems'
  },
  {
    id: 'alpacas',
    name: 'Orion Gentle Cloud Alpacas',
    species: 'Zero-G Sensory Therapy Herd',
    icon: '🦙',
    productName: 'Starlight Soft Thermal Wool',
    productPrice: 340,
    happiness: 93,
    healthBenefit: 'Therapeutic warmth & tactile anxiety relief for senior elders',
    feedCostPerCycle: 25,
    seniorTherapyScore: 99,
    galacticHabitat: 'Cygnus Senior Haven'
  },
  {
    id: 'silkworms',
    name: 'Nebula Bioluminescent Silkworms',
    species: 'Micro-Gravity Bio-Peptide Fauna',
    icon: '🐛',
    productName: 'Collagen Rejuvenation Silk Thread',
    productPrice: 295,
    happiness: 90,
    healthBenefit: 'Dermal elasticity repair & wound recovery support',
    feedCostPerCycle: 20,
    seniorTherapyScore: 93,
    galacticHabitat: 'Sagittarius Core Ring'
  }
];

// Intergalactic Leaderboard
const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, farmerName: 'Grandma Evelyn & Bio-Cosmos AI', starSystemOrigin: 'Sol-3 Earth Prime', isAI: false, avatarIcon: '👵🏼', badge: 'Dr. T Galaxy Grand Master', longevityPoints: 16420, bioRevenue: 108450, sustainabilityRating: 'A++', activeCropsCount: 6, seniorCareRating: 100 },
  { rank: 2, farmerName: 'Dr. T Autonomous Agent v5.2', starSystemOrigin: 'Orion Arm AI Hub', isAI: true, avatarIcon: '🤖', badge: 'Core AI Champion', longevityPoints: 15150, bioRevenue: 99200, sustainabilityRating: 'A+', activeCropsCount: 6, seniorCareRating: 98 },
  { rank: 3, farmerName: 'Master Chen (Age 84) Green Oasis', starSystemOrigin: 'Kepler-186f Colony', isAI: false, avatarIcon: '👨🏼‍🌾', badge: 'Quantum Ginseng Pioneer', longevityPoints: 14900, bioRevenue: 92600, sustainabilityRating: 'A+', activeCropsCount: 5, seniorCareRating: 99 },
  { rank: 4, farmerName: 'Aura-Swarm Autonomous Farm', starSystemOrigin: 'Perseus Outpost Alpha', isAI: true, avatarIcon: '⚡', badge: 'Reinforcement Learning', longevityPoints: 13400, bioRevenue: 85100, sustainabilityRating: 'A', activeCropsCount: 6, seniorCareRating: 95 },
  { rank: 5, farmerName: 'Serene Haven Elder Co-op', starSystemOrigin: 'Cygnus Sanctuary', isAI: false, avatarIcon: '👴🏼', badge: 'Interstellar Wellness Co-op', longevityPoints: 12850, bioRevenue: 79300, sustainabilityRating: 'A+', activeCropsCount: 4, seniorCareRating: 100 }
];

// Dr. T Platform Ecosystem Rewards
const ECOSYSTEM_REWARDS: EcosystemReward[] = [
  {
    id: 'drt-academy-50',
    title: 'Dr. T Longevity Institute $50 Tuition Voucher',
    targetApp: 'Dr. T Institute & Academy',
    appIcon: '🎓',
    description: 'Redeemable for 50% tuition reduction on Longevity & Cellular Repair courses.',
    usdValue: 50,
    coinCost: 1500,
    pointCost: 800,
    discountCode: 'DRT-ACADEMY-COSMOS50',
    category: 'Academy Tuition'
  },
  {
    id: 'drt-clinical-ai-check',
    title: 'Clinical AI Biomarker & Longevity Pass',
    targetApp: 'Clinical AI & Comfort Food',
    appIcon: '🏥',
    description: 'Grants 1 full AI clinical health scan and customized biomarker blueprint.',
    usdValue: 35,
    coinCost: 1200,
    pointCost: 600,
    discountCode: 'DRT-CLINICAL-VITAL100',
    category: 'Clinical AI Credit'
  },
  {
    id: 'drt-caregiver-vip',
    title: 'Caregiver Hub VIP Supporter Pass (1 Month)',
    targetApp: 'Caregiver Hub',
    appIcon: '🩺',
    description: 'Unlocks priority caregiver support networks, senior emergency logs & AI assistance.',
    usdValue: 25,
    coinCost: 900,
    pointCost: 450,
    discountCode: 'DRT-CARE-VIP-GALAXY',
    category: 'Caregiver Access'
  },
  {
    id: 'drt-comfort-food-plan',
    title: 'Comfort Food Cellular Longevity Recipe Kit',
    targetApp: 'Clinical AI & Comfort Food',
    appIcon: '🍲',
    description: 'Custom bio-nutrient culinary meal plan personalized for senior joint & brain longevity.',
    usdValue: 20,
    coinCost: 750,
    pointCost: 350,
    discountCode: 'DRT-FOOD-BIOKIT20',
    category: 'Bio-Nutrient Plan'
  },
  {
    id: 'drt-memory-graph-token',
    title: '3D Memory Graph Bio-Data Storage Voucher',
    targetApp: '3D Memory Knowledge Graph',
    appIcon: '🧠',
    description: 'Adds 2GB encrypted cloud memory vault space for family health history.',
    usdValue: 30,
    coinCost: 1000,
    pointCost: 500,
    discountCode: 'DRT-GRAPH-VAULT2G',
    category: 'Knowledge Vault'
  }
];

export const CosmosBioFarmAgent: React.FC = () => {
  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<'farm' | 'sectors' | 'market' | 'agent-brain' | 'animals' | 'leaderboard' | 'quests' | 'ecosystem-store'>('farm');
  
  // Selected Galactic Sector
  const [selectedSector, setSelectedSector] = useState<GalacticSector>(GALACTIC_SECTORS[0]);

  // Game & Economy State
  const [tCoins, setTCoins] = useState<number>(3800);
  const bioCoins = tCoins; // alias for backwards compatibility
  const setBioCoins = setTCoins;
  const [longevityPoints, setLongevityPoints] = useState<number>(2400);
  const [dailyStreak, setDailyStreak] = useState<number>(4);
  const [hasClaimedDailyStreak, setHasClaimedDailyStreak] = useState<boolean>(false);
  const [winNotification, setWinNotification] = useState<string | null>(null);

  // Crops & Animals state
  const [crops, setCrops] = useState<Crop[]>(INITIAL_CROPS);
  const [animals] = useState<Animal[]>(INITIAL_ANIMALS);
  const [inventory, setInventory] = useState<Record<string, number>>({
    astragalus: 28,
    ginseng: 12,
    spirulina: 45,
    reishi: 8,
    propolis: 6,
    wool: 4
  });
  
  // Farm Plots (6 Grid Slots across Dr. T Galaxy Sectors)
  const [plots, setPlots] = useState<FarmPlot[]>([
    { id: 1, crop: INITIAL_CROPS[0], stage: 'growing', growthProgress: 75, waterLevel: 85, nutrientLevel: 88, isAutoManagedByAI: true, yieldBoost: 1.25, sectorName: 'Orion Arm Bio-Domes' },
    { id: 2, crop: INITIAL_CROPS[3], stage: 'growing', growthProgress: 95, waterLevel: 80, nutrientLevel: 92, isAutoManagedByAI: true, yieldBoost: 1.30, sectorName: 'Perseus Plasma Hydroponics' },
    { id: 3, crop: INITIAL_CROPS[1], stage: 'mature', growthProgress: 100, waterLevel: 90, nutrientLevel: 95, isAutoManagedByAI: true, yieldBoost: 1.35, sectorName: 'Cygnus Senior Haven' },
    { id: 4, crop: INITIAL_CROPS[4], stage: 'planted', growthProgress: 40, waterLevel: 70, nutrientLevel: 75, isAutoManagedByAI: true, yieldBoost: 1.15, sectorName: 'Orion Arm Bio-Domes' },
    { id: 5, crop: null, stage: 'empty', growthProgress: 0, waterLevel: 60, nutrientLevel: 70, isAutoManagedByAI: true, yieldBoost: 1.0, sectorName: 'Sagittarius Quantum Ring' },
    { id: 6, crop: INITIAL_CROPS[2], stage: 'growing', growthProgress: 50, waterLevel: 85, nutrientLevel: 82, isAutoManagedByAI: true, yieldBoost: 1.28, sectorName: 'Sagittarius Quantum Ring' }
  ]);

  // Quests & Winning Logics
  const [quests, setQuests] = useState<Quest[]>([
    { id: 'q1', title: 'Harvest 3 Starlight Astragalus Plots', category: 'Daily', description: 'Reap cell-lengthening Astragalus across Orion Bio-Domes.', progress: 1, maxProgress: 3, rewardCoins: 300, rewardPoints: 150, isCompleted: false, icon: '🌱' },
    { id: 'q2', title: 'Trade 50kg Algae on Interstellar Market', category: 'Dr. T Galaxy Challenge', description: 'Supply micro-algae superfoods to elder colonies.', progress: 28, maxProgress: 50, rewardCoins: 450, rewardPoints: 200, isCompleted: false, icon: '🧪' },
    { id: 'q3', title: 'Achieve 90%+ Starlight Nutrients in 4 Plots', category: 'Ecosystem Goal', description: 'Maintain maximum soil fertility for galactic harvests.', progress: 3, maxProgress: 4, rewardCoins: 600, rewardPoints: 300, isCompleted: false, icon: '✨' }
  ]);

  // Ecosystem Vouchers Wallet
  const [claimedVouchers, setClaimedVouchers] = useState<ClaimedVoucher[]>([
    { id: 'v1', rewardTitle: 'Dr. T Longevity Institute $50 Tuition Voucher', targetApp: 'Dr. T Institute & Academy', code: 'DRT-ACADEMY-COSMOS50-X92', usdValue: 50, claimedAt: 'Earlier Today' }
  ]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Quantum Wheel Spin State
  const [isSpinningWheel, setIsSpinningWheel] = useState<boolean>(false);
  const [spinResult, setSpinResult] = useState<string | null>(null);

  // Autonomous AI Agent State
  const [isAIAgentActive, setIsAIAgentActive] = useState<boolean>(true);
  const [agentStrategy, setAgentStrategy] = useState<'longevity' | 'arbitrage' | 'sustainability' | 'aggressive'>('longevity');
  const [agentDecisionLogs, setAgentDecisionLogs] = useState<AgentDecisionLog[]>([
    { id: '1', time: '10:50:01', phase: 'Perception', message: 'Dr. T Galaxy Sensors detected Solar Astragalus telomere demand surging (+14.2%) in Sol-3 sector.', detail: 'Interstellar healthcare order volume increased across elder colonies.', impactScore: 88, galacticSector: 'Orion Arm Bio-Domes' },
    { id: '2', time: '10:50:05', phase: 'Planning', message: 'Re-routed Perseus Plasma light beams to boost Spirulina amino-acid yield per watt.', detail: 'Optimized micro-gravity photosynthesis cycle.', impactScore: 94, galacticSector: 'Perseus Plasma Hydroponics' },
    { id: '3', time: '10:50:10', phase: 'Action', message: 'Harvested Plot #3 (Dr. T Galaxy Quantum Ginseng) -> Traded 30 units at peak price $235/kg.', detail: 'Earned +7,050 T-Coins and +350 Interstellar Longevity Health Points.', impactScore: 99, galacticSector: 'Cygnus Senior Haven' },
    { id: '4', time: '10:50:15', phase: 'Learning', message: 'Updated soil starlight radiation schedule. Growth time reduced by 18%.', detail: 'Neural policy updated for Zero-G root extension.', impactScore: 91, galacticSector: 'Sagittarius Quantum Ring' }
  ]);

  // Market Events
  const [marketEvents] = useState<MarketEvent[]>([
    { id: 'e1', timestamp: '2 mins ago', title: 'Dr. T Galaxy Senior Longevity Summit Announced', description: 'Surge in demand for Astragalus & Ginseng bio-compounds across Kepler-186f & Sol-3 wellness sanctuaries.', impactedItem: 'Stellar Astragalus Radix', priceMultiplier: 1.30, type: 'health_surge', starSystem: 'Kepler-186f Colony' },
    { id: 'e2', timestamp: '6 mins ago', title: 'Solar Flare Enhances Perseus Algae Ponds', description: 'Cosmic radiation boost doubled photosynthesis efficiency for Spirulina bio-chambers.', impactedItem: 'Perseus Solar Spirulina Algae', priceMultiplier: 1.20, type: 'weather_boost', starSystem: 'Perseus Arm' }
  ]);

  // Accessibility & Senior Features
  const [voiceNarratorEnabled, setVoiceNarratorEnabled] = useState<boolean>(false);
  const [largeFontMode, setLargeFontMode] = useState<boolean>(false);
  const [speechMessage, setSpeechMessage] = useState<string>('Welcome to Cosmos Green Agent, the premier Dr. T Galaxy Intergalactic Play-to-Earn Platform for Dr. T Ecosystem.');

  // Leaderboard
  const [leaderboard] = useState<LeaderboardEntry[]>(INITIAL_LEADERBOARD);

  // Selected Crop for Manual Planting
  const [selectedCropToPlant, setSelectedCropToPlant] = useState<Crop>(INITIAL_CROPS[0]);

  // Trigger Win Toast Notification
  const triggerWinToast = (msg: string) => {
    setWinNotification(msg);
    setTimeout(() => {
      setWinNotification(null);
    }, 4000);
  };

  // Real-Time Simulation Interval
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Advance Plot Growth
      setPlots((prevPlots) =>
        prevPlots.map((plot) => {
          if (plot.stage === 'growing' || plot.stage === 'planted') {
            const nextProgress = Math.min(100, plot.growthProgress + 6);
            return {
              ...plot,
              growthProgress: nextProgress,
              stage: nextProgress >= 100 ? 'mature' : 'growing',
              waterLevel: Math.max(20, plot.waterLevel - 2),
              nutrientLevel: Math.max(30, plot.nutrientLevel - 1)
            };
          }
          return plot;
        })
      );

      // 2. Fluctuate Intergalactic Market Prices
      setCrops((prevCrops) =>
        prevCrops.map((crop) => {
          const delta = (Math.random() - 0.48) * 8;
          const newPrice = Math.max(20, Math.round((crop.currentPrice + delta) * 10) / 10);
          const pct = Math.round(((newPrice - crop.basePrice) / crop.basePrice) * 1000) / 10;
          return {
            ...crop,
            currentPrice: newPrice,
            priceTrend: delta >= 0 ? 'up' : 'down',
            priceChangePct: pct
          };
        })
      );

      // 3. Autonomous AI Agent Loop
      if (isAIAgentActive) {
        runAIAgentTick();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isAIAgentActive, agentStrategy, plots, crops, bioCoins]);

  // AI Agent Tactical Execution
  const runAIAgentTick = () => {
    setPlots((prevPlots) => {
      let harvestedSome = false;
      let totalEarned = 0;
      let pointsEarned = 0;

      const updatedPlots = prevPlots.map((plot) => {
        if (plot.stage === 'mature' && plot.crop && plot.isAutoManagedByAI) {
          harvestedSome = true;
          const yieldQty = Math.round(plot.crop.yieldPerPlot * plot.yieldBoost);
          const revenue = Math.round(yieldQty * (plot.crop.currentPrice * 0.85));
          totalEarned += revenue;
          pointsEarned += Math.round(yieldQty * 1.8);

          setInventory((prevInv) => ({
            ...prevInv,
            [plot.crop!.id]: (prevInv[plot.crop!.id] || 0) + yieldQty
          }));

          return {
            ...plot,
            stage: 'planted',
            growthProgress: 15,
            waterLevel: 95,
            nutrientLevel: 92
          };
        }
        return plot;
      });

      if (harvestedSome) {
        setBioCoins((prev) => prev + totalEarned);
        setLongevityPoints((prev) => prev + pointsEarned);

        const newLog: AgentDecisionLog = {
          id: Date.now().toString(),
          time: new Date().toLocaleTimeString(),
          phase: 'Action',
          message: `Autonomous Galactic Harvest: Claimed mature bio-crops & re-seeded sector plots.`,
          detail: `Earned +${totalEarned} T-Coins & +${pointsEarned} Interstellar Longevity Points.`,
          impactScore: 96,
          galacticSector: selectedSector.name
        };
        setAgentDecisionLogs((prevLogs) => [newLog, ...prevLogs.slice(0, 9)]);

        if (voiceNarratorEnabled) {
          speakMessage(`Autonomous agent harvested mature galactic bio-crops, generating ${totalEarned} T-Coins.`);
        }
      }

      return updatedPlots;
    });
  };

  // Winning Logic: Claim Daily Cosmic Streak
  const handleClaimDailyStreak = () => {
    if (hasClaimedDailyStreak) return;
    const bonusCoins = 500 * (dailyStreak + 1);
    const bonusPts = 250 * (dailyStreak + 1);
    setBioCoins((c) => c + bonusCoins);
    setLongevityPoints((pts) => pts + bonusPts);
    setDailyStreak((s) => s + 1);
    setHasClaimedDailyStreak(true);
    triggerWinToast(`🎉 DAILY WIN! Claimed Day #${dailyStreak + 1} Streak Bonus: +${bonusCoins} T-Coins & +${bonusPts} Points!`);
    
    if (voiceNarratorEnabled) {
      speakMessage(`Claimed daily streak bonus of ${bonusCoins} T-Coins.`);
    }
  };

  // Winning Logic: Quantum Wheel Spin
  const handleSpinQuantumWheel = () => {
    if (bioCoins < 100) {
      alert('Requires 100 T-Coins to power Quantum Wheel Spin!');
      return;
    }
    setBioCoins((c) => c - 100);
    setIsSpinningWheel(true);
    setSpinResult(null);

    setTimeout(() => {
      setIsSpinningWheel(false);
      const outcomes = [
        { title: '💎 MEGA WIN: +1,200 T-Coins!', coins: 1200, pts: 300 },
        { title: '🌟 STARLIGHT BOOST: All Plots Instant Harvest!', instantHarvest: true, coins: 400, pts: 200 },
        { title: '🌿 TELOMERE ELIXIR: +800 Longevity Points!', coins: 300, pts: 800 },
        { title: '🔥 DR. T VOUCHER CREDIT: +$15 Ecosystem Bonus!', coins: 600, pts: 400 }
      ];
      const win = outcomes[Math.floor(Math.random() * outcomes.length)];
      setBioCoins((c) => c + win.coins);
      setLongevityPoints((pts) => pts + win.pts);
      
      if (win.instantHarvest) {
        setPlots((prev) => prev.map((p) => p.crop ? { ...p, stage: 'mature', growthProgress: 100 } : p));
      }

      setSpinResult(win.title);
      triggerWinToast(`🎰 QUANTUM SPIN WIN: ${win.title}`);

      if (voiceNarratorEnabled) {
        speakMessage(`Quantum spin complete! Won ${win.title}`);
      }
    }, 2000);
  };

  // Winning Logic: Quick Seed All Plots
  const handleQuickSeedAll = () => {
    const costPerPlot = 50;
    const emptyPlots = plots.filter((p) => p.stage === 'empty');
    if (emptyPlots.length === 0) {
      triggerWinToast('ℹ️ All bio-plots are already planted!');
      return;
    }
    const totalCost = emptyPlots.length * costPerPlot;
    if (bioCoins < totalCost) {
      alert(`Need ${totalCost} T-Coins to seed all empty plots!`);
      return;
    }

    setBioCoins((c) => c - totalCost);
    setPlots((prev) =>
      prev.map((p) =>
        p.stage === 'empty'
          ? {
              ...p,
              crop: selectedCropToPlant,
              stage: 'planted',
              growthProgress: 15,
              waterLevel: 95,
              nutrientLevel: 92,
              sectorName: selectedSector.name
            }
          : p
      )
    );
    triggerWinToast(`🚀 SEEDED ALL! Planted ${emptyPlots.length} plots with ${selectedCropToPlant.name}!`);
  };

  // Manual Actions
  const handleWaterPlot = (plotId: number) => {
    setPlots((prev) =>
      prev.map((p) => (p.id === plotId ? { ...p, waterLevel: 100, nutrientLevel: Math.min(100, p.nutrientLevel + 12) } : p))
    );
    triggerWinToast(`💧 Plot #${plotId} irrigated & starlight nutrient level recharged!`);
  };

  const handleManualHarvest = (plotId: number) => {
    setPlots((prev) =>
      prev.map((p) => {
        if (p.id === plotId && p.stage === 'mature' && p.crop) {
          const qty = Math.round(p.crop.yieldPerPlot * p.yieldBoost);
          const revenue = Math.round(qty * p.crop.currentPrice);
          const pts = Math.round(qty * 2.5);
          setBioCoins((c) => c + revenue);
          setLongevityPoints((points) => points + pts);

          setInventory((inv) => ({
            ...inv,
            [p.crop!.id]: (inv[p.crop!.id] || 0) + qty
          }));

          triggerWinToast(`✨ HARVEST WIN! Claimed ${p.crop.name} -> +${revenue} T-Coins & +${pts} Longevity Pts!`);

          return { ...p, crop: null, stage: 'empty', growthProgress: 0 };
        }
        return p;
      })
    );
  };

  const handleManualPlant = (plotId: number) => {
    if (bioCoins < 50) {
      alert('Not enough T-Coins! Need 50 T-Coins to buy galactic seed stock.');
      return;
    }
    setBioCoins((c) => c - 50);
    setPlots((prev) =>
      prev.map((p) =>
        p.id === plotId
          ? {
              ...p,
              crop: selectedCropToPlant,
              stage: 'planted',
              growthProgress: 10,
              waterLevel: 90,
              nutrientLevel: 88,
              sectorName: selectedSector.name
            }
          : p
      )
    );
    triggerWinToast(`🌱 Planted ${selectedCropToPlant.name} in Plot #${plotId}!`);
  };

  const handleSellProduct = (cropId: string, price: number) => {
    const qty = inventory[cropId] || 0;
    if (qty <= 0) return;

    const totalVal = Math.round(qty * price);
    const pts = Math.round(qty * 3.5);
    setBioCoins((c) => c + totalVal);
    setLongevityPoints((points) => points + pts);
    setInventory((inv) => ({ ...inv, [cropId]: 0 }));

    triggerWinToast(`💰 TRADE WIN! Sold ${qty} kg across Dr. T Galaxy routes for +${totalVal} T-Coins!`);

    if (voiceNarratorEnabled) {
      speakMessage(`Traded ${qty} kg of intergalactic harvest for ${totalVal} T-Coins.`);
    }
  };

  // Redeem Dr. T Platform Ecosystem Voucher
  const handleRedeemReward = (reward: EcosystemReward) => {
    if (bioCoins < reward.coinCost || longevityPoints < reward.pointCost) {
      alert(`Insufficient funds! Requires ${reward.coinCost} T-Coins & ${reward.pointCost} Longevity Points.`);
      return;
    }

    setBioCoins((c) => c - reward.coinCost);
    setLongevityPoints((pts) => pts - reward.pointCost);

    const newVoucher: ClaimedVoucher = {
      id: Date.now().toString(),
      rewardTitle: reward.title,
      targetApp: reward.targetApp,
      code: `${reward.discountCode}-${Math.floor(1000 + Math.random() * 9000)}`,
      usdValue: reward.usdValue,
      claimedAt: new Date().toLocaleTimeString()
    };

    setClaimedVouchers((v) => [newVoucher, ...v]);
    triggerWinToast(`🎁 REDEEMED! Claimed ${reward.title} ($${reward.usdValue} USD value) for Dr. T Ecosystem!`);

    if (voiceNarratorEnabled) {
      speakMessage(`Successfully redeemed ${reward.title}. Use discount code ${newVoucher.code} in the Dr. T platform.`);
    }
  };

  // Copy Code to Clipboard
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const speakMessage = (text: string) => {
    setSpeechMessage(text);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Total Ecosystem USD Value of Earnings
  const totalEcosystemUsdValue = (bioCoins / 50 + longevityPoints / 40).toFixed(2);

  return (
    <div className={`w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6 font-sans text-stone-900 ${largeFontMode ? 'text-lg' : 'text-base'}`}>
      
      {/* WINNING TOAST NOTIFICATION POPUP */}
      {winNotification && (
        <div className="fixed top-5 right-5 z-50 bg-stone-900 text-amber-300 px-5 py-3 rounded-2xl border-2 border-amber-400 shadow-2xl font-mono text-sm font-bold flex items-center gap-3 animate-bounce">
          <Trophy className="w-5 h-5 text-amber-400 animate-pulse" />
          <span>{winNotification}</span>
        </div>
      )}

      {/* HEADER BANNER - COSMOS GREEN AGENT (DR. T GALAXY FARMS PLATFORM) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-teal-950 to-stone-900 p-6 md:p-8 text-white shadow-2xl border border-emerald-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

        <div className="relative z-10 space-y-5">
          {/* Top Bar Badges */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-900/90 rounded-full border border-emerald-700/80 text-xs font-mono text-emerald-200">
              <Orbit className="w-4 h-4 text-amber-400 animate-spin" />
              <span>Cosmos Green Agent • Play-to-Earn Bio-Market & Dr. T Ecosystem Rewards</span>
            </div>

            {/* Accessibility & Senior Comfort Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setVoiceNarratorEnabled(!voiceNarratorEnabled)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold font-mono flex items-center gap-1.5 transition-all border ${
                  voiceNarratorEnabled
                    ? 'bg-amber-500 text-stone-950 border-amber-300 shadow-md'
                    : 'bg-stone-800/80 text-stone-300 border-stone-700 hover:text-white'
                }`}
                title="Toggle Voice Assistance for Senior Accessibility"
              >
                {voiceNarratorEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>{voiceNarratorEnabled ? 'Voice Assist ON' : 'Voice Assist OFF'}</span>
              </button>

              <button
                onClick={() => setLargeFontMode(!largeFontMode)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold font-mono transition-all border ${
                  largeFontMode
                    ? 'bg-teal-500 text-stone-950 border-teal-300'
                    : 'bg-stone-800/80 text-stone-300 border-stone-700 hover:text-white'
                }`}
                title="Toggle Large Clear Text Mode"
              >
                <span>{largeFontMode ? 'Font: Large 🔍' : 'Font: Standard'}</span>
              </button>
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-2">
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span>Cosmos Green Agent</span>
              <span className="text-xs px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/40 rounded-full font-mono font-bold uppercase tracking-wider">
                Dr. T Galaxy • Play-to-Earn Ecosystem
              </span>
            </h1>
            <p className="text-emerald-100/90 text-sm md:text-base max-w-4xl leading-relaxed">
              Play & cultivate longevity bio-crops across Dr. T Galaxy sectors. Convert your harvest wins & T-Coins directly into real payment vouchers for Dr. T Institute Courses, Clinical AI consultations, Caregiver Hub passes, and Comfort Food nutrient plans!
            </p>
          </div>

          {/* PLAY NOW WINNING CONTROLS & ECOSYSTEM VALUE */}
          <div className="p-4 bg-stone-950/80 rounded-2xl border border-emerald-700/60 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleClaimDailyStreak}
                disabled={hasClaimedDailyStreak}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 cursor-pointer shadow-md ${
                  hasClaimedDailyStreak
                    ? 'bg-stone-800 text-stone-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 hover:brightness-110 animate-pulse'
                }`}
              >
                <Flame className="w-4 h-4 text-amber-900" />
                <span>{hasClaimedDailyStreak ? `Streak Claimed (${dailyStreak} Days)` : `Claim Daily Streak Bonus (+${500 * (dailyStreak + 1)} Coins)`}</span>
              </button>

              <button
                onClick={() => setActiveTab('quests')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 cursor-pointer"
              >
                <Dices className="w-4 h-4 text-amber-300" />
                <span>Quantum Spin & Quests</span>
              </button>

              <button
                onClick={() => setActiveTab('ecosystem-store')}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Gift className="w-4 h-4 text-amber-300" />
                <span>Redeem Dr. T Ecosystem Vouchers</span>
              </button>
            </div>

            <div className="text-right font-mono text-xs">
              <span className="text-stone-400 block text-[10px]">Ecosystem Payment Value</span>
              <span className="text-amber-300 font-extrabold text-base flex items-center gap-1 justify-end">
                <Ticket className="w-4 h-4 text-amber-400" />
                <span>${totalEcosystemUsdValue} USD Credit</span>
              </span>
            </div>
          </div>

          {/* Live Metrics Dashboard Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-emerald-800/80 text-xs font-mono">
            <div className="p-3 bg-stone-950/70 rounded-2xl border border-emerald-800/60">
              <div className="text-emerald-300/80 text-[10px] uppercase font-bold">Interstellar T-Coins</div>
              <div className="text-xl font-black text-amber-300 mt-0.5 flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-amber-400" />
                <span>{bioCoins.toLocaleString()}</span>
              </div>
              <div className="text-[10px] text-emerald-400">Dr. T Ecosystem Spendable</div>
            </div>

            <div className="p-3 bg-stone-950/70 rounded-2xl border border-emerald-800/60">
              <div className="text-emerald-300/80 text-[10px] uppercase font-bold">Galactic Longevity Score</div>
              <div className="text-xl font-black text-emerald-400 mt-0.5 flex items-center gap-1">
                <Heart className="w-4 h-4 text-rose-400 fill-current" />
                <span>{longevityPoints.toLocaleString()} pts</span>
              </div>
              <div className="text-[10px] text-emerald-300">Dr. T Galaxy Vitality Index</div>
            </div>

            <div className="p-3 bg-stone-950/70 rounded-2xl border border-emerald-800/60">
              <div className="text-emerald-300/80 text-[10px] uppercase font-bold">Autonomous AI Status</div>
              <div className="text-sm font-black text-teal-300 mt-1 flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${isAIAgentActive ? 'bg-emerald-400 animate-pulse' : 'bg-stone-500'}`}></span>
                <span>{isAIAgentActive ? 'AUTONOMOUS ACTIVE' : 'PAUSED (MANUAL)'}</span>
              </div>
              <div className="text-[10px] text-emerald-400/80 mt-0.5 capitalize">Strategy: {agentStrategy}</div>
            </div>

            <div className="p-3 bg-stone-950/70 rounded-2xl border border-emerald-800/60">
              <div className="text-emerald-300/80 text-[10px] uppercase font-bold">Claimed Vouchers</div>
              <div className="text-sm font-black text-purple-300 mt-1 flex items-center gap-1">
                <Ticket className="w-4 h-4 text-purple-400" />
                <span>{claimedVouchers.length} Ecosystem Passes</span>
              </div>
              <div className="text-[10px] text-emerald-300">Ready for Use</div>
            </div>
          </div>
        </div>
      </div>

      {/* VOICE ASSIST BANNER */}
      {voiceNarratorEnabled && (
        <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-center gap-3 animate-fadeIn">
          <Radio className="w-4 h-4 text-amber-600 animate-pulse shrink-0" />
          <div className="font-medium">
            <span className="font-bold">Voice Assist Active: </span>
            <span>"{speechMessage}"</span>
          </div>
        </div>
      )}

      {/* NAVIGATION TABS */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-3">
        <div className="flex flex-wrap items-center gap-1 bg-stone-100 p-1 rounded-2xl border border-stone-200">
          <button
            onClick={() => setActiveTab('farm')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'farm'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sprout className="w-4 h-4" />
            <span>Sector Bio-Plots</span>
          </button>

          <button
            onClick={() => setActiveTab('ecosystem-store')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'ecosystem-store'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Gift className="w-4 h-4 text-amber-300" />
            <span>Dr. T Platform Store 🎁</span>
          </button>

          <button
            onClick={() => setActiveTab('quests')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'quests'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Trophy className="w-4 h-4 text-yellow-300" />
            <span>Winning Quests & Spin 🎰</span>
          </button>

          <button
            onClick={() => setActiveTab('sectors')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'sectors'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Dr. T Galaxy Sectors</span>
          </button>

          <button
            onClick={() => setActiveTab('market')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'market'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Interstellar Market</span>
          </button>

          <button
            onClick={() => setActiveTab('agent-brain')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'agent-brain'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>AI Agent Telemetry</span>
          </button>

          <button
            onClick={() => setActiveTab('animals')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'animals'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-300" />
            <span>Zero-G Creatures</span>
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'leaderboard'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Award className="w-4 h-4 text-amber-300" />
            <span>Intergalactic Board</span>
          </button>
        </div>

        {/* AI Agent Control Toggle */}
        <div className="flex items-center gap-2 bg-stone-50 p-1.5 rounded-xl border border-stone-200">
          <span className="text-xs font-bold text-stone-700 pl-2">AI Auto-Pilot:</span>
          <button
            onClick={() => {
              setIsAIAgentActive(!isAIAgentActive);
              if (voiceNarratorEnabled) {
                speakMessage(!isAIAgentActive ? 'AI Auto-Pilot activated' : 'AI Auto-Pilot paused');
              }
            }}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              isAIAgentActive
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-stone-300 text-stone-700'
            }`}
          >
            {isAIAgentActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isAIAgentActive ? 'Running' : 'Paused'}</span>
          </button>
        </div>
      </div>

      {/* TAB 1: SECTOR BIO-PLOTS */}
      {activeTab === 'farm' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Seed Selector & Quick Seed All Bar */}
          <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <Sprout className="w-4 h-4 text-emerald-600" />
                <span>Select Galactic Seed Stock for [{selectedSector.name}]</span>
              </h3>
              
              <button
                onClick={handleQuickSeedAll}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold font-mono text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Quick Seed All Empty Plots (50 Coins/Plot)</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {crops.map((crop) => (
                <button
                  key={crop.id}
                  onClick={() => setSelectedCropToPlant(crop)}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                    selectedCropToPlant.id === crop.id
                      ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400/30'
                      : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="text-xl mb-1">{crop.icon}</div>
                  <div className="text-xs font-bold text-stone-800 truncate">{crop.name}</div>
                  <div className="text-[10px] text-stone-500 font-mono">${crop.currentPrice}/kg</div>
                </button>
              ))}
            </div>
          </div>

          {/* Farm Grid Plots */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plots.map((plot) => (
              <div key={plot.id} className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-4 hover:shadow-md transition-all">
                {/* Plot Header */}
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <div>
                    <span className="text-xs font-mono font-bold text-stone-500 uppercase">
                      Galactic Plot #{plot.id}
                    </span>
                    <div className="text-[10px] text-emerald-700 font-mono">{plot.sectorName}</div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    plot.stage === 'mature'
                      ? 'bg-amber-100 text-amber-800 animate-bounce'
                      : plot.stage === 'growing'
                      ? 'bg-emerald-100 text-emerald-800'
                      : plot.stage === 'planted'
                      ? 'bg-teal-100 text-teal-800'
                      : 'bg-stone-100 text-stone-500'
                  }`}>
                    {plot.stage}
                  </span>
                </div>

                {/* Plot Content */}
                {plot.crop ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl border border-emerald-200">
                        {plot.crop.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-900 text-sm">{plot.crop.name}</h4>
                        <p className="text-xs text-stone-500">{plot.crop.healthBenefit}</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-stone-500">
                        <span>Zero-G Growth Progress</span>
                        <span>{plot.growthProgress}%</span>
                      </div>
                      <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 transition-all duration-500"
                          style={{ width: `${plot.growthProgress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Soil & Water Vitals */}
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-stone-50 p-2 rounded-xl">
                      <div className="flex items-center gap-1.5 text-blue-700">
                        <Droplets className="w-3.5 h-3.5" />
                        <span>Moisture: {plot.waterLevel}%</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-700">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Starlight Nutrients: {plot.nutrientLevel}%</span>
                      </div>
                    </div>

                    {/* Plot Senior Accessibility Note */}
                    <p className="text-[11px] text-stone-600 bg-emerald-50/60 p-2 rounded-lg italic">
                      💡 {plot.crop.seniorAccessibilityNote}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleWaterPlot(plot.id)}
                        className="flex-1 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all border border-blue-200 cursor-pointer"
                      >
                        <Droplets className="w-3.5 h-3.5" />
                        <span>Irrigate</span>
                      </button>

                      {plot.stage === 'mature' && (
                        <button
                          onClick={() => handleManualHarvest(plot.id)}
                          className="flex-1 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all shadow-xs cursor-pointer animate-pulse"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Harvest & Earn</span>
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 space-y-3">
                    <div className="w-12 h-12 bg-stone-100 rounded-2xl mx-auto flex items-center justify-center text-stone-400">
                      <Sprout className="w-6 h-6" />
                    </div>
                    <div className="text-xs text-stone-500 font-medium">Bio-Plot Empty & Soil Nourished</div>
                    <button
                      onClick={() => handleManualPlant(plot.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                    >
                      Plant {selectedCropToPlant.name}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NEW TAB: DR. T PLATFORM ECOSYSTEM REWARDS STORE */}
      {activeTab === 'ecosystem-store' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Store Overview Header */}
          <div className="p-6 bg-gradient-to-br from-purple-950 via-indigo-950 to-stone-900 rounded-3xl text-white border border-purple-800 space-y-4 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-800/80 pb-4">
              <div>
                <h3 className="text-xl font-extrabold flex items-center gap-2">
                  <Gift className="w-6 h-6 text-amber-400" />
                  <span>Dr. T Platform Ecosystem Rewards & Payment Redemption Store</span>
                </h3>
                <p className="text-xs text-purple-200/90 mt-1">
                  Use T-Coins & Longevity Points earned from your galactic bio-harvests to pay for services across the entire Dr. T platform!
                </p>
              </div>

              <div className="p-3 bg-purple-900/80 rounded-2xl border border-purple-700 font-mono text-xs">
                <div className="text-stone-300 text-[10px]">Your Redeemable Capital</div>
                <div className="text-amber-300 font-black text-lg">${totalEcosystemUsdValue} USD Value</div>
              </div>
            </div>

            {/* Claimed Vouchers Wallet Drawer */}
            {claimedVouchers.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="font-mono text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Your Claimed Ecosystem Vouchers ({claimedVouchers.length})</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {claimedVouchers.map((v) => (
                    <div key={v.id} className="p-3.5 bg-stone-900/90 rounded-2xl border border-purple-700/80 text-xs font-mono space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{v.rewardTitle}</span>
                        <span className="px-2 py-0.5 bg-amber-400/20 text-amber-300 rounded font-extrabold text-[10px]">
                          ${v.usdValue} USD Value
                        </span>
                      </div>
                      <div className="text-stone-400 text-[11px]">App: {v.targetApp} • Claimed {v.claimedAt}</div>

                      <div className="flex items-center justify-between bg-stone-950 p-2 rounded-xl border border-stone-800">
                        <span className="text-amber-300 font-bold text-xs tracking-wider">{v.code}</span>
                        <button
                          onClick={() => handleCopyCode(v.code)}
                          className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedCode === v.code ? 'Copied!' : 'Copy Voucher'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Reward Items Catalog */}
          <div className="space-y-4">
            <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-purple-600" />
              <span>Available Ecosystem Payment Discounts & Access Passes</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ECOSYSTEM_REWARDS.map((item) => {
                const canAfford = bioCoins >= item.coinCost && longevityPoints >= item.pointCost;
                return (
                  <div key={item.id} className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-4 hover:shadow-md transition-all flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-3xl">{item.appIcon}</span>
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-full font-mono text-xs font-extrabold">
                          ${item.usdValue} USD Discount
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-stone-900 text-sm">{item.title}</h4>
                        <div className="text-xs font-mono text-purple-700 font-bold">{item.targetApp}</div>
                        <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">{item.description}</p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-stone-100 font-mono text-xs">
                      <div className="flex items-center justify-between text-stone-500">
                        <span>Cost in T-Coins:</span>
                        <span className="font-bold text-amber-600">{item.coinCost} T-Coins</span>
                      </div>
                      <div className="flex items-center justify-between text-stone-500">
                        <span>Cost in Longevity Pts:</span>
                        <span className="font-bold text-emerald-600">{item.pointCost} Pts</span>
                      </div>

                      <button
                        onClick={() => handleRedeemReward(item)}
                        disabled={!canAfford}
                        className={`w-full py-2.5 rounded-xl font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer ${
                          canAfford
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white'
                            : 'bg-stone-200 text-stone-500 cursor-not-allowed'
                        }`}
                      >
                        <Ticket className="w-4 h-4" />
                        <span>{canAfford ? 'Redeem Voucher' : 'Need More T-Coins'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* NEW TAB: WINNING QUESTS & QUANTUM SPIN */}
      {activeTab === 'quests' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Quantum Spin Wheel Deck */}
          <div className="p-6 bg-gradient-to-br from-amber-950 via-stone-900 to-emerald-950 rounded-3xl text-white border border-amber-800 shadow-xl space-y-4 text-center">
            <div className="max-w-xl mx-auto space-y-2">
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/40 rounded-full font-mono text-xs font-bold">
                Daily Quantum Starlight Spin
              </span>
              <h3 className="text-2xl font-black text-amber-300 flex items-center justify-center gap-2">
                <Dices className="w-6 h-6 text-amber-400" />
                <span>Spin to Win T-Coins & Ecosystem Vouchers</span>
              </h3>
              <p className="text-xs text-amber-100/80">
                Cost: 100 T-Coins per spin. Instant chance to win mega T-Coins, telomere boosts, or ecosystem voucher multipliers!
              </p>
            </div>

            {spinResult && (
              <div className="p-4 bg-amber-500/20 border border-amber-400 rounded-2xl text-amber-300 font-mono text-sm font-bold animate-bounce max-w-md mx-auto">
                {spinResult}
              </div>
            )}

            <div>
              <button
                onClick={handleSpinQuantumWheel}
                disabled={isSpinningWheel}
                className={`px-8 py-4 rounded-2xl font-mono text-sm font-black transition-all shadow-xl cursor-pointer ${
                  isSpinningWheel
                    ? 'bg-stone-700 text-stone-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-stone-950 hover:scale-105 animate-pulse'
                }`}
              >
                {isSpinningWheel ? '🌀 SPINNING QUANTUM WHEEL...' : '🎰 SPIN QUANTUM WHEEL (100 T-Coins)'}
              </button>
            </div>
          </div>

          {/* Daily & Galactic Quests */}
          <div className="space-y-4">
            <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>Active Galactic Quests & Play Challenges</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quests.map((quest) => (
                <div key={quest.id} className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{quest.icon}</div>
                    <div>
                      <span className="text-[10px] font-mono uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {quest.category}
                      </span>
                      <h4 className="font-bold text-stone-900 text-sm mt-1">{quest.title}</h4>
                      <p className="text-xs text-stone-500">{quest.description}</p>
                    </div>
                  </div>

                  <div className="space-y-1 font-mono text-xs">
                    <div className="flex justify-between text-stone-500">
                      <span>Progress</span>
                      <span className="font-bold">{quest.progress} / {quest.maxProgress}</span>
                    </div>
                    <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500"
                        style={{ width: `${(quest.progress / quest.maxProgress) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between font-mono text-xs">
                    <div className="text-amber-600 font-bold">+{quest.rewardCoins} T-Coins</div>
                    <div className="text-emerald-600 font-bold">+{quest.rewardPoints} Pts</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DR. T GALAXY SECTORS */}
      {activeTab === 'sectors' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-600" />
              <span>Dr. T Galaxy Sectors & Bio-Dome Enclaves</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {GALACTIC_SECTORS.map((sec) => (
                <div
                  key={sec.id}
                  onClick={() => {
                    setSelectedSector(sec);
                    if (voiceNarratorEnabled) {
                      speakMessage(`Selected ${sec.name} in the ${sec.armName}.`);
                    }
                  }}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    selectedSector.id === sec.id
                      ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-400/30'
                      : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">{sec.icon}</span>
                    <span className="px-2.5 py-1 bg-emerald-200 text-emerald-900 rounded-full font-mono text-[10px] font-bold">
                      +{sec.yieldBonusPct}% Yield Boost
                    </span>
                  </div>

                  <h4 className="font-bold text-stone-900 text-sm">{sec.name}</h4>
                  <div className="text-xs text-emerald-700 font-mono mb-2">{sec.armName}</div>
                  <p className="text-xs text-stone-600 leading-relaxed mb-3">{sec.description}</p>

                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-white p-2.5 rounded-xl border border-stone-200/80">
                    <div>
                      <span className="text-stone-400 block">Radiation</span>
                      <span className="font-bold text-stone-800">{sec.solarRadiation}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block">Gravity Type</span>
                      <span className="font-bold text-stone-800">{sec.gravityType}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: INTERSTELLAR MARKET */}
      {activeTab === 'market' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Live Ticker Banner */}
          <div className="p-4 bg-stone-950 text-white rounded-2xl border border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-2">
                <Activity className="w-4 h-4 animate-pulse text-emerald-400" />
                <span>Interstellar Reactive Bio-Market Ticker</span>
              </span>
              <span className="text-[10px] text-stone-400 font-mono">Updates Every 3 Seconds</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {crops.map((c) => (
                <div key={c.id} className="p-2.5 bg-stone-900 rounded-xl border border-stone-800 text-xs font-mono space-y-1">
                  <div className="text-stone-400 truncate">{c.icon} {c.name}</div>
                  <div className="text-sm font-bold text-white">${c.currentPrice}/kg</div>
                  <div className={`text-[10px] font-bold flex items-center gap-0.5 ${c.priceTrend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {c.priceTrend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    <span>{c.priceChangePct > 0 ? `+${c.priceChangePct}%` : `${c.priceChangePct}%`}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trade Inventory & Market Execution Deck */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              <h3 className="font-bold text-stone-900 text-sm">Interstellar Trade Deck</h3>

              <div className="space-y-3">
                {crops.map((crop) => {
                  const qtyOnHand = inventory[crop.id] || 0;
                  return (
                    <div key={crop.id} className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-[200px]">
                        <div className="text-3xl">{crop.icon}</div>
                        <div>
                          <h4 className="font-bold text-stone-900 text-sm">{crop.name}</h4>
                          <p className="text-xs text-stone-500">{crop.healthBenefit}</p>
                          <div className="text-[10px] text-emerald-700 font-mono mt-0.5">
                            Inventory On Hand: <span className="font-bold">{qtyOnHand} kg</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 font-mono text-xs">
                        <div className="text-right">
                          <div className="text-stone-400 text-[10px]">Market Price</div>
                          <div className="text-base font-bold text-stone-900">${crop.currentPrice} / kg</div>
                        </div>

                        <button
                          onClick={() => handleSellProduct(crop.id, crop.currentPrice)}
                          disabled={qtyOnHand <= 0}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
                        >
                          Sell All ({qtyOnHand} kg)
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Market Events */}
            <div className="space-y-3">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <Radio className="w-4 h-4 text-amber-600" />
                <span>Interstellar News & Catalysts</span>
              </h3>

              <div className="space-y-2">
                {marketEvents.map((evt) => (
                  <div key={evt.id} className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-1 text-xs">
                    <div className="flex items-center justify-between text-amber-900 font-bold font-mono text-[11px]">
                      <span>{evt.title}</span>
                      <span className="text-stone-400">{evt.timestamp}</span>
                    </div>
                    <p className="text-stone-700 leading-relaxed">{evt.description}</p>
                    <div className="text-[10px] font-mono text-amber-800 font-bold pt-1">
                      Target: {evt.starSystem} • Multiplier x{evt.priceMultiplier}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AGENTIC AI TELEMETRY */}
      {activeTab === 'agent-brain' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <Brain className="w-5 h-5 text-emerald-600" />
              <span>Select Autonomous AI Strategy Mode</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                onClick={() => setAgentStrategy('longevity')}
                className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                  agentStrategy === 'longevity'
                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400/30'
                    : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="font-bold text-stone-900 text-xs flex items-center gap-1.5 mb-1">
                  <Heart className="w-4 h-4 text-rose-500 fill-current" />
                  <span>Max Longevity & Health</span>
                </div>
                <p className="text-[11px] text-stone-600">Prioritizes high telomere-repair herbs and therapeutic propolis for community wellness.</p>
              </button>

              <button
                onClick={() => setAgentStrategy('arbitrage')}
                className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                  agentStrategy === 'arbitrage'
                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400/30'
                    : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="font-bold text-stone-900 text-xs flex items-center gap-1.5 mb-1">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>Market Arbitrage Sprint</span>
                </div>
                <p className="text-[11px] text-stone-600">Predicts price spikes & trades instantly when market demand surges.</p>
              </button>

              <button
                onClick={() => setAgentStrategy('sustainability')}
                className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                  agentStrategy === 'sustainability'
                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400/30'
                    : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="font-bold text-stone-900 text-xs flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Balanced Eco-Harmony</span>
                </div>
                <p className="text-[11px] text-stone-600">Zero-carbon regenerative bio-farming with gentle animal therapy integration.</p>
              </button>

              <button
                onClick={() => setAgentStrategy('aggressive')}
                className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                  agentStrategy === 'aggressive'
                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400/30'
                    : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="font-bold text-stone-900 text-xs flex items-center gap-1.5 mb-1">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span>Hyper Yield Throughput</span>
                </div>
                <p className="text-[11px] text-stone-600">Maximizes harvest cycle frequency using AI spectrum illumination.</p>
              </button>
            </div>
          </div>

          <div className="bg-stone-950 rounded-2xl p-5 border border-stone-800 text-white space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <span className="font-mono text-xs font-bold text-emerald-400 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>Autonomous Agent Perception-Planning-Action Loop</span>
              </span>
              <span className="text-[10px] text-stone-500 font-mono">Real-Time Interstellar Telemetry</span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {agentDecisionLogs.map((log) => (
                <div key={log.id} className="p-3 bg-stone-900 rounded-xl border border-stone-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-amber-300 font-bold">[{log.time}] {log.phase.toUpperCase()}</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                      Impact +{log.impactScore}
                    </span>
                  </div>
                  <div className="text-stone-200 font-semibold">{log.message}</div>
                  <div className="text-[11px] text-stone-400">{log.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ZERO-G CREATURES */}
      {activeTab === 'animals' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {animals.map((animal) => (
              <div key={animal.id} className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-4 hover:shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{animal.icon}</div>
                  <div>
                    <h3 className="font-bold text-stone-900 text-base">{animal.name}</h3>
                    <p className="text-xs text-stone-500 font-mono">{animal.species}</p>
                    <p className="text-[10px] text-emerald-700 font-mono">{animal.galacticHabitat}</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-stone-600 font-mono">
                    <span>Happiness Level</span>
                    <span className="font-bold text-emerald-600">{animal.happiness}%</span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${animal.happiness}%` }}></div>
                  </div>

                  <p className="text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-100 leading-relaxed">
                    💚 <span className="font-bold text-stone-800">Health Benefit: </span>
                    {animal.healthBenefit}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between font-mono text-xs">
                  <div>
                    <div className="text-stone-400 text-[10px]">Product Yield</div>
                    <div className="font-bold text-stone-800">{animal.productName}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-stone-400 text-[10px]">Market Value</div>
                    <div className="font-bold text-amber-600">${animal.productPrice}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: INTERGALACTIC LEADERBOARD */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span>Dr. T Galaxy Head-to-Head Master Farmer Leaderboard</span>
                </h3>
                <p className="text-xs text-stone-500">Human Elders & Autonomous AI Agents competing on Longevity Impact & Interstellar Revenue</p>
              </div>

              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-mono font-bold">
                Galactic Season #12 Active
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-500 uppercase text-[10px]">
                    <th className="py-2.5 px-3">Rank</th>
                    <th className="py-2.5 px-3">Farmer / AI Agent</th>
                    <th className="py-2.5 px-3">Star System Origin</th>
                    <th className="py-2.5 px-3">Mastery Badge</th>
                    <th className="py-2.5 px-3">Longevity Points</th>
                    <th className="py-2.5 px-3">Bio-Revenue</th>
                    <th className="py-2.5 px-3">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {leaderboard.map((entry) => (
                    <tr key={entry.rank} className={entry.isAI ? 'bg-stone-50/70' : 'bg-white'}>
                      <td className="py-3 px-3 font-bold text-stone-900">
                        {entry.rank === 1 ? '🥇 #1' : entry.rank === 2 ? '🥈 #2' : entry.rank === 3 ? '🥉 #3' : `#${entry.rank}`}
                      </td>
                      <td className="py-3 px-3 font-bold text-stone-800 flex items-center gap-2">
                        <span className="text-lg">{entry.avatarIcon}</span>
                        <span>{entry.farmerName}</span>
                      </td>
                      <td className="py-3 px-3 text-stone-600">{entry.starSystemOrigin}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-[10px] font-bold">
                          {entry.badge}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-emerald-700">{entry.longevityPoints.toLocaleString()} pts</td>
                      <td className="py-3 px-3 font-bold text-stone-900">${entry.bioRevenue.toLocaleString()}</td>
                      <td className="py-3 px-3 font-bold text-amber-600">{entry.sustainabilityRating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
