# Dr. T: World-Class Socratic Biomedical Informatics & Healthcare AI Platform

This Platform App https://dr-t-764082783379.us-west1.run.app is V.02 the series of Biomedical Informatics challenges with Informatics Platform is added; I have committed myself to so as to learn the medical language spoken by my Dr. T:

V.01 is the originally Voice Agent named Dr. T. 

V.2.1 UiPath components integrated into the App

V.2.2 Integrated https://vocalbridgeai.com/shared/4ahTePkJBzlh0LQ1ndxolhqau3_hjYVfWWeM4-nwuhc 

<img width="1536" height="1024" alt="IMG_1724" src="https://github.com/user-attachments/assets/3a02b257-39fa-4cc7-9c4c-e4bb3c2a1a18" />


> **Disclaimer:** "Dr. T is an educational and decision-support platform and not a substitute for professional medical advice."

Inspiration

PREVENTING AUTONOMIC BURNOUT & FRAGMENTED CARE

Traditional healthcare software is cold and transactional, but we were inspired by a real-life physician, Dr. T, who has been helping her patients with wits, wisdom, and kindness throughout their treatment processes. We built 'Dr. T' — an empathetic, Socratic clinical decision support platform and patient-first wellness guide to carry her legacy of compassionate healthcare into a modern digital experience.

Dr. T is a world-class, production-ready Biomedical Informatics portfolio item, Healthcare AI platform, and HealthTech MVP built on a high-fidelity, full-stack architecture using **React, TypeScript, Express, and Google Gemini**. It combines the conversational empathy of a Socratic companion with clinical-vetted schemas, HL7 FHIR interoperability layers, real-time biostatistics metrics, and ICU forecasting engines modeled after MIMIC-IV clinical databases.

Dr. T: Project Overview & Core Mission
Dr. T is an empathetic, Socratic clinical decision support platform and patient-first wellness guide. Inspired by a real-life physician (Dr. T) who helped patients with wits, wisdom, and kindness, this digital ecosystem is designed to humanize medical informatics by bridging the gap between rigorous medical analytics and compassionate care.

The Problem It Solves
Clinician & Administrator Burnout (The "EHR Tax")
Modern healthcare professionals spend up to twice as much time performing manual entry in Electronic Health Records (EHR) as they do with patients. Outdated, click-heavy interfaces lead to cognitive fatigue and administrative fatigue.

Cold, Transactional Care Models
Standard patient portal interfaces are sterile, confusing, and dry. Patients often feel alienated by raw, uncontextualized metrics (such as lab results or diagnostic codes) without warm, conversational guidance.

Data Fragmentation & Siloed Devices
Valuable patient indicators remain isolated across consumer wearables (Fitbit, Apple Watch), municipal diagnostic laboratories, and legacy healthcare databases (Epic, Cerner), making holistic diagnostic tracking difficult.

Delayed Critical Interventions
Valuable predictive indicators (such as high-risk ICU clinical scores) lose effectiveness if they cannot be operationalized instantly. Intercepting these triggers requires automated, real-time alert dispatching.

What the Project Does (Core Capabilities)
Socratic Clinical & Empathic Guidance: Converts sterile health telemetry into interactive, supportive patient dialogues. It guides users through stabilizing behavioral exercises (such as auditory warm-ups and structured breathing) while collecting feedback on their physical status.

Biomedical & ICU Diagnostic Suite: Provides real-time clinical dashboards modeling predictive markers (such as mortality risk index using anonymous MIMIC-IV datasets), enabling physicians to test diagnoses and run Step-and- titrated treatments.

Multi-Agent Medical Swarms: Simulates real-time clinical advisory boards consisting of specialized virtual agents (e.g., Cardiology, Oncology, and Psychology) that review patient summaries and reach collaborative therapeutic consensus.

Life-Graph Bio-Repositories: Standardizes physical biometrics and therapeutic achievements onto an interactive memory graph, enabling clinicians to visually trace correlations between life milestones and autonomic measurements.

