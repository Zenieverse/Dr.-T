import React, { useState } from 'react';
import { 
  Sparkles, Activity, Layers, Eye, Volume2, Brain, 
  Shield, Award, ExternalLink, RefreshCw, Cpu
} from 'lucide-react';
import { TaskmasterCanvas } from './TaskmasterCanvas';
import { VisionDecoder } from './VisionDecoder';
import { BarkAcousticDecoder } from './BarkAcousticDecoder';
import { CollaborativePartnerMemory } from './CollaborativePartnerMemory';
import { EnterpriseFleetModelArmor } from './EnterpriseFleetModelArmor';
import { StrandsAgentStudio } from '../StrandsAgentStudio';

export type PetWhispererTab = 
  | 'taskmaster' 
  | 'strands-hub' 
  | 'vision-decoder' 
  | 'bark-decoder' 
  | 'collaborative-memory' 
  | 'model-armor';

interface PetWhispererHubProps {
  initialTab?: PetWhispererTab;
}

export const PetWhispererHub: React.FC<PetWhispererHubProps> = ({ initialTab = 'taskmaster' }) => {
  const [activeSubTab, setActiveSubTab] = useState<PetWhispererTab>(initialTab);
  const [treatsBalance, setTreatsBalance] = useState<number>(1275);

  const handleTreatsEarned = (amount: number) => {
    setTreatsBalance(prev => prev + amount);
  };

  const navItems = [
    {
      id: 'taskmaster' as PetWhispererTab,
      label: 'PetWhisperer Pipeline',
      tag: '5-Stage Autonomous Engine',
      icon: <Activity className="w-4 h-4 text-amber-500" />,
      isGoldPrimary: true
    },
    {
      id: 'strands-hub' as PetWhispererTab,
      label: 'Strands Agents SDK',
      tag: 'Everyday • Pro • Neighbor Tracks',
      icon: <Cpu className="w-4 h-4 text-amber-600" />
    },
    {
      id: 'vision-decoder' as PetWhispererTab,
      label: 'Vision Decoder',
      tag: 'Gemini 3.7 Vision',
      icon: <Eye className="w-4 h-4 text-stone-700" />
    },
    {
      id: 'bark-decoder' as PetWhispererTab,
      label: 'Bark Acoustic Decoder',
      tag: 'FFT Spectrogram',
      icon: <Volume2 className="w-4 h-4 text-stone-700" />
    },
    {
      id: 'collaborative-memory' as PetWhispererTab,
      label: 'Collaborative Memory',
      tag: 'Ethology RAG Bank',
      icon: <Brain className="w-4 h-4 text-stone-700" />
    },
    {
      id: 'model-armor' as PetWhispererTab,
      label: 'Enterprise & Model Armor',
      tag: 'Guardrails & Safety',
      icon: <Shield className="w-4 h-4 text-stone-700" />
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A] p-3 sm:p-6 lg:p-8 space-y-6 font-sans antialiased" id="petwhisperer-master-hub">
      
      {/* Top Command Bar */}
      <div className="bg-white border-2 border-stone-900 rounded-3xl p-4 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-stone-950 text-amber-300 flex items-center justify-center font-serif text-2xl font-black shadow-inner border border-amber-400/40 shrink-0">
            🐾
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif italic font-black text-xl sm:text-2xl text-stone-900 tracking-tight">
                PetWhisperer AI
              </span>
              <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-950 border border-amber-500/40 rounded-full font-mono text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" />
                CanineWhisperer Platform
              </span>
            </div>
            <p className="text-xs font-mono text-stone-600">
              Autonomous Cross-Species Veterinary Ethology & Bio-Acoustic De-Escalation Architecture
            </p>
          </div>
        </div>

        {/* Live Treats Wallet Balance & Protocol Status */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2 bg-stone-950 text-amber-300 font-mono text-xs rounded-2xl border border-amber-400/40 flex items-center gap-2 shadow-sm">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Wallet: <strong className="text-white text-sm font-black">{treatsBalance}</strong> $TREATS</span>
          </div>

          <div className="px-3 py-1.5 bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-xl font-mono text-[11px] font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
            <span>Solana Devnet Online</span>
          </div>
        </div>

      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {navItems.map(item => {
          const isActive = activeSubTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSubTab(item.id)}
              className={`px-4 py-3 rounded-2xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap border shrink-0 ${
                isActive
                  ? item.isGoldPrimary 
                    ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-stone-950 border-amber-500 shadow-md font-black ring-2 ring-amber-400/50' 
                    : 'bg-stone-900 text-white border-stone-900 shadow-md'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100 hover:text-stone-950'
              }`}
              id={`subtab-${item.id}-btn`}
            >
              {item.icon}
              <span>{item.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                isActive 
                  ? item.isGoldPrimary ? 'bg-stone-950 text-amber-300' : 'bg-stone-800 text-stone-300' 
                  : 'bg-stone-100 text-stone-500'
              }`}>
                {item.tag}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Active Module Container */}
      <div className="transition-all duration-300">
        {activeSubTab === 'taskmaster' && (
          <TaskmasterCanvas
            treatsBalance={treatsBalance}
            onTreatsEarned={handleTreatsEarned}
          />
        )}

        {activeSubTab === 'strands-hub' && (
          <div className="space-y-4">
            <div className="bg-white border border-stone-800 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <h3 className="font-serif font-black text-base text-stone-900">
                  02 Strands Agents SDK & AgentCore Multi-Track Execution Hub
                </h3>
                <p className="text-xs font-mono text-stone-500">
                  Track A (Everyday Home Guardian), Track B (Clinical Veterinary SOAP Scribe), Track C (Community Animal Mesh).
                </p>
              </div>
              <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded font-mono text-xs font-bold">
                AWS AgentCore Pattern
              </span>
            </div>
            <StrandsAgentStudio />
          </div>
        )}

        {activeSubTab === 'vision-decoder' && (
          <VisionDecoder />
        )}

        {activeSubTab === 'bark-decoder' && (
          <BarkAcousticDecoder />
        )}

        {activeSubTab === 'collaborative-memory' && (
          <CollaborativePartnerMemory />
        )}

        {activeSubTab === 'model-armor' && (
          <EnterpriseFleetModelArmor />
        )}
      </div>

    </div>
  );
};
