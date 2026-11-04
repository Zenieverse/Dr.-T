import React, { useState, useEffect } from 'react';
import { 
  GatherEvent, 
  BudgetItem, 
  TimelineTask, 
  VendorRecord, 
  GuestRecord, 
  TeamRoleAssignment,
  AIEventPlan,
  GatherGlowSubView
} from './types';
import { GatherGlowService } from './services/gatherGlowService';
import { MyEventsView } from './components/MyEventsView';
import { AiPlannerView } from './components/AiPlannerView';
import { BudgetManagerView } from './components/BudgetManagerView';
import { TimelineManagerView } from './components/TimelineManagerView';
import { VendorManagerView } from './components/VendorManagerView';
import { GuestManagerView } from './components/GuestManagerView';
import { TeamRolesView } from './components/TeamRolesView';
import { EventDayView } from './components/EventDayView';
import { ReportsView } from './components/ReportsView';
import { EventWizardModal } from './components/EventWizardModal';
import { PricingModal } from './components/PricingModal';
import { UserGuideModal } from './components/UserGuideModal';
import { GATHER_GLOW_TRANSLATIONS, GatherGlowLanguage } from './translations';
import { 
  Sparkles, 
  Calendar, 
  DollarSign, 
  Clock, 
  Users, 
  Building2, 
  Compass, 
  FileText, 
  Plus, 
  ChevronDown,
  Layers,
  Globe,
  Tag,
  BookOpen
} from 'lucide-react';

interface GatherGlowModuleProps {
  initialSubView?: GatherGlowSubView;
}

