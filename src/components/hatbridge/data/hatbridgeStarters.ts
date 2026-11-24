// ============================================================================
// DR. T — HATBRIDGE STARTER TEMPLATES & SAMPLE WORKFLOW DATA
// Reusable across healthcare, academia, consulting, leadership & family life.
// Sample workflow items are explicitly isolated and labeled when loaded.
// ============================================================================

import {
  HatBridgeContextItem,
  HatBridgeDecision,
  HatBridgeHandoff,
  HatBridgePreferences,
  HatBridgeRole,
  HatBridgeTimeBlock,
  HatBridgeAtlassianIssue,
  HatBridgeConfluencePage,
} from '../../../types/hatbridgeTypes';

export interface HatBridgeStarterTemplate {
  key: string;
  pack: 'clinical_academic' | 'general_professional';
  name: string;
  icon: string;
  color: HatBridgeRole['color'];
  description: string;
  goals: string[];
  currentPriorities: string[];
  preferredAiContext: string;
  privacyLevel: HatBridgeRole['privacyLevel'];
}

export const HATBRIDGE_STARTER_PACKS: HatBridgeStarterTemplate[] = [
  // Dr. T Suggested Multi-Role Clinical, Academic & Life Hats
  {
    key: 'hospital',
    pack: 'clinical_academic',
    name: 'Hospital',
    icon: 'Hospital',
    color: 'teal',
    description: 'Inpatient rounds, cross-department coordination, quality protocols, and operational handovers.',
    goals: ['Maintain clean ward handover continuity without carrying unlogged follow-ups home.'],
    currentPriorities: ['Quality safety review', 'Shift handover checklist'],
    preferredAiContext: 'Operational & non-PHI workflow coordination only; never include identifiable patient data.',
    privacyLevel: 'work_restricted',
  },
  {
    key: 'clinic',
    pack: 'clinical_academic',
    name: 'Clinic',
    icon: 'Stethoscope',
    color: 'emerald',
    description: 'Outpatient practice rhythm, clinic scheduling workflows, and team coordination.',
    goals: ['Keep outpatient workflow calm and prevent overdue administrative follow-ups.'],
    currentPriorities: ['Afternoon clinic prep', 'Team workflow improvement notes'],
    preferredAiContext: 'Operational clinic tasks & scheduling; exclude identifiable patient details.',
    privacyLevel: 'work_restricted',
  },
  {
    key: 'university-dean',
    pack: 'clinical_academic',
    name: 'University / Dean',
    icon: 'GraduationCap',
    color: 'indigo',
    description: 'Faculty governance, curriculum planning, accreditation, and academic budget reviews.',
    goals: ['Prepare clear faculty decisions backed by documented Confluence proposals.'],
    currentPriorities: ['Faculty meeting agenda', 'Q3 curriculum budget options'],
    preferredAiContext: 'Academic governance, Jira committee actions, and Confluence policy pages.',
    privacyLevel: 'work_team',
  },
  {
    key: 'family-mother',
    pack: 'clinical_academic',
    name: 'Family / Mother',
    icon: 'Heart',
    color: 'rose',
    description: 'School schedules, family milestones, presence, and protected evening routines.',
    goals: ['Protect uninterrupted presence with family without bringing unfinished work tabs into dinner.'],
    currentPriorities: ['Evening family dinner', 'School permission calendar'],
    preferredAiContext: 'Strictly private personal vault. Never share with workplace Jira/Confluence.',
    privacyLevel: 'private_personal',
  },
  {
    key: 'family-daughter',
    pack: 'clinical_academic',
    name: 'Family / Daughter',
    icon: 'Users',
    color: 'amber',
    description: 'Supporting parents, family check-ins, and multigenerational care coordination.',
    goals: ['Stay attentive to parents’ upcoming logistics with calm advance reminders.'],
    currentPriorities: ['Weekend call & visit', 'Shared family calendar check'],
    preferredAiContext: 'Private family context. Excluded from workplace AI & external integrations.',
    privacyLevel: 'private_personal',
  },
  {
    key: 'family-wife',
    pack: 'clinical_academic',
    name: 'Family / Wife',
    icon: 'Sparkles',
    color: 'violet',
    description: 'Shared household decisions, travel planning, and protected partner time.',
    goals: ['Keep shared commitments clear and protect quiet conversation time.'],
    currentPriorities: ['Household schedule alignment', 'Weekend rest plan'],
    preferredAiContext: 'Private personal vault only.',
    privacyLevel: 'private_personal',
  },
  {
    key: 'congress',
    pack: 'clinical_academic',
    name: 'Congress / Professional Events',
    icon: 'Globe',
    color: 'sky',
    description: 'Keynotes, panel preparation, committee introductions, and post-conference follow-ups.',
    goals: ['Capture speaker follow-ups before leaving the venue so nothing slips afterward.'],
    currentPriorities: ['Symposium slide outline', 'Panelist follow-up list'],
    preferredAiContext: 'Talk preparation, professional contacts, and presentation links.',
    privacyLevel: 'work_team',
  },
  {
    key: 'research',
    pack: 'clinical_academic',
    name: 'Research',
    icon: 'FlaskConical',
    color: 'indigo',
    description: 'Manuscript drafts, grant milestones, IRB logistics, and collaborator decisions.',
    goals: ['Resume manuscript revisions immediately with cited collaborator decisions intact.'],
    currentPriorities: ['Grant aim revision', 'Co-author feedback log'],
    preferredAiContext: 'Research workflow milestones, Confluence protocol specs, and task links.',
    privacyLevel: 'work_team',
  },
  {
    key: 'learning',
    pack: 'clinical_academic',
    name: 'Learning',
    icon: 'BookOpen',
    color: 'emerald',
    description: 'Continuing education, reading notes, new engineering/AI skills, and deliberate practice.',
    goals: ['Keep learning notes portable across busy clinical and leadership weeks.'],
    currentPriorities: ['Reading queue', 'Weekly 45-min study block'],
    preferredAiContext: 'Personal growth notes and non-work study continuity.',
    privacyLevel: 'private_personal',
  },
  {
    key: 'personal-wellbeing',
    pack: 'clinical_academic',
    name: 'Personal Wellbeing',
    icon: 'ShieldCheck',
    color: 'teal',
    description: 'Rest, exercise, preventive checkups, recovery buffers, and sustainable pacing.',
    goals: ['Protect human recovery blocks before accepting extra commitments.'],
    currentPriorities: ['Evening wind-down boundary', '3x weekly movement block'],
    preferredAiContext: 'Private human sustainability & protected recovery scheduling.',
    privacyLevel: 'private_personal',
  },

  // General Multi-Role Professional Starters (reusable beyond healthcare)
  {
    key: 'exec-delivery',
    pack: 'general_professional',
    name: 'Product & Engineering Lead',
    icon: 'Layers',
    color: 'indigo',
    description: 'Architecture decisions, sprint unblocking, release reviews, and Jira delivery tracking.',
    goals: ['Keep architectural reasoning and sprint tradeoffs instantly resumable.'],
    currentPriorities: ['Release readiness review', 'Architecture ADR follow-ups'],
    preferredAiContext: 'Jira sprints, Confluence architecture decisions, and engineering handoffs.',
    privacyLevel: 'work_team',
  },
  {
    key: 'client-advisory',
    pack: 'general_professional',
    name: 'Client Advisory / Consulting',
    icon: 'Briefcase',
    color: 'sky',
    description: 'Client workshops, deliverables, open stakeholder approvals, and scope decisions.',
    goals: ['Switch between client engagements with zero mixed context or missed follow-ups.'],
    currentPriorities: ['Stakeholder approval follow-up', 'Workshop recap notes'],
    preferredAiContext: 'Client workspace notes & confirmed deliverable commitments.',
    privacyLevel: 'work_restricted',
  },
  {
    key: 'founder-ops',
    pack: 'general_professional',
    name: 'Operations & Governance',
    icon: 'Compass',
    color: 'amber',
    description: 'Board updates, budgeting, vendor agreements, and cross-team coordination.',
    goals: ['Track open approvals and financial/policy reasoning cleanly.'],
    currentPriorities: ['Q3 budget tradeoff decision', 'Monthly governance update'],
    preferredAiContext: 'Governance docs and formal decision memory.',
    privacyLevel: 'work_team',
  },
  {
    key: 'home-life',
    pack: 'general_professional',
    name: 'Home & Personal Sanctuary',
    icon: 'Heart',
    color: 'rose',
    description: 'Family commitments, personal rest, health appointments, and protected off-hours.',
    goals: ['Keep personal life strictly separated from workplace spaces.'],
    currentPriorities: ['Protected evening rest', 'Family schedule check'],
    preferredAiContext: 'Private personal context only; never exposed to Atlassian team spaces.',
    privacyLevel: 'private_personal',
  },
];

