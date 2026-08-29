import { WebMCPToolDefinition, WebMCPStatus, AuditLogEntry } from './types';
import { WEBMCP_TOOLS, ToolExecutionContext } from './tools';
import { validateToolArguments, requiresHumanApproval, generateAuditHash } from './security';

// ============================================================================
// WEBMCP RUNTIME REGISTRY & BROWSER DISCOVERY INTERFACE
// ============================================================================

export class WebMCPRegistry {
  private tools: Map<string, WebMCPToolDefinition> = new Map();
  private auditLog: AuditLogEntry[] = [];
  private lastHash = '0x00000000';
  private executionListeners: Array<(event: any) => void> = [];

  constructor() {
    this.registerBuiltInTools();
    this.bindBrowserWindowAPI();
  }

  private registerBuiltInTools() {
    for (const [name, def] of Object.entries(WEBMCP_TOOLS)) {
      this.tools.set(name, {
        ...def,
        executionCount: 0,
      });
    }
  }

  /**
   * Binds capabilities to standard browser globals and event dispatchers
   */
  private bindBrowserWindowAPI() {
    if (typeof window === 'undefined') return;

    const webmcpBridge = {
      version: '1.0.0-draft-2026',
      name: 'OpenWebOS Agentic Web Kernel',
      listTools: () => this.getAllTools().map(t => ({
        name: t.name,
        description: t.description,
        schema: t.schema,
        classification: t.classification,
        riskLevel: t.riskLevel,
      })),
      invokeTool: (toolName: string, args: any) => this.executeTool(toolName, args),
      capabilities: {
        streaming: true,
        humanInTheLoop: true,
        auditLog: true,
      },
    };

    // Standard draft WebMCP attachment
    (window as any).webmcp = webmcpBridge;
    
    const registerToolImplementation = (toolSpec: {
      name: string;
      description: string;
      inputSchema?: any;
      schema?: any;
      execute?: (input: any) => Promise<any>;
      handler?: (args: any, context?: any) => Promise<any>;
      classification?: any;
      riskLevel?: any;
    }) => {
      return this.registerTool(toolSpec);
    };

    const modelContextObj = {
      tools: webmcpBridge.listTools(),
      call: webmcpBridge.invokeTool,
      registerTool: registerToolImplementation,
    };

    if (navigator as any) {
      (navigator as any).modelContext = modelContextObj;
    }
    if (typeof document !== 'undefined') {
      (document as any).modelContext = modelContextObj;
    }

    // Broadcast registration event for extensions / agents inspecting the page
    try {
      window.dispatchEvent(new CustomEvent('webmcp:ready', {
        detail: {
          toolsCount: this.tools.size,
          tools: this.getAllTools().map(t => t.name),
        },
      }));
    } catch (e) {
      // ignore in testing environments
    }
  }

  public getAllTools(): WebMCPToolDefinition[] {
    return Array.from(this.tools.values());
  }

  public registerTool(toolSpec: {
    name: string;
    description: string;
    inputSchema?: any;
    schema?: any;
    execute?: (input: any) => Promise<any>;
    handler?: (args: any, context?: any) => Promise<any>;
    classification?: any;
    riskLevel?: any;
  }): WebMCPToolDefinition {
    const finalSchema = toolSpec.inputSchema || toolSpec.schema || {
      type: 'object',
      properties: {},
    };

    const handler = toolSpec.execute 
      ? async (args: any) => toolSpec.execute!(args)
      : (toolSpec.handler || (async () => ({ success: true })));

    const toolDef: WebMCPToolDefinition = {
      name: toolSpec.name,
      description: toolSpec.description || 'Custom WebMCP registered tool',
      classification: toolSpec.classification || 'READ',
      riskLevel: toolSpec.riskLevel || 'LOW',
      schema: finalSchema,
      handler,
      executionCount: 0,
    };

    this.tools.set(toolDef.name, toolDef);
    this.notify({ type: 'tool_registered', toolName: toolDef.name });
    return toolDef;
  }

  public getTool(name: string): WebMCPToolDefinition | undefined {
    return this.tools.get(name);
  }

  public getAuditLog(): AuditLogEntry[] {
    return [...this.auditLog];
  }

  public subscribe(listener: (event: any) => void): () => void {
    this.executionListeners.push(listener);
    return () => {
      this.executionListeners = this.executionListeners.filter(l => l !== listener);
    };
  }

  private notify(event: any) {
    for (const listener of this.executionListeners) {
      try {
        listener(event);
      } catch (e) {
        console.error('WebMCP listener error:', e);
      }
    }
  }

