import { MakeupShade, HairColorOption, AccessoryOption, RetailProduct, FashionOutfitConcept, SkinDiagnosticReport } from './types';

export const MAKEUP_SHADES: MakeupShade[] = [
  // Lipsticks
  { id: 'lip-1', name: 'Velvet Rosewood', hex: '#A84351', finish: 'matte', brand: 'YouCam Couture', price: 34, category: 'lipstick', undertone: 'cool', rating: 4.9, inStock: true },
  { id: 'lip-2', name: 'Crimson Bordeaux', hex: '#800020', finish: 'satin', brand: 'Luxe Perfect', price: 38, category: 'lipstick', undertone: 'neutral', rating: 4.8, inStock: true },
  { id: 'lip-3', name: 'Nude Cashmere', hex: '#C27C6B', finish: 'matte', brand: 'SkinSync AR', price: 29, category: 'lipstick', undertone: 'warm', rating: 4.9, inStock: true },
  { id: 'lip-4', name: 'Sunset Terracotta', hex: '#D26046', finish: 'glossy', brand: 'Solaris Beauty', price: 32, category: 'lipstick', undertone: 'warm', rating: 4.7, inStock: true },
  { id: 'lip-5', name: 'Glacial Fuchsia', hex: '#DE3163', finish: 'metallic', brand: 'CyberLuxe AR', price: 36, category: 'lipstick', undertone: 'cool', rating: 4.8, inStock: true },
  { id: 'lip-6', name: 'Black Cherry Glaze', hex: '#58111A', finish: 'glossy', brand: 'Nocturne Labs', price: 42, category: 'lipstick', undertone: 'cool', rating: 4.9, inStock: true },
  
  // Blushes
  { id: 'blush-1', name: 'Peachy Sunrise', hex: '#F88379', finish: 'satin', brand: 'YouCam Couture', price: 36, category: 'blush', undertone: 'warm', rating: 4.8, inStock: true },
  { id: 'blush-2', name: 'Petal Infusion', hex: '#E68FAC', finish: 'matte', brand: 'SkinSync AR', price: 34, category: 'blush', undertone: 'cool', rating: 4.9, inStock: true },
  { id: 'blush-3', name: 'Sun-Drenched Bronze', hex: '#CD7F32', finish: 'shimmer', brand: 'Solaris Beauty', price: 38, category: 'blush', undertone: 'warm', rating: 4.7, inStock: true },
  { id: 'blush-4', name: 'Mauve Whisper', hex: '#B784A7', finish: 'satin', brand: 'Luxe Perfect', price: 35, category: 'blush', undertone: 'neutral', rating: 4.9, inStock: true },

  // Eyeshadows
  { id: 'eye-1', name: 'Champagne Shimmer', hex: '#F7E7CE', finish: 'shimmer', brand: 'YouCam Couture', price: 45, category: 'eyeshadow', undertone: 'neutral', rating: 4.9, inStock: true },
  { id: 'eye-2', name: 'Smoky Amethyst', hex: '#5D3954', finish: 'matte', brand: 'Luxe Perfect', price: 48, category: 'eyeshadow', undertone: 'cool', rating: 4.8, inStock: true },
  { id: 'eye-3', name: 'Copper Horizon', hex: '#B87333', finish: 'metallic', brand: 'Solaris Beauty', price: 46, category: 'eyeshadow', undertone: 'warm', rating: 4.9, inStock: true },
  { id: 'eye-4', name: 'Midnight Emerald', hex: '#1B4D3E', finish: 'shimmer', brand: 'CyberLuxe AR', price: 52, category: 'eyeshadow', undertone: 'cool', rating: 4.7, inStock: true },

  // Foundations
  { id: 'fnd-1', name: 'Porcelain Neutral 10N', hex: '#FBEBE1', finish: 'satin', brand: 'SkinSync AI', price: 54, category: 'foundation', undertone: 'neutral', rating: 4.9, inStock: true },
  { id: 'fnd-2', name: 'Sand Warm 25W', hex: '#F0D5BE', finish: 'matte', brand: 'SkinSync AI', price: 54, category: 'foundation', undertone: 'warm', rating: 4.9, inStock: true },
  { id: 'fnd-3', name: 'Golden Honey 40W', hex: '#E0B58B', finish: 'satin', brand: 'SkinSync AI', price: 54, category: 'foundation', undertone: 'warm', rating: 4.8, inStock: true },
  { id: 'fnd-4', name: 'Rich Chestnut 60C', hex: '#9E6746', finish: 'satin', brand: 'SkinSync AI', price: 54, category: 'foundation', undertone: 'cool', rating: 4.9, inStock: true },
  { id: 'fnd-5', name: 'Espresso Deep 80N', hex: '#543424', finish: 'matte', brand: 'SkinSync AI', price: 54, category: 'foundation', undertone: 'neutral', rating: 4.9, inStock: true },
];

