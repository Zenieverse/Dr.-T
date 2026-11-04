export type EventType = 
  | 'wedding' 
  | 'anniversary' 
  | 'birthday' 
  | 'family_celebration' 
  | 'community_gathering' 
  | 'cultural_festival' 
  | 'fundraiser' 
  | 'custom';

export type PlanningStage = 
  | 'ideation' 
  | 'vendor_booking' 
  | 'mid_planning' 
  | 'final_countdown' 
  | 'completed';

export type Currency = 'USD' | 'VND' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'SGD';

export type VendorCategory = 
  | 'venue' 
  | 'catering' 
  | 'photography' 
  | 'videography'
  | 'flowers'
  | 'decor' 
  | 'entertainment' 
  | 'attire' 
  | 'transport' 
  | 'invitations' 
  | 'rentals' 
  | 'staffing'
  | 'contingency' 
  | 'other';

export type ThreeHatRoleType = 'professional' | 'personal' | 'social';

export type TaskMilestone = 
  | '6_months_plus' 
  | '3_months' 
  | '1_month' 
  | '2_weeks' 
  | 'event_week' 
  | 'day_of' 
  | 'post_event';

export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'deferred';
export type TaskPriority = 'high' | 'medium' | 'low';

export type RsvpStatus = 'attending' | 'declined' | 'tentative' | 'pending';
export type InvitationStatus = 'draft' | 'sent' | 'delivered';

export type VendorStatus = 
  | 'inquiring' 
  | 'quoted' 
  | 'contracted' 
  | 'deposit_paid' 
  | 'paid_in_full' 
  | 'declined';

export interface GatherEvent {
  id: string;
  userId: string;
  title: string;
  eventType: EventType;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  location: string;
  venueName?: string;
  timezone?: string; // e.g. "Asia/Ho_Chi_Minh", "America/New_York", "Europe/London"
  expectedGuests: number;
  currency: Currency;
  totalBudget: number;
  themeStyle: string;
  dietaryNeeds: string[];
  accessibilityNeeds: string[];
  culturalPreferences: string;
  planningStage: PlanningStage;
  priorities: string[];
  notes: string;
  isArchived?: boolean;
  collaborators?: string[]; // user IDs
  collaboratorEmails?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BudgetItem {
  id: string;
  eventId: string;
  category: VendorCategory;
  name: string;
  estimatedCost: number;
  actualCost: number;
  vendorQuotation: number;
  paidAmount: number;
  dueDate?: string;
  paymentStatus: 'unpaid' | 'deposit_paid' | 'paid_in_full' | 'refunded';
  notes: string;
  receiptId?: string; // MicroBiz operations ledger link
}

export interface TimelineTask {
  id: string;
  eventId: string;
  title: string;
  description: string;
  dueDate: string;
  milestone: TaskMilestone;
  status: TaskStatus;
  priority: TaskPriority;
  dependencies?: string[];
  assignedPersonName?: string;
  assignedRoleTitle?: string;
  hatType: ThreeHatRoleType;
  isEventDayChecklist?: boolean;
  eventDayTime?: string; // e.g. "15:00 - Cocktail Hour Setup"
}

export interface VendorRecord {
  id: string;
  eventId: string;
  name: string;
  category: VendorCategory;
  contactPerson: string;
  phone: string;
  email: string;
  website?: string;
  quotedPrice: number;
  depositAmount: number;
  depositPaid: boolean;
  paymentDeadline?: string;
  status: VendorStatus;
  notes: string;
  isVerifiedQuote: boolean; // Confirms this is user-recorded, never synthetic/fabricated
}

export interface GuestRecord {
  id: string;
  eventId: string;
  name: string;
  email?: string;
  phone?: string;
  rsvpStatus: RsvpStatus;
  invitationStatus: InvitationStatus;
  plusOnes: number;
  dietaryRequirements: string[];
  tableOrSeating: string;
  isVIP: boolean;
  notes: string;
}

export interface TeamRoleAssignment {
  id: string;
  eventId: string;
  personName: string;
  email?: string;
  phone?: string;
  roleTitle: string;
  hat: ThreeHatRoleType;
  permissionLevel?: 'owner' | 'contributor' | 'read_only';
  inviteStatus?: 'invited' | 'active';
  coreResponsibilities: string[];
  notes?: string;
}

export interface AIEventPlan {
  themeConcept: {
    title: string;
    moodboardSummary: string;
    palette: string[];
    atmosphereKeynotes: string[];
  };
  budgetBreakdown: Array<{
    category: VendorCategory;
    categoryLabel: string;
    recommendedPercent: number;
    recommendedAmount: number;
    reasoning: string;
  }>;
  milestones: Array<{
    timeframe: string;
    actionItems: string[];
  }>;
  vendorChecklist: Array<{
    category: VendorCategory;
    keyQuestionsToAsk: string[];
    selectionTips: string[];
  }>;
  guestExperiencePlan: {
    welcomeStrategy: string;
    dietaryCareSummary: string;
    accessibilityChecklist: string[];
  };
  eventDayRunningOrder: Array<{
    time: string;
    activity: string;
    responsibleHat: ThreeHatRoleType;
    leadPerson: string;
    notes: string;
  }>;
  decorAndCateringIdeas: {
    decorHighlights: string[];
    signatureMenuConcepts: string[];
    beverageAndCocktailIdeas: string[];
  };
  contingencyChecklist: Array<{
    risk: string;
    trigger: string;
    contingencyAction: string;
  }>;
  generatedAt: string;
  engine: string;
}

export type GatherGlowSubView = 
  | 'my_events'
  | 'create_event'
  | 'ai_planner'
  | 'budget'
  | 'timeline'
  | 'vendors'
  | 'guests'
  | 'team_roles'
  | 'event_day'
  | 'reports';
