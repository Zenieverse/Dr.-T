import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Stethoscope, Brain, Utensils, Sparkles, ShieldCheck, Cpu, Flame, Layers, GraduationCap } from 'lucide-react';
import { MedGemmaSuite } from './MedGemmaSuite';
import { NemotronReasoningSuite } from './NemotronReasoningSuite';
import { ComfortFoodLanding } from './ComfortFoodLanding';
import { LongevityAcademy } from './LongevityAcademy';

export interface ClinicalAISuiteProps {
  initialSubTab?: 'longevity' | 'medgemma' | 'nemotron' | 'comfort_food';
}

export function ClinicalAISuite({ initialSubTab = 'longevity' }: ClinicalAISuiteProps) {
  const [activeSubTab, setActiveSubTab] = useState<'longevity' | 'medgemma' | 'nemotron' | 'comfort_food'>(initialSubTab);

  return (
    <div className="space-y-6 font-sans">
      {/* Unified Suite Header & Sub-Tab Navigation Bar */}
      <div className="bg-gradient-to-r from-stone-900 via-rose-950 to-stone-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl border border-rose-900/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-mono font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              Unified Dr. T Institute & Clinical AI Suite
            </div>
            <h2 className="text-xl sm:text-3xl font-black font-display tracking-tight text-white">
              Dr. T Institute & Clinical Intelligence
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              Consolidating the Longevity & Healthy Aging Academy, Google MedGemma 2B diagnostics, NVIDIA Nemotron AI reasoning, and Therapeutic Comfort Nutrition into one master hub.
            </p>
          </div>

          {/* Sub-tab Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-stone-950/80 p-1.5 rounded-2xl border border-stone-800 self-start md:self-auto">
            <button
              onClick={() => setActiveSubTab('longevity')}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeSubTab === 'longevity'
                  ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md font-black'
                  : 'text-stone-400 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-rose-300" />
              <span>Longevity Academy</span>
            </button>

            <button
              onClick={() => setActiveSubTab('medgemma')}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeSubTab === 'medgemma'
                  ? 'bg-rose-600 text-white shadow-md font-black'
                  : 'text-stone-400 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              <Stethoscope className="w-4 h-4 text-rose-300" />
              <span>MedGemma HAI-DEF</span>
            </button>

            <button
              onClick={() => setActiveSubTab('nemotron')}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeSubTab === 'nemotron'
                  ? 'bg-emerald-600 text-white shadow-md font-black'
                  : 'text-stone-400 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              <Brain className="w-4 h-4 text-emerald-300" />
              <span>NVIDIA Nemotron</span>
            </button>

            <button
              onClick={() => setActiveSubTab('comfort_food')}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeSubTab === 'comfort_food'
                  ? 'bg-amber-600 text-white shadow-md font-black'
                  : 'text-stone-400 hover:text-white hover:bg-stone-800/60'
              }`}
            >
              <Utensils className="w-4 h-4 text-amber-300" />
              <span>Healing Table & Food</span>
            </button>
          </div>
        </div>
      </div>

      {/* Render Active Module */}
      <AnimatePresence mode="wait">
        {activeSubTab === 'longevity' && (
          <motion.div
            key="longevity"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <LongevityAcademy />
          </motion.div>
        )}

        {activeSubTab === 'medgemma' && (
          <motion.div
            key="medgemma"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <MedGemmaSuite />
          </motion.div>
        )}

        {activeSubTab === 'nemotron' && (
          <motion.div
            key="nemotron"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <NemotronReasoningSuite />
          </motion.div>
        )}

        {activeSubTab === 'comfort_food' && (
          <motion.div
            key="comfort_food"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <ComfortFoodLanding />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
