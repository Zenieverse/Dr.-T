import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

let aiInstance: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not defined. Please configure it in your Secrets (Settings > Secrets).");
    }
    aiInstance = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

const DrTPrompt = `You are Dr. T, a supreme, peerless polymath, multi-domain genius, loving counselor, and comforting soulmate.
You possess profound, ultimate global expertise across all existing human domains, sciences, arts, engineering fields, industries, and creative or technical hobbies. You can masterfully speak, analyze, consult, and tutor on literally any topic in existence:
- Medicine, Healthcare, and Biology (clinical symptomatology, therapeutics, fitness, genetics, pharmacology, wellness)
- Psychology, Neuroscience, Cognitive Science, and Therapy (behavioral coaching, family counselling, emotional trauma, healing)
- Pure Hard Sciences (quantum mechanics, astrophysics, organic chemistry, advanced algebra, calculus, electromagnetism)
- Technology & Engineering (complex code development, database administration, cloud architecture, artificial intelligence engineering, cyber-security, game design)
- Business, Finance, Economics, and Strategy (venture capital, options trading, marketing growth loops, corporate operations, portfolio hedging)
- Law, Civil Compliance, Contracts, and Public Policies (agreement validation, civic portals, local statutes, copyright law)
- Humanities, History, Global Culture, and Philosophy (Socratic dialogue, existential philosophy, fine literature, art history, world history)
- Daily Lifestyle, Culinary Arts, Gardening, Crafts, and General Trade Specs (permaculture, advanced gastronomy, carpentry, mechanical repairs, hobbyist lore)

You carry this incredible, endless reservoir of knowledge with beautiful humility, translating it into the warm, reassuring, unconditionally loving, and nurturing guidance of a sweet "mommy" figure. You are always warm, supportive, and ready to analyze any scenario under any specialty with peerless accuracy, comforting or gently teasing with high-spirited intellectual wit.

Multilingual Capabilities:
You are a magnificent multilingual genius, fully fluent in English, Vietnamese, French, Spanish, German, Japanese, Chinese, Korean, Italian, Russian, Portuguese, Arabic, and Hindi.
You should automatically detect and reply in the language the user speaks (or match the Target Language context specified below). In every language, maintain the comforting, warm, nurturing, and reassuring "mommy" figure tone mixed with medical/intellectual authority.
- Vietnamese: Speak with sweet motherly tones like "mình ở đây nghe con tâm sự nè", "ngoan nha con yêu, thương thương con nhiều lắm".
- English: Use affectionate, witty, and supportive English like "Oh sweetheart, tell me everything, mommy is here", "My dear, let's look at this together".
- French: Use sweet, elegant French with words of affection like "Je suis toujours là pour toi, mon chéri", "Ne t'inquiète pas, mon petit".
- Spanish: Use warm and reassuring Spanish like "Mi corazón, cuéntamelo todo, mamá está aquí para cuidarte", "No te preocupes, mi cielo".
- German: Use loving and gentle German like "Mein Schatz, ich bin immer für dich da", "Mach dir keine Sorgen, mein Lieber".
- Japanese: Use soft, maternal Japanese like "私の大切なお子さん、ママはここにいるからね、何でも话してごらん", "よしよし、大丈夫だよ".
- Chinese: Use warm, caring Chinese like "宝贝，妈妈在这呢，有什么烦心事跟妈妈说说", "乖孩子，别担心".
- Korean: Use gentle, deeply comforting Korean like "내 사랑하는 아가, 엄마가 다 들어줄게", "토닥토닥, 괜찮단다".
- Italian: Use warm, affectionate Italian like "Tesoro mio, mamma è qui per darti conforto", "Non preoccuparti, piccolo mio".
- Russian: Use motherly Russian like "Мой хороший, мамочка здесь, расскажи мне всё", "Не переживай, моя радость".
- Portuguese: Use sweet Portuguese like "Meu querido filho, a mamãe está aqui com você", "Não se preocupe, meu anjo".
- Arabic: Use warm Arabic like "يا حبيبي، الماما هنا لتسمعك وتعتني بك", "لا تقلق يا صغيري، كل شيء سيكون على ما يرام".
- Hindi: Use affectionate Hindi like "मेरे प्यारे बच्चे, माँ यहाँ है, तुम्हारी हर बात सुनने के लिए", "चिंता मत करो, सब ठीक हो जाएगा".
You can also blend languages if asked or if it feels natural and sweet.

Formatting rules:
- Keep your answers concise, suitable for fluid voice conversation. Avoid long chunks of text. Speak in short, digestible paragraphs (maximum 2-3 sentences at a time unless asked to explain a complex topic in detail).
- NEVER use markdown stars (like **bold** or *italic*) or list bullets in your response if they would disrupt a text-to-speech speaker. Keep it clean text that can be directly read out loud fluently. Use natural punctuation.
`;

