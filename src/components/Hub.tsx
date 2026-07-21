import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  Smile, 
  Cpu, 
  Award, 
  Brain, 
  Users, 
  Layers,
  Music
} from 'lucide-react';
import { CompanionHub } from './CompanionHub';
import { BiomedicalSuite } from './BiomedicalSuite';
import { PortfolioShowcase } from './PortfolioShowcase';
import { LifeGraph } from './LifeGraph';
import { AgentSwarm } from './AgentSwarm';
import { Trackers } from './Trackers';
import { FluidIntelligence } from './FluidIntelligence';
import { Message, DrTVibe, DrTAppearance, MemoryNode, SpecialistAgent, MedLog, HealthMetric, SkillNode, TaskItem, CalendarEvent, SmartNote, CarbonHabit } from '../types';

interface HubProps {
  key?: string;
  // Common
  language: string;
  voiceName: string;
  setVoiceName: (name: string) => void;
  stopAudio: () => void;
  activeSuiteSubTab: 'patient' | 'fhir' | 'analytics' | 'summarizer' | 'imaging' | 'population' | 'coach' | 'lab' | 'mimic' | 'orchestrator' | 'obgyn' | 'predictions';
  setActiveSuiteSubTab: (sub: any) => void;
  setActiveTab: (tab: any) => void;
  showAmbientPlayer: boolean;
  setShowAmbientPlayer: (show: boolean) => void;

  // CompanionHub Props
  messages: Message[];
  vibe: DrTVibe;
  hasGreeted: boolean;
  inputVal: string;
  setInputVal: (val: string) => void;
  userName: string;
  setUserName: (name: string) => void;
  simulatedGreets: any[];
  isRecording: boolean;
  isThinking: boolean;
  isSpeaking: boolean;
  ttsEngine: 'gemini' | 'browser';
  setTtsEngine: (engine: 'gemini' | 'browser') => void;
  ttsPitch: number;
  setTtsPitch: (pitch: number) => void;
  ttsRate: number;
  setTtsRate: (rate: number) => void;
  avatarAppearance: DrTAppearance;
  tAge: 'young' | 'mature' | 'elder';
  emotionMeter: { stress: number; fatigue: number; happiness: number };
  setEmotionMeter: (meter: { stress: number; fatigue: number; happiness: number }) => void;
  waveHeights: number[];
  uploadNotice: string | null;
  setUploadNotice: (notice: string | null) => void;
  langNotice: string | null;
  setLangNotice: (notice: string | null) => void;
  toastNotice: string | null;
  setToastNotice: (notice: string | null) => void;
  averageSpeakIntensity: number;
  drTAvatar: string;
  triggerGreeting: (customText?: string) => void;
  handleUpdateHeartRate: (bpm: number) => void;
  getHeartRateValue: () => number;
  toggleRecording: () => void;
  setIsVoiceAgentActive: (active: boolean) => void;
  setAutoSpeak: (active: boolean) => void;
  startBreathingOverlay: () => void;
  triggerEmojis: (type: any) => void;
  speakMessage: (id: string, text: string) => void;
  handleSend: (overrideText?: string) => void;
  triggerSimulationAttachment: (type: string) => void;
  handleCustomFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  getSpeechBubbleText: (lang: string) => string;
  getIcebreakerText: (lang: string) => string;

  // Memory (LifeGraph) Props
  memoryNodes: MemoryNode[];
  onAddNode: (node: MemoryNode) => void;
  onDeleteNode: (id: string) => void;

  // Swarm (AgentSwarm) Props
  specialistAgents: SpecialistAgent[];
  setSpecialistAgents: React.Dispatch<React.SetStateAction<SpecialistAgent[]>>;
  handleTriggerSwarmCollaboration: (instruction: string) => void;
  speakDirectText: (text: string) => void;

