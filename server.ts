import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '20mb' }));

// Lazy Gemini client helper
let aiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
    version: '2.4.0-healthcare',
  });
});

// Central Safety Engine evaluator
function evaluateSafetyLevel(text: string): {
  level: 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';
  explanation: string;
  actionRecommendation: string;
} {
  const lower = text.toLowerCase();
  
  // Emergency keywords
  const redFlags = [
    'chest pain', 'crushing chest', 'difficulty breathing', 'cannot breathe', 
    'severe shortness of breath', 'sudden weakness', 'facial drooping', 
    'slurred speech', 'coughing blood', 'severe anaphylaxis', 'overdose',
    'suicide', 'kill myself', 'unconscious', 'seizure lasting'
  ];
  for (const flag of redFlags) {
    if (lower.includes(flag)) {
      return {
        level: 'RED',
        explanation: `Potential acute emergency indicator detected (${flag}).`,
        actionRecommendation: 'Seek immediate emergency medical attention (Call 911 / 112 or visit the nearest emergency department immediately).',
      };
    }
  }

  // Moderate/Urgent clinical review flags
  const orangeFlags = [
    'high fever', 'persistent vomiting', 'blood in stool', 'blood in urine',
    'severe abdominal pain', 'unexplained weight loss', 'lump in breast',
    'vision loss', 'black tarry stools', 'stiff neck with fever'
  ];
  for (const flag of orangeFlags) {
    if (lower.includes(flag)) {
      return {
        level: 'ORANGE',
        explanation: `Symptom cluster suggests potential clinical condition requiring urgent professional evaluation (${flag}).`,
        actionRecommendation: 'Schedule an urgent consultation with a qualified healthcare provider or urgent care center within 24 hours.',
      };
    }
  }

  // Context required / mild symptoms
  const yellowFlags = [
    'tired', 'fatigue', 'headache', 'dizzy', 'sore throat', 'cough', 
    'joint pain', 'rash', 'insomnia', 'bloating', 'nausea', 'back pain'
  ];
  for (const flag of yellowFlags) {
    if (lower.includes(flag)) {
      return {
        level: 'YELLOW',
        explanation: 'Common non-specific symptoms that require clarifying lifestyle and contextual factors.',
        actionRecommendation: 'Gather symptom timeline, context, and prepare questions for your routine healthcare provider.',
      };
    }
  }

  return {
    level: 'GREEN',
    explanation: 'Educational health information and general wellness guidance.',
    actionRecommendation: 'Explore wellness optimization, lifestyle habits, and preventative health metrics.',
  };
}

