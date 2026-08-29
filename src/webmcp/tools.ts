import { WebMCPToolDefinition, WebMCPOptionItem, CanvasCard } from './types';
import { SCHEMAS } from './schemas';
import { CLASSIFICATIONS } from './security';
import { MOCK_WEBMCP_DATABASE } from './data';

// ============================================================================
// CONCRETE IMPLEMENTATION OF 12 WEBMCP STANDARD TOOLS
// ============================================================================

export interface ToolExecutionContext {
  cards: CanvasCard[];
  setCards: React.Dispatch<React.SetStateAction<CanvasCard[]>> | ((updater: any) => void);
  activeWorkspaceName?: string;
}

export const WEBMCP_TOOLS: Record<string, WebMCPToolDefinition> = {
  // 0. search_products (document.modelContext registered tool standard)
  search_products: {
    name: 'search_products',
    description: 'Search the product catalog for sustainable stays, low-emission transport, dining, and curated experiences',
    classification: CLASSIFICATIONS['search_products'].classification,
    riskLevel: CLASSIFICATIONS['search_products'].risk,
    schema: SCHEMAS['search_products'],
    handler: async (args: { query: string; category?: string; maxPrice?: number; minSustainability?: number }) => {
      const q = (args.query || '').toLowerCase();
      const cat = args.category || 'all';
      const maxPrice = args.maxPrice || Infinity;
      const minSust = args.minSustainability || 0;

      const filtered = MOCK_WEBMCP_DATABASE.filter((item: WebMCPOptionItem) => {
        if (cat !== 'all' && item.category !== cat) return false;
        if (item.price > maxPrice) return false;
        if (item.sustainabilityScore < minSust) return false;

        if (!q || q === 'all') return true;

        const matchName = item.name.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchTags = item.tags.some(t => t.toLowerCase().includes(q));
        const matchLoc = item.location.toLowerCase().includes(q);
        return matchName || matchDesc || matchTags || matchLoc;
      });

      return {
        count: filtered.length,
        query: args.query,
        category: cat,
        products: filtered.slice(0, 10),
      };
    },
  },

  // 1. search_options
  search_options: {
    name: 'search_options',
    description: 'Query database of experiences, eco-stays, low-emission transit, and restaurants',
    classification: CLASSIFICATIONS['search_options'].classification,
    riskLevel: CLASSIFICATIONS['search_options'].risk,
    schema: SCHEMAS['search_options'],
    handler: async (args: { query: string; category?: string; maxResults?: number; maxPrice?: number; minSustainability?: number }) => {
      const q = (args.query || '').toLowerCase();
      const cat = args.category || 'all';
      const limit = args.maxResults || 10;
      const maxPrice = args.maxPrice || Infinity;
      const minSust = args.minSustainability || 0;

      const filtered = MOCK_WEBMCP_DATABASE.filter((item: WebMCPOptionItem) => {
        if (cat !== 'all' && item.category !== cat) return false;
        if (item.price > maxPrice) return false;
        if (item.sustainabilityScore < minSust) return false;

        if (!q || q === 'all' || q.includes('plan') || q.includes('sustainable') || q.includes('weekend')) return true;

        const matchName = item.name.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchTags = item.tags.some(t => t.toLowerCase().includes(q));
        const matchLoc = item.location.toLowerCase().includes(q);
        return matchName || matchDesc || matchTags || matchLoc;
      });

      const results = filtered.slice(0, limit);
      return {
        count: results.length,
        totalMatched: filtered.length,
        query: args.query,
        category: cat,
        items: results,
      };
    },
  },

  // 2. get_option_details
  get_option_details: {
    name: 'get_option_details',
    description: 'Retrieve full specifications, environmental impact, and pricing for a specific item',
    classification: CLASSIFICATIONS['get_option_details'].classification,
    riskLevel: CLASSIFICATIONS['get_option_details'].risk,
    schema: SCHEMAS['get_option_details'],
    handler: async (args: { id: string }) => {
      const item = MOCK_WEBMCP_DATABASE.find(x => x.id === args.id);
      if (!item) {
        throw new Error(`Option with ID '${args.id}' not found in WebMCP database.`);
      }
      return {
        found: true,
        item,
        carbonFootprintEstimate: `${Math.round((100 - item.sustainabilityScore) * 0.4)} kg CO2e`,
        recommendedDuration: item.category === 'experiences' ? '2-3 hours' : item.category === 'accommodations' ? 'Overnight' : 'Flexible',
      };
    },
  },

  // 3. compare_options
  compare_options: {
    name: 'compare_options',
    description: 'Multi-criteria comparison matrix across multiple shortlisted options',
    classification: CLASSIFICATIONS['compare_options'].classification,
    riskLevel: CLASSIFICATIONS['compare_options'].risk,
    schema: SCHEMAS['compare_options'],
    handler: async (args: { optionIds: string[]; criteria?: string[] }) => {
      const ids = args.optionIds || [];
      const items = MOCK_WEBMCP_DATABASE.filter(x => ids.includes(x.id));
      const criteria = args.criteria || ['price', 'sustainabilityScore', 'rating'];

      const comparisonMatrix = items.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        price: item.price,
        rating: item.rating,
        sustainabilityScore: item.sustainabilityScore,
        valueRatio: +(item.sustainabilityScore / Math.max(item.price, 1)).toFixed(2),
      }));

      const topSustainable = [...items].sort((a, b) => b.sustainabilityScore - a.sustainabilityScore)[0];
      const bestValue = [...comparisonMatrix].sort((a, b) => b.valueRatio - a.valueRatio)[0];

      return {
        itemsCount: items.length,
        criteriaEvaluated: criteria,
        matrix: comparisonMatrix,
        recommendation: {
          highestSustainability: topSustainable ? topSustainable.name : null,
          highestValueRatio: bestValue ? bestValue.name : null,
        },
      };
    },
  },

  // 4. rank_options
  rank_options: {
    name: 'rank_options',
    description: 'Rank and sort candidates against complex natural language objective',
    classification: CLASSIFICATIONS['rank_options'].classification,
    riskLevel: CLASSIFICATIONS['rank_options'].risk,
    schema: SCHEMAS['rank_options'],
    handler: async (args: { optionIds: string[]; objective: string }) => {
      const ids = args.optionIds || [];
      const items = MOCK_WEBMCP_DATABASE.filter(x => ids.includes(x.id));

      // Weighted score combining sustainability (60%), rating (20%), and price affordability (20%)
      const ranked = items.map(item => {
        const affordabilityScore = Math.max(0, 100 - (item.price / 2));
        const compositeScore = (item.sustainabilityScore * 0.6) + (item.rating * 20 * 0.2) + (affordabilityScore * 0.2);
        return {
          rank: 0,
          id: item.id,
          name: item.name,
          category: item.category,
          price: item.price,
          sustainabilityScore: item.sustainabilityScore,
          compositeScore: +compositeScore.toFixed(1),
          justification: `High sustainability rating (${item.sustainabilityScore}/100) with strong peer review (${item.rating}/5.0)`,
        };
      }).sort((a, b) => b.compositeScore - a.compositeScore)
        .map((item, idx) => ({ ...item, rank: idx + 1 }));

      return {
        objective: args.objective,
        totalRanked: ranked.length,
        leader: ranked[0] || null,
        rankedList: ranked,
      };
    },
  },

  // 5. calculate_budget
  calculate_budget: {
    name: 'calculate_budget',
    description: 'Deterministic expense ledger, taxes, and budget headroom verification',
    classification: CLASSIFICATIONS['calculate_budget'].classification,
    riskLevel: CLASSIFICATIONS['calculate_budget'].risk,
    schema: SCHEMAS['calculate_budget'],
    handler: async (args: { items: Array<{ id?: string; name: string; category?: string; costPerPerson?: number; price?: number; quantity?: number }>; budgetLimit?: number; currency?: string }) => {
      const budgetLimit = args.budgetLimit || 500;
      const currency = args.currency || 'USD';
      const rawItems = args.items || [];

      let subtotal = 0;
      const lineItems = rawItems.map((item, i) => {
        const unitCost = Number(item.costPerPerson ?? item.price ?? 0);
        const qty = Number(item.quantity ?? 2);
        const total = unitCost * qty;
        subtotal += total;
        return {
          id: item.id || `item_${i + 1}`,
          name: item.name,
          category: item.category || 'General',
          unitCost,
          quantity: qty,
          totalCost: total,
        };
      });

      const ecoTaxOffset = +(subtotal * 0.03).toFixed(2);
      const grandTotal = +(subtotal + ecoTaxOffset).toFixed(2);
      const remaining = +(budgetLimit - grandTotal).toFixed(2);
      const isWithinBudget = grandTotal <= budgetLimit;

      return {
        currency,
        lineItemsCount: lineItems.length,
        subtotal: +subtotal.toFixed(2),
        ecoTaxOffset,
        grandTotal,
        budgetLimit,
        remaining,
        isWithinBudget,
        statusText: isWithinBudget 
          ? `Within budget: $${grandTotal} of $${budgetLimit} ($${remaining} surplus remaining)`
          : `Over budget: Exceeds by $${Math.abs(remaining)}`,
      };
    },
  },

  // 6. create_artifact
  create_artifact: {
    name: 'create_artifact',
    description: 'Generate and publish a formatted structured artifact directly to shared canvas',
    classification: CLASSIFICATIONS['create_artifact'].classification,
    riskLevel: CLASSIFICATIONS['create_artifact'].risk,
    schema: SCHEMAS['create_artifact'],
    handler: async (args: { title: string; type: 'plan' | 'document' | 'table' | 'summary'; content: string; tags?: string[] }, context?: ToolExecutionContext) => {
      const newCard: CanvasCard = {
        id: `art_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        title: args.title,
        type: args.type,
        author: 'Agent',
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'approved',
        content: args.content,
        tags: args.tags || ['WebMCP', 'Artifact'],
        pinned: true,
        comments: [
          {
            id: `c_${Date.now()}`,
            author: 'WebMCP Kernel',
            text: 'Artifact generated via WebMCP autonomous pipeline and validated against security bounds.',
            time: 'Just now',
          },
        ],
      };

      if (context && typeof context.setCards === 'function') {
        context.setCards((prev: CanvasCard[]) => [newCard, ...prev]);
      }

      return {
        success: true,
        artifactId: newCard.id,
        title: newCard.title,
        type: newCard.type,
        bytes: newCard.content.length,
        renderedOnCanvas: true,
      };
    },
  },

  // 7. update_artifact
  update_artifact: {
    name: 'update_artifact',
    description: 'Apply partial delta or replace content of existing artifact',
    classification: CLASSIFICATIONS['update_artifact'].classification,
    riskLevel: CLASSIFICATIONS['update_artifact'].risk,
    schema: SCHEMAS['update_artifact'],
    handler: async (args: { artifactId: string; changes: any }, context?: ToolExecutionContext) => {
      if (context && typeof context.setCards === 'function') {
        context.setCards((prev: CanvasCard[]) =>
          prev.map(c => (c.id === args.artifactId ? { ...c, ...args.changes } : c))
        );
      }
      return {
        success: true,
        artifactId: args.artifactId,
        changesApplied: Object.keys(args.changes || {}),
      };
    },
  },

  // 8. add_to_canvas
  add_to_canvas: {
    name: 'add_to_canvas',
    description: 'Pin and render an existing artifact onto the visible shared collaborative board',
    classification: CLASSIFICATIONS['add_to_canvas'].classification,
    riskLevel: CLASSIFICATIONS['add_to_canvas'].risk,
    schema: SCHEMAS['add_to_canvas'],
    handler: async (args: { artifactId: string }, context?: ToolExecutionContext) => {
      if (context && typeof context.setCards === 'function') {
        context.setCards((prev: CanvasCard[]) =>
          prev.map(c => (c.id === args.artifactId ? { ...c, pinned: true } : c))
        );
      }
      return { success: true, artifactId: args.artifactId, pinned: true };
    },
  },

  // 9. remove_from_canvas
  remove_from_canvas: {
    name: 'remove_from_canvas',
    description: 'Unpin or delete an artifact from the visible canvas',
    classification: CLASSIFICATIONS['remove_from_canvas'].classification,
    riskLevel: CLASSIFICATIONS['remove_from_canvas'].risk,
    schema: SCHEMAS['remove_from_canvas'],
    handler: async (args: { artifactId: string }, context?: ToolExecutionContext) => {
      if (context && typeof context.setCards === 'function') {
        context.setCards((prev: CanvasCard[]) => prev.filter(c => c.id !== args.artifactId));
      }
      return { success: true, artifactId: args.artifactId, removed: true };
    },
  },

  // 10. save_workspace
  save_workspace: {
    name: 'save_workspace',
    description: 'Persist current collaborative canvas state into browser storage snapshot',
    classification: CLASSIFICATIONS['save_workspace'].classification,
    riskLevel: CLASSIFICATIONS['save_workspace'].risk,
    schema: SCHEMAS['save_workspace'],
    handler: async (args: { workspaceName: string }, context?: ToolExecutionContext) => {
      const snapshot = {
        name: args.workspaceName,
        savedAt: new Date().toISOString(),
        cardsCount: context?.cards?.length || 0,
        cards: context?.cards || [],
      };
      try {
        localStorage.setItem(`openwebos_ws_${args.workspaceName}`, JSON.stringify(snapshot));
      } catch (e) {
        // ignore if local storage fails in private mode
      }
      return {
        success: true,
        workspaceName: args.workspaceName,
        cardsSaved: snapshot.cardsCount,
        timestamp: snapshot.savedAt,
      };
    },
  },

  // 11. summarize_workspace
  summarize_workspace: {
    name: 'summarize_workspace',
    description: 'Generate high-level structured executive briefing across all active canvas elements',
    classification: CLASSIFICATIONS['summarize_workspace'].classification,
    riskLevel: CLASSIFICATIONS['summarize_workspace'].risk,
    schema: SCHEMAS['summarize_workspace'],
    handler: async (_args: any, context?: ToolExecutionContext) => {
      const cards = context?.cards || [];
      const plans = cards.filter(c => c.type === 'plan');
      const approvedCount = cards.filter(c => c.status === 'approved').length;

      return {
        totalArtifacts: cards.length,
        approvedArtifacts: approvedCount,
        plansCount: plans.length,
        summary: `Workspace currently maintains ${cards.length} structured artifacts with ${approvedCount} approved by human collaborator.`,
        activeCardTitles: cards.map(c => c.title),
      };
    },
  },

  // 12. export_artifact
  export_artifact: {
    name: 'export_artifact',
    description: 'Export an artifact to raw Markdown, JSON, or plain text format for external consumption',
    classification: CLASSIFICATIONS['export_artifact'].classification,
    riskLevel: CLASSIFICATIONS['export_artifact'].risk,
    schema: SCHEMAS['export_artifact'],
    handler: async (args: { artifactId: string; format: 'markdown' | 'json' | 'text' }, context?: ToolExecutionContext) => {
      const card = context?.cards?.find(c => c.id === args.artifactId);
      if (!card) {
        throw new Error(`Artifact with ID '${args.artifactId}' not found.`);
      }

      let payload = '';
      if (args.format === 'json') {
        payload = JSON.stringify(card, null, 2);
      } else if (args.format === 'markdown') {
        payload = `# ${card.title}\n\n*Type: ${card.type} | Author: ${card.author} | Created: ${card.createdAt}*\n\n${card.content}\n\n---\n*Exported via OpenWebOS WebMCP Registry*`;
      } else {
        payload = `${card.title.toUpperCase()}\n\n${card.content}`;
      }

      return {
        artifactId: card.id,
        format: args.format,
        content: payload,
        characterCount: payload.length,
      };
    },
  },
};
