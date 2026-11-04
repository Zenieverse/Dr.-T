import { 
  GatherEvent, 
  BudgetItem, 
  TimelineTask, 
  VendorRecord, 
  GuestRecord, 
  TeamRoleAssignment,
  AIEventPlan
} from './types';

export const STARTER_EVENT: GatherEvent = {
  id: 'event-wedding-lotus',
  userId: 'sample-host',
  title: "Mai & David's Botanical Wedding & Tea Ceremony",
  eventType: 'wedding',
  date: '2026-11-28',
  time: '15:30',
  location: 'An Vien Heritage Garden, Hoi An & Danang Coast',
  venueName: 'The Bamboo Pavilion & Water Lily Courtyard',
  expectedGuests: 110,
  currency: 'USD',
  totalBudget: 25000,
  themeStyle: 'Warm Botanical Garden & Silk Lantern Glow',
  dietaryNeeds: ['Vegetarian (12)', 'Vegan (6)', 'Gluten-Free (4)', 'Halal Friendly (8)'],
  accessibilityNeeds: ['Wheelchair accessible ramps', 'Shaded step-free elder seating'],
  culturalPreferences: 'Traditional Vietnamese Tea Ceremony (Lễ Đính Hôn) honoring grandparents followed by coastal western dinner reception',
  planningStage: 'mid_planning',
  priorities: [
    'Unforgettable culinary feast honoring family roots',
    'Warm, authentic guest hospitality and comfort',
    'Intimate acoustic musical ambiance',
    'Candid, documentary-style photography'
  ],
  notes: 'Ensure elderly grandparents have dedicated quiet resting pavilion with warm herbal tea.',
  createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
  updatedAt: new Date().toISOString(),
};

export const SECOND_STARTER_EVENT: GatherEvent = {
  id: 'event-family-80th',
  userId: 'sample-host',
  title: "Grandma Linh's 80th Milestone Family Feast",
  eventType: 'birthday',
  date: '2026-12-15',
  time: '11:00',
  location: 'Riverside Banyan Hall, Saigon',
  venueName: 'Riverside Banyan Hall',
  expectedGuests: 65,
  currency: 'USD',
  totalBudget: 6500,
  themeStyle: 'Golden Longevity & Lotus Peach Blossom',
  dietaryNeeds: ['Low Sodium Elders (10)', 'Vegetarian (8)'],
  accessibilityNeeds: ['Step-free ground level hall', 'Comfortable cushioned armchairs'],
  culturalPreferences: 'Traditional Vietnamese longevity blessings (Mừng Thọ) with tea and red envelopes for children',
  planningStage: 'vendor_booking',
  priorities: [
    'Family storytelling and archival photo projection',
    'Multi-generational music and acoustic piano',
    'Comfortable, unhurried pacing for elders'
  ],
  notes: 'Grandchildren are preparing a surprise video collage of photos from 1950 to present.',
  createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  updatedAt: new Date().toISOString(),
};

