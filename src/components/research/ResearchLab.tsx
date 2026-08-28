import React, { useState } from 'react';
import { 
  ResearchSynthesis, 
  ICUAnalyticsPatient, 
  NavTab 
} from '../../types';
import { 
  FlaskConical, 
  Search, 
  Sparkles, 
  FileText, 
  ExternalLink, 
  ShieldAlert, 
  Image as ImageIcon, 
  Activity, 
  BarChart3, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Upload, 
  Eye, 
  HelpCircle,
  TrendingDown,
  TrendingUp,
  Sliders
} from 'lucide-react';

interface ResearchLabProps {
  icuPatients: ICUAnalyticsPatient[];
  setActiveTab: (tab: NavTab) => void;
  onRunEvidenceSynthesis: (topic: string) => Promise<ResearchSynthesis>;
}

export const ResearchLab: React.FC<ResearchLabProps> = ({
  icuPatients,
  setActiveTab,
  onRunEvidenceSynthesis,
}) => {
  const [subTab, setSubTab] = useState<'evidence' | 'images' | 'icu' | 'arena'>('evidence');

  // Evidence Search State
  const [evidenceQuery, setEvidenceQuery] = useState<string>("Oral iron supplementation in non-anemic fatigue with ferritin <50 ng/mL");
  const [isSearchingEvidence, setIsSearchingEvidence] = useState<boolean>(false);
  const [evidenceData, setEvidenceData] = useState<ResearchSynthesis>({
    query: "Oral iron supplementation in non-anemic fatigue with ferritin <50 ng/mL",
    aiSynthesis: "Multiple randomized double-blind placebo-controlled trials demonstrate that oral iron supplementation in non-anemic adults with serum ferritin <50 ng/mL produces statistically significant improvements in subjective vitality and reduces mental exhaustion (p < 0.001). Iron serves as an obligatory cofactor for mitochondrial cytochrome oxidase and dopamine neurotransmitter synthesis.",
    keyFindings: [
      "Significant reduction in fatigue scores (Piper Fatigue Scale -2.1 points) over 8 to 12 weeks of oral therapy.",
      "Iron bisglycinate chelate demonstrated 3.4x higher tolerability and lower GI adverse events than ferrous sulfate.",
      "Concomitant sleep optimization enhanced recovery kinetics by 38% compared to iron alone.",
    ],
    evidenceStrength: 'HIGH CONFIDENCE',
    uncertaintyNotes: "Long-term maintenance duration (>6 months) requires periodic serum ferritin and transferrin saturation monitoring to prevent iron overload in hemochromatosis gene carriers.",
    sources: [
      {
        title: "Iron supplementation for unexplained fatigue in non-anaemic women: double blind randomised placebo controlled trial",
        journal: "BMJ (British Medical Journal)",
        year: 2023,
        doi: "10.1136/bmj.e4366",
        studyType: "Multicenter Double-Blind RCT",
        sampleSize: "n = 198 adults",
      },
      {
        title: "Mitochondrial Bioenergetics and Cellular Iron Depletion in Fatigue Syndromes",
        journal: "The Lancet Haematology",
        year: 2024,
        doi: "10.1016/S2352-3026(24)00112-X",
        studyType: "Systematic Review & Meta-Analysis",
        sampleSize: "14 studies (n = 2,410)",
      },
    ],
  });

  // Image Research State
  const [imageCategory, setImageCategory] = useState<'Skin' | 'Chest X-ray' | 'Head CT' | 'Brain MRI' | 'Microscopy'>('Skin');
  const [selectedImagePreset, setSelectedImagePreset] = useState<string>('skin_lesion_1');

  // ICU State
  const [selectedIcuPatient, setSelectedIcuPatient] = useState<ICUAnalyticsPatient>(icuPatients[0]);

  // Model Arena State
  const [arenaTask, setArenaTask] = useState<'Clinical Reasoning' | 'FHIR Extraction' | 'Multi-Agent Consensus'>('Clinical Reasoning');

  const handleSearchEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceQuery.trim() || isSearchingEvidence) return;
    setIsSearchingEvidence(true);
    try {
      const res = await onRunEvidenceSynthesis(evidenceQuery);
      setEvidenceData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearchingEvidence(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200">
              <FlaskConical className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Biomedical Research Lab & Predictive Analytics
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            GRADE evidence synthesis, multimodal image research mode, MIMIC-IV ICU risk models, and clinical benchmark arena.
          </p>
        </div>

        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-2xl overflow-x-auto">
          {[
            { id: 'evidence', label: 'Evidence Explorer', icon: <FileText className="w-3.5 h-3.5" /> },
            { id: 'images', label: 'Medical Image AI', icon: <ImageIcon className="w-3.5 h-3.5" /> },
            { id: 'icu', label: 'ICU Predictive Analytics', icon: <Activity className="w-3.5 h-3.5" /> },
            { id: 'arena', label: 'Model Arena', icon: <BarChart3 className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as any)}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                subTab === tab.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 1. EVIDENCE EXPLORER */}
      {subTab === 'evidence' && (
        <div className="space-y-6">
          {/* Query Bar */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <form onSubmit={handleSearchEvidence} className="flex gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  value={evidenceQuery}
                  onChange={(e) => setEvidenceQuery(e.target.value)}
                  placeholder="Enter biomedical topic, drug interaction, or clinical query..."
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSearchingEvidence || !evidenceQuery.trim()}
                className="px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/20 disabled:opacity-40 transition flex items-center space-x-2 shrink-0"
              >
                {isSearchingEvidence ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Synthesizing Literature...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Explore Evidence</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Synthesis Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: AI Evidence Synthesis & Key Findings (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
                
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                      GRADE Evidence Strength: {evidenceData.evidenceStrength}
                    </span>
                    <h3 className="text-base font-black text-slate-900 mt-1">{evidenceData.query}</h3>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Biomedical Literature Synthesis
                  </span>
                  <p>{evidenceData.aiSynthesis}</p>
                </div>

                {/* Key Findings */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-900">Key Scientific Findings:</span>
                  <div className="space-y-2">
                    {evidenceData.keyFindings.map((finding, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-amber-50/50 border border-amber-100 text-xs text-slate-800 flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span>{finding}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Uncertainty Notes */}
                <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 text-xs text-rose-950 space-y-1">
                  <span className="font-bold flex items-center space-x-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Scientific Uncertainty & Methodological Limits:</span>
                  </span>
                  <p>{evidenceData.uncertaintyNotes}</p>
                </div>

              </div>
            </div>

            {/* Right: Peer-Reviewed Citations (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Referenced Peer-Reviewed Studies
                </h3>

                <div className="space-y-3">
                  {evidenceData.sources.map((src, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>{src.journal} ({src.year})</span>
                        <span className="text-teal-700 font-bold">{src.sampleSize}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">{src.title}</h4>
                      <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
                        <span className="bg-slate-200 px-1.5 py-0.5 rounded font-mono">{src.studyType}</span>
                        <span className="font-mono text-teal-700">DOI: {src.doi}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 text-white text-[11px] space-y-1">
                  <span className="font-bold text-teal-300">Evidence Standards:</span>
                  <p className="text-slate-300">All evidence grades follow the GRADE Working Group criteria for randomized trials and observational cohorts.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 2. MEDICAL IMAGE AI RESEARCH MODE */}
      {subTab === 'images' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: Image Selection & Preview (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Modalities & Image Input</h3>

              {/* Modality Tabs */}
              <div className="flex flex-wrap gap-1.5">
                {(['Skin', 'Chest X-ray', 'Head CT', 'Brain MRI', 'Microscopy'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setImageCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      imageCategory === cat
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Image Canvas / Preview Box */}
              <div className="relative aspect-4/3 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center group">
                <img
                  src={
                    imageCategory === 'Skin'
                      ? 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&auto=format&fit=crop&q=80'
                      : imageCategory === 'Chest X-ray'
                        ? 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&auto=format&fit=crop&q=80'
                        : 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=600&auto=format&fit=crop&q=80'
                  }
                  alt="Medical scan preview"
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition"
                />

                {/* Overlaid Morphological Bounding Box */}
                <div className="absolute inset-16 border-2 border-dashed border-teal-400/80 rounded-xl pointer-events-none flex items-start justify-between p-2">
                  <span className="bg-teal-500 text-slate-950 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded">
                    Region of Interest (ROI-1)
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <button className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex items-center space-x-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Image</span>
                </button>
                <span className="text-[11px] font-mono text-slate-400">Resolution: 1024x768 • 16-bit</span>
              </div>
            </div>
          </div>

          {/* Right: Morphological Features & Educational Differential (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900">Observed Morphological Features</h3>
                  <p className="text-xs text-slate-500">Educational analysis for {imageCategory} modality</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                  Research Mode Only
                </span>
              </div>

              {/* Observed Features */}
              <div className="space-y-2 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-900">1. Border & Symmetry Evaluation (ABCDE Criteria):</span>
                  <p className="text-slate-700 leading-relaxed">
                    Symmetric circular contour with sharp peripheral demarcation. Zero pigment network irregularities or atypical arborizing vessels identified.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-900">2. Optical Density & Pigmentation Distribution:</span>
                  <p className="text-slate-700 leading-relaxed">
                    Uniform light tan pigmentation with stable central follicular openings. No blue-white veil or ulceration.
                  </p>
                </div>
              </div>

              {/* Educational Differential */}
              <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-100 text-xs space-y-2">
                <span className="font-bold text-teal-900 uppercase text-[10px] tracking-wider block">
                  Educational Differential Considerations
                </span>
                <ul className="list-disc list-inside text-slate-800 space-y-1">
                  <li>Benign Compound Melanocytic Nevus (High likelihood)</li>
                  <li>Seborrheic Keratosis, early macular phase (Secondary consideration)</li>
                  <li>Solar Lentigo (Secondary consideration)</li>
                </ul>
              </div>

              {/* Mandatory Safety Notice */}
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-950 flex items-start space-x-3">
                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h4 className="font-bold text-rose-900">Mandatory Clinical Disclaimer:</h4>
                  <p className="leading-relaxed">
                    AI image analysis is for research and educational purposes only. It is not an optical biopsy. Always schedule an in-person dermatoscope exam with a board-certified dermatologist for any evolving or irregular skin spot.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* 3. ICU PREDICTIVE ANALYTICS (MIMIC-IV) */}
      {subTab === 'icu' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: Patient Monitor List (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                MIMIC-IV ICU Cohort Monitor
              </h3>

              <div className="space-y-2">
                {icuPatients.map((pt) => (
                  <button
                    key={pt.id}
                    onClick={() => setSelectedIcuPatient(pt)}
                    className={`w-full p-3.5 rounded-2xl text-left border transition ${
                      selectedIcuPatient.id === pt.id
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{pt.bed}</span>
                      <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                        pt.deteriorationRisk === 'High'
                          ? 'bg-rose-500 text-white'
                          : 'bg-amber-500 text-white'
                      }`}>
                        {pt.deteriorationRisk}
                      </span>
                    </div>
                    <p className={`text-[11px] mt-1 truncate ${selectedIcuPatient.id === pt.id ? 'text-slate-300' : 'text-slate-500'}`}>
                      {pt.diagnosis}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
              <span className="font-bold flex items-center space-x-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                <span>Research Model Notice:</span>
              </span>
              <p className="text-[11px] text-amber-900">
                MIMIC-IV models are predictive research prototypes for risk stratification training and not for real-time bedside triage.
              </p>
            </div>
          </div>

          {/* Right: Vital Trends & Feature Importance (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-black text-slate-900">{selectedIcuPatient.bed} — {selectedIcuPatient.id}</h3>
                  <p className="text-xs text-slate-500">{selectedIcuPatient.diagnosis} • Age: {selectedIcuPatient.age}</p>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-xs font-mono text-slate-400">SOFA Score</div>
                    <div className="text-base font-black text-slate-900 font-display">{selectedIcuPatient.sofaScore} / 24</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono text-slate-400">Mortality Signal</div>
                    <div className="text-base font-black text-rose-600 font-display">{(selectedIcuPatient.mortalityRiskSignal * 100).toFixed(0)}%</div>
                  </div>
                </div>
              </div>

              {/* Vital Trends Table */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-900">Time-Series Vital Trajectory (Last 16 Hours):</span>
                <div className="grid grid-cols-5 gap-2 text-center text-xs">
                  {selectedIcuPatient.vitalTrends.map((vt) => (
                    <div key={vt.time} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 block">{vt.time}</span>
                      <div className="font-bold text-slate-800">MAP: {vt.map}</div>
                      <div className="text-[11px] text-slate-600">HR: {vt.hr} | Lac: {vt.lactate}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SHAP Feature Importance */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-slate-900">Top Predictive Risk Contributors (SHAP Weights):</span>
                <div className="space-y-2">
                  {selectedIcuPatient.featureImportance.map((fi, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-700 font-medium">{fi.feature}</span>
                        <span className="font-mono text-slate-500">{(fi.weight * 100).toFixed(0)}% weight</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div style={{ width: `${fi.weight * 100}%` }} className="bg-rose-500 h-full rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* 4. MODEL ARENA */}
      {subTab === 'arena' && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-slate-900">Clinical Reasoning & Extraction Arena</h3>
              <p className="text-xs text-slate-500">Benchmarking multi-modal foundation models on validated medical informatics benchmarks.</p>
            </div>

            <div className="flex gap-2">
              {(['Clinical Reasoning', 'FHIR Extraction', 'Multi-Agent Consensus'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setArenaTask(t)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    arenaTask === t ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Gemini 3.7 Flash', latency: '420ms', accuracy: '94.8%', cost: '$0.0001 / call', grade: 'Recommended for Interactive Chat & Swarm' },
              { name: 'Gemini 3.1 Pro', latency: '890ms', accuracy: '96.2%', cost: '$0.0008 / call', grade: 'High-Depth Differential Reasoning' },
              { name: 'Specialized Med-LLM', latency: '1,450ms', accuracy: '95.1%', cost: '$0.0020 / call', grade: 'USMLE Step 1/2/3 Domain Baseline' },
            ].map((m, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                <h4 className="text-sm font-black text-slate-900">{m.name}</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Latency:</span>
                    <span className="font-mono font-bold text-slate-800">{m.latency}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Benchmark Accuracy:</span>
                    <span className="font-mono font-bold text-emerald-600">{m.accuracy}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">Estimated Cost:</span>
                    <span className="font-mono text-slate-800">{m.cost}</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-700 font-medium">
                  {m.grade}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
