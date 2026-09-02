import { KnowledgeNode, KnowledgeEdge } from '../types';

export const MOCK_GRAPH_NODES: KnowledgeNode[] = [
  // Core Ideas & Topics
  {
    id: 'node_mycorrhizal',
    label: 'Mycorrhizal Fungal Networks',
    type: 'Idea',
    branchId: 'earth',
    description: 'Subterranean symbiotic fungal networks (hyphae) linking tree root systems to share carbon, water, and biochemical warning signals.',
    significance: 'Dismantled 19th-century hyper-competitive views of biological ecosystems, proving collaborative supra-organism mechanics.',
    provenance: 'PEER_REVIEWED',
    era: '1997 - Present',
    connectionsCount: 7,
    x: 480,
    y: 220
  },
  {
    id: 'node_wood_wide_web',
    label: 'Wood Wide Web',
    type: 'Topic',
    branchId: 'earth',
    description: 'The conceptual model of forest communication, nutrient exchange, and Mother Tree nursing behavior discovered by Suzanne Simard.',
    significance: 'Inspired both biological and decentralized technological network architectures.',
    provenance: 'PEER_REVIEWED',
    era: '1997',
    connectionsCount: 6,
    x: 360,
    y: 180
  },
  {
    id: 'node_mother_trees',
    label: 'Old-Growth Mother Trees',
    type: 'Species',
    branchId: 'earth',
    description: 'Ancient hub trees in old-growth canopies that support hundreds of seedlings through mycorrhizal conduits.',
    significance: 'Keystone nodes whose preservation dictates the survival of surrounding canopy biodiversity.',
    provenance: 'PEER_REVIEWED',
    era: 'Prehistoric - Present',
    connectionsCount: 5,
    x: 260,
    y: 260
  },
  {
    id: 'node_living_soil',
    label: 'Living Soil Microbiome',
    type: 'Topic',
    branchId: 'agriculture',
    description: 'Dense ecosystem of bacteria, protozoa, fungi, and nematodes that transform organic minerals into bio-available plant nutrients without chemical tillage.',
    significance: 'Core foundation for global food security, climate carbon sequestration, and watershed filtration.',
    provenance: 'PEER_REVIEWED',
    era: 'Ancient - Modern',
    connectionsCount: 8,
    x: 620,
    y: 320
  },
  {
    id: 'node_fukuoka',
    label: 'Masanobu Fukuoka (Natural Farming)',
    type: 'Author',
    branchId: 'agriculture',
    description: 'Philosopher and agricultural scientist who formulated Do-Nothing Farming (no tillage, no weeding, no chemicals, no compost).',
    significance: 'Pioneered clay seed ball desert revegetation and showed natural farming out-yielding industrial monoculture.',
    provenance: 'PRIMARY_SOURCE',
    era: '1913 - 2008',
    connectionsCount: 5,
    x: 740,
    y: 380
  },
  {
    id: 'node_commons_governance',
    label: 'Governing the Commons',
    type: 'Idea',
    branchId: 'work',
    description: 'Elinor Ostrom’s 8 institutional design principles proving communities can manage shared resources sustainably without top-down state control or privatization.',
    significance: 'Awarded the Nobel Memorial Prize in Economic Sciences; intellectual foundation for Trib-House 5-Pool economics.',
    provenance: 'PEER_REVIEWED',
    era: '1990',
    connectionsCount: 6,
    x: 580,
    y: 480
  },
  {
    id: 'node_ostrom',
    label: 'Elinor Ostrom',
    type: 'Author',
    branchId: 'work',
    description: 'Political economist who conducted hundreds of global field studies on community-managed forests, fisheries, and irrigation canals.',
    significance: 'First female Nobel Laureate in Economics; proved local communication and graduated sanctions foster durable trust.',
    provenance: 'PRIMARY_SOURCE',
    era: '1933 - 2012',
    connectionsCount: 4,
    x: 700,
    y: 530
  },
  {
    id: 'node_kieu',
    label: 'The Tale of Kiều (Đoạn Trường Tân Thanh)',
    type: 'Book',
    branchId: 'literature',
    description: 'Nguyễn Du’s 3,254-line verse masterpiece in Lục Bát meter exploring the existential dance between human talent (Tài) and destiny (Mệnh).',
    significance: 'Spiritual soul of Vietnamese literature and UNESCO World Cultural Heritage.',
    provenance: 'PUBLIC_DOMAIN',
    era: '1820',
    connectionsCount: 5,
    x: 200,
    y: 400
  },
  {
    id: 'node_nguyen_du',
    label: 'Nguyễn Du',
    type: 'Author',
    branchId: 'literature',
    description: 'Vietnamese poet laureate and diplomat who elevated Chữ Nôm vernacular literature to the heights of world classical poetry.',
    significance: 'Synthesized Confucian ethics with deep Buddhist compassion for suffering beings.',
    provenance: 'HISTORICAL_SOURCE',
    era: '1766 - 1820',
    connectionsCount: 4,
    x: 120,
    y: 470
  },
  {
    id: 'node_mindfulness',
    label: 'Engaged Mindfulness & Interbeing',
    type: 'Idea',
    branchId: 'zen',
    description: 'Thích Nhất Hạnh’s teaching of Interbeing (Tiếp Hiện): nothing exists in isolation; a cloud exists in this sheet of paper, a tree exists in our breath.',
    significance: 'Global bridge between Buddhist contemplative practice, ecological ethics, and nonviolent peace activism.',
    provenance: 'PRIMARY_SOURCE',
    era: '1966 - Present',
    connectionsCount: 7,
    x: 340,
    y: 480
  },
  {
    id: 'node_thich_nhat_hanh',
    label: 'Thích Nhất Hạnh',
    type: 'Author',
    branchId: 'zen',
    description: 'Global Zen master, peace activist, poet, and founder of the International Plum Village Community.',
    significance: 'Nominated for Nobel Peace Prize by Martin Luther King Jr.; popularized walking meditation and deep slow listening.',
    provenance: 'PRIMARY_SOURCE',
    era: '1926 - 2022',
    connectionsCount: 6,
    x: 300,
    y: 570
  },
  {
    id: 'node_tree_of_life',
    label: 'Evolutionary Tree of Life',
    type: 'Idea',
    branchId: 'science',
    description: 'Darwinian genealogical kinship connecting all terrestrial organisms through descent with modification from common microbial ancestors.',
    significance: 'Fundamental unifying framework of modern biology, genetics, and ecology.',
    provenance: 'PEER_REVIEWED',
    era: '1859',
    connectionsCount: 6,
    x: 420,
    y: 90
  },
  {
    id: 'node_darwin',
    label: 'Charles Darwin',
    type: 'Author',
    branchId: 'science',
    description: 'English naturalist who authored On the Origin of Species after observing Galápagos biodiversity aboard the HMS Beagle.',
    significance: 'Established natural selection as the primary mechanism of biological speciation.',
    provenance: 'HISTORICAL_SOURCE',
    era: '1809 - 1882',
    connectionsCount: 5,
    x: 540,
    y: 80
  },
  {
    id: 'node_future_100_years',
    label: 'Cathedral Thinking & 100-Year Ethics',
    type: 'Question',
    branchId: 'future',
    description: 'How do humans build institutions, plant forests, and write letters intended for descendants 100 years into the future without expecting personal reward?',
    significance: 'Philosophical core of Trib-House 2126 Century Horizon and the Seventh Generation Principle.',
    provenance: 'COMMUNITY',
    era: '2026 - 2126',
    connectionsCount: 8,
    x: 500,
    y: 380
  }
];