export const STARTER_BUDGET_ITEMS: BudgetItem[] = [
  {
    id: 'budget-1',
    eventId: 'event-wedding-lotus',
    category: 'venue',
    name: 'Bamboo Pavilion & Garden Rental (Full Day)',
    estimatedCost: 6500,
    actualCost: 6200,
    vendorQuotation: 6200,
    paidAmount: 3100,
    dueDate: '2026-11-15',
    paymentStatus: 'deposit_paid',
    notes: '50% deposit paid on reservation. Final balance due 13 days prior.',
    receiptId: 'REC-VEN-001'
  },
  {
    id: 'budget-2',
    eventId: 'event-wedding-lotus',
    category: 'catering',
    name: 'Coastal Seafood & Vegetarian Family-Style Feast (110 guests)',
    estimatedCost: 7800,
    actualCost: 7950,
    vendorQuotation: 7950,
    paidAmount: 3000,
    dueDate: '2026-11-20',
    paymentStatus: 'deposit_paid',
    notes: 'Includes welcome drinks, 6 courses, tea ceremony delicacies, and late-night snacks.',
    receiptId: 'REC-CAT-002'
  },
  {
    id: 'budget-3',
    eventId: 'event-wedding-lotus',
    category: 'photography',
    name: 'Documentary Duo Photography & Drone Coverage (10 Hours)',
    estimatedCost: 3200,
    actualCost: 3000,
    vendorQuotation: 3000,
    paidAmount: 1500,
    dueDate: '2026-11-28',
    paymentStatus: 'deposit_paid',
    notes: 'Includes pre-ceremony tea rites, high-res gallery, and printed keepsake album.',
    receiptId: 'REC-PHO-003'
  },
  {
    id: 'budget-4',
    eventId: 'event-wedding-lotus',
    category: 'decor',
    name: 'Hoi An Silk Lanterns, Floral Arch & Botanical Tablescapes',
    estimatedCost: 2800,
    actualCost: 2600,
    vendorQuotation: 2600,
    paidAmount: 1300,
    dueDate: '2026-11-25',
    paymentStatus: 'deposit_paid',
    notes: 'Locally hand-woven silk lanterns with warm amber filament lighting.',
    receiptId: 'REC-DEC-004'
  },
  {
    id: 'budget-5',
    eventId: 'event-wedding-lotus',
    category: 'entertainment',
    name: 'Acoustic String Trio + Evening Live Folk & Jazz Band',
    estimatedCost: 1900,
    actualCost: 1800,
    vendorQuotation: 1800,
    paidAmount: 600,
    dueDate: '2026-11-28',
    paymentStatus: 'deposit_paid',
    notes: 'Trio for tea rites and ceremony, 4-piece band for evening dance floor.',
    receiptId: 'REC-ENT-005'
  },
  {
    id: 'budget-6',
    eventId: 'event-wedding-lotus',
    category: 'attire',
    name: 'Custom Traditional Áo Dài for Couple & Family Entourage',
    estimatedCost: 1100,
    actualCost: 950,
    vendorQuotation: 950,
    paidAmount: 950,
    dueDate: '2026-10-30',
    paymentStatus: 'paid_in_full',
    notes: 'Tailored silk áo dài delivered and fitted.',
    receiptId: 'REC-ATT-006'
  },
  {
    id: 'budget-7',
    eventId: 'event-wedding-lotus',
    category: 'invitations',
    name: 'Recycled Botanical Paper Invitations & Bilingual RSVP Portal',
    estimatedCost: 450,
    actualCost: 380,
    vendorQuotation: 380,
    paidAmount: 380,
    dueDate: '2026-09-15',
    paymentStatus: 'paid_in_full',
    notes: 'Handmade seeded paper that guests can plant afterward.',
    receiptId: 'REC-INV-007'
  },
  {
    id: 'budget-8',
    eventId: 'event-wedding-lotus',
    category: 'contingency',
    name: 'Weather Buffer & Emergency Backup Logistics Fund',
    estimatedCost: 1500,
    actualCost: 0,
    vendorQuotation: 0,
    paidAmount: 0,
    dueDate: '2026-11-28',
    paymentStatus: 'unpaid',
    notes: 'Reserved for last-minute clear umbrellas or generator fuel if grid blinks.'
  }
];

