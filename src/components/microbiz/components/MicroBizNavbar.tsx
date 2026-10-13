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
  User as UserIcon
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
  onOpenCreateModal?: () => void;
  onOpenPolicyDrawer?: () => void;
  currentLanguage?: string;
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
  onOpenCreateModal,
  onOpenPolicyDrawer,
  currentLanguage = 'en'
}) => {
  const isVi = currentLanguage === 'vi';

  const subTabs: Array<{ id: MicroBizSubTab; label: string; icon: any; badge?: string }> = [
    { id: 'discover', label: isVi ? 'Khám Phá' : 'Discover', icon: Sparkles },
    { id: 'courses', label: isVi ? 'Khóa Học' : 'Courses', icon: BookOpen, badge: 'Learn & Teach' },
    { id: 'groups', label: isVi ? 'Cộng Đồng' : 'Community', icon: Users, badge: 'Collab' },
    { id: 'marketplace', label: isVi ? 'Cửa Hàng' : 'Marketplace', icon: Store, badge: 'Trade' },
    { id: 'operations', label: isVi ? 'Sổ Sách & Vận Hành' : 'Operations', icon: Calculator, badge: 'Cash Flow' },
    { id: 'scanner', label: isVi ? 'Quét Hóa Đơn' : 'Doc Scanner', icon: ScanLine, badge: 'OCR' },
    { id: 'ai-studio', label: isVi ? 'Trợ Lý AI' : 'AI Studio', icon: Bot, badge: 'Gemini' },
    { id: 'admin', label: isVi ? 'Tin Cậy & Quản Trị' : 'Trust & Safety', icon: ShieldCheck }
  ];

  return (
    <div className="bg-white border-b border-slate-200/90 sticky top-16 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 space-y-3">
        {/* Top Branding & Quick Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-500 p-0.5 shadow-md shadow-emerald-500/15 flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-emerald-400 font-bold">
                <Briefcase className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-black bg-gradient-to-r from-emerald-700 via-teal-700 to-amber-600 bg-clip-text text-transparent font-serif">
                  MicroBiz
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-50 text-emerald-800 border border-emerald-200/80 uppercase tracking-wider">
                  {isVi ? 'Tạo Dựng Bởi Tất Cả, Vì Tất Cả' : 'Made for All, By All'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-sans">
                {isVi 
                  ? 'Cùng Học • Cùng Sáng Tạo • Cùng Hợp Tác • Cùng Phát Triển Bền Vững' 
                  : 'Learn together. Create together. Collaborate together. Grow sustainable livelihoods.'}
              </p>
            </div>
          </div>

          {/* Search, Auth Status & Actions */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isVi ? 'Tìm bài viết, khóa học, kỹ năng...' : 'Search posts, courses, skills...'}
                className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
            </div>

            {/* Authentication Identity Status Chip */}
            {isAuthenticated && currentUser ? (
              <div className="flex items-center space-x-2 px-2.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                  {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                </div>
                <div className="flex flex-col text-left leading-tight hidden md:flex">
                  <span className="font-bold text-slate-900 text-[11px] truncate max-w-[110px]">
                    {currentUser.name}
                  </span>
                  <span className="text-[9px] font-mono text-emerald-700 flex items-center gap-0.5">
                    <UserCheck className="w-2.5 h-2.5 inline" />
                    {isVi ? 'Đã xác thực' : 'Firebase Sync'}
                  </span>
                </div>
                {onSignOut && (
                  <button
                    type="button"
                    onClick={onSignOut}
                    title={isVi ? 'Đăng xuất' : 'Sign out'}
                    className="p-1 text-slate-400 hover:text-slate-600 hover:bg-emerald-100 rounded-lg transition cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-1.5">
                <span className="hidden lg:inline-flex items-center px-2 py-1 rounded-lg text-[10px] font-mono bg-slate-100 text-slate-600 border border-slate-200">
                  <UserIcon className="w-3 h-3 mr-1 text-slate-400" />
                  {isVi ? 'Khách (Cục bộ)' : 'Guest Sandbox'}
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

            {onOpenCreateModal && (
              <button
                type="button"
                onClick={onOpenCreateModal}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-xs cursor-pointer shrink-0"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isVi ? 'Tạo Mới' : 'Create'}</span>
              </button>
            )}

            {onOpenPolicyDrawer && (
              <button
                type="button"
                onClick={onOpenPolicyDrawer}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs transition cursor-pointer shrink-0"
                title={isVi ? 'Quy tắc cộng đồng & Pháp lý' : 'Community Guidelines & Policies'}
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Subtabs Navigation Ribbon */}
        <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar pt-1 border-t border-slate-100">
          {subTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium transition flex items-center space-x-2 shrink-0 cursor-pointer ${
                  isActive 
                    ? 'bg-emerald-50 text-emerald-800 font-bold shadow-2xs border border-emerald-200/80' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-md ${
                    isActive ? 'bg-emerald-200/60 text-emerald-900' : 'bg-slate-100 text-slate-500'
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
