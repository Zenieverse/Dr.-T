import React from 'react';
import { Sparkles, Check, ShieldCheck, User, Headphones, Award, Music, Radio, Volume2, Flame, Heart, Disc } from 'lucide-react';
import { DrTAppearance, DrTVibe, VoiceChoice } from '../types';
import drTCover from '../assets/images/dr_t_cover_1781255193776.jpg';
import { ALL_SYMPHONIES } from '../data/symphonyTracks';

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
  isVoiceAvatarOptedIn?: boolean;
  setIsVoiceAvatarOptedIn?: (optedIn: boolean) => void;
  selectedSymphonyId?: string;
  setSelectedSymphonyId?: (id: string) => void;
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
  vibes,
  isVoiceAvatarOptedIn = true,
  setIsVoiceAvatarOptedIn,
  selectedSymphonyId,
  setSelectedSymphonyId
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-md border border-stone-200/65 rounded-3xl p-6 shadow-md flex flex-col gap-6 overflow-hidden" id="avatar-settings-container">
      
      {/* Beautiful Hero Cover Banner */}
      <div className="relative w-full h-44 rounded-2xl overflow-hidden shadow-inner border border-stone-200/50">
        <img 
          src={drTCover} 
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
          Neural Avatar & Audio Mode Customization
        </h3>
        <p className="text-xs text-stone-500 mt-1">
          Adjust Dr. T's core appearance, audio mode (Voice Avatar vs. Classical/Pop Symphonies), accent, age, and response vibe.
        </p>
      </div>

      {/* AUDIO MODE PREFERENCE: VOICE AVATAR OPT-IN vs CLASSICAL/POP SYMPHONIES */}
      <div className="p-4 bg-gradient-to-br from-rose-50/70 to-amber-50/50 border border-rose-200/80 rounded-2xl flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-stone-800 flex items-center gap-2">
            <Music className="w-4 h-4 text-rose-600" /> Audio Mode: Voice Avatar vs. Classical & Pop Symphonies
          </label>
          <span className="text-[9px] font-mono font-bold text-rose-600 bg-white px-2 py-0.5 rounded-full border border-rose-200">
            {isVoiceAvatarOptedIn ? '🎙️ VOICE AVATAR ACTIVE' : '🎼 35+ SYMPHONIES MODE'}
          </span>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed">
          If you opt out of the spoken voice avatar, Dr. T automatically switches to playing classical symphonies by <strong>Mozart</strong>, <strong>Beethoven</strong>, <strong>Bach</strong>, <strong>Vivaldi</strong>, <strong>Chopin</strong>, and top pop tracks from our 35+ track collection.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
          {/* Option 1: Voice Avatar Opt-in */}
          <button
            type="button"
            onClick={() => setIsVoiceAvatarOptedIn && setIsVoiceAvatarOptedIn(true)}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 relative overflow-hidden ${
              isVoiceAvatarOptedIn
                ? 'bg-white border-rose-500 shadow-sm ring-1 ring-rose-300'
                : 'bg-white/60 border-stone-200 text-stone-500 hover:bg-white'
            }`}
          >
            <div className="text-2xl w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
              🎙️
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-stone-900">Neural Voice Avatar Opt-In</p>
                {isVoiceAvatarOptedIn && <span className="w-2 h-2 rounded-full bg-rose-500" />}
              </div>
              <p className="text-[10px] text-stone-500 leading-snug mt-0.5">
                Spoken dialogue, real-time voice calls, and interactive maternal guidance enabled.
              </p>
            </div>
          </button>

          {/* Option 2: Classical Symphonies & Pop Playlist Mode */}
          <button
            type="button"
            onClick={() => setIsVoiceAvatarOptedIn && setIsVoiceAvatarOptedIn(false)}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 relative overflow-hidden ${
              !isVoiceAvatarOptedIn
                ? 'bg-white border-rose-500 shadow-sm ring-1 ring-rose-300'
                : 'bg-white/60 border-stone-200 text-stone-500 hover:bg-white'
            }`}
          >
            <div className="text-2xl w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
              🎼
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-stone-900">Classical & Pop Symphonies Mode</p>
                {!isVoiceAvatarOptedIn && <span className="w-2 h-2 rounded-full bg-amber-500" />}
              </div>
              <p className="text-[10px] text-stone-500 leading-snug mt-0.5">
                Opt out of voice speech. Dr. T plays Mozart, Beethoven, Bach, Chopin & Pop hits.
              </p>
            </div>
          </button>
        </div>

        {/* Quick Symphony Playlist selector if opted out of voice avatar */}
        {!isVoiceAvatarOptedIn && (
          <div className="mt-2 pt-3 border-t border-rose-200/60 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-stone-600 uppercase">
                Choose Default Background Symphony / Pop Track:
              </span>
              <span className="text-[9px] font-mono text-rose-600 font-bold">
                {ALL_SYMPHONIES.length} Masterpieces Available
              </span>
            </div>
            
            <select
              value={selectedSymphonyId || ALL_SYMPHONIES[0].id}
              onChange={(e) => setSelectedSymphonyId && setSelectedSymphonyId(e.target.value)}
              className="w-full bg-white border border-rose-200 rounded-xl p-2 text-xs font-bold text-stone-800 cursor-pointer shadow-3xs outline-none focus:border-rose-400"
            >
              {ALL_SYMPHONIES.map(sym => (
                <option key={sym.id} value={sym.id}>
                  {sym.emoji} {sym.name} — {sym.composer} ({sym.benefits})
                </option>
              ))}
            </select>
          </div>
        )}
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
                <div className="w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center text-white shrink-0">
                  <Check className="w-3 h-3" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Gender & Age Customization */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Gender Identity */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" /> Gender Alignment
          </label>
          <div className="grid grid-cols-2 gap-1 p-1 bg-stone-100/80 rounded-xl border border-stone-200">
            <button
              onClick={() => setTGender('female')}
              className={`py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${tGender === 'female' ? 'bg-white shadow-xs text-rose-600' : 'text-stone-500 hover:text-stone-850'}`}
            >
              Female (Dr. T)
            </button>
            <button
              onClick={() => setTGender('male')}
              className={`py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${tGender === 'male' ? 'bg-white shadow-xs text-rose-600' : 'text-stone-500 hover:text-stone-850'}`}
            >
              Male (Dr. T)
            </button>
          </div>
        </div>

        {/* Age Persona */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            <span>⏳</span> Maturation Stage
          </label>
          <div className="grid grid-cols-3 gap-1 p-1 bg-stone-100/80 rounded-xl border border-stone-200">
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
