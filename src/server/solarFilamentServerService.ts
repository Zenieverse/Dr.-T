/**
 * Solar Filament Lab — Server Service
 * Kaggle Solar Filament Segmentation Challenge 2026
 * Evaluation Metric: Panoptic Quality (PQ) | 2048 x 2048 H-alpha Full Disk
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { 
  BENCHMARK_SOLAR_IMAGES, 
  BASELINE_EXPERIMENTS, 
  COMPETITION_METADATA 
} from '../components/solarfilament/solarFilamentData';
import { 
  SolarImageMetadata, 
  FilamentExperimentRecord, 
  SegmentationHyperparameters,
  PanopticQualityEvaluation,
  KaggleSubmissionRow,
  KaggleValidationResult
} from '../components/solarfilament/types';
import { 
  executeSolarSegmentation, 
  calculatePanopticQuality, 
  generateKaggleSubmissionCsv, 
  validateKaggleSubmissionCsv 
} from '../engine/solarfilament/solarSegmentationPipeline';

export interface DatasetImportPayload {
  filename: string;
  fileBase64: string;
  split: 'TRAIN' | 'VALIDATION' | 'TEST';
  originalImageId?: string;
  observatory?: string;
  instrument?: string;
  timestamp?: string;
  groundTruthFilamentCount?: number;
}

export interface KaggleSubmissionCoverage {
  datasetSource: 'LOCAL_DIRECTORY' | 'UPLOADED_TEST_SPLIT' | 'BENCHMARK_FIXTURE_ONLY';
  isFullCompetitionDatasetAvailable: boolean;
  totalTestImages: number;
  processedImages: number;
  imagesWithPredictions: number;
  imagesWithZeroPredictions: number;
  failedOrSkippedImages: number;
  totalFilamentInstances: number;
  testImageIds: string[];
  missingDatasetReason?: string;
}

export class SolarFilamentServerService {
  private static instance: SolarFilamentServerService;
  private experiments: FilamentExperimentRecord[] = [...BASELINE_EXPERIMENTS];
  private images: SolarImageMetadata[] = [...BENCHMARK_SOLAR_IMAGES];
  private uploadedBuffers: Map<string, Buffer> = new Map();
  private aiClient: GoogleGenAI | null = null;
  private kaggleUsername: string = process.env.KAGGLE_USERNAME || '';
  private kaggleKey: string = process.env.KAGGLE_KEY || '';

  private constructor() {
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
    if (apiKey) {
      try {
        this.aiClient = new GoogleGenAI({ apiKey });
      } catch (e) {
        console.warn('[SolarFilamentServerService] Warning: Failed to initialize GoogleGenAI client:', e);
      }
    }
  }

  public static getInstance(): SolarFilamentServerService {
    if (!SolarFilamentServerService.instance) {
      SolarFilamentServerService.instance = new SolarFilamentServerService();
    }
    return SolarFilamentServerService.instance;
  }

  /**
   * Returns competition overview, official rules and metadata
   */
  public getCompetitionOverview() {
    return {
      metadata: COMPETITION_METADATA,
      imageCount: this.images.length,
      trainCount: this.images.filter(i => i.split === 'TRAIN').length,
      valCount: this.images.filter(i => i.split === 'VALIDATION').length,
      testCount: this.images.filter(i => i.split === 'TEST').length,
      latestExperimentCount: this.experiments.length,
      kaggleStatus: this.getKaggleConnectionStatus()
    };
  }

  /**
   * Check Kaggle API connection and credentials status
   */
  public getKaggleConnectionStatus() {
    const isConfigured = Boolean(this.kaggleUsername && this.kaggleKey);
    return {
      isConfigured,
      username: isConfigured ? this.kaggleUsername : undefined,
      datasetSlug: 'filament-segmentation-2026',
      competitionUrl: COMPETITION_METADATA.competitionUrl,
      message: isConfigured 
        ? `Connected to Kaggle API as user @${this.kaggleUsername}. Direct dataset sync authorized.`
        : 'Kaggle API key is not currently linked. You can import files manually via the secure Dataset Explorer uploader, or configure your kaggle.json API token.',
      instructions: [
        '1. Log in to Kaggle and open Settings -> API -> Create New Token (downloads kaggle.json)',
        '2. Configure KAGGLE_USERNAME and KAGGLE_KEY or enter your credentials below',
        '3. Alternatively, upload 2048x2048 FITS, PNG, or JPEG files directly via the Dataset Explorer'
      ]
    };
  }

  /**
   * Configure Kaggle credentials for the session
   */
  public configureKaggleCredentials(username: string, key: string) {
    if (!username || !key) {
      throw new Error('Both Kaggle username and API key are required.');
    }
    this.kaggleUsername = username.trim();
    this.kaggleKey = key.trim();
    process.env.KAGGLE_USERNAME = this.kaggleUsername;
    process.env.KAGGLE_KEY = this.kaggleKey;
    return this.getKaggleConnectionStatus();
  }

  /**
   * Secure Dataset Import with validation, SHA-256 checksum, and split isolation
   */
  public importDatasetFile(payload: DatasetImportPayload): SolarImageMetadata {
    if (!payload.filename || !payload.fileBase64) {
      throw new Error('Missing filename or file payload.');
    }

    // Strip data URI prefix if present
    const commaIdx = payload.fileBase64.indexOf(',');
    const cleanBase64 = commaIdx !== -1 ? payload.fileBase64.substring(commaIdx + 1) : payload.fileBase64;
    const fileBuffer = Buffer.from(cleanBase64, 'base64');

    if (fileBuffer.length === 0) {
      throw new Error('Uploaded file is empty.');
    }

    // Compute SHA-256 integrity hash
    const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    // Extension validation
    const ext = path.extname(payload.filename).toLowerCase();
    const allowed = ['.fits', '.png', '.jpg', '.jpeg'];
    if (!allowed.includes(ext)) {
      throw new Error(`Unsupported file format '${ext}'. Supported: FITS, PNG, JPEG.`);
    }

    // Preserve authentic competition image ID cleanly without inventing imported_, _fil_, or _test prefixes
    const rawStem = path.basename(payload.filename, ext).trim();
    const resolvedOriginalId = (payload.originalImageId || rawStem).trim();
    if (!resolvedOriginalId || /\s/.test(resolvedOriginalId)) {
      throw new Error('Could not determine a valid originalImageId from filename or payload (must be non-empty without whitespace).');
    }
    if (resolvedOriginalId.includes('_fil_') || resolvedOriginalId.includes('_test')) {
      throw new Error(`Invalid originalImageId '${resolvedOriginalId}': prohibited suffix '_fil_' or '_test'.`);
    }
    const existingOtherSplit = this.images.some(
      (img) => img.id === resolvedOriginalId && img.split !== payload.split
    );
    const imageId = existingOtherSplit ? `${resolvedOriginalId}__${payload.split.toLowerCase()}` : resolvedOriginalId;

    // Anti-leakage: TEST split strictly gets zero ground truth filaments
    const isTest = payload.split === 'TEST';
    const gtCount = isTest ? 0 : (payload.groundTruthFilamentCount || 0);

    const newImage: SolarImageMetadata = {
      id: imageId,
      originalImageId: resolvedOriginalId,
      filename: payload.filename,
      observatory: payload.observatory || 'Custom Observatory / Kaggle Import',
      instrument: payload.instrument || 'Full-Disk H-alpha 656.3nm Telescope',
      wavelength: 'H_ALPHA_6563',
      timestamp: payload.timestamp || new Date().toISOString(),
      width: 2048,
      height: 2048,
      split: payload.split,
      geometry: {
        centerX: 1024,
        centerY: 1024,
        radiusPixels: 940,
        limbDarkeningCoefficient: 0.62,
      },
      groundTruthFilamentCount: gtCount,
      filaments: [], // If test, empty. If train/val, annotations can be imported separately
      previewUrl: `data:image/${ext === '.png' ? 'png' : 'jpeg'};base64,${cleanBase64}`,
      isCorrupted: false,
      fileSizeBytes: fileBuffer.length,
    };

    // Persist image bytes in memory for server-side inspection and replace existing entry if re-uploaded
    this.uploadedBuffers.set(resolvedOriginalId, fileBuffer);
    const existingIdx = this.images.findIndex(
      (img) => (img.originalImageId || img.id) === resolvedOriginalId && img.split === payload.split
    );
    if (existingIdx >= 0) {
      this.images[existingIdx] = newImage;
    } else {
      this.images.push(newImage);
    }
    return newImage;
  }

  /**
   * Retrieves all dataset images and their astrophysical metadata
   */
  public getImages(splitFilter?: 'TRAIN' | 'VALIDATION' | 'TEST'): SolarImageMetadata[] {
    if (splitFilter) {
      return this.images.filter(i => i.split === splitFilter);
    }
    return this.images;
  }

  /**
   * Retrieves single image metadata by ID
   */
  public getImageById(id: string): SolarImageMetadata | undefined {
    return this.images.find(i => i.id === id);
  }

  /**
   * Runs the segmentation pipeline on an image with specified hyperparameters
   */
  public runSegmentation(
    imageId: string, 
    params: SegmentationHyperparameters
  ) {
    const image = this.getImageById(imageId);
    if (!image) {
      throw new Error(`Solar image with ID '${imageId}' not found.`);
    }

    const startTime = Date.now();
    const result = executeSolarSegmentation(image, params);
    const durationMs = Date.now() - startTime;

    // Evaluate against ground-truth if validation or train
    let evaluation: PanopticQualityEvaluation | null = null;
    if (image.split !== 'TEST' && image.filaments.length > 0) {
      evaluation = calculatePanopticQuality(result.detectedFilaments, image.filaments);
    }

    return {
      imageId: image.id,
      imageFilename: image.filename,
      split: image.split,
      hyperparameters: params,
      detectedFilamentCount: result.detectedFilaments.length,
      detectedFilaments: result.detectedFilaments,
      intermediateArtifacts: result.intermediateArtifacts,
      evaluation,
      inferenceTimeMs: durationMs
    };
  }

  /**
   * Evaluates predictions against ground-truth masks using official Panoptic Quality (PQ)
   */
  public evaluatePredictions(
    predictedInstances: any[], 
    groundTruthInstances: any[]
  ): PanopticQualityEvaluation {
    return calculatePanopticQuality(predictedInstances, groundTruthInstances);
  }

  /**
   * Retrieves experiment history
   */
  public getExperiments(): FilamentExperimentRecord[] {
    return [...this.experiments].sort((a, b) => (b.pqScore ?? b.panopticQuality ?? 0) - (a.pqScore ?? a.panopticQuality ?? 0));
  }

  /**
   * Adds a new experiment run
   */
  public addExperiment(experiment: FilamentExperimentRecord): FilamentExperimentRecord {
    const existingIndex = this.experiments.findIndex(e => e.id === experiment.id);
    if (existingIndex >= 0) {
      this.experiments[existingIndex] = experiment;
    } else {
      this.experiments.unshift(experiment);
    }
    return experiment;
  }

  /**
   * Inspects whether a real local Kaggle competition test directory is available
   */
  public inspectLocalTestDatasetStatus(): {
    localTestDir: string | null;
    discoveredFiles: string[];
    sampleSubmissionPath: string | null;
    uploadedTestCount: number;
    fixtureTestCount: number;
  } {
    const cwd = process.cwd();
    const dirCandidates = [
      process.env.SOLAR_TEST_DIR,
      '/kaggle/input/filament-segmentation-2026/test',
      path.join(cwd, 'data', 'test'),
      path.join(cwd, 'dataset', 'test'),
    ].filter((d): d is string => Boolean(d));

    let localTestDir: string | null = null;
    let discoveredFiles: string[] = [];
    for (const dir of dirCandidates) {
      if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
        const files = fs
          .readdirSync(dir)
          .filter((f) => /\.(png|jpg|jpeg|fits|fit|tif|tiff)$/i.test(f))
          .sort();
        if (files.length > 0) {
          localTestDir = dir;
          discoveredFiles = files;
          break;
        }
      }
    }

    const sampleCandidates = [
      process.env.SOLAR_SAMPLE_SUBMISSION,
      '/kaggle/input/filament-segmentation-2026/sample_submission.csv',
      path.join(cwd, 'data', 'sample_submission.csv'),
      path.join(cwd, 'dataset', 'sample_submission.csv'),
    ].filter((p): p is string => Boolean(p));
    const sampleSubmissionPath = sampleCandidates.find((p) => fs.existsSync(p)) || null;

    const testImages = this.images.filter((i) => i.split === 'TEST');
    const uploadedTestCount = testImages.filter((i) => !i.filename.endsWith('20260101000001Bh.fits')).length;
    const fixtureTestCount = testImages.length - uploadedTestCount;

    return {
      localTestDir,
      discoveredFiles,
      sampleSubmissionPath,
      uploadedTestCount,
      fixtureTestCount,
    };
  }

  /**
   * Generates official two-column Kaggle submission CSV plus complete test-set coverage audit
   */
  public generateKaggleSubmission(selectedExperimentId?: string): {
    csvContent: string;
    rows: KaggleSubmissionRow[];
    validation: KaggleValidationResult;
    coverage: KaggleSubmissionCoverage;
  } {
    const testImages = this.images.filter((i) => i.split === 'TEST');
    const experiment = this.experiments.find((e) => e.id === selectedExperimentId) || this.experiments[0];
    const params = experiment.hyperparameters || experiment.parameters;
    const diskStatus = this.inspectLocalTestDatasetStatus();

    const submissionRows: KaggleSubmissionRow[] = [];
    const allowedImageIds: string[] = [];
    const seenFilamentIds = new Set<string>();
    let processedImages = 0;
    let imagesWithPredictions = 0;
    let imagesWithZeroPredictions = 0;
    let failedOrSkippedImages = 0;

    for (const testImg of testImages) {
      const origId = (testImg.originalImageId || testImg.id).trim();
      if (!origId) {
        failedOrSkippedImages++;
        throw new Error(`Test image '${testImg.id}' is missing a valid originalImageId.`);
      }
      if (testImg.isCorrupted) {
        failedOrSkippedImages++;
        continue;
      }

      allowedImageIds.push(origId);
      const segResult = executeSolarSegmentation(testImg, params);
      processedImages++;

      if (segResult.detectedFilaments.length === 0) {
        imagesWithZeroPredictions++;
        continue;
      }

      imagesWithPredictions++;
      segResult.detectedFilaments.forEach((fil, idx) => {
        const officialId = `${origId}_${idx + 1}`;
        if (seenFilamentIds.has(officialId)) {
          throw new Error(`Duplicate filament_id detected: '${officialId}'`);
        }
        seenFilamentIds.add(officialId);
        submissionRows.push({
          filament_id: officialId,
          segmentation_rle: fil.rle,
        });
      });
    }

    const csvContent = generateKaggleSubmissionCsv(submissionRows);
    const validation = validateKaggleSubmissionCsv(csvContent, {
      allowedImageIds,
      requireCompressedRle: true,
    });

    const hasExternalTestSet = Boolean(diskStatus.localTestDir) || diskStatus.uploadedTestCount > 0;
    const datasetSource: KaggleSubmissionCoverage['datasetSource'] = diskStatus.localTestDir
      ? 'LOCAL_DIRECTORY'
      : diskStatus.uploadedTestCount > 0
        ? 'UPLOADED_TEST_SPLIT'
        : 'BENCHMARK_FIXTURE_ONLY';

    const coverage: KaggleSubmissionCoverage = {
      datasetSource,
      isFullCompetitionDatasetAvailable: hasExternalTestSet,
      totalTestImages: testImages.length,
      processedImages,
      imagesWithPredictions,
      imagesWithZeroPredictions,
      failedOrSkippedImages,
      totalFilamentInstances: submissionRows.length,
      testImageIds: allowedImageIds,
      missingDatasetReason: hasExternalTestSet
        ? undefined
        : 'Only the 1-image benchmark fixture (20260101000001Bh) is bundled locally. No Kaggle credentials or /kaggle/input/filament-segmentation-2026/test directory are present in this environment. Upload test images via Dataset Explorer or run solar-filament-segmentation/src/pipeline.py against the full Kaggle test folder.',
    };

    return {
      csvContent,
      rows: submissionRows,
      validation,
      coverage,
    };
  }

  /**
   * Research Assistant: Gemini 2.5 Flash / 3.8 Flash for error diagnosis, hyperparameter reasoning & astrophysics physics
   */
  public async consultResearchAssistant(prompt: string, context?: {
    currentImageId?: string;
    hyperparameters?: SegmentationHyperparameters;
    latestPqEvaluation?: PanopticQualityEvaluation;
  }): Promise<{ response: string; model: string }> {
    const model = 'gemini-2.5-flash';

    if (!this.aiClient) {
      return {
        response: this.generateDeterministicResearchAdvice(prompt, context),
        model: 'solar-cv-expert-system (offline fallback)'
      };
    }

    try {
      const systemInstruction = `You are the Lead Computer Vision Scientist & Astrophysicist for the Kaggle Solar Filament Segmentation Challenge 2026.
You are embedded in Dr. T's Solar Filament Lab.
Solar filaments are dense, cool plasma suspended in the hot solar corona by magnetic flux ropes, visible as dark absorption ribbons against the bright solar chromosphere in H-alpha (656.3 nm).
Key Challenge Nuances:
1. Limb Darkening: Intensity drops near the solar limb according to I(mu) = I_0 * (1 - u*(1 - mu)), where u ~ 0.62 for H-alpha. Without theoretical correction, edge filaments are missed.
2. Fine Spine Fragmentation: Filaments frequently break into disjoint sub-segments, which lowers Segmentation Quality (SQ) and penalizes Recognition Quality (RQ) through false negatives (FN).
3. Over-merging: Active region filaments close to sunspots can erroneously merge into a single massive mask, causing 1-to-many false positives.
4. Official Metric: Panoptic Quality (PQ = SQ * RQ). Matches are strictly bijective at IoU > 0.5.
5. Submission: Kaggle requires CSV with columns "filament_id,segmentation_rle" using 1-indexed run lengths.

Provide rigorous, concise, scientific guidance. Give specific hyperparameter adjustments (e.g., adaptive threshold window, tubeness scale, watershed height) and astrophysical rationale.`;

      const contextText = context ? `
Current Context:
- Image ID: ${context.currentImageId || 'N/A'}
- Hyperparameters: ${context.hyperparameters ? JSON.stringify(context.hyperparameters, null, 2) : 'Default'}
- Latest Evaluation: ${context.latestPqEvaluation ? JSON.stringify(context.latestPqEvaluation, null, 2) : 'None'}
` : '';

      const fullPrompt = `${contextText}\nUser Research Query: ${prompt}`;

      const aiResponse = await this.aiClient.models.generateContent({
        model,
        contents: fullPrompt,
        config: {
          systemInstruction,
          temperature: 0.2,
        }
      });

      const replyText = aiResponse.text || 'Unable to generate research advice at this time.';
      return {
        response: replyText,
        model
      };
    } catch (err: any) {
      console.error('[SolarFilamentServerService] Gemini consultation failed:', err);
      return {
        response: this.generateDeterministicResearchAdvice(prompt, context) + `\n\n*(Note: Live Gemini call experienced an issue: ${err.message || 'Check API key'}). Using offline astrophysical expert model.*`,
        model: 'solar-cv-expert-system (fallback)'
      };
    }
  }

  private generateDeterministicResearchAdvice(prompt: string, context?: any): string {
    const lower = prompt.toLowerCase();
    if (lower.includes('limb') || lower.includes('darkening')) {
      return `### Limb Darkening Correction Recommendation
In H-alpha (656.3 nm), the solar limb darkening coefficient $u$ is approximately 0.62. Near the solar limb ($\mu = \cos\theta \to 0$), background photospheric/chromospheric emission drops by ~62%.
- **Action**: Enable \`limbDarkeningCorrection: true\` and set \`limbDarkeningCoeff: 0.62\`.
- **Masking**: Apply \`diskMaskRadiusRatio: 0.98\` to eliminate off-limb solar flare noise and spicule background without truncating prominences transitioning across the limb.`;
    }

    if (lower.includes('fragment') || lower.includes('split') || lower.includes('spine')) {
      return `### Spine Fragmentation Mitigation
When long quiescent filaments break into multiple small disjoint masks, the IoU drops below 0.5 against ground truth, converting a potential True Positive into 1 False Negative + several False Positives.
- **Action**: Increase morphological closing kernel from 3 to 5 px along the local spine orientation.
- **Filtering**: Apply multiscale Hessian (Frangi) filtering with $\sigma \in [1.5, 4.5]$ to bridge low-contrast spine gaps.
- **Post-processing**: Set \`minFilamentLengthArcsec: 15\` to prune disconnected noise specks.`;
    }

    if (lower.includes('metric') || lower.includes('pq') || lower.includes('panoptic')) {
      return `### Panoptic Quality (PQ) Metric Breakdown
The Kaggle 2026 competition evaluates:
$$PQ = SQ \\times RQ = \\frac{\\sum_{(p,g) \\in TP} \\text{IoU}(p,g)}{|TP|} \\times \\frac{|TP|}{|TP| + 0.5|FP| + 0.5|FN|}$$
- Matches are strictly bipartite: a predicted instance $p$ and ground truth instance $g$ are a True Positive if and only if $\\text{IoU}(p, g) > 0.5$.
- Notice that because $\\text{IoU} > 0.5$, each ground truth instance can match at most one prediction.
- High Dice alone does not guarantee high PQ if instance boundaries are merged!`;
    }

    return `### Solar Filament Segmentation Analysis
To maximize Panoptic Quality on 2048x2048 full-disk imagery:
1. **Limb Normalization**: Normalize intensity variation using theoretical solar disk profile ($u = 0.62$).
2. **Tubeness Enhancement**: Use multiscale vesselness/Frangi filters ($\sigma = 2.0, 3.5$) to isolate elongated magnetic channels.
3. **Instance Separation**: Use distance transform + marker-controlled watershed to avoid merging adjacent active filaments.
4. **Validation Check**: Ensure 1-indexed RLE without negative or out-of-bounds indices in final Kaggle submission.`;
  }
}

export const solarFilamentServerService = SolarFilamentServerService.getInstance();
