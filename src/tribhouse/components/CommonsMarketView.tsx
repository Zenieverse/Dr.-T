import React, { useState } from 'react';
import { 
  ShoppingBag, Trees, Heart, ShieldCheck, CheckCircle2, 
  Coins, Sparkles, PieChart, ArrowRight, Package, Search,
  X, ExternalLink, Leaf, AlertCircle, RefreshCw
} from 'lucide-react';
import { tribStorage } from '../services/tribStorageService';
import { DAODEJING_COVER_IMAGE } from '../../assets/daodejingImage';

export type MarketCategory = 'ALL' | 'SEED_KIT' | 'HANDBOUND_BOOK' | 'WOOD_CRAFT' | 'WORKSHOP' | 'ZEN_ARTIFACT';

export interface MarketItem {
  id: string;
  title: string;
  creator: string;
  creatorRole: string;
  category: MarketCategory;
  tCoinsPrice: number;
  usdPrice: number;
  description: string;
  image: string;
  treesPlantedOnPurchase: number;
  inStock: number;
  originRegion?: string;
}

const MOCK_MARKET_ITEMS: MarketItem[] = [
  {
    id: 'item_daodejing_scroll',
    title: 'Daodejing Chapter 8 "Watercourse Way" Silk & Dó Paper Scroll',
    creator: 'Master Calligrapher Minh Trí & Cloud-Water Hermitage',
    creatorRole: 'Daoist Calligrapher',
    category: 'ZEN_ARTIFACT',
    tCoinsPrice: 85,
    usdPrice: 35,
    description: 'Original ink wash brushwork of Chapter 8 ("The Supreme Good is Like Water") on organic mulberry Dó paper mounted on silk brocade scroll with cedar dowels.',
    image: DAODEJING_COVER_IMAGE,
    treesPlantedOnPurchase: 5,
    inStock: 12,
    originRegion: 'Huế & Wudang Mountain Heritage'
  },
  {
    id: 'item_singing_bowl',
    title: '432 Hz Resonant Tibetan Bronze Singing Bowl & Rosewood Striker',
    creator: 'Himalayan Artisans Fellowship',
    creatorRole: 'Traditional Metal Masters',
    category: 'ZEN_ARTIFACT',
    tCoinsPrice: 95,
    usdPrice: 42,
    description: 'Hand-hammered alloy bowl tuned precisely to 432 Hz harmonic frequency for breath meditation, zazen timers, and contemplative reading spaces.',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    treesPlantedOnPurchase: 6,
    inStock: 18,
    originRegion: 'Kathmandu Valley, Nepal'
  },
  {
    id: 'item_1',
    title: 'Ancestral Forest Seed Packet (Lim Xanh & Ironwood)',
    creator: 'Cúc Phương Seed Keepers Cooperative',
    creatorRole: 'Botanical Rangers',
    category: 'SEED_KIT',
    tCoinsPrice: 40,
    usdPrice: 15,
    description: 'Viable, non-GMO heirloom seeds harvested from native tropical canopy trees, accompanied by organic germinating substrate and hand-pressed bark instructions.',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?auto=format&fit=crop&w=600&q=80',
    treesPlantedOnPurchase: 3,
    inStock: 48,
    originRegion: 'Cúc Phương National Park, Vietnam'
  },
  {
    id: 'item_2',
    title: 'Handbound Linen Edition: The Tale of Kiều (Bilingual Vietnamese/English)',
    creator: 'Huế Artisan Bookbindery & Traditional Paper Guild',
    creatorRole: 'Master Bookbinders',
    category: 'HANDBOUND_BOOK',
    tCoinsPrice: 90,
    usdPrice: 38,
    description: 'Hand-sewn with organic cotton thread on Dó handmade mulberry paper. Features scholarly annotations and woodblock illustrations.',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    treesPlantedOnPurchase: 5,
    inStock: 14,
    originRegion: 'Huế Imperial Craft Village'
  },
  {
    id: 'item_3',
    title: 'Carved Camphorwood Reading Nest Stand & Ambient Diffuser',
    creator: 'Bảo Lộc Forest Woodcraft Collective',
    creatorRole: 'Fallen Timber Artisans',
    category: 'WOOD_CRAFT',
    tCoinsPrice: 75,
    usdPrice: 32,
    description: 'Crafted exclusively from naturally fallen camphor trees in the Central Highlands. Naturally aromatic, smooth oil finish, fits tablets or hardcover books.',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
    treesPlantedOnPurchase: 4,
    inStock: 22,
    originRegion: 'Bảo Lộc, Lâm Đồng'
  },
  {
    id: 'item_4',
    title: 'Living Soil & Mycelium Cultivation Masterclass (Live 4-Week Workshop)',
    creator: 'Dr. Lê Hữu Trí & Sapa Permaculture Commons',
    creatorRole: 'Soil Ecologist',
    category: 'WORKSHOP',
    tCoinsPrice: 120,
    usdPrice: 50,
    description: 'Interactive weekend workshops guiding practical backyard composting, mycorrhizal inoculants, and biological soil microscopy.',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=600&q=80',
    treesPlantedOnPurchase: 8,
    inStock: 35,
    originRegion: 'Sapa Ecological Station'
  }
];

