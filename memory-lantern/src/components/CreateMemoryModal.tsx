import React, { useState, useEffect } from 'react';
import { 
  MemoryLanternItem, 
  MeaningfulDetail, 
  MeaningfulDetailType, 
  LanternPrivacyLevel 
} from '../types';
import { 
  X, 
  Flame, 
  Plus, 
  Trash2, 
  Mic, 
  ShieldAlert, 
  Info,
  Calendar,
  Users,
  Check
} from 'lucide-react';

interface CreateMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (memory: MemoryLanternItem) => Promise<void>;
  initialMemory?: MemoryLanternItem | null;
}

export const CreateMemoryModal: React.FC<CreateMemoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialMemory
}) => {
  const [title, setTitle] = useState('');
  const [dateOrPeriod, setDateOrPeriod] = useState('');
  const [peopleText, setPeopleText] = useState('');
  const [category, setCategory] = useState<MemoryLanternItem['category']>('Remembrance');
  const [story, setStory] = useState('');
  const [tagsText, setTagsText] = useState('');
  const [privacyLevel, setPrivacyLevel] = useState<LanternPrivacyLevel>('FAMILY_EXPORTABLE');
  const [lanternColor, setLanternColor] = useState<MemoryLanternItem['lanternColor']>('amber');
  
  // Meaningful details
  const [details, setDetails] = useState<MeaningfulDetail[]>([
    { type: 'saying_or_proverb', label: 'Favorite Saying', value: '' }
  ]);

  // Audio Note Simulation
  const [hasAudioNote, setHasAudioNote] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedDuration, setRecordedDuration] = useState(0);
  const [audioSummary, setAudioSummary] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialMemory) {
      setTitle(initialMemory.title || '');
      setDateOrPeriod(initialMemory.dateOrPeriod || '');
      setPeopleText((initialMemory.peopleRemembered || []).join(', '));
      setCategory(initialMemory.category || 'Remembrance');
      setStory(initialMemory.story || '');
      setTagsText((initialMemory.tags || []).join(', '));
      setPrivacyLevel(initialMemory.privacyLevel || 'FAMILY_EXPORTABLE');
      setLanternColor(initialMemory.lanternColor || 'amber');
      setDetails(initialMemory.meaningfulDetails?.length ? initialMemory.meaningfulDetails : [
        { type: 'saying_or_proverb', label: 'Favorite Saying', value: '' }
      ]);
      setHasAudioNote(Boolean(initialMemory.audioNote?.recorded));
      setRecordedDuration(initialMemory.audioNote?.durationSeconds || 0);
      setAudioSummary(initialMemory.audioNote?.transcriptSummary || '');
    } else {
      resetForm();
    }
  }, [initialMemory, isOpen]);

  const resetForm = () => {
    setTitle('');
    setDateOrPeriod('');
    setPeopleText('');
    setCategory('Remembrance');
    setStory('');
    setTagsText('');
    setPrivacyLevel('FAMILY_EXPORTABLE');
    setLanternColor('amber');
    setDetails([{ type: 'saying_or_proverb', label: 'Favorite Saying', value: '' }]);
    setHasAudioNote(false);
    setIsRecording(false);
    setRecordedDuration(0);
    setAudioSummary('');
    setErrorMsg('');
  };

  const handleAddDetail = () => {
    setDetails([...details, { type: 'keepsake_or_object', label: 'Tradition / Keepsake', value: '' }]);
  };

  const handleRemoveDetail = (index: number) => {
    setDetails(details.filter((_, i) => i !== index));
  };

  const handleDetailChange = (index: number, field: keyof MeaningfulDetail, val: string) => {
    const next = [...details];
    next[index] = { ...next[index], [field]: val };
    setDetails(next);
  };

  const handleToggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordedDuration(0);
      const timer = setInterval(() => {
        setRecordedDuration(prev => {
          if (prev >= 60) {
            clearInterval(timer);
            setIsRecording(false);
            setHasAudioNote(true);
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
      setTimeout(() => {
        clearInterval(timer);
        setIsRecording(false);
        setHasAudioNote(true);
        if (!audioSummary) {
          setAudioSummary('Oral history audio recorded by participant with consent.');
        }
      }, 5000);
    } else {
      setIsRecording(false);
      setHasAudioNote(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please give this memory lantern a title.');
      return;
    }
    if (!story.trim()) {
      setErrorMsg('Please write a few lines about this memory or story.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const cleanedDetails = details.filter(d => d.value.trim().length > 0);
      const people = peopleText.split(',').map(p => p.trim()).filter(Boolean);
      const tags = tagsText.split(',').map(t => t.trim()).filter(Boolean);

      const memoryItem: MemoryLanternItem = {
        id: initialMemory?.id || `lantern-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        userId: initialMemory?.userId || 'guest_user',
        title: title.trim(),
        dateOrPeriod: dateOrPeriod.trim() || undefined,
        peopleRemembered: people.length ? people : undefined,
        category,
        story: story.trim(),
        meaningfulDetails: cleanedDetails,
        tags,
        privacyLevel,
        lanternColor,
        isSample: false,
        audioNote: hasAudioNote ? {
          recorded: true,
          durationSeconds: recordedDuration || 15,
          transcriptSummary: audioSummary || 'Oral history audio note attached'
        } : undefined,
        createdAt: initialMemory?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await onSave(memoryItem);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save memory lantern.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl text-slate-100 overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Flame className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-100">
                {initialMemory ? 'Edit Memory Lantern' : 'Light a New Memory Lantern'}
              </h2>
              <p className="text-xs text-slate-400">
                Preserve a memory, family tradition, or keepsake for generations to come.
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

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-950/70 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Privacy Notice Banner */}
          <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-900/40 text-[11px] text-amber-300/90 flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong>Sanctuary Guarantee:</strong> Memories are private to your session or account. Do not store sensitive credentials, passwords, or financial information.
            </div>
          </div>

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-medium text-slate-300">
                Memory Title <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Grandmother's Lemon Verbena Tea"
                className="w-full px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
              >
                <option value="Remembrance">Remembrance</option>
                <option value="Tradition">Tradition</option>
                <option value="Milestone">Milestone</option>
                <option value="Everyday Joy">Everyday Joy</option>
                <option value="Wisdom">Wisdom</option>
              </select>
            </div>
          </div>

          {/* Date & People Remembered */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-amber-400/80" />
                Date or Approximate Period (Optional)
              </label>
              <input
                type="text"
                value={dateOrPeriod}
                onChange={e => setDateOrPeriod(e.target.value)}
                placeholder="e.g. Summer 1984, Circa 1965, or Unknown"
                className="w-full px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1">
                <Users className="w-3 h-3 text-rose-400/80" />
                People Remembered (Optional, Pseudonyms OK)
              </label>
              <input
                type="text"
                value={peopleText}
                onChange={e => setPeopleText(e.target.value)}
                placeholder="e.g. Grandmother Elena, Uncle Marco"
                className="w-full px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Story Narrative Text */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">
              Memory Narrative & Reflections <span className="text-amber-400">*</span>
            </label>
            <textarea
              rows={4}
              value={story}
              onChange={e => setStory(e.target.value)}
              placeholder="Describe the moment, the setting, how it felt, or the sounds and aromas you remember..."
              className="w-full px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400 leading-relaxed"
              required
            />
          </div>

          {/* Meaningful Details List */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-300">
                Traditions, Recipes, Proverbs & Keepsakes
              </span>
              <button
                type="button"
                onClick={handleAddDetail}
                className="inline-flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 transition-colors font-medium"
              >
                <Plus className="w-3 h-3" />
                Add Detail
              </button>
            </div>

            {details.map((detail, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <select
                  value={detail.type}
                  onChange={e => handleDetailChange(idx, 'type', e.target.value as MeaningfulDetailType)}
                  className="w-32 px-2 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-amber-400"
                >
                  <option value="saying_or_proverb">Saying/Proverb</option>
                  <option value="recipe">Recipe</option>
                  <option value="favorite_song">Favorite Song</option>
                  <option value="family_tradition">Tradition</option>
                  <option value="special_place">Special Place</option>
                  <option value="keepsake_or_object">Keepsake</option>
                  <option value="other">Other</option>
                </select>

                <input
                  type="text"
                  value={detail.label}
                  onChange={e => handleDetailChange(idx, 'label', e.target.value)}
                  placeholder="Label (e.g. Evening Saying)"
                  className="w-36 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                />

                <input
                  type="text"
                  value={detail.value}
                  onChange={e => handleDetailChange(idx, 'value', e.target.value)}
                  placeholder="Detail content or quote..."
                  className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                />

                {details.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveDetail(idx)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Tags & Lantern Glow Color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Tags (comma-separated)</label>
              <input
                type="text"
                value={tagsText}
                onChange={e => setTagsText(e.target.value)}
                placeholder="e.g. Tea, Summer, Sunroom, Elena"
                className="w-full px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Lantern Flame Hue</label>
              <div className="flex items-center gap-2 pt-1">
                {(['amber', 'warm_gold', 'rose', 'emerald', 'indigo'] as const).map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setLanternColor(color)}
                    className={`w-7 h-7 rounded-full border-2 transition-transform ${
                      lanternColor === color ? 'scale-110 border-white' : 'border-transparent opacity-70'
                    } ${
                      color === 'amber' ? 'bg-amber-500' :
                      color === 'warm_gold' ? 'bg-yellow-400' :
                      color === 'rose' ? 'bg-rose-500' :
                      color === 'emerald' ? 'bg-emerald-500' : 'bg-indigo-500'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Oral History Recording Simulation */}
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-medium text-slate-200">Oral History Audio Note</span>
              </div>
              <p className="text-[11px] text-slate-400">
                {hasAudioNote 
                  ? `Recorded (${recordedDuration}s): "${audioSummary || 'Oral voice memory'}"`
                  : 'Capture or simulate a spoken memory snippet with review.'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleToggleRecording}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                isRecording 
                  ? 'bg-rose-600 text-white animate-pulse' 
                  : hasAudioNote 
                    ? 'bg-emerald-950 border border-emerald-700 text-emerald-300'
                    : 'bg-slate-800 border border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              {isRecording ? 'Recording (5s)...' : hasAudioNote ? '✓ Attached (Re-record)' : 'Record Audio'}
            </button>
          </div>

          {/* Privacy Level */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Privacy Scope</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'PRIVATE', label: 'Private Sanctuary', desc: 'Only visible to you' },
                { id: 'FAMILY_EXPORTABLE', label: 'Family Export', desc: 'Ready for story sharing' },
                { id: 'ANONYMIZED', label: 'Anonymized', desc: 'No personal identifiers' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPrivacyLevel(opt.id as LanternPrivacyLevel)}
                  className={`p-2 rounded-lg border text-left transition-colors ${
                    privacyLevel === opt.id 
                      ? 'bg-amber-950/60 border-amber-500/80 text-amber-200' 
                      : 'bg-slate-800/50 border-slate-700/60 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <div className="text-xs font-medium">{opt.label}</div>
                  <div className="text-[10px] opacity-75">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:from-amber-400 hover:to-orange-400 shadow-md shadow-amber-500/20 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Placing Lantern...' : initialMemory ? 'Update Lantern' : 'Place in Garden'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
