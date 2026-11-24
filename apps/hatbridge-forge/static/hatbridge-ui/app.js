// Unbundled stub displayed only when Custom UI has not been compiled with @forge/bridge.
// Run `npm install && npm run build:ui` inside `apps/hatbridge-forge` before `forge deploy`.
const root = document.getElementById('hatbridge-forge-root');
if (root) {
  root.innerHTML = `
    <div class="hb-shell">
      <div class="hb-header">
        <div>
          <div class="hb-eyebrow">Dr. T — HatBridge Forge UI</div>
          <h1 class="hb-title">Many Hats. One Life. Nothing Important Lost.</h1>
        </div>
        <span class="hb-account">Custom UI Bundle Pending</span>
      </div>
      <section class="hb-card">
        <h2>Compile Forge Custom UI Before Deploying</h2>
        <p class="hb-muted">
          Install packages inside <code>apps/hatbridge-forge</code> and run <code>npm run build:ui</code>
          before <code>forge deploy</code> so <code>@forge/bridge</code> is bundled into <code>static/hatbridge-ui/app.js</code>.
        </p>
      </section>
    </div>
  `;
}
