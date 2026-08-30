# ==============================================================================
# 🌌 GREENIEVERSE - GREENIECULTURE CHAMPIONSHIP AGENT (main.py)
# Architecture: Closed-Loop Multi-Phase Autonomous Galactic Agriculture Policy
# Deterministic, Zero-Network, Strict Low-Latency Kaggle Submission Entry Point
# ==============================================================================

import math
import sys
from typing import Any, Dict, List, Optional, Tuple, Union

# --- 1. GAME CONSTANTS & CROP CONFIGURATION ---
MAX_TURNS = 720
STARTING_CASH = 250.0

CROP_SPECS: Dict[str, Dict[str, Union[int, float]]] = {
    "WHEAT": {"seed_cost": 15, "growth_turns": 48, "yield": 3, "base_price": 20, "tier": 1},
    "CARROT": {"seed_cost": 28, "growth_turns": 72, "yield": 4, "base_price": 32, "tier": 1},
    "TOMATO": {"seed_cost": 55, "growth_turns": 120, "yield": 5, "base_price": 60, "tier": 2},
    "STRAWBERRY": {"seed_cost": 95, "growth_turns": 168, "yield": 6, "base_price": 110, "tier": 2},
    "MELON": {"seed_cost": 180, "growth_turns": 288, "yield": 8, "base_price": 190, "tier": 3},
}

QUADRANTS = {
    "NW": {"x_range": (0, 4), "y_range": (0, 4), "unlock_cost": 0},
    "NE": {"x_range": (5, 9), "y_range": (0, 4), "unlock_cost": 300},
    "SW": {"x_range": (0, 4), "y_range": (5, 9), "unlock_cost": 300},
    "SE": {"x_range": (5, 9), "y_range": (5, 9), "unlock_cost": 750},
}


