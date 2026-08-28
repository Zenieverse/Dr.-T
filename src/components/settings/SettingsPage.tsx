import React, { useState } from 'react';
import { 
  PatientProfile, 
  LanguageCode, 
  PersonalityMode, 
  NavTab 
} from '../../types';
import { 
  Settings, 
  User, 
  Globe, 
  Sparkles, 
  Cpu, 
  Activity, 
  ShieldCheck, 
  Check, 
  Smartphone, 
  Bell,
  Save
} from 'lucide-react';

interface SettingsPageProps {
  patient: PatientProfile;
  setPatient: (p: PatientProfile) => void;
  language: LanguageCode;
  setLanguage: (l: LanguageCode) => void;
  personality: PersonalityMode;
  setPersonality: (p: PersonalityMode) => void;
  setActiveTab: (tab: NavTab) => void;
}

const LANGUAGES: Array<{ code: LanguageCode; label: string; flag: string }> = [
  { code: 'en', label: 'English (US)', flag: '🇺🇸' },
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'zh', label: '中文 (Simplified)', flag: '🇨🇳' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
];

export const SettingsPage: React.FC<SettingsPageProps> = ({
  patient,
  setPatient,
  language,
  setLanguage,
  personality,
  setPersonality,
  setActiveTab,
}) => {
  const [name, setName] = useState(patient.name);
  const [age, setAge] = useState(patient.age);
  const [primaryDoctor, setPrimaryDoctor] = useState(patient.primaryCareProvider);
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setPatient({
      ...patient,
      name,
      age: Number(age),
      primaryCareProvider: primaryDoctor,
    });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-2xl bg-slate-100 text-slate-700">
              <Settings className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Platform & AI Configuration Settings
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Personalize your health profile, AI conversational style, model engine, and connected wearable feeds.
          </p>
        </div>

        {savedToast && (
          <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center space-x-1 animate-in fade-in">
            <Check className="w-3.5 h-3.5" />
            <span>Preferences Saved</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* 1. Patient Profile Demographics */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <User className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-900">Demographics & Clinical Profile</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Patient Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="font-bold text-slate-700">Primary Care Physician</label>
              <input
                type="text"
                value={primaryDoctor}
                onChange={(e) => setPrimaryDoctor(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>
        </div>

        {/* 2. Language & Localization */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Globe className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Multilingual Socratic Health Engine</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {LANGUAGES.map((l) => (
              <button
                type="button"
                key={l.code}
                onClick={() => setLanguage(l.code)}
                className={`p-3 rounded-2xl text-left border text-xs font-semibold flex items-center space-x-2 transition ${
                  language === l.code
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <span className="text-base">{l.flag}</span>
                <span>{l.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Personality & Tone Preferences */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-bold text-slate-900">Dr. T Conversational Persona</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(['Empathetic', 'Socratic', 'Clinical', 'Maternal', 'Researcher', 'Concise'] as const).map((p) => (
              <button
                type="button"
                key={p}
                onClick={() => setPersonality(p)}
                className={`p-3 rounded-2xl text-center border text-xs font-bold transition ${
                  personality === p
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Connected Health Streams */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Activity className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Connected Wearables & EHR Feeds</h3>
          </div>

          <div className="space-y-2 text-xs">
            {[
              { name: 'Apple Health & HealthKit Sync', status: 'Connected (Continuous)', time: '8m ago' },
              { name: 'Oura Ring Gen 3 (Sleep Stages & HRV)', status: 'Connected (Continuous)', time: '12m ago' },
              { name: 'Quest Diagnostics Direct Sync', status: 'Active (Aug 25, 2026)', time: '3d ago' },
              { name: 'HL7 FHIR R4 Health Center Gateway', status: 'Authorized', time: 'Active' },
            ].map((feed, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900">{feed.name}</span>
                  <p className="text-[10px] text-slate-500">{feed.status}</p>
                </div>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                  {feed.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save All Configuration Preferences</span>
          </button>
        </div>

      </form>
    </div>
  );
};
