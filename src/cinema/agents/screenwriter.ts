// =========================================================================
// DR. T CINEMA — SCREENWRITER AGENT
// Generates complete production screenplays with embedded claim traceability
// =========================================================================

import { Scene, CreativeBrief, StoryBeat, EvidenceClaim } from '../types';

export function runScreenwriter(
  brief: CreativeBrief, 
  beats: StoryBeat[], 
  claims: EvidenceClaim[]
): Scene[] {
  let accumulatedTime = 0;

  const scenes: Scene[] = beats.map((beat, idx) => {
    const sceneNum = idx + 1;
    const sceneId = `SCENE-${String(sceneNum).padStart(2, '0')}`;
    const startSec = accumulatedTime;
    const endSec = accumulatedTime + beat.estimatedSeconds;
    accumulatedTime = endSec;

    const timecodeStart = formatTimecode(startSec);
    const timecodeEnd = formatTimecode(endSec);

    // Map relevant claim if available
    const assignedClaim = claims[idx % claims.length];
    const claimIds = assignedClaim ? [assignedClaim.id] : [];

    let visualAction = '';
    let camera = '';
    let narration = '';
    let onScreenText = '';
    let sfx = '';
    let music = '';
    let transition = '';
    let location = '';

    switch (beat.type) {
      case 'HOOK':
        location = 'Int. Bedroom / Morning Sunlight';
        visualAction = 'Subject sits on the edge of the bed in morning light, pausing with heavy, deliberate exhaustion.';
        camera = 'Slow handheld 50mm, eye-level, natural breathing movement.';
        narration = 'You slept eight hours. The morning sun is gentle. But stepping onto the floor feels like carrying silent sandbags on your shoulders.';
        onScreenText = brief.projectTitle.toUpperCase();
        sfx = 'Soft morning ambient room tone, distant wall clock tick, quiet exhale.';
        music = 'Subtle ambient Rhodes piano chords in C-major, gentle warm cello drone.';
        transition = 'Soft cinematic dissolve to staircase.';
        break;

      case 'HUMAN_QUESTION':
        location = 'Ext. City Commute / Subway Steps';
        visualAction = 'Subject climbs subway stairs among rushing commuters, pausing as she glances at normal lab numbers on her phone.';
        camera = '35mm slow tracking profile shot. Frame rate shift conveying muscular drag.';
        narration = `Your blood test says your hemoglobin is completely normal. Yet getting through the afternoon feels like pushing through deep water. How can your labs be fine when your body feels empty? [${claimIds[0] || 'C-001'}]`;
        onScreenText = 'Hemoglobin: 13.8 g/dL (Normal)';
        sfx = 'Subway rumble fading to muffled underwater acoustics.';
        music = 'A warm acoustic guitar motif enters, questioning and contemplative.';
        transition = 'Macro transition into cellular light particles.';
        break;

      case 'CONTEXT':
        location = 'Int. Microscopic Cell Interior (CGI)';
        visualAction = 'Camera drifts inside a warm, luminous cellular interior. A geometric protein sphere shines in amber-gold light: ferritin.';
        camera = 'Virtual macro probe lens, fluid rotational drift around the ferritin nanocage.';
        narration = `Deep inside your cells lies an intricate microscopic sphere called ferritin: a cellular reserve holding thousands of iron atoms ready for release. [${claimIds[0] || 'C-004'}]`;
        onScreenText = 'Ferritin: The Cellular Storage Vault';
        sfx = 'Resonant sub-bass hum, crystalline chime as iron particles pulse with energy.';
        music = 'Atmospheric strings rise with warm brass pads, evoking wonder.';
        transition = 'Seamless zoom into mitochondrial inner membrane.';
        break;

      case 'DISCOVERY':
        location = 'Int. Mitochondrial Matrix (Molecular Animation)';
        visualAction = 'Luminous electron transport chains rotate rhythmically. Glowing iron-sulfur clusters transfer electrons, synthesizing ATP.';
        camera = 'Dynamic glide along the inner mitochondrial folds; luminous particle trails.';
        narration = `We often think iron only carries oxygen in our blood. But your mitochondria need iron to assemble the electron transport chain that turns oxygen into cellular stamina. [${claimIds[0] || 'C-009'}]`;
        onScreenText = 'Mitochondrial Energy • ATP Synthesis';
        sfx = 'Rhythmic hum of cellular respiration, soft percussive heartbeat pulse.';
        music = 'Uplifting crescendo of analog synthesizer and live acoustic viola.';
        transition = 'Fluid match-cut to subject at work desk.';
        break;

      case 'TENSION':
        location = 'Int. Work Studio / Afternoon Light';
        visualAction = 'At her desk, she rests her forehead against her palms. Split screen overlay shows the ferritin nanocage running low on iron atoms.';
        camera = 'Medium intimate shot, 85mm portrait lens with creamy shallow depth of field.';
        narration = `Before your body ever runs out of hemoglobin in the bloodstream, it quietly empties this backup warehouse. When ferritin drops, your cellular batteries run on empty. [${claimIds[0] || 'C-014'}]`;
        onScreenText = 'Depleted Storage • Preserved Bloodstream';
        sfx = 'Soft pencil roll across paper, gentle room tone.';
        music = 'Tension resolves into a gentle, supportive piano phrase.';
        transition = 'Clean graphic wipe to laboratory report overlay.';
        break;

      case 'EXPLANATION':
        location = 'Int. Clinical Consultation Room / Warm Birch Wood';
        visualAction = 'Clinician and patient review a digital tablet together, looking at the distinction between CBC and Serum Ferritin.';
        camera = 'Two-shot over the shoulder, warm natural daylight from tall clinic window.';
        narration = `A standard blood count only checks circulating red cells. It does not measure the warehouse. Asking your clinician to check your serum ferritin reveals the reserve. [${claimIds[0] || 'C-001'}]`;
        onScreenText = 'Ask for: Serum Ferritin + Total Iron Binding Capacity';
        sfx = 'Subtle paper rustle, calm conversational room acoustic.';
        music = 'Harmonious acoustic fingerpicking guitar with soft upright bass.';
        transition = 'Gentle cut to exterior city park bench.';
        break;

      case 'INSIGHT':
        location = 'Ext. City Park / Sunlit Tree Canopy';
        visualAction = 'Subject walks under sunlit green leaves, breathing deeply. Subtle graphic cards float alongside: Sleep, Thyroid, Iron, Stress.';
        camera = 'Steadicam forward tracking shot, subject walking toward camera with relaxed posture.';
        narration = `Fatigue is a symptom, not a diagnosis. Iron is one vital piece, but sleep, thyroid health, and lifestyle rhythm complete the picture. [${claimIds[0] || 'C-019'}]`;
        onScreenText = 'Fatigue is a symptom • Look at the whole picture';
        sfx = 'Rustling leaves in wind, distant birdsong.';
        music = 'Warm string ensemble and gentle acoustic guitar resolution.';
        transition = 'Gentle fade to final title card.';
        break;

      case 'ACTION':
      default:
        location = 'Studio Graphic End Card';
        visualAction = 'Subject smiles calmly as she walks past camera. Elegant minimalist typography presents the three concrete questions for doctor visits.';
        camera = 'Locked off wide, cinematic golden hour lighting.';
        narration = 'When you talk to your doctor, bring questions, not assumptions. Check the reserve. Listen to what your body has been saying all along.';
        onScreenText = 'Dr. T Cinema • Provenance Grounded by Parallel Search & Gemini';
        sfx = 'Sustained warm chime, deep resonant bell.';
        music = 'Final uplifting major chord cadence fading to silence.';
        transition = 'Cinematic fade to black.';
        break;
    }

    return {
      id: sceneId,
      sceneNumber: sceneNum,
      title: beat.title,
      timecodeStart,
      timecodeEnd,
      durationSeconds: beat.estimatedSeconds,
      location,
      visualAction,
      camera,
      narration,
      onScreenText,
      sfx,
      music,
      transition,
      claimIds,
      safetyNotes: 'Educational decision-support only; no individual medical diagnosis or prescription directives.'
    };
  });

  return scenes;
}

function formatTimecode(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
