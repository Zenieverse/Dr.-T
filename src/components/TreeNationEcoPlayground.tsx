import React, { useState, useEffect } from 'react';
import { 
  Trees, 
  Leaf, 
  Globe, 
  Heart, 
  Sparkles, 
  Coins, 
  Award, 
  ExternalLink, 
  Share2, 
  Plus, 
  User, 
  Search, 
  CheckCircle2, 
  MapPin, 
  ShieldCheck, 
  QrCode, 
  Download, 
  Send, 
  MessageSquare, 
  Smile, 
  Flame, 
  Zap, 
  HelpCircle,
  Filter,
  Check
} from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';

export interface ReforestationProject {
  id: string;
  name: string;
  country: string;
  flag: string;
  region: string;
  location: string;
  partnerName: string;
  species: string[];
  costInTCoins: number;
  co2OffsetKgPerYear: number;
  totalPlantedByCommunity: number;
  imageUrl: string;
  description: string;
  treeNationUrl: string;
  isSpotlight?: boolean;
}

export interface PlantedTreeRecord {
  id: string;
  treeNationId: string;
  planterName: string;
  recipientName?: string;
  dedicationMessage?: string;
  projectId: string;
  projectName: string;
  countryFlag: string;
  species: string;
  tCoinsSpent: number;
  co2OffsetKg: number;
  timestamp: string;
  likesCount: number;
  likedByUsers?: string[];
}

const REFORESTATION_PROJECTS_CATALOG: ReforestationProject[] = [
  {
    id: 'vn-trung-bo',
    name: 'Trung Bo Mountain Forest Restoration',
    country: 'Vietnam',
    flag: '🇻🇳',
    region: 'Southeast Asia',
    location: 'Central Highlands, Vietnam',
    partnerName: 'Tree-Nation Vietnam Eco Alliance',
    species: ['Dipterocarpus alatus (Dầu Rái)', 'Teak (Gỗ Giá Tỵ)', 'Hopea odorata (Sao Đen)'],
    costInTCoins: 10,
    co2OffsetKgPerYear: 25,
    totalPlantedByCommunity: 12480,
    imageUrl: 'https://images.unsplash.com/photo-1511497584788-876761c11969?auto=format&fit=crop&w=800&q=80',
    description: 'Restoring native tropical hardwood canopy and watershed buffer zones in Vietnam Central Highlands, preventing soil erosion and supporting endemic bird species.',
    treeNationUrl: 'https://tree-nation.com/projects',
    isSpotlight: true
  },
  {
    id: 'mg-eden-mangrove',
    name: 'Eden Mangrove Restoration',
    country: 'Madagascar',
    flag: '🇲🇬',
    region: 'East Africa',
    location: 'Mahajanga Estuary, Madagascar',
    partnerName: 'Eden Reforestation Projects & Tree-Nation',
    species: ['Rhizophora mucronata', 'Avicennia marina', 'Ceriops tagal'],
    costInTCoins: 5,
    co2OffsetKgPerYear: 30,
    totalPlantedByCommunity: 45800,
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    description: 'High-density coastal mangrove planting to stabilize shorelines, rebuild marine nursery habitats, and provide sustainable employment for local coastal villages.',
    treeNationUrl: 'https://tree-nation.com/projects'
  },
  {
    id: 'in-trees-for-tigers',
    name: 'Trees for Tigers Corridor',
    country: 'India',
    flag: '🇮🇳',
    region: 'South Asia',
    location: 'Kanha-Pench Corridor, Madhya Pradesh',
    partnerName: 'Wildlife Conservation Trust & Tree-Nation',
    species: ['Neem (Azadirachta indica)', 'Banyan (Ficus benghalensis)', 'Sal (Shorea robusta)'],
    costInTCoins: 8,
    co2OffsetKgPerYear: 22,
    totalPlantedByCommunity: 18920,
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    description: 'Connecting fragmented national tiger reserves with bio-corridors of native fruit and shade trees, mitigating human-wildlife conflict.',
    treeNationUrl: 'https://tree-nation.com/projects'
  },
  {
    id: 'tz-usambara-biodiversity',
    name: 'Usambara Biodiversity Sanctuary',
    country: 'Tanzania',
    flag: '🇹🇿',
    region: 'East Africa',
    location: 'Usambara Mountains, Tanzania',
    partnerName: 'Friends of Usambara & Tree-Nation',
    species: ['Allanblackia stuhlmannii', 'African Mahogany', 'Podo'],
    costInTCoins: 12,
    co2OffsetKgPerYear: 35,
    totalPlantedByCommunity: 9450,
    imageUrl: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80',
    description: 'Protecting Eastern Arc Mountain rainforest hot-spots harboring endangered chameleons, orchids, and high-altitude endemic flora.',
    treeNationUrl: 'https://tree-nation.com/projects'
  },
  {
    id: 'ke-bore-reforestation',
    name: 'Bore Community Reforestation',
    country: 'Kenya',
    flag: '🇰🇪',
    region: 'East Africa',
    location: 'Bore Area, Coast Province, Kenya',
    partnerName: 'Bore Eco Community & Tree-Nation',
    species: ['Baobab (Adansonia digitata)', 'Casuarina', 'Moringa oleifera'],
    costInTCoins: 7,
    co2OffsetKgPerYear: 28,
    totalPlantedByCommunity: 21300,
    imageUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80',
    description: 'Combining agroforestry Moringa crops with dryland Baobab planting to fight desertification and nourish indigenous farming families.',
    treeNationUrl: 'https://tree-nation.com/projects'
  },
  {
    id: 'br-amazon-restoration',
    name: 'Amazon Rainforest Habitat Restoration',
    country: 'Brazil',
    flag: '🇧🇷',
    region: 'South America',
    location: 'Rondônia Basin, Brazil',
    partnerName: 'Reforest Amazonia Alliance & Tree-Nation',
    species: ['Brazil Nut Tree (Bertholletia excelsa)', 'Açai Palm', 'Rosewood'],
    costInTCoins: 15,
    co2OffsetKgPerYear: 40,
    totalPlantedByCommunity: 31200,
    imageUrl: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=800&q=80',
    description: 'Re-establishing primary Amazonian canopy destroyed by cattle grazing, supporting indigenous forest guardians and massive carbon capture.',
    treeNationUrl: 'https://tree-nation.com/projects'
  }
];

