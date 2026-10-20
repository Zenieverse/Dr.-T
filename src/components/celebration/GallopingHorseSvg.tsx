import React from 'react';

interface GallopingHorseSvgProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  color?: string;
  secondaryColor?: string;
}

export function GallopingHorseSvg({
  className = "w-48 h-32 mx-auto",
  width,
  height,
  color = "#E5B842",
  secondaryColor = "#B8860B"
}: GallopingHorseSvgProps) {
  return (
    <svg 
      viewBox="0 0 700 420" 
      width={width}
      height={height}
      className={className} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Powerful Luminous Gold & Bronze Gradient */}
        <linearGradient id="powerfulHorseGrad" x1="0%" y1="0%" x2="100%" y2="60%">
          <stop offset="0%" stopColor="#FFF2A3" />
          <stop offset="25%" stopColor={color} />
          <stop offset="70%" stopColor={secondaryColor} />
          <stop offset="100%" stopColor="#784506" />
        </linearGradient>

        <linearGradient id="muscleHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFF7CC" stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="0.4" />
        </linearGradient>
      </defs>

      <g transform="translate(190, 115)" stroke="url(#powerfulHorseGrad)" strokeLinecap="round" strokeLinejoin="round">
        
        {/* ======================================================== */}
        {/* VOLUMINOUS, FIERCE FLOWING MANE (Double-Layered Wind-Whip) */}
        {/* ======================================================== */}
        <g strokeWidth="3.2" opacity="0.95">
          {/* Upper Crest & Forelock Wild Strands */}
          <path d="M 140,-55 Q 210,-65 290,-30 M 130,-42 Q 200,-52 305,-15 M 118,-28 Q 192,-38 320,5 M 106,-14 Q 185,-24 335,28" />
          <path d="M 96,0 Q 178,-10 350,52 M 86,14 Q 170,4 360,78 M 76,28 Q 160,18 365,102 M 66,42 Q 150,32 355,125" />
          <path d="M 58,56 Q 140,48 340,146 M 50,70 Q 130,62 320,165 M 44,84 Q 118,78 295,182 M 38,98 Q 105,92 270,196" />
          
          {/* Inner Dense Calligraphic Locks */}
          <path d="M 160,-65 Q 235,-70 310,-35 M 145,-48 Q 220,-55 330,-8 M 130,-32 Q 208,-40 345,18 M 115,-18 Q 195,-25 360,42" />
          <path d="M 102,-2 Q 185,-8 370,68 M 90,12 Q 175,8 375,95 M 78,26 Q 165,22 368,118" />
        </g>

        {/* ======================================================== */}
        {/* PROUD NOBLE HEAD, FLARING NOSTRILS & PRICKED EARS */}
        {/* ======================================================== */}
        <g strokeWidth="2.8" opacity="0.98">
          {/* Bold Upright Stallion Ears */}
          <path d="M 80,-18 L 108,-58 L 115,-52 L 95,-14 Z" strokeWidth="2.5" />
          <path d="M 92,-15 L 120,-52 L 128,-46 L 105,-10 Z" strokeWidth="2.5" />
          <line x1="86" y1="-22" x2="112" y2="-55" strokeWidth="3" />
          <line x1="98" y1="-18" x2="124" y2="-49" strokeWidth="3" />
          
          {/* Strong Skull, Forehead & Temporal Crest */}
          <path d="M 64,-10 Q 48,-24 28,-16" />
          <path d="M 58,4 Q 42,-10 20,-4" />
          <path d="M 52,18 Q 36,4 14,8" />
          <path d="M 45,32 Q 30,18 8,22" />
          
          {/* Roman Nose Bridge & Muscular Facial Ridge */}
          <line x1="28" y1="26" x2="-28" y2="50" strokeWidth="3.2" />
          <line x1="32" y1="34" x2="-22" y2="58" strokeWidth="3" />
          <line x1="30" y1="44" x2="-16" y2="68" strokeWidth="3" />
          <line x1="24" y1="54" x2="-10" y2="78" strokeWidth="3" />
          <line x1="18" y1="64" x2="-2" y2="88" strokeWidth="3" />
          
          {/* Deep Nostril Flare & Strong Muzzle */}
          <path d="M -28,50 Q -38,65 -25,78 Q -10,88 5,94" strokeWidth="3.2" />
          <path d="M 12,74 Q 28,94 48,96" strokeWidth="3" />
          <path d="M 24,82 Q 42,100 65,102" strokeWidth="3.2" />
          {/* Heavy Jaw & Masseter Muscle Contours */}
          <path d="M 42,88 Q 68,106 90,108" strokeWidth="3.4" />
          <path d="M 55,94 Q 82,112 110,112" strokeWidth="3.4" />
        </g>

        {/* ======================================================== */}
        {/* MASSIVE ARCHED NECK & POWERFUL TRACHEAL RIDGE */}
        {/* ======================================================== */}
        <g strokeWidth="3.4" opacity="0.95">
          <line x1="65" y1="102" x2="150" y2="114" />
          <line x1="58" y1="114" x2="168" y2="126" />
          <line x1="52" y1="126" x2="185" y2="138" />
          <line x1="54" y1="138" x2="202" y2="150" />
          <line x1="60" y1="150" x2="220" y2="162" />
          <line x1="70" y1="162" x2="238" y2="174" />
          <line x1="82" y1="174" x2="255" y2="186" />
          <line x1="98" y1="186" x2="272" y2="198" />
          <line x1="115" y1="198" x2="290" y2="210" />
        </g>

        {/* ======================================================== */}
        {/* DYNAMIC LEAPING FORELEGS & POWERFUL HOOVES */}
        {/* ======================================================== */}
        <g strokeWidth="3.2" opacity="0.98">
          {/* Near Foreleg: Tucked High in Powerful Leap */}
          <path d="M 52,135 L 20,165 L 25,215 L 22,260" strokeWidth="3.6" />
          <path d="M 58,140 L 28,170 L 32,218 L 29,262" strokeWidth="3.4" />
          <path d="M 65,146 L 36,175 L 40,222 L 36,265" strokeWidth="3.2" />
          {/* Heavy Solid Hoof with Fetlock Accent */}
          <path d="M 16,260 L 38,265 L 34,278 L 12,274 Z" strokeWidth="3.8" fill="url(#powerfulHorseGrad)" fillOpacity="0.4" />
          
          {/* Off Foreleg: Explosively Thrust Forward Downward */}
          <path d="M -15,116 L -52,122 L -88,116 L -115,108" strokeWidth="3.6" />
          <path d="M -12,125 L -48,131 L -84,125 L -110,117" strokeWidth="3.4" />
          <path d="M -8,134 L -42,140 L -78,134 L -104,126" strokeWidth="3.2" />
          {/* Extended Flying Hoof */}
          <path d="M -118,104 L -100,128 L -112,135 L -128,110 Z" strokeWidth="3.8" fill="url(#powerfulHorseGrad)" fillOpacity="0.4" />
        </g>

        {/* ======================================================== */}
        {/* MUSCULAR BARREL, DEEP WITHERS & HEAVY FLANK STRIATIONS */}
        {/* ======================================================== */}
        <g strokeWidth="3.0" opacity="0.92">
          <line x1="165" y1="128" x2="335" y2="146" />
          <line x1="178" y1="140" x2="360" y2="158" />
          <line x1="195" y1="152" x2="385" y2="170" />
          <line x1="212" y1="164" x2="410" y2="182" />
          <line x1="230" y1="176" x2="432" y2="194" />
          <line x1="250" y1="188" x2="455" y2="206" />
          <line x1="272" y1="200" x2="478" y2="218" />
          <line x1="295" y1="212" x2="500" y2="230" />
          <line x1="318" y1="224" x2="518" y2="242" />
          <line x1="340" y1="236" x2="532" y2="254" />
        </g>

        {/* ======================================================== */}
        {/* MASSIVE CROUP, HINDQUARTERS & STREAMLINED SPEED TAIL */}
        {/* ======================================================== */}
        <g strokeWidth="3.4" opacity="0.95">
          {/* Muscular Curved Croup */}
          <path d="M 385,165 Q 455,172 530,195" strokeWidth="3.8" />
          <path d="M 405,176 Q 475,184 550,208" strokeWidth="3.6" />
          <path d="M 425,188 Q 495,196 568,220" strokeWidth="3.4" />
          <path d="M 445,200 Q 515,208 585,232" strokeWidth="3.2" />

          {/* Sweeping Galloping Heavy Tail with Multilayered Strands */}
          <path d="M 530,195 Q 600,200 680,218 M 535,206 Q 612,212 692,230 M 540,218 Q 624,224 702,244" strokeWidth="3.6" />
          <path d="M 530,230 Q 615,236 690,258 M 518,242 Q 602,248 672,270 M 505,254 Q 588,260 650,282" strokeWidth="3.4" />
          <path d="M 490,266 Q 568,272 628,294 M 475,278 Q 548,284 605,304" strokeWidth="3.0" />
        </g>

        {/* Speed Sparks & Energy Accents */}
        <g strokeWidth="2.0" opacity="0.8" strokeDasharray="4,5">
          <line x1="-50" y1="40" x2="-20" y2="28" />
          <line x1="-70" y1="60" x2="-40" y2="48" />
          <line x1="-25" y1="155" x2="10" y2="168" />
          <line x1="210" y1="250" x2="275" y2="256" />
          <line x1="320" y1="262" x2="390" y2="268" />
          <line x1="550" y1="168" x2="605" y2="162" />
        </g>
      </g>
    </svg>
  );
}
