import { FC, useState, useEffect } from 'react';
import { 
  MicroBizSubTab, 
  MicroBizPost, 
  MicroBizCourse, 
  MicroBusiness, 
  FinancialRecord,
  MicroBizProfile 
} from './types/microbizTypes';
import { MicroBizNavbar } from './components/MicroBizNavbar';
import { DiscoveryFeed } from './components/DiscoveryFeed';
import { CoursePlatformView } from './components/CoursePlatformView';
import { CommunityGroupsView } from './components/CommunityGroupsView';
import { MarketplaceView } from './components/MarketplaceView';
import { OperationsView } from './components/OperationsView';
import { DocScannerView } from './components/DocScannerView';
import { AiStudioView } from './components/AiStudioView';
import { TrustAdminView } from './components/TrustAdminView';
import { MicroBizService } from './services/microbizService';
import { 
  subscribeAuthState, 
  signInWithGoogle, 
  signOutUser 
} from '../../services/firebase';
import { 
  INITIAL_POSTS, 
  INITIAL_COURSES, 
  INITIAL_BUSINESSES, 
  INITIAL_FINANCIAL_RECORDS 
} from './data/initialMicroBizData';
import { 
  Sparkles, 
  BookOpen, 
  Users, 
  Store, 
  Calculator, 
  ScanLine, 
  Bot, 
  ShieldCheck, 
  X, 
  Info,
  HeartHandshake
} from 'lucide-react';

interface MicroBizAppProps {
  currentLanguage?: string;
  initialSubTab?: MicroBizSubTab;
}

