import { CampusPavilion, ArchitecturalPerspective, CampusWeatherTime } from '../types';

export const CAMPUS_WEATHER_OPTIONS: { id: CampusWeatherTime; label: string; icon: string; description: string; ambientColor: string }[] = [
  { id: 'dawn', label: 'Dawn Mist (05:30)', icon: '🌅', description: 'Soft golden light breaking through morning mist with active canopy birdsong.', ambientColor: 'from-amber-900/30 via-stone-900 to-stone-950' },
  { id: 'morning', label: 'Morning Calm (08:30)', icon: '☀️', description: 'Gentle angled daylight illuminating elevated walkways and reading alcoves.', ambientColor: 'from-emerald-950/40 via-stone-900 to-stone-950' },
  { id: 'midday', label: 'Midday Shade (12:00)', icon: '🍃', description: 'Deep cooling canopy shade with dappled sunlight through layered leaves.', ambientColor: 'from-green-950/30 via-stone-900 to-stone-950' },
  { id: 'rain', label: 'Gentle Rain (14:30)', icon: '🌧️', description: 'Rhythmic raindrops on timber overhangs draining into visible rain gardens.', ambientColor: 'from-slate-900/50 via-stone-900 to-stone-950' },
  { id: 'monsoon', label: 'Monsoon Canopy (16:00)', icon: '⛈️', description: 'Vibrant tropical rainfall with protected breezeways and misty horizon.', ambientColor: 'from-cyan-950/50 via-stone-900 to-stone-950' },
  { id: 'sunset', label: 'Golden Sunset (18:15)', icon: '🌇', description: 'Warm amber glow across tree crowns and long shadows on forest walkways.', ambientColor: 'from-orange-950/40 via-stone-900 to-stone-950' },
  { id: 'night', label: 'Dark Sky Night (21:00)', icon: '✨', description: 'Shielded warm amber lanterns, glowing reading niches, fireflies and starlight.', ambientColor: 'from-indigo-950/40 via-stone-950 to-stone-950' },
  { id: 'century100', label: '100-Year Horizon (2126 CE)', icon: '⏳', description: 'Patinated weathered silver-grey timber embraced seamlessly by century-old living trees.', ambientColor: 'from-emerald-950/50 via-stone-900 to-stone-950' }
];

