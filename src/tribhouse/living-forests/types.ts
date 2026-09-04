// =========================================================================
// TRIB-HOUSE LIVING LIBRARY FORESTS: CORE DOMAIN TYPES
// "Plant a Library. Grow a Forest. Feed a Mind."
// By All. For All. Across Generations.
// =========================================================================

export type ProjectType =
  | 'TREEHOUSE_LIBRARY'      // Full biophilic Trib-House architecture
  | 'COMMUNITY_LIBRARY'      // Low-cost permanent community library
  | 'SCHOOL_LIBRARY'         // Integrated inside existing village/rural school
  | 'MOBILE_LIBRARY'         // Boat, bus, van, or cargo bicycle library fleet
  | 'MICRO_LIBRARY'          // Neighborhood reading nest / open box
  | 'DIGITAL_NEST'           // Solar/mesh-powered digital public library node
  | 'LIBRARY_GARDEN'         // Biophilic library integrated with food forest & native grove
  | 'RESEARCH_HOUSE'         // Advanced ecological & regional research center
  | 'CHILDREN_READING_HOUSE' // Early-childhood literacy sanctuary
  | 'ELDER_STORY_HOUSE'      // Oral history, language recording & intergenerational lodge
  | 'EMERGENCY_LIBRARY';     // Rapid deployment post-disaster / displaced community unit

export type ProjectStatus =
  | 'IDEA'                   // Community idea proposal
  | 'VERIFIED_NEED'          // Local community identified & partner vetted
  | 'FUNDRAISING'            // Active crowdfunding & matching campaign
  | 'FUNDED'                 // Target reached; escrow milestones unlocked
  | 'BUILDING'               // Groundwork, timber construction or mobile fabrication
  | 'OPEN'                   // Inauguration & operational library doors open
  | 'GROWING'                // Active book circulation & community programs
  | 'SELF_SUSTAINING';       // Local roots, community-governed & thriving

export type VerificationLevel =
  | 'LEVEL_1_SELF_REPORTED'      // Submitted directly by project proposal team
  | 'LEVEL_2_COMMUNITY_VERIFIED'  // Cross-validated by local elders, schools or councils
  | 'LEVEL_3_INDEPENDENTLY_VERIFIED'; // Audited with satellite, geostamps & third-party inspection

export type ProjectLifecycle =
  | 'SEED'        // Proposal phase
  | 'SAPLING'     // Funded phase
  | 'GROWING'     // Construction & launch
  | 'ESTABLISHED' // Actively serving community (1-3 yrs)
  | 'MATURE'      // 5+ years of continuous operation
  | 'STEWARD';    // Mature library mentoring & seeding newer libraries

export type GeographicEntityType =
  | 'country'
  | 'territory'
  | 'autonomousRegion'
  | 'administrativeRegion'
  | 'municipality'
  | 'community'
  | 'indigenousTerritory';

export interface GeographicEntity {
  id: string;
  name: string;
  type: GeographicEntityType;
  parentEntityId?: string;
  isoCode?: string;
  coordinates: {
    lat: number;
    lng: number;
    isApproximate: boolean; // Protects sensitive indigenous / vulnerable locations
  };
  regionName: string;
  category: 'rural' | 'remote' | 'island' | 'low_resource' | 'displaced' | 'library_desert' | 'disaster_affected' | 'digital_divide';
}

export interface LibraryAccessIndex {
  score: number; // 0 to 100 (higher means greater access deficit / planning priority)
  populationPerLibrary: number;
  avgTravelDistanceKm: number;
  weeklyOpeningHoursAvg: number;
  digitalAccessRatePct: number;
  localLanguageAvailabilityScore: number; // 1-10
  childrenAccessRating: 'CRITICAL' | 'MODERATE' | 'FAIR' | 'GOOD';
}

export interface ClimateResilienceProfile {
  primaryRisks: ('flooding' | 'extreme_heat' | 'storms' | 'drought' | 'wildfire' | 'seismic')[];
  architecturalAdaptations: string[]; // e.g. "Stilted timber frame", "Cross-ventilation shading canopy"
  waterproofStorage: boolean;
  solarBatteryBackup: boolean;
}

export interface FundingBreakdown {
  targetUsd: number;
  raisedUsd: number;
  committedUsd: number;
  spentUsd: number;
  verifiedExpenditureUsd: number;
  allocationPct: {
    infrastructure: number; // e.g. 60%
    booksAndResources: number; // e.g. 15%
    localOperations: number; // e.g. 10%
    ecologicalProject: number; // e.g. 5%
    monitoringVerification: number; // e.g. 5%
    platformCommonsPool: number; // e.g. 5%
  };
}

export interface FundingMilestone {
  id: string;
  index: number;
  title: string;
  description: string;
  payoutPct: number;
  status: 'PENDING' | 'VERIFIED' | 'RELEASED';
  verifiedDate?: string;
  evidenceRef?: string;
}

export interface EvidenceItem {
  id: string;
  title: string;
  type: 'RECEIPT' | 'SITE_PHOTO' | 'GPS_INSPECTION' | 'COMMUNITY_MINUTES' | 'NURSERY_LOG';
  date: string;
  fileHash: string;
  verifierName: string;
  isRedactedForSafety: boolean;
}