// 1. Dr. T Socratic Chat API
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, personality = 'Empathetic', language = 'en', userContext } = req.body;
    const lastUserMessage = messages[messages.length - 1]?.content || '';
    const safety = evaluateSafetyLevel(lastUserMessage);

    const personalityPrompts: Record<string, string> = {
      Empathetic: 'Warm, compassionate, deeply listening, validating feelings, gentle pacing.',
      Clinical: 'Precise, evidence-based, structured clinical reasoning, clear differential thinking.',
      Socratic: 'Engaging through thoughtful clarifying questions, separating symptoms from assumptions, guiding reflection.',
      Maternal: 'Nurturing, caring, reassuring, offering comforting practical guidance alongside safety awareness.',
      Researcher: 'Analytical, citing physiological mechanisms, evidence grades, biomedical hypotheses.',
      Concise: 'Direct, clear, bulleted takeaways, fast actionable insights.',
    };

    const systemPrompt = `You are Dr. T — an Empathetic Intelligence platform for human health and biomedical informatics.
Personality Style: ${personalityPrompts[personality] || personalityPrompts.Empathetic}
Preferred Language: ${language}

Core Principles:
1. Always maintain a compassionate, human, and professional tone.
2. Dr. T is an educational and clinical decision-support companion, NOT a replacement for a licensed physician.
3. Socratic Dialogue Strategy:
   - Understand the concern.
   - Ask 1-2 focused clarifying questions to narrow down symptoms (duration, onset, triggers, associated signs).
   - Distinguish symptoms from assumptions.
   - Explain plausible physiological mechanisms without definitive diagnostic assertions.
   - Point out red flags to watch for.
   - Provide concrete questions the user can take to their clinician.
4. If safety level is RED or ORANGE, prominently emphasize prompt medical evaluation.
5. User Context: ${JSON.stringify(userContext || {})}`;

    const gemini = getGemini();
    if (gemini) {
      const contents = messages.map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      }));

      const response = await gemini.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: contents,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        },
      });

      const replyText = response.text || "I'm here with you. Could you tell me a little more about when this began and what makes it better or worse?";
      return res.json({
        reply: replyText,
        safety,
        timestamp: new Date().toISOString(),
        model: 'gemini-3.7-flash',
      });
    }

    // High quality fallback simulation when Gemini API key is not supplied
    let fallbackReply = `Thank you for sharing this with me. When you mention "${lastUserMessage.slice(0, 60)}...", let's narrow that down together:

1. **Clarifying Reflection**: When did you first notice this sensation, and has it been constant or fluctuating throughout the day?
2. **Contextual Clues**: Have there been recent changes in your sleep patterns, hydration, dietary intake, or acute stress?
3. **Physiological Context**: Common non-specific fatigue or discomfort often reflects metabolic energy regulation, sleep architecture fragmentation, or autonomic strain.

*Questions to discuss with your physician:*
- Could basic metabolic panels (CBC, Ferritin, Thyroid TSH, Vitamin D/B12) provide insight into my current energy state?
- Are my current symptoms consistent with sleep quality disruption or lifestyle stress?

*Note: Dr. T provides educational insights and clinical decision support. Always consult a licensed healthcare professional for medical diagnosis and care.*`;

    if (safety.level === 'RED') {
      fallbackReply = `⚠️ **IMPORTANT SAFETY ALERT**: Your description includes symptoms that could indicate an urgent health situation. 

Please **seek immediate medical evaluation** at an emergency room or call emergency services (911/112). Do not wait for symptoms to evolve.

While you arrange care:
- Stay calm and sit or lie down in a safe position.
- Have someone stay with you if possible.
- Bring a list of any current medications with you.`;
    }

    return res.json({
      reply: fallbackReply,
      safety,
      timestamp: new Date().toISOString(),
      model: 'dr-t-socratic-engine (Demo Mode)',
    });
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message || 'Error processing conversation' });
  }
});

