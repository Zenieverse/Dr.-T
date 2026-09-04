// =========================================================================
// TRIB-HOUSE: THE LIVING LIBRARY IN THE TREES
// Type Definitions for Core Domain, Knowledge Graph, Forest & Commons
// =========================================================================

export type TribRoom = 
  | 'village'      // Treehouse Village Home
  | 'library'      // Reading Nest, Catalogue & Ingest
  | 'reader'       // Full Immersion Slow Reader
  | 'forest'       // My Sovereign Knowledge Forest & Flourishing
  | 'graph'        // Living Knowledge Graph Explorer
  | 'stories'      // Community Knowledge Forest & Voice Archive
  | 'learn'        // Learning Paths & Mentorship Commons
  | 'future'       // 100-Year Branch & Future Letters Time Capsule
  | 'earth'        // Knowledge-to-Ground, Groves & TreeLedger
  | 'market'       // Commons Market & 5-Pool Economy
  | 'zen'          // Zen Sanctuary, 4-7-8 Breathing & Forest Audio
  | 'charter';     // Trib-House Charter & 100-Year Governance

export type TribRoomId = TribRoom;
export type TribHouseView = 'village' | 'campus' | 'canopy' | 'reading' | 'graph' | 'forest' | 'groves' | 'century' | 'community' | 'paths' | 'mentorship' | 'market' | 'living-forests';
export type ProvenanceBadge = ProvenanceType;
export type Chapter = BookChapter;
export type LearningPathDay = LearningDay;
export type LeafType = 'NOTE' | 'HIGHLIGHT' | 'QUESTION' | 'IDEA_SEED' | 'COMPLETED_BOOK' | 'MILESTONE';

export type KnowledgeBranchId = 
  | 'seedlings'    // 🌱 Seedlings — beginners & children
  | 'literature'   // 📚 Literature & World Poetry
  | 'science'      // 🔬 Science & Physics
  | 'mind'         // 🧠 Mind, Consciousness & Philosophy
  | 'health'       // 🩺 Health & Holistic Wellbeing
  | 'earth'        // 🌏 Earth, Climate & Ecology
  | 'agriculture'  // 🌾 Living Soil & Agroecology
  | 'technology'   // 💻 Open Tech, AI & Digital Literacy
  | 'arts'         // 🎨 Visual Arts & Creativity
  | 'music'        // 🎵 Soundscapes & World Music
  | 'history'      // 🏛 World History & Civilizations
  | 'languages'    // 🗣 Living Languages & Translation
  | 'skills'       // 🧰 Traditional Crafts & Making
  | 'work'         // 💼 Ethical Livelihood & Commons
  | 'family'       // 👨‍👩‍👧 Intergenerational Wisdom
  | 'future'       // 🌌 Speculative Thought & Century Horizon
  | 'indigenous'   // 🪶 Local Culture & Traditional Ecological Knowledge
  | 'zen';         // ☯ Contemplation & Slow Knowledge

export interface KnowledgeBranch {
  id: KnowledgeBranchId;
  name: string;
  icon: string;
  color: string;
  tagline: string;
  subtitle?: string;
  description: string;
  associatedTreeSpecies?: string;
  subtopics?: string[];
  bookCount: number;
  nodeCount: number;
  activeLearners: number;
}

export type ProvenanceType = 
  | 'PRIMARY_SOURCE'
  | 'OPEN_ACCESS'
  | 'PUBLIC_DOMAIN'
  | 'PEER_REVIEWED'
  | 'COMMUNITY'
  | 'EXPERT_REVIEWED'
  | 'AI_ASSISTED'
  | 'HISTORICAL_SOURCE'
  | 'UNVERIFIED';

export type BookFormat = 'PDF' | 'EPUB' | 'TXT' | 'MD' | 'DOCX' | 'AUDIO';

export interface BookChapter {
  id: string;
  title: string;
  pageNumber: number;
  readTimeMinutes: number;
  content: string;
}

export interface Book {
  id: string;
  title: string;
  originalTitle?: string;
  author: string;
  authorBio?: string;
  coverImage: string;
  language: string;
  originalLanguage?: string;
  branchId: KnowledgeBranchId;
  year: number;
  pages: number;
  format: BookFormat;
  provenance: ProvenanceType;
  provenanceDetails: string;
  description: string;
  summary: string;
  keyTakeaways: string[];
  chapters: BookChapter[];
  fullText?: string;
  tags: string[];
  citationsCount: number;
  readingTimeMinutes: number;
  associatedGroveId?: string;
  associatedTreeSpecies?: string;
  downloadUrl?: string;
  sourceUrl?: string;
  isPublicDomain?: boolean;
}

// -------------------------------------------------------------
// Knowledge Graph
// -------------------------------------------------------------

