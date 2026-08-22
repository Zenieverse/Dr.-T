import React, { useState, useRef } from 'react';
import { 
  Sparkles, Eye, Volume2, Activity, Play, Pause, 
  Upload, RefreshCw, CheckCircle2, ChevronRight, AlertCircle, Info, Brain
} from 'lucide-react';
import { TargetSpecies, SpeciesEthogramSpec, CrossSpeciesAnalysisResult } from './types';

export const CrossSpeciesEthology: React.FC = () => {
  const [selectedSpecies, setSelectedSpecies] = useState<TargetSpecies>('feline');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [activeAudioPlaying, setActiveAudioPlaying] = useState<number | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  // Species Specifications
  const speciesSpecs: Record<TargetSpecies, SpeciesEthogramSpec> = {
    feline: {
      id: 'feline',
      name: 'Domestic Feline',
      scientificName: 'Felis catus',
      facsStandard: 'CatFACS (Feline Facial Action Coding System)',
      keyActionUnits: ['EAD101 (Ear Flattener)', 'EAD102 (Ear Rotator/Swivel)', 'AU109 (Mydriatic Pupil Dilation)', 'AU143 (Slow Eye Blink)', 'EAU1 (Whisker Protraction)'],
      acousticVocalizationRange: '25 Hz (Healing Purr) - 2.4 kHz (Distress Caterwaul)',
      restFrequencyTargetHz: 528,
      commonStressIndicators: ['Swiveling flattened ears (Airplane Ears)', 'Pupil mydriasis (dark wide irises)', 'Tail flick velocity acceleration', 'Whisker retraction against cheek']
    },
    canine: {
      id: 'canine',
      name: 'Domestic Canine',
      scientificName: 'Canis lupus familiaris',
      facsStandard: 'DogFACS (Canine Facial Action Coding System)',
      keyActionUnits: ['EAD101 (Ear Pinna Flattening)', 'AU125 (Commissure Retraction)', 'AU101 (Inner Brow Raiser)', 'AU109 (Sclera Exposure / Whale Eye)'],
      acousticVocalizationRange: '80 Hz (Low Growl) - 3.8 kHz (Separation Whine)',
      restFrequencyTargetHz: 432,
      commonStressIndicators: ['Sclera whale eye exposure', 'Excessive lip licking in absence of food', 'Stiff spinal rigidity vector', 'Yawning under environmental arousal']
    },
    equine: {
      id: 'equine',
      name: 'Domestic Equine',
      scientificName: 'Equus caballus',
      facsStandard: 'EquiFACS (Equine Facial Action Coding System)',
      keyActionUnits: ['EAD101 (Ear Pinna Asymmetry)', 'AD101 (Nostril Dilater & Flaring)', 'AU145 (Upper Lid Eye Wrinkle Shape)', 'AU117 (Chin Tension / Hypertonicity)'],
      acousticVocalizationRange: '150 Hz (Low Nicker) - 1.8 kHz (High Alarm Whinny)',
      restFrequencyTargetHz: 639,
      commonStressIndicators: ['Tight triangular eye wrinkles', 'Flared rigid nostrils with audible blow', 'Asymmetric pinned ears', 'Elevated high cervical head carriage']
    },
    avian: {
      id: 'avian',
      name: 'Companion Psittacine & Songbird',
      scientificName: 'Psittaciformes / Nymphicus hollandicus',
      facsStandard: 'Avian Ethogram & Postural Action System',
      keyActionUnits: ['AF-01 (Crest Feather Elevation)', 'AF-02 (Pupil Pinning & Rapid Contraction)', 'AF-03 (Beak Clicking Hypertonus)', 'AF-04 (Carpal Joint Wing Flaring)'],
      acousticVocalizationRange: '800 Hz (Contact Whistle) - 7.5 kHz (Panic Screech)',
      restFrequencyTargetHz: 741,
      commonStressIndicators: ['Rapid pupil pinning without vocal chatter', 'Hyper-elevated crest with rigid stance', 'Wing drooping or trembling', 'Repetitive displacement feather plucking']
    }
  };

  // Pre-loaded Species Analysis Presets
  const speciesAnalyses: Record<TargetSpecies, CrossSpeciesAnalysisResult> = {
    feline: {
      species: 'feline',
      subjectName: 'Milo (Scottish Fold Mix, 3 yrs)',
      facsFramework: 'CatFACS Ethology Engine',
      valenceClassification: 'Acute Sensory Overload / Territorial Hyper-Vigilance',
      confidenceScore: 97.4,
      actionUnitsDetected: [
        { code: 'EAD101', name: 'Ear Flattener (Airplane Ears)', intensity: 4, description: 'Bilateral auricle rotation posterolaterally to 72° angle.' },
        { code: 'AU109', name: 'Mydriatic Pupil Dilation', intensity: 5, description: 'Pupil-to-iris diameter ratio elevated to 0.88 under photopic lighting.' },
        { code: 'EAU1', name: 'Whisker Retraction', intensity: 3, description: 'Mystacial vibrissae pulled tightly against buccal tissue.' }
      ],
      acousticProfile: {
        primaryVocalization: 'Low-Frequency Agitated Trill into Hiss',
        f0FundamentalHz: 480,
        harmonicEnergy: 'High high-frequency noise ratio',
        distressProbability: 86
      },
      ethologicalConclusion: 'Subject exhibits sympathetic autonomic surge triggered by novel auditory disturbance. High feline cortisol risk.',
      recommendedCarePlan: 'Deploy 528Hz Purr-Harmonic Solfeggio soothing frequency. Dim ambient luminance below 150 lux and establish elevated safe vertical perch.'
    },
    canine: {
      species: 'canine',
      subjectName: 'Kona (Golden Retriever, 4 yrs)',
      facsFramework: 'DogFACS Ethology Engine',
      valenceClassification: 'High Vigilance / Thunderstorm Distress',
      confidenceScore: 98.2,
      actionUnitsDetected: [
        { code: 'AU109', name: 'Sclera Whale Eye', intensity: 4, description: 'Lateral orbital rotation exposing 4.2mm temporal scleral crescent.' },
        { code: 'EAD101', name: 'Ear Pinna Flattening', intensity: 3, description: 'Bilateral caudal ear retraction against occiput.' },
        { code: 'AU125', name: 'Lip Commissure Retraction', intensity: 2, description: 'Tension across zygomaticus muscle without dental display.' }
      ],
      acousticProfile: {
        primaryVocalization: 'Separation Anxiety Whine (Sub-harmonic modulation)',
        f0FundamentalHz: 920,
        harmonicEnergy: 'Harmonic Noise Ratio (HNR) 14.2 dB',
        distressProbability: 91
      },
      ethologicalConclusion: 'Canine exhibits phobic autonomic arousal with sympathetic cardiac elevation (HRV RMSSD suppressed).',
      recommendedCarePlan: 'Execute 432Hz Alpha wave acoustic soothing protocol. Apply gentle bilateral thoracic compression (ThunderShirt pressure profile).'
    },
    equine: {
      species: 'equine',
      subjectName: 'Sterling (Warmblood Gelding, 8 yrs)',
      facsFramework: 'EquiFACS Ethology Engine',
      valenceClassification: 'Moderate Pain / Gastrointestinal Colic Discomfort',
      confidenceScore: 94.6,
      actionUnitsDetected: [
        { code: 'AU145', name: 'Triangular Eye Wrinkle (H-Angle)', intensity: 4, description: 'Significant contraction of levator anguli oculi medialis producing pronounced dorsal skin creases.' },
        { code: 'AD101', name: 'Rigid Nostril Dilatation', intensity: 3, description: 'Transverse nostril flattening with hyper-extended alar cartilage.' },
        { code: 'EAD101', name: 'Asymmetrical Caudal Ear Swivel', intensity: 3, description: 'Left ear pinned caudal-laterally while right ear remains exploratory.' }
      ],
      acousticProfile: {
        primaryVocalization: 'Suppressed Gut-Groan / Low Guttural Nicker',
        f0FundamentalHz: 195,
        harmonicEnergy: 'Suppressed harmonic harmonics',
        distressProbability: 88
      },
      ethologicalConclusion: 'EquiFACS indicators reflect visceral abdominal distress consistent with early-stage colic. Non-verbal pain score: 6/10.',
      recommendedCarePlan: 'Alert on-duty Equine DVM for physical auscultation of all 4 abdominal quadrants. Withhold concentrates and initiate 639Hz Herd Harmonic tone.'
    },
    avian: {
      species: 'avian',
      subjectName: 'Zephyr (Cockatiel, 2 yrs)',
      facsFramework: 'Avian Ethogram & Postural Engine',
      valenceClassification: 'Acute Panic / Night Fright Dysregulation',
      confidenceScore: 96.1,
      actionUnitsDetected: [
        { code: 'AF-01', name: 'Crest Feather Hyper-Elevation', intensity: 5, description: 'Crown crest feathers raised perpendicular to 90° angle.' },
        { code: 'AF-02', name: 'Rapid Pupil Pinning', intensity: 4, description: 'Bilateral rapid pupillary constriction independent of ambient lumens.' },
        { code: 'AF-04', name: 'Carpal Joint Wing Flaring', intensity: 3, description: 'Bilateral primary flight feathers held 15mm away from flank tissue.' }
      ],
      acousticProfile: {
        primaryVocalization: 'High-Pitch Panic Squawk',
        f0FundamentalHz: 3450,
        harmonicEnergy: 'High spectral centroid (4.8 kHz peak)',
        distressProbability: 95
      },
      ethologicalConclusion: 'Avian subject experiencing nocturnal spatial panic with high risk of flight feather trauma against enclosure wire.',
      recommendedCarePlan: 'Activate 741Hz Avian Grounding acoustic tone. Provide soft diffuse red spectrum night illumination (630nm) to re-establish spatial landmarks.'
    }
  };

  const [currentAnalysis, setCurrentAnalysis] = useState<CrossSpeciesAnalysisResult>(speciesAnalyses.feline);

  const handleSpeciesChange = (species: TargetSpecies) => {
    setSelectedSpecies(species);
    setIsAnalyzing(true);
    setTimeout(() => {
      setCurrentAnalysis(speciesAnalyses[species]);
      setIsAnalyzing(false);
    }, 600);
  };

  // Play Therapeutic Rest Frequency
  const playRestFrequency = (freq: number) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscRef.current = osc;
      setActiveAudioPlaying(freq);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  };

  const stopRestFrequency = () => {
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch(e) {}
      oscRef.current = null;
    }
    setActiveAudioPlaying(null);
  };

  const currentSpec = speciesSpecs[selectedSpecies];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 border-2 border-stone-800 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full font-mono text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <Brain className="w-3 h-3 text-amber-400" />
              Cross-Species Ethology Model Engine
            </span>
            <span className="px-2.5 py-0.5 bg-sky-500/20 text-sky-300 border border-sky-500/40 rounded-full font-mono text-[10px] font-bold">
              DogFACS • CatFACS • EquiFACS • Avian
            </span>
          </div>
          <h2 className="font-serif italic font-black text-2xl sm:text-3xl tracking-tight text-stone-100">
            Multi-Species Ethological Action Coding & Bio-Acoustics
          </h2>
          <p className="text-stone-400 font-mono text-xs max-w-2xl mt-1">
            Fine-tuned multimodal vision classifiers and bio-acoustic frequency models decoding facial action units, 
            micro-gestures, and vocalizations across Canines, Felines, Equines, and Companion Birds.
          </p>
        </div>

        {/* Play Rest Frequency Control */}
        <div>
          {activeAudioPlaying ? (
            <button
              onClick={stopRestFrequency}
              className="px-4 py-2.5 bg-amber-500 text-stone-950 rounded-2xl font-mono text-xs font-black flex items-center gap-2 shadow-md hover:bg-amber-400 cursor-pointer animate-pulse"
            >
              <Volume2 className="w-4 h-4" />
              <span>Playing {activeAudioPlaying}Hz Tone</span>
            </button>
          ) : (
            <button
              onClick={() => playRestFrequency(currentSpec.restFrequencyTargetHz)}
              className="px-4 py-2.5 bg-stone-800 text-stone-200 border border-stone-700 rounded-2xl font-mono text-xs font-bold flex items-center gap-2 hover:bg-stone-700 cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span>Play {currentSpec.restFrequencyTargetHz}Hz Rest Harmonic</span>
            </button>
          )}
        </div>
      </div>

      {/* 4-Species Target Selector Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(Object.keys(speciesSpecs) as TargetSpecies[]).map(spKey => {
          const spec = speciesSpecs[spKey];
          const isSelected = selectedSpecies === spKey;
          const emojis: Record<TargetSpecies, string> = {
            feline: '🐱',
            canine: '🐶',
            equine: '🐴',
            avian: '🦜'
          };

          return (
            <button
              key={spKey}
              onClick={() => handleSpeciesChange(spKey)}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                isSelected 
                  ? 'bg-white border-amber-500 shadow-md ring-2 ring-amber-400/40' 
                  : 'bg-white/80 border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-2xl">{emojis[spKey]}</span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  isSelected ? 'bg-amber-100 text-amber-900 font-black' : 'bg-stone-100 text-stone-600'
                }`}>
                  {spec.restFrequencyTargetHz} Hz
                </span>
              </div>
              <h3 className="font-serif font-black text-sm text-stone-900">{spec.name}</h3>
              <p className="font-mono text-[10px] text-stone-500 italic truncate">{spec.scientificName}</p>
            </button>
          );
        })}
      </div>

      {/* Main Analysis Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Ethological Standard & Action Units (FACS) */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-5">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
              {currentSpec.facsStandard}
            </span>
            <h3 className="font-serif font-black text-lg text-stone-900 mt-2">
              Action Units & Micro-Expression Codes
            </h3>
            <p className="font-mono text-xs text-stone-500">
              Anatomically verified muscle action units mapped into fine-tuned vision weights
            </p>
          </div>

          <div className="space-y-3">
            {currentSpec.keyActionUnits.map((au, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-stone-50 border border-stone-200 font-mono text-xs flex items-center justify-between">
                <span className="font-bold text-stone-900">{au}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
            ))}
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
            <h4 className="font-mono text-xs font-bold text-stone-900 uppercase">
              Acoustic Vocalization Band
            </h4>
            <p className="font-mono text-xs text-stone-600">{currentSpec.acousticVocalizationRange}</p>
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
            <h4 className="font-mono text-xs font-bold text-amber-950 uppercase flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              Key Physical Stress Markers
            </h4>
            <ul className="space-y-1 font-mono text-[11px] text-amber-900">
              {currentSpec.commonStressIndicators.map((ind, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-amber-500">•</span>
                  <span>{ind}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Middle & Right 2 Cols: Live Triage & Real-Time Multimodal Assessment */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="font-serif font-black text-lg text-stone-900 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-amber-600" />
                  Multimodal Telemetry & FACS Analysis
                </h3>
                <p className="font-mono text-xs text-stone-500">
                  Subject: <strong className="text-stone-900">{currentAnalysis.subjectName}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-900 rounded-xl">
                  Confidence: {currentAnalysis.confidenceScore}%
                </span>
              </div>
            </div>

            {/* Valence Classification Card */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1">
              <span className="font-mono text-[10px] font-bold uppercase text-amber-800">
                Emotional Valence & Ethogram Status
              </span>
              <h4 className="font-serif font-black text-base text-stone-900">
                {currentAnalysis.valenceClassification}
              </h4>
            </div>

            {/* Detected Action Units */}
            <div className="space-y-3">
              <h4 className="font-mono text-xs font-bold text-stone-700 uppercase tracking-wider">
                Micro-Expressions & Muscle Action Units Detected
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {currentAnalysis.actionUnitsDetected.map(au => (
                  <div key={au.code} className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black text-stone-900">{au.code}</span>
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-rose-100 text-rose-800 rounded">
                        Intensity: {au.intensity}/5
                      </span>
                    </div>
                    <span className="font-mono text-xs font-bold text-stone-800 block">{au.name}</span>
                    <p className="font-mono text-[11px] text-stone-600">{au.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Acoustic Profile */}
            {currentAnalysis.acousticProfile && (
              <div className="p-4 bg-stone-950 text-white rounded-2xl border border-stone-800 space-y-2">
                <div className="flex items-center justify-between font-mono text-xs text-stone-400">
                  <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                    <Volume2 className="w-4 h-4 text-amber-400" />
                    Acoustic Vocalization Spectral Profile
                  </span>
                  <span>F0 Fundamental: {currentAnalysis.acousticProfile.f0FundamentalHz} Hz</span>
                </div>
                <div className="font-serif font-black text-sm text-stone-100">
                  {currentAnalysis.acousticProfile.primaryVocalization}
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-stone-400">
                  <span>{currentAnalysis.acousticProfile.harmonicEnergy}</span>
                  <span className="text-rose-400 font-bold">Distress Probability: {currentAnalysis.acousticProfile.distressProbability}%</span>
                </div>
              </div>
            )}

            {/* Ethological Conclusion & Care Plan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                <span className="font-bold text-stone-500 uppercase text-[10px]">Ethological Conclusion</span>
                <p className="text-stone-800 leading-relaxed">{currentAnalysis.ethologicalConclusion}</p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
                <span className="font-bold text-emerald-800 uppercase text-[10px]">Autonomous Care Plan</span>
                <p className="text-emerald-950 leading-relaxed">{currentAnalysis.recommendedCarePlan}</p>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
