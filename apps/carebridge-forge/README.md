# Dr. T — CareBridge Atlassian Forge App

**Competition:** Codegeist 2026 (`https://codegeist2026.devpost.com/`)  
**Track:** Apps for Specialized Industries (Healthcare Care-Navigation & Follow-Up Continuity)  
**Forge App Identity:** Separate from `apps/hatbridge-forge/` (`REPLACE_WITH_CAREBRIDGE_FORGE_REGISTER_APP_ID`)

## Modules Implemented
- `jira:issuePanel` (`carebridge-jira-issue-panel`)
- `jira:globalPage` (`carebridge-jsm-hub`)
- `jiraServiceManagement:portalRequestDetailPanel` (`carebridge-jsm-portal-panel` with `unlicensedAccess: [customer, unlicensed]`)
- `confluence:globalPage` (`carebridge-confluence-hub`)
- `confluence:contentAction` (`carebridge-confluence-knowledge-link`)
- `rovo:agent` (`carebridge-navigator`) + 4 `action` modules (`summarize-care-context`, `retrieve-care-knowledge`, `summarize-followup-tasks`, `prepare-care-handoff`)

## Official Scopes
- `read:jira-work`
- `write:jira-work`
- `read:servicedesk-request`
- `write:servicedesk-request`
- `read:page:confluence`
- `read:confluence-content.summary`
- `read:confluence-space.summary`
- `storage:app`

## Local Build & Validation
```bash
npm run build:ui
npm run typecheck
npm run validate:manifest
```

## Registration & Deployment (GitHub Codespaces / iPad Safari Workflow)
1. `cd apps/carebridge-forge && npm install`
2. `forge login`
3. `forge register` (creates a distinct Forge App ID; never reuse HatBridge's app ID)
4. `npm run build:ui && forge lint`
5. `forge deploy -e development`
6. `forge install --product jira-servicedesk` and `forge install --product confluence`
