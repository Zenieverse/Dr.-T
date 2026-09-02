import { Mentor, MarketplaceItem, TribPassport } from '../types';

export const MOCK_MENTORS: Mentor[] = [
  {
    id: 'mentor_simard',
    name: 'Dr. Thao Nguyen, Ph.D.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    title: 'Senior Forest Ecologist & Mycorrhizal Researcher',
    branchId: 'earth',
    bio: 'Dedicated 20 years to studying old-growth Dipterocarp canopies and mycorrhizal networks across Southeast Asia and the Pacific Northwest. Passionate about mentoring young naturalists.',
    languages: ['English', 'Vietnamese', 'French'],
    rating: 4.98,
    sessionsCompleted: 142,
    availability: 'Tuesday & Thursday Evenings (GMT+7)',
    focusAreas: ['Forest Ecology', 'Soil Mycology', 'Agroforestry Design', 'Citizen Science'],
    sessionType: '1-on-1 Dialogue',
    tCoinsContribution: 15,
    isVerified: true,
    institutionAffiliation: 'Vietnam National Forestry University'
  },
  {
    id: 'mentor_ba_trieu',
    name: 'Elder Ba Triệu (72)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    title: 'Heritage Seed Keeper & Mekong Agroecologist',
    branchId: 'agriculture',
    bio: 'Preserved over 50 native floating rice landraces and traditional companion planting secrets. Welcoming young learners eager to preserve biological seed heritage.',
    languages: ['Vietnamese'],
    rating: 5.0,
    sessionsCompleted: 88,
    availability: 'Weekend Mornings (GMT+7)',
    focusAreas: ['Heritage Rice', 'Seed Saving', 'Natural Pest Balance', 'Elder-Youth Bridge'],
    sessionType: 'Elder-Youth Bridge',
    tCoinsContribution: 10,
    isVerified: true,
    institutionAffiliation: 'Mekong Seed Guardians Guild'
  },
  {
    id: 'mentor_socrates',
    name: 'Elena Rostova, M.A.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    title: 'Comparative Literature & Socratic Epistemologist',
    branchId: 'literature',
    bio: 'Specializing in world poetry, classical translation, and Socratic inquiry. Believes every person has an original literary voice waiting to be discovered.',
    languages: ['English', 'Spanish', 'Russian', 'German'],
    rating: 4.95,
    sessionsCompleted: 215,
    availability: 'Monday, Wednesday, Friday (Flexible GMT)',
    focusAreas: ['Socratic Reading', 'Poetic Translation', 'Philosophy of Language', 'Creative Writing'],
    sessionType: 'Story Circle',
    tCoinsContribution: 20,
    isVerified: true,
    institutionAffiliation: 'International Comparative Literature Society'
  },
  {
    id: 'mentor_master_thanh',
    name: 'Master Nguyễn Khắc Thành',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    title: 'Traditional Bamboo Master Carpenter & Passive Architect',
    branchId: 'skills',
    bio: 'Master craftsman from Chàng Sơn village with 40 years of experience building nail-less bamboo structures, passive solar pavilions, and wooden watermills.',
    languages: ['Vietnamese', 'English (Basic)'],
    rating: 4.97,
    sessionsCompleted: 96,
    availability: 'Saturday Afternoons (GMT+7)',
    focusAreas: ['Bamboo Joinery', 'Passive Solar Architecture', 'Traditional Tools', 'Wood Curing'],
    sessionType: 'Apprenticeship',
    tCoinsContribution: 15,
    isVerified: true,
    institutionAffiliation: 'Chàng Sơn Heritage Guild'
  }
];

