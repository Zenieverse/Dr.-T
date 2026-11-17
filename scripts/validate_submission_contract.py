#!/usr/bin/env python3
"""
Solar Filament Lab — Kaggle Submission Contract & Integrity Validator
Kaggle Solar Filament Segmentation Challenge 2026 (IEEE BigData Cup / ESAIR Lab)
"""

import os
import sys
import csv
import argparse
import hashlib
import numpy as np
import pandas as pd
import pycocotools.mask as mask_util

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, ".."))
PIPELINE_PKG_DIR = os.path.join(REPO_ROOT, "solar-filament-segmentation")
if PIPELINE_PKG_DIR not in sys.path:
    sys.path.insert(0, PIPELINE_PKG_DIR)

from src.pipeline import pycoco_rle_to_mask, mask_to_pycoco_rle, resolve_image_id  # noqa: E402

EXPECTED_SHAPE = (2048, 2048)
EXPECTED_COLUMNS = ["filament_id", "segmentation_rle"]

KNOWN_TEST_IMAGE_IDS = {
    "20260101000001Bh",
}


def validate_submission_file(
    csv_path: str,
    allowed_image_ids=None,
    sample_submission_path: str = None,
    strict_single_underscore: bool = False,
    expected_test_count: int = None,
) -> dict:
    if sample_submission_path and os.path.exists(sample_submission_path):
        sample_df = pd.read_csv(sample_submission_path, dtype=str)
        if "image_id" in sample_df.columns:
            allowed_image_ids = set(sample_df["image_id"].dropna().astype(str))
        elif "filament_id" in sample_df.columns:
            allowed_image_ids = {str(x).split("_", 1)[0] for x in sample_df["filament_id"].dropna()}
    elif allowed_image_ids is None:
        allowed_image_ids = KNOWN_TEST_IMAGE_IDS
    else:
        allowed_image_ids = set(allowed_image_ids)

    results = {
        "file_path": csv_path,
        "is_valid": False,
        "errors": [],
        "warnings": [],
        "file_size_bytes": 0,
        "sha256": "",
        "header": [],
        "row_count": 0,
        "unique_filaments": 0,
        "unique_images": 0,
        "image_ids_represented": [],
        "image_to_filaments": {},
        "round_trip_passed": 0,
        "batch_decode_passed": False,
        "disjoint_instances_per_image": True,
    }

    if not os.path.exists(csv_path):
        results["errors"].append(f"File not found: {csv_path}")
        return results

    file_size = os.path.getsize(csv_path)
    results["file_size_bytes"] = file_size
    if file_size == 0:
        results["errors"].append(f"File is empty (0 bytes): {csv_path}")
        return results

    with open(csv_path, "rb") as f:
        raw_bytes = f.read()

    results["sha256"] = hashlib.sha256(raw_bytes).hexdigest()

    if raw_bytes.startswith(b"\xef\xbb\xbf"):
        results["errors"].append("File contains UTF-8 BOM marker (must be standard UTF-8 without BOM)")

    if not raw_bytes.endswith(b"\n"):
        results["errors"].append("File does not end with a POSIX terminal newline ('\\n')")

    try:
        raw_text = raw_bytes.decode("utf-8")
    except UnicodeDecodeError as ex:
        results["errors"].append(f"File is not valid UTF-8: {ex}")
        return results

    lines = raw_text.splitlines()
    if len(lines) < 2:
        results["errors"].append(
            f"Submission has only {len(lines)} lines; must contain header plus prediction rows"
        )
        return results

    reader = csv.reader(lines)
    header = next(reader, None)
    results["header"] = header or []
    if header != EXPECTED_COLUMNS:
        results["errors"].append(f"Header must exactly match {EXPECTED_COLUMNS}, got {header}")

    csv_rows = list(reader)
    for idx, row_vals in enumerate(csv_rows):
        if len(row_vals) != 2:
            results["errors"].append(
                f"CSV row {idx + 1}: expected 2 columns, found {len(row_vals)} (corrupted CSV quoting/comma)"
            )

    try:
        df = pd.read_csv(csv_path, dtype=str, keep_default_na=True)
    except Exception as ex:
        results["errors"].append(f"Failed to read CSV with pandas: {ex}")
        return results

    if list(df.columns) != EXPECTED_COLUMNS:
        results["errors"].append(
            f"DataFrame columns {list(df.columns)} do not match expected {EXPECTED_COLUMNS}"
        )
        return results

    if df["filament_id"].isnull().any():
        results["errors"].append("filament_id column contains null or NaN values")
    if df["segmentation_rle"].isnull().any():
        results["errors"].append("segmentation_rle column contains null or NaN values")

    if len(df) == len(csv_rows):
        for r_idx, (csv_cols, (_, df_row)) in enumerate(zip(csv_rows, df.iterrows())):
            if len(csv_cols) == 2:
                df_fid = "" if pd.isna(df_row["filament_id"]) else str(df_row["filament_id"])
                df_rle = "" if pd.isna(df_row["segmentation_rle"]) else str(df_row["segmentation_rle"])
                if csv_cols[0] != df_fid or csv_cols[1] != df_rle:
                    results["errors"].append(
                        f"Row {r_idx}: csv.reader vs pandas.read_csv mismatch (possible unescaped backslash/quote corruption)"
                    )
                    break

    results["row_count"] = len(df)
    if df["filament_id"].duplicated().any():
        dups = df[df["filament_id"].duplicated()]["filament_id"].tolist()
        results["errors"].append(f"Duplicate filament_id values detected: {dups[:5]}")

    results["unique_filaments"] = int(df["filament_id"].nunique())

    image_ids_seen = set()
    image_to_filaments = {}
    masks_by_image = {}

    for row_idx, row in df.iterrows():
        raw_fid = row["filament_id"]
        raw_rle = row["segmentation_rle"]
        if pd.isna(raw_fid):
            continue
        fil_id = str(raw_fid).strip()

        try:
            base_img_id, suffix_idx = resolve_image_id(
                fil_id,
                known_image_ids=allowed_image_ids if allowed_image_ids else None,
                enforce_official_single_underscore=strict_single_underscore,
            )
        except ValueError as ex:
            results["errors"].append(f"Row {row_idx}: {ex}")
            continue

        if fil_id.split("_", 1)[0] != base_img_id:
            msg = (
                f"Row {row_idx}: filament_id '{fil_id}' has '_' inside image_id; "
                f"official self-evaluation-notebook str.split('_', n=1)[0] would extract '{fil_id.split('_', 1)[0]}' != '{base_img_id}'"
            )
            if strict_single_underscore:
                results["errors"].append(msg)
                continue
            else:
                results["warnings"].append(msg)

        image_ids_seen.add(base_img_id)
        image_to_filaments.setdefault(base_img_id, []).append((suffix_idx, fil_id))

        if pd.isna(raw_rle) or not str(raw_rle).strip():
            results["errors"].append(f"Row {row_idx}: segmentation_rle is empty")
            continue

        rle_val = str(raw_rle).strip()
        if rle_val.lower() in {"nan", "null", "none", "undefined"}:
            results["errors"].append(f"Row {row_idx}: segmentation_rle contains null literal '{rle_val}'")
            continue

        try:
            decoded_official = mask_util.decode({"size": list(EXPECTED_SHAPE), "counts": rle_val.encode("utf-8")})
            decoded_pipeline = pycoco_rle_to_mask(rle_val, EXPECTED_SHAPE)
        except Exception as ex:
            results["errors"].append(f"Row {row_idx}: RLE decode failed ({ex})")
            continue

        if decoded_official.shape != EXPECTED_SHAPE:
            results["errors"].append(
                f"Row {row_idx}: Decoded mask shape {decoded_official.shape} != {EXPECTED_SHAPE}"
            )
            continue

        if decoded_official.dtype != np.uint8:
            results["errors"].append(
                f"Row {row_idx}: Decoded mask dtype {decoded_official.dtype} != uint8"
            )
            continue

        if not np.array_equal(decoded_official, decoded_pipeline):
            results["errors"].append(
                f"Row {row_idx}: Pipeline decoder diverges from pycocotools.mask.decode!"
            )
            continue

        if int(decoded_official.sum()) == 0:
            results["warnings"].append(f"Row {row_idx}: RLE decodes to an all-zeros mask")

        re_encoded_official = mask_util.encode(np.asfortranarray(decoded_official))["counts"].decode("utf-8")
        re_encoded_pipeline = mask_to_pycoco_rle(decoded_pipeline)
        if re_encoded_official != rle_val or re_encoded_pipeline != rle_val:
            results["errors"].append(
                f"Row {row_idx}: RLE round-trip mismatch! Original={rle_val[:20]}..., Official={re_encoded_official[:20]}..."
            )
            continue

        masks_by_image.setdefault(base_img_id, []).append((fil_id, decoded_official))
        results["round_trip_passed"] += 1

    # Verify official self-evaluation-notebook batch rles_to_layers call & pairwise disjointness
    if not df["segmentation_rle"].isnull().any() and len(df) > 0:
        try:
            rle_dicts = [{"size": list(EXPECTED_SHAPE), "counts": str(r)} for r in df["segmentation_rle"].tolist()]
            stacked = mask_util.decode(rle_dicts).transpose(2, 0, 1)
            if stacked.shape == (len(df), EXPECTED_SHAPE[0], EXPECTED_SHAPE[1]):
                results["batch_decode_passed"] = True
            else:
                results["errors"].append(f"Official batch decode produced unexpected shape {stacked.shape}")
        except Exception as ex:
            results["errors"].append(f"Official rles_to_layers batch decode failed: {ex}")

    for img_id, inst_list in masks_by_image.items():
        if len(inst_list) > 1:
            union_sum = np.zeros(EXPECTED_SHAPE, dtype=np.uint16)
            for _, m in inst_list:
                union_sum += m
            overlap_pixels = int((union_sum > 1).sum())
            if overlap_pixels > 0:
                results["disjoint_instances_per_image"] = False
                results["warnings"].append(
                    f"Image '{img_id}' has {overlap_pixels} overlapping pixel(s) across predicted filament instances"
                )

    for img_id, items in image_to_filaments.items():
        indices = sorted(i for i, _ in items)
        expected_seq = list(range(1, len(items) + 1))
        if indices != expected_seq:
            results["warnings"].append(
                f"Image '{img_id}' filament suffix sequence {indices} is not contiguous 1..{len(items)}"
            )

    if expected_test_count is not None and len(image_ids_seen) > expected_test_count:
        results["errors"].append(
            f"Represented image count ({len(image_ids_seen)}) exceeds expected test count ({expected_test_count})"
        )
    elif expected_test_count is not None and len(image_ids_seen) < expected_test_count:
        results["warnings"].append(
            f"Submission covers {len(image_ids_seen)} of {expected_test_count} test images (omitted images assumed 0 predictions)"
        )

    results["unique_images"] = len(image_ids_seen)
    results["image_ids_represented"] = sorted(image_ids_seen)
    results["image_to_filaments"] = {k: [fid for _, fid in v] for k, v in sorted(image_to_filaments.items())}
    results["is_valid"] = len(results["errors"]) == 0
    return results


