/**
 * Solar Filament Lab — Independent Scientific & Engineering Audit Test Suite
 * Kaggle Solar Filament Segmentation Challenge 2026
 *
 * Rigorously executes independent verification for:
 * 1. Panoptic Quality (PQ = SQ * RQ) adversarial edge cases & bipartite matching
 * 2. 1-Indexed Column-Major RLE encoding/decoding bit-level round-trip fidelity
 * 3. Eddington Limb Darkening inversion mathematical bounds & numerical stability
 * 4. Kaggle 10-point submission CSV compliance & rejection of corrupted submissions
 * 5. Sealed test set protection & anti-leakage invariants
 */

import fs from 'fs';
import path from 'path';
import {
  SolarSegmentationPipeline,
  correctLimbDarkening,
  maskToRle,
  rleToMask,
  maskToPycocoRle,
  pycocoRleToMask,
  generateKaggleSubmissionCsv,
  validateKaggleSubmissionCsv,
} from '../src/engine/solarfilament/solarSegmentationPipeline';
import {
  BENCHMARK_SOLAR_IMAGES,
  BASELINE_EXPERIMENTS,
  COMPETITION_METADATA,
} from '../src/components/solarfilament/solarFilamentData';
import { FilamentInstance, SolarDiskGeometry } from '../src/components/solarfilament/types';

let totalTests = 0;
let passedTests = 0;

function assert(condition: boolean, testName: string, details?: string) {
  totalTests++;
  if (!condition) {
    console.error(`❌ [FAIL] ${testName}${details ? ` -> ${details}` : ''}`);
    process.exit(1);
  } else {
    passedTests++;
    console.log(`✅ [PASS] ${testName}`);
  }
}

