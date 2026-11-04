import React, { useState } from 'react';
import { GatherEvent, GuestRecord, RsvpStatus, InvitationStatus } from '../types';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ShieldCheck, 
  Utensils, 
  HeartHandshake,
  X,
  Star,
  Download,
  Upload
} from 'lucide-react';

interface GuestManagerViewProps {
  event: GatherEvent;
  guests: GuestRecord[];
  onSaveGuest: (guest: GuestRecord) => void;
  onDeleteGuest: (guestId: string) => void;
}

export const GuestManagerView: React.FC<GuestManagerViewProps> = ({
  event,
  guests,
  onSaveGuest,
  onDeleteGuest
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [rsvpFilter, setRsvpFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [csvTextInput, setCsvTextInput] = useState('');
  const [editingGuest, setEditingGuest] = useState<GuestRecord | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState<RsvpStatus>('pending');
  const [invitationStatus, setInvitationStatus] = useState<InvitationStatus>('draft');
  const [plusOnes, setPlusOnes] = useState<number>(0);
  const [dietaryRequirements, setDietaryRequirements] = useState<string>('');
  const [tableOrSeating, setTableOrSeating] = useState('');
  const [isVIP, setIsVIP] = useState(false);
  const [notes, setNotes] = useState('');

  // Metrics
  const attendingCount = guests.filter(g => g.rsvpStatus === 'attending').length;
  const totalAttendingSeats = guests.reduce((sum, g) => sum + (g.rsvpStatus === 'attending' ? (1 + (g.plusOnes || 0)) : 0), 0);
  const tentativeCount = guests.filter(g => g.rsvpStatus === 'tentative').length;
  const declinedCount = guests.filter(g => g.rsvpStatus === 'declined').length;
  const pendingCount = guests.filter(g => g.rsvpStatus === 'pending').length;

  // Dietary Aggregation
  const dietaryMap: Record<string, number> = {};
  guests.forEach(g => {
    if (g.rsvpStatus === 'attending' && g.dietaryRequirements) {
      g.dietaryRequirements.forEach(req => {
        const trimmed = req.trim();
        if (trimmed && trimmed.toLowerCase() !== 'none') {
          dietaryMap[trimmed] = (dietaryMap[trimmed] || 0) + 1;
        }
      });
    }
  });

  const openAddModal = () => {
    setEditingGuest(null);
    setName('');
    setEmail('');
    setPhone('');
    setRsvpStatus('pending');
    setInvitationStatus('draft');
    setPlusOnes(0);
    setDietaryRequirements('');
    setTableOrSeating('');
    setIsVIP(false);
    setNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (guest: GuestRecord) => {
    setEditingGuest(guest);
    setName(guest.name);
    setEmail(guest.email || '');
    setPhone(guest.phone || '');
    setRsvpStatus(guest.rsvpStatus);
    setInvitationStatus(guest.invitationStatus);
    setPlusOnes(guest.plusOnes || 0);
    setDietaryRequirements(guest.dietaryRequirements?.join(', ') || '');
    setTableOrSeating(guest.tableOrSeating || '');
    setIsVIP(guest.isVIP);
    setNotes(guest.notes || '');
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const dietaryArr = dietaryRequirements
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const newGuest: GuestRecord = {
      id: editingGuest?.id || `guest-${Date.now()}`,
      eventId: event.id,
      name: name.trim(),
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      rsvpStatus,
      invitationStatus,
      plusOnes: Number(plusOnes) || 0,
      dietaryRequirements: dietaryArr,
      tableOrSeating: tableOrSeating.trim() || 'Unassigned',
      isVIP,
      notes: notes.trim()
    };

    onSaveGuest(newGuest);
    setIsModalOpen(false);
  };

  const filteredGuests = guests.filter(g => {
    if (rsvpFilter !== 'all' && g.rsvpStatus !== rsvpFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = g.name.toLowerCase().includes(q);
      const matchTable = g.tableOrSeating.toLowerCase().includes(q);
      const matchDiet = g.dietaryRequirements?.some(d => d.toLowerCase().includes(q));
      if (!matchName && !matchTable && !matchDiet) return false;
    }
    return true;
  });

  const getRsvpBadge = (status: RsvpStatus) => {
    switch (status) {
      case 'attending':
        return <span className="inline-flex items-center space-x-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 className="w-3 h-3 text-emerald-600" /><span>Attending</span></span>;
      case 'declined':
        return <span className="inline-flex items-center space-x-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500"><XCircle className="w-3 h-3 text-slate-400" /><span>Declined</span></span>;
      case 'tentative':
        return <span className="inline-flex items-center space-x-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200"><HelpCircle className="w-3 h-3 text-amber-600" /><span>Tentative</span></span>;
      case 'pending':
        return <span className="inline-flex items-center space-x-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200"><span>Awaiting RSVP</span></span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* RSVP Tally Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Confirmed Attending</span>
          <div className="text-2xl font-black text-emerald-600">{totalAttendingSeats} <span className="text-xs font-normal text-slate-500">seats</span></div>
          <div className="text-[11px] text-slate-500">{attendingCount} parties ({event.expectedGuests} target)</div>
        </div>

        <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Awaiting RSVP</span>
          <div className="text-2xl font-black text-blue-600">{pendingCount}</div>
          <div className="text-[11px] text-slate-500">Follow-up needed</div>
        </div>

        <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Tentative</span>
          <div className="text-2xl font-black text-amber-600">{tentativeCount}</div>
          <div className="text-[11px] text-slate-500">Checking schedules</div>
        </div>

        <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Declined with Love</span>
          <div className="text-2xl font-black text-slate-400">{declinedCount}</div>
          <div className="text-[11px] text-slate-500">Sending warm wishes</div>
        </div>
      </div>

      {/* Dietary Alert Card for Catering */}
      {Object.keys(dietaryMap).length > 0 && (
        <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-950">
          <div className="flex items-center space-x-2">
            <Utensils className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold">Catering Dietary Breakdown (Attending Guests):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(dietaryMap).map(([req, count]) => (
              <span key={req} className="px-2.5 py-0.5 rounded-lg bg-white border border-emerald-300 font-semibold text-emerald-900 shadow-2xs">
                {req}: <strong>{count}</strong>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Controls Bar: Search, Filter, Add */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2 flex-1 max-w-md">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search guest name, table, or dietary..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Filter */}
          <select
            value={rsvpFilter}
            onChange={e => setRsvpFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
          >
            <option value="all">All Statuses ({guests.length})</option>
            <option value="attending">Attending</option>
            <option value="pending">Pending</option>
            <option value="tentative">Tentative</option>
            <option value="declined">Declined</option>
          </select>

          <button
            onClick={() => {
              const headers = ['Name', 'Email', 'Phone', 'RSVP Status', 'Plus Ones', 'Dietary Requirements', 'Table / Seating', 'VIP', 'Notes'];
              const rows = guests.map(g => [
                `"${g.name.replace(/"/g, '""')}"`,
                `"${(g.email || '').replace(/"/g, '""')}"`,
                `"${(g.phone || '').replace(/"/g, '""')}"`,
                g.rsvpStatus,
                g.plusOnes || 0,
                `"${(g.dietaryRequirements || []).join('; ').replace(/"/g, '""')}"`,
                `"${(g.tableOrSeating || '').replace(/"/g, '""')}"`,
                g.isVIP ? 'Yes' : 'No',
                `"${(g.notes || '').replace(/"/g, '""')}"`
              ]);
              const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
              const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${event.title.replace(/\s+/g, '_')}_Guests.csv`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="inline-flex items-center space-x-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
            title="Download CSV list"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsCsvModalOpen(true)}
            className="inline-flex items-center space-x-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
            title="Import guest list from CSV"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={openAddModal}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs shrink-0 active:scale-98 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Guest</span>
          </button>
        </div>
      </div>

      {/* Guest Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Guest Name</th>
                <th className="py-3 px-4">RSVP Status</th>
                <th className="py-3 px-4">Seats / +1</th>
                <th className="py-3 px-4">Table / Seating</th>
                <th className="py-3 px-4">Dietary & Care</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No guests found. Click "Add Guest" to build your invitation list.
                  </td>
                </tr>
              ) : (
                filteredGuests.map(guest => (
                  <tr key={guest.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-slate-900 text-sm">{guest.name}</span>
                        {guest.isVIP && (
                          <span title="Honored VIP" className="text-amber-500">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
                        {guest.phone && <span>{guest.phone}</span>}
                        {guest.email && <span>{guest.email}</span>}
                      </div>
                      {guest.notes && (
                        <div className="text-[11px] text-slate-500 italic mt-0.5">
                          "{guest.notes}"
                        </div>
                      )}
                    </td>

                    {/* RSVP */}
                    <td className="py-3.5 px-4">
                      {getRsvpBadge(guest.rsvpStatus)}
                    </td>

                    {/* Plus Ones */}
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      1 + {guest.plusOnes} = <span className="font-bold text-slate-900">{1 + (guest.plusOnes || 0)}</span>
                    </td>

                    {/* Table / Seating */}
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium text-xs border border-slate-200">
                        {guest.tableOrSeating || 'Unassigned'}
                      </span>
                    </td>

                    {/* Dietary */}
                    <td className="py-3.5 px-4">
                      {guest.dietaryRequirements && guest.dietaryRequirements.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {guest.dietaryRequirements.map((d, idx) => (
                            <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                              {d}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Standard</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => openEditModal(guest)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Remove "${guest.name}" from guest list?`)) {
                              onDeleteGuest(guest.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Guest Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <h4 className="font-bold text-base">
                {editingGuest ? 'Edit Guest Record' : 'Add Guest to Celebration'}
              </h4>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name / Household *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Sarah & Mark Chen"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    RSVP Status
                  </label>
                  <select
                    value={rsvpStatus}
                    onChange={e => setRsvpStatus(e.target.value as RsvpStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  >
                    <option value="pending">Awaiting RSVP</option>
                    <option value="attending">Confirmed Attending</option>
                    <option value="tentative">Tentative</option>
                    <option value="declined">Declined</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Invitation Status
                  </label>
                  <select
                    value={invitationStatus}
                    onChange={e => setInvitationStatus(e.target.value as InvitationStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  >
                    <option value="draft">Draft / Unsent</option>
                    <option value="sent">Invitation Sent</option>
                    <option value="delivered">Delivered & Opened</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Plus Ones (+ Guests)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={plusOnes}
                    onChange={e => setPlusOnes(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Table / Seating Assignment
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Table 3 — Mentors"
                    value={tableOrSeating}
                    onChange={e => setTableOrSeating(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="guest@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+1 415 555 0192"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Dietary Restrictions (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Vegetarian, Gluten-Free, Nut Allergy"
                  value={dietaryRequirements}
                  onChange={e => setDietaryRequirements(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Special Hospitality Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Needs step-free seating near front; arriving Friday evening."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isVIP}
                    onChange={e => setIsVIP(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-500 w-4 h-4"
                  />
                  <span>Mark as Honored VIP (Family Patriarch / Matriarch / Dignitary)</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Save Guest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {isCsvModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden my-8">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-slate-800 font-bold text-sm">
                <Upload className="w-4 h-4 text-rose-600" />
                <span>Import Guests from CSV</span>
              </div>
              <button
                onClick={() => setIsCsvModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Paste your comma-separated guest data below. The first row should contain headers.
                Format: <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">Name, Email, Phone, RSVP Status, Plus Ones, Dietary Requirements, Table, VIP, Notes</code>
              </p>

              <textarea
                rows={7}
                value={csvTextInput}
                onChange={e => setCsvTextInput(e.target.value)}
                placeholder={`Name, Email, Phone, RSVP Status, Plus Ones, Dietary Requirements, Table, VIP, Notes
"Uncle Hai", "hai@example.com", "+84 901 234 567", attending, 1, "Vegetarian", "Table 1", Yes, "Honored elder"
"Lan Nguyen", "lan@example.com", "", pending, 0, "None", "Table 2", No, ""`
                }
                className="w-full p-3 font-mono text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200">
                <button
                  onClick={() => setIsCsvModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!csvTextInput.trim()) return;
                    const lines = csvTextInput.split(/\r?\n/).filter(line => line.trim().length > 0);
                    if (lines.length > 1) {
                      for (let i = 1; i < lines.length; i++) {
                        const line = lines[i];
                        const match = line.match(/(?:^|,)("(?:[^"]|"")*"|[^,]*)/g);
                        if (!match) continue;
                        const cells = match.map(c => {
                          let v = c.startsWith(',') ? c.slice(1) : c;
                          if (v.startsWith('"') && v.endsWith('"')) {
                            v = v.slice(1, -1).replace(/""/g, '"');
                          }
                          return v.trim();
                        });
                        const name = cells[0];
                        if (!name) continue;
                        const rsvp = (['attending', 'declined', 'tentative', 'pending'].includes(cells[3]?.toLowerCase())
                          ? cells[3].toLowerCase()
                          : 'pending') as GuestRecord['rsvpStatus'];
                        const dietary = (cells[5] || '')
                          .split(/[;,]/)
                          .map(s => s.trim())
                          .filter(Boolean);
                        const newG: GuestRecord = {
                          id: `guest-imported-${Date.now()}-${i}`,
                          eventId: event.id,
                          name,
                          email: cells[1] || undefined,
                          phone: cells[2] || undefined,
                          rsvpStatus: rsvp,
                          invitationStatus: 'draft',
                          plusOnes: parseInt(cells[4], 10) || 0,
                          dietaryRequirements: dietary,
                          tableOrSeating: cells[6] || '',
                          isVIP: (cells[7] || '').toLowerCase() === 'yes',
                          notes: cells[8] || ''
                        };
                        onSaveGuest(newG);
                      }
                    }
                    setCsvTextInput('');
                    setIsCsvModalOpen(false);
                  }}
                  disabled={!csvTextInput.trim()}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs disabled:opacity-50"
                >
                  Parse & Import Guests
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
