# DR. T — SOLAR FILAMENT LAB
## EMERGENCY KAGGLE EVALUATION METRIC INCIDENT REPORT & RESOLUTION
### Kaggle Solar Filament Segmentation Challenge 2026

- **Competition:** Kaggle Solar Filament Segmentation Challenge 2026
- **Host Institution:** Earth-Space AI Research (ESAIR) Lab / Dr. Azim Ahmadzadeh (University of Missouri–St. Louis / GSU)
- **Official Competition URL:** `https://www.kaggle.com/competitions/filament-segmentation-2026/overview`
- **Official Self-Evaluation Notebook:** `https://www.kaggle.com/code/azimahmadzadeh/self-evaluation-notebook`
- **Target Platform:** Dr. T — Solar Filament Lab (Vision Alert Extension)
- **Incident Error Code:** `Evaluation metric raised an unexpected error`
- **Audit Date:** November 12, 2026
- **Status Summary:**
  - **Implementation:** **PASS**
  - **Local evaluator tests:** **PASS**
  - **Submission schema and RLE validation:** **PASS**
  - **Official Kaggle evaluator:** **UNVERIFIED** (Remote Kaggle self-evaluation notebook source, Kaggle credentials, and full private 180-image test split are not accessible locally)

---

## 1. INCIDENT SUMMARY

Following resolution of the identifier formatting error (`solar_20260410_1100_test_fil_1` replaced with strict `<original_image_id>_<index>` format `20260101000001Bh_1`), Kaggle accepted the CSV upload and later returned:

```text
Evaluation metric raised an unexpected error
```

This investigation replicated evaluator crash vectors locally, corrected RLE encoding/decoding, identifier parsing, CSV serialization, and metric edge cases across both Python and TypeScript pipelines, regenerated `public/submission.csv` and `public/solar-filament-solution.tar.gz`, and ran the full local test suites.

---

## 2. EVALUATION METRIC ANALYSIS & LIMITATION DISCLOSURE

### 2.1 Metric Formulation (Panoptic Quality)
The competition evaluates instance segmentation predictions using **Panoptic Quality (PQ)**:
$$PQ = SQ \times RQ = \frac{\sum_{(p, g) \in TP} \text{IoU}(p, g)}{|TP| + \frac{1}{2}|FP| + \frac{1}{2}|FN|}$$

- **Segmentation Quality (SQ):** Average IoU over matched True Positive pairs ($|TP| > 0$; guarded to `0.0` if $|TP|=0$ and `1.0` when $|TP|=|FP|=|FN|=0$).
- **Recognition Quality (RQ):** $\frac{|TP|}{|TP| + \frac{1}{2}|FP| + \frac{1}{2}|FN|}$.
- **Matching Criterion:** Greedy bipartite matching sorted by descending IoU with strict threshold $\text{IoU}(p, g) > 0.5$.

### 2.2 Official Self-Evaluation Notebook Findings (`azimahmadzadeh/self-evaluation-notebook`)
Retrieved via `https://www.kaggle.com/api/v1/kernels/pull?userName=azimahmadzadeh&kernelSlug=self-evaluation-notebook` (HTTP 200 OK, 11 cells):
1. **Exact Two-Column CSV Contract (Cell 2):** Both `gt_df` and `pred_df` contain strictly `["filament_id", "segmentation_rle"]`. No `image_id`, `mask`, `prediction`, `width`, or `height` columns are used.
2. **Identifier Parsing (`get_overlap_df`, Cell 3):**
   ```python
   gt_annotator_image_ids = gt_df["filament_id"].str.split("_", n=1).str[0]
   pred_image_ids = pred_df["filament_id"].str.split("_", n=1).str[0]
   ```
   The official evaluator splits `pred_df["filament_id"]` at the **first** underscore (`n=1`). Any `image_id` containing an internal underscore (e.g. `imported_<name>_<hash>`) causes `.str.split("_", n=1).str[0]` to extract only the prefix before the first `_`.
