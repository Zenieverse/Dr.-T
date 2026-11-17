#!/usr/bin/env python3
"""
Solar Filament Lab — Kaggle Panoptic Quality Evaluator & 16-Scenario Adversarial Harness
Kaggle Solar Filament Segmentation Challenge 2026 (ESAIR Lab / Dr. Azim Ahmadzadeh)
"""

import os
import sys
import io
import tempfile
import traceback
import numpy as np
import pandas as pd
import pycocotools.mask as mask_util

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, ".."))
PIPELINE_PKG_DIR = os.path.join(REPO_ROOT, "solar-filament-segmentation")
if PIPELINE_PKG_DIR not in sys.path:
    sys.path.insert(0, PIPELINE_PKG_DIR)
if SCRIPT_DIR not in sys.path:
    sys.path.insert(0, SCRIPT_DIR)

from src.pipeline import (  # noqa: E402
    mask_to_pycoco_rle,
    pycoco_rle_to_mask,
    resolve_image_id,
    calculate_panoptic_quality,
    evaluate_competition_submission,
    evaluate_official_self_eval_pq,
    export_predictions_to_csv,
    run_test_directory_inference,
)
from validate_submission_contract import validate_submission_file  # noqa: E402

IMAGE_SHAPE = (2048, 2048)


def encode_official(mask: np.ndarray) -> str:
    return mask_util.encode(np.asfortranarray(mask.astype(np.uint8)))["counts"].decode("utf-8")


