import React, { useState } from 'react';
import { 
  Users, Mic, Volume2, ShieldCheck, Heart, Sparkles, 
  BookOpen, Plus, CheckCircle2, Play, Pause, Compass
} from 'lucide-react';
import { MOCK_COMMUNITY_STORIES } from '../data/mockStories';
import { StoryObject } from '../types';
import { ambientSound } from '../services/ambientSoundService';

interface CommunityForestViewProps {
  onAskTrib?: (query: string) => void;
}

export const CommunityForestView: React.FC<CommunityForestViewProps> = ({ onAskTrib }) => {
  const [stories, setStories] = useState<StoryObject[]>(MOCK_COMMUNITY_STORIES);
  const [selectedStory, setSelectedStory] = useState<StoryObject>(stories[0]);
  const [playingAudio, setPlayingAudio] = useState<boolean>(false);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);

  // Form fields
  const [subTitle, setSubTitle] = useState<string>('');
  const [subNarrator, setSubNarrator] = useState<string>('');
  const [subRole, setSubRole] = useState<string>('');
  const [subLocation, setSubLocation] = useState<string>('');
  const [subTranscript, setSubTranscript] = useState<string>('');
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);

  const handleToggleAudio = () => {
    if (playingAudio) {
      ambientSound.stop();
      setPlayingAudio(false);
    } else {
      ambientSound.play('stream');
      setPlayingAudio(true);
    }
  };

  const handleSubmitStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subTitle.trim() || !subTranscript.trim()) return;

    const newStory: StoryObject = {
      id: 'story_' + Date.now(),
      title: subTitle,
      narrator: subNarrator || 'Community Elder',
      narratorRole: subRole || 'Knowledge Guardian',
      location: subLocation || 'Living Commons',
      region: 'Southeast Asia',
      language: 'Vietnamese / English',
      branchId: 'skills',
      type: 'ORAL_HISTORY',
      durationSeconds: 300,
      transcript: subTranscript,
      summary: subTranscript.slice(0, 180) + '...',
      recordedYear: 2026,
      tags: ['Community Lore', 'Oral History', 'Traditional Knowledge'],
      license: 'Creative Commons CC-BY-NC-SA 4.0',
      consentVerified: true,
      aiAssistanceDisclosure: 'Preserved with local community steward review.',
      provenance: 'COMMUNITY'
    };

    setStories(prev => [newStory, ...prev]);
    setSelectedStory(newStory);
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setShowSubmitModal(false);
      setSubTitle('');
      setSubTranscript('');
    }, 2000);
  };

  return (
    <div id="community-forest-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Participatory Oral Memory</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-100 mt-1">
            Community Voice & Oral History Forest
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Preserving vernacular river lore, nail-less bamboo carpentry, traditional ethnomedicine recipes, and indigenous elder memories
          </p>
        </div>

        <button
          id="contribute-story-btn"
          onClick={() => setShowSubmitModal(true)}
          className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Contribute Elder Lore (+20 T-Coins)</span>
        </button>
      </div>

      {/* Main Grid: Stories Sidebar & Active Story Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Story List */}
        <div className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
            Preserved Oral Histories & Crafts
          </h2>

          <div className="space-y-3">
            {stories.map(story => (
              <div
                key={story.id}
                onClick={() => setSelectedStory(story)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedStory.id === story.id
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 dark:border-rose-700 shadow-sm'
                    : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-rose-300'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-bold text-rose-700 dark:text-rose-300">
                    {story.type.replace('_', ' ')}
                  </span>
                  <span className="text-stone-400">{story.location}</span>
                </div>

                <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm line-clamp-2">
                  {story.title}
                </h3>

                <div className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  by {story.narrator} ({story.narratorRole})
                </div>

                <div className="flex flex-wrap gap-1 mt-2">
                  {story.tags.slice(0, 3).map((t, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Story Full Viewer (2 Cols on lg) */}
        <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-8 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                  {selectedStory.type.replace('_', ' ')}
                </span>
                <span className="text-xs text-stone-400">{selectedStory.location}</span>
              </div>

              {/* Audio player simulation */}
              <button
                onClick={handleToggleAudio}
                className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  playingAudio
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                {playingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{playingAudio ? 'Playing Stream Lore' : 'Listen Acoustic Track'}</span>
              </button>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 leading-tight">
              {selectedStory.title}
            </h2>

            <div className="text-xs text-stone-500 font-medium">
              Narrator: <span className="font-bold text-stone-800 dark:text-stone-200">{selectedStory.narrator}</span> • {selectedStory.narratorRole}
            </div>

            {/* Transcript */}
            <div className="py-4 font-serif text-stone-800 dark:text-stone-200 leading-relaxed text-sm sm:text-base whitespace-pre-line space-y-4 border-l-2 border-rose-400 pl-4 bg-rose-50/30 dark:bg-rose-950/20 p-4 rounded-r-2xl">
              {selectedStory.transcript}
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-500">
            <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Consent Verified & Non-Commercial Heritage License</span>
            </div>
            <div>
              Preserved in Trib-House Community Oral Vault
            </div>
          </div>
        </div>
      </div>

      {/* Submit Oral History Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-rose-600" />
                <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-lg">
                  Contribute Elder Lore or Vernacular Craft
                </h3>
              </div>
              <button onClick={() => setShowSubmitModal(false)} className="text-stone-400 hover:text-stone-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitStory} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Story / Craft Title:</label>
                <input
                  type="text"
                  required
                  value={subTitle}
                  onChange={e => setSubTitle(e.target.value)}
                  placeholder="e.g. The Art of Clay Pot Rice Preservation..."
                  className="w-full px-4 py-2 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Elder Narrator / Artisan:</label>
                  <input
                    type="text"
                    value={subNarrator}
                    onChange={e => setSubNarrator(e.target.value)}
                    placeholder="e.g. Master Ba Thang"
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Role / Craft:</label>
                  <input
                    type="text"
                    value={subRole}
                    onChange={e => setSubRole(e.target.value)}
                    placeholder="e.g. Herbal Healer"
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Location / Village:</label>
                  <input
                    type="text"
                    value={subLocation}
                    onChange={e => setSubLocation(e.target.value)}
                    placeholder="e.g. An Giang, Mekong"
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Transcript & Guidance:</label>
                <textarea
                  rows={6}
                  required
                  value={subTranscript}
                  onChange={e => setSubTranscript(e.target.value)}
                  placeholder="Record the oral lore, recipe, or craftsmanship instructions exactly as spoken..."
                  className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-stone-100 leading-relaxed font-serif"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 text-stone-500 hover:text-stone-700 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm"
                >
                  {submittedSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Preserved in Community Forest!</span>
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4" />
                      <span>Submit Oral Heritage</span>
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
