import React from 'react';
import {
  BookOpen,
  Briefcase,
  Compass,
  FlaskConical,
  Globe,
  GraduationCap,
  Heart,
  Hospital,
  Layers,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
} from 'lucide-react';
import { HatBridgeColorToken, HatBridgePrivacyLevel } from '../../types/hatbridgeTypes';

export const HATBRIDGE_ICON_OPTIONS = [
  'Hospital',
  'Stethoscope',
  'GraduationCap',
  'Heart',
  'Users',
  'Sparkles',
  'Globe',
  'FlaskConical',
  'BookOpen',
  'ShieldCheck',
  'Layers',
  'Briefcase',
  'Compass',
] as const;

export const COLOR_STYLES: Record<
  HatBridgeColorToken,
  { accentBg: string; softBg: string; border: string; text: string }
> = {
  teal: { accentBg: 'bg-teal-700', softBg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-800' },
  indigo: { accentBg: 'bg-indigo-700', softBg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-800' },
  amber: { accentBg: 'bg-amber-700', softBg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-900' },
  rose: { accentBg: 'bg-rose-700', softBg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-800' },
  emerald: { accentBg: 'bg-emerald-700', softBg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800' },
  sky: { accentBg: 'bg-sky-700', softBg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-800' },
  slate: { accentBg: 'bg-slate-800', softBg: 'bg-slate-100', border: 'border-slate-300', text: 'text-slate-800' },
  violet: { accentBg: 'bg-violet-700', softBg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-800' },
};

export function renderHatIcon(iconName: string, className = 'w-4 h-4') {
  switch (iconName) {
    case 'Hospital':
      return <Hospital className={className} />;
    case 'Stethoscope':
      return <Stethoscope className={className} />;
    case 'GraduationCap':
      return <GraduationCap className={className} />;
    case 'Heart':
      return <Heart className={className} />;
    case 'Users':
      return <Users className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'Globe':
      return <Globe className={className} />;
    case 'FlaskConical':
      return <FlaskConical className={className} />;
    case 'BookOpen':
      return <BookOpen className={className} />;
    case 'ShieldCheck':
      return <ShieldCheck className={className} />;
    case 'Layers':
      return <Layers className={className} />;
    case 'Briefcase':
      return <Briefcase className={className} />;
    default:
      return <Compass className={className} />;
  }
}

export function formatPrivacyLabel(level: HatBridgePrivacyLevel): string {
  switch (level) {
    case 'private_personal':
      return 'Private Personal Vault';
    case 'work_restricted':
      return 'Restricted Workplace';
    case 'work_team':
      return 'Workplace Team';
  }
}