export const HAIR_COLORS: HairColorOption[] = [
  { id: 'hair-1', name: 'Midnight Obsidian', primaryHex: '#121212', style: 'solid', vibrancy: 85, shine: 90, category: 'natural' },
  { id: 'hair-2', name: 'Caramel Macchiato Balayage', primaryHex: '#3D2314', secondaryHex: '#C68B59', style: 'balayage', vibrancy: 92, shine: 95, category: 'brunette' },
  { id: 'hair-3', name: 'Nordic Platinum Blonde', primaryHex: '#EAE6DF', secondaryHex: '#D6CFBF', style: 'highlights', vibrancy: 95, shine: 88, category: 'blonde' },
  { id: 'hair-4', name: 'Molten Copper Ombré', primaryHex: '#4A1C0B', secondaryHex: '#D35400', style: 'ombre', vibrancy: 98, shine: 94, category: 'red' },
  { id: 'hair-5', name: 'Cyber Neon Lilac', primaryHex: '#8E44AD', secondaryHex: '#E8D0F5', style: 'two-tone', vibrancy: 99, shine: 92, category: 'vivid' },
  { id: 'hair-6', name: 'Rose Gold Shimmer', primaryHex: '#B76E79', secondaryHex: '#FADBD8', style: 'balayage', vibrancy: 90, shine: 96, category: 'pastel' },
  { id: 'hair-7', name: 'Cobalt Celestial Blue', primaryHex: '#1F3A60', secondaryHex: '#3498DB', style: 'ombre', vibrancy: 96, shine: 91, category: 'vivid' },
];

export const ACCESSORY_OPTIONS: AccessoryOption[] = [
  { id: 'acc-1', name: 'Aero Minimalist Titanium Frames', category: 'eyewear', frameShape: 'round', metalColor: '#8E9297', brand: 'YouCam Vision AR', price: 285, arModelType: 'eyewear-titanium' },
  { id: 'acc-2', name: 'Onyx Bold Wayfarer Solar', category: 'eyewear', frameShape: 'wayfarer', metalColor: '#1A1A1A', brand: 'Perfect Eyewear', price: 240, arModelType: 'eyewear-wayfarer' },
  { id: 'acc-3', name: 'Aurelia 18K Gold Geometric', category: 'eyewear', frameShape: 'geometric', metalColor: '#D4AF37', brand: 'Luxe AR Optic', price: 360, arModelType: 'eyewear-gold' },
  { id: 'acc-4', name: 'Cascade Solitaire Diamond Drop Earrings', category: 'earrings', metalColor: '#E5E4E2', gemstoneColor: '#F0F8FF', brand: 'Veritas Haute Joaillerie', price: 1450, arModelType: 'earrings-diamond' },
  { id: 'acc-5', name: 'Helios Twisted Gold Huggies', category: 'earrings', metalColor: '#FFD700', brand: 'YouCam Jewelry', price: 380, arModelType: 'earrings-gold-hoop' },
  { id: 'acc-6', name: 'Constellation Choker & Diamond Pendant', category: 'necklace', metalColor: '#E5E4E2', gemstoneColor: '#50C878', brand: 'Veritas Haute Joaillerie', price: 2200, arModelType: 'necklace-choker' },
];