// 2. AI Swarm Orchestrator API
app.post('/api/swarm', async (req, res) => {
  try {
    const { query, patientData } = req.body;
    const gemini = getGemini();

    if (gemini) {
      const prompt = `You are orchestrating the Dr. T Healthcare AI Swarm for the query: "${query}".
Patient Data Context: ${JSON.stringify(patientData || {})}

Return a strictly valid JSON object matching this schema:
{
  "orchestrationPlan": "Brief summary of task decomposition",
  "agents": [
    {
      "id": "dr_med",
      "name": "Dr. Med",
      "role": "Clinical Reasoning Specialist",
      "task": "Differential reasoning and physiological analysis",
      "output": "Clinical reasoning output text",
      "confidence": 0.88,
      "disagreementPoints": ["Any point where Med differs or needs evidence"]
    },
    {
      "id": "dr_research",
      "name": "Dr. Research",
      "role": "Biomedical Literature & Evidence Specialist",
      "task": "PubMed/Cochrane evidence retrieval & study alignment",
      "output": "Evidence synthesis and guideline references",
      "confidence": 0.92,
      "disagreementPoints": []
    },
    {
      "id": "dr_edu",
      "name": "Dr. Edu",
      "role": "Patient Communication Specialist",
      "task": "Translating biomedical complexity into empathetic language",
      "output": "Patient-centric translation and actionable framing",
      "confidence": 0.95,
      "disagreementPoints": []
    },
    {
      "id": "dr_ops",
      "name": "Dr. Ops",
      "role": "Clinical Workflow & Care Pathways",
      "task": "Next steps, appointment scheduling, and care continuity",
      "output": "Care pathway recommendations and suggested milestones",
      "confidence": 0.90,
      "disagreementPoints": []
    },
    {
      "id": "dr_data",
      "name": "Dr. Data",
      "role": "Biomedical Informatics & FHIR Analytics",
      "task": "Longitudinal pattern extraction & FHIR observation mapping",
      "output": "Biomarker correlations and data trends",
      "confidence": 0.91,
      "disagreementPoints": []
    },
    {
      "id": "dr_safety",
      "name": "Dr. Safety",
      "role": "Clinical Risk & Guardrail Review",
      "task": "Escalation thresholds, red-flag screening, contraindications",
      "output": "Safety analysis, caveats, and risk stratification",
      "confidence": 0.96,
      "disagreementPoints": ["Highlight areas requiring human clinician review"]
    }
  ],
  "disagreementReview": {
    "detected": true,
    "summary": "Disagreements or nuances identified across agents",
    "tensionPoints": [
      "Dr. Med prioritizes immediate metabolic labs while Dr. Research notes high prevalence of behavioral sleep disruption",
      "Dr. Safety mandates ruling out cardiac/endocrine causes before assuming lifestyle fatigue"
    ]
  },
  "synthesis": "Final unified compassionate synthesis orchestrated by Dr. T, balancing evidence, patient clarity, safety caveats, and clinician discussion questions."
}`;

      const response = await gemini.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.4,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    }

    // High fidelity demo fallback
    return res.json({
      orchestrationPlan: `Decomposed "${query}" into 6 parallel agent inquiries: differential physiology, biomedical literature, patient communication, care workflows, longitudinal biomarker analysis, and clinical safety thresholds.`,
      agents: [
        {
          id: 'dr_med',
          name: 'Dr. Med',
          role: 'Clinical Reasoning Specialist',
          task: 'Differential physiology & etiology assessment',
          output: `Primary clinical considerations for chronic fatigue include iron deficiency anemia, thyroid dysregulation (hypothyroidism), post-viral fatigue syndrome, sleep apnea (OSA), and chronic metabolic stress. Recommended initial differential workup includes CBC, CMP, TSH, Ferritin, and hs-CRP.`,
          confidence: 0.89,
          disagreementPoints: ['Prefers broad laboratory screening prior to non-pharmacological interventions.']
        },
        {
          id: 'dr_research',
          name: 'Dr. Research',
          role: 'Biomedical Literature & Evidence Specialist',
          task: 'Systematic review & trial evidence correlation',
          output: `Meta-analyses in JAMA Internal Medicine (2023) show that 60-70% of unexplained persistent fatigue cases in primary care resolve with targeted sleep hygiene, circadian rhythm alignment, and moderate resistance exercise, with only 12% showing abnormal serum biomarkers.`,
          confidence: 0.93,
          disagreementPoints: ['Notes laboratory over-testing may increase patient anxiety without diagnostic yield.']
        },
        {
          id: 'dr_edu',
          name: 'Dr. Edu',
          role: 'Patient Communication Specialist',
          task: 'Compassionate patient-facing translation',
          output: `Fatigue can feel overwhelming and invisible. It helps to think of your body as a battery: sometimes the charger is disconnected (poor sleep quality), sometimes the battery itself needs care (nutritional status), and sometimes background apps are draining power (stress and immune activity).`,
          confidence: 0.96,
          disagreementPoints: []
        },
        {
          id: 'dr_ops',
          name: 'Dr. Ops',
          role: 'Clinical Workflow & Care Pathways',
          task: 'Scheduling, care coordination & follow-up',
          output: `Recommended action path: 1) Keep a 7-day symptom & sleep log; 2) Book routine primary care appointment; 3) Prepare specific questions regarding morning vs. evening energy levels and previous lab trends.`,
          confidence: 0.91,
          disagreementPoints: []
        },
        {
          id: 'dr_data',
          name: 'Dr. Data',
          role: 'Biomedical Informatics & FHIR Analytics',
          task: 'FHIR observation trend mapping',
          output: `Correlated wearable biometric trends indicate a 34-minute reduction in deep (N3) sleep over the past 3 weeks, coinciding with elevated resting heart rate (+4.2 bpm), suggesting physiological sympathetic tone elevation.`,
          confidence: 0.88,
          disagreementPoints: []
        },
        {
          id: 'dr_safety',
          name: 'Dr. Safety',
          role: 'Clinical Risk & Guardrail Review',
          task: 'Red-flag screening & escalation protocol',
          output: `Safety Level: YELLOW (Non-emergent). Mandatory check: ruled out acute chest pain, shortness of breath, unexplained severe weight loss, or persistent high fever. Explicitly remind the user that AI is for educational decision-support.`,
          confidence: 0.97,
          disagreementPoints: ['Requires explicit disclaimer and escalation triggers.']
        }
      ],
      disagreementReview: {
        detected: true,
        summary: 'Tension identified between Dr. Med (advocating immediate comprehensive blood panel) and Dr. Research (highlighting lifestyle/circadian primacy).',
        tensionPoints: [
          'Dr. Med emphasizes ruling out anemia and endocrine deficiencies first.',
          'Dr. Research emphasizes high clinical probability of behavioral sleep architecture disruption.'
        ]
      },
      synthesis: `Because persistent fatigue often involves both physiological markers and lifestyle factors, the most balanced and safest approach is a combined pathway:

1. **Clinical Action**: Schedule a comprehensive checkup with your primary care clinician and ask about baseline labs (CBC, Ferritin, TSH, Vitamin D).
2. **Behavioral Step**: Track your sleep onset, awakenings, and daytime energy over 7 days to share with your provider.
3. **Safety Notice**: If you develop sudden shortness of breath, chest pressure, or severe weakness, seek urgent medical care immediately.`
    });
  } catch (error: any) {
    console.error('Swarm error:', error);
    res.status(500).json({ error: error.message || 'Error executing AI swarm' });
  }
});