export const GatherGlowModule: React.FC<GatherGlowModuleProps> = ({
  initialSubView = 'my_events'
}) => {
  const [activeSubView, setActiveSubView] = useState<GatherGlowSubView>(initialSubView);
  const [language, setLanguage] = useState<GatherGlowLanguage>(() => {
    try {
      return (localStorage.getItem('gatherglow_language') as GatherGlowLanguage) || 'en';
    } catch {
      return 'en';
    }
  });
  const [events, setEvents] = useState<GatherEvent[]>([]);
  const [activeEvent, setActiveEvent] = useState<GatherEvent | null>(null);

  // Entities for Active Event
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [tasks, setTasks] = useState<TimelineTask[]>([]);
  const [vendors, setVendors] = useState<VendorRecord[]>([]);
  const [guests, setGuests] = useState<GuestRecord[]>([]);
  const [teamRoles, setTeamRoles] = useState<TeamRoleAssignment[]>([]);
  const [aiPlan, setAiPlan] = useState<AIEventPlan | null>(null);

  // Cache for MyEvents view metrics
  const [allBudgets, setAllBudgets] = useState<Record<string, BudgetItem[]>>({});
  const [allGuests, setAllGuests] = useState<Record<string, GuestRecord[]>>({});

  // Loading & Modals
  const [isLoading, setIsLoading] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [editingWizardEvent, setEditingWizardEvent] = useState<GatherEvent | null>(null);
  const [isEventDropdownOpen, setIsEventDropdownOpen] = useState(false);

  const toggleLanguage = () => {
    const nextLang: GatherGlowLanguage = language === 'en' ? 'vi' : 'en';
    setLanguage(nextLang);
    try {
      localStorage.setItem('gatherglow_language', nextLang);
    } catch {
      // safe fallback
    }
  };

  const t = GATHER_GLOW_TRANSLATIONS[language] || GATHER_GLOW_TRANSLATIONS.en;

  // 1. Initial Load
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const loadedEvents = await GatherGlowService.loadAllEvents();
        setEvents(loadedEvents);
        
        if (loadedEvents.length > 0) {
          const selected = loadedEvents[0];
          setActiveEvent(selected);
          await loadEventDetails(selected.id);
        }

        // Cache all budgets & guests for overview cards
        const budgetsMap: Record<string, BudgetItem[]> = {};
        const guestsMap: Record<string, GuestRecord[]> = {};
        for (const ev of loadedEvents) {
          budgetsMap[ev.id] = await GatherGlowService.loadBudget(ev.id);
          guestsMap[ev.id] = await GatherGlowService.loadGuests(ev.id);
        }
        setAllBudgets(budgetsMap);
        setAllGuests(guestsMap);
      } catch (err) {
        console.error('[GatherGlow] Error loading events:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // 2. Load sub-entities whenever activeEvent changes
  const loadEventDetails = async (eventId: string) => {
    try {
      const [b, t, v, g, r, p] = await Promise.all([
        GatherGlowService.loadBudget(eventId),
        GatherGlowService.loadTasks(eventId),
        GatherGlowService.loadVendors(eventId),
        GatherGlowService.loadGuests(eventId),
        GatherGlowService.loadTeamRoles(eventId),
        GatherGlowService.loadAiPlan(eventId)
      ]);

      setBudgetItems(b);
      setTasks(t);
      setVendors(v);
      setGuests(g);
      setTeamRoles(r);
      setAiPlan(p);
    } catch (err) {
      console.warn('[GatherGlow] Error loading event details:', err);
    }
  };

  const handleSelectEvent = async (event: GatherEvent) => {
    setActiveEvent(event);
    await loadEventDetails(event.id);
    setActiveSubView('ai_planner');
    setIsEventDropdownOpen(false);
  };

  const handleSaveEvent = async (savedEvent: GatherEvent) => {
    await GatherGlowService.saveEvent(savedEvent);
    const updatedEvents = await GatherGlowService.loadAllEvents();
    setEvents(updatedEvents);
    setActiveEvent(savedEvent);
    await loadEventDetails(savedEvent.id);
    setIsWizardOpen(false);

    // If newly created and no plan yet, trigger AI plan generation automatically
    const existingPlan = await GatherGlowService.loadAiPlan(savedEvent.id);
    if (!existingPlan) {
      handleGenerateAiPlan(savedEvent);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    await GatherGlowService.deleteEvent(eventId);
    const updatedEvents = await GatherGlowService.loadAllEvents();
    setEvents(updatedEvents);
    if (updatedEvents.length > 0) {
      setActiveEvent(updatedEvents[0]);
      await loadEventDetails(updatedEvents[0].id);
    } else {
      setActiveEvent(null);
      setBudgetItems([]);
      setTasks([]);
      setVendors([]);
      setGuests([]);
      setTeamRoles([]);
      setAiPlan(null);
    }
  };

  const handleGenerateAiPlan = async (targetEvent?: GatherEvent) => {
    const ev = targetEvent || activeEvent;
    if (!ev) return;
    setIsAiLoading(true);
    try {
      const plan = await GatherGlowService.requestAiPlan(ev);
      setAiPlan(plan);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleDuplicateEvent = async (eventId: string) => {
    setIsLoading(true);
    try {
      const duplicated = await GatherGlowService.duplicateEvent(eventId);
      const updatedEvents = await GatherGlowService.loadAllEvents();
      setEvents(updatedEvents);
      setActiveEvent(duplicated);
      await loadEventDetails(duplicated.id);
    } catch (err) {
      console.error('[GatherGlow] Error duplicating event:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchiveEvent = async (eventId: string, isArchived: boolean) => {
    await GatherGlowService.archiveEvent(eventId, isArchived);
    const updatedEvents = await GatherGlowService.loadAllEvents();
    setEvents(updatedEvents);
    if (activeEvent?.id === eventId) {
      setActiveEvent(prev => prev ? { ...prev, isArchived } : null);
    }
  };

  const handleRefinePlan = async (prompt: string) => {
    if (!activeEvent || !aiPlan) return;
    setIsAiLoading(true);
    try {
      const refined = await GatherGlowService.refineAiPlan(aiPlan, prompt, activeEvent);
      setAiPlan(refined);
    } catch (err) {
      console.error('[GatherGlow] Error refining plan:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSavePlanOverride = async (updatedPlan: AIEventPlan) => {
    if (!activeEvent) return;
    await GatherGlowService.saveAiPlan(activeEvent.id, updatedPlan);
    setAiPlan(updatedPlan);
  };

  // Entity mutations
  const handleSaveBudgetItem = async (item: BudgetItem) => {
    await GatherGlowService.saveBudgetItem(item);
    if (activeEvent) {
      const updated = await GatherGlowService.loadBudget(activeEvent.id);
      setBudgetItems(updated);
      setAllBudgets(prev => ({ ...prev, [activeEvent.id]: updated }));
    }
  };

  const handleDeleteBudgetItem = async (itemId: string) => {
    await GatherGlowService.deleteBudgetItem(itemId);
    if (activeEvent) {
      const updated = await GatherGlowService.loadBudget(activeEvent.id);
      setBudgetItems(updated);
      setAllBudgets(prev => ({ ...prev, [activeEvent.id]: updated }));
    }
  };

  const handleSaveTask = async (task: TimelineTask) => {
    await GatherGlowService.saveTask(task);
    if (activeEvent) {
      const updated = await GatherGlowService.loadTasks(activeEvent.id);
      setTasks(updated);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    await GatherGlowService.deleteTask(taskId);
    if (activeEvent) {
      const updated = await GatherGlowService.loadTasks(activeEvent.id);
      setTasks(updated);
    }
  };

  const handleSaveVendor = async (vendor: VendorRecord) => {
    await GatherGlowService.saveVendor(vendor);
    if (activeEvent) {
      const updated = await GatherGlowService.loadVendors(activeEvent.id);
      setVendors(updated);
    }
  };

  const handleDeleteVendor = async (vendorId: string) => {
    await GatherGlowService.deleteVendor(vendorId);
    if (activeEvent) {
      const updated = await GatherGlowService.loadVendors(activeEvent.id);
      setVendors(updated);
    }
  };

  const handleSaveGuest = async (guest: GuestRecord) => {
    await GatherGlowService.saveGuest(guest);
    if (activeEvent) {
      const updated = await GatherGlowService.loadGuests(activeEvent.id);
      setGuests(updated);
      setAllGuests(prev => ({ ...prev, [activeEvent.id]: updated }));
    }
  };

  const handleDeleteGuest = async (guestId: string) => {
    await GatherGlowService.deleteGuest(guestId);
    if (activeEvent) {
      const updated = await GatherGlowService.loadGuests(activeEvent.id);
      setGuests(updated);
      setAllGuests(prev => ({ ...prev, [activeEvent.id]: updated }));
    }
  };

  const handleSaveTeamRole = async (role: TeamRoleAssignment) => {
    await GatherGlowService.saveTeamRole(role);
    if (activeEvent) {
      const updated = await GatherGlowService.loadTeamRoles(activeEvent.id);
      setTeamRoles(updated);
    }
  };

  const handleDeleteTeamRole = async (roleId: string) => {
    await GatherGlowService.deleteTeamRole(roleId);
    if (activeEvent) {
      const updated = await GatherGlowService.loadTeamRoles(activeEvent.id);
      setTeamRoles(updated);
    }
  };

  const getDaysLeft = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const navTabs: Array<{ id: GatherGlowSubView; label: string; icon: React.ReactNode }> = [
    { id: 'my_events', label: t.myEvents, icon: <Layers className="w-4 h-4" /> },
    { id: 'ai_planner', label: t.aiPlanner, icon: <Sparkles className="w-4 h-4 text-amber-500" /> },
    { id: 'budget', label: t.budget, icon: <DollarSign className="w-4 h-4 text-emerald-500" /> },
    { id: 'timeline', label: t.timeline, icon: <Clock className="w-4 h-4 text-blue-500" /> },
    { id: 'vendors', label: t.vendors, icon: <Building2 className="w-4 h-4 text-purple-500" /> },
    { id: 'guests', label: t.guests, icon: <Users className="w-4 h-4 text-rose-500" /> },
    { id: 'team_roles', label: t.teamRoles, icon: <Compass className="w-4 h-4 text-indigo-500" /> },
    { id: 'event_day', label: t.eventDay, icon: <Calendar className="w-4 h-4 text-amber-600" /> },
    { id: 'reports', label: t.reports, icon: <FileText className="w-4 h-4 text-slate-500" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Application Ribbon */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        {/* Title & Brand */}
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5 shadow-md shadow-rose-500/15 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-xl">
              🏮
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Gather & Glow
              </h1>
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                {t.brandSubtitle}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'vi' 
                ? 'Tổ chức tiệc trọn vẹn. Lập kế hoạch thông minh. Gắn kết yêu thương.'
                : 'Celebrate beautifully. Plan intelligently. Bring people together.'}
            </p>
          </div>
        </div>

        {/* Right Controls: Language, Pricing, Guide, Event Switcher & New Event */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            title={language === 'en' ? 'Chuyển sang Tiếng Việt' : 'Switch to English'}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>{language === 'en' ? 'VI' : 'EN'}</span>
          </button>

          {/* Pricing Modal Button */}
          <button
            onClick={() => setIsPricingOpen(true)}
            className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold transition-colors cursor-pointer"
          >
            <Tag className="w-3.5 h-3.5" />
            <span>{t.pricing}</span>
          </button>

          {/* Guide & FAQ Button */}
          <button
            onClick={() => setIsGuideOpen(true)}
            className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t.guide}</span>
          </button>

          {events.length > 0 && activeEvent && (
            <div className="relative">
              <button
                onClick={() => setIsEventDropdownOpen(!isEventDropdownOpen)}
                className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 hover:border-slate-400 shadow-2xs transition-colors cursor-pointer"
              >
                <span className="truncate max-w-[160px]">{activeEvent.title}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              {isEventDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {language === 'vi' ? 'Chọn Sự Kiện' : 'Switch Celebration'}
                  </div>
                  {events.map(ev => (
                    <button
                      key={ev.id}
                      onClick={() => handleSelectEvent(ev)}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors ${
                        activeEvent.id === ev.id ? 'bg-rose-50 text-rose-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate pr-2">{ev.title}</span>
                      <span className="text-[10px] text-slate-400 shrink-0">{ev.date}</span>
                    </button>
                  ))}
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={() => {
                        setEditingWizardEvent(null);
                        setIsWizardOpen(true);
                        setIsEventDropdownOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center space-x-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{t.createEventBtn}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => {
              setEditingWizardEvent(null);
              setIsWizardOpen(true);
            }}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-700 hover:to-purple-700 text-white text-xs font-bold shadow-md shadow-rose-500/20 active:scale-98 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.createEventBtn}</span>
          </button>
        </div>
      </div>

      {/* Quick Summary Pill Bar when Event is selected */}
      {activeEvent && (
        <div className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-y-2 gap-x-4 text-xs">
          <div className="flex items-center space-x-3">
            <span className="font-bold text-slate-900">{activeEvent.title}</span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="text-slate-500">
              {new Date(activeEvent.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="text-slate-500">{activeEvent.location}</span>
          </div>

          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center space-x-1 text-slate-600 font-medium">
              <span>{t.totalBudget}:</span>
              <strong className="text-emerald-700">{activeEvent.currency} {activeEvent.totalBudget.toLocaleString()}</strong>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-semibold border border-amber-200">
              {getDaysLeft(activeEvent.date) > 0 
                ? `${getDaysLeft(activeEvent.date)} ${t.daysToEvent.toLowerCase()}` 
                : t.today}
            </span>
          </div>
        </div>
      )}

      {/* Primary Sub-Navigation Tabs */}
      <div className="flex items-center space-x-1 overflow-x-auto pb-1 border-b border-slate-200">
        {navTabs.map(tab => {
          const isActive = activeSubView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubView(tab.id)}
              className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Body */}
      {activeSubView === 'my_events' && (
        <MyEventsView
          events={events}
          activeEvent={activeEvent}
          language={language}
          onSelectEvent={handleSelectEvent}
          onOpenCreateModal={() => {
            setEditingWizardEvent(null);
            setIsWizardOpen(true);
          }}
          onOpenEditModal={(ev) => {
            setEditingWizardEvent(ev);
            setIsWizardOpen(true);
          }}
          onDeleteEvent={handleDeleteEvent}
          onDuplicateEvent={handleDuplicateEvent}
          onArchiveEvent={handleArchiveEvent}
          onExportEvent={(eventId) => {
            const ev = events.find(e => e.id === eventId);
            if (ev) {
              setActiveEvent(ev);
              setActiveSubView('reports');
            }
          }}
          onOpenPricingModal={() => setIsPricingOpen(true)}
          onOpenGuideModal={() => setIsGuideOpen(true)}
          allBudgets={allBudgets}
          allGuests={allGuests}
        />
      )}

      {activeEvent && activeSubView === 'ai_planner' && (
        <AiPlannerView
          event={activeEvent}
          aiPlan={aiPlan}
          isLoading={isAiLoading}
          language={language}
          onRegeneratePlan={() => handleGenerateAiPlan()}
          onRefinePlan={handleRefinePlan}
          onExportMarkdown={() => setActiveSubView('reports')}
          onSavePlanOverride={handleSavePlanOverride}
        />
      )}

      {activeEvent && activeSubView === 'budget' && (
        <BudgetManagerView
          event={activeEvent}
          budgetItems={budgetItems}
          onSaveBudgetItem={handleSaveBudgetItem}
          onDeleteBudgetItem={handleDeleteBudgetItem}
        />
      )}

      {activeEvent && activeSubView === 'timeline' && (
        <TimelineManagerView
          event={activeEvent}
          tasks={tasks}
          onSaveTask={handleSaveTask}
          onDeleteTask={handleDeleteTask}
        />
      )}

      {activeEvent && activeSubView === 'vendors' && (
        <VendorManagerView
          event={activeEvent}
          vendors={vendors}
          onSaveVendor={handleSaveVendor}
          onDeleteVendor={handleDeleteVendor}
        />
      )}

      {activeEvent && activeSubView === 'guests' && (
        <GuestManagerView
          event={activeEvent}
          guests={guests}
          onSaveGuest={handleSaveGuest}
          onDeleteGuest={handleDeleteGuest}
        />
      )}

      {activeEvent && activeSubView === 'team_roles' && (
        <TeamRolesView
          event={activeEvent}
          teamRoles={teamRoles}
          tasks={tasks}
          onSaveRole={handleSaveTeamRole}
          onDeleteRole={handleDeleteTeamRole}
        />
      )}

      {activeEvent && activeSubView === 'event_day' && (
        <EventDayView
          event={activeEvent}
          aiPlan={aiPlan}
          vendors={vendors}
          teamRoles={teamRoles}
        />
      )}

      {activeEvent && activeSubView === 'reports' && (
        <ReportsView
          event={activeEvent}
          budgetItems={budgetItems}
          tasks={tasks}
          vendors={vendors}
          guests={guests}
          teamRoles={teamRoles}
          aiPlan={aiPlan}
          onDeleteEvent={handleDeleteEvent}
        />
      )}

      {/* Interactive Event Wizard Modal */}
      <EventWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSave={handleSaveEvent}
        initialEvent={editingWizardEvent}
      />

      {/* Commercial Pricing Modal */}
      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        language={language}
      />

      {/* Onboarding Guide & FAQ Modal */}
      <UserGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        language={language}
      />
    </div>
  );
};
