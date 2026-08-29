import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  Pin, 
  Trash2, 
  Edit3, 
  MessageSquare, 
  Check, 
  X, 
  Download, 
  RotateCw, 
  Send,
  Sparkles
} from 'lucide-react';
import { CanvasCard } from '../../../webmcp/types';

interface SharedWorkspaceViewProps {
  cards: CanvasCard[];
  setCards: React.Dispatch<React.SetStateAction<CanvasCard[]>>;
  onExportCard: (id: string, format: 'markdown' | 'json' | 'text') => void;
  onSaveWorkspace: () => void;
}

export const SharedWorkspaceView: React.FC<SharedWorkspaceViewProps> = ({
  cards,
  setCards,
  onExportCard,
  onSaveWorkspace,
}) => {
  const [activeType, setActiveType] = useState<string>('ALL');
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'plan' | 'document' | 'table' | 'summary'>('plan');
  const [newContent, setNewContent] = useState('');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const handleTogglePin = (id: string) => {
    setCards(prev => prev.map(c => c.id === id ? { ...c, pinned: !c.pinned } : c));
  };

  const handleDelete = (id: string) => {
    setCards(prev => prev.filter(c => c.id !== id));
  };

  const handleStartEdit = (card: CanvasCard) => {
    setEditingCardId(card.id);
    setEditTitle(card.title);
    setEditContent(card.content);
  };

  const handleSaveEdit = (id: string) => {
    setCards(prev => prev.map(c => c.id === id ? { ...c, title: editTitle, content: editContent } : c));
    setEditingCardId(null);
  };

  const handleCreateNewCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newCard: CanvasCard = {
      id: `art_${Date.now()}_manual`,
      title: newTitle,
      type: newType,
      author: 'Human',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'approved',
      content: newContent,
      tags: ['Manual', 'Human-Authored'],
      pinned: true,
      comments: [],
    };

    setCards(prev => [newCard, ...prev]);
    setNewTitle('');
    setNewContent('');
    setIsAddingCard(false);
  };

  const handleAddComment = (cardId: string) => {
    const text = (commentInputs[cardId] || '').trim();
    if (!text) return;

    setCards(prev => prev.map(c => {
      if (c.id === cardId) {
        const comments = c.comments || [];
        return {
          ...c,
          comments: [
            ...comments,
            {
              id: `comm_${Date.now()}`,
              author: 'Human Collaborator',
              text,
              time: 'Just now',
            },
          ],
        };
      }
      return c;
    }));

    setCommentInputs(prev => ({ ...prev, [cardId]: '' }));
  };

  const filteredCards = cards.filter(c => {
    if (activeType !== 'ALL' && c.type !== activeType) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-black text-white uppercase tracking-wide">
              Shared Collaborative Canvas
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time workspace for human + agent co-creation, editing, pinning, and card comments.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Card Type Filters */}
          <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
            {['ALL', 'plan', 'document', 'table', 'summary'].map(tp => (
              <button
                key={tp}
                onClick={() => setActiveType(tp)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition ${
                  activeType === tp ? 'bg-cyan-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tp}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsAddingCard(!isAddingCard)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-cyan-500/20 hover:opacity-95 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Card</span>
          </button>
        </div>
      </div>

      {/* Manual Card Creation Drawer */}
      {isAddingCard && (
        <form
          onSubmit={handleCreateNewCard}
          className="p-6 rounded-2xl bg-slate-900 border border-cyan-500/40 space-y-4 shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Create New Shared Artifact</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsAddingCard(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Artifact Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Day 2 Alternate Hiking Options"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Format Type</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-hidden"
              >
                <option value="plan">Plan</option>
                <option value="document">Document</option>
                <option value="table">Table</option>
                <option value="summary">Summary</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1">Content (Markdown supported)</label>
            <textarea
              rows={4}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Enter markdown or notes..."
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 font-mono focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsAddingCard(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/20"
            >
              Publish to Canvas
            </button>
          </div>
        </form>
      )}

      {/* Cards Grid */}
      {filteredCards.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-500 text-sm">
          No cards on canvas yet. Run the agent workflow from the Home tab or click &quot;Add Card&quot;.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCards.map((card) => {
            const isEditing = editingCardId === card.id;

            return (
              <div
                key={card.id}
                className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl relative group hover:border-slate-700 transition"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                        {card.type}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        by <strong className="text-slate-200">{card.author}</strong> • {card.createdAt}
                      </span>
                    </div>

                    {isEditing ? (
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full mt-2 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white font-bold"
                      />
                    ) : (
                      <h3 className="text-base font-bold text-white mt-1.5">
                        {card.title}
                      </h3>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      onClick={() => handleTogglePin(card.id)}
                      className={`p-1.5 rounded-lg border transition ${
                        card.pinned
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                      title={card.pinned ? 'Unpin' : 'Pin'}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => isEditing ? handleSaveEdit(card.id) : handleStartEdit(card)}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-400 border border-slate-700 hover:text-white transition"
                      title={isEditing ? 'Save edits' : 'Edit content'}
                    >
                      {isEditing ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Edit3 className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleDelete(card.id)}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-400 border border-slate-700 hover:text-rose-400 transition"
                      title="Delete card"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                {isEditing ? (
                  <textarea
                    rows={6}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-mono"
                  />
                ) : (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-200 font-sans leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                    {card.content}
                  </div>
                )}

                {/* Comments Section */}
                <div className="pt-3 border-t border-slate-800/80 space-y-2">
                  <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-mono">
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Collaborative Comments ({card.comments?.length || 0})</span>
                  </div>

                  {card.comments && card.comments.length > 0 && (
                    <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                      {card.comments.map(comm => (
                        <div key={comm.id} className="p-2 rounded-lg bg-slate-950 text-[11px] space-y-0.5 border border-slate-800/60">
                          <div className="flex items-center justify-between text-slate-400 font-mono text-[10px]">
                            <span className="font-bold text-indigo-300">{comm.author}</span>
                            <span>{comm.time}</span>
                          </div>
                          <p className="text-slate-300">{comm.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Comment Input */}
                  <div className="flex items-center space-x-2 pt-1">
                    <input
                      type="text"
                      placeholder="Add feedback or modification request..."
                      value={commentInputs[card.id] || ''}
                      onChange={(e) => setCommentInputs({ ...commentInputs, [card.id]: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddComment(card.id)}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-hidden"
                    />
                    <button
                      onClick={() => handleAddComment(card.id)}
                      className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Footer Export Tools */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
                  <div className="flex items-center space-x-1.5">
                    {card.tags?.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onExportCard(card.id, 'markdown')}
                      className="text-cyan-400 hover:underline text-[11px] font-mono"
                    >
                      Export .MD
                    </button>
                    <span>•</span>
                    <button
                      onClick={() => onExportCard(card.id, 'json')}
                      className="text-indigo-400 hover:underline text-[11px] font-mono"
                    >
                      Export JSON
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
