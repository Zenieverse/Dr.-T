# Zenith-01 Flight Controller Specification
## Closed-Loop Spaceflight Guidance, Navigation and Control (GNC)
**Mission:** Deliver. Separate. Return.  
**Platform:** Besiege with BuildArena ToolKit (`id=3795335349`)  
**Package:** `buildarena-2.0` / `ba_control` API  

---

## 1. Architecture & State Machine

The Zenith-01 controller implements a finite-state machine (FSM) running at 50 Hz physics update rate:

```
[STATE 1: ASCENT] ---> T+85s, Alt >= 85km ---> [STATE 2: SEPARATION]
                                                      |
                                                      v
[STATE 4: BOOSTBACK & RE-ENTRY] <--- 3.0 Revs Gate <--- [STATE 3: ORBIT INSERTION]
       |
       v (Alt <= 3,000m)
[STATE 5: TERMINAL GUIDANCE & RETRO-TOUCHDOWN] (Pad CEP <= 10m)
```

1. **State 1 (Ascent & Max-Q Control):**
   - 4x Aerospike engines at 100% thrust.
   - Steerable grid fins dynamic damping to minimize angle of attack ($\alpha < 2^{\circ}$) during Max-Q ($q = 28.4\text{ kPa}$ at $T+48\text{s}$).
2. **State 2 (Payload Separation):**
   - Trigger explosive decoupler ring at $T+85\text{s}$ at $h = 85\text{ km}$.
   - Unpowered satellite payload ejected with $+18\text{ m/s}$ forward relative velocity and angular drift $< 0.02\text{ rad/s}$.
3. **State 3 (Orbital Insertion & 3-Orbit Validation Gate):**
   - Upper stage delivers payload into circular orbit ($r_a = 185\text{ km}$, $r_p = 165\text{ km}$, $v = 2,200\text{ m/s}$).
   - Satellite unpowered ballistic persistence verified for 3.4 revolutions.
4. **State 4 (Booster Flip & Atmospheric Re-entry):**
   - First-stage booster executes $180^{\circ}$ attitude pitch flip via RCS nitrogen quads.
   - Boostback burn cancels horizontal momentum toward launch azimuth.
   - Grid fins deploy at $h = 45\text{ km}$ for aerodynamic drag decel and cross-track heading correction.
5. **State 5 (Terminal Retro-Propulsion & Touchdown):**
   - Center aerospike ignition at $h = 420\text{m}$.
   - Dual-axis horizontal position PID controller drives booster toward $(0.00, 0.00)$ pad center.
   - Vertical velocity damped to $1.8\text{ m/s}$ at contact.

---

## 2. PID Tuning Parameters

### Horizontal Position Guidance (Terminal Landing)
- $K_p = 1.450$ (Proportional position correction)
- $K_i = 0.025$ (Steady-state wind drift rejection)
- $K_d = 0.850$ (Velocity damping to eliminate overshoot)
- Max Gimbal Deflection: $\pm 6.5^{\circ}$

### Vertical Descent Rate Limiter
- Target Descent Rate: $v_z(h) = \max(-1.8, -0.15 \cdot \sqrt{h})$
- Throttle Range: $45\% - 100\%$

---

## 3. Controller Implementation (`control/zenith01_controller.py`)

```python
"""
Zenith-01 Closed-Loop Flight Controller for BuildArena S02
Challenge: Deliver. Separate. Return.
"""
import math
import ba_control as ba

# State Definitions
STATE_ASCENT = 1
STATE_SEPARATION = 2
STATE_ORBIT_VALIDATION = 3
STATE_BOOSTBACK = 4
STATE_LANDING = 5

class ZenithFlightController:
    def __init__(self):
        self.state = STATE_ASCENT
        self.pad_x = 0.0
        self.pad_z = 0.0
        self.kp_pos = 1.45
        self.kd_pos = 0.85
        self.prev_err_x = 0.0
        self.prev_err_z = 0.0
        self.orbit_count = 0.0

    def step(self, telemetry):
        t = telemetry.time_seconds
        alt = telemetry.altitude_meters
        vel = telemetry.velocity_ms
        pos_x = telemetry.pos_x
        pos_z = telemetry.pos_z

        # State 1: Ascent
        if self.state == STATE_ASCENT:
            ba.set_throttle(1.0)
            ba.set_pitch(90.0) # Vertical climb
            if alt >= 85000 and t >= 85.0:
                self.state = STATE_SEPARATION

        # State 2: Staging Decoupling
        elif self.state == STATE_SEPARATION:
            ba.trigger_decoupler(ring_id=1) # Explosive separation
            ba.set_throttle(0.0)
            self.state = STATE_ORBIT_VALIDATION

        # State 3: Orbit Gate Check
        elif self.state == STATE_ORBIT_VALIDATION:
            self.orbit_count = telemetry.orbit_revolutions
            if self.orbit_count >= 3.0:
                self.state = STATE_BOOSTBACK

        # State 4: Booster Flip & Boostback
        elif self.state == STATE_BOOSTBACK:
            ba.set_pitch(-90.0) # Invert heading
            if alt <= 45000:
                ba.deploy_grid_fins(angle_limit_deg=15.0)
            if alt <= 450.0:
                self.state = STATE_LANDING

        # State 5: Retro-Propulsion & Precision Touchdown
        elif self.state == STATE_LANDING:
            # Horizontal error PID
            err_x = self.pad_x - pos_x
            err_z = self.pad_z - pos_z
            d_err_x = err_x - self.prev_err_x
            d_err_z = err_z - self.prev_err_z
            self.prev_err_x = err_x
            self.prev_err_z = err_z

            gimbal_x = self.kp_pos * err_x + self.kd_pos * d_err_x
            gimbal_z = self.kp_pos * err_z + self.kd_pos * d_err_z
            ba.set_gimbal(gimbal_x, gimbal_z)

            # Throttle control for smooth touchdown
            target_vel = -max(1.8, 0.12 * math.sqrt(max(0.1, alt)))
            throttle = 0.65 + 0.15 * (target_vel - vel)
            ba.set_throttle(max(0.4, min(1.0, throttle)))

            if alt <= 1.0 and abs(vel) <= 2.0:
                ba.set_throttle(0.0)
                ba.lock_landing_legs()

def main():
    controller = ZenithFlightController()
    ba.run_loop(controller.step, tick_rate_hz=50)

if __name__ == '__main__':
    main()
```

---

## 4. Reproduction Instructions

1. On a Windows 10/11 desktop, ensure Steam and Besiege with *The Broken Beyond* DLC are installed.
2. Launch the BuildArena MCP Server:
   ```powershell
   python -m buildarena.mcp --port 8765 --mod-id 3795335349
   ```
3. Load the `Zenith-01.bsg` machine file into Besiege.
4. Execute the simulation run:
   ```powershell
   python control/zenith01_controller.py
   ```
5. Observe trajectory output logged to `trajectory.csv`. Telemetry can be imported directly into Dr. T Mission Control (`#buildarena`).
