import React, { useState } from 'react';
import { 
  Eye, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  Layers, 
  Scan, 
  Info,
  Camera
} from 'lucide-react';

export const VisionDecoder: React.FC = () => {
  const PRESET_IMAGES = [
    {
      id: 'whale_eye',
      title: 'Lateral Sclera Exposure ("Whale Eye")',
      url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
      description: 'Acute territorial vigilance with lateral sclera display and ear flattening.'
    },
    {
      id: 'lip_curl',
      title: 'Lip Commissure Retraction & Tension',
      url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=600&q=80',
      description: 'Horizontal retraction without bared dentition (stress/appeasement signal).'
    },
    {
      id: 'spinal_stiff',
      title: 'Cervical & Spinal Rigidity',
      url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
      description: 'Thoracic muscle bracing and stiffened tail carriage before threshold cross.'
    }
  ];

  const [selectedImage, setSelectedImage] = useState(PRESET_IMAGES[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [visionAnalysis, setVisionAnalysis] = useState<any>({
    overallPosture: 'Vigilant / Sympathetic Activation',
    arousalIndex: 78,
    earPinnaTension: 'Posterior caudal retraction (high tension, 82%)',
    lipCommissure: 'Sub-horizontal retraction without bared dentition (appeasement/stress signal)',
    spinalRigidity: 'Cervical extension with thoracic bracing (stiff)',
    scleraWhaleEye: 'Lateral sclera visible (~25% eye area, classic whale eye)',
    tailCarriage: 'Horizontal rigid, low-amplitude micro-wagging (tension indicator)',
    clinicalSummary: 'Subject displays clear signs of threshold proximity due to environmental auditory/visual stimuli. Immediate displacement and 432 Hz acoustic pacing suggested.',
    confidence: 0.94
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setSelectedImage({
          id: 'custom_upload',
          title: 'Custom Uploaded Canine Photo',
          url: base64,
          description: 'User provided visual specimen for ethology analysis.'
        });
        runVisionAnalysis(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const runVisionAnalysis = async (base64Img?: string) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ethology/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Img || selectedImage.url,
          subject: 'Buster (Golden Retriever, 3yo)'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setVisionAnalysis(data.analysis);
      }
    } catch (err) {
      console.warn('Vision analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1A1A1A]/20 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-extrabold bg-[#1A1A1A] text-white">
              GEMINI 2.5 / 3.7 VISION
            </span>
            <span className="text-xs font-mono text-stone-500">
              03 MULTIMODAL POSTURAL &amp; MICRO-EXPRESSION DECODER
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif italic font-light text-[#1A1A1A] mt-1">
            Canine Vision &amp; Posture Decoder
          </h1>
          <p className="text-xs sm:text-sm font-mono text-stone-600 max-w-3xl mt-1">
            High-precision extraction of facial micro-expressions (ear pinna caudal tension, sclera whale eye, lip commissure) and body kinematic tension using Gemini Vision.
          </p>
        </div>

        <label className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white border border-[#1A1A1A] text-xs font-mono font-bold text-[#1A1A1A] hover:bg-stone-100 transition shadow-xs cursor-pointer">
          <Upload className="w-4 h-4 text-amber-600" />
          <span>Upload Canine Image</span>
          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      {/* Preset Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {PRESET_IMAGES.map((preset) => (
          <button
            key={preset.id}
            onClick={() => {
              setSelectedImage(preset);
              runVisionAnalysis();
            }}
            className={`p-3 rounded-xl border text-left flex items-center space-x-3 transition ${
              selectedImage.id === preset.id
                ? 'bg-amber-50 border-amber-500 shadow-xs'
                : 'bg-white border-stone-200 hover:border-stone-400'
            }`}
          >
            <img src={preset.url} alt={preset.title} className="w-12 h-12 rounded-lg object-cover border border-stone-300" />
            <div className="space-y-0.5 overflow-hidden">
              <div className="text-xs font-mono font-bold text-stone-900 truncate">{preset.title}</div>
              <div className="text-[10px] font-mono text-stone-500 line-clamp-1">{preset.description}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Main Analysis Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Image Canvas with Overlay Indicators */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-[#1A1A1A] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center space-x-2">
              <Scan className="w-4 h-4 text-[#1A1A1A]" />
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#1A1A1A]">
                Visual Input &amp; Ethology Bounding
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
              Confidence: {Math.round(visionAnalysis.confidence * 100)}%
            </span>
          </div>

          <div className="relative rounded-xl overflow-hidden border border-stone-300 bg-stone-900 aspect-4/3 flex items-center justify-center">
            <img 
              src={selectedImage.url} 
              alt="Canine Observation" 
              className="w-full h-full object-cover"
            />
            {/* Visual bounding boxes overlay */}
            <div className="absolute top-1/4 left-1/4 w-1/3 h-1/4 border-2 border-dashed border-amber-400 rounded bg-amber-400/10 pointer-events-none flex items-start justify-end p-1">
              <span className="text-[9px] font-mono font-extrabold bg-amber-400 text-black px-1 rounded">
                EYE / SCLERA
              </span>
            </div>
            <div className="absolute top-1/6 left-1/6 w-1/4 h-1/4 border-2 border-dashed border-rose-400 rounded bg-rose-400/10 pointer-events-none flex items-start justify-start p-1">
              <span className="text-[9px] font-mono font-extrabold bg-rose-400 text-white px-1 rounded">
                EAR PINNA
              </span>
            </div>
          </div>

          <button
            onClick={() => runVisionAnalysis()}
            disabled={isAnalyzing}
            className="w-full py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-stone-800 text-white font-mono font-bold text-xs flex items-center justify-center space-x-2 transition shadow-xs disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 text-amber-400 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Running Gemini Vision...' : 'Re-Analyze Micro-Expressions'}</span>
          </button>
        </div>

        {/* Right: Detailed Metric Telemetry */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-[#1A1A1A] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#1A1A1A]">
                Extracted Ethological Postural Breakdown
              </h2>
            </div>
            <span className="text-xs font-mono text-stone-500">
              Arousal: <strong className="text-amber-700">{visionAnalysis.arousalIndex}%</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-stone-200 space-y-1">
              <div className="text-[10px] text-stone-400 uppercase font-bold">Ear Pinna Tension</div>
              <div className="text-stone-900 font-bold">{visionAnalysis.earPinnaTension}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-stone-200 space-y-1">
              <div className="text-[10px] text-stone-400 uppercase font-bold">Lip Commissure</div>
              <div className="text-stone-900 font-bold">{visionAnalysis.lipCommissure}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-stone-200 space-y-1">
              <div className="text-[10px] text-stone-400 uppercase font-bold">Spinal Rigidity</div>
              <div className="text-stone-900 font-bold">{visionAnalysis.spinalRigidity}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-stone-200 space-y-1">
              <div className="text-[10px] text-stone-400 uppercase font-bold">Sclera ("Whale Eye")</div>
              <div className="text-stone-900 font-bold">{visionAnalysis.scleraWhaleEye}</div>
            </div>
          </div>

          {/* Clinical Summary */}
          <div className="p-4 rounded-xl bg-[#1A1A1A] text-white space-y-2 font-mono text-xs">
            <div className="text-amber-400 font-bold uppercase text-[11px]">
              Veterinary Ethology Interpretation:
            </div>
            <p className="text-stone-300 leading-relaxed">
              {visionAnalysis.clinicalSummary}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