export const DEFAULT_HATBRIDGE_PREFERENCES = (userId: string): HatBridgePreferences => ({
  userId,
  aiConsentGranted: false,
  allowPrivatePersonalInAi: false,
  allowWorkplaceContextInAi: true,
  analyticsEnabled: false,
  retentionDays: 90,
  sustainableDailyHours: 8,
  onboardingCompleted: false,
  subscriptionTier: 'personal_continuity',
  voiceInputPreferred: true,
  updatedAt: new Date().toISOString(),
});

export interface HatBridgePlanTier {
  id: HatBridgePreferences['subscriptionTier'];
  audienceLabel: string;
  name: string;
  priceLabel: string;
  cadence: string;
  summary: string;
  limits: string[];
  notes: string;
}

export const HATBRIDGE_PLAN_TIERS: HatBridgePlanTier[] = [
  {
    id: 'personal_continuity',
    audienceLabel: 'For individual professionals',
    name: 'Personal Continuity',
    priceLabel: '$0',
    cadence: 'Early-access personal workspace',
    summary: 'Core role management, Re-entry Briefs, Context Capture, Time Protection, and local/user cloud sync.',
    limits: [
      'Up to 12 custom hats',
      'Unlimited context captures & decision records',
      'Full JSON export & immediate deletion',
      'Browser + Firebase personal vault sync',
    ],
    notes: 'No credit card or billing simulated; ready for future Stripe/Atlassian Marketplace entitlement hooks.',
  },
  {
    id: 'multi_role_pro',
    audienceLabel: 'For clinician-educators, researchers & consultants',
    name: 'Multi-Role Pro',
    priceLabel: '$14 / user',
    cadence: 'Planned monthly pricing',
    summary: 'Adds Atlassian Jira & Confluence workspace sync, Forge companion panel, and grounded Gemini synthesis.',
    limits: [
      'Unlimited hats & private/work isolation boundaries',
      'Jira issue + Confluence decision deep linking',
      'AI-assisted Re-entry Brief & Handoff drafting',
      'Cross-role schedule conflict detection',
    ],
    notes: 'Included free during controlled pilot & Codegeist 2026 judging.',
  },
  {
    id: 'clinical_academic_team',
    audienceLabel: 'For hospital departments, university faculties & labs',
    name: 'Department & Academic Team',
    priceLabel: '$29 / user',
    cadence: 'Planned annual organization tier',
    summary: 'Atlassian Forge organization governance, Rovo Context Navigator integration, retention policies & audit exports.',
    limits: [
      'Atlassian Forge Rovo agent & scoped workspace permissions',
      'Strict non-PHI & private-family separation guardrails',
      'Organization-configurable retention windows',
      'Exportable role-boundary governance audit logs',
    ],
    notes: 'Planned commercial architecture; billing checkout intentionally disabled in pilot build.',
  },
];

