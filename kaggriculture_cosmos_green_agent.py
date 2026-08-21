#!/usr/bin/env python3
"""
===============================================================================
KAGGLE KAGGRICULTURE COMPETITION — COSMOS GREEN AUTONOMOUS AGENT
Submission Target: https://www.kaggle.com/competitions/kaggriculture
Competition Format: Turn-based Farming Simulation (30 days / 720 turns)
===============================================================================
Zero-dependency, high-performance rule-based & dynamic heuristic agent that:
1. Maximizes season-long net profit (funds + inventory valuation).
2. Optimizes Crop ROI per turn with time-to-season-end decay.
3. Dynamically times market sales during price & demand surges.
4. Manages multi-plot crop lifecycle (Harvest -> Water -> Fertilize -> Plant).
5. Automates livestock care and animal yield collection.
6. Executes end-season liquidation in final turns (T > 700).
===============================================================================
The LAST function defined in this file is `agent(observation, configuration)`
which complies with Kaggle Simulation Environment requirements.
===============================================================================
"""

import sys
import math
import json
from typing import Dict, List, Any, Optional, Union, Tuple

# Default Crop Parameters & Growth Dynamics (Kaggriculture Standard)
CROP_SPECS = {
    "WHEAT": {
        "seed_cost": 5,
        "base_sell": 18,
        "growth_turns": 6,
        "water_need": 2,
        "yield_base": 1.0,
        "category": "Grain"
    },
    "CORN": {
        "seed_cost": 12,
        "base_sell": 42,
        "growth_turns": 10,
        "water_need": 3,
        "yield_base": 1.2,
        "category": "Grain"
    },
    "CARROT": {
        "seed_cost": 8,
        "base_sell": 28,
        "growth_turns": 8,
        "water_need": 2,
        "yield_base": 1.1,
        "category": "Vegetable"
    },
    "TOMATO": {
        "seed_cost": 20,
        "base_sell": 75,
        "growth_turns": 14,
        "water_need": 4,
        "yield_base": 1.3,
        "category": "Vegetable"
    },
    "PUMPKIN": {
        "seed_cost": 45,
        "base_sell": 180,
        "growth_turns": 24,
        "water_need": 5,
        "yield_base": 1.5,
        "category": "Gourd"
    },
    "STAR_HERB": {
        "seed_cost": 30,
        "base_sell": 125,
        "growth_turns": 16,
        "water_need": 3,
        "yield_base": 1.4,
        "category": "Bio-Herbal"
    }
}

ANIMAL_SPECS = {
    "CHICKEN": {"cost": 50, "product": "EGG", "produce_freq": 2, "product_price": 8, "feed_cost": 1},
    "COW": {"cost": 200, "product": "MILK", "produce_freq": 3, "product_price": 32, "feed_cost": 3},
    "SHEEP": {"cost": 150, "product": "WOOL", "produce_freq": 4, "product_price": 40, "feed_cost": 2},
    "GOOSE": {"cost": 80, "product": "FEATHER", "produce_freq": 3, "product_price": 18, "feed_cost": 1.5}
}