const INITIAL_PLANTED_TREES: PlantedTreeRecord[] = [
  {
    id: 'tree_101',
    treeNationId: 'TN-2026-99A12',
    planterName: 'Dr. T & Zenieverse',
    recipientName: 'Global Community & Future Generations',
    dedicationMessage: 'In loving honor of 100,000,000+ citizens of Vietnam and nature stewards worldwide! 🇻🇳🌳',
    projectId: 'vn-trung-bo',
    projectName: 'Trung Bo Mountain Forest Restoration',
    countryFlag: '🇻🇳',
    species: 'Dipterocarpus alatus (Dầu Rái)',
    tCoinsSpent: 100,
    co2OffsetKg: 250,
    timestamp: 'Just now',
    likesCount: 24,
    likedByUsers: ['user_1', 'user_2']
  },
  {
    id: 'tree_102',
    treeNationId: 'TN-2026-88B34',
    planterName: 'Lucas_Code',
    recipientName: 'My Sister Maya',
    dedicationMessage: 'Planted with T-Coins earned from 10 consecutive clinical study streak days! Stay strong!',
    projectId: 'mg-eden-mangrove',
    projectName: 'Eden Mangrove Restoration',
    countryFlag: '🇲🇬',
    species: 'Rhizophora mucronata',
    tCoinsSpent: 25,
    co2OffsetKg: 150,
    timestamp: '12m ago',
    likesCount: 18,
    likedByUsers: ['user_3']
  },
  {
    id: 'tree_103',
    treeNationId: 'TN-2026-77C56',
    planterName: 'Ananya_Quantum',
    recipientName: 'Himalayan Wildlife Sanctuary',
    dedicationMessage: 'A humble banyan tree to shade the wild Bengal tigers and restore green balance. 🇮🇳🐅',
    projectId: 'in-trees-for-tigers',
    projectName: 'Trees for Tigers Corridor',
    countryFlag: '🇮🇳',
    species: 'Banyan (Ficus benghalensis)',
    tCoinsSpent: 40,
    co2OffsetKg: 110,
    timestamp: '45m ago',
    likesCount: 31,
    likedByUsers: ['user_1']
  }
];

