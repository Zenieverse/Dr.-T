// =========================================================================
// DR. T CINEMA — PRODUCTION TEMPLATES & VISUAL STYLE ENGINES
// =========================================================================

import { VisualStyleKey } from '../types';

export interface ProductionFormatTemplate {
  id: string;
  name: string;
  durationSeconds: number;
  description: string;
  defaultVisual: VisualStyleKey;
  recommendedAudience: string;
  suggestedPrompt: string;
}

export const PRODUCTION_TEMPLATES: ProductionFormatTemplate[] = [
  {
    id: 'template-90s-explainer',
    name: '90-Second Cinematic Explainer',
    durationSeconds: 90,
    description: 'Brisk, deeply engaging educational journey connecting everyday symptoms to molecular biology with pristine pacing.',
    defaultVisual: 'Humanist',
    recommendedAudience: 'General public, digital learners, curious patients',
    suggestedPrompt: 'Create a 90-second cinematic educational video explaining iron deficiency, fatigue, and why someone may feel physically weak.'
  },
  {
    id: 'template-3m-doc',
    name: '3-Minute Mini-Documentary',
    durationSeconds: 180,
    description: 'Investigative narrative uncovering medical mysteries, diagnostic puzzles, and human resilience.',
    defaultVisual: 'Documentary',
    recommendedAudience: 'Science communicators, health advocates, documentary audiences',
    suggestedPrompt: 'A 3-minute mini-documentary exploring circadian rhythm disruption and how nocturnal blue light reshapes human endocrine balance.'
  },
  {
    id: 'template-60s-social',
    name: '60-Second Social Micro-Doc',
    durationSeconds: 60,
    description: 'High-retention visual hook and fast evidence breakdown optimized for YouTube Shorts, Reels, and TikTok.',
    defaultVisual: 'Editorial',
    recommendedAudience: 'Mobile social viewers, younger adults, wellness communities',
    suggestedPrompt: 'A punchy 60-second micro-doc on why morning sunlight halts melatonin and jumpstarts cortisol.'
  },
  {
    id: 'template-clinical-case',
    name: '2-Minute Clinical Grand Rounds',
    durationSeconds: 120,
    description: 'Physician-grade pathophysiology breakdown with anatomical accuracy and clinical decision algorithms.',
    defaultVisual: 'Clinical',
    recommendedAudience: 'Medical students, clinicians, nursing professionals',
    suggestedPrompt: 'A 2-minute clinical review of subclinical hypothyroidism versus non-thyroidal illness syndrome.'
  },
  {
    id: 'template-psa-health',
    name: 'Public Health Impact Film',
    durationSeconds: 90,
    description: 'Empathetic, community-centered public service announcement addressing common health disparities.',
    defaultVisual: 'Nature',
    recommendedAudience: 'Public health agencies, community clinics, diverse populations',
    suggestedPrompt: 'A 90-second public health film on maternal iron health and equitable access to nutritional screening.'
  }
];

export interface VisualStyleConfig {
  key: VisualStyleKey;
  name: string;
  description: string;
  colorPalette: string[];
  lensProfile: string;
  cameraMovement: string;
  lightingStyle: string;
  badgeColor: string;
}

