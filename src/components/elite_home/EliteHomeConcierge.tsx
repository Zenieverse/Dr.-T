import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Volume2, 
  VolumeX, 
  Compass, 
  CheckCircle2, 
  MapPin, 
  Heart,
  ArrowRight
} from 'lucide-react';
import { MASTERPLAN_DISTRICTS, LUXURY_CHAMBERS } from './eliteHomeData';
import { soundEngine } from './soundEngine';

export const EliteHomeConcierge: React.FC<{
  onJumpToDistrict: (districtId: string) => void;
}> = ({ onJumpToDistrict }) => {
  const [messages, setMessages] = useState<{ sender: 'ai' | 'user'; text: string; recommendedSector?: string; time: string }[]>([
    {
      sender: 'ai',
      text: "Welcome to eLite Home, dear traveler. I am Dr. T, your Chief Civilization Concierge. Whether you are seeking a peaceful treehouse canopy in the ancient redwoods, an oceanfront sunset villa, an innovation research lab, or a vibrant courtyard community with shared Mediterranean dinners—tell me about your passions, personality, and longevity goals. How may I guide your greatest life chapter today?",
      time: 'Just now'
    }
  ]);
  const [inputVal, setInputVal] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const samplePrompts = [
    "I am a retired botanist and writer who cherishes deep silence and walking among ancient trees.",
    "My partner and I love hosting international dinners, playing jazz piano, and having lively neighbors.",
    "I want the most advanced cellular regenerative medicine, hyperbaric oxygen, and daily spa therapies.",
    "I spent 40 years as an aerospace engineer and want to mentor young innovators and work on green robotics."
  ];

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputVal).trim();
    if (!query) return;

    const userMsg = {
      sender: 'user' as const,
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    soundEngine.triggerChime(528);

    // AI Socratic Matchmaking Logic
    setTimeout(() => {
      let responseText = '';
      let recommendedSector = '';
      const qLower = query.toLowerCase();

      if (qLower.includes('tree') || qLower.includes('silence') || qLower.includes('introvert') || qLower.includes('nature') || qLower.includes('botanist') || qLower.includes('forest') || qLower.includes('write')) {
        responseText = "For your contemplative soul, **The Serenity Forest** is your sanctuary. You will dwell in a cantilevered cedar treehouse villa nestled 10 meters up in 300-year-old redwood branches. Enjoy private thermal onsens, 25 miles of cushioned forest trails, zero-acoustic glass, and daily phytoncide air baths that reduce cortisol by 42%.";
        recommendedSector = 'serenity-forest';
      } else if (qLower.includes('dinner') || qLower.includes('social') || qLower.includes('cook') || qLower.includes('neighbor') || qLower.includes('friend') || qLower.includes('jazz') || qLower.includes('host')) {
        responseText = "You will flourish in **The Village of Friends**! Designed around sunlit Tuscan piazzas, this neighborhood features shared chef kitchens, community woodfired pizza ovens, acoustic music courtyards, and our famous 100-seat Sunday Long-Table feasts. Residents from over 90 nationalities cook and share stories together every day.";
        recommendedSector = 'village-of-friends';
      } else if (qLower.includes('medicine') || qLower.includes('health') || qLower.includes('stem cell') || qLower.includes('spa') || qLower.includes('regenerative') || qLower.includes('oxygen') || qLower.includes('therapy')) {
        responseText = "Your ideal home is the **Longevity & Health Sanctuary**. Designed like an ultra-luxury Japanese Zen ryokan, you have direct in-suite access to hyperbaric oxygen chambers, cryotherapy, continuous AI metabolic monitoring, autologous stem-cell therapies, and volcanic mineral hydrotherapy cascades.";
        recommendedSector = 'longevity-health';
      } else if (qLower.includes('engineer') || qLower.includes('robot') || qLower.includes('mentor') || qLower.includes('patent') || qLower.includes('innovat') || qLower.includes('research') || qLower.includes('ai') || qLower.includes('learn')) {
        responseText = "Welcome home to **The Innovation Quarter**! You will be surrounded by fellow retired pioneers, Nobel laureates, and tech inventors. Enjoy 24/7 access to quantum compute clusters, rapid 3D prototyping labs, and the Wisdom Exchange Hall where you can mentor students and startup founders across 50 countries.";
        recommendedSector = 'innovation-quarter';
      } else if (qLower.includes('ocean') || qLower.includes('sunset') || qLower.includes('sea') || qLower.includes('view') || qLower.includes('luxury') || qLower.includes('swim')) {
        responseText = "You will adore **The Ocean Horizon** cliffside villas! Perched high over the Pacific waves, each suite features a private heated saltwater infinity pool, 180-degree sunset terraces, marine negative-ion sea breezes, and private funicular elevators down to pristine coastal lagoons.";
        recommendedSector = 'ocean-horizon';
      } else {
        responseText = `What an extraordinary vision for your life! eLite Home combines 500 acres of UNESCO-grade wilderness with six-star longevity medicine, organic farm-to-table cuisine, and world-class masterclasses. At the center lies **The Heart of Life Plaza**, where our community gathers daily under the glowing 60-meter Tree of Life.`;
        recommendedSector = 'heart-of-life';
      }

      const aiMsg = {
        sender: 'ai' as const,
        text: responseText,
        recommendedSector,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    }, 600);
  };

  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      const clean = text.replace(/[*_#]/g, '');
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.rate = 1.0;
      utterance.pitch = 1.05;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 text-white space-y-5 shadow-2xl" id="elite-home-concierge-root">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-md">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-black font-sans tracking-tight">
              Dr. T • eLite Home Relocation & Lifestyle Advisor
            </h3>
            <p className="text-[10px] text-stone-400 font-mono">Personalized Neighborhood & Longevity Matching</p>
          </div>
        </div>

        <button
          onClick={() => speakText(messages[messages.length - 1]?.text || '')}
          className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border border-stone-700
            ${isSpeaking ? 'bg-rose-600 text-white' : 'bg-stone-950 text-stone-300 hover:text-white'}
          `}
          title="Voice Guidance"
        >
          {isSpeaking ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline text-[10px]">{isSpeaking ? 'Speaking...' : 'Audio Voice'}</span>
        </button>
      </div>

      {/* Suggested Inquiries */}
      <div>
        <span className="text-[10px] font-mono text-stone-400 uppercase font-bold block mb-2">Explore Retirement Passions:</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="text-left p-2.5 rounded-xl bg-stone-950/80 border border-stone-800 hover:border-rose-500/50 text-[11px] text-stone-300 hover:text-white transition-all cursor-pointer leading-snug flex items-center justify-between gap-2 group"
            >
              <span className="line-clamp-1">{p}</span>
              <ArrowRight className="w-3 h-3 text-stone-500 group-hover:text-rose-400 shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2 scrollbar-thin">
        {messages.map((m, idx) => (
          <div 
            key={idx}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'} space-y-1`}
          >
            <div className="flex items-center gap-1.5 text-[9px] font-mono text-stone-400">
              <span>{m.sender === 'user' ? 'You' : 'Dr. T Concierge'}</span>
              <span>•</span>
              <span>{m.time}</span>
            </div>

            <div 
              className={`p-3.5 rounded-2xl max-w-xl text-xs leading-relaxed border
                ${m.sender === 'user' 
                  ? 'bg-rose-600 text-white border-rose-500 rounded-tr-none' 
                  : 'bg-stone-950 text-stone-200 border-stone-800 rounded-tl-none'}
              `}
            >
              <div className="whitespace-pre-wrap">{m.text}</div>

              {/* Jump to Recommended Sector Button */}
              {m.recommendedSector && (
                <div className="mt-3 pt-2 border-t border-stone-800 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-rose-400 font-bold">Recommended Sector Match</span>
                  <button
                    onClick={() => onJumpToDistrict(m.recommendedSector!)}
                    className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-all shadow-sm"
                  >
                    <MapPin className="w-3 h-3" /> Fly to Sector in 3D
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input Field */}
      <div className="flex items-center gap-2 pt-2 border-t border-stone-800">
        <input 
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Describe your dream lifestyle, climate preference, hobbies, or health priorities..."
          className="flex-1 bg-stone-950 border border-stone-800 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-rose-500"
        />
        <button
          onClick={() => handleSend()}
          className="bg-rose-600 hover:bg-rose-500 text-white p-2.5 rounded-2xl transition-all cursor-pointer font-bold shrink-0 shadow-md"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
