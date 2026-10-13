import { 
  MicroBizProfile, 
  MicroBizPost, 
  MicroBizCourse, 
  CommunityGroup, 
  CollaborativeProject, 
  MicroBusiness, 
  FinancialRecord,
  BusinessGoal,
  ModerationReport
} from '../types/microbizTypes';

export const SAMPLE_CREATOR_ALEX: MicroBizProfile = {
  id: 'user_alex_drt',
  name: 'Alex Rivera',
  handle: '@alexrivera',
  role: 'creator',
  bio: 'Community educator, botanical soap artisan & sustainable maker.',
  location: 'District 3, Ho Chi Minh City & Online',
  languages: ['English', 'Tiếng Việt'],
  skills: ['Botanical Soapmaking', 'Basic Bookkeeping', 'Social Storytelling'],
  interests: ['Circular Economy', 'Herbal Wellness', 'Micro-Finance'],
  isVerifiedCreator: true,
  coursesCount: 1,
  projectsCount: 2,
  studentsCount: 38,
  followingUserIds: ['user_an_nguyen', 'user_mai_le', 'user_linh_pham'],
  bookmarkedPostIds: ['post_1', 'post_3'],
  contactPreference: 'In-app inquiries & email: alex.rivera@microbiz.community',
  createdAt: '2026-02-15T08:00:00Z'
};

export const DEFAULT_GUEST_PROFILE: MicroBizProfile = {
  id: 'guest_unauthenticated',
  name: 'Guest Learner',
  handle: '@guest',
  role: 'learner',
  bio: 'Exploring community skills in guest mode. Sign in with Google to create storefronts and save permanent records.',
  languages: ['English', 'Tiếng Việt'],
  skills: ['Community Learning'],
  interests: ['Community Learning', 'Skill Sharing'],
  isVerifiedCreator: false,
  coursesCount: 0,
  projectsCount: 0,
  studentsCount: 0,
  followingUserIds: [],
  bookmarkedPostIds: [],
  createdAt: '2026-10-13T00:00:00Z'
};

export function getCurrentUserProfile(): MicroBizProfile {
  if (typeof window !== 'undefined') {
    const rawSaved = localStorage.getItem('microbiz_user_profile');
    if (rawSaved) {
      try {
        return JSON.parse(rawSaved);
      } catch {}
    }
  }
  return DEFAULT_GUEST_PROFILE;
}

// Default export for initial render (strictly Guest identity, never impersonating Alex Rivera)
export const CURRENT_USER_PROFILE: MicroBizProfile = DEFAULT_GUEST_PROFILE;

