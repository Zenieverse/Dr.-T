import React from 'react';
import { ArchitecturalPerspective, CampusWeatherTime } from '../types';

interface ArchitecturalCanvasRendererProps {
  perspective: ArchitecturalPerspective;
  lightingTime: CampusWeatherTime;
  className?: string;
}

export const ArchitecturalCanvasRenderer: React.FC<ArchitecturalCanvasRendererProps> = ({
  perspective,
  lightingTime,
  className = ''
}) => {
  // Atmosphere and lighting colors according to selected time of day
  const getAtmosphereGradients = () => {
    switch (lightingTime) {
      case 'dawn':
        return {
          skyGradient: ['#3d2817', '#784824', '#d9822b', '#ffd699'],
          foliageShade: '#1f3822',
          foliageHighlight: '#8cb86d',
          timberTone: '#8b5a2b',
          lightBeam: 'rgba(255, 230, 160, 0.25)',
          mistColor: 'rgba(240, 220, 200, 0.35)',
          lanternGlow: 'rgba(255, 200, 100, 0.4)'
        };
      case 'morning':
        return {
          skyGradient: ['#1e4034', '#3b6e56', '#7bb89a', '#d4ede1'],
          foliageShade: '#183b24',
          foliageHighlight: '#529658',
          timberTone: '#6b4423',
          lightBeam: 'rgba(255, 250, 210, 0.2)',
          mistColor: 'rgba(220, 240, 230, 0.2)',
          lanternGlow: 'rgba(255, 220, 120, 0.2)'
        };
      case 'midday':
        return {
          skyGradient: ['#133e38', '#256d58', '#4ea685', '#bfe7d4'],
          foliageShade: '#12331d',
          foliageHighlight: '#3c854c',
          timberTone: '#5c3a21',
          lightBeam: 'rgba(255, 255, 230, 0.15)',
          mistColor: 'rgba(255, 255, 255, 0.08)',
          lanternGlow: 'rgba(255, 240, 150, 0.1)'
        };
      case 'rain':
      case 'monsoon':
        return {
          skyGradient: ['#15202b', '#243447', '#3c526a', '#6d839c'],
          foliageShade: '#0f241a',
          foliageHighlight: '#29543e',
          timberTone: '#3d2616',
          lightBeam: 'rgba(180, 210, 230, 0.15)',
          mistColor: 'rgba(180, 205, 225, 0.45)',
          lanternGlow: 'rgba(255, 180, 70, 0.7)'
        };
      case 'sunset':
        return {
          skyGradient: ['#2e1526', '#611f32', '#aa382e', '#e6823b'],
          foliageShade: '#1c291e',
          foliageHighlight: '#6e6932',
          timberTone: '#61311b',
          lightBeam: 'rgba(255, 170, 80, 0.3)',
          mistColor: 'rgba(230, 170, 150, 0.25)',
          lanternGlow: 'rgba(255, 190, 80, 0.6)'
        };
      case 'night':
        return {
          skyGradient: ['#050811', '#0b1124', '#121e3a', '#1e2b47'],
          foliageShade: '#060d09',
          foliageHighlight: '#102418',
          timberTone: '#2b1b11',
          lightBeam: 'rgba(140, 180, 255, 0.08)',
          mistColor: 'rgba(80, 110, 140, 0.15)',
          lanternGlow: 'rgba(255, 170, 50, 0.85)'
        };
      case 'century100':
        return {
          skyGradient: ['#182e28', '#2d5345', '#578670', '#b9d9c7'],
          foliageShade: '#0e2417',
          foliageHighlight: '#417a55',
          timberTone: '#545958', // Weathered silver-grey patina
          lightBeam: 'rgba(220, 255, 210, 0.25)',
          mistColor: 'rgba(200, 230, 215, 0.25)',
          lanternGlow: 'rgba(255, 210, 110, 0.5)'
        };
      default:
        return {
          skyGradient: ['#1e4034', '#3b6e56', '#7bb89a', '#d4ede1'],
          foliageShade: '#183b24',
          foliageHighlight: '#529658',
          timberTone: '#6b4423',
          lightBeam: 'rgba(255, 250, 210, 0.2)',
          mistColor: 'rgba(220, 240, 230, 0.2)',
          lanternGlow: 'rgba(255, 220, 120, 0.2)'
        };
    }
  };

  const colors = getAtmosphereGradients();

  // Render thematic architectural vector artwork based on perspective theme
  const renderPerspectiveScene = () => {
    switch (perspective.svgVisualTheme) {
      case 'drone-aerial':
      case 'night-campus':
        return (
          <g>
            {/* Topography and forest canopy clusters */}
            <circle cx="200" cy="180" r="140" fill={colors.foliageShade} opacity="0.9" />
            <circle cx="500" cy="220" r="180" fill={colors.foliageShade} opacity="0.95" />
            <circle cx="750" cy="160" r="130" fill={colors.foliageShade} opacity="0.85" />
            <circle cx="340" cy="360" r="160" fill={colors.foliageShade} opacity="0.9" />
            <circle cx="680" cy="380" r="170" fill={colors.foliageShade} opacity="0.92" />
            <circle cx="480" cy="480" r="140" fill={colors.foliageShade} opacity="0.88" />

            {/* Connecting elevated skyway paths (curving bezier lines) */}
            <path
              d="M 220 200 Q 320 280 460 250 T 680 230 T 780 340 T 640 450 T 360 420 Z"
              fill="none"
              stroke={colors.timberTone}
              strokeWidth="6"
              strokeDasharray="8 4"
              opacity="0.9"
            />
            <path
              d="M 460 250 Q 520 330 640 450"
              fill="none"
              stroke={colors.timberTone}
              strokeWidth="4"
              opacity="0.75"
            />

            {/* Water stream running through */}
            <path
              d="M 50 480 Q 280 430 420 370 T 800 240 T 950 180"
              fill="none"
              stroke="#2a6478"
              strokeWidth="14"
              opacity="0.6"
            />

            {/* Suspended Pavilions (Geometric architectural footprints) */}
            {/* Pavilion 1: Reading House (Circular) */}
            <circle cx="460" cy="250" r="38" fill={colors.timberTone} stroke="#c2a649" strokeWidth="3" />
            <circle cx="460" cy="250" r="18" fill={colors.foliageShade} />
            <circle cx="460" cy="250" r="8" fill="#529658" />

            {/* Pavilion 2: Research House (Angular) */}
            <polygon points="650,210 710,210 730,260 670,260" fill={colors.timberTone} stroke="#4ea685" strokeWidth="2.5" />

            {/* Pavilion 3: Silent Room */}
            <rect x="520" y="140" width="30" height="30" rx="4" fill={colors.timberTone} stroke="#e6823b" strokeWidth="2" />

            {/* Pavilion 4: Children's Treehouse */}
            <circle cx="230" cy="340" r="28" fill={colors.timberTone} stroke="#529658" strokeWidth="2.5" />

            {/* Pavilion 5: Community House */}
            <polygon points="460,460 560,450 580,510 440,520" fill={colors.timberTone} stroke="#ffd699" strokeWidth="3" />

            {/* Glowing lantern points for night/twilight */}
            {(lightingTime === 'night' || lightingTime === 'sunset' || lightingTime === 'dawn') && (
              <g>
                <circle cx="460" cy="250" r="45" fill={colors.lanternGlow} opacity="0.6" />
                <circle cx="680" cy="235" r="35" fill={colors.lanternGlow} opacity="0.5" />
                <circle cx="535" cy="155" r="25" fill={colors.lanternGlow} opacity="0.7" />
                <circle cx="230" cy="340" r="30" fill={colors.lanternGlow} opacity="0.5" />
                <circle cx="510" cy="480" r="45" fill={colors.lanternGlow} opacity="0.6" />
                {/* Fireflies */}
                <circle cx="320" cy="220" r="2" fill="#fff" opacity="0.9" />
                <circle cx="380" cy="160" r="1.5" fill="#ffd" opacity="0.8" />
                <circle cx="610" cy="330" r="2" fill="#ffd" opacity="0.9" />
                <circle cx="590" cy="420" r="1.5" fill="#fff" opacity="0.85" />
                <circle cx="740" cy="310" r="2" fill="#ffe" opacity="0.8" />
              </g>
            )}

            {/* Birds in flight */}
            <path d="M 380 120 Q 388 115 396 120 Q 404 115 412 120" fill="none" stroke="#222" strokeWidth="2" opacity="0.7" />
            <path d="M 640 90 Q 646 86 652 90 Q 658 86 664 90" fill="none" stroke="#222" strokeWidth="1.8" opacity="0.6" />
          </g>
        );

      case 'worms-eye':
        return (
          <g>
            {/* Ground forest floor with moss and ferns */}
            <path d="M 0 540 Q 250 510 500 530 T 1000 520 L 1000 600 L 0 600 Z" fill="#142118" />
            
            {/* Ferns on ground */}
            <path d="M 120 540 Q 150 480 190 490" stroke="#3c854c" strokeWidth="4" fill="none" />
            <path d="M 130 540 Q 170 470 210 480" stroke="#529658" strokeWidth="3" fill="none" />
            <path d="M 820 530 Q 780 470 740 480" stroke="#3c854c" strokeWidth="4" fill="none" />

            {/* Massive tree trunks rising vertically into the sky */}
            <polygon points="140,560 210,560 170,-20 120,-20" fill="#2d1c13" />
            <polygon points="460,540 540,540 500,-20 440,-20" fill="#382419" />
            <polygon points="780,550 860,550 830,-20 770,-20" fill="#2d1c13" />

            {/* Bark textures */}
            <line x1="175" y1="500" x2="145" y2="50" stroke="#1c110b" strokeWidth="3" opacity="0.6" />
            <line x1="500" y1="480" x2="470" y2="40" stroke="#24160f" strokeWidth="4" opacity="0.6" />

            {/* Suspended Reading Pavilion overhead (8-12m above) */}
            <g transform="translate(300, 140)">
              {/* Structural engineered diagonal braces */}
              <line x1="-140" y1="40" x2="160" y2="100" stroke={colors.timberTone} strokeWidth="8" />
              <line x1="220" y1="20" x2="180" y2="100" stroke={colors.timberTone} strokeWidth="8" />
              <line x1="500" y1="30" x2="240" y2="100" stroke={colors.timberTone} strokeWidth="8" />
              
              {/* Friction collar rings on trunks */}
              <rect x="-165" y="30" width="50" height="20" rx="4" fill="#3e372e" stroke="#c2a649" strokeWidth="2" />
              <rect x="175" y="10" width="55" height="22" rx="4" fill="#3e372e" stroke="#c2a649" strokeWidth="2" />
              <rect x="475" y="20" width="50" height="20" rx="4" fill="#3e372e" stroke="#c2a649" strokeWidth="2" />

              {/* Pavilion undercarriage & floor deck */}
              <polygon points="50,100 350,100 380,40 20,40" fill={colors.timberTone} stroke="#c2a649" strokeWidth="3" />
              <line x1="50" y1="90" x2="350" y2="90" stroke="#2d1c13" strokeWidth="4" />

              {/* Slotted reading windows with warm light */}
              <rect x="60" y="45" width="40" height="40" fill={colors.lanternGlow} stroke="#c2a649" strokeWidth="1.5" />
              <rect x="120" y="45" width="40" height="40" fill={colors.lanternGlow} stroke="#c2a649" strokeWidth="1.5" />
              <rect x="180" y="45" width="40" height="40" fill={colors.lanternGlow} stroke="#c2a649" strokeWidth="1.5" />
              <rect x="240" y="45" width="40" height="40" fill={colors.lanternGlow} stroke="#c2a649" strokeWidth="1.5" />

              {/* People silhouette */}
              <circle cx="140" cy="65" r="5" fill="#2d1c13" />
              <rect x="135" y="70" width="10" height="12" rx="2" fill="#2d1c13" />

              {/* Overhanging roof eaves */}
              <polygon points="-10,35 410,35 370,-10 30,-10" fill="#24160f" stroke="#c2a649" strokeWidth="2" />
            </g>

            {/* High canopy leaf clusters with filtered sunbeams */}
            <circle cx="100" cy="20" r="140" fill={colors.foliageShade} opacity="0.9" />
            <circle cx="500" cy="-20" r="180" fill={colors.foliageShade} opacity="0.95" />
            <circle cx="900" cy="30" r="150" fill={colors.foliageShade} opacity="0.9" />

            {/* Dramatic sunlight rays filtering downward */}
            <polygon points="460,-20 540,-20 800,560 300,560" fill={colors.lightBeam} />
            <polygon points="150,-20 220,-20 400,560 100,560" fill={colors.lightBeam} />
          </g>
        );

      case 'interior-library':
        return (
          <g>
            {/* Wooden plank flooring in circular perspective */}
            <path d="M 0 380 Q 500 340 1000 380 L 1000 600 L 0 600 Z" fill="#3e2718" />
            <line x1="500" y1="360" x2="100" y2="600" stroke="#2b1b11" strokeWidth="2" opacity="0.5" />
            <line x1="500" y1="360" x2="300" y2="600" stroke="#2b1b11" strokeWidth="2" opacity="0.5" />
            <line x1="500" y1="360" x2="500" y2="600" stroke="#2b1b11" strokeWidth="2" opacity="0.5" />
            <line x1="500" y1="360" x2="700" y2="600" stroke="#2b1b11" strokeWidth="2" opacity="0.5" />
            <line x1="500" y1="360" x2="900" y2="600" stroke="#2b1b11" strokeWidth="2" opacity="0.5" />

            {/* Large curved panoramic window framing deep forest */}
            <path d="M 120 100 Q 500 40 880 100 L 880 370 Q 500 330 120 370 Z" fill={colors.skyGradient[1]} />
            <circle cx="300" cy="180" r="100" fill={colors.foliageShade} opacity="0.8" />
            <circle cx="700" cy="200" r="120" fill={colors.foliageHighlight} opacity="0.75" />

            {/* Central living Dipterocarp trunk rising through the center */}
            <polygon points="460,600 540,600 525,-20 475,-20" fill="#2d1c13" stroke="#1c110b" strokeWidth="3" />
            {/* Non-binding collar ring */}
            <ellipse cx="500" cy="360" rx="55" ry="14" fill="#3e372e" stroke="#c2a649" strokeWidth="2" />

            {/* Curved circular bookshelves wrapping around walls and trunk */}
            <g transform="translate(140, 180)">
              {/* Left Bookshelf */}
              <rect x="0" y="0" width="180" height="180" rx="4" fill={colors.timberTone} stroke="#c2a649" strokeWidth="2" />
              {/* Shelves and books */}
              <line x1="0" y1="45" x2="180" y2="45" stroke="#24160f" strokeWidth="3" />
              <line x1="0" y1="90" x2="180" y2="90" stroke="#24160f" strokeWidth="3" />
              <line x1="0" y1="135" x2="180" y2="135" stroke="#24160f" strokeWidth="3" />
              {/* Book spines */}
              <rect x="10" y="8" width="12" height="34" fill="#8c3b2d" />
              <rect x="25" y="12" width="10" height="30" fill="#3b6e56" />
              <rect x="38" y="6" width="14" height="36" fill="#c2a649" />
              <rect x="55" y="10" width="16" height="32" fill="#4ea685" />
              <rect x="74" y="8" width="12" height="34" fill="#61311b" />
              <rect x="90" y="14" width="18" height="28" fill="#d9822b" />
            </g>

            <g transform="translate(680, 180)">
              {/* Right Bookshelf */}
              <rect x="0" y="0" width="180" height="180" rx="4" fill={colors.timberTone} stroke="#c2a649" strokeWidth="2" />
              <line x1="0" y1="45" x2="180" y2="45" stroke="#24160f" strokeWidth="3" />
              <line x1="0" y1="90" x2="180" y2="90" stroke="#24160f" strokeWidth="3" />
              <line x1="0" y1="135" x2="180" y2="135" stroke="#24160f" strokeWidth="3" />
              <rect x="15" y="10" width="14" height="32" fill="#529658" />
              <rect x="32" y="6" width="18" height="36" fill="#c2a649" />
              <rect x="53" y="12" width="12" height="30" fill="#8c3b2d" />
              <rect x="68" y="8" width="15" height="34" fill="#4ea685" />
            </g>

            {/* Low curved reading table & quiet reader */}
            <g transform="translate(360, 420)">
              <ellipse cx="140" cy="50" rx="140" ry="24" fill="#5c3a21" stroke="#c2a649" strokeWidth="3" />
              {/* Open book & tea cup */}
              <polygon points="120,44 140,40 160,44 140,48" fill="#fff" stroke="#967140" strokeWidth="1.5" />
              <circle cx="190" cy="46" r="8" fill="#d4ede1" stroke="#967140" strokeWidth="1.5" />
            </g>

            {/* Slatted timber ceiling arches with soft indirect light */}
            <path d="M 0 0 Q 500 120 1000 0 L 1000 80 Q 500 180 0 80 Z" fill="#2d1c13" stroke="#c2a649" strokeWidth="2" />
          </g>
        );

      case 'silent-vault':
        return (
          <g>
            {/* Dark smoked cypress timber walls */}
            <rect x="0" y="0" width="1000" height="600" fill="#18110b" />
            <line x1="200" y1="0" x2="200" y2="600" stroke="#0d0906" strokeWidth="3" />
            <line x1="400" y1="0" x2="400" y2="600" stroke="#0d0906" strokeWidth="3" />
            <line x1="600" y1="0" x2="600" y2="600" stroke="#0d0906" strokeWidth="3" />
            <line x1="800" y1="0" x2="800" y2="600" stroke="#0d0906" strokeWidth="3" />

            {/* Single narrow vertical slot window framing the 100-year tree */}
            <rect x="740" y="100" width="45" height="340" rx="3" fill="#3b6e56" stroke="#c2a649" strokeWidth="2" />
            <polygon points="755,440 770,440 765,100 760,100" fill="#24160f" />
            <circle cx="762" cy="180" r="18" fill="#529658" />

            {/* Light beam from vertical slot onto granite table */}
            <polygon points="740,100 785,100 620,520 280,520" fill="rgba(255, 235, 180, 0.18)" />

            {/* Engraved Milestone Years on Wall */}
            <g fill="#c2a649" opacity="0.85" fontSize="22" fontFamily="serif" fontWeight="bold">
              <text x="140" y="140">2026</text>
              <text x="140" y="200">2036</text>
              <text x="140" y="260">2051</text>
              <text x="140" y="320">2076</text>
              <text x="140" y="380" fill="#ffd699">2126</text>
            </g>

            {/* Carved granite table holding sealed archival boxes */}
            <g transform="translate(240, 420)">
              {/* Stone table top */}
              <polygon points="20,40 520,40 560,90 0,90" fill="#343838" stroke="#5c6060" strokeWidth="3" />
              {/* Table legs */}
              <rect x="60" y="90" width="40" height="90" fill="#242727" />
              <rect x="440" y="90" width="40" height="90" fill="#242727" />

              {/* Sealed wooden archive boxes with wax seals */}
              <rect x="120" y="15" width="70" height="28" rx="2" fill="#5c3a21" stroke="#c2a649" strokeWidth="1.5" />
              <circle cx="155" cy="28" r="5" fill="#8c3b2d" />

              <rect x="220" y="10" width="80" height="32" rx="2" fill="#5c3a21" stroke="#c2a649" strokeWidth="1.5" />
              <circle cx="260" cy="25" r="5" fill="#8c3b2d" />

              <rect x="330" y="12" width="75" height="30" rx="2" fill="#5c3a21" stroke="#c2a649" strokeWidth="1.5" />
              <circle cx="367" cy="26" r="5" fill="#8c3b2d" />
            </g>

            {/* Stone marker inscription */}
            <text x="500" y="575" textAnchor="middle" fill="#967140" fontSize="16" fontFamily="serif" fontStyle="italic">
              &quot;For those who come after us.&quot;
            </text>
          </g>
        );

      case 'rain-reading':
      case 'monsoon-rain':
        return (
          <g>
            {/* Dramatic tropical rain landscape outside panoramic window */}
            <rect x="0" y="0" width="1000" height="600" fill="#1b2836" />
            
            {/* Rain sheets falling */}
            <g stroke="rgba(190, 220, 240, 0.4)" strokeWidth="1.5">
              <line x1="80" y1="0" x2="40" y2="600" />
              <line x1="180" y1="0" x2="140" y2="600" />
              <line x1="280" y1="0" x2="240" y2="600" />
              <line x1="380" y1="0" x2="340" y2="600" />
              <line x1="480" y1="0" x2="440" y2="600" />
              <line x1="580" y1="0" x2="540" y2="600" />
              <line x1="680" y1="0" x2="640" y2="600" />
              <line x1="780" y1="0" x2="740" y2="600" />
              <line x1="880" y1="0" x2="840" y2="600" />
              <line x1="980" y1="0" x2="940" y2="600" />
            </g>

            {/* Large glass frame */}
            <rect x="80" y="60" width="840" height="420" fill="none" stroke={colors.timberTone} strokeWidth="24" />
            
            {/* Copper rain chain outside window */}
            <g transform="translate(180, 80)">
              <ellipse cx="0" cy="20" rx="10" ry="14" fill="none" stroke="#b86d3b" strokeWidth="3" />
              <ellipse cx="0" cy="50" rx="10" ry="14" fill="none" stroke="#b86d3b" strokeWidth="3" />
              <ellipse cx="0" cy="80" rx="10" ry="14" fill="none" stroke="#b86d3b" strokeWidth="3" />
              <ellipse cx="0" cy="110" rx="10" ry="14" fill="none" stroke="#b86d3b" strokeWidth="3" />
              <ellipse cx="0" cy="140" rx="10" ry="14" fill="none" stroke="#b86d3b" strokeWidth="3" />
              <ellipse cx="0" cy="170" rx="10" ry="14" fill="none" stroke="#b86d3b" strokeWidth="3" />
            </g>

            {/* Cozy interior warm armchair & hearth in foreground */}
            <path d="M 0 460 Q 500 440 1000 460 L 1000 600 L 0 600 Z" fill="#2d1c13" />

            {/* Earthen soapstone stove with glowing fire */}
            <g transform="translate(720, 360)">
              <rect x="0" y="0" width="90" height="120" rx="8" fill="#3a3d3d" stroke="#5c6060" strokeWidth="2" />
              <ellipse cx="45" cy="70" rx="24" ry="18" fill="#e6823b" />
              <ellipse cx="45" cy="70" rx="14" ry="10" fill="#ffd699" />
              {/* Chimney */}
              <rect x="35" y="-140" width="20" height="140" fill="#2a2c2c" />
              {/* Steaming kettle on stove */}
              <ellipse cx="45" cy="-6" rx="18" ry="10" fill="#1c110b" />
            </g>

            {/* Comfortable reading armchair */}
            <g transform="translate(380, 420)">
              <rect x="0" y="0" width="140" height="100" rx="16" fill="#8c3b2d" stroke="#5c3a21" strokeWidth="3" />
              {/* Wool blanket throw */}
              <path d="M 20 40 Q 70 70 120 40 L 120 90 L 20 90 Z" fill="#967140" opacity="0.85" />
              {/* Reading lamp */}
              <path d="M -40 120 L -40 -30 Q -40 -50 0 -50" fill="none" stroke="#c2a649" strokeWidth="4" />
              <polygon points="-15,-40 15,-40 25,-15 -25,-15" fill="#c2a649" />
              <circle cx="0" cy="-10" r="14" fill="#ffd699" opacity="0.8" />
            </g>
          </g>
        );

      default:
        // Human-eye / General biophilic perspective
        return (
          <g>
            {/* Subtropical forest sky and canopy */}
            <rect x="0" y="0" width="1000" height="600" fill={colors.skyGradient[0]} />
            <circle cx="180" cy="120" r="220" fill={colors.foliageShade} opacity="0.8" />
            <circle cx="820" cy="100" r="240" fill={colors.foliageShade} opacity="0.85" />

            {/* Elevated wooden walkway in foreground (perspective receding into distance) */}
            <polygon points="380,320 620,320 860,600 140,600" fill={colors.timberTone} stroke="#c2a649" strokeWidth="4" />
            
            {/* Walkway planks */}
            <line x1="360" y1="360" x2="640" y2="360" stroke="#24160f" strokeWidth="3" />
            <line x1="320" y1="410" x2="680" y2="410" stroke="#24160f" strokeWidth="3" />
            <line x1="260" y1="470" x2="740" y2="470" stroke="#24160f" strokeWidth="4" />
            <line x1="180" y1="540" x2="820" y2="540" stroke="#24160f" strokeWidth="5" />

            {/* Handrails */}
            <line x1="380" y1="280" x2="140" y2="520" stroke="#c2a649" strokeWidth="5" />
            <line x1="620" y1="280" x2="860" y2="520" stroke="#c2a649" strokeWidth="5" />

            {/* Reading House Pavilion ahead */}
            <g transform="translate(380, 160)">
              {/* Roof eave */}
              <polygon points="-40,60 280,60 220,0 20,0" fill="#2d1c13" stroke="#c2a649" strokeWidth="3" />
              {/* Main facade */}
              <rect x="0" y="60" width="240" height="110" fill={colors.timberTone} stroke="#c2a649" strokeWidth="2" />
              {/* Bookshelves visible through open louvers */}
              <rect x="20" y="75" width="60" height="80" fill={colors.lanternGlow} stroke="#c2a649" strokeWidth="1.5" />
              <rect x="95" y="75" width="50" height="80" fill={colors.lanternGlow} stroke="#c2a649" strokeWidth="1.5" />
              <rect x="160" y="75" width="60" height="80" fill={colors.lanternGlow} stroke="#c2a649" strokeWidth="1.5" />
            </g>

            {/* Sunlight shafts and mist */}
            <polygon points="500,0 600,0 800,600 550,600" fill={colors.lightBeam} />
            <rect x="0" y="240" width="1000" height="140" fill={colors.mistColor} />
          </g>
        );
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-stone-800 shadow-xl bg-stone-950 ${className}`}>
      {/* SVG Canvas Stage */}
      <svg
        viewBox="0 0 1000 600"
        className="w-full h-full object-cover transition-colors duration-700"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id={`skyGrad-${perspective.id}-${lightingTime}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.skyGradient[0]} />
            <stop offset="35%" stopColor={colors.skyGradient[1]} />
            <stop offset="70%" stopColor={colors.skyGradient[2]} />
            <stop offset="100%" stopColor={colors.skyGradient[3]} />
          </linearGradient>
        </defs>

        {/* Dynamic Background Gradient */}
        <rect width="1000" height="600" fill={`url(#skyGrad-${perspective.id}-${lightingTime})`} />

        {/* Master Perspective Architectural Scene */}
        {renderPerspectiveScene()}
      </svg>

      {/* Camera & Lighting Overlay Badge */}
      <div className="absolute top-3 left-3 flex items-center gap-2">
        <span className="px-2.5 py-1 rounded-lg bg-stone-950/85 backdrop-blur-md border border-stone-700 text-stone-200 text-[11px] font-mono font-semibold tracking-wide">
          {perspective.cameraType} • {perspective.aspectRatio}
        </span>
        <span className="px-2.5 py-1 rounded-lg bg-emerald-950/85 backdrop-blur-md border border-emerald-700/60 text-emerald-300 text-[11px] font-medium flex items-center gap-1">
          <span>{perspective.elevationDescription}</span>
        </span>
      </div>

      {/* Title & Architectural Statement */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-transparent p-4 pt-10 flex items-end justify-between">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-semibold">
            Perspective #{perspective.number} of 20
          </div>
          <div className="text-base font-serif font-bold text-white tracking-tight">
            {perspective.title}
          </div>
          <div className="text-xs text-stone-300 line-clamp-1 mt-0.5">
            {perspective.subtitle}
          </div>
        </div>
      </div>
    </div>
  );
};
