import { FC, useState, useEffect, useMemo } from 'react';
import { 
  MicroBizSubTab, 
  MicroBizPost, 
  MicroBizCourse, 
  MicroBusiness, 
  FinancialRecord,
  MicroBizProfile 
} from './types/microbizTypes';
import { 
  PayFlowInvoice, 
  PayFlowTransaction, 
  PayFlowExpense, 
  PayFlowBusinessProfile, 
  DateFilterRange 
} from './types/payflowTypes';
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
import { PayFlowService } from './services/payflowService';
import { PayFlowDashboardView } from './payflow/PayFlowDashboardView';
import { PayFlowInvoicesView } from './payflow/PayFlowInvoicesView';
import { PayFlowPaymentsView } from './payflow/PayFlowPaymentsView';
import { PayFlowTransactionsView } from './payflow/PayFlowTransactionsView';
import { PayFlowExpensesView } from './payflow/PayFlowExpensesView';
import { PayFlowDebtFreeView } from './debtfree/PayFlowDebtFreeView';
import { PayFlowAiAssistantView } from './payflow/PayFlowAiAssistantView';
import { PayFlowReportsView } from './payflow/PayFlowReportsView';
import { PayFlowSettingsView } from './payflow/PayFlowSettingsView';
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
  HeartHandshake, 
  X 
} from 'lucide-react';

interface MicroBizAppProps {
  currentLanguage?: string;
  initialSubTab?: MicroBizSubTab;
}

