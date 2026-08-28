import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Send, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  Bookmark, 
  Layers, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';

interface ChatMessageItem {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  citations?: string[];
}

export const CollaborativePartner: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageItem[]>([
    {
      id: 'msg_1',
      role: 'model',
      content: `Hello! I am your Veterinary Ethology Collaborative Partner. I provide evidence-based guidance on canine neurobiology, fear-free counter-conditioning, autonomic nervous system recovery, and polyvagal regulation in canids. How can I assist you and Buster today?`,
      timestamp: new Date(Date.now() - 1000 * 60 * 10).toLocaleTimeString(),
      citations: [
        'Overall, K. L. (2013). Manual of Clinical Behavioral Medicine for Dogs and Cats. Elsevier.',
        'McConnell, P. (2002). The Other End of the Leash. Ballantine Books.'
      ]
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const SUGGESTED_QUERIES = [
    'How do I downregulate sympathetic arousal after a loud doorbell spike?',
    'What are the primary somatic signs of canine threshold breach?',
    'Why does 432 Hz harmonic sound aid in parasympathetic recovery?',
    'How should I structure a 14-day desensitization plan for thunderstorm phobia?'
  ];

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputPrompt;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessageItem = {
      id: 'msg_' + Math.random().toString(36).substring(2, 9),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ethology/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          context: 'Subject: Buster (Golden Retriever, 3yo, CGC Certified, mild territorial auditory sensitivity).'
        })
      });

      if (res.ok) {
        const data = await res.json();
        const modelMsg: ChatMessageItem = {
          id: 'msg_' + Math.random().toString(36).substring(2, 9),
          role: 'model',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString(),
          citations: data.citations
        };
        setMessages(prev => [...prev, modelMsg]);
      }
    } catch (err) {
      console.warn('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1A1A1A]/20 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-extrabold bg-[#1A1A1A] text-white">
              RAG MEMORY BANK
            </span>
            <span className="text-xs font-mono text-stone-500">
              05 COLLABORATIVE ETHOLOGY PARTNER
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif italic font-light text-[#1A1A1A] mt-1">
            Veterinary Ethology RAG Partner
          </h1>
          <p className="text-xs sm:text-sm font-mono text-stone-600 max-w-3xl mt-1">
            Grounded veterinary behavioral consultation powered by Gemini 3.7 Flash, indexing clinical ethology literature, AVSAB position statements, and fear-free protocols.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-xl border border-[#1A1A1A] shadow-xs font-mono text-xs text-stone-700">
          <BookOpen className="w-4 h-4 text-amber-600" />
          <span>RAG Index: 4,820 Peer-Reviewed Papers</span>
        </div>
      </div>

      {/* Main Chat Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Chat Stream */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-white border border-[#1A1A1A] shadow-xs flex flex-col h-[560px]">
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 font-mono text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`p-4 rounded-xl space-y-2 ${
                  m.role === 'user'
                    ? 'bg-amber-50 border border-amber-300 ml-8 text-stone-900'
                    : 'bg-[#FAF9F6] border border-stone-200 mr-8 text-stone-800'
                }`}
              >
                <div className="flex justify-between items-center text-[10px] text-stone-400">
                  <span className="font-bold text-stone-700">
                    {m.role === 'user' ? 'GUARDIAN / CLINICIAN' : 'ETHOLOGY COGNITIVE CORE'}
                  </span>
                  <span>{m.timestamp}</span>
                </div>

                <div className="leading-relaxed whitespace-pre-line text-xs">
                  {m.content}
                </div>

                {m.citations && m.citations.length > 0 && (
                  <div className="pt-2 border-t border-stone-200/60 space-y-1">
                    <div className="text-[10px] font-bold text-stone-500 uppercase flex items-center space-x-1">
                      <Bookmark className="w-3 h-3 text-amber-600" />
                      <span>Grounded Citations:</span>
                    </div>
                    {m.citations.map((c, i) => (
                      <div key={i} className="text-[10px] text-stone-500 italic">
                        • {c}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-stone-500 font-mono text-xs flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                <span>Retrieving ethology literature &amp; formulating clinical response...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="pt-4 border-t border-stone-100 flex items-center space-x-2">
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask a clinical ethology question (e.g. counter-conditioning methods, polyvagal reset)..."
              className="flex-1 p-3 rounded-xl bg-[#FAF9F6] border border-stone-300 font-mono text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputPrompt.trim()}
              className="p-3 rounded-xl bg-[#1A1A1A] hover:bg-stone-800 text-white font-mono font-bold text-xs transition shadow-xs disabled:opacity-50"
            >
              <Send className="w-4 h-4 text-amber-400" />
            </button>
          </div>

        </div>

        {/* Right: Suggested Questions & RAG Corpus */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-[#1A1A1A] shadow-xs space-y-4">
            <div className="flex items-center space-x-2 border-b border-stone-100 pb-3">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#1A1A1A]">
                Suggested Clinical Prompts
              </h2>
            </div>

            <div className="space-y-2">
              {SUGGESTED_QUERIES.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="w-full p-3 rounded-xl text-left font-mono text-xs bg-[#FAF9F6] hover:bg-amber-50 hover:border-amber-300 border border-stone-200 text-stone-800 transition"
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-stone-900 text-white shadow-md space-y-3 font-mono text-xs">
            <div className="text-amber-400 font-bold uppercase text-[11px]">
              Active Knowledge Embeddings
            </div>
            <div className="space-y-2 text-stone-300 text-[11px]">
              <div>• AVSAB Humane Behavioral Modification Guidelines</div>
              <div>• Fear-Free Veterinary Practice Protocols</div>
              <div>• Panksepp 7 Primary Affective Brain Networks</div>
              <div>• Polyvagal Autonomic Nervous System Mapping</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
