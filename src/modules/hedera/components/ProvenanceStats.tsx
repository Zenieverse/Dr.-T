// ==========================================
// HEDERA COMMONS: ProvenanceStats COMPONENT
// ==========================================

import React from 'react';
import { 
  ShieldCheck, 
  FileText, 
  Trees, 
  Cpu, 
  Globe, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';

interface ProvenanceStatsProps {
  stats: {
    totalRecords?: number;
    verifiedRecords?: number;
    researchArtifacts?: number;
    knowledgeRecords?: number;
    aiArtifacts?: number;
    ecologicalRecords?: number;
    lastVerificationTimestamp?: string | null;
  };
  className?: string;
}

export const ProvenanceStats: React.FC<ProvenanceStatsProps> = ({
  stats,
  className = ''
}) => {
  const cards = [
    {
      label: 'Provenance Records',
      value: stats.totalRecords ?? 0,
      subtext: `${stats.verifiedRecords ?? 0} Verified`,
      icon: <ShieldCheck className="w-4 h-4 text-purple-600" />,
      subIcon: <CheckCircle2 className="w-3 h-3 text-emerald-600" />
    },
    {
      label: 'Knowledge Records',
      value: stats.knowledgeRecords ?? 0,
      subtext: 'Trib-House Manuscripts',
      icon: <Trees className="w-4 h-4 text-emerald-600" />
    },
    {
      label: 'AI Artifacts',
      value: stats.aiArtifacts ?? 0,
      subtext: 'Models & SWE Benchmarks',
      icon: <Cpu className="w-4 h-4 text-indigo-600" />
    },
    {
      label: 'Research Artifacts',
      value: stats.researchArtifacts ?? 0,
      subtext: 'Studies & Clinical Trials',
      icon: <FileText className="w-4 h-4 text-blue-600" />
    },
    {
      label: 'Ecological Records',
      value: stats.ecologicalRecords ?? 0,
      subtext: 'GreenieVerse Canopy Data',
      icon: <Globe className="w-4 h-4 text-teal-600" />
    },
    {
      label: 'Last Verification',
      value: stats.lastVerificationTimestamp 
        ? new Date(stats.lastVerificationTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : 'Active',
      subtext: stats.lastVerificationTimestamp
        ? new Date(stats.lastVerificationTimestamp).toLocaleDateString()
        : 'Continuous Audit',
      icon: <Clock className="w-4 h-4 text-amber-600" />
    }
  ];

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 ${className}`}>
      {cards.map((c, idx) => (
        <div 
          key={idx} 
          className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1 hover:shadow-xs transition"
        >
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span className="truncate">{c.label}</span>
            {c.icon}
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">{c.value}</div>
          <div className="text-[10px] text-slate-500 font-medium flex items-center space-x-1 truncate">
            {c.subIcon}
            <span>{c.subtext}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
