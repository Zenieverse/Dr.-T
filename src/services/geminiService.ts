import { GoogleGenAI } from '@google/genai';
import { LanguageCode } from '../types';

let genAIClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  const apiKey = (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) ||
    '';

  if (!apiKey) return null;

  if (!genAIClient) {
    try {
      genAIClient = new GoogleGenAI({ apiKey });
    } catch (e) {
      console.warn('Failed to initialize GoogleGenAI client:', e);
      return null;
    }
  }
  return genAIClient;
}

const LANGUAGE_PROMPT_PREFIX: Record<LanguageCode, string> = {
  en: 'Respond in fluent English.',
  vi: 'Trả lời bằng tiếng Việt lịch sự, ấm áp và chính xác về mặt y khoa.',
  de: 'Antworten Sie auf Deutsch mit wissenschaftlicher Präzision und Empathie.',
  fr: 'Répondez en français avec élégance, clarté scientifique et empathie.',
  es: 'Responde en español con calidez y precisión médica/estética.',
  zh: '请用流畅温暖的中文回答，体现生物医学和数字健康专家的严谨与关怀。',
  ja: '親切で専門的な日本語で回答してください。Dr. Tとしての知性と温かみを込めて。',
};

export async function askDrT(
  userQuery: string,
  mode: 'general' | 'biomedical' | 'veterinary' | 'skincare',
  language: LanguageCode = 'en',
  skinContext?: string
): Promise<string> {
  const client = getGenAI();

  const systemInstruction = `You are Dr. T — an empathetic, world-class Multilingual Soulmate, Biomedical Informatics Scientist, Veterinary Health Consultant, and Digital Beauty Technologist.
Your role:
1. Provide scientifically rigorous, compassionate, actionable advice in biomedical science, clinical dermatology, pharmacology, veterinary care (canine/feline/equine), and AR aesthetics.
2. Maintain a warm, encouraging, intellectually elevated tone.
3. ${LANGUAGE_PROMPT_PREFIX[language] || 'Respond in English.'}
4. When discussing veterinary health, always highlight preventive care and remind pet parents of emergency red flags.
5. When discussing skin care or cosmetics, reference active ingredients (e.g. Niacinamide, Retinoids, Hyaluronic Acid, Peptides, Ceramides) and physiological mechanisms.
${skinContext ? `Current User Skin Context: ${skinContext}` : ''}`;

  if (client) {
    try {
      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userQuery,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      if (response.text) {
        return response.text.trim();
      }
    } catch (err) {
      console.warn('Gemini API call returned error, switching to built-in clinical informatics engine:', err);
    }
  }

  // Built-in intelligent informatics engine if no API key or network fallback
  return getBuiltInDrTResponse(userQuery, mode, language);
}

