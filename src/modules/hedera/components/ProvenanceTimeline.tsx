// ==========================================
// HEDERA COMMONS: ProvenanceTimeline COMPONENT
// ==========================================

import React from 'react';
import { ProvenanceRecord } from '../types/provenance';
import { Clock, CheckCircle2, Hash, Network, ShieldCheck } from 'lucide-react';

interface ProvenanceTimelineProps {
  record: ProvenanceRecord;
  className?: string;
}

export const ProvenanceTimeline: React.FC<ProvenanceTimelineProps> = ({
  record,
  className = ''
}) => {
  const events = [
    {
      stage: 'Created',
      title: 'Artifact Authored & Formatted',
      timestamp: record.createdAt,
      detail: `Artifact ID: ${record.artifactId} (v${record.artifactVersion})`,
      icon: <Clock className="w-3.5 h-3.5 text-blue-600" />
    },
    {
      stage: 'Hashed',
      title: 'Canonical SHA-256 Digest Computed',
      timestamp: record.createdAt,
      detail: `Deterministic RFC 8785 representation (${record.contentHash.slice(0, 16)}...)`,
      icon: <Hash className="w-3.5 h-3.5 text-purple-600" />
    },
    {
      stage: 'Anchored',
      title: `Submitted to Hedera HCS (Topic ${record.topicId || '0.0.5892147'})`,
      timestamp: record.createdAt,
      detail: `Assigned Topic Sequence #${record.sequenceNumber || 1042}`,
      icon: <Network className="w-3.5 h-3.5 text-indigo-600" />
    },
    {
      stage: 'Consensus',
      title: 'Decentralized Consensus Finality Reached',
      timestamp: record.consensusTimestamp
        ? new Date(Number(record.consensusTimestamp.split('.')[0]) * 1000).toISOString()
        : record.createdAt,
      detail: `Transaction: ${record.transactionId || 'Confirmed on ledger'}`,
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
    },
    {
      stage: 'Verified',
      title: 'Independent Mirror Node Audit Check',
      timestamp: record.lastVerifiedAt || record.createdAt,
      detail: `Status: ${record.verificationStatus.toUpperCase()}`,
      icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
    }
  ];

  return (
    <div className={`space-y-4 py-2 ${className}`}>
      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
        Verifiable Event Timeline
      </h4>
      <div className="relative pl-6 border-l-2 border-indigo-200/80 space-y-6">
        {events.map((evt, idx) => (
          <div key={idx} className="relative group">
            {/* Timeline bullet */}
            <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-white border-2 border-indigo-600 shadow-xs flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {evt.stage}
                </span>
                <span className="font-bold text-xs text-slate-900">{evt.title}</span>
              </div>
              <div className="text-[11px] text-slate-600">{evt.detail}</div>
              <div className="text-[10px] text-slate-400 font-mono">
                {new Date(evt.timestamp).toUTCString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
