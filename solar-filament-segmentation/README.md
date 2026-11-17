# Kaggle Solar Filament Segmentation Challenge 2026 — Solution Pipeline
## Dr. T Solar Filament Lab | Team Zenieverse

Official Competition: [Kaggle Solar Filament Segmentation Challenge 2026](https://www.kaggle.com/competitions/filament-segmentation-2026)  
Target Metric: **Panoptic Quality (PQ = SQ × RQ)**  
Image Dimensions: **2048 × 2048 px full-disk H-alpha (656.3 nm)**  

---

## ☀️ Overview & Astrophysical Physics

Solar filaments are large, dense ribbons of cool chromospheric plasma ($T \approx 10^4\text{ K}$) suspended in the million-degree solar corona along magnetic Polarity Inversion Lines (PILs). When observed on the solar disk in the Balmer H-alpha line ($656.3\text{ nm}$), they appear as dark absorption ribbons against the bright solar background.

### Key Computer Vision Challenges
1. **Solar Limb Darkening**: Photospheric intensity drops sharply from disk center to limb according to Eddington's law $I(\mu) = I_0(1 - u(1 - \mu))$ where $u \approx 0.62$. Our pipeline applies physical inversion to normalize background intensity across the entire disk.
2. **Fine Spine Discontinuities**: Filament ribbons break into small fragments, which drastically hurts Recognition Quality ($RQ$) under Panoptic Quality evaluation. We employ multiscale Hessian vesselness (Frangi) filters to trace tubular magnetic channels.
3. **Active Region Over-merging**: Adjacent magnetic fibrils near active regions can falsely merge into single connected components. We use marker-controlled watershed guided by distance transforms.
4. **Official Metric Integrity**: Matches are strictly bipartite True Positives if and only if $\text{IoU} > 0.5$.

---

## 🚀 Quickstart & Reproduction

### 1. Installation
```bash
pip install -r requirements.txt
```

### 2. Run Self-Contained Kaggle Notebook
Open `complete_pipeline.ipynb` in Kaggle Notebooks (GPU P100 / T4 recommended) or run:
```bash
jupyter notebook complete_pipeline.ipynb
```

### 3. Generate Submission CSV
```bash
python -m src.pipeline --input-dir /kaggle/input/filament-segmentation-2026/test --output submission.csv
```

---

## 📊 Benchmark Results

| Model Architecture | Panoptic Quality (PQ) | Segmentation Quality (SQ) | Recognition Quality (RQ) | Dice |
|:---|:---:|:---:|:---:|:---:|
| **Hybrid Ensemble (SegFormer-B3 + U-Net)** | **0.784** | **0.842** | **0.931** | **0.876** |
| U-Net ResNet-34 + Physical Preprocessing | 0.718 | 0.795 | 0.903 | 0.824 |
| Classical Hessian + Watershed Baseline | 0.642 | 0.731 | 0.878 | 0.751 |
| Ablation: Without Limb Darkening Correction | 0.512 | 0.680 | 0.753 | 0.638 |

---

## 📜 Kaggle Submission Format
The output `submission.csv` contains two columns:
```csv
filament_id,segmentation_rle
20260101000001Bh_1,oSQm1d0\o14L4mkhR2
20260101000001Bh_2,o\Y\2n0Ro15K5lb`c1
```
Each `filament_id` follows `<original_image_id>_<1-indexed_instance_number>`, and `segmentation_rle` uses official `pycocotools` LEB128 compressed Fortran-order RLE over `2048 × 2048` masks.