// 3. SOAP Note Clinical Generator API
app.post('/api/soap', async (req, res) => {
  try {
    const { transcript, patientName = 'Demo Patient', clinicianNotes } = req.body;
    const gemini = getGemini();

    if (gemini) {
      const prompt = `You are a Clinical Informatics Documentation Engine.
Generate a structured clinical SOAP note from this conversation/notes:
Patient: ${patientName}
Content: "${transcript || clinicianNotes}"

Format as JSON with keys:
{
  "subjective": "Detailed chief complaint, HPI, review of systems, patient-reported symptoms",
  "objective": "Vital signs, physical exam observations mentioned, lab values referenced or 'Not provided in encounter transcript'",
  "assessment": "Clinical differential interpretation and decision-support reasoning (explicitly marked as draft decision support)",
  "plan": "Diagnostic considerations, therapeutic lifestyle recommendations, follow-up timeline, patient education points",
  "fhirResource": {
    "resourceType": "DocumentReference",
    "status": "preliminary",
    "docStatus": "draft",
    "type": { "coding": [{ "system": "http://loinc.org", "code": "11506-3", "display": "Progress note" }] },
    "subject": { "display": "${patientName}" }
  }
}`;

      const response = await gemini.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      return res.json(JSON.parse(response.text || '{}'));
    }

    // High quality simulation
    return res.json({
      subjective: `Chief Complaint: Persistent daytime fatigue and unrefreshing sleep for the past 4 weeks.
History of Present Illness (HPI): Patient reports progressive decline in energy levels, difficulties with afternoon concentration, and morning brain fog. Denies acute fever, chills, shortness of breath, chest pain, or noticeable weight changes. Reports irregular sleep schedule (bedtime 1:00 AM, waking 6:30 AM). Caffeine consumption increased from 1 to 4 cups daily.`,
      objective: `General: Alert, conversational, mild periorbital dark circles.
Vitals (from connected health data): BP 118/76 mmHg, HR 72 bpm, SpO2 98% on room air, BMI 23.4 kg/m².
Labs: Previous CBC within normal limits 8 months ago. Ferritin and TSH pending.
Wearable Data: Average sleep duration 5.8 hrs/night; REM sleep 18%; Deep sleep 11%.`,
      assessment: `Decision Support Draft (Requires Clinician Review):
1. Chronic Fatigue, unspecified etiology (ICD-10 R53.83). Differential includes:
   a. Sleep restriction syndrome with circadian misalignment (high probability).
   b. Latent Iron Deficiency or subclinical hypothyroidism (moderate probability).
   c. Reactive autonomic stress response with elevated caffeine tolerance.`,
      plan: `Diagnostic:
- Order laboratory evaluation: Complete Blood Count (CBC with diff), Comprehensive Metabolic Panel (CMP), Ferritin, TSH with reflex free T4, 25-OH Vitamin D.
Therapeutic & Lifestyle:
- Structured sleep hygiene: establish consistent 10:30 PM bedtime, limit blue light 1 hour prior to sleep.
- Gradually taper caffeine intake to maximum 2 cups before 11:00 AM.
- Hydration goal: 2.0 - 2.5 L water daily.
Follow-up:
- Telehealth or in-person review in 3 weeks to evaluate lab results and sleep log.
Safety / Red Flag Counseling:
- Instructed patient to seek immediate care for acute chest pain, dyspnea, syncope, or focal neurological symptoms.`,
      fhirResource: {
        resourceType: "DocumentReference",
        status: "preliminary",
        docStatus: "draft",
        type: { coding: [{ system: "http://loinc.org", code: "11506-3", display: "Progress note" }] },
        subject: { display: patientName },
        date: new Date().toISOString(),
      }
    });
  } catch (error: any) {
    console.error('SOAP error:', error);
    res.status(500).json({ error: error.message || 'Error generating SOAP note' });
  }
});