export const INITIAL_POSTS: MicroBizPost[] = [
  {
    id: 'post_1',
    authorId: 'user_an_nguyen',
    authorName: 'An Nguyễn',
    authorHandle: '@an_bamboo',
    authorRole: 'Bamboo Artisan & Mentor',
    title: 'How we reduced raw material waste by 40% using community scrap sharing',
    content: 'When we first started crafting bamboo tea sets in our small family workshop in Bến Tre, nearly 35% of the off-cuts ended up discarded. Last month, we partnered with our neighboring youth woodworking collective in the MicroBiz group. They now turn our smaller bamboo cuts into custom stirring spoons and garden tags!\n\nTakeaway for beginners: Look 2 blocks away before buying virgin materials. Your neighbor\'s scrap might be your primary inventory.',
    category: 'learning_story',
    tags: ['SustainableCrafts', 'WasteReduction', 'LocalCollaboration', 'BambooDesign'],
    language: 'both',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
    reactions: { like: 42, love: 28, celebrate: 19, insightful: 35, support: 14 },
    comments: [
      {
        id: 'c1',
        authorId: 'user_mai_le',
        authorName: 'Mai Lê',
        authorRole: 'Fermentation Educator',
        content: 'This is brilliant, An! We have spent grains from kombucha brewing that we currently give to suburban mushroom growers. Cross-pollination is real.',
        createdAt: '2 hours ago'
      },
      {
        id: 'c2',
        authorId: 'user_alex_drt',
        authorName: 'Alex Rivera',
        authorRole: 'Artisan',
        content: 'I would love to incorporate small bamboo stands into our cold-process botanical soaps! Sending you a message.',
        createdAt: '1 hour ago'
      }
    ],
    sharesCount: 18,
    isPinned: true,
    createdAt: '2026-10-10T14:30:00Z'
  },
  {
    id: 'post_2',
    authorId: 'user_linh_pham',
    authorName: 'Linh Phạm',
    authorHandle: '@linh_finliteracy',
    authorRole: 'Micro-Finance & Tax Literacy Coach',
    title: 'The "Separate Bucket" rule every first-time vendor needs to know',
    content: 'The #1 mistake that causes stress for street vendors and home bakers after 6 months: mingling business cash with personal grocery money.\n\nHere is our free 3-minute habit:\n1. Keep one dedicated envelope or digital bank sub-account strictly for raw supplies & customer receipts.\n2. Pay yourself a fixed modest weekly "wage" rather than dipping in anytime.\n3. Log 2 minutes every evening before closing. Even a plain notebook or the MicroBiz Operations tool will save you 40 hours during tax season.',
    category: 'skill_tip',
    tags: ['Bookkeeping101', 'CashFlow', 'FinancialDiscipline', 'MadeForAll'],
    language: 'both',
    reactions: { like: 67, love: 31, celebrate: 12, insightful: 88, support: 22 },
    comments: [
      {
        id: 'c3',
        authorId: 'user_david_tran',
        authorName: 'David Trần',
        authorRole: 'Repair Cafe Lead',
        content: 'Preach! We did this when launching our neighborhood tool repair bench and it completely eliminated month-end panic.',
        createdAt: '3 hours ago'
      }
    ],
    sharesCount: 45,
    createdAt: '2026-10-11T09:15:00Z'
  },
  {
    id: 'post_3',
    authorId: 'user_david_tran',
    authorName: 'David Trần',
    authorHandle: '@david_repaircafe',
    authorRole: 'Community Maker & Hardware Repair Lead',
    title: 'Repair Cafe Milestone: 200 domestic appliances saved from landfill!',
    content: 'Today our weekend volunteer team fixed our 200th small appliance: a 12-year-old rice cooker brought in by bà Năm from across the alley. The thermal fuse was blown—a 15,000 VND ($0.60) part that took 12 minutes to replace.\n\nNow bà Năm can keep cooking her famous xôi gấc, and we avoided 4 kg of electronic waste. We\'ve documented the step-by-step repair guide into a free course on MicroBiz!',
    category: 'project_update',
    tags: ['RepairCafe', 'RightToRepair', 'ZeroWaste', 'CommunityImpact'],
    language: 'both',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
    reactions: { like: 89, love: 74, celebrate: 52, insightful: 29, support: 41 },
    comments: [],
    sharesCount: 33,
    createdAt: '2026-10-12T04:20:00Z'
  },
  {
    id: 'post_4',
    authorId: 'user_mai_le',
    authorName: 'Mai Lê',
    authorHandle: '@mai_ferments',
    authorRole: 'Culinary Artisan & Micro-Producer',
    title: 'Looking for 3 collaborative testers: Organic Tamarind Ginger Kombucha',
    content: 'We are formulating a new micro-batch probiotic ginger tonic using local wild tamarind from Tây Ninh. Looking for 3 local food creators or cafe owners in District 1/3/Bình Thạnh to test sample bottles and give honest feedback on carbonation, acidity, and retail shelf appeal.\n\nDrop a comment or reply if you would like to test this week!',
    category: 'collaboration_call',
    tags: ['FoodInnovation', 'LocalSourcing', 'ProductTesting', 'KombuchaCraft'],
    language: 'en',
    reactions: { like: 34, love: 18, celebrate: 8, insightful: 12, support: 26 },
    comments: [
      {
        id: 'c4',
        authorId: 'user_alex_drt',
        authorName: 'Alex Rivera',
        authorRole: 'Artisan',
        content: 'Count me in, Mai! Would love to feature them alongside our weekend studio pop-up.',
        createdAt: '45 mins ago'
      }
    ],
    sharesCount: 9,
    createdAt: '2026-10-12T11:00:00Z'
  }
];

