import { GoogleGenAI } from '@google/genai';

async function benchmark() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('No GEMINI_API_KEY found');
    process.exit(1);
  }

  const ai = new GoogleGenAI({ apiKey });
  console.log('--- GEMMA 4 (gemma-4-26b-a4b-it) LATENCY BENCHMARK ---');

  const runs: number[] = [];

  // 1. Controlled benchmark with identical synthetic MicroBiz copy prompt
  const testPrompt = `You are a copywriter for MicroBiz. Generate a 1-sentence product hook for "Bamboo Soap Dish". Return JSON: {"tagline": "string"}`;

  for (let i = 1; i <= 4; i++) {
    const t0 = Date.now();
    try {
      const res = await ai.models.generateContent({
        model: 'gemma-4-26b-a4b-it',
        contents: testPrompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      });
      const duration = Date.now() - t0;
      runs.push(duration);
      console.log(`Run ${i}: ${duration}ms | Response: ${res.text?.trim().slice(0, 80)}...`);
    } catch (err: any) {
      console.error(`Run ${i} Failed:`, err.message);
    }
  }

  if (runs.length > 0) {
    const sorted = [...runs].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const median = sorted.length % 2 === 0 
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2 
      : sorted[Math.floor(sorted.length / 2)];
    const avg = runs.reduce((a, b) => a + b, 0) / runs.length;

    console.log('\n--- LATENCY SUMMARY ---');
    console.log(`Runs: ${runs.length}`);
    console.log(`Min: ${min}ms`);
    console.log(`Max: ${max}ms`);
    console.log(`Median: ${median}ms`);
    console.log(`Average: ${avg.toFixed(1)}ms`);
  }
}

benchmark().catch(console.error);
