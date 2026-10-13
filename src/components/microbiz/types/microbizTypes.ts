// ==========================================
// MICROBIZ PLATFORM TYPES
// Ecosystem: Dr. T by Zenieverse
// Philosophy: Made for All, By All
// ==========================================

export type MicroBizSubTab = 
  | 'discover'
  | 'courses'
  | 'groups'
  | 'marketplace'
  | 'operations'
  | 'scanner'
  | 'ai-studio'
  | 'admin';

export type UserRole = 'learner' | 'creator' | 'mentor' | 'business_owner' | 'moderator' | 'admin';

export interface MicroBizProfile {
  id: string;
  name: string;
  handle: string;
  avatarUrl?: string;
  role: UserRole;
  bio: string;
  location?: string;
  languages: string[];
  skills: string[];
  interests: string[];
  isVerifiedCreator?: boolean;
  coursesCount: number;
  projectsCount: number;
  studentsCount: number;
  followingUserIds: string[];
  bookmarkedPostIds: string[];
  contactPreference?: string;
  createdAt: string;
}

// ------------------------------------------
// 1. DISCOVERY & COMMUNITY POSTS
// ------------------------------------------
export type PostCategory = 
  | 'learning_story'
  | 'project_update'
  | 'business_milestone'
  | 'skill_tip'
  | 'collaboration_call'
  | 'resource_share';

export type ReactionType = 'like' | 'love' | 'celebrate' | 'insightful' | 'support';

export interface PostReactionCounts {
  like: number;
  love: number;
  celebrate: number;
  insightful: number;
  support: number;
}

export interface PostComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorRole: string;
  content: string;
  createdAt: string;
  replyToCommentId?: string;
}

export interface MicroBizPost {
  id: string;
  authorId: string;
  authorName: string;
  authorHandle: string;
  authorAvatar?: string;
  authorRole: string;
  title?: string;
  content: string;
  category: PostCategory;
  tags: string[];
  language: 'en' | 'vi' | 'both';
  imageUrl?: string;
  learningResourceLink?: string;
  reactions: PostReactionCounts;
  userReactions?: Record<string, ReactionType>; // userId -> ReactionType
  comments: PostComment[];
  sharesCount: number;
  isPinned?: boolean;
  isReported?: boolean;
  createdAt: string;
}

// ------------------------------------------
// 2. SOCIAL COURSE PLATFORM
// ------------------------------------------
export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface CourseLesson {
  id: string;
  title: string;
  estimatedMinutes: number;
  contentType: 'text' | 'practical_exercise' | 'quiz' | 'external_guide';
  bodyText: string;
  practicalTask?: string;
  keyTakeaways: string[];
  downloadableResources?: Array<{ title: string; url: string }>;
  quiz?: QuizQuestion[];
}

export interface CourseModule {
  id: string;
  moduleNumber: number;
  title: string;
  description: string;
  lessons: CourseLesson[];
}

export interface CourseReview {
  id: string;
  userId: string;
  userName: string;
  rating: number; // 1 to 5
  feedback: string;
  createdAt: string;
}

