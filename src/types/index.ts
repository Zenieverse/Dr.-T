export type ActiveTab = 'tryon' | 'skin14d' | 'fashion' | 'lookbook' | 'dr-t' | 'api-sandbox';

export type LanguageCode = 'en' | 'es' | 'zh' | 'ja' | 'fr' | 'de' | 'ar' | 'hi' | 'pt' | 'ko';

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
}

export interface ARProduct {
  id: string;
  name: string;
  brand: string;
  category: 'lipstick' | 'blush' | 'eyeshadow' | 'eyeliner' | 'sunglasses' | 'earrings' | 'hair';
  price: number;
  shadeName: string;
  colorHex: string;
  finish?: 'matte' | 'gloss' | 'satin' | 'metallic' | 'glitter' | 'neon';
  intensity?: number;
  description: string;
  image: string;
  inStock: boolean;
  rating: number;
  reviewsCount: number;
}

export interface AppliedARState {
  lipstick?: ARProduct;
  blush?: ARProduct;
  eyeshadow?: ARProduct;
  eyeliner?: ARProduct;
  sunglasses?: ARProduct;
  earrings?: ARProduct;
  hairColor?: {
    id: string;
    name: string;
    colorHex: string;
    style: 'full' | 'highlights' | 'ombre';
    opacity: number;
  };
  foundationTone?: string;
  smoothingIntensity: number;
}

export interface SkinDimension {
  id: string;
  name: string;
  category: 'Texture & Pores' | 'Aging & Elasticity' | 'Tone & Pigment' | 'Hydration & Barrier';
  score: number; // 0 - 100 (100 is optimal/ideal)
  status: 'Optimal' | 'Good' | 'Moderate' | 'Needs Attention';
  description: string;
  clinicalInsight: string;
  recommendedActive: string;
  severityLevel: number; // 1 (mild) to 4 (high concern)
  zone: 'forehead' | 'cheeks' | 'undereye' | 't-zone' | 'jawline' | 'nasolabial';
}

export interface SkinDiagnosisResult {
  scanDate: string;
  overallHealthScore: number;
  skinAgeEstimated: number;
  chronologicalAge: number;
  skinType: 'Normal' | 'Dry' | 'Oily' | 'Combination' | 'Sensitive';
  dimensions: SkinDimension[];
  urgentRecommendations: string[];
  amRoutine: RoutineStep[];
  pmRoutine: RoutineStep[];
}

export interface RoutineStep {
  stepNumber: number;
  category: 'Cleanser' | 'Toner' | 'Serum' | 'Moisturizer' | 'Sunscreen' | 'Exfoliant' | 'Treatment';
  productName: string;
  keyIngredient: string;
  reason: string;
  price: number;
}

export interface FashionItem {
  id: string;
  name: string;
  prompt: string;
  fabricType: 'Silk' | 'Satin' | 'Cashmere' | 'Denim' | 'Velvet' | 'Linen' | 'Leather' | 'Organza';
  silhouette: 'Evening Gown' | 'Tailored Blazer' | 'Streetwear Kimono' | 'Cyber-Luxe Jacket' | 'Fluid Slip Dress' | 'Pleated Trench';
  colorPalette: string[];
  pattern: 'Solid Minimal' | 'Abstract Flora' | 'Cyber Houndstooth' | 'Geometric Wave' | 'Metallic Shimmer';
  generatedImage: string;
  drapeStiffness: number; // 0 - 1
  drapeWeight: number; // 0 - 1
  windSpeed: number;
  modelSize: 'XS' | 'S' | 'M' | 'L' | 'XL';
  estimatedPrice: number;
}

export interface EditorialLook {
  id: string;
  title: string;
  subtitle: string;
  curator: string;
  heroImage: string;
  theme: string;
  products: ARProduct[];
  story: string;
}

export interface CartItem {
  id: string;
  product: ARProduct | {
    id: string;
    name: string;
    brand: string;
    price: number;
    shadeName?: string;
    colorHex?: string;
    image: string;
    category: string;
  };
  quantity: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'dr-t';
  text: string;
  timestamp: string;
  language: LanguageCode;
  mode?: 'general' | 'biomedical' | 'veterinary' | 'skincare';
  attachmentUrl?: string;
}

export interface ApiEndpointSpec {
  name: string;
  method: 'POST' | 'GET';
  path: string;
  description: string;
  requestBody: Record<string, any>;
  responseSample: Record<string, any>;
  avgLatencyMs: number;
}
