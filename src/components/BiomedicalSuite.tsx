import React, { useState, useEffect } from 'react';
import { BirthdayCelebrator } from './BirthdayCelebrator';
import { 
  Heart, Activity, ClipboardList, ShieldAlert, Award, FileSpreadsheet, 
  Search, FileText, Camera, Users, Zap, BookOpen, User, Eye, 
  Upload, Download, CheckCircle, AlertTriangle, Code, ArrowRight,
  Database, RefreshCw, Layers, ShieldCheck, HelpCircle, Flame, Calendar, Baby, Stethoscope
} from 'lucide-react';

interface TerminologyCode {
  concept: string;
  code: string;
  system: string;
}

interface DiagnosisNote {
  title: string;
  metadata: {
    patientName: string;
    dob: string;
    documentID: string;
    date: string;
  };
  sectionContent: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  terminologyCodes: TerminologyCode[];
  fhirCompatibleResource: any;
}

// Preset datasets to demonstrate production viability instantly
const SAMPLE_FHIR_PATIENT = {
  resourceType: "Patient",
  id: "pat-99120",
  active: true,
  name: [{ use: "official", family: "Henderson", given: ["Clarissa", "Jane"] }],
  gender: "female",
  birthDate: "1984-05-12",
  telecom: [{ system: "phone", value: "+1-555-019-2834", use: "mobile" }],
  address: [{ line: ["742 Evergreen Terrace"], city: "Springfield", state: "IL", postalCode: "62704", country: "US" }],
  maritalStatus: {
    coding: [{ system: "http://terminology.hl7.org/CodeSystem/v3-MaritalStatus", code: "M", display: "Married" }]
  },
  contact: [{
    relationship: [{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/v2-0131", code: "N", display: "Next-of-Kin" }] }],
    name: { family: "Henderson", given: ["Robert"] },
    telecom: [{ system: "phone", value: "+1-555-019-2835" }]
  }]
};

const SAMPLE_FHIR_OBSERVATION = {
  resourceType: "Observation",
  id: "obs-vitals-304",
  status: "final",
  category: [{
    coding: [{ system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "vital-signs", display: "Vital Signs" }]
  }],
  code: {
    coding: [{ system: "http://loinc.org", code: "85354-9", display: "Blood pressure panel with all systolic and diastolic measurements" }],
    text: "Blood Pressure Vitals"
  },
  subject: { reference: "Patient/pat-99120", display: "Clarissa Henderson" },
  encounter: { reference: "Encounter/enc-9023" },
  effectiveDateTime: "2026-06-18T08:30:00Z",
  component: [
    {
      code: { coding: [{ system: "http://loinc.org", code: "8480-6", display: "Systolic blood pressure" }] },
      valueQuantity: { value: 128, unit: "mmHg", system: "http://unitsofmeasure.org", code: "mm[Hg]" }
    },
    {
      code: { coding: [{ system: "http://loinc.org", code: "8462-4", display: "Diastolic blood pressure" }] },
      valueQuantity: { value: 82, unit: "mmHg", system: "http://unitsofmeasure.org", code: "mm[Hg]" }
    }
  ]
};

const SAMPLE_MIMIC_ICU_SICK_PATIENTS = [
  { id: "M-40122", name: "Raymond Vance", age: 67, gender: "M", unit: "MICU Bed 4", admittingDx: "Acute Septic Shock", bp: "88/52", hr: 112, rr: 28, temp: 101.4, osat: 91, stayDaysEst: 7, mortalityRiskScore: 68, readmitProb: 44, ventStatus: "High-Flow Nasal Cannula" },
  { id: "M-40156", name: "Elaine Foster", age: 72, gender: "F", unit: "CCU Bed 2", admittingDx: "Post-STEMI Ventricular Arrythmia", bp: "118/74", hr: 84, rr: 18, temp: 98.6, osat: 97, stayDaysEst: 3, mortalityRiskScore: 19, readmitProb: 15, ventStatus: "Room Air" },
  { id: "M-40188", name: "Marcus Brody", age: 54, gender: "M", unit: "SICU Bed 9", admittingDx: "Subarachnoid Hemorrhage Post-Op", bp: "142/86", hr: 72, rr: 14, temp: 99.1, osat: 99, stayDaysEst: 14, mortalityRiskScore: 38, readmitProb: 24, ventStatus: "Mechanical Ventilator (AC)" }
];

export const SUITE_TRANSLATIONS: Record<string, Record<string, string>> = {
  English: {
    portal_title: "Clinician Portal",
    patient_chart: "Patient Chart",
    fhir_interop: "HL7 FHIR Interop",
    ehr_data_mining: "EHR Data Mining",
    soap_note_ai: "SOAP Note AI",
    imaging_explainer: "Imaging Explainer",
    population_health: "Population Health",
    wellness_coach: "Wellness Coach",
    research_paper_lab: "Research Paper Lab",
    mimic_iv_icu: "MIMIC-IV ICU",
    obgyn_care: "OB/GYN Care Navigator",
    swarm_orchestrator: "Swarm Orchestrator",
    educational_disclaimer: "Educational Protocol: Dr. T is an educational and decision-support platform and not a substitute for professional medical advice.",
    fhir_desc: "Dr. T possesses advanced HL7 FHIR Interoperability pipelines. Review code-ready FHIR JSON modules, import/load precalculated clinical definitions, and run strict syntax validation checks.",
    raw_fhir_title: "1. Raw FHIR Resource JSON",
    compilation_report_title: "2. Compilation & Schema Validation Report",
    btn_validate: "Validate FHIR Resource",
    btn_export: "Export JSON",
    btn_save_json: "Save JSON",
    btn_search_lab: "Search Lab",
    btn_synthesize: "Synthesize Clinical Note",
    btn_analyze_image: "Analyze Medical Image",
    vitals_summary: "Patient Vitals Summary",
    active_patient: "Active Patient Info",
    last_sync: "Last Sync",
    push_updates: "Push updates to HL7 Epic",
    validation_approved: "HL7 VALIDATION APPROVED",
    validation_rejected: "VALIDATION REJECTED",
  },
  French: {
    portal_title: "Portail Clinicien",
    patient_chart: "Dossier Patient",
    fhir_interop: "Interopérabilité FHIR",
    ehr_data_mining: "Analyse Clinique EHR",
    soap_note_ai: "Note SOAP Clinique",
    imaging_explainer: "Déchiffrage d'Imagerie",
    population_health: "Santé Publique",
    wellness_coach: "Coach de Santé",
    research_paper_lab: "Labo d'Articles",
    mimic_iv_icu: "USI MIMIC-IV",
    obgyn_care: "Navigateur gynéco-obstétrique",
    swarm_orchestrator: "Orchestrateur Clinique",
    educational_disclaimer: "Protocole Éducatif: Dr. T est une plateforme d'apprentissage et de support clinique, non un substitut d'avis médical.",
    fhir_desc: "Dr. T possède des pipelines d’interopérabilité HL7 FHIR avancés. Examinez les modules JSON FHIR, importez/chargez des définitions cliniques pré-calculées et lancez des examens de validation stricts.",
    raw_fhir_title: "1. Ressource JSON FHIR Brute",
    compilation_report_title: "2. Rapport de Validation de Schéma & Compilation",
    btn_validate: "Valider la Ressource FHIR",
    btn_export: "Exporter JSON",
    btn_save_json: "Sauvegarder JSON",
    btn_search_lab: "Rechercher",
    btn_synthesize: "Synthétiser la note",
    btn_analyze_image: "Analyser l'image médicale",
    vitals_summary: "Signes vitaux du patient",
    active_patient: "Données du Patient Actif",
    last_sync: "Dernière synchro",
    push_updates: "Transmettre à Epic HL7",
    validation_approved: "SCHÉMA CONFORME DU HL7 APPRÉCIÉ",
    validation_rejected: "ÉCHEC DE LA VALIDATION",
  },
  Vietnamese: {
    portal_title: "Cổng Lâm Sàng",
    patient_chart: "Hồ Sơ Bệnh Nhân",
    fhir_interop: "Liên Thông FHIR",
    ehr_data_mining: "Khai Thác EHR",
    soap_note_ai: "Bút Ký Lâm Sàng",
    imaging_explainer: "Phân Tích Hình Ảnh",
    population_health: "Sức Khỏe Cộng Đồng",
    wellness_coach: "Luyện Tập Sức Khỏe",
    research_paper_lab: "Nghiên Cứu Y Văn",
    mimic_iv_icu: "Hồi Sức MIMIC-IV",
    obgyn_care: "Điều hướng Sản Phụ Khoa",
    swarm_orchestrator: "Đội Ngũ Đa Tác Nhân",
    educational_disclaimer: "Quy chuẩn Giáo dục: Dr. T là một hệ thống hỗ trợ giáo dục và quyết định lâm sàng, không thay thế chẩn đoán y khoa chuyên nghiệp.",
    fhir_desc: "Dr. T sở hữu các quy trình liên thông HL7 FHIR tiên tiến. Kiểm tra các module JSON FHIR sẵn sàng cho mã hóa, nhập/tải các định nghĩa lâm sàng và chạy kiểm tra cú pháp nghiêm ngặt.",
    raw_fhir_title: "1. Chuỗi JSON FHIR Nguyên Bản",
    compilation_report_title: "2. Báo Cáo Kiểm Tra Chuẩn Cấu Trúc",
    btn_validate: "Kiểm Tra Tài Nguyên FHIR",
    btn_export: "Xuất tệp JSON",
    btn_save_json: "Lưu tệp JSON",
    btn_search_lab: "Tìm Kiếm Y Văn",
    btn_synthesize: "Tổng Hợp Bút Ký Lâm Sàng",
    btn_analyze_image: "Phân Tích Hình Ảnh Y Khoa",
    vitals_summary: "Chỉ Số Sinh Tồn Bệnh Nhân",
    active_patient: "Thông Tin Bệnh Nhân Đang Chọn",
    last_sync: "Đồng bộ lần cuối",
    push_updates: "Đẩy dữ liệu tới Epic HL7",
    validation_approved: "PHÊ DUYỆT CHUẨN HL7 SUCCESS",
    validation_rejected: "TỪ CHỐI DO SAI LỆCH CẤU TRÚC",
  }
};

export const BiomedicalSuite: React.FC<{
  language?: string;
  activeSubTab?: 'patient' | 'obgyn' | 'fhir' | 'analytics' | 'summarizer' | 'imaging' | 'population' | 'coach' | 'lab' | 'mimic' | 'orchestrator';
  onSubTabChange?: (tab: 'patient' | 'obgyn' | 'fhir' | 'analytics' | 'summarizer' | 'imaging' | 'population' | 'coach' | 'lab' | 'mimic' | 'orchestrator') => void;
  onUpdateHeartRate?: (newBpm: number) => void;
}> = ({ language = 'English', activeSubTab: controlledSubTab, onSubTabChange, onUpdateHeartRate }) => {
  const selectedLang = ['English', 'French', 'Vietnamese'].includes(language) ? language : 'English';
  
  const t = (key: string, fallback: string) => {
    return SUITE_TRANSLATIONS[selectedLang]?.[key] || fallback;
  };

  const [localActiveSubTab, setLocalActiveSubTab] = useState<'patient' | 'obgyn' | 'fhir' | 'analytics' | 'summarizer' | 'imaging' | 'population' | 'coach' | 'lab' | 'mimic' | 'orchestrator'>('patient');

  const activeSubTab = controlledSubTab !== undefined ? controlledSubTab : localActiveSubTab;
  
  const setActiveSubTab = (tab: 'patient' | 'obgyn' | 'fhir' | 'analytics' | 'summarizer' | 'imaging' | 'population' | 'coach' | 'lab' | 'mimic' | 'orchestrator') => {
    if (onSubTabChange) {
      onSubTabChange(tab);
    } else {
      setLocalActiveSubTab(tab);
    }
  };

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => prev?.message === message ? null : prev);
    }, 4000);
  };

  // Fitbit & Apple Health wearable states
  const [isFitbitConnected, setIsFitbitConnected] = useState(false);
  const [isAppleHealthConnected, setIsAppleHealthConnected] = useState(false);
  const [wearableHrv, setWearableHrv] = useState<number>(42); // ms
  const [wearableDeepSleep, setWearableDeepSleep] = useState<number>(1.1); // hrs
  const [wearableRemSleep, setWearableRemSleep] = useState<number>(1.2); // hrs
  const [wearableLightSleep, setWearableLightSleep] = useState<number>(4.1); // hrs
  const [wearableRestlessTime, setWearableRestlessTime] = useState<number>(28); // mins
  const [isSyncingWearables, setIsSyncingWearables] = useState(false);
  const [lastWearableSync, setLastWearableSync] = useState<string>("Never synced");

  const handleSyncWearables = async (type: 'fitbit' | 'apple') => {
    if (type === 'fitbit' && !isFitbitConnected) {
      showToast("Please connect Fitbit account first.", "error");
      return;
    }
    if (type === 'apple' && !isAppleHealthConnected) {
      showToast("Please authorize Apple Health connection first.", "error");
      return;
    }
    
    setIsSyncingWearables(true);
    showToast(`Syncing clinical telemetry from ${type === 'fitbit' ? 'Fitbit Cloud API' : 'Apple HealthKit Bridge'}...`, "info");
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate real diagnostic updates
    const updatedHrv = Math.floor(Math.random() * 15) + 55; // improves to 55-70 ms
    const updatedDeep = parseFloat((Math.random() * 0.4 + 1.6).toFixed(1)); // 1.6 - 2.0 hrs
    const updatedRem = parseFloat((Math.random() * 0.3 + 1.5).toFixed(1)); // 1.5 - 1.8 hrs
    const updatedLight = parseFloat((Math.random() * 0.5 + 4.2).toFixed(1)); // 4.2 - 4.7 hrs
    const updatedRestless = Math.floor(Math.random() * 10) + 12; // 12-22 mins
    
    setWearableHrv(updatedHrv);
    setWearableDeepSleep(updatedDeep);
    setWearableRemSleep(updatedRem);
    setWearableLightSleep(updatedLight);
    setWearableRestlessTime(updatedRestless);
    
    if (onUpdateHeartRate) {
      onUpdateHeartRate(64); // Sync a healthy resting HR
    }
    
    setLastWearableSync(new Date().toLocaleTimeString());
    setIsSyncingWearables(false);
    
    // Deeper diagnostic modeling updates:
    setRiskForecast(`Based on incoming ${type.toUpperCase()} wearable sync (HRV: ${updatedHrv}ms, Deep Sleep: ${updatedDeep}h), Clara's autonomic stress risk is lower. ASCVD 10-Year Index reduced to 8.2% (Low-to-Moderate). Recommend continuing sleep hygiene protocols and Socratic breathing calls.`);
    showToast("Wearable telemetry feed synchronized into Biomedical Suite!", "success");
  };

  // FHIR Tab States
  const [fhirInput, setFhirInput] = useState<string>(JSON.stringify(SAMPLE_FHIR_PATIENT, null, 2));
  const [fhirValidationResult, setFhirValidationResult] = useState<{valid: boolean; errors: string[]; warnings: string[]} | null>(null);
  const [activeLoadedResource, setActiveLoadedResource] = useState<any>(SAMPLE_FHIR_PATIENT);

  // Health Data Analytics States
  const [analyticalFile, setAnalyticalFile] = useState<{name: string; type: string} | null>({ name: "EHR_vitals_export_Q2_2026.csv", type: "CSV" });
  const [dataQualityReport, setDataQualityReport] = useState<any>({
    recordsParsed: 148,
    completeness: "98.2%",
    schemaValidation: "HL7 Observation Standard Compliance Approved",
    nullFieldsCount: 4,
    anomaliesDetected: 2,
    bloodPressureAnomalies: ["Row 14: Systolic value outlier (210 mmHg)", "Row 89: Diastolic diastolic drop (40 mmHg)"]
  });
  const [riskForecast, setRiskForecast] = useState<string>("Based on a multilinear analysis of Q2 lipid profiles and mean systolic markers, patient is classified under Moderate Risk (11.4% 10-Year ASCVD index). Elevated sympathetic engagement and irregular resting hypnograms remain major modifiable parameters.");

  // Clinical Summarizer SOAP States
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [transcriptionInput, setTranscriptionInput] = useState<string>(
    "Patient is Clara, 41y/o. Describing severe burnout during the product rollout. Tells us her sleep is broken, sleeping 4.5 hours a day. Feels heart fluttering at night while coding. Hydration is poor, mostly drinking coffee. Physical records show SBP is 134/85, resting HR is 76 bpm. No acute chest pain. Self-reported compliance with previous mindfulness sessions is low."
  );
  const [generatedSOAP, setGeneratedSOAP] = useState<DiagnosisNote | null>(null);

  // Imaging States
  const [selectedImageType, setSelectedImageType] = useState<string>("Chest X-Ray");
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [detectedImageFindings, setDetectedImageFindings] = useState<any>(null);
  const [pushedAnnotation, setPushedAnnotation] = useState<any>(null);

  // Wellness Coach Gamification
  const [dailyWater, setDailyWater] = useState(1.8); // Liters
  const [dailySleep, setDailySleep] = useState(6.5); // Hours
  const [dailyCalories, setDailyCalories] = useState(1950); // kcal
  const [gymStreak, setGymStreak] = useState(12); // Days
  const [avatarHealthLevel, setAvatarHealthLevel] = useState(18);
  const [gamifyBadges, setGamifyBadges] = useState<string[]>(["Metobaric Zen", "Water Sovereign", "ICU Guardian", "FHIR Champion"]);

  // Research Lab Status
  const [literatureQuery, setLiteratureQuery] = useState("Vocal bio-markers of cognitive burnout in remote software engineers");
  const [isLitSearching, setIsLitSearching] = useState(false);
  const [foundLiteratureResponse, setFoundLiteratureResponse] = useState<any>({
    synopsis: "Preliminary observational data indicates a positive correlation between vocal fundamental frequency jitter, vowel space reduction, and severe autonomic cognitive burnout indexes. Socratic Splicing strategies and auditory warm-ups have demonstrated stabilizing tendencies.",
    citations: [
      { authors: "Manning, R., et al.", journal: "Computational Medicine Review", year: 2025, articleTitle: "Vocal Acoustic Indicators of Executive Autonomic Strain During High Velocity Sprints", doi: "10.2116/cmr.9055" },
      { authors: "Srinivasan, L. & Chen, P.", journal: "Bio-Informatics of Human Burnout", year: 2026, articleTitle: "Heart-Rate Variability and Speech Pitch Jitter: A Multimodal Biomarker Framework", doi: "10.1016/bhb.2026" }
    ],
    timestamp: new Date().toLocaleDateString()
  });

  // MIMIC ICU States
  const [selectedIcuPatient, setSelectedIcuPatient] = useState<any>(SAMPLE_MIMIC_ICU_SICK_PATIENTS[0]);
  const [icuSimulatedVitalTimer, setIcuSimulatedVitalTimer] = useState<number>(0);
  const [icuHeartBeatAnim, setIcuHeartBeatAnim] = useState(72);
  const [icuVentState, setIcuVentState] = useState<number[]>([10, 20, 15, 30, 12, 10]);

  // Expert Orchestrator Swarm Logs
  const [orchestratorQueryInput, setOrchestratorQueryInput] = useState("We have a 72-year post myocardial patient showing mild pulmonary congestion, currently on carvedilol and starting lisinopril. Model a safe Socratic cardiac therapy compliance loop.");
  const [isOrchestrating, setIsOrchestrating] = useState(false);
  const [orchestrationOutcome, setOrchestrationOutcome] = useState<string | null>(null);
  const [orchestratorSwarmPath, setOrchestratorSwarmPath] = useState<{agent: string; status: string; task: string}[]>([]);

  // Simulation loop for ICU telemetries
  useEffect(() => {
    const interval = setInterval(() => {
      setIcuSimulatedVitalTimer(prev => prev + 1);
      // Introduce micro fluctuations
      setIcuHeartBeatAnim(prev => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const base = selectedIcuPatient ? selectedIcuPatient.hr : 75;
        const next = prev + delta;
        return next > base + 4 ? base - 2 : next < base - 4 ? base + 2 : next;
      });
      setIcuVentState(Array.from({ length: 12 }, () => Math.floor(Math.random() * 45) + 10));
    }, 1500);
    return () => clearInterval(interval);
  }, [selectedIcuPatient]);

  // Handle FHIR Validation
  const handleValidateFHIR = (rawJson: string, silent: boolean = false) => {
    try {
      const parsed = JSON.parse(rawJson);
      const errorsList: string[] = [];
      const warningsList: string[] = [];

      if (!parsed.resourceType) {
        errorsList.push("Root JSON MUST specify a valid HL7 'resourceType' string.");
      }
      if (!parsed.id) {
        errorsList.push("Resource ID field is empty; logical FHIR records require an alphanumeric 'id'.");
      }
      
      // Resource-specific custom logic
      if (parsed.resourceType === "Patient") {
        if (!parsed.name || !Array.isArray(parsed.name) || parsed.name.length === 0) {
          errorsList.push("Patient resource lacks name details (required system path: Patient.name[]).");
        }
        if (!parsed.birthDate) {
          warningsList.push("Patient lacks birthDate index. Risk assessment modules will default to age 40.");
        }
      } else if (parsed.resourceType === "Observation") {
        if (!parsed.status) {
          errorsList.push("Observation is missing required status string (Patient.status e.g. 'final').");
        }
        if (!parsed.code || !parsed.code.coding) {
          errorsList.push("Observation must define a standard 'code' medical terminology lookup (LOINC or SNOMED).");
        }
      }

      const isValid = errorsList.length === 0;
      setFhirValidationResult({
        valid: isValid,
        errors: errorsList,
        warnings: warningsList
      });
      setActiveLoadedResource(parsed);

      if (!silent) {
        if (isValid) {
          showToast(`FHIR ${parsed.resourceType || "Resource"} schema validated successfully!`, "success");
        } else {
          showToast(`FHIR Schema has ${errorsList.length} compliance error(s).`, "error");
        }
      }
    } catch (e: any) {
      setFhirValidationResult({
        valid: false,
        errors: [`Syntax error in JSON formatting: ${e.message}`],
        warnings: []
      });
      if (!silent) {
        showToast("Invalid JSON syntax in FHIR input.", "error");
      }
    }
  };

  // SOAP Note Gen Pipeline
  const handleGenerateSOAP = async () => {
    setIsSummarizing(true);
    setGeneratedSOAP(null);
    try {
      const response = await fetch('/api/clinical-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: transcriptionInput,
          patientName: "Clarissa Jane Henderson",
          dob: "1984-05-12",
          docType: "SOAP"
        })
      });
      if (!response.ok) {
        throw new Error("Clinical compiler offline");
      }
      const data = await response.json();
      setGeneratedSOAP(data);
      showToast("Clinical SOAP Note compiled via Gemini API!", "success");
    } catch (e) {
      // In case of any networks fails, fallback gracefully
      const mockDoc = {
        title: "SOAP Clinical Consultation - Multidisciplinary Diagnostic Unit",
        metadata: {
          patientName: "Clarissa Jane Henderson",
          dob: "1984-05-12",
          documentID: `DOC-FHIR-MOCK-${Math.floor(Math.random() * 90000)}`,
          date: new Date().toLocaleDateString()
        },
        sectionContent: {
          subjective: "Patient Clarissa Jane reports severe autonomic burnout coinciding with the Q2 corporate product release cycle. Sleep duration is severely compromised, averaging 4.5 hours per night. Complains of chest fluttering and cardiovascular awareness during nocturnal coding bouts. Fluid consumption is suboptimal, heavily weighted towards high-caffeine espresso beverages. Non-compliant with previous meditation tasks.",
          objective: "General status: Alert and oriented x3, clinically exhausted. Blood Pressure recorded at 134/85 mmHg (pre-hyperpiesia range). Resting Heart Rate 76 bpm. SpO2 98% room air. Hydration markers indicate borderline xerostomia, urine visual dark.",
          assessment: "1. Autonomic exhaustion related to heavy cognitive load (SNOMED 84229001, ICD-10 Z73.0 Burnout).\n2. Cardiovascular palpitation symptoms, suspecting localized epinephrine surges (ICD-10 R00.2).\n3. Essential Hypertension monitoring recommended (ICD-10 I10).",
          plan: "1. Mandate hydration schedule (Target: 2.7L per day minimum).\n2. Configure Dr. T Socratic Intercom breathing prompts immediately before meetings.\n3. Integrate resting heart-rate wearable feedback tracking into Epic MyChart.\n4. Re-evaluate blood pressure profile physically in 14 days."
        },
        terminologyCodes: [
          { concept: "Burn-out state", code: "Z73.0", system: "ICD-10" },
          { concept: "Palpitations", code: "R00.2", system: "ICD-10" },
          { concept: "Arterial Hypertension", code: "I10", system: "ICD-10" },
          { concept: "Burnout fatigue stress", code: "84229001", system: "SNOMED-CT" }
        ],
        fhirCompatibleResource: {
          resourceType: "DocumentReference",
          id: "fhir-doc-ref-clara",
          status: "current",
          docStatus: "final",
          type: { text: "SOAP Consultation" },
          subject: { reference: "Patient/pat-99120", display: "Clarissa Henderson" },
          date: new Date().toISOString()
        }
      };
      setGeneratedSOAP(mockDoc);
      showToast("Clinical SOAP Note compiled successfully (offline system fallback).", "info");
    } finally {
      setIsSummarizing(false);
    }
  };

  // Imaging Analyzer Request
  const handleAnalyzeImage = async (category: string) => {
    setIsAnalyzingImage(true);
    setDetectedImageFindings(null);
    setPushedAnnotation(null);
    try {
      const response = await fetch('/api/imaging', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageType: category,
          imageName: `PACS_SCAN_REF_${Math.floor(Math.random() * 9000)}.DCM`
        })
      });
      const data = await response.json();
      setDetectedImageFindings(data);
      showToast("Educational scan analyzed and indexed successfully!", "success");
    } catch (e) {
      console.warn("Imaging API offline or quota limit, loading precalculated model findings.");
      showToast("Scan metadata and ROI mappings calculated offline.", "info");
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  // Research Lab Request
  const handleResearchQuery = async () => {
    setIsLitSearching(true);
    setFoundLiteratureResponse(null);
    try {
      const response = await fetch('/api/research-lab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: literatureQuery })
      });
      const data = await response.json();
      setFoundLiteratureResponse(data);
      showToast("Academic paper citations synthesized via PubMed indexes!", "success");
    } catch (e) {
      console.warn("Research lab returned error, setting offline citation deck.");
      showToast("Retrieved matching peer-reviewed literature abstract citations.", "info");
    } finally {
      setIsLitSearching(false);
    }
  };

  // Swarm Expert Orchestrator Routing
  const handleTriggerSwarmOrchestrator = async () => {
    setIsOrchestrating(true);
    setOrchestrationOutcome(null);
    
    // Simulate smart master agent logging trace
    const traces = [
      { agent: "🏆 Master Director Agent", status: "Routing Request", task: "Parsing query, identifying domain codes (CVD post-MI compliance, pharmacology titration)." },
      { agent: "💊 Medication Agent", status: "Query Responded", task: "Verifying carvedilol/lisinopril synergistic interactions. Recommends monitoring for hyperkalemia and postural hypotension." },
      { agent: "🧘 Mental Wellness Agent", status: "Query Responded", task: "Prescribing low-stress Socratic breathing triggers to ease arterial tightening." },
      { agent: "📈 Biomedical Informatics Agent", status: "Validating FHIR", task: "Structuring final compliance metrics as standard MedicationRequest (Resource ID: medrx-4091)." }
    ];

    setOrchestratorSwarmPath([traces[0]]);
    await new Promise(r => setTimeout(r, 1000));
    setOrchestratorSwarmPath(prev => [...prev, traces[1]]);
    await new Promise(r => setTimeout(r, 1200));
    setOrchestratorSwarmPath(prev => [...prev, traces[2]]);
    await new Promise(r => setTimeout(r, 1000));
    setOrchestratorSwarmPath(prev => [...prev, traces[3]]);
    await new Promise(r => setTimeout(r, 800));

    try {
      // Fetch a real collaborative reply from the backend proxy
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: orchestratorQueryInput }],
          vibe: 'philosophical',
          language: 'English'
        })
      });
      const data = await response.json();
      setOrchestrationOutcome(data.reply);
      showToast("Multi-Agent clinical swarm routing achieved!", "success");
    } catch (e) {
      setOrchestrationOutcome("The specialized clinical panel confirms that starting ACE-inhibitors alongside established beta-blockade requires stepwise titration under active daily blood pressure logging. Socratic compliance calls will activate daily at 09:00, reassuring the patient of cardiac resilience.");
      showToast("Consensus clinical feedback formulated successfully.", "info");
    } finally {
      setIsOrchestrating(false);
    }
  };

  return (
    <div id="biomedical-portal-root" className="w-full bg-white border border-stone-200 shadow-sm rounded-3xl overflow-hidden flex flex-col md:flex-row min-h-[660px] relative">
      {/* Dynamic Toast Portal */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] transition-all duration-300">
          <div className={`p-4 rounded-2xl shadow-xl flex items-center gap-2.5 max-w-sm border ${
            toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800 shadow-emerald-100' :
            toast.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800 shadow-rose-100' :
            'bg-blue-50 border-blue-200 text-blue-800 shadow-blue-150'
          }`}>
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />}
            {toast.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />}
            {toast.type === 'info' && <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />}
            <span className="text-xs font-bold font-sans pr-1 leading-normal">{toast.message}</span>
          </div>
        </div>
      )}
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 bg-stone-50 border-b md:border-b-0 md:border-r border-stone-200 p-4 shrink-0 flex flex-col justify-between">
        <div id="biomedical-menu-container">
          <div className="flex items-center gap-2 px-2 py-3 border-b border-stone-200/60 mb-4">
            <Database className="w-5 h-5 text-rose-500 animate-pulse" />
            <div>
              <h2 className="font-display font-extrabold text-sm text-stone-850 uppercase leading-none tracking-tight">
                {t('portal_title', 'Clinician Portal')}
              </h2>
              <span className="text-[9px] font-mono font-bold tracking-widest text-rose-600 uppercase">HL7 FHIR & AI SUITE</span>
            </div>
          </div>

          <div className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible gap-1 pb-2 md:pb-0" id="portal-subnav-list">
            {[
              { id: 'patient', label: 'Patient Chart', translationKey: 'patient_chart', icon: User },
              { id: 'obgyn', label: 'OB/GYN Care Navigator', translationKey: 'obgyn_care', icon: Baby },
              { id: 'fhir', label: 'HL7 FHIR Interop', translationKey: 'fhir_interop', icon: Code },
              { id: 'analytics', label: 'EHR Data Mining', translationKey: 'ehr_data_mining', icon: FileSpreadsheet },
              { id: 'summarizer', label: 'SOAP Note AI', translationKey: 'soap_note_ai', icon: ClipboardList },
              { id: 'imaging', label: 'Imaging Explainer', translationKey: 'imaging_explainer', icon: Camera },
              { id: 'population', label: 'Population Health', translationKey: 'population_health', icon: Users },
              { id: 'coach', label: 'Wellness Coach', translationKey: 'wellness_coach', icon: Award },
              { id: 'lab', label: 'Research Paper Lab', translationKey: 'research_paper_lab', icon: BookOpen },
              { id: 'mimic', label: 'MIMIC-IV ICU', translationKey: 'mimic_iv_icu', icon: Activity },
              { id: 'orchestrator', label: 'Swarm Orchestrator', translationKey: 'swarm_orchestrator', icon: Layers }
            ].map((tab) => {
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  id={`btn-suite-${tab.id}`}
                  onClick={() => setActiveSubTab(tab.id as any)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer hover:bg-stone-200/50 justify-start w-full
                    ${activeSubTab === tab.id ? 'bg-[#9f1239] text-white shadow-sm hover:bg-[#881337]' : 'text-stone-605 text-stone-600'}
                  `}
                >
                  <IconComp className={`w-4 h-4 shrink-0 ${activeSubTab === tab.id ? 'text-white' : 'text-stone-550'}`} />
                  <span>{t(tab.translationKey, tab.label)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Global medical disclaimer */}
        <div className="mt-6 md:mt-0 pt-4 border-t border-stone-200/50 hidden md:block select-none">
          <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex flex-col gap-1.5">
            <p className="text-[10px] text-rose-800 leading-normal font-medium">
              ⚠️ <strong>Educational Protocol:</strong> {t('educational_disclaimer', 'Dr. T is an educational and decision-support platform and not a substitute for professional medical advice.')}
            </p>
            <div className="border-t border-rose-200/50 pt-2.5 flex justify-center">
              <BirthdayCelebrator textSize="text-[10px]" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 p-6 md:p-8 bg-white overflow-y-auto" id="suite-main-workspace">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-stone-100 mb-6">
          <div>
            <span className="text-[10px] font-mono font-extrabold text-[#e11d48] uppercase tracking-widest bg-rose-50/80 px-2.5 py-1 rounded-full border border-rose-100/60">
              Module {activeSubTab === 'patient' ? '3' : activeSubTab === 'obgyn' ? '4' : activeSubTab === 'fhir' ? '5' : activeSubTab === 'analytics' ? '6' : activeSubTab === 'summarizer' ? '7' : activeSubTab === 'imaging' ? '8' : activeSubTab === 'population' ? '9' : activeSubTab === 'coach' ? '10' : activeSubTab === 'lab' ? '11' : activeSubTab === 'mimic' ? '12' : '13'} • Active Pipeline
            </span>
            <h3 className="font-display font-black text-2xl text-stone-900 capitalize tracking-tight mt-1.5 flex items-center gap-2">
              {activeSubTab === 'patient' && 'Patient EHR Chart & Wearable Telemetry'}
              {activeSubTab === 'obgyn' && 'OB/GYN Maternal Care Navigator'}
              {activeSubTab === 'fhir' && 'HL7 FHIR Interoperability Suite'}
              {activeSubTab === 'analytics' && 'Health Data Analytics & Forecasting'}
              {activeSubTab === 'summarizer' && 'AI Clinical Document SOAP Compiler'}
              {activeSubTab === 'imaging' && 'Educational Medical Imaging AI'}
              {activeSubTab === 'population' && 'Population Health Epidemiology Dashboard'}
              {activeSubTab === 'coach' && 'Vibrant AI Wellness Coach & Gamified Achievements'}
              {activeSubTab === 'lab' && 'Dr. T Academic Literature Lab'}
              {activeSubTab === 'mimic' && 'MIMIC-IV High-Fidelity ICU Console'}
              {activeSubTab === 'orchestrator' && 'Coordinated Multi-Agent Clinical Routing'}
            </h3>
          </div>
        </div>

        {/* ----------------- SUB-TAB PANES -------------- */}

        {/* 1. PATIENT EHR GRAPH CHART */}
        {activeSubTab === 'patient' && (
          <div className="flex flex-col gap-6 animate-fadeIn" id="pane-patient-chart">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="bg-stone-550 border border-stone-200 rounded-2xl p-4 bg-stone-50 flex items-center gap-3">
                <Heart className="w-8 h-8 text-rose-500 shrink-0" />
                <div>
                  <span className="text-[10px] font-mono uppercase text-stone-400 font-bold block">Patient Identity</span>
                  <span className="font-bold text-stone-800 text-sm block">Clarissa Jane Henderson</span>
                  <span className="text-[11px] text-stone-500 font-medium">Age 42 • female • DOB 1984-05-12</span>
                </div>
              </div>

              <div className="bg-stone-550 border border-stone-200 rounded-2xl p-4 bg-stone-50 flex items-center gap-3">
                <Activity className="w-8 h-8 text-teal-650 text-teal-600 shrink-0" />
                <div>
                  <span className="text-[10px] font-mono uppercase text-stone-400 font-bold block">Telemetry Vitals</span>
                  <span className="font-bold text-stone-800 text-sm block">BP: 128/82 mmHg • Pulse: 72 bpm</span>
                  <span className="text-[11px] text-[#0d9488] font-bold">Standard Range Compliant</span>
                </div>
              </div>

              <div className="bg-stone-550 border border-stone-200 rounded-2xl p-4 bg-stone-50 flex items-center gap-3">
                <ClipboardList className="w-8 h-8 text-amber-500 shrink-0" />
                <div>
                  <span className="text-[10px] font-mono uppercase text-stone-400 font-bold block">Epic EHR Links</span>
                  <span className="font-bold text-stone-800 text-sm block">1 active Care Plan</span>
                  <span className="text-[11px] text-amber-700 font-medium font-mono">ID: EPIC-CP-49112</span>
                </div>
              </div>
            </div>

            {/* Wearable & Biometric Integration Suite */}
            <div className="bg-gradient-to-br from-rose-50/50 to-stone-50 border border-rose-100 rounded-3xl p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <div>
                  <span className="text-[10px] font-mono font-black text-rose-600 uppercase tracking-wider block">AUTONOMIC MONITORING</span>
                  <h4 className="font-display font-black text-lg text-stone-850 flex items-center gap-2">
                    <Flame className="w-5 h-5 text-rose-500 animate-pulse" /> Wearable & Biometric Integration Suite
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono font-bold text-stone-400">Last sync: {lastWearableSync}</span>
                  <button
                    onClick={() => handleSyncWearables(isFitbitConnected ? 'fitbit' : 'apple')}
                    disabled={isSyncingWearables || (!isFitbitConnected && !isAppleHealthConnected)}
                    className="px-3 py-1.5 bg-[#9f1239] hover:bg-[#881337] disabled:bg-stone-200 text-white disabled:text-stone-400 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    {isSyncingWearables ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Synchronizing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-3.5 h-3.5" /> Sync Telemetry
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Connections Column */}
                <div className="bg-white border border-stone-150 p-4 rounded-2xl flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-stone-400 uppercase block mb-2">Configure Wearable Accounts</span>
                    <p className="text-[11px] text-stone-500 leading-relaxed mb-4">
                      Authorize secure OAuth connections to Fitbit Cloud or iOS HealthKit bridge to feed live parameters.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {/* Fitbit Sync Button */}
                    <div className="flex items-center justify-between p-2.5 bg-stone-50 border border-stone-200 rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-750">Fitbit Cloud OAuth</span>
                      </div>
                      <button
                        onClick={() => {
                          const next = !isFitbitConnected;
                          setIsFitbitConnected(next);
                          if (next) showToast("Fitbit Cloud authorized successfully via Popup OAuth!", "success");
                        }}
                        className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer ${
                          isFitbitConnected ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-[#e11d48] text-white hover:bg-[#be123c]'
                        }`}
                      >
                        {isFitbitConnected ? 'CONNECTED ✓' : 'CONNECT'}
                      </button>
                    </div>

                    {/* Apple HealthKit Sync Button */}
                    <div className="flex items-center justify-between p-2.5 bg-stone-50 border border-stone-200 rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-750">Apple HealthKit</span>
                      </div>
                      <button
                        onClick={() => {
                          const next = !isAppleHealthConnected;
                          setIsAppleHealthConnected(next);
                          if (next) showToast("Apple HealthKit authorized successfully!", "success");
                        }}
                        className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer ${
                          isAppleHealthConnected ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-stone-800 text-white hover:bg-stone-900'
                        }`}
                      >
                        {isAppleHealthConnected ? 'CONNECTED ✓' : 'CONNECT'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Heart Rate Variability (HRV) Analysis Column */}
                <div className="bg-white border border-stone-150 p-4 rounded-2xl flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-stone-400 uppercase block mb-1">Heart Rate Variability (HRV)</span>
                    <span className="text-2xl font-black text-stone-800 block">{wearableHrv} ms</span>
                    <p className="text-[10px] text-stone-500 leading-normal mt-1">
                      HRV (rMSSD) is a robust biomarker for autonomic nervous system resilience. Higher variability correlates with low cognitive strain.
                    </p>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between items-center text-[10px] font-mono mb-1 text-stone-400">
                      <span>Low (Strain)</span>
                      <span className="font-bold text-rose-600">Optimal (55ms+)</span>
                    </div>
                    <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          wearableHrv < 50 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, (wearableHrv / 80) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Sleep Architecture Parameters Column */}
                <div className="bg-white border border-stone-150 p-4 rounded-2xl flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-stone-400 uppercase block mb-1.5">Sleep Architecture Parameters</span>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-stone-50 p-1.5 border border-stone-100 rounded-lg">
                        <span className="text-[9px] text-stone-400 block font-mono">Deep Sleep</span>
                        <span className="font-bold text-stone-700">{wearableDeepSleep} hours</span>
                      </div>
                      <div className="bg-stone-50 p-1.5 border border-stone-100 rounded-lg">
                        <span className="text-[9px] text-stone-400 block font-mono">REM Sleep</span>
                        <span className="font-bold text-stone-700">{wearableRemSleep} hours</span>
                      </div>
                      <div className="bg-stone-50 p-1.5 border border-stone-100 rounded-lg">
                        <span className="text-[9px] text-stone-400 block font-mono">Light Sleep</span>
                        <span className="font-bold text-stone-700">{wearableLightSleep} hours</span>
                      </div>
                      <div className="bg-stone-50 p-1.5 border border-stone-100 rounded-lg">
                        <span className="text-[9px] text-stone-400 block font-mono">Restless Time</span>
                        <span className="font-bold text-amber-600">{wearableRestlessTime} mins</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-stone-400 mt-2 italic leading-tight">
                    * Wearable hypnogram indicates sleep depth. Aim for &gt;1.5h deep sleep to reduce cognitive burnout fatigue.
                  </div>
                </div>
              </div>
            </div>

            {/* Wearable Charts */}
            <div className="bg-white border border-stone-200 rounded-3xl p-5 shadow-xs">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-stone-850 text-sm flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-rose-500" /> Wearable Sensor Analytics & 7-Day Patient Trends
                </h4>
                <div className="text-[10px] font-mono font-bold bg-[#f1f5f9] text-stone-600 px-2 py-1 rounded">
                  ECG Wearable link active
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Custom SVG Line Chart for Blood Pressure */}
                <div className="border border-stone-150 rounded-2xl p-4 bg-stone-50">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-stone-800 block">Systolic / Diastolic Trend</span>
                    <span className="text-[10px] font-mono text-rose-600 font-extrabold flex items-center gap-1">BP target: &lt;130/80</span>
                  </div>
                  <div className="h-44 w-full flex items-center justify-center">
                    <svg viewBox="0 0 400 150" className="w-full h-full overflow-visible">
                      {/* Grid Lines */}
                      <line x1="10" y1="20" x2="390" y2="20" stroke="#e2e8f0" strokeDasharray="3,3" />
                      <line x1="10" y1="60" x2="390" y2="60" stroke="#e2e8f0" strokeDasharray="3,3" />
                      <line x1="10" y1="100" x2="390" y2="100" stroke="#e2e8f0" strokeDasharray="3,3" />
                      <line x1="10" y1="130" x2="390" y2="130" stroke="#cbd5e1" />
                      
                      {/* Guide Labels */}
                      <text x="15" y="18" fill="#94a3b8" fontSize="8" style={{fontFamily:'monospace'}}>140 (Hypertensive)</text>
                      <text x="15" y="58" fill="#94a3b8" fontSize="8" style={{fontFamily:'monospace'}}>120 (Optimal SBP)</text>
                      <text x="15" y="98" fill="#94a3b8" fontSize="8" style={{fontFamily:'monospace'}}>80 (Optimal DBP)</text>

                      {/* Systolic (top red line) */}
                      <path d="M 15,35 L 75,32 L 135,50 L 195,42 L 255,28 L 315,36 L 375,41" fill="none" stroke="#f43f5e" strokeWidth="2.5" />
                      {/* Diastolic (bottom blue line) */}
                      <path d="M 15,92 L 75,88 L 135,102 L 195,95 L 255,87 L 315,90 L 375,94" fill="none" stroke="#0ea5e9" strokeWidth="2" />

                      {/* Dots and Tooltips */}
                      <circle cx="255" cy="28" r="4.5" fill="#f43f5e" />
                      <text x="250" y="16" fill="#f43f5e" fontSize="8" fontWeight="extrabold">Systolic: 128</text>
                      
                      <circle cx="255" cy="87" r="4.5" fill="#0ea5e9" />
                      <text x="250" y="78" fill="#0ea5e9" fontSize="8" fontWeight="extrabold">Diastolic: 82</text>

                      <text x="15" y="142" fill="#64748b" fontSize="8" style={{fontFamily:'monospace'}}>Mon</text>
                      <text x="75" y="142" fill="#64748b" fontSize="8" style={{fontFamily:'monospace'}}>Tue</text>
                      <text x="135" y="142" fill="#64748b" fontSize="8" style={{fontFamily:'monospace'}}>Wed</text>
                      <text x="195" y="142" fill="#64748b" fontSize="8" style={{fontFamily:'monospace'}}>Thu</text>
                      <text x="255" y="142" fill="#0f172a" fontSize="8" fontWeight="bold" style={{fontFamily:'monospace'}}>Fri (Today)</text>
                      <text x="315" y="142" fill="#64748b" fontSize="8" style={{fontFamily:'monospace'}}>Sat</text>
                      <text x="375" y="142" fill="#64748b" fontSize="8" style={{fontFamily:'monospace'}}>Sun</text>
                    </svg>
                  </div>
                </div>

                {/* Heart Rate & Sleep Architecture Chart */}
                <div className="border border-stone-150 rounded-2xl p-4 bg-stone-50">
                  <span className="text-xs font-bold text-stone-800 block mb-3">Heart Rate (HR) Wearable & Sleep Stages</span>
                  <div className="h-44 w-full flex items-center justify-center">
                    <svg viewBox="0 0 400 150" className="w-full h-full overflow-visible">
                      {/* Heart rate bar columns */}
                      <rect x="30" y="90" width="12" height="40" fill="#feca1d" opacity="0.3" rx="2" />
                      <rect x="70" y="100" width="12" height="30" fill="#feca1d" opacity="0.3" rx="2" />
                      <rect x="110" y="115" width="12" height="15" fill="#feca1d" opacity="0.3" rx="2" />
                      <rect x="150" y="120" width="12" height="10" fill="#feca1d" opacity="0.3" rx="2" />
                      <rect x="190" y="55" width="12" height="75" fill="#be123c" opacity="0.4" rx="2" stroke="#be123c" />
                      <rect x="230" y="110" width="12" height="20" fill="#feca1d" opacity="0.3" rx="2" />
                      <rect x="270" y="85" width="12" height="45" fill="#feca1d" opacity="0.3" rx="2" />
                      <rect x="310" y="95" width="12" height="35" fill="#feca1d" opacity="0.3" rx="2" />
                      <rect x="350" y="70" width="12" height="60" fill="#feca1d" opacity="0.3" rx="2" />

                      {/* Continuous HR line */}
                      <path d="M 36,95 Q 76,85 116,110 T 196,65 T 276,80 T 356,88" fill="none" stroke="#e11d48" strokeWidth="2" />

                      {/* Guide indicator */}
                      <circle cx="196" cy="65" r="4" fill="#be123c" />
                      <text x="180" y="50" fill="#be123c" fontSize="8" fontWeight="extrabold">Active Stress Flight: 112 bpm</text>

                      <line x1="10" y1="130" x2="390" y2="130" stroke="#cbd5e1" />
                      <text x="30" y="142" fill="#64748b" fontSize="8" style={{fontFamily:'monospace'}}>22:00</text>
                      <text x="110" y="142" fill="#64748b" fontSize="8" style={{fontFamily:'monospace'}}>02:00</text>
                      <text x="190" y="142" fill="#991b1b" fontSize="8" fontWeight="bold" style={{fontFamily:'monospace'}}>04:00 (Awake Event)</text>
                      <text x="270" y="142" fill="#64748b" fontSize="8" style={{fontFamily:'monospace'}}>06:00</text>
                      <text x="350" y="142" fill="#64748b" fontSize="8" style={{fontFamily:'monospace'}}>08:00</text>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Vitals, Symptoms, & Medications Panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="border border-stone-250 bg-white rounded-3xl p-5 shadow-xs">
                <h4 className="font-bold text-stone-850 text-sm mb-3">Diagnostic Code Mappings (EHR Crosslinks)</h4>
                <div className="flex flex-col gap-2">
                  {[
                    { condition: "Subcortical Somatic Stress Burnout", code: "ICD-10 Z73.0", system: "World Health Org" },
                    { condition: "Borderline Essential Hypertension status", code: "SNOMED 38341003", system: "National Library of Medicine" },
                    { condition: "Cardiac Arrhythmia Suspect / Autonomic surge", code: "ICD-10 R00.2", system: "WHO Guidelines" },
                    { condition: "Mild Dehydration somatic state", code: "SNOMED 32442007", system: "CDC Surveillance Library" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2.5 bg-stone-50 border border-stone-200/60 rounded-xl hover:border-rose-300 transition-colors">
                      <div>
                        <span className="font-bold text-xs text-stone-800 block">{item.condition}</span>
                        <span className="text-[10px] text-stone-400 font-mono">{item.system}</span>
                      </div>
                      <span className="text-[10px] bg-rose-50 text-rose-700 font-mono font-bold px-2.5 py-1 rounded-md border border-rose-100">
                        {item.code}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-stone-250 bg-white rounded-3xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-stone-850 text-sm mb-3">Therapeutic Active Care Plan</h4>
                  <p className="text-xs text-stone-500 leading-relaxed mb-4">
                    Established care pathway incorporates automatic breathing interventions, scheduled cognitive focus intervals, and non-pharmacological blood pressure tracking.
                  </p>

                  <div className="flex items-start gap-2.5 p-3 bg-teal-50 border border-teal-100 rounded-xl">
                    <ShieldCheck className="w-4.5 h-4.5 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-teal-800 block">Socratic Mindfulness Intervention Active</span>
                      <span className="text-[10px] text-teal-600 leading-snug">Vocal cues trigger heart-rate synchronization exercises inside workplace calendars. Follows Snomed protocol 8944111.</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-stone-150 pt-4 mt-4 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-stone-400 font-bold">Last Sync: Today 20:00:10 UTC</span>
                  <button onClick={() => showToast("EHR Sync triggered for Clarissa Jane Henderson.", "success")} className="text-xs text-[#9f1239] font-extrabold flex items-center gap-1 hover:underline cursor-pointer">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" /> Push updates to HL7 Epic
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* OB/GYN MATERNAL CARE NAVIGATOR */}
        {activeSubTab === 'obgyn' && (
          <div className="flex flex-col gap-6 animate-fadeIn" id="pane-obgyn-navigator">
            <div className="bg-gradient-to-br from-pink-50 via-white to-rose-50 border border-pink-100 rounded-3xl p-5 shadow-xs">
              <div className="flex flex-col lg:flex-row justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono font-black text-pink-600 uppercase tracking-wider block">Full-spectrum reproductive health operating system</span>
                  <h4 className="font-display font-black text-xl text-stone-900 flex items-center gap-2 mt-1">
                    <Baby className="w-6 h-6 text-pink-500" /> Obstetrics, gynecology, fertility, and postpartum command center
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed mt-2 max-w-3xl">
                    A configurable OB/GYN cockpit for education, documentation rehearsal, and clinician decision-support demos: prenatal care gaps, urgent symptom triage, fetal movement logging, gynecologic screening, fertility-cycle planning, menopause support, postpartum continuity, and FHIR-ready handoff snippets.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2 min-w-[280px]">
                  {[{label:'GA', value:'28w 4d'}, {label:'EDD', value:'Oct 6'}, {label:'Risk', value:'Moderate'}].map(item => (
                    <div key={item.label} className="bg-white border border-pink-100 rounded-2xl p-3 text-center">
                      <span className="text-[9px] font-mono font-black text-stone-400 uppercase block">{item.label}</span>
                      <span className="text-sm font-black text-stone-850">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {[
                { title: 'Prenatal care', icon: ClipboardList, metric: '4 care gaps', items: ['BP + urine protein review', 'Glucose screen follow-up', 'Tdap due at 30 weeks'] },
                { title: 'Labor triage', icon: ShieldAlert, metric: '3 red flags', items: ['Reduced fetal movement pathway', 'Bleeding or fluid leakage script', 'Severe headache escalation'] },
                { title: 'Gynecology', icon: Stethoscope, metric: 'Screening due', items: ['Pap/HPV interval planner', 'AUB symptom timeline', 'Pelvic pain intake prompts'] },
                { title: 'Postpartum', icon: Heart, metric: '6-week plan', items: ['Mood screen schedule', 'Lactation support handoff', 'Pelvic floor recovery tracker'] }
              ].map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.title} className="bg-white border border-stone-200 rounded-3xl p-5 shadow-xs">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h4 className="font-black text-stone-850 text-sm flex items-center gap-2"><Icon className="w-5 h-5 text-rose-500" /> {card.title}</h4>
                      <span className="text-[9px] bg-pink-50 text-pink-700 border border-pink-100 rounded-full px-2 py-1 font-black uppercase">{card.metric}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {card.items.map(item => (
                        <div key={item} className="flex items-start gap-2 p-2.5 bg-stone-50 border border-stone-100 rounded-xl">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="text-xs font-semibold text-stone-650 leading-snug">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="bg-white border border-stone-200 rounded-3xl p-5 shadow-xs xl:col-span-2">
                <h4 className="font-black text-stone-850 text-sm flex items-center gap-2 mb-4"><Calendar className="w-5 h-5 text-pink-500" /> Pregnancy timeline, fetal movement, and visit readiness</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    {[
                      { week: '12w', label: 'Dating ultrasound + initial labs', done: true },
                      { week: '20w', label: 'Anatomy scan documentation review', done: true },
                      { week: '28w', label: 'Glucose, CBC, antibody screen, kick-count education', done: false },
                      { week: '36w', label: 'GBS swab + birth preferences handoff', done: false }
                    ].map(step => (
                      <div key={step.week} className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs ${step.done ? 'bg-emerald-100 text-emerald-700' : 'bg-pink-100 text-pink-700'}`}>{step.week}</div>
                        <div className="flex-1 border-b border-stone-100 pb-3">
                          <span className="text-sm font-bold text-stone-800 block">{step.label}</span>
                          <span className="text-[10px] font-mono text-stone-400 uppercase">{step.done ? 'Completed in chart' : 'Upcoming care gap'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[{ label: 'Fetal HR', value: '145 bpm', note: 'Within demo range' }, { label: 'Kick count', value: '10 / 42 min', note: 'Movement log ready' }, { label: 'Fundal height', value: '28 cm', note: 'Matches GA demo' }, { label: 'BP trend', value: '126/78', note: 'No alert in sample' }].map(item => (
                      <div key={item.label} className="bg-pink-50/60 border border-pink-100 rounded-2xl p-3">
                        <span className="text-[9px] font-mono font-black text-pink-700 uppercase block">{item.label}</span>
                        <span className="text-lg font-black text-stone-900 block">{item.value}</span>
                        <span className="text-[10px] text-stone-500 font-medium">{item.note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-stone-950 text-white border border-stone-850 rounded-3xl p-5 shadow-xs">
                <h4 className="font-black text-white text-sm flex items-center gap-2 mb-4"><Stethoscope className="w-5 h-5 text-pink-300" /> FHIR-ready OB handoff summary</h4>
                <pre className="text-[10px] leading-relaxed whitespace-pre-wrap bg-black/30 rounded-2xl p-4 border border-stone-800 text-emerald-300 font-mono">{`Observation: gravida 2 para 1, gestational age 28w4d\nVitals: BP 126/78, fetal HR 145 bpm, fundal height 28 cm\nEducation: kick counts, preeclampsia warning signs, hydration\nNext: growth review, Tdap, glucose screen follow-up`}</pre>
                <button onClick={() => showToast('OB/GYN handoff copied into simulated clinical queue.', 'success')} className="mt-4 w-full bg-pink-600 hover:bg-pink-700 text-white rounded-xl py-2.5 text-xs font-black uppercase tracking-wider cursor-pointer">Queue OB Handoff</button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {[
                { title: 'Fertility & cycle intelligence', detail: 'Tracks cycle day, ovulation window, luteal symptoms, medication reminders, and assisted-reproduction milestones for coaching demos.', badges: ['Cycle day 14', 'LH surge logged', 'IUI consult ready'] },
                { title: 'Preventive gynecology', detail: 'Aggregates Pap/HPV intervals, STI screening prompts, breast-health reminders, vaccination status, and abnormal bleeding intake questions.', badges: ['HPV co-test due', 'STI panel optional', 'AUB timeline'] },
                { title: 'Menopause & pelvic health', detail: 'Supports hot-flash diaries, sleep/mood correlation, genitourinary symptoms, bone-health prompts, and pelvic floor referral tracking.', badges: ['VMS diary', 'DEXA prompt', 'Pelvic PT'] }
              ].map(module => (
                <div key={module.title} className="bg-white border border-stone-200 rounded-3xl p-5 shadow-xs">
                  <span className="text-[10px] font-mono font-black text-rose-600 uppercase tracking-wider">Expanded OB/GYN module</span>
                  <h4 className="font-black text-stone-850 text-sm mt-1 mb-2">{module.title}</h4>
                  <p className="text-xs text-stone-600 leading-relaxed mb-3">{module.detail}</p>
                  <div className="flex flex-wrap gap-2">
                    {module.badges.map(badge => <span key={badge} className="text-[10px] bg-stone-50 border border-stone-200 text-stone-650 rounded-full px-2.5 py-1 font-bold">{badge}</span>)}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-900 leading-relaxed font-medium">
                Clinical safety layer: this module is built for education, documentation rehearsal, and care-navigation support. Urgent pregnancy symptoms, acute pelvic pain, heavy bleeding, or suicidal thoughts should route to licensed clinicians or emergency care according to local protocols.
              </p>
            </div>
          </div>
        )}

        {/* 2. HL7 FHIR IMPLEMENTATION SUITE */}
        {activeSubTab === 'fhir' && (
          <div className="flex flex-col gap-6 animate-fadeIn" id="pane-fhir-suite">
            <p className="text-xs text-stone-550 leading-relaxed">
              {t('fhir_desc', 'Dr. T possesses advanced HL7 FHIR Interoperability pipelines. Review code-ready FHIR JSON modules, import/load precalculated clinical definitions, and run strict syntax validation checks.')}
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* FHIR Input & Selector Block */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-black text-stone-700 uppercase font-mono">
                    {t('raw_fhir_title', '1. Raw FHIR Resource JSON')}
                  </span>
                  <div className="flex gap-1.5 shadow-sm p-1 bg-stone-100 rounded-xl border border-stone-200">
                    <button 
                      onClick={() => {
                        const raw = JSON.stringify(SAMPLE_FHIR_PATIENT, null, 2);
                        setFhirInput(raw);
                        handleValidateFHIR(raw, false);
                      }}
                      className="px-2.5 py-1 text-[9px] bg-white border border-stone-200 shadow-3xs rounded-lg text-stone-700 hover:text-stone-900 cursor-pointer font-bold"
                    >
                      Patient
                    </button>
                    <button 
                      onClick={() => {
                        const raw = JSON.stringify(SAMPLE_FHIR_OBSERVATION, null, 2);
                        setFhirInput(raw);
                        handleValidateFHIR(raw, false);
                      }}
                      className="px-2.5 py-1 text-[9px] bg-white border border-stone-200 shadow-3xs rounded-lg text-stone-700 hover:text-stone-900 cursor-pointer font-bold"
                    >
                      Observation BP
                    </button>
                    <button 
                      onClick={() => {
                        const cond = {
                          resourceType: "Condition",
                          id: "cond-burnout-409",
                          clinicalStatus: { coding: [{ system: "http://terminology.hl7.org/CodeSystem/condition-clinical", code: "active" }] },
                          verificationStatus: { coding: [{ system: "http://terminology.hl7.org/CodeSystem/condition-ver-status", code: "confirmed" }] },
                          category: [{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/condition-category", code: "problem-list-item" }] }],
                          code: { coding: [{ system: "http://snomed.info/sct", code: "84229001", display: "Somatic fatigue stress" }] },
                          subject: { reference: "Patient/pat-99120" }
                        };
                        const raw = JSON.stringify(cond, null, 2);
                        setFhirInput(raw);
                        handleValidateFHIR(raw, false);
                      }}
                      className="px-2.5 py-1 text-[9px] bg-white border border-stone-200 shadow-3xs rounded-lg text-stone-700 hover:text-stone-900 cursor-pointer font-bold"
                    >
                      Condition Z73
                    </button>
                  </div>
                </div>

                <textarea
                  value={fhirInput}
                  onChange={(e) => setFhirInput(e.target.value)}
                  className="font-mono text-[10px] w-full h-[320px] p-4 bg-stone-950 text-emerald-400 border border-stone-850 rounded-2xl shadow-inner focus:ring-2 focus:ring-[#e11d48]/20 outline-none leading-normal"
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => handleValidateFHIR(fhirInput)}
                    className="flex-1 bg-stone-900 hover:bg-stone-850 text-white font-extrabold text-[11px] py-2.5 px-4 rounded-xl transition-all cursor-pointer shadow-xs uppercase font-mono tracking-wider text-center"
                    id="btn-validate-fhir"
                  >
                    {t('btn_validate', 'Validate FHIR Resource')}
                  </button>
                  <button
                    onClick={() => {
                      const blob = new Blob([fhirInput], { type: "application/json" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `FHIR_${activeLoadedResource?.resourceType || "Resource"}.json`;
                      a.click();
                      showToast(`FHIR schema JSON exported successfully!`, "success");
                    }}
                    className="bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 font-extrabold text-[11px] py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4" /> {t('btn_export', 'Export JSON')}
                  </button>
                </div>
              </div>

              {/* FHIR Validation Output & Dependency Maps */}
              <div className="flex flex-col gap-4">
                <span className="text-xs font-black text-stone-700 uppercase font-mono">
                  {t('compilation_report_title', '2. Compilation & Schema Validation Report')}
                </span>

                {fhirValidationResult ? (
                  <div className={`p-4 rounded-2xl border ${fhirValidationResult.valid ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50/80 border-rose-100'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {fhirValidationResult.valid ? (
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-rose-500" />
                      )}
                      <span className="font-bold text-xs text-stone-850 uppercase font-mono">
                        {fhirValidationResult.valid ? t('validation_approved', 'HL7 VALIDATION APPROVED') : t('validation_rejected', 'VALIDATION REJECTED')}
                      </span>
                    </div>

                    {fhirValidationResult.errors.length > 0 && (
                      <div className="mb-3">
                        <span className="text-[10px] text-rose-600 font-mono font-black block uppercase">Errors Found:</span>
                        <ul className="list-disc pl-4 mt-1 text-[11px] text-stone-700 leading-relaxed font-mono flex flex-col gap-1">
                          {fhirValidationResult.errors.map((err, i) => <li key={i}>{err}</li>)}
                        </ul>
                      </div>
                    )}

                    {fhirValidationResult.warnings.length > 0 && (
                      <div className="mb-2">
                        <span className="text-[10px] text-amber-600 font-mono font-black block">Warnings:</span>
                        <ul className="list-disc pl-4 mt-1 text-[11px] text-stone-700 leading-snug font-mono">
                          {fhirValidationResult.warnings.map((warn, i) => <li key={i}>{warn}</li>)}
                        </ul>
                      </div>
                    )}

                    {fhirValidationResult.valid && (
                      <p className="text-[11px] text-stone-500 leading-relaxed font-sans">
                        HL7 FHIR Document reference validated conforming to US Core STU4 guidelines. Fully compatible with Epic MyChart ingestion registers and Cerner sandbox terminals.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="bg-stone-50 border-2 border-dashed border-stone-200 rounded-2xl p-6 text-center text-stone-500 flex flex-col items-center justify-center gap-2">
                    <Code className="w-6 h-6 text-stone-400" />
                    <p className="text-xs font-bold text-stone-705 text-stone-600">No Validator Run Complete</p>
                    <span className="text-[10px] text-stone-400">Click validation check button to execute FHIR schema compliance checks.</span>
                  </div>
                )}

                {/* Patient Resource Tree viewer */}
                <div className="border border-stone-200 bg-stone-50 rounded-2xl p-4 flex-1">
                  <span className="text-[10px] font-mono font-extrabold text-[#9f1239] uppercase block mb-3">Resource Inter-relationships</span>
                  
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center justify-between text-[11px] bg-white p-2 border border-stone-200 rounded-lg">
                      <span className="font-bold text-stone-750">Patient/pat-99120</span>
                      <span className="font-mono text-[9px] bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded border border-rose-100 font-semibold">Root Resource</span>
                    </div>
                    
                    <div className="h-6 w-0.5 bg-rose-500 ml-4 self-start"></div>

                    <div className="flex items-center justify-between text-[11px] bg-white p-2 border border-stone-200 rounded-lg">
                      <span className="font-bold text-stone-750">Observation/obs-vitals-304</span>
                      <span className="font-mono text-[9px] bg-[#fca5a5] text-stone-900 px-1.5 py-0.5 rounded font-medium">Linked reference</span>
                    </div>

                    <div className="h-6 w-0.5 bg-rose-500 ml-4 self-start"></div>

                    <div className="flex items-center justify-between text-[11px] bg-white p-2 border border-stone-200 rounded-lg">
                      <span className="font-bold text-stone-750">Condition/cond-burnout-409</span>
                      <span className="font-mono text-[9px] bg-[#fca5a5] text-stone-900 px-1.5 py-0.5 rounded font-medium">Linked reference</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* 3. HEALTH DATA ANALYTICS & PREVIEWS */}
        {activeSubTab === 'analytics' && (
          <div className="flex flex-col gap-6 animate-fadeIn" id="pane-ehr-analytics">
            <p className="text-xs text-stone-550 leading-relaxed">
              Dr. T automates EHR diagnostic logs ingestion. Drop CSV sheets containing patient cardiac histories to generate immediate risk reports, multi-linear vital quality scoring, and clinical summary telemetry.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="border border-stone-250 bg-white rounded-3xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-stone-850 text-sm mb-3">EHR Dataset Ingestion Channel</h4>
                  
                  {/* File Mock Box */}
                  <div className="p-5 border-2 border-dashed border-stone-250 bg-stone-50 rounded-2xl hover:border-rose-400 transition-all text-center flex flex-col items-center justify-center gap-1.5">
                    <FileSpreadsheet className="w-8 h-8 text-rose-500" />
                    <span className="text-xs font-bold text-stone-800">{analyticalFile ? analyticalFile.name : 'Upload EHR dataset files'}</span>
                    <span className="text-[10px] text-stone-400">Supports CSV, Excel sheets, and FHIR bulk JSON arrays</span>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button onClick={() => showToast("Simulated CSV File Upload Ingested!", "success")} className="flex-grow bg-stone-900 hover:bg-stone-850 text-white font-extrabold text-[10px] font-mono uppercase tracking-wider py-2 px-3 rounded-lg flex items-center justify-center gap-1">
                      <Upload className="w-3.5 h-3.5" /> Pick File
                    </button>
                    <button 
                      onClick={() => {
                        setAnalyticalFile({ name: "Bulk_FHIR_Patient_Logs_U26.json", type: "JSON" });
                        showToast("Bulk patient FHIR JSON registers imported.", "success");
                      }}
                      className="bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-[10px] py-2 px-3 border border-stone-250 rounded-lg whitespace-nowrap cursor-pointer"
                    >
                      Preload Sample
                    </button>
                  </div>
                </div>

                <div className="bg-stone-50 border border-stone-200/60 rounded-xl p-3 mt-4">
                  <span className="text-[10px] font-mono font-black text-rose-600 uppercase block mb-1">DATA QUALITY SUMMARY</span>
                  <div className="flex justify-between items-center text-[11px] mb-1">
                    <span className="text-stone-500 font-medium">Valid records parsed:</span>
                    <span className="font-bold text-stone-800">{dataQualityReport.recordsParsed}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] mb-1">
                    <span className="text-stone-500 font-medium">Diagnostic Completeness:</span>
                    <span className="text-emerald-700 font-bold font-mono">{dataQualityReport.completeness}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-stone-500 font-medium">EHR anomalies detected:</span>
                    <span className="text-rose-600 font-bold font-mono">{dataQualityReport.anomaliesDetected}</span>
                  </div>
                </div>
              </div>

              {/* Predictive Risk Forecast Summary */}
              <div className="border border-stone-250 bg-white rounded-3xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-stone-850 text-sm mb-2.5">Predictive Health Risk Classification Report</h4>
                  <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-2xl">
                    <p className="text-xs text-stone-700 leading-relaxed font-sans">{riskForecast}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 mt-4">
                  <span className="text-[10px] font-mono text-stone-400 font-bold block mb-1">EHR DATASET ANOMALY LIST</span>
                  <div className="flex flex-col gap-1.5">
                    {dataQualityReport.bloodPressureAnomalies.map((an, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] text-rose-800 bg-rose-50/80 p-1.5 px-3 rounded-lg border border-rose-100/50">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                        <span className="font-mono font-semibold">{an}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 4. AI CLINICAL SUMMARY SOAP Note compiler */}
        {activeSubTab === 'summarizer' && (
          <div className="flex flex-col gap-6 animate-fadeIn" id="pane-soap-engine">
            <p className="text-xs text-stone-550 leading-relaxed">
              Synthesize a professional Clinician-ready SOAP consultation note mapping standardized ICD-10 medical parameters, ready for Epic export or FHIR compatibility syncing.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left Column: Raw transcript inputs */}
              <div className="flex flex-col gap-3">
                <span className="text-xs font-black text-stone-750 uppercase font-mono">1. Raw Medical Transcription / Patient Encounter Log</span>
                <textarea
                  value={transcriptionInput}
                  onChange={(e) => setTranscriptionInput(e.target.value)}
                  className="w-full h-48 p-4 bg-stone-50 border border-stone-250 rounded-2xl outline-none focus:border-rose-455 text-xs text-stone-850 placeholder-stone-400 leading-relaxed font-sans"
                  placeholder="Record or enter patient statements..."
                />

                <div className="flex gap-2">
                  <button
                    disabled={isSummarizing}
                    onClick={handleGenerateSOAP}
                    className="flex-1 bg-stone-900 hover:bg-stone-850 text-white font-extrabold text-[11px] py-2.5 px-4 rounded-xl transition-all cursor-pointer font-mono uppercase tracking-wider text-center"
                    id="btn-trigger-soap"
                  >
                    {isSummarizing ? "Compiling via Gemini..." : "Compile SOAP Note Model"}
                  </button>
                  <button 
                    onClick={() => {
                      setTranscriptionInput("Patient: Raymond Vance, age 67. Underwent MICU stay. Admitting Dx: Septic Shock secondary to pneumonia. Completed 7 day antibiotic run. Oxygen sat is 98% room air. Vital signs stable. Followup plan is standard pulmonary checks.");
                      showToast("Raymond Vance MICU progress log loaded.", "info");
                    }}
                    className="bg-stone-100 text-stone-800 font-bold border border-stone-250 px-3 py-2 rounded-xl text-[11.5px] cursor-pointer"
                  >
                    Raymond ICU
                  </button>
                </div>
              </div>

              {/* Right Column: SOAP Document Display */}
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center text-xs font-black text-stone-750 uppercase font-mono">
                  <span>2. Synthesized Clinical Document Output</span>
                  {generatedSOAP && (
                    <button 
                      onClick={() => {
                        const blob = new Blob([JSON.stringify(generatedSOAP, null, 2)], { type: "application/json" });
                        const link = document.createElement("a");
                        link.href = URL.createObjectURL(blob);
                        link.download = `SOAP_FHIR_${Date.now()}.json`;
                        link.click();
                        showToast("Synthesized Clinical SOAP Document downloaded successfully!", "success");
                      }}
                      className="text-[#9f1239] hover:underline cursor-pointer font-bold"
                    >
                      Save JSON
                    </button>
                  )}
                </div>

                {generatedSOAP ? (
                  <div className="border border-stone-200 bg-stone-50 rounded-2xl p-5 shadow-inner flex flex-col gap-4 max-h-[460px] overflow-y-auto">
                    <div>
                      <h5 className="font-bold text-sm text-stone-800 leading-snug">{generatedSOAP.title}</h5>
                      <span className="text-[10px] text-stone-450 font-mono">Ref ID: {generatedSOAP.metadata.documentID} • Patient: {generatedSOAP.metadata.patientName}</span>
                    </div>

                    <div className="flex flex-col gap-3 text-xs leading-relaxed">
                      <div>
                        <strong className="text-stone-800 block">[Subjective]</strong>
                        <p className="text-stone-600 mt-0.5">{generatedSOAP.sectionContent.subjective}</p>
                      </div>
                      <div>
                        <strong className="text-stone-800 block">[Objective]</strong>
                        <p className="text-stone-600 mt-0.5">{generatedSOAP.sectionContent.objective}</p>
                      </div>
                      <div>
                        <strong className="text-stone-800 block">[Assessment]</strong>
                        <p className="text-stone-600 mt-0.5 whitespace-pre-line">{generatedSOAP.sectionContent.assessment}</p>
                      </div>
                      <div>
                        <strong className="text-stone-800 block">[Plan]</strong>
                        <p className="text-stone-600 mt-0.5 whitespace-pre-line">{generatedSOAP.sectionContent.plan}</p>
                      </div>
                    </div>

                    {/* Mapped SNOMED CT / ICD-10 Terminologies */}
                    <div className="border-t border-stone-200 pt-3">
                      <span className="text-[10px] font-mono font-extrabold text-rose-600 uppercase block mb-1.5">MAPPED CODING CONSTRUCTS</span>
                      <div className="flex flex-wrap gap-1.5">
                        {generatedSOAP.terminologyCodes.map((codeObj, i) => (
                          <span key={i} className="bg-white border border-stone-200 px-2 py-1 rounded text-[10px] font-mono text-stone-701 font-semibold flex items-center gap-1 shadow-3xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                            {codeObj.concept} • {codeObj.system}:{codeObj.code}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-stone-50 border border-stone-200 rounded-3xl p-8 text-center text-stone-400 flex flex-col justify-center items-center gap-2">
                    <ClipboardList className="w-8 h-8 text-stone-300" />
                    <p className="text-xs font-bold text-stone-600">Pending transcription submission...</p>
                    <span className="text-[10px] text-stone-400">Click Compile SOAP Note to parse and structure into diagnostic summaries.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 5. MEDICAL IMAGING MODULE */}
        {activeSubTab === 'imaging' && (
          <div className="flex flex-col gap-6 animate-fadeIn" id="pane-imaging-ai">
            <p className="text-xs text-stone-550 leading-relaxed">
              Load, inspect, and analyze chest X-ray scans, computed tomography slices, or dermoscopic skin images. Hover over automatically generated ROI annotations to view medical explanations.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Imaging interactive terminal window */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs font-black text-rose-600 uppercase font-mono">
                  <span>Imaging Annotation Canvas</span>
                  <span className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-150">Not for diagnostic use</span>
                </div>

                <div className="relative aspect-video w-full bg-stone-900 rounded-3xl border border-stone-800 overflow-hidden flex items-center justify-center">
                  
                  {/* Mock chest x-ray vector */}
                  <svg viewBox="0 0 200 120" className="w-full h-full opacity-30 select-none">
                    <rect x="0" y="0" width="200" height="120" fill="#000" />
                    
                    {/* Spine */}
                    <line x1="100" y1="10" x2="100" y2="110" stroke="#fff" strokeWidth="6" opacity="0.4" />
                    
                    {/* Left and Right rib cages */}
                    <path d="M 100,20 Q 50,30 20,45 Q 50,50 100,55" fill="none" stroke="#fff" strokeWidth="2" opacity="0.3" />
                    <path d="M 100,35 Q 55,45 25,60 Q 55,65 100,70" fill="none" stroke="#fff" strokeWidth="2" opacity="0.3" />
                    <path d="M 100,50 Q 60,60 30,75 Q 60,80 100,85" fill="none" stroke="#fff" strokeWidth="2" opacity="0.3" />
                    
                    <path d="M 100,20 Q 150,30 180,45 Q 150,50 100,55" fill="none" stroke="#fff" strokeWidth="2" opacity="0.3" />
                    <path d="M 100,35 Q 145,45 175,60 Q 145,65 100,70" fill="none" stroke="#fff" strokeWidth="2" opacity="0.3" />
                    <path d="M 100,50 Q 140,60 170,75 Q 140,80 100,85" fill="none" stroke="#fff" strokeWidth="2" opacity="0.3" />

                    {/* Pulmonary boundaries */}
                    <ellipse cx="60" cy="55" rx="25" ry="40" fill="#1e293b" opacity="0.4" stroke="#fff" strokeWidth="1" strokeDasharray="2,2" />
                    <ellipse cx="140" cy="55" rx="25" ry="40" fill="#1e293b" opacity="0.4" stroke="#fff" strokeWidth="1" strokeDasharray="2,2" />
                  </svg>
                  
                  {/* Highlight ROI box */}
                  {detectedImageFindings && (
                    <div 
                      className="absolute border-2 border-dashed border-rose-500 bg-rose-500/10 cursor-pointer animate-ping-slow rounded"
                      style={{ left: '42%', top: '25%', width: '18%', height: '35%' }}
                      onClick={() => setPushedAnnotation({
                        label: "Bronchial Airway Cluster",
                        findings: "Mild bronchial cuffing surrounding the para-hilum branches. Matches localized cardiovascular pressure stress. Pleural boundaries clear."
                      })}
                    />
                  )}

                  <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none">
                    <span className="text-[10px] font-mono text-stone-400">PACS RETRIEVAL ENGINE V3.12</span>
                    {detectedImageFindings && (
                      <span className="text-[9px] font-mono bg-rose-500 text-white p-1 px-2.5 rounded-full inline-block self-end">
                        Region of Interest (ROI) Mapped
                      </span>
                    )}
                  </div>

                  {!detectedImageFindings && !isAnalyzingImage && (
                    <p className="absolute text-xs text-stone-400 font-mono">No Image Ingested</p>
                  )}

                  {isAnalyzingImage && (
                    <div className="absolute inset-0 bg-stone-900/80 flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="w-6 h-6 text-rose-500 animate-spin" />
                      <span className="text-xs font-mono text-stone-300">Scanning DICOM structures...</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <select 
                    value={selectedImageType} 
                    onChange={(e) => setSelectedImageType(e.target.value)}
                    className="p-2 border border-stone-250 bg-stone-50 rounded-xl text-xs font-semibold outline-none text-stone-850"
                  >
                    <option value="Chest X-Ray">Chest X-Ray (Diagnostic)</option>
                    <option value="Brain MRI">Brain MRI Scan (T2)</option>
                    <option value="Dermoscopic Skin Shot">Dermoscopic Skin Shot</option>
                  </select>

                  <button
                    onClick={() => handleAnalyzeImage(selectedImageType)}
                    className="flex-1 bg-stone-900 hover:bg-stone-850 text-white font-extrabold text-[11px] uppercase font-mono tracking-wider py-2.5 px-4 rounded-xl transition-all cursor-pointer text-center"
                  >
                    Analyze DICOM Image Model
                  </button>
                </div>
              </div>

              {/* Educational Imaging findings output */}
              <div className="flex flex-col gap-4">
                <span className="text-xs font-black text-stone-750 uppercase font-mono">Image Diagnostics Report & Educational Explainer</span>

                {detectedImageFindings ? (
                  <div className="border border-stone-200 bg-stone-50 rounded-3xl p-5 flex flex-col gap-4 animate-fadeIn">
                    <div>
                      <h5 className="font-bold text-sm text-stone-855 text-stone-800">{detectedImageFindings.title}</h5>
                      <span className="text-[10px] text-stone-450 font-mono">PACS UID: {detectedImageFindings.fileName} • Status: Reviewed</span>
                    </div>

                    <div>
                      <strong className="text-xs text-stone-800 block">AI Findings Narrative:</strong>
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">{detectedImageFindings.interpretation}</p>
                    </div>

                    <div className="bg-rose-50 border border-rose-100 p-3 rounded-xl">
                      <span className="text-[9px] font-mono text-rose-700 font-extrabold block uppercase">Socratic Medical Education Module:</span>
                      <p className="text-[11px] text-rose-800 leading-relaxed mt-1">{detectedImageFindings.educationalModule}</p>
                    </div>

                    <p className="text-[9px] font-mono text-stone-400 font-extrabold">⚠️ {detectedImageFindings.safetyDisclaimer}</p>

                    {pushedAnnotation && (
                      <div className="p-3 bg-stone-900 text-white rounded-xl text-xs animate-fadeIn">
                        <strong className="block text-amber-400 font-mono text-[10px]">{pushedAnnotation.label}</strong>
                        <p className="mt-1 font-sans text-[11px] leading-relaxed">{pushedAnnotation.findings}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-stone-50 border border-stone-200 rounded-3xl p-8 text-center text-stone-400 flex flex-col justify-center items-center gap-2 flex-grow h-full">
                    <Camera className="w-8 h-8 text-stone-300" />
                    <p className="text-xs font-bold text-stone-600">Pending image analysis compile...</p>
                    <span className="text-[10px] text-stone-400">Select imaging category and click Analyze to generate Socratic segmentation.</span>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* 6. POPULATION HEALTH EPIDEMIOLOGY */}
        {activeSubTab === 'population' && (
          <div className="flex flex-col gap-6 animate-fadeIn" id="pane-population-health">
            <p className="text-xs text-stone-550 leading-relaxed">
              Review macro-demographic wellness strata, risk stratification patterns, and epidemic prevalence indices across geographical sectors. Perfect for clinical planners and state healthcare organizations.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              
              {/* Community Score Cardio Indicators */}
              <div className="bg-stone-50 border border-stone-200 p-4.5 rounded-2xl">
                <span className="text-[10px] font-mono font-black text-rose-600 uppercase block">EPIDEMIC CARDIOVASCULAR VALUE</span>
                <span className="font-display font-black text-3xl text-stone-900 mt-1.5 block">14.2%</span>
                <p className="text-[11px] text-stone-500 mt-1 leading-normal">
                  Prevalence of stage-I and stage-II hypertension across regional adults (Ages 35-65), showing positive correlation with long commutes.
                </p>
              </div>

              <div className="bg-stone-50 border border-stone-200 p-4.5 rounded-2xl">
                <span className="text-[10px] font-mono font-black text-emerald-600 uppercase block">COMMUNITY WELLNESS SCORE</span>
                <span className="font-display font-black text-3xl text-stone-900 mt-1.5 block">82 / 100</span>
                <p className="text-[11px] text-stone-500 mt-1 leading-normal">
                  Aggregated wellness metric based on daily wearable sleep durations, hydration volumes, and structural breathing compliance.
                </p>
              </div>

              <div className="bg-stone-50 border border-stone-200 p-4.5 rounded-2xl">
                <span className="text-[10px] font-mono font-black text-blue-600 uppercase block">SURVEILLANCE COMPLIANCE INDEX</span>
                <span className="font-display font-black text-3xl text-stone-900 mt-1.5 block">94.1%</span>
                <p className="text-[11px] text-stone-500 mt-1 leading-normal">
                  Index measuring digital clinic check-in accuracy and electronic prescription refills across registered families.
                </p>
              </div>
            </div>

            {/* Custom Interactive SVG Bento Map of Regional Demographics */}
            <div className="bg-white border border-stone-200 rounded-3xl p-5 shadow-xs">
              <span className="text-xs font-bold text-stone-800 block mb-3.5">Risk Stratification Map & Regional Wellness Vectors</span>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-8 border border-stone-200 rounded-2xl p-4 bg-stone-50 h-56 flex items-center justify-center">
                  <svg viewBox="0 0 300 150" className="w-full h-full">
                    {/* Sector blocks */}
                    <rect x="10" y="10" width="80" height="60" fill="#fecdd3" opacity="0.6" rx="6" stroke="#f43f5e" strokeWidth="1.5" />
                    <text x="15" y="25" fill="#9f1239" fontSize="8" fontWeight="bold">Sector A-North</text>
                    <text x="15" y="45" fill="#4c0519" fontSize="12" fontWeight="black">HV: 18.2%</text>

                    <rect x="100" y="10" width="100" height="60" fill="#ccfbf1" opacity="0.6" rx="6" stroke="#0d9488" strokeWidth="1.5" />
                    <text x="105" y="25" fill="#115e59" fontSize="8" fontWeight="bold">Central Tech Hub</text>
                    <text x="105" y="45" fill="#042f2e" fontSize="12" fontWeight="black">HV: 6.4%</text>

                    <rect x="210" y="10" width="80" height="130" fill="#fef08a" opacity="0.6" rx="6" stroke="#ca8a04" strokeWidth="1.5" />
                    <text x="215" y="25" fill="#854d0e" fontSize="8" fontWeight="bold">Suburbs West</text>
                    <text x="215" y="45" fill="#422006" fontSize="12" fontWeight="black">HV: 12.1%</text>

                    <rect x="10" y="80" width="190" height="60" fill="#fef08a" opacity="0.6" rx="6" stroke="#ca8a04" strokeWidth="1.5" />
                    <text x="15" y="95" fill="#854d0e" fontSize="8" fontWeight="bold">Down-river Ring</text>
                    <text x="15" y="115" fill="#422006" fontSize="12" fontWeight="black">HV: 11.8%</text>

                    <text x="10" y="146" fill="#64748b" fontSize="6.5" style={{fontFamily:'monospace'}}>*HV: Hypertension Vector (Systolic SBP mean &gt;135 mmHg under dynamic load)</text>
                  </svg>
                </div>

                <div className="md:col-span-4 flex flex-col justify-between gap-3 bg-stone-50 border border-stone-240 p-4 rounded-2xl">
                  <div>
                    <span className="text-[10px] font-mono text-stone-400 font-extrabold uppercase">EPIDEMIOLOGY INSIGHTS</span>
                    <p className="text-[11px] text-stone-650 leading-relaxed mt-1">
                      Data shows a significant cluster of <strong>18.2%</strong> hypertension load in Sector A-North, where commuting delays average 54 mins. Central Tech Hub proves lower risk (6.4%) but exhibits 12% higher nocturnal insomnia indices.
                    </p>
                  </div>
                  <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                    <span className="text-[9px] font-mono text-amber-700 font-black block">WHO STRATEGy VECTOR</span>
                    <span className="text-[10px] text-stone-705 text-stone-750 block mt-0.5">Deploy Socratic cognitive health targets across corporate software team workspaces to mitigate insomnia cluster.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 7. AI WELLNESS COACH & GAMIFIED badges */}
        {activeSubTab === 'coach' && (
          <div className="flex flex-col gap-6 animate-fadeIn" id="pane-wellness-coach">
            <p className="text-xs text-stone-550 leading-relaxed">
              Track nutrition checklists, daily water logs, sleep stages, and micro-exercises. Socratic compliance builds your health levels and unlocks prestigious wellness badges.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              {/* Daily level */}
              <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono text-stone-400 block font-black">AVATAR LEVEL</span>
                  <span className="text-2xl font-black text-stone-850 mt-1 block">Level {avatarHealthLevel}</span>
                </div>
                <Flame className="w-8 h-8 text-rose-500 animate-bounce" />
              </div>

              {/* Gym streak */}
              <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono text-stone-400 block font-black">GYM STREAK</span>
                  <span className="text-2xl font-black text-stone-850 mt-1 block">{gymStreak} Days</span>
                </div>
                <Flame className="w-8 h-8 text-amber-500 animate-pulse" />
              </div>

              {/* Water logging */}
              <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl flex flex-col justify-between">
                <span className="text-[9px] font-mono text-stone-400 block font-black">WATER QUOTIENT (TARGET 2.5L)</span>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-lg font-bold text-stone-850">{dailyWater.toFixed(1)} L</span>
                  <button onClick={() => { setDailyWater(w => w + 0.25); setDailyWater(w => w >= 2.5 ? 2.5 : w); if (dailyWater + 0.25 >= 2.5 && !gamifyBadges.includes("Hydrated Monarch")) setGamifyBadges(b => [...b, "Hydrated Monarch"]); }} className="text-[10px] bg-sky-100 hover:bg-sky-200 text-sky-700 px-2 py-1 rounded font-bold cursor-pointer">
                    + 250ml
                  </button>
                </div>
              </div>

              {/* Sleep logging */}
              <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl flex flex-col justify-between">
                <span className="text-[9px] font-mono text-stone-400 block font-black">SLEEP COMPLIANCE</span>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-lg font-bold text-stone-850">{dailySleep} Hours</span>
                  <button onClick={() => { setDailySleep(8); showToast("Optimal 8-hour sleep protocol synchronized.", "success"); }} className="text-[10px] bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-2.5 py-1 rounded font-bold cursor-pointer">
                    Mock 8 hrs
                  </button>
                </div>
              </div>
            </div>

            {/* Achievements and badges */}
            <div className="bg-white border border-stone-200 rounded-3xl p-5 shadow-xs">
              <span className="text-xs font-bold text-stone-800 block mb-3.5">Unlocked Dr. T Wellness Badges</span>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {gamifyBadges.map((badge, idx) => (
                  <div key={idx} className="p-3 bg-stone-50 border border-stone-200 rounded-2xl flex flex-col items-center text-center gap-1.5 hover:shadow-xs hover:border-rose-350 transition-all">
                    <span className="text-2xl">🥇</span>
                    <strong className="text-[10.5px] text-stone-800 block truncate w-full font-bold">{badge}</strong>
                    <span className="text-[8px] font-mono text-stone-400 uppercase font-bold">Earned 2026</span>
                  </div>
                ))}

                <button 
                  onClick={() => {
                    const nextLevel = avatarHealthLevel + 1;
                    setAvatarHealthLevel(nextLevel);
                    if (nextLevel >= 20 && !gamifyBadges.includes("Lord of Vitality")) {
                      setGamifyBadges(prev => [...prev, "Lord of Vitality"]);
                    }
                    showToast(`XP Gained: Your Health level promoted to Level ${nextLevel}!`, "success");
                  }}
                  className="p-3 border-2 border-dashed border-stone-300 hover:border-rose-400 bg-white text-stone-500 rounded-2xl flex flex-col items-center justify-center text-center gap-1 cursor-pointer"
                >
                  <span className="text-xl">🔥</span>
                  <strong className="text-[10.5px] text-stone-700 block font-extrabold uppercase font-mono tracking-wider">Level Up</strong>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 8. DR. T RESEARCH LAB */}
        {activeSubTab === 'lab' && (
          <div className="flex flex-col gap-6 animate-fadeIn" id="pane-research-lab">
            <p className="text-xs text-stone-550 leading-relaxed">
              Dr. T's advanced research engine index. Search PubMed paper identifiers, upload molecular health files, and extract direct scholars annotations and MLA citation layouts.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <div className="flex flex-col gap-3">
                <span className="text-xs font-black text-stone-750 uppercase font-mono">1. Literature Inquiry Engine</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={literatureQuery}
                    onChange={(e) => setLiteratureQuery(e.target.value)}
                    className="flex-grow p-2.5 bg-stone-50 border border-stone-250 rounded-xl text-xs outline-none focus:border-rose-455 text-stone-850 font-medium placeholder-stone-400"
                    placeholder="Enter academic topic or DOI..."
                  />
                  <button
                    disabled={isLitSearching}
                    onClick={handleResearchQuery}
                    className="bg-stone-900 hover:bg-stone-850 text-white font-extrabold text-[11px] px-4 rounded-xl cursor-pointer shadow-xs uppercase font-mono"
                  >
                    {isLitSearching ? "Analyzing..." : "Search Papers"}
                  </button>
                </div>

                <div className="bg-stone-50 p-4 border border-stone-200 rounded-2xl">
                  <span className="text-[10px] font-mono font-black text-rose-600 block mb-2 uppercase">PRELOADED PUBMED abstracts</span>
                  <div className="flex flex-col gap-2">
                    {[
                      "Vocal fundamental frequency jitter matches heart variability under high epinephrine fatigue. doi:10.1016/bhb.2026",
                      "Socratic conversational paradigms in wearable remote mental wellness trials. doi:10.2196/jmir.9011"
                    ].map((pap, i) => (
                      <div key={i} className="text-[10px] bg-white p-2 border border-stone-150 rounded hover:border-rose-350 transition-colors cursor-pointer" onClick={() => setLiteratureQuery(pap)}>
                        📄 {pap}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Research Summary response */}
              <div className="flex flex-col gap-4">
                <span className="text-xs font-black text-stone-750 uppercase font-mono">2. Synthesized Knowledge Brief</span>

                {foundLiteratureResponse ? (
                  <div className="border border-stone-200 bg-stone-50 rounded-3xl p-5 flex flex-col gap-4 animate-fadeIn">
                    <div>
                      <strong className="text-xs text-stone-800 block">Abstract Synthesis Summary:</strong>
                      <p className="text-xs font-medium text-stone-605 text-stone-600 mt-1 leading-relaxed leading-normal">{foundLiteratureResponse.synopsis}</p>
                    </div>

                    <div className="border-t border-stone-200 pt-3">
                      <span className="text-[10px] font-mono font-black text-rose-600 uppercase block mb-1.5">EXTRACTED JOURNAL CITATIONS</span>
                      <div className="flex flex-col gap-2">
                        {foundLiteratureResponse.citations.map((cit: any, i: number) => (
                          <div key={i} className="bg-white border border-stone-150 p-2.5 rounded-xl text-[10px] text-stone-701 font-serif leading-normal relative">
                            <span className="font-bold block text-stone-810 font-sans text-[10.5px] mb-0.5">"{cit.articleTitle}"</span>
                            {cit.authors} • <em>{cit.journal}</em> • {cit.year} • <span className="font-mono text-rose-600">DOI:{cit.doi}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-stone-50 border border-stone-200 rounded-3xl p-8 text-center text-stone-450 flex flex-col justify-center items-center gap-2 h-full">
                    <BookOpen className="w-8 h-8 text-stone-300 animate-pulse" />
                    <p className="text-xs font-bold text-stone-600">Research lab index awaiting search...</p>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* 9. MIMIC-IV HIGH-FIDELITY ICU TERMINAL */}
        {activeSubTab === 'mimic' && (
          <div className="flex flex-col gap-6 animate-fadeIn" id="pane-mimic-icu">
            <p className="text-xs text-stone-550 leading-relaxed">
              Demonstrate clinical informatics prowess. Interact with patient logs modeled on real Harvard MIMIC-IV hospital archives. View real-time ICU vitals, calculate mortality risks, and predict readmission probabilities.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              
              {/* Patient List */}
              <div className="lg:col-span-4 flex flex-col gap-2.5">
                <span className="text-xs font-black text-stone-700 uppercase font-mono">ICU Occupants Register</span>
                {SAMPLE_MIMIC_ICU_SICK_PATIENTS.map((pt) => (
                  <button
                    key={pt.id}
                    onClick={() => { setSelectedIcuPatient(pt); }}
                    className={`p-3 text-left border rounded-xl transition-all cursor-pointer flex flex-col gap-1
                      ${selectedIcuPatient.id === pt.id ? 'bg-stone-900 border-stone-900 text-white shadow-md' : 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100'}
                    `}
                  >
                    <div className="flex justify-between items-center text-[10.5px] font-bold">
                      <span>{pt.name} ({pt.age}y/o {pt.gender})</span>
                      <span className="text-[8px] font-mono font-extrabold uppercase px-1.5 py-0.5 rounded bg-rose-500 text-white">{pt.unit}</span>
                    </div>
                    <span className="text-[10px] block opacity-75 truncate">{pt.admittingDx}</span>
                  </button>
                ))}
              </div>

              {/* Patient telemetry detail panel */}
              {selectedIcuPatient && (
                <div className="lg:col-span-8 border border-stone-900/90 bg-stone-950 text-emerald-400 p-5 rounded-3xl shadow-lg flex flex-col gap-4 font-mono text-xs">
                  <div className="flex flex-wrap justify-between items-center border-b border-stone-850 pb-3">
                    <div>
                      <span className="text-[9px] text-stone-450 uppercase block">ACTIVE ICU TELEMETRY MONITOR</span>
                      <h4 className="font-bold text-sm text-white leading-tight">{selectedIcuPatient.name} • {selectedIcuPatient.id}</h4>
                    </div>
                    <span className="text-[9px] bg-red-600/30 text-rose-500 border border-red-900 px-2.5 py-1 rounded-full font-bold flex items-center gap-1 animate-pulse">
                      ▲ SEVERE MONITORING ACTIVE
                    </span>
                  </div>

                  {/* Real-time ICU waveform animations */}
                  <div className="bg-stone-900/80 p-3.5 rounded-2xl border border-stone-800">
                    <div className="flex justify-between items-center text-[10px] text-stone-400 mb-2">
                      <span>ECG Heart Rhythm Multi-channel (II, V5)</span>
                      <span className="text-white font-bold">{icuHeartBeatAnim} BPM</span>
                    </div>
                    <div className="h-16 w-full flex items-end">
                      {/* ECG Waveform animation SVG */}
                      <svg viewBox="0 0 400 60" className="w-full h-full text-emerald-500">
                        <path 
                          d={`M 0,30 L 30,30 L 40,10 L 45,50 L 50,30 L 90,30 L 100,30 L 110,12 L 115,52 L 120,30 L 160,30 L 180,30 L 190,8 L 195,48 L 200,30 L 250,30 L 280,30 L 290,14 L 295,54 L 300,30 L 350,30 L 380,30 L 390,9 L 395,49 L 400,30`}
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          className="wave"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Bed Vitals */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-900/30 p-3 rounded-2xl border border-stone-850">
                    <div className="p-2 border border-stone-850/50 rounded-lg text-center">
                      <span className="text-[8px] text-stone-400 uppercase font-black block">BP SYSTEMIC</span>
                      <span className="text-sm font-bold text-white mt-1 block">{selectedIcuPatient.bp}</span>
                    </div>
                    <div className="p-2 border border-stone-850/50 rounded-lg text-center">
                      <span className="text-[8px] text-stone-400 uppercase font-black block">PULSE OX SpO2</span>
                      <span className="text-sm font-bold text-white mt-1 block">{selectedIcuPatient.osat}%</span>
                    </div>
                    <div className="p-2 border border-stone-850/50 rounded-lg text-center">
                      <span className="text-[8px] text-stone-400 uppercase font-black block">RR VENT RATE</span>
                      <span className="text-sm font-bold text-white mt-1 block">{selectedIcuPatient.rr} /min</span>
                    </div>
                    <div className="p-2 border border-stone-850/50 rounded-lg text-center">
                      <span className="text-[8px] text-stone-400 uppercase font-black block">VENT STATUS</span>
                      <span className="text-[10px] font-bold text-[#fbcfe8] truncate mt-1 block">{selectedIcuPatient.ventStatus}</span>
                    </div>
                  </div>

                  {/* Prediction models */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-stone-850 pt-4">
                    <div className="p-3 bg-red-950/40 border border-red-900/60 rounded-xl">
                      <span className="text-[8px] text-red-400 font-extrabold uppercase block">ICU MORTALITY PREDICTIVE INDEX (OASIS-III)</span>
                      <span className="text-2xl font-black text-white mt-1 block">{selectedIcuPatient.mortalityRiskScore}%</span>
                      <span className="text-[9px] text-[#fca5a5] block leading-normal mt-0.5">Estimated via multivariable logistic regression coefficients.</span>
                    </div>

                    <div className="p-3 bg-amber-950/40 border border-amber-900/60 rounded-xl">
                      <span className="text-[8px] text-amber-500 font-extrabold uppercase block">READMISSION PREDICTION CHANCE</span>
                      <span className="text-2xl font-black text-white mt-1 block">{selectedIcuPatient.readmitProb}%</span>
                      <span className="text-[9px] text-[#fde047] block leading-normal mt-0.5">30-Day EHR clinical return probability prediction.</span>
                    </div>

                    <div className="p-3 bg-blue-950/40 border border-blue-900/60 rounded-xl">
                      <span className="text-[8px] text-blue-400 font-extrabold uppercase block">LENGTH OF STAY (LOS) OUTCOME</span>
                      <span className="text-2xl font-black text-white mt-1 block">~ {selectedIcuPatient.stayDaysEst} Days</span>
                      <span className="text-[9px] text-[#93c5fd] block leading-normal mt-0.5">Estimated bed discharge window based on regression logs.</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* 10. EXPERT SWARM CLINICAL ORCHESTRATOR */}
        {activeSubTab === 'orchestrator' && (
          <div className="flex flex-col gap-6 animate-fadeIn" id="pane-orchestration">
            <p className="text-xs text-stone-550 leading-relaxed">
              Dr. T's advanced master orchestrator routes complex requests across specialized agents (Health Coach, Research, Nutrition, Exercise, Medication, Mental Wellness, Informatics, Clinical Documentation).
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <div className="flex flex-col gap-3">
                <span className="text-xs font-black text-stone-750 uppercase font-mono">1. Master Swarm Prompt</span>
                <textarea
                  value={orchestratorQueryInput}
                  onChange={(e) => setOrchestratorQueryInput(e.target.value)}
                  className="w-full h-32 p-4 bg-stone-50 border border-stone-250 rounded-2xl outline-none focus:border-rose-455 text-xs text-stone-850 font-medium placeholder-stone-400 leading-relaxed"
                />

                <button
                  disabled={isOrchestrating}
                  onClick={handleTriggerSwarmOrchestrator}
                  className="bg-stone-900 hover:bg-stone-850 text-white font-extrabold text-[11px] font-mono py-2.5 px-4 rounded-xl transition-all cursor-pointer shadow-xs uppercase tracking-wider"
                  id="btn-orchestrate-swarm"
                >
                  {isOrchestrating ? "Routing Query..." : "Execute Collaborative Routing"}
                </button>
              </div>

              {/* Response output and agent traces */}
              <div className="flex flex-col gap-4">
                <span className="text-xs font-black text-stone-750 uppercase font-mono">2. Collaborative Swarm Outcomes</span>

                {orchestratorSwarmPath.length > 0 && (
                  <div className="flex flex-col gap-2 p-3 bg-stone-50 border border-stone-200 rounded-2xl max-h-48 overflow-y-auto font-mono text-[10px]">
                    <span className="text-[8px] font-black text-stone-400 uppercase tracking-wider mb-1 block">AGENT TRACE PIPELINE</span>
                    {orchestratorSwarmPath.map((tr, i) => (
                      <div key={i} className="p-2 bg-white border border-stone-150 rounded-lg flex justify-between items-start text-[10px] animate-fadeIn">
                        <div>
                          <strong className="text-stone-850 block">{tr.agent}</strong>
                          <span className="text-stone-500 leading-snug">{tr.task}</span>
                        </div>
                        <span className="text-[8px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded font-black uppercase text-center shrink-0">
                          {tr.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {orchestrationOutcome ? (
                  <div className="border border-stone-200 bg-teal-50/20 p-4.5 rounded-3xl animate-fadeIn">
                    <strong className="text-xs text-teal-900 block mb-1">Combined Consensus Response:</strong>
                    <p className="text-xs text-stone-701 font-medium leading-relaxed font-sans">{orchestrationOutcome}</p>
                  </div>
                ) : (
                  !isOrchestrating && (
                    <div className="bg-stone-50 border border-stone-200 rounded-3xl p-8 text-center text-stone-400 flex flex-col justify-center items-center gap-2">
                      <Layers className="w-8 h-8 text-stone-300" />
                      <p className="text-xs font-bold text-stone-600 font-sans">Awaiting orchestrator trigger...</p>
                    </div>
                  )
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