class CosmosGreenEngine:
    """
    Cosmos Green Autonomous Decision Engine for Kaggle Kaggriculture.
    Maintains internal history, market price moving averages, and action queues.
    """
    def __init__(self):
        self.step = 0
        self.max_steps = 720  # 30 days * 24 turns
        self.price_history: Dict[str, List[float]] = {}
        self.planned_actions_queue: List[str] = []
        self.farmhands_count = 1
        self.hired_farmhands = False

    def update_market_history(self, market_data: Dict[str, Any]):
        """Tracks moving averages of commodity and seed prices."""
        for item, price in market_data.items():
            if isinstance(price, (int, float)):
                if item not in self.price_history:
                    self.price_history[item] = []
                self.price_history[item].append(float(price))
                if len(self.price_history[item]) > 40:
                    self.price_history[item].pop(0)

    def get_price_surge_ratio(self, item: str, current_price: float) -> float:
        """Determines if the current price is significantly above historical mean."""
        history = self.price_history.get(item, [])
        if not history or len(history) < 3:
            return 1.0
        avg_price = sum(history) / len(history)
        if avg_price <= 0:
            return 1.0
        return current_price / avg_price

    def calculate_crop_roi_score(self, crop_name: str, funds: float, turns_remaining: int, market: Dict[str, Any]) -> float:
        """
        Computes expected profit per turn for a crop, factoring in turns left in season.
        """
        spec = CROP_SPECS.get(crop_name)
        if not spec:
            return -999.0

        growth = spec["growth_turns"]
        # If crop cannot mature before season ends, discard it
        if growth + 1 > turns_remaining:
            return -1000.0

        seed_cost = spec["seed_cost"]
        if funds < seed_cost:
            return -500.0

        # Current or base selling price
        sell_price = market.get(crop_name, spec["base_sell"])
        if isinstance(sell_price, dict):
            sell_price = sell_price.get("price", spec["base_sell"])

        water_cost_estimate = spec["water_need"] * 0.5
        expected_revenue = sell_price * spec["yield_base"]
        net_profit = expected_revenue - seed_cost - water_cost_estimate

        # Profit efficiency per turn
        profit_per_turn = net_profit / float(max(1, growth))

        # Favor high-turnover crops in early/mid game, fast crops in late game
        if turns_remaining < 60 and growth > 12:
            profit_per_turn *= 0.5
        elif turns_remaining >= 200 and growth >= 10:
            profit_per_turn *= 1.25  # High-yield compounds over long horizons

        return profit_per_turn

    def select_best_crop_to_plant(self, funds: float, turns_remaining: int, market: Dict[str, Any]) -> Optional[str]:
        """Chooses optimal crop based on calculated ROI scores."""
        best_crop = None
        best_score = -999.0

        for crop_name in CROP_SPECS:
            score = self.calculate_crop_roi_score(crop_name, funds, turns_remaining, market)
            if score > best_score and score > 0:
                best_score = score
                best_crop = crop_name

        return best_crop

    def parse_observation(self, obs: Any) -> Dict[str, Any]:
        """Robust parser for diverse Kaggle environment observation formats."""
        parsed = {
            "step": 0,
            "funds": 100.0,
            "plots": [],
            "inventory": {},
            "market": {},
            "animals": [],
            "farmhands": 1,
            "weather": "Sunny"
        }

        # If observation is wrapped in object or dict
        if isinstance(obs, dict):
            raw = obs
        elif hasattr(obs, "__dict__"):
            raw = obs.__dict__
        elif isinstance(obs, str):
            try:
                raw = json.loads(obs)
            except Exception:
                raw = {}
        else:
            raw = {}

        # Handle nested wrappers like obs['observation']
        if "observation" in raw and isinstance(raw["observation"], dict):
            raw = raw["observation"]

        parsed["step"] = int(raw.get("step", raw.get("turn", self.step)))
        parsed["funds"] = float(raw.get("funds", raw.get("cash", raw.get("money", raw.get("balance", 100.0)))))
        parsed["plots"] = raw.get("plots", raw.get("grid", raw.get("farm", raw.get("land", []))))
        parsed["inventory"] = raw.get("inventory", raw.get("items", raw.get("seeds", {})))
        parsed["market"] = raw.get("market", raw.get("prices", {}))
        parsed["animals"] = raw.get("animals", raw.get("livestock", []))
        parsed["farmhands"] = int(raw.get("farmhands", raw.get("workers", 1)))
        parsed["weather"] = raw.get("weather", "Sunny")

        # Standardize plots if list of simple dicts/tuples
        standardized_plots = []
        if isinstance(parsed["plots"], list):
            for i, p in enumerate(parsed["plots"]):
                if isinstance(p, dict):
                    plot_data = {
                        "id": p.get("id", i),
                        "crop": p.get("crop", p.get("crop_type", None)),
                        "stage": p.get("stage", "empty"),
                        "growth": p.get("growth", p.get("growth_progress", 0)),
                        "water": p.get("water", p.get("water_level", 50)),
                        "fertilized": p.get("fertilized", False)
                    }
                    standardized_plots.append(plot_data)
                else:
                    # Fallback simple plot
                    standardized_plots.append({
                        "id": i,
                        "crop": None,
                        "stage": "empty",
                        "growth": 0,
                        "water": 50,
                        "fertilized": False
                    })
        elif isinstance(parsed["plots"], int):
            # Number of plots given
            for i in range(parsed["plots"]):
                standardized_plots.append({
                    "id": i,
                    "crop": None,
                    "stage": "empty",
                    "growth": 0,
                    "water": 50,
                    "fertilized": False
                })
        else:
            # Default 4 starting plots
            for i in range(4):
                standardized_plots.append({
                    "id": i,
                    "crop": None,
                    "stage": "empty",
                    "growth": 0,
                    "water": 50,
                    "fertilized": False
                })

        parsed["plots"] = standardized_plots
        return parsed

    def decide_action(self, obs_data: Dict[str, Any]) -> Union[str, Dict[str, Any]]:
        """
        Core prioritized decision loop:
        1. End-Game Liquidation (Turns > 700) -> Sell all goods.
        2. Harvest all mature crops.
        3. Water parched/growing crops.
        4. Fertilize high-value crops.
        5. Plant available seeds on empty plots.
        6. Buy best seeds if empty plots exist and funds allow.
        7. Feed & collect animal products.
        8. Sell accumulated harvest & animal products on market surges.
        9. Hire farmhands or buy land expansion if wealthy.
        """
        step = obs_data["step"]
        self.step = step
        turns_left = max(1, self.max_steps - step)
        funds = obs_data["funds"]
        plots = obs_data["plots"]
        inventory = obs_data["inventory"]
        market = obs_data["market"]
        animals = obs_data["animals"]

        # Track price dynamics
        self.update_market_history(market)

        # -------------------------------------------------------------
        # 1. END-GAME LIQUIDATION PHASE (Final 20 turns: step >= 700)
        # -------------------------------------------------------------
        if turns_left <= 20:
            # Sell any harvested produce or animal goods in inventory immediately
            for item, count in inventory.items():
                if isinstance(count, (int, float)) and count > 0:
                    if not item.endswith("_SEED") and item != "FERTILIZER" and item != "FEED":
                        return f"SELL {item} {int(count)}"

            # Harvest any mature plots
            for p in plots:
                if p["stage"] in ("mature", "ready") or p["growth"] >= 100:
                    return f"HARVEST {p['id']}"

        # -------------------------------------------------------------
        # 2. PRIORITY 1: HARVEST MATURE CROPS
        # -------------------------------------------------------------
        for p in plots:
            if p["stage"] in ("mature", "ready") or p["growth"] >= 100:
                return f"HARVEST {p['id']}"

        # -------------------------------------------------------------
        # 3. PRIORITY 2: WATER DRY PLOTS
        # -------------------------------------------------------------
        for p in plots:
            if p["crop"] is not None and p["stage"] in ("planted", "growing"):
                if p["water"] < 35:
                    return f"WATER {p['id']}"

        # -------------------------------------------------------------
        # 4. PRIORITY 3: FERTILIZE HIGH-VALUE UNFERTILIZED PLOTS
        # -------------------------------------------------------------
        fert_count = inventory.get("FERTILIZER", 0)
        if fert_count > 0:
            for p in plots:
                if p["crop"] in ("TOMATO", "PUMPKIN", "STAR_HERB", "CORN") and not p["fertilized"]:
                    return f"FERTILIZE {p['id']}"
        elif funds >= 150 and any(p["crop"] in ("TOMATO", "PUMPKIN", "STAR_HERB") and not p["fertilized"] for p in plots):
            # Purchase fertilizer if we have high-value crops in ground
            return "BUY_PRODUCT FERTILIZER 2"

        # -------------------------------------------------------------
        # 5. PRIORITY 4: PLANT EMPTY PLOTS
        # -------------------------------------------------------------
        empty_plots = [p for p in plots if p["crop"] is None or p["stage"] == "empty"]

        if empty_plots:
            target_plot = empty_plots[0]

            # Check if we already have seeds in inventory
            for crop_name in CROP_SPECS:
                seed_key = f"{crop_name}_SEED" if f"{crop_name}_SEED" in inventory else crop_name
                seed_count = inventory.get(seed_key, 0)
                if seed_count > 0:
                    # Check if this crop can finish before season ends
                    growth = CROP_SPECS[crop_name]["growth_turns"]
                    if growth + 1 <= turns_left:
                        return f"PLANT {target_plot['id']} {crop_name}"

            # If no suitable seeds in inventory, buy the optimal seed
            best_crop = self.select_best_crop_to_plant(funds, turns_left, market)
            if best_crop:
                seed_cost = CROP_SPECS[best_crop]["seed_cost"]
                # Buy enough seeds for available empty plots, capped by funds
                buy_qty = min(len(empty_plots), max(1, int(funds // seed_cost)))
                if buy_qty > 0 and (funds - (buy_qty * seed_cost)) >= 5:
                    return f"BUY_SEED {best_crop} {buy_qty}"

        # -------------------------------------------------------------
        # 6. PRIORITY 5: ANIMAL CARE & COLLECTION
        # -------------------------------------------------------------
        if animals:
            for a in animals:
                if isinstance(a, dict):
                    a_id = a.get("id", 0)
                    if a.get("ready_for_collect", False) or a.get("product_ready", False):
                        return f"COLLECT {a_id}"
                    if a.get("hunger", 0) > 60 or a.get("needs_feed", False):
                        return f"FEED_ANIMAL {a_id}"

        # -------------------------------------------------------------
        # 7. PRIORITY 6: MARKET SURGE SALES & PROFIT REALIZATION
        # -------------------------------------------------------------
        for item, count in inventory.items():
            if isinstance(count, (int, float)) and count > 0:
                if not item.endswith("_SEED") and item not in ("FERTILIZER", "FEED"):
                    current_price = market.get(item, 0)
                    surge_ratio = self.get_price_surge_ratio(item, current_price) if current_price else 1.0
                    
                    # Sell if surge ratio is favorable (>1.1x) or inventory is getting large (count >= 5)
                    if surge_ratio >= 1.1 or count >= 5 or turns_left < 80:
                        return f"SELL {item} {int(count)}"

        # -------------------------------------------------------------
        # 8. PRIORITY 7: EXPANSION & INFRASTRUCTURE SCALING
        # -------------------------------------------------------------
        if funds >= 500 and not self.hired_farmhands and turns_left >= 300:
            self.hired_farmhands = True
            return "HIRE"

        if funds >= 800 and len(plots) < 16 and turns_left >= 200:
            return "BUY_LAND 1"

        # -------------------------------------------------------------
        # 9. PRIORITY 8: LIVESTOCK ACQUISITION
        # -------------------------------------------------------------
        if funds >= 400 and len(animals) < 4 and turns_left >= 250:
            return "BUY_ANIMAL CHICKEN 1"

        # -------------------------------------------------------------
        # 10. DEFAULT / PASS
        # -------------------------------------------------------------
        return "PASS"


# Persistent singleton agent instance across turns
_GLOBAL_COSMOS_ENGINE = CosmosGreenEngine()


def cosmos_green_agent(observation: Any, configuration: Optional[Any] = None) -> Union[str, Dict[str, Any]]:
    """
    Main algorithmic agent function for Kaggle Kaggriculture.
    Receives current turn observation and returns valid action string/dict.
    """
    global _GLOBAL_COSMOS_ENGINE
    parsed_obs = _GLOBAL_COSMOS_ENGINE.parse_observation(observation)
    action = _GLOBAL_COSMOS_ENGINE.decide_action(parsed_obs)
    return action


# =============================================================================
# MANDATORY KAGGLE ENTRYPOINT: The last function in the file must be the agent
# =============================================================================
def agent(observation: Any, configuration: Optional[Any] = None) -> Union[str, Dict[str, Any]]:
    """
    Kaggle Simulation Protocol Entry Point.
    Accepts:
        observation: dict / object representing current game turn state.
        configuration: optional static environment config (turns, dims, etc).
    Returns:
        action: Command string (e.g. 'HARVEST 0', 'WATER 1', 'BUY_SEED WHEAT 2', 'PASS')
                or command dict.
    """
    return cosmos_green_agent(observation, configuration)
