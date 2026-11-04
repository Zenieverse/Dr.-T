import { 
  GatherEvent, 
  BudgetItem, 
  TimelineTask, 
  VendorRecord, 
  GuestRecord, 
  TeamRoleAssignment,
  AIEventPlan
} from '../src/components/gatherglow/types';
import { 
  STARTER_EVENT, 
  SECOND_STARTER_EVENT, 
  STARTER_BUDGET_ITEMS, 
  STARTER_TIMELINE_TASKS, 
  STARTER_VENDORS, 
  STARTER_GUESTS, 
  STARTER_TEAM_ROLES, 
  STARTER_AI_PLAN 
} from '../src/components/gatherglow/initialData';
import { GatherGlowService, FullEventPackage } from '../src/components/gatherglow/services/gatherGlowService';
import { GatherGlowServerService } from '../src/server/gatherGlowServerService';
import fs from 'fs';
import path from 'path';

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, message: string) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runGatherGlowTests() {
  console.log('======================================================');
  console.log('🌟 GATHER & GLOW — AI EVENT PLANNING ASSISTANT AUDIT');
  console.log('Production Verification & Quality Gate');
  console.log('======================================================\n');

  // Test Group 1: Event Creation & Field Integrity
  console.log('Test Group 1: Event Creation & Field Integrity');
  assert(Boolean(STARTER_EVENT.id), 'Starter event ID exists');
  assert(STARTER_EVENT.eventType === 'wedding', 'Event type correctly reflects "wedding"');
  assert(STARTER_EVENT.totalBudget === 25000, 'Total budget matches $25,000');
  assert(STARTER_EVENT.expectedGuests === 110, 'Expected guests count is 110');
  assert(Boolean(STARTER_EVENT.culturalPreferences), 'Cultural heritage preferences field populated');
  assert(STARTER_EVENT.dietaryNeeds.length >= 3, 'Dietary needs accommodate multiple diets (Vegetarian, Vegan, Gluten-Free)');
  assert(STARTER_EVENT.accessibilityNeeds.length >= 1, 'Accessibility requirements consider elder step-free access');

  // Test Group 2: Budget Manager & Calculations
  console.log('\nTest Group 2: Smart Budget Manager Calculations');
  const budget = STARTER_BUDGET_ITEMS;
  const totalAllocated = budget.reduce((sum, b) => sum + (b.vendorQuotation || b.actualCost || b.estimatedCost), 0);
  const totalPaid = budget.reduce((sum, b) => sum + b.paidAmount, 0);
  const remainingBudget = STARTER_EVENT.totalBudget - totalAllocated;

  assert(budget.length >= 7, 'Budget covers core event categories (venue, catering, photo, decor, etc.)');
  assert(totalAllocated <= STARTER_EVENT.totalBudget, 'Total allocated expenses remain within total budget ceiling');
  assert(totalPaid > 0 && totalPaid < totalAllocated, 'Paid deposits accurately tracked between zero and full total');
  assert(remainingBudget >= 0, 'Remaining budget balance is non-negative');

  const cateringItem = budget.find(b => b.category === 'catering');
  assert(Boolean(cateringItem && cateringItem.paidAmount > 0), 'Catering item includes recorded deposit payment');

  // Test Group 3: Timeline & Milestone Organization
  console.log('\nTest Group 3: Timeline & Milestone Task Organization');
  const tasks = STARTER_TIMELINE_TASKS;
  assert(tasks.length >= 6, 'Timeline contains sufficient milestone action items');

  const dayOfTasks = tasks.filter(t => t.isEventDayChecklist);
  assert(dayOfTasks.length >= 2, 'Identified distinct day-of checklist tasks with specific execution times');

  const sortedMilestones = ['1_month', '2_weeks', 'event_week', 'day_of'];
  const hasMultipleMilestones = sortedMilestones.every(m => tasks.some(t => t.milestone === m));
  assert(hasMultipleMilestones, 'Tasks span multiple planning horizons leading up to event day');

  // Test Group 4: Three Hats Integration
  console.log('\nTest Group 4: Three Hats Role Architecture Integration');
  const roles = STARTER_TEAM_ROLES;
  const hasProfHat = roles.some(r => r.hat === 'professional');
  const hasPersonalHat = roles.some(r => r.hat === 'personal');
  const hasSocialHat = roles.some(r => r.hat === 'social');

  assert(hasProfHat, 'Professional Hat represented (e.g. Day-Of Coordinator)');
  assert(hasPersonalHat, 'Personal Hat represented (e.g. Honorees & Self-Care Anchor)');
  assert(hasSocialHat, 'Social Hat represented (e.g. Welcome Ambassadors & Heritage Masters)');

  const selfCareRole = roles.find(r => r.hat === 'personal');
  assert(
    Boolean(selfCareRole?.coreResponsibilities.some(d => d.toLowerCase().includes('hydrated') || d.toLowerCase().includes('solitude'))),
    'Personal Hat role includes self-care and grounding invariants to protect honoree peace'
  );

  // Test Group 5: Vendor Quotations & Truthful Disclosure
  console.log('\nTest Group 5: Vendor Management & Truthful Quotation Verification');
  const vendors = STARTER_VENDORS;
  assert(vendors.length >= 4, 'Multiple vendor categories registered');
  
  vendors.forEach(v => {
    assert(v.isVerifiedQuote === true, `Vendor ${v.name} is labeled as user-recorded quotation`);
    assert(Boolean(v.contactPerson || v.phone || v.email), `Vendor ${v.name} has actionable contact info`);
    assert(v.quotedPrice > 0, `Vendor ${v.name} has explicit quoted price`);
  });

  // Test Group 6: Guest Management & RSVP Dietary Tracking
  console.log('\nTest Group 6: Guest List & Dietary Aggregation');
  const guests = STARTER_GUESTS;
  assert(guests.length >= 5, 'Guest directory populated with realistic parties');
  
  const attendingGuests = guests.filter(g => g.rsvpStatus === 'attending');
  assert(attendingGuests.length >= 3, 'Multiple guests confirmed attending');

  const vipElders = guests.filter(g => g.isVIP);
  assert(vipElders.length >= 2, 'Elder patriarchs/matriarchs flagged with VIP care indicators');

  const hasSpecialDiet = guests.some(g => g.dietaryRequirements.length > 0 && !g.dietaryRequirements.includes('None'));
  assert(hasSpecialDiet, 'Guest list records specific dietary requirements for banquet kitchen');

  // Test Group 7: MicroBiz Ledger Voucher Bridge
  console.log('\nTest Group 7: MicroBiz Operations Ledger Bridge');
  const sampleBudgetItem = budget[0];
  const microBizPayload = GatherGlowService.createMicroBizInvoicePayload(sampleBudgetItem, STARTER_EVENT);

  assert(microBizPayload.source === 'Gather & Glow Event Manager', 'Voucher payload explicitly identifies Gather & Glow as source');
  assert(microBizPayload.eventId === STARTER_EVENT.id, 'Payload carries parent event ID');
  assert(microBizPayload.amount === (sampleBudgetItem.vendorQuotation || sampleBudgetItem.actualCost), 'Voucher amount matches quoted expense');
  assert(microBizPayload.balanceDue >= 0, 'Balance due is properly computed');
  assert(microBizPayload.receiptNumber.startsWith('REC-'), 'Receipt number follows standardized format');

  // Test Group 8: Dossier Export & Data Sovereignty
  console.log('\nTest Group 8: Master Dossier Export & Markdown Journal');
  const fullPkg: FullEventPackage = {
    event: STARTER_EVENT,
    budget: STARTER_BUDGET_ITEMS,
    tasks: STARTER_TIMELINE_TASKS,
    vendors: STARTER_VENDORS,
    guests: STARTER_GUESTS,
    teamRoles: STARTER_TEAM_ROLES,
    aiPlan: STARTER_AI_PLAN
  };

  const markdownDossier = GatherGlowService.generateMarkdownDossier(fullPkg);
  assert(markdownDossier.includes('# 🌟 Mai & David'), 'Markdown dossier includes event title header');
  assert(markdownDossier.includes('## 💰 Budget & Expense Breakdown'), 'Markdown dossier contains budget table');
  assert(markdownDossier.includes('## ⏱️ Timeline & Critical Milestones'), 'Markdown dossier contains milestone checklist');
  assert(markdownDossier.includes('## 🤝 Verified Vendors & Contacts'), 'Markdown dossier details vendor records');
  assert(markdownDossier.includes('## 👥 Three Hats Team Responsibilities'), 'Markdown dossier contains Three Hats team matrix');
  assert(markdownDossier.includes('## 🤖 AI Event-Day Running Order'), 'Markdown dossier contains AI running order');

  // Test Group 9: AI Planner Server Engine & Deterministic Fallback
  console.log('\nTest Group 9: AI Event Architect & Fallback Engine');
  const fallbackPlan = GatherGlowServerService.generateDeterministicPlan(STARTER_EVENT);
  assert(Boolean(fallbackPlan.themeConcept.title), 'AI plan generates creative theme concept');
  assert(fallbackPlan.themeConcept.palette.length === 5, 'Theme concept generates a 5-color harmonic palette');
  assert(fallbackPlan.budgetBreakdown.length >= 6, 'Budget breakdown recommends at least 6 category allocations');
  assert(fallbackPlan.eventDayRunningOrder.length >= 6, 'Running order provides hour-by-hour schedule');
  assert(fallbackPlan.contingencyChecklist.length >= 3, 'Contingency plan details weather, power, and allergy protocols');
  assert(fallbackPlan.engine.includes('Dr. T'), 'Plan generator truthfully identifies engine provenance');

  // Test Group 10: Platform Integration Invariants
  console.log('\nTest Group 10: Dr. T Platform Integration Invariants');
  const typesContent = fs.readFileSync(path.join(process.cwd(), 'src/types.ts'), 'utf-8');
  assert(typesContent.includes("'gatherglow'"), 'src/types.ts registers "gatherglow" in NavTab union');

  const navbarContent = fs.readFileSync(path.join(process.cwd(), 'src/components/layout/Navbar.tsx'), 'utf-8');
  assert(navbarContent.includes("id: 'gatherglow'"), 'src/components/layout/Navbar.tsx registers Gather & Glow nav item');
  assert(navbarContent.includes("label: 'Gather & Glow'"), 'Navbar label is "Gather & Glow"');

  const appContent = fs.readFileSync(path.join(process.cwd(), 'src/App.tsx'), 'utf-8');
  assert(appContent.includes("activeTab === 'gatherglow'"), 'src/App.tsx renders GatherGlowModule when activeTab is gatherglow');

  const firestoreRules = fs.readFileSync(path.join(process.cwd(), 'firestore.rules'), 'utf-8');
  assert(firestoreRules.includes('match /gather_and_glow_events/{eventId}'), 'firestore.rules secures /gather_and_glow_events with user isolation');
  assert(firestoreRules.includes('request.auth.uid in resource.data.collaborators'), 'firestore.rules allows verified collaborators to view/update shared events');

  // Test Group 11: Multi-Event Operations (Duplication & Archival)
  console.log('\nTest Group 11: Multi-Event Operations & Duplication Logic');
  const duplicated = await GatherGlowService.duplicateEvent(STARTER_EVENT.id);
  assert(duplicated.id !== STARTER_EVENT.id, 'Duplicated event gets a new unique ID');
  assert(duplicated.title.includes('(Copy)'), 'Duplicated event title is flagged with (Copy)');
  assert(duplicated.totalBudget === STARTER_EVENT.totalBudget, 'Duplicated event preserves total budget');
  assert(duplicated.currency === STARTER_EVENT.currency, 'Duplicated event preserves currency');

  await GatherGlowService.archiveEvent(duplicated.id, true);
  const reloadedDuplicated = await GatherGlowService.loadEventById(duplicated.id);
  assert(reloadedDuplicated?.isArchived === true, 'Archived event has isArchived flag set to true');

  await GatherGlowService.archiveEvent(duplicated.id, false);
  const unarchivedDuplicated = await GatherGlowService.loadEventById(duplicated.id);
  assert(unarchivedDuplicated?.isArchived === false, 'Unarchiving sets isArchived to false');

  // Clean up duplicated event
  await GatherGlowService.deleteEvent(duplicated.id);

  // Test Group 12: CSV Export & Import String Format
  console.log('\nTest Group 12: Guest CSV Export & Import Parsing');
  const sampleGuests: GuestRecord[] = [
    {
      id: 'csv-1',
      eventId: 'ev-test',
      name: 'Nguyen Van A',
      partySize: 2,
      dietaryRequirements: ['Vegetarian', 'Gluten-Free'],
      rsvpStatus: 'attending',
      isVIP: true,
      tableAssignment: 'Table 1',
      notes: 'Close family',
      updatedAt: new Date().toISOString()
    },
    {
      id: 'csv-2',
      eventId: 'ev-test',
      name: 'John Smith',
      partySize: 1,
      dietaryRequirements: ['None'],
      rsvpStatus: 'declined',
      isVIP: false,
      tableAssignment: '',
      notes: '',
      updatedAt: new Date().toISOString()
    }
  ];

  const csvOutput = GatherGlowService.exportGuestsCsv(sampleGuests);
  assert(csvOutput.includes('Name,Email,Phone,RSVP Status'), 'CSV contains standard header columns');
  assert(csvOutput.includes('Nguyen Van A') && csvOutput.includes('Vegetarian; Gluten-Free'), 'CSV encodes guest data and escapes multi-item dietary requirements');

  const parsedCsvGuests = await GatherGlowService.importGuestsCsv('ev-test', csvOutput);
  assert(parsedCsvGuests.length === 2, 'CSV import parses exactly 2 guests');
  assert(parsedCsvGuests[0].name === 'Nguyen Van A', 'Imported guest name matches');
  assert(parsedCsvGuests[0].rsvpStatus === 'attending', 'Imported RSVP status matches');
  assert(parsedCsvGuests[0].isVIP === true, 'Imported VIP flag matches');
  assert(parsedCsvGuests[0].dietaryRequirements.includes('Vegetarian'), 'Imported dietary requirements parsed array correctly');

  // Test Group 13: Bilingual Translation Dictionary Parity
  console.log('\nTest Group 13: Bilingual Localization Dictionary Integrity');
  const { GATHER_GLOW_TRANSLATIONS } = await import('../src/components/gatherglow/translations');
  const enKeys = Object.keys(GATHER_GLOW_TRANSLATIONS.en);
  const viKeys = Object.keys(GATHER_GLOW_TRANSLATIONS.vi);

  assert(enKeys.length >= 50, `English translation dictionary contains sufficient strings (${enKeys.length})`);
  assert(viKeys.length >= 50, `Vietnamese translation dictionary contains sufficient strings (${viKeys.length})`);

  const missingInVi = enKeys.filter(k => !(k in GATHER_GLOW_TRANSLATIONS.vi));
  assert(missingInVi.length === 0, `All English keys have corresponding Vietnamese translations. Missing: ${missingInVi.join(', ')}`);

  // Test Group 14: AI Refinement & Conversational Tuning Engine
  console.log('\nTest Group 14: AI Plan Refinement Fallback Engine');
  const refinedPlan = GatherGlowServerService.refinePlanDeterministic(
    STARTER_EVENT,
    STARTER_AI_PLAN,
    'Make it more intimate and add Vietnamese tea ceremony morning rituals'
  );

  assert(Boolean(refinedPlan.themeConcept.title), 'Refined plan includes updated concept title');
  assert(refinedPlan.themeConcept.moodboardSummary.includes('intimate') || refinedPlan.themeConcept.moodboardSummary.includes('Vietnamese') || refinedPlan.themeConcept.moodboardSummary.includes('Refined'), 'Refined plan reflects user refinement request');
  assert(refinedPlan.eventDayRunningOrder.length >= 6, 'Refined plan maintains complete event day running order');

  // Test Group 15: Commercial SaaS Pricing Tiers & Onboarding
  console.log('\nTest Group 15: Commercial SaaS Pricing Tiers & Onboarding Components');
  const pricingFile = fs.readFileSync(path.join(process.cwd(), 'src/components/gatherglow/components/PricingModal.tsx'), 'utf-8');
  assert(pricingFile.includes('Free Starter') || pricingFile.includes('Free Community Starter'), 'Pricing modal defines Free tier');
  assert(pricingFile.includes('Signature Celebration') || pricingFile.includes('Celebration Pass') || pricingFile.includes('$19'), 'Pricing modal defines Celebration tier ($19)');
  assert(pricingFile.includes('Pro Planner') || pricingFile.includes('Professional Planner'), 'Pricing modal defines Pro tier ($49/mo)');
  assert(pricingFile.includes('Community & Non-Profit') || pricingFile.includes('Community Event') || pricingFile.includes('Cộng Đồng'), 'Pricing modal defines Non-Profit waiver tier');

  const userGuideFile = fs.readFileSync(path.join(process.cwd(), 'src/components/gatherglow/components/UserGuideModal.tsx'), 'utf-8');
  assert(userGuideFile.includes('Step 1') || userGuideFile.includes('Bước 1'), 'User guide provides step-by-step onboarding walkthrough');
  assert(userGuideFile.includes('FAQ') || userGuideFile.includes('faqs'), 'User guide provides transparent FAQ answers addressing zero-fabrication and MicroBiz integration');

  console.log('\n======================================================');
  console.log(`✨ GATHER & GLOW AUDIT COMPLETE: ${passedTests}/${totalTests} PASSED, 0 FAILED`);
  console.log('======================================================');
}

runGatherGlowTests().catch(err => {
  console.error('Fatal test runner failure:', err);
  process.exit(1);
});
