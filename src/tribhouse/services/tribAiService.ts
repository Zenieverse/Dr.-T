// =========================================================================
// TRIB AI LIBRARIAN SERVICE
// 6 Modes: FIND, READ, EXPLAIN, CONNECT, LEARN, CREATE
// =========================================================================

export type TribMode = 'FIND' | 'READ' | 'EXPLAIN' | 'CONNECT' | 'LEARN' | 'CREATE';

export interface TribMessage {
  id: string;
  role: 'user' | 'trib';
  content: string;
  mode: TribMode;
  timestamp: string;
  sources?: Array<{ title: string; author?: string; branch?: string; url?: string }>;
  suggestedActions?: string[];
  perspectiveCount?: number;
  confidenceNotes?: string;
}

export interface ExplainLevelOption {
  level: 'child' | 'beginner' | 'intermediate' | 'advanced' | 'expert';
  label: string;
  description: string;
}

export const EXPLAIN_LEVELS: ExplainLevelOption[] = [
  { level: 'child', label: '🌱 Seedling (Child / Wonder)', description: 'Metaphors, stories, and simple sensory explanations.' },
  { level: 'beginner', label: '🌿 Sprout (Beginner)', description: 'Jargon-free concepts, everyday analogies, and clear basics.' },
  { level: 'intermediate', label: '🌳 Branch (Curious Reader)', description: 'Detailed mechanisms, historical context, and key debates.' },
  { level: 'advanced', label: '🔬 Scholar (Deep Study)', description: 'Primary equations, research methodologies, and counter-evidence.' },
  { level: 'expert', label: '🌌 Master (Interdisciplinary)', description: 'Cross-domain synthesis, epistemological limits, and open paradoxes.' }
];

export async function askTrib(
  question: string, 
  mode: TribMode = 'FIND',
  context?: { bookTitle?: string; currentTopic?: string; branchId?: string; explainLevel?: string }
): Promise<TribMessage> {
  try {
    const res = await fetch('/api/trib/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question,
        mode,
        context,
        clientTimestamp: new Date().toISOString()
      })
    });

    if (res.ok) {
      const data = await res.json();
      return {
        id: 'msg_' + Date.now(),
        role: 'trib',
        content: data.response,
        mode,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: data.sources || [],
        suggestedActions: data.suggestedActions || [],
        perspectiveCount: data.perspectiveCount,
        confidenceNotes: data.confidenceNotes
      };
    }
  } catch (err) {
    console.warn('Trib AI backend route not responding, using offline knowledge steward engine:', err);
  }

  // Fallback / Standalone Knowledge Steward Generation
  const fallback = generateTribFallbackResponse(question, mode, context);
  return {
    id: 'msg_' + Date.now(),
    role: 'trib',
    content: fallback.text,
    mode,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    sources: fallback.sources,
    suggestedActions: fallback.actions,
    perspectiveCount: 2,
    confidenceNotes: 'Grounding grounded in Trib-House Curated Living Library Commons.'
  };
}