UiPath Robotic Process Automation (RPA) Hub:

Automated Patient Intake: Seamlessly transcribes clinical summaries and writes them directly to simulated Epic/Cerner structures using unattended robots.

Ambient Wearable Syncing: Pulls and organizes multi-device IoT health feeds without manual user intervention.

Predictive Alert Dispatching: Bridges risk anomalies with instant emergency pager and Slack notifications.

Smart Prescription Fulfillment: Hands compliance verification, checkups, and prescription entries over to non-clinical virtual assistants.Dr. T: Project Overview & Core Mission
Dr. T is an empathetic, Socratic clinical decision support platform and patient-first wellness guide. Inspired by a real-life physician (Dr. T) who helped patients with wits, wisdom, and kindness, this digital ecosystem is designed to humanize medical informatics by bridging the gap between rigorous medical analytics and compassionate care.

The Problem It Solves
Clinician & Administrator Burnout (The "EHR Tax")
Modern healthcare professionals spend up to twice as much time performing manual entry in Electronic Health Records (EHR) as they do with patients. Outdated, click-heavy interfaces lead to cognitive fatigue and administrative fatigue.

Here are the enterprise UiPath components driving administrative offloading in the applet:

1. UiPath Orchestrator (The Command & Control Plane)
Role: Serves as the centralized management node.

Execution: Dr. T's backend triggers Orchestrator API actions utilizing secure JWT authentication bounds. It dynamically assigns incoming jobs to available transaction queues, assets, and robot pools based on clinical priorities (Routine, Urgent, or Stat).

2. Unattended Robots (Virtual Administrative Assistants)
Role: Silent script executors running on sandboxed virtual environments.

Execution: Once the Socratic voice logs are parsed into structured HL7 FHIR Observation blocks, the Unattended Robots capture this temporary JSON payload and automatically replicate mouse clicks, form fillings, and file uploads directly into closed-door legacy interfaces (like Epic, Cerner, or state health registries).

3. UiPath Studio & Coded Workflows (The Logic Compiler)
Role: The design environment where high-reliability automation logic is defined.

Execution: Combines drag-and-drop workflow diagrams with low-latency modern C# or VB.NET codes. These automation sequences parse transcription text, run logical checksums across fields, and handle system error states gracefully if legacy page elements fail to load.

4. UiPath Integration Service (Dynamic Connectors)
Role: Out-of-the-box API integrations.

Execution: Bypasses manual browser automation where native API interfaces are supported. It manages third-party OAuth handshakes (e.g., pulling data streams from Garmin or Fitbit cloud gateways) and feeds standardized biometric records directly back into the Dr. T Life-Graph database.

5. UiPath Action Center (Human-In-The-Loop)
Role: Safe execution gates for critical clinical choices.

Execution: If a patient's vital signals violate safe thresholds during automated lab orders, the robot pauses execution and raises an interactive ticket inside the Action Center. The process resumes only after a licensed clinician clicks "Verify & Approve."

Agent Type: Hybrid Architecture Utilizing Both Coded Agents and Low-Code Agents
The Dr. T + UiPath Integration Suite implements a Hybrid Agent Architecture that combines Coded Agents (Developer-First) with Low-Code Agents/Robots (Activity-First). This dual setup is essential for bridging the gap between clinical calculations and legacy software interfaces.

1. Coded Agents (Developer-First Node)
Operational Role: Core ingestion, FHIR data validation, and real-time biometric streaming.

How They Work: Coded agents run lightweight TypeScript and Python runtimes that interface directly with Dr. T’s Socratic conversation models. When Dr. T records a patient interview, the Coded Agent processes the raw audio/text transcript, parses diagnostic indicators, and translates them into structured HL7 FHIR Observation payloads (JSON format). It then programmatically handles the secure OAuth handshake and issues API triggers directly to the UiPath Orchestrator.

Why They Are Essential: Medical data demands absolute type-safety, low-latency telemetry processing, and secure cryptographic handshakes. Coded agents excel at handling these structured back-end calculations and API transactions.

