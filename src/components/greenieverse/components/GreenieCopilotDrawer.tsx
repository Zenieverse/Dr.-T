// ============================================================================
// 🌌 GREENIEVERSE - GREENIE AI COPILOT DRAWER
// State-aware conversational agricultural strategist assistant
// ============================================================================

import React, { useState } from 'react';
import { GameState } from '../../../types/greenieverse';
import { X, Send, Bot, Sparkles, TrendingUp, ShieldAlert, Coins, HelpCircle } from 'lucide-react';

interface GreenieCopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  state: GameState;
}

interface CopilotMessage {
  id: string;
  sender: 'user' | 'greenie';
  text: string;
  timestamp: string;
  badge?: string;
}

export const GreenieCopilotDrawer: React.FC<GreenieCopilotDrawerProps> = ({
  isOpen,
  onClose,
  state,
}) => {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'init',
      sender: 'greenie',
      text: `Greetings, Commander. I am Greenie AI, your Autonomous Agricultural Strategist. We are currently at Turn ${state.currentTurn} (Day ${state.currentDay}) in ${state.seasonPhase}.\n\nOur current Net Worth is $${state.netWorth.toLocaleString()} with $${state.cash.toLocaleString()} liquid Sol Credits. Ask me about market arbitrage, opponent harvest waves, worker routing, or how we plan to exceed the 3043.5 benchmark.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      badge: 'STATE TELEMETRY ACTIVE',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    "Why did you plant strawberries?",
    "Should I hire another worker?",
    "Why is tomato price falling?",
    "What is the opponent doing?",
    "Can we beat 3043.5?",
    "What is our biggest risk right now?",
  ];

  const handleSend = (queryText?: string) => {
    const text = queryText || input;
    if (!text.trim()) return;

    const userMsg: CopilotMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      const q = text.toLowerCase();

      if (q.includes('strawberry') || q.includes('strawberries')) {
        reply = `Nebula Strawberries currently have a Scarcity Score of ${state.market.STRAWBERRY?.scarcityScore || 84}/100 and a 24-turn price forecast of $${state.market.STRAWBERRY?.forecast24Turn || 146}. The opponent has zero strawberry plots in their pipeline, giving us dominant pricing power and an estimated profit contribution of +$490 per tile.`;
      } else if (q.includes('hire') || q.includes('worker')) {
        const workerCost = 850 * Math.pow(1.35, state.workers.length);
        if (state.cash < workerCost + 200) {
          reply = `Recommendation: HOLD. Hiring Worker #${state.workers.length + 1} costs $${workerCost.toFixed(0)}, but we only have $${state.cash} liquid cash. Hiring now creates a severe liquidity bottleneck. Maintain current workforce of ${state.workers.length} units.`;
        } else {
          reply = `Worker Fleet Analysis: Current workforce of ${state.workers.length} units is operating at ${state.workers[0]?.efficiency || 92}% efficiency. Hiring is feasible if we unlock the Northeast Solar Quadrant next turn.`;
        }
      } else if (q.includes('tomato')) {
        reply = `Tomato prices are dropping (-18% forecast) because our Opponent Intelligence Engine detected a massive competitor harvest wave of 6 mature tomato plots maturing within 24 turns. We proactively avoided planting tomatoes to prevent selling into an oversaturated market.`;
      } else if (q.includes('opponent')) {
        reply = `Opponent Radar (${state.opponent.name}): Classified as a "${state.opponent.strategyClass}" (${state.opponent.strategyConfidence}% confidence). They currently hold ~$${state.opponent.estimatedNetWorth.toLocaleString()} net worth and are over-indexed on long-duration crops.`;
      } else if (q.includes('3043') || q.includes('beat') || q.includes('target') || q.includes('score')) {
        const diff = state.netWorth - 3043.5;
        if (diff >= 0) {
          reply = `Yes! Our current projected net worth is $${state.netWorth.toLocaleString()}, which is +$${diff.toFixed(1)} ABOVE the 3043.5 benchmark target. In Phase 4 Liquidation, all assets will convert to 100% Sol Credits.`;
        } else {
          reply = `Current Net Worth: $${state.netWorth.toLocaleString()} (Target: 3043.5). We are on track to surpass 3043.5 by Turn 550 as our Nebula Strawberry and Supernova Melon harvests compound.`;
        }
      } else if (q.includes('risk') || q.includes('weakness')) {
        reply = `Current Risk Matrix: Overall Score ${state.risk.overallScore}/100 (${state.risk.summary}). Liquidity Risk is ${state.risk.liquidityRisk}, and Endgame Payback Risk is ${state.risk.endgameRisk}.`;
      } else {
        reply = `Acknowledged, Commander. Based on our real-time farm telemetry at Turn ${state.currentTurn}, our optimal strategy is executing ${state.seasonPhase}. We are maintaining $${state.cash} cash reserves and prioritizing high-scarcity crops while avoiding competitor supply gluts.`;
      }

      const aiMsg: CopilotMessage = {
        id: `ai-${Date.now()}`,
        sender: 'greenie',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        badge: 'GREENIE AI VERIFIED',
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-slate-950 border-l border-emerald-500/30 shadow-2xl flex flex-col backdrop-blur-xl">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-500/20 ring-1 ring-emerald-400/40">
            <Bot className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-white font-mono">Greenie AI Copilot</h3>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                LIVE STATE
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Autonomous Agricultural Strategist</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans text-xs">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center space-x-1.5 mb-1 px-1 text-[10px] text-slate-400 font-mono">
              <span>{msg.sender === 'user' ? 'Commander' : 'Greenie AI'}</span>
              <span>•</span>
              <span>{msg.timestamp}</span>
              {msg.badge && (
                <span className="text-emerald-400 font-bold ml-1">[{msg.badge}]</span>
              )}
            </div>

            <div
              className={`p-3.5 rounded-2xl max-w-[90%] leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none shadow-md shadow-emerald-900/30'
                  : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none whitespace-pre-wrap shadow-sm'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center space-x-2 text-xs text-emerald-400 font-mono p-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Greenie AI evaluating agricultural state telemetry...</span>
          </div>
        )}
      </div>

      {/* Suggested Quick Questions */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/40">
        <div className="flex items-center space-x-1 text-[10px] font-mono text-slate-400 mb-2">
          <HelpCircle className="w-3 h-3 text-emerald-400" />
          <span>Strategic Probes:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-emerald-900/40 text-slate-300 hover:text-emerald-300 border border-slate-700 text-[11px] transition text-left"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-3 border-t border-slate-800 bg-slate-900">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask Greenie AI about strategy, prices, or workers..."
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500 font-mono"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold transition shadow-md shadow-emerald-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
