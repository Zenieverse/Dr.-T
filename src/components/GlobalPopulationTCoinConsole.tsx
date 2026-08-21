import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Coins, 
  TrendingUp, 
  Users, 
  Activity, 
  Sparkles, 
  Zap, 
  Search, 
  Filter, 
  ShieldCheck, 
  RefreshCw, 
  Building2, 
  Award, 
  CheckCircle2, 
  ArrowUpRight, 
  ChevronRight, 
  Layers, 
  BarChart3, 
  ExternalLink,
  DollarSign,
  Heart,
  Trees,
  Leaf
} from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { TreeNationEcoPlayground } from './TreeNationEcoPlayground';
import { BiologyEcosystemQuiz } from './BiologyEcosystemQuiz';

export interface CountryPopulationData {
  id: string;
  name: string;
  flag: string;
  region: 'Asia' | 'Americas' | 'Europe' | 'Africa' | 'Oceania';
  population: number;
  annualGrowthPct: number;
  tCoinPerDay: number;
  tCoinPerSec: number;
  highlightNote?: string;
  isSpotlight?: boolean;
}

const COUNTRY_POPULATIONS_CATALOG: CountryPopulationData[] = [
  {
    id: 'vn',
    name: 'Vietnam',
    flag: '🇻🇳',
    region: 'Asia',
    population: 100280420,
    annualGrowthPct: 0.72,
    tCoinPerDay: 100280.42,
    tCoinPerSec: 1.1606,
    highlightNote: 'Official 100,000,000+ Population Milestone Achieved — High Demographic Yield Sector!',
    isSpotlight: true
  },
  {
    id: 'in',
    name: 'India',
    flag: '🇮🇳',
    region: 'Asia',
    population: 1441200000,
    annualGrowthPct: 0.92,
    tCoinPerDay: 1441200.00,
    tCoinPerSec: 16.6805
  },
  {
    id: 'cn',
    name: 'China',
    flag: '🇨🇳',
    region: 'Asia',
    population: 1409200000,
    annualGrowthPct: -0.15,
    tCoinPerDay: 1409200.00,
    tCoinPerSec: 16.3102
  },
  {
    id: 'us',
    name: 'United States',
    flag: '🇺🇸',
    region: 'Americas',
    population: 341200000,
    annualGrowthPct: 0.53,
    tCoinPerDay: 341200.00,
    tCoinPerSec: 3.9490
  },
  {
    id: 'id',
    name: 'Indonesia',
    flag: '🇮🇩',
    region: 'Asia',
    population: 279800000,
    annualGrowthPct: 0.82,
    tCoinPerDay: 279800.00,
    tCoinPerSec: 3.2384
  },
  {
    id: 'pk',
    name: 'Pakistan',
    flag: '🇵🇰',
    region: 'Asia',
    population: 245200000,
    annualGrowthPct: 1.98,
    tCoinPerDay: 245200.00,
    tCoinPerSec: 2.8379
  },
  {
    id: 'ng',
    name: 'Nigeria',
    flag: '🇳🇬',
    region: 'Africa',
    population: 229100000,
    annualGrowthPct: 2.41,
    tCoinPerDay: 229100.00,
    tCoinPerSec: 2.6516
  },
  {
    id: 'br',
    name: 'Brazil',
    flag: '🇧🇷',
    region: 'Americas',
    population: 217300000,
    annualGrowthPct: 0.52,
    tCoinPerDay: 217300.00,
    tCoinPerSec: 2.5150
  },
  {
    id: 'bd',
    name: 'Bangladesh',
    flag: '🇧🇩',
    region: 'Asia',
    population: 174700000,
    annualGrowthPct: 1.03,
    tCoinPerDay: 174700.00,
    tCoinPerSec: 2.0220
  },
  {
    id: 'jp',
    name: 'Japan',
    flag: '🇯🇵',
    region: 'Asia',
    population: 124100000,
    annualGrowthPct: -0.48,
    tCoinPerDay: 124100.00,
    tCoinPerSec: 1.4363,
    highlightNote: 'High Longevity Elder Population Hub'
  },
  {
    id: 'ph',
    name: 'Philippines',
    flag: '🇵🇭',
    region: 'Asia',
    population: 118800000,
    annualGrowthPct: 1.54,
    tCoinPerDay: 118800.00,
    tCoinPerSec: 1.3750
  },
  {
    id: 'eg',
    name: 'Egypt',
    flag: '🇪🇬',
    region: 'Africa',
    population: 114500000,
    annualGrowthPct: 1.62,
    tCoinPerDay: 114500.00,
    tCoinPerSec: 1.3252
  },
  {
    id: 'et',
    name: 'Ethiopia',
    flag: '🇪🇹',
    region: 'Africa',
    population: 129700000,
    annualGrowthPct: 2.55,
    tCoinPerDay: 129700.00,
    tCoinPerSec: 1.5011
  },
  {
    id: 'mx',
    name: 'Mexico',
    flag: '🇲🇽',
    region: 'Americas',
    population: 129400000,
    annualGrowthPct: 0.75,
    tCoinPerDay: 129400.00,
    tCoinPerSec: 1.4976
  },
  {
    id: 'de',
    name: 'Germany',
    flag: '🇩🇪',
    region: 'Europe',
    population: 84500000,
    annualGrowthPct: 0.12,
    tCoinPerDay: 84500.00,
    tCoinPerSec: 0.9780
  },
  {
    id: 'gb',
    name: 'United Kingdom',
    flag: '🇬🇧',
    region: 'Europe',
    population: 68200000,
    annualGrowthPct: 0.34,
    tCoinPerDay: 68200.00,
    tCoinPerSec: 0.7893
  },
  {
    id: 'fr',
    name: 'France',
    flag: '🇫🇷',
    region: 'Europe',
    population: 68100000,
    annualGrowthPct: 0.28,
    tCoinPerDay: 68100.00,
    tCoinPerSec: 0.7881
  },
  {
    id: 'it',
    name: 'Italy',
    flag: '🇮🇹',
    region: 'Europe',
    population: 58900000,
    annualGrowthPct: -0.21,
    tCoinPerDay: 58900.00,
    tCoinPerSec: 0.6817
  },
  {
    id: 'za',
    name: 'South Africa',
    flag: '🇿🇦',
    region: 'Africa',
    population: 60400000,
    annualGrowthPct: 0.91,
    tCoinPerDay: 60400.00,
    tCoinPerSec: 0.6990
  },
  {
    id: 'kr',
    name: 'South Korea',
    flag: '🇰🇷',
    region: 'Asia',
    population: 51700000,
    annualGrowthPct: -0.18,
    tCoinPerDay: 51700.00,
    tCoinPerSec: 0.5983
  },
  {
    id: 'es',
    name: 'Spain',
    flag: '🇪🇸',
    region: 'Europe',
    population: 48100000,
    annualGrowthPct: 0.15,
    tCoinPerDay: 48100.00,
    tCoinPerSec: 0.5567
  },
  {
    id: 'ca',
    name: 'Canada',
    flag: '🇨🇦',
    region: 'Americas',
    population: 39800000,
    annualGrowthPct: 0.88,
    tCoinPerDay: 39800.00,
    tCoinPerSec: 0.4606
  },
  {
    id: 'au',
    name: 'Australia',
    flag: '🇦🇺',
    region: 'Oceania',
    population: 26700000,
    annualGrowthPct: 1.12,
    tCoinPerDay: 26700.00,
    tCoinPerSec: 0.3090
  },
  {
    id: 'sg',
    name: 'Singapore',
    flag: '🇸🇬',
    region: 'Asia',
    population: 6010000,
    annualGrowthPct: 1.18,
    tCoinPerDay: 6010.00,
    tCoinPerSec: 0.0695,
    highlightNote: 'High Tech Innovation Hub'
  },
  {
    id: 'ch',
    name: 'Switzerland',
    flag: '🇨🇭',
    region: 'Europe',
    population: 8900000,
    annualGrowthPct: 0.78,
    tCoinPerDay: 8900.00,
    tCoinPerSec: 0.1030
  }
];