2. Low-Code Agents & Robots (Activity-First Node)
Operational Role: Screen UI interactions, legacy systems automation, and "last-mile" data entry.

How They Work: These are unattended software robots built with traditional UiPath Studio drag-and-drop activities. Once the Coded Agent triggers a job in the Orchestrator, the Low-Code Robot takes over on a virtual machine. It logs into legacy portals (such as custom browser-based EHR installations of Epic or Cerner), searches for the patient, navigates to the clinical charting menu, and enters the vital signs and diagnostic indicators.

Why They Are Essential: The vast majority of legacy healthcare portals do not offer developer-friendly REST APIs. Low-code robots act as virtual assistants that mimic human activity, allowing the system to sync data across legacy EHR systems without requiring custom software modifications in the hospital network.

Summary of System Synergy
code
Code
[ Dr. T Socratic Dialog ] 
         │
         ▼
 ┌────────────────────────────────────────────────────────┐
 │ 1. CODED AGENTS (Developer-First)                      │
 │ - Parses transcripts into structured HL7 FHIR JSON     │
 │ - Authenticates JWT token with UiPath Orchestrator API │
 └───────────────────────┬────────────────────────────────┘
                         │ (Launches automation job)
                         ▼
 ┌────────────────────────────────────────────────────────┐
 │ 2. LOW-CODE ROBOTS (Unattended / Activity-First)       │
 │ - Spawns in a secure VM / sandboxed workspace          │
 │ - Interacts directly with Epic/Cerner windows & clicks │
 └───────────────────────┬────────────────────────────────┘
                         │ (Syncs and validates data)
                         ▼
[ Legacy EHR Database Record Updated ]
This hybrid approach allows Coded Agents to run the underlying data orchestration and clinical AI reasoning, while Low-Code Agents handle the visual clicking and record-keeping on legacy clinical software.

Setup & Configuration Playbook: Dr. T + UiPath Automation Suite
This comprehensive guide outlines the step-by-step procedure required to configure, compile, and run the Dr. T Socratic Med-Care Application & UiPath RPA Suite for demonstration and judging.

📋 Prerequisites
Before starting, ensure that your staging environment possesses:

Node.js: v20.x or higher (LTS recommended)

NPM: v10.x or higher

Web Browser: Any modern evergreen browser (Chrome, Edge, Firefox, or Safari)

⚙️ Step 1: Clone & Dependency Installation
Unpack or Clone the repository into your local directory.

In your terminal, navigate to the project directory root:

code
Bash
cd drt-uipath-showcase
Install exact package requirements defined in the system manifest:

code
Bash
npm install
Note: This command installs React 19, Tailwind CSS v4, Motion (formerly framer-motion), and the specialized Google GenAI SDK.

🧪 Step 2: Configure Environment Secret Keys (Optional)
The application handles standard workflows in local offline sandbox mode out of the box, ensuring high reliability during execution. If you wish to enable active, live Gemini communication:

Create a .env file in the root environment path:

code
Bash
touch .env
Insert your secure Google Gemini API token:

code
Env
GEMINI_API_KEY=your_secured_gemini_api_key_here
🚀 Step 3: Run the Application Locally (Development Mode)
Verify hot-reloading asset configurations easily through Vite's local dev engine:

Execute the development startup script:

code
Bash
npm run dev
The custom tsx process initiates the backend gateway server.ts binding onto port 3000.

Open your preferred browser and navigate to:

code
Code
http://localhost:3000
📦 Step 4: Compile and Run (Production Mode)
To replicate standard Cloud container deployments, execute the automated production build script:

Clean stale assets and compile files:

code
Bash
npm run build
This command runs two automated pipelines sequentially:

Client-Side Slicing: Compiles the optimized static React client into the dist/ directory via Vite.

Server-Side Bundling: Bundles the backing server.ts Express infrastructure into a standalone, ultra-lean CommonJS file at dist/server.cjs via esbuild.

Launch the production build:

code
Bash
npm run start
View the lightning-fast, production-native applet package at:

