# BuildArena S02 — Windows Desktop Simulation Setup Guide
## Prerequisites for Besiege, Steam Workshop Mod & MCP Server

To run 3D physics simulations in Besiege and connect to Dr. T Mission Control via Model Context Protocol (MCP), configure the host Windows machine as follows:

---

## 1. System Requirements

- **Operating System:** Windows 10 or Windows 11 (64-bit)
- **Processor:** Intel Core i5 / AMD Ryzen 5 or higher
- **RAM:** 16 GB DDR4/DDR5 recommended
- **GPU:** NVIDIA GTX 1060 / AMD Radeon RX 580 or higher (DirectX 11 compliant)
- **Storage:** 10 GB available SSD space

---

## 2. Steam & Besiege Installation

1. Install the official **Steam Client** on Windows.
2. Purchase and install **Besiege** (version $\ge 1.45$).
3. Install the two required DLC expansions:
   - **The Broken Beyond** (Space physics blocks, reaction wheels, RCS thrusters, vacuum aerodynamics).
   - **The Splintered Sea** (Water buoyancy and fluid dynamics).
4. Verify the Besiege installation path:
   ```
   C:\Program Files (x86)\Steam\steamapps\common\Besiege
   ```

---

## 3. Official BuildArena ToolKit Mod

1. Open Steam Community Workshop for Besiege.
2. Subscribe to the official **BuildArena ToolKit Mod**:
   - **Workshop Item ID:** `3795335349`
   - **Workshop URL:** `https://steamcommunity.com/sharedfiles/filedetails/?id=3795335349`
3. Launch Besiege once to allow Steam to download and verify the mod files into:
   ```
   Besiege\Besiege_Data\Mods\BuildArenaToolKit\
   ```

---

## 4. Python Runtime & BuildArena 2.0 MCP Server

1. Install **Python 3.10+** (ensure `Add Python to PATH` is checked during installation).
2. Install the official `buildarena` package via pip:
   ```powershell
   pip install buildarena>=2.0.0
   ```
3. Start the BuildArena MCP server on localhost port 8765:
   ```powershell
   python -m buildarena.mcp --port 8765 --mod-id 3795335349
   ```
4. Verify that the server reports:
   ```
   [BuildArena MCP] Listening on 127.0.0.1:8765 (IPC Mod Bridge Active)
   ```

---

## 5. Connecting from Dr. T Mission Control

In Dr. T, navigate to **BuildArena S02 > 03. MCP Bridge**:
- Default bridge URL: `http://127.0.0.1:8765`
- Click **"Check Desktop Bridge"** to verify connection.
- When connected, simulation execution commands issued in Dr. T will execute headlessly or in-game on the Windows machine.
- When running Dr. T from an iPad or remote browser, set an ngrok / Cloudflare tunnel URL to forward port 8765, and input the public URL into Dr. T.