class GreenieGreenieCultureAgent:
    """
    Autonomous agricultural planning agent for GreenieCulture tournaments.
    Implements dynamic phase transitions, market arbitrage forecasting, 
    and deterministic liquidation.
    """

    def __init__(self):
        self.turn: int = 0
        self.cash: float = STARTING_CASH
        self.workers: int = 1
        self.inventory: Dict[str, int] = {k: 0 for k in CROP_SPECS}
        self.price_history: Dict[str, List[float]] = {k: [] for k in CROP_SPECS}
        self.unlocked_quadrants: List[str] = ["NW"]

    def get_season_phase(self, turn: int) -> str:
        """Determines strategic season phase based on current turn."""
        if turn <= 168:
            return "PHASE_1_BOOTSTRAP"
        elif turn <= 432:
            return "PHASE_2_EXPANSION"
        elif turn <= 624:
            return "PHASE_3_ARBITRAGE"
        else:
            return "PHASE_4_LIQUIDATION"

    def calculate_scarcity_index(
        self, commodity: str, current_price: float, opp_crops: Dict[str, int]
    ) -> float:
        """
        Computes scarcity index (0 - 100).
        High index = High selling premium / structural deficit.
        Low index = Pending oversupply crash.
        """
        spec = CROP_SPECS.get(commodity, {})
        base_price = spec.get("base_price", 30)
        price_ratio = current_price / max(1.0, float(base_price))

        competitor_supply = opp_crops.get(commodity, 0)
        scarcity = 50.0 * price_ratio

        if competitor_supply >= 5:
            scarcity -= 35.0  # Looming supply dump
        elif competitor_supply == 0:
            scarcity += 25.0  # Safe monopoly window

        return max(0.0, min(100.0, scarcity))

    def evaluate_crop_roi(
        self, crop_name: str, remaining_turns: int, cash: float, market_price: float
    ) -> float:
        """
        Evaluates Expected Final Wealth (EFW) generation for planting a specific seed.
        """
        spec = CROP_SPECS.get(crop_name)
        if not spec:
            return -1.0

        seed_cost = float(spec["seed_cost"])
        growth_turns = int(spec["growth_turns"])
        crop_yield = float(spec["yield"])

        if seed_cost > cash or growth_turns > remaining_turns:
            return -1.0

        expected_revenue = crop_yield * market_price
        net_profit = expected_revenue - seed_cost
        turn_efficiency = net_profit / float(growth_turns)

        return turn_efficiency

    def step(self, obs: Any, configuration: Optional[Any] = None) -> Dict[str, Any]:
        """
        Main decision engine step for GreenieCulture.
        Accepts observation dictionary or Kaggle struct and returns the optimal action.
        """
        # 1. Normalize Observation Data
        if hasattr(obs, "turn"):
            turn = getattr(obs, "turn", self.turn + 1)
            cash = getattr(obs, "cash", self.cash)
            grid = getattr(obs, "grid", [])
            market = getattr(obs, "market", {})
            inventory = getattr(obs, "inventory", self.inventory)
            opponent = getattr(obs, "opponent", {})
        elif isinstance(obs, dict):
            turn = obs.get("turn", self.turn + 1)
            cash = obs.get("cash", self.cash)
            grid = obs.get("grid", [])
            market = obs.get("market", {})
            inventory = obs.get("inventory", self.inventory)
            opponent = obs.get("opponent", {})
        else:
            turn = self.turn + 1
            cash = self.cash
            grid = []
            market = {}
            inventory = self.inventory
            opponent = {}

        self.turn = turn
        self.cash = float(cash)
        remaining_turns = max(0, MAX_TURNS - self.turn)
        phase = self.get_season_phase(self.turn)
        opp_crops = opponent.get("crops", {}) if isinstance(opponent, dict) else {}

        # Update price history tracking
        for crop_name in CROP_SPECS:
            curr_p = market.get(crop_name, {}).get("price", CROP_SPECS[crop_name]["base_price"])
            self.price_history[crop_name].append(float(curr_p))

        # =====================================================================
        # PRIORITY 1: HARVEST MATURE PLOTS
        # =====================================================================
        if grid:
            for y, row in enumerate(grid):
                for x, tile in enumerate(row):
                    status = tile.get("status") if isinstance(tile, dict) else getattr(tile, "status", None)
                    if status in ["MATURE", "READY", "HARVESTABLE"]:
                        return {"action": "HARVEST", "x": x, "y": y}

        # =====================================================================
        # PRIORITY 2: PHASE 4 TERMINAL LIQUIDATION (Turns 625 - 720)
        # =====================================================================
        if phase == "PHASE_4_LIQUIDATION":
            # Liquidate all stored crops to maximize liquid Final Wealth
            for item, count in inventory.items():
                if count > 0:
                    return {"action": "SELL", "item": item, "quantity": int(count)}

            # Only plant ultra-fast wheat if >= 48 turns remain and we have cash
            if remaining_turns >= 48 and self.cash >= 15 and grid:
                for y, row in enumerate(grid):
                    for x, tile in enumerate(row):
                        unlocked = tile.get("unlocked", True) if isinstance(tile, dict) else getattr(tile, "unlocked", True)
                        status = tile.get("status", "EMPTY") if isinstance(tile, dict) else getattr(tile, "status", "EMPTY")
                        if unlocked and status in ["EMPTY", "TILLED"]:
                            return {"action": "PLANT", "crop": "WHEAT", "x": x, "y": y}

            return {"action": "OBSERVE"}

        # =====================================================================
        # PRIORITY 3: ARBITRAGE SALES (Sell into high prices or before competitor crash)
        # =====================================================================
        for item, count in inventory.items():
            if count > 0:
                spec = CROP_SPECS.get(item, {})
                base_price = float(spec.get("base_price", 30))
                current_price = float(market.get(item, {}).get("price", base_price))
                scarcity = self.calculate_scarcity_index(item, current_price, opp_crops)

                # Arbitrage Condition: Scarcity >= 75 OR price >= 1.25x base OR opponent flooding market
                if scarcity >= 75.0 or current_price >= base_price * 1.25 or opp_crops.get(item, 0) >= 4:
                    return {"action": "SELL", "item": item, "quantity": int(count)}

        # =====================================================================
        # PRIORITY 4: IRRIGATION / WATERING DRY PLOTS
        # =====================================================================
        if grid:
            for y, row in enumerate(grid):
                for x, tile in enumerate(row):
                    status = tile.get("status") if isinstance(tile, dict) else getattr(tile, "status", None)
                    watered = tile.get("watered", True) if isinstance(tile, dict) else getattr(tile, "watered", True)
                    moisture = tile.get("moisture", 100) if isinstance(tile, dict) else getattr(tile, "moisture", 100)
                    if status == "PLANTED" and (not watered or moisture < 40):
                        return {"action": "WATER", "x": x, "y": y}

        # =====================================================================
        # PRIORITY 5: QUADRANT EXPANSION (When liquidity permits high ROI scaling)
        # =====================================================================
        if self.turn >= 90 and remaining_turns >= 250:
            if "NE" not in self.unlocked_quadrants and self.cash >= 350:
                self.unlocked_quadrants.append("NE")
                return {"action": "UNLOCK_QUADRANT", "quadrant": "NE"}
            elif "SW" not in self.unlocked_quadrants and self.cash >= 450:
                self.unlocked_quadrants.append("SW")
                return {"action": "UNLOCK_QUADRANT", "quadrant": "SW"}

        # =====================================================================
        # PRIORITY 6: OPTIMAL CROP PLANTING
        # =====================================================================
        # Select best candidate crop based on available cash and time horizon
        best_crop = None
        best_roi = -1.0

        for crop_name in ["MELON", "STRAWBERRY", "TOMATO", "CARROT", "WHEAT"]:
            spec = CROP_SPECS[crop_name]
            if remaining_turns >= int(spec["growth_turns"]) and self.cash >= float(spec["seed_cost"]):
                m_price = float(market.get(crop_name, {}).get("price", spec["base_price"]))
                roi = self.evaluate_crop_roi(crop_name, remaining_turns, self.cash, m_price)
                if roi > best_roi:
                    best_roi = roi
                    best_crop = crop_name

        if best_crop and grid:
            for y, row in enumerate(grid):
                for x, tile in enumerate(row):
                    unlocked = tile.get("unlocked", True) if isinstance(tile, dict) else getattr(tile, "unlocked", True)
                    status = tile.get("status", "EMPTY") if isinstance(tile, dict) else getattr(tile, "status", "EMPTY")
                    if unlocked and status in ["EMPTY", "TILLED"]:
                        return {"action": "PLANT", "crop": best_crop, "x": x, "y": y}

        # =====================================================================
        # PRIORITY 7: DEFAULT OBSERVATION / IDLE
        # =====================================================================
        return {"action": "OBSERVE"}


# Initialize global agent instance
_agent = GreenieGreenieCultureAgent()


# ==============================================================================
# 🎮 KAGGLE SIMULATION ENTRY POINT
# The last 'def' in this file accepts (observation, configuration=None) or (obs)
# and returns an action dictionary.
# ==============================================================================
def agent(observation, configuration=None):
    """
    Standard Kaggle / GreenieCulture Simulation Agent Interface.
    Accepts the environment observation and returns the optimal action.
    """
    return _agent.step(observation, configuration)