export const STARTER_TIMELINE_TASKS: TimelineTask[] = [
  {
    id: 'task-1',
    eventId: 'event-wedding-lotus',
    title: 'Lock Bamboo Pavilion contract & finalize floor plan',
    description: 'Verify rain plan marquee covers and elder ramp positioning.',
    dueDate: '2026-10-15',
    milestone: '1_month',
    status: 'completed',
    priority: 'high',
    assignedPersonName: 'Sarah Jenkins',
    assignedRoleTitle: 'Day-Of Coordinator',
    hatType: 'professional'
  },
  {
    id: 'task-2',
    eventId: 'event-wedding-lotus',
    title: 'Finalize tea ceremony sequence with family elders',
    description: 'Confirm order of tea offering, blessings, and betrothal tray offerings.',
    dueDate: '2026-11-05',
    milestone: '1_month',
    status: 'completed',
    priority: 'high',
    assignedPersonName: 'Mai Nguyen & David Tran',
    assignedRoleTitle: 'Couple & Honorees',
    hatType: 'personal'
  },
  {
    id: 'task-3',
    eventId: 'event-wedding-lotus',
    title: 'Taste testing for vegetarian and gluten-free tasting courses',
    description: 'Ensure vegan lotus root salad and gluten-free mushroom claypot meet standards.',
    dueDate: '2026-11-10',
    milestone: '2_weeks',
    status: 'in_progress',
    priority: 'high',
    assignedPersonName: 'Chef Quang',
    assignedRoleTitle: 'Catering Lead',
    hatType: 'professional'
  },
  {
    id: 'task-4',
    eventId: 'event-wedding-lotus',
    title: 'Assemble welcome gift baskets for out-of-town guests',
    description: 'Include local Tra Bong herbal teas, fresh citrus fruits, and handwritten cards.',
    dueDate: '2026-11-22',
    milestone: 'event_week',
    status: 'todo',
    priority: 'medium',
    assignedPersonName: 'Lan Tran & Community Team',
    assignedRoleTitle: 'Welcome Ambassador',
    hatType: 'social'
  },
  {
    id: 'task-5',
    eventId: 'event-wedding-lotus',
    title: 'Sound check & lapel mic wireless frequency rehearsal',
    description: 'Check acoustics in garden to prevent wind distortion during ceremony vows.',
    dueDate: '2026-11-27',
    milestone: 'event_week',
    status: 'todo',
    priority: 'high',
    assignedPersonName: 'Alex Thorne',
    assignedRoleTitle: 'Audio/Visual Director',
    hatType: 'professional'
  },
  {
    id: 'task-6',
    eventId: 'event-wedding-lotus',
    title: 'Elder resting lounge check-in & hydration station',
    description: 'Ensure shaded armchairs, warm ginger tea, and quiet acoustics are ready for grandparents.',
    dueDate: '2026-11-28',
    milestone: 'day_of',
    status: 'todo',
    priority: 'high',
    assignedPersonName: 'Tuan Nguyen',
    assignedRoleTitle: 'Elder Care Liaison',
    hatType: 'personal',
    isEventDayChecklist: true,
    eventDayTime: '14:30 - Setup & Inspection'
  },
  {
    id: 'task-7',
    eventId: 'event-wedding-lotus',
    title: 'Traditional Betrothal Gift Trays (Mâm Quả) inspection',
    description: 'Check betel leaves, areca nuts, roast pork, red sticky rice, and tea sets.',
    dueDate: '2026-11-28',
    milestone: 'day_of',
    status: 'todo',
    priority: 'high',
    assignedPersonName: 'Uncle Binh',
    assignedRoleTitle: 'Heritage Protocol Master',
    hatType: 'social',
    isEventDayChecklist: true,
    eventDayTime: '15:00 - Groom Entourage Arrival'
  },
  {
    id: 'task-8',
    eventId: 'event-wedding-lotus',
    title: 'Processional entrance & ring exchange music cue',
    description: 'Trio transitions from Bach Air on G to acoustic folk melody as bride enters.',
    dueDate: '2026-11-28',
    milestone: 'day_of',
    status: 'todo',
    priority: 'high',
    assignedPersonName: 'Sarah Jenkins',
    assignedRoleTitle: 'Day-Of Coordinator',
    hatType: 'professional',
    isEventDayChecklist: true,
    eventDayTime: '16:00 - Vows & Ring Exchange'
  }
];