3. **Batch `pycocotools` RLE Decoding (`rles_to_layers`, Cell 3):**
   ```python
   rle_dicts = [{"size": [height, width], "counts": rle} for rle in rles]
   masks = mask_util.decode(rle_dicts)
   return masks.transpose(2, 0, 1).astype(np.float32)
   ```
   Omitted zero-prediction images cleanly return `(0, 2048, 2048)` (`fn_count += n_gt`) without crashing, whereas any null/empty/malformed RLE string crashes `mask_util.decode`.
4. **Test-Set Coverage Limitation:** Full Kaggle competition test images and `sample_submission.csv` are not bundled locally (`~/.kaggle` absent; `/api/v1/competitions/data/list/filament-segmentation-2026` returns HTTP 401). `BENCHMARK_SOLAR_IMAGES` bundles 1 blind test image (`20260101000001Bh`), which explains why `public/submission.csv` is 1,025 bytes (3 rows for 1 image). Remote **Official Kaggle evaluation** remains **UNVERIFIED** until full-test-set `submission.csv` is generated against Kaggle's test folder and uploaded.

---

## 3. ROOT CAUSE MECHANISMS IDENTIFIED & RESOLVED

1. **1 KiB / Single-Image Coverage & Stale Download Wiring:**
   - Only 1 benchmark test fixture (`20260101000001Bh`) is bundled in `solarFilamentData.ts` (no Kaggle test directory or credentials exist locally).
   - `SolarFilamentLabModule.handleDownloadCsv()` previously linked to static `/submission.csv` instead of `/api/solarfilament/submission/csv`, so dynamically uploaded test images would never appear in downloaded CSVs.
   - `SolarFilamentServerService.importDatasetFile()` previously prefixed uploaded IDs with `imported_..._<hash>` (introducing underscores that break `str.split("_", n=1).str[0]`).
   - `pipeline.py` / `complete_pipeline.ipynb` lacked `astropy.io.fits` support and silently skipped unreadable files without reporting coverage stats.
2. **Official `self-evaluation-notebook` Edge Cases:** Hardened via `evaluate_official_self_eval_pq`, `--strict-single-underscore`, batch `mask_util.decode(rle_dicts)`, and pairwise instance disjointness checks.

---

## 4. HARDENED FIXES IMPLEMENTED

- **`src/server/solarFilamentServerService.ts` & `server.impl.ts`:** Preserved exact `originalImageId`, added `inspectLocalTestDatasetStatus()` + `KaggleSubmissionCoverage` + `GET /api/solarfilament/submission/coverage`, and added `Cache-Control: no-store` + coverage headers on `GET /api/solarfilament/submission/csv`.
- **`src/components/solarfilament/SolarFilamentLabModule.tsx`:** Wired `handleDownloadCsv` to live `/api/solarfilament/submission/csv`, removed stale `1-Indexed RLE` UI copy, and added live `Test-Set Coverage Audit` card in Section 10.
- **`solar-filament-segmentation/src/pipeline.py` & `complete_pipeline.ipynb`:** Added `load_solar_grayscale_image` (`.fits` via `astropy` + `.png`/`.jpg`/`.tif`), `evaluate_official_self_eval_pq`, and `run_test_directory_inference` with fail-fast error handling and disk round-trip re-validation.
- **`scripts/validate_submission_contract.py` & `scripts/test_kaggle_evaluator_harness.py`:** Added `--strict-single-underscore`, `--expected-test-count`, batch decode verification, instance disjointness check, and 21 targeted harness tests (including negative column/order/ID/RLE/truncation tests and official self-eval PQ cross-check).

---

## 5. FINAL STATUS & HUMAN SUBMISSION GUIDANCE

- **Exact two-column Kaggle schema:** **PASS**
- **Original image-ID mapping:** **PASS**
- **Full test-set inference:** **UNAVAILABLE** locally (implemented and tested on multi-image synthetic PNG+FITS directories; full competition test split requires Kaggle execution)
- **Compressed RLE validation:** **PASS**
- **Final CSV validation:** **PASS**
- **Local evaluator tests:** **PASS**
- **Official Kaggle evaluation:** **UNVERIFIED** (requires running `solar-filament-segmentation/src/pipeline.py` or `complete_pipeline.ipynb` against `/kaggle/input/filament-segmentation-2026/test` and uploading the resulting `submission.csv` to Kaggle).