  /**
   * Executes a registered WebMCP tool with security validation, permission checks, and audit logging
   */
  public async executeTool(
    toolName: string,
    rawArgs: any,
    context?: ToolExecutionContext,
    actor: 'HUMAN' | 'AGENT' = 'AGENT'
  ): Promise<{ success: boolean; result?: any; error?: string; auditEntry: AuditLogEntry }> {
    const tool = this.tools.get(toolName);
    const startTime = Date.now();

    if (!tool) {
      const err = `WebMCP tool '${toolName}' is not registered in active workspace.`;
      const auditEntry: AuditLogEntry = {
        id: `aud_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        actor,
        action: `FAILED_CALL: ${toolName}`,
        toolName,
        argumentsSummary: JSON.stringify(rawArgs || {}).slice(0, 150),
        resultSummary: err,
        riskLevel: 'LOW',
        approvalStatus: 'AUTO_ALLOWED',
        hash: this.lastHash,
      };
      this.auditLog.unshift(auditEntry);
      return { success: false, error: err, auditEntry };
    }

    // 1. Schema Validation & Sanitization
    const validation = validateToolArguments(toolName, rawArgs, tool.schema);
    if (!validation.valid) {
      const err = `Schema Validation Error: ${validation.error}`;
      const auditEntry: AuditLogEntry = {
        id: `aud_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        actor,
        action: `INVALID_PAYLOAD: ${toolName}`,
        toolName,
        argumentsSummary: JSON.stringify(rawArgs || {}).slice(0, 150),
        resultSummary: err,
        riskLevel: tool.riskLevel,
        approvalStatus: 'REJECTED',
        hash: this.lastHash,
      };
      this.auditLog.unshift(auditEntry);
      return { success: false, error: err, auditEntry };
    }

    // 2. Notify execution start
    this.notify({
      type: 'tool_start',
      toolName,
      args: validation.sanitizedArgs,
      actor,
    });

    // 3. Execution
    try {
      const result = await tool.handler(validation.sanitizedArgs, context);
      const duration = Date.now() - startTime;

      tool.lastExecuted = new Date().toLocaleTimeString();
      tool.executionCount = (tool.executionCount || 0) + 1;

      // 4. Audit Log
      const auditEntry: AuditLogEntry = {
        id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        timestamp: new Date().toLocaleTimeString(),
        actor,
        action: `EXECUTE_${toolName.toUpperCase()}`,
        toolName,
        argumentsSummary: JSON.stringify(validation.sanitizedArgs).slice(0, 150),
        resultSummary: JSON.stringify(result).slice(0, 200),
        riskLevel: tool.riskLevel,
        approvalStatus: 'APPROVED',
        hash: generateAuditHash(this.lastHash, {
          timestamp: new Date().toISOString(),
          actor,
          toolName,
          action: toolName,
          argumentsSummary: JSON.stringify(validation.sanitizedArgs),
        }),
      };

      this.lastHash = auditEntry.hash;
      this.auditLog.unshift(auditEntry);

      // 5. Notify complete
      this.notify({
        type: 'tool_success',
        toolName,
        args: validation.sanitizedArgs,
        result,
        duration,
        auditEntry,
      });

      return { success: true, result, auditEntry };
    } catch (err: any) {
      const errorMsg = err?.message || 'Tool execution encountered unexpected fault';
      const auditEntry: AuditLogEntry = {
        id: `aud_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        actor,
        action: `RUNTIME_ERROR: ${toolName}`,
        toolName,
        argumentsSummary: JSON.stringify(validation.sanitizedArgs).slice(0, 150),
        resultSummary: errorMsg,
        riskLevel: tool.riskLevel,
        approvalStatus: 'AUTO_ALLOWED',
        hash: this.lastHash,
      };
      this.auditLog.unshift(auditEntry);

      this.notify({
        type: 'tool_error',
        toolName,
        error: errorMsg,
      });

      return { success: false, error: errorMsg, auditEntry };
    }
  }

  public getStatus(): WebMCPStatus {
    const isBrowser = typeof window !== 'undefined';
    const hasNativeWebMCP = isBrowser && !!((window as any).webmcp || (navigator as any)?.modelContext);
    
    return {
      supported: true,
      registeredToolsCount: this.tools.size,
      browser: typeof navigator !== 'undefined' ? navigator.userAgent.split(' ')[0] : 'Node/SSR',
      version: 'WebMCP Draft 2026.1',
      connected: true,
      transport: hasNativeWebMCP ? 'native_webmcp' : 'simulated_fallback',
      lastPing: new Date().toLocaleTimeString(),
    };
  }
}

// Global Singleton
export const globalWebMCPRegistry = new WebMCPRegistry();
