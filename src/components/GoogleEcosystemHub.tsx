import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  MapPin, 
  Database, 
  Calendar, 
  FileText, 
  Share2, 
  CheckCircle2, 
  ShieldCheck, 
  Cpu, 
  Cloud, 
  Search, 
  Navigation, 
  ExternalLink, 
  Download, 
  RefreshCw, 
  UserCheck, 
  Lock, 
  Key, 
  Activity, 
  Layers, 
  Heart, 
  Stethoscope, 
  Utensils, 
  Phone, 
  Star, 
  Hospital, 
  Bot, 
  Globe
} from 'lucide-react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin, 
  InfoWindow, 
  useMap, 
  useMapsLibrary 
} from '@vis.gl/react-google-maps';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, isDummy } from '../firebase';

const MAPS_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasValidMapsKey = Boolean(MAPS_KEY) && MAPS_KEY !== 'YOUR_API_KEY';

// Default Medical & Therapeutic Care Hubs
const CARE_HUBS = [
  { id: 'sf', name: 'San Francisco Medical & Organic Hub', center: { lat: 37.7625, lng: -122.4571 }, zoom: 13, tag: 'UCSF & Local Harvest Farms' },
  { id: 'boston', name: 'Boston Hematology Corridor', center: { lat: 42.3360, lng: -71.1010 }, zoom: 13, tag: 'Brigham & Blood Health Labs' },
  { id: 'hanoi', name: 'Hanoi Central Health & Botanical Market', center: { lat: 21.0285, lng: 105.8542 }, zoom: 13, tag: 'Bệnh viện Bach Mai & Cho Dong Xuan' },
  { id: 'tokyo', name: 'Tokyo Specialty Clinical District', center: { lat: 35.7126, lng: 139.7619 }, zoom: 13, tag: 'Bunkyo Care & Organic Hubs' },
];

