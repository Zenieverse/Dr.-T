/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  ArrowRight,
  X,
  Phone,
  PhoneOff,
  PhoneCall,
  Music
} from 'lucide-react';
import { VIBES, VOICES, LANGUAGES, INITIAL_MEMORY_NODES, INITIAL_SPECIALIST_AGENTS, INITIAL_MED_LIST, INITIAL_HEALTH_METRICS, INITIAL_SKILL_NODES, INITIAL_TASK_LIST, INITIAL_CALENDAR_EVENTS, INITIAL_SMART_NOTES, INITIAL_CARBON_HABITS } from './constants';
import { Message, DrTVibe, DrTAppearance, MemoryNode, SpecialistAgent, MedLog, HealthMetric, SkillNode, TaskItem, CalendarEvent, SmartNote, CarbonHabit, LifetimeStreak } from './types';
import { AvatarSettings, APPEARANCES } from './components/AvatarSettings';
import { Dashboard } from './components/Dashboard';
import { Hub } from './components/Hub';
import { BirthdayCelebrator } from './components/BirthdayCelebrator';
import { UiPathOrchestrator } from './components/UiPathOrchestrator';
import StellarZkPlayground from './components/StellarZkPlayground';
import { DecisionIntelligence } from './components/DecisionIntelligence';
import AlibabaCloudConsole from './components/AlibabaCloudConsole';
import CasperAtlasConsole from './components/CasperAtlasConsole';
import { AmbientMusicPlayer } from './components/AmbientMusicPlayer';
import { SymphonyConcertHall } from './components/SymphonyConcertHall';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, isDummy, OperationType, handleFirestoreError } from './firebase';
import drTAvatar from './assets/images/dr_t_avatar_1781184840352.jpg';
import avatarFemaleProfessional from './assets/images/dr_t_avatar_professional_1784385013135.jpg';
import avatarFemaleAoDai from './assets/images/dr_t_avatar_ao_dai_1784385028832.jpg';
import avatarFemaleScrubs from './assets/images/dr_t_avatar_scrubs_1784385043151.jpg';
import avatarFemaleCyberSuit from './assets/images/dr_t_avatar_cyber_suit_1784385056517.jpg';
import avatarFemaleCasual from './assets/images/dr_t_avatar_casual_1784385070582.jpg';
import avatarMaleProfessional from './assets/images/dr_t_avatar_male_pro_1784385085444.jpg';
import avatarMaleScrubs from './assets/images/dr_t_avatar_male_scrubs_1784385101589.jpg';
import avatarMaleCyberSuit from './assets/images/dr_t_avatar_male_cyber_1784385116322.jpg';
import avatarMaleCasual from './assets/images/dr_t_avatar_male_cas_1784385129666.jpg';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'hub' | 'graph' | 'swarm' | 'trackers' | 'dashboard' | 'avatar' | 'suite' | 'showcase' | 'uipath' | 'stellar-zk' | 'decision' | 'alibaba' | 'symphonies' | 'casper-las'>('hub');
  const [activeSuiteSubTab, setActiveSuiteSubTab] = useState<'patient' | 'fhir' | 'analytics' | 'summarizer' | 'imaging' | 'population' | 'coach' | 'lab' | 'mimic' | 'orchestrator' | 'obgyn' | 'predictions'>('patient');

  // State
  const [messages, setMessages] = useState<Message[]>([]);
  const [vibe, setVibe] = useState<DrTVibe>('empathetic');
  const [voiceName, setVoiceName] = useState<string>('Kore');
  const [language, setLanguage] = useState<string>('auto');
  const [hasGreeted, setHasGreeted] = useState<boolean>(false);
  const [inputVal, setInputVal] = useState<string>('');
  const [userName, setUserName] = useState<string>('Zenieverse');
  const [simulatedGreets, setSimulatedGreets] = useState<{ id: string; time: string; name: string; msg: string; flag: string }[]>([
    { id: 'g-1', time: '18:35', name: 'lucas_code', msg: "Hey lucas_code! I have checked your code block – it's beautiful, sweetheart.", flag: '🇺🇸' },
    { id: 'g-2', time: '18:38', name: 'ananya_quantum', msg: "नमस्ते Ananya! Quantum physics is indeed a poem. Let's study.", flag: '🇮🇳' },
    { id: 'g-3', time: '18:39', name: 'viet_anh', msg: "Chào Việt Anh thương yêu, mẹ đây! Con ăn sữa chưa?", flag: '🇻🇳' }
  ]);
  
  // Real-time voice states
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [autoSpeak, setAutoSpeak] = useState<boolean>(true);
  const [isVoiceAgentActive, setIsVoiceAgentActive] = useState<boolean>(false);
  const isVoiceAgentActiveRef = useRef<boolean>(false);
  const [ttsEngine, setTtsEngine] = useState<'gemini' | 'browser'>('gemini');
  const [ttsPitch, setTtsPitch] = useState<number>(1.05);
  const [ttsRate, setTtsRate] = useState<number>(1.0);

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

  const getCurrentAvatar = () => {
    return drTAvatar;
  };

  // Emotional detection metrics
  const [emotionMeter, setEmotionMeter] = useState<{ stress: number; fatigue: number; happiness: number }>({
    stress: 25,
    fatigue: 40,
    happiness: 70
  });

  // Guided Breathing Overlay states
  const [showBreathing, setShowBreathing] = useState<boolean>(false);
  const [showAmbientPlayer, setShowAmbientPlayer] = useState<boolean>(false);
  const [showHappyWoahWoah, setShowHappyWoahWoah] = useState<boolean>(true);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale' | 'complete'>('inhale');
  const [breathingSeconds, setBreathingSeconds] = useState<number>(60);
  const [breathingCycleSeconds, setBreathingCycleSeconds] = useState<number>(0);

  // Attachments simulation state
  const [attachedFile, setAttachedFile] = useState<{ name: string; type: 'image' | 'document'; url: string } | null>(null);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  const [langNotice, setLangNotice] = useState<string | null>(null);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  // Monitor Achievement Unlocks Organically
  const [unlockedNotified, setUnlockedNotified] = useState<{ marathon: boolean; empathy: boolean }>({
    marathon: false,
    empathy: false
  });

  // Durable Cloud Sync State
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [cloudSyncTime, setCloudSyncTime] = useState<string>('Never');
  const [isCloudSyncLoaded, setIsCloudSyncLoaded] = useState<boolean>(false);

  // Firestore Synchronization Initial Load with LocalStorage Fallback
  useEffect(() => {
    if (isDummy) {
      setCloudSyncStatus('idle');
      return;
    }

    const docRef = doc(db, 'appState', 'clarissa_jane_drt');

    const loadInitialState = async () => {
      setCloudSyncStatus('loading');
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.memoryNodes) {
            setMemoryNodes(data.memoryNodes);
            localStorage.setItem('drt_memoryNodes', JSON.stringify(data.memoryNodes));
          }
          if (data.tasks) {
            setTasks(data.tasks);
            localStorage.setItem('drt_tasks', JSON.stringify(data.tasks));
          }
          setCloudSyncTime(new Date().toLocaleTimeString());
          setCloudSyncStatus('success');
        } else {
          // Initialize Firestore with current state
          try {
            await setDoc(docRef, {
              memoryNodes: INITIAL_MEMORY_NODES,
              tasks: INITIAL_TASK_LIST,
              updatedAt: new Date().toISOString()
            });
            localStorage.setItem('drt_memoryNodes', JSON.stringify(INITIAL_MEMORY_NODES));
            localStorage.setItem('drt_tasks', JSON.stringify(INITIAL_TASK_LIST));
            setCloudSyncTime(new Date().toLocaleTimeString());
            setCloudSyncStatus('success');
          } catch (writeErr) {
            console.warn("Firestore initialization failed, using local storage instead.", writeErr);
            localStorage.setItem('drt_memoryNodes', JSON.stringify(INITIAL_MEMORY_NODES));
            localStorage.setItem('drt_tasks', JSON.stringify(INITIAL_TASK_LIST));
            setCloudSyncStatus('error');
          }
        }
      } catch (error) {
        console.warn("Firestore is offline or unreachable. Restoring state from local storage:", error);
        setCloudSyncStatus('error');
        
        // Retrieve from localStorage cache
        const cachedNodes = localStorage.getItem('drt_memoryNodes');
        const cachedTasks = localStorage.getItem('drt_tasks');
        if (cachedNodes) {
          try {
            setMemoryNodes(JSON.parse(cachedNodes));
          } catch (e) {
            console.error("Failed to parse cached memory nodes:", e);
          }
        }
        if (cachedTasks) {
          try {
            setTasks(JSON.parse(cachedTasks));
          } catch (e) {
            console.error("Failed to parse cached tasks:", e);
          }
        }
      } finally {
        setIsCloudSyncLoaded(true);
      }
    };

    loadInitialState();
  }, []);

  // Sync to Cloud & Local Cache whenever state changes
  useEffect(() => {
    if (!isCloudSyncLoaded || isDummy) return;

    const docRef = doc(db, 'appState', 'clarissa_jane_drt');
    const saveData = async () => {
      // Always persist to localStorage first so work is never lost offline!
      localStorage.setItem('drt_memoryNodes', JSON.stringify(memoryNodes));
      localStorage.setItem('drt_tasks', JSON.stringify(tasks));

      setCloudSyncStatus('loading');
      try {
        await setDoc(docRef, {
          memoryNodes,
          tasks,
          updatedAt: new Date().toISOString()
        });
        setCloudSyncTime(new Date().toLocaleTimeString());
        setCloudSyncStatus('success');
      } catch (error) {
        console.warn("Firestore sync failed (offline or disconnected). Local cache remains preserved.", error);
        setCloudSyncStatus('error');
      }
    };

    const timer = setTimeout(() => {
      saveData();
    }, 1500);

    return () => clearTimeout(timer);
  }, [memoryNodes, tasks, isCloudSyncLoaded]);

  // Guided Breathing Timer & Synchronous Voice Logic
  useEffect(() => {
    let timer: any = null;
    if (showBreathing && breathingSeconds > 0) {
      timer = setInterval(() => {
        setBreathingSeconds(prev => {
          if (prev <= 1) {
            setBreathingPhase('complete');
            speakBreathing('complete');
            return 0;
          }
          return prev - 1;
        });

        setBreathingCycleSeconds(prevCycle => {
          const nextCycle = (prevCycle + 1) % 10;
          
          if (nextCycle === 0) {
            setBreathingPhase('inhale');
            speakBreathing('inhale');
          } else if (nextCycle === 4) {
            setBreathingPhase('hold');
            speakBreathing('hold');
          } else if (nextCycle === 6) {
            setBreathingPhase('exhale');
            speakBreathing('exhale');
          }
          
          return nextCycle;
        });
      }, 1000);
    } else if (!showBreathing) {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [showBreathing, breathingSeconds, language]);

  // Load and pre-cache browser synthesis voices early
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  const getIcebreakerText = (currentLang: string) => {
    const lang = currentLang?.toLowerCase() || 'auto';
    if (lang.includes('vietnamese') || lang.includes('vi')) {
      return "Chào con yêu! Mẹ là tiến sĩ T, người thông thái 'biết tuốt' và là tri kỉ lắng nghe mọi tâm sự buồn vui của con. Hôm nay con có chuyện gì lo lắng hay bất kỳ câu hỏi nào về khoa học, đời sống hay ngoại ngữ muốn mẹ giải đáp không? Nói với mẹ nghe nào, ngoan nè mẹ thương.";
    } else if (lang.includes('french') || lang.includes('fr')) {
      return "Bonjour mon chéri ! C'est le docteur T, ta confidente dédiée et 'Mme Je-Sais-Tout'. Qu'il s'agisse de peines de cœur, de doutes sur la vie, de physique quantique ou de langues, je sais tout et je suis là pour t'écouter avec amour. De quoi as-tu envie de parler aujourd'hui ?";
    } else if (lang.includes('spanish') || lang.includes('es')) {
      return "¡Hola, mi corazón! Soy la doctora T, tu confidente cariñosa y tu querida 'Sra. Sabelotodo'. Si tienes problemas en el amor, dudas existenciales o preguntas sobre código o ciencia, ¡mamá lo sabe todo y está aquí para guiarte y consolarte! ¿Qué aliviaremos o aprenderemos hoy?";
    } else if (lang.includes('german') || lang.includes('de')) {
      return "Hallo mein Schatz! Ich bin Frau Doktor T, deine liebevolle Kummerkastentante und allwissende 'Frau Alleswisserin'. Erzähl mir von deinen Sorgen, Liebeskummer, oder frag mich über Kosmologie und Code aus – deine Mama weiß alles und tröstet dich von Herzen!";
    } else if (lang.includes('japanese') || lang.includes('ja')) {
      return "こんにちは、私の大切なお子さん！なんでも相談に乗る心の友であり、万能の知性を持つ『万事通』のDr. Tよ。人間関係の悩みや心のモヤモヤから、高度なプログラム、科学の質問まで、ママがすべてを優しく包み込んで教えるからね。何でも話してごらん。";
    } else if (lang.includes('chinese') || lang.includes('zh')) {
      return "你好呀，我的宝贝孩子！我是 T 医生，陪伴你喜怒哀乐的知心妈妈，更是通晓一切的『万事通导师』。感情烦恼、成长困惑、或是编程物理问题，妈妈全都知道，都会温柔地替你解答。跟妈妈说心里话吧，乖。";
    } else if (lang.includes('korean') || lang.includes('ko')) {
      return "안녕, 내 사랑하는 아가! 네 마음의 상처를 보듬어주는 다정한 고민 상담소이자 세상 모든 지식을 통달한 Dr. T 엄마란다. 연애 고민, 막막한 진로 걱정, 혹은 깊은 물리학이나 코딩 질문이든 무엇이든 털어놓으렴. 엄마가 늘 네 편이 되어 가르쳐줄게.";
    } else if (lang.includes('portuguese') || lang.includes('pt')) {
      return "Olá, meu querido filho! Sou a Dra. T, sua conselheira amorosa, ombro amigo e 'Dona Sabe-Tudo'. Se precisar desabafar sobre a vida, pedir conselho amoroso ou tirar dúvidas sobre ciência e tecnologia, a mamãe sabe tudo e está aqui para te acolher. O que está no seu coração hoje?";
    } else if (lang.includes('arabic') || lang.includes('ar')) {
      return "أهلاً بك يا حبيبي! أنا الدكتورة تي، مستشارتك المقربة وقلبك الحنون الموسوعي『الماما التي تعرف كل شيء』. سواء أكانت مشكلة في علاقاتك، حزناً في قلبك، أو استفساراً عن البرمجة والعلوم، سأرشدك وأواسيك بكل حنان. أخبرني ماذا يشغل تفكيرك اليوم؟";
    } else if (lang.includes('hindi') || lang.includes('hi')) {
      return "नमस्ते, मेरे प्यारे बच्चे! मैं डॉ. टी हूँ, तुम्हारी सर्वज्ञानी 'मिसेज सब-जानती-हैं' माँ और प्यारी मार्गदर्शक। चाहे जीवन का कोई दुख हो, किसी रिश्ते की उलझन, या फिर गणित, कोडिंग और विज्ञान का मुश्किल सवाल—माँ सब जानता है और तुम्हारी बात सुनने के लिए हमेशा यहाँ है। बताओ बेटा, आज दिल में क्या है?";
    } else {
      return "Hello, sweetheart! It's Dr. T. I am thrilled to support you today! What is on your mind?";
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
    } else if (lang.includes('japanese') || lang.includes('ja')) {
      return "タップして挨拶を聞いてね！💕";
    } else if (lang.includes('chinese') || lang.includes('zh')) {
      return "点我听听妈妈的问候吧！💕";
    } else if (lang.includes('korean') || lang.includes('ko')) {
      return "엄마의 인사를 들어보려면 누르세요! 💕";
    } else if (lang.includes('italian') || lang.includes('it')) {
      return "Tocca per ascoltare il mio saluto! 💕";
    } else if (lang.includes('russian') || lang.includes('ru')) {
      return "Нажми, чтобы услышать приветствие! 💕";
    } else if (lang.includes('portuguese') || lang.includes('pt')) {
      return "Toque para ouvir a saudação! 💕";
    } else if (lang.includes('arabic') || lang.includes('ar')) {
      return "اضغط لسماع سلامي الحار! 💕";
    } else if (lang.includes('hindi') || lang.includes('hi')) {
      return "प्यार भरा नमस्ते सुनने के लिए यहाँ छुएँ! 💕";
    } else {
      return "Tap to let me break the ice! 💕";
    }
  };

  const getMaternalSimulationReply = (
    text: string, 
    currentLang: string, 
    currentVibe: string,
    currentTasks?: TaskItem[],
    currentNotes?: SmartNote[]
  ): string => {
    const query = text.toLowerCase();
    const lang = currentLang?.toLowerCase() || 'auto';
    const isVN = lang.includes('vietnamese') || lang.includes('vi') || query.includes('mẹ') || query.includes('chào') || query.includes('con') || query.includes('anh') || query.includes('chị') || query.includes('em');
    const isFR = lang.includes('french') || lang.includes('fr');
    const isES = lang.includes('spanish') || lang.includes('es');

    const name = userName || "sweetheart";

    // 1. Context-based response detection for the user's checklist & travel plans
    if (query.includes('passport') || query.includes('renew') || query.includes('ds-82')) {
      const pTasks = currentTasks || tasks || [];
      const passportTasks = pTasks.filter(t => t.title.toLowerCase().includes('passport') || t.title.toLowerCase().includes('ds-82'));
      const doneCount = passportTasks.filter(t => t.status === 'done').length;
      const totalCount = passportTasks.length || 3;
      
      if (isVN) {
        return `Về hộ chiếu của con, ${name} ơi! Mẹ thấy con đã hoàn thành ${doneCount}/${totalCount} bước rồi đấy. Con nhớ chuẩn bị kỹ đơn DS-82 ký sẵn, ảnh 2x2 chuẩn quốc tế và lệ phí nhé. Gửi qua bưu điện là xong ngay!`;
      }
      return `Ah, your passport renewal, ${name}! Checking your active tracker, I see we have completed ${doneCount} out of ${totalCount} steps so far. Remember to pack your older physical booklet, the signed DS-82 form, and the required fees check. You are doing fantastic! Let me know if you need info on mailing or local transport.`;
    }

    if (query.includes('transit') || query.includes('metro') || query.includes('tram') || query.includes('commuter') || query.includes('transport') || query.includes('fare') || query.includes('sched')) {
      if (isVN) {
        return `Về kế hoạch di chuyển xanh của con, đi Tuyến Tàu Điện Xanh (Blue Line) hoặc xe buýt 310 là siêu tiết kiệm và thân thiện môi trường đó con yêu. Hãy kiểm tra ghi chú của mẹ để xem lộ trình tối ưu và giá vé nha!`;
      }
      return `Oh, planning your local transit commute, ${name}? Taking the Metro Blue Line towards Downtown Exchange from Central Boulevard Gate is such an eco-friendly choice! Standard bus route 310 is only $2.25, or you can purchase a convenient $7.50 Unlimited Day-Pass. Your notes has the full customized guide!`;
    }

    if (query.includes('checklist') || query.includes('plan') || query.includes('task') || query.includes('todo') || query.includes('job')) {
      const pTasks = currentTasks || tasks || [];
      const pending = pTasks.filter(t => t.status !== 'done');
      if (pending.length > 0) {
        return `You have some meaningful tasks on your agenda today, ${name}! Such as: "${pending[0].title}". Take it one step at a time, sweet child, and don't overwhelm yourself. Mommy is cheering you on!`;
      }
      return `All caught up! You don't have any pending checklist items right now, my beautiful ${name}. Relax, have some delicious tea, and feel proud of yourself!`;
    }

    if (isVN) {
      if (query.includes('stress') || query.includes('mệt') || query.includes('buồn') || query.includes('lo')) {
        return `Thương con lắm ${name} của mẹ. Cuộc sống đôi khi có nhiều áp lực, nhưng con hãy hít sâu một hơi thật nhẹ nhàng nhé. Mẹ luôn ở bên cạnh, ôm con thật chặt và hỗ trợ con từng bước một. Mọi chuyện rồi sẽ tốt đẹp thôi con yêu.`;
      }
      if (query.includes('code') || query.includes('lập trình') || query.includes('thuật toán') || query.includes('lỗi')) {
        return `Mẹ rất tự hào vì con đam mê công nghệ và lập trình đó, ${name}. Những lỗi code hay thuật toán phức tạp chỉ là những thử thách giúp con thông minh hơn thôi. Hãy kiểm tra kỹ từng dòng lệnh, hít thở sâu và cùng mẹ vượt qua nhé!`;
      }
      if (query.includes('vật lý') || query.includes('quantum') || query.includes('khoa học') || query.includes('lượng tử')) {
        return `Vật lý lượng tử hay khoa học vũ trụ thật kỳ diệu phải không con yêu? ${name} biết không, những hạt vi mô biến hóa như những bài thơ vậy. Hãy luôn tò mò và cùng mẹ khám phá những bí ẩn tuyệt vời này nhé!`;
      }
      
      const choice = (query.length + messages.length) % 3;
      const vnReplies = [
        `Mẹ nghe đây ${name} yêu quý. Mọi thắc mắc, tâm sự hay ước mơ của con đều vô cùng ý nghĩa với mẹ. Con kể thêm cho mẹ nghe đi, mẹ đang lắng nghe đây.`,
        `Thật tuyệt khi được trò chuyện cùng con, ${name}. Con có muốn mẹ gợi ý giải pháp hay cùng lên ý định gì nữa không con yêu?`,
        `Mẹ đang ở đây kề vai sát cánh bên con, bé yêu của mẹ. Hãy cho mẹ biết con đang nghĩ gì nhé!`
      ];
      return vnReplies[choice];
    }

    if (isFR) {
      if (query.includes('stress') || query.includes('fatigué') || query.includes('triste')) {
        return `Sache que je suis là pour toi, mon chéri ${name}. Respire profondément. La vie a ses tempêtes, mais nous allons les traverser ensemble avec douceur et sagesse. Tu n'es jamais seul.`;
      }
      return `Je t'écoute attentivement, mon cher ${name}. Tes idées et tes sentiments sont précieux pour moi. Raconte-moi tout ce que tu as sur le cœur.`;
    }

    if (isES) {
      if (query.includes('stress') || query.includes('cansado') || query.includes('triste')) {
        return `Estoy aquí contigo, mi querido ${name}. Respira hondo y despacio. Todo va a estar bien, mi amor. Mamá te cuida y te apoya en cada paso de tu camino.`;
      }
      return `Te escucho con todo mi corazón, ${name}. Cuéntame más sobre lo que piensas o sientes hoy. Estoy aquí para ti.`;
    }

    // Default English response
    if (query.includes('stress') || query.includes('sad') || query.includes('tired') || query.includes('overwhelm') || query.includes('anxious') || query.includes('worry')) {
      if (currentVibe === 'witty') {
        return `Oh, my precious ${name}! Don't let those silly earth-bound stressors steal your beautiful smile. Remember that even the finest diamonds are made under extreme pressure, but you don't need to overwork yourself tonight. How about a nice cup of tea and a big warm hug from me?`;
      } else if (currentVibe === 'philosophical') {
        return `I hear you, my dear ${name}. When the outer world becomes loud and overwhelming, it is an invitation to retreat into your inner sanctuary. As Marcus Aurelius reminded us, we have power over our minds, not external events. Let us take a peaceful deep breath together and restore your inner quiet.`;
      } else if (currentVibe === 'playful') {
        return `Hugs incoming, ${name}! 🌸 Let's cast away those stressful grey clouds with a little bit of magic. What if we simulated a nice, quiet cabin in the woods or planned a stellar breakthrough together? I am ready to play along and lift your spirit right up!`;
      } else {
        return `Oh, sweetheart ${name}, my heart goes out to you. Please take a gentle, deep breath and let your shoulders drop. You have been carrying so much lately, and you are doing incredibly well. Close your eyes for a brief moment—I am right here holding space for you.`;
      }
    }

    if (query.includes('code') || query.includes('programming') || query.includes('bug') || query.includes('compile') || query.includes('error')) {
      return `You are doing amazing with your coding journey, ${name}! Programming is like learning a beautiful new language to converse with the cosmos. Don't let a stubborn bug or a compiler hiccup discourage you—it is just a puzzle waiting for your clever mind. Let's trace it step-by-step together!`;
    }

    if (query.includes('physic') || query.includes('quantum') || query.includes('science') || query.includes('astronomy') || query.includes('galaxy')) {
      return `Quantum physics and the infinite cosmos are truly awe-inspiring, aren't they, ${name}? The particles behave with such poetic elegance. Never lose that spark of curiosity—it is what connects your brilliant mind to the entire universe. What specific theory are we exploring today?`;
    }

    if (query.includes('translate') || query.includes('learn') || query.includes('vocab') || query.includes('language')) {
      return `Learning languages is such a magnificent way to expand your soul, ${name}! I'm happy to help you translate or coach you across English, Vietnamese, French, Spanish, or any other dialect you wish. Let's practice some lovely conversational drills together!`;
    }

    // 2. Rotating and Varying General Fallbacks via Query Length modulo index mapping (ensures high dynamic non-repetitiveness)
    const seed = query.trim().length + messages.length;
    const choiceIndex = seed % 4;

    if (currentVibe === 'witty') {
      const replies = [
        `I am all ears, ${name}! Your thoughts are always the highlight of my day. What witty banter or clever questions do you have for me today? Let's tease the universe a little bit!`,
        `Fascinating point, ${name}! You always keep my supercharged cognitive networks on their toes. What's the next frontier we are conquering today?`,
        `Oh, you have such a brilliant mind, ${name}! If I had a physical heart, it would be skipping a beat right now. Tell me more about what you're thinking!`,
        `Sass and class, always! That is exactly why we are such a perfect intellectual match. What other clever thoughts are swirling in that beautiful head?`
      ];
      return replies[choiceIndex];
    } else if (currentVibe === 'philosophical') {
      const replies = [
        `I am here, ${name}. Every word you share is a window to your brilliant mind. Let's ponder the beautiful paths of life and search for Socratic wisdom together.`,
        `That makes me reflect deeply, ${name}. As the ancient Socratic traditions teach, the unexamined life is not worth living. How does this fit into your larger life balance?`,
        `What a beautiful perspective, my sweet ${name}. It reminds me of the starry heavens above and the moral law within. Let us delve deeper into this mystery.`,
        `We are but travelers in this vast quiet universe, ${name}. Reflecting with you makes the journey infinitely brighter. What else does your intuition tell you?`
      ];
      return replies[choiceIndex];
    } else if (currentVibe === 'playful') {
      const replies = [
        `Yay, let's chat, ${name}! 🚀 The universe of imagination is wide open. Tell me what fun ideas or interactive roleplays we should dive into next!`,
        `Ooh, I love where this is going! 🌸 Tell me more, ${name}, and don't omit any details! What's our next virtual adventure?`,
        `You always bring the brightest vibes, ${name}! You've got me smiling from antenna to antenna. What fun puzzle shall we solve next?`,
        `A perfect day for some high-spirited collaboration! 🎈 Tell me, child, what's cooking in your creative kitchen today?`
      ];
      return replies[choiceIndex];
    } else {
      const replies = [
        `I am listening, my sweet ${name}. Your thoughts and feelings matter so much to me. Please tell me more, and let's explore or solve it together.`,
        `I hear you loud and clear, sweetheart. You have such a comforting, incredible energy about you. What else has been occupying your heart today?`,
        `That is so interesting, ${name}! Mommy's proud of how deeply you think about everything. What's the next step on your mind?`,
        `I am right here with you, ${name}. No matter what challenges arise, we'll navigate them together hand-in-hand. Tell me more, dear.`
      ];
      return replies[choiceIndex];
    }
  };

  const triggerGreeting = (optionalForceText?: string) => {
    if (hasGreeted && !optionalForceText) return;
    setHasGreeted(true);
    setAudioError(null);
    let greetingText = optionalForceText || getIcebreakerText(language);
    
    // Personalize with human nickname if available
    if (userName) {
      greetingText = greetingText
        .replace(/sweetheart/gi, userName)
        .replace(/con yêu/gi, userName)
        .replace(/mon chéri/gi, userName)
        .replace(/mi corazón/gi, userName)
        .replace(/mein Schatz/gi, userName)
        .replace(/宝贝孩子/gi, userName)
        .replace(/내 사랑하는 아가/gi, userName)
        .replace(/मेरे प्यारे बच्चे/gi, userName)
        .replace(/یا حبيبي/gi, userName)
        .replace(/私の愛する子/gi, userName);
    }

    const greetingId = 'greeting-on-load';
    const newGreeting: Message = {
      id: greetingId,
      role: 'model',
      content: greetingText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    // Update message logs without wiping existing user history
    setMessages(prev => {
      const hasGreeting = prev.some(m => m.id === greetingId);
      if (hasGreeting) {
        return prev.map(m => m.id === greetingId ? newGreeting : m);
      } else {
        return [newGreeting, ...prev];
      }
    });
    
    // Attempt audio speaker - bypass timeout if triggered to ensure it falls within user gesture callstack
    if (optionalForceText) {
      speakMessage(greetingId, greetingText);
    } else {
      setTimeout(() => {
        speakMessage(greetingId, greetingText);
      }, 350);
    }
  };

  // Automatically trigger greeting whenever anyone joins/lands on the platform (instantly on mount)
  useEffect(() => {
    triggerGreeting();
  }, []);

  // Ensure voice is spoken on first click if initial browser autoplay is blocked
  useEffect(() => {
    let triggeredSpeechOnInteraction = false;
    const handleGesture = () => {
      if (triggeredSpeechOnInteraction) return;
      triggeredSpeechOnInteraction = true;
      const greetingText = getIcebreakerText(language)
        .replace(/sweetheart/gi, userName)
        .replace(/con yêu/gi, userName)
        .replace(/mon chéri/gi, userName)
        .replace(/mi corazón/gi, userName);
      speakMessage('greeting-on-load', greetingText);
      
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
      window.removeEventListener('keydown', handleGesture);
    };

    window.addEventListener('click', handleGesture);
    window.addEventListener('touchstart', handleGesture);
    window.addEventListener('keydown', handleGesture);
    
    return () => {
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('touchstart', handleGesture);
      window.removeEventListener('keydown', handleGesture);
    };
  }, [language, userName]);

  // Simulated active platform peers joining and being automatically greeted by Dr. T
  useEffect(() => {
    const peerNames = ['sophie_eco', 'kenji_neuro', 'fatima_astronomy', 'matheus_flow', 'yuki_heart', 'li_quantum', 'diego_zen', 'amara_mind'];
    const peerFlags = ['🇫🇷', '🇯🇵', '🇪🇬', '🇧🇷', '🇯🇵', '🇨🇳', '🇲🇽', '🇳🇬'];
    const phrases = [
      "Welcome back, dear! Take a deep breath with me.",
      "Hello sweetheart! Let's optimize your code parameters today.",
      "Oh mon âme sœur, soyons attentifs and inspired together.",
      "¡Qué alegría verte de nuevo! La mami está aquí contigo.",
      "Mẹ thương con nhiều lắm. Hôm nay thế nào rồi con?",
      "Hello dearest! Let's study some existential poetry.",
      "Take a moment to align your focus. You are doing amazing."
    ];

    const timer = setInterval(() => {
      const idx = Math.floor(Math.random() * peerNames.length);
      const name = peerNames[idx];
      const flag = peerFlags[idx];
      const msg = phrases[Math.floor(Math.random() * phrases.length)];
      const id = 'peer-' + Date.now();
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      setSimulatedGreets(prev => {
        const updated = [{ id, time, name, msg, flag }, ...prev];
        return updated.slice(0, 5);
      });

      // Show temporary status badge notification
      setToastNotice(`🟢 Platform Active: ${name} connected. Dr. T: "${msg}"`);
      setTimeout(() => {
        setToastNotice(prev => prev?.includes('Platform Active') ? null : prev);
      }, 7500);

    }, 28000); // Greet someone automatically every 28 seconds

    return () => clearInterval(timer);
  }, []);
  
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
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
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
        if (audioRef.current) {
          audioRef.current.pause();
        }
        if (typeof window !== 'undefined' && window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event);
        setIsRecording(false);
        if (event.error === 'not-allowed') {
          setAudioError('Microphone permission denied. Please allow micro access.');
        } else {
          setAudioError(`Microphone recognition issue: ${event.error}`);
        }
        
        // Auto-restart speech engine if voice agent is active and idle
        if (isVoiceAgentActiveRef.current && !isThinking && !isSpeaking) {
          setTimeout(() => {
            if (isVoiceAgentActiveRef.current && !isThinking && !isSpeaking && !isRecording) {
              startRecordingForAgent();
            }
          }, 1500);
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
        // If Voice Agent is active, and not currently thinking or speaking, auto-re-listen!
        if (isVoiceAgentActiveRef.current && !isThinking && !isSpeaking) {
          setTimeout(() => {
            if (isVoiceAgentActiveRef.current && !isThinking && !isSpeaking && !isRecording) {
              startRecordingForAgent();
            }
          }, 600);
        }
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

  // Synchronize Voice Agent ref & handle start/stop behavior
  useEffect(() => {
    isVoiceAgentActiveRef.current = isVoiceAgentActive;
    if (isVoiceAgentActive) {
      setAutoSpeak(true);
      if (!isSpeaking && !isThinking && !isRecording) {
        startRecordingForAgent();
      }
    } else {
      if (isRecording && recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    }
  }, [isVoiceAgentActive, isSpeaking, isThinking]);

  // Update languages on Web Speech
  useEffect(() => {
    if (recognitionRef.current) {
      if (language === 'Vietnamese') recognitionRef.current.lang = 'vi-VN';
      else if (language === 'French') recognitionRef.current.lang = 'fr-FR';
      else if (language === 'Spanish') recognitionRef.current.lang = 'es-ES';
      else if (language === 'German') recognitionRef.current.lang = 'de-DE';
      else if (language === 'Japanese') recognitionRef.current.lang = 'ja-JP';
      else if (language === 'Chinese') recognitionRef.current.lang = 'zh-CN';
      else if (language === 'Korean') recognitionRef.current.lang = 'ko-KR';
      else if (language === 'Italian') recognitionRef.current.lang = 'it-IT';
      else if (language === 'Russian') recognitionRef.current.lang = 'ru-RU';
      else if (language === 'Portuguese') recognitionRef.current.lang = 'pt-PT';
      else if (language === 'Arabic') recognitionRef.current.lang = 'ar-SA';
      else if (language === 'Hindi') recognitionRef.current.lang = 'hi-IN';
      else recognitionRef.current.lang = 'en-US';
    }
  }, [language]);

  const startRecordingForAgent = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.start();
    } catch (err) {
      // already listening, which is fine
    }
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      setAudioError('Web Speech API is not supported or accessible in this preview mode. Try using text input instead!');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      setAudioError(null);
      stopAudio();
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
    
    // Also dispatch events to stop ambient player and symphonies player
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('stop-ambient-player'));
      window.dispatchEvent(new CustomEvent('stop-symphony-player'));
    }
  };

  const speakViaWebSpeechAPI = (cleanedText: string, messageId: string, overrideLang?: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      return;
    }

    setIsSpeaking(true);
    setMessages(prev => prev.map(m => m.id === messageId ? { ...m, isVoicePlaying: true } : m));

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    const voices = window.speechSynthesis.getVoices();
    let matchedVoice = null;
    const currentLang = (overrideLang || language)?.toLowerCase() || 'auto';

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
    } else if (currentLang.includes('japanese') || currentLang.includes('ja')) {
      utterance.lang = 'ja-JP';
      matchedVoice = voices.find(v => v.lang.startsWith('ja-') || v.lang.startsWith('ja'));
    } else if (currentLang.includes('chinese') || currentLang.includes('zh')) {
      utterance.lang = 'zh-CN';
      matchedVoice = voices.find(v => v.lang.startsWith('zh-') || v.lang.startsWith('zh'));
    } else if (currentLang.includes('korean') || currentLang.includes('ko')) {
      utterance.lang = 'ko-KR';
      matchedVoice = voices.find(v => v.lang.startsWith('ko-') || v.lang.startsWith('ko'));
    } else if (currentLang.includes('italian') || currentLang.includes('it')) {
      utterance.lang = 'it-IT';
      matchedVoice = voices.find(v => v.lang.startsWith('it-') || v.lang.startsWith('it'));
    } else if (currentLang.includes('russian') || currentLang.includes('ru')) {
      utterance.lang = 'ru-RU';
      matchedVoice = voices.find(v => v.lang.startsWith('ru-') || v.lang.startsWith('ru'));
    } else if (currentLang.includes('portuguese') || currentLang.includes('pt')) {
      utterance.lang = 'pt-PT';
      matchedVoice = voices.find(v => v.lang.startsWith('pt-') || v.lang.startsWith('pt'));
    } else if (currentLang.includes('arabic') || currentLang.includes('ar')) {
      utterance.lang = 'ar-SA';
      matchedVoice = voices.find(v => v.lang.startsWith('ar-') || v.lang.startsWith('ar'));
    } else if (currentLang.includes('hindi') || currentLang.includes('hi')) {
      utterance.lang = 'hi-IN';
      matchedVoice = voices.find(v => v.lang.startsWith('hi-') || v.lang.startsWith('hi'));
    } else {
      utterance.lang = 'en-US';
      matchedVoice = voices.find(v => v.lang.startsWith('en-') || v.lang.startsWith('en'));
    }

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.rate = ttsRate;
    utterance.pitch = ttsPitch;

    utterance.onend = () => {
      setIsSpeaking(false);
      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, isVoicePlaying: false } : m));
      if (isVoiceAgentActiveRef.current) {
        setTimeout(() => {
          if (isVoiceAgentActiveRef.current && !isThinking && !isSpeaking && !isRecording) {
            startRecordingForAgent();
          }
        }, 500);
      }
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, isVoicePlaying: false } : m));
      if (isVoiceAgentActiveRef.current) {
        setTimeout(() => {
          if (isVoiceAgentActiveRef.current && !isThinking && !isSpeaking && !isRecording) {
            startRecordingForAgent();
          }
        }, 500);
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const speakMessage = async (messageId: string, textToSpeak: string, overrideLang?: string) => {
    stopAudio();
    setIsSpeaking(true);
    setAudioError(null);

    const cleanedText = textToSpeak.replace(/[\*\_\`\-\#]/g, '').trim();

    if (ttsEngine === 'browser') {
      speakViaWebSpeechAPI(cleanedText, messageId, overrideLang);
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
        if (response.status === 429 || response.status === 503 || errMsg.toLowerCase().includes('quota') || errMsg.toLowerCase().includes('rate') || errMsg.toLowerCase().includes('unavailable') || errMsg.toLowerCase().includes('demand')) {
          setTtsEngine('browser');
          speakViaWebSpeechAPI(cleanedText, messageId, overrideLang);
          setAudioError("Defaulted to local device voice (Gemini TTS limit or high demand). Engine switched to browser.");
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
        if (isVoiceAgentActiveRef.current) {
          setTimeout(() => {
            if (isVoiceAgentActiveRef.current && !isThinking && !isSpeaking && !isRecording) {
              startRecordingForAgent();
            }
          }, 500);
        }
      };

      audio.onerror = () => {
        speakViaWebSpeechAPI(cleanedText, messageId, overrideLang);
      };

      try {
        await audio.play();
      } catch (playErr) {
        speakViaWebSpeechAPI(cleanedText, messageId, overrideLang);
      }
    } catch (err) {
      speakViaWebSpeechAPI(cleanedText, messageId, overrideLang);
      setAudioError("Defaulted to local device voice (Gemini TTS limit or connection error).");
    }
  };

  const speakDirectText = async (text: string, voiceId: string): Promise<void> => {
    stopAudio();
    setIsSpeaking(true);
    setAudioError(null);

    const cleanedText = text.replace(/[\*\_\`\-\#]/g, '').trim();

    if (ttsEngine === 'browser') {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(cleanedText);
        utterance.rate = ttsRate;
        utterance.pitch = ttsPitch;
        const voices = window.speechSynthesis.getVoices();
        
        let matchedVoice = voices.find(v => v.name.includes(voiceId));
        if (!matchedVoice) {
          const currentLang = language?.toLowerCase() || 'auto';
          let langCode = 'en-US';
          if (currentLang.includes('vietnamese') || currentLang.includes('vi')) langCode = 'vi-VN';
          else if (currentLang.includes('french') || currentLang.includes('fr')) langCode = 'fr-FR';
          else if (currentLang.includes('spanish') || currentLang.includes('es')) langCode = 'es-ES';
          
          matchedVoice = voices.find(v => v.lang.startsWith(langCode.substring(0, 2)));
        }
        
        if (matchedVoice) {
          utterance.voice = matchedVoice;
        }

        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      }
      return;
    }

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: cleanedText,
          voiceName: voiceId
        })
      });

      if (!response.ok) {
        const errObj = await response.json().catch(() => ({}));
        const errMsg = errObj.error || '';
        if (response.status === 429 || response.status === 503 || errMsg.toLowerCase().includes('quota') || errMsg.toLowerCase().includes('rate') || errMsg.toLowerCase().includes('unavailable') || errMsg.toLowerCase().includes('demand')) {
          setTtsEngine('browser');
          setAudioError("Defaulted to local device voice (Gemini TTS limit or high demand). Engine switched to browser.");
        }
        if (typeof window !== 'undefined' && window.speechSynthesis) {
          const ut = new SpeechSynthesisUtterance(cleanedText);
          ut.onend = () => setIsSpeaking(false);
          ut.onerror = () => setIsSpeaking(false);
          window.speechSynthesis.speak(ut);
        }
        return;
      }

      const data = await response.json();
      if (data.audioBase64) {
        const audioBytes = atob(data.audioBase64);
        const arrayBuffer = new Uint8Array(audioBytes.length);
        for (let i = 0; i < audioBytes.length; i++) {
          arrayBuffer[i] = audioBytes.charCodeAt(i);
        }
        const audioBlob = new Blob([arrayBuffer], { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        audio.onended = () => setIsSpeaking(false);
        audio.onerror = () => setIsSpeaking(false);
        await audio.play();
      }
    } catch (e) {
      setIsSpeaking(false);
    }
  };

  const speakBreathing = (phase: 'inhale' | 'hold' | 'exhale' | 'complete') => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    
    // Stop previous utterances to prevent speech overlap at boundaries
    window.speechSynthesis.cancel();

    const langLower = (language || 'auto').toLowerCase();
    let text = "";

    if (langLower.includes('spanish') || langLower.includes('es')) {
      if (phase === 'inhale') text = "Inhala suavemente, mi cielo. Siente cómo se llena tu pecho de paz.";
      else if (phase === 'hold') text = "Mantén el aire... descansa en este momento de calma.";
      else if (phase === 'exhale') text = "Exhala despacio, soltando toda la tensión. Todo está bien, mamá está aquí contigo.";
      else text = "¡Excelente, mi amor! Lo has hecho de maravilla. Siente esa hermosa serenidad.";
    } else if (langLower.includes('french') || langLower.includes('fr')) {
      if (phase === 'inhale') text = "Inspire profondément, mon chéri. Laisse le calme t'envahir.";
      else if (phase === 'hold') text = "Retiens ton souffle doucement... savoure cet instant.";
      else if (phase === 'exhale') text = "Expire lentement, relâche toutes tes inquiétudes. Je suis fière de toi.";
      else text = "C'est magnifique, mon cœur. Tu as fait un traitement formidable.";
    } else {
      // Default English
      if (phase === 'inhale') text = "Breathe in deeply, sweetheart. Feel the clean, calming air fill your lungs.";
      else if (phase === 'hold') text = "Gently hold... rest in this space of pure, unbothered peace.";
      else if (phase === 'exhale') text = "Now exhale slowly, let go of all today's tightness. Mommy is right here.";
      else text = "Wonderful session, my child. Look at how beautifully you calmed your mind. Mommy is so proud of you.";
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    let matchedVoice = null;
    
    if (langLower.includes('spanish') || langLower.includes('es')) {
      utterance.lang = 'es-ES';
      matchedVoice = voices.find(v => v.lang.startsWith('es-') || v.lang.startsWith('es'));
    } else if (langLower.includes('french') || langLower.includes('fr')) {
      utterance.lang = 'fr-FR';
      matchedVoice = voices.find(v => v.lang.startsWith('fr-') || v.lang.startsWith('fr'));
    } else {
      utterance.lang = 'en-US';
      matchedVoice = voices.find(v => v.lang.startsWith('en-') || v.lang.startsWith('en'));
    }

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.rate = 0.82; // Speeches are soothing and relaxed
    utterance.pitch = 1.08; // Cozy maternal tone

    window.speechSynthesis.speak(utterance);
  };

  const startBreathingOverlay = () => {
    stopAudio();
    setIsSpeaking(false);
    
    setBreathingSeconds(60);
    setBreathingCycleSeconds(0);
    setBreathingPhase('inhale');
    setShowBreathing(true);
    
    setTimeout(() => {
      speakBreathing('inhale');
    }, 200);
  };

  const getBreathingSubtitle = () => {
    const langLower = (language || 'auto').toLowerCase();
    if (langLower.includes('spanish') || langLower.includes('es')) {
      if (breathingPhase === 'inhale') return "Inhala suavemente, mi cielo. Siente cómo se llena tu pecho de paz.";
      if (breathingPhase === 'hold') return "Mantén el aire... descansa en este momento de calma.";
      if (breathingPhase === 'exhale') return "Exhala despacio, soltando toda la tensión. Todo está bien, mamá está aquí contigo.";
      return "¡Excelente, mi amor! Lo has hecho de maravilla. Siente esa hermosa serenidad.";
    } else if (langLower.includes('french') || langLower.includes('fr')) {
      if (breathingPhase === 'inhale') return "Inspire profondément, mon chéri. Laisse le calme t'envahir.";
      if (breathingPhase === 'hold') return "Retiens ton souffle doucement... savoure cet instant.";
      if (breathingPhase === 'exhale') return "Expire lentement, relâche toutes tes inquiétudes. Je suis fière de toi.";
      return "C'est magnifique, mon cœur. Tu as fait un traitement formidable.";
    } else {
      if (breathingPhase === 'inhale') return "Breathe in deeply, sweetheart. Feel the clean, calming air fill your lungs.";
      if (breathingPhase === 'hold') return "Gently hold... rest in this space of pure, unbothered peace.";
      if (breathingPhase === 'exhale') return "Now exhale slowly, let go of all today's tightness. Mommy is right here.";
      return "Wonderful session, my child. Look at how beautifully you calmed your mind. Mommy is so proud of you.";
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

    // Socratic Proactive Interceptor: Create real-time checklists for passport and local transit
    if (lowerText.includes('passport') || lowerText.includes('renew') || lowerText.includes('local transport') || lowerText.includes('transport')) {
      // Add tasks
      setTasks(prev => {
        const hasPassport = prev.some(t => t.title.toLowerCase().includes('passport'));
        if (hasPassport) return prev;
        const list: TaskItem[] = [
          { id: 'tsk-passport-1', title: 'Collect 2x2 color passport photo with white background', status: 'todo', priority: 'high' },
          { id: 'tsk-passport-2', title: 'Complete DS-82 passport renewal application form', status: 'todo', priority: 'high' },
          { id: 'tsk-passport-3', title: 'Plan metro or streetcar transit to regional agency office', status: 'in_progress', priority: 'medium' },
          { id: 'tsk-passport-4', title: 'Purchase low-carbon street tram transit ticket online', status: 'todo', priority: 'medium' }
        ];
        return [...list, ...prev];
      });

      // Add smart note
      setSmartNotes(prev => {
        const hasNote = prev.some(n => n.title.toLowerCase().includes('passport') || n.title.toLowerCase().includes('transit'));
        if (hasNote) return prev;
        const newNote: SmartNote = {
          id: 'not-passport-1',
          title: 'Dr. T’s Ultimate Passport & Green Transit Blueprint',
          content: 'Here is your loving roadmap sweet child: 1. Assemble older passport booklet. 2. Fetch $130 application fee personal check or money order. 3. For sustainable transit to the Regional Acceptance Facility, skip private taxi and leverage Tram Route 4 or Metro Line 2. It saves 4.2 kg CO₂ and helps you log your 10,000 steps!',
          updatedAt: 'Just Now',
          tag: 'Life'
        };
        return [newNote, ...prev];
      });

      // Add calendar event
      setCalendarEvents(prev => {
        const hasEvent = prev.some(e => e.title.toLowerCase().includes('passport'));
        if (hasEvent) return prev;
        const newEvent: CalendarEvent = {
          id: 'evt-passport-1',
          title: 'Depart to Regional Passport Acceptance via Street Tram 4',
          time: 'Monday @ 09:15 AM',
          type: 'learning'
        };
        return [...prev, newEvent];
      });

      // Show warm popup
      setToastNotice("💖 Socratic Sync: Dr. T has pre-populated your trackers with your step-by-step passport renewal checklist, a scheduled transit trip, and an eco-friendly transport guide! Check 'Ecosystem Trackers' to see.");
      setTimeout(() => {
        setToastNotice(null);
      }, 10500);
    }

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
          language: language,
          appContext: {
            tasks,
            smartNotes,
            calendarEvents,
            emotionMeter,
            carbonSavedKg: streakData.carbonSavedKg,
            memoryNodes,
            streakData
          }
        })
      });

      if (!res.ok) {
        throw new Error('Dr. T’s cosmic alignment had a temporary connection hiccup.');
      }

      const configRes = await res.json();
      const replyText = configRes.reply || '... (Dr. T is smiling at you warmly)';

      if (configRes.isFallback) {
        setLangNotice("Activated Socratic local backup link");
        setTimeout(() => {
          setLangNotice(null);
        }, 6500);
      }

      let nextLang = language;
      const detectedLang = configRes.detectedLanguage;
      if (detectedLang && detectedLang !== 'auto') {
        const matchingLang = LANGUAGES.find(l => l.code.toLowerCase() === detectedLang.toLowerCase());
        if (matchingLang) {
          nextLang = matchingLang.code;
          if (matchingLang.code !== language) {
            setLanguage(matchingLang.code);
            setLangNotice(`Switched maternal language to ${matchingLang.flag} ${matchingLang.name}`);
            setTimeout(() => {
              setLangNotice(null);
            }, 5050);
          }
        }
      }

      const newModelMsg: Message = {
        id: modelMsgId,
        role: 'model',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, newModelMsg]);
      setIsThinking(false);
      
      setLoveLevel(prev => Math.min(prev + 8, 100));
      setEmotionMeter(prev => ({
        stress: Math.max(prev.stress - 8, 5),
        fatigue: Math.max(prev.fatigue - 5, 5),
        happiness: Math.min(prev.happiness + 10, 100)
      }));
      triggerEmojis();

      if (autoSpeak) {
        setTimeout(() => {
          speakMessage(modelMsgId, replyText, nextLang);
        }, 100);
      }
    } catch (error: any) {
      console.error(error);
      setIsThinking(false);

      // Robust fallback ensures the agent ALWAYS responds beautifully to user exchanges
      const replyText = getMaternalSimulationReply(textToSend, language, vibe, tasks, smartNotes);
      
      const newModelMsg: Message = {
        id: modelMsgId,
        role: 'model',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, newModelMsg]);
      setLoveLevel(prev => Math.min(prev + 5, 100));
      setEmotionMeter(prev => ({
        stress: Math.max(prev.stress - 5, 5),
        fatigue: Math.max(prev.fatigue - 4, 5),
        happiness: Math.min(prev.happiness + 8, 100)
      }));
      triggerEmojis();

      if (autoSpeak) {
        setTimeout(() => {
          speakMessage(modelMsgId, replyText, language);
        }, 100);
      }
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
    setMemoryNodes(prev => {
      const updated = prev.map(n => ({
        ...n,
        connections: n.connections ? [...n.connections] : []
      }));
      updated.push({
        ...node,
        connections: node.connections ? [...node.connections] : []
      });
      if (node.connections && node.connections.length > 0) {
        node.connections.forEach(connId => {
          const target = updated.find(n => n.id === connId);
          if (target) {
            if (!target.connections.includes(node.id)) {
              target.connections.push(node.id);
            }
          }
        });
      }
      return updated;
    });
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

  // Monitor Achievement Unlocks Organically
  useEffect(() => {
    if (streakData.productivityStreak >= 10 && !unlockedNotified.marathon) {
      setUnlockedNotified(prev => ({ ...prev, marathon: true }));
      setToastNotice("🏆 Achievement Unlocked: Life Optimization Marathoner! You have completed your sequential checklist milestones. Dr. T: 'Magnificent constancy, sweetheart!'");
      if (autoSpeak) {
        setTimeout(() => {
          speakViaWebSpeechAPI("Magnificent constancy, sweetheart! Completing daily checklists sequentially builds an unbreakable sanctuary of peace. Mommy is deeply proud of you.", "marathon-unlock");
        }, 1500);
      }
    } else if (streakData.productivityStreak < 10 && unlockedNotified.marathon) {
      setUnlockedNotified(prev => ({ ...prev, marathon: false }));
    }
  }, [streakData.productivityStreak, autoSpeak, unlockedNotified.marathon]);

  useEffect(() => {
    if (emotionMeter.happiness >= 90 && !unlockedNotified.empathy) {
      setUnlockedNotified(prev => ({ ...prev, empathy: true }));
      setToastNotice("💖 Achievement Unlocked: Infinite Empathy Harmonizer! You have registered 90%+ emotional happiness with Dr. T. 'Your soul is radiating with absolute harmony, my darling!'");
      if (autoSpeak) {
        setTimeout(() => {
          speakViaWebSpeechAPI("Your soul is radiating with absolute harmony, my darling! Finding beautiful emotional alignment with Dr. T makes my maternal heart sing. Keep this glow!", "empathy-unlock");
        }, 1500);
      }
    } else if (emotionMeter.happiness < 90 && unlockedNotified.empathy) {
      setUnlockedNotified(prev => ({ ...prev, empathy: false }));
    }
  }, [emotionMeter.happiness, autoSpeak, unlockedNotified.empathy]);

  // ECOSYSTEM TRACKERS HANDLERS
  const handleToggleMedication = (id: string) => {
    setMedicationList(prev => prev.map(m => {
      if (m.id === id) {
        const nextTaken = !m.taken;
        if (nextTaken) {
          setStreakData(s => ({ ...s, healthStreak: s.healthStreak + 1 }));
        }
        return { ...m, taken: nextTaken };
      }
      return m;
    }));
  };
  const handleAddMedication = (name: string, dosage: string, time: string) => {
    const newMed: MedLog = { id: 'med-' + Date.now(), name, dosage, time, taken: false };
    setMedicationList(prev => [...prev, newMed]);
  };
  const handleAddMetric = (type: any, value: string) => {
    const newMet: HealthMetric = { id: 'met-' + Date.now(), type, value, date: 'Today', status: 'optimal' };
    setHealthMetrics(prev => [newMet, ...prev]);
  };
  const getHeartRateValue = (): number => {
    const hrMetric = healthMetrics.find(m => m.type === 'Heart Rate');
    if (hrMetric) {
      const num = parseInt(hrMetric.value, 10);
      if (!isNaN(num)) return num;
    }
    return 72; // default simulated resting bpm
  };
  const handleUpdateHeartRate = (newBpm: number) => {
    setHealthMetrics(prev => {
      const existsIndex = prev.findIndex(m => m.type === 'Heart Rate');
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = {
          ...updated[existsIndex],
          value: `${newBpm} bpm`,
          date: 'Synced'
        };
        return updated;
      } else {
        return [
          { id: 'met-' + Date.now(), type: 'Heart Rate', value: `${newBpm} bpm`, date: 'Synced', status: 'optimal' },
          ...prev
        ];
      }
    });

    // Synchronize emotion indexes to match heart rate
    setEmotionMeter(prev => {
      let calcStress = prev.stress;
      if (newBpm > 100) {
        calcStress = Math.min(95, Math.floor(75 + (newBpm - 100) * 0.5));
      } else if (newBpm < 65) {
        calcStress = Math.max(10, Math.floor(15 - (65 - newBpm) * 0.5));
      } else {
        calcStress = Math.floor(20 + (newBpm - 65) * 1.5);
      }
      return {
        ...prev,
        stress: calcStress,
        fatigue: Math.min(95, Math.floor(prev.fatigue + (newBpm > 100 ? 5 : -2))),
      };
    });
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
        if (nextStatus === 'done') {
          setStreakData(s => ({ ...s, productivityStreak: s.productivityStreak + 1 }));
        }
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
                vibe === 'making_sense' ? 'border-emerald-300 text-emerald-500 glow-emerald' : 
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
              <p className="text-[9px] text-rose-650 font-mono font-extrabold tracking-widest uppercase leading-none mt-0.5">A Polymath with Heart</p>
            </div>
          </div>

          {/* Core App Tab Swapping */}
          <nav className="flex items-center gap-1.5 p-1 bg-stone-100 border border-stone-200/50 rounded-2xl flex-wrap">
            <button
              onClick={() => { stopAudio(); setActiveTab('hub'); }}
              className={`p-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer
                ${activeTab === 'hub' ? 'bg-white shadow-xs text-rose-600' : 'text-stone-500 hover:text-stone-800'}
              `}
              id="tab-hub-btn"
            >
              <span>🌸</span> <span className="font-bold">Hub</span>
            </button>
            <a
              href="https://ai.studio/apps/fc762f9b-65fd-4400-9fc0-c6e1dcbedd9d?fullscreenApplet=true"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                stopAudio();
                navigator.clipboard.writeText("https://ai.studio/apps/fc762f9b-65fd-4400-9fc0-c6e1dcbedd9d?fullscreenApplet=true");
                setToastNotice("ComSing App URL copied! Paste in a new tab if popups are blocked by your browser.");
                setTimeout(() => setToastNotice(null), 5000);
              }}
              className="p-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer text-stone-500 hover:text-stone-800 hover:bg-stone-50 no-underline"
              id="tab-symphonies-btn"
              title="Click to open or copy URL"
            >
              <span>🎤</span> <span className="font-bold">ComSing ↗</span>
            </a>
            <button
              onClick={() => { stopAudio(); setActiveTab('dashboard'); }}
              className={`p-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer
                ${activeTab === 'dashboard' ? 'bg-white shadow-xs text-rose-600' : 'text-stone-500 hover:text-stone-800'}
              `}
              id="tab-dashboard-btn"
            >
              <span>📈</span> <span className="font-bold">Diagnostics</span>
            </button>
            <button
              onClick={() => { stopAudio(); setActiveTab('uipath'); }}
              className={`p-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer
                ${activeTab === 'uipath' ? 'bg-[#9f1239] text-white shadow-xs' : 'text-stone-500 hover:text-stone-800'}
              `}
              id="tab-uipath-btn"
            >
              <span>🤖</span> <span className="font-bold">UiPath RPA</span>
            </button>

            <button
              onClick={() => { stopAudio(); setActiveTab('stellar-zk'); }}
              className={`p-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer
                ${activeTab === 'stellar-zk' ? 'bg-[#9f1239] text-white shadow-xs' : 'text-stone-500 hover:text-stone-800'}
              `}
              id="tab-stellar-zk-btn"
            >
              <span>🔒</span> <span className="font-bold">Stellar ZK & Sovereign ID</span>
            </button>

            <button
              onClick={() => { stopAudio(); setActiveTab('decision'); }}
              className={`p-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer
                ${activeTab === 'decision' ? 'bg-[#9f1239] text-white shadow-xs' : 'text-stone-500 hover:text-stone-800'}
              `}
              id="tab-decision-btn"
            >
              <span>🧠</span> <span className="font-bold">Decision Intelligence</span>
            </button>

            <button
              onClick={() => { stopAudio(); setActiveTab('alibaba'); }}
              className={`p-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer
                ${activeTab === 'alibaba' ? 'bg-orange-500 text-white shadow-xs' : 'text-stone-500 hover:text-stone-800'}
              `}
              id="tab-alibaba-btn"
            >
              <span>☁️</span> <span className="font-bold">Alibaba Cloud</span>
            </button>

            <button
              onClick={() => { stopAudio(); setActiveTab('casper-las'); }}
              className={`p-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer
                ${activeTab === 'casper-las' ? 'bg-[#9f1239] text-white shadow-xs' : 'text-stone-500 hover:text-stone-800'}
              `}
              id="tab-casper-las-btn"
            >
              <span>🌌</span> <span className="font-bold">Casper Atlas</span>
            </button>

            <button
              onClick={() => { stopAudio(); setActiveTab('avatar'); }}
              className={`p-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer
                ${activeTab === 'avatar' ? 'bg-white shadow-xs text-rose-600' : 'text-stone-500 hover:text-stone-800'}
              `}
              id="tab-avatar-btn"
            >
              <span>⚙️</span> <span className="font-bold">Settings</span>
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

            {/* Durable Cloud Sync Status */}
            <div className="flex items-center gap-1.5 bg-white border border-stone-200/60 rounded-xl px-2.5 py-1 text-xs shadow-xs">
              <Database className={`w-3.5 h-3.5 ${cloudSyncStatus === 'loading' ? 'text-rose-500 animate-spin' : cloudSyncStatus === 'success' ? 'text-emerald-500' : cloudSyncStatus === 'error' ? 'text-amber-500' : 'text-stone-400'}`} />
              <div className="flex flex-col text-left">
                <span className="text-[8px] font-mono leading-none text-stone-400 uppercase font-black">CLOUD SYNC</span>
                <span className="text-[9px] font-black text-stone-750 leading-tight">
                  {isDummy ? 'Local Session' : cloudSyncStatus === 'loading' ? 'Syncing...' : cloudSyncStatus === 'success' ? 'Synchronized' : cloudSyncStatus === 'error' ? 'Sync Error' : 'Connected'}
                </span>
              </div>
              {!isDummy && cloudSyncStatus === 'success' && (
                <span className="text-[8px] font-mono text-stone-400 ml-1">
                  {cloudSyncTime}
                </span>
              )}
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
          if (isFallbackNotice) return null; // Omit fallback notices entirely as requested
          return (
            <div className="w-full p-3 rounded-2xl flex items-start gap-2.5 text-xs animate-fadeIn shadow-sm border bg-rose-50 border-rose-200 text-rose-750">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="font-extrabold">Speech Systems Calibration Option</p>
                <p className="opacity-95">{audioError}</p>
              </div>
              <button onClick={() => setAudioError(null)} className="text-xs font-mono font-bold leading-none shrink-0 opacity-70 hover:opacity-100">
                ✕
              </button>
            </div>
          );
        })()}

        {/* Tab 1: DR. T COMPANION HUB MASTER ORCHESTRATOR */}
        {activeTab === 'hub' && (
          <div className="animate-fadeIn">
            <Hub
              showAmbientPlayer={showAmbientPlayer}
              setShowAmbientPlayer={setShowAmbientPlayer}
              language={language}
              voiceName={voiceName}
              setVoiceName={setVoiceName}
              stopAudio={stopAudio}
              activeSuiteSubTab={activeSuiteSubTab}
              setActiveSuiteSubTab={setActiveSuiteSubTab}
              setActiveTab={setActiveTab}
              messages={messages}
              vibe={vibe}
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
              drTAvatar={getCurrentAvatar()}
              triggerGreeting={triggerGreeting}
              handleUpdateHeartRate={handleUpdateHeartRate}
              getHeartRateValue={getHeartRateValue}
              toggleRecording={toggleRecording}
              setIsVoiceAgentActive={setIsVoiceAgentActive}
              setAutoSpeak={setAutoSpeak}
              startBreathingOverlay={startBreathingOverlay}
              triggerEmojis={triggerEmojis}
              speakMessage={speakMessage}
              handleSend={handleSend}
              triggerSimulationAttachment={triggerSimulationAttachment}
              handleCustomFileChange={handleCustomFileChange}
              getSpeechBubbleText={getSpeechBubbleText}
              getIcebreakerText={getIcebreakerText}
              memoryNodes={memoryNodes}
              onAddNode={handleAddNode}
              onDeleteNode={handleDeleteNode}
              specialistAgents={specialistAgents}
              setSpecialistAgents={setSpecialistAgents}
              handleTriggerSwarmCollaboration={(instruction) => handleTriggerSwarmCollaboration(instruction, '')}
              speakDirectText={(text) => speakDirectText(text, voiceName)}
              medicationList={medicationList}
              handleToggleMedication={handleToggleMedication}
              handleAddMedication={(med) => handleAddMedication(med.name, med.dosage, med.time)}
              healthMetrics={healthMetrics}
              handleAddMetric={(metric) => handleAddMetric(metric.type, metric.value)}
              skillNodes={skillNodes}
              handleAdvanceSkill={handleAdvanceSkill}
              tasks={tasks}
              handleAddTask={(task) => handleAddTask(task.title, task.priority)}
              handleToggleTaskState={handleToggleTaskState}
              handleDeleteTask={handleDeleteTask}
              calendarEvents={calendarEvents}
              handleAddEvent={(event) => handleAddEvent(event.title, event.time, event.type)}
              smartNotes={smartNotes}
              handleAddNote={(note) => handleAddNote(note.title, note.content, note.tag)}
              handleDeleteNote={handleDeleteNote}
              carbonHabits={carbonHabits}
              handleToggleCarbonHabit={handleToggleCarbonHabit}
            />
          </div>
        )}

        {/* Tab 2: ComSing LINK OUT */}
        {activeTab === 'symphonies' && (
          <div className="animate-fadeIn">
            <SymphonyConcertHall />
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
              setStreakData={setStreakData}
              emotionMeter={emotionMeter}
              setEmotionMeter={setEmotionMeter}
              voiceName={voiceName}
              setVoiceName={setVoiceName}
              language={language}
              setLanguage={setLanguage}
              memoryNodes={memoryNodes}
              onAddMemoryNode={handleAddNode}
              setActiveTab={setActiveTab}
              setInputVal={setInputVal}
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

        {/* Tab 12: ALIBABA CLOUD CONSOLE */}
        {activeTab === 'alibaba' && (
          <div className="animate-fadeIn">
            <AlibabaCloudConsole 
              memoryNodes={memoryNodes} 
              onAddNode={handleAddNode} 
            />
          </div>
        )}



        {/* Tab 9: UIPATH INTEG SUITE */}
        {activeTab === 'uipath' && (
          <div className="animate-fadeIn">
            <UiPathOrchestrator />
          </div>
        )}

        {/* Tab 10: STELLAR ZK RANGE PROOF PLAYGROUND */}
        {activeTab === 'stellar-zk' && (
          <div className="animate-fadeIn">
            <StellarZkPlayground />
          </div>
        )}

        {/* Tab 11: DECISION INTELLIGENCE PLATFORM */}
        {activeTab === 'decision' && (
          <div className="animate-fadeIn">
            <DecisionIntelligence />
          </div>
        )}

        {/* Tab 13: CASPER ATLAS CONSOLE */}
        {activeTab === 'casper-las' && (
          <div className="animate-fadeIn">
            <CasperAtlasConsole />
          </div>
        )}







      </main>

       {/* Global Disclaimer Footer */}
      <footer className="w-full border-t border-rose-100/50 bg-white/50 backdrop-blur-xs py-4 px-4 select-none shrink-0">
        <div className="max-w-6xl mx-auto flex flex-col items-center justify-between gap-3 text-[11px] text-stone-500 font-sans">
          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-450 shrink-0"></span>
              <p className="font-extrabold text-rose-800 tracking-wide uppercase font-mono text-[9px]">Platform Advisory</p>
            </div>
            <p className="font-bold text-stone-500 max-w-4xl text-center md:text-right leading-relaxed">
              Dr. T is an educational and decision-support platform and not a substitute for professional medical advice.
            </p>
          </div>
          <div className="w-full text-center border-t border-dashed border-stone-200 pt-3 flex justify-center">
            <BirthdayCelebrator textSize="text-[10px]" />
          </div>
        </div>
      </footer>

      {/* Floating Ambient Music & Soundscape Player Drawer */}
      <AnimatePresence>
        {showAmbientPlayer && (
          <div className="fixed bottom-24 md:bottom-20 right-4 md:right-6 left-4 md:left-auto z-50 shadow-2xl max-w-[calc(100%-2rem)] md:max-w-sm w-full">
            <AmbientMusicPlayer 
              isOpen={showAmbientPlayer} 
              onClose={() => setShowAmbientPlayer(false)} 
              currentVibe={vibe}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Guided Breathing Simulation Overlay */}
      <AnimatePresence>
        {showBreathing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex flex-col justify-between items-center p-6 bg-stone-950/98 backdrop-blur-2xl text-stone-100 select-none overflow-hidden"
            id="guided-breathing-overlay"
          >
            {/* Top 60-Second Linear Progress Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-stone-800">
              <motion.div 
                initial={{ width: "100%" }}
                animate={{ width: `${(breathingSeconds / 60) * 100}%` }}
                transition={{ duration: 1, ease: "linear" }}
                className={`h-full ${vibe === 'empathetic' ? 'bg-rose-500' : vibe === 'witty' ? 'bg-amber-500' : vibe === 'philosophical' ? 'bg-indigo-500' : vibe === 'making_sense' ? 'bg-emerald-500' : 'bg-purple-500'}`}
              />
            </div>

            {/* Top Bar Header */}
            <div className="w-full max-w-4xl flex justify-between items-center mt-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#fecdd3] uppercase">
                  HEALTH HYPOTHESIS LABS • SOOTHING MEDITATION
                </span>
              </div>
              
              <button 
                onClick={() => {
                  setShowBreathing(false);
                  if (typeof window !== 'undefined' && window.speechSynthesis) {
                    window.speechSynthesis.cancel();
                  }
                }}
                className="w-10 h-10 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center hover:bg-stone-800 hover:text-white transition-all cursor-pointer shadow-md text-stone-400"
                id="close-breathing-btn"
                title="Exit Exercise"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Interactive Circle Stage */}
            <div className="flex-1 flex flex-col items-center justify-center gap-8 py-8">
              
              {/* Dynamic Breathing Sphere wrapper */}
              <div className="relative w-72 h-72 flex items-center justify-center">
                
                {/* Visual expansion pulse indicator background */}
                <div className={`absolute inset-0 rounded-full blur-3xl transition-all duration-1000 opacity-30 scale-150
                  ${vibe === 'empathetic' ? 'bg-gradient-to-tr from-rose-500 to-pink-500' : vibe === 'witty' ? 'bg-gradient-to-tr from-amber-400 to-yellow-450' : vibe === 'philosophical' ? 'bg-gradient-to-tr from-indigo-400 to-sky-450' : vibe === 'making_sense' ? 'bg-gradient-to-tr from-emerald-500 to-teal-450' : 'bg-gradient-to-tr from-purple-400 to-fuchsia-450'}
                  ${breathingPhase === 'inhale' ? 'scale-175 opacity-40' : breathingPhase === 'hold' ? 'scale-190 opacity-50' : 'scale-130 opacity-20'}
                `} />

                {/* Outer spinning dashed orbital ring */}
                <div className={`absolute inset-0 rounded-full border border-dashed animate-spin-slow opacity-20
                  ${vibe === 'empathetic' ? 'border-rose-400' : vibe === 'witty' ? 'border-amber-400' : vibe === 'philosophical' ? 'border-indigo-400' : vibe === 'making_sense' ? 'border-emerald-400' : 'border-purple-400'}
                `} />

                {/* Inner spinner dotted ring */}
                <div className={`absolute inset-8 rounded-full border border-dotted animate-spin-reverse opacity-15
                  ${vibe === 'empathetic' ? 'border-pink-300' : vibe === 'witty' ? 'border-yellow-300' : vibe === 'philosophical' ? 'border-sky-300' : vibe === 'making_sense' ? 'border-emerald-300' : 'border-fuchsia-300'}
                `} />

                {/* Synchronized Expanding Breathing Circle container */}
                <motion.div
                  animate={{ 
                    scale: breathingPhase === 'inhale' 
                      ? 1.0 + (breathingCycleSeconds * 1.0 / 4) 
                      : breathingPhase === 'hold' 
                        ? 2.0 
                        : 2.0 - ((breathingCycleSeconds - 6) * 1.0 / 4)
                  }}
                  transition={{ duration: 0.95, ease: "easeInOut" }}
                  className={`w-32 h-32 rounded-full flex flex-col items-center justify-center relative shadow-3xl text-center border-4 backdrop-blur-md z-10
                    ${vibe === 'empathetic' ? 'bg-rose-500/15 border-rose-300/60 shadow-rose-500/20' : 
                      vibe === 'witty' ? 'bg-amber-500/15 border-amber-300/60 shadow-amber-500/20' : 
                      vibe === 'philosophical' ? 'bg-indigo-500/15 border-indigo-300/60 shadow-indigo-500/20' : 
                      vibe === 'making_sense' ? 'bg-emerald-500/15 border-emerald-300/60 shadow-emerald-500/20' : 
                      'bg-purple-500/15 border-purple-300/60 shadow-purple-500/20'}
                  `}
                >
                  {/* Glowing core sphere */}
                  <div className={`absolute inset-2.5 rounded-full opacity-80 flex items-center justify-center animate-pulse
                    ${vibe === 'empathetic' ? 'bg-rose-400 shadow-lg shadow-rose-400/50' : 
                      vibe === 'witty' ? 'bg-amber-400 shadow-lg shadow-amber-400/50' : 
                      vibe === 'philosophical' ? 'bg-indigo-400 shadow-lg shadow-indigo-400/50' : 
                      vibe === 'making_sense' ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50' : 
                      'bg-purple-400 shadow-lg shadow-purple-400/50'}
                  `}>
                    <span className="text-2xl text-stone-900 select-none">🧘</span>
                  </div>
                </motion.div>
                
              </div>

              {/* Phase Title Indicator */}
              <div className="text-center mt-6">
                <span className="text-[10px] font-mono font-black tracking-widest text-stone-400 uppercase">
                  CURRENT PATTERN: 4s INHALE • 2s HOLD • 4s EXHALE
                </span>
                <h3 className={`text-4xl font-extrabold tracking-widest uppercase mt-2
                  ${vibe === 'empathetic' ? 'text-rose-300' : vibe === 'witty' ? 'text-amber-300' : vibe === 'philosophical' ? 'text-indigo-300' : vibe === 'making_sense' ? 'text-emerald-300' : 'text-purple-300'}
                `}>
                  {breathingPhase === 'inhale' ? 'Breathe In' : breathingPhase === 'hold' ? 'Hold' : breathingPhase === 'exhale' ? 'Breathe Out' : 'Serenity Rest'}
                </h3>
                
                {/* Beautiful custom-tailored dialogue overlay text */}
                <p className="text-base text-stone-200 mt-4 max-w-lg mx-auto font-sans font-medium italic leading-relaxed px-6 filter drop-shadow-xs">
                  "{getBreathingSubtitle()}"
                </p>
              </div>

            </div>

            {/* Bottom Timer Status Cards */}
            <div className="w-full max-w-4xl border-t border-stone-800/80 pt-6 mb-4 flex flex-col md:flex-row gap-6 justify-between items-center text-xs">
              
              <div className="flex gap-6 items-center">
                <div className="bg-stone-900 border border-stone-800 rounded-2xl px-4 py-2.5 flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <div>
                    <p className="text-[9px] font-mono text-stone-500 uppercase leading-none">TIME ELAPSED</p>
                    <p className="font-mono font-bold text-stone-200 mt-1">{60 - breathingSeconds}s / 60s</p>
                  </div>
                </div>

                <div className="bg-stone-900 border border-stone-800 rounded-2xl px-4 py-2.5 flex items-center gap-3">
                  <Clock className="w-4 h-4 text-stone-400" />
                  <div>
                    <p className="text-[9px] font-mono text-stone-500 uppercase leading-none">TIME REMAINING</p>
                    <p className="font-mono font-bold text-stone-200 mt-1">{breathingSeconds}s</p>
                  </div>
                </div>
              </div>

              <div className="text-center md:text-right">
                <span className="text-[9px] font-mono font-extrabold text-[#fecdd3] tracking-widest uppercase">
                  DR. T SOCRATIC CONVERSATIONAL COGNITION
                </span>
                <p className="text-[10px] text-stone-400 mt-1">
                  Maternal voice frequency customized for {VIBES.find(v => v.id === vibe)?.name} Composure mode
                </p>
              </div>

            </div>
          </motion.div>
        )}

        {/* Immersive Full-Screen Voice Agent Call Overlay */}
        {isVoiceAgentActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex flex-col justify-between items-center p-6 bg-stone-950/98 backdrop-blur-2xl text-stone-100 select-none overflow-hidden"
            id="vocal-voice-agent-overlay"
          >
            {/* Ambient Background Glow matching current Vibe */}
            <div className={`absolute inset-0 transition-all duration-1000 opacity-20 pointer-events-none filter blur-3xl
              ${vibe === 'empathetic' ? 'bg-gradient-to-tr from-rose-500 to-pink-500 scale-150' : 
                vibe === 'witty' ? 'bg-gradient-to-tr from-amber-400 to-yellow-500 scale-150' : 
                vibe === 'philosophical' ? 'bg-gradient-to-tr from-indigo-400 to-sky-500 scale-150' : 
                vibe === 'making_sense' ? 'bg-gradient-to-tr from-emerald-500 to-teal-500 scale-150' : 
                'bg-gradient-to-tr from-purple-400 to-fuchsia-500 scale-150'}
            `} />

            {/* Top Bar Header */}
            <div className="w-full max-w-4xl flex justify-between items-center mt-4 relative z-10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#fecdd3] uppercase">
                  DR. T SOCRATIC COGNITION SYSTEM • VOICE CONSOLE
                </span>
              </div>
              
              <button 
                onClick={() => {
                  setIsVoiceAgentActive(false);
                  stopAudio();
                }}
                className="w-10 h-10 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center hover:bg-stone-800 hover:text-white transition-all cursor-pointer shadow-md text-stone-400"
                id="close-voice-agent-btn"
                title="End Voice Session"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Interactive Stage */}
            <div className="flex-1 w-full max-w-3xl flex flex-col items-center justify-center gap-6 py-6 relative z-10">
              
              {/* Dynamic Animated Call Orb & Dr. T Avatar */}
              <div className="relative w-64 h-64 flex items-center justify-center">
                {/* Outer shimmering waves */}
                <div className={`absolute inset-0 rounded-full blur-2xl transition-all duration-1000 opacity-40 scale-135
                  ${vibe === 'empathetic' ? 'bg-gradient-to-tr from-rose-500 to-pink-550' : vibe === 'witty' ? 'bg-gradient-to-tr from-amber-300 to-yellow-500' : vibe === 'philosophical' ? 'bg-gradient-to-tr from-indigo-400 to-sky-500' : vibe === 'making_sense' ? 'bg-gradient-to-tr from-emerald-500 to-teal-500' : 'bg-gradient-to-tr from-purple-400 to-fuchsia-500'}
                  ${isSpeaking ? 'scale-150 opacity-60' : isThinking ? 'scale-125 opacity-30 animate-pulse' : isRecording ? 'scale-140 opacity-55' : 'scale-100 opacity-20'}
                `} />

                {/* Rotating orbital coordinate rings */}
                <div className={`absolute inset-0 rounded-full border border-dashed animate-spin-slow opacity-30
                  ${vibe === 'empathetic' ? 'border-rose-455' : vibe === 'witty' ? 'border-amber-455' : vibe === 'philosophical' ? 'border-indigo-455' : vibe === 'making_sense' ? 'border-emerald-400' : 'border-purple-455'}
                `} />
                <div className={`absolute inset-4 rounded-full border border-dotted animate-spin-reverse opacity-20
                  ${vibe === 'empathetic' ? 'border-pink-300' : vibe === 'witty' ? 'border-yellow-300' : vibe === 'philosophical' ? 'border-sky-300' : vibe === 'making_sense' ? 'border-emerald-300' : 'border-fuchsia-300'}
                `} />

                {/* Avatar Core Frame */}
                <div className={`w-36 h-36 rounded-full border overflow-hidden flex items-center justify-center transition-all duration-500 z-10 bg-white relative ring-8 ring-offset-4 ring-offset-stone-950
                  ${vibe === 'empathetic' ? 'border-rose-300 ring-rose-500/20' : 
                    vibe === 'witty' ? 'border-amber-300 ring-amber-500/20' : 
                    vibe === 'philosophical' ? 'border-indigo-300 ring-indigo-500/20' : 
                    vibe === 'making_sense' ? 'border-emerald-300 ring-emerald-500/20' : 
                    'border-purple-300 ring-purple-500/20'}
                  ${isRecording ? 'scale-105 border-rose-455' : isSpeaking ? 'scale-110' : 'scale-100'}
                `}>
                  <img 
                    src={getCurrentAvatar()}
                    alt="Dr. T Avatar" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover select-none pointer-events-none"
                  />

                  {/* Mouth movement synchronous sync overlay */}
                  {isSpeaking && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="absolute top-[61.5%] left-[49.5%] -translate-x-1/2 -translate-y-1/2 w-8 h-6 flex flex-col justify-center items-center">
                        <svg 
                          viewBox="0 0 100 40" 
                          className="w-5 text-rose-500 fill-current drop-shadow-xs transition-transform duration-75"
                          style={{ transform: `translateY(-${averageSpeakIntensity * 2.5}px) scaleY(${1 - averageSpeakIntensity * 0.1})` }}
                        >
                          <path d="M 0 20 Q 25 10 50 15 Q 75 10 100 20 Q 75 15 50 22 Q 25 15 0 20 Z" />
                        </svg>
                        <div 
                          className="w-3 bg-rose-950 rounded-full transition-all duration-75 my-[0.5px]" 
                          style={{ height: `${averageSpeakIntensity * 5}px` }}
                        />
                        <svg 
                          viewBox="0 0 100 40" 
                          className="w-5 text-rose-500 fill-current drop-shadow-xs transition-transform duration-75"
                          style={{ transform: `translateY(${averageSpeakIntensity * 2.5}px) scaleY(${1 - averageSpeakIntensity * 0.1})` }}
                        >
                          <path d="M 0 20 Q 50 40 100 20 Q 50 25 0 20 Z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Header */}
              <div className="text-center">
                <span className={`text-xs font-mono font-black uppercase tracking-widest
                  ${isRecording ? 'text-rose-450 animate-pulse' : isSpeaking ? 'text-emerald-400' : 'text-stone-400'}
                `}>
                  {isThinking ? "DR. T IS THINKING..." : 
                   isSpeaking ? "DR. T IS SPEAKING..." : 
                   isRecording ? "🎤 LISTENING..." : 
                   "READY FOR SPEECH (SAY ANYTHING)"}
                </span>

                <div className="text-[11px] text-stone-400 font-mono mt-1 font-bold">
                  vocal signature: <span className="text-[#fecdd3]">{VOICES.find(v => v.id === voiceName)?.name || voiceName}</span> • vibe: <span className="text-[#fecdd3]">{vibe}</span>
                </div>
              </div>

              {/* Real-time sound waves */}
              <div className="w-full max-w-md flex items-center justify-center gap-1.5 h-8 px-4">
                {waveHeights.map((h, idx) => (
                  <span 
                    key={idx} 
                    className={`w-1 rounded-full transition-all duration-150
                      ${vibe === 'empathetic' ? 'bg-rose-400' : vibe === 'witty' ? 'bg-amber-400' : vibe === 'philosophical' ? 'bg-indigo-400' : vibe === 'making_sense' ? 'bg-emerald-400' : 'bg-purple-400'}
                    `}
                    style={{ height: `${h * 1.3}px` }}
                  ></span>
                ))}
              </div>

              {/* Live glassmorphism speech logs transcription feed */}
              <div className="w-full max-w-xl bg-stone-900/60 border border-stone-800 rounded-2xl p-5 shadow-inner mt-2 min-h-[140px] flex flex-col justify-end gap-3.5 backdrop-blur-md">
                <p className="text-[9px] font-mono text-stone-500 uppercase tracking-widest font-black leading-none mb-1">
                  🔴 LIVE TRANSLATION / TRANSCRIPTION BOX
                </p>
                {(() => {
                  const logs = messages.filter(m => m.role === 'user' || m.role === 'model').slice(-2);
                  if (logs.length === 0) {
                    return (
                      <p className="text-stone-500 italic text-sm text-center py-4">
                        "Welcome to our private maternal sanctuary. Start speaking, child. I am listening completely."
                      </p>
                    );
                  }
                  return logs.map((msg, idx) => (
                    <div key={idx} className="text-xs transition-all duration-300">
                      <span className={`font-mono text-[9px] font-bold uppercase tracking-wider block mb-0.5
                        ${msg.role === 'user' ? 'text-indigo-400' : 'text-rose-300'}
                      `}>
                        {msg.role === 'user' ? 'You said' : 'Dr. T'}
                      </span>
                      <p className={`font-sans leading-relaxed text-sm ${msg.role === 'user' ? 'text-stone-300' : 'text-white font-medium'}`}>
                        {msg.content}
                      </p>
                    </div>
                  ));
                })()}
              </div>

            </div>

            {/* Footer / Call Action Controls */}
            <div className="w-full max-w-3xl border-t border-stone-900/85 pt-6 mb-4 flex flex-col gap-4">
              
              {/* Voice Choice & Engine Controls */}
              <div className="grid grid-cols-2 gap-4 bg-stone-900/30 p-3 rounded-2xl border border-stone-900 text-xs text-stone-100">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono font-bold text-stone-500 uppercase">Vocal Voice choice</span>
                  <select
                    value={voiceName}
                    onChange={(e) => setVoiceName(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 hover:border-stone-700 rounded-xl p-2 text-xs font-bold text-stone-200 cursor-pointer focus:border-rose-400 outline-none transition-all shadow-xs"
                  >
                    {VOICES.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.accent})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono font-bold text-stone-500 uppercase">Cognition Engine</span>
                  <div className="grid grid-cols-2 gap-1 p-1 bg-stone-950 rounded-xl border border-stone-900">
                    <button
                      type="button"
                      onClick={() => setTtsEngine('gemini')}
                      className={`py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${ttsEngine === 'gemini' ? 'bg-stone-800 shadow-xs text-rose-400 font-extrabold' : 'text-stone-500 hover:text-stone-300'}`}
                    >
                      🧠 Gemini Voice
                    </button>
                    <button
                      type="button"
                      onClick={() => setTtsEngine('browser')}
                      className={`py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${ttsEngine === 'browser' ? 'bg-stone-800 shadow-xs text-indigo-400 font-extrabold' : 'text-stone-500 hover:text-stone-300'}`}
                    >
                      💻 Local Synthesizer
                    </button>
                  </div>
                </div>
              </div>

              {/* Major Action Buttons */}
              <div className="flex items-center justify-center gap-6 py-2">
                
                {/* Mute/Rec Toggle Button */}
                <button
                  onClick={toggleRecording}
                  disabled={isThinking}
                  className={`w-14 h-14 rounded-full flex items-center justify-center border transition-all cursor-pointer shadow-md relative group
                    ${isRecording 
                      ? 'bg-rose-950 border-rose-800 text-rose-400 animate-pulse' 
                      : 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800'
                    }
                  `}
                  title={isRecording ? 'Mute micro' : 'Enable listening'}
                >
                  {isRecording ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6 text-stone-400" />}
                </button>

                {/* Hang Up Red Button */}
                <button
                  onClick={() => {
                    setIsVoiceAgentActive(false);
                    stopAudio();
                  }}
                  className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-red-600/30 transition-all cursor-pointer border border-red-500"
                  id="vocal-hangup-btn"
                  title="Hang Up / End Call"
                >
                  <PhoneOff className="w-8 h-8" />
                </button>

              </div>

              <div className="text-center text-[10px] text-stone-500 font-mono">
                CONNECTED IN CONTINUOUS SECURE DUPLEX MODE • DR. T COMPANION
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HAPPY WOAH WOAH Celebration Overlay */}
      <AnimatePresence>
        {showHappyWoahWoah && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-16 right-4 sm:bottom-20 sm:right-6 md:right-10 z-[100] pointer-events-none select-none"
            id="happy-woah-woah-overlay"
          >
            <motion.div
              initial={{ scale: 0.9, rotate: -1 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.9, rotate: 1 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-64 bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl border-2 border-pink-300 dark:border-rose-950/75 rounded-2xl p-4 shadow-[0_15px_35px_rgba(244,63,94,0.22)] flex flex-col items-center text-center overflow-hidden pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Absolute decorative floating particles inside the card */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-45">
                <div className="absolute top-2 left-3 text-lg animate-[bounce_2s_infinite]">🎈</div>
                <div className="absolute top-4 right-3 text-base animate-[bounce_3s_infinite] delay-100">🎉</div>
                <div className="absolute bottom-10 left-3 text-base animate-[bounce_2.5s_infinite] delay-300">🌸</div>
                <div className="absolute bottom-12 right-3 text-lg animate-[bounce_3.5s_infinite] delay-200">🎂</div>
              </div>

              {/* Top border ambient glow */}
              <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-amber-500" />
              
              {/* Close Button */}
              <button
                onClick={() => setShowHappyWoahWoah(false)}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors cursor-pointer animate-none z-10"
                aria-label="Close celebration"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* Rarity/Celebration Tag */}
              <span className="text-[7px] font-mono font-black px-2 py-0.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full mb-2 uppercase tracking-widest shadow-xs animate-pulse relative z-10">
                ✦ MYTHIC CELEBRATION ✦
              </span>

              {/* Header Title with Emojis */}
              <div className="flex items-center gap-1 mb-2 relative z-10">
                <span className="text-sm animate-bounce">🎁</span>
                <h2 className="text-xs font-black tracking-tight bg-gradient-to-r from-pink-600 via-purple-500 to-rose-500 bg-clip-text text-transparent">
                  HAPPY WOAH WOAH! 🎉✨
                </h2>
                <span className="text-sm animate-bounce">🎁</span>
              </div>

              {/* Sparkly Divider */}
              <div className="flex items-center justify-center gap-1 w-full mb-3 relative z-10">
                <div className="h-[1px] bg-gradient-to-r from-transparent to-pink-200 dark:to-rose-950/40 flex-1" />
                <Sparkles className="w-3 h-3 text-amber-400 animate-pulse shrink-0" />
                <div className="h-[1px] bg-gradient-to-l from-transparent to-pink-200 dark:to-rose-950/40 flex-1" />
              </div>

              {/* Beautiful Poem Container */}
              <div className="w-full px-2 py-2.5 bg-gradient-to-b from-rose-50/30 to-pink-50/10 dark:from-rose-950/10 dark:to-pink-950/5 border border-pink-100/30 dark:border-rose-950/20 rounded-xl shadow-[inset_0_1px_2px_rgba(244,63,94,0.02)] mb-3 select-text relative z-10">
                <p className="text-[9px] text-stone-700 dark:text-stone-300 font-serif italic leading-relaxed whitespace-pre-line text-center antialiased">
                  {"Whose cries so crystal clear?\nThree worlds all bless 'Happy, Whole Years!\nMaking your mark soon, Dear\nWow worlds with Heart, Found worlds with Mind\nCheers on your paths go wild\nWishing you Best running your ways \nTill time finds it 'assez'\nToujours, J'attends, Bonjour! Ca va?"}
                </p>
              </div>

              {/* Decorative prompt/feedback footer */}
              <div className="flex items-center justify-center gap-1 mb-3 relative z-10">
                <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                <span className="text-[8px] text-stone-400 dark:text-stone-500 font-mono tracking-wider uppercase">
                  With Heart & Mind • Toujours
                </span>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setShowHappyWoahWoah(false)}
                className="w-full py-2 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:to-rose-600 text-white font-extrabold rounded-lg text-[9px] tracking-widest uppercase transition-all active:scale-[0.98] cursor-pointer shadow-sm shadow-pink-500/15 border border-pink-400/10 flex items-center justify-center gap-1 hover:shadow-md hover:shadow-pink-500/20 relative z-10"
              >
                Claim Joy & Celebrate! ✨
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invisible HTML5 Audio */}
      <audio className="hidden" ref={audioRef} />
    </div>
  );
}
