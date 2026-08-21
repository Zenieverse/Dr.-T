#!/usr/bin/env python3
"""
================================================================================
KAGGLE KAGGRICULTURE SIMULATION BENCHMARK & MONTE CARLO VALIDATOR
================================================================================
Simulates complete 720-turn (30 days x 24 hours) full economy episodes with:
- Stochastic weather & evaporation
- Dynamic supply-demand market price curves with elasticity decay & shop consumption
- Land unlocking (up to 16 plots) and farm hand labor multipliers
- Validation of the Agent beating the target score of 3190.3
================================================================================
"""

import math
import random
import json
from agent import ApexKaggricultureEngine, CROP_DATABASE, LIVESTOCK_DATABASE

class KaggricultureSimulationEnvironment:
    def __init__(self, seed: int = 42):
        random.seed(seed)
        self.step = 0
        self.max_steps = 720
        self.funds = 100.0
        self.num_plots = 4
        self.max_plots = 16
        self.plots = []
        for i in range(self.max_plots):
            self.plots.append({
                "id": i,
                "crop": None,
                "stage": "empty",
                "growth": 0.0,
                "water": 60.0,
                "fertilized": False,
                "locked": (i >= self.num_plots)
            })
        self.inventory = {"FERTILIZER": 2}
        self.market = {}
        for crop, spec in CROP_DATABASE.items():
            self.market[crop] = float(spec["base_sell"])
        self.town_demand = {crop: 1.0 for crop in CROP_DATABASE}
        self.hired_hands = 0
        self.action_log = []

    def get_observation(self):
        return {
            "step": self.step,
            "turn": self.step,
            "day": self.step // 24,
            "hour": self.step % 24,
            "funds": round(self.funds, 2),
            "money": round(self.funds, 2),
            "plots": [dict(p) for p in self.plots],
            "inventory": dict(self.inventory),
            "market": dict(self.market),
            "hired_hands": self.hired_hands
        }

    def execute_action(self, action: str):
        if not action or action == "PASS":
            return

        parts = action.strip().split()
        cmd = parts[0].upper()

        if cmd == "BUY_SEED" and len(parts) >= 3:
            crop = parts[1].upper()
            qty = int(parts[2])
            if crop in CROP_DATABASE:
                cost = CROP_DATABASE[crop]["seed_cost"] * qty
                if self.funds >= cost:
                    self.funds -= cost
                    seed_key = f"{crop}_SEED"
                    self.inventory[seed_key] = self.inventory.get(seed_key, 0) + qty

        elif cmd == "PLANT" and len(parts) >= 3:
            plot_id = int(parts[1])
            crop = parts[2].upper()
            seed_key = f"{crop}_SEED"
            if 0 <= plot_id < len(self.plots) and not self.plots[plot_id]["locked"]:
                p = self.plots[plot_id]
                if p["stage"] == "empty":
                    if self.inventory.get(seed_key, 0) > 0:
                        self.inventory[seed_key] -= 1
                        p["crop"] = crop
                        p["stage"] = "growing"
                        p["growth"] = 0.0
                        p["water"] = 55.0
                        p["fertilized"] = False

        elif cmd == "WATER" and len(parts) >= 2:
            plot_id = int(parts[1])
            if 0 <= plot_id < len(self.plots) and not self.plots[plot_id]["locked"]:
                self.plots[plot_id]["water"] = min(100.0, self.plots[plot_id]["water"] + 45.0)

        elif cmd == "FERTILIZE" and len(parts) >= 2:
            plot_id = int(parts[1])
            if 0 <= plot_id < len(self.plots) and not self.plots[plot_id]["locked"]:
                if self.inventory.get("FERTILIZER", 0) > 0:
                    self.inventory["FERTILIZER"] -= 1
                    self.plots[plot_id]["fertilized"] = True

        elif cmd == "HARVEST" and len(parts) >= 2:
            plot_id = int(parts[1])
            if 0 <= plot_id < len(self.plots) and not self.plots[plot_id]["locked"]:
                p = self.plots[plot_id]
                if p["stage"] in ("mature", "ready") or p["growth"] >= 95.0:
                    crop = p["crop"]
                    multiplier = CROP_DATABASE.get(crop, {}).get("fertilizer_multiplier", 1.4) if p["fertilized"] else 1.0
                    yield_count = 1 if not p["fertilized"] else 2
                    self.inventory[crop] = self.inventory.get(crop, 0) + yield_count
                    p["crop"] = None
                    p["stage"] = "empty"
                    p["growth"] = 0.0
                    p["fertilized"] = False

        elif cmd == "SELL" and len(parts) >= 3:
            item = parts[1].upper()
            qty = int(parts[2])
            avail = self.inventory.get(item, 0)
            actual_qty = min(avail, qty)
            if actual_qty > 0:
                base_price = CROP_DATABASE.get(item, {}).get("base_sell", 15)
                unit_price = self.market.get(item, base_price)
                revenue = actual_qty * unit_price
                self.funds += revenue
                self.inventory[item] -= actual_qty
                # Market elasticity impact
                decay = min(0.35, 0.03 * actual_qty)
                if item in self.market:
                    self.market[item] = max(base_price * 0.6, self.market[item] * (1.0 - decay))

        elif cmd == "BUY_LAND":
            if self.funds >= 250 and self.num_plots < self.max_plots:
                self.funds -= 250
                new_limit = min(self.max_plots, self.num_plots + 4)
                for i in range(self.num_plots, new_limit):
                    self.plots[i]["locked"] = False
                self.num_plots = new_limit

        elif cmd == "HIRE":
            if self.funds >= 180 and self.hired_hands < 2:
                self.funds -= 180
                self.hired_hands += 1

    def step_environment(self):
        self.step += 1
        
        # Advance crop growth & soil water evaporation
        for p in self.plots:
            if not p["locked"] and p["crop"] and p["stage"] == "growing":
                spec = CROP_DATABASE.get(p["crop"])
                if spec:
                    water_drain = spec["water_per_turn"] + random.uniform(-0.5, 0.5)
                    p["water"] = max(0.0, p["water"] - water_drain)
                    
                    # Growth rate depends on water
                    if p["water"] >= spec["water_threshold"]:
                        growth_increment = 100.0 / spec["growth_turns"]
                    elif p["water"] > 10:
                        growth_increment = 50.0 / spec["growth_turns"]  # stunted
                    else:
                        growth_increment = 0.0  # stalled
                    
                    p["growth"] += growth_increment
                    if p["growth"] >= 100.0:
                        p["stage"] = "mature"

        # Town consumption market recovery (Prices rebound towards base)
        for crop, spec in CROP_DATABASE.items():
            base = float(spec["base_sell"])
            curr = self.market.get(crop, base)
            # Rebound
            recovery = (base - curr) * 0.06 + random.uniform(-1.0, 1.5)
            self.market[crop] = max(base * 0.5, min(base * 1.6, curr + recovery))

        # Random compost/fertilizer generation
        if random.random() < 0.12:
            self.inventory["FERTILIZER"] = self.inventory.get("FERTILIZER", 0) + 1

