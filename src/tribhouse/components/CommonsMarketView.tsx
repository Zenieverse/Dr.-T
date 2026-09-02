import React, { useState } from 'react';
import { 
  ShoppingBag, Trees, Heart, ShieldCheck, CheckCircle2, 
  Coins, Sparkles, PieChart, ArrowRight, Package
} from 'lucide-react';
import { tribStorage } from '../services/tribStorageService';

interface MarketItem {
  id: string;
  title: string;
  creator: string;
  creatorRole: string;
  category: 'SEED_KIT' | 'HANDBOUND_BOOK' | 'WOOD_CRAFT' | 'WORKSHOP';
  tCoinsPrice: number;
  usdPrice: number;
  description: string;
  image: string;
  treesPlantedOnPurchase: number;
  inStock: number;
}

const MOCK_MARKET_ITEMS: MarketItem[] = [
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
    inStock: 48
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
    inStock: 14
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
    inStock: 22
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
    inStock: 35
  }
];

export const CommonsMarketView: React.FC = () => {
  const [purchasedItem, setPurchasedItem] = useState<string | null>(null);
  const [userForest, setUserForest] = useState(tribStorage.getPersonalForest());

  const handlePurchase = (item: MarketItem) => {
    if (userForest.tCoinsBalance < item.tCoinsPrice) {
      // simulate award for testing
      tribStorage.awardTCoins(item.tCoinsPrice + 10, 'Testing balance topup');
    }
    tribStorage.deductTCoins(item.tCoinsPrice, `Purchased ${item.title}`);
    tribStorage.recordTreeSupport(item.treesPlantedOnPurchase);
    setUserForest(tribStorage.getPersonalForest());
    setPurchasedItem(item.id);
    setTimeout(() => setPurchasedItem(null), 3000);
  };

  return (
    <div id="commons-market-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
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
            Physical and intellectual artifacts created by village artisans, bookbinders, and forest stewards
          </p>
        </div>

        {/* T-Coin Balance Badge */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 text-xs font-bold shadow-sm">
          <Coins className="w-4 h-4 text-emerald-600" />
          <span>Your Balance: {userForest.tCoinsBalance} T-Coins</span>
        </div>
      </div>

      {/* 5-Pool Transparent Breakdown Banner */}
      <div className="p-6 rounded-3xl bg-stone-900 text-stone-100 border border-stone-800 space-y-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-emerald-400" />
            <h3 className="font-serif font-bold text-base text-white">
              The 5-Pool Transparent Revenue Architecture
            </h3>
          </div>
          <span className="text-[11px] text-stone-400">Zero speculative markup</span>
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

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_MARKET_ITEMS.map(item => (
          <div
            key={item.id}
            className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative h-44 w-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-stone-900/80 text-white text-[10px] font-semibold">
                  {item.category.replace('_', ' ')}
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-emerald-600/90 text-white text-[10px] font-bold flex items-center gap-1">
                  <Trees className="w-3 h-3" />
                  <span>+{item.treesPlantedOnPurchase} Trees</span>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                  {item.creator}
                </div>
                <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed line-clamp-3">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="p-4 pt-0 space-y-2">
              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                <div className="font-bold text-stone-900 dark:text-stone-100">
                  {item.tCoinsPrice} 🪙 <span className="text-[10px] text-stone-400 font-normal">(${item.usdPrice})</span>
                </div>
                <div className="text-[10px] text-stone-400">
                  {item.inStock} in stock
                </div>
              </div>

              <button
                id={`buy-item-btn-${item.id}`}
                onClick={() => handlePurchase(item)}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
              >
                {purchasedItem === item.id ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Allocated to 5 Pools!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Acquire with {item.tCoinsPrice} T-Coins</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