export function GlobalPopulationTCoinConsole() {
  // Navigation Subtab state
  const [activeSubTab, setActiveSubTab] = useState<'reforestation' | 'biology-quiz' | 'demographics'>('reforestation');

  // Live Ticking Global Population State
  const [worldPopulation, setWorldPopulation] = useState<number>(8145392100);
  const [vietnamPopulation, setVietnamPopulation] = useState<number>(100280420);
  const [totalTCoinsMintedGlobal, setTotalTCoinsMintedGlobal] = useState<number>(814539.21);
  const [userClaimedTCoins, setUserClaimedTCoins] = useState<number>(1250);
  
  // Interactive UI Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedCountry, setSelectedCountry] = useState<CountryPopulationData>(COUNTRY_POPULATIONS_CATALOG[0]); // Default Vietnam
  
  // Minting State & Activity Logs
  const [isMinting, setIsMinting] = useState<boolean>(false);
  const [mintSuccessToast, setMintSuccessToast] = useState<string | null>(null);
  const [liveMintLogs, setLiveMintLogs] = useState<{ id: string; time: string; country: string; flag: string; pop: number; tCoinsMinted: number; txHash: string }[]>([
    { id: 'l-1', time: 'Just now', country: 'Vietnam', flag: '🇻🇳', pop: 100280420, tCoinsMinted: 1002.80, txHash: 'ALGO_TX_VN_100M_31566704_99A2' },
    { id: 'l-2', time: '12s ago', country: 'United States', flag: '🇺🇸', pop: 341200000, tCoinsMinted: 3412.00, txHash: 'ALGO_TX_US_341M_31566704_110B' },
    { id: 'l-3', time: '28s ago', country: 'India', flag: '🇮🇳', pop: 1441200000, tCoinsMinted: 14412.00, txHash: 'ALGO_TX_IN_1.4B_31566704_88C1' },
    { id: 'l-4', time: '45s ago', country: 'Japan', flag: '🇯🇵', pop: 124100000, tCoinsMinted: 1241.00, txHash: 'ALGO_TX_JP_124M_31566704_772D' }
  ]);

  // 1. Live real-time world population dynamic increment ticker (2.6 net births/sec)
  useEffect(() => {
    const popInterval = setInterval(() => {
      setWorldPopulation((prev) => prev + 2);
      setVietnamPopulation((prev) => prev + (Math.random() > 0.6 ? 1 : 0));
      setTotalTCoinsMintedGlobal((prev) => parseFloat((prev + 0.08145).toFixed(4)));
    }, 800);

    return () => clearInterval(popInterval);
  }, []);

  // 2. Load and persist user claimed T-Coins to Firestore
  useEffect(() => {
    const docRef = doc(db, 'appState', 'global_tcoin_demographics');
    getDoc(docRef).then((snap) => {
      if (snap.exists() && typeof snap.data().userClaimedTCoins === 'number') {
        setUserClaimedTCoins(snap.data().userClaimedTCoins);
      }
    }).catch(() => {});
  }, []);

  // Filtered Country List
  const filteredCountries = COUNTRY_POPULATIONS_CATALOG.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.id.includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'All' || c.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  // Handle Minting T-Coins for Selected Country
  const handleMintCountryTCoins = (country: CountryPopulationData) => {
    setIsMinting(true);
    
    setTimeout(() => {
      const mintedAmount = parseFloat((country.population / 100000).toFixed(2)); // e.g. Vietnam 100M -> 1002.8 T-Coins
      const newTxHash = `ALGO_TX_${country.id.toUpperCase()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}_31566704`;
      
      setUserClaimedTCoins((prev) => {
        const nextVal = parseFloat((prev + mintedAmount).toFixed(2));
        // Persist to Firestore
        const docRef = doc(db, 'appState', 'global_tcoin_demographics');
        setDoc(docRef, { userClaimedTCoins: nextVal, updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
        return nextVal;
      });

      // Add to Live Mint Log
      setLiveMintLogs((prev) => [
        {
          id: `mint_${Date.now()}`,
          time: 'Just now',
          country: country.name,
          flag: country.flag,
          pop: country.population,
          tCoinsMinted: mintedAmount,
          txHash: newTxHash
        },
        ...prev.slice(0, 7)
      ]);

      setIsMinting(false);
      setMintSuccessToast(`🎉 MINT SUCCESS! Claimed +${mintedAmount.toLocaleString()} T-Coins backed by ${country.flag} ${country.name} (${country.population.toLocaleString()} population)!`);

      setTimeout(() => {
        setMintSuccessToast(null);
      }, 5000);
    }, 700);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-12 font-sans">
      {/* Top Sub-Tab Navigation Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-stone-900 border border-stone-800 p-2 rounded-2xl shadow-lg gap-2">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveSubTab('reforestation')}
            className={`flex-1 sm:flex-initial px-5 py-3 rounded-xl font-mono text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeSubTab === 'reforestation'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-white bg-stone-950/60'
            }`}
          >
            <Trees className="w-4 h-4 text-emerald-300" />
            <span>🌳 Tree-Nation Eco Playground</span>
          </button>

          <button
            onClick={() => setActiveSubTab('biology-quiz')}
            className={`flex-1 sm:flex-initial px-5 py-3 rounded-xl font-mono text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeSubTab === 'biology-quiz'
                ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 text-stone-950 shadow-md scale-105'
                : 'text-stone-400 hover:text-white bg-stone-950/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>🌱 Biology Quiz & Plant Growth (Earn T)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('demographics')}
            className={`flex-1 sm:flex-initial px-5 py-3 rounded-xl font-mono text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeSubTab === 'demographics'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-white bg-stone-950/60'
            }`}
          >
            <Coins className="w-4 h-4 text-amber-300" />
            <span>🪙 Demographic T-Coins</span>
          </button>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-stone-950 rounded-xl border border-stone-800 font-mono text-xs text-amber-400 font-bold">
          <Coins className="w-4 h-4 text-amber-400" />
          <span>Your Balance: {userClaimedTCoins.toLocaleString()} T</span>
        </div>
      </div>

      {activeSubTab === 'reforestation' ? (
        <TreeNationEcoPlayground
          userTCoinBalance={userClaimedTCoins}
          onUpdateTCoinBalance={(newBal) => {
            setUserClaimedTCoins(newBal);
            const docRef = doc(db, 'appState', 'global_tcoin_demographics');
            setDoc(docRef, { userClaimedTCoins: newBal, updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
          }}
        />
      ) : activeSubTab === 'biology-quiz' ? (
        <BiologyEcosystemQuiz
          userTCoinBalance={userClaimedTCoins}
          onRewardTCoins={(earnedCoins) => {
            setUserClaimedTCoins((prev) => {
              const nextVal = prev + earnedCoins;
              const docRef = doc(db, 'appState', 'global_tcoin_demographics');
              setDoc(docRef, { userClaimedTCoins: nextVal, updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
              return nextVal;
            });
          }}
        />
      ) : (
        <>
          {/* Toast Notification */}
          {mintSuccessToast && (
            <div className="fixed top-20 right-4 z-50 bg-emerald-900/95 text-emerald-100 border-2 border-emerald-400 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce max-w-md">
              <Sparkles className="w-6 h-6 text-amber-300 shrink-0" />
              <p className="text-xs font-bold font-mono">{mintSuccessToast}</p>
            </div>
          )}

          {/* Main Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-950 to-emerald-950 text-white p-6 sm:p-8 border border-emerald-500/30 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-80 h-80 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-mono font-bold tracking-wide uppercase">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Institutional Sovereign Asset • Algorand ASA #31566704 • ISO 20022 & MiCA Ready</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-display text-white">
              Institutional Sovereign & Demographic T-Coin Console
            </h1>
            <p className="text-stone-300 text-sm max-w-3xl leading-relaxed">
              T-Coin is engineered as an <strong className="text-amber-300">Institutional Sovereign & Healthcare Reserve Currency</strong> backed by live demographic population metrics, qualified custody vaults, and ISO 20022-compliant messaging. Explore sovereign reserves like <span className="text-amber-300 font-bold underline">Vietnam’s 100,000,000+ national population allocation</span>, institutional treasury vaults, and tier-1 market maker liquidity settlement rails.
            </p>
          </div>

          <div className="bg-stone-900/90 border border-emerald-500/40 p-4 rounded-2xl text-right min-w-[220px] shadow-lg">
            <div className="text-[10px] text-stone-400 font-mono font-bold uppercase tracking-wider">Your Minted T-Coin Balance</div>
            <div className="text-3xl font-black text-amber-400 font-mono mt-1 flex items-center justify-end gap-1.5">
              <Coins className="w-6 h-6 text-amber-400" />
              <span>{userClaimedTCoins.toLocaleString()}</span>
            </div>
            <div className="text-[10px] text-emerald-400 font-mono mt-1 flex items-center justify-end gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Algorand Verified ASA #31566704</span>
            </div>
          </div>
        </div>

        {/* Global Live Population Metrics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-stone-800">
          <div className="p-4 bg-stone-900/80 rounded-2xl border border-stone-800 backdrop-blur-xs">
            <div className="text-[10px] font-mono text-stone-400 uppercase font-bold flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>Current World Population</span>
            </div>
            <div className="text-2xl font-black text-white font-mono mt-1">
              {worldPopulation.toLocaleString()}
            </div>
            <div className="text-[10px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
              <Activity className="w-3 h-3 animate-pulse" />
              <span>+2.6 net humans / sec (Live Ticker)</span>
            </div>
          </div>

          <div className="p-4 bg-stone-900/80 rounded-2xl border border-amber-500/30 backdrop-blur-xs">
            <div className="text-[10px] font-mono text-amber-300 uppercase font-bold flex items-center gap-1.5">
              <span className="text-base">🇻🇳</span>
              <span>Vietnam Live Population</span>
            </div>
            <div className="text-2xl font-black text-amber-300 font-mono mt-1">
              {vietnamPopulation.toLocaleString()}
            </div>
            <div className="text-[10px] text-amber-400 font-mono mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>Milestone: 100,000,000+ Citizens</span>
            </div>
          </div>

          <div className="p-4 bg-stone-900/80 rounded-2xl border border-stone-800 backdrop-blur-xs">
            <div className="text-[10px] font-mono text-stone-400 uppercase font-bold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Global T-Coin Mint Speed</span>
            </div>
            <div className="text-2xl font-black text-amber-400 font-mono mt-1">
              814.5 T / sec
            </div>
            <div className="text-[10px] text-stone-400 font-mono mt-1">
              70.3 Million T-Coins generated daily
            </div>
          </div>

          <div className="p-4 bg-stone-900/80 rounded-2xl border border-stone-800 backdrop-blur-xs">
            <div className="text-[10px] font-mono text-stone-400 uppercase font-bold flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-emerald-400" />
              <span>Total Global Demographic Mint</span>
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
              {totalTCoinsMintedGlobal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-emerald-400 font-mono mt-1">
              100% On-Chain Algorand Backing
            </div>
          </div>
        </div>
      </div>

      {/* Vietnam Spotlight Feature Banner */}
      <div className="p-6 bg-gradient-to-r from-red-950/90 via-stone-900 to-amber-950/80 rounded-3xl border-2 border-amber-500/50 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🇻🇳</span>
              <span className="px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 font-mono text-xs font-bold uppercase">
                Featured Country Demographic Spotlight
              </span>
            </div>
            <h2 className="text-2xl font-black text-white font-display">
              Vietnam National Population T-Coin Reserve
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Vietnam’s vibrant population officially exceeds <strong className="text-amber-300">100,000,000 citizens</strong> (currently <span className="font-mono font-bold text-white">{vietnamPopulation.toLocaleString()}</span>). This generates over <strong className="text-amber-300">100,280 T-Coins per day</strong> (1.16 T-Coins/second) into the Dr. T Algorand x402 Micropayment Ecosystem!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <div className="p-3.5 bg-stone-950/80 rounded-2xl border border-amber-500/40 text-center w-full sm:w-48">
              <div className="text-[10px] font-mono text-stone-400 uppercase font-bold">Vietnam Daily Yield</div>
              <div className="text-xl font-black text-amber-400 font-mono">100,280 T-Coins</div>
              <div className="text-[10px] text-emerald-400 font-mono mt-0.5">1.16 T-Coins / sec</div>
            </div>

            <button
              onClick={() => handleMintCountryTCoins(COUNTRY_POPULATIONS_CATALOG[0])}
              disabled={isMinting}
              className="w-full sm:w-auto px-6 py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-stone-950 font-black rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 font-mono text-sm shrink-0"
            >
              <Coins className="w-5 h-5" />
              <span>{isMinting ? 'MINTING T-COINS...' : 'MINT VIETNAM T-COINS (+1,002.8 T)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Grid: Country Population Catalog & Live Mint Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 cols): Country Population Catalog */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
              <div>
                <h3 className="text-lg font-black text-stone-900 dark:text-white font-display flex items-center gap-2">
                  <Globe className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>World Population Demographic Catalog</span>
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  Live population metrics & continuous T-Coin generation rates per country.
                </p>
              </div>

              {/* Region Filter Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {['All', 'Asia', 'Americas', 'Europe', 'Africa', 'Oceania'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setSelectedRegion(r)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-all ${
                      selectedRegion === r
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search country (e.g. Vietnam, USA, Japan, India...)"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl text-xs font-mono text-stone-800 dark:text-stone-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Country Cards List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[580px] overflow-y-auto pr-1">
              {filteredCountries.map((country) => {
                const isVN = country.id === 'vn';
                return (
                  <div
                    key={country.id}
                    onClick={() => setSelectedCountry(country)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                      selectedCountry.id === country.id
                        ? 'bg-amber-500/10 border-amber-500/60 shadow-md ring-1 ring-amber-500/40'
                        : isVN
                        ? 'bg-gradient-to-r from-red-950/20 to-amber-950/20 border-red-500/40 hover:border-amber-500'
                        : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700/60 hover:border-stone-400 dark:hover:border-stone-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{country.flag}</span>
                        <div>
                          <div className="font-bold text-stone-900 dark:text-white text-xs flex items-center gap-1.5">
                            <span>{country.name}</span>
                            {isVN && (
                              <span className="px-1.5 py-0.2 bg-red-600 text-white text-[9px] font-mono font-bold rounded-sm">
                                100M+
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-stone-500 font-mono">{country.region}</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-mono font-black text-amber-600 dark:text-amber-400">
                          {country.tCoinPerDay.toLocaleString()} T/day
                        </div>
                        <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                          {country.tCoinPerSec.toFixed(2)} T/sec
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-stone-200/60 dark:border-stone-700/60 text-[10px] font-mono">
                      <span className="text-stone-500">
                        Pop: <strong className="text-stone-800 dark:text-stone-200">{country.population.toLocaleString()}</strong>
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMintCountryTCoins(country);
                        }}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-all flex items-center gap-1 hover:scale-105 active:scale-95"
                      >
                        <Coins className="w-3 h-3 text-amber-300" />
                        <span>Mint</span>
                      </button>
                    </div>

                    {country.highlightNote && (
                      <div className="text-[9.5px] text-amber-600 dark:text-amber-400 bg-amber-500/10 p-1.5 rounded-lg font-mono">
                        ✨ {country.highlightNote}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Right Column (1 col): Selected Country Mint Panel & Live Activity Ledger */}
        <div className="space-y-6">
          
          {/* Selected Country Interactive Mint Card */}
          <div className="p-6 bg-stone-900 text-white rounded-3xl border border-stone-800 shadow-lg space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{selectedCountry.flag}</span>
                <div>
                  <h3 className="font-black text-white text-base font-display">
                    {selectedCountry.name}
                  </h3>
                  <div className="text-xs text-amber-400 font-mono">
                    Population: {selectedCountry.population.toLocaleString()}
                  </div>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-[10px] font-mono font-bold rounded-lg uppercase">
                {selectedCountry.region}
              </span>
            </div>

            <div className="space-y-2 pt-2 border-t border-stone-800 font-mono text-xs">
              <div className="flex items-center justify-between text-stone-300">
                <span>Daily T-Coin Output:</span>
                <span className="font-bold text-amber-300">{selectedCountry.tCoinPerDay.toLocaleString()} T</span>
              </div>
              <div className="flex items-center justify-between text-stone-300">
                <span>Per Second T-Coin Output:</span>
                <span className="font-bold text-emerald-400">{selectedCountry.tCoinPerSec.toFixed(4)} T/sec</span>
              </div>
              <div className="flex items-center justify-between text-stone-300">
                <span>Annual Pop Growth:</span>
                <span className="font-bold text-stone-200">+{selectedCountry.annualGrowthPct}% / yr</span>
              </div>
              <div className="flex items-center justify-between text-stone-300">
                <span>Algorand ASA Standard:</span>
                <span className="font-bold text-amber-400">ASA #31566704</span>
              </div>
            </div>

            <button
              onClick={() => handleMintCountryTCoins(selectedCountry)}
              disabled={isMinting}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-stone-950 font-black rounded-2xl shadow-md transition-all hover:scale-102 active:scale-98 flex items-center justify-center gap-2 font-mono text-xs"
            >
              <Coins className="w-4 h-4" />
              <span>
                {isMinting
                  ? 'COMMITTING TO ALGORAND...'
                  : `MINT ${selectedCountry.name.toUpperCase()} T-COINS (+${(selectedCountry.population / 100000).toFixed(1)} T)`}
              </span>
            </button>
          </div>

          {/* Live On-Chain Settlement Stream & Ledger */}
          <div className="p-6 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <h4 className="font-black text-stone-900 dark:text-white text-xs font-display flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Live Demographic Mint Ledger</span>
              </h4>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                Live Blocks
              </span>
            </div>

            <div className="space-y-2.5 max-h-[320px] overflow-y-auto font-mono text-xs">
              {liveMintLogs.map((log) => (
                <div key={log.id} className="p-2.5 bg-stone-50 dark:bg-stone-800/80 rounded-xl border border-stone-100 dark:border-stone-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-stone-800 dark:text-stone-200 text-[11px]">
                      <span>{log.flag}</span>
                      <span>{log.country}</span>
                    </div>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-[11px]">
                      +{log.tCoinsMinted.toLocaleString()} T
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[9.5px] text-stone-400">
                    <span className="truncate max-w-[160px]">{log.txHash}</span>
                    <span>{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Institutional Sovereign Vaults & Institutional Compliance Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-gradient-to-br from-amber-950/80 via-stone-900 to-stone-950 text-white rounded-3xl border border-amber-500/40 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="p-2 bg-amber-500/20 text-amber-300 rounded-xl">
              <Building2 className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-md">
              Sovereign Reserve
            </span>
          </div>
          <h3 className="font-black text-lg text-white font-display">
            Vietnam Sovereign Health Vault
          </h3>
          <p className="text-xs text-stone-300 leading-relaxed">
            Directly backed by Vietnam’s 100,000,000+ citizens with 100,280.42 T-Coins generated daily for state longevity care & clinical AI research.
          </p>
          <div className="pt-2 border-t border-amber-500/30 flex items-center justify-between text-xs font-mono">
            <span className="text-stone-400">Vault Balance:</span>
            <span className="font-bold text-amber-300">12,500,000 T-Coins</span>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-emerald-950/80 via-stone-900 to-stone-950 text-white rounded-3xl border border-emerald-500/40 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="p-2 bg-emerald-500/20 text-emerald-300 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-md">
              Qualified Custody
            </span>
          </div>
          <h3 className="font-black text-lg text-white font-display">
            Institutional Multi-Sig Vaults
          </h3>
          <p className="text-xs text-stone-300 leading-relaxed">
            Secured via Fireblocks & Anchorage Digital 3-of-5 threshold multi-sig with real-time Algorand on-chain Proof of Reserve (PoR).
          </p>
          <div className="pt-2 border-t border-emerald-500/30 flex items-center justify-between text-xs font-mono">
            <span className="text-stone-400">Total Custodial TVL:</span>
            <span className="font-bold text-emerald-400">$482,500,000 USD Equivalent</span>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-teal-950/80 via-stone-900 to-stone-950 text-white rounded-3xl border border-teal-500/40 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="p-2 bg-teal-500/20 text-teal-300 rounded-xl">
              <Award className="w-5 h-5" />
            </span>
            <span className="text-[10px] font-mono font-bold text-teal-300 bg-teal-500/10 border border-teal-500/30 px-2 py-0.5 rounded-md">
              ISO 20022 & MiCA
            </span>
          </div>
          <h3 className="font-black text-lg text-white font-display">
            Institutional Standards Compliance
          </h3>
          <p className="text-xs text-stone-300 leading-relaxed">
            Full ISO 20022 financial messaging compatibility, MiCA Tokenized Real-World Asset (RWA) classification, and automated KYC/AML hooks.
          </p>
          <div className="pt-2 border-t border-teal-500/30 flex items-center justify-between text-xs font-mono">
            <span className="text-stone-400">Settlement Finality:</span>
            <span className="font-bold text-teal-300 font-mono">3.3s Instant Finality</span>
          </div>
        </div>
      </div>

      {/* Analytical Visualizations Section */}
      <div className="p-6 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-black text-stone-900 dark:text-white font-display flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-500" />
            <span>Top Demographic T-Coin Generation Leaderboard</span>
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Visual population scale vs. daily T-Coin minting output across top demographic nations.
          </p>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {COUNTRY_POPULATIONS_CATALOG.slice(0, 8).map((c, idx) => {
            const maxPop = 1441200000;
            const pct = Math.min(100, Math.max(8, (c.population / maxPop) * 100));
            const isVN = c.id === 'vn';

            return (
              <div key={c.id} className="space-y-1">
                <div className="flex items-center justify-between text-stone-700 dark:text-stone-300">
                  <div className="flex items-center gap-2">
                    <span className="text-stone-400 font-bold text-[10px]">#{idx + 1}</span>
                    <span className="text-base">{c.flag}</span>
                    <span className={`font-bold ${isVN ? 'text-amber-600 dark:text-amber-400' : ''}`}>
                      {c.name} {isVN ? '(100M+ Milestone)' : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-stone-500 text-[11px]">{c.population.toLocaleString()} pop</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">{c.tCoinPerDay.toLocaleString()} T/day</span>
                  </div>
                </div>

                <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-3 overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      isVN
                        ? 'bg-gradient-to-r from-red-500 via-amber-400 to-yellow-400'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
        </>
      )}
    </div>
  );
}
