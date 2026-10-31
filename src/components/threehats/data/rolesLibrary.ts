import { ThreeHatsRole } from '../types';

export const DEFAULT_ROLES_LIBRARY: Omit<ThreeHatsRole, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[] = [
  // ==================== HAT 1: PROFESSIONAL ====================
  // Work and contribution
  {
    name: 'Team Member / Colleague',
    description: 'Contributing daily expertise, collaborating with peers, and building shared solutions.',
    category: 'Work and contribution',
    hatIds: ['professional'],
    status: 'current',
    importance: 'high',
    energyLevel: 'neutral',
    timeDemand: '30-40 hrs/wk',
    values: ['Collaboration', 'Craftsmanship', 'Reliability'],
    commitments: ['Deliver quarterly goals with quality and respect for teammates'],
    isLibraryTemplate: true
  },
  {
    name: 'Entrepreneur / Independent Creator',
    description: 'Founding, innovating, and stewarding an independent project or livelihood venture.',
    category: 'Work and contribution',
    hatIds: ['professional'],
    status: 'current',
    importance: 'high',
    energyLevel: 'energizing',
    timeDemand: '15-25 hrs/wk',
    values: ['Autonomy', 'Innovation', 'Impact'],
    commitments: ['Build ethical, sustainable products that serve real user needs'],
    isLibraryTemplate: true
  },
  {
    name: 'Team Leader / Project Owner',
    description: 'Guiding direction, unblocking teammates, and aligning vision with day-to-day execution.',
    category: 'Work and contribution',
    hatIds: ['professional'],
    status: 'occasional',
    importance: 'high',
    energyLevel: 'neutral',
    timeDemand: '10-15 hrs/wk',
    values: ['Empowerment', 'Clarity', 'Accountability'],
    commitments: ['Provide constructive feedback and protect team focus'],
    isLibraryTemplate: true
  },
  // Learning and growth
  {
    name: 'Lifelong Learner / Skill Builder',
    description: 'Exploring new technologies, deepening craft, and remaining curious in an evolving field.',
    category: 'Learning and growth',
    hatIds: ['professional', 'personal'],
    status: 'current',
    importance: 'high',
    energyLevel: 'energizing',
    timeDemand: '4-6 hrs/wk',
    values: ['Curiosity', 'Growth', 'Humble Mastery'],
    commitments: ['Dedicate weekly quiet time to studying open-source AI and software design'],
    isLibraryTemplate: true
  },
  {
    name: 'Mentor / Knowledge Sharer',
    description: 'Supporting junior colleagues or community members on their career journeys.',
    category: 'Learning and growth',
    hatIds: ['professional', 'social'],
    status: 'current',
    importance: 'moderate',
    energyLevel: 'energizing',
    timeDemand: '2 hrs/wk',
    values: ['Generosity', 'Patience', 'Lifting Others'],
    commitments: ['Hold bi-weekly 30-minute mentoring chats with aspiring engineers'],
    isLibraryTemplate: true
  },
  // Responsibility and stewardship
  {
    name: 'Safety & Ethics Champion',
    description: 'Advocating for user privacy, ethical safety boundaries, and inclusive design standards.',
    category: 'Responsibility and stewardship',
    hatIds: ['professional'],
    status: 'current',
    importance: 'core',
    energyLevel: 'energizing',
    timeDemand: '3 hrs/wk',
    values: ['Integrity', 'Privacy', 'Truthfulness'],
    commitments: ['Ensure automated systems require explicit user permission before consequential actions'],
    isLibraryTemplate: true
  },

  // ==================== HAT 2: PERSONAL ====================
  // Self and wellbeing
  {
    name: 'Caretaker of Personal Wellbeing',
    description: 'Protecting sleep, nourishment, movement, mental clarity, and preventive healthcare.',
    category: 'Self and wellbeing',
    hatIds: ['personal'],
    status: 'current',
    importance: 'core',
    energyLevel: 'energizing',
    timeDemand: '7 hrs/wk',
    values: ['Health', 'Sustainability', 'Rest'],
    commitments: ['Protect an 8-hour sleep window and take outdoor daytime walks'],
    isLibraryTemplate: true
  },
  {
    name: 'Person Managing Rest & Solitude',
    description: 'Creating unstructured downtime to decompress, reflect, and recharge mental energy.',
    category: 'Self and wellbeing',
    hatIds: ['personal'],
    status: 'current',
    importance: 'high',
    energyLevel: 'energizing',
    timeDemand: '5 hrs/wk',
    values: ['Peace', 'Quiet Reflection', 'Self-Compassion'],
    commitments: ['Disconnect from digital screens 45 minutes before sleep'],
    isLibraryTemplate: true
  },
  {
    name: 'Financial Steward of Personal Resources',
    description: 'Planning personal finances with prudence, budgeting thoughtfully, and building stability.',
    category: 'Self and wellbeing',
    hatIds: ['personal'],
    status: 'current',
    importance: 'moderate',
    energyLevel: 'neutral',
    timeDemand: '1 hr/wk',
    values: ['Security', 'Mindfulness', 'Freedom'],
    commitments: ['Review monthly expenses and savings with calm intentionality'],
    isLibraryTemplate: true
  },
  // Family and close relationships (Optional)
  {
    name: 'Parent / Family Caregiver (Optional)',
    description: 'Nurturing family members, sharing daily care, and holding family traditions together.',
    category: 'Family and close relationships (optional)',
    hatIds: ['personal'],
    status: 'current',
    importance: 'core',
    energyLevel: 'neutral',
    timeDemand: '15-20 hrs/wk',
    values: ['Love', 'Presence', 'Consistency'],
    commitments: ['Eat Sunday evening meals together without work interruptions'],
    isLibraryTemplate: true
  },
  {
    name: 'Companion & Confidant',
    description: 'Being an honest, present, and supportive friend to a partner or close loved one.',
    category: 'Family and close relationships (optional)',
    hatIds: ['personal'],
    status: 'current',
    importance: 'high',
    energyLevel: 'energizing',
    timeDemand: '6-8 hrs/wk',
    values: ['Empathy', 'Trust', 'Attentive Listening'],
    commitments: ['Listen actively without rushing to fix or judge'],
    isLibraryTemplate: true
  },
  // Personal development
  {
    name: 'Memory Keeper & Tradition Preserver',
    description: 'Recording family stories, recipes, milestone lessons, and oral histories in Lantern Keeper.',
    category: 'Personal development',
    hatIds: ['personal', 'social'],
    status: 'current',
    importance: 'high',
    energyLevel: 'energizing',
    timeDemand: '2 hrs/wk',
    values: ['Heritage', 'Remembrance', 'Gratitude'],
    commitments: ['Preserve Grandmother Elena lemon verbena tea tradition and family proverbs'],
    isLibraryTemplate: true
  },
  {
    name: 'Maker / Creative Hobbyist',
    description: 'Engaging in creative hobbies—music, gardening, writing, painting, or coding playful tools.',
    category: 'Personal development',
    hatIds: ['personal'],
    status: 'current',
    importance: 'moderate',
    energyLevel: 'energizing',
    timeDemand: '3-5 hrs/wk',
    values: ['Creativity', 'Joy of Making', 'Playfulness'],
    commitments: ['Dedicate Saturday mornings to creative play without performance pressure'],
    isLibraryTemplate: true
  },

  // ==================== HAT 3: SOCIAL ====================
  // Relationships and belonging
  {
    name: 'Friend & Peer Supporter',
    description: 'Staying connected with longstanding friends, checking in, and celebrating life milestones.',
    category: 'Relationships and belonging',
    hatIds: ['social'],
    status: 'current',
    importance: 'high',
    energyLevel: 'energizing',
    timeDemand: '3-4 hrs/wk',
    values: ['Loyalty', 'Warmth', 'Shared Laughter'],
    commitments: ['Reach out to one friend each week just to see how they are doing'],
    isLibraryTemplate: true
  },
  {
    name: 'Neighbor & Local Community Member',
    description: 'Saying hello to neighbors, keeping shared spaces clean, and offering quiet mutual support.',
    category: 'Relationships and belonging',
    hatIds: ['social'],
    status: 'current',
    importance: 'moderate',
    energyLevel: 'neutral',
    timeDemand: '1-2 hrs/wk',
    values: ['Kindness', 'Civic Care', 'Belonging'],
    commitments: ['Participate warmly in neighborhood conversations and mutual aid'],
    isLibraryTemplate: true
  },
  // Contribution and leadership
  {
    name: 'Community Volunteer / Advocate',
    description: 'Contributing time or skills to open-source software, food pantries, or environmental stewardship.',
    category: 'Contribution and leadership',
    hatIds: ['social'],
    status: 'occasional',
    importance: 'high',
    energyLevel: 'energizing',
    timeDemand: '2-4 hrs/wk',
    values: ['Public Good', 'Generosity', 'Civic Action'],
    commitments: ['Contribute documentation and bug fixes to public open-source challenges'],
    isLibraryTemplate: true
  },
  // Culture and shared knowledge
  {
    name: 'Intergenerational Storyteller',
    description: 'Bridging generations through shared meals, local histories, proverbs, and lessons learned.',
    category: 'Culture and shared knowledge (optional)',
    hatIds: ['social', 'personal'],
    status: 'occasional',
    importance: 'moderate',
    energyLevel: 'energizing',
    timeDemand: '1-2 hrs/wk',
    values: ['Continuity', 'Respect', 'Wisdom'],
    commitments: ['Share memorable life lessons during intergenerational gatherings'],
    isLibraryTemplate: true
  }
];
