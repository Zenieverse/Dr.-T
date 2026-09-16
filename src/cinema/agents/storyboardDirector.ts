// =========================================================================
// DR. T CINEMA — STORYBOARD DIRECTOR AGENT
// Decomposes screenplay scenes into granular cinematic shots
// =========================================================================

import { Scene, Shot, VisualStyleKey } from '../types';

export function runStoryboardDirector(scenes: Scene[], visualStyle: VisualStyleKey = 'Humanist'): Shot[] {
  const shots: Shot[] = [];
  let shotIndex = 1;

  scenes.forEach(scene => {
    // 2 shots per scene to achieve fine-grained cinematic rhythm
    const shot1Duration = Math.ceil(scene.durationSeconds / 2);
    const shot2Duration = scene.durationSeconds - shot1Duration;

    const shot1Id = `SHOT-${String(shotIndex).padStart(2, '0')}`;
    shotIndex++;
    const shot2Id = `SHOT-${String(shotIndex).padStart(2, '0')}`;
    shotIndex++;

    const isCGI = scene.location.toLowerCase().includes('microscopic') || scene.location.toLowerCase().includes('mitochondrial');

    shots.push({
      shotId: shot1Id,
      sceneId: scene.id,
      shotNumber: shots.length + 1,
      durationSeconds: shot1Duration,
      shotType: isCGI ? 'conceptual visualization' : (shotIndex % 3 === 0 ? 'wide' : 'medium'),
      cameraMovement: isCGI ? 'Virtual orbital sweep' : 'Slow push-in on 3-axis gimbal',
      lensStyle: isCGI ? 'Virtual 24mm macro probe' : '50mm anamorphic prime T1.5',
      composition: 'Rule of thirds, strong natural light source from frame left',
      subject: `${scene.title} — establishing visual beat`,
      environment: scene.location,
      lighting: isCGI ? 'Bioluminescent self-radiant amber/cyan glow' : 'Warm 2800K natural window bounce',
      colorMood: 'Warm ochre, soft shadows, golden highlights',
      visualAction: scene.visualAction,
      transition: 'Dissolve to subsequent angle',
      thumbnailPrompt: `Cinematic frame of ${scene.visualAction.slice(0, 80)}, 35mm film still, ${visualStyle} lighting, 4k photorealistic`,
      claimId: scene.claimIds[0]
    });

    shots.push({
      shotId: shot2Id,
      sceneId: scene.id,
      shotNumber: shots.length + 1,
      durationSeconds: shot2Duration,
      shotType: isCGI ? 'extreme close-up' : (shotIndex % 2 === 0 ? 'close-up' : 'POV'),
      cameraMovement: isCGI ? 'Forward particle glide' : 'Static tripod with shallow focus racking',
      lensStyle: isCGI ? 'Virtual macro crystalline' : '85mm portrait prime T1.4',
      composition: 'Intimate focal lock, rich background bokeh rolloff',
      subject: `${scene.title} — intimate emotional detail or macro view`,
      environment: scene.location,
      lighting: isCGI ? 'Prismatic refractive core emission' : 'Soft rim light accentuating tactile texture',
      colorMood: 'Deep obsidian and warm amber accents',
      visualAction: `Focal detail continuing ${scene.title.toLowerCase()}`,
      transition: scene.transition || 'Cut to next scene',
      thumbnailPrompt: `Cinematic close-up portrait of ${scene.visualAction.slice(0, 80)}, shallow depth of field, ${visualStyle} style`,
      claimId: scene.claimIds[0]
    });
  });

  return shots;
}
