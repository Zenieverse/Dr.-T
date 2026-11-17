"""
Zenith-01 Closed-Loop Flight Controller for BuildArena S02
Challenge: Deliver. Separate. Return.
"""
import math

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
        t = telemetry.get('time_seconds', 0.0)
        alt = telemetry.get('altitude_meters', 0.0)
        vel = telemetry.get('velocity_ms', 0.0)
        pos_x = telemetry.get('pos_x', 0.0)
        pos_z = telemetry.get('pos_z', 0.0)

        commands = {
            'throttle': 0.0,
            'gimbal_pitch': 0.0,
            'gimbal_yaw': 0.0,
            'trigger_decoupler': False,
            'deploy_grid_fins': False,
            'lock_legs': False,
        }

        # State 1: Ascent
        if self.state == STATE_ASCENT:
            commands['throttle'] = 1.0
            commands['gimbal_pitch'] = 0.0 # Vertical climb
            if alt >= 85000 and t >= 85.0:
                self.state = STATE_SEPARATION

        # State 2: Staging Decoupling
        elif self.state == STATE_SEPARATION:
            commands['trigger_decoupler'] = True
            commands['throttle'] = 0.0
            self.state = STATE_ORBIT_VALIDATION

        # State 3: Orbit Gate Check
        elif self.state == STATE_ORBIT_VALIDATION:
            self.orbit_count = telemetry.get('orbit_revolutions', 0.0)
            if self.orbit_count >= 3.0:
                self.state = STATE_BOOSTBACK

        # State 4: Booster Flip & Boostback
        elif self.state == STATE_BOOSTBACK:
            commands['gimbal_pitch'] = 180.0 # Invert attitude
            if alt <= 45000:
                commands['deploy_grid_fins'] = True
            if alt <= 450.0:
                self.state = STATE_LANDING

        # State 5: Retro-Propulsion & Precision Touchdown
        elif self.state == STATE_LANDING:
            commands['deploy_grid_fins'] = True
            err_x = self.pad_x - pos_x
            err_z = self.pad_z - pos_z
            d_err_x = err_x - self.prev_err_x
            d_err_z = err_z - self.prev_err_z
            self.prev_err_x = err_x
            self.prev_err_z = err_z

            commands['gimbal_pitch'] = max(-6.5, min(6.5, self.kp_pos * err_x + self.kd_pos * d_err_x))
            commands['gimbal_yaw'] = max(-6.5, min(6.5, self.kp_pos * err_z + self.kd_pos * d_err_z))

            target_vel = -max(1.8, 0.12 * math.sqrt(max(0.1, alt)))
            throttle = 0.65 + 0.15 * (target_vel - vel)
            commands['throttle'] = max(0.4, min(1.0, throttle))

            if alt <= 1.0 and abs(vel) <= 2.2:
                commands['throttle'] = 0.0
                commands['lock_legs'] = True

        return commands
