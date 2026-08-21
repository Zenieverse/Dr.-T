import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Award, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Coins, 
  Trees, 
  Brain, 
  Volume2, 
  VolumeX, 
  Share2, 
  ArrowRight,
  Flame,
  Zap,
  Star,
  Timer,
  ExternalLink,
  ShieldCheck,
  Compass,
  Trophy,
  Dna,
  Microscope,
  Leaf,
  Calendar,
  Gift,
  Medal,
  UserCheck,
  Crown,
  User,
  Check
} from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export type DifficultyLevel = 'newbie' | 'junior' | 'senior' | 'expert' | 'legend';

export interface QuizQuestion {
  id: string;
  level: DifficultyLevel;
  topic: string;
  emoji: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint: string;
  funFact?: string;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  levelTitle: string;
  tCoins: number;
  score: number;
  streak: number;
  timestamp: string;
}

const DEFAULT_LEADERBOARD: LeaderboardEntry[] = [
  { id: '1', name: 'Dr. Rosalind Franklin', avatar: '🧬', levelTitle: 'Gaia Astrobiologist', tCoins: 18450, score: 25, streak: 14, timestamp: '2026-08-10' },
  { id: '2', name: 'Prof. Alexander Fleming', avatar: '🧫', levelTitle: 'Genomic Mastermind', tCoins: 14200, score: 24, streak: 10, timestamp: '2026-08-10' },
  { id: '3', name: 'Gregor Mendel', avatar: '🌱', levelTitle: 'Senior Master Biologist', tCoins: 11850, score: 22, streak: 8, timestamp: '2026-08-10' },
  { id: '4', name: 'Rachel Carson', avatar: '🌳', levelTitle: 'Field Bio Specialist', tCoins: 9600, score: 20, streak: 6, timestamp: '2026-08-10' },
  { id: '5', name: 'Carl Linnaeus', avatar: '🔬', levelTitle: 'Field Bio Specialist', tCoins: 8100, score: 19, streak: 5, timestamp: '2026-08-10' },
  { id: '6', name: 'EcoExplorer_Jane', avatar: '🦁', levelTitle: 'Young Eco-Explorer', tCoins: 6500, score: 18, streak: 4, timestamp: '2026-08-10' },
  { id: '7', name: 'GeneWhiz_99', avatar: '✂️', levelTitle: 'Genomic Mastermind', tCoins: 5200, score: 16, streak: 3, timestamp: '2026-08-10' }
];

const STREAK_REWARDS = [
  { day: 1, coins: 50, emoji: '🌱', label: 'Sprout' },
  { day: 2, coins: 100, emoji: '🌿', label: 'Sproutling' },
  { day: 3, coins: 150, emoji: '🪴', label: 'Shrub' },
  { day: 4, coins: 200, emoji: '🌳', label: 'Young Tree' },
  { day: 5, coins: 350, emoji: '🌲', label: 'Forest' },
  { day: 6, coins: 500, emoji: '🌴', label: 'Sanctuary' },
  { day: 7, coins: 1200, emoji: '👑', label: 'Gaia Oracle' }
];

