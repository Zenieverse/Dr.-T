import React, { useState } from 'react';
import { Award, CheckCircle2, Download, Printer, X, Sparkles, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface VirtuosoDiplomaModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultName?: string;
}

export const VirtuosoDiplomaModal: React.FC<VirtuosoDiplomaModalProps> = ({
  isOpen,
  onClose,
  defaultName = 'Pianist Virtuoso'
}) => {
  const [recipientName, setRecipientName] = useState<string>(defaultName);
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  if (!isOpen) return null;

  const handlePrint = () => {
    confetti({ particleCount: 40, spread: 60 });
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="relative max-w-3xl w-full my-8">
        
        {/* Floating Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 w-9 h-9 rounded-full bg-stone-900 border border-amber-500/40 text-stone-300 hover:text-white flex items-center justify-center transition shadow-xl cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* The Ornate Diploma Card */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-stone-950 via-amber-950/20 to-stone-950 border-4 border-amber-600/70 shadow-2xl relative overflow-hidden text-center space-y-6">
          
          {/* Ornate Inner Double Border */}
          <div className="absolute inset-3 border-2 border-amber-500/30 rounded-2xl pointer-events-none" />
          <div className="absolute inset-5 border border-amber-500/20 rounded-xl pointer-events-none" />

          {/* Top Classical Header & Seal */}
          <div className="space-y-2 relative z-10">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-amber-700 p-0.5 shadow-xl flex items-center justify-center">
              <div className="w-full h-full bg-stone-950 rounded-full flex items-center justify-center text-amber-300">
                <Trophy className="w-8 h-8" />
              </div>
            </div>

            <div className="text-[11px] font-mono tracking-widest text-amber-400 uppercase font-black">
              Dr. T Piano Pedagogy Institute • Touch Grass Acoustic Conservatory
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300">
              Concert Grand Virtuoso Diploma
            </h1>

            <p className="text-xs font-serif italic text-amber-200/80 max-w-lg mx-auto">
              In recognition of demonstrated excellence in acoustic piano theory, tactile keyboard geography, Grand Staff sight-reading, and the performance of whole classical masterworks.
            </p>
          </div>

          {/* Recipient Name Field */}
          <div className="space-y-1 relative z-10 py-2">
            <div className="text-[10px] font-mono uppercase text-stone-400 tracking-wider">
              This Diploma is Proudly Conferred Upon:
            </div>
            <div className="max-w-md mx-auto">
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full text-center text-2xl sm:text-3xl font-serif font-bold text-amber-100 border-b-2 border-amber-500/60 bg-transparent focus:outline-hidden py-1 tracking-wide"
                placeholder="Enter Your Name"
              />
            </div>
          </div>

          {/* Curriculum Mastered Checklist */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-left relative z-10 max-w-xl mx-auto pt-2">
            {[
              'Keyboard Geography',
              'Grand Staff Notation',
              'Rhythm & Metronome Lock',
              'Alberti Bass Chords',
              'Für Elise (Beethoven)',
              'Prelude in C (Bach)',
              'Canon in D (Pachelbel)',
              'Moonlight Sonata (Beethoven)'
            ].map((skill, idx) => (
              <div key={idx} className="flex items-center space-x-1.5 text-[10px] font-mono text-stone-300 bg-stone-900/60 p-2 rounded-lg border border-amber-900/30">
                <CheckCircle2 className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="truncate">{skill}</span>
              </div>
            ))}
          </div>

          {/* Date & Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-6 border-t border-amber-900/40 relative z-10 max-w-lg mx-auto text-xs font-serif text-stone-300">
            <div>
              <div className="font-mono text-[10px] text-stone-500 uppercase">Conferment Date</div>
              <div className="font-bold text-amber-200 mt-1">{currentDate}</div>
            </div>
            <div>
              <div className="font-mono text-[10px] text-stone-500 uppercase">Academy Chancellor</div>
              <div className="font-bold text-amber-200 mt-1 italic">Dr. T, Master of Keyboard Arts</div>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 relative z-10 print:hidden">
            <button
              type="button"
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs transition flex items-center space-x-2 shadow-lg cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save Official Diploma</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs font-bold transition border border-stone-800 cursor-pointer"
            >
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
