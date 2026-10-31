import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Bike, 
  Heart, 
  Clock, 
  ShieldCheck, 
  Navigation, 
  SlidersHorizontal, 
  PlusCircle, 
  Map, 
  List, 
  Languages, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { StreetVendor, VendorCategory, CityKey } from './types';
import { INITIAL_STREET_VENDORS } from './data/vendorsData';
import { streetVendorsTranslations } from './translations';
import { InteractiveVendorsMap } from './InteractiveVendorsMap';
import { VendorDetailModal } from './VendorDetailModal';
import { ShipperDeliveryModal } from './ShipperDeliveryModal';
import { CommunityContributeModal } from './CommunityContributeModal';
import { StreetVendorsFooter } from './StreetVendorsFooter';

interface StreetVendorsMapModuleProps {
  initialLang?: 'vi' | 'en';
}

export const StreetVendorsMapModule: React.FC<StreetVendorsMapModuleProps> = ({
  initialLang = 'vi',
}) => {
  const [lang, setLang] = useState<'vi' | 'en'>(initialLang);
  const t = streetVendorsTranslations[lang];

  // Vendors state
  const [vendors, setVendors] = useState<StreetVendor[]>(INITIAL_STREET_VENDORS);

  // Filter states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<CityKey>('all');
  const [selectedCategory, setSelectedCategory] = useState<VendorCategory>('all');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<'map' | 'list'>('map');

  // Modal states
  const [detailVendor, setDetailVendor] = useState<StreetVendor | null>(null);
  const [shipperVendor, setShipperVendor] = useState<StreetVendor | null>(null);
  const [isContributeOpen, setIsContributeOpen] = useState<boolean>(false);
  const [selectedMapVendor, setSelectedMapVendor] = useState<StreetVendor | null>(INITIAL_STREET_VENDORS[0]);

  // Categories config
  const categories: Array<{ id: VendorCategory; labelVI: string; labelEN: string; icon: string }> = [
    { id: 'all', labelVI: t.catAll, labelEN: t.catAll, icon: '🌟' },
    { id: 'dessert_che', labelVI: t.catDessertChe, labelEN: t.catDessertChe, icon: '🥣' },
    { id: 'noodles_soup', labelVI: t.catNoodlesSoup, labelEN: t.catNoodlesSoup, icon: '🍜' },
    { id: 'banhmi_snacks', labelVI: t.catBanhmiSnacks, labelEN: t.catBanhmiSnacks, icon: '🥖' },
    { id: 'drinks_ginseng', labelVI: t.catDrinksGinseng, labelEN: t.catDrinksGinseng, icon: '🧋' },
    { id: 'fruits_produce', labelVI: t.catFruitsProduce, labelEN: t.catFruitsProduce, icon: '🍉' },
    { id: 'crafts_repair', labelVI: t.catCraftsRepair, labelEN: t.catCraftsRepair, icon: '👞' },
  ];

  // Filtered vendors
  const filteredVendors = useMemo(() => {
    return vendors.filter(v => {
      // City
      if (selectedCity !== 'all' && v.city !== selectedCity) return false;

      // Category
      if (selectedCategory !== 'all' && v.category !== selectedCategory) return false;

      // Verified
      if (verifiedOnly && !v.verified) return false;

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = v.nameVI.toLowerCase().includes(q) || v.nameEN.toLowerCase().includes(q);
        const matchOwner = v.ownerName.toLowerCase().includes(q);
        const matchAddress = v.addressVI.toLowerCase().includes(q) || v.addressEN.toLowerCase().includes(q);
        const matchSpecialties = v.specialtiesVI.some(s => s.toLowerCase().includes(q)) || 
                                 v.specialtiesEN.some(s => s.toLowerCase().includes(q));
        const matchDistrict = v.districtVI.toLowerCase().includes(q) || v.districtEN.toLowerCase().includes(q);

        if (!matchName && !matchOwner && !matchAddress && !matchSpecialties && !matchDistrict) {
          return false;
        }
      }

      return true;
    });
  }, [vendors, selectedCity, selectedCategory, verifiedOnly, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const totalVendors = vendors.length;
    const districtsSet = new Set(vendors.map(v => `${v.city}-${v.districtVI}`));
    const eldersCount = vendors.filter(v => v.ownerAge >= 70).length;
    const totalDeliveries = vendors.reduce((sum, v) => sum + v.likesCount, 0);

    return {
      totalVendors,
      totalDistricts: districtsSet.size,
      eldersCount,
      totalDeliveries,
    };
  }, [vendors]);

  const handleAddCommunityVendor = (newVendor: StreetVendor) => {
    setVendors(prev => [newVendor, ...prev]);
    setSelectedMapVendor(newVendor);
  };

  return (
    <div className="min-h-screen bg-stone-100/60 text-stone-900 pb-20 selection:bg-amber-200">
      {/* Top Notification / Language Bar */}
      <div className="bg-amber-900 text-amber-100 text-xs px-4 py-2 border-b border-amber-950/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <span className="font-semibold text-white truncate">{t.heroBadge}</span>
            <span aria-hidden="true" className="hidden sm:inline">·</span>
            <span className="hidden sm:inline text-amber-200/90 truncate">
              {lang === 'vi' 
                ? 'Kết nối trực tiếp người mua với shipper Grab & Xanh SM hỗ trợ người già buôn gánh bán bưng'
                : 'Directly dispatching Grab & Green SM couriers to support elder street vendors'}
            </span>
          </div>

          {/* Bilingual Switcher */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Languages className="w-3.5 h-3.5 text-amber-300" />
            <button
              type="button"
              onClick={() => setLang('vi')}
              className={`px-2 py-0.5 rounded text-xs font-semibold transition-colors ${
                lang === 'vi' ? 'bg-amber-700 text-white shadow-2xs' : 'text-amber-300 hover:text-white'
              }`}
            >
              🇻🇳 Tiếng Việt
            </button>
            <span className="text-amber-500/60">|</span>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-2 py-0.5 rounded text-xs font-semibold transition-colors ${
                lang === 'en' ? 'bg-amber-700 text-white shadow-2xs' : 'text-amber-300 hover:text-white'
              }`}
            >
              🇬🇧 English
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700">
                <span>{t.tabName}</span>
                <span aria-hidden="true">·</span>
                <span>{t.tabSubtitle}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-stone-900">
                {t.heroTitle}
              </h1>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                {t.heroDesc}
              </p>
            </div>

            {/* Quick Action: Nominate Vendor */}
            <div className="shrink-0 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsContributeOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t.contributeButton}</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-stone-200/70">
            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/70">
              <p className="text-2xs uppercase tracking-wider font-semibold text-stone-500">{t.statVendors}</p>
              <p className="text-xl sm:text-2xl font-bold text-amber-800 mt-0.5">{stats.totalVendors}</p>
            </div>
            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/70">
              <p className="text-2xs uppercase tracking-wider font-semibold text-stone-500">{t.statDistricts}</p>
              <p className="text-xl sm:text-2xl font-bold text-teal-800 mt-0.5">{stats.totalDistricts}</p>
            </div>
            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/70">
              <p className="text-2xs uppercase tracking-wider font-semibold text-stone-500">{t.statElders}</p>
              <p className="text-xl sm:text-2xl font-bold text-rose-800 mt-0.5">{stats.eldersCount}</p>
            </div>
            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/70">
              <p className="text-2xs uppercase tracking-wider font-semibold text-stone-500">{t.statOrders}</p>
              <p className="text-xl sm:text-2xl font-bold text-emerald-800 mt-0.5">{stats.totalDeliveries.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Controls & Map Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 space-y-6">
        {/* Search & View Controls Bar */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50/50"
              />
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl shrink-0">
              <button
                type="button"
                onClick={() => setActiveView('map')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  activeView === 'map'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Map className="w-3.5 h-3.5 text-amber-600" />
                <span>{t.viewMap}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveView('list')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  activeView === 'list'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <List className="w-3.5 h-3.5 text-teal-600" />
                <span>{t.viewList}</span>
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-stone-900 text-white shadow-2xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{lang === 'vi' ? cat.labelVI : cat.labelEN}</span>
              </button>
            ))}
          </div>

          {/* Secondary Controls: Results count & Verified filter */}
          <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
            <div>
              {t.showingResults.replace('{count}', filteredVendors.length.toString())}
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={e => setVerifiedOnly(e.target.checked)}
                className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
              />
              <span className="text-stone-700">{t.filterVerified}</span>
            </label>
          </div>
        </div>

        {/* View Component: Map or Directory */}
        {activeView === 'map' && (
          <InteractiveVendorsMap
            vendors={filteredVendors}
            selectedVendor={selectedMapVendor}
            onSelectVendor={setSelectedMapVendor}
            onOpenDetail={setDetailVendor}
            onOpenShipper={setShipperVendor}
            selectedCity={selectedCity}
            onSelectCity={setSelectedCity}
            lang={lang}
          />
        )}

        {/* Vendor Grid (Shown in List view or below Map) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-stone-900">
              {lang === 'vi' ? 'Danh Sách Gánh Hàng Rong Mưu Sinh' : 'Directory of Mapped Street Vendors'}
            </h3>
            <span className="text-xs text-stone-500">
              {filteredVendors.length} {lang === 'vi' ? 'điểm bán' : 'locations'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVendors.map(vendor => (
              <div
                key={vendor.id}
                className="bg-white rounded-2xl border border-stone-200/90 hover:border-amber-400 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Card Image */}
                  <div className="relative h-44 overflow-hidden bg-stone-100">
                    <img
                      src={vendor.photoUrl}
                      alt={lang === 'vi' ? vendor.nameVI : vendor.nameEN}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
                    
                    {/* Top status & Verification */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs">
                      {vendor.verified && (
                        <span className="px-2.5 py-1 rounded-md bg-stone-900/80 backdrop-blur-md text-emerald-400 text-2xs font-semibold flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          <span>{lang === 'vi' ? 'Đã xác minh' : 'Verified'}</span>
                        </span>
                      )}

                      <span className={`px-2 py-0.5 rounded-md text-2xs font-bold backdrop-blur-md ml-auto ${
                        vendor.isOpenNow ? 'bg-emerald-600/90 text-white' : 'bg-stone-700/80 text-stone-300'
                      }`}>
                        {vendor.isOpenNow ? t.openNow : t.closedNow}
                      </span>
                    </div>

                    {/* Card Title Banner */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="text-2xs text-amber-300 font-medium mb-0.5">
                        <span>{vendor.ownerName}</span>
                        <span aria-hidden="true" className="mx-1">·</span>
                        <span>{vendor.ownerAge} {t.ageLabel}</span>
                        <span aria-hidden="true" className="mx-1">·</span>
                        <span>{vendor.yearsTrading} {t.yearsTrading}</span>
                      </div>
                      <h4 className="font-bold text-sm text-white line-clamp-1">
                        {lang === 'vi' ? vendor.nameVI : vendor.nameEN}
                      </h4>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-3">
                    {/* Address & Landmark */}
                    <div className="flex items-start gap-2 text-xs text-stone-600">
                      <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-stone-900 line-clamp-1">
                          {lang === 'vi' ? vendor.districtVI : vendor.districtEN}
                        </p>
                        <p className="text-stone-500 line-clamp-1">
                          {lang === 'vi' ? vendor.addressVI : vendor.addressEN}
                        </p>
                        <p className="text-2xs text-amber-800 italic line-clamp-1 mt-0.5">
                          {lang === 'vi' ? vendor.landmarkVI : vendor.landmarkEN}
                        </p>
                      </div>
                    </div>

                    {/* Hours & Price */}
                    <div className="flex items-center justify-between text-2xs text-stone-500 border-t border-stone-100 pt-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-teal-600" />
                        <span className="truncate max-w-[140px]">{lang === 'vi' ? vendor.operatingHoursVI : vendor.operatingHoursEN}</span>
                      </span>
                      <span className="font-bold text-amber-700">{vendor.priceRangeVND}</span>
                    </div>

                    {/* Specialties Clean Typography (No generic candy pills!) */}
                    <div className="text-2xs text-stone-600 flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold text-stone-800">{t.specialties}:</span>
                      {(lang === 'vi' ? vendor.specialtiesVI : vendor.specialtiesEN).map((spec, i) => (
                        <span key={i} className="inline-flex items-center">
                          {spec}
                          {i < vendor.specialtiesVI.length - 1 && <span className="mx-1 text-stone-400">·</span>}
                        </span>
                      ))}
                    </div>

                    {/* Story Snippet */}
                    <p className="text-xs text-stone-600 line-clamp-2 italic font-serif bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                      "{lang === 'vi' ? vendor.storyVI : vendor.storyEN}"
                    </p>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDetailVendor(vendor)}
                    className="w-full py-2 px-3 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-medium transition-colors text-center"
                  >
                    {t.viewStory}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShipperVendor(vendor)}
                    className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Bike className="w-3.5 h-3.5" />
                    <span>{t.orderShipper}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footnote & Non-Commercial Citation */}
        <StreetVendorsFooter lang={lang} />
      </div>

      {/* Modals */}
      {detailVendor && (
        <VendorDetailModal
          vendor={detailVendor}
          isOpen={!!detailVendor}
          onClose={() => setDetailVendor(null)}
          onOpenShipper={(v) => {
            setDetailVendor(null);
            setShipperVendor(v);
          }}
          lang={lang}
        />
      )}

      {shipperVendor && (
        <ShipperDeliveryModal
          vendor={shipperVendor}
          isOpen={!!shipperVendor}
          onClose={() => setShipperVendor(null)}
          lang={lang}
        />
      )}

      {isContributeOpen && (
        <CommunityContributeModal
          isOpen={isContributeOpen}
          onClose={() => setIsContributeOpen(false)}
          onAddVendor={handleAddCommunityVendor}
          lang={lang}
        />
      )}
    </div>
  );
};
