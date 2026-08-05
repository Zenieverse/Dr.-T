import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Key, Heart, Sparkles, RotateCcw, Gift } from 'lucide-react';

interface CelebrationParticle {
  id: number;
  content: string;
  x: number;
  y: number;
  rotate: number;
  scale: number;
  color: string;
  tx: number;
  ty: number;
  duration: number;
}

interface BirthdayCelebratorProps {
  textSize?: string;
  isCompact?: boolean;
}

const PARTICLE_EMOJIS = ['🎈', '🎉', '🎂', '🎁', '✨', '🍬', '🧁', '🌟', '🥳', '🌸', '⚡️', '🔥'];
const CONFETTI_COLORS = [
  'text-pink-500', 'text-purple-500', 'text-indigo-500', 'text-teal-400', 
  'text-yellow-400', 'text-rose-500', 'text-sky-400', 'text-emerald-400'
];

export function BirthdayCelebrator({ textSize = 'text-[10px]', isCompact = false }: BirthdayCelebratorProps) {
  const [particles, setParticles] = useState<CelebrationParticle[]>([]);
  const idCounter = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Trigger a celebration burst of particles
  const triggerBurst = (count = 16) => {
    const newParticles: CelebrationParticle[] = [];
    const now = Date.now();

    for (let i = 0; i < count; i++) {
      const id = idCounter.current++;
      // Randomly choose an emoji or a colored dot/star
      const isEmoji = Math.random() > 0.4;
      const content = isEmoji 
        ? PARTICLE_EMOJIS[Math.floor(Math.random() * PARTICLE_EMOJIS.length)]
        : '✦';

      // Angle and distance for radial burst
      const angle = Math.random() * Math.PI * 2;
      const distance = 40 + Math.random() * 80;
      
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance - 30; // Tendency to pop upwards moderately

      const colors = [
        '#ec4899', '#a855f7', '#6366f1', '#14b8a6', '#eab308', 
        '#f43f5e', '#38bdf8', '#10b981', '#f97316'
      ];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      newParticles.push({
        id,
        content,
        x: (Math.random() - 0.5) * 40, // start near the click center
        y: (Math.random() - 0.5) * 10,
        rotate: (Math.random() - 0.5) * 180,
        scale: 0.6 + Math.random() * 0.8,
        color: randomColor,
        tx,
        ty,
        duration: 0.8 + Math.random() * 0.7,
      });
    }

    setParticles((prev) => [...prev, ...newParticles]);
  };

  // Periodically emit ambient floating particles
  useEffect(() => {
    const ambientInterval = setInterval(() => {
      // Only emit ambient if page is active
      if (document.hidden) return;
      
      const id = idCounter.current++;
      const id2 = idCounter.current++;
      const startX = (Math.random() - 0.5) * 110;
      
      const randomEmoji = PARTICLE_EMOJIS[Math.floor(Math.random() * PARTICLE_EMOJIS.length)];
      const randomSparkle = '✦';
      
      const themeColors = ['#f472b6', '#c084fc', '#818cf8', '#2dd4bf', '#fbbf24'];

      const newAmbient: CelebrationParticle[] = [
        {
          id,
          content: randomEmoji,
          x: startX,
          y: 6,
          tx: startX + (Math.random() - 0.5) * 40,
          ty: -60 - Math.random() * 50,
          rotate: (Math.random() - 0.5) * 90,
          scale: 0.7 + Math.random() * 0.5,
          color: themeColors[Math.floor(Math.random() * themeColors.length)],
          duration: 2.0 + Math.random() * 1.5,
        },
        {
          id: id2,
          content: randomSparkle,
          x: startX * -0.8,
          y: 4,
          tx: (startX * -0.8) + (Math.random() - 0.5) * 30,
          ty: -55 - Math.random() * 45,
          rotate: (Math.random() - 0.5) * 120,
          scale: 0.5 + Math.random() * 0.6,
          color: themeColors[Math.floor(Math.random() * themeColors.length)],
          duration: 1.8 + Math.random() * 1.2,
        }
      ];

      setParticles((prev) => [...prev, ...newAmbient]);
    }, 1200);

    // Initial burst on mount
    const timeout = setTimeout(() => triggerBurst(12), 400);

    return () => {
      clearInterval(ambientInterval);
      clearTimeout(timeout);
    };
  }, []);

  // Filter out expired particles to keep DOM clean
  useEffect(() => {
    if (particles.length > 50) {
      // Clear out particles that should have already finished their transitions
      setParticles((prev) => prev.slice(-30));
    }
  }, [particles]);

  const rawText = "Everyday is a Birthday to Dr. T - Many Happy Returns! Version 29370";

  // Blindbox prizes data
  const BLIND_BOX_PRIZES = [
    {
      id: 'worthwhile-wait',
      name: "First 'Date' & Worthwhile Wait",
      emoji: "💝",
      description: `🩺 Big egos? 🏥 Go check out any health institution: The waits ⏳, the secrets 🤫, the taboos 🚫, ... all crushed 💥 @ first sight 👀, my 1st "date" 🗓️ with my Dr. 5.30pm - 7.50pm (listening to music 🎵 while ...) was the wait, worthwhile 💎, luckily. 🌟

The prizes are: 🎁
💖 You get cured & healed,
⏰ You get a mega wake-up Call,
✍️ You might become a Poet,
🍃 and become a Last Leaf,
🌱 and become a Last Leaves Creator, ...`,
      color: "from-rose-500 via-pink-500 to-amber-500 animate-pulse",
      rarity: "MYTHIC"
    },
    {
      id: 'middle-agers-wakeup',
      name: "Middle-Agers Wake-up Call",
      emoji: "🍼",
      description: `🍼 Middle-Agers, imagine you are:
• On Diapers 24/7 👶
• Drinking elderly milk brand 🥛
• Doing daily Taichi 🧘‍♂️
• ...And best part: Born in year 48! 🗓️

🚨 An absolute wake-up call! 🚨

💡 Take-away: Love your Drs more! 💖
💋 Muach U Dr., ...`,
      color: "from-indigo-500 via-rose-500 to-amber-400 animate-pulse",
      rarity: "MYTHIC"
    },
    {
      id: 'socratic-tlc',
      name: "Community TLC Poll",
      emoji: "🧠",
      description: `How to return Dr. T's TLC towards the communities?

 a. Taking care of her till the rest of one's life; And whose life is it? among all the a b c, e, n, i, v, r, z, s, ...?'
b.. Or 'I got your back!"
c. Dr. T names it ... 
d. All of the above`,
      color: "from-rose-500 via-pink-500 to-amber-500",
      rarity: "LEGENDARY"
    },
    {
      id: 'great-hearts',
      name: "Sage 🌿",
      emoji: "🌿",
      description: `Across domains I have met
Great Hearts and Minds in blessed blends
Blue bloods running through kind acts
Gold ‘Grays’ wide map Vinci clans
Some’s veins must be ‘out of verse’
Pump up fine lines of best pens!
🌿`,
      color: "from-pink-500 via-purple-500 to-rose-500",
      rarity: "LEGENDARY"
    },
    {
      id: 'love-it-ecode',
      name: "E-Code Dance 🧬🏥",
      emoji: "🧬",
      description: `🩺 Love it so dear E-Code Dance’ 🩹
🏥 On line some Fates facing, Bam! 💥
🏎️ Racing for Life, all show up 🏃‍♀️
❤️ Win back one’s Time from Hades’ plans ⏳
✨ Wonders, Last Leaves, Miracles, ...? 🌿
🌟 Vested in here, Bold-Sage Land! 🧬`,
      color: "from-amber-500 via-orange-600 to-yellow-500",
      rarity: "LEGACY"
    },
    {
      id: 'many-happy-returns',
      name: "Celebrations",
      emoji: "💝",
      description: `Whose cries so crystal clear?
Three worlds all bless 'Happy, Whole Years!
Making your mark soon, Dear
Wow worlds with Heart, Found worlds with Mind
Cheers on your paths go wild
Wishing you Best running your ways 
Till time finds it 'assez'
Toujours, J'attends, Bonjour! Ca va?`,
      color: "from-rose-500 via-pink-500 to-purple-600 animate-pulse",
      rarity: "MYTHIC"
    },
    {
      id: 'socratic-hug',
      name: "Eternal Socratic Hug",
      emoji: "💖",
      description: "Wraps you in maternal comfort. Restores 100% debugging energy and infinite peace.",
      color: "from-rose-400 to-pink-500",
      rarity: "LEGENDARY"
    },
    {
      id: 'strawberry-cake',
      name: "Cosmic Strawberry Cake",
      emoji: "🍰",
      description: "Infused with quantum sugar. Grants +50% coding speed and sweet, comforting focus.",
      color: "from-pink-400 to-rose-500",
      rarity: "EPIC"
    },
    {
      id: 'snomed-candy',
      name: "SNOMED-Indexed Sugar Candy",
      emoji: "🍬",
      description: "Clinically certified by Dr. T to instantly relieve high-adrenaline development fatigue.",
      color: "from-teal-400 to-emerald-500",
      rarity: "COMMON"
    },
    {
      id: 'helium-balloon',
      name: "Quantum Helium Balloon",
      emoji: "🎈",
      description: "Floats upwards carrying all your deployment stress away into the cloud space.",
      color: "from-red-400 to-rose-500",
      rarity: "RARE"
    },
    {
      id: 'secret-passcode',
      name: "Dr. T's Secret Passcode",
      emoji: "🔑",
      description: "A golden master credential granting entry to the most exclusive Socratic inner chambers.",
      color: "from-amber-400 to-orange-500",
      rarity: "MYTHIC"
    },
    {
      id: 'aura-sparkler',
      name: "Cosmic Aura Sparkler",
      emoji: "🌟",
      description: "Enshrouds your profile in a sparkling, radiant halo of pure positivity and grace.",
      color: "from-yellow-300 to-amber-500",
      rarity: "EPIC"
    },
    {
      id: 'just4laughs',
      name: "Just4laughs",
      emoji: "😂",
      description: `A man walks into a pharmacy and asks an assistant if she can give him something for the hiccups.
The Assistant promptly reaches out and slaps the mans face.
"What did you do that for?" the man asks.
"Well, you don't have the hiccups anymore do you?" says the assistant.
The man replies "No, but my wife does, and she's outside in the car."`,
      color: "from-yellow-400 via-orange-500 to-red-500",
      rarity: "EPIC"
    },
    {
      id: 'just4laughs-family',
      name: "Just4laughs",
      emoji: "😂",
      description: `A child asked his father, "How were people born?" So his father said, "Adam and Eve made babies, then their babies became adults and made babies, and so on."

The child then went to his mother, asked her the same question and she told him, "We were monkeys, then we evolved to become like we are now."

The child ran back to his father and said, "You lied to me!"
His father replied, "No, your mom was talking about her side of the family."`,
      color: "from-yellow-400 via-orange-500 to-red-500",
      rarity: "EPIC"
    },
    {
      id: 'just4laughs-mistakes',
      name: "Just4laughs",
      emoji: "😂",
      description: `I told my wife she should embrace her mistakes.
She gave me a hug.`,
      color: "from-yellow-400 via-orange-500 to-red-500",
      rarity: "EPIC"
    },
    {
      id: 'just4laughs-workout',
      name: "Just4laughs",
      emoji: "😂",
      description: `I told my watch I was going for a work-out.
It replied,
"Great! I'll start looking for nearby ambulances."`,
      color: "from-yellow-400 via-orange-500 to-red-500",
      rarity: "EPIC"
    },
    {
      id: 'just4laughs-taichi',
      name: "Just4laughs",
      emoji: "😂",
      description: `I do Taichi daily. I am normally a low BP type once I did Taichi to the master on video, I had a high BP. It turned out that the speech speed was set double, ...

An Ouch! feeling just like when my Dr. renewed my Birth Cert, ...`,
      color: "from-yellow-400 via-orange-500 to-red-500",
      rarity: "EPIC"
    }
  ];

  // Blindbox states
  const [isUnboxing, setIsUnboxing] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [unboxedItem, setUnboxedItem] = useState<typeof BLIND_BOX_PRIZES[0] | null>(null);
  const [keyPhase, setKeyPhase] = useState<'idle' | 'inserting' | 'turning' | 'bursting'>('idle');
  const [balloons, setBalloons] = useState<{
    id: number;
    x: number;
    size: number;
    delay: number;
    duration: number;
    color: string;
    rotate: number;
  }[]>([]);

  // Poll States
  const [votedOption, setVotedOption] = useState<string | null>(() => {
    return localStorage.getItem('socratic_poll_vote');
  });

  const [customText, setCustomText] = useState(() => {
    return localStorage.getItem('socratic_poll_custom_text') || '';
  });

  const [pollVotes, setPollVotes] = useState<{ [key: string]: number }>(() => {
    const saved = localStorage.getItem('socratic_poll_votes_count');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return { a: 45, b: 32, c: 18, d: 55 };
  });

  const handleVote = (optionKey: string) => {
    const prevVote = votedOption;
    if (prevVote === optionKey) return;

    setPollVotes(prev => {
      const updated = { ...prev };
      if (prevVote) {
        updated[prevVote] = Math.max(0, updated[prevVote] - 1);
      }
      updated[optionKey] = (updated[optionKey] || 0) + 1;
      localStorage.setItem('socratic_poll_votes_count', JSON.stringify(updated));
      return updated;
    });

    setVotedOption(optionKey);
    localStorage.setItem('socratic_poll_vote', optionKey);
  };

  const handleCustomTextChange = (val: string) => {
    setCustomText(val);
    localStorage.setItem('socratic_poll_custom_text', val);
  };

  const [customTextList, setCustomTextList] = useState<string[]>(() => {
    const saved = localStorage.getItem('socratic_poll_c_list');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      "d & beyond, as I am super simple, modest, and humble, ...",
      "Community Happiness",
      "Shared Progress"
    ];
  });

  const addCustomTextToList = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (customTextList.includes(trimmed)) return;
    const newList = [...customTextList, trimmed];
    setCustomTextList(newList);
    localStorage.setItem('socratic_poll_c_list', JSON.stringify(newList));
    setCustomText('');
    localStorage.removeItem('socratic_poll_custom_text');
    handleVote('c');
  };

  const getOptionPercentage = (optionKey: string) => {
    const values = Object.values(pollVotes) as number[];
    const total = values.reduce((sum: number, val: number) => sum + val, 0);
    if (total === 0) return 0;
    const votesForOption = (pollVotes[optionKey] as number) || 0;
    return Math.round((votesForOption / total) * 100);
  };

  const startUnboxing = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUnboxing || isOpened) return;

    setIsUnboxing(true);
    setKeyPhase('inserting');

    // Phase 1: Key moves to keyhole (600ms)
    setTimeout(() => {
      setKeyPhase('turning');

      // Phase 2: Key rotates/unlocks (500ms)
      setTimeout(() => {
        setKeyPhase('bursting');
        triggerBurst(22); // extra particle burst

        // Generate flying heart balloons
        const balloonColors = [
          '#ec4899', // pink-500
          '#f43f5e', // rose-500
          '#df73ff', // light magenta/violet
          '#ff4fa8', // hot pink
          '#db2777', // pink-600
        ];
        const newBalloons = Array.from({ length: 12 }).map((_, i) => ({
          id: idCounter.current++,
          x: (Math.random() - 0.5) * 60, // random start offset left/right
          size: 14 + Math.random() * 20, // size in px
          delay: Math.random() * 0.4, // staggered launch
          duration: 2.5 + Math.random() * 2.0, // seconds to float up
          color: balloonColors[Math.floor(Math.random() * balloonColors.length)],
          rotate: (Math.random() - 0.5) * 40, // slight tilt
        }));
        setBalloons(newBalloons);

        const randomPrize = BLIND_BOX_PRIZES[Math.floor(Math.random() * BLIND_BOX_PRIZES.length)];
        setUnboxedItem(randomPrize);
        setIsOpened(true);
        setIsUnboxing(false);
        setKeyPhase('idle');
      }, 500);
    }, 600);
  };

  const resetBlindBox = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpened(false);
    setUnboxedItem(null);
    setKeyPhase('idle');
    setBalloons([]);
  };

  return (
    <div className="relative inline-flex flex-wrap md:flex-nowrap items-center justify-center gap-3 py-1">
      {/* Birthday Badge Wrapper */}
      <div 
        ref={containerRef}
        className="relative inline-flex items-center justify-center cursor-pointer"
        onMouseEnter={() => triggerBurst(6)}
        onClick={() => triggerBurst(15)}
      >
        {/* Background celebration glow ring */}
        <div className="absolute inset-x-0 inset-y-0.5 rounded-full bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Floating Particle Stage */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-visible">
          <AnimatePresence>
            {particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ x: p.x, y: p.y, opacity: 0, scale: 0.2, rotate: 0 }}
                animate={{ 
                  x: p.tx, 
                  y: p.ty, 
                  opacity: [0, 1, 0.9, 0], 
                  scale: [0.2, p.scale, p.scale * 1.1, 0],
                  rotate: p.rotate 
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: p.duration, ease: "easeOut" }}
                className="absolute text-center select-none pointer-events-none font-bold"
                style={{ 
                  color: p.content === '✦' ? p.color : undefined,
                  fontSize: p.content === '✦' ? '14px' : '12px',
                  zIndex: 30,
                  textShadow: p.content === '✦' ? `0 0 5px ${p.color}` : 'none'
                }}
              >
                {p.content}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Interactive Birthday Badge */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-pink-500/15 via-purple-500/15 to-indigo-500/15 border border-pink-300/50 shadow-[0_0_15px_rgba(236,72,153,0.22)] cursor-pointer select-none transition-all duration-300 group overflow-hidden"
        >
          {/* Animated slide sparkle highlight inside badge */}
          <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
          
          {/* Left Interactive Popper emoji */}
          <span className="text-[11px] animate-[bounce_1.5s_infinite] inline-block origin-bottom filter drop-shadow">
            🎉
          </span>

          {/* Text Container */}
          <span className={`${textSize} font-extrabold tracking-wider uppercase bg-gradient-to-r from-pink-500 via-purple-400 via-indigo-500 via-teal-500 via-yellow-500 via-orange-500 to-pink-500 bg-[length:250%_auto] bg-clip-text text-transparent animate-text-gradient inline-flex items-center`}>
            <span className="hidden sm:inline-block mr-1">✨</span>
            {rawText}
            <span className="hidden sm:inline-block ml-1">✨</span>
          </span>

          {/* Right Cake emoji */}
          <span className="text-[11px] animate-[bounce_1.8s_infinite] inline-block origin-bottom filter drop-shadow">
            🎂
          </span>
        </motion.div>
      </div>

      {/* Gift Box Blindbox */}
      <div 
        className="relative inline-flex items-center gap-2 px-3 py-1 bg-white/85 dark:bg-stone-900/85 backdrop-blur-md border border-rose-200/80 dark:border-rose-950/50 rounded-full shadow-[0_4px_16px_rgba(244,63,94,0.12)] select-none z-40"
        onClick={(e) => e.stopPropagation()}
        id="heart-blindbox-container"
      >
        {/* Flying Heart-Shaped Balloons Animation */}
        <AnimatePresence>
          {balloons.map((b) => (
            <motion.div
              key={b.id}
              initial={{ y: 0, x: 0, opacity: 0, scale: 0.2, rotate: b.rotate }}
              animate={{
                y: -180 - Math.random() * 120,
                x: b.x,
                opacity: [0, 1, 1, 0],
                scale: [0.2, 1, 1.1, 0.9],
                rotate: b.rotate + (Math.random() - 0.5) * 40
              }}
              exit={{ opacity: 0 }}
              transition={{
                delay: b.delay,
                duration: b.duration,
                ease: "easeOut"
              }}
              className="absolute pointer-events-none select-none z-50 flex flex-col items-center"
              style={{ bottom: '100%', left: '50%' }}
            >
              {/* Heart SVG Shape representing a balloon */}
              <svg
                width={b.size}
                height={b.size}
                viewBox="0 0 24 24"
                fill={b.color}
                className="filter drop-shadow-[0_2px_5px_rgba(244,63,94,0.4)]"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              {/* Thin balloon string */}
              <div className="w-[1px] h-6 bg-rose-300/40 dark:bg-rose-700/40" />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Present Box Slot */}
        <div className="relative w-8 h-8 flex items-center justify-center">
          {/* Pulsing & Shaking Present Box */}
          {!isOpened ? (
            <motion.div
              animate={isUnboxing ? {
                scale: [1, 1.25, 0.95, 1.2, 1],
                rotate: [0, -15, 15, -15, 15, 0],
                x: [0, -2, 2, -2, 2, 0],
              } : {
                scale: [1, 1.08, 1],
              }}
              transition={isUnboxing ? {
                duration: 1.1,
                ease: "easeInOut",
              } : {
                repeat: Infinity,
                duration: 1.6,
                ease: "easeInOut"
              }}
              whileHover={{ scale: 1.2 }}
              onClick={startUnboxing}
              className="relative cursor-pointer flex items-center justify-center"
              title="Unlock present box with the key!"
            >
              {/* Semi-transparent Present outline */}
              <Gift className="w-8 h-8 text-rose-400 dark:text-rose-600/50 fill-none stroke-[1.5]" />
              
              {/* Inner Pumping Heart */}
              <motion.div
                animate={{
                  scale: [1, 1.25, 1, 1.25, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.8,
                  ease: "easeInOut"
                }}
                className="absolute flex items-center justify-center -mt-0.5"
              >
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500 filter drop-shadow-[0_2px_4px_rgba(244,63,94,0.4)]" />
              </motion.div>
              
              {/* Inner Keyhole Detail */}
              <div className="absolute w-1.5 h-2.5 bg-stone-950 dark:bg-black rounded-full top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-85 shadow-[inset_0_1px_1px_rgba(0,0,0,0.5)] flex flex-col items-center z-10">
                <div className="w-[1px] h-1.5 bg-rose-300/30 rounded-full mt-0.5" />
              </div>
            </motion.div>
          ) : (
            /* Opened present state */
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              className="relative cursor-pointer"
              onClick={resetBlindBox}
              title="Reset blindbox!"
            >
              {(unboxedItem?.id === 'worthwhile-wait' || unboxedItem?.id === 'middle-agers-wakeup' || unboxedItem?.id === 'socratic-tlc' || unboxedItem?.id === 'great-hearts' || unboxedItem?.id === 'love-it-ecode' || unboxedItem?.id === 'many-happy-returns') ? (
                <div className="relative w-8 h-8 flex items-center justify-center">
                  {/* Glowing & Pulsing Heart Outer Glow */}
                  <div className="absolute inset-0 bg-rose-500/20 rounded-full animate-ping pointer-events-none" />
                  {/* Beautiful Heart Shape SVG acting as the container */}
                  <svg
                    viewBox="0 0 24 24"
                    className="w-7 h-7 text-rose-500 fill-rose-500 dark:text-rose-600 dark:fill-rose-600 drop-shadow-[0_2px_8px_rgba(244,63,94,0.5)] animate-[pulse_1.2s_infinite]"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>
              ) : (
                <Gift className="w-6 h-6 text-amber-500 fill-amber-500/10 opacity-30 scale-75" />
              )}
              <div className="absolute inset-0 flex items-center justify-center text-lg filter drop-shadow">
                {(unboxedItem?.id === 'worthwhile-wait' || unboxedItem?.id === 'middle-agers-wakeup' || unboxedItem?.id === 'socratic-tlc' || unboxedItem?.id === 'great-hearts' || unboxedItem?.id === 'love-it-ecode') ? (
                  <span className="text-[11px] -mt-0.5">{unboxedItem.emoji}</span>
                ) : (
                  unboxedItem?.emoji || "🎁"
                )}
              </div>
            </motion.div>
          )}

          {/* Animated Key Insertion Action */}
          {keyPhase !== 'idle' && (
            <motion.div
              initial={{ x: 20, y: -2, opacity: 0, rotate: -30 }}
              animate={
                keyPhase === 'inserting' ? { x: 0, y: 0, opacity: 1, rotate: 0 } :
                keyPhase === 'turning' ? { x: 0, y: 0, opacity: 1, rotate: 90 } :
                { x: 0, y: -8, opacity: 0, scale: 0.5 }
              }
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute z-30 pointer-events-none"
            >
              <Key className="w-3.5 h-3.5 text-amber-500 filter drop-shadow" />
            </motion.div>
          )}
        </div>

        {/* Small Action Button */}
        {!isOpened ? (
          <button
            onClick={startUnboxing}
            disabled={isUnboxing}
            className="px-2.5 py-0.5 rounded-full bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/60 text-rose-600 dark:text-rose-300 text-[9px] font-bold uppercase transition-all tracking-wider flex items-center gap-1 border border-rose-200/50 dark:border-rose-900/30 active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Key className="w-2.5 h-2.5 text-amber-500" />
            {isUnboxing ? "Unboxing..." : "Unbox Me"}
          </button>
        ) : (
          <button
            onClick={resetBlindBox}
            className="px-2 py-0.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-[9px] font-bold uppercase transition-all tracking-wider flex items-center gap-1 active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            Box Up
          </button>
        )}

        {/* Prize Reveal Modal Popover */}
        <AnimatePresence>
          {isOpened && unboxedItem && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className={`absolute bottom-11 right-1/2 translate-x-1/2 md:translate-x-0 md:right-0 z-50 p-4 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-rose-200 dark:border-rose-950/60 rounded-2xl shadow-[0_12px_32px_rgba(244,63,94,0.18)] flex flex-col items-center text-center transition-all duration-300 ${
                unboxedItem.id === 'worthwhile-wait' || unboxedItem.id === 'middle-agers-wakeup' || unboxedItem.id === 'socratic-tlc' || unboxedItem.id === 'many-happy-returns' ? 'w-[310px] sm:w-[350px]' : 'w-64'
              }`}
            >
              {/* Decorative sparkle background */}
              <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/5 via-purple-500/5 to-transparent rounded-2xl pointer-events-none" />
              <div className="absolute -top-1.5 -right-1.5">
                <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>

              {/* Rarity Tag */}
              <span className={`text-[8px] font-mono font-black px-2 py-0.5 rounded-full mb-2.5 border uppercase tracking-widest ${
                unboxedItem.rarity === 'LEGACY' ? 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-900/40 shadow-[0_0_10px_rgba(245,158,11,0.15)]' :
                unboxedItem.rarity === 'MYTHIC' ? 'bg-amber-100 text-amber-700 border-amber-300/60 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/30' :
                unboxedItem.rarity === 'LEGENDARY' ? 'bg-rose-100 text-rose-700 border-rose-300/60 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/30' :
                unboxedItem.rarity === 'EPIC' ? 'bg-purple-100 text-purple-700 border-purple-300/60 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900/30' :
                unboxedItem.rarity === 'RARE' ? 'bg-sky-100 text-sky-700 border-sky-300/60 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-900/30' :
                'bg-stone-100 text-stone-700 border-stone-300/60 dark:bg-stone-850 dark:text-stone-300 dark:border-stone-800'
              }`}>
                ✦ {unboxedItem.rarity} ✦
              </span>

              {/* Glowing Emoji Reveal Circle / Heart Container */}
              {(unboxedItem.id === 'worthwhile-wait' || unboxedItem.id === 'middle-agers-wakeup' || unboxedItem.id === 'socratic-tlc' || unboxedItem.id === 'great-hearts' || unboxedItem.id === 'love-it-ecode' || unboxedItem.id === 'many-happy-returns') ? (
                <div className="relative w-20 h-20 flex items-center justify-center mb-2.5">
                  {/* Outer pulsating heart glow */}
                  <div className="absolute inset-0 bg-rose-500/10 animate-ping pointer-events-none rounded-full" />
                  {/* Beautiful Heart Shape SVG acting as the container */}
                  <svg
                    viewBox="0 0 24 24"
                    className="absolute inset-0 w-full h-full text-rose-500 fill-rose-500 dark:text-rose-600 dark:fill-rose-600 drop-shadow-[0_4px_12px_rgba(244,63,94,0.6)] animate-pulse"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  {/* Inside highlight */}
                  <svg
                    viewBox="0 0 24 24"
                    className="absolute inset-2 w-16 h-16 text-pink-400/30 fill-pink-400/30 dark:text-pink-300/25 dark:fill-pink-300/25 filter blur-[1px]"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <motion.div
                    initial={{ scale: 0.5, rotate: -45 }}
                    animate={{ scale: 1.15, rotate: 0 }}
                    transition={{
                      scale: { type: "spring", damping: 15, stiffness: 300, delay: 0.1 },
                      rotate: { type: "spring", damping: 12, stiffness: 200, delay: 0.1 }
                    }}
                    className="relative text-3xl filter drop-shadow-sm select-none z-10 -mt-1"
                  >
                    {unboxedItem.emoji}
                  </motion.div>
                </div>
              ) : (
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-rose-100 to-pink-50 dark:from-stone-800 dark:to-stone-850 flex items-center justify-center mb-2.5 shadow-inner border border-rose-200/40 dark:border-stone-750">
                  <div className="absolute inset-0 bg-pink-400/10 rounded-full animate-ping pointer-events-none" />
                  <motion.div
                    initial={{ scale: 0.5, rotate: -45 }}
                    animate={{ scale: 1.1, rotate: 0 }}
                    transition={{
                      scale: { type: "spring", damping: 15, stiffness: 300, delay: 0.1 },
                      rotate: { type: "spring", damping: 12, stiffness: 200, delay: 0.1 }
                    }}
                    className="text-4xl filter drop-shadow-sm select-none"
                  >
                    {unboxedItem.emoji}
                  </motion.div>
                </div>
              )}

              {/* Prize Name */}
              <h4 className="text-xs font-black text-stone-800 dark:text-stone-100 mb-1 leading-snug">
                {unboxedItem.name}
              </h4>

              {/* Prize Description */}
              {unboxedItem.id === 'socratic-tlc' ? (
                <div className="w-full text-left my-2 px-1">
                  <p className="text-[10px] font-semibold text-stone-700 dark:text-stone-300 mb-2.5">
                    How to return Dr. T's TLC towards the communities?
                  </p>
                  
                  <div className="space-y-2">
                    {/* Option A */}
                    <button
                      onClick={() => handleVote('a')}
                      className={`w-full text-left p-2 rounded-xl border transition-all duration-200 relative overflow-hidden active:scale-[0.98] ${
                        votedOption === 'a'
                          ? 'bg-rose-500/10 border-rose-400/80 dark:bg-rose-500/15 dark:border-rose-500/70'
                          : 'bg-stone-50/50 hover:bg-stone-50 border-stone-200/60 dark:bg-stone-850/50 dark:hover:bg-stone-850 dark:border-stone-800'
                      }`}
                    >
                      {/* Progress bar background */}
                      <div 
                        className="absolute inset-y-0 left-0 bg-rose-500/10 transition-all duration-500 ease-out pointer-events-none" 
                        style={{ width: `${getOptionPercentage('a')}%` }}
                      />
                      
                      <div className="relative z-10 flex items-start gap-2">
                        <span className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                          votedOption === 'a' ? 'bg-rose-500 text-white shadow-sm' : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-400'
                        }`}>
                          a
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-stone-600 dark:text-stone-300 leading-tight">
                            Taking care of her till the rest of one's life; And whose life is it? among all the a, b, c, e, n, i, v, r, z, s, ...?
                          </p>
                          {votedOption && (
                            <div className="flex items-center justify-between mt-1 text-[9px] font-medium">
                              <span className="text-rose-500 font-bold">{getOptionPercentage('a')}%</span>
                              <span className="text-stone-400">{pollVotes.a} votes</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Option B */}
                    <button
                      onClick={() => handleVote('b')}
                      className={`w-full text-left p-2 rounded-xl border transition-all duration-200 relative overflow-hidden active:scale-[0.98] ${
                        votedOption === 'b'
                          ? 'bg-rose-500/10 border-rose-400/80 dark:bg-rose-500/15 dark:border-rose-500/70'
                          : 'bg-stone-50/50 hover:bg-stone-50 border-stone-200/60 dark:bg-stone-850/50 dark:hover:bg-stone-850 dark:border-stone-800'
                      }`}
                    >
                      {/* Progress bar background */}
                      <div 
                        className="absolute inset-y-0 left-0 bg-rose-500/10 transition-all duration-500 ease-out pointer-events-none" 
                        style={{ width: `${getOptionPercentage('b')}%` }}
                      />
                      
                      <div className="relative z-10 flex items-start gap-2">
                        <span className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                          votedOption === 'b' ? 'bg-rose-500 text-white shadow-sm' : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-400'
                        }`}>
                          b
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-stone-600 dark:text-stone-300 leading-tight">
                            Or "I got your back!"
                          </p>
                          {votedOption && (
                            <div className="flex items-center justify-between mt-1 text-[9px] font-medium">
                              <span className="text-rose-500 font-bold">{getOptionPercentage('b')}%</span>
                              <span className="text-stone-400">{pollVotes.b} votes</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Option C */}
                    <button
                      onClick={() => handleVote('c')}
                      className={`w-full text-left p-2 rounded-xl border transition-all duration-200 relative overflow-hidden active:scale-[0.98] ${
                        votedOption === 'c'
                          ? 'bg-rose-500/10 border-rose-400/80 dark:bg-rose-500/15 dark:border-rose-500/70'
                          : 'bg-stone-50/50 hover:bg-stone-50 border-stone-200/60 dark:bg-stone-850/50 dark:hover:bg-stone-850 dark:border-stone-800'
                      }`}
                    >
                      {/* Progress bar background */}
                      <div 
                        className="absolute inset-y-0 left-0 bg-rose-500/10 transition-all duration-500 ease-out pointer-events-none" 
                        style={{ width: `${getOptionPercentage('c')}%` }}
                      />
                      
                      <div className="relative z-10 flex items-start gap-2">
                        <span className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                          votedOption === 'c' ? 'bg-rose-500 text-white shadow-sm' : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-400'
                        }`}>
                          c
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-stone-600 dark:text-stone-300 leading-tight">
                            Dr. T names it ...
                          </p>
                          {votedOption && (
                            <div className="flex items-center justify-between mt-1 text-[9px] font-medium">
                              <span className="text-rose-500 font-bold">{getOptionPercentage('c')}%</span>
                              <span className="text-stone-400">{pollVotes.c} votes</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Option D */}
                    <button
                      onClick={() => handleVote('d')}
                      className={`w-full text-left p-2 rounded-xl border transition-all duration-200 relative overflow-hidden active:scale-[0.98] ${
                        votedOption === 'd'
                          ? 'bg-rose-500/10 border-rose-400/80 dark:bg-rose-500/15 dark:border-rose-500/70'
                          : 'bg-stone-50/50 hover:bg-stone-50 border-stone-200/60 dark:bg-stone-850/50 dark:hover:bg-stone-850 dark:border-stone-800'
                      }`}
                    >
                      {/* Progress bar background */}
                      <div 
                        className="absolute inset-y-0 left-0 bg-rose-500/10 transition-all duration-500 ease-out pointer-events-none" 
                        style={{ width: `${getOptionPercentage('d')}%` }}
                      />
                      
                      <div className="relative z-10 flex items-start gap-2">
                        <span className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                          votedOption === 'd' ? 'bg-rose-500 text-white shadow-sm' : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-400'
                        }`}>
                          d
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-stone-600 dark:text-stone-300 leading-tight">
                            All of the above
                          </p>
                          {votedOption && (
                            <div className="flex items-center justify-between mt-1 text-[9px] font-medium">
                              <span className="text-rose-500 font-bold">{getOptionPercentage('d')}%</span>
                              <span className="text-stone-400">{pollVotes.d} votes</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  </div>
                  
                  {votedOption && (
                    <p className="text-center text-[8px] text-stone-400 mt-2.5 animate-pulse">
                      💝 TLC returned! Feel free to adjust your vote anytime.
                    </p>
                  )}
                </div>
              ) : unboxedItem.id === 'many-happy-returns' ? (
                <div className="w-full my-3 px-3.5 py-4 bg-gradient-to-b from-rose-50/40 to-pink-50/20 dark:from-rose-950/10 dark:to-pink-950/5 border border-rose-150/40 dark:border-rose-950/30 rounded-2xl shadow-[inset_0_1px_2px_rgba(244,63,94,0.03)] select-text">
                  <p className="text-[9px] text-rose-500 dark:text-rose-400 font-sans font-extrabold tracking-widest uppercase mb-3 text-center">
                    🎁 Happy Waaah Waaah! 🎁
                  </p>
                  <p className="text-[10px] sm:text-[10.5px] text-stone-700 dark:text-stone-300 font-serif italic leading-relaxed whitespace-pre-line text-center antialiased">
                    {unboxedItem.description}
                  </p>
                </div>
              ) : (
                <p className="text-[10px] text-stone-500 dark:text-stone-400 mb-3.5 leading-relaxed px-1 whitespace-pre-line">
                  {unboxedItem.description}
                </p>
              )}

              {/* Reset Control */}
              <button
                onClick={resetBlindBox}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-xl text-[10px] font-bold tracking-wide uppercase transition-all active:scale-95 cursor-pointer shadow-sm border border-rose-400/50"
              >
                <RotateCcw className="w-3 h-3" /> Box Up & Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
