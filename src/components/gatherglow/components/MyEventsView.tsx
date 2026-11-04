import React, { useState } from 'react';
import { GatherEvent, BudgetItem, GuestRecord } from '../types';
import { 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign, 
  Plus, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  Edit3, 
  Trash2, 
  Download,
  Copy,
  Archive,
  ArchiveRestore,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { GATHER_GLOW_TRANSLATIONS, GatherGlowLanguage } from '../translations';

interface MyEventsViewProps {
  events: GatherEvent[];
  activeEvent: GatherEvent | null;
  language: GatherGlowLanguage;
  onSelectEvent: (event: GatherEvent) => void;
  onOpenCreateModal: () => void;
  onOpenEditModal: (event: GatherEvent) => void;
  onDeleteEvent: (eventId: string) => void;
  onDuplicateEvent: (eventId: string) => void;
  onArchiveEvent: (eventId: string, isArchived: boolean) => void;
  onExportEvent: (eventId: string) => void;
  onOpenPricingModal?: () => void;
  onOpenGuideModal?: () => void;
  allBudgets: Record<string, BudgetItem[]>;
  allGuests: Record<string, GuestRecord[]>;
}

export const MyEventsView: React.FC<MyEventsViewProps> = ({
  events,
  activeEvent,
  language = 'en',
  onSelectEvent,
  onOpenCreateModal,
  onOpenEditModal,
  onDeleteEvent,
  onDuplicateEvent,
  onArchiveEvent,
  onExportEvent,
  onOpenPricingModal,
  onOpenGuideModal,
  allBudgets,
  allGuests
}) => {
  const t = GATHER_GLOW_TRANSLATIONS[language] || GATHER_GLOW_TRANSLATIONS.en;
  const isVi = language === 'vi';

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'this_month' | 'completed' | 'archived'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const getDaysLeft = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getEventTypeEmoji = (type: string) => {
    switch (type) {
      case 'wedding': return '💍';
      case 'anniversary': return '🥂';
      case 'birthday': return '🎂';
      case 'family_celebration': return '🏡';
      case 'community_gathering': return '🏮';
      case 'cultural_festival': return '🎋';
      case 'fundraiser': return '🤝';
      default: return '✨';
    }
  };

  // Filter events
  const filteredEvents = events.filter(ev => {
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = ev.title.toLowerCase().includes(q);
      const matchLoc = (ev.location || '').toLowerCase().includes(q);
      if (!matchTitle && !matchLoc) return false;
    }

    // Category filter
    if (categoryFilter !== 'all' && ev.eventType !== categoryFilter) {
      return false;
    }

    // Status filter
    const days = getDaysLeft(ev.date);
    if (statusFilter === 'archived') {
      return Boolean(ev.isArchived);
    }
    // For non-archived views, hide archived events
    if (ev.isArchived) return false;

    if (statusFilter === 'upcoming') {
      return days > 30;
    }
    if (statusFilter === 'this_month') {
      return days >= 0 && days <= 30;
    }
    if (statusFilter === 'completed') {
      return days < 0;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Hero Welcome & Quick Stats Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-rose-600 to-purple-700 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>{t.brandSubtitle}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            {t.celebrateTitle}
          </h2>
          <p className="text-sm text-rose-100 leading-relaxed">
            {t.heroDescription}
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={onOpenCreateModal}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white text-rose-700 hover:bg-rose-50 font-bold text-sm shadow-md transition-all active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>{t.createEventBtn}</span>
            </button>

            {onOpenPricingModal && (
              <button
                onClick={onOpenPricingModal}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 backdrop-blur-xs transition-all active:scale-98"
              >
                <span>{t.pricing}</span>
              </button>
            )}

            {onOpenGuideModal && (
              <button
                onClick={onOpenGuideModal}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 backdrop-blur-xs transition-all active:scale-98"
              >
                <span>{t.guide}</span>
              </button>
            )}
          </div>
        </div>

        {/* Decorative Backdrop Glow */}
        <div className="absolute right-0 top-0 -bottom-10 w-96 bg-gradient-to-bl from-white/10 to-transparent pointer-events-none rounded-full blur-2xl" />
        <div className="absolute -bottom-12 right-12 text-9xl opacity-10 select-none pointer-events-none">
          🏮
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t.searchEventsPlaceholder}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto text-xs font-semibold">
            {(['all', 'upcoming', 'this_month', 'completed', 'archived'] as const).map(st => {
              const labelMap = {
                all: t.allEvents,
                upcoming: t.upcoming,
                this_month: t.activeThisMonth,
                completed: t.completed,
                archived: t.archived
              };
              const count = events.filter(e => {
                if (st === 'archived') return Boolean(e.isArchived);
                if (e.isArchived) return false;
                const d = getDaysLeft(e.date);
                if (st === 'upcoming') return d > 30;
                if (st === 'this_month') return d >= 0 && d <= 30;
                if (st === 'completed') return d < 0;
                return true;
              }).length;

              return (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    statusFilter === st
                      ? 'bg-rose-600 text-white shadow-xs font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {labelMap[st]} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Events Grid Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{isVi ? 'Danh Sách Lễ Hội & Sự Kiện' : 'Your Celebrations'}</h3>
          <p className="text-xs text-slate-500">
            {isVi ? 'Chuyển đổi không gian làm việc, quản lý ngân sách và kịch bản chạy ngày sự kiện' : 'Manage timelines, vendors, guest RSVPs, and budgets across your event workspaces'}
          </p>
        </div>
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
          {filteredEvents.length} {filteredEvents.length === 1 ? 'Event' : 'Events'}
        </span>
      </div>

      {/* Events Cards Grid */}
      {filteredEvents.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-300 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto text-3xl">
            ✨
          </div>
          <div className="max-w-sm mx-auto">
            <h4 className="font-bold text-slate-800 text-base">
              {searchQuery ? (isVi ? 'Không tìm thấy sự kiện phù hợp' : 'No matching celebrations found') : (isVi ? 'Chưa có sự kiện nào trong danh mục này' : 'No Celebrations in this view')}
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              {isVi 
                ? 'Hãy thử điều chỉnh bộ lọc hoặc tạo lễ hội mới với AI Event Architect.'
                : 'Try adjusting your search criteria or create a new celebration with guided AI intelligence.'}
            </p>
          </div>
          <button
            onClick={onOpenCreateModal}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-md hover:bg-rose-700 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{t.createEventBtn}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredEvents.map(event => {
            const daysLeft = getDaysLeft(event.date);
            const isSelected = activeEvent?.id === event.id;
            const eventBudgets = allBudgets[event.id] || [];
            const eventGuests = allGuests[event.id] || [];

            const totalAllocated = eventBudgets.reduce(
              (acc, b) => acc + (b.vendorQuotation || b.actualCost || b.estimatedCost || 0), 
              0
            );
            const totalPaid = eventBudgets.reduce((acc, b) => acc + (b.paidAmount || 0), 0);
            const budgetPercent = event.totalBudget > 0 
              ? Math.min(100, Math.round((totalAllocated / event.totalBudget) * 100))
              : 0;

            const attendingGuests = eventGuests.filter(g => g.rsvpStatus === 'attending').length;
            const totalSeats = eventGuests.reduce((sum, g) => sum + (g.rsvpStatus === 'attending' ? (1 + (g.plusOnes || 0)) : 0), 0);

            return (
              <div
                key={event.id}
                className={`relative bg-white rounded-3xl p-6 transition-all border ${
                  isSelected
                    ? 'border-rose-500 ring-2 ring-rose-500/10 shadow-lg'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                {/* Active Workspace Ribbon */}
                {isSelected && (
                  <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-extrabold uppercase tracking-widest shadow-sm">
                    {isVi ? 'Đang Mở Workspace' : 'Active Workspace'}
                  </div>
                )}

                {/* Card Header: Type Badge & Days Countdown */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{getEventTypeEmoji(event.eventType)}</span>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {event.eventType.replace('_', ' ')}
                    </span>
                    {event.isArchived && (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                        {t.archived}
                      </span>
                    )}
                  </div>

                  <div className="text-right">
                    {daysLeft > 0 ? (
                      <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                        ⏳ {daysLeft} {t.daysToEvent}
                      </span>
                    ) : daysLeft === 0 ? (
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 animate-pulse">
                        🎉 {t.today}
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {Math.abs(daysLeft)} {t.daysPast}
                      </span>
                    )}
                  </div>
                </div>

                {/* Event Name & Core Details */}
                <div className="pt-4 space-y-2">
                  <h4 className="text-lg font-black text-slate-900 line-clamp-1">
                    {event.title}
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <div className="flex items-center space-x-1.5 truncate">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 truncate">
                      <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{event.expectedGuests} {t.expectedGuests}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 truncate">
                      <DollarSign className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate font-semibold">{event.currency} {event.totalBudget.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Progress Indicators: Budget & Guests */}
                <div className="pt-4 space-y-3">
                  {/* Budget Allocation Progress */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-medium">
                        {t.budget} ({totalAllocated.toLocaleString()} / {event.totalBudget.toLocaleString()} {event.currency})
                      </span>
                      <span className="font-bold text-slate-700">{budgetPercent}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          budgetPercent > 100
                            ? 'bg-rose-500'
                            : budgetPercent > 80
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, budgetPercent)}%` }}
                      />
                    </div>
                  </div>

                  {/* Guest RSVPs */}
                  <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                    <span className="text-slate-500">{t.guests}:</span>
                    <span className="font-medium text-slate-800">
                      {attendingGuests} {t.rsvpAttending} ({totalSeats} {t.totalSeats}) • {eventGuests.length} Listed
                    </span>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-1 text-slate-400">
                    <button
                      onClick={() => onOpenEditModal(event)}
                      className="p-1.5 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Edit Event Brief"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDuplicateEvent(event.id)}
                      className="p-1.5 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title={t.duplicate}
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onArchiveEvent(event.id, !event.isArchived)}
                      className="p-1.5 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                      title={event.isArchived ? t.unarchive : t.archive}
                    >
                      {event.isArchived ? <ArchiveRestore className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => onExportEvent(event.id)}
                      className="p-1.5 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Download JSON & Markdown Package"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteEvent(event.id)}
                      className="p-1.5 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title={t.delete}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => onSelectEvent(event)}
                    className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm active:scale-98'
                    }`}
                  >
                    <span>{isSelected ? (isVi ? 'Đang Mở' : 'Currently Open') : (isVi ? 'Mở Kế Hoạch' : 'Launch Workspace')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
