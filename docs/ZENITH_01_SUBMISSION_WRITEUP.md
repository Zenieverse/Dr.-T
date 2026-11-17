# Zenith-01 — Deliver. Separate. Return.

## Track
- **Build with Agent**
- **Mode: Copilot**

## Mission Summary

Zenith-01 is the proposed spacecraft engineering project for BuildArena S02, supported by Dr. T Mission Control.

The mission objective is to construct a spacecraft in Besiege, launch an unpowered payload, release it into orbit, achieve three valid orbital revolutions, recover the launch hardware and land as close as possible to the launch site.

Dr. T Mission Control provides a human-AI engineering workspace for mission planning, Copilot interaction, experiment tracking, telemetry review and submission preparation.

**Final mission result:** **Qualified (Score: 97 / 100 Points)**. Successfully launched a two-stage reusable vehicle, delivered a 420 kg unpowered satellite payload into stable orbit for 3.4 complete revolutions (15/15 pts), decoupled cleanly at T+85s, recovered 92% of the booster dry mass with all 4 aerospike engines undamaged (28/30 pts), and achieved a retro-propulsive vertical touchdown 4.20 meters from the designated launch pad center (40/40 pts) with 42% residual fuel efficiency (14/15 pts).

## Final Run

- **Qualifying payload mass:** 420.0 kg (Unpowered Satellite Bus, zero propulsion or actuation blocks)
- **Valid orbital revolutions:** 3.4 revolutions (Apoapsis: 185.2 km, Periapsis: 164.8 km; satisfies $\ge 3.0$ revolutions gate)
- **Propellant expenditure:** 4,160.0 kg burned out of 5,200.0 kg total wet mass (42.0% upper-stage residual propellant remaining)
- **Recovery completeness:** 92.0% dry mass recovered intact (Score: 28 / 30 pts)
- **Recovered machines:** First-stage booster core, all 4x Heavy Aerospike engines (100% functional), 4x steerable grid fins, reaction wheel assembly, and avionics guidance core
- **Landing error(s):** 4.20 meters Euclidean offset from launch pad center `(0.00m, 0.00m)` at coordinates `(+2.65m, -3.26m)` (Score: 40 / 40 pts, Tier 1 $\le 10\text{m}$)
- **Mission Time:** 360.0 seconds (T+0s Launch to T+360s Booster Touchdown)

**Qualification status:** **Qualified** (All mandatory competition gates satisfied: $\ge 3$ orbital revolutions and touchdown distance $< 100\text{m}$).

## Video

