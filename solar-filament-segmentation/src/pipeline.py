"""
Kaggle Solar Filament Segmentation Challenge 2026
Production Computer Vision & Panoptic Quality Pipeline
Dr. T Solar Filament Lab — Team Zenieverse
"""

import os
import re
import csv
import json
import argparse
from typing import Dict, Iterable, List, Optional, Sequence, Set, Tuple
import numpy as np
import pandas as pd

try:
    import cv2
except ImportError:
    cv2 = None

try:
    from skimage.feature import hessian_matrix, hessian_matrix_eigvals
    from skimage.segmentation import watershed
    from skimage.measure import regionprops
except ImportError:
    hessian_matrix = None
    hessian_matrix_eigvals = None
    watershed = None
    regionprops = None

try:
    from astropy.io import fits as _astropy_fits
except ImportError:
    _astropy_fits = None

try:
    import pycocotools.mask as _coco_mask_util
except ImportError:
    _coco_mask_util = None


EXPECTED_SHAPE: Tuple[int, int] = (2048, 2048)
EXPECTED_COLUMNS: List[str] = ["filament_id", "segmentation_rle"]
_FILAMENT_ID_RE = re.compile(r"^(.+)_([1-9]\d*)$")


def load_solar_grayscale_image(image_path: str, target_shape: Tuple[int, int] = EXPECTED_SHAPE) -> np.ndarray:
    """
    Loads a full-disk H-alpha image (.png, .jpg, .jpeg, .tif, .tiff, .fits, .fit)
    as a contiguous uint8 grayscale matrix of shape target_shape (2048, 2048).
    Fails loudly instead of silently skipping unreadable or malformed files.
    """
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Solar image not found: {image_path}")

    ext = os.path.splitext(image_path)[1].lower()
    if ext in {".fits", ".fit"}:
        if _astropy_fits is None:
            raise ImportError(
                f"astropy is required to read FITS file '{image_path}'. Install with: pip install astropy"
            )
        with _astropy_fits.open(image_path, memmap=False) as hdul:
            data = None
            for hdu in hdul:
                if getattr(hdu, "data", None) is not None and np.ndim(hdu.data) >= 2:
                    data = np.asarray(hdu.data, dtype=np.float32)
                    break
            if data is None:
                raise ValueError(f"FITS file '{image_path}' contains no 2D image data")
            if data.ndim > 2:
                data = np.squeeze(data)
            if data.ndim != 2:
                raise ValueError(f"Expected 2D FITS image in '{image_path}', got shape {data.shape}")
            finite = np.isfinite(data)
            if not np.any(finite):
                raise ValueError(f"FITS image '{image_path}' contains no finite pixel values")
            vmin = float(np.percentile(data[finite], 0.5))
            vmax = float(np.percentile(data[finite], 99.5))
            if vmax <= vmin:
                img = np.zeros(data.shape, dtype=np.uint8)
            else:
                scaled = np.clip((data - vmin) / (vmax - vmin), 0.0, 1.0) * 255.0
                img = np.where(finite, scaled, 0.0).astype(np.uint8)
    else:
        if cv2 is None:
            raise ImportError("opencv-python-headless is required to load image files")
        img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
        if img is None:
            raise ValueError(f"Failed to decode image file '{image_path}' (cv2.imread returned None)")

    if img.shape != target_shape:
        if cv2 is None:
            raise ValueError(f"Image '{image_path}' shape {img.shape} != {target_shape} and cv2 unavailable to resize")
        img = cv2.resize(img, (target_shape[1], target_shape[0]), interpolation=cv2.INTER_AREA)

    return img


def correct_limb_darkening(image_gray: np.ndarray, center=(1024, 1024), radius=940, u=0.62) -> np.ndarray:
    """
    Applies Eddington linear limb darkening inversion:
    I(r) = I_0 * (1 - u * (1 - sqrt(1 - (r/R)^2)))
    """
    h, w = image_gray.shape
    y, x = np.ogrid[:h, :w]
    dist_from_center = np.sqrt((x - center[0]) ** 2 + (y - center[1]) ** 2)
    normalized_r = np.clip(dist_from_center / radius, 0.0, 1.0)

    mu = np.sqrt(np.maximum(0.0, 1.0 - normalized_r ** 2))
    darkening_factor = np.clip(1.0 - u * (1.0 - mu), 0.25, 1.0)

    corrected = image_gray.astype(np.float32) / darkening_factor
    disk_mask = dist_from_center <= (0.98 * radius)
    corrected[~disk_mask] = 0

    return np.clip(corrected, 0, 255).astype(np.uint8)


