import { GoogleGenAI } from '@google/genai';
import { GatherEvent, AIEventPlan } from '../components/gatherglow/types';

let genAIClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY || '';
  if (!apiKey) return null;
  if (!genAIClient) {
    try {
      genAIClient = new GoogleGenAI({ 
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    } catch (e) {
      console.warn('[GatherGlow Server] Failed to initialize GoogleGenAI client:', e);
      return null;
    }
  }
  return genAIClient;
}

async function callGeminiWithTimeout(prompt: string, systemInstruction: string, timeoutMs = 2800): Promise<string> {
  const client = getGenAI();
  if (!client) {
    throw new Error('GoogleGenAI client unavailable');
  }

  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('AI generation timed out')), timeoutMs);
  });

  const modelPromise = client.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
    }
  }).then(res => res.text || '');

  try {
    return await Promise.race([modelPromise, timeoutPromise]);
  } finally {
    clearTimeout(timer!);
  }
}

export class GatherGlowServerService {
  /**
   * Health and capability status check
   */
  static checkHealth(): {
    status: 'HEALTHY' | 'DEGRADED';
    model: string;
    isLiveConfigured: boolean;
    provider: string;
    checkedAt: string;
    capabilities: string[];
  } {
    const isLive = Boolean(process.env.GEMINI_API_KEY);
    return {
      status: isLive ? 'HEALTHY' : 'DEGRADED',
      model: 'gemini-3.8-flash',
      isLiveConfigured: isLive,
      provider: isLive ? 'Google GenAI (Gemini 3.8 Flash)' : 'Deterministic Heuristic Fallback Engine',
      checkedAt: new Date().toISOString(),
      capabilities: [
        'full_plan_architecture',
        'conversational_refinement',
        'palette_generation',
        'budget_percentage_recommendations',
        'day_of_run_sheet',
        'contingency_matrix'
      ]
    };
  }

  /**
   * Conversational Plan Refinement
   */
  static async refinePlan(
    currentPlan: AIEventPlan,
    refinementPrompt: string,
    event: GatherEvent
  ): Promise<{ plan: AIEventPlan; telemetry: { engine: string; latencyMs: number } }> {
    const startTime = Date.now();
    const systemInstruction = `You are the Gather & Glow Senior Event Architect.
You are given an existing AIEventPlan and a user's conversational refinement request.
Apply the user's specific adjustments to the theme, color palette, schedule, budget, or decor while preserving unchanged elements.
Output strictly valid JSON matching the full AIEventPlan schema.`;

    const prompt = `Current Event: ${event.title} (${event.eventType}, Budget: ${event.currency} ${event.totalBudget})
User Refinement Request: "${refinementPrompt}"

Current Plan JSON:
${JSON.stringify(currentPlan, null, 2)}

Please return the refined plan JSON:`;

    try {
      const rawText = await callGeminiWithTimeout(prompt, systemInstruction, 3200);
      const parsed = JSON.parse(rawText);
      const latencyMs = Date.now() - startTime;
      return {
        plan: {
          ...currentPlan,
          ...parsed,
          generatedAt: new Date().toISOString(),
          engine: 'Google Gemini 3.8 Flash (Conversational Refinement)'
        },
        telemetry: {
          engine: 'gemini-3.8-flash',
          latencyMs
        }
      };
    } catch (err) {
      console.warn('[GatherGlow Server] Refinement fallback triggered:', err);
      const updatedPlan: AIEventPlan = {
        ...currentPlan,
        themeConcept: {
          ...currentPlan.themeConcept,
          moodboardSummary: `${currentPlan.themeConcept.moodboardSummary} [Refined: "${refinementPrompt}"]`
        },
        generatedAt: new Date().toISOString(),
        engine: 'Deterministic Heuristic Refinement Engine'
      };

      const lower = refinementPrompt.toLowerCase();
      if (lower.includes('emerald') || lower.includes('gold') || lower.includes('green')) {
        updatedPlan.themeConcept.palette = ['#0F5132', '#D4AF37', '#F4EDE2', '#198754', '#1F2937'];
      }

      return {
        plan: updatedPlan,
        telemetry: {
          engine: 'deterministic_heuristic_refinement',
          latencyMs: Date.now() - startTime
        }
      };
    }
  }

