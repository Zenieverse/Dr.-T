import React, { useState } from 'react';
import { Eye, Upload, Sparkles, CheckCircle2, AlertCircle, RefreshCw, Layers, Shield } from 'lucide-react';
import { CanineVisionAnalysis } from './types';

const SAMPLE_CASE_STUDIES = [
  {
    id: 'kona',
    name: 'Kona',
    breed: 'Belgian Malinois',
    age: '3.5 yrs',
    thumbIcon: '🐕',
    description: 'Acute sound reactivity, flattened pinnae, sclera whale eye.',
    defaultAnalysis: {
      patientName: 'Kona',
      breed: 'Belgian Malinois',
      stressGrade: 4.2,
      emotionalValence: 'Acute Panic / Fear' as const,
      microExpressions: {
        earPinnaTension: { score: 4.8, description: 'Caudally pinned pinnae with bilateral tension at cranial ear base', unit: 'AU101' },
        lipCommissureRetraction: { score: 3.9, description: 'Tight horizontal commissure elongation without relaxed sub-mandibular drop', unit: 'AU109' },
        spinalRigidityVector: { score: 4.5, description: 'Thoracic kyphosis with tail clamped tightly against perineum', unit: 'AU115' },
        scleraWhaleEyeExposure: { score: 4.7, description: 'Bilateral medial scleral crescent visibility (> 4.8mm area)', unit: 'AU102' },
        cervicalTension: { score: 4.1, description: 'Depressed neck angle aligned below dorsal spine axis', unit: 'AU108' }
      },
      keyFindings: [
        'Significant bilateral whale eye sclera exposure indicating active sympathetic arousal.',
        'Caudal ear flattening with tight commissure retraction confirms acute acoustic fear stimulus.',
        'Postural weight shifted 78% onto hindquarters in avoidance freeze orientation.',
        'Absence of piloerection confirms situational fear rather than predatory or defensive aggression.'
      ],
      recommendedAction: 'Deploy 432 Hz Solfeggio bio-harmonic tone immediately with visual barrier lowering and gentle tactile compression.',
      confidenceScore: 98.2
    }
  },
  {
    id: 'barnaby',
    name: 'Barnaby',
    breed: 'Golden Retriever',
    age: '5 yrs',
    thumbIcon: '🦮',
    description: 'Post-play relaxed panting, soft orbital gaze, neutral ear carriage.',
    defaultAnalysis: {
      patientName: 'Barnaby',
      breed: 'Golden Retriever',
      stressGrade: 0.8,
      emotionalValence: 'Calm / Social' as const,
      microExpressions: {
        earPinnaTension: { score: 0.6, description: 'Neutral ear base with soft forward drape', unit: 'AU101' },
        lipCommissureRetraction: { score: 1.2, description: 'Relaxed open mouth panting with rounded commissures', unit: 'AU109' },
        spinalRigidityVector: { score: 0.5, description: 'Supple sinusoidal spine with neutral loose tail carriage', unit: 'AU115' },
        scleraWhaleEyeExposure: { score: 0.2, description: 'Zero sclera exposure; soft rounded pupils', unit: 'AU102' },
        cervicalTension: { score: 0.4, description: 'Elevated curious head carriage in natural balance', unit: 'AU108' }
      },
      keyFindings: [
        'High parasympathetic vagal tone characterized by rhythmic soft breathing.',
        'Facial action units show complete absence of agonistic or defensive micro-tensions.',
        'Social engagement readiness score 9.6/10.'
      ],
      recommendedAction: 'Maintain baseline ambient monitoring; zero behavioral intervention required.',
      confidenceScore: 99.1
    }
  },
  {
    id: 'luna',
    name: 'Luna',
    breed: 'Border Collie',
    age: '2 yrs',
    thumbIcon: '🐕‍🦺',
    description: 'Hyper-vigilant herding focus, forward ear pinna, lip tightness.',
    defaultAnalysis: {
      patientName: 'Luna',
      breed: 'Border Collie',
      stressGrade: 2.8,
      emotionalValence: 'Alert / Vigilant' as const,
      microExpressions: {
        earPinnaTension: { score: 3.4, description: 'Erect cranial rotation with rapid micro-scanning movements', unit: 'AU101' },
        lipCommissureRetraction: { score: 2.5, description: 'Closed mouth with subtle anterior lip compression', unit: 'AU109' },
        spinalRigidityVector: { score: 3.2, description: 'Stalking crouch with lowered center of mass', unit: 'AU115' },
        scleraWhaleEyeExposure: { score: 1.8, description: 'Minimal sclera visibility; intense focal fixation', unit: 'AU102' },
        cervicalTension: { score: 3.0, description: 'Extended cervical spine aligned with thoracic vector', unit: 'AU108' }
      },
      keyFindings: [
        'High dopaminergic predatory/herding fixation on moving stimulus.',
        'Mild sympathetic elevation without panic or distress markers.',
        'Optimal candidate for redirection with scatter feeding or target training.'
      ],
      recommendedAction: 'Engage sniffing olfactory puzzle to stimulate inhibitory serotonin pathways.',
      confidenceScore: 96.7
    }
  },
  {
    id: 'buster',
    name: 'Buster',
    breed: 'French Bulldog',
    age: '4 yrs',
    thumbIcon: '🐶',
    description: 'Brachycephalic thermal panting vs situational stress evaluation.',
    defaultAnalysis: {
      patientName: 'Buster',
      breed: 'French Bulldog',
      stressGrade: 2.4,
      emotionalValence: 'Mild Anxiety' as const,
      microExpressions: {
        earPinnaTension: { score: 2.2, description: 'Bat ear base tension with subtle lateral splay', unit: 'AU101' },
        lipCommissureRetraction: { score: 3.6, description: 'Elongated spoon-shaped tongue with caudal commissure pull', unit: 'AU109' },
        spinalRigidityVector: { score: 2.1, description: 'Short-coupled lumbar stiffness with weight on forequarters', unit: 'AU115' },
        scleraWhaleEyeExposure: { score: 2.8, description: 'Lateral sclera showing due to brachycephalic shallow orbit', unit: 'AU102' },
        cervicalTension: { score: 2.0, description: 'Neutral cervical extension to optimize airway airflow', unit: 'AU108' }
      },
      keyFindings: [
        'Combined respiratory thermal regulation and mild environmental sound vigilance.',
        'Tongue flattening indicates primary thermo-regulation need rather than fear crisis.'
      ],
      recommendedAction: 'Provide active airflow cooling and 528 Hz soothing acoustic environment.',
      confidenceScore: 95.8
    }
  }
];