def compute_frangi_tubeness(
    image: np.ndarray,
    sigmas=(1.5, 3.0, 4.5, 7.0),
    valid_mask: Optional[np.ndarray] = None,
) -> np.ndarray:
    """
    Scale-normalized multiscale Hessian tubeness filter for isolating dark filament ribbons.
    Inverts dark ribbons so they appear as positive ridge structures across widths.
    """
    if hessian_matrix is None or hessian_matrix_eigvals is None:
        raise ImportError("scikit-image is required for compute_frangi_tubeness")

    inverted = 255.0 - image.astype(np.float32)
    max_response = np.zeros_like(inverted)

    for sigma in sigmas:
        H_elems = hessian_matrix(inverted, sigma=sigma, order='rc', use_gaussian_derivatives=False)
        lambda1, lambda2 = hessian_matrix_eigvals(H_elems)
        tubeness = (float(sigma) ** 2) * np.maximum(0.0, -lambda2)
        max_response = np.maximum(max_response, tubeness)

    if valid_mask is not None:
        max_response[~valid_mask] = 0.0

    peak = float(np.max(max_response))
    if peak < 3.0:
        return np.zeros(image.shape, dtype=np.uint8)
    norm_response = (max_response / peak * 255.0).astype(np.uint8)
    return norm_response


def segment_filament_instances(image_gray: np.ndarray) -> list:
    """
    Extracts mutually disjoint filament instance binary masks from full-disk solar image.
    """
    if cv2 is None or watershed is None or regionprops is None:
        raise ImportError("opencv-python-headless and scikit-image are required for segment_filament_instances")

    corr = correct_limb_darkening(image_gray)

    h, w = image_gray.shape
    y, x = np.ogrid[:h, :w]
    dist = np.sqrt((x - 1024) ** 2 + (y - 1024) ** 2)
    inner_disk = dist <= (0.95 * 940)

    clahe = cv2.createCLAHE(clipLimit=2.5, tileGridSize=(8, 8))
    enhanced = clahe.apply(corr)

    # Pad off-limb background with quiet-Sun median so the artificial disk boundary
    # does not create a circular step-edge artifact in the multiscale Hessian filter.
    disk_pixels = enhanced[inner_disk]
    if disk_pixels.size > 0:
        enhanced_for_hessian = enhanced.copy()
        enhanced_for_hessian[~inner_disk] = int(np.median(disk_pixels))
    else:
        enhanced_for_hessian = enhanced

    tubeness = compute_frangi_tubeness(enhanced_for_hessian, valid_mask=inner_disk)
    if not np.any(tubeness):
        return []

    thresh = cv2.adaptiveThreshold(
        tubeness, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 31, -5
    )
    thresh[~inner_disk] = 0

    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    cleaned = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel)
    cleaned = cv2.morphologyEx(cleaned, cv2.MORPH_CLOSE, kernel)
    cleaned[~inner_disk] = 0

    dist_transform = cv2.distanceTransform(cleaned, cv2.DIST_L2, 5)
    max_dist = float(dist_transform.max())
    if max_dist <= 0.0:
        return []

    _, markers_mask = cv2.threshold(dist_transform, 0.4 * max_dist, 255, 0)
    markers_mask = np.uint8(markers_mask)

    _, markers = cv2.connectedComponents(markers_mask)
    labeled_instances = watershed(-dist_transform, markers, mask=cleaned)

    instance_masks = []
    for region in regionprops(labeled_instances):
        if region.axis_major_length >= 20 and region.area >= 100:
            mask = (labeled_instances == region.label).astype(np.uint8)
            instance_masks.append(mask)

    return instance_masks


def mask_to_pycoco_rle(mask: np.ndarray) -> str:
    """
    Encodes binary mask into official pycocotools LEB128 compressed RLE string.
    Equivalent to: pycocotools.mask.encode(np.asfortranarray(mask))['counts'].decode('utf-8')
    """
    bin_mask = np.asfortranarray((mask > 0).astype(np.uint8))
    if bin_mask.ndim != 2:
        raise ValueError(f"Expected 2D mask, got shape {bin_mask.shape}")

    if _coco_mask_util is not None:
        encoded = _coco_mask_util.encode(bin_mask)
        counts = encoded["counts"]
        return counts.decode("utf-8") if isinstance(counts, bytes) else str(counts)

    flat = bin_mask.ravel(order='F')
    n = flat.size
    if n == 0:
        return ""

    diff_idx = np.flatnonzero(flat[1:] != flat[:-1]) + 1
    boundaries = np.concatenate(([0], diff_idx, [n]))
    run_lengths = np.diff(boundaries).tolist()
    counts = ([0] + run_lengths) if flat[0] == 1 else run_lengths

    chars = []
    for i, count in enumerate(counts):
        x = int(count)
        if i > 2:
            x -= int(counts[i - 2])
        more = True
        while more:
            c = x & 0x1F
            x >>= 5
            more = (x != -1) if (c & 0x10) else (x != 0)
            if more:
                c |= 0x20
            c += 48
            chars.append(chr(c))
    return "".join(chars)