// Clearly isolated Sample Workflow Data (only loaded when user explicitly clicks "Load Sample Workflow")
export function buildSampleWorkflowDataset(userId: string): {
  roles: HatBridgeRole[];
  contextItems: HatBridgeContextItem[];
  decisions: HatBridgeDecision[];
  handoffs: HatBridgeHandoff[];
  timeBlocks: HatBridgeTimeBlock[];
} {
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const tomorrow = new Date(now.getTime() + 86400000).toISOString().slice(0, 10);
  const ts = now.toISOString();

  const roles: HatBridgeRole[] = HATBRIDGE_STARTER_PACKS.filter(
    (p) => p.pack === 'clinical_academic'
  )
    .slice(0, 6)
    .map((tpl, idx) => ({
      id: `hb-role-${tpl.key}`,
      userId,
      name: tpl.name,
      icon: tpl.icon,
      color: tpl.color,
      description: tpl.description,
      goals: tpl.goals,
      currentPriorities: tpl.currentPriorities,
      relatedTasks: idx === 2 ? ['FAC-104: Review Q3 curriculum budget options'] : [],
      relatedDocuments:
        idx === 2
          ? [
              {
                title: 'Faculty Budget Options & Simulation Proposal',
                source: 'Confluence',
                refId: 'CONF-FAC-208',
              },
            ]
          : [],
      relevantContacts:
        idx === 2
          ? [{ name: 'Prof. Elena Vance (Vice Dean)', relationOrRole: 'Academic Governance' }]
          : idx === 1
            ? [{ name: 'Nurse Coordinator Minh', relationOrRole: 'Clinic Scheduling Lead' }]
            : [],
      activeProjects:
        idx === 2
          ? ['Q3 Faculty Simulation Curriculum']
          : idx === 0
            ? ['Ward Handover Simplification']
            : idx === 3
              ? ['Autumn Family Schedule']
              : [],
      recentDecisions:
        idx === 2 ? ['Keep simulation lab hours protected inside core semester budget'] : [],
      unfinishedWork:
        idx === 2
          ? ['Compare Option A vs Option B lab staffing model before Thursday faculty senate']
          : idx === 1
            ? ['Confirm Thursday clinic room reallocation']
            : [],
      preferredAiContext: tpl.preferredAiContext,
      privacyLevel: tpl.privacyLevel,
      archived: false,
      sortOrder: idx,
      isStarterTemplate: true,
      createdAt: ts,
      updatedAt: ts,
    }));

  const contextItems: HatBridgeContextItem[] = [
    {
      id: 'hb-ctx-dean-agenda',
      userId,
      roleId: 'hb-role-university-dean',
      title: 'Review faculty meeting agenda & Q3 budget options',
      content: 'Reviewed draft agenda with Vice Dean Vance. Option B preserves bedside simulation fellowships; awaiting cost confirmation before Thursday vote.',
      category: 'meeting_note',
      commitmentStatus: 'urgent',
      priority: 'high',
      dueDate: tomorrow,
      startTime: '14:00',
      endTime: '15:00',
      estimatedMinutes: 60,
      relatedProject: 'Q3 Faculty Simulation Curriculum',
      jiraIssueKey: 'HB-104',
      confluencePageId: 'CONF-FAC-208',
      waitingOnPerson: 'Prof. Elena Vance (confirming lab TA budget line)',
      privacyLevel: 'work_team',
      storageLocation: 'browser_sandbox',
      sourceReference: 'Sample Workflow · University / Dean Agenda',
      capturedVia: 'sample_workflow',
      createdAt: ts,
      updatedAt: ts,
    },
    {
      id: 'hb-ctx-clinic-overlap',
      userId,
      roleId: 'hb-role-clinic',
      title: 'Afternoon outpatient clinic workflow sync',
      content: 'Coordinate Thursday afternoon clinic room schedule with Nurse Coordinator Minh (strictly operational non-PHI schedule planning).',
      category: 'commitment',
      commitmentStatus: 'important',
      priority: 'high',
      dueDate: todayStr,
      startTime: '14:30',
      endTime: '15:30',
      estimatedMinutes: 60,
      relatedProject: 'Clinic Room Flow',
      waitingOnPerson: 'Nurse Coordinator Minh',
      privacyLevel: 'work_restricted',
      storageLocation: 'browser_sandbox',
      sourceReference: 'Sample Workflow · Clinic Schedule',
      capturedVia: 'sample_workflow',
      createdAt: ts,
      updatedAt: ts,
    },
    {
      id: 'hb-ctx-hospital-protocol',
      userId,
      roleId: 'hb-role-hospital',
      title: 'Finalize de-identified ward handover checklist template',
      content: 'One remaining column tweak to standardize morning escalation timing with nursing leads.',
      category: 'task',
      commitmentStatus: 'scheduled',
      priority: 'medium',
      dueDate: tomorrow,
      startTime: '09:30',
      endTime: '10:15',
      estimatedMinutes: 45,
      relatedProject: 'Ward Handover Simplification',
      jiraIssueKey: 'HB-109',
      privacyLevel: 'work_restricted',
      storageLocation: 'browser_sandbox',
      sourceReference: 'Sample Workflow · Hospital Quality Ops',
      capturedVia: 'sample_workflow',
      createdAt: ts,
      updatedAt: ts,
    },
    {
      id: 'hb-ctx-family-dinner',
      userId,
      roleId: 'hb-role-family-mother',
      title: 'Family dinner & school science fair prep',
      content: 'Keep evening work devices put away from 18:30; review poster cardboard checklist together.',
      category: 'reminder',
      commitmentStatus: 'scheduled',
      priority: 'high',
      dueDate: todayStr,
      startTime: '18:30',
      endTime: '20:00',
      estimatedMinutes: 90,
      privacyLevel: 'private_personal',
      storageLocation: 'browser_sandbox',
      sourceReference: 'Sample Workflow · Private Family Calendar',
      capturedVia: 'sample_workflow',
      createdAt: ts,
      updatedAt: ts,
    },
    {
      id: 'hb-ctx-parent-call',
      userId,
      roleId: 'hb-role-family-daughter',
      title: 'Call parents about Sunday family lunch',
      content: 'Confirm what dishes to bring and check weekend travel timing.',
      category: 'follow_up',
      commitmentStatus: 'waiting',
      priority: 'medium',
      dueDate: tomorrow,
      privacyLevel: 'private_personal',
      storageLocation: 'browser_sandbox',
      sourceReference: 'Sample Workflow · Personal Vault',
      capturedVia: 'sample_workflow',
      createdAt: ts,
      updatedAt: ts,
    },
  ];

  const decisions: HatBridgeDecision[] = [
    {
      id: 'hb-dec-dean-budget',
      userId,
      roleId: 'hb-role-university-dean',
      title: 'Protect simulation fellowship hours under Q3 budget Option B',
      decision: 'Recommend Option B (preserve hands-on simulation TA hours by deferring non-urgent AV hardware upgrade to Q4).',
      reasoning: 'Faculty feedback showed bedside readiness skills depend directly on small-group simulation mentoring, whereas existing AV units remain functional for two more semesters.',
      decisionDate: todayStr,
      responsiblePerson: 'Dean Office / Finance Sub-Committee',
      source: 'Faculty Senate Pre-Read',
      supportingDocument: 'Faculty Budget Options & Simulation Proposal (CONF-FAC-208)',
      confluencePageId: 'CONF-FAC-208',
      relatedTaskId: 'hb-ctx-dean-agenda',
      jiraIssueKey: 'HB-104',
      followUpDate: tomorrow,
      status: 'waiting_approval',
      privacyLevel: 'work_team',
      revisions: [
        {
          timestamp: ts,
          summary: 'Initial draft logged after reviewing Option A vs Option B.',
          editor: 'User (Sample Workflow)',
        },
      ],
      createdAt: ts,
      updatedAt: ts,
    },
    {
      id: 'hb-dec-clinic-buffer',
      userId,
      roleId: 'hb-role-clinic',
      title: 'Keep 15-minute transition buffer before late-afternoon clinic',
      decision: 'Insert a 15-minute operational buffer between university committee calls and outpatient clinic sessions.',
      reasoning: 'Eliminates rushed context switching and lets outstanding academic notes be captured cleanly before clinic begins.',
      decisionDate: todayStr,
      responsiblePerson: 'Clinic Operations Lead',
      source: 'Personal Continuity Review',
      status: 'confirmed',
      privacyLevel: 'work_restricted',
      revisions: [
        {
          timestamp: ts,
          summary: 'Confirmed scheduling boundary.',
          editor: 'User (Sample Workflow)',
        },
      ],
      createdAt: ts,
      updatedAt: ts,
    },
  ];

  const handoffs: HatBridgeHandoff[] = [
    {
      id: 'hb-ho-dean-to-clinic',
      userId,
      fromRoleId: 'hb-role-university-dean',
      toRoleId: 'hb-role-clinic',
      currentSituation: 'Completed initial review of Thursday faculty meeting agenda and budget proposal Option B.',
      completedWork: ['Annotated Q3 budget slides', 'Confirmed Option B preserves simulation TAs'],
      remainingWork: ['Verify Vice Dean Vance lab TA cost sheet before Thursday vote'],
      importantDecisions: ['Option B recommended over AV upgrade'],
      outstandingQuestions: ['Can IT confirm existing lecture hall mics pass Q3 check?'],
      dependencies: ['Prof. Elena Vance budget line confirmation'],
      nextAction: 'Open linked Confluence page CONF-FAC-208 and compare final TA cost line.',
      relevantLinks: [{ label: 'Confluence: Faculty Budget Proposal', refId: 'CONF-FAC-208' }],
      suggestedReturnDate: tomorrow,
      privacyLevel: 'work_team',
      aiDraftUsed: false,
      confirmedByUser: true,
      createdAt: ts,
      updatedAt: ts,
    },
  ];

  const timeBlocks: HatBridgeTimeBlock[] = [
    {
      id: 'hb-tb-family-evening',
      userId,
      title: 'Protected Family Dinner & School Science Fair Evening',
      category: 'family',
      date: todayStr,
      startTime: '18:30',
      endTime: '20:30',
      protected: true,
      notes: 'Devices off during dinner. Only emergencies break this boundary.',
      privacyLevel: 'private_personal',
      createdAt: ts,
      updatedAt: ts,
    },
    {
      id: 'hb-tb-rest-sleep',
      userId,
      title: 'Evening Recovery & Sleep Window',
      category: 'rest',
      date: todayStr,
      startTime: '22:00',
      endTime: '23:30',
      protected: true,
      notes: 'Non-negotiable recovery time.',
      privacyLevel: 'private_personal',
      createdAt: ts,
      updatedAt: ts,
    },
  ];

  return { roles, contextItems, decisions, handoffs, timeBlocks };
}