export interface NegativeDataLog {
  id: string;
  title: string;
  severity: 'MILD' | 'MODERATE' | 'CRITICAL';
  date: string;
  description: string;
  lessonsLearned: string;
  resolutionStatus: 'OPEN' | 'RESOLVED' | 'ADAPTED';
}

export interface EcologicalComponent {
  id: string;
  type: 'NATIVE_TREE_GROVE' | 'FOOD_FOREST' | 'COMMUNITY_NURSERY' | 'RAIN_GARDEN' | 'POLLINATOR_HABITAT' | 'WETLAND_RESTORATION';
  primarySpecies: string[];
  plantedCount: number;
  survivingCount: number;
  survivalRatePct: number;
  nurseryLivelihoodsCreated: number;
  isCarbonCreditFreeDisclaimer: boolean; // Always true: not sold as carbon offsets
}

export interface FutureCapsule {
  sealedYear: number;
  releaseYear: 2036 | 2051 | 2076 | 2126;
  foundingBookTitle: string;
  foundingBookAuthor: string;
  foundingTreeSpecies: string;
  caretakerName: string;
  itemsCount: number;
  hopesForCenturySummary: string;
}

export interface LibraryProject {
  id: string;
  name: string;
  tagline: string;
  projectType: ProjectType;
  lifecycle: ProjectLifecycle;
  status: ProjectStatus;
  verificationLevel: VerificationLevel;

  // Geographic
  geographicEntity: GeographicEntity;
  countryName: string;
  territoryName?: string;
  communityName: string;
  languagesServed: string[];

  // Narrative & Dignity
  communityProfile: {
    culturalHeritage: string;
    existingStrengths: string;
    communityAspirations: string;
    photoUrl?: string;
  };
  description: string;
  peopleServedCount: number;
  booksInCollectionCount: number;
  booksNeededCount: number;

  // Local Partners & Governance
  localPartner: {
    name: string;
    type: 'COMMUNITY_COOPERATIVE' | 'LOCAL_SCHOOL' | 'INDIGENOUS_COUNCIL' | 'MUNICIPALITY' | 'REGIONAL_NGO';
    leadContact: string;
    verifiedSince: string;
    vetoRightsAcknowledged: boolean;
  };

  // Assessment & Climate
  accessIndex: LibraryAccessIndex;
  climateProfile: ClimateResilienceProfile;

  // Financials & Escrow
  funding: FundingBreakdown;
  milestones: FundingMilestone[];
  evidenceVault: EvidenceItem[];
  negativeDataLogs: NegativeDataLog[];

  // Ecology & Land Ethics
  ecologicalComponent?: EcologicalComponent;

  // Long-term Vision
  futureCapsule?: FutureCapsule;
  sustainabilityScorecard: {
    localRevenuePct: number;
    volunteerStewardCount: number;
    yearsOperating: number;
    localJobsRetained: number;
  };

  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CountryDossier {
  countryCode: string;
  countryName: string;
  flagEmoji: string;
  region: string;
  dominantLanguages: string[];
  underservedLanguages: string[];
  activeProjectsCount: number;
  librariesOperationalCount: number;
  mobileUnitsActiveCount: number;
  treesPlantedCount: number;
  learnersNourishedCount: number;
  accessIndexAvg: number;
  climateSummary: string;
  partnerEcosystem: string[];
  highlightStory: string;
}

export interface TreeDedication {
  id: string;
  treeProjectId: string;
  libraryProjectId: string;
  species: string;
  donorName: string;
  isAnonymous: boolean;
  dedicationMessage: string;
  plantedDate: string;
  survivalStatus: 'THRIVING' | 'HEALTHY' | 'MONITORED' | 'REPLANTED';
  legalDisclaimer: string; // Explains symbolic nature vs carbon credit / legal property
  coordinatesApprox: string;
}

export interface ContributionTier {
  id: 'seed' | 'sapling' | 'tree' | 'grove' | 'house' | 'forest';
  name: string;
  symbol: string;
  amountUsd: number;
  symbolicImpactDescription: string;
  badgeLabel: string;
}

export interface SkillOpportunity {
  id: string;
  title: string;
  projectTargetId: string;
  projectName: string;
  skillCategory: 'TEACH' | 'TRANSLATE' | 'DESIGN' | 'CODE' | 'BUILD' | 'RECORD_ORAL_LORE' | 'CATALOG' | 'NURSERY_GARDEN' | 'CHILDREN_READING';
  commitmentHoursWeekly: number;
  isRemoteFriendly: boolean;
  languageRequired?: string;
  description: string;
}

export interface MobileLibraryRoute {
  id: string;
  unitName: string;
  vehicleType: 'CARGO_BICYCLE' | 'RIVER_BOAT' | 'ALL_TERRAIN_VAN' | 'COMMUNITY_CART' | 'SOLAR_BUS';
  operatorName: string;
  stopsCount: number;
  weeklyCommunitiesServed: number;
  booksOnBoard: number;
  activeRouteName: string;
  lastInspectionDate: string;
  annualFuelEcoMode: string;
}

export interface LivingForestsGlobalSummary {
  mindsNourishedCount: number;
  countriesCount: number;
  communitiesServedCount: number;
  librariesBuiltCount: number;
  mobileFleetsCount: number;
  booksCirculatedCount: number;
  nativeTreesGrownCount: number;
  languagesPreservedCount: number;
  valueReturnedToCommonsUsd: number;
  localJobsSupportedCount: number;
  verifiedSurvivalRatePct: number;
}
