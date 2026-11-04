import { FC } from 'react';
import { MicroBizSubTab, MicroBizProfile } from '../types/microbizTypes';
import { 
  Sparkles, 
  BookOpen, 
  Users, 
  Store, 
  Calculator, 
  ScanLine, 
  Bot, 
  ShieldCheck, 
  Search,
  PlusCircle,
  Briefcase,
  HelpCircle,
  LogIn,
  LogOut,
  UserCheck,
  User as UserIcon,
  CreditCard,
  FileText,
  BarChart3,
  Receipt,
  Settings,
  Layers,
  ArrowRight,
  HeartHandshake
} from 'lucide-react';

interface MicroBizNavbarProps {
  activeSubTab: MicroBizSubTab;
  setActiveSubTab: (tab: MicroBizSubTab) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  currentUser?: MicroBizProfile;
  isAuthenticated?: boolean;
  onSignIn?: () => void;
  onSignOut?: () => void;
  onOpenCreateInvoice?: () => void;
  onOpenPolicyDrawer?: () => void;
  currentLanguage?: string;
  hubMode?: 'payflow' | 'community';
  setHubMode?: (mode: 'payflow' | 'community') => void;
}

export const MicroBizNavbar: FC<MicroBizNavbarProps> = ({
  activeSubTab,
  setActiveSubTab,
  searchQuery,
  setSearchQuery,
  currentUser,
  isAuthenticated = false,
  onSignIn,
  onSignOut,
  onOpenCreateInvoice,
  onOpenPolicyDrawer,
  currentLanguage = 'en',
  hubMode = 'payflow',
  setHubMode
}) => {
  const isVi = currentLanguage === 'vi';

  // 1. PayFlow AI Official Navigation (PayPal AI Hackathon 2026)
  const payflowTabs: Array<{ id: MicroBizSubTab; label: string; icon: any; badge?: string }> = [
    { id: 'overview', label: isVi ? 'Tổng Quan' : 'Overview', icon: BarChart3 },
    { id: 'invoices', label: isVi ? 'Hóa Đơn' : 'Invoices', icon: FileText, badge: 'Lifecycle' },
    { id: 'payments', label: isVi ? 'Cổng PayPal' : 'Payments', icon: CreditCard, badge: 'PayPal' },
    { id: 'transactions', label: isVi ? 'Sổ Giao Dịch' : 'Transactions', icon: Layers },
    { id: 'expenses', label: isVi ? 'Chi Phí & Biên Lai' : 'Expenses', icon: Receipt },
    { id: 'debtfree', label: isVi ? 'Cứu Nợ DebtFree' : 'DebtFree', icon: HeartHandshake, badge: 'Relief' },
    { id: 'ai-assistant', label: isVi ? 'Trợ Lý AI' : 'AI Assistant', icon: Sparkles, badge: 'Gemini' },
    { id: 'reports', label: isVi ? 'Báo Cáo & Thuế' : 'Reports', icon: Calculator },
    { id: 'settings', label: isVi ? 'Cài Đặt Doanh Nghiệp' : 'Settings', icon: Settings }
  ];

  // 2. Preserved Community & Learning Hub Tabs
  const communityTabs: Array<{ id: MicroBizSubTab; label: string; icon: any; badge?: string }> = [
    { id: 'discover', label: isVi ? 'Khám Phá' : 'Discover', icon: Sparkles },
    { id: 'courses', label: isVi ? 'Khóa Học' : 'Courses', icon: BookOpen },
    { id: 'groups', label: isVi ? 'Cộng Đồng' : 'Community', icon: Users },
    { id: 'marketplace', label: isVi ? 'Cửa Hàng' : 'Marketplace', icon: Store },
    { id: 'admin', label: isVi ? 'Tin Cậy' : 'Trust & Safety', icon: ShieldCheck }
  ];

  const currentTabs = hubMode === 'payflow' ? payflowTabs : communityTabs;

  return (
    <div className="bg-white border-b border-slate-200/90 sticky top-16 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 space-y-3">
        {/* Top Branding & Mode Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-emerald-500 p-0.5 shadow-md shadow-indigo-500/15 flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-indigo-400 font-bold">
                <CreditCard className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-black bg-gradient-to-r from-indigo-800 via-blue-700 to-emerald-600 bg-clip-text text-transparent font-serif">
                  MicroBiz PayFlow AI
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-blue-50 text-blue-800 border border-blue-200/80 uppercase tracking-wider">
                  PayPal AI 2026
                </span>
              </div>
              <p className="text-xs text-slate-500 font-sans">
                {isVi 
                  ? 'Hóa đơn thông minh • Xử lý thanh toán PayPal • Đối soát chi phí & Trợ lý tài chính AI' 
                  : 'Turn invoices, PayPal payments and business finances into intelligent workflows.'}
              </p>
            </div>
          </div>

          {/* Search, Mode Switcher & Auth */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Mode Switcher Segmented Control */}
            {setHubMode && (
              <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setHubMode('payflow');
                    setActiveSubTab('overview');
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 cursor-pointer ${
                    hubMode === 'payflow'
                      ? 'bg-white text-indigo-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>PayFlow AI</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setHubMode('community');
                    setActiveSubTab('discover');
                  }}
                  className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1 cursor-pointer ${
                    hubMode === 'community'
                      ? 'bg-white text-emerald-800 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Community Hub</span>
                </button>
              </div>
            )}

            {/* Search Input */}
            <div className="relative flex-1 sm:w-48">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isVi ? 'Tìm hóa đơn, chi phí...' : 'Search invoices, expenses...'}
                className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              />
            </div>

            {/* Auth Identity Status */}
            {isAuthenticated && currentUser ? (
              <div className="flex items-center space-x-2 px-2.5 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-xs">
                <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                  {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                </div>
                <div className="flex flex-col text-left leading-tight hidden md:flex">
                  <span className="font-bold text-slate-900 text-[11px] truncate max-w-[110px]">
                    {currentUser.name}
                  </span>
                  <span className="text-[9px] font-mono text-indigo-700 flex items-center gap-0.5">
                    <UserCheck className="w-2.5 h-2.5 inline" />
                    <span>Firebase Auth</span>
                  </span>
                </div>
                {onSignOut && (
                  <button
                    type="button"
                    onClick={onSignOut}
                    title={isVi ? 'Đăng xuất' : 'Sign out'}
                    className="p-1 text-slate-400 hover:text-slate-600 hover:bg-indigo-100 rounded-lg transition cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-1.5">
                <span className="hidden lg:inline-flex items-center px-2 py-1 rounded-lg text-[10px] font-mono bg-slate-100 text-slate-600 border border-slate-200">
                  <UserIcon className="w-3 h-3 mr-1 text-slate-400" />
                  <span>Sandbox Mode</span>
                </span>
                {onSignIn && (
                  <button
                    type="button"
                    onClick={onSignIn}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-xs cursor-pointer shrink-0"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>{isVi ? 'Đăng nhập Google' : 'Sign In'}</span>
                  </button>
                )}
              </div>
            )}

            {/* Policy Drawer Button */}
            {onOpenPolicyDrawer && (
              <button
                type="button"
                onClick={onOpenPolicyDrawer}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs transition cursor-pointer shrink-0"
                title={isVi ? 'Chính sách & Tôn chỉ' : 'Constitution & Policies'}
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Subtabs Navigation Ribbon */}
        <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar pt-1 border-t border-slate-100">
          {currentTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center space-x-1.5 shrink-0 cursor-pointer ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-900 font-bold shadow-2xs border border-indigo-200/80' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-md ${
                    isActive ? 'bg-indigo-200/60 text-indigo-950 font-bold' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
