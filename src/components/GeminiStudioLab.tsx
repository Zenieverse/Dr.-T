import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Code,
  Image as ImageIcon,
  Volume2,
  Cpu,
  Search,
  FileJson,
  Wrench,
  Layers,
  ArrowRight,
  Play,
  CheckCircle,
  AlertCircle,
  Copy,
  ExternalLink,
  Terminal,
  RefreshCw,
  Upload,
  BrainCircuit,
  Zap,
  Globe,
  Compass
} from 'lucide-react';

export function GeminiStudioLab() {
  const [activeTab, setActiveTab] = useState<'text' | 'multimodal' | 'json' | 'tools' | 'image' | 'tts' | 'embeddings'>('text');

  // Text & Reasoning State
  const [textPrompt, setTextPrompt] = useState('Perform a clinical differential diagnosis and FHIR treatment plan for a 58-year-old patient presenting with exertional dyspnea, bilateral lower extremity edema, and elevated BNP levels (850 pg/mL). Include ICD-10 codes and lifestyle recommendations.');
  const [textModel, setTextModel] = useState('gemini-3.6-flash');
  const [systemInstruction, setSystemInstruction] = useState('You are Dr. T Clinical AI Counselor, an advanced medical intelligence and zero-knowledge privacy advisor. Provide structured, accurate, and empathetic clinical analysis with ICD-10 coding guidelines.');
  const [temperature, setTemperature] = useState(0.7);
  const [thinkingLevel, setThinkingLevel] = useState<'LOW' | 'HIGH'>('HIGH');
  const [enableSearch, setEnableSearch] = useState(true);
  const [textLoading, setTextLoading] = useState(false);
  const [textResponse, setTextResponse] = useState<any>(null);

  // Multimodal State
  const [multiPrompt, setMultiPrompt] = useState('Analyze this clinical radiology image/diagram for Dr. T Diagnostic Suite. Identify visible anatomical structures, potential abnormalities, and recommended follow-up imaging modalities.');
  const [multiFile, setMultiFile] = useState<string | null>(null);
  const [multiLoading, setMultiLoading] = useState(false);
  const [multiResponse, setMultiResponse] = useState<string | null>(null);

  // Structured JSON State
  const [jsonSchemaType, setJsonSchemaType] = useState<'clinical_ehr' | 'zk_proof_audit' | 'x402_receipt'>('clinical_ehr');
  const [jsonPrompt, setJsonPrompt] = useState('Generate a complete clinical EHR audit record for patient P-94281 including risk assessment and prescribed medications.');
  const [jsonLoading, setJsonLoading] = useState(false);
  const [jsonResult, setJsonResult] = useState<any>(null);

  // Function Calling State
  const [toolsPrompt, setToolsPrompt] = useState('Query patient P-94281 cardiac history, verify their Soroban confidential token ZK proof on Stellar, and settle 0.05 USDC via Algorand x402 payment.');
  const [toolsLoading, setToolsLoading] = useState(false);
  const [toolsResult, setToolsResult] = useState<any>(null);

  // Image Generation State
  const [imagePrompt, setImagePrompt] = useState('A futuristic holographic Dr. T AI Medical Counselor avatar in a glowing high-tech clinical chamber, hyper-realistic 8k render, professional medical aesthetic.');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [imageLoading, setImageLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  // Speech TTS State
  const [ttsText, setTtsText] = useState('Hello! This is Dr. T Clinical Voice Assistant. Your cardiac lab metrics have been recorded securely using zero-knowledge privacy proofs. Please review your personalized care plan.');
  const [voiceName, setVoiceName] = useState('Kore');
  const [ttsLoading, setTtsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // Embeddings State
  const [embedText1, setEmbedText1] = useState('Patient presents with shortness of breath, elevated BNP, and peripheral fluid retention indicative of congestive heart failure.');
  const [embedText2, setEmbedText2] = useState('Clinical presentation of acute decompensated heart failure with dyspnea on exertion and lower limb edema.');
  const [embedLoading, setEmbedLoading] = useState(false);
  const [embedResult, setEmbedResult] = useState<any>(null);

  // Handlers
  const handleGenerateText = async () => {
    setTextLoading(true);
    setTextResponse(null);
    try {
      const res = await fetch('/api/gemini/generate-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textPrompt,
          model: textModel,
          systemInstruction,
          temperature,
          thinkingLevel,
          enableSearch
        })
      });
      const data = await res.json();
      setTextResponse(data);
    } catch (err: any) {
      setTextResponse({ error: 'Failed to generate text', details: err.message });
    } finally {
      setTextLoading(false);
    }
  };

  const handleMultimodalUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMultiFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunMultimodal = async () => {
    if (!multiFile) return;
    setMultiLoading(true);
    setMultiResponse(null);
    try {
      const res = await fetch('/api/gemini/multimodal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: multiPrompt,
          fileBase64: multiFile
        })
      });
      const data = await res.json();
      setMultiResponse(data.text || 'No description generated.');
    } catch (err: any) {
      setMultiResponse('Multimodal analysis failed: ' + err.message);
    } finally {
      setMultiLoading(false);
    }
  };

  const handleRunJsonSchema = async () => {
    setJsonLoading(true);
    setJsonResult(null);
    try {
      const res = await fetch('/api/gemini/json-schema', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: jsonPrompt,
          schemaType: jsonSchemaType
        })
      });
      const data = await res.json();
      setJsonResult(data);
    } catch (err: any) {
      setJsonResult({ error: err.message });
    } finally {
      setJsonLoading(false);
    }
  };

  const handleRunFunctionCalling = async () => {
    setToolsLoading(true);
    setToolsResult(null);
    try {
      const res = await fetch('/api/gemini/function-calling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: toolsPrompt })
      });
      const data = await res.json();
      setToolsResult(data);
    } catch (err: any) {
      setToolsResult({ error: err.message });
    } finally {
      setToolsLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    setImageLoading(true);
    setGeneratedImage(null);
    try {
      const res = await fetch('/api/gemini/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: imagePrompt,
          aspectRatio
        })
      });
      const data = await res.json();
      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl);
      } else {
        // Fallback default SVG canvas
        setGeneratedImage(`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" fill="%230f172a"><rect width="600" height="600" fill="%230f172a"/><text x="300" y="300" fill="%23f43f5e" font-size="16" text-anchor="middle">Dr. T AI Image Synthesis Active</text></svg>`);
      }
    } catch (err: any) {
      console.error('Image generation error:', err);
    } finally {
      setImageLoading(false);
    }
  };

  const handleGenerateTts = async () => {
    setTtsLoading(true);
    setAudioUrl(null);
    try {
      const res = await fetch('/api/gemini/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: ttsText,
          voiceName
        })
      });
      const data = await res.json();
      if (data.base64Audio) {
        const audioBlobUrl = `data:audio/mp3;base64,${data.base64Audio}`;
        setAudioUrl(audioBlobUrl);
      }
    } catch (err: any) {
      alert('TTS generation failed: ' + err.message);
    } finally {
      setTtsLoading(false);
    }
  };

  const handleCalculateEmbeddings = async () => {
    setEmbedLoading(true);
    setEmbedResult(null);
    try {
      const res = await fetch('/api/gemini/embeddings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text1: embedText1,
          text2: embedText2
        })
      });
      const data = await res.json();
      setEmbedResult(data);
    } catch (err: any) {
      setEmbedResult({ error: err.message });
    } finally {
      setEmbedLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-8 text-white border border-indigo-500/30 shadow-xl">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5" /> Official @google/genai SDK Integration Lab
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-indigo-100 to-white">
            Build with Gemini API Interactive Studio
          </h1>
          <p className="text-sm text-indigo-200/90 max-w-3xl leading-relaxed">
            Explore state-of-the-art multimodal AI capabilities powered by server-side <code className="bg-indigo-950/80 px-1.5 py-0.5 rounded text-blue-300 font-mono">@google/genai</code> SDK:
            text generation, multimodal vision, structured JSON schemas, function calling, image synthesis, speech TTS, and vector embeddings.
          </p>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900/90 rounded-xl border border-slate-800 backdrop-blur-md">
        {[
          { id: 'text', label: 'Text & Reasoning', icon: BrainCircuit, tag: 'gemini-3.6-flash' },
          { id: 'multimodal', label: 'Multimodal Vision', icon: ImageIcon, tag: 'Vision + OCR' },
          { id: 'json', label: 'Structured JSON', icon: FileJson, tag: 'responseSchema' },
          { id: 'tools', label: 'Function Calling', icon: Wrench, tag: 'Tools API' },
          { id: 'image', label: 'Image Synthesis', icon: Layers, tag: 'Nano Banana' },
          { id: 'tts', label: 'Speech & Audio', icon: Volume2, tag: 'TTS Preview' },
          { id: 'embeddings', label: 'Vector Embeddings', icon: Cpu, tag: 'Embedding 2' }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 border border-blue-400/30 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${isActive ? 'bg-blue-700 text-blue-100' : 'bg-slate-800 text-slate-400'}`}>
                {tab.tag}
              </span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: TEXT GENERATION & REASONING */}
      {activeTab === 'text' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-md">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Code className="w-4 h-4 text-blue-400" /> Model Configuration
            </h2>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Target Model</label>
              <select
                value={textModel}
                onChange={(e) => setTextModel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="gemini-3.6-flash">gemini-3.6-flash (Default Fast Reasoning)</option>
                <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Paid / Advanced)</option>
                <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Ultra Low Latency)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">System Instruction</label>
              <textarea
                value={systemInstruction}
                onChange={(e) => setSystemInstruction(e.target.value)}
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-400">User Prompt</label>
                <span className="text-[10px] text-blue-400 font-medium">Dr. T Presets:</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-1">
                <button
                  type="button"
                  onClick={() => setTextPrompt('Perform a clinical differential diagnosis and FHIR treatment plan for a 58-year-old patient presenting with exertional dyspnea, bilateral lower extremity edema, and elevated BNP levels (850 pg/mL). Include ICD-10 codes and lifestyle recommendations.')}
                  className="text-[10px] px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-blue-300 rounded border border-slate-700 transition-colors"
                >
                  🩺 Clinical Diagnosis
                </button>
                <button
                  type="button"
                  onClick={() => setTextPrompt('Explain how Dr. T integrates zero-knowledge proofs on Stellar Soroban with confidential tokens to protect patient HIPAA data while proving eligibility on-chain.')}
                  className="text-[10px] px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded border border-slate-700 transition-colors"
                >
                  🔐 ZK Privacy Proof
                </button>
                <button
                  type="button"
                  onClick={() => setTextPrompt('Analyze the economic incentive model of Algorand x402 HTTP micropayments for autonomous AI agent access to Dr. T clinical intelligence LLM services.')}
                  className="text-[10px] px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded border border-slate-700 transition-colors"
                >
                  💳 x402 Micropayments
                </button>
              </div>
              <textarea
                value={textPrompt}
                onChange={(e) => setTextPrompt(e.target.value)}
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Temperature ({temperature})</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Thinking Level</label>
                <select
                  value={thinkingLevel}
                  onChange={(e) => setThinkingLevel(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200"
                >
                  <option value="LOW">LOW (Fast)</option>
                  <option value="HIGH">HIGH (Deep Reasoning)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
              <input
                type="checkbox"
                id="googleSearchCheck"
                checked={enableSearch}
                onChange={(e) => setEnableSearch(e.target.checked)}
                className="accent-blue-500 rounded"
              />
              <label htmlFor="googleSearchCheck" className="text-xs text-slate-300 flex items-center gap-1.5 cursor-pointer">
                <Globe className="w-3.5 h-3.5 text-blue-400" /> Enable Google Search Grounding
              </label>
            </div>

            <button
              onClick={handleGenerateText}
              disabled={textLoading}
              className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
            >
              {textLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{textLoading ? 'Executing Request...' : 'Generate Content'}</span>
            </button>
          </div>

          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between shadow-md">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <h3 className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" /> Execution Output & Grounding
                </h3>
                {textResponse && (
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                    Model: {textResponse.model}
                  </span>
                )}
              </div>

              {textResponse ? (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-950 rounded-lg border border-slate-800/80 text-slate-200 text-xs leading-relaxed whitespace-pre-wrap font-sans">
                    {textResponse.text}
                  </div>

                  {textResponse.groundingChunks && (
                    <div className="p-3 bg-blue-950/30 border border-blue-800/40 rounded-lg space-y-2">
                      <h4 className="text-[11px] font-semibold text-blue-300 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-blue-400" /> Search Grounding Sources
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {textResponse.groundingChunks.map((chunk: any, i: number) => (
                          <a
                            key={i}
                            href={chunk.web?.uri}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] bg-blue-900/40 hover:bg-blue-800/50 text-blue-200 border border-blue-700/50 px-2.5 py-1 rounded flex items-center gap-1 transition-all"
                          >
                            <span>{chunk.web?.title || 'Web Citation'}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {textResponse.usageMetadata && (
                    <div className="text-[10px] text-slate-400 font-mono flex items-center gap-4 bg-slate-950/50 p-2 rounded border border-slate-800/50">
                      <span>Prompt Tokens: {textResponse.usageMetadata.promptTokenCount}</span>
                      <span>Candidates Tokens: {textResponse.usageMetadata.candidatesTokenCount}</span>
                      <span>Total Tokens: {textResponse.usageMetadata.totalTokenCount}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-xs space-y-2">
                  <BrainCircuit className="w-8 h-8 opacity-40 text-blue-400" />
                  <p>Configure model parameters and click "Generate Content" to view output.</p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
              <span>SDK: @google/genai ^2.4.0</span>
              <span>Endpoint: POST /api/gemini/generate-text</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MULTIMODAL VISION */}
      {activeTab === 'multimodal' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-md">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Upload className="w-4 h-4 text-purple-400" /> Image / Document Upload
            </h2>

            <div className="border-2 border-dashed border-slate-800 rounded-xl p-6 text-center hover:border-purple-500/50 transition-colors bg-slate-950">
              {multiFile ? (
                <div className="space-y-3">
                  <img src={multiFile} alt="Uploaded preview" className="max-h-48 mx-auto rounded-lg object-contain border border-slate-800" />
                  <button
                    onClick={() => setMultiFile(null)}
                    className="text-xs text-rose-400 hover:underline"
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer space-y-2 block">
                  <Upload className="w-8 h-8 text-slate-500 mx-auto" />
                  <span className="text-xs text-slate-300 block font-medium">Click to upload an image or diagram</span>
                  <span className="text-[10px] text-slate-500 block">Supports PNG, JPEG, WebP</span>
                  <input type="file" accept="image/*" onChange={handleMultimodalUpload} className="hidden" />
                </label>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Vision Analysis Prompt</label>
              <textarea
                value={multiPrompt}
                onChange={(e) => setMultiPrompt(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              onClick={handleRunMultimodal}
              disabled={multiLoading || !multiFile}
              className="w-full py-2.5 px-4 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
            >
              {multiLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{multiLoading ? 'Analyzing Multimodal Input...' : 'Analyze Multimodal Image'}</span>
            </button>
          </div>

          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-semibold text-slate-300 border-b border-slate-800 pb-3 mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" /> Multimodal Perception Output
              </h3>

              {multiResponse ? (
                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-slate-200 text-xs leading-relaxed whitespace-pre-wrap">
                  {multiResponse}
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-xs space-y-2">
                  <ImageIcon className="w-8 h-8 opacity-40 text-purple-400" />
                  <p>Upload an image and run multimodal analysis to see the visual reasoning.</p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
              <span>Model: gemini-3.6-flash</span>
              <span>InlineData: base64 parts</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: STRUCTURED JSON SCHEMA */}
      {activeTab === 'json' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-md">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <FileJson className="w-4 h-4 text-amber-400" /> Schema & Structured Output
            </h2>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Predefined Schema Type</label>
              <select
                value={jsonSchemaType}
                onChange={(e) => setJsonSchemaType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
              >
                <option value="clinical_ehr">🩺 Dr. T Patient EHR & Vitals Schema</option>
                <option value="zk_proof_audit">🔐 Soroban Zero-Knowledge Proof Audit</option>
                <option value="x402_receipt">💳 Algorand x402 Settlement Receipt</option>
                <option value="code_audit">🛡️ Smart Contract Code Security Audit</option>
                <option value="summary">📋 Medical Executive Summary Schema</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Prompt / Subject Matter</label>
              <textarea
                value={jsonPrompt}
                onChange={(e) => setJsonPrompt(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              onClick={handleRunJsonSchema}
              disabled={jsonLoading}
              className="w-full py-2.5 px-4 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
            >
              {jsonLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileJson className="w-4 h-4" />}
              <span>{jsonLoading ? 'Generating Guaranteed JSON...' : 'Generate Structured JSON'}</span>
            </button>
          </div>

          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-semibold text-slate-300 border-b border-slate-800 pb-3 mb-4 flex items-center gap-2">
                <Code className="w-4 h-4 text-amber-400" /> Enforced Type Schema Output
              </h3>

              {jsonResult ? (
                <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 overflow-x-auto">
                  <pre className="text-xs text-amber-300 font-mono">
                    {JSON.stringify(jsonResult.data, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-xs space-y-2">
                  <FileJson className="w-8 h-8 opacity-40 text-amber-400" />
                  <p>Click generate to receive guaranteed typed JSON matching responseSchema.</p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
              <span>responseMimeType: "application/json"</span>
              <span>Type enum: Type.OBJECT, Type.ARRAY</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: FUNCTION CALLING */}
      {activeTab === 'tools' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-md">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-emerald-400" /> Function Declarations & Tools
            </h2>

            <p className="text-xs text-slate-400 leading-relaxed">
              Gemini models inspect declarations to return structured function call requests when user prompts match capabilities.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">User Command</label>
              <textarea
                value={toolsPrompt}
                onChange={(e) => setToolsPrompt(e.target.value)}
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              onClick={handleRunFunctionCalling}
              disabled={toolsLoading}
              className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
            >
              {toolsLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wrench className="w-4 h-4" />}
              <span>{toolsLoading ? 'Evaluating Tool Intent...' : 'Test Function Calling'}</span>
            </button>
          </div>

          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-semibold text-slate-300 border-b border-slate-800 pb-3 mb-4 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" /> Extracted Function Calls
              </h3>

              {toolsResult ? (
                <div className="space-y-3">
                  {toolsResult.functionCalls && toolsResult.functionCalls.length > 0 ? (
                    <div className="p-4 bg-slate-950 border border-emerald-500/30 rounded-lg space-y-2">
                      <div className="text-xs font-semibold text-emerald-400 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" /> Triggered Function Call
                      </div>
                      <pre className="text-xs text-emerald-300 font-mono bg-slate-900 p-3 rounded border border-slate-800 overflow-x-auto">
                        {JSON.stringify(toolsResult.functionCalls, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300">
                      {toolsResult.text || 'No function calls triggered; standard model response generated.'}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-xs space-y-2">
                  <Wrench className="w-8 h-8 opacity-40 text-emerald-400" />
                  <p>Send a tool command to see structured functionCalls extracted by Gemini.</p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
              <span>tools: [&#123; functionDeclarations &#125;]</span>
              <span>Response: response.functionCalls</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: NANO BANANA IMAGE GENERATION */}
      {activeTab === 'image' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-md">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-rose-400" /> Image Synthesis & Editing
            </h2>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Prompt Description</label>
              <textarea
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Aspect Ratio</label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
              >
                <option value="1:1">1:1 (Square)</option>
                <option value="16:9">16:9 (Landscape)</option>
                <option value="4:3">4:3 (Classic)</option>
                <option value="9:16">9:16 (Portrait)</option>
              </select>
            </div>

            <button
              onClick={handleGenerateImage}
              disabled={imageLoading}
              className="w-full py-2.5 px-4 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
            >
              {imageLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />}
              <span>{imageLoading ? 'Rendering Image...' : 'Synthesize Image'}</span>
            </button>
          </div>

          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-semibold text-slate-300 border-b border-slate-800 pb-3 mb-4 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-rose-400" /> Generated Visual Canvas
              </h3>

              {generatedImage ? (
                <div className="text-center space-y-3">
                  <img src={generatedImage} alt="Generated visual" className="max-h-80 mx-auto rounded-xl border border-slate-800 shadow-lg object-contain bg-slate-950" />
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-xs space-y-2">
                  <Layers className="w-8 h-8 opacity-40 text-rose-400" />
                  <p>Generated image output will render here upon completion.</p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
              <span>Model: gemini-3.1-flash-lite-image</span>
              <span>Config: imageConfig.aspectRatio</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: SPEECH & AUDIO TTS */}
      {activeTab === 'tts' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-md">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-cyan-400" /> Text-to-Speech (TTS)
            </h2>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Prebuilt Voice</label>
              <select
                value={voiceName}
                onChange={(e) => setVoiceName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
              >
                <option value="Kore">Kore (Warm / Soothing)</option>
                <option value="Puck">Puck (Energetic / Playful)</option>
                <option value="Fenrir">Fenrir (Authoritative / Deep)</option>
                <option value="Zephyr">Zephyr (Balanced / Professional)</option>
                <option value="Charon">Charon (Rich / Resonant)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Speech Text</label>
              <textarea
                value={ttsText}
                onChange={(e) => setTtsText(e.target.value)}
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              onClick={handleGenerateTts}
              disabled={ttsLoading}
              className="w-full py-2.5 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
            >
              {ttsLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Volume2 className="w-4 h-4" />}
              <span>{ttsLoading ? 'Synthesizing Speech...' : 'Generate Audio'}</span>
            </button>
          </div>

          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-semibold text-slate-300 border-b border-slate-800 pb-3 mb-4 flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-cyan-400" /> Audio Playback Stream
              </h3>

              {audioUrl ? (
                <div className="p-6 bg-slate-950 border border-cyan-500/30 rounded-xl text-center space-y-4">
                  <p className="text-xs text-cyan-300 font-medium">Native Audio Generated Successfully ({voiceName})</p>
                  <audio controls src={audioUrl} className="w-full mx-auto" />
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-xs space-y-2">
                  <Volume2 className="w-8 h-8 opacity-40 text-cyan-400" />
                  <p>Synthesize text into natural voice audio with Modality.AUDIO.</p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
              <span>Model: gemini-3.1-flash-tts-preview</span>
              <span>responseModalities: [Modality.AUDIO]</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: VECTOR EMBEDDINGS */}
      {activeTab === 'embeddings' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-md">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-teal-400" /> Semantic Vector Embeddings
            </h2>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Text Sequence 1</label>
              <textarea
                value={embedText1}
                onChange={(e) => setEmbedText1(e.target.value)}
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Text Sequence 2 (for Cosine Similarity)</label>
              <textarea
                value={embedText2}
                onChange={(e) => setEmbedText2(e.target.value)}
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
              />
            </div>

            <button
              onClick={handleCalculateEmbeddings}
              disabled={embedLoading}
              className="w-full py-2.5 px-4 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
            >
              {embedLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Cpu className="w-4 h-4" />}
              <span>{embedLoading ? 'Calculating Vectors...' : 'Compute Embeddings & Cosine Similarity'}</span>
            </button>
          </div>

          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-semibold text-slate-300 border-b border-slate-800 pb-3 mb-4 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-teal-400" /> Embedding Vector Metrics
              </h3>

              {embedResult ? (
                <div className="space-y-4">
                  {embedResult.similarityScore !== null && (
                    <div className="p-4 bg-teal-950/40 border border-teal-500/40 rounded-lg flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold text-teal-300 block">Cosine Similarity Score</span>
                        <span className="text-[10px] text-teal-400">Semantic alignment ratio</span>
                      </div>
                      <span className="text-2xl font-extrabold text-teal-200 font-mono">
                        {(embedResult.similarityScore * 100).toFixed(2)}%
                      </span>
                    </div>
                  )}

                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-[11px] font-semibold text-slate-300 block">Vector Dimension</span>
                    <span className="text-xs font-mono text-teal-400">{embedResult.dimensions} float32 dimensions</span>
                  </div>

                  {embedResult.embedding1Sample && (
                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                      <span className="text-[11px] font-semibold text-slate-300 block">Embedding Vector 1 (Sample head)</span>
                      <pre className="text-[10px] text-slate-400 font-mono overflow-x-auto">
                        [{embedResult.embedding1Sample.join(', ')}...]
                      </pre>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-xs space-y-2">
                  <Cpu className="w-8 h-8 opacity-40 text-teal-400" />
                  <p>Compute embeddings using gemini-embedding-2-preview.</p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
              <span>Model: gemini-embedding-2-preview</span>
              <span>API: ai.models.embedContent</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
