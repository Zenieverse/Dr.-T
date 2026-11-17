// ============================================================================
// GEMINI CIRCUIT BREAKER & RESILIENT INFERENCE WRAPPER
// Protects server stability by gracefully catching 429 Quota Exhaustion
// and Timeouts, seamlessly routing to verified deterministic heuristic engines.
// ============================================================================

interface CircuitBreakerState {
  isOpen: boolean;
  cooldownUntil: number;
  lastReason?: string;
}

const circuitBreakers: Map<string, CircuitBreakerState> = new Map();
const modelLastStatus: Map<
  string,
  { state: 'LIVE_AI' | 'DETERMINISTIC_FALLBACK' | 'UNAVAILABLE'; reason: string; updatedAt: string }
> = new Map();

export class GeminiCircuitBreaker {
  public static getDiagnostics(
    model = 'gemini-3.8-flash',
    hasApiKey = false
  ): {
    model: string;
    status: 'LIVE_AI' | 'DETERMINISTIC_FALLBACK' | 'UNAVAILABLE';
    circuitOpen: boolean;
    reason: string;
    updatedAt?: string;
  } {
    if (!hasApiKey) {
      return {
        model,
        status: 'UNAVAILABLE',
        circuitOpen: false,
        reason: 'GEMINI_API_KEY not configured in runtime environment.',
      };
    }
    const last = modelLastStatus.get(model);
    const open = this.isCircuitOpen(model);
    if (!last) {
      return {
        model,
        status: 'LIVE_AI',
        circuitOpen: open,
        reason: 'Configured and ready (no failures recorded in current process).',
      };
    }
    return {
      model,
      status: last.state,
      circuitOpen: open,
      reason: last.reason,
      updatedAt: last.updatedAt,
    };
  }

  /**
   * Checks whether the circuit breaker is open (cooldown active after 429 quota exhaustion or timeouts).
   */
  public static isCircuitOpen(model = 'gemini-3.8-flash'): boolean {
    const state = circuitBreakers.get(model);
    if (!state || !state.isOpen) return false;

    if (Date.now() >= state.cooldownUntil) {
      // Cooldown expired; allow trial request
      state.isOpen = false;
      return false;
    }

    return true;
  }

  /**
   * Trips the circuit breaker for a given model.
   */
  public static tripCircuit(model: string, reason: string, cooldownSeconds = 300): void {
    circuitBreakers.set(model, {
      isOpen: true,
      cooldownUntil: Date.now() + cooldownSeconds * 1000,
      lastReason: reason
    });
  }

  /**
   * Evaluates an error from Gemini and trips the circuit breaker if it is a quota or timeout issue.
   */
  public static recordFailure(model: string, err: any): void {
    const errMsg = String(err?.message || err || '').slice(0, 220);
    const status = err?.status || err?.code || '';
    const is429 = errMsg.includes('429') || 
                  errMsg.includes('quota') || 
                  errMsg.includes('RESOURCE_EXHAUSTED') || 
                  err?.status === 'RESOURCE_EXHAUSTED' ||
                  err?.code === 429;
    const isTimeout = errMsg.includes('timed out') || errMsg.includes('timeout');

    modelLastStatus.set(model, {
      state: 'DETERMINISTIC_FALLBACK',
      reason: is429
        ? 'Quota limit (429/RESOURCE_EXHAUSTED) -> Deterministic fallback engaged.'
        : isTimeout
          ? `Timeout (${errMsg}) -> Deterministic fallback engaged.`
          : `Remote inference error${status ? ` (${status})` : ''}: ${errMsg || 'Unknown error'} -> Deterministic fallback engaged.`,
      updatedAt: new Date().toISOString(),
    });

    if (is429) {
      let cooldown = 300; // default 5 minutes
      try {
        const match = errMsg.match(/retryDelay["']?\s*:\s*["']?(\d+)/i) || 
                      errMsg.match(/retry in\s+(\d+)m/i);
        if (match && match[1]) {
          cooldown = Math.min(Math.max(parseInt(match[1], 10), 60), 3600);
        }
      } catch {
        // use default
      }
      this.tripCircuit(model, 'Quota Limit Exceeded (429/RESOURCE_EXHAUSTED)', cooldown);
    } else if (isTimeout) {
      this.tripCircuit(model, 'Inference Request Timeout', 60);
    }
  }

  /**
   * Executes a Gemini generateContent call with a timeout promise and circuit breaker.
   * Returns generated text, or null if the circuit is open or call fails, without throwing.
   */
  public static async executeWithFallback(
    geminiClient: any,
    model: string,
    contents: string,
    timeoutMs = 2500
  ): Promise<string | null> {
    if (!geminiClient || this.isCircuitOpen(model)) {
      if (!geminiClient) {
        modelLastStatus.set(model, {
          state: 'UNAVAILABLE',
          reason: 'Gemini client unavailable; deterministic engine active.',
          updatedAt: new Date().toISOString(),
        });
      }
      return null;
    }

    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        const timer = setTimeout(() => reject(new Error(`AI enrichment timed out (${timeoutMs}ms limit)`)), timeoutMs);
        if (typeof timer.unref === 'function') timer.unref();
      });

      const aiResponse = await Promise.race([
        geminiClient.models.generateContent({
          model,
          contents
        }),
        timeoutPromise
      ]);

      if (aiResponse && aiResponse.text) {
        modelLastStatus.set(model, {
          state: 'LIVE_AI',
          reason: `Verified live response from ${model}.`,
          updatedAt: new Date().toISOString(),
        });
        return aiResponse.text.trim();
      }
      modelLastStatus.set(model, {
        state: 'DETERMINISTIC_FALLBACK',
        reason: 'Empty response from model; deterministic fallback engaged.',
        updatedAt: new Date().toISOString(),
      });
      return null;
    } catch (err: any) {
      this.recordFailure(model, err);
      // Clean fallback: cleanly handled without dumping error stack traces to console.warn
      return null;
    }
  }
}
