import { VibeConfig, VoiceChoice } from './types';

export const VIBES: VibeConfig[] = [
  {
    id: 'empathetic',
    name: 'Maternal Comfort',
    description: 'Deeply caring, unconditionally loving, comforting, and kind. Dynamic emotional safety from a warm mommy figure.',
    colorClass: 'text-rose-600 border-rose-200 hover:border-rose-300 bg-rose-50/80 shadow-sm rim-rose-500/30',
    bgGradient: 'from-pink-150 via-rose-50 to-stone-50',
    tagline: '“Ngoan nè, có mẹ ở đây rồi. Tell me everything, sweet child.”'
  },
  {
    id: 'witty',
    name: 'Witty Mommy',
    description: 'Playful banter, nice teasings, and quick-witted maternal humor to make you laugh and smile.',
    colorClass: 'text-amber-700 border-amber-200 hover:border-amber-300 bg-amber-50/80 shadow-sm rim-amber-500/30',
    bgGradient: 'from-amber-100 via-yellow-50 to-stone-50',
    tagline: '“Let’s tease life’s absurdities together—with logic, sweet laughs, and a warm hug.”'
  },
  {
    id: 'philosophical',
    name: 'Wise Maternal Zen',
    description: 'Calm, expansive, teachable, and deep. Mommy’s guidance blending literature, Socratic dialogue, and eastern peace.',
    colorClass: 'text-indigo-600 border-indigo-200 hover:border-indigo-300 bg-indigo-50/80 shadow-sm rim-indigo-500/30',
    bgGradient: 'from-indigo-100 via-sky-50 to-stone-50',
    tagline: '“Every storm is just a ripple in the sea of life, dear. Let wisdom carry you.”'
  },
  {
    id: 'playful',
    name: 'Nice Playful Helper',
    description: 'Energetic, charming, and highly interactive. Ready to play along, trigger roleplay, or spark dreams with you.',
    colorClass: 'text-purple-600 border-purple-200 hover:border-purple-300 bg-purple-50/80 shadow-sm rim-purple-500/30',
    bgGradient: 'from-purple-100 via-fuchsia-50 to-stone-50',
    tagline: '“No topic is too strange! Let’s explore, create, and have absolute fun together.”'
  },
];

export const VOICES: VoiceChoice[] = [
  {
    id: 'Kore',
    name: 'Dr. Kore (Female)',
    gender: 'female',
    description: 'Gentle, soothing, extremely warm, maternal speech',
    accent: 'English / Multilingual sweet'
  },
  {
    id: 'Fenrir',
    name: 'Dr. Fenrir (Female)',
    gender: 'female',
    description: 'Intelligent, charming, kind, and highly engaging mommy tone',
    accent: 'Clever / Modern tone'
  },
  {
    id: 'Zephyr',
    name: 'Dr. Zephyr (Male)',
    gender: 'male',
    description: 'Warm, calm, and highly comforting tone',
    accent: 'Vietnamese / English neutral'
  },
  {
    id: 'Puck',
    name: 'Dr. Puck (Male)',
    gender: 'male',
    description: 'Expressive, friendly, and lively conversationalist',
    accent: 'Witty / French fluid'
  },
  {
    id: 'Charon',
    name: 'Dr. Charon (Male)',
    gender: 'male',
    description: 'Deep, serene, and authoritative resonance',
    accent: 'Deep English / French'
  },
];

export const LANGUAGES = [
  { code: 'auto', name: '🌐 Auto-Detect', flag: '🏳️' },
  { code: 'Vietnamese', name: '🇻🇳 Tiếng Việt', flag: '🇻🇳' },
  { code: 'English', name: '🇺🇸 English', flag: '🇺🇸' },
  { code: 'French', name: '🇫🇷 Français', flag: '🇫🇷' },
  { code: 'Spanish', name: '🇪🇸 Español', flag: '🇪🇸' },
  { code: 'German', name: '🇩🇪 Deutsch', flag: '🇩🇪' },
];

export const PRESETS = [
  {
    title: 'Comfort Me',
    text: 'I had an incredibly stressful day, and everything feels overwhelming right now. Can I just vent to you?',
    icon: '🌸',
    vibe: 'empathetic' as const,
  },
  {
    title: 'Witty Debate',
    text: 'Challenge me with a witty paradox about human nature, or critique artificial romance!',
    icon: '⚡',
    vibe: 'witty' as const,
  },
  {
    title: 'Philosophy Spark',
    text: 'What did Albert Camus mean by finding happiness in the absurd, and how does it apply to my life?',
    icon: '📚',
    vibe: 'philosophical' as const,
  },
  {
    title: 'Playful Escapade',
    text: 'Let’s play an interactive roleplay text adventure in a quiet, mysterious train station.',
    icon: '🎭',
    vibe: 'playful' as const,
  },
];
