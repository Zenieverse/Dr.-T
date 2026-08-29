import React, { useState } from 'react';
import { 
  BookOpen, 
  Layers, 
  Terminal, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink,
  Code,
  Laptop
} from 'lucide-react';

export const AboutHowItWorksView: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState(false);

  const snippet = `// WebMCP Browser Discovery Specification
if (window.webmcp) {
  // Discover available capabilities on current webpage
  const tools = window.webmcp.listTools();
  console.log('Available WebMCP tools:', tools.map(t => t.name));

  // Execute a discovered tool deterministically
  const result = await window.webmcp.invokeTool('calculate_budget', {
    items: [
      { name: 'Solar Lofts & Botanicals', costPerPerson: 98, quantity: 1 },
      { name: 'Light Rail 72hr Pass', costPerPerson: 24, quantity: 2 },
      { name: 'Soil & Sprout Zero-Waste Bistro', costPerPerson: 32, quantity: 2 }
    ],
    budgetLimit: 500,
    currency: 'USD'
  });
  console.log('Budget Verified:', result);
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
          <BookOpen className="w-3.5 h-3.5" />
          <span>WEBMCP CHALLENGE WHITE PAPER &amp; GUIDE</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
          From Websites Agents Can Read <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
            To Websites Agents Can Actually Use
          </span>
        </h2>
        <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          OpenWebOS demonstrates the transition from passive semantic text rendering to executable, sandboxed agent environments with formal WebMCP contracts.
        </p>
      </div>

      {/* Core Architectural Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 w-fit">
            <Terminal className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">
            1. First-Class WebMCP Registry
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every capability on the page is declared with a formal JSON Schema, category classification, and risk tier. Browser agents discover tools via <code className="text-cyan-300 font-mono">window.webmcp</code> or <code className="text-cyan-300 font-mono">navigator.modelContext</code> without fragile DOM scraping.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 w-fit">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">
            2. Multi-Agent Reasoning Swarm
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Five specialist agent personas (Explorer, Analyst, Planner, Critic, Creator) coordinate through an explicit state machine to discover options, compare multi-criteria trade-offs, compute exact budgets, and draft collaborative artifacts.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 w-fit">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">
            3. Zero-Trust Boundary &amp; Audit
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            All agent inputs are schema-sanitized. High-consequence state mutations pause for Human-in-the-Loop verification. Every execution is sealed into an immutable cryptographic hash chain.
          </p>
        </div>
      </div>

      {/* Code Snippet & Inspection */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Code className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white font-mono">
              WebMCP JavaScript Tool Registration &amp; Discovery Specification
            </h3>
          </div>
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center space-x-1.5 transition border border-slate-700"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
          </button>
        </div>

        <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
{`// 1. WebMCP Native Runtime Tool Registration (document.modelContext)
if (typeof document !== 'undefined' && document.modelContext?.registerTool) {
  document.modelContext.registerTool({
    name: "search_products",
    description: "Search the product catalog for sustainable stays, transport, dining, and wellness items",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search keyword or term" },
        category: { type: "string", description: "Filter category", enum: ["all", "experiences", "accommodations", "transport", "restaurants"] },
        maxPrice: { type: "number", description: "Maximum price filter" },
        minSustainability: { type: "number", description: "Minimum sustainability score (0-100)" }
      },
      required: ["query"]
    },
    execute: async (input) => {
      // Direct WebMCP handler execution with schema validation & audit logging
      return window.webmcp.invokeTool("search_options", input);
    }
  });
}

// 2. Discover available capabilities on current webpage
if (window.webmcp) {
  const tools = window.webmcp.listTools();
  console.log('Available WebMCP tools:', tools.map(t => t.name));

  // 3. Execute a discovered tool deterministically
  const result = await window.webmcp.invokeTool('calculate_budget', {
    items: [
      { name: 'Solar Lofts & Botanicals', costPerPerson: 98, quantity: 1 },
      { name: 'Light Rail 72hr Pass', costPerPerson: 24, quantity: 2 },
      { name: 'Soil & Sprout Zero-Waste Bistro', costPerPerson: 32, quantity: 2 }
    ],
    budgetLimit: 500,
    currency: 'USD'
  });
  console.log('Budget Verified ($417 / $500):', result);
}`}
        </pre>
      </div>

      {/* Judge & Evaluator Testing Guide */}
      <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-500/30 space-y-4 shadow-xl">
        <div className="flex items-center space-x-2">
          <Laptop className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white">
            Testing Guide for Evaluators &amp; Hackathon Judges
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="font-bold text-cyan-300 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Step 1: Execute 2-Minute Demo</span>
            </h4>
            <p className="text-slate-400 leading-relaxed">
              On the <strong>Home &amp; Agent Canvas</strong> tab, click <strong>&quot;Run 2-Minute Demo&quot;</strong>. Watch the multi-agent state machine discover tools, run deterministic searches, compute budget ($417 / $500), prompt for human approval, and generate the final itinerary card.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="font-bold text-indigo-300 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <span>Step 2: Inspect WebMCP Tools &amp; Sandbox</span>
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Open the <strong>WebMCP Tools</strong> tab. Select any of the 12 capabilities (e.g. <code className="text-cyan-300">calculate_budget</code>), inspect its JSON Schema, modify the arguments in the sandbox, and execute live against deterministic mock data.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="font-bold text-teal-300 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              <span>Step 3: Test Collaboration &amp; &quot;Ask Why&quot;</span>
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Visit the <strong>Human + Agent Collaboration</strong> tab. Inspect the pending lodging swap proposal, click <strong>&quot;Ask Why&quot;</strong> to reveal the multi-dimensional cost/transit/carbon trade-off rationale, and accept or reject.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="font-bold text-emerald-300 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Step 4: Verify Safety &amp; Audit Trail</span>
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Inspect the <strong>Safety &amp; Trust Center</strong> to verify that all tool actions generated tamper-evident cryptographic hash signatures, classified by risk tier.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