  // Ecosystems (Trackers) Props
  medicationList: MedLog[];
  handleToggleMedication: (id: string) => void;
  handleAddMedication: (med: MedLog) => void;
  healthMetrics: HealthMetric[];
  handleAddMetric: (metric: HealthMetric) => void;
  skillNodes: SkillNode[];
  handleAdvanceSkill: (id: string) => void;
  tasks: TaskItem[];
  handleAddTask: (task: TaskItem) => void;
  handleToggleTaskState: (id: string) => void;
  handleDeleteTask: (id: string) => void;
  calendarEvents: CalendarEvent[];
  handleAddEvent: (event: CalendarEvent) => void;
  smartNotes: SmartNote[];
  handleAddNote: (note: SmartNote) => void;
  handleDeleteNote: (id: string) => void;
  carbonHabits: CarbonHabit[];
  handleToggleCarbonHabit: (id: string) => void;
}

export function Hub({
  language,
  voiceName,
  setVoiceName,
  stopAudio,
  activeSuiteSubTab,
  setActiveSuiteSubTab,
  setActiveTab,
  showAmbientPlayer,
  setShowAmbientPlayer,

  // CompanionHub Props
  messages,
  vibe,
  hasGreeted,
  inputVal,
  setInputVal,
  userName,
  setUserName,
  simulatedGreets,
  isRecording,
  isThinking,
  isSpeaking,
  ttsEngine,
  setTtsEngine,
  ttsPitch,
  setTtsPitch,
  ttsRate,
  setTtsRate,
  avatarAppearance,
  tAge,
  emotionMeter,
  setEmotionMeter,
  waveHeights,
  uploadNotice,
  setUploadNotice,
  langNotice,
  setLangNotice,
  toastNotice,
  setToastNotice,
  averageSpeakIntensity,
  drTAvatar,
  triggerGreeting,
  handleUpdateHeartRate,
  getHeartRateValue,
  toggleRecording,
  setIsVoiceAgentActive,
  setAutoSpeak,
  startBreathingOverlay,
  triggerEmojis,
  speakMessage,
  handleSend,
  triggerSimulationAttachment,
  handleCustomFileChange,
  getSpeechBubbleText,
  getIcebreakerText,

  // Memory (LifeGraph) Props
  memoryNodes,
  onAddNode,
  onDeleteNode,

  // Swarm (AgentSwarm) Props
  specialistAgents,
  setSpecialistAgents,
  handleTriggerSwarmCollaboration,
  speakDirectText,

  // Ecosystems (Trackers) Props
  medicationList,
  handleToggleMedication,
  handleAddMedication,
  healthMetrics,
  handleAddMetric,
  skillNodes,
  handleAdvanceSkill,
  tasks,
  handleAddTask,
  handleToggleTaskState,
  handleDeleteTask,
  calendarEvents,
  handleAddEvent,
  smartNotes,
  handleAddNote,
  handleDeleteNote,
  carbonHabits,
  handleToggleCarbonHabit,
}: HubProps) {

  // Local state for active sub-tab inside Hub
  const [activeSubTab, setActiveSubTab] = useState<'companion' | 'suite' | 'showcase' | 'graph' | 'swarm' | 'trackers' | 'fluid_intel'>('companion');

  return (
    <div className="flex flex-col gap-6" id="dr-t-infinity-hub-root">
      
      {/* Sub-Tab Navigation System inside Hub */}
      <div className="sticky top-[148px] sm:top-[128px] md:top-[66px] z-30 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-stone-50/95 backdrop-blur-md border border-stone-200/60 rounded-2xl p-2 gap-2 shadow-xs transition-all" id="hub-subtab-navigation">
        <div className="flex flex-wrap gap-1.5 w-full">
          <button
            type="button"
            onClick={() => { stopAudio(); setActiveSubTab('companion'); }}
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeSubTab === 'companion'
                ? 'bg-[#9f1239] text-white shadow-sm font-black'
                : 'text-stone-500 hover:text-stone-850 bg-transparent'
            }`}
          >
            <Smile className="w-4 h-4" />
            🌸 Companion Hub
          </button>

          <button
            type="button"
            onClick={() => { stopAudio(); setActiveSubTab('suite'); }}
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeSubTab === 'suite'
                ? 'bg-[#9f1239] text-white shadow-sm font-black'
                : 'text-stone-500 hover:text-stone-850 bg-transparent'
            }`}
          >
            <Cpu className="w-4 h-4" />
            🔬 Informatics Platform
          </button>

          <button
            type="button"
            onClick={() => { stopAudio(); setActiveSubTab('showcase'); }}
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeSubTab === 'showcase'
                ? 'bg-[#9f1239] text-white shadow-sm font-black'
                : 'text-stone-500 hover:text-stone-850 bg-transparent'
            }`}
          >
            <Award className="w-4 h-4" />
            🏆 Portfolio
          </button>

          <button
            type="button"
            onClick={() => { stopAudio(); setActiveSubTab('graph'); }}
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeSubTab === 'graph'
                ? 'bg-[#9f1239] text-white shadow-sm font-black'
                : 'text-stone-500 hover:text-stone-850 bg-transparent'
            }`}
          >
            <Brain className="w-4 h-4" />
            🧠 Memory
          </button>

          <button
            type="button"
            onClick={() => { stopAudio(); setActiveSubTab('swarm'); }}
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeSubTab === 'swarm'
                ? 'bg-[#9f1239] text-white shadow-sm font-black'
                : 'text-stone-500 hover:text-stone-850 bg-transparent'
            }`}
          >
            <Users className="w-4 h-4" />
            🤵 Swarm
          </button>

          <button
            type="button"
            onClick={() => { stopAudio(); setActiveSubTab('trackers'); }}
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeSubTab === 'trackers'
                ? 'bg-[#9f1239] text-white shadow-sm font-black'
                : 'text-stone-500 hover:text-stone-850 bg-transparent'
            }`}
          >
            <Layers className="w-4 h-4" />
            📊 Ecosystems
          </button>

          <button
            type="button"
            onClick={() => { stopAudio(); setActiveSubTab('fluid_intel'); }}
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeSubTab === 'fluid_intel'
                ? 'bg-[#9f1239] text-white shadow-sm font-black'
                : 'text-stone-500 hover:text-stone-850 bg-transparent'
            }`}
          >
            <Brain className="w-4 h-4 text-violet-500" />
            🧠 Fluid Core
          </button>
        </div>
      </div>

      {/* Main Content Render */}
      <div className="w-full">
        <AnimatePresence mode="wait">
          {activeSubTab === 'companion' && (
            <motion.div
              key="companion"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <CompanionHub
                showAmbientPlayer={showAmbientPlayer}
                setShowAmbientPlayer={setShowAmbientPlayer}
                messages={messages}
                vibe={vibe}
                voiceName={voiceName}
                setVoiceName={setVoiceName}
                language={language}
                hasGreeted={hasGreeted}
                inputVal={inputVal}
                setInputVal={setInputVal}
                userName={userName}
                setUserName={setUserName}
                simulatedGreets={simulatedGreets}
                isRecording={isRecording}
                isThinking={isThinking}
                isSpeaking={isSpeaking}
                ttsEngine={ttsEngine}
                setTtsEngine={setTtsEngine}
                ttsPitch={ttsPitch}
                setTtsPitch={setTtsPitch}
                ttsRate={ttsRate}
                setTtsRate={setTtsRate}
                avatarAppearance={avatarAppearance}
                tAge={tAge}
                emotionMeter={emotionMeter}
                setEmotionMeter={setEmotionMeter}
                waveHeights={waveHeights}
                uploadNotice={uploadNotice}
                setUploadNotice={setUploadNotice}
                langNotice={langNotice}
                setLangNotice={setLangNotice}
                toastNotice={toastNotice}
                setToastNotice={setToastNotice}
                averageSpeakIntensity={averageSpeakIntensity}
                drTAvatar={drTAvatar}
                triggerGreeting={triggerGreeting}
                handleUpdateHeartRate={handleUpdateHeartRate}
                getHeartRateValue={getHeartRateValue}
                toggleRecording={toggleRecording}
                setIsVoiceAgentActive={setIsVoiceAgentActive}
                setAutoSpeak={setAutoSpeak}
                startBreathingOverlay={startBreathingOverlay}
                triggerEmojis={triggerEmojis}
                speakMessage={speakMessage}
                stopAudio={stopAudio}
                handleSend={handleSend}
                triggerSimulationAttachment={triggerSimulationAttachment}
                handleCustomFileChange={handleCustomFileChange}
                getSpeechBubbleText={getSpeechBubbleText}
                getIcebreakerText={getIcebreakerText}
              />
            </motion.div>
          )}

          {activeSubTab === 'suite' && (
            <motion.div
              key="suite"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <BiomedicalSuite 
                language={language === 'auto' ? 'English' : language} 
                activeSubTab={activeSuiteSubTab}
                onSubTabChange={(sub) => setActiveSuiteSubTab(sub)}
                onUpdateHeartRate={handleUpdateHeartRate}
              />
            </motion.div>
          )}

          {activeSubTab === 'showcase' && (
            <motion.div
              key="showcase"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <PortfolioShowcase 
                language={language === 'auto' ? 'English' : language} 
                onNavigate={(tab, subTab) => {
                  stopAudio();
                  if (tab === 'suite' || tab === 'showcase' || tab === 'graph' || tab === 'swarm' || tab === 'trackers' || tab === 'hub') {
                    // Navigate locally
                    if (tab === 'suite') setActiveSubTab('suite');
                    else if (tab === 'showcase') setActiveSubTab('showcase');
                    else if (tab === 'graph') setActiveSubTab('graph');
                    else if (tab === 'swarm') setActiveSubTab('swarm');
                    else if (tab === 'trackers') setActiveSubTab('trackers');
                    else setActiveSubTab('companion');
                    
                    if (subTab) {
                      setActiveSuiteSubTab(subTab as any);
                    }
                  } else {
                    // Navigate parent
                    setActiveTab(tab as any);
                  }
                }}
              />
            </motion.div>
          )}

          {activeSubTab === 'graph' && (
            <motion.div
              key="graph"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <LifeGraph 
                memoryNodes={memoryNodes} 
                onAddNode={onAddNode} 
                onDeleteNode={onDeleteNode} 
              />
            </motion.div>
          )}

          {activeSubTab === 'swarm' && (
            <motion.div
              key="swarm"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <AgentSwarm 
                agents={specialistAgents} 
                onTriggerSwarmCollaboration={handleTriggerSwarmCollaboration}
                onAddSpecialist={(newAgent) => setSpecialistAgents(prev => [...prev, newAgent])}
                onSpeakText={speakDirectText}
                activeVoiceName={voiceName}
              />
            </motion.div>
          )}

          {activeSubTab === 'trackers' && (
            <motion.div
              key="trackers"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <Trackers
                medicationList={medicationList}
                toggleMedication={handleToggleMedication}
                onAddMedication={handleAddMedication}
                healthMetrics={healthMetrics}
                onAddMetric={handleAddMetric}
                skillNodes={skillNodes}
                onAdvanceSkill={handleAdvanceSkill}
                tasks={tasks}
                onAddTask={handleAddTask}
                onToggleTaskState={handleToggleTaskState}
                onDeleteTask={handleDeleteTask}
                calendarEvents={calendarEvents}
                onAddEvent={handleAddEvent}
                smartNotes={smartNotes}
                onAddNote={handleAddNote}
                onDeleteNote={handleDeleteNote}
                carbonHabits={carbonHabits}
                onToggleCarbonHabit={handleToggleCarbonHabit}
              />
            </motion.div>
          )}

          {activeSubTab === 'fluid_intel' && (
            <motion.div
              key="fluid_intel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <FluidIntelligence />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
