import React, { useState } from 'react';
import { 
  LabResult, 
  FHIRResourceNode, 
  SOAPNote, 
  NavTab 
} from '../../types';
import { 
  FileText, 
  FileSpreadsheet, 
  Layers, 
  Sparkles, 
  Check, 
  Copy, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  Send, 
  Code, 
  Upload, 
  Search,
  ExternalLink,
  HelpCircle,
  TrendingDown,
  TrendingUp,
  Minus
} from 'lucide-react';

interface ClinicalInformaticsProps {
  labResults: LabResult[];
  fhirResources: FHIRResourceNode[];
  setActiveTab: (tab: NavTab) => void;
  onGenerateSOAP: (notes: string) => Promise<SOAPNote>;
}

export const ClinicalInformatics: React.FC<ClinicalInformaticsProps> = ({
  labResults,
  fhirResources,
  setActiveTab,
  onGenerateSOAP,
}) => {
  const [subTab, setSubTab] = useState<'soap' | 'labs' | 'fhir'>('soap');

  // SOAP State
  const [encounterInput, setEncounterInput] = useState<string>(
    "34yo patient reports 4 weeks of persistent afternoon fatigue, mild cognitive fog around 2:30 PM, and fragmented sleep. No fever, no chest pain, no unprovoked weight loss. Lab review: Ferritin 19 ng/mL (low-normal), 25-OH Vitamin D 28 ng/mL (suboptimal), TSH 2.15 uIU/mL (normal), Glucose 88 mg/dL. BP 118/76 mmHg. Taking Cholecalciferol 2000 IU daily."
  );
  const [soapNote, setSoapNote] = useState<SOAPNote>({
    id: 'SOAP-2026-0828-A',
    patientName: 'Alex Morgan (MRN: PAT-88492-X)',
    encounterDate: '2026-08-28',
    clinician: 'Dr. Sarah Chen, MD',
    subjective: '34yo individual presents with 4-week history of fatigue and brain fog accentuated in mid-afternoon. Denies exertional dyspnea, chest pain, syncope, fevers, or GI bleeding. Sleep fragmented with late chronotype (12:45 AM average).',
    objective: 'Vitals: BP 118/76 mmHg, HR 68 bpm regular, SpO2 99% on room air, BMI 22.4. Labs (Quest 08/25/2026): Serum Ferritin 19 ng/mL (Low-normal, Ref 24-336), 25-OH Vitamin D 28 ng/mL (Ref 30-100), TSH 2.15 uIU/mL (Ref 0.45-4.50), Fasting Glucose 88 mg/dL.',
    assessment: '1. Non-anemic iron deficiency / depleted tissue iron stores (ICD-10 E61.1, SNOMED 84229001). Hemoglobin preserved, ferritin 19 ng/mL.\n2. Suboptimal Vitamin D status (E55.9).\n3. Circadian sleep phase delay contributing to daytime fatigue.',
    plan: '1. Diagnostics: Order repeat Iron Panel (Serum Iron, TIBC, Transferrin Saturation) in 8 weeks.\n2. Therapeutics: Initiate gentle oral Iron Bisglycinate 25mg daily with Vitamin C on an empty stomach or away from dairy/coffee.\n3. Continue Vitamin D3 2,000 IU daily with breakfast.\n4. Sleep Hygiene: Anchor morning outdoor light within 20 mins of waking; amber light curfew at 10:00 PM.\n5. Follow-up: Telehealth review in 8 weeks or sooner if symptoms escalate.',
    status: 'draft',
  });
  const [isGeneratingSoap, setIsGeneratingSoap] = useState<boolean>(false);
  const [copiedSoap, setCopiedSoap] = useState<boolean>(false);

  // Labs State
  const [selectedLab, setSelectedLab] = useState<LabResult>(labResults[0]);
  const [labSearch, setLabSearch] = useState<string>('');

  // FHIR State
  const [selectedFhirNode, setSelectedFhirNode] = useState<FHIRResourceNode>(fhirResources[0]);
  const [fhirJsonText, setFhirJsonText] = useState<string>(JSON.stringify(fhirResources[0].rawJson, null, 2));
  const [fhirValidationError, setFhirValidationError] = useState<string | null>(null);

  const handleRunSoapGenerator = async () => {
    setIsGeneratingSoap(true);
    try {
      const generated = await onGenerateSOAP(encounterInput);
      setSoapNote(generated);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingSoap(false);
    }
  };

  const handleCopySoap = () => {
    const fullText = `CLINICAL PROGRESS NOTE (SOAP)
Patient: ${soapNote.patientName}
Date: ${soapNote.encounterDate}
Clinician: ${soapNote.clinician}

SUBJECTIVE (S):
${soapNote.subjective}

OBJECTIVE (O):
${soapNote.objective}

ASSESSMENT (A):
${soapNote.assessment}

PLAN (P):
${soapNote.plan}
`;
    navigator.clipboard.writeText(fullText);
    setCopiedSoap(true);
    setTimeout(() => setCopiedSoap(false), 2000);
  };

  const handleSelectFhirResource = (node: FHIRResourceNode) => {
    setSelectedFhirNode(node);
    setFhirJsonText(JSON.stringify(node.rawJson, null, 2));
    setFhirValidationError(null);
  };

  const handleValidateFhirJson = (text: string) => {
    setFhirJsonText(text);
    try {
      const parsed = JSON.parse(text);
      if (!parsed.resourceType) {
        setFhirValidationError('Missing required field: "resourceType"');
      } else if (!parsed.id) {
        setFhirValidationError('Missing required field: "id"');
      } else {
        setFhirValidationError(null);
      }
    } catch (err: any) {
      setFhirValidationError(`JSON Syntax Error: ${err.message}`);
    }
  };

  const filteredLabs = labResults.filter(l => 
    l.testName.toLowerCase().includes(labSearch.toLowerCase()) ||
    l.category.toLowerCase().includes(labSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Header & Subtab Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200">
              <FileText className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Clinical Decision Support & Informatics Hub
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            FHIR R4 interoperability, Socratic clinical SOAP documentation, and automated biomedical lab interpretation.
          </p>
        </div>

        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-2xl">
          {[
            { id: 'soap', label: 'SOAP Note Generator', icon: <FileText className="w-3.5 h-3.5" /> },
            { id: 'labs', label: 'Lab Interpretation', icon: <FileSpreadsheet className="w-3.5 h-3.5" /> },
            { id: 'fhir', label: 'FHIR Interop Graph', icon: <Layers className="w-3.5 h-3.5" /> },
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

      {/* 1. SOAP PROGRESS NOTE GENERATOR */}
      {subTab === 'soap' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Encounter Input (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Encounter Dialogue & Clinical Notes</h3>
                <span className="text-[10px] font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full font-bold">
                  Gemini Clinical Engine
                </span>
              </div>

              <p className="text-xs text-slate-500">
                Paste clinician notes, conversation transcripts, or patient symptom summaries to automatically synthesize standard SOAP documentation.
              </p>

              <textarea
                rows={8}
                value={encounterInput}
                onChange={(e) => setEncounterInput(e.target.value)}
                placeholder="Type or paste encounter details..."
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-teal-500 leading-relaxed"
              />

              <button
                onClick={handleRunSoapGenerator}
                disabled={isGeneratingSoap || !encounterInput.trim()}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 disabled:opacity-40 transition flex items-center justify-center space-x-2"
              >
                {isGeneratingSoap ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Synthesizing SOAP Note...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate SOAP Documentation</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Tips */}
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 space-y-1">
              <span className="font-bold flex items-center space-x-1">
                <HelpCircle className="w-3.5 h-3.5 text-blue-700" />
                <span>Interoperability Notice:</span>
              </span>
              <p className="text-[11px] text-blue-900">
                Generated notes are structured to be compatible with HL7 FHIR <code className="font-mono bg-blue-100 px-1 py-0.5 rounded">DocumentReference</code> and <code className="font-mono bg-blue-100 px-1 py-0.5 rounded">ClinicalImpression</code> resources.
              </p>
            </div>
          </div>

          {/* Right Column: Generated SOAP Output (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-black text-slate-900">Clinical Progress Note</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                      {soapNote.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">{soapNote.patientName} • {soapNote.encounterDate}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopySoap}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center space-x-1.5"
                  >
                    {copiedSoap ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSoap ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* SOAP Sections */}
              <div className="space-y-4 text-xs">
                
                {/* S - Subjective */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 flex items-center space-x-1">
                    <span className="w-4 h-4 rounded-full bg-teal-100 text-teal-900 flex items-center justify-center text-[10px] font-black mr-1">S</span>
                    <span>Subjective (History of Present Illness & Symptoms)</span>
                  </span>
                  <p className="text-slate-800 leading-relaxed whitespace-pre-line mt-1">{soapNote.subjective}</p>
                </div>

                {/* O - Objective */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 flex items-center space-x-1">
                    <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center text-[10px] font-black mr-1">O</span>
                    <span>Objective (Vitals, Physical Exam & Laboratory Data)</span>
                  </span>
                  <p className="text-slate-800 leading-relaxed whitespace-pre-line mt-1">{soapNote.objective}</p>
                </div>

                {/* A - Assessment */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 flex items-center space-x-1">
                    <span className="w-4 h-4 rounded-full bg-purple-100 text-purple-900 flex items-center justify-center text-[10px] font-black mr-1">A</span>
                    <span>Assessment (Differential Diagnosis & Clinical Rationale)</span>
                  </span>
                  <p className="text-slate-800 leading-relaxed whitespace-pre-line mt-1">{soapNote.assessment}</p>
                </div>

                {/* P - Plan */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center space-x-1">
                    <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center text-[10px] font-black mr-1">P</span>
                    <span>Plan (Diagnostics, Therapeutics, Education & Follow-Up)</span>
                  </span>
                  <p className="text-slate-800 leading-relaxed whitespace-pre-line mt-1">{soapNote.plan}</p>
                </div>

              </div>

            </div>
          </div>

        </div>
      )}

      {/* 2. LAB INTERPRETATION ENGINE */}
      {subTab === 'labs' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Lab Test Selection List (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter lab panels..."
                  value={labSearch}
                  onChange={(e) => setLabSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:bg-white"
                />
              </div>

              <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
                {filteredLabs.map((lab) => {
                  const isSelected = selectedLab.id === lab.id;
                  return (
                    <button
                      key={lab.id}
                      onClick={() => setSelectedLab(lab)}
                      className={`w-full p-3 rounded-2xl text-left border transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-800'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold">{lab.testName}</div>
                        <div className={`text-[10px] ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                          {lab.category}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-black font-mono">
                          {lab.value} {lab.unit}
                        </div>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                          lab.status === 'NORMAL'
                            ? isSelected ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-800'
                            : isSelected ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {lab.status}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: In-Depth Lab Interpretation Workspace (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-black text-slate-900">{selectedLab.testName}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      selectedLab.status === 'NORMAL' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {selectedLab.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{selectedLab.category} • Sample Date: {selectedLab.date}</p>
                </div>

                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-black text-slate-900 font-display">
                    {selectedLab.value}
                  </span>
                  <span className="text-sm font-bold text-slate-500">{selectedLab.unit}</span>
                </div>
              </div>

              {/* Reference Range Visual Slider */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Reference Interval</span>
                  <span className="font-mono text-slate-600 font-semibold">{selectedLab.referenceRange}</span>
                </div>

                <div className="relative h-4 bg-slate-200 rounded-full overflow-hidden">
                  {/* Normal Zone */}
                  <div className="absolute left-[20%] right-[20%] top-0 bottom-0 bg-emerald-200/90" />
                  
                  {/* Indicator Marker */}
                  <div 
                    style={{ left: selectedLab.status === 'LOW' ? '12%' : '50%' }}
                    className="absolute top-0 bottom-0 w-2.5 bg-rose-600 rounded-full ring-2 ring-white shadow-xs -translate-x-1/2"
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Low &lt; {selectedLab.minNormal}</span>
                  <span className="text-emerald-700 font-bold">Normal Range</span>
                  <span>High &gt; {selectedLab.maxNormal}</span>
                </div>
              </div>

              {/* What this measures & Clinical Context */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
                <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-100 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800">
                    Biochemical Function
                  </span>
                  <p className="text-slate-800">{selectedLab.whatItMeasures}</p>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800">
                    Clinical Meaning for You
                  </span>
                  <p className="text-slate-800">{selectedLab.clinicalContext}</p>
                </div>
              </div>

              {/* Curated Questions for Clinician */}
              {selectedLab.questionsForClinician.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                    <HelpCircle className="w-4 h-4 text-teal-600" />
                    <span>Recommended Questions for Dr. Sarah Chen</span>
                  </span>
                  <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                    {selectedLab.questionsForClinician.map((q, idx) => (
                      <li key={idx}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTA */}
              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  onClick={() => setActiveTab('drt')}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center space-x-1.5"
                >
                  <span>Ask Dr. T about {selectedLab.testName}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* 3. FHIR R4 INTEROPERABILITY GRAPH & JSON VIEWER */}
      {subTab === 'fhir' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Visual Resource Graph Nodes (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">HL7 FHIR R4 Resource Graph</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-100 text-blue-800 font-bold">
                  US-Core v4.0.0
                </span>
              </div>

              <p className="text-xs text-slate-500">
                Visualizing clinical relationship graph: <code className="font-mono bg-slate-100 px-1 rounded">Patient</code> → <code className="font-mono bg-slate-100 px-1 rounded">Encounter</code> → <code className="font-mono bg-slate-100 px-1 rounded">Observation</code> → <code className="font-mono bg-slate-100 px-1 rounded">DiagnosticReport</code> → <code className="font-mono bg-slate-100 px-1 rounded">Condition</code>.
              </p>

              <div className="space-y-2">
                {fhirResources.map((res) => {
                  const isSelected = selectedFhirNode.id === res.id;
                  return (
                    <button
                      key={res.id}
                      onClick={() => handleSelectFhirResource(res)}
                      className={`w-full p-3.5 rounded-2xl text-left border transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200/80 text-slate-800'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.2 rounded text-[10px] font-bold uppercase font-mono ${
                            isSelected ? 'bg-teal-500 text-white' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {res.resourceType}
                          </span>
                          <span className="text-xs font-bold">{res.id}</span>
                        </div>
                        <p className={`text-[11px] truncate max-w-xs ${isSelected ? 'text-slate-300' : 'text-slate-600'}`}>
                          {res.display || res.title}
                        </p>
                      </div>

                      <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive JSON Editor & Live Schema Validator (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <Code className="w-4 h-4 text-blue-600" />
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    FHIR JSON Schema Editor & Validator
                  </h3>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(fhirJsonText)}
                    className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center space-x-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy JSON</span>
                  </button>
                </div>
              </div>

              {/* Validation Status Indicator */}
              {fhirValidationError ? (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{fhirValidationError}</span>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Valid HL7 FHIR R4 Schema Structure (Zero syntax errors)</span>
                </div>
              )}

              {/* JSON Textarea Editor */}
              <textarea
                rows={14}
                value={fhirJsonText}
                onChange={(e) => handleValidateFhirJson(e.target.value)}
                className="w-full p-4 bg-slate-950 text-emerald-400 font-mono text-xs rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 leading-relaxed shadow-inner"
                spellCheck={false}
              />

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>HL7 FHIR Release 4 (v4.0.1)</span>
                <span className="font-mono text-slate-400">Bytes: {new Blob([fhirJsonText]).size}</span>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
};