export const INITIAL_COURSES: MicroBizCourse[] = [
  {
    id: 'course_bookkeeping_101',
    title: 'Practical Bookkeeping & Cash Flow for Micro-Entrepreneurs',
    slug: 'practical-bookkeeping-micro-entrepreneurs',
    creatorId: 'user_linh_pham',
    creatorName: 'Linh Phạm',
    creatorBio: 'Community accounting advocate & educator with 12 years helping small shops, market vendors, and freelancers gain financial clarity.',
    description: 'Learn real, stress-free money management tailored for sole proprietors, market vendors, and independent makers. No confusing corporate jargon—just daily routines, cash flow tracking, quotation templates, and tax peace of mind.',
    learningObjectives: [
      'Separate personal living expenses from business cash flow without complex software',
      'Track income and expenses in less than 5 minutes daily using the MicroBiz Operations Hub',
      'Calculate true product margins including hidden material waste and your own labor hours',
      'Create clean professional estimates, invoices, and customer receipts'
    ],
    category: 'Financial Literacy & Operations',
    skillLevel: 'Beginner',
    language: 'English & Tiếng Việt',
    estimatedHours: 3.5,
    prerequisites: ['Basic arithmetic', 'A notebook or access to a phone/laptop'],
    coverGradient: 'from-emerald-950 via-slate-900 to-teal-950',
    tags: ['Bookkeeping', 'CashFlow', 'Invoicing', 'MarginCalculation', 'MadeForAll'],
    isPublished: true,
    enrolledStudentsCount: 142,
    completionRatePercent: 78,
    isCommunitySponsored: true,
    averageRating: 4.9,
    reviews: [
      {
        id: 'r1',
        userId: 'user_an_nguyen',
        userName: 'An Nguyễn',
        rating: 5,
        feedback: 'The unit margin calculator formula alone saved my workshop over 4,000,000 VND in unnoticed transport leakages.',
        createdAt: '3 days ago'
      }
    ],
    modules: [
      {
        id: 'mod_1',
        moduleNumber: 1,
        title: 'The Daily Money Habits of Resilient Micro-Businesses',
        description: 'Understand the difference between revenue, gross margin, and net profit.',
        lessons: [
          {
            id: 'les_1_1',
            title: 'Lesson 1: Why Revenue is Vanity and Cash Flow is Sanity',
            estimatedMinutes: 20,
            contentType: 'text',
            bodyText: 'Many enthusiastic entrepreneurs see 20,000,000 VND in customer sales in their first month and celebrate. But if you spent 14,000,000 VND on materials, 3,000,000 VND on packaging and deliveries, and worked 120 hours without paying yourself, your business is actually under immense cash distress.\n\nIn this lesson, we break down:\n1. The 3 Financial Pillars: Inflows (Cash from customers), Cost of Goods Sold (Raw supplies), and Operating Overheads (Utilities, phone, transport).\n2. Why receivables (money promised but not collected) must never be counted as spendable cash.\n3. The Golden 2-Bucket System: Opening an isolated low-fee digital pocket for all business transactions.',
            practicalTask: 'Write down your last 7 business expenses on a single sheet of paper or input them into the MicroBiz Operations ledger. Identify which were true raw material costs vs personal living draws.',
            keyTakeaways: [
              'Revenue minus Cost of Goods Sold equals your Gross Profit.',
              'Never mix personal household grocery money with inventory replenishment funds.',
              'A 5-minute daily bookkeeping habit beats a 20-hour panicked tax weekend every single time.'
            ],
            quiz: [
              {
                id: 'q1',
                prompt: 'If you sell 10 handmade bowls for $200 total, but materials cost $90 and delivery cost $20, what is your gross profit?',
                options: [
                  '$200 (Total revenue received)',
                  '$90 (Remaining after materials)',
                  '$110 (Remaining after materials and direct delivery costs)',
                  '$0'
                ],
                correctOptionIndex: 2,
                explanation: 'Gross profit equals Total Revenue ($200) minus direct cost of goods sold ($90 + $20 = $110), leaving $90 net gross margin.'
              }
            ]
          },
          {
            id: 'les_1_2',
            title: 'Lesson 2: Calculating Your True Unit Production Cost',
            estimatedMinutes: 25,
            contentType: 'practical_exercise',
            bodyText: 'When makers price their goods, they frequently tally only raw materials. But what about the electricity for your oven? What about the 5% scrap waste when cutting fabric or bamboo? And most crucially: what about your human labor?\n\nThe formula for ethical pricing:\nUnit Price = (Raw Materials + Packaging + Pro-rated Utilities + Scrap Factor) + (Hours spent × Fair Living Wage) + (Reinvestment Margin 15-20%).\n\nThis ensures you build a sustainable livelihood rather than running a self-funded hobby that burns you out.',
            practicalTask: 'Pick your bestselling product or service. Itemize every single physical component down to the label sticker and string. Add 30 minutes of labor at your target hourly rate.',
            keyTakeaways: [
              'Your labor is a real production expense, not free bonus time.',
              'Include a 5-10% buffer for imperfect batches, test runs, and material shrinkage.',
              'A business that does not earn a reinvestment margin cannot replace broken tools or buy bulk supplies.'
            ]
          }
        ]
      },
      {
        id: 'mod_2',
        moduleNumber: 2,
        title: 'Mastering Quotations, Invoices & Receipt Records',
        description: 'How to communicate clear prices, issue professional invoices, and prevent customer disputes.',
        lessons: [
          {
            id: 'les_2_1',
            title: 'Lesson 3: Creating Clear Estimates and Invoices with Zero Confusion',
            estimatedMinutes: 30,
            contentType: 'text',
            bodyText: 'A polite, itemized estimate transforms a casual inquiry into a committed order. It establishes expectations upfront: quantity, unit specifications, delivery timeline, deposit requirements (typically 50% for custom work), and payment methods.\n\nIn this lesson, you will practice using the MicroBiz Quotation & Invoice generator to output customer-facing documents that build trust.',
            practicalTask: 'Draft a sample 3-item invoice for a mock customer with subtotal, discount, and payment instructions.',
            keyTakeaways: [
              'Always specify turnaround dates and payment terms on every quote.',
              'Collect a deposit before purchasing custom or non-returnable materials.',
              'Save copies of every sent quote and marked-paid invoice.'
            ]
          }
        ]
      }
    ],
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-10-01T12:00:00Z'
  },
  {
    id: 'course_bamboo_craft',
    title: 'Sustainable Bamboo Handcrafts: From Raw Culm to Modern Home Goods',
    slug: 'sustainable-bamboo-handcrafts',
    creatorId: 'user_an_nguyen',
    creatorName: 'An Nguyễn',
    creatorBio: 'Third-generation artisan from Bến Tre combining traditional steam-bending with contemporary minimalist design.',
    description: 'Learn sustainable bamboo harvesting, natural pest treatment without toxic chemicals, hand splitting, sanding, and crafting durable kitchenware, tea accessories, and desktop organizers.',
    learningObjectives: [
      'Identify mature bamboo species suitable for bending vs structural load',
      'Master natural borax-salt curing techniques to prevent borer beetles',
      'Create 3 functional finished products: tea strainer, desktop organizer, and curved phone dock',
      'Photograph and write compelling product descriptions for local and online buyers'
    ],
    category: 'Crafts, Making & Design',
    skillLevel: 'Beginner',
    language: 'Tiếng Việt & English',
    estimatedHours: 5.0,
    prerequisites: ['Basic safety goggles', 'Hand carving knife or pull saw'],
    coverGradient: 'from-amber-950 via-stone-900 to-emerald-950',
    tags: ['Bamboo', 'Handmade', 'CircularEconomy', 'EcoDesign', 'ArtisanSkills'],
    isPublished: true,
    enrolledStudentsCount: 89,
    completionRatePercent: 82,
    isCommunitySponsored: false,
    averageRating: 4.95,
    reviews: [],
    modules: [
      {
        id: 'mod_b1',
        moduleNumber: 1,
        title: 'Material Selection, Curing & Safety Foundations',
        description: 'Selecting mature bamboo and natural preserving methods.',
        lessons: [
          {
            id: 'les_b1_1',
            title: 'Selecting Mature Culms & Safe Hand Splitting',
            estimatedMinutes: 30,
            contentType: 'text',
            bodyText: 'Bamboo should be harvested between 3 to 5 years of age. Immature bamboo contains excessive starch that attracts powder-post beetles and warps as it dries. In this lesson, learn how to inspect node density, ring coloration, and execute clean longitudinal grain splitting using a standard knife and wooden mallet.',
            keyTakeaways: [
              'Harvest in the dry season when sap content is naturally lowest.',
              'Always cut along grain lines away from your body with proper hand placement.'
            ]
          }
        ]
      }
    ],
    createdAt: '2026-04-10T11:00:00Z',
    updatedAt: '2026-09-15T08:00:00Z'
  },
  {
    id: 'course_repair_electronics',
    title: 'Repair Cafe Foundations: Small Home Appliance Diagnosis & Fixes',
    slug: 'repair-cafe-small-appliance-diagnosis',
    creatorId: 'user_david_tran',
    creatorName: 'David Trần',
    creatorBio: 'Hardware hacker, electronics technician & neighborhood repair cafe coordinator.',
    description: 'Stop throwing away blenders, rice cookers, fans, and electric kettles! Learn multimeter safety, continuity testing, cord replacement, and thermal fuse diagnosis.',
    learningObjectives: [
      'Practice electrical safety: discharging capacitors and isolating mains power',
      'Use a $10 digital multimeter to find broken wires, blown thermal fuses, and faulty switches',
      'Organize a 1-day community repair pop-up in your neighborhood community center'
    ],
    category: 'Technology & Repair',
    skillLevel: 'Beginner',
    language: 'English & Tiếng Việt',
    estimatedHours: 4.0,
    prerequisites: ['Digital multimeter', 'Philips screwdrivers'],
    coverGradient: 'from-cyan-950 via-slate-900 to-indigo-950',
    tags: ['Repair', 'Electronics', 'RightToRepair', 'NeighborhoodSkills'],
    isPublished: true,
    enrolledStudentsCount: 116,
    completionRatePercent: 85,
    isCommunitySponsored: true,
    averageRating: 4.88,
    reviews: [],
    modules: [
      {
        id: 'mod_r1',
        moduleNumber: 1,
        title: 'Safety First & Basic Continuity Diagnostic',
        description: 'Using a multimeter to isolate common open-circuit faults.',
        lessons: [
          {
            id: 'les_r1_1',
            title: 'The 3 Most Common Appliance Failures (And how to find them in 5 minutes)',
            estimatedMinutes: 25,
            contentType: 'text',
            bodyText: 'Over 70% of discarded small countertop appliances suffer from only one of three easily fixable problems:\n1. A fractured power cord right near the strain relief boot.\n2. A tripped one-time thermal fuse (costs 50 cents) placed to protect the heating coil.\n3. Carbonized microswitch contacts.\n\nUsing continuity beep mode on your multimeter, you can find the fault without touching live electricity.',
            keyTakeaways: [
              'Always disconnect appliance completely from the wall socket before opening.',
              'Continuity mode beeps when electrical pathway is unbroken and stays silent when a wire or fuse is severed.'
            ]
          }
        ]
      }
    ],
    createdAt: '2026-05-20T14:00:00Z',
    updatedAt: '2026-09-28T16:00:00Z'
  }
];

