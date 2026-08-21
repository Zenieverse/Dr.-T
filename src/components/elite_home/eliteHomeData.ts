export interface MasterplanDistrict {
  id: string;
  name: string;
  category: 'central' | 'residential' | 'longevity' | 'education' | 'nature' | 'food' | 'sports' | 'spiritual' | 'transit' | 'culture';
  tagline: string;
  description: string;
  architecturalStyle: string;
  coordinates: { x: number; y: number; z: number };
  cameraTarget: { x: number; y: number; z: number };
  cameraPosition: { x: number; y: number; z: number };
  color: string;
  icon: string;
  features: string[];
  residentArchetype: string;
  capacity: string;
  longevityImpact: string;
  materials: string[];
  keyHighlights: { title: string; detail: string }[];
}

export interface LuxuryChamber {
  id: string;
  name: string;
  districtId: string;
  districtName: string;
  type: string;
  sqFt: number;
  view: string;
  pricePerYear: string;
  architecturalVision: string;
  biophilicFeatures: string[];
  healthTechSuite: string[];
  interiorMaterials: string[];
  energyProfile: string;
  imageKey: string;
  floorPlanRooms: { name: string; size: string; description: string }[];
}

export interface MasterclassProgram {
  id: string;
  title: string;
  mentorName: string;
  mentorTitle: string;
  originCountry: string;
  flag: string;
  category: string;
  schedule: string;
  location: string;
  description: string;
}

export const ELITE_HOME_STATS = {
  totalAcres: 500,
  residentialUnits: 1200,
  renewableEnergyPercent: 100,
  carbonFootprintStatus: 'Carbon Negative (-14,200 tons/yr)',
  preservedWildernessPercent: 78,
  nationalitiesRepresented: 94,
  clinicalLongevityTrials: 48,
  organicFarmVarieties: 140,
  electricPodsFleet: 180,
  averageResidentAgeScore: '-11.4 yrs BioAge vs ChronoAge',
};