export const MOCK_GRAPH_EDGES: KnowledgeEdge[] = [
  {
    id: 'edge_1',
    source: 'node_mycorrhizal',
    target: 'node_wood_wide_web',
    relation: 'derived_from',
    explanation: 'Mycorrhizal fungal hyphae provide the physical subterranean network for the Wood Wide Web concept.'
  },
  {
    id: 'edge_2',
    source: 'node_wood_wide_web',
    target: 'node_mother_trees',
    relation: 'scientifically_supports',
    explanation: 'Old-growth mother trees act as primary nutrient and informational router hubs on the mycorrhizal web.'
  },
  {
    id: 'edge_3',
    source: 'node_mycorrhizal',
    target: 'node_living_soil',
    relation: 'related_to',
    explanation: 'Fungal mycelium and soil microbial biomass form the living foundation of soil aggregation and humus.'
  },
  {
    id: 'edge_4',
    source: 'node_living_soil',
    target: 'node_fukuoka',
    relation: 'inspired_by',
    explanation: 'Fukuoka’s natural farming avoids plowing specifically to preserve undisturbed fungal hyphae and worm tunnels.'
  },
  {
    id: 'edge_5',
    source: 'node_mycorrhizal',
    target: 'node_mindfulness',
    relation: 'culturally_related',
    explanation: 'Both biological fungal networks and Thích Nhất Hạnh’s Interbeing demonstrate that no organism exists in isolated independence.'
  },
  {
    id: 'edge_6',
    source: 'node_mindfulness',
    target: 'node_thich_nhat_hanh',
    relation: 'written_by',
    explanation: 'Thích Nhất Hạnh articulated Interbeing and engaged mindfulness throughout his lifetime of writing and activism.'
  },
  {
    id: 'edge_7',
    source: 'node_kieu',
    target: 'node_nguyen_du',
    relation: 'written_by',
    explanation: 'Nguyễn Du composed Truyện Kiều in classical Vietnamese Lục Bát poetic meter in the early 19th century.'
  },
  {
    id: 'edge_8',
    source: 'node_kieu',
    target: 'node_mindfulness',
    relation: 'culturally_related',
    explanation: 'Both Truyện Kiều and Vietnamese Zen emphasize the cultivation of Tâm (the compassionate heart) over superficial talent or circumstance.'
  },
  {
    id: 'edge_9',
    source: 'node_commons_governance',
    target: 'node_ostrom',
    relation: 'written_by',
    explanation: 'Elinor Ostrom authored Governing the Commons (1990) synthesizing empirical field research on collective CPR stewardship.'
  },
  {
    id: 'edge_10',
    source: 'node_commons_governance',
    target: 'node_future_100_years',
    relation: 'teaches',
    explanation: 'Ostrom’s nested enterprise principles provide the institutional architecture for 100-year multi-pool knowledge governance.'
  },
  {
    id: 'edge_11',
    source: 'node_tree_of_life',
    target: 'node_darwin',
    relation: 'written_by',
    explanation: 'Charles Darwin drew the first famous Tree of Life diagram in his notebook B (1837) under the words "I think".'
  },
  {
    id: 'edge_12',
    source: 'node_tree_of_life',
    target: 'node_mycorrhizal',
    relation: 'expands',
    explanation: 'Mycorrhizal co-evolution reveals that trees and fungi evolved together as symbiotic partners for over 400 million years.'
  },
  {
    id: 'edge_13',
    source: 'node_future_100_years',
    target: 'node_wood_wide_web',
    relation: 'questions',
    explanation: 'Can human digital knowledge archives be organized like living forests rather than extractive data silos?'
  }
];