export type NodeType = 
  | 'Idea' 
  | 'Book' 
  | 'Author' 
  | 'Topic' 
  | 'Place' 
  | 'Event' 
  | 'Species' 
  | 'Language' 
  | 'Institution' 
  | 'Question' 
  | 'Story' 
  | 'Artifact';

export type RelationType = 
  | 'inspired_by'
  | 'cites'
  | 'contradicts'
  | 'expands'
  | 'translates'
  | 'teaches'
  | 'located_in'
  | 'written_by'
  | 'related_to'
  | 'derived_from'
  | 'answers'
  | 'questions'
  | 'historically_precedes'
  | 'scientifically_supports'
  | 'culturally_related';

export interface KnowledgeNode {
  id: string;
  label: string;
  type: NodeType;
  branchId: KnowledgeBranchId;
  description: string;
  era?: string;
  significance: string;
  provenance: ProvenanceType;
  x?: number;
  y?: number;
  connectionsCount?: number;
}

export interface KnowledgeEdge {
  id: string;
  source: string;
  target: string;
  relation: RelationType;
  explanation: string;
  weight?: number;
}

// -------------------------------------------------------------
// Personal Sovereign Knowledge Forest
// -------------------------------------------------------------

export interface ForestLeaf {
  id: string;
  title: string;
  type: 'NOTE' | 'HIGHLIGHT' | 'QUESTION' | 'IDEA_SEED' | 'COMPLETED_BOOK' | 'MILESTONE';
  branchId: KnowledgeBranchId;
  content: string;
  bookTitle?: string;
  createdAt: string;
  isPublic: boolean;
}

export interface ReflectionRecord {
  id: string;
  prompt: string;
  userResponse: string;
  branchId: KnowledgeBranchId;
  createdAt: string;
  mood?: string;
}

export interface ReadingSession {
  id: string;
  bookId: string;
  bookTitle: string;
  startedAt: string;
  completedAt?: string;
  pagesRead: number;
  durationMinutes: number;
  notesCount: number;
}

export interface PersonalForest {
  userId: string;
  userName: string;
  joinedDate: string;
  level: number;
  flourishingScore: number;
  booksRead: number;
  leavesCount: number;
  questionsPlanted: number;
  treesSupported: number;
  tCoinsBalance: number;
  leaves: ForestLeaf[];
  reflections: ReflectionRecord[];
  readingHistory: ReadingSession[];
  activeBranches: KnowledgeBranchId[];
}

// -------------------------------------------------------------
// Oral Histories & Community Story Commons
// -------------------------------------------------------------

export type StoryType = 
  | 'ORAL_HISTORY' 
  | 'CRAFT_GUIDE' 
  | 'TRADITIONAL_RECIPE' 
  | 'LOCAL_HISTORY' 
  | 'INDIGENOUS_KNOWLEDGE'
  | 'ECOLOGICAL_OBSERVATION';

export interface StoryObject {
  id: string;
  title: string;
  narrator: string;
  narratorRole: string;
  location: string;
  region: string;
  language: string;
  branchId: KnowledgeBranchId;
  type: StoryType;
  durationSeconds: number;
  audioSimulationUrl?: string;
  transcript: string;
  summary: string;
  recordedYear: number;
  tags: string[];
  license: string;
  consentVerified: boolean;
  aiAssistanceDisclosure: string;
  provenance: ProvenanceType;
}

// -------------------------------------------------------------
// Future Library: 100-Year Branch & Future Letters
// -------------------------------------------------------------

export type TargetYear = 2036 | 2051 | 2076 | 2126;

export interface FutureLetter {
  id: string;
  title: string;
  authorPseudonym: string;
  role: 'Child' | 'Elder' | 'Scientist' | 'Farmer' | 'Artist' | 'Teacher' | 'Citizen';
  location: string;
  writtenYear: number;
  targetYear: TargetYear;
  category: 'hope' | 'warning' | 'scientific_question' | 'cultural_memory' | 'letter_to_children';
  excerpt: string;
  fullLetter: string;
  sealedUntilDate: string;
  isSealed: boolean;
  associatedGroveName: string;
  integrityChecksumSha256: string;
}

// -------------------------------------------------------------
// Earth, Groves & TreeLedger (Knowledge-to-Ground)
// -------------------------------------------------------------

export type TreeStatus = 
  | 'PLANNED' 
  | 'FUNDED' 
  | 'PLANTED' 
  | 'VERIFIED' 
  | 'GROWING' 
  | 'REPLANTED';

export interface TreeRecord {
  treeId: string;
  projectId: string;
  groveId: string;
  groveName: string;
  species: string;
  scientificName: string;
  nativeStatus: 'Endemic Native' | 'Indigenous' | 'Restorative';
  location: {
    lat: number;
    lng: number;
    country: string;
    region: string;
    landmark: string;
  };
  plantingDate: string;
  status: TreeStatus;
  caretaker: string;
  sourceOfFunding: string;
  knowledgeCollectionId?: string;
  associatedBookTitle?: string;
  lastVerified: string;
  verificationMethod: 'Drone Photogrammetry' | 'Ranger Tag & GPS' | 'Satellite Multispectral' | 'Community Audit';
  ecologicalNotes: string;
  co2KgOffsetEstimate: number;
  photoUrl: string;
}