export const DEFAULT_SKIN_REPORT: SkinDiagnosticReport = {
  overallHealthScore: 88,
  chronologicalAge: 32,
  biologicalSkinAge: 28,
  skinType: 'combination',
  undertone: 'neutral',
  metrics: {
    wrinkles: { id: 'wrinkles', name: 'Wrinkles & Expression Lines', score: 91, severity: 'optimal', clinicalDescription: 'Minimal periorbital micro-creasing, excellent dermal matrix support.', recommendedIngredients: ['Copper Tripeptide-1', 'Matrixyl 3000', 'Encapsulated Retinal'], zoneCoordinates: [{ x: 38, y: 44, radius: 12 }, { x: 62, y: 44, radius: 12 }], historicalDelta: 3 },
    spots: { id: 'spots', name: 'Hyperpigmentation & UV Spots', score: 82, severity: 'mild', clinicalDescription: 'Faint localized melanin clusters across upper cheekbones.', recommendedIngredients: ['Tranexamic Acid 3%', 'Alpha Arbutin', 'Stabilized L-Ascorbic Acid'], zoneCoordinates: [{ x: 32, y: 52, radius: 14 }, { x: 68, y: 52, radius: 14 }], historicalDelta: 2 },
    texture: { id: 'texture', name: 'Surface Texture & Smoothness', score: 87, severity: 'optimal', clinicalDescription: 'Uniform epidermal cell turnover with fine cellular alignment.', recommendedIngredients: ['Polyhydroxy Acids (PHA)', 'Galactomyces Ferment', 'Ectoin'], zoneCoordinates: [{ x: 50, y: 58, radius: 20 }], historicalDelta: 5 },
    darkCircles: { id: 'darkCircles', name: 'Periorbital Dark Circles', score: 76, severity: 'mild', clinicalDescription: 'Subtle vascular pooling in tear troughs from screen fatigue.', recommendedIngredients: ['Caffeine 5% + EGCG', 'Vitamin K Oxide', 'Palmitoyl Tetrapeptide-7'], zoneCoordinates: [{ x: 40, y: 46, radius: 10 }, { x: 60, y: 46, radius: 10 }], historicalDelta: -1 },
    radiance: { id: 'radiance', name: 'Luminosity & Subsurface Glow', score: 93, severity: 'optimal', clinicalDescription: 'Exceptional light refraction and homogeneous skin radiance.', recommendedIngredients: ['Niacinamide 5%', 'Glutathione', 'Pearl Bio-Ferment'], zoneCoordinates: [{ x: 50, y: 48, radius: 25 }], historicalDelta: 6 },
    hydration: { id: 'hydration', name: 'Stratum Corneum Moisture', score: 89, severity: 'optimal', clinicalDescription: 'Robust transepidermal barrier hydration index (>85%).', recommendedIngredients: ['Multi-Molecular Hyaluronic Acid', 'Beta-Glucan', 'Ceramide NP/AP/EOP'], zoneCoordinates: [{ x: 50, y: 50, radius: 28 }], historicalDelta: 4 },
    redness: { id: 'redness', name: 'Erythema & Vascular Sensitivity', score: 84, severity: 'mild', clinicalDescription: 'Mild transient micro-capillary flush around nasal alae.', recommendedIngredients: ['Centella Asiatica (Madecassoside)', 'Azelaic Acid 10%', 'Panthenol 5%'], zoneCoordinates: [{ x: 46, y: 55, radius: 8 }, { x: 54, y: 55, radius: 8 }], historicalDelta: 1 },
    oiliness: { id: 'oiliness', name: 'Sebum Equilibrium (T-Zone)', score: 79, severity: 'mild', clinicalDescription: 'Slight follicular sebum prominence in mid-forehead and chin.', recommendedIngredients: ['Zinc PCA', 'Salicylic Acid 0.5%', 'Green Tea Polyphenols'], zoneCoordinates: [{ x: 50, y: 32, radius: 16 }, { x: 50, y: 72, radius: 12 }], historicalDelta: 0 },
    pores: { id: 'pores', name: 'Follicular Pore Refinement', score: 85, severity: 'optimal', clinicalDescription: 'Well-tightened pore diameter across lateral cheek planes.', recommendedIngredients: ['Niacinamide', 'Pore-Refining Mushroom Extract', 'Witch Hazel Distillate'], zoneCoordinates: [{ x: 42, y: 54, radius: 12 }, { x: 58, y: 54, radius: 12 }], historicalDelta: 2 },
    acne: { id: 'acne', name: 'Blemish & Comedone Clarity', score: 95, severity: 'optimal', clinicalDescription: 'Zero active inflammatory lesions or papules detected.', recommendedIngredients: ['Colloidal Silver', 'Tea Tree Bio-Hydrosol', 'Prebiotic Oligosaccharides'], zoneCoordinates: [], historicalDelta: 1 },
    eyeBags: { id: 'eyeBags', name: 'Infraorbital Firmness & Bags', score: 88, severity: 'optimal', clinicalDescription: 'Taut lower eyelid contour with no lymphatic stasis.', recommendedIngredients: ['Argireline Amplified Peptide', 'Chrysin', 'Arnica Montana Extract'], zoneCoordinates: [{ x: 38, y: 48, radius: 9 }, { x: 62, y: 48, radius: 9 }], historicalDelta: 3 },
    firmness: { id: 'firmness', name: 'Elasticity & Dermal Recoil', score: 90, severity: 'optimal', clinicalDescription: 'Superb collagen density and firm jawline vector integrity.', recommendedIngredients: ['Bio-Identical Collagen', 'Resveratrol', 'Bakuchiol 1%'], zoneCoordinates: [{ x: 30, y: 68, radius: 18 }, { x: 70, y: 68, radius: 18 }], historicalDelta: 4 },
    droopiness: { id: 'droopiness', name: 'Upper Eyelid Ptosis Index', score: 94, severity: 'optimal', clinicalDescription: 'Symmetrical tarsal lift and open brow architecture.', recommendedIngredients: ['Acetyl Hexapeptide-8', 'Bio-Peptide Complex', 'Ginseng Root Extract'], zoneCoordinates: [{ x: 38, y: 40, radius: 10 }, { x: 62, y: 40, radius: 10 }], historicalDelta: 2 },
    barrierStrength: { id: 'barrierStrength', name: 'Lipid Moisture Barrier Resilience', score: 91, severity: 'optimal', clinicalDescription: 'High resilience against particulate matter, air pollutants, and UV stress.', recommendedIngredients: ['Cholesterol:Ceramide:Fatty Acids (3:1:1)', 'Squalane', 'Allantoin'], zoneCoordinates: [{ x: 50, y: 50, radius: 30 }], historicalDelta: 5 }
  },
  personalizedRegimen: {
    amRoutine: [
      'Gentle Amino Acid Foam Cleanser (pH 5.5)',
      'Stabilized Vitamin C 15% + Ferulic Acid Antioxidant Shield',
      'Multi-Molecular Hyaluronic Acid Hydrating Serum',
      'Ceramide Barrier Light Gel Cream',
      'Broad Spectrum Mineral Sunscreen SPF 50+ PA++++'
    ],
    pmRoutine: [
      'Bi-Phase Squalane Cleansing Oil',
      'Triple Peptide & 0.05% Retinal Longevity Elixir',
      'Tranexamic Acid & Niacinamide Spot Correcting Serum',
      'Rich Lipid Replenishing Night Recovery Balm',
      'Caffeine + Peptide Contour Eye Treatment'
    ],
    lifestyleRx: [
      'Maintain 2.2L daily cellular hydration',
      '7.5+ hours circadian deep sleep for nocturnal fibroblast collagen synthesis',
      'Wear UV400 AR-coated sunglasses outdoors to reduce squint-induced periorbital lines'
    ],
    uvAdvisory: 'Moderate UV Index (5.4) detected in your zone. Reapply mineral sunscreen every 2 hours outdoors.'
  }
};