export const VISUAL_STYLE_REGISTRY: Record<VisualStyleKey, VisualStyleConfig> = {
  Documentary: {
    key: 'Documentary',
    name: 'Documentary Realism',
    description: 'Naturalistic, observational, authentic handheld motion with tactile film texture and real-world natural daylight.',
    colorPalette: ['#2A2E33', '#8C9A9E', '#C2B8A3', '#EAE6DF'],
    lensProfile: 'Cooke S4/i Prime lenses, gentle rolloff, organic flares',
    cameraMovement: 'Observational handheld, slow natural panning, organic breathing',
    lightingStyle: 'Available ambient daylight, soft diffused window bounce',
    badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30'
  },
  Clinical: {
    key: 'Clinical',
    name: 'Clinical Precision',
    description: 'Pristine, clean, scientifically sterile aesthetic with high-contrast diagrams and crisp architectural lines.',
    colorPalette: ['#0F172A', '#0284C7', '#38BDF8', '#F8FAFC'],
    lensProfile: 'Leitz Summilux-C, ultra-sharp clinical resolution, zero distortion',
    cameraMovement: 'Precision robotic slider, locked tripod, methodical symmetrical tracking',
    lightingStyle: 'High CRI 5600K balanced daylight, shadowless soft overhead key',
    badgeColor: 'bg-sky-500/15 text-sky-300 border-sky-500/30'
  },
  Humanist: {
    key: 'Humanist',
    name: 'Humanist Warmth',
    description: 'Warm, intimate, empathetic portraiture celebrating the human experience with golden-hour warmth and shallow focus.',
    colorPalette: ['#1C1917', '#B45309', '#F59E0B', '#FEF3C7'],
    lensProfile: 'Zeiss Master Anamorphic, rich oval bokeh, warm skin tones',
    cameraMovement: 'Gentle Steadicam forward glides, intimate close-up pushes',
    lightingStyle: 'Warm 2800K Tungsten backlight, golden hour direct sun flares',
    badgeColor: 'bg-orange-500/15 text-orange-300 border-orange-500/30'
  },
  Futuristic: {
    key: 'Futuristic',
    name: 'Futuristic Biotech',
    description: 'Computational, bioluminescent, deep cyan and midnight obsidian visualizing molecular biology in motion.',
    colorPalette: ['#030712', '#06B6D4', '#6366F1', '#E0E7FF'],
    lensProfile: 'Virtual Macro Probe, microscopic perspective, chromatic aberration',
    cameraMovement: 'Dynamic 3D rotational camera sweeps, particle flow alignment',
    lightingStyle: 'Bioluminescent self-illuminating subject glow, volumetric laser haze',
    badgeColor: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
  },
  Nature: {
    key: 'Nature',
    name: 'Organic Biophilic',
    description: 'Calm, grounding botanical atmosphere with deep forest greens, dappled sunlight, and flowing water imagery.',
    colorPalette: ['#052E16', '#15803D', '#4ADE80', '#F0FDF4'],
    lensProfile: 'Angenieux Optimo Zoom, lush optical rendering, soft halation',
    cameraMovement: 'Fluid sweeping drone arcs, peaceful tracking through foliage',
    lightingStyle: 'Dappled sun through tree canopy, morning mist atmosphere',
    badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
  },
  Investigative: {
    key: 'Investigative',
    name: 'Investigative Noir',
    description: 'High contrast, moody chiaroscuro lighting, deep shadows, and evidence-driven focal points.',
    colorPalette: ['#0A0A0A', '#374151', '#9CA3AF', '#F3F4F6'],
    lensProfile: 'Vintage Super Baltar, heavy contrast, sharp falloff',
    cameraMovement: 'Low-angle creeping dolly, slow reveal from behind obstacles',
    lightingStyle: 'Chiaroscuro, harsh single key light, deep silhouettes',
    badgeColor: 'bg-slate-500/15 text-slate-300 border-slate-500/30'
  },
  Editorial: {
    key: 'Editorial',
    name: 'Editorial Magazine',
    description: 'High fashion documentary aesthetic with graphic typography, bold compositional color blocks, and curated styling.',
    colorPalette: ['#18181B', '#E11D48', '#FB7185', '#FFF1F2'],
    lensProfile: 'Hasselblad HC prime, hyper-detailed medium format texture',
    cameraMovement: 'Staccato snap cuts, deliberate graphic framing, locked perspective',
    lightingStyle: 'Large octabank softbox, stylized pop color accents',
    badgeColor: 'bg-rose-500/15 text-rose-300 border-rose-500/30'
  },
  Minimal: {
    key: 'Minimal',
    name: 'Minimalist Studio',
    description: 'Clean Scandinavian aesthetic with negative space, calm neutral backgrounds, and uncluttered storytelling.',
    colorPalette: ['#111827', '#6B7280', '#D1D5DB', '#FFFFFF'],
    lensProfile: 'Canon K35 vintage prime, gentle sharpness, clean focus',
    cameraMovement: 'Slow subtle pans, serene locked off compositions',
    lightingStyle: 'Uniform soft daylight bounce, minimal shadows',
    badgeColor: 'bg-zinc-500/15 text-zinc-300 border-zinc-500/30'
  }
};

export const PRODUCTION_FORMATS = PRODUCTION_TEMPLATES;