export const INITIAL_GROUPS: CommunityGroup[] = [
  {
    id: 'grp_eco_crafts',
    name: 'Eco-Crafts & Sustainable Goods Network',
    slug: 'eco-crafts-sustainable-goods',
    category: 'Circular Economy & Crafting',
    description: 'A mutual-aid community of artisans, weavers, woodworkers, and natural botanical makers sharing bulk materials, off-cuts, market booths, and eco-packaging tips.',
    locality: 'Vietnam & Southeast Asia',
    membersCount: 342,
    tags: ['SustainableDesign', 'Bamboo', 'NaturalDyes', 'ZeroWaste'],
    avatarGradient: 'from-emerald-600 to-teal-800',
    isPublic: true,
    members: [
      { userId: 'user_an_nguyen', name: 'An Nguyễn', role: 'lead', joinedAt: '2026-01-10' },
      { userId: 'user_alex_drt', name: 'Alex Rivera', role: 'member', joinedAt: '2026-02-15' }
    ],
    discussions: [
      {
        id: 'disc_1',
        authorId: 'user_an_nguyen',
        authorName: 'An Nguyễn',
        title: 'Group bulk order for unbleached organic cotton bags (Save 35%)',
        body: 'We are placing an order for 2,000 unbleached drawstring bags from a fair-trade weaving guild in Quảng Nam. Anyone wanting between 50 and 200 bags can co-share the bulk factory price.',
        repliesCount: 16,
        createdAt: '1 day ago'
      }
    ]
  },
  {
    id: 'grp_fin_literacy',
    name: 'Digital Literacy & Freelance Microbiz Circle',
    slug: 'digital-literacy-freelance-microbiz',
    category: 'Business & Skills',
    description: 'Peer support for solo founders, market vendors, and freelancers navigating invoicing, contracts, digital presence, and sustainable livelihood building.',
    locality: 'All Regions',
    membersCount: 580,
    tags: ['Bookkeeping', 'FreelanceLife', 'FairPricing', 'DigitalTools'],
    avatarGradient: 'from-blue-600 to-indigo-800',
    isPublic: true,
    members: [
      { userId: 'user_linh_pham', name: 'Linh Phạm', role: 'lead', joinedAt: '2026-01-05' }
    ],
    discussions: [
      {
        id: 'disc_2',
        authorId: 'user_linh_pham',
        authorName: 'Linh Phạm',
        title: 'Weekly Q&A: Ask any question about pricing your services',
        body: 'Post your current service and price, and community mentors will help you review whether you are covering overheads and retirement cushion.',
        repliesCount: 29,
        createdAt: '2 days ago'
      }
    ]
  },
  {
    id: 'grp_repair_cafe',
    name: 'Neighborhood Repair & Circular Economy Collective',
    slug: 'repair-circular-economy-collective',
    category: 'Community Repair',
    description: 'Volunteers and local tinkerers fixing clothes, electronics, furniture, and bicycles for neighbors while fostering self-reliance and reducing landfill waste.',
    locality: 'Ho Chi Minh City, Da Nang & Hanoi',
    membersCount: 280,
    tags: ['FixIt', 'RepairCafe', 'RightToRepair', 'MutualAid'],
    avatarGradient: 'from-amber-600 to-orange-800',
    isPublic: true,
    members: [
      { userId: 'user_david_tran', name: 'David Trần', role: 'lead', joinedAt: '2026-02-01' }
    ],
    discussions: []
  }
];

