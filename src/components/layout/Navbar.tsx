import React from 'react';
import { NavTab, LanguageCode, PlatformNotification } from '../../types';
import { DR_T_AVATAR } from '../../assets/drTAvatar';
import { 
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
  Bell, 
  Command, 
  Compass,
  Globe,
  Cloud
} from 'lucide-react';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  currentLanguage: LanguageCode;
  setCurrentLanguage: (lang: LanguageCode) => void;
  notifications: PlatformNotification[];
  openNotifications: () => void;
  openCommandPalette: () => void;
  openVoiceMode: () => void;
  openDemoJourney: () => void;
}

const LANGUAGES: Array<{ code: LanguageCode; label: string; flag: string }> = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentLanguage,
  setCurrentLanguage,
  notifications,
  openNotifications,
  openCommandPalette,
  openVoiceMode,
  openDemoJourney,
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems: Array<{ id: NavTab; label: string; icon: React.ReactNode; badge?: string }> = [
    { 
      id: 'drt', 
      label: 'Dr. T', 
      icon: (
        <div className="w-5 h-5 rounded-full overflow-hidden ring-1 ring-rose-400/50 shrink-0">
          <img src={DR_T_AVATAR} alt="Dr. T" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
        </div>
      ) 
    },
    { id: 'petwhisperer', label: 'PetWhisperer', icon: <span className="text-sm">🐾</span> },
    { id: 'intelligence', label: 'Health Intelligence', icon: <Activity className="w-4 h-4 text-emerald-500" /> },
    { id: 'informatics', label: 'Clinical Informatics', icon: <FileText className="w-4 h-4 text-blue-500" /> },
    { id: 'swarm', label: 'AI Swarm', icon: <Cpu className="w-4 h-4 text-purple-500" />, badge: '7 Agents' },
    { id: 'research', label: 'Research Lab', icon: <FlaskConical className="w-4 h-4 text-amber-500" /> },
    { id: 'smarist', label: 'SmArist AR', icon: <Sparkles className="w-4 h-4 text-pink-500" />, badge: 'AR' },
    { id: 'automation', label: 'Automation', icon: <Bot className="w-4 h-4 text-teal-500" /> },
    { id: 'privacy', label: 'Privacy', icon: <ShieldCheck className="w-4 h-4 text-indigo-500" /> },
    { id: 'economy', label: 'Agent Economy', icon: <Zap className="w-4 h-4 text-amber-500" />, badge: 'x402' },
    { id: 'gcp', label: 'Google Cloud & Firestore', icon: <Cloud className="w-4 h-4 text-sky-500" />, badge: 'GCP' },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4 text-slate-400" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Banner & Quick Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Identity */}
          <div 
            onClick={() => setActiveTab('drt')}
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl overflow-hidden ring-2 ring-teal-500/50 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition transform">
              <img 
                src={DR_T_AVATAR} 
                alt="Dr. T" 
                referrerPolicy="no-referrer" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-black text-slate-900 tracking-tight font-display">
                  Dr. T
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-teal-100 text-teal-800 border border-teal-200">
                  Biomedical AI
                </span>
              </div>
            </div>
          </div>

          {/* Center Quick Action Controls */}
          <div className="flex items-center space-x-2">
            {/* Command Palette trigger */}
            <button
              onClick={openCommandPalette}
              className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs border border-slate-200 transition"
              title="Global Search & Commands (⌘K)"
            >
              <Command className="w-3.5 h-3.5 text-slate-400" />
              <span>Search or ask...</span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white rounded border border-slate-300 shadow-2xs text-slate-500">
                ⌘K
              </kbd>
            </button>

            {/* Voice Mode Quick Launch */}
            <button
              onClick={openVoiceMode}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-xs font-bold shadow-sm shadow-rose-500/20 transition animate-pulse"
              title="Launch Live Voice Conversation"
            >
              <Mic className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Live Voice</span>
            </button>

            {/* Demo Journey Walkthrough */}
            <button
              onClick={openDemoJourney}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold transition"
            >
              <Compass className="w-3.5 h-3.5 text-teal-600" />
              <span className="hidden sm:inline">Guided Tour</span>
            </button>

            {/* Language Selector */}
            <div className="relative group">
              <button className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-200 transition">
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span className="uppercase text-[11px] font-bold">{currentLanguage}</span>
              </button>
              <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 hidden group-hover:block z-50 animate-in fade-in zoom-in-95">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setCurrentLanguage(lang.code)}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center space-x-2 hover:bg-slate-50 transition ${
                      currentLanguage === lang.code ? 'font-bold text-teal-700 bg-teal-50' : 'text-slate-700'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Notification Center Trigger */}
            <button
              onClick={openNotifications}
              className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

          </div>

        </div>

        {/* Primary Tab Navigation Ribbon */}
        <nav className="flex space-x-1 overflow-x-auto scrollbar-none py-1 border-t border-slate-100">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

      </div>
    </header>
  );
};
