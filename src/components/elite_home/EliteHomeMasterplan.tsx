import React, { useState } from 'react';
import { MASTERPLAN_DISTRICTS, ELITE_HOME_STATS, MasterplanDistrict } from './eliteHomeData';
import { EliteHomeCanvas3D } from './EliteHomeCanvas3D';
import { ChamberExplorer3D } from './ChamberExplorer3D';
import { DistrictDossier } from './DistrictDossier';
import { LongevitySimulator } from './LongevitySimulator';
import { EliteHomeConcierge } from './EliteHomeConcierge';
import { ELiteVerseMetaverse3D } from './ELiteVerseMetaverse3D';
import { 
  Sparkles, 
  Layers, 
  Bed, 
  MapPin, 
  Clock, 
  Compass, 
  Bot, 
  Image as ImageIcon, 
  Heart, 
  Globe, 
  TreePine, 
  Sun, 
  Wind, 
  Zap, 
  Award, 
  CheckCircle2,
  Maximize2,
  ChevronRight,
  Download
} from 'lucide-react';

import eliteMasterplanImg from '../../assets/images/elite_home_masterplan_1786694813149.jpg';
import eliteLuxChamberImg from '../../assets/images/elite_lux_chamber_1786694826069.jpg';
import eliteHeartImg from '../../assets/images/elite_heart_plaza_1786694836765.jpg';
import eliteLongevityImg from '../../assets/images/elite_longevity_sanctuary_1786694849057.jpg';

