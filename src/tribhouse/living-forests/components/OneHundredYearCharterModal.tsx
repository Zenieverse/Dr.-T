// =========================================================================
// 100-YEAR VISION & GOVERNANCE CHARTER MODAL
// "By All. For All. Across Generations. Every Community Deserves a Place to Learn."
// =========================================================================

import React from 'react';
import { X, ScrollText, ShieldCheck, Hourglass, Trees, BookOpen } from 'lucide-react';

interface OneHundredYearCharterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OneHundredYearCharterModal: React.FC<OneHundredYearCharterModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        id="one-hundred-year-charter-modal"
        className="relative w-full max-w-3xl bg-stone-50 rounded-3xl shadow-2xl border border-stone-300 overflow-hidden my-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-900 via-emerald-950 to-stone-900 text-white p-6 sm:p-8 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs text-amber-300 font-bold uppercase tracking-wider">
              <ScrollText className="w-4 h-4" />
              <span>Foundational Covenant</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-display text-white">
              The 100-Year Charter of the Living Forests
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 italic">
              "A tree is an open book with leaves. A library is an evergreen grove of human thought."
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-stone-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Text Body */}
        <div className="p-6 sm:p-8 space-y-6 text-stone-800 text-xs sm:text-sm leading-relaxed max-h-[75vh] overflow-y-auto font-serif">
          {/* Article 1 */}
          <div className="space-y-2">
            <h4 className="font-sans font-black text-sm uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
              <span>Article I: Sovereign Community Ownership</span>
            </h4>
            <p className="text-stone-700">
              Every Trib-House library, mobile caravan, and reading lodge belongs solely to the community in which it stands. No corporate entity, foreign donor, government, or central platform holds equity, title, or property rights over community books, land, or sacred archives. The local assembly holds immutable veto power over all operations.
            </p>
          </div>

          {/* Article 2 */}
          <div className="space-y-2">
            <h4 className="font-sans font-black text-sm uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
              <span>Article II: The Inseparability of Literacy and Ecology</span>
            </h4>
            <p className="text-stone-700">
              We reject the separation of human knowledge from the living soil. Whenever a library is planted, an indigenous grove must take root alongside it. The trees shade the readers; the readers water the saplings. Trees grown under this covenant are strictly protected from commercial logging and are never monetized as carbon offsets.
            </p>
          </div>

          {/* Article 3 */}
          <div className="space-y-2">
            <h4 className="font-sans font-black text-sm uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
              <span>Article III: Mother Tongues & Endangered Dialects</span>
            </h4>
            <p className="text-stone-700">
              Libraries must never serve as engines of linguistic homogenization. Every Trib-House commits to collecting, transcribing, printing, and archiving in the indigenous languages, oral dialects, and syllabics of its region. Knowledge is preserved in the voices of elders and spoken into the ears of youth.
            </p>
          </div>

          {/* Article 4 */}
          <div className="space-y-2">
            <h4 className="font-sans font-black text-sm uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
              <span>Article IV: The 100-Year Time Horizon</span>
            </h4>
            <p className="text-stone-700">
              We design buildings, select timbers, cultivate seeds, and archive texts with a minimum one-century horizon. Each founding library buries a Future Capsule with a founding book and tree species to be reopened by great-grandchildren. We build not for transient cycles, but for quiet endurance.
            </p>
          </div>

          {/* Article 5 */}
          <div className="space-y-2">
            <h4 className="font-sans font-black text-sm uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
              <span>Article V: Radical Ledger Transparency</span>
            </h4>
            <p className="text-stone-700">
              Every cent gifted to the commons must be accounted for with verifiable receipts, community consensus minutes, and independent audit hashes. When mistakes, floods, or crop failures happen, they are recorded in the public negative data log without concealment. Truth is the foundation of solidarity.
            </p>
          </div>

          {/* Signatures / Seals */}
          <div className="pt-6 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4 font-sans text-xs text-stone-500">
            <div className="flex items-center space-x-2 text-emerald-800 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Ratified in Consensus by Elders, Educators & Forest Stewards</span>
            </div>
            <div className="font-mono text-[11px]">
              SHA-256: 9f8a3c20...covenant-ver-2026
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-sm transition-colors"
          >
            I Acknowledge the Charter
          </button>
        </div>
      </div>
    </div>
  );
};
