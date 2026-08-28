import React, { useState } from 'react';
import { 
  Cpu, 
  ShieldCheck, 
  Stethoscope, 
  Users, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Copy, 
  Share2, 
  Radio, 
  Sparkles, 
  Layers, 
  Send,
  AlertTriangle,
  HeartHandshake
} from 'lucide-react';

export const StrandsAgentCoreHub: React.FC = () => {
  const [activeTrack, setActiveTrack] = useState<'trackA' | 'trackB' | 'trackC'>('trackA');

  // Track B SOAP generator state
  const [soapObservations, setSoapObservations] = useState(
    'Buster showed sudden lateral body freeze and tail-tuck when mail carrier approached the gate at 14:15. Emitted 2 low-frequency growls (F0 ~180Hz) with bilateral ear pinna caudal flattening. Calmed within 90 seconds after 432 Hz tone and scatter treat deployment.'
  );
  const [isGeneratingSoap, setIsGeneratingSoap] = useState(false);
  const [generatedSoap, setGeneratedSoap] = useState<{
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  }>({
    subjective: 'Owner reports acute stranger reactivity triggered by postal delivery personnel. Subject exhibited territorial freezing and vocal alarm.',
    objective: 'Decibel peak measured at 84 dB. Micro-expression video analysis confirmed bilateral ear pinna retraction (82%), caudal spinal bracing, and horizontal lip commissure tension without tooth display. Baseline heart rate spike to 128 bpm normalized to 84 bpm post-intervention.',
    assessment: 'Acute territorial alarm / sympathetic autonomic arousal (Operant threshold level 3). No predatory intent or escalation to uninhibited bite aggression.',
    plan: '1. Continue automated 432 Hz acoustic pacing on doorstep motion trigger.\n2. Implement desensitization protocol with high-value scatter mat 15ft from entryway.\n3. Log biometrics to Snowflake table CANINE_SOAP_CLINICAL.'
  });

  const [copiedSoap, setCopiedSoap] = useState(false);

  const handleGenerateSoap = () => {
    setIsGeneratingSoap(true);
    setTimeout(() => {
      setGeneratedSoap({
        subjective: `Patient presented with observation: "${soapObservations.slice(0, 120)}..."`,
        objective: 'Sensory acoustic telemetry recorded 86 dB peak with rapid sympathetic surge. Micro-expression confirmed bilateral caudal ear tension and spinal rigidity.',
        assessment: 'Situational hyper-vigilance responsive to acoustic counter-conditioning. Arousal score 78/100.',
        plan: '1. Maintain autonomous taskmaster sentinel loop.\n2. Reinforce olfactory grounding and relaxation protocol.\n3. Sync SOAP record with clinical veterinary EHR via HL7 FHIR.'
      });
      setIsGeneratingSoap(false);
    }, 800);
  };

  const handleCopySoap = () => {
    const text = `[CLINICAL ETHOLOGY SOAP NOTE]\n\nSUBJECTIVE:\n${generatedSoap.subjective}\n\nOBJECTIVE:\n${generatedSoap.objective}\n\nASSESSMENT:\n${generatedSoap.assessment}\n\nPLAN:\n${generatedSoap.plan}`;
    navigator.clipboard.writeText(text);
    setCopiedSoap(true);
    setTimeout(() => setCopiedSoap(false), 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1A1A1A]/20 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-extrabold bg-[#1A1A1A] text-white">
              AWS TRUSTED ARCHITECTURE
            </span>
            <span className="text-xs font-mono text-stone-500">
              STRANDS &amp; AGENTCORE MULTI-TRACK HUB
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif italic font-light text-[#1A1A1A] mt-1">
            AgentCore Strands Workspace
          </h1>
          <p className="text-xs sm:text-sm font-mono text-stone-600 max-w-3xl mt-1">
            Specialized multi-agent execution tracks: Track A Everyday Silent Guardian, Track B Clinical Veterinary SOAP Co-Pilot, and Track C Community Pet Safety Mesh.
          </p>
        </div>

        {/* Track Selector Buttons */}
        <div className="flex bg-white p-1 rounded-xl border border-[#1A1A1A] shadow-xs">
          <button
            onClick={() => setActiveTrack('trackA')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
              activeTrack === 'trackA' ? 'bg-[#1A1A1A] text-white' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Track A: Everyday
          </button>
          <button
            onClick={() => setActiveTrack('trackB')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
              activeTrack === 'trackB' ? 'bg-[#1A1A1A] text-white' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Track B: Clinical SOAP
          </button>
          <button
            onClick={() => setActiveTrack('trackC')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
              activeTrack === 'trackC' ? 'bg-[#1A1A1A] text-white' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Track C: Good Neighbor
          </button>
        </div>
      </div>

      {/* TRACK A: EVERYDAY AGENTS */}
      {activeTrack === 'trackA' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-[#1A1A1A] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#1A1A1A]">
                  Track A: Silent Home Guardian (99.4% Background Resolution)
                </h2>
              </div>
              <span className="text-xs font-mono bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded font-bold">
                0 User Interruptions Today
              </span>
            </div>

            <p className="text-xs font-mono text-stone-600 leading-relaxed">
              The Everyday Agent runs continuously on ambient edge hardware. When transient acoustic or environmental triggers occur (e.g., neighbor lawnmowers, Amazon delivery vans), it automatically deploys harmonic micro-adjustments without pinging the guardian.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#FAF9F6] border border-stone-200 space-y-2 font-mono text-xs">
                <div className="flex justify-between items-center text-stone-500 text-[10px]">
                  <span>AGENT INSTANCE</span>
                  <span className="text-emerald-600 font-bold">ACTIVE</span>
                </div>
                <div className="font-bold text-stone-900">Sentinel-Everyday-01</div>
                <div className="text-stone-600 text-[11px]">Monitors ambient dB, room temperature, and door vibration sensors.</div>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF9F6] border border-stone-200 space-y-2 font-mono text-xs">
                <div className="flex justify-between items-center text-stone-500 text-[10px]">
                  <span>INTERVENTION ACCURACY</span>
                  <span className="text-amber-600 font-bold">99.4%</span>
                </div>
                <div className="font-bold text-stone-900">Zero False-Alarm Escapes</div>
                <div className="text-stone-600 text-[11px]">Resolved 18 spikes today within 4.2 seconds average latency.</div>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF9F6] border border-stone-200 space-y-2 font-mono text-xs">
                <div className="flex justify-between items-center text-stone-500 text-[10px]">
                  <span>ENERGY EFFICIENCY</span>
                  <span className="text-sky-600 font-bold">EDGE OPTIMIZED</span>
                </div>
                <div className="font-bold text-stone-900">0.8W Standby Draw</div>
                <div className="text-stone-600 text-[11px]">Runs locally on embedded NPU with cloud fallback on Gemini 3.7.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TRACK B: PROFESSIONAL CLINICAL SOAP AGENTS */}
      {activeTrack === 'trackB' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left: Raw Clinical Observations Input */}
          <div className="p-6 rounded-2xl bg-white border border-[#1A1A1A] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2">
                <Stethoscope className="w-5 h-5 text-indigo-600" />
                <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#1A1A1A]">
                  Track B: Veterinary Clinical Intake
                </h2>
              </div>
              <span className="text-xs font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-bold">
                HL7 FHIR &amp; SOAP
              </span>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold text-stone-700">
                Ethology Observation Log / Behavioral Transcription:
              </label>
              <textarea
                rows={7}
                value={soapObservations}
                onChange={(e) => setSoapObservations(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-[#FAF9F6] border border-stone-300 font-mono text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1A1A1A]"
                placeholder="Enter raw behavioral observations, trigger cues, postural reactions..."
              />
            </div>

            <button
              onClick={handleGenerateSoap}
              disabled={isGeneratingSoap}
              className="w-full py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-stone-800 text-white font-mono font-bold text-xs flex items-center justify-center space-x-2 transition shadow-xs disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{isGeneratingSoap ? 'Synthesizing Clinical SOAP...' : 'Generate Structured SOAP Note'}</span>
            </button>
          </div>

          {/* Right: Structured SOAP Output */}
          <div className="p-6 rounded-2xl bg-white border border-[#1A1A1A] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-stone-800" />
                <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#1A1A1A]">
                  Structured Clinical SOAP Record
                </h2>
              </div>
              <button
                onClick={handleCopySoap}
                className="flex items-center space-x-1 px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-mono font-bold transition"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedSoap ? 'Copied!' : 'Copy SOAP'}</span>
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs text-stone-800 bg-[#FAF9F6] p-4 rounded-xl border border-stone-200 max-h-[380px] overflow-y-auto">
              <div>
                <span className="font-bold text-stone-900 uppercase text-[11px] block text-indigo-700">
                  [S] Subjective:
                </span>
                <p className="text-stone-700 mt-0.5">{generatedSoap.subjective}</p>
              </div>

              <div className="pt-2 border-t border-stone-200">
                <span className="font-bold text-stone-900 uppercase text-[11px] block text-sky-700">
                  [O] Objective:
                </span>
                <p className="text-stone-700 mt-0.5">{generatedSoap.objective}</p>
              </div>

              <div className="pt-2 border-t border-stone-200">
                <span className="font-bold text-stone-900 uppercase text-[11px] block text-amber-700">
                  [A] Assessment:
                </span>
                <p className="text-stone-700 mt-0.5">{generatedSoap.assessment}</p>
              </div>

              <div className="pt-2 border-t border-stone-200">
                <span className="font-bold text-stone-900 uppercase text-[11px] block text-emerald-700">
                  [P] Plan:
                </span>
                <p className="text-stone-700 mt-0.5 whitespace-pre-line">{generatedSoap.plan}</p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TRACK C: GOOD NEIGHBOR COMMUNITY MESH */}
      {activeTrack === 'trackC' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-[#1A1A1A] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-amber-600" />
                <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#1A1A1A]">
                  Track C: Good Neighbor Community Safety Mesh
                </h2>
              </div>
              <span className="text-xs font-mono bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded font-bold">
                12 Nearby Nodes Connected
              </span>
            </div>

            <p className="text-xs font-mono text-stone-600 leading-relaxed">
              Decentralized peer-to-peer neighborhood mesh sharing canine safety alerts, lost pet coordinate broadcasts, dog park reactivity density ratings, and mutual aid temporary fostering.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 font-mono text-xs">
              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2">
                <div className="flex items-center justify-between text-amber-800 text-[10px] font-bold">
                  <span>LOST PET SWEEP MESH</span>
                  <span>STANDBY</span>
                </div>
                <div className="font-bold text-stone-900">Zero Active Sweeps</div>
                <div className="text-stone-600 text-[11px]">Radius: 1.5 miles. Automated microchip BLE broadcast ready.</div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between text-emerald-800 text-[10px] font-bold">
                  <span>DOG PARK CAPACITY</span>
                  <span>OPTIMAL</span>
                </div>
                <div className="font-bold text-stone-900">Pinecrest Bark Park</div>
                <div className="text-stone-600 text-[11px]">4 dogs present. Low reactivity score (12/100). Safe for Buster.</div>
              </div>

              <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-200 space-y-2">
                <div className="flex items-center justify-between text-sky-800 text-[10px] font-bold">
                  <span>SHELTER MUTUAL AID</span>
                  <span>SYNCED</span>
                </div>
                <div className="font-bold text-stone-900">Local Rescue Roster</div>
                <div className="text-stone-600 text-[11px]">3 foster standby slots available in local radius.</div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