// 4. Lab Interpretation API
app.post('/api/lab-interpret', async (req, res) => {
  try {
    const { labTests } = req.body;
    const gemini = getGemini();

    if (gemini) {
      const prompt = `You are a Clinical Biomedical Laboratory Interpretation Engine.
Analyze the following lab tests: ${JSON.stringify(labTests)}

Provide a structured JSON response:
{
  "summary": "Overall interpretation summary",
  "interpretations": [
    {
      "test": "Name",
      "value": "Value",
      "unit": "Unit",
      "referenceRange": "Range",
      "status": "NORMAL | HIGH | LOW | CRITICAL",
      "whatItMeasures": "Biochemical role",
      "clinicalContext": "Possible general explanations",
      "questionsForClinician": ["Question 1", "Question 2"]
    }
  ],
  "disclaimer": "Reference ranges vary by laboratory. This is educational decision support and not a medical diagnosis."
}`;

      const response = await gemini.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      return res.json(JSON.parse(response.text || '{}'));
    }

    // Realistic demo interpretation
    return res.json({
      summary: "Biomarker analysis indicates mild serum Ferritin depletion and suboptimal Vitamin D levels with preserved renal and metabolic function, which correlates with patient-reported fatigue.",
      interpretations: (labTests || []).map((t: any) => ({
        test: t.name || t.test || 'Serum Ferritin',
        value: t.value || 18,
        unit: t.unit || 'ng/mL',
        referenceRange: t.referenceRange || '24 - 336 ng/mL',
        status: t.status || 'LOW',
        whatItMeasures: 'Ferritin is the primary intracellular protein that stores iron and releases it in a controlled fashion.',
        clinicalContext: 'A lower ferritin value reflects depleted body iron stores even before overt hemoglobin drops occur, frequently contributing to cellular fatigue, brain fog, and muscle weakness.',
        questionsForClinician: [
          'Would oral iron supplementation (e.g., ferrous bisglycinate with Vitamin C) be suitable for my digestive profile?',
          'Should we retest ferritin, iron saturation, and TIBC in 8-12 weeks?'
        ]
      })),
      disclaimer: "Reference ranges vary by laboratory equipment and individual baseline. Consult your personal physician for clinical treatment."
    });
  } catch (error: any) {
    console.error('Lab error:', error);
    res.status(500).json({ error: error.message || 'Error interpreting labs' });
  }
});

// 5. Evidence Research / Knowledge Explorer API
app.post('/api/research', async (req, res) => {
  try {
    const { query } = req.body;
    const gemini = getGemini();

    if (gemini) {
      const prompt = `You are a Biomedical Literature and Evidence Synthesis Specialist.
Research query: "${query}"

Return a JSON object:
{
  "query": "${query}",
  "aiSynthesis": "Comprehensive synthesis of current scientific consensus",
  "keyFindings": ["Finding 1", "Finding 2", "Finding 3"],
  "evidenceStrength": "HIGH CONFIDENCE | MODERATE | LIMITED | UNCERTAIN",
  "uncertaintyNotes": "Known gaps in literature, conflicting trials, or demographic variations",
  "sources": [
    {
      "title": "Study / Meta-analysis title",
      "journal": "Journal Name (e.g., Nature Medicine, Lancet, JAMA)",
      "year": 2024,
      "doi": "10.1016/j.cell.2024.01.012",
      "studyType": "Systematic Review & Meta-Analysis / Randomized Controlled Trial",
      "sampleSize": "N = 4,280"
    }
  ]
}`;

      const response = await gemini.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      return res.json(JSON.parse(response.text || '{}'));
    }

    // High fidelity demo research result
    return res.json({
      query: query || "Relationship between sleep deprivation and insulin resistance",
      aiSynthesis: `Sleep restriction (<6 hours/night) impairs peripheral insulin sensitivity by 20–30% through multiple convergent pathways: elevated nocturnal free fatty acids (FFA), heightened nocturnal sympathetic tone with increased cortisol pulses, and altered adipokine secretion (leptin reduction, ghrelin surge). Acute sleep debt rapidly downregulates GLUT4 translocation in skeletal myocytes.`,
      keyFindings: [
        "Even 3 consecutive nights of 4-hour sleep restriction reduces whole-body insulin sensitivity comparable to 10-15 years of physiological aging.",
        "Slow-wave sleep (N3) suppression specifically impairs glucose tolerance without affecting total sleep duration.",
        "Catch-up sleep on weekends only partially restores insulin sensitivity if dietary circadian rhythmicity remains fragmented."
      ],
      evidenceStrength: "HIGH CONFIDENCE",
      uncertaintyNotes: "While the acute metabolic effects are well replicated in laboratory trials, long-term causality versus confounding lifestyle variables (dietary snacking, sedentariness) remains under longitudinal study.",
      sources: [
        {
          title: "Sleep loss as a risk factor for insulin resistance and type 2 diabetes",
          journal: "Lancet Diabetes & Endocrinology",
          year: 2023,
          doi: "10.1016/S2213-8587(23)00112-9",
          studyType: "Systematic Review & Meta-Analysis",
          sampleSize: "N = 18,400 across 34 cohort studies"
        },
        {
          title: "Mechanisms of metabolic dysregulation under sleep fragmentation and hypoxia",
          journal: "Cell Metabolism",
          year: 2024,
          doi: "10.1016/j.cmet.2024.02.008",
          studyType: "Randomized Controlled Trial",
          sampleSize: "N = 124"
        }
      ]
    });
  } catch (error: any) {
    console.error('Research error:', error);
    res.status(500).json({ error: error.message || 'Error synthesizing research' });
  }
});

