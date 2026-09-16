// =========================================================================
// DR. T CINEMA — EXPORT CENTER SERVICE
// Generates production-ready packages, subtitles, and social distributions
// =========================================================================

import { CinemaProject } from '../types';

export function generateSrtSubtitles(project: CinemaProject): string {
  let srt = '';
  project.scenes.forEach((scene, idx) => {
    const index = idx + 1;
    const startParts = scene.timecodeStart.split(':');
    const endParts = scene.timecodeEnd.split(':');
    const startSrt = `00:${startParts[0] || '00'}:${startParts[1] || '00'},000`;
    const endSrt = `00:${endParts[0] || '00'}:${endParts[1] || '00'},000`;

    srt += `${index}\n${startSrt} --> ${endSrt}\n${scene.narration.replace(/\[C-\d+\]/g, '').trim()}\n\n`;
  });
  return srt.trim();
}

export function generateVttSubtitles(project: CinemaProject): string {
  let vtt = 'WEBVTT - Dr. T Cinema Autonomous Production Studio\n\n';
  project.scenes.forEach((scene) => {
    const startParts = scene.timecodeStart.split(':');
    const endParts = scene.timecodeEnd.split(':');
    const startVtt = `00:${startParts[0] || '00'}:${startParts[1] || '00'}.000`;
    const endVtt = `00:${endParts[0] || '00'}:${endParts[1] || '00'}.000`;

    vtt += `${startVtt} --> ${endVtt}\n<v Narration>${scene.narration.replace(/\[C-\d+\]/g, '').trim()}</v>\n\n`;
  });
  return vtt.trim();
}

export function generateTranscriptText(project: CinemaProject): string {
  let txt = `========================================================================\n`;
  txt += `PROJECT: ${project.title.toUpperCase()}\n`;
  txt += `FORMAT: ${project.format} | DURATION: ${project.durationSeconds}s\n`;
  txt += `PROVENANCE: Grounded by Parallel Search & Google Gemini\n`;
  txt += `========================================================================\n\n`;

  project.scenes.forEach(scene => {
    txt += `[${scene.timecodeStart} - ${scene.timecodeEnd}] ${scene.title.toUpperCase()}\n`;
    txt += `Visual: ${scene.visualAction}\n`;
    txt += `Narration: "${scene.narration}"\n`;
    if (scene.onScreenText) {
      txt += `On-Screen Text: "${scene.onScreenText}"\n`;
    }
    txt += `\n`;
  });

  return txt;
}

export function generateDirectorPackageMarkdown(project: CinemaProject): string {
  let md = `# DIRECTOR PRODUCTION PACKAGE: ${project.title.toUpperCase()}\n\n`;
  md += `**Logline:** ${project.logline}\n\n`;
  md += `**Format:** ${project.format} | **Duration:** ${project.durationSeconds} Seconds | **Visual Style:** ${project.visualStyle}\n`;
  md += `**Audience:** ${project.targetAudience}\n`;
  md += `**Provenance Engine:** Parallel Search & Google Gemini (Autonomous Multi-Agent Studio)\n\n`;

  md += `## 1. CREATIVE BRIEF & STRATEGY\n`;
  md += `- **Objective:** ${project.brief.objective}\n`;
  md += `- **Tone:** ${project.brief.tone}\n`;
  md += `- **Narrative Strategy:** ${project.brief.narrativeStrategy}\n\n`;

  md += `## 2. PRODUCTION SCREENPLAY\n\n`;
  project.scenes.forEach(scene => {
    md += `### SCENE ${scene.sceneNumber}: ${scene.title.toUpperCase()} (${scene.timecodeStart} – ${scene.timecodeEnd})\n`;
    md += `**Location:** ${scene.location}\n`;
    md += `**Camera:** ${scene.camera}\n`;
    md += `**Visual Action:** ${scene.visualAction}\n`;
    md += `**Narration:** "${scene.narration}"\n`;
    if (scene.onScreenText) md += `**On-Screen Graphic:** ${scene.onScreenText}\n`;
    md += `**Audio/SFX:** ${scene.sfx} | Music: ${scene.music}\n`;
    if (scene.claimIds.length > 0) md += `**Evidence Claims Linked:** ${scene.claimIds.join(', ')}\n`;
    md += `\n---\n\n`;
  });

  md += `## 3. SHOT LIST (${project.shots.length} SHOTS)\n\n`;
  md += `| Shot ID | Scene | Duration | Type | Movement | Lens | Subject |\n`;
  md += `| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;
  project.shots.forEach(s => {
    md += `| ${s.shotId} | ${s.sceneId} | ${s.durationSeconds}s | ${s.shotType} | ${s.cameraMovement} | ${s.lensStyle} | ${s.subject.slice(0, 30)}... |\n`;
  });

  md += `\n## 4. PRODUCTION SHOOTING SCHEDULE\n\n`;
  project.schedule.forEach(block => {
    md += `### DAY ${block.day}: ${block.timeRange} — ${block.activity}\n`;
    md += `- **Location:** ${block.location}\n`;
    md += `- **Scenes:** ${block.sceneReferences.join(', ')}\n`;
    md += `- **Crew Notes:** ${block.crewNotes}\n\n`;
  });

  md += `## 5. QUALITY & SAFETY REPORT\n`;
  md += `- **Overall Score:** ${project.qualityReport.overallScore}/100\n`;
  md += `- **Factuality:** ${project.qualityReport.factualityScore}/100\n`;
  md += `- **Source Quality:** ${project.qualityReport.sourceQualityScore}/100\n`;
  md += `- **Medical Safety:** ${project.qualityReport.safetyScore}/100\n`;
  md += `- **Status:** ${project.qualityReport.approvedForDistribution ? 'APPROVED FOR BROADCAST' : 'REVISION REQUIRED'}\n\n`;

  return md;
}

