# BuildArena 2.0 Native Model Context Protocol (MCP) Specification
## Tool Catalog, Data Schemas & Remote Bridge Protocol

This document defines the interface between Dr. T AI Engineering Mission Control and the BuildArena 2.0 MCP server.

---

## 1. MCP Architecture Overview

```
+-------------------------------------------------------------+
| Dr. T Mission Control (Web / iPad / Cloud Run)              |
| - Gemini 3.8 Flash Copilot Workspace                        |
| - Kinematics Visualizer & Landing Radar                     |
| - Authoritative Scoring Evaluator (100 Pts Max)             |
+------------------------------+------------------------------+
                               | HTTP JSON-RPC / SSE
                               v
+-------------------------------------------------------------+
| BuildArena 2.0 MCP Bridge Server (Python 127.0.0.1:8765)    |
| - Exposes MCP Tools                                         |
| - IPC Socket Bridge to Steam Besiege Process               |
+------------------------------+------------------------------+
                               | Shared Memory / Pipe
                               v
+-------------------------------------------------------------+
| Besiege Physics Sandbox (Windows 10/11)                     |
| - BuildArena ToolKit Mod (Steam ID 3795335349)              |
| - The Broken Beyond DLC (Spacecraft Blocks)                 |
+-------------------------------------------------------------+
```

---

## 2. Tool Definitions

### `ba_build_machine`
- **Purpose:** Construct or modify a Besiege spacecraft block configuration.
- **Parameters:**
  ```json
  {
    "blocks": [
      {
        "id": "b1",
        "type": 70,
        "name": "AerospikeEngine",
        "position": [0.0, 1.0, 0.0],
        "rotation": [0.0, 0.0, 0.0],
        "properties": { "thrust": 1.5 }
      }
    ],
    "targetSaveName": "Starhawk_S02_V3.bsg"
  }
  ```
- **Returns:** `{ "success": true, "blockCount": 46, "totalMass": 5200.0 }`

### `ba_control_program`
- **Purpose:** Compile and attach a Python closed-loop flight script to the spacecraft.
- **Parameters:**
  ```json
  {
    "scriptCode": "import ba_control as ba\n\ndef flight_loop(t):\n    if t.altitude > 85000: ba.trigger_stage()",
    "tickRateHz": 50
  }
  ```
- **Returns:** `{ "compiled": true, "syntaxValid": true }`

### `ba_simulate_run`
- **Purpose:** Execute physics simulation in Besiege.
- **Parameters:**
  ```json
  {
    "maxSimulationTimeSeconds": 360,
    "timeScale": 2.0,
    "headless": true
  }
  ```
- **Returns:** `{ "status": "COMPLETED", "durationSeconds": 360, "trajectoryCsv": "trajectory.csv" }`

### `ba_stream_telemetry`
- **Purpose:** Stream time-series telemetry to Mission Control.
- **Parameters:**
  ```json
  {
    "samplingIntervalMs": 100
  }
  ```
- **Stream Schema:**
  - `timeSeconds`: elapsed mission time
  - `altitudeMeters`: current altitude above sea level
  - `velocityMs`: total velocity magnitude
  - `fuelMassKg`: remaining propellant mass
  - `stage`: active mission stage (1..5)
  - `distanceToPadMeters`: horizontal distance to launch/landing pad center $(0.0, 0.0)$
  - `orbitRevolutions`: verified complete orbital revolutions