export interface EcologyGrove {
  id: string;
  name: string;
  location: string;
  country: string;
  coordinates: [number, number];
  description: string;
  totalTrees: number;
  targetTrees: number;
  supportedByMembersCount: number;
  photoUrl: string;
  primarySpecies: string[];
  biodiversityScore: number;
  partnerOrganization: string;
  associatedLibraryTheme: string;
}

// -------------------------------------------------------------
// Learning Commons & Mentorship
// -------------------------------------------------------------

export interface LearningDay {
  dayNumber: number;
  title: string;
  conceptSummary: string;
  readingSnippet: string;
  exercise: string;
  reflectionQuestion: string;
  completed?: boolean;
}

export interface LearningPath {
  id: string;
  title: string;
  branchId: KnowledgeBranchId;
  estimatedDays: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Deep Scholar';
  description: string;
  curator: string;
  curatorRole: string;
  days: LearningDay[];
  enrolledCount: number;
  completedCount: number;
  badgeName: string;
}

export interface Mentor {
  id: string;
  name: string;
  avatar: string;
  title: string;
  branchId: KnowledgeBranchId;
  bio: string;
  languages: string[];
  rating: number;
  sessionsCompleted: number;
  availability: string;
  focusAreas: string[];
  sessionType: '1-on-1 Dialogue' | 'Story Circle' | 'Elder-Youth Bridge' | 'Apprenticeship';
  tCoinsContribution: number;
  isVerified: boolean;
  institutionAffiliation?: string;
}

// -------------------------------------------------------------
// Commons Market, 5-Pool Allocation & T-Coins
// -------------------------------------------------------------

export interface FivePoolSplit {
  creator: number;     // e.g. 60%
  operations: number;  // e.g. 20%
  community: number;   // e.g. 10%
  education: number;   // e.g. 5%
  earth: number;       // e.g. 5%
}

export interface MarketplaceItem {
  id: string;
  title: string;
  creator: string;
  creatorBio: string;
  category: 'Book' | 'Course' | 'Seed & Agro Kit' | 'Handmade Craft' | 'Live Workshop' | 'Mentorship';
  priceUSD: number;
  priceTCoins: number;
  image: string;
  description: string;
  poolSplit: FivePoolSplit;
  impactBenefit: string;
  treesPlantedOnPurchase: number;
  reviewsCount: number;
  rating: number;
}

export interface PassportBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlockedAt?: string;
  category: 'READING' | 'CONTRIBUTION' | 'EARTH' | 'MENTORSHIP' | 'FUTURE';
}

export interface TribPassport {
  passportId: string;
  userName: string;
  journeyStartedDate: string;
  rankTitle: string;
  badges: PassportBadge[];
  flourishingMetrics: {
    booksRead: number;
    questionsExplored: number;
    leavesCreated: number;
    mentorshipHours: number;
    treesGrown: number;
    oralHistoriesPreserved: number;
    tCoinsDividendsReturned: number;
  };
}

export type CampusWeatherTime = 'dawn' | 'morning' | 'midday' | 'rain' | 'sunset' | 'night' | 'monsoon' | 'century100';

export interface CampusPavilion {
  id: string;
  name: string;
  subtitle: string;
  category: 'READING' | 'RESEARCH' | 'CONTEMPLATION' | 'COMMUNITY' | 'INTERGENERATIONAL' | 'ARCHIVE';
  levels: number;
  areaSqm: number;
  elevationMeters: number;
  capacity: string;
  primaryMaterials: string[];
  architecturalPhilosophy: string;
  keyFeatures: string[];
  soundscapeTrack: string;
  quoteInscription?: string;
  coordinates: { x: number; y: number }; // Percentage on 2D campus masterplan map
  perspectives: string[]; // Perspective IDs related to this pavilion
  passiveDesign: {
    ventilation: string;
    solarStrategy: string;
    rainwater: string;
    treeIntegration: string;
    accessibility: string;
  };
}

export interface ArchitecturalPerspective {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  cameraType: "Bird's-Eye Drone" | "Worm's-Eye Canopy" | "Human-Eye Path" | "Canopy Eye-Level" | "Interior Atmospheric" | "Intimate Archive" | "Cinematic 21:9";
  elevationDescription: string;
  lightingTime: CampusWeatherTime;
  pavilionId?: string;
  shortDescription: string;
  composition: {
    foreground: string;
    middleground: string;
    background: string;
  };
  architecturalDetails: string[];
  structuralNotes: string;
  soundscape: string;
  heroPrompt: string;
  aspectRatio: string;
  svgVisualTheme: string;
}
