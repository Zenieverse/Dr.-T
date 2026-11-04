import React, { useState } from 'react';
import { GatherEvent, AIEventPlan, VendorRecord, TeamRoleAssignment, ThreeHatRoleType } from '../types';
import { 
  Clock, 
  CheckCircle2, 
  Circle, 
  PhoneCall, 
  ShieldAlert, 
  Sparkles, 
  AlertTriangle,
  Heart,
  Briefcase,
  Users,
  Compass,
  Printer
} from 'lucide-react';
import { PrintableEventDayModal } from './PrintableEventDayModal';

interface EventDayViewProps {
  event: GatherEvent;
  aiPlan: AIEventPlan | null;
  vendors: VendorRecord[];
  teamRoles: TeamRoleAssignment[];
}

export const EventDayView: React.FC<EventDayViewProps> = ({
  event,
  aiPlan,
  vendors,
  teamRoles
}) => {
  const [completedSlots, setCompletedSlots] = useState<Record<number, boolean>>({});
  const [completedKitItems, setCompletedKitItems] = useState<Record<string, boolean>>({});
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const runningOrder = aiPlan?.eventDayRunningOrder || [
    { time: '12:00', activity: 'Venue Load-In & Decor Installation', responsibleHat: 'professional' as ThreeHatRoleType, leadPerson: 'Coordinator', notes: 'Tables, sound equipment, and decor placed.' },
    { time: '14:30', activity: 'Honoree & Family Arrival & Quiet Grounding', responsibleHat: 'personal' as ThreeHatRoleType, leadPerson: 'Host Team', notes: 'Stay hydrated, check attire, take quiet moment.' },
    { time: '15:30', activity: 'Guest Arrival & Welcome Refreshments', responsibleHat: 'social' as ThreeHatRoleType, leadPerson: 'Welcome Ambassadors', notes: 'Offer drinks, escort to seats.' },
    { time: '16:00', activity: 'Ceremony / Opening Blessing', responsibleHat: 'personal' as ThreeHatRoleType, leadPerson: 'Couple / Officiant', notes: 'Vows and blessings.' },
    { time: '17:30', activity: 'Dinner Feast Commences', responsibleHat: 'professional' as ThreeHatRoleType, leadPerson: 'Catering Lead', notes: 'Multi-course meal served.' },
    { time: '19:30', activity: 'Toasts & Family Storytelling', responsibleHat: 'social' as ThreeHatRoleType, leadPerson: 'Toastmaster', notes: 'Meaningful toasts and archival photos.' },
    { time: '20:30', activity: 'Music, Celebration & Dancing', responsibleHat: 'social' as ThreeHatRoleType, leadPerson: 'Live Band / DJ', notes: 'Celebratory dance and dessert table.' },
    { time: '22:00', activity: 'Farewell Send-Off & Wrap-Up', responsibleHat: 'professional' as ThreeHatRoleType, leadPerson: 'Coordinator', notes: 'Favors distributed, shuttles depart.' }
  ];

  const emergencyKit = [
    { id: 'kit-1', item: 'Medical First Aid Kit (bandages, antihistamines, burn gel, pain relievers)' },
    { id: 'kit-2', item: 'Extra 9V / AA Alkaline batteries for wireless ceremony microphones' },
    { id: 'kit-3', item: 'Phone power banks with Lightning, USB-C, and micro-USB cables' },
    { id: 'kit-4', item: 'Emergency sewing kit with safety pins, lint roller, and hem tape' },
    { id: 'kit-5', item: '5-pack unassigned allergen-safe / vegan vacuum-sealed meals' },
    { id: 'kit-6', item: 'Printed physical copy of vendor contracts and master run-sheet' },
    { id: 'kit-7', item: 'Compact umbrella reserve for grandparents and elders' },
    { id: 'kit-8', item: 'Hydration cooler with electrolyte bottled water' }
  ];

  const toggleSlot = (idx: number) => {
    setCompletedSlots(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleKit = (id: string) => {
    setCompletedKitItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getHatBadge = (hat: ThreeHatRoleType) => {
    switch (hat) {
      case 'professional':
        return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">🎩 Professional</span>;
      case 'personal':
        return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">💖 Personal</span>;
      case 'social':
        return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">🤝 Social</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Clock className="w-4 h-4" />
            <span>Event Day Live Control Room</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black">
            {event.title}
          </h3>
          <p className="text-xs text-slate-400">
            {new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} • {event.location}
          </p>
        </div>

        <div className="flex items-center space-x-3 self-start sm:self-center">
          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs backdrop-blur-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Printable Briefing</span>
          </button>

          <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
            <span className="text-[11px] text-slate-300 block font-medium">Scheduled Start</span>
            <span className="text-lg font-bold text-amber-300 font-mono">
              {event.time || '15:30'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Master Run-Sheet (Left) and Emergency Contacts & Kit (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interactive Run-Sheet (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-base">Master Hour-by-Hour Run-Sheet</h4>
            <span className="text-xs text-slate-500 font-medium">
              Click checkmark to track live execution
            </span>
          </div>

          <div className="space-y-3">
            {runningOrder.map((slot, idx) => {
              const isDone = completedSlots[idx];

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 shadow-xs ${
                    isDone 
                      ? 'bg-emerald-50/50 border-emerald-200 opacity-75' 
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start space-x-3.5">
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleSlot(idx)}
                      className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    {/* Slot Info */}
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2.5">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-900 text-white">
                          {slot.time}
                        </span>
                        <h5 className={`text-sm font-bold ${isDone ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                          {slot.activity}
                        </h5>
                      </div>

                      {slot.notes && (
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {slot.notes}
                        </p>
                      )}

                      <div className="text-[11px] text-slate-500">
                        Lead: <strong className="text-slate-700">{slot.leadPerson}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Hat Badge */}
                  <div className="shrink-0">
                    {getHatBadge(slot.responsibleHat)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Speed Dial & Emergency Kit */}
        <div className="space-y-6">
          {/* Emergency Speed Dial */}
          <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center space-x-2 text-rose-700">
              <PhoneCall className="w-4 h-4 text-rose-600" />
              <h4 className="font-bold text-sm text-slate-900">Event Day Speed Dial</h4>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {teamRoles.filter(r => r.phone).slice(0, 3).map(r => (
                <div key={r.id} className="py-2.5 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-800">{r.personName}</div>
                    <div className="text-[11px] text-slate-500">{r.roleTitle}</div>
                  </div>
                  <a
                    href={`tel:${r.phone}`}
                    className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 font-bold hover:bg-rose-100 transition-colors"
                  >
                    Call
                  </a>
                </div>
              ))}

              {vendors.filter(v => v.phone).slice(0, 3).map(v => (
                <div key={v.id} className="py-2.5 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-800">{v.name}</div>
                    <div className="text-[11px] text-slate-500">{v.contactPerson || v.category}</div>
                  </div>
                  <a
                    href={`tel:${v.phone}`}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors"
                  >
                    Call
                  </a>
                </div>
              ))}

              <div className="py-2.5 flex justify-between items-center">
                <div>
                  <div className="font-bold text-slate-800">Local Emergency Ambulance</div>
                  <div className="text-[11px] text-slate-500">Emergency Dispatch</div>
                </div>
                <a
                  href="tel:115"
                  className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold hover:bg-rose-700 transition-colors"
                >
                  115 / 911
                </a>
              </div>
            </div>
          </div>

          {/* Emergency Kit Checklist */}
          <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center space-x-2 text-amber-700">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <h4 className="font-bold text-sm text-slate-900">Emergency Contingency Kit</h4>
            </div>

            <div className="space-y-2">
              {emergencyKit.map(item => {
                const isChecked = completedKitItems[item.id];

                return (
                  <button
                    key={item.id}
                    onClick={() => toggleKit(item.id)}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-start space-x-2.5 ${
                      isChecked
                        ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900 line-through'
                        : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span className="mt-0.5 shrink-0">
                      {isChecked ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </span>
                    <span className="leading-tight">{item.item}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <PrintableEventDayModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        event={event}
        aiPlan={aiPlan}
        vendors={vendors}
        teamRoles={teamRoles}
        language="en"
      />
    </div>
  );
};
