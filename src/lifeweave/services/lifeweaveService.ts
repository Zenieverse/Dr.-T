// ==========================================
// LIFEWEAVE: SERVICE LAYER & REPOSITORY ORCHESTRATION
// Decoupled Business Logic, Heuristics & Exporters
// ==========================================

import {
  RepositoryHealth,
  LivingCodeMapData,
  Investigation,
  CandidateLocation,
  EvidenceRequest,
  ValidationResult,
  PatchProposal,
  Gemma4AgentManifest
} from '../types/lifeweaveTypes';
import {
  DEFAULT_REPOSITORY_HEALTH,
  LIVING_CODE_MAP_DATA,
  PRESET_INVESTIGATIONS,
  GEMMA_4_COMPETITION_MANIFEST
} from '../data/lifeweavePresetData';

class LifeWeaveService {
  private repositoryHealth: RepositoryHealth = { ...DEFAULT_REPOSITORY_HEALTH };
  private codeMap: LivingCodeMapData = { ...LIVING_CODE_MAP_DATA };
  private investigations: Investigation[] = [...PRESET_INVESTIGATIONS];

  // 1. Repository Intelligence
  public async getRepositoryHealth(): Promise<RepositoryHealth> {
    try {
      const res = await fetch('/api/lifeweave/overview');
      if (res.ok) {
        const data = await res.json();
        if (data.repositoryHealth) return data.repositoryHealth;
      }
    } catch (e) {
      // Fallback to local state
    }
    return this.repositoryHealth;
  }

  public async getLivingCodeMap(): Promise<LivingCodeMapData> {
    try {
      const res = await fetch('/api/lifeweave/codemap');
      if (res.ok) {
        const data = await res.json();
        if (data.nodes && data.edges) return data;
      }
    } catch (e) {
      // Fallback to local state
    }
    return this.codeMap;
  }

  // 2. Investigations
  public async getInvestigations(): Promise<Investigation[]> {
    try {
      const res = await fetch('/api/lifeweave/investigations');
      if (res.ok) {
        const data = await res.json();
        if (data.investigations && data.investigations.length > 0) {
          const realIds = new Set(data.investigations.map((i: Investigation) => i.id));
          const uniquePresets = this.investigations.filter(i => !realIds.has(i.id));
          this.investigations = [...data.investigations, ...uniquePresets];
          return this.investigations;
        }
      }
    } catch {
      // fallback to local state
    }
    return this.investigations;
  }

