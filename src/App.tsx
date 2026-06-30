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
  PhoneCall
} from 'lucide-react';
import { VIBES, VOICES, LANGUAGES, INITIAL_MEMORY_NODES, INITIAL_SPECIALIST_AGENTS, INITIAL_MED_LIST, INITIAL_HEALTH_METRICS, INITIAL_SKILL_NODES, INITIAL_TASK_LIST, INITIAL_CALENDAR_EVENTS, INITIAL_SMART_NOTES, INITIAL_CARBON_HABITS } from './constants';
import { Message, DrTVibe, DrTAppearance, MemoryNode, SpecialistAgent, MedLog, HealthMetric, SkillNode, TaskItem, CalendarEvent, SmartNote, CarbonHabit, LifetimeStreak } from './types';
import { AvatarSettings, APPEARANCES } from './components/AvatarSettings';
import { LifeGraph } from './components/LifeGraph';
import { AgentSwarm } from './components/AgentSwarm';
import { Trackers } from './components/Trackers';
import { Dashboard } from './components/Dashboard';
import { BiomedicalSuite } from './components/BiomedicalSuite';
import { PortfolioShowcase } from './components/PortfolioShowcase';
import { BirthdayCelebrator } from './components/BirthdayCelebrator';
import { UiPathOrchestrator } from './components/UiPathOrchestrator';
import StellarZkPlayground from './components/StellarZkPlayground';
import { DecisionIntelligence } from './components/DecisionIntelligence';
import drTAvatar from './assets/images/dr_t_avatar_1781184840352.jpg';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'hub' | 'graph' | 'swarm' | 'trackers' | 'dashboard' | 'avatar' | 'suite' | 'showcase' | 'uipath' | 'stellar-zk' | 'decision'>('hub');
  const [activeSuiteSubTab, setActiveSuiteSubTab] = useState<'patient' | 'fhir' | 'analytics' | 'summarizer' | 'imaging' | 'population' | 'coach' | 'lab' | 'mimic' | 'orchestrator'>('patient');

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

  // Emotional detection metrics
  const [emotionMeter, setEmotionMeter] = useState<{ stress: number; fatigue: number; happiness: number }>({
    stress: 25,
    fatigue: 40,
    happiness: 70
  });

  // Guided Breathing Overlay states
  const [showBreathing, setShowBreathing] = useState<boolean>(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale' | 'complete'>('inhale');
  const [breathingSeconds, setBreathingSeconds] = useState<number>(60);
  const [breathingCycleSeconds, setBreathingCycleSeconds] = useState<number>(0);

  // Attachments simulation state
  const [attachedFile, setAttachedFile] = useState<{ name: string; type: 'image' | 'document'; url: string } | null>(null);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  const [langNotice, setLangNotice] = useState<string | null>(null);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

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
        if (response.status === 429 || errMsg.toLowerCase().includes('quota') || errMsg.toLowerCase().includes('rate')) {
          setTtsEngine('browser');
          speakViaWebSpeechAPI(cleanedText, messageId, overrideLang);
          setAudioError("Defaulted to local device voice (Gemini TTS limit reached). Engine switched to browser.");
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
        if (response.status === 429 || errMsg.toLowerCase().includes('quota') || errMsg.toLowerCase().includes('rate')) {
          setTtsEngine('browser');
          setAudioError("Defaulted to local device voice (Gemini TTS limit reached). Engine switched to browser.");
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
              <span>🌸</span> <span className="hidden sm:inline">Hub</span>
            </button>
            <button
              onClick={() => { stopAudio(); setActiveTab('suite'); }}
              className={`p-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer
                ${activeTab === 'suite' ? 'bg-[#9f1239] text-white shadow-xs' : 'text-stone-500 hover:text-stone-800'}
              `}
              id="tab-suite-btn"
            >
              <span>🔬</span> <span className="font-bold">Informatics Platform</span>
            </button>
            <button
              onClick={() => { stopAudio(); setActiveTab('showcase'); }}
              className={`p-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer
                ${activeTab === 'showcase' ? 'bg-[#9f1239] text-white shadow-xs' : 'text-stone-500 hover:text-stone-800'}
              `}
              id="tab-showcase-btn"
            >
              <span>🏆</span> <span className="font-bold">Portfolio</span>
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
              <span>🔒</span> <span className="font-bold">Stellar ZK</span>
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
          <div 
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn transition-all duration-1000" 
            id="dr-t-infinity-hub"
            style={{
              '--orb-glow-color': getHeartRateValue() > 100 ? '#f59e0b' : '#f43f5e',
              '--orb-glow-start': getHeartRateValue() > 100 ? '#fbbf24' : '#fb7185',
              '--orb-glow-end': getHeartRateValue() > 100 ? '#d97706' : '#e11d48',
              '--orb-glow-ring': getHeartRateValue() > 100 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(244, 63, 94, 0.1)'
            } as React.CSSProperties}
          >
            
            {/* Left Spatial Voice & Parameter Dashboard Panel (span 5) */}
            <div className="lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 w-full">
              
              {/* Column A: Diagnostics & Biofeedback */}
              <div className="flex flex-col gap-6 w-full">
              
              {/* Giant Live Orb card */}
              <div className="w-full bg-white/80 border border-rose-100/70 rounded-3xl p-6 shadow-md flex flex-col items-center justify-between min-h-[460px] relative overflow-hidden">
                
                {/* SVG Live EKG Pulse Heartbeat Monitor background overlay */}
                <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                  <style dangerouslySetInnerHTML={{__html: `
                    @keyframes ekgPulse {
                      0%, 100% {
                        opacity: 0.15;
                        transform: scaleY(0.95);
                        stroke-width: 2.2;
                      }
                      15% {
                        opacity: 0.95;
                        transform: scaleY(1.15);
                        stroke-width: 3.5;
                        filter: drop-shadow(0 0 6px var(--orb-glow-color, #f43f5e));
                      }
                      30% {
                        opacity: 0.25;
                        transform: scaleY(0.97);
                        stroke-width: 2.2;
                      }
                      45% {
                        opacity: 0.65;
                        transform: scaleY(1.05);
                        stroke-width: 2.8;
                        filter: drop-shadow(0 0 3px var(--orb-glow-color, #f43f5e));
                      }
                    }
                    .ekg-active-pulse {
                      transform-origin: center;
                      animation: ekgPulse var(--ekg-duration, 1s) infinite ease-in-out;
                    }
                  `}} />
                  <svg className="w-full h-full opacity-55" viewBox="0 0 400 300" preserveAspectRatio="none">
                    <defs>
                      <pattern id="heartgrid" width="16" height="16" patternUnits="userSpaceOnUse">
                        <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(244, 63, 94, 0.04)" strokeWidth="0.5"/>
                        <circle cx="8" cy="8" r="0.5" fill="rgba(244, 63, 94, 0.08)" />
                      </pattern>
                      <linearGradient id="ekgGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="transparent" />
                        <stop offset="20%" stopColor="var(--orb-glow-color, #f43f5e)" stopOpacity="0.25" />
                        <stop offset="50%" stopColor="var(--orb-glow-color, #f43f5e)" />
                        <stop offset="80%" stopColor="var(--orb-glow-color, #f43f5e)" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="transparent" />
                      </linearGradient>
                    </defs>
                    
                    {/* Grid Background */}
                    <rect width="100%" height="100%" fill="url(#heartgrid)" />
                    
                    {/* The sweeping/pulsating heartbeat line */}
                    <path
                      d="M 0,150 L 40,150 Q 46,142 52,150 L 58,150 L 62,155 L 67,110 L 72,190 L 77,150 L 83,150 Q 90,140 97,150 L 140,150 L 180,150 Q 186,142 192,150 L 198,150 L 202,155 L 207,110 L 212,190 L 217,150 L 223,150 Q 230,140 237,150 L 280,150 L 320,150 Q 326,142 332,150 L 338,150 L 342,155 L 347,110 L 352,190 L 357,150 L 363,150 Q 370,140 377,150 L 400,150"
                      fill="none"
                      stroke="url(#ekgGlow)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="ekg-active-pulse"
                      style={{ '--ekg-duration': `${60 / getHeartRateValue()}s` } as React.CSSProperties}
                    />
                  </svg>
                </div>

                <div className="w-full text-center z-10">
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
                  className={`relative my-6 flex items-center justify-center w-36 h-36 ${!hasGreeted ? 'cursor-pointer hover:scale-103' : ''} transition-all duration-300 z-10`}
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
                  <div 
                    className={`absolute inset-0 rounded-full blur-3xl transition-all duration-1000 opacity-60 scale-125 animate-pulse
                      ${isThinking ? 'scale-135' : ''}
                    `}
                    style={{ 
                      animationDuration: `${60 / getHeartRateValue()}s`,
                      backgroundImage: 'radial-gradient(circle, var(--orb-glow-start, #fb7185) 0%, var(--orb-glow-end, #f43f5e) 70%, transparent 100%)'
                    }}
                  ></div>
                  
                  {/* Spatial coordinate dashed lines */}
                  <div 
                    className="absolute inset-0 rounded-full border border-dashed animate-spin-slow opacity-60"
                    style={{ 
                      animationDuration: `${120 / getHeartRateValue()}s`,
                      borderColor: 'var(--orb-glow-color, rgba(244, 63, 94, 0.4))'
                    }}
                  ></div>

                  <div 
                    className="absolute inset-3 rounded-full border border-dotted animate-spin-reverse opacity-40"
                    style={{ 
                      animationDuration: `${180 / getHeartRateValue()}s`,
                      borderColor: 'var(--orb-glow-color, rgba(244, 63, 94, 0.35))'
                    }}
                  ></div>

                  {/* Dr. T Avatar Visual frame */}
                  <div 
                    className={`w-28 h-28 rounded-full border overflow-hidden flex items-center justify-center transition-all duration-1000 z-10 bg-white relative
                      ring-8 ring-offset-4 ring-offset-white
                      ${isRecording ? 'scale-105' : isSpeaking ? 'scale-110' : 'scale-100'}
                    `}
                    style={{
                      borderColor: 'var(--orb-glow-color, #fda4af)',
                      boxShadow: '0 0 0 8px var(--orb-glow-ring, rgba(244, 63, 94, 0.1))'
                    }}
                  >
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

                {/* Wearable Biometric Link Pulse Control */}
                <div className="w-full bg-stone-50/70 border border-stone-200/50 rounded-2xl p-3 flex flex-col gap-2 shadow-xs my-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="relative flex items-center justify-center">
                        <Heart 
                          className="w-4 h-4 text-rose-500 fill-current shrink-0 animate-pulse" 
                          style={{ 
                            animationDuration: `${60 / getHeartRateValue()}s` 
                          }} 
                        />
                        <span className="absolute w-2 h-2 rounded-full bg-rose-400 opacity-75 animate-ping" />
                      </div>
                      <span className="text-[10px] font-mono font-bold tracking-wider text-stone-650 uppercase">
                        Live Wearable Bio-Sync
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                      {getHeartRateValue()} BPM
                    </span>
                  </div>

                  {/* Slider or preset buttons */}
                  <div className="flex items-center gap-3">
                    <input 
                      type="range" 
                      min="50" 
                      max="140" 
                      value={getHeartRateValue()}
                      onChange={(e) => handleUpdateHeartRate(parseInt(e.target.value, 10))}
                      className="flex-1 h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                    />
                  </div>

                  <div className="flex justify-between gap-1.5">
                    {[
                      { bpm: 58, label: "🧘 Sleep/Zen", color: "hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200" },
                      { bpm: 72, label: "☘️ Baseline", color: "hover:bg-stone-100 hover:text-stone-700 hover:border-stone-200" },
                      { bpm: 115, label: "⚡ Stress Surge", color: "hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200" }
                    ].map((preset) => (
                      <button
                        key={preset.bpm}
                        onClick={() => handleUpdateHeartRate(preset.bpm)}
                        className={`text-[9px] font-bold py-1 px-2 border rounded-lg transition-all cursor-pointer flex-1 text-center font-mono
                          ${getHeartRateValue() === preset.bpm 
                            ? 'bg-stone-900 border-stone-900 text-white shadow-xs' 
                            : `bg-white border-stone-200 text-stone-500 ${preset.color}`
                          }
                        `}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  <span className="text-[9.5px] text-stone-500 text-center leading-sm font-sans block">
                    Dr. T's Socratic companion orb dynamically shifts its pulsation wavelength to match your heart rate in real time.
                  </span>
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

                  {/* Live Voice Agent Call Button */}
                  <button
                    onClick={() => {
                      setIsVoiceAgentActive(true);
                      // Turn on autoSpeak to guarantee motherly voice reply
                      setAutoSpeak(true);
                    }}
                    className="mt-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 border border-emerald-400 rounded-2xl w-full text-xs font-extrabold text-white transition-all cursor-pointer shadow-md uppercase font-mono tracking-wider active:scale-98"
                    id="trigger-voice-agent-call-btn"
                  >
                    <PhoneCall className="w-3.5 h-3.5 animate-pulse" /> Live Voice Agent Call
                  </button>

                  {/* Dr. T Tab Button */}
                  <a
                    href="https://vocalbridgeai.com/shared/4ahTePkJBzlh0LQ1ndxolhqau3_hjYVfWWeM4-nwuhc?id=vb_YFqaOSEkoPlUix1yYWr2WVvSUN46YyQbJ6uk_5HGYeA&key=vb_YFqaOSEkoPlUix1yYWr2WVvSUN46YyQbJ6uk_5HGYeA&apiKey=vb_YFqaOSEkoPlUix1yYWr2WVvSUN46YyQbJ6uk_5HGYeA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 border border-rose-400 rounded-2xl w-full text-xs font-extrabold text-white transition-all cursor-pointer shadow-md uppercase font-mono tracking-wider active:scale-98 text-center"
                    id="dr-t-vocal-link-tab"
                  >
                    <PhoneCall className="w-3.5 h-3.5" /> Dr. T
                  </a>



                  {/* Guided Breathing Trigger Button */}
                  <button
                    onClick={startBreathingOverlay}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-50/80 to-pink-50/80 hover:from-rose-100/90 hover:to-pink-100/90 border border-rose-100/80 rounded-2xl w-full text-xs font-bold text-rose-700 transition-all cursor-pointer shadow-xs uppercase font-mono tracking-wider active:scale-98"
                  >
                    🧘 Guided Breathing Exercise
                  </button>
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

                  {/* Soul healing simulation button */}
                  <button
                    onClick={() => {
                      setEmotionMeter({ stress: 10, fatigue: 15, happiness: 95 });
                      triggerEmojis('hug');
                    }}
                    className="mt-2.5 w-full py-2 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 text-emerald-700 border border-emerald-200/60 rounded-xl text-[10px] font-bold font-mono uppercase tracking-wider transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                  >
                    💖 Simulate Soul Healing (+95% Serotonin)
                  </button>
                </div>
              </div>

            </div> {/* Close Column A */}

            {/* Column B: Active Neural Voice Console Card & Peer Greet Service */}
            <div className="flex flex-col gap-6 w-full">

                {/* Active Neural Voice Console Card */}
                <div className="bg-white/80 border border-rose-100/70 rounded-3xl p-5 shadow-xs flex flex-col gap-3.5" id="vocal-voice-synthesizer-card">
                <span className="text-[10px] font-mono font-bold tracking-widest text-rose-550 uppercase flex items-center gap-1.5">
                  <Headphones className="w-3.5 h-3.5 text-rose-500 animate-pulse" /> ACTIVE NEURAL VOICE CONSOLE
                </span>

                {/* Voice Character Select */}
                <div className="flex flex-col gap-1 text-xs">
                  <span className="text-[10px] font-mono font-bold text-stone-500 uppercase">Select Vocal Signature</span>
                  <select
                    value={voiceName}
                    onChange={(e) => setVoiceName(e.target.value)}
                    className="w-full bg-white border border-stone-200 hover:border-stone-300 rounded-xl p-2 text-xs font-bold text-stone-700 cursor-pointer focus:border-rose-400 outline-none transition-all shadow-xs"
                  >
                    {VOICES.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.accent})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Engine Mode Section */}
                <div className="flex flex-col gap-1 text-xs">
                  <span className="text-[10px] font-mono font-bold text-stone-500 uppercase">Cognition Vocal Engine</span>
                  <div className="grid grid-cols-2 gap-1 p-1 bg-stone-100/80 rounded-xl border border-stone-200">
                    <button
                      onClick={() => setTtsEngine('gemini')}
                      className={`py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${ttsEngine === 'gemini' ? 'bg-white shadow-xs text-rose-600 font-extrabold' : 'text-stone-500 hover:text-stone-850'}`}
                      title="Generates sweet high-fidelity voice output using Gemini TTS Model"
                    >
                      🧠 Gemini AI Voice
                    </button>
                    <button
                      onClick={() => setTtsEngine('browser')}
                      className={`py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${ttsEngine === 'browser' ? 'bg-white shadow-xs text-indigo-600 font-extrabold' : 'text-stone-500 hover:text-stone-850'}`}
                      title="High speed offline browser-native speech synthesis"
                    >
                      💻 Local Synthesis
                    </button>
                  </div>
                </div>

                {/* Vocal Modulation Sliders */}
                <div className="grid grid-cols-2 gap-3 mt-0.5">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-[9px] font-mono text-stone-500">
                      <span>VOCAL PITCH</span>
                      <span className="font-bold text-rose-600">{ttsPitch.toFixed(2)}x</span>
                    </div>
                    <input 
                      type="range" 
                      min="0.5" 
                      max="2.0" 
                      step="0.05" 
                      value={ttsPitch} 
                      onChange={(e) => setTtsPitch(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-rose-500" 
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-[9px] font-mono text-stone-500">
                      <span>READING SPEED</span>
                      <span className="font-bold text-rose-600">{ttsRate.toFixed(2)}x</span>
                    </div>
                    <input 
                      type="range" 
                      min="0.5" 
                      max="2.0" 
                      step="0.05" 
                      value={ttsRate} 
                      onChange={(e) => setTtsRate(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-rose-500" 
                    />
                  </div>
                </div>

                {/* Subtext info */}
                <p className="text-[9px] text-stone-400 font-sans leading-snug">
                  {ttsEngine === 'gemini' 
                    ? "💡 Pitch & Speed modulations apply exclusively to 'Local Synthesis' mode. Gemini AI Voice employs sweet preset cadences."
                    : "✔️ Pitch and Speed adjustments calibrated. Listening to local speech synthesis is 100% responsive."
                  }
                </p>

                {/* Test synthesis button */}
                <button
                  onClick={() => {
                    const textOptions = [
                      "Hello sweetheart, I am Dr. T, your loving companion and intellectual soulmate. I am here to listen with all my heart, and answer with all my mind.",
                      "Take a slow, deep breath, my child. Mommy is right here, and everything is going to be completely okay.",
                      "Mẹ và người tri kỷ lớn bên con đây, thương lắm con yêu. Hãy tâm sự mọi vui buồn, thắc mắc về cuộc sống hay vũ trụ với mẹ nhé!",
                      "Oh mon chéri, mon âme sœur et ta maman de sagesse ! Raconte-moi tes peines, tes projets de vie ou tes questions sur l'univers, je t'écoute de tout mon cœur.",
                      "¡Mi querido corazón, mi alma gemela! Cuéntame tus penas de amor, tus dudas existenciales o tus retos con la ciencia. Mamá te comprende profundamente."
                    ];
                    let phrase = textOptions[0];
                    const langLower = (language || 'auto').toLowerCase();
                    if (langLower.includes('vietnamese') || langLower.includes('vi')) {
                      phrase = textOptions[2];
                    } else if (langLower.includes('french') || langLower.includes('fr')) {
                      phrase = textOptions[3];
                    } else if (langLower.includes('spanish') || langLower.includes('es')) {
                      phrase = textOptions[4];
                    } else {
                      const rand = Math.floor(Math.random() * 2);
                      phrase = textOptions[rand];
                    }
                    const testId = `test-tts-${Date.now()}`;
                    speakMessage(testId, phrase);
                  }}
                  className="w-full py-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl text-[10px] font-bold font-mono uppercase tracking-wider transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5 hover:shadow-md active:scale-98"
                >
                  🔊 Test Custom Accent Synthesis
                </button>
              </div>

              {/* Socratic Platform Peer Greet Service Console */}
              <div className="bg-white/80 border border-stone-200/65 rounded-3xl p-5 shadow-xs flex flex-col gap-3.5" id="socratic-peer-greeting-service-card">
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#cf586e] uppercase flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  SOCRATIC PLATFORM INTERACTIVE GREET SERVICE
                </span>

                {/* Nickname Setter */}
                <div className="flex flex-col gap-1 text-xs">
                  <span className="text-[10px] font-mono font-bold text-stone-500 uppercase flex justify-between">
                    <span>Your Platform Nickname</span>
                    <span className="text-rose-550 font-extrabold text-[9px] font-mono">ACTIVE ON PLATFORM</span>
                  </span>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Enter your nickname..."
                      className="flex-1 bg-white border border-stone-200 text-stone-850 hover:border-stone-300 rounded-xl p-2 text-xs font-bold outline-none focus:border-rose-400 transition-all shadow-xs"
                    />
                    <button
                      onClick={() => {
                        const capitalizedText = getIcebreakerText(language);
                        triggerGreeting(capitalizedText);
                      }}
                      className="px-3 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100/70 font-bold rounded-xl text-[10px] transition-all cursor-pointer font-mono uppercase"
                      title="Click to force-greet you with this name!"
                    >
                      👋 Greet Me
                    </button>
                  </div>
                  <p className="text-[9px] text-stone-400 font-sans mt-0.5 leading-tight">
                    💡 Dr. T will instantly address you with this vocal identity in all greetings across the platform.
                  </p>
                </div>

                {/* Live kindred connections greetings history */}
                <div className="flex flex-col gap-2 pt-1 border-t border-stone-100">
                  <span className="text-[10px] font-mono font-bold text-stone-500 uppercase flex items-center justify-between">
                    <span>Live Visitor Greetings (Global Feed)</span>
                    <span className="text-stone-400 text-[8px] font-normal font-mono">Simulated Web RTC</span>
                  </span>
                  
                  <div className="flex flex-col gap-1.5 max-h-[140px] overflow-y-auto pr-1">
                    {simulatedGreets.map((greet) => (
                      <div key={greet.id} className="p-2.5 bg-stone-55 border border-stone-100 rounded-xl flex flex-col gap-0.5 animate-fadeIn">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-stone-700 flex items-center gap-1">
                            <span>{greet.flag}</span>
                            <span className="font-mono text-stone-850">{greet.name}</span>
                            <span className="text-[8px] bg-emerald-50 text-emerald-700 border border-emerald-100 rounded px-1 py-0.5 uppercase font-mono font-bold font-sans">GREETED</span>
                          </span>
                          <span className="text-[8px] font-mono text-stone-400">{greet.time}</span>
                        </div>
                        <p className="text-[10.5px] text-stone-500 italic mt-0.5 pl-4 border-l border-stone-200">
                          &ldquo;{greet.msg}&rdquo;
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div> {/* Close Column B */}
          </div> {/* Close left dashboard container panels */}

          {/* Right Multimodal Conversation Console Panel (span 7) */}
          <div className="lg:col-span-7 flex flex-col gap-6 h-full">

            {/* Main chat log */}
            <div className="bg-white/85 border border-stone-200/50 rounded-3xl p-5 shadow-xs flex flex-col justify-between min-h-[460px] max-h-[580px] h-full relative" id="dialogue-console-chat-card">
              
              {/* Chat header */}
              <div className="flex items-center justify-between border-b border-stone-150 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <p className="text-xs font-mono font-bold tracking-wider text-stone-600 uppercase">Interactive Dialogue Console</p>
                </div>
                <span className="text-[10px] font-mono text-stone-400">Total conversation sync: {messages.length}</span>
              </div>

              {/* Messages scrollarea */}
              <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3.5 max-h-[380px] scroll-smooth">
                {messages.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-stone-400">
                    <InfinityIcon className="w-9 h-9 text-rose-300 animate-pulse mb-2" />
                    <p className="text-xs font-extrabold text-stone-600">Comforting Multilingual Counselor Hub</p>
                    <p className="text-[11px] leading-relaxed text-stone-400 max-w-[340px] mt-1">
                      Select a language option, then share any secret, vent relationship worries, ask life questions, or debug complex code. Dr. T Infinity knows everything and advises with maternal warmth!
                    </p>
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {messages.map((m) => (
                      <motion.div 
                        key={m.id}
                        initial={{ opacity: 0, y: 12, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 380, damping: 28 }}
                        className={`flex flex-col max-w-[85%]
                          ${m.role === 'user' ? 'self-end items-end' : 'self-start items-start'}
                        `}
                      >
                        {/* Sender info */}
                        <span className="text-[9px] text-stone-400 font-mono font-extrabold mb-1 uppercase tracking-wider">
                          {m.role === 'user' ? 'Sweet Child (You)' : `Dr. T (${VIBES.find(v => v.id === vibe)?.name || 'Empathetic'})`} • {m.timestamp}
                        </span>

                        {/* Bubble */}
                        <div 
                          className={`p-3 rounded-2xl text-xs leading-relaxed transition-all shadow-sm relative duration-300
                            ${m.isVoicePlaying ? 'ring-2 ring-offset-1 ' + (
                              vibe === 'empathetic' ? 'ring-rose-300 bg-rose-50/90 shadow-lg shadow-rose-200/50' :
                              vibe === 'witty' ? 'ring-amber-300 bg-amber-50/90 shadow-lg shadow-amber-200/50' :
                              vibe === 'philosophical' ? 'ring-indigo-300 bg-indigo-50/90 shadow-lg shadow-indigo-200/50' :
                              'ring-purple-300 bg-purple-50/90 shadow-lg shadow-purple-200/50'
                            ) : ''}
                            ${m.role === 'user' 
                              ? 'bg-stone-900 border border-stone-950 text-white rounded-tr-none' 
                              : vibe === 'empathetic' ? 'bg-rose-50/70 border border-rose-100 text-rose-950 rounded-tl-none hover:bg-rose-50' 
                                : vibe === 'witty' ? 'bg-amber-50/70 border border-amber-100 text-amber-950 rounded-tl-none hover:bg-amber-50' 
                                : vibe === 'philosophical' ? 'bg-indigo-50/70 border border-indigo-100 text-indigo-950 rounded-tl-none hover:bg-indigo-50' 
                                : 'bg-purple-50/70 border border-purple-100 text-purple-950 rounded-tl-none hover:bg-purple-50'
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
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
                <AnimatePresence>
                  {isThinking && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.22 }}
                      className="self-start flex flex-col items-start max-w-[80%]"
                    >
                      <span className="text-[9px] text-stone-400 font-mono font-extrabold mb-1 uppercase tracking-wider animate-pulse">
                        DR. T IS PONDERING...
                      </span>
                      <div className={`p-3.5 border rounded-2xl rounded-tl-none flex items-center gap-3 text-xs shadow-md transition-all duration-300 animate-pulse
                        ${vibe === 'empathetic' ? 'bg-rose-50/95 border-rose-200/70 shadow-rose-100/40 text-rose-950' :
                          vibe === 'witty' ? 'bg-amber-50/95 border-amber-200/70 shadow-amber-100/40 text-amber-950' :
                          vibe === 'philosophical' ? 'bg-indigo-50/95 border-indigo-200/70 shadow-indigo-100/40 text-indigo-950' :
                          'bg-purple-50/95 border-purple-200/70 shadow-purple-100/40 text-purple-950'
                        }
                      `}>
                        <RefreshCw className={`w-3.5 h-3.5 animate-spin shrink-0
                          ${vibe === 'empathetic' ? 'text-rose-550' :
                            vibe === 'witty' ? 'text-amber-650' :
                            vibe === 'philosophical' ? 'text-indigo-650' :
                            'text-purple-650'
                          }
                        `} />
                        <span className="text-[11px] font-mono tracking-wide">
                          Syncing semantic network
                        </span>
                        
                        {/* Elegant three bouncing dots typing sequence */}
                        <div className="flex items-center gap-1.5 ml-1.5 shrink-0 py-1">
                          <span className={`w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:-0.3s]
                            ${vibe === 'empathetic' ? 'bg-rose-500' :
                              vibe === 'witty' ? 'bg-amber-500' :
                              vibe === 'philosophical' ? 'bg-indigo-500' :
                              'bg-purple-500'
                            }
                          `}></span>
                          <span className={`w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:-0.15s]
                            ${vibe === 'empathetic' ? 'bg-rose-500' :
                              vibe === 'witty' ? 'bg-amber-500' :
                              vibe === 'philosophical' ? 'bg-indigo-500' :
                              'bg-purple-500'
                            }
                          `}></span>
                          <span className={`w-1.5 h-1.5 rounded-full animate-bounce
                            ${vibe === 'empathetic' ? 'bg-rose-500' :
                              vibe === 'witty' ? 'bg-amber-500' :
                              vibe === 'philosophical' ? 'bg-indigo-500' :
                              'bg-purple-500'
                            }
                          `}></span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              {/* Proactive alert scrolling advisory banner */}
              <div className="my-2.5 p-2 bg-gradient-to-r from-rose-50/50 via-amber-50/50 to-emerald-50/50 border border-stone-150 rounded-xl text-[10px] text-stone-500 flex items-center justify-between shadow-xs z-10 animate-pulse">
                <span className="flex items-center gap-1.5 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-550"></span>
                  <span className="font-extrabold text-stone-700 uppercase">PROACTIVE INTELLIGENCE:</span>
                  <span className="truncate leading-none">Your passport expires in 5 months. You have not logged steps today.</span>
                </span>
                <button 
                  onClick={() => { stopAudio(); handleSend("Prepare checklist to renew passport and plan local transport."); }}
                  className="text-[9px] font-black text-rose-600 hover:text-rose-800 shrink-0 font-mono ml-2 underline underline-offset-2 cursor-pointer"
                >
                  RESOLVE NOW
                </button>
              </div>

              {/* Link uploaded notification notice */}
              {uploadNotice && (
                <div className="mb-2 p-2 text-[10px] font-mono text-emerald-800 bg-emerald-50 rounded-lg flex items-center justify-between border border-emerald-100 animate-fadeIn">
                  <span className="flex items-center gap-1">📎 {uploadNotice}</span>
                  <button onClick={() => { setUploadNotice(null); }} className="text-stone-400 hover:text-stone-700">✕</button>
                </div>
              )}

              {/* Language Switch notification */}
              {langNotice && (
                <div className="mb-2 p-2 text-[10px] font-mono text-rose-800 bg-rose-50 rounded-lg flex items-center justify-between border border-rose-100 animate-fadeIn">
                  <span className="flex items-center gap-1.5 font-bold">🌐 {langNotice}</span>
                  <button onClick={() => setLangNotice(null)} className="text-rose-450 hover:text-rose-700 cursor-pointer">✕</button>
                </div>
              )}

              {/* Socratic Proactive Synchronizer notification toast */}
              {toastNotice && (
                <div className="mb-3 p-3 text-[11px] font-sans text-rose-900 bg-[#fff5f5] rounded-2xl flex items-start gap-2.5 justify-between border border-rose-200/65 shadow-xs animate-fadeIn">
                  <span className="leading-relaxed font-semibold">
                    {toastNotice}
                  </span>
                  <button onClick={() => setToastNotice(null)} className="text-rose-450 hover:text-rose-700 cursor-pointer font-bold shrink-0 text-xs">✕</button>
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
                    <div className="absolute bottom-11 left-0 bg-white border border-stone-200 rounded-2xl p-2.5 shadow-md flex flex-col gap-1.5 w-[240px] hidden group-hover/tray:flex group-focus-within/tray:flex animate-fadeIn z-50">
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
                    placeholder="Vent your worries, ask for life advice, debug code, or ask Dr. T any question..."
                    className="flex-1 bg-stone-55 border border-stone-200 rounded-xl p-2 px-3 text-xs outline-none focus:bg-white focus:border-rose-455 transition-all text-stone-850"
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

              {/* Disclaimer */}
              <div className="text-[10px] text-stone-400 mt-2 text-center leading-normal border-t border-stone-100/50 pt-2 font-sans italic select-none">
                <p>Dr. T is an educational and decision-support platform and not a substitute for professional medical advice.</p>
                <div className="mt-2.5 flex justify-center">
                  <BirthdayCelebrator textSize="text-[9px]" />
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
              onAddSpecialist={(newAgent) => setSpecialistAgents(prev => [...prev, newAgent])}
              onSpeakText={speakDirectText}
              activeVoiceName={voiceName}
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
              setStreakData={setStreakData}
              emotionMeter={emotionMeter}
              setEmotionMeter={setEmotionMeter}
              voiceName={voiceName}
              setVoiceName={setVoiceName}
              language={language}
              setLanguage={setLanguage}
              memoryNodes={memoryNodes}
              onAddMemoryNode={handleAddNode}
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

        {/* Tab 7: BIOMEDICAL SUITE */}
        {activeTab === 'suite' && (
          <div className="animate-fadeIn">
            <BiomedicalSuite 
              language={language === 'auto' ? 'English' : language} 
              activeSubTab={activeSuiteSubTab}
              onSubTabChange={(sub) => setActiveSuiteSubTab(sub)}
            />
          </div>
        )}

        {/* Tab 8: PORTFOLIO SHOWCASE */}
        {activeTab === 'showcase' && (
          <div className="animate-fadeIn">
            <PortfolioShowcase 
              language={language === 'auto' ? 'English' : language} 
              onNavigate={(tab, subTab) => {
                stopAudio();
                setActiveTab(tab as any);
                if (subTab) {
                  setActiveSuiteSubTab(subTab as any);
                }
              }}
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
                className={`h-full ${vibe === 'empathetic' ? 'bg-rose-500' : vibe === 'witty' ? 'bg-amber-500' : vibe === 'philosophical' ? 'bg-indigo-500' : 'bg-purple-500'}`}
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
                  ${vibe === 'empathetic' ? 'bg-gradient-to-tr from-rose-500 to-pink-500' : vibe === 'witty' ? 'bg-gradient-to-tr from-amber-400 to-yellow-450' : vibe === 'philosophical' ? 'bg-gradient-to-tr from-indigo-400 to-sky-450' : 'bg-gradient-to-tr from-purple-400 to-fuchsia-450'}
                  ${breathingPhase === 'inhale' ? 'scale-175 opacity-40' : breathingPhase === 'hold' ? 'scale-190 opacity-50' : 'scale-130 opacity-20'}
                `} />

                {/* Outer spinning dashed orbital ring */}
                <div className={`absolute inset-0 rounded-full border border-dashed animate-spin-slow opacity-20
                  ${vibe === 'empathetic' ? 'border-rose-400' : vibe === 'witty' ? 'border-amber-400' : vibe === 'philosophical' ? 'border-indigo-400' : 'border-purple-400'}
                `} />

                {/* Inner spinner dotted ring */}
                <div className={`absolute inset-8 rounded-full border border-dotted animate-spin-reverse opacity-15
                  ${vibe === 'empathetic' ? 'border-pink-300' : vibe === 'witty' ? 'border-yellow-300' : vibe === 'philosophical' ? 'border-sky-300' : 'border-fuchsia-300'}
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
                      'bg-purple-500/15 border-purple-300/60 shadow-purple-500/20'}
                  `}
                >
                  {/* Glowing core sphere */}
                  <div className={`absolute inset-2.5 rounded-full opacity-80 flex items-center justify-center animate-pulse
                    ${vibe === 'empathetic' ? 'bg-rose-400 shadow-lg shadow-rose-400/50' : 
                      vibe === 'witty' ? 'bg-amber-400 shadow-lg shadow-amber-400/50' : 
                      vibe === 'philosophical' ? 'bg-indigo-400 shadow-lg shadow-indigo-400/50' : 
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
                  ${vibe === 'empathetic' ? 'text-rose-300' : vibe === 'witty' ? 'text-amber-300' : vibe === 'philosophical' ? 'text-indigo-300' : 'text-purple-300'}
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
                  ${vibe === 'empathetic' ? 'bg-gradient-to-tr from-rose-500 to-pink-550' : vibe === 'witty' ? 'bg-gradient-to-tr from-amber-300 to-yellow-500' : vibe === 'philosophical' ? 'bg-gradient-to-tr from-indigo-400 to-sky-500' : 'bg-gradient-to-tr from-purple-400 to-fuchsia-500'}
                  ${isSpeaking ? 'scale-150 opacity-60' : isThinking ? 'scale-125 opacity-30 animate-pulse' : isRecording ? 'scale-140 opacity-55' : 'scale-100 opacity-20'}
                `} />

                {/* Rotating orbital coordinate rings */}
                <div className={`absolute inset-0 rounded-full border border-dashed animate-spin-slow opacity-30
                  ${vibe === 'empathetic' ? 'border-rose-455' : vibe === 'witty' ? 'border-amber-455' : vibe === 'philosophical' ? 'border-indigo-455' : 'border-purple-455'}
                `} />
                <div className={`absolute inset-4 rounded-full border border-dotted animate-spin-reverse opacity-20
                  ${vibe === 'empathetic' ? 'border-pink-300' : vibe === 'witty' ? 'border-yellow-300' : vibe === 'philosophical' ? 'border-sky-300' : 'border-fuchsia-300'}
                `} />

                {/* Avatar Core Frame */}
                <div className={`w-36 h-36 rounded-full border overflow-hidden flex items-center justify-center transition-all duration-500 z-10 bg-white relative ring-8 ring-offset-4 ring-offset-stone-950
                  ${vibe === 'empathetic' ? 'border-rose-300 ring-rose-500/20' : 
                    vibe === 'witty' ? 'border-amber-300 ring-amber-500/20' : 
                    vibe === 'philosophical' ? 'border-indigo-300 ring-indigo-500/20' : 
                    'border-purple-300 ring-purple-500/20'}
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
                      ${vibe === 'empathetic' ? 'bg-rose-400' : vibe === 'witty' ? 'bg-amber-400' : vibe === 'philosophical' ? 'bg-indigo-400' : 'bg-purple-400'}
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

      {/* Invisible HTML5 Audio */}
      <audio className="hidden" ref={audioRef} />
    </div>
  );
}