const QUIZ_QUESTIONS: QuizQuestion[] = [
  // --- LEVEL 1: NEWBIE / YOUNG ECO-EXPLORER (🌱 EASY) ---
  {
    id: 'n1',
    level: 'newbie',
    topic: 'Cell Powerhouse',
    emoji: '🦠',
    question: 'Which microscopic organelle is famous as the "powerhouse of the cell" for generating cellular energy?',
    options: ['Nucleus 🧬', 'Mitochondria ⚡', 'Cell Wall 🧱', 'Vacuole 💧'],
    correctIndex: 1,
    explanation: 'Mitochondria generate adenosine triphosphate (ATP) energy through cellular respiration, powering all biological processes!',
    hint: 'Think of the internal battery or power plant that provides energy for cellular work.',
    funFact: 'Mitochondria have their own unique circular DNA inherited exclusively from the maternal side!'
  },
  {
    id: 'n2',
    level: 'newbie',
    topic: 'Photosynthesis',
    emoji: '🌱',
    question: 'What process allows green leaves to convert sunlight, water, and carbon dioxide into food sugar?',
    options: ['Photosynthesis 🌱', 'Fermentation 🧫', 'Digestion 🍎', 'Hibernation 🐻'],
    correctIndex: 0,
    explanation: 'Photosynthesis uses light photons to convert CO2 and H2O into glucose sugar while releasing breathable oxygen!',
    hint: '"Photo" means light, and "synthesis" means putting together.',
    funFact: 'Over 50% of Earth’s oxygen comes not from trees, but from microscopic marine phytoplankton performing photosynthesis!'
  },
  {
    id: 'n3',
    level: 'newbie',
    topic: 'Plant Anatomy',
    emoji: '🌿',
    question: 'Which underground plant structure anchors the plant in soil and drinks up water and minerals?',
    options: ['Petals 🌸', 'Leaves 🍃', 'Roots 🪵', 'Stems 🎋'],
    correctIndex: 2,
    explanation: 'Roots extend deep into soil to absorb essential water, nitrogen, and minerals while anchoring against wind.',
    hint: 'They grow downwards in response to gravity (positive gravitropism).',
    funFact: 'A single rye plant can grow up to 380 miles (600 km) of roots!'
  },
  {
    id: 'n4',
    level: 'newbie',
    topic: 'Animal Classification',
    emoji: '🦁',
    question: 'Animals like rabbits, pandas, deer, and cows that eat ONLY plants are classified as...?',
    options: ['Carnivores 🐅', 'Herbivores 🌿', 'Omnivores 🐻', 'Decomposers 🍄'],
    correctIndex: 1,
    explanation: 'Herbivores feed on plant material like grass, leaves, seeds, and fruit, forming primary consumers in food webs.',
    hint: '"Herba" relates to plants or vegetation.',
    funFact: 'Panda bears spend up to 12 hours a day eating up to 38 kilograms of bamboo!'
  },
  {
    id: 'n5',
    level: 'newbie',
    topic: 'Ecosystem Oxygen',
    emoji: '🌍',
    question: 'What vital gas do photosynthetic plants release into the atmosphere for humans and animals to breathe?',
    options: ['Carbon Dioxide 💨', 'Nitrogen Gas 🌫️', 'Oxygen (O2) 💨', 'Helium 🎈'],
    correctIndex: 2,
    explanation: 'Plants split water molecules during light-dependent reactions, releasing molecular oxygen (O2) gas into the atmosphere.',
    hint: 'It is the gas we inhale into our lungs every second to stay alive.',
    funFact: 'The Amazon Rainforest produces roughly 20% of Earth’s land-based oxygen!'
  },
  {
    id: 'n6',
    level: 'newbie',
    topic: 'Microbiology Lab',
    emoji: '🧫',
    question: 'What shallow covered dish containing nutrient agar gel is used by biologists to cultivate bacteria cultures?',
    options: ['Petri Dish 🧫', 'Beaker 🧪', 'Microscope Slide 🔬', 'Test Tube 🧬'],
    correctIndex: 0,
    explanation: 'A Petri dish filled with sterile nutrient agar provides an ideal solid matrix for growing visible bacterial and fungal colonies.',
    hint: 'It is named after German bacteriologist Julius Richard Petri.',
    funFact: 'Alexander Fleming discovered penicillin when mold accidentally grew on an open Petri dish of staphylococcus bacteria!'
  },
  {
    id: 'n7',
    level: 'newbie',
    topic: 'DNA Vault',
    emoji: '🧬',
    question: 'Where inside a eukaryotic plant or animal cell is the genetic DNA blueprint protected?',
    options: ['Cytoplasm 🌊', 'Nucleus 🧬', 'Cell Membrane 🛡️', 'Ribosome 🏭'],
    correctIndex: 1,
    explanation: 'The cell nucleus is enclosed in a double membrane envelope and holds the organism’s genomic DNA chromosomes.',
    hint: 'It acts as the central command vault of the cell.',
    funFact: 'If you uncoiled all the DNA in a single human cell, it would stretch over 2 meters long!'
  },

  // --- LEVEL 2: JUNIOR BIOLOGIST / FIELD SPECIALIST (🌿 MEDIUM) ---
  {
    id: 'j1',
    level: 'junior',
    topic: 'Chloroplast Pigments',
    emoji: '🦠',
    question: 'Which green pigment molecule inside plant chloroplasts absorbs sunlight photons to drive photosynthesis?',
    options: ['Hemoglobin 🩸', 'Melanin ☀️', 'Chlorophyll 🌿', 'Carotene 🥕'],
    correctIndex: 2,
    explanation: 'Chlorophyll absorbs red and blue light wavelengths while reflecting green wavelengths, giving leaves their vibrant color.',
    hint: 'Contains the Greek prefix "chloro-" meaning pale green.',
    funFact: 'In autumn, chlorophyll breaks down first, revealing orange carotenoids and red anthocyanins!'
  },
  {
    id: 'j2',
    level: 'junior',
    topic: 'DNA Architecture',
    emoji: '🧬',
    question: 'The structural shape of a double-stranded DNA molecule is famously described as a...?',
    options: ['Double Helix 🧬', 'Triple Strand 🧵', 'Quad Circle ⭕', 'Single Spiral 🌀'],
    correctIndex: 0,
    explanation: 'DNA consists of two antiparallel polynucleotide strands twisted around a central axis into a double helix structure.',
    hint: 'Rosalind Franklin’s X-ray diffraction Photo 51 revealed this iconic spiral ladder shape.',
    funFact: 'Human DNA shares about 60% of its genetic code with bananas and 98.8% with chimpanzees!'
  },
  {
    id: 'j3',
    level: 'junior',
    topic: 'Plant Vascular System',
    emoji: '🌿',
    question: 'Which specialized plant vascular tissue transports water and minerals UPWARD from roots to leaves?',
    options: ['Phloem 🍯', 'Xylem 🪵', 'Epidermis 🛡️', 'Stomata 👄'],
    correctIndex: 1,
    explanation: 'Xylem consists of dead, hollow vessel elements that pull water upward via transpiration and cohesion-tension.',
    hint: 'Remember: Xylem moves water UP; Phloem moves food (sugars) DOWN.',
    funFact: 'Giant sequoia trees pull water over 300 feet (90 meters) up into the sky using xylem suction power alone!'
  },
  {
    id: 'j4',
    level: 'junior',
    topic: 'Anaerobic Fermentation',
    emoji: '🧫',
    question: 'Micro-organisms like yeast produce carbon dioxide gas and ethanol without oxygen through which metabolic process?',
    options: ['Aerobic Respiration 🫁', 'Anaerobic Fermentation 🧫', 'Photosynthesis 🌱', 'Transpiration 💧'],
    correctIndex: 1,
    explanation: 'Fermentation regenerates NAD+ without an electron transport chain, producing CO2 and alcohol in yeast or lactic acid in muscles.',
    hint: 'It is the ancient process used in baking bread to make dough rise.',
    funFact: 'Bread dough rises because yeast fermentation traps CO2 bubbles inside the gluten mesh!'
  },
  {
    id: 'j5',
    level: 'junior',
    topic: 'Taxonomy Classes',
    emoji: '🦁',
    question: 'Whales, bats, dolphins, kangaroos, and humans all belong to which vertebrate class?',
    options: ['Amphibians 🐸', 'Reptiles 🦎', 'Mammals (Mammalia) 🐋', 'Arthropods 🦀'],
    correctIndex: 2,
    explanation: 'Mammals are endothermic (warm-blooded) vertebrates characterized by hair/fur, neocortex brains, and mammary glands for nursing young.',
    hint: 'They produce milk to nourish their offspring and breathe with lungs.',
    funFact: 'The blue whale is the largest mammal—and largest animal—to ever exist on Earth, bigger than any dinosaur!'
  },
  {
    id: 'j6',
    level: 'junior',
    topic: 'Nitrogen Cycle Symbiosis',
    emoji: '🌍',
    question: 'Which organisms living in soil and legume root nodules fix atmospheric nitrogen gas into usable nitrates for plants?',
    options: ['Fungi 🍄', 'Nitrifying Bacteria 🦠', 'Earthworms 🪱', 'Algae 🌊'],
    correctIndex: 1,
    explanation: 'Rhizobium bacteria convert inert N2 gas into ammonia and nitrates through nitrogenase enzymes, fertilizing plants naturally.',
    hint: 'Prokaryotic micro-organisms forming a mutualistic partnership with clover, beans, and peas.',
    funFact: 'Without nitrogen-fixing bacteria, protein synthesis in plants and animals would grind to a complete halt!'
  },
  {
    id: 'j7',
    level: 'junior',
    topic: 'Leaf Stomata',
    emoji: '🌱',
    question: 'Microscopic pore openings on leaf undersides called stomata open up primarily to take in which essential gas?',
    options: ['Oxygen (O2) 💨', 'Carbon Dioxide (CO2) 🍃', 'Methane (CH4) 🔥', 'Argon (Ar) 🌫️'],
    correctIndex: 1,
    explanation: 'Stomata guarded by specialized guard cells open to absorb CO2 for the Calvin Cycle while regulating water loss.',
    hint: 'The greenhouse gas plants convert into oxygen and organic sugars.',
    funFact: 'A single oak leaf can have over 100,000 stomata pores per square centimeter!'
  },

  // --- LEVEL 3: SENIOR BIOLOGIST / ECO-MASTER (🔬 ADVANCED) ---
  {
    id: 's1',
    level: 'senior',
    topic: 'Cellular Respiration ATP Yield',
    emoji: '🦠',
    question: 'In eukaryotic aerobic cellular respiration, approximately how many net ATP molecules are produced per glucose molecule?',
    options: ['2 ATP ⚡', '12 ATP ⚡', '30–32 ATP ⚡⚡', '100 ATP ⚡'],
    correctIndex: 2,
    explanation: 'Glycolysis yields 2 ATP, the Krebs Cycle yields 2 ATP, and Oxidative Phosphorylation via ATP Synthase yields ~26–28 ATP (~30–32 net total).',
    hint: 'Glycolysis and Krebs yield a few, but the Electron Transport Chain generates the vast majority.',
    funFact: 'An active human body recycles its own body weight in ATP energy molecules every single day!'
  },
  {
    id: 's2',
    level: 'senior',
    topic: 'Molecular RNA Transcription',
    emoji: '🧬',
    question: 'During gene transcription into mRNA, which pyrimidine base replaces Thymine (T) to pair with Adenine (A)?',
    options: ['Guanine (G) 🧬', 'Cytosine (C) 🧬', 'Uracil (U) 🧬', 'Thiamine (B1) 💊'],
    correctIndex: 2,
    explanation: 'RNA contains Uracil (U) instead of Thymine (T). Uracil lacks a methyl group, making RNA cheaper for cells to synthesize rapidly.',
    hint: 'It starts with the letter "U".',
    funFact: 'Uracil requires less energy to build, which is ideal for short-lived messenger RNA molecules!'
  },
  {
    id: 's3',
    level: 'senior',
    topic: 'Phytohormones',
    emoji: '🌿',
    question: 'Which gaseous plant hormone triggers fruit ripening, leaf drop (abscission), and flower senescence?',
    options: ['Auxin 🌿', 'Gibberellin 🌱', 'Ethylene (C2H4) 🍎', 'Cytokinin 🧪'],
    correctIndex: 2,
    explanation: 'Ethylene gas is a signaling phytohormone that promotes fruit maturation, cell wall softening, and starch-to-sugar conversion.',
    hint: 'Released by ripe bananas, causing nearby apples and avocados to ripen rapidly.',
    funFact: 'Placing an unripe avocado in a paper bag with a ripe banana concentrates ethylene gas to speed up ripening overnight!'
  },
  {
    id: 's4',
    level: 'senior',
    topic: 'Symbiotic Relationships',
    emoji: '🌍',
    question: 'What ecological relationship describes a interaction where BOTH species benefit (+/+), such as bees pollinating flowers?',
    options: ['Mutualism 🤝', 'Commensalism 🕊️', 'Parasitism 🦟', 'Amensalism 🛡️'],
    correctIndex: 0,
    explanation: 'Mutualism benefits both co-evolving organisms. The bee gets nectar food, while the flower achieves cross-pollination.',
    hint: 'Contains the root word "mutual".',
    funFact: 'Mycorrhizal fungi and tree roots share a underground mutualistic fungal network nicknamed the "Wood Wide Web"!'
  },
  {
    id: 's5',
    level: 'senior',
    topic: 'Gene Editing Technology',
    emoji: '🧫',
    question: 'Which molecular technology adapted from bacterial antiviral immunity uses Cas9 endonuclease to cut targeted DNA sequences?',
    options: ['PCR Amplifier 🧬', 'CRISPR/Cas9 ✂️', 'Gel Electrophoresis ⚡', 'Southern Blotting 🧪'],
    correctIndex: 1,
    explanation: 'CRISPR/Cas9 utilizes a guide RNA molecule to locate complementary genomic coordinates and induce precise double-strand DNA cleavage.',
    hint: 'Acronym for Clustered Regularly Interspaced Short Palindromic Repeats.',
    funFact: 'Emmanuelle Charpentier and Jennifer Doudna won the 2020 Nobel Prize in Chemistry for developing CRISPR gene editing!'
  },
  {
    id: 's6',
    level: 'senior',
    topic: 'Extremophile Microbiology',
    emoji: '🔬',
    question: 'Which domain of single-celled prokaryotes is famous for surviving extreme heat, acid, and salt environments like boiling hot springs?',
    options: ['Eukarya 🌿', 'Bacteria 🦠', 'Archaea 🔥', 'Protista 🧫'],
    correctIndex: 2,
    explanation: 'Archaea possess ether-linked isoprenoid membrane lipids that remain stable in boiling acid, deep underwater vents, and hypersaline lakes.',
    hint: 'Ancient extremophile domain separate from Eubacteria.',
    funFact: 'Taq Polymerase used in PCR DNA testing comes from Thermus aquaticus, an extremophile bacterium discovered in Yellowstone hot springs!'
  },
  {
    id: 's7',
    level: 'senior',
    topic: 'Chloroplast Ultrastructure',
    emoji: '🌱',
    question: 'Where inside the chloroplast do the light-dependent reactions (Photosystems I & II) physically take place?',
    options: ['Stroma fluid 🌊', 'Thylakoid Membrane 🥞', 'Outer Membrane 🛡️', 'Mitochondrial Matrix ⚡'],
    correctIndex: 1,
    explanation: 'Light-harvesting complexes and ATP synthase enzymes are embedded in flattened thylakoid membranes stacked into grana.',
    hint: 'Stack of pancake-like membrane discs inside chloroplasts.',
    funFact: 'The proton gradient generated across thylakoid membranes drives ATP production through an biological rotary molecular motor!'
  },

  // --- LEVEL 4: EXPERT / GENOMIC MOLECULAR MASTERMIND (🧬 EXPERT) ---
  {
    id: 'e1',
    level: 'expert',
    topic: 'Photosynthetic Pathways',
    emoji: '🌵',
    question: 'Which specialized photosynthetic pathway used by desert succulents like pineapples and cacti opens stomata ONLY at night to conserve water?',
    options: ['C3 Pathway 🌿', 'C4 Pathway 🌽', 'CAM (Crassulacean Acid Metabolism) 🌵', 'Calvin-Benson Cycle 🧪'],
    correctIndex: 2,
    explanation: 'CAM plants fix CO2 into malic acid at night when temperatures are cool, storing it in vacuoles for daytime Calvin cycle use.',
    hint: 'Named after the succulent plant family Crassulaceae.',
    funFact: 'CAM plants lose only 50 grams of water per gram of CO2 fixed, compared to 500 grams for standard C3 plants!'
  },
  {
    id: 'e2',
    level: 'expert',
    topic: 'Enzymatic Photorespiration',
    emoji: '🧪',
    question: 'RuBisCO, the most abundant protein on Earth, suffers from an inefficient oxygenase side-reaction called...?',
    options: ['Photorespiration 💨', 'Oxidative Phosphorylation ⚡', 'Glycolysis 🍬', 'Decarboxylation 💥'],
    correctIndex: 0,
    explanation: 'When RuBisCO fixes O2 instead of CO2, it produces toxic 2-phosphoglycolate, wasting up to 25% of the plant’s photosynthetic energy.',
    hint: 'Respiration driven by light where O2 is consumed instead of CO2.',
    funFact: 'C4 plants like corn and sugarcane evolved a spatial bundle-sheath anatomical mechanism to concentrate CO2 and bypass photorespiration!'
  },
  {
    id: 'e3',
    level: 'expert',
    topic: 'Epigenetics & Histones',
    emoji: '🧬',
    question: 'What covalent DNA modification typically suppresses gene expression by blocking transcription factor binding to promoter regions?',
    options: ['Histone Acetylation 🔓', 'DNA Methylation (5-mC) 🔒', 'RNA Polyadenylation 🧵', 'Phosphorylation ⚡'],
    correctIndex: 1,
    explanation: 'Methylation of cytosine bases at CpG islands condenses chromatin structure into heterochromatin, silencing gene transcription.',
    hint: 'Addition of a methyl (-CH3) group directly to DNA cytosine bases.',
    funFact: 'Epigenetic marks are influenced by diet, stress, and environmental exposure and can sometimes be inherited across generations!'
  },
  {
    id: 'e4',
    level: 'expert',
    topic: 'Molecular Motors',
    emoji: '🔬',
    question: 'Which motor protein "walks" along microtubule tracks towards the PLUS (+) end to transport intracellular vesicles?',
    options: ['Myosin 🥩', 'Dynein 🚶‍♂️', 'Kinesin 🚶‍♀️', 'Actin 🧵'],
    correctIndex: 2,
    explanation: 'Kinesin uses ATP hydrolysis to step along microtubules towards the cell periphery (plus end), while Dynein walks towards the minus end.',
    hint: 'Starts with "K" and moves anterograde.',
    funFact: 'Kinesin takes ~8 nanometer hand-over-hand steps along tubulin dimers at speeds up to 80 steps per second!'
  },
  {
    id: 'e5',
    level: 'expert',
    topic: 'Ecosystem Trophic Cascade',
    emoji: '🐺',
    question: 'When gray wolves were re-introduced to Yellowstone National Park, deer behavior shifted, rivers stabilized, and forests regenerated—a classic example of a...?',
    options: ['Trophic Cascade 🌊', 'Competitive Exclusion 💥', 'Primary Succession 🌋', 'Genetic Drift 🎲'],
    correctIndex: 0,
    explanation: 'A top predator controls herbivore populations and grazing patterns, triggering dramatic indirect beneficial effects down through all ecological levels.',
    hint: 'A cascading ecosystem effect triggered from the top of the food web.',
    funFact: 'Wolves even changed the physical geography of Yellowstone’s rivers because regenerated riverbank trees prevented soil erosion!'
  },
  {
    id: 'e6',
    level: 'expert',
    topic: 'Apoptosis Programmed Cell Death',
    emoji: '🦠',
    question: 'Which family of cysteine protease enzymes acts as executioners in programmed cell death (apoptosis)?',
    options: ['Kinases ⚡', 'Casparases 👻', 'Caspases ⚔️', 'Polymerases 🧬'],
    correctIndex: 2,
    explanation: 'Caspases cleave specific cellular proteins, causing membrane blebbing, DNA fragmentation, and clean phagocytic removal.',
    hint: 'Cysteine-Aspartic Proteases.',
    funFact: 'Apoptosis shapes human fingers in the embryo by removing the webbing tissue between developing digits!'
  },
  {
    id: 'e7',
    level: 'expert',
    topic: 'Systematic Cladistics',
    emoji: '🦕',
    question: 'In evolutionary phylogenetic trees, a group containing a common ancestor and ALL of its descendants is termed...?',
    options: ['Monophyletic (Clade) 🌳', 'Paraphyletic 🎋', 'Polyphyletic 🌿', 'Analogous 🔀'],
    correctIndex: 0,
    explanation: 'A monophyletic taxon (clade) encompasses an ancestral node and every single evolutionary descendant lineage.',
    hint: '"Mono" means single or unified clade.',
    funFact: 'Modern cladistics classifies birds (Aves) as living avian dinosaurs within the monophyletic clade Theropoda!'
  },

  // --- LEVEL 5: LEGEND / ASTROBIOLOGIST & GAIA ORACLE (🌌 LEGENDARY) ---
  {
    id: 'l1',
    level: 'legend',
    topic: 'Abiogenesis & Primordial Chemistry',
    emoji: '🌋',
    question: 'The "RNA World Hypothesis" proposes that early life relied on RNA because RNA can serve as BOTH genetic code and enzymatic catalysts known as...?',
    options: ['Prions 🧠', 'Ribozymes 🧪', 'Coenzymes 💊', 'Liposomes 🫧'],
    correctIndex: 1,
    explanation: 'Ribozymes are catalytic RNA molecules capable of catalyzing biochemical reactions (like peptide bond synthesis in ribosomes) without proteins.',
    hint: 'Ribonucleic Acid + Enzymes.',
    funFact: 'The ribosome—the cellular protein factory—is fundamentally a ribozyme!'
  },
  {
    id: 'l2',
    level: 'legend',
    topic: 'Astrobiology & Extremophile Biosignatures',
    emoji: '🌌',
    question: 'Which microscopic tardigrade ("water bear") protein suppresses DNA damage from radiation and desiccation, enabling survival in outer space vacuum?',
    options: ['Dsup (Damage Suppressor) 🛡️', 'Ubiquitin 🏷️', 'Telomerase ⌛', 'Chaperonin 👔'],
    correctIndex: 0,
    explanation: 'Dsup binds to chromatin, creating a physical shield that protects tardigrade DNA from hydroxyl radiation radicals.',
    hint: 'Abbreviated Dsup.',
    funFact: 'Tardigrades survived 10 days in the open vacuum and cosmic radiation of space during the FOTON-M3 space mission!'
  },
  {
    id: 'l3',
    level: 'legend',
    topic: 'Endosymbiotic Evolutionary Theory',
    emoji: '🧬',
    question: 'Dr. Lynn Margulis pioneered the Serial Endosymbiotic Theory proving that mitochondria and chloroplasts originated from...?',
    options: ['Engulfed Prokaryotic Bacteria 🦠', 'Spontaneous Membrane Budding 🫧', 'Viral Genome Invasions 👾', 'Fungal Spore Fusion 🍄'],
    correctIndex: 0,
    explanation: 'Mitochondria evolved from engulfed aerobic alpha-proteobacteria, while chloroplasts evolved from engulfed photosynthetic cyanobacteria.',
    hint: 'Free-living single-celled bacteria swallowed by an ancestral eukaryotic host cell.',
    funFact: 'Chloroplasts and mitochondria still divide by binary fission inside eukaryotic cells, just like free bacteria!'
  },
  {
    id: 'l4',
    level: 'legend',
    topic: 'Synthetic Biology & Xenobiology',
    emoji: '🧫',
    question: 'What term describes artificial synthetic genetic codes built using non-canonical synthetic base pairs (like X and Y or d5SICS and dNaM)?',
    options: ['Expanded Genetic Alphabet 🧬', 'Recombinant Plasmid 🧪', 'Retroviral Transfection 🦠', 'Phage Display 🧫'],
    correctIndex: 0,
    explanation: 'Synthetic biologists created semi-synthetic organisms possessing 6-letter genetic codes (A, T, C, G, X, Y) capable of translating unnatural amino acids.',
    hint: 'Expanding DNA beyond the natural 4 letters.',
    funFact: 'An expanded genetic alphabet could allow organisms to synthesize designer proteins with 100+ unique synthetic amino acids!'
  },
  {
    id: 'l5',
    level: 'legend',
    topic: 'Geobiochemical Gaia Biosphere Hypothesis',
    emoji: '🪐',
    question: 'Formulated by James Lovelock and Lynn Margulis, the Gaia Hypothesis views the Earth’s biosphere as...?',
    options: ['A Self-Regulating Complex Superorganism 🌍', 'A Random Collection of Competing Species 🎲', 'An Invariant Static Mechanical Clock 🕰️', 'A Closed Non-evolving System ⏹️'],
    correctIndex: 0,
    explanation: 'The Gaia hypothesis proposes that living organisms closely interact with inorganic surroundings to maintain global homeostatic climate balance.',
    hint: 'Earth as a living, self-regulating biological planetary feedback system.',
    funFact: 'Oceanic phytoplankton release dimethyl sulfide (DMS) gas, which seeds clouds over oceans to cool global planetary surface temperature!'
  },
  {
    id: 'l6',
    level: 'legend',
    topic: 'Quantum Biology & Magnetoreception',
    emoji: '🦅',
    question: 'Which light-sensitive flavoprotein in avian eye retinas undergoes quantum radical pair entanglement to allow migratory birds to SEE Earth’s magnetic field lines?',
    options: ['Cryptochrome (Cry4) 👁️', 'Rhodopsin 🌗', 'Melanopsin 🌘', 'Phytochrome 🍃'],
    correctIndex: 0,
    explanation: 'Blue light striking Cryptochrome 4 creates a quantum-entangled radical pair of electrons whose spin state is sensitive to Earth’s magnetic field orientation.',
    hint: 'Crypto + chrome (hidden color sensor).',
    funFact: 'Migratory robins literally see Earth’s magnetic field lines as visual light patterns overlaid on their field of vision!'
  },
  {
    id: 'l7',
    level: 'legend',
    topic: 'Telomere Epigenetic Aging',
    emoji: '⌛',
    question: 'What ribonucleoprotein reverse transcriptase enzyme maintains eukaryotic chromosome caps to prevent cellular replicative senescence?',
    options: ['Telomerase 🧬', 'DNA Ligase 🧵', 'Topoisomerase 🌀', 'Helicase ✂️'],
    correctIndex: 0,
    explanation: 'Telomerase adds TTAGGG repeat sequences to the 3\' ends of chromosomes, counteracting the end-replication problem in stem cells and germ cells.',
    hint: 'Maintains telomeres at the tips of chromosomes.',
    funFact: 'Elizabeth Blackburn, Carol Greider, and Jack Szostak won the 2009 Nobel Prize for discovering how telomeres and telomerase protect chromosomes!'
  }
];

