// =========================================================================
// GIVE A TREE MODAL: COMMEMORATIVE LIVING BIODIVERSITY STEWARDSHIP
// Dedicated native trees supporting community shade & watershed health
// Strictly NOT sold as carbon offsets or corporate credits.
// =========================================================================

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Trees, 
  Leaf, 
  ShieldCheck, 
  Heart, 
  Sparkles, 
  Award, 
  FileCheck2,
  CheckCircle2
} from 'lucide-react';
import { LibraryProject, TreeDedication } from '../types';

interface GiveTreeModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: LibraryProject[];
  initialProject?: LibraryProject | null;
  onConfirmDedication: (dedication: Partial<TreeDedication>) => void;
}

export const GiveTreeModal: React.FC<GiveTreeModalProps> = ({
  isOpen,
  onClose,
  projects,
  initialProject,
  onConfirmDedication,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(initialProject?.id || projects[0]?.id || '');
  const [honoreeName, setHonoreeName] = useState<string>('');
  const [donorName, setDonorName] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [dedicationMessage, setDedicationMessage] = useState<string>('');
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);
  const [treeAmountUnitUsd] = useState<number>(25); // $25 per dedicated native nursery sapling + 3-year survival care
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  useEffect(() => {
    if (initialProject) {
      setSelectedProjectId(initialProject.id);
    } else if (projects.length > 0) {
      setSelectedProjectId(projects[0].id);
    }
  }, [initialProject, isOpen, projects]);

  if (!isOpen) return null;

  const targetProject = projects.find(p => p.id === selectedProjectId) || projects[0];
  const primarySpecies = targetProject?.ecologicalComponent?.primarySpecies[0] || 'Indigenous Native Shade Tree';
  const totalAmount = selectedQuantity * treeAmountUnitUsd;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onConfirmDedication({
      id: `tree-ded-${Date.now()}`,
      treeProjectId: targetProject.ecologicalComponent?.id || 'eco-default',
      libraryProjectId: targetProject.id,
      species: primarySpecies,
      donorName: isAnonymous ? 'Anonymous Guardian' : donorName || 'Kind Patron',
      isAnonymous,
      dedicationMessage: dedicationMessage || `Dedicated to ${honoreeName || 'future readers and forest stewards'}.`,
      plantedDate: new Date().toISOString().split('T')[0],
      survivalStatus: 'THRIVING',
      legalDisclaimer: 'Symbolic living dedication. Not a carbon credit or offset.',
      coordinatesApprox: `${targetProject.geographicEntity.coordinates.lat.toFixed(2)}°, ${targetProject.geographicEntity.coordinates.lng.toFixed(2)}°`,
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
        id="give-tree-modal"
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-900 via-emerald-950 to-stone-900 text-white p-6 sm:p-7 flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs text-teal-300 font-bold uppercase tracking-wider mb-1">
              <span>🌳 Living Commemoration</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-display text-white">
              Give a Dedicated Native Tree
            </h3>
            <p className="text-xs text-stone-300 mt-1 max-w-md">
              Plant indigenous trees beside community libraries to provide reading shade, prevent erosion, and nourish biodiversity.
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
            <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto text-3xl animate-pulse">
              🌳
            </div>
            <h4 className="text-xl font-black text-stone-900 font-display">
              Living Dedication Inscribed!
            </h4>
            <p className="text-xs text-stone-600 max-w-md mx-auto">
              Your dedication of <strong className="text-emerald-800">{selectedQuantity} × {primarySpecies}</strong> at {targetProject.name} is entered into the community tree register.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-5">
            {/* Project Selection */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-800">
                Choose Reforestation & Library Location
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-800 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.countryName}) — {p.ecologicalComponent?.primarySpecies[0] || 'Native Flora'}
                  </option>
                ))}
              </select>
            </div>

            {/* Species Card */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center space-x-3 text-xs">
              <div className="p-2 rounded-xl bg-emerald-200 text-emerald-800 text-lg">
                🌿
              </div>
              <div className="flex-1">
                <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">
                  Native Ecological Species:
                </span>
                <strong className="text-emerald-950 font-bold text-xs block">
                  {primarySpecies}
                </strong>
                <span className="text-[11px] text-emerald-800">
                  Nurtured in community nursery with verified 3-year watering care.
                </span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-800">
                Number of Trees to Sponsor ($25 each)
              </label>
              <div className="flex items-center gap-2">
                {[1, 3, 5, 10].map(qty => (
                  <button
                    key={qty}
                    type="button"
                    onClick={() => setSelectedQuantity(qty)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      selectedQuantity === qty
                        ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                    }`}
                  >
                    {qty} {qty === 1 ? 'Tree' : 'Trees'} (${qty * treeAmountUnitUsd})
                  </button>
                ))}
              </div>
            </div>

            {/* Honoree & Dedication */}
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-700">Dedicated in Honor of</label>
                <input
                  type="text"
                  placeholder="e.g. My Grandmother, Teacher Elena, Future Generation..."
                  value={honoreeName}
                  onChange={(e) => setHonoreeName(e.target.value)}
                  className="w-full p-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-700">Dedication Message (Engraved in Virtual Grove)</label>
                <textarea
                  rows={2}
                  placeholder="A blessing, memory, or wish for the children who will read in this tree's shade..."
                  value={dedicationMessage}
                  onChange={(e) => setDedicationMessage(e.target.value)}
                  className="w-full p-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Your Name (Donor)"
                  value={donorName}
                  disabled={isAnonymous}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="p-2 rounded-xl border border-stone-200 text-xs disabled:bg-stone-100"
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="chk-tree-anon"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="chk-tree-anon" className="text-xs text-stone-700 font-medium">
                    Keep dedication anonymous
                  </label>
                </div>
              </div>
            </div>

            {/* Non-Carbon Credit Explicit Disclaimer */}
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-[11px] text-stone-600 space-y-1">
              <div className="flex items-center space-x-1.5 font-bold text-stone-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Strict Non-Extractive Ecological Ethics</span>
              </div>
              <p className="text-[10px] text-stone-500 leading-tight">
                Trees planted are native species stewarded by the local village council. They are strictly NOT traded as carbon credits or carbon offsets.
              </p>
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
                id="btn-confirm-give-tree"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-700/20 flex items-center space-x-1.5 transition-transform active:scale-95"
              >
                <span>🌳</span>
                <span>Confirm Dedicated Tree (${totalAmount})</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