export const FASHION_CONCEPTS: FashionOutfitConcept[] = [
  {
    id: 'outfit-1',
    title: 'Milano Biophilic Minimalist Ensemble',
    aesthetic: 'Sartorial Modern Luxury',
    occasion: 'Executive Gallery Opening & Dinner',
    prompt: 'Sculptural linen-silk blend tailored blazer with asymmetric drape, fluid wide-leg ivory trousers, and brushed champagne titanium accessories.',
    colorPalette: ['#EAE5DC', '#C5B49D', '#363432', '#9E8165', '#FAF9F6'],
    fabrication: {
      top: 'Silk-georgette cowl neck shell',
      outerwear: 'Double-breasted unstructured linen blazer with horn buttons',
      bottom: 'High-waisted pleated wool-silk fluid trousers',
      accessories: 'Brushed titanium cuff and YouCam Aviator geometric sunglasses'
    },
    silhouetteType: 'tailored',
    sustainabilityRating: 'A+',
    estimatedRetailValue: 1280,
    drapePhysics: 'Soft fluid gravity with structural shoulder architecture',
    matchingProducts: []
  },
  {
    id: 'outfit-2',
    title: 'Neo-Tokyo Cyber-Chic Nocturne',
    aesthetic: 'Futuristic Avant-Garde',
    occasion: 'Creative Summit & Nightlife Exploration',
    prompt: 'Reflective obsidian technical trench coat over seamless metallic knit dress, paired with cobalt accents and sharp cat-eye eyewear.',
    colorPalette: ['#0B0C10', '#1F2833', '#C5C6C7', '#66FCF1', '#45A29E'],
    fabrication: {
      top: 'Form-fitting silver ribbed turtleneck',
      outerwear: 'Waterproof technical nylon trench with luminescent piping',
      bottom: 'Sculpted vegan leather split-hem midi skirt',
      accessories: 'CyberLuxe Cat-Eye AR frames and obsidian drop earrings'
    },
    silhouetteType: 'avant-garde',
    sustainabilityRating: 'A',
    estimatedRetailValue: 1540,
    drapePhysics: 'Crisp geometric lines with dynamic light-reflective shimmer',
    matchingProducts: []
  },
  {
    id: 'outfit-3',
    title: 'Mediterranean Solar Reverie',
    aesthetic: 'Bespoke Coastal Resort',
    occasion: 'Seaside Brunch & Yacht Excursion',
    prompt: 'Sun-drenched terracotta silk chiffon wrap dress with hand-pleated tiered skirt and delicate 18k hammered gold jewelry.',
    colorPalette: ['#E2725B', '#F4A460', '#FFE4B5', '#FFF8DC', '#8B4513'],
    fabrication: {
      top: 'Cross-back draped halter bodice',
      outerwear: 'Breezy organic cotton gauze kimono wrap',
      bottom: 'Tiered maxi skirt in breathable mulberry silk',
      accessories: 'Helios gold huggies and tortoiseshell solar sunglasses'
    },
    silhouetteType: 'relaxed',
    sustainabilityRating: 'A+',
    estimatedRetailValue: 980,
    drapePhysics: 'Breezy micro-flutter responding to wind aerodynamic simulation',
    matchingProducts: []
  }
];

