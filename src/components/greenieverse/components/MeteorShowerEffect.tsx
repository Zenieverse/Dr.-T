import React, { useEffect, useRef, useState } from 'react';

interface Meteor {
  id: number;
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number; // in radians
  opacity: number;
  color: string;
  tailColor: string;
  size: number;
  life: number;
  maxLife: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  life: number;
  maxLife: number;
}

interface Star {
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  blinkSpeed: number;
  color: string;
  phase: number;
}

interface MeteorShowerEffectProps {
  intensity?: 'calm' | 'active' | 'storm';
  isSimulating?: boolean;
  onMeteorShowerBurst?: () => void;
  triggerBurstCount?: number;
}

const PALETTES = [
  { head: '#34d399', tail: 'rgba(52, 211, 153, 0)' }, // Emerald
  { head: '#38bdf8', tail: 'rgba(56, 189, 248, 0)' }, // Cyan
  { head: '#fcd34d', tail: 'rgba(252, 211, 77, 0)' },  // Golden Sol
  { head: '#c084fc', tail: 'rgba(192, 132, 252, 0)' }, // Nebula Purple
  { head: '#f472b6', tail: 'rgba(244, 114, 182, 0)' }, // Rose Supernova
  { head: '#ffffff', tail: 'rgba(255, 255, 255, 0)' }, // Pure Starlight
];

