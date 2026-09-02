import React, { useState } from 'react';
import { 
  Hourglass, Lock, Unlock, Feather, Sparkles, ShieldCheck, 
  CheckCircle2, Trees, Clock, Heart, BookOpen, Send
} from 'lucide-react';
import { MOCK_FUTURE_LETTERS } from '../data/mockFutureLetters';
import { FutureLetter } from '../types';
import { tribStorage } from '../services/tribStorageService';

interface CenturyBranchViewProps {
  onAskTrib?: (query: string) => void;
}

export const CenturyBranchView: React.FC<CenturyBranchViewProps> = ({ onAskTrib }) => {
  const [letters, setLetters] = useState<FutureLetter[]>(tribStorage.getFutureLetters());
  const [selectedLetter, setSelectedLetter] = useState<FutureLetter>(letters[0]);
  const [showWriteModal, setShowWriteModal] = useState<boolean>(false);

  // New letter form
  const [newTitle, setNewTitle] = useState<string>('');
  const [newPseudonym, setNewPseudonym] = useState<string>('');
  const [newRole, setNewRole] = useState<'Child' | 'Elder' | 'Scientist' | 'Farmer' | 'Artist' | 'Teacher' | 'Citizen'>('Citizen');
  const [newLocation, setNewLocation] = useState<string>('');
  const [newTargetYear, setNewTargetYear] = useState<2036 | 2051 | 2076 | 2126>(2126);
  const [newCategory, setNewCategory] = useState<any>('letter_to_children');
  const [newFullText, setNewFullText] = useState<string>('');
  const [sealedSuccess, setSealedSuccess] = useState<boolean>(false);

  const handleSealLetter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newFullText.trim()) return;

    const sealed = tribStorage.saveFutureLetter({
      title: newTitle,
      authorPseudonym: newPseudonym || 'Anonymous Knowledge Steward',
      role: newRole,
      location: newLocation || 'Living Treehouse Commons',
      targetYear: newTargetYear,
      category: newCategory,
      excerpt: newFullText.slice(0, 160) + '...',
      fullLetter: newFullText,
      sealedUntilDate: `${newTargetYear}-08-30`,
      associatedGroveName: 'The 100-Year Century Grove (Bạch Mã Sanctuary)'
    });

    setLetters(tribStorage.getFutureLetters());
    setSelectedLetter(sealed);
    setSealedSuccess(true);
    setTimeout(() => {
      setSealedSuccess(false);
      setShowWriteModal(false);
      setNewTitle('');
      setNewFullText('');
    }, 2500);
  };

  return (
    <div id="century-branch-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero */}
      <div className="relative rounded-3xl bg-gradient-to-br from-purple-950 via-stone-900 to-stone-950 text-white p-8 md:p-12 border border-purple-900/50 shadow-xl overflow-hidden">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-semibold">
            <Hourglass className="w-3.5 h-3.5" />
            <span>2026–2126 • THE CENTURY HORIZON</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-100">
            The 100-Year Century Branch
          </h1>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-sans">
            Cathedral thinking for a fragile planet. Write letters, seal scientific inquiries, and leave memory seeds for human beings living 100 years into the future. Each letter is backed by an ancient tree in the Bạch Mã Century Grove.
          </p>

          <div className="pt-2">
            <button
              id="seal-letter-modal-btn"
              onClick={() => setShowWriteModal(true)}
              className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md"
            >
              <Feather className="w-4 h-4" />
              <span>Seal a Letter to 2126 (+25 T-Coins & 1 Tree)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Letter Selector & Letter Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Letters list */}
        <div className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center justify-between">
            <span>Sealed Letters to Deep Time</span>
            <span className="text-xs text-stone-400">{letters.length} Letters</span>
          </h2>

          <div className="space-y-3">
            {letters.map(letter => (
              <div
                key={letter.id}
                onClick={() => setSelectedLetter(letter)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedLetter.id === letter.id
                    ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-400 dark:border-purple-700 shadow-sm'
                    : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-bold text-purple-700 dark:text-purple-300">
                    Target: {letter.targetYear}
                  </span>
                  <span className="text-stone-400">Written {letter.writtenYear}</span>
                </div>

                <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm line-clamp-2">
                  {letter.title}
                </h3>

                <div className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  by {letter.authorPseudonym} ({letter.role})
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 line-clamp-2 italic">
                  "{letter.excerpt}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Letter Reader (2 cols on lg) */}
        <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-8 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  Target Horizon: {selectedLetter.targetYear} (100 Years)
                </span>
                <span className="text-xs text-stone-400">{selectedLetter.location}</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <Trees className="w-3.5 h-3.5" />
                <span>{selectedLetter.associatedGroveName}</span>
              </div>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 leading-tight">
              {selectedLetter.title}
            </h2>

            <div className="text-xs font-medium text-stone-500">
              Written by <span className="font-semibold text-stone-800 dark:text-stone-200">{selectedLetter.authorPseudonym}</span> • Role: {selectedLetter.role}
            </div>

            {/* Letter Full Body */}
            <div className="py-4 font-serif text-stone-800 dark:text-stone-200 leading-relaxed text-sm sm:text-base whitespace-pre-line space-y-4 border-l-2 border-purple-300 dark:border-purple-800 pl-4 bg-purple-50/30 dark:bg-purple-950/20 p-4 rounded-r-2xl">
              {selectedLetter.fullLetter}
            </div>
          </div>

          {/* Cryptographic Checksum & Integrity Badge */}
          <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-500">
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-stone-400">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>SHA-256: {selectedLetter.integrityChecksumSha256.substring(0, 24)}...</span>
            </div>
            <div className="text-[11px] text-purple-700 dark:text-purple-300 font-semibold">
              Sealed under Decentralized 100-Year Knowledge Trust
            </div>
          </div>
        </div>
      </div>

      {/* Write Letter Modal */}
      {showWriteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <Hourglass className="w-5 h-5 text-purple-600" />
                <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-lg">
                  Seal a Message to the Year 2126
                </h3>
              </div>
              <button onClick={() => setShowWriteModal(false)} className="text-stone-400 hover:text-stone-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleSealLetter} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Letter Title:
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. To the River Swimmers of 2126..."
                  className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Your Name / Pseudonym:</label>
                  <input
                    type="text"
                    value={newPseudonym}
                    onChange={e => setNewPseudonym(e.target.value)}
                    placeholder="e.g. Linh, Age 12"
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Role / Perspective:</label>
                  <select
                    value={newRole}
                    onChange={e => setNewRole(e.target.value as any)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 text-xs"
                  >
                    <option value="Child">Child</option>
                    <option value="Elder">Elder</option>
                    <option value="Farmer">Farmer</option>
                    <option value="Scientist">Scientist</option>
                    <option value="Artist">Poet / Artist</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Citizen">Citizen</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Target Horizon:</label>
                  <select
                    value={newTargetYear}
                    onChange={e => setNewTargetYear(parseInt(e.target.value) as any)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-bold text-purple-600"
                  >
                    <option value={2126}>2126 (100 Years)</option>
                    <option value={2076}>2076 (50 Years)</option>
                    <option value={2051}>2051 (25 Years)</option>
                    <option value={2036}>2036 (10 Years)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Your Letter Across Time:</label>
                <textarea
                  rows={6}
                  required
                  value={newFullText}
                  onChange={e => setNewFullText(e.target.value)}
                  placeholder="What should humans 100 years from now know about our world, our hopes, our doubts, and the trees we planted for them?"
                  className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-stone-100 leading-relaxed font-serif"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWriteModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-500 hover:text-stone-700 text-xs font-medium"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm"
                >
                  {sealedSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Sealed into Bạch Mã Grove!</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Seal Letter Cryptographically</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
