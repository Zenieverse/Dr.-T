import React, { useState, useEffect, useRef } from 'react';
import { 
  Soup, 
  Utensils, 
  Flame, 
  Heart, 
  Sparkles, 
  ChefHat, 
  Clock, 
  ShieldCheck, 
  Scale, 
  Coffee, 
  Search, 
  Plus, 
  Check, 
  Share2, 
  MessageCircle, 
  Play, 
  Volume2, 
  VolumeX, 
  ShoppingBag, 
  Calendar, 
  ChevronRight, 
  Star, 
  Award, 
  Info,
  RefreshCw,
  Send,
  BookOpen,
  Filter,
  ArrowRight,
  CheckCircle2,
  X,
  Droplet,
  Zap,
  Sliders,
  MapPin,
  QrCode,
  Upload,
  Camera,
  Image as ImageIcon,
  Maximize2
} from 'lucide-react';

export interface ComfortDish {
  id: string;
  name: string;
  subtitle: string;
  category: 'soups' | 'stews' | 'comfort_classics' | 'desserts' | 'heritage' | 'anemia' | 'general_patient';
  categoryLabel: string;
  image: string;
  prepTime: string;
  comfortScore: number; // 1 - 100
  clinicalBadge: 'Cardiac Safe' | 'Renal Friendly' | 'Diabetic Friendly' | 'Cardiorenal Double-Safe' | 'Anemia Iron-Boost' | 'Post-Op Recovery' | 'General Patient Care';
  nutrition: {
    calories: number;
    sodiumMg: number;
    potassiumMg: number;
    proteinG: number;
    ironMg?: number;
    glycemicIndex: 'Low' | 'Medium' | 'Minimal';
  };
  description: string;
  clinicalStory: string;
  ingredients: {
    originalGuiltyItem: string;
    drTSubstitute: string;
    purpose: string;
  }[];
  recipeSteps: string[];
  likes: number;
}

