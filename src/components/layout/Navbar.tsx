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
  Cloud,
  Cake,
  Trees,
  Infinity,
  Heart,
  Coins
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
  openBirthdayModal?: () => void;
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
  openBirthdayModal,
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems: Array<{ id: NavTab; label: string; icon: React.ReactNode; badge?: string }> = [
    { 
      id: 'drt', 
      label: 'Dr. T', 
      icon: (
        <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-rose-500 via-purple-500 to-teal-400 flex items-center justify-center shrink-0 text-white shadow-2xs">
          <Infinity className="w-3.5 h-3.5" />
        </div>
      ) 
    },
    { id: 'tribhouse', label: '🌳 Trib-House', icon: <Trees className="w-4 h-4 text-emerald-600" />, badge: 'Living Library' },
    { id: 'petwhisperer', label: 'K9Whisperer', icon: <span className="text-sm">🐾</span> },
    { id: 'openwebos', label: 'OpenWebOS', icon: <Globe className="w-4 h-4 text-cyan-500" />, badge: 'WebMCP' },
    { id: 'greenieverse', label: 'GreenieVerse', icon: <span className="text-sm">🌌</span>, badge: 'Galactic' },
    { id: 'intelligence', label: 'Health Intelligence', icon: <Activity className="w-4 h-4 text-emerald-500" /> },
    { id: 'informatics', label: 'Clinical Informatics', icon: <FileText className="w-4 h-4 text-blue-500" /> },
    { id: 'swarm', label: 'AI Swarm', icon: <Cpu className="w-4 h-4 text-purple-500" />, badge: '7 Agents' },
    { id: 'research', label: 'Research Lab', icon: <FlaskConical className="w-4 h-4 text-amber-500" /> },
    { id: 'smarist', label: 'SmArtist AR', icon: <Sparkles className="w-4 h-4 text-pink-500" />, badge: 'AR' },
    { id: 'automation', label: 'Automation', icon: <Bot className="w-4 h-4 text-teal-500" /> },
    { id: 'privacy', label: 'Privacy', icon: <ShieldCheck className="w-4 h-4 text-indigo-500" /> },
    { id: 'x402', label: 'x402 Pay-Per-Request', icon: <Coins className="w-4 h-4 text-amber-500" />, badge: 'x402' },
    { id: 'economy', label: 'Agent Economy', icon: <Zap className="w-4 h-4 text-amber-500" /> },
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
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 via-purple-500 to-teal-400 p-0.5 shadow-md shadow-rose-500/15 group-hover:scale-105 transition transform">
              <div className="w-full h-full bg-gradient-to-br from-white via-rose-50/50 to-teal-50/50 rounded-[14px] flex items-center justify-center shadow-inner">
                <Infinity className="w-6 h-6 text-rose-500 group-hover:text-teal-600 transition-colors" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 border-2 border-white flex items-center justify-center shadow-xs">
                <Heart className="w-2 h-2 text-white fill-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-black bg-gradient-to-r from-rose-600 via-pink-600 to-teal-600 bg-clip-text text-transparent tracking-tight font-display">
                  Dr. T
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-rose-50 to-teal-50 text-rose-800 border border-rose-200/80 shadow-2xs">
                  <Heart className="w-2.5 h-2.5 text-rose-500 fill-rose-500 shrink-0" />
                  <span>Polymath with Heart</span>
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

            {/* Birthday Celebration Window Trigger */}
            {openBirthdayModal && (
              <button
                onClick={openBirthdayModal}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-rose-400 to-pink-500 hover:from-amber-500 hover:to-pink-600 text-slate-950 text-xs font-black shadow-sm shadow-amber-500/20 transition transform hover:scale-105"
                title="Open Birthday Dedication & Poem"
              >
                <Cake className="w-3.5 h-3.5 text-slate-950" />
                <span className="hidden sm:inline">🎂 Birthday</span>
              </button>
            )}

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
        <nav className="flex space-x-1.5 overflow-x-auto scrollbar-none py-1.5 border-t border-slate-100">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            
            // Dynamic bright active styles
            const getActiveStyle = (id: NavTab) => {
              switch (id) {
                case 'drt':
                  return 'bg-gradient-to-r from-rose-500 via-purple-500 to-pink-500 text-white shadow-md shadow-rose-500/25 ring-1 ring-rose-300/40';
                case 'tribhouse':
                  return 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/25 ring-1 ring-emerald-400/40';
                case 'petwhisperer':
                  return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/25 ring-1 ring-amber-300/40';
                case 'openwebos':
                  return 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/25 ring-1 ring-cyan-300/40';
                case 'greenieverse':
                  return 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-500/25 ring-1 ring-teal-300/40';
                case 'intelligence':
                  return 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/25 ring-1 ring-emerald-300/40';
                case 'informatics':
                  return 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 ring-1 ring-blue-300/40';
                case 'swarm':
                  return 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/25 ring-1 ring-purple-300/40';
                case 'research':
                  return 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-md shadow-amber-500/25 ring-1 ring-amber-300/40';
                case 'smarist':
                  return 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md shadow-pink-500/25 ring-1 ring-pink-300/40';
                case 'automation':
                  return 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md shadow-teal-500/25 ring-1 ring-teal-300/40';
                case 'privacy':
                  return 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/25 ring-1 ring-indigo-300/40';
                case 'economy':
                  return 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-md shadow-amber-500/25 font-black ring-1 ring-amber-300/50';
                case 'gcp':
                  return 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/25 ring-1 ring-sky-300/40';
                case 'settings':
                  return 'bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-md shadow-slate-500/20';
                default:
                  return 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-500/25';
              }
            };

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? getActiveStyle(item.id)
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/90 border border-transparent hover:border-slate-200/60'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase transition-colors ${
                    isActive ? 'bg-white/25 text-white shadow-2xs' : 'bg-slate-100 text-slate-700 border border-slate-200/80'
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
