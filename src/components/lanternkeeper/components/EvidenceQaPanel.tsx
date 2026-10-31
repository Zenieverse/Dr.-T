import React, { useState } from 'react';
import { 
  MemoryLanternItem, 
  MemoryRetrievalResponse, 
  EvidenceCitation,
  NebiusProviderStatus 
} from '../types';
import { 
  Search, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  ShieldCheck, 
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Database
} from 'lucide-react';

interface EvidenceQaPanelProps {
  memories: MemoryLanternItem[];
  providerStatus: NebiusProviderStatus;
  onSelectMemoryForInspection?: (memoryId: string) => void;
}

export const EvidenceQaPanel: React.FC<EvidenceQaPanelProps> = ({
  memories,
  providerStatus,
  onSelectMemoryForInspection
}) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MemoryRetrievalResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sampleQueries = [
    "What is Grandmother Elena's lemon verbena tea tradition?",
    "What words of wisdom or proverb did Elena share at the table?",
    "Are there any records of telephone numbers or private passwords?",
    "What memories are preserved about family celebrations?"
  ];

  const handleSearch = async (targetQuery?: string) => {
    const q = (targetQuery || query).trim();
    if (!q) return;
    if (targetQuery) setQuery(targetQuery);

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/lantern-keeper/retrieve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          userMemories: memories
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to retrieve evidence');
      }

      const data: MemoryRetrievalResponse = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Error occurred while querying Personal AI.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/30 border border-amber-600/30 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                <Sparkles className="w-4 h-4" />
              </span>
              <h3 className="text-base font-semibold text-slate-100">
                Evidence-Backed Memory Retrieval
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-700/60">
                Zero Hallucinations
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
              Ask your personal AI about family traditions, proverbs, recipes, and life events. 
              Answers are synthesized <strong className="text-amber-200">strictly from your authorized memories</strong>, accompanied by exact source citations.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2 text-xs font-mono bg-slate-950/60 px-3 py-2 rounded-xl border border-slate-800">
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">Accessible Sources:</span>
            <span className="text-amber-300 font-semibold">{memories.filter(m => !m.revokedAt).length}</span>
          </div>
        </div>
      </div>

      {/* Query Input Bar */}
      <div className="space-y-3">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
          className="relative flex items-center"
        >
          <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about a person, recipe, date, life lesson, or family memory..."
            className="w-full bg-slate-900/90 border border-slate-700 focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50 rounded-2xl pl-12 pr-32 py-3.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all shadow-inner"
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5"
          >
            {isLoading ? (
              <span className="animate-spin">⏳</span>
            ) : (
              <>
                <span>Retrieve</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Suggested Queries */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-amber-400" /> Suggested queries:
          </span>
          {sampleQueries.map((sq, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSearch(sq)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-amber-200 border border-slate-700/60 transition-colors"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-700/50 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Retrieval Output */}
      {result && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Answer Card */}
          <div className="bg-slate-900/90 border border-amber-600/30 rounded-2xl p-6 shadow-md space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Grounded Personal AI Answer
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950/80 text-amber-300 border border-amber-700/60">
                  {result.modelUsed}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {result.latencyMs}ms
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-100 leading-relaxed whitespace-pre-wrap">
              {result.answer}
            </p>

            <div className="pt-2 text-[11px] text-slate-400 italic">
              {result.disclaimer}
            </div>
          </div>

          {/* Source Citations */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>Supporting Source Memories ({result.citations.length})</span>
              </h4>
              <span className="text-[11px] text-slate-400">
                Sorted by relevance & authenticity
              </span>
            </div>

            {result.citations.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400">
                No matching memory sources retrieved.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.citations.map((c, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-amber-600/40 transition-colors space-y-2 relative group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-semibold text-xs text-amber-200">
                        {c.title}
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                        {(c.relevanceScore * 100).toFixed(0)}% match
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 italic line-clamp-3">
                      "{c.excerpt}"
                    </p>

                    <div className="pt-1 flex flex-wrap items-center justify-between text-[10px] text-slate-400">
                      <span>People: {c.peopleMentioned.join(', ') || 'Self'}</span>
                      {c.dateOrPeriod && <span>Time: {c.dateOrPeriod}</span>}
                    </div>

                    {onSelectMemoryForInspection && (
                      <button
                        type="button"
                        onClick={() => onSelectMemoryForInspection(c.memoryId)}
                        className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 pt-1 opacity-80 group-hover:opacity-100 transition-opacity"
                      >
                        <span>Inspect Provenance</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Missing or Conflicting Facts Identification */}
          {result.missingOrConflictingFacts.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/60 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Explicit Gap Identification & Safety Guardrails</span>
              </div>
              <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                {result.missingOrConflictingFacts.map((mf, idx) => (
                  <li key={idx}>{mf}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
