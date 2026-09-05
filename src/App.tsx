import React, { useState } from 'react';
import { 
  NavTab, 
  LanguageCode, 
  PersonalityMode, 
  ChatMessage, 
  PatientProfile, 
  PlatformNotification,
  SOAPNote,
  SwarmResult,
  ResearchSynthesis
} from './types';
import { 
  MOCK_PATIENT, 
  MOCK_TIMELINE_EVENTS, 
  MOCK_HEALTH_INSIGHTS, 
  MOCK_LAB_RESULTS, 
  MOCK_FHIR_RESOURCES, 
  MOCK_SWARM_AGENTS, 
  MOCK_ICU_PATIENTS, 
  MOCK_SKIN_METRICS, 
  MOCK_FASHION_OUTFITS, 
  MOCK_WORKFLOWS, 
  MOCK_CONSENT_RECORDS, 
  MOCK_USER_MEMORIES, 
  MOCK_ECONOMY_AGENTS, 
  MOCK_NOTIFICATIONS 
} from './data/mockData';

// Layout & Overlays
import { Navbar } from './components/layout/Navbar';
import { CommandPalette } from './components/layout/CommandPalette';
import { NotificationDrawer } from './components/layout/NotificationDrawer';
import { VoiceModeOverlay } from './components/drt/VoiceModeOverlay';
import { DemoJourneyModal } from './components/demo/DemoJourneyModal';
import { BirthdayModal } from './components/celebration/BirthdayModal';

