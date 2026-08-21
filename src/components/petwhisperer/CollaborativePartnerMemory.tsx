import React, { useState } from 'react';
import { MessageSquare, Send, Sparkles, Brain, FileText, CheckCircle2, User, Bot, RefreshCw, Shield } from 'lucide-react';
import { PatientRAGMemoryProfile, EthologyChatMessage } from './types';

const PATIENTS: PatientRAGMemoryProfile[] = [
  {
    id: 'kona-rag',
    name: 'Kona',
    breed: 'Belgian Malinois',
    age: '3.5 yrs',
    weightKg: 28.5,
    knownTriggers: ['Doorbell (92dB)', 'Thunderstorm infrasound', 'Motorcycle backfires'],
    currentMedications: ['Fluoxetine 20mg q24h', 'Sileo gel PRN acoustic events'],
    preferredCalmingToneHz: 432,
    pastIncidentsCount: 14,
    baselineCortisolIndex: 68,
    notes: 'Responds with rapid de-escalation when 432Hz Solfeggio audio is deployed within 4 seconds of initial trigger spike.'
  },
  {
    id: 'barnaby-rag',
    name: 'Barnaby',
    breed: 'Golden Retriever',
    age: '5 yrs',
    weightKg: 32.0,
    knownTriggers: ['Vacuum cleaner', 'Fireworks'],
    currentMedications: ['None (Dietary L-Theanine supplement)'],
    preferredCalmingToneHz: 528,
    pastIncidentsCount: 3,
    baselineCortisolIndex: 22,
    notes: 'Mild sound reactivity. High food drive makes counter-conditioning highly effective.'
  },
  {
    id: 'luna-rag',
    name: 'Luna',
    breed: 'Border Collie',
    age: '2 yrs',
    weightKg: 19.2,
    knownTriggers: ['High-speed bicycles', 'Skateboards', 'Sirens'],
    currentMedications: ['Gabapentin 100mg PRN'],
    preferredCalmingToneHz: 432,
    pastIncidentsCount: 9,
    baselineCortisolIndex: 54,
    notes: 'Herding fixation can escalate to barrier frustration. Needs olfactory scent puzzles.'
  }
];

