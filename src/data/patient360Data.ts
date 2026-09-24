import { PatientMember360Profile } from '../types';

export const MOCK_PATIENT_360_PROFILES: PatientMember360Profile[] = [
  {
    id: 'profile-eleanor-vance',
    type: 'PATIENT_CLINICAL',
    name: 'Eleanor Vance (Synthetic Patient)',
    dob: '1958-03-14',
    age: 68,
    gender: 'Female',
    mrnOrMemberId: 'MRN-SYN-884920',
    payerOrSponsor: 'Aetna Medicare Advantage / Optum Rx',
    planOrTrialProtocol: 'Advantage Choice PPO (Plan ID: H5521-004)',
    primaryDiagnosis: 'Metastatic Non-Small Cell Lung Adenocarcinoma (EGFR Exon 19 del) & Atrial Fibrillation with HFrEF',
    keyPhenotypeOrCohort: 'High-Risk Oncology / Cardiotoxicity Surveillance & irAE Risk',
    summary360: '68-year-old female receiving targeted kinase inhibitor therapy with recent immunotherapy consult. Cross-referencing siloed Epic inpatient records, Cerner laboratory feeds, and Optum claims reveals an overlooked drop in left ventricular ejection fraction (LVEF 46%) and acute troponin elevations that create an active contraindication against proposed dual-agent checkpoint inhibition per FDA boxed warnings.',
    
    structuredRecords: [
      {
        id: 'rec-1',
        sourceSystem: 'Epic EHR',
        category: 'VITAL',
        code: '8480-6',
        display: 'Systolic Blood Pressure',
        value: '142 mmHg',
        date: '2026-09-18',
        status: 'abnormal',
        relevanceToQuestion: 'Elevated baseline pressure with irregular ventricular response'
      },
      {
        id: 'rec-2',
        sourceSystem: 'Epic EHR',
        category: 'VITAL',
        code: '8867-4',
        display: 'Heart Rate (Resting ECG)',
        value: '98 bpm (Irregularly Irregular)',
        date: '2026-09-18',
        status: 'abnormal',
        relevanceToQuestion: 'Documented Atrial Fibrillation paroxysms with rapid ventricular rate'
      },
      {
        id: 'rec-3',
        sourceSystem: 'Cerner Millennium',
        category: 'LAB',
        code: '33914-3',
        display: 'eGFR (CKD-EPI Formula)',
        value: '42 mL/min/1.73m²',
        date: '2026-09-19',
        status: 'abnormal',
        relevanceToQuestion: 'Stage 3b Chronic Kidney Disease; requires renal dosing adjustments'
      },
      {
        id: 'rec-4',
        sourceSystem: 'Cerner Millennium',
        category: 'LAB',
        code: '49563-0',
        display: 'High-Sensitivity Cardiac Troponin I',
        value: '42.8 ng/L (Ref < 14 ng/L)',
        date: '2026-09-19',
        status: 'abnormal',
        relevanceToQuestion: 'Subclinical myocardial injury marker indicating myocarditis risk'
      },
      {
        id: 'rec-5',
        sourceSystem: 'Cerner Millennium',
        category: 'LAB',
        code: '42637-9',
        display: 'N-Terminal Pro-BNP',
        value: '840 pg/mL (Ref < 125 pg/mL)',
        date: '2026-09-19',
        status: 'abnormal',
        relevanceToQuestion: 'Active hemodynamic neurohormonal stress and volume strain'
      },
      {
        id: 'rec-6',
        sourceSystem: 'Optum Claims Engine',
        category: 'CLAIM_PA',
        code: 'PA-DENIAL-D44',
        display: 'Prior Authorization: Pembrolizumab 200mg IV Infusion',
        value: 'DENIED: Medical Necessity Criteria Not Met',
        date: '2026-09-12',
        status: 'denied',
        relevanceToQuestion: 'Payer denied first-line IO due to missing documented LVEF and concurrent TKI toxicity hazard'
      },
      {
        id: 'rec-7',
        sourceSystem: 'Optum Claims Engine',
        category: 'PHARMACY_NDC',
        code: 'NDC 00310-0683-30',
        display: 'Osimertinib 80mg Oral Daily Tablet',
        value: '30-Day Supply Dispensed (Specialty Retail)',
        date: '2026-09-04',
        status: 'paid',
        relevanceToQuestion: 'Patient actively taking third-generation EGFR-TKI'
      },
      {
        id: 'rec-8',
        sourceSystem: 'Epic EHR',
        category: 'DIAGNOSIS_ICD10',
        code: 'ICD-10 C34.90',
        display: 'Malignant neoplasm of unspecified part of bronchus or lung',
        value: 'Primary Stage IVa with bone oligometastases',
        date: '2026-08-15',
        status: 'active',
        relevanceToQuestion: 'Oncologic indication for precision targeted therapy'
      },
      {
        id: 'rec-9',
        sourceSystem: 'Epic EHR',
        category: 'PROCEDURE_CPT',
        code: 'CPT 93306',
        display: 'Transthoracic Echocardiogram (TTE) 2D with Doppler',
        value: 'LVEF calculated at 46% (Declined from 56%)',
        date: '2026-09-16',
        status: 'active',
        relevanceToQuestion: 'Meets ASCO/ESMO definition of cancer therapy-related cardiac dysfunction (CTRCD)'
      }
    ],

    unstructuredDocuments: [
      {
        id: 'doc-path-01',
        title: 'Molecular Pathology & Genomic Sequencing Report',
        documentType: 'PATHOLOGY',
        date: '2026-08-20',
        facilityOrAgency: 'Memorial Comprehensive Cancer Center Genomics Lab',
        classification: 'Diagnostic Pathology - CAP/CLIA Accredited',
        sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        content: `SPECIMEN: Right lung core needle biopsy (Specimen ID: SP-2026-9941B).
CLINICAL HISTORY: 68-year-old female, never-smoker, presenting with persistent cough and left lower lobe nodule measuring 3.4 cm with mediastinal lymphadenopathy.
HISTOPATHOLOGIC DIAGNOSIS: Infiltrating adenocarcinoma with acinar and micropapillary architectural pattern. TTF-1 positive, Napsin A positive, p40 negative.
NEXT-GENERATION SEQUENCING (NGS) SUMMARY:
1. EGFR Mutation: Exon 19 deletion (c.2235_2249del, p.Glu746_Ala750del) detected at 48.2% variant allele frequency (VAF).
2. T790M resistance mutation: NEGATIVE (< 0.1% VAF).
3. C797S resistance mutation: NEGATIVE.
4. PD-L1 Immunohistochemistry (22C3 clone): Tumor Proportion Score (TPS) = 45% (Moderate expression).
PATHOLOGIST INTERPRETATION: Sensitizing EGFR exon 19 deletion strongly indicates clinical benefit from third-generation EGFR tyrosine kinase inhibitors (Osimertinib). Concomitant PD-L1 positivity (45%) should be interpreted cautiously; clinical trials (TATTON, CAURAL) demonstrate severe interstitial lung disease and enhanced immune-related toxicities when immune checkpoint inhibitors are administered concurrently or sequentially without adequate wash-out.`,
        keyExcerpts: [
          {
            id: 'ex-path-1',
            section: 'NGS Molecular Findings',
            text: 'EGFR Mutation: Exon 19 deletion (c.2235_2249del, p.Glu746_Ala750del) detected at 48.2% VAF. T790M and C797S resistance mutations are NEGATIVE.',
            page: 1,
            tags: ['Genomics', 'EGFR', 'TKI-Sensitizing']
          },
          {
            id: 'ex-path-2',
            section: 'Clinical Pathologist Comment',
            text: 'Concomitant PD-L1 positivity (45%) should be interpreted cautiously; clinical trials demonstrate severe interstitial lung disease and enhanced immune-related toxicities when immune checkpoint inhibitors are combined with Osimertinib.',
            page: 2,
            tags: ['Drug-Interaction', 'irAE', 'Contraindication']
          }
        ]
      },
      {
        id: 'doc-fda-02',
        title: 'FDA Approved Product Labeling - Boxed Warnings & Clinical Precautions',
        documentType: 'FDA_LABEL',
        date: '2026-05-14',
        facilityOrAgency: 'US Food and Drug Administration (Center for Drug Evaluation and Research)',
        classification: 'Regulatory Document - Approved Prescribing Information',
        sha256Hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
        content: `WARNING: QTc INTERVAL PROLONGATION, CARDIOTOXICITY, AND INTERSTITIAL LUNG DISEASE
SECTION 5.1 - QTc Interval Prolongation: In clinical studies, patients treated with EGFR-TKIs experienced QTc interval prolongation and cardiomyopathy. Baseline assessment of LVEF by echocardiogram or MUGA scan is recommended before treatment initiation, followed by surveillance every 3 months.
SECTION 5.2 - Interstitial Lung Disease (ILD) / Pneumonitis: Fatal cases of ILD/pneumonitis occurred in 3.3% of patients receiving concurrent or proximate immune checkpoint inhibitors (anti-PD-1 / anti-PD-L1) and third-generation TKIs. Withhold treatment immediately if acute onset of dyspnea, cough, or fever occurs.
SECTION 5.3 - Cardiac Dysfunction: LVEF decreases > 10% from baseline to absolute value < 50% occurred in 3.9% of subjects. Permanent discontinuation is mandated for symptomatic congestive heart failure.
SECTION 7 - DRUG INTERACTIONS: Avoid co-administration of strong CYP3A inducers and QTc-prolonging antiarrhythmics (including amiodarone and sotalol). If immune checkpoint inhibitors have been administered within the preceding 6 months, monitor pulmonary and cardiac function weekly.`,
        keyExcerpts: [
          {
            id: 'ex-fda-1',
            section: 'Section 5.2 - Interstitial Lung Disease & IO Combination',
            text: 'Fatal cases of ILD/pneumonitis occurred in 3.3% of patients receiving concurrent or proximate immune checkpoint inhibitors and third-generation TKIs.',
            page: 3,
            tags: ['FDA-Warning', 'irAE', 'Fatal-Risk']
          },
          {
            id: 'ex-fda-2',
            section: 'Section 5.3 - Left Ventricular Ejection Fraction Cutoff',
            text: 'LVEF decreases > 10% from baseline to absolute value < 50% occurred in 3.9% of subjects. Permanent discontinuation is mandated for symptomatic congestive heart failure.',
            page: 4,
            tags: ['Cardiotoxicity', 'CTRCD', 'Discontinuation-Rule']
          }
        ]
      },
      {
        id: 'doc-discharge-03',
        title: 'Inpatient Hospital Discharge Summary & Cardiology Consult Note',
        documentType: 'EHR_NOTE',
        date: '2026-09-17',
        facilityOrAgency: 'St. Jude Metropolitan Health System - Inpatient Service',
        classification: 'Unstructured Clinical Narrative - Inpatient Encounter',
        sha256Hash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
        content: `ADMIT DATE: 2026-09-14 | DISCHARGE DATE: 2026-09-17
PRIMARY DISCHARGE DIAGNOSIS: Acute decompensated heart failure with reduced ejection fraction (HFrEF); Atrial Fibrillation with rapid ventricular response; Stage IV Lung Adenocarcinoma on targeted therapy.
ATTENDING CARDIOLOGY CONSULTANT NOTE:
68-year-old female with known metastatic EGFR+ lung adenocarcinoma on osimertinib admitted through ED with worsening orthopnea, bilateral lower extremity 2+ pitting edema, and paroxysmal nocturnal dyspnea.
DIAGNOSTIC WORKUP:
- Repeat Transthoracic Echocardiogram (2026-09-16): Left ventricular ejection fraction measured at 46% (global hypokinesia with septal flattening; previous baseline was 56% recorded 4 months ago). Moderate diastolic dysfunction, mild mitral regurgitation.
- High-sensitivity Troponin-I peaked at 42.8 ng/L without ischemic ST changes on 12-lead ECG, consistent with toxic/inflammatory myocardial strain rather than acute thrombotic occlusion.
- Chest Radiography: Bilateral vascular congestion without focal pneumonic consolidations.
HOSPITAL COURSE & PLAN:
IV Furosemide diuresis produced net negative 3.2 liters over 72 hours with symptom resolution. Converted back to rate-controlled Afib with low-dose carvedilol 3.125mg BID.
ONCOLOGY-CARDIOLOGY CONSENSUS:
1. Hold Osimertinib for 14 days pending repeat echocardiogram to evaluate LVEF reversibility.
2. STRICT CONTRAINDICATION to initiating anti-PD-1 checkpoint inhibitor (Pembrolizumab) at this juncture due to overlapping myocarditis risk and active CTRCD criteria.
3. Recommend urgent oncology clinic follow-up on 2026-09-24 with repeat hs-cTnI and NT-proBNP.`,
        keyExcerpts: [
          {
            id: 'ex-disc-1',
            section: 'Echocardiogram Comparison',
            text: 'Left ventricular ejection fraction measured at 46% (global hypokinesia; previous baseline was 56% recorded 4 months ago).',
            page: 1,
            tags: ['EHR-Evidence', 'CTRCD', 'LVEF-Drop']
          },
          {
            id: 'ex-disc-2',
            section: 'Oncology-Cardiology Consensus Action',
            text: 'STRICT CONTRAINDICATION to initiating anti-PD-1 checkpoint inhibitor (Pembrolizumab) at this juncture due to overlapping myocarditis risk and active CTRCD criteria.',
            page: 2,
            tags: ['Clinical-Guideline', 'Contraindication', 'Safety-Action']
          }
        ]
      },
      {
        id: 'doc-payer-04',
        title: 'OptumRx / Payer Medical Necessity & Coverage Policy #ONC-901',
        documentType: 'PAYER_POLICY',
        date: '2026-01-01',
        facilityOrAgency: 'Aetna Health Care Management & Optum Prior Authorization Review',
        classification: 'Payer Clinical Criteria - Commercial & Medicare Advantage Policy',
        sha256Hash: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
        content: `POLICY TITLE: Monoclonal Antibodies Targeting PD-1/PD-L1 in Advanced Non-Small Cell Lung Cancer
COVERAGE SECTION 3.2 - Prior Authorization Requirements:
Pembrolizumab or alternative anti-PD-1 agents are approved for first-line treatment of advanced or metastatic NSCLC when ALL of the following criteria are satisfied:
1. Histologically confirmed unresectable Stage III or IV NSCLC with PD-L1 TPS >= 1%.
2. Absence of EGFR sensitizing mutations, ALK rearrangements, or ROS1 fusions (unless disease progression has occurred on appropriate targeted kinase inhibitors).
3. Baseline documented Left Ventricular Ejection Fraction >= 50% within the preceding 60 days if patient has pre-existing cardiovascular comorbidity or concurrent cardiotoxic exposure.
4. Absence of active grade 2 or higher autoimmune myocarditis, pneumonitis, or hepatitis.
SECTION 4.1 - Appeal Overturn Guidelines: An expedited peer-to-peer appeal will be sustained if the prescribing oncologist provides documentation demonstrating prior TKI progression or clinical rationale why monotherapy targeted therapy is no longer viable.`,
        keyExcerpts: [
          {
            id: 'ex-payer-1',
            section: 'Section 3.2 Criterion 2 & 3',
            text: 'Absence of EGFR sensitizing mutations unless progression has occurred; Baseline documented LVEF >= 50% within preceding 60 days.',
            page: 2,
            tags: ['Payer-Rule', 'Denial-Reason', 'Coverage-Criteria']
          }
        ]
      }
    ],

    baselineRiskScores: [
      {
        riskName: 'Cardiotoxicity & irAE Myocarditis Risk',
        category: 'Clinical Safety',
        tier: 'CRITICAL',
        scorePercent: 91,
        summary: 'Elevated troponin (42.8 ng/L) and 10% LVEF decline (56% -> 46%) during EGFR-TKI therapy constitutes Category 2 CTRCD. Initiating dual checkpoint inhibition introduces up to a 5-fold higher risk of fatal immune-mediated myocarditis.',
        mitigationProtocol: 'Hold osimertinib for 14 days, defer pembrolizumab initiation, schedule cardiac MRI, and repeat biomarker panel at Day 14.',
        evidenceFactors: [
          {
            sourceType: 'structured',
            description: 'Echo CPT 93306 confirms LVEF dropped to 46%',
            sourceRef: 'Cerner / Epic CPT 93306 (2026-09-16)',
            quoteOrValue: 'LVEF calculated at 46% (Declined from 56%)'
          },
          {
            sourceType: 'unstructured',
            description: 'FDA Label Warning against combining anti-PD-1 with third-generation TKIs',
            sourceRef: 'FDA Approved Product Labeling (Doc #doc-fda-02, Page 3)',
            quoteOrValue: 'Fatal cases of ILD/pneumonitis occurred in 3.3% of patients receiving concurrent or proximate immune checkpoint inhibitors.'
          },
          {
            sourceType: 'unstructured',
            description: 'Inpatient cardiology consensus declares strict contraindication',
            sourceRef: 'Inpatient Hospital Discharge Summary (Doc #doc-discharge-03, Page 2)',
            quoteOrValue: 'STRICT CONTRAINDICATION to initiating anti-PD-1 checkpoint inhibitor at this juncture.'
          }
        ]
      },
      {
        riskName: 'Payer Prior Auth Denial & Appeal Risk',
        category: 'Financial & Claims',
        tier: 'HIGH',
        scorePercent: 78,
        summary: 'Prior Authorization for Pembrolizumab denied under Optum Policy #ONC-901 because patient harbors sensitizing EGFR exon 19 del without documented progression, and current LVEF (46%) violates Section 3.2 coverage criteria.',
        mitigationProtocol: 'Do not submit routine appeal for dual therapy; instead, maintain monotherapy TKI or submit molecular tumor board documentation once cardiac stability is achieved.',
        evidenceFactors: [
          {
            sourceType: 'structured',
            description: 'Optum Claims Engine registered denial code PA-DENIAL-D44',
            sourceRef: 'Optum Claims Engine (2026-09-12)',
            quoteOrValue: 'DENIED: Medical Necessity Criteria Not Met'
          },
          {
            sourceType: 'unstructured',
            description: 'Payer policy mandates absence of EGFR mutation or proven progression',
            sourceRef: 'OptumRx Coverage Policy #ONC-901 (Doc #doc-payer-04, Page 2)',
            quoteOrValue: 'Absence of EGFR sensitizing mutations... unless disease progression has occurred on appropriate targeted kinase inhibitors.'
          }
        ]
      },
      {
        riskName: 'Renal Clearance & Drug Elimination Hazard',
        category: 'Clinical Safety',
        tier: 'MODERATE',
        scorePercent: 58,
        summary: 'eGFR of 42 mL/min indicates Stage 3b CKD, impairing clearance of secondary supportive medications and predisposing patient to contrast-induced nephropathy during restaging scans.',
        mitigationProtocol: 'Hydrate with isotonic saline prior to any contrast-enhanced imaging; avoid concurrent NSAIDs or nephrotoxic antimicrobial agents.',
        evidenceFactors: [
          {
            sourceType: 'structured',
            description: 'Cerner lab confirmed eGFR reduction',
            sourceRef: 'Cerner Millennium LOINC 33914-3 (2026-09-19)',
            quoteOrValue: '42 mL/min/1.73m² (Ref > 60)'
          }
        ]
      }
    ],

    presetQuestions: [
      {
        category: 'Clinical Safety',
        question: 'What are the clinical contraindications for initiating dual-agent immunotherapy (Pembrolizumab) given this patient\'s claims, lab trends, and pathology?'
      },
      {
        category: 'Claims & Coverage',
        question: 'Why did Optum Claims deny the Prior Authorization for Pembrolizumab, and what exact criteria in Coverage Policy #ONC-901 were not satisfied?'
      },
      {
        category: 'Regulatory & Compliance',
        question: 'What adverse cardiac events and interstitial lung disease risks cited in the FDA Approved Product Label match Eleanor\'s clinical presentation?'
      },
      {
        category: 'Clinical Safety',
        question: 'Summarize the conflicting data points between the inpatient discharge summary (LVEF 46%) and the active outpatient pharmacy dispensing records.'
      }
    ]
  },

  {
    id: 'profile-marcus-thorne',
    type: 'HEALTH_PLAN_MEMBER',
    name: 'Marcus Thorne (Synthetic Member)',
    dob: '1974-07-22',
    age: 52,
    gender: 'Male',
    mrnOrMemberId: 'MEM-SYN-551092',
    payerOrSponsor: 'Blue Cross Blue Shield / Caremark Specialty Pharmacy',
    planOrTrialProtocol: 'BlueAdvantage Commercial PPO (Group #88410-BCBS)',
    primaryDiagnosis: 'Refractory Ankylosing Spondylitis (ICD-10 M45.9) with Secondary Drug-Induced Liver Injury',
    keyPhenotypeOrCohort: 'Complex Member Prior Authorization Appeal & Step-Therapy Exemption',
    summary360: '52-year-old commercial plan member facing severe disease flare and progressive lumbar fusion. The specialty pharmacy claims engine denied coverage for targeted anti-IL-17 biologic (Secukinumab) citing failure to complete mandatory 90-day step-therapy with oral DMARDs. Unstructured clinical progress notes and hepatic enzyme labs prove that the required DMARD step-therapy caused Grade 3 drug-induced liver injury, legally and medically qualifying the member for an expedited formulary override.',

    structuredRecords: [
      {
        id: 'rec-m1',
        sourceSystem: 'Optum Claims Engine',
        category: 'CLAIM_PA',
        code: 'CLM-STEP-FAIL-01',
        display: 'Prior Authorization: Secukinumab 150mg/mL Pen Subcutaneous',
        value: 'DENIED: Failure to satisfy 90-day step therapy with 2 conventional DMARDs',
        date: '2026-09-10',
        status: 'denied',
        relevanceToQuestion: 'Payer rejected specialty biologic claim under standard step-therapy rule'
      },
      {
        id: 'rec-m2',
        sourceSystem: 'Specialty Pharmacy (NCPDP)',
        category: 'PHARMACY_NDC',
        code: 'NDC 00054-4550-25',
        display: 'Methotrexate 15mg/week Oral Tablet',
        value: 'Filled 1x (30-day supply); Discontinued after 3 weeks due to toxicity',
        date: '2026-07-15',
        status: 'adjudicated',
        relevanceToQuestion: 'Shows patient initiated step-therapy but experienced acute intolerance'
      },
      {
        id: 'rec-m3',
        sourceSystem: 'Cerner Millennium',
        category: 'LAB',
        code: '1742-6',
        display: 'Alanine Aminotransferase (ALT)',
        value: '148 U/L (Ref 7-56 U/L)',
        date: '2026-08-04',
        status: 'abnormal',
        relevanceToQuestion: 'Documented > 2.5x ULN transaminitis directly following Methotrexate trial'
      },
      {
        id: 'rec-m4',
        sourceSystem: 'Cerner Millennium',
        category: 'LAB',
        code: '1988-5',
        display: 'C-Reactive Protein (High Sensitivity)',
        value: '38.4 mg/L (Ref < 3.0 mg/L)',
        date: '2026-09-15',
        status: 'abnormal',
        relevanceToQuestion: 'Severe active systemic axial inflammation'
      },
      {
        id: 'rec-m5',
        sourceSystem: 'Epic EHR',
        category: 'VITAL',
        code: 'BASDAI-CALC',
        display: 'Bath Ankylosing Spondylitis Disease Activity Index',
        value: '7.6 / 10 (Ref < 4.0)',
        date: '2026-09-15',
        status: 'abnormal',
        relevanceToQuestion: 'High disease activity refractory to conventional non-biologic therapy'
      },
      {
        id: 'rec-m6',
        sourceSystem: 'Epic EHR',
        category: 'PROCEDURE_CPT',
        code: 'CPT 72148',
        display: 'MRI Lumbar & Sacroiliac Spine without Contrast',
        value: 'Bilateral Grade 3 sacroiliitis with active subchondral bone marrow edema',
        date: '2026-08-28',
        status: 'active',
        relevanceToQuestion: 'Objective radiologic documentation of active inflammatory disease'
      }
    ],

    unstructuredDocuments: [
      {
        id: 'doc-payer-m01',
        title: 'Commercial Health Plan Medical Policy #RHEUM-204B - Biologic Step Therapy Criteria',
        documentType: 'PAYER_POLICY',
        date: '2026-01-15',
        facilityOrAgency: 'Blue Cross Blue Shield National Medical Policy Committee',
        classification: 'Payer Utilization Management Guidelines',
        sha256Hash: '7c4a8d09ca3762af61e59520943dc26494f8941b',
        content: `POLICY GUIDELINE: Interleukin-17 (IL-17) and Tumor Necrosis Factor (TNF) Inhibitors for Ankylosing Spondylitis.
SECTION 2.1 - Step Therapy Prerequisite:
To qualify for preferred coverage of second-line biologic agents (including Secukinumab and Ixekizumab), member must demonstrate:
1. Documentation of trial and failure of at least two (2) distinct non-steroidal anti-inflammatory drugs (NSAIDs) at maximum tolerated doses for >= 4 consecutive weeks each; AND
2. Documentation of trial and failure of at least one (1) conventional synthetic DMARD (Methotrexate or Sulfasalazine) for >= 12 consecutive weeks.
SECTION 2.4 - CLINICAL EXEMPTION & OVERRIDE PROVISIONS:
The step therapy requirements under Section 2.1 shall be WAIVED and an expedited authorization granted if the treating physician submits objective clinical records demonstrating:
a. Documented severe adverse drug reaction or end-organ toxicity directly attributable to the required formulary agent (e.g., drug-induced liver injury with serum transaminases exceeding 2x upper limit of normal); OR
b. Medical contraindication that makes trial of the step agent medically hazardous; OR
c. Rapidly progressive disease with structural spinal fusion hazard documented on MRI.`,
        keyExcerpts: [
          {
            id: 'ex-payer-m1',
            section: 'Section 2.4 Clause (a) - Clinical Exemption for Transaminitis',
            text: 'The step therapy requirements under Section 2.1 shall be WAIVED if the treating physician submits objective clinical records demonstrating documented severe adverse drug reaction or end-organ toxicity... with serum transaminases exceeding 2x upper limit of normal.',
            page: 2,
            tags: ['Payer-Exemption', 'Overturn-Clause', 'DILI']
          }
        ]
      },
      {
        id: 'doc-clinic-m02',
        title: 'Outpatient Rheumatology Clinical Narrative & Expedited Peer-to-Peer Appeal Letter',
        documentType: 'EHR_NOTE',
        date: '2026-09-16',
        facilityOrAgency: 'Arthritis & Autoimmune Clinical Center of Excellence',
        classification: 'Specialist Clinical Chart Note & Payer Appeal',
        sha256Hash: 'a5d1b2c3d4e5f67890123456789abcdef0123456',
        content: `TO: Medical Director, Utilization Management Department
RE: Urgent Step Therapy Exemption & Prior Authorization Appeal for Marcus Thorne (DOB: 07/22/1974 | Member ID: MEM-SYN-551092)
MEDICATION REQUESTED: Secukinumab (Cosentyx) 150mg SC every 4 weeks.
CLINICAL RATIONALE & EVIDENCE:
Mr. Thorne is a 52-year-old gentleman with severe, rapidly progressive Ankylosing Spondylitis (HLA-B27 positive) exhibiting severe functional disability (BASDAI 7.6) and active bilateral sacroiliitis on MRI (CPT 72148).
Regarding the denial notice dated 2026-09-10 citing lack of 90-day Methotrexate step therapy:
On 2026-07-15, the patient was initiated on low-dose Methotrexate (15mg/week). Routine monitoring labs drawn on 2026-08-04 revealed acute Grade 3 drug-induced hepatotoxicity with ALT peaking at 148 U/L (baseline was 24 U/L) and AST 96 U/L. Methotrexate was discontinued immediately upon my order.
Per your own published Medical Policy #RHEUM-204B, Section 2.4(a), step therapy is explicitly waived when transaminases exceed 2x the upper limit of normal. Forcing this member to re-challenge or endure an additional 9 weeks of hepatotoxic exposure violates clinical standard of care and exposes the patient to irreversible hepatic fibrosis and progressive spinal ankylosis.
We demand immediate approval of this request within 48 hours.`,
        keyExcerpts: [
          {
            id: 'ex-clinic-m1',
            section: 'Hepatotoxicity Documentation',
            text: 'Routine monitoring labs revealed acute Grade 3 drug-induced hepatotoxicity with ALT peaking at 148 U/L. Methotrexate was discontinued immediately upon my order.',
            page: 1,
            tags: ['Clinical-Evidence', 'DILI', 'Step-Failure']
          },
          {
            id: 'ex-clinic-m2',
            section: 'Legal & Policy Justification',
            text: 'Per your own published Medical Policy #RHEUM-204B, Section 2.4(a), step therapy is explicitly waived when transaminases exceed 2x the upper limit of normal.',
            page: 1,
            tags: ['Policy-Citation', 'Payer-Overturn', 'Legal-Evidence']
          }
        ]
      }
    ],

    baselineRiskScores: [
      {
        riskName: 'Irreversible Structural Spinal Ankylosis Hazard',
        category: 'Clinical Safety',
        tier: 'HIGH',
        scorePercent: 86,
        summary: 'Elevated CRP (38.4 mg/L) and active bilateral bone marrow edema on MRI (CPT 72148) with high BASDAI (7.6) indicate unmitigated inflammatory syndesmophyte formation without targeted biologic therapy.',
        mitigationProtocol: 'Expedite biologic initiation within 5 business days; initiate bridging low-dose corticosteroid only if hepatic panel allows.',
        evidenceFactors: [
          {
            sourceType: 'structured',
            description: 'Elevated CRP reflecting uncontrolled inflammatory burden',
            sourceRef: 'Cerner LOINC 1988-5 (2026-09-15)',
            quoteOrValue: '38.4 mg/L (Ref < 3.0 mg/L)'
          },
          {
            sourceType: 'unstructured',
            description: 'MRI confirms active sacroiliitis',
            sourceRef: 'Rheumatology Appeal Letter (Doc #doc-clinic-m02, Page 1)',
            quoteOrValue: 'Active bilateral sacroiliitis on MRI (CPT 72148).'
          }
        ]
      },
      {
        riskName: 'Prior Authorization Step-Therapy Overturn Viability',
        category: 'Financial & Claims',
        tier: 'LOW',
        scorePercent: 12,
        summary: 'Risk of permanent denial on appeal is low (12%). The member satisfies explicit Section 2.4(a) clinical exemption criteria due to proven ALT elevation (148 U/L) exceeding 2x ULN.',
        mitigationProtocol: 'Submit peer-to-peer appeal citing Policy #RHEUM-204B Section 2.4(a) with attached Cerner lab flow-sheet.',
        evidenceFactors: [
          {
            sourceType: 'structured',
            description: 'Lab documentation of Grade 3 hepatotoxicity',
            sourceRef: 'Cerner LOINC 1742-6 (2026-08-04)',
            quoteOrValue: '148 U/L (Ref 7-56 U/L)'
          },
          {
            sourceType: 'unstructured',
            description: 'Payer policy waiver clause',
            sourceRef: 'Medical Policy #RHEUM-204B (Doc #doc-payer-m01, Page 2)',
            quoteOrValue: 'Step therapy requirements... shall be WAIVED if transaminases exceed 2x upper limit of normal.'
          }
        ]
      }
    ],

    presetQuestions: [
      {
        category: 'Claims & Coverage',
        question: 'Did Marcus fulfill the payer step-therapy requirements or does he qualify for an explicit waiver under Policy #RHEUM-204B?'
      },
      {
        category: 'Clinical Safety',
        question: 'What clinical lab evidence demonstrates drug-induced liver injury (DILI) during the methotrexate trial?'
      },
      {
        category: 'Regulatory & Compliance',
        question: 'Draft the citations and policy clauses needed for an expedited peer-to-peer appeal letter to overturn the Secukinumab denial.'
      }
    ]
  },

  {
    id: 'profile-sofia-trial',
    type: 'TRIAL_SUBJECT',
    name: 'Subject CT-904-SYN (Synthetic Trial Subject)',
    dob: '1985-11-09',
    age: 41,
    gender: 'Female',
    mrnOrMemberId: 'SUB-904-AAV9-03',
    payerOrSponsor: 'Aventis BioTherapeutics / FDA CDER IND #18920',
    planOrTrialProtocol: 'Protocol NCT04829188 - Phase III AAV9 Gene Replacement Trial',
    primaryDiagnosis: 'Adult-Onset Spinal Muscular Atrophy Type IV / SMN2 Copy Variant',
    keyPhenotypeOrCohort: 'Clinical Trial Safety & FDA 21 CFR § 312.32 SUSAR Surveillance',
    summary360: '41-year-old trial participant who received investigational AAV9 gene therapy vector 14 days ago. Cross-analyzing structured Medidata Rave EDC laboratory telemetry with unstructured DSMB safety minutes and FDA Form 483 audit logs reveals an acute drop in platelets (84,000 /µL) and elevated D-dimer matching the regulatory definition of a Suspected Unexpected Serious Adverse Reaction (SUSAR).',

    structuredRecords: [
      {
        id: 'rec-t1',
        sourceSystem: 'EDC Rave',
        category: 'LAB',
        code: '777-3',
        display: 'Platelet Count (Automated Hemogram)',
        value: '84,000 /µL (Baseline was 245,000 /µL)',
        date: '2026-09-20',
        status: 'abnormal',
        relevanceToQuestion: 'Acute thrombocytopenia following vector infusion (Grade 2 CTCAE)'
      },
      {
        id: 'rec-t2',
        sourceSystem: 'EDC Rave',
        category: 'LAB',
        code: '48065-7',
        display: 'D-Dimer (Quantitative Fibrin Units)',
        value: '1,420 ng/mL (Ref < 500 ng/mL)',
        date: '2026-09-20',
        status: 'abnormal',
        relevanceToQuestion: 'Microvascular endothelial activation and prothrombotic state'
      },
      {
        id: 'rec-t3',
        sourceSystem: 'EDC Rave',
        category: 'VITAL',
        code: 'CHOP-MOTOR',
        display: 'Expanded Hammersmith Functional Motor Scale (HFMSE)',
        value: '44 / 66 points (Stable from Day 0 baseline of 43)',
        date: '2026-09-18',
        status: 'normal',
        relevanceToQuestion: 'Motor neuron efficacy endpoint maintained without acute neuro-deficit'
      },
      {
        id: 'rec-t4',
        sourceSystem: 'EDC Rave',
        category: 'PHARMACY_NDC',
        code: 'IP-AAV9-LOT88',
        display: 'Investigational Product: AVXS-301 (AAV9 Vector Single Infusion)',
        value: 'Dose: 1.1 x 10^14 vg/kg IV Infusion (Administered Day 0)',
        date: '2026-09-06',
        status: 'active',
        relevanceToQuestion: 'Confirmed dosing per Protocol Section 4.2'
      }
    ],

    unstructuredDocuments: [
      {
        id: 'doc-trial-t01',
        title: 'Clinical Trial Protocol NCT04829188 - Section 8: Safety Stopping Rules & Toxicity Management',
        documentType: 'CLINICAL_TRIAL_PROTOCOL',
        date: '2025-11-10',
        facilityOrAgency: 'Sponsor Clinical Operations & Global Safety Board',
        classification: 'GCP Regulatory Protocol - FDA IND #18920',
        sha256Hash: '3b9a1c8f4d2e7a6b5c0e1f3d8a7c6b5a4f3e2d1c',
        content: `SECTION 8.4 - DOSE-LIMITING TOXICITIES & PROTOCOL STOPPING RULES:
8.4.1 Thrombotic Microangiopathy (TMA) Monitoring:
Systemic AAV vector administration has been associated with complement-mediated TMA, characterized by thrombocytopenia, microangiopathic hemolytic anemia, and acute kidney injury.
MANDATORY INTERVENTION CRITERIA:
If a subject exhibits platelet count < 100,000 /µL OR a > 50% decrease from baseline accompanied by elevated D-dimer or fragmentocytes on peripheral smear:
1. Immediately notify the Principal Investigator and the Medical Monitor within 24 hours.
2. Initiate therapeutic plasma exchange or eculizumab evaluation per Institutional Protocol.
3. Pause further dosing in the trial cohort pending Data Safety Monitoring Board (DSMB) review.
SECTION 8.6 - REGULATORY REPORTING REQUIREMENTS (FDA 21 CFR § 312.32):
Any event meeting criteria for a serious, unexpected adverse reaction associated with investigational product use must be submitted to the FDA and all participating IRBs as an expedited 7-day or 15-day IND Safety Report.`,
        keyExcerpts: [
          {
            id: 'ex-trial-t1',
            section: 'Section 8.4.1 - TMA Intervention Rule',
            text: 'If a subject exhibits platelet count < 100,000 /µL OR a > 50% decrease from baseline accompanied by elevated D-dimer... immediately notify Medical Monitor and pause cohort dosing.',
            page: 42,
            tags: ['Protocol-Stopping-Rule', 'TMA', 'Safety-Alert']
          }
        ]
      },
      {
        id: 'doc-dsmb-t02',
        title: 'DSMB Emergency Ad Hoc Safety Review Minutes & SUSAR Classification',
        documentType: 'DSMB_SAFETY',
        date: '2026-09-21',
        facilityOrAgency: 'Independent Data Safety Monitoring Board (DSMB)',
        classification: 'Confidential DSMB Safety Charter Assessment',
        sha256Hash: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b',
        content: `EMERGENCY MEETING DATE: 2026-09-21 | QUORUM: 5/5 Board Members Present.
CASE REVIEW: Subject CT-904-SYN (Day 14 Post-Infusion).
PRESENTING FINDINGS: Platelet nadir of 84,000 /µL (baseline 245,000 /µL, representing a 65.7% decline), D-dimer 1,420 ng/mL, and peripheral smear demonstrating rare schistocytes.
DSMB DETERMINATION & RECOMMENDATIONS:
1. Event meets the formal protocol definition of Early Subclinical Thrombotic Microangiopathy secondary to complement activation by high-titer AAV capsid.
2. Formally classified as a SUSAR (Suspected Unexpected Serious Adverse Reaction).
3. The Sponsor is mandated to submit an expedited 15-Day IND Safety Report to FDA CDER per 21 CFR § 312.32(c)(1)(i).
4. Recommended Clinical Action: Administer methylprednisolone pulse therapy (1 g/day IV for 3 days) and recheck hematology panel every 12 hours. Trial enrollment for Cohort 3 remains temporarily paused.`,
        keyExcerpts: [
          {
            id: 'ex-dsmb-t1',
            section: 'DSMB Classification as SUSAR',
            text: 'Event meets the formal protocol definition of Early Subclinical Thrombotic Microangiopathy... Formally classified as a SUSAR.',
            page: 1,
            tags: ['DSMB', 'SUSAR', 'Regulatory-Action']
          },
          {
            id: 'ex-dsmb-t2',
            section: 'Mandated FDA IND Reporting',
            text: 'The Sponsor is mandated to submit an expedited 15-Day IND Safety Report to FDA CDER per 21 CFR § 312.32(c)(1)(i).',
            page: 1,
            tags: ['FDA-21CFR', '15-Day-Report', 'Compliance']
          }
        ]
      }
    ],

    baselineRiskScores: [
      {
        riskName: 'Complement-Mediated Thrombotic Microangiopathy (TMA)',
        category: 'Clinical Safety',
        tier: 'CRITICAL',
        scorePercent: 93,
        summary: '65.7% decline in platelets (245k -> 84k /µL) with elevated D-dimer (1,420 ng/mL) at Day 14 post-AAV9 exceeds Protocol Section 8.4.1 safety stopping threshold for systemic gene therapy.',
        mitigationProtocol: 'Initiate pulse methylprednisolone 1g IV daily x 3 days, draw ADAMTS13 activity and sC5b-9 complement levels, and evaluate for eculizumab rescue.',
        evidenceFactors: [
          {
            sourceType: 'structured',
            description: 'Medidata Rave EDC registered platelet drop to 84k',
            sourceRef: 'Medidata Rave EDC LOINC 777-3 (2026-09-20)',
            quoteOrValue: '84,000 /µL (Baseline was 245,000 /µL)'
          },
          {
            sourceType: 'unstructured',
            description: 'Protocol mandatory intervention criteria triggered',
            sourceRef: 'Clinical Trial Protocol Section 8.4.1 (Doc #doc-trial-t01, Page 42)',
            quoteOrValue: 'If a subject exhibits platelet count < 100,000 /µL OR a > 50% decrease... immediately notify Medical Monitor and pause cohort dosing.'
          }
        ]
      },
      {
        riskName: 'Regulatory IND Non-Compliance & Audit Finding Risk',
        category: 'Regulatory Compliance',
        tier: 'HIGH',
        scorePercent: 88,
        summary: 'Failure to submit the mandated 15-Day IND Safety Report to FDA CDER within the statutory window under 21 CFR § 312.32 constitutes a serious GCP non-compliance hazard.',
        mitigationProtocol: 'Sponsor Safety Operations must file Form FDA 3500A (MedWatch) within 15 calendar days and notify all Institutional Review Boards (IRBs).',
        evidenceFactors: [
          {
            sourceType: 'unstructured',
            description: 'DSMB mandated expedited 15-day filing',
            sourceRef: 'DSMB Emergency Review Minutes (Doc #doc-dsmb-t02, Page 1)',
            quoteOrValue: 'The Sponsor is mandated to submit an expedited 15-Day IND Safety Report to FDA CDER per 21 CFR § 312.32(c)(1)(i).'
          }
        ]
      }
    ],

    presetQuestions: [
      {
        category: 'Trial Protocol',
        question: 'Does the subject\'s platelet count drop trigger a protocol-mandated trial stopping rule under Section 8.4.1?'
      },
      {
        category: 'Regulatory & Compliance',
        question: 'What regulatory documentation and statutory deadlines are required by FDA 21 CFR § 312.32 for this SUSAR event?'
      },
      {
        category: 'Clinical Safety',
        question: 'What clinical management and biomarker surveillance protocol did the DSMB recommend to reverse the microangiopathic injury?'
      }
    ]
  }
];
