// ==========================================
// HEDERA COMMONS: NetworkActivity COMPONENT
// ==========================================

import React, { useState, useEffect } from 'react';
import { X, Network, ExternalLink, RefreshCw, Radio, Hash } from 'lucide-react';
import { HederaActivityItem } from '../types/hedera';
import { HederaClientApi } from '../../../services/hederaClientApi';

interface NetworkActivityProps {
  isOpen: boolean;
  onClose: () => void;
  topicId?: string;
}

export const NetworkActivity: React.FC<NetworkActivityProps> = ({
  isOpen,
  onClose,
  topicId = '0.0.5892147'
}) => {
  const [activity, setActivity] = useState<HederaActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchActivity = async () => {
    setIsLoading(true);
    try {
      const data = await HederaClientApi.getActivity();
      setActivity(data.activity || []);
    } catch (err) {
      console.warn('Failed to load activity:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchActivity();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform animate-in slide-in-from-right duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-400">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight flex items-center space-x-2">
                <span>Hedera Consensus Activity</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </h2>
              <p className="text-[11px] text-slate-300 font-mono">
                Topic ID: {topicId}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={fetchActivity}
              disabled={isLoading}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition disabled:opacity-50"
              title="Refresh feed"
              aria-label="Refresh feed"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Indicator */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <span className="flex items-center space-x-1.5 font-bold text-slate-800">
            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>HCS Message Stream</span>
          </span>
          <span className="font-mono text-[10px] text-slate-500">
            {activity.length} Consensus Events
          </span>
        </div>

        {/* Activity Stream */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {activity.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Network className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs">No recent HCS topic activity recorded.</p>
            </div>
          ) : (
            activity.map((item) => (
              <div 
                key={item.id} 
                className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white transition space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 truncate max-w-[220px]">
                    {item.artifactTitle}
                  </span>
                  <span className="font-mono text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                    Seq #{item.sequenceNumber}
                  </span>
                </div>

                <div className="font-mono text-[10px] text-slate-500 space-y-0.5">
                  <div className="truncate">Artifact: {item.artifactId}</div>
                  <div className="truncate">Timestamp: {item.consensusTimestamp}</div>
                  <div className="truncate text-slate-400">Digest: {item.contentHash.slice(0, 16)}...</div>
                </div>

                <div className="pt-1 flex items-center justify-between text-[10px] border-t border-slate-200/60">
                  <span className="px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 border border-purple-200 font-bold uppercase">
                    {item.privacyClassification}
                  </span>

                  {item.hashscanUrl ? (
                    <a
                      href={item.hashscanUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-700 font-bold flex items-center space-x-1"
                    >
                      <span>Hashscan</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-slate-400 italic">Dev Sandbox</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
          >
            Close Feed
          </button>
        </div>
      </div>
    </div>
  );
};
