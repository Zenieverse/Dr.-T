// =========================================================================
// DR. T CINEMA — PRODUCTION MANAGER AGENT
// Generates production-ready shot lists, shooting schedules, and asset checklists
// =========================================================================

import { Scene, Shot, ShotListEntry, ProductionScheduleBlock, AssetChecklistItem } from '../types';

export function runProductionManager(scenes: Scene[], shots: Shot[]): {
  shotList: ShotListEntry[];
  schedule: ProductionScheduleBlock[];
  assets: AssetChecklistItem[];
} {
  const shotList: ShotListEntry[] = shots.map((shot, idx) => {
    const parentScene = scenes.find(s => s.id === shot.sceneId) || scenes[0];
    const isCgi = shot.shotType === 'conceptual visualization' || shot.environment.includes('CGI');

    return {
      id: `SL-${String(idx + 1).padStart(2, '0')}`,
      sceneId: shot.sceneId,
      shotId: shot.shotId,
      duration: `${shot.durationSeconds}s`,
      location: isCgi ? 'CGI Render Farm' : parentScene.location,
      talent: isCgi ? 'None (3D Animation)' : 'Lead Actor / Clinician',
      props: isCgi ? 'Molecular PDB coordinates' : 'Smartphone, Lab Sheet, Notebook',
      camera: isCgi ? 'Virtual Cinema 4D Camera' : 'Sony FX9 / 50mm Anamorphic',
      audio: parentScene.sfx || 'Room tone and foley',
      vfx: isCgi ? 'Full 3D Molecular Simulation' : 'Subtle graphics overlay & clean grade',
      status: isCgi ? 'FILMED' : 'READY'
    };
  });

  const schedule: ProductionScheduleBlock[] = [
    {
      day: 1,
      timeRange: '07:30 – 10:00',
      activity: 'Crew call, gear calibration, morning interior sequences (Shots 1-4)',
      location: 'Location A — Studio Apartment',
      sceneReferences: ['SCENE-01', 'SCENE-02'],
      crewNotes: 'Capture natural low-angle morning sunrise light through east windows.'
    },
    {
      day: 1,
      timeRange: '10:30 – 13:00',
      activity: 'Public transit commute and staircase tracking sequences (Shots 5-6)',
      location: 'Location B — Transit Station',
      sceneReferences: ['SCENE-02'],
      crewNotes: 'Steadicam tracking shot. Coordinate background commuter movement.'
    },
    {
      day: 1,
      timeRange: '14:00 – 17:00',
      activity: 'Studio work desk and afternoon fatigue realization (Shots 9-10)',
      location: 'Location C — Architecture Studio',
      sceneReferences: ['SCENE-04', 'SCENE-05'],
      crewNotes: 'Warm side key with soft silk bounce. Record room tone.'
    },
    {
      day: 2,
      timeRange: '09:00 – 12:00',
      activity: 'Clinical consultation and lab discussion scenes (Shots 11-12)',
      location: 'Location D — Primary Care Suite',
      sceneReferences: ['SCENE-06'],
      crewNotes: 'Serene, clean Scandinavian clinic setting. Calibrate tablet display to 6500K.'
    },
    {
      day: 2,
      timeRange: '13:00 – 15:30',
      activity: 'Outdoor park walk and natural breathing sequences (Shots 13-14)',
      location: 'Location E — City Park Greenery',
      sceneReferences: ['SCENE-07'],
      crewNotes: 'Capture dappled golden hour sunlight under tree canopy.'
    },
    {
      day: 2,
      timeRange: '16:00 – 18:00',
      activity: 'Tabletop notebook insert and macro pickup audio (Shots 15-16)',
      location: 'Location F — Quiet Cafe Table',
      sceneReferences: ['SCENE-08'],
      crewNotes: 'Capture 2 minutes of room tone and fountain pen writing foley.'
    }
  ];

  const assets: AssetChecklistItem[] = [
    { id: 'ast-01', category: 'footage', item: 'A-roll live action footage (Sony RAW 4K)', status: 'APPROVED', formatSpecs: '4K ProRes 422 HQ, 24.00 fps, Rec.709' },
    { id: 'ast-02', category: 'footage', item: '3D molecular CGI sequences (Ferritin, Mitochondria, ATP)', status: 'APPROVED', formatSpecs: '3840x2160 EXR multi-pass, 24 fps' },
    { id: 'ast-03', category: 'narration', item: 'Full voiceover master track (Empathetic, professional voice)', status: 'APPROVED', formatSpecs: '48 kHz, 24-bit WAV, -23 LUFS integrated' },
    { id: 'ast-04', category: 'music', item: 'Original score: Warm Rhodes piano, acoustic cello, atmospheric synth', status: 'APPROVED', formatSpecs: 'Stereo master 48 kHz / 24-bit, uncompressed' },
    { id: 'ast-05', category: 'sfx', item: 'Bioluminescent chimes, sub-bass drones, foley footsteps & paper', status: 'APPROVED', formatSpecs: 'Stereo stem mix, -18 dBFS true peak' },
    { id: 'ast-06', category: 'graphics', item: 'On-screen clinical annotations, claim citations [C-001], question cards', status: 'APPROVED', formatSpecs: 'Vector motion graphics / After Effects comps' },
    { id: 'ast-07', category: 'captions', item: 'Timecoded subtitles & accessibility captions (SRT, VTT, TXT)', status: 'APPROVED', formatSpecs: 'CEA-608 / WebVTT compliant, 100% synchronized' },
    { id: 'ast-08', category: 'citations', item: 'Full peer-reviewed bibliography & Parallel Search evidence ledger', status: 'APPROVED', formatSpecs: 'Markdown, PDF export & JSON data payload' },
    { id: 'ast-09', category: 'thumbnails', item: 'High-contrast cinematic thumbnails for YouTube & social distribution', status: 'APPROVED', formatSpecs: '1920x1080 & 1080x1920 PNG, 300 DPI' }
  ];

  return { shotList, schedule, assets };
}
