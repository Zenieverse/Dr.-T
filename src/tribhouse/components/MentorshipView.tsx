import React, { useState } from 'react';
import { 
  UserPlus, Users, Star, CheckCircle2, MessageSquare, 
  Calendar, Clock, Heart, Sparkles, BookOpen, ShieldCheck
} from 'lucide-react';
import { MOCK_MENTORS } from '../data/mockMentors';
import { Mentor } from '../types';

interface MentorshipViewProps {
  onAskTrib?: (query: string) => void;
}

export const MentorshipView: React.FC<MentorshipViewProps> = ({ onAskTrib }) => {
  const [selectedMentor, setSelectedMentor] = useState<Mentor>(MOCK_MENTORS[0]);
  const [bookedSuccess, setBookedSuccess] = useState<boolean>(false);
  const [sessionTopic, setSessionTopic] = useState<string>('');

  const handleBookDialogue = () => {
    setBookedSuccess(true);
    setTimeout(() => {
      setBookedSuccess(false);
      setSessionTopic('');
    }, 2500);
  };

  return (
    <div id="mentorship-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider">
            <UserPlus className="w-4 h-4" />
            <span>Intergenerational Knowledge Exchange</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-100 mt-1">
            Elder-Youth Bridge & Mentorship Circles
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Connecting young readers and apprentice naturalists directly with village elders, forest scientists, and master craftsmen
          </p>
        </div>
      </div>

      {/* Main Grid: Mentors Directory & Booking Chamber */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mentors Cards List */}
        <div className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
            Verified Knowledge Stewards
          </h2>

          <div className="space-y-3">
            {MOCK_MENTORS.map(mentor => (
              <div
                key={mentor.id}
                onClick={() => setSelectedMentor(mentor)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                  selectedMentor.id === mentor.id
                    ? 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-400 dark:border-cyan-700 shadow-sm'
                    : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-cyan-300'
                }`}
              >
                <img
                  src={mentor.avatar}
                  alt={mentor.name}
                  className="w-12 h-12 rounded-xl object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm">
                      {mentor.name}
                    </h3>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
                      <Star className="w-3 h-3 fill-amber-500" />
                      <span>{mentor.rating}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-cyan-700 dark:text-cyan-300 font-medium">
                    {mentor.title}
                  </div>

                  <div className="text-[10px] text-stone-400">
                    {mentor.sessionsCompleted} dialogues completed
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Mentor Detail & Socratic Circle Invitation (2 Cols on lg) */}
        <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-8 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-4">
                <img
                  src={selectedMentor.avatar}
                  alt={selectedMentor.name}
                  className="w-16 h-16 rounded-2xl object-cover shadow-sm"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
                      {selectedMentor.name}
                    </h2>
                    {selectedMentor.isVerified && (
                      <span title="Verified Steward">
                        <ShieldCheck className="w-4 h-4 text-cyan-600" />
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-cyan-700 dark:text-cyan-400 font-medium mt-0.5">
                    {selectedMentor.title} • {selectedMentor.institutionAffiliation}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-stone-400">Exchange Dividend</div>
                <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {selectedMentor.tCoinsContribution} T-Coins
                </div>
              </div>
            </div>

            {/* Bio & Focus Areas */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-stone-900 dark:text-stone-100 block">
                About the Steward & Tradition:
              </span>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-sans">
                {selectedMentor.bio}
              </p>
            </div>

            {/* Focus Areas Chips */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-stone-900 dark:text-stone-100 block">
                Primary Dialogue & Mentorship Domains:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedMentor.focusAreas.map((area, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
                <Calendar className="w-4 h-4 text-cyan-600" />
                <span>Next Available Circle: <strong>{selectedMentor.availability}</strong></span>
              </div>
              <span className="text-stone-400">Format: {selectedMentor.sessionType}</span>
            </div>

            {/* Inquiry Prompt for Session */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-900 dark:text-stone-100">
                What question or project would you like to discuss with {selectedMentor.name.split(' ')[0]}?
              </label>
              <input
                type="text"
                value={sessionTopic}
                onChange={e => setSessionTopic(e.target.value)}
                placeholder="e.g. Inquiring about traditional mud curing for bamboo joinery..."
                className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
            <div className="text-xs text-stone-400">
              100% of dividends support the elder's rural community guild & local tree seedlings
            </div>

            <button
              id="book-mentor-dialogue-btn"
              onClick={handleBookDialogue}
              className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-colors"
            >
              {bookedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Dialogue Circle Requested!</span>
                </>
              ) : (
                <>
                  <MessageSquare className="w-4 h-4" />
                  <span>Request 1-on-1 Dialogue ({selectedMentor.tCoinsContribution} T-Coins)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