export const STARTER_VENDORS: VendorRecord[] = [
  {
    id: 'vendor-1',
    eventId: 'event-wedding-lotus',
    name: 'An Vien Heritage Garden & Bamboo Courtyard',
    category: 'venue',
    contactPerson: 'Ms. Ha Thu',
    phone: '+84 90 512 3456',
    email: 'events@anvienheritage.vn',
    website: 'https://anvienheritage.vn',
    quotedPrice: 6200,
    depositAmount: 3100,
    depositPaid: true,
    paymentDeadline: '2026-11-15',
    status: 'deposit_paid',
    notes: 'Includes private bride room, sound permit until 23:00, and rain-safe covered veranda.',
    isVerifiedQuote: true
  },
  {
    id: 'vendor-2',
    eventId: 'event-wedding-lotus',
    name: 'Lotus & Sea Artisan Catering',
    category: 'catering',
    contactPerson: 'Chef Quang Vu',
    phone: '+84 91 388 9900',
    email: 'quang@lotusseacatering.com',
    website: 'https://lotusseacatering.com',
    quotedPrice: 7950,
    depositAmount: 3000,
    depositPaid: true,
    paymentDeadline: '2026-11-20',
    status: 'deposit_paid',
    notes: 'Quotation verified on Oct 20. Includes full service staff, chinaware, and bar service.',
    isVerifiedQuote: true
  },
  {
    id: 'vendor-3',
    eventId: 'event-wedding-lotus',
    name: 'Hoi An Lantern & Floral Craft Guild',
    category: 'decor',
    contactPerson: 'Master Artisan Mai Lan',
    phone: '+84 98 234 5678',
    email: 'mailan@hoiancraft.vn',
    website: 'https://hoiancraftguild.vn',
    quotedPrice: 2600,
    depositAmount: 1300,
    depositPaid: true,
    paymentDeadline: '2026-11-25',
    status: 'deposit_paid',
    notes: 'Handmade silk lanterns in deep vermilion and pale gold. Setup at 09:00 on event day.',
    isVerifiedQuote: true
  },
  {
    id: 'vendor-4',
    eventId: 'event-wedding-lotus',
    name: 'Soulful Moments Cinema & Photography',
    category: 'photography',
    contactPerson: 'Tri Nguyen',
    phone: '+84 93 456 7890',
    email: 'tri@soulfulmoments.vn',
    website: 'https://soulfulmoments.vn',
    quotedPrice: 3000,
    depositAmount: 1500,
    depositPaid: true,
    paymentDeadline: '2026-11-28',
    status: 'deposit_paid',
    notes: '2 lead photographers + drone pilot. Same-day teaser reel guaranteed by 22:00.',
    isVerifiedQuote: true
  },
  {
    id: 'vendor-5',
    eventId: 'event-wedding-lotus',
    name: 'Sonata Da Nang String Ensemble',
    category: 'entertainment',
    contactPerson: 'Nguyen Bao (Concertmaster)',
    phone: '+84 90 987 6543',
    email: 'booking@sonatadanang.vn',
    quotedPrice: 1800,
    depositAmount: 600,
    depositPaid: true,
    paymentDeadline: '2026-11-28',
    status: 'deposit_paid',
    notes: 'Classical repertoire for guest arrival, followed by contemporary acoustic favorites.',
    isVerifiedQuote: true
  }
];