def run_benchmark(episodes: int = 10):
    scores = []
    print(f"=== RUNNING {episodes} EPISODES BENCHMARK FOR APEX AGENT ===")
    
    for ep in range(episodes):
        engine = ApexKaggricultureEngine()
        env = KaggricultureSimulationEnvironment(seed=1000 + ep * 77)
        
        while env.step < env.max_steps:
            obs = env.get_observation()
            action = engine.decide_best_action(engine.parse_state(obs))
            env.execute_action(action)
            
            # If hired hands exist, extra actions per turn
            for _ in range(env.hired_hands):
                obs = env.get_observation()
                extra_action = engine.decide_best_action(engine.parse_state(obs))
                env.execute_action(extra_action)
                
            env.step_environment()
            
        final_score = env.funds
        scores.append(final_score)
        print(f"Episode {ep+1:02d}: Final Capital Score = ${final_score:,.2f}")

    avg_score = sum(scores) / len(scores)
    max_score = max(scores)
    min_score = min(scores)
    target = 3190.3
    
    print("\n=======================================================")
    print(f"BENCHMARK RESULTS (720-Turn Full Seasons):")
    print(f"Target Leaderboard Benchmark : ${target:,.2f}")
    print(f"Agent Average Score          : ${avg_score:,.2f}  {'🏆 BEATS BENCHMARK!' if avg_score > target else '❌'}")
    print(f"Agent Peak Score             : ${max_score:,.2f}  (+{((max_score - target)/target)*100:.1f}% OVER TARGET)")
    print(f"Agent Min Score              : ${min_score:,.2f}")
    print("=======================================================\n")
    return {
        "avg": avg_score,
        "max": max_score,
        "min": min_score,
        "target": target,
        "passed": avg_score > target
    }

if __name__ == "__main__":
    run_benchmark(10)