const CATEGORY_FILTERS: { key: MarketCategory; label: string }[] = [
  { key: 'ALL', label: 'All Artifacts' },
  { key: 'ZEN_ARTIFACT', label: 'Zen & Daoist Living' },
  { key: 'SEED_KIT', label: 'Seeds & Botanical' },
  { key: 'HANDBOUND_BOOK', label: 'Handbound Books' },
  { key: 'WOOD_CRAFT', label: 'Forest Woodcraft' },
  { key: 'WORKSHOP', label: 'Living Workshops' },
];

export const CommonsMarketView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<MarketCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [userForest, setUserForest] = useState(tribStorage.getPersonalForest());
  const [activeReceiptItem, setActiveReceiptItem] = useState<MarketItem | null>(null);
  const [topupNotification, setTopupNotification] = useState<string | null>(null);

  const filteredItems = MOCK_MARKET_ITEMS.filter(item => {
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handlePurchase = (item: MarketItem) => {
    if (userForest.tCoinsBalance < item.tCoinsPrice) {
      // Auto topup difference + extra for a seamless test flow
      const needed = item.tCoinsPrice - userForest.tCoinsBalance + 20;
      tribStorage.awardTCoins(needed, 'Participation dividend & reading grant');
    }
    
    tribStorage.deductTCoins(item.tCoinsPrice, `Purchased ${item.title}`);
    tribStorage.recordTreeSupport(item.treesPlantedOnPurchase);
    setUserForest(tribStorage.getPersonalForest());
    setActiveReceiptItem(item);
  };

  const handleEarnTokens = () => {
    tribStorage.awardTCoins(50, 'Daily reading and soil stewardship dividend');
    setUserForest(tribStorage.getPersonalForest());
    setTopupNotification('+50 T-Coins credited from daily reading & care dividends!');
    setTimeout(() => setTopupNotification(null), 3500);
  };

  return (
    <div id="commons-market-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
            <ShoppingBag className="w-4 h-4" />
            <span>Regenerative Economics Protocol</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-100 mt-1">
            The Commons Marketplace
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Physical and intellectual artifacts created by village artisans, bookbinders, Daoist hermits, and forest stewards
          </p>
        </div>

        {/* T-Coin Balance & Top-up Faucet */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 text-xs font-bold shadow-sm">
            <Coins className="w-4 h-4 text-emerald-600" />
            <span>Your Balance: {userForest.tCoinsBalance} T-Coins</span>
          </div>

          <button
            id="market-earn-tcoins-btn"
            onClick={handleEarnTokens}
            className="px-3.5 py-2 rounded-2xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 text-xs font-bold flex items-center gap-1.5 shadow-sm transition active:scale-95"
            title="Harvest reading dividend"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>+50 T-Coins</span>
          </button>
        </div>
      </div>

      {topupNotification && (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{topupNotification}</span>
        </div>
      )}

      {/* 5-Pool Transparent Revenue Architecture Banner */}
      <div className="p-6 rounded-3xl bg-stone-900 text-stone-100 border border-stone-800 space-y-4 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-emerald-400" />
            <h3 className="font-serif font-bold text-base text-white">
              The 5-Pool Transparent Revenue Architecture
            </h3>
          </div>
          <span className="text-[11px] font-mono text-emerald-300 bg-stone-800 px-2.5 py-1 rounded-full border border-stone-700">
            Formula: 60% / 20% / 10% / 5% / 5%
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700">
            <div className="text-emerald-400 font-bold text-lg font-serif">60%</div>
            <div className="text-xs font-semibold text-white">Creator & Artisan</div>
            <div className="text-[10px] text-stone-400 mt-0.5">Direct to the makers</div>
          </div>

          <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700">
            <div className="text-blue-400 font-bold text-lg font-serif">20%</div>
            <div className="text-xs font-semibold text-white">Platform Operations</div>
            <div className="text-[10px] text-stone-400 mt-0.5">Hosting & AI inference</div>
          </div>

          <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700">
            <div className="text-amber-400 font-bold text-lg font-serif">10%</div>
            <div className="text-xs font-semibold text-white">Elder Dialogue Pool</div>
            <div className="text-[10px] text-stone-400 mt-0.5">Intergenerational mentorship</div>
          </div>

          <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700">
            <div className="text-purple-400 font-bold text-lg font-serif">5%</div>
            <div className="text-xs font-semibold text-white">Children's Library</div>
            <div className="text-[10px] text-stone-400 mt-0.5">Free books & translations</div>
          </div>

          <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700 col-span-2 sm:col-span-1">
            <div className="text-teal-400 font-bold text-lg font-serif">5%</div>
            <div className="text-xs font-semibold text-white">Earth Reforestation</div>
            <div className="text-[10px] text-stone-400 mt-0.5">Native tree planting</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="market-search-input"
              type="text"
              placeholder="Search artifacts, artisans, seeds, or Daodejing scrolls..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 shadow-2xs"
            />
          </div>

          <div className="text-xs text-stone-500 dark:text-stone-400">
            Showing <strong className="text-stone-800 dark:text-stone-200">{filteredItems.length}</strong> living artifacts
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {CATEGORY_FILTERS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setSelectedCategory(tab.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === tab.key
                  ? 'bg-emerald-700 text-white font-bold shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <div
            key={item.id}
            id={`market-item-${item.id}`}
            className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-400 dark:hover:border-emerald-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative h-48 w-full bg-stone-200 dark:bg-stone-800 overflow-hidden group">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80';
                  }}
                />
                <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-semibold border border-white/20">
                  {item.category.replace('_', ' ')}
                </div>
                <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-full bg-emerald-600/90 backdrop-blur-xs text-white text-[10px] font-bold flex items-center gap-1 shadow-md">
                  <Trees className="w-3 h-3" />
                  <span>+{item.treesPlantedOnPurchase} Trees Planted</span>
                </div>
                {item.originRegion && (
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-stone-950/70 text-stone-300 text-[9px] font-mono">
                    {item.originRegion}
                  </div>
                )}
              </div>

              <div className="p-5 space-y-2">
                <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center justify-between">
                  <span>{item.creator}</span>
                  <span className="text-stone-400 font-normal">({item.creatorRole})</span>
                </div>
                <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-base leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed line-clamp-3">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0 space-y-3">
              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                  <span className="text-base text-emerald-600 dark:text-emerald-400 font-mono">{item.tCoinsPrice}</span>
                  <span>T-Coins</span>
                  <span className="text-[11px] text-stone-400 font-normal">(${item.usdPrice})</span>
                </div>
                <div className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                  {item.inStock} in stock
                </div>
              </div>

              <button
                id={`buy-item-btn-${item.id}`}
                onClick={() => handlePurchase(item)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-900/20 transition active:scale-98"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Acquire & Distribute via 5 Pools</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 5-Pool Receipt Modal */}
      {activeReceiptItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-emerald-500/40 p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl animate-scaleUp">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100">
                    5-Pool Allocation Complete!
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Regenerative Economic Settlement Confirmed
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveReceiptItem(null)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Item Card in Receipt */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
              <img
                src={activeReceiptItem.image}
                alt={activeReceiptItem.title}
                className="w-14 h-14 rounded-xl object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80';
                }}
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 truncate">
                  {activeReceiptItem.title}
                </h4>
                <div className="text-xs text-stone-500 dark:text-stone-400">
                  {activeReceiptItem.creator} • {activeReceiptItem.tCoinsPrice} T-Coins (${activeReceiptItem.usdPrice})
                </div>
              </div>
            </div>

            {/* Real Pool Breakdown Math */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Transparent Revenue Distribution
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200">
                  <span>60% Creator & Artisan</span>
                  <span className="font-mono font-bold">{(activeReceiptItem.tCoinsPrice * 0.60).toFixed(1)} T-Coins</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200">
                  <span>20% Platform Operations & AI</span>
                  <span className="font-mono font-bold">{(activeReceiptItem.tCoinsPrice * 0.20).toFixed(1)} T-Coins</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200">
                  <span>10% Elder Dialogue Mentorship</span>
                  <span className="font-mono font-bold">{(activeReceiptItem.tCoinsPrice * 0.10).toFixed(1)} T-Coins</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200">
                  <span>5% Children's Library Pool</span>
                  <span className="font-mono font-bold">{(activeReceiptItem.tCoinsPrice * 0.05).toFixed(1)} T-Coins</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200">
                  <span>5% Native Earth Reforestation</span>
                  <span className="font-mono font-bold">{(activeReceiptItem.tCoinsPrice * 0.05).toFixed(1)} T-Coins (+{activeReceiptItem.treesPlantedOnPurchase} Trees)</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => setActiveReceiptItem(null)}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition"
              >
                Done & Return to Market
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
