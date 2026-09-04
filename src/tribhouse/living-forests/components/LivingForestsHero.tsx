// =========================================================================
// LIVING FORESTS HERO & INSPIRATION BANNER
// "Plant a Library. Grow a Forest. Feed a Mind."
// =========================================================================

import React from 'react';
import { 
  Trees, 
  BookOpen, 
  Globe2, 
  Sparkles, 
  HeartHandshake, 
  MapPin, 
  ShieldCheck, 
  Compass, 
  ScrollText,
  Clock,
  Cloud,
  ChevronRight
} from 'lucide-react';
import { LivingForestsGlobalSummary } from '../types';

interface LivingForestsHeroProps {
  summary: LivingForestsGlobalSummary;
  onOpenPlantModal: () => void;
  onOpenTreeModal: () => void;
  onOpenProposeModal: () => void;
  onOpenAiMatcherModal: () => void;
  onOpenCharterModal: () => void;
  onOpenZenModal: () => void;
  onNavigateToMap: () => void;
  onNavigateToCountries: () => void;
}

export const LivingForestsHero: React.FC<LivingForestsHeroProps> = ({
  summary,
  onOpenPlantModal,
  onOpenTreeModal,
  onOpenProposeModal,
  onOpenAiMatcherModal,
  onOpenCharterModal,
  onOpenZenModal,
  onNavigateToMap,
  onNavigateToCountries,
}) => {
  return (
    <section 
      id="living-forests-hero" 
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-emerald-950 to-stone-950 text-white shadow-2xl border border-emerald-500/30 p-6 md:p-10 mb-8"
    >
      {/* Biophilic background aura */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-8">
        {/* Top Badges & Dev.to Cloud Run Compliance */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <span className="flex items-center space-x-1.5 bg-emerald-900/80 text-emerald-300 px-3 py-1 rounded-full border border-emerald-600/50 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Global Knowledge Infrastructure Network</span>
            </span>
            <span className="hidden sm:inline-flex items-center space-x-1.5 bg-stone-800/80 text-amber-300 px-3 py-1 rounded-full border border-amber-600/40">
              <span>Universal Symbol: 🌳 + 📖</span>
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenZenModal}
              className="flex items-center space-x-1.5 bg-emerald-950/90 hover:bg-emerald-900 text-teal-300 px-3 py-1 rounded-full border border-teal-500/40 transition-colors shadow-xs"
              title="Pause for one minute of mindful breathing"
            >
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              <span>One Minute of Silence</span>
            </button>
            <button
              onClick={onOpenCharterModal}
              className="flex items-center space-x-1.5 bg-stone-800/90 hover:bg-stone-700 text-stone-200 px-3 py-1 rounded-full border border-stone-600 transition-colors"
            >
              <ScrollText className="w-3.5 h-3.5 text-amber-400" />
              <span>The 100-Year Charter</span>
            </button>
          </div>
        </div>

        {/* Hero Title & Philosophical Framing */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-700/40 shrink-0">
                <span className="text-2xl" role="img" aria-label="Tree and Book">🌳</span>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white font-display">
                  Trib-House Living Library Forests
                </h1>
                <p className="text-sm sm:text-base font-semibold text-emerald-300 mt-0.5">
                  Plant a Library. Grow a Forest. Feed a Mind.
                </p>
              </div>
            </div>

            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
              A sovereign, non-extractive global network connecting <strong className="text-emerald-300">People → Books → Libraries → Trees → Communities → Education → Earth → Future</strong>. 
              We build physical reading sanctuaries, mobile river and camel caravans, bilingual indigenous collections, and native biodiversity groves in underserved landscapes.
            </p>

            <div className="flex items-center gap-2 pt-1 text-xs text-stone-400">
              <span className="font-semibold text-amber-200">Core Philosophy:</span>
              <span className="italic">“By All. For All. Across Generations. Every Community Deserves a Place to Learn.”</span>
            </div>

            {/* Quick Action CTA Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                id="btn-hero-plant-library"
                onClick={onOpenPlantModal}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
              >
                <span>🌱</span>
                <span>Plant a Library</span>
              </button>

              <button
                id="btn-hero-give-tree"
                onClick={onOpenTreeModal}
                className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-emerald-300 font-bold text-xs sm:text-sm flex items-center gap-2 border border-emerald-500/40 shadow-sm transition-all active:scale-95"
              >
                <span>🌳</span>
                <span>Give a Dedicated Tree</span>
              </button>

              <button
                id="btn-hero-explore-map"
                onClick={onNavigateToMap}
                className="px-4 py-2.5 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-200 font-medium text-xs sm:text-sm flex items-center gap-1.5 border border-stone-700 transition-all"
              >
                <Globe2 className="w-4 h-4 text-sky-400" />
                <span>World Map</span>
              </button>

              <button
                id="btn-hero-propose"
                onClick={onOpenProposeModal}
                className="px-4 py-2.5 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-300 font-medium text-xs sm:text-sm flex items-center gap-1.5 border border-stone-800 transition-all"
              >
                <HeartHandshake className="w-4 h-4 text-amber-400" />
                <span>Propose Local Project</span>
              </button>

              <button
                id="btn-hero-ai-match"
                onClick={onOpenAiMatcherModal}
                className="px-4 py-2.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 text-indigo-200 font-medium text-xs sm:text-sm flex items-center gap-1.5 border border-indigo-500/40 transition-all"
              >
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Trib AI Matcher</span>
              </button>
            </div>
          </div>

          {/* Ethical & Integrity Disclaimers Box */}
          <div className="lg:col-span-4 bg-stone-950/80 rounded-2xl p-4 border border-emerald-500/20 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Ethical Standards & Integrity</span>
            </div>

            <div className="text-[11px] text-stone-300 space-y-2 leading-relaxed">
              <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-800/50">
                <strong className="text-emerald-300 block mb-0.5">Trees ≠ Carbon Credits</strong>
                Tree contributions support living ecological restoration and community shade. We strictly do NOT sell carbon offsets or claim commercial ownership of native forests.
              </div>

              <div className="p-2 rounded-lg bg-stone-900/60 border border-stone-800">
                <strong className="text-amber-300 block mb-0.5">Community-First Origins</strong>
                We never tell a village what it needs. All projects originate from verified local educators, cooperatives, or elder assemblies with full community veto rights.
              </div>
            </div>

            {/* Google Cloud Run Hosting Note */}
            <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between text-[10px] text-stone-400">
              <span className="flex items-center space-x-1 text-sky-300">
                <Cloud className="w-3.5 h-3.5" />
                <span>Cloud Run Ingress: 0.0.0.0:3000</span>
              </span>
              <span className="text-emerald-400 font-mono">Firestore Persistent</span>
            </div>
          </div>
        </div>

        {/* Global Evidence-Backed Impact Metrics Counter */}
        <div className="pt-6 border-t border-emerald-900/50 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-center">
          <div className="bg-stone-900/60 p-3 rounded-2xl border border-stone-800/80">
            <div className="text-lg sm:text-xl font-black text-emerald-300 font-display">
              {summary.mindsNourishedCount.toLocaleString()}
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 mt-0.5">
              Minds Nourished
            </div>
          </div>

          <div className="bg-stone-900/60 p-3 rounded-2xl border border-stone-800/80">
            <div className="text-lg sm:text-xl font-black text-white font-display">
              {summary.librariesBuiltCount}
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 mt-0.5">
              Libraries Open
            </div>
          </div>

          <div className="bg-stone-900/60 p-3 rounded-2xl border border-stone-800/80">
            <div className="text-lg sm:text-xl font-black text-teal-300 font-display">
              {summary.mobileFleetsCount}
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 mt-0.5">
              Mobile Fleets
            </div>
          </div>

          <div className="bg-stone-900/60 p-3 rounded-2xl border border-stone-800/80">
            <div className="text-lg sm:text-xl font-black text-amber-300 font-display">
              {summary.booksCirculatedCount.toLocaleString()}
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 mt-0.5">
              Books Circulated
            </div>
          </div>

          <div className="bg-stone-900/60 p-3 rounded-2xl border border-stone-800/80">
            <div className="text-lg sm:text-xl font-black text-emerald-400 font-display">
              {summary.nativeTreesGrownCount.toLocaleString()}
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 mt-0.5">
              Native Trees Grown
            </div>
          </div>

          <div className="bg-stone-900/60 p-3 rounded-2xl border border-stone-800/80">
            <div className="text-lg sm:text-xl font-black text-sky-300 font-display">
              {summary.languagesPreservedCount}
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 mt-0.5">
              Languages Kept
            </div>
          </div>

          <div className="bg-stone-900/60 p-3 rounded-2xl border border-stone-800/80">
            <div className="text-lg sm:text-xl font-black text-teal-400 font-display">
              {summary.localJobsSupportedCount}
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 mt-0.5">
              Local Jobs Retained
            </div>
          </div>

          <div className="bg-stone-900/60 p-3 rounded-2xl border border-stone-800/80">
            <div className="text-lg sm:text-xl font-black text-emerald-400 font-display">
              {summary.verifiedSurvivalRatePct}%
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 mt-0.5">
              Tree Survival Rate
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
