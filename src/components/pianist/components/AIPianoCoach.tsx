import React, { useState } from 'react';
import { Bot, Send, Sparkles, Volume2, ArrowRight, Music, HelpCircle, CheckCircle } from 'lucide-react';
import { pianoAudio } from '../audio/pianoAudio';

interface CoachProps {
  onLaunchExercise?: (action: string) => void;
}

interface CoachMessage {
  id: string;
  sender: 'coach' | 'user';
  text: string;
  notesToAudition?: string[];
  actionPrompt?: string;
  actionTab?: string;
}

const PRESET_TOPICS = [
  {
    q: 'Why does my C to F chord transition feel clunky?',
    answer: "You are likely picking your entire hand up off the keyboard! Instead, notice common tones: C is shared between both chords (C-E-G and F-A-C). Keep your thumb pinned on C as an anchor, and pivot your fingers 3 and 5 up to F and A. This is called 'voice leading'!",
    notes: ['C4', 'E4', 'G4', 'F4', 'A4', 'C5'],
    action: 'Try Voice Leading on C to F',
  },
  {
    q: 'How can I memorize songs without depending on muscle memory?',
    answer: "Muscle memory fails under stress. Instead, anchor your memory across THREE pillars: 1) Visual shapes (intervals and chord blocks on the keyboard), 2) Harmonic milestones (e.g. 'This phrase resolves on V dominant'), and 3) Auditory memory (singing the melody ahead of your hands).",
    notes: ['C4', 'G4', 'E4', 'C4'],
    action: 'Test Ear Memory in Song Lab',
  },
  {
    q: 'Explain syncopated rhythm simply.',
    answer: "Think of normal rhythm as walking: LEFT, RIGHT, LEFT, RIGHT. Syncopation is a playful skip or bounce right in between footsteps on the 'AND'! It emphasizes the off-beat, creating that infectious groove found in ragtime, jazz, and modern pop.",
    notes: ['C4', 'E4', 'G4'],
    action: 'Explore Rhythm Lab Path',
  },
  {
    q: 'How do I start figuring out songs by ear?',
    answer: "Start with the BASS note! In almost all modern music, the lowest bass note tells you the chord name. Once you identify the bass note on the piano, the melody will almost always use notes from that root's pentatonic scale.",
    notes: ['C3', 'G3', 'A3', 'F3'],
    action: 'Launch Ear Training Level 8',
  },
  {
    q: 'What should I listen for during Touch Grass walks?',
    answer: "Put your phone away and listen for periodic cycles: footstep strides, bicycle chains, raindrops, or distant bells. Notice whether the rhythm is steady (duple) or swinging, and whether the pitch climbs up or drops down.",
    notes: ['C3', 'G3', 'C3', 'G3'],
    action: 'Launch 60-Second Walk',
  },
  {
    q: 'How do I turn outdoor sounds into piano patterns?',
    answer: "Assign physical rhythms to your left hand as an anchor (roots C3-G3), and natural pitch contours (like birdcalls) to your right hand. That is how Beethoven and Debussy composed their masterworks from daily nature walks!",
    notes: ['C3', 'E4', 'G4', 'C5'],
    action: 'Try World to Piano',
  },
];

export const AIPianoCoach: React.FC<CoachProps> = ({ onLaunchExercise }) => {
  const [messages, setMessages] = useState<CoachMessage[]>([
    {
      id: 'welcome',
      sender: 'coach',
      text: "Greetings! I am your Pianist Coach. Whether you are navigating finger tension, decoding a tricky measure, or learning how to play melodies by ear, ask me anything.",
      actionPrompt: "Audition Middle C Harmonic",
      notesToAudition: ['C4', 'E4', 'G4'],
    }
  ]);
  const [inputValue, setInputValue] = useState<string>('');

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputValue;
    if (!query.trim()) return;

    const userMsg: CoachMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');

    // Pedagogical smart response
    setTimeout(() => {
      let replyText = "That is a wonderful musical question. Remember the PIANIST core principle: first hear the sound in your mind, identify the interval shape on the keys, and keep your wrists fluid and relaxed.";
      let sampleNotes: string[] = ['C4', 'E4', 'G4', 'C5'];
      let actionLabel = "Try It on Piano Below";

      const lower = query.toLowerCase();
      if (lower.includes('c to f') || lower.includes('chord transition')) {
        replyText = "The secret is the anchor note C! Keep your thumb grounded on C while fingers 3 & 5 step up to F & A. Let's hear how smooth this sounds.";
        sampleNotes = ['C4', 'E4', 'G4', 'C4', 'F4', 'A4'];
        actionLabel = "Practice C → F Transition";
      } else if (lower.includes('memoriz')) {
        replyText = "Memorize by harmonic landmarks: learn the bass progression first, then the melody contours. Try playing the piece with eyes closed for one measure at a time!";
      } else if (lower.includes('by ear')) {
        replyText = "To play by ear: 1. Sing the first note out loud. 2. Test Middle C on the keys. 3. Is the mystery note higher or lower? Step toward it until the pitches blend in unison!";
        sampleNotes = ['C4', 'D4', 'E4'];
        actionLabel = "Launch Listen → Find → Play";
      }

      const coachReply: CoachMessage = {
        id: `c-${Date.now()}`,
        sender: 'coach',
        text: replyText,
        notesToAudition: sampleNotes,
        actionPrompt: actionLabel,
      };

      setMessages(prev => [...prev, coachReply]);
    }, 600);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-800">
        <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
          <Bot className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            Pianist Coach: AI Music Pedagogy
          </h2>
          <p className="text-xs text-slate-400">
            Musically accurate • Encouraging • Grounded in established music theory & technique
          </p>
        </div>
      </div>

      {/* Preset Topic Quick Chips */}
      <div className="mb-4">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
          Frequently Asked Master Questions:
        </span>
        <div className="flex flex-wrap gap-2">
          {PRESET_TOPICS.map((topic) => (
            <button
              key={topic.q}
              type="button"
              onClick={() => handleSendMessage(topic.q)}
              className="text-xs px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 transition text-left"
            >
              {topic.q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Thread */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-5 h-[340px] overflow-y-auto space-y-4 mb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xl rounded-2xl p-4 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold mb-1">
                {msg.sender === 'coach' ? (
                  <>
                    <Bot className="w-3.5 h-3.5 text-teal-400" />
                    <span className="text-teal-400">Pianist Coach</span>
                  </>
                ) : (
                  <span>You</span>
                )}
              </div>
              <p>{msg.text}</p>

              {/* Musical Audition & Action Button */}
              {msg.notesToAudition && (
                <div className="mt-3 pt-3 border-t border-slate-800 flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => pianoAudio.playArpeggio(msg.notesToAudition || [], 220)}
                    className="px-2.5 py-1 rounded-lg bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 border border-teal-500/30 font-semibold flex items-center gap-1.5 transition"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Audition Example</span>
                  </button>
                  {msg.actionPrompt && (
                    <span className="text-[11px] font-mono text-slate-400">
                      → TRY IT NOW on piano below
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask Pianist Coach (e.g., 'How to balance dynamic volume between both hands?')"
          className="flex-1 px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
        />
        <button
          type="button"
          onClick={() => handleSendMessage()}
          className="px-4 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl font-bold text-xs transition flex items-center space-x-1.5 shadow-md"
        >
          <span>Ask</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