export const MASTERPLAN_DISTRICTS: MasterplanDistrict[] = [
  {
    id: 'heart-of-life',
    name: 'The Heart of Life Plaza',
    category: 'central',
    tagline: 'The Social, Cultural & Spiritual Pulse of eLite Home',
    description: 'A breathtaking 40-acre circular central district centered around a 60-meter bioluminescent living Tree of Life canopy. Stepped reflection pools, interactive mist fountains, amphitheater, AI concierge pavilion, and open-air artisan cafes bring residents of all 90+ nationalities together every day.',
    architecturalStyle: 'Biophilic Curvilinear Organic Plaza with living tree canopies and kinetic water architecture',
    coordinates: { x: 0, y: 0, z: 0 },
    cameraTarget: { x: 0, y: 2, z: 0 },
    cameraPosition: { x: 0, y: 35, z: 50 },
    color: '#ec4899',
    icon: 'TreePine',
    features: [
      '60m Living Tree of Life with bioluminescent dusk illumination',
      'Cascading stepped reflection pools & musical interactive fountains',
      'Sunken Greek-style acoustic amphitheater for twilight symphonies',
      'Global Cultural Exchange Stage hosting nightly multinational performances',
      'Open-air organic patisseries, herbal tea houses & world bistros',
      'AI Concierge Glass Dome for instant lifestyle, health & transport routing',
      'Integrated pedestrian shaded colonnades wrapped in jasmine and orchids'
    ],
    residentArchetype: 'All residents, visiting scholars, grandchildren, and global thinkers',
    capacity: 'Up to 3,500 people simultaneously',
    longevityImpact: '+35% Social Cohesion Index, dramatic reduction in loneliness biomarkers',
    materials: ['Recycled Roman travertine', 'Cross-laminated Scandinavian timber', 'Kinetic low-E smart glass', 'Living moss walls'],
    keyHighlights: [
      { title: 'The Living Tree Canopy', detail: 'A century-old ficus and wisteria biosculpture engineered with microscopic bio-phosphors providing warm golden dusk ambiance.' },
      { title: 'Harmonic Water Fountains', detail: 'Calibrated at 432 Hz frequency harmonics, the fountains promote parasympathetic nervous system relaxation.' },
      { title: 'Daily Golden Hour Tea Ritual', detail: 'At 17:30 every evening, residents from 94 countries gather for organic matcha, tisanes, and multilingual conversations.' }
    ]
  },
  {
    id: 'serenity-forest',
    name: 'The Serenity Forest',
    category: 'residential',
    tagline: 'Treehouse Villas & Stream Cottages for Introverts & Nature Lovers',
    description: '120 acres of ancient coastal redwood and cedar canopy. Cantilevered treehouse villas and moss-roofed timber cottages float above babbling brooks, connected solely by elevated cedar plank boardwalks that protect the fragile forest floor.',
    architecturalStyle: 'Japanese Sukiya-zukuri blended with Nordic timber cabin architecture',
    coordinates: { x: -45, y: 5, z: -35 },
    cameraTarget: { x: -45, y: 6, z: -35 },
    cameraPosition: { x: -65, y: 30, z: -10 },
    color: '#059669',
    icon: 'Trees',
    features: [
      'Elevated treehouse residences wrapped around living redwood trunks',
      'Private cedar wood onsen soaking tubs fed by mountain spring water',
      'Hidden acoustic meditation pods and hammock alcoves along riverbanks',
      'Zero-acoustic-leakage soundproofing with 5-pane acoustic glass',
      'Forest bathing (Shinrin-yoku) guided walking trails with phytoncide sensors',
      'Personal botanical libraries with built-in woodburning clean-pellet hearths'
    ],
    residentArchetype: 'Writers, naturalists, contemplative philosophers, introverts, and researchers',
    capacity: '240 Private Forest Villas',
    longevityImpact: '-42% Morning Cortisol Levels, +28% Natural Killer (NK) immune cell count',
    materials: ['Sustainably harvested cedar', 'Rammed earth foundation piers', 'Zinc green-patina roofing', 'Triple-insulated hempcrete'],
    keyHighlights: [
      { title: 'Canopy Walkways', detail: 'Suspended 12 meters in the air, allowing barrier-free electric pod and wheelchair transit without touching forest root systems.' },
      { title: 'Natural Cedar Onsens', detail: 'Every villa includes a private thermal soaking deck rich in dissolved mineral silica and magnesium.' }
    ]
  },
  {
    id: 'ocean-horizon',
    name: 'The Ocean Horizon',
    category: 'residential',
    tagline: 'Panoramic Oceanfront Villas & Sunset Cantilevers',
    description: 'Perched along terraced sea cliffs overlooking the Pacific horizon. Tiered glass and white limestone villas feature private heated saltwater infinity pools, expansive sunset stargazing decks, and gentle sea breeze ventilation corridors.',
    architecturalStyle: 'Mediterranean Warmth blended with California Modernist Biophilia',
    coordinates: { x: 55, y: 8, z: -40 },
    cameraTarget: { x: 55, y: 7, z: -40 },
    cameraPosition: { x: 75, y: 32, z: -15 },
    color: '#0284c7',
    icon: 'Waves',
    features: [
      '180-degree unobstructed coastal sunset views with smart polarized glazing',
      'Cantilevered private saltwater infinity pools with underwater sound systems',
      'Terraced succulent and herb gardens with automated micro-drip irrigation',
      'Subterranean wine and olive oil tasting cellars for resident gatherings',
      'Oceanfront yoga pavilions cantilevered over crashing wave alcoves',
      'Private elevator shafts connecting directly to secluded marine beach coves'
    ],
    residentArchetype: 'Epicureans, sea enthusiasts, former diplomats, and lovers of grand panoramic vistas',
    capacity: '280 Oceanfront Residences',
    longevityImpact: '+32% Deep REM Sleep Duration via ocean white noise and natural negative air ions',
    materials: ['Polished oceanic limestone', 'Marine-grade titanium fittings', 'Curved ultra-clear solar glass', 'Reclaimed teak wood'],
    keyHighlights: [
      { title: 'Negative Ion Marine Air', detail: 'Natural coastal updrafts generate 10,000+ negative ions per cm³, optimizing pulmonary oxygen uptake.' },
      { title: 'Stargazing Solariums', detail: 'Retractable glass ceilings let residents sleep under clear unpolluted night skies.' }
    ]
  },
  {
    id: 'village-of-friends',
    name: 'The Village of Friends',
    category: 'residential',
    tagline: 'Courtyard Homes, Shared Kitchens & Vibrant Social Clusters',
    description: 'Designed around Mediterranean and Tuscan-inspired piazza clusters. Connected townhomes feature central shared courtyards, communal outdoor chef kitchens, woodfired pizza ovens, music practice spaces, and lively bougainvillea-covered pergolas.',
    architecturalStyle: 'Tuscan Hilltown meets Danish Co-housing and Spanish Moorish Courtyards',
    coordinates: { x: -35, y: 2, z: 40 },
    cameraTarget: { x: -35, y: 3, z: 40 },
    cameraPosition: { x: -55, y: 25, z: 65 },
    color: '#d97706',
    icon: 'Users',
    features: [
      'Interlocking courtyard residences with private master suites and shared salons',
      'Communal master kitchen where residents take turns cooking regional delicacies',
      'Acoustically tuned acoustic chamber for impromptu string quartets and jazz jams',
      'Community vegetable and citrus courtyards with shaded bocce ball courts',
      'Nightly lantern-lit family-style communal dining tables under olive trees',
      'Dedicated guest suites for visiting children and grandchildren'
    ],
    residentArchetype: 'Extroverts, community leaders, culinary enthusiasts, and social storytellers',
    capacity: '320 Courtyard Suites in 16 intimate villages',
    longevityImpact: '+48% Positive Social Engagement Score, verified Blue Zone lifestyle metrics',
    materials: ['Terracotta tiles', 'Sun-baked clay bricks', 'Wrought iron pergolas', 'Aromatic cypress woodwork'],
    keyHighlights: [
      { title: 'The Sunday Feast Long Table', detail: 'A continuous 100-seat outdoor timber table hosting weekly international potlucks with ingredients picked 30 minutes prior.' },
      { title: 'Multigenerational Guest Houses', detail: 'Allows grandchildren and family to stay on-site free of charge for up to 60 days per year.' }
    ]
  },
  {
    id: 'innovation-quarter',
    name: 'The Innovation Quarter',
    category: 'education',
    tagline: 'Smart Studios, AI Research Labs & Global Wisdom Mentorship',
    description: 'Where retired Nobel laureates, software architects, aerospace engineers, entrepreneurs, and scholars continue inventing the future. Equipped with quantum computing terminals, 3D prototyping labs, robotics test tracks, and global video conferencing auditoriums.',
    architecturalStyle: 'Futuristic Eco-Brutalism with floating crystalline solar glass pods',
    coordinates: { x: 45, y: 3, z: 35 },
    cameraTarget: { x: 45, y: 4, z: 35 },
    cameraPosition: { x: 65, y: 28, z: 58 },
    color: '#8b5cf6',
    icon: 'Cpu',
    features: [
      'High-bandwidth AI & Quantum Computing Research Studios',
      'Rapid 3D printing, laser cutting, metalwork, and woodcraft makerspaces',
      'Wisdom Exchange Broadcast Hall for remote university mentoring across 50 nations',
      'Seed Venture Incubator funding climate-tech startups founded by senior-youth teams',
      'Robotics assistance testing laboratory and longevity biowearables workshop',
      'Extensive quiet reading carrels overlooking an indoor tropical rain conservatory'
    ],
    residentArchetype: 'Lifelong inventors, retired engineers, academics, investors, and startup mentors',
    capacity: '180 Smart Loft Residencies + 24 Specialized Research Labs',
    longevityImpact: '+38% Cognitive Neuroplasticity preservation; prevents age-related cognitive decline',
    materials: ['Graphene-infused concrete', 'Electrochromic smart glass', 'Aerospace aluminum', 'Bamboo carbon composite'],
    keyHighlights: [
      { title: 'Wisdom Exchange Mentorship', detail: 'Over 400 young founders and PhD students globally receive 1-on-1 weekly mentorship from resident experts.' },
      { title: 'Senior-Led Patent Lab', detail: 'eLite Home residents have filed 64 international green patents in the past 36 months alone.' }
    ]
  },
  {
    id: 'artist-sanctuary',
    name: 'The Artist Sanctuary',
    category: 'culture',
    tagline: 'Sculpture Gardens, Ceramics Kilns & Music Amphitheaters',
    description: 'Nestled in a secluded sun-dappled valley. Sculptors, painters, potters, poets, and musicians have individual north-facing daylight studios, open-air kiln pavilions, bronze casting facilities, and outdoor gallery lawns surrounded by wildflowers.',
    architecturalStyle: 'Fluid Organic Expressionism with curved earthen stucco and timber vaulted arches',
    coordinates: { x: -60, y: 4, z: 5 },
    cameraTarget: { x: -60, y: 4, z: 5 },
    cameraPosition: { x: -85, y: 26, z: 25 },
    color: '#f43f5e',
    icon: 'Palette',
    features: [
      'North-facing artist studios with double-height ceilings and 100% natural light',
      'Communal Japanese woodfired Anagama kilns and glassblowing furnaces',
      'Sculpture park showcasing large-scale resident installations in native meadow grass',
      'Acoustically tuned Steinway grand piano practice shells in forest clearings',
      'Monthly resident exhibitions open to the global art collector community',
      'Poetry contemplation garden with stone calligraphy benches and water chimes'
    ],
    residentArchetype: 'Painters, sculptors, composers, novelists, ceramicists, and art historians',
    capacity: '160 Studio Residences + 18 Public Galleries',
    longevityImpact: '+45% Endorphin & Dopamine flow state duration; highest emotional fulfillment scores',
    materials: ['Rammed earth walls', 'Natural cedar shakes', 'Zinc roof canopies', 'Polished slate floors'],
    keyHighlights: [
      { title: 'The Meadow Sculpture Walk', detail: 'A 2-mile walking trail lined with 120 monumental sculptures created by resident masters.' },
      { title: 'Twilight Chamber Concerts', detail: 'Weekly sunset acoustic performances performed inside the natural resonance stone canyon.' }
    ]
  },
  {
    id: 'longevity-health',
    name: 'Longevity & Health Sanctuary',
    category: 'longevity',
    tagline: 'Six-Star Regenerative Medicine & Preventive Wellness Institute',
    description: 'A revolutionary healthcare sanctuary designed like an ultra-luxury Japanese ryokan rather than a hospital. Features cutting-edge preventive diagnostics, stem-cell therapies, hyperbaric oxygen chambers, NAD+ infusions, and holistic Ayurveda and traditional herbal medicine.',
    architecturalStyle: 'Biophilic Zen Minimalist Spa with cascading hydrotherapy streams',
    coordinates: { x: 0, y: 4, z: -55 },
    cameraTarget: { x: 0, y: 4, z: -55 },
    cameraPosition: { x: 0, y: 28, z: -25 },
    color: '#10b981',
    icon: 'HeartPulse',
    features: [
      'Continuous non-invasive AI metabolic, cardiovascular, and genomic monitoring',
      'Autologous stem-cell therapy suites & therapeutic plasma exchange clinics',
      'Cryotherapy (-110°C), hyperbaric oxygen (2.0 ATA), and infrared sauna circuit',
      'Holistic Ayurvedic consultation wing with Panchakarma purification chambers',
      'Personalized longevity nutrition pharmacy compounding daily botanical blends',
      'Thermal mineral hydrotherapy pools with 12 temperature and mineral gradients'
    ],
    residentArchetype: 'Every eLite Home resident receives continuous, discreet, preventative health care',
    capacity: 'Serves all 1,200 residents + 40 private clinical recovery suites',
    longevityImpact: 'Average +8.6 years healthspan extension; 92% reduction in preventable acute hospitalizations',
    materials: ['Hinoki cypress wood', 'Volcanic basalt stone', 'Titanium dioxide antibacterial glass', 'Pure copper hydrotherapy piping'],
    keyHighlights: [
      { title: 'Predictive AI Diagnostic Shield', detail: 'Discreet ambient sensors detect subtle micro-changes in gait, voice tone, and heart rate variability 30 days before clinical onset.' },
      { title: 'The Mineral Water Healing Cascade', detail: 'Natural volcanic hot spring waters enriched with lithium, sulfur, and boron for cellular detoxification.' }
    ]
  },
  {
    id: 'food-agriculture',
    name: 'The Living Harvest & Culinary Realm',
    category: 'food',
    tagline: 'Organic Terraces, Aquaponics Biospheres & 6 Farm-to-Table Bistros',
    description: '65 acres of regenerative agroforestry, organic vineyards, tea gardens, heirloom fruit orchards, and vertical hydroponic glass towers. Residents can harvest their own sun-ripened produce or dine at 6 zero-kilometer culinary pavilions led by Michelin-starred longevity chefs.',
    architecturalStyle: 'High-Tech Glass Greenhouse Architecture wrapped in living grapevine pergolas',
    coordinates: { x: 60, y: 2, z: 0 },
    cameraTarget: { x: 60, y: 3, z: 0 },
    cameraPosition: { x: 85, y: 26, z: 20 },
    color: '#84cc16',
    icon: 'Utensils',
    features: [
      '65 acres of organic heirloom vegetables, olive groves, and citrus orchards',
      'Multi-tier vertical aquaponics biospheres producing organic tilapia and greens',
      'Community wine estate and artisanal olive press operated by resident vintners',
      '6 Farm-to-Table restaurants serving anti-inflammatory, polyphenol-rich menus',
      'Daily culinary masterclasses in sourdough baking, fermentation, and herbal gastronomy',
      'Direct doorstep daily delivery of freshly harvested organic breakfast baskets'
    ],
    residentArchetype: 'Gardeners, foodies, retired chefs, viticulturists, and lovers of organic nourishment',
    capacity: 'Feeds 100% of eLite Home population with 40% surplus exported to local communities',
    longevityImpact: '100% organic antioxidant-rich diet; zero microplastics or endocrine disruptors',
    materials: ['Diffused horticultural glass', 'Reclaimed barnwood timber', 'Galvanized steel frames', 'Living green walls'],
    keyHighlights: [
      { title: 'The 30-Minute Harvest Rule', detail: 'Every salad served in our restaurants was harvested less than 30 minutes before reaching your plate.' },
      { title: 'Artisan Fermentation Vaults', detail: 'Over 80 varieties of kimchi, miso, sourdoughs, and kombuchas aged in climate-controlled stone cellars.' }
    ]
  },
  {
    id: 'sports-active',
    name: 'Active Longevity & Movement Domain',
    category: 'sports',
    tagline: 'Waterfall Yoga Decks, Pickleball Arenas, Kayaking Lagoons & Alpine Loops',
    description: 'Physical movement woven naturally into everyday life. 25 miles of cushioned rubberized walking and cycling trails, sheltered pickleball and tennis courts, natural swimming lagoons, tai chi waterfalls, and forest obstacle circuits designed for joint-friendly lifelong agility.',
    architecturalStyle: 'Open-Air Timber Lattice Pavilions cantilevered over mountain streams',
    coordinates: { x: -20, y: 6, z: -60 },
    cameraTarget: { x: -20, y: 5, z: -60 },
    cameraPosition: { x: -35, y: 30, z: -35 },
    color: '#06b6d4',
    icon: 'Activity',
    features: [
      '8 championship pickleball & 4 clay tennis courts with gentle impact shock-absorption',
      'Natural filtered freshwater swimming lagoon with sandy beach and lane swimming',
      'Cantilevered yoga & Tai Chi decks suspended directly above cascading waterfalls',
      '25-mile network of biomechanically cushioned forest walking and jogging trails',
      'Indoor Olympic hydrotherapy resistance pool with underwater treadmill cameras',
      'Gentle forest climbing and balance agility courses for neuromuscular calibration'
    ],
    residentArchetype: 'Hikers, swimmers, pickleball players, yogis, and athletes maintaining peak vitality',
    capacity: '800 concurrent participants across all athletic facilities',
    longevityImpact: '+35% Muscle mass retention, +40% Joint mobility, 85% lower fall risk in seniors',
    materials: ['Recycled rubber trail surfacing', 'Curved glulam timber beams', 'Natural riverbed stone', 'Bio-filtration reeds'],
    keyHighlights: [
      { title: 'Sunrise Waterfall Tai Chi', detail: 'Daily morning sessions guided by master practitioners overlooking the 25-meter crystal mountain falls.' },
      { title: 'Joint-Safe Pickleball Complex', detail: 'Engineered with triple-layer elastomeric subflooring that reduces knee impact by 68%.' }
    ]
  },
  {
    id: 'spiritual-sanctuary',
    name: 'The Interfaith Spiritual & Contemplation Sanctuary',
    category: 'spiritual',
    tagline: 'Floating Zen Temples, Labyrinth Walks & Sky Meditation Domes',
    description: 'A serene non-denominational sanctuary dedicated to inner peace, transcendent contemplation, and soul nourishment for all world religions, philosophies, and personal beliefs. Features floating water chapels, ancient labyrinth stone paths, and a glass sky contemplation dome.',
    architecturalStyle: 'Minimalist Sacred Geometry in translucent alabaster and light-washed cedar',
    coordinates: { x: 30, y: 10, z: -55 },
    cameraTarget: { x: 30, y: 9, z: -55 },
    cameraPosition: { x: 45, y: 32, z: -30 },
    color: '#eab308',
    icon: 'Sun',
    features: [
      'Floating lotus meditation temple surrounded by silent koi-filled reflection ponds',
      'Non-denominational Sacred Light Sanctuary illuminated by prismatic solar glass',
      'Ancient Chartres-style walking labyrinth paved in smooth white river stones',
      'Sound healing dome featuring 48 quartz crystal singing bowls and wind gongs',
      'Silent forest meditation huts accessible only by mossy stepping stones',
      'Open-air stargazing dome for nighttime cosmos reflection and philosophical contemplation'
    ],
    residentArchetype: 'Seekers of peace, meditators, spiritual practitioners of all faiths and backgrounds',
    capacity: '400 Seats in Central Hall + 12 Private Solitude Chapels',
    longevityImpact: 'Proven +22% increase in telomerase activity and profound reductions in anxiety biomarkers',
    materials: ['Translucent alabaster stone', 'Aromatic Japanese hinoki wood', 'Bronze bell castings', 'Pure white quartz pebbles'],
    keyHighlights: [
      { title: 'The Prismatic Light Dome', detail: 'Engineered prisms cast moving rainbows across the sanctuary walls synchronized with solar movement.' },
      { title: 'The Silent Water Path', detail: 'A barefoot walking path over smoothed river stones that massages foot reflexology points while crossing reflection ponds.' }
    ]
  },
  {
    id: 'smart-transit',
    name: 'Autonomous Mobility & Eco-Infrastructure',
    category: 'transit',
    tagline: 'Zero-Emission Autonomous Pods, Aerial Gondolas & Clean Microgrid',
    description: 'Zero traditional combustion vehicles. Transportation is completely silent, autonomous, and effortless: sleek magnetic electric pods on dedicated garden pathways, scenic aerial ropeways connecting valley peaks, electric garden trams, and 100% solar/micro-hydro power grids.',
    architecturalStyle: 'Invisible High-Tech Infrastructure integrated into green tunnels and canopy lines',
    coordinates: { x: 0, y: 8, z: 0 },
    cameraTarget: { x: 0, y: 4, z: 0 },
    cameraPosition: { x: 0, y: 45, z: 45 },
    color: '#3b82f6',
    icon: 'Compass',
    features: [
      '180 on-demand autonomous 4-passenger electric luxury pods summoned via smart watch',
      'Scenic 3.5-mile aerial gondola system connecting mountain ridge to coastal harbor',
      'Quiet electric garden trams running every 6 minutes along landscaped central loops',
      '100% Carbon-negative energy grid: 25MW floating solar lake + micro-hydro generators',
      'Automated subterranean pneumatic waste & organic composting collection tubes',
      'AI-managed rainwater retention reservoirs supplying 100% of irrigation needs'
    ],
    residentArchetype: 'Effortless, dignified, barrier-free mobility for residents of every mobility level',
    capacity: 'Supports 5,000 trips/day with average wait time under 75 seconds',
    longevityImpact: '100% quiet acoustic environment; elimination of 99.8% of PM2.5 air pollution',
    materials: ['Recycled carbon fiber', 'Photovoltaic glass shingles', 'Recycled aluminum alloys', 'Permeable bio-pavements'],
    keyHighlights: [
      { title: 'Under-75-Second On-Demand Pods', detail: 'Simply say "Dr. T, take me to the orchestra hall" and an electric pod arrives silently at your porch.' },
      { title: 'Floating Solar Lake', detail: 'A 15-acre floating solar array that cools the lake water while generating 14,000 MWh of clean electricity annually.' }
    ]
  }
];