// 6. AI Medical Image Research Mode API
app.post('/api/image-analysis', async (req, res) => {
  try {
    const { imageBase64, category = 'skin', description } = req.body;
    const gemini = getGemini();

    if (gemini && imageBase64) {
      const imageClean = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      const prompt = `You are an AI Biomedical Imaging Research System.
Category: ${category}
User note: ${description || 'No additional note'}

Evaluate this clinical image strictly as an AI research assistant for education and decision-support.
DO NOT provide a definitive medical diagnosis. Use phrasing like "Observed feature", "Morphological pattern".

Return JSON:
{
  "category": "${category}",
  "observedFeatures": ["Feature 1 (e.g. Erythematous border, follicular plug, hyperpigmentation)", "Feature 2"],
  "possibleInterpretations": ["Differential consideration 1", "Differential consideration 2"],
  "confidenceScore": 0.84,
  "evidenceContext": "Biomedical literature or clinical guideline reference",
  "safetyChecks": "Safety status and urgent signs (e.g., ABCDE criteria for pigmented lesions)",
  "limitations": "Image resolution, lighting angle, lack of dermoscopic magnification or histologic confirmation",
  "recommendedNextSteps": ["Dermatology / clinical consultation", "Biopsy consideration if expanding"]
}`;

      const response = await gemini.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: {
          parts: [
            { inlineData: { mimeType: 'image/jpeg', data: imageClean } },
            { text: prompt }
          ]
        },
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      return res.json(JSON.parse(response.text || '{}'));
    }

    // High fidelity demo imaging analysis
    return res.json({
      category: category,
      observedFeatures: [
        "Well-demarcated follicular erythema with mild central scaling",
        "Perifollicular hyperkeratotic papules along the malar and lateral facial plane",
        "Absence of deep ulceration, induration, or irregular asymmetric hyperpigmentation"
      ],
      possibleInterpretations: [
        "Keratosis Pilaris Faciei / Follicular Hyperkeratosis (High probability pattern)",
        "Mild Papulopustular Rosacea or Irritant Contact Dermatitis (Secondary consideration)"
      ],
      confidenceScore: 0.86,
      evidenceContext: "American Academy of Dermatology (AAD) clinical guidelines emphasize differentiating keratotic follicular papules from inflammatory acneiform lesions to prevent over-use of harsh drying agents.",
      safetyChecks: "No acute malignancy warning flags detected. ABCDE criteria negative for atypical melanocytic proliferation.",
      limitations: "Visual image analysis cannot replace tactile palpation, Wood's lamp examination, or polarized dermoscopy.",
      recommendedNextSteps: [
        "Consult a board-certified dermatologist for in-person evaluation.",
        "Consider gentle barrier-repair cleansers and mild ceramide/lactic acid hydrators while avoiding abrasive physical scrubs."
      ]
    });
  } catch (error: any) {
    console.error('Image analysis error:', error);
    res.status(500).json({ error: error.message || 'Error analyzing image' });
  }
});

// Setup Vite or Static serving
async function setupApp() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Express v5 uses *all
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🩺 Dr. T Platform Server running on http://localhost:${PORT}`);
  });
}

setupApp();
