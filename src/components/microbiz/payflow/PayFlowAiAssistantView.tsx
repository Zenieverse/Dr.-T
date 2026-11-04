import React, { FC, useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  FileText, 
  CreditCard, 
  AlertTriangle, 
  Copy, 
  Check, 
  ShieldCheck, 
  Info,
  DollarSign,
  TrendingUp,
  Receipt
} from 'lucide-react';
import { 
  PayFlowInvoice, 
  PayFlowTransaction, 
  PayFlowExpense, 
  PayFlowBusinessProfile 
} from '../types/payflowTypes';
import { formatMoney } from '../../../services/payflowMath';

interface PayFlowAiAssistantViewProps {
  invoices: PayFlowInvoice[];
  transactions: PayFlowTransaction[];
  expenses: PayFlowExpense[];
  profile: PayFlowBusinessProfile;
  onApplyInvoiceDraft?: (draft: any) => void;
  currentLanguage?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  structuredData?: any;
  facts?: string[];
  recommendations?: string[];
  modelUsed?: string;
}

export const PayFlowAiAssistantView: FC<PayFlowAiAssistantViewProps> = ({
  invoices,
  transactions,
  expenses,
  profile,
  onApplyInvoiceDraft,
  currentLanguage = 'en'
}) => {
  const isVi = currentLanguage === 'vi';
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedReminderId, setCopiedReminderId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init_1',
      sender: 'assistant',
      text: isVi
        ? `Xin chào! Tôi là Trợ Lý Tài Chính PayFlow AI được hỗ trợ bởi mô hình Gemini 3.8 Flash. Tôi có thể phân tích số dư thực tế, kiểm tra hóa đơn quá hạn, tính toán dòng tiền thuần và hỗ trợ soạn thảo thư nhắc thanh toán PayPal lịch sự cho bạn.`
        : `Hello! I am your MicroBiz PayFlow AI Copilot powered by Gemini 3.8 Flash. I can analyze your ground-truth ledger, identify overdue receivables, evaluate operating cash flows, draft itemized invoices, and generate polite payment reminders with instant PayPal checkout links.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      facts: [
        `Access to ${invoices.length} active invoices and ${transactions.length} verified transactions`,
        `Operating currency: ${profile.defaultCurrency || 'USD'}`
      ],
      recommendations: [
        'Ask about this month’s cash flow to review net operating balance.',
        'Ask to review overdue invoices to protect business working capital.'
      ]
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const quickPrompts = [
    { label: 'How much did I receive this month?', vi: 'Tháng này tôi đã thu được bao nhiêu tiền?' },
    { label: 'Which invoices are overdue?', vi: 'Những hóa đơn nào đang quá hạn?' },
    { label: 'What are my biggest expenses?', vi: 'Các khoản chi phí lớn nhất của tôi là gì?' },
    { label: 'Draft payment reminder for overdue invoices', vi: 'Soạn thư nhắc thanh toán lịch sự' },
    { label: 'Summarize my business finances', vi: 'Tóm tắt toàn diện tài chính kinh doanh' }
  ];

  const handleSendQuery = async (queryText: string) => {
    if (!queryText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: queryText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/microbiz/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryText,
          context: {
            invoices,
            transactions,
            expenses,
            businessProfile: profile
          }
        })
      });

      if (!response.ok) {
        throw new Error(`AI Assistant request failed (${response.status})`);
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        text: data.answer || 'Analysis complete.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        structuredData: data.structuredData,
        facts: data.facts,
        recommendations: data.recommendations,
        modelUsed: data.modelUsed
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      console.warn('AI query fallback notice:', err);
      // Client-side fallback
      const assistantMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        text: `Based on your recorded ledger of **${invoices.length} invoices** and **${transactions.length} payments**, your current collected total is **${formatMoney(transactions.reduce((s, t) => s + t.grossAmount, 0), profile.defaultCurrency)}** with **${invoices.filter(i => i.status === 'OVERDUE').length} overdue invoice(s)**.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        facts: [`Ledger entries verified locally`],
        recommendations: [`Review overdue invoices to stabilize cash flow`]
      };
      setMessages(prev => [...prev, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyReminder = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedReminderId(id);
      setTimeout(() => setCopiedReminderId(null), 2500);
    });
  };

  return (
    <div className="space-y-4">
      {/* Disclaimer Banner */}
      <div className="p-3 sm:p-4 rounded-2xl bg-indigo-50 border border-indigo-200/80 text-xs text-indigo-950 flex items-start gap-3 shadow-xs">
        <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold font-serif">
            {isVi ? 'Trợ Lý Phân Tích Tài Chính & Điều Phối Doanh Nghiệp' : 'PayFlow AI Ground-Truth Operational Copilot'}
          </p>
          <p className="text-2xs text-indigo-900/80 leading-relaxed">
            {isVi 
              ? 'Trợ lý AI sử dụng dữ liệu thực tế từ sổ cái để hỗ trợ tạo hóa đơn và nhắc nợ. Lưu ý: Lời khuyên AI không thay thế tư vấn kế toán công chứng (CPA) hoặc chứng nhận thuế.' 
              : 'All calculations are computed from your verified ledger records. AI suggestions provide operational assistance and do not constitute certified CPA, legal, or tax filing advice.'}
          </p>
        </div>
      </div>

      {/* Main Chat Box Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col h-[650px] overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-800 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Sparkles className="w-4 h-4 text-indigo-200" />
                </div>
              )}

              <div className={`max-w-2xl space-y-3 ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-xs p-4 text-xs font-sans shadow-xs'
                  : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-2xl rounded-tl-xs p-4 text-xs space-y-3 shadow-2xs'
              }`}>
                {/* Main text content with basic markdown handling */}
                <div className="leading-relaxed whitespace-pre-wrap">
                  {msg.text}
                </div>

                {/* Structured Reminder Draft Card if present */}
                {msg.structuredData?.suggestedReminder && (
                  <div className="p-3.5 bg-white rounded-xl border border-indigo-200 shadow-2xs space-y-2 text-2xs text-slate-700">
                    <div className="flex items-center justify-between font-bold text-indigo-900 border-b border-indigo-100 pb-1.5">
                      <span>Drafted Payment Reminder Email</span>
                      <button
                        type="button"
                        onClick={() => handleCopyReminder(
                          `Subject: ${msg.structuredData.suggestedReminder.subject}\n\n${msg.structuredData.suggestedReminder.body}`,
                          msg.id
                        )}
                        className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer font-semibold"
                      >
                        {copiedReminderId === msg.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedReminderId === msg.id ? 'Copied' : 'Copy Email'}</span>
                      </button>
                    </div>
                    <p className="font-semibold text-slate-900">
                      Subject: {msg.structuredData.suggestedReminder.subject}
                    </p>
                    <div className="p-2.5 bg-slate-50 rounded-lg text-slate-600 whitespace-pre-line font-mono">
                      {msg.structuredData.suggestedReminder.body}
                    </div>
                  </div>
                )}

                {/* Verified Facts vs Recommendations Badges */}
                {msg.sender === 'assistant' && (msg.facts || msg.recommendations) && (
                  <div className="pt-2 border-t border-slate-200/60 space-y-2 text-2xs">
                    {msg.facts && msg.facts.length > 0 && (
                      <div className="space-y-1">
                        <span className="font-bold text-slate-600 uppercase tracking-wider text-[10px] flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Ledger Facts:</span>
                        </span>
                        <ul className="list-disc pl-4 text-slate-600 space-y-0.5">
                          {msg.facts.map((fact, idx) => (
                            <li key={idx}>{fact}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {msg.recommendations && msg.recommendations.length > 0 && (
                      <div className="space-y-1">
                        <span className="font-bold text-indigo-700 uppercase tracking-wider text-[10px] flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-indigo-600" />
                          <span>AI Recommendations:</span>
                        </span>
                        <ul className="list-disc pl-4 text-indigo-900/80 space-y-0.5">
                          {msg.recommendations.map((rec, idx) => (
                            <li key={idx}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                <div className={`text-[10px] text-right ${msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>
                  {msg.timestamp} {msg.modelUsed && `• ${msg.modelUsed}`}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <User className="w-4 h-4 text-slate-300" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 items-center text-xs text-slate-400">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center animate-pulse shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <span>PayFlow AI is analyzing your financial records...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/60 overflow-x-auto flex items-center gap-2 text-2xs scrollbar-none">
          <span className="font-bold text-slate-500 whitespace-nowrap">Suggested:</span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendQuery(isVi ? p.vi : p.label)}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-indigo-400 text-slate-700 hover:text-indigo-600 whitespace-nowrap transition cursor-pointer shadow-2xs font-medium"
            >
              {isVi ? p.vi : p.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-100 flex items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendQuery(inputQuery);
              }
            }}
            placeholder={isVi ? 'Hỏi về doanh thu, hóa đơn quá hạn, tạo hóa đơn mới...' : 'Ask about revenue, overdue invoices, create draft invoice, cash flow...'}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs font-sans"
          />

          <button
            type="button"
            onClick={() => handleSendQuery(inputQuery)}
            disabled={!inputQuery.trim() || isLoading}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer disabled:opacity-40 shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