export const STARTER_GUESTS: GuestRecord[] = [
  {
    id: 'guest-1',
    eventId: 'event-wedding-lotus',
    name: 'Grandmother Ba Nguyen',
    email: '',
    phone: '+84 90 311 2233',
    rsvpStatus: 'attending',
    invitationStatus: 'delivered',
    plusOnes: 0,
    dietaryRequirements: ['Soft Foods', 'Low Salt'],
    tableOrSeating: 'Table 1 — Patriarchs & Matriarchs',
    isVIP: true,
    notes: 'Wheelchair assistance upon arrival. Loves warm chrysanthemum tea.'
  },
  {
    id: 'guest-2',
    eventId: 'event-wedding-lotus',
    name: 'Grandfather Ong Sau Tran',
    email: '',
    phone: '+84 90 422 3344',
    rsvpStatus: 'attending',
    invitationStatus: 'delivered',
    plusOnes: 0,
    dietaryRequirements: ['Vegetarian Friendly'],
    tableOrSeating: 'Table 1 — Patriarchs & Matriarchs',
    isVIP: true,
    notes: 'Delivering the ceremonial family blessing at 15:45.'
  },
  {
    id: 'guest-3',
    eventId: 'event-wedding-lotus',
    name: 'Dr. Sarah & Mark Chen',
    email: 'sarah.chen@clinic.org',
    phone: '+1 415 555 0192',
    rsvpStatus: 'attending',
    invitationStatus: 'delivered',
    plusOnes: 1,
    dietaryRequirements: ['Pescatarian', 'No Shellfish'],
    tableOrSeating: 'Table 3 — Lifelong Mentors & Friends',
    isVIP: false,
    notes: 'Flying in from San Francisco. Arriving Friday Nov 27.'
  },
  {
    id: 'guest-4',
    eventId: 'event-wedding-lotus',
    name: 'Elena & Lucas Moreau',
    email: 'elena.moreau@design.fr',
    phone: '+33 6 12 34 56 78',
    rsvpStatus: 'attending',
    invitationStatus: 'delivered',
    plusOnes: 0,
    dietaryRequirements: ['Strict Vegan'],
    tableOrSeating: 'Table 4 — Creative Circle',
    isVIP: false,
    notes: 'Elena designed the seeded paper invitations.'
  },
  {
    id: 'guest-5',
    eventId: 'event-wedding-lotus',
    name: 'Bao & Linh Le',
    email: 'bao.le@techsaigon.vn',
    phone: '+84 98 765 4321',
    rsvpStatus: 'attending',
    invitationStatus: 'delivered',
    plusOnes: 2,
    dietaryRequirements: ['Nut Allergy (Child)'],
    tableOrSeating: 'Table 5 — Family & Children Zone',
    isVIP: false,
    notes: 'Two children (ages 5 and 8). Requested high chair.'
  },
  {
    id: 'guest-6',
    eventId: 'event-wedding-lotus',
    name: 'Captain Marcus Hayes',
    email: 'marcus.hayes@aviation.co.uk',
    phone: '+44 7700 900123',
    rsvpStatus: 'tentative',
    invitationStatus: 'sent',
    plusOnes: 1,
    dietaryRequirements: ['None'],
    tableOrSeating: 'Table 2 — University Colleagues',
    isVIP: false,
    notes: 'Awaiting airline duty roster confirmation on Nov 10.'
  }
];

export const STARTER_TEAM_ROLES: TeamRoleAssignment[] = [
  {
    id: 'role-1',
    eventId: 'event-wedding-lotus',
    personName: 'Sarah Jenkins',
    roleTitle: 'Lead Day-Of Coordinator',
    hat: 'professional',
    coreResponsibilities: [
      'Master timeline orchestration and vendor call-times',
      'Audio & lighting cues for ceremony and reception transitions',
      'Weather contingency and backup pavilion readiness'
    ],
    phone: '+84 90 888 7766',
    email: 'sarah@coastalweddings.vn',
    notes: 'Primary point of contact for all 5 professional vendors.'
  },
  {
    id: 'role-2',
    eventId: 'event-wedding-lotus',
    personName: 'Mai & David (The Couple)',
    roleTitle: 'Self-Care & Joy Anchors',
    hat: 'personal',
    coreResponsibilities: [
      'Take 10 minutes of quiet solitude together after the ceremony',
      'Stay hydrated with electrolyte water throughout the morning',
      'Delegate all day-of logistical inquiries strictly to Sarah'
    ],
    phone: '+84 91 234 5678',
    notes: 'Guaranteed: No phone checks or vendor firefighting on event day.'
  },
  {
    id: 'role-3',
    eventId: 'event-wedding-lotus',
    personName: 'Uncle Binh & Aunt Huong',
    roleTitle: 'Heritage Protocol Masters',
    hat: 'social',
    coreResponsibilities: [
      'Oversee the 6 traditional gift trays and red silk covers',
      'Guide the young groomsmen and bridesmaids during the betrothal procession',
      'Introduce family branches and coordinate the formal ancestor altar bowing'
    ],
    phone: '+84 98 111 2233',
    notes: 'Ensuring Vietnamese ancestral traditions are honored with reverence.'
  },
  {
    id: 'role-4',
    eventId: 'event-wedding-lotus',
    personName: 'Lan Tran & Community Helpers',
    roleTitle: 'Welcome & Hospitality Ambassadors',
    hat: 'social',
    coreResponsibilities: [
      'Greet guests at the lotus courtyard gate with iced lemongrass tea',
      'Escort elderly guests and families with small children to shaded pavilions',
      'Manage guest book and audio guestbook recording phone'
    ],
    phone: '+84 93 222 3344',
    notes: 'Warm, smiling community presence.'
  }
];