export const INITIAL_PROJECTS: CollaborativeProject[] = [
  {
    id: 'proj_zerowaste_stand',
    title: 'Weekend Zero-Waste Community Market Collective Stand',
    description: 'Co-renting a shared central booth at the District 2 Weekend Green Market so individual solo artisans (who cannot afford a 3,000,000 VND single stall alone) can display their wares collaboratively.',
    initiatorName: 'An Nguyễn & Alex Rivera',
    groupId: 'grp_eco_crafts',
    goals: [
      'Share single stall cost across 6 micro-makers (500,000 VND each)',
      'Organize joint payment QR code and shared packaging station',
      'Cross-promote all 6 makers with a collaborative physical brochure'
    ],
    contributorsCount: 5,
    targetDeadline: '2026-11-01',
    status: 'active',
    tags: ['SharedRetail', 'LocalMarket', 'CollaborativeCommerce'],
    openPositions: ['1 Food Artisan (Granola/Tea)', '1 Volunteer Greeter / Cashier'],
    tasks: [
      { id: 't1', title: 'Submit joint vendor permit application', status: 'completed', assigneeName: 'An Nguyễn' },
      { id: 't2', title: 'Assemble modular bamboo display tiers', status: 'in_progress', assigneeName: 'Alex Rivera' },
      { id: 't3', title: 'Print unified inventory price list', status: 'todo' }
    ]
  },
  {
    id: 'proj_open_invoices',
    title: 'Open-Source Micro-Enterprise Invoice & Receipt Templates (VI/EN)',
    description: 'Creating free, bilingual, easy-to-use spreadsheet and print templates designed specifically for Vietnamese home businesses and micro-exporters.',
    initiatorName: 'Linh Phạm',
    groupId: 'grp_fin_literacy',
    goals: [
      'Design clean PDF/spreadsheet formats with automatic VAT/discount calculations',
      'Include simple Vietnamese & English terminology side-by-side',
      'Test with 20 real street and home vendors'
    ],
    contributorsCount: 8,
    targetDeadline: '2026-10-30',
    status: 'active',
    tags: ['OpenTemplates', 'FinancialTools', 'BilingualSupport'],
    openPositions: ['Figma/Typography Designer', 'Excel/Sheets Formula Checker'],
    tasks: [
      { id: 't4', title: 'Compile mandatory tax invoice line items per local decree', status: 'completed' },
      { id: 't5', title: 'Create mobile-friendly PDF layout', status: 'in_progress' }
    ]
  }
];