// 10 Platform Modules
import { DrTHome } from './components/drt/DrTHome';
import { DrTReadItApp } from './components/readit/DrTReadItApp';
import { HealthIntelligence } from './components/health/HealthIntelligence';
import { ClinicalInformatics } from './components/informatics/ClinicalInformatics';
import { AISwarm } from './components/swarm/AISwarm';
import { ResearchLab } from './components/research/ResearchLab';
import { SmAristStudio } from './components/smarist/SmAristStudio';
import { ClinicalAutomation } from './components/automation/ClinicalAutomation';
import { PrivacyCenter } from './components/privacy/PrivacyCenter';
import { AgentEconomy } from './components/economy/AgentEconomy';
import { X402PayPerRequestStudio } from './components/x402/X402PayPerRequestStudio';
import { GoogleCloudHub } from './components/cloud/GoogleCloudHub';
import { PetWhispererApp } from './components/petwhisperer/PetWhispererApp';
import { OpenWebOSApp } from './components/openwebos/OpenWebOSApp';
import { GreenieVerseApp } from './components/greenieverse/GreenieVerseApp';
import { TribHouseContainer } from './tribhouse/TribHouseContainer';
import { SettingsPage } from './components/settings/SettingsPage';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('drt');
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');
  const [personality, setPersonality] = useState<PersonalityMode>('Empathetic');
  const [patient, setPatient] = useState<PatientProfile>(MOCK_PATIENT);
  const [notifications, setNotifications] = useState<PlatformNotification[]>(MOCK_NOTIFICATIONS);
  
  // UI Dialog States
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState<boolean>(false);
  const [isVoiceModeOpen, setIsVoiceModeOpen] = useState<boolean>(false);
  const [isDemoJourneyOpen, setIsDemoJourneyOpen] = useState<boolean>(false);
  const [isBirthdayModalOpen, setIsBirthdayModalOpen] = useState<boolean>(true);
  const [isLoadingChat, setIsLoadingChat] = useState<boolean>(false);

  // Initial Socratic Chat History
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      role: 'model',
      content: "Hello, Alex. I am Dr. T. I have reviewed your latest Quest lab panel and wearable sleep trends. \n\nI noticed you have been navigating subtle afternoon fatigue over the past month. Tell me what is happening, and let us explore the patterns together with care.",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      safety: {
        level: 'GREEN',
        explanation: 'Educational health discussion and general wellness guidance.',
        actionRecommendation: 'Explore wellness optimization, lifestyle habits, and preventative health metrics.',
      },
      suggestedQuestions: [
        "What questions should I ask my primary care doctor about my 19 ng/mL ferritin level?",
        "How might late-night screen time affect my slow-wave N3 deep sleep?",
        "Could my mid-afternoon energy drop be related to iron stores or circadian timing?",
      ],
    },
  ]);

  // Server API Bridge Handlers
  const handleSendMessage = async (text: string, isVoice = false): Promise<string> => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
      isVoiceInput: isVoice,
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoadingChat(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          personality,
          language: currentLanguage,
          history: messages.slice(-6).map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const modelContent = data.response || "I hear your concern. Let's look deeper at your physiological markers.";

      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: modelContent,
        timestamp: new Date().toISOString(),
        safety: data.safety || {
          level: 'GREEN',
          explanation: 'Educational health information.',
          actionRecommendation: 'Review with your licensed healthcare provider.',
        },
        suggestedQuestions: [
          "Should I request a repeat iron panel with TIBC in 8 weeks?",
          "Would a trial of gentle iron bisglycinate be appropriate for me?",
          "How can I shift my circadian sleep window 45 minutes earlier?",
        ],
      };

      setMessages(prev => [...prev, modelMsg]);
      return modelContent;
    } catch (err) {
      console.warn('Backend API request fallback:', err);
      // Fallback Socratic generation if backend is unavailable
      const fallbackContent = `Thank you for sharing that with me. Looking at your physiological metrics, a serum ferritin of 19 ng/mL with normal hemoglobin represents depleted tissue storage pools rather than overt anemia. When combined with your late sleep chronotype (bedtime after 12:45 AM), it is very natural for cellular energy reserves to dip around 2:30 PM.\n\nLet me ask you: Does this fatigue improve noticeably on days when you get morning sunlight and take an earlier walk?`;
      
      const fallbackMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: fallbackContent,
        timestamp: new Date().toISOString(),
        safety: {
          level: 'YELLOW',
          explanation: 'Mild chronic fatigue with depleted iron storage reserve flagged.',
          actionRecommendation: 'Discuss gentle iron bisglycinate with Dr. Sarah Chen at your upcoming appointment.',
        },
        suggestedQuestions: [
          "Is a ferritin of 19 ng/mL adequate for optimal physical stamina?",
          "How does N3 deep sleep deficit affect daytime cognitive clarity?",
        ],
      };

      setMessages(prev => [...prev, fallbackMsg]);
      return fallbackContent;
    } finally {
      setIsLoadingChat(false);
    }
  };

  const handleGenerateSOAP = async (notes: string): Promise<SOAPNote> => {
    try {
      const response = await fetch('/api/soap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ encounterNotes: notes }),
      });
      if (response.ok) {
        const data = await response.json();
        return {
          id: `SOAP-${Date.now()}`,
          patientName: patient.name,
          encounterDate: new Date().toISOString().slice(0, 10),
          clinician: patient.primaryCareProvider,
          subjective: data.subjective || "Patient reports 4-week fatigue and circadian sleep phase delay.",
          objective: data.objective || "Vitals: BP 118/76, HR 68. Ferritin: 19 ng/mL, 25-OH Vit D: 28 ng/mL.",
          assessment: data.assessment || "1. Non-anemic tissue iron storage depletion.\n2. Suboptimal Vitamin D status.\n3. Circadian phase delay.",
          plan: data.plan || "1. Repeat iron panel in 8 weeks.\n2. Iron bisglycinate 25mg daily.\n3. Sleep hygiene and morning light anchor.",
          status: 'draft',
          fhirDocumentReference: data.fhirDocumentReference,
        };
      }
    } catch (err) {
      console.warn('SOAP API fallback', err);
    }

    return {
      id: `SOAP-${Date.now()}`,
      patientName: patient.name,
      encounterDate: new Date().toISOString().slice(0, 10),
      clinician: patient.primaryCareProvider,
      subjective: "34yo individual presents with 4-week history of fatigue and brain fog accentuated in mid-afternoon. Denies exertional dyspnea, chest pain, or syncope.",
      objective: "Vitals: BP 118/76 mmHg, HR 68 bpm regular. Quest Labs: Serum Ferritin 19 ng/mL (Low-normal, Ref 24-336), 25-OH Vitamin D 28 ng/mL, TSH 2.15 uIU/mL.",
      assessment: "1. Non-anemic iron deficiency / depleted tissue iron stores (ICD-10 E61.1).\n2. Suboptimal Vitamin D status (E55.9).\n3. Circadian sleep phase delay contributing to daytime fatigue.",
      plan: "1. Diagnostics: Order repeat Iron Panel (Serum Iron, TIBC, Transferrin Saturation) in 8 weeks.\n2. Therapeutics: Initiate oral Iron Bisglycinate 25mg daily with Vitamin C.\n3. Sleep Hygiene: Anchor morning outdoor light within 20 mins of waking; amber light curfew at 10:00 PM.",
      status: 'draft',
    };
  };

  const handleRunSwarmOrchestration = async (query: string): Promise<SwarmResult> => {
    try {
      const response = await fetch('/api/swarm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.warn('Swarm API fallback', err);
    }

    return {
      orchestrationPlan: "Parallel multi-specialist decomposition across clinical etiology, literature, patient communication, workflows, informatics, and safety.",
      agents: MOCK_SWARM_AGENTS,
      disagreementReview: {
        detected: true,
        summary: "Dr. Med advocates repeat serum iron & TIBC panel within 4 weeks, whereas Dr. Research notes circadian sleep alignment resolves subjective fatigue in 60% of cases even before ferritin normalizes.",
        tensionPoints: [
          "Timeline for repeat lab evaluation (4 weeks vs 8 weeks)",
          "Relative weight of dietary iron vs circadian sleep timing on daytime vitality",
        ],
      },
      synthesis: "Dr. T Unified Synthesis: The clinical picture presents non-anemic iron deficiency combined with circadian phase delay. We recommend initiating gentle iron bisglycinate alongside morning sunlight synchronization. Dr. Med and Dr. Research evaluated both biochemical supplementation and autonomic circadian restoration, harmonized below.",
    };
  };

  const handleRunEvidenceSynthesis = async (topic: string): Promise<ResearchSynthesis> => {
    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: topic }),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.warn('Evidence API fallback', err);
    }

    return {
      query: topic,
      aiSynthesis: "Multiple randomized double-blind placebo-controlled trials demonstrate that oral iron supplementation in non-anemic adults with serum ferritin <50 ng/mL produces statistically significant improvements in subjective vitality and reduces mental exhaustion (p < 0.001).",
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
    };
  };

  // Notification helpers
  const handleMarkNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900">
      
      {/* Top Application Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentLanguage={currentLanguage}
        setCurrentLanguage={setCurrentLanguage}
        notifications={notifications}
        openNotifications={() => setIsNotificationDrawerOpen(true)}
        openCommandPalette={() => setIsCommandPaletteOpen(true)}
        openVoiceMode={() => setIsVoiceModeOpen(true)}
        openDemoJourney={() => setIsDemoJourneyOpen(true)}
        openBirthdayModal={() => setIsBirthdayModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'drt' && (
          <DrTHome
            messages={messages}
            onSendMessage={handleSendMessage}
            personality={personality}
            setPersonality={setPersonality}
            openVoiceMode={() => setIsVoiceModeOpen(true)}
            openBirthdayModal={() => setIsBirthdayModalOpen(true)}
            patient={patient}
            setActiveTab={setActiveTab}
            isLoading={isLoadingChat}
          />
        )}

        {activeTab === 'readit' && (
          <DrTReadItApp />
        )}

        {activeTab === 'petwhisperer' && (
          <PetWhispererApp />
        )}

        {activeTab === 'openwebos' && (
          <OpenWebOSApp />
        )}

        {activeTab === 'greenieverse' && (
          <GreenieVerseApp />
        )}

        {activeTab === 'tribhouse' && (
          <TribHouseContainer />
        )}

        {activeTab === 'intelligence' && (
          <HealthIntelligence
            patient={patient}
            events={MOCK_TIMELINE_EVENTS}
            insights={MOCK_HEALTH_INSIGHTS}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'informatics' && (
          <ClinicalInformatics
            labResults={MOCK_LAB_RESULTS}
            fhirResources={MOCK_FHIR_RESOURCES}
            setActiveTab={setActiveTab}
            onGenerateSOAP={handleGenerateSOAP}
          />
        )}

        {activeTab === 'swarm' && (
          <AISwarm
            agents={MOCK_SWARM_AGENTS}
            setActiveTab={setActiveTab}
            onRunSwarmOrchestration={handleRunSwarmOrchestration}
          />
        )}

        {activeTab === 'research' && (
          <ResearchLab
            icuPatients={MOCK_ICU_PATIENTS}
            setActiveTab={setActiveTab}
            onRunEvidenceSynthesis={handleRunEvidenceSynthesis}
          />
        )}

        {activeTab === 'smarist' && (
          <SmAristStudio
            skinMetrics={MOCK_SKIN_METRICS}
            fashionOutfits={MOCK_FASHION_OUTFITS}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'automation' && (
          <ClinicalAutomation
            workflows={MOCK_WORKFLOWS}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'privacy' && (
          <PrivacyCenter
            consents={MOCK_CONSENT_RECORDS}
            memories={MOCK_USER_MEMORIES}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'economy' && (
          <AgentEconomy
            services={MOCK_ECONOMY_AGENTS}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'x402' && (
          <X402PayPerRequestStudio
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'gcp' && (
          <GoogleCloudHub />
        )}

        {activeTab === 'settings' && (
          <SettingsPage
            patient={patient}
            setPatient={setPatient}
            language={currentLanguage}
            setLanguage={setCurrentLanguage}
            personality={personality}
            setPersonality={setPersonality}
            setActiveTab={setActiveTab}
          />
        )}
      </main>

      {/* Global Overlays & Modals */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        setActiveTab={setActiveTab}
        openVoiceMode={() => setIsVoiceModeOpen(true)}
      />

      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        notifications={notifications}
        markAsRead={handleMarkNotificationRead}
        markAllAsRead={handleMarkAllNotificationsRead}
        setActiveTab={setActiveTab}
      />

      <VoiceModeOverlay
        isOpen={isVoiceModeOpen}
        onClose={() => setIsVoiceModeOpen(false)}
        onSendMessage={handleSendMessage}
        personality={personality}
      />

      <DemoJourneyModal
        isOpen={isDemoJourneyOpen}
        onClose={() => setIsDemoJourneyOpen(false)}
        setActiveTab={setActiveTab}
        openVoiceMode={() => setIsVoiceModeOpen(true)}
      />

      <BirthdayModal
        isOpen={isBirthdayModalOpen}
        onClose={() => setIsBirthdayModalOpen(false)}
      />

      {/* Global Footer with Persistent Clinical Disclaimer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">🩺 Dr. T</span>
            <span>— Biomedical Informatics, Wellness & Healthcare Experience Platform</span>
          </div>

          <div className="text-[11px] text-slate-400 text-center sm:text-right max-w-xl">
            <strong>Mandatory Medical Notice:</strong> Dr. T is an educational and clinical decision-support AI platform. It is NOT a replacement for a licensed healthcare professional, diagnosis, or treatment.
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
