// ============================================================================
// MEMORY LANTERN — STORIES THAT STAY
// Clearly Labeled Fictional Demonstration Sample Data
// ============================================================================

import { MemoryLanternItem } from '../types';

export const FICTIONAL_SAMPLE_MEMORIES: MemoryLanternItem[] = [
  {
    id: 'sample-lantern-1',
    userId: 'sample-user-demo',
    title: "Grandmother Elena's Lemon Verbena Tea",
    dateOrPeriod: "Summer twilights, circa 1982",
    peopleRemembered: ["Grandmother Elena"],
    category: "Tradition",
    story: "Every evening at dusk in the sunroom, Grandmother Elena would step out onto the brick garden path with brass kitchen shears to harvest fresh leaves of lemon verbena. While the copper kettle sang on the stove, she would sit with us and ask what made us smile that day. The scent of sweet citrus steam filled the quiet house as the crickets started in the lawn.",
    meaningfulDetails: [
      {
        type: 'recipe',
        label: 'Evening Verbena Infusion',
        value: '3 freshly bruised lemon verbena sprigs, half a slice of sun-dried Meyer lemon, and one teaspoon of wildflower clover honey steeped for exactly seven minutes.'
      },
      {
        type: 'saying_or_proverb',
        label: 'Evening Saying',
        value: '“A warm cup gives the longest day a gentle door to close through.”'
      },
      {
        type: 'special_place',
        label: 'Sunroom Garden Corner',
        value: 'The wicker rocking chair beside the blue hydrangeas overlooking the brick path.'
      }
    ],
    tags: ['Evening Tea', 'Sunroom', 'Elena', 'Summer', 'Citrus'],
    isSample: true,
    privacyLevel: 'FAMILY_EXPORTABLE',
    lanternColor: 'warm_gold',
    audioNote: {
      recorded: true,
      durationSeconds: 42,
      transcriptSummary: 'Elena softly humming while cutting verbena leaves in the evening breeze.'
    },
    createdAt: '2026-10-26T18:30:00Z',
    updatedAt: '2026-10-26T18:30:00Z'
  },
  {
    id: 'sample-lantern-2',
    userId: 'sample-user-demo',
    title: "Uncle Marco's Cedar Woodworking Shop",
    dateOrPeriod: "Autumn Saturdays, 1994",
    peopleRemembered: ["Uncle Marco"],
    category: "Wisdom",
    story: "The fragrance of red cedar shavings and clove oil always announced Saturday mornings in Uncle Marco's garage workshop. He taught us how to run fingertips along the grain to read the tree's history before picking up a hand plane. Even when our cuts were crooked, he would smile patiently, wipe the sawdust from his spectacles, and show us how to turn a mistake into a joint.",
    meaningfulDetails: [
      {
        type: 'saying_or_proverb',
        label: 'Woodcraft Philosophy',
        value: '“Measure twice, breathe once, and forgive the wood when it surprises you.”'
      },
      {
        type: 'keepsake_or_object',
        label: 'Hand-Carved Keepsake',
        value: 'A small cherrywood honey dipper smoothed with walnut oil, still kept in the kitchen crock.'
      },
      {
        type: 'favorite_song',
        label: 'Workshop Radio Station',
        value: 'Old acoustic bluegrass playing softly on the dusty tube radio.'
      }
    ],
    tags: ['Woodworking', 'Cedar', 'Uncle Marco', 'Craftsmanship', 'Saturdays'],
    isSample: true,
    privacyLevel: 'FAMILY_EXPORTABLE',
    lanternColor: 'amber',
    audioNote: {
      recorded: false,
      durationSeconds: 0
    },
    createdAt: '2026-10-26T19:15:00Z',
    updatedAt: '2026-10-26T19:15:00Z'
  },
  {
    id: 'sample-lantern-3',
    userId: 'sample-user-demo',
    title: "The Floating Lanterns of Thu Bon River",
    dateOrPeriod: "Mid-Autumn Moon, October 2005",
    peopleRemembered: ["Grandfather Thang", "Elder Sister Mai"],
    category: "Remembrance",
    story: "Under the silver moon shining over Hoi An, Grandfather Thang bought three paper lanterns folded like lotus blossoms with tiny beeswax candles. We knelt along the stone steps by the water. He whispered a silent wish of gratitude for those who came before us, and together we gently pushed the glowing lanterns onto the dark river. We watched the amber lights float out until they joined hundreds of others drifting toward the open sea.",
    meaningfulDetails: [
      {
        type: 'family_tradition',
        label: 'Full Moon Lotus Offering',
        value: 'Releasing paper lanterns on the river to honor ancestors with silent gratitude and peace.'
      },
      {
        type: 'special_place',
        label: 'Thu Bon Riverbank',
        value: 'The mossy stone steps below the yellow lantern stalls in the old quarter.'
      },
      {
        type: 'saying_or_proverb',
        label: 'Grandfather’s Blessing',
        value: '“The river carries the flame, but your heart keeps the light.”'
      }
    ],
    tags: ['Hoi An', 'Lotus Lantern', 'Full Moon', 'River', 'Ancestors'],
    isSample: true,
    privacyLevel: 'FAMILY_EXPORTABLE',
    lanternColor: 'rose',
    audioNote: {
      recorded: true,
      durationSeconds: 35,
      transcriptSummary: 'Lapping river water against stone steps with distant temple chimes.'
    },
    createdAt: '2026-10-26T20:00:00Z',
    updatedAt: '2026-10-26T20:00:00Z'
  }
];
