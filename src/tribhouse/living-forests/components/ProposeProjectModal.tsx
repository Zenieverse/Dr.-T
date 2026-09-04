// =========================================================================
// PROPOSE A COMMUNITY PROJECT MODAL
// Community-first proposals with acknowledged community veto rights
// =========================================================================

import React, { useState } from 'react';
import { 
  X, 
  HeartHandshake, 
  ShieldCheck, 
  MapPin, 
  BookOpen, 
  Trees,
  CheckCircle2
} from 'lucide-react';
import { ProjectType } from '../types';

interface ProposeProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProposalSubmitted: (proposal: any) => void;
}

export const ProposeProjectModal: React.FC<ProposeProjectModalProps> = ({
  isOpen,
  onClose,
  onProposalSubmitted,
}) => {
  const [communityName, setCommunityName] = useState('');
  const [countryName, setCountryName] = useState('');
  const [regionName, setRegionName] = useState('');
  const [leadContact, setLeadContact] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [projectType, setProjectType] = useState<ProjectType>('COMMUNITY_LIBRARY');
  const [localLanguages, setLocalLanguages] = useState('');
  const [communityStrengths, setCommunityStrengths] = useState('');
  const [communityAspirations, setCommunityAspirations] = useState('');
  const [nativeTreeSpecies, setNativeTreeSpecies] = useState('');
  const [vetoRightsConfirmed, setVetoRightsConfirmed] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vetoRightsConfirmed) return;

    onProposalSubmitted({
      id: `prop-${Date.now()}`,
      communityName,
      countryName,
      regionName,
      leadContact,
      contactEmail,
      projectType,
      localLanguages: localLanguages.split(',').map(s => s.trim()),
      communityStrengths,
      communityAspirations,
      nativeTreeSpecies: nativeTreeSpecies.split(',').map(s => s.trim()),
      vetoRightsAcknowledged: true,
      status: 'VERIFIED_NEED',
      createdAt: new Date().toISOString(),
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        id="propose-project-modal"
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white p-6 sm:p-7 flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs text-amber-300 font-bold uppercase tracking-wider mb-1">
              <span>🤝 Community-Originated Proposal</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-display text-white">
              Propose a Living Library or Mobile Fleet
            </h3>
            <p className="text-xs text-stone-300 mt-1 max-w-lg">
              We never impose outside models. All projects must originate from local teachers, village assemblies, or cooperatives with sovereign self-determination.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-stone-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-3xl">
              📜
            </div>
            <h4 className="text-xl font-black text-stone-900 font-display">
              Proposal Received with Reverence
            </h4>
            <p className="text-xs text-stone-600 max-w-md mx-auto">
              Your community proposal for <strong className="text-stone-900">{communityName}</strong> has been logged. Our independent regional council will connect with {leadContact} for consensus review.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-700">Community / Village Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. San Pedro Ixcatlán"
                  value={communityName}
                  onChange={(e) => setCommunityName(e.target.value)}
                  className="w-full p-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-700">Country & Region *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mexico, Oaxaca"
                  value={countryName}
                  onChange={(e) => setCountryName(e.target.value)}
                  className="w-full p-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-700">Lead Local Contact / Council *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Elder Mateo & Youth Assembly"
                  value={leadContact}
                  onChange={(e) => setLeadContact(e.target.value)}
                  className="w-full p-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-700">Contact Channel (Email or Radio) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. mateo@community.org"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full p-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-700">Proposed Structure Type</label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value as any)}
                  className="w-full p-2 rounded-xl border border-stone-200 text-xs bg-stone-50 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="COMMUNITY_LIBRARY">Physical Community Library</option>
                  <option value="LIBRARY_GARDEN">Stilted Library Garden</option>
                  <option value="MOBILE_LIBRARY">Mobile Caravan / Riverboat Fleet</option>
                  <option value="CHILDREN_READING_HOUSE">Children Reading Lodge</option>
                  <option value="TREEHOUSE_LIBRARY">Highland Treehouse Shelter</option>
                  <option value="DIGITAL_NEST">Solar-Insulated Digital Reading Nest</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-700">Indigenous & Local Languages</label>
                <input
                  type="text"
                  placeholder="e.g. Mazateco, Spanish"
                  value={localLanguages}
                  onChange={(e) => setLocalLanguages(e.target.value)}
                  className="w-full p-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-700">Community Strengths & Assets</label>
              <textarea
                rows={2}
                placeholder="What crafts, building traditions, teachers, and agricultural strengths does the community already hold?"
                value={communityStrengths}
                onChange={(e) => setCommunityStrengths(e.target.value)}
                className="w-full p-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-700">Aspirations for the Library & Children</label>
              <textarea
                rows={2}
                placeholder="What books, STEM skills, oral lore, or ecological knowledge do elders and parents wish to share?"
                value={communityAspirations}
                onChange={(e) => setCommunityAspirations(e.target.value)}
                className="w-full p-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            {/* Veto rights checkbox */}
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
              <div className="flex items-start space-x-2.5">
                <input
                  type="checkbox"
                  id="chk-veto-rights"
                  required
                  checked={vetoRightsConfirmed}
                  onChange={(e) => setVetoRightsConfirmed(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-amber-600 focus:ring-amber-500 shrink-0"
                />
                <label htmlFor="chk-veto-rights" className="text-xs text-amber-950 font-medium leading-relaxed">
                  <strong className="block font-bold">Community Sovereignty & Veto Accord:</strong>
                  I confirm that the local community council or school retains total veto rights over architectural designs, book intake, and stewardship rules. No outside entity can force or privatize this project.
                </label>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!vetoRightsConfirmed}
                id="btn-submit-proposal"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-700 to-stone-800 hover:from-amber-800 hover:to-stone-900 text-white text-xs font-bold shadow-md flex items-center space-x-1.5 disabled:opacity-50 transition-transform active:scale-95"
              >
                <span>📜</span>
                <span>Submit Sovereign Proposal</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