code
Code
http://localhost:3000
🏛️ Judging Interactive Playbook
For judging, navigate to the custom dashboard and take the following steps:

Locate the UiPath RPA Tab: In the top navigation navigation rail, click the "🤖 UiPath RPA" button. This opens the dedicated RPA Orchestration panel.

Toggle Integration Blueprints: Tap between the four custom enterprise mappings:

Automated Patient Intake & EHR Registry Sync

Cross-Platform Wearable IoT Syncing (Fitbit & Apple Health)

Predictive ICU Telemetry & Pager Dispatching

Lab Order Fulfillment & Smart Prescriptions

Configure the Job Parameters:

Select a target patient (e.g., Raymond Vance PH-8172).

Change the legacy endpoint system target (Epic, Cerner, or FHIR Local).

Speed up delivery by selecting different priority states (Routine, Urgent, or urgent Stat).

Initiate the Simulation: Click the solid rose button: "Run UiPath Automation Job".

Monitor Live Telemetry: Watch the interactive stepper track the robot state from OAuth handshakes down to actual EHR sync operations. Examine the simulated low-latency terminal log box streaming genuine clinical transaction outputs, error checks, and final REST schema completion checkpoints in real time!

## 🔬 Key Architectural Highlights & Portfolio Index
1. **Multilingual Voice-First Intercom Node:** Implemented near-zero latency multi-turn dialogues with dynamic language support, interruption-aware speech synthesis loops, and customizable conversational personalities (Empathetic, Socratic, Blunt, Intellectual).
2. **HL7 FHIR Interoperability Suite:** Features a standardized client-side clinical resource processor enabling imports, exports, and schema validation of **Patient, Observation, Condition, Encounter, and Procedure** resources mapped directly to LOINC and SNOMED CT indices.
3. **MIMIC-IV High-Fidelity ICU Console:** Predicts readmissions and estimates length-of-stay days for risk stratification, demonstrating high competence in quantitative medical informatics and clinical data sciences.
4. **Research Lab & Evidence-Based RAG:** Leverages Google Gemini for real-time semantic synthesis over open NIH, CDC, WHO, and PubMed guidelines, outputting formal APA citations.
5. **AI Clinical Document SOAP Compiler:** Generates validated SOAP notes, visit progress summaries, and patient discharge packets, instantly exportable inside FHIR DocumentReference JSON files.
6. **Educational Medical Imaging AI:** Processes simulated MRI, CT, X-ray, and dermal photography files; highlights anatomical anomalies; and explains radiography observations.

---

## 🚀 Interactive Quick Start / Developer Installation
Ensure `Node.js v19+` is installed.

```bash
# 1. Install dependencies
npm install

# 2. Start the dev environment locally
npm run dev
```
The application spins up a local Express server proxying the Vite asset compiler on port 3000: `http://localhost:3000`.

---

## 📊 Quantitative Modeling & Equations (MIMIC-IV Engine)

### Mortality & Readmission Forecasting
Utilizes Logistic Regression coefficient weighting for assessing high-risk patients:

$$P(\text{Readmit}) = \frac{1}{1 + e^{-z}}$$

Where:
$$z = \beta_0 + \beta_1(\text{Age}) + \beta_2(\text{ComorbidityCount}) - \beta_3(\text{VitalsCompliance})$$

---

## 🏆 Pitch Script & Playable Demonstration
Pour over the visual tabs in the UI:
1. **The Hub (Voice Center):** Engage in Socratic vocal counseling. Change Dr. T's vibe to "socratic" or "clinical" to study its shifting dialogue trees.
2. **Informatics Platform:** Import FHIR resources, validate them for LOINC compliance, and compile real SOAP progress notes formatted ready for hospital portals.
3. **ICU Analytics Console:** Review ICU indicators, execute linear regressors, and compare Raymond or Marcus's LOS forecasts to understand quantitative epidemiology patterns.
4. **Portfolio Showcase:** View the interactive architecture topology diagrams, slide deck slides, and scientific abstract whitepaper.

---