def pycoco_rle_to_mask(coco_rle: str, shape: Tuple[int, int] = EXPECTED_SHAPE) -> np.ndarray:
    """
    Decodes official pycocotools LEB128 compressed RLE string into binary mask.
    Validates ASCII alphabet [48..111], non-truncation, non-negative counts, and exact total pixels.
    """
    height, width = shape
    expected_pixels = height * width
    if coco_rle is None or (isinstance(coco_rle, float) and np.isnan(coco_rle)):
        raise ValueError("Null/NaN RLE value cannot be decoded")

    s = str(coco_rle).strip()
    if not s:
        raise ValueError("Empty RLE string cannot be decoded as pycocotools compressed RLE")

    counts: List[int] = []
    p = 0
    m = 0
    n = len(s)
    while p < n:
        x = 0
        k = 0
        more = True
        while more:
            if p >= n:
                raise ValueError("Truncated pycocotools RLE stream: unexpected end of string in LEB128 varint")
            code = ord(s[p])
            if code < 48 or code > 111:
                raise ValueError(f"Invalid character '{s[p]}' (ASCII {code}) in pycocotools RLE; expected ASCII 48..111")
            c = code - 48
            p += 1
            x |= (c & 0x1F) << (5 * k)
            more = (c & 0x20) != 0
            k += 1
            if not more and (c & 0x10):
                x |= (-1 << (5 * k))
        if m > 2:
            x += counts[m - 2]
        if x < 0:
            raise ValueError(f"Corrupted pycocotools RLE: negative run length ({x})")
        counts.append(x)
        m += 1

    total_count = sum(counts)
    if total_count != expected_pixels:
        raise ValueError(
            f"RLE pixel count mismatch: decoded {total_count} pixels, expected {expected_pixels} for shape {shape}"
        )

    if _coco_mask_util is not None:
        decoded = _coco_mask_util.decode({"size": [height, width], "counts": s.encode("utf-8")})
        if decoded.shape != (height, width):
            raise ValueError(f"Decoded mask shape {decoded.shape} does not match expected {(height, width)}")
        return np.asfortranarray(decoded.astype(np.uint8))

    mask = np.zeros(expected_pixels, dtype=np.uint8)
    current_val = 0
    flat_idx = 0
    for count in counts:
        if current_val == 1 and count > 0:
            mask[flat_idx:flat_idx + count] = 1
        flat_idx += count
        current_val = 1 - current_val

    return mask.reshape((height, width), order='F')


def rle_to_mask_1indexed(rle: str, shape: Tuple[int, int] = EXPECTED_SHAPE) -> np.ndarray:
    """
    Decodes 1-indexed Fortran-order space-separated RLE pairs into binary mask.
    """
    h, w = shape
    expected_pixels = h * w
    if rle is None or (isinstance(rle, float) and np.isnan(rle)):
        return np.zeros((h, w), dtype=np.uint8, order='F')

    s = str(rle).strip()
    if not s:
        return np.zeros((h, w), dtype=np.uint8, order='F')

    raw_tokens = s.split()
    if len(raw_tokens) % 2 != 0:
        raise ValueError(f"1-indexed RLE must have an even number of tokens, got {len(raw_tokens)}")

    mask = np.zeros(expected_pixels, dtype=np.uint8)
    for i in range(0, len(raw_tokens), 2):
        start_tok = int(raw_tokens[i])
        length_tok = int(raw_tokens[i + 1])
        if start_tok < 1:
            raise ValueError(f"1-indexed RLE start must be >= 1, got {start_tok}")
        if length_tok <= 0:
            raise ValueError(f"1-indexed RLE length must be > 0, got {length_tok}")
        start = start_tok - 1
        if start + length_tok > expected_pixels:
            raise ValueError(
                f"1-indexed RLE run [{start_tok}, {start_tok + length_tok - 1}] exceeds image bounds {expected_pixels}"
            )
        mask[start:start + length_tok] = 1

    return mask.reshape((h, w), order='F')


def rle_to_mask_universal(rle: str, shape: Tuple[int, int] = EXPECTED_SHAPE) -> np.ndarray:
    """
    Universal decoder: auto-detects space-separated pairs vs official pycocotools compressed strings.
    """
    if rle is None or (isinstance(rle, float) and np.isnan(rle)) or not str(rle).strip():
        return np.zeros(shape, dtype=np.uint8, order='F')
    s = str(rle).strip()
    parts = s.split()
    if len(parts) >= 2 and all(part.isdigit() for part in parts):
        return rle_to_mask_1indexed(s, shape)
    return pycoco_rle_to_mask(s, shape)