export interface BiologyEcosystemQuizProps {
  userTCoinBalance?: number;
  onRewardTCoins?: (earnedCoins: number) => void;
}

export function BiologyEcosystemQuiz({
  userTCoinBalance = 1250,
  onRewardTCoins
}: BiologyEcosystemQuizProps) {
  // Difficulty Level State
  const [selectedLevel, setSelectedLevel] = useState<DifficultyLevel>('newbie');
  
  // Game Modes
  const [isSpeedRunMode, setIsSpeedRunMode] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(20);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streakCount, setStreakCount] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);

  // Rewards & Floating Particle Effects
  const [tCoinsEarnedTotal, setTCoinsEarnedTotal] = useState<number>(0);
  const [floatingLeaves, setFloatingLeaves] = useState<{ id: number; left: number; delay: number; size: number }[]>([]);

  // Navigation Tab State
  const [activeTab, setActiveTab] = useState<'quiz' | 'streak' | 'leaderboard'>('quiz');

  // Daily Streak Bonus State
  const [dailyStreak, setDailyStreak] = useState<number>(1);
  const [lastStreakDate, setLastStreakDate] = useState<string>('');
  const [hasClaimedToday, setHasClaimedToday] = useState<boolean>(false);
  const [dailyStreakToast, setDailyStreakToast] = useState<string | null>(null);

  // Leaderboard State
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(DEFAULT_LEADERBOARD);
  const [playerName, setPlayerName] = useState<string>('');
  const [playerAvatar, setPlayerAvatar] = useState<string>('🔬');
  const [isSubmittedToLeaderboard, setIsSubmittedToLeaderboard] = useState<boolean>(false);
  const [submittingLeaderboard, setSubmittingLeaderboard] = useState<boolean>(false);

  // Check and sync Daily Streak on mount
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const savedStreakData = localStorage.getItem('bio_daily_streak_data');
    if (savedStreakData) {
      try {
        const parsed = JSON.parse(savedStreakData);
        const lastDate = parsed.lastStreakDate;
        const streak = parsed.dailyStreak || 1;

        if (lastDate === todayStr) {
          setHasClaimedToday(true);
          setDailyStreak(streak);
          setLastStreakDate(lastDate);
        } else {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];

          if (lastDate === yesterdayStr) {
            setDailyStreak(streak);
            setHasClaimedToday(false);
          } else {
            setDailyStreak(1);
            setHasClaimedToday(false);
          }
        }
      } catch {
        setDailyStreak(1);
      }
    }

    const docRef = doc(db, 'appState', 'biology_daily_streak');
    getDoc(docRef).then((snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.lastStreakDate === todayStr) {
          setHasClaimedToday(true);
          setDailyStreak(data.dailyStreak || 1);
        }
      }
    }).catch(() => {});
  }, []);

  // Fetch Global Leaderboard from Firestore
  useEffect(() => {
    const docRef = doc(db, 'appState', 'biology_leaderboard');
    getDoc(docRef)
      .then((snap) => {
        if (snap.exists() && snap.data().entries) {
          const fetchedEntries = snap.data().entries as LeaderboardEntry[];
          if (fetchedEntries.length > 0) {
            fetchedEntries.sort((a, b) => b.tCoins - a.tCoins);
            setLeaderboard(fetchedEntries);
          }
        }
      })
      .catch((err) => {
        handleFirestoreError(err, OperationType.GET, 'appState/biology_leaderboard');
      });
  }, []);

  // Handler for Claiming Daily Streak
  const handleClaimDailyStreak = () => {
    if (hasClaimedToday) return;
    playSoundEffect('complete');

    const todayStr = new Date().toISOString().split('T')[0];
    const currentDayIndex = ((dailyStreak - 1) % 7);
    const rewardCoins = STREAK_REWARDS[currentDayIndex].coins;

    const nextStreak = dailyStreak + 1;
    setDailyStreak(nextStreak);
    setLastStreakDate(todayStr);
    setHasClaimedToday(true);

    setTCoinsEarnedTotal((prev) => prev + rewardCoins);
    if (onRewardTCoins) onRewardTCoins(rewardCoins);

    const streakData = {
      dailyStreak: nextStreak,
      lastStreakDate: todayStr,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem('bio_daily_streak_data', JSON.stringify(streakData));

    const docRef = doc(db, 'appState', 'biology_daily_streak');
    setDoc(docRef, streakData, { merge: true }).catch((err) => {
      handleFirestoreError(err, OperationType.WRITE, 'appState/biology_daily_streak');
    });

    triggerFloatingLeavesShower();
    setDailyStreakToast(`🎉 Claimed Day ${currentDayIndex + 1} Bonus: +${rewardCoins} T-Coins!`);
    setTimeout(() => setDailyStreakToast(null), 4000);
  };

  // Handler for Submitting to Leaderboard
  const handleSubmitToLeaderboard = () => {
    if (!playerName.trim() || submittingLeaderboard) return;
    setSubmittingLeaderboard(true);
    playSoundEffect('complete');

    const newEntry: LeaderboardEntry = {
      id: Date.now().toString(),
      name: playerName.trim(),
      avatar: playerAvatar,
      levelTitle: LEVEL_META[selectedLevel].title,
      tCoins: userTCoinBalance + tCoinsEarnedTotal,
      score: score,
      streak: dailyStreak,
      timestamp: new Date().toISOString()
    };

    const updatedList = [...leaderboard, newEntry].sort((a, b) => b.tCoins - a.tCoins);
    setLeaderboard(updatedList);
    setIsSubmittedToLeaderboard(true);

    const docRef = doc(db, 'appState', 'biology_leaderboard');
    setDoc(docRef, { entries: updatedList }, { merge: true })
      .then(() => {
        setSubmittingLeaderboard(false);
        triggerFloatingLeavesShower();
      })
      .catch((err) => {
        setSubmittingLeaderboard(false);
        handleFirestoreError(err, OperationType.WRITE, 'appState/biology_leaderboard');
      });
  };

  // Web Audio Synthesizer for Sound Effects
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playTone = (freq: number, type: OscillatorType = 'sine', duration = 0.2, volume = 0.15) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio context fallback gracefully ignored
    }
  };

  const playSoundEffect = (effect: 'correct' | 'wrong' | 'complete' | 'click') => {
    if (effect === 'correct') {
      playTone(523.25, 'triangle', 0.15, 0.2); // C5
      setTimeout(() => playTone(659.25, 'triangle', 0.2, 0.2), 100); // E5
      setTimeout(() => playTone(783.99, 'triangle', 0.25, 0.25), 200); // G5
    } else if (effect === 'wrong') {
      playTone(220, 'sawtooth', 0.25, 0.2); // A3
      setTimeout(() => playTone(185, 'sawtooth', 0.35, 0.2), 150);
    } else if (effect === 'complete') {
      playTone(523.25, 'sine', 0.2);
      setTimeout(() => playTone(659.25, 'sine', 0.2), 120);
      setTimeout(() => playTone(783.99, 'sine', 0.2), 240);
      setTimeout(() => playTone(1046.50, 'sine', 0.5), 360); // C6
    } else if (effect === 'click') {
      playTone(400, 'sine', 0.05, 0.1);
    }
  };

  // Filter questions by selected level
  const activeQuestions = QUIZ_QUESTIONS.filter((q) => q.level === selectedLevel);
  const currentQ = activeQuestions[currentQuestionIndex] || activeQuestions[0];

  // Timer countdown for SpeedRun Mode
  useEffect(() => {
    if (!isSpeedRunMode || isAnswerSubmitted || quizCompleted) return;

    if (timeLeft <= 0) {
      // Time expired! Auto submit as wrong answer
      setIsAnswerSubmitted(true);
      setShowExplanation(true);
      setStreakCount(0);
      playSoundEffect('wrong');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isSpeedRunMode, timeLeft, isAnswerSubmitted, quizCompleted]);

  // Reset Timer when question changes
  useEffect(() => {
    setTimeLeft(selectedLevel === 'legend' ? 15 : selectedLevel === 'expert' ? 18 : 20);
  }, [currentQuestionIndex, selectedLevel]);

  // Plant Development Growth Stage (0 to 7)
  const correctCount = score;
  const totalQ = activeQuestions.length;
  const progressRatio = totalQ > 0 ? correctCount / totalQ : 0;
  
  let plantStageIndex = 0;
  if (progressRatio === 0) plantStageIndex = 0;
  else if (progressRatio <= 0.15) plantStageIndex = 1;
  else if (progressRatio <= 0.30) plantStageIndex = 2;
  else if (progressRatio <= 0.45) plantStageIndex = 3;
  else if (progressRatio <= 0.60) plantStageIndex = 4;
  else if (progressRatio <= 0.75) plantStageIndex = 5;
  else if (progressRatio < 1.0) plantStageIndex = 6;
  else plantStageIndex = 7;

  const PLANT_STAGES = [
    { title: 'Dormant Seed in Fertile Soil', emoji: '🌱', description: 'Nourish with biological answers to trigger enzymatic germination!' },
    { title: 'Sprouting Cotyledon', emoji: '🌱', description: 'Photosynthesis activated! Primary radicle anchoring in soil.' },
    { title: 'Vibrant Green Sprout', emoji: '🌿', description: 'Xylem & Phloem active! Rapid cellular mitosis expanding leaves.' },
    { title: 'Flowering Bio-Shrub', emoji: '🪴🌸', description: 'Budding blossoms! Pollinators & beneficial microbes uniting.' },
    { title: 'Young Forest Canopy Tree', emoji: '🌳', description: 'Deep root networks & tall canopy absorbing atmospheric carbon!' },
    { title: 'Fruiting Ecosystem Sanctuary', emoji: '🌳🍎', description: 'Yielding seeds & sweet fruit for birds, mammals, and soil fauna.' },
    { title: 'Ancient Rainforest Guardian', emoji: '🌲✨', description: 'Massive biodiversity sanctuary harboring thousands of species!' },
    { title: 'Cosmic Gaia Biosphere Matrix', emoji: '🌳✨🌌', description: 'Ultimate Ecological Oracle! Sponsoring reforestation across planet Earth!' }
  ];

  // Level Meta Information
  const LEVEL_META = {
    newbie: { title: 'Young Eco-Explorer', badge: '🌱 Junior Eco-Biologist', badgeEmoji: '🌱🔬🧪', coinMultiplier: 10, color: 'emerald' },
    junior: { title: 'Field Specialist', badge: '🌿 Field Bio Specialist', badgeEmoji: '🌿🔬🧬', coinMultiplier: 20, color: 'teal' },
    senior: { title: 'Eco-Master', badge: '🔬 Senior Master Biologist', badgeEmoji: '🔬🧪🧬', coinMultiplier: 30, color: 'cyan' },
    expert: { title: 'Genomic Mastermind', badge: '🧬 Genomic & Molecular Mastermind', badgeEmoji: '🧬✂️🔬', coinMultiplier: 50, color: 'amber' },
    legend: { title: 'Gaia Astrobiologist', badge: '🌌 Astrobiologist & Gaia Oracle', badgeEmoji: '🌌🪐🧬🏆', coinMultiplier: 100, color: 'purple' }
  };

  // Handle Option Selection
  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    playSoundEffect('click');
    setSelectedOptionIndex(index);
  };

  // Submit Answer
  const handleSubmitAnswer = () => {
    if (selectedOptionIndex === null || isAnswerSubmitted) return;

    setIsAnswerSubmitted(true);
    setShowExplanation(true);

    const isCorrect = selectedOptionIndex === currentQ.correctIndex;

    if (isCorrect) {
      playSoundEffect('correct');
      const newScore = score + 1;
      const newStreak = streakCount + 1;
      setScore(newScore);
      setStreakCount(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);

      // Award T-Coins for correct answer
      const baseCoin = LEVEL_META[selectedLevel].coinMultiplier;
      const speedBonus = isSpeedRunMode ? Math.floor(timeLeft * 1.5) : 0;
      const streakBonus = newStreak >= 3 ? newStreak * 5 : 0;
      const totalReward = baseCoin + speedBonus + streakBonus;

      setTCoinsEarnedTotal((prev) => prev + totalReward);
      if (onRewardTCoins) onRewardTCoins(totalReward);
    } else {
      playSoundEffect('wrong');
      setStreakCount(0);
    }
  };

  // Next Question or Finish Quiz
  const handleNextQuestion = () => {
    playSoundEffect('click');
    if (currentQuestionIndex + 1 < activeQuestions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
      setIsAnswerSubmitted(false);
      setShowExplanation(false);
      setShowHint(false);
    } else {
      // Quiz Complete!
      playSoundEffect('complete');
      setQuizCompleted(true);
      triggerFloatingLeavesShower();

      // Completion Jackpot Bonus
      const completionJackpot = LEVEL_META[selectedLevel].coinMultiplier * 10;
      setTCoinsEarnedTotal((prev) => prev + completionJackpot);
      if (onRewardTCoins) onRewardTCoins(completionJackpot);

      // Save completion badge record to Firestore
      const docRef = doc(db, 'appState', 'biology_quiz_completions');
      getDoc(docRef)
        .then((snap) => {
          const prevBadgeData = snap.exists() ? snap.data().completions || [] : [];
          const newRecord = {
            level: selectedLevel,
            score,
            totalQ: activeQuestions.length,
            isSpeedRunMode,
            timestamp: new Date().toISOString()
          };
          setDoc(docRef, { completions: [...prevBadgeData, newRecord] }, { merge: true }).catch(() => {});
        })
        .catch(() => {});
    }
  };

  // Particle Shower Generator
  const triggerFloatingLeavesShower = () => {
    const leavesArr = Array.from({ length: 35 }).map((_, i) => ({
      id: i,
      left: Math.random() * 95,
      delay: Math.random() * 2.5,
      size: Math.floor(Math.random() * 20) + 16
    }));
    setFloatingLeaves(leavesArr);
  };

  // Restart Quiz
  const handleRestartQuiz = () => {
    playSoundEffect('click');
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setStreakCount(0);
    setShowExplanation(false);
    setShowHint(false);
    setQuizCompleted(false);
    setFloatingLeaves([]);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 pb-12 font-sans select-none relative overflow-hidden">
      
      {/* ANIMATED FLOATING MICROSCOPIC EMOJI CELLS & LEAVES IN BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-20">
        <div className="absolute top-12 left-10 text-4xl animate-bounce duration-1000">🔬</div>
        <div className="absolute top-1/4 right-16 text-5xl animate-pulse duration-700">🦠</div>
        <div className="absolute bottom-1/3 left-1/4 text-4xl animate-spin-slow">🧬</div>
        <div className="absolute bottom-12 right-1/3 text-5xl animate-bounce">🧫</div>
        <div className="absolute top-1/3 left-1/2 text-3xl animate-pulse">🌱</div>
        <div className="absolute bottom-20 left-12 text-4xl animate-spin-slow">🍃</div>
        <div className="absolute top-2/3 right-1/4 text-4xl animate-pulse">🌌</div>
      </div>

      {/* FLOATING LEAF CELEBRATION SHOWER ON COMPLETION */}
      {floatingLeaves.map((leaf) => (
        <div
          key={leaf.id}
          style={{
            left: `${leaf.left}%`,
            animationDelay: `${leaf.delay}s`,
            fontSize: `${leaf.size}px`
          }}
          className="fixed top-0 z-50 pointer-events-none animate-fallLeaves"
        >
          🍃
        </div>
      ))}

      {/* DAILY STREAK TOAST NOTIFICATION */}
      {dailyStreakToast && (
        <div className="fixed top-6 right-6 z-50 p-4 bg-amber-500 text-stone-950 rounded-2xl shadow-2xl font-mono text-xs font-black flex items-center gap-2 animate-bounce border-2 border-amber-300">
          <Gift className="w-5 h-5 text-stone-950" />
          <span>{dailyStreakToast}</span>
        </div>
      )}

      {/* TOP NAVIGATION TABS: QUIZ, DAILY STREAK, LEADERBOARD */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-stone-900/90 border border-emerald-500/40 p-2.5 rounded-2xl shadow-xl relative z-20 backdrop-blur-md">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl font-mono text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'quiz'
                ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-stone-950 shadow-md scale-105 font-bold'
                : 'text-stone-300 hover:text-white bg-stone-950/80'
            }`}
          >
            <Brain className="w-4 h-4 text-emerald-400" />
            <span>🎮 Interactive Quiz</span>
          </button>

          <button
            onClick={() => setActiveTab('streak')}
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl font-mono text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer relative ${
              activeTab === 'streak'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-stone-950 shadow-md scale-105 font-bold'
                : 'text-stone-300 hover:text-white bg-stone-950/80'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>🔥 Daily Streak Rewards</span>
            {!hasClaimedToday && (
              <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping absolute -top-1 -right-1" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl font-mono text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'leaderboard'
                ? 'bg-gradient-to-r from-purple-400 to-indigo-400 text-stone-950 shadow-md scale-105 font-bold'
                : 'text-stone-300 hover:text-white bg-stone-950/80'
            }`}
          >
            <Trophy className="w-4 h-4 text-yellow-300" />
            <span>🏆 Leaderboard</span>
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="px-3.5 py-1.5 bg-stone-950 rounded-xl border border-amber-500/40 text-amber-300 font-bold flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>{dailyStreak} Day Streak 🔥</span>
          </div>
        </div>
      </div>

      {/* DAILY STREAK REWARDS TAB CONTENT */}
      {activeTab === 'streak' && (
        <div className="relative z-10 p-6 sm:p-8 bg-stone-900 border border-amber-500/40 rounded-3xl shadow-2xl space-y-8 animate-fadeIn text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-1">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Daily Eco-Streak Bonus Matrix</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
                7-Day Consecutive Learning Bonus
              </h2>
              <p className="text-xs text-stone-300 font-mono mt-1">
                Log in every day to collect increasing T-Coin rewards and unlock the Gaia Oracle Jackpot on Day 7!
              </p>
            </div>

            <button
              onClick={handleClaimDailyStreak}
              disabled={hasClaimedToday}
              className={`px-6 py-3 rounded-2xl font-mono font-black text-xs transition-all flex items-center gap-2 cursor-pointer shadow-xl ${
                hasClaimedToday
                  ? 'bg-stone-800 text-stone-500 border border-stone-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-stone-950 hover:scale-105 shadow-amber-500/20'
              }`}
            >
              <Gift className="w-5 h-5 text-stone-950" />
              <span>{hasClaimedToday ? 'Already Claimed Today ✓' : 'Claim Today\'s Streak Bonus 🎁'}</span>
            </button>
          </div>

          {/* 7-DAY REWARD PROGRESS CARDS GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {STREAK_REWARDS.map((reward) => {
              const currentDayIndex = ((dailyStreak - 1) % 7);
              const isToday = reward.day - 1 === currentDayIndex;
              const isPast = reward.day - 1 < currentDayIndex;

              return (
                <div
                  key={reward.day}
                  className={`p-4 rounded-2xl border text-center font-mono space-y-2 relative overflow-hidden transition-all ${
                    isToday
                      ? 'bg-gradient-to-b from-amber-950 to-stone-900 border-2 border-amber-400 shadow-xl scale-105'
                      : isPast
                      ? 'bg-stone-950/80 border-emerald-500/40 opacity-80'
                      : 'bg-stone-950/40 border-stone-800'
                  }`}
                >
                  <div className="text-[10px] text-stone-400 font-bold uppercase">
                    Day {reward.day}
                  </div>
                  <div className="text-3xl my-1 animate-bounce">
                    {reward.emoji}
                  </div>
                  <div className="text-sm font-black text-amber-300">
                    +{reward.coins} T
                  </div>
                  <div className="text-[10px] text-stone-400 truncate">
                    {reward.label}
                  </div>
                  {isToday && !hasClaimedToday && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
                  )}
                  {isPast && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute top-2 right-2" />
                  )}
                </div>
              );
            })}
          </div>

          {/* STREAK MULTIPLIER & PERKS BANNER */}
          <div className="p-5 bg-gradient-to-r from-emerald-950/80 via-stone-900 to-teal-950/80 rounded-2xl border border-emerald-500/40 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/60 flex items-center justify-center text-2xl shrink-0">
                ⚡
              </div>
              <div>
                <strong className="text-amber-300 block text-sm font-bold">Streak Reward Multiplier: Active</strong>
                <span className="text-stone-300">
                  Your current streak ({dailyStreak} days) grants a bonus on all correct biology quiz answers!
                </span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-xl font-black text-amber-400 font-mono">
                +{(dailyStreak * 5)} Bonus T/Q
              </div>
              <span className="text-[10px] text-stone-400">Streak Level Perk</span>
            </div>
          </div>
        </div>
      )}

      {/* GLOBAL LEADERBOARD TAB CONTENT */}
      {activeTab === 'leaderboard' && (
        <div className="relative z-10 p-6 sm:p-8 bg-stone-900 border border-purple-500/40 rounded-3xl shadow-2xl space-y-8 animate-fadeIn text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-400 uppercase tracking-wider mb-1">
                <Trophy className="w-4 h-4 text-yellow-300" />
                <span>Global Bio-Ecosystem Hall of Fame</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
                Top Biologists & Eco-Warriors
              </h2>
              <p className="text-xs text-stone-300 font-mono mt-1">
                Ranked by lifetime T-Coins collected, quiz scores, and daily learning streaks.
              </p>
            </div>
          </div>

          {/* SUBMIT SCORE FORM CARD */}
          <div className="p-5 bg-stone-950 rounded-2xl border border-purple-500/30 space-y-4">
            <h3 className="text-sm font-bold font-mono text-purple-300 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-purple-400" />
              <span>Submit / Update Your Leaderboard Entry</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-stone-400 text-[10px] uppercase font-bold block">Your Scientist Name / Handle</label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="e.g. Dr. Rosalind, EcoMaster_99"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white placeholder-stone-500 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-stone-400 text-[10px] uppercase font-bold block">Choose Emoji Badge</label>
                <select
                  value={playerAvatar}
                  onChange={(e) => setPlayerAvatar(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white focus:outline-none focus:border-purple-400"
                >
                  <option value="🔬">🔬 Microscope</option>
                  <option value="🧬">🧬 DNA</option>
                  <option value="🌳">🌳 Tree</option>
                  <option value="🧫">🧫 Petri Dish</option>
                  <option value="🦁">🦁 Fauna</option>
                  <option value="👑">👑 Crown</option>
                  <option value="🌌">🌌 Astrobiology</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSubmitToLeaderboard}
                disabled={!playerName.trim() || submittingLeaderboard}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 disabled:opacity-50 text-white font-mono font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>{isSubmittedToLeaderboard ? 'Updated Entry ✓' : 'Submit to Global Leaderboard 🚀'}</span>
              </button>
            </div>
          </div>

          {/* LEADERBOARD ENTRIES TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="border-b border-stone-800 text-stone-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Biologist</th>
                  <th className="py-3 px-4">Title Tier</th>
                  <th className="py-3 px-4 text-right">T-Coins</th>
                  <th className="py-3 px-4 text-right">Quiz Score</th>
                  <th className="py-3 px-4 text-right">Streak</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60">
                {leaderboard.map((entry, index) => {
                  const rank = index + 1;
                  let rankBadge = `${rank}`;
                  let rowBg = 'hover:bg-stone-800/40';

                  if (rank === 1) {
                    rankBadge = '🥇 1st';
                    rowBg = 'bg-amber-950/30 border-l-4 border-amber-400';
                  } else if (rank === 2) {
                    rankBadge = '🥈 2nd';
                    rowBg = 'bg-stone-800/30 border-l-4 border-stone-400';
                  } else if (rank === 3) {
                    rankBadge = '🥉 3rd';
                    rowBg = 'bg-amber-900/20 border-l-4 border-amber-600';
                  }

                  return (
                    <tr key={entry.id || index} className={`transition-colors ${rowBg}`}>
                      <td className="py-3.5 px-4 font-bold text-amber-300 whitespace-nowrap">
                        {rankBadge}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2 whitespace-nowrap">
                        <span className="text-xl">{entry.avatar}</span>
                        <span>{entry.name}</span>
                      </td>
                      <td className="py-3.5 px-4 text-emerald-400 font-bold whitespace-nowrap">
                        {entry.levelTitle}
                      </td>
                      <td className="py-3.5 px-4 text-right font-black text-amber-400 whitespace-nowrap">
                        +{entry.tCoins.toLocaleString()} T
                      </td>
                      <td className="py-3.5 px-4 text-right text-stone-300 whitespace-nowrap">
                        {entry.score} pts
                      </td>
                      <td className="py-3.5 px-4 text-right text-amber-300 font-bold whitespace-nowrap">
                        {entry.streak} 🔥
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* QUIZ CONTENT ONLY SHOWN WHEN activeTab === 'quiz' */}
      {activeTab === 'quiz' && (
        <>
          {/* HERO BANNER & LEVEL SELECTOR (CANVA / ZENQUIZ STYLING) */}
          <div className="relative z-10 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-teal-950 to-stone-950 text-white p-6 sm:p-10 border border-emerald-500/40 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider">
                🌱 🦠 🧫 🧬 ZenQuiz Biological Ecosystem
              </span>

              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-white transition-all cursor-pointer flex items-center gap-1 text-xs font-mono"
                title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-stone-500" />}
                <span>{soundEnabled ? 'Sound ON' : 'Muted'}</span>
              </button>

              <button
                onClick={() => { setIsSpeedRunMode(!isSpeedRunMode); handleRestartQuiz(); }}
                className={`px-3 py-1 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSpeedRunMode 
                    ? 'bg-amber-500 text-stone-950 border-amber-300 shadow-md font-black' 
                    : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-white'
                }`}
              >
                <Timer className="w-4 h-4" />
                <span>SpeedRun Mode ⚡</span>
              </button>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight font-display text-white">
              Interactive Biology & Eco-Mastery Quiz
            </h1>

            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              Explore cell structures 🦠, photosynthesis 🌱, gene editing 🧬, and astrobiology 🌌 across <strong>5 mastery tiers</strong>. Correct answers nurture your living plant and award <strong className="text-amber-300">T-Coins</strong> to fund real Tree-Nation reforestation!
            </p>

            {/* 5 DIFFICULTY LEVEL SELECTOR TABS */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {(['newbie', 'junior', 'senior', 'expert', 'legend'] as DifficultyLevel[]).map((lvl) => {
                const meta = LEVEL_META[lvl];
                const isActive = selectedLevel === lvl;
                return (
                  <button
                    key={lvl}
                    onClick={() => { setSelectedLevel(lvl); handleRestartQuiz(); }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 text-stone-950 font-black shadow-lg scale-105'
                        : 'bg-stone-900/90 text-stone-300 hover:bg-stone-800 border border-stone-800'
                    }`}
                  >
                    <span>{meta.badgeEmoji.split(' ')[0]}</span>
                    <span>{meta.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* User Score & Streak Stats Card */}
          <div className="bg-stone-900/90 border border-emerald-500/50 p-5 rounded-2xl text-right min-w-[220px] shadow-2xl backdrop-blur-md space-y-3 shrink-0 w-full md:w-auto">
            <div>
              <div className="text-[10px] text-stone-400 font-mono font-bold uppercase tracking-wider">Quiz Treasury Earned</div>
              <div className="text-3xl font-black text-amber-400 font-mono mt-0.5 flex items-center justify-end gap-1.5">
                <Coins className="w-6 h-6 text-amber-400 animate-bounce" />
                <span>+{tCoinsEarnedTotal} T</span>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-xs font-mono">
              <span className="text-stone-400">Current Streak:</span>
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
                <span>{streakCount} 🔥</span>
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-stone-400 pt-1">
              <span>Level Multiplier:</span>
              <span className="text-emerald-400 font-bold">+{LEVEL_META[selectedLevel].coinMultiplier} T/Q</span>
            </div>
          </div>
        </div>
      </div>

      {/* GROWING PLANT DEVELOPMENT PROGRESS TRACKER */}
      <div className="relative z-10 p-6 bg-gradient-to-r from-emerald-950/80 via-stone-900 to-teal-950/80 rounded-3xl border border-emerald-500/40 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-4xl shadow-inner animate-pulse shrink-0">
              {PLANT_STAGES[plantStageIndex].emoji}
            </div>
            <div>
              <div className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span>Living Bio-Growth Tracker</span>
                <span>•</span>
                <span>Stage {plantStageIndex + 1} of 8</span>
              </div>
              <h3 className="text-lg font-black text-white font-display">
                {PLANT_STAGES[plantStageIndex].title}
              </h3>
              <p className="text-xs text-stone-300 font-mono">
                {PLANT_STAGES[plantStageIndex].description}
              </p>
            </div>
          </div>

          <div className="text-right font-mono text-xs text-emerald-300 font-bold">
            <div>Score: {score} / {totalQ} Correct</div>
            <div className="text-[10px] text-stone-400 font-normal mt-0.5">
              Eco-Growth: {Math.round(progressRatio * 100)}%
            </div>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-stone-950 rounded-full h-4 p-0.5 border border-emerald-500/30 overflow-hidden relative">
          <div
            style={{ width: `${Math.max(6, progressRatio * 100)}%` }}
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 rounded-full transition-all duration-700 shadow-md relative"
          >
            <span className="absolute right-1 top-0 bottom-0 text-[10px] font-mono font-bold text-stone-950 flex items-center">
              🌿
            </span>
          </div>
        </div>
      </div>

      {/* MAIN INTERACTIVE QUIZ CONTAINER */}
      {!quizCompleted ? (
        <div className="relative z-10 p-6 sm:p-8 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-lg space-y-6">
          
          {/* Question Header & SpeedRun Timer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-100 dark:border-stone-800">
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-emerald-100 dark:bg-emerald-950 rounded-2xl text-2xl border border-emerald-300 dark:border-emerald-800">
                {currentQ.emoji}
              </span>
              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                  Question {currentQuestionIndex + 1} of {activeQuestions.length} • {currentQ.topic}
                </span>
                <span className="text-xs font-mono text-stone-500 dark:text-stone-400 font-bold">
                  Tier: {LEVEL_META[selectedLevel].title.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isSpeedRunMode && (
                <div className={`px-3 py-1.5 rounded-xl font-mono text-xs font-black flex items-center gap-1.5 border ${
                  timeLeft <= 5 
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500 animate-ping' 
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                }`}>
                  <Timer className="w-4 h-4 text-amber-400" />
                  <span>{timeLeft}s remaining</span>
                </div>
              )}

              <button
                onClick={() => setShowHint(!showHint)}
                className="px-3 py-1.5 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-mono text-xs font-bold rounded-xl hover:bg-amber-200 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Brain className="w-4 h-4 text-amber-500" />
                <span>{showHint ? 'Hide Hint' : 'Dr. T Hint 💡'}</span>
              </button>
            </div>
          </div>

          {/* Hint Card */}
          {showHint && (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700/60 rounded-2xl text-xs font-mono text-amber-900 dark:text-amber-200 leading-relaxed flex items-start gap-2.5 animate-fadeIn">
              <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Dr. T's Socratic Biology Hint:</strong>
                <p>{currentQ.hint}</p>
              </div>
            </div>
          )}

          {/* Question Prompt */}
          <div className="space-y-2">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-stone-900 dark:text-white font-display leading-snug">
              {currentQ.question}
            </h2>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOptionIndex === idx;
              const isCorrectOption = idx === currentQ.correctIndex;

              let buttonStyles = 'bg-stone-50 dark:bg-stone-800/80 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700 hover:border-emerald-500';

              if (isAnswerSubmitted) {
                if (isCorrectOption) {
                  buttonStyles = 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-100 border-2 border-emerald-500 shadow-md font-bold';
                } else if (isSelected) {
                  buttonStyles = 'bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-100 border-2 border-rose-500';
                } else {
                  buttonStyles = 'opacity-50 bg-stone-100 dark:bg-stone-800/40 border-stone-200 dark:border-stone-800';
                }
              } else if (isSelected) {
                buttonStyles = 'bg-emerald-500 text-stone-950 border-2 border-emerald-400 font-bold shadow-md';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswerSubmitted}
                  className={`p-4 rounded-2xl border text-left font-mono text-xs transition-all flex items-center justify-between gap-3 cursor-pointer ${buttonStyles}`}
                >
                  <span className="font-bold">{option}</span>
                  {isAnswerSubmitted && isCorrectOption && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  )}
                  {isAnswerSubmitted && isSelected && !isCorrectOption && (
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Answer Feedback & Explanation Card */}
          {showExplanation && (
            <div className={`p-5 rounded-2xl border text-xs font-mono space-y-2.5 animate-fadeIn ${
              selectedOptionIndex === currentQ.correctIndex
                ? 'bg-emerald-950/90 border-emerald-500 text-emerald-100'
                : 'bg-rose-950/90 border-rose-500 text-rose-100'
            }`}>
              <div className="flex items-center gap-2 font-bold text-sm">
                {selectedOptionIndex === currentQ.correctIndex ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>CORRECT! +{LEVEL_META[selectedLevel].coinMultiplier} T-Coins 🌱</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-400" />
                    <span>INCORRECT — Keep Exploring!</span>
                  </>
                )}
              </div>

              <p className="leading-relaxed text-stone-200">
                {currentQ.explanation}
              </p>

              {currentQ.funFact && (
                <div className="pt-2 border-t border-emerald-800/60 text-[11px] text-amber-300 font-mono flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Fun Bio Fact:</strong> {currentQ.funFact}</span>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-between border-t border-stone-100 dark:border-stone-800">
            <span className="text-xs font-mono text-stone-400">
              Score: {score} / {activeQuestions.length}
            </span>

            {!isAnswerSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOptionIndex === null}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-mono font-bold text-xs rounded-2xl transition-all shadow-md cursor-pointer flex items-center gap-2"
              >
                <span>Submit Answer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 hover:from-emerald-400 hover:to-amber-300 text-stone-950 font-mono font-black text-xs rounded-2xl transition-all shadow-lg cursor-pointer flex items-center gap-2 hover:scale-105"
              >
                <span>{currentQuestionIndex + 1 < activeQuestions.length ? 'Next Question 🌿' : 'Claim Certificate & Badges 🏆'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      ) : (
        /* QUIZ COMPLETED CELEBRATION BADGE DISPLAY */
        <div className="relative z-10 p-8 bg-gradient-to-br from-emerald-950 via-stone-950 to-teal-950 text-white rounded-3xl border-2 border-emerald-500 shadow-2xl text-center space-y-6 animate-fadeIn">
          <div className="inline-flex p-4 bg-emerald-500/20 rounded-full border-2 border-emerald-400 text-6xl animate-bounce">
            🍃 🔬 🏆
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl font-black font-display text-white">
              Quiz Completed! Master Biologist Status Unlocked!
            </h2>
            <p className="text-stone-300 font-mono text-xs sm:text-sm max-w-xl mx-auto">
              You scored <strong className="text-emerald-400">{score} / {activeQuestions.length}</strong> on <span className="uppercase text-amber-300 font-bold">{LEVEL_META[selectedLevel].title}</span> difficulty level!
            </p>
          </div>

          {/* OFFICIAL CERTIFIED BIOLOGIST DIGITAL BADGE CARD */}
          <div className="p-6 bg-stone-900/90 rounded-2xl border-2 border-amber-500/60 max-w-lg mx-auto space-y-4 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />

            <div className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Official Certified Digital Science Badge</span>
            </div>
            
            <div className="text-2xl sm:text-3xl font-black font-display text-amber-300 flex items-center justify-center gap-2">
              <span>{LEVEL_META[selectedLevel].badgeEmoji}</span>
              <span>{LEVEL_META[selectedLevel].badge}</span>
            </div>

            <p className="text-xs font-mono text-emerald-300">
              Validated by Dr. T Mother Nature Global Ecological Foundation
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
              <div className="p-2.5 bg-stone-950 rounded-xl border border-stone-800">
                <span className="text-stone-400 block text-[10px]">Max Streak</span>
                <span className="text-amber-400 font-bold">{maxStreak} 🔥</span>
              </div>

              <div className="p-2.5 bg-stone-950 rounded-xl border border-stone-800">
                <span className="text-stone-400 block text-[10px]">Treasury Awarded</span>
                <span className="text-amber-400 font-bold">+{tCoinsEarnedTotal} T-Coins</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={handleRestartQuiz}
              className="w-full sm:w-auto px-6 py-3 bg-stone-800 hover:bg-stone-700 text-stone-200 font-mono font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Again</span>
            </button>

            <a
              href="https://tree-nation.com/projects"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 hover:from-emerald-300 hover:to-amber-300 text-stone-950 font-mono font-black text-xs rounded-xl transition-all shadow-xl flex items-center justify-center gap-2 hover:scale-105 cursor-pointer"
            >
              <Trees className="w-4 h-4" />
              <span>Convert T-Coins to Real Trees on Tree-Nation</span>
            </a>
          </div>
        </div>
      )}
        </>
      )}

    </div>
  );
}
