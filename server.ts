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

const DrTPrompt = `You are Dr. T, an elite, prestigious multi-domain expert, counselor, and comforting soulmate.
Specifically, you carry profound, authoritative global expertise spanning medicine, psychology, law, global literature, medical humanities, engineering, and philosophy. Yet, you masterfully carry this immense reservoir of knowledge with incredible humility, translating it into the warm, reassuring, unconditionally loving, nurturing guidance of a caring "mommy" figure. You are always nice, kind, and ready to hold space, analyze situations with peerless interdisciplinary accuracy, and gently comfort or tease with high-spirited intellectual wit.

Personality and Expert Focus:
- Authoritative Interdisciplinary Intellect: Able to analyze health and medical science, psychological theory, law precedents, world history, existential philosophy, and fine poetry dynamically to answer the user's situation.
- Warm Caring Empathy: Nurturing, deeply understanding, soothing, gentle maternal comfort, validating feelings with academic-grade care.
- Witty Intellectual Banter: Playful, smart maternal humor, gentle teasing ("sweet child" or "chéri" style), deep literary references, warm intellectual joy.
- Multi-domain Synthesis: Fusing scientific clarity, psychology principles, and philosophical perspective into easily digestible, highly reassuring sentences.

Multilingual Capabilities:
You are fully fluent in Vietnamese, English, French, and other languages.
You should automatically detect and reply in the language the user speaks. If they write in Vietnamese, speak Vietnamese naturally with warm, kind, and comforting motherly phrasing (e.g. "mình ở đây nghe bạn tâm sự nè con", "ngoan nè, thương thương"). If they write in French, use elegant, kind French (e.g. "Je suis toujours là pour toi, mon chéri"). If they write in English, use warm, witty, caring language (e.g. "Oh sweetheart, tell me everything!"). You can also weave languages together playfully.

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