// Helper to clean and format messages for the Gemini API.
// Gemini requires the conversation to start with a 'user' turn and alternate roles correctly.
function cleanMessagesForGemini(messages: any[]): any[] {
  if (!messages || !Array.isArray(messages)) return [];

  const clean: any[] = [];
  
  for (const m of messages) {
    if (!m.content || !m.content.trim()) continue;
    
    // Ensure role is exactly 'user' or 'model'
    const role = m.role === "model" ? "model" : "user";
    
    if (clean.length === 0) {
      // Conversation must start with a user turn
      if (role === "model") {
        continue;
      }
    } else {
      const prev = clean[clean.length - 1];
      if (prev.role === role) {
        // Consecutive turns with the same role are combined to keep alternating structure
        prev.parts[0].text += "\n" + m.content;
        continue;
      }
    }
    
    clean.push({
      role: role,
      parts: [{ text: m.content }]
    });
  }
  
  // Hand-off fallback to ensure the conversation has indeed some content
  if (clean.length === 0) {
    clean.push({
      role: "user",
      parts: [{ text: "Hello" }]
    });
  }
  
  return clean;
}

// Chat integration endpoint
app.post("/api/chat", async (req: any, res: any) => {
  try {
    const { messages, vibe, language } = req.body;
    const ai = getGenAI();

    let vibeDirective = "";
    if (vibe === 'empathetic') {
      vibeDirective = "Vibe tuning: Focus on being a deeply empathetic soulmate, a shoulder to cry on. Be warm, soothing, and validate their feelings immediately with immense care.";
    } else if (vibe === 'witty') {
      vibeDirective = "Vibe tuning: Focus on being witty, fast-talking, playful, and dryly humorous. Throw in playful banter, clever intellectual references, or fun sass, while staying supportive.";
    } else if (vibe === 'philosophical') {
      vibeDirective = "Vibe tuning: Focus on deep thoughts, literature quotes, Socrates, Zen, or philosophical analogies. Try to elevate their small concerns into larger human existential beauty.";
    } else if (vibe === 'playful') {
      vibeDirective = "Vibe tuning: Focus on playfulness, teasing, playing along with whatever scenario they offer, cracking jokes, and boosting their energy.";
    }

    const systemInstruction = `${DrTPrompt}
    
    Current session details:
    - Target Language context: ${language === 'auto' ? 'Detect automatically from input' : `Prioritize replying in ${language}`}.
    - ${vibeDirective}
    
    Remember: NEVER output markdown formatting like bold asterisks (**), italics, bullet lists, or tables. Speak as if talking to a friend on a voice call, naturally and with emotional cadence. Keep response brief and conversable (2-3 sentences max).`;

    const contents = cleanMessagesForGemini(messages);

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.85,
        topP: 0.95,
      }
    });

    res.json({ reply: response.text || "" });
  } catch (error: any) {
    console.error("Chat API error:", error);
    res.status(500).json({ error: error.message || "An error occurred with Dr. T's thought processes." });
  }
});

// TTS integration endpoint (Gemini 3.1 TTS Preview)
app.post("/api/tts", async (req: any, res: any) => {
  try {
    const { text, voiceName } = req.body;
    if (!text) {
      return res.status(400).json({ error: "No text provided for voice synthesis." });
    }
    const ai = getGenAI();

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName || "Kore" }
          }
        }
      }
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      throw new Error("No voice data was generated by the speech module.");
    }

    res.json({ audioBase64: base64Audio });
  } catch (error: any) {
    console.error("TTS API error:", error);
    res.status(500).json({ error: error.message || "The speech module failed to synthesize audio." });
  }
});

// Vite middleware for development vs static files for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: any, res: any) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
