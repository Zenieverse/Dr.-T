"""
================================================================================
KAGGLE KAGGRICULTURE — STRATEGY & DYNAMIC ARBITRAGE MODULE
================================================================================
"""

from typing import Dict, Any, List

CROP_SPECS = {
    "WHEAT": {"seed_cost": 5, "base_sell": 18, "growth_turns": 6, "water_threshold": 30, "water_per_turn": 2, "fertilizer_multiplier": 1.4, "early_priority": 10},
    "CORN": {"seed_cost": 12, "base_sell": 44, "growth_turns": 10, "water_threshold": 35, "water_per_turn": 3, "fertilizer_multiplier": 1.5, "early_priority": 8},
    "CARROT": {"seed_cost": 8, "base_sell": 30, "growth_turns": 8, "water_threshold": 30, "water_per_turn": 2, "fertilizer_multiplier": 1.45, "early_priority": 7},
    "TOMATO": {"seed_cost": 20, "base_sell": 82, "growth_turns": 14, "water_threshold": 40, "water_per_turn": 4, "fertilizer_multiplier": 1.6, "early_priority": 6},
    "MELON": {"seed_cost": 35, "base_sell": 155, "growth_turns": 18, "water_threshold": 45, "water_per_turn": 4, "fertilizer_multiplier": 1.75, "early_priority": 9},
    "PUMPKIN": {"seed_cost": 45, "base_sell": 210, "growth_turns": 24, "water_threshold": 50, "water_per_turn": 5, "fertilizer_multiplier": 1.85, "early_priority": 9},
    "STAR_HERB": {"seed_cost": 30, "base_sell": 140, "growth_turns": 16, "water_threshold": 40, "water_per_turn": 3, "fertilizer_multiplier": 1.7, "early_priority": 8}
}

def calculate_crop_roi(crop_name: str, turns_left: int, funds: float, market_prices: Dict[str, float]) -> float:
    spec = CROP_SPECS.get(crop_name)
    if not spec:
        return -999.0
    if spec["growth_turns"] + 1 > turns_left:
        return -1000.0
    
    expected_sell = market_prices.get(crop_name, spec["base_sell"])
    net_profit = (expected_sell * spec["fertilizer_multiplier"]) - spec["seed_cost"]
    profit_per_turn = net_profit / spec["growth_turns"]
    cycles = turns_left // spec["growth_turns"]
    total_profit = cycles * net_profit
    
    liquidity = 1.2 if funds < 80 and spec["growth_turns"] <= 8 else 1.0
    return (profit_per_turn * 0.6 + total_profit * 0.4) * liquidity