export const MOCK_MARKETPLACE_ITEMS: MarketplaceItem[] = [
  {
    id: 'market_seed_kit',
    title: 'Indigenous Agroforestry Seed & Mycorrhizal Inoculant Kit',
    creator: 'Mekong Seed Guardians & Ba Triệu',
    creatorBio: 'Community seed cooperative preserving heirloom vegetables and native nitrogen-fixing trees.',
    category: 'Seed & Agro Kit',
    priceUSD: 24,
    priceTCoins: 48,
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop&q=80',
    description: 'A curated starter pack of 8 heirloom vegetable varieties, 2 native nitrogen-fixing tree species (Sesbania & Acacia auriculiformis), and organic mycorrhizal bio-inoculant spores.',
    poolSplit: {
      creator: 60,
      operations: 20,
      community: 10,
      education: 5,
      earth: 5
    },
    impactBenefit: 'Funds heirloom seed bank preservation and plants 2 native trees in the Mekong Wetland Grove.',
    treesPlantedOnPurchase: 2,
    reviewsCount: 84,
    rating: 4.96
  },
  {
    id: 'market_wood_wide_book',
    title: 'The Living Canopy: Annotated Master Edition & Field Map',
    creator: 'Dr. Thao Nguyen & Forest Ecology Collective',
    creatorBio: 'Published under open-access print commons with hand-drawn botanical illustrations.',
    category: 'Book',
    priceUSD: 18,
    priceTCoins: 36,
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=80',
    description: 'Illustrated hardcover field book detailing 120 tropical tree species, their root depths, mycorrhizal affinities, and traditional medicinal uses.',
    poolSplit: {
      creator: 60,
      operations: 20,
      community: 10,
      education: 5,
      earth: 5
    },
    impactBenefit: 'Provides free translated digital copies to 5 rural forestry students and funds 1 native hardwood tree.',
    treesPlantedOnPurchase: 1,
    reviewsCount: 132,
    rating: 4.98
  },
  {
    id: 'market_bamboo_workshop',
    title: 'Master Workshop: Building a Nail-less Bamboo Pavilion (Live 4-Session Circle)',
    creator: 'Master Nguyễn Khắc Thành',
    creatorBio: 'Heritage craft master teaching traditional mortise-and-tenon vernacular carpentry.',
    category: 'Live Workshop',
    priceUSD: 45,
    priceTCoins: 90,
    image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&auto=format&fit=crop&q=80',
    description: 'Hands-on interactive masterclass covering bamboo selection, mud curing, mortise cutting, and typhoon-resilient spatial framing.',
    poolSplit: {
      creator: 65,
      operations: 15,
      community: 10,
      education: 5,
      earth: 5
    },
    impactBenefit: 'Sponsors apprenticeship stipends for young rural carpenters in Chàng Sơn village.',
    treesPlantedOnPurchase: 3,
    reviewsCount: 42,
    rating: 5.0
  }
];

export const INITIAL_TRIB_PASSPORT: TribPassport = {
  passportId: 'TRIB-PASS-2026-8849',
  userName: 'Sovereign Knowledge Seeker',
  journeyStartedDate: '2026-08-30',
  rankTitle: '🌿 Canopy Steward & Living Reader',
  badges: [
    {
      id: 'badge_curious_beginner',
      name: '🌱 Curious Beginner',
      icon: '🌱',
      description: 'Entered the Living Treehouse Commons and asked your first deep question to Trib.',
      unlockedAt: '2026-08-30',
      category: 'READING'
    },
    {
      id: 'badge_mycelium_reader',
      name: '🌿 Deep Canopy Reader',
      icon: '📚',
      description: 'Read for over 45 minutes in Slow Reading Mode with Zen ambient soundscapes.',
      unlockedAt: '2026-08-30',
      category: 'READING'
    },
    {
      id: 'badge_earth_steward',
      name: '🌳 Grove Steward',
      icon: '🌳',
      description: 'Supported your first native tree in the Vietnam Ancestral Forest Grove.',
      unlockedAt: '2026-08-30',
      category: 'EARTH'
    },
    {
      id: 'badge_future_keeper',
      name: '🕰 Future Keeper',
      icon: '🌌',
      description: 'Sealed a cryptographic letter to the year 2126 in the 100-Year Branch.',
      unlockedAt: '2026-08-30',
      category: 'FUTURE'
    }
  ],
  flourishingMetrics: {
    booksRead: 4,
    questionsExplored: 18,
    leavesCreated: 7,
    mentorshipHours: 2.5,
    treesGrown: 3,
    oralHistoriesPreserved: 2,
    tCoinsDividendsReturned: 45
  }
};
