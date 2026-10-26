// ============================================================================
// 🩺 DR. T VISION ALERT — SYNTHETIC TEST FIXTURES
// Mathematically Defined Synthetic Medical Device Displays for Reproducible Testing
// No real patient PHI or copyrighted image binaries embedded.
// ============================================================================

import { RawPixelBuffer } from './opencv5Pipeline';

export interface SyntheticFixture {
  id: string;
  title: string;
  deviceType: 'BLOOD_PRESSURE_MONITOR' | 'PULSE_OXIMETER';
  expectedText: string;
  expectedValues: {
    systolic?: number;
    diastolic?: number;
    heartRate?: number;
    spo2?: number;
  };
  expectedQuality: {
    qualityPassed: boolean;
    isBlurry?: boolean;
    hasGlare?: boolean;
  };
  description: string;
  renderPixels: () => RawPixelBuffer;
}

/**
 * Creates an empty RGBA pixel buffer
 */
function createBuffer(width: number, height: number, fillR = 240, fillG = 240, fillB = 240): RawPixelBuffer {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const idx = i * 4;
    data[idx] = fillR;
    data[idx + 1] = fillG;
    data[idx + 2] = fillB;
    data[idx + 3] = 255;
  }
  return { width, height, data };
}

/**
 * Draws a filled rectangle on raw pixel buffer
 */
function fillRect(
  buf: RawPixelBuffer, 
  x: number, 
  y: number, 
  w: number, 
  h: number, 
  r: number, 
  g: number, 
  b: number
) {
  const { width, height, data } = buf;
  const startX = Math.max(0, Math.min(width, Math.round(x)));
  const endX = Math.max(0, Math.min(width, Math.round(x + w)));
  const startY = Math.max(0, Math.min(height, Math.round(y)));
  const endY = Math.max(0, Math.min(height, Math.round(y + h)));

  for (let py = startY; py < endY; py++) {
    const rowOffset = py * width;
    for (let px = startX; px < endX; px++) {
      const idx = (rowOffset + px) * 4;
      data[idx] = r;
      data[idx + 1] = g;
      data[idx + 2] = b;
      data[idx + 3] = 255;
    }
  }
}

/**
 * Draws high-contrast digital segments simulating an LCD digit
 */
function drawLcdDigit(buf: RawPixelBuffer, digit: number, x: number, y: number, w = 24, h = 40) {
  // Segment map for 0-9: a(top), b(top-r), c(bot-r), d(bot), e(bot-l), f(top-l), g(mid)
  const segments: Record<number, boolean[]> = {
    0: [true, true, true, true, true, true, false],
    1: [false, true, true, false, false, false, false],
    2: [true, true, false, true, true, false, true],
    3: [true, true, true, true, false, false, true],
    4: [false, true, true, false, false, true, true],
    5: [true, false, true, true, false, true, true],
    6: [true, false, true, true, true, true, true],
    7: [true, true, true, false, false, false, false],
    8: [true, true, true, true, true, true, true],
    9: [true, true, true, true, false, true, true]
  };

  const seg = segments[digit] || segments[8];
  const t = Math.max(3, Math.round(w / 6));
  const halfH = Math.round(h / 2);

  const darkR = 25;
  const darkG = 30;
  const darkB = 25;

  // a: top
  if (seg[0]) fillRect(buf, x, y, w, t, darkR, darkG, darkB);
  // b: top-right
  if (seg[1]) fillRect(buf, x + w - t, y, t, halfH, darkR, darkG, darkB);
  // c: bottom-right
  if (seg[2]) fillRect(buf, x + w - t, y + halfH, t, halfH, darkR, darkG, darkB);
  // d: bottom
  if (seg[3]) fillRect(buf, x, y + h - t, w, t, darkR, darkG, darkB);
  // e: bottom-left
  if (seg[4]) fillRect(buf, x, y + halfH, t, halfH, darkR, darkG, darkB);
  // f: top-left
  if (seg[5]) fillRect(buf, x, y, t, halfH, darkR, darkG, darkB);
  // g: middle
  if (seg[6]) fillRect(buf, x, y + halfH - Math.round(t / 2), w, t, darkR, darkG, darkB);
}

function drawNumber(buf: RawPixelBuffer, num: number, startX: number, startY: number, digitW = 28, digitH = 48, spacing = 8) {
  const digits = num.toString().split('').map(Number);
  digits.forEach((d, i) => {
    drawLcdDigit(buf, d, startX + i * (digitW + spacing), startY, digitW, digitH);
  });
}

// ============================================================================
// FIXTURE 1: Omron Blood Pressure Monitor (Stage 1 HTN: 138/88 mmHg, 72 bpm)
// ============================================================================
export const FIXTURE_OMRON_BP_STAGE1: SyntheticFixture = {
  id: 'fixture-omron-138-88',
  title: 'Omron Digital Blood Pressure Monitor (Stage 1 HTN)',
  deviceType: 'BLOOD_PRESSURE_MONITOR',
  expectedText: 'SYS 138 DIA 88 PULSE 72 OMRON',
  expectedValues: {
    systolic: 138,
    diastolic: 88,
    heartRate: 72
  },
  expectedQuality: {
    qualityPassed: true,
    isBlurry: false,
    hasGlare: false
  },
  description: 'Simulates an upper-arm blood pressure monitor showing 138/88 mmHg and 72 bpm resting pulse with crisp contrast and valid display bezel.',
  renderPixels: () => {
    const W = 400;
    const H = 300;
    const buf = createBuffer(W, H, 220, 224, 228); // Plastic outer casing

    // Outer bezel
    fillRect(buf, 30, 25, 340, 250, 40, 45, 50);
    // LCD Screen background (light greenish-gray LCD tint)
    fillRect(buf, 40, 35, 320, 230, 195, 205, 190);

    // Labels & numbers
    // SYS: 138
    fillRect(buf, 55, 50, 45, 10, 50, 60, 50); // Label "SYS"
    drawNumber(buf, 138, 150, 45, 30, 55, 10);

    // DIA: 88
    fillRect(buf, 55, 125, 45, 10, 50, 60, 50); // Label "DIA"
    drawNumber(buf, 88, 180, 120, 30, 55, 10);

    // PULSE: 72
    fillRect(buf, 55, 200, 50, 10, 50, 60, 50); // Label "PULSE"
    drawNumber(buf, 72, 180, 195, 24, 42, 8);

    return buf;
  }
};

