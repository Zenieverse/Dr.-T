import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Plus, CheckCircle2, ListFilter, Calendar } from 'lucide-react';
import { MemoryNode } from '../types';

interface DiagnosticsDeclaratorProps {
  key?: string;
  personalLandmarks: MemoryNode[];
  onAddMemoryNode?: (node: MemoryNode) => void;
}

export function DiagnosticsDeclarator({
  personalLandmarks,
  onAddMemoryNode
}: DiagnosticsDeclaratorProps) {
  const [landmarkTitle, setLandmarkTitle] = useState('');
  const [landmarkDesc, setLandmarkDesc] = useState('');
  const [landmarkSuccess, setLandmarkSuccess] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!landmarkTitle.trim() || !landmarkDesc.trim()) return;

    if (onAddMemoryNode) {
      const x = Math.floor(Math.random() * 60) + 20;
      const y = Math.floor(Math.random() * 50) + 25;

      const newNode: MemoryNode = {
        id: 'mem-' + Date.now(),
        label: landmarkTitle,
        category: 'landmark',
        description: landmarkDesc,
        connections: [],
        x,
        y
      };

      onAddMemoryNode(newNode);
      setLandmarkSuccess(`🗺️ "${landmarkTitle}" successfully integrated into your Life-Graph Semantic Repository.`);
      setLandmarkTitle('');
      setLandmarkDesc('');

      setTimeout(() => setLandmarkSuccess(null), 4000);
    } else {
      alert('Memory network synchronization is offline. Please bind the semantic graph.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="grid grid-cols-1 md:grid-cols-12 gap-6"
      id="diagnostics-declarator-container"
    >
      {/* Form Card (5 columns) */}
      <div className="md:col-span-5 bg-white border border-stone-200/60 p-6 md:p-8 rounded-3xl shadow-xs flex flex-col gap-5">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-rose-500" /> Landmark Declarator
          </span>
          <h4 className="font-bold text-stone-850 text-base mt-2">Declare Major Life Milestones</h4>
          <p className="text-[11px] text-stone-400 leading-relaxed mt-1">
            Publish custom milestones, achievements, or events directly. They are instantly saved with full semantic alignment inside your brain repository.
          </p>
        </div>

        {landmarkSuccess && (
          <div className="p-3 bg-pink-50 border border-pink-100 text-[10.5px] text-pink-700 rounded-xl leading-relaxed font-semibold">
            {landmarkSuccess}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-stone-400 uppercase font-mono">Milestone Title</label>
            <input
              type="text"
              required
              value={landmarkTitle}
              onChange={(e) => setLandmarkTitle(e.target.value)}
              placeholder="e.g., Completed Spanish 30-Day Drill"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-700 outline-none focus:border-rose-400 focus:bg-white text-[11px] font-sans"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-stone-400 uppercase font-mono">Key Details &amp; Summary</label>
            <textarea
              required
              value={landmarkDesc}
              onChange={(e) => setLandmarkDesc(e.target.value)}
              placeholder="e.g., Practiced Castilian Spanish mode under full simulation, scored 94.2% competency."
              rows={4}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-700 outline-none focus:border-rose-400 focus:bg-white resize-none text-[11px] font-sans"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-stone-900 hover:bg-rose-600 text-white font-black rounded-xl text-xs uppercase font-mono tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Publish to Life-Graph &amp; Milestones
          </button>
        </form>
      </div>

      {/* History Log Column (7 columns) */}
      <div className="md:col-span-7 bg-stone-50 border border-stone-150 p-6 md:p-8 rounded-3xl flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            <ListFilter className="w-4 h-4" /> Registered Milestones Inventory
          </span>
          <span className="text-[9px] font-bold font-mono text-pink-700 bg-pink-100/50 px-2 py-0.5 rounded border border-pink-200">
            {personalLandmarks.length} Total Registered
          </span>
        </div>

        <div className="flex-1 overflow-y-auto max-h-[380px] space-y-3.5 scrollbar-thin">
          {personalLandmarks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[220px] text-center text-stone-400 gap-2">
              <Calendar className="w-8 h-8 text-stone-300 animate-pulse" />
              <p className="text-xs font-bold text-stone-600">No Custom Milestones Logged</p>
              <p className="text-[10px] text-stone-400 max-w-xs leading-relaxed">
                Your declared milestones will appear here in chronological order once you publish them.
              </p>
            </div>
          ) : (
            personalLandmarks.map((mark) => (
              <div
                key={mark.id}
                className="p-4 bg-white border border-stone-200/60 rounded-2xl flex items-start gap-3.5 shadow-xs"
              >
                <div className="w-10 h-10 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-pink-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1.5">
                    <h5 className="text-xs font-bold text-stone-850 leading-tight truncate">{mark.label}</h5>
                    <span className="text-[8px] font-mono text-stone-400 font-bold">L-GRAPH SYNCED</span>
                  </div>
                  <p className="text-[10.5px] text-stone-500 leading-relaxed mt-1.5 font-medium">
                    {mark.description}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