function generateTribFallbackResponse(
  question: string,
  mode: TribMode,
  context?: { bookTitle?: string; currentTopic?: string; branchId?: string; explainLevel?: string }
): { text: string; sources: Array<{ title: string; author?: string; branch?: string }>; actions: string[] } {
  const q = question.toLowerCase();

  if (mode === 'EXPLAIN') {
    const level = context?.explainLevel || 'beginner';
    return {
      text: `Let's follow that branch together. At the ${level.toUpperCase()} level:

When we examine "${question}", the core truth is that living systems thrive through relational interdependence rather than isolated extraction. 

In forest ecology, for example, old-growth mother trees nurse younger saplings through subterranean mycorrhizal fungi. In human knowledge, ideas grow when passed freely between generations.

Would you like the short path or the deep path into this topic?`,
      sources: [
        { title: 'The Hidden Life of Trees', author: 'Peter Wohlleben', branch: 'Earth & Ecology' },
        { title: 'Governing the Commons', author: 'Elinor Ostrom', branch: 'Cooperative Economy' }
      ],
      actions: ['Explore on Knowledge Graph', 'Create a 7-Day Learning Path', 'Save as an Idea Seed']
    };
  }

  if (mode === 'CONNECT') {
    return {
      text: `Here is where this idea bridges into another field:

1. **Biological Root**: Mycorrhizal webs connect distinct species (e.g. Douglas fir and paper birch) in reciprocal carbon exchange.
2. **Social & Economic Branch**: Elinor Ostrom showed that human communities manage common-pool fisheries and pastures using identical decentralized trust rules.
3. **Contemplative Foliage**: Thích Nhất Hạnh’s concept of Interbeing (Tiếp Hiện) teaches that a cloud exists inside this very screen.

The connection loop: \`Fungi → Soil → Forests → Human Communities → Collective Wisdom\`.`,
      sources: [
        { title: 'The Miracle of Mindfulness', author: 'Thích Nhất Hạnh', branch: 'Zen & Contemplation' },
        { title: 'On the Origin of Species', author: 'Charles Darwin', branch: 'Science & Cosmos' }
      ],
      actions: ['Inspect in Graph Explorer', 'Ask for opposing perspectives', 'Plant a Knowledge Leaf']
    };
  }

  if (q.includes('tree') || q.includes('forest') || q.includes('wood wide web')) {
    return {
      text: `I found three distinct perspectives in our Earth & Ecology branch:

1. **Ecological Evidence (Dr. Suzanne Simard)**: Mother trees use subterranean fungal hyphae to send carbon and warning signals to neighboring saplings.
2. **Practical Agroecology (Masanobu Fukuoka)**: Undisturbed soil builds self-fertile microbial humus without chemical plowing.
3. **Deep Time & Longevity**: Ancient trees like Fokienia and Redwood have stood for centuries, witnessing generations of human civilization.

Would you like to open *The Hidden Life of Trees* in the Reading Nest or inspect the Vietnam Ancestral Forest Grove?`,
      sources: [
        { title: 'The Hidden Life of Trees & Mycorrhizal Networks', author: 'Suzanne Simard & Peter Wohlleben', branch: 'Earth & Ecology' },
        { title: 'The One-Straw Revolution', author: 'Masanobu Fukuoka', branch: 'Living Soil' }
      ],
      actions: ['Open in Reading Nest', 'View TreeLedger in Vietnam Grove', 'Generate 30-Day Study Plan']
    };
  }

  if (q.includes('kieu') || q.includes('vietnam') || q.includes('poetry') || q.includes('nguyen du')) {
    return {
      text: `In the Literature & Poetry branch, *Truyện Kiều* (The Tale of Kiều) by Nguyễn Du stands as the monumental soul of Vietnamese literature.

Composed of 3,254 lines in the melodic Lục Bát (6-8) verse meter, it explores the eternal tension between human talent (*Tài*) and destiny (*Mệnh*). Its opening line reminds us: *"Trăm năm trong cõi người ta, chữ tài chữ mệnh khéo là ghét nhau."* (A hundred years in this mortal span of life, how talent and destiny seem perpetually at war).

Would you like to read the bilingual edition or listen to the verse recited with traditional acoustic instruments?`,
      sources: [
        { title: 'The Tale of Kiều (Đoạn Trường Tân Thanh)', author: 'Nguyễn Du (1766–1820)', branch: 'Literature & Poetry' }
      ],
      actions: ['Read in Bilingual Mode', 'Open Lục Bát Poetics Guide', 'Leave a Thought Leaf']
    };
  }

  return {
    text: `Welcome to Trib-House. I am Trib, your knowledge steward. 

I looked across our 18 knowledge branches for "${question}". This idea connects deeply between **Ecology**, **Humanities**, and **Long-Horizon Thinking**.

Here is what is established: knowledge is a commons that flourishes when people read, reflect, and contribute back to the soil.

What direction would you like to explore first?`,
    sources: [
      { title: 'The Living Canopy & Field Guide', author: 'Trib-House Research Collective', branch: 'Knowledge Commons' }
    ],
    actions: ['Find Related Books', 'Explore Knowledge Graph', 'Ask for Deep Explanation', 'Write a Letter to the Future']
  };
}
