import { 
  AgentRole, 
  OrchestrationState, 
  AgentActivityEvent, 
  AgentProposal, 
  CanvasCard 
} from './types';
import { globalWebMCPRegistry } from './registry';
import { ToolExecutionContext } from './tools';

// ============================================================================
// MULTI-AGENT STATE MACHINE & WEBMCP ORCHESTRATOR
// ============================================================================

export interface OrchestratorRunParams {
  goal: string;
  context: ToolExecutionContext;
  onStateChange: (state: OrchestrationState) => void;
  onActivityEvent: (event: AgentActivityEvent) => void;
  onProposalCreated: (proposal: AgentProposal) => void;
  requestHumanApproval: (toolName: string, args: any, reason: string, riskLevel: 'LOW' | 'MEDIUM' | 'HIGH') => Promise<boolean>;
}

export class AgentOrchestrator {
  private currentState: OrchestrationState = 'IDLE';

  public getState(): OrchestrationState {
    return this.currentState;
  }

  /**
   * Core autonomous workflow executing user goal against WebMCP tools
   */
  public async executeGoal(params: OrchestratorRunParams): Promise<{ success: boolean; finalSummary: string }> {
    const { goal, context, onStateChange, onActivityEvent, onProposalCreated, requestHumanApproval } = params;

    const logEvent = (
      actor: 'HUMAN' | 'AGENT' | 'WEBMCP_KERNEL',
      role: AgentRole | undefined,
      toolName: string | undefined,
      status: 'queued' | 'running' | 'success' | 'warning' | 'error',
      title: string,
      summary: string,
      payload?: any,
      result?: any
    ) => {
      const event: AgentActivityEvent = {
        id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        timestamp: new Date().toISOString(),
        timeLabel: new Date().toLocaleTimeString(),
        actor,
        role,
        toolName,
        status,
        title,
        summary,
        payload,
        result,
      };
      onActivityEvent(event);
    };

    try {
      // 1. UNDERSTANDING
      this.currentState = 'UNDERSTANDING';
      onStateChange('UNDERSTANDING');
      logEvent('AGENT', 'EXPLORER', undefined, 'running', 'Goal Received', `Interpreting human request: "${goal}"`);
      await new Promise(r => setTimeout(r, 600));

      // 2. DISCOVERING WEBMCP CAPABILITIES
      this.currentState = 'DISCOVERING_TOOLS';
      onStateChange('DISCOVERING_TOOLS');
      const availableTools = globalWebMCPRegistry.getAllTools();
      logEvent(
        'WEBMCP_KERNEL',
        undefined,
        undefined,
        'success',
        'WebMCP Tools Discovered',
        `Registry connected. Discovered ${availableTools.length} machine-executable capabilities on this web workspace.`,
        { tools: availableTools.map(t => t.name) }
      );
      await new Promise(r => setTimeout(r, 500));

      // 3. EXPLORER: search_options
      this.currentState = 'EXECUTING';
      onStateChange('EXECUTING');
      logEvent('AGENT', 'EXPLORER', 'search_options', 'running', 'Searching Options', 'Querying eco-accommodations, transport passes, and regenerative experiences');
      
      const searchRes = await globalWebMCPRegistry.executeTool('search_options', {
        query: goal,
        category: 'all',
        maxResults: 12,
        minSustainability: 85,
      }, context);

      const items = searchRes.result?.items || [];
      logEvent(
        'AGENT',
        'EXPLORER',
        'search_options',
        'success',
        'Search Executed',
        `Discovered ${items.length} qualified sustainable candidates across stays, dining, transit, and experiences.`,
        undefined,
        searchRes.result
      );
      await new Promise(r => setTimeout(r, 700));

      // 4. ANALYST: compare_options
      logEvent('AGENT', 'ANALYST', 'compare_options', 'running', 'Comparing Candidates', 'Evaluating trade-offs between stay proximity, eco-certifications, and pricing');
      const shortlistIds = items.slice(0, 4).map((x: any) => x.id);
      const compareRes = await globalWebMCPRegistry.executeTool('compare_options', {
        optionIds: shortlistIds,
        criteria: ['price', 'sustainabilityScore', 'rating'],
      }, context);

      logEvent(
        'AGENT',
        'ANALYST',
        'compare_options',
        'success',
        'Comparison Matrix Complete',
        `Ranked candidates. Identified Solar Lofts (95% eco-rating, transit-adjacent) as prime lodging candidate.`,
        undefined,
        compareRes.result
      );
      await new Promise(r => setTimeout(r, 600));

      // 5. PLANNER: calculate_budget
      logEvent('AGENT', 'PLANNER', 'calculate_budget', 'running', 'Calculating Budget', 'Computing 2-person line items for lodging, dining, experiences, and transit');
      
      const plannedLineItems = [
        { name: 'EcoLodge Canopy Suites (2 Nights)', costPerPerson: 135, quantity: 1, category: 'Accommodations' },
        { name: 'All-Electric Light Rail 72hr Pass', costPerPerson: 24, quantity: 2, category: 'Transit' },
        { name: 'Soil & Sprout Zero-Waste Dinner', costPerPerson: 32, quantity: 2, category: 'Dining' },
        { name: 'Wild Forage Hearth Bakery Lunch', costPerPerson: 22, quantity: 2, category: 'Dining' },
        { name: 'Canopy Forest Bathing Guided Walk', costPerPerson: 20, quantity: 2, category: 'Experiences' },
        { name: 'Bioluminescent Kayak Paddle', costPerPerson: 45, quantity: 2, category: 'Experiences' },
      ];

      const budgetRes = await globalWebMCPRegistry.executeTool('calculate_budget', {
        items: plannedLineItems,
        budgetLimit: 500,
        currency: 'USD',
      }, context);

      logEvent(
        'AGENT',
        'PLANNER',
        'calculate_budget',
        'success',
        'Budget Computed',
        `Draft Total: $${budgetRes.result?.grandTotal} of $500 limit ($${budgetRes.result?.remaining} remaining).`,
        undefined,
        budgetRes.result
      );
      await new Promise(r => setTimeout(r, 600));

      // 6. CRITIC: Proposal Optimization & Human Approval
      this.currentState = 'WAITING_FOR_APPROVAL';
      onStateChange('WAITING_FOR_APPROVAL');
      
      const proposal: AgentProposal = {
        id: `prop_${Date.now()}`,
        title: 'Optimize Lodging: Swap Canopy Suites for Solar Lofts',
        description: 'Replace EcoLodge Canopy Suites ($135/night) with Solar Lofts ($98/night) located directly at light rail station.',
        reasoning: [
          'Saves $38.00 on total weekend accommodation',
          'Immediate access to All-Electric Light Rail transit station',
          'Maintains 95/100 LEED Platinum sustainability rating',
          'Expands remaining spending cushion from $83 to $121',
        ],
        toolAction: 'calculate_budget',
        suggestedChanges: {
          substitute: 'Solar Lofts & Botanicals',
          savings: 38,
        },
        costImpact: -38,
        sustainabilityImpact: 95,
        status: 'pending',
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      onProposalCreated(proposal);
      logEvent('AGENT', 'CRITIC', undefined, 'warning', 'Agent Proposal Generated', 'Critic identified a cost & transit optimization. Awaiting human decision.');

      // Request explicit approval for creating high-impact shared artifact
      const isApproved = await requestHumanApproval(
        'create_artifact',
        {
          title: '3-Day Sustainable Weekend Itinerary ($417 / $500)',
          type: 'plan',
          targetBudget: '$500',
        },
        'Agent wants to publish the finalized 3-Day Eco-Plan and Budget Breakdown to the Shared Workspace Canvas.',
        'HIGH'
      );

      if (!isApproved) {
        this.currentState = 'IDLE';
        onStateChange('IDLE');
        logEvent('HUMAN', undefined, 'create_artifact', 'warning', 'Action Rejected', 'Human collaborator declined the artifact generation request.');
        return { success: false, finalSummary: 'Proposal rejected by user.' };
      }

      // 7. CREATOR: create_artifact
      this.currentState = 'CREATING';
      onStateChange('CREATING');
      logEvent('AGENT', 'CREATOR', 'create_artifact', 'running', 'Synthesizing Shared Artifact', 'Publishing rich formatted Markdown itinerary and budget ledger to canvas');

      const markdownContent = `### 🌿 3-Day Sustainable Weekend Itinerary for Two
**Total Budget:** $417.00 (Budget: $500.00 | Surplus: **$83.00**)  
**Sustainability Index:** 96.8 / 100 (Zero-Waste Certified)

---

#### 🚆 Friday: Arrival & Forest Immersion
- **14:00** — Board *All-Electric Light Rail* from Metro Hub (72hr Unlimited Transit Pass).
- **15:30** — Check-in at *Solar Lofts & Botanicals* (LEED Platinum, compost hub, rooftop solar).
- **17:00** — *Canopy Forest Bathing & Botanical Walk* with certified naturalist guide in 300-year redwoods.
- **19:30** — Dinner at *Soil & Sprout Zero-Waste Bistro* (Hyper-local 5-course seasonal tasting).

#### 🚣 Saturday: Estuary Adventure & Hearth Bakery
- **08:30** — Breakfast at *Wild Forage Hearth & Bakery* (Ancient grain sourdough & wild mushroom broth).
- **10:30** — Hop-on *Community E-Bike Pair* along the scenic riparian greenway.
- **14:00** — Zero-waste picnic at Emerald Cove Estuary.
- **19:00** — *Sunset Bioluminescent Estuary Kayak Paddle* in protected marine reserve.

#### 🌸 Sunday: Farm Hands-On & Return
- **09:30** — *Regenerative Farm Hands-On Workshop & Honey Tasting* at Sun Valley Organic Farm.
- **12:30** — Lunch at *Roots & Shoots Plant Kitchen* (Upcycled botanicals & comfort bowls).
- **15:00** — Departure via zero-emission electric rail line.

---
*Created collaboratively by Human Collaborator + OpenWebOS Multi-Agent Swarm via WebMCP.*`;

      const createRes = await globalWebMCPRegistry.executeTool('create_artifact', {
        title: '🌿 3-Day Sustainable Weekend Itinerary (2 People • $417 Total)',
        type: 'plan',
        content: markdownContent,
        tags: ['Eco-Travel', 'WebMCP', 'Budget-Verified', 'Itinerary'],
      }, context, 'AGENT');

      // 8. REVIEWING & COMPLETED
      this.currentState = 'REVIEWING';
      onStateChange('REVIEWING');
      await new Promise(r => setTimeout(r, 400));

      this.currentState = 'COMPLETED';
      onStateChange('COMPLETED');
      logEvent('AGENT', 'CREATOR', 'create_artifact', 'success', 'Artifact Live on Canvas', 'Collaboration complete! Finalized plan rendered on shared workspace canvas.', undefined, createRes.result);

      return {
        success: true,
        finalSummary: `Successfully created sustainable 3-day weekend plan for 2 people with $417 total spend ($83 under $500 budget limit).`,
      };
    } catch (error: any) {
      this.currentState = 'ERROR';
      onStateChange('ERROR');
      logEvent('WEBMCP_KERNEL', undefined, undefined, 'error', 'Orchestration Fault', error?.message || 'Unknown agent fault');
      return { success: false, finalSummary: error?.message || 'Error executing agent pipeline.' };
    }
  }
}

export const globalAgentOrchestrator = new AgentOrchestrator();