def resolve_image_id(
    filament_id: str,
    known_image_ids: Optional[Set[str]] = None,
    explicit_mapping: Optional[Dict[str, str]] = None,
    enforce_official_single_underscore: bool = False,
) -> Tuple[str, int]:
    """
    Explicitly resolves (base_image_id, instance_index) from filament_id.
    When enforce_official_single_underscore=True, verifies compatibility with
    azimahmadzadeh/self-evaluation-notebook: str.split('_', n=1).str[0].
    """
    if filament_id is None or (isinstance(filament_id, float) and np.isnan(filament_id)):
        raise ValueError("Null/NaN filament_id encountered")

    fid = str(filament_id).strip()
    if not fid or any(ch.isspace() for ch in fid):
        raise ValueError(f"Invalid filament_id '{filament_id}': empty or contains whitespace")

    if "_fil_" in fid or "_test" in fid:
        raise ValueError(f"Prohibited substring ('_fil_' or '_test') in filament_id '{fid}'")

    if enforce_official_single_underscore:
        parts = fid.split("_", 1)
        if len(parts) != 2 or not re.fullmatch(r"[1-9]\d*", parts[1]):
            raise ValueError(
                f"filament_id '{fid}' is incompatible with official evaluator pred_df['filament_id'].str.split('_', n=1)"
            )

    if explicit_mapping is not None:
        if fid not in explicit_mapping:
            raise ValueError(f"filament_id '{fid}' missing from explicit image_id mapping")
        mapped_image_id = explicit_mapping[fid]
        prefix = f"{mapped_image_id}_"
        if not fid.startswith(prefix):
            raise ValueError(f"filament_id '{fid}' does not start with mapped image_id prefix '{prefix}'")
        suffix_str = fid[len(prefix):]
        if not re.fullmatch(r"[1-9]\d*", suffix_str):
            raise ValueError(f"filament_id '{fid}' has invalid instance suffix '{suffix_str}' for image '{mapped_image_id}'")
        return mapped_image_id, int(suffix_str)

    if known_image_ids is not None:
        for img_id in sorted(known_image_ids, key=len, reverse=True):
            prefix = f"{img_id}_"
            if fid.startswith(prefix):
                suffix_str = fid[len(prefix):]
                if re.fullmatch(r"[1-9]\d*", suffix_str):
                    return img_id, int(suffix_str)
        raise ValueError(f"Unknown or unmapped image_id in filament_id '{fid}'")

    m = _FILAMENT_ID_RE.match(fid)
    if not m:
        raise ValueError(f"Malformed filament_id '{fid}'. Expected '<image_id>_<positive_integer>'.")
    return m.group(1), int(m.group(2))


