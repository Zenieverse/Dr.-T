import { Book } from '../types';

export const MOCK_BOOKS: Book[] = [
  {
    id: 'book_forest_mind',
    title: 'The Hidden Life of Trees & Mycorrhizal Networks',
    originalTitle: 'Das geheime Leben der Bäume',
    author: 'Peter Wohlleben & Suzanne Simard',
    authorBio: 'Forester and forest ecologist renowned for discovering chemical and fungal communication networks in ancient woodlands.',
    coverImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=80',
    language: 'English (Translated from German)',
    originalLanguage: 'German',
    branchId: 'earth',
    year: 2016,
    pages: 288,
    format: 'PDF',
    provenance: 'OPEN_ACCESS',
    provenanceDetails: 'Digitized and annotated under Creative Commons Open Knowledge license in collaboration with the Forest Ecology Institute.',
    description: 'A groundbreaking exploration of how ancient forests operate as living social communities, sharing carbon, water, and warning signals through subterranean mycelial webs.',
    summary: 'Trees in a healthy forest are not solitary competitors. Through the "Wood Wide Web"—fungal mycorrhizal mycelium—mother trees nourish younger saplings, send danger signals regarding insect infestations, and maintain a microclimate that shields the entire canopy from extreme heat and drought.',
    keyTakeaways: [
      'Trees share nutrients through symbiotic fungal networks (mycorrhizae).',
      'Old-growth "Mother Trees" act as central hubs, nursing seedlings with carbon and water.',
      'Chemical aerosols and subterranean electrical impulses warn neighboring trees of pest attacks within minutes.',
      'Isolated plantation trees without network support live substantially shorter, more vulnerable lives.'
    ],
    chapters: [
      {
        id: 'ch_1',
        title: 'Chapter 1: The Subterranean Internet of Fungi',
        pageNumber: 1,
        readTimeMinutes: 6,
        content: `A tree is not a lone monument standing proudly in the wind. Underneath our walking boots, beneath the carpet of decomposing needles and damp moss, lies an intricate living internet of microscopic fungal hyphae connecting hundreds of tree root tips.

When a birch tree is shaded by a towering Douglas fir during early spring, the fungal bridge actively transports radioactive carbon isotopes from the fir to the birch. In midsummer, when the birch's broad leaves receive full sun while the evergreen fir is stressed, the birch repays the carbon debt tenfold.

This reciprocity completely dismantles the 19th-century hyper-individualist assumption of brute biological competition. The forest acts as a singular supra-organism where collective canopy resilience guarantees the survival of every individual trunk.`
      },
      {
        id: 'ch_2',
        title: 'Chapter 2: The Language of Aromas & Warning Signals',
        pageNumber: 18,
        readTimeMinutes: 8,
        content: `When a giraffe or caterpillar begins chewing on the leaf of an African acacia or European oak, the bitten tree does not suffer silently. Within seconds, it floods its foliage with bitter tannins that repel the herbivore.

Simultaneously, the tree pumps out ethylene gas into the surrounding breeze. Neighboring acacias downwind detect the airborne pheromone within five minutes and preemptively manufacture toxic tannins before a single leaf has been touched.

In oak and beech forests, subterranean mycelial channels carry slow electrical wave pulses at the speed of one centimeter per minute, notifying the root zones of trees dozens of meters away to fortify their defense enzymes.`
      },
      {
        id: 'ch_3',
        title: 'Chapter 3: The Forest Thermostat & Rainmaker',
        pageNumber: 42,
        readTimeMinutes: 7,
        content: `Old-growth forests actively manufacture their own rain. Through the release of microscopic biological aerosols—terpenes, pollen fragments, and fungal spores—trees seed low-altitude clouds over continental landmasses thousands of kilometers away from ocean coasts.

Under an intact multi-tiered canopy, the midday temperature is often 8 to 12 degrees Celsius cooler than an adjacent clearcut field. The forest preserves soil moisture in deep humus sponges that slowly feed headwater streams across dry summer months.`
      }
    ],
    tags: ['Ecology', 'Forests', 'Mycology', 'Suzanne Simard', 'Wood Wide Web', 'Regenerative'],
    citationsCount: 142,
    readingTimeMinutes: 45,
    associatedGroveId: 'grove_mekong',
    associatedTreeSpecies: 'Hopea odorata (Sao Đen)',
    isPublicDomain: false
  },
  {
    id: 'book_truyen_kieu',
    title: 'The Tale of Kiều (Truyện Kiều)',
    originalTitle: 'Đoạn Trường Tân Thanh',
    author: 'Nguyễn Du (1766–1820)',
    authorBio: 'Great Vietnamese poet, philosopher, and diplomat, recognized by UNESCO as a World Cultural Celebrity.',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    language: 'Vietnamese / English Bilingual',
    originalLanguage: 'Classical Vietnamese (Chữ Nôm)',
    branchId: 'literature',
    year: 1820,
    pages: 3254,
    format: 'PDF',
    provenance: 'PUBLIC_DOMAIN',
    provenanceDetails: 'National literary masterpiece of Vietnam, preserved in original Lục Bát poetic meter (6-8 syllable verses) with modern English translations.',
    description: 'The monumental 3,254-line verse novel recounting the trials, filial sacrifice, and enduring spiritual dignity of Vương Thúy Kiều. The crown jewel of Vietnamese literature.',
    summary: 'Truyện Kiều explores the tragic tension between Tài (human talent/genius) and Mệnh (destiny/fate), grounded in Buddhist karma and Confucian filial devotion. Kiều willingly sells herself into servitude to rescue her falsely imprisoned father and younger brother, enduring fifteen years of hardship with unwavering moral purity.',
    keyTakeaways: [
      'The masterpiece of the Vietnamese Lục Bát (6-8) verse tradition.',
      'Philosophical synthesis of Confucian filial piety, Daoist balance, and Buddhist compassion.',
      'Reflects the universal resilience of human dignity in the face of political injustice.',
      'Renowned for its extraordinary acoustic musicality when recited aloud.'
    ],
    chapters: [
      {
        id: 'kieu_1',
        title: 'Opening: Trăm năm trong cõi người ta (The Hundred Years of Mortal Life)',
        pageNumber: 1,
        readTimeMinutes: 5,
        content: `Trăm năm trong cõi người ta,
Chữ tài chữ mệnh khéo là ghét nhau.
Trải qua một cuộc bể dâu,
Những điều trông thấy mà đau đớn lòng.
Lạ gì bỉ sắc tư phong,
Trời xanh quen với má hồng đánh ghen.

[English Translation]:
A hundred years in this mortal span of life,
How talent and destiny seem perpetually at war.
Having lived through oceans turning into mulberry fields,
The sights witnessed bring profound sorrow to the heart.
No wonder that where one gift is lavish, another is withheld,
As if the blue heavens were jealous of rosy cheeks.`
      },
      {
        id: 'kieu_2',
        title: 'The Qingming Festival & The Meeting at the Bridge',
        pageNumber: 12,
        readTimeMinutes: 7,
        content: `Ngày xuân con én đưa thoi,
Thiều quang chín chục đã ngoài sáu mươi.
Cỏ non xanh tận chân trời,
Cành lê trắng điểm một vài bông hoa.

[English Translation]:
Spring days glide by like a weaver's shuttle,
Of the ninety days of radiant light, more than sixty have passed.
Tender grass stretches green to the far horizon,
On the pear boughs, a few white blossoms gleam softly.`
      }
    ],
    tags: ['Vietnamese Literature', 'Nguyễn Du', 'Poetry', 'Lục Bát', 'Classics', 'UNESCO'],
    citationsCount: 420,
    readingTimeMinutes: 30,
    associatedGroveId: 'grove_vietnam',
    associatedTreeSpecies: 'Aquilaria crassna (Trầm Hương)',
    isPublicDomain: true
  },
  {
    id: 'book_miracle_mindfulness',
    title: 'The Miracle of Mindfulness: An Introduction to the Practice of Meditation',
    originalTitle: 'Phép Lạ Của Sự Tỉnh Thức',
    author: 'Thích Nhất Hạnh',
    authorBio: 'Zen master, peace activist, poet, and founder of the Plum Village Tradition, nominated for the Nobel Peace Prize by Martin Luther King Jr.',
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80',
    language: 'English / Vietnamese',
    originalLanguage: 'Vietnamese',
    branchId: 'zen',
    year: 1975,
    pages: 140,
    format: 'EPUB',
    provenance: 'OPEN_ACCESS',
    provenanceDetails: 'Authorized educational edition provided under Plum Village Mindful Education Commons protocols.',
    description: 'A warm, practical manual revealing how washing the dishes, drinking tea, walking, and peeling an orange can become direct gateways to profound peace and mental clarity.',
    summary: 'Mindfulness is not an escape from daily life into an abstract cave; it is arriving fully in the only moment we ever truly inhabit—the present. By anchoring the mind in the rhythm of the in-breath and out-breath, ordinary actions transform into sacred presence.',
    keyTakeaways: [
      'Washing dishes just to wash the dishes—being fully present with the soapy water.',
      'Breathing in, I calm body and mind; breathing out, I smile.',
      'The present moment is the only moment available to us, and it is the door to all moments.',
      'Peace in oneself brings peace in the world.'
    ],
    chapters: [
      {
        id: 'zen_1',
        title: 'The Essential Discipline: Washing the Dishes',
        pageNumber: 1,
        readTimeMinutes: 5,
        content: `While washing the dishes, you might think about the cup of tea that awaits you afterward, and so you hurry to get them done as if they were a nuisance. But if you do that, you are not washing the dishes while washing the dishes. Even more, you will not be drinking tea when you drink tea. You will be thinking about what to do next.

There are two ways to wash the dishes. The first is to wash the dishes in order to have clean dishes, and the second is to wash the dishes in order to wash the dishes.

If while washing dishes, we think only of the cup of tea that awaits us, thus hurrying to get the dishes out of the way as if they were a nuisance, then we are not 'alive' during the time we are washing the dishes. We are completely incapable of realizing the miracle of life while standing at the sink.`
      },
      {
        id: 'zen_2',
        title: 'The Miracle is to Walk on the Earth',
        pageNumber: 24,
        readTimeMinutes: 6,
        content: `People usually consider walking on water or in thin air a miracle. But I think the real miracle is not to walk either on water or in thin air, but to walk on earth.

Every day we are engaged in a miracle which we don't even recognize: a blue sky, white clouds, green leaves, the black, curious eyes of a child—our own two eyes. All is a miracle.

Take gentle steps on the earth with the bottoms of your feet kissing the soil, feeling the support of our Mother Earth.`
      }
    ],
    tags: ['Zen', 'Mindfulness', 'Thich Nhat Hanh', 'Meditation', 'Peace', 'Daily Practice'],
    citationsCount: 280,
    readingTimeMinutes: 25,
    associatedGroveId: 'grove_vietnam',
    associatedTreeSpecies: 'Ficus religiosa (Cây Bồ Đề)',
    isPublicDomain: false
  },
  {
    id: 'book_origin_species',
    title: 'On the Origin of Species by Means of Natural Selection',
    author: 'Charles Darwin',
    authorBio: 'English naturalist, geologist and biologist, widely known for his contributions to evolutionary biology.',
    coverImage: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
    language: 'English',
    branchId: 'science',
    year: 1859,
    pages: 502,
    format: 'PDF',
    provenance: 'PUBLIC_DOMAIN',
    provenanceDetails: 'Preserved from the first 1859 John Murray edition. Full original figures and evolutionary tree diagrams.',
    description: 'The foundational text of evolutionary biology presenting the scientific theory that populations evolve over generations through a process of natural selection.',
    summary: 'Darwin demonstrates through meticulous empirical observation of domestic pigeons, Galápagos finches, and fossil strata how slight variations beneficial to survival accumulate over deep geological time, branching out into the magnificent tree of life.',
    keyTakeaways: [
      'Descent with modification from common ancestors.',
      'Natural selection acts on subtle heritable variations.',
      'The metaphorical "Tree of Life" connects all living beings in kinship.',
      'There is grandeur in this view of life.'
    ],
    chapters: [
      {
        id: 'darwin_1',
        title: 'Chapter IV: Natural Selection; or the Survival of the Fittest',
        pageNumber: 80,
        readTimeMinutes: 7,
        content: `Can the liberties of nature be compared with the slow, feeble efforts of man? How fleeting are the wishes and efforts of man! How short his time! And consequently how poor will be his results, compared with those accumulated by nature during whole geological periods.

Can we wonder, then, that nature's productions should be far 'truer' in character than man's productions; that they should be infinitely better adapted to the most complex conditions of life, and should plainly bear the stamp of far higher workmanship?`
      },
      {
        id: 'darwin_end',
        title: 'Recapitulation & Conclusion: There is Grandeur in this View of Life',
        pageNumber: 489,
        readTimeMinutes: 5,
        content: `It is interesting to contemplate a tangled bank, clothed with many plants of many kinds, with birds singing on the bushes, with various insects flitting about, and with worms crawling through the damp earth, and to reflect that these elaborately constructed forms, so different from each other, and dependent on each other in so complex a manner, have all been produced by laws acting around us.

There is grandeur in this view of life, with its several powers, having been originally breathed into a few forms or into one; and that, whilst this planet has gone cycling on according to the fixed law of gravity, from so simple a beginning endless forms most beautiful and most wonderful have been, and are being, evolved.`
      }
    ],
    tags: ['Evolution', 'Biology', 'Darwin', 'Natural Selection', 'History of Science'],
    citationsCount: 980,
    readingTimeMinutes: 35,
    associatedGroveId: 'grove_scientists',
    associatedTreeSpecies: 'Ginkgo biloba (Bạch Quả)',
    isPublicDomain: true
  },
  {
    id: 'book_one_straw_revolution',
    title: 'The One-Straw Revolution: An Introduction to Natural Farming',
    originalTitle: 'わら一本の革命',
    author: 'Masanobu Fukuoka',
    authorBio: 'Japanese farmer and philosopher celebrated for his pioneering natural farming philosophy (Do-Nothing Farming) and clay seed bomb reforestation.',
    coverImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop&q=80',
    language: 'English (Translated from Japanese)',
    originalLanguage: 'Japanese',
    branchId: 'agriculture',
    year: 1975,
    pages: 184,
    format: 'PDF',
    provenance: 'PEER_REVIEWED',
    provenanceDetails: 'Annotated edition reviewed by the International Agroecology & Soil Biology Consortium.',
    description: 'A manifesto for farming in cooperation with nature rather than attempting to conquer it. Four core principles: no plowing, no synthetic fertilizer, no weeding with herbicides, and no reliance on chemicals.',
    summary: 'Masanobu Fukuoka shows how covering soil with white clover and scattering rice-straw mulch produces yields matching chemical industrial farming with zero tillage, restoring desertified hillsides through clay seed ball aerial dispersion.',
    keyTakeaways: [
      'No tillage: Soil plows itself through earthworms and root penetration.',
      'No prepared compost or synthetic fertilizers: Natural straw mulch returns fertility.',
      'No weeding: Ground cover like white clover suppresses invasive weeds naturally.',
      'The ultimate goal of farming is not the growing of crops, but the cultivation of human beings.'
    ],
    chapters: [
      {
        id: 'fukuoka_1',
        title: 'Four Principles of Natural Farming',
        pageNumber: 33,
        readTimeMinutes: 6,
        content: `The first is NO CULTIVATION, that is, no plowing or turning the soil. For centuries, farmers have assumed that the plow is indispensable for growing crops. However, non-cultivation is fundamental to natural farming. The earth cultivates itself naturally by means of the penetration of plant roots and the activity of microorganisms, small animals, and earthworms.

The second is NO CHEMICAL FERTILIZER OR PREPARED COMPOST. If nature is left to itself, fertility increases. Left alone, the forest soil builds deep black humus.

The third is NO WEEDING BY TILLAGE OR HERBICIDES. Weeds play their part in building soil fertility and balancing the biological community.

The fourth is NO DEPENDENCE ON CHEMICALS. Healthy crops grown in balanced soil do not suffer catastrophic insect outbreaks.`
      }
    ],
    tags: ['Agroecology', 'Permaculture', 'Fukuoka', 'Living Soil', 'Natural Farming', 'Seed Balls'],
    citationsCount: 310,
    readingTimeMinutes: 28,
    associatedGroveId: 'grove_farmers',
    associatedTreeSpecies: 'Citrus reticulata (Quýt Bản Địa)',
    isPublicDomain: false
  },
  {
    id: 'book_little_prince',
    title: 'The Little Prince (Le Petit Prince)',
    originalTitle: 'Le Petit Prince',
    author: 'Antoine de Saint-Exupéry',
    authorBio: 'French aviator, writer, and philosopher who disappeared during a reconnaissance flight over the Mediterranean in 1944.',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    language: 'French / English / Vietnamese',
    originalLanguage: 'French',
    branchId: 'seedlings',
    year: 1943,
    pages: 96,
    format: 'PDF',
    provenance: 'PUBLIC_DOMAIN',
    provenanceDetails: 'Illustrated global heritage edition. Translated into over 500 languages.',
    description: 'A timeless philosophical fable about a young prince who visits various planets in space, addressing themes of loneliness, friendship, love, loss, and seeing with the heart.',
    summary: 'A downed aviator in the Sahara desert encounters a golden-haired boy from Asteroid B-612. Through the prince’s memories of his beloved rose and his friendship with the desert fox, the book delivers the unforgettable secret: "It is only with the heart that one can see rightly; what is essential is invisible to the eye."',
    keyTakeaways: [
      'What is essential is invisible to the eye; one sees rightly only with the heart.',
      'You become responsible forever for what you have tamed.',
      'Grown-ups love numbers and forget the color of a house or the sound of crickets.',
      'True love requires patience, time, and care.'
    ],
    chapters: [
      {
        id: 'prince_fox',
        title: 'Chapter XXI: The Fox and the Secret of Taming',
        pageNumber: 58,
        readTimeMinutes: 5,
        content: `"To me, you are still nothing more than a little boy who is just like a hundred thousand other little boys. And I have no need of you. And you, on your part, have no need of me. To you I am nothing more than a fox like a hundred thousand other foxes. But if you tame me, then we shall need each other. To me, you will be unique in all the world. To you, I shall be unique in all the world..."

"Goodbye," said the fox. "And now here is my secret, a very simple secret: It is only with the heart that one can see rightly; what is essential is invisible to the eye."

"What is essential is invisible to the eye," the little prince repeated, so that he would be sure to remember.`
      }
    ],
    tags: ['Children', 'Fable', 'Saint-Exupéry', 'Love', 'Wisdom', 'Classics'],
    citationsCount: 650,
    readingTimeMinutes: 20,
    associatedGroveId: 'grove_children',
    associatedTreeSpecies: 'Adansonia digitata (Baobab)',
    isPublicDomain: true
  },
  {
    id: 'book_governing_commons',
    title: 'Governing the Commons: The Evolution of Institutions for Collective Action',
    author: 'Elinor Ostrom (1933–2012)',
    authorBio: 'First woman to receive the Nobel Prize in Economic Sciences, celebrated for her empirical field research disproving the inexorable "Tragedy of the Commons".',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    language: 'English',
    branchId: 'work',
    year: 1990,
    pages: 280,
    format: 'PDF',
    provenance: 'PEER_REVIEWED',
    provenanceDetails: 'Peer-reviewed foundation for commons governance, multi-pool community economies, and decentralized digital networks.',
    description: 'Empirical economic analysis of how self-organized communities successfully manage shared common-pool resources—irrigation systems, grazing meadows, forests, and fisheries—without state coercion or private monopoly.',
    summary: 'Ostrom documents how communities across Switzerland, Spain, Japan, and the Philippines design durable institutional rules: clearly defined boundaries, proportional cost-benefit sharing, participatory rule-making, accountable monitoring, graduated sanctions, and low-cost conflict resolution.',
    keyTakeaways: [
      'The "Tragedy of the Commons" is not an inevitable fate when communication and local trust exist.',
      '8 design principles for enduring common-pool resource institutions.',
      'Polycentric governance: Nested enterprises manage ecological resources far better than monolithic bureaucracies.',
      'Direct structural basis for Trib-House 5-Pool economic design.'
    ],
    chapters: [
      {
        id: 'ostrom_1',
        title: 'Eight Design Principles of Stable Common-Pool Resource Management',
        pageNumber: 90,
        readTimeMinutes: 7,
        content: `1. CLEARLY DEFINED BOUNDARIES: Individuals who have rights to withdraw resource units from the CPR must be clearly defined, as must the boundaries of the CPR itself.

2. CONGRUENCE BETWEEN APPROPRIATION AND PROVISION RULES: Appropriation rules restricting time, place, technology, and quantity of resource units are related to local conditions and to provision rules requiring labor, materials, and funds.

3. COLLECTIVE-CHOICE ARRANGEMENTS: Most individuals affected by the operational rules can participate in modifying the operational rules.

4. MONITORING: Monitors who actively audit CPR conditions and appropriator behavior are accountable to the appropriators or are the appropriators.

5. GRADUATED SANCTIONS: Appropriators who violate operational rules are likely to be assessed graduated sanctions by other appropriators or officials.

6. CONFLICT-RESOLUTION MECHANISMS: Rapid access to low-cost local arenas to resolve conflicts between appropriators.`
      }
    ],
    tags: ['Economics', 'Commons', 'Elinor Ostrom', 'Nobel Prize', 'Governance', '5-Pool'],
    citationsCount: 1540,
    readingTimeMinutes: 32,
    associatedGroveId: 'grove_asia',
    associatedTreeSpecies: 'Dalbergia cochinchinensis (Cẩm Lai)',
    isPublicDomain: false
  },
  {
    id: 'book_sapiens_future',
    title: 'The Long View: 100-Year Thinking for a Fragile Planet',
    author: 'Dr. T Research Collective & Roman Krznaric',
    authorBio: 'Interdisciplinary research team synthesizing philosopher Roman Krznaric’s deep-time ethics with biomedical longevity models.',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    language: 'English / Vietnamese',
    branchId: 'future',
    year: 2026,
    pages: 210,
    format: 'MD',
    provenance: 'COMMUNITY',
    provenanceDetails: 'Collaborative living document created for the Trib-House 2126 Century Horizon Initiative.',
    description: 'An antidote to short-term algorithmic capitalism and quarterly news cycles. How human beings can become "Good Ancestors" by thinking in century arcs, planting forests they will never sit under, and sealing knowledge for future generations.',
    summary: 'Explores cathedral thinking, deep-time humility, intergenerational justice, and the art of leaving letters and seeds for humans living in the 22nd century.',
    keyTakeaways: [
      'Cathedral Thinking: Committing to projects whose completion outlasts a single human lifespan.',
      'Seventh Generation Principle of the Haudenosaunee Confederacy.',
      'The preservation of physical voice, memory, and seeds against digital obsolescence.',
      'The 100-Year Branch ritual in Trib-House.'
    ],
    chapters: [
      {
        id: 'long_1',
        title: 'The Gift to 2126',
        pageNumber: 1,
        readTimeMinutes: 6,
        content: `Imagine a child born in the year 2126. She walks into a cool grove of towering Hopea trees planted in the spring of 2026. She reaches her hand into a cedar time capsule box and pulls out a letter written by a teenager who lived a hundred years before her.

What words will bridge that century? Will she read of our anxieties, our technology, or our love for the clean water of her rivers?

When we write to the future, we acknowledge our kinship with those yet unborn. We cease to be merely consumers of the present; we become ancestors.`
      }
    ],
    tags: ['Future', 'Deep Time', '100 Years', 'Good Ancestor', 'Trib-House 2126'],
    citationsCount: 75,
    readingTimeMinutes: 20,
    associatedGroveId: 'grove_future',
    associatedTreeSpecies: 'Sequoiadendron giganteum / Hopea odorata',
    isPublicDomain: false
  }
];
