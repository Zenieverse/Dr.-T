// ============================================================================
// 🌌 GREENIEVERSE - GALACTIC EXPANSION & MULTI-PLANETARY ROADMAP
// Multi-planetary colonies, environmental constraints, and resource conversion
// ============================================================================

import React from 'react';
import { 
  Globe, 
  Orbit, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  Droplets, 
  Sun, 
  Zap, 
  Coins, 
  ArrowRight 
} from 'lucide-react';

interface PlanetCard {
  id: string;
  name: string;
  type: string;
  status: 'ESTABLISHED' | 'TERRAFORMING' | 'LOCKED';
  atmosphere: string;
  solarFlux: string;
  soilType: string;
  primaryCrop: string;
  unlockNetWorth: number;
  bonus: string;
}

export const GalacticExpansionView: React.FC = () => {
  const planets: PlanetCard[] = [
    {
      id: 'earth-prime',
      name: 'Earth Prime (Sol III)',
      type: 'Terrestrial Bio-Hub',
      status: 'ESTABLISHED',
      atmosphere: 'Nitrogen-Oxygen (1.0 atm)',
      solarFlux: '100% Nominal (1361 W/m²)',
      soilType: 'Rich Organic Loam',
      primaryCrop: 'Galactic Wheat & Strawberries',
      unlockNetWorth: 0,
      bonus: '+15% Base Crop Yield Speed',
    },
    {
      id: 'mars-outpost',
      name: 'Ares Deep (Mars IV)',
      type: 'Subterranean Hydro-Farm',
      status: 'TERRAFORMING',
      atmosphere: 'CO2 Pressurized Dome (0.6 atm)',
      solarFlux: '43% Solar (UV Filtered)',
      soilType: 'Iron Regolith (Enriched)',
      primaryCrop: 'Cosmic Carrots & Tubers',
      unlockNetWorth: 3043.5,
      bonus: '+30% Mineral & Fertilizer Efficiency',
    },
    {
      id: 'nova-station',
      name: 'Nova Station (Orbital)',
      type: 'Zero-G Aeroponic Ring',
      status: 'LOCKED',
      atmosphere: 'Artificial Closed Biosphere',
      solarFlux: '140% Unfiltered Solar',
      soilType: 'Zero-Soil Aeroponic Mist',
      primaryCrop: 'Supernova Melons',
      unlockNetWorth: 7500,
      bonus: '+50% Growth Cycle Compression',
    },
    {
      id: 'verdant-prime',
      name: 'Verdant Prime (Alpha Centauri)',
      type: 'Super-Habitable Exoplanet',
      status: 'LOCKED',
      atmosphere: 'Dense Oxygen-Argon',
      solarFlux: 'Binary Star Perpetual Day',
      soilType: 'Hyper-Nutrient Bio-Gel',
      primaryCrop: 'All Galactic Varieties',
      unlockNetWorth: 15000,
      bonus: 'Zero Water Depletion Rate',
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Galactic Roadmap */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-950 border border-teal-500/40 shadow-2xl backdrop-blur-xl flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-700 flex items-center justify-center shadow-lg shadow-teal-900/30 ring-2 ring-teal-400/40">
            <Orbit className="w-7 h-7 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-black text-white font-mono">Galactic Agricultural Colonies</h3>
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-teal-950 text-teal-300 border border-teal-500/40">
                MULTI-PLANETARY EXPANSION
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Autonomous biosphere colonies governed by Greenieverse Intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Planetary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {planets.map(p => (
          <div
            key={p.id}
            className={`p-5 rounded-3xl border transition flex flex-col justify-between space-y-4 ${
              p.status === 'ESTABLISHED'
                ? 'bg-slate-950 border-emerald-500/50 shadow-lg shadow-emerald-950/20'
                : p.status === 'TERRAFORMING'
                ? 'bg-slate-950 border-cyan-500/50 shadow-lg shadow-cyan-950/20'
                : 'bg-slate-950/60 border-slate-800 opacity-70'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-white truncate">{p.name}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    p.status === 'ESTABLISHED'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                      : p.status === 'TERRAFORMING'
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {p.status}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 font-sans mb-3">{p.type}</p>

              <div className="space-y-1.5 text-[11px] font-mono bg-slate-900/70 p-3 rounded-xl border border-slate-800">
                <div className="text-slate-400">Atmosphere: <span className="text-slate-200">{p.atmosphere}</span></div>
                <div className="text-slate-400">Solar: <span className="text-slate-200">{p.solarFlux}</span></div>
                <div className="text-slate-400">Soil: <span className="text-slate-200">{p.soilType}</span></div>
                <div className="text-slate-400">Main Crop: <span className="text-emerald-400">{p.primaryCrop}</span></div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 text-[11px] font-mono flex items-center justify-between">
              <span className="text-slate-400">Colony Perk:</span>
              <span className="text-cyan-300 font-bold">{p.bonus}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Galactic Resource Ecosystem Loop */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h4 className="text-sm font-bold text-white font-mono">Galactic Closed-Loop Resource Ecosystem</h4>
          <span className="text-xs font-mono text-emerald-400">THERMODYNAMIC BALANCE</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs font-mono text-center">
          {[
            { icon: '☀️', name: 'Solar Flux', desc: 'Photosynthesis Driver' },
            { icon: '💧', name: 'Aqua Hydrate', desc: 'Moisture Retention' },
            { icon: '🌱', name: 'Bio-Soil', desc: 'Nutrient Matrix' },
            { icon: '⚡', name: 'Fusion Power', desc: 'Drone Automation' },
            { icon: '🌾', name: 'Crop Yield', desc: 'Biomass Harvest' },
            { icon: '🏛️', name: 'Town Demand', desc: 'Market Arbitrage' },
            { icon: '🪙', name: 'Sol Credits', desc: 'Colonial Reinvestment' },
          ].map((res, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center">
              <span className="text-2xl mb-1">{res.icon}</span>
              <span className="font-bold text-white">{res.name}</span>
              <span className="text-[10px] text-slate-400 mt-0.5">{res.desc}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