def validate_submission_csv(
    csv_path: str,
    expected_shape: Tuple[int, int] = EXPECTED_SHAPE,
    allowed_image_ids: Optional[Iterable[str]] = None,
    require_compressed_rle: bool = True,
    enforce_official_single_underscore: bool = False,
) -> dict:
    """
    Strict submission validator for Kaggle Solar Filament 2026 CSV files.
    """
    if not os.path.exists(csv_path):
        return {"is_valid": False, "errors": [f"File {csv_path} does not exist"], "warnings": []}

    file_size = os.path.getsize(csv_path)
    errors: List[str] = []
    warnings: List[str] = []

    if file_size == 0:
        return {"is_valid": False, "errors": [f"File {csv_path} is 0 bytes"], "warnings": []}

    with open(csv_path, "rb") as f:
        raw_bytes = f.read()

    if raw_bytes.startswith(b"\xef\xbb\xbf"):
        errors.append("File contains UTF-8 BOM; standard UTF-8 without BOM is required")
    if not raw_bytes.endswith(b"\n"):
        errors.append("File does not end with a POSIX terminal newline ('\\n')")

    try:
        raw_text = raw_bytes.decode("utf-8")
    except UnicodeDecodeError as ex:
        return {"is_valid": False, "errors": [f"Invalid UTF-8 encoding: {ex}"], "warnings": []}

    lines = raw_text.splitlines()
    if not lines:
        return {"is_valid": False, "errors": ["Submission CSV is empty"], "warnings": []}

    reader = csv.reader(lines)
    header = next(reader, None)
    if header != EXPECTED_COLUMNS:
        errors.append(f"Header columns must be exactly {EXPECTED_COLUMNS}, got {header}")

    csv_rows = list(reader)
    for r_i, row_vals in enumerate(csv_rows):
        if len(row_vals) != 2:
            errors.append(f"CSV row {r_i + 1} has {len(row_vals)} columns instead of 2 (possible quoting/comma issue)")

    try:
        df = pd.read_csv(csv_path, dtype=str, keep_default_na=True)
    except Exception as ex:
        errors.append(f"pandas.read_csv failed: {ex}")
        return {"is_valid": False, "errors": errors, "warnings": warnings}

    if list(df.columns) != EXPECTED_COLUMNS:
        errors.append(f"DataFrame columns must be exactly {EXPECTED_COLUMNS}, got {list(df.columns)}")
        return {"is_valid": False, "errors": errors, "warnings": warnings}

    if df["filament_id"].isnull().any():
        errors.append("filament_id column contains null/NaN values")
    if df["segmentation_rle"].isnull().any():
        errors.append("segmentation_rle column contains null/NaN values")

    if len(df) == len(csv_rows):
        for i, (csv_pair, (_, df_row)) in enumerate(zip(csv_rows, df.iterrows())):
            if len(csv_pair) == 2:
                df_fil = "" if pd.isna(df_row["filament_id"]) else str(df_row["filament_id"])
                df_rle = "" if pd.isna(df_row["segmentation_rle"]) else str(df_row["segmentation_rle"])
                if csv_pair[0] != df_fil or csv_pair[1] != df_rle:
                    errors.append(
                        f"Row {i}: csv.reader vs pandas.read_csv mismatch (possible unescaped backslash/quote corruption)"
                    )
                    break

    known_set = set(allowed_image_ids) if allowed_image_ids is not None else None
    seen_fil_ids: Set[str] = set()
    seen_img_ids: Set[str] = set()
    masks_by_img: Dict[str, List[np.ndarray]] = {}
    disjoint_ok = True

    for row_idx, row in df.iterrows():
        raw_fid = row["filament_id"]
        raw_rle = row["segmentation_rle"]

        if pd.isna(raw_fid):
            continue
        fil_id = str(raw_fid).strip()

        try:
            base_img_id, _ = resolve_image_id(
                fil_id,
                known_image_ids=known_set,
                enforce_official_single_underscore=enforce_official_single_underscore,
            )
            seen_img_ids.add(base_img_id)
        except ValueError as ex:
            errors.append(f"Row {row_idx}: {ex}")
            continue

        if fil_id in seen_fil_ids:
            errors.append(f"Duplicate filament_id detected: '{fil_id}'")
            continue
        seen_fil_ids.add(fil_id)

        if pd.isna(raw_rle) or not str(raw_rle).strip():
            errors.append(f"Row {row_idx}: empty segmentation_rle for '{fil_id}'")
            continue

        rle = str(raw_rle).strip()
        parts = rle.split()
        is_pairs = len(parts) >= 2 and all(p.isdigit() for p in parts)
        if is_pairs:
            if require_compressed_rle:
                errors.append(f"Row {row_idx}: RLE uses uncompressed 1-indexed pairs; compressed pycocotools RLE required")
                continue
            try:
                decoded_1idx = rle_to_mask_1indexed(rle, expected_shape)
                masks_by_img.setdefault(base_img_id, []).append(decoded_1idx)
            except Exception as ex:
                errors.append(f"Row {row_idx}: Invalid 1-indexed RLE ({ex})")
        else:
            try:
                decoded = pycoco_rle_to_mask(rle, expected_shape)
                re_encoded = mask_to_pycoco_rle(decoded)
                if re_encoded != rle:
                    errors.append(
                        f"Row {row_idx}: Non-canonical compressed RLE for '{fil_id}' (round-trip mismatch)"
                    )
                else:
                    masks_by_img.setdefault(base_img_id, []).append(decoded)
            except Exception as ex:
                errors.append(f"Row {row_idx}: Invalid pycocotools compressed RLE string ({ex})")

    for img_id, inst_masks in masks_by_img.items():
        if len(inst_masks) > 1:
            union_sum = np.zeros(expected_shape, dtype=np.uint16)
            for m in inst_masks:
                union_sum += m
            overlap_px = int((union_sum > 1).sum())
            if overlap_px > 0:
                disjoint_ok = False
                warnings.append(f"Image '{img_id}' has {overlap_px} overlapping pixel(s) across filament instances")

    return {
        "is_valid": len(errors) == 0,
        "row_count": len(df),
        "unique_filaments": len(seen_fil_ids),
        "image_ids_represented": sorted(seen_img_ids),
        "disjoint_instances_per_image": disjoint_ok,
        "errors": errors,
        "warnings": warnings,
    }


