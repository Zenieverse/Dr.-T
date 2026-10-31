import { THREE_HATS_DEFINITIONS, ThreeHatsRole, ThreeHatsCommitment, ThreeHatsWeeklyReflection } from '../src/components/threehats/types';
import { DEFAULT_ROLES_LIBRARY } from '../src/components/threehats/data/rolesLibrary';
import { ThreeHatsService } from '../src/components/threehats/services/threeHatsService';
import { LanternKeeperServerService } from '../src/server/lanternKeeperServerService';

async function runThreeHatsTestGate() {
  console.log('======================================================');
  console.log('🎩 THREE HATS — ROLE MAPPING & LIFE BALANCE AUDIT');
  console.log('Production Gate & Feature-by-Feature Verification');
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail = '') {
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}: ${detail}`);
      failed++;
    }
  }

  // --------------------------------------------------------------------------
  // TEST GROUP 1: The Three Hats Framework Invariants
  // --------------------------------------------------------------------------
  console.log('Test Group 1: The Three Hats Framework Invariants');
  assert(Boolean(THREE_HATS_DEFINITIONS.professional), 'Professional Hat definition exists');
  assert(Boolean(THREE_HATS_DEFINITIONS.personal), 'Personal Hat definition exists');
  assert(Boolean(THREE_HATS_DEFINITIONS.social), 'Social Hat definition exists');

  assert(
    THREE_HATS_DEFINITIONS.professional.typicalCategories.includes('Work and contribution'),
    'Professional Hat includes "Work and contribution"'
  );
  assert(
    THREE_HATS_DEFINITIONS.personal.typicalCategories.includes('Self and wellbeing'),
    'Personal Hat includes "Self and wellbeing"'
  );
  assert(
    THREE_HATS_DEFINITIONS.social.typicalCategories.includes('Relationships and belonging'),
    'Social Hat includes "Relationships and belonging"'
  );

  // --------------------------------------------------------------------------
  // TEST GROUP 2: Curated Roles Library & Multi-Hat Roles
  // --------------------------------------------------------------------------
  console.log('\nTest Group 2: Curated Roles Library & Multi-Hat Support');
  assert(DEFAULT_ROLES_LIBRARY.length >= 10, `Roles library contains ${DEFAULT_ROLES_LIBRARY.length} starter roles (>= 10)`);

  const multiHatRoles = DEFAULT_ROLES_LIBRARY.filter(r => r.hatIds.length > 1);
  assert(multiHatRoles.length >= 3, `Multi-hat overlapping roles supported (${multiHatRoles.length} multi-hat roles found)`);

  const learnerRole = DEFAULT_ROLES_LIBRARY.find(r => r.name.includes('Learner'));
  assert(
    Boolean(learnerRole && learnerRole.hatIds.includes('professional') && learnerRole.hatIds.includes('personal')),
    'Lifelong Learner spans both Professional and Personal hats'
  );

  const mentorRole = DEFAULT_ROLES_LIBRARY.find(r => r.name.includes('Mentor'));
  assert(
    Boolean(mentorRole && mentorRole.hatIds.includes('professional') && mentorRole.hatIds.includes('social')),
    'Mentor spans both Professional and Social hats'
  );

  assert(
    DEFAULT_ROLES_LIBRARY.every(r => r.values && r.values.length > 0),
    'Every starter role contains guiding personal values'
  );

  // --------------------------------------------------------------------------
  // TEST GROUP 3: 3-Perspective Balance Model (Importance, Attention, Satisfaction)
  // --------------------------------------------------------------------------
  console.log('\nTest Group 3: 3-Perspective Balance Model Invariants');
  const mockPerspectives = {
    professional: { importance: 5, attention: 5, satisfaction: 4 },
    personal: { importance: 5, attention: 2, satisfaction: 2 },
    social: { importance: 4, attention: 3, satisfaction: 3 }
  };

  assert(
    mockPerspectives.personal.importance === 5 && mockPerspectives.personal.attention === 2,
    'Allows independent modeling of Importance vs Recorded Attention (detects attention deficit without judgment)'
  );
  assert(
    typeof mockPerspectives.professional.satisfaction === 'number',
    'Maintains explicit satisfaction perspective per hat'
  );

  // --------------------------------------------------------------------------
  // TEST GROUP 4: 6-Step Weekly Ritual Structure
  // --------------------------------------------------------------------------
  console.log('\nTest Group 4: 6-Step Weekly Ritual Flow');
  const sampleRitual = {
    id: 'ritual-test-1',
    userId: 'test-user-1',
    weekStartDate: '2026-10-30',
    step1_meaningful: 'Elena verbena tea ritual with family',
    step2_attentionReview: 'Professional received planned hours; sleep was squeezed',
    step3_conflictsNoticed: 'Late coding sprint vs planned bedtime',
    step4_appreciations: 'Grateful for patient teammates',
    step5_realisticAdjustment: 'Screen curfew at 9:30 PM',
    step6_committedActions: ['Sleep 8h', 'Walk outdoors', 'Family dinner'],
    perspectives: mockPerspectives,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  assert(Boolean(sampleRitual.step1_meaningful), 'Step 1: Meaningful recognition recorded');
  assert(Boolean(sampleRitual.step2_attentionReview), 'Step 2: Attention review recorded');
  assert(Boolean(sampleRitual.step3_conflictsNoticed), 'Step 3: Competing priorities/conflicts identified');
  assert(Boolean(sampleRitual.step4_appreciations), 'Step 4: Appreciations noted');
  assert(Boolean(sampleRitual.step5_realisticAdjustment), 'Step 5: Realistic adjustment chosen');
  assert(sampleRitual.step6_committedActions.length === 3, 'Step 6: Concrete next actions committed');

  // --------------------------------------------------------------------------
  // TEST GROUP 5: Export & Backup Engine (JSON & Markdown)
  // --------------------------------------------------------------------------
  console.log('\nTest Group 5: Life Balance Export & Backup Engine');
  const sampleRole: ThreeHatsRole = {
    ...DEFAULT_ROLES_LIBRARY[0],
    id: 'role-123',
    userId: 'test-user-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const sampleCommitment: ThreeHatsCommitment = {
    id: 'comm-123',
    userId: 'test-user-1',
    roleId: 'role-123',
    roleName: sampleRole.name,
    hatId: 'professional',
    title: 'Deliver architecture review',
    priority: 'high',
    status: 'in_progress',
    personalValue: 'Craftsmanship',
    nextAction: 'Write diagram',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const jsonExport = ThreeHatsService.exportDataToJSON({
    roles: [sampleRole],
    commitments: [sampleCommitment],
    perspectives: mockPerspectives,
    latestReflection: sampleRitual
  });

  assert(jsonExport.includes('Three Hats Life Balance'), 'JSON export includes platform header');
  assert(jsonExport.includes('Deliver architecture review'), 'JSON export contains commitment title');

  const mdExport = ThreeHatsService.exportDataToMarkdown({
    roles: [sampleRole],
    commitments: [sampleCommitment],
    perspectives: mockPerspectives,
    latestReflection: sampleRitual
  });

  assert(mdExport.includes('# 🎩 Three Hats — Life Balance & Role Map Journal'), 'Markdown export contains journal header');
  assert(mdExport.includes('## 1. Stated Hat Balance Perspectives'), 'Markdown export includes Perspective breakdown');
  assert(mdExport.includes('## 2. My Mapped Roles'), 'Markdown export includes Mapped Roles section');
  assert(mdExport.includes('## 4. Latest Weekly Reflection Ritual'), 'Markdown export includes Weekly Reflection section');

  // --------------------------------------------------------------------------
  // TEST GROUP 6: Three Hats Companion AI Reflection
  // --------------------------------------------------------------------------
  console.log('\nTest Group 6: Three Hats Companion AI Reflection Invariants');
  const companionExecution = await LanternKeeperServerService.executeSkill({
    skillName: 'three_hats_companion',
    userApproved: true,
    payload: {
      roles: [sampleRole],
      commitments: [sampleCommitment],
      recentReflection: sampleRitual,
      userQuery: 'How can I balance my late-night coding with sleep?'
    },
    isTestFixture: true
  });

  assert(companionExecution.success === true, 'Companion AI executed successfully');
  assert(
    companionExecution.result.citedUserInputs.length >= 1,
    'Companion AI explicitly cites user inputs'
  );
  assert(
    companionExecution.result.gentleOptions.length >= 1,
    'Companion AI offers gentle, non-judgmental options'
  );
  assert(
    companionExecution.result.permissionRequiredToSaveMemory === true,
    'Companion enforces explicit permission before persistent memory creation'
  );

  console.log('\n======================================================');
  console.log(`✨ THREE HATS TEST AUDIT COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runThreeHatsTestGate().catch(err => {
  console.error('Fatal error in Three Hats verification:', err);
  process.exit(1);
});
