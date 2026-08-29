import React, { useState } from 'react';
import { 
  Terminal, 
  Play, 
  Check, 
  AlertCircle, 
  ShieldAlert, 
  Code2, 
  Copy, 
  Search,
  Filter
} from 'lucide-react';
import { WebMCPToolDefinition, ToolClassification } from '../../../webmcp/types';
import { globalWebMCPRegistry } from '../../../webmcp/registry';
import { ToolExecutionContext } from '../../../webmcp/tools';

interface WebMCPToolsViewProps {
  tools: WebMCPToolDefinition[];
  context: ToolExecutionContext;
  selectedToolName?: string;
}

export const WebMCPToolsView: React.FC<WebMCPToolsViewProps> = ({
  tools,
  context,
  selectedToolName,
}) => {
  const [selectedTool, setSelectedTool] = useState<WebMCPToolDefinition>(() => {
    return tools.find(t => t.name === selectedToolName) || tools[0];
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState<'ALL' | ToolClassification>('ALL');
  const [inputJson, setInputJson] = useState<string>('{\n  "query": "sustainable solar lodge",\n  "maxResults": 5\n}');
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const sampleInputs: Record<string, string> = {
    search_products: JSON.stringify({ query: 'sustainable solar lodge', category: 'accommodations', maxPrice: 150, minSustainability: 90 }, null, 2),
    search_options: JSON.stringify({ query: 'sustainable solar lodge', maxResults: 5, minSustainability: 90 }, null, 2),
    get_option_details: JSON.stringify({ id: 'acc_01' }, null, 2),
    compare_options: JSON.stringify({ optionIds: ['acc_01', 'acc_02', 'acc_03'], criteria: ['price', 'sustainabilityScore'] }, null, 2),
    rank_options: JSON.stringify({ optionIds: ['exp_01', 'exp_03', 'exp_04'], objective: 'Maximize dark sky & eco wellness' }, null, 2),
    calculate_budget: JSON.stringify({
      items: [
        { name: 'EcoLodge Canopy Suites', costPerPerson: 135, quantity: 1 },
        { name: 'Light Rail 72hr Pass', costPerPerson: 24, quantity: 2 },
        { name: 'Zero-Waste Dinner', costPerPerson: 32, quantity: 2 },
      ],
      budgetLimit: 500,
    }, null, 2),
    create_artifact: JSON.stringify({
      title: 'Sample 3-Day Eco Plan',
      type: 'plan',
      content: 'Day 1: Light rail arrival\nDay 2: Bioluminescent kayak paddle\nDay 3: Farm tour & departure',
      tags: ['Demo', 'WebMCP'],
    }, null, 2),
    update_artifact: JSON.stringify({ artifactId: 'art_demo_01', changes: { status: 'approved' } }, null, 2),
    add_to_canvas: JSON.stringify({ artifactId: 'art_demo_01' }, null, 2),
    remove_from_canvas: JSON.stringify({ artifactId: 'art_demo_01' }, null, 2),
    save_workspace: JSON.stringify({ workspaceName: 'Weekend Eco Trip 2026' }, null, 2),
    summarize_workspace: JSON.stringify({}, null, 2),
    export_artifact: JSON.stringify({ artifactId: 'art_demo_01', format: 'markdown' }, null, 2),
  };

  const handleSelectTool = (tool: WebMCPToolDefinition) => {
    setSelectedTool(tool);
    setErrorMsg(null);
    setExecutionResult(null);
    setInputJson(sampleInputs[tool.name] || '{\n}');
  };

  const handleExecute = async () => {
    setIsExecuting(true);
    setErrorMsg(null);
    try {
      const parsed = JSON.parse(inputJson);
      const res = await globalWebMCPRegistry.executeTool(selectedTool.name, parsed, context, 'HUMAN');
      if (res.success) {
        setExecutionResult(res.result);
      } else {
        setErrorMsg(res.error || 'Execution failed');
      }
    } catch (e: any) {
      setErrorMsg(`JSON Parse Error: ${e.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(JSON.stringify(selectedTool.schema, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredTools = tools.filter(t => {
    if (filterClass !== 'ALL' && t.classification !== filterClass) return false;
    if (searchQuery && !t.name.toLowerCase().includes(searchQuery.toLowerCase()) && !t.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-black text-white uppercase tracking-wide">
              WebMCP Tool Registry &amp; Sandbox
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real browser-registered tools exposed for agent discovery and execution.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
            {(['ALL', 'READ', 'ACTION'] as const).map(cls => (
              <button
                key={cls}
                onClick={() => setFilterClass(cls)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition ${
                  filterClass === cls
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tool List (4 cols) */}
        <div className="lg:col-span-4 space-y-2 max-h-[700px] overflow-y-auto pr-1">
          {filteredTools.map(tool => {
            const isSelected = selectedTool.name === tool.name;
            return (
              <button
                key={tool.name}
                onClick={() => handleSelectTool(tool)}
                className={`w-full p-3.5 rounded-2xl border text-left transition space-y-2 ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-500/80 shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-900/80 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-mono text-xs font-bold text-cyan-300">
                    {tool.name}()
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${
                      tool.classification === 'READ'
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                        : tool.riskLevel === 'HIGH'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    }`}
                  >
                    {tool.classification} • {tool.riskLevel} RISK
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                  {tool.description}
                </p>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800/60">
                  <span>Calls: {tool.executionCount || 0}</span>
                  <span>Last: {tool.lastExecuted || 'Never'}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Tool Inspector & Sandbox (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Tool Details */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-mono font-bold text-white">
                    {selectedTool.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800">
                    WebMCP v1.0
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  {selectedTool.description}
                </p>
              </div>

              <button
                onClick={handleCopySchema}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center space-x-1.5 transition border border-slate-700 shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Schema'}</span>
              </button>
            </div>

            {/* Input Schema Parameters */}
            <div>
              <div className="text-xs font-mono uppercase text-slate-400 font-bold mb-2 flex items-center space-x-1.5">
                <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>FORMAL INPUT SCHEMA (JSON Schema Draft 7)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {Object.entries(selectedTool.schema.properties).map(([paramName, paramDef]: [string, any]) => {
                  const isRequired = selectedTool.schema.required?.includes(paramName);
                  return (
                    <div key={paramName} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                      <div className="flex items-center justify-between font-mono text-[11px]">
                        <span className="font-bold text-cyan-300">{paramName}</span>
                        <span className="text-slate-500">
                          {paramDef.type} {isRequired && <span className="text-rose-400 font-bold">*required</span>}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        {paramDef.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Sandbox Execution */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-slate-400 font-bold flex items-center space-x-1.5">
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  <span>INTERACTIVE EXECUTION SANDBOX</span>
                </span>
                <button
                  onClick={handleExecute}
                  disabled={isExecuting}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-emerald-500/20 transition transform active:scale-95 disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isExecuting ? 'Executing...' : 'Execute Tool'}</span>
                </button>
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  JSON Arguments
                </label>
                <textarea
                  value={inputJson}
                  onChange={(e) => setInputJson(e.target.value)}
                  rows={6}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 focus:outline-hidden focus:border-cyan-500/80"
                />
              </div>

              {/* Error Output */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span className="font-mono">{errorMsg}</span>
                </div>
              )}

              {/* Execution Output */}
              {executionResult && (
                <div>
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                    WebMCP Deterministic Output
                  </label>
                  <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 max-h-60 overflow-y-auto whitespace-pre-wrap">
                    {JSON.stringify(executionResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