export const MicroBizApp: FC<MicroBizAppProps> = ({
  currentLanguage = 'en',
  initialSubTab = 'overview'
}) => {
  const isVi = currentLanguage === 'vi';
  const [hubMode, setHubMode] = useState<'payflow' | 'community'>('payflow');
  const [activeSubTab, setActiveSubTab] = useState<MicroBizSubTab>(initialSubTab);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Real Authenticated User Profile State
  const [currentUser, setCurrentUser] = useState<MicroBizProfile>(MicroBizService.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(MicroBizService.isUserAuthenticated());

  // Existing Community Platform Entity State
  const [posts, setPosts] = useState<MicroBizPost[]>(INITIAL_POSTS);
  const [courses, setCourses] = useState<MicroBizCourse[]>(INITIAL_COURSES);
  const [businesses, setBusinesses] = useState<MicroBusiness[]>(INITIAL_BUSINESSES);
  const [finances, setFinances] = useState<FinancialRecord[]>(INITIAL_FINANCIAL_RECORDS);

  // PayFlow AI State (PayPal AI Hackathon 2026)
  const [invoices, setInvoices] = useState<PayFlowInvoice[]>([]);
  const [transactions, setTransactions] = useState<PayFlowTransaction[]>([]);
  const [expenses, setExpenses] = useState<PayFlowExpense[]>([]);
  const [businessProfile, setBusinessProfile] = useState<PayFlowBusinessProfile>({
    userId: 'default',
    businessName: 'Zenieverse Creative Works',
    ownerName: 'Alex Rivera',
    email: 'business@zenieverse.com',
    phone: '+1 (415) 555-0199',
    address: '742 Market Street, San Francisco, CA 94102',
    taxId: 'US-94-3829102',
    defaultCurrency: 'USD',
    defaultTaxRate: 8.5,
    defaultPaymentTerms: 'Payment due within 14 days of issue.',
    invoicePrefix: 'INV-2026-',
    nextInvoiceSequence: 104,
    paypalEmail: 'merchant@zenieverse.com',
    paypalSandboxVerified: true,
    gatherGlowConnected: true,
    updatedAt: new Date().toISOString()
  });

  const [dateRange, setDateRange] = useState<DateFilterRange>('this_month');
  const [isCreateInvoiceModalOpen, setIsCreateInvoiceModalOpen] = useState(false);
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<PayFlowInvoice | null>(null);

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

      // Reload PayFlow records
      Promise.all([
        PayFlowService.getInvoices(),
        PayFlowService.getTransactions(),
        PayFlowService.getExpenses(),
        PayFlowService.getBusinessProfile()
      ]).then(([invs, txns, exps, prof]) => {
        setInvoices(invs);
        setTransactions(txns);
        setExpenses(exps);
        setBusinessProfile(prof);
      }).catch(err => {
        console.warn('PayFlow reload error:', err);
      });
    });

    return () => unsubscribe();
  }, []);

  // Initial load from Firestore / LocalStorage
  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const [
          loadedPosts, 
          loadedCourses, 
          loadedBusinesses, 
          loadedFinances,
          loadedInvoices,
          loadedTransactions,
          loadedExpenses,
          loadedProfile
        ] = await Promise.all([
          MicroBizService.getPosts(),
          MicroBizService.getCourses(),
          MicroBizService.getBusinesses(),
          MicroBizService.getFinancialRecords(),
          PayFlowService.getInvoices(),
          PayFlowService.getTransactions(),
          PayFlowService.getExpenses(),
          PayFlowService.getBusinessProfile()
        ]);

        if (mounted) {
          if (loadedPosts.length > 0) setPosts(loadedPosts);
          if (loadedCourses.length > 0) setCourses(loadedCourses);
          if (loadedBusinesses.length > 0) setBusinesses(loadedBusinesses);
          if (loadedFinances.length > 0) setFinances(loadedFinances);
          setInvoices(loadedInvoices);
          setTransactions(loadedTransactions);
          setExpenses(loadedExpenses);
          setBusinessProfile(loadedProfile);
        }
      } catch (err) {
        console.warn('MicroBiz initial loading note:', err);
      }
    }

    loadData();
    return () => { mounted = false; };
  }, [isAuthenticated]);

  // Compute live PayFlow dashboard metrics
  const dashboardMetrics = useMemo(() => {
    return PayFlowService.calculateDashboardMetrics(invoices, transactions, expenses, dateRange);
  }, [invoices, transactions, expenses, dateRange]);

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 pb-20">
      {/* MicroBiz Sticky Secondary Navigation with PayFlow AI & Community Hub */}
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
        onOpenCreateInvoice={() => {
          setActiveSubTab('invoices');
          setIsCreateInvoiceModalOpen(true);
        }}
        onOpenPolicyDrawer={() => setIsPolicyOpen(true)}
        currentLanguage={currentLanguage}
        hubMode={hubMode}
        setHubMode={setHubMode}
      />

      {/* Main View Port Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* ==================================================== */}
        {/* PAYFLOW AI CORE VIEWS (PayPal AI Hackathon 2026)    */}
        {/* ==================================================== */}

        {/* 1. OVERVIEW DASHBOARD */}
        {activeSubTab === 'overview' && (
          <PayFlowDashboardView
            metrics={dashboardMetrics}
            invoices={invoices}
            transactions={transactions}
            expenses={expenses}
            profile={businessProfile}
            dateRange={dateRange}
            setDateRange={setDateRange}
            setActiveSubTab={setActiveSubTab}
            onOpenCreateInvoice={() => {
              setActiveSubTab('invoices');
              setIsCreateInvoiceModalOpen(true);
            }}
            currentLanguage={currentLanguage}
          />
        )}

        {/* 2. INVOICE LIFECYCLE MANAGEMENT */}
        {activeSubTab === 'invoices' && (
          <PayFlowInvoicesView
            invoices={invoices}
            setInvoices={setInvoices}
            profile={businessProfile}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onOpenCreateModal={isCreateInvoiceModalOpen}
            onCloseCreateModal={() => setIsCreateInvoiceModalOpen(false)}
            onSelectForPayment={(inv) => {
              setSelectedInvoiceForPayment(inv);
              setActiveSubTab('payments');
            }}
            currentLanguage={currentLanguage}
          />
        )}

        {/* 3. PAYPAL PAYMENTS CENTER */}
        {activeSubTab === 'payments' && (
          <PayFlowPaymentsView
            invoices={invoices}
            setInvoices={setInvoices}
            profile={businessProfile}
            initialInvoice={selectedInvoiceForPayment}
            onPaymentSuccess={(txn) => {
              setTransactions(prev => [txn, ...prev]);
            }}
            currentLanguage={currentLanguage}
          />
        )}

        {/* 4. TRANSACTION LEDGER */}
        {activeSubTab === 'transactions' && (
          <PayFlowTransactionsView
            transactions={transactions}
            profile={businessProfile}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            currentLanguage={currentLanguage}
          />
        )}

        {/* 5. EXPENSES & RECEIPTS */}
        {activeSubTab === 'expenses' && (
          <PayFlowExpensesView
            expenses={expenses}
            setExpenses={setExpenses}
            profile={businessProfile}
            currentLanguage={currentLanguage}
          />
        )}

        {/* 6. PAYFLOW DEBTFREE COMMUNITY RELIEF HUB */}
        {activeSubTab === 'debtfree' && (
          <PayFlowDebtFreeView
            currentUser={currentUser}
            currentLanguage={currentLanguage}
            onOpenCreateInvoice={() => {
              setActiveSubTab('invoices');
              setIsCreateInvoiceModalOpen(true);
            }}
          />
        )}

        {/* 7. GEMINI FINANCIAL COPILOT */}
        {activeSubTab === 'ai-assistant' && (
          <PayFlowAiAssistantView
            invoices={invoices}
            transactions={transactions}
            expenses={expenses}
            profile={businessProfile}
            onApplyInvoiceDraft={(draft) => {
              setActiveSubTab('invoices');
              setIsCreateInvoiceModalOpen(true);
            }}
            currentLanguage={currentLanguage}
          />
        )}

        {/* 7. FINANCIAL STATEMENTS & GATHER & GLOW BRIDGE */}
        {activeSubTab === 'reports' && (
          <PayFlowReportsView
            invoices={invoices}
            transactions={transactions}
            expenses={expenses}
            profile={businessProfile}
            setInvoices={setInvoices}
            currentLanguage={currentLanguage}
          />
        )}

        {/* 8. BUSINESS SETTINGS */}
        {activeSubTab === 'settings' && (
          <PayFlowSettingsView
            profile={businessProfile}
            setProfile={setBusinessProfile}
            invoices={invoices}
            transactions={transactions}
            expenses={expenses}
            setInvoices={setInvoices}
            setTransactions={setTransactions}
            setExpenses={setExpenses}
            currentLanguage={currentLanguage}
          />
        )}

        {/* ==================================================== */}
        {/* PRESERVED COMMUNITY & LEARNING HUB VIEWS             */}
        {/* ==================================================== */}

        {/* SUBTAB: DISCOVERY & COMMUNITY FEED */}
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

        {/* SUBTAB: COURSES PLATFORM */}
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

        {/* SUBTAB: COMMUNITY GROUPS & COLLABORATION */}
        {activeSubTab === 'groups' && (
          <CommunityGroupsView
            searchQuery={searchQuery}
            currentLanguage={currentLanguage}
          />
        )}

        {/* SUBTAB: ARTISAN MARKETPLACE & STOREFRONTS */}
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

        {/* SUBTAB: LEGACY OPERATIONS */}
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

        {/* SUBTAB: RECEIPT & INVOICE OCR SCANNER */}
        {activeSubTab === 'scanner' && (
          <DocScannerView
            currentLanguage={currentLanguage}
            currentUser={currentUser}
            isAuthenticated={isAuthenticated}
            onImportComplete={() => setActiveSubTab('operations')}
          />
        )}

        {/* SUBTAB: AI STUDIO */}
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

        {/* SUBTAB: TRUST, SAFETY & ETHICAL GOVERNANCE */}
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
              <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950">
                <strong className="block font-serif text-sm mb-1">
                  {isVi ? 'Tạo Dựng Bởi Tất Cả, Vì Tất Cả' : 'Made for All, By All'}
                </strong>
                {isVi
                  ? 'MicroBiz PayFlow AI là nền tảng mở kết nối tri thức sinh kế thực tế và thương mại điện tử thông minh, hỗ trợ thanh toán PayPal và tạo lập hóa đơn minh bạch.'
                  : 'MicroBiz PayFlow AI empowers everyday freelancers, micro-merchants and celebration organizers with professional invoicing, PayPal Checkout, and AI cash flow intelligence.'}
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 font-serif">
                  {isVi ? '4 Cam Kết Vận Hành Bắt Buộc:' : 'Core Operating Principles:'}
                </h4>
                <ul className="space-y-1.5">
                  <li>• <strong>Transparent Pricing:</strong> Decimal-safe monetary arithmetic with zero hidden fees.</li>
                  <li>• <strong>Authoritative Capture:</strong> Strict server-side PayPal order capture preventing client-side spoofing.</li>
                  <li>• <strong>Data Sovereignty:</strong> Complete data ownership with one-click JSON export and ledger reset capabilities.</li>
                  <li>• <strong>Responsible AI:</strong> Ground-truth ledger facts clearly distinguished from AI recommendations; mandatory non-CPA disclaimers.</li>
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
