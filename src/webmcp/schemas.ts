import { WebMCPToolSchema } from './types';

// ============================================================================
// 12 WEBMCP FORMAL JSON SCHEMAS ACCORDING TO SPECIFICATION
// ============================================================================

export const SCHEMAS: Record<string, WebMCPToolSchema> = {
  search_products: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Search keyword for products, experiences, stays, and items in the catalog',
      },
      category: {
        type: 'string',
        description: 'Optional catalog filter category',
        enum: ['all', 'experiences', 'accommodations', 'transport', 'restaurants', 'activities'],
      },
      maxPrice: {
        type: 'number',
        description: 'Maximum cost limit filter',
      },
      minSustainability: {
        type: 'number',
        description: 'Minimum sustainability score (0-100)',
      },
    },
    required: ['query'],
  },

  search_options: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: 'Natural language search query for activities, stays, transport, or dining',
      },
      category: {
        type: 'string',
        description: 'Optional filter category',
        enum: ['all', 'experiences', 'accommodations', 'transport', 'restaurants', 'activities'],
      },
      maxResults: {
        type: 'number',
        description: 'Maximum number of items to retrieve (default: 10)',
      },
      maxPrice: {
        type: 'number',
        description: 'Maximum cost filter threshold',
      },
      minSustainability: {
        type: 'number',
        description: 'Minimum sustainability score (0-100)',
      },
    },
    required: ['query'],
  },

  get_option_details: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'Unique item identifier (e.g. "acc_01", "act_04")',
      },
    },
    required: ['id'],
  },

  compare_options: {
    type: 'object',
    properties: {
      optionIds: {
        type: 'array',
        items: { type: 'string' },
        description: 'List of option IDs to perform multi-dimensional comparison against',
      },
      criteria: {
        type: 'array',
        items: { type: 'string' },
        description: 'Evaluation criteria: price, sustainability, location, rating',
      },
    },
    required: ['optionIds'],
  },

  rank_options: {
    type: 'object',
    properties: {
      optionIds: {
        type: 'array',
        items: { type: 'string' },
        description: 'List of option IDs to prioritize and rank',
      },
      objective: {
        type: 'string',
        description: 'Optimization target (e.g., "maximize sustainability within $500 budget for 2 people")',
      },
    },
    required: ['optionIds', 'objective'],
  },

  calculate_budget: {
    type: 'object',
    properties: {
      items: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Item ID or title' },
            name: { type: 'string', description: 'Item title' },
            category: { type: 'string', description: 'Category' },
            costPerPerson: { type: 'number', description: 'Unit cost' },
            quantity: { type: 'number', description: 'Count or people' },
          },
        },
        description: 'Array of expense line items to compute total, tax, and budget delta',
      },
      budgetLimit: {
        type: 'number',
        description: 'Target spending ceiling in dollars (e.g., 500)',
      },
      currency: {
        type: 'string',
        description: 'ISO currency code (default: USD)',
      },
    },
    required: ['items'],
  },

  create_artifact: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        description: 'Title of the newly created workspace artifact',
      },
      type: {
        type: 'string',
        description: 'Format archetype of the artifact',
        enum: ['plan', 'document', 'table', 'summary'],
      },
      content: {
        type: 'string',
        description: 'Formatted markdown or textual payload of the artifact',
      },
      tags: {
        type: 'array',
        items: { type: 'string' },
        description: 'Categorization tags for the artifact',
      },
    },
    required: ['title', 'type', 'content'],
  },

  update_artifact: {
    type: 'object',
    properties: {
      artifactId: {
        type: 'string',
        description: 'ID of existing artifact to modify',
      },
      changes: {
        type: 'object',
        description: 'Key-value modifications to merge into the artifact',
      },
    },
    required: ['artifactId', 'changes'],
  },

  add_to_canvas: {
    type: 'object',
    properties: {
      artifactId: {
        type: 'string',
        description: 'Unique ID of artifact card to pin and render onto shared canvas',
      },
    },
    required: ['artifactId'],
  },

  remove_from_canvas: {
    type: 'object',
    properties: {
      artifactId: {
        type: 'string',
        description: 'Unique ID of artifact card to unpin or remove from shared canvas',
      },
    },
    required: ['artifactId'],
  },

  save_workspace: {
    type: 'object',
    properties: {
      workspaceName: {
        type: 'string',
        description: 'Human-readable name to persist the current active workspace state',
      },
    },
    required: ['workspaceName'],
  },

  summarize_workspace: {
    type: 'object',
    properties: {
      workspaceId: {
        type: 'string',
        description: 'Optional ID of workspace (defaults to active session)',
      },
    },
    required: [],
  },

  export_artifact: {
    type: 'object',
    properties: {
      artifactId: {
        type: 'string',
        description: 'ID of the artifact to export',
      },
      format: {
        type: 'string',
        description: 'Target export encoding format',
        enum: ['markdown', 'json', 'text'],
      },
    },
    required: ['artifactId', 'format'],
  },
};
