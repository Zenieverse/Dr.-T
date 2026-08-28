import React, { useRef } from 'react';
import { X, Download, Cloud, Cpu, Database, Coins, ShieldCheck, Sparkles, Activity, Layers } from 'lucide-react';

interface ArchitectureDiagramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureDiagramModal: React.FC<ArchitectureDiagramModalProps> = ({ isOpen, onClose }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  if (!isOpen) return null;

  const handleDownloadPNG = () => {
    if (!svgRef.current) return;
    const svgElement = svgRef.current;
    const svgString = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const URL = window.URL || window.webkitURL || window;
    const blobURL = URL.createObjectURL(svgBlob);
    
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 700;
      const context = canvas.getContext('2d');
      if (context) {
        context.fillStyle = '#FAF9F6';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0);
        const png = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = 'PetWhisperer_System_Architecture.png';
        downloadLink.href = png;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    };
    image.src = blobURL;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAF9F6] border-2 border-[#1A1A1A] rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-[#1A1A1A]/20 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-extrabold bg-amber-400 text-black border border-amber-500">
                SYSTEM BLUEPRINT
              </span>
              <span className="text-[11px] font-mono text-stone-500">VER 2.4.0-AWS-GCP-SOL</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif italic font-light text-[#1A1A1A]">
              PetWhisperer AI Technical Architecture
            </h2>
            <p className="text-xs font-mono text-stone-600">
              Autonomous Cross-Species Ethology, Multimodal Model Armor & Web3 Verification Grid
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadPNG}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#1A1A1A] text-white hover:bg-stone-800 text-xs font-mono font-bold transition shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PNG</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SVG Diagram Canvas */}
        <div className="bg-white border border-[#1A1A1A]/20 rounded-xl p-4 overflow-x-auto">
          <svg 
            ref={svgRef}
            viewBox="0 0 1100 520" 
            className="w-full min-w-[800px] h-auto font-sans"
          >
            {/* Background */}
            <rect width="1100" height="520" fill="#FAF9F6" rx="8" />
            
            {/* Grid lines subtle */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1A1A1A" strokeWidth="0.5" strokeOpacity="0.05" />
              </pattern>
            </defs>
            <rect width="1100" height="520" fill="url(#grid)" />

            {/* Layer 1: Ingestion */}
            <rect x="40" y="50" width="220" height="420" rx="12" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="1.5" />
            <rect x="40" y="50" width="220" height="35" rx="12" fill="#1A1A1A" />
            <text x="55" y="73" fill="#FFFFFF" fontSize="12" fontWeight="bold" fontFamily="monospace">01 SENSORY INGESTION</text>
            
            <rect x="55" y="100" width="190" height="70" rx="8" fill="#F4F4F0" stroke="#1A1A1A" strokeWidth="1" />
            <text x="70" y="125" fill="#1A1A1A" fontSize="12" fontWeight="bold">Acoustic Microphone</text>
            <text x="70" y="145" fill="#666666" fontSize="10" fontFamily="monospace">FFT Spectrum 10Hz-22kHz</text>
            <text x="70" y="160" fill="#E65100" fontSize="9" fontFamily="monospace">Decibel Peak: 92 dB</text>

            <rect x="55" y="190" width="190" height="70" rx="8" fill="#F4F4F0" stroke="#1A1A1A" strokeWidth="1" />
            <text x="70" y="215" fill="#1A1A1A" fontSize="12" fontWeight="bold">Vision Feed (RTSP/WebRTC)</text>
            <text x="70" y="235" fill="#666666" fontSize="10" fontFamily="monospace">Postural & Ear Pinna</text>
            <text x="70" y="250" fill="#2E7D32" fontSize="9" fontFamily="monospace">60 FPS Micro-Analysis</text>

            <rect x="55" y="280" width="190" height="70" rx="8" fill="#F4F4F0" stroke="#1A1A1A" strokeWidth="1" />
            <text x="70" y="305" fill="#1A1A1A" fontSize="12" fontWeight="bold">IoT Biometrics</text>
            <text x="70" y="325" fill="#666666" fontSize="10" fontFamily="monospace">Smart Collar HRV/Motion</text>
            <text x="70" y="340" fill="#1565C0" fontSize="9" fontFamily="monospace">BLE 5.3 + MQTT</text>

            <rect x="55" y="370" width="190" height="70" rx="8" fill="#FFF9C4" stroke="#F57F17" strokeWidth="1" />
            <text x="70" y="395" fill="#1A1A1A" fontSize="11" fontWeight="bold">Autonomous Sentinel</text>
            <text x="70" y="415" fill="#666666" fontSize="10" fontFamily="monospace">Edge VAD Trigger &lt;5ms</text>
            <text x="70" y="430" fill="#E65100" fontSize="9" fontFamily="monospace">Scale-to-Zero Ingress</text>

            {/* Arrows 1 -> 2 */}
            <path d="M 260 260 L 320 260" stroke="#1A1A1A" strokeWidth="2" strokeDasharray="4 2" />
            <polygon points="320,260 312,255 312,265" fill="#1A1A1A" />

            {/* Layer 2: Cognitive Core */}
            <rect x="320" y="50" width="250" height="420" rx="12" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="1.5" />
            <rect x="320" y="50" width="250" height="35" rx="12" fill="#D97706" />
            <text x="335" y="73" fill="#FFFFFF" fontSize="12" fontWeight="bold" fontFamily="monospace">02 COGNITIVE &amp; MODEL ARMOR</text>

            <rect x="335" y="100" width="220" height="100" rx="8" fill="#FEF3C7" stroke="#D97706" strokeWidth="1" />
            <text x="350" y="125" fill="#92400E" fontSize="13" fontWeight="bold">Gemini 3.7 &amp; 2.5 Flash</text>
            <text x="350" y="145" fill="#451A03" fontSize="10" fontFamily="monospace">Veterinary Ethology Core</text>
            <text x="350" y="165" fill="#78350F" fontSize="10">Polyvagal Autonomic Triage</text>
            <text x="350" y="185" fill="#B45309" fontSize="9" fontFamily="monospace">Arousal Index: 84 / 100</text>

            <rect x="335" y="215" width="220" height="100" rx="8" fill="#F4F4F0" stroke="#1A1A1A" strokeWidth="1" />
            <text x="350" y="240" fill="#1A1A1A" fontSize="12" fontWeight="bold">Model Armor Guardrails</text>
            <text x="350" y="260" fill="#666666" fontSize="10" fontFamily="monospace">Zero Aversive Intercept</text>
            <text x="350" y="280" fill="#C62828" fontSize="10">AVSAB Compliance Check</text>
            <text x="350" y="300" fill="#2E7D32" fontSize="9" fontFamily="monospace">Human-in-the-Loop Routing</text>

            <rect x="335" y="330" width="220" height="110" rx="8" fill="#F4F4F0" stroke="#1A1A1A" strokeWidth="1" />
            <text x="350" y="355" fill="#1A1A1A" fontSize="12" fontWeight="bold">Strands AgentCore Hub</text>
            <text x="350" y="375" fill="#666666" fontSize="10">Track A: Everyday Guardian</text>
            <text x="350" y="395" fill="#666666" fontSize="10">Track B: Clinical SOAP Sync</text>
            <text x="350" y="415" fill="#666666" fontSize="10">Track C: Good Neighbor Mesh</text>

            {/* Arrows 2 -> 3 */}
            <path d="M 570 260 L 630 260" stroke="#1A1A1A" strokeWidth="2" strokeDasharray="4 2" />
            <polygon points="630,260 622,255 622,265" fill="#1A1A1A" />

            {/* Layer 3: Cloud & Interventions */}
            <rect x="630" y="50" width="210" height="420" rx="12" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="1.5" />
            <rect x="630" y="50" width="210" height="35" rx="12" fill="#0284C7" />
            <text x="645" y="73" fill="#FFFFFF" fontSize="12" fontWeight="bold" fontFamily="monospace">03 CLOUD &amp; AUDIO</text>

            <rect x="645" y="100" width="180" height="90" rx="8" fill="#F0F9FF" stroke="#0284C7" strokeWidth="1" />
            <text x="660" y="125" fill="#0369A1" fontSize="12" fontWeight="bold">432 Hz Resonator</text>
            <text x="660" y="145" fill="#666666" fontSize="10" fontFamily="monospace">Web Audio API Synth</text>
            <text x="660" y="165" fill="#0284C7" fontSize="10">Parasympathetic Reset</text>
            <text x="660" y="180" fill="#0369A1" fontSize="9" fontFamily="monospace">Latency: 14ms</text>

            <rect x="645" y="205" width="180" height="95" rx="8" fill="#F0F9FF" stroke="#0284C7" strokeWidth="1" />
            <text x="660" y="230" fill="#0369A1" fontSize="12" fontWeight="bold">Google Cloud Pub/Sub</text>
            <text x="660" y="250" fill="#666666" fontSize="10" fontFamily="monospace">Acoustic Spikes Topic</text>
            <text x="660" y="270" fill="#0284C7" fontSize="10">Fanout to Veterinarians</text>
            <text x="660" y="290" fill="#0369A1" fontSize="9" fontFamily="monospace">DLQ + Ack Stream</text>

            <rect x="645" y="315" width="180" height="125" rx="8" fill="#F0F9FF" stroke="#0284C7" strokeWidth="1" />
            <text x="660" y="340" fill="#0369A1" fontSize="12" fontWeight="bold">Google Cloud Run</text>
            <text x="660" y="360" fill="#666666" fontSize="10" fontFamily="monospace">Region: asia-southeast1</text>
            <text x="660" y="380" fill="#0284C7" fontSize="10">Container Ingress (3000)</text>
            <text x="660" y="400" fill="#666666" fontSize="10">Cloud Firestore DB</text>
            <text x="660" y="420" fill="#0369A1" fontSize="9" fontFamily="monospace">Uptime: 99.98%</text>

            {/* Arrows 3 -> 4 */}
            <path d="M 840 260 L 890 260" stroke="#1A1A1A" strokeWidth="2" strokeDasharray="4 2" />
            <polygon points="890,260 882,255 882,265" fill="#1A1A1A" />

            {/* Layer 4: Storage & Ledger */}
            <rect x="890" y="50" width="170" height="420" rx="12" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="1.5" />
            <rect x="890" y="50" width="170" height="35" rx="12" fill="#4F46E5" />
            <text x="900" y="73" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="monospace">04 DW &amp; WEB3</text>

            <rect x="900" y="100" width="150" height="150" rx="8" fill="#EEF2FF" stroke="#4F46E5" strokeWidth="1" />
            <text x="912" y="125" fill="#3730A3" fontSize="12" fontWeight="bold">Snowflake DW</text>
            <text x="912" y="145" fill="#666666" fontSize="10" fontFamily="monospace">Cortex ML Analysis</text>
            <text x="912" y="165" fill="#4338CA" fontSize="9">CANINE_INCIDENTS</text>
            <text x="912" y="185" fill="#4338CA" fontSize="9">AROUSAL_STREAM</text>
            <text x="912" y="205" fill="#4338CA" fontSize="9">SOAP_CLINICAL_TBL</text>
            <text x="912" y="230" fill="#3730A3" fontSize="9" fontFamily="monospace">Query Latency: 32ms</text>

            <rect x="900" y="265" width="150" height="175" rx="8" fill="#FAF5FF" stroke="#7E22CE" strokeWidth="1" />
            <text x="912" y="290" fill="#581C87" fontSize="12" fontWeight="bold">Solana Devnet</text>
            <text x="912" y="310" fill="#666666" fontSize="10" fontFamily="monospace">ed25519 Cryptography</text>
            <text x="912" y="330" fill="#7E22CE" fontSize="9">Pet Passport Proof</text>
            <text x="912" y="350" fill="#7E22CE" fontSize="9">TREATS Token Mint</text>
            <text x="912" y="370" fill="#7E22CE" fontSize="9">De-escalation Reward</text>
            <text x="912" y="400" fill="#15803D" fontSize="10" fontWeight="bold" fontFamily="monospace">+25 TREATS/EVT</text>
            <text x="912" y="420" fill="#581C87" fontSize="8" fontFamily="monospace">Finality &lt;400ms</text>
          </svg>
        </div>

        {/* Footer info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono text-stone-600 bg-stone-100 p-4 rounded-xl border border-stone-200">
          <div>
            <strong className="text-[#1A1A1A]">Cloud Run Deployment:</strong> 0.0.0.0:3000 Ingress on Google Cloud Container Infrastructure (asia-southeast1).
          </div>
          <div>
            <strong className="text-[#1A1A1A]">Cognitive Latency:</strong> 420ms end-to-end multimodal inference using Gemini 3.7 Flash.
          </div>
          <div>
            <strong className="text-[#1A1A1A]">Web3 Verification:</strong> On-chain immutable cryptographic hash written to Solana Devnet.
          </div>
        </div>

      </div>
    </div>
  );
};
