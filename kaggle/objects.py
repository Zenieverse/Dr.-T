#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
@license: SPDX-License-Identifier: Apache-2.0
@description: Standsalone modular object extraction, bounding box detection,
              local symmetry calculation, and hole detection for ARC grids.
"""

from collections import deque

def extract_objects(grid, allow_diagonal=False):
    """
    Identifies connected components (objects) in the grid of non-zero colors.
    Returns a list of dicts: {color, pixels, minR, maxR, minC, maxC}
    """
    R = len(grid)
    C = len(grid[0])
    visited = [[False] * C for _ in range(R)]
    components = []

    for r in range(R):
        for c in range(C):
            color = grid[r][c]
            if color != 0 and not visited[r][c]:
                # BFS to find all pixels of this connected component
                pixels = []
                queue = deque([(r, c)])
                visited[r][c] = True

                min_r, max_r = r, r
                min_c, max_c = c, c

                while queue:
                    curr_r, curr_c = queue.popleft()
                    pixels.append({"r": curr_r, "c": curr_c})

                    min_r = min(min_r, curr_r)
                    max_r = max(max_r, curr_r)
                    min_c = min(min_c, curr_c)
                    max_c = max(max_c, curr_c)

                    dirs = [(1, 0), (-1, 0), (0, 1), (0, -1)]
                    if allow_diagonal:
                        dirs.extend([(1, 1), (1, -1), (-1, 1), (-1, -1)])

                    for dr, dc in dirs:
                        nr = curr_r + dr
                        nc = curr_c + dc
                        if 0 <= nr < R and 0 <= nc < C:
                            if grid[nr][nc] == color and not visited[nr][nc]:
                                visited[nr][nc] = True
                                queue.append((nr, nc))

                components.append({
                    "color": color,
                    "pixels": pixels,
                    "minR": min_r,
                    "maxR": max_r,
                    "minC": min_c,
                    "maxC": max_c
                })

    return components

def calculate_component_symmetry(pixels, bbox):
    """
    Calculates local horizontal and vertical symmetry of an isolated component's bounding box.
    """
    h = bbox["maxR"] - bbox["minR"] + 1
    w = bbox["maxC"] - bbox["minC"] + 1
    local_grid = [[0] * w for _ in range(h)]

    for p in pixels:
        local_grid[p["r"] - bbox["minR"]][p["c"] - bbox["minC"]] = 1

    symmetric_matches = 0
    total_compares = 0

    for r in range(h):
        for c in range(w):
            total_compares += 2
            # Horizontal mirror symmetry
            if local_grid[r][c] == local_grid[r][w - 1 - c]:
                symmetric_matches += 1
            # Vertical mirror symmetry
            if local_grid[r][c] == local_grid[h - 1 - r][c]:
                symmetric_matches += 1

    return 1.0 if total_compares == 0 else symmetric_matches / total_compares

def detect_component_holes(pixels, bbox):
    """
    Detects if an isolated component's bounding box contains fully enclosed empty spaces (holes).
    Uses a standard flood fill starting from an extra padded outer border.
    """
    h = bbox["maxR"] - bbox["minR"] + 3  # add padding
    w = bbox["maxC"] - bbox["minC"] + 3
    temp_grid = [[0] * w for _ in range(h)]

    # Map component pixels into padded space
    for p in pixels:
        temp_grid[p["r"] - bbox["minR"] + 1][p["c"] - bbox["minC"] + 1] = 1

    # Flood fill from (0,0) (guaranteed to be outside the component)
    queue = deque([(0, 0)])
    visited = [[False] * w for _ in range(h)]
    visited[0][0] = True

    while queue:
        curr_r, curr_c = queue.popleft()
        neighbors = [
            (curr_r + 1, curr_c),
            (curr_r - 1, curr_c),
            (curr_r, curr_c + 1),
            (curr_r, curr_c - 1)
        ]
        for nr, nc in neighbors:
            if 0 <= nr < h and 0 <= nc < w:
                if not visited[nr][nc] and temp_grid[nr][nc] == 0:
                    visited[nr][nc] = True
                    queue.append((nr, nc))

    # Any unvisited cell in temp_grid that is still 0 must be an internal hole!
    for r in range(1, h - 1):
        for c in range(1, w - 1):
            if temp_grid[r][c] == 0 and not visited[r][c]:
                return True

    return False

def extract_canonical_objects(grid, allow_diagonal=False):
    """
    Extracts list of CanonicalObjects with structural descriptors in dict format.
    """
    raw_components = extract_objects(grid, allow_diagonal)
    canonical_objects = []

    for idx, comp in enumerate(raw_components):
        bbox = {
            "minR": comp["minR"],
            "maxR": comp["maxR"],
            "minC": comp["minC"],
            "maxC": comp["maxC"]
        }

        total_r = sum(p["r"] for p in comp["pixels"])
        total_c = sum(p["c"] for p in comp["pixels"])
        centroid = {
            "r": int(round(total_r / len(comp["pixels"]))),
            "c": int(round(total_c / len(comp["pixels"])))
        }

        area = len(comp["pixels"])
        symmetry_score = calculate_component_symmetry(comp["pixels"], bbox)
        has_holes = detect_component_holes(comp["pixels"], bbox)

        h = bbox["maxR"] - bbox["minR"] + 1
        w = bbox["maxC"] - bbox["minC"] + 1
        orientation = "none"
        if w > h:
            orientation = "horizontal"
        elif h > w:
            orientation = "vertical"
        elif h == w and h > 1:
            orientation = "square"

        canonical_objects.append({
            "id": f"obj-{idx}-{comp['color']}-{bbox['minR']}-{bbox['minC']}",
            "color": comp["color"],
            "pixels": comp["pixels"],
            "boundingBox": bbox,
            "centroid": centroid,
            "area": area,
            "symmetryScore": symmetry_score,
            "hasHoles": has_holes,
            "orientation": orientation
        })

    return canonical_objects