export const CAMPUS_PAVILIONS: CampusPavilion[] = [
  {
    id: 'reading_house',
    name: 'The Main Reading House',
    subtitle: 'Flagship 3-Level Circular Sanctuary among Ancient Canopies',
    category: 'READING',
    levels: 3,
    areaSqm: 850,
    elevationMeters: 10.5,
    capacity: '45 Quiet Readers',
    primaryMaterials: ['Locally sourced Ironwood', 'Engineered Glulam Arches', 'Woven Rattan Sunscreens', 'Basalt Stone Footings'],
    architecturalPhilosophy: 'A circular nest woven around living trunk columns where light and wind breathe naturally through human-scale bookshelves.',
    keyFeatures: [
      'Central living Dipterocarp trunk column with flexible non-invasive collar',
      'Continuous spiraling human-scale bookshelves following organic contours',
      'Deep 2.4m roof overhangs preventing solar heat gain and tropical glare',
      'Cantilevered reading balconies projecting directly into the mid-canopy layer'
    ],
    soundscapeTrack: 'Canopy Breeze & Distant Hornbill',
    quoteInscription: 'Knowledge grows here as quietly as trees.',
    coordinates: { x: 48, y: 38 },
    perspectives: ['p4', 'p5', 'p1', 'p2', 'p3'],
    passiveDesign: {
      ventilation: 'Thermal stack effect through central louvered clerestory cupola with 100% natural cross-ventilation',
      solarStrategy: 'Low-profile matte photovoltaic shingles on north-south ridge lines; 85% shaded facade',
      rainwater: 'Perimeter copper scuppers directing precipitation into cascading rocky rain pools',
      treeIntegration: 'Triple-point frictionless elastomeric rings permitting 15cm sway without trunk abrasion',
      accessibility: 'Integrated gentle incline switchback timber ramp (1:16 gradient) and zero-energy hydraulic lift'
    }
  },
  {
    id: 'research_house',
    name: 'The Research House & Commons',
    subtitle: 'High-Performance Ecological Informatics & Quiet Scholar Station',
    category: 'RESEARCH',
    levels: 2,
    areaSqm: 620,
    elevationMeters: 9.0,
    capacity: '28 Researchers & Scholars',
    primaryMaterials: ['Dark Acoustic Timber', 'Low-Iron Insulated Glazing', 'Recycled Bronze Framing', 'Honed River Stone'],
    architecturalPhilosophy: 'Where open computational science and ancient botany meet in deep, distraction-free architectural silence.',
    keyFeatures: [
      'Large 12-meter communal research table crafted from fallen salvaged timber',
      'AI Librarian circular acoustic table for non-invasive voice and visual dialogue',
      'High-resolution archival displays with matte anti-reflective nano-coatings',
      'Deep research pods with independent directional acoustic baffles'
    ],
    soundscapeTrack: 'Soft Stream Water & Distant Cicada',
    quoteInscription: 'Investigate the root before you classify the branch.',
    coordinates: { x: 68, y: 30 },
    perspectives: ['p6', 'p7', 'p8', 'p1'],
    passiveDesign: {
      ventilation: 'Under-floor displacement air distribution powered by cool forest microclimate',
      solarStrategy: 'Deep vertical timber louvers auto-orienting to solar azimuth for zero thermal penalty',
      rainwater: 'Closed-loop micro-cooling water curtain along eastern facade',
      treeIntegration: 'Independent micro-pile tripod foundation completely bypassing surrounding root zones',
      accessibility: 'Direct bridge connection from central concourse with braille tactical navigation strips'
    }
  },
  {
    id: 'silent_room',
    name: 'The Silent Room & Future Archive',
    subtitle: 'Century Time Capsule & Intimate Contemplative Vault (1–4 Persons)',
    category: 'ARCHIVE',
    levels: 1,
    areaSqm: 24,
    elevationMeters: 7.5,
    capacity: '1–4 Silent Visitors',
    primaryMaterials: ['Aged Smoked Cypress', 'Handmade Mulberry Paper', 'Chiseled Granite', 'Waxed Dark Oak'],
    architecturalPhilosophy: 'Inspired by the 100-Year Future Library: absolute zero electronic interference, honoring manuscripts and time continuity.',
    keyFeatures: [
      'Central carved granite table housing sealed future letters (2026, 2036, 2051, 2076, 2126)',
      'Single narrow vertical slot window framing the ceremonial 100-Year Native Tree',
      'Natural acoustic absorption achieving NC-15 sound rating (whisper level)',
      'Zero screens, zero wireless transceivers, zero commercial objects'
    ],
    soundscapeTrack: 'Absolute Silence with Subtle Distant Rain',
    quoteInscription: 'For those who come after us.',
    coordinates: { x: 55, y: 18 },
    perspectives: ['p9', 'p20'],
    passiveDesign: {
      ventilation: 'Low-velocity passive sub-canopy labyrinth bringing 22°C earth-cooled air',
      solarStrategy: 'Indirect ambient bounce light through north-facing timber clerestory',
      rainwater: 'Discreet water collection channel preserving museum-grade humidity (45-55%)',
      treeIntegration: 'Suspended via dual structural glulam outriggers anchored to twin sentinel oaks',
      accessibility: 'Level threshold entryway with recessed low-glare step lighting'
    }
  },
  {
    id: 'writing_house',
    name: 'The Writing House',
    subtitle: 'Solitary Desks for Authors, Poets, Translators & Epistolarians',
    category: 'READING',
    levels: 2,
    areaSqm: 180,
    elevationMeters: 11.0,
    capacity: '12 Solitary Writers',
    primaryMaterials: ['Aromatic Cedar', 'Woven Rice-Straw Mats', 'Sliding Shoji-Style Screens', 'Charred Yakisugi Cedar'],
    architecturalPhilosophy: 'Every desk angles toward a unique, unrepeatable view of forest, stream, mist, or sky.',
    keyFeatures: [
      'Individual writing niches equipped with handmade paper, inkwells, and mechanical tools',
      'Sliding operable timber shutters allowing full openness to mountain and cloud vistas',
      'Integrated drying racks for ink manuscripts and handbound folios',
      'Upper loft for speculative composition and long-form epistolary writing'
    ],
    soundscapeTrack: 'Soft Rustling Bamboo & Distant Water Droplets',
    quoteInscription: 'Write only what makes the world quieter.',
    coordinates: { x: 28, y: 46 },
    perspectives: ['p10', 'p3'],
    passiveDesign: {
      ventilation: 'Operable high/low shutter pairing creating continuous gentle draft without disturbing paper',
      solarStrategy: 'Wide eaves with woven bamboo awnings diffusing high tropical glare',
      rainwater: 'Rain chains (Kusari-doi) transforming rainfall into visual and acoustic poetry',
      treeIntegration: 'Pin-connected collar assembly with neoprene vibration dampeners',
      accessibility: 'Continuous gentle incline skyway with ergonomic handrails'
    }
  },
  {
    id: 'children_treehouse',
    name: 'Children’s Treehouse of Wonder',
    subtitle: 'Playful Biophilic Discovery, Climbing Alcoves & Nature Specimens',
    category: 'INTERGENERATIONAL',
    levels: 2,
    areaSqm: 320,
    elevationMeters: 6.0,
    capacity: '30 Children & Families',
    primaryMaterials: ['Smooth Sanded Teak', 'Organic Hemp Rope Mesh', 'Natural Cork Flooring', 'Shatterproof Eco-Glass'],
    architecturalPhilosophy: 'Architecture as an ecological climbing apparatus where children discover beetles, stars, stories, and botany without plastic toys.',
    keyFeatures: [
      'Low curved bookshelves accessible to toddlers, children, and young naturalists',
      'Hidden reading caves and crawl-in canopy observation pods with magnifying viewports',
      'Astronomical brass telescope and rotating star-chart dome for night sky viewing',
      'Outdoor botanical discovery deck with living moss terrariums and native insect guides'
    ],
    soundscapeTrack: 'Playful Birdsong & Forest Leaf Murmurs',
    quoteInscription: 'Look closely at a single leaf and you will understand the universe.',
    coordinates: { x: 24, y: 64 },
    perspectives: ['p11', 'p2'],
    passiveDesign: {
      ventilation: 'Low-velocity breezeways with child-safe timber balustrades spaced at 80mm',
      solarStrategy: 'Perforated timber canopy filters replicating natural tree-crown dappled light',
      rainwater: 'Interactive see-through water wheel demonstrating kinetic energy from rainfall',
      treeIntegration: 'Multi-stem support platform distributing weight over 5 mature banyan buttresses',
      accessibility: 'Integrated inclusive ramps, low touch surfaces, and sensory-friendly quiet nooks'
    }
  },
  {
    id: 'elder_story_house',
    name: 'Elder Story House',
    subtitle: 'Circular Oral History Pavilion & Intergenerational Memory Hearth',
    category: 'INTERGENERATIONAL',
    levels: 1,
    areaSqm: 240,
    elevationMeters: 5.5,
    capacity: '25 Community Members',
    primaryMaterials: ['Warm Honey Pine', 'Embroidered Linen Cushions', 'Clay Tea Kiln Hearth', 'Woven Bamboo Ceiling'],
    architecturalPhilosophy: 'A gentle circle where elders speak, youths listen, and oral histories are recorded into the living digital commons.',
    keyFeatures: [
      'Concentric tiered seating with deep ergonomic cushions and tea-warming tables',
      'Discreet studio-grade acoustic boundary microphones integrated into timber beams',
      'Archival wall displaying physical heirloom photographs and historic seed collections',
      'Open terrace overlooking the ancestral native medicinal herbal garden'
    ],
    soundscapeTrack: 'Crackling Tea Hearth & Evening Crickets',
    quoteInscription: 'When an elder shares a memory, a living library opens its doors.',
    coordinates: { x: 74, y: 62 },
    perspectives: ['p12', 'p16'],
    passiveDesign: {
      ventilation: 'Low-profile perimeter louvers capturing prevailing valley thermal currents',
      solarStrategy: 'Deep veranda shading afternoon western sun with vertical living bamboo screens',
      rainwater: 'Central open-air atrium collecting precipitation into a pebble meditation reflecting basin',
      treeIntegration: 'Perimeter ring beam supported by treated hardwood pilings with zero root damage',
      accessibility: 'Zero-step entrance directly from the main ground-level boardwalk'
    }
  },
  {
    id: 'community_house',
    name: 'The Central Community House',
    subtitle: 'Gathering Hall, Commons Kitchen, Exhibition Wall & Living Agora',
    category: 'COMMUNITY',
    levels: 2,
    areaSqm: 720,
    elevationMeters: 4.5,
    capacity: '80 Community Members',
    primaryMaterials: ['Heavy Timber Post-and-Beam', 'Rammed Earth Walls', 'Terracotta Tile Roof', 'Polished Recycled Glass'],
    architecturalPhilosophy: 'The beating social heart of Trib-House where collective knowledge transforms into shared meals, workshops, and civic stewardship.',
    keyFeatures: [
      'Communal wood-fired tea kitchen and long communal dining tables for community meals',
      'Flexible modular partitions for book circles, scientific symposiums, and craft workshops',
      '100-Year Community Chronicle Wall showcasing resident reflections and tree planting counts',
      'Direct ground-level transition into the Permaculture Food Forest & Rain Wetland'
    ],
    soundscapeTrack: 'Soft Murmurs of Fellowship & Gentle Kettle Steam',
    quoteInscription: 'Community itself is the highest form of living knowledge.',
    coordinates: { x: 50, y: 78 },
    perspectives: ['p16', 'p1', 'p17'],
    passiveDesign: {
      ventilation: 'Double-height central clerestory creating continuous passive exhaust ventilation',
      solarStrategy: 'Integrated 24kW rooftop photovoltaic microgrid feeding campus battery storage',
      rainwater: '120,000-liter underground cistern providing 100% of non-potable campus irrigation',
      treeIntegration: 'Designed around three heritage ficus trees preserved in courtyard lightwells',
      accessibility: 'Full ADA / universal accessibility compliance with wide automatic sliding doors'
    }
  },
  {
    id: 'tea_house',
    name: 'Tea House & Mindful Pause',
    subtitle: 'Quiet Contemplation Pavilion inspired by Plum Village Principles',
    category: 'CONTEMPLATION',
    levels: 1,
    areaSqm: 65,
    elevationMeters: 8.0,
    capacity: '8 Mindful Guests',
    primaryMaterials: ['Raw Hinoki Wood', 'Hand-thrown Ceramic Tiles', 'Woven Rush Tatami', 'Natural Paper Screens'],
    architecturalPhilosophy: 'A sanctuary to stop, breathe, and drink a bowl of tea without hurry or digital distraction.',
    keyFeatures: [
      'Low sunken tea preparation counter with charcoal brazier and hot spring water source',
      'Framed uninterrupted panorama of distant forested ridge and morning mist',
      'Soft bronze mindfulness bell struck gently once every thirty minutes as a breath reminder',
      'Complete absence of electrical sockets, monitors, or artificial sound systems'
    ],
    soundscapeTrack: 'Singing Water Kettle & Temple Bell Reverberation',
    quoteInscription: 'Drink your tea slowly and reverently, as if it is the axis on which the whole earth revolves.',
    coordinates: { x: 38, y: 22 },
    perspectives: ['p13', 'p18'],
    passiveDesign: {
      ventilation: 'Tri-directional sliding screens opening 90% of the wall surface to forest breezes',
      solarStrategy: 'Oriented north-northeast to receive only gentle morning dawn illumination',
      rainwater: 'Spillway bamboo chutes directing rain onto smooth river stones beneath the deck',
      treeIntegration: 'Cantilevered tree bracket resting on heavy shock-absorbing timber springers',
      accessibility: 'Sloped bamboo boardwalk with tactile contrast borders'
    }
  },
  {
    id: 'rain_reading_room',
    name: 'The Rain Reading Room',
    subtitle: 'Monsoon-Optimized Sanctuary with Acoustic Water Chutes & Warm Fire',
    category: 'READING',
    levels: 1,
    areaSqm: 140,
    elevationMeters: 7.0,
    capacity: '16 Readers',
    primaryMaterials: ['Weathered Teak', 'Copper Acoustic Rain Gutters', 'Double-Glazed Panoramic Glass', 'Wool Felt'],
    architecturalPhilosophy: 'Where tropical torrential rain is not kept at bay as an adversary, but embraced as an intimate reading companion.',
    keyFeatures: [
      'Deep extended eaves with precision-tuned copper water channels creating resonant rainfall music',
      'Over-sized reading recliners with warm wool throws and adjustable brass reading lamps',
      'Protected glass window seats suspended over the rushing stream and rain garden below',
      'Dedicated herbal tea station offering roasted ginger, cinnamon bark, and wild mountain tea'
    ],
    soundscapeTrack: 'Torrential Monsoon Rain on Copper & Wet Forest Leaves',
    quoteInscription: 'Rain is the sky reading its own thoughts to the earth.',
    coordinates: { x: 78, y: 44 },
    perspectives: ['p14', 'p19'],
    passiveDesign: {
      ventilation: 'Acoustically baffled louver vents allowing fresh moist air without water intrusion',
      solarStrategy: 'High-performance low-e glass coated to prevent condensation during monsoon seasons',
      rainwater: 'Primary collection hub feeding the campus hydrological botanical testing wetland',
      treeIntegration: 'Engineered glulam scissor trusses bridging between two ancient camphor trees',
      accessibility: 'Weather-sheltered covered canopy walkway from the Main Reading House'
    }
  },
  {
    id: 'bird_listening_room',
    name: 'Bird Listening Sanctuary',
    subtitle: 'High-Canopy Acoustic Blind for Ornithology & Quiet Observation',
    category: 'CONTEMPLATION',
    levels: 1,
    areaSqm: 42,
    elevationMeters: 14.5,
    capacity: '6 Observers',
    primaryMaterials: ['Acoustic Slotted Cedar', 'Fine Bronze Insect Mesh', 'Matte Forest Camouflage Stains', 'Cork Desks'],
    architecturalPhilosophy: 'Suspended in the highest foliage layer with no technology other than field guides, binoculars, and deep human attention.',
    keyFeatures: [
      '360-degree acoustic bronze mesh walls allowing complete uninhibited bird sound transmission',
      'High-grade brass binocular mounts and leather-bound ornithological field guides',
      'Perch-friendly exterior architectural ledges planted with native berry-bearing epiphytes',
      'Carved wooden inscription above the lintel reminding all who enter'
    ],
    soundscapeTrack: 'Canopy Avian Choruses & High Foliage Wind',
    quoteInscription: 'Listen before you speak.',
    coordinates: { x: 62, y: 12 },
    perspectives: ['p15', 'p18'],
    passiveDesign: {
      ventilation: '100% open-air screened design with zero mechanical cooling needed at 14.5m elevation',
      solarStrategy: 'Natural tree canopy foliage providing 95% daylight shading throughout the year',
      rainwater: 'Lightweight sloped roof pitching rain silently away from observation portals',
      treeIntegration: 'Dynamic tension-rod suspension anchored to three living Dipterocarp main branches',
      accessibility: 'Spiral canopy incline walkway with resting landings every 1.5 meters elevation'
    }
  },
  {
    id: 'knowledge_graph_room',
    name: 'Interactive Knowledge Graph Pavilion',
    subtitle: 'Topological Living Data Immersion & Cross-Discipline Lineage',
    category: 'RESEARCH',
    levels: 1,
    areaSqm: 190,
    elevationMeters: 9.5,
    capacity: '20 Collaborative Scholars',
    primaryMaterials: ['Dark Matte Composite', 'Acoustic Slat Wood', 'Ultra-Fine Pixel Wall', 'Brushed Aluminum Details'],
    architecturalPhilosophy: 'Visualizing knowledge not as isolated silos, but as a living, branching ecological canopy of interrelated human thought.',
    keyFeatures: [
      'Curved 14-meter architectural knowledge graph display mapping cross-citations and book lineages',
      'Interactive tactile dials for traversing historical eras from 500 BCE to 2126 CE',
      'Spatial audio zoning enabling multiple research discussions without acoustic overlap',
      'Direct digital link to the Dr. T Biomedical Informatics & Open Science Knowledge Base'
    ],
    soundscapeTrack: 'Subtle Ambient Synth Tone & Distant Forest Water',
    quoteInscription: 'All knowledge is one living root system.',
    coordinates: { x: 82, y: 22 },
    perspectives: ['p8', 'p7'],
    passiveDesign: {
      ventilation: 'Passive air chimney with automated exhaust dampers maintaining optimal computer temperature',
      solarStrategy: 'Indirect north-facing clerestory glazing eliminating screen glare completely',
      rainwater: 'Exterior cooling waterfall wall moderating ambient room temperature naturally',
      treeIntegration: 'Independent micro-pile support frame separated 1.2m from adjacent tree root systems',
      accessibility: 'Fully wheelchair accessible interactive touch tables with height adjustment'
    }
  },
  {
    id: 'breathing_platform',
    name: 'Canopy Breathing & Pause Platform',
    subtitle: 'Minimalist Timber Perch for 4-7-8 Pranayama & Mindful Rest',
    category: 'CONTEMPLATION',
    levels: 1,
    areaSqm: 28,
    elevationMeters: 12.0,
    capacity: '2–4 Meditators',
    primaryMaterials: ['Natural Weathered Teak', 'Stainless Steel Safety Cables', 'Soft Bamboo Railing'],
    architecturalPhilosophy: 'A tiny circular timber platform suspended in the tree crowns with one simple bench and open sky above.',
    keyFeatures: [
      'Single handcrafted solid timber bench centered on the forest horizon',
      'Zero walls, zero roof, pure open canopy connection to moving clouds and tree crowns',
      'Subtle brass marker indicating the 4-7-8 diaphragmatic breathing rhythm',
      'Suspended walkway bridge with elastic sway dampeners providing gentle mindful presence'
    ],
    soundscapeTrack: 'Canopy Wind Whispers & Gentle Leaf Sighs',
    quoteInscription: 'Pause. Breathe. Continue.',
    coordinates: { x: 42, y: 56 },
    perspectives: ['p13', 'p18', 'p2'],
    passiveDesign: {
      ventilation: 'Completely open to natural ambient atmosphere',
      solarStrategy: 'Filtered natural shade from mature surrounding evergreen canopy',
      rainwater: 'Slotted timber decking permitting rain to fall directly to the forest floor',
      treeIntegration: 'Flexible friction collar clamps with zero invasive penetrations into the bark',
      accessibility: 'Connected via the main elevated skyway network'
    }
  }
];