export const LUXURY_CHAMBERS: LuxuryChamber[] = [
  {
    id: 'chamber-redwood-canopy',
    name: 'The Redwood Forest Canopy Villa',
    districtId: 'serenity-forest',
    districtName: 'The Serenity Forest',
    type: 'Treehouse Sanctuary Villa',
    sqFt: 3400,
    view: 'Ancient Redwood Canopy & Mountain Waterfall View',
    pricePerYear: '$145,000 / yr (All-Inclusive Wellness & Health)',
    architecturalVision: 'A biophilic masterpiece suspended 10 meters above the forest floor, wrapping gently around two living 300-year-old cedar trees. Floor-to-ceiling curved triple-pane glass brings the living forest inside while offering total acoustic serenity.',
    biophilicFeatures: [
      'Private cantilevered cedar soaking deck with continuous geothermal onsen bath',
      'Living interior wisteria and orchid biosculpture wall with smart automated misting',
      'Circadian lighting system mimicking the exact natural sunlight cycle and color spectrum',
      'Acoustic resonance flooring with built-in sub-bass vibrational therapy for nervous system relaxation'
    ],
    healthTechSuite: [
      'Discreet sleep architecture bed with real-time ballistocardiography & body temperature regulation',
      'Smart bathroom diagnostic mirror assessing skin hydration, vitals, and micro-expressions',
      'Medical-grade HEPA 14 air filtration with negative ion and forest phytoncide infusion',
      'Far-infrared ceramic heating panels integrated seamlessly into timber walls'
    ],
    interiorMaterials: ['Sustainably sourced Japanese Hinoki wood', 'Natural slate stone', 'Organic linen and silk upholstery', 'Curved low-iron smart glass'],
    energyProfile: 'Net Positive: Generates 140% of its energy needs via rooftop solar slate shingles',
    imageKey: 'elite_lux_chamber',
    floorPlanRooms: [
      { name: 'Master Forest Sanctuary', size: '950 sq.ft', description: 'Curved glass bedroom with panoramic canopy views, circadian bed, and stone fireplace.' },
      { name: 'Onsen & Hydrotherapy Spa Bath', size: '620 sq.ft', description: 'Twin rain showers, cold plunge pool, cedar soaking tub, and sauna.' },
      { name: 'Private Reading & Meditation Salon', size: '580 sq.ft', description: 'Floor-to-ceiling personal library, tea ceremony alcove, and ergonomic writing desk.' },
      { name: 'Gourmet Organic Kitchenette', size: '350 sq.ft', description: 'Induction cooktop, sub-zero produce chiller, and reverse-osmosis mineral water tap.' },
      { name: 'Wraparound Canopy Deck', size: '900 sq.ft', description: 'Suspended teak terrace with outdoor daybeds and heated onsen pool.' }
    ]
  },
  {
    id: 'chamber-ocean-sunset',
    name: 'The Ocean Horizon Cantilever Villa',
    districtId: 'ocean-horizon',
    districtName: 'The Ocean Horizon',
    type: 'Oceanfront Cliffside Penthouse',
    sqFt: 4600,
    view: 'Panoramic 180° Pacific Ocean & Coastal Sunsets',
    pricePerYear: '$195,000 / yr (All-Inclusive Wellness & Health)',
    architecturalVision: 'Perched dramatically on the cliff edge with a 15-meter cantilever over the ocean cove. Features a private heated saltwater infinity pool that merges seamlessly with the horizon line, offering golden hour spectacles every evening.',
    biophilicFeatures: [
      'Private heated saltwater infinity pool with underwater hydro-acoustic sound system',
      'Retractable frameless glass walls creating seamless 100% indoor-outdoor living',
      'Private cliffside succulent and aromatic lavender wellness terrace',
      'Natural sea breeze cooling chimneys minimizing mechanical air conditioning'
    ],
    healthTechSuite: [
      'Private Hyperbaric Oxygen Therapy (HBOT) relaxation pod in wellness lounge',
      'Full-spectrum infrared sauna overlooking crashing waves',
      'Smart water ionizer dispensing 6 customized electrolyte-infused alkaline mineral waters',
      'Ambient acoustic dampening cancelling harsh wind while preserving soothing wave rhythms'
    ],
    interiorMaterials: ['Honed Greek Thassos marble', 'Marine-grade brushed champagne titanium', 'Bleached white oak', 'Custom curved acoustic plaster'],
    energyProfile: 'Net Zero: Powered by coastal micro-wind turbines and marine solar array',
    imageKey: 'elite_home_masterplan',
    floorPlanRooms: [
      { name: 'Horizon Grand Living Suite', size: '1,400 sq.ft', description: 'Sunken seating lounge with 180° glass facade, suspended bio-ethanol fireplace, and wine cellar.' },
      { name: 'Master Ocean Suite & Solarium', size: '1,100 sq.ft', description: 'Stargazing skylight ceiling, custom ocean-facing king bed, and dual walk-in dressing rooms.' },
      { name: 'Private Wellness & Cryo Spa', size: '750 sq.ft', description: 'Infrared sauna, hyperbaric lounge, and private treatment massage tables.' },
      { name: 'Chef Culinary Kitchen & Dining Pavilion', size: '550 sq.ft', description: 'Marble island, teppanyaki grill, and open-air sunset dining veranda.' },
      { name: 'Cantilevered Ocean Infinity Terrace', size: '800 sq.ft', description: 'Heated saltwater pool, glass balustrades, fire pit, and stargazing telescope.' }
    ]
  },
  {
    id: 'chamber-wisdom-courtyard',
    name: 'The Tuscan Courtyard Friendship Suite',
    districtId: 'village-of-friends',
    districtName: 'The Village of Friends',
    type: 'Courtyard Cluster Residence',
    sqFt: 2900,
    view: 'Lush Central Olive Grove & Fountain Courtyard',
    pricePerYear: '$115,000 / yr (All-Inclusive Wellness & Health)',
    architecturalVision: 'Designed for warmth and social connection. Built around a sunlit terracotta-tiled inner courtyard with citrus trees, blooming jasmine, and a stone water fountain. Interconnects seamlessly with community culinary lounges.',
    biophilicFeatures: [
      'Private central atrium courtyard with Meyer lemon trees and aromatic rosemary borders',
      'Handcrafted terracotta cooling floors that naturally regulate indoor temperature',
      'Shaded pergola veranda with dining space for 12 guests',
      'Direct stepping stone access to the community vineyard and olive press'
    ],
    healthTechSuite: [
      'Integrated red-light therapy (660nm/850nm) rejuvenation ceiling panels in study and bedroom',
      'Smart circadian hydration station dispensing herbal infusions calibrated to daily vitals',
      'Voice-controlled ambient mood transitions matching personal emotional states',
      'Discreet fall prevention micro-radar sensing with zero cameras for total privacy'
    ],
    interiorMaterials: ['Hand-made Tuscan terracotta', 'Aged chestnut timber beams', 'Natural lime plaster', 'Aged brass fixtures'],
    energyProfile: 'Carbon Negative: Passive solar orientation with geothermal heating and cooling',
    imageKey: 'elite_heart_plaza',
    floorPlanRooms: [
      { name: 'Central Garden Courtyard', size: '600 sq.ft', description: 'Private open-air patio with stone fountain, herb planters, and pergola seating.' },
      { name: 'Master Harmony Bedroom', size: '850 sq.ft', description: 'Vaulted timber ceiling, French doors opening to courtyard, and walk-in dressing room.' },
      { name: 'Wisdom Study & Studio', size: '480 sq.ft', description: 'Built-in library shelving, dual monitors for mentorship, and fireplace.' },
      { name: 'Artisan Kitchen & Breakfast Nook', size: '420 sq.ft', description: 'Granite counter, wood-fired bread oven access, and farm produce basket drop.' },
      { name: 'Private Guest Chamber', size: '550 sq.ft', description: 'En-suite bedroom for visiting family and international guests.' }
    ]
  },
  {
    id: 'chamber-regenerative-institute',
    name: 'The Regenerative Longevity Executive Penthouse',
    districtId: 'longevity-health',
    districtName: 'Longevity & Health Sanctuary',
    type: 'Clinical Wellness Residence',
    sqFt: 3800,
    view: 'Zen Bamboo Forest & Healing Hydrotherapy Stream',
    pricePerYear: '$220,000 / yr (Full Medical & Cellular Rejuvenation Protocol)',
    architecturalVision: 'The ultimate health optimization home on Earth. Seamlessly merges Japanese architectural serenity with a fully equipped private longevity and cellular recovery clinic directly inside your living quarters.',
    biophilicFeatures: [
      'Private enclosed Japanese rock & moss Zen contemplation garden',
      'Waterfall hydro-massage plunge pools with negative-ionization generators',
      'Full-height sliding shoji screen walls opening onto tranquil bamboo groves',
      'Acoustically tuned sound-bath chambers for brainwave entrainment (Theta & Delta states)'
    ],
    healthTechSuite: [
      'In-suite pulsed electromagnetic field (PEMF) therapy lounge and cryo-pod',
      'Dedicated clinical nursing & concierge port for stem-cell and NAD+ IV protocols',
      'Full-body multispectral imaging scanner for daily subcutaneous cellular tracking',
      'Hydrogen-rich water generator with molecular hydrogen inhalation mask system'
    ],
    interiorMaterials: ['Japanese Sugi cedar', 'Charcoal-filtered Tatami mats', 'Natural basalt stone', 'Recycled bronze details'],
    energyProfile: 'Net Positive: 100% powered by on-site geothermal energy and battery microgrid',
    imageKey: 'elite_longevity_sanctuary',
    floorPlanRooms: [
      { name: 'Executive Master Suite', size: '1,050 sq.ft', description: 'Circadian environmental chamber with soundproofing and oxygen enrichment.' },
      { name: 'Private Cellular Therapy Clinic', size: '800 sq.ft', description: 'HBOT chamber, PEMF lounge, and sterile medical consultation console.' },
      { name: 'Zen Garden Living Pavilion', size: '950 sq.ft', description: 'Low-profile seating, sliding shoji glass, and heated volcanic basalt floor.' },
      { name: 'Hydrotherapy & Thermal Spa', size: '600 sq.ft', description: 'Cedar sauna, cold plunge, steam shower, and mineral onsen tub.' },
      { name: 'Private Bamboo Terrace', size: '400 sq.ft', description: 'Outdoor moss garden with stone lanterns and stream water feature.' }
    ]
  }
];