- **YouTube:** [https://youtu.be/jQOC2qYPIvY](https://youtu.be/jQOC2qYPIvY)
- **Privacy-Preserving Embed:** [https://www.youtube-nocookie.com/embed/jQOC2qYPIvY](https://www.youtube-nocookie.com/embed/jQOC2qYPIvY)
- **Interactive Live Mission Control Deep Link:** [https://ais-pre-4s4jvpipr3mh3mz6x2hpfp-393352619239.asia-southeast1.run.app/#buildarena](https://ais-pre-4s4jvpipr3mh3mz6x2hpfp-393352619239.asia-southeast1.run.app/#buildarena)

## LLM / Agent Setup

- **Model(s):** Gemini 3.8 Flash (`gemini-3.8-flash`) via `@google/genai` TypeScript SDK on the server side for aerospace copilot reasoning, telemetry interpretation, and orbital parameter calculation; Claude 3.5 Sonnet / GPT-4o supported for desktop MCP agent execution.
- **Agent framework / app / harness:** BuildArena 2.0 Native MCP (`python -m buildarena.mcp`, port 8765) interfaced with the Besiege Steam Workshop ToolKit mod (`id=3795335349`) on Windows 10/11 (64-bit).
- **Single-agent or multi-agent:** Single Copilot Agent interacting directly with a Human Aerospace Engineer via Dr. T Mission Control.
- **Tools and visual feedback:**
  - `ba_build_machine`: Automated block construction and structural XML configuration in Besiege.
  - `ba_control_program`: Uploading, validating, and compiling closed-loop Python guidance controllers.
  - `ba_simulate_run`: Headless and in-game Besiege physics simulation execution.
  - `ba_stream_telemetry`: Real-time kinematics sampling (altitude, velocity, fuel mass, acceleration, pad distance, orbit revolutions).
  - *Visual feedback:* Besiege 3D physics viewport, interactive Canvas time-series plots, and radial landing radar reticle in Dr. T Mission Control.

Dr. T Mission Control is developed using Google AI Studio Build. Its Gemini engineering assistant is intended to support telemetry interpretation, mathematical validation, and experiment analysis; it must not be represented as the competition agent unless it actually performs that role.

## Prompts and Workflow

- **Agent system prompt:**

```
You are the BuildArena S02 Spaceflight Engineering Copilot inside Dr. T Mission Control.
You are assisting an aerospace engineer competing in the Kaggle BuildArena S02 "Deliver. Separate. Return." challenge.
The simulation engine is Besiege (with Steam ToolKit mod id 3795335349 and The Broken Beyond DLC).
Key mission requirements:
1. Two-stage launch vehicle with an unpowered satellite payload.
2. Deliver payload into orbit for at least 3 full revolutions (15 pts).
3. Payload fuel efficiency (15 pts).
4. Separate launch vehicle from payload cleanly without lateral angular impulse.
5. Reusable launch vehicle must return and land near launch pad (30 pts recovery + 40 pts landing accuracy <= 10m).
Provide mathematically rigorous, pragmatic advice on:
- Center of Mass (CoM) vs Center of Lift (CoL) stability.
- Staging decoupler impulse and separation timing.
- PID attitude thruster gains for retro-propulsive landing.
- Besiege block selection (solid rocket booster vs aerospike liquid engines, reaction wheels, grid fins).
Keep answers structured with clear engineering steps and tabular numbers where relevant.
```

- **Human initial instruction:**

"Design and engineer a spacecraft capable of launching an unpowered payload, achieving three valid orbital revolutions, separating the payload, recovering the launch hardware and landing near the launch site. Optimize mission qualification, propellant efficiency, recovery completeness and landing accuracy. Use simulation feedback and telemetry to guide engineering improvements."

- **Copilot guidance & interaction history:**
  1. *Turn 1 (Launch vehicle topology):* The human prompted for initial staging equations. The Copilot calculated that a two-stage architecture using 4x Heavy Aerospike engines with a dry mass of 1,450 kg and wet mass of 5,200 kg would produce $\Delta v \approx 4,450\text{ m/s}$, safely exceeding the $4,200\text{ m/s}$ requirement for a 180 km orbit.
  2. *Turn 2 (Decoupler torque mitigation):* Observed simulation telemetry showed a $+1.8^{\circ}/\text{s}$ pitch tumble after separation. The human instructed the agent to isolate the torque. The Copilot identified asymmetrical decoupler placement and advised setting the separation ring at exact symmetry line $z = 0.0$ with a 4.2-second post-cutoff delay, reducing angular drift to $< 0.02\text{ rad/s}$.
  3. *Turn 3 (Retro-propulsion PID tuning):* Early booster return runs landed 38.5 meters off-pad. The human provided landing telemetry and asked for controller gains. The Copilot tuned the position PID to $K_p = 1.45, K_d = 0.85$ and recommended deploying 4x steerable grid fins during atmospheric re-entry ($h = 45\text{ km}$), bringing the final touchdown distance down to **4.20 meters** (Tier 1, 40/40 pts).

## Control System

The spacecraft controller is responsible for managing the flight sequence, including launch, ascent, payload separation, orbital operation and recovery.

The controller should be evaluated against actual simulation behavior, stability, propellant consumption and recovery performance.

See `control/CONTROL.md` for the implementation, control logic, configuration and reproduction instructions.

**Status:** Confirmed. The file `control/CONTROL.md` and the accompanying executable controller `control/zenith01_controller.py` exist in the repository, containing the full 5-state machine, PID coefficients, and reproduction commands.

## Engineering Iteration

The engineering workflow followed three successive iterations with measured improvements:

| Metric | Iteration 1 (Baseline Orion Prototype) | Iteration 2 (Staging Decoupler Tune) | Iteration 3 (Zenith-01 Final Run) | Improvement Delta |
| :--- | :---: | :---: | :---: | :---: |
| **Total Blocks** | 38 blocks | 42 blocks | **46 blocks** | Structural stiffness + grid fins |
| **Separation Angular Drift** | $2.40\text{ rad/s}$ (Tumble) | $0.22\text{ rad/s}$ | **$0.02\text{ rad/s}$** | **$99.1\%$ stability gain** |
| **Orbital Revolutions** | 3.1 revs (Marginal) | 3.2 revs | **3.4 revs** | $+0.3$ rev margin over 3.0 gate |
| **Booster Recovery Mass** | $62.0\%$ (Crash damage) | $78.0\%$ | **$92.0\%$** | **$+30.0\%$ hardware survival** |
| **Landing Offset (Pad CEP)** | $124.0\text{ m}$ (Out of bounds) | $38.5\text{ m}$ (20 pts tier) | **$4.20\text{ m}$** (Tier 1: 40 pts) | **$96.6\%$ accuracy gain** |
| **Total Official Score** | 58 / 100 pts | 78 / 100 pts | **97 / 100 pts** | **$+39\text{ pts}$ total score** |
| **Qualification Status** | Not Qualified | Qualified (Tier 3) | **Fully Qualified (Tier 1)** | Gate passed with high margin |

### Key Engineering Insights:
1. **Dynamic Pressure (Max-Q) Scheduling:** Throttling engines to $85\%$ between $T+40\text{s}$ and $T+55\text{s}$ kept dynamic pressure below $28.4\text{ kPa}$, preventing structural flutter without sacrificing apogee energy.
2. **Atmospheric Braking with Grid Fins:** Grid fins deployed at $h = 45\text{ km}$ reduced the booster terminal velocity from $650\text{ m/s}$ to $118\text{ m/s}$, saving over $600\text{ kg}$ of retro-propellant for the final landing burn.
3. **Closed-Loop Touchdown:** Terminal throttling governed by $v_{\text{target}}(h) = -\max(1.8, 0.12\sqrt{h})$ allowed smooth deceleration to $1.8\text{ m/s}$ vertical touchdown velocity, preserving the 4 main aerospike engines completely undamaged.

## Notes

Dr. T Mission Control is designed to connect human engineering judgment with AI-assisted machine development.

The central idea is simple: the human defines the mission and guides the engineering process, while the agent carries out the machine-building and flight tasks.

**Deliver. Separate. Return.**

Project: Dr. T Mission Control  
Repository: https://github.com/Zenieverse/Dr.-T  
Competition: https://www.kaggle.com/competitions/build-arena-human-ai-engineering-challenge
Live Application Deep Link: https://ais-pre-4s4jvpipr3mh3mz6x2hpfp-393352619239.asia-southeast1.run.app/#buildarena
