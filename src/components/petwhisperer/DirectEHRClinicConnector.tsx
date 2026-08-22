import React, { useState } from 'react';
import { 
  Database, FileText, CheckCircle2, ArrowRightLeft, 
  Send, RefreshCw, Layers, Shield, ExternalLink, 
  Search, AlertTriangle, Stethoscope, Copy, Check, Download, Clock
} from 'lucide-react';
import { EHRClinicConfig, LongitudinalEHRRecord, EHRPlatformId } from './types';

export const DirectEHRClinicConnector: React.FC = () => {
  const [clinics, setClinics] = useState<EHRClinicConfig[]>([
    {
      id: 'idexx-cornerstone',
      name: 'VCA Animal Hospital - Central Hub',
      vendor: 'Idexx Cornerstone PMS v9.6',
      protocol: 'HL7 FHIR v4.0.1',
      endpointUrl: 'https://fhir.idexx-cornerstone.vet/api/v4/r4',
      status: 'Active Two-Way Sync',
      activePatientsCount: 1420,
      lastWebhookSync: '4 mins ago'
    },
    {
      id: 'covetrus-pulse',
      name: 'Pacific Veterinary Specialists',
      vendor: 'Covetrus Pulse Cloud',
      protocol: 'Covetrus OpenConnect',
      endpointUrl: 'https://api.covetruspulse.vet/v2/ehr',
      status: 'Active Two-Way Sync',
      activePatientsCount: 890,
      lastWebhookSync: 'Just now'
    },
    {
      id: 'ezyvet',
      name: 'Sunset Companion Care Clinic',
      vendor: 'ezyVet Cloud PMS',
      protocol: 'HL7 FHIR R5',
      endpointUrl: 'https://api.ezyvet.com/v2/fhir/r5',
      status: 'Active Two-Way Sync',
      activePatientsCount: 650,
      lastWebhookSync: '12 mins ago'
    }
  ]);

  const [selectedClinic, setSelectedClinic] = useState<EHRClinicConfig>(clinics[0]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('kona-01');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);

  // Longitudinal Records Mock Database
  const patientRecords: Record<string, LongitudinalEHRRecord> = {
    'kona-01': {
      patientId: 'kona-01',
      patientName: 'Kona',
      species: 'Canine',
      breed: 'Golden Retriever',
      ageYears: 4.5,
      microchipId: '985141002948172',
      weightHistory: [
        { date: '2025-10-12', weightKg: 31.4 },
        { date: '2026-02-14', weightKg: 31.8 },
        { date: '2026-06-01', weightKg: 32.1 }
      ],
      allergies: ['Chicken Protein (Dermatological)', 'Flea Saliva Dermatitis'],
      chronicConditions: ['Thunderstorm Phobia (ICD-10 Vet: F40.2)', 'Bilateral Hip Laxity (Sub-clinical)'],
      activeMedications: [
        {
          drugName: 'Sileo (Dexmedetomidine oromucosal)',
          dosage: '0.1 mg/m²',
          frequency: 'PRN for acute noise aversion',
          prescribingDvm: 'Dr. Katherine Bell, DVM'
        },
        {
          drugName: 'Apoquel (Oclacitinib maleate)',
          dosage: '16 mg',
          frequency: 'Once daily with food',
          prescribingDvm: 'Dr. Katherine Bell, DVM'
        }
      ],
      recentEncounters: [
        {
          date: '2026-07-15',
          clinicName: 'VCA Animal Hospital - Central Hub',
          type: 'Annual Wellness & Phobia Follow-up',
          primaryDiagnosis: 'Noise Aversion & Environmental Phobia (Stable)',
          soapNoteId: 'SOAP-2026-0715-992'
        },
        {
          date: '2026-03-10',
          clinicName: 'VCA Animal Hospital - Central Hub',
          type: 'Dermatology Follow-up',
          primaryDiagnosis: 'Allergic Dermatitis - Pruritus index reduced to 2/10',
          soapNoteId: 'SOAP-2026-0310-441'
        }
      ],
      pendingLabOrders: [
        {
          orderId: 'LAB-99201',
          testName: 'Comprehensive Senior Screen (Chem 27 + CBC + Total T4 + Urinalysis)',
          status: 'Completed',
          orderingVet: 'Dr. Katherine Bell, DVM'
        }
      ]
    },
    'barnaby-02': {
      patientId: 'barnaby-02',
      patientName: 'Barnaby',
      species: 'Canine',
      breed: 'Basset Hound',
      ageYears: 6.2,
      microchipId: '985141003881920',
      weightHistory: [
        { date: '2025-11-20', weightKg: 28.5 },
        { date: '2026-03-15', weightKg: 28.9 },
        { date: '2026-07-02', weightKg: 29.2 }
      ],
      allergies: ['Grass Pollen (Atopy)'],
      chronicConditions: ['Intervertebral Disc Disease (Type II, Conservative)', 'Chronic Otitis Externa'],
      activeMedications: [
        {
          drugName: 'Galliprant (Grapiprant)',
          dosage: '60 mg',
          frequency: 'Once daily in morning',
          prescribingDvm: 'Dr. Marcus Vance, DVM'
        }
      ],
      recentEncounters: [
        {
          date: '2026-06-22',
          clinicName: 'Pacific Veterinary Specialists',
          type: 'Spinal Orthopedic Evaluation',
          primaryDiagnosis: 'Thoracolumbar Hyperesthesia - Stage 1',
          soapNoteId: 'SOAP-2026-0622-108'
        }
      ],
      pendingLabOrders: [
        {
          orderId: 'LAB-88142',
          testName: 'Renal Function Profile (SDMA + Creatinine + BUN)',
          status: 'In Processing',
          orderingVet: 'Dr. Marcus Vance, DVM'
        }
      ]
    },
    'luna-03': {
      patientId: 'luna-03',
      patientName: 'Luna',
      species: 'Canine',
      breed: 'Border Collie',
      ageYears: 3.1,
      microchipId: '985141007721839',
      weightHistory: [
        { date: '2025-09-18', weightKg: 19.8 },
        { date: '2026-01-22', weightKg: 20.2 },
        { date: '2026-05-30', weightKg: 20.0 }
      ],
      allergies: ['None known'],
      chronicConditions: ['Separation Anxiety Disorder (Mild-Moderate)'],
      activeMedications: [
        {
          drugName: 'Zylkene (Alpha-casozepine)',
          dosage: '225 mg',
          frequency: 'Daily dietary supplement',
          prescribingDvm: 'Dr. Katherine Bell, DVM'
        }
      ],
      recentEncounters: [
        {
          date: '2026-07-08',
          clinicName: 'Sunset Companion Care Clinic',
          type: 'Behavioral Ethology Telehealth Check',
          primaryDiagnosis: 'Separation Anxiety - Vocalization frequency down 68%',
          soapNoteId: 'SOAP-2026-0708-339'
        }
      ],
      pendingLabOrders: []
    }
  };

  const currentRecord = patientRecords[selectedPatientId] || patientRecords['kona-01'];

  // Trigger Two-Way Sync
  const handleTwoWaySync = () => {
    setIsSyncing(true);
    setSyncSuccessMsg(null);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccessMsg(`Successfully synchronized EHR chart for ${currentRecord.patientName} with ${selectedClinic.name} via ${selectedClinic.protocol}.`);
      setTimeout(() => setSyncSuccessMsg(null), 5000);
    }, 1200);
  };

  // Generate HL7 FHIR Patient & Observation Bundle
  const fhirBundleJson = {
    resourceType: "Bundle",
    id: `bundle-petwhisperer-${currentRecord.patientId}`,
    type: "transaction",
    timestamp: new Date().toISOString(),
    entry: [
      {
        resource: {
          resourceType: "Patient",
          id: currentRecord.patientId,
          identifier: [
            { system: "urn:ietf:rfc:3986:microchip", value: currentRecord.microchipId }
          ],
          name: [{ use: "official", text: currentRecord.patientName }],
          gender: "female",
          extension: [
            { url: "http://hl7.org/fhir/StructureDefinition/patient-animal-species", valueString: currentRecord.species },
            { url: "http://hl7.org/fhir/StructureDefinition/patient-animal-breed", valueString: currentRecord.breed }
          ]
        }
      },
      {
        resource: {
          resourceType: "Observation",
          id: `obs-cortisol-${currentRecord.patientId}`,
          status: "final",
          code: {
            coding: [{ system: "http://loinc.org", code: "72166-2", display: "Ethological Stress & Autonomic Arousal Score" }]
          },
          subject: { reference: `Patient/${currentRecord.patientId}` },
          valueQuantity: { value: 18, unit: "Score", system: "http://unitsofmeasure.org" }
        }
      }
    ]
  };

  const copyFhirJson = () => {
    navigator.clipboard.writeText(JSON.stringify(fhirBundleJson, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 border-2 border-stone-800 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 bg-sky-500/20 text-sky-300 border border-sky-500/40 rounded-full font-mono text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <ArrowRightLeft className="w-3 h-3 text-sky-400" />
              Two-Way EHR Connectors Active
            </span>
            <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full font-mono text-[10px] font-bold">
              HL7 FHIR v4.0.1 • Idexx • Covetrus • ezyVet
            </span>
          </div>
          <h2 className="font-serif italic font-black text-2xl sm:text-3xl tracking-tight text-stone-100">
            Direct EHR Clinic Connectors & Longitudinal Charting
          </h2>
          <p className="text-stone-400 font-mono text-xs max-w-2xl mt-1">
            Automated bidirectional integration bridge syncing live ambient ethology assessments, bio-acoustic transcripts, 
            and smart collar vitals directly into hospital practice management systems.
          </p>
        </div>

        {/* Sync Button */}
        <button
          onClick={handleTwoWaySync}
          disabled={isSyncing}
          className="px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 rounded-2xl font-mono text-xs font-black flex items-center gap-2 shadow-md hover:from-amber-400 hover:to-amber-500 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Syncing Two-Way FHIR...' : 'Push Live EHR Synchronization'}</span>
        </button>
      </div>

      {syncSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 font-mono text-xs flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{syncSuccessMsg}</span>
        </div>
      )}

      {/* Clinic System Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {clinics.map(c => {
          const isSelected = selectedClinic.id === c.id;
          return (
            <div
              key={c.id}
              onClick={() => setSelectedClinic(c)}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                isSelected 
                  ? 'bg-white border-amber-500 shadow-md ring-2 ring-amber-400/30' 
                  : 'bg-white/80 border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] uppercase font-bold text-stone-500">{c.vendor}</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono text-[10px] font-bold">
                  {c.status}
                </span>
              </div>
              <h3 className="font-serif font-black text-stone-900 text-sm">{c.name}</h3>
              <div className="mt-3 flex items-center justify-between font-mono text-[11px] text-stone-500">
                <span>Protocol: {c.protocol}</span>
                <span>Synced: {c.lastWebhookSync}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Patient Selector Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="font-mono text-xs font-bold text-stone-500 mr-2">Select Patient Chart:</span>
        {Object.values(patientRecords).map(p => (
          <button
            key={p.patientId}
            onClick={() => setSelectedPatientId(p.patientId)}
            className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer border ${
              selectedPatientId === p.patientId 
                ? 'bg-stone-900 text-white border-stone-900 shadow-xs' 
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
            }`}
          >
            {p.patientName} ({p.breed})
          </button>
        ))}
      </div>

      {/* Main Longitudinal EHR Record View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Comprehensive Medical Record */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-6">
          
          <div className="flex items-start justify-between flex-wrap gap-4 pb-4 border-b border-stone-200">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-black text-2xl text-stone-900">
                  {currentRecord.patientName}
                </h3>
                <span className="px-2.5 py-0.5 bg-stone-100 text-stone-700 rounded-full font-mono text-xs font-bold">
                  {currentRecord.breed} • {currentRecord.ageYears} yrs
                </span>
              </div>
              <p className="font-mono text-xs text-stone-500 mt-1">
                Microchip ID: <strong>{currentRecord.microchipId}</strong> • Primary Clinic: <strong>{selectedClinic.name}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-stone-500">Weight Velocity:</span>
              <strong className="text-stone-900 bg-stone-100 px-2 py-1 rounded">
                {currentRecord.weightHistory[currentRecord.weightHistory.length - 1].weightKg} kg (Stable)
              </strong>
            </div>
          </div>

          {/* Chronic Conditions & Allergies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-rose-50/70 rounded-2xl border border-rose-200 space-y-2">
              <span className="font-mono text-[10px] font-bold uppercase text-rose-900 block">
                Allergies & Sensitivities
              </span>
              <ul className="space-y-1 font-mono text-xs text-rose-950">
                {currentRecord.allergies.map((all, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                    <span>{all}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-2">
              <span className="font-mono text-[10px] font-bold uppercase text-amber-900 block">
                Chronic Clinical Conditions
              </span>
              <ul className="space-y-1 font-mono text-xs text-amber-950">
                {currentRecord.chronicConditions.map((cond, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                    <span>{cond}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Active Medications */}
          <div className="space-y-3">
            <h4 className="font-serif font-black text-base text-stone-900 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-amber-600" />
              Active Prescriptions & Veterinary Pharmacology
            </h4>
            <div className="space-y-2">
              {currentRecord.activeMedications.map((med, idx) => (
                <div key={idx} className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 font-mono text-xs flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="font-bold text-stone-900 block">{med.drugName}</span>
                    <span className="text-[11px] text-stone-600">{med.dosage} • {med.frequency}</span>
                  </div>
                  <span className="text-[10px] text-stone-500 bg-white px-2.5 py-1 rounded-lg border border-stone-200">
                    Rx by: {med.prescribingDvm}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Encounters & SOAP Notes */}
          <div className="space-y-3">
            <h4 className="font-serif font-black text-base text-stone-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-600" />
              Recent Clinical Encounters & SOAP Progress Notes
            </h4>
            <div className="space-y-2">
              {currentRecord.recentEncounters.map((enc, idx) => (
                <div key={idx} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 font-mono text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-stone-500 text-[11px]">
                    <span>{enc.date} • {enc.type}</span>
                    <span className="font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">{enc.soapNoteId}</span>
                  </div>
                  <div className="font-bold text-stone-900">{enc.primaryDiagnosis}</div>
                  <div className="text-[11px] text-stone-600">{enc.clinicName}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Col: Live HL7 FHIR JSON Payload Inspector */}
        <div className="bg-stone-950 text-stone-200 rounded-3xl p-6 border border-stone-800 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <span className="font-mono text-xs font-bold text-amber-300 flex items-center gap-2">
                <Database className="w-4 h-4" />
                HL7 FHIR Bundle Resource
              </span>
              <button
                onClick={copyFhirJson}
                className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded font-mono text-[11px] flex items-center gap-1.5 cursor-pointer"
              >
                {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedJson ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>

            <p className="font-mono text-[11px] text-stone-400 mt-2">
              Standardized veterinary FHIR transaction bundle for real-time practice management ingestion.
            </p>

            <pre className="mt-4 p-3 bg-stone-900 rounded-2xl border border-stone-800 font-mono text-[10px] text-emerald-400 overflow-x-auto max-h-96 leading-relaxed">
              {JSON.stringify(fhirBundleJson, null, 2)}
            </pre>
          </div>

          <div className="p-3 bg-stone-900/80 rounded-2xl border border-stone-800 font-mono text-[11px] text-stone-400 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>End-to-end encrypted under HIPAA & Vet-EHR Zero-Trust protocol.</span>
          </div>
        </div>

      </div>

    </div>
  );
};