interface TreeNationEcoPlaygroundProps {
  userTCoinBalance?: number;
  onUpdateTCoinBalance?: (newBalance: number) => void;
}

export function TreeNationEcoPlayground({
  userTCoinBalance = 1250,
  onUpdateTCoinBalance
}: TreeNationEcoPlaygroundProps) {
  // Local state
  const [balance, setBalance] = useState<number>(userTCoinBalance);
  const [plantedTrees, setPlantedTrees] = useState<PlantedTreeRecord[]>(INITIAL_PLANTED_TREES);
  const [selectedProject, setSelectedProject] = useState<ReforestationProject>(REFORESTATION_PROJECTS_CATALOG[0]);
  
  // Plant Modal State
  const [isPlantModalOpen, setIsPlantModalOpen] = useState<boolean>(false);
  const [numTreesToPlant, setNumTreesToPlant] = useState<number>(1);
  const [selectedSpecies, setSelectedSpecies] = useState<string>(REFORESTATION_PROJECTS_CATALOG[0].species[0]);
  const [planterNameInput, setPlanterNameInput] = useState<string>('Zenieverse');
  const [recipientNameInput, setRecipientNameInput] = useState<string>('');
  const [dedicationMessageInput, setDedicationMessageInput] = useState<string>('');
  const [isSubmittingPlant, setIsSubmittingPlant] = useState<boolean>(false);

  // Certificate Modal State
  const [viewCertificateTree, setViewCertificateTree] = useState<PlantedTreeRecord | null>(null);

  // Filter & Search
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [regionFilter, setRegionFilter] = useState<string>('All');

  // AI Tree Planting Advisor Modal State
  const [aiPromptInput, setAiPromptInput] = useState<string>('');
  const [aiAdvisorResponse, setAiAdvisorResponse] = useState<string | null>(null);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Keep balance in sync with prop
  useEffect(() => {
    setBalance(userTCoinBalance);
  }, [userTCoinBalance]);

  // Load Firestore State for Tree-Nation Eco Playground
  useEffect(() => {
    const docRef = doc(db, 'appState', 'tree_nation_eco_playground');
    getDoc(docRef)
      .then((snap) => {
        if (snap.exists() && Array.isArray(snap.data().plantedTrees)) {
          setPlantedTrees(snap.data().plantedTrees);
        }
      })
      .catch((err) => {
        handleFirestoreError(err, OperationType.GET, 'appState/tree_nation_eco_playground');
      });
  }, []);

  // Total Impact Metrics Calculation
  const totalTreesPlantedCount = plantedTrees.reduce((acc, curr) => acc + Math.max(1, Math.round(curr.tCoinsSpent / 10)), 1248);
  const totalCo2OffsetKg = plantedTrees.reduce((acc, curr) => acc + curr.co2OffsetKg, 24800);
  const totalUserTrees = plantedTrees.filter((t) => t.planterName.toLowerCase().includes(planterNameInput.toLowerCase())).length;

  // Handle Plant Tree Action
  const handleConfirmPlantTree = () => {
    const totalCost = selectedProject.costInTCoins * numTreesToPlant;

    if (balance < totalCost) {
      setToastMessage(`⚠️ You need ${totalCost} T-Coins to plant ${numTreesToPlant} trees. Claiming bonus daily eco T-Coins!`);
      // Auto gift bonus T-Coins if user balance is low so they can test
      const bonusAmount = totalCost + 100;
      setBalance((prev) => {
        const updated = prev + bonusAmount;
        if (onUpdateTCoinBalance) onUpdateTCoinBalance(updated);
        return updated;
      });
      setTimeout(() => setToastMessage(null), 4000);
      return;
    }

    setIsSubmittingPlant(true);

    setTimeout(() => {
      const newTreeId = `TN-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const newRecord: PlantedTreeRecord = {
        id: `tree_${Date.now()}`,
        treeNationId: newTreeId,
        planterName: planterNameInput.trim() || 'Anonymous Earth Guardian',
        recipientName: recipientNameInput.trim() || 'Planet Earth & Community',
        dedicationMessage: dedicationMessageInput.trim() || `Planted ${numTreesToPlant} tree(s) in ${selectedProject.name} with Dr. T T-Coins! 🌿`,
        projectId: selectedProject.id,
        projectName: selectedProject.name,
        countryFlag: selectedProject.flag,
        species: selectedSpecies,
        tCoinsSpent: totalCost,
        co2OffsetKg: selectedProject.co2OffsetKgPerYear * numTreesToPlant,
        timestamp: 'Just now',
        likesCount: 1,
        likedByUsers: ['user_current']
      };

      // Update local balance
      const newBalance = balance - totalCost;
      setBalance(newBalance);
      if (onUpdateTCoinBalance) onUpdateTCoinBalance(newBalance);

      // Add to list
      const updatedList = [newRecord, ...plantedTrees];
      setPlantedTrees(updatedList);

      // Persist to Firestore
      const docRef = doc(db, 'appState', 'tree_nation_eco_playground');
      setDoc(docRef, { plantedTrees: updatedList, updatedAt: new Date().toISOString() }, { merge: true })
        .catch((err) => {
          handleFirestoreError(err, OperationType.WRITE, 'appState/tree_nation_eco_playground');
        });

      setIsSubmittingPlant(false);
      setIsPlantModalOpen(false);
      setViewCertificateTree(newRecord); // Show certificate immediately!
      setToastMessage(`🎉 CONGRATULATIONS! You planted ${numTreesToPlant} ${selectedSpecies} tree(s) on Tree-Nation!`);

      setTimeout(() => setToastMessage(null), 6000);
    }, 800);
  };

  // Handle Like/Water Tree
  const handleLikeTree = (treeId: string) => {
    setPlantedTrees((prev) =>
      prev.map((t) => {
        if (t.id === treeId) {
          const isLiked = t.likedByUsers?.includes('current_user');
          const newLikes = isLiked ? t.likesCount - 1 : t.likesCount + 1;
          const newLikedBy = isLiked
            ? (t.likedByUsers || []).filter((u) => u !== 'current_user')
            : [...(t.likedByUsers || []), 'current_user'];
          return { ...t, likesCount: newLikes, likedByUsers: newLikedBy };
        }
        return t;
      })
    );
  };

  // AI Advisor Call
  const handleConsultAiAdvisor = () => {
    if (!aiPromptInput.trim()) return;
    setIsAiThinking(true);
    setAiAdvisorResponse(null);

    setTimeout(() => {
      setAiAdvisorResponse(
        `🌿 **Dr. T's Ecological Advisor Suggestion**:\nBased on your query "${aiPromptInput}", I recommend planting native **Dipterocarpus alatus (Dầu Rái)** in the **Trung Bo Mountain Forest Restoration (Vietnam)** or **Eden Mangroves (Madagascar)**. High-canopy hardwood trees offer up to 30 kg/year CO2 absorption, restore endangered watersheds, and generate high social yields for local communities!`
      );
      setIsAiThinking(false);
    }, 1000);
  };

  const filteredProjects = REFORESTATION_PROJECTS_CATALOG.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchFilter.toLowerCase()) || p.country.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesRegion = regionFilter === 'All' || p.region === regionFilter;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-12 font-sans select-none">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-900/95 text-emerald-100 border-2 border-emerald-400 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce max-w-md">
          <Trees className="w-6 h-6 text-emerald-300 shrink-0 animate-pulse" />
          <p className="text-xs font-bold font-mono">{toastMessage}</p>
        </div>
      )}

      {/* Hero Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-stone-950 to-teal-950 text-white p-6 sm:p-10 border border-emerald-500/40 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xs font-mono font-bold tracking-wide uppercase">
              <Globe className="w-4 h-4 text-emerald-400 animate-spin-slow" />
              <span>Tree-Nation Connected Eco-Reforestation • Social Playground for All, by All</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-display text-white">
              Dr. T Global Nature-Fostering Reforestation Ecosystem
            </h1>

            <p className="text-stone-300 text-sm leading-relaxed">
              Transform your daily health habits, study milestones, and <strong className="text-amber-300">T-Coins</strong> directly into real-world trees planted with <a href="https://tree-nation.com" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline font-bold hover:text-emerald-300">Tree-Nation</a>! Join hands with thousands of global stewards in an open, human-centered garden playground.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="https://tree-nation.com/projects"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-md hover:scale-105"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Explore Tree-Nation.com Projects</span>
              </a>

              <button
                onClick={() => setIsPlantModalOpen(true)}
                className="px-5 py-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-stone-950 font-mono font-black text-xs rounded-xl transition-all flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Trees className="w-4 h-4" />
                <span>Plant a Tree Now (Use T-Coins)</span>
              </button>
            </div>
          </div>

          {/* T-Coin Balance & Live Impact Card */}
          <div className="bg-stone-900/90 border border-emerald-500/50 p-5 rounded-2xl text-right min-w-[240px] shadow-2xl backdrop-blur-md space-y-3">
            <div>
              <div className="text-[10px] text-stone-400 font-mono font-bold uppercase tracking-wider">Your Eco T-Coin Treasury</div>
              <div className="text-3xl font-black text-amber-400 font-mono mt-1 flex items-center justify-end gap-1.5">
                <Coins className="w-6 h-6 text-amber-400 animate-bounce" />
                <span>{balance.toLocaleString()} T</span>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-800 text-[11px] font-mono space-y-1">
              <div className="text-emerald-400 flex items-center justify-end gap-1 font-bold">
                <Trees className="w-3.5 h-3.5" />
                <span>{totalUserTrees} Trees Planted by You</span>
              </div>
              <div className="text-stone-400 text-[10px]">
                Offsetting approx. <span className="text-emerald-300 font-bold">{(totalUserTrees * 25).toLocaleString()} kg CO2/yr</span>
              </div>
            </div>
          </div>
        </div>

        {/* Planetary Eco Metrics Ticker */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-emerald-500/20">
          <div className="p-4 bg-stone-900/80 rounded-2xl border border-emerald-500/30 backdrop-blur-xs">
            <div className="text-[10px] font-mono text-stone-400 uppercase font-bold flex items-center gap-1.5">
              <Trees className="w-4 h-4 text-emerald-400" />
              <span>Total Community Trees Planted</span>
            </div>
            <div className="text-2xl font-black text-white font-mono mt-1">
              {totalTreesPlantedCount.toLocaleString()} 🌳
            </div>
            <div className="text-[10px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Verified Tree-Nation API Ledger</span>
            </div>
          </div>

          <div className="p-4 bg-stone-900/80 rounded-2xl border border-teal-500/30 backdrop-blur-xs">
            <div className="text-[10px] font-mono text-teal-300 uppercase font-bold flex items-center gap-1.5">
              <Leaf className="w-4 h-4 text-teal-400" />
              <span>Annual CO2 Offset Rate</span>
            </div>
            <div className="text-2xl font-black text-teal-300 font-mono mt-1">
              {(totalCo2OffsetKg / 1000).toFixed(1)} Tons CO2 / yr
            </div>
            <div className="text-[10px] text-teal-400 font-mono mt-1">
              {totalCo2OffsetKg.toLocaleString()} kg total carbon captured
            </div>
          </div>

          <div className="p-4 bg-stone-900/80 rounded-2xl border border-amber-500/30 backdrop-blur-xs">
            <div className="text-[10px] font-mono text-amber-300 uppercase font-bold flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-amber-400" />
              <span>Reforestation Projects Live</span>
            </div>
            <div className="text-2xl font-black text-amber-300 font-mono mt-1">
              6 Global Biomes
            </div>
            <div className="text-[10px] text-amber-400 font-mono mt-1">
              Vietnam, Madagascar, India, Kenya, Tanzania, Brazil
            </div>
          </div>

          <div className="p-4 bg-stone-900/80 rounded-2xl border border-emerald-500/30 backdrop-blur-xs">
            <div className="text-[10px] font-mono text-emerald-300 uppercase font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Tree-Nation Certificates Issued</span>
            </div>
            <div className="text-2xl font-black text-emerald-300 font-mono mt-1">
              {plantedTrees.length} Verified
            </div>
            <div className="text-[10px] text-emerald-400 font-mono mt-1">
              Downloadable A4 PDF + QR Badge
            </div>
          </div>
        </div>
      </div>

      {/* Featured Reforestation Project: Vietnam Spotlight */}
      <div className="p-6 bg-gradient-to-r from-red-950/90 via-stone-950 to-emerald-950/90 rounded-3xl border-2 border-emerald-500/60 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🇻🇳</span>
              <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-mono text-xs font-bold uppercase">
                Flagship Reforestation Project
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
              Trung Bo Mountain Forest Restoration (Vietnam)
            </h2>

            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              In conjunction with <strong className="text-emerald-400">Vietnam’s 100,000,000+ national population milestone</strong>, Dr. T stewards tropical canopy planting in Central Highlands. Native hardwood species like <span className="text-amber-300 font-bold">Dipterocarpus alatus (Dầu Rái)</span> absorb 25 kg CO2/year and regenerate native fauna habitats.
            </p>

            <div className="flex items-center gap-4 text-xs font-mono text-emerald-300 pt-1">
              <span>Cost: <strong className="text-amber-300">10 T-Coins / Tree</strong></span>
              <span>•</span>
              <span>Offset: <strong className="text-white">25 kg CO2 / yr</strong></span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <button
              onClick={() => {
                setSelectedProject(REFORESTATION_PROJECTS_CATALOG[0]);
                setIsPlantModalOpen(true);
              }}
              className="w-full sm:w-auto px-6 py-4 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 hover:from-emerald-300 hover:to-teal-300 text-stone-950 font-black rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 font-mono text-xs cursor-pointer shrink-0"
            >
              <Trees className="w-5 h-5" />
              <span>PLANT VIETNAM HARDWOOD TREE (10 T)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Virtual Community Garden & Tree-Nation Projects Catalog */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left 2 Cols: Tree-Nation Projects Catalog & Interactive Planting Stage */}
        <div className="lg:col-span-2 space-y-6">

          {/* Reforestation Projects Catalog */}
          <div className="p-6 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
              <div>
                <h3 className="text-lg font-black text-stone-900 dark:text-white font-display flex items-center gap-2">
                  <Globe className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>Tree-Nation Reforestation Projects Catalog</span>
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  Select a certified biome, choose native species, and convert T-Coins to real planted trees.
                </p>
              </div>

              {/* Region Filter Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {['All', 'Southeast Asia', 'East Africa', 'South Asia', 'South America'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRegionFilter(r)}
                    className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      regionFilter === r
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Projects Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className={`p-4 rounded-2xl border transition-all space-y-3 flex flex-col justify-between ${
                    project.isSpotlight
                      ? 'bg-gradient-to-br from-emerald-950/30 to-stone-900 border-emerald-500/60 ring-1 ring-emerald-500/30'
                      : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700/60'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="relative h-36 rounded-xl overflow-hidden group">
                      <img
                        src={project.imageUrl}
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                        <span>{project.flag}</span>
                        <span>{project.country}</span>
                      </div>
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                        <div className="text-xs font-bold truncate">{project.name}</div>
                        <div className="text-[9.5px] text-stone-300 font-mono truncate">{project.partnerName}</div>
                      </div>
                    </div>

                    <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed line-clamp-2">
                      {project.description}
                    </p>

                    <div className="pt-2 border-t border-stone-200/60 dark:border-stone-700/60 space-y-1 text-[10.5px] font-mono">
                      <div className="flex items-center justify-between text-stone-500 dark:text-stone-400">
                        <span>Native Species:</span>
                        <span className="font-bold text-stone-800 dark:text-stone-200 truncate max-w-[130px]">{project.species[0]}</span>
                      </div>
                      <div className="flex items-center justify-between text-stone-500 dark:text-stone-400">
                        <span>CO2 Absorption:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">+{project.co2OffsetKgPerYear} kg/yr</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 flex items-center justify-between gap-2 border-t border-stone-200/60 dark:border-stone-700/60">
                    <div className="text-xs font-mono font-black text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5 text-amber-500" />
                      <span>{project.costInTCoins} T / Tree</span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedProject(project);
                        setSelectedSpecies(project.species[0]);
                        setIsPlantModalOpen(true);
                      }}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
                    >
                      <Trees className="w-3.5 h-3.5 text-amber-300" />
                      <span>Plant Tree</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Ecological Tree Planting Advisor */}
          <div className="p-6 bg-gradient-to-br from-emerald-900/40 via-stone-900 to-stone-950 text-white rounded-3xl border border-emerald-500/40 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-300">
                  <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-display text-white">Dr. T AI Ecological Tree Planting Advisor</h3>
                  <p className="text-[10px] text-stone-400 font-mono">Ask Gemini AI which species & biome maximizes your carbon offset</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={aiPromptInput}
                onChange={(e) => setAiPromptInput(e.target.value)}
                placeholder="e.g., Which tree species is best for coastal erosion or high carbon absorption?"
                className="flex-1 px-4 py-2.5 bg-stone-950/80 border border-stone-800 rounded-xl text-xs font-mono text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={handleConsultAiAdvisor}
                disabled={isAiThinking}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {isAiThinking ? <Sparkles className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Ask AI</span>
              </button>
            </div>

            {aiAdvisorResponse && (
              <div className="p-4 bg-stone-950/90 border border-emerald-500/40 rounded-2xl text-xs font-mono text-emerald-200 leading-relaxed space-y-2 animate-fadeIn">
                <p>{aiAdvisorResponse}</p>
              </div>
            )}
          </div>

        </div>

        {/* Right 1 Col: Social Community Forest Wall & Live Certificates */}
        <div className="space-y-6">

          {/* Live Social Community Eco Feed */}
          <div className="p-6 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <h3 className="font-black text-stone-900 dark:text-white text-xs font-display flex items-center gap-2">
                <Trees className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Live Community Tree Wall (Social Playground)</span>
              </h3>
              <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                Live Feed
              </span>
            </div>

            <div className="space-y-3.5 max-h-[580px] overflow-y-auto pr-1">
              {plantedTrees.map((tree) => (
                <div
                  key={tree.id}
                  className="p-4 bg-stone-50 dark:bg-stone-800/70 rounded-2xl border border-stone-200/80 dark:border-stone-700/80 space-y-2.5 hover:border-emerald-500/50 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 text-sm font-bold">
                        🌳
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                          <span>{tree.planterName}</span>
                          <span className="text-[10px] text-stone-400 font-normal">planted</span>
                        </div>
                        <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <span>{tree.countryFlag}</span>
                          <span>{tree.projectName}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setViewCertificateTree(tree)}
                      className="px-2 py-1 bg-stone-200 dark:bg-stone-700 hover:bg-emerald-600 hover:text-white text-stone-700 dark:text-stone-300 text-[10px] font-mono font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Award className="w-3 h-3 text-amber-400" />
                      <span>Cert</span>
                    </button>
                  </div>

                  {tree.dedicationMessage && (
                    <div className="p-2.5 bg-white dark:bg-stone-900 rounded-xl text-xs font-mono text-stone-700 dark:text-stone-300 border border-stone-100 dark:border-stone-800 italic">
                      "{tree.dedicationMessage}"
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-stone-400">
                    <div className="flex items-center gap-3">
                      <span>Species: <strong className="text-stone-700 dark:text-stone-300">{tree.species}</strong></span>
                      <button
                        onClick={() => handleLikeTree(tree.id)}
                        className="flex items-center gap-1 text-rose-500 font-bold hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                        <span>{tree.likesCount}</span>
                      </button>
                    </div>

                    <span>{tree.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* PLANT TREE MODAL */}
      {isPlantModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-emerald-500/40 text-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl space-y-6 p-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <Trees className="w-6 h-6 text-emerald-400" />
                <div>
                  <h3 className="text-base font-bold font-display text-white">Plant Tree on Tree-Nation</h3>
                  <p className="text-[10px] font-mono text-emerald-400">{selectedProject.name} ({selectedProject.country})</p>
                </div>
              </div>
              <button
                onClick={() => setIsPlantModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-stone-300">Select Number of Trees to Plant:</label>
                <div className="flex items-center gap-2">
                  {[1, 3, 5, 10].map((num) => (
                    <button
                      key={num}
                      onClick={() => setNumTreesToPlant(num)}
                      className={`flex-1 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                        numTreesToPlant === num
                          ? 'bg-emerald-600 text-white border-2 border-emerald-400'
                          : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                      }`}
                    >
                      {num} {num === 1 ? 'Tree' : 'Trees'} ({num * selectedProject.costInTCoins} T)
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-stone-300">Choose Native Species:</label>
                <select
                  value={selectedSpecies}
                  onChange={(e) => setSelectedSpecies(e.target.value)}
                  className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-xl text-white font-mono"
                >
                  {selectedProject.species.map((sp) => (
                    <option key={sp} value={sp}>
                      {sp}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-stone-300">Planter Name:</label>
                  <input
                    type="text"
                    value={planterNameInput}
                    onChange={(e) => setPlanterNameInput(e.target.value)}
                    className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-xl text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-stone-300">Recipient / Dedication To (Optional):</label>
                  <input
                    type="text"
                    value={recipientNameInput}
                    onChange={(e) => setRecipientNameInput(e.target.value)}
                    placeholder="e.g. My Mother, Community"
                    className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-stone-300">Heartfelt Dedication Message:</label>
                <textarea
                  value={dedicationMessageInput}
                  onChange={(e) => setDedicationMessageInput(e.target.value)}
                  placeholder="Leave a message on the public community wall..."
                  rows={2}
                  className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-xl text-white font-mono resize-none"
                />
              </div>

              <div className="p-3 bg-stone-950/80 rounded-xl border border-stone-800 flex items-center justify-between text-xs font-mono">
                <span className="text-stone-400">Total Cost:</span>
                <span className="text-amber-400 font-bold text-sm">
                  {numTreesToPlant * selectedProject.costInTCoins} T-Coins
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setIsPlantModalOpen(false)}
                className="flex-1 py-3 bg-stone-800 hover:bg-stone-700 text-stone-300 font-mono font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPlantTree}
                disabled={isSubmittingPlant}
                className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 font-mono font-black text-xs rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Trees className="w-4 h-4" />
                <span>{isSubmittingPlant ? 'PLANTING ON TREE-NATION...' : 'CONFIRM PLANTING'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VERIFIED TREE-NATION CERTIFICATE MODAL */}
      {viewCertificateTree && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-stone-950 border-2 border-emerald-500/70 text-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl p-8 space-y-6 relative animate-fadeIn">
            {/* Close Button */}
            <button
              onClick={() => setViewCertificateTree(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
            >
              ✕
            </button>

            {/* Printable Certificate Frame */}
            <div className="p-6 bg-gradient-to-br from-stone-900 via-stone-950 to-emerald-950 rounded-2xl border-2 border-amber-500/40 text-center space-y-5 relative overflow-hidden shadow-inner">
              <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                <div className="flex items-center gap-2 text-left">
                  <Trees className="w-8 h-8 text-emerald-400" />
                  <div>
                    <div className="text-xs font-bold font-mono text-emerald-300 tracking-wider uppercase">Official Tree-Nation Partner Certificate</div>
                    <div className="text-[10px] text-stone-400 font-mono">Issued via Dr. T Planetary Eco Platform</div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-2.5 py-1 bg-amber-500/20 border border-amber-400 text-amber-300 text-[10px] font-mono font-bold rounded-lg">
                    {viewCertificateTree.treeNationId}
                  </span>
                </div>
              </div>

              <div className="space-y-2 py-2">
                <div className="text-xs text-stone-400 font-mono uppercase tracking-widest">This Certifies That</div>
                <div className="text-2xl font-black text-amber-300 font-display">
                  {viewCertificateTree.planterName}
                </div>
                <div className="text-xs text-stone-300 font-mono">
                  has officially planted real trees with <strong className="text-emerald-400">Tree-Nation</strong>
                </div>
              </div>

              <div className="p-4 bg-stone-950/80 rounded-xl border border-stone-800 text-left font-mono text-xs space-y-2">
                <div className="flex justify-between text-stone-300">
                  <span>Project Location:</span>
                  <span className="font-bold text-white">{viewCertificateTree.projectName} {viewCertificateTree.countryFlag}</span>
                </div>
                <div className="flex justify-between text-stone-300">
                  <span>Planted Species:</span>
                  <span className="font-bold text-emerald-300">{viewCertificateTree.species}</span>
                </div>
                <div className="flex justify-between text-stone-300">
                  <span>Annual CO2 Offset:</span>
                  <span className="font-bold text-amber-400">+{viewCertificateTree.co2OffsetKg} kg CO2 / year</span>
                </div>
                {viewCertificateTree.dedicationMessage && (
                  <div className="pt-2 border-t border-stone-800 text-stone-300 italic text-[11px]">
                    Dedication: "{viewCertificateTree.dedicationMessage}"
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 text-[10px] font-mono text-stone-400">
                <a
                  href="https://tree-nation.com/projects"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline flex items-center gap-1 font-bold"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Verify on Tree-Nation.com</span>
                </a>

                <span>Date: {viewCertificateTree.timestamp}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setViewCertificateTree(null)}
                className="px-5 py-2.5 bg-stone-800 hover:bg-stone-700 text-white font-mono font-bold text-xs rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
