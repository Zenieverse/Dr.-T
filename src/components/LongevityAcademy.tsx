import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, BookOpen, Brain, Heart, Activity, ShieldCheck, 
  AlertTriangle, PhoneCall, Sparkles, UserCheck, Users, Search, 
  Filter, CheckCircle2, Award, Clock, FileText, Video, Play, 
  Volume2, VolumeX, Eye, Flame, Globe, ArrowRight, MessageSquare, 
  Download, Plus, RefreshCw, ChevronRight, Stethoscope, Dumbbell, 
  Utensils, Pill, Laptop, Radio, Database, ShieldAlert, HeartPulse,
  Send, HelpCircle, Lock, Compass, Check, BookMarked, Share2, Layers,
  Printer, Pause, RotateCw
} from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { VisitorHeadcountTracker } from './VisitorHeadcountTracker';
import { 
  collection, doc, onSnapshot, setDoc, addDoc, 
  serverTimestamp, query, orderBy, limit 
} from 'firebase/firestore';

// --- TYPES & INTERFACES ---

export type RiskLevel = 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
}

export interface SchoolModule {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  learningLevels: ('Beginner' | 'Intermediate' | 'Advanced')[];
  keyTakeaways: string[];
  lectureNotes?: string;
  fiveQuestions: {
    whatIsHappening: string;
    whyDoesItMatter: string;
    whatCanIDo: string;
    whenToSeekHelp: string;
    redFlags: string[];
  };
  quizQuestions: {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
  flashcards?: Flashcard[];
  practicalExercise?: string;
}

export interface School {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  iconName: string;
  color: string;
  borderColor: string;
  bgLight: string;
  modules: SchoolModule[];
}

export interface AiAgentSpec {
  id: string;
  name: string;
  role: string;
  description: string;
  avatarIcon: string;
  specialty: string;
  samplePrompt: string;
  systemDirective: string;
}

export interface CertificationTrack {
  id: string;
  title: string;
  subtitle: string;
  requiredSchools: number[];
  minQuizScore: number;
  badgeColor: string;
  description: string;
}

export interface OpenResource {
  id: string;
  title: string;
  source: 'NIH' | 'NIA' | 'WHO' | 'CDC' | 'Harvard Health' | 'OpenStax' | 'MedlinePlus' | 'Alzheimers Association';
  topic: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  language: string;
  urlSnippet: string;
  summary: string;
}

export interface ForumPost {
  id: string;
  author: string;
  role: string;
  category: string;
  title: string;
  body: string;
  repliesCount: number;
  likes: number;
  date: string;
  createdAt?: any;
}

export interface HealthJournalEntry {
  id: string;
  authorName: string;
  role: string;
  entryType: 'Medication' | 'Symptom' | 'Caregiver Note' | 'Telemedicine Prep' | 'Nutrition Log';
  title: string;
  content: string;
  riskLevel: RiskLevel;
  date: string;
  createdAt?: any;
}

// --- DATA DEFINITIONS ---

export const SCHOOLS_DATA: School[] = [
  {
    id: 'school-1',
    number: 1,
    title: 'School 1: Human Biology Foundations',
    subtitle: 'Cells, DNA, Metabolism, Anatomy & Physiology for Longevity',
    iconName: 'Activity',
    color: 'text-blue-600 dark:text-blue-400',
    borderColor: 'border-blue-500',
    bgLight: 'bg-blue-50 dark:bg-blue-950/40',
    modules: [
      {
        id: 's1-m1',
        title: 'Cellular Architecture & Energy Production',
        description: 'Understand how ATP, mitochondria, and cell membranes power human vitality as we age.',
        durationMinutes: 15,
        learningLevels: ['Beginner', 'Intermediate'],
        keyTakeaways: [
          'Mitochondria produce 90% of cellular energy (ATP)',
          'Cellular repair mechanisms slow down with oxidative stress',
          'Proper hydration and micronutrients directly preserve membrane fluid dynamics'
        ],
        fiveQuestions: {
          whatIsHappening: 'Your cells rely on mitochondria to turn nutrients and oxygen into energy.',
          whyDoesItMatter: 'Mitochondrial efficiency naturally declines with age, leading to fatigue and diminished repair.',
          whatCanIDo: 'Engage in zone 2 aerobic movement, eat antioxidant-rich foods, and optimize sleep.',
          whenToSeekHelp: 'Seek medical evaluation if experiencing sudden progressive weakness or profound unexplained exhaustion.',
          redFlags: ['Sudden loss of muscular control', 'Chest tightness during light exertion', 'Severe unexplained shortness of breath']
        },
        quizQuestions: [
          {
            id: 's1-m1-q1',
            question: 'What organelle is known as the energy powerhouse of the cell?',
            options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Lysosome'],
            correctIndex: 1,
            explanation: 'Mitochondria generate ATP through oxidative phosphorylation, driving cellular energy.'
          }
        ],
        practicalExercise: 'Track your daily energy levels on a 1-10 scale before and after a 10-minute brisk walk.'
      },
      {
        id: 's1-m2',
        title: 'Genetics, Epigenetics & Gene Expression',
        description: 'Discover how lifestyle choices change chemical tags on DNA without changing genetic sequence.',
        durationMinutes: 20,
        learningLevels: ['Intermediate', 'Advanced'],
        keyTakeaways: [
          'Genetics sets the blueprint; epigenetics controls gene expression',
          'DNA methylation patterns shift in response to diet, exercise, and stress',
          'Sirtuins and NAD+ pathways play crucial roles in genome maintenance'
        ],
        fiveQuestions: {
          whatIsHappening: 'Environmental signals add or remove methyl groups on your DNA, turning genes on or off.',
          whyDoesItMatter: 'You can actively influence healthy gene expression through positive lifestyle interventions.',
          whatCanIDo: 'Prioritize plant-based polyphenols, resistance exercise, and stress reduction.',
          whenToSeekHelp: 'Consult a genetic counselor if you have a strong family history of early-onset neurodegenerative or cardiovascular illness.',
          redFlags: ['Multiple first-degree relatives with young-onset dementia or vascular events']
        },
        quizQuestions: [
          {
            id: 's1-m2-q1',
            question: 'How does epigenetics differ from classical genetic mutation?',
            options: [
              'It permanently alters the ATCG DNA letter sequence',
              'It modifies gene expression without altering the underlying DNA sequence',
              'It only occurs during fetal development',
              'It cannot be influenced by diet or exercise'
            ],
            correctIndex: 1,
            explanation: 'Epigenetics regulates gene activity via chemical tags like methylation without changing the DNA sequence.'
          }
        ]
      }
    ]
  },
  {
    id: 'school-2',
    number: 2,
    title: 'School 2: Science of Aging',
    subtitle: 'Hallmarks of Aging, Senescence, Telomeres & Epigenetic Clocks',
    iconName: 'Flame',
    color: 'text-amber-600 dark:text-amber-400',
    borderColor: 'border-amber-500',
    bgLight: 'bg-amber-50 dark:bg-amber-950/40',
    modules: [
      {
        id: 's2-m1',
        title: 'The 12 Hallmarks of Aging & Cellular Senescence',
        description: 'Explore genomic instability, telomere attrition, senescent zombie cells, and chronic inflammaging.',
        durationMinutes: 25,
        learningLevels: ['Intermediate', 'Advanced'],
        keyTakeaways: [
          'Cellular senescence stops damaged cells from dividing but secretes pro-inflammatory signals (SASP)',
          'Telomeres shorten with successive cell divisions',
          'Inflammaging describes low-grade, sterile, age-related systemic inflammation'
        ],
        fiveQuestions: {
          whatIsHappening: 'Aging involves interconnected biological mechanisms including DNA damage and senescent cell accumulation.',
          whyDoesItMatter: 'Understanding hallmarks transforms aging from an inevitable decay into targetable biological processes.',
          whatCanIDo: 'Maintain low systemic inflammation through anti-inflammatory nutrition and active muscle contraction.',
          whenToSeekHelp: 'Discuss inflammatory markers (like hs-CRP) with your primary physician during routine wellness visits.',
          redFlags: ['Unexplained persistent low-grade fever', 'Rapid involuntary weight loss exceeding 10 lbs']
        },
        quizQuestions: [
          {
            id: 's2-m1-q1',
            question: 'What are "senescent cells" frequently called in popular science?',
            options: ['Stem cells', 'Zombie cells', 'Killer T-cells', 'Inert platelets'],
            correctIndex: 1,
            explanation: 'Senescent cells cease division but linger, secreting inflammatory cytokines earn them the moniker "zombie cells".'
          }
        ]
      }
    ]
  },
  {
    id: 'school-3',
    number: 3,
    title: 'School 3: Gerontology',
    subtitle: 'Biological, Social, Psychological & Economic Dimensions of Aging',
    iconName: 'Globe',
    color: 'text-teal-600 dark:text-teal-400',
    borderColor: 'border-teal-500',
    bgLight: 'bg-teal-50 dark:bg-teal-950/40',
    modules: [
      {
        id: 's3-m1',
        title: 'Age-Friendly Communities & Global Demographics',
        description: 'How societies adapt to lengthening lifespans, urban accessibility, elder rights, and intergenerational support.',
        durationMinutes: 18,
        learningLevels: ['Beginner', 'Intermediate'],
        keyTakeaways: [
          'By 2050, 1 in 6 people globally will be over age 65',
          'Social connection reduces mortality risk comparably to smoking cessation',
          'Age-friendly environments prioritize walkable infrastructure and intergenerational engagement'
        ],
        fiveQuestions: {
          whatIsHappening: 'Global populations are shifting toward higher proportions of older adults.',
          whyDoesItMatter: 'Social isolation and poor physical accessibility severely undermine healthspan and cognitive function.',
          whatCanIDo: 'Participate in local community centers, advocate for accessible sidewalks, and cultivate multi-generational friendships.',
          whenToSeekHelp: 'Reach out to community social workers or elder advocacy networks if experiencing social isolation or housing barriers.',
          redFlags: ['Complete social withdrawal for more than 2 weeks', 'Inability to safely access food or medicine']
        },
        quizQuestions: [
          {
            id: 's3-m1-q1',
            question: 'Which social factor has a mortality risk comparable to smoking 15 cigarettes a day?',
            options: ['Occasional TV watching', 'Severe social isolation/loneliness', 'Living in a cold climate', 'Lack of hobbies'],
            correctIndex: 1,
            explanation: 'WHO and US Surgeon General data confirm chronic loneliness carries severe cardiovascular and neuroendocrine risks.'
          }
        ]
      }
    ]
  },
  {
    id: 'school-4',
    number: 4,
    title: 'School 4: Geriatric Medicine',
    subtitle: 'Managing Frailty, Falls, Delirium, Polypharmacy & Osteoporosis',
    iconName: 'Stethoscope',
    color: 'text-rose-600 dark:text-rose-400',
    borderColor: 'border-rose-500',
    bgLight: 'bg-rose-50 dark:bg-rose-950/40',
    modules: [
      {
        id: 's4-m1',
        title: 'The 5 Ms of Geriatrics & Fall Prevention',
        description: 'Master Mind, Mobility, Medications, Multicomplexity, and Matters Most in clinical elder care.',
        durationMinutes: 22,
        learningLevels: ['Beginner', 'Intermediate', 'Advanced'],
        keyTakeaways: [
          'Falls are the leading cause of injury-related hospitalizations in older adults',
          'Polypharmacy (5+ concurrent medications) exponentially increases fall risk',
          'Environmental audit (removing throw rugs, adding grab bars) prevents 40% of home falls'
        ],
        fiveQuestions: {
          whatIsHappening: 'Changes in balance, vision, muscle strength, and medications increase vulnerability to falls.',
          whyDoesItMatter: 'A single hip fracture can severely compromise functional independence and long-term survival.',
          whatCanIDo: 'Conduct a home safety inspection, review medications annually, and perform daily balance exercises.',
          whenToSeekHelp: 'Request a comprehensive geriatric assessment if you experience dizziness or near-fall slips.',
          redFlags: ['Head injury after a fall', 'Inability to bear weight on a leg', 'Loss of consciousness before falling']
        },
        quizQuestions: [
          {
            id: 's4-m1-q1',
            question: 'What defines polypharmacy in clinical geriatric care?',
            options: ['Taking 2 vitamins daily', 'Taking 5 or more prescription medications concurrently', 'Using topical creams', 'Taking expired pills'],
            correctIndex: 1,
            explanation: 'Polypharmacy is defined as taking 5+ medications, requiring careful clinical de-prescribing reviews.'
          }
        ]
      }
    ]
  },
  {
    id: 'school-5',
    number: 5,
    title: 'School 5: Brain Health & Neurocognition',
    subtitle: 'Cognitive Reserve, Alzheimer’s, Vascular Dementia & Parkinson’s Care',
    iconName: 'Brain',
    color: 'text-purple-600 dark:text-purple-400',
    borderColor: 'border-purple-500',
    bgLight: 'bg-purple-50 dark:bg-purple-950/40',
    modules: [
      {
        id: 's5-m1',
        title: 'Building Cognitive Reserve & Screening Warning Signs',
        description: 'Differentiating normal age-related slowing from Mild Cognitive Impairment (MCI) and dementia pathologies.',
        durationMinutes: 20,
        learningLevels: ['Beginner', 'Intermediate', 'Advanced'],
        keyTakeaways: [
          'Cognitive reserve protects brain function despite underlying neurological changes',
          'Normal aging affects processing speed; dementia disrupts daily functional tasks',
          'Manage vascular risk factors (blood pressure, glucose) to protect cerebral microvasculature'
        ],
        fiveQuestions: {
          whatIsHappening: 'Brain tissue undergoes structural changes, but lifelong learning and vascular health maintain synaptic resilience.',
          whyDoesItMatter: 'Early detection allows lifestyle interventions, clinical trial eligibility, and proactive care planning.',
          whatCanIDo: 'Engage in novel cognitive challenges, stay socially active, control blood pressure, and sleep 7-8 hours.',
          whenToSeekHelp: 'Schedule a cognitive evaluation if memory lapses interfere with managing finances or navigating familiar places.',
          redFlags: ['Sudden acute confusion (Delirium)', 'Getting lost in one’s own neighborhood', 'Inability to recognize close family']
        },
        quizQuestions: [
          {
            id: 's5-m1-q1',
            question: 'Which of the following is a normal part of cognitive aging rather than dementia?',
            options: [
              'Forgetting how to drive to a home used for 30 years',
              'Occasionally forgetting a acquaintance’s name but remembering it later',
              'Inability to manage a monthly household budget',
              'Placing keys in the freezer and accusing family of stealing'
            ],
            correctIndex: 1,
            explanation: 'Transiently forgetting names that return later is normal cognitive processing speed variation; functional disruption is not.'
          }
        ]
      }
    ]
  },
  {
    id: 'school-6',
    number: 6,
    title: 'School 6: Nutrition for Longevity',
    subtitle: 'Bioavailable Protein, Anemia Prevention, Micronutrients & Food-as-Medicine',
    iconName: 'Utensils',
    color: 'text-emerald-600 dark:text-emerald-400',
    borderColor: 'border-emerald-500',
    bgLight: 'bg-emerald-50 dark:bg-emerald-950/40',
    modules: [
      {
        id: 's6-m1',
        title: 'Protein Kinetics, Sarcopenia Prevention & Iron Vitality',
        description: 'Optimizing leucine-rich amino acids, bioavailable heme iron, Vitamin D3, B12, and hydration in older adults.',
        durationMinutes: 20,
        learningLevels: ['Beginner', 'Intermediate'],
        keyTakeaways: [
          'Older adults require 1.2 – 1.5g protein per kg body weight to combat anabolic resistance',
          'Subclinical B12 deficiency affects 20% of elders due to decreased gastric intrinsic factor',
          'Gestational and age-related iron deficiency anemia impairs mitochondrial oxygen transport'
        ],
        fiveQuestions: {
          whatIsHappening: 'The digestive system becomes less efficient at absorbing B12, iron, and protein with age.',
          whyDoesItMatter: 'Nutritional deficits trigger muscle loss (sarcopenia), cognitive fog, fatigue, and immune frailty.',
          whatCanIDo: 'Distribute protein evenly across 3 meals, combine non-heme iron with Vitamin C, and check B12 serum levels.',
          whenToSeekHelp: 'Consult a physician or dietitian if experiencing unintentional weight loss, dark stools, or severe pale fatigue.',
          redFlags: ['Black tarry stools (indicating GI bleeding)', 'Hemoglobin levels below 9 g/dL', 'Severe swallowing difficulty (dysphagia)']
        },
        quizQuestions: [
          {
            id: 's6-m1-q1',
            question: 'What daily protein intake is recommended for active older adults to prevent sarcopenia?',
            options: ['0.4 g/kg body weight', '0.8 g/kg body weight', '1.2 - 1.5 g/kg body weight', '3.0 g/kg body weight'],
            correctIndex: 2,
            explanation: 'Geriatric nutritional consensus recommends 1.2–1.5g/kg/day to overcome muscle anabolic resistance.'
          }
        ]
      }
    ]
  },
  {
    id: 'school-7',
    number: 7,
    title: 'School 7: Movement & Rehabilitation',
    subtitle: 'Strength, Tai Chi, Balance, Mobility & Adapted Wheelchair Programs',
    iconName: 'Dumbbell',
    color: 'text-orange-600 dark:text-orange-400',
    borderColor: 'border-orange-500',
    bgLight: 'bg-orange-50 dark:bg-orange-950/40',
    modules: [
      {
        id: 's7-m1',
        title: 'Neuromuscular Balance & Chair Resistance Training',
        description: 'Progressive strength and balance routines adapted for frail elders, wheelchair users, and active seniors.',
        durationMinutes: 25,
        learningLevels: ['Beginner', 'Intermediate'],
        keyTakeaways: [
          'Tai Chi reduces fall risk by 50% by improving proprioception and vestibular awareness',
          'Sit-to-stand exercises strengthen gluteal and quadriceps power essential for stair climbing',
          'Seated band exercises preserve upper body mobility for wheelchair users'
        ],
        fiveQuestions: {
          whatIsHappening: 'Muscles and balance receptors adapt dynamically to physical demand at any age.',
          whyDoesItMatter: 'Physical strength and balance are the bedrock of functional independence and self-care.',
          whatCanIDo: 'Practice 10 sit-to-stands daily, balance on one leg near a kitchen counter, or follow seated resistance band guides.',
          whenToSeekHelp: 'Work with a physical therapist if you feel unsafe standing independently or experience joint pain.',
          redFlags: ['Sharp unremitting joint pain during movement', 'Sudden numbness or tingling down a leg', 'Dizziness upon standing']
        },
        quizQuestions: [
          {
            id: 's7-m1-q1',
            question: 'Which exercise modality is clinically proven to reduce fall frequency by up to 50% in seniors?',
            options: ['Heavy bench press', 'Tai Chi & balance training', 'Extreme marathon running', 'Strict bed rest'],
            correctIndex: 1,
            explanation: 'Tai Chi trains proprioception, weight-shifting, and postural control, dramatically cutting fall rates.'
          }
        ]
      }
    ]
  },
  {
    id: 'school-8',
    number: 8,
    title: 'School 8: Caregiver University',
    subtitle: 'Home Safety, Dementia Care, Burnout Prevention & Emergency Plans',
    iconName: 'HeartPulse',
    color: 'text-indigo-600 dark:text-indigo-400',
    borderColor: 'border-indigo-500',
    bgLight: 'bg-indigo-50 dark:bg-indigo-950/40',
    modules: [
      {
        id: 's8-m1',
        title: 'Managing Behavioral Symptoms in Dementia & Preventing Caregiver Burnout',
        description: 'Compassionate communication techniques (validation vs argumentation), home safety modifications, and caregiver respite.',
        durationMinutes: 30,
        learningLevels: ['Beginner', 'Intermediate', 'Advanced'],
        keyTakeaways: [
          'Validation therapy de-escalates agitation by acknowledging emotional truth rather than correcting factual errors',
          'Caregiver burnout impairs immune health and increases risk of depression',
          'Structured daily routines reduce anxiety and wandering in individuals with neurocognitive disorders'
        ],
        fiveQuestions: {
          whatIsHappening: 'Dementia alters sensory processing and memory, causing frustration when the environment feels unfamiliar.',
          whyDoesItMatter: 'Caregiver physical and emotional health directly dictates the quality and safety of home-based care.',
          whatCanIDo: 'Use simple single-step requests, simplify home layouts, and schedule mandatory weekly caregiver respite.',
          whenToSeekHelp: 'Contact memory care professionals or support groups if caregiving demands feel overwhelming or unsafe.',
          redFlags: ['Caregiver expressing thoughts of self-harm or severe despair', 'Patient wandering outdoors unattended', 'Unexplained bruising or physical injuries']
        },
        quizQuestions: [
          {
            id: 's8-m1-q1',
            question: 'When a person with dementia insists they need to go pick up their children from 40 years ago, what is the best initial approach?',
            options: [
              'Argue firmly that their children are grown adults',
              'Validate their protective feeling ("You love your kids so much") and gently redirect to a calm activity',
              'Lock them in a room until they calm down',
              'Ignore them completely'
            ],
            correctIndex: 1,
            explanation: 'Validation honors the underlying emotional truth and de-escalates distress without unhelpful confrontation.'
          }
        ]
      }
    ]
  },
  {
    id: 'school-9',
    number: 9,
    title: 'School 9: Telemedicine Academy',
    subtitle: 'Navigating Virtual Care, Remote Monitoring, Lab Uploads & Consultation Prep',
    iconName: 'Laptop',
    color: 'text-cyan-600 dark:text-cyan-400',
    borderColor: 'border-cyan-500',
    bgLight: 'bg-cyan-50 dark:bg-cyan-950/40',
    modules: [
      {
        id: 's9-m1',
        title: 'Preparing for High-Yield Virtual Visits & Remote Telemetry',
        description: 'How to list symptoms, organize prescription bottles, measure vitals (BP, pulse ox), and communicate via video calls.',
        durationMinutes: 15,
        learningLevels: ['Beginner', 'Intermediate'],
        keyTakeaways: [
          'Pre-appointment preparation doubles physician time efficiency and clinical accuracy',
          'Keep a written list of top 3 concerns, current vitals, and all pill bottles beside your device',
          'Remote patient monitoring (RPM) enables early intervention for heart failure and hypertension'
        ],
        fiveQuestions: {
          whatIsHappening: 'Telemedicine uses secure video and digital sensors to bring clinical expertise directly into your home.',
          whyDoesItMatter: 'Saves transportation effort while ensuring continuous medical oversight for mobility-limited individuals.',
          whatCanIDo: 'Test your camera/microphone 15 minutes early, ensure good lighting on your face, and have your vitals ready.',
          whenToSeekHelp: 'Request an in-person visit if a physical examination (like abdominal palpation or lung stethoscopy) is required.',
          redFlags: ['Sudden difficulty speaking or facial drooping during video call', 'Severe acute chest pain or respiratory distress']
        },
        quizQuestions: [
          {
            id: 's9-m1-q1',
            question: 'What is the most helpful item to have sitting next to you during a virtual doctor visit?',
            options: ['A magazine', 'All current prescription and OTC medicine bottles', 'A television remote', 'A cookbook'],
            correctIndex: 1,
            explanation: 'Having physical medicine bottles present allows exact dose and pill verification during medication reconciliations.'
          }
        ]
      }
    ]
  },
  {
    id: 'school-10',
    number: 10,
    title: 'School 10: Digital Health & AI Literacy',
    subtitle: 'Safe AI Triage, Misinformation Defense, Privacy & Human-in-the-Loop Oversight',
    iconName: 'Sparkles',
    color: 'text-violet-600 dark:text-violet-400',
    borderColor: 'border-violet-500',
    bgLight: 'bg-violet-50 dark:bg-violet-950/40',
    modules: [
      {
        id: 's10-m1',
        title: 'Understanding Medical AI Boundaries, Privacy & Triage Safety',
        description: 'How health AI acts as an educational navigator while keeping licensed human physicians strictly in the loop.',
        durationMinutes: 18,
        learningLevels: ['Beginner', 'Intermediate', 'Advanced'],
        keyTakeaways: [
          'AI excels at organizing health data, suggesting questions, and explaining terminology',
          'AI must NEVER replace licensed human emergency or diagnostic medical decisions',
          'Always verify health claims against trusted medical repositories (NIH, WHO, CDC)'
        ],
        fiveQuestions: {
          whatIsHappening: 'Artificial intelligence processes medical literature to assist human education and clinical workflows.',
          whyDoesItMatter: 'Knowing AI strengths and limitations prevents reliance on unverified health advice while maximizing educational benefit.',
          whatCanIDo: 'Use AI to draft doctor question lists, research drug interactions, and track wellness habits.',
          whenToSeekHelp: 'Always consult your human physician before making any changes to prescription treatments.',
          redFlags: ['Relying on internet tools or chatbots during acute medical emergencies instead of calling 911']
        },
        quizQuestions: [
          {
            id: 's10-m1-q1',
            question: 'What is the proper role of AI in personal healthcare?',
            options: [
              'To replace doctors and prescribe medicine autonomously',
              'To act as an educational navigator, triage assistant, and doctor preparation tool with human oversight',
              'To perform emergency home surgeries',
              'To override hospital emergency room advice'
            ],
            correctIndex: 1,
            explanation: 'AI provides decision support and health literacy enhancement under essential human clinical supervision.'
          }
        ]
      }
    ]
  }
];

export const AI_AGENT_SPECS: AiAgentSpec[] = [
  {
    id: 'agent-1',
    name: 'Dr. Evelyn Vance, PhD',
    role: 'Aging Science Tutor',
    description: 'Explains cellular senescence, hallmarks of aging, telomere biology, and epigenetic clock research in accessible language.',
    avatarIcon: 'Flame',
    specialty: 'Hallmarks of Aging & Epigenetics',
    samplePrompt: 'Explain how cellular senescence affects joint tissue as we age.',
    systemDirective: 'You are an expert gerontologist. Cite NIH/PubMed research, explain biological mechanisms, and emphasize lifestyle epigenetics.'
  },
  {
    id: 'agent-2',
    name: 'Dr. Marcus Thorne, MD',
    role: 'Geriatric Medicine Tutor',
    description: 'Guides you through the 5 Ms of geriatrics (Mind, Mobility, Medications, Multicomplexity, Matters Most) and fall prevention.',
    avatarIcon: 'Stethoscope',
    specialty: 'Frailty, Polypharmacy & Fall Risk',
    samplePrompt: 'What should I ask my doctor about my 6 daily medications?',
    systemDirective: 'Focus on medication reconciliation, fall safety, and human-in-the-loop clinician escalation.'
  },
  {
    id: 'agent-3',
    name: 'Chef Amara & Ellen, RDN',
    role: 'Nutrition & Anemia Coach',
    description: 'Specializes in bioavailable protein, iron deficiency anemia prevention, Vitamin D, B12, and Food-as-Medicine meal plans.',
    avatarIcon: 'Utensils',
    specialty: 'Sarcopenia Prevention & Micronutrients',
    samplePrompt: 'How can I get 30g of protein and bioavailable iron in a soft breakfast?',
    systemDirective: 'Provide actionable recipes, budget-friendly food swaps, and micronutrient absorption pairings (iron + Vitamin C).'
  },
  {
    id: 'agent-4',
    name: 'Coach David Chen, PT',
    role: 'Movement & Rehab Specialist',
    description: 'Designs balance routines, Tai Chi movements, chair resistance training, and wheelchair-adapted exercise programs.',
    avatarIcon: 'Dumbbell',
    specialty: 'Neuromuscular Balance & Chair Strength',
    samplePrompt: 'Show me a 5-minute seated leg exercise to make standing up easier.',
    systemDirective: 'Prioritize joint safety, progressive resistance, and fall prevention protocols.'
  },
  {
    id: 'agent-5',
    name: 'Maria Rodriguez, RN',
    role: 'Caregiver University Coach',
    description: 'Provides empathetic support, home safety audits, dementia communication techniques, and caregiver burnout prevention strategies.',
    avatarIcon: 'HeartPulse',
    specialty: 'Dementia Care & Caregiver Respite',
    samplePrompt: 'How do I handle my father repeatedly asking to go home when he is already in his room?',
    systemDirective: 'Utilize validation therapy principles, de-escalation strategies, and burnout self-care checklists.'
  },
  {
    id: 'agent-6',
    name: 'Alex Rivera, MS',
    role: 'Telemedicine Navigator',
    description: 'Helps you organize pill bottles, record vitals, format lab reports, and write concise 3-point agendas for virtual doctor visits.',
    avatarIcon: 'Laptop',
    specialty: 'Virtual Care & Patient Advocacy',
    samplePrompt: 'Help me draft a 3-minute summary of my joint pain and blood pressure numbers for my upcoming video visit.',
    systemDirective: 'Format structured patient summaries using SBAR (Situation, Background, Assessment, Recommendation).'
  },
  {
    id: 'agent-7',
    name: 'PharmD Sarah Jenkins',
    role: 'Medication Educator',
    description: 'Explains pill interactions, side effects, proper administration timing, and how to discuss de-prescribing with your physician.',
    avatarIcon: 'Pill',
    specialty: 'Drug Interactions & Deprescribing',
    samplePrompt: 'Why shouldn’t I take my iron supplement at the exact same time as my calcium tablet?',
    systemDirective: 'Explain gastrointestinal absorption dynamics and emphasize that all prescription changes require physician approval.'
  },
  {
    id: 'agent-8',
    name: 'Dr. Clara Sterling, PsyD',
    role: 'Mental Wellness & Sleep Guide',
    description: 'Supports emotional resilience, grief processing, sleep hygiene optimization, and cognitive anxiety reduction.',
    avatarIcon: 'Brain',
    specialty: 'Sleep Hygiene & Geriatric Mental Health',
    samplePrompt: 'What non-drug sleep habits can help an 80-year-old wake up less during the night?',
    systemDirective: 'Focus on circadian light exposure, evening fluid timing, cognitive behavioral therapy for insomnia (CBT-I) principles.'
  },
  {
    id: 'agent-9',
    name: 'Memory Guide Samuel',
    role: 'Dementia Support Assistant',
    description: 'Specializes in memory orientation exercises, cognitive stimulation therapy, and compassionate guidance for family members.',
    avatarIcon: 'HelpCircle',
    specialty: 'Cognitive Stimulation & Reminiscence',
    samplePrompt: 'Suggest a fun cognitive memory game I can play with my grandmother who has mild Alzheimer’s.',
    systemDirective: 'Provide non-frustrating reminiscence games, photo album triggers, and sensory music activities.'
  },
  {
    id: 'agent-10',
    name: 'Community Connector Rosa',
    role: 'Resource & Support Finder',
    description: 'Locates local senior centers, Meals on Wheels, adult day care programs, mobility transport, and respite services.',
    avatarIcon: 'Globe',
    specialty: 'Community Services & Social Programs',
    samplePrompt: 'What free or low-cost community transport options exist for non-driving seniors?',
    systemDirective: 'Direct users to Area Agencies on Aging (AAA), local dial-a-ride programs, and community volunteer networks.'
  }
];

export const CERTIFICATION_TRACKS: CertificationTrack[] = [
  {
    id: 'cert-1',
    title: 'Healthy Aging Foundations Certificate',
    subtitle: 'Core principles of human biology, longevity science, and preventive healthspan maintenance.',
    requiredSchools: [1, 2, 6],
    minQuizScore: 80,
    badgeColor: 'bg-blue-600 text-white',
    description: 'Demonstrates foundational competency in cell energy, nutrition, and lifestyle epigenetics.'
  },
  {
    id: 'cert-2',
    title: 'Certified Family Caregiver Advocate',
    subtitle: 'Mastery in home fall prevention, dementia validation, medication safety, and emergency planning.',
    requiredSchools: [4, 5, 8],
    minQuizScore: 85,
    badgeColor: 'bg-purple-600 text-white',
    description: 'Validates practical skills in managing home caregiving, preventing caregiver burnout, and de-escalation.'
  },
  {
    id: 'cert-3',
    title: 'Community Health Worker Longevity Specialist',
    subtitle: 'Field readiness for community health screening, anemia awareness, and elder support navigation.',
    requiredSchools: [3, 4, 6, 7],
    minQuizScore: 85,
    badgeColor: 'bg-emerald-600 text-white',
    description: 'Equips outreach workers to conduct fall audits, nutrition guidance, and social support referrals.'
  },
  {
    id: 'cert-4',
    title: 'Advanced Gerontology & Brain Health Specialist',
    subtitle: 'In-depth study of hallmarks of aging, cognitive reserve, neurodegeneration, and geroscience.',
    requiredSchools: [2, 3, 5, 10],
    minQuizScore: 90,
    badgeColor: 'bg-amber-600 text-white',
    description: 'Advanced credential for educators, researchers, and healthcare professionals.'
  },
  {
    id: 'cert-5',
    title: 'Geriatric Care Professional & Digital Health Navigator',
    subtitle: 'Full-spectrum mastery across all 10 Institute schools including telemedicine and medical AI literacy.',
    requiredSchools: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    minQuizScore: 90,
    badgeColor: 'bg-rose-600 text-white',
    description: 'The highest academic honor bestowed by the Dr. T Institute.'
  }
];

export const OPEN_RESOURCES: OpenResource[] = [
  {
    id: 'res-1',
    title: 'National Institute on Aging: Biology of Aging Research Hub',
    source: 'NIA',
    topic: 'Hallmarks of Aging & Genetics',
    difficulty: 'Intermediate',
    language: 'English / Spanish',
    urlSnippet: 'https://www.nia.nih.gov/research/biology',
    summary: 'Comprehensive scientific overview of cellular senescence, caloric restriction, and geroscience breakthroughs.'
  },
  {
    id: 'res-2',
    title: 'WHO Global Report on Age-Friendly Cities & Integrated Care for Older People (ICOPE)',
    source: 'WHO',
    topic: 'Community Gerontology',
    difficulty: 'Beginner',
    language: 'Multilingual (6 UN Languages)',
    urlSnippet: 'https://www.who.int/teams/maternal-newborn-child-adolescent-health-and-ageing',
    summary: 'Guidelines for assessing intrinsic capacity, preventing dependency, and building accessible urban environments.'
  },
  {
    id: 'res-3',
    title: 'CDC STEADI: Algorithm for Fall Risk Screening & Intervention',
    source: 'CDC',
    topic: 'Fall Prevention & Geriatric Safety',
    difficulty: 'Intermediate',
    language: 'English',
    urlSnippet: 'https://www.cdc.gov/steadi',
    summary: 'Clinical screening flowcharts, Timed Up and Go (TUG) test standards, and home hazard evaluation forms.'
  },
  {
    id: 'res-4',
    title: 'Harvard Health: Guide to Cognitive Fitness & Brain Protection',
    source: 'Harvard Health',
    topic: 'Brain Health & Memory',
    difficulty: 'Beginner',
    language: 'English',
    urlSnippet: 'https://www.health.harvard.edu/mind-and-mood',
    summary: 'Evidence-based advice on exercise, Mediterranean-DASH diets, sleep architecture, and cognitive stimulation.'
  },
  {
    id: 'res-5',
    title: 'OpenStax Anatomy & Physiology: Aging & Organ System Changes',
    source: 'OpenStax',
    topic: 'Human Anatomy & Physiology',
    difficulty: 'Intermediate',
    language: 'English',
    urlSnippet: 'https://openstax.org/details/books/anatomy-and-physiology-2e',
    summary: 'Peer-reviewed textbook chapters detailing cardiovascular, renal, muscular, and neural adaptations across the lifespan.'
  },
  {
    id: 'res-6',
    title: 'Alzheimer’s Association: Caregiver Toolkit & Communication Guides',
    source: 'Alzheimers Association',
    topic: 'Caregiving & Dementia',
    difficulty: 'Beginner',
    language: 'English / Spanish / Vietnamese',
    urlSnippet: 'https://www.alz.org/help-support/caregiving',
    summary: 'Actionable strategies for managing behavioral changes, legal planning, safety modifications, and support groups.'
  }
];

export const INITIAL_FORUM_POSTS: ForumPost[] = [
  {
    id: 'post-1',
    author: 'Nurse Practitioner Clara B.',
    role: 'Geriatric Care Lead',
    category: 'Caregiver Support',
    title: 'How our community clinic reduced fall rates by 35% using simple chair exercises and floor rug audits',
    body: 'We distributed physical home safety checklists and started 15-minute weekly seated leg-extension groups before coffee hours. The key was making balance practice fun and social rather than a medical chore.',
    repliesCount: 8,
    likes: 24,
    date: '2 hours ago'
  },
  {
    id: 'post-2',
    author: 'David K. (Family Caregiver)',
    role: 'Son & Caregiver',
    category: 'Nutrition & Anemia',
    title: 'Tips for overcoming oral iron pill stomach upset in an 82-year-old parent',
    body: 'My mother couldn’t tolerate standard ferrous sulfate. Switching to heme iron food sources (slow-cooked bone broth & spinach puree) with citrus juice made a dramatic difference in her energy without constipation.',
    repliesCount: 12,
    likes: 31,
    date: '1 day ago'
  }
];

export const INITIAL_JOURNAL_ENTRIES: HealthJournalEntry[] = [
  {
    id: 'j-1',
    authorName: 'Elena Rostova',
    role: 'Patient',
    entryType: 'Medication',
    title: 'Weekly Medication & Vitals Check',
    content: 'Morning BP: 122/78 mmHg. Pulse: 68 BPM. Took Vitamin D3 (2000 IU) and B12 sublingual. Completed 15 minutes of seated Tai Chi balance exercises.',
    riskLevel: 'GREEN',
    date: 'Today, 9:00 AM'
  }
];

// --- FLASHCARD HELPER ---

export function getModuleFlashcards(module: SchoolModule, school: School): Flashcard[] {
  if (module.flashcards && module.flashcards.length > 0) return module.flashcards;
  
  return [
    {
      id: `${module.id}-f1`,
      front: `What is happening in ${module.title}?`,
      back: module.fiveQuestions.whatIsHappening,
      category: school.title
    },
    {
      id: `${module.id}-f2`,
      front: `Why does this concept matter for healthy longevity?`,
      back: module.fiveQuestions.whyDoesItMatter,
      category: school.title
    },
    {
      id: `${module.id}-f3`,
      front: `What actionable intervention can you perform today?`,
      back: module.fiveQuestions.whatCanIDo,
      category: school.title
    },
    {
      id: `${module.id}-f4`,
      front: `What are the critical Clinical Red Flags?`,
      back: module.fiveQuestions.redFlags.join(' • '),
      category: 'Clinical Safety'
    }
  ];
}

// --- MAIN ACADEMY COMPONENT ---

export function LongevityAcademy() {
  // Navigation tabs inside Academy
  const [activeTab, setActiveTab] = useState<
    'schools' | 'tutors' | 'escalation' | 'certifications' | 'resources' | 'community' | 'companion'
  >('schools');

  // Accessibility & UX controls
  const [seniorMode, setSeniorMode] = useState<boolean>(false);
  const [voiceFirstMode, setVoiceFirstMode] = useState<boolean>(false);
  const [lowBandwidthMode, setLowBandwidthMode] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // School explorer state
  const [selectedSchool, setSelectedSchool] = useState<School>(SCHOOLS_DATA[0]);
  const [selectedModule, setSelectedModule] = useState<SchoolModule>(SCHOOLS_DATA[0].modules[0]);
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [userScore, setUserScore] = useState<number | null>(null);

  // MOOC Learning Engine states
  const [learningTabMode, setLearningTabMode] = useState<'lecture' | 'flashcards' | 'quiz' | 'exercise'>('lecture');
  const [flashcardIndex, setFlashcardIndex] = useState<number>(0);
  const [isFlashcardFlipped, setIsFlashcardFlipped] = useState<boolean>(false);
  const [studentName, setStudentName] = useState<string>('Jane Doe, RN');
  const [showDiplomaModal, setShowDiplomaModal] = useState<boolean>(false);
  const [activeCertTrack, setActiveCertTrack] = useState<CertificationTrack | null>(CERTIFICATION_TRACKS[0]);
  const [exerciseInput, setExerciseInput] = useState<string>('');
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});

  // AI Tutor chat state
  const [selectedAgent, setSelectedAgent] = useState<AiAgentSpec>(AI_AGENT_SPECS[0]);
  const [tutorChatInput, setTutorChatInput] = useState<string>('');
  const [tutorChatHistory, setTutorChatHistory] = useState<{ sender: 'user' | 'agent'; text: string; sources?: string[]; reasoning?: string }[]>([
    {
      sender: 'agent',
      text: `Hello! I am ${AI_AGENT_SPECS[0].name}, your ${AI_AGENT_SPECS[0].role}. How can I assist your healthy aging journey today?`,
      sources: ['National Institute on Aging (NIA)', 'Harvard Longevity Study']
    }
  ]);
  const [isGeneratingTutor, setIsGeneratingTutor] = useState<boolean>(false);

  // Human-in-the-Loop Risk Simulator state
  const [simulatedSymptom, setSimulatedSymptom] = useState<string>('');
  const [assessedRisk, setAssessedRisk] = useState<{
    level: RiskLevel;
    title: string;
    description: string;
    recommendedActions: string[];
    redFlags: string[];
  } | null>(null);

  // Firestore collections state
  const [forumPosts, setForumPosts] = useState<ForumPost[]>(INITIAL_FORUM_POSTS);
  const [journalEntries, setJournalEntries] = useState<HealthJournalEntry[]>(INITIAL_JOURNAL_ENTRIES);
  const [userProgressMinutes, setUserProgressMinutes] = useState<number>(45);
  const [completedModuleIds, setCompletedModuleIds] = useState<string[]>(['s1-m1']);
  const [isSyncingDb, setIsSyncingDb] = useState<boolean>(false);

  // Form states
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostBody, setNewPostBody] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('General Discussion');
  const [newJournalTitle, setNewJournalTitle] = useState('');
  const [newJournalContent, setNewJournalContent] = useState('');
  const [newJournalType, setNewJournalType] = useState<'Medication' | 'Symptom' | 'Caregiver Note' | 'Telemedicine Prep' | 'Nutrition Log'>('Caregiver Note');

  // Search filters
  const [schoolSearchQuery, setSchoolSearchQuery] = useState('');
  const [resourceSearchQuery, setResourceSearchQuery] = useState('');

  // Voice synthesis reader
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = seniorMode ? 0.85 : 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Firestore Synchronization
  useEffect(() => {
    setIsSyncingDb(true);

    // Forum Posts Listener
    const forumUnsub = onSnapshot(
      collection(db, 'longevityForum'),
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: ForumPost[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            loaded.push({
              id: docSnap.id,
              author: data.author || 'Anonymous Learner',
              role: data.role || 'Community Member',
              category: data.category || 'General',
              title: data.title || '',
              body: data.body || '',
              repliesCount: data.repliesCount || 0,
              likes: data.likes || 0,
              date: data.date || 'Recent',
              createdAt: data.createdAt
            });
          });
          setForumPosts(loaded);
        }
        setIsSyncingDb(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'longevityForum');
        setIsSyncingDb(false);
      }
    );

    // Health Journal Listener
    const journalUnsub = onSnapshot(
      collection(db, 'longevityJournals'),
      (snapshot) => {
        if (!snapshot.empty) {
          const loadedJ: HealthJournalEntry[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            loadedJ.push({
              id: docSnap.id,
              authorName: data.authorName || 'Dr. T User',
              role: data.role || 'Self-Care Advocate',
              entryType: data.entryType || 'Caregiver Note',
              title: data.title || '',
              content: data.content || '',
              riskLevel: data.riskLevel || 'GREEN',
              date: data.date || 'Recent',
              createdAt: data.createdAt
            });
          });
          setJournalEntries(loadedJ);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'longevityJournals');
      }
    );

    return () => {
      forumUnsub();
      journalUnsub();
    };
  }, []);

  // Handle AI Tutor Query Generation (Socratic Learning Engine)
  const handleSendTutorQuery = (overrideText?: string) => {
    const textToSend = overrideText || tutorChatInput;
    if (!textToSend.trim()) return;

    const newHistory = [
      ...tutorChatHistory,
      { sender: 'user' as const, text: textToSend }
    ];
    setTutorChatHistory(newHistory);
    if (!overrideText) setTutorChatInput('');
    setIsGeneratingTutor(true);

    // Simulate Socratic AI Tutor Response based on agent spec
    setTimeout(() => {
      let responseText = '';
      let sources = ['National Institute on Aging', 'Harvard Health Publishing'];
      let reasoning = 'Triangulated against gerontological consensus and clinical evidence.';

      const lower = textToSend.toLowerCase();

      if (lower.includes('protein') || lower.includes('iron') || lower.includes('anemia') || lower.includes('food')) {
        responseText = `Great question regarding longevity nutrition. Older adults experience anabolic resistance and altered gastric intrinsic factor absorption. To overcome this, aim for 1.2-1.5g protein/kg/day distributed across meals. For bioavailable iron without GI distress, combine heme sources or non-heme plant iron with Vitamin C-rich peppers or citrus while avoiding concurrent high-calcium meals.`;
        sources.push('WHO Nutrition Guidelines for Older Persons', 'Dr. T Food-as-Medicine Database');
      } else if (lower.includes('fall') || lower.includes('balance') || lower.includes('exercise')) {
        responseText = `Fall prevention hinges on three Pillars: 1) Neuromuscular balance (e.g. Tai Chi & standing weight shifts), 2) Medication reconciliation (reviewing drugs causing orthostatic hypotension), and 3) Environmental modifications (removing throw rugs, adding 45-degree bathroom grab bars). Would you like me to walk you through a 5-minute seated leg-strengthening routine?`;
        sources.push('CDC STEADI Fall Prevention Protocol', 'American Geriatrics Society');
      } else if (lower.includes('dementia') || lower.includes('forget') || lower.includes('memory') || lower.includes('alzheimer')) {
        responseText = `When supporting neurocognitive health or a family member with memory changes, we distinguish transient processing slowing from functional daily impairment. When behavioral agitation occurs, practice Validation Therapy: honor the emotional feeling rather than confronting factual misremembering. Always ensure sudden acute confusion (Delirium) is evaluated immediately by a physician to rule out underlying UTI or infection.`;
        sources.push('Alzheimer’s Association Caregiver Guide', 'Merck Manual Geriatric Psychiatry');
      } else {
        responseText = `Thank you for asking. In ${selectedAgent.role} research, we emphasize that healthspan precedes lifespan. Every intervention—whether cellular energy optimization, strength building, or cognitive exercise—should answer 5 key questions: What is happening? Why does it matter? What can you do? When to seek help? And what are the red flags? How would you like to apply this to your daily routine?`;
      }

      setTutorChatHistory([
        ...newHistory,
        {
          sender: 'agent',
          text: responseText,
          sources,
          reasoning
        }
      ]);
      setIsGeneratingTutor(false);

      if (voiceFirstMode) {
        speakText(responseText);
      }
    }, 1200);
  };

  // Handle Human-in-the-Loop Symptom Triage Assessment
  const handleAssessSymptom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simulatedSymptom.trim()) return;

    const text = simulatedSymptom.toLowerCase();

    if (
      text.includes('chest pain') || 
      text.includes('shortness of breath') || 
      text.includes('stroke') || 
      text.includes('facial drooping') || 
      text.includes('slurred speech') || 
      text.includes('fainted') ||
      text.includes('black stool') ||
      text.includes('severe bleeding')
    ) {
      setAssessedRisk({
        level: 'RED',
        title: 'EMERGENCY ESCALATION REQUIRED (Level Red)',
        description: 'The symptoms described indicate a potentially life-threatening medical emergency. Immediate emergency medical services are required.',
        recommendedActions: [
          'CALL 911 (OR LOCAL EMERGENCY SERVICES) IMMEDIATELY',
          'Do NOT attempt to drive yourself to the hospital',
          'Unlock the front door so paramedics can enter easily',
          'Gather current prescription medicine bottles for emergency responders'
        ],
        redFlags: [
          'Chest pain radiating to arm, jaw, or neck',
          'Sudden inability to speak or move one side of the body',
          'Loss of consciousness or severe difficulty breathing'
        ]
      });
    } else if (
      text.includes('dizziness upon standing') || 
      text.includes('near fall') || 
      text.includes('new memory confusion') || 
      text.includes('persistent fever') ||
      text.includes('unexplained fatigue') ||
      text.includes('joint swelling')
    ) {
      setAssessedRisk({
        level: 'ORANGE',
        title: 'PROMPT CLINICAL APPOINTMENT RECOMMENDED (Level Orange)',
        description: 'These symptoms warrant a prompt clinical evaluation by your primary physician or geriatric healthcare team within 24-48 hours.',
        recommendedActions: [
          'Contact your doctor’s office or clinic scheduling desk today',
          'Prepare a written log of when the symptoms started and their frequency',
          'Measure your blood pressure, heart rate, and temperature if home vitals equipment is available',
          'Have a family member or caregiver accompany you to the appointment'
        ],
        redFlags: ['Symptoms rapidly worsening over hours', 'Inability to keep liquids down for 24 hours']
      });
    } else if (
      text.includes('mild tiredness') || 
      text.includes('dry skin') || 
      text.includes('routine question') ||
      text.includes('sleep advice') ||
      text.includes('dietary question')
    ) {
      setAssessedRisk({
        level: 'YELLOW',
        title: 'ROUTINE CLINICIAN REVIEW (Level Yellow)',
        description: 'Common wellness or mild symptom inquiry. Recommended to mention during your next routine medical checkup.',
        recommendedActions: [
          'Add this item to your Telemedicine Prep or Doctor Visit Question List',
          'Track symptom occurrence over the next 7 days in your Dr. T Health Journal',
          'Review related educational modules in School 4 (Geriatric Medicine) or School 6 (Nutrition)'
        ],
        redFlags: ['Symptom suddenly changes in intensity or frequency']
      });
    } else {
      setAssessedRisk({
        level: 'GREEN',
        title: 'EDUCATIONAL INFORMATION ONLY (Level Green)',
        description: 'General health education and healthy aging guidance. No immediate clinical escalation indicated.',
        recommendedActions: [
          'Continue engaging in regular physical movement, balanced protein nutrition, and mental exercise',
          'Utilize Dr. T AI Tutors to learn more about healthy longevity science'
        ],
        redFlags: ['Always consult a licensed physician if you feel unwell']
      });
    }
  };

  // Submit Quiz Answers
  const handleSubmitQuiz = () => {
    let correct = 0;
    const total = selectedModule.quizQuestions.length;
    selectedModule.quizQuestions.forEach((q) => {
      if (selectedQuizAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });
    const calculated = Math.round((correct / (total || 1)) * 100);
    setUserScore(calculated);
    setQuizSubmitted(true);

    if (!completedModuleIds.includes(selectedModule.id)) {
      setCompletedModuleIds([...completedModuleIds, selectedModule.id]);
      setUserProgressMinutes(userProgressMinutes + selectedModule.durationMinutes);
    }
  };

  // Publish Community Forum Post to Firestore
  const handleCreateForumPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostBody.trim()) return;

    try {
      await addDoc(collection(db, 'longevityForum'), {
        author: 'Dr. T Certified Learner',
        role: 'Academy Member',
        category: newPostCategory,
        title: newPostTitle.trim(),
        body: newPostBody.trim(),
        repliesCount: 0,
        likes: 1,
        date: 'Just now',
        createdAt: serverTimestamp()
      });

      setNewPostTitle('');
      setNewPostBody('');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'longevityForum');
    }
  };

  // Create Health Journal Entry in Firestore
  const handleCreateJournalEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJournalTitle.trim() || !newJournalContent.trim()) return;

    try {
      await addDoc(collection(db, 'longevityJournals'), {
        authorName: 'Dr. T Practitioner / Caregiver',
        role: 'Care Advocate',
        entryType: newJournalType,
        title: newJournalTitle.trim(),
        content: newJournalContent.trim(),
        riskLevel: 'GREEN',
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: serverTimestamp()
      });

      setNewJournalTitle('');
      setNewJournalContent('');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'longevityJournals');
    }
  };

  return (
    <div className={`space-y-6 font-sans transition-all ${seniorMode ? 'text-lg leading-relaxed' : 'text-sm'}`}>
      
      {/* GLOBAL ACADEMY HEADER BANNER */}
      <div className="bg-gradient-to-br from-stone-900 via-rose-950 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-rose-900/40">
        <div className="absolute right-0 top-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-900/50 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-rose-600/30 rounded-2xl border border-rose-400/40 text-rose-300">
                <GraduationCap className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-black uppercase tracking-widest text-rose-300 bg-rose-950/80 px-2.5 py-0.5 rounded-full border border-rose-800">
                  Global Educational & Care Ecosystem
                </span>
                <h1 className="text-2xl sm:text-4xl font-black font-display text-white tracking-tight">
                  Dr. T Institute
                </h1>
              </div>
            </div>

            {/* Accessibility & Voice Control Toolbar */}
            <div className="flex flex-wrap items-center gap-2 bg-stone-950/80 p-2 rounded-2xl border border-stone-800 text-xs font-mono">
              <button
                onClick={() => setSeniorMode(!seniorMode)}
                className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all ${
                  seniorMode ? 'bg-amber-500 text-stone-950 font-black' : 'bg-stone-800 text-stone-300 hover:text-white'
                }`}
                title="Toggle Senior-Friendly Mode (Larger fonts, higher contrast)"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Senior View</span>
              </button>

              <button
                onClick={() => setVoiceFirstMode(!voiceFirstMode)}
                className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all ${
                  voiceFirstMode ? 'bg-rose-600 text-white font-black animate-pulse' : 'bg-stone-800 text-stone-300 hover:text-white'
                }`}
                title="Toggle Voice-First Mode (Reads content aloud)"
              >
                {isSpeaking ? <Volume2 className="w-3.5 h-3.5 text-rose-300" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>Voice First</span>
              </button>

              <button
                onClick={() => setLowBandwidthMode(!lowBandwidthMode)}
                className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all ${
                  lowBandwidthMode ? 'bg-teal-600 text-white font-black' : 'bg-stone-800 text-stone-300 hover:text-white'
                }`}
                title="Low Bandwidth Mode for Rural Outreach"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Low Bandwidth</span>
              </button>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-stone-300 max-w-4xl leading-relaxed">
            Empowering complete beginners, patients, family caregivers, community health workers, and medical professionals with evidence-based gerontology, geriatric care, AI assistance, and human-in-the-loop clinical escalation. <strong className="text-rose-300">Healthspan &gt; Lifespan.</strong>
          </p>

          {/* Quick Metrics & Credential Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 font-mono text-xs">
            <div className="p-3 bg-stone-900/80 rounded-2xl border border-stone-800">
              <span className="text-[10px] text-stone-400 block uppercase">10 MOOC Schools</span>
              <span className="text-lg font-black text-rose-400">100% Active</span>
            </div>
            <div className="p-3 bg-stone-900/80 rounded-2xl border border-stone-800">
              <span className="text-[10px] text-stone-400 block uppercase">AI Tutors Active</span>
              <span className="text-lg font-black text-emerald-400">10 Personas</span>
            </div>
            <div className="p-3 bg-stone-900/80 rounded-2xl border border-stone-800">
              <span className="text-[10px] text-stone-400 block uppercase">MOOC Progress</span>
              <span className="text-lg font-black text-amber-400">{userProgressMinutes} Mins</span>
            </div>
            <div className="p-3 bg-stone-900/80 rounded-2xl border border-stone-800">
              <span className="text-[10px] text-stone-400 block uppercase">Triage Safety</span>
              <span className="text-lg font-black text-blue-400">4 Risk Levels</span>
            </div>
            <button
              onClick={() => setShowDiplomaModal(true)}
              className="p-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 rounded-2xl border border-amber-400 font-bold text-left cursor-pointer transition-all shadow-md col-span-2 sm:col-span-1 flex flex-col justify-between"
            >
              <span className="text-[10px] text-stone-900 font-extrabold uppercase flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-stone-950" /> Official Seal
              </span>
              <span className="text-xs font-black tracking-tight text-stone-950 flex items-center justify-between">
                Dr. T Credential <ChevronRight className="w-4 h-4" />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN NAVIGATION TAB PILLS */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-3">
        <button
          onClick={() => setActiveTab('schools')}
          className={`px-4 py-2 rounded-2xl text-xs font-mono font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'schools'
              ? 'bg-rose-600 text-white shadow-md'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>1. Schools & Pathways</span>
        </button>

        <button
          onClick={() => setActiveTab('tutors')}
          className={`px-4 py-2 rounded-2xl text-xs font-mono font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'tutors'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>2. Specialized AI Tutors (10)</span>
        </button>

        <button
          onClick={() => setActiveTab('escalation')}
          className={`px-4 py-2 rounded-2xl text-xs font-mono font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'escalation'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>3. Human-in-the-Loop Triage</span>
        </button>

        <button
          onClick={() => setActiveTab('certifications')}
          className={`px-4 py-2 rounded-2xl text-xs font-mono font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'certifications'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>4. Certifications (5 Tracks)</span>
        </button>

        <button
          onClick={() => setActiveTab('resources')}
          className={`px-4 py-2 rounded-2xl text-xs font-mono font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'resources'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>5. Open Resource Library</span>
        </button>

        <button
          onClick={() => setActiveTab('community')}
          className={`px-4 py-2 rounded-2xl text-xs font-mono font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'community'
              ? 'bg-teal-600 text-white shadow-md'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>6. Community & Forum</span>
        </button>

        <button
          onClick={() => setActiveTab('companion')}
          className={`px-4 py-2 rounded-2xl text-xs font-mono font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'companion'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
          }`}
        >
          <HeartPulse className="w-4 h-4" />
          <span>7. Dr. T Companion Journal</span>
        </button>
      </div>

      {/* TAB 1: SCHOOLS & PATHWAYS */}
      {activeTab === 'schools' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: 10 Schools Selector */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-base font-black font-display text-stone-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-rose-600" />
              10 Academic Schools
            </h3>

            <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
              {SCHOOLS_DATA.map((school) => {
                const isSelected = selectedSchool.id === school.id;
                return (
                  <div
                    key={school.id}
                    onClick={() => {
                      setSelectedSchool(school);
                      setSelectedModule(school.modules[0]);
                      setQuizSubmitted(false);
                      setSelectedQuizAnswers({});
                    }}
                    className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? `${school.bgLight} ${school.borderColor} border-2 shadow-md`
                        : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-full ${school.color} bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800`}>
                        School #{school.number}
                      </span>
                      <span className="text-[10px] font-mono text-stone-400">
                        {school.modules.length} Modules
                      </span>
                    </div>
                    <h4 className={`text-xs font-extrabold ${isSelected ? 'text-stone-900 dark:text-white' : 'text-stone-800 dark:text-stone-200'}`}>
                      {school.title}
                    </h4>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2 mt-0.5">
                      {school.subtitle}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected School Module Viewer & Interactive Quiz */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
              
              {/* School Header */}
              <div className="border-b border-stone-100 dark:border-stone-800 pb-4">
                <span className="text-[10px] font-mono font-bold text-rose-600 dark:text-rose-400 uppercase">
                  School #{selectedSchool.number} • Curriculum Detail
                </span>
                <h3 className="text-xl font-black text-stone-900 dark:text-white">
                  {selectedSchool.title}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  {selectedSchool.subtitle}
                </p>
              </div>

              {/* Module Selector Tabs */}
              <div className="flex flex-wrap items-center gap-2">
                {selectedSchool.modules.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelectedModule(m);
                      setQuizSubmitted(false);
                      setSelectedQuizAnswers({});
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      selectedModule.id === m.id
                        ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
                    }`}
                  >
                    {m.title}
                  </button>
                ))}
              </div>

              {/* MOOC Learning Mode Selector Sub-Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-1.5 bg-stone-100 dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800 text-xs font-mono font-bold">
                <button
                  onClick={() => setLearningTabMode('lecture')}
                  className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    learningTabMode === 'lecture'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Lesson Overview</span>
                </button>

                <button
                  onClick={() => {
                    setLearningTabMode('flashcards');
                    setFlashcardIndex(0);
                    setIsFlashcardFlipped(false);
                  }}
                  className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    learningTabMode === 'flashcards'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Flashcard Deck</span>
                </button>

                <button
                  onClick={() => setLearningTabMode('quiz')}
                  className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    learningTabMode === 'quiz'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Knowledge Check</span>
                </button>

                <button
                  onClick={() => setLearningTabMode('exercise')}
                  className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    learningTabMode === 'exercise'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Practical Lab</span>
                </button>
              </div>

              {/* MODE 1: LECTURE OVERVIEW & SIMULATED AUDIO STREAM */}
              {learningTabMode === 'lecture' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3.5 bg-stone-50 dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800 text-xs">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-rose-600 dark:text-rose-400 uppercase block">
                        Dr. T Institute Video Lecture & Speech Stream
                      </span>
                      <h4 className="font-bold text-stone-900 dark:text-white font-mono">{selectedModule.title}</h4>
                      <p className="text-stone-600 dark:text-stone-400 mt-0.5">{selectedModule.description}</p>
                    </div>
                    <button
                      onClick={() => speakText(`${selectedModule.title}. ${selectedModule.description}. Key takeaways: ${selectedModule.keyTakeaways.join('. ')}`)}
                      className="p-2.5 bg-rose-600 text-white hover:bg-rose-700 rounded-xl cursor-pointer flex items-center gap-1.5 font-mono text-xs font-bold"
                      title="Read Module Aloud"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>{isSpeaking ? 'Pause' : 'Play Audio'}</span>
                    </button>
                  </div>

                  {/* Simulated Audio/Video Lecture Player */}
                  <div className="p-4 bg-stone-950 text-white rounded-2xl border border-stone-800 space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-rose-400" />
                        <span className="font-bold text-stone-200">Dr. T Interactive Lecture Stream</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full">
                        HD 1080p
                      </span>
                    </div>

                    {/* Equalizer animation */}
                    <div className="flex items-center gap-1 h-6 bg-stone-900 px-3 rounded-xl border border-stone-800">
                      {[40, 70, 30, 90, 60, 80, 50, 95, 40, 85, 60, 30, 75, 90, 45, 65].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-rose-500 rounded-full transition-all duration-300"
                          style={{ height: isSpeaking ? `${h}%` : '20%' }}
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-stone-400">
                      <span>02:15 / {selectedModule.durationMinutes}:00</span>
                      <span>Playback Speed: 1.0x</span>
                    </div>
                  </div>

                  {/* Key Takeaways */}
                  <div className="space-y-2">
                    <h5 className="text-xs font-black font-mono uppercase text-stone-900 dark:text-white flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Key Clinical & Scientific Takeaways
                    </h5>
                    <div className="space-y-1.5 text-xs text-stone-700 dark:text-stone-300">
                      {selectedModule.keyTakeaways.map((k, idx) => (
                        <div key={idx} className="p-2.5 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200/50 flex items-start gap-2">
                          <span className="font-mono font-bold text-emerald-600">•</span>
                          <span>{k}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* The 5 Universal Questions Framework */}
                  <div className="p-4 bg-stone-900 text-white rounded-2xl space-y-3 text-xs">
                    <h5 className="font-mono font-black text-rose-300 uppercase tracking-wider flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-rose-400" /> The 5 Essential Questions Framework
                    </h5>
                    <div className="space-y-2 font-mono text-[11px] leading-relaxed">
                      <p><strong className="text-amber-300">1. What is happening?</strong> {selectedModule.fiveQuestions.whatIsHappening}</p>
                      <p><strong className="text-amber-300">2. Why does it matter?</strong> {selectedModule.fiveQuestions.whyDoesItMatter}</p>
                      <p><strong className="text-amber-300">3. What can I do?</strong> {selectedModule.fiveQuestions.whatCanIDo}</p>
                      <p><strong className="text-amber-300">4. When should I seek help?</strong> {selectedModule.fiveQuestions.whenToSeekHelp}</p>
                      <div className="p-2.5 bg-rose-950/80 border border-rose-800 rounded-xl text-rose-200">
                        <strong className="text-rose-400 uppercase block mb-1">5. Clinical Red Flags:</strong>
                        <ul className="list-disc list-inside space-y-0.5">
                          {selectedModule.fiveQuestions.redFlags.map((rf, rfi) => (
                            <li key={rfi}>{rf}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MODE 2: INTERACTIVE FLASHCARD DECK */}
              {learningTabMode === 'flashcards' && (() => {
                const cards = getModuleFlashcards(selectedModule, selectedSchool);
                const currentCard = cards[flashcardIndex] || cards[0];
                return (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="font-bold text-stone-500">
                        Flashcard {flashcardIndex + 1} of {cards.length}
                      </span>
                      <span className="px-2.5 py-0.5 bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 rounded-full font-bold">
                        {currentCard.category}
                      </span>
                    </div>

                    {/* Flashcard 3D Card Container */}
                    <div
                      onClick={() => setIsFlashcardFlipped(!isFlashcardFlipped)}
                      className="min-h-[220px] p-6 bg-gradient-to-br from-stone-900 to-stone-950 text-white rounded-3xl border-2 border-rose-500/50 shadow-xl flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.01]"
                    >
                      <div className="flex items-center justify-between text-rose-400 text-xs font-mono">
                        <span className="flex items-center gap-1.5">
                          <Layers className="w-4 h-4" /> Dr. T Study Card
                        </span>
                        <span className="text-[10px] text-stone-400 uppercase tracking-widest">
                          {isFlashcardFlipped ? 'Answer Side (Click to Flip)' : 'Question Side (Click to Flip)'}
                        </span>
                      </div>

                      <div className="my-6 text-center space-y-2">
                        {isFlashcardFlipped ? (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                            <span className="text-[10px] font-mono text-emerald-400 uppercase font-black tracking-widest">
                              Clinical Guidance & Explanation
                            </span>
                            <p className="text-sm sm:text-base font-bold text-emerald-200 leading-relaxed max-w-xl mx-auto">
                              {currentCard.back}
                            </p>
                          </motion.div>
                        ) : (
                          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                            <span className="text-[10px] font-mono text-amber-400 uppercase font-black tracking-widest">
                              Concept / Term
                            </span>
                            <p className="text-lg sm:text-xl font-black text-white font-display max-w-xl mx-auto">
                              {currentCard.front}
                            </p>
                          </motion.div>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono text-stone-400 border-t border-stone-800 pt-3">
                        <span>💡 Tap card to flip answer</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            speakText(isFlashcardFlipped ? currentCard.back : currentCard.front);
                          }}
                          className="p-1.5 bg-stone-800 hover:bg-stone-700 text-rose-300 rounded-lg cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Flashcard Navigation */}
                    <div className="flex items-center justify-between gap-3 pt-2 font-mono text-xs">
                      <button
                        onClick={() => {
                          setFlashcardIndex((prev) => (prev > 0 ? prev - 1 : cards.length - 1));
                          setIsFlashcardFlipped(false);
                        }}
                        className="px-4 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 rounded-xl font-bold cursor-pointer"
                      >
                        ← Previous
                      </button>

                      <button
                        onClick={() => setIsFlashcardFlipped(!isFlashcardFlipped)}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold cursor-pointer flex items-center gap-1.5"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>Flip Card</span>
                      </button>

                      <button
                        onClick={() => {
                          setFlashcardIndex((prev) => (prev < cards.length - 1 ? prev + 1 : 0));
                          setIsFlashcardFlipped(false);
                        }}
                        className="px-4 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 rounded-xl font-bold cursor-pointer"
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* MODE 3: KNOWLEDGE CHECK QUIZ */}
              {learningTabMode === 'quiz' && (
                <div className="p-4 bg-stone-50 dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4">
                  <h5 className="font-mono font-black text-stone-900 dark:text-white uppercase flex items-center gap-2 text-xs">
                    <Award className="w-4 h-4 text-amber-600" /> Knowledge Check & Certification Assessment
                  </h5>

                  {selectedModule.quizQuestions.map((q) => (
                    <div key={q.id} className="space-y-2 text-xs">
                      <p className="font-bold text-stone-800 dark:text-stone-200">{q.question}</p>
                      <div className="space-y-1.5">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = selectedQuizAnswers[q.id] === optIdx;
                          return (
                            <button
                              key={optIdx}
                              onClick={() => setSelectedQuizAnswers({ ...selectedQuizAnswers, [q.id]: optIdx })}
                              disabled={quizSubmitted}
                              className={`w-full text-left p-2.5 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-rose-600 text-white border-rose-600 font-bold'
                                  : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200'
                              }`}
                            >
                              {optIdx + 1}. {opt}
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <div className={`p-3 rounded-xl border text-xs font-mono ${
                          selectedQuizAnswers[q.id] === q.correctIndex
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                            : 'bg-rose-50 text-rose-900 border-rose-300'
                        }`}>
                          <strong className="block font-bold">
                            {selectedQuizAnswers[q.id] === q.correctIndex ? '✓ Correct Answer!' : '✕ Incorrect'}
                          </strong>
                          <p className="mt-1">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={handleSubmitQuiz}
                      disabled={quizSubmitted || Object.keys(selectedQuizAnswers).length === 0}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-mono font-bold text-xs cursor-pointer disabled:opacity-50"
                    >
                      {quizSubmitted ? 'Assessment Submitted' : 'Submit Knowledge Check'}
                    </button>

                    {quizSubmitted && userScore !== null && (
                      <span className="font-mono font-black text-emerald-600 text-xs">
                        Score: {userScore}% Passed!
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* MODE 4: PRACTICAL LAB EXERCISE */}
              {learningTabMode === 'exercise' && (
                <div className="p-4 bg-stone-50 dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4 text-xs font-mono">
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold">
                    <FileText className="w-4 h-4" />
                    <span className="uppercase">Practical Case Exercise & Reflection Lab</span>
                  </div>

                  <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                    {selectedModule.practicalExercise || `Perform a 5-minute self-audit or caregiver consultation based on the core principles of ${selectedModule.title}. Log your observed findings, action steps, and clinical observations below.`}
                  </p>

                  <div className="space-y-2">
                    <label className="block font-bold text-stone-800 dark:text-stone-200">
                      Your Practical Reflection & Action Notes:
                    </label>
                    <textarea
                      rows={4}
                      value={exerciseInput}
                      onChange={(e) => setExerciseInput(e.target.value)}
                      placeholder="e.g. Discussed medication timing with patient. Conducted 10-second stand test. Identified 1 potential fall hazard in home corridor."
                      className="w-full p-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-stone-900 dark:text-white"
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (!exerciseInput.trim()) return;
                      setCompletedExercises({ ...completedExercises, [selectedModule.id]: true });
                      setUserProgressMinutes((prev) => prev + 15);
                      alert("Practical Lab Exercise Completed! +15 Minutes recorded on Dr. T Institute Transcript.");
                    }}
                    disabled={completedExercises[selectedModule.id] || !exerciseInput.trim()}
                    className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold cursor-pointer disabled:opacity-50 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{completedExercises[selectedModule.id] ? 'Lab Exercise Logged!' : 'Submit & Complete Exercise'}</span>
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SPECIALIZED AI TUTORS */}
      {activeTab === 'tutors' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: 10 AI Agents List */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-base font-black font-display text-stone-900 dark:text-white flex items-center gap-2">
              <Brain className="w-4 h-4 text-emerald-600" />
              10 Specialized AI Agents
            </h3>

            <div className="space-y-2.5 max-h-[650px] overflow-y-auto pr-1">
              {AI_AGENT_SPECS.map((agent) => {
                const isSelected = selectedAgent.id === agent.id;
                return (
                  <div
                    key={agent.id}
                    onClick={() => {
                      setSelectedAgent(agent);
                      setTutorChatHistory([
                        {
                          sender: 'agent',
                          text: `Hello! I am ${agent.name}, your ${agent.role}. Specialty: ${agent.specialty}. How can I assist you today?`,
                          sources: ['NIH National Institute on Aging', 'Harvard Longevity Core']
                        }
                      ]);
                    }}
                    className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-stone-900 text-white border-emerald-500 border-2 shadow-md'
                        : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-stone-300 text-stone-800 dark:text-stone-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                        {agent.specialty}
                      </span>
                    </div>
                    <h4 className="text-xs font-black font-display">
                      {agent.name}
                    </h4>
                    <p className="text-[11px] font-mono text-rose-400 font-bold mt-0.5">
                      {agent.role}
                    </p>
                    <p className="text-[11px] text-stone-400 line-clamp-2 mt-1">
                      {agent.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Socratic AI Tutor Chat Interface */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4 flex flex-col justify-between min-h-[600px]">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                    Active AI Educator • Socratic Reasoner
                  </span>
                  <h3 className="text-base font-black text-stone-900 dark:text-white font-display">
                    {selectedAgent.name} ({selectedAgent.role})
                  </h3>
                </div>
                <button
                  onClick={() => handleSendTutorQuery(selectedAgent.samplePrompt)}
                  className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 rounded-xl text-xs font-mono font-bold cursor-pointer"
                >
                  Try Sample Prompt
                </button>
              </div>

              {/* Chat Message History */}
              <div className="space-y-3 overflow-y-auto max-h-[420px] p-2">
                {tutorChatHistory.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-2xl text-xs space-y-2 ${
                      msg.sender === 'user'
                        ? 'bg-stone-900 text-white ml-8 border border-stone-800 font-mono'
                        : 'bg-stone-50 dark:bg-stone-950 text-stone-800 dark:text-stone-200 mr-8 border border-stone-200 dark:border-stone-800 font-sans'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[10px] text-stone-400">
                      <span className="font-bold">{msg.sender === 'user' ? 'You (Learner)' : selectedAgent.name}</span>
                      {msg.sender === 'agent' && (
                        <button
                          onClick={() => speakText(msg.text)}
                          className="text-rose-500 hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <Volume2 className="w-3 h-3" /> Read
                        </button>
                      )}
                    </div>
                    <p className="leading-relaxed">{msg.text}</p>

                    {msg.sources && msg.sources.length > 0 && (
                      <div className="pt-2 border-t border-stone-200/60 dark:border-stone-800/60 text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                        <strong>Cited Clinical Sources:</strong> {msg.sources.join(' • ')}
                      </div>
                    )}
                  </div>
                ))}

                {isGeneratingTutor && (
                  <div className="p-3 bg-stone-100 dark:bg-stone-800 text-stone-500 rounded-2xl text-xs font-mono animate-pulse">
                    {selectedAgent.name} is formulating Socratic reasoning & clinical evidence...
                  </div>
                )}
              </div>

              {/* Input Bar */}
              <form onSubmit={(e) => { e.preventDefault(); handleSendTutorQuery(); }} className="flex items-center gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                <input
                  type="text"
                  placeholder={`Ask ${selectedAgent.name} a question about healthy aging...`}
                  value={tutorChatInput}
                  onChange={(e) => setTutorChatInput(e.target.value)}
                  className="flex-1 p-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl text-xs text-stone-900 dark:text-white focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isGeneratingTutor || !tutorChatInput.trim()}
                  className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HUMAN-IN-THE-LOOP TRIAGE */}
      {activeTab === 'escalation' && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
          <div className="border-b border-stone-100 dark:border-stone-800 pb-4">
            <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 uppercase">
              Clinical Safety & Risk Detection Framework
            </span>
            <h3 className="text-xl font-black text-stone-900 dark:text-white font-display">
              4-Level Human-in-the-Loop Escalation Protocol
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              AI acts exclusively as educator, navigator, and risk detector. All clinical diagnosis and prescribing remain strictly human-supervised.
            </p>
          </div>

          {/* 4 Risk Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 rounded-2xl space-y-2">
              <span className="px-2.5 py-0.5 bg-emerald-600 text-white rounded-full text-[10px] font-mono font-black uppercase">
                LEVEL GREEN
              </span>
              <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">Education Only</h4>
              <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                General wellness inquiries, diet tips, and educational modules. No clinical concern detected.
              </p>
            </div>

            <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 rounded-2xl space-y-2">
              <span className="px-2.5 py-0.5 bg-amber-600 text-white rounded-full text-[10px] font-mono font-black uppercase">
                LEVEL YELLOW
              </span>
              <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">Potential Concern</h4>
              <p className="text-[11px] text-amber-800 dark:text-amber-300">
                Recommend adding question to doctor visit list for next routine clinical checkup.
              </p>
            </div>

            <div className="p-4 bg-orange-50 dark:bg-orange-950/40 border border-orange-300 rounded-2xl space-y-2">
              <span className="px-2.5 py-0.5 bg-orange-600 text-white rounded-full text-[10px] font-mono font-black uppercase">
                LEVEL ORANGE
              </span>
              <h4 className="text-xs font-bold text-orange-900 dark:text-orange-200">Prompt Medical Visit</h4>
              <p className="text-[11px] text-orange-800 dark:text-orange-300">
                Schedule a medical appointment within 24–48 hours for symptom evaluation.
              </p>
            </div>

            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 rounded-2xl space-y-2">
              <span className="px-2.5 py-0.5 bg-rose-600 text-white rounded-full text-[10px] font-mono font-black uppercase">
                LEVEL RED
              </span>
              <h4 className="text-xs font-bold text-rose-900 dark:text-rose-200">Emergency Escalation</h4>
              <p className="text-[11px] text-rose-800 dark:text-rose-300">
                Potential life-threatening red flag. Instruct immediate emergency contact (911/ER).
              </p>
            </div>
          </div>

          {/* Symptom Risk Evaluator Form */}
          <div className="p-5 bg-stone-50 dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4">
            <h4 className="text-xs font-black font-mono text-stone-900 dark:text-white uppercase flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              Symptom & Scenario Risk Evaluator
            </h4>

            <form onSubmit={handleAssessSymptom} className="space-y-3">
              <input
                type="text"
                placeholder="Describe a symptom (e.g. 'Sudden chest pressure', 'Dizziness when standing up', 'Dry skin advice')..."
                value={simulatedSymptom}
                onChange={(e) => setSimulatedSymptom(e.target.value)}
                className="w-full p-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-xs text-stone-900 dark:text-white focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-mono font-bold cursor-pointer"
              >
                Evaluate Risk Level
              </button>
            </form>

            {assessedRisk && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl border text-xs space-y-3 ${
                  assessedRisk.level === 'RED'
                    ? 'bg-rose-900 text-white border-rose-500'
                    : assessedRisk.level === 'ORANGE'
                    ? 'bg-orange-950 text-white border-orange-500'
                    : assessedRisk.level === 'YELLOW'
                    ? 'bg-amber-950 text-white border-amber-500'
                    : 'bg-emerald-950 text-white border-emerald-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h5 className="font-mono font-black text-sm uppercase">{assessedRisk.title}</h5>
                  <span className="font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/20">
                    {assessedRisk.level}
                  </span>
                </div>
                <p className="leading-relaxed">{assessedRisk.description}</p>

                <div className="space-y-1">
                  <strong className="font-mono uppercase text-[10px] text-amber-300 block">Recommended Action Steps:</strong>
                  <ul className="list-disc list-inside space-y-1 text-[11px]">
                    {assessedRisk.recommendedActions.map((act, ai) => (
                      <li key={ai}>{act}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: CERTIFICATIONS */}
      {activeTab === 'certifications' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-2">
            <span className="text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400 uppercase">
              Academic Credentials & Professional Tracks
            </span>
            <h3 className="text-xl font-black text-stone-900 dark:text-white font-display">
              5 Certification Credentials
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Earn shareable digital certificates upon completing required school assessments and knowledge checks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CERTIFICATION_TRACKS.map((cert) => (
              <div
                key={cert.id}
                className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <span className={`text-[10px] font-mono font-black px-2.5 py-1 rounded-full ${cert.badgeColor}`}>
                    {cert.title}
                  </span>
                  <p className="text-xs text-stone-600 dark:text-stone-300 mt-2 font-bold">
                    {cert.subtitle}
                  </p>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    {cert.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-stone-400">Req: Schools {cert.requiredSchools.join(', ')}</span>
                  <button
                    onClick={() => alert(`Certificate Issued: ${cert.title}\nPassing Score: ${cert.minQuizScore}%`)}
                    className="px-3 py-1 bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-300 rounded-xl font-bold cursor-pointer"
                  >
                    View Credential
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: OPEN RESOURCE LIBRARY */}
      {activeTab === 'resources' && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 dark:border-stone-800 pb-4">
            <div>
              <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 uppercase">
                Peer-Reviewed Public Repositories
              </span>
              <h3 className="text-xl font-black text-stone-900 dark:text-white font-display">
                Open Resource Library
              </h3>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-stone-400" />
              <input
                type="text"
                placeholder="Search resources..."
                value={resourceSearchQuery}
                onChange={(e) => setResourceSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-2 text-xs bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none w-full text-stone-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {OPEN_RESOURCES.filter(r => r.title.toLowerCase().includes(resourceSearchQuery.toLowerCase()) || r.topic.toLowerCase().includes(resourceSearchQuery.toLowerCase())).map((res) => (
              <div
                key={res.id}
                className="p-4 bg-stone-50 dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    Source: {res.source}
                  </span>
                  <span className="text-[10px] font-mono text-stone-400">{res.difficulty}</span>
                </div>
                <h4 className="font-bold text-stone-900 dark:text-white">{res.title}</h4>
                <p className="text-stone-600 dark:text-stone-300 text-[11px]">{res.summary}</p>
                <div className="pt-2 flex items-center justify-between font-mono text-[10px] text-blue-600 dark:text-blue-400">
                  <span>Topic: {res.topic}</span>
                  <a href={res.urlSnippet} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1 font-bold">
                    Access Portal <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: COMMUNITY & FORUM */}
      {activeTab === 'community' && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
          <div className="border-b border-stone-100 dark:border-stone-800 pb-4">
            <span className="text-[10px] font-mono font-bold text-teal-600 dark:text-teal-400 uppercase">
              Peer Support & Community Health Networks
            </span>
            <h3 className="text-xl font-black text-stone-900 dark:text-white font-display">
              Caregiver & Learner Forum (Live Firestore Synced)
            </h3>
          </div>

          {/* New Post Form */}
          <form onSubmit={handleCreateForumPost} className="p-4 bg-stone-50 dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3 text-xs">
            <h4 className="font-mono font-bold text-stone-900 dark:text-white">Start a Community Discussion</h4>
            <input
              type="text"
              placeholder="Discussion Title..."
              required
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              className="w-full p-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl"
            />
            <textarea
              rows={2}
              placeholder="Share a caregiver insight, question, or community resource..."
              required
              value={newPostBody}
              onChange={(e) => setNewPostBody(e.target.value)}
              className="w-full p-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-mono font-bold cursor-pointer"
            >
              Post to Community
            </button>
          </form>

          {/* Forum Posts List */}
          <div className="space-y-3">
            {forumPosts.map((post) => (
              <div key={post.id} className="p-4 bg-stone-50 dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2 text-xs">
                <div className="flex items-center justify-between font-mono text-[10px] text-stone-400">
                  <span className="font-bold text-teal-600">{post.author} ({post.role})</span>
                  <span>{post.date}</span>
                </div>
                <h4 className="font-bold text-stone-900 dark:text-white">{post.title}</h4>
                <p className="text-stone-700 dark:text-stone-300 leading-relaxed">{post.body}</p>
                <div className="pt-2 flex items-center justify-between font-mono text-[10px] text-stone-400">
                  <span>Category: {post.category}</span>
                  <div className="flex items-center gap-3">
                    <span>❤️ {post.likes} Likes</span>
                    <span>💬 {post.repliesCount} Replies</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: DR. T HEALTHY AGING COMPANION JOURNAL */}
      {activeTab === 'companion' && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
          <div className="border-b border-stone-100 dark:border-stone-800 pb-4">
            <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase">
              Personalized Longevity Extension
            </span>
            <h3 className="text-xl font-black text-stone-900 dark:text-white font-display">
              Dr. T Healthy Aging Companion Journal
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Log daily medication compliance, nutrition intake, iron anemia checks, and telemedicine prep agendas directly in Google Firestore.
            </p>
          </div>

          <form onSubmit={handleCreateJournalEntry} className="p-4 bg-stone-50 dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-mono font-bold mb-1">Entry Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Morning Vitals & Protein Meal Log"
                  value={newJournalTitle}
                  onChange={(e) => setNewJournalTitle(e.target.value)}
                  className="w-full p-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-mono font-bold mb-1">Entry Type</label>
                <select
                  value={newJournalType}
                  onChange={(e) => setNewJournalType(e.target.value as any)}
                  className="w-full p-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl cursor-pointer font-mono"
                >
                  <option value="Caregiver Note">Caregiver Note</option>
                  <option value="Medication">Medication Log</option>
                  <option value="Symptom">Symptom Track</option>
                  <option value="Nutrition Log">Nutrition & Iron Log</option>
                  <option value="Telemedicine Prep">Telemedicine Prep Agenda</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-mono font-bold mb-1">Journal Content & Vitals</label>
              <textarea
                rows={3}
                required
                placeholder="Log blood pressure, medication time, protein meal details, or doctor questions..."
                value={newJournalContent}
                onChange={(e) => setNewJournalContent(e.target.value)}
                className="w-full p-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-mono font-bold cursor-pointer"
            >
              Save Journal Entry to Firestore
            </button>
          </form>

          {/* Journal Entries List */}
          <div className="space-y-3">
            {journalEntries.map((j) => (
              <div key={j.id} className="p-4 bg-stone-50 dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2 text-xs">
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="font-bold text-indigo-600">{j.entryType} • {j.authorName}</span>
                  <span className="text-stone-400">{j.date}</span>
                </div>
                <h4 className="font-bold text-stone-900 dark:text-white">{j.title}</h4>
                <p className="text-stone-700 dark:text-stone-300 leading-relaxed">{j.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DR. T ACADEMY OFFICIAL DIPLOMA & TRANSCRIPT MODAL */}
      <AnimatePresence>
        {showDiplomaModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-stone-900 text-stone-100 rounded-3xl max-w-4xl w-full p-6 sm:p-8 border-2 border-amber-500/60 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto my-8"
            >
              {/* Header bar */}
              <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/40">
                    <GraduationCap className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-black uppercase tracking-widest text-amber-400">
                      Dr. T Institute Credential & Transcript
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black font-display text-white">
                      Dr. T Institute Verified Credentials
                    </h2>
                  </div>
                </div>
                <button
                  onClick={() => setShowDiplomaModal(false)}
                  className="p-2.5 text-stone-400 hover:text-white rounded-xl bg-stone-800 cursor-pointer font-mono font-bold text-sm"
                >
                  ✕ Close
                </button>
              </div>

              {/* DIPLOMA PREVIEW CANVAS */}
              <div className="bg-stone-50 text-stone-900 p-6 sm:p-10 rounded-2xl border-4 border-amber-600/60 shadow-inner relative space-y-6 font-serif">
                {/* Seal watermark */}
                <div className="absolute right-6 top-6 opacity-10 pointer-events-none text-amber-800">
                  <Award className="w-48 h-48" />
                </div>

                {/* Institution Header */}
                <div className="text-center space-y-2 border-b-2 border-amber-800/20 pb-4">
                  <span className="text-xs font-mono font-bold tracking-widest text-amber-800 uppercase block">
                    THE CHANCELLOR & FACULTY OF
                  </span>
                  <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-stone-900 uppercase font-display">
                    DR. T INSTITUTE
                  </h1>
                  <p className="text-xs font-mono text-stone-600">
                    School of Longevity, Healthy Aging & Geriatric Care Sciences
                  </p>
                </div>

                {/* Student Name & Conferral */}
                <div className="text-center space-y-3">
                  <p className="text-xs sm:text-sm font-sans italic text-stone-700">
                    This is to certify that upon recommendation of the Academic Faculty Board and satisfactory completion of all curriculum standards,
                  </p>
                  <div className="inline-block border-b-2 border-stone-900 pb-1 px-6">
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="text-xl sm:text-2xl font-black font-serif text-amber-900 text-center bg-transparent focus:outline-none w-full min-w-[260px]"
                      title="Click to edit your credential name"
                    />
                  </div>
                  <p className="text-[10px] font-mono text-stone-500 uppercase tracking-widest">
                    (Click name above to edit on transcript)
                  </p>
                  <p className="text-xs sm:text-sm font-sans text-stone-800 max-w-xl mx-auto leading-relaxed">
                    has successfully fulfilled all academic rigor, clinical case evaluations, and knowledge checks, hereby earning the credential of:
                  </p>
                  <h2 className="text-lg sm:text-xl font-black font-sans text-rose-900 bg-amber-200/80 px-5 py-2 rounded-xl border border-amber-400/80 inline-block">
                    {activeCertTrack?.title || "Dr. T Institute Certified Master in Healthy Aging"}
                  </h2>
                </div>

                {/* ACADEMIC TRANSCRIPT TABLE */}
                <div className="font-mono text-xs space-y-2 pt-4 border-t border-amber-800/20">
                  <h3 className="font-bold text-stone-900 uppercase text-[11px]">Academic Transcript & School Completion</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
                    {SCHOOLS_DATA.map((s) => (
                      <div key={s.id} className="p-2 bg-white rounded-lg border border-amber-200 flex items-center justify-between">
                        <span className="font-bold text-stone-800 truncate max-w-[200px]">School #{s.number}: {s.title.split(':')[1] || s.title}</span>
                        <span className="text-emerald-800 font-bold">Passed (95% - A+)</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center justify-between text-[11px] font-bold text-stone-900 pt-2 border-t border-amber-300 gap-2">
                    <span>Cumulative GPA: 3.98 / 4.00 (High Honors)</span>
                    <span>Verification ID: DRT-ACAD-2026-98421</span>
                  </div>
                </div>

                {/* Signatures & Seal */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 items-end pt-4 border-t-2 border-amber-800/20 text-center font-sans">
                  <div className="space-y-1">
                    <div className="h-8 flex items-center justify-center italic font-serif text-base text-rose-900 font-bold border-b border-stone-800">
                      Dr. T, MD, PhD
                    </div>
                    <p className="text-[10px] font-mono text-stone-600">Founder & Chancellor, Dr. T Institute</p>
                  </div>

                  <div className="hidden sm:flex flex-col items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-amber-500 text-stone-950 flex flex-col items-center justify-center border-2 border-amber-700 shadow-md">
                      <Award className="w-5 h-5" />
                      <span className="text-[7px] font-mono font-black uppercase">Dr. T Seal</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="h-8 flex items-center justify-center italic font-serif text-base text-rose-900 font-bold border-b border-stone-800">
                      Dr. Evelyn Vance, PhD
                    </div>
                    <p className="text-[10px] font-mono text-stone-600">Dean of Gerontological Sciences</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 font-mono text-xs">
                <span className="text-stone-400">Dr. T Institute Credentials • Verified Electronic Record</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => window.print()}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-black rounded-xl cursor-pointer flex items-center gap-2 shadow-md"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print / Save PDF Diploma</span>
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`https://drt-institute.org/verify/DRT-INST-2026-98421`);
                      alert("Verification Link copied to clipboard!");
                    }}
                    className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-white font-bold rounded-xl cursor-pointer flex items-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Copy Verify Link</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
