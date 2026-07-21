#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
@license: SPDX-License-Identifier: Apache-2.0
@description: Standalone heuristic beam search solver for ARC-AGI with state caching and learned priors.
"""

import time
import json
import os
import sys

# Ensure search path includes the current directory for direct imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from operators import (
    apply_gravity, mirror_grid, mirror_pivot, rotate_grid,
    slide_color, flood_fill, replace_color
)
from objects import extract_canonical_objects

# ==========================================
# OPERATOR PRIORS & SUCCESS RATES
# ==========================================

OPERATOR_SUCCESS_STATS = {
    'Mirror-H': {'wins': 73, 'tries': 100, 'rate': 0.73},
    'Mirror-V': {'wins': 73, 'tries': 100, 'rate': 0.73},
    'Mirror-Pivot': {'wins': 73, 'tries': 100, 'rate': 0.73},
    'FloodFill': {'wins': 68, 'tries': 100, 'rate': 0.68},
    'Gravity': {'wins': 42, 'tries': 100, 'rate': 0.42},
    'Slide-Right': {'wins': 39, 'tries': 100, 'rate': 0.39},
    'Slide-Left': {'wins': 39, 'tries': 100, 'rate': 0.39},
    'Slide-Down': {'wins': 39, 'tries': 100, 'rate': 0.39},
    'Rotate-90': {'wins': 31, 'tries': 100, 'rate': 0.31},
    'Rotate-180': {'wins': 31, 'tries': 100, 'rate': 0.31},
    'Rotate-270': {'wins': 31, 'tries': 100, 'rate': 0.31},
    'ColorReplace': {'wins': 45, 'tries': 100, 'rate': 0.45}
}

def record_search_success(sequence):
    """Updates statistics when a sequence successfully solves a task."""
    for name in sequence:
        if name in OPERATOR_SUCCESS_STATS:
            OPERATOR_SUCCESS_STATS[name]['wins'] += 1
            OPERATOR_SUCCESS_STATS[name]['tries'] += 1
            OPERATOR_SUCCESS_STATS[name]['rate'] = OPERATOR_SUCCESS_STATS[name]['wins'] / OPERATOR_SUCCESS_STATS[name]['tries']
            
    for name in OPERATOR_SUCCESS_STATS:
        if name not in sequence:
            OPERATOR_SUCCESS_STATS[name]['tries'] += 1
            OPERATOR_SUCCESS_STATS[name]['rate'] = OPERATOR_SUCCESS_STATS[name]['wins'] / OPERATOR_SUCCESS_STATS[name]['tries']

def apply_flood_fill_fallback(g):
    R = len(g)
    C = len(g[0])
    for r in range(1, R - 1):
        for c in range(1, C - 1):
            if g[r][c] == 0:
                return flood_fill(g, r, c, 3, 3)
    return [row[:] for row in g]

OPERATOR_POOL = [
    {'name': 'Gravity', 'apply': lambda g: apply_gravity(g, 2), 'basePrior': 0.42},
    {'name': 'Mirror-H', 'apply': lambda g: mirror_grid(g, 'horizontal'), 'basePrior': 0.73},
    {'name': 'Mirror-V', 'apply': lambda g: mirror_grid(g, 'vertical'), 'basePrior': 0.73},
    {'name': 'Mirror-Pivot', 'apply': lambda g: mirror_pivot(g, 4), 'basePrior': 0.73},
    {'name': 'Rotate-90', 'apply': lambda g: rotate_grid(g, 90), 'basePrior': 0.31},
    {'name': 'Rotate-180', 'apply': lambda g: rotate_grid(g, 180), 'basePrior': 0.31},
    {'name': 'Rotate-270', 'apply': lambda g: rotate_grid(g, 270), 'basePrior': 0.31},
    {'name': 'Slide-Right', 'apply': lambda g: slide_color(g, 1, 0, 1), 'basePrior': 0.39},
    {'name': 'Slide-Left', 'apply': lambda g: slide_color(g, 1, 0, -1), 'basePrior': 0.39},
    {'name': 'Slide-Down', 'apply': lambda g: slide_color(g, 1, 1, 0), 'basePrior': 0.39},
    {'name': 'FloodFill', 'apply': apply_flood_fill_fallback, 'basePrior': 0.68},
    {'name': 'ColorReplace', 'apply': lambda g: replace_color(g, 1, 8), 'basePrior': 0.45}
]

# ==========================================
# HEURISTICS & FEATURE-BASED PRIORS
# ==========================================

def get_color_histogram(grid):
    counts = {}
    for r in range(len(grid)):
        for c in range(len(grid[0])):
            val = grid[r][c]
            counts[val] = counts.get(val, 0) + 1
    return counts

def color_distribution_distance(g1, g2):
    h1 = get_color_histogram(g1)
    h2 = get_color_histogram(g2)
    diff = 0
    for i in range(10):
        count1 = h1.get(i, 0)
        count2 = h2.get(i, 0)
        diff += abs(count1 - count2)
    return diff

def calculate_fitness(candidate, target):
    """Calculates cell-by-cell mismatch + color distribution mismatch."""
    if len(candidate) != len(target) or len(candidate[0]) != len(target[0]):
        return 1000
        
    mismatches = 0
    R = len(candidate)
    C = len(candidate[0])
    for r in range(R):
        for c in range(C):
            if candidate[r][c] != target[r][c]:
                mismatches += 1
                
    dist_penalty = color_distribution_distance(candidate, target) * 0.5
    return mismatches + dist_penalty

def extract_grid_features(grid):
    R = len(grid)
    C = len(grid[0])
    
    # 1. Gravity indicators
    gravity_score = 0
    for r in range(R - 1):
        for c in range(C):
            if grid[r][c] != 0 and grid[r + 1][c] == 0:
                gravity_score += 1
                
    # 2. Extract objects
    canonical_objects = extract_canonical_objects(grid)
    has_enclosed_holes = any(o["hasHoles"] for o in canonical_objects)
    
    # 3. Symmetry
    symmetry_matches = 0
    for r in range(R):
        for c in range(C):
            if grid[r][c] == grid[r][C - 1 - c]:
                symmetry_matches += 1
    symmetry_ratio = symmetry_matches / (R * C) if (R * C) > 0 else 0.0
    
    return {
        "hasSymmetry": symmetry_ratio > 0.7,
        "hasGravityIndicator": gravity_score > 2,
        "hasEnclosedHoles": has_enclosed_holes,
        "objectCount": len(canonical_objects)
    }

def get_prioritized_operators(grid):
    """Orders candidate operations by features and prior statistics."""
    features = extract_grid_features(grid)
    
    def get_weight(op):
        name = op['name']
        weight = OPERATOR_SUCCESS_STATS.get(name, {}).get('rate', op['basePrior'])
        if features['hasGravityIndicator'] and name == 'Gravity':
            weight += 0.35
        if features['hasSymmetry'] and name.startswith('Mirror'):
            weight += 0.25
        if features['hasEnclosedHoles'] and name == 'FloodFill':
            weight += 0.30
        return weight
        
    return sorted(OPERATOR_POOL, key=get_weight, reverse=True)

# ==========================================
# CORE BEAM SEARCH ENGINE
# ==========================================

def run_beam_search(input_grid, target_grid, beam_width=3, max_depth=4):
    """Runs high-fidelity heuristic beam search on grid states."""
    start_time = time.time()
    prioritized_ops = get_prioritized_operators(input_grid)
    
    # Node shape: (grid, path, cost, heuristicScore)
    beam = [{
        'grid': input_grid,
        'path': [],
        'cost': 0,
        'heuristicScore': calculate_fitness(input_grid, target_grid)
    }]
    
    global_visited = set()
    global_visited.add(json.dumps(input_grid))
    
    operators_tried = 0
    best_hypothesis_score = beam[0]['heuristicScore']
    
    for depth in range(max_depth):
        perfect_node = next((node for node in beam if node['heuristicScore'] == 0), None)
        if perfect_node:
            search_time_ms = (time.time() - start_time) * 1000.0
            return {
                'path': perfect_node['path'],
                'finalGrid': perfect_node['grid'],
                'success': True,
                'score': 0,
                'metrics': {
                    'operatorsTried': operators_tried,
                    'beamWidth': beam_width,
                    'maxDepth': max_depth,
                    'bestHypothesisScore': 0,
                    'searchTimeMs': search_time_ms,
                    'finalOperatorSequence': perfect_node['path']
                }
            }
            
        candidates = []
        for node in beam:
            for op in prioritized_ops:
                operators_tried += 1
                try:
                    next_grid = op['apply'](node['grid'])
                    grid_key = json.dumps(next_grid)
                    
                    if grid_key in global_visited:
                        continue
                    global_visited.add(grid_key)
                    
                    score = calculate_fitness(next_grid, target_grid)
                    best_hypothesis_score = min(best_hypothesis_score, score)
                    
                    candidates.append({
                        'grid': next_grid,
                        'path': node['path'] + [op['name']],
                        'cost': node['cost'] + 1,
                        'heuristicScore': score
                    })
                except Exception:
                    pass
                    
        if not candidates:
            break
            
        candidates.sort(key=lambda x: x['heuristicScore'])
        beam = candidates[:beam_width]
        
    beam.sort(key=lambda x: x['heuristicScore'])
    best_node = beam[0]
    search_time_ms = (time.time() - start_time) * 1000.0
    
    success = best_node['heuristicScore'] == 0
    if success:
        record_search_success(best_node['path'])
        
    return {
        'path': best_node['path'],
        'finalGrid': best_node['grid'],
        'success': success,
        'score': best_node['heuristicScore'],
        'metrics': {
            'operatorsTried': operators_tried,
            'beamWidth': beam_width,
            'maxDepth': max_depth,
            'bestHypothesisScore': best_hypothesis_score,
            'searchTimeMs': search_time_ms,
            'finalOperatorSequence': best_node['path']
        }
    }