// Clearly labeled Sample Atlassian Sandbox items (NEVER shown as live Jira/Confluence!)
export const SAMPLE_ATLASSIAN_SANDBOX_ISSUES: HatBridgeAtlassianIssue[] = [
  {
    id: 'sample-jira-104',
    key: 'HB-104',
    summary: 'Approve Q3 Simulation Lab Staffing Budget (Option B)',
    status: 'In Review',
    priority: 'High',
    assignee: 'Dean Office',
    dueDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    projectKey: 'FAC',
    projectName: 'Faculty Governance (Sample Sandbox)',
    isOverdue: false,
    isBlocked: false,
    url: 'https://example-sandbox.atlassian.net/browse/HB-104',
    linkedRoleId: 'hb-role-university-dean',
    dataOrigin: 'sample_sandbox',
  },
  {
    id: 'sample-jira-109',
    key: 'HB-109',
    summary: 'Standardize Morning Ward Escalation Handover Timing',
    status: 'Blocked',
    priority: 'Medium',
    assignee: 'Quality Operations',
    dueDate: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
    projectKey: 'OPS',
    projectName: 'Hospital Operations (Sample Sandbox)',
    isOverdue: true,
    isBlocked: true,
    url: 'https://example-sandbox.atlassian.net/browse/HB-109',
    linkedRoleId: 'hb-role-hospital',
    dataOrigin: 'sample_sandbox',
  },
];

