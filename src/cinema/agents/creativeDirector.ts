// =========================================================================
// DR. T CINEMA — CREATIVE DIRECTOR AGENT
// Turns creative intent into a structured cinematic production brief
// =========================================================================

import { CreativeBrief, VisualStyleKey } from '../types';

export interface CreativeDirectorInput {
  idea: string;
  targetAudience?: string;
  durationSeconds?: number;
  format?: string;
  visualLanguage?: VisualStyleKey;
  tone?: string;
}

export async function runCreativeDirector(input: CreativeDirectorInput): Promise<CreativeBrief> {
  try {
    const res = await fetch('/api/cinema/orchestrate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agent: 'Creative Director',
        input
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.brief) return data.brief;
    }
  } catch (err) {
    console.warn('[Creative Director] Server call fallback:', err);
  }

  // Graceful deterministic fallback
  const duration = input.durationSeconds || 90;
  const visual = input.visualLanguage || 'Humanist';
  
  return {
    projectTitle: deriveTitle(input.idea),
    logline: `A ${duration}-second cinematic exploration of ${input.idea.replace(/^(create|produce|make)\s+(a\s+)?/i, '')}, grounding human symptoms in verified biochemical evidence.`,
    audience: input.targetAudience || 'General public, digital learners, curious patients and educators',
    objective: 'Transform complex biomedical evidence into an accessible, visually gripping cinematic narrative that empowers viewers to have informed discussions with their healthcare providers.',
    format: input.format || `${duration}-Second Cinematic Educational Explainer`,
    durationSeconds: duration,
    tone: input.tone || 'Warm, contemplative, scientifically rigorous, empathetic, never alarmist',
    visualLanguage: visual,
    narrativeStrategy: 'Human tactile symptom hook -> Cellular reserve deconstruction -> Mitochondrial engine visualization -> Clinical nuance -> Empathetic empowered action',
    successCriteria: [
      '100% of factual assertions backed by peer-reviewed evidence',
      'High accessibility with synchronized captions and audio-description tags',
      'Clinical decision-support framing with zero unqualified medical directives',
      'Calibrated cinematic pacing suitable for broadcast and educational platforms'
    ]
  };
}

function deriveTitle(prompt: string): string {
  if (prompt.toLowerCase().includes('iron') || prompt.toLowerCase().includes('fatigue')) {
    return 'The Hidden Reserve';
  }
  if (prompt.toLowerCase().includes('sleep') || prompt.toLowerCase().includes('circadian')) {
    return 'The Midnight Clock';
  }
  if (prompt.toLowerCase().includes('water') || prompt.toLowerCase().includes('hydration')) {
    return 'The Fluid Balance';
  }
  return prompt.split(' ').slice(0, 4).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'The Living Narrative';
}
