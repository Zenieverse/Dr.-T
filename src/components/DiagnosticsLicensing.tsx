import React from 'react';
import { motion } from 'motion/react';
import { CreditCard, ShoppingBag, Volume2, Globe, Check, ShieldCheck } from 'lucide-react';

interface DiagnosticsLicensingProps {
  key?: string;
  subTier: 'free' | 'premium' | 'family';
  setSubTier: (tier: 'free' | 'premium' | 'family') => void;
  tierFeedback: string | null;
  setTierFeedback: (msg: string | null) => void;
  voiceName: string;
  setVoiceName: (v: string) => void;
  language: string;
  setLanguage: (l: string) => void;
}

export function DiagnosticsLicensing({
  subTier,
  setSubTier,
  tierFeedback,
  setTierFeedback,
  voiceName,
  setVoiceName,
  language,
  setLanguage
}: DiagnosticsLicensingProps) {
  const handleTierSelection = (tier: 'free' | 'premium' | 'family') => {
    setSubTier(tier);
    if (tier === 'premium') {
      setTierFeedback('✨ Premium Licensing Unlocked: High-fidelity maternal neural TTS voices activated successfully.');
    } else if (tier === 'family') {
      setTierFeedback('💖 Family Matrix Synchronized: Guardian account synced with grandma’s care network.');
    } else {
      setTierFeedback('Standard free access tier active.');
    }
    setTimeout(() => setTierFeedback(null), 5000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="grid grid-cols-1 md:grid-cols-12 gap-6"
      id="diagnostics-licensing-container"
    >
      {/* Pricing Plan Options Card */}
      <div className="md:col-span-5 bg-stone-900 border border-stone-850 p-6 md:p-8 rounded-3xl shadow-md text-white relative overflow-hidden flex flex-col justify-between min-h-[360px]">
        {/* Subtle neon glowing gradient circle */}
        <div className="absolute -left-20 -bottom-20 w-44 h-44 rounded-full bg-rose-500/10 blur-[90px] pointer-events-none" />

        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 font-bold flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-amber-500" /> Platform Licensing
            </span>
            <span className="text-[8px] font-mono bg-emerald-500/15 text-emerald-400 px-2.5 py-1 rounded-md uppercase font-bold tracking-wider">
              {subTier === 'free' ? 'FREEMIUM ACTIVE' : subTier === 'premium' ? 'PREMIUM AGENT' : 'FAMILY ACTIVE'}
            </span>
          </div>
          <h4 className="text-base font-bold mt-3 text-stone-100 font-sans">Infinity License Plan Options</h4>
          <p className="text-[11.5px] text-stone-400 leading-relaxed mt-2">
            Select a tier plan below. Upgrading unlocks premium neural TTS synthesizers, deep Socratic tracking, and unlimited multi-agent consultations.
          </p>
        </div>

        {tierFeedback && (
          <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10.5px] rounded-xl font-semibold mt-3 animate-fadeIn leading-relaxed">
            {tierFeedback}
          </div>
        )}

        {/* Pricing tiers buttons */}
        <div className="grid grid-cols-3 gap-2 bg-stone-950 border border-stone-800 rounded-2xl p-1.5 mt-5">
          <button
            onClick={() => handleTierSelection('free')}
            className={`py-2 text-[9px] font-mono font-black uppercase rounded-xl transition-all cursor-pointer ${
              subTier === 'free'
                ? 'bg-white text-stone-900 scale-102 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            FREE
          </button>
          <button
            onClick={() => handleTierSelection('premium')}
            className={`py-2 text-[9px] font-mono font-black uppercase rounded-xl transition-all cursor-pointer ${
              subTier === 'premium'
                ? 'bg-white text-stone-900 scale-102 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            $9 Premium
          </button>
          <button
            onClick={() => handleTierSelection('family')}
            className={`py-2 text-[9px] font-mono font-black uppercase rounded-xl transition-all cursor-pointer ${
              subTier === 'family'
                ? 'bg-white text-stone-900 scale-102 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            $19 Family
          </button>
        </div>

        <div className="text-[11px] leading-relaxed mt-5 text-stone-450 flex items-start gap-2.5 border-t border-stone-850 pt-4">
          <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <span>
            {subTier === 'free'
              ? 'Standard TTS speeds with local falls. Upgrading bypasses quotas.'
              : subTier === 'premium'
                ? 'Premium hyper-realistic avatars, 100% server TTS speed unlocked.'
                : 'Family dashboard unlocked. Complete smart tracking for 5 profiles.'}
          </span>
        </div>
      </div>

      {/* Voice and Skill Marketplace Column */}
      <div className="md:col-span-7 bg-white border border-stone-200/60 p-6 md:p-8 rounded-3xl shadow-sm flex flex-col justify-between">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
            <ShoppingBag className="w-4 h-4 text-rose-500" /> Skill &amp; Voice Store
          </span>
          <h4 className="font-bold text-stone-850 text-base mt-2">Orchestration Marketplaces</h4>
          <p className="text-[11.5px] text-stone-400 leading-relaxed mt-1">
            Download premium sub-intelligence modules and professional custom voice templates made by top psychologists and linguists.
          </p>
        </div>

        {/* Voices list */}
        <div className="flex flex-col gap-3.5 mt-5">
          <span className="text-[9.5px] font-mono tracking-widest text-stone-400 font-extrabold uppercase block">
            Trending integrations
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              onClick={() => setVoiceName('Puck')}
              className="p-3 bg-stone-50 border border-stone-200 hover:border-rose-400 rounded-2xl flex items-center justify-between cursor-pointer transition-all shadow-xs"
            >
              <div className="flex items-center gap-3">
                <Volume2 className="text-stone-400 w-5 h-5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-stone-800">French Lyricism (Dr. Puck)</p>
                  <p className="text-[9px] text-stone-400 font-mono mt-0.5">Poetry specialist</p>
                </div>
              </div>
              {voiceName === 'Puck' ? (
                <Check className="w-4 h-4 text-rose-600 shrink-0" />
              ) : (
                <span className="text-[8px] font-black bg-stone-200/50 p-1 px-1.5 rounded-md font-mono text-stone-550 uppercase">
                  APPLY
                </span>
              )}
            </div>

            <div
              onClick={() => setVoiceName('Charon')}
              className="p-3 bg-stone-50 border border-stone-200 hover:border-indigo-400 rounded-2xl flex items-center justify-between cursor-pointer transition-all shadow-xs"
            >
              <div className="flex items-center gap-3">
                <Volume2 className="text-stone-400 w-5 h-5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-stone-800">Deep Bass (Dr. Charon)</p>
                  <p className="text-[9px] text-stone-400 font-mono mt-0.5">Deep baritone comfort</p>
                </div>
              </div>
              {voiceName === 'Charon' ? (
                <Check className="w-4 h-4 text-indigo-600 shrink-0" />
              ) : (
                <span className="text-[8px] font-black bg-stone-200/50 p-1 px-1.5 rounded-md font-mono text-stone-550 uppercase">
                  APPLY
                </span>
              )}
            </div>

            <div
              onClick={() => {
                setLanguage('Spanish');
                setVoiceName('Fenrir');
              }}
              className="p-3 bg-stone-50 border border-stone-200 hover:border-amber-400 rounded-2xl flex items-center justify-between cursor-pointer transition-all shadow-xs sm:col-span-2"
            >
              <div className="flex items-center gap-3">
                <Globe className="text-stone-400 w-5 h-5 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-stone-800">Castilian Español Mode (Fenrir)</p>
                  <p className="text-[9px] text-stone-400 font-mono mt-0.5">Spanish language drill specialist</p>
                </div>
              </div>
              {language === 'Spanish' ? (
                <Check className="w-4 h-4 text-amber-500 shrink-0" />
              ) : (
                <span className="text-[8px] font-black bg-stone-200/50 p-1 px-1.5 rounded-md font-mono text-stone-550 uppercase">
                  LOAD
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
