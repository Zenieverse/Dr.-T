import React from 'react';
import { NavTab, LanguageCode, PlatformNotification } from '../../types';
import { DR_T_AVATAR } from '../../assets/drTAvatar';
import { Activity, FileText, Cpu, FlaskConical, Sparkles, Bot, ShieldCheck, Zap, Settings, Mic, Bell, Command, Compass, Globe, Cloud, Cake, Trees, Infinity, Heart, Coins, Clapperboard } from 'lucide-react';

interface NavbarProps { activeTab: NavTab; setActiveTab: (tab: NavTab) => void; currentLanguage: LanguageCode; setCurrentLanguage: (lang: LanguageCode) => void; notifications: PlatformNotification[]; openNotifications: () => void; openCommandPalette: () => void; openVoiceMode: () => void; openDemoJourney: () => void; openBirthdayModal?: () => void; }
const LANGUAGES: Array<{ code: LanguageCode; label: string; flag: string }> = [
  { code: 'en', label: 'English', flag: '🇺🇸' }, { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' }, { code: 'de', label: 'Deutsch', flag: '🇩🇪' }, { code: 'fr', label: 'Français', flag: '🇫🇷' }, { code: 'es', label: 'Español', flag: '🇪🇸' }, { code: 'zh', label: '中文', flag: '🇨🇳' }, { code: 'ja', label: '日本語', flag: '🇯🇵' },
];
export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, currentLanguage, setCurrentLanguage, notifications, openNotifications, openCommandPalette, openVoiceMode, openDemoJourney, openBirthdayModal }) => {
  const unreadCount = notifications.filter(n => !n.read).length;
  const navItems: Array<{ id: NavTab; label: string; icon: React.ReactNode; badge?: string }> = [
    { id: 'drt', label: 'Dr. T', icon: <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-rose-500 via-purple-500 to-teal-400 flex items-center justify-center shrink-0 text-white"><Infinity className="w-3.5 h-3.5" /></div> },
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
    { id: 'cinema', label: 'Cinema', icon: <Clapperboard className="w-4 h-4 text-teal-500" />, badge: 'Agentic' },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4 text-slate-400" /> },
  ];
  const getActiveStyle = (id: NavTab) => {
    switch (id) {
      case 'drt': return 'bg-gradient-to-r from-rose-500 via-purple-500 to-pink-500 text-white shadow-md shadow-rose-500/25 ring-1 ring-rose-300/40';
      case 'tribhouse': case 'intelligence': return 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md';
      case 'petwhisperer': return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md';
      case 'openwebos': return 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md';
      case 'greenieverse': return 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md';
      case 'informatics': return 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md';
      case 'swarm': return 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md';
      case 'research': return 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-md';
      case 'smarist': return 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md';
      case 'automation': return 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md';
      case 'privacy': return 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md';
      case 'economy': return 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-md font-black';
      case 'gcp': return 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md';
      case 'cinema': return 'bg-gradient-to-r from-slate-900 via-teal-900 to-cyan-800 text-white shadow-md ring-1 ring-teal-300/40';
      case 'settings': return 'bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-md';
      default: return 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md';
    }
  };
  return <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="flex items-center justify-between h-16 gap-4"><div onClick={() => setActiveTab('drt')} className="flex items-center space-x-3 cursor-pointer group select-none"><div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 via-purple-500 to-teal-400 p-0.5 shadow-md"><div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center"><Infinity className="w-6 h-6 text-rose-500" /></div><div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-500 border-2 border-white flex items-center justify-center"><Heart className="w-2 h-2 text-white fill-white" /></div></div><div className="flex items-center space-x-2"><span className="text-lg font-black bg-gradient-to-r from-rose-600 via-pink-600 to-teal-600 bg-clip-text text-transparent">Dr. T</span><span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200"><Heart className="w-2.5 h-2.5 text-rose-500 fill-rose-500" />Polymath with Heart</span></div></div><div className="flex items-center space-x-2"><button onClick={openCommandPalette} className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs border border-slate-200"><Command className="w-3.5 h-3.5" /><span>Search or ask...</span><kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white rounded border border-slate-300">⌘K</kbd></button>{openBirthdayModal && <button onClick={openBirthdayModal} className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-pink-500 text-slate-950 text-xs font-black"><Cake className="w-3.5 h-3.5" /><span className="hidden sm:inline">🎂 Birthday</span></button>}<button onClick={openVoiceMode} className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white text-xs font-bold"><Mic className="w-3.5 h-3.5" /><span className="hidden sm:inline">Live Voice</span></button><button onClick={openDemoJourney} className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold"><Compass className="w-3.5 h-3.5" />Guided Tour</button><div className="relative group"><button className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200"><Globe className="w-3.5 h-3.5" /><span className="uppercase text-[11px] font-bold">{currentLanguage}</span></button><div className="absolute right-0 mt-1 w-36 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 hidden group-hover:block z-50">{LANGUAGES.map(lang => <button key={lang.code} onClick={() => setCurrentLanguage(lang.code)} className={`w-full text-left px-3 py-1.5 text-xs flex items-center space-x-2 hover:bg-slate-50 ${currentLanguage === lang.code ? 'font-bold text-teal-700 bg-teal-50' : 'text-slate-700'}`}><span>{lang.flag}</span><span>{lang.label}</span></button>)}</div></div><button onClick={openNotifications} className="relative p-2 rounded-xl bg-slate-100 text-slate-600"><Bell className="w-4 h-4" />{unreadCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">{unreadCount}</span>}</button></div></div><nav className="flex space-x-1.5 overflow-x-auto scrollbar-none py-1.5 border-t border-slate-100">{navItems.map(item => { const isActive = activeTab === item.id; return <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${isActive ? getActiveStyle(item.id) : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/90 border border-transparent'}`}><span>{item.icon}</span><span>{item.label}</span>{item.badge && <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${isActive ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-700 border border-slate-200/80'}`}>{item.badge}</span>}</button>; })}</nav></div></header>;
