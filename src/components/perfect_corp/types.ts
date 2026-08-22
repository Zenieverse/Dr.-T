export type PerfectStudioTab = 
  | 'virtual-tryon'
  | 'skin-diagnostic'
  | 'genai-fashion'
  | 'smart-retail'
  | 'api-playground';

export type TryOnCategory = 'makeup' | 'hair' | 'eyewear' | 'jewelry' | 'accessories';

export interface MakeupShade {
  id: string;
  name: string;
  hex: string;
  finish: 'matte' | 'satin' | 'glossy' | 'metallic' | 'shimmer';
  brand: string;
  price: number;
  category: 'lipstick' | 'blush' | 'eyeshadow' | 'eyeliner' | 'foundation';
  undertone: 'warm' | 'cool' | 'neutral' | 'olive';
  rating: number;
  inStock: boolean;
}

export interface HairColorOption {
  id: string;
  name: string;
  primaryHex: string;
  secondaryHex?: string;
  style: 'solid' | 'balayage' | 'ombre' | 'highlights' | 'two-tone';
  vibrancy: number; // 0-100
  shine: number; // 0-100
  category: 'natural' | 'blonde' | 'brunette' | 'red' | 'vivid' | 'pastel';
}

export interface AccessoryOption {
  id: string;
  name: string;
  category: 'eyewear' | 'earrings' | 'necklace' | 'hat';
  frameShape?: 'aviator' | 'cat-eye' | 'wayfarer' | 'round' | 'geometric' | 'rimless';
  metalColor: string;
  gemstoneColor?: string;
  brand: string;
  price: number;
  arModelType: string;
}

export interface SkinMetricResult {
  id: string;
  name: string;
  score: number; // 0-100 (100 is optimal/healthiest)
  severity: 'optimal' | 'mild' | 'moderate' | 'concerning';
  clinicalDescription: string;
  recommendedIngredients: string[];
  zoneCoordinates: { x: number; y: number; radius: number }[];
  historicalDelta?: number; // e.g. +4% since last month
}

export interface SkinDiagnosticReport {
  overallHealthScore: number;
  chronologicalAge: number;
  biologicalSkinAge: number;
  skinType: 'dry' | 'oily' | 'combination' | 'normal' | 'sensitive';
  undertone: 'cool' | 'warm' | 'neutral' | 'deep-warm';
  metrics: {
    wrinkles: SkinMetricResult;
    spots: SkinMetricResult;
    texture: SkinMetricResult;
    darkCircles: SkinMetricResult;
    radiance: SkinMetricResult;
    hydration: SkinMetricResult;
    redness: SkinMetricResult;
    oiliness: SkinMetricResult;
    pores: SkinMetricResult;
    acne: SkinMetricResult;
    eyeBags: SkinMetricResult;
    firmness: SkinMetricResult;
    droopiness: SkinMetricResult;
    barrierStrength: SkinMetricResult;
  };
  personalizedRegimen: {
    amRoutine: string[];
    pmRoutine: string[];
    lifestyleRx: string[];
    uvAdvisory: string;
  };
}

export interface FashionOutfitConcept {
  id: string;
  title: string;
  aesthetic: string;
  occasion: string;
  prompt: string;
  colorPalette: string[];
  fabrication: {
    top: string;
    bottom: string;
    outerwear?: string;
    accessories: string;
  };
  silhouetteType: 'tailored' | 'relaxed' | 'avant-garde' | 'minimalist' | 'athletic';
  sustainabilityRating: 'A+' | 'A' | 'B+' | 'B';
  estimatedRetailValue: number;
  drapePhysics: string;
  matchingProducts: RetailProduct[];
}

export interface RetailProduct {
  id: string;
  name: string;
  brand: string;
  category: 'skincare' | 'makeup' | 'fashion' | 'eyewear' | 'jewelry';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  shadeHex?: string;
  shadeName?: string;
  description: string;
  keyBenefits: string[];
  perfectCorpApiTag: string;
  clinicalActive?: string;
}

export interface CartItem {
  product: RetailProduct;
  quantity: number;
  selectedShade?: string;
  selectedSize?: string;
}
