# Publication Instructions — `Zenieverse/Dr.-T` (`feat/even-g2-carecue`)

## Rules Before Applying
- Publish ONLY to branch `feat/even-g2-carecue` in `Zenieverse/Dr.-T`.
- Do NOT modify `main`.
- Do NOT overwrite, delete, or replace existing `even-g2-carecue/BUILD_VERIFICATION_HANDOFF.md`.
- Do NOT commit `PACKAGE_MANIFEST.md` or `PUBLICATION_INSTRUCTIONS.md` unless desired; remove them before `git add` if you want only the 24 project files committed.
- Do NOT force-push (`git push --force`).

## Step-by-Step Application

```bash
# 1. Clone or enter your authenticated local checkout of Zenieverse/Dr.-T
git fetch origin
git checkout feat/even-g2-carecue
git pull --ff-only origin feat/even-g2-carecue

# 2. Verify the existing handoff file is present
ls -la even-g2-carecue/BUILD_VERIFICATION_HANDOFF.md

# 3. Extract the ZIP into the repository root
unzip -o /path/to/Dr-T-CareCue-G2-GitHub-Package.zip -d .

# 4. Optionally remove packaging helper docs if you do not want them in git
rm -f PACKAGE_MANIFEST.md PUBLICATION_INSTRUCTIONS.md

# 5. Confirm BUILD_VERIFICATION_HANDOFF.md and unrelated Dr. T modules are untouched
git status
git diff -- even-g2-carecue/BUILD_VERIFICATION_HANDOFF.md

# 6. Install dependencies and run verification checks locally
npm install
npm run test:carecue
npm run test:carebridge
npm run test:hatbridge
npm run lint
npm run build:dev

# 7. Stage, commit, and push to feat/even-g2-carecue (never main)
git add even-g2-carecue README.md package.json server.impl.ts src/App.tsx src/types.ts src/components/layout/Navbar.tsx src/components/layout/CommandPalette.tsx
git commit -m "feat(carecue-g2): publish verified Even Realities G2 Telegram module and host integration"
git push origin feat/even-g2-carecue
```

## Runtime Environment Variables (Server-Side Only)
Never commit `.env` or secret values to GitHub. When running locally or deploying, set:
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_DEFAULT_CHAT_ID`
- `GEMINI_API_KEY`