export const RETAIL_PRODUCTS: RetailProduct[] = [
  {
    id: 'prod-1',
    name: 'YouCam Couture Velvet Lip Color',
    brand: 'YouCam Couture',
    category: 'makeup',
    price: 34,
    originalPrice: 42,
    rating: 4.9,
    reviewsCount: 1420,
    imageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=400&q=80',
    shadeHex: '#A84351',
    shadeName: 'Velvet Rosewood',
    description: 'Weightless, 16-hour transfer-proof velvet lipstick with blurring hyaluronic spheres and precision applicator.',
    keyBenefits: ['Precision AR Shade Matching', 'Non-Drying Matte Comfort', 'Hyaluronic Acid Infusion'],
    perfectCorpApiTag: 'makeup-vto-lipstick'
  },
  {
    id: 'prod-2',
    name: 'SkinSync 14-Dimension Bio-Barrier Elixir',
    brand: 'SkinSync AI',
    category: 'skincare',
    price: 88,
    originalPrice: 110,
    rating: 5.0,
    reviewsCount: 890,
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80',
    description: 'Targeted bio-molecular repair serum formulated based on Perfect Corp 14-point diagnostic mapping.',
    keyBenefits: ['Matrixyl 3000 + Copper Peptides', 'Ectoin Pollution Shield', 'Clinically Proven Barrier Repair in 7 Days'],
    perfectCorpApiTag: 'skin-analysis-rx',
    clinicalActive: 'Copper Tripeptide-1 (3%) & Ectoin'
  },
  {
    id: 'prod-3',
    name: 'Aero Titanium AR Smart Eyewear',
    brand: 'YouCam Vision AR',
    category: 'eyewear',
    price: 285,
    originalPrice: 320,
    rating: 4.8,
    reviewsCount: 430,
    imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=400&q=80',
    description: 'Ultra-lightweight Japanese aerospace titanium frames with anti-reflective blue-light filter lenses.',
    keyBenefits: ['True-to-Scale 3D AR Try-On', 'Featherweight 12g Construction', 'Zeiss Polarized UV400 Protection'],
    perfectCorpApiTag: 'eyewear-ar-vto'
  },
  {
    id: 'prod-4',
    name: 'Veritas 18K Gold Solitaire Cascade Earrings',
    brand: 'Veritas Haute Joaillerie',
    category: 'jewelry',
    price: 1450,
    originalPrice: 1600,
    rating: 5.0,
    reviewsCount: 115,
    imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=400&q=80',
    description: 'Conflict-free brilliant cut diamonds set in recycled 18k yellow gold with kinetic movement physics.',
    keyBenefits: ['Real-Time Occlusion & Light Physics AR', 'Certified Ethically Sourced', 'Lifetime Warranty & Polish'],
    perfectCorpApiTag: 'jewelry-ar-vto'
  },
  {
    id: 'prod-5',
    name: 'Solaris Pure L-Ascorbic Acid Radiance Drops',
    brand: 'Solaris Beauty',
    category: 'skincare',
    price: 68,
    rating: 4.9,
    reviewsCount: 670,
    imageUrl: 'https://images.unsplash.com/photo-1608248597359-2ff804e3fb4b?auto=format&fit=crop&w=400&q=80',
    description: '15% pure Vitamin C with ferulic acid and tocopherol to visibly brighten UV spots and boost dermal collagen.',
    keyBenefits: ['Targeted for Spot Severity Score <85', 'Potent Cellular Antioxidant', 'Micro-Encapsulated Freshness'],
    perfectCorpApiTag: 'skin-analysis-rx',
    clinicalActive: 'L-Ascorbic Acid (15%) + Ferulic Acid (0.5%)'
  },
  {
    id: 'prod-6',
    name: 'Milano Tailored Silk-Linen Blazer',
    brand: 'YouCam Atelier',
    category: 'fashion',
    price: 520,
    originalPrice: 650,
    rating: 4.9,
    reviewsCount: 310,
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=400&q=80',
    description: 'Handcrafted in Italy using regenerative organic linen and mulberry silk with anatomical shoulder architecture.',
    keyBenefits: ['GenAI Virtual Dressing Projection', 'Wrinkle-Resistant Travel Weave', 'Breathable Temperature Regulation'],
    perfectCorpApiTag: 'fashion-vto-draping'
  }
];
