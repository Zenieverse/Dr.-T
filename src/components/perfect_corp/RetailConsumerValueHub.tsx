import React, { useState } from 'react';
import { 
  TrendingUp, DollarSign, ShoppingBag, ShieldCheck, ArrowRight, CheckCircle2, 
  Sparkles, Layers, Users, Zap, RefreshCw, BarChart3, AlertTriangle, HelpCircle, 
  Smile, Frown, Check, ArrowUpRight, Scale, Clock, HeartHandshake
} from 'lucide-react';
import { RetailProduct } from './types';

interface RetailConsumerValueHubProps {
  onAddToCart?: (product: RetailProduct) => void;
  onNavigateTab?: (tabName: any) => void;
}

export const RetailConsumerValueHub: React.FC<RetailConsumerValueHubProps> = ({ 
  onNavigateTab 
}) => {
  // Retail ROI Calculator State
  const [monthlyVisitors, setMonthlyVisitors] = useState<number>(250000);
  const [currentConversionRate, setCurrentConversionRate] = useState<number>(1.8); // 1.8%
  const [currentReturnRate, setCurrentReturnRate] = useState<number>(34); // 34%
  const [currentAOV, setCurrentAOV] = useState<number>(48); // $48
  const [activeSegment, setActiveSegment] = useState<'beauty' | 'skincare' | 'apparel'>('beauty');

  // Value Calculations
  // Baseline
  const baselineMonthlyOrders = Math.round(monthlyVisitors * (currentConversionRate / 100));
  const baselineMonthlyGMV = baselineMonthlyOrders * currentAOV;
  const baselineAnnualGMV = baselineMonthlyGMV * 12;
  const baselineAnnualReturnsLoss = baselineAnnualGMV * (currentReturnRate / 100) * 0.45; // ~45% lost margin + logistics on returns

  // With Perfect Corp & SmArist AI/AR
  const projectedConversionMultiplier = activeSegment === 'beauty' ? 2.5 : activeSegment === 'skincare' ? 2.2 : 2.0;
  const projectedReturnReductionFactor = activeSegment === 'beauty' ? 0.42 : activeSegment === 'skincare' ? 0.38 : 0.45; // 42% fewer returns
  const projectedAOVExpansion = activeSegment === 'skincare' ? 1.35 : 1.25; // +25-35% from routine bundles

  const newConversionRate = Math.min(10, currentConversionRate * projectedConversionMultiplier);
  const newMonthlyOrders = Math.round(monthlyVisitors * (newConversionRate / 100));
  const newAOV = currentAOV * projectedAOVExpansion;
  const newMonthlyGMV = newMonthlyOrders * newAOV;
  const newAnnualGMV = newMonthlyGMV * 12;
  const newReturnRate = currentReturnRate * (1 - projectedReturnReductionFactor);
  const newAnnualReturnsLoss = newAnnualGMV * (newReturnRate / 100) * 0.45;

  const annualGMVGain = newAnnualGMV - baselineAnnualGMV;
  const annualMarginSavedFromReturns = Math.max(0, baselineAnnualReturnsLoss - (newAnnualGMV * (newReturnRate / 100) * 0.20));
  const totalAnnualNetValue = annualGMVGain + annualMarginSavedFromReturns;

  return (
    <div className="flex flex-col gap-8 w-full animate-fadeIn" id="retail-consumer-value-hub">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-rose-950 to-stone-900 text-stone-100 p-6 md:p-8 rounded-3xl border border-rose-900/40 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                VERIFIED ROI & COMMERCIAL VALUE
              </span>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Perfect Corp Enterprise Impact Framework
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white mt-1">
              Demonstrated Consumer & Retail Value
            </h2>

            <p className="text-xs md:text-sm text-stone-300 leading-relaxed">
              How integrating Perfect Corp AI Vision, 3D Facial Mesh VTO, and 14-Dimension Skin Diagnostics transforms both consumer buying confidence and merchant bottom-line profitability.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-stone-950/70 p-4 rounded-2xl border border-stone-800 shrink-0">
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-stone-400 font-mono uppercase font-bold">Projected Net Value Lift</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">
                +${(totalAnnualNetValue / 1000000).toFixed(2)}M / yr
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Side-by-Side Value Split: For Consumers vs For Retailers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Card: Value to the Consumer */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col gap-5">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-black">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-stone-900">Direct Value for Consumers</h3>
                <p className="text-[11px] text-stone-500">Eliminating uncertainty, trial-and-error, and skin mismatch</p>
              </div>
            </div>
            <span className="text-xs font-mono font-black text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">
              100% Certainty
            </span>
          </div>

          <div className="flex flex-col gap-3.5 text-xs text-stone-700">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900 font-bold block mb-0.5">1:1 Photorealistic Shade Match</strong>
                <span>Try on lipsticks (matte, gloss, metallic), blush, foundation, and multi-tone hair color on their own face in 60 FPS real time.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900 font-bold block mb-0.5">14-Dimension Objective Skin Health</strong>
                <span>Personalized clinical assessment across wrinkles, hydration, pores, and UV spots without expensive clinic visit fees.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900 font-bold block mb-0.5">Zero-Return Hassle & Financial Savings</strong>
                <span>Avoids purchasing wrong foundation undertones or uncomplimentary lipstick shades that end up discarded in drawers.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900 font-bold block mb-0.5">Longitudinal Age & Preventative Roadmap</strong>
                <span>Visualizes how targeted active ingredient routines preserve collagen and skin elasticity over 5, 10, and 20 years.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Value to Retailers & Brands */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col gap-5">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-stone-900">Direct Value for Retailers & Brands</h3>
                <p className="text-[11px] text-stone-500">Unlocking 2.5x conversion lift and slashing return logistics</p>
              </div>
            </div>
            <span className="text-xs font-mono font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
              +250% ROI
            </span>
          </div>

          <div className="flex flex-col gap-3.5 text-xs text-stone-700">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-100">
              <ArrowUpRight className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900 font-bold block mb-0.5">2.5x Higher Conversion Rate (1.8% ➔ 4.5%+)</strong>
                <span>Instant visual certainty moves hesitant browsers to immediate high-confidence checkout.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-100">
              <ArrowUpRight className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900 font-bold block mb-0.5">-42% Reduction in Product Return Costs</strong>
                <span>Eliminates consumer "bracketing" (buying 3 shades to return 2) and saves millions in reverse logistics and discarded open cosmetics.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-100">
              <ArrowUpRight className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900 font-bold block mb-0.5">+35% AOV through Regimen Basket Building</strong>
                <span>The 14D skin analyzer bundles complete AM/PM routines (Cleanser + Serum + Barrier Cream + SPF) into 1-click cart adds.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-100">
              <ArrowUpRight className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900 font-bold block mb-0.5">85% Reduction in In-Store Physical Sample Waste</strong>
                <span>Cuts costly single-use plastic tester kits, aligning retail operations with ESG sustainability mandates.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Interactive Enterprise ROI & Profitability Simulator */}
      <div className="bg-stone-950 text-stone-100 p-6 md:p-8 rounded-3xl border border-stone-800 shadow-2xl flex flex-col gap-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-black text-white">Interactive Retail ROI & Margin Calculator</h3>
            </div>
            <p className="text-xs text-stone-400 mt-1">
              Adjust your store parameters to model exact financial gains delivered by Perfect Corp AI & AR integration
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-stone-900 p-1 rounded-2xl border border-stone-800">
            <button
              onClick={() => setActiveSegment('beauty')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSegment === 'beauty' ? 'bg-amber-500 text-stone-950 font-black' : 'text-stone-400 hover:text-white'
              }`}
            >
              Color Cosmetics
            </button>
            <button
              onClick={() => setActiveSegment('skincare')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSegment === 'skincare' ? 'bg-amber-500 text-stone-950 font-black' : 'text-stone-400 hover:text-white'
              }`}
            >
              Clinical Skincare
            </button>
            <button
              onClick={() => setActiveSegment('apparel')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSegment === 'apparel' ? 'bg-amber-500 text-stone-950 font-black' : 'text-stone-400 hover:text-white'
              }`}
            >
              Fashion & Eyewear
            </button>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Monthly Visitors */}
          <div className="flex flex-col gap-2 p-4 bg-stone-900/70 rounded-2xl border border-stone-800">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-400 font-bold">Monthly Visitors</span>
              <span className="font-mono font-black text-amber-400">{monthlyVisitors.toLocaleString()}</span>
            </div>
            <input 
              type="range" 
              min="20000" 
              max="2000000" 
              step="20000"
              value={monthlyVisitors} 
              onChange={(e) => setMonthlyVisitors(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer h-2 bg-stone-800 rounded-lg"
            />
            <span className="text-[10px] text-stone-500 font-mono">20k — 2M unique shoppers</span>
          </div>

          {/* Current Conversion Rate */}
          <div className="flex flex-col gap-2 p-4 bg-stone-900/70 rounded-2xl border border-stone-800">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-400 font-bold">Current Conversion</span>
              <span className="font-mono font-black text-amber-400">{currentConversionRate.toFixed(1)}%</span>
            </div>
            <input 
              type="range" 
              min="0.5" 
              max="4.0" 
              step="0.1"
              value={currentConversionRate} 
              onChange={(e) => setCurrentConversionRate(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer h-2 bg-stone-800 rounded-lg"
            />
            <span className="text-[10px] text-stone-500 font-mono">Industry Avg: 1.5% – 2.2%</span>
          </div>

          {/* Current Return Rate */}
          <div className="flex flex-col gap-2 p-4 bg-stone-900/70 rounded-2xl border border-stone-800">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-400 font-bold">Current Return Rate</span>
              <span className="font-mono font-black text-rose-400">{currentReturnRate}%</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="50" 
              step="1"
              value={currentReturnRate} 
              onChange={(e) => setCurrentReturnRate(Number(e.target.value))}
              className="w-full accent-rose-400 cursor-pointer h-2 bg-stone-800 rounded-lg"
            />
            <span className="text-[10px] text-stone-500 font-mono">Industry Avg: 30% – 40%</span>
          </div>

          {/* Average Order Value (AOV) */}
          <div className="flex flex-col gap-2 p-4 bg-stone-900/70 rounded-2xl border border-stone-800">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-400 font-bold">Average Order Value</span>
              <span className="font-mono font-black text-emerald-400">${currentAOV}</span>
            </div>
            <input 
              type="range" 
              min="20" 
              max="150" 
              step="5"
              value={currentAOV} 
              onChange={(e) => setCurrentAOV(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer h-2 bg-stone-800 rounded-lg"
            />
            <span className="text-[10px] text-stone-500 font-mono">$20 – $150 per checkout</span>
          </div>
        </div>

        {/* Results Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          
          {/* Metric 1: Conversion Surge */}
          <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 px-3 py-1 bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-black rounded-bl-xl border-l border-b border-emerald-500/30">
              +{((newConversionRate / currentConversionRate - 1) * 100).toFixed(0)}% Lift
            </div>
            <span className="text-xs text-stone-400 font-bold uppercase tracking-wide">Conversion Rate</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-stone-500 text-sm line-through font-mono">{currentConversionRate.toFixed(1)}%</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">{newConversionRate.toFixed(1)}%</span>
            </div>
            <span className="text-[11px] text-stone-400">
              {newMonthlyOrders.toLocaleString()} monthly checkouts (+{(newMonthlyOrders - baselineMonthlyOrders).toLocaleString()} incremental)
            </span>
          </div>

          {/* Metric 2: Return Rate Reduction */}
          <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 px-3 py-1 bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-black rounded-bl-xl border-l border-b border-emerald-500/30">
              -{(projectedReturnReductionFactor * 100).toFixed(0)}% Slashed
            </div>
            <span className="text-xs text-stone-400 font-bold uppercase tracking-wide">Product Return Rate</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-stone-500 text-sm line-through font-mono">{currentReturnRate}%</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">{newReturnRate.toFixed(1)}%</span>
            </div>
            <span className="text-[11px] text-stone-400">
              Saves ${(annualMarginSavedFromReturns / 1000).toFixed(0)}k in reverse logistics & discarded stock
            </span>
          </div>

          {/* Metric 3: Total Annual GMV Expansion */}
          <div className="p-5 rounded-2xl bg-stone-900 border border-emerald-500/30 flex flex-col gap-2 relative overflow-hidden bg-gradient-to-b from-stone-900 to-emerald-950/30">
            <div className="absolute top-0 right-0 px-3 py-1 bg-amber-500 text-stone-950 font-mono text-[10px] font-black rounded-bl-xl">
              ANNUAL IMPACT
            </div>
            <span className="text-xs text-emerald-400 font-bold uppercase tracking-wide">Projected Annual GMV</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-stone-500 text-sm line-through font-mono">${(baselineAnnualGMV / 1000000).toFixed(2)}M</span>
              <span className="text-2xl font-black text-white font-mono">${(newAnnualGMV / 1000000).toFixed(2)}M</span>
            </div>
            <span className="text-[11px] text-emerald-300 font-bold">
              +${(annualGMVGain / 1000000).toFixed(2)}M net incremental revenue
            </span>
          </div>
        </div>
      </div>

      {/* 4. Live Experience Showcase & Immediate Try-On Call to Action */}
      <div className="p-6 md:p-8 bg-gradient-to-r from-rose-50 via-amber-50 to-rose-50 rounded-3xl border border-rose-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-black shadow-md shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-black text-stone-900">Experience the Live Engine in Action</h4>
            <p className="text-xs text-stone-600 mt-0.5">
              Switch directly to the Live 3D Virtual Try-On Mirror or the 14-Dimension Clinical Diagnostic Analyzer to test the real-time pipeline.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          {onNavigateTab && (
            <>
              <button
                onClick={() => onNavigateTab('virtual-tryon')}
                className="px-4 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-black hover:bg-stone-800 transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <span>Launch Live 3D VTO</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigateTab('skin-diagnostic')}
                className="px-4 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-black hover:bg-rose-700 transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <span>Launch 14D Skin Scan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

    </div>
  );
};