def evaluate_official_self_eval_pq(
    gt_df: pd.DataFrame,
    pred_df: pd.DataFrame,
    height: int = EXPECTED_SHAPE[0],
    width: int = EXPECTED_SHAPE[1],
    iou_threshold: float = 0.5,
) -> dict:
    """
    Faithful local implementation of the official Kaggle competition evaluation notebook:
    https://www.kaggle.com/code/azimahmadzadeh/self-evaluation-notebook
    Key official behaviors preserved:
    - Exact two columns: ["filament_id", "segmentation_rle"]
    - gt_annotator_image_ids = gt_df["filament_id"].str.split("_", n=1).str[0]
    - pred_image_ids = pred_df["filament_id"].str.split("_", n=1).str[0]
    - annotator_image splits "-" once to extract target image_id
    - Batch decode via pycocotools.mask.decode([{"size": [H, W], "counts": rle}, ...])
    - hit_matrix = iou_matrix > 0.5; PQ = sum(tp_iou_scores) / (TP + 0.5*FP + 0.5*FN)
    """
    if _coco_mask_util is None:
        raise ImportError("pycocotools is required for evaluate_official_self_eval_pq")
    for col in EXPECTED_COLUMNS:
        if col not in gt_df.columns:
            raise ValueError(f"gt_df missing required column '{col}'")
        if col not in pred_df.columns:
            raise ValueError(f"pred_df missing required column '{col}'")

    if len(pred_df) > 0:
        if pred_df["filament_id"].isnull().any() or pred_df["segmentation_rle"].isnull().any():
            raise ValueError("pred_df contains null/NaN values")
        pred_image_ids = pred_df["filament_id"].astype(str).str.split("_", n=1).str[0]
    else:
        pred_image_ids = pd.Series(dtype=str)

    gt_annotator_image_ids = gt_df["filament_id"].astype(str).str.split("_", n=1).str[0]
    annotator_images = gt_annotator_image_ids.unique()

    def _rles_to_layers(rles: List[str]) -> np.ndarray:
        if not rles:
            return np.zeros((0, height, width), dtype=np.float32)
        rle_dicts = [{"size": [height, width], "counts": str(rle)} for rle in rles]
        masks = _coco_mask_util.decode(rle_dicts)
        return masks.transpose(2, 0, 1).astype(np.float32)

    tp_iou_scores: List[float] = []
    fp_count = 0
    fn_count = 0

    for annotator_image in annotator_images:
        image_id = annotator_image.split("-", maxsplit=1)[1] if "-" in annotator_image else annotator_image
        gt_rles = gt_df.loc[gt_annotator_image_ids == annotator_image, "segmentation_rle"].tolist()
        pred_rles = (
            pred_df.loc[pred_image_ids == image_id, "segmentation_rle"].tolist()
            if len(pred_df) > 0
            else []
        )
        n_gt = len(gt_rles)
        n_pred = len(pred_rles)

        if n_gt == 0:
            fp_count += n_pred
            continue
        if n_pred == 0:
            fn_count += n_gt
            continue

        gt_layers = _rles_to_layers(gt_rles)
        pred_layers = _rles_to_layers(pred_rles)

        gt_flat = gt_layers.reshape(n_gt, height * width)
        pred_flat = pred_layers.reshape(n_pred, height * width)
        intersection = gt_flat @ pred_flat.T
        gt_areas = gt_flat.sum(axis=1, keepdims=True)
        pred_areas = pred_flat.sum(axis=1, keepdims=True).T
        union = gt_areas + pred_areas - intersection
        iou_matrix = np.where(union == 0, 0.0, intersection / np.maximum(union, 1e-12))

        hit_matrix = iou_matrix > iou_threshold
        tp_iou_scores.extend(iou_matrix[hit_matrix].tolist())
        fp_count += int((hit_matrix.sum(axis=0) == 0).sum())
        fn_count += int((hit_matrix.sum(axis=1) == 0).sum())

    tp_count = len(tp_iou_scores)
    denominator = tp_count + 0.5 * fp_count + 0.5 * fn_count
    pq_score = float(sum(tp_iou_scores) / denominator) if denominator > 0 else 0.0
    return {
        "pq_score": pq_score,
        "tp_count": tp_count,
        "fp_count": fp_count,
        "fn_count": fn_count,
        "annotator_images_evaluated": len(annotator_images),
    }


def calculate_panoptic_quality(pred_masks: list, gt_masks: list, iou_threshold: float = 0.5) -> dict:
    """
    Official Panoptic Quality: PQ = SQ * RQ
    Bipartite matching threshold: IoU > 0.5
    Guarantees unique matches (Kirillov et al. 2019).
    Includes zero-division and empty slice protections.
    """
    num_gt = len(gt_masks)
    num_pred = len(pred_masks)
    if num_gt == 0 and num_pred == 0:
        return {'pq': 1.0, 'sq': 1.0, 'rq': 1.0, 'tp': 0, 'fp': 0, 'fn': 0}
    if num_pred == 0:
        return {'pq': 0.0, 'sq': 0.0, 'rq': 0.0, 'tp': 0, 'fp': 0, 'fn': num_gt}
    if num_gt == 0:
        return {'pq': 0.0, 'sq': 0.0, 'rq': 0.0, 'tp': 0, 'fp': num_pred, 'fn': 0}

    iou_matrix = np.zeros((num_pred, num_gt), dtype=np.float64)
    for p_idx, pred in enumerate(pred_masks):
        if pred.shape != gt_masks[0].shape:
            raise ValueError(f"Prediction mask shape {pred.shape} does not match ground truth {gt_masks[0].shape}")
        for g_idx, gt in enumerate(gt_masks):
            if pred.shape != gt.shape:
                raise ValueError(f"Mask dimension mismatch: pred={pred.shape}, gt={gt.shape}")
            intersection = np.logical_and(pred, gt).sum()
            union = np.logical_or(pred, gt).sum()
            if union > 0:
                iou_matrix[p_idx, g_idx] = float(intersection) / float(union)

    matched_gt: Set[int] = set()
    matched_pred: Set[int] = set()
    iou_sum = 0.0
    tp = 0

    while True:
        best_iou = 0.0
        best_p, best_g = -1, -1
        for p_idx in range(num_pred):
            if p_idx in matched_pred:
                continue
            for g_idx in range(num_gt):
                if g_idx in matched_gt:
                    continue
                val = float(iou_matrix[p_idx, g_idx])
                if val > best_iou:
                    best_iou = val
                    best_p, best_g = p_idx, g_idx
        if best_iou > iou_threshold:
            matched_pred.add(best_p)
            matched_gt.add(best_g)
            tp += 1
            iou_sum += best_iou
        else:
            break

    fp = num_pred - tp
    fn = num_gt - tp
    sq = float(iou_sum / tp) if tp > 0 else 0.0
    denom = tp + 0.5 * fp + 0.5 * fn
    rq = float(tp / denom) if denom > 0 else 0.0
    pq = float(sq * rq)

    return {'pq': pq, 'sq': sq, 'rq': rq, 'tp': tp, 'fp': fp, 'fn': fn}


