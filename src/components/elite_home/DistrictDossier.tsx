import React, { useState } from 'react';
import { MASTERPLAN_DISTRICTS, MasterplanDistrict } from './eliteHomeData';
import { 
  Building, 
  Sparkles, 
  MapPin, 
  Heart, 
  Users, 
  Wind, 
  ChevronRight, 
  Compass, 
  Layers, 
  ShieldCheck, 
  Activity, 
  CheckCircle,
  Eye
} from 'lucide-react';

interface DistrictDossierProps {
  selectedDistrict: MasterplanDistrict;
  onSelectDistrict: (district: MasterplanDistrict) => void;
}

export const DistrictDossier: React.FC<DistrictDossierProps> = ({
  selectedDistrict,
  onSelectDistrict
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Sectors' },
    { id: 'central', label: 'Central Plaza' },
    { id: 'residential', label: 'Residential Neighborhoods' },
    { id: 'longevity', label: 'Longevity & Health' },
    { id: 'education', label: 'Education & Wisdom' },
    { id: 'food', label: 'Living Harvest' },
    { id: 'sports', label: 'Active Living' },
    { id: 'spiritual', label: 'Spiritual Sanctuary' },
    { id: 'transit', label: 'Clean Mobility' }
  ];

  const filteredDistricts = activeCategory === 'all' 
    ? MASTERPLAN_DISTRICTS 
    : MASTERPLAN_DISTRICTS.filter(d => d.category === activeCategory);

  return (
    <div className="space-y-6" id="district-dossier-root">
      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border
              ${activeCategory === cat.id
                ? 'bg-rose-600 text-white border-rose-500 shadow-md'
                : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-white hover:bg-stone-800'}
            `}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid of Districts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDistricts.map((district) => {
          const isSelected = selectedDistrict.id === district.id;

          return (
            <div
              key={district.id}
              onClick={() => onSelectDistrict(district)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden group
                ${isSelected
                  ? 'bg-gradient-to-b from-stone-900 via-rose-950/60 to-stone-900 border-rose-500 shadow-xl ring-2 ring-rose-500/30'
                  : 'bg-stone-900/90 border-stone-800 hover:border-stone-700 hover:bg-stone-900'}
              `}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span 
                    className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border"
                    style={{ 
                      backgroundColor: `${district.color}20`,
                      borderColor: `${district.color}60`,
                      color: district.color 
                    }}
                  >
                    {district.category}
                  </span>
                  <span className="text-[10px] font-mono text-stone-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-stone-500" /> Sector ID: {district.id}
                  </span>
                </div>

                <h3 className="text-base font-black text-white font-sans group-hover:text-rose-400 transition-colors">
                  {district.name}
                </h3>
                <p className="text-xs text-rose-300/80 font-mono mt-0.5 mb-2 font-medium">
                  {district.tagline}
                </p>
                <p className="text-xs text-stone-300 leading-relaxed line-clamp-3 mb-4">
                  {district.description}
                </p>

                {/* Key Features List */}
                <div className="space-y-1.5 mb-4">
                  {district.features.slice(0, 3).map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-[11px] text-stone-300">
                      <CheckCircle className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" />
                      <span className="line-clamp-1">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Metric */}
              <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between text-[10px] font-mono">
                <span className="text-emerald-400 font-bold truncate max-w-[70%]">
                  {district.longevityImpact}
                </span>
                <span className="text-rose-400 font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                  Inspect 3D <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected District Expanded Masterplan Dossier */}
      {selectedDistrict && (
        <div className="mt-8 bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 border border-stone-800 rounded-3xl p-6 text-white shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span 
                  className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border"
                  style={{ 
                    backgroundColor: `${selectedDistrict.color}20`,
                    borderColor: `${selectedDistrict.color}60`,
                    color: selectedDistrict.color 
                  }}
                >
                  {selectedDistrict.category} Sector
                </span>
                <span className="text-xs font-mono text-stone-400">Architectural Specifications Dossier</span>
              </div>
              <h2 className="text-2xl font-black text-white font-sans">{selectedDistrict.name}</h2>
              <p className="text-xs text-rose-300 font-mono mt-0.5">{selectedDistrict.tagline}</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-stone-950 p-3 rounded-2xl border border-stone-800 text-right">
                <span className="text-[9px] font-mono text-stone-400 uppercase font-bold block">Capacity & Scale</span>
                <span className="text-xs font-black text-amber-400">{selectedDistrict.capacity}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-stone-950/80 p-4 rounded-2xl border border-stone-800">
              <span className="text-[10px] font-mono text-stone-400 uppercase font-bold block mb-1">Architectural Style</span>
              <p className="text-xs text-stone-200 leading-relaxed">{selectedDistrict.architecturalStyle}</p>
            </div>

            <div className="bg-stone-950/80 p-4 rounded-2xl border border-stone-800">
              <span className="text-[10px] font-mono text-stone-400 uppercase font-bold block mb-1">Target Resident Archetype</span>
              <p className="text-xs text-stone-200 leading-relaxed">{selectedDistrict.residentArchetype}</p>
            </div>

            <div className="bg-stone-950/80 p-4 rounded-2xl border border-stone-800">
              <span className="text-[10px] font-mono text-stone-400 uppercase font-bold block mb-1">Longevity & Biological Impact</span>
              <p className="text-xs text-emerald-400 font-bold leading-relaxed">{selectedDistrict.longevityImpact}</p>
            </div>
          </div>

          {/* Key Architectural Highlights */}
          <div>
            <h4 className="text-xs font-bold font-sans uppercase tracking-wider text-stone-300 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" /> Architectural Highlights & Engineering Innovations
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {selectedDistrict.keyHighlights.map((hl, idx) => (
                <div key={idx} className="bg-stone-950 p-3.5 rounded-2xl border border-stone-800/80">
                  <h5 className="text-xs font-bold text-rose-300 mb-1">{hl.title}</h5>
                  <p className="text-[11px] text-stone-400 leading-relaxed">{hl.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sustainable Materials */}
          <div className="pt-4 border-t border-stone-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono text-stone-400 uppercase font-bold block mb-1">Certified Materials & Zero-Carbon Elements:</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedDistrict.materials.map((mat, idx) => (
                  <span key={idx} className="text-[10px] font-mono bg-stone-800 text-stone-300 px-2.5 py-0.5 rounded-full border border-stone-700">
                    {mat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
