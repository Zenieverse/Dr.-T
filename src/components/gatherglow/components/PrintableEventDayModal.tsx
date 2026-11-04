import React from 'react';
import { X, Printer, Download, Sparkles, PhoneCall, ShieldAlert, Clock, CheckCircle2 } from 'lucide-react';
import { GatherEvent, AIEventPlan, VendorRecord, TeamRoleAssignment } from '../types';

interface PrintableEventDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: GatherEvent;
  aiPlan: AIEventPlan | null;
  vendors: VendorRecord[];
  teamRoles: TeamRoleAssignment[];
  language: 'en' | 'vi';
}

export const PrintableEventDayModal: React.FC<PrintableEventDayModalProps> = ({
  isOpen,
  onClose,
  event,
  aiPlan,
  vendors,
  teamRoles,
  language
}) => {
  if (!isOpen) return null;

  const isVi = language === 'vi';

  const runningOrder = aiPlan?.eventDayRunningOrder || [
    { time: '12:00', activity: 'Venue Load-In & Decor Placement', responsibleHat: 'professional', leadPerson: 'Coordinator', notes: 'Sound equipment, flowers, and table numbers setup.' },
    { time: '14:30', activity: 'Honoree & Family Arrival & Quiet Grounding', responsibleHat: 'personal', leadPerson: 'Family Lead', notes: 'Hydration and quiet breathing pause.' },
    { time: '15:30', activity: 'Guest Welcome & Refreshments', responsibleHat: 'social', leadPerson: 'Welcome Ambassadors', notes: 'Guestbook greeting and seat guidance.' },
    { time: '16:00', activity: 'Ceremony / Opening Welcome', responsibleHat: 'personal', leadPerson: 'Host / Officiant', notes: 'Ceremonial blessings and exchange of vows.' },
    { time: '17:30', activity: 'Dinner Banquet Feast', responsibleHat: 'professional', leadPerson: 'Catering Lead', notes: 'Multi-course meal service.' },
    { time: '19:30', activity: 'Toasts & Family Storytelling', responsibleHat: 'social', leadPerson: 'Emcee & Family', notes: 'Archival memories and toasts.' },
    { time: '20:30', activity: 'Music, Celebration & Dancing', responsibleHat: 'social', leadPerson: 'DJ / Band', notes: 'Celebration floor opens.' },
    { time: '22:00', activity: 'Farewell Send-Off & Wrap-Up', responsibleHat: 'professional', leadPerson: 'Coordinator', notes: 'Guest departure & vendor load-out.' }
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 print:m-0 print:border-none print:shadow-none print:max-w-none">
        {/* Header - Hidden in Print */}
        <div className="px-6 sm:px-8 py-5 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-3">
            <span className="text-xl">🏮</span>
            <div>
              <h3 className="text-base font-bold">
                {isVi ? 'Bản Tóm Tắt In Giấy Offline — Ngày Sự Kiện' : 'Printable Offline Event Day Briefing'}
              </h3>
              <p className="text-xs text-slate-400">
                {event.title} • {new Date(event.date).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all active:scale-98"
            >
              <Printer className="w-4 h-4" />
              <span>{isVi ? 'In Ngay (Print / PDF)' : 'Print / Save PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Content Body */}
        <div className="p-8 sm:p-10 space-y-6 text-slate-900 print:p-0">
          {/* Document Title Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-slate-500 block">
                Dr. T — Gather & Glow • Master Event Day Briefing
              </span>
              <h1 className="text-2xl sm:text-3xl font-black mt-1">
                {event.title}
              </h1>
              <p className="text-xs text-slate-600 mt-1">
                📅 {new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • 📍 {event.location} {event.venueName ? `(${event.venueName})` : ''}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 font-mono block">Expected Guests</span>
              <span className="text-2xl font-black">{event.expectedGuests}</span>
            </div>
          </div>

          {/* Running Order Table */}
          <div className="space-y-3">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-800 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-rose-600" />
              <span>{isVi ? 'Lịch Trình Khung Giờ Master' : 'Master Hour-by-Hour Running Order'}</span>
            </h2>

            <table className="w-full text-xs text-left border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300">
                  <th className="p-2.5 font-bold w-20 border-r border-slate-300">Time</th>
                  <th className="p-2.5 font-bold border-r border-slate-300">Activity & Milestone</th>
                  <th className="p-2.5 font-bold w-36 border-r border-slate-300">Lead Responsible</th>
                  <th className="p-2.5 font-bold">Execution Notes</th>
                </tr>
              </thead>
              <tbody>
                {runningOrder.map((slot, idx) => (
                  <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="p-2.5 font-mono font-bold text-slate-800 border-r border-slate-200">{slot.time}</td>
                    <td className="p-2.5 font-medium border-r border-slate-200">{slot.activity}</td>
                    <td className="p-2.5 text-slate-700 border-r border-slate-200">
                      <span className="font-semibold">{slot.leadPerson}</span>
                      <span className="block text-[10px] text-slate-500 uppercase">({slot.responsibleHat} hat)</span>
                    </td>
                    <td className="p-2.5 text-slate-600 italic">{slot.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Key Emergency Contacts & Team Leads */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-slate-300 bg-slate-50 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-2">
                <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
                <span>{isVi ? 'Danh Bạ Khẩn Cấp & Đội Ngũ' : 'Speed Dial & Team Leads'}</span>
              </h3>
              <ul className="text-xs space-y-1.5 text-slate-700">
                {teamRoles.slice(0, 4).map(r => (
                  <li key={r.id} className="flex justify-between border-b border-slate-200 pb-1">
                    <span><strong>{r.personName}</strong> ({r.roleTitle})</span>
                    <span className="font-mono">{r.phone || 'N/A'}</span>
                  </li>
                ))}
                {teamRoles.length === 0 && (
                  <li className="text-slate-500">Lead Coordinator: (User Configured)</li>
                )}
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-slate-300 bg-slate-50 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-2">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                <span>{isVi ? 'Ghi Chú An Toàn & Ăn Kiêng' : 'Dietary & Safety Directives'}</span>
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                <strong>Dietary Needs:</strong> {event.dietaryNeeds?.join(', ') || 'Standard banquet with vegetarian options'}.
              </p>
              <p className="text-xs text-slate-700 leading-relaxed">
                <strong>Accessibility:</strong> {event.accessibilityNeeds?.join(', ') || 'Step-free entrance and ramps available'}.
              </p>
            </div>
          </div>

          {/* Verification Footnote */}
          <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-500">
            <span>Dr. T — Gather & Glow • Offline Execution Blueprint</span>
            <span>Document Generated: {new Date().toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