def evaluate_competition_submission(
    solution_df: pd.DataFrame,
    submission_df: pd.DataFrame,
    image_shape: Tuple[int, int] = EXPECTED_SHAPE,
    explicit_image_map: Optional[Dict[str, str]] = None,
) -> dict:
    """
    Evaluates competition submission DataFrame against ground-truth solution DataFrame.
    Uses explicit known ground-truth image_id mapping, rejects unknown image IDs,
    duplicate filament IDs, invalid RLEs, and wrong mask dimensions.
    """
    for c in EXPECTED_COLUMNS:
        if c not in solution_df.columns:
            raise ValueError(f"Solution missing required column '{c}'")
        if c not in submission_df.columns:
            raise ValueError(f"Submission missing required column '{c}'")

    sol = solution_df.copy()
    if sol['filament_id'].isnull().any():
        raise ValueError("Solution contains null filament_id values")

    if 'image_id' in sol.columns:
        sol['image_id'] = sol['image_id'].astype(str)
    else:
        sol['image_id'] = sol['filament_id'].apply(lambda x: resolve_image_id(str(x), explicit_mapping=explicit_image_map)[0])

    known_image_ids: Set[str] = set(sol['image_id'].unique())

    sub = submission_df.copy()
    if len(sub) > 0:
        if sub['filament_id'].isnull().any():
            raise ValueError("Submission contains null/NaN filament_id values")
        if sub['filament_id'].duplicated().any():
            dups = sub[sub['filament_id'].duplicated()]['filament_id'].tolist()
            raise ValueError(f"Duplicate filament_id detected in submission: {dups[:5]}")

        sub['image_id'] = sub['filament_id'].apply(
            lambda x: resolve_image_id(str(x), known_image_ids=known_image_ids, explicit_mapping=explicit_image_map)[0]
        )
    else:
        sub['image_id'] = pd.Series(dtype=str)

    image_ids = sorted(known_image_ids)
    image_pqs = []
    tot_tp, tot_fp, tot_fn = 0, 0, 0

    for img_id in image_ids:
        gt_rows = sol[sol['image_id'] == img_id]
        gt_masks = [
            rle_to_mask_universal(str(r), shape=image_shape)
            for r in gt_rows['segmentation_rle']
            if pd.notna(r) and str(r).strip()
        ]

        sub_rows = sub[sub['image_id'] == img_id]
        pred_masks = [
            rle_to_mask_universal(str(r), shape=image_shape)
            for r in sub_rows['segmentation_rle']
            if pd.notna(r) and str(r).strip()
        ]

        res = calculate_panoptic_quality(pred_masks, gt_masks)
        image_pqs.append(res['pq'])
        tot_tp += res['tp']
        tot_fp += res['fp']
        tot_fn += res['fn']

    mean_pq = float(np.mean(image_pqs)) if image_pqs else 0.0
    return {
        'mean_pq': mean_pq,
        'image_count': len(image_ids),
        'total_tp': tot_tp,
        'total_fp': tot_fp,
        'total_fn': tot_fn,
    }


def export_predictions_to_csv(
    predictions_by_image: Sequence[Tuple[str, Sequence[np.ndarray]]],
    output_path: str,
    valid_image_ids: Optional[Set[str]] = None,
) -> pd.DataFrame:
    """
    Exports predicted binary masks per original image_id to two-column Kaggle CSV:
    filament_id,segmentation_rle
    """
    rows: List[Dict[str, str]] = []
    seen_fids: Set[str] = set()

    for orig_image_id, masks in predictions_by_image:
        img_id = str(orig_image_id).strip()
        if not img_id:
            raise ValueError("Empty image_id encountered during export")
        if valid_image_ids is not None and img_id not in valid_image_ids:
            raise ValueError(f"Unknown image_id '{img_id}' not present in official test image registry")
        if "_fil_" in img_id or "_test" in img_id:
            raise ValueError(f"Prohibited image_id '{img_id}' contains '_fil_' or '_test'")

        for idx, m in enumerate(masks):
            fil_id = f"{img_id}_{idx + 1}"
            if fil_id in seen_fids:
                raise ValueError(f"Duplicate filament_id generated during export: '{fil_id}'")
            seen_fids.add(fil_id)
            rle = mask_to_pycoco_rle(m)
            rows.append({"filament_id": fil_id, "segmentation_rle": rle})

    df = pd.DataFrame(rows, columns=EXPECTED_COLUMNS)
    df.to_csv(output_path, index=False, encoding="utf-8", lineterminator="\n")
    return df


