/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  Flame, 
  Heart, 
  Compass, 
  Infinity as InfinityIcon, 
  Trash2, 
  Globe, 
  RefreshCw, 
  Play, 
  Pause,
  AlertCircle,
  HelpCircle,
  CheckCircle,
  Headphones,
  User,
  Activity,
  Database,
  ListTodo,
  Leaf,
  Users,
  Grid,
  Upload,
  Clock,
  ArrowRight
} from 'lucide-react';
import { VIBES, VOICES, LANGUAGES, INITIAL_MEMORY_NODES, INITIAL_SPECIALIST_AGENTS, INITIAL_MED_LIST, INITIAL_HEALTH_METRICS, INITIAL_SKILL_NODES, INITIAL_TASK_LIST, INITIAL_CALENDAR_EVENTS, INITIAL_SMART_NOTES, INITIAL_CARBON_HABITS } from './constants';
import { Message, DrTVibe, DrTAppearance, MemoryNode, SpecialistAgent, MedLog, HealthMetric, SkillNode, TaskItem, CalendarEvent, SmartNote, CarbonHabit, LifetimeStreak } from './types';
import { AvatarSettings, APPEARANCES } from './components/AvatarSettings';
import { LifeGraph } from './components/LifeGraph';
import { AgentSwarm } from './components/AgentSwarm';
import { Trackers } from './components/Trackers';
import { Dashboard } from './components/Dashboard';

