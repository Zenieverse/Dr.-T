import React, { useState } from 'react';
import { GatherEvent, BudgetItem, TimelineTask, VendorRecord, GuestRecord, TeamRoleAssignment, AIEventPlan } from '../types';
import { GatherGlowService, FullEventPackage } from '../services/gatherGlowService';
import { 
  FileText, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  Trash2, 
  ShieldAlert, 
  Sparkles,
  Calendar,
  DollarSign,
  Users,
  Compass
} from 'lucide-react';

interface ReportsViewProps {
  event: GatherEvent;
  budgetItems: BudgetItem[];
  tasks: TimelineTask[];
  vendors: VendorRecord[];
  guests: GuestRecord[];
  teamRoles: TeamRoleAssignment[];
  aiPlan: AIEventPlan | null;
  onDeleteEvent: (eventId: string) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  event,
  budgetItems,
  tasks,
  vendors,
  guests,
  teamRoles,
  aiPlan,
  onDeleteEvent
}) => {
  const [copied, setCopied] = useState(false);

  const fullPackage: FullEventPackage = {
    event,
    budget: budgetItems,
    tasks,
    vendors,
    guests,
    teamRoles,
    aiPlan: aiPlan || undefined
  };

  const markdownText = GatherGlowService.generateMarkdownDossier(fullPackage);

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdownText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullPackage, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${event.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_dossier.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  const totalSpent = budgetItems.reduce((acc, b) => acc + (b.actualCost || b.estimatedCost), 0);
  const attendingCount = guests.filter(g => g.rsvpStatus === 'attending').length;

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Celebration Dossier & Export</h3>
          <p className="text-xs text-slate-500">
            Print-ready summaries, structured JSON backups, and complete Markdown journals.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopyMarkdown}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Markdown' : 'Copy Markdown'}</span>
          </button>

          <button
            onClick={handleDownloadJson}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download JSON</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Master Dossier Preview Card */}
      <div className="p-8 sm:p-10 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-6 print:border-none print:shadow-none print:p-0">
        {/* Dossier Header */}
        <div className="border-b border-slate-200 pb-6 space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-rose-600 uppercase tracking-wider">
            <span>Gather & Glow • Celebration Dossier</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            {event.title}
          </h2>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500 pt-1 font-medium">
            <span>📅 {new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span>📍 {event.location}</span>
            <span>👥 {event.expectedGuests} Expected ({attendingCount} Confirmed)</span>
            <span>💰 Budget: {event.currency} {event.totalBudget.toLocaleString()}</span>
          </div>
        </div>

        {/* Theme & Cultural Heritage */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="font-bold text-slate-700 block">Theme & Atmosphere</span>
            <p className="text-slate-600 leading-relaxed">{event.themeStyle}</p>
          </div>
          {event.culturalPreferences && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="font-bold text-slate-700 block">Cultural Traditions & Rites</span>
              <p className="text-slate-600 leading-relaxed">{event.culturalPreferences}</p>
            </div>
          )}
        </div>

        {/* Budget Summary Section */}
        <div className="space-y-3">
          <h4 className="font-bold text-base text-slate-900">Financial Summary</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-2.5">Category</th>
                  <th className="p-2.5">Item Name</th>
                  <th className="p-2.5">Quoted Cost</th>
                  <th className="p-2.5">Paid Amount</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {budgetItems.map(b => (
                  <tr key={b.id}>
                    <td className="p-2.5 font-bold uppercase text-[10px] text-slate-500">{b.category}</td>
                    <td className="p-2.5 font-medium text-slate-800">{b.name}</td>
                    <td className="p-2.5 font-bold">{event.currency} {(b.actualCost || b.vendorQuotation).toLocaleString()}</td>
                    <td className="p-2.5 text-emerald-600 font-semibold">{event.currency} {b.paidAmount.toLocaleString()}</td>
                    <td className="p-2.5 uppercase text-[10px] text-slate-500">{b.paymentStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Running Order Section */}
        {aiPlan && (
          <div className="space-y-3">
            <h4 className="font-bold text-base text-slate-900">Event-Day Running Order</h4>
            <div className="space-y-2">
              {aiPlan.eventDayRunningOrder.map((slot, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center text-xs">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-bold text-slate-900">{slot.time}</span>
                    <span className="font-medium text-slate-800">{slot.activity}</span>
                  </div>
                  <span className="text-slate-500">{slot.leadPerson}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Three Hats Team Section */}
        <div className="space-y-3">
          <h4 className="font-bold text-base text-slate-900">Three Hats Team Responsibilities</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {teamRoles.map(r => (
              <div key={r.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">{r.personName}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-500">[{r.hat}]</span>
                </div>
                <div className="text-rose-600 font-medium">{r.roleTitle}</div>
                <ul className="text-slate-500 space-y-0.5 pt-1">
                  {r.coreResponsibilities.slice(0, 2).map((duty, dIdx) => (
                    <li key={dIdx}>• {duty}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Notes */}
        <div className="pt-6 border-t border-slate-200 text-center text-xs text-slate-400">
          Generated with Dr. T Gather & Glow • Data Sovereignty & User-Controlled Privacy Protected
        </div>
      </div>

      {/* Danger Zone: Data Sovereignty & Wipe */}
      <div className="p-6 bg-rose-50/50 rounded-3xl border border-rose-200 space-y-3">
        <div className="flex items-center space-x-2 text-rose-700">
          <ShieldAlert className="w-5 h-5 text-rose-600" />
          <h4 className="font-bold text-sm">Data Sovereignty & Permanent Deletion</h4>
        </div>
        <p className="text-xs text-rose-800 max-w-xl">
          You own your event records. You can permanently delete this event, including all associated budget items, vendor records, guest lists, and AI plans from your browser and cloud storage.
        </p>
        <button
          onClick={() => {
            if (confirm(`Are you completely sure you want to permanently erase "${event.title}" and all its records? This cannot be undone.`)) {
              onDeleteEvent(event.id);
            }
          }}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>Permanently Delete Celebration</span>
        </button>
      </div>
    </div>
  );
};
