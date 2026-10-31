import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Bike, 
  Navigation, 
  Plus, 
  Minus, 
  RotateCcw, 
  Sparkles, 
  Compass, 
  ShieldCheck, 
  Info,
  Maximize2
} from 'lucide-react';
import { StreetVendor, CityKey } from './types';
import { streetVendorsTranslations } from './translations';

interface InteractiveVendorsMapProps {
  vendors: StreetVendor[];
  selectedVendor: StreetVendor | null;
  onSelectVendor: (vendor: StreetVendor) => void;
  onOpenDetail: (vendor: StreetVendor) => void;
  onOpenShipper: (vendor: StreetVendor) => void;
  selectedCity: CityKey;
  onSelectCity: (city: CityKey) => void;
  lang: 'vi' | 'en';
}

// Center coordinates for Vietnam key cities
const CITY_CENTERS: Record<CityKey, { lat: number; lng: number; zoom: number; nameVI: string; nameEN: string }> = {
  all: { lat: 10.7769, lng: 106.6953, zoom: 1, nameVI: 'Toàn quốc', nameEN: 'All Vietnam' },
  hcm: { lat: 10.7769, lng: 106.6953, zoom: 1.4, nameVI: 'TP. Hồ Chí Minh', nameEN: 'Saigon (HCMC)' },
  hanoi: { lat: 21.0285, lng: 105.8542, zoom: 1.4, nameVI: 'Hà Nội', nameEN: 'Hanoi' },
  danang: { lat: 16.0544, lng: 108.2022, zoom: 1.4, nameVI: 'Đà Nẵng', nameEN: 'Da Nang' },
  cantho: { lat: 10.0335, lng: 105.7865, zoom: 1.4, nameVI: 'Cần Thơ', nameEN: 'Can Tho' },
  hue: { lat: 16.4637, lng: 107.5909, zoom: 1.4, nameVI: 'Huế', nameEN: 'Hue' },
};

