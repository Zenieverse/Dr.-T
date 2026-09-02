import React, { useState } from 'react';
import { 
  X, Send, Sparkles, Compass, BookOpen, Network, 
  GraduationCap, Feather, Lightbulb, ExternalLink, RefreshCw
} from 'lucide-react';
import { TribMode, TribMessage, askTrib, EXPLAIN_LEVELS } from '../services/tribAiService';

interface TribLibrarianModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: TribMode;
  initialQuery?: string;
  initialContext?: string;
  context?: { bookTitle?: string; currentTopic?: string; branchId?: string } | string;
  onNavigateToRoom?: (roomId: string, extra?: any) => void;
}

export const TribLibrarianModal: React.FC<TribLibrarianModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'FIND',
  initialQuery = '',
  initialContext,
  context,
  onNavigateToRoom
}) => {
  const [mode, setMode] = useState<TribMode>(initialMode);
  const [query, setQuery] = useState<string>(initialQuery);
  const [explainLevel, setExplainLevel] = useState<'child' | 'beginner' | 'intermediate' | 'advanced' | 'expert'>('beginner');
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<TribMessage[]>([
    {
      id: 'welcome',
      role: 'trib',
      content: `Welcome to Trib-House. I am Trib, your knowledge steward and librarian.

"Mind feeds mind. People feed knowledge. Trees feed life."

I can help you search our 18 living branches, explain difficult concepts from childhood wonder to doctoral depth, connect ideas across disparate disciplines, or guide your daily slow reading.

What seed of inquiry shall we plant today?`,
      mode: 'FIND',
      timestamp: 'Just now',
      suggestedActions: [
        'How do mother trees communicate with saplings?',
        'Explain the Lục Bát poetic meter of Truyện Kiều',
        'Connect Mycorrhizal Networks with Elinor Ostrom\'s Commons',
        'Create a 30-day learning path on living soil'
      ]
    }
  ]);

  if (!isOpen) return null;

  const handleSend = async (overrideQuery?: string) => {
    const textToSend = overrideQuery || query;
    if (!textToSend.trim()) return;

    const userMsg: TribMessage = {
      id: 'user_' + Date.now(),
      role: 'user',
      content: textToSend,
      mode,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      const contextObj = typeof context === 'object' && context !== null ? context : (context ? { currentTopic: context } : {});
      const response = await askTrib(textToSend, mode, {
        ...contextObj,
        explainLevel: mode === 'EXPLAIN' ? explainLevel : undefined
      });
      setMessages(prev => [...prev, response]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (action: string) => {
    if (action.includes('Knowledge Graph') || action.includes('Graph')) {
      if (onNavigateToRoom) onNavigateToRoom('graph');
      onClose();
    } else if (action.includes('Vietnam Grove') || action.includes('TreeLedger') || action.includes('Grove')) {
      if (onNavigateToRoom) onNavigateToRoom('groves');
      onClose();
    } else if (action.includes('Reading Nest') || action.includes('Bilingual')) {
      if (onNavigateToRoom) onNavigateToRoom('reading_nest');
      onClose();
    } else if (action.includes('Learning Path') || action.includes('30-Day')) {
      if (onNavigateToRoom) onNavigateToRoom('learning_paths');
      onClose();
    } else {
      setQuery(action);
      handleSend(action);
    }
  };

  const modes: { key: TribMode; label: string; icon: React.ReactNode; desc: string }[] = [
    { key: 'FIND', label: 'Find & Guide', icon: <Compass className="w-3.5 h-3.5" />, desc: 'Search literature & provenance' },
    { key: 'READ', label: 'Slow Reading', icon: <BookOpen className="w-3.5 h-3.5" />, desc: 'Guided inquiry & reflections' },
    { key: 'EXPLAIN', label: 'Explain Depth', icon: <Lightbulb className="w-3.5 h-3.5" />, desc: 'From Child to Scholar' },
    { key: 'CONNECT', label: 'Connect Ideas', icon: <Network className="w-3.5 h-3.5" />, desc: 'Cross-branch synthesis' },
    { key: 'LEARN', label: 'Learning Paths', icon: <GraduationCap className="w-3.5 h-3.5" />, desc: 'Curated 7 to 30-day journeys' },
    { key: 'CREATE', label: 'Create & Share', icon: <Feather className="w-3.5 h-3.5" />, desc: 'Leaves, letters & crafts' },
  ];

  return (
    <div id="trib-librarian-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="trib-librarian-modal-container" 
        className="relative w-full max-w-4xl h-[90vh] max-h-[820px] bg-stone-50 dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">Trib — AI Knowledge Steward</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Living Library Commons
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Calm, evidence-aware synthesis grounded across 18 living knowledge branches
              </p>
            </div>
          </div>

          <button
            id="trib-modal-close-btn"
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1 px-6 py-2 bg-stone-100/70 dark:bg-stone-850 border-b border-stone-200 dark:border-stone-800 overflow-x-auto">
          {modes.map(m => (
            <button
              key={m.key}
              id={`trib-mode-btn-${m.key.toLowerCase()}`}
              onClick={() => setMode(m.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                mode === m.key
                  ? 'bg-white dark:bg-stone-800 text-emerald-800 dark:text-emerald-300 shadow-sm border border-stone-200 dark:border-stone-700'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800/50'
              }`}
            >
              {m.icon}
              <span>{m.label}</span>
            </button>
          ))}
        </div>

        {/* Level Selector (if in EXPLAIN mode) */}
        {mode === 'EXPLAIN' && (
          <div className="px-6 py-2.5 bg-amber-50/70 dark:bg-amber-950/30 border-b border-amber-200/60 dark:border-amber-900/40 flex items-center justify-between text-xs">
            <span className="font-semibold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" /> Explanation Depth:
            </span>
            <div className="flex items-center gap-1">
              {EXPLAIN_LEVELS.map(lvl => (
                <button
                  key={lvl.level}
                  id={`explain-level-btn-${lvl.level}`}
                  onClick={() => setExplainLevel(lvl.level)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    explainLevel === lvl.level
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-stone-700'
                  }`}
                  title={lvl.description}
                >
                  {lvl.label.split(' ')[1] || lvl.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-2 mb-1 text-[11px] text-stone-400">
                <span className="font-semibold">{msg.role === 'user' ? 'You' : 'Trib Steward'}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-emerald-700 text-white rounded-br-none shadow-sm'
                    : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-bl-none shadow-sm border border-stone-200 dark:border-stone-700/80 font-sans'
                }`}
              >
                <div className="whitespace-pre-line prose prose-sm dark:prose-invert max-w-none">
                  {msg.content}
                </div>

                {/* Sources grounding box */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-700/60 text-xs">
                    <div className="font-semibold text-emerald-800 dark:text-emerald-400 mb-1.5 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" /> Curated Primary Sources & References:
                    </div>
                    <ul className="space-y-1 text-stone-600 dark:text-stone-300">
                      {msg.sources.map((src, i) => (
                        <li key={i} className="flex items-center justify-between text-[11px] bg-stone-50 dark:bg-stone-850 p-1.5 rounded border border-stone-200 dark:border-stone-700">
                          <div>
                            <span className="font-medium text-stone-900 dark:text-stone-100">{src.title}</span>
                            {src.author && <span className="text-stone-400"> — {src.author}</span>}
                          </div>
                          {src.branch && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                              {src.branch}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Suggested Action Chips */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="mt-3 pt-2 flex flex-wrap gap-1.5">
                    {msg.suggestedActions.map((act, i) => (
                      <button
                        key={i}
                        id={`suggested-act-${i}`}
                        onClick={() => handleActionClick(act)}
                        className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition-colors flex items-center gap-1"
                      >
                        <span>{act}</span>
                        <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3 p-4 bg-white dark:bg-stone-800 rounded-2xl max-w-sm border border-stone-200 dark:border-stone-700 text-xs text-stone-600 dark:text-stone-400 animate-pulse">
              <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin" />
              <span>Trib is traversing the 18 branches and synthesizing knowledge...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              id="trib-librarian-prompt-input"
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={
                mode === 'EXPLAIN'
                  ? `Ask to explain any concept at ${explainLevel.toUpperCase()} level...`
                  : mode === 'CONNECT'
                  ? 'Enter two ideas to find how they bridge (e.g. Mycorrhizae & Ostrom Commons)...'
                  : 'Ask Trib about ecology, literature, philosophy, soil, health...'
              }
              className="flex-1 px-4 py-3 bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />

            <button
              id="trib-librarian-send-btn"
              type="submit"
              disabled={loading || !query.trim()}
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium text-sm flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span>Ask</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