export const ARCHITECTURAL_PERSPECTIVES: ArchitecturalPerspective[] = [
  {
    id: 'p1',
    number: 1,
    title: 'Bird’s-Eye Masterplan',
    subtitle: 'Ultra-realistic Aerial Drone View of the Complete Forest Campus',
    cameraType: "Bird's-Eye Drone",
    elevationDescription: '80–150m above site looking down at a 45-degree angle',
    lightingTime: 'dawn',
    pavilionId: 'community_house',
    shortDescription: 'The entire 12-pavilion living library campus distributed through ancient tropical canopy connected by gentle curving walkways.',
    composition: {
      foreground: 'Dense misty tree crowns with solar-shingle roofs peeking discreetly through foliage',
      middleground: 'Elevated pedestrian bridges connecting reading houses, research pavilions, and central agora',
      background: 'Cascading wetland rain gardens, permaculture food forest, and distant mountain ridge'
    },
    architecturalDetails: [
      '12 distinct timber pavilions occupying less than 8% of ground footprint',
      'Curving elevated timber walkways suspended 6–12 meters above forest floor',
      'Integrated low-profile photovoltaic roof shingles blending with tree canopy',
      'Rain gardens, hydrological retention ponds, and native biodiversity corridors'
    ],
    structuralNotes: 'All structures demonstrate physical balance, lightweight engineered glulam trusses, independent standoff foundations, and zero clear-cutting.',
    soundscape: 'Panoramic canopy wind, morning avian chorus, distant stream waterfalls',
    heroPrompt: `Ultra-realistic aerial drone photograph of the complete Trib-House Living Library campus embedded within a mature tropical forest, approximately twelve sophisticated timber treehouses distributed naturally through the canopy, elevated pedestrian bridges forming a quiet network between buildings, central community house, reading pavilions, research house, children's treehouse, future archive pavilion, writing house, gardens, rainwater ponds, rain gardens, ecological restoration areas, discreet integrated solar roofs, dense native vegetation completely dominating the landscape, architecture occupying a small percentage of the site, realistic topography, tree canopy textures, subtle human figures, birds visible near canopy, morning mist, highly believable sustainable architecture, world-class ecological campus, no resort aesthetic, no fantasy architecture, no amusement park, no giant roads, no excessive concrete, cinematic aerial architectural photography, physically accurate shadows and materials, 8K.`,
    aspectRatio: '16:9',
    svgVisualTheme: 'drone-aerial'
  },
  {
    id: 'p2',
    number: 2,
    title: 'Worm’s-Eye Forest Ground Perspective',
    subtitle: 'Dramatic Low-Angle View Looking Up Through Living Trunks & Walkways',
    cameraType: "Worm's-Eye Canopy",
    elevationDescription: '20–40 cm above forest floor looking vertically & diagonally upward',
    lightingTime: 'morning',
    pavilionId: 'reading_house',
    shortDescription: 'From the rich mossy forest floor, looking up past ancient buttress roots to suspended timber pavilions floating in sunlight beams.',
    composition: {
      foreground: 'Detailed moss, ferns, fallen leaves, exposed root systems, and moist rich soil',
      middleground: 'Massive vertical Dipterocarp tree trunks rising with structural engineered timber collars and bridge trusses',
      background: 'Suspended reading pavilions bathed in filtered sunlight with tiny human silhouettes and birds crossing'
    },
    architecturalDetails: [
      'Engineered glulam structural braces and non-invasive friction collars',
      'Cable-stayed lightweight bridges spanning between mature living trees',
      'Deep timber soffits with hand-rubbed natural oil finishes',
      'Filtered golden shafts of morning sunlight piercing through the humid canopy'
    ],
    structuralNotes: 'Structurally believable load paths transfer forces safely to tripod micropiles and living tree trunk springers without bark damage.',
    soundscape: 'Crisp forest floor crunch, dripping dew drops, resonant canopy birds',
    heroPrompt: `Camera only 30 cm above the forest floor, looking vertically and diagonally upward through enormous mature tropical trees, highly detailed roots, moss, fallen leaves and ferns in the foreground, a sophisticated timber-and-bamboo Trib-House Reading Pavilion suspended 8–12 meters above the ground among living trees, elegant structural braces and engineered timber joints visibly supporting the architecture, elevated walkways connecting to distant treehouses, people quietly reading behind large shaded openings, birds crossing between branches, filtered sunlight breaking through the canopy, atmospheric humidity, realistic tropical forest ecology, subtle natural materials, contemporary sustainable architecture, biophilic design, cinematic but physically accurate architectural photography, ultra realistic materials, believable structural engineering, no fantasy floating structures, no theme park aesthetic, no luxury resort aesthetic, no religious symbols, 8K architectural visualization, physically based rendering, natural colors, documentary realism.`,
    aspectRatio: '4:3',
    svgVisualTheme: 'worms-eye'
  },
  {
    id: 'p3',
    number: 3,
    title: 'Human-Eye Arrival Walkway',
    subtitle: 'Cinematic Eye-Level Walkway Approaching the Main Reading House',
    cameraType: "Human-Eye Path",
    elevationDescription: '1.6m above elevated timber skyway walkway',
    lightingTime: 'morning',
    pavilionId: 'reading_house',
    shortDescription: 'Walking along the narrow elevated timber skyway through morning mist as the warm Reading House appears among ancient trunks.',
    composition: {
      foreground: 'Timber plank decking with brass countersunk screws, fallen damp leaves, handrail with climbing vines',
      middleground: 'Elevated Reading House with warm interior lights, visible bookshelves, quiet readers on balcony',
      background: 'Layered subtropical forest canopy fading into gentle morning mist with distant treehouses'
    },
    architecturalDetails: [
      'Natural teak decking weathered to a silvery-gold sheen with grip grooves',
      'Woven bronze mesh balustrades with continuous ergonomic timber handrails',
      'Large shaded operable timber louvers framing interior bookshelf niches',
      'Subtle warm 2700K indirect LED step luminaires shielded against upward glare'
    ],
    structuralNotes: 'Cantilevered skyway sections with expansion slip joints accommodating natural thermal and tree sway movements.',
    soundscape: 'Gentle footsteps on wood, morning mist breeze, distant tea kettle whistle',
    heroPrompt: `Photorealistic eye-level architectural photograph from a narrow elevated timber walkway approaching the Trib-House Reading House, approximately 1.6 meters camera height, warm natural timber decking, mature trees growing around the structure, elegant contemporary treehouse architecture, large shaded windows opening into a peaceful library filled with books, individual reading niches visible, researchers quietly working, one elderly person reading near a window, another visitor walking slowly, ferns and vines surrounding the walkway, birds in the background, soft morning light, deep forest perspective, natural ventilation screens, engineered timber structure, subtle stone details, restrained contemporary Zen aesthetic, realistic Southeast Asian biophilic architecture, highly detailed materials, human scale, architectural photography, no fantasy, no cartoon, no resort, no excessive decoration.`,
    aspectRatio: '16:9',
    svgVisualTheme: 'human-eye'
  },
  {
    id: 'p4',
    number: 4,
    title: 'Reading House Exterior',
    subtitle: 'Flagship Multi-Level Pavilion Suspended in Mid-Canopy',
    cameraType: "Canopy Eye-Level",
    elevationDescription: '10m above ground, viewing the full south-east facade',
    lightingTime: 'midday',
    pavilionId: 'reading_house',
    shortDescription: 'The 3-level Reading House nested harmoniously among living trees, featuring deep shaded terraces and woven rattan sunscreens.',
    composition: {
      foreground: 'Foliage of mid-canopy ferns and orchids clinging naturally to tree branches',
      middleground: 'Tiered timber Reading House with operable timber louvers, outdoor reading decks, and books visible inside',
      background: 'Deep emerald forest depths with soft dappled sunlight patches on timber walls'
    },
    architecturalDetails: [
      'Glulam timber post-and-beam system with dark bronze connector plates',
      'Deep 2.4-meter cantilevered eaves casting protective cooling shade',
      'Natural clay plaster accent panels with crushed oyster shell aggregate',
      'Rain chains guiding roof runoff into suspended garden planter troughs'
    ],
    structuralNotes: 'Triple-point suspension cradle engineered to distribute 180 tonnes across independent micro-piles and tree collars.',
    soundscape: 'Foliage rustling, gentle wind chime tone, pages turning softly',
    heroPrompt: `Photorealistic exterior view of the multi-level Trib-House Reading House suspended in the mid-canopy layer, 10 meters above forest floor, elegant contemporary biophilic architecture, engineered timber and bamboo construction, deep shaded terraces with low wooden chairs, woven natural fiber screens, large operable windows showing interior warm bookshelves, researchers and readers sitting quietly, mature living trees seamlessly integrated through architectural floor openings, rain chains, subtle bronze details, lush tropical forest canopy surrounding the building, dappled midday sunlight, physically accurate architectural rendering, 8K.`,
    aspectRatio: '16:9',
    svgVisualTheme: 'exterior-facade'
  },
  {
    id: 'p5',
    number: 5,
    title: 'Reading House Interior Sanctuary',
    subtitle: 'Circular Timber Library with Central Living Tree & Organic Bookshelves',
    cameraType: "Interior Atmospheric",
    elevationDescription: 'Inside Level 2 of the Main Reading House',
    lightingTime: 'midday',
    pavilionId: 'reading_house',
    shortDescription: 'A serene circular timber hall wrapped around a living tree trunk, where sunlight filters through slatted screens onto quiet readers.',
    composition: {
      foreground: 'Curved low reading desk with handcrafted wooden chair, open book, and ceramic tea bowl',
      middleground: 'Central living tree column wrapped in curved bookshelves, floor cushions, quiet readers in window alcoves',
      background: 'Floor-to-ceiling shaded openings framing green leaves and birds perched on nearby branches'
    },
    architecturalDetails: [
      'Continuous curved solid oak bookshelves built at human height (max 2.1m)',
      'Central living Dipterocarp trunk with breathable non-binding collar',
      'Acoustic ceiling slats made from recycled cedar with natural wool dampening',
      'Handcrafted joinery without visible metallic screws on user-touch surfaces'
    ],
    structuralNotes: 'Floor diaphragm engineered with vibration-dampening sub-layers to eliminate footfall noise across reading zones.',
    soundscape: 'Deep quietude, soft rustling pages, distant birdsong, gentle breath',
    heroPrompt: `Photorealistic interior of the Trib-House Reading House, serene circular timber library suspended within a mature forest canopy, floor-to-ceiling operable shaded openings framing enormous trees and birds, warm natural timber bookshelves following curved walls, low reading tables, individual window seats, handcrafted wooden chairs, soft natural textiles, books arranged intelligently, one central living tree integrated respectfully into the architecture, natural daylight entering through filtered timber screens, quiet diverse readers, subtle task lighting, excellent acoustic design, cross ventilation, ceiling fans almost invisible, natural stone floor details, warm neutral palette, Japanese and Southeast Asian architectural restraint, contemplative atmosphere, sophisticated contemporary library, realistic construction details, no religious imagery, no luxury hotel aesthetic, no clutter, ultra-realistic architectural photography, 8K.`,
    aspectRatio: '16:9',
    svgVisualTheme: 'interior-library'
  },
  {
    id: 'p6',
    number: 6,
    title: 'Research House Exterior & Skyway',
    subtitle: 'High-Performance Ecological Research Station Suspended Over Stream',
    cameraType: "Canopy Eye-Level",
    elevationDescription: '9m above forest stream bed',
    lightingTime: 'morning',
    pavilionId: 'research_house',
    shortDescription: 'Sleek dark timber and low-e glass research pavilion bridging quietly across a natural ravine with elevated science decks.',
    composition: {
      foreground: 'Suspended walkway railing with weather sensor cluster and field note desk',
      middleground: 'Research House facade showing large communal table and digital displays through shaded glass',
      background: 'Rushing stream below with mossy boulders and ferns rising toward mountain slopes'
    },
    architecturalDetails: [
      'Low-iron double-glazed acoustic curtain wall with motorized timber louvers',
      'Micro-climate monitoring sensors integrated seamlessly into structural columns',
      'Rooftop botanical herbarium and meteorological sensor array',
      'Dark stained sustainable timber exterior with breathable bio-based sealants'
    ],
    structuralNotes: 'Inverted King-Post timber truss spanning 18 meters across the natural forest drainage swale without riverbed disturbance.',
    soundscape: 'Babbling stream water, high canopy wind, quiet electronic data chime',
    heroPrompt: `Photorealistic exterior of the Trib-House Research House suspended 9 meters above a forest stream, contemporary sustainable research station architecture, timber and glass construction, vertical wooden louvers, cantilevered outdoor observation decks, scientists quietly working with environmental data inside, elevated bridge connecting to main campus, morning sunlight reflecting on stream water below, lush tropical flora, ultra realistic materials, architectural documentary photography.`,
    aspectRatio: '16:9',
    svgVisualTheme: 'research-exterior'
  },
  {
    id: 'p7',
    number: 7,
    title: 'Research Commons & Informatics Interior',
    subtitle: 'Communal Research Hall with Knowledge Graph & AI Librarian Table',
    cameraType: "Interior Atmospheric",
    elevationDescription: 'Inside Level 1 of Research House',
    lightingTime: 'midday',
    pavilionId: 'research_house',
    shortDescription: 'Quiet scholars at a 12m communal table with matte data displays, scientific folios, and the circular AI Librarian station.',
    composition: {
      foreground: 'Long communal salvaged-timber table with researchers typing and reviewing manuscripts',
      middleground: 'Circular acoustic digital table with Trib AI Steward interface and glowing knowledge lines',
      background: 'Floor-to-ceiling shaded glass walls opening into dense green forest canopy'
    },
    architecturalDetails: [
      '12-meter single-slab fallen teak communal research table with recessed power outlets',
      'Circular acoustic projection table for non-intrusive voice and spatial interaction',
      'Acoustic felt ceiling baffles with hidden circadian spectrum lighting',
      'Individual research carrels with directional task lighting and privacy wings'
    ],
    structuralNotes: 'Heavy acoustic floor construction providing STC 55 isolation between collaborative commons and deep research pods.',
    soundscape: 'Soft keyboard taps, quiet whispered dialogue, forest leaves rustling outside',
    heroPrompt: `Ultra-realistic contemporary research library inside a forest treehouse, sophisticated timber-and-glass research pavilion, long communal research table, ergonomic research desks, bookshelves, scientific literature, large interactive knowledge graph display, researchers quietly analyzing data, AI librarian interface integrated subtly into a circular digital table, forest canopy visible through shaded glass walls, natural ventilation, acoustic timber ceiling, stone floor, warm indirect lighting, high-end but humble materials, sustainable architecture, intellectual atmosphere, world-class research retreat, no sci-fi spaceship aesthetic, no excessive holograms, no corporate office aesthetic, no religious imagery, physically believable architecture, 8K architectural visualization.`,
    aspectRatio: '16:9',
    svgVisualTheme: 'research-interior'
  },
  {
    id: 'p8',
    number: 8,
    title: 'Knowledge Graph Visualization Room',
    subtitle: 'Curved Wall Display of Human Knowledge Lineages & Cross-Discipline Nodes',
    cameraType: "Interior Atmospheric",
    elevationDescription: 'Inside Knowledge Graph Room',
    lightingTime: 'night',
    pavilionId: 'knowledge_graph_room',
    shortDescription: 'Scholars interacting with an enormous curved topological wall showing interconnected books, authors, and 2,500 years of ideas.',
    composition: {
      foreground: 'Polished river stone floor with soft recessed floor up-lights',
      middleground: 'Two researchers discussing a glowing node cluster on the curved interactive wall',
      background: 'Night canopy visible through side clerestory with stars and subtle warm pathway lanterns'
    },
    architecturalDetails: [
      '14-meter curved micro-LED seamless visual surface with zero glare',
      'Tactile rotary control console crafted from turned ebony and brushed brass',
      'Dark acoustic wall paneling with vertical timber rhythm',
      'Integrated spatial sound beams that project audio only to the active viewer'
    ],
    structuralNotes: 'Independent structural core housing climate-controlled server racks and fiber-optic backbone for Dr. T knowledge base.',
    soundscape: 'Subtle harmonic synth pulse, quiet dialogue, evening crickets through vents',
    heroPrompt: `Photorealistic interior of the Trib-House Knowledge Graph Room at twilight, dark timber research pavilion with a 14-meter curved interactive wall displaying a glowing topological network of books, ideas, authors and ecological citations, warm restrained lighting, two researchers standing quietly analyzing connections, polished dark stone floor, starry night forest visible through screened windows, elegant minimal technology, biophilic architecture, 8K.`,
    aspectRatio: '16:9',
    svgVisualTheme: 'graph-room'
  },
  {
    id: 'p9',
    number: 9,
    title: 'The Silent Room & Future Archive',
    subtitle: 'Intimate 20m² Vault with Sealed Future Manuscripts for 2126 CE',
    cameraType: "Intimate Archive",
    elevationDescription: 'Inside the Silent Room, camera at 1.2m',
    lightingTime: 'morning',
    pavilionId: 'silent_room',
    shortDescription: 'The sacred silence of sealed wooden and paper archives spanning 2026 to 2126, illuminated only by a single vertical slit window.',
    composition: {
      foreground: 'Carved dark granite table with brass-bound manuscript boxes and handwritten wax seals',
      middleground: 'Engraved wall years (2026, 2036, 2051, 2076, 2126) and a single visitor reading in silence',
      background: 'Single narrow vertical window framing the ceremonial 100-Year Native Oak outside'
    },
    architecturalDetails: [
      'Hand-hewn dark smoked cypress walls with beeswax finish',
      'Carved solid granite table housing archival vaults sealed until target centuries',
      'Minimalist brass wall inlays marking milestone decadal years',
      'Absolute zero electronic displays, wiring, or artificial humming transformers'
    ],
    structuralNotes: 'Thermally isolated envelope maintaining passive stable humidity and temperature through thick rammed-earth internal lining.',
    soundscape: 'Absolute silence, subtle resonance of wind outside, deep calm',
    heroPrompt: `Extremely intimate photorealistic archival room inside a forest library, approximately 20 square meters, four-person maximum, handcrafted dark timber walls, subtle warm natural light, a long wooden table containing carefully sealed future manuscripts and archival boxes, small engraved years 2026, 2036, 2051, 2076 and 2126, one narrow window revealing a living forest outside, no screens, no computers, no decorative objects, extraordinary quietness, material textures showing craftsmanship and age, atmosphere of time, memory and continuity, contemporary sacred-like quietness without religious symbolism, architectural photography, cinematic natural light, ultra realistic.`,
    aspectRatio: '4:3',
    svgVisualTheme: 'silent-vault'
  },
  {
    id: 'p10',
    number: 10,
    title: 'The Writing House Desks',
    subtitle: 'Solitary Alcoves Overlooking Mountain Horizons & Forest Mist',
    cameraType: "Interior Atmospheric",
    elevationDescription: 'Inside Level 2 of Writing House',
    lightingTime: 'dawn',
    pavilionId: 'writing_house',
    shortDescription: 'A lone author writing with a fountain pen at a cedar desk as dawn mist rolls through the open timber shutters.',
    composition: {
      foreground: 'Handcrafted wooden desk with blank cotton paper, fountain pen, and steam rising from tea cup',
      middleground: 'Writer looking thoughtfully out the open corner window framed by delicate bamboo screens',
      background: 'Layers of misty mountain ridges and sunrise glow filtering through wet forest leaves'
    },
    architecturalDetails: [
      'Operable bi-folding timber louvers opening the entire corner to the open valley air',
      'Built-in cedar bookshelves filled with poetry, dictionaries, and bound blank volumes',
      'Tatami mat floor with natural straw fragrance and sound absorption',
      'Recessed copper rain chains visible outside the window frame'
    ],
    structuralNotes: 'Lightweight timber frame balanced on two cantilevered steel brackets anchored to solid rock ledge.',
    soundscape: 'Pen scratching softly on paper, morning birdsong, steam whisper from tea',
    heroPrompt: `Photorealistic interior of the Trib-House Writing House at dawn, solitary writer seated at a handcrafted aromatic cedar desk, fountain pen and cotton paper, corner timber shutters open to a breathtaking view of misty forest canopy and distant mountains at sunrise, natural cross ventilation, tatami mats, simple earthen tea cup, peaceful creative atmosphere, minimal aesthetic, architectural photography, 8K.`,
    aspectRatio: '16:9',
    svgVisualTheme: 'writing-house'
  },
  {
    id: 'p11',
    number: 11,
    title: 'Children’s Treehouse of Wonder',
    subtitle: 'Tactile Ecological Exploration, Reading Caves & Nature Telescopes',
    cameraType: "Interior Atmospheric",
    elevationDescription: 'Inside Children’s Treehouse lower deck',
    lightingTime: 'midday',
    pavilionId: 'children_treehouse',
    shortDescription: 'Children and parents reading together in curved wooden alcoves, looking through telescopes, and examining leaf specimens.',
    composition: {
      foreground: 'Curved low wooden bookshelves with illustrated nature books and magnifying glass station',
      middleground: 'Child looking through a brass telescope toward birds while a parent reads in a cushioned alcove',
      background: 'Open discovery deck with climbing hemp nets, living terrariums, and sunlit canopy'
    },
    architecturalDetails: [
      'Ergonomic child-height timber alcoves with organic, non-linear curvilinear geometry',
      'Solid brass telescope mounted at adjustable height for astronomy and birdwatching',
      'Smooth sanded natural teak surfaces with non-toxic botanical oil finishes',
      'Safety netting woven from high-tensile natural hemp with zero sharp edges'
    ],
    structuralNotes: 'Low center of gravity with redundant load-bearing ring beams rated for 3.5x maximum dynamic live loads.',
    soundscape: 'Quiet child laughter, pages turning, birds chirping outside discovery deck',
    heroPrompt: `Photorealistic children's reading treehouse integrated safely into a mature tropical forest canopy, sophisticated natural timber architecture, small curved reading alcoves, hidden windows, low bookshelves, nature specimens, telescope, magnifying glasses, interactive science displays, children reading with parents and educators, safe climbing architecture, outdoor discovery deck, birds and butterflies outside, lush vegetation, warm sunlight, beautiful but not childish, contemporary ecological education architecture, tactile natural materials, no plastic playground aesthetic, no cartoon colors, no commercial branding, realistic child-safe construction, 8K.`,
    aspectRatio: '16:9',
    svgVisualTheme: 'children-treehouse'
  },
  {
    id: 'p12',
    number: 12,
    title: 'Elder Story House & Oral Heritage Hearth',
    subtitle: 'Circular Storytelling Pavilion for Preserving Generational Wisdom',
    cameraType: "Interior Atmospheric",
    elevationDescription: 'Inside Elder Story House circle',
    lightingTime: 'sunset',
    pavilionId: 'elder_story_house',
    shortDescription: 'An elder sharing memories by a warm tea hearth while younger visitors listen and discreet microphones capture oral history.',
    composition: {
      foreground: 'Cast-iron tea kettle over glowing charcoal brazier with warm earthenware cups',
      middleground: 'Circle of comfortable timber armchairs with elder speaking expressively to listening youth',
      background: 'Open screened veranda overlooking sunset-tinted forest and golden light through trees'
    },
    architecturalDetails: [
      'Concentric circular tiered timber seating with acoustic wool backing',
      'Suspended studio microphone arrays concealed inside timber ceiling beams',
      'Heirloom seed and photograph archival display cabinet built into perimeter wall',
      'Central fire-safe clay and soapstone hearth for tea preparation'
    ],
    structuralNotes: 'Circular radial glulam rafters meeting at a central tension compression ring above the hearth.',
    soundscape: 'Elder voice speaking with warmth, crackling tea charcoal, evening cicadas',
    heroPrompt: `Photorealistic intimate circular timber storytelling pavilion suspended gently among mature trees, comfortable chairs arranged in a circle, elderly storyteller speaking while younger visitors listen, discreet professional audio recording equipment for oral history preservation, tea table, books and archival photographs, open forest views, natural ventilation, woven screens, warm afternoon light, atmosphere of intergenerational connection, dignity, memory and cultural preservation, sophisticated Southeast Asian architecture, no staged poses, realistic human emotion, architectural documentary photography.`,
    aspectRatio: '16:9',
    svgVisualTheme: 'story-hearth'
  },
  {
    id: 'p13',
    number: 13,
    title: 'Canopy Breathing & Pause Platform',
    subtitle: 'Suspended Minimalist Timber Platform in High Tree Crowns',
    cameraType: "Canopy Eye-Level",
    elevationDescription: '12m elevation among tree crowns',
    lightingTime: 'dawn',
    pavilionId: 'breathing_platform',
    shortDescription: 'A single meditator sitting on a solitary timber bench suspended high in the canopy as the sun rises over morning mist.',
    composition: {
      foreground: 'Circular timber slatted platform with simple single bench and stainless steel safety cables',
      middleground: 'One person sitting quietly with closed eyes practicing 4-7-8 breathing amidst living branches',
      background: 'Endless ocean of green tree crowns, golden dawn sky, and morning clouds'
    },
    architecturalDetails: [
      '28m² circular platform constructed from weathered teak slats with 8mm drainage gaps',
      'Continuous stainless steel safety perimeter with slimline timber grab rail',
      'Subtle brass azimuth marker embedded in floor showing sunrise angles',
      'Zero visual clutter—pure focus on breath, wind, and sky'
    ],
    structuralNotes: 'Dynamic tuned mass dampeners tuned to human breath frequencies to eliminate unwanted sway resonance.',
    soundscape: 'Deep rhythmic human breath, canopy wind, dawn chorus of tropical birds',
    heroPrompt: `Photorealistic tiny circular timber meditation and reading platform suspended among forest trees, one simple bench, no furniture clutter, canopy surrounding the platform, distant sky visible through leaves, one person quietly sitting and breathing, another walking slowly on the connecting bridge, birdsong implied visually through birds in the branches, morning mist, gentle sunlight, natural timber, minimal architecture, peaceful contemplative environment, deeply realistic ecological setting, no religious symbols, no statues, no temple aesthetic.`,
    aspectRatio: '16:9',
    svgVisualTheme: 'breathing-platform'
  },
  {
    id: 'p14',
    number: 14,
    title: 'The Rain Reading Room',
    subtitle: 'Monsoon-Designed Reading Sanctuary with Rhythmic Water Chutes',
    cameraType: "Interior Atmospheric",
    elevationDescription: 'Inside Rain Reading Room during heavy rainfall',
    lightingTime: 'rain',
    pavilionId: 'rain_reading_room',
    shortDescription: 'Warm protected reading room while heavy tropical rain cascades down exterior glass and tuned copper water channels.',
    composition: {
      foreground: 'Reader curled up with an open book in a deep timber armchair beside an earthen tea stove',
      middleground: 'Large floor-to-ceiling glass wall showing sheets of rain falling outside onto lush tropical plants',
      background: 'Rushing stream below and mist-covered forest shrouded in dramatic monsoon rain'
    },
    architecturalDetails: [
      'Acoustically tuned copper exterior water flutes creating harmonic rainfall notes',
      'Heated soapstone hearth providing gentle dry radiant warmth against humidity',
      'Double-laminated anti-fog insulated glass with hydrophobic nano-coating',
      'Acoustic wool upholstery and wall hangings absorbing excess indoor reverberation'
    ],
    structuralNotes: 'Deep cantilevered roof overhangs (2.8m) protecting wall envelope from driving horizontal monsoon rains.',
    soundscape: 'Rhythmic rain on copper channels, crackling hearth, steaming hot tea',
    heroPrompt: `Photorealistic interior of the Trib-House Rain Reading Room during a tropical rainstorm, large glass windows with sheets of rain falling outside into a lush rainforest, warm timber interior, comfortable reading armchairs with wool blankets, warm reading lamps, readers quietly engrossed in books, copper rain chains visible outside, tea station, serene contemplative atmosphere, natural materials, architectural photography, 8K.`,
    aspectRatio: '16:9',
    svgVisualTheme: 'rain-reading'
  },
  {
    id: 'p15',
    number: 15,
    title: 'Bird Listening Sanctuary',
    subtitle: 'Open Screened High-Canopy Blind with Field Guides & Binoculars',
    cameraType: "Interior Atmospheric",
    elevationDescription: '14.5m elevation inside the listening blind',
    lightingTime: 'morning',
    pavilionId: 'bird_listening_room',
    shortDescription: 'An elevated observation room with fine bronze mesh walls where two naturalists silently observe canopy bird life.',
    composition: {
      foreground: 'Turned cedar desk with antique brass binoculars, open illustrated bird field guide, and field notebook',
      middleground: 'Quiet visitor holding binoculars toward an open screened portal framing a colorful sunbird on a branch',
      background: 'Lush upper canopy foliage with morning sunbeams piercing through wet leaves'
    },
    architecturalDetails: [
      'Non-reflective dark oxidized bronze mesh walls providing 100% acoustic permeability',
      'Carved wooden lintel with the inscription: "Listen before you speak."',
      'Built-in leather binocular holsters and specimen reference shelves',
      'Camouflage-stained exterior cedar battens blending seamlessly with tree bark'
    ],
    structuralNotes: 'High-elevation tension-rod suspension structure minimizing physical mass and wind resistance.',
    soundscape: 'Vibrant canopy birdsong, insect hums, gentle leaf rustles',
    heroPrompt: `Photorealistic interior of the Trib-House Bird Listening Room, 14 meters high in tropical tree canopy, open-screened timber architecture, two quiet birdwatchers looking through binoculars, field guides and notebooks on wooden desks, colorful tropical birds visible on branches just outside, morning sunlight filtering through leaves, inscription on wall 'Listen before you speak', natural cedar wood, ultra realistic documentary photography.`,
    aspectRatio: '16:9',
    svgVisualTheme: 'bird-listening'
  },
  {
    id: 'p16',
    number: 16,
    title: 'The Central Community House',
    subtitle: 'Bustling Fellowship Agora, Shared Kitchen & 100-Year Chronicle Wall',
    cameraType: "Interior Atmospheric",
    elevationDescription: 'Inside Community House Great Hall',
    lightingTime: 'sunset',
    pavilionId: 'community_house',
    shortDescription: 'Community members gathering for shared tea, workshops, and book circles around heavy post-and-beam timber tables.',
    composition: {
      foreground: 'Long communal dining table with handmade ceramic bowls, fresh tea, and open notebooks',
      middleground: 'Groups of diverse scholars, elders, and families engaged in quiet discussions and workshops',
      background: 'Rammed-earth chronicle wall with 100-year records and large sliding doors open to the permaculture garden'
    },
    architecturalDetails: [
      'Heavy post-and-beam timber joinery using mortise-and-tenon craftsmanship',
      'Rammed-earth thermal mass walls incorporating local clays and river sand',
      'Terracotta tile floor with under-floor natural geothermal warming tubes',
      'Large sliding timber partitions allowing dynamic reconfiguration from dining to lecture hall'
    ],
    structuralNotes: 'Main transverse timber portal frames engineered to resist Category 3 typhoon wind loads.',
    soundscape: 'Warm community conversation, clinking ceramic teacups, gentle laughter',
    heroPrompt: `Photorealistic interior of the Trib-House Community House at late afternoon, large gathering hall with heavy timber post-and-beam architecture, rammed earth walls, long communal tables where diverse people of different ages share tea and discuss books, community kitchen visible in background, warm sunset light pouring through wide open sliding doors into a lush garden, atmosphere of genuine fellowship and learning, architectural photography, 8K.`,
    aspectRatio: '16:9',
    svgVisualTheme: 'community-house'
  },
  {
    id: 'p17',
    number: 17,
    title: 'Night Campus Constellation',
    subtitle: 'Dark-Sky Forest with Shielded Warm Lanterns, Fireflies & Starlight',
    cameraType: "Bird's-Eye Drone",
    elevationDescription: '60m above forest canopy at midnight',
    lightingTime: 'night',
    pavilionId: 'reading_house',
    shortDescription: 'The forest campus at night glowing gently like a constellation of warm stars, preserving natural darkness and nocturnal ecology.',
    composition: {
      foreground: 'Dark canopy leaves with twinkling fireflies and soft glow from walkway guide lanterns',
      middleground: 'Warm amber light glowing from the windows of suspended reading pavilions and research stations',
      background: 'Vast dark forest canopy stretching into the distance beneath a brilliant starlit Milky Way sky'
    },
    architecturalDetails: [
      'Full-cutoff downward shielded amber lighting (2200K) eliminating light pollution',
      'Low-wattage step luminaires integrated into handrails guiding night walkers safely',
      'Zero exterior floodlighting or tree-uplighting to protect nocturnal wildlife',
      'Interior blackout blinds for research screens to maintain IDA Dark Sky certification'
    ],
    structuralNotes: 'Autonomous solar-battery microgrid powering all essential emergency and reading circuits overnight.',
    soundscape: 'Nocturnal tree frogs, rhythmic cricket chorus, gentle night breeze',
    heroPrompt: `Photorealistic night aerial view of the Trib-House Living Library campus in a dark tropical forest, treehouses glowing gently like a constellation of warm amber stars inside the forest canopy, shielded low-intensity lighting, illuminated walkways connecting pavilions, fireflies in the foliage, midnight sky full of stars above, dark sky compliant architecture, peaceful and mysterious, cinematic night architectural photography, 8K.`,
    aspectRatio: '16:9',
    svgVisualTheme: 'night-campus'
  },
  {
    id: 'p18',
    number: 18,
    title: 'Dawn Mist Campus Arrival',
    subtitle: 'Golden Sunrise Beams Piercing Morning Forest Mist over Walkways',
    cameraType: "Human-Eye Path",
    elevationDescription: '1.6m above elevated skyway at 05:45 AM',
    lightingTime: 'dawn',
    pavilionId: 'tea_house',
    shortDescription: 'Golden morning light breaking through thick subtropical canopy mist, revealing shimmering wet timber skyways and waking birds.',
    composition: {
      foreground: 'Silvery weathered timber walkway planks glistening with morning dew and fallen flower petals',
      middleground: 'Early visitor walking slowly with a book toward the Tea House amidst dramatic golden light shafts',
      background: 'Layers of misty trees and silhouetted treehouse roofs receding into golden morning sky'
    },
    architecturalDetails: [
      'Grip-textured timber planks with natural bio-wax water repellency',
      'Curved skyway geometry hugging natural tree contours without forcing straight lines',
      'Subtle bronze distance markers embedded every 25 meters along the walkway',
      'Integrated mist collection mesh draining pure condensation into tea reservoirs'
    ],
    structuralNotes: 'Thermal expansion joints accommodate the 15°C diurnal temperature swing without squeaking.',
    soundscape: 'Awakening birdsong crescendo, dripping morning dew, soft footsteps',
    heroPrompt: `Photorealistic eye-level photograph of the Trib-House campus at sunrise, elevated timber skyway walkway curving through thick morning mist between ancient tropical trees, golden rays of early sunlight piercing through the canopy, dew on timber handrails, a quiet visitor walking with a book toward a distant treehouse, breathtaking atmospheric beauty, peaceful contemplative mood, cinematic architectural photography, 8K.`,
    aspectRatio: '16:9',
    svgVisualTheme: 'dawn-mist'
  },
  {
    id: 'p19',
    number: 19,
    title: 'Monsoon Canopy Resilience',
    subtitle: 'Dramatic Tropical Downpour & Visible Ecological Hydrology',
    cameraType: "Canopy Eye-Level",
    elevationDescription: '8m elevation during peak monsoon downpour',
    lightingTime: 'monsoon',
    pavilionId: 'rain_reading_room',
    shortDescription: 'The campus in full harmony with monsoon deluge: cascading water channels, lush hyper-green foliage, and cozy readers inside.',
    composition: {
      foreground: 'Copper roof scupper discharging a clear arc of rainwater into a terraced rock channel below',
      middleground: 'Rain Reading House with warm glowing interior lights framing readers sipping tea while rain pours',
      background: 'Turbulent misty rainforest with wind-tossed branches and dramatic storm clouds above'
    },
    architecturalDetails: [
      'Heavy-gauge copper rainwater spouts and kinetic water wheels generating micro-hydro power',
      'Deep 3-meter cantilevered storm eaves protecting all external walls from driving rain',
      'Permeable basalt stone drainage channels preventing soil erosion around tree roots',
      'Hurricane-rated concealed stainless steel tie-down cables anchoring all pavilions'
    ],
    structuralNotes: 'Hydrodynamic roof profiles engineered for zero ponding and rapid shedding of up to 150mm/hour rainfall.',
    soundscape: 'Resonant thunder roll, roaring tropical downpour, bubbling water cascades',
    heroPrompt: `Photorealistic exterior view of the Trib-House campus during a heavy tropical monsoon storm, dramatic sheets of rain falling through the lush forest canopy, cascading rainwater channels and copper gutters, warm inviting interior lights glowing inside the protected timber treehouses, readers visible inside sitting comfortably with tea, wind rustling the leaves, atmospheric storm mood, realistic sustainable hydrology architecture, 8K.`,
    aspectRatio: '16:9',
    svgVisualTheme: 'monsoon-rain'
  },
  {
    id: 'p20',
    number: 20,
    title: '100-Year Mature Trib-House Vision (2126 CE)',
    subtitle: 'Century Horizon: Weathered Patina & Fully Integrated Living Ecology',
    cameraType: "Canopy Eye-Level",
    elevationDescription: '100 years into the future (2126 CE) at mid-canopy level',
    lightingTime: 'century100',
    pavilionId: 'silent_room',
    shortDescription: 'In 2126 CE: Century-old Dipterocarp trees have grown completely around the patinated silver-grey timber pavilions, becoming one living organism.',
    composition: {
      foreground: 'Mature moss-covered timber balustrade with century-old epiphytic orchids blooming along the joints',
      middleground: 'The weathered Reading House with deeply patinated timber, where future generations read preserved 2026 manuscripts',
      background: 'Vast flourishing primeval forest that has grown denser and healthier because of 100 years of ecological stewardship'
    },
    architecturalDetails: [
      'Silver-grey naturally weathered ironwood with rich hundred-year ecological patina',
      'Living tree trunks that have enveloped non-invasive structural collars into symbiotic natural buttresses',
      'Unbroken unbroken archive cases opened in 2126 revealing handwritten letters from 2026',
      'Living roof ecosystems that have evolved into self-sustaining native botanical micro-habitats'
    ],
    structuralNotes: 'Designed from day one for 100+ year service life using non-rotting sustainable dense hardwoods and replaceable modular joinery.',
    soundscape: 'Timeless primeval forest sounds, distant bell chime, laughter of future children',
    heroPrompt: `Photorealistic architectural visualization of Trib-House 100 years in the future in 2126 CE, aged and weathered silver-grey timber pavilions completely embraced by massive century-old living trees and lush epiphytes, moss and orchids growing naturally on timber joints, future readers and researchers of all ages quietly studying, the architecture and forest have merged into a single living organism, timeless, peaceful, profoundly sustainable, hopeful intergenerational legacy, documentary realism, 8K.`,
    aspectRatio: '16:9',
    svgVisualTheme: 'century-vision'
  }
];

