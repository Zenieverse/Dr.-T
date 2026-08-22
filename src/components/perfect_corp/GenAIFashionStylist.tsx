import React, { useState } from 'react';
import { 
  Sparkles, Wand2, Shirt, Layers, Palette, RefreshCw, ShoppingBag, 
  Check, Compass, Heart, Share2, Award, Zap, Sliders
} from 'lucide-react';
import { FashionOutfitConcept, RetailProduct } from './types';
import { FASHION_CONCEPTS, RETAIL_PRODUCTS } from './data';

interface GenAIFashionStylistProps {
  onAddToCart: (product: RetailProduct) => void;
}

export const GenAIFashionStylist: React.FC<GenAIFashionStylistProps> = ({ onAddToCart }) => {
  const [concepts, setConcepts] = useState<FashionOutfitConcept[]>(FASHION_CONCEPTS);
  const [activeConcept, setActiveConcept] = useState<FashionOutfitConcept>(FASHION_CONCEPTS[0]);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [selectedSilhouette, setSelectedSilhouette] = useState<'tailored' | 'relaxed' | 'avant-garde' | 'minimalist' | 'athletic'>('tailored');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('Gala & Executive Dinner');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [drapeSpeed, setDrapeSpeed] = useState<number>(60);
  const [isSimulatingDrape, setIsSimulatingDrape] = useState<boolean>(true);

  // Generate GenAI Fashion Lookbook concept via Perfect Corp GenAI API
  const handleGenerateFashion = async () => {
    if (!customPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/perfect-corp/genai-fashion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: customPrompt,
          silhouette: selectedSilhouette,
          occasion: selectedOccasion
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.concept) {
          setConcepts([data.concept, ...concepts]);
          setActiveConcept(data.concept);
        }
      }
    } catch (err) {
      console.warn("GenAI fashion fallback:", err);
      // Create rich instant concept
      const fallbackConcept: FashionOutfitConcept = {
        id: `outfit-${Date.now()}`,
        title: `Haute GenAI Concept: ${customPrompt.slice(0, 30)}...`,
        aesthetic: 'Bespoke Haute Couture',
        occasion: selectedOccasion,
        prompt: customPrompt,
        colorPalette: ['#2C3E50', '#E74C3C', '#ECF0F1', '#34495E', '#F39C12'],
        fabrication: {
          top: 'Organic bamboo silk structured corset',
          outerwear: 'Laser-cut architectural wool-cashmere cape',
          bottom: 'Pleated wide-leg fluid trousers in regenerative tencel',
          accessories: '18k recycled gold choker and YouCam titanium shades'
        },
        silhouetteType: selectedSilhouette,
        sustainabilityRating: 'A+',
        estimatedRetailValue: 1420,
        drapePhysics: 'Dynamic multi-layered cloth collision with wind simulation',
        matchingProducts: []
      };
      setConcepts([fallbackConcept, ...concepts]);
      setActiveConcept(fallbackConcept);
    } finally {
      setIsGenerating(false);
      setCustomPrompt('');
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Top GenAI Prompt Creator Bar */}
      <div className="bg-gradient-to-r from-stone-900 via-purple-950 to-stone-900 text-stone-100 p-6 rounded-3xl border border-stone-800 shadow-xl flex flex-col gap-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-rose-500 flex items-center justify-center text-white shadow-md shrink-0">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                Perfect Corp GenAI Fashion Stylist & Virtual Dressing Room
              </h3>
              <p className="text-xs text-purple-200/80">
                Natural language text-to-outfit generation • Fabric drape simulation • Chromatic undertone pairing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {['tailored', 'relaxed', 'avant-garde', 'minimalist', 'athletic'].map((sil) => (
              <button
                key={sil}
                onClick={() => setSelectedSilhouette(sil as any)}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold capitalize transition-all cursor-pointer ${
                  selectedSilhouette === sil 
                    ? 'bg-purple-500 text-white font-black shadow-xs' 
                    : 'bg-stone-800/80 text-stone-400 hover:text-white'
                }`}
              >
                {sil}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt Input Field */}
        <div className="flex items-center gap-2 bg-stone-950/80 p-2 rounded-2xl border border-stone-700/70 focus-within:border-purple-400 transition-all">
          <input 
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerateFashion()}
            placeholder="Describe an outfit or vibe: e.g., 'Met Gala botanical gown in liquid emerald satin with sculptural sleeves'..."
            className="flex-1 bg-transparent px-3 py-2 text-xs font-medium text-white placeholder-stone-500 focus:outline-none"
          />
          <button
            onClick={handleGenerateFashion}
            disabled={isGenerating || !customPrompt.trim()}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-rose-500 text-white text-xs font-black flex items-center gap-2 hover:brightness-110 transition-all cursor-pointer disabled:opacity-50 shrink-0 shadow-md"
            id="btn-genai-fashion"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Synthesizing Look...' : 'Generate 3D Look'}</span>
          </button>
        </div>
      </div>

      {/* Main Workspace (Concept Gallery & 3D Dressing Stage) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT (7 cols): Active Outfit Concept Deep Dive */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col gap-5">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                  {activeConcept.aesthetic}
                </span>
                <h4 className="text-lg font-black text-stone-900 mt-1.5 tracking-tight">{activeConcept.title}</h4>
                <p className="text-xs text-stone-500 font-medium">Occasion: <strong className="text-stone-800">{activeConcept.occasion}</strong></p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-mono text-stone-400">Total Ensemble:</span>
                <p className="text-lg font-black text-stone-900">${activeConcept.estimatedRetailValue}</p>
              </div>
            </div>

            {/* Prompt Quote */}
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/70 text-xs italic text-stone-700 leading-relaxed">
              "{activeConcept.prompt}"
            </div>

            {/* Color Palette Harmonization Bar */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono text-stone-400 uppercase font-black">Harmonized Chromatic Palette:</span>
              <div className="flex items-center gap-2">
                {activeConcept.colorPalette.map((hex, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div 
                      className="w-full h-8 rounded-xl border border-stone-200 shadow-2xs transition-transform hover:scale-105" 
                      style={{ backgroundColor: hex }} 
                    />
                    <span className="text-[9px] font-mono text-stone-500">{hex}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Breakdown of Fabrication & Garment Layers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col gap-1">
                <span className="text-[10px] font-mono uppercase text-purple-700 font-extrabold flex items-center gap-1">
                  <Shirt className="w-3.5 h-3.5" /> Core Bodice & Top
                </span>
                <p className="text-xs font-bold text-stone-800">{activeConcept.fabrication.top}</p>
              </div>

              {activeConcept.fabrication.outerwear && (
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col gap-1">
                  <span className="text-[10px] font-mono uppercase text-purple-700 font-extrabold flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5" /> Outerwear & Layering
                  </span>
                  <p className="text-xs font-bold text-stone-800">{activeConcept.fabrication.outerwear}</p>
                </div>
              )}

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col gap-1">
                <span className="text-[10px] font-mono uppercase text-purple-700 font-extrabold flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5" /> Trousers & Skirt
                </span>
                <p className="text-xs font-bold text-stone-800">{activeConcept.fabrication.bottom}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col gap-1">
                <span className="text-[10px] font-mono uppercase text-purple-700 font-extrabold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Curated Accessories
                </span>
                <p className="text-xs font-bold text-stone-800">{activeConcept.fabrication.accessories}</p>
              </div>
            </div>

            {/* Cloth Physics & Sustainability Rating */}
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between gap-3 text-xs text-emerald-950">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Sustainability Score: <strong>Rating {activeConcept.sustainabilityRating}</strong> (Regenerative Bio-Fibers)</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 font-bold hidden sm:inline">ZERO-WASTE VIRTUAL SAMPLING</span>
            </div>

            {/* Add Complete Outfit to Smart Retail Cart */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => onAddToCart(RETAIL_PRODUCTS[5])}
                className="px-5 py-3 rounded-2xl bg-stone-900 text-white font-black text-xs hover:bg-stone-800 transition-all flex items-center gap-2 shadow-md cursor-pointer"
                id="btn-add-fashion-to-cart"
              >
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span>Add Tailored Blazer to Cart ($520)</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT (5 cols): 3D Mannequin & Presets Library */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Virtual Mannequin Silhouette Card */}
          <div className="bg-stone-950 p-5 rounded-3xl border border-stone-800 shadow-xl text-stone-100 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h4 className="text-xs font-extrabold uppercase tracking-wide">3D Cloth Drape Simulator</h4>
              </div>
              <button
                onClick={() => setIsSimulatingDrape(!isSimulatingDrape)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all ${
                  isSimulatingDrape ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'bg-stone-800 text-stone-400'
                }`}
              >
                {isSimulatingDrape ? 'PHYSICS ACTIVE' : 'PAUSED'}
              </button>
            </div>

            {/* Mannequin Graphic Stage */}
            <div className="relative aspect-square w-full bg-stone-900 rounded-2xl overflow-hidden border border-stone-800 flex items-center justify-center p-6">
              <svg viewBox="0 0 200 300" className="w-full h-full max-h-64">
                {/* Silhouette Head & Shoulders */}
                <circle cx="100" cy="40" r="18" fill="#555" />
                <path d="M 85 60 L 115 60 L 140 85 L 140 140 L 60 140 L 60 85 Z" fill={activeConcept.colorPalette[0] || '#777'} />
                
                {/* Dynamic Draped Outerwear Overlays */}
                <path 
                  d={isSimulatingDrape ? "M 55 85 Q 100 110 145 85 L 155 190 Q 100 210 45 190 Z" : "M 55 85 L 145 85 L 155 190 L 45 190 Z"} 
                  fill={activeConcept.colorPalette[1] || '#999'} 
                  opacity="0.85"
                  className={isSimulatingDrape ? "animate-pulse" : ""}
                />

                {/* Trousers */}
                <path d="M 65 190 L 135 190 L 140 280 L 110 280 L 100 210 L 90 280 L 60 280 Z" fill={activeConcept.colorPalette[2] || '#444'} />
              </svg>

              <div className="absolute bottom-3 left-3 right-3 bg-stone-950/80 backdrop-blur-md p-2 rounded-xl border border-stone-800 text-[10px] text-stone-300 text-center font-mono">
                {activeConcept.drapePhysics}
              </div>
            </div>

            {/* Drape Speed Slider */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-stone-400 uppercase">Wind / Aerodynamics:</span>
              <input 
                type="range" 
                min="10" 
                max="100" 
                value={drapeSpeed} 
                onChange={(e) => setDrapeSpeed(Number(e.target.value))}
                className="flex-1 accent-purple-500 cursor-pointer h-1.5 bg-stone-800 rounded-lg"
              />
              <span className="text-[10px] font-mono text-purple-400 font-bold">{drapeSpeed} km/h</span>
            </div>
          </div>

          {/* Concepts Library Gallery */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm flex flex-col gap-3">
            <h4 className="text-xs font-extrabold text-stone-900 uppercase tracking-wide">Saved & Trending Ensembles</h4>

            <div className="flex flex-col gap-2">
              {concepts.map((concept) => (
                <div
                  key={concept.id}
                  onClick={() => setActiveConcept(concept)}
                  className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    activeConcept.id === concept.id 
                      ? 'border-purple-500 bg-purple-50/70 shadow-xs ring-2 ring-purple-400/30' 
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div>
                    <h5 className="text-xs font-extrabold text-stone-900">{concept.title}</h5>
                    <p className="text-[10px] text-stone-500">{concept.aesthetic} • ${concept.estimatedRetailValue}</p>
                  </div>

                  <div className="flex items-center gap-1">
                    {concept.colorPalette.slice(0, 3).map((c, idx) => (
                      <span key={idx} className="w-3.5 h-3.5 rounded-full border border-white shadow-2xs" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