def main():
    parser = argparse.ArgumentParser(description="Kaggle Submission Contract Validator")
    parser.add_argument("--csv", type=str, default="public/submission.csv", help="Path to submission CSV")
    parser.add_argument("--sample-submission", type=str, default=None, help="Optional sample_submission.csv path")
    parser.add_argument(
        "--allowed-image-ids",
        type=str,
        default=None,
        help="Optional comma-separated list of allowed original image_ids",
    )
    parser.add_argument(
        "--strict-single-underscore",
        action="store_true",
        help="Enforce compatibility with official self-evaluation-notebook str.split('_', n=1)",
    )
    parser.add_argument(
        "--expected-test-count",
        type=int,
        default=None,
        help="Expected total test images in competition split",
    )
    args = parser.parse_args()

    allowed = (
        [x.strip() for x in args.allowed_image_ids.split(",") if x.strip()]
        if args.allowed_image_ids
        else None
    )

    print("=" * 70)
    print("SOLAR FILAMENT LAB — KAGGLE SUBMISSION CONTRACT AUDIT")
    print(f"Target File: {args.csv}")
    print("=" * 70)

    res = validate_submission_file(
        args.csv,
        allowed_image_ids=allowed,
        sample_submission_path=args.sample_submission,
        strict_single_underscore=args.strict_single_underscore,
        expected_test_count=args.expected_test_count,
    )

    print(f"Header Columns:     {res['header']}")
    print(f"File Size:          {res['file_size_bytes']} bytes")
    print(f"SHA-256 Checksum:   {res['sha256']}")
    print(f"Total Rows:         {res['row_count']}")
    print(f"Unique Filaments:   {res['unique_filaments']}")
    print(f"Unique Image IDs:   {res['unique_images']}")
    print(f"Image IDs Covered:  {res['image_ids_represented']}")
    print(f"Image->Filament Map:{res['image_to_filaments']}")
    print(f"Batch Decode OK:    {res['batch_decode_passed']}")
    print(f"Disjoint Instances: {res['disjoint_instances_per_image']}")
    print(f"RLE Round-trips:    {res['round_trip_passed']} / {res['row_count']} passed with 0 bit errors")

    if res["warnings"]:
        print("\nWarnings:")
        for w in res["warnings"]:
            print(f"  [WARN] {w}")

    if res["errors"]:
        print("\nValidation Errors:")
        for e in res["errors"]:
            print(f"  [FAIL] {e}")
        print("\nOVERALL STATUS: FAILED")
        sys.exit(1)
    else:
        print("\nOVERALL STATUS: PASSED (100% Contract Compliant)")
        sys.exit(0)


if __name__ == "__main__":
    main()