const DISHES_DATA: ComfortDish[] = [
  {
    id: 'dish-1',
    name: 'Triple-Simmered Golden Collagen Phở',
    subtitle: 'Classic Vietnamese Noodle Comfort with Zero Sodium Spike',
    category: 'soups',
    categoryLabel: 'Healing Soups & Broths',
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80',
    prepTime: '45 mins simmer',
    comfortScore: 99,
    clinicalBadge: 'Cardiorenal Double-Safe',
    nutrition: {
      calories: 380,
      sodiumMg: 280, // Classic pho is 1,800mg+!
      potassiumMg: 410,
      proteinG: 28,
      glycemicIndex: 'Low'
    },
    description: 'Slow-simmered toasted star anise, cinnamon, charred ginger, and grass-fed bone marrow broth infused with umami mushroom dashi instead of heavy salt.',
    clinicalStory: 'Standard Phở broth can contain up to 2,200mg of sodium per bowl—a crisis for patients with hypertension or heart failure. Dr. T’s version uses charred onion, roasted spices, and kombu dashi to trick the palate with rich umami while keeping sodium under 280mg.',
    ingredients: [
      { originalGuiltyItem: 'Commercial Beef Bouillon & Fish Sauce (2,200mg sodium)', drTSubstitute: 'Toasted Star Anise + Charred Shallots + Umami Shiitake Dashi', purpose: 'Protects blood pressure while delivering authentic aromatic warmth' },
      { originalGuiltyItem: 'Refined White Rice Noodles', drTSubstitute: 'Low-Glycemic Shirataki or Brown Rice Ribbon Noodle', purpose: 'Stabilizes post-prandial blood glucose' },
      { originalGuiltyItem: 'Fatty Rib-eye Cuts', drTSubstitute: 'Lean Sliced Beef Tenderloin + Grass-fed Bone Marrow Collagen', purpose: 'Provides vascular-repairing amino acids without saturated fat overload' }
    ],
    recipeSteps: [
      'Toast star anise, cinnamon sticks, black cardamom, and cloves in a dry stockpot until fragrant (2 minutes).',
      'Add charred ginger and shallots along with 8 cups of low-sodium bone broth and dried shiitake mushrooms.',
      'Simmer on low heat for 40 minutes. Strain broth and season with 1 tsp low-sodium coconut aminos and lime juice.',
      'Divide warm rice ribbon noodles and paper-thin sliced beef into deep bowls.',
      'Ladle boiling golden broth over beef, instantly searing it. Top with fresh Thai basil, cilantro, and chili slices.'
    ],
    likes: 542
  },
  {
    id: 'dish-2',
    name: 'Velvety Wild Mushroom & Truffle Risotto',
    subtitle: 'Creamy Italian Comfort without Heavy Butter or High Potassium',
    category: 'stews',
    categoryLabel: 'Slow-Baked Soul Stews',
    image: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=800&q=80',
    prepTime: '30 mins',
    comfortScore: 97,
    clinicalBadge: 'Cardiac Safe',
    nutrition: {
      calories: 340,
      sodiumMg: 220,
      potassiumMg: 380,
      proteinG: 14,
      glycemicIndex: 'Medium'
    },
    description: 'Arborio rice folded into a silken cauliflower-cashew emulsion, pan-seared chanterelles, white truffle oil, and aged nutritional yeast.',
    clinicalStory: 'Traditional risotto relies on heavy parmesan cheese and butter blocks that load the body with saturated fats and sodium. Our clinical emulsion uses pureed roasted cauliflower and raw cashews to achieve four-star creaminess.',
    ingredients: [
      { originalGuiltyItem: 'Full-fat Butter & Heavy Cream', drTSubstitute: 'Roasted Cauliflower Emulsion + Cashew Velvet', purpose: 'Zero arterial plaque risk with smooth mouthfeel' },
      { originalGuiltyItem: 'Salty Aged Parmesan Cheese', drTSubstitute: 'Nutritional Yeast Flakes + Miso Emulsion', purpose: 'High B-complex vitamins without sodium overload' }
    ],
    recipeSteps: [
      'Sauté minced shallots and garlic in extra virgin olive oil until translucent.',
      'Add Arborio rice and toast for 2 minutes until glossy.',
      'Deglaze with white wine or splash of apple cider vinegar, then ladle warm vegetable stock gradually.',
      'In a blender, whiz steam-softened cauliflower and soaked cashews into a smooth cream.',
      'Fold the cauliflower cream and seared mushrooms into risotto. Drizzle white truffle oil before serving.'
    ],
    likes: 418
  },
  {
    id: 'dish-3',
    name: 'Golden Cauliflower Mac & Four-Herb Velvet',
    subtitle: 'Childhood Nostalgia Reimagined for Heart & Vascular Health',
    category: 'comfort_classics',
    categoryLabel: 'Classics & Bakes',
    image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80',
    prepTime: '25 mins bake',
    comfortScore: 98,
    clinicalBadge: 'Renal Friendly',
    nutrition: {
      calories: 290,
      sodiumMg: 190,
      potassiumMg: 310,
      proteinG: 16,
      glycemicIndex: 'Low'
    },
    description: 'Golden elbow macaroni folded into a butternut-turmeric golden cheese sauce, topped with almond-herb sourdough crunch.',
    clinicalStory: 'Processed box macaroni is loaded with phosphate additives and 900mg+ sodium per serving. Dr. T’s butternut squash and turmeric base creates a vibrant, naturally golden cheese sauce that reduces vascular inflammation.',
    ingredients: [
      { originalGuiltyItem: 'Processed Cheddar Cheese Food & Salt', drTSubstitute: 'Roasted Butternut Squash + Turmeric + Yeast Flakes', purpose: 'Provides beta-carotene and potent anti-inflammatory curcumin' },
      { originalGuiltyItem: 'Refined Wheat Pasta', drTSubstitute: 'High-Protein Chickpea or Lentil Macaroni', purpose: 'Double the fiber for gut-microbiome and kidney health' }
    ],
    recipeSteps: [
      'Boil high-protein chickpea pasta until al dente.',
      'Blend roasted butternut squash, garlic, soaked cashew cream, turmeric, and nutritional yeast until silky.',
      'Mix warm pasta with golden velvet sauce in a cast-iron dish.',
      'Top with toasted whole wheat sourdough crumbs and rosemary.',
      'Bake at 380°F (190°C) for 15 minutes until bubbly and golden crisp.'
    ],
    likes: 612
  },
  {
    id: 'dish-4',
    name: 'Warm Cinnamon Apple Sourdough Crisp',
    subtitle: 'Cozy Bakery Aroma without Refined Sugar Spikes',
    category: 'desserts',
    categoryLabel: 'Guilt-Free Warm Desserts',
    image: 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?auto=format&fit=crop&w=800&q=80',
    prepTime: '35 mins',
    comfortScore: 96,
    clinicalBadge: 'Diabetic Friendly',
    nutrition: {
      calories: 210,
      sodiumMg: 45,
      potassiumMg: 220,
      proteinG: 6,
      glycemicIndex: 'Minimal'
    },
    description: 'Warm honeycrisp apples tossed in Ceylon cinnamon, nutmeg, and vanilla bean, baked under a toasted oat-walnut sourdough crumble.',
    clinicalStory: 'Ceylon cinnamon is clinically shown to enhance insulin sensitivity. Paired with pectin-rich apples and walnuts, this warm crisp delivers ultimate homey comfort without elevating blood sugar.',
    ingredients: [
      { originalGuiltyItem: 'White Refined Sugar & Margarine', drTSubstitute: 'Pure Ceylon Cinnamon + Monkfruit Essence + Cold-Pressed Olive Oil', purpose: 'Supports endothelial function and glucose disposal' },
      { originalGuiltyItem: 'Processed Crisp Flour', drTSubstitute: 'Rolled Oats + Toasted Walnuts + Flaxseed Crisp', purpose: 'Rich in Omega-3 fatty acids for cardiovascular defense' }
    ],
    recipeSteps: [
      'Slice honeycrisp apples thinly and toss with Ceylon cinnamon, lemon juice, and vanilla bean extract.',
      'In a bowl, mix rolled oats, crushed walnuts, ground flaxseed, and a drizzle of extra virgin olive oil.',
      'Layer apples in a pie dish, cover with oat crumble, and bake for 30 minutes until apples are bubbly soft.',
      'Serve warm with a scoop of coconut-vanilla greek yogurt.'
    ],
    likes: 389
  },
  {
    id: 'dish-5',
    name: 'Grandma’s Restorative Lemon Chicken & Barley Bowl',
    subtitle: 'Classic Soul Food with Mediterranean Immunity Power',
    category: 'heritage',
    categoryLabel: 'Regional Heritage Love',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
    prepTime: '40 mins',
    comfortScore: 99,
    clinicalBadge: 'Cardiorenal Double-Safe',
    nutrition: {
      calories: 360,
      sodiumMg: 210,
      potassiumMg: 430,
      proteinG: 32,
      glycemicIndex: 'Low'
    },
    description: 'Tender poached pasture-raised chicken breast, pearl barley, wilted baby spinach, and fresh Meyer lemon dill broth.',
    clinicalStory: 'When feeling under the weather or recovering from medical procedures, chicken soup is the universal prescription. Pearl barley supplies soluble beta-glucan fiber to scrub cholesterol.',
    ingredients: [
      { originalGuiltyItem: 'Heavy Canned Chicken Stock (1,200mg Sodium)', drTSubstitute: 'House-Poached Lemongrass & Meyer Lemon Herb Infusion', purpose: 'Refreshing flavor with minimal renal filtration workload' },
      { originalGuiltyItem: 'Salty Noodles', drTSubstitute: 'Heart-Healthy Pearl Barley & Dill', purpose: 'Sustained energy and digestive comfort' }
    ],
    recipeSteps: [
      'Poach pasture-raised chicken breast with leeks, dill, and bay leaves in simmering water for 20 mins.',
      'Shred chicken and set aside.',
      'In the same golden stock, cook pearl barley until tender.',
      'Stir in shredded chicken, baby spinach, fresh Meyer lemon juice, and cracked black pepper.',
      'Serve steaming hot with a drizzle of robust Greek olive oil.'
    ],
    likes: 478
  },
  {
    id: 'dish-6',
    name: 'Bio-Enhanced Iron Stew: Black Bean, Spinach & Citrus Slow Stew',
    subtitle: 'Non-Heme Iron Paired with Citrus-Vitamin C for 400% Higher Absorption',
    category: 'anemia',
    categoryLabel: 'Anemia Iron & Folate Support',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    prepTime: '35 mins',
    comfortScore: 98,
    clinicalBadge: 'Anemia Iron-Boost',
    nutrition: {
      calories: 310,
      sodiumMg: 210,
      potassiumMg: 420,
      proteinG: 18,
      ironMg: 14.2,
      glycemicIndex: 'Low'
    },
    description: 'Creamy slow-simmered black turtle beans, wilted organic baby spinach, roasted red bell peppers, cumin, and key lime juice infusion.',
    clinicalStory: 'Non-heme plant iron in spinach and black beans requires ascorbic acid (Vitamin C) to convert ferric (Fe3+) iron into soluble, absorbable ferrous (Fe2+) iron. This dish provides 14.2mg of bio-available iron without GI distress, boosting ferritin and hemoglobin reserves.',
    ingredients: [
      { originalGuiltyItem: 'Heavy Canned Refried Beans & Salt (950mg Sodium)', drTSubstitute: 'Pressure-Cooked Black Turtle Beans + Roasted Red Pepper Puree', purpose: 'Protects kidneys while boosting natural ascorbic acid' },
      { originalGuiltyItem: 'Synthetic Iron Pill Triggers Constipation', drTSubstitute: 'Organic Baby Spinach + Fresh Key Lime Juice Reduction', purpose: '400% higher non-heme erythrocyte uptake with zero GI cramping' }
    ],
    recipeSteps: [
      'Sauté minced garlic, shallots, and ground cumin in cold-pressed extra virgin olive oil for 2 minutes.',
      'Stir in cooked black turtle beans, roasted red bell pepper puree, and low-sodium vegetable stock. Simmer for 20 minutes.',
      'Fold in 3 packed cups of fresh organic baby spinach and stir until gently wilted.',
      'Remove from heat and squeeze fresh key lime juice directly over the stew to maximize Ascorbic Acid-Iron binding.',
      'Garnish with fresh cilantro and toasted pumpkin seeds (pepitas) for extra zinc and iron.'
    ],
    likes: 529
  },
  {
    id: 'dish-7',
    name: 'Pasture-Raised Liver & Beetroot Velvet Bisque',
    subtitle: 'Heme-Iron & B12 Powerhouse for Rapid Red Blood Cell Synthesis',
    category: 'anemia',
    categoryLabel: 'Anemia Iron & Folate Support',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
    prepTime: '25 mins',
    comfortScore: 96,
    clinicalBadge: 'Anemia Iron-Boost',
    nutrition: {
      calories: 340,
      sodiumMg: 190,
      potassiumMg: 390,
      proteinG: 26,
      ironMg: 18.5,
      glycemicIndex: 'Low'
    },
    description: 'Organic pasture-raised chicken liver gently poached in nitric-oxide-rich roasted beetroot velocity, pomegranate reduction, and fresh thyme.',
    clinicalStory: 'Iron deficiency anemia often coexists with B12 and folate deficits. Pasture-raised liver delivers heme-iron (absorbed directly via HCP-1 transporters) along with 350% DV Vitamin B12. Blended with roasted beets and tart pomegranate juice, it transforms iron therapy into gourmet comfort.',
    ingredients: [
      { originalGuiltyItem: 'Deep-Fried Salty Liver & Onions', drTSubstitute: 'Poached Pasture-Raised Chicken Liver + Roasted Ruby Beetroot Velocity', purpose: 'High heme-iron without trans fats or acrylamides' },
      { originalGuiltyItem: 'High-Sodium Commercial Gravy', drTSubstitute: 'Pomegranate Juice Reduction + Fresh Thyme', purpose: 'Pomegranate polyphenols enhance vascular elasticity' }
    ],
    recipeSteps: [
      'Lightly sear grass-fed pasture-raised chicken livers in EVOO with leeks and thyme for 4 minutes until barely medium-rare.',
      'In a high-speed blender, combine seared liver, steam-roasted beets, garlic, and warm bone broth.',
      'Whiz into a vibrant ruby-red velvet bisque.',
      'Drizzle tart pomegranate juice reduction and top with microgreens before serving warm.'
    ],
    likes: 412
  },
  {
    id: 'dish-8',
    name: 'Golden Turmeric & Collagen Congee (Healing Rice Porridge)',
    subtitle: 'Ultra-Digestible Gastric Comfort for Post-Op, Chemotherapy, or General Recovery',
    category: 'general_patient',
    categoryLabel: 'General Patient Wellness',
    image: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=800&q=80',
    prepTime: '40 mins',
    comfortScore: 99,
    clinicalBadge: 'Post-Op Recovery',
    nutrition: {
      calories: 280,
      sodiumMg: 160,
      potassiumMg: 320,
      proteinG: 22,
      ironMg: 4.8,
      glycemicIndex: 'Low'
    },
    description: 'Silky jasmine rice porridge slow-cooked in grass-fed bone marrow collagen, fresh grated ginger, golden turmeric, and poached chicken breast.',
    clinicalStory: 'Patients recovering from surgery, hospital stays, or chemotherapy need low-residue, easily absorbed nutrition that repairs tissue without taxing digestion. Congee provides soothing hydration, proline/glycine amino acids for wound healing, and ginger to soothe gastric motility.',
    ingredients: [
      { originalGuiltyItem: 'Heavy Salty Canned Soup (1,400mg Sodium)', drTSubstitute: 'Grass-Fed Collagen Bone Broth + Jasmine Rice + Zingiberene Ginger', purpose: 'Accelerates mucosal lining repair with minimal renal strain' },
      { originalGuiltyItem: 'Processed Preservatives', drTSubstitute: 'Curcumin-Rich Golden Turmeric + Green Onion Oil', purpose: 'Reduces post-surgical systemic inflammation' }
    ],
    recipeSteps: [
      'Combine jasmine rice and grass-fed collagen bone broth in a 1:8 ratio in a heavy-bottomed pot.',
      'Bring to a gentle boil, then turn heat to ultra-low. Add sliced ginger and turmeric.',
      'Simmer uncovered for 35 minutes, stirring occasionally until grains break down into a comforting velvet porridge.',
      'Stir in finely shredded poached chicken breast and sesame oil.',
      'Serve piping hot with chopped scallions and toasted sesame seeds.'
    ],
    likes: 681
  },
  {
    id: 'dish-9',
    name: 'Silken Tofu, Ginger & Shiitake Immunity Nectar Soup',
    subtitle: 'Hydrating, Electrolyte-Balanced Soft Comfort for Nausea & Appetite Loss',
    category: 'general_patient',
    categoryLabel: 'General Patient Wellness',
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
    prepTime: '20 mins',
    comfortScore: 97,
    clinicalBadge: 'General Patient Care',
    nutrition: {
      calories: 230,
      sodiumMg: 180,
      potassiumMg: 350,
      proteinG: 17,
      ironMg: 6.2,
      glycemicIndex: 'Minimal'
    },
    description: 'Soft organic silken tofu cubes floating in a clear golden ginger-shiitake infusion, baby bok choy, and toasted sesame rain.',
    clinicalStory: 'Medication regimens and convalescence often trigger appetite loss and nausea. Silken tofu provides clean, non-stimulating plant protein, while shiitake mushroom beta-glucans stimulate innate NK immune defenses.',
    ingredients: [
      { originalGuiltyItem: 'Instant High-Sodium Seasoning Packets', drTSubstitute: 'Freshly Steeped Shiitake & Kombu Nectar + Micro-Filtered Ginger Extract', purpose: 'Calms hyperactive chemoreceptor trigger zone to stop nausea' },
      { originalGuiltyItem: 'Chewy Fatty Meats', drTSubstitute: 'Non-GMO Silken Organic Tofu + Tender Baby Bok Choy', purpose: 'Zero chewing stress and smooth esophageal pass-through' }
    ],
    recipeSteps: [
      'Steep dried shiitake mushrooms, kombu, and crushed ginger root in simmering water for 15 minutes.',
      'Strain broth until crystal clear.',
      'Gently drop 1-inch cubes of silken organic tofu and baby bok choy halves into the warm nectar.',
      'Simmer for 3 minutes until tofu is warm and tender.',
      'Finish with a drop of toasted sesame oil and fresh chives.'
    ],
    likes: 495
  }
];

