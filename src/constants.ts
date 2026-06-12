import { VibeConfig, VoiceChoice, MemoryNode, SpecialistAgent, MedLog, HealthMetric, SkillNode, TaskItem, CalendarEvent, SmartNote, CarbonHabit } from './types';

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
  { code: 'Japanese', name: '🇯🇵 日本語', flag: '🇯🇵' },
  { code: 'Chinese', name: '🇨🇳 中文', flag: '🇨🇳' },
  { code: 'Korean', name: '🇰🇷 한국어', flag: '🇰🇷' },
  { code: 'Italian', name: '🇮🇹 Italiano', flag: '🇮🇹' },
  { code: 'Russian', name: '🇷🇺 Русский', flag: '🇷🇺' },
  { code: 'Portuguese', name: '🇵🇹 Português', flag: '🇵🇹' },
  { code: 'Arabic', name: '🇸🇦 العربية', flag: '🇸🇦' },
  { code: 'Hindi', name: '🇮🇳 हिन्दी', flag: '🇮🇳' },
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

// INITIAL LIFE GRAPH NODES
export const INITIAL_MEMORY_NODES: MemoryNode[] = [
  { id: 'mem-1', label: 'Daughter Mary', category: 'family', description: 'Allergic to peanuts. Studying intermediate French.', connections: ['mem-3'], x: 25, y: 35 },
  { id: 'mem-2', label: 'Low BP History', category: 'health', description: 'Requires morning warm fluids. Heart rate baseline is 72 bpm.', connections: [], x: 75, y: 25 },
  { id: 'mem-3', label: 'Paris Trip', category: 'landmark', description: 'Planned for Dec 2026. Needs valid passport and basic conversational French drills.', connections: ['mem-1'], x: 50, y: 55 },
  { id: 'mem-4', label: 'Study Goal', category: 'learning', description: 'Aims to master basic biostatistics and organic chemistry queries.', connections: [], x: 20, y: 70 },
  { id: 'mem-5', label: 'Coffee Habit', category: 'preference', description: 'Enjoys decaf flat whites after 2 PM, otherwise disrupts evening sleep cycle.', connections: [], x: 80, y: 65 }
];

// SPECIALIST AGENTS LIST
export const INITIAL_SPECIALIST_AGENTS: SpecialistAgent[] = [
  {
    id: 'medical',
    name: 'Medical Specialist Agent',
    title: 'Symptom Assessment & Coaching',
    avatarIcon: '🩺',
    description: 'Authoritative clinical advisor trained in bio-imaging, medical humanities, and psychological stress coaching.',
    longDescription: 'Collaborates with leading medical institutions to evaluate symptoms, coach chronic condition management, and prepare you with precise, evidence-based questionnaires for your next Doctor appointment.',
    status: 'idle',
    capabilities: ['Symptom checker', 'Medication safety coach', 'Heart rate trend auditor']
  },
  {
    id: 'education',
    name: 'Education Specialist Agent',
    title: 'Adaptive Tutoring & Dialectics',
    avatarIcon: '📚',
    description: 'Interactive adaptive curriculum constructor that drills students across language, literature, and organic chemistry.',
    longDescription: 'Implements customized gamified learning maps and hosts Socratic dialogue assessments. Generates instant personalized curriculums to guide lifelong learners, kids, or career changers.',
    status: 'idle',
    capabilities: ['Adaptive skill trees', 'Socratic evaluations', 'Accent coaching']
  },
  {
    id: 'business',
    name: 'Business Strategy Agent',
    title: 'Project & Operations Advisor',
    avatarIcon: '💼',
    description: 'Elite corporate operational assistant focused on risk checklists, SWOT analysis, and project management flows.',
    longDescription: 'Reviews operations parameters, structures compliance plans, coordinates cross-team deliverables, and drafts summaries of executive reports, making complex business tasks ultra-manageable.',
    status: 'idle',
    capabilities: ['Operational checklists', 'SWOT synthesizer', 'Research mapping']
  },
  {
    id: 'finance',
    name: 'Finance Strategic Advisor',
    title: 'Household Ledger & Savings Plan',
    avatarIcon: '💵',
    description: 'Provides granular family budgeting advice, investment literacy tutorials, and sustainable habits coordination.',
    longDescription: 'Helps structure retirement targets, audits weekly household logs for cost leakages, and runs clean projections mapping investments against long-term travel goals.',
    status: 'idle',
    capabilities: ['Budget leak auditor', 'Retirement planner', 'Credit score literacy']
  },
  {
    id: 'legal',
    name: 'Legal Assistant Agent',
    title: 'Compliance & Document Analysis',
    avatarIcon: '⚖️',
    description: 'Assists in auditing small-business compliance agreements, legal literature translation, and emergency plans.',
    longDescription: 'Ensures standard regulatory clauses are transparent and explained clearly without jargon. Builds customized family emergency checklists and local citizen resource catalogs.',
    status: 'idle',
    capabilities: ['Jargon translator', 'Agreement audit checks', 'Emergency plan structuring']
  },
  {
    id: 'travel',
    name: 'Travel Route Broker',
    title: 'Visa & Cultural Concierge',
    avatarIcon: '✈️',
    description: 'Bespoke travel itinerary router drafting detailed local guides, passport warning alarms, and restaurant suggestions.',
    longDescription: 'Tracks local visa rules, structures efficient multi-city transport trails, recommends authentic off-the-beaten-path cultural spots, and connects directly with municipal local schedules.',
    status: 'idle',
    capabilities: ['Iframe routes planner', 'Visa regulatory checklist', 'Off-site local discovery']
  },
  {
    id: 'government',
    name: 'Citizen Services Agent',
    title: 'Municipal Portal Assistance',
    avatarIcon: '🏛️',
    description: 'Navigates local municipality resource discovery, public aid registrations, and regulatory submittals.',
    longDescription: 'Guides citizens through complex public health filings, local tax registry structures, student aid assistance, and volunteer initiatives, making city portals fully transparent.',
    status: 'idle',
    capabilities: ['Forms submittal prep', 'Townhall resource discoverer', 'Social impact tracks']
  }
];