export const STARTER_AI_PLAN: AIEventPlan = {
  themeConcept: {
    title: 'Hoi An Lantern Glow & Coastal Botanical Serenity',
    moodboardSummary: 'An organic dialogue between natural bamboo textures, lotus water features, and the warm, incandescent amber glow of hand-crafted silk lanterns as dusk settles over the garden.',
    palette: ['#C88D42', '#3D5A40', '#EFE7DA', '#8C3838', '#264653'],
    atmosphereKeynotes: [
      'Acoustic strings mingling with gentle water fountain murmurs',
      'Aromatic lemongrass, lotus blossoms, and star anise in the air',
      'Soft lantern illumination replacing harsh stage spots',
      'Warm family-style shared feast that encourages cross-table laughter'
    ]
  },
  budgetBreakdown: [
    {
      category: 'catering',
      categoryLabel: 'Artisan Food & Beverage',
      recommendedPercent: 33,
      recommendedAmount: 7920,
      reasoning: 'Primary guest experience anchor with 6 courses, local delicacies, and open tea bar.'
    },
    {
      category: 'venue',
      categoryLabel: 'Heritage Pavilion & Grounds',
      recommendedPercent: 27,
      recommendedAmount: 6480,
      reasoning: 'Covers private grounds, weather-sheltered verandas, and elder-accessible paths.'
    },
    {
      category: 'photography',
      categoryLabel: 'Documentary Photo & Cinema',
      recommendedPercent: 13,
      recommendedAmount: 3120,
      reasoning: 'Timeless memory preservation with drone coverage and heirloom print album.'
    },
    {
      category: 'decor',
      categoryLabel: 'Silk Lanterns & Botanical Florals',
      recommendedPercent: 11,
      recommendedAmount: 2640,
      reasoning: 'Hoi An artisanal lanterns, local tropical flora, and minimalist reusable bamboo stands.'
    },
    {
      category: 'entertainment',
      categoryLabel: 'Acoustic Trio & Live Band',
      recommendedPercent: 8,
      recommendedAmount: 1920,
      reasoning: 'Acoustic accompaniment for vows, transitioned into celebratory live music.'
    },
    {
      category: 'attire',
      categoryLabel: 'Custom Silk Áo Dài',
      recommendedPercent: 4,
      recommendedAmount: 960,
      reasoning: 'Tailored silk attire honoring heritage.'
    },
    {
      category: 'contingency',
      categoryLabel: 'Emergency Reserve Buffer',
      recommendedPercent: 4,
      recommendedAmount: 960,
      reasoning: 'Unforeseen weather shifts, generator backup, or transportation adjustments.'
    }
  ],
  milestones: [
    {
      timeframe: '6+ Months Prior',
      actionItems: [
        'Confirm date and book core venue with rain-safe backup',
        'Draft primary guest list and establish total budget ceiling',
        'Select and contract lead photographer and caterer'
      ]
    },
    {
      timeframe: '3 Months Prior',
      actionItems: [
        'Send bilingual invitations with RSVP dietary survey',
        'Order tailored wedding attire and traditional ceremony attire',
        'Finalize acoustic and live music playlist boundaries'
      ]
    },
    {
      timeframe: '1 Month Prior',
      actionItems: [
        'Conduct full menu tasting and lock vegetarian/allergy numbers',
        'Review tea ceremony sequence with family elders',
        'Confirm transport shuttles for out-of-town guests'
      ]
    },
    {
      timeframe: '2 Weeks Prior',
      actionItems: [
        'Publish seating chart and table assignments',
        'Provide final guaranteed guest headcounts to caterer and venue',
        'Conduct sound and microphone walk-through'
      ]
    },
    {
      timeframe: 'Event Week',
      actionItems: [
        'Assemble welcome hampers and distribute to guest lodgings',
        'Confirm weather forecast and review contingency plan triggers',
        'Hold casual rehearsal walkthrough with coordinator and wedding party'
      ]
    }
  ],
  vendorChecklist: [
    {
      category: 'venue',
      keyQuestionsToAsk: [
        'What is the precise curfew for acoustic versus amplified music?',
        'What is the generator switchover time if municipal power cuts out?',
        'Is there dedicated air-conditioned resting space for elderly guests?'
      ],
      selectionTips: [
        'Check restroom access for wheelchairs and strollers.',
        'Ask about mosquito management for twilight garden events.'
      ]
    },
    {
      category: 'catering',
      keyQuestionsToAsk: [
        'How are severe allergies separated during kitchen prep?',
        'Do you provide tasting sessions for alternative dietary menus?',
        'What is your staff-to-guest ratio for family-style table service?'
      ],
      selectionTips: [
        'Aim for 1 server per 10-12 guests for seamless family-style dining.'
      ]
    },
    {
      category: 'photography',
      keyQuestionsToAsk: [
        'Have you photographed at this garden during golden hour before?',
        'What is your dual-card backup redundancy during the shoot?',
        'How do you approach shy elders who dislike intrusive flashes?'
      ],
      selectionTips: [
        'Look for candid, emotion-focused portfolios rather than heavily staged poses.'
      ]
    }
  ],
  guestExperiencePlan: {
    welcomeStrategy: 'Guests arrive to the cooling shade of bamboo trees, offered iced lotus tea and cold jasmine towels before being seated.',
    dietaryCareSummary: 'All dietary choices are discreetly color-coded on place cards so banquet servers deliver tailored dishes without calling out medical restrictions.',
    accessibilityChecklist: [
      'Zero-threshold entry ramp from parking courtyard to garden pavilion',
      'Wide gravel-free stone walkways suitable for wheelchairs and walking canes',
      'Designated quiet seating pavilion away from speakers for sensory relief'
    ]
  },
  eventDayRunningOrder: [
    {
      time: '13:00',
      activity: 'Vendor Load-In & Decor Installation',
      responsibleHat: 'professional',
      leadPerson: 'Sarah Jenkins (Coordinator)',
      notes: 'Silk lanterns hung, sound system tuned, floral arrangements placed.'
    },
    {
      time: '14:30',
      activity: 'Elder Lounge Open & Hydration Station Live',
      responsibleHat: 'personal',
      leadPerson: 'Tuan Nguyen (Elder Liaison)',
      notes: 'Grandparents arrive early to rest comfortably in air-conditioned suite.'
    },
    {
      time: '15:00',
      activity: 'Groom Entourage Procession & Betrothal Trays',
      responsibleHat: 'social',
      leadPerson: 'Uncle Binh',
      notes: 'Traditional 6 mâm quả carried across bridge into the pavilion.'
    },
    {
      time: '15:30',
      activity: 'Ceremonial Tea Offering & Family Blessings',
      responsibleHat: 'personal',
      leadPerson: 'Couple & Elders',
      notes: 'Tea poured for parents and grandparents; exchange of gold heirloom jewelry.'
    },
    {
      time: '16:15',
      activity: 'Acoustic Garden Ceremony & Personal Vows',
      responsibleHat: 'personal',
      leadPerson: 'Couple & Officiant',
      notes: 'Acoustic string trio plays gentle classical accompaniment; ring exchange.'
    },
    {
      time: '17:00',
      activity: 'Sunset Cocktails & Golden Hour Photography',
      responsibleHat: 'professional',
      leadPerson: 'Tri Nguyen (Photographer)',
      notes: 'Signature passion fruit spritz served while family photos are captured.'
    },
    {
      time: '18:15',
      activity: 'Dinner Feast Commences with Lantern Lighting',
      responsibleHat: 'professional',
      leadPerson: 'Chef Quang & Coordinator',
      notes: '110 lanterns illuminate simultaneously; 6-course family-style dinner begins.'
    },
    {
      time: '19:45',
      activity: 'Heartfelt Toasts & Generational Slideshow',
      responsibleHat: 'social',
      leadPerson: 'Toastmaster',
      notes: 'Short, meaningful 3-minute toasts from parents and best friends.'
    },
    {
      time: '20:30',
      activity: 'Live Music, First Dance & Community Celebration',
      responsibleHat: 'social',
      leadPerson: 'Live Band & All Guests',
      notes: 'Celebratory dancing under the stars with late-night Vietnamese coffee and sweet treats.'
    },
    {
      time: '22:30',
      activity: 'Sparkler & Paper Lantern Farewell',
      responsibleHat: 'professional',
      leadPerson: 'Coordinator & Helpers',
      notes: 'Shuttle buses depart for hotels; couple send-off.'
    }
  ],
  decorAndCateringIdeas: {
    decorHighlights: [
      'Ceiling canopy of hand-pleated yellow silk lanterns with warm amber dimmers',
      'Ceramic lotus bowls with floating tea lights and fresh white frangipani',
      'Live bamboo table runners paired with natural linen napkins',
      'Engraved wooden guest seating tiles that double as wedding favor keychains'
    ],
    signatureMenuConcepts: [
      'Hoi An Heritage Lotus Stem Salad with poached river shrimp and crispy shallots (Vegan alternative with smoked tofu)',
      'Steamed Sea Bass in Banana Leaf with lemongrass, galangal, and fresh dill',
      'Slow-Braised Shiitake & Chestnut Claypot with fragrant jasmine rice',
      'Chilled Lotus Seed & Longan Sweet Soup with pandan jelly'
    ],
    beverageAndCocktailIdeas: [
      'Hoi An Twilight: Passion fruit, local calamansi, ginger brew, and dark rum',
      'The Lotus Whisper (Mocktail): Cold-brewed lotus green tea with honey and lychee',
      'Fresh Young Coconut station with custom personalized monogram branding'
    ]
  },
  contingencyChecklist: [
    {
      risk: 'Tropical Afternoon Rain Shower',
      trigger: 'Radar indicates precipitation > 60% within 2 hours of ceremony',
      contingencyAction: 'Deploy the pre-hung waterproof translucent pavilion roll-down blinds. Relocate acoustic trio to covered veranda. Distribute matching ivory umbrellas.'
    },
    {
      risk: 'Municipal Electrical Grid Drop',
      trigger: 'Power loss exceeding 30 seconds',
      contingencyAction: 'Venue on-site diesel backup generator auto-starts within 45 seconds. Battery-powered LED lanterns maintain ambient illumination.'
    },
    {
      risk: 'Key Vendor Delayed by Traffic',
      trigger: 'Vendor has not arrived by 60 minutes prior to scheduled call-time',
      contingencyAction: 'Coordinator calls vendor emergency line. If caterer delayed, extend cocktail hour station with pre-delivered artisanal cheese and fruit boards.'
    },
    {
      risk: 'Unannounced Dietary Restriction at Table',
      trigger: 'Guest notifies banquet server of unlisted severe allergy',
      contingencyAction: 'Catering chef holds 6 unassigned pre-packaged allergen-safe gourmet meals (Gluten-free, vegan, nut-free) ready for immediate plating.'
    }
  ],
  generatedAt: new Date().toISOString(),
  engine: 'Dr. T Gather & Glow AI Engine (Gemini 3.8 Flash)'
};