export const SAMPLE_ATLASSIAN_SANDBOX_PAGES: HatBridgeConfluencePage[] = [
  {
    id: 'CONF-FAC-208',
    title: 'Faculty Budget Options & Simulation Proposal (Q3)',
    spaceKey: 'FAC',
    spaceName: 'Academic Governance (Sample Sandbox)',
    excerpt: 'Compares Option A (AV refresh) vs Option B (preserving bedside simulation TA fellowships across semester terms).',
    lastUpdated: new Date().toISOString(),
    author: 'Academic Planning Committee',
    url: 'https://example-sandbox.atlassian.net/wiki/spaces/FAC/pages/208',
    isMeetingNote: true,
    linkedRoleId: 'hb-role-university-dean',
    dataOrigin: 'sample_sandbox',
  },
  {
    id: 'CONF-OPS-112',
    title: 'Clinic Transition Buffer & Cross-Department Handover Notes',
    spaceKey: 'OPS',
    spaceName: 'Operations Playbook (Sample Sandbox)',
    excerpt: 'Documents 15-minute afternoon buffer policy before outpatient sessions begin.',
    lastUpdated: new Date().toISOString(),
    author: 'Operations Leads',
    url: 'https://example-sandbox.atlassian.net/wiki/spaces/OPS/pages/112',
    isMeetingNote: false,
    linkedRoleId: 'hb-role-clinic',
    dataOrigin: 'sample_sandbox',
  },
];