export const INITIAL_BUSINESSES: MicroBusiness[] = [
  {
    id: 'biz_treviet',
    ownerId: 'user_an_nguyen',
    name: 'Tre Việt Artisan Studio',
    tagline: 'Handcrafted natural bamboo kitchenware & sustainable desk decor',
    category: 'Eco-Crafts & Home Goods',
    story: 'Born from a family tradition in Bến Tre, Tre Việt transforms sustainably harvested bamboo into minimalist, food-safe home accessories. Every item is treated naturally without formaldehyde, preserving the organic scent and silky grain of natural bamboo.',
    contactEmail: 'contact@treviet.crafts',
    contactPhone: '+84 908 123 456',
    locationCity: 'Bến Tre & Ho Chi Minh City',
    reputationScore: 98,
    completedInquiriesCount: 64,
    isVerified: true,
    coverGradient: 'from-emerald-950 via-stone-900 to-amber-950',
    listings: [
      {
        id: 'list_bamboo_teaset',
        businessId: 'biz_treviet',
        title: 'Hand-Carved Bamboo Tea Strainer & Tongs Set',
        type: 'product',
        description: 'Made from 4-year cured green bamboo. Features ultra-fine natural slits that strain loose-leaf tea effortlessly without plastic or metallic aftertaste. Finished with organic walnut oil.',
        priceAmount: 180000,
        currency: 'VND',
        unit: 'per set (~$7.20 USD)',
        estimatedTurnaround: 'In stock (1-2 days shipping)',
        inStock: true,
        category: 'Kitchen & Dining',
        tags: ['TeaCulture', 'Handmade', 'PlasticFree', 'ZeroWaste'],
        createdAt: '2026-08-01'
      },
      {
        id: 'list_bamboo_dock',
        businessId: 'biz_treviet',
        title: 'Minimalist Curved Bamboo Phone & Tablet Stand',
        type: 'product',
        description: 'Ergonomic natural desk dock with integrated cable slot and acoustic sound-amplification cavity. Holds any smartphone or e-reader securely at a 60-degree viewing angle.',
        priceAmount: 140000,
        currency: 'VND',
        unit: 'per piece (~$5.60 USD)',
        estimatedTurnaround: 'In stock (Ready to ship)',
        inStock: true,
        category: 'Workspace & Tech Accessories',
        tags: ['DeskSetup', 'Minimalist', 'BambooTech'],
        createdAt: '2026-08-15'
      },
      {
        id: 'list_bamboo_workshop',
        businessId: 'biz_treviet',
        title: 'Half-Day Bamboo Splitting & Carving Workshop (Weekend)',
        type: 'workshop',
        description: 'Hands-on 3.5-hour workshop in District 3. You will learn culm selection, knife splitting technique, and craft your own personalized bamboo butter knife and chopsticks to take home.',
        priceAmount: 450000,
        currency: 'VND',
        unit: 'per attendee (~$18 USD, materials included)',
        estimatedTurnaround: 'Every Saturday morning',
        inStock: true,
        category: 'Classes & Experiences',
        tags: ['Workshop', 'Handcraft', 'WeekendActivity'],
        createdAt: '2026-09-01'
      }
    ]
  },
  {
    id: 'biz_huongdong',
    ownerId: 'user_mai_le',
    name: 'Hương Đồng Wild Ferments',
    tagline: 'Traditional probiotic kombucha, ginger tonics & fermented hot sauces',
    category: 'Artisanal Culinary & Wellness',
    story: 'We ferment in small 10-liter ceramic jars using local highland green tea, wild raw honey from Gia Lai, and sun-ripened tropical fruit. Pure living probiotics with zero artificial carbonation.',
    contactEmail: 'hello@huongdongferments.vn',
    locationCity: 'District 2, Ho Chi Minh City',
    reputationScore: 96,
    completedInquiriesCount: 82,
    isVerified: true,
    coverGradient: 'from-rose-950 via-stone-900 to-amber-950',
    listings: [
      {
        id: 'list_kombucha_pack',
        businessId: 'biz_huongdong',
        title: 'Living Probiotic Kombucha 4-Bottle Tasting Flight (500ml)',
        type: 'product',
        description: 'Includes 4 seasonal botanical flavors: Highland Jasmine & Peach, Tây Ninh Wild Tamarind Ginger, Hibiscus Mint, and Lemongrass Dragonfruit.',
        priceAmount: 220000,
        currency: 'VND',
        unit: 'per 4-pack (~$8.80 USD)',
        estimatedTurnaround: 'Bottled fresh twice weekly',
        inStock: true,
        category: 'Beverages & Health',
        tags: ['Probiotic', 'ArtisanFood', 'RawFermented'],
        createdAt: '2026-07-20'
      },
      {
        id: 'list_scoby_kit',
        businessId: 'biz_huongdong',
        title: 'Home Fermentation Starter Kit (Organic SCOBY + Starter Liquid)',
        type: 'product',
        description: 'Strong, active heirloom mother culture sealed with 300ml mature strong starter fluid. Includes printed 4-page troubleshooting cheat sheet and support forum access.',
        priceAmount: 110000,
        currency: 'VND',
        unit: 'per culture kit (~$4.40 USD)',
        estimatedTurnaround: 'Ships same day',
        inStock: true,
        category: 'DIY Fermentation',
        tags: ['HomeBrewing', 'GutHealth', 'BeginnerFriendly'],
        createdAt: '2026-08-10'
      }
    ]
  },
  {
    id: 'biz_botanical_soap',
    ownerId: 'user_alex_drt',
    name: 'Mầm Xanh Botanical Studio',
    tagline: 'Cold-process artisanal soaps with Vietnamese therapeutic herbs & cold-pressed oils',
    category: 'Natural Skincare & Self-Care',
    story: 'Founded by Alex Rivera, Mầm Xanh formulates gentle, palm-oil-free cold-process soaps cured for 6 weeks. Sourced from local smallholder herb gardens: mugwort (ngải cứu), turmeric (nghệ vàng), and betel leaf (lá trầu không).',
    contactEmail: 'alex.rivera@microbiz.community',
    locationCity: 'District 3, Ho Chi Minh City',
    reputationScore: 97,
    completedInquiriesCount: 38,
    isVerified: true,
    coverGradient: 'from-teal-950 via-slate-900 to-rose-950',
    listings: [
      {
        id: 'list_mugwort_soap',
        businessId: 'biz_botanical_soap',
        title: 'Mugwort & Green Tea Calm Bar (Cold-Process 110g)',
        type: 'product',
        description: 'Infused with organic wild mugwort (ngải cứu) and crushed Thái Nguyên green tea. Formulated with extra unrefined shea butter for sensitive or eczema-prone skin. 100% biodegradable.',
        priceAmount: 95000,
        currency: 'VND',
        unit: 'per 110g bar (~$3.80 USD)',
        estimatedTurnaround: 'In stock (Cured and ready to ship)',
        inStock: true,
        category: 'Botanical Skincare',
        tags: ['HerbalSoap', 'PalmOilFree', 'SensitiveSkin', 'Handmade'],
        createdAt: '2026-09-05'
      },
      {
        id: 'list_custom_favors',
        businessId: 'biz_botanical_soap',
        title: 'Custom Botanical Wedding & Corporate Gift Bundles (Set of 30+)',
        type: 'service',
        description: 'Custom stamped mini-bars with bespoke botanical scents, custom recycled paper band branding, and personalized gift tags. Minimum lead time 4 weeks for fresh curing.',
        priceAmount: 1800000,
        currency: 'VND',
        unit: 'per 30-piece batch (~$72 USD)',
        estimatedTurnaround: '3-4 weeks curing time',
        inStock: true,
        category: 'Custom Orders & Gifting',
        tags: ['BespokeGifts', 'EcoFavors', 'CustomBranding'],
        createdAt: '2026-09-12'
      }
    ]
  }
];