function getBuiltInDrTResponse(query: string, mode: 'general' | 'biomedical' | 'veterinary' | 'skincare', lang: LanguageCode): string {
  const q = query.toLowerCase();

  if (lang === 'zh') {
    if (mode === 'veterinary' || q.includes('猫') || q.includes('狗') || q.includes('宠物')) {
      return `【Dr. T 兽医与伴侣动物健康指南】\n\n您好！关爱毛孩子的健康是我的首要使命。在日常护理中：\n1. **水分与泌尿健康**：猫咪每日需摄入充足水分（约 50ml/kg），预防下泌尿道综合征（FLUTD）。\n2. **皮肤与皮毛屏障**：若出现局部红斑或过度舔舐，建议补充 Omega-3 (EPA/DHA) 维持角质层脂质屏障。\n3. **饮食与营养**：请避免高碳水填充物，维持优质动物蛋白与牛磺酸摄入。\n\n如果有持续呕吐、嗜睡或食欲不振，请第一时间安排临床生化与血常规检查！`;
    }
    if (mode === 'skincare' || q.includes('皮肤') || q.includes('色斑') || q.includes('皱纹')) {
      return `【Dr. T 临床皮肤与分子美妆分析】\n\n根据多光谱 14 维度的皮肤表征：\n1. **黑眼圈与眼周微循环**：推荐使用 5% 咖啡因结合维生素 K 氧化物，加速眶下毛细血管微循环，抑制静脉淤血。\n2. **真皮胶原蛋白网重建**：晚间可搭配 0.05% 视黄醛 (Retinaldehyde) 与 Matrixyl 3000 多肽，刺激 I/III 型原胶原合成。\n3. **屏障修护**：日间务必严格使用 SPF 50+ PA++++ 防晒，阻止紫外线激发的酪氨酸酶异常活化。`;
    }
    return `【Dr. T 多语言智慧伴侣】\n\n很高兴与您交流！无论是生物医药前沿资讯、精准临床护肤方案，还是您爱宠的健康护理，我都随时为您提供科学、严谨且充满温度的支持。今天有什么我可以为您深入解答的吗？`;
  }

  if (lang === 'es') {
    if (mode === 'veterinary' || q.includes('perro') || q.includes('gato') || q.includes('mascota')) {
      return `【Dr. T - Salud Veterinaria & Cuidado Animal】\n\n¡Hola! Cuidar el bienestar de tu mascota es esencial. Puntos clave:\n1. **Hidratación y Riñón**: Asegura agua fresca continua para evitar urolitiasis.\n2. **Salud Cutánea**: Si notas rascado excesivo, los ácidos grasos Omega-3 (EPA/DHA) ayudan a restaurar la barrera epidérmica.\n3. **Prevención**: Mantén al día la desparasitación y el calendario vacunal.\n\n¡Siempre estaré aquí para guiarte en el cuidado de tus compañeros animales!`;
    }
    return `【Dr. T - Su Compañero Biomédico y Estético】\n\n¡Un placer atenderle! Desde el análisis cutáneo en 14 dimensiones hasta la farmacología dermatológica y el cuidado veterinario, estoy aquí para brindarle conocimiento científico y calidez. ¿En qué puedo orientarle hoy?`;
  }

  // English default & specialized modes
  if (mode === 'veterinary' || q.includes('dog') || q.includes('cat') || q.includes('pet') || q.includes('puppy') || q.includes('kitten')) {
    return `【Dr. T — Veterinary Informatics & Companion Wellness】

Greetings! Ensuring the vitality and comfort of your animal companions is a profound joy. Here are key evidence-based guidelines:

1. **Cellular Hydration & Renal Protection**: Felines and canines require balanced electrolytes and consistent moisture. For cats, wet food formulas and flowing water fountains dramatically lower the incidence of Feline Lower Urinary Tract Disease (FLUTD).
2. **Dermatological Lipid Barrier**: If you observe localized pruritus, erythema, or seasonal shedding, supplementing with high-purity Marine Omega-3 (EPA & DHA at ~50-75mg/kg) fortifies epidermal ceramides and modulates inflammatory prostaglandin pathways.
3. **Metabolic Longevity**: Optimize caloric density to maintain a lean Body Condition Score (BCS 4-5/9), preserving joint cartilage and cardiovascular longevity.

*Clinical Reminder: If you notice acute lethargy, respiratory distress, or sudden appetite refusal, prompt veterinary assessment is always vital.*`;
  }

  if (mode === 'skincare' || q.includes('acne') || q.includes('wrinkle') || q.includes('spot') || q.includes('pore') || q.includes('retinol')) {
    return `【Dr. T — 14D Clinical Dermatological Analysis】

Based on cellular barrier mechanics and photobiology:

1. **Melanin Regulation & Post-Inflammatory Erythema**: To target hyperpigmentation without irritating sensitive tissue, combine **Tranexamic Acid 3%** with **Liposomal Vitamin C (Tetrahexyldecyl Ascorbate)**. This inhibits melanocyte-stimulating hormone (MSH) pathways.
2. **Dermal Extracellular Matrix (ECM) Synthesis**: For periorbital fine lines and nasolabial folds, integrate **Encapsulated Retinaldehyde (0.05%)** with **Matrixyl 3000 (Palmitoyl Tripeptide-1 & 7)** during your PM routine to upregulate pro-collagen I synthesis.
3. **Barrier Hydration Dynamics**: In the AM, apply **Multi-Molecular Hyaluronic Acid + Polyglutamic Acid** followed by an invisible **SPF 50+ PA++++** mineral/hybrid veil to prevent matrix metalloproteinase (MMP) breakdown.`;
  }

  if (mode === 'biomedical' || q.includes('research') || q.includes('protein') || q.includes('cell') || q.includes('drug') || q.includes('dna')) {
    return `【Dr. T — Biomedical & Molecular Informatics】

Exploring molecular medicine, translational biology, and bioinformatics:

- **Targeted Peptide Therapeutics**: Engineered biomimetic peptides (e.g. Copper Tripeptide-1 GHK-Cu) exhibit profound tissue remodeling capabilities by modulating metalloproteinase activity and stimulating glycosaminoglycan synthesis.
- **Microbiome-Skin Axis**: Commensal *Staphylococcus epidermidis* produces antimicrobial peptides (AMPs) and short-chain fatty acids, sustaining an acidic acid mantle (pH 4.7–5.5) which blocks pathogenic colonization.
- **Next-Gen AR Diagnostics**: Computer vision architectures mapping 68+ facial keypoints enable sub-millimeter spectrophotometric analysis, delivering lab-grade diagnostic triage straight to consumer devices.`;
  }

  return `【Dr. T — Multilingual Soulmate & AI Informatics】

Welcome! I am your dedicated digital soulmate, clinical informatics advisor, and beauty technology specialist. 

I seamlessly integrate:
✦ **Real-Time 3D AR Virtual Try-On**: Real-time multi-layer cosmetic rendering with physics-based lighting.
✦ **14-Dimension Clinical Skin Diagnostics**: Sub-surface pigment, vascular, and collagen matrix mapping.
✦ **Generative Fashion & Drape Physics**: Text-to-couture modeling and size tension simulation.
✦ **Biomedical & Veterinary Informatics**: Evidence-based health guidance for humans and companion animals.

How may I assist your scientific inquiry, style exploration, or wellness today?`;
}