export function ComfortFoodLanding() {
  const [dishes, setDishes] = useState<ComfortDish[]>(DISHES_DATA);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDishModal, setSelectedDishModal] = useState<ComfortDish | null>(null);
  const [activeTabSection, setActiveTabSection] = useState<'landing' | 'menu' | 'ai_converter' | 'stories' | 'order_kit'>('landing');

  // Audio Ambient State
  const [isPlayingAmbient, setIsPlayingAmbient] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  // AI Reformulator State
  const [customDishInput, setCustomDishInput] = useState<string>('');
  const [isAiProcessing, setIsAiProcessing] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<{
    originalName: string;
    adaptedName: string;
    clinicalTag: string;
    sodiumReduction: string;
    keySwaps: { from: string; to: string; why: string }[];
    chefNotes: string;
  } | null>(null);

  // Order / Reservation Form State
  const [orderName, setOrderName] = useState<string>('Zenieverse');
  const [orderDishId, setOrderDishId] = useState<string>('dish-1');
  const [orderDate, setOrderDate] = useState<string>('2026-08-01');
  const [orderType, setOrderType] = useState<'meal_kit' | 'bistro_table'>('meal_kit');
  const [orderConfirmed, setOrderConfirmed] = useState<boolean>(false);

  // Stories State
  const ZEN_LOVE_LETTER = {
    id: 'st-zen',
    author: 'Zen, Anemia Recovery Champion',
    title: 'A Heartfelt Love Letter to Therapeutic Comfort & Anemia Healing',
    story: 'Finding therapeutic comfort meals that combine high bio-available iron, low-sodium warmth, and rich regional flavors transformed my daily recovery. Dr. T’s slow-cooked iron stew and golden collagen broth turned medical diet into pure culinary joy!',
    favoriteDish: 'Bio-Enhanced Iron Stew: Black Bean, Spinach & Citrus Slow Stew',
    category: '🩸 Anemia Iron-Boost',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    date: 'July 31, 2026',
    likes: 388
  };

  const [storiesList, setStoriesList] = useState<{
    id: string;
    author: string;
    title: string;
    story: string;
    favoriteDish: string;
    category?: string;
    imageUrl?: string;
    date: string;
    likes: number;
  }[]>(() => {
    try {
      const saved = localStorage.getItem('drt_love_letters');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((item: any) => {
          if (item.id === 'st-zen' || (item.author && item.author.includes('zenieverse'))) {
            return { ...item, author: 'Zen, Anemia Recovery Champion' };
          }
          return item;
        });
      }
    } catch (e) {
      // fallback
    }
    return [
      {
        id: 'st-zen',
        author: 'Zen, Anemia Recovery Champion',
        title: 'A Heartfelt Love Letter to Therapeutic Comfort & Anemia Healing',
        story: 'Finding therapeutic comfort meals that combine high bio-available iron, low-sodium warmth, and rich regional flavors transformed my daily recovery. Dr. T’s slow-cooked iron stew and golden collagen broth turned medical diet into pure culinary joy!',
        favoriteDish: 'Bio-Enhanced Iron Stew: Black Bean, Spinach & Citrus Slow Stew',
        category: '🩸 Anemia Iron-Boost',
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
        date: 'July 31, 2026',
        likes: 388
      },
      {
        id: 'st-0',
        author: 'Elena Rostova, Anemia & Fatigue Recovery',
        title: 'Revived Energy with Slow-Cooked Iron Stew',
        story: 'After months of chronic anemia fatigue, iron supplements kept causing painful stomach cramps. Dr. T’s Black Bean & Citrus Slow Stew gave me my strength back—14mg of natural iron paired with lime juice Vitamin C made a world of difference in my hemoglobin levels!',
        favoriteDish: 'Bio-Enhanced Iron Stew: Black Bean & Citrus',
        category: '🩸 Anemia Iron-Boost',
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
        date: 'July 31, 2026',
        likes: 142
      },
      {
        id: 'st-1',
        author: 'Dr. Evelyn Carter, Cardiologist',
        title: 'How Comfort Food Saved My Rehab Patients',
        story: 'When patients are told to cut salt and butter, they often feel like joy is stripped from their lives. Introducing Dr. T’s Golden Collagen Phở was a turning point—they felt cared for, comforted, and their blood pressure stabilized in weeks!',
        favoriteDish: 'Triple-Simmered Golden Collagen Phở',
        category: '🫀 Cardiac Care',
        imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
        date: 'July 28, 2026',
        likes: 124
      },
      {
        id: 'st-2',
        author: 'Marcus Vance, Dialysis Warrior',
        title: 'A Love Letter to Warm Mac & Cheese',
        story: 'I thought my mac and cheese days were over when I started renal monitoring. Finding the Golden Cauliflower Mac recipe gave me back Sunday family dinners without triggering a potassium spike.',
        favoriteDish: 'Golden Cauliflower Mac & Four-Herb Velvet',
        category: '🫘 Renal Safe',
        imageUrl: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80',
        date: 'July 30, 2026',
        likes: 89
      }
    ];
  });
  const [newStoryAuthor, setNewStoryAuthor] = useState<string>('');
  const [newStoryTitle, setNewStoryTitle] = useState<string>('');
  const [newStoryBody, setNewStoryBody] = useState<string>('');
  const [newStoryDish, setNewStoryDish] = useState<string>('Bio-Enhanced Iron Stew: Black Bean, Spinach & Citrus Slow Stew');
  const [newStoryCategory, setNewStoryCategory] = useState<string>('🩸 Anemia Iron-Boost');
  const [newStoryImage, setNewStoryImage] = useState<string>('');
  const [storyPublishToast, setStoryPublishToast] = useState<string | null>(null);
  const [expandedImageUrl, setExpandedImageUrl] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('Please choose an image under 8MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewStoryImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Toggle Ambient Bistro Fireplace Audio via Web Audio API
  const toggleAmbientAudio = () => {
    if (isPlayingAmbient) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      setIsPlayingAmbient(false);
    } else {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        // Create warm low drone + gentle crackle filter
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(110, ctx.currentTime); // Soft warm A2 tone
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, ctx.currentTime);

        gain.gain.setValueAtTime(0.08, ctx.currentTime); // Very gentle background volume

        osc.connect(filter);
        filter.connect(ctx.destination);
        osc.start();
        oscRef.current = osc;

        setIsPlayingAmbient(true);
      } catch (err) {
        console.error("Audio Context Init Error:", err);
      }
    }
  };

  // AI Comfort-ify Recipe function
  const handleAiReformulate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDishInput.trim()) return;

    setIsAiProcessing(true);
    setAiResult(null);

    // Simulate AI clinical reformulation with realistic smart responses
    setTimeout(() => {
      const dish = customDishInput.toLowerCase();
      let adaptedName = `Dr. T's Therapeutic ${customDishInput}`;
      let sodiumReduction = "82% Lower Sodium";
      let clinicalTag = "Cardiorenal Double-Safe";
      let keySwaps = [
        { from: 'Heavy Salt & Butter', to: 'Charred Garlic + Toasted Herbs + EVOO', why: 'Protects arterial wall flexibility and prevents fluid retention' },
        { from: 'Commercial Bouillon / Stock', to: 'Mushroom Dashi & Roasted Leek Broth', why: 'Infuses deep umami without potassium-sodium imbalance' },
        { from: 'Refined White Flour & Cream', to: 'Cauliflower Velvet & Nutritional Yeast', why: 'Stabilizes blood sugar and feeds gut microbiome' }
      ];

      if (dish.includes('anemia') || dish.includes('iron') || dish.includes('blood') || dish.includes('fatigue')) {
        adaptedName = `Iron & Ascorbic-Boosted Therapeutic ${customDishInput}`;
        clinicalTag = "Anemia Iron-Boost";
        sodiumReduction = "80% Lower Sodium + 15mg Bio Iron";
        keySwaps = [
          { from: 'Synthetic Iron Supplements (Causes Constipation)', to: 'Non-Heme Black Turtle Beans + Baby Spinach', why: 'Natural plant iron absorbed safely without GI distress' },
          { from: 'Calcium-Heavy Milk (Blocks Iron Absorption)', to: 'Key Lime & Citrus Reduction (Vitamin C)', why: 'Converts ferric (Fe3+) iron into 4x more absorbable ferrous (Fe2+) state' },
          { from: 'Refined White Flour', to: 'Toasted Pumpkin Seed (Pepita) & Quinoa Flour', why: 'Provides zinc, folate, and copper needed for red blood cell maturation' }
        ];
      } else if (dish.includes('patient') || dish.includes('recovery') || dish.includes('post-op') || dish.includes('nausea') || dish.includes('sick')) {
        adaptedName = `Gastric-Soothing Convalescent ${customDishInput}`;
        clinicalTag = "Post-Op Recovery";
        sodiumReduction = "85% Lower Sodium (Gentle Electrolytes)";
        keySwaps = [
          { from: 'High-Fat Cheese & Heavily Spiced Oil', to: 'Bone Marrow Collagen + Golden Turmeric Velvet', why: 'Repairs mucosal barrier and accelerates surgical tissue healing' },
          { from: 'Irritating Acidic Peppers', to: 'Micro-Filtered Fresh Ginger Root (Zingiberene)', why: 'Calms hyperactive nausea centers and restores appetite' },
          { from: 'Hard-to-Digest Fibrous Husks', to: 'Slow-Simmered Soft Jasmine Rice Congee', why: 'Provides immediate cellular glucose with zero digestive tax' }
        ];
      } else if (dish.includes('pizza') || dish.includes('pasta') || dish.includes('alfredo')) {
        adaptedName = `Artisanal Low-Sodium ${customDishInput} with Cashew Velvet`;
        sodiumReduction = "85% Lower Sodium (210mg total)";
      } else if (dish.includes('soup') || dish.includes('chowder') || dish.includes('ramen')) {
        adaptedName = `Golden Dashi Infused Therapeutic ${customDishInput}`;
        sodiumReduction = "88% Lower Sodium (195mg total)";
      }

      setAiResult({
        originalName: customDishInput,
        adaptedName: adaptedName,
        clinicalTag: clinicalTag,
        sodiumReduction: sodiumReduction,
        keySwaps: keySwaps,
        chefNotes: `Dr. T's AI Kitchen analyzed "${customDishInput}" and calibrated bioactive ingredients for optimal patient tolerance, mineral bio-absorption, and cardiovascular warmth!`
      });
      setIsAiProcessing(false);
    }, 1200);
  };

  const handleAddStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoryAuthor.trim() || !newStoryBody.trim()) return;

    const storyObj = {
      id: `st-${Date.now()}`,
      author: newStoryAuthor,
      title: newStoryTitle || "A Cozy Comfort Memory",
      story: newStoryBody,
      favoriteDish: newStoryDish || "Dr. T Comfort Recipe",
      category: newStoryCategory || "❤️ Patient Healing",
      imageUrl: newStoryImage || undefined,
      date: "Just now",
      likes: 1
    };

    const updated = [storyObj, ...storiesList];
    setStoriesList(updated);
    try {
      localStorage.setItem('drt_love_letters', JSON.stringify(updated));
    } catch (e) {
      // fallback
    }

    setNewStoryAuthor('');
    setNewStoryTitle('');
    setNewStoryBody('');
    setNewStoryImage('');
    setStoryPublishToast(`Love letter "${storyObj.title}" published successfully to the Global Healing Board! 💌`);
    setTimeout(() => {
      setStoryPublishToast(null);
    }, 5000);
  };

  const handleReloadZenStory = () => {
    const withoutZen = storiesList.filter((s) => s.id !== 'st-zen');
    const updated = [ZEN_LOVE_LETTER, ...withoutZen];
    setStoriesList(updated);
    try {
      localStorage.setItem('drt_love_letters', JSON.stringify(updated));
    } catch (e) {
      // fallback
    }
    setStoryPublishToast("Zen's Love Letter reloaded and pinned to top! 💌✨");
    setTimeout(() => {
      setStoryPublishToast(null);
    }, 5000);
  };

  const filteredDishes = dishes.filter((dish) => {
    const matchesCategory = selectedCategory === 'all' || dish.category === selectedCategory;
    const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          dish.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dish.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 font-sans rounded-3xl overflow-hidden shadow-2xl border border-stone-800 relative">
      
      {/* TOP LANDING BANNER / HEADER */}
      <header className="relative bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 border-b border-stone-800 p-6 md:p-10 overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5">
                <ChefHat className="w-3.5 h-3.5 text-amber-400" />
                PERFECT LANDING: COMFORT FOOD EDITION
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                100% Cardiorenal Safe
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Dr. T’s Healing Table <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-amber-500">• Comfort Food Redefined</span>
            </h1>

            <p className="text-sm md:text-base text-stone-300 max-w-2xl leading-relaxed font-sans">
              Where soul-warming culinary nostalgia meets cutting-edge cardiovascular and renal nutritional science. Taste the warmth of home without health compromise.
            </p>
          </div>

          {/* Quick Actions & Ambient Bistro Sound Toggle */}
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full lg:w-auto">
            <button
              onClick={toggleAmbientAudio}
              className={`w-full sm:w-auto px-4 py-3 rounded-2xl border text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isPlayingAmbient 
                  ? "bg-amber-500 text-stone-950 border-amber-400 font-extrabold shadow-lg shadow-amber-500/20" 
                  : "bg-stone-800/80 hover:bg-stone-800 text-stone-200 border-stone-700"
              }`}
            >
              {isPlayingAmbient ? <Volume2 className="w-4 h-4 animate-pulse text-stone-950" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
              <span>{isPlayingAmbient ? "Warm Bistro Ambient: ON" : "Play Cozy Ambient Sounds"}</span>
            </button>

            <button
              onClick={() => setActiveTabSection('ai_converter')}
              className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-mono font-bold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-rose-900/30 cursor-pointer transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>AI Comfort-ify Recipe</span>
            </button>
          </div>
        </div>
      </header>

      {/* NAVIGATION TABS FOR LANDING PAGE SECTIONS */}
      <nav className="bg-stone-950 border-b border-stone-800 px-6 py-3 sticky top-0 z-30 backdrop-blur-md bg-stone-950/90">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none text-xs font-mono font-bold">
            {[
              { id: 'landing', label: '1. Perfect Landing Home', icon: Flame },
              { id: 'menu', label: '2. Therapeutic Menu Showcase', icon: Utensils },
              { id: 'ai_converter', label: '3. AI Recipe Reformulator', icon: Sparkles },
              { id: 'stories', label: '4. Love Letters to Comfort Food', icon: BookOpen },
              { id: 'order_kit', label: '5. Order Comfort Meal Kit', icon: ShoppingBag }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTabSection === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabSection(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                    isActive 
                      ? "bg-amber-500 text-stone-950 font-black shadow-md shadow-amber-500/20" 
                      : "text-stone-400 hover:text-white hover:bg-stone-800/60"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-stone-950" : "text-stone-400"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono text-stone-400">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Kitchen Open • 24/7 AI Recipe Doctor</span>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto p-6 md:p-10 space-y-12">

        {/* SECTION 1: LANDING HERO SHOWCASE */}
        {activeTabSection === 'landing' && (
          <div className="space-y-12 animate-fadeIn">
            {/* HERO HERO FEATURED GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="p-2 bg-stone-800/80 rounded-2xl border border-stone-700/80 inline-flex items-center gap-2 text-xs font-mono text-amber-300">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Culinary Science Award Winner 2026</span>
                </div>

                <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                  Why Should Comfort Food Be Off-Limits to Healing Hearts?
                </h2>

                <p className="text-stone-300 text-sm md:text-base leading-relaxed">
                  For millions living with high blood pressure, heart failure, chronic kidney disease, or diabetes, classic comfort foods—creamy soups, warm stews, cheesy pasta—have traditionally been forbidden land. 
                </p>

                <p className="text-stone-300 text-sm md:text-base leading-relaxed">
                  Dr. T’s <strong>Cardiorenal Comfort Lab</strong> rewrites the rules. By replacing sodium spikes with aromatic umami chemistry and swapping saturated fats with silky plant emulsions, we deliver 100% emotional warmth with zero medical compromise.
                </p>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3.5 bg-stone-950/80 rounded-2xl border border-stone-800 space-y-1 text-center">
                    <span className="text-[10px] text-stone-400 font-mono block uppercase">Avg. Sodium</span>
                    <span className="text-xl font-black text-amber-400">&lt; 250 mg</span>
                    <span className="text-[9px] text-emerald-400 font-mono block">85% Lower</span>
                  </div>

                  <div className="p-3.5 bg-stone-950/80 rounded-2xl border border-stone-800 space-y-1 text-center">
                    <span className="text-[10px] text-stone-400 font-mono block uppercase">Comfort Rating</span>
                    <span className="text-xl font-black text-rose-400">98.8 / 100</span>
                    <span className="text-[9px] text-stone-400 font-mono block">Patient Approved</span>
                  </div>

                  <div className="p-3.5 bg-stone-950/80 rounded-2xl border border-stone-800 space-y-1 text-center">
                    <span className="text-[10px] text-stone-400 font-mono block uppercase">Preparation</span>
                    <span className="text-xl font-black text-emerald-400">&lt; 30 Mins</span>
                    <span className="text-[9px] text-stone-400 font-mono block">Chef Guided</span>
                  </div>

                  <div className="p-3.5 bg-stone-950/80 rounded-2xl border border-stone-800 space-y-1 text-center">
                    <span className="text-[10px] text-stone-400 font-mono block uppercase">AI Customizer</span>
                    <span className="text-xl font-black text-purple-400">Instant</span>
                    <span className="text-[9px] text-stone-400 font-mono block">Gemini 2.5 SDK</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    onClick={() => setActiveTabSection('menu')}
                    className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-mono font-bold text-xs rounded-2xl flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition-all"
                  >
                    <span>Browse Therapeutic Menu</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setActiveTabSection('order_kit')}
                    className="px-6 py-3.5 bg-stone-800 hover:bg-stone-700 text-stone-100 font-mono font-bold text-xs rounded-2xl flex items-center gap-2 border border-stone-700 cursor-pointer transition-all"
                  >
                    <ShoppingBag className="w-4 h-4 text-amber-400" />
                    <span>Order Comfort Kit</span>
                  </button>
                </div>
              </div>

              {/* HERO VISUAL BANNER / DISH CARD HIGHLIGHT */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 shadow-2xl group">
                  <img
                    src="https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80"
                    alt="Triple Simmered Golden Collagen Pho"
                    className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="bg-amber-500 text-stone-950 font-mono font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                        Featured Comfort Dish
                      </span>
                      <span className="text-amber-300 font-mono text-xs font-bold flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        99/100 Comfort Rating
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-white">
                      Triple-Simmered Golden Collagen Phở
                    </h3>

                    <p className="text-xs text-stone-300 line-clamp-2">
                      Deep star anise broth toasted with charred shallots and umami dashi. 280mg sodium vs. 2,200mg in traditional phở.
                    </p>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs font-mono text-emerald-400 font-bold">
                        Cardiorenal Double-Safe
                      </span>
                      <button
                        onClick={() => setSelectedDishModal(DISHES_DATA[0])}
                        className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-mono font-bold backdrop-blur-md cursor-pointer transition-all"
                      >
                        View Recipe &amp; Story
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* THREE PILLARS OF CLINICAL COMFORT FOOD */}
            <div className="space-y-4 pt-6">
              <div className="text-center space-y-1">
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">
                  THE SCIENCE OF SOUL FOOD
                </span>
                <h3 className="text-2xl font-black text-white">
                  Three Pillars of Dr. T’s Culinary Comfort Matrix
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-stone-950/80 border border-stone-800 rounded-3xl space-y-3 relative overflow-hidden">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Droplet className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-white">1. Umami Savor Chemistry</h4>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    By combining charred alliums, kombu glutamate, and toasted dried mushrooms, we trigger the palate's umami receptors, satisfying salt cravings with 85% less sodium.
                  </p>
                </div>

                <div className="p-6 bg-stone-950/80 border border-stone-800 rounded-3xl space-y-3 relative overflow-hidden">
                  <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                    <Heart className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-white">2. Vascular-Protective Emulsions</h4>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Heavy cream and butter are replaced with silky roasted cauliflower, nutritional yeast, and cold-pressed extra virgin olive oil to nurture endothelial health.
                  </p>
                </div>

                <div className="p-6 bg-stone-950/80 border border-stone-800 rounded-3xl space-y-3 relative overflow-hidden">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-white">3. Glycemic &amp; Renal Balance</h4>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Using ancient grains, pearl barley, and high-protein legume pasta ensures smooth glucose curves and minimal nephron filtration workload.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: THERAPEUTIC MENU SHOWCASE */}
        {activeTabSection === 'menu' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Menu Header & Search Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-stone-950 p-6 rounded-3xl border border-stone-800">
              <div>
                <h3 className="text-2xl font-black text-white">The Healing Comfort Menu</h3>
                <p className="text-xs text-stone-400 font-mono mt-1">
                  Filter by category or search your favorite comforting dish.
                </p>
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search soups, stews, mac & cheese..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded-2xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              {[
                { id: 'all', label: 'All Comfort Dishes' },
                { id: 'anemia', label: '🩸 Anemia Iron & Folate' },
                { id: 'general_patient', label: '🏥 General Patient & Recovery' },
                { id: 'soups', label: '🍲 Soups & Broths' },
                { id: 'stews', label: '🥘 Slow Stews & Risottos' },
                { id: 'comfort_classics', label: '🧀 Bakes & Classics' },
                { id: 'desserts', label: '🥧 Guilt-Free Desserts' },
                { id: 'heritage', label: '🌏 Heritage Comfort' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl border transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? "bg-amber-500 text-stone-950 border-amber-400 font-extrabold shadow-md shadow-amber-500/20"
                      : "bg-stone-950 text-stone-300 border-stone-800 hover:border-stone-700"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Dishes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDishes.map((dish) => (
                <div
                  key={dish.id}
                  className="bg-stone-950 border border-stone-800 hover:border-amber-500/50 rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 group"
                >
                  <div className="space-y-3">
                    {/* Dish Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-stone-950/80 backdrop-blur-md text-amber-300 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border border-stone-700 flex items-center gap-1">
                        <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
                        {dish.comfortScore}/100
                      </div>

                      <div className="absolute bottom-3 left-3 bg-emerald-500/90 text-stone-950 text-[10px] font-mono font-extrabold px-2.5 py-1 rounded-full">
                        {dish.clinicalBadge}
                      </div>
                    </div>

                    {/* Dish Info */}
                    <div className="p-5 space-y-3">
                      <div>
                        <span className="text-[10px] font-mono text-amber-400 uppercase font-bold block">
                          {dish.categoryLabel} • {dish.prepTime}
                        </span>
                        <h4 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                          {dish.name}
                        </h4>
                        <p className="text-xs text-stone-400 mt-1 line-clamp-2">
                          {dish.description}
                        </p>
                      </div>

                      {/* Nutrition Pills */}
                      <div className={`grid ${dish.nutrition.ironMg ? 'grid-cols-4' : 'grid-cols-3'} gap-2 bg-stone-900/80 p-2 rounded-xl border border-stone-800 text-[11px] font-mono`}>
                        <div>
                          <span className="text-stone-500 text-[9px] block uppercase">Sodium</span>
                          <span className="text-amber-400 font-bold">{dish.nutrition.sodiumMg} mg</span>
                        </div>
                        <div>
                          <span className="text-stone-500 text-[9px] block uppercase">Calories</span>
                          <span className="text-stone-200 font-bold">{dish.nutrition.calories} kcal</span>
                        </div>
                        <div>
                          <span className="text-stone-500 text-[9px] block uppercase">Protein</span>
                          <span className="text-emerald-400 font-bold">{dish.nutrition.proteinG} g</span>
                        </div>
                        {dish.nutrition.ironMg && (
                          <div>
                            <span className="text-stone-500 text-[9px] block uppercase">Bio Iron</span>
                            <span className="text-rose-400 font-bold">{dish.nutrition.ironMg} mg</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="p-5 pt-0 flex items-center gap-2">
                    <button
                      onClick={() => setSelectedDishModal(dish)}
                      className="w-full py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-100 rounded-2xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 cursor-pointer border border-stone-700 transition-all"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                      <span>View Recipe &amp; Story</span>
                    </button>

                    <button
                      onClick={() => {
                        setOrderDishId(dish.id);
                        setActiveTabSection('order_kit');
                      }}
                      className="px-3.5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-2xl text-xs font-mono font-extrabold flex items-center justify-center shrink-0 cursor-pointer transition-all"
                      title="Order Meal Kit"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 3: AI RECIPE REFORMULATOR */}
        {activeTabSection === 'ai_converter' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-6 md:p-8 bg-stone-950 border border-stone-800 rounded-3xl space-y-6">
              <div className="space-y-2">
                <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-widest inline-flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  GEMINI 2.5 POWERED CULINARY DOCTOR
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-white">
                  Comfort-ify Any Guilty Pleasure Dish Live
                </h3>
                <p className="text-xs md:text-sm text-stone-300 font-sans leading-relaxed max-w-3xl">
                  Type any indulgence (e.g. <i>"Deep Dish Pizza"</i>, <i>"Clam Chowder"</i>, <i>"Chicken Fried Steak"</i>) and Dr. T’s AI Kitchen will adapt it into a cardiorenal-safe therapeutic comfort recipe!
                </p>
              </div>

              {/* Form Input */}
              <form onSubmit={handleAiReformulate} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <ChefHat className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="Enter dish name (e.g., Creamy Fettuccine Alfredo, Potato Soup, Ramen)..."
                    value={customDishInput}
                    onChange={(e) => setCustomDishInput(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-2xl pl-10 pr-4 py-3 text-xs md:text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isAiProcessing}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-mono font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 transition-all shrink-0"
                >
                  {isAiProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Re-engineering Chemistry...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Comfort-ify Recipe</span>
                    </>
                  )}
                </button>
              </form>

              {/* AI RESULT DISPLAY */}
              {aiResult && (
                <div className="p-6 bg-stone-900 border border-amber-500/40 rounded-2xl space-y-4 animate-fadeIn">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 pb-3">
                    <div>
                      <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">
                        AI CULINARY DIAGNOSTIC RESULT
                      </span>
                      <h4 className="text-xl font-bold text-white">{aiResult.adaptedName}</h4>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full font-bold">
                        {aiResult.clinicalTag}
                      </span>
                      <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full font-bold">
                        {aiResult.sodiumReduction}
                      </span>
                    </div>
                  </div>

                  {/* Key Swaps Grid */}
                  <div className="space-y-2">
                    <span className="text-xs font-mono font-bold text-stone-300 uppercase block">
                      🧪 Clinical Ingredient Swaps:
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {aiResult.keySwaps.map((swap, idx) => (
                        <div key={idx} className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-1 text-xs">
                          <div className="text-rose-400 font-mono text-[11px] line-through">From: {swap.from}</div>
                          <div className="text-emerald-400 font-mono text-[11px] font-bold">To: {swap.to}</div>
                          <div className="text-stone-400 text-[10px] pt-1">{swap.why}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-xs text-stone-300 leading-relaxed font-sans">
                    <strong>Dr. T Chef's Note:</strong> {aiResult.chefNotes}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SECTION 4: LOVE LETTERS TO COMFORT FOOD */}
        {activeTabSection === 'stories' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-6 bg-stone-950 border border-stone-800 rounded-3xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-black text-white">Love Letters to Regional Comfort Food</h3>
                  <p className="text-xs text-stone-400 font-mono mt-1">
                    Real patient stories, doctor testimonials, and memories revived by therapeutic comfort cooking.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleReloadZenStory}
                    className="text-xs font-mono bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-extrabold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 cursor-pointer transition-all shadow-md shadow-amber-500/20 active:scale-95"
                    title="Reload Zen's Love Letter to the top of the board"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reload Zen's Love Letter</span>
                  </button>
                  <div className="text-xs font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30 px-3.5 py-1.5 rounded-full font-bold flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{storiesList.length} Letters Published</span>
                  </div>
                </div>
              </div>

              {/* Toast Message */}
              {storyPublishToast && (
                <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl text-emerald-300 text-xs font-mono font-bold flex items-center justify-between animate-fadeIn shadow-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{storyPublishToast}</span>
                  </div>
                  <button 
                    onClick={() => setStoryPublishToast(null)}
                    className="text-stone-400 hover:text-white cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* Story Form & Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Form */}
              <div className="lg:col-span-5 p-6 bg-stone-950 border border-stone-800 rounded-3xl space-y-4 text-xs font-mono">
                <div className="flex items-center gap-2 text-amber-400 font-bold uppercase text-xs">
                  <Send className="w-4 h-4" />
                  <h4>Publish Your Comfort Love Letter</h4>
                </div>
                <form onSubmit={handleAddStory} className="space-y-3">
                  <div>
                    <label className="text-stone-300 block mb-1">Your Name &amp; Title / Condition</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins, Anemia Patient"
                      value={newStoryAuthor}
                      onChange={(e) => setNewStoryAuthor(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500 font-sans text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-stone-300 block mb-1">Story Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Reclaiming Sunday Family Soups"
                      value={newStoryTitle}
                      onChange={(e) => setNewStoryTitle(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500 font-sans text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-stone-300 block mb-1">Healing Category</label>
                      <select
                        value={newStoryCategory}
                        onChange={(e) => setNewStoryCategory(e.target.value)}
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500 font-mono text-xs cursor-pointer"
                      >
                        <option value="🩸 Anemia Iron-Boost">🩸 Anemia Iron-Boost</option>
                        <option value="🏥 Post-Op & Recovery">🏥 Post-Op &amp; Recovery</option>
                        <option value="🫀 Cardiac Care">🫀 Cardiac Care</option>
                        <option value="🫘 Renal Safe">🫘 Renal Safe</option>
                        <option value="🛋️ Family Heritage">🛋️ Family Heritage</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-stone-300 block mb-1">Favorite Dish</label>
                      <select
                        value={newStoryDish}
                        onChange={(e) => setNewStoryDish(e.target.value)}
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500 font-mono text-xs cursor-pointer"
                      >
                        {dishes.map((d) => (
                          <option key={d.id} value={d.name}>
                            {d.name.length > 32 ? d.name.slice(0, 32) + '...' : d.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-stone-300 block mb-1">Your Comfort Food Memory &amp; Healing Experience</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Share how a therapeutic comfort meal brought back warmth, restored your appetite, or supported your clinical recovery..."
                      value={newStoryBody}
                      onChange={(e) => setNewStoryBody(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500 font-sans text-xs"
                    />
                  </div>

                  {/* Image Upload Field */}
                  <div>
                    <label className="text-stone-300 block mb-1">Attach Photo / Meal Memory (Optional)</label>
                    {newStoryImage ? (
                      <div className="relative rounded-2xl overflow-hidden border border-amber-500/40 bg-stone-900 group">
                        <img src={newStoryImage} alt="Uploaded preview" className="w-full h-36 object-cover" />
                        <button
                          type="button"
                          onClick={() => setNewStoryImage('')}
                          className="absolute top-2 right-2 p-1.5 bg-stone-950/80 hover:bg-rose-900 text-stone-200 hover:text-white rounded-full border border-stone-700 transition-all cursor-pointer"
                          title="Remove image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-2 left-2 px-2 py-1 bg-stone-950/80 rounded-lg text-[10px] text-amber-300 font-mono flex items-center gap-1 border border-stone-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Photo Attached</span>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-stone-800 hover:border-amber-500/50 rounded-2xl p-4 text-center bg-stone-900/50 hover:bg-stone-900 transition-all group relative cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="flex flex-col items-center justify-center gap-1 text-stone-400 group-hover:text-amber-300">
                          <div className="p-2 rounded-full bg-stone-800/80 group-hover:bg-amber-500/20 text-stone-300 group-hover:text-amber-400 transition-all">
                            <Upload className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-xs">Click or drop photo here</span>
                          <span className="text-[10px] text-stone-500">PNG, JPG, WEBP up to 8MB</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-extrabold font-mono text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md shadow-amber-500/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish Love Letter</span>
                  </button>
                </form>
              </div>

              {/* Story Cards List */}
              <div className="lg:col-span-7 space-y-4">
                {storiesList.map((st) => {
                  const isZen = st.id === 'st-zen';
                  return (
                  <div 
                    key={st.id} 
                    className={`p-6 bg-stone-950 border ${isZen ? 'border-amber-500/60 shadow-lg shadow-amber-500/10' : 'border-stone-800 hover:border-stone-700'} rounded-3xl space-y-3 transition-all relative overflow-hidden`}
                  >
                    {isZen && (
                      <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-orange-500 text-stone-950 font-mono text-[9px] font-extrabold px-3 py-1 rounded-bl-xl uppercase tracking-wider flex items-center gap-1 shadow-sm">
                        <Sparkles className="w-3 h-3 fill-stone-950" />
                        <span>Zen's Pinned Letter</span>
                      </div>
                    )}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-mono font-bold ${isZen ? 'text-amber-300 font-extrabold' : 'text-amber-400'}`}>{st.author}</span>
                        {st.category && (
                          <span className="text-[10px] font-mono bg-stone-900 border border-stone-800 text-stone-300 px-2 py-0.5 rounded-md">
                            {st.category}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-stone-500">{st.date}</span>
                    </div>

                    <h4 className="text-base font-bold text-white">{st.title}</h4>

                    {st.imageUrl && (
                      <div 
                        onClick={() => setExpandedImageUrl(st.imageUrl!)}
                        className="relative rounded-2xl overflow-hidden border border-stone-800 bg-stone-900 group cursor-pointer hover:border-amber-500/50 transition-all p-1.5"
                      >
                        <img 
                          src={st.imageUrl} 
                          alt={st.title} 
                          className="w-full h-auto max-h-[500px] object-contain rounded-xl mx-auto bg-stone-950/60" 
                        />
                        <div className="absolute bottom-3 right-3 px-2 py-1 bg-stone-950/85 rounded-lg text-[10px] text-amber-300 font-mono flex items-center gap-1.5 border border-stone-800 backdrop-blur-md opacity-90 group-hover:opacity-100 transition-opacity">
                          <Maximize2 className="w-3 h-3 text-amber-400" />
                          <span>Click for Full Screen</span>
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-stone-300 leading-relaxed font-sans italic bg-stone-900/50 p-3 rounded-xl border border-stone-800/80">
                      "{st.story}"
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono pt-2 border-t border-stone-800/60">
                      <div className="flex items-center gap-1.5 text-stone-400">
                        <span>Favorite Dish:</span>
                        <strong className="text-emerald-400 font-sans text-xs">{st.favoriteDish}</strong>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            const updated = storiesList.map(s => s.id === st.id ? { ...s, likes: s.likes + 1 } : s);
                            setStoriesList(updated);
                            try {
                              localStorage.setItem('drt_love_letters', JSON.stringify(updated));
                            } catch (e) {}
                          }}
                          className="text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer bg-stone-900 px-2.5 py-1 rounded-lg border border-stone-800"
                        >
                          <Heart className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{st.likes} Warm Hearts</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveTabSection('order_kit');
                          }}
                          className="text-stone-400 hover:text-white flex items-center gap-1 cursor-pointer bg-stone-900 px-2.5 py-1 rounded-lg border border-stone-800"
                          title="Order Meal Kit"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                          <span>Order Kit</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 5: ORDER MEAL KIT / RESERVATION */}
        {activeTabSection === 'order_kit' && (
          <div className="p-8 bg-stone-950 border border-stone-800 rounded-3xl space-y-6 max-w-2xl mx-auto animate-fadeIn text-xs font-mono">
            <div className="space-y-1 text-center">
              <ShoppingBag className="w-8 h-8 text-amber-400 mx-auto" />
              <h3 className="text-2xl font-black text-white">Order Dr. T Comfort Meal Kit</h3>
              <p className="text-stone-400 font-sans text-xs">
                Freshly prepped, vacuum-sealed therapeutic comfort meal kits delivered directly to your doorstep.
              </p>
            </div>

            {orderConfirmed ? (
              <div className="p-6 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="text-base font-bold text-white">Order &amp; Reservation Confirmed!</h4>
                <p className="text-stone-300 font-sans text-xs">
                  Thank you, <strong>{orderName}</strong>! Your Dr. T Comfort Meal Kit is scheduled for dispatch on {orderDate}.
                </p>
                <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 inline-block">
                  <QrCode className="w-16 h-16 text-amber-400 mx-auto" />
                  <span className="text-[10px] text-stone-500 mt-1 block">Ticket #DRT-COMFORT-8821</span>
                </div>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setOrderConfirmed(true);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="text-stone-300 block mb-1 font-bold">Your Name</label>
                  <input
                    type="text"
                    required
                    value={orderName}
                    onChange={(e) => setOrderName(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-stone-300 block mb-1 font-bold">Select Comfort Dish</label>
                  <select
                    value={orderDishId}
                    onChange={(e) => setOrderDishId(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    {dishes.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.clinicalBadge} • {d.nutrition.sodiumMg}mg Na)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-stone-300 block mb-1 font-bold">Preferred Date</label>
                    <input
                      type="date"
                      required
                      value={orderDate}
                      onChange={(e) => setOrderDate(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-stone-300 block mb-1 font-bold">Fulfilment Type</label>
                    <select
                      value={orderType}
                      onChange={(e) => setOrderType(e.target.value as any)}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                    >
                      <option value="meal_kit">Chilled Meal Kit Delivery</option>
                      <option value="bistro_table">Bistro Table Reservation</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-black text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Confirm Comfort Order</span>
                </button>
              </form>
            )}
          </div>
        )}

      </main>

      {/* DISH RECIPE MODAL */}
      {selectedDishModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-5 text-stone-100 relative shadow-2xl animate-fadeIn">
            {/* Close Button */}
            <button
              onClick={() => setSelectedDishModal(null)}
              className="absolute top-4 right-4 p-2 bg-stone-800 hover:bg-stone-700 rounded-full text-stone-300 cursor-pointer transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="space-y-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase">
                {selectedDishModal.clinicalBadge}
              </span>
              <h3 className="text-2xl font-black text-white">{selectedDishModal.name}</h3>
              <p className="text-xs text-stone-400 font-mono">{selectedDishModal.subtitle}</p>
            </div>

            {/* Clinical Story */}
            <div className="p-4 bg-stone-950 rounded-2xl border border-stone-800 text-xs text-stone-300 leading-relaxed font-sans space-y-1">
              <strong className="text-amber-400 font-mono block text-[11px] uppercase">
                🩺 Dr. T’s Clinical Story &amp; Rationale:
              </strong>
              <p>{selectedDishModal.clinicalStory}</p>
            </div>

            {/* Ingredient Swaps */}
            <div className="space-y-2 font-mono text-xs">
              <span className="font-bold text-stone-300 uppercase block">
                🧪 Therapeutic Ingredient Swaps:
              </span>
              <div className="space-y-2">
                {selectedDishModal.ingredients.map((ing, idx) => (
                  <div key={idx} className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-1">
                    <div className="text-rose-400 text-[11px] line-through">Traditional: {ing.originalGuiltyItem}</div>
                    <div className="text-emerald-400 text-[11px] font-bold">Dr. T Substitute: {ing.drTSubstitute}</div>
                    <div className="text-stone-400 text-[10px]">{ing.purpose}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recipe Steps */}
            <div className="space-y-2 font-mono text-xs">
              <span className="font-bold text-stone-300 uppercase block">
                👨‍🍳 Step-by-Step Healing Recipe:
              </span>
              <ol className="space-y-2 font-sans text-xs text-stone-300 list-decimal pl-4 leading-relaxed">
                {selectedDishModal.recipeSteps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>

            <button
              onClick={() => setSelectedDishModal(null)}
              className="w-full py-3 bg-stone-800 hover:bg-stone-700 text-white font-mono font-bold text-xs rounded-xl cursor-pointer transition-all"
            >
              Close Recipe
            </button>
          </div>
        </div>
      )}

      {/* FULL ATTACHED IMAGE LIGHTBOX MODAL */}
      {expandedImageUrl && (
        <div 
          onClick={() => setExpandedImageUrl(null)}
          className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn cursor-zoom-out"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] bg-stone-900 border border-stone-800 rounded-3xl p-3 shadow-2xl flex flex-col items-center cursor-default"
          >
            <button
              onClick={() => setExpandedImageUrl(null)}
              className="absolute top-4 right-4 z-10 p-2.5 bg-stone-950/80 hover:bg-stone-800 text-stone-200 hover:text-white rounded-full border border-stone-700 cursor-pointer transition-all shadow-lg"
              title="Close full view"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={expandedImageUrl}
              alt="Full attached meal photo"
              className="max-w-full max-h-[82vh] object-contain rounded-2xl shadow-inner"
            />
            <div className="mt-3 text-center text-xs font-mono text-stone-400 flex items-center gap-2 pb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Full Resolution Attached Love Letter Photo</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
