import React, { useState, useRef } from 'react';
import { 
  SkinMetric, 
  FashionOutfit, 
  RetailROIScenario, 
  NavTab 
} from '../../types';
import { 
  Sparkles, 
  Camera, 
  Sliders, 
  Shirt, 
  TrendingUp, 
  Code, 
  ShoppingBag, 
  Eye, 
  Check, 
  Copy, 
  RefreshCw, 
  Layers, 
  Compass, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface SmAristStudioProps {
  skinMetrics: SkinMetric[];
  fashionOutfits: FashionOutfit[];
  setActiveTab: (tab: NavTab) => void;
}

const LIPSTICK_SHADES = [
  { name: 'Velvet Rose', hex: '#B85D6B' },
  { name: 'Crimson Dahlia', hex: '#8B1E2F' },
  { name: 'Coral Sunset', hex: '#E06D53' },
  { name: 'Berry Plum', hex: '#632B45' },
  { name: 'Nude Silk', hex: '#C28D75' },
];

const EYEWEAR_STYLES = [
  { name: 'None', id: 'none' },
  { name: 'Titanium Aviator', id: 'aviator' },
  { name: 'Architectural Cat-Eye', id: 'cat-eye' },
  { name: 'Minimalist Round Wire', id: 'round' },
];

export const SmAristStudio: React.FC<SmAristStudioProps> = ({
  skinMetrics,
  fashionOutfits,
  setActiveTab,
}) => {
  const [subTab, setSubTab] = useState<'vto' | 'skin' | 'age' | 'fashion' | 'roi' | 'api'>('vto');

  // VTO State
  const [selectedLipstick, setSelectedLipstick] = useState<string>(LIPSTICK_SHADES[0].hex);
  const [selectedEyewear, setSelectedEyewear] = useState<string>('none');
  const [isWebcamActive, setIsWebcamActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Skin Zone State
  const [selectedZone, setSelectedZone] = useState<SkinMetric['zone']>('Malar Cheeks');

  // Age Simulator State
  const [simulatedAgeShift, setSimulatedAgeShift] = useState<number>(0); // -5 to +20

  // Fashion State
  const [activeOutfit, setActiveOutfit] = useState<FashionOutfit>(fashionOutfits[0]);
  const [fashionPrompt, setFashionPrompt] = useState<string>("Create an elegant summer outfit for a formal garden dinner with sustainable breathable fabrics.");

  // ROI State
  const [roiParams, setRoiParams] = useState<RetailROIScenario>({
    visitorsMonthly: 50000,
    conversionRatePct: 2.4,
    avgOrderValue: 85,
    returnRatePct: 22,
    returnProcessingCost: 15,
  });

  // Calculate ROI Lift
  const currentMonthlyRevenue = roiParams.visitorsMonthly * (roiParams.conversionRatePct / 100) * roiParams.avgOrderValue;
  const projectedConversionRate = roiParams.conversionRatePct * 1.35; // +35% with AR VTO
  const projectedReturnRate = roiParams.returnRatePct * 0.72; // -28% return rate reduction
  const projectedMonthlyRevenue = roiParams.visitorsMonthly * (projectedConversionRate / 100) * roiParams.avgOrderValue;
  const currentReturnsMonthly = (roiParams.visitorsMonthly * (roiParams.conversionRatePct / 100)) * (roiParams.returnRatePct / 100);
  const projectedReturnsMonthly = (roiParams.visitorsMonthly * (projectedConversionRate / 100)) * (projectedReturnRate / 100);
  const returnSavingsMonthly = (currentReturnsMonthly - projectedReturnsMonthly) * roiParams.returnProcessingCost;
  const netMonthlyExpansion = (projectedMonthlyRevenue - currentMonthlyRevenue) + returnSavingsMonthly;

  const toggleWebcam = async () => {
    if (isWebcamActive) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(t => t.stop());
        videoRef.current.srcObject = null;
      }
      setIsWebcamActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsWebcamActive(true);
      } catch (err) {
        console.warn('Webcam permission not granted or unavailable:', err);
        setIsWebcamActive(false);
      }
    }
  };

  const filteredMetrics = skinMetrics.filter(m => m.zone === selectedZone);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-2xl bg-pink-50 text-pink-700 border border-pink-200">
              <Sparkles className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              SmArist — AI + AR Beauty, Skin & Wellness Studio
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Real-time 3D AR virtual try-on, 14-dimension spectroscopic skin diagnostics, longitudinal age simulation, and GenAI fashion atelier.
          </p>
        </div>

        {/* Subtabs */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-2xl overflow-x-auto">
          {[
            { id: 'vto', label: '3D AR Try-On', icon: <Camera className="w-3.5 h-3.5" /> },
            { id: 'skin', label: '14-Dim Skin AI', icon: <Sparkles className="w-3.5 h-3.5" /> },
            { id: 'age', label: 'Age Simulator', icon: <Sliders className="w-3.5 h-3.5" /> },
            { id: 'fashion', label: 'Fashion Atelier', icon: <Shirt className="w-3.5 h-3.5" /> },
            { id: 'roi', label: 'Retail ROI Model', icon: <TrendingUp className="w-3.5 h-3.5" /> },
            { id: 'api', label: 'SDK Console', icon: <Code className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as any)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                subTab === tab.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 1. VIRTUAL TRY-ON (VTO) */}
      {subTab === 'vto' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: AR Canvas / WebCam Stage (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-4/3 rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-xl flex items-center justify-center">
              
              {isWebcamActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover -scale-x-100"
                />
              ) : (
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80"
                  alt="Portrait Try-on model"
                  className="w-full h-full object-cover"
                />
              )}

              {/* AR Mesh Overlay & Tint Simulation */}
              <div 
                style={{ backgroundColor: selectedLipstick }}
                className="absolute w-12 h-4 rounded-full opacity-60 blur-xs bottom-[36%] left-1/2 -translate-x-1/2 pointer-events-none transition-all duration-300"
              />

              {/* Eyewear simulation layer if selected */}
              {selectedEyewear !== 'none' && (
                <div className="absolute top-[38%] left-1/2 -translate-x-1/2 w-36 h-10 border-2 border-slate-800 rounded-lg pointer-events-none shadow-lg backdrop-blur-2xs flex items-center justify-around px-2">
                  <div className="w-12 h-7 border border-slate-700 rounded-md bg-cyan-500/10" />
                  <div className="w-4 h-0.5 bg-slate-700" />
                  <div className="w-12 h-7 border border-slate-700 rounded-md bg-cyan-500/10" />
                </div>
              )}

              {/* AR Status HUD */}
              <div className="absolute top-4 left-4 flex items-center space-x-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700 text-white text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>68 3D Facial Landmarks Active</span>
              </div>

              {/* WebCam Trigger */}
              <button
                onClick={toggleWebcam}
                className="absolute bottom-4 right-4 px-4 py-2 rounded-2xl bg-white/90 hover:bg-white text-slate-900 text-xs font-bold shadow-lg transition flex items-center space-x-2"
              >
                <Camera className="w-4 h-4 text-pink-600" />
                <span>{isWebcamActive ? 'Switch to Preset Model' : 'Enable Live Camera'}</span>
              </button>
            </div>
          </div>

          {/* Right: Cosmetic Controls & Cart (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              
              {/* Lipstick Palette */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Lip Color & Finish
                  </h3>
                  <span className="text-xs font-bold text-slate-900">
                    {LIPSTICK_SHADES.find(s => s.hex === selectedLipstick)?.name}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  {LIPSTICK_SHADES.map((shade) => (
                    <button
                      key={shade.name}
                      onClick={() => setSelectedLipstick(shade.hex)}
                      style={{ backgroundColor: shade.hex }}
                      className={`w-10 h-10 rounded-2xl transition transform ${
                        selectedLipstick === shade.hex
                          ? 'ring-4 ring-pink-500/30 scale-110 shadow-md'
                          : 'hover:scale-105'
                      }`}
                      title={shade.name}
                    />
                  ))}
                </div>
              </div>

              {/* Eyewear Styles */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Designer Eyewear AR Frame
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {EYEWEAR_STYLES.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedEyewear(style.id)}
                      className={`p-3 rounded-2xl text-xs font-bold text-left border transition ${
                        selectedEyewear === style.id
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {style.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Bag Checkout Card */}
              <div className="p-4 rounded-2xl bg-pink-50/60 border border-pink-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShoppingBag className="w-4 h-4 text-pink-600" />
                    <span className="text-xs font-bold text-slate-900">SmArist Luxury Satin Lip Color</span>
                  </div>
                  <span className="text-xs font-black text-slate-900 font-mono">$38.00</span>
                </div>
                <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white text-xs font-bold shadow-md shadow-pink-500/20 transition">
                  Add to Cart (Matched Shade)
                </button>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* 2. 14-DIMENSION SKIN INTELLIGENCE */}
      {subTab === 'skin' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: Zone Selection Canvas (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Facial Zone Zonal Mapping</h3>
              <p className="text-xs text-slate-500">Select a zone to inspect localized dermal spectroscopic scores.</p>

              <div className="space-y-2">
                {(['Forehead', 'Periorbital', 'Malar Cheeks', 'Nose / T-Zone', 'Jawline'] as const).map((z) => (
                  <button
                    key={z}
                    onClick={() => setSelectedZone(z)}
                    className={`w-full p-3.5 rounded-2xl text-left border transition flex items-center justify-between ${
                      selectedZone === z
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                    }`}
                  >
                    <span className="text-xs font-bold">{z}</span>
                    <ArrowRight className={`w-4 h-4 ${selectedZone === z ? 'text-white' : 'text-slate-400'}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Detailed Zone Metrics (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900">{selectedZone} Metrics</h3>
                  <p className="text-xs text-slate-500">Spectroscopic dermal capacitance & matrix scores</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Dermal Health: Optimal
                </span>
              </div>

              <div className="space-y-4">
                {filteredMetrics.map((metric) => (
                  <div key={metric.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900">{metric.name}</h4>
                      <div className="flex items-baseline space-x-1">
                        <span className="text-base font-black text-slate-900 font-display">{metric.score}</span>
                        <span className="text-[10px] text-slate-400">/ 100 (Avg: {metric.benchmark})</span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div style={{ width: `${metric.score}%` }} className="bg-gradient-to-r from-pink-500 to-rose-500 h-full" />
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">{metric.description}</p>

                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-[11px] text-teal-900 font-medium">
                      <span className="font-bold text-teal-700">Clinical Formulation:</span> {metric.clinicalConsideration}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      )}

      {/* 3. LONGITUDINAL SKIN AGE SIMULATOR */}
      {subTab === 'age' && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-4xl mx-auto space-y-8">
          
          <div className="text-center space-y-1">
            <h3 className="text-lg font-black text-slate-900">Longitudinal Dermal Matrix & Age Simulation</h3>
            <p className="text-xs text-slate-500">Visualizing structural collagen remodeling from chronological age 34.</p>
          </div>

          {/* Center Visual Stage */}
          <div className="relative aspect-16/9 rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000&auto=format&fit=crop&q=80"
              alt="Age simulation canvas"
              className="w-full h-full object-cover transition-all duration-500"
              style={{
                filter: simulatedAgeShift > 5 ? `contrast(${100 + simulatedAgeShift * 2}%) saturate(${100 - simulatedAgeShift * 2}%)` : 'none'
              }}
            />

            <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-700 text-white space-y-0.5">
              <div className="text-xs font-mono text-slate-400">Simulated Biological Age:</div>
              <div className="text-lg font-black font-display text-pink-400">
                {34 + simulatedAgeShift} Years Old ({simulatedAgeShift >= 0 ? `+${simulatedAgeShift}` : simulatedAgeShift} yrs)
              </div>
            </div>
          </div>

          {/* Age Slider Controls */}
          <div className="space-y-4 max-w-xl mx-auto">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>-5 Years (Age 29)</span>
              <span className="text-pink-600 font-black">Present (Age 34)</span>
              <span>+20 Years (Age 54)</span>
            </div>

            <input
              type="range"
              min={-5}
              max={20}
              step={5}
              value={simulatedAgeShift}
              onChange={(e) => setSimulatedAgeShift(Number(e.target.value))}
              className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-pink-600"
            />
          </div>

          {/* Insights depending on slider */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed text-center max-w-2xl mx-auto">
            {simulatedAgeShift <= 0 ? (
              <p>Optimum hydration, rich dermal fibroblast synthesis, and high barrier lipid integrity match biological age 28.</p>
            ) : simulatedAgeShift <= 10 ? (
              <p>Simulates expected natural reduction in epidermal turnover rate by 15% and mild decrease in glycosaminoglycan matrix.</p>
            ) : (
              <p>Simulates chronic photo-damage without sunscreen vs proactive broad-spectrum SPF 50+ barrier defense.</p>
            )}
          </div>

        </div>
      )}

      {/* 4. GENAI FASHION ATELIER */}
      {subTab === 'fashion' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: Prompt & Garment breakdown (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900">GenAI Couture & Draping Prompt</h3>
                <textarea
                  rows={3}
                  value={fashionPrompt}
                  onChange={(e) => setFashionPrompt(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-pink-500"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-slate-900">{activeOutfit.title}</h4>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Sustainability Score: {activeOutfit.sustainabilityScore}/100
                  </span>
                </div>

                {/* Garment pieces */}
                <div className="space-y-2">
                  {activeOutfit.pieces.map((piece, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900">{piece.name}</span>
                        <p className="text-[10px] text-slate-500">{piece.category} • {piece.material}</p>
                      </div>
                      <span className="font-bold font-mono text-slate-900">${piece.price}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100 text-xs text-slate-800 leading-relaxed">
                  <span className="font-bold text-pink-900 block mb-1">Styling & Aesthetic Pairing:</span>
                  <p>{activeOutfit.stylingAdvice}</p>
                </div>
              </div>

            </div>
          </div>

          {/* Right: Outfit Visual Preview (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="aspect-3/4 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                <img
                  src={activeOutfit.imageUrl}
                  alt={activeOutfit.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <button className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center space-x-2">
                <ShoppingBag className="w-4 h-4" />
                <span>Shop the Complete Look ($980)</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* 5. RETAIL ROI SIMULATOR */}
      {subTab === 'roi' && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900">SmArist Enterprise Retail ROI Simulator</h3>
              <p className="text-xs text-slate-500">Interactive business case modeling conversion lift and return rate reduction.</p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold font-mono">
              Hypothetical Business Scenario
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Input Controls */}
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Store Baseline Parameters:
              </span>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-600">Monthly Unique Visitors:</span>
                    <span className="font-mono font-bold text-slate-900">{roiParams.visitorsMonthly.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min={10000}
                    max={200000}
                    step={5000}
                    value={roiParams.visitorsMonthly}
                    onChange={(e) => setRoiParams({ ...roiParams, visitorsMonthly: Number(e.target.value) })}
                    className="w-full h-2 bg-slate-200 rounded-lg accent-teal-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-600">Baseline Conversion Rate (%):</span>
                    <span className="font-mono font-bold text-slate-900">{roiParams.conversionRatePct}%</span>
                  </div>
                  <input
                    type="range"
                    min={1.0}
                    max={5.0}
                    step={0.1}
                    value={roiParams.conversionRatePct}
                    onChange={(e) => setRoiParams({ ...roiParams, conversionRatePct: Number(e.target.value) })}
                    className="w-full h-2 bg-slate-200 rounded-lg accent-teal-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-600">Average Order Value (AOV $):</span>
                    <span className="font-mono font-bold text-slate-900">${roiParams.avgOrderValue}</span>
                  </div>
                  <input
                    type="range"
                    min={40}
                    max={250}
                    step={5}
                    value={roiParams.avgOrderValue}
                    onChange={(e) => setRoiParams({ ...roiParams, avgOrderValue: Number(e.target.value) })}
                    className="w-full h-2 bg-slate-200 rounded-lg accent-teal-600"
                  />
                </div>
              </div>
            </div>

            {/* Projected Impact Cards */}
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block">
                SmArist AR + AI Impact:
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase">Monthly Net Gain</span>
                  <div className="text-xl font-black text-emerald-950 font-display">
                    +${Math.round(netMonthlyExpansion).toLocaleString()}
                  </div>
                  <span className="text-[10px] text-emerald-700">Combined lift + savings</span>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-1">
                  <span className="text-[10px] font-bold text-blue-800 uppercase">Return Reduction</span>
                  <div className="text-xl font-black text-blue-950 font-display">
                    -28.0%
                  </div>
                  <span className="text-[10px] text-blue-700">Less reverse logistics waste</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 text-white text-xs space-y-1">
                <span className="font-bold text-teal-300">Annualized Profit Expansion:</span>
                <div className="text-2xl font-black text-white font-display">
                  +${Math.round(netMonthlyExpansion * 12).toLocaleString()} / yr
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 6. SDK CONSOLE */}
      {subTab === 'api' && (
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 text-white space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 font-mono">
              SmArist REST API & Embed SDK
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Endpoint: POST /v1/smarist/spectro-skin</span>
          </div>

          <pre className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-emerald-400 text-xs font-mono overflow-x-auto leading-relaxed">
{`curl -X POST https://api.dr-t.health/v1/smarist/spectro-skin \\
  -H "Authorization: Bearer smk_live_89410x99a" \\
  -H "Content-Type: application/json" \\
  -d '{
    "faceLandmarks3D": true,
    "spectroscopyZones": ["forehead", "malar_cheeks", "periorbital"],
    "simulateAgingShift": 5
  }'`}
          </pre>
        </div>
      )}

    </div>
  );
};
