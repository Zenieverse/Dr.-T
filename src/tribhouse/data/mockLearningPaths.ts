import { LearningPath } from '../types';

export const MOCK_LEARNING_PATHS: LearningPath[] = [
  {
    id: 'path_ecology_30_days',
    title: 'Learn Ecology & Living Soil in 30 Days',
    branchId: 'earth',
    estimatedDays: 30,
    difficulty: 'Beginner',
    description: 'A transformative 30-day journey from understanding cellular photosynthesis to designing an indigenous food forest and restoring soil microbiome health.',
    curator: 'Suzanne Simard & Dr. T Earth Lab',
    curatorRole: 'Forest Ecologist & Soil Biologist',
    enrolledCount: 1420,
    completedCount: 680,
    badgeName: '🌱 Earth & Mycelium Steward',
    days: [
      {
        dayNumber: 1,
        title: 'What is an Ecosystem?',
        conceptSummary: 'An ecosystem is not a collection of isolated parts, but a dynamic, open web of energy flow, nutrient recycling, and inter-species relationships.',
        readingSnippet: 'Energy enters as sunlight, gets bound into carbohydrate polymers through photosynthetic leaves, and cascades through herbivores, decomposers, and subterranean fungi.',
        exercise: 'Step outside or look out your window. Identify 3 distinct trophic levels: a primary producer (plant), a consumer (insect/bird), and a decomposer (soil/lichen).',
        reflectionQuestion: 'How does modern urban infrastructure interrupt natural nutrient cycles, and what is one small way you can re-link with them?'
      },
      {
        dayNumber: 2,
        title: 'The Subterranean Web: Mycorrhizae & Fungi',
        conceptSummary: 'Fungal mycelium acts as nature’s internet, transporting phosphorus, zinc, and water to plant roots in exchange for photosynthetic glucose sugars.',
        readingSnippet: 'Over 90% of all land plant families form obligate or facultative symbioses with mycorrhizal fungi. Without fungi, terrestrial plant life would collapse.',
        exercise: 'Take a pinch of healthy forest or garden soil and examine it under sunlight. Look for white, thread-like fungal hyphae knitting soil grains together.',
        reflectionQuestion: 'Why does excessive chemical tillage destroy fungal networks, and what happens to water retention when soil aggregates break down?'
      },
      {
        dayNumber: 3,
        title: 'Living Soil: Beyond Dirt',
        conceptSummary: 'Soil is a living organism containing billions of bacteria, protozoa, and nematodes per tablespoon.',
        readingSnippet: 'Dirt is dead mineral sand, silt, and clay. Soil is alive with organic matter, humic acids, and microscopic microbial communities.',
        exercise: 'Perform a jar percolation test with local soil to measure sand, silt, clay, and organic matter ratios.',
        reflectionQuestion: 'What role does mulch and decaying leaf litter play in shielding soil microbes from intense solar ultraviolet radiation?'
      },
      {
        dayNumber: 4,
        title: 'Forest Stratification & Canopies',
        conceptSummary: 'Understanding the 7 ecological layers of a natural forest: canopy, sub-canopy, shrub, herbaceous, ground cover, rhizosphere, and vertical climber vines.',
        readingSnippet: 'A multi-tiered forest captures over 95% of incident sunlight across varying angles throughout the day, whereas a monoculture lawn reflects or wastes over 80%.',
        exercise: 'Sketch a 7-layer food forest design suitable for a 10-square-meter urban rooftop or backyard garden.',
        reflectionQuestion: 'How can urban food forests cool city microclimates and provide resilience against extreme heatwaves?'
      }
    ]
  },
  {
    id: 'path_socratic_reasoning',
    title: 'The Art of Socratic Dialogue & Critical Epistemology',
    branchId: 'mind',
    estimatedDays: 14,
    difficulty: 'Intermediate',
    description: 'Sharpen your mind to detect cognitive biases, challenge unexamined assumptions, and engage in compassionate, evidence-grounded discourse.',
    curator: 'Dr. T Ethics & Philosophy Collective',
    curatorRole: 'Cognitive Scientist & Socratic Inquirer',
    enrolledCount: 980,
    completedCount: 430,
    badgeName: '🧭 Socratic Truth Navigator',
    days: [
      {
        dayNumber: 1,
        title: 'The Socratic Paradox: Knowing that You Know Nothing',
        conceptSummary: 'Intellectual humility is the foundational gateway to genuine discovery. Certainty is the enemy of deeper understanding.',
        readingSnippet: 'Socrates wandered Athens not to impart dogma, but to help interlocutors discover the hidden contradictions within their own unexamined premises.',
        exercise: 'Write down 3 beliefs you hold with high confidence. For each, articulate the strongest possible counter-argument a thoughtful critic might make.',
        reflectionQuestion: 'Why is admitting uncertainty in public discourse often mistaken for weakness, and how can we cultivate intellectual courage?'
      },
      {
        dayNumber: 2,
        title: 'Dissecting Fallacies: Correlation vs. Causation',
        conceptSummary: 'Learning to isolate confounding variables, temporal sequence, and mechanistic plausibility.',
        readingSnippet: 'Just because event B follows event A does not mean event A caused event B (Post hoc ergo propter hoc).',
        exercise: 'Find a recent headline in media asserting a causal link. Identify what confounding variables were ignored in the reporting.',
        reflectionQuestion: 'How can generative AI models be guided to cite contradictory evidence rather than simply confirming user bias?'
      }
    ]
  }
];