export const RETIREMENT_DAILY_RHYTHMS = [
  {
    time: '06:30 - 07:30',
    name: 'Dawn Sunlight & Waterfall Tai Chi',
    location: 'Waterfall Yoga Deck (Active Domain)',
    description: 'Awaken with natural sunrise photons, gentle joint mobilization, and rhythmic breathing guided by master teachers above the cascading falls.',
    healthBenefit: 'Cortisol spike synchronization, circadian reset, enhanced mobility',
    districtId: 'sports-active'
  },
  {
    time: '08:00 - 09:00',
    name: 'Living Harvest Organic Breakfast',
    location: 'Heart of Life Open-Air Bistro',
    description: 'Enjoy freshly gathered organic berries, antioxidant greens, sourdoughs, and pasture-raised eggs delivered 30 minutes post-harvest.',
    healthBenefit: 'Polyphenol enrichment, gut microbiome diversity, zero blood sugar spikes',
    districtId: 'food-agriculture'
  },
  {
    time: '09:30 - 11:30',
    name: 'Wisdom Exchange & Innovation Labs',
    location: 'The Innovation Quarter & Global Academy',
    description: 'Mentor remote university students in 50 countries, collaborate on green patents, or attend a lecture on astrophysics from a resident fellow.',
    healthBenefit: 'Cognitive neuroplasticity stimulation, deep sense of life purpose',
    districtId: 'innovation-quarter'
  },
  {
    time: '12:00 - 13:30',
    name: 'Community Long-Table Luncheon',
    location: 'The Village of Friends Courtyard',
    description: 'Share a leisurely Mediterranean feast with neighbors from 6 continents. Laughter, storytelling, and international friendship under the olive trees.',
    healthBenefit: 'Oxytocin release, social connection, chronic stress mitigation',
    districtId: 'village-of-friends'
  },
  {
    time: '14:00 - 15:30',
    name: 'Regenerative Longevity Spa & Rest',
    location: 'Longevity & Health Sanctuary',
    description: 'Experience hyperbaric oxygen, mineral hydrotherapy soak, infrared sauna, or restorative sleep in your acoustic forest villa.',
    healthBenefit: 'Cellular autophagy, microvascular repair, athletic recovery',
    districtId: 'longevity-health'
  },
  {
    time: '16:00 - 17:30',
    name: 'Creative Expression & Forest Bathing',
    location: 'The Artist Sanctuary & Serenity Trails',
    description: 'Sculpt, paint in north-lit studios, play piano in the forest shell, or walk the quiet cedar paths in deep meditative presence.',
    healthBenefit: 'Flow-state neurotransmitter production, immune NK cell elevation',
    districtId: 'artist-sanctuary'
  },
  {
    time: '17:30 - 19:00',
    name: 'The Golden Hour Plaza Gathering',
    location: 'The Heart of Life Plaza (Tree of Life)',
    description: 'The entire community unites under the glowing Tree of Life for tea, violin performances, interactive fountains, and sunset conversations.',
    healthBenefit: 'Social cohesion, joy elevation, emotional harmony',
    districtId: 'heart-of-life'
  },
  {
    time: '19:30 - 21:30',
    name: 'Global Cultural Feast & Twilight Symphony',
    location: 'Amphitheater & Ocean Sunset Pavilion',
    description: 'World-class acoustic performances, outdoor cinema under the stars, or intimate dinners with panoramic ocean sunset views.',
    healthBenefit: 'Aesthetic pleasure, parasympathetic calming, deep emotional richness',
    districtId: 'ocean-horizon'
  },
  {
    time: '22:00',
    name: 'Circadian Sleep Sanctuary Initiation',
    location: 'Private Luxury Chamber',
    description: 'Smart lighting fades to gentle candlelight tones, negative ions infuse the bedroom air, and white noise ocean sounds induce deep restorative REM sleep.',
    healthBenefit: 'Growth hormone release, cellular repair, deep neurological cleansing',
    districtId: 'serenity-forest'
  }
];

