// =========================================================================
// DR. T CINEMA — DEMO PROJECTS & SEEDED PRODUCTION PACKAGES
// "The Hidden Reserve — What Iron Stores Tell Us About the Body"
// =========================================================================

import { CinemaProject } from '../types';

export const DEMO_PROJECT_HIDDEN_RESERVE: CinemaProject = {
  id: 'proj-cinema-iron-001',
  title: 'The Hidden Reserve',
  logline: 'When fatigue is not lack of willpower, but an empty cellular battery: an evidence-grounded journey inside human iron stores.',
  targetAudience: 'General public, adults experiencing chronic unexplained fatigue, science and health educators',
  durationSeconds: 90,
  format: '90-Second Cinematic Science & Health Explainer',
  visualStyle: 'Humanist',
  currentState: 'COMPLETE',
  createdAt: '2026-09-06T10:04:12Z',
  updatedAt: '2026-09-06T10:06:45Z',
  version: 3,
  targetLanguage: 'en',

  brief: {
    projectTitle: 'The Hidden Reserve',
    logline: 'When fatigue is not lack of willpower, but an empty cellular battery: an evidence-grounded journey inside human iron stores.',
    audience: 'General public, adults experiencing chronic unexplained fatigue, science and health educators',
    objective: 'Empower viewers to understand that persistent fatigue can reflect depleted tissue iron storage (ferritin) even when hemoglobin numbers appear normal on standard blood counts, encouraging informed dialogue with their physician.',
    format: '90-Second Cinematic Science & Health Explainer',
    durationSeconds: 90,
    tone: 'Warm, contemplative, scientifically rigorous, empathetic, never alarmist',
    visualLanguage: 'Humanist',
    narrativeStrategy: 'Hook with human tactile fatigue -> deconstruct the invisible reserve -> visualize mitochondrial oxygen delivery -> clarify biomarker nuance -> close on clinician partnership',
    successCriteria: [
      '100% of factual assertions traceable to peer-reviewed evidence',
      'Clear distinction between iron storage deficiency and overt anemia',
      'No prescriptive medical directives; strict clinical decision-support framing',
      'Cinematic pacing calibrated for digital broadcast and health education channels'
    ]
  },

  researchQueries: [
    {
      id: 'rq-001',
      query: 'non-anemic iron deficiency fatigue mechanisms mitochondria ATP ferritin threshold',
      purpose: 'Establish physiological causality between ferritin depletion and cellular fatigue without anemia',
      status: 'COMPLETED',
      sourcesFound: 14,
      claimsDerived: 6,
      timestamp: '2026-09-06T10:04:18Z'
    },
    {
      id: 'rq-002',
      query: 'serum ferritin reference ranges clinical consensus Lancet JAMA hematology 2024',
      purpose: 'Determine contemporary reference interval consensus and normal vs optimal thresholds',
      status: 'COMPLETED',
      sourcesFound: 11,
      claimsDerived: 5,
      timestamp: '2026-09-06T10:04:25Z'
    },
    {
      id: 'rq-003',
      query: 'iron bisglycinate oral tolerance bioavailability randomized controlled trials',
      purpose: 'Assess non-pharmacological and dietary counseling evidence base',
      status: 'COMPLETED',
      sourcesFound: 9,
      claimsDerived: 4,
      timestamp: '2026-09-06T10:04:32Z'
    }
  ],

  sources: [
    {
      id: 'src-001',
      title: 'Iron deficiency without anemia: a common, recognized yet frequently overlooked clinical condition',
      publisher: 'The Lancet Haematology',
      author: 'Cappellini M.D., Musallam K.M., Taher A.T.',
      publicationDate: '2023-08-15',
      url: 'https://doi.org/10.1016/S2352-3026(23)00192-4',
      snippet: 'Tissue iron deficiency occurs before reductions in hemoglobin. Symptoms including fatigue, cognitive fog, and reduced exercise capacity occur when iron-dependent enzymes in mitochondrial complexes I and II lack prosthetic groups.',
      credibilityScore: 98,
      methodology: 'Systematic Review & Meta-Analysis of 62 trials',
      peerReviewed: true,
      doi: '10.1016/S2352-3026(23)00192-4'
    },
    {
      id: 'src-002',
      title: 'Efficacy of iron supplementation in non-anemic pregnant and reproductive-age women: a randomized controlled trial',
      publisher: 'JAMA Internal Medicine',
      author: 'Vaucher P., Druais P.L., Waldvogel S., Favrat B.',
      publicationDate: '2022-04-18',
      url: 'https://doi.org/10.1001/jamainternmed.2022.0894',
      snippet: 'In women with unexplained fatigue and serum ferritin below 30 ng/mL, iron supplementation decreased fatigue scores by 48% versus 29% in the placebo cohort (p < 0.001) despite normal baseline hemoglobin levels.',
      credibilityScore: 96,
      methodology: 'Double-blind, Randomized Placebo-Controlled Trial (N=198)',
      peerReviewed: true,
      doi: '10.1001/jamainternmed.2022.0894'
    },
    {
      id: 'src-003',
      title: 'Ferritin as a key intracellular iron storage nanocage: Structure, release kinetics and clinical interpretation',
      publisher: 'Cell Chemical Biology',
      author: 'Arosio P., Ingrassia R., Cavadini P.',
      publicationDate: '2023-11-10',
      url: 'https://doi.org/10.1016/j.chembiol.2023.09.004',
      snippet: 'Ferritin is a spherical 24-subunit protein nanocage capable of storing up to 4,500 iron atoms in a non-toxic ferric oxide-phosphate core, serving as the body primary reserve for erythropoiesis and cellular metabolism.',
      credibilityScore: 97,
      methodology: 'Biochemical Structure & Electron Microscopy Review',
      peerReviewed: true,
      doi: '10.1016/j.chembiol.2023.09.004'
    },
    {
      id: 'src-004',
      title: 'Fatigue is a symptom, not a diagnosis: Clinical guidelines for systematic outpatient workup',
      publisher: 'New England Journal of Medicine (NEJM)',
      author: 'Rosenthal T.C., Silverstein D.A.',
      publicationDate: '2024-01-22',
      url: 'https://doi.org/10.1056/NEJMcp2308912',
      snippet: 'Unexplained persistent fatigue must be systematically investigated without premature attribution. Differential workup requires ruling out sleep architecture disorders, thyroid dysregulation, chronic inflammation, and iron deficiency.',
      credibilityScore: 99,
      methodology: 'Clinical Practice Guideline Synthesis',
      peerReviewed: true,
      doi: '10.1056/NEJMcp2308912'
    },
    {
      id: 'src-005',
      title: 'Mitochondrial biogenesis and oxidative phosphorylation dependency on iron-sulfur clusters',
      publisher: 'Nature Reviews Molecular Cell Biology',
      author: 'Lill R., Freibert S.A.',
      publicationDate: '2024-03-05',
      url: 'https://doi.org/10.1038/s41580-024-00698-x',
      snippet: 'Iron-sulfur [Fe-S] clusters synthesized inside mitochondria are indispensable for complexes I, II, and III of the electron transport chain. Depletion leads directly to diminished ATP generation per glucose molecule.',
      credibilityScore: 99,
      methodology: 'Molecular Biology Mechanistic Review',
      peerReviewed: true,
      doi: '10.1038/s41580-024-00698-x'
    }
  ],

  claims: [
    {
      id: 'C-001',
      statement: 'Tissue iron deficiency can occur and cause pronounced fatigue even when blood hemoglobin concentrations remain within normal reference limits.',
      category: 'clinical',
      status: 'VERIFIED',
      confidence: 'HIGH',
      sourceIds: ['src-001', 'src-002'],
      supportedQuotes: [
        'Tissue iron deficiency occurs before reductions in hemoglobin.',
        'Iron supplementation decreased fatigue scores by 48% versus 29% in the placebo cohort despite normal baseline hemoglobin levels.'
      ],
      scriptUsages: [
        { sceneId: 'SCENE-02', shotId: 'SHOT-03', lineReference: 'Narration line 2: "Your blood test says your hemoglobin is completely normal. Yet waking up feels like pushing through deep water."' },
        { sceneId: 'SCENE-06', shotId: 'SHOT-11', lineReference: 'Narration line 1: "A standard complete blood count only checks circulating red blood cells. It does not measure the warehouse."' }
      ],
      factCheckerNotes: 'Supported by multiple double-blind RCTs and Lancet Haematology meta-analysis.'
    },
    {
      id: 'C-004',
      statement: 'Ferritin functions as an intracellular spherical nanocage that securely stores up to 4,500 iron atoms in reserve.',
      category: 'biochemical',
      status: 'VERIFIED',
      confidence: 'HIGH',
      sourceIds: ['src-003'],
      supportedQuotes: [
        'Ferritin is a spherical 24-subunit protein nanocage capable of storing up to 4,500 iron atoms in a non-toxic ferric core.'
      ],
      scriptUsages: [
        { sceneId: 'SCENE-03', shotId: 'SHOT-05', lineReference: 'Narration line 1: "Deep inside your cells lies an intricate microscopic sphere called ferritin: a cellular reserve holding thousands of iron atoms ready for release."' }
      ],
      factCheckerNotes: 'Precise biochemical structure verified via Cell Chemical Biology.'
    },
    {
      id: 'C-009',
      statement: 'Cellular energy production (ATP) in mitochondria relies directly on iron-sulfur clusters in the electron transport chain.',
      category: 'physiological',
      status: 'VERIFIED',
      confidence: 'HIGH',
      sourceIds: ['src-001', 'src-005'],
      supportedQuotes: [
        'Iron-sulfur [Fe-S] clusters synthesized inside mitochondria are indispensable for complexes I, II, and III of the electron transport chain.'
      ],
      scriptUsages: [
        { sceneId: 'SCENE-04', shotId: 'SHOT-07', lineReference: 'Narration line 2: "Mitochondria need iron to assemble the electron transport chain that turns oxygen into cellular stamina."' }
      ],
      factCheckerNotes: 'Mitochondrial biology consensus verified.'
    },
    {
      id: 'C-014',
      statement: 'Clinical trials demonstrate that replenishing depleted iron stores in non-anemic fatigued individuals with low ferritin significantly improves vitality scores.',
      category: 'clinical',
      status: 'VERIFIED',
      confidence: 'HIGH',
      sourceIds: ['src-001', 'src-002'],
      supportedQuotes: [
        'In women with unexplained fatigue and serum ferritin below 30 ng/mL, iron supplementation decreased fatigue scores by 48% versus 29% in the placebo cohort.'
      ],
      scriptUsages: [
        { sceneId: 'SCENE-05', shotId: 'SHOT-09', lineReference: 'Narration line 1: "In clinical trials, restoring depleted ferritin stores without anemia significantly improved physical energy and cognitive clarity."' }
      ],
      factCheckerNotes: 'Randomized clinical trial evidence verified in JAMA Internal Medicine.'
    },
    {
      id: 'C-019',
      statement: 'Fatigue is a clinical symptom requiring comprehensive physician differential workup, not a standalone diagnosis or single-cause condition.',
      category: 'clinical',
      status: 'VERIFIED',
      confidence: 'HIGH',
      sourceIds: ['src-004'],
      supportedQuotes: [
        'Unexplained persistent fatigue must be systematically investigated without premature attribution.'
      ],
      scriptUsages: [
        { sceneId: 'SCENE-07', shotId: 'SHOT-13', lineReference: 'Narration line 1: "Fatigue is a symptom, not a diagnosis. Iron is one vital piece, but sleep, thyroid function, and lifestyle rhythm complete the picture."' }
      ],
      factCheckerNotes: 'Crucial clinical safety qualifier confirmed by NEJM clinical guidelines.'
    }
  ],

  storyBeats: [
    { id: 'beat-1', type: 'HOOK', title: 'The Gravity of Tiredness', objective: 'Establish relatable, tactile physical exhaustion', emotionalTone: 'Intimate, quiet, authentic', estimatedSeconds: 11 },
    { id: 'beat-2', type: 'HUMAN_QUESTION', title: 'The Normal Test Paradox', objective: 'Present the tension of "normal" blood labs versus persistent fatigue', emotionalTone: 'Curious, validating', estimatedSeconds: 12 },
    { id: 'beat-3', type: 'CONTEXT', title: 'The Hidden Warehouse', objective: 'Introduce ferritin as the cellular backup battery', emotionalTone: 'Illuminating, wondrous', estimatedSeconds: 12 },
    { id: 'beat-4', type: 'DISCOVERY', title: 'Inside the Mitochondria', objective: 'Visualize ATP generation and iron-sulfur complexes', emotionalTone: 'Cinematic, wondrous', estimatedSeconds: 14 },
    { id: 'beat-5', type: 'TENSION', title: 'Running on Empty Reserves', objective: 'Explain what happens when ferritin drops before hemoglobin drops', emotionalTone: 'Revelatory, grounding', estimatedSeconds: 12 },
    { id: 'beat-6', type: 'EXPLANATION', title: 'What the Test Tells Us', objective: 'Clarify CBC vs. Ferritin panel nuance', emotionalTone: 'Precise, empowering', estimatedSeconds: 11 },
    { id: 'beat-7', type: 'INSIGHT', title: 'A Piece of the Mosaic', objective: 'Emphasize differential workup and avoid oversimplification', emotionalTone: 'Balanced, thoughtful', estimatedSeconds: 9 },
    { id: 'beat-8', type: 'ACTION', title: 'The Empowered Consultation', objective: 'Provide concrete questions for the viewer next doctor visit', emotionalTone: 'Inspiring, proactive', estimatedSeconds: 9 }
  ],

  scenes: [
    {
      id: 'SCENE-01',
      sceneNumber: 1,
      title: 'The Weight of the Morning',
      timecodeStart: '00:00',
      timecodeEnd: '00:11',
      durationSeconds: 11,
      location: 'Warm Sunlit Bedroom / Kitchen',
      visualAction: 'A young architect sits on the edge of the bed. Warm early morning light rakes across the wooden floor. She laces her shoes with deliberate, heavy slowness.',
      camera: 'Slow handheld 50mm, eye-level, gentle natural breathing movement.',
      narration: 'You slept eight hours. The morning sun is gentle. But stepping onto the floor feels like carrying silent sandbags on your shoulders.',
      onScreenText: 'THE HIDDEN RESERVE',
      sfx: 'Soft morning ambient room tone, distant ticking wall clock, quiet exhale.',
      music: 'Subtle ambient Rhodes piano chords in C-major, gentle warm cello drone.',
      transition: 'Soft cinematic dissolve to staircase.',
      claimIds: [],
      safetyNotes: 'Set empathetic tone without clinical alarmism.'
    },
    {
      id: 'SCENE-02',
      sceneNumber: 2,
      title: 'The Paradox of Normal',
      timecodeStart: '00:11',
      timecodeEnd: '00:23',
      durationSeconds: 12,
      location: 'Subway Staircase / City Commute',
      visualAction: 'She climbs subway stairs alongside brisk commuters. Her pace slows at the midpoint. She looks down at a laboratory result sheet on her phone: "Hemoglobin: Normal".',
      camera: '35mm slow tracking profile shot. Slight frame rate shift (48fps to 24fps) conveying drag.',
      narration: 'Your blood test says your hemoglobin is completely normal. Yet getting through the afternoon feels like pushing through deep water. How can your labs be fine when your body feels empty? [C-001]',
      onScreenText: 'Hemoglobin: 13.8 g/dL (Normal)',
      sfx: 'Footsteps echoing, subway rumble fading to muffled underwater acoustics.',
      music: 'A warm acoustic guitar motif enters, questioning and contemplative.',
      transition: 'Macro transition into cellular light particles.',
      claimIds: ['C-001'],
      safetyNotes: 'Validates real patient experience while highlighting lab subtlety.'
    },
    {
      id: 'SCENE-03',
      sceneNumber: 3,
      title: 'The Cellular Warehouse',
      timecodeStart: '00:23',
      timecodeEnd: '00:35',
      durationSeconds: 12,
      location: 'Microscopic Biological Interior (Cinematic CGI)',
      visualAction: 'Camera travels smoothly into a warm, luminous biological interior. A geometric protein sphere shines in amber-gold light: ferritin, holding clusters of shimmering iron atoms.',
      camera: 'Virtual macro probe lens, fluid rotational drift around the ferritin nanocage.',
      narration: 'Deep inside your cells lies an intricate microscopic sphere called ferritin: a cellular reserve holding thousands of iron atoms ready for release. [C-004]',
      onScreenText: 'Ferritin: The Body Storage Vault',
      sfx: 'Resonant sub-bass hum, crystalline chime as iron particles pulse with energy.',
      music: 'Atmospheric strings rise with warm brass pads, evoking wonder.',
      transition: 'Seamless zoom into mitochondrial inner membrane.',
      claimIds: ['C-004'],
      safetyNotes: 'Physiologically grounded protein visualization based on electron crystallography.'
    },
    {
      id: 'SCENE-04',
      sceneNumber: 4,
      title: 'The Engine of Energy',
      timecodeStart: '00:35',
      timecodeEnd: '00:49',
      durationSeconds: 14,
      location: 'Mitochondrial Matrix / Molecular Animation',
      visualAction: 'Luminous electron transport chains rotate rhythmically. Glowing iron-sulfur clusters transfer electrons, synthesizing bursts of sparkling ATP energy molecules.',
      camera: 'Dynamic glide along the inner mitochondrial folds; luminous particle trails.',
      narration: 'We often think iron only carries oxygen in our blood. But your mitochondria need iron to assemble the electron transport chain that turns oxygen into cellular stamina. [C-009]',
      onScreenText: 'Mitochondrial Energy • ATP Synthesis',
      sfx: 'Rhythmic hum of cellular respiration, soft percussive heartbeat pulse.',
      music: 'Uplifting crescendo of analog synthesizer and live acoustic viola.',
      transition: 'Fluid match-cut to woman pausing at her design drafting desk.',
      claimIds: ['C-009'],
      safetyNotes: 'Explains true biochemical role beyond simple hemoglobin oxygen transport.'
    },
    {
      id: 'SCENE-05',
      sceneNumber: 5,
      title: 'The Depleted Warehouse',
      timecodeStart: '00:49',
      timecodeEnd: '00:61',
      durationSeconds: 12,
      location: 'Modern Architectural Studio / Warm Sunlight',
      visualAction: 'At her desk, she rests her forehead against her palms for three seconds. Split screen overlay shows the ferritin nanocage with depleted empty cores.',
      camera: 'Medium intimate shot, 85mm portrait lens with creamy shallow depth of field.',
      narration: 'Before your body ever runs out of hemoglobin in the bloodstream, it quietly empties this backup warehouse. When ferritin drops, your cellular batteries run on empty. [C-014]',
      onScreenText: 'Depleted Storage • Preserved Bloodstream',
      sfx: 'Soft pencil roll across paper, gentle room tone.',
      music: 'Tension resolves into a gentle, supportive piano phrase.',
      transition: 'Clean graphic wipe to laboratory report overlay.',
      claimIds: ['C-014'],
      safetyNotes: 'Accurately describes sequential pathophysiology of iron deficiency stages.'
    },
    {
      id: 'SCENE-06',
      sceneNumber: 6,
      title: 'What the Test Can and Cannot Tell Us',
      timecodeStart: '00:61',
      timecodeEnd: '00:72',
      durationSeconds: 11,
      location: 'Clinical Consultation Office / Minimal Warm Wood',
      visualAction: 'A friendly clinician reviews a digital tablet alongside the patient. A clear graphical chart contrasts CBC (circulating red cells) with Serum Ferritin (reserve storage).',
      camera: 'Two-shot over the shoulder, warm natural daylight from tall clinic window.',
      narration: 'A standard blood count only checks circulating red cells. It does not measure the warehouse. Asking your clinician to check your serum ferritin reveals the reserve. [C-001]',
      onScreenText: 'Ask for: Serum Ferritin + Total Iron Binding Capacity',
      sfx: 'Subtle paper rustle, calm conversational room acoustic.',
      music: 'Harmonious acoustic fingerpicking guitar with soft upright bass.',
      transition: 'Gentle cut to exterior city park bench.',
      claimIds: ['C-001'],
      safetyNotes: 'Positions lab test as a discussion topic with personal clinician.'
    },
    {
      id: 'SCENE-07',
      sceneNumber: 7,
      title: 'A Piece of the Mosaic',
      timecodeStart: '00:72',
      timecodeEnd: '00:81',
      durationSeconds: 9,
      location: 'Quiet City Park / Tree Canopy',
      visualAction: 'She walks under sunlit green sycamore leaves, breathing deeply. Subtle graphic cards float alongside: "Sleep Architecture", "Thyroid", "Iron Reserve", "Stress".',
      camera: 'Steadycam forward tracking shot, subject walking toward camera with relaxed posture.',
      narration: 'Fatigue is a symptom, not a diagnosis. Iron is one vital piece, but sleep, thyroid health, and lifestyle rhythm complete the picture. [C-019]',
      onScreenText: 'Fatigue is a symptom • Look at the whole picture',
      sfx: 'Rustling leaves in wind, distant birdsong.',
      music: 'Warm string ensemble and gentle acoustic guitar resolution.',
      transition: 'Gentle fade to final title card.',
      claimIds: ['C-019'],
      safetyNotes: 'Mandatory clinical safety disclaimer: prevents diagnostic fixation.'
    },
    {
      id: 'SCENE-08',
      sceneNumber: 8,
      title: 'Knowledge in Your Hands',
      timecodeStart: '00:81',
      timecodeEnd: '00:90',
      durationSeconds: 9,
      location: 'Clean Studio Title Card / Cinematic Branding',
      visualAction: 'Patient smiles calmly as she walks past camera. Elegant minimalist typography presents the three concrete questions for healthcare appointments.',
      camera: 'Locked off wide, cinematic golden hour lighting.',
      narration: 'When you talk to your doctor, bring questions, not assumptions. Check the reserve. Listen to what your body has been saying all along.',
      onScreenText: 'Dr. T Cinema • Evidence Grounded by Parallel Search & Gemini',
      sfx: 'Sustained warm chime, deep resonant bell.',
      music: 'Final uplifting major chord cadence fading to silence.',
      transition: 'Cinematic fade to black.',
      claimIds: [],
      safetyNotes: 'Empowering final call-to-action supporting patient-clinician partnership.'
    }
  ],

  shots: [
    {
      shotId: 'SHOT-01',
      sceneId: 'SCENE-01',
      shotNumber: 1,
      durationSeconds: 5,
      shotType: 'wide',
      cameraMovement: 'Slow slow push-in',
      lensStyle: '50mm anamorphic T1.5',
      composition: 'Rule of thirds, morning window on left, subject seated right',
      subject: 'Architect waking up on edge of bed',
      environment: 'Warm minimalist bedroom, linen sheets, oak flooring',
      lighting: 'Low-angle golden sunrise light cutting across room dust motes',
      colorMood: 'Warm amber and soft shadows (2700K)',
      visualAction: 'Sits still for a moment, taking a deliberate heavy breath',
      transition: 'Dissolve to Shot 2',
      thumbnailPrompt: 'Cinematic wide shot of a tired young woman sitting on the edge of a bed in morning golden light, minimalist bedroom, photorealistic, 35mm anamorphic'
    },
    {
      shotId: 'SHOT-02',
      sceneId: 'SCENE-01',
      shotNumber: 2,
      durationSeconds: 6,
      shotType: 'close-up',
      cameraMovement: 'Static tripod',
      lensStyle: '85mm macro',
      composition: 'Tight framing on hands tying shoe laces',
      subject: 'Hands slowly knotting running shoe lace',
      environment: 'Bedroom floor, soft carpet texture',
      lighting: 'Diffused directional side key',
      colorMood: 'Warm ochre and cool shadow contrast',
      visualAction: 'Fingers pause mid-knot, conveying profound muscular tiredness',
      transition: 'Hard cut to Shot 3',
      thumbnailPrompt: 'Cinematic close-up of hands tying shoe laces slowly in morning light, shallow depth of field, documentary style'
    },
    {
      shotId: 'SHOT-03',
      sceneId: 'SCENE-02',
      shotNumber: 3,
      durationSeconds: 6,
      shotType: 'medium',
      cameraMovement: 'Handheld tracking backward',
      lensStyle: '35mm prime',
      composition: 'Center framed against rushing commuters',
      subject: 'Woman climbing crowded subway stairs',
      environment: 'Metropolitan subway exit with morning commuters in blur',
      lighting: 'Cool subterranean fluoros transitioning to hot daylight above',
      colorMood: 'Cool slate blue transitioning to amber daylight',
      visualAction: 'She pauses on the handrail, breathing slowly while crowd streams past',
      transition: 'Cut to Shot 4',
      thumbnailPrompt: 'Medium tracking shot of woman paused on subway stairs surrounded by blurred commuters, cinematic lighting, 35mm film grain',
      claimId: 'C-001'
    },
    {
      shotId: 'SHOT-04',
      sceneId: 'SCENE-02',
      shotNumber: 4,
      durationSeconds: 6,
      shotType: 'POV',
      cameraMovement: 'Subtle hand breathing',
      lensStyle: '50mm',
      composition: 'POV looking down at smartphone screen',
      subject: 'Laboratory blood test app displaying "Hemoglobin: 13.8 (Normal)"',
      environment: 'Subway platform daylight edge',
      lighting: 'Soft overhead daylight',
      colorMood: 'Neutral clean clinical UI contrast',
      visualAction: 'Thumb scrolls past normal results to unresolved question',
      transition: 'Macro blur transition into cellular CGI',
      thumbnailPrompt: 'First person POV shot holding modern smartphone with blood test result showing normal hemoglobin, morning city background blurred',
      claimId: 'C-001'
    },
    {
      shotId: 'SHOT-05',
      sceneId: 'SCENE-03',
      shotNumber: 5,
      durationSeconds: 6,
      shotType: 'conceptual visualization',
      cameraMovement: 'Orbital rotation around geometric protein',
      lensStyle: 'Virtual 24mm macro',
      composition: 'Spherical nanocage glowing center-frame',
      subject: 'Ferritin 24-subunit spherical protein nanocage',
      environment: 'Luminous cellular cytoplasm with organic particulate drift',
      lighting: 'Internal amber radiance from stored ferric oxide core',
      colorMood: 'Bioluminescent warm amber and midnight indigo',
      visualAction: 'Nanocage rotates slowly, revealing hundreds of luminous iron atoms inside',
      transition: 'Smooth zoom toward protein pore',
      thumbnailPrompt: '3D scientific visualization of ferritin protein spherical nanocage with glowing golden iron atoms inside, dark microscopic background, cinematic VFX',
      claimId: 'C-004'
    },
    {
      shotId: 'SHOT-06',
      sceneId: 'SCENE-03',
      shotNumber: 6,
      durationSeconds: 6,
      shotType: 'extreme close-up',
      cameraMovement: 'Push through pore',
      lensStyle: 'Virtual macro',
      composition: 'Iron atom lattice structure inside protein',
      subject: 'Crystalline ferric iron storage core',
      environment: 'Protein interior cavity',
      lighting: 'Prismatic diffraction rays',
      colorMood: 'Warm molten gold',
      visualAction: 'Single iron atom releases gracefully into the cytoplasm stream',
      transition: 'Match cut to mitochondrial outer membrane',
      thumbnailPrompt: 'Extreme macro molecular render of iron atoms releasing from protein cavity, golden particle trail, volumetric lighting',
      claimId: 'C-004'
    },
    {
      shotId: 'SHOT-07',
      sceneId: 'SCENE-04',
      shotNumber: 7,
      durationSeconds: 7,
      shotType: 'conceptual visualization',
      cameraMovement: 'Forward glide through mitochondrial cristae',
      lensStyle: 'Virtual wide angle',
      composition: 'Tunneling perspective through cellular power station',
      subject: 'Mitochondrial electron transport chain protein complexes',
      environment: 'Mitochondrial inner membrane folds',
      lighting: 'Pulsing bioluminescent cyan and gold electrical arcs',
      colorMood: 'Electric cyan, deep indigo, warm gold accents',
      visualAction: 'Iron-sulfur clusters glow as electrons flow, producing ATP bursts',
      transition: 'Pan right to ATP synthase rotor',
      thumbnailPrompt: 'Cinematic scientific visualization of mitochondria electron transport chain, glowing iron-sulfur clusters, sparkling ATP molecules, high detail',
      claimId: 'C-009'
    },
    {
      shotId: 'SHOT-08',
      sceneId: 'SCENE-04',
      shotNumber: 8,
      durationSeconds: 7,
      shotType: 'medium',
      cameraMovement: 'Slow slow push',
      lensStyle: '85mm portrait',
      composition: 'Architect at work desk with tracing paper',
      subject: 'Architect drafting a blueprint by window',
      environment: 'Architecture studio with drafting tables and physical models',
      lighting: 'Direct morning sun hitting hands and technical drawings',
      colorMood: 'Warm Scandinavian studio palette (wood, white, glass)',
      visualAction: 'Draws a crisp straight line with technical pen',
      transition: 'Cut to Shot 9',
      thumbnailPrompt: 'Medium shot of architect working at sunlit drafting desk in modern studio, architectural models, golden hour cinematic lighting',
      claimId: 'C-009'
    },
    {
      shotId: 'SHOT-09',
      sceneId: 'SCENE-05',
      shotNumber: 9,
      durationSeconds: 6,
      shotType: 'close-up',
      cameraMovement: 'Static 85mm',
      lensStyle: '85mm T1.4',
      composition: 'Subject profile, head resting in hands',
      subject: 'Architect overwhelmed by sudden afternoon energy crash',
      environment: 'Architectural studio desk',
      lighting: 'Afternoon sun now harsher and lower angle',
      colorMood: 'Warm highlights with desaturated cool skin undertones',
      visualAction: 'Pen drops onto desk; she rubs her eyes with deep fatigue',
      transition: 'Dissolve to Shot 10',
      thumbnailPrompt: 'Close-up of young woman resting face in hands at office desk, genuine physical fatigue, documentary emotion, natural light',
      claimId: 'C-014'
    },
    {
      shotId: 'SHOT-10',
      sceneId: 'SCENE-05',
      shotNumber: 10,
      durationSeconds: 6,
      shotType: 'conceptual visualization',
      cameraMovement: 'Slow pull-back',
      lensStyle: 'Virtual 35mm',
      composition: 'Ferritin nanocage now dim and nearly empty',
      subject: 'Depleted ferritin nanocage with only scattered faint particles',
      environment: 'Dim cellular interior',
      lighting: 'Low wattage ambient bioluminescence',
      colorMood: 'Muted slate, dying embers of gold',
      visualAction: 'Last two iron atoms fade from the core; electron transport slows',
      transition: 'Match dissolve to clinic room',
      thumbnailPrompt: 'Dim, empty molecular nanocage with only a few faint glowing particles left, dark artistic scientific render, dramatic lighting',
      claimId: 'C-014'
    },
    {
      shotId: 'SHOT-11',
      sceneId: 'SCENE-06',
      shotNumber: 11,
      durationSeconds: 6,
      shotType: 'medium',
      cameraMovement: 'Slow tracking dolly',
      lensStyle: '50mm prime',
      composition: 'Patient on left, doctor on right, tablet shared between them',
      subject: 'Patient and physician reviewing lab report together',
      environment: 'Modern Scandinavian-style clinic room with wood slats and plants',
      lighting: 'Soft diffused natural light through frosted glass',
      colorMood: 'Soft sage green, clean white, warm birch wood',
      visualAction: 'Doctor gestures calmly to the ferritin row on the tablet screen',
      transition: 'Cut to Shot 12',
      thumbnailPrompt: 'Two-shot of female doctor and patient reviewing tablet in modern clinic, empathetic conversation, warm natural lighting, professional medical',
      claimId: 'C-001'
    },
    {
      shotId: 'SHOT-12',
      sceneId: 'SCENE-06',
      shotNumber: 12,
      durationSeconds: 5,
      shotType: 'close-up',
      cameraMovement: 'Subtle tilt down',
      lensStyle: '50mm macro',
      composition: 'Tablet screen displaying Serum Ferritin graph and reference scale',
      subject: 'Interactive lab graphic comparing CBC vs Ferritin storage',
      environment: 'Clinic desk surface',
      lighting: 'Neutral screen glow on hands',
      colorMood: 'Clean modern healthcare UI',
      visualAction: 'Doctor finger taps: "Serum Ferritin: 16 ng/mL (Storage Depleted)"',
      transition: 'Cut to Shot 13',
      thumbnailPrompt: 'Close-up of modern digital tablet showing ferritin lab results with clear reference range graph, clinical setting',
      claimId: 'C-001'
    },
    {
      shotId: 'SHOT-13',
      sceneId: 'SCENE-07',
      shotNumber: 13,
      durationSeconds: 5,
      shotType: 'wide',
      cameraMovement: 'Smooth Steadicam forward',
      lensStyle: '35mm anamorphic',
      composition: 'Full body walking through leafy park alley',
      subject: 'Woman walking outdoors under summer tree canopy',
      environment: 'Lush green public park with dappled sunlight',
      lighting: 'Dappled sunlight filtering through green leaves',
      colorMood: 'Rich emerald green, warm sunlight flares',
      visualAction: 'Takes a deep breath of fresh air with renewed perspective',
      transition: 'Cut to Shot 14',
      thumbnailPrompt: 'Cinematic wide shot of woman walking along a sunlit park path under lush green trees, breathing fresh air, optimistic mood, 35mm film',
      claimId: 'C-019'
    },
    {
      shotId: 'SHOT-14',
      sceneId: 'SCENE-07',
      shotNumber: 14,
      durationSeconds: 4,
      shotType: 'medium',
      cameraMovement: 'Static 85mm',
      lensStyle: '85mm portrait',
      composition: 'Subject looking thoughtfully toward horizon',
      subject: 'Woman pausing on park path, serene and grounded',
      environment: 'Park edge overlooking city skyline',
      lighting: 'Golden hour rim light on hair',
      colorMood: 'Warm golden hour palette',
      visualAction: 'Smiles faintly, empowered by understanding her own physiology',
      transition: 'Cut to Shot 15',
      thumbnailPrompt: 'Medium close-up portrait of woman smiling gently in golden hour sunlight, city skyline softly blurred in background, cinematic',
      claimId: 'C-019'
    },
    {
      shotId: 'SHOT-15',
      sceneId: 'SCENE-08',
      shotNumber: 15,
      durationSeconds: 5,
      shotType: 'close-up',
      cameraMovement: 'Static',
      lensStyle: '50mm',
      composition: 'Center aligned graphic layout',
      subject: 'Pocket notebook with 3 handwritten questions for doctor',
      environment: 'Clean wooden cafe table with cup of herbal tea',
      lighting: 'Soft window light',
      colorMood: 'Warm neutral tones',
      visualAction: 'Pen rests beside neatly written bullet points',
      transition: 'Fade to Shot 16',
      thumbnailPrompt: 'Top-down flat lay shot of minimalist notebook with handwritten clinical questions on a wooden table next to tea, elegant aesthetic'
    },
    {
      shotId: 'SHOT-16',
      sceneId: 'SCENE-08',
      shotNumber: 16,
      durationSeconds: 4,
      shotType: 'conceptual visualization',
      cameraMovement: 'Slow subtle pulse',
      lensStyle: 'Graphic frame',
      composition: 'Dr. T Cinema title emblem and provenance certification badge',
      subject: 'Evidence-to-Screen certification card',
      environment: 'Cinematic black studio backdrop',
      lighting: 'Subtle edge illumination',
      colorMood: 'Deep obsidian and gold typography',
      visualAction: 'Parallel Search & Gemini provenance stamp locks into place',
      transition: 'Fade to black',
      thumbnailPrompt: 'Cinematic minimalist title card with gold text reading Dr. T Cinema and Parallel Search verified badge on black background'
    }
  ],

  shotList: [
    { id: 'SL-01', sceneId: 'SCENE-01', shotId: 'SHOT-01', duration: '5s', location: 'Studio Apt (Location A)', talent: 'Lead Actress (Maya)', props: 'Linen bed, bedside clock', camera: 'Sony FX9 / 50mm Anamorphic', audio: 'Room tone, breathing', vfx: 'None', status: 'READY' },
    { id: 'SL-02', sceneId: 'SCENE-01', shotId: 'SHOT-02', duration: '6s', location: 'Studio Apt (Location A)', talent: 'Lead Actress (Maya)', props: 'Running shoes', camera: 'Sony FX9 / 85mm Macro', audio: 'Foley shoe lace tightening', vfx: 'None', status: 'READY' },
    { id: 'SL-03', sceneId: 'SCENE-02', shotId: 'SHOT-03', duration: '6s', location: 'Subway Station (Location B)', talent: 'Maya + 12 Extras', props: 'Commuter bag, phone', camera: 'Steadicam / 35mm', audio: 'Ambient station acoustics', vfx: 'Speed ramp background blur', status: 'READY' },
    { id: 'SL-04', sceneId: 'SCENE-02', shotId: 'SHOT-04', duration: '6s', location: 'Subway Station (Location B)', talent: 'Maya (Hand model)', props: 'Smartphone with lab UI', camera: 'Locked 50mm POV', audio: 'Muffled underwater transition', vfx: 'Screen insert composite', status: 'READY' },
    { id: 'SL-05', sceneId: 'SCENE-03', shotId: 'SHOT-05', duration: '6s', location: 'CGI Render Farm', talent: 'None (CGI)', props: 'Ferritin crystal structure', camera: 'Virtual Cinema 4D camera', audio: 'Sub-bass drone, chime', vfx: 'Full 3D molecular simulation', status: 'FILMED' },
    { id: 'SL-06', sceneId: 'SCENE-03', shotId: 'SHOT-06', duration: '6s', location: 'CGI Render Farm', talent: 'None (CGI)', props: 'Iron atom lattice', camera: 'Virtual Macro probe', audio: 'Granular synthesizer release', vfx: 'Particle dynamics', status: 'FILMED' },
    { id: 'SL-07', sceneId: 'SCENE-04', shotId: 'SHOT-07', duration: '7s', location: 'CGI Render Farm', talent: 'None (CGI)', props: 'Mitochondrial cristae', camera: 'Virtual fly-through', audio: 'Rhythmic low-frequency pulse', vfx: 'Bioluminescent volumetric glow', status: 'FILMED' },
    { id: 'SL-08', sceneId: 'SCENE-04', shotId: 'SHOT-08', duration: '7s', location: 'Architect Studio (Location C)', talent: 'Maya', props: 'Drafting table, blueprints', camera: 'Dolly track / 85mm', audio: 'Pencil on paper', vfx: 'Color grade warm shift', status: 'READY' },
    { id: 'SL-09', sceneId: 'SCENE-05', shotId: 'SHOT-09', duration: '6s', location: 'Architect Studio (Location C)', talent: 'Maya', props: 'Pencil, eye rub', camera: 'Tripod 85mm T1.4', audio: 'Room tone, deep sigh', vfx: 'None', status: 'READY' },
    { id: 'SL-10', sceneId: 'SCENE-05', shotId: 'SHOT-10', duration: '6s', location: 'CGI Render Farm', talent: 'None (CGI)', props: 'Empty ferritin cage', camera: 'Virtual 35mm slow pull', audio: 'Low pass filter fade', vfx: 'Extinguishing glow simulation', status: 'FILMED' },
    { id: 'SL-11', sceneId: 'SCENE-06', shotId: 'SHOT-11', duration: '6s', location: 'Medical Clinic (Location D)', talent: 'Maya + Dr. Sarah Chen', props: 'Doctor desk, iPad Pro', camera: 'Slider / 50mm Prime', audio: 'Clinic room ambience', vfx: 'None', status: 'READY' },
    { id: 'SL-12', sceneId: 'SCENE-06', shotId: 'SHOT-12', duration: '5s', location: 'Medical Clinic (Location D)', talent: 'Doctor Hands', props: 'Tablet screen displaying UI', camera: 'Overhead macro', audio: 'Soft tap', vfx: 'High contrast UI graph insert', status: 'READY' },
    { id: 'SL-13', sceneId: 'SCENE-07', shotId: 'SHOT-13', duration: '5s', location: 'Botanical Park (Location E)', talent: 'Maya', props: 'Casual coat', camera: 'Steadicam / 35mm', audio: 'Wind in leaves, birdsong', vfx: 'Floating typographic motion tracking', status: 'READY' },
    { id: 'SL-14', sceneId: 'SCENE-07', shotId: 'SHOT-14', duration: '4s', location: 'Botanical Park (Location E)', talent: 'Maya', props: 'None', camera: 'Tripod 85mm', audio: 'Deep relaxed breath', vfx: 'Golden hour color enhancement', status: 'READY' },
    { id: 'SL-15', sceneId: 'SCENE-08', shotId: 'SHOT-15', duration: '5s', location: 'Cafe (Location F)', talent: 'Hands', props: 'Moleskine journal, fountain pen', camera: 'Top-down flat-lay 50mm', audio: 'Cafe background, pen click', vfx: 'Clean text highlight animation', status: 'READY' },
    { id: 'SL-16', sceneId: 'SCENE-08', shotId: 'SHOT-16', duration: '4s', location: 'Post-Production Suite', talent: 'None', props: 'Motion graphics typography', camera: 'Digital graphic render', audio: 'Final resolution chime', vfx: 'Parallel Search provenance badge', status: 'READY' }
  ],

  schedule: [
    {
      day: 1,
      timeRange: '07:30 – 09:30',
      activity: 'Crew call, lighting setup & bedroom sequences (Shots 1-2)',
      location: 'Location A — Studio Apartment',
      sceneReferences: ['SCENE-01'],
      crewNotes: 'Capture low-angle golden morning sun through east-facing windows before 9:00 AM.'
    },
    {
      day: 1,
      timeRange: '10:00 – 12:30',
      activity: 'Commute and subway staircase sequences with extras (Shots 3-4)',
      location: 'Location B — Transit Station Plaza',
      sceneReferences: ['SCENE-02'],
      crewNotes: 'Requires transit filming permit. Use Steadicam rig with wide 35mm prime.'
    },
    {
      day: 1,
      timeRange: '13:30 – 16:30',
      activity: 'Architectural studio work sequences & fatigue realization (Shots 8-9)',
      location: 'Location C — Design Studio',
      sceneReferences: ['SCENE-04', 'SCENE-05'],
      crewNotes: 'Coordinate with design office. Natural side key with soft silk bounce.'
    },
    {
      day: 2,
      timeRange: '08:30 – 11:30',
      activity: 'Clinical dialogue & lab review consultation sequences (Shots 11-12)',
      location: 'Location D — Primary Care Suite',
      sceneReferences: ['SCENE-06'],
      crewNotes: 'Clean, serene aesthetic. Tablet screen must be calibrated to 6500K color temperature.'
    },
    {
      day: 2,
      timeRange: '13:00 – 15:30',
      activity: 'Park walking & outdoor renewal sequences (Shots 13-14)',
      location: 'Location E — City Park Greenery',
      sceneReferences: ['SCENE-07'],
      crewNotes: 'Utilize golden hour light. Steadicam operator walking backward.'
    },
    {
      day: 2,
      timeRange: '16:00 – 18:00',
      activity: 'Notebook insert, macro product shots & pickup audio (Shot 15)',
      location: 'Location F — Quiet Cafe Table',
      sceneReferences: ['SCENE-08'],
      crewNotes: 'Record room tone and 2 minutes of quiet fountain pen foley.'
    }
  ],

  assets: [
    { id: 'ast-01', category: 'footage', item: 'A-roll live action footage (Sony RAW 4K)', status: 'APPROVED', formatSpecs: '4K ProRes 422 HQ, 24.00 fps, Rec.709' },
    { id: 'ast-02', category: 'footage', item: '3D molecular CGI sequences (Ferritin, Mitochondria, ATP)', status: 'APPROVED', formatSpecs: '3840x2160 EXR multi-pass, 24 fps' },
    { id: 'ast-03', category: 'narration', item: 'Full voiceover track (Empathetic, clear, professional voice)', status: 'APPROVED', formatSpecs: '48 kHz, 24-bit WAV, -23 LUFS integrated' },
    { id: 'ast-04', category: 'music', item: 'Original score: Warm Rhodes piano, acoustic cello, atmospheric synths', status: 'APPROVED', formatSpecs: 'Stereo master 48 kHz / 24-bit, uncompressed' },
    { id: 'ast-05', category: 'sfx', item: 'Bioluminescent chimes, sub-bass drones, foley footsteps & paper', status: 'APPROVED', formatSpecs: 'Stereo stem mix, -18 dBFS true peak' },
    { id: 'ast-06', category: 'graphics', item: 'On-screen clinical annotations, claim citations [C-001], question cards', status: 'APPROVED', formatSpecs: 'Vector motion graphics / After Effects comps' },
    { id: 'ast-07', category: 'captions', item: 'Timecoded subtitles & accessibility captions (SRT, VTT, TXT)', status: 'APPROVED', formatSpecs: 'CEA-608 / WebVTT compliant, 100% synchronized' },
    { id: 'ast-08', category: 'citations', item: 'Full peer-reviewed bibliography & Parallel Search evidence ledger', status: 'APPROVED', formatSpecs: 'Markdown, PDF export & JSON data payload' },
    { id: 'ast-09', category: 'thumbnails', item: 'High-contrast cinematic thumbnails for YouTube & social distribution', status: 'APPROVED', formatSpecs: '1920x1080 & 1080x1920 PNG, 300 DPI' }
  ],

  qualityReport: {
    factualityScore: 98,
    sourceQualityScore: 97,
    safetyScore: 99,
    narrativeScore: 95,
    productionScore: 96,
    accessibilityScore: 96,
    overallScore: 97,
    factualityNotes: [
      'Every factual assertion is corroborated by at least two distinct peer-reviewed sources (Lancet Haematology, JAMA Internal Medicine, Cell Chemical Biology).',
      'Clear distinction maintained between non-anemic iron deficiency and microcytic anemia.',
      'Exact biochemical stoichiometry of ferritin nanocage (up to 4,500 iron atoms) matches electron crystallography standards.'
    ],
    medicalSafetyNotes: [
      'Zero diagnostic claims made regarding specific viewers.',
      'Explicitly affirms: "Fatigue is a symptom, not a diagnosis" in Scene 07.',
      'Mandates consultation with licensed physician for lab ordering and interpretation.',
      'No prescription directives or unqualified dosage recommendations.'
    ],
    copyrightNotes: [
      'All live action shot lists are original compositions.',
      'Molecular CGI assets generated from open RCSB Protein Data Bank crystal coordinates (PDB: 1FHA).',
      'No third-party copyrighted audio or likenesses.'
    ],
    privacyNotes: [
      'Patient depictions are simulated composite narratives; no HIPAA or protected health information involved.',
      'Actor releases confirmed for all shot list items.'
    ],
    accessibilityNotes: [
      'Synchronized subtitles (VTT/SRT) included with speaker labels and sound descriptions.',
      'Contrast ratio on all on-screen graphics exceeds WCAG 2.1 AA requirements (7:1 contrast on dark overlays).',
      'Screenplay includes explicit visual action descriptions suitable for automated audio-description tracks.'
    ],
    approvedForDistribution: true,
    timestamp: '2026-09-06T10:06:45Z'
  },

  approvals: [
    { id: 'app-01', stage: 'CREATIVE_BRIEF', status: 'APPROVED', approvedBy: 'Lead Creative Director Agent', timestamp: '2026-09-06T10:04:15Z', notes: 'Brief aligned with 90-second educational storytelling goals.' },
    { id: 'app-02', stage: 'RESEARCH_EVIDENCE', status: 'APPROVED', approvedBy: 'Research Producer & Parallel Search', timestamp: '2026-09-06T10:04:35Z', notes: 'All 5 core claims verified against high-credibility journal publications.' },
    { id: 'app-03', stage: 'SCRIPT', status: 'APPROVED', approvedBy: 'Human Director (You)', timestamp: '2026-09-06T10:05:10Z', notes: 'Screenplay language certified accurate and warmly human.' },
    { id: 'app-04', stage: 'STORYBOARD', status: 'APPROVED', approvedBy: 'Storyboard Director Agent', timestamp: '2026-09-06T10:05:40Z', notes: '16 shots decomposed with precise lighting, lens, and pacing specifications.' },
    { id: 'app-05', stage: 'PRODUCTION_PLAN', status: 'APPROVED', approvedBy: 'Production Manager Agent', timestamp: '2026-09-06T10:06:15Z', notes: '2-day shooting schedule optimized for daylight angles and gear efficiency.' },
    { id: 'app-06', stage: 'FINAL_QA', status: 'APPROVED', approvedBy: 'Quality & Safety Supervisor', timestamp: '2026-09-06T10:06:45Z', notes: 'Final QA score 97/100. Certified market-ready for production and broadcast.' }
  ],

  activityLogs: [
    { id: 'log-01', timestamp: '10:04:12', agentName: 'Creative Director', action: 'Created project brief and narrative strategy for 90-second health documentary', status: 'SUCCESS' },
    { id: 'log-02', timestamp: '10:04:18', agentName: 'Research Producer', action: 'Generated 3 targeted research questions on ferritin mechanisms and fatigue clinical trials', status: 'SUCCESS' },
    { id: 'log-03', timestamp: '10:04:22', agentName: 'Parallel Search', action: 'Executed parallel search query across Lancet, JAMA, Cell, NEJM, and Nature databases', status: 'SUCCESS', details: 'Query: non-anemic iron deficiency fatigue mechanisms | Retrieved 14 high-credibility sources' },
    { id: 'log-04', timestamp: '10:04:31', agentName: 'Research Producer', action: 'Synthesized evidence graph with 5 core claims and 34 citation links', status: 'SUCCESS' },
    { id: 'log-05', timestamp: '10:04:38', agentName: 'Fact Checker', action: 'Audited all 5 claims against source methodologies; 5/5 marked VERIFIED', status: 'SUCCESS' },
    { id: 'log-06', timestamp: '10:04:50', agentName: 'Story Architect', action: 'Constructed 8-beat cinematic narrative structure (Hook to Empowerment)', status: 'SUCCESS' },
    { id: 'log-07', timestamp: '10:05:05', agentName: 'Screenwriter', action: 'Authored complete 8-scene screenplay with timecodes, visual cues, and claim badges', status: 'SUCCESS' },
    { id: 'log-08', timestamp: '10:05:25', agentName: 'Storyboard Director', action: 'Decomposed 8 scenes into 16 cinematic shots with camera movements and lighting', status: 'SUCCESS' },
    { id: 'log-09', timestamp: '10:05:55', agentName: 'Production Manager', action: 'Generated 16-item shot list, 2-day shooting order, and 9-item master asset checklist', status: 'SUCCESS' },
    { id: 'log-10', timestamp: '10:06:30', agentName: 'Quality Supervisor', action: 'Conducted safety, factuality, privacy, and accessibility audit. Score: 97/100', status: 'SUCCESS' }
  ],

  partnerTelemetry: {
    provider: 'PARALLEL',
    status: 'LIVE',
    requestsCount: 18,
    sourcesCount: 47,
    evidenceExtractedCount: 31,
    claimsVerifiedCount: 26,
    lastQuery: 'serum ferritin reference ranges clinical consensus Lancet JAMA hematology',
    lastTimestamp: '2026-09-06T10:06:45Z',
    latencyMs: 342
  }
};
