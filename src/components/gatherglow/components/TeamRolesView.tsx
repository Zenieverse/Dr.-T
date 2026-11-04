import React, { useState } from 'react';
import { GatherEvent, TeamRoleAssignment, ThreeHatRoleType, TimelineTask } from '../types';
import { 
  Compass, 
  Plus, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Edit3, 
  Trash2, 
  Heart, 
  Briefcase, 
  Users, 
  ShieldCheck, 
  Sparkles,
  X
} from 'lucide-react';

interface TeamRolesViewProps {
  event: GatherEvent;
  teamRoles: TeamRoleAssignment[];
  tasks: TimelineTask[];
  onSaveRole: (role: TeamRoleAssignment) => void;
  onDeleteRole: (roleId: string) => void;
}

export const TeamRolesView: React.FC<TeamRolesViewProps> = ({
  event,
  teamRoles,
  tasks,
  onSaveRole,
  onDeleteRole
}) => {
  const [selectedHat, setSelectedHat] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<TeamRoleAssignment | null>(null);

  // Form State
  const [personName, setPersonName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [hat, setHat] = useState<ThreeHatRoleType>('professional');
  const [permissionLevel, setPermissionLevel] = useState<'owner' | 'contributor' | 'read_only'>('contributor');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [coreResponsibilities, setCoreResponsibilities] = useState<string[]>(['']);
  const [notes, setNotes] = useState('');

  const openAddModal = () => {
    setEditingRole(null);
    setPersonName('');
    setRoleTitle('');
    setHat('professional');
    setPermissionLevel('contributor');
    setPhone('');
    setEmail('');
    setCoreResponsibilities(['Direct logistics & vendor timeline']);
    setNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (role: TeamRoleAssignment) => {
    setEditingRole(role);
    setPersonName(role.personName);
    setRoleTitle(role.roleTitle);
    setHat(role.hat);
    setPermissionLevel(role.permissionLevel || 'contributor');
    setPhone(role.phone || '');
    setEmail(role.email || '');
    setCoreResponsibilities(role.coreResponsibilities.length > 0 ? role.coreResponsibilities : ['']);
    setNotes(role.notes || '');
    setIsModalOpen(true);
  };

  const handleAddResponsibility = () => {
    setCoreResponsibilities([...coreResponsibilities, '']);
  };

  const handleUpdateResponsibility = (index: number, val: string) => {
    const updated = [...coreResponsibilities];
    updated[index] = val;
    setCoreResponsibilities(updated);
  };

  const handleRemoveResponsibility = (index: number) => {
    setCoreResponsibilities(coreResponsibilities.filter((_, i) => i !== index));
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personName.trim() || !roleTitle.trim()) return;

    const filteredResp = coreResponsibilities
      .map(r => r.trim())
      .filter(Boolean);

    const newRole: TeamRoleAssignment = {
      id: editingRole?.id || `role-${Date.now()}`,
      eventId: event.id,
      personName: personName.trim(),
      roleTitle: roleTitle.trim(),
      hat,
      permissionLevel,
      inviteStatus: 'active',
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      coreResponsibilities: filteredResp.length > 0 ? filteredResp : ['General support during celebration'],
      notes: notes.trim() || undefined
    };

    onSaveRole(newRole);
    setIsModalOpen(false);
  };

  const filteredRoles = selectedHat === 'all'
    ? teamRoles
    : teamRoles.filter(r => r.hat === selectedHat);

  const getHatBadge = (h: ThreeHatRoleType) => {
    switch (h) {
      case 'professional':
        return (
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
            <Briefcase className="w-3.5 h-3.5 text-blue-600" />
            <span>Professional Hat (Logistics & Production)</span>
          </div>
        );
      case 'personal':
        return (
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold">
            <Heart className="w-3.5 h-3.5 text-rose-600" />
            <span>Personal Hat (Self-Care & Family Roots)</span>
          </div>
        );
      case 'social':
        return (
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span>Social Hat (Guest Care & Hospitality)</span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Three Hats Philosophy Ribbon */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-700 text-white shadow-md space-y-3">
        <div className="flex items-center space-x-2 text-xs font-bold text-violet-200 uppercase tracking-wider">
          <Compass className="w-4 h-4 text-violet-300" />
          <span>Dr. T Three Hats Integration • Collaborative Role Architecture</span>
        </div>
        <h3 className="text-xl font-bold">
          Empower Hosts, Loved Ones & Helpers Without Overwhelm
        </h3>
        <p className="text-xs text-violet-100 max-w-2xl leading-relaxed">
          Planning an event touches all three spheres of life. We partition responsibilities so vendors handle logistics (<strong>Professional</strong>), honorees protect their rest and peace (<strong>Personal</strong>), and family ambassadors foster warmth and community (<strong>Social</strong>).
        </p>

        <div className="pt-2 flex flex-wrap gap-2 text-xs">
          <div className="px-3 py-1 bg-white/10 backdrop-blur-xs rounded-lg border border-white/20">
            🎩 Professional: Coordinators, AV Leads & Vendors
          </div>
          <div className="px-3 py-1 bg-white/10 backdrop-blur-xs rounded-lg border border-white/20">
            💖 Personal: Honorees, Hydration & Wellbeing Anchors
          </div>
          <div className="px-3 py-1 bg-white/10 backdrop-blur-xs rounded-lg border border-white/20">
            🤝 Social: Welcome Ambassadors, Storytellers & Toastmasters
          </div>
        </div>
      </div>

      {/* Filter and Add Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedHat('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              selectedHat === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            All Roles ({teamRoles.length})
          </button>
          <button
            onClick={() => setSelectedHat('professional')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              selectedHat === 'professional'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            🎩 Professional ({teamRoles.filter(r => r.hat === 'professional').length})
          </button>
          <button
            onClick={() => setSelectedHat('personal')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              selectedHat === 'personal'
                ? 'bg-rose-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            💖 Personal ({teamRoles.filter(r => r.hat === 'personal').length})
          </button>
          <button
            onClick={() => setSelectedHat('social')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              selectedHat === 'social'
                ? 'bg-emerald-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            🤝 Social ({teamRoles.filter(r => r.hat === 'social').length})
          </button>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs active:scale-98 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Assign Team Role</span>
        </button>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRoles.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 text-xs">
            No team roles assigned in this category yet. Click "Assign Team Role" to delegate responsibilities.
          </div>
        ) : (
          filteredRoles.map(role => {
            const assignedTaskCount = tasks.filter(t => t.assignedPersonName === role.personName).length;

            return (
              <div
                key={role.id}
                className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      {getHatBadge(role.hat)}
                      <h4 className="text-base font-bold text-slate-900 mt-2">{role.personName}</h4>
                      <p className="text-xs font-semibold text-rose-600">{role.roleTitle}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 font-medium block">Assigned Tasks</span>
                      <span className="font-bold text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {assignedTaskCount} tasks
                      </span>
                    </div>
                  </div>

                  {/* Core Responsibilities Checklist */}
                  <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Key Responsibilities
                    </span>
                    <ul className="space-y-1 text-xs text-slate-700">
                      {role.coreResponsibilities.map((resp, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {role.notes && (
                    <p className="text-xs text-slate-500 italic">
                      "{role.notes}"
                    </p>
                  )}

                  {/* Contacts */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                    {role.phone && (
                      <span className="inline-flex items-center space-x-1">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{role.phone}</span>
                      </span>
                    )}
                    {role.email && (
                      <span className="inline-flex items-center space-x-1">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{role.email}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-1.5">
                  <button
                    onClick={() => openEditModal(role)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Remove role assignment for "${role.personName}"?`)) {
                        onDeleteRole(role.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Role Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <h4 className="font-bold text-base">
                {editingRole ? 'Edit Team Role' : 'Assign Team Responsibility'}
              </h4>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Person Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins or Uncle Binh"
                  value={personName}
                  onChange={e => setPersonName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Role Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lead Day-Of Coordinator"
                    value={roleTitle}
                    onChange={e => setRoleTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Three Hats Sphere
                  </label>
                  <select
                    value={hat}
                    onChange={e => setHat(e.target.value as ThreeHatRoleType)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  >
                    <option value="professional">🎩 Professional (Logistics/Coordinator)</option>
                    <option value="personal">💖 Personal (Honoree/Self-Care/Roots)</option>
                    <option value="social">🤝 Social (Welcome/Hospitality/Emcee)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+84 90 888 7766"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="sarah@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              {/* Dynamic Responsibilities */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Core Duties Checklist
                  </label>
                  <button
                    type="button"
                    onClick={handleAddResponsibility}
                    className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
                  >
                    + Add Duty
                  </button>
                </div>

                <div className="space-y-2">
                  {coreResponsibilities.map((resp, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Duty description..."
                        value={resp}
                        onChange={e => handleUpdateResponsibility(idx, e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 text-xs"
                      />
                      {coreResponsibilities.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveResponsibility(idx)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Notes or Instructions
                </label>
                <textarea
                  rows={2}
                  placeholder="Special instructions or backup contact..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
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
                  Save Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
