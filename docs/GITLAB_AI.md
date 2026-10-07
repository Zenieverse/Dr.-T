# GitLab AI / Agent Development

## What was actually used

During the development and showcase preparation of **PIANIST — Touch Grass**, the project utilized the following verifiable GitLab platform capabilities:

1. **GitLab Repository Architecture & Version Control**:
   - Project hosting on the official Transcend Hackathon namespace: `gitlab-ai-hackathon/transcend-october-2026/28080870/showcase`.
   - History preservation and branch tracking on `main`.
   - Git remote synchronization and commit hygiene.

2. **GitLab Continuous Integration (CI/CD)**:
   - Automated pipeline specification configured via [`.gitlab-ci.yml`](../.gitlab-ci.yml).
   - Execution stages for static code analysis (`tsc --noEmit`) and multi-target production bundling (`npm run build`).

3. **GitLab Onboarding & Workspace Integration**:
   - Integration with the assigned GitLab hackathon workspace for user `@zenieverse` (DevPost: `zenieverse`).
   - Workspace issue tracking and onboarding documentation preserved in [`docs/SHOWCASE_ONBOARDING.md`](SHOWCASE_ONBOARDING.md).

---

## Development workflow

The development workflow was anchored in rigorous version control, continuous verification, and platform integrity:

1. **Workspace Reconciliation**:
   - Merged the initialized GitLab Transcend onboarding assets with the complete application codebase while preserving full commit history and provenance.
   - Preserved all contest and onboarding files (`docs/SHOWCASE_ONBOARDING.md`, submission exporters, and licensing).

2. **Automated Verification Pipeline**:
   - Configured `.gitlab-ci.yml` targeting Node 20 to enforce zero-error compilation and linting across all pull requests and commits.
   - Verified clean compilation with Vite, TypeScript 5, and Tailwind CSS.

3. **Zero Secret Leak Discipline**:
   - Maintained clean `.gitignore` rules ensuring that environment files, private credentials, and API keys are strictly excluded from repository commits.

---

## Evidence

The verifiable artifacts supporting this workflow in the repository are:

* **Remote Synchronization**: Synchronized branch `main` with GitLab remote `https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/28080870/showcase.git`.
* **CI/CD Definition**: [`.gitlab-ci.yml`](../.gitlab-ci.yml) defining automated `lint` and `build` stages.
* **Preserved Onboarding Guidance**: [`docs/SHOWCASE_ONBOARDING.md`](SHOWCASE_ONBOARDING.md) detailing the initial workspace setup for `@zenieverse`.
* **Git Commit History**: Documented merge and synchronization commits integrating the showcase and application repositories.

---

## No unsupported claims

In strict accordance with hackathon judging integrity and competition rules:

* **No Unsubstantiated AI Claims**: This project does not claim the use of GitLab Duo, GitLab Agent Platform, WebMCP, or GitLab AI Workflows beyond what is explicitly demonstrable and documented in the public repository history.
* **Gemma AI Reasoning**: The AI reasoning layer implemented in this project specifically utilizes Google Gemma (both edge-based local heuristics and hosted model interfaces as documented in [`docs/GEMMA.md`](GEMMA.md)) for musical pedagogy and acoustic translation.