export const InteractiveVendorsMap: React.FC<InteractiveVendorsMapProps> = ({
  vendors,
  selectedVendor,
  onSelectVendor,
  onOpenDetail,
  onOpenShipper,
  selectedCity,
  onSelectCity,
  lang,
}) => {
  const t = streetVendorsTranslations[lang];
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [mapMode, setMapMode] = useState<'radar' | 'satellite'>('radar');

  // Compute map projection box based on selectedCity and vendors
  const cityConfig = CITY_CENTERS[selectedCity] || CITY_CENTERS.hcm;

  // Filter vendors in this view
  const displayVendors = useMemo(() => {
    if (selectedCity === 'all') return vendors;
    return vendors.filter(v => v.city === selectedCity);
  }, [vendors, selectedCity]);

  // Handle zoom
  const handleZoom = (delta: number) => {
    setZoomLevel(prev => Math.min(2.2, Math.max(0.8, prev + delta)));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  // Convert GPS (lat, lng) to 2D percentage coordinate within city bounding box
  const getMapPosition = (vendor: StreetVendor) => {
    // If selectedCity is 'all', compute nationwide layout
    if (selectedCity === 'all') {
      // Vietnam latitude stretches ~9 to ~22, longitude ~104 to ~109
      const minLat = 9.5;
      const maxLat = 22.0;
      const minLng = 104.5;
      const maxLng = 109.5;

      const y = 92 - ((vendor.coordinates.lat - minLat) / (maxLat - minLat)) * 84;
      const x = 12 + ((vendor.coordinates.lng - minLng) / (maxLng - minLng)) * 76;
      return { top: `${Math.max(5, Math.min(95, y))}%`, left: `${Math.max(5, Math.min(95, x))}%` };
    }

    // City local bounds
    const center = cityConfig;
    const deltaLat = 0.12 / zoomLevel;
    const deltaLng = 0.14 / zoomLevel;

    const y = 50 - ((vendor.coordinates.lat - center.lat) / deltaLat) * 40;
    const x = 50 + ((vendor.coordinates.lng - center.lng) / deltaLng) * 40;

    return { 
      top: `${Math.max(8, Math.min(92, y))}%`, 
      left: `${Math.max(8, Math.min(92, x))}%` 
    };
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-stone-200 bg-stone-900 shadow-md">
      {/* Top Map Toolbar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* City Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-950/85 backdrop-blur-md rounded-xl border border-stone-700/60 pointer-events-auto shadow-sm">
          {(['all', 'hcm', 'hanoi', 'danang', 'cantho', 'hue'] as CityKey[]).map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => onSelectCity(city)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                selectedCity === city
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              {lang === 'vi' ? CITY_CENTERS[city].nameVI : CITY_CENTERS[city].nameEN}
            </button>
          ))}
        </div>

        {/* Zoom & View Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-950/85 backdrop-blur-md rounded-xl border border-stone-700/60 pointer-events-auto shadow-sm">
          <button
            type="button"
            onClick={() => handleZoom(0.25)}
            title="Zoom in"
            className="w-7 h-7 flex items-center justify-center rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
          <span className="text-2xs font-mono text-stone-400 px-1">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            type="button"
            onClick={() => handleZoom(-0.25)}
            title="Zoom out"
            className="w-7 h-7 flex items-center justify-center rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-stone-700 mx-0.5" />
          <button
            type="button"
            onClick={handleResetZoom}
            title="Reset zoom"
            className="w-7 h-7 flex items-center justify-center rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Map Canvas Viewport */}
      <div className="relative w-full h-[460px] sm:h-[540px] overflow-hidden select-none bg-stone-950">
        {/* Subtle Map Grid / Vietnamese Topography styling */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#d97706 1px, transparent 1px), radial-gradient(#d97706 1px, #0c0a09 1px)`,
            backgroundSize: '32px 32px',
            backgroundPosition: '0 0, 16px 16px'
          }}
        />

        {/* Vietnamese Street & Canal Waterway Vector Accents */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30 stroke-amber-500/40">
          <path d="M 0,280 Q 250,230 450,290 T 900,240 T 1400,280" fill="none" strokeWidth="18" strokeLinecap="round" className="stroke-teal-900/40" />
          <path d="M 120,0 Q 280,300 480,500" fill="none" strokeWidth="4" strokeDasharray="6,6" />
          <path d="M 300,50 Q 550,220 800,450" fill="none" strokeWidth="4" strokeDasharray="6,6" />
          <path d="M 600,0 Q 750,200 950,540" fill="none" strokeWidth="4" strokeDasharray="6,6" />
        </svg>

        {/* Center Target Indicator */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center opacity-30">
          <Compass className="w-12 h-12 text-amber-500 animate-spin-slow" />
          <span className="text-3xs font-mono text-amber-400 mt-1 uppercase tracking-widest">
            {lang === 'vi' ? CITY_CENTERS[selectedCity].nameVI : CITY_CENTERS[selectedCity].nameEN}
          </span>
        </div>

        {/* Markers for Each Vendor */}
        {displayVendors.map((vendor) => {
          const isSelected = selectedVendor?.id === vendor.id;
          const pos = getMapPosition(vendor);

          return (
            <div
              key={vendor.id}
              style={{ top: pos.top, left: pos.left }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10 transition-transform duration-300"
            >
              {/* Pulsing ring for selected vendor */}
              {isSelected && (
                <div className="absolute -inset-3 rounded-full bg-amber-400/30 animate-ping" />
              )}

              {/* Interactive Pin Button */}
              <button
                type="button"
                onClick={() => onSelectVendor(vendor)}
                className={`group relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-full shadow-lg transition-all transform hover:scale-110 active:scale-95 ${
                  isSelected
                    ? 'bg-amber-500 text-stone-950 font-bold ring-4 ring-amber-300/40 scale-110 z-30'
                    : 'bg-stone-900/90 hover:bg-stone-800 text-amber-300 border border-amber-500/50 backdrop-blur-md'
                }`}
              >
                {/* Conical hat / street food icon */}
                <span className="text-sm">🥢</span>
                
                {/* Vendor label */}
                <span className="text-xs tracking-tight max-w-[130px] truncate text-left">
                  {vendor.ownerName} ({vendor.ownerAge}t)
                </span>

                {/* Open now dot */}
                <span 
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    vendor.isOpenNow ? 'bg-emerald-400 ring-2 ring-emerald-900' : 'bg-stone-500'
                  }`} 
                />
              </button>
            </div>
          );
        })}

        {/* Selected Vendor Floating Card overlay */}
        {selectedVendor && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-30 bg-stone-900/95 backdrop-blur-md border border-amber-500/40 rounded-2xl p-4 shadow-2xl text-white animate-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-2xs text-amber-400 font-medium mb-0.5">
                  <span>{selectedVendor.ownerName}</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedVendor.ownerAge} {t.ageLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedVendor.yearsTrading} {t.yearsTrading}</span>
                </div>
                <h4 className="font-bold text-sm text-stone-100 truncate">
                  {lang === 'vi' ? selectedVendor.nameVI : selectedVendor.nameEN}
                </h4>
              </div>
              {selectedVendor.verified && (
                <span className="shrink-0 text-2xs text-emerald-400 flex items-center gap-1 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{lang === 'vi' ? 'Xác minh' : 'Verified'}</span>
                </span>
              )}
            </div>

            <p className="text-xs text-stone-300 line-clamp-2 mb-3">
              {lang === 'vi' ? selectedVendor.addressVI : selectedVendor.addressEN}
              <span className="text-amber-300/80 italic ml-1">
                ({lang === 'vi' ? selectedVendor.landmarkVI : selectedVendor.landmarkEN})
              </span>
            </p>

            <div className="flex items-center justify-between text-xs text-stone-400 mb-3 border-t border-stone-800 pt-2">
              <span>{t.priceEstimate}: <strong className="text-amber-400">{selectedVendor.priceRangeVND}</strong></span>
              <span>{lang === 'vi' ? selectedVendor.operatingHoursVI : selectedVendor.operatingHoursEN}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onOpenDetail(selectedVendor)}
                className="w-full py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
              >
                <span>{t.viewStory}</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenShipper(selectedVendor)}
                className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Bike className="w-3.5 h-3.5" />
                <span>{t.orderShipper}</span>
              </button>
            </div>
          </div>
        )}

        {/* Bottom Left Legend */}
        <div className="absolute bottom-3 left-3 z-20 hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-stone-950/85 backdrop-blur-md border border-stone-800 text-2xs text-stone-400">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>{t.openNow}</span>
          </div>
          <span aria-hidden="true">·</span>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>{lang === 'vi' ? 'Đang chọn' : 'Selected'}</span>
          </div>
          <span aria-hidden="true">·</span>
          <div className="flex items-center gap-1">
            <Bike className="w-3 h-3 text-teal-400" />
            <span>{lang === 'vi' ? 'Hỗ trợ Grab & Xanh SM' : 'Grab & Green SM Ready'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
