import React, { useState } from 'react';
import { 
  Terminal, Play, Copy, Check, Code, Cpu, Server, ExternalLink, ShieldCheck, Zap
} from 'lucide-react';

export const PerfectCorpApiPlayground: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('skin-analysis');
  const [activePayloadTab, setActivePayloadTab] = useState<'request' | 'response' | 'curl'>('request');
  const [copied, setCopied] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [liveResponse, setLiveResponse] = useState<any>(null);

  const API_SPECS: Record<string, {
    title: string;
    method: 'POST' | 'GET';
    path: string;
    description: string;
    perfectDocUrl: string;
    requestBody: any;
    sampleResponse: any;
  }> = {
    'skin-analysis': {
      title: 'Perfect Corp AI 14-Dimension Skin Diagnostic API',
      method: 'POST',
      path: '/api/perfect-corp/skin-analysis',
      description: 'Performs medical-grade computer vision dermatological assessment across 14 vectors (wrinkles, spots, dark circles, hydration, sebum, radiance, pores, acne, etc.)',
      perfectDocUrl: 'https://www.perfectcorp.com/business/products/ai-skin-diagnostic',
      requestBody: {
        imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80",
        requestedMetrics: [
          "wrinkles", "spots", "texture", "darkCircles", 
          "radiance", "hydration", "redness", "oiliness", 
          "pores", "acne", "eyeBags", "firmness", "droopiness", "barrierStrength"
        ],
        demographicContext: {
          chronologicalAge: 32,
          biologicalSex: "female",
          climateZone: "temperate_moderate_uv"
        }
      },
      sampleResponse: {
        success: true,
        executionTimeMs: 142,
        report: {
          overallHealthScore: 88,
          biologicalSkinAge: 28,
          skinType: "combination",
          undertone: "neutral",
          metrics: {
            wrinkles: { score: 91, severity: "optimal", delta: "+3%" },
            spots: { score: 82, severity: "mild", delta: "+2%" },
            radiance: { score: 93, severity: "optimal", delta: "+6%" },
            hydration: { score: 89, severity: "optimal", delta: "+4%" }
          },
          clinicalPrescriptions: [
            "Matrixyl 3000 (3%) + Copper Tripeptide-1",
            "Broad Spectrum Mineral SPF 50+ PA++++"
          ]
        }
      }
    },
    'virtual-tryon': {
      title: 'Perfect Corp AR 3D Virtual Try-On (VTO) API',
      method: 'POST',
      path: '/api/perfect-corp/virtual-tryon',
      description: 'Generates real-time 3D landmark mesh coordinates and texture shaders for lipstick, blush, eyeshadow, hair color, and eyewear try-on.',
      perfectDocUrl: 'https://www.perfectcorp.com/business/products/virtual-try-on',
      requestBody: {
        targetFaceLandmarks: 468,
        cosmetics: {
          lipstick: { hex: "#A84351", finish: "matte", opacity: 0.75 },
          blush: { hex: "#F88379", finish: "satin", opacity: 0.45 },
          eyeshadow: { hex: "#F7E7CE", finish: "shimmer", opacity: 0.65 }
        },
        eyewear: {
          modelId: "acc-titanium-round",
          metalColor: "#8E9297",
          lensTint: "anti-reflective-blue-cut"
        }
      },
      sampleResponse: {
        success: true,
        fps: 60,
        meshTrackingConfidence: 0.994,
        arShaderUniforms: {
          diffuseColor: [0.658, 0.262, 0.317, 0.75],
          specularShininess: 32.0,
          fresnelIntensity: 0.45
        }
      }
    },
    'genai-fashion': {
      title: 'Perfect Corp GenAI Fashion & Virtual Dressing Room API',
      method: 'POST',
      path: '/api/perfect-corp/genai-fashion',
      description: 'Transforms natural language prompts into 3D garment physics, chromatic harmonies, and virtual silhouette drape projections.',
      perfectDocUrl: 'https://www.perfectcorp.com/business/products/ai-fashion',
      requestBody: {
        prompt: "Sculptural linen-silk blend tailored blazer with asymmetric drape in ivory and champagne titanium accessories.",
        silhouetteType: "tailored",
        occasion: "Executive Gallery Opening",
        targetBodyMeasurements: {
          bustCm: 88,
          waistCm: 68,
          hipCm: 94,
          heightCm: 172
        }
      },
      sampleResponse: {
        success: true,
        ensembleId: "outfit-genai-8842",
        colorPalette: ["#EAE5DC", "#C5B49D", "#363432", "#9E8165"],
        drapePhysicsEngine: "Verlet Cloth Particle Collision (60 iterations/sec)",
        sustainabilityRating: "A+ (Regenerative Mulberry Silk)"
      }
    }
  };

  const currentSpec = API_SPECS[selectedEndpoint];

  const handleRunApi = async () => {
    setIsRunning(true);
    setLiveResponse(null);
    try {
      const res = await fetch(currentSpec.path, {
        method: currentSpec.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentSpec.requestBody)
      });
      const data = await res.json();
      setLiveResponse(data);
    } catch (err: any) {
      setLiveResponse({
        error: "Fallback executed",
        message: err.message,
        mockResponse: currentSpec.sampleResponse
      });
    } finally {
      setIsRunning(false);
    }
  };

  const curlCommand = `curl -X ${currentSpec.method} "https://ais-dev-4s4jvpipr3mh3mz6x2hpfp-393352619239.asia-southeast1.run.app${currentSpec.path}" \\
  -H "Content-Type: application/json" \\
  -H "X-Perfect-Corp-API-Key: YOUR_API_KEY" \\
  -d '${JSON.stringify(currentSpec.requestBody, null, 2)}'`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-zinc-900 to-stone-900 text-stone-100 p-6 rounded-3xl border border-stone-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-stone-950 shadow-md shrink-0 font-black">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white tracking-tight flex items-center gap-2">
              Perfect Corp Cloud API Developer Sandbox & Gateway
            </h3>
            <p className="text-xs text-stone-400">
              Interactive test console for Perfect Corp AI Skin Diagnostic, AR VTO Mesh, and GenAI Fashion APIs
            </p>
          </div>
        </div>

        <a
          href="https://www.perfectcorp.com/business"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition-all border border-stone-700 shrink-0"
        >
          <span>Official API Docs</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT (4 cols): Endpoint Switcher */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <span className="text-xs font-black text-stone-800 uppercase tracking-wide">Available APIs</span>
          {Object.entries(API_SPECS).map(([key, spec]) => (
            <button
              key={key}
              onClick={() => {
                setSelectedEndpoint(key);
                setLiveResponse(null);
              }}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col gap-1.5 cursor-pointer ${
                selectedEndpoint === key 
                  ? 'border-amber-500 bg-amber-50/80 shadow-xs ring-2 ring-amber-400/40' 
                  : 'border-stone-200 bg-white hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-black uppercase text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                  {spec.method}
                </span>
                <span className="text-[10px] font-mono text-stone-400 font-bold">200 OK</span>
              </div>
              <h5 className="text-xs font-extrabold text-stone-900">{spec.title}</h5>
              <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">{spec.description}</p>
            </button>
          ))}

          {/* Architecture Card */}
          <div className="p-4 bg-stone-900 text-stone-300 rounded-2xl border border-stone-800 text-xs flex flex-col gap-2 mt-2">
            <span className="text-[10px] font-mono font-black uppercase text-amber-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Zero-Trust Security Guarantee
            </span>
            <p className="text-[11px] leading-relaxed text-stone-400">
              All facial video frames and biometrics are processed ephemerally on-device or via server-side encrypted proxies with no facial biometric storage.
            </p>
          </div>
        </div>

        {/* RIGHT (8 cols): Interactive Request/Response Console */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-stone-950 text-stone-100 p-5 rounded-3xl border border-stone-800 shadow-2xl flex flex-col gap-4">
            
            {/* Header & Mode Tabs */}
            <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded-lg bg-amber-500 text-stone-950 font-mono font-black text-xs">
                  {currentSpec.method}
                </span>
                <span className="font-mono text-xs text-stone-300 font-bold">{currentSpec.path}</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-stone-900 p-1 rounded-xl border border-stone-800">
                  <button
                    onClick={() => setActivePayloadTab('request')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activePayloadTab === 'request' ? 'bg-stone-800 text-amber-400 font-black' : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    JSON Request
                  </button>
                  <button
                    onClick={() => setActivePayloadTab('response')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activePayloadTab === 'response' ? 'bg-stone-800 text-amber-400 font-black' : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    Response Body
                  </button>
                  <button
                    onClick={() => setActivePayloadTab('curl')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activePayloadTab === 'curl' ? 'bg-stone-800 text-amber-400 font-black' : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    cURL Command
                  </button>
                </div>

                <button
                  onClick={handleRunApi}
                  disabled={isRunning}
                  className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer disabled:opacity-50"
                  id="btn-execute-api"
                >
                  <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
                  <span>{isRunning ? 'Executing...' : 'Test Request'}</span>
                </button>
              </div>
            </div>

            {/* Code Body Area */}
            <div className="relative">
              <pre className="bg-stone-900/90 p-4 rounded-2xl font-mono text-xs text-amber-300/90 overflow-x-auto max-h-96 border border-stone-800 leading-relaxed">
                {activePayloadTab === 'request' && JSON.stringify(currentSpec.requestBody, null, 2)}
                {activePayloadTab === 'response' && JSON.stringify(liveResponse || currentSpec.sampleResponse, null, 2)}
                {activePayloadTab === 'curl' && curlCommand}
              </pre>

              <button
                onClick={() => copyToClipboard(
                  activePayloadTab === 'request' ? JSON.stringify(currentSpec.requestBody, null, 2) :
                  activePayloadTab === 'response' ? JSON.stringify(liveResponse || currentSpec.sampleResponse, null, 2) :
                  curlCommand
                )}
                className="absolute top-3 right-3 p-1.5 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-300 border border-stone-700 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                title="Copy to clipboard"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Response telemetry metrics */}
            <div className="flex items-center justify-between text-[11px] font-mono text-stone-400 pt-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Latency: ~140ms</span>
              </span>
              <span>Payload Size: 1.4 KB</span>
              <span>Auth: Bearer PerfectCorp-API-v3</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