export const EliteHomeMasterplan: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'eliteverse' | '3d' | 'chambers' | 'districts' | 'longevity' | 'gallery' | 'concierge'>('eliteverse');
  const [selectedDistrict, setSelectedDistrict] = useState<MasterplanDistrict>(MASTERPLAN_DISTRICTS[0]);
  const [timeOfDay, setTimeOfDay] = useState<'golden-hour' | 'day' | 'sunset' | 'night'>('golden-hour');
  const [lightboxImage, setLightboxImage] = useState<{ src: string; title: string; subtitle: string } | null>(null);

  const handleJumpToDistrict = (districtId: string) => {
    const found = MASTERPLAN_DISTRICTS.find(d => d.id === districtId);
    if (found) {
      setSelectedDistrict(found);
      setActiveSubTab('3d');
    }
  };

  const galleryImages = [
    {
      src: eliteMasterplanImg,
      title: 'eLite Home 500-Acre Masterplan Aerial View',
      subtitle: 'Biophilic curved architecture nestled between misty peaks, crystal lakes, waterfalls, and ocean horizons at Golden Hour.'
    },
    {
      src: eliteHeartImg,
      title: 'The Heart of Life Central Plaza',
      subtitle: 'The 60-meter illuminated Tree of Life canopy with stepped reflection pools, open-air cafes, and vibrant global community life.'
    },
    {
      src: eliteLuxChamberImg,
      title: 'Serenity Forest Luxury Canopy Villa',
      subtitle: 'Suspended cedar treehouse suite with floor-to-ceiling curved glass, private geothermal onsen, and tranquil waterfall views.'
    },
    {
      src: eliteLongevityImg,
      title: 'Longevity & Regenerative Health Sanctuary',
      subtitle: 'Six-star wellness institute designed as a Japanese-Nordic ryokan with floating mineral hydrotherapy pools and bamboo gardens.'
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-8 select-none font-sans" id="elite-home-masterplan-main">
      {/* Hero Masterplan Header */}
      <div className="relative rounded-3xl overflow-hidden border border-rose-900/40 bg-gradient-to-br from-stone-950 via-stone-900 to-rose-950/80 p-6 md:p-8 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-gradient-to-r from-rose-500 to-amber-500 text-white px-3 py-0.5 rounded-full shadow-sm">
                Next-Gen Human Habitat
              </span>
              <span className="text-[10px] font-mono text-amber-300 font-bold bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded">
                500-Acre Regenerative Civilization
              </span>
              <span className="text-[10px] font-mono text-emerald-300 font-bold bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded">
                Carbon Negative (-14,200 T/Yr)
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-sans tracking-tight text-white leading-tight">
              eLite Home
            </h1>

            <p className="text-base sm:text-lg font-medium text-rose-200/90 leading-snug">
              A Regenerative Luxury Wellness Civilization for Retirement, Longevity, Learning, and Human Connection
            </p>

            <p className="text-xs sm:text-sm text-stone-300 max-w-3xl leading-relaxed">
              Where retired people from every nation, culture, profession, and personality type gather to experience the finest years of their lives. A fusion of a UNESCO eco-village, six-star longevity sanctuary, luxury university campus, and dream home embraced by nature.
            </p>
          </div>

          {/* Emotional Statement Pill */}
          <div className="bg-stone-950/90 border border-rose-500/30 p-5 rounded-3xl text-left max-w-sm lg:w-80 shrink-0 shadow-xl space-y-2">
            <div className="flex items-center gap-2 text-rose-400">
              <Heart className="w-4 h-4 fill-rose-400" />
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider">The eLite Creed</span>
            </div>
            <p className="text-xs text-stone-200 italic leading-relaxed">
              &ldquo;This is not retirement. This is not a nursing home or hospital. This is life&apos;s greatest, most purposeful chapter.&rdquo;
            </p>
            <div className="pt-2 border-t border-stone-800 text-[10px] font-mono text-emerald-400 font-bold flex items-center justify-between">
              <span>94 Global Nationalities</span>
              <span>100% Clean Energy</span>
            </div>
          </div>
        </div>

        {/* Global Masterplan Stats Bar */}
        <div className="mt-8 pt-6 border-t border-stone-800/80 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
          <div className="bg-stone-950/60 p-3 rounded-2xl border border-stone-800">
            <span className="text-[9px] font-mono text-stone-400 uppercase font-bold block">Sanctuary Scale</span>
            <span className="text-sm font-black text-amber-400 font-mono">{ELITE_HOME_STATS.totalAcres} Acres</span>
          </div>

          <div className="bg-stone-950/60 p-3 rounded-2xl border border-stone-800">
            <span className="text-[9px] font-mono text-stone-400 uppercase font-bold block">Luxury Residences</span>
            <span className="text-sm font-black text-rose-400 font-mono">{ELITE_HOME_STATS.residentialUnits} Units</span>
          </div>

          <div className="bg-stone-950/60 p-3 rounded-2xl border border-stone-800">
            <span className="text-[9px] font-mono text-stone-400 uppercase font-bold block">Energy Autonomy</span>
            <span className="text-sm font-black text-emerald-400 font-mono">{ELITE_HOME_STATS.renewableEnergyPercent}% Solar/Hydro</span>
          </div>

          <div className="bg-stone-950/60 p-3 rounded-2xl border border-stone-800">
            <span className="text-[9px] font-mono text-stone-400 uppercase font-bold block">Biological Age Score</span>
            <span className="text-sm font-black text-teal-400 font-mono">-11.4 Yrs Avg</span>
          </div>

          <div className="bg-stone-950/60 p-3 rounded-2xl border border-stone-800">
            <span className="text-[9px] font-mono text-stone-400 uppercase font-bold block">Preserved Wilderness</span>
            <span className="text-sm font-black text-lime-400 font-mono">{ELITE_HOME_STATS.preservedWildernessPercent}% Natural</span>
          </div>

          <div className="bg-stone-950/60 p-3 rounded-2xl border border-stone-800">
            <span className="text-[9px] font-mono text-stone-400 uppercase font-bold block">Clean Autonomous Pods</span>
            <span className="text-sm font-black text-sky-400 font-mono">{ELITE_HOME_STATS.electricPodsFleet} Fleet</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-stone-900 border border-stone-800 rounded-2xl overflow-x-auto scrollbar-none shadow-lg">
        <button
          onClick={() => setActiveSubTab('eliteverse')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap
            ${activeSubTab === 'eliteverse' ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white shadow-lg ring-2 ring-purple-400/40' : 'text-purple-300 bg-purple-950/40 hover:bg-purple-900/60 border border-purple-800/40'}
          `}
          id="subtab-eliteverse"
        >
          <Globe className="w-4 h-4 text-amber-300 animate-spin-slow" /> 
          <span className="font-black tracking-tight">eLiteVerse (3D Inside-Out)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('3d')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap
            ${activeSubTab === '3d' ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md' : 'text-stone-400 hover:text-white'}
          `}
          id="subtab-3d-masterplan"
        >
          <Compass className="w-4 h-4" /> <span>3D Interactive Masterplan</span>
        </button>

        <button
          onClick={() => setActiveSubTab('chambers')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap
            ${activeSubTab === 'chambers' ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md' : 'text-stone-400 hover:text-white'}
          `}
          id="subtab-chambers"
        >
          <Bed className="w-4 h-4" /> <span>Luxury Chambers (3D Suites)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('districts')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap
            ${activeSubTab === 'districts' ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md' : 'text-stone-400 hover:text-white'}
          `}
          id="subtab-districts"
        >
          <Layers className="w-4 h-4" /> <span>12 Masterplan Sectors</span>
        </button>

        <button
          onClick={() => setActiveSubTab('longevity')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap
            ${activeSubTab === 'longevity' ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md' : 'text-stone-400 hover:text-white'}
          `}
          id="subtab-longevity"
        >
          <Clock className="w-4 h-4" /> <span>Longevity & Daily Life</span>
        </button>

        <button
          onClick={() => setActiveSubTab('gallery')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap
            ${activeSubTab === 'gallery' ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md' : 'text-stone-400 hover:text-white'}
          `}
          id="subtab-gallery"
        >
          <ImageIcon className="w-4 h-4" /> <span>8K Visual Gallery</span>
        </button>

        <button
          onClick={() => setActiveSubTab('concierge')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap
            ${activeSubTab === 'concierge' ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md' : 'text-stone-400 hover:text-white'}
          `}
          id="subtab-concierge"
        >
          <Bot className="w-4 h-4" /> <span>AI Concierge & Matchmaker</span>
        </button>
      </div>

      {/* Main SubTab Content Area */}
      <div>
        {/* SUBTAB 0: eLiteVerse METAVERSE 3D (Inside-Out) */}
        {activeSubTab === 'eliteverse' && (
          <div className="animate-fadeIn">
            <ELiteVerseMetaverse3D />
          </div>
        )}

        {/* SUBTAB 1: 3D MASTERPLAN CANVAS */}
        {activeSubTab === '3d' && (
          <div className="space-y-6 animate-fadeIn">
            <EliteHomeCanvas3D
              selectedDistrict={selectedDistrict}
              onSelectDistrict={(district) => setSelectedDistrict(district)}
              timeOfDay={timeOfDay}
              setTimeOfDay={setTimeOfDay}
            />

            {/* Quick Sector Details Card below canvas */}
            <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
              <div className="space-y-1 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span 
                    className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border"
                    style={{ 
                      backgroundColor: `${selectedDistrict.color}20`,
                      borderColor: `${selectedDistrict.color}60`,
                      color: selectedDistrict.color 
                    }}
                  >
                    Active 3D Focus
                  </span>
                  <h3 className="text-xl font-black text-white">{selectedDistrict.name}</h3>
                </div>
                <p className="text-xs text-rose-300 font-mono font-medium">{selectedDistrict.tagline}</p>
                <p className="text-xs text-stone-300 leading-relaxed mt-1">{selectedDistrict.description}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => setActiveSubTab('districts')}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-bold text-white transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Layers className="w-3.5 h-3.5" /> Sector Dossier
                </button>
                <button
                  onClick={() => setActiveSubTab('chambers')}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
                >
                  <Bed className="w-3.5 h-3.5" /> Luxury Chambers
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 2: LUXURY CHAMBERS 3D */}
        {activeSubTab === 'chambers' && (
          <div className="animate-fadeIn">
            <ChamberExplorer3D />
          </div>
        )}

        {/* SUBTAB 3: 12 MASTERPLAN SECTORS */}
        {activeSubTab === 'districts' && (
          <div className="animate-fadeIn">
            <DistrictDossier
              selectedDistrict={selectedDistrict}
              onSelectDistrict={(d) => {
                setSelectedDistrict(d);
                setActiveSubTab('3d');
              }}
            />
          </div>
        )}

        {/* SUBTAB 4: LONGEVITY & DAILY LIFE */}
        {activeSubTab === 'longevity' && (
          <div className="animate-fadeIn">
            <LongevitySimulator />
          </div>
        )}

        {/* SUBTAB 5: 8K ARCHITECTURAL GALLERY */}
        {activeSubTab === 'gallery' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-gradient-to-r from-stone-900 via-rose-950/40 to-stone-900 p-6 rounded-3xl border border-rose-900/30 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase bg-rose-500/20 text-rose-300 px-2.5 py-0.5 rounded-full font-bold border border-rose-500/30">
                  Architectural Visualization Exhibition
                </span>
                <h2 className="text-2xl font-black font-sans tracking-tight mt-1">
                  eLite Home 8K Masterplan Visual Gallery
                </h2>
                <p className="text-xs text-stone-300 max-w-2xl mt-1 leading-relaxed">
                  Ultra-detailed architectural renderings showcasing biophilic master planning, living green canopies, circular plazas, and nature-integrated luxury chambers.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {galleryImages.map((img, idx) => (
                <div 
                  key={idx}
                  onClick={() => setLightboxImage(img)}
                  className="group relative rounded-3xl overflow-hidden border border-stone-800 bg-stone-950 cursor-pointer shadow-xl"
                >
                  <img 
                    src={img.src} 
                    alt={img.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent flex flex-col justify-end p-6">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[9px] font-mono uppercase bg-rose-600 text-white px-2 py-0.5 rounded font-bold">
                        Exhibit 0{idx + 1}
                      </span>
                      <Maximize2 className="w-4 h-4 text-stone-300 group-hover:text-white group-hover:scale-110 transition-transform" />
                    </div>
                    <h3 className="text-base font-black text-white font-sans">{img.title}</h3>
                    <p className="text-xs text-stone-300 mt-1 leading-relaxed line-clamp-2">{img.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Lightbox Modal */}
            {lightboxImage && (
              <div 
                onClick={() => setLightboxImage(null)}
                className="fixed inset-0 z-50 bg-stone-950/95 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out animate-fadeIn"
              >
                <div 
                  onClick={(e) => e.stopPropagation()}
                  className="max-w-5xl w-full bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl text-white"
                >
                  <img 
                    src={lightboxImage.src} 
                    alt={lightboxImage.title}
                    referrerPolicy="no-referrer"
                    className="w-full max-h-[75vh] object-contain bg-black"
                  />
                  <div className="p-6 flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold">{lightboxImage.title}</h3>
                      <p className="text-xs text-stone-300 mt-1">{lightboxImage.subtitle}</p>
                    </div>
                    <button
                      onClick={() => setLightboxImage(null)}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-500 rounded-xl text-xs font-bold text-white cursor-pointer"
                    >
                      Close View
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SUBTAB 6: AI CONCIERGE & RELOCATION ADVISOR */}
        {activeSubTab === 'concierge' && (
          <div className="animate-fadeIn">
            <EliteHomeConcierge onJumpToDistrict={handleJumpToDistrict} />
          </div>
        )}
      </div>
    </div>
  );
};
