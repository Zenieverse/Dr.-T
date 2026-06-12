import React from 'react';
import { Sparkles, Check, ShieldCheck, User, Headphones, Award } from 'lucide-react';
import { DrTAppearance, DrTVibe, VoiceChoice } from '../types';

interface AvatarSettingsProps {
  vibe: DrTVibe;
  setVibe: (v: DrTVibe) => void;
  voiceName: string;
  setVoiceName: (v: string) => void;
  voices: VoiceChoice[];
  appearance: DrTAppearance;
  setAppearance: (a: DrTAppearance) => void;
  tGender: 'female' | 'male';
  setTGender: (g: 'female' | 'male') => void;
  tAge: 'young' | 'mature' | 'elder';
  setTAge: (a: 'young' | 'mature' | 'elder') => void;
  vibeConfig: any;
  vibes: any[];
}

export const APPEARANCES = [
  { id: 'professional' as DrTAppearance, name: 'Professional Lab Coat', desc: 'Elite academic researcher with clean silver accents', icon: '🩺' },
  { id: 'ao_dai' as DrTAppearance, name: 'Traditional Áo Dài', desc: 'Elegant hand-embroidered silk Vietnamese robe', icon: '🌸' },
  { id: 'scrubs' as DrTAppearance, name: 'Healthcare scrubs', desc: 'Warm active medical scrubs for quick clinical comfort', icon: '👩‍⚕️' },
  { id: 'cyber_suit' as DrTAppearance, name: 'Neural Cyber-Suit', desc: 'Futuristic quantum-fiber wearable, clean holographic rings', icon: '🌌' },
  { id: 'casual' as DrTAppearance, name: 'Chic Tweed Blazer', desc: 'Cozy motherly cardigan pairing with tortoise-shell specs', icon: '🧥' }
];

