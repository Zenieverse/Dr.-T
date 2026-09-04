// =========================================================================
// PLANT A LIBRARY MODAL: MULTI-TIER REGENERATIVE CONTRIBUTION
// Seed, Sapling, Tree, Grove, House, Forest
// =========================================================================

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Trees, 
  BookOpen, 
  Check, 
  DollarSign, 
  ShieldCheck, 
  Heart, 
  Sparkles,
  Layers
} from 'lucide-react';
import { LibraryProject, ContributionTier } from '../types';
import { MOCK_CONTRIBUTION_TIERS } from '../data/mockLivingForests';

interface PlantLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: LibraryProject[];
  initialProject?: LibraryProject | null;
  onConfirmContribution: (data: {
    tierId: string;
    amountUsd: number;
    projectId: string;
    donorName: string;
    isAnonymous: boolean;
    dedicationNote: string;
  }) => void;
}

export const PlantLibraryModal: React.FC<PlantLibraryModalProps> = ({
  isOpen,
  onClose,
  projects,
  initialProject,
  onConfirmContribution,
}) => {
  const [selectedTier, setSelectedTier] = useState<ContributionTier>(MOCK_CONTRIBUTION_TIERS[2]); // Default Tree ($85)
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(initialProject?.id || 'GLOBAL_COMMONS');
  const [donorName, setDonorName] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [dedicationNote, setDedicationNote] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  useEffect(() => {
    if (initialProject) {
      setSelectedProjectId(initialProject.id);
    } else {
      setSelectedProjectId('GLOBAL_COMMONS');
    }
  }, [initialProject, isOpen]);

  if (!isOpen) return null;

  const currentAmount = customAmount ? parseFloat(customAmount) || 0 : selectedTier.amountUsd;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentAmount <= 0) return;

    onConfirmContribution({
      tierId: customAmount ? 'custom' : selectedTier.id,
      amountUsd: currentAmount,
      projectId: selectedProjectId,
      donorName: isAnonymous ? 'Anonymous Steward' : donorName || 'Kind Patron',
      isAnonymous,
      dedicationNote,
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        id="plant-library-modal"
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 text-white p-6 sm:p-7 flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs text-emerald-300 font-bold uppercase tracking-wider mb-1">
              <span>🌱 Regenerative Knowledge Commons</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-display text-white">
              Plant a Library. Feed a Mind.
            </h3>
            <p className="text-xs text-stone-300 mt-1 max-w-lg">
              Every dollar directly funds community-owned physical libraries, riverboats, books, and native reforestation.
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
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl animate-bounce">
              🌱
            </div>
            <h4 className="text-xl font-black text-stone-900 font-display">
              Thank You, Library Steward!
            </h4>
            <p className="text-xs text-stone-600 max-w-md mx-auto">
              Your contribution of <strong className="text-emerald-800">${currentAmount}</strong> has been allocated to the escrow commons. A digital certificate and ledger hash have been issued.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5">
            {/* Tier Selector Grid */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wider">
                Select Your Contribution Tier
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {MOCK_CONTRIBUTION_TIERS.map((tier) => {
                  const isSelected = !customAmount && selectedTier.id === tier.id;
                  return (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => {
                        setSelectedTier(tier);
                        setCustomAmount('');
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/30'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xl">{tier.symbol}</span>
                        <span className="text-sm font-black text-emerald-900 font-mono">
                          ${tier.amountUsd}
                        </span>
                      </div>
                      <div className="font-bold text-xs text-stone-900 mt-1">{tier.name}</div>
                      <div className="text-[10px] text-stone-500 line-clamp-2 mt-0.5 leading-tight">
                        {tier.symbolicImpactDescription}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom amount input */}
              <div className="flex items-center gap-2 pt-2">
                <span className="text-xs font-medium text-stone-500">Or custom gift:</span>
                <div className="relative rounded-xl border border-stone-300 focus-within:ring-2 focus-within:ring-emerald-500 bg-white">
                  <span className="absolute left-3 top-2 text-xs font-bold text-stone-400">$</span>
                  <input
                    type="number"
                    min="1"
                    placeholder="Enter amount (USD)"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="pl-7 pr-3 py-1.5 text-xs font-mono font-bold rounded-xl focus:outline-none w-36"
                  />
                </div>
              </div>
            </div>

            {/* Target Project Selection */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-800">
                Direct to Specific Community or Global Commons
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="GLOBAL_COMMONS">🌐 Global Commons Pool (Prioritizes Highest Access Need)</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.countryName} - {p.communityName})
                  </option>
                ))}
              </select>
            </div>

            {/* Donor info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-700">Your Name (or Organization)</label>
                <input
                  type="text"
                  placeholder="e.g. Maria Santos"
                  value={donorName}
                  disabled={isAnonymous}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full p-2 rounded-xl border border-stone-200 text-xs disabled:bg-stone-100"
                />
              </div>

              <div className="flex items-center space-x-2 pt-5">
                <input
                  type="checkbox"
                  id="chk-anonymous"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="chk-anonymous" className="text-xs text-stone-700 font-medium">
                  Make dedication anonymous in public ledger
                </label>
              </div>
            </div>

            {/* Dedication Note */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-700">Dedication Note (Optional)</label>
              <textarea
                rows={2}
                placeholder="In honor of a beloved teacher, child, elder, or reading memory..."
                value={dedicationNote}
                onChange={(e) => setDedicationNote(e.target.value)}
                className="w-full p-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Transparent Breakdown Preview */}
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-[11px] text-stone-600 space-y-1.5">
              <div className="flex items-center justify-between font-bold text-stone-800">
                <span>Transparent Allocation (${currentAmount} Total):</span>
                <span className="text-emerald-800 font-mono">100% Non-Extractive</span>
              </div>
              <p className="text-[10px] text-stone-500 leading-tight">
                60% Infrastructure & Construction • 15% Bilingual Books • 10% Local Stipends • 5% Native Seedlings • 5% Verification • 5% Commons Maintenance
              </p>
            </div>

            {/* Buttons */}
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
                id="btn-confirm-plant-library"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-700/20 flex items-center space-x-1.5 transition-transform active:scale-95"
              >
                <span>🌱</span>
                <span>Confirm Gift (${currentAmount})</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
