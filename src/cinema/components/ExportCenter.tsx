// =========================================================================
// DR. T CINEMA — EXPORT CENTER COMPONENT
// Director package, evidence package, SRT/VTT subtitles, and social bundles
// =========================================================================

import React, { useState } from 'react';
import { CinemaProject } from '../types';
import { 
  generateDirectorPackageMarkdown, 
  generateEvidencePackageJson, 
  generateSrtSubtitles, 
  generateVttSubtitles, 
  generateTranscriptText, 
  generateSocialCopyPackage 
} from '../services/export';
import { 
  Download, 
  FileText, 
  Database, 
  Share2, 
  Check, 
  Copy, 
  Video, 
  FileCode2, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface ExportCenterProps {
  project: CinemaProject;
}

export const ExportCenter: React.FC<ExportCenterProps> = ({ project }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const socialBundles = generateSocialCopyPackage(project);

  const handleDownload = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 text-slate-200">
      {/* Top Header */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">Export & Distribution Center</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Production-ready director packages, peer-reviewed evidence ledgers, accessible subtitles, and social channels.
          </p>
        </div>
      </div>

      {/* Primary Export Packages Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Director Package */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 mb-2">
              <FileText className="w-5 h-5" />
              <h3 className="font-bold text-white text-base">Director Package</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Complete production master including creative brief, logline, formatted screenplay, shot list, and 2-day shooting schedule.
            </p>
          </div>

          <button
            onClick={() => handleDownload(
              generateDirectorPackageMarkdown(project),
              `${project.title.toLowerCase().replace(/\s+/g, '-')}-director-package.md`,
              'text/markdown'
            )}
            className="w-full py-2.5 px-4 rounded-xl font-medium text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center gap-2 font-bold shadow-md transition-colors"
          >
            <Download className="w-4 h-4" /> Download Director Package (.MD)
          </button>
        </div>

        {/* Evidence Package */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-sky-400 mb-2">
              <Database className="w-5 h-5" />
              <h3 className="font-bold text-white text-base">Evidence Package</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              JSON data ledger containing all peer-reviewed sources, extracted claims, credibility ratings, and line-by-line provenance mappings.
            </p>
          </div>

          <button
            onClick={() => handleDownload(
              generateEvidencePackageJson(project),
              `${project.title.toLowerCase().replace(/\s+/g, '-')}-evidence-package.json`,
              'application/json'
            )}
            className="w-full py-2.5 px-4 rounded-xl font-medium text-xs bg-sky-500 hover:bg-sky-400 text-slate-950 flex items-center justify-center gap-2 font-bold shadow-md transition-colors"
          >
            <Download className="w-4 h-4" /> Download Evidence Package (.JSON)
          </button>
        </div>

        {/* Accessibility Subtitles */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 mb-2">
              <FileCode2 className="w-5 h-5" />
              <h3 className="font-bold text-white text-base">Subtitles & Captions</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Timecoded accessibility subtitles compliant with digital streaming and educational broadcast requirements.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDownload(
                generateSrtSubtitles(project),
                `${project.title.toLowerCase().replace(/\s+/g, '-')}.srt`,
                'text/plain'
              )}
              className="py-2 px-3 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> SRT
            </button>
            <button
              onClick={() => handleDownload(
                generateVttSubtitles(project),
                `${project.title.toLowerCase().replace(/\s+/g, '-')}.vtt`,
                'text/vtt'
              )}
              className="py-2 px-3 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> VTT
            </button>
          </div>
        </div>
      </div>

      {/* Social Distribution Packages */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Share2 className="w-4 h-4 text-purple-400" />
          Multi-Platform Social Distribution Packages ({socialBundles.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {socialBundles.map((pkg, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-mono font-bold text-purple-400">
                    {pkg.platform}
                  </span>
                  <span className="text-slate-500 font-mono text-[10px]">
                    {pkg.recommendedDuration}
                  </span>
                </div>

                <div className="font-semibold text-white text-xs mb-2">
                  {pkg.title}
                </div>

                <p className="text-xs text-slate-400 line-clamp-3 bg-slate-950 p-2 rounded border border-slate-800/80 italic font-serif">
                  {pkg.description}
                </p>

                <div className="mt-2 text-[11px] font-mono text-amber-400">
                  Thumbnail Hook: "{pkg.thumbnailHook}"
                </div>
              </div>

              <button
                onClick={() => handleCopy(`${pkg.title}\n\n${pkg.description}`, `pkg-${idx}`)}
                className="w-full py-1.5 px-3 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                {copiedId === `pkg-${idx}` ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied Copy
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Title & Description
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
