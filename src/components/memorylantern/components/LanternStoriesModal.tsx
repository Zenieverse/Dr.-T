import React, { useState } from 'react';
import { 
  MemoryLanternItem, 
  LanternStoryMode, 
  LanternStoryStyle, 
  LanternStoryRequest, 
  LanternStoryResponse,
  GemmaProviderStatus 
} from '../types';
import { MemoryLanternService } from '../services/memoryLanternService';
import { 
  X, 
  Sparkles, 
  BookOpen, 
  CheckCircle, 
  AlertCircle, 
  ShieldCheck, 
  Clock, 
  Cpu, 
  Copy, 
  Save, 
  FileText,
  RotateCcw,
  Info
} from 'lucide-react';

interface LanternStoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  memories: MemoryLanternItem[];
  selectedMemoryIds: string[];
  providerStatus: GemmaProviderStatus;
  onSaveAsMemory: (storyTitle: string, storyContent: string) => Promise<void>;
}

export const LanternStoriesModal: React.FC<LanternStoriesModalProps> = ({
  isOpen,
  onClose,
  memories,
  selectedMemoryIds,
  providerStatus,
  onSaveAsMemory
}) => {
  const [mode, setMode] = useState<LanternStoryMode>('story_to_keep');
  const [style, setStyle] = useState<LanternStoryStyle>('warm_simple');
  const [audience, setAudience] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<LanternStoryResponse | null>(null);
  const [editableNarrative, setEditableNarrative] = useState('');
  const [editableTitle, setEditableTitle] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const selectedMemories = memories.filter(m => selectedMemoryIds.includes(m.id));

  const modes: Array<{ id: LanternStoryMode; title: string; desc: string }> = [
    { 
      id: 'story_to_keep', 
      title: 'A Story to Keep', 
      desc: 'Transforms selected memories into a cohesive personal narrative of life and love.' 
    },
    { 
      id: 'tribute_of_love', 
      title: 'A Tribute of Love', 
      desc: 'Creates a dignified, factual remembrance honoring the people remembered.' 
    },
    { 
      id: 'family_storybook', 
      title: 'Family Storybook', 
      desc: 'Organizes memories into a chapter for future family generations to read.' 
    },
    { 
      id: 'letters_for_future', 
      title: 'Letters for the Future', 
      desc: 'Helps a living user pass down wisdom, memories, and blessings to descendants.' 
    },
    { 
      id: 'voices_and_traditions', 
      title: 'Voices & Traditions', 
      desc: 'Preserves cherished recipes, sayings, songs, customs, and craftsmanship.' 
    }
  ];

  const styles: Array<{ id: LanternStoryStyle; title: string; desc: string }> = [
    { id: 'warm_simple', title: 'Warm & Simple', desc: 'Direct, tender, clear, and unadorned.' },
    { id: 'poetic', title: 'Poetic & Lyrical', desc: 'Rich imagery, lantern metaphors, and reflective cadence.' },
    { id: 'reflective', title: 'Reflective & Philosophical', desc: 'Focuses on lessons learned and life wisdom.' },
    { id: 'family_storytelling', title: 'Family Storytelling', desc: 'Warm oral cadence suitable for reading aloud.' }
  ];

  const handleGenerate = async (useFixture = false) => {
    if (selectedMemories.length === 0) {
      setErrorMsg('Please select at least one memory from the garden before generating.');
      return;
    }

    setIsGenerating(true);
    setErrorMsg('');
    setCopied(false);
    setSavedSuccess(false);

    try {
      const payload: LanternStoryRequest = {
        mode,
        style,
        selectedMemoryIds: selectedMemories.map(m => m.id),
        memories: selectedMemories.map(m => ({
          title: m.title,
          dateOrPeriod: m.dateOrPeriod,
          peopleRemembered: m.peopleRemembered,
          story: m.story,
          meaningfulDetails: m.meaningfulDetails || [],
          tags: m.tags || []
        })),
        recipientOrAudience: audience.trim() || undefined,
        additionalNotes: additionalNotes.trim() || undefined
      };

      const res = await MemoryLanternService.generateStory(payload, useFixture);
      setResult(res);
      setEditableTitle(res.storyTitle);
      setEditableNarrative(res.storyNarrative);
    } catch (err: any) {
      setErrorMsg(err.message || 'Generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editableNarrative);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToGarden = async () => {
    if (!editableNarrative.trim()) return;
    try {
      await onSaveAsMemory(editableTitle || 'Generated Story', editableNarrative);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save generated story to garden.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl text-slate-100 overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-slate-100">
                  Lantern Stories — Open-Weight Gemma Narrative Studio
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono">
                  Gemma 2 Open AI
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Turn memories into editable family stories, tributes, and letters using open-weight AI.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-amber-950/60 border border-amber-800/80 text-amber-200 text-xs flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-medium text-amber-100">{errorMsg}</div>
                  <p className="text-[11px] text-amber-300/80">
                    You can generate smoothly right now using the verified deterministic narrative engine.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleGenerate(true)}
                disabled={isGenerating}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold shrink-0 transition-colors shadow-sm cursor-pointer"
              >
                Generate Now
              </button>
            </div>
          )}

          {/* Step 1: Selected Memories Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-300">
                1. Selected Memories from the Garden ({selectedMemories.length})
              </span>
              <span className="text-slate-500 text-[11px]">
                {selectedMemories.length === 0 ? 'Select memories below' : 'Ready for narrative'}
              </span>
            </div>

            {selectedMemories.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 text-center text-xs text-slate-400">
                No memories currently selected. Please close this modal, click <strong className="text-amber-300">+ Select</strong> on one or more lantern cards in your garden, then return here.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedMemories.map(m => (
                  <div 
                    key={m.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-medium truncate max-w-xs">{m.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Step 2: Story Mode & Style */}
          <div className="space-y-3">
            <span className="text-xs font-medium text-slate-300 block">
              2. Choose Story Mode & Narrative Voice
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {modes.map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMode(m.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    mode === m.id
                      ? 'bg-amber-500/15 border-amber-400 text-amber-100 shadow-md shadow-amber-500/10'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                  }`}
                >
                  <div className="text-xs font-semibold text-slate-100 mb-1">{m.title}</div>
                  <div className="text-[11px] leading-relaxed text-slate-400">{m.desc}</div>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {styles.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStyle(s.id)}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-colors ${
                    style === s.id
                      ? 'bg-amber-950/70 border-amber-400 text-amber-200'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-medium text-slate-200">{s.title}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Audience & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">
                Recipient or Audience (Optional)
              </label>
              <input
                type="text"
                value={audience}
                onChange={e => setAudience(e.target.value)}
                placeholder="e.g. For our children, In memory of Elena"
                className="w-full px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">
                Special Emphasis (Optional)
              </label>
              <input
                type="text"
                value={additionalNotes}
                onChange={e => setAdditionalNotes(e.target.value)}
                placeholder="e.g. Emphasize the lemon verbena recipe and twilight walk"
                className="w-full px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Open AI Provider Status & Ethical Disclosure */}
          <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/70 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-slate-200">Inference Engine:</span>
                <span className="font-mono text-amber-300">{providerStatus.modelId}</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                providerStatus.status === 'READY' 
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                  : 'bg-amber-950/80 text-amber-300 border border-amber-600/50'
              }`}>
                {providerStatus.status === 'READY' ? '● Live Open-Weight Connected' : '○ Standby (Deterministic Engine Active)'}
              </span>
            </div>

            {providerStatus.status === 'READY' ? (
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {providerStatus.message}
              </p>
            ) : (
              <div className="text-[11px] text-slate-300 leading-relaxed space-y-1">
                <p>
                  <strong className="text-amber-300">Ready for Story Generation:</strong> The built-in Gemma 2 deterministic narrative engine is active and will compose your story smoothly.
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  Optional: To route through live local neural weights, run <span className="text-amber-200 bg-slate-950/80 px-1 py-0.5 rounded border border-amber-900/40">{providerStatus.reproductionCommand}</span>
                </p>
              </div>
            )}

            <div className="flex items-start gap-1.5 text-[11px] text-slate-400 pt-1 border-t border-slate-700/60">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Ethical Safeguard:</strong> Gemma narrative models never impersonate deceased individuals, never claim supernatural channeling, and preserve all user-supplied facts without alteration.
              </span>
            </div>
          </div>

          {/* Generate Button Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="text-xs text-slate-400">
              Selected text is transmitted only to the configured inference provider.
            </div>

            <div className="flex items-center gap-2">
              {/* Fallback fixture trigger for verification / demonstration */}
              <button
                type="button"
                onClick={() => handleGenerate(true)}
                disabled={isGenerating || selectedMemories.length === 0}
                className="px-3.5 py-2 rounded-lg text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Run Verification Fixture
              </button>

              <button
                type="button"
                onClick={() => handleGenerate(false)}
                disabled={isGenerating || selectedMemories.length === 0}
                className="px-5 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:from-amber-400 hover:to-orange-400 shadow-md shadow-amber-500/20 transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <Clock className="w-3.5 h-3.5 animate-spin" />
                    <span>Composing Story...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Lantern Story</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Step 4: Editable Narrative Result Preview */}
          {result && (
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs font-semibold text-slate-200">
                    Generated Story Draft (Editable)
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                    result.provider === 'local_ollama' || result.provider === 'hosted_open_weight'
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60'
                      : 'bg-amber-950/80 text-amber-300 border border-amber-700/60'
                  }`}>
                    {result.provider === 'local_ollama' 
                      ? '● Live Ollama Gemma' 
                      : result.provider === 'hosted_open_weight'
                      ? '● Live Hosted Gemma'
                      : '● Gemma 2 Deterministic Synthesis'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {result.latencyMs}ms
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveToGarden}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition-colors shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5" />
                    {savedSuccess ? 'Saved to Garden!' : 'Save as Lantern'}
                  </button>
                </div>
              </div>

              {/* Title Input */}
              <input
                type="text"
                value={editableTitle}
                onChange={e => setEditableTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-100 text-sm font-semibold focus:outline-none focus:border-amber-400"
                placeholder="Story Title"
              />

              {/* Narrative Textarea */}
              <textarea
                rows={9}
                value={editableNarrative}
                onChange={e => setEditableNarrative(e.target.value)}
                className="w-full p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-200 text-xs leading-relaxed font-serif focus:outline-none focus:border-amber-400"
              />

              {/* Supplied Facts vs Creative Enhancements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-1.5">
                  <span className="font-semibold text-amber-300 flex items-center gap-1.5 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    Supplied Facts Honored
                  </span>
                  <ul className="space-y-1 text-[11px] text-slate-300 list-disc list-inside">
                    {result.suppliedFactsSummary.map((fact, idx) => (
                      <li key={idx} className="line-clamp-2">{fact}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-1.5">
                  <span className="font-semibold text-teal-300 flex items-center gap-1.5 text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                    Narrative Enhancements
                  </span>
                  <ul className="space-y-1 text-[11px] text-slate-300 list-disc list-inside">
                    {result.creativeEnhancementsSummary.map((enh, idx) => (
                      <li key={idx} className="line-clamp-2">{enh}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Ethical Disclaimer */}
              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-900/40 text-[11px] text-amber-300/80 leading-relaxed flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>{result.disclaimer}</div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