def run_test_directory_inference(
    input_dir: str,
    output_path: str,
    image_map: Optional[Dict[str, str]] = None,
    sample_submission_path: Optional[str] = None,
    allow_failed: bool = False,
) -> dict:
    """
    Runs full-directory inference across all test H-alpha images (.png, .jpg, .jpeg, .tif, .tiff, .fits, .fit),
    exports two-column submission.csv, and validates the written CSV back from disk.
    """
    if not os.path.isdir(input_dir):
        raise FileNotFoundError(f"Test image directory not found: {input_dir}")

    valid_ids: Optional[Set[str]] = None
    if sample_submission_path and os.path.exists(sample_submission_path):
        sample_df = pd.read_csv(sample_submission_path, dtype=str)
        if "image_id" in sample_df.columns:
            valid_ids = set(sample_df["image_id"].dropna().astype(str))
        elif "filament_id" in sample_df.columns:
            valid_ids = {str(x).split("_", 1)[0] for x in sample_df["filament_id"].dropna()}

    supported_exts = (".png", ".jpg", ".jpeg", ".tif", ".tiff", ".fits", ".fit")
    files = sorted([f for f in os.listdir(input_dir) if f.lower().endswith(supported_exts)])
    if not files:
        raise ValueError(f"No supported solar images found in '{input_dir}'")

    predictions: List[Tuple[str, List[np.ndarray]]] = []
    failed_files: List[Tuple[str, str]] = []
    predicted_images = 0
    zero_filament_images = 0

    for f in files:
        img_path = os.path.join(input_dir, f)
        try:
            img = load_solar_grayscale_image(img_path, target_shape=EXPECTED_SHAPE)
            masks = segment_filament_instances(img)
        except Exception as ex:
            failed_files.append((f, str(ex)))
            if not allow_failed:
                raise RuntimeError(f"Failed processing test image '{img_path}': {ex}") from ex
            continue

        base_id = (image_map or {}).get(f, os.path.splitext(f)[0])
        if masks:
            predicted_images += 1
        else:
            zero_filament_images += 1
        predictions.append((base_id, masks))

    df = export_predictions_to_csv(predictions, output_path, valid_image_ids=valid_ids)
    disk_validation = validate_submission_csv(
        output_path,
        expected_shape=EXPECTED_SHAPE,
        allowed_image_ids=valid_ids,
        require_compressed_rle=True,
    )
    if not disk_validation["is_valid"]:
        raise RuntimeError(f"Written submission failed disk validation: {disk_validation['errors']}")

    return {
        "total_test_images": len(files),
        "processed_images": len(predictions),
        "predicted_images": predicted_images,
        "zero_filament_images": zero_filament_images,
        "failed_images": failed_files,
        "total_instances": len(df),
        "output_path": output_path,
        "disk_validation": disk_validation,
    }


def main():
    parser = argparse.ArgumentParser(description="Solar Filament Segmentation CLI")
    parser.add_argument("--input-dir", type=str, default=None, help="Directory with test images")
    parser.add_argument("--image-map", type=str, default=None, help="Optional JSON mapping filename -> original image_id")
    parser.add_argument("--sample-submission", type=str, default=None, help="Optional sample_submission.csv path for image_id verification")
    parser.add_argument("--output", type=str, default="submission.csv", help="Output submission CSV path")
    parser.add_argument("--allow-failed", action="store_true", help="Record failed test images without aborting")
    args = parser.parse_args()

    dir_candidates = [
        args.input_dir,
        "/kaggle/input/filament-segmentation-2026/test",
        "data/test",
        "dataset/test",
    ]
    input_dir = next((d for d in dir_candidates if d and os.path.isdir(d)), None)
    if not input_dir:
        raise SystemExit(
            "ERROR: No test image directory found. Pass --input-dir <path_to_kaggle_test_images> "
            "or run inside Kaggle Notebooks with /kaggle/input/filament-segmentation-2026/test mounted."
        )

    sample_candidates = [
        args.sample_submission,
        "/kaggle/input/filament-segmentation-2026/sample_submission.csv",
        "data/sample_submission.csv",
        "dataset/sample_submission.csv",
    ]
    sample_sub = next((p for p in sample_candidates if p and os.path.exists(p)), None)

    image_map: Dict[str, str] = {}
    if args.image_map and os.path.exists(args.image_map):
        with open(args.image_map, "r", encoding="utf-8") as mf:
            image_map = json.load(mf)

    summary = run_test_directory_inference(
        input_dir=input_dir,
        output_path=args.output,
        image_map=image_map,
        sample_submission_path=sample_sub,
        allow_failed=args.allow_failed,
    )
    print(json.dumps({
        "total_test_images": summary["total_test_images"],
        "processed_images": summary["processed_images"],
        "predicted_images": summary["predicted_images"],
        "zero_filament_images": summary["zero_filament_images"],
        "failed_images": summary["failed_images"],
        "total_instances": summary["total_instances"],
        "output_path": summary["output_path"],
        "disk_validation_passed": summary["disk_validation"]["is_valid"],
    }, indent=2))


if __name__ == "__main__":
    main()