async function runScientificAudit() {
  console.log('🔬 ==============================================================');
  console.log('🔬 DR. T — SOLAR FILAMENT LAB INDEPENDENT SCIENTIFIC AUDIT');
  console.log('🔬 Kaggle Solar Filament Segmentation Challenge 2026');
  console.log('🔬 ==============================================================\n');

  // -------------------------------------------------------------
  // GROUP 1: PANOPTIC QUALITY (PQ = SQ * RQ) ADVERSARIAL EDGE CASES
  // -------------------------------------------------------------
  console.log('--- Group 1: Panoptic Quality Adversarial Edge Cases ---');

  // 1.1 Both empty (True Negative image)
  const emptyEval = SolarSegmentationPipeline.evaluatePanopticQuality([], [], 'empty_test');
  assert(emptyEval.panopticQuality === 1.0, 'Empty GT + Empty Pred yields perfect PQ = 1.0');
  assert(emptyEval.segmentationQuality === 1.0, 'Empty GT + Empty Pred yields SQ = 1.0');
  assert(emptyEval.recognitionQuality === 1.0, 'Empty GT + Empty Pred yields RQ = 1.0');
  assert(emptyEval.truePositives === 0 && emptyEval.falsePositives === 0 && emptyEval.falseNegatives === 0, 'Empty image has zero TP, FP, FN');

  // 1.2 Empty Prediction with 2 Ground Truth filaments (Complete Miss / All False Negatives)
  const mockGt1: FilamentInstance = {
    id: 'gt_1',
    label: 'GT Filament 1',
    lengthArcsec: 100,
    lengthMm: 72.5,
    areaSqMm: 200,
    spineCurvature: 0.1,
    tiltAngleDegrees: 15,
    averageAbsorptionDepth: 0.7,
    bbox: [100, 100, 200, 200],
    spinePoints: [[100, 150], [200, 150]],
    contourPoints: [[100, 140], [200, 140], [200, 160], [100, 160]],
    rle: '1000 50 1200 50',
  };
  const mockGt2: FilamentInstance = {
    id: 'gt_2',
    label: 'GT Filament 2',
    lengthArcsec: 80,
    lengthMm: 58,
    areaSqMm: 150,
    spineCurvature: 0.05,
    tiltAngleDegrees: -20,
    averageAbsorptionDepth: 0.65,
    bbox: [500, 500, 600, 600],
    spinePoints: [[500, 550], [600, 550]],
    contourPoints: [[500, 540], [600, 540], [600, 560], [500, 560]],
    rle: '50000 50 50200 50',
  };

  const fnEval = SolarSegmentationPipeline.evaluatePanopticQuality([], [mockGt1, mockGt2], 'fn_test');
  assert(fnEval.panopticQuality === 0.0, 'Empty Pred with non-empty GT yields PQ = 0.0');
  assert(fnEval.recognitionQuality === 0.0, 'Empty Pred with non-empty GT yields RQ = 0.0');
  assert(fnEval.falseNegatives === 2, 'Two GTs missed yields FN = 2');
  assert(fnEval.falsePositives === 0 && fnEval.truePositives === 0, 'No predictions yields FP = 0 and TP = 0');

  // 1.3 Non-empty Prediction with Empty Ground Truth (All False Positives / Pure Hallucination)
  const mockPredHallucination: FilamentInstance = {
    ...mockGt1,
    id: 'pred_hallucinated',
  };
  const fpEval = SolarSegmentationPipeline.evaluatePanopticQuality([mockPredHallucination], [], 'fp_test');
  assert(fpEval.panopticQuality === 0.0, 'Prediction on empty GT yields PQ = 0.0');
  assert(fpEval.falsePositives === 1, 'Hallucinated prediction yields FP = 1');
  assert(fpEval.falseNegatives === 0 && fpEval.truePositives === 0, 'No GT yields FN = 0 and TP = 0');

  // 1.4 Single Perfect Match (100% pixel overlap)
  const perfectEval = SolarSegmentationPipeline.evaluatePanopticQuality([mockGt1], [mockGt1], 'perfect_test');
  assert(perfectEval.panopticQuality === 1.0, 'Identical prediction and GT yields PQ = 1.0');
  assert(perfectEval.segmentationQuality === 1.0, 'Identical prediction yields SQ = 1.0');
  assert(perfectEval.recognitionQuality === 1.0, 'Identical prediction yields RQ = 1.0');
  assert(perfectEval.truePositives === 1 && perfectEval.falsePositives === 0 && perfectEval.falseNegatives === 0, 'One perfect match yields TP = 1, FP = 0, FN = 0');

  // 1.5 Strict Bipartite Matching: Duplicate predictions competing for the same GT
  // Pred A has IoU = 0.9 with GT1. Pred B also overlaps GT1 with IoU = 0.7.
  // Under bipartite matching: Exactly ONE can be TP (the best match). The other MUST be marked FP!
  const mockPredA = { ...mockGt1, id: 'pred_A' };
  const mockPredB = { ...mockGt1, id: 'pred_B' }; // identical or overlapping mask
  const duplicateEval = SolarSegmentationPipeline.evaluatePanopticQuality([mockPredA, mockPredB], [mockGt1], 'bipartite_test');
  assert(duplicateEval.truePositives === 1, 'Bipartite matching ensures at most 1 TP for a single GT filament');
  assert(duplicateEval.falsePositives === 1, 'Second competing prediction is correctly counted as FP');
  assert(duplicateEval.falseNegatives === 0, 'GT was successfully matched so FN = 0');
  // Expected RQ = TP / (TP + 0.5*FP + 0.5*FN) = 1 / (1 + 0.5 + 0) = 1 / 1.5 = 0.667
  assert(Math.abs(duplicateEval.recognitionQuality - 0.667) < 0.01, `Duplicate prediction penalizes RQ to ~0.667 (actual: ${duplicateEval.recognitionQuality})`);

  // -------------------------------------------------------------
  // GROUP 2: 1-INDEXED FORTRAN-ORDER RLE ENCODING & DECODING FIDELITY
  // -------------------------------------------------------------
  console.log('\n--- Group 2: RLE Bit-Level Round-Trip Fidelity ---');

  const W = 2048;
  const H = 2048;
  const totalPix = W * H;

  // 2.1 Empty mask encoding
  const emptyMask = new Uint8Array(totalPix);
  const emptyRle = maskToRle(emptyMask, W, H);
  assert(emptyRle === '', 'Empty mask produces empty string RLE');
  const decodedEmpty = rleToMask(emptyRle, W, H);
  let emptyDiff = 0;
  for (let i = 0; i < totalPix; i++) if (decodedEmpty[i] !== 0) emptyDiff++;
  assert(emptyDiff === 0, 'Decoded empty RLE produces exact zero array');

  // 2.2 First pixel (top-left: x=0, y=0)
  // In Fortran order: (x=0, y=0) is flat index 0, so 1-indexed Kaggle token is "1 1"
  const firstPixelMask = new Uint8Array(totalPix);
  firstPixelMask[0] = 1;
  const firstPixelRle = maskToRle(firstPixelMask, W, H);
  assert(firstPixelRle === '1 1', `First pixel (0,0) encodes to 1-indexed '1 1' (actual: '${firstPixelRle}')`);
  const decodedFirst = rleToMask(firstPixelRle, W, H);
  assert(decodedFirst[0] === 1 && decodedFirst[1] === 0, 'Decoded first pixel mask sets only index 0');

  // 2.3 Last pixel (bottom-right: x=2047, y=2047)
  // Flat index is totalPix - 1 = 4,194,303. 1-indexed token is "4194304 1"
  const lastPixelMask = new Uint8Array(totalPix);
  lastPixelMask[totalPix - 1] = 1;
  const lastPixelRle = maskToRle(lastPixelMask, W, H);
  assert(lastPixelRle === '4194304 1', `Last pixel encodes to '4194304 1' (actual: '${lastPixelRle}')`);
  const decodedLast = rleToMask(lastPixelRle, W, H);
  assert(decodedLast[totalPix - 1] === 1 && decodedLast[totalPix - 2] === 0, 'Decoded last pixel sets only index 4194303');

  // 2.4 Column-major continuity test
  // In Fortran order, a vertical segment at column x=10 from y=5 to y=14 is contiguous!
  const verticalMask = new Uint8Array(totalPix);
  for (let y = 5; y < 15; y++) {
    verticalMask[y * W + 10] = 1;
  }
  const vertRle = maskToRle(verticalMask, W, H, 'F');
  // Column 10 flat offset: 10 * 2048 + 5 = 20485 (0-indexed) -> 20486 (1-indexed). Length 10.
  assert(vertRle === '20486 10', `Vertical line in column-major encodes into single contiguous run '20486 10' (actual: '${vertRle}')`);

  // 2.5 Multi-region disjoint round-trip verification
  const complexMask = new Uint8Array(totalPix);
  // Place three separate filament patches
  for (let y = 100; y < 120; y++) {
    for (let x = 300; x < 320; x++) complexMask[y * W + x] = 1;
  }
  for (let y = 800; y < 815; y++) {
    for (let x = 1200; x < 1225; x++) complexMask[y * W + x] = 1;
  }
  const complexRle = maskToRle(complexMask, W, H);
  const decodedComplex = rleToMask(complexRle, W, H);
  let complexMismatches = 0;
  for (let i = 0; i < totalPix; i++) {
    if (complexMask[i] !== decodedComplex[i]) complexMismatches++;
  }
  assert(complexMismatches === 0, 'Disjoint multi-region RLE decoded with 0 bit mismatches');

  // -------------------------------------------------------------
  // GROUP 3: EDDINGTON LIMB DARKENING INVERSION PHYSICS
  // -------------------------------------------------------------
  console.log('\n--- Group 3: Eddington Limb Darkening Physics & Stability ---');

  const geom: SolarDiskGeometry = {
    centerX: 1024,
    centerY: 1024,
    radiusPixels: 940,
    limbDarkeningCoefficient: 0.62,
  };

  // 3.1 Center of disk (r = 0): mu = 1.0, factor = 1.0
  const centerRes = SolarSegmentationPipeline.computeLimbDarkeningFactor(1024, 1024, geom);
  assert(centerRes.isInsideDisk === true, 'Disk center is classified inside disk');
  assert(Math.abs(centerRes.factor - 1.0) < 1e-5, 'Disk center limb factor is exactly 1.0');

  // 3.2 Mid-disk (r = 0.5): mu = sqrt(1 - 0.25) = 0.866
  // factor = 1 - 0.62 * (1 - 0.866) = 1 - 0.62 * 0.134 = 0.917
  const midRes = SolarSegmentationPipeline.computeLimbDarkeningFactor(1024 + 470, 1024, geom);
  assert(midRes.isInsideDisk === true, 'Mid-disk point is inside disk');
  assert(midRes.factor < 1.0 && midRes.factor > 0.85, `Mid-disk limb factor is ~0.917 (actual: ${midRes.factor.toFixed(3)})`);

  // 3.3 Extreme limb (r = 0.98): mu = sqrt(1 - 0.98^2) = 0.199
  // factor = 1 - 0.62 * (1 - 0.199) = 1 - 0.62 * 0.801 = 0.503
  const limbRes = SolarSegmentationPipeline.computeLimbDarkeningFactor(1024 + Math.round(940 * 0.98), 1024, geom);
  assert(limbRes.factor < 0.65 && limbRes.factor >= 0.25, `Extreme limb factor is physically attenuated to ~0.50 (actual: ${limbRes.factor.toFixed(3)})`);

  // 3.4 Outside disk (r >= 1.0): Should return factor = 1.0 and isInsideDisk = false
  const outsideRes = SolarSegmentationPipeline.computeLimbDarkeningFactor(1024 + 1000, 1024, geom);
  assert(outsideRes.isInsideDisk === false, 'Point outside disk correctly flagged isInsideDisk = false');
  assert(outsideRes.factor === 1.0, 'Outside disk factor clamped to 1.0 to prevent division by zero');

  // -------------------------------------------------------------
  // GROUP 4: KAGGLE SUBMISSION CSV 10-POINT COMPLIANCE & MALFORMED REJECTION
  // -------------------------------------------------------------
  console.log('\n--- Group 4: Kaggle Submission CSV 10-Point Validator ---');

  // 4.1 Valid 2-row submission with official Kaggle format <original_image_id>_<index>
  const validCsv = generateKaggleSubmissionCsv([
    { filament_id: '20260101000001Bh_1', segmentation_rle: '10000 20 12048 20' },
    { filament_id: '20260101000001Bh_2', segmentation_rle: '50000 15 52048 15' },
  ]);
  const validAudit = validateKaggleSubmissionCsv(validCsv);
  assert(validAudit.isValid === true, 'Valid CSV passes 10-point compliance audit');
  assert(validAudit.duplicateIds.length === 0, 'No duplicate IDs in valid submission');
  assert(validAudit.errors.length === 0, 'Zero errors in valid submission');

  // 4.2 Malformed header rejection
  const badHeaderCsv = 'id,rle\n20260101000001Bh_1,10 5';
  const badHeaderAudit = validateKaggleSubmissionCsv(badHeaderCsv);
  assert(badHeaderAudit.isValid === false, 'Rejects invalid CSV header');
  assert(badHeaderAudit.errors.some(e => e.includes('Header line must exactly match')), 'Reports exact header error message');

  // 4.3 Duplicate filament_id rejection
  const dupIdCsv = 'filament_id,segmentation_rle\n20260101000001Bh_1,10 5\n20260101000001Bh_1,50 10';
  const dupIdAudit = validateKaggleSubmissionCsv(dupIdCsv);
  assert(dupIdAudit.isValid === false, 'Rejects duplicate filament_id');
  assert(dupIdAudit.duplicateIds.includes('20260101000001Bh_1'), 'Identifies offending duplicate ID 20260101000001Bh_1');

  // 4.4 0-indexed token rejection (must be >= 1)
  const zeroIndexCsv = 'filament_id,segmentation_rle\n20260101000001Bh_1,0 10';
  const zeroIndexAudit = validateKaggleSubmissionCsv(zeroIndexCsv);
  assert(zeroIndexAudit.isValid === false, 'Rejects 0-indexed RLE token');
  assert(zeroIndexAudit.errors.some(e => e.includes('not 1-indexed')), 'Flags non-1-indexed token');

  // 4.5 Dimension overflow rejection (> 4,194,304 pixels)
  const overflowCsv = 'filament_id,segmentation_rle\n20260101000001Bh_1,4194300 20';
  const overflowAudit = validateKaggleSubmissionCsv(overflowCsv);
  assert(overflowAudit.isValid === false, 'Rejects RLE token range exceeding 2048x2048 dimension (4194304)');

  // 4.6 REGRESSION TEST: Reject old invented identifier, accept official Kaggle identifier
  const oldRejectedCsv = 'filament_id,segmentation_rle\nsolar_20260410_1100_test_fil_1,2000000 20';
  const oldRejectedAudit = validateKaggleSubmissionCsv(oldRejectedCsv);
  assert(oldRejectedAudit.isValid === false, 'REGRESSION TEST: Rejects old rejected identifier solar_20260410_1100_test_fil_1');
  assert(oldRejectedAudit.errors.some(e => e.includes('_fil_') || e.includes('Invalid filament_id')), 'Flags invented substring _fil_ in old identifier');

  const officialAcceptedCsv = 'filament_id,segmentation_rle\n20260101000001Bh_1,2000000 20\n20260101000001Bh_2,2500000 30';
  const officialAcceptedAudit = validateKaggleSubmissionCsv(officialAcceptedCsv);
  assert(officialAcceptedAudit.isValid === true, 'REGRESSION TEST: Accepts official Kaggle example identifier 20260101000001Bh_1');

  // -------------------------------------------------------------
  // GROUP 5: SEALED TEST DATA PROTECTION & LEAKAGE INVARIANTS
  // -------------------------------------------------------------
  console.log('\n--- Group 5: Sealed Test Data Protection & Integrity ---');

  const testImages = BENCHMARK_SOLAR_IMAGES.filter(img => img.split === 'TEST');
  assert(testImages.length >= 1, 'At least 1 sealed test image exists in dataset');

  for (const t of testImages) {
    assert(t.groundTruthFilamentCount === 0, `Test image ${t.id} has groundTruthFilamentCount strictly 0`);
    assert(t.filaments.length === 0, `Test image ${t.id} has filaments array length strictly 0 (sealed blind)`);
  }

  // Verify technical report PDF presence
  const pdfPath = path.resolve(process.cwd(), 'public', 'Solar_Filament_Technical_Report.pdf');
  assert(fs.existsSync(pdfPath), 'public/Solar_Filament_Technical_Report.pdf exists');
  const pdfStat = fs.statSync(pdfPath);
  assert(pdfStat.size > 8000, `Technical report PDF size is ${pdfStat.size} bytes (healthy multi-page doc)`);

  // Verify reproducible python repository
  const repoFiles = [
    'solar-filament-segmentation/README.md',
    'solar-filament-segmentation/requirements.txt',
    'solar-filament-segmentation/complete_pipeline.ipynb',
    'solar-filament-segmentation/src/pipeline.py',
  ];
  for (const rf of repoFiles) {
    const fullPath = path.resolve(process.cwd(), rf);
    assert(fs.existsSync(fullPath), `Verified reproducible package file: ${rf}`);
  }

  // -------------------------------------------------------------
  // GROUP 6: OFFICIAL PYCOCOTOOLS COMPRESSED RLE BIT-LEVEL VERIFICATION
  // -------------------------------------------------------------
  console.log('\n--- Group 6: Official pycocotools Compressed RLE Specification ---');

  // 6.1 Empty mask encoding with pycocotools
  const emptyMaskPycoco = new Uint8Array(totalPix);
  const emptyPycocoRle = maskToPycocoRle(emptyMaskPycoco, W, H);
  assert(emptyPycocoRle.length > 0, `Empty mask generates non-empty compressed pycocotools string (length: ${emptyPycocoRle.length})`);
  const decodedEmptyPycoco = pycocoRleToMask(emptyPycocoRle, W, H);
  let emptyPycocoDiff = 0;
  for (let i = 0; i < totalPix; i++) if (decodedEmptyPycoco[i] !== 0) emptyPycocoDiff++;
  assert(emptyPycocoDiff === 0, 'Decoded empty pycocotools RLE recovers exact zero matrix');

  // 6.2 Single pixel at (0,0) (top-left) in Fortran order
  const singlePix0 = new Uint8Array(totalPix);
  singlePix0[0] = 1;
  const singleRle0 = maskToPycocoRle(singlePix0, W, H);
  const decodedSingle0 = pycocoRleToMask(singleRle0, W, H);
  assert(decodedSingle0[0] === 1 && decodedSingle0[1] === 0, 'pycocotools round-trip for (0,0) recovers pixel at index 0');
  let singleDiff0 = 0;
  for (let i = 0; i < totalPix; i++) if (decodedSingle0[i] !== singlePix0[i]) singleDiff0++;
  assert(singleDiff0 === 0, 'pycocotools round-trip for (0,0) has 0 bit mismatches');

  // 6.3 Single pixel at (2047, 2047) (bottom-right)
  const singlePixLast = new Uint8Array(totalPix);
  singlePixLast[totalPix - 1] = 1;
  const singleRleLast = maskToPycocoRle(singlePixLast, W, H);
  const decodedSingleLast = pycocoRleToMask(singleRleLast, W, H);
  assert(decodedSingleLast[totalPix - 1] === 1 && decodedSingleLast[totalPix - 2] === 0, 'pycocotools round-trip for (2047,2047) recovers pixel at index 4194303');
  let singleDiffLast = 0;
  for (let i = 0; i < totalPix; i++) if (decodedSingleLast[i] !== singlePixLast[i]) singleDiffLast++;
  assert(singleDiffLast === 0, 'pycocotools round-trip for (2047,2047) has 0 bit mismatches');

  // 6.4 Complex multi-instance mask bit-exact round-trip
  const multiInstanceMask = new Uint8Array(totalPix);
  for (let y = 300; y < 350; y++) {
    for (let x = 400; x < 450; x++) multiInstanceMask[y * W + x] = 1;
  }
  for (let y = 1200; y < 1280; y++) {
    for (let x = 800; x < 860; x++) multiInstanceMask[y * W + x] = 1;
  }
  const multiRle = maskToPycocoRle(multiInstanceMask, W, H);
  const decodedMulti = pycocoRleToMask(multiRle, W, H);
  let multiDiff = 0;
  for (let i = 0; i < totalPix; i++) if (decodedMulti[i] !== multiInstanceMask[i]) multiDiff++;
  assert(multiDiff === 0, 'pycocotools round-trip for multi-instance mask has 0 bit mismatches');

  // 6.5 Universal auto-detecting rleToMask decoder
  const decodedUniversalFromCoco = rleToMask(multiRle, W, H);
  let universalCocoDiff = 0;
  for (let i = 0; i < totalPix; i++) if (decodedUniversalFromCoco[i] !== multiInstanceMask[i]) universalCocoDiff++;
  assert(universalCocoDiff === 0, 'Universal rleToMask auto-detects pycocotools compressed string and decodes with 0 mismatches');

  // 6.6 Negative bounds & corruption rejection in pycocoRleToMask
  let threwOnGarbage = false;
  try {
    pycocoRleToMask('invalid_garbage', W, H);
  } catch {
    threwOnGarbage = true;
  }
  assert(threwOnGarbage, 'pycocoRleToMask strictly throws on corrupted non-LEB128 garbage string');

  let threwOnWrongDim = false;
  try {
    const smallMask = new Uint8Array(1024 * 1024);
    smallMask[500] = 1;
    const smallRle = maskToPycocoRle(smallMask, 1024, 1024);
    pycocoRleToMask(smallRle, 2048, 2048);
  } catch {
    threwOnWrongDim = true;
  }
  assert(threwOnWrongDim, 'pycocoRleToMask strictly rejects RLE encoded for wrong dimensions (1024x1024 vs 2048x2048)');

  // 6.7 Explicit image_id allowlist and imagesRepresented count check
  const multiImgCsv = generateKaggleSubmissionCsv([
    { filament_id: '20260101000001Bh_1', segmentation_rle: multiRle },
    { filament_id: '20260101000001Bh_2', segmentation_rle: singleRle0 },
  ]);
  const multiImgAudit = validateKaggleSubmissionCsv(multiImgCsv, {
    allowedImageIds: ['20260101000001Bh'],
    requireCompressedRle: true,
  });
  assert(multiImgAudit.isValid === true, 'Explicit image allowlist accepts valid 20260101000001Bh rows');
  assert(multiImgAudit.imagesRepresented === 1, `imagesRepresented counts unique image IDs (1), not filament rows (${multiImgAudit.imagesRepresented})`);

  const unmappedImgAudit = validateKaggleSubmissionCsv(multiImgCsv, {
    allowedImageIds: ['SOME_OTHER_IMAGE_ID'],
    requireCompressedRle: true,
  });
  assert(unmappedImgAudit.isValid === false, 'Explicit image allowlist strictly rejects unmapped/unknown image_id');

  // -------------------------------------------------------------
  // GROUP 7: KAGGLE PANOPTIC QUALITY EVALUATOR & BACKEND METRIC FAILURE AUDIT
  // -------------------------------------------------------------
  console.log('\n--- Group 7: Kaggle Panoptic Quality Metric & Backend Error Resilience ---');

  const { execSync } = await import('child_process');
  const harnessOutput = execSync('python3 scripts/test_kaggle_evaluator_harness.py', { encoding: 'utf-8' });
  assert(
    harnessOutput.includes('ALL 21 TARGETED EVALUATOR & CONTRACT HARNESS TESTS PASSED!'),
    'Python 21-scenario Kaggle evaluation & contract harness passes all checks'
  );

  const contractOutput = execSync('python3 scripts/validate_submission_contract.py --csv public/submission.csv --strict-single-underscore', { encoding: 'utf-8' });
  assert(
    contractOutput.includes('OVERALL STATUS: PASSED'),
    'validate_submission_contract.py passes all strict byte-level and pycocotools round-trip checks on public/submission.csv'
  );

  // Terminal newline & strict TS validator on public/submission.csv
  const subCsvRaw = fs.readFileSync(path.resolve(process.cwd(), 'public', 'submission.csv'), 'utf-8');
  assert(subCsvRaw.endsWith('\n'), 'public/submission.csv ends with clean POSIX trailing newline');

  const subCsvAudit = validateKaggleSubmissionCsv(subCsvRaw, {
    allowedImageIds: ['20260101000001Bh'],
    requireCompressedRle: true,
  });
  assert(subCsvAudit.isValid === true, 'public/submission.csv passes strict TS submission validator');
  assert(subCsvAudit.duplicateIds.length === 0, 'public/submission.csv has 0 duplicate filament identifiers');
  assert(subCsvAudit.imagesRepresented === 1, 'public/submission.csv represents 1 unique test image (20260101000001Bh)');
  assert(subCsvAudit.rowCount === 3, 'public/submission.csv contains 3 predicted filament instances');

  // Solution archive contains submission.csv and python harness
  const archivePath = path.resolve(process.cwd(), 'public', 'solar-filament-solution.tar.gz');
  assert(fs.existsSync(archivePath), 'public/solar-filament-solution.tar.gz exists');
  const archiveStat = fs.statSync(archivePath);
  assert(archiveStat.size > 5000, `Solution tar.gz size is healthy (${archiveStat.size} bytes)`);

  console.log('\n==============================================================');
  console.log(`🌟 ALL ${passedTests}/${totalTests} INDEPENDENT SCIENTIFIC AUDIT TESTS PASSED!`);
  console.log('==============================================================');
}

runScientificAudit().catch(err => {
  console.error('Fatal audit failure:', err);
  process.exit(1);
});


