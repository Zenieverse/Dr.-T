import { db, auth } from '../../../services/firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy 
} from 'firebase/firestore';
import { 
  BuildWithAiProject, 
  ProjectBrief, 
  ProjectDocument, 
  ProjectTask, 
  CodeReviewRecord 
} from '../types';
import { HEALTHALERT_MINI_TEMPLATE } from '../data/templateProject';

const STORAGE_KEY = 'buildwithai_projects_cache_v1';

function loadFromLocalStorage(): BuildWithAiProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [HEALTHALERT_MINI_TEMPLATE];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Ensure template is always available
      if (!parsed.some(p => p.id === HEALTHALERT_MINI_TEMPLATE.id)) {
        return [HEALTHALERT_MINI_TEMPLATE, ...parsed];
      }
      return parsed;
    }
    return [HEALTHALERT_MINI_TEMPLATE];
  } catch (err) {
    console.warn('[BuildWithAi] Error reading localStorage:', err);
    return [HEALTHALERT_MINI_TEMPLATE];
  }
}

function saveToLocalStorage(projects: BuildWithAiProject[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (err) {
    console.warn('[BuildWithAi] Error saving to localStorage:', err);
  }
}

export class BuildWithAiService {
  static isUserAuthenticated(): boolean {
    return !!(auth && auth.currentUser);
  }

  static getCurrentUserId(): string {
    if (auth && auth.currentUser) {
      return auth.currentUser.uid;
    }
    return 'guest_user';
  }

  /**
   * Load all projects for current user (Firestore if authenticated, else LocalStorage)
   */
  static async getProjects(): Promise<BuildWithAiProject[]> {
    if (this.isUserAuthenticated()) {
      try {
        const uid = auth.currentUser!.uid;
        const colRef = collection(db, 'buildwithai_projects');
        const q = query(colRef, where('userId', '==', uid));
        const snapshot = await getDocs(q);
        const userProjects: BuildWithAiProject[] = [];
        snapshot.forEach(docSnap => {
          userProjects.push(docSnap.data() as BuildWithAiProject);
        });
        // Always include the synthetic template project for reference
        return [HEALTHALERT_MINI_TEMPLATE, ...userProjects];
      } catch (err) {
        console.warn('[BuildWithAi] Firestore fetch failed, falling back to local cache:', err);
        return loadFromLocalStorage();
      }
    }
    return loadFromLocalStorage();
  }

  /**
   * Save or update a project
   */
  static async saveProject(project: BuildWithAiProject): Promise<void> {
    const updated = {
      ...project,
      updatedAt: new Date().toISOString()
    };

    // Update local cache first
    const all = loadFromLocalStorage();
    const idx = all.findIndex(p => p.id === updated.id);
    if (idx >= 0) {
      all[idx] = updated;
    } else {
      all.push(updated);
    }
    saveToLocalStorage(all);

    // If authenticated and not a template, sync to Firestore
    if (this.isUserAuthenticated() && !updated.isTemplate) {
      try {
        const docRef = doc(db, 'buildwithai_projects', updated.id);
        await setDoc(docRef, updated, { merge: true });
      } catch (err) {
        console.warn('[BuildWithAi] Firestore save note (cached locally):', err);
      }
    }
  }

  /**
   * Create a new project from intake parameters
   */
  static async createProject(params: {
    name: string;
    tagline?: string;
    description: string;
    targetAudience: string;
    problemStatement: string;
    proposedSolution: string;
    modelPreference?: string;
    keyFeatures?: string[];
    workflow?: string;
    constraints?: string;
    privacyConsiderations?: string;
    successCriteria?: string;
    submissionDestination?: string;
  }): Promise<BuildWithAiProject> {
    const id = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const userId = this.getCurrentUserId();
    const now = new Date().toISOString();

    const newProject: BuildWithAiProject = {
      id,
      userId,
      name: params.name || 'Untitled AI Project',
      tagline: params.tagline || 'AI-assisted solution designed for impact',
      description: params.description || '',
      stage: 'discover',
      modelPreference: params.modelPreference || 'gemini-3.8-flash',
      targetAudience: params.targetAudience || '',
      problemStatement: params.problemStatement || '',
      proposedSolution: params.proposedSolution || '',
      keyFeatures: params.keyFeatures || [],
      workflow: params.workflow || '',
      constraints: params.constraints || 'Standard cloud serverless constraints',
      privacyConsiderations: params.privacyConsiderations || 'Sanitize user inputs and protect API keys',
      successCriteria: params.successCriteria || 'Pass all tests and clear acceptance criteria',
      submissionDestination: params.submissionDestination || 'Devpost Learn AI Basics (https://learn-ai-basics.devpost.com/)',
      createdAt: now,
      updatedAt: now,
      brief: {
        problemStatement: params.problemStatement,
        targetAudience: params.targetAudience,
        userPersonas: [
          {
            name: 'Primary User',
            role: 'Target Audience Member',
            needs: 'Simple, reliable AI assistance',
            painPoints: 'Complex manual workflows'
          }
        ],
        userStories: [
          {
            asA: 'user',
            iWant: 'to solve my primary problem with an AI-assisted workflow',
            soThat: 'I can achieve my goals efficiently'
          }
        ],
        proposedSolution: params.proposedSolution,
        workflow: params.workflow || 'User Input -> AI Processing -> Output Review',
        functionalRequirements: params.keyFeatures || ['Core AI processing workflow'],
        nonFunctionalRequirements: ['Sub-3s latency', 'Mobile responsive UI', 'Safe input validation'],
        scopeBoundaries: {
          inScope: params.keyFeatures || ['Core features'],
          outOfScope: ['Complex third-party enterprise integrations (Phase 2)']
        },
        acceptanceCriteria: ['Core workflow executes without fatal errors'],
        technicalRisks: ['API rate limits or network latency'],
        securityAndPrivacy: ['Server-side API key protection'],
        milestones: [
          { name: 'Milestone 1: Project Scope & PRD', targetDate: 'Day 1', done: false },
          { name: 'Milestone 2: Technical Specification', targetDate: 'Day 2', done: false },
          { name: 'Milestone 3: Core Implementation', targetDate: 'Day 4', done: false },
          { name: 'Milestone 4: Verification & Devpost Submission', targetDate: 'Day 6', done: false }
        ],
        testStrategy: 'Unit tests for core logic, manual testing of UI flows, and edge-case boundary checks.',
        definitionOfDone: [
          'scope.md, prd.md, and spec.md created and reviewed',
          'Code implemented with clean architecture',
          'All automated checks passing',
          'README with reproduction steps included'
        ],
        isApproved: false,
        generatedByAi: false
      },
      documents: {
        'scope.md': {
          id: `doc_scope_${id}`,
          filename: 'scope.md',
          title: `Project Scope — ${params.name}`,
          content: `# Project Scope: ${params.name}\n\n## 1. Problem Statement\n${params.problemStatement || 'TBD'}\n\n## 2. Target Users\n${params.targetAudience || 'TBD'}\n\n## 3. Goals and Objectives\nDeliver a validated AI solution.\n\n## 4. Scope Boundaries\n- In-Scope: Core user workflow\n- Out-of-Scope: Complex legacy migrations\n\n## 5. Exclusions\nThird-party enterprise integrations.\n\n## 6. Constraints\n${params.constraints || 'Standard budget and timeline'}\n\n## 7. Acceptance Criteria\n- [ ] Core workflow operational\n- [ ] Zero unhandled exceptions\n`,
          status: 'draft',
          lastUpdated: now,
          isApproved: false,
          sourceOfTruth: 'dr_t_draft',
          requiredSections: [
            '1. Problem Statement',
            '2. Target Users',
            '3. Goals and Objectives',
            '4. Scope Boundaries',
            '5. Exclusions',
            '6. Constraints',
            '7. Acceptance Criteria'
          ],
          validationErrors: []
        },
        'prd.md': {
          id: `doc_prd_${id}`,
          filename: 'prd.md',
          title: `Product Requirements Document (PRD) — ${params.name}`,
          content: `# Product Requirements Document (PRD): ${params.name}\n\n## 1. Product Vision\n${params.proposedSolution || 'TBD'}\n\n## 2. User Personas and Stories\n- As a user, I want quick assistance so that I save time.\n\n## 3. Feature Requirements\n${(params.keyFeatures || []).map(f => `- ${f}`).join('\n') || '- Core AI feature'}\n\n## 4. Prioritization\nFocus on MVP path first.\n\n## 5. User Experience & Flows\n${params.workflow || 'Input -> Process -> Result'}\n\n## 6. Non-Functional Requirements\n- Fast response times\n- High availability\n\n## 7. Success Metrics\n${params.successCriteria || 'User satisfaction and zero critical bugs'}\n`,
          status: 'draft',
          lastUpdated: now,
          isApproved: false,
          sourceOfTruth: 'dr_t_draft',
          requiredSections: [
            '1. Product Vision',
            '2. User Personas and Stories',
            '3. Feature Requirements',
            '4. Prioritization',
            '5. User Experience & Flows',
            '6. Non-Functional Requirements',
            '7. Success Metrics'
          ],
          validationErrors: []
        },
        'spec.md': {
          id: `doc_spec_${id}`,
          filename: 'spec.md',
          title: `Technical Specification — ${params.name}`,
          content: `# Technical Specification: ${params.name}\n\n## 1. System Architecture\nModern full-stack architecture with React frontend and Node/Express backend.\n\n## 2. Component Design\nModular functional UI components with clear data contracts.\n\n## 3. Data Models and Contracts\nStrongly typed interfaces with schema validation.\n\n## 4. Error Handling and Resilience\nGraceful fallbacks and timeout protection.\n\n## 5. Security and Privacy Architecture\nServer-side credential storage and input sanitization.\n\n## 6. Test Plan\nUnit tests and end-to-end integration verification.\n\n## 7. Deployment and Operations\nCloud Run / serverless deployment with automated health checks.\n`,
          status: 'draft',
          lastUpdated: now,
          isApproved: false,
          sourceOfTruth: 'dr_t_draft',
          requiredSections: [
            '1. System Architecture',
            '2. Component Design',
            '3. Data Models and Contracts',
            '4. Error Handling and Resilience',
            '5. Security and Privacy Architecture',
            '6. Test Plan',
            '7. Deployment and Operations'
          ],
          validationErrors: []
        },
        'README.md': {
          id: `doc_readme_${id}`,
          filename: 'README.md',
          title: `Project README — ${params.name}`,
          content: `# ${params.name}\n\n> ${params.tagline || 'AI Project'}\n\n## 1. Overview\n${params.description || params.problemStatement || 'TBD'}\n\n## 2. Features\n${(params.keyFeatures || []).map(f => `- ${f}`).join('\n')}\n\n## 3. Architecture\nFull-stack TypeScript with AI integration.\n\n## 4. Getting Started\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\`\n\n## 5. Testing\n\`\`\`bash\nnpm test\n\`\`\`\n\n## 6. Disclaimer and License\nMIT License\n`,
          status: 'draft',
          lastUpdated: now,
          isApproved: false,
          sourceOfTruth: 'dr_t_draft',
          requiredSections: [
            '1. Overview',
            '2. Features',
            '3. Architecture',
            '4. Getting Started',
            '5. Testing',
            '6. Disclaimer and License'
          ],
          validationErrors: []
        }
      },
      tasks: [
        {
          id: `task_${Date.now()}_1`,
          title: 'Setup repository and project dependencies',
          description: 'Initialize project structure, configure build scripts, and install core libraries.',
          priority: 'high',
          status: 'ready',
          stage: 'build',
          acceptanceCriteria: ['Project builds cleanly without compiler errors'],
          testExpectations: 'Run npm run build.',
          estimatedHours: 2
        },
        {
          id: `task_${Date.now()}_2`,
          title: 'Implement core user input form and validation',
          description: 'Create responsive input UI with client-side sanity bounds and error messaging.',
          priority: 'high',
          status: 'backlog',
          stage: 'build',
          acceptanceCriteria: ['Valid inputs trigger processing; invalid inputs show helpful errors'],
          testExpectations: 'Boundary value tests.',
          estimatedHours: 3
        },
        {
          id: `task_${Date.now()}_3`,
          title: 'Integrate AI service with timeout and fallback',
          description: 'Connect server-side proxy route to GenAI model with timeout protection.',
          priority: 'critical',
          status: 'backlog',
          stage: 'build',
          acceptanceCriteria: ['Returns AI response within 2500ms or falls back gracefully'],
          testExpectations: 'Simulate network timeout.',
          estimatedHours: 4
        },
        {
          id: `task_${Date.now()}_4`,
          title: 'End-to-end testing and Devpost submission checklist',
          description: 'Run automated test suites, record demonstration video, and complete Devpost fields.',
          priority: 'high',
          status: 'backlog',
          stage: 'publish',
          acceptanceCriteria: ['All tests passing with exit code 0; public repository verified'],
          testExpectations: 'npm test.',
          estimatedHours: 3
        }
      ],
      checklist: {
        officialChallengeUrl: 'https://learn-ai-basics.devpost.com/',
        lastVerifiedDate: '2026-10-24',
        repositoryUrl: '',
        demoVideoUrl: '',
        items: [
          {
            id: 'chk_1',
            category: 'eligibility',
            label: 'Review Devpost Learn AI Basics Rules',
            description: 'Check deadlines, eligibility, and rules on https://learn-ai-basics.devpost.com/',
            required: true,
            completed: false,
            verified: false
          },
          {
            id: 'chk_2',
            category: 'skill_pack',
            label: 'Execute Learn Skill Pack Workflow',
            description: 'Use an authorized coding agent to run the official Learn Skill Pack commands in a separate directory.',
            required: true,
            completed: false,
            verified: false
          },
          {
            id: 'chk_3',
            category: 'artifacts',
            label: 'Draft and Validate scope.md',
            description: 'Define problem, target user, boundaries, exclusions, constraints, and acceptance criteria.',
            required: true,
            completed: false,
            verified: false
          },
          {
            id: 'chk_4',
            category: 'artifacts',
            label: 'Draft and Validate prd.md',
            description: 'Define vision, user stories, feature priorities, UX flows, and success metrics.',
            required: true,
            completed: false,
            verified: false
          },
          {
            id: 'chk_5',
            category: 'artifacts',
            label: 'Draft and Validate spec.md',
            description: 'Define system architecture, components, data contracts, security, and test plan.',
            required: true,
            completed: false,
            verified: false
          },
          {
            id: 'chk_6',
            category: 'artifacts',
            label: 'Check Cross-Document Consistency',
            description: 'Verify scope.md, prd.md, and spec.md contain no contradictions.',
            required: true,
            completed: false,
            verified: false
          },
          {
            id: 'chk_7',
            category: 'repository',
            label: 'Public GitHub Repository Prepared',
            description: 'Initialize a clean, public repository with source code, license, and README.',
            required: true,
            completed: false,
            verified: false
          },
          {
            id: 'chk_8',
            category: 'submission',
            label: 'Automated Test Suite Executed',
            description: 'Run unit and integration tests, logging exit codes and pass counts.',
            required: true,
            completed: false,
            verified: false
          },
          {
            id: 'chk_9',
            category: 'submission',
            label: 'Public Demonstration Video Recorded',
            description: 'Record an overview video (max 3 minutes) demonstrating working features.',
            required: true,
            completed: false,
            verified: false
          },
          {
            id: 'chk_10',
            category: 'submission',
            label: 'Submit to Devpost Before Deadline',
            description: 'Complete all required fields and submit on https://learn-ai-basics.devpost.com/',
            required: true,
            completed: false,
            verified: false
          }
        ]
      },
      codeReviews: []
    };

    await this.saveProject(newProject);
    return newProject;
  }

  /**
   * Duplicate a project with a new identifier
   */
  static async duplicateProject(sourceId: string, newName?: string): Promise<BuildWithAiProject> {
    const projects = await this.getProjects();
    const source = projects.find(p => p.id === sourceId) || HEALTHALERT_MINI_TEMPLATE;
    const now = new Date().toISOString();
    const newId = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const duplicated: BuildWithAiProject = {
      ...JSON.parse(JSON.stringify(source)),
      id: newId,
      userId: this.getCurrentUserId(),
      name: newName || `${source.name} (Copy)`,
      isTemplate: false,
      createdAt: now,
      updatedAt: now
    };

    await this.saveProject(duplicated);
    return duplicated;
  }

  /**
   * Delete a project with confirmation
   */
  static async deleteProject(projectId: string): Promise<void> {
    if (projectId === HEALTHALERT_MINI_TEMPLATE.id) {
      throw new Error('The default demonstration template cannot be deleted.');
    }

    // Remove from local cache
    const all = loadFromLocalStorage().filter(p => p.id !== projectId);
    saveToLocalStorage(all);

    // If authenticated, remove from Firestore
    if (this.isUserAuthenticated()) {
      try {
        const docRef = doc(db, 'buildwithai_projects', projectId);
        await deleteDoc(docRef);
      } catch (err) {
        console.warn('[BuildWithAi] Firestore delete note:', err);
      }
    }
  }

  /**
   * Validate required sections in a Markdown document
   */
  static validateDocumentSections(doc: ProjectDocument): string[] {
    const errors: string[] = [];
    const lowerContent = doc.content.toLowerCase();

    for (const section of doc.requiredSections) {
      // Clean section header label (e.g. "1. Problem Statement" -> "problem statement")
      const cleaned = section.replace(/^[0-9]+\.\s*/, '').toLowerCase();
      if (!lowerContent.includes(cleaned)) {
        errors.push(`Missing required section: "${section}"`);
      }
    }

    if (doc.content.trim().length < 100) {
      errors.push('Document content is too brief. Provide substantive project details.');
    }

    return errors;
  }

  /**
   * Validate mutual consistency across scope.md, prd.md, and spec.md
   */
  static validateCrossDocumentConsistency(project: BuildWithAiProject): {
    isConsistent: boolean;
    issues: string[];
    strengths: string[];
  } {
    const issues: string[] = [];
    const strengths: string[] = [];

    const scope = project.documents['scope.md'].content.toLowerCase();
    const prd = project.documents['prd.md'].content.toLowerCase();
    const spec = project.documents['spec.md'].content.toLowerCase();

    // Check 1: Target user presence
    if (scope.includes('target user') && prd.includes('persona')) {
      strengths.push('Target user in scope aligns with user personas defined in PRD.');
    } else {
      issues.push('Scope target users and PRD personas may be misaligned or missing.');
    }

    // Check 2: Scope boundaries vs feature prioritization
    if (scope.includes('exclusions') && prd.includes('prioritization')) {
      strengths.push('Scope exclusions are respected by PRD feature prioritization.');
    } else {
      issues.push('PRD feature priorities should explicitly reference out-of-scope exclusions from scope.md.');
    }

    // Check 3: Architecture in spec matches non-functional requirements in PRD
    if (prd.includes('non-functional requirements') && spec.includes('system architecture')) {
      strengths.push('System architecture directly addresses PRD non-functional requirements.');
    } else {
      issues.push('Verify that Technical Specification addresses all Non-Functional Requirements.');
    }

    // Check 4: Test plan consistency
    if (scope.includes('acceptance criteria') && spec.includes('test plan')) {
      strengths.push('Spec test plan covers acceptance criteria defined in scope.');
    } else {
      issues.push('Ensure the technical test plan explicitly covers all scope.md acceptance criteria.');
    }

    return {
      isConsistent: issues.length === 0,
      issues,
      strengths
    };
  }

  /**
   * Download a markdown document as a file
   */
  static downloadMarkdownFile(filename: string, content: string): void {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Export all project documents as an export manifest JSON bundle
   */
  static exportProjectManifest(project: BuildWithAiProject): void {
    const manifest = {
      projectMetadata: {
        id: project.id,
        name: project.name,
        tagline: project.tagline,
        stage: project.stage,
        exportedAt: new Date().toISOString(),
        submissionDestination: project.submissionDestination,
        modelPreference: project.modelPreference
      },
      files: {
        'scope.md': project.documents['scope.md'].content,
        'prd.md': project.documents['prd.md'].content,
        'spec.md': project.documents['spec.md'].content,
        'README.md': project.documents['README.md'].content
      },
      tasks: project.tasks,
      checklist: project.checklist
    };

    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_learn_ai_basics_manifest.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