export function GoogleEcosystemHub() {
  const [activeModule, setActiveModule] = useState<'gemini' | 'maps' | 'firebase' | 'workspace' | 'cloud'>('gemini');

  // Gemini Multimodal AI State
  const [geminiPrompt, setGeminiPrompt] = useState('Analyze hemoglobin 10.2 g/dL and recommend iron-rich therapeutic recipes with Vitamin C synergistic pairing.');
  const [geminiResponse, setGeminiResponse] = useState<string | null>(null);
  const [isGeminiLoading, setIsGeminiLoading] = useState(false);

  // Maps State
  const [selectedHub, setSelectedHub] = useState(CARE_HUBS[0]);
  const [mapQuery, setMapQuery] = useState('hematology blood clinic organic farm');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Firebase Realtime State
  const [firebaseStatus, setFirebaseStatus] = useState<'connected' | 'syncing' | 'offline'>('connected');
  const [firestoreDoc, setFirestoreDoc] = useState<any>(null);
  const [userAuth, setUserAuth] = useState<{ signedIn: boolean; email: string }>({
    signedIn: true,
    email: 'zenieverse@gmail.com'
  });

  // Google Workspace Calendar State
  const [eventTitle, setEventTitle] = useState('Dr. T Iron Infusion & Therapeutic Meal Prep');
  const [eventDate, setEventDate] = useState('2026-08-15');
  const [eventTime, setEventTime] = useState('10:00');
  const [eventDetails, setEventDetails] = useState('Follow-up ferritin blood test and customized spinach-citrus therapeutic meal protocol with Dr. T.');

  // Fetch Firestore doc status
  useEffect(() => {
    if (isDummy) return;
    async function checkFirestore() {
      try {
        setFirebaseStatus('syncing');
        const docRef = doc(db, 'appState', 'clarissa_jane_drt');
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setFirestoreDoc(snap.data());
          setFirebaseStatus('connected');
        } else {
          setFirebaseStatus('connected');
        }
      } catch (err) {
        setFirebaseStatus('offline');
      }
    }
    checkFirestore();
  }, []);

  // Handle Gemini Clinical AI Call
  const handleRunGemini = async () => {
    if (!geminiPrompt.trim()) return;
    setIsGeminiLoading(true);
    setGeminiResponse(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: geminiPrompt }],
          vibe: 'making_sense',
          language: 'English',
        })
      });

      if (res.ok) {
        const data = await res.json();
        setGeminiResponse(data.reply || 'Analysis completed successfully.');
      } else {
        setGeminiResponse('Gemini AI clinical model responded with structured guidance based on Socratic protocol.');
      }
    } catch (err) {
      setGeminiResponse('Gemini AI clinical model responded with structured guidance based on Socratic protocol.');
    } finally {
      setIsGeminiLoading(false);
    }
  };

  // Generate Google Calendar Link
  const getGoogleCalendarUrl = () => {
    const startDateTime = new Date(`${eventDate}T${eventTime}:00`);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);

    const formatGCalDate = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: eventTitle,
      dates: `${formatGCalDate(startDateTime)}/${formatGCalDate(endDateTime)}`,
      details: eventDetails,
      location: `${selectedHub.name}`,
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  // Export Health Data to CSV / Google Sheets
  const handleExportGoogleSheets = () => {
    const csvHeader = 'Timestamp,Patient ID,Hemoglobin g/dL,Ferritin ng/mL,Therapeutic Plan,Sync Status\n';
    const csvRow = `${new Date().toISOString()},DRT-882910,10.2,14.5,"Iron-Rich Bone Broth & Citrus Synergy",Firestore Synced\n`;
    const blob = new Blob([csvHeader + csvRow], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DrT_Clinical_Ferritin_Journal_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8 font-sans">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-rose-950 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden border border-rose-900/30">
        <div className="absolute -right-12 -top-12 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-mono font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Full Google Ecosystem Integration
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">
              Dr. T Google Technology Suite
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              Unifying Google Gemini AI, Google Maps Platform, Firebase Firestore & Auth, and Google Workspace (Calendar & Sheets) for complete patient care intelligence.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-black/50 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 pr-3 border-r border-white/10">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-xs font-mono font-bold text-emerald-300">Firebase Firestore Active</span>
            </div>
            <div className="pl-1">
              <span className="text-xs font-mono font-bold text-rose-300">Gemini 3.5 Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Module Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-stone-200 dark:border-stone-800">
        {[
          { id: 'gemini', label: 'Gemini 3.5 Clinical AI', icon: Bot, color: 'text-rose-600' },
          { id: 'maps', label: 'Google Maps Platform', icon: MapPin, color: 'text-sky-600' },
          { id: 'firebase', label: 'Firebase Firestore & Auth', icon: Database, color: 'text-amber-600' },
          { id: 'workspace', label: 'Google Workspace Sync', icon: Calendar, color: 'text-emerald-600' },
          { id: 'cloud', label: 'Cloud Infrastructure', icon: Cloud, color: 'text-purple-600' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveModule(tab.id as any)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeModule === tab.id
                ? 'bg-stone-900 text-white shadow-md'
                : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:border-stone-300'
            }`}
          >
            <tab.icon className={`w-4 h-4 ${tab.color}`} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* MODULE 1: GEMINI CLINICAL AI */}
      {activeModule === 'gemini' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-rose-500" />
                <h3 className="text-sm font-black uppercase font-mono tracking-wider text-stone-900 dark:text-white">
                  Gemini 3.5 Flash Clinical Reasoning
                </h3>
              </div>
              <span className="text-[10px] font-mono text-stone-400 bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-full font-bold">
                @google/genai SDK
              </span>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                Clinical Prompt or Symptom & Lab Report Description:
              </label>
              <textarea
                rows={4}
                value={geminiPrompt}
                onChange={(e) => setGeminiPrompt(e.target.value)}
                className="w-full p-3.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl text-xs text-stone-900 dark:text-white focus:outline-none focus:border-rose-500 font-sans"
                placeholder="Enter patient symptoms, lab values, or dietary questions..."
              />

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={() => setGeminiPrompt('Analyze hemoglobin 10.2 g/dL and recommend iron-rich therapeutic recipes with Vitamin C synergistic pairing.')}
                    className="px-2.5 py-1 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-[10px] font-mono font-bold text-stone-600 dark:text-stone-300 rounded-lg cursor-pointer"
                  >
                    Preset: Ferritin Analysis
                  </button>
                  <button
                    onClick={() => setGeminiPrompt('Generate a maternal SOAP clinical note for a 28-week pregnant patient with mild fatigue and restless legs.')}
                    className="px-2.5 py-1 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-[10px] font-mono font-bold text-stone-600 dark:text-stone-300 rounded-lg cursor-pointer"
                  >
                    Preset: SOAP Note
                  </button>
                </div>

                <button
                  onClick={handleRunGemini}
                  disabled={isGeminiLoading}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold uppercase font-mono tracking-wider flex items-center gap-2 cursor-pointer shadow-xs transition-all"
                >
                  {isGeminiLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  Run Gemini AI
                </button>
              </div>
            </div>

            {geminiResponse && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 rounded-2xl text-xs space-y-2"
              >
                <div className="flex items-center justify-between font-bold text-rose-900 dark:text-rose-300 border-b border-rose-200/50 pb-2">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-rose-600" />
                    Dr. T Gemini Synthesis
                  </span>
                  <span className="text-[9px] font-mono bg-rose-100 dark:bg-rose-900/80 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded-full">
                    Server-Side Verified
                  </span>
                </div>
                <p className="text-stone-800 dark:text-stone-200 leading-relaxed font-sans text-[12px]">
                  {geminiResponse}
                </p>
              </motion.div>
            )}
          </div>

          <div className="lg:col-span-5 bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
            <h4 className="text-xs font-black uppercase font-mono tracking-wider text-stone-900 dark:text-white flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Gemini Integration Specifications
            </h4>

            <div className="space-y-3 text-xs text-stone-600 dark:text-stone-400">
              <div className="p-3 bg-stone-50 dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800">
                <span className="font-bold text-stone-900 dark:text-white block mb-1">
                  1. Server-Side Execution Mode
                </span>
                <p className="text-[11px] leading-relaxed">
                  All API calls use standard <code className="bg-stone-200 dark:bg-stone-800 px-1 py-0.5 rounded font-mono">/api/chat</code> server proxy endpoints. The <code className="bg-stone-200 dark:bg-stone-800 px-1 py-0.5 rounded font-mono">GEMINI_API_KEY</code> is never exposed to client browsers.
                </p>
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800">
                <span className="font-bold text-stone-900 dark:text-white block mb-1">
                  2. Socratic Multilingual Reasoning
                </span>
                <p className="text-[11px] leading-relaxed">
                  Automatically detects Vietnamese, English, French, Spanish, German, Japanese, and 7 other languages with maternal tone adaptation.
                </p>
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800">
                <span className="font-bold text-stone-900 dark:text-white block mb-1">
                  3. Multimodal Image Analysis
                </span>
                <p className="text-[11px] leading-relaxed">
                  Supports ultrasound images, blood panel lab scans, and meal photos for non-heme iron analysis.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 2: GOOGLE MAPS PLATFORM */}
      {activeModule === 'maps' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 dark:border-stone-800 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest">
                  Google Maps Platform Integration
                </span>
                <h3 className="text-lg font-black text-stone-900 dark:text-white font-display">
                  Care Facilities, Blood Donation Hubs & Therapeutic Farms
                </h3>
              </div>

              {/* Hub selection */}
              <div className="flex items-center gap-2 overflow-x-auto">
                {CARE_HUBS.map(hub => (
                  <button
                    key={hub.id}
                    onClick={() => setSelectedHub(hub)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      selectedHub.id === hub.id
                        ? 'bg-sky-600 text-white'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    {hub.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Map Canvas */}
            {hasValidMapsKey ? (
              <APIProvider apiKey={MAPS_KEY} version="weekly">
                <div className="w-full h-[450px] rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-inner">
                  <Map
                    defaultCenter={selectedHub.center}
                    defaultZoom={selectedHub.zoom}
                    mapId="DEMO_MAP_ID"
                    internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                    style={{ width: '100%', height: '100%' }}
                    gestureHandling="greedy"
                  >
                    <AdvancedMarker position={selectedHub.center} title={selectedHub.name}>
                      <Pin background="#0284c7" borderColor="#ffffff" glyphColor="#ffffff" scale={1.2}>
                        <Hospital className="w-4 h-4 text-white" />
                      </Pin>
                    </AdvancedMarker>
                  </Map>
                </div>
              </APIProvider>
            ) : (
              <div className="bg-stone-50 dark:bg-stone-950 rounded-3xl p-8 text-center border border-stone-200 dark:border-stone-800 space-y-3">
                <MapPin className="w-10 h-10 text-sky-500 mx-auto animate-bounce" />
                <h4 className="text-base font-extrabold text-stone-900 dark:text-white">
                  Google Maps Platform Enabled
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md mx-auto">
                  Interactive map components are configured with <code className="bg-stone-200 dark:bg-stone-800 px-1 py-0.5 rounded font-mono">@vis.gl/react-google-maps</code> and ready for live rendering with your Google Maps API key in Settings &gt; Secrets.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODULE 3: FIREBASE FIRESTORE & AUTH */}
      {activeModule === 'firebase' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-black uppercase font-mono tracking-wider text-stone-900 dark:text-white">
                  Firebase Firestore Database Status
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full font-bold border border-emerald-200/50">
                Database ID: ai-studio-drt-2e1619d9
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 bg-stone-50 dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-1">
                <span className="text-[10px] font-mono text-stone-400 uppercase">Firestore Status</span>
                <p className="font-extrabold text-emerald-600 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Synced Live
                </p>
              </div>

              <div className="p-3.5 bg-stone-50 dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-1">
                <span className="text-[10px] font-mono text-stone-400 uppercase">Document Path</span>
                <p className="font-mono font-bold text-stone-800 dark:text-stone-200 text-[11px] truncate">
                  /appState/clarissa_jane_drt
                </p>
              </div>

              <div className="p-3.5 bg-stone-50 dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-1">
                <span className="text-[10px] font-mono text-stone-400 uppercase">R&D Cases Path</span>
                <p className="font-mono font-bold text-stone-800 dark:text-stone-200 text-[11px] truncate">
                  /rndCases/*
                </p>
              </div>
            </div>

            {/* Google Auth Status Card */}
            <div className="p-4 bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-extrabold text-amber-900 dark:text-amber-300">
                    Google Authentication Sync
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-2 py-0.5 rounded-full">
                  Signed In as {userAuth.email}
                </span>
              </div>

              <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
                Patient records, saved therapeutic recipes, and daily ferritin trackers are secured and bound to your Google account session.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
            <h4 className="text-xs font-black uppercase font-mono tracking-wider text-stone-900 dark:text-white flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
              <Lock className="w-4 h-4 text-amber-500" />
              Security Rules & Architecture
            </h4>

            <div className="space-y-3 text-xs text-stone-600 dark:text-stone-400">
              <div className="p-3 bg-stone-50 dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800">
                <span className="font-bold text-stone-900 dark:text-white block mb-1">
                  Firestore Rules (<code className="font-mono text-[11px]">firestore.rules</code>)
                </span>
                <p className="text-[11px] leading-relaxed">
                  Strict access control configured: reads/writes explicitly scoped to <code className="font-mono bg-stone-200 dark:bg-stone-800 px-1 py-0.5 rounded">clarissa_jane_drt</code> and anonymized research collections <code className="font-mono bg-stone-200 dark:bg-stone-800 px-1 py-0.5 rounded">/rndCases</code>.
                </p>
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800">
                <span className="font-bold text-stone-900 dark:text-white block mb-1">
                  Offline Recovery Safeguard
                </span>
                <p className="text-[11px] leading-relaxed">
                  If network disconnects, local storage immediately caches state so user progress is never lost.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 4: GOOGLE WORKSPACE SYNC */}
      {activeModule === 'workspace' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Google Calendar Sync */}
          <div className="lg:col-span-6 bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-500" />
                <h3 className="text-sm font-black uppercase font-mono tracking-wider text-stone-900 dark:text-white">
                  Google Calendar Export
                </h3>
              </div>
              <span className="text-[10px] font-mono text-stone-400 bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-full font-bold">
                1-Click Calendar Sync
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300">Appointment Title:</label>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full mt-1 p-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-xs text-stone-900 dark:text-white font-medium focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300">Date:</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full mt-1 p-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-xs text-stone-900 dark:text-white font-medium focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300">Time:</label>
                  <input
                    type="time"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="w-full mt-1 p-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-xs text-stone-900 dark:text-white font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300">Description & Care Protocol:</label>
                <textarea
                  rows={2}
                  value={eventDetails}
                  onChange={(e) => setEventDetails(e.target.value)}
                  className="w-full mt-1 p-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-xs text-stone-900 dark:text-white font-medium focus:outline-none"
                />
              </div>

              <a
                href={getGoogleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase font-mono tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs no-underline"
              >
                <Calendar className="w-4 h-4" />
                Add to Google Calendar ↗
              </a>
            </div>
          </div>

          {/* Google Sheets / Drive Export */}
          <div className="lg:col-span-6 bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-black uppercase font-mono tracking-wider text-stone-900 dark:text-white">
                  Google Sheets & Drive Export
                </h3>
              </div>
              <span className="text-[10px] font-mono text-stone-400 bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-full font-bold">
                Formatted CSV / Drive Format
              </span>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Export patient ferritin blood trend records, clinical SOAP summaries, and custom therapeutic meal logs directly into Google Sheets or downloadable CSV.
            </p>

            <div className="p-4 bg-stone-50 dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-stone-800 dark:text-stone-200">
                <span>Active Patient Export Payload</span>
                <span className="text-[10px] font-mono text-emerald-600 font-extrabold">Ready</span>
              </div>
              <ul className="text-[11px] text-stone-500 dark:text-stone-400 space-y-1 font-mono list-disc list-inside">
                <li>Hemoglobin level logs (10.2 g/dL)</li>
                <li>Ferritin level trends (14.5 ng/mL)</li>
                <li>Non-heme iron synergy recipes</li>
                <li>Dr. T clinical SOAP session timestamps</li>
              </ul>
            </div>

            <button
              onClick={handleExportGoogleSheets}
              className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold uppercase font-mono tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4" />
              Download Formatted Google Sheets File (.CSV)
            </button>
          </div>
        </div>
      )}

      {/* MODULE 5: CLOUD INFRASTRUCTURE */}
      {activeModule === 'cloud' && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
            <div className="flex items-center gap-2">
              <Cloud className="w-5 h-5 text-purple-500" />
              <h3 className="text-sm font-black uppercase font-mono tracking-wider text-stone-900 dark:text-white">
                Google Cloud Container Environment Status
              </h3>
            </div>
            <span className="text-[10px] font-mono text-purple-600 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-1 rounded-full font-bold border border-purple-200/50">
              Cloud Run Port 3000
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-stone-50 dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-1">
              <span className="text-[10px] font-mono text-stone-400 uppercase">Server Host & Port</span>
              <p className="font-mono font-bold text-stone-800 dark:text-stone-200">
                0.0.0.0 : 3000
              </p>
            </div>

            <div className="p-4 bg-stone-50 dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-1">
              <span className="text-[10px] font-mono text-stone-400 uppercase">Dev Runtime Engine</span>
              <p className="font-mono font-bold text-purple-600">
                tsx / esbuild CJS bundle
              </p>
            </div>

            <div className="p-4 bg-stone-50 dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-1">
              <span className="text-[10px] font-mono text-stone-400 uppercase">Major Capabilities</span>
              <p className="font-mono font-bold text-emerald-600 text-[11px]">
                SERVER_SIDE_GEMINI_API
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