export const MeteorShowerEffect: React.FC<MeteorShowerEffectProps> = ({
  intensity = 'active',
  isSimulating = false,
  triggerBurstCount = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const meteorsRef = useRef<Meteor[]>([]);
  const sparksRef = useRef<Spark[]>([]);
  const starsRef = useRef<Star[]>([]);
  const animFrameIdRef = useRef<number | null>(null);
  const lastSpawnTimeRef = useRef<number>(0);

  // Initialize background starfield
  const initStars = (width: number, height: number) => {
    const starCount = Math.floor((width * height) / 8000);
    const stars: Star[] = [];
    const starColors = ['#e2e8f0', '#94a3b8', '#38bdf8', '#34d399', '#fde047', '#e879f9'];

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.4,
        baseOpacity: Math.random() * 0.6 + 0.2,
        blinkSpeed: Math.random() * 0.04 + 0.01,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        phase: Math.random() * Math.PI * 2,
      });
    }
    starsRef.current = stars;
  };

  // Spawn a meteor
  const spawnMeteor = (width: number, height: number, forceAngle?: number, colorIndex?: number) => {
    const palette = colorIndex !== undefined 
      ? PALETTES[colorIndex % PALETTES.length]
      : PALETTES[Math.floor(Math.random() * PALETTES.length)];

    // Angles: diagonal falling from top-right to bottom-left or top-left to bottom-right
    const angle = forceAngle !== undefined ? forceAngle : (Math.PI / 4) + (Math.random() * 0.35 - 0.17); // ~45 deg
    const speed = (Math.random() * 7 + 9) * (isSimulating ? 1.3 : 1.0);
    const length = Math.random() * 140 + 80;

    // Start from top edge or left/right edge
    const startFromTop = Math.random() > 0.3;
    let startX = 0;
    let startY = 0;

    if (startFromTop) {
      startX = Math.random() * (width * 1.2) - (width * 0.2);
      startY = -30;
    } else {
      startX = -30;
      startY = Math.random() * (height * 0.6);
    }

    const meteor: Meteor = {
      id: Math.random(),
      x: startX,
      y: startY,
      length,
      speed,
      angle,
      opacity: Math.random() * 0.4 + 0.6,
      color: palette.head,
      tailColor: palette.tail,
      size: Math.random() * 2 + 1.5,
      life: 0,
      maxLife: Math.floor(Math.random() * 80 + 70),
    };

    meteorsRef.current.push(meteor);
  };

  // Spawn spark burst when meteor burns or explodes
  const createExplosionSparks = (x: number, y: number, color: string, count = 8) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3.5 + 0.5;
      sparksRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 2 + 1,
        color,
        opacity: 0.9,
        life: 0,
        maxLife: Math.floor(Math.random() * 25 + 15),
      });
    }
  };

  // Trigger burst when prop changes
  useEffect(() => {
    if (triggerBurstCount > 0 && canvasRef.current) {
      const width = canvasRef.current.width;
      const height = canvasRef.current.height;
      for (let i = 0; i < 16; i++) {
        setTimeout(() => {
          spawnMeteor(width, height, undefined, i % PALETTES.length);
        }, i * 75);
      }
    }
  }, [triggerBurstCount]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    initStars(width, height);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Main animation loop
    let lastTime = performance.now();

    const render = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw Starfield with subtle twinkling
      for (let i = 0; i < starsRef.current.length; i++) {
        const star = starsRef.current[i];
        star.phase += star.blinkSpeed;
        const currentOpacity = Math.max(0.1, star.baseOpacity + Math.sin(star.phase) * 0.35);

        ctx.fillStyle = star.color;
        ctx.globalAlpha = currentOpacity;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Spawn Meteors dynamically based on intensity
      const spawnInterval = intensity === 'storm' ? 180 : intensity === 'active' ? (isSimulating ? 380 : 700) : 1800;

      if (time - lastSpawnTimeRef.current > spawnInterval) {
        lastSpawnTimeRef.current = time;
        const count = intensity === 'storm' ? 2 : (Math.random() > 0.4 ? 1 : 0);
        for (let k = 0; k < count; k++) {
          spawnMeteor(width, height);
        }
      }

      // 3. Update and render Meteors
      ctx.globalAlpha = 1.0;
      const activeMeteors: Meteor[] = [];

      for (let i = 0; i < meteorsRef.current.length; i++) {
        const m = meteorsRef.current[i];
        m.life += 1;

        // Move meteor
        const dx = Math.cos(m.angle) * m.speed;
        const dy = Math.sin(m.angle) * m.speed;
        m.x += dx;
        m.y += dy;

        // Fade in & out
        let currentOpacity = m.opacity;
        if (m.life < 15) {
          currentOpacity = (m.life / 15) * m.opacity;
        } else if (m.life > m.maxLife - 20) {
          currentOpacity = ((m.maxLife - m.life) / 20) * m.opacity;
        }

        if (currentOpacity > 0.02 && m.life < m.maxLife && m.x < width + 100 && m.y < height + 100) {
          activeMeteors.push(m);

          // Calculate tail endpoint
          const tailX = m.x - Math.cos(m.angle) * m.length;
          const tailY = m.y - Math.sin(m.angle) * m.length;

          // Linear gradient from head to tail
          const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
          grad.addColorStop(0, m.color);
          grad.addColorStop(0.15, m.color);
          grad.addColorStop(1, m.tailColor);

          ctx.save();
          ctx.strokeStyle = grad;
          ctx.lineWidth = m.size;
          ctx.lineCap = 'round';
          ctx.globalAlpha = Math.max(0, Math.min(1, currentOpacity));

          ctx.beginPath();
          ctx.moveTo(m.x, m.y);
          ctx.lineTo(tailX, tailY);
          ctx.stroke();

          // Luminous glowing head
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.size * 1.4, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = m.color;
          ctx.shadowBlur = 10;
          ctx.fill();

          // Occasional spark trail
          if (Math.random() > 0.55) {
            sparksRef.current.push({
              x: m.x - Math.cos(m.angle) * (Math.random() * 20),
              y: m.y - Math.sin(m.angle) * (Math.random() * 20),
              vx: (Math.random() - 0.5) * 1.5,
              vy: (Math.random() - 0.5) * 1.5,
              size: Math.random() * 1.5 + 0.5,
              color: m.color,
              opacity: 0.8,
              life: 0,
              maxLife: Math.floor(Math.random() * 15 + 8),
            });
          }

          ctx.restore();
        } else {
          // Explode subtle sparks at vanish point
          createExplosionSparks(m.x, m.y, m.color, 5);
        }
      }

      meteorsRef.current = activeMeteors;

      // 4. Update and render Sparks
      const activeSparks: Spark[] = [];
      for (let i = 0; i < sparksRef.current.length; i++) {
        const s = sparksRef.current[i];
        s.life += 1;
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.94;
        s.vy *= 0.94;

        const sparkAlpha = (1 - s.life / s.maxLife) * s.opacity;

        if (s.life < s.maxLife && sparkAlpha > 0.01) {
          activeSparks.push(s);
          ctx.save();
          ctx.globalAlpha = sparkAlpha;
          ctx.fillStyle = s.color;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
      sparksRef.current = activeSparks;

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [intensity, isSimulating]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-85 transition-opacity duration-1000"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