export const GLOBAL_MASTERCLASSES: MasterclassProgram[] = [
  {
    id: 'class-1',
    title: 'Quantum Physics as Everyday Poetry',
    mentorName: 'Prof. Ananya Sen, PhD',
    mentorTitle: 'Former Chair of Quantum Optics, Oxford University',
    originCountry: 'India / UK',
    flag: '🇮🇳',
    category: 'Science & Philosophy',
    schedule: 'Tuesdays & Thursdays, 10:00 AM',
    location: 'Innovation Quarter Lecture Dome',
    description: 'Deconstructing the mysteries of entanglement, superpositions, and consciousness for curious minds of all academic backgrounds.'
  },
  {
    id: 'class-2',
    title: 'Culinary Alchemy of the Mediterranean Blue Zones',
    mentorName: 'Chef Matteo Bertolini',
    mentorTitle: '3-Star Michelin Chef & Longevity Nutritionist',
    originCountry: 'Italy',
    flag: '🇮🇹',
    category: 'Culinary & Nutrition',
    schedule: 'Wednesdays, 11:30 AM',
    location: 'Village of Friends Master Kitchen',
    description: 'Mastering traditional sourdoughs, polyphenol-rich cold-pressed olive oils, and ancient botanical infusions for cellular youth.'
  },
  {
    id: 'class-3',
    title: 'The Art of Socratic Dialogue & Life Mentorship',
    mentorName: 'Dr. Clarissa Jane (Dr. T)',
    mentorTitle: 'Polymath Counselor & Socratic AI Architect',
    originCountry: 'Global',
    flag: '🌐',
    category: 'Human Connection',
    schedule: 'Daily, 16:30 PM',
    location: 'Heart of Life Wisdom Pavilion',
    description: 'Cultivating deep empathy, active listening, generational bridging, and joyful resolution of emotional complexities.'
  },
  {
    id: 'class-4',
    title: 'Japanese Joinery & Sacred Cedar Architecture',
    mentorName: 'Master Kenji Takahashi',
    mentorTitle: 'Traditional Temple Carpenter & Forest Architect',
    originCountry: 'Japan',
    flag: '🇯🇵',
    category: 'Craft & Design',
    schedule: 'Mondays & Fridays, 14:00 PM',
    location: 'The Artist Sanctuary Woodshop',
    description: 'Creating timeless wooden furniture and living structures without a single metal nail, connecting deeply with the spirit of timber.'
  }
];
