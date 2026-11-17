import pandas as pd
import pycocotools.mask as mask_util
import numpy as np

print("Testing public/submission.csv with pandas and pycocotools...")
df = pd.read_csv("public/submission.csv")
print("Dataframe shape:", df.shape)
print(df)

for idx, row in df.iterrows():
    fil_id = row['filament_id']
    rle = row['segmentation_rle']
    print(f"\nRow {idx}: {fil_id}")
    print(f"RLE raw length: {len(rle)}, content: {repr(rle)}")
    try:
        # Note: in Python pycocotools mask.decode expects counts as str or bytes depending on pycocotools
        # Standard pycocotools expects bytes or str:
        counts = rle.encode('utf-8') if isinstance(rle, str) else rle
        decoded = mask_util.decode({'size': [2048, 2048], 'counts': counts})
        print(f"Decoded shape: {decoded.shape}, sum: {decoded.sum()}, dtype: {decoded.dtype}, F_contiguous: {decoded.flags.f_contiguous}")
    except Exception as e:
        print(f"FAILED to decode: {e}")