export const INITIAL_FINANCIAL_RECORDS: FinancialRecord[] = [
  {
    id: 'fin_demo_1',
    userId: 'demo_seed_sample',
    type: 'income',
    category: 'Product Sales',
    amount: 950000,
    currency: 'VND',
    counterparty: 'Weekend Green Market Customers (10 Soap Bars)',
    date: '2026-10-10',
    paymentMethod: 'Bank Transfer',
    description: 'Direct sales of Mugwort and Turmeric soap bars during Saturday pop-up.',
    isDemoSeed: true,
    createdAt: '2026-10-10T17:00:00Z'
  },
  {
    id: 'fin_demo_2',
    userId: 'demo_seed_sample',
    type: 'expense',
    category: 'Raw Materials',
    amount: 420000,
    currency: 'VND',
    counterparty: 'Chợ Lớn Herbal Wholesaler (Tiệm Thuốc Bắc Vạn An)',
    date: '2026-10-08',
    paymentMethod: 'Cash',
    description: 'Purchased 2kg dried organic mugwort and 1kg turmeric root powder.',
    isOcrExtracted: true,
    isDemoSeed: true,
    documentRef: 'receipt_herbs_oct08.jpg',
    createdAt: '2026-10-08T10:30:00Z'
  },
  {
    id: 'fin_demo_3',
    userId: 'demo_seed_sample',
    type: 'expense',
    category: 'Packaging & Labels',
    amount: 150000,
    currency: 'VND',
    counterparty: 'An Phú Recycled Paper Print Shop',
    date: '2026-10-05',
    paymentMethod: 'Momo / ZaloPay',
    description: 'Batch of 100 compostable kraft paper wrapper sleeves with soy ink printing.',
    isDemoSeed: true,
    createdAt: '2026-10-05T14:15:00Z'
  },
  {
    id: 'fin_demo_4',
    userId: 'demo_seed_sample',
    type: 'income',
    category: 'Custom Commission',
    amount: 1800000,
    currency: 'VND',
    counterparty: 'Green Lotus Yoga Studio (Custom studio favors)',
    date: '2026-10-02',
    paymentMethod: 'Bank Transfer',
    description: '50% deposit for 30 custom stamped lavender lemongrass gift bars.',
    isDemoSeed: true,
    createdAt: '2026-10-02T09:00:00Z'
  },
  {
    id: 'fin_demo_5',
    userId: 'demo_seed_sample',
    type: 'expense',
    category: 'Booth Fee & Transport',
    amount: 250000,
    currency: 'VND',
    counterparty: 'Saigon Eco Market Collective',
    date: '2026-09-28',
    paymentMethod: 'Bank Transfer',
    description: 'Shared co-booth fee for 1 full weekend Saturday/Sunday.',
    isDemoSeed: true,
    createdAt: '2026-09-28T16:00:00Z'
  }
];

