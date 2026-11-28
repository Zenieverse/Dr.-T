# Simulator & Physical Even G2 QR Pairing Guide

## 1. Built-In Browser Optical Simulator (Zero Extra Hardware Required)

1. Start the dev server: `npm run dev` (listens on port `3000`).
2. Open `http://localhost:3000/?tab=carecue-g2`.
3. Confirm the top-left HUD indicator displays **`SIMULATOR MODE`** (switching automatically to **`LIVE EVEN G2 DEVICE`** when hosted inside the native Even App WebView bridge).
4. Drive the 7-screen `576 × 288` 4-bit monochrome HUD using:
   - **On-screen R1 / Temple buttons:** `R1 Swipe Up`, `R1 Swipe Down`, `R1 Tap / Select`, `Temple Back`, `Hold Home`
   - **Keyboard shortcuts:** `↑` (`R1_PREV`), `↓` (`R1_NEXT`), `Enter` (`R1_SELECT`), `Esc` / `Backspace` (`TEMPLE_BACK`), `H` (`TEMPLE_HOLD_HOME`)
   - **Direct screen bar:** Click `01. Home` through `07. Settings` to jump directly to any screen.

---

## 2. Official Even Hub Simulator & CLI Workflow (Run on Local Machine / Codespaces)

> Note: `@evenrealities/evenhub-cli` and `@evenrealities/evenhub-simulator` are optional external developer tools from Even Realities (`https://hub.evenrealities.com`) and are not pre-installed in the browser sandbox.

### Interactive Simulator Launch

```bash
npm install -g @evenrealities/evenhub-cli @evenrealities/evenhub-simulator
npm run dev
# Point Even Hub simulator at the standalone wearable entry:
evenhub-simulator http://localhost:3000/carecue-g2
```

### Physical Even Realities G2 Pairing via QR Code

1. Expose your running port `3000` URL via HTTPS (or deploy to Cloud Run / tunnel):
   `https://<your-host>/carecue-g2`
2. Generate an Even Hub developer pairing QR code pointing to the wearable URL:

   ```bash
   evenhub qr --url "https://<your-host>/carecue-g2"
   ```

3. On your paired phone running the **Even** mobile app:
   - Open the **Even Hub** tab -> tap the **QR Scanner / Dev Prototype** control.
   - Scan the terminal QR code.
   - When the WebView loads inside the Even App, `waitForEvenAppBridge()` attaches automatically and switches CareCue from `SIMULATOR MODE` to `LIVE EVEN G2 DEVICE`.
   - Each HUD state renders onto the physical G2 waveguide via `createStartUpPageContainer()`, `rebuildPageContainer()`, and `textContainerUpgrade()`.

### Packaging for Even Hub Submission (`.ehpk`)

```bash
npm run build
evenhub login
evenhub init --from even-g2-carecue/app.json
evenhub pack even-g2-carecue/app.json dist -o carecue-g2.ehpk
```

`even-g2-carecue/app.json` configures `"target": "even_g2"`, `576x288` `monochrome_4bit`, `"entry": "/carecue-g2"`, and `"permissions": ["network"]`.
