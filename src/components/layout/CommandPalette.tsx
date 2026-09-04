import React, { useState, useEffect } from 'react';
import { NavTab } from '../../types';
import { 
  Search, 
  HeartPulse, 
  Activity, 
  FileText, 
  Cpu, 
  FlaskConical, 
  Sparkles, 
  Bot, 
  ShieldCheck, 
  Zap, 
  Settings, 
  Mic, 
  Upload, 
  FileSpreadsheet,
  Cloud,
  X,
  Trees,
  BookOpen,
  Clock
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: NavTab) => void;
  openVoiceMode: () => void;
  onSelectAction?: (actionKey: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  setActiveTab,
  openVoiceMode,
  onSelectAction,
}) => {
  const [search, setSearch] = useState('');

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle handled by parent
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commands = [
    {
      category: '🌳 Trib-House (The Living Library in the Trees)',
      items: [
        { 
          label: 'Living Forests & World Library Map (16 Countries, Mobile Fleets)', 
          icon: <Trees className="w-4 h-4 text-emerald-600" />, 
          action: () => { 
            setActiveTab('tribhouse'); 
            onClose(); 
            window.dispatchEvent(new CustomEvent('tribhouse-navigate', { detail: { view: 'living-forests' } })); 
          } 
        },
        { 
          label: 'Living Campus 3D (Pavilions, Blueprints & Perspectives)', 
          icon: <Trees className="w-4 h-4 text-teal-600" />, 
          action: () => { 
            setActiveTab('tribhouse'); 
            onClose(); 
            window.dispatchEvent(new CustomEvent('tribhouse-navigate', { detail: { view: 'campus' } })); 
          } 
        },
        { 
          label: 'Open Trib-House Living Treehouse Commons (Village Hub)', 
          icon: <Trees className="w-4 h-4 text-emerald-600" />, 
          action: () => { 
            setActiveTab('tribhouse'); 
            onClose(); 
            window.dispatchEvent(new CustomEvent('tribhouse-navigate', { detail: { view: 'village' } })); 
          } 
        },
        { 
          label: 'Ask Trib — AI Knowledge Steward & Librarian', 
          icon: <Bot className="w-4 h-4 text-teal-500" />, 
          action: () => { 
            setActiveTab('tribhouse'); 
            onClose(); 
            window.dispatchEvent(new CustomEvent('tribhouse-open-librarian')); 
            onSelectAction?.('trib_ask'); 
          } 
        },
        { 
          label: 'Open Reading Nest (Books, PDFs, Ingress)', 
          icon: <BookOpen className="w-4 h-4 text-amber-500" />, 
          action: () => { 
            setActiveTab('tribhouse'); 
            onClose(); 
            window.dispatchEvent(new CustomEvent('tribhouse-navigate', { detail: { view: 'reading' } })); 
            onSelectAction?.('trib_library'); 
          } 
        },
        { 
          label: 'Explore Knowledge Graph & Idea Connections', 
          icon: <Sparkles className="w-4 h-4 text-purple-500" />, 
          action: () => { 
            setActiveTab('tribhouse'); 
            onClose(); 
            window.dispatchEvent(new CustomEvent('tribhouse-navigate', { detail: { view: 'graph' } })); 
            onSelectAction?.('trib_graph'); 
          } 
        },
        { 
          label: 'Open Personal Knowledge Forest & Flourishing', 
          icon: <Trees className="w-4 h-4 text-green-500" />, 
          action: () => { 
            setActiveTab('tribhouse'); 
            onClose(); 
            window.dispatchEvent(new CustomEvent('tribhouse-navigate', { detail: { view: 'forest' } })); 
            onSelectAction?.('trib_forest'); 
          } 
        },
        { 
          label: 'Future Library — 100-Year Branch & Letters to 2036..2126', 
          icon: <Clock className="w-4 h-4 text-indigo-400" />, 
          action: () => { 
            setActiveTab('tribhouse'); 
            onClose(); 
            window.dispatchEvent(new CustomEvent('tribhouse-navigate', { detail: { view: 'century' } })); 
            onSelectAction?.('trib_future'); 
          } 
        },
        { 
          label: 'Earth & Groves Dashboard (Knowledge-to-Ground TreeLedger)', 
          icon: <Trees className="w-4 h-4 text-emerald-500" />, 
          action: () => { 
            setActiveTab('tribhouse'); 
            onClose(); 
            window.dispatchEvent(new CustomEvent('tribhouse-navigate', { detail: { view: 'groves' } })); 
            onSelectAction?.('trib_earth'); 
          } 
        },
        { 
          label: 'Launch Slow Zen Reading & Forest Soundscapes', 
          icon: <Sparkles className="w-4 h-4 text-teal-400" />, 
          action: () => { 
            setActiveTab('tribhouse'); 
            onClose(); 
            window.dispatchEvent(new CustomEvent('tribhouse-navigate', { detail: { view: 'reading' } })); 
            onSelectAction?.('trib_zen'); 
          } 
        },
      ],
    },
    {
      category: 'Conversational Health',
      items: [
        { label: 'Talk to Dr. T (Socratic Health Companion)', icon: <HeartPulse className="w-4 h-4 text-rose-500" />, action: () => { setActiveTab('drt'); onClose(); } },
        { label: 'Launch Live Voice Mode', icon: <Mic className="w-4 h-4 text-rose-500" />, action: () => { openVoiceMode(); onClose(); } },
        { label: 'Upload Lab Report / Image for Analysis', icon: <Upload className="w-4 h-4 text-cyan-600" />, action: () => { setActiveTab('drt'); onClose(); onSelectAction?.('upload'); } },
      ],
    },
    {
      category: 'Health Intelligence & Timeline',
      items: [
        { label: 'Open Longitudinal Health Timeline', icon: <Activity className="w-4 h-4 text-emerald-500" />, action: () => { setActiveTab('intelligence'); onClose(); } },
        { label: 'View Biomarker Trends & Sleep Correlations', icon: <Activity className="w-4 h-4 text-emerald-500" />, action: () => { setActiveTab('intelligence'); onClose(); } },
      ],
    },
    {
      category: 'Clinical Informatics & FHIR',
      items: [
        { label: 'Generate SOAP Clinical Progress Note', icon: <FileText className="w-4 h-4 text-blue-500" />, action: () => { setActiveTab('informatics'); onClose(); } },
        { label: 'Interpret Laboratory Results (Serum Ferritin, CMP, CBC)', icon: <FileSpreadsheet className="w-4 h-4 text-blue-500" />, action: () => { setActiveTab('informatics'); onClose(); } },
        { label: 'Inspect FHIR R4 Interoperability Graph', icon: <FileText className="w-4 h-4 text-blue-500" />, action: () => { setActiveTab('informatics'); onClose(); } },
      ],
    },
    {
      category: 'K9Whisperer',
      items: [
        { label: '01 Autonomous Taskmaster & 5-Stage Pipeline', icon: <Sparkles className="w-4 h-4 text-amber-500" />, action: () => { setActiveTab('petwhisperer'); onClose(); } },
        { label: '02 Strands & AgentCore Hub (Everyday & Clinical SOAP)', icon: <Cpu className="w-4 h-4 text-indigo-500" />, action: () => { setActiveTab('petwhisperer'); onClose(); } },
        { label: '03 Vision Decoder (Micro-Expression & Whale Eye)', icon: <Activity className="w-4 h-4 text-emerald-500" />, action: () => { setActiveTab('petwhisperer'); onClose(); } },
        { label: '04 Bark Acoustic & Spectrogram (FFT & HNR)', icon: <Mic className="w-4 h-4 text-rose-500" />, action: () => { setActiveTab('petwhisperer'); onClose(); } },
        { label: '07 Web Audio 432 Hz Resonator & Ultrasonic Whistle', icon: <Zap className="w-4 h-4 text-teal-500" />, action: () => { setActiveTab('petwhisperer'); onClose(); } },
        { label: '09 Solana Devnet On-Chain Passport & TREATS Mint', icon: <Zap className="w-4 h-4 text-purple-500" />, action: () => { setActiveTab('petwhisperer'); onClose(); } },
      ],
    },
    {
      category: 'OpenWebOS (WebMCP Workspace)',
      items: [
        { label: 'Open OpenWebOS Agentic Web Canvas', icon: <Bot className="w-4 h-4 text-cyan-400" />, action: () => { setActiveTab('openwebos'); onClose(); } },
        { label: 'Run 2-Minute WebMCP Demo Scenario', icon: <Sparkles className="w-4 h-4 text-teal-400" />, action: () => { setActiveTab('openwebos'); onClose(); } },
        { label: 'Inspect 12 WebMCP Tool Schemas & Sandbox', icon: <FileText className="w-4 h-4 text-indigo-400" />, action: () => { setActiveTab('openwebos'); onClose(); } },
        { label: 'View Zero-Trust Safety & Cryptographic Audit', icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />, action: () => { setActiveTab('openwebos'); onClose(); } },
      ],
    },
    {
      category: 'GreenieVerse (Galactic Agriculture AI)',
      items: [
        { label: 'Launch GreenieVerse Command Center (10x10 Grid)', icon: <span className="text-sm">🌌</span>, action: () => { setActiveTab('greenieverse'); onClose(); } },
        { label: 'Market Arbitrage Terminal & Price Forecasts', icon: <Activity className="w-4 h-4 text-emerald-400" />, action: () => { setActiveTab('greenieverse'); onClose(); } },
        { label: 'GreenieCulture Strategy & Performance Benchmark', icon: <Zap className="w-4 h-4 text-amber-400" />, action: () => { setActiveTab('greenieverse'); onClose(); } },
        { label: 'Evolutionary Strategy Lab & Self-Play', icon: <Cpu className="w-4 h-4 text-purple-400" />, action: () => { setActiveTab('greenieverse'); onClose(); } },
        { label: 'Export Kaggle submission/main.py Agent', icon: <FileText className="w-4 h-4 text-cyan-400" />, action: () => { setActiveTab('greenieverse'); onClose(); } },
      ],
    },
    {
      category: 'AI Multi-Agent Swarm',
      items: [
        { label: 'Launch AI Swarm Orchestrator (7 Agents)', icon: <Cpu className="w-4 h-4 text-purple-500" />, action: () => { setActiveTab('swarm'); onClose(); } },
        { label: 'Inspect Agent Disagreement & Reasoning Review', icon: <Cpu className="w-4 h-4 text-purple-500" />, action: () => { setActiveTab('swarm'); onClose(); } },
      ],
    },
    {
      category: 'Research Lab & Predictive Analytics',
      items: [
        { label: 'Explore Biomedical Evidence & Literature (GRADE)', icon: <FlaskConical className="w-4 h-4 text-amber-500" />, action: () => { setActiveTab('research'); onClose(); } },
        { label: 'Run ICU Deterioration & Length-of-Stay Simulation', icon: <FlaskConical className="w-4 h-4 text-amber-500" />, action: () => { setActiveTab('research'); onClose(); } },
        { label: 'Model Arena: Compare Clinical Reasoning Benchmarks', icon: <FlaskConical className="w-4 h-4 text-amber-500" />, action: () => { setActiveTab('research'); onClose(); } },
      ],
    },
    {
      category: 'SmArist AR & Wellness Studio',
      items: [
        { label: 'Virtual Try-On 3D WebCam AR Studio', icon: <Sparkles className="w-4 h-4 text-pink-500" />, action: () => { setActiveTab('smarist'); onClose(); } },
        { label: '14-Dimension Spectroscopic Skin Analysis', icon: <Sparkles className="w-4 h-4 text-pink-500" />, action: () => { setActiveTab('smarist'); onClose(); } },
        { label: 'Longitudinal Skin Age Simulator (-5 to +20 yrs)', icon: <Sparkles className="w-4 h-4 text-pink-500" />, action: () => { setActiveTab('smarist'); onClose(); } },
      ],
    },
    {
      category: 'Automation & Governance',
      items: [
        { label: 'Clinical Workflow & RPA Control Center', icon: <Bot className="w-4 h-4 text-teal-500" />, action: () => { setActiveTab('automation'); onClose(); } },
        { label: 'Sovereign Privacy & Zero-Knowledge Proof Center', icon: <ShieldCheck className="w-4 h-4 text-indigo-500" />, action: () => { setActiveTab('privacy'); onClose(); } },
        { label: 'Agent Economy & x402 Micro-Transaction Marketplace', icon: <Zap className="w-4 h-4 text-amber-500" />, action: () => { setActiveTab('economy'); onClose(); } },
        { label: 'Google Cloud Infrastructure & Firestore Hub', icon: <Cloud className="w-4 h-4 text-sky-500" />, action: () => { setActiveTab('gcp'); onClose(); } },
        { label: 'Platform & AI Model Configuration Settings', icon: <Settings className="w-4 h-4 text-slate-500" />, action: () => { setActiveTab('settings'); onClose(); } },
      ],
    },
  ];

  const filtered = commands.map(grp => ({
    ...grp,
    items: grp.items.filter(item => 
      item.label.toLowerCase().includes(search.toLowerCase()) ||
      grp.category.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(grp => grp.items.length > 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150 flex items-start justify-center">
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            type="text"
            placeholder="Type a command or search health modules..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command list */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No matching commands or modules found for "{search}".
            </div>
          ) : (
            filtered.map((grp) => (
              <div key={grp.category} className="space-y-1">
                <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {grp.category}
                </div>
                {grp.items.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={item.action}
                    className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 text-left transition group"
                  >
                    <span className="p-1.5 rounded-lg bg-slate-50 group-hover:bg-white border border-slate-200 shadow-2xs">
                      {item.icon}
                    </span>
                    <span className="text-xs font-semibold text-slate-800 group-hover:text-slate-950">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center space-x-2">
            <span>Navigate with click or arrow keys</span>
          </div>
          <span className="font-mono text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-600">
            ESC to close
          </span>
        </div>
      </div>
    </div>
  );
};