export const VisionDecoder: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<string>('kona');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<CanineVisionAnalysis>(SAMPLE_CASE_STUDIES[0].defaultAnalysis);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);

  const handleSelectCase = (caseId: string) => {
    setSelectedCase(caseId);
    setUploadedImagePreview(null);
    const cs = SAMPLE_CASE_STUDIES.find(c => c.id === caseId);
    if (cs) {
      setAnalysis(cs.defaultAnalysis);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setUploadedImagePreview(base64);
      setSelectedCase('custom');

      setIsAnalyzing(true);
      try {
        const res = await fetch('/api/ethology/analyze-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            base64Image: base64,
            mimeType: file.type || 'image/jpeg',
            patientName: 'Custom Patient',
            breed: 'Canine'
          })
        });
        const data = await res.json();
        if (data && data.analysis) {
          setAnalysis(data.analysis);
        }
      } catch (err) {
        console.error("Vision upload error:", err);
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-8 bg-[#FAF9F6] text-[#1A1A1A] p-4 sm:p-6 lg:p-8 rounded-3xl border border-stone-800 shadow-sm" id="vision-decoder-container">
      
      {/* Header */}
      <div className="border-b border-stone-800 pb-6">
        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1 bg-stone-900 text-amber-300 text-[11px] font-mono font-bold uppercase rounded-full flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            03 MULTIMODAL VISION DECODER
          </span>
          <span className="text-xs font-mono text-stone-500">Gemini 3.7 Vision & Facial Action Coding System (FACS)</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-serif italic font-black text-[#1A1A1A] mt-2 tracking-tight">
          Canine Facial Action Coding & Micro-Expression Extraction
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 font-serif mt-1 max-w-3xl">
          Automated extraction of canine facial micro-tensions: Ear Pinna Tension (AU101), Lip Commissure Retraction (AU109), Sclera Exposure ("Whale Eye" AU102), and Spinal Rigidity Vectors (AU115).
        </p>
      </div>

      {/* Case Study Selection Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {SAMPLE_CASE_STUDIES.map(cs => (
          <button
            key={cs.id}
            onClick={() => handleSelectCase(cs.id)}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              selectedCase === cs.id
                ? 'bg-stone-900 text-white border-stone-900 shadow-md ring-2 ring-amber-400/50'
                : 'bg-white text-stone-800 border-stone-300 hover:bg-stone-100'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-2xl">{cs.thumbIcon}</span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  selectedCase === cs.id ? 'bg-amber-400 text-stone-950' : 'bg-stone-100 text-stone-600'
                }`}>
                  {cs.age}
                </span>
              </div>
              <h3 className="font-serif font-black text-sm mt-2">{cs.name}</h3>
              <p className={`text-[11px] font-mono ${selectedCase === cs.id ? 'text-amber-200' : 'text-stone-500'}`}>
                {cs.breed}
              </p>
            </div>
            <p className={`text-[10px] font-mono mt-3 leading-tight ${selectedCase === cs.id ? 'text-stone-300' : 'text-stone-600'}`}>
              {cs.description}
            </p>
          </button>
        ))}
      </div>

      {/* Upload Custom Image Zone */}
      <div className="bg-white border border-stone-800 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-stone-100 rounded-2xl border border-stone-300">
            <Upload className="w-5 h-5 text-stone-700" />
          </div>
          <div>
            <h4 className="font-serif font-black text-sm text-stone-900">Upload Live Canine Photo or Video Frame</h4>
            <p className="text-xs font-mono text-stone-500">
              Accepts JPG, PNG, WebP up to 10MB. Automated Gemini 3.7 Vision analysis extracts micro-expression vectors.
            </p>
          </div>
        </div>
        <div>
          <label 
            htmlFor="vision-file-input"
            className="px-5 py-2.5 bg-stone-900 hover:bg-black text-amber-300 font-mono text-xs font-bold rounded-2xl border border-stone-900 flex items-center gap-2 cursor-pointer shadow-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Select Image File</span>
          </label>
          <input
            id="vision-file-input"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Visual Analysis Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Patient Visual Frame / Status (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-stone-800 rounded-3xl p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <h3 className="font-mono text-xs font-black uppercase text-stone-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-stone-700" />
              Patient Frame & Emotional Valence
            </h3>
            <span className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold ${
              analysis.stressGrade >= 4 ? 'bg-red-100 text-red-800 border border-red-300' :
              analysis.stressGrade >= 2 ? 'bg-amber-100 text-amber-800 border border-amber-300' :
              'bg-emerald-100 text-emerald-800 border border-emerald-300'
            }`}>
              Stress Grade: {analysis.stressGrade} / 5.0
            </span>
          </div>

          {/* Image Display Area */}
          <div className="relative aspect-4/3 bg-stone-900 rounded-2xl overflow-hidden border border-stone-800 flex items-center justify-center">
            {uploadedImagePreview ? (
              <img 
                src={uploadedImagePreview} 
                alt="Canine Subject" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="p-8 text-center text-stone-400 space-y-2">
                <span className="text-6xl block">
                  {selectedCase === 'kona' ? '🐕' : selectedCase === 'barnaby' ? '🦮' : selectedCase === 'luna' ? '🐕‍🦺' : '🐶'}
                </span>
                <div className="font-serif font-black text-white text-lg">{analysis.patientName}</div>
                <div className="font-mono text-xs text-amber-400">{analysis.breed}</div>
              </div>
            )}

            {/* Overlaid Micro-Expression Indicators */}
            <div className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-sm text-white font-mono text-[10px] px-2.5 py-1 rounded-lg border border-stone-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Valence: <strong>{analysis.emotionalValence}</strong></span>
            </div>

            <div className="absolute bottom-3 right-3 bg-stone-950/80 backdrop-blur-sm text-amber-300 font-mono text-[10px] px-2.5 py-1 rounded-lg border border-stone-700">
              Confidence: {analysis.confidenceScore}%
            </div>
          </div>

          {/* Action Recommendation Box */}
          <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl space-y-1.5">
            <span className="text-[10px] font-mono uppercase font-black text-amber-900 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-amber-700" /> Prescribed De-Escalation Protocol
            </span>
            <p className="text-xs font-serif text-stone-800 italic leading-relaxed">
              "{analysis.recommendedAction}"
            </p>
          </div>
        </div>

        {/* Right: Facial Action Units & Vector Breakdown (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-stone-800 rounded-3xl p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <h3 className="font-mono text-xs font-black uppercase text-stone-900">
              Facial Action Units (FACS) Micro-Tension Vectors
            </h3>
            <span className="text-xs font-mono text-stone-500 font-bold">5 Action Units Measured</span>
          </div>

          {/* 5 Facial Action Units Progress Bars */}
          <div className="space-y-3.5">
            {[
              { label: 'AU101: Ear Pinna Tension & Orientation', data: analysis.microExpressions.earPinnaTension },
              { label: 'AU109: Lip Commissure Retraction & Tightness', data: analysis.microExpressions.lipCommissureRetraction },
              { label: 'AU115: Spinal Rigidity & Tail Perineum Clamp', data: analysis.microExpressions.spinalRigidityVector },
              { label: 'AU102: Sclera Exposure ("Whale Eye")', data: analysis.microExpressions.scleraWhaleEyeExposure },
              { label: 'AU108: Cervical Spine Axial Depression', data: analysis.microExpressions.cervicalTension }
            ].map((unit, idx) => (
              <div key={idx} className="space-y-1 bg-stone-50 p-3 rounded-2xl border border-stone-200">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-stone-800">{unit.label}</span>
                  <span className="font-black text-stone-900">{unit.data.score} / 5.0</span>
                </div>
                <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      unit.data.score > 3.5 ? 'bg-red-600' :
                      unit.data.score > 2.0 ? 'bg-amber-500' :
                      'bg-emerald-600'
                    }`}
                    style={{ width: `${(unit.data.score / 5) * 100}%` }}
                  />
                </div>
                <p className="text-[11px] font-mono text-stone-600 italic">
                  › {unit.data.description}
                </p>
              </div>
            ))}
          </div>

          {/* Clinical Findings Bullet Points */}
          <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-2">
            <span className="text-[10px] font-mono uppercase font-black text-stone-500 block">
              Ethological Clinical Findings:
            </span>
            <ul className="space-y-1">
              {analysis.keyFindings.map((finding, idx) => (
                <li key={idx} className="text-xs font-mono text-stone-700 flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 mt-0.5 shrink-0" />
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
};
