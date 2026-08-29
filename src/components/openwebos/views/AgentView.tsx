import React, { useState } from 'react';
import { 
  Bot, 
  Terminal, 
  Copy, 
  Check, 
  Layers, 
  Code2, 
  RefreshCw, 
  Play,
  Globe
} from 'lucide-react';
import { WebMCPToolDefinition } from '../../../webmcp/types';
import { globalWebMCPRegistry } from '../../../webmcp/registry';

interface AgentViewProps {
  tools: WebMCPToolDefinition[];
}

export const AgentView: React.FC<AgentViewProps> = ({ tools }) => {
  const [copiedManifest, setCopiedManifest] = useState(false);
  const [testTool, setTestTool] = useState(tools[0]?.name || 'search_options');
  const [testPayload, setTestPayload] = useState('{\n  "query": "sustainable solar lodge",\n  "maxResults": 3\n}');
  const [rpcResponse, setRpcResponse] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const manifest = {
    $schema: 'https://webmcp.org/schemas/v1/manifest.json',
    version: '1.0.0-draft-2026',
    name: 'OpenWebOS Agentic Web Kernel',
    description: 'A WebMCP-compliant agentic workspace exposing 12 machine-executable capabilities for autonomous and collaborative tasks.',
    transport: 'window.webmcp / navigator.modelContext',
    capabilities: {
      streaming: true,
      humanInTheLoop: true,
      cryptographicAudit: true,
    },
    tools: tools.map(t => ({
      name: t.name,
      description: t.description,
      classification: t.classification,
      riskLevel: t.riskLevel,
      schema: t.schema,
    })),
  };

  const handleCopyManifest = () => {
    navigator.clipboard.writeText(JSON.stringify(manifest, null, 2));
    setCopiedManifest(true);
    setTimeout(() => setCopiedManifest(false), 2000);
  };

  const handleExecuteRawRpc = async () => {
    setIsExecuting(true);
    try {
      const parsed = JSON.parse(testPayload);
      const res = await globalWebMCPRegistry.executeTool(testTool, parsed, undefined, 'AGENT');
      setRpcResponse({
        jsonrpc: '2.0',
        id: `rpc_${Date.now()}`,
        result: res.result || null,
        error: res.error || null,
        auditHash: res.auditEntry.hash,
      });
    } catch (e: any) {
      setRpcResponse({
        jsonrpc: '2.0',
        id: `rpc_${Date.now()}`,
        error: { code: -32600, message: `Invalid JSON Payload: ${e.message}` },
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-teal-400" />
            <h2 className="text-xl font-black text-white uppercase tracking-wide">
              Machine Agent View &amp; RPC Protocol Inspector
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            How autonomous AI agents and browser kernels see and discover capabilities on this website.
          </p>
        </div>

        <button
          onClick={handleCopyManifest}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center space-x-2 transition border border-slate-700"
        >
          {copiedManifest ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span>{copiedManifest ? 'Manifest Copied' : 'Copy Agent Manifest'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Manifest Inspector (6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400 font-bold flex items-center space-x-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>DISCOVERY MANIFEST (window.webmcp)</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              VALID WEBMCP DRAFT
            </span>
          </div>

          <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-cyan-300 max-h-[600px] overflow-y-auto whitespace-pre-wrap leading-relaxed shadow-xl">
            {JSON.stringify(manifest, null, 2)}
          </pre>
        </div>

        {/* Live RPC Invoker (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono uppercase text-slate-400 font-bold flex items-center space-x-1.5">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                <span>DIRECT AGENT RPC PROTOCOL CALL</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                JSON-RPC 2.0
              </span>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Target Capability</label>
              <select
                value={testTool}
                onChange={(e) => setTestTool(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 focus:outline-hidden"
              >
                {tools.map(t => (
                  <option key={t.name} value={t.name}>{t.name}() [{t.classification}]</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Agent Payload</label>
              <textarea
                rows={5}
                value={testPayload}
                onChange={(e) => setTestPayload(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 focus:outline-hidden"
              />
            </div>

            <button
              onClick={handleExecuteRawRpc}
              disabled={isExecuting}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:opacity-95 text-white font-bold text-xs flex items-center justify-center space-x-2 transition shadow-lg shadow-cyan-500/20"
            >
              {isExecuting ? <RefreshCw className="w-4 h-4 animate-spin text-cyan-300" /> : <Play className="w-4 h-4 fill-current" />}
              <span>Send Agent RPC Invocation</span>
            </button>

            {rpcResponse && (
              <div className="pt-2">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  Machine RPC Response
                </label>
                <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-teal-300 max-h-56 overflow-y-auto whitespace-pre-wrap">
                  {JSON.stringify(rpcResponse, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