export const CollaborativePartnerMemory: React.FC = () => {
  const [selectedPatient, setSelectedPatient] = useState<PatientRAGMemoryProfile>(PATIENTS[0]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [messages, setMessages] = useState<EthologyChatMessage[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      timestamp: 'Just now',
      text: `Hello! I am Dr. Ethos, your Veterinary Ethology & Behavior Specialist co-pilot. I have loaded ${PATIENTS[0].name}'s persistent clinical RAG memory profile (14 logged incidents, 432Hz Solfeggio resonance profile). How can I assist with behavioral triage or protocol drafting today?`
    }
  ]);

  const handleSelectPatient = (patient: PatientRAGMemoryProfile) => {
    setSelectedPatient(patient);
    setMessages([
      {
        id: `m-init-${patient.id}`,
        sender: 'assistant',
        timestamp: 'Just now',
        text: `Switched active memory bank to patient ${patient.name} (${patient.breed}). Synced baseline cortisol index (${patient.baselineCortisolIndex}/100) and ${patient.pastIncidentsCount} historical incident records.`
      }
    ]);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isSending) return;

    const userMsg: EthologyChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: inputMessage.trim()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsSending(true);

    try {
      const res = await fetch('/api/ethology/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.text,
          patientProfile: selectedPatient,
          conversationHistory: messages.slice(-4)
        })
      });

      const data = await res.json();
      if (data && data.reply) {
        const botMsg: EthologyChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: data.reply,
          soapExcerpt: data.soapExcerpt
        };
        setMessages(prev => [...prev, botMsg]);
      }
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-8 bg-[#FAF9F6] text-[#1A1A1A] p-4 sm:p-6 lg:p-8 rounded-3xl border border-stone-800 shadow-sm" id="collaborative-memory-container">
      
      {/* Header */}
      <div className="border-b border-stone-800 pb-6">
        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1 bg-stone-900 text-amber-300 text-[11px] font-mono font-bold uppercase rounded-full flex items-center gap-1.5">
            <Brain className="w-3.5 h-3.5" />
            05 COLLABORATIVE PARTNER & MEMORY BANK
          </span>
          <span className="text-xs font-mono text-stone-500">Gemini 3.7 Flash Socratic Veterinary Ethologist</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-serif italic font-black text-[#1A1A1A] mt-2 tracking-tight">
          Veterinary Ethology Co-Pilot & Patient Memory Bank
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 font-serif mt-1 max-w-3xl">
          Clinical ethology chat assistant anchored by vector memory of canine trauma triggers, medication dosages, and automated SOAP medical report synthesis.
        </p>
      </div>

      {/* Grid Layout: Memory Bank on Left (4 Cols) + Chat on Right (8 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Persistent Patient Memory Profile */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-stone-800 rounded-3xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-mono text-xs font-black uppercase text-stone-900 flex items-center gap-2">
                <Brain className="w-4 h-4 text-amber-700" />
                Active Patient RAG Memory
              </h3>
            </div>

            {/* Patient Selector */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono text-stone-600 font-bold block">
                Select Patient Record:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {PATIENTS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPatient(p)}
                    className={`p-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer text-center ${
                      selectedPatient.id === p.id
                        ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                        : 'bg-stone-50 text-stone-700 border-stone-300 hover:bg-stone-100'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Patient Profile Stats */}
            <div className="space-y-3 pt-2 text-xs font-mono">
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-stone-500">Breed & Weight:</span>
                  <strong className="text-stone-900">{selectedPatient.breed} ({selectedPatient.weightKg}kg)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Age:</span>
                  <strong className="text-stone-900">{selectedPatient.age}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Baseline Cortisol:</span>
                  <strong className="text-amber-700 font-black">{selectedPatient.baselineCortisolIndex}/100</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Calming Resonance:</span>
                  <strong className="text-emerald-700 font-black">{selectedPatient.preferredCalmingToneHz} Hz</strong>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-stone-600 uppercase block">Known Acoustic Triggers:</span>
                <div className="flex flex-wrap gap-1">
                  {selectedPatient.knownTriggers.map((trig, i) => (
                    <span key={i} className="px-2 py-0.5 bg-red-50 text-red-800 border border-red-200 rounded text-[10px] font-bold">
                      {trig}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-stone-600 uppercase block">Current Medications:</span>
                <div className="flex flex-wrap gap-1">
                  {selectedPatient.currentMedications.map((med, i) => (
                    <span key={i} className="px-2 py-0.5 bg-purple-50 text-purple-800 border border-purple-200 rounded text-[10px] font-bold">
                      {med}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
                <span className="text-[10px] font-mono uppercase font-black text-amber-900 block mb-1">RAG Memory Insight:</span>
                <p className="text-[11px] font-serif text-stone-700 italic">
                  "{selectedPatient.notes}"
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Chat Stream & SOAP Report Generator */}
        <div className="lg:col-span-8 bg-white border border-stone-800 rounded-3xl p-6 flex flex-col justify-between h-[640px] shadow-sm">
          
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-stone-900" />
              <h3 className="font-mono text-xs font-black uppercase text-stone-900">
                Dr. Ethos Live Veterinary Consultation
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-700 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Gemini 3.7 Flash Active
            </span>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-stone-900 text-amber-300 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                    E
                  </div>
                )}

                <div className={`max-w-xl p-4 rounded-2xl text-xs space-y-2 ${
                  msg.sender === 'user'
                    ? 'bg-stone-900 text-white font-mono rounded-tr-none'
                    : 'bg-stone-50 text-stone-900 border border-stone-300 font-serif leading-relaxed rounded-tl-none'
                }`}>
                  <div className="whitespace-pre-wrap">{msg.text}</div>

                  {/* Render SOAP medical excerpt if generated */}
                  {msg.soapExcerpt && (
                    <div className="p-3 bg-white border border-stone-300 rounded-xl space-y-1 font-mono text-[11px] text-stone-800 mt-2">
                      <div className="font-black text-amber-800 uppercase text-[10px] border-b border-stone-200 pb-1 flex items-center gap-1">
                        <FileText className="w-3 h-3" /> Structured SOAP Medical Draft
                      </div>
                      <div><strong>S (Subjective):</strong> {msg.soapExcerpt.s}</div>
                      <div><strong>O (Objective):</strong> {msg.soapExcerpt.o}</div>
                      <div><strong>A (Assessment):</strong> {msg.soapExcerpt.a}</div>
                      <div><strong>P (Plan):</strong> {msg.soapExcerpt.p}</div>
                    </div>
                  )}

                  <div className={`text-[9px] font-mono text-right ${msg.sender === 'user' ? 'text-stone-400' : 'text-stone-500'}`}>
                    {msg.timestamp}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                    U
                  </div>
                )}
              </div>
            ))}
            {isSending && (
              <div className="flex items-center gap-2 text-xs font-mono text-stone-500 italic p-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Dr. Ethos is evaluating canine ethogram vectors...</span>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="pt-3 border-t border-stone-200 flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              placeholder={`Ask Dr. Ethos about ${selectedPatient.name}'s behavior, pacing, or medication titration...`}
              className="flex-1 bg-stone-50 border border-stone-300 rounded-2xl px-4 py-3 text-xs font-mono text-stone-900 focus:outline-none focus:border-stone-900"
            />
            <button
              type="submit"
              disabled={isSending || !inputMessage.trim()}
              className="px-5 py-3 bg-stone-900 hover:bg-black disabled:bg-stone-300 text-amber-300 font-mono text-xs font-bold rounded-2xl flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>

        </div>

      </div>

    </div>
  );
};
