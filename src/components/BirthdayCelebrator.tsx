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

  const rawText = "Everyday is a Birthday to Dr. T - Many happy returns! Version 29370";

  // Blindbox prizes data
  const BLIND_BOX_PRIZES = [
    {
      id: 'socratic-tlc',
      name: "Socratic Community TLC",
      emoji: "🧠",
      description: "How to return Dr. T's TLC towards the communities? Hm, 'Taking care of her till the rest of one's life? And whose life is it? among all the a b c, e, n, i, v, r, e, z, e, s, e, ...?' Or 'I got your back!'?",
      color: "from-pink-450 via-rose-500 to-purple-600",
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
              <Gift className="w-6 h-6 text-amber-500 fill-amber-500/10 opacity-30 scale-75" />
              <div className="absolute inset-0 flex items-center justify-center text-lg filter drop-shadow">
                {unboxedItem?.emoji || "🎁"}
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
              className="absolute bottom-11 right-1/2 translate-x-1/2 md:translate-x-0 md:right-0 z-50 w-64 p-4 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-rose-200 dark:border-rose-950/60 rounded-2xl shadow-[0_12px_32px_rgba(244,63,94,0.18)] flex flex-col items-center text-center"
            >
              {/* Decorative sparkle background */}
              <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/5 via-purple-500/5 to-transparent rounded-2xl pointer-events-none" />
              <div className="absolute -top-1.5 -right-1.5">
                <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>

              {/* Rarity Tag */}
              <span className={`text-[8px] font-mono font-black px-2 py-0.5 rounded-full mb-2.5 border uppercase tracking-widest ${
                unboxedItem.rarity === 'MYTHIC' ? 'bg-amber-100 text-amber-700 border-amber-300/60 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/30' :
                unboxedItem.rarity === 'LEGENDARY' ? 'bg-rose-100 text-rose-700 border-rose-300/60 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/30' :
                unboxedItem.rarity === 'EPIC' ? 'bg-purple-100 text-purple-700 border-purple-300/60 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900/30' :
                unboxedItem.rarity === 'RARE' ? 'bg-sky-100 text-sky-700 border-sky-300/60 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-900/30' :
                'bg-stone-100 text-stone-700 border-stone-300/60 dark:bg-stone-850 dark:text-stone-300 dark:border-stone-800'
              }`}>
                ✦ {unboxedItem.rarity} ✦
              </span>

              {/* Glowing Emoji Reveal Circle */}
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

              {/* Prize Name */}
              <h4 className="text-xs font-black text-stone-800 dark:text-stone-100 mb-1 leading-snug">
                {unboxedItem.name}
              </h4>

              {/* Prize Description */}
              <p className="text-[10px] text-stone-500 dark:text-stone-400 mb-3.5 leading-relaxed px-1">
                {unboxedItem.description}
              </p>

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