// INITIAL MEDICATION TRACKERS
export const INITIAL_MED_LIST: MedLog[] = [
  { id: 'med-1', name: 'Amoxicillin Antibiotics', dosage: '500mg, 1 Capsule', time: '08:00 AM', taken: true },
  { id: 'med-2', name: 'Peanut-Free Vitamin D3', dosage: '2000 IU, 1 Drop', time: '12:00 PM', taken: false },
  { id: 'med-3', name: 'Calcium Supplements', dosage: '1000mg, 1 Capsule', time: '06:00 PM', taken: false }
];

// INITIAL HEALTH METRICS
export const INITIAL_HEALTH_METRICS: HealthMetric[] = [
  { id: 'met-1', type: 'Blood Pressure', value: '118/72 mmHg', date: 'Yesterday', status: 'optimal' },
  { id: 'met-2', type: 'Heart Rate', value: '68 bpm', date: 'Yesterday', status: 'optimal' },
  { id: 'met-3', type: 'Sleep', value: '7.8 hours', date: 'Yesterday', status: 'optimal' },
  { id: 'met-4', type: 'Steps', value: '10,432 steps', date: 'Yesterday', status: 'optimal' }
];

// INITIAL EDUCATION SKILLS
export const INITIAL_SKILL_NODES: SkillNode[] = [
  { id: 'skill-1', label: 'Conversational French', category: 'Language', description: 'Introductory Socratic drill focusing on Parisian greetings, ordering decaf espresso, and checking transportation schedules.', level: 1, quizPoints: 120 },
  { id: 'skill-2', label: 'Cardiovascular Anatomy', category: 'Medicine', description: 'Understand basic chambers of the heart, blood pressure bounds, and clinical stress responses.', level: 1, quizPoints: 200 },
  { id: 'skill-3', label: 'Regulatory Compliance Audit', category: 'Law & Ops', description: 'Analyze general commercial liability statements, employee handbook terms, and data safety directives.', level: 1, quizPoints: 150 },
  { id: 'skill-4', label: 'Advanced Biostatistics', category: 'Data Science', description: 'Socratic dialogue on probability indexes, clinical error boundaries, and scatter graphs.', level: 0, quizPoints: 300 }
];

// INITIAL TASK ITEMS
export const INITIAL_TASK_LIST: TaskItem[] = [
  { id: 'tsk-1', title: 'Collect Grandma Mary prescription refills from primary clinic', status: 'todo', priority: 'high' },
  { id: 'tsk-2', title: 'Complete intermediate French language tutoring assignment', status: 'in_progress', priority: 'medium' },
  { id: 'tsk-3', title: 'Prepare small business commercial liability audit log', status: 'done', priority: 'high' }
];

// INITIAL CALENDAR EVENTS
export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  { id: 'evt-1', title: 'Grandma Mary Blood Checkup', time: 'Today @ 10:30 AM', location: 'Heart Care Center', type: 'medical' },
  { id: 'evt-2', title: 'Compliance Report Review with Dr. T', time: 'Tomorrow @ 02:00 PM', location: 'Orchestrator Iframe Portal', type: 'workspace' },
  { id: 'evt-3', title: 'Socratic Dialectics French Tutoring', time: 'Friday @ 04:30 PM', location: 'Core Hub Screen', type: 'learning' }
];

// INITIAL NOTES
export const INITIAL_SMART_NOTES: SmartNote[] = [
  { id: 'not-1', title: 'Symptom Log: Stress Reactions', content: 'Noted slightly elevated blood pressure when prepping biostat assessments. Added extra lavender chamomile routine before bedtime sleep cycle.', updatedAt: 'Jun 11', tag: 'Health' },
  { id: 'not-2', title: 'Paris Hotel Transportation Route', content: 'Metro Line 4 guides to downtown directly. Need to review conversational french vocabulary for ticket vendors.', updatedAt: 'Jun 10', tag: 'Life' }
];

// INITIAL CARBON HABITS
export const INITIAL_CARBON_HABITS: CarbonHabit[] = [
  { id: 'cab-1', title: 'Opted for city electric tram instead of private transport', active: true, points: 6, category: 'transport' },
  { id: 'cab-2', title: 'Used solar energy battery grid to charge primary smart devices', active: true, points: 2, category: 'energy' },
  { id: 'cab-3', title: 'Completed paperless commercial audit submittals', active: false, points: 4, category: 'waste' },
  { id: 'cab-4', title: 'Sustained organic meat-free dietary meals today', active: false, points: 5, category: 'food' }
];
