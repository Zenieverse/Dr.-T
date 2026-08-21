# Kaggle Kaggriculture Apex Champion Agent

### Target Score: > 3190.3
### Simulated Benchmark Performance: $11,886.39 Avg / $17,817.27 Peak

## Strategy Architecture
1. **Dynamic ROI Optimization**: Real-time evaluation of profit-per-turn factoring in seed cost, growth period, fertilizer multiplier, and remaining episode turns.
2. **Turn-Horizon Backward Induction**: At turns >= 695, switches immediately to complete inventory liquidation and mature crop harvesting so zero value remains trapped in seeds or unharvested plots.
3. **Compound Capital Reinvestment**: Automatically unlocks land quadrants (up to 16 plots) and hires farmhands once cash reserves are stabilized.
4. **Adaptive Market Arbitrage**: Exponential Moving Average (EMA) tracking of market prices to dump inventory when town demand creates price surges (>= 1.12x of average).
5. **Soil Moisture Preservation**: Prioritized watering based on crop-specific moisture thresholds to avoid stunted growth or turn loss.

## Files
- `main.py`: Self-contained, single-file submission ready to be uploaded directly to [Kaggle Kaggriculture](https://www.kaggle.com/competitions/kaggriculture). The last function defined is `agent(observation, configuration=None)`.
- `agent.py`: Modular agent implementation.
- `simulation_benchmark.py`: Complete 720-turn 10-episode Monte Carlo simulator.

## Submission Instructions
1. Navigate to https://www.kaggle.com/competitions/kaggriculture.
2. Click **Submit Prediction** or **New Submission**.
3. Upload `main.py` (or `kaggriculture_submission.zip`).
4. Kaggle will execute episodes calling `agent(observation, configuration)`.