export const ARCHITECTURAL_PHILOSOPHY_PRINCIPLES = [
  {
    title: 'Interbeing (Tương Tức)',
    subtitle: 'Human, Tree, Water, Air, Knowledge, Future',
    description: 'Architecture does not conquer the forest. It visualizes and participates in the deep interdependence between humans, soil, canopy, rain, and intergenerational wisdom.'
  },
  {
    title: 'Breathing Architecture',
    subtitle: '100% Passive Climate & Natural Cross-Ventilation',
    description: 'Deep roof overhangs, operable timber louvers, shaded breezeways, and thermal stack cupolas allow visitors to continuously sense wind, rain, birds, and changing seasons without noisy mechanical HVAC.'
  },
  {
    title: 'Mindful Architecture & Spatial Pauses',
    subtitle: 'Zero Clutter, Commercial Hype, or Artificial Luxury',
    description: 'Inspired by Thích Nhất Hạnh and Plum Village principles of mindful presence: spatial pauses, breathing platforms, and natural materials legitimize the act of stopping, reflecting, and being present.'
  },
  {
    title: 'Stand-off Root Protection & Structural Credibility',
    subtitle: 'Zero Tree Harm, Believable Engineering',
    description: 'No magical floating structures. Engineered glulam trusses, tripod micro-piles, and non-invasive elastomeric friction collars allow living trees to grow and sway naturally without root or bark damage.'
  },
  {
    title: 'Designed for 100-Year Patina',
    subtitle: 'Aging into Deeper Beauty (2026 → 2126)',
    description: 'Materials are selected to weather gracefully with time. In 10, 30, and 100 years, the buildings become more beautiful and rooted, rather than obsolete.'
  },
  {
    title: 'Universal Accessibility (By All, For All)',
    subtitle: 'Incline Skyways, Sensory Nooks, Level Thresholds',
    description: 'Treehouse architecture is made universally accessible through gentle switchback timber ramps (1:16 gradient), tactile guides, zero-step thresholds, and inclusive reading niches.'
  }
];

export const MATERIAL_PALETTE = [
  { name: 'Locally Sourced Hardwood & Glulam', code: '#5c4033', usage: 'Primary load-bearing columns, arches, and skyway stringers', durability: '100+ Years with natural bio-oils' },
  { name: 'Structural Bamboo & Rattan', code: '#c2a649', usage: 'Flexible sunscreens, interior ceiling lattices, and breathing louvers', durability: 'Replenishable local harvest' },
  { name: 'Chiseled Basalt & River Stone', code: '#474a51', usage: 'Foundation footings, tea hearths, water spillways, and rain pools', durability: 'Permanent geological permanence' },
  { name: 'Rammed Earth & Lime-Clay Plaster', code: '#967140', usage: 'Thermal mass interior walls, archive vaults, and acoustic partitions', durability: 'Breathable, zero-VOC, humidity regulating' },
  { name: 'Oxidized Dark Bronze Fasteners', code: '#3e372e', usage: 'Custom structural joinery brackets, rain chains, and door hardware', durability: 'Develops protective noble patina' },
  { name: 'Low-E Insulated Acoustical Glass', code: '#6c827d', usage: 'Selective panoramic viewports in Rain Room and Research House', durability: 'Prevents condensation & tropical heat gain' }
];
