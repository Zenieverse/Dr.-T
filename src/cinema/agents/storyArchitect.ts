// =========================================================================
// DR. T CINEMA — STORY ARCHITECT AGENT
// Structures evidence into an 8-beat cinematic narrative framework
// =========================================================================

import { StoryBeat, CreativeBrief, EvidenceClaim } from '../types';

export function runStoryArchitect(brief: CreativeBrief, claims: EvidenceClaim[]): StoryBeat[] {
  return [
    {
      id: 'beat-1',
      type: 'HOOK',
      title: 'The Tactile Weight',
      objective: 'Establish an immediately relatable sensory moment of physical exhaustion or curiosity',
      emotionalTone: 'Intimate, quiet, authentic',
      estimatedSeconds: Math.round(brief.durationSeconds * 0.12)
    },
    {
      id: 'beat-2',
      type: 'HUMAN_QUESTION',
      title: 'The Diagnostic Paradox',
      objective: 'Frame the tension between feeling depleted and receiving seemingly "normal" test metrics',
      emotionalTone: 'Curious, validating',
      estimatedSeconds: Math.round(brief.durationSeconds * 0.13)
    },
    {
      id: 'beat-3',
      type: 'CONTEXT',
      title: 'The Hidden Vault',
      objective: 'Introduce the biological reserve concept (ferritin nanocages) as the backup warehouse',
      emotionalTone: 'Illuminating, wondrous',
      estimatedSeconds: Math.round(brief.durationSeconds * 0.14)
    },
    {
      id: 'beat-4',
      type: 'DISCOVERY',
      title: 'Inside the Cellular Engine',
      objective: 'Zoom into mitochondria to demonstrate how iron-sulfur complexes generate ATP stamina',
      emotionalTone: 'Cinematic, wondrous',
      estimatedSeconds: Math.round(brief.durationSeconds * 0.15)
    },
    {
      id: 'beat-5',
      type: 'TENSION',
      title: 'Running on Empty Reserves',
      objective: 'Explain the sequence where storage empties long before bloodstream levels crash',
      emotionalTone: 'Revelatory, grounding',
      estimatedSeconds: Math.round(brief.durationSeconds * 0.14)
    },
    {
      id: 'beat-6',
      type: 'EXPLANATION',
      title: 'What the Numbers Mean',
      objective: 'Demystify laboratory tests, distinguishing circulating counts from storage tests',
      emotionalTone: 'Precise, empowering',
      estimatedSeconds: Math.round(brief.durationSeconds * 0.12)
    },
    {
      id: 'beat-7',
      type: 'INSIGHT',
      title: 'Part of the Mosaic',
      objective: 'Prevent oversimplification by framing iron alongside sleep, thyroid, and lifestyle',
      emotionalTone: 'Balanced, thoughtful',
      estimatedSeconds: Math.round(brief.durationSeconds * 0.10)
    },
    {
      id: 'beat-8',
      type: 'ACTION',
      title: 'Empowered Consultation',
      objective: 'Equip the viewer with three concrete questions for their personal clinician',
      emotionalTone: 'Inspiring, proactive',
      estimatedSeconds: Math.round(brief.durationSeconds * 0.10)
    }
  ];
}
