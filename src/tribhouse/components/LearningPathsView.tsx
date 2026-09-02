import React, { useState } from 'react';
import { 
  GraduationCap, BookOpen, CheckCircle2, Clock, Sparkles, 
  ArrowRight, ArrowLeft, RefreshCw, Compass, Plus, Award
} from 'lucide-react';
import { MOCK_LEARNING_PATHS } from '../data/mockLearningPaths';
import { LearningPath, LearningPathDay } from '../types';
import { tribStorage } from '../services/tribStorageService';

interface LearningPathsViewProps {
  onAskTrib?: (query: string) => void;
}

export const LearningPathsView: React.FC<LearningPathsViewProps> = ({ onAskTrib }) => {
  const [paths, setPaths] = useState<LearningPath[]>(MOCK_LEARNING_PATHS);
  const [activePath, setActivePath] = useState<LearningPath>(paths[0]);
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);
  const [exerciseDone, setExerciseDone] = useState<boolean>(false);

  // AI Generator state
  const [showGenerateModal, setShowGenerateModal] = useState<boolean>(false);
  const [genTopic, setGenTopic] = useState<string>('');
  const [genDays, setGenDays] = useState<number>(7);
  const [genLevel, setGenLevel] = useState<string>('Beginner');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const activeDay: LearningPathDay = activePath.days[activeDayIndex] || activePath.days[0];

  const handleGeneratePath = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!genTopic.trim()) return;

    setIsGenerating(true);
    try {
      const res = await fetch('/api/trib/learning-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: genTopic, days: genDays, targetLevel: genLevel })
      });

      if (res.ok) {
        const data = await res.json();
        const newPath: LearningPath = {
          id: 'path_' + Date.now(),
          title: data.title || `${genTopic} Journey`,
          branchId: 'earth',
          estimatedDays: genDays,
          difficulty: genLevel as any,
          description: `Personalized ${genDays}-day deep learning path generated with Trib AI Steward.`,
          curator: data.curator || 'Trib Knowledge Steward',
          curatorRole: 'AI Knowledge Librarian',
          enrolledCount: 1,
          completedCount: 0,
          badgeName: `🌟 ${genTopic} Navigator`,
          days: data.days && data.days.length > 0 ? data.days : [
            {
              dayNumber: 1,
              title: 'Day 1: Foundations & Open Curiosity',
              conceptSummary: `Core principles of ${genTopic}.`,
              readingSnippet: 'Every deep journey starts with humility and the willingness to observe without premature judgment.',
              exercise: 'Observe one physical instance of this topic in your environment.',
              reflectionQuestion: 'How does this reshape your perspective?'
            }
          ]
        };

        setPaths(prev => [newPath, ...prev]);
        setActivePath(newPath);
        setActiveDayIndex(0);
        setShowGenerateModal(false);
        setGenTopic('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCompleteDay = () => {
    tribStorage.addLeaf({
      title: `Completed Day ${activeDay.dayNumber}: ${activeDay.title}`,
      type: 'NOTE',
      branchId: activePath.branchId,
      content: `Exercise completed: ${activeDay.exercise}`,
      isPublic: true
    });
    setExerciseDone(true);
    setTimeout(() => {
      setExerciseDone(false);
      if (activeDayIndex < activePath.days.length - 1) {
        setActiveDayIndex(prev => prev + 1);
      }
    }, 1500);
  };

  return (
    <div id="learning-paths-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" />
            <span>Structured Multi-Day Journeys</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-100 mt-1">
            Canopy Learning Paths
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Slow, progressive daily study arcs combining primary literature, field exercises, and daily journaling
          </p>
        </div>

        <button
          id="open-ai-path-gen-btn"
          onClick={() => setShowGenerateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate AI Study Journey</span>
        </button>
      </div>

      {/* Path Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {paths.map(path => (
          <button
            key={path.id}
            onClick={() => {
              setActivePath(path);
              setActiveDayIndex(0);
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all border ${
              activePath.id === path.id
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:bg-stone-100'
            }`}
          >
            {path.title} ({path.estimatedDays} Days)
          </button>
        ))}
      </div>

      {/* Main Path Interface: Days Stepper & Day Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Days Stepper Sidebar */}
        <div className="rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5 space-y-4 shadow-sm">
          <div>
            <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400 uppercase">
              Curator: {activePath.curator}
            </span>
            <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-base mt-0.5">
              {activePath.title}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
              {activePath.description}
            </p>
          </div>

          <div className="pt-3 border-t border-stone-100 dark:border-stone-800 space-y-1.5 max-h-96 overflow-y-auto">
            {activePath.days.map((d, index) => (
              <button
                key={d.dayNumber}
                onClick={() => setActiveDayIndex(index)}
                className={`w-full text-left p-3 rounded-xl text-xs transition-colors flex items-center justify-between ${
                  activeDayIndex === index
                    ? 'bg-blue-50 dark:bg-blue-950/50 border border-blue-300 dark:border-blue-800 font-bold text-blue-900 dark:text-blue-200'
                    : 'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                }`}
              >
                <div>
                  <div className="text-[10px] text-stone-400">Day {d.dayNumber}</div>
                  <div className="line-clamp-1">{d.title.replace(`Day ${d.dayNumber}: `, '')}</div>
                </div>
                {index < activeDayIndex && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Day Content (3 Cols on lg) */}
        <div className="lg:col-span-3 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-8 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                  Day {activeDay.dayNumber} of {activePath.estimatedDays}
                </span>
                <span className="text-xs text-stone-400">Level: {activePath.difficulty}</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold">
                <Award className="w-4 h-4" />
                <span>Earn: {activePath.badgeName}</span>
              </div>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
              {activeDay.title}
            </h2>

            {/* Concept Summary */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed">
              <span className="font-bold text-stone-900 dark:text-stone-100 block mb-1">
                🌱 Core Concept:
              </span>
              {activeDay.conceptSummary}
            </div>

            {/* Reading Snippet */}
            <div className="space-y-2">
              <div className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>Daily Reading Snippet:</span>
              </div>
              <p className="font-serif text-stone-700 dark:text-stone-300 leading-relaxed text-sm italic pl-4 border-l-2 border-blue-400">
                "{activeDay.readingSnippet}"
              </p>
            </div>

            {/* Practical Exercise */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs sm:text-sm text-stone-800 dark:text-stone-200">
              <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-1">
                🧭 Practical Field Exercise:
              </span>
              {activeDay.exercise}
            </div>

            {/* Reflection Question */}
            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs sm:text-sm text-stone-800 dark:text-stone-200">
              <span className="font-bold text-amber-800 dark:text-amber-300 block mb-1">
                💭 Evening Reflection Prompt:
              </span>
              {activeDay.reflectionQuestion}
            </div>
          </div>

          {/* Stepper Buttons */}
          <div className="pt-6 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
            <button
              disabled={activeDayIndex === 0}
              onClick={() => setActiveDayIndex(prev => Math.max(0, prev - 1))}
              className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 disabled:opacity-30 text-xs font-medium flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous Day</span>
            </button>

            <button
              onClick={handleCompleteDay}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm"
            >
              {exerciseDone ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Day Completed! (+10 T-Coins)</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Complete Day {activeDay.dayNumber}</span>
                </>
              )}
            </button>

            <button
              disabled={activeDayIndex >= activePath.days.length - 1}
              onClick={() => setActiveDayIndex(prev => prev + 1)}
              className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 disabled:opacity-30 text-xs font-medium flex items-center gap-1"
            >
              <span>Next Day</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* AI Path Generation Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-lg">
                  Generate a Custom Study Journey with Trib
                </h3>
              </div>
              <button onClick={() => setShowGenerateModal(false)} className="text-stone-400 hover:text-stone-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleGeneratePath} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  What topic would you like to master?
                </label>
                <input
                  type="text"
                  required
                  value={genTopic}
                  onChange={e => setGenTopic(e.target.value)}
                  placeholder="e.g. Mycorrhizal Networks, Vernacular Architecture, Poetics of Truyện Kiều..."
                  className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Duration:</label>
                  <select
                    value={genDays}
                    onChange={e => setGenDays(parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 text-xs"
                  >
                    <option value={7}>7 Days (Essential Foundations)</option>
                    <option value={14}>14 Days (Intermediate Immersion)</option>
                    <option value={30}>30 Days (Mastery Arc)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Target Level:</label>
                  <select
                    value={genLevel}
                    onChange={e => setGenLevel(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 text-xs"
                  >
                    <option value="Beginner">Beginner (Jargon-free)</option>
                    <option value="Intermediate">Intermediate (Mechanisms)</option>
                    <option value="Scholar">Scholar (Primary Evidence)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  className="px-4 py-2 text-stone-500 hover:text-stone-700 text-xs"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isGenerating || !genTopic.trim()}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-2 shadow-sm"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Synthesizing with Gemini 2.5...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Journey</span>
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