export const AvatarSettings: React.FC<AvatarSettingsProps> = ({
  vibe,
  setVibe,
  voiceName,
  setVoiceName,
  voices,
  appearance,
  setAppearance,
  tGender,
  setTGender,
  tAge,
  setTAge,
  vibeConfig,
  vibes
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-md border border-stone-200/65 rounded-3xl p-6 shadow-md flex flex-col gap-6 overflow-hidden" id="avatar-settings-container">
      
      {/* Beautiful Hero Cover Banner */}
      <div className="relative w-full h-44 rounded-2xl overflow-hidden shadow-inner border border-stone-200/50">
        <img 
          src="/src/assets/images/dr_t_cover_1781255193776.jpg" 
          alt="Doctor T Maternal Polymath Cover" 
          className="w-full h-full object-cover select-none"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-900/40 to-transparent flex flex-col justify-end p-5">
          <span className="text-[9px] font-mono font-bold tracking-widest text-[#fecdd3] uppercase">INTELLIGENT COGNITIVE MATRICES</span>
          <h2 className="text-xl font-black text-white leading-tight font-sans mt-1">
            Doctor T: Core Polymath Identity
          </h2>
          <p className="text-[10px] text-stone-200 leading-normal mt-1 opacity-90 max-w-sm">
            Nurturing human potential across healthcare, science, psychology, humanities, and lifestyle consulting under cozy maternal warmth.
          </p>
        </div>
      </div>

      {/* Title */}
      <div>
        <h3 className="text-lg font-bold tracking-tight text-stone-800 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-rose-500" />
          Neural Avatar Customization
        </h3>
        <p className="text-xs text-stone-500 mt-1">
          Adjust Dr. T's core appearance, accent, age, and response vibe. Changes dynamically shift the neural voice synthesis.
        </p>
      </div>

      {/* Outfit/Appearance Choice */}
      <div className="flex flex-col gap-2.5">
        <label className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
          <span>🧥</span> Appearance & Attire
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {APPEARANCES.map((app) => (
            <button
              key={app.id}
              onClick={() => setAppearance(app.id)}
              className={`p-3 rounded-xl border text-left transition-all duration-300 flex items-center gap-3 relative overflow-hidden cursor-pointer hover:border-rose-450/40 hover:bg-rose-50/10
                ${appearance === app.id
                  ? 'border-rose-500 bg-rose-50/30 ring-1 ring-rose-500/10 font-medium'
                  : 'border-stone-200 bg-white'
                }
              `}
            >
              <div className="text-2xl bg-white w-9 h-9 rounded-lg flex items-center justify-center border border-stone-100 shadow-xs shrink-0">
                {app.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-stone-800 truncate">{app.name}</p>
                <p className="text-[10px] text-stone-400 leading-snug line-clamp-1">{app.desc}</p>
              </div>
              {appearance === app.id && (
                <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Voice & Gender */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Gender toggle */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" /> Core Gender
          </label>
          <div className="grid grid-cols-2 gap-1.5 bg-stone-100/80 p-1 rounded-xl border border-stone-205">
            <button
              onClick={() => { setTGender('female'); if (voiceName === 'Zephyr' || voiceName === 'Puck' || voiceName === 'Charon') setVoiceName('Kore'); }}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${tGender === 'female' ? 'bg-white shadow-xs text-rose-600' : 'text-stone-500 hover:text-stone-800'}`}
            >
              👩 Female
            </button>
            <button
              onClick={() => { setTGender('male'); if (voiceName === 'Kore' || voiceName === 'Fenrir') setVoiceName('Zephyr'); }}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${tGender === 'male' ? 'bg-white shadow-xs text-indigo-600' : 'text-stone-500 hover:text-stone-800'}`}
            >
              👨 Male
            </button>
          </div>
        </div>

        {/* Age Toggle */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" /> Age Bracket
          </label>
          <div className="grid grid-cols-3 gap-1 bg-stone-100/80 p-1 rounded-xl border border-stone-205">
            <button
              onClick={() => setTAge('young')}
              className={`py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${tAge === 'young' ? 'bg-white shadow-xs text-stone-800' : 'text-stone-500 hover:text-stone-850'}`}
            >
              30s
            </button>
            <button
              onClick={() => setTAge('mature')}
              className={`py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${tAge === 'mature' ? 'bg-white shadow-xs text-stone-800' : 'text-stone-500 hover:text-stone-850'}`}
            >
              50s
            </button>
            <button
              onClick={() => setTAge('elder')}
              className={`py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${tAge === 'elder' ? 'bg-white shadow-xs text-stone-800' : 'text-stone-500 hover:text-stone-850'}`}
            >
              70s
            </button>
          </div>
        </div>

        {/* Neural Accent voice selection */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            <Headphones className="w-3.5 h-3.5" /> Synthesis Accent
          </label>
          <select
            value={voiceName}
            onChange={(e) => setVoiceName(e.target.value)}
            className="w-full bg-stone-100/85 hover:bg-stone-100 border border-stone-205 focus:none rounded-xl p-2 text-xs font-bold text-stone-700 cursor-pointer"
          >
            {voices
              .filter(v => v.gender === tGender)
              .map((v) => (
                <option key={v.id} value={v.id} className="bg-white text-stone-800">
                  {v.name} ({v.accent})
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Personality Style / Vibe Selection */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
          <span>🧠</span> Adaptive Personality Style (Active Vibe)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
          {vibes.map((vib) => (
            <button
              key={vib.id}
              onClick={() => setVibe(vib.id)}
              className={`p-3 rounded-xl border text-left transition-all duration-300 flex flex-col justify-between cursor-pointer hover:scale-101
                ${vibe === vib.id
                  ? 'border-rose-500 bg-rose-55/35 font-semibold text-rose-900 ring-1 ring-rose-500/10 shadow-xs'
                  : 'border-stone-200 bg-white text-stone-600'
                }
              `}
            >
              <div>
                <span className="text-lg mb-1 block">
                  {vib.id === 'empathetic' ? '🧸' : vib.id === 'witty' ? '⚡' : vib.id === 'philosophical' ? '🎓' : '🎈'}
                </span>
                <span className="text-xs font-extrabold block text-stone-800">{vib.name}</span>
                <p className="text-[10px] text-stone-400 mt-1 leading-snug line-clamp-2">{vib.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Trust & Privacy Security Guard */}
      <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-xs font-extrabold text-emerald-800">Trust Layer Secured (Zero-Knowledge Sync)</p>
          <p className="text-[10px] text-emerald-700/85 mt-0.5 leading-snug">
            All conversations, healthcare trackers, and memory graphs are secured locally via containerized storage. Decryption keys belong 100% to you. Dr. T does not transmit your personal biometric speech or private notes to global advertisement hubs. No telemetry is logged.
          </p>
        </div>
      </div>
    </div>
  );
};