  /**
   * Deterministic synchronous plan refinement fallback
   */
  static refinePlanDeterministic(event: GatherEvent, currentPlan: AIEventPlan, refinementPrompt: string): AIEventPlan {
    const updatedPlan: AIEventPlan = {
      ...currentPlan,
      themeConcept: {
        ...currentPlan.themeConcept,
        moodboardSummary: `${currentPlan.themeConcept.moodboardSummary || ''} [Refined: ${refinementPrompt}]`
      },
      generatedAt: new Date().toISOString(),
      engine: 'Deterministic Heuristic Refinement Engine'
    };

    const lower = refinementPrompt.toLowerCase();
    if (lower.includes('emerald') || lower.includes('gold') || lower.includes('green')) {
      updatedPlan.themeConcept.palette = ['#0F5132', '#D4AF37', '#F4EDE2', '#198754', '#1F2937'];
    }

    return updatedPlan;
  }

  /**
   * Generates a comprehensive personalized event plan
   */
  static async generateEventPlan(event: GatherEvent): Promise<{ plan: AIEventPlan; telemetry: { engine: string; latencyMs: number } }> {
    const startTime = Date.now();
    const systemInstruction = `You are a World-Class Event Architect and Executive Producer for Gather & Glow.
You design warm, elegant, stress-free celebration experiences (Weddings, Anniversaries, Family Milestones, and Community Gatherings).
Your design philosophy: "Celebrate beautifully. Plan intelligently. Bring people together."
Output strictly valid JSON matching this schema:
{
  "themeConcept": {
    "title": string,
    "moodboardSummary": string,
    "palette": string[], // 5 hex colors
    "atmosphereKeynotes": string[] // 4 atmospheric bullets
  },
  "budgetBreakdown": [
    {
      "category": string, // venue, catering, photography, decor, entertainment, attire, transport, invitations, rentals, contingency
      "categoryLabel": string,
      "recommendedPercent": number,
      "recommendedAmount": number,
      "reasoning": string
    }
  ],
  "milestones": [
    {
      "timeframe": string,
      "actionItems": string[]
    }
  ],
  "vendorChecklist": [
    {
      "category": string,
      "keyQuestionsToAsk": string[],
      "selectionTips": string[]
    }
  ],
  "guestExperiencePlan": {
    "welcomeStrategy": string,
    "dietaryCareSummary": string,
    "accessibilityChecklist": string[]
  },
  "eventDayRunningOrder": [
    {
      "time": string, // e.g. "14:00"
      "activity": string,
      "responsibleHat": string, // professional, personal, social
      "leadPerson": string,
      "notes": string
    }
  ],
  "decorAndCateringIdeas": {
    "decorHighlights": string[],
    "signatureMenuConcepts": string[],
    "beverageAndCocktailIdeas": string[]
  },
  "contingencyChecklist": [
    {
      "risk": string,
      "trigger": string,
      "contingencyAction": string
    }
  ]
}

CRITICAL RULES:
1. Base all recommendations strictly on the user's specific event: title, type, location, date, expected guests, budget, cultural preferences, and dietary/accessibility requirements.
2. Never invent confirmed vendor availability, fake vendor contacts, or fictitious bookings. Clearly distinguish estimated percentage allocations from real-world quotations.
3. Incorporate the Three Hats framework: assign operational and staging tasks to 'professional' hat, honoree wellbeing and vows to 'personal' hat, and guest care, toasts, and community joy to 'social' hat.`;

    const prompt = `Please architect a personalized event master plan for:
Event Title: ${event.title}
Event Type: ${event.eventType}
Event Date & Time: ${event.date} ${event.time || ''}
Location: ${event.location} (${event.venueName || 'Venue TBD'})
Expected Guests: ${event.expectedGuests}
Total Budget: ${event.currency} ${event.totalBudget}
Theme & Style Preference: ${event.themeStyle}
Dietary Needs: ${event.dietaryNeeds?.join(', ') || 'Standard options with vegetarian alternative'}
Accessibility Requirements: ${event.accessibilityNeeds?.join(', ') || 'Standard accessibility'}
Cultural Heritage / Traditions: ${event.culturalPreferences || 'Contemporary personal celebration'}
Planning Stage: ${event.planningStage}
Key Priorities: ${event.priorities?.join(', ') || 'Warm hospitality and joyful ambiance'}
Special Notes: ${event.notes || 'None'}`;

    try {
      const rawText = await callGeminiWithTimeout(prompt, systemInstruction, 3200);
      const parsed = JSON.parse(rawText);
      const latencyMs = Date.now() - startTime;

      const completePlan: AIEventPlan = {
        themeConcept: parsed.themeConcept || {
          title: `${event.title} — Signature Concept`,
          moodboardSummary: `A personalized celebration celebrating ${event.eventType}.`,
          palette: ['#C88D42', '#3D5A40', '#F4EDE2', '#8C3838', '#1F2937'],
          atmosphereKeynotes: ['Warm hospitality', 'Lively conversation', 'Thoughtful seating', 'Authentic memories']
        },
        budgetBreakdown: parsed.budgetBreakdown || [],
        milestones: parsed.milestones || [],
        vendorChecklist: parsed.vendorChecklist || [],
        guestExperiencePlan: parsed.guestExperiencePlan || {
          welcomeStrategy: 'Friendly welcome table with refreshments upon arrival.',
          dietaryCareSummary: 'Dietary meals clearly marked and served smoothly.',
          accessibilityChecklist: ['Step-free access', 'Clear signage']
        },
        eventDayRunningOrder: parsed.eventDayRunningOrder || [],
        decorAndCateringIdeas: parsed.decorAndCateringIdeas || {
          decorHighlights: ['Eco-friendly floral arrangements', 'Warm accent lighting'],
          signatureMenuConcepts: ['Seasonal family-style menu'],
          beverageAndCocktailIdeas: ['Signature mocktail with fresh herbs']
        },
        contingencyChecklist: parsed.contingencyChecklist || [],
        generatedAt: new Date().toISOString(),
        engine: 'Google Gemini 3.8 Flash (Live Server API)'
      };

      return {
        plan: completePlan,
        telemetry: {
          engine: 'gemini-3.8-flash',
          latencyMs
        }
      };
    } catch (error) {
      console.warn('[GatherGlow Server] Gemini generation fallback triggered:', error);
      const latencyMs = Date.now() - startTime;
      const fallbackPlan = this.generateDeterministicPlan(event);

      return {
        plan: fallbackPlan,
        telemetry: {
          engine: 'deterministic_heuristic_fallback',
          latencyMs
        }
      };
    }
  }

