import React, { useState } from 'react';
import { 
  Sparkles, 
  Cpu, 
  Cloud, 
  Eye, 
  Mic, 
  BrainCircuit, 
  Server, 
  Volume2, 
  Database, 
  Coins, 
  Layers, 
  ChevronDown, 
  ExternalLink,
  ShieldCheck,
  Activity,
  Radio
} from 'lucide-react';
import { PetWhispererTab, CanineSubject } from './types';
import { AutonomousTaskmasterCanvas } from './AutonomousTaskmasterCanvas';
import { StrandsAgentCoreHub } from './StrandsAgentCoreHub';
import { GoogleCloudInfrastructureStudio } from './GoogleCloudInfrastructureStudio';
import { VisionDecoder } from './VisionDecoder';
import { BarkAcousticDecoder } from './BarkAcousticDecoder';
import { CollaborativePartner } from './CollaborativePartner';
import { EnterpriseFleetArmor } from './EnterpriseFleetArmor';
import { AcousticWhistleStudio } from './AcousticWhistleStudio';
import { SnowflakeDWStudio } from './SnowflakeDWStudio';
import { SolanaDevnetStudio } from './SolanaDevnetStudio';
import { ArchitectureDiagramModal } from './ArchitectureDiagramModal';

export const PetWhispererApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PetWhispererTab>('01_taskmaster');
  const [isArchModalOpen, setIsArchModalOpen] = useState<boolean>(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState<boolean>(false);

  // Subject Profile
  const [currentSubject, setCurrentSubject] = useState<CanineSubject>({
    id: 'canine_buster_001',
    name: 'Buster',
    breed: 'Golden Retriever',
    age: '3yo',
    cgcCertified: true,
    baselineArousal: 22,
    restingHeartRate: 74,
    primaryTriggers: ['Doorbell (92 dB)', 'Thunderstorm', 'Amazon Delivery Truck']
  });

  const [subjectsList] = useState<CanineSubject[]>([
    {
      id: 'canine_buster_001',
      name: 'Buster',
      breed: 'Golden Retriever',
      age: '3yo',
      cgcCertified: true,
      baselineArousal: 22,
      restingHeartRate: 74,
      primaryTriggers: ['Doorbell (92 dB)', 'Thunderstorm', 'Amazon Delivery Truck']
    },
    {
      id: 'canine_luna_002',
      name: 'Luna',
      breed: 'German Shepherd',
      age: '4yo',
      cgcCertified: false,
      baselineArousal: 35,
      restingHeartRate: 82,
      primaryTriggers: ['Leash Reactivity', 'Skateboard Noise']
    },
    {
      id: 'canine_milo_003',
      name: 'Milo',
      breed: 'French Bulldog',
      age: '2yo',
      cgcCertified: true,
      baselineArousal: 18,
      restingHeartRate: 90,
      primaryTriggers: ['Vacuum Cleaner', 'Isolation Anxiety']
    }
  ]);

  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);

  // Numbered tabs definition
  const TABS_CONFIG = [
    {
      id: '01_taskmaster' as PetWhispererTab,
      number: '01',
      title: 'AUTONOMOUS TASKMASTER',
      sub: 'Gemini Cognitive Core',
      icon: <Sparkles className="w-4 h-4 text-amber-500" />,
      badge: 'TRACK 1 PRIMARY',
      badgeClass: 'bg-amber-400 text-black border-amber-300 font-extrabold animate-pulse'
    },
    {
      id: '02_strands' as PetWhispererTab,
      number: '02',
      title: 'STRANDS & AGENTCORE',
      sub: 'Everyday, Pro, Neighbor',
      icon: <Cpu className="w-4 h-4 text-indigo-500" />,
      badge: 'AWS ARCH',
      badgeClass: 'bg-stone-200 text-stone-800 border-stone-300 font-bold'
    },
    {
      id: 'gcp_cloud' as PetWhispererTab,
      number: 'GCP',
      title: 'GOOGLE CLOUD & PUB/SUB',
      sub: 'Cloud Run Ingress',
      icon: <Cloud className="w-4 h-4 text-sky-500" />,
      badge: 'GCP',
      badgeClass: 'bg-sky-100 text-sky-900 border-sky-300 font-bold'
    },
    {
      id: '03_vision' as PetWhispererTab,
      number: '03',
      title: 'VISION DECODER',
      sub: 'Gemini 2.5/3.7 Vision',
      icon: <Eye className="w-4 h-4 text-emerald-500" />
    },
    {
      id: '04_bark' as PetWhispererTab,
      number: '04',
      title: 'BARK ACOUSTIC',
      sub: 'Audio Spectrogram',
      icon: <Mic className="w-4 h-4 text-rose-500" />
    },
    {
      id: '05_partner' as PetWhispererTab,
      number: '05',
      title: 'COLLABORATIVE PARTNER',
      sub: 'RAG Memory Bank',
      icon: <BrainCircuit className="w-4 h-4 text-purple-500" />,
      badge: 'T2',
      badgeClass: 'bg-purple-100 text-purple-900 border-purple-300 font-bold'
    },
    {
      id: '06_fleet' as PetWhispererTab,
      number: '06',
      title: 'ENTERPRISE FLEET',
      sub: 'Model Armor',
      icon: <Server className="w-4 h-4 text-stone-700" />,
      badge: 'T3',
      badgeClass: 'bg-stone-200 text-stone-800 border-stone-300 font-bold'
    },
    {
      id: '07_whistle' as PetWhispererTab,
      number: '07',
      title: 'ACOUSTIC WHISTLE',
      sub: 'Ultrasonic',
      icon: <Volume2 className="w-4 h-4 text-teal-500" />
    },
    {
      id: '08_snowflake' as PetWhispererTab,
      number: '08',
      title: 'SNOWFLAKE DW',
      sub: 'Cortex ML',
      icon: <Database className="w-4 h-4 text-blue-600" />
    },
    {
      id: '09_solana' as PetWhispererTab,
      number: '09',
      title: 'SOLANA DEVNET',
      sub: 'ed25519 Passport',
      icon: <Coins className="w-4 h-4 text-purple-600" />
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A] font-sans antialiased selection:bg-amber-200 selection:text-black">
      
      {/* Top Header Utilities Bar */}
      <div className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#1A1A1A]/15">
        
        {/* Brand & Active System Tags Strip */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#1A1A1A] flex items-center justify-center text-amber-400 font-bold shadow-xs">
              🐾
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">
                  CANINE ETHOLOGY INTELLIGENCE SYSTEM
                </span>
                <span className="text-[10px] font-mono text-stone-400">CORE v2.4</span>
              </div>
              <h1 className="text-lg sm:text-xl font-serif italic font-light tracking-tight text-[#1A1A1A]">
                K9Whisperer <span className="text-xs font-mono font-normal not-italic text-stone-500">(CanineWhisperer)</span>
              </h1>
            </div>
          </div>

          {/* Active Status Tags & Subject Picker */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono">
            
            {/* Status Tags */}
            <div className="hidden lg:flex items-center space-x-2 text-[11px] text-stone-600 bg-white px-3 py-1.5 rounded-xl border border-stone-300">
              <span className="text-purple-700 font-bold">NETWORK: SOLANA DEVNET</span>
              <span>•</span>
              <span className="text-indigo-700 font-bold">STORAGE: SNOWFLAKE DW</span>
              <span>•</span>
              <span className="text-sky-700 font-bold">INGRESS: CLOUD RUN</span>
            </div>

            {/* Subject Profile Picker */}
            <div className="relative">
              <button
                onClick={() => setIsSubjectDropdownOpen(!isSubjectDropdownOpen)}
                className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-[#1A1A1A] text-xs font-mono font-bold text-stone-900 hover:bg-stone-50 transition shadow-xs"
              >
                <span>🐾 {currentSubject.name} ({currentSubject.breed}) {currentSubject.age} / {currentSubject.cgcCertified ? 'CGC Certified' : 'In Training'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
              </button>

              {isSubjectDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white border-2 border-[#1A1A1A] rounded-xl shadow-xl z-50 p-2 space-y-1">
                  <div className="text-[10px] font-mono font-bold text-stone-400 px-2 py-1 uppercase">
                    Select Canine Subject Profile
                  </div>
                  {subjectsList.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setCurrentSubject(s);
                        setIsSubjectDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg text-xs font-mono transition flex justify-between items-center ${
                        currentSubject.id === s.id
                          ? 'bg-amber-50 text-amber-950 font-bold border border-amber-300'
                          : 'hover:bg-stone-100 text-stone-800'
                      }`}
                    >
                      <div>
                        <div>🐾 {s.name} ({s.breed})</div>
                        <div className="text-[10px] text-stone-500">{s.age} • {s.cgcCertified ? 'CGC Certified' : 'In Training'}</div>
                      </div>
                      {currentSubject.id === s.id && <span className="text-amber-600 font-bold text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <button
              onClick={() => setIsArchModalOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#1A1A1A] text-stone-900 hover:bg-stone-100 transition shadow-xs font-bold text-xs"
            >
              <Layers className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Architecture PNG</span>
            </button>

            <button
              onClick={() => setActiveTab('09_solana')}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#1A1A1A] text-white hover:bg-stone-800 transition shadow-xs font-bold text-xs"
            >
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>+250 TREATS</span>
            </button>

          </div>

        </div>

        {/* Numbered Command Strip */}
        <div className="border-t border-[#1A1A1A]/10 bg-white/80 backdrop-blur-sm overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 py-1.5 min-w-max">
            {TABS_CONFIG.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 rounded-xl text-left transition flex flex-col justify-between space-y-0.5 border ${
                    isActive
                      ? 'bg-[#FAF9F6] border-[#1A1A1A] text-[#1A1A1A] shadow-xs'
                      : 'border-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
                  }`}
                >
                  <div className="flex items-center space-x-1.5">
                    {tab.icon}
                    <span className="font-mono text-xs font-bold whitespace-nowrap">
                      {tab.title}
                    </span>
                    {tab.badge && (
                      <span className={`text-[9px] px-1.5 py-0.2 rounded border font-mono ${tab.badgeClass}`}>
                        {tab.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] font-mono text-stone-500 pl-5 whitespace-nowrap">
                    {tab.sub}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Main Content View Switcher */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {activeTab === '01_taskmaster' && <AutonomousTaskmasterCanvas />}
        {activeTab === '02_strands' && <StrandsAgentCoreHub />}
        {activeTab === 'gcp_cloud' && <GoogleCloudInfrastructureStudio />}
        {activeTab === '03_vision' && <VisionDecoder />}
        {activeTab === '04_bark' && <BarkAcousticDecoder />}
        {activeTab === '05_partner' && <CollaborativePartner />}
        {activeTab === '06_fleet' && <EnterpriseFleetArmor />}
        {activeTab === '07_whistle' && <AcousticWhistleStudio />}
        {activeTab === '08_snowflake' && <SnowflakeDWStudio />}
        {activeTab === '09_solana' && <SolanaDevnetStudio />}

      </main>

      {/* Architecture Modal */}
      <ArchitectureDiagramModal 
        isOpen={isArchModalOpen}
        onClose={() => setIsArchModalOpen(false)}
      />

    </div>
  );
};