export interface MicroBizCourse {
  id: string;
  title: string;
  slug: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar?: string;
  creatorBio?: string;
  description: string;
  learningObjectives: string[];
  category: string;
  skillLevel: SkillLevel;
  language: string;
  estimatedHours: number;
  prerequisites: string[];
  modules: CourseModule[];
  coverGradient: string;
  tags: string[];
  isPublished: boolean;
  enrolledStudentsCount: number;
  completionRatePercent: number;
  reviews: CourseReview[];
  averageRating: number;
  isCommunitySponsored: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CourseEnrollment {
  id: string;
  courseId: string;
  userId: string;
  progressPercent: number;
  completedLessonIds: string[];
  lastActiveLessonId: string;
  isCompleted: boolean;
  completedAt?: string;
  quizScores: Record<string, number>; // lessonId -> percentage
  certificateId?: string;
}

export interface CommunityCertificate {
  certificateId: string;
  courseId: string;
  courseTitle: string;
  learnerId: string;
  learnerName: string;
  creatorName: string;
  issueDate: string;
  verificationHash: string;
  skillsAcquired: string[];
  platformNotice: string; // Clearly identifies as community certificate, not state-accredited diploma
}

// ------------------------------------------
// 3. COMMUNITY GROUPS & COLLABORATION
// ------------------------------------------
export interface GroupMember {
  userId: string;
  name: string;
  role: 'member' | 'mentor' | 'lead';
  joinedAt: string;
}

export interface GroupDiscussion {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  body: string;
  repliesCount: number;
  createdAt: string;
}

export interface CommunityGroup {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  locality?: string;
  membersCount: number;
  members: GroupMember[];
  discussions: GroupDiscussion[];
  tags: string[];
  avatarGradient: string;
  isPublic: boolean;
}

export interface ProjectTask {
  id: string;
  title: string;
  assigneeName?: string;
  status: 'todo' | 'in_progress' | 'completed';
  dueDate?: string;
}

export interface CollaborativeProject {
  id: string;
  title: string;
  description: string;
  initiatorName: string;
  groupId?: string;
  goals: string[];
  tasks: ProjectTask[];
  contributorsCount: number;
  targetDeadline: string;
  status: 'planning' | 'active' | 'completed';
  tags: string[];
  openPositions: string[];
}

export interface MentorshipListing {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorRole: string;
  expertiseAreas: string[];
  languages: string[];
  availabilityDesc: string;
  isAvailable: boolean;
}

// ------------------------------------------
// 4. CREATOR PROFILES & STOREFRONTS
// ------------------------------------------
export type ListingType = 'product' | 'service' | 'workshop' | 'digital_tool';

export interface BusinessListing {
  id: string;
  businessId: string;
  title: string;
  type: ListingType;
  description: string;
  priceAmount: number;
  currency: string;
  unit: string; // e.g. "per item", "per hour", "per project"
  estimatedTurnaround: string;
  inStock: boolean;
  category: string;
  portfolioImages?: string[];
  tags: string[];
  createdAt: string;
}

export interface MicroBusiness {
  id: string;
  ownerId: string;
  name: string;
  tagline: string;
  category: string;
  story: string;
  contactEmail: string;
  contactPhone?: string;
  locationCity?: string;
  socialLinks?: Record<string, string>;
  listings: BusinessListing[];
  reputationScore: number; // 0 to 100
  completedInquiriesCount: number;
  isVerified: boolean;
  coverGradient: string;
}

export type InquiryStatus = 'inquiry_received' | 'quote_sent' | 'order_agreed' | 'in_progress' | 'fulfilled' | 'cancelled';

export interface CustomerInquiry {
  id: string;
  listingId: string;
  listingTitle: string;
  businessId: string;
  customerName: string;
  customerContact: string;
  message: string;
  requestedQuantity: number;
  status: InquiryStatus;
  quotedAmount?: number;
  quoteNotes?: string;
  createdAt: string;
  updatedAt: string;
}

// ------------------------------------------
// 5. EVERYDAY BOOKKEEPING & OPERATIONS
// ------------------------------------------
export type FinancialRecordType = 'income' | 'expense';

export interface FinancialRecord {
  id: string;
  userId: string;
  type: FinancialRecordType;
  category: string;
  amount: number;
  currency: string;
  counterparty: string; // Customer or Supplier
  date: string; // YYYY-MM-DD
  paymentMethod: 'Cash' | 'Bank Transfer' | 'Momo / ZaloPay' | 'Pending Direct' | 'Other';
  description: string;
  documentRef?: string; // Receipt / Invoice link
  isOcrExtracted?: boolean;
  isDemoSeed?: boolean;
  createdAt: string;
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface InvoiceDocument {
  id: string;
  invoiceNumber: string;
  businessName: string;
  businessContact: string;
  customerName: string;
  customerContact: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceLineItem[];
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
  currency: string;
  notes: string;
  status: 'draft' | 'sent' | 'paid' | 'cancelled';
}

export interface BusinessGoal {
  id: string;
  title: string;
  targetMetric: string;
  currentValue: number;
  targetValue: number;
  deadline: string;
  isAchieved: boolean;
}

// ------------------------------------------
// 6. OCR & DOCUMENT EXTRACTION
// ------------------------------------------
export interface ExtractedOcrField {
  vendorName?: string;
  date?: string;
  totalAmount?: number;
  currency?: string;
  taxAmount?: number;
  confidenceScore: number;
  lineItemsSummary?: string[];
  rawText?: string;
}

// ------------------------------------------
// 7. REAL AI TOOLS
// ------------------------------------------
export type MicroBizAiToolId = 
  | 'course_generator'
  | 'listing_copywriter'
  | 'business_canvas'
  | 'inquiry_responder'
  | 'bilingual_translator'
  | 'cashflow_explainer';

export interface AiGenerationPromptPayload {
  toolId: MicroBizAiToolId;
  language: 'en' | 'vi';
  inputTopic: string;
  contextData?: any;
}

// ------------------------------------------
// 8. SAFETY & MODERATION
// ------------------------------------------
export interface ModerationReport {
  id: string;
  targetType: 'post' | 'course' | 'listing' | 'comment';
  targetId: string;
  targetTitle: string;
  reporterUserId: string;
  reason: 'misleading_claims' | 'unsolicited_spam' | 'inappropriate_content' | 'unauthorized_reproduction' | 'other';
  notes: string;
  status: 'pending' | 'reviewed_approved' | 'reviewed_removed';
  createdAt: string;
}