export const INITIAL_BUSINESS_GOALS: BusinessGoal[] = [
  {
    id: 'goal_1',
    title: 'Achieve 3,000,000 VND Net Monthly Profit from Artisan Goods',
    targetMetric: 'Monthly Net Margin',
    currentValue: 1930000,
    targetValue: 3000000,
    deadline: '2026-11-30',
    isAchieved: false
  },
  {
    id: 'goal_2',
    title: 'Launch 3 Standardized Product Listings on MicroBiz Storefront',
    targetMetric: 'Published Active Listings',
    currentValue: 2,
    targetValue: 3,
    deadline: '2026-10-25',
    isAchieved: false
  },
  {
    id: 'goal_3',
    title: 'Maintain 100% Daily Bookkeeping Streak for 14 Days',
    targetMetric: 'Daily Logged Days',
    currentValue: 9,
    targetValue: 14,
    deadline: '2026-10-20',
    isAchieved: false
  }
];

export const INITIAL_MODERATION_REPORTS: ModerationReport[] = [
  {
    id: 'rep_1',
    targetType: 'listing',
    targetId: 'list_external_supplements',
    targetTitle: 'Miracle Cure Weight Loss Detox Tea',
    reporterUserId: 'user_alex_drt',
    reason: 'misleading_claims',
    notes: 'Seller claims tea cures diabetes and hypertension in 3 days with no medical evidence. Violates Dr. T health protection boundaries.',
    status: 'reviewed_removed',
    createdAt: '2026-10-09T08:00:00Z'
  },
  {
    id: 'rep_2',
    targetType: 'post',
    targetId: 'post_spam_crypto',
    targetTitle: 'Guaranteed 500% Returns in 24 Hours WhatsApp Group',
    reporterUserId: 'user_linh_pham',
    reason: 'unsolicited_spam',
    notes: 'Automated spam message directing users to a suspicious external messaging channel.',
    status: 'reviewed_removed',
    createdAt: '2026-10-11T03:15:00Z'
  }
];
