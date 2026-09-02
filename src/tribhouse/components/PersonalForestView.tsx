import React, { useState } from 'react';
import { 
  UserCheck, Leaf, BookOpen, Trees, Award, Download, 
  Trash2, Plus, CheckCircle2, Clock, Sparkles, Filter, ShieldCheck
} from 'lucide-react';
import { tribStorage } from '../services/tribStorageService';
import { ForestLeaf, LeafType } from '../types';
import { INITIAL_TRIB_PASSPORT } from '../data/mockMentors';

interface PersonalForestViewProps {
  onOpenReadingNestWithBook?: (bookTitle: string) => void;
  onAskTrib?: (query: string) => void;
}

export const PersonalForestView: React.FC<PersonalForestViewProps> = ({
  onOpenReadingNestWithBook,
  onAskTrib
}) => {
  const [forest, setForest] = useState(tribStorage.getPersonalForest());
  const [selectedLeafType, setSelectedLeafType] = useState<LeafType | 'ALL'>('ALL');
  const [newLeafContent, setNewLeafContent] = useState<string>('');
  const [newLeafTitle, setNewLeafTitle] = useState<string>('');
  const [newLeafType, setNewLeafType] = useState<LeafType>('IDEA_SEED');
  const [showAddLeaf, setShowAddLeaf] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);

  const filteredLeaves = forest.leaves.filter(leaf => {
    if (selectedLeafType === 'ALL') return true;
    return leaf.type === selectedLeafType;
  });

  const handleCreateLeaf = () => {
    if (!newLeafContent.trim() || !newLeafTitle.trim()) return;
    const added = tribStorage.addLeaf({
      title: newLeafTitle,
      type: newLeafType,
      branchId: 'earth',
      content: newLeafContent,
      isPublic: true
    });
    setForest(tribStorage.getPersonalForest());
    setNewLeafTitle('');
    setNewLeafContent('');
    setShowAddLeaf(false);
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(forest, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `tribhouse_personal_forest_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 2500);
  };

  return (
    <div id="personal-forest-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Sovereign Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
            <UserCheck className="w-4 h-4" />
            <span>Sovereign Knowledge Shelf</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-100 mt-1">
            Your Personal Forest & Memory Garden
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Your notes, highlights, reflections, and earned ecological dividends. Private and sovereign to your device.
          </p>
        </div>

        {/* Sovereign Export Button */}
        <div className="flex items-center gap-2">
          <button
            id="export-forest-json-btn"
            onClick={handleExportData}
            className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-850 hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            {exportSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Download className="w-4 h-4" />}
            <span>{exportSuccess ? 'Exported JSON!' : 'Export Sovereign Backup'}</span>
          </button>

          <button
            id="add-leaf-open-btn"
            onClick={() => setShowAddLeaf(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Plant New Leaf</span>
          </button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
          <div className="text-xs text-stone-400 font-medium">Flourishing Score</div>
          <div className="text-2xl font-serif font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {forest.flourishingScore}/100
          </div>
          <div className="text-[10px] text-stone-500 mt-0.5">Canopy Steward Rank</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
          <div className="text-xs text-stone-400 font-medium">Knowledge Leaves</div>
          <div className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100 mt-1">
            {forest.leaves.length}
          </div>
          <div className="text-[10px] text-stone-500 mt-0.5">Notes & Highlights</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
          <div className="text-xs text-stone-400 font-medium">Books Explored</div>
          <div className="text-2xl font-serif font-bold text-amber-600 dark:text-amber-400 mt-1">
            {forest.booksRead}
          </div>
          <div className="text-[10px] text-stone-500 mt-0.5">Slow reading sessions</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
          <div className="text-xs text-stone-400 font-medium">Trees Supported</div>
          <div className="text-2xl font-serif font-bold text-teal-600 dark:text-teal-400 mt-1">
            {forest.treesSupported}
          </div>
          <div className="text-[10px] text-stone-500 mt-0.5">Verified in TreeLedger</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 col-span-2 sm:col-span-1">
          <div className="text-xs text-stone-400 font-medium">T-Coins Dividends</div>
          <div className="text-2xl font-serif font-bold text-emerald-500 mt-1">
            {forest.tCoinsBalance} 🪙
          </div>
          <div className="text-[10px] text-stone-500 mt-0.5">Earned by reading & care</div>
        </div>
      </div>

      {/* Trib Passport Badges Section */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-stone-900/60 to-stone-900 border border-emerald-900/40 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-stone-100 font-serif font-bold text-base">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Trib Passport & Journey Milestones</span>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-medium border border-emerald-500/30">
            {INITIAL_TRIB_PASSPORT.rankTitle}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {INITIAL_TRIB_PASSPORT.badges.map(badge => (
            <div
              key={badge.id}
              className="p-3 rounded-xl bg-stone-900/80 border border-stone-700/80 flex items-start gap-3"
            >
              <span className="text-2xl">{badge.icon}</span>
              <div>
                <div className="font-semibold text-stone-100 text-xs">{badge.name}</div>
                <div className="text-[11px] text-stone-400 mt-0.5 leading-snug">{badge.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Leaf Modal / Drawer */}
      {showAddLeaf && (
        <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-emerald-400 dark:border-emerald-700 shadow-lg space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-base flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span>Plant a Knowledge Leaf in Your Sovereign Forest</span>
            </h3>
            <button
              onClick={() => setShowAddLeaf(false)}
              className="text-xs text-stone-400 hover:text-stone-600"
            >
              Cancel
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex gap-2">
              {(['IDEA_SEED', 'NOTE', 'HIGHLIGHT', 'QUESTION'] as LeafType[]).map(t => (
                <button
                  key={t}
                  onClick={() => setNewLeafType(t)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    newLeafType === t
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                  }`}
                >
                  {t.replace('_', ' ')}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={newLeafTitle}
              onChange={e => setNewLeafTitle(e.target.value)}
              placeholder="Leaf title or core concept..."
              className="w-full px-4 py-2 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-stone-100"
            />

            <textarea
              value={newLeafContent}
              onChange={e => setNewLeafContent(e.target.value)}
              rows={3}
              placeholder="Write your note, insight, or question..."
              className="w-full px-4 py-2 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-stone-100"
            />

            <div className="flex justify-end">
              <button
                id="submit-new-leaf-btn"
                onClick={handleCreateLeaf}
                disabled={!newLeafTitle.trim() || !newLeafContent.trim()}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Leaf className="w-3.5 h-3.5" />
                <span>Plant Leaf (+5 T-Coins)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leaves Garden */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Leaf className="w-5 h-5 text-emerald-600" />
            <span>Your Knowledge Leaves ({forest.leaves.length})</span>
          </h2>

          <div className="flex items-center gap-1 text-xs">
            {(['ALL', 'NOTE', 'HIGHLIGHT', 'IDEA_SEED', 'QUESTION'] as const).map(t => (
              <button
                key={t}
                onClick={() => setSelectedLeafType(t)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  selectedLeafType === t
                    ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-950'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
                }`}
              >
                {t.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLeaves.map(leaf => (
            <div
              key={leaf.id}
              className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="px-2 py-0.5 rounded font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    {leaf.type.replace('_', ' ')}
                  </span>
                  <span className="text-stone-400">{new Date(leaf.createdAt).toLocaleDateString()}</span>
                </div>

                <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm">
                  {leaf.title}
                </h3>

                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed italic">
                  "{leaf.content}"
                </p>

                {leaf.bookTitle && (
                  <div className="text-[11px] text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-medium">
                    <BookOpen className="w-3 h-3" />
                    <span>{leaf.bookTitle}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