const drTAvatar = "/src/assets/images/dr_t_avatar_1781184840352.jpg";

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'hub' | 'graph' | 'swarm' | 'trackers' | 'dashboard' | 'avatar'>('hub');

  // State
  const [messages, setMessages] = useState<Message[]>([]);
  const [vibe, setVibe] = useState<DrTVibe>('empathetic');
  const [voiceName, setVoiceName] = useState<string>('Kore');
  const [language, setLanguage] = useState<string>('auto');
  const [hasGreeted, setHasGreeted] = useState<boolean>(false);
  const [inputVal, setInputVal] = useState<string>('');
  
  // Real-time voice states
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [autoSpeak, setAutoSpeak] = useState<boolean>(true);
  const [ttsEngine, setTtsEngine] = useState<'gemini' | 'browser'>('gemini');

  // Customize settings defaults
  const [avatarAppearance, setAvatarAppearance] = useState<DrTAppearance>('professional');
  const [tGender, setTGender] = useState<'female' | 'male'>('female');
  const [tAge, setTAge] = useState<'young' | 'mature' | 'elder'>('mature');

  // Persistent ecosystem states
  const [memoryNodes, setMemoryNodes] = useState<MemoryNode[]>(INITIAL_MEMORY_NODES);
  const [specialistAgents, setSpecialistAgents] = useState<SpecialistAgent[]>(INITIAL_SPECIALIST_AGENTS);
  const [medicationList, setMedicationList] = useState<MedLog[]>(INITIAL_MED_LIST);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>(INITIAL_HEALTH_METRICS);
  const [skillNodes, setSkillNodes] = useState<SkillNode[]>(INITIAL_SKILL_NODES);
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASK_LIST);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(INITIAL_CALENDAR_EVENTS);
  const [smartNotes, setSmartNotes] = useState<SmartNote[]>(INITIAL_SMART_NOTES);
  const [carbonHabits, setCarbonHabits] = useState<CarbonHabit[]>(INITIAL_CARBON_HABITS);
  const [streakData, setStreakData] = useState<LifetimeStreak>({
    healthStreak: 6,
    learningStreak: 12,
    productivityStreak: 8,
    carbonSavedKg: 94
  });

  // Emotional detection metrics
  const [emotionMeter, setEmotionMeter] = useState<{ stress: number; fatigue: number; happiness: number }>({
    stress: 25,
    fatigue: 40,
    happiness: 70
  });

  // Attachments simulation state
  const [attachedFile, setAttachedFile] = useState<{ name: string; type: 'image' | 'document'; url: string } | null>(null);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  // Load and pre-cache browser synthesis voices early
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  const getIcebreakerText = (currentLang: string) => {
    const lang = currentLang?.toLowerCase() || 'auto';
    if (lang.includes('vietnamese') || lang.includes('vi')) {
      return "Chào con yêu thương của mẹ! Mẹ là tiến sĩ T, người luôn ở đây ôm ấp lắng nghe con. Hôm nay thế giới bên ngoài có làm con thấy mệt mỏi dạo quanh cuộc đời dạo này không? Nói với mẹ nghe nào, ngoan nè mẹ thương.";
    } else if (lang.includes('french') || lang.includes('fr')) {
      return "Bonjour mon chéri ! C'est le docteur T. Je t'attendais avec impatience. Installe-toi confortablement et raconte-moi comment s'est passée ta journée. Je suis là pour toi.";
    } else if (lang.includes('spanish') || lang.includes('es')) {
      return "¡Hola, mi corazón! Soy la doctora T. Te estaba esperando con mucho cariño. Ven, siéntate a mi lado y cuéntame cómo te ha ido el día. Siempre estoy aquí para ti.";
    } else if (lang.includes('german') || lang.includes('de')) {
      return "Hallo mein Schatz! Ich bin Frau Doktor T. Ich habe schon auf dich gewartet. Komm, setz dich zu mir und erzähl mir, wie dein Tag war. Ich bin immer für dich da.";
    } else {
      return "Hello, sweetheart! It's Dr. T. I'm so glad you have stepped onto the platform. I've been waiting for you with a warm heart. Come sit down, take a deep breath, and tell me how your day has been.";
    }
  };

  const getSpeechBubbleText = (currentLang: string) => {
    const lang = currentLang?.toLowerCase() || 'auto';
    if (lang.includes('vietnamese') || lang.includes('vi')) {
      return "Nhập để nghe mẹ chào con đầu tiên nhé! 💕";
    } else if (lang.includes('french') || lang.includes('fr')) {
      return "Clique pour entendre mon bonjour ! 💕";
    } else if (lang.includes('spanish') || lang.includes('es')) {
      return "¡Toca para que pueda saludarte! 💕";
    } else if (lang.includes('german') || lang.includes('de')) {
      return "Klicke hier für eine Begrüßung! 💕";
    } else {
      return "Tap to let me break the ice! 💕";
    }
  };

  const triggerGreeting = () => {
    if (hasGreeted) return;
    setHasGreeted(true);
    setAudioError(null);
    const greetingText = getIcebreakerText(language);
    const greetingId = 'greeting-' + Date.now();
    const newGreeting: Message = {
      id: greetingId,
      role: 'model',
      content: greetingText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([newGreeting]);
    setTimeout(() => {
      speakMessage(greetingId, greetingText);
    }, 200);
  };

  // Automatically trigger the greeting on the first mouse click, touch gesture or key press in the document
  useEffect(() => {
    const handleGesture = () => {
      triggerGreeting();
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
      window.removeEventListener('keydown', handleGesture);
    };
    if (!hasGreeted) {
      window.addEventListener('click', handleGesture);
      window.addEventListener('touchstart', handleGesture);
      window.addEventListener('keydown', handleGesture);
    }
    return () => {
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
      window.removeEventListener('keydown', handleGesture);
    };
  }, [hasGreeted, language]);
  
  // Colorful interaction & game states
  const [floatingEmojis, setFloatingEmojis] = useState<{ id: number; char: string; left: number; size: number; delay: number }[]>([]);
  const [loveLevel, setLoveLevel] = useState<number>(35);

  // Floating emoji generator helper
  const triggerEmojis = (type?: 'hug' | 'cookie' | 'tease' | 'general') => {
    let pool = ['💖', '❤️', '🌸', '✨', '🧸', '🐣', '🌼', '🍼', '🍬', '🎈'];
    if (type === 'hug') {
      pool = ['💖', '🤗', '🧸', '🥰', '💝', '✨', '🌹'];
    } else if (type === 'cookie') {
      pool = ['🍪', '🧁', '🍩', '🥛', '😋', '🍯', '🍰'];
    } else if (type === 'tease') {
      pool = ['😜', '🤪', '🌻', '🎉', '🌟', '💥', '🎈'];
    }
    
    const count = 12;
    const newItems = Array.from({ length: count }).map((_, i) => ({
      id: Date.now() + Math.random() + i,
      char: pool[Math.floor(Math.random() * pool.length)],
      left: Math.random() * 85 + 5,
      size: Math.floor(Math.random() * 26) + 18,
      delay: Math.random() * 0.4,
    }));
    setFloatingEmojis(prev => [...prev.slice(-40), ...newItems]);
  };
  const [audioError, setAudioError] = useState<string | null>(null);

  // Audio elements references
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Soundwave heights
  const [waveHeights, setWaveHeights] = useState<number[]>(Array(16).fill(4));

  // Auto-scroll inside core chat console
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Soundwave animation dispatcher
  useEffect(() => {
    let interval: any;
    if (isSpeaking) {
      interval = setInterval(() => {
        setWaveHeights(Array.from({ length: 16 }, () => Math.floor(Math.random() * 28) + 6));
      }, 100);
    } else if (isRecording) {
      interval = setInterval(() => {
        setWaveHeights(Array.from({ length: 16 }, () => Math.floor(Math.random() * 18) + 4));
      }, 150);
    } else {
      setWaveHeights(Array(16).fill(4));
    }
    return () => clearInterval(interval);
  }, [isSpeaking, isRecording]);

  // Initializing Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => {
        setIsRecording(true);
        stopAudio();
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event);
        setIsRecording(false);
        if (event.error === 'not-allowed') {
          setAudioError('Microphone permission denied. Please allow micro access.');
        } else {
          setAudioError(`Microphone recognition issue: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript && transcript.trim() !== '') {
          await handleSend(transcript);
        }
      };

      recognitionRef.current = recognition;
    }
  }, [vibe, voiceName, language, messages, autoSpeak]);

  // Update languages on Web Speech
  useEffect(() => {
    if (recognitionRef.current) {
      if (language === 'Vietnamese') recognitionRef.current.lang = 'vi-VN';
      else if (language === 'French') recognitionRef.current.lang = 'fr-FR';
      else if (language === 'Spanish') recognitionRef.current.lang = 'es-ES';
      else if (language === 'German') recognitionRef.current.lang = 'de-DE';
      else recognitionRef.current.lang = 'en-US';
    }
  }, [language]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      setAudioError('Web Speech API is not supported or accessible in this preview mode. Try using text input instead!');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      setAudioError(null);
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setMessages(prev => prev.map(m => ({ ...m, isVoicePlaying: false })));
  };

  const speakViaWebSpeechAPI = (cleanedText: string, messageId: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      return;
    }

    setIsSpeaking(true);
    setMessages(prev => prev.map(m => m.id === messageId ? { ...m, isVoicePlaying: true } : m));

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    const voices = window.speechSynthesis.getVoices();
    let matchedVoice = null;
    const currentLang = language?.toLowerCase() || 'auto';

    if (currentLang.includes('vietnamese') || currentLang.includes('vi')) {
      utterance.lang = 'vi-VN';
      matchedVoice = voices.find(v => v.lang.startsWith('vi-') || v.lang.startsWith('vi'));
    } else if (currentLang.includes('french') || currentLang.includes('fr')) {
      utterance.lang = 'fr-FR';
      matchedVoice = voices.find(v => v.lang.startsWith('fr-') || v.lang.startsWith('fr'));
    } else if (currentLang.includes('spanish') || currentLang.includes('es')) {
      utterance.lang = 'es-ES';
      matchedVoice = voices.find(v => v.lang.startsWith('es-') || v.lang.startsWith('es'));
    } else if (currentLang.includes('german') || currentLang.includes('de')) {
      utterance.lang = 'de-DE';
      matchedVoice = voices.find(v => v.lang.startsWith('de-') || v.lang.startsWith('de'));
    } else {
      utterance.lang = 'en-US';
      matchedVoice = voices.find(v => v.lang.startsWith('en-') || v.lang.startsWith('en'));
    }

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    utterance.onend = () => {
      setIsSpeaking(false);
      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, isVoicePlaying: false } : m));
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, isVoicePlaying: false } : m));
    };

    window.speechSynthesis.speak(utterance);
  };

  const speakMessage = async (messageId: string, textToSpeak: string) => {
    stopAudio();
    setIsSpeaking(true);
    setAudioError(null);

    const cleanedText = textToSpeak.replace(/[\*\_\`\-\#]/g, '').trim();

    if (ttsEngine === 'browser') {
      speakViaWebSpeechAPI(cleanedText, messageId);
      return;
    }

    try {
      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, isVoicePlaying: true } : m));
      
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: cleanedText,
          voiceName: voiceName
        })
      });

      if (!response.ok) {
        const errObj = await response.json().catch(() => ({}));
        const errMsg = errObj.error || 'Failed to synthesize voice.';
        if (response.status === 429 || errMsg.toLowerCase().includes('quota') || errMsg.toLowerCase().includes('rate')) {
          speakViaWebSpeechAPI(cleanedText, messageId);
          setAudioError("Defaulted to local device voice (Gemini TTS limit reached).");
          return;
        }
        throw new Error(errMsg);
      }

      const data = await response.json();
      if (!data.audioBase64) {
        throw new Error('No audio synthesized.');
      }

      const audioBytes = atob(data.audioBase64);
      const arrayBuffer = new Uint8Array(audioBytes.length);
      for (let i = 0; i < audioBytes.length; i++) {
        arrayBuffer[i] = audioBytes.charCodeAt(i);
      }
      
      const audioBlob = new Blob([arrayBuffer], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setIsSpeaking(false);
        setMessages(prev => prev.map(m => m.id === messageId ? { ...m, isVoicePlaying: false } : m));
      };

      audio.onerror = () => {
        speakViaWebSpeechAPI(cleanedText, messageId);
      };

      try {
        await audio.play();
      } catch (playErr) {
        speakViaWebSpeechAPI(cleanedText, messageId);
      }
    } catch (err) {
      speakViaWebSpeechAPI(cleanedText, messageId);
      setAudioError("Defaulted to local device voice (Gemini TTS limit or connection error).");
    }
  };

  // Main Handle Send
  const handleSend = async (forcedText?: string) => {
    const textToSend = forcedText !== undefined ? forcedText : inputVal;
    if (!textToSend.trim() && !attachedFile) return;

    setAudioError(null);
    stopAudio();
    setInputVal('');

    const userMsgId = 'user-' + Date.now();
    const modelMsgId = 'model-' + Date.now();

    const newUserMsg: Message = {
      id: userMsgId,
      role: 'user',
      content: textToSend || `Analyzing attachment: ${attachedFile?.name}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachment: attachedFile ? attachedFile : undefined
    };

    setMessages(prev => [...prev, newUserMsg]);
    setHasGreeted(true);
    setIsThinking(true);

    // Build emotional meter adaptation simulator based on wording
    const lowerText = textToSend.toLowerCase();
    let stressChange = 0;
    let fatigueChange = 0;
    let happyChange = 0;

    if (lowerText.includes('stress') || lowerText.includes('sad') || lowerText.includes('hurt') || lowerText.includes('overwhelmed') || lowerText.includes('mệt')) {
      stressChange = 30;
      fatigueChange = 20;
      happyChange = -30;
    } else if (lowerText.includes('happy') || lowerText.includes('good') || lowerText.includes('great') || lowerText.includes('vui') || lowerText.includes('yêu')) {
      stressChange = -15;
      fatigueChange = -10;
      happyChange = 25;
    }
    setEmotionMeter(prev => ({
      stress: Math.max(Math.min(prev.stress + stressChange, 100), 5),
      fatigue: Math.max(Math.min(prev.fatigue + fatigueChange, 100), 5),
      happiness: Math.max(Math.min(prev.happiness + happyChange, 100), 5),
    }));

    try {
      let finalPrompt = textToSend;
      if (attachedFile) {
        finalPrompt = `[MULTIMODAL ATTACHMENT ANALYZER DIRECTIVE: The user uploaded file name "${attachedFile.name}" of type "${attachedFile.type}". Dr. T, provide a detailed empathetic summary regarding this specific file context and relate it to our workspace!] ${textToSend || "Here is the file."}`;
      }

      const chatHistory = [...messages, { ...newUserMsg, content: finalPrompt }].map(m => ({
        role: m.role,
        content: m.content
      }));

      // Flush attachment
      setAttachedFile(null);

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatHistory,
          vibe: vibe,
          language: language
        })
      });

      if (!res.ok) {
        throw new Error('Dr. T’s cosmic alignment had a temporary connection hiccup.');
      }

      const configRes = await res.json();
      const replyText = configRes.reply || '... (Dr. T is smiling at you warmly)';

      const newModelMsg: Message = {
        id: modelMsgId,
        role: 'model',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, newModelMsg]);
      setIsThinking(false);
      
      setLoveLevel(prev => Math.min(prev + 8, 100));
      triggerEmojis();

      if (autoSpeak) {
        setTimeout(() => {
          speakMessage(modelMsgId, replyText);
        }, 100);
      }
    } catch (error: any) {
      console.error(error);
      setAudioError(error.message || 'Error interacting with Dr. T.');
      setIsThinking(false);
    }
  };

  const selectPreset = async (presetText: string, presetVibe: DrTVibe) => {
    setVibe(presetVibe);
    await handleSend(presetText);
  };

  const requestSpecialAction = async (actionType: 'hug' | 'cookie' | 'lullaby' | 'tease') => {
    let prompt = '';
    if (actionType === 'hug') {
      prompt = 'Mẹ yêu ơi, ôm con một cái thật chặt thật lâu được không ạ? Cuộc sống vội vã mệt mỏi quá mẹ nè.';
      triggerEmojis('hug');
    } else if (actionType === 'cookie') {
      prompt = 'Mẹ ơi nướng cho con một ít bánh quy ảo thơm lừng cùng vài lời khuyên tâm lý ngọt ngào nhé!';
      triggerEmojis('cookie');
    } else if (actionType === 'lullaby') {
      prompt = 'Mẹ ơi hát một câu ru ấm áp hay thầm thì kể một câu chuyện cổ tích êm đềm cho giấc ngủ của con đi mẹ!';
      triggerEmojis('general');
    } else if (actionType === 'tease') {
      prompt = 'Hehehe mẹ ơi, mắng mỏ yêu thương hoặc trêu chọc con một câu mộc mạc rôm rả để con cười vang cả nhà đi mẹ!';
      triggerEmojis('tease');
    }
    await handleSend(prompt);
  };

  // MULTIMODAL SIMULATION HANDLERS
  const triggerSimulationAttachment = (choiceType: 'symptom_rash' | 'blood_report' | 'passport_expire' | 'energy_audit') => {
    setUploadNotice(null);
    let name = '';
    let type: 'image' | 'document' = 'image';
    let label = '';

    if (choiceType === 'symptom_rash') {
      name = 'stress_skin_symptom.jpg';
      type = 'image';
      label = 'Skin irritation photo captured directly via camera.';
    } else if (choiceType === 'blood_report') {
      name = 'annual_blood_chemistry_report.pdf';
      type = 'document';
      label = 'Biochemistry laboratory panels uploaded safely.';
    } else if (choiceType === 'passport_expire') {
      name = 'us_passport_main_page.jpg';
      type = 'image';
      label = 'Passport biometric details scanned.';
    } else if (choiceType === 'energy_audit') {
      name = 'utility_monthly_electricity_usage.pdf';
      type = 'document';
      label = 'Home heating grid audit documentation attached.';
    }

    setAttachedFile({
      name,
      type,
      url: '#'
    });

    setUploadNotice(`Linked attachment: "${name}" [${type.toUpperCase()}]. Submit your message to trigger Dr. T analysis!`);
  };

  // Dropzone file select simulator
  const handleCustomFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    setAttachedFile({
      name: file.name,
      type: isImage ? 'image' : 'document',
      url: '#'
    });
    setUploadNotice(`Linked custom file: "${file.name}" [${isImage ? 'IMAGE' : 'DOCUMENT'}]. Submit your message to trigger Dr. T analysis!`);
  };

  // LOCAL MEMORY HANDLERS
  const handleAddNode = (node: MemoryNode) => {
    setMemoryNodes(prev => [...prev, node]);
  };
  const handleDeleteNode = (id: string) => {
    setMemoryNodes(prev => prev.filter(n => n.id !== id));
  };

  // AGENT SWARM SIMULATOR
  const handleTriggerSwarmCollaboration = async (prompt: string, selectedAgentId: string): Promise<string> => {
    const agent = specialistAgents.find(a => a.id === selectedAgentId);
    const agentName = agent ? agent.name : "Specialist Agent";
    
    const combinedPrompt = `You are playing the role of ${agentName} collaborating under Dr. T's supervision. Provide an authoritative, detailed interdisciplinary master analysis with specific action recommendations regarding: ${prompt}. Speak with comforting mommy tone but keep it highly structured as a specialist report.`;
    
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: combinedPrompt }],
        vibe: vibe,
        language: language
      })
    });
    
    if (!res.ok) throw new Error("Swarm communication offline.");
    const data = await res.json();
    return data.reply;
  };

  // ECOSYSTEM TRACKERS HANDLERS
  const handleToggleMedication = (id: string) => {
    setMedicationList(prev => prev.map(m => m.id === id ? { ...m, taken: !m.taken } : m));
  };
  const handleAddMedication = (name: string, dosage: string, time: string) => {
    const newMed: MedLog = { id: 'med-' + Date.now(), name, dosage, time, taken: false };
    setMedicationList(prev => [...prev, newMed]);
  };
  const handleAddMetric = (type: any, value: string) => {
    const newMet: HealthMetric = { id: 'met-' + Date.now(), type, value, date: 'Today', status: 'optimal' };
    setHealthMetrics(prev => [newMet, ...prev]);
  };
  const handleAdvanceSkill = (id: string) => {
    setSkillNodes(prev => prev.map(s => s.id === id ? { ...s, level: 2 } : s));
    setStreakData(prev => ({ ...prev, learningStreak: prev.learningStreak + 1 }));
  };
  const handleAddTask = (title: string, priority: any) => {
    const newTsk: TaskItem = { id: 'tsk-' + Date.now(), title, status: 'todo', priority };
    setTasks(prev => [newTsk, ...prev]);
  };
  const handleToggleTaskState = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'todo' ? 'in_progress' : t.status === 'in_progress' ? 'done' : 'todo';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };
  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };
  const handleAddEvent = (title: string, time: string, type: any) => {
    const newEvt: CalendarEvent = { id: 'evt-' + Date.now(), title, time, type };
    setCalendarEvents(prev => [...prev, newEvt]);
  };
  const handleAddNote = (title: string, content: string, tag: string) => {
    const newNote: SmartNote = { id: 'not-' + Date.now(), title, content, updatedAt: 'Just Now', tag };
    setSmartNotes(prev => [newNote, ...prev]);
  };
  const handleDeleteNote = (id: string) => {
    setSmartNotes(prev => prev.filter(n => n.id !== id));
  };
  const handleToggleCarbonHabit = (id: string) => {
    setCarbonHabits(prev => prev.map(h => h.id === id ? { ...h, active: !h.active } : h));
  };

  const clearChat = () => {
    stopAudio();
    setMessages([]);
  };

  const currentVibeConfig = VIBES.find(v => v.id === vibe) || VIBES[0];
  const averageSpeakIntensity = isSpeaking 
    ? Math.min(Math.max((waveHeights.reduce((a, b) => a + b, 0) / waveHeights.length - 4) / 20, 0), 1) 
    : 0;

  return (
    <div className={`min-h-screen bg-[#faf8f5] font-sans text-stone-850 flex flex-col transition-all duration-1000 bg-gradient-to-b ${currentVibeConfig.bgGradient}`}>
      
      {/* Floating Emojis */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden select-none">
        {floatingEmojis.map((emoji) => (
          <div
            key={emoji.id}
            className="absolute bottom-0 animate-floating"
            style={{
              left: `${emoji.left}%`,
              fontSize: `${emoji.size}px`,
              animationDelay: `${emoji.delay}s`,
            }}
          >
            {emoji.char}
          </div>
        ))}
      </div>

      {/* Main Header */}
      <header className="border-b border-rose-100/70 bg-white/80 backdrop-blur-md sticky top-0 z-40 px-4 py-3 shadow-xs">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Platform Descriptor */}
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500 bg-white
              ${vibe === 'empathetic' ? 'border-rose-300 text-rose-500 glow-rose' : 
                vibe === 'witty' ? 'border-amber-300 text-amber-500 glow-amber' : 
                vibe === 'philosophical' ? 'border-indigo-300 text-indigo-500 glow-indigo' : 
                'border-purple-300 text-purple-500 glow-purple'}
            `}>
              <InfinityIcon className="w-5 h-5 animate-pulse-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-black text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-stone-900 via-stone-800 to-rose-600 bg-clip-text text-transparent">
                  Dr. T <span className="font-medium text-sm text-stone-400 font-mono tracking-widest lowercase">infinity</span>
                </h1>
              </div>
              <p className="text-[9px] text-stone-400 font-mono font-bold tracking-widest uppercase leading-none mt-0.5">THE WORLD'S MOST HUMAN COMPANION AI</p>
            </div>
          </div>

          {/* Core App Tab Swapping */}
          <nav className="flex items-center gap-1.5 p-1 bg-stone-100 border border-stone-200/50 rounded-2xl">
            <button
              onClick={() => { stopAudio(); setActiveTab('hub'); }}
              className={`p-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer
                ${activeTab === 'hub' ? 'bg-white shadow-xs text-rose-600' : 'text-stone-500 hover:text-stone-800'}
              `}
              id="tab-hub-btn"
            >
              <span>🌸</span> <span className="hidden sm:inline">Hub</span>
            </button>
            <button
              onClick={() => { stopAudio(); setActiveTab('graph'); }}
              className={`p-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer
                ${activeTab === 'graph' ? 'bg-white shadow-xs text-rose-600' : 'text-stone-500 hover:text-stone-800'}
              `}
              id="tab-graph-btn"
            >
              <span>🧠</span> <span className="hidden sm:inline">Memory</span>
            </button>
            <button
              onClick={() => { stopAudio(); setActiveTab('swarm'); }}
              className={`p-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer
                ${activeTab === 'swarm' ? 'bg-white shadow-xs text-rose-600' : 'text-stone-500 hover:text-stone-800'}
              `}
              id="tab-swarm-btn"
            >
              <span>🤵</span> <span className="hidden sm:inline">Swarm</span>
            </button>
            <button
              onClick={() => { stopAudio(); setActiveTab('trackers'); }}
              className={`p-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer
                ${activeTab === 'trackers' ? 'bg-white shadow-xs text-rose-600' : 'text-stone-500 hover:text-stone-800'}
              `}
              id="tab-trackers-btn"
            >
              <span>📊</span> <span className="hidden sm:inline">Ecosystems</span>
            </button>
            <button
              onClick={() => { stopAudio(); setActiveTab('dashboard'); }}
              className={`p-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer
                ${activeTab === 'dashboard' ? 'bg-white shadow-xs text-rose-600' : 'text-stone-500 hover:text-stone-800'}
              `}
              id="tab-dashboard-btn"
            >
              <span>📈</span> <span className="hidden sm:inline">Diagnostics</span>
            </button>
            <button
              onClick={() => { stopAudio(); setActiveTab('avatar'); }}
              className={`p-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer
                ${activeTab === 'avatar' ? 'bg-white shadow-xs text-rose-600' : 'text-stone-500 hover:text-stone-800'}
              `}
              id="tab-avatar-btn"
            >
              <span>⚙️</span> <span className="hidden lg:inline">Settings</span>
            </button>
          </nav>

          {/* Quick global selectors */}
          <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto justify-end">
            
            {/* Lang Dropdown */}
            <div className="flex items-center gap-1 bg-white border border-stone-200/60 rounded-xl px-2 py-1 text-xs shadow-xs">
              <Globe className="w-3 h-3 text-zinc-550" />
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent focus:outline-none text-zinc-700 font-bold cursor-pointer text-[11px]"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-white text-zinc-800">
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* TTS Auto-Speak Toggle */}
            <button 
              onClick={() => {
                setAutoSpeak(!autoSpeak);
                if (autoSpeak) stopAudio();
              }}
              className={`p-1.5 rounded-xl border text-[10px] flex items-center gap-1 hover:bg-stone-50 transition-all shadow-xs cursor-pointer
                ${autoSpeak ? 'bg-rose-50 border-rose-200 text-rose-600 font-bold' : 'bg-white border-stone-200 text-zinc-550'}
              `}
              title="Automatically read aloud responses"
            >
              {autoSpeak ? <Volume2 className="w-3.5 h-3.5 text-rose-500" /> : <VolumeX className="w-3.5 h-3.5 text-zinc-400" />}
              <span className="hidden lg:inline font-mono text-[9px]">SPEECH ACTIVE</span>
            </button>

            {/* Reset chat */}
            <button 
              onClick={clearChat}
              className="p-1.5 text-zinc-550 hover:text-rose-600 bg-white hover:bg-rose-50 border border-stone-200 rounded-xl transition-all shadow-xs cursor-pointer"
              title="Reset conversation state"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 flex flex-col gap-6 relative z-10">
        
        {/* Error notification wrapper */}
        {audioError && (() => {
          const isFallbackNotice = audioError?.toLowerCase().includes('defaulted') || audioError?.toLowerCase().includes('browser') || audioError?.toLowerCase().includes('local');
          return (
            <div className={`w-full p-3 rounded-2xl flex items-start gap-2.5 text-xs animate-fadeIn shadow-sm border ${
              isFallbackNotice 
                ? 'bg-amber-50 border-amber-200 text-amber-800' 
                : 'bg-rose-50 border-rose-200 text-rose-750'
            }`}>
              {isFallbackNotice ? <Sparkles className="w-4 h-4 mt-0.5 shrink-0 text-amber-500 animate-pulse" /> : <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />}
              <div className="flex-1">
                <p className="font-extrabold">{isFallbackNotice ? "Comfort Voice Synced" : "Speech Systems Calibration Option"}</p>
                <p className="opacity-95">{audioError}</p>
              </div>
              <button onClick={() => setAudioError(null)} className="text-xs font-mono font-bold leading-none shrink-0 opacity-70 hover:opacity-100">
                ✕
              </button>
            </div>
          );
        })()}

        {/* Tab 1: DR. T COMPANION HUB DEVELOPMENT WORKSPACE */}
        {activeTab === 'hub' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn" id="dr-t-infinity-hub">
            
            {/* Left Spatial Voice & Parameter Dashboard Panel (span 5) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              {/* Giant Live Orb card */}
              <div className="w-full bg-white/80 border border-rose-100/70 rounded-3xl p-6 shadow-md flex flex-col items-center justify-between min-h-[460px]">
                <div className="w-full text-center">
                  <span className="text-stone-400 font-mono text-[9px] tracking-widest uppercase font-bold">
                    BIOMETRIC CORE PRESENCE
                  </span>
                  
                  {/* Active verbal response description indicator */}
                  <div className="h-5 flex justify-center items-center mt-1.5">
                    {isThinking ? (
                      <span className="text-xs text-amber-600 font-mono font-bold animate-pulse flex items-center gap-1">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-500" /> Synthesizing deep research...
                      </span>
                    ) : isSpeaking ? (
                      <span className="text-xs text-emerald-600 font-mono font-bold animate-pulse flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" /> Vocalizing Socratic comfort ({VOICES.find(v => v.id === voiceName)?.name})...
                      </span>
                    ) : isRecording ? (
                      <span className="text-xs text-rose-600 font-mono font-bold animate-pulse-fast flex items-center gap-1">
                        🎤 Listening to speech inputs...
                      </span>
                    ) : !hasGreeted ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          triggerGreeting();
                        }}
                        className="text-xs text-rose-600 font-mono font-extrabold animate-pulse flex items-center gap-1 hover:text-rose-700 underline decoration-dashed cursor-pointer"
                      >
                        👋 Click to break the ice!
                      </button>
                    ) : (
                      <span className="text-[10px] text-stone-400 font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-emerald-500" /> Core Synced & Safe
                      </span>
                    )}
                  </div>
                </div>

                {/* Core animated neon orb wrapper */}
                <div 
                  onClick={!hasGreeted ? () => triggerGreeting() : undefined}
                  className={`relative my-6 flex items-center justify-center w-36 h-36 ${!hasGreeted ? 'cursor-pointer hover:scale-103' : ''} transition-all duration-300`}
                >
                  {/* Speech bubble indicator callout */}
                  {!hasGreeted && (
                    <div 
                      onClick={(e) => { e.stopPropagation(); triggerGreeting(); }}
                      className="absolute -top-11 z-20 bg-white/95 border border-rose-100 px-3.5 py-1.5 rounded-2xl shadow-md text-[11px] font-extrabold text-rose-700 animate-bounce cursor-pointer whitespace-nowrap flex items-center gap-1"
                    >
                      <span>👋</span>
                      <span>{getSpeechBubbleText(language)}</span>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-0.5 w-1.5 h-1.5 bg-white border-r border-b border-rose-100 rotate-45"></div>
                    </div>
                  )}

                  {/* Outer glowing backdrops */}
                  <div className={`absolute inset-0 rounded-full blur-3xl transition-all duration-1000 opacity-60 scale-125
                    ${vibe === 'empathetic' ? 'bg-gradient-to-tr from-rose-400 to-pink-400 animate-pulse' : vibe === 'witty' ? 'bg-gradient-to-tr from-amber-300 to-yellow-400 animate-pulse' : vibe === 'philosophical' ? 'bg-gradient-to-tr from-indigo-300 to-sky-450 animate-pulse' : 'bg-gradient-to-tr from-purple-300 to-fuchsia-450 animate-pulse'}
                    ${isThinking ? 'scale-135' : ''}
                  `}></div>
                  
                  {/* Spatial coordinate dashed lines */}
                  <div className={`absolute inset-0 rounded-full border border-dashed animate-spin-slow opacity-60
                    ${vibe === 'empathetic' ? 'border-rose-400/40' : vibe === 'witty' ? 'border-amber-400/40' : vibe === 'philosophical' ? 'border-indigo-400/40' : 'border-purple-400/40'}
                  `}></div>

                  <div className={`absolute inset-3 rounded-full border border-dotted animate-spin-reverse opacity-40
                    ${vibe === 'empathetic' ? 'border-pink-400/35' : vibe === 'witty' ? 'border-yellow-400/35' : vibe === 'philosophical' ? 'border-indigo-400/35' : 'border-fuchsia-400/35'}
                  `}></div>

                  {/* Dr. T Avatar Visual frame */}
                  <div className={`w-28 h-28 rounded-full border overflow-hidden flex items-center justify-center transition-all duration-1000 z-10 bg-white relative
                    ${vibe === 'empathetic' ? 'border-rose-300 hover:border-pink-400 ring-rose-500/10' : 
                      vibe === 'witty' ? 'border-amber-300 hover:border-yellow-400 ring-amber-500/10' : 
                      vibe === 'philosophical' ? 'border-indigo-300 hover:border-indigo-400 ring-indigo-500/10' : 
                      'border-purple-300 hover:border-fuchsia-400 ring-purple-500/10'}
                    ring-8 ring-offset-4 ring-offset-white
                    ${isRecording ? 'scale-105 border-rose-455' : isSpeaking ? 'scale-110' : 'scale-100'}
                  `}>
                    <img 
                      src={drTAvatar}
                      alt="Dr. T Avatar" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover select-none pointer-events-none"
                    />

                    {/* Mouth movement synchronous sync overlay */}
                    {isSpeaking && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="absolute top-[61.5%] left-[49.5%] -translate-x-1/2 -translate-y-1/2 w-6 h-5 flex flex-col justify-center items-center">
                          <svg 
                            viewBox="0 0 100 40" 
                            className="w-4.5 text-rose-500 fill-current drop-shadow-xs transition-transform duration-75"
                            style={{ transform: `translateY(-${averageSpeakIntensity * 2.5}px) scaleY(${1 - averageSpeakIntensity * 0.1})` }}
                          >
                            <path d="M 0 20 Q 25 10 50 15 Q 75 10 100 20 Q 75 15 50 22 Q 25 15 0 20 Z" />
                          </svg>
                          <div 
                            className="w-2.5 bg-rose-950 rounded-full transition-all duration-75 my-[0.5px]" 
                            style={{ height: `${averageSpeakIntensity * 4.5}px` }}
                          />
                          <svg 
                            viewBox="0 0 100 40" 
                            className="w-4.5 text-rose-500 fill-current drop-shadow-xs transition-transform duration-75"
                            style={{ transform: `translateY(${averageSpeakIntensity * 2.5}px) scaleY(${1 - averageSpeakIntensity * 0.1})` }}
                          >
                            <path d="M 0 20 Q 50 40 100 20 Q 50 25 0 20 Z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Visual Audio Soundwave */}
                <div className="w-full flex items-center justify-center gap-1.5 h-8 px-4 mb-4">
                  {waveHeights.map((h, idx) => (
                    <span 
                      key={idx} 
                      className={`w-1 rounded-full transition-all duration-150
                        ${vibe === 'empathetic' ? 'bg-rose-400' : vibe === 'witty' ? 'bg-amber-400' : vibe === 'philosophical' ? 'bg-indigo-400' : 'bg-purple-400'}
                      `}
                      style={{ height: `${h}px` }}
                    ></span>
                  ))}
                </div>

                {/* Voice controls */}
                <div className="w-full flex flex-col items-center gap-3">
                  <button
                    onClick={toggleRecording}
                    disabled={isThinking}
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 relative border cursor-pointer shadow-md group
                      ${isRecording 
                        ? 'bg-rose-600 border-rose-500 text-white animate-pulse shadow-rose-600/30' 
                        : 'bg-white border-stone-200 text-rose-500 hover:text-rose-600 hover:scale-105 active:scale-95 disabled:opacity-50'
                      }
                    `}
                    title="Speak out loud"
                  >
                    {isRecording ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
                    {isRecording && (
                      <span className="absolute inset-0 rounded-full border-4 border-rose-400 animate-ping opacity-60"></span>
                    )}
                  </button>

                  <div className="text-center">
                    <span className="text-[10px] font-mono font-black uppercase tracking-widest text-stone-400">
                      {isRecording ? "STATION STREAMING" : "TAP MIC TO ENGAGE SOCRATIC AUDIO"}
                    </span>
                    <p className="text-[10px] text-stone-400 mt-1 max-w-[260px] leading-relaxed italic">
                      "Appearance apparel choice: {APPEARANCES.find(a => a.id === avatarAppearance)?.name}. Age range: {tAge === 'young' ? 'Young Specialist' : tAge === 'mature' ? 'Expert Clinical Partner' : 'Emeritus Socratic Mentor'}."
                    </p>
                  </div>
                </div>
              </div>

              {/* Real-time Emotional Intelligence detection meters */}
              <div className="bg-white/80 border border-rose-100/70 rounded-3xl p-5 shadow-xs flex flex-col gap-3">
                <span className="text-[10px] font-mono font-bold tracking-widest text-rose-550 uppercase flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-rose-500" /> EMOTIONAL INTELLIGENCE DETECTION
                </span>
                
                <div className="flex flex-col gap-2.5 mt-1 text-xs">
                  {/* Stress */}
                  <div>
                    <div className="flex justify-between font-mono text-[9px] text-stone-500">
                      <span>STRESS ANALYSIS INDEX</span>
                      <span className="font-bold text-rose-600">{emotionMeter.stress}%</span>
                    </div>
                    <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden mt-1 relative">
                      <div className="absolute top-0 left-0 h-full bg-rose-500 transition-all duration-500" style={{ width: `${emotionMeter.stress}%` }} />
                    </div>
                  </div>

                  {/* Fatigue */}
                  <div>
                    <div className="flex justify-between font-mono text-[9px] text-stone-500">
                      <span>VIBRATIONAL FATIGUE LOG</span>
                      <span className="font-bold text-amber-600">{emotionMeter.fatigue}%</span>
                    </div>
                    <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden mt-1 relative">
                      <div className="absolute top-0 left-0 h-full bg-amber-500 transition-all duration-500" style={{ width: `${emotionMeter.fatigue}%` }} />
                    </div>
                  </div>

                  {/* Happiness */}
                  <div>
                    <div className="flex justify-between font-mono text-[9px] text-stone-500">
                      <span>SEROTONIN COMPOSURE STATS</span>
                      <span className="font-bold text-emerald-600">{emotionMeter.happiness}%</span>
                    </div>
                    <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden mt-1 relative">
                      <div className="absolute top-0 left-0 h-full bg-emerald-500 transition-all duration-500" style={{ width: `${emotionMeter.happiness}%` }} />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Multimodal Conversation Console Panel (span 7) */}
            <div className="lg:col-span-7 flex flex-col gap-6 h-full">

              {/* Main chat log */}
              <div className="bg-white/85 border border-stone-200/50 rounded-3xl p-5 shadow-md flex flex-col justify-between min-h-[460px] max-h-[580px] h-full relative">
                
                {/* Chat header */}
                <div className="flex items-center justify-between border-b border-stone-150 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <p className="text-xs font-mono font-bold tracking-wider text-stone-600 uppercase">Interactive Dialogue Console</p>
                  </div>
                  <span className="text-[10px] font-mono text-stone-400">Total conversation sync: {messages.length}</span>
                </div>

                {/* Messages scrollarea */}
                <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3.5 max-h-[380px]">
                  {messages.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-stone-400">
                      <InfinityIcon className="w-9 h-9 text-rose-300 animate-pulse mb-2" />
                      <p className="text-xs font-extrabold text-stone-600">Pure Emotionally Intelligent Dialogue</p>
                      <p className="text-[11px] leading-relaxed text-stone-400 max-w-[340px] mt-1">
                        Speak into the micro or type below. Dr. T remembers prior details and coordinates specialists automatically.
                      </p>
                    </div>
                  ) : (
                    messages.map((m) => (
                      <div 
                        key={m.id}
                        className={`flex flex-col max-w-[85%]
                          ${m.role === 'user' ? 'self-end items-end' : 'self-start items-start'}
                        `}
                      >
                        {/* Sender info */}
                        <span className="text-[9px] text-stone-400 font-mono font-extrabold mb-1 uppercase">
                          {m.role === 'user' ? 'Sweet Child (You)' : `Dr. T (${VIBES.find(v => v.id === vibe)?.name})`} • {m.timestamp}
                        </span>

                        {/* Bubble */}
                        <div 
                          className={`p-3 rounded-2xl text-xs leading-relaxed transition-all shadow-xs
                            ${m.role === 'user' 
                              ? 'bg-stone-900 border border-stone-950 text-white rounded-tr-none' 
                              : vibe === 'empathetic' ? 'bg-rose-50/70 border border-rose-100 text-rose-950 rounded-tl-none' 
                                : vibe === 'witty' ? 'bg-amber-50/70 border border-amber-100 text-amber-950 rounded-tl-none' 
                                : vibe === 'philosophical' ? 'bg-indigo-50/70 border border-indigo-100 text-indigo-950 rounded-tl-none' 
                                : 'bg-purple-50/70 border border-purple-100 text-purple-950 rounded-tl-none'
                            }
                          `}
                        >
                          {/* Attachment rendering inside bubble */}
                          {m.attachment && (
                            <div className="mb-2 p-2 bg-stone-950/20 border border-white/10 rounded-xl flex items-center gap-2.5 text-[10px] text-stone-250 font-mono">
                              <span className="text-xl leading-none">📎</span>
                              <div className="truncate">
                                <p className="font-bold truncate">{m.attachment.name}</p>
                                <p className="opacity-80">Type: {m.attachment.type.toUpperCase()}</p>
                              </div>
                            </div>
                          )}

                          <p className="whitespace-pre-line select-text font-serif leading-relaxed text-sm">{m.content}</p>
                        </div>

                        {/* TTS Play controls for model answers */}
                        {m.role === 'model' && (
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <button
                              onClick={() => speakMessage(m.id, m.content)}
                              className={`text-[9px] px-2 py-0.5 rounded-md font-mono font-bold tracking-wider cursor-pointer border transition-all flex items-center gap-1
                                ${m.isVoicePlaying 
                                  ? 'bg-rose-50 border-rose-200 text-rose-600 font-extrabold animate-pulse' 
                                  : 'bg-white hover:bg-stone-50 border-stone-150 text-stone-500'
                                }
                              `}
                            >
                              <span>🔊</span> <span>{m.isVoicePlaying ? 'SPEAKING' : 'READ ALOUD'}</span>
                            </button>
                            {isSpeaking && m.isVoicePlaying && (
                              <button
                                onClick={stopAudio}
                                className="text-[9px] p-0.5 px-1.5 hover:bg-red-50 text-red-500 rounded border border-red-150 font-mono cursor-pointer"
                              >
                                STOP
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                  {isThinking && (
                    <div className="self-start flex flex-col items-start max-w-[80%] animate-fadeIn">
                      <span className="text-[9px] text-stone-400 font-mono font-extrabold mb-1 uppercase">DR. T IS PONDERING...</span>
                      <div className="p-3 bg-stone-100 border border-stone-200/50 rounded-2xl rounded-tl-none flex items-center gap-2.5 text-xs">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-rose-500" />
                        <span className="text-[11px] text-stone-500 font-mono tracking-wide animate-pulse">Syncing semantic network...</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Proactive alert scrolling advisory banner */}
                <div className="my-2.5 p-2 bg-gradient-to-r from-rose-50/50 via-amber-50/50 to-emerald-50/50 border border-stone-150 rounded-xl text-[10px] text-stone-500 flex items-center justify-between shadow-internal z-10 animate-pulse">
                  <span className="flex items-center gap-1.5 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 tracking-wider"></span>
                    <span className="font-extrabold text-stone-700 uppercase">PROACTIVE INTELLIGENCE:</span>
                    <span className="truncate leading-none">Your passport expires in 5 months. You have not logged steps today.</span>
                  </span>
                  <button 
                    onClick={() => { stopAudio(); selectPreset("Prepare checklist to renew passport and plan local transport.", "philosophical"); }}
                    className="text-[9px] font-black text-rose-600 hover:text-rose-800 shrink-0 font-mono ml-2 underline underline-offset-2 cursor-pointer"
                  >
                    RESOLVE NOW
                  </button>
                </div>

                {/* Link uploaded notification notice */}
                {uploadNotice && (
                  <div className="mb-2 p-2 text-[10px] font-mono text-emerald-800 bg-emerald-50 rounded-lg flex items-center justify-between border border-emerald-100 animate-fadeIn">
                    <span className="flex items-center gap-1">📎 {uploadNotice}</span>
                    <button onClick={() => { setAttachedFile(null); setUploadNotice(null); }} className="text-stone-400 hover:text-stone-700">✕</button>
                  </div>
                )}

                {/* Input station bar */}
                <div className="border-t border-stone-150 pt-3 z-10">
                  <div className="flex gap-2">
                    
                    {/* Multimodal Quick Attachment simulation tray trigger */}
                    <div className="relative group/tray">
                      <button
                        type="button"
                        className="h-10 w-10 shrink-0 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-500 border border-stone-200 flex items-center justify-center transition-all cursor-pointer shadow-xs"
                        title="Simulate snapping photo / document upload"
                      >
                        <Upload className="w-4 h-4" />
                      </button>
                      
                      {/* Floating custom simulator list */}
                      <div className="absolute bottom-11 left-0 bg-white border border-stone-200 rounded-2xl p-2.5 shadow-md flex-col gap-1.5 w-[240px] hidden group-hover/tray:flex group-focus-within/tray:flex animate-fadeIn z-50">
                        <span className="text-[8px] font-mono font-bold tracking-wider text-stone-400 uppercase border-b border-stone-100 pb-1 mb-1 block">ATTACH SIMULATOR BIO-DATA</span>
                        <button
                          type="button"
                          onClick={() => triggerSimulationAttachment('symptom_rash')}
                          className="p-1 px-2 hover:bg-stone-50 rounded-lg text-[10px] text-stone-700 font-extrabold text-left flex items-center gap-2 cursor-pointer"
                        >
                          🩺 Skin irritation stress rash photo
                        </button>
                        <button
                          type="button"
                          onClick={() => triggerSimulationAttachment('blood_report')}
                          className="p-1 px-2 hover:bg-stone-50 rounded-lg text-[10px] text-stone-700 font-extrabold text-left flex items-center gap-2 cursor-pointer"
                        >
                          🧪 Lab Report panel (Blood chem)
                        </button>
                        <button
                          type="button"
                          onClick={() => triggerSimulationAttachment('passport_expire')}
                          className="p-1 px-2 hover:bg-stone-50 rounded-lg text-[10px] text-stone-700 font-extrabold text-left flex items-center gap-2 cursor-pointer"
                        >
                          🗺️ Scanned US Passport page
                        </button>
                        <button
                          type="button"
                          onClick={() => triggerSimulationAttachment('energy_audit')}
                          className="p-1 px-2 hover:bg-stone-50 rounded-lg text-[10px] text-stone-700 font-extrabold text-left flex items-center gap-2 cursor-pointer"
                        >
                          🌱 Home heating & electric audit report
                        </button>

                        <div className="border-t border-stone-100 pt-2 mt-1 relative">
                          <label className="text-[8px] font-mono font-extrabold text-stone-400 block mb-1">UPLOAD OWN FILE</label>
                          <input
                            type="file"
                            onChange={handleCustomFileChange}
                            className="text-[9px] w-full cursor-pointer text-stone-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[9px] file:font-bold file:bg-stone-100 file:text-stone-700"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Message input */}
                    <input
                      type="text"
                      required
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                      placeholder="Ask Dr. T anything, vent, or attach documents above..."
                      className="flex-1 bg-stone-50 border border-stone-200 rounded-xl p-2 px-3 text-xs outline-none focus:bg-white focus:border-rose-455 transition-all text-stone-800"
                    />

                    {/* Send button */}
                    <button
                      type="button"
                      onClick={() => handleSend()}
                      className="h-10 p-2.5 px-4 rounded-xl bg-stone-900 border border-stone-950 text-white font-black text-xs flex items-center justify-center gap-1.5 hover:bg-stone-850 active:scale-95 transition-all cursor-pointer shadow-xs select-none"
                    >
                      <Send className="w-3.5 h-3.5" /> <span className="hidden sm:inline">SEND</span>
                    </button>
                  </div>
                </div>

              </div>



            </div>

          </div>
        )}

        {/* Tab 2: LIFE GRAPH MEMORY CANVAS */}
        {activeTab === 'graph' && (
          <div className="animate-fadeIn">
            <LifeGraph 
              memoryNodes={memoryNodes} 
              onAddNode={handleAddNode} 
              onDeleteNode={handleDeleteNode} 
            />
          </div>
        )}

        {/* Tab 3: AGENT SWARM WORKSTATION */}
        {activeTab === 'swarm' && (
          <div className="animate-fadeIn">
            <AgentSwarm 
              agents={specialistAgents} 
              onTriggerSwarmCollaboration={handleTriggerSwarmCollaboration} 
            />
          </div>
        )}

        {/* Tab 4: ECOSYSTEM METRIC TRACKERS */}
        {activeTab === 'trackers' && (
          <div className="animate-fadeIn">
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
          </div>
        )}

        {/* Tab 5: PROGRESS DIAGNOSTICS & ANALYTICS */}
        {activeTab === 'dashboard' && (
          <div className="animate-fadeIn">
            <Dashboard
              medList={medicationList}
              taskList={tasks}
              carbonList={carbonHabits}
              streakData={streakData}
              voiceName={voiceName}
              setVoiceName={setVoiceName}
              language={language}
              setLanguage={setLanguage}
            />
          </div>
        )}

        {/* Tab 6: SETTINGS / CUSTOM APPEARANCE */}
        {activeTab === 'avatar' && (
          <div className="animate-fadeIn">
            <AvatarSettings
              vibe={vibe}
              setVibe={setVibe}
              voiceName={voiceName}
              setVoiceName={setVoiceName}
              voices={VOICES}
              appearance={avatarAppearance}
              setAppearance={setAvatarAppearance}
              tGender={tGender}
              setTGender={setTGender}
              tAge={tAge}
              setTAge={setTAge}
              vibeConfig={currentVibeConfig}
              vibes={VIBES}
            />
          </div>
        )}

      </main>

      {/* Invisible HTML5 Audio */}
      <audio className="hidden" ref={audioRef} />
    </div>
  );
}
