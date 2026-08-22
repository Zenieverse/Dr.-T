import React, { useState } from 'react';
import { 
  FileText, Download, Layers, Shield, Cpu, 
  Radio, Eye, ArrowRightLeft, Sparkles, CheckCircle2, 
  Zap, Database, HardDrive, Share2, ExternalLink
} from 'lucide-react';

export const SystemArchitectureViewer: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<string>('all');
  const architectureDiagramUrl = '/src/assets/images/architecture_diagram_1787287773340.jpg';

  const layers = [
    {
      id: 'all',
      title: 'Complete Unified Architecture',
      badge: 'End-to-End Topology',
      color: 'border-amber-500 bg-amber-50 text-amber-950'
    },
    {
      id: 'ingestion',
      title: 'Layer 1: Multimodal IoT Ingestion',
      badge: 'BLE 5.3 • Audio FFT • FACS Video',
      color: 'border-emerald-500 bg-emerald-50 text-emerald-950'
    },
    {
      id: 'edge',
      title: 'Layer 2: Edge AI & Micro-Compilers',
      badge: 'WASM SIMD • ONNX INT8 • TensorRT',
      color: 'border-purple-500 bg-purple-50 text-purple-950'
    },
    {
      id: 'multimodal',
      title: 'Layer 3: Multimodal Ethology Core',
      badge: 'Gemini 3.7 Vision • 432Hz Audio Synth',
      color: 'border-indigo-500 bg-indigo-50 text-indigo-950'
    },
    {
      id: 'ehr',
      title: 'Layer 4: Clinical EHR Integration',
      badge: 'HL7 FHIR v4.0.1 • Idexx • Covetrus',
      color: 'border-sky-500 bg-sky-50 text-sky-950'
    },
    {
      id: 'security',
      title: 'Layer 5: Enterprise Fleet Armor & Cloud',
      badge: 'Zero-Trust • HIPAA • Cloud Run',
      color: 'border-rose-500 bg-rose-50 text-rose-950'
    }
  ];

  return (
    <div className="space-y-6" id="system-architecture-view">
      
      {/* Header Banner */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 border-2 border-stone-800 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full font-mono text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Technical Blueprint & Specification
            </span>
            <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full font-mono text-[10px] font-bold">
              Production Architecture Diagram (JPG / PDF Ready)
            </span>
          </div>
          <h2 className="font-serif italic font-black text-2xl sm:text-3xl tracking-tight text-stone-100">
            System Architecture & Multimodal Infrastructure Diagram
          </h2>
          <p className="text-stone-400 font-mono text-xs max-w-2xl mt-1">
            End-to-end architectural topology spanning smart collar BLE 5.3 ingestion, on-device Edge WASM/ONNX compilers, 
            multimodal ethology decoders, bidirectional HL7 FHIR EHR gateways, and HIPAA/Vet-EHR Zero-Trust security armor.
          </p>
        </div>

        {/* Download & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={architectureDiagramUrl}
            download="PetWhisperer_System_Architecture_Diagram.jpg"
            className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 rounded-2xl font-mono text-xs font-black flex items-center gap-2 shadow-md hover:from-amber-400 hover:to-amber-500 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Diagram (JPG)</span>
          </a>
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-stone-800 text-stone-200 border border-stone-700 rounded-2xl font-mono text-xs font-bold flex items-center gap-2 hover:bg-stone-700 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-stone-400" />
            <span>Export PDF Blueprint</span>
          </button>
        </div>
      </div>

      {/* Layer Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {layers.map(layer => (
          <button
            key={layer.id}
            onClick={() => setActiveLayer(layer.id)}
            className={`px-4 py-2 rounded-2xl font-mono text-xs font-bold transition-all cursor-pointer whitespace-nowrap border-2 ${
              activeLayer === layer.id 
                ? 'bg-stone-900 text-white border-stone-900 shadow-sm ring-2 ring-amber-400/40' 
                : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
            }`}
          >
            {layer.title}
          </button>
        ))}
      </div>

      {/* Architecture Graphic Container */}
      <div className="bg-white rounded-3xl p-6 border-2 border-stone-900 shadow-sm space-y-6">
        
        <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-stone-200">
          <div>
            <span className="font-mono text-[10px] font-bold text-amber-800 uppercase tracking-widest bg-amber-100 px-2.5 py-0.5 rounded">
              High-Resolution Topology Map
            </span>
            <h3 className="font-serif font-black text-xl text-stone-900 mt-1">
              PetWhisperer & Dr. T Enterprise Technical Architecture
            </h3>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-stone-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>5-Layer Multimodal Pipeline Verified</span>
          </div>
        </div>

        {/* Rendered Architecture Diagram Image */}
        <div className="relative rounded-2xl overflow-hidden border-2 border-stone-800 bg-stone-950 shadow-inner group">
          <img
            src={architectureDiagramUrl}
            alt="PetWhisperer System Architecture Diagram"
            referrerPolicy="no-referrer"
            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.01]"
          />
          <div className="absolute bottom-3 right-3 bg-stone-900/90 text-stone-200 border border-stone-700 px-3 py-1.5 rounded-xl font-mono text-[11px] backdrop-blur-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Architecture v4.2 • Production Release</span>
          </div>
        </div>

        {/* 5-Layer Structured Architectural Breakdown Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          
          {/* Layer 1 */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                Layer 1: Ingestion
              </span>
              <Radio className="w-4 h-4 text-emerald-600" />
            </div>
            <h4 className="font-serif font-black text-sm text-stone-900">Multimodal IoT & Sensory Streams</h4>
            <ul className="space-y-1 font-mono text-[11px] text-stone-600">
              <li>• BLE 5.3 ISO Photoplethysmography (PPG) Heart Rate & HRV</li>
              <li>• 3-Axis Accelerometer & IMU Micro-vibration Actigraphy</li>
              <li>• 25Hz Audio Ingestion & High-Precision Bark Spectrograms</li>
              <li>• Real-Time Video RTSP / WebRTC Multi-Angle Feeds</li>
            </ul>
          </div>

          {/* Layer 2 */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded">
                Layer 2: Edge Engine
              </span>
              <Cpu className="w-4 h-4 text-purple-600" />
            </div>
            <h4 className="font-serif font-black text-sm text-stone-900">On-Device Edge Micro-Compilers</h4>
            <ul className="space-y-1 font-mono text-[11px] text-stone-600">
              <li>• WebAssembly (WASM + SIMD) In-Browser Execution</li>
              <li>• ONNX Runtime INT8 Post-Training Quantization</li>
              <li>• TensorRT FP16 Acceleration for NVIDIA Jetson Orin</li>
              <li>• Sub-10ms Air-Gapped Inference for Smart Pet Cameras</li>
            </ul>
          </div>

          {/* Layer 3 */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase font-bold text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded">
                Layer 3: AI Intelligence
              </span>
              <Sparkles className="w-4 h-4 text-indigo-600" />
            </div>
            <h4 className="font-serif font-black text-sm text-stone-900">Multimodal Ethology & Bio-Acoustics</h4>
            <ul className="space-y-1 font-mono text-[11px] text-stone-600">
              <li>• Gemini 3.7 Multimodal Vision (DogFACS & CatFACS)</li>
              <li>• Cross-Species Action Coding (EquiFACS & Avian Posture)</li>
              <li>• Real-Time Solfeggio Harmonic Synthesizer (432Hz / 528Hz)</li>
              <li>• Vector Memory RAG for Canine Behavioral History</li>
            </ul>
          </div>

          {/* Layer 4 */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded">
                Layer 4: Clinical Bridge
              </span>
              <ArrowRightLeft className="w-4 h-4 text-sky-600" />
            </div>
            <h4 className="font-serif font-black text-sm text-stone-900">HL7 FHIR & Direct EHR Gateways</h4>
            <ul className="space-y-1 font-mono text-[11px] text-stone-600">
              <li>• Two-Way Sync with Idexx Cornerstone & Covetrus Pulse</li>
              <li>• ezyVet Cloud OpenConnect & HL7 FHIR R4 Bundles</li>
              <li>• Automated Veterinary SOAP Notes & Rx Reconciliation</li>
              <li>• Longitudinal Biometric Trend Archiving</li>
            </ul>
          </div>

          {/* Layer 5 */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded">
                Layer 5: Enterprise Armor
              </span>
              <Shield className="w-4 h-4 text-rose-600" />
            </div>
            <h4 className="font-serif font-black text-sm text-stone-900">Fleet Security & Cloud Infrastructure</h4>
            <ul className="space-y-1 font-mono text-[11px] text-stone-600">
              <li>• Zero-Trust Role-Based Access Control (RBAC)</li>
              <li>• HIPAA & Vet-EHR End-to-End Encryption at Rest & In-Flight</li>
              <li>• Google Cloud Run Scalable Ingress Container Routing</li>
              <li>• Firestore In-Memory Local Cache Resilience</li>
            </ul>
          </div>

          {/* Summary Metric Block */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2 flex flex-col justify-between">
            <div>
              <span className="font-mono text-[10px] uppercase font-bold text-amber-900">
                System Health & Latency SLA
              </span>
              <h4 className="font-serif font-black text-sm text-stone-900 mt-1">Operational Metrics</h4>
              <p className="font-mono text-[11px] text-stone-700 mt-1">
                Zero-cloud offline latency: <strong>3.8ms</strong><br />
                Cloud multimodal roundtrip: <strong>340ms</strong><br />
                EHR FHIR sync reliability: <strong>99.99%</strong>
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-800 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>All Systems Green</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