export const MicroBizApp: FC<MicroBizAppProps> = ({
  currentLanguage = 'en',
  initialSubTab = 'discover'
}) => {
  const isVi = currentLanguage === 'vi';
  const [activeSubTab, setActiveSubTab] = useState<MicroBizSubTab>(initialSubTab);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Real Authenticated User Profile State
  const [currentUser, setCurrentUser] = useState<MicroBizProfile>(MicroBizService.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(MicroBizService.isUserAuthenticated());

  // Platform entity state
  const [posts, setPosts] = useState<MicroBizPost[]>(INITIAL_POSTS);
  const [courses, setCourses] = useState<MicroBizCourse[]>(INITIAL_COURSES);
  const [businesses, setBusinesses] = useState<MicroBusiness[]>(INITIAL_BUSINESSES);
  const [finances, setFinances] = useState<FinancialRecord[]>(INITIAL_FINANCIAL_RECORDS);

  // Policy Drawer State
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);

  // Subscribe to real Firebase Auth lifecycle
  useEffect(() => {
    const unsubscribe = subscribeAuthState((user) => {
      const isAuth = !!user;
      setIsAuthenticated(isAuth);
      const activeProfile = MicroBizService.getCurrentUser();
      setCurrentUser(activeProfile);

      // Re-load user-isolated financial records when auth state changes
      MicroBizService.getFinancialRecords().then(loadedFinances => {
        setFinances(loadedFinances);
      }).catch(err => {
        console.warn('Finance reload error on auth state change:', err);
      });
    });

    return () => unsubscribe();
  }, []);

  // Initial load from Firestore / LocalStorage
  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const [loadedPosts, loadedCourses, loadedBusinesses, loadedFinances] = await Promise.all([
          MicroBizService.getPosts(),
          MicroBizService.getCourses(),
          MicroBizService.getBusinesses(),
          MicroBizService.getFinancialRecords()
        ]);

        if (mounted) {
          if (loadedPosts.length > 0) setPosts(loadedPosts);
          if (loadedCourses.length > 0) setCourses(loadedCourses);
          if (loadedBusinesses.length > 0) setBusinesses(loadedBusinesses);
          if (loadedFinances.length > 0) setFinances(loadedFinances);
        }
      } catch (err) {
        console.warn('MicroBiz initial loading note:', err);
      }
    }

    loadData();
    return () => { mounted = false; };
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 pb-20">
      {/* MicroBiz Sticky Secondary Navigation */}
      <MicroBizNavbar
        activeSubTab={activeSubTab}
        setActiveSubTab={setActiveSubTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentUser={currentUser}
        isAuthenticated={isAuthenticated}
        onSignIn={async () => {
          await signInWithGoogle();
        }}
        onSignOut={async () => {
          await signOutUser();
        }}
        onOpenPolicyDrawer={() => setIsPolicyOpen(true)}
        currentLanguage={currentLanguage}
      />

      {/* Main View Port Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* SUBTAB 1: DISCOVERY & COMMUNITY FEED */}
        {activeSubTab === 'discover' && (
          <DiscoveryFeed
            posts={posts}
            setPosts={setPosts}
            searchQuery={searchQuery}
            currentLanguage={currentLanguage}
            currentUser={currentUser}
            isAuthenticated={isAuthenticated}
          />
        )}

        {/* SUBTAB 2: COURSES PLATFORM */}
        {activeSubTab === 'courses' && (
          <CoursePlatformView
            courses={courses}
            setCourses={setCourses}
            searchQuery={searchQuery}
            currentLanguage={currentLanguage}
            currentUser={currentUser}
            isAuthenticated={isAuthenticated}
            onOpenAiCourseCreator={() => setActiveSubTab('ai-studio')}
          />
        )}

        {/* SUBTAB 3: COMMUNITY GROUPS & COLLABORATION */}
        {activeSubTab === 'groups' && (
          <CommunityGroupsView
            searchQuery={searchQuery}
            currentLanguage={currentLanguage}
          />
        )}

        {/* SUBTAB 4: ARTISAN MARKETPLACE & STOREFRONTS */}
        {activeSubTab === 'marketplace' && (
          <MarketplaceView
            businesses={businesses}
            searchQuery={searchQuery}
            currentLanguage={currentLanguage}
            currentUser={currentUser}
            isAuthenticated={isAuthenticated}
            onOpenRegisterStore={() => setActiveSubTab('ai-studio')}
          />
        )}

        {/* SUBTAB 5: OPERATIONS & EVERYDAY BOOKKEEPING */}
        {activeSubTab === 'operations' && (
          <OperationsView
            records={finances}
            searchQuery={searchQuery}
            currentLanguage={currentLanguage}
            currentUser={currentUser}
            isAuthenticated={isAuthenticated}
            onOpenScanner={() => setActiveSubTab('scanner')}
          />
        )}

        {/* SUBTAB 6: RECEIPT & INVOICE OCR SCANNER */}
        {activeSubTab === 'scanner' && (
          <DocScannerView
            currentLanguage={currentLanguage}
            currentUser={currentUser}
            isAuthenticated={isAuthenticated}
            onImportComplete={() => setActiveSubTab('operations')}
          />
        )}

        {/* SUBTAB 7: AI STUDIO (GEMINI CURRICULUM, COPY, BUSINESS CANVAS) */}
        {activeSubTab === 'ai-studio' && (
          <AiStudioView
            currentLanguage={currentLanguage}
            currentUser={currentUser}
            isAuthenticated={isAuthenticated}
            onSaveNewCourse={(newCourse) => {
              setCourses([newCourse, ...courses]);
              setActiveSubTab('courses');
            }}
          />
        )}

        {/* SUBTAB 8: TRUST, SAFETY & ETHICAL GOVERNANCE */}
        {activeSubTab === 'admin' && (
          <TrustAdminView
            currentLanguage={currentLanguage}
          />
        )}
      </div>

      {/* POLICY & ETHICS DRAWER MODAL */}
      {isPolicyOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <HeartHandshake className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-black text-slate-900 font-serif">
                  {isVi ? 'Tôn Chỉ Cộng Đồng MicroBiz' : 'MicroBiz Community Constitution'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPolicyOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700 leading-relaxed font-sans">
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                <strong className="block font-serif text-sm mb-1">
                  {isVi ? 'Tạo Dựng Bởi Tất Cả, Vì Tất Cả' : 'Made for All, By All'}
                </strong>
                {isVi
                  ? 'MicroBiz là nền tảng mở kết nối tri thức sinh kế thực tế, giúp người học và các hộ sản xuất nhỏ cùng nhau tồn tại và thịnh vượng bền vững.'
                  : 'MicroBiz is an open knowledge and livelihood ecosystem designed to help everyday makers and community learners build durable, honest enterprises.'}
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 font-serif">
                  {isVi ? '4 Cam Kết Bắt Buộc:' : 'Core Operating Principles:'}
                </h4>
                <ul className="space-y-1.5">
                  <li>• <strong>No Medical Claims:</strong> Herbal and wellness creations are strictly for daily care, never advertised as medical treatments or cures.</li>
                  <li>• <strong>No Exploitation:</strong> Fair, itemized pricing. Direct connection between makers and customers with zero hidden transaction tolls.</li>
                  <li>• <strong>Cultural Respect:</strong> Respect ancestral and indigenous recipes. Always credit collaborative partners and scrap-sharing networks.</li>
                  <li>• <strong>Credential Honesty:</strong> Certificates acknowledge peer effort in practical workshops and are transparently non-state-accredited.</li>
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsPolicyOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer"
              >
                {isVi ? 'Đã Hiểu & Đồng Ý' : 'Understood & Agree'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
