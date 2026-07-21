#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
@license: SPDX-License-Identifier: Apache-2.0
@description: Standalone pure deterministic symbolic operator library for ARC-AGI grids.
"""

def clone_grid(grid):
    return [row[:] for row in grid]

def apply_gravity(grid, anchor_color=2):
    """
    Simulates downward gravity where particles (value 1) fall until hitting obstacles,
    the bottom of the grid, or diagonal anchor support.
    """
    R = len(grid)
    C = len(grid[0])
    result = clone_grid(grid)
    
    # 1. Fall phase for active particles (value 1)
    changed = True
    while changed:
        changed = False
        for r in range(R - 2, -1, -1):
            for c in range(C):
                val = result[r][c]
                if val == 1:  # active particle
                    next_val = result[r + 1][c]
                    blocked = next_val != 0
                    
                    # Check diagonal anchor support below-left and below-right
                    if r + 1 < R:
                        if c - 1 >= 0 and result[r + 1][c - 1] == anchor_color:
                            blocked = True
                        if c + 1 < C and result[r + 1][c + 1] == anchor_color:
                            blocked = True
                    
                    if not blocked:
                        result[r + 1][c] = 1
                        result[r][c] = 0
                        changed = True

    # 2. Transformation phase
    for r in range(R):
        for c in range(C):
            if result[r][c] == anchor_color:
                # Direct contact above (absorption)
                if r - 1 >= 0 and result[r - 1][c] == 1:
                    result[r - 1][c] = 0  # absorbed
                    result[r][c] = 3      # transformed
                
                # Diagonal contacts (no absorption, but triggers transformation)
                diagonal_offsets = [
                    (-1, -1), (-1, 1), (1, -1), (1, 1), (0, -1), (0, 1)
                ]
                
                has_diagonal_touch = False
                for dr, dc in diagonal_offsets:
                    nr = r + dr
                    nc = c + dc
                    if 0 <= nr < R and 0 <= nc < C:
                        if result[nr][nc] == 1:
                            has_diagonal_touch = True
                
                if has_diagonal_touch:
                    result[r][c] = 3

    return result

def mirror_pivot(grid, pivot_color=4):
    """
    Mirror across an offset vertical column (pivot line of pivot_color).
    """
    result = clone_grid(grid)
    R = len(result)
    C = len(result[0])

    # Find the column index representing the pivot plane
    pivot_c = -1
    for r in range(R):
        for c in range(C):
            if grid[r][c] == pivot_color:
                pivot_c = c
                break
        if pivot_c != -1:
            break

    if pivot_c != -1:
        for r in range(R):
            for offset in range(1, C):
                left_c = pivot_c - offset
                right_c = pivot_c + offset
                if left_c >= 0 and right_c < C:
                    if grid[r][left_c] != 0:
                        result[r][right_c] = grid[r][left_c]

    return result

def slide_color(grid, color, dr, dc):
    """
    Slides all cells of a specific color in a target direction by dr, dc.
    """
    result = clone_grid(grid)
    R = len(result)
    C = len(result[0])
    to_move = []

    for r in range(R):
        for c in range(C):
            if result[r][c] == color:
                to_move.append({"r": r, "c": c, "val": result[r][c]})
                result[r][c] = 0

    for item in to_move:
        target_r = item["r"] + dr
        target_c = item["c"] + dc
        if 0 <= target_r < R and 0 <= target_c < C:
            result[target_r][target_c] = item["val"]

    return result

def mirror_grid(grid, axis):
    """
    Reflects grid horizontally or vertically around its central axis.
    """
    if axis == "vertical":
        return [row[::-1] for row in grid]
    elif axis == "horizontal":
        return grid[::-1]
    return clone_grid(grid)

def rotate_grid(grid, degrees):
    """
    Rotates grid by 90, 180, or 270 degrees clockwise.
    """
    if degrees == 180:
        return [row[::-1] for row in grid[::-1]]
    elif degrees == 90:
        # Zip list elements to rotate clock-wise
        return [list(x) for x in zip(*grid[::-1])]
    elif degrees == 270:
        # Zip elements in reverse order
        return [list(x) for x in zip(*grid)][::-1]
    return clone_grid(grid)

def flood_fill(grid, start_r, start_c, fill_color, boundary_color):
    """
    Performs a standard 4-way flood fill inside an enclosed boundary.
    """
    result = clone_grid(grid)
    R = len(result)
    C = len(result[0])
    visited = [[False] * C for _ in range(R)]
    queue = [(start_r, start_c)]
    
    while queue:
        r, c = queue.pop(0)
        if r < 0 or r >= R or c < 0 or c >= C:
            continue
        if visited[r][c]:
            continue
        if result[r][c] == boundary_color or result[r][c] == fill_color:
            continue
        
        visited[r][c] = True
        result[r][c] = fill_color
        
        queue.append((r + 1, c))
        queue.append((r - 1, c))
        queue.append((r, c + 1))
        queue.append((r, c - 1))
        
    return result

def replace_color(grid, target_color, replacement_color):
    """
    Replaces all instances of target_color with replacement_color.
    """
    return [[replacement_color if cell == target_color else cell for cell in row] for row in grid]