// ============================================================================
// FIXTURE 2: Wellue Fingertip Pulse Oximeter (Normal: 98% SpO2, 68 bpm)
// ============================================================================
export const FIXTURE_PULSE_OX_NORMAL: SyntheticFixture = {
  id: 'fixture-pulseox-98-68',
  title: 'Wellue Fingertip Pulse Oximeter (Normal SpO2)',
  deviceType: 'PULSE_OXIMETER',
  expectedText: 'SPO2 98 PR BPM 68',
  expectedValues: {
    spo2: 98,
    heartRate: 68
  },
  expectedQuality: {
    qualityPassed: true,
    isBlurry: false,
    hasGlare: false
  },
  description: 'Simulates a dual-color OLED fingertip oximeter showing 98% arterial oxygen saturation and 68 bpm heart rate with photoplethysmograph waveform.',
  renderPixels: () => {
    const W = 400;
    const H = 280;
    const buf = createBuffer(W, H, 245, 245, 248);

    // Dark case bezel
    fillRect(buf, 40, 30, 320, 220, 20, 24, 30);
    // OLED screen background (deep black)
    fillRect(buf, 55, 45, 290, 190, 8, 10, 15);

    // Cyan SpO2 % Header & Digits
    fillRect(buf, 75, 60, 60, 12, 0, 220, 255);
    drawNumber(buf, 98, 75, 85, 38, 65, 12);

    // Yellow PR bpm Header & Digits
    fillRect(buf, 220, 60, 60, 12, 255, 210, 0);
    drawNumber(buf, 68, 220, 85, 34, 60, 10);

    // Bottom waveform simulation bar
    for (let x = 75; x < 320; x += 4) {
      const barH = 5 + Math.round(Math.abs(Math.sin(x * 0.08)) * 25);
      fillRect(buf, x, 210 - barH, 2, barH, 0, 255, 180);
    }

    return buf;
  }
};

// ============================================================================
// FIXTURE 3: Critical Hypertensive Crisis (Emergency: 192/122 mmHg, 108 bpm)
// ============================================================================
export const FIXTURE_BP_CRITICAL_EMERGENCY: SyntheticFixture = {
  id: 'fixture-bp-critical-192-122',
  title: 'Hypertensive Crisis Emergency Display (192/122 mmHg)',
  deviceType: 'BLOOD_PRESSURE_MONITOR',
  expectedText: 'SYS 192 DIA 122 PULSE 108 CRISIS',
  expectedValues: {
    systolic: 192,
    diastolic: 122,
    heartRate: 108
  },
  expectedQuality: {
    qualityPassed: true,
    isBlurry: false,
    hasGlare: false
  },
  description: 'Simulates critical severe hypertension requiring immediate emergency escalation independently of AI.',
  renderPixels: () => {
    const W = 400;
    const H = 300;
    const buf = createBuffer(W, H, 210, 215, 220);

    fillRect(buf, 30, 25, 340, 250, 40, 45, 50);
    fillRect(buf, 40, 35, 320, 230, 195, 205, 190);

    drawNumber(buf, 192, 140, 45, 30, 55, 10);
    drawNumber(buf, 122, 140, 120, 30, 55, 10);
    drawNumber(buf, 108, 140, 195, 24, 42, 8);

    return buf;
  }
};

// ============================================================================
// FIXTURE 4: Glare & Blurry Rejection Display (Quality Rejection Engine)
// ============================================================================
export const FIXTURE_GLARE_BLUR_REJECTION: SyntheticFixture = {
  id: 'fixture-glare-blur-rejected',
  title: 'Specular Glare & Blur Rejection Display',
  deviceType: 'BLOOD_PRESSURE_MONITOR',
  expectedText: '',
  expectedValues: {},
  expectedQuality: {
    qualityPassed: false,
    hasGlare: true
  },
  description: 'Simulates severe specular overhead glare occluding the LCD display, testing OpenCV 5 automatic rejection.',
  renderPixels: () => {
    const W = 400;
    const H = 300;
    const buf = createBuffer(W, H, 240, 240, 240);

    fillRect(buf, 30, 25, 340, 250, 100, 100, 100);
    fillRect(buf, 40, 35, 320, 230, 180, 180, 180);

    // Overexposure / Specular glare blotch: >35% of pixels washed out at white (255, 255, 255)
    fillRect(buf, 60, 50, 260, 160, 255, 255, 255);

    return buf;
  }
};

export const ALL_SYNTHETIC_FIXTURES: SyntheticFixture[] = [
  FIXTURE_OMRON_BP_STAGE1,
  FIXTURE_PULSE_OX_NORMAL,
  FIXTURE_BP_CRITICAL_EMERGENCY,
  FIXTURE_GLARE_BLUR_REJECTION
];