export function generateEvidencePackageJson(project: CinemaProject): string {
  const payload = {
    projectTitle: project.title,
    generatedAt: new Date().toISOString(),
    partnerProvider: 'Parallel Search',
    orchestrator: 'Google Gemini',
    claims: project.claims,
    sources: project.sources,
    traceabilityGraph: project.scenes.map(s => ({
      sceneId: s.id,
      sceneNumber: s.sceneNumber,
      timecode: `${s.timecodeStart} - ${s.timecodeEnd}`,
      claims: s.claimIds,
      shots: project.shots.filter(shot => shot.sceneId === s.id).map(shot => ({
        shotId: shot.shotId,
        type: shot.shotType,
        claimId: shot.claimId
      }))
    }))
  };

  return JSON.stringify(payload, null, 2);
}

export function generateSocialCopyPackage(project: CinemaProject) {
  return [
    {
      platform: 'YouTube',
      title: `${project.title}: Why You Feel Tired Even With Normal Blood Tests`,
      description: `Ever felt completely exhausted, but your doctor says your blood tests are "normal"? In this 90-second evidence-grounded explainer, we explore ferritin—the hidden cellular reserve that powers human vitality.\n\n🔬 Evidence grounded by Parallel Search & Dr. T Cinema.\nSources include The Lancet Haematology, JAMA Internal Medicine, and NEJM.\n\n#Health #IronDeficiency #Ferritin #ScienceExplained #DrTCinema`,
      thumbnailHook: 'WHY LABS SAY "NORMAL" BUT YOU FEEL EXHAUSTED',
      recommendedDuration: '90s (Full 16:9 4K)'
    },
    {
      platform: 'TikTok & Instagram Reels',
      title: 'The Hidden Reason You’re Tired (That Standard Labs Miss)',
      description: `Your hemoglobin is normal, but your cellular battery is empty 🔋 Meet Ferritin: the backup warehouse your body empties first.\n\nAsk your doctor about ferritin + TIBC on your next visit! #Fatigue #IronReserve #WellnessTips #DoctorExplains #ScienceTok`,
      thumbnailHook: 'NORMAL LABS? WHY YOU ARE STILL TIRED',
      recommendedDuration: '60-90s (Vertical 9:16)'
    },
    {
      platform: 'LinkedIn & Health Organizations',
      title: `Translating Evidence to Screen: ${project.title}`,
      description: `Non-anemic iron deficiency affects millions worldwide yet remains frequently under-recognized. We produced this 90-second cinematic educational package using Dr. T Cinema's autonomous multi-agent pipeline, verifying every clinical claim via Parallel Search across 5 peer-reviewed journals.\n\nEmpowering patients with the right questions transforms health outcomes.`,
      thumbnailHook: 'CLINICAL EVIDENCE TRANSLATION',
      recommendedDuration: '90s (16:9 High-Res)'
    }
  ];
}