  public async getInvestigationById(id: string): Promise<Investigation | undefined> {
    try {
      const res = await fetch(`/api/lifeweave/investigation/${id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.investigation) {
          const idx = this.investigations.findIndex(i => i.id === id);
          if (idx !== -1) this.investigations[idx] = data.investigation;
          else this.investigations.unshift(data.investigation);
          return data.investigation;
        }
      }
    } catch {
      // fallback
    }
    return this.investigations.find(inv => inv.id === id);
  }

  public async startNewInvestigation(params: {
    issueDescription: string;
    issueTitle?: string;
    issueId?: string;
    repository?: string;
    filePath?: string;
    errorMessage?: string;
    stackTrace?: string;
    failingTest?: string;
    logs?: string;
  }): Promise<Investigation> {
    try {
      const res = await fetch('/api/lifeweave/investigate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          issue: params.issueDescription,
          repository: params.repository || 'dr-t-platform (main)',
          optional_path: params.filePath,
          optional_error: params.errorMessage,
          optional_stack_trace: params.stackTrace
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.investigation) {
          this.investigations = [data.investigation, ...this.investigations];
          return data.investigation;
        }
      }
    } catch (e) {
      console.warn('Real investigation API fallback:', e);
    }

    const isSafetyCritical = /safety|clinical|dose|medication|vital|triage|harm|risk/i.test(
      `${params.issueDescription} ${params.issueTitle} ${params.filePath}`
    );

    const now = new Date().toISOString();
    const timeFormatted = now.slice(11, 16);

    const newInv: Investigation = {
      id: `lw-inv-${Date.now().toString().slice(-4)}`,
      issueTitle: params.issueTitle || params.issueDescription.slice(0, 60) + (params.issueDescription.length > 60 ? '...' : ''),
      issueDescription: params.issueDescription,
      issueIdOptional: params.issueId || `ISSUE-${Math.floor(1000 + Math.random() * 9000)}`,
      repository: params.repository || 'dr-t-platform (main)',
      filePathOptional: params.filePath,
      errorMessageOptional: params.errorMessage,
      stackTraceOptional: params.stackTrace,
      failingTestOptional: params.failingTest,
      logsOptional: params.logs,
      createdAt: now,
      updatedAt: now,
      status: isSafetyCritical ? 'HUMAN_REVIEW_REQUIRED' : 'LOCATING',
      progressPercent: isSafetyCritical ? 45 : 30,
      isSafetyCritical,
      candidates: [
        {
          id: `cand-${Date.now()}`,
          filePath: params.filePath || 'src/components/drt/DrTHome.tsx',
          symbol: 'handleEventCycle',
          nodeType: 'FILE',
          isClinicalOrSafetyCritical: isSafetyCritical,
          evidence: {
            semanticRelevance: 0.88,
            structuralRelevance: 0.76,
            dependencyRelevance: 0.81,
            testRelevance: params.failingTest ? 0.92 : null,
            behavioralRelevance: 0.70,
            issueClueRelevance: 0.89,
            contradiction: 0.14,
            uncertainty: 0.22,
            provenance: 'Keyword semantic retrieval + stack frame correlation'
          },
          supportingEvidence: [
            {
              id: `sup-${Date.now()}`,
              description: 'Issue description keywords directly match AST identifiers in this module',
              source: 'AST Semantic Parser',
              confidenceContribution: 0.40
            }
          ],
          contradictoryEvidence: [
            {
              id: `con-${Date.now()}`,
              description: 'Neighboring component handles fallback routing',
              source: 'Graph Dependency Trace',
              confidenceImpact: -0.12
            }
          ],
          confidence: 0.76,
          recommendedAction: isSafetyCritical
            ? 'SAFETY ALERT: High-impact clinical component. Human review is strictly required before proposing patches.'
            : 'Inspect callers and run unit verification tests.'
        }
      ],
      hypotheses: [
        {
          id: `hypo-${Date.now()}`,
          code: 'H1',
          title: 'Direct logical branch mismatch in target module',
          targetFile: params.filePath || 'src/components/drt/DrTHome.tsx',
          explanation: 'Condition evaluates falsely during unexpected runtime input parameters.',
          confidence: 0.74,
          uncertainty: 0.26,
          supportingSummary: ['Input trace terminates at branch junction'],
          contradictorySummary: ['Default case passes in isolated unit tests'],
          affectedNodes: ['node-pdf-fetcher'],
          missingEvidence: 'Capture execution state right before condition check.',
          nextRecommendedStep: 'Inspect file and run targeted unit tests.'
        }
      ],
      evidenceRequests: [
        {
          id: `req-${Date.now()}`,
          action: 'Inspect AST references in neighboring modules',
          targetNode: params.filePath || 'src/components/drt/DrTHome.tsx',
          rationale: 'Verify whether upstream caller passes expected schema.',
          expectedValue: 'High',
          estimatedCost: 'Low',
          priorityScore: 0.88
        }
      ],
      recoverySteps: [],
      eventsTrail: [
        {
          id: `ev-${Date.now()}-1`,
          timestamp: now,
          timeFormatted,
          title: 'Investigation started',
          details: `Issue: ${params.issueDescription.slice(0, 80)}`,
          category: 'SYSTEM'
        },
        {
          id: `ev-${Date.now()}-2`,
          timestamp: now,
          timeFormatted,
          title: isSafetyCritical ? 'Safety boundary triggered' : 'Locating candidate files',
          details: isSafetyCritical
            ? 'HIGH-IMPACT / HUMAN REVIEW REQUIRED: Touches medical/clinical safety domain.'
            : 'Indexed repository graph and identified primary candidate.',
          category: isSafetyCritical ? 'SAFETY' : 'MAP'
        }
      ]
    };

    this.investigations = [newInv, ...this.investigations];
    return newInv;
  }

  // 3. Real Repository Operations (Phases 3 & 4)
  public async getRepoFiles(): Promise<string[]> {
    try {
      const res = await fetch('/api/lifeweave/repo/files');
      if (res.ok) {
        const data = await res.json();
        if (data.files) return data.files;
      }
    } catch {
      // fallback
    }
    return [];
  }

  public async getRepoFile(filePath: string, startLine?: number, endLine?: number): Promise<{
    filePath: string;
    exists: boolean;
    content: string;
    lineCount: number;
    isClinicalOrSafetyCritical: boolean;
  }> {
    try {
      let url = `/api/lifeweave/repo/file?path=${encodeURIComponent(filePath)}`;
      if (startLine) url += `&startLine=${startLine}`;
      if (endLine) url += `&endLine=${endLine}`;
      const res = await fetch(url);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }
    return {
      filePath,
      exists: false,
      content: 'Could not fetch file content from server.',
      lineCount: 0,
      isClinicalOrSafetyCritical: false
    };
  }

  public async searchRepo(query: string): Promise<Array<{
    filePath: string;
    lineNumber: number;
    lineContent: string;
    matchIndex: number;
  }>> {
    try {
      const res = await fetch(`/api/lifeweave/repo/search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.matches) return data.matches;
      }
    } catch {
      // fallback
    }
    return [];
  }

  public async executeEvidenceRequest(action: string, targetNode: string): Promise<{
    verified: boolean;
    codeSnippet: string;
    totalFileLines: number;
    entropyReducedPercent: number;
  } | null> {
    try {
      const res = await fetch('/api/lifeweave/execute-evidence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, targetNode })
      });
      if (res.ok) {
        const data = await res.json();
        return data.evidenceGathered;
      }
    } catch {
      // fallback
    }
    return null;
  }

  // 3. Adaptive Priority Heuristic
  public calculateAdaptivePriority(
    evidenceValue: number, // 0 - 1
    informationGain: number, // 0 - 1
    structuralRelevance: number, // 0 - 1
    cost: number, // 0 - 1
    uncertainty: number, // 0 - 1
    epsilon: number = 0.05
  ): number {
    // Heuristic: (EvidenceValue * InformationGain * StructuralRelevance) / (Cost + Uncertainty + epsilon)
    const numerator = evidenceValue * informationGain * structuralRelevance;
    const denominator = cost + uncertainty + epsilon;
    return Math.min(Math.max(numerator / denominator, 0), 1);
  }

  // 4. Human Approval
  public async approvePatch(investigationId: string, notes?: string): Promise<boolean> {
    const inv = this.investigations.find(i => i.id === investigationId);
    if (!inv || !inv.patchProposal) return false;

    inv.patchProposal.humanApprovalStatus = 'APPROVED';
    inv.patchProposal.humanReviewerNotes = notes || 'Explicitly approved by attending developer.';
    inv.status = 'COMPLETED';
    inv.progressPercent = 100;
    inv.updatedAt = new Date().toISOString();

    inv.eventsTrail.push({
      id: `ev-${Date.now()}`,
      timestamp: new Date().toISOString(),
      timeFormatted: new Date().toISOString().slice(11, 16),
      title: 'Patch human approval granted',
      details: notes || 'Developer authorized integration.',
      category: 'SAFETY'
    });

    return true;
  }

  public async rejectPatch(investigationId: string, reason: string): Promise<boolean> {
    const inv = this.investigations.find(i => i.id === investigationId);
    if (!inv || !inv.patchProposal) return false;

    inv.patchProposal.humanApprovalStatus = 'REJECTED';
    inv.patchProposal.humanReviewerNotes = reason;
    inv.status = 'RECOVERY';
    inv.updatedAt = new Date().toISOString();

    inv.recoverySteps.push({
      stepNumber: inv.recoverySteps.length + 1,
      timestamp: new Date().toISOString(),
      failureClass: 'WRONG_HYPOTHESIS',
      observedFailure: `Developer rejected patch: ${reason}`,
      agentInterpretation: 'The proposed patch failed human review criteria. Re-evaluating candidate hypotheses.',
      correctiveAction: 'Gather additional contradictory evidence and re-formulate hypothesis H1.',
      hypothesisAdjustment: 'H1 confidence reduced by 0.35.'
    });

    return true;
  }

  // 5. Exporters (JSON, JSONL, CSV)
  public exportEvidenceDataset(investigation: Investigation, format: 'JSON' | 'JSONL' | 'CSV'): string {
    const cleanRecord = {
      investigation_id: investigation.id,
      issue: investigation.issueDescription,
      repository: investigation.repository,
      is_safety_critical: investigation.isSafetyCritical,
      status: investigation.status,
      candidates: investigation.candidates.map(c => ({
        file: c.filePath,
        symbol: c.symbol,
        confidence: c.confidence,
        evidence: c.evidence,
        supporting: c.supportingEvidence.map(s => s.description),
        contradictory: c.contradictoryEvidence.map(x => x.description)
      })),
      hypotheses: investigation.hypotheses.map(h => ({
        code: h.code,
        title: h.title,
        confidence: h.confidence,
        uncertainty: h.uncertainty
      })),
      patch_proposed: investigation.patchProposal ? {
        files: investigation.patchProposal.targetFiles,
        invariant: investigation.patchProposal.invariantStatement,
        risk: investigation.patchProposal.riskLevel,
        approved: investigation.patchProposal.humanApprovalStatus
      } : null,
      validation: investigation.validationResult ? {
        overall: investigation.validationResult.overallStatus,
        tests: investigation.validationResult.testSummary
      } : null,
      recovery_steps_count: investigation.recoverySteps.length,
      timestamp: investigation.updatedAt
    };

    if (format === 'JSON') {
      return JSON.stringify(cleanRecord, null, 2);
    } else if (format === 'JSONL') {
      return JSON.stringify(cleanRecord);
    } else {
      // CSV Export
      const headers = ['investigation_id', 'issue', 'is_safety_critical', 'status', 'candidate_files', 'selected_hypothesis', 'risk_level', 'validation_status'];
      const row = [
        `"${cleanRecord.investigation_id}"`,
        `"${cleanRecord.issue.replace(/"/g, '""')}"`,
        cleanRecord.is_safety_critical,
        cleanRecord.status,
        `"${cleanRecord.candidates.map(c => c.file).join('; ')}"`,
        `"${cleanRecord.hypotheses[0]?.title || ''}"`,
        cleanRecord.patch_proposed?.risk || 'NONE',
        cleanRecord.validation?.overall || 'PENDING'
      ];
      return `${headers.join(',')}\n${row.join(',')}`;
    }
  }

  // 6. Gemma 4 Agent Manifest
  public getGemma4Manifest(): Gemma4AgentManifest {
    return GEMMA_4_COMPETITION_MANIFEST;
  }
}

export const lifeweaveService = new LifeWeaveService();