  /**
   * Deterministic fallback when Gemini API is unconfigured or times out
   */
  static generateDeterministicPlan(event: GatherEvent): AIEventPlan {
    const total = event.totalBudget || 12000;
    const isWedding = event.eventType === 'wedding';
    const isBirthday = event.eventType === 'birthday';
    const isCommunity = event.eventType === 'community_gathering' || event.eventType === 'cultural_festival';

    return {
      themeConcept: {
        title: `${event.title} — Signature Ambiance`,
        moodboardSummary: `An authentic, joyful celebration celebrating ${event.eventType.replace('_', ' ')} with ${event.themeStyle || 'natural elegance and warm hospitality'}. Designed for ${event.expectedGuests} guests at ${event.location || 'the venue'}.`,
        palette: ['#C88D42', '#3D5A40', '#F4EDE2', '#8C3838', '#1F2937'],
        atmosphereKeynotes: [
          'Welcoming, heartfelt guest greeting with cold towels or warm tea',
          'Intimate conversational tables designed for genuine connection',
          'Soft acoustic ambiance that never drowns out family conversations',
          'Coordinated celebration moments that honor heritage and personal roots'
        ]
      },
      budgetBreakdown: [
        {
          category: 'catering',
          categoryLabel: 'Artisan Culinary & Beverages',
          recommendedPercent: isCommunity ? 40 : 34,
          recommendedAmount: Math.round(total * (isCommunity ? 0.40 : 0.34)),
          reasoning: 'The heart of guest hospitality, family feast courses, and celebratory beverages.'
        },
        {
          category: 'venue',
          categoryLabel: 'Venue & Grounds Rental',
          recommendedPercent: 26,
          recommendedAmount: Math.round(total * 0.26),
          reasoning: 'Guarantees private, comfortable space, essential restrooms, and rain-shelter backup.'
        },
        {
          category: 'photography',
          categoryLabel: 'Photography & Cinema',
          recommendedPercent: isCommunity ? 8 : 13,
          recommendedAmount: Math.round(total * (isCommunity ? 0.08 : 0.13)),
          reasoning: 'Candid documentary storytelling preserving memories across generations.'
        },
        {
          category: 'decor',
          categoryLabel: 'Botanical & Theme Decor',
          recommendedPercent: 11,
          recommendedAmount: Math.round(total * 0.11),
          reasoning: 'Lighting, floral arrangements, and personalized signage.'
        },
        {
          category: 'entertainment',
          categoryLabel: 'Music & Sound Engineering',
          recommendedPercent: 8,
          recommendedAmount: Math.round(total * 0.08),
          reasoning: 'Clear wireless microphones for speeches and joyful live music.'
        },
        {
          category: 'attire',
          categoryLabel: 'Styling & Attire',
          recommendedPercent: isWedding ? 4 : 3,
          recommendedAmount: Math.round(total * (isWedding ? 0.04 : 0.03)),
          reasoning: 'Special garments and accessories tailored for the milestone.'
        },
        {
          category: 'contingency',
          categoryLabel: 'Reserve Buffer & Contingencies',
          recommendedPercent: 5,
          recommendedAmount: Math.round(total * 0.05),
          reasoning: 'Essential safety buffer for weather adjustments or emergency purchases.'
        }
      ],
      milestones: [
        {
          timeframe: 'Initial Planning (6+ Months)',
          actionItems: [
            'Confirm date, venue contract, and weather backup spaces',
            'Draft preliminary guest list and budget ceilings',
            'Book high-demand catering and lead photography'
          ]
        },
        {
          timeframe: 'Mid-Planning (3 Months)',
          actionItems: [
            'Send invitations with dietary and accessibility RSVP survey',
            'Confirm ceremony structure, traditional blessings, and vows',
            'Select live musicians or playlist curator'
          ]
        },
        {
          timeframe: 'Final Countdown (1 Month)',
          actionItems: [
            'Finalize guaranteed headcount with catering team',
            'Publish table seating plan and dietary cards',
            'Review floor plan and power logistics with venue coordinator'
          ]
        },
        {
          timeframe: 'Event Week & Day-Of',
          actionItems: [
            'Distribute Three Hats responsibility briefing to lead helpers',
            'Conduct sound and microphone walk-through',
            'Pack emergency day-of kit and print run sheets'
          ]
        }
      ],
      vendorChecklist: [
        {
          category: 'venue',
          keyQuestionsToAsk: [
            'What is the sound curfew for amplified versus acoustic music?',
            'What is the emergency backup plan if heavy rain or wind occurs?',
            'Are there dedicated step-free ramps and quiet rooms for elders and infants?'
          ],
          selectionTips: [
            'Inspect restrooms and parking ease for mobility-impaired guests.'
          ]
        },
        {
          category: 'catering',
          keyQuestionsToAsk: [
            'How are severe allergies handled and kept separate in the kitchen?',
            'What is the server-to-guest ratio during the main meal?',
            'Can we bring special traditional sweets or family heritage recipes?'
          ],
          selectionTips: [
            'Ask for a private tasting of both regular and vegetarian/allergy courses.'
          ]
        }
      ],
      guestExperiencePlan: {
        welcomeStrategy: 'A welcoming foyer with chilled herbal refreshments, guest sign-in, and immediate seating assistance.',
        dietaryCareSummary: `Catering service prepared for all requested dietary needs: ${event.dietaryNeeds?.join(', ') || 'Vegetarian, Vegan, Halal, Gluten-Free'}.`,
        accessibilityChecklist: [
          'Step-free entrance and ramps with handrails',
          'Shaded seating with supportive chairs for elders',
          'High-contrast signage and well-lit walkways'
        ]
      },
      eventDayRunningOrder: [
        {
          time: '12:00',
          activity: 'Venue Load-In & Decor Installation',
          responsibleHat: 'professional',
          leadPerson: 'Day-Of Coordinator',
          notes: 'Florals delivered, sound system tuned, tables set.'
        },
        {
          time: '14:30',
          activity: 'Honoree & Family Arrival & Quiet Grounding',
          responsibleHat: 'personal',
          leadPerson: 'Host Team',
          notes: 'Hydrate, check attire, enjoy quiet moment together.'
        },
        {
          time: '15:30',
          activity: 'Guest Arrival & Welcome Refreshments',
          responsibleHat: 'social',
          leadPerson: 'Welcome Ambassadors',
          notes: 'Greet guests, offer signature drinks, escort to seats.'
        },
        {
          time: '16:00',
          activity: 'Main Ceremony / Milestone Rites',
          responsibleHat: 'personal',
          leadPerson: 'Couple / Officiant / Elders',
          notes: 'Personal vows, ancestral blessings, or milestone honors.'
        },
        {
          time: '17:30',
          activity: 'Celebratory Banquet / Dinner Feast',
          responsibleHat: 'professional',
          leadPerson: 'Catering Lead',
          notes: 'Dinner served family-style; background music at conversational volume.'
        },
        {
          time: '19:30',
          activity: 'Heartfelt Toasts & Storytelling',
          responsibleHat: 'social',
          leadPerson: 'Toastmaster & Family Members',
          notes: '3-minute sincere toasts; photo slideshow or archival video.'
        },
        {
          time: '20:30',
          activity: 'Music, Celebration & Dancing',
          responsibleHat: 'social',
          leadPerson: 'Musicians / Emcee',
          notes: 'Dessert buffet open; joyful dancing and conversation.'
        },
        {
          time: '22:00',
          activity: 'Farewell Send-Off & Wrap-Up',
          responsibleHat: 'professional',
          leadPerson: 'Coordinator & Helpers',
          notes: 'Farewell favors given to departing guests; breakdown begins.'
        }
      ],
      decorAndCateringIdeas: {
        decorHighlights: [
          'Warm ambient filament string lights and table candles in hurricane glass',
          'Locally sourced botanical greenery runners paired with textured linen napkins',
          'Personalized handwritten welcome easel with meaningful quote or family crest'
        ],
        signatureMenuConcepts: [
          'Farm-fresh heritage salad with toasted nuts, citrus, and crisp shallots',
          'Slow-roasted main entrée paired with seasonal vegetables and fragrant rice',
          'Chilled artisanal dessert cups with tropical fruits and floral jellies'
        ],
        beverageAndCocktailIdeas: [
          'Citrus Blossom Spritz (Mocktail): Sparkling water, calamansi, honey, and fresh mint',
          'Cold-brewed herbal tea bar with roasted barley, lemongrass, and lotus leaves',
          'Celebration toast with organic sparkling cider or local champagne'
        ]
      },
      contingencyChecklist: [
        {
          risk: 'Sudden Weather Shift (Rain or Extreme Heat)',
          trigger: 'Forecast predicts storm or heat spike 24 hours prior',
          contingencyAction: 'Activate venue covered veranda and order portable cooling fans or space heaters.'
        },
        {
          risk: 'Sound / Microphone Failure During Speeches',
          trigger: 'Wireless microphone drops frequency',
          contingencyAction: 'Coordinator keeps a wired backup microphone plugged in directly at the podium.'
        },
        {
          risk: 'Late Vendor Arrival',
          trigger: 'Vendor not on-site 60 minutes before scheduled call-time',
          contingencyAction: 'Coordinator calls vendor dispatch; helper team stands by to assist quick load-in.'
        }
      ],
      generatedAt: new Date().toISOString(),
      engine: 'Dr. T Heuristic Event Architect Engine (Offline Fallback)'
    };
  }
}
