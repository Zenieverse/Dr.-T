import React from 'react';
import { Heart, ExternalLink, Shield, Sparkles, Globe } from 'lucide-react';
import { streetVendorsTranslations } from './translations';

interface StreetVendorsFooterProps {
  lang: 'vi' | 'en';
}

export const StreetVendorsFooter: React.FC<StreetVendorsFooterProps> = ({ lang }) => {
  const t = streetVendorsTranslations[lang];

  return (
    <footer className="mt-14 border-t border-stone-200/80 bg-stone-50/80 rounded-2xl p-6 sm:p-8 text-stone-700">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Core Non-commercial citation banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-amber-100/60 border border-amber-300/70">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
              <h4 className="font-bold text-stone-900 text-sm tracking-tight">
                {t.footnoteTitle}
              </h4>
            </div>
            <p className="text-xs font-semibold text-amber-950">
              {t.footnoteSource}
            </p>
          </div>

          <a
            href="https://ganhmuusinh.vn/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 text-xs font-medium transition-colors shrink-0 shadow-xs"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.visitOriginalSite}</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
        </div>

        {/* Detailed Non-commercial declaration & ethical notice */}
        <div className="space-y-2 text-xs text-stone-600 leading-relaxed">
          <p className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>{lang === 'vi' ? 'Cam kết phi thương mại:' : 'Non-commercial pledge:'}</strong>{' '}
              {t.footnoteNonCommercial}
            </span>
          </p>
          <p className="flex items-start gap-2 text-stone-500">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>{t.footnoteDisclaimer}</span>
          </p>
        </div>

        {/* Footnote bottom signature */}
        <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-2xs text-stone-500">
          <div className="flex items-center gap-2">
            <span>StreetVendorsMap × Gánh Mưu Sinh</span>
            <span aria-hidden="true">·</span>
            <span>Dr. T Platform</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-semibold">100% Free Community Project</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span>Made with</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" />
            <span>for Vietnamese street artisans</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