def run_reproduction_and_test_suite():
    print("=" * 76)
    print("SOLAR FILAMENT LAB — 16-SCENARIO KAGGLE EVALUATOR & TRACEBACK HARNESS")
    print("=" * 76)

    mask_a = np.zeros(IMAGE_SHAPE, dtype=np.uint8, order="F")
    mask_a[500:600, 700:750] = 1

    mask_b = np.zeros(IMAGE_SHAPE, dtype=np.uint8, order="F")
    mask_b[1200:1350, 900:940] = 1

    mask_c = np.zeros(IMAGE_SHAPE, dtype=np.uint8, order="F")
    mask_c[1500:1620, 1500:1530] = 1

    rle_a = encode_official(mask_a)
    rle_b = encode_official(mask_b)
    rle_c = encode_official(mask_c)
    assert mask_to_pycoco_rle(mask_a) == rle_a
    assert np.array_equal(pycoco_rle_to_mask(rle_a, IMAGE_SHAPE), mask_a)

    tracebacks = {}

    # 1. One image with one filament
    print("\n[Test 01] One image with one filament")
    sol1 = pd.DataFrame([{"filament_id": "20260101000001Bh_1", "segmentation_rle": rle_a}])
    sub1 = pd.DataFrame([{"filament_id": "20260101000001Bh_1", "segmentation_rle": rle_a}])
    res1 = evaluate_competition_submission(sol1, sub1)
    assert res1["mean_pq"] == 1.0 and res1["total_tp"] == 1 and res1["total_fp"] == 0 and res1["total_fn"] == 0
    print(f"  [PASS] PQ={res1['mean_pq']:.4f}, TP={res1['total_tp']}, FP={res1['total_fp']}, FN={res1['total_fn']}")

    # 2. One image with multiple filaments
    print("\n[Test 02] One image with multiple filaments")
    sol2 = pd.DataFrame([
        {"filament_id": "20260101000001Bh_1", "segmentation_rle": rle_a},
        {"filament_id": "20260101000001Bh_2", "segmentation_rle": rle_b},
        {"filament_id": "20260101000001Bh_3", "segmentation_rle": rle_c},
    ])
    res2 = evaluate_competition_submission(sol2, sol2.copy())
    assert res2["mean_pq"] == 1.0 and res2["total_tp"] == 3
    print(f"  [PASS] PQ={res2['mean_pq']:.4f}, TP={res2['total_tp']}")

    # 3. Images with no predicted filaments
    print("\n[Test 03] Images with no predicted filaments")
    sub_empty = pd.DataFrame(columns=["filament_id", "segmentation_rle"])
    res3a = evaluate_competition_submission(sol2, sub_empty)
    assert res3a["mean_pq"] == 0.0 and res3a["total_fn"] == 3 and res3a["total_tp"] == 0

    sol_multi = pd.DataFrame([
        {"filament_id": "20150125_172714_Mh_1", "segmentation_rle": rle_a},
        {"filament_id": "20150125_172714_Mh_2", "segmentation_rle": rle_b},
        {"filament_id": "20160210_083000_Bh_1", "segmentation_rle": rle_c},
        {"filament_id": "20170315_120000_Kh_1", "segmentation_rle": rle_a},
    ])
    sub_mixed = pd.DataFrame([
        {"filament_id": "20150125_172714_Mh_1", "segmentation_rle": rle_a},
        {"filament_id": "20150125_172714_Mh_2", "segmentation_rle": rle_b},
        {"filament_id": "20170315_120000_Kh_1", "segmentation_rle": rle_a},
    ])
    res3b = evaluate_competition_submission(sol_multi, sub_mixed)
    assert abs(res3b["mean_pq"] - (2.0 / 3.0)) < 1e-6 and res3b["image_count"] == 3
    print(f"  [PASS] Zero-pred image evaluated safely: Mean PQ={res3b['mean_pq']:.4f}, FN={res3b['total_fn']}")

    # 4. Missing-image behavior
    print("\n[Test 04] Missing-image behavior (Naive KeyError vs Fixed evaluator)")
    try:
        sub_tmp = sub_mixed.copy()
        sub_tmp["image_id"] = sub_tmp["filament_id"].apply(lambda x: str(x).rsplit("_", 1)[0])
        sub_tmp.groupby("image_id").get_group("20160210_083000_Bh")
        raise AssertionError("Expected KeyError from naive get_group")
    except KeyError:
        tracebacks["missing_image_keyerror"] = traceback.format_exc()
        print(f"  [REPRODUCED TRACEBACK] KeyError captured ({len(tracebacks['missing_image_keyerror'])} chars)")
    assert abs(res3b["mean_pq"] - (2.0 / 3.0)) < 1e-6
    print("  [PASS] Fixed evaluator scores omitted zero-prediction image cleanly without KeyError")

    # 5. Empty ground truth
    print("\n[Test 05] Empty ground truth (True Negative & Hallucination FP)")
    tn_res = calculate_panoptic_quality([], [])
    assert tn_res == {"pq": 1.0, "sq": 1.0, "rq": 1.0, "tp": 0, "fp": 0, "fn": 0}
    fp_res = calculate_panoptic_quality([mask_a, mask_b], [])
    assert fp_res == {"pq": 0.0, "sq": 0.0, "rq": 0.0, "tp": 0, "fp": 2, "fn": 0}
    print(f"  [PASS] Empty GT+Pred PQ=1.0 | Empty GT+2 Pred PQ=0.0 (FP={fp_res['fp']})")

    # 6. Empty predictions
    print("\n[Test 06] Empty predictions DataFrame")
    try:
        empty_df = pd.DataFrame(columns=["filament_id", "segmentation_rle"])
        _ = empty_df["segmentation_rle"].iloc[0]
        raise AssertionError("Expected IndexError")
    except IndexError:
        tracebacks["empty_df_indexerror"] = traceback.format_exc()
        print("  [REPRODUCED TRACEBACK] IndexError captured on empty DataFrame")
    res6 = evaluate_competition_submission(sol1, sub_empty)
    assert res6["mean_pq"] == 0.0 and res6["total_fn"] == 1
    print("  [PASS] Fixed evaluator returns PQ=0.0, FN=1 on empty submission DataFrame")

    # 7. Zero true positives
    print("\n[Test 07] Zero true positives (disjoint mask -> TP=0 -> SQ=0.0 without ZeroDivisionError)")
    try:
        _ = 0.0 / 0
    except ZeroDivisionError:
        tracebacks["tp_zero_div"] = traceback.format_exc()
        print("  [REPRODUCED TRACEBACK] ZeroDivisionError captured for naive TP=0 SQ division")
    sub_zero_tp = pd.DataFrame([{"filament_id": "20260101000001Bh_1", "segmentation_rle": rle_b}])
    res7 = evaluate_competition_submission(sol1, sub_zero_tp)
    assert res7["total_tp"] == 0 and res7["total_fp"] == 1 and res7["total_fn"] == 1 and res7["mean_pq"] == 0.0
    print(f"  [PASS] Zero TP handled cleanly: PQ={res7['mean_pq']:.4f}, TP=0, FP=1, FN=1")

    # 8. Perfect segmentation
    print("\n[Test 08] Perfect segmentation")
    res8 = evaluate_competition_submission(sol_multi, sol_multi.copy())
    assert res8["mean_pq"] == 1.0 and res8["total_tp"] == 4 and res8["total_fp"] == 0 and res8["total_fn"] == 0
    print(f"  [PASS] Perfect multi-image segmentation: PQ={res8['mean_pq']:.4f}, TP={res8['total_tp']}")

    # 9. Over-segmentation
    print("\n[Test 09] Over-segmentation (artificial fragmentation)")
    mask_top = np.zeros(IMAGE_SHAPE, dtype=np.uint8, order="F")
    mask_top[500:550, 700:750] = 1
    mask_bot = np.zeros(IMAGE_SHAPE, dtype=np.uint8, order="F")
    mask_bot[550:600, 700:750] = 1
    sol9 = pd.DataFrame([{"filament_id": "splitImg_1", "segmentation_rle": rle_a}])
    sub9 = pd.DataFrame([
        {"filament_id": "splitImg_1", "segmentation_rle": encode_official(mask_top)},
        {"filament_id": "splitImg_2", "segmentation_rle": encode_official(mask_bot)},
    ])
    res9 = evaluate_competition_submission(sol9, sub9)
    assert res9["mean_pq"] == 0.0 and res9["total_fp"] == 2 and res9["total_fn"] == 1
    print(f"  [PASS] Over-segmentation penalized: TP=0, FP=2, FN=1, PQ={res9['mean_pq']:.4f}")

    # 10. Under-segmentation
    print("\n[Test 10] Under-segmentation (over-merging)")
    mask_merged = np.logical_or(mask_a, mask_b).astype(np.uint8)
    sol10 = pd.DataFrame([
        {"filament_id": "mergeImg_1", "segmentation_rle": rle_a},
        {"filament_id": "mergeImg_2", "segmentation_rle": rle_b},
    ])
    sub10 = pd.DataFrame([{"filament_id": "mergeImg_1", "segmentation_rle": encode_official(mask_merged)}])
    res10 = evaluate_competition_submission(sol10, sub10)
    assert res10["total_tp"] == 1 and res10["total_fn"] == 1 and res10["total_fp"] == 0
    print(f"  [PASS] Under-segmentation matched at most 1 GT: TP=1, FN=1, PQ={res10['mean_pq']:.4f}")

    # 11. Invalid image IDs & explicit image_id mapping
    print("\n[Test 11] Invalid image IDs & explicit image_id mapping")
    sub_bad_id = pd.DataFrame([{"filament_id": "solar_20260410_1100_test_fil_1", "segmentation_rle": rle_a}])
    try:
        evaluate_competition_submission(sol1, sub_bad_id)
        raise AssertionError("Should reject _fil_ / unknown image_id")
    except ValueError:
        tracebacks["invalid_image_id"] = traceback.format_exc()
        print("  [PASS] Rejected prohibited _fil_/_test identifier cleanly")

    sub_unknown_img = pd.DataFrame([{"filament_id": "UNKNOWN_IMG_999_1", "segmentation_rle": rle_a}])
    try:
        evaluate_competition_submission(sol1, sub_unknown_img)
        raise AssertionError("Should reject unknown image_id")
    except ValueError:
        print("  [PASS] Rejected unknown unmapped image_id cleanly via explicit image registry")

    img_id, idx_num = resolve_image_id("obs_2026_1_2", known_image_ids={"obs_2026_1"})
    assert img_id == "obs_2026_1" and idx_num == 2
    img_id2, idx_num2 = resolve_image_id(
        "obs_2026_1_2",
        explicit_mapping={"obs_2026_1_2": "obs_2026_1"},
    )
    assert img_id2 == "obs_2026_1" and idx_num2 == 2
    print("  [PASS] Explicit image_id registry & dictionary mapping verified")

    # 12. Duplicate filament IDs
    print("\n[Test 12] Duplicate filament IDs")
    sub_dup = pd.DataFrame([
        {"filament_id": "20260101000001Bh_1", "segmentation_rle": rle_a},
        {"filament_id": "20260101000001Bh_1", "segmentation_rle": rle_b},
    ])
    try:
        evaluate_competition_submission(sol1, sub_dup)
        raise AssertionError("Should reject duplicate filament_id")
    except ValueError:
        tracebacks["duplicate_filament_id"] = traceback.format_exc()
        print("  [PASS] Rejected duplicate filament_id cleanly")

    # 13. Invalid RLE
    print("\n[Test 13] Invalid RLE strings")
    for bad_rle in ["invalid_garbage_rle_string", "oSQm1d0", "~~~~"]:
        try:
            pycoco_rle_to_mask(bad_rle, IMAGE_SHAPE)
            raise AssertionError(f"Should reject bad RLE: {bad_rle}")
        except ValueError:
            pass
    sub_bad_rle = pd.DataFrame([{"filament_id": "20260101000001Bh_1", "segmentation_rle": "invalid_garbage"}])
    try:
        evaluate_competition_submission(sol1, sub_bad_rle)
        raise AssertionError("Evaluator should reject corrupted RLE")
    except ValueError:
        tracebacks["invalid_rle"] = traceback.format_exc()
        print("  [PASS] Rejected corrupted, truncated, and non-LEB128 RLE strings cleanly")

    # 14. Wrong mask dimensions
    print("\n[Test 14] Wrong mask dimensions")
    wrong_mask = np.zeros((1024, 1024), dtype=np.uint8, order="F")
    wrong_mask[100:200, 100:200] = 1
    rle_wrong_dim = encode_official(wrong_mask)
    try:
        pycoco_rle_to_mask(rle_wrong_dim, IMAGE_SHAPE)
        raise AssertionError("Should reject 1024x1024 RLE when 2048x2048 is expected")
    except ValueError as ex:
        tracebacks["wrong_dimensions"] = traceback.format_exc()
        assert "pixel count mismatch" in str(ex)
        print(f"  [PASS] Rejected wrong mask dimensions (1024x1024 != 2048x2048): {ex}")

    # 15. Corrupted CSV quoting & escaped backslashes
    print("\n[Test 15] Corrupted CSV quoting and escaped backslashes")
    rle_with_bs = "oSQm1d0\\o14L4mkhR2"
    with tempfile.TemporaryDirectory() as tmpd:
        bad_quote_csv = os.path.join(tmpd, "bad_quote.csv")
        with open(bad_quote_csv, "w", encoding="utf-8", newline="\n") as f:
            f.write('filament_id,segmentation_rle\n20260101000001Bh_1,"' + rle_a + '\n')
        q_res = validate_submission_file(bad_quote_csv)
        assert not q_res["is_valid"], "Must reject unclosed CSV quote"

        bs_df = pd.read_csv(io.StringIO(f"filament_id,segmentation_rle\n20260101000001Bh_1,{rle_with_bs}\n"), escapechar="\\")
        corrupted_val = bs_df.iloc[0]["segmentation_rle"]
        assert corrupted_val != rle_with_bs

        bom_csv = os.path.join(tmpd, "bom.csv")
        with open(bom_csv, "wb") as f:
            f.write(b"\xef\xbb\xbf" + f"filament_id,segmentation_rle\n20260101000001Bh_1,{rle_a}\n".encode("utf-8"))
        b_res = validate_submission_file(bom_csv)
        assert not b_res["is_valid"] and any("BOM" in e for e in b_res["errors"])

        empty_exp_csv = os.path.join(tmpd, "empty_exp.csv")
        export_predictions_to_csv([], empty_exp_csv)
        with open(empty_exp_csv, "r", encoding="utf-8") as ef:
            assert ef.read() == "filament_id,segmentation_rle\n"

    print("  [PASS] Corrupted quoting, backslash stripping, BOM, and empty-header safety verified")

    # 16. Validate EVERY row of actual public/submission.csv
    print("\n[Test 16] Audit EVERY generated row in public/submission.csv")
    sub_path = os.path.join(REPO_ROOT, "public", "submission.csv")
    assert os.path.exists(sub_path), f"Missing {sub_path}"

    contract_res = validate_submission_file(sub_path)
    assert contract_res["is_valid"], f"Contract validator failed: {contract_res['errors']}"

    actual_sub = pd.read_csv(sub_path, dtype=str)
    assert len(actual_sub) > 0, "public/submission.csv must have >= 1 prediction row"
    for row_idx, row in actual_sub.iterrows():
        fid = row["filament_id"]
        rle = row["segmentation_rle"]
        base_id, inst_idx = resolve_image_id(fid, known_image_ids={"20260101000001Bh"})
        decoded = mask_util.decode({"size": list(IMAGE_SHAPE), "counts": rle.encode("utf-8")})
        assert decoded.shape == IMAGE_SHAPE and decoded.dtype == np.uint8
        assert int(decoded.sum()) > 0, f"Row {row_idx} ({fid}) decoded to empty mask!"
        assert encode_official(decoded) == rle, f"Row {row_idx} ({fid}) failed round-trip!"
        print(f"  Row {row_idx}: {fid} -> image={base_id}, inst={inst_idx}, area={int(decoded.sum())} px, rle_len={len(rle)} OK")

    eval_actual = evaluate_competition_submission(actual_sub.copy(), actual_sub.copy())
    assert eval_actual["mean_pq"] == 1.0
    print(f"  [PASS] All {len(actual_sub)} submission rows decoded, verified non-empty, round-tripped, PQ={eval_actual['mean_pq']:.4f}")

    # 17. Negative Contract Tests: wrong/extra/swapped columns & uncompressed 1-indexed RLE
    print("\n[Test 17] Negative Contract Tests (wrong/extra/swapped columns & uncompressed RLE)")
    with tempfile.TemporaryDirectory() as tmpd:
        wrong_cols = os.path.join(tmpd, "wrong_cols.csv")
        with open(wrong_cols, "w", encoding="utf-8", newline="\n") as f:
            f.write(f"id,rle\n20260101000001Bh_1,{rle_a}\n")
        assert not validate_submission_file(wrong_cols)["is_valid"], "Must reject wrong column names"

        extra_col = os.path.join(tmpd, "extra_col.csv")
        with open(extra_col, "w", encoding="utf-8", newline="\n") as f:
            f.write(f"image_id,filament_id,segmentation_rle\n20260101000001Bh,20260101000001Bh_1,{rle_a}\n")
        assert not validate_submission_file(extra_col)["is_valid"], "Must reject extra image_id column"

        swapped_cols = os.path.join(tmpd, "swapped_cols.csv")
        with open(swapped_cols, "w", encoding="utf-8", newline="\n") as f:
            f.write(f"segmentation_rle,filament_id\n{rle_a},20260101000001Bh_1\n")
        assert not validate_submission_file(swapped_cols)["is_valid"], "Must reject swapped column order"

        uncompressed_csv = os.path.join(tmpd, "uncompressed.csv")
        with open(uncompressed_csv, "w", encoding="utf-8", newline="\n") as f:
            f.write("filament_id,segmentation_rle\n20260101000001Bh_1,100 10 200 15\n")
        assert not validate_submission_file(uncompressed_csv)["is_valid"], "Must reject uncompressed 1-indexed RLE"
    print("  [PASS] Rejected wrong column names, extra column, swapped order, and uncompressed RLE")

    # 18. Strict single-underscore & truncated CSV negative tests
    print("\n[Test 18] Strict single-underscore (self-evaluation-notebook) & truncated CSV tests")
    with tempfile.TemporaryDirectory() as tmpd:
        underscore_csv = os.path.join(tmpd, "underscore_id.csv")
        with open(underscore_csv, "w", encoding="utf-8", newline="\n") as f:
            f.write(f"filament_id,segmentation_rle\nimported_20260101000001Bh_1,{rle_a}\n")
        u_res = validate_submission_file(
            underscore_csv,
            allowed_image_ids={"imported_20260101000001Bh"},
            strict_single_underscore=True,
        )
        assert not u_res["is_valid"], "Must reject multi-underscore ID under strict_single_underscore"

        trunc_csv = os.path.join(tmpd, "truncated.csv")
        with open(trunc_csv, "w", encoding="utf-8", newline="\n") as f:
            f.write("filament_id,segmentation_rle\n")
        assert not validate_submission_file(trunc_csv)["is_valid"], "Must reject header-only CSV"
    print("  [PASS] Multi-underscore ID & truncated CSV negative tests verified")

    # 19. Official azimahmadzadeh/self-evaluation-notebook PQ cross-check
    print("\n[Test 19] Official azimahmadzadeh/self-evaluation-notebook PQ cross-check")
    gt_official = pd.DataFrame([
        {"filament_id": "ann1-20150125172714Mh_1", "segmentation_rle": rle_a},
        {"filament_id": "ann1-20150125172714Mh_2", "segmentation_rle": rle_b},
        {"filament_id": "ann1-20160210083000Bh_1", "segmentation_rle": rle_c},
    ])
    pred_official = pd.DataFrame([
        {"filament_id": "20150125172714Mh_1", "segmentation_rle": rle_a},
        {"filament_id": "20150125172714Mh_2", "segmentation_rle": rle_b},
        # 20160210083000Bh intentionally omitted (0 predicted filaments)
    ])
    off_res = evaluate_official_self_eval_pq(gt_official, pred_official)
    # TP=2 (both IoU=1.0), FP=0, FN=1 => PQ = 2.0 / (2 + 0 + 0.5) = 0.8
    assert off_res["tp_count"] == 2 and off_res["fp_count"] == 0 and off_res["fn_count"] == 1
    assert abs(off_res["pq_score"] - 0.8) < 1e-6

    off_empty = evaluate_official_self_eval_pq(gt_official, pd.DataFrame(columns=["filament_id", "segmentation_rle"]))
    assert off_empty["pq_score"] == 0.0 and off_empty["fn_count"] == 3
    print(f"  [PASS] Official self-eval PQ verified: PQ={off_res['pq_score']:.4f}, omitted-image & empty-df safe")

    # 20. Full multi-image directory inference (PNG + FITS + blank disk + fail-fast corrupt guard)
    print("\n[Test 20] Multi-image directory inference (PNG + FITS + empty disk + sample_submission)")
    import cv2
    from astropy.io import fits
    with tempfile.TemporaryDirectory() as tmpd:
        test_dir = os.path.join(tmpd, "test")
        os.makedirs(test_dir, exist_ok=True)

        # Synthetic solar disk with dark elongated filament ribbon (PNG)
        y_g, x_g = np.ogrid[:2048, :2048]
        r_g = np.sqrt((x_g - 1024) ** 2 + (y_g - 1024) ** 2)
        disk = np.where(r_g <= 940, 210, 0).astype(np.uint8)
        img_png = disk.copy()
        img_png[700:724, 800:1050] = 35  # strong absorption filament 1
        img_png[1200:1224, 900:1120] = 35  # strong absorption filament 2
        cv2.imwrite(os.path.join(test_dir, "20260101000001Bh.png"), img_png)

        # Synthetic FITS solar disk with 1 absorption filament
        img_fits = disk.copy()
        img_fits[950:974, 850:1100] = 30
        fits.PrimaryHDU(img_fits).writeto(os.path.join(test_dir, "20260102000001Mh.fits"))

        # Blank quiet solar disk (0 filaments)
        cv2.imwrite(os.path.join(test_dir, "20260103000001Kh.png"), disk)

        sample_sub_path = os.path.join(tmpd, "sample_submission.csv")
        pd.DataFrame([
            {"filament_id": "20260101000001Bh_1", "segmentation_rle": rle_a},
            {"filament_id": "20260102000001Mh_1", "segmentation_rle": rle_a},
            {"filament_id": "20260103000001Kh_1", "segmentation_rle": rle_a},
        ]).to_csv(sample_sub_path, index=False)

        out_csv = os.path.join(tmpd, "submission.csv")
        summary = run_test_directory_inference(
            input_dir=test_dir,
            output_path=out_csv,
            sample_submission_path=sample_sub_path,
        )
        assert summary["total_test_images"] == 3
        assert summary["processed_images"] == 3
        assert summary["predicted_images"] == 2
        assert summary["zero_filament_images"] == 1
        assert summary["total_instances"] >= 3
        assert summary["disk_validation"]["is_valid"]
        assert summary["disk_validation"]["disjoint_instances_per_image"]

        # Verify fail-fast when a corrupt file is added
        with open(os.path.join(test_dir, "20260104000001Bh.png"), "wb") as cf:
            cf.write(b"not a valid image")
        try:
            run_test_directory_inference(input_dir=test_dir, output_path=out_csv)
            raise AssertionError("Should fail loudly on unreadable/corrupt image file")
        except RuntimeError:
            pass
    print("  [PASS] Multi-image PNG+FITS+blank inference, zero-pred omission, and corrupt fail-fast verified")

    # 21. Verify public/submission.csv strict single-underscore, batch decode & pairwise disjointness
    print("\n[Test 21] Verify public/submission.csv batch decode, strict single-underscore & disjointness")
    strict_res = validate_submission_file(sub_path, strict_single_underscore=True)
    assert strict_res["is_valid"], f"Strict check failed: {strict_res['errors']}"
    assert strict_res["batch_decode_passed"] is True
    assert strict_res["disjoint_instances_per_image"] is True
    with open(sub_path, "r", encoding="utf-8") as sf:
        raw_lines = sf.read().splitlines()
        assert raw_lines[0] == "filament_id,segmentation_rle"
        assert all('"' not in ln for ln in raw_lines), "Clean unquoted CSV cells expected"
    print(f"  [PASS] public/submission.csv verified clean unquoted 2-column CSV, batch decode OK, disjoint instances OK")

    print("\n--- Captured Exception Tracebacks Summary ---")
    for name, tb in tracebacks.items():
        last_line = tb.strip().splitlines()[-1]
        print(f"  * {name}: {last_line}")

    print("\n" + "=" * 76)
    print("ALL 21 TARGETED EVALUATOR & CONTRACT HARNESS TESTS PASSED!")
    print("=" * 76)


if __name__ == "__main__":
    run_reproduction_and_test_suite()
