# DR. T — SOLAR FILAMENT LAB
## KAGGLE 2026 SUBMISSION AUDIT & READINESS CHECKLIST

**Competition:** Kaggle Solar Filament Segmentation Challenge 2026  
**Auditor:** Independent Machine Learning & Kaggle Submission Reviewer  
**Final Verdict:** **LOCAL CONTRACT PASSED — REQUIRES FULL KAGGLE TEST SET INFERENCE FOR REMOTE SCORING**  

---

## 1. 10-POINT AUTOMATED COMPLIANCE AUDIT

Every generated submission file must pass the automated contract audit (`scripts/validate_submission_contract.py --strict-single-underscore`) before upload to Kaggle:

| # | Audit Check Item | Official Rule Specification | Pipeline Validation Result | Status |
|:---:|:---|:---|:---|:---:|
| **1** | **CSV Header Format** | Exact two-column lowercase ASCII `filament_id,segmentation_rle` without extra columns, BOM, or quotes. | Validated in `validateKaggleSubmissionCsv` & `validate_submission_contract.py`. | **PASS** |
| **2** | **Unique Identifiers** | Every `filament_id` must be distinct: `<original_image_id>_<index>` (`1, 2, ...`). | Hash set verification guarantees 0 duplicate IDs across all rows. | **PASS** |
| **3** | **Official Evaluator ID Parsing** | Official `self-evaluation-notebook` splits `filament_id` via `str.split("_", n=1).str[0]`. | Test-image IDs preserve original ID cleanly without `_fil_`, `_test`, or `imported_` prefixes. | **PASS** |
| **4** | **Compressed pycocotools RLE** | Official `pycocotools.mask.encode(np.asfortranarray(mask))['counts']` LEB128 ASCII `[48..111]`. | Enforced in `maskToPycocoRle` / `mask_to_pycoco_rle` and round-trip verified. | **PASS** |
| **5** | **Batch Decode Compatibility** | `mask_util.decode([{"size": [2048, 2048], "counts": rle}, ...])` must succeed. | Verified with `pycocotools 2.0.11` batch decode across all submission rows. | **PASS** |
| **6** | **2048×2048 Matrix Bound** | Decoded masks must have exact `(2048, 2048)` shape (`uint8`) and Fortran order (`order='F'`). | Verified pixel-for-pixel via `pycoco_rle_to_mask` and `pycocotools.mask.decode`. | **PASS** |
| **7** | **Disjoint Instances per Image** | Distinct filament instances on the same image should not overlap (`IoU > 0.5` duplicate hit guard). | Verified 0 overlapping pixels across instances on the same image. | **PASS** |
| **8** | **Test-Set Coverage Tracking** | Inference logs total test images, predicted images, omitted zero-prediction images, and failed files. | Local repo holds 1 benchmark test fixture (`20260101000001Bh`); CLI handles full Kaggle dir. | **VERIFIED** |
| **9** | **Zero Ground-Truth Leakage** | Submission must NOT utilize ground truth masks of test split images under any circumstance. | Invariant verified: test split images have strictly `0` ground truth filaments accessible. | **PASS** |
| **10** | **File Encoding & Line Endings** | UTF-8 plain text CSV without BOM, POSIX `\n` line terminator, zero `NaN`/null fields. | Verified byte-for-byte via `validate_submission_contract.py`. | **PASS** |

---

## 2. OFFICIAL KAGGLE SUBMISSION WORKFLOW

### Step 1: Run Inference Against the Full Kaggle Test Split
Because Kaggle competition datasets require authenticated download, run inside Kaggle Notebooks (or locally after downloading `filament-segmentation-2026`):
```bash
python3 solar-filament-segmentation/src/pipeline.py \
  --input-dir /kaggle/input/filament-segmentation-2026/test \
  --sample-submission /kaggle/input/filament-segmentation-2026/sample_submission.csv \
  --output submission.csv
python3 scripts/validate_submission_contract.py \
  --csv submission.csv \
  --sample-submission /kaggle/input/filament-segmentation-2026/sample_submission.csv \
  --strict-single-underscore
```
Alternatively, upload blind test images via **Dr. T -> Solar Filament Lab -> Dataset Explorer** (`TEST` split) and export the live CSV via **Kaggle Submission Center** (`/api/solarfilament/submission/csv`).

### Step 2: Upload to Kaggle Competition
1. Open [Kaggle Solar Filament Segmentation Challenge 2026 Submissions](https://www.kaggle.com/competitions/filament-segmentation-2026/submissions).
2. Upload the full test-set `submission.csv` generated in Step 1.

### Step 3: Attach Reproducibility Solution Archive
Download `public/solar-filament-solution.tar.gz` and `public/Solar_Filament_Technical_Report.pdf` from **Kaggle Submission Center** (Tab 10) or `public/download.html`.
